/**
 * brain-agent.js — Agentic Task Chain Engine
 *
 * Executes multi-step task chains autonomously using the local engine,
 * knowledge base, and AI providers. Zero tokens for local steps,
 * smart-routed tokens only when AI judgment is needed.
 *
 * Features:
 *   - Define multi-step task chains with conditional branching
 *   - Each step can use: local commands, MCP tools, AI inference, or custom logic
 *   - Steps can pass data to subsequent steps via context
 *   - Automatic retry with exponential backoff
 *   - Progress streaming to UI
 *   - Execution history and audit trail
 *   - Built-in chain templates for common workflows
 */

const Store = require('electron-store');

class BrainAgent {
  constructor(brainContext, brainAPI, localEngine, brainMCP, brainKnowledge) {
    this.brainContext = brainContext;
    this.brainAPI = brainAPI;
    this.localEngine = localEngine;
    this.brainMCP = brainMCP;
    this.knowledge = brainKnowledge;
    this.store = new Store({ name: 'brain-console-agent' });
    this.activeChains = new Map();
    this.history = this.store.get('chain_history', []);
    this.progressCallback = null;
    this.templates = this._registerTemplates();
  }

  /**
   * Set callback for streaming progress updates to UI
   */
  onProgress(callback) {
    this.progressCallback = callback;
  }

  // ============ CHAIN EXECUTION ============

