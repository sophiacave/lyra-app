---
title: "Scaling Patterns"
course: "ai-infrastructure"
order: 9
type: "lesson"
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Horizontal Scaling, <span class="accent">Caching & Load Balancing</span></h1>
  <p class="section-text">Your AI app works beautifully for 10 users. Then 1,000 show up and everything breaks. Scaling AI systems requires specific patterns — because the bottleneck isn't your code, it's the external AI providers you depend on.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Why AI apps hit scaling walls differently than traditional apps</li>
    <li>Caching layers that absorb traffic spikes</li>
    <li>Load balancing across multiple AI providers</li>
    <li>Queue-based architectures for handling burst traffic</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Bottleneck</span>
  <h2 class="section-title">Where AI Systems Break</h2>
  <p class="section-text">Traditional apps scale by adding more servers. Your app is the bottleneck, and more instances means more capacity. With AI apps, the bottleneck is usually the external AI provider — and you can't add more OpenAI.</p>
  <p class="section-text">AI providers have rate limits: requests per minute, tokens per minute, concurrent connections. When you hit these limits, adding more app servers doesn't help. Your scaling strategy has to work around provider constraints, not just infrastructure constraints.</p>
  <p class="section-text">The other scaling challenge: cost. In traditional apps, scaling costs grow slowly (more servers = linear cost increase). In AI apps, scaling costs grow with every request because each one has a direct API cost. Double your users, double your AI bill.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Layer One</span>
  <h2 class="section-title">Aggressive Caching</h2>
  <p class="section-text">Caching is your first and most powerful scaling tool. Every cached response is a request that doesn't hit your AI provider — saving both latency and money.</p>
  <p class="section-text"><strong>Response caching:</strong> Cache full AI responses keyed on input hash. For deterministic operations like embeddings and classifications, this is a permanent cache. For generative responses, set a TTL based on how quickly the answer might change.</p>
  <p class="section-text"><strong>Semantic caching:</strong> Cache responses by meaning, not exact match. If 50 users ask slightly different versions of the same question, one AI call can serve all of them. Vector similarity search on cached queries makes this possible.</p>
  <p class="section-text"><strong>Embedding caching:</strong> Embeddings are perfectly deterministic — the same text always produces the same embedding. Cache them aggressively. If your content doesn't change, its embeddings never need recomputation.</p>
  <p class="section-text">A multi-layer cache (in-memory → Redis → database) gives you sub-millisecond responses for hot queries, fast responses for warm queries, and only hits the AI provider for genuinely new requests.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Layer Two</span>
  <h2 class="section-title">Multi-Provider Load Balancing</h2>
  <p class="section-text">Don't depend on a single AI provider. If your app uses both Claude and GPT, you can distribute load across both, route around outages, and take advantage of each model's strengths.</p>
  <p class="section-text"><strong>Round-robin routing:</strong> Alternate between providers to stay under each one's rate limits. If Claude allows 100 RPM and GPT allows 100 RPM, your effective limit is 200 RPM.</p>
  <p class="section-text"><strong>Smart routing:</strong> Route simple tasks to cheaper, faster models and complex tasks to more capable ones. A classification task doesn't need the same model as a nuanced analysis.</p>
  <p class="section-text"><strong>Failover routing:</strong> If your primary provider returns errors or exceeds latency thresholds, automatically route to the backup. This should be transparent to the user — they just get a response.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Scaling Layers — From Cheapest to Most Expensive","cards":[{"front":"Layer 0: CDN + Edge Cache","back":"Static content served from the edge. Zero AI cost. Absorbs all cacheable traffic before it touches your infrastructure."},{"front":"Layer 1: Semantic Cache","back":"Vector similarity search against cached query-answer pairs. Catches repeated or similar questions without any LLM call."},{"front":"Layer 2: RAG from Database","back":"Answer from your knowledge base. A vector search costs fractions of a cent — far cheaper than calling an LLM."},{"front":"Layer 3: Load-Balanced AI Providers","back":"Distribute novel queries across multiple providers. Round-robin routing doubles your effective rate limit."},{"front":"Layer 4: Request Queue","back":"For non-urgent tasks, accept requests immediately and process at your own pace — protecting rate limits and user experience."}]}'></div>
</div>

