---
title: "Reliability & Fault Tolerance"
course: "ai-systems-design"
order: 3
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Reliability & <span class="accent">Fault Tolerance.</span></h1>
  <p class="sub">Building AI systems that survive the chaos of production.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to implement retries with exponential backoff and jitter</li>
    <li>Circuit breaker patterns for AI API calls</li>
    <li>Fallback strategies: model degradation, cached responses, graceful failure</li>
    <li>Timeout budgets and how to prevent cascading failures</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Reliability Imperative</h2>

AI APIs fail. OpenAI has outages. Anthropic rate-limits you. Your vector database hiccups during peak load. Network partitions happen. The question is never "will my system fail?" -- it's "what happens when it does?"

Production AI systems face unique reliability challenges that traditional web services don't:

- **Non-deterministic outputs**: The same input can produce different outputs, making retries semantically complex.
- **Long-running calls**: A single model call can take 5-30 seconds, making timeout management critical.
- **Cascading token costs**: Each retry costs money. Naive retry logic on expensive models can blow your budget in minutes.
- **Provider dependencies**: You're relying on third-party APIs with their own SLAs (or lack thereof).

<div class="callout">
<strong>Industry data:</strong> OpenAI's API has historically averaged 99.5-99.8% uptime. That sounds high until you do the math: 99.5% uptime means ~43 minutes of downtime per week. If you serve 1,000 requests per hour, that's 700+ failed requests weekly.
</div>
</div>

<div class="lesson-section">
<h2>Retries Done Right</h2>

Naive retries (just try again immediately) make everything worse. They amplify load on an already struggling service, increase your costs, and can trigger rate limits that cascade into longer outages.

```python
import asyncio
import random

async def retry_with_backoff(
    fn,
    max_retries=3,
    base_delay=1.0,
    max_delay=30.0,
    retryable_errors=(RateLimitError, TimeoutError, ServerError)
):
    for attempt in range(max_retries + 1):
        try:
            return await fn()
        except retryable_errors as e:
            if attempt == max_retries:
                raise

            # Exponential backoff with full jitter
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter = random.uniform(0, delay)
            actual_delay = jitter

            logger.warning(
                f"Attempt {attempt + 1} failed: {e}. "
                f"Retrying in {actual_delay:.1f}s"
            )
            await asyncio.sleep(actual_delay)
```

Three rules for AI retries:

1. **Only retry transient errors.** A 400 (bad request) will fail every time. A 429 (rate limit) or 503 (overloaded) is worth retrying.
2. **Use full jitter.** Without jitter, all clients retry at the same time, creating a thundering herd that re-crashes the service.
3. **Cap your retry budget.** Three retries with exponential backoff is usually sufficient. More than five is almost never the right answer.

<div class="tip-box">
<strong>Cost awareness:</strong> If you're retrying Claude Opus calls, each retry costs the same as the original. Three retries on a $0.15 call means you might spend $0.60 total. Factor retry budgets into your cost models.
</div>
</div>

<div class="lesson-section">
<h2>Circuit Breakers</h2>

When a downstream service is genuinely down, retries are futile. A circuit breaker detects sustained failures and short-circuits calls, returning a fallback immediately instead of waiting for inevitable timeouts.

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = "closed"  # closed = normal, open = blocking
        self.last_failure_time = None

    async def call(self, fn, fallback_fn):
        if self.state == "open":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "half-open"  # Allow one test request
            else:
                return await fallback_fn()  # Skip the call entirely

        try:
            result = await fn()
            if self.state == "half-open":
                self.state = "closed"
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            if self.failure_count >= self.failure_threshold:
                self.state = "open"
            return await fallback_fn()
