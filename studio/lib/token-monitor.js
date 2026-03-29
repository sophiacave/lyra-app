#!/usr/bin/env node
/**
 * Like One Studio — Token Monitor
 * Tracks API usage across all providers (Claude, OpenAI, HuggingFace, Ollama)
 * and writes accumulated stats to Supabase brain_context.
 *
 * Module usage:
 *   import { TokenMonitor } from './lib/token-monitor.js';
 *   const monitor = new TokenMonitor({ session: 78 });
 *   monitor.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 1200, outputTokens: 400, latencyMs: 2300 });
 *   const stats = monitor.summary();
 *   await monitor.flush();  // writes to brain_context
 *
 * CLI usage:
 *   node studio/lib/token-monitor.js --status           # show current brain stats
 *   node studio/lib/token-monitor.js --session 78       # show session summary
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';

// ── Cost table (USD per 1M tokens) ──
// Updated March 2026 — adjust as pricing changes
const COST_PER_MILLION = {
  // Anthropic
  'claude-opus-4-6':        { input: 15.00, output: 75.00 },
  'claude-sonnet-4-6':      { input:  3.00, output: 15.00 },
  'claude-haiku-4-5':       { input:  0.80, output:  4.00 },
  // OpenAI
  'gpt-4o':                 { input:  2.50, output: 10.00 },
  'gpt-4o-mini':            { input:  0.15, output:  0.60 },
  'gpt-4-turbo':            { input: 10.00, output: 30.00 },
  // HuggingFace (free tier — track for volume awareness)
  'meta-llama/Llama-3.1-70B-Instruct': { input: 0, output: 0 },
  // Ollama local (zero cost, track for performance metrics)
  'qwen2.5:32b':            { input: 0, output: 0 },
  'llama3.1:8b':            { input: 0, output: 0 },
  'gpt-oss:20b':            { input: 0, output: 0 },
  'deepseek-coder-v2:16b':  { input: 0, output: 0 },
};

// Provider tier mapping (matches ai-router tiers)
const PROVIDER_TIER = {
  ollama:     0,
  rag:        1,
  huggingface: 2,
  anthropic:  3,
  openai:     3,
};

// ── Supabase config resolution ──

function resolveSupabaseConfig() {
  const config = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };

  if (config.url && config.key) return config;

  // Try .env.local
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
  for (const envFile of ['.env.local', '.env']) {
    const envPath = path.join(root, envFile);
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf-8');
      if (!config.url) {
        const m = content.match(/^(?:NEXT_PUBLIC_)?SUPABASE_URL=(.+)$/m);
        if (m) config.url = m[1].trim();
      }
      if (!config.key) {
        const m = content.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m);
        if (m) config.key = m[1].trim();
      }
    }
  }
  return config;
}

// ── TokenMonitor class ──

export class TokenMonitor {
  /**
   * @param {Object} opts
   * @param {number} [opts.session] - Session number for tagging
   * @param {string} [opts.worker] - Worker ID (e.g., 'M3', 'M4', 'edge')
   */
  constructor(opts = {}) {
    this.session = opts.session || null;
    this.worker = opts.worker || 'studio';
    this.startedAt = new Date().toISOString();
    this.calls = [];       // individual call records
    this.totals = {};      // accumulated by provider+model
  }

  /**
   * Record an API call.
   * @param {Object} call
   * @param {string} call.provider - 'anthropic', 'openai', 'huggingface', 'ollama'
   * @param {string} call.model - Model identifier
   * @param {number} [call.inputTokens=0] - Input/prompt tokens
   * @param {number} [call.outputTokens=0] - Output/completion tokens
   * @param {number} [call.latencyMs=0] - Request latency in ms
   * @param {string} [call.task] - What the call was for (e.g., 'screenplay', 'prompt-enhance')
   * @param {boolean} [call.success=true] - Whether the call succeeded
   * @param {string} [call.error] - Error message if failed
   */
  record(call) {
    const {
      provider,
      model,
      inputTokens = 0,
      outputTokens = 0,
      latencyMs = 0,
      task = 'unknown',
      success = true,
      error = null,
    } = call;

    const pricing = COST_PER_MILLION[model] || { input: 0, output: 0 };
    const costUsd = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
    const tier = PROVIDER_TIER[provider] ?? 3;

    const record = {
      timestamp: new Date().toISOString(),
      provider,
      model,
      tier,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      costUsd: Math.round(costUsd * 1_000_000) / 1_000_000, // 6 decimal places
      latencyMs,
      task,
      success,
      error,
    };

    this.calls.push(record);

    // Accumulate totals
    const key = `${provider}/${model}`;
    if (!this.totals[key]) {
      this.totals[key] = {
        provider, model, tier,
        calls: 0, failures: 0,
        inputTokens: 0, outputTokens: 0, totalTokens: 0,
        costUsd: 0, totalLatencyMs: 0,
      };
    }
    const t = this.totals[key];
    t.calls++;
    if (!success) t.failures++;
    t.inputTokens += inputTokens;
    t.outputTokens += outputTokens;
    t.totalTokens += inputTokens + outputTokens;
    t.costUsd += record.costUsd;
    t.totalLatencyMs += latencyMs;

    return record;
  }

  /**
   * Get a summary of all recorded calls.
   */
  summary() {
    const models = Object.values(this.totals);
    const totalCost = models.reduce((s, m) => s + m.costUsd, 0);
    const totalTokens = models.reduce((s, m) => s + m.totalTokens, 0);
    const totalCalls = models.reduce((s, m) => s + m.calls, 0);
    const totalFailures = models.reduce((s, m) => s + m.failures, 0);
    const avgLatency = totalCalls > 0
      ? Math.round(models.reduce((s, m) => s + m.totalLatencyMs, 0) / totalCalls)
      : 0;

    // Tier breakdown
    const tierBreakdown = {};
    for (const m of models) {
      const tierName = ['ollama', 'rag', 'huggingface', 'claude/openai'][m.tier] || `tier${m.tier}`;
      if (!tierBreakdown[tierName]) {
        tierBreakdown[tierName] = { calls: 0, tokens: 0, costUsd: 0 };
      }
      tierBreakdown[tierName].calls += m.calls;
      tierBreakdown[tierName].tokens += m.totalTokens;
      tierBreakdown[tierName].costUsd += m.costUsd;
    }

    // Local offload ratio (tier 0 calls vs total)
    const localCalls = models.filter(m => m.tier === 0).reduce((s, m) => s + m.calls, 0);
    const offloadRatio = totalCalls > 0 ? localCalls / totalCalls : 0;

    return {
      session: this.session,
      worker: this.worker,
      startedAt: this.startedAt,
      totalCalls,
      totalFailures,
      totalTokens,
      totalCostUsd: Math.round(totalCost * 1_000_000) / 1_000_000,
      avgLatencyMs: avgLatency,
      localOffloadRatio: Math.round(offloadRatio * 100),
      models,
      tierBreakdown,
    };
  }

  /**
   * Write usage stats to brain_context (system.token_usage).
   * Merges with existing data — preserves history, updates today's stats.
   */
  async flush() {
    const { url, key } = resolveSupabaseConfig();
    if (!url || !key) {
      console.error('TokenMonitor: No Supabase credentials — skipping flush');
      return { flushed: false, reason: 'no_credentials' };
    }

    const summary = this.summary();
    const today = new Date().toISOString().slice(0, 10);

    // Read current value
    let existing = {};
    try {
      const res = await fetch(
        `${url}/rest/v1/brain_context?key=eq.system.token_usage&select=value`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data[0]?.value) {
          existing = typeof data[0].value === 'string'
            ? JSON.parse(data[0].value)
            : data[0].value;
        }
      }
    } catch (e) {
      console.error('TokenMonitor: Failed to read existing stats:', e.message);
    }

    // Merge: update today's entry, preserve everything else
    const todayEntry = existing.today || {};
    const updatedToday = {
      date: today,
      status: 'MONITORING_ACTIVE',
      session_number: this.session || todayEntry.session_number || 0,
      twin_sessions: (todayEntry.twin_sessions || 0) + (todayEntry.date !== today ? 1 : 0),
      api_calls: (todayEntry.api_calls || 0) + summary.totalCalls,
      total_tokens: (todayEntry.total_tokens || 0) + summary.totalTokens,
      total_cost_usd: Math.round(((todayEntry.total_cost_usd || 0) + summary.totalCostUsd) * 1_000_000) / 1_000_000,
      local_offload_pct: summary.localOffloadRatio,
      failures: (todayEntry.failures || 0) + summary.totalFailures,
      avg_latency_ms: summary.avgLatencyMs,
      last_flush: new Date().toISOString(),
    };

    // Build daily history (keep last 30 days)
    const history = existing.daily_history || [];
    if (todayEntry.date && todayEntry.date !== today && todayEntry.api_calls > 0) {
      history.push({
        date: todayEntry.date,
        calls: todayEntry.api_calls || 0,
        tokens: todayEntry.total_tokens || 0,
        cost: todayEntry.total_cost_usd || 0,
      });
      // Keep only last 30
      while (history.length > 30) history.shift();
    }

    // Session log (append this session's stats)
    const sessions = existing.sessions || [];
    if (summary.totalCalls > 0) {
      sessions.push({
        session: this.session,
        worker: this.worker,
        at: this.startedAt,
        calls: summary.totalCalls,
        tokens: summary.totalTokens,
        cost: summary.totalCostUsd,
        tiers: summary.tierBreakdown,
        models: summary.models.map(m => ({
          model: m.model,
          calls: m.calls,
          tokens: m.totalTokens,
          cost: m.costUsd,
        })),
      });
      // Keep last 50 sessions
      while (sessions.length > 50) sessions.shift();
    }

    const updated = {
      ...existing,
      today: updatedToday,
      daily_history: history,
      sessions,
      alerts: existing.alerts || {},
      initialized: existing.initialized || today,
    };

    // Write back
    try {
      const res = await fetch(
        `${url}/rest/v1/brain_context?key=eq.system.token_usage`,
        {
          method: 'PATCH',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ value: updated }),
        }
      );
      if (!res.ok) {
        const err = await res.text();
        console.error(`TokenMonitor: flush failed (${res.status}): ${err}`);
        return { flushed: false, reason: err };
      }
    } catch (e) {
      console.error('TokenMonitor: flush error:', e.message);
      return { flushed: false, reason: e.message };
    }

    return { flushed: true, summary: updatedToday };
  }

  /**
   * Get known cost per million tokens for a model.
   */
  static pricing(model) {
    return COST_PER_MILLION[model] || { input: 0, output: 0 };
  }

  /**
   * Estimate cost for a planned API call.
   */
  static estimateCost(model, inputTokens, outputTokens) {
    const p = COST_PER_MILLION[model] || { input: 0, output: 0 };
    return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
  }
}

