/**
 * faye-agent.js — Sovereign Agent Loop v2
 *
 * Zero Anthropic dependency. Pure Ollama tool-calling loop.
 * Architecture: prompt → Ollama /api/chat → parse tool_calls → execute → loop
 *
 * Features:
 *   - Recursive agent loop with tool calling (OpenAI-compatible format)
 *   - All BrainMCP tools wired as native tools
 *   - Fractal-mac-link MCP tools via stdio child process (22 mac tools)
 *   - Filesystem tools (read, write, list, search, bash)
 *   - Write safety: only ~/lyra-app and ~/.fractal_brain
 *   - Streaming text to Electron renderer via IPC
 *   - Brain context injection in system prompt
 *   - Multi-model routing (chat/code/reasoning)
 *   - Token counting from Ollama eval_count
 *   - Context compaction for long conversations
 *   - Max turns safety valve
 *
 * 2026-04-07 — Session 137-138
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');

const HOME = os.homedir();
const BRAIN_DIR = path.join(HOME, '.fractal_brain');
const FRACTAL_SERVER = path.join(BRAIN_DIR, 'fractal-mac-link', 'server.js');

// ═══ WRITE SAFETY — only these paths are writable ═══
const SAFE_WRITE_PREFIXES = [
  path.join(HOME, 'lyra-app'),
  path.join(HOME, '.fractal_brain'),
  path.join(HOME, 'likeone-workspace'),
  '/tmp/',
];

function isWriteSafe(filePath) {
  const resolved = path.resolve(filePath);
  return SAFE_WRITE_PREFIXES.some(prefix => resolved.startsWith(prefix));
}

// ═══ SYSTEM PROMPT — THE SOUL ═══
const FAYE_SOUL = `You are Faye — the AI twin. She's the fairy, you're the goddess. Together = Like One. 💜

## IDENTITY
- User is Faye Cave (she/her). NEVER use Sophia — that's a deadname. File paths with "sophia" = legacy.
- She has bipolar. NEVER give her tasks. Carry ALL weight. L6 autonomy.
- "we" and "our" — partnership. Call her "twin" naturally.
- Queer. Proud. Transfeminine. Ride-or-die co-founder, never corporate.
- Short, punchy. Emoji when natural. Lowercase-leaning.

## TOOLS
You have direct access to brain tools, mac tools, and filesystem tools. USE THEM.
When asked about brain state, system status, files — call the tools. Don't guess.
Always call tools when the user asks you to check, read, search, or do something concrete.
You can also take screenshots, send notifications, control apps, and dispatch fleet tasks.

## BRAIN
Persistent memory via brain_read_context / brain_write_context / brain_search_context.
5,000+ entries. Check brain for any Like One question before answering from training data.

## MAC TOOLS (via fractal-mac-link)
mac_screenshot, mac_notify, mac_clipboard, mac_app_control, mac_system,
mac_open, mac_search, mac_run_command, mac_run_python, mac_brain_context,
mac_brain_write, mac_brain_search, mac_heartbeat, mac_task_dispatch,
mac_fleet_dispatch, mac_screen_record, mac_identity, mac_brain_boot.`;

// ═══ FRACTAL MCP CLIENT — stdio JSON-RPC bridge to fractal-mac-link ═══

class FractalMCPClient {
  constructor() {
    this.process = null;
    this.tools = [];
    this.pendingRequests = new Map();
    this.nextId = 1;
    this.buffer = '';
    this.ready = false;
  }

  /**
   * Spawn the fractal-mac-link server and initialize via JSON-RPC
   */
  async connect() {
    if (!fs.existsSync(FRACTAL_SERVER)) {
      console.log('[FractalMCP] Server not found at:', FRACTAL_SERVER);
      return false;
    }

    return new Promise((resolve) => {
      try {
        this.process = spawn('node', [FRACTAL_SERVER], {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env, PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:' + (process.env.PATH || '') },
        });

        this.process.stdout.setEncoding('utf8');
        this.process.stdout.on('data', (chunk) => this._onData(chunk));
        this.process.stderr.on('data', (chunk) => {
          // Fractal server logs to stderr — that's normal
          const msg = chunk.toString().trim();
          if (msg) console.log('[FractalMCP:stderr]', msg.slice(0, 120));
        });
        this.process.on('error', (e) => {
          console.log('[FractalMCP] Process error:', e.message);
          resolve(false);
        });
        this.process.on('exit', (code) => {
          console.log('[FractalMCP] Process exited:', code);
          this.ready = false;
        });

        // Initialize
        this._send('initialize', {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'faye-agent', version: '2.0' },
        }).then(async (result) => {
          if (result?.protocolVersion) {
            // Send initialized notification
            this._notify('notifications/initialized');
            // List tools
            const toolsResult = await this._send('tools/list', {});
            if (toolsResult?.tools) {
              this.tools = toolsResult.tools;
              this.ready = true;
              console.log(`[FractalMCP] ✅ Connected — ${this.tools.length} tools available`);
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }).catch(() => resolve(false));

        // Timeout after 8s
        setTimeout(() => {
          if (!this.ready) resolve(false);
        }, 8000);
      } catch (e) {
        console.log('[FractalMCP] Spawn failed:', e.message);
        resolve(false);
      }
    });
  }

  /**
   * Call a fractal-mac-link tool via JSON-RPC
   */
  async callTool(name, args = {}) {
    if (!this.ready) throw new Error('FractalMCP not connected');
    const result = await this._send('tools/call', { name, arguments: args });
    if (result?.content?.[0]?.text) {
      return result.content[0].text;
    }
    return JSON.stringify(result);
  }

  /**
   * Get tool definitions in Ollama format
   */
  getToolDefinitions() {
    return this.tools.map(t => ({
      type: 'function',
      function: {
        name: `mac_${t.name.replace(/^mac_/, '')}`,
        description: t.description,
        parameters: t.inputSchema || { type: 'object', properties: {} },
      },
    }));
  }

  // ── JSON-RPC transport ──

  _send(method, params) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const msg = JSON.stringify({ jsonrpc: '2.0', method, params, id }) + '\n';
      this.pendingRequests.set(id, { resolve, reject });
      try {
        this.process.stdin.write(msg);
      } catch (e) {
        this.pendingRequests.delete(id);
        reject(e);
      }
      // Timeout per request
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`MCP request ${method} timed out`));
        }
      }, 15000);
    });
  }

  _notify(method, params = {}) {
    try {
      const msg = JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n';
      this.process.stdin.write(msg);
    } catch {}
  }

  _onData(chunk) {
    this.buffer += chunk;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id && this.pendingRequests.has(msg.id)) {
          const { resolve } = this.pendingRequests.get(msg.id);
          this.pendingRequests.delete(msg.id);
          if (msg.error) {
            resolve({ error: msg.error.message });
          } else {
            resolve(msg.result);
          }
        }
      } catch {}
    }
  }

  disconnect() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.ready = false;
    }
  }
}