  /**
   * Run a task chain
   * @param {object} chain - { name, steps: [...], context: {} }
   *   Each step: { type, action, args, condition?, onSuccess?, onFailure?, retries? }
   *   Types: 'command' (local), 'mcp' (brain MCP), 'ai' (uses tokens), 'logic' (JS expression)
   */
  async run(chain) {
    const chainId = `chain_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const execution = {
      id: chainId,
      name: chain.name || 'Unnamed chain',
      steps: chain.steps,
      context: { ...chain.context },
      status: 'running',
      started_at: new Date().toISOString(),
      results: [],
      current_step: 0,
    };

    this.activeChains.set(chainId, execution);
    this._emitProgress(chainId, 'started', { name: execution.name, total_steps: chain.steps.length });

    try {
      for (let i = 0; i < chain.steps.length; i++) {
        execution.current_step = i;
        const step = chain.steps[i];

        // Check condition (if present)
        if (step.condition) {
          const conditionMet = this._evaluateCondition(step.condition, execution.context);
          if (!conditionMet) {
            execution.results.push({ step: i, skipped: true, reason: 'Condition not met' });
            this._emitProgress(chainId, 'step_skipped', { step: i, name: step.name || step.action });
            continue;
          }
        }

        this._emitProgress(chainId, 'step_start', {
          step: i,
          total: chain.steps.length,
          name: step.name || step.action,
          type: step.type,
        });

        // Execute step with retry
        const maxRetries = step.retries || 0;
        let result = null;
        let lastError = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            result = await this._executeStep(step, execution.context);
            lastError = null;
            break;
          } catch (err) {
            lastError = err;
            if (attempt < maxRetries) {
              const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
              this._emitProgress(chainId, 'step_retry', { step: i, attempt: attempt + 1, delay });
              await this._sleep(delay);
            }
          }
        }

        if (lastError) {
          // Step failed after all retries
          const stepResult = { step: i, error: lastError.message, failed: true };
          execution.results.push(stepResult);
          this._emitProgress(chainId, 'step_error', { step: i, error: lastError.message });

          // Handle failure
          if (step.onFailure === 'skip') continue;
          if (step.onFailure === 'abort') break;
          // Default: abort on failure
          break;
        }

        // Store result in chain context for subsequent steps
        const stepKey = step.outputKey || `step_${i}_result`;
        execution.context[stepKey] = result;
        execution.results.push({ step: i, success: true, result, key: stepKey });
        this._emitProgress(chainId, 'step_complete', { step: i, name: step.name || step.action });

        // Follow onSuccess branch if specified
        if (step.onSuccess && typeof step.onSuccess === 'number') {
          i = step.onSuccess - 1; // -1 because loop will increment
        }
      }

      const failed = execution.results.some(r => r.failed);
      execution.status = failed ? 'partial' : 'completed';
    } catch (err) {
      execution.status = 'failed';
      execution.error = err.message;
    }

    execution.completed_at = new Date().toISOString();
    execution.elapsed_ms = Date.now() - new Date(execution.started_at).getTime();
    this.activeChains.delete(chainId);

    // Persist to history
    this.history.unshift({
      id: execution.id,
      name: execution.name,
      status: execution.status,
      steps_total: chain.steps.length,
      steps_completed: execution.results.filter(r => r.success).length,
      elapsed_ms: execution.elapsed_ms,
      timestamp: execution.started_at,
    });
    if (this.history.length > 50) this.history = this.history.slice(0, 50);
    this.store.set('chain_history', this.history);

    this._emitProgress(chainId, 'chain_complete', {
      status: execution.status,
      elapsed: execution.elapsed_ms,
    });

    return execution;
  }

  /**
   * Execute a single step
   */
  async _executeStep(step, context) {
    // Interpolate variables in args: {{key}} → context[key]
    const args = this._interpolate(step.args || '', context);

    switch (step.type) {
      case 'command': {
        // Local engine slash command
        const cmd = this._interpolate(step.action, context);
        const result = await this.localEngine.tryHandle(cmd.startsWith('/') ? cmd : `/${cmd}`);
        if (!result.handled) throw new Error(`Command not handled: ${cmd}`);
        return result.response;
      }

      case 'mcp': {
        // Brain MCP tool call
        let toolArgs = {};
        if (typeof args === 'string') {
          try { toolArgs = JSON.parse(args); } catch { toolArgs = { query: args }; }
        } else {
          toolArgs = args;
        }
        // Interpolate within tool args
        for (const [k, v] of Object.entries(toolArgs)) {
          if (typeof v === 'string') toolArgs[k] = this._interpolate(v, context);
        }
        return await this.brainMCP.handleIPC(step.action, toolArgs);
      }

      case 'ai': {
        // AI inference (uses tokens — smart routed)
        const prompt = this._interpolate(step.action, context);

        // Optionally inject RAG context from knowledge base
        let fullPrompt = prompt;
        if (this.knowledge && step.useKnowledge !== false) {
          const ragContext = this.knowledge.generateRAGContext(prompt, 600);
          if (ragContext) fullPrompt = ragContext + '\n' + prompt;
        }

        const response = await this.brainAPI.sendMessage(fullPrompt);
        return response.text || response;
      }

      case 'logic': {
        // Evaluate a simple expression against context
        // Supports: comparison, math, string ops
        return this._evaluateExpression(step.action, context);
      }

      case 'wait': {
        // Wait for a duration (ms)
        const ms = parseInt(args) || parseInt(step.action) || 1000;
        await this._sleep(ms);
        return { waited: ms };
      }

      case 'store': {
        // Store a value in brain_context
        const key = step.action;
        const value = this._interpolate(step.value || args, context);
        if (this.brainContext.supabase) {
          await this.brainContext.supabase
            .from('brain_context')
            .upsert({
              key,
              value: typeof value === 'string' ? value : JSON.stringify(value),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });
        }
        return { stored: key };
      }

      case 'knowledge': {
        // Search or add to knowledge base
        if (step.action === 'search') {
          return this.knowledge?.search(args, 5) || [];
        } else if (step.action === 'add') {
          const entry = typeof args === 'string' ? JSON.parse(args) : args;
          return await this.knowledge?.add(entry);
        }
        throw new Error(`Unknown knowledge action: ${step.action}`);
      }

      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  // ============ BUILT-IN CHAIN TEMPLATES ============

  _registerTemplates() {
    return {
      'daily-report': {
        name: 'Daily Report Chain',
        description: 'Generate comprehensive daily report → store in context → optionally email',
        steps: [
          { type: 'command', action: '/report', name: 'Generate report', outputKey: 'report' },
          { type: 'command', action: '/crm', name: 'Get CRM data', outputKey: 'crm_data' },
          { type: 'command', action: '/budget', name: 'Check budget', outputKey: 'budget' },
          {
            type: 'store', action: 'reports.daily_latest',
            value: '{{report}}', name: 'Store report',
          },
        ],
      },

      'lead-nurture': {
        name: 'Lead Nurture Chain',
        description: 'Check CRM → find hot leads → trigger email drip → log activity',
        steps: [
          { type: 'mcp', action: 'brain_query_crm', args: '{"stage":"qualified"}', name: 'Find qualified leads', outputKey: 'leads' },
          {
            type: 'logic', action: 'leads.count > 0',
            name: 'Check if leads exist', outputKey: 'has_leads',
          },
          {
            type: 'command', action: '/email stats',
            name: 'Check email stats', condition: '{{has_leads}}', outputKey: 'email_stats',
          },
        ],
      },

      'health-check': {
        name: 'System Health Chain',
        description: 'Check all systems → log results → alert if issues',
        steps: [
          { type: 'mcp', action: 'brain_status', args: '{}', name: 'Get system status', outputKey: 'status' },
          { type: 'mcp', action: 'brain_providers', args: '{}', name: 'Check providers', outputKey: 'providers' },
          { type: 'mcp', action: 'brain_scheduler_status', args: '{}', name: 'Check scheduler', outputKey: 'scheduler' },
          { type: 'command', action: '/budget', name: 'Check budget', outputKey: 'budget' },
          {
            type: 'store', action: 'system.last_health_chain',
            value: 'Health chain completed at {{timestamp}}', name: 'Log completion',
          },
        ],
      },

      'knowledge-sync': {
        name: 'Knowledge Sync Chain',
        description: 'Import brain_context into knowledge base → rebuild index',
        steps: [
          { type: 'knowledge', action: 'search', args: '*', name: 'Check current KB', outputKey: 'current_kb' },
          { type: 'command', action: '/context', name: 'Get all context', outputKey: 'context' },
        ],
      },

      'evolution': {
        name: 'Self-Evolution Chain',
        description: 'Assess autonomy → introspect → log improvements → schedule next cycle',
        steps: [
          { type: 'command', action: '/autonomy', name: 'Assess autonomy', outputKey: 'autonomy' },
          { type: 'command', action: '/introspect', name: 'Deep introspection', outputKey: 'introspection' },
          { type: 'command', action: '/self', name: 'Self-report', outputKey: 'self_report' },
          {
            type: 'store', action: 'system.evolution_latest',
            value: '{{autonomy}}', name: 'Store evolution data',
          },
        ],
      },
    };
  }

  /**
   * Run a built-in template chain
   */
  async runTemplate(templateName, overrides = {}) {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Unknown template: ${templateName}. Available: ${Object.keys(this.templates).join(', ')}`);
    }
    return await this.run({
      ...template,
      ...overrides,
      context: { timestamp: new Date().toISOString(), ...overrides.context },
    });
  }

  /**
   * List available templates
   */
  listTemplates() {
    return Object.entries(this.templates).map(([id, t]) => ({
      id,
      name: t.name,
      description: t.description,
      steps: t.steps.length,
    }));
  }

  // ============ STATUS ============

  getStatus() {
    return {
      active_chains: Array.from(this.activeChains.values()).map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        current_step: c.current_step,
        total_steps: c.steps.length,
      })),
      history: this.history.slice(0, 10),
      templates_available: Object.keys(this.templates).length,
    };
  }

  // ============ HELPERS ============

  _interpolate(template, context) {
    if (typeof template !== 'string') return template;
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
      const parts = path.split('.');
      let val = context;
      for (const p of parts) {
        if (val == null) return `{{${path}}}`;
        val = val[p];
      }
      if (val == null) return `{{${path}}}`;
      return typeof val === 'string' ? val : JSON.stringify(val);
    });
  }

  _evaluateCondition(condition, context) {
    const interpolated = this._interpolate(condition, context);
    // Simple truthy check
    if (interpolated === 'true' || interpolated === '1') return true;
    if (interpolated === 'false' || interpolated === '0' || interpolated === '') return false;
    // Check if it's a comparison
    const match = interpolated.match(/^(.+?)\s*(>|<|>=|<=|==|!=)\s*(.+)$/);
    if (match) {
      const [, left, op, right] = match;
      const l = isNaN(left) ? left.trim() : Number(left);
      const r = isNaN(right) ? right.trim() : Number(right);
      switch (op) {
        case '>': return l > r;
        case '<': return l < r;
        case '>=': return l >= r;
        case '<=': return l <= r;
        case '==': return l == r;
        case '!=': return l != r;
      }
    }
    return !!interpolated;
  }

  _evaluateExpression(expr, context) {
    const interpolated = this._interpolate(expr, context);
    // Simple math or string return
    try {
      const num = Number(interpolated);
      if (!isNaN(num)) return num;
    } catch {}
    return interpolated;
  }

  _emitProgress(chainId, event, data) {
    if (this.progressCallback) {
      this.progressCallback({ chainId, event, ...data, timestamp: new Date().toISOString() });
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { BrainAgent };
