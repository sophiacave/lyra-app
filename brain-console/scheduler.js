/**
 * scheduler.js — Autonomous task scheduler (Phase 2 / L5)
 *
 * Runs inside the Electron main process. Polls brain_actions for scheduled work,
 * executes handlers, and logs results. No AI tokens for execution — only if
 * an action explicitly requires AI.
 *
 * Built-in action types:
 *   - email_drip       → Fires Supabase Edge Function for email sequences
 *   - webhook_fire     → POSTs to a webhook URL (Make.com, etc.)
 *   - context_refresh  → Reloads brain_context from Supabase
 *   - health_check     → Pings all systems, logs status
 *   - report_generate  → Generates daily report, stores in brain_context
 *   - evolution_cycle  → Self-assessment + logs improvement tasks
 *   - vercel_deploy    → Triggers Vercel deploy hook
 *   - make_scenario    → Manages Make.com scenarios via API
 *
 * Scheduling via brain_actions table:
 *   { action_type, status: 'scheduled', payload: { schedule: 'every5min' }, created_at: ISO }
 */

const Store = require('electron-store');

class Scheduler {
  constructor(brainContext, brainAPI) {
    this.brainContext = brainContext;
    this.brainAPI = brainAPI;
    this.store = new Store({ name: 'brain-console-scheduler' });
    this.interval = null;
    this.running = false;
    this.handlers = {};
    this.log = [];

    this._registerBuiltinHandlers();
  }

  /**
   * Start the scheduler loop (checks every 60 seconds)
   */
  start(intervalMs = 60000) {
    if (this.running) return;
    this.running = true;
    console.log('[Scheduler] Started — checking every', intervalMs / 1000, 'seconds');

    // Run immediately, then on interval
    this._tick();
    this.interval = setInterval(() => this._tick(), intervalMs);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.running = false;
    console.log('[Scheduler] Stopped');
  }

  /**
   * Register a custom task handler
   */
  registerHandler(taskType, handler) {
    this.handlers[taskType] = handler;
  }

  /**
   * Cleanup zombie actions stuck in 'running' for >10 minutes
   */
  async _cleanupZombieTasks() {
    if (!this.brainContext.supabase) return;

    try {
      const tenMinutesAgo = new Date(Date.now() - 600000).toISOString();

      // Find actions stuck in running state
      const { data: zombieTasks } = await this.brainContext.supabase
        .from('brain_actions')
        .select('*')
        .eq('status', 'running')
        .lte('updated_at', tenMinutesAgo)
        .limit(20);

      if (zombieTasks?.length) {
        console.log(`[Scheduler] Found ${zombieTasks.length} zombie action(s) — resetting`);

        for (const task of zombieTasks) {
          // Reset recurring actions back to scheduled (check payload.schedule)
          const payload = this._parsePayload(task.payload);
          if (payload.schedule) {
            await this._updateTask(task.id, {
              status: 'scheduled',
              result: JSON.stringify({ error: 'Action reset after timeout' }),
            });
          } else {
            // Mark one-shot actions as failed
            await this._updateTask(task.id, {
              status: 'failed',
              result: JSON.stringify({ error: 'Action execution timeout (>10 min)' }),
            });
          }
        }
      }
    } catch (err) {
      console.error('[Scheduler] Cleanup error:', err.message);
    }
  }

  /**
   * Parse payload — supports JSON string or object
   */
  _parsePayload(payload) {
    if (!payload) return {};
    if (typeof payload === 'object') return payload;
    try { return JSON.parse(payload); } catch { return {}; }
  }

