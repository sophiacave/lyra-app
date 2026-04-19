# API Management

**Course:** AI Infrastructure & DevOps
**Order:** 3
**Type:** lesson
**Access:** Free

---
[AI Infrastructure & DevOps](/academy/ai-infrastructure/)
  Lesson 3 of 10


  # Managing AI API Keys, Rate Limits & Costs

  Every AI API call costs money. Every leaked key is a disaster. Every rate limit hit is a broken user experience. API management isn't glamorous — it's essential.


  ### What you'll learn


    - How to store and rotate API keys securely

    - Rate limiting strategies that protect your budget and your users

    - Cost tracking and alerting before bills spiral

    - Building resilient API calls with retries and fallbacks




  Security First
  ## API Key Management

  An exposed OpenAI or Anthropic API key can rack up thousands of dollars in minutes. This isn't theoretical — it happens constantly. Keys get committed to GitHub, hardcoded in frontend JavaScript, or left in plain text configs.
  **Rule 1:** API keys live in environment variables, never in code. Every platform (Vercel, Supabase, AWS) has a secure way to store env vars. Use it.
  **Rule 2:** AI API calls happen server-side only. Never call OpenAI or Anthropic from the browser. Your edge function or backend makes the call; the frontend gets the result.
  **Rule 3:** Rotate keys regularly and set spending caps. Both OpenAI and Anthropic let you set monthly limits. Set them lower than you think you need.


  Flow Control
  ## Rate Limiting

  AI APIs have their own rate limits — requests per minute, tokens per minute, concurrent requests. But you also need your own rate limits to protect your budget from abusive or runaway usage.
  **Per-user limits** prevent any single user from burning through your API budget. A reasonable starting point: 20 requests per hour for free users, 100 for paid users.
  **Global limits** act as a circuit breaker. If your total API spend hits a threshold, slow down or pause non-critical calls rather than letting costs run away.
  Implement rate limiting at the edge — before the request hits your AI provider. Supabase edge functions or Vercel middleware are ideal places for this logic.


  Money Matters
  ## Cost Tracking and Alerting

  Log every AI API call with its token count and estimated cost. This data is gold — it tells you which features are expensive, which users are heavy consumers, and whether your pricing model actually works.
  Set up alerts at 50%, 75%, and 90% of your monthly budget. The first alert is informational. The second triggers investigation. The third should activate automatic throttling.
  Track cost per feature, not just total cost. Your chatbot might cost $0.02 per conversation while your document analysis feature costs $0.50. This insight drives product and pricing decisions.


  Code
  ## Rate Limiter Implementation

  Here is a production-ready rate limiter using a sliding window in Supabase. This tracks requests per user and blocks when the limit is exceeded.

TypeScript — Edge function rate limiter

```
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function checkRateLimit(userId: string, maxRequests = 20, windowMinutes = 60) {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  // Count requests in the sliding window
  const { count } = await supabase
    .from("api_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  // Log this request
  await supabase.from("api_usage").insert({
    user_id: userId,
    tokens_used: 0, // updated after AI call completes
    estimated_cost: 0,
  });

  return { allowed: true, remaining: maxRequests - (count ?? 0) - 1 };
}
```


  Resilience
  ## Retries, Fallbacks, and Graceful Degradation

  AI APIs go down. They time out. They return errors. Your app needs to handle all of this gracefully.
  **Exponential backoff:** When a call fails, wait 1 second, then 2, then 4. Don't hammer a struggling API — you'll make it worse and get rate-limited.
  **Provider fallback:** If Claude is down, can you fall back to GPT? If your primary vector DB is slow, do you have a cache layer? Multi-provider setups are more work but dramatically more reliable.
  **Graceful degradation:** If all AI providers are down, your app should still function — just without AI features. Show cached responses, display a status message, or queue requests for later processing.

Python — Exponential backoff with provider fallback

```
import anthropic
import openai
import time

def call_ai_with_retry(prompt: str, max_retries: int = 3) -> str:
    """Call Claude first, fall back to GPT, with exponential backoff."""

    providers = [
        ("claude", lambda: anthropic.Anthropic().messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        ).content[0].text),
        ("gpt", lambda: openai.OpenAI().chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        ).choices[0].message.content),
    ]

    for name, call_fn in providers:
        for attempt in range(max_retries):
            try:
                result = call_fn()
                print(f"✅ {name} responded (attempt {attempt + 1})")
                return result
            except Exception as e:
                wait = 2 ** attempt  # 1s, 2s, 4s
                print(f"⚠️ {name} failed (attempt {attempt + 1}): {e}")
                if attempt


  Advanced
  ## Multi-Provider API Router

  Production AI systems rarely depend on a single provider. A well-designed API router handles provider selection, key rotation, cost tracking, and circuit breaking — all in one layer.

TypeScript — Production API Router

```
interface AIProvider {
  name: string;
  call: (prompt: string, maxTokens: number) => Promise;
  costPerInputToken: number;
  costPerOutputToken: number;
  healthy: boolean;
  errorCount: number;
}

class AIRouter {
  private providers: AIProvider[];
  private circuitBreakerThreshold = 3;
  private resetIntervalMs = 60_000;

  constructor(providers: AIProvider[]) {
    this.providers = providers;
    // Reset circuit breakers every minute
    setInterval(() => {
      this.providers.forEach(p => {
        p.errorCount = 0;
        p.healthy = true;
      });
    }, this.resetIntervalMs);
  }

