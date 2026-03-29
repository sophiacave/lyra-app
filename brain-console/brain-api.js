/**
 * brain-api.js — Multi-provider AI with zero vendor lock-in
 *
 * Priority: Ollama (free local) → Groq (free tier) → OpenRouter (cheap) → Anthropic (premium)
 * Uses raw fetch() — no SDK dependencies
 * Includes token budget tracking and response caching
 */

const Store = require('electron-store');

const PROVIDERS = {
  ollama: {
    name: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434',
    cost: 0, // Free — M3 Max 64GB
    requiresKey: false,
    models: ['qwen2.5:32b', 'llama3.1:8b', 'gpt-oss:20b', 'llama3.1:70b', 'deepseek-r1:8b'],
    defaultModel: 'qwen2.5:32b',
  },
  groq: {
    name: 'Groq (Free Tier)',
    baseUrl: 'https://api.groq.com/openai/v1',
    cost: 0, // Free tier: 30 req/min
    requiresKey: true,
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.3-70b-versatile',
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    cost: 0.001, // ~$0.001/1k tokens
    requiresKey: true,
    models: ['meta-llama/llama-3.1-70b-instruct', 'mistralai/mixtral-8x7b-instruct', 'anthropic/claude-3.5-haiku'],
    defaultModel: 'meta-llama/llama-3.1-70b-instruct',
  },
  anthropic: {
    name: 'Anthropic (Premium)',
    baseUrl: 'https://api.anthropic.com/v1',
    cost: 0.015, // ~$0.015/1k tokens
    requiresKey: true,
    models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250506'],
    defaultModel: 'claude-sonnet-4-20250514',
  },
};

class BrainAPI {
  constructor(brainContext) {
    this.brainContext = brainContext;
    this.conversationHistory = [];
    this.budgetStore = new Store({ name: 'brain-console-budget' });
    this.responseCache = new Map(); // In-memory cache for session
    
    // Circuit breaker state
    this.circuitBreaker = new Map(); // { provider: { failures: 0, state: 'closed'|'open'|'half-open', openedAt: timestamp } }
  }

  /**
   * Check circuit breaker state for a provider
   */
  _checkCircuitBreaker(provider) {
    if (!this.circuitBreaker.has(provider)) {
      this.circuitBreaker.set(provider, { failures: 0, state: 'closed', openedAt: null });
    }
    
    const state = this.circuitBreaker.get(provider);
    const now = Date.now();
    
    // If open, check if 60 seconds have passed
    if (state.state === 'open') {
      if (now - state.openedAt >= 60000) {
        // Transition to half-open
        state.state = 'half-open';
        console.log(`[CircuitBreaker] ${provider} half-open (allowing test request)`);
      } else {
        throw new Error(`Provider ${provider} is unavailable (circuit open). Retry in ${Math.ceil((60000 - (now - state.openedAt)) / 1000)}s.`);
      }
    }
    
    return state;
  }

  /**
   * Record success on provider — reset failure count
   */
  _recordSuccess(provider) {
    const state = this.circuitBreaker.get(provider);
    if (state) {
      state.failures = 0;
      if (state.state === 'half-open') {
        state.state = 'closed';
        console.log(`[CircuitBreaker] ${provider} closed (recovered)`);
      }
    }
  }

  /**
   * Record failure on provider — increment and open if threshold reached
   */
  _recordFailure(provider) {
    const state = this.circuitBreaker.get(provider);
    if (state) {
      state.failures++;
      if (state.failures >= 3 && state.state !== 'open') {
        state.state = 'open';
        state.openedAt = Date.now();
        console.log(`[CircuitBreaker] ${provider} opened (3 consecutive failures)`);
      }
    }
  }

  /**
   * Get circuit breaker status for all providers
   */
  getCircuitState() {
    const result = {};
    for (const provider of Object.keys(PROVIDERS)) {
      if (!this.circuitBreaker.has(provider)) {
        this.circuitBreaker.set(provider, { failures: 0, state: 'closed', openedAt: null });
      }
      result[provider] = { ...this.circuitBreaker.get(provider) };
    }
    return result;
  }