// ── Singleton for simple module-level tracking ──

let _defaultMonitor = null;

/**
 * Get or create the default monitor for this process.
 * @param {Object} [opts] - Options (only used on first call)
 */
export function getMonitor(opts) {
  if (!_defaultMonitor) {
    _defaultMonitor = new TokenMonitor(opts);
  }
  return _defaultMonitor;
}

/**
 * Convenience: record a call on the default monitor.
 */
export function recordUsage(call) {
  return getMonitor().record(call);
}

/**
 * Convenience: flush the default monitor to brain.
 */
export async function flushUsage() {
  return getMonitor().flush();
}

// ── CLI ──

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Like One Studio — Token Monitor

Usage:
  node studio/lib/token-monitor.js --status         Show current brain token stats
  node studio/lib/token-monitor.js --test            Run a test recording cycle
  node studio/lib/token-monitor.js --help             Show this help

Environment:
  NEXT_PUBLIC_SUPABASE_URL     Supabase URL (or in .env.local)
  SUPABASE_SERVICE_ROLE_KEY    Service role key (or in .env.local)
`);
    process.exit(0);
  }

  if (args.includes('--status')) {
    const { url, key } = resolveSupabaseConfig();
    if (!url || !key) {
      console.error('No Supabase credentials found.');
      process.exit(1);
    }

    try {
      const res = await fetch(
        `${url}/rest/v1/brain_context?key=eq.system.token_usage&select=value`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      const data = await res.json();
      const usage = data[0]?.value;
      if (!usage) {
        console.log('No token usage data in brain.');
        process.exit(0);
      }

      console.log('\n  Token Monitor — Brain Status');
      console.log('  ' + '='.repeat(40));
      const t = usage.today || {};
      console.log(`  Date:           ${t.date || 'N/A'}`);
      console.log(`  Status:         ${t.status || 'UNKNOWN'}`);
      console.log(`  Session:        ${t.session_number || 'N/A'}`);
      console.log(`  API Calls:      ${t.api_calls || 0}`);
      console.log(`  Total Tokens:   ${(t.total_tokens || 0).toLocaleString()}`);
      console.log(`  Cost (USD):     $${(t.total_cost_usd || 0).toFixed(4)}`);
      console.log(`  Local Offload:  ${t.local_offload_pct || 0}%`);
      console.log(`  Failures:       ${t.failures || 0}`);
      console.log(`  Avg Latency:    ${t.avg_latency_ms || 0}ms`);
      console.log(`  Last Flush:     ${t.last_flush || 'never'}`);

      if (usage.alerts?.current) {
        console.log(`\n  Alert: ${usage.alerts.current}`);
      }

      const sessions = usage.sessions || [];
      if (sessions.length > 0) {
        console.log(`\n  Recent Sessions (${sessions.length} total):`);
        for (const s of sessions.slice(-5)) {
          const tiers = Object.entries(s.tiers || {}).map(([k, v]) => `${k}:${v.calls}`).join(', ');
          console.log(`    S${s.session || '?'} [${s.worker}] ${s.calls} calls, ${s.tokens} tok, $${(s.cost || 0).toFixed(4)} | ${tiers}`);
        }
      }

      const history = usage.daily_history || [];
      if (history.length > 0) {
        console.log(`\n  Daily History (${history.length} days):`);
        for (const d of history.slice(-7)) {
          console.log(`    ${d.date}: ${d.calls} calls, ${d.tokens} tok, $${(d.cost || 0).toFixed(4)}`);
        }
      }

      console.log();
    } catch (e) {
      console.error('Error fetching status:', e.message);
      process.exit(1);
    }
    return;
  }

  if (args.includes('--test')) {
    console.log('\n  Token Monitor — Test Recording');
    console.log('  ' + '='.repeat(40));

    const monitor = new TokenMonitor({ session: 78, worker: 'M4-test' });

    // Simulate some API calls
    monitor.record({
      provider: 'anthropic', model: 'claude-sonnet-4-6',
      inputTokens: 1500, outputTokens: 800, latencyMs: 2100,
      task: 'screenplay-generation',
    });
    monitor.record({
      provider: 'anthropic', model: 'claude-sonnet-4-6',
      inputTokens: 200, outputTokens: 50, latencyMs: 400,
      task: 'prompt-validation',
    });
    monitor.record({
      provider: 'ollama', model: 'qwen2.5:32b',
      inputTokens: 1000, outputTokens: 500, latencyMs: 8500,
      task: 'screenplay-draft',
    });
    monitor.record({
      provider: 'huggingface', model: 'meta-llama/Llama-3.1-70B-Instruct',
      inputTokens: 300, outputTokens: 200, latencyMs: 3200,
      task: 'classification',
    });

    const summary = monitor.summary();
    console.log(`  Total calls:    ${summary.totalCalls}`);
    console.log(`  Total tokens:   ${summary.totalTokens.toLocaleString()}`);
    console.log(`  Total cost:     $${summary.totalCostUsd.toFixed(6)}`);
    console.log(`  Avg latency:    ${summary.avgLatencyMs}ms`);
    console.log(`  Local offload:  ${summary.localOffloadRatio}%`);
    console.log('\n  Tier breakdown:');
    for (const [tier, data] of Object.entries(summary.tierBreakdown)) {
      console.log(`    ${tier}: ${data.calls} calls, ${data.tokens} tok, $${data.costUsd.toFixed(6)}`);
    }
    console.log('\n  Model breakdown:');
    for (const m of summary.models) {
      console.log(`    ${m.model}: ${m.calls} calls, ${m.totalTokens} tok, $${m.costUsd.toFixed(6)}, avg ${Math.round(m.totalLatencyMs / m.calls)}ms`);
    }

    // Flush to brain
    console.log('\n  Flushing to brain...');
    const result = await monitor.flush();
    if (result.flushed) {
      console.log('  Flushed successfully.');
      console.log(`  Today total: ${result.summary.api_calls} calls, ${result.summary.total_tokens} tok, $${result.summary.total_cost_usd.toFixed(4)}`);
    } else {
      console.log(`  Flush failed: ${result.reason}`);
    }
    console.log();
    return;
  }

  // Default: show status
  process.argv.push('--status');
  return main();
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('token-monitor.js') ||
  process.argv[1].includes('token-monitor')
);

if (isDirectRun) {
  main();
}