  async route(prompt: string, maxTokens = 1024): Promise {
    const healthy = this.providers.filter(p => p.healthy);
    if (healthy.length === 0) {
      throw new Error("All AI providers are down");
    }

    for (const provider of healthy) {
      try {
        const response = await provider.call(prompt, maxTokens);
        const inputTokens = Math.ceil(prompt.length / 4);
        const outputTokens = Math.ceil(response.length / 4);
        const cost = (inputTokens * provider.costPerInputToken)
                   + (outputTokens * provider.costPerOutputToken);

        return { response, provider: provider.name, estimatedCost: cost };
      } catch (error) {
        provider.errorCount++;
        if (provider.errorCount >= this.circuitBreakerThreshold) {
          provider.healthy = false;
          console.warn(`Circuit breaker tripped for ${provider.name}`);
        }
      }
    }
    throw new Error("All healthy providers failed");
  }
}
```


  The circuit breaker pattern is critical. After 3 consecutive errors, a provider is marked unhealthy and removed from the rotation. This prevents hammering a broken service and wasting time on timeouts. The breaker resets after 60 seconds to check if the provider has recovered.


  Cost Tracking
  ## Real-Time Cost Dashboard Schema

  Tracking costs per request requires the right database schema. Here's a production-ready table design that supports cost analysis by user, feature, provider, and time period.

SQL — Cost Tracking Schema

```
CREATE TABLE ai_api_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  feature TEXT NOT NULL,          -- 'chat', 'search', 'analysis'
  provider TEXT NOT NULL,         -- 'anthropic', 'openai'
  model TEXT NOT NULL,            -- 'claude-sonnet-4-6', 'gpt-4o'
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL,
  estimated_cost NUMERIC(10, 6) NOT NULL,
  cached BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'success'   -- 'success', 'error', 'timeout'
);

-- Index for cost analysis queries
CREATE INDEX idx_ai_calls_daily ON ai_api_calls (created_at, provider);
CREATE INDEX idx_ai_calls_user ON ai_api_calls (user_id, created_at);

-- Daily cost summary view
CREATE VIEW daily_cost_summary AS
SELECT
  date_trunc('day', created_at) AS day,
  provider,
  model,
  COUNT(*) AS total_calls,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(estimated_cost) AS total_cost,
  AVG(latency_ms)::INTEGER AS avg_latency_ms,
  COUNT(*) FILTER (WHERE cached) AS cache_hits,
  COUNT(*) FILTER (WHERE status = 'error') AS errors
FROM ai_api_calls
GROUP BY 1, 2, 3
ORDER BY 1 DESC;
```


  The `daily_cost_summary` view gives you instant visibility into spending trends. Query it weekly to catch cost anomalies early — before the monthly bill surprises you.


  ### API Call Checklist

  Before every AI API integration, verify: key stored in env var, server-side only, rate limited per user, cost logged, retry logic implemented, spending cap set, fallback defined.


  ### Try it yourself

  `Build a simple edge function that proxies requests to an AI API. Add rate limiting (max 10 requests per minute per IP), cost logging (track token counts), and exponential backoff retry logic. Deploy it to Supabase or Vercel.`



### API Management Essentials

**Card 1:**
Front: API Key Storage Rule
Back: Keys live in environment variables, never in code. Every platform (Vercel, Supabase, AWS) has secure env var storage — use it.

**Card 2:**
Front: Server-Side Only Calls
Back: Never call AI APIs from the browser. Your edge function or backend makes the call; the frontend receives the result.

**Card 3:**
Front: Per-User Rate Limiting
Back: Prevents any single user from burning your budget. Starting point: 20 requests/hour for free users, 100 for paid.

**Card 4:**
Front: Exponential Backoff
Back: When a call fails, wait 1s, then 2s, then 4s. Avoids hammering a struggling API and getting further rate-limited.

**Card 5:**
Front: Graceful Degradation
Back: If all AI providers are down, your app still functions — show cached responses, display status messages, or queue requests for later.



### Quiz

**Q1: Why should AI API calls NEVER be made directly from the browser?**
    A. It is too slow
  ✓ B. Your API key would be visible in browser JavaScript, exposing it to anyone who inspects the page
    C. It violates browser security policies
    D. It costs more per request
  *Browser JavaScript is visible to anyone using developer tools. An AI API key in frontend code is effectively public — anyone can scrape it and rack up thousands of dollars in minutes.*

**Q2: What should you track per feature to make informed product and pricing decisions?**
    A. Total monthly API spend only
  ✓ B. Cost per feature, not just total cost — your chatbot might cost $0.02 per conversation while document analysis costs $0.50
    C. Number of API calls only
    D. Average response time only
  *Feature-level cost tracking reveals which parts of your product are expensive — informing which features to optimize, which to price higher, and which to reconsider building at all.*

**Q3: What is graceful degradation in the context of AI apps?**
    A. Using a cheaper model when the expensive one is too slow
  ✓ B. When all AI providers are down, your app still functions without AI — showing cached responses or queuing requests rather than an error page
    C. Reducing response quality to save costs
    D. Disabling AI features for free users
  *A blank screen when your AI provider goes down is a terrible user experience. Graceful degradation means your app continues to provide value — with cached data, manual options, or queued processing — even without live AI.*


  [← Previous: Cloud Platforms Overview](/academy/ai-infrastructure/02-cloud-platforms-overview/)
  [Next: Database Choices →](/academy/ai-infrastructure/04-database-choices/)
