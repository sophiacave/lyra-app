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
  <span class="section-label">Resilience</span>
  <h2 class="section-title">Retries, Fallbacks, and Graceful Degradation</h2>
  <p class="section-text">AI APIs go down. They time out. They return errors. Your app needs to handle all of this gracefully.</p>
  <p class="section-text"><strong>Exponential backoff:</strong> When a call fails, wait 1 second, then 2, then 4. Don't hammer a struggling API — you'll make it worse and get rate-limited.</p>
  <p class="section-text"><strong>Provider fallback:</strong> If Claude is down, can you fall back to GPT? If your primary vector DB is slow, do you have a cache layer? Multi-provider setups are more work but dramatically more reliable.</p>
  <p class="section-text"><strong>Graceful degradation:</strong> If all AI providers are down, your app should still function — just without AI features. Show cached responses, display a status message, or queue requests for later processing.</p>
</div>

<div class="demo-container">
  <h3>API Call Checklist</h3>
  <p class="section-text">Before every AI API integration, verify: key stored in env var, server-side only, rate limited per user, cost logged, retry logic implemented, spending cap set, fallback defined.</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Build a simple edge function that proxies requests to an AI API. Add rate limiting (max 10 requests per minute per IP), cost logging (track token counts), and exponential backoff retry logic. Deploy it to Supabase or Vercel.</code></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/02-cloud-platforms-overview/">← Previous: Cloud Platforms Overview</a>
  <a href="/academy/ai-infrastructure/04-database-choices/">Next: Database Choices →</a>
</nav>
</div>
