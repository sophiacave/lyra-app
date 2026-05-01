---
title: "Multi-Model Routing & Fallbacks"
course: "ai-systems-design"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Multi-Model Routing <span class="accent">& Fallbacks.</span></h1>
  <p class="sub">Orchestrating multiple models for cost, speed, and resilience.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to build a unified model abstraction layer across providers</li>
    <li>Routing strategies: rule-based, classifier-based, and cascading</li>
    <li>Fallback chains that degrade gracefully without user impact</li>
    <li>A/B testing and canary deployments for model changes</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Model Abstraction Layer</h2>

Coupling your application to a single model is a business risk. Models get deprecated, pricing changes, quality fluctuates, and outages happen. A model abstraction layer decouples your application logic from any specific provider.

```python
class ModelClient:
    """Unified interface across all providers."""

    def __init__(self):
        self.providers = {
            "anthropic": AnthropicAdapter(),
            "openai": OpenAIAdapter(),
            "local": OllamaAdapter(),
        }

    async def generate(self, prompt, model_id, **kwargs):
        provider, model = self.parse_model_id(model_id)
        # e.g., "anthropic/claude-sonnet-4-20250514" -> provider=anthropic, model=claude-sonnet-4-20250514
        adapter = self.providers[provider]
        return await adapter.generate(prompt, model, **kwargs)

class AnthropicAdapter:
    async def generate(self, prompt, model, **kwargs):
        response = await self.client.messages.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=kwargs.get("max_tokens", 1024),
        )
        return UnifiedResponse(
            text=response.content[0].text,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            model=model,
            provider="anthropic",
        )
```

Every adapter normalizes its provider's response format into a `UnifiedResponse`. Your application code never touches provider-specific APIs directly. Switching from Claude to GPT-4 becomes a configuration change, not a code change.

<div class="tip-box">
<strong>Adapter parity:</strong> Not all models support the same features (tool use, vision, structured output, streaming). Your adapter layer should declare capabilities per model so the router can make informed decisions. Don't discover missing features at runtime.
</div>
</div>

<div class="lesson-section">
<h2>Routing Strategies</h2>

Three approaches to deciding which model handles each request:

**Strategy 1: Rule-based routing.** Fastest, cheapest, most transparent. Use when task types are well-defined.

```python
ROUTING_RULES = {
    "classification":  "openai/gpt-4o-mini",       # Fast, cheap, good enough
    "summarization":   "anthropic/claude-haiku",    # Concise, fast
    "code_generation": "anthropic/claude-sonnet-4-20250514",  # Strong at code
    "creative_writing":"anthropic/claude-opus-4-20250514",    # Best quality
    "embedding":       "openai/text-embedding-3-small",
    "translation":     "openai/gpt-4o",             # Strong multilingual
}
```

**Strategy 2: Classifier-based routing.** A small model or ML classifier evaluates each request and selects the appropriate model tier.

```python
class ClassifierRouter:
    async def route(self, request):
        # Score complexity with a lightweight model (~10ms, ~$0.00001)
        complexity = await self.classifier.score(request.text)

        if complexity < 0.3:
            return "openai/gpt-4o-mini"
        elif complexity < 0.7:
            return "anthropic/claude-sonnet-4-20250514"
        else:
            return "anthropic/claude-opus-4-20250514"
```

**Strategy 3: Cascading.** Start with the cheapest model. If its response doesn't pass quality checks, escalate to the next tier. This guarantees quality while minimizing cost.

```python
class CascadingRouter:
    CASCADE = [
        {"model": "openai/gpt-4o-mini", "quality_threshold": 0.8},
        {"model": "anthropic/claude-sonnet-4-20250514", "quality_threshold": 0.7},
        {"model": "anthropic/claude-opus-4-20250514", "quality_threshold": 0.0},  # Always accept
    ]

    async def generate(self, prompt):
        for tier in self.CASCADE:
            response = await self.client.generate(prompt, tier["model"])
            quality = await self.quality_scorer.score(prompt, response)

            if quality >= tier["quality_threshold"]:
                return response  # Good enough for this tier

        return response  # Final tier always returns
```

<div class="callout">
<strong>Cascading trade-off:</strong> Cascading guarantees quality but adds latency for hard requests (potentially 3x the latency if all tiers are tried). Use it for async tasks where latency is acceptable. For real-time chat, classifier-based routing is usually better.
</div>
</div>

<div class="lesson-section">
<h2>Fallback Chains</h2>

Fallbacks handle failures. Routing handles intent. They're different systems that work together.

```python
class FallbackChain:
    def __init__(self):
        self.chains = {
            "anthropic/claude-sonnet-4-20250514": [
                "openai/gpt-4o",                    # Same tier, different provider
                "anthropic/claude-haiku",            # Cheaper, same provider
                "local/llama-3-70b",                 # Self-hosted fallback
            ],
            "openai/gpt-4o": [
                "anthropic/claude-sonnet-4-20250514",
                "openai/gpt-4o-mini",
                "local/llama-3-70b",
            ],
        }

    async def call_with_fallback(self, prompt, primary_model):
        chain = [primary_model] + self.chains.get(primary_model, [])

        for model in chain:
            try:
                response = await self.client.generate(prompt, model)
                if model != primary_model:
                    logger.warning(f"Used fallback: {model} instead of {primary_model}")
                    self.metrics.increment("fallback_used", tags={"from": primary_model, "to": model})
                return response
            except (RateLimitError, TimeoutError, ServerError):
                continue

        # All models failed -- return cached or error
        cached = await self.semantic_cache.get(prompt)
        if cached:
            return cached.with_metadata(stale=True)
        raise AllModelsFailedError("Exhausted fallback chain")
```

