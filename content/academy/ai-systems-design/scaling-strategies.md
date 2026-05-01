---
title: "Scaling Strategies"
course: "ai-systems-design"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Scaling <span class="accent">Strategies.</span></h1>
  <p class="sub">Horizontal, vertical, and queue-based scaling for AI workloads.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Why AI workloads scale differently than traditional web services</li>
    <li>Horizontal scaling patterns: load balancing, stateless design, provider pooling</li>
    <li>Queue-based architectures for long-running AI tasks</li>
    <li>Auto-scaling strategies that balance cost and performance</li>
  </ul>
</div>

<div class="lesson-section">
<h2>AI Scaling is Different</h2>

Traditional web scaling assumes requests are fast (sub-100ms), stateless, and cheap. AI workloads violate all three assumptions:

- **Slow**: A single model call can take 5-30 seconds. Streaming helps UX but doesn't reduce compute time.
- **Expensive**: Each request consumes real resources (tokens, GPU time) that cost money. You can't just add servers to make costs disappear.
- **Bursty**: AI usage patterns spike unpredictably. A viral tweet mentioning your product can 10x traffic in an hour.
- **Rate-limited**: Third-party APIs impose per-minute and per-day limits that become your bottleneck.

These characteristics mean standard auto-scaling rules (scale when CPU > 70%) don't work. You need AI-aware scaling strategies.

<div class="callout">
<strong>The rate limit wall:</strong> OpenAI's Tier 1 limits are ~500 RPM for GPT-4. If you have 100 concurrent users each making 5 requests per minute, you've already exceeded your limit. Scaling your servers does nothing -- the bottleneck is the API provider, not your infrastructure.
</div>
</div>

<div class="lesson-section">
<h2>Horizontal Scaling: Provider Pooling</h2>

When a single API provider can't handle your load, distribute across multiple providers. This is provider pooling -- the AI equivalent of database read replicas.

```python
class ProviderPool:
    def __init__(self):
        self.providers = [
            Provider("anthropic", rpm_limit=1000, weight=0.5),
            Provider("openai", rpm_limit=500, weight=0.3),
            Provider("local_llama", rpm_limit=9999, weight=0.2),
        ]

    async def call(self, prompt, requirements):
        # Sort by available capacity
        available = [
            p for p in self.providers
            if p.current_rpm < p.rpm_limit * 0.9
            and p.supports(requirements)
        ]

        if not available:
            return await self.queue_for_later(prompt, requirements)

        # Weighted random selection among available providers
        provider = weighted_choice(available)

        try:
            return await provider.call(prompt)
        except RateLimitError:
            provider.mark_limited()
            # Retry with next available provider
            return await self.call(prompt, requirements)
```

