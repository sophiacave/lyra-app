---
title: "Cost Optimization at Scale"
course: "ai-systems-design"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Cost Optimization <span class="accent">at Scale.</span></h1>
  <p class="sub">Caching, model routing, and token budgets that save thousands monthly.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to audit and attribute AI costs across your system</li>
    <li>Token budget strategies that prevent runaway spending</li>
    <li>Model routing economics: when cheap models beat expensive ones</li>
    <li>Prompt engineering techniques that reduce costs 30-50% without quality loss</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Cost Iceberg</h2>

Most teams know their monthly API bill. Few know where the money actually goes. Cost optimization starts with attribution -- understanding exactly which features, users, and requests drive spending.

```python
class CostTracker:
    def log_call(self, model, input_tokens, output_tokens, metadata):
        cost = self.calculate_cost(model, input_tokens, output_tokens)
        self.store({
            "cost_usd": cost,
            "model": model,
            "feature": metadata.get("feature"),
            "user_tier": metadata.get("user_tier"),
            "cache_miss": metadata.get("cache_miss", True),
            "timestamp": datetime.utcnow(),
        })

    def calculate_cost(self, model, input_tok, output_tok):
        rates = {
            "claude-opus-4-20250514":   {"input": 15.0, "output": 75.0},
            "claude-sonnet-4-20250514": {"input": 3.0,  "output": 15.0},
            "claude-haiku":             {"input": 0.25, "output": 1.25},
            "gpt-4o":                   {"input": 2.5,  "output": 10.0},
            "gpt-4o-mini":              {"input": 0.15, "output": 0.60},
        }
        r = rates[model]
        return (input_tok * r["input"] + output_tok * r["output"]) / 1_000_000
```

Once you have attribution, patterns emerge. Common findings: 20% of features drive 80% of cost. Free-tier users on expensive models burn money. Retry storms on failed calls double bills silently. Long system prompts duplicated across every call waste input tokens.

<div class="callout">
<strong>Real numbers:</strong> Claude Opus at 15/75 per MTok vs. Haiku at 0.25/1.25 per MTok means Opus is 60x more expensive on input. A 2,000-token system prompt sent with every request costs $0.03/call on Opus vs $0.0005/call on Haiku. At 10K calls/day, that's $300/day vs $5/day -- just for the system prompt.
</div>
</div>

<div class="lesson-section">
<h2>Token Budget Strategies</h2>

Token budgets set hard limits on how many tokens a request can consume, preventing runaway costs from long inputs, verbose outputs, or unbounded agent loops.

```python
class TokenBudget:
    def __init__(self, max_input=4000, max_output=2000, max_total=8000):
        self.max_input = max_input
        self.max_output = max_output
        self.max_total = max_total
        self.spent = 0

    def can_afford(self, estimated_tokens):
        return self.spent + estimated_tokens <= self.max_total

    def truncate_context(self, documents, budget):
        """Fit documents within budget, prioritizing by relevance."""
        selected = []
        remaining = budget
        for doc in sorted(documents, key=lambda d: d.score, reverse=True):
            if doc.token_count <= remaining:
                selected.append(doc)
                remaining -= doc.token_count
        return selected
```

Three levels of budget enforcement:

1. **Request-level**: Cap tokens per individual API call. Prevents single-call blowups.
2. **Session-level**: Cap total tokens for an entire user session or agent run. Prevents infinite loops.
3. **User-level**: Daily or monthly caps per user or API key. Prevents abuse and enables tiered pricing.

<div class="tip-box">
<strong>Output token trick:</strong> Setting a lower <code>max_tokens</code> on the API call doesn't just save money -- it forces the model to be concise. For many tasks, 500 output tokens produces a better response than 4,000 because the model prioritizes essential information.
</div>
</div>

<div class="lesson-section">
<h2>Model Routing Economics</h2>

The highest-leverage cost optimization is using the right model for each task. Not every request needs frontier intelligence.

```python
class EconomicRouter:
    async def route(self, request):
        complexity = await self.estimate_complexity(request)

        if complexity == "trivial":
            # FAQ, simple lookups, formatting
            return ModelConfig("gpt-4o-mini", max_tokens=200)    # ~$0.0001

        elif complexity == "standard":
            # Summarization, extraction, basic analysis
            return ModelConfig("claude-haiku", max_tokens=1000)  # ~$0.001

        elif complexity == "advanced":
            # Reasoning, coding, nuanced writing
            return ModelConfig("claude-sonnet-4-20250514", max_tokens=2000)  # ~$0.01

        else:
            # Complex research, multi-step reasoning
            return ModelConfig("claude-opus-4-20250514", max_tokens=4000)   # ~$0.10

    async def estimate_complexity(self, request):
        # Rules-based first (free)
        if request.type in ("faq", "status", "greeting"):
            return "trivial"
        if len(request.text.split()) < 20:
            return "standard"
        # ML classifier for ambiguous cases (cheap)
        return await self.classifier.predict(request.text)
```