Design principles for fallback chains:
- **Cross-provider fallbacks**: If Anthropic is down, fall to OpenAI. Same-provider fallbacks don't help during outages.
- **Local model as last resort**: A self-hosted model (Llama, Mistral) that never has rate limits or outages serves as the ultimate backstop.
- **Cache as final fallback**: Serving a slightly stale cached response beats returning an error.
- **Track fallback usage**: If fallbacks fire frequently, your primary model selection or capacity planning needs adjustment.

<div class="tip-box">
<strong>Prompt compatibility:</strong> Different models respond differently to the same prompt. Maintain model-specific prompt variants in your prompt registry. When falling back from Claude to GPT-4, swap the prompt template too.
</div>
</div>

<div class="lesson-section">
<h2>A/B Testing Model Changes</h2>

Never swap models without measuring the impact. A/B testing for AI is like A/B testing for features, but you're measuring quality, cost, and latency instead of click rates.

```python
class ModelExperiment:
    def __init__(self, control, treatment, traffic_split=0.1):
        self.control = control        # Current model
        self.treatment = treatment    # New model
        self.split = traffic_split    # % of traffic to treatment

    async def route(self, request):
        if hash(request.id) % 100 < self.split * 100:
            model = self.treatment
            variant = "treatment"
        else:
            model = self.control
            variant = "control"

        response = await self.client.generate(request.prompt, model)

        # Log for analysis
        self.log_experiment({
            "variant": variant,
            "model": model,
            "latency_ms": response.latency_ms,
            "cost_usd": response.cost,
            "quality_score": await self.eval.score(request.prompt, response),
        })

        return response
```

Start with 5-10% traffic to the new model. Compare quality scores, latency, and cost over at least 1,000 requests before deciding. Only promote the new model when it's statistically better or equivalent on quality at lower cost.
</div>

<div class="lesson-section">
<h2>The Model Registry</h2>

Centralize all model configuration in a registry that the router, fallback chain, and experiment system reference:

```python
MODEL_REGISTRY = {
    "anthropic/claude-opus-4-20250514": {
        "capabilities": ["reasoning", "code", "creative", "vision", "tools"],
        "cost_per_mtok": {"input": 15.0, "output": 75.0},
        "avg_latency_ms": 8000,
        "rate_limit_rpm": 1000,
        "context_window": 200000,
    },
    "openai/gpt-4o-mini": {
        "capabilities": ["classification", "extraction", "simple_generation"],
        "cost_per_mtok": {"input": 0.15, "output": 0.60},
        "avg_latency_ms": 800,
        "rate_limit_rpm": 10000,
        "context_window": 128000,
    },
    # ... more models
}
```

The registry is the single source of truth for capabilities, costs, and constraints. When you add a new model, update the registry. The router and fallback chain adapt automatically.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the main trade-off of cascading model routing?", "options": ["It costs more than other routing strategies", "It adds latency for hard requests that fail quality checks at cheaper tiers", "It requires more models", "It reduces output quality"], "correct": 1, "explanation": "Cascading starts with the cheapest model and escalates if quality is insufficient. For hard requests that fail multiple tiers, latency can be 2-3x higher. Use cascading for async tasks where latency is acceptable, and classifier-based routing for real-time interactions."}, {"q": "Why should fallback chains include cross-provider models?", "options": ["Different providers are cheaper", "Same-provider fallbacks don&#39;t help during provider-wide outages", "Cross-provider produces better quality", "It&#39;s required by SLA agreements"], "correct": 1, "explanation": "If Anthropic has an outage, falling back to another Anthropic model doesn&#39;t help. Cross-provider fallbacks (Anthropic -> OpenAI) ensure your system stays up even when an entire provider goes down."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What is a model abstraction layer?", "back": "A unified interface that normalizes different provider APIs (Anthropic, OpenAI, local) into a common format. Switching models becomes a config change, not a code change. Each adapter declares its capabilities."}, {"front": "What are the three routing strategies?", "back": "1) Rule-based: map task types to models statically. 2) Classifier-based: ML model scores complexity and selects tier. 3) Cascading: start cheap, escalate if quality fails. Each has different latency/cost trade-offs."}, {"front": "What are the four design principles for fallback chains?", "back": "1) Cross-provider fallbacks for outage resilience. 2) Local model as ultimate backstop. 3) Semantic cache as final fallback. 4) Track fallback usage to detect capacity issues."}, {"front": "How should you A/B test model changes?", "back": "Start with 5-10% traffic to the new model. Compare quality scores, latency, and cost over 1,000+ requests. Only promote when statistically better or equivalent on quality at lower cost."}, {"front": "What does a model registry contain?", "back": "Capabilities, cost per MTok, average latency, rate limits, and context window for each model. It&#39;s the single source of truth that the router, fallback chain, and experiment system all reference."}]}'></div>

</div>