---
title: "Caching & Latency Optimization"
course: "ai-systems-design"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Caching & Latency <span class="accent">Optimization.</span></h1>
  <p class="sub">Semantic caching, KV cache, and edge strategies for sub-second AI responses.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How semantic caching differs from exact-match caching and when to use each</li>
    <li>KV cache mechanics and how to exploit them for faster inference</li>
    <li>Edge caching strategies for globally distributed AI applications</li>
    <li>Cache invalidation strategies for AI-generated content</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Why Caching Changes Everything for AI</h2>

A model call costs time and money. A cache hit costs neither. For AI systems, caching is the single most impactful optimization because model calls are both slow (1-30 seconds) and expensive ($0.001-$0.50 per call).

The challenge is that traditional exact-match caching rarely works for AI. Users ask the same question in different ways: "What's the refund policy?" and "How do I get my money back?" are semantically identical but textually different. This is where semantic caching enters.

Three caching layers for AI systems:

1. **Exact-match cache**: Hash the prompt, return cached response for identical inputs. Simple, fast, and effective for programmatic queries (APIs, structured inputs).
2. **Semantic cache**: Embed the query, find similar cached queries above a similarity threshold, return the cached response. Handles natural language variation.
3. **KV cache / Prompt cache**: Reuse the model's internal key-value cache for shared prompt prefixes. Reduces latency and cost for requests with common system prompts.

<div class="callout">
<strong>Impact at scale:</strong> A well-tuned semantic cache typically achieves 30-50% hit rates on customer support queries, reducing both average latency (from 3s to 50ms) and costs proportionally. For FAQ-heavy applications, hit rates can exceed 70%.
</div>
</div>

<div class="lesson-section">
<h2>Building a Semantic Cache</h2>

A semantic cache stores query embeddings alongside their responses. When a new query arrives, it's embedded and compared against cached entries using cosine similarity.

```python
import numpy as np

class SemanticCache:
    def __init__(self, embedding_model, threshold=0.92):
        self.embedding_model = embedding_model
        self.threshold = threshold
        self.entries = []  # In production, use a vector DB

    async def get(self, query):
        query_embedding = await self.embedding_model.embed(query)

        best_match = None
        best_score = 0

        for entry in self.entries:
            score = cosine_similarity(query_embedding, entry["embedding"])
            if score > best_score and score >= self.threshold:
                best_score = score
                best_match = entry

        if best_match:
            return CacheHit(
                response=best_match["response"],
                similarity=best_score,
                original_query=best_match["query"],
            )
        return None

    async def set(self, query, response, ttl=3600):
        embedding = await self.embedding_model.embed(query)
        self.entries.append({
            "query": query,
            "embedding": embedding,
            "response": response,
            "created_at": time.time(),
            "ttl": ttl,
        })

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

The threshold is critical. Too low (0.80) and you serve wrong answers for different questions. Too high (0.98) and the cache rarely hits. Start at 0.92 and tune based on your domain -- narrow domains (technical docs) can go lower, broad domains (general chat) need higher thresholds.

<div class="tip-box">
<strong>Embedding model choice:</strong> Use a fast, cheap embedding model for cache lookups (like <code>text-embedding-3-small</code>). The embedding call itself must be faster than the savings from a cache hit. At ~10ms per embedding vs. ~3s per model call, this pays for itself immediately.
</div>
</div>

<div class="lesson-section">
<h2>KV Cache and Prompt Caching</h2>

Modern LLM APIs offer prompt caching (Anthropic) or KV cache reuse (OpenAI). When multiple requests share the same prefix (system prompt + few-shot examples), the provider caches the computed key-value pairs and reuses them for subsequent requests.

```python
# Anthropic prompt caching example
# The system prompt is cached after the first call.
# Subsequent calls with the same prefix get ~80% faster
# and pay reduced input token costs.

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LONG_SYSTEM_PROMPT,  # 2000+ tokens
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": user_query}]
)