  /**
   * Get the active provider based on config + availability
   */
  getActiveProvider() {
    const config = this.brainContext.getConfig();
    const preferred = config.aiProvider || 'ollama';
    return { id: preferred, ...PROVIDERS[preferred] };
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

  /**
   * Check if Ollama is running locally
   */
  async checkOllama() {
    try {
      const res = await this.fetchWithTimeout('http://localhost:11434/api/tags', {}, 2000);
      if (res.ok) {
        const data = await res.json();
        return { available: true, models: data.models?.map(m => m.name) || [] };
      }
      return { available: false };
    } catch {
      return { available: false };
    }
  }

  /**
   * Auto-detect best available provider (free first)
   */
  async detectBestProvider() {
    // 1. Try Ollama (free, local)
    const ollama = await this.checkOllama();
    if (ollama.available) return { id: 'ollama', ...PROVIDERS.ollama, detectedModels: ollama.models };

    // 2. Try Groq (free tier)
    const config = this.brainContext.getConfig();
    if (config.groqKey) return { id: 'groq', ...PROVIDERS.groq };

    // 3. Try OpenRouter (cheap)
    if (config.openrouterKey) return { id: 'openrouter', ...PROVIDERS.openrouter };

    // 4. Anthropic (premium fallback)
    if (config.anthropicKey) return { id: 'anthropic', ...PROVIDERS.anthropic };

    return null; // No provider available
  }

  /**
   * Get token budget status
   */
  getBudget() {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const budget = this.budgetStore.get(`budget.${monthKey}`, {
      tokensUsed: 0,
      requestCount: 0,
      estimatedCost: 0,
      limit: 100000, // Default 100k tokens/month
    });
    return { ...budget, monthKey };
  }

  /**
   * Check if monthly token budget is exceeded
   */
  isBudgetExceeded() {
    const budget = this.getBudget();
    return budget.tokensUsed >= budget.limit;
  }

  /**
   * Track token usage
   */
  trackUsage(provider, inputTokens, outputTokens) {
    const budget = this.getBudget();
    const total = inputTokens + outputTokens;
    const providerInfo = PROVIDERS[provider] || {};
    const cost = (total / 1000) * (providerInfo.cost || 0);

    const updated = {
      tokensUsed: budget.tokensUsed + total,
      requestCount: budget.requestCount + 1,
      estimatedCost: budget.estimatedCost + cost,
      limit: budget.limit,
    };

    this.budgetStore.set(`budget.${budget.monthKey}`, updated);
    return { ...updated, thisRequest: { tokens: total, cost } };
  }

  /**
   * Check if a query can be answered from cache
   */
  getCachedResponse(message) {
    // Exact match cache
    const cacheKey = message.trim().toLowerCase();
    if (this.responseCache.has(cacheKey)) {
      const cached = this.responseCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 600000) { // 10 min cache
        return cached.response;
      }
    }
    return null;
  }

  /**
   * Send message to active provider — unified interface
   */
  async sendMessage(userMessage) {
    // Check budget first
    if (this.isBudgetExceeded()) {
      throw new Error('Monthly token budget exceeded. Use /upgrade or increase budget in Settings.');
    }

    // Check cache first
    const cached = this.getCachedResponse(userMessage);
    if (cached) return { ...cached, fromCache: true };

    const config = this.brainContext.getConfig();
    const provider = this.getActiveProvider();
    const systemPrompt = this.brainContext.buildSystemPrompt();

    // Check circuit breaker
    this._checkCircuitBreaker(provider.id);

    this.conversationHistory.push({ role: 'user', content: userMessage });

    let response;
    try {
      switch (provider.id) {
        case 'ollama':
          response = await this._sendOllama(systemPrompt, config);
          break;
        case 'groq':
          response = await this._sendOpenAICompat(
            provider.baseUrl, config.groqKey, config.groqModel || provider.defaultModel, systemPrompt, config
          );
          break;
        case 'openrouter':
          response = await this._sendOpenAICompat(
            provider.baseUrl, config.openrouterKey, config.openrouterModel || provider.defaultModel, systemPrompt, config
          );
          break;
        case 'anthropic':
          response = await this._sendAnthropic(systemPrompt, config);
          break;
        default:
          throw new Error(`Unknown provider: ${provider.id}`);
      }
      
      this._recordSuccess(provider.id);
    } catch (error) {
      this._recordFailure(provider.id);
      throw error;
    }

    this.conversationHistory.push({ role: 'assistant', content: response.text });

    // Cache the response
    const cacheKey = userMessage.trim().toLowerCase();
    this.responseCache.set(cacheKey, { ...response, timestamp: Date.now() });

    // Track usage
    const budget = this.trackUsage(provider.id, response.inputTokens || 0, response.outputTokens || 0);
    response.budget = budget;
    response.provider = provider.name;

    return response;
  }

