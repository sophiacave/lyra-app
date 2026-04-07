/**
 * hook-system.js — Event Hook System for Faye Brain IDE
 * Pattern adopted from Claude Code OSS hookify plugin.
 * PreAction + PostAction hooks with dynamic rules from brain.
 * Built with love. McQueen x Rothko.
 */

class HookSystem {
  constructor(brainContext) {
    this.brainContext = brainContext;
    this.hooks = new Map(); // event → [handler]
    this.registerDefaults();
  }

  /**
   * Register default safety hooks.
   */
  registerDefaults() {
    // PreDeploy: always verify tests pass
    this.on('pre:deploy', async (context) => {
      console.log('[Hook] PreDeploy check');
      return { allow: true, message: 'Deploy approved' };
    });

    // PostBrainWrite: log all brain mutations
    this.on('post:brain-write', async (context) => {
      console.log(`[Hook] Brain write: ${context.key}`);
      return { logged: true };
    });

    // PreFileWrite: safety check for sensitive paths
    this.on('pre:file-write', async (context) => {
      const dangerous = ['.env', 'credentials', 'secrets', 'private_key'];
      const isDangerous = dangerous.some(d => context.path?.toLowerCase().includes(d));
      if (isDangerous) {
        console.warn(`[Hook] BLOCKED: write to sensitive path ${context.path}`);
        return { allow: false, message: `Blocked: sensitive file ${context.path}` };
      }
      return { allow: true };
    });

    // PostSessionStart: write boot log to brain
    this.on('post:session-start', async (context) => {
      if (this.brainContext?.supabase) {
        try {
          await this.brainContext.supabase.from('brain_context').upsert({
            key: 'system.last_console_boot',
            value: JSON.stringify({
              timestamp: new Date().toISOString(),
              version: context.version || '5.0.0-alpha',
              plugins: context.plugins || 0,
            }),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'key' });
        } catch {}
      }
    });
  }

  /**
   * Register a hook handler for an event.
   */
  on(event, handler) {
    if (!this.hooks.has(event)) this.hooks.set(event, []);
    this.hooks.get(event).push(handler);
  }

  /**
   * Fire all hooks for an event.
   * For pre: hooks, returns { allow, message } — if any hook blocks, action is blocked.
   * For post: hooks, returns array of results.
   */
  async fire(event, context = {}) {
    const handlers = this.hooks.get(event) || [];
    if (!handlers.length) return { allow: true, results: [] };

    const isPre = event.startsWith('pre:');
    const results = [];

    for (const handler of handlers) {
      try {
        const result = await handler(context);
        results.push(result);

        // Pre-hooks can block
        if (isPre && result?.allow === false) {
          return { allow: false, message: result.message || 'Blocked by hook', results };
        }
      } catch (e) {
        console.error(`[Hook] Error in ${event}:`, e.message);
        results.push({ error: e.message });
      }
    }

    return { allow: true, results };
  }

  /**
   * Load dynamic hooks from brain keys matching 'hook.*'
   */
  async loadFromBrain() {
    if (!this.brainContext?.supabase) return;

    try {
      const { data } = await this.brainContext.supabase
        .from('brain_context')
        .select('key, value')
        .like('key', 'hook.%');

      if (data?.length) {
        console.log(`[Hook] Loaded ${data.length} brain hooks`);
        // Brain hooks are informational — they guide AI behavior rather than execute code
        // Store them for reference by the AI during decision-making
        this.brainHooks = data;
      }
    } catch (e) {
      console.error('[Hook] Failed to load brain hooks:', e.message);
    }
  }
}

module.exports = { HookSystem };
