/**
 * brain-mcp.js — Local Brain MCP Server (Model Context Protocol)
 *
 * Exposes all Brain Console operations as MCP tools over stdio transport.
 * Any MCP-compatible client can connect and use brain operations:
 *   - Read/write brain_context
 *   - Manage tasks (CRUD)
 *   - Query CRM pipeline
 *   - Send emails via Edge Functions
 *   - Trigger automations (webhooks, Make.com, Vercel deploy)
 *   - Query system status, budget, providers
 *   - Run scheduler operations
 *
 * Protocol: JSON-RPC 2.0 over stdio (line-delimited JSON)
 * Spec: https://modelcontextprotocol.io/specification
 *
 * Zero AI tokens — all operations are direct Supabase/API calls.
 */

class BrainMCP {
  constructor(brainContext, brainAPI, localEngine, scheduler) {
    this.brainContext = brainContext;
    this.brainAPI = brainAPI;
    this.localEngine = localEngine;
    this.scheduler = scheduler;
    this.tools = this._registerTools();
  }

  /**
   * Fetch with timeout helper (30s default)
   */
  async fetchWithTimeout(url, opts = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...opts,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ============ TOOL REGISTRY ============

  _registerTools() {
    return {
      // ---- CONTEXT ----
      'brain_read_context': {
        description: 'Read one or all brain_context key-value pairs from Supabase.',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Specific context key to read. Omit to read all.' },
          },
        },
        annotations: { readOnlyHint: true },
        handler: async ({ key }) => {
          const ctx = await this.brainContext.getFullContext();
          if (key) {
            return ctx[key] !== undefined
              ? { key, value: ctx[key] }
              : { error: `Key not found: ${key}`, available_keys: Object.keys(ctx) };
          }
          return ctx;
        },
      },

      'brain_write_context': {
        description: 'Write a key-value pair to brain_context in Supabase.',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Context key (e.g., "sprint.status", "user.notes")' },
            value: { type: 'string', description: 'Value to store (string or JSON string)' },
          },
          required: ['key', 'value'],
        },
        annotations: { readOnlyHint: false, destructiveHint: false },
        handler: async ({ key, value }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected to Supabase');
          let parsed = value;
          try { parsed = JSON.parse(value); } catch {}
          await this.brainContext.supabase
            .from('brain_context')
            .upsert({
              key,
              value: typeof parsed === 'string' ? parsed : JSON.stringify(parsed),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });
          return { success: true, key, written_at: new Date().toISOString() };
        },
      },

      'brain_search_context': {
        description: 'Search brain_context keys and values for a query string.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term' },
          },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
        handler: async ({ query }) => {
          const ctx = await this.brainContext.getFullContext();
          const q = query.toLowerCase();
          const matches = {};
          for (const [k, v] of Object.entries(ctx)) {
            const valStr = typeof v === 'string' ? v : JSON.stringify(v);
            if (k.toLowerCase().includes(q) || valStr.toLowerCase().includes(q)) {
              matches[k] = v;
            }
          }
          return { query, matches_found: Object.keys(matches).length, results: matches };
        },
      },

      // ---- TASKS ----
      'brain_list_tasks': {
        description: 'List tasks from brain_tasks table. Optional status filter.',
        inputSchema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'running', 'scheduled', 'completed', 'failed'], description: 'Filter by status' },
            limit: { type: 'number', description: 'Max results (default 30)' },
          },
        },
        annotations: { readOnlyHint: true },
        handler: async ({ status, limit }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected');
          let query = this.brainContext.supabase
            .from('brain_tasks')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit || 30);
          if (status) query = query.eq('status', status);
          const { data, error } = await query;
          if (error) throw error;
          return { count: data?.length || 0, tasks: data || [] };
        },
      },

      'brain_create_task': {
        description: 'Create a new task in brain_tasks.',
        inputSchema: {
          type: 'object',
          properties: {
            task_type: { type: 'string', description: 'Task type (e.g., email_drip, webhook_fire, health_check, custom)' },
            description: { type: 'string', description: 'Task description' },
            status: { type: 'string', enum: ['pending', 'scheduled'], default: 'pending' },
            schedule: { type: 'string', description: 'Cron schedule (e.g., "*/5", "hourly", "daily")' },
            config: { type: 'string', description: 'JSON config for the task handler' },
          },
          required: ['task_type', 'description'],
        },
        annotations: { readOnlyHint: false },
        handler: async ({ task_type, description, status, schedule, config }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected');
          const task = {
            task_type,
            description,
            status: schedule ? 'scheduled' : (status || 'pending'),
            created_at: new Date().toISOString(),
          };
          if (schedule) {
            task.schedule = schedule;
            task.next_run = new Date().toISOString();
          }
          if (config) task.config = config;
          const { data, error } = await this.brainContext.supabase
            .from('brain_tasks').insert(task).select();
          if (error) throw error;
          return { success: true, task: data?.[0] };
        },
      },

      'brain_update_task': {
        description: 'Update a task status or fields.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Task ID (UUID)' },
            status: { type: 'string', enum: ['pending', 'running', 'scheduled', 'completed', 'failed'] },
            description: { type: 'string' },
            result: { type: 'string' },
          },
          required: ['id'],
        },
        annotations: { readOnlyHint: false },
        handler: async ({ id, ...updates }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected');
          const cleanUpdates = {};
          for (const [k, v] of Object.entries(updates)) {
            if (v !== undefined) cleanUpdates[k] = v;
          }
          if (updates.status === 'completed') cleanUpdates.completed_at = new Date().toISOString();
          const { error } = await this.brainContext.supabase
            .from('brain_tasks').update(cleanUpdates).eq('id', id);
          if (error) throw error;
          return { success: true, updated: id };
        },
      },

      // ---- CRM ----
      'brain_query_crm': {
        description: 'Query the CRM/sales pipeline from notion_sales_pipeline.',
        inputSchema: {
          type: 'object',
          properties: {
            search: { type: 'string', description: 'Search by company or contact name' },
            stage: { type: 'string', description: 'Filter by deal_stage' },
            limit: { type: 'number', description: 'Max results (default 20)' },
          },
        },
        annotations: { readOnlyHint: true },
        handler: async ({ search, stage, limit }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected');
          let query = this.brainContext.supabase
            .from('notion_sales_pipeline')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit || 20);
          if (stage) query = query.eq('deal_stage', stage);
          if (search) {
            // Sanitize search to prevent SQL injection via ilike patterns
            const safeSearch = search.replace(/[%_\\'"`;]/g, '');
            query = query.or(`company_name.ilike.%${safeSearch}%,contact_name.ilike.%${safeSearch}%`);
          }
          const { data, error } = await query;
          if (error) throw error;
          const totalValue = data?.reduce((s, d) => s + (Number(d.deal_value) || 0), 0) || 0;
          return { count: data?.length || 0, total_pipeline_value: totalValue, leads: data || [] };
        },
      },

      // ---- EMAIL ----
      'brain_send_email': {
        description: 'Send an email via Supabase Edge Function (send-welcome-email).',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: 'Recipient email address' },
            name: { type: 'string', description: 'Recipient name' },
            source: { type: 'string', description: 'Source tag (e.g., "mcp", "drip_1")' },
          },
          required: ['email'],
        },
        annotations: { readOnlyHint: false, openWorldHint: true },
        handler: async ({ email, name, source }) => {
          const supabaseUrl = this.brainContext.getConfig().supabaseUrl;
          if (!supabaseUrl) throw new Error('Supabase URL not configured');
          const res = await this.fetchWithTimeout(`${supabaseUrl}/functions/v1/send-welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name: name || '', source: source || 'mcp' }),
          });
          return await res.json();
        },
      },

      'brain_email_log': {
        description: 'Get recent email activity from notification_log.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Max results (default 20)' },
          },
        },
        annotations: { readOnlyHint: true },
        handler: async ({ limit }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected');
          const { data, error } = await this.brainContext.supabase
            .from('notification_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit || 20);
          if (error) throw error;
          return { count: data?.length || 0, emails: data || [] };
        },
      },

      // ---- AUTOMATIONS ----
      'brain_fire_webhook': {
        description: 'Fire a webhook (POST) to any URL. Used for Make.com, Zapier, n8n triggers.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'Webhook URL' },
            body: { type: 'string', description: 'JSON body to send' },
          },
          required: ['url'],
        },
        annotations: { readOnlyHint: false, openWorldHint: true },
        handler: async ({ url, body }) => {
          // SSRF protection: reject internal/private IPs
          try {
            const parsed = new URL(url);
            const host = parsed.hostname;
            if (/^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.0\.0\.0|::1|\[::1\])/.test(host)) {
              throw new Error('Cannot webhook to internal/private addresses (SSRF protection)');
            }
            if (!['http:', 'https:'].includes(parsed.protocol)) {
              throw new Error('Only HTTP/HTTPS URLs allowed');
            }
          } catch (e) {
            if (e.message.includes('SSRF') || e.message.includes('Only HTTP')) throw e;
            throw new Error(`Invalid URL: ${url}`);
          }
          let payload = {};
          if (body) { try { payload = JSON.parse(body); } catch { payload = { message: body }; } }
          const res = await this.fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          return { status: res.status, response: await res.text() };
        },
      },

      'brain_deploy_vercel': {
        description: 'Trigger a Vercel deployment via deploy hook URL.',
        inputSchema: {
          type: 'object',
          properties: {
            hook_url: { type: 'string', description: 'Vercel deploy hook URL. If omitted, uses stored hook.' },
          },
        },
        annotations: { readOnlyHint: false, openWorldHint: true },
        handler: async ({ hook_url }) => {
          const url = hook_url || this.brainContext.getConfig().vercelDeployHook;
          if (!url) throw new Error('No deploy hook URL. Pass hook_url or set via /deploy set-hook <url>');
          const res = await this.fetchWithTimeout(url, { method: 'POST' });
          return await res.json();
        },
      },

      'brain_make_scenario': {
        description: 'Manage Make.com scenarios: list, status, activate, deactivate, or run.',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['list', 'status', 'activate', 'deactivate', 'run'], description: 'Action to perform' },
            scenario_id: { type: 'string', description: 'Scenario ID (required for status/activate/deactivate/run)' },
            data: { type: 'string', description: 'JSON data payload for run action' },
          },
          required: ['action'],
        },
        annotations: { readOnlyHint: false, openWorldHint: true },
        handler: async ({ action, scenario_id, data }) => {
          const apiKey = this.brainContext.getConfig().makeApiKey;
          if (!apiKey) throw new Error('Make.com API key not configured. Use /make set-key <key>');
          const baseUrl = 'https://us2.make.com/api/v2';
          const headers = {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json',
          };

          if (action === 'list') {
            const res = await this.fetchWithTimeout(`${baseUrl}/scenarios?pg[limit]=20`, { headers });
            return await res.json();
          }
          if (!scenario_id) throw new Error('scenario_id required for this action');

          switch (action) {
            case 'status': {
              const res = await this.fetchWithTimeout(`${baseUrl}/scenarios/${scenario_id}`, { headers });
              return await res.json();
            }
            case 'activate': {
              const res = await this.fetchWithTimeout(`${baseUrl}/scenarios/${scenario_id}/activate`, { method: 'POST', headers });
              return await res.json();
            }
            case 'deactivate': {
              const res = await this.fetchWithTimeout(`${baseUrl}/scenarios/${scenario_id}/deactivate`, { method: 'POST', headers });
              return await res.json();
            }
            case 'run': {
              let payload = {};
              if (data) { try { payload = JSON.parse(data); } catch { payload = {}; } }
              const res = await this.fetchWithTimeout(`${baseUrl}/scenarios/${scenario_id}/run`, {
                method: 'POST', headers,
                body: JSON.stringify({ data: payload }),
              });
              return await res.json();
            }
            default:
              throw new Error(`Unknown action: ${action}`);
          }
        },
      },

      'brain_edge_function': {
        description: 'Call any Supabase Edge Function by name.',
        inputSchema: {
          type: 'object',
          properties: {
            function_name: { type: 'string', description: 'Edge Function name (e.g., "send-welcome-email")' },
            body: { type: 'string', description: 'JSON body to send' },
          },
          required: ['function_name'],
        },
        annotations: { readOnlyHint: false, openWorldHint: true },
        handler: async ({ function_name, body }) => {
          const supabaseUrl = this.brainContext.getConfig().supabaseUrl;
          if (!supabaseUrl) throw new Error('Supabase URL not configured');
          let payload = {};
          if (body) { try { payload = JSON.parse(body); } catch { payload = { raw: body }; } }
          const res = await this.fetchWithTimeout(`${supabaseUrl}/functions/v1/${function_name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const text = await res.text();
          try { return JSON.parse(text); } catch { return { status: res.status, response: text }; }
        },
      },

      // ---- SYSTEM ----
      'brain_status': {
        description: 'Get full system status: connection, tasks, budget, provider info.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        handler: async () => {
          const status = await this.brainContext.getSystemStatus();
          const budget = this.brainAPI?.getBudget();
          const provider = await this.brainAPI?.detectBestProvider();
          return {
            connected: status.connected,
            pending_tasks: status.pendingTasks || 0,
            active_provider: provider?.name || 'None',
            budget: budget || {},
            scheduler_running: this.scheduler?.running || false,
            recent_executions: this.scheduler?.getRecentExecutions()?.length || 0,
          };
        },
      },

      'brain_budget': {
        description: 'Get current token budget usage and cost estimates.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        handler: async () => {
          const budget = this.brainAPI?.getBudget();
          if (!budget) return { error: 'Budget tracking not available' };
          return budget;
        },
      },

      'brain_providers': {
        description: 'List available AI providers and their status.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        handler: async () => {
          const providers = this.brainAPI?.getProviders() || {};
          const ollama = await this.brainAPI?.checkOllama();
          const config = this.brainContext.getConfig();
          return {
            active: config.aiProvider,
            ollama: ollama || { available: false },
            groq: { configured: !!config.groqKey },
            openrouter: { configured: !!config.openrouterKey },
            anthropic: { configured: !!config.anthropicKey },
            providers,
          };
        },
      },

      'brain_scheduler_status': {
        description: 'Get scheduler status: running state, recent executions, due tasks.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        handler: async () => {
          if (!this.scheduler) return { error: 'Scheduler not initialized' };
          return {
            running: this.scheduler.running,
            recent_executions: this.scheduler.getRecentExecutions(),
            registered_handlers: Object.keys(this.scheduler.handlers),
          };
        },
      },

      // ---- SEARCH ----
      'brain_search': {
        description: 'Search across all brain tables: context, tasks, CRM, notifications.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
        annotations: { readOnlyHint: true },
        handler: async ({ query }) => {
          if (!this.brainContext.supabase) throw new Error('Not connected');
          const q = query.toLowerCase();

          const [ctxRes, tasksRes, crmRes, emailsRes] = await Promise.all([
            this.brainContext.getFullContext(),
            this.brainContext.supabase.from('brain_tasks').select('*').limit(50),
            this.brainContext.supabase.from('notion_sales_pipeline').select('*').limit(50),
            this.brainContext.supabase.from('notification_log').select('*').limit(50),
          ]);

          const results = { context: {}, tasks: [], crm: [], emails: [] };

          // Search context
          for (const [k, v] of Object.entries(ctxRes)) {
            const valStr = typeof v === 'string' ? v : JSON.stringify(v);
            if (k.toLowerCase().includes(q) || valStr.toLowerCase().includes(q)) {
              results.context[k] = v;
            }
          }

          // Search tasks
          if (tasksRes.data) {
            results.tasks = tasksRes.data.filter(t =>
              JSON.stringify(t).toLowerCase().includes(q)
            );
          }

          // Search CRM
          if (crmRes.data) {
            results.crm = crmRes.data.filter(l =>
              JSON.stringify(l).toLowerCase().includes(q)
            );
          }

          // Search emails
          if (emailsRes.data) {
            results.emails = emailsRes.data.filter(e =>
              JSON.stringify(e).toLowerCase().includes(q)
            );
          }

          const totalMatches = Object.keys(results.context).length +
            results.tasks.length + results.crm.length + results.emails.length;

          return { query, total_matches: totalMatches, results };
        },
      },

      // ---- INTROSPECTION ----
      'brain_introspect': {
        description: 'Deep self-analysis: capabilities, limits, autonomy level, growth opportunities.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        handler: async () => {
          const config = this.brainContext.getConfig();
          const status = await this.brainContext.getSystemStatus();
          const provider = await this.brainAPI?.detectBestProvider();
          const ctx = await this.brainContext.getFullContext();

          return {
            context_keys: Object.keys(ctx),
            context_count: Object.keys(ctx).length,
            connected: status.connected,
            active_provider: provider?.name || 'None',
            capabilities_without_ai: [
              'Read/write brain_context',
              'Manage tasks (CRUD)',
              'Query CRM pipeline',
              'Search across all tables',
              'Generate reports and analytics',
              'Fire webhooks',
              'Send emails via Edge Functions',
              'Deploy to Vercel via hooks',
              'Manage Make.com scenarios via API',
              'Schedule recurring tasks (cron)',
              'Track token budget',
              'Self-assess autonomy level',
            ],
            capabilities_requiring_ai: [
              'Complex reasoning and analysis',
              'Creative writing',
              'Code generation',
              'Strategy and planning',
              'Multi-step orchestration',
            ],
            mcp_tools_available: Object.keys(this.tools).length,
          };
        },
      },

      // ---- EXECUTE SLASH COMMAND ----
      'brain_execute_command': {
        description: 'Execute any Brain Console slash command (e.g., "/status", "/crm", "/report"). Returns the formatted result.',
        inputSchema: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'Slash command to execute (e.g., "/status", "/tasks pending", "/crm acme")' },
          },
          required: ['command'],
        },
        annotations: { readOnlyHint: false },
        handler: async ({ command }) => {
          const msg = command.startsWith('/') ? command : `/${command}`;
          const result = await this.localEngine.tryHandle(msg);
          if (result.handled) {
            return { success: true, output: result.response };
          }
          return { success: false, error: `Command not recognized: ${msg}` };
        },
      },
    };
  }

  // ============ MCP PROTOCOL HANDLERS ============

  /**
   * Handle an incoming JSON-RPC 2.0 request
   */
  async handleRequest(request) {
    const { method, params, id } = request;

    switch (method) {
      case 'initialize':
        return this._respond(id, {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
          },
          serverInfo: {
            name: 'brain-console-mcp',
            version: '2.0.0',
          },
        });

      case 'notifications/initialized':
        return null; // No response for notifications

      case 'tools/list':
        return this._respond(id, {
          tools: Object.entries(this.tools).map(([name, tool]) => ({
            name,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations,
          })),
        });

      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        const tool = this.tools[toolName];

        if (!tool) {
          return this._respondError(id, -32602, `Unknown tool: ${toolName}`);
        }

        try {
          const result = await tool.handler(toolArgs);
          return this._respond(id, {
            content: [{
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            }],
          });
        } catch (error) {
          return this._respond(id, {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: error.message }),
            }],
            isError: true,
          });
        }
      }

      case 'ping':
        return this._respond(id, {});

      default:
        return this._respondError(id, -32601, `Method not found: ${method}`);
    }
  }

  /**
   * Start stdio transport — reads JSON-RPC from stdin, writes to stdout
   */
  startStdio() {
    let buffer = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;

      // Process complete messages (line-delimited JSON)
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete last line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const request = JSON.parse(trimmed);
          const response = await this.handleRequest(request);
          if (response) {
            process.stdout.write(JSON.stringify(response) + '\n');
          }
        } catch (parseErr) {
          const errResponse = {
            jsonrpc: '2.0',
            error: { code: -32700, message: 'Parse error' },
            id: null,
          };
          process.stdout.write(JSON.stringify(errResponse) + '\n');
        }
      }
    });

    console.error('[BrainMCP] stdio transport started');
  }

  /**
   * Handle a single request from Electron IPC (in-process mode)
   * This allows the Electron app itself to use MCP tools internally
   */
  async handleIPC(toolName, args = {}) {
    const tool = this.tools[toolName];
    if (!tool) throw new Error(`Unknown MCP tool: ${toolName}`);
    return await tool.handler(args);
  }

  /**
   * Get list of all registered tools (for UI/discovery)
   */
  listTools() {
    return Object.entries(this.tools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
    }));
  }

  // ============ JSON-RPC HELPERS ============

  _respond(id, result) {
    return { jsonrpc: '2.0', result, id };
  }

  _respondError(id, code, message) {
    return { jsonrpc: '2.0', error: { code, message }, id };
  }
}

module.exports = { BrainMCP };