<div class="lesson-section">
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Building a Multi-Provider Load Balancer</h2>
  <p class="section-text">Here's a complete load balancer implementation that distributes AI requests across providers, tracks rate limits, and handles failures automatically.</p>

<div class="code-block"><div class="code-label">TypeScript — Production Load Balancer</div>
<pre><code class="language-typescript">interface ProviderState {
  name: string;
  rpmLimit: number;
  currentRpm: number;
  errorCount: number;
  healthy: boolean;
  lastReset: number;
}

class AILoadBalancer {
  private providers: Map&lt;string, ProviderState&gt; = new Map();
  private circuitBreakerMax = 3;

  addProvider(name: string, rpmLimit: number) {
    this.providers.set(name, {
      name, rpmLimit, currentRpm: 0,
      errorCount: 0, healthy: true, lastReset: Date.now()
    });
  }

  selectProvider(): ProviderState | null {
    // Reset RPM counters every minute
    const now = Date.now();
    for (const [, p] of this.providers) {
      if (now - p.lastReset > 60_000) {
        p.currentRpm = 0;
        p.lastReset = now;
        if (p.errorCount < this.circuitBreakerMax) p.healthy = true;
      }
    }

    // Find healthiest provider with most remaining capacity
    let best: ProviderState | null = null;
    let bestCapacity = 0;

    for (const [, p] of this.providers) {
      if (!p.healthy) continue;
      const remaining = p.rpmLimit - p.currentRpm;
      if (remaining > bestCapacity) {
        best = p;
        bestCapacity = remaining;
      }
    }

    if (best) best.currentRpm++;
    return best;
  }

  reportError(providerName: string) {
    const p = this.providers.get(providerName);
    if (!p) return;
    p.errorCount++;
    if (p.errorCount >= this.circuitBreakerMax) {
      p.healthy = false;
      console.warn(`Circuit breaker OPEN for ${providerName}`);
    }
  }

  reportSuccess(providerName: string) {
    const p = this.providers.get(providerName);
    if (p) p.errorCount = 0;
  }

  getStatus(): Record&lt;string, any&gt; {
    const status: Record&lt;string, any&gt; = {};
    for (const [name, p] of this.providers) {
      status[name] = {
        healthy: p.healthy,
        rpm: `${p.currentRpm}/${p.rpmLimit}`,
        errors: p.errorCount,
      };
    }
    return status;
  }
}

// Usage
const balancer = new AILoadBalancer();
balancer.addProvider("anthropic", 100);
balancer.addProvider("openai", 100);

// Effective capacity: 200 RPM across both providers</code></pre>
</div>

  <p class="section-text">The load balancer selects the provider with the most remaining capacity each minute. This naturally distributes load and prevents hitting any single provider's rate limit. The circuit breaker opens after 3 consecutive errors, giving the failing provider time to recover before trying again.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">Complete Scaling Architecture Diagram</h2>
  <p class="section-text">Here's how all the scaling layers fit together in a production system. Each layer absorbs a portion of traffic, so only genuinely novel queries reach the expensive AI providers.</p>

<div class="code-block"><div class="code-label">Text Architecture — Scaling Layers</div>
<pre><code>User Request
     │
     ▼
┌─────────────────────────────────────┐
│  LAYER 0: Edge Cache / CDN          │  ← Static content (100% absorbed)
│  Vercel Edge Network                │
└────────────────┬────────────────────┘
                 │  Dynamic requests only
                 ▼
┌─────────────────────────────────────┐
│  LAYER 1: Semantic Cache            │  ← Similar queries (40-60% absorbed)
│  pgvector similarity search         │
│  Threshold: cosine > 0.95           │
└────────────────┬────────────────────┘
                 │  Novel queries only
                 ▼
┌─────────────────────────────────────┐
│  LAYER 2: RAG Knowledge Base        │  ← Factual answers (20-30% absorbed)
│  Vector search → context injection  │
│  Answers from stored knowledge      │
└────────────────┬────────────────────┘
                 │  Complex/novel queries only
                 ▼
┌─────────────────────────────────────┐
│  LAYER 3: Load-Balanced Providers   │  ← Distributed across providers
│  Anthropic ←→ OpenAI ←→ Google     │
│  Smart routing by task complexity   │
└────────────────┬────────────────────┘
                 │  Overflow / non-urgent
                 ▼
