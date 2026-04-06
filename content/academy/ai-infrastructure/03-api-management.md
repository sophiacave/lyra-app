---
title: "API Management"
course: "ai-infrastructure"
order: 3
type: "lesson"
free: true
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Managing AI <span class="accent">API Keys, Rate Limits & Costs</span></h1>
  <p class="section-text">Every AI API call costs money. Every leaked key is a disaster. Every rate limit hit is a broken user experience. API management isn't glamorous — it's essential.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How to store and rotate API keys securely</li>
    <li>Rate limiting strategies that protect your budget and your users</li>
    <li>Cost tracking and alerting before bills spiral</li>
    <li>Building resilient API calls with retries and fallbacks</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Security First</span>
  <h2 class="section-title">API Key Management</h2>
  <p class="section-text">An exposed OpenAI or Anthropic API key can rack up thousands of dollars in minutes. This isn't theoretical — it happens constantly. Keys get committed to GitHub, hardcoded in frontend JavaScript, or left in plain text configs.</p>
  <p class="section-text"><strong>Rule 1:</strong> API keys live in environment variables, never in code. Every platform (Vercel, Supabase, AWS) has a secure way to store env vars. Use it.</p>
  <p class="section-text"><strong>Rule 2:</strong> AI API calls happen server-side only. Never call OpenAI or Anthropic from the browser. Your edge function or backend makes the call; the frontend gets the result.</p>
  <p class="section-text"><strong>Rule 3:</strong> Rotate keys regularly and set spending caps. Both OpenAI and Anthropic let you set monthly limits. Set them lower than you think you need.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Flow Control</span>
  <h2 class="section-title">Rate Limiting</h2>
  <p class="section-text">AI APIs have their own rate limits — requests per minute, tokens per minute, concurrent requests. But you also need your own rate limits to protect your budget from abusive or runaway usage.</p>
  <p class="section-text"><strong>Per-user limits</strong> prevent any single user from burning through your API budget. A reasonable starting point: 20 requests per hour for free users, 100 for paid users.</p>
  <p class="section-text"><strong>Global limits</strong> act as a circuit breaker. If your total API spend hits a threshold, slow down or pause non-critical calls rather than letting costs run away.</p>
  <p class="section-text">Implement rate limiting at the edge — before the request hits your AI provider. Supabase edge functions or Vercel middleware are ideal places for this logic.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Money Matters</span>
  <h2 class="section-title">Cost Tracking and Alerting</h2>
  <p class="section-text">Log every AI API call with its token count and estimated cost. This data is gold — it tells you which features are expensive, which users are heavy consumers, and whether your pricing model actually works.</p>
  <p class="section-text">Set up alerts at 50%, 75%, and 90% of your monthly budget. The first alert is informational. The second triggers investigation. The third should activate automatic throttling.</p>
  <p class="section-text">Track cost per feature, not just total cost. Your chatbot might cost $0.02 per conversation while your document analysis feature costs $0.50. This insight drives product and pricing decisions.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Code</span>
  <h2 class="section-title">Rate Limiter Implementation</h2>
  <p class="section-text">Here is a production-ready rate limiter using a sliding window in Supabase. This tracks requests per user and blocks when the limit is exceeded.</p>

<div class="code-block"><div class="code-label">TypeScript — Edge function rate limiter</div>
<pre><code class="language-typescript">import { createClient } from "@supabase/supabase-js";

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
}</code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Resilience</span>
  <h2 class="section-title">Retries, Fallbacks, and Graceful Degradation</h2>
  <p class="section-text">AI APIs go down. They time out. They return errors. Your app needs to handle all of this gracefully.</p>
  <p class="section-text"><strong>Exponential backoff:</strong> When a call fails, wait 1 second, then 2, then 4. Don't hammer a struggling API — you'll make it worse and get rate-limited.</p>
  <p class="section-text"><strong>Provider fallback:</strong> If Claude is down, can you fall back to GPT? If your primary vector DB is slow, do you have a cache layer? Multi-provider setups are more work but dramatically more reliable.</p>
  <p class="section-text"><strong>Graceful degradation:</strong> If all AI providers are down, your app should still function — just without AI features. Show cached responses, display a status message, or queue requests for later processing.</p>

<div class="code-block"><div class="code-label">Python — Exponential backoff with provider fallback</div>
<pre><code class="language-python">import anthropic
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
                if attempt < max_retries - 1:
                    time.sleep(wait)

    return "All AI providers unavailable. Please try again later."</code></pre>
</div>
</div>

<div class="demo-container">
  <h3>API Call Checklist</h3>
  <p class="section-text">Before every AI API integration, verify: key stored in env var, server-side only, rate limited per user, cost logged, retry logic implemented, spending cap set, fallback defined.</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Build a simple edge function that proxies requests to an AI API. Add rate limiting (max 10 requests per minute per IP), cost logging (track token counts), and exponential backoff retry logic. Deploy it to Supabase or Vercel.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"API Management Essentials","cards":[{"front":"API Key Storage Rule","back":"Keys live in environment variables, never in code. Every platform (Vercel, Supabase, AWS) has secure env var storage — use it."},{"front":"Server-Side Only Calls","back":"Never call AI APIs from the browser. Your edge function or backend makes the call; the frontend receives the result."},{"front":"Per-User Rate Limiting","back":"Prevents any single user from burning your budget. Starting point: 20 requests/hour for free users, 100 for paid."},{"front":"Exponential Backoff","back":"When a call fails, wait 1s, then 2s, then 4s. Avoids hammering a struggling API and getting further rate-limited."},{"front":"Graceful Degradation","back":"If all AI providers are down, your app still functions — show cached responses, display status messages, or queue requests for later."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"API Management Quiz","questions":[{"q":"Why should AI API calls NEVER be made directly from the browser?","options":["It is too slow","Your API key would be visible in browser JavaScript, exposing it to anyone who inspects the page","It violates browser security policies","It costs more per request"],"correct":1,"explanation":"Browser JavaScript is visible to anyone using developer tools. An AI API key in frontend code is effectively public — anyone can scrape it and rack up thousands of dollars in minutes."},{"q":"What should you track per feature to make informed product and pricing decisions?","options":["Total monthly API spend only","Cost per feature, not just total cost — your chatbot might cost $0.02 per conversation while document analysis costs $0.50","Number of API calls only","Average response time only"],"correct":1,"explanation":"Feature-level cost tracking reveals which parts of your product are expensive — informing which features to optimize, which to price higher, and which to reconsider building at all."},{"q":"What is graceful degradation in the context of AI apps?","options":["Using a cheaper model when the expensive one is too slow","When all AI providers are down, your app still functions without AI — showing cached responses or queuing requests rather than an error page","Reducing response quality to save costs","Disabling AI features for free users"],"correct":1,"explanation":"A blank screen when your AI provider goes down is a terrible user experience. Graceful degradation means your app continues to provide value — with cached data, manual options, or queued processing — even without live AI."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/02-cloud-platforms-overview/">← Previous: Cloud Platforms Overview</a>
  <a href="/academy/ai-infrastructure/04-database-choices/">Next: Database Choices →</a>
</nav>
</div>
