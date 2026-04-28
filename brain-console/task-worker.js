/**
 * task-worker.js — Faye Engine Task Dispatch Worker
 *
 * Polls task_dispatch table for pending tasks assigned to this machine.
 * Claims → executes → reports results. Part of the divine cycle.
 *
 * Categories: deploy, test, smoketest, system, social, content, code
 * Machines: m3_forge, m4_mirror, gcp_watcher
 */

const { execSync, exec } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

class TaskWorker {
  constructor(brainContext, localEngine) {
    this.brainContext = brainContext;
    this.localEngine = localEngine;
    this.machineId = this._detectMachine();
    this.pollInterval = null;
    this.processing = false;
    this.stats = { claimed: 0, completed: 0, failed: 0, lastPoll: null };
  }

  get sb() { return this.brainContext?.supabase; }

  _detectMachine() {
    const hostname = os.hostname().toLowerCase();
    const ram = os.totalmem();
    if (ram > 60e9) return 'm3_forge';
    if (ram > 40e9) return 'm4_mirror';
    return 'gcp_watcher';
  }

  start(intervalMs = 30000) {
    if (this.pollInterval) return;
    console.log(`[TaskWorker] Started on ${this.machineId}, polling every ${intervalMs / 1000}s`);
    this._poll(); // immediate first poll
    this.pollInterval = setInterval(() => this._poll(), intervalMs);
  }

  stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      console.log('[TaskWorker] Stopped');
    }
  }

  async _poll() {
    if (!this.sb || this.processing) return;
    this.stats.lastPoll = new Date().toISOString();

    try {
      // Fetch pending tasks assigned to this machine (or unassigned)
      const { data: tasks, error } = await this.sb
        .from('task_dispatch')
        .select('*')
        .in('status', ['pending'])
        .or(`assigned_to.eq.${this.machineId},assigned_to.is.null`)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(5);

      if (error) {
        console.error('[TaskWorker] Poll error:', error.message);
        return;
      }

      if (!tasks?.length) return;

      console.log(`[TaskWorker] Found ${tasks.length} pending task(s)`);

      for (const task of tasks) {
        await this._claimAndExecute(task);
      }
    } catch (e) {
      console.error('[TaskWorker] Poll exception:', e.message);
    }
  }

  async _claimAndExecute(task) {
    this.processing = true;
    try {
      // Atomic claim — only succeeds if still pending
      const { data: claimed, error: claimErr } = await this.sb
        .from('task_dispatch')
        .update({
          status: 'in_progress',
          assigned_to: this.machineId,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id)
        .eq('status', 'pending')
        .select()
        .single();

      if (claimErr || !claimed) {
        console.log(`[TaskWorker] Could not claim ${task.id} — already taken`);
        return;
      }

      this.stats.claimed++;
      console.log(`[TaskWorker] Claimed: ${task.title} (${task.category})`);

      // Execute based on category
      const result = await this._execute(task);

      // Report success
      await this.sb
        .from('task_dispatch')
        .update({
          status: 'completed',
          result: result,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id);

      this.stats.completed++;
      console.log(`[TaskWorker] Completed: ${task.title}`);

    } catch (e) {
      // Report failure
      await this.sb
        .from('task_dispatch')
        .update({
          status: 'failed',
          error: e.message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id)
        .catch(() => {});

      this.stats.failed++;
      console.error(`[TaskWorker] Failed: ${task.title} — ${e.message}`);
    } finally {
      this.processing = false;
    }
  }

  async _execute(task) {
    const { category, payload, title } = task;
    const p = payload || {};

    switch (category) {
      case 'shell':
      case 'system':
        return this._execShell(p);

      case 'deploy':
        return this._execDeploy(p);

      case 'test':
      case 'smoketest':
        return this._execTest(p);

      case 'code':
        return this._execCode(p);

      case 'social':
        return this._execSocial(p);

      case 'content':
        return this._execContent(p);

      case 'verification':
        return this._execVerification(p);

      case 'brain':
        return this._execBrain(p);

      default:
        // Try shell command from payload, or delegate to local engine
        if (p.command) return this._execShell(p);
        if (p.message) return this._execChat(p);
        return { status: 'skipped', reason: `Unknown category: ${category}` };
    }
  }

  _execShell(payload) {
    const cmd = payload.command || payload.cmd;
    if (!cmd) return { status: 'error', reason: 'No command in payload' };

    // Safety: block destructive commands
    const dangerous = /rm\s+-rf\s+[\/~]|mkfs|dd\s+if=|>\s*\/dev\/sd/i;
    if (dangerous.test(cmd)) {
      return { status: 'blocked', reason: 'Destructive command blocked by safety filter' };
    }

    try {
      const output = execSync(cmd, {
        timeout: (payload.timeout || 60) * 1000,
        cwd: payload.cwd || os.homedir(),
        encoding: 'utf8',
        maxBuffer: 1024 * 1024,
      });
      return { status: 'ok', output: output.slice(0, 5000) };
    } catch (e) {
      return { status: 'error', output: (e.stdout || '').slice(0, 2000), error: e.message.slice(0, 1000) };
    }
  }

  _execDeploy(payload) {
    const target = payload.target || 'site';
    const cmds = {
      site: 'cd ~/lyra-app && git add -A && git commit -m "auto-deploy from task_dispatch" && git push origin main',
      console: 'cd ~/lyra-app/brain-console && npm run build',
    };
    const cmd = payload.command || cmds[target];
    if (!cmd) return { status: 'error', reason: `Unknown deploy target: ${target}` };
    return this._execShell({ ...payload, command: cmd });
  }

  _execTest(payload) {
    const cmd = payload.command || payload.test_command;
    if (cmd) return this._execShell({ ...payload, command: cmd });

    // Default: curl smoketest
    const url = payload.url || 'https://likeone.ai';
    try {
      const output = execSync(`curl -sL -o /dev/null -w "%{http_code}" "${url}"`, {
        timeout: 15000, encoding: 'utf8',
      });
      const code = parseInt(output.trim());
      return { status: code >= 200 && code < 400 ? 'ok' : 'fail', http_code: code, url };
    } catch (e) {
      return { status: 'error', error: e.message.slice(0, 500) };
    }
  }

  async _execCode(payload) {
    if (!this.localEngine) return { status: 'error', reason: 'No local engine available' };
    const action = payload.action || 'review';
    const result = await this.localEngine.handleCommand(`/code`, `${action} ${payload.file || ''}`);
    return { status: 'ok', result: typeof result === 'string' ? result.slice(0, 5000) : result };
  }

  _execSocial(payload) {
    // Delegate to social posting script
    const cmd = payload.command || `~/bin/send-email "${payload.to || ''}" "${payload.subject || ''}" "${payload.body || ''}"`;
    return this._execShell({ ...payload, command: cmd, timeout: 30 });
  }

  _execContent(payload) {
    // Content generation via local AI
    if (payload.command) return this._execShell(payload);
    return { status: 'skipped', reason: 'Content tasks need specific command or AI prompt in payload' };
  }

  _execVerification(payload) {
    const cmd = payload.command || payload.verify_command;
    if (cmd) return this._execShell({ ...payload, command: cmd });
    return { status: 'skipped', reason: 'No verify command in payload' };
  }

  async _execBrain(payload) {
    if (!this.sb) return { status: 'error', reason: 'No Supabase connection' };
    const action = payload.action || 'read';
    if (action === 'read' && payload.key) {
      const { data } = await this.sb
        .from('brain_context')
        .select('key, value, description')
        .eq('key', payload.key)
        .single();
      return { status: 'ok', data };
    }
    if (action === 'write' && payload.key && payload.value) {
      const { error } = await this.sb
        .from('brain_context')
        .upsert({ key: payload.key, value: payload.value, updated_at: new Date().toISOString() });
      return { status: error ? 'error' : 'ok', error: error?.message };
    }
    return { status: 'skipped', reason: `Unknown brain action: ${action}` };
  }

  async _execChat(payload) {
    if (!this.localEngine) return { status: 'error', reason: 'No local engine' };
    const result = await this.localEngine.tryHandle(payload.message);
    return { status: 'ok', result };
  }

  getStatus() {
    return {
      machine: this.machineId,
      running: !!this.pollInterval,
      processing: this.processing,
      stats: this.stats,
    };
  }
}

module.exports = { TaskWorker };