  /**
   * Stream message (for providers that support it)
   */
  async streamMessage(userMessage, onChunk) {
    // Check budget first
    if (this.isBudgetExceeded()) {
      throw new Error('Monthly token budget exceeded. Use /upgrade or increase budget in Settings.');
    }

    const config = this.brainContext.getConfig();
    const provider = this.getActiveProvider();
    const systemPrompt = this.brainContext.buildSystemPrompt();

    // Check circuit breaker
    this._checkCircuitBreaker(provider.id);

    this.conversationHistory.push({ role: 'user', content: userMessage });

    let fullText = '';

    try {
      switch (provider.id) {
        case 'ollama':
          fullText = await this._streamOllama(systemPrompt, config, onChunk);
          break;
        case 'groq':
          fullText = await this._streamOpenAICompat(
            provider.baseUrl, config.groqKey, config.groqModel || provider.defaultModel, systemPrompt, config, onChunk
          );
          break;
        case 'openrouter':
          fullText = await this._streamOpenAICompat(
            provider.baseUrl, config.openrouterKey, config.openrouterModel || provider.defaultModel, systemPrompt, config, onChunk
          );
          break;
        case 'anthropic':
          fullText = await this._streamAnthropic(systemPrompt, config, onChunk);
          break;
      }
      
      this._recordSuccess(provider.id);
    } catch (error) {
      this._recordFailure(provider.id);
      throw error;
    }

    this.conversationHistory.push({ role: 'assistant', content: fullText });
    this.trackUsage(provider.id, userMessage.length / 4, fullText.length / 4); // Rough estimate
    return fullText;
  }

  // ============ PROVIDER IMPLEMENTATIONS ============

  /**
   * Ollama — completely free, local inference
   */
  async _sendOllama(systemPrompt, config) {
    const model = config.ollamaModel || 'llama3.1:8b';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory,
    ];

    const res = await this.fetchWithTimeout('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false }),
    });

    const data = await res.json();
    return {
      text: data.message?.content || '',
      model,
      inputTokens: data.prompt_eval_count || 0,
      outputTokens: data.eval_count || 0,
    };
  }

  async _streamOllama(systemPrompt, config, onChunk) {
    const model = config.ollamaModel || 'llama3.1:8b';
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory,
    ];

    const res = await this.fetchWithTimeout('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    });

    let fullText = '';
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim()) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              fullText += json.message.content;
              onChunk(json.message.content);
            }
          } catch {}
        }
      }
    }
    return fullText;
  }

  /**
   * OpenAI-compatible API (Groq, OpenRouter, etc.)
   */
  async _sendOpenAICompat(baseUrl, apiKey, model, systemPrompt, config) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory,
    ];

    const res = await this.fetchWithTimeout(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: config.maxTokens || 4096,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

    return {
      text: data.choices?.[0]?.message?.content || '',
      model: data.model,
      inputTokens: data.usage?.prompt_tokens || 0,
      outputTokens: data.usage?.completion_tokens || 0,
    };
  }

  async _streamOpenAICompat(baseUrl, apiKey, model, systemPrompt, config, onChunk) {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory,
    ];

    const res = await this.fetchWithTimeout(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: config.maxTokens || 4096,
        stream: true,
      }),
    });

    let fullText = '';
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const json = JSON.parse(line.slice(6));
            const text = json.choices?.[0]?.delta?.content;
            if (text) {
              fullText += text;
              onChunk(text);
            }
          } catch {}
        }
      }
    }
    return fullText;
  }

  /**
   * Anthropic — raw fetch, no SDK needed
   */
  async _sendAnthropic(systemPrompt, config) {
    const model = config.anthropicModel || 'claude-sonnet-4-20250514';

    const res = await this.fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: config.maxTokens || 4096,
        system: systemPrompt,
        messages: this.conversationHistory,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    return {
      text: data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || '',
      model: data.model,
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
    };
  }

  async _streamAnthropic(systemPrompt, config, onChunk) {
    const model = config.anthropicModel || 'claude-sonnet-4-20250514';

    const res = await this.fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: config.maxTokens || 4096,
        system: systemPrompt,
        messages: this.conversationHistory,
        stream: true,
      }),
    });

    let fullText = '';
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.type === 'content_block_delta' && json.delta?.text) {
              fullText += json.delta.text;
              onChunk(json.delta.text);
            }
          } catch {}
        }
      }
    }
    return fullText;
  }

  clearConversation() {
    this.conversationHistory = [];
    this.responseCache.clear();
  }

  getProviders() { return PROVIDERS; }
  getConversationLength() { return this.conversationHistory.length; }
}

module.exports = { BrainAPI };