The complexity classifier is critical. A fine-tuned small model or even a heuristic rules engine can classify 80% of requests correctly. The remaining 20% default to a higher tier -- this is acceptable because you've already saved on the majority.

<div class="callout">
<strong>Measured impact:</strong> Teams implementing model routing typically see 40-60% cost reduction with less than 5% quality degradation on user-facing metrics. The key is measuring quality per-tier to ensure your cheap path actually satisfies users.
</div>
</div>

<div class="lesson-section">
<h2>Prompt Engineering for Cost</h2>

Your prompts are your biggest controllable cost lever. Shorter prompts with the same effectiveness save both input and output tokens.

**Technique 1: System prompt compression.** Rewrite verbose instructions as concise rules.
```
# Before (340 tokens):
"You are a helpful customer support agent for Acme Corp. You should
always be polite and professional. When a customer asks about..."

# After (120 tokens):
"Role: Acme support agent. Rules: 1) Professional tone 2) Cite docs
3) Escalate billing disputes 4) Never promise refunds without approval."
```

**Technique 2: Few-shot pruning.** Use 1-2 examples instead of 5-6. Most models only need one good example to understand the pattern.

**Technique 3: Context window management.** Don't stuff the entire document into context. Retrieve only the relevant chunks and summarize long contexts before passing them to the final generation step.

**Technique 4: Structured output.** Request JSON instead of prose. JSON responses are typically 40-60% shorter and easier to parse.

```python
# Instead of: "Explain the sentiment and key topics"
# Use: "Return JSON: {sentiment: pos|neg|neutral, topics: [str], confidence: float}"
```
</div>

<div class="lesson-section">
<h2>The Cost Dashboard</h2>

Build a dashboard that answers these questions daily:

- What is my cost per successful request? (Not just per API call -- include retries and failed attempts.)
- What is my cost per user segment? (Free vs. paid, power users vs. casual.)
- Which features have the worst cost-to-value ratio?
- What percentage of requests hit the cache?
- How much am I spending on retries?

Set budget alerts at 80% and 100% of your monthly target. Set anomaly alerts for any single hour that exceeds 3x the hourly average. These alerts have saved teams from five-figure surprise bills caused by prompt template bugs or retry storms.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the highest-leverage AI cost optimization?", "options": ["Negotiating volume discounts with providers", "Using the right model for each task&#39;s complexity level", "Reducing the number of API calls", "Switching to open-source models exclusively"], "correct": 1, "explanation": "Model routing -- using cheap models for simple tasks and expensive models only for complex ones -- typically reduces costs 40-60%. The price difference between model tiers (60x between Opus and Haiku) makes this the highest-impact lever."}, {"q": "How does setting a lower max_tokens improve responses beyond cost savings?", "options": ["It makes the model think harder", "It forces the model to prioritize essential information, often producing more concise and focused output", "It reduces latency but not quality", "It has no effect on quality"], "correct": 1, "explanation": "A lower max_tokens constraint forces the model to be concise and prioritize essential information. For many tasks, 500 tokens produces a better, more focused response than an unconstrained 4,000-token output."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the three levels of token budget enforcement?", "back": "1) Request-level: cap tokens per API call. 2) Session-level: cap total tokens for an agent run or session. 3) User-level: daily/monthly caps per user or API key for abuse prevention and tiered pricing."}, {"front": "How much more expensive is Claude Opus vs. Haiku on input tokens?", "back": "Approximately 60x. Opus is $15/MTok input vs. Haiku at $0.25/MTok. A 2,000-token system prompt costs $0.03/call on Opus vs. $0.0005/call on Haiku."}, {"front": "Name four prompt engineering techniques that reduce cost.", "back": "1) System prompt compression (concise rules). 2) Few-shot pruning (1-2 examples, not 5-6). 3) Context window management (retrieve relevant chunks only). 4) Structured output (JSON instead of prose, 40-60% shorter)."}, {"front": "What should a cost dashboard answer daily?", "back": "Cost per successful request, cost per user segment, worst cost-to-value features, cache hit rate, and retry spending. Set budget alerts at 80%/100% and anomaly alerts for 3x hourly average."}, {"front": "What quality guard is essential when implementing model routing?", "back": "Measure quality per-tier to ensure the cheap path satisfies users. Route 80% of traffic to cheaper models, but verify with eval scores that quality degradation stays under 5% on user-facing metrics."}]}'></div>

</div>