/**
 * Token Monitor Test Suite
 *
 * Tests the TokenMonitor class: recording, cost calculation,
 * tier breakdown, summary, flush mechanics, and edge cases.
 *
 * Run: node studio/tests/test-token-monitor.mjs
 */

import { TokenMonitor } from '../lib/token-monitor.js';

let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}`);
    failed++;
  }
}

function approxEqual(a, b, epsilon = 0.000001) {
  return Math.abs(a - b) < epsilon;
}

console.log('═══ Token Monitor Test Suite ═══\n');

// ══════════════════════════════════════════
// Section 1: Constructor
// ══════════════════════════════════════════
console.log('── Constructor ──');

const m1 = new TokenMonitor({ session: 42, worker: 'M4' });
test('constructor sets session', m1.session === 42);
test('constructor sets worker', m1.worker === 'M4');
test('constructor sets startedAt', typeof m1.startedAt === 'string' && m1.startedAt.length > 0);
test('constructor initializes empty calls', Array.isArray(m1.calls) && m1.calls.length === 0);
test('constructor initializes empty totals', Object.keys(m1.totals).length === 0);

const m1b = new TokenMonitor();
test('constructor defaults session to null', m1b.session === null);
test('constructor defaults worker to studio', m1b.worker === 'studio');

// ══════════════════════════════════════════
// Section 2: Recording API calls
// ══════════════════════════════════════════
console.log('\n── Recording API Calls ──');

const m2 = new TokenMonitor({ session: 1 });

const r1 = m2.record({
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  inputTokens: 1000,
  outputTokens: 500,
  latencyMs: 2000,
  task: 'screenplay',
});

test('record returns object with timestamp', typeof r1.timestamp === 'string');
test('record returns provider', r1.provider === 'anthropic');
test('record returns model', r1.model === 'claude-sonnet-4-6');
test('record returns tier 3 for anthropic', r1.tier === 3);
test('record returns inputTokens', r1.inputTokens === 1000);
test('record returns outputTokens', r1.outputTokens === 500);
test('record returns totalTokens', r1.totalTokens === 1500);
test('record returns latencyMs', r1.latencyMs === 2000);
test('record returns task', r1.task === 'screenplay');
test('record returns success=true by default', r1.success === true);
test('record returns error=null by default', r1.error === null);
test('record calculates cost', r1.costUsd > 0);

// claude-sonnet-4-6: input $3/M, output $15/M
// 1000 * 3 / 1M + 500 * 15 / 1M = 0.003 + 0.0075 = 0.0105
test('record cost correct for sonnet', approxEqual(r1.costUsd, 0.0105));

test('calls array grows', m2.calls.length === 1);

// Record a second call to same model
m2.record({
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  inputTokens: 200,
  outputTokens: 100,
  latencyMs: 500,
  task: 'validation',
});

test('calls array grows to 2', m2.calls.length === 2);
test('totals accumulates under same key', Object.keys(m2.totals).length === 1);
test('totals call count = 2', m2.totals['anthropic/claude-sonnet-4-6'].calls === 2);
test('totals inputTokens accumulated', m2.totals['anthropic/claude-sonnet-4-6'].inputTokens === 1200);
test('totals outputTokens accumulated', m2.totals['anthropic/claude-sonnet-4-6'].outputTokens === 600);

// ══════════════════════════════════════════
// Section 3: Cost calculations per model
// ══════════════════════════════════════════
console.log('\n── Cost Calculations ──');

const m3 = new TokenMonitor();

// Opus: input $15/M, output $75/M
const opusCall = m3.record({
  provider: 'anthropic', model: 'claude-opus-4-6',
  inputTokens: 2000, outputTokens: 1000,
});
// 2000*15/1M + 1000*75/1M = 0.03 + 0.075 = 0.105
test('opus cost correct', approxEqual(opusCall.costUsd, 0.105));

// Haiku: input $0.80/M, output $4/M
const haikuCall = m3.record({
  provider: 'anthropic', model: 'claude-haiku-4-5',
  inputTokens: 5000, outputTokens: 2000,
});
// 5000*0.8/1M + 2000*4/1M = 0.004 + 0.008 = 0.012
test('haiku cost correct', approxEqual(haikuCall.costUsd, 0.012));

// GPT-4o: input $2.50/M, output $10/M
const gptCall = m3.record({
  provider: 'openai', model: 'gpt-4o',
  inputTokens: 3000, outputTokens: 1500,
});
// 3000*2.5/1M + 1500*10/1M = 0.0075 + 0.015 = 0.0225
test('gpt-4o cost correct', approxEqual(gptCall.costUsd, 0.0225));

// GPT-4o-mini: input $0.15/M, output $0.60/M
const miniCall = m3.record({
  provider: 'openai', model: 'gpt-4o-mini',
  inputTokens: 10000, outputTokens: 5000,
});
// 10000*0.15/1M + 5000*0.60/1M = 0.0015 + 0.003 = 0.0045
test('gpt-4o-mini cost correct', approxEqual(miniCall.costUsd, 0.0045));

// Ollama (free)
const ollamaCall = m3.record({
  provider: 'ollama', model: 'qwen2.5:32b',
  inputTokens: 5000, outputTokens: 3000,
});
test('ollama cost is zero', ollamaCall.costUsd === 0);

// HuggingFace (free tier)
const hfCall = m3.record({
  provider: 'huggingface', model: 'meta-llama/Llama-3.1-70B-Instruct',
  inputTokens: 2000, outputTokens: 1000,
});
test('huggingface cost is zero', hfCall.costUsd === 0);

// Unknown model (should default to 0 cost)
const unknownCall = m3.record({
  provider: 'anthropic', model: 'claude-future-99',
  inputTokens: 1000, outputTokens: 500,
});
test('unknown model cost defaults to 0', unknownCall.costUsd === 0);

// ══════════════════════════════════════════
// Section 4: Tier assignment
// ══════════════════════════════════════════
console.log('\n── Tier Assignment ──');

const m4 = new TokenMonitor();

const t_ollama = m4.record({ provider: 'ollama', model: 'llama3.1:8b', inputTokens: 100, outputTokens: 50 });
test('ollama is tier 0', t_ollama.tier === 0);

const t_rag = m4.record({ provider: 'rag', model: 'bge-small', inputTokens: 100, outputTokens: 50 });
test('rag is tier 1', t_rag.tier === 1);

const t_hf = m4.record({ provider: 'huggingface', model: 'meta-llama/Llama-3.1-70B-Instruct', inputTokens: 100, outputTokens: 50 });
test('huggingface is tier 2', t_hf.tier === 2);

const t_claude = m4.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 50 });
test('anthropic is tier 3', t_claude.tier === 3);

const t_openai = m4.record({ provider: 'openai', model: 'gpt-4o', inputTokens: 100, outputTokens: 50 });
test('openai is tier 3', t_openai.tier === 3);

// ══════════════════════════════════════════
// Section 5: Summary
// ══════════════════════════════════════════
console.log('\n── Summary ──');

const m5 = new TokenMonitor({ session: 99, worker: 'test' });
m5.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 1000, outputTokens: 500, latencyMs: 2000 });
m5.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 500, outputTokens: 250, latencyMs: 1000 });
m5.record({ provider: 'ollama', model: 'qwen2.5:32b', inputTokens: 2000, outputTokens: 1000, latencyMs: 5000 });
m5.record({ provider: 'huggingface', model: 'meta-llama/Llama-3.1-70B-Instruct', inputTokens: 300, outputTokens: 200, latencyMs: 3000 });

const s5 = m5.summary();

test('summary session', s5.session === 99);
test('summary worker', s5.worker === 'test');
test('summary totalCalls', s5.totalCalls === 4);
test('summary totalFailures', s5.totalFailures === 0);
test('summary totalTokens', s5.totalTokens === 1000 + 500 + 500 + 250 + 2000 + 1000 + 300 + 200);
test('summary totalCostUsd > 0', s5.totalCostUsd > 0);
test('summary avgLatencyMs', s5.avgLatencyMs === Math.round((2000 + 1000 + 5000 + 3000) / 4));
test('summary has models array', Array.isArray(s5.models) && s5.models.length === 3);

// Tier breakdown
test('summary tierBreakdown has ollama', s5.tierBreakdown.ollama?.calls === 1);
test('summary tierBreakdown has huggingface', s5.tierBreakdown.huggingface?.calls === 1);
test('summary tierBreakdown has claude/openai', s5.tierBreakdown['claude/openai']?.calls === 2);

// Local offload ratio: 1 ollama out of 4 total = 25%
test('summary localOffloadRatio', s5.localOffloadRatio === 25);

// ══════════════════════════════════════════
// Section 6: Failure tracking
// ══════════════════════════════════════════
console.log('\n── Failure Tracking ──');

const m6 = new TokenMonitor();
m6.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 0, success: false, error: 'rate limited' });
m6.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 50, success: true });

const s6 = m6.summary();
test('failure counted in totalFailures', s6.totalFailures === 1);
test('failure counted in model totals', m6.totals['anthropic/claude-sonnet-4-6'].failures === 1);
test('success still counted', m6.totals['anthropic/claude-sonnet-4-6'].calls === 2);

// ══════════════════════════════════════════
// Section 7: Default values
// ══════════════════════════════════════════
console.log('\n── Default Values ──');

const m7 = new TokenMonitor();
const r7 = m7.record({ provider: 'anthropic', model: 'claude-sonnet-4-6' });

test('default inputTokens is 0', r7.inputTokens === 0);
test('default outputTokens is 0', r7.outputTokens === 0);
test('default latencyMs is 0', r7.latencyMs === 0);
test('default task is unknown', r7.task === 'unknown');
test('default success is true', r7.success === true);
test('default error is null', r7.error === null);
test('cost is 0 with 0 tokens', r7.costUsd === 0);

// ══════════════════════════════════════════
// Section 8: Static methods
// ══════════════════════════════════════════
console.log('\n── Static Methods ──');

const pricing = TokenMonitor.pricing('claude-sonnet-4-6');
test('pricing returns input', pricing.input === 3.0);
test('pricing returns output', pricing.output === 15.0);

const unknownPricing = TokenMonitor.pricing('nonexistent-model');
test('pricing returns 0 for unknown model', unknownPricing.input === 0 && unknownPricing.output === 0);

const estimate = TokenMonitor.estimateCost('claude-opus-4-6', 10000, 5000);
// 10000*15/1M + 5000*75/1M = 0.15 + 0.375 = 0.525
test('estimateCost correct for opus', approxEqual(estimate, 0.525));

const freeEstimate = TokenMonitor.estimateCost('qwen2.5:32b', 50000, 25000);
test('estimateCost is 0 for local models', freeEstimate === 0);

// ══════════════════════════════════════════
// Section 9: Empty summary
// ══════════════════════════════════════════
console.log('\n── Empty Summary ──');

const m9 = new TokenMonitor({ session: 0 });
const s9 = m9.summary();

test('empty summary totalCalls is 0', s9.totalCalls === 0);
test('empty summary totalTokens is 0', s9.totalTokens === 0);
test('empty summary totalCostUsd is 0', s9.totalCostUsd === 0);
test('empty summary avgLatencyMs is 0', s9.avgLatencyMs === 0);
test('empty summary localOffloadRatio is 0', s9.localOffloadRatio === 0);
test('empty summary models is empty', s9.models.length === 0);
test('empty summary tierBreakdown is empty', Object.keys(s9.tierBreakdown).length === 0);

// ══════════════════════════════════════════
// Section 10: Multiple providers accumulate separately
// ══════════════════════════════════════════
console.log('\n── Multi-Provider Isolation ──');

const m10 = new TokenMonitor();
m10.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 100, outputTokens: 50 });
m10.record({ provider: 'openai', model: 'gpt-4o', inputTokens: 100, outputTokens: 50 });
m10.record({ provider: 'ollama', model: 'qwen2.5:32b', inputTokens: 100, outputTokens: 50 });
m10.record({ provider: 'ollama', model: 'llama3.1:8b', inputTokens: 100, outputTokens: 50 });

test('4 different provider/model combos tracked', Object.keys(m10.totals).length === 4);
test('anthropic total isolated', m10.totals['anthropic/claude-sonnet-4-6'].totalTokens === 150);
test('openai total isolated', m10.totals['openai/gpt-4o'].totalTokens === 150);
test('ollama qwen isolated', m10.totals['ollama/qwen2.5:32b'].totalTokens === 150);
test('ollama llama isolated', m10.totals['ollama/llama3.1:8b'].totalTokens === 150);

const s10 = m10.summary();
test('localOffloadRatio with 2 ollama / 4 total = 50%', s10.localOffloadRatio === 50);

// ══════════════════════════════════════════
// Section 11: High-volume stress test
// ══════════════════════════════════════════
console.log('\n── High-Volume Stress ──');

const m11 = new TokenMonitor({ session: 100 });
for (let i = 0; i < 1000; i++) {
  m11.record({
    provider: i % 3 === 0 ? 'ollama' : i % 3 === 1 ? 'anthropic' : 'openai',
    model: i % 3 === 0 ? 'qwen2.5:32b' : i % 3 === 1 ? 'claude-sonnet-4-6' : 'gpt-4o',
    inputTokens: 100 + i,
    outputTokens: 50 + i,
    latencyMs: 100 + (i % 500),
  });
}

const s11 = m11.summary();
test('1000 calls recorded', s11.totalCalls === 1000);
test('no failures in stress test', s11.totalFailures === 0);
test('tokens > 0', s11.totalTokens > 0);
test('3 models tracked', s11.models.length === 3);
// 334 ollama calls out of 1000 (i%3===0 for i=0,3,...,999 → 334 calls)
test('local offload ~33%', s11.localOffloadRatio === 33 || s11.localOffloadRatio === 34);

// ══════════════════════════════════════════
// Section 12: Flush with live brain (integration)
// ══════════════════════════════════════════
console.log('\n── Brain Flush (Integration) ──');

const m12 = new TokenMonitor({ session: 0, worker: 'test-suite' });
m12.record({ provider: 'anthropic', model: 'claude-sonnet-4-6', inputTokens: 1, outputTokens: 1, task: 'test-assertion' });

const flushResult = await m12.flush();
test('flush succeeds', flushResult.flushed === true);
test('flush returns summary', flushResult.summary !== undefined);
test('flush summary has api_calls', flushResult.summary.api_calls >= 1);
test('flush summary has date', flushResult.summary.date === new Date().toISOString().slice(0, 10));

// ══════════════════════════════════════════
// Results
// ══════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
console.log(`  ${passed + failed} assertions: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

if (failed > 0) process.exit(1);