```

The three states: **Closed** (normal operation), **Open** (all calls short-circuit to fallback), and **Half-Open** (allow one test request to check recovery). This pattern prevents your system from hammering a dead service and lets it recover gracefully.
</div>

<div class="lesson-section">
<h2>Fallback Strategies</h2>

When the primary model or service is unavailable, you need a fallback. The best fallback depends on your use case:

**Model Degradation**: Fall back to a cheaper or faster model.
```python
FALLBACK_CHAIN = [
    {"provider": "anthropic", "model": "claude-sonnet-4-20250514"},
    {"provider": "openai", "model": "gpt-4o"},
    {"provider": "anthropic", "model": "claude-haiku"},
    {"provider": "local", "model": "llama-3-8b"},  # Self-hosted
]
```

**Cached Responses**: Serve a semantically similar previous response.
```python
async def fallback_to_cache(query, threshold=0.85):
    similar = await semantic_cache.search(query, threshold)
    if similar:
        return CachedResponse(similar.response, stale=True)
    return None
```

**Graceful Degradation**: Return a partial or simplified response.
```python
async def graceful_fallback(query):
    return {
        "response": "I can provide a basic answer, but our full "
                     "analysis system is temporarily unavailable.",
        "partial": True,
        "basic_answer": await cheap_model.generate(query),
    }
```

<div class="callout">
<strong>Design principle:</strong> A degraded response is almost always better than an error message. Users tolerate "slightly worse" much better than "completely broken." Design your fallbacks on a spectrum from best to acceptable, never from best to nothing.
</div>
</div>

<div class="lesson-section">
<h2>Timeout Budgets</h2>

Every request to your system has a total time budget. If a user expects a response in 10 seconds, you cannot spend 8 seconds on retrieval, 15 seconds on generation, and 3 seconds on validation. Timeout budgets allocate time across stages.

```python
class TimeoutBudget:
    def __init__(self, total_seconds):
        self.total = total_seconds
        self.start = time.time()

    @property
    def remaining(self):
        elapsed = time.time() - self.start
        return max(0, self.total - elapsed)

    def allocate(self, fraction):
        """Return timeout for a stage as a fraction of remaining budget."""
        return self.remaining * fraction

# Usage
budget = TimeoutBudget(total_seconds=10)
retrieval_result = await retrieve(query, timeout=budget.allocate(0.3))   # 3s
generation_result = await generate(prompt, timeout=budget.allocate(0.8)) # ~5.6s
validated = await validate(result, timeout=budget.allocate(1.0))         # remaining
```

Without timeout budgets, one slow stage consumes the entire allowance, and every downstream stage either races or fails. Budget allocation turns unpredictable timeouts into managed trade-offs.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "Why is &#39;full jitter&#39; important in retry logic?", "options": ["It makes retries faster", "It prevents thundering herd -- all clients retrying simultaneously", "It reduces the number of retries needed", "It&#39;s required by most API providers"], "correct": 1, "explanation": "Without jitter, all clients that failed at the same time will retry at the same time, creating a thundering herd that re-crashes the already struggling service. Full jitter randomizes retry timing to spread load."}, {"q": "What are the three states of a circuit breaker?", "options": ["Active, Inactive, Recovery", "Open, Closed, Half-Open", "Green, Yellow, Red", "Normal, Alert, Critical"], "correct": 1, "explanation": "Closed (normal operation, requests pass through), Open (failures exceeded threshold, all calls short-circuit to fallback), and Half-Open (allow one test request to check if the service has recovered)."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What does 99.5% uptime actually mean in practice?", "back": "About 43 minutes of downtime per week. At 1,000 requests/hour, that&#39;s 700+ failed requests weekly. High uptime percentages can mask significant real-world impact."}, {"front": "What are the three rules for AI retries?", "back": "1) Only retry transient errors (429, 503), not client errors (400). 2) Use full jitter to prevent thundering herd. 3) Cap your retry budget (3 retries is usually sufficient)."}, {"front": "Why is a degraded response better than an error message?", "back": "Users tolerate &#39;slightly worse&#39; much better than &#39;completely broken.&#39; Design fallbacks on a spectrum from best to acceptable, never from best to nothing."}, {"front": "What is a timeout budget?", "back": "A mechanism that allocates a total time budget across processing stages. Each stage gets a fraction of remaining time, preventing one slow stage from consuming the entire allowance."}, {"front": "What is the model degradation fallback pattern?", "back": "A chain of progressively cheaper/faster models: e.g., Claude Sonnet -> GPT-4o -> Claude Haiku -> local Llama. When the primary fails, fall through to the next available model."}]}'></div>

</div>