┌─────────────────────────────────────┐
│  LAYER 4: Request Queue             │  ← Burst absorption
│  Priority: paid → free              │
│  Process at controlled rate         │
└─────────────────────────────────────┘

Result: Only 10-20% of user requests actually hit
the expensive LLM providers.</code></pre>
</div>

  <p class="section-text">With all layers active, 80-90% of requests are served without an LLM call. The semantic cache handles repeated questions. RAG handles factual queries from your knowledge base. Only genuinely novel, complex questions reach the LLM — and even those are distributed across providers. This is how you scale to thousands of users without your AI bill scaling linearly.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Layer Three</span>
  <h2 class="section-title">Queue-Based Processing</h2>
  <p class="section-text">Not every AI request needs a synchronous response. For operations where users can wait a few seconds (document analysis, content generation, batch processing), a queue-based architecture handles burst traffic gracefully.</p>
  <p class="section-text"><strong>Request queue:</strong> Accept the user's request immediately (fast), put it in a queue, process it at your own pace (respecting rate limits), and notify the user when it's done (via websocket, polling, or email).</p>
  <p class="section-text"><strong>Priority queues:</strong> Paid users get processed first. Free users get processed when capacity allows. This naturally protects your paid users' experience during traffic spikes.</p>
  <p class="section-text"><strong>Backpressure:</strong> When the queue gets too long, stop accepting new requests rather than making promises you can't keep. Show a clear "system busy" message rather than timing out after 30 seconds of silence.</p>
</div>

<div class="demo-container">
  <h3>Scaling Architecture Layers</h3>
  <p class="section-text"><strong>Layer 0:</strong> CDN + Edge Cache (static content, zero AI cost)</p>
  <p class="section-text"><strong>Layer 1:</strong> Semantic Cache (catch repeated/similar queries)</p>
  <p class="section-text"><strong>Layer 2:</strong> RAG from database (answer from knowledge base, no LLM)</p>
  <p class="section-text"><strong>Layer 3:</strong> Load-balanced AI providers (distribute across models)</p>
  <p class="section-text"><strong>Layer 4:</strong> Request queue (absorb burst traffic)</p>
  <p class="section-text">Each layer absorbs traffic before it reaches the next. By Layer 3, only genuinely novel, complex queries hit the expensive AI APIs.</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Implement a simple load balancer for AI API calls. Create a function that accepts a prompt and routes it to one of two providers based on current rate limit usage. Track requests per minute for each provider and switch to the other when one approaches its limit. Add a circuit breaker that stops routing to a provider after 3 consecutive errors.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Scaling Patterns Quiz","questions":[{"q":"Why does adding more app servers NOT solve the AI scaling problem?","options":["App servers are too expensive","The bottleneck is the external AI provider’s rate limits — you can’t add more OpenAI by adding more of your own servers","App servers can’t make AI API calls","Adding servers creates more latency"],"correct":1,"explanation":"Traditional scaling adds capacity on your side. With AI apps, the constraint is the external provider’s rate and token limits. Your scaling strategy must work around provider constraints, not just infrastructure ones."},{"q":"How does round-robin routing across two AI providers help with scaling?","options":["It makes responses faster","If each provider allows 100 RPM, alternating between them effectively doubles your throughput to 200 RPM","It reduces cost","It improves response quality"],"correct":1,"explanation":"Multi-provider load balancing distributes requests across providers, multiplying your effective rate limit by the number of providers in your pool. It also provides automatic failover if one provider goes down."},{"q":"What is the backpressure pattern in queue-based AI architectures?","options":["Sending requests faster when the queue is long","Stopping acceptance of new requests when the queue is too long — showing a clear message rather than timing out after 30 seconds of silence","Deleting old requests from the queue","Routing to a faster provider when queues build up"],"correct":1,"explanation":"Backpressure is about making honest promises. A clear ‘system busy’ message is far better UX than silently queuing a request that will timeout 30 seconds later with no feedback."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/08-security-and-compliance/">← Previous: Security & Compliance</a>
  <a href="/academy/ai-infrastructure/10-your-ai-infrastructure-stack/">Next: Your AI Infrastructure Stack →</a>
</nav>
</div>