Provider pooling gives you three benefits: higher aggregate throughput, fault tolerance (one provider's outage doesn't take you down), and negotiating leverage (you're not locked into a single vendor).

<div class="tip-box">
<strong>Consistency warning:</strong> Different providers produce different outputs for the same prompt. If output consistency matters (e.g., brand voice), restrict pooling to same-family models or add a normalization layer that standardizes outputs across providers.
</div>
</div>

<div class="lesson-section">
<h2>Queue-Based Architecture</h2>

For tasks that take more than a few seconds, synchronous request-response is the wrong pattern. Queue-based architectures decouple request submission from result delivery.

```python
# Producer: accepts requests, returns job IDs immediately
class AITaskProducer:
    async def submit(self, task):
        job_id = str(uuid.uuid4())
        await self.queue.publish({
            "job_id": job_id,
            "task": task,
            "priority": task.priority,
            "submitted_at": datetime.utcnow().isoformat(),
            "ttl": 300,  # 5 minute deadline
        })
        return {"job_id": job_id, "status": "queued"}

# Consumer: processes jobs from queue
class AITaskConsumer:
    async def process_loop(self):
        while True:
            job = await self.queue.consume(timeout=30)
            if not job:
                continue

            if job.is_expired():
                await self.mark_expired(job)
                continue

            try:
                result = await self.execute(job)
                await self.store_result(job.job_id, result)
                await self.notify_client(job.job_id, result)
            except Exception as e:
                await self.handle_failure(job, e)

# Client polls or uses webhooks
# GET /api/jobs/{job_id} -> {"status": "completed", "result": {...}}
```

Queue benefits for AI:
- **Backpressure management**: Queue depth tells you when to scale consumers up or throttle submissions.
- **Priority handling**: Paid users get processed before free users. Urgent tasks jump the queue.
- **Retry without user waiting**: Failed jobs re-enter the queue automatically. The user doesn't see the retry.
- **Rate limit smoothing**: Burst traffic fills the queue; consumers drain it at the provider's rate limit.

<div class="callout">
<strong>Streaming and queues:</strong> For long-running tasks that benefit from streaming (document analysis, code generation), use WebSocket connections. The client connects, receives real-time progress updates, and gets the final result -- all without polling.
</div>
</div>

<div class="lesson-section">
<h2>Auto-Scaling Signals</h2>

Traditional auto-scaling uses CPU and memory. AI workloads need custom signals:

```python
class AIAutoScaler:
    def evaluate(self):
        signals = {
            "queue_depth": self.queue.depth(),
            "avg_wait_time": self.queue.avg_wait_seconds(),
            "provider_headroom": self.providers.aggregate_rpm_remaining(),
            "active_connections": self.websockets.active_count(),
            "error_rate_5m": self.metrics.error_rate(window="5m"),
        }

        if signals["queue_depth"] > 100 and signals["avg_wait_time"] > 30:
            return ScaleAction("up", reason="Queue backing up")

        if signals["provider_headroom"] < 0.1:
            return ScaleAction("hold", reason="Provider rate-limited, more consumers won't help")

        if signals["queue_depth"] < 5 and signals["active_connections"] < 10:
            return ScaleAction("down", reason="Low demand")

        return ScaleAction("hold")
```

The critical insight: **scaling is pointless when the bottleneck is the API provider.** If you're rate-limited at 1,000 RPM, adding more consumers just means more workers sitting idle. Scale consumers to match provider capacity, not demand. Handle excess demand through queuing and caching.

<div class="tip-box">
<strong>Cost-aware scaling:</strong> More consumers processing AI requests means higher API costs, not just higher infra costs. Factor token spend into your scaling decisions. An auto-scaler that doubles throughput also doubles your API bill.
</div>
</div>

<div class="lesson-section">
<h2>Scaling Checklist</h2>

Before you scale, optimize:

1. **Cache first.** A 40% cache hit rate means you need 40% fewer model calls. This is cheaper and faster than any scaling strategy.
2. **Route to cheaper models.** If 60% of requests can use a mini model, you've effectively tripled your expensive-model capacity for free.
3. **Batch where possible.** Some tasks (embeddings, classifications) can be batched. 10 items in one call beats 10 separate calls on throughput and cost.
4. **Then scale horizontally.** Add provider pools, consumers, and auto-scaling only after optimization is exhausted.

The order matters. Teams that scale before optimizing spend 3-5x more than teams that optimize first.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "Why doesn&#39;t traditional CPU-based auto-scaling work for AI workloads?", "options": ["AI uses GPUs, not CPUs", "The bottleneck is typically the API provider&#39;s rate limit, not your server capacity", "AI requests are too fast for auto-scaling to react", "CPU metrics are inaccurate for AI"], "correct": 1, "explanation": "When you&#39;re calling third-party AI APIs, the bottleneck is the provider&#39;s rate limit (e.g., 500 RPM), not your server&#39;s CPU. Adding more servers just creates more idle workers. Scale consumers to match provider capacity, not demand."}, {"q": "What should you do before implementing horizontal scaling?", "options": ["Add more servers first, optimize later", "Cache, route to cheaper models, and batch -- then scale", "Switch to a faster programming language", "Move to a bigger cloud instance"], "correct": 1, "explanation": "Optimize before scaling: caching (40% hit rate = 40% fewer calls), model routing (cheap models for simple tasks), and batching. Teams that scale before optimizing spend 3-5x more than teams that optimize first."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "Why do AI workloads scale differently than web services?", "back": "AI requests are slow (5-30s), expensive (real token costs), bursty (unpredictable spikes), and rate-limited (provider API caps). Standard auto-scaling assumptions don&#39;t apply."}, {"front": "What is provider pooling?", "back": "Distributing AI API calls across multiple providers (Anthropic, OpenAI, local models) to increase aggregate throughput, gain fault tolerance, and avoid vendor lock-in."}, {"front": "What are four benefits of queue-based architecture for AI?", "back": "1) Backpressure management. 2) Priority handling (paid before free). 3) Automatic retries without user waiting. 4) Rate limit smoothing (burst fills queue, consumers drain at provider&#39;s pace)."}, {"front": "What custom signals should AI auto-scaling use?", "back": "Queue depth, average wait time, provider RPM headroom, active connections, and error rate. The key insight: don&#39;t scale past provider capacity -- it just creates idle workers."}, {"front": "What is the correct order for handling scale?", "back": "1) Cache first (reduce call volume). 2) Route to cheaper models (free capacity). 3) Batch where possible (throughput gains). 4) Then scale horizontally. Optimize before scaling."}]}'></div>

</div>