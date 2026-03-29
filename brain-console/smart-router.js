/**
 * smart-router.js — Faye Intelligent Router
 *
 * TOKEN RESILIENCE: qwen2.5:32b handles tiers 1-3 locally.
 * Claude is ONLY for tier 4 (extreme complexity). If Claude is unavailable,
 * qwen2.5:32b handles everything — zero capability loss.
 *
 * Complexity tiers:
 *   TIER 0 — Local Engine (zero tokens): data queries, commands, CRUD
 *   TIER 1 — Fast (Ollama llama3.1:8b): simple Q&A, formatting, classification
 *   TIER 2 — Standard (Ollama qwen2.5:32b): analysis, code gen, planning, content
 *   TIER 3 — Heavy (Ollama qwen2.5:32b): complex reasoning, long-form, multi-step
 *   TIER 4 — Premium (Anthropic): ONLY if explicitly requested or qwen fails
 */

class SmartRouter {
  constructor(brainAPI) {
    this.brainAPI = brainAPI;
  }

  classifyMessage(message) {
    const msg = message.toLowerCase().trim();
    const wordCount = msg.split(/\s+/).length;

    // Explicit Claude request
    if (/\b(use claude|ask claude|claude mode|premium mode)\b/i.test(msg)) {
      return { tier: 4, reason: 'Explicit Claude request' };
    }

    // TIER 1 — Simple
    const tier1Patterns = [
      /^(what|who|when|where|how) (is|are|was|were|do|does|did)\b/,
      /^(explain|define|describe|summarize)\b.{0,80}$/,
      /^(translate|format|reformat|convert)\b/,
      /^(yes|no|ok|sure|thanks|got it)/,
    ];

    // TIER 3 — Complex (but qwen handles these fine)
    const tier3Patterns = [
      /\b(write|create|draft|compose) (a |an |the )?(detailed|comprehensive|full|complete|long)/i,
      /\b(analyze|evaluate|assess|critique|review) .{50,}/i,
      /\b(strategy|strategic|plan|roadmap|architecture)\b.*\b(for|to|how)\b/i,
      /\b(compare|contrast|pros and cons|trade-?offs)\b.*\b(between|of|for)\b/i,
      /\b(debug|fix|refactor|optimize) .{100,}/i,
      /\b(build|implement|design|architect)\b.*\b(system|feature|service|api)\b/i,
      /step.?by.?step|multi.?step|detailed plan/i,
      /\b(screenplay|lesson|course|curriculum)\b/i,
    ];

    // Check tier 3 first
    for (const p of tier3Patterns) {
      if (p.test(msg)) return { tier: 3, reason: 'Complex task — qwen2.5:32b' };
    }

    if (wordCount > 150) return { tier: 3, reason: `Long message (${wordCount} words)` };
    if (wordCount > 50) return { tier: 2, reason: `Medium message (${wordCount} words)` };

    // Check tier 1
    for (const p of tier1Patterns) {
      if (p.test(msg)) return { tier: 1, reason: 'Simple query — fast model' };
    }

    // Short questions
    if (msg.endsWith('?') && wordCount < 15) return { tier: 1, reason: 'Short question' };

    return { tier: 2, reason: 'General query' };
  }

  /**
   * V3: Ollama handles ALL tiers by default. Claude only for tier 4.
   */
  async getProviderForTier(tier) {
    const config = this.brainAPI.brainContext.getConfig();

    // TOKEN RESILIENCE: Ollama first for EVERY tier
    const ollama = await this.brainAPI.checkOllama();

    if (tier <= 3 && ollama.available) {
      // Use fast model for tier 1, primary for 2-3
      return { id: 'ollama', available: true, model: tier === 1 ? 'llama3.1:8b' : (config.ollamaModel || 'qwen2.5:32b') };
    }

    // Tier 4 or Ollama unavailable — try cloud providers
    const cloudPriority = tier === 4
      ? ['anthropic', 'openrouter', 'groq', 'ollama']
      : ['groq', 'openrouter', 'anthropic'];

    for (const id of cloudPriority) {
      if (id === 'ollama' && ollama.available) return { id, available: true };
      if (id === 'groq' && config.groqKey) return { id, available: true };
      if (id === 'openrouter' && config.openrouterKey) return { id, available: true };
      if (id === 'anthropic' && config.anthropicKey) return { id, available: true };
    }

    // Last resort: Ollama even for tier 4
    if (ollama.available) return { id: 'ollama', available: true };

    return null;
  }

  async route(message) {
    const classification = this.classifyMessage(message);

    // Budget pressure → force local
    const budget = this.brainAPI.getBudget();
    if (budget.limit > 0) {
      const pct = (budget.tokensUsed / budget.limit) * 100;
      if (pct > 90 && classification.tier > 1) {
        classification.tier = Math.min(classification.tier, 2);
        classification.reason += ' (budget >90% — forced local)';
      }
    }

    const provider = await this.getProviderForTier(classification.tier);

    return {
      ...classification,
      provider: provider?.id || null,
      providerAvailable: !!provider,
      model: provider?.model,
    };
  }
}

module.exports = { SmartRouter };
