#!/usr/bin/env node
/**
 * Like One Studio — Ollama Engine
 * Local LLM interface for token-resilient operations.
 *
 * WRITTEN IN STONE 2026-03-29
 * Purpose: Run all generation tasks locally on M3 Max 64GB.
 * Claude is premium fallback, not primary.
 *
 * Models:
 *   qwen2.5:32b     — primary: screenplays, content, reasoning (20GB)
 *   llama3.1:8b     — fast: classification, routing, summaries (5GB)
 *   gpt-oss:20b     — alternate: general tasks (13GB)
 *
 * Usage:
 *   import { ollamaGenerate, ollamaChat, ollamaClassify } from './ollama-engine.js';
 *   const result = await ollamaGenerate({ prompt, model: 'qwen2.5:32b' });
 */

const OLLAMA_BASE = process.env.OLLAMA_HOST || 'http://localhost:11434';

// Model routing — pick the right model for the job
const MODEL_ROUTES = {
  screenplay:    'qwen2.5:32b',
  content:       'qwen2.5:32b',
  reasoning:     'qwen2.5:32b',
  coding:        'qwen2.5:32b',
  classification:'llama3.1:8b',
  routing:       'llama3.1:8b',
  summary:       'llama3.1:8b',
  fast:          'llama3.1:8b',
  general:       'qwen2.5:32b',
};

/**
 * Check if Ollama is running and accessible.
 */
export async function ollamaHealthCheck() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { healthy: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    const models = (data.models || []).map(m => m.name);
    return { healthy: true, models };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}

/**
 * Generate text with Ollama (completion mode).
 *
 * @param {Object} opts
 * @param {string} opts.prompt - The prompt
 * @param {string} [opts.model] - Model name (default: route by task)
 * @param {string} [opts.task] - Task type for auto-routing (screenplay, content, fast, etc.)
 * @param {string} [opts.system] - System prompt
 * @param {number} [opts.temperature=0.7] - Temperature
 * @param {string} [opts.format] - 'json' for JSON mode
 * @param {number} [opts.timeout=120000] - Timeout in ms
 * @returns {Promise<{text: string, model: string, totalDuration: number, tokensPerSecond: number}>}
 */
export async function ollamaGenerate(opts) {
  const {
    prompt,
    model: modelOverride,
    task = 'general',
    system,
    temperature = 0.7,
    format,
    timeout = 120000,
  } = opts;

  const model = modelOverride || MODEL_ROUTES[task] || MODEL_ROUTES.general;

  const body = {
    model,
    prompt,
    stream: false,
    options: { temperature },
  };
  if (system) body.system = system;
  if (format === 'json') body.format = 'json';

  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama generate failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();

  return {
    text: data.response || '',
    model,
    totalDuration: data.total_duration ? (data.total_duration / 1e9).toFixed(1) + 's' : 'unknown',
    tokensPerSecond: data.eval_count && data.eval_duration
      ? Math.round(data.eval_count / (data.eval_duration / 1e9))
      : 0,
  };
}

/**
 * Chat with Ollama (multi-turn mode).
 *
 * @param {Object} opts
 * @param {Array<{role: string, content: string}>} opts.messages - Chat messages
 * @param {string} [opts.model] - Model name
 * @param {string} [opts.task] - Task type for auto-routing
 * @param {number} [opts.temperature=0.7]
 * @param {string} [opts.format] - 'json' for JSON mode
 * @param {number} [opts.timeout=120000]
 * @returns {Promise<{text: string, model: string, totalDuration: string, tokensPerSecond: number}>}
 */
export async function ollamaChat(opts) {
  const {
    messages,
    model: modelOverride,
    task = 'general',
    temperature = 0.7,
    format,
    timeout = 120000,
  } = opts;

  const model = modelOverride || MODEL_ROUTES[task] || MODEL_ROUTES.general;

  const body = {
    model,
    messages,
    stream: false,
    options: { temperature },
  };
  if (format === 'json') body.format = 'json';

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama chat failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();

  return {
    text: data.message?.content || '',
    model,
    totalDuration: data.total_duration ? (data.total_duration / 1e9).toFixed(1) + 's' : 'unknown',
    tokensPerSecond: data.eval_count && data.eval_duration
      ? Math.round(data.eval_count / (data.eval_duration / 1e9))
      : 0,
  };
}

/**
 * Fast classification using lightweight model.
 * Returns the model's classification of the input.
 *
 * @param {string} text - Text to classify
 * @param {string[]} categories - Valid categories
 * @param {string} [context] - Optional context for classification
 * @returns {Promise<{category: string, confidence: string, model: string}>}
 */
export async function ollamaClassify(text, categories, context) {
  const prompt = `Classify the following text into exactly one of these categories: ${categories.join(', ')}

${context ? `Context: ${context}\n` : ''}Text: ${text}

Respond with JSON: {"category": "chosen_category", "confidence": "high|medium|low"}`;

  const result = await ollamaGenerate({
    prompt,
    task: 'classification',
    format: 'json',
    temperature: 0.1,
    timeout: 15000,
  });

  try {
    const parsed = JSON.parse(result.text);
    return { ...parsed, model: result.model };
  } catch {
    // Fallback: extract category from text
    const found = categories.find(c => result.text.toLowerCase().includes(c.toLowerCase()));
    return { category: found || categories[0], confidence: 'low', model: result.model };
  }
}

/**
 * Get the best available model for a task, checking what's actually loaded.
 */
export async function getBestModel(task = 'general') {
  const health = await ollamaHealthCheck();
  if (!health.healthy) return null;

  const preferred = MODEL_ROUTES[task] || MODEL_ROUTES.general;
  if (health.models.some(m => m.startsWith(preferred.split(':')[0]))) {
    return preferred;
  }

  // Fallback: use whatever's available
  if (health.models.length > 0) return health.models[0];
  return null;
}

// ── Standalone test ──

if (process.argv[1]?.includes('ollama-engine')) {
  console.log('\n  Ollama Engine — Health Check');
  console.log('  ' + '='.repeat(40));

  const health = await ollamaHealthCheck();
  if (!health.healthy) {
    console.log(`  Status: OFFLINE (${health.error})`);
    console.log('  Run: ollama serve');
    process.exit(1);
  }

  console.log(`  Status: ONLINE`);
  console.log(`  Models: ${health.models.join(', ')}`);
  console.log();

  // Quick test with fastest model
  console.log('  Testing llama3.1:8b...');
  try {
    const result = await ollamaGenerate({
      prompt: 'In one sentence, what is machine learning?',
      task: 'fast',
      temperature: 0.3,
      timeout: 30000,
    });
    console.log(`  Model:  ${result.model}`);
    console.log(`  Speed:  ${result.tokensPerSecond} tok/s`);
    console.log(`  Time:   ${result.totalDuration}`);
    console.log(`  Output: ${result.text.trim().slice(0, 200)}`);
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }

  console.log();
}