  /**
   * Main tick — check for due tasks and execute them
   */
  async _tick() {
    if (!this.brainContext.supabase) return;

    try {
      const now = new Date().toISOString();

      // 0. Cleanup zombie tasks (every tick)
      await this._cleanupZombieTasks();

      // 1. Get scheduled actions that are due (created_at in the past, status=scheduled)
      const { data: dueTasks, error } = await this.brainContext.supabase
        .from('brain_actions')
        .select('*')
        .eq('status', 'scheduled')
        .lte('created_at', now)
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) {
        console.error('[Scheduler] Query error:', error.message);
        return;
      }

      if (!dueTasks?.length) return;

      console.log(`[Scheduler] ${dueTasks.length} action(s) due`);

      // 2. Execute each action
      for (const task of dueTasks) {
        await this._executeTask(task);
      }

      // 3. Also check for pending (one-shot) actions
      const { data: pendingTasks } = await this.brainContext.supabase
        .from('brain_actions')
        .select('*')
        .eq('status', 'pending')
        .limit(5);

      if (pendingTasks?.length) {
        for (const task of pendingTasks) {
          await this._executeTask(task);
        }
      }
    } catch (err) {
      console.error('[Scheduler] Tick error:', err.message);
    }
  }

  /**
   * Execute a single action
   */
  async _executeTask(task) {
    const handler = this.handlers[task.action_type];
    if (!handler) {
      console.log(`[Scheduler] No handler for action type: ${task.action_type}`);
      await this._updateTask(task.id, {
        status: 'failed',
        result: JSON.stringify({ error: `No handler for: ${task.action_type}` }),
      });
      return;
    }

    // Mark as running
    await this._updateTask(task.id, { status: 'running' });
    const startTime = Date.now();

    try {
      // Parse action payload
      const config = this._parsePayload(task.payload);

      // Execute
      const result = await handler(config, task, this);

      const elapsed = Date.now() - startTime;
      console.log(`[Scheduler] ✅ ${task.action_type} completed in ${elapsed}ms`);

      // If recurring (payload has schedule), keep as scheduled
      if (config.schedule) {
        await this._updateTask(task.id, {
          status: 'scheduled',
          result: JSON.stringify(result),
        });
      } else {
        // One-shot action — mark as completed
        await this._updateTask(task.id, {
          status: 'completed',
          result: JSON.stringify(result),
        });
      }

      this._logExecution(task, 'success', result, elapsed);
    } catch (err) {
      const elapsed = Date.now() - startTime;
      console.error(`[Scheduler] ❌ ${task.action_type} failed:`, err.message);

      // For recurring actions, keep them scheduled for next attempt
      const config = this._parsePayload(task.payload);
      if (config.schedule) {
        await this._updateTask(task.id, {
          status: 'scheduled',
          result: JSON.stringify({ error: err.message }),
        });
      } else {
        // One-shot action — mark as failed
        await this._updateTask(task.id, {
          status: 'failed',
          result: JSON.stringify({ error: err.message }),
        });
      }

      this._logExecution(task, 'error', { error: err.message }, elapsed);
    }
  }

  async _updateTask(id, updates) {
    await this.brainContext.supabase
      .from('brain_actions')
      .update(updates)
      .eq('id', id);
  }

  _logExecution(task, status, result, elapsed) {
    const entry = {
      task_type: task.action_type,
      task_id: task.id,
      status,
      result: typeof result === 'string' ? result : JSON.stringify(result).slice(0, 200),
      elapsed_ms: elapsed,
      timestamp: new Date().toISOString(),
    };
    this.log.unshift(entry);
    if (this.log.length > 100) this.log = this.log.slice(0, 100);

    // Persist last 20 executions
    this.store.set('recent_executions', this.log.slice(0, 20));
  }

  getRecentExecutions() {
    return this.store.get('recent_executions', []);
  }

  /**
   * Simple cron-like parser (supports: star-slash-N for every N minutes, hourly, daily)
   */
  _calculateNextRun(schedule) {
    const now = new Date();

    // Match */N pattern (every N minutes)
    const everyNMin = schedule.match(/^\*\/(\d+)/);
    if (everyNMin) {
      const minutes = parseInt(everyNMin[1]);
      return new Date(now.getTime() + minutes * 60000).toISOString();
    }

    // Named schedules
    switch (schedule) {
      case 'hourly':
        return new Date(now.getTime() + 3600000).toISOString();
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(6, 0, 0, 0); // 6 AM
        return tomorrow.toISOString();
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(6, 0, 0, 0);
        return nextWeek.toISOString();
      default:
        // Default: 1 hour
        return new Date(now.getTime() + 3600000).toISOString();
    }
  }

  // ============ BUILT-IN TASK HANDLERS ============

  _registerBuiltinHandlers() {
    // Email drip — fires Edge Function
    this.registerHandler('email_drip', async (config) => {
      const supabaseUrl = this.brainContext.getConfig().supabaseUrl;
      const res = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: config.email,
          name: config.name,
          source: `drip_${config.sequence || 1}`,
        }),
      });
      return await res.json();
    });

    // Webhook fire — generic POST
    this.registerHandler('webhook_fire', async (config) => {
      const url = config.url || config.webhook_url;
      if (!url) throw new Error('No URL specified in task config');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.body || {}),
      });
      return { status: res.status, body: await res.text() };
    });

    // Context refresh
    this.registerHandler('context_refresh', async () => {
      await this.brainContext.loadContext();
      const ctx = await this.brainContext.getFullContext();
      return { keys: Object.keys(ctx).length, refreshed: true };
    });

    // Health check — ping all systems
    this.registerHandler('health_check', async () => {
      const results = {};

      // Check Supabase
      try {
        const { data } = await this.brainContext.supabase
          .from('brain_context')
          .select('key')
          .limit(1);
        results.supabase = data ? 'ok' : 'error';
      } catch (e) { results.supabase = `error: ${e.message}`; }

      // Check Ollama
      try {
        const res = await fetch('http://localhost:11434/api/tags', {
          signal: AbortSignal.timeout(3000)
        });
        results.ollama = res.ok ? 'ok' : 'down';
      } catch { results.ollama = 'down'; }

      // Log to brain_context
      if (this.brainContext.supabase) {
        await this.brainContext.supabase
          .from('brain_context')
          .upsert({
            key: 'system.health_check',
            value: JSON.stringify({ ...results, checked_at: new Date().toISOString() }),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'key' });
      }

      return results;
    });

    // Report generation — stores daily report in brain_context
    this.registerHandler('report_generate', async () => {
      if (!this.brainContext.supabase) throw new Error('Not connected');

      const [actionsRes, subscribersRes, episodesRes] = await Promise.all([
        this.brainContext.supabase.from('brain_actions').select('status').limit(100),
        this.brainContext.supabase.from('subscribers').select('status, goal').limit(100),
        this.brainContext.supabase.from('brain_episodes').select('event_type, summary').limit(100),
      ]);

      const report = {
        date: new Date().toISOString().split('T')[0],
        actions: {
          total: actionsRes.data?.length || 0,
          pending: actionsRes.data?.filter(t => t.status === 'pending').length || 0,
          completed: actionsRes.data?.filter(t => t.status === 'completed').length || 0,
        },
        subscribers: {
          total: subscribersRes.data?.length || 0,
          active: subscribersRes.data?.filter(s => s.status === 'active').length || 0,
        },
        episodes: {
          total: episodesRes.data?.length || 0,
        },
        budget: this.brainAPI?.getBudget() || {},
        generated_at: new Date().toISOString(),
      };

      // Store report
      await this.brainContext.supabase
        .from('brain_context')
        .upsert({
          key: `reports.daily.${report.date}`,
          value: JSON.stringify(report),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

      return report;
    });

    // Evolution cycle — self-assessment + log improvement tasks
    this.registerHandler('evolution_cycle', async () => {
      if (!this.brainContext.supabase) throw new Error('Not connected');

      const config = this.brainContext.getConfig();
      const status = await this.brainContext.getSystemStatus();
      const provider = await this.brainAPI?.detectBestProvider();

      // Assess current state
      const checklist = [
        { item: 'supabase_connected', met: status.connected },
        { item: 'ai_provider_available', met: !!provider },
        { item: 'free_provider', met: config.aiProvider === 'ollama' || !!config.groqKey },
        { item: 'scheduler_running', met: this.running },
        { item: 'health_checks', met: true },
        { item: 'budget_tracking', met: true },
      ];

      const score = checklist.filter(c => c.met).length;
      const total = checklist.length;

      // Store evolution record
      await this.brainContext.supabase
        .from('brain_context')
        .upsert({
          key: 'system.evolution_log',
          value: JSON.stringify({
            last_cycle: new Date().toISOString(),
            score: `${score}/${total}`,
            checklist,
            improvements_needed: checklist.filter(c => !c.met).map(c => c.item),
          }),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

      return { score: `${score}/${total}`, checklist };
    });

    // Vercel deploy — trigger deploy hook
    this.registerHandler('vercel_deploy', async (config) => {
      const hookUrl = config.deploy_hook || config.url;
      if (!hookUrl) throw new Error('No deploy_hook URL in task config. Get it from Vercel Project Settings > Git > Deploy Hooks');

      const res = await fetch(hookUrl, { method: 'POST' });
      const data = await res.json();
      return { triggered: true, ...data };
    });

    // Make.com scenario management
    this.registerHandler('make_scenario', async (config) => {
      const action = config.action; // 'activate', 'deactivate', 'run', 'status'
      const scenarioId = config.scenario_id;
      const apiKey = config.make_api_key || this.brainContext.getConfig().makeApiKey;

      if (!apiKey) throw new Error('Make.com API key not configured');
      if (!scenarioId) throw new Error('scenario_id required');

      const baseUrl = 'https://us2.make.com/api/v2';
      const headers = {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      };

      switch (action) {
        case 'activate':
          const actRes = await fetch(`${baseUrl}/scenarios/${scenarioId}/activate`, { method: 'POST', headers });
          return await actRes.json();

        case 'deactivate':
          const deactRes = await fetch(`${baseUrl}/scenarios/${scenarioId}/deactivate`, { method: 'POST', headers });
          return await deactRes.json();

        case 'run':
          const runRes = await fetch(`${baseUrl}/scenarios/${scenarioId}/run`, {
            method: 'POST', headers,
            body: JSON.stringify({ data: config.data || {} }),
          });
          return await runRes.json();

        case 'status':
          const statusRes = await fetch(`${baseUrl}/scenarios/${scenarioId}`, { headers });
          return await statusRes.json();

        default:
          throw new Error(`Unknown action: ${action}. Use: activate, deactivate, run, status`);
      }
    });
  }
}

module.exports = { Scheduler };