# Check cache performance
print(f"Cache read tokens: {response.usage.cache_read_input_tokens}")
print(f"Cache creation tokens: {response.usage.cache_creation_input_tokens}")
```

Prompt caching is most effective when your system prompt is long (1,000+ tokens) and stable. Anthropic's cache offers a 90% discount on cached input tokens and reduces time-to-first-token significantly. Structure your prompts so the static parts (instructions, examples) come first and user-specific content comes last.

<div class="callout">
<strong>Architecture implication:</strong> Prompt caching rewards consistent prompt structure. If you randomize few-shot example order or dynamically construct system prompts differently each time, you break cache hits. Design prompts for cachability: static prefix, dynamic suffix.
</div>
</div>

<div class="lesson-section">
<h2>Edge Caching for Global AI</h2>

For globally distributed applications, edge caching serves cached AI responses from the nearest CDN node. This eliminates network round-trip latency to your origin server and the model API.

```python
# Edge cache strategy with Cloudflare Workers / Vercel Edge
class EdgeCacheStrategy:
    def cache_key(self, request):
        """Generate a cache key that balances hit rate and correctness."""
        return hash_components([
            request.normalized_query,  # Lowercased, trimmed
            request.language,
            request.user_tier,         # Different tiers may get different models
            # NOT included: user_id, session_id (would destroy hit rate)
        ])

    def cache_headers(self, response_type):
        if response_type == "static_faq":
            return {"Cache-Control": "public, max-age=3600"}      # 1 hour
        elif response_type == "dynamic_summary":
            return {"Cache-Control": "public, max-age=300"}       # 5 minutes
        else:
            return {"Cache-Control": "private, no-store"}         # No caching
```

Edge caching works best for read-heavy patterns with low personalization: FAQ responses, documentation summaries, product descriptions. For personalized or conversational AI, edge caching has limited value because each response is unique.

<div class="tip-box">
<strong>Stale-while-revalidate:</strong> For content that changes occasionally, use <code>stale-while-revalidate</code>. Serve the cached version instantly while regenerating in the background. Users get sub-100ms responses, and the cache stays fresh.
</div>
</div>

<div class="lesson-section">
<h2>Cache Invalidation</h2>

Cache invalidation is famously one of the two hard problems in computer science. For AI caches, invalidation triggers include:

- **Source data changes**: When your knowledge base updates, invalidate cached responses that reference changed documents. Tag cache entries with source document IDs for targeted invalidation.
- **Model changes**: When you upgrade models or change prompts, the entire cache is stale. Use a cache version key that increments with each model/prompt change.
- **Time-based expiry**: For information with a freshness requirement (stock prices, weather, news), use TTLs appropriate to the domain.
- **Quality feedback**: If a user reports a cached response as incorrect, invalidate that specific entry and any semantically similar entries.

```python
class CacheInvalidator:
    async def on_document_update(self, doc_id):
        """Invalidate all cache entries that reference this document."""
        entries = await self.cache.find_by_source(doc_id)
        await self.cache.delete_many([e.key for e in entries])

    async def on_model_change(self):
        """Bump cache version, effectively invalidating everything."""
        self.cache.version += 1

    async def on_negative_feedback(self, query, response):
        """Invalidate this entry and similar ones."""
        similar = await self.cache.find_similar(query, threshold=0.95)
        await self.cache.delete_many([s.key for s in similar])
```
</div>

<QuizMC
  question="What similarity threshold should you start with for a semantic cache?"
  options={["0.70 -- catch as many similar queries as possible", "0.85 -- balance between hits and accuracy", "0.92 -- conservative starting point, tune from there", "0.99 -- only near-exact matches"]}
  correct={2}
  explanation="Start at 0.92 and tune based on your domain. Too low and you serve wrong answers for different questions. Too high and the cache rarely hits. Narrow domains can go lower; broad domains need higher thresholds."
/>

<QuizMC
  question="How should you structure prompts to maximize KV cache / prompt cache hits?"
  options={["Randomize example order for diversity", "Put dynamic user content first, static instructions last", "Put static instructions first (prefix), dynamic content last (suffix)", "Keep prompts as short as possible"]}
  correct={2}
  explanation="Prompt caching works on shared prefixes. Static parts (system instructions, few-shot examples) should come first so they form a consistent cacheable prefix. User-specific dynamic content goes last as the variable suffix."
/>

<FlashDeck cards={[
  { front: "What are the three caching layers for AI systems?", back: "1) Exact-match cache (hash prompt, return for identical inputs). 2) Semantic cache (embed query, find similar cached queries above threshold). 3) KV/Prompt cache (reuse model's internal computations for shared prompt prefixes)." },
  { front: "What hit rates can a well-tuned semantic cache achieve?", back: "30-50% for general customer support. Over 70% for FAQ-heavy applications. This reduces average latency from ~3 seconds to ~50ms on cache hits." },
  { front: "What discount does Anthropic's prompt caching offer?", back: "90% discount on cached input tokens. The static prefix (system prompt, examples) is computed once and reused for subsequent requests with the same prefix." },
  { front: "What are the four cache invalidation triggers for AI?", back: "1) Source data changes (invalidate entries referencing updated docs). 2) Model/prompt changes (bump cache version). 3) Time-based expiry (TTLs per domain). 4) Quality feedback (user reports incorrect cached response)." },
  { front: "When does edge caching work well for AI, and when doesn't it?", back: "Works well: read-heavy, low-personalization (FAQs, docs, product descriptions). Poor fit: personalized or conversational AI where each response is unique." }
]} />

</div>