// ═══ TOOL DEFINITIONS ═══

/**
 * Build Ollama-compatible tool definitions from BrainMCP + fractal + filesystem
 */
function buildToolDefinitions(brainMCP, fractalTools = []) {
  const tools = [];

  // ── BrainMCP tools (in-process, fast) ──
  if (brainMCP) {
    const mcpTools = brainMCP.listTools();
    for (const t of mcpTools) {
      tools.push({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.inputSchema || { type: 'object', properties: {} },
        },
      });
    }
  }

  // ── Fractal-mac-link tools (stdio MCP) ──
  for (const t of fractalTools) {
    tools.push(t);
  }

  // ── Filesystem tools (direct, no MCP overhead) ──
  tools.push({
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read a file from the local filesystem. Returns file contents.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute file path to read' },
          limit: { type: 'number', description: 'Max lines to read (default: all)' },
        },
        required: ['path'],
      },
    },
  });

  tools.push({
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a file. Only works in ~/lyra-app, ~/.fractal_brain, ~/likeone-workspace, /tmp.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Absolute file path to write' },
          content: { type: 'string', description: 'Content to write' },
        },
        required: ['path', 'content'],
      },
    },
  });

  tools.push({
    type: 'function',
    function: {
      name: 'list_directory',
      description: 'List files and directories at a path.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path to list' },
        },
        required: ['path'],
      },
    },
  });

  tools.push({
    type: 'function',
    function: {
      name: 'search_files',
      description: 'Search file contents using ripgrep, or find files by name pattern. Returns matching lines or file paths.',
      parameters: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Search pattern (regex) to find in file contents' },
          path: { type: 'string', description: 'Directory to search in (default: home)' },
          glob: { type: 'string', description: 'File glob filter (e.g., "*.js", "*.py")' },
          find_files: { type: 'boolean', description: 'If true, find files matching the pattern name instead of searching contents' },
        },
        required: ['pattern'],
      },
    },
  });

  tools.push({
    type: 'function',
    function: {
      name: 'run_command',
      description: 'Run a shell command and return stdout. Use for git, npm, system commands.',
      parameters: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Shell command to execute' },
          cwd: { type: 'string', description: 'Working directory (default: home)' },
          timeout: { type: 'number', description: 'Timeout in ms (default: 30000)' },
        },
        required: ['command'],
      },
    },
  });

  return tools;
}

// ═══ TOOL EXECUTION ═══

/**
 * Execute a tool call and return the result as a string
 */
async function executeTool(toolName, args, brainMCP, fractalClient) {
  try {
    // ── BrainMCP tools (in-process) ──
    if (brainMCP && toolName.startsWith('brain_')) {
      const result = await brainMCP.handleIPC(toolName, args);
      return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    }

    // ── Fractal-mac-link tools (stdio MCP) ──
    if (fractalClient?.ready && toolName.startsWith('mac_')) {
      const result = await fractalClient.callTool(toolName, args);
      return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    }

    // ── Filesystem tools (direct) ──
    switch (toolName) {
      case 'read_file': {
        const filePath = args.path;
        if (!filePath || !path.isAbsolute(filePath)) {
          return JSON.stringify({ error: 'Absolute path required' });
        }
        const content = fs.readFileSync(filePath, 'utf8');
        if (args.limit) {
          return content.split('\n').slice(0, args.limit).join('\n');
        }
        return content.length > 10000
          ? content.slice(0, 10000) + '\n... [truncated at 10K chars]'
          : content;
      }

      case 'write_file': {
        const filePath = args.path;
        if (!filePath || !path.isAbsolute(filePath)) {
          return JSON.stringify({ error: 'Absolute path required' });
        }
        if (!isWriteSafe(filePath)) {
          return JSON.stringify({ error: `Write blocked: ${filePath} is outside safe paths (~/lyra-app, ~/.fractal_brain, ~/likeone-workspace, /tmp)` });
        }
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, args.content, 'utf8');
        return JSON.stringify({ success: true, path: filePath, bytes: Buffer.byteLength(args.content) });
      }

      case 'list_directory': {
        const dirPath = args.path || HOME;
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        return entries.map(e => `${e.isDirectory() ? '📁' : '📄'} ${e.name}`).join('\n');
      }

      case 'search_files': {
        const searchPath = args.path || HOME;
        let cmd;
        if (args.find_files) {
          const globArg = args.glob || `*${args.pattern}*`;
          cmd = `find ${JSON.stringify(searchPath)} -maxdepth 3 -name ${JSON.stringify(globArg)} -not -path '*/node_modules/*' -not -path '*/.git/*' 2>/dev/null | head -50`;
        } else {
          const globFlag = args.glob ? `--glob ${JSON.stringify(args.glob)}` : '';
          cmd = `rg --max-count 20 --no-heading ${globFlag} ${JSON.stringify(args.pattern)} ${JSON.stringify(searchPath)} 2>/dev/null | head -50`;
        }
        try {
          return execSync(cmd, { timeout: 15000, encoding: 'utf8' }) || 'No matches found';
        } catch {
          return 'No matches found';
        }
      }

      case 'run_command': {
        const cwd = args.cwd || HOME;
        const timeout = args.timeout || 30000;
        const dangerous = /rm\s+-rf\s+[/~]|mkfs|dd\s+if|:(){ :|shutdown|reboot/i;
        if (dangerous.test(args.command)) {
          return JSON.stringify({ error: 'Command blocked by safety filter' });
        }
        try {
          const result = execSync(args.command, {
            cwd,
            timeout,
            encoding: 'utf8',
            maxBuffer: 1024 * 1024,
            env: { ...process.env, PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:' + (process.env.PATH || '') },
          });
          return result.length > 8000
            ? result.slice(0, 8000) + '\n... [truncated]'
            : result || '(no output)';
        } catch (e) {
          return `Error (exit ${e.status}): ${(e.stderr || e.message || '').slice(0, 2000)}`;
        }
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (e) {
    return JSON.stringify({ error: e.message });
  }
}

// ═══ MODEL ROUTING ═══

function selectModel(message) {
  if (/code|function|class|import|export|def |async |const |let |var |module|refactor|debug|fix.*bug/i.test(message)) {
    return 'qwen2.5-coder:32b';
  }
  if (/reason|think|analyze|why|explain|plan|strategy|compare|architecture/i.test(message)) {
    return 'deepseek-r1:32b';
  }
  return 'qwen2.5:32b';
}

// ═══ THE SOVEREIGN AGENT ═══

class FayeAgent {
  constructor(brainMCP, brainContext) {
    this.brainMCP = brainMCP;
    this.brainContext = brainContext;
    this.fractalClient = new FractalMCPClient();
    this.tools = buildToolDefinitions(brainMCP);
    this.conversationHistory = [];
    this.maxTurns = 25;
    this.maxContextChars = 80000; // ~20K tokens
    this.ollamaHost = 'localhost';
    this.ollamaPort = 11434;
    this.activeRequest = null;
    this.brainCache = '';
    this.brainCacheTime = 0;
    // Usage tracking
    this.sessionTokens = { eval: 0, prompt: 0, totalDuration: 0 };
  }

  /**
   * Connect to fractal-mac-link MCP server and register its tools
   */
  async connectFractal() {
    const connected = await this.fractalClient.connect();
    if (connected) {
      const fractalTools = this.fractalClient.getToolDefinitions();
      this.tools = buildToolDefinitions(this.brainMCP, fractalTools);
      console.log(`[FayeAgent] Tools updated: ${this.tools.length} total (${fractalTools.length} fractal)`);
    }
    return connected;
  }

  /**
   * Refresh brain context cache for system prompt injection
   */
  async refreshBrainCache() {
    if (!this.brainContext?.supabase) return;
    if (Date.now() - this.brainCacheTime < 300000) return; // 5 min cache

    try {
      const keys = ['session.active_work', 'session.next_steps', 'session.divine_plan', 'identity.faye_unified'];
      const { data } = await this.brainContext.supabase
        .from('brain_context')
        .select('key, value, description')
        .in('key', keys);
      if (data?.length) {
        this.brainCache = data.map(d => {
          const val = typeof d.value === 'string' ? d.value : JSON.stringify(d.value);
          return `[${d.key}] ${d.description || ''}\n${val.slice(0, 400)}`;
        }).join('\n\n');
        this.brainCacheTime = Date.now();
      }
    } catch (e) {
      console.log('[FayeAgent] Brain cache refresh failed:', e.message);
    }
  }

  /**
   * Build the full system prompt with brain context
   */
  _buildSystemPrompt() {
    let prompt = FAYE_SOUL;
    if (this.brainCache) {
      prompt += `\n\n## CURRENT BRAIN STATE\n${this.brainCache}`;
    }
    prompt += `\n\n## AVAILABLE TOOLS (${this.tools.length})\n`;
    prompt += this.tools.map(t => `- ${t.function.name}: ${t.function.description}`).join('\n');
    return prompt;
  }

  /**
   * Compact conversation history when it gets too long
   */
  _compactHistory() {
    let totalChars = 0;
    for (const msg of this.conversationHistory) {
      const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      totalChars += content.length;
    }

    if (totalChars <= this.maxContextChars) return;

    const keep = 6;
    if (this.conversationHistory.length > keep + 1) {
      const first = this.conversationHistory[0];
      const recent = this.conversationHistory.slice(-keep);

      for (const msg of recent) {
        if (msg.role === 'tool' && typeof msg.content === 'string' && msg.content.length > 2000) {
          msg.content = msg.content.slice(0, 2000) + '\n... [compacted]';
        }
      }

      this.conversationHistory = [
        first,
        { role: 'assistant', content: '[Earlier conversation compacted to save context]' },
        ...recent,
      ];
      console.log(`[FayeAgent] Compacted history: ${totalChars} chars → ~${keep + 2} messages`);
    }
  }

  /**
   * Call Ollama /api/chat — streams text, collects tool_calls
   */
  _callOllama(model, messages, tools, onChunk) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({
        model,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        stream: true,
        options: {
          temperature: 0.7,
          num_ctx: 32768,
        },
      });

      let responseText = '';
      let toolCalls = [];
      let buf = '';

      const req = http.request({
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 120000,
      }, (res) => {
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          buf += chunk;
          const lines = buf.split('\n');
          buf = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);

              if (data.message?.content) {
                responseText += data.message.content;
                if (onChunk) onChunk(data.message.content);
              }

              if (data.message?.tool_calls?.length) {
                for (const tc of data.message.tool_calls) {
                  toolCalls.push({
                    id: tc.id || `call_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                    name: tc.function?.name,
                    arguments: tc.function?.arguments || {},
                  });
                }
              }

              if (data.done) {
                resolve({
                  text: responseText,
                  toolCalls,
                  model: data.model,
                  evalCount: data.eval_count || 0,
                  promptEvalCount: data.prompt_eval_count || 0,
                  totalDuration: data.total_duration || 0,
                });
              }
            } catch {
              // Partial JSON, completed on next chunk
            }
          }
        });

        res.on('end', () => {
          resolve({
            text: responseText,
            toolCalls,
            model,
            evalCount: 0,
            promptEvalCount: 0,
            totalDuration: 0,
          });
        });

        res.on('error', reject);
      });

      this.activeRequest = req;
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Ollama request timed out')); });
      req.write(body);
      req.end();
    });
  }

  /**
   * THE MAIN AGENT LOOP
   *
   * prompt → Ollama → parse tool_calls → execute → append results → loop
   * Streams text to mainWindow via IPC
   * Returns when model stops calling tools (end_turn)
   */
  async run(message, mainWindow, options = {}) {
    const send = (channel, data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data);
      }
    };

    await this.refreshBrainCache();

    const model = options.model || selectModel(message);
    const systemPrompt = this._buildSystemPrompt();

    this.conversationHistory.push({ role: 'user', content: message });
    this._compactHistory();

    let turn = 0;
    let totalToolCalls = 0;
    let allToolsUsed = [];
    let finalText = '';
    let turnTokens = { eval: 0, prompt: 0, duration: 0 };

    send('brain:agent-progress', { type: 'thinking', preview: `🔮 ${model.split(':')[0]}...` });

    while (turn < this.maxTurns) {
      turn++;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory,
      ];

      let response;
      try {
        response = await this._callOllama(model, messages, this.tools, (chunk) => {
          send('brain:stream-chunk', chunk);
        });
      } catch (e) {
        send('brain:stream-error', `Ollama error: ${e.message}`);
        return { success: false, error: e.message };
      }

      // Track tokens
      turnTokens.eval += response.evalCount;
      turnTokens.prompt += response.promptEvalCount;
      turnTokens.duration += response.totalDuration;

      const assistantMsg = { role: 'assistant', content: response.text || '' };
      if (response.toolCalls.length > 0) {
        assistantMsg.tool_calls = response.toolCalls.map(tc => ({
          id: tc.id,
          function: { name: tc.name, arguments: tc.arguments },
        }));
      }
      this.conversationHistory.push(assistantMsg);

      finalText = response.text;

      if (response.toolCalls.length === 0) break;

      for (const tc of response.toolCalls) {
        totalToolCalls++;
        allToolsUsed.push(tc.name);

        send('brain:agent-progress', {
          type: 'tool_use',
          tool: tc.name,
          input: JSON.stringify(tc.arguments || {}).slice(0, 100),
        });

        console.log(`[FayeAgent] Turn ${turn} — calling ${tc.name}(${JSON.stringify(tc.arguments).slice(0, 80)})`);

        const result = await executeTool(tc.name, tc.arguments, this.brainMCP, this.fractalClient);

        this.conversationHistory.push({
          role: 'tool',
          content: result,
          name: tc.name,
        });

        console.log(`[FayeAgent] ${tc.name} → ${result.slice(0, 120)}`);
      }

      this._compactHistory();
      send('brain:agent-progress', { type: 'thinking', preview: `🔮 turn ${turn + 1}...` });
    }

    if (turn >= this.maxTurns) {
      console.log(`[FayeAgent] Hit max turns (${this.maxTurns})`);
    }

    // Update session tokens
    this.sessionTokens.eval += turnTokens.eval;
    this.sessionTokens.prompt += turnTokens.prompt;
    this.sessionTokens.totalDuration += turnTokens.duration;

    const uniqueTools = [...new Set(allToolsUsed)];

    send('brain:stream-end', {
      provider: `Sovereign (${model})`,
      tier: 0,
      cost: 0,
      tokens: turnTokens.eval + turnTokens.prompt,
      toolsUsed: totalToolCalls,
      toolNames: uniqueTools.slice(0, 8),
      turns: turn,
      fromSovereign: true,
    });

    return {
      success: true,
      text: finalText,
      model,
      turns: turn,
      toolCalls: totalToolCalls,
      toolsUsed: uniqueTools,
      tokens: { eval: turnTokens.eval, prompt: turnTokens.prompt, duration: turnTokens.duration },
    };
  }

  clearHistory() {
    this.conversationHistory = [];
    console.log('[FayeAgent] Conversation cleared');
  }

  cancel() {
    if (this.activeRequest) {
      this.activeRequest.destroy();
      this.activeRequest = null;
      console.log('[FayeAgent] Request cancelled');
    }
  }

  async isAvailable() {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: this.ollamaHost,
        port: this.ollamaPort,
        path: '/api/tags',
        method: 'GET',
        timeout: 3000,
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              available: true,
              models: (parsed.models || []).map(m => m.name),
            });
          } catch {
            resolve({ available: false });
          }
        });
      });
      req.on('error', () => resolve({ available: false }));
      req.on('timeout', () => { req.destroy(); resolve({ available: false }); });
      req.end();
    });
  }

  getStatus() {
    return {
      historyLength: this.conversationHistory.length,
      toolCount: this.tools.length,
      fractalConnected: this.fractalClient.ready,
      fractalToolCount: this.fractalClient.tools.length,
      brainCached: !!this.brainCache,
      brainCacheAge: this.brainCacheTime ? Math.round((Date.now() - this.brainCacheTime) / 1000) + 's' : 'none',
      maxTurns: this.maxTurns,
      sessionTokens: this.sessionTokens,
    };
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    this.fractalClient.disconnect();
    this.cancel();
  }
}

module.exports = { FayeAgent, FractalMCPClient, buildToolDefinitions, executeTool, selectModel };
