---
title: "Deployment Strategies"
course: "ai-infrastructure"
order: 5
type: "lesson"
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>CI/CD for <span class="accent">AI Applications</span></h1>
  <p class="section-text">Deploying AI apps isn't like deploying a static website. You're shipping code that calls expensive APIs, manages state across sessions, and can behave unpredictably. Your deployment pipeline needs to account for all of that.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How to set up CI/CD pipelines for AI-powered applications</li>
    <li>Testing strategies when your app's output is non-deterministic</li>
    <li>Blue-green and canary deployments for AI features</li>
    <li>Managing environment variables and secrets across environments</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Pipeline</span>
  <h2 class="section-title">Git Push to Production</h2>
  <p class="section-text">The simplest CI/CD pipeline for AI apps: push to main, auto-deploy. Vercel does this out of the box. Your GitHub repository connects to Vercel, and every merge to main triggers a production deployment. Preview deployments happen on every pull request.</p>
  <p class="section-text">For edge functions (Supabase), deployment is a CLI command: <code>supabase functions deploy function-name</code>. Automate this with a GitHub Action that triggers on changes to your functions directory.</p>
  <p class="section-text">The critical addition for AI apps: your pipeline needs to verify that API keys are set, rate limits are configured, and your AI providers are reachable — before traffic hits the new deployment.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Hard Part</span>
  <h2 class="section-title">Testing Non-Deterministic Systems</h2>
  <p class="section-text">Traditional tests assert exact outputs: "given input X, expect output Y." AI systems don't work that way. Ask the same question twice and you'll get different responses. So how do you test?</p>
  <p class="section-text"><strong>Contract testing:</strong> Don't test the exact response — test the shape. Does the response have the expected fields? Is it within the expected length? Does it contain required information?</p>
  <p class="section-text"><strong>Eval suites:</strong> Maintain a set of known questions with acceptable answer ranges. Run them against your AI pipeline on every deploy. Flag regressions when answers drift outside acceptable bounds.</p>
  <p class="section-text"><strong>Mock in CI, test live in staging:</strong> Use recorded API responses for unit tests (fast, free, deterministic). Use real API calls in staging tests (slow, costs money, but catches real issues).</p>
  <p class="section-text"><strong>Smoke tests post-deploy:</strong> After every production deployment, automatically hit your key AI endpoints and verify they respond correctly. This catches configuration issues that unit tests miss.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Safe Releases</span>
  <h2 class="section-title">Blue-Green and Canary Deployments</h2>
  <p class="section-text"><strong>Blue-green deployment:</strong> Run two identical environments. Deploy to the inactive one, verify it works, then switch traffic. If something breaks, switch back instantly. Vercel handles this automatically — every deployment is atomic and instantly rollbackable.</p>
  <p class="section-text"><strong>Canary deployment:</strong> Route 5-10% of traffic to the new version. Monitor error rates, latency, and costs. If everything looks good, gradually increase to 100%. This is especially valuable for AI features where a bad prompt template could generate harmful or incorrect content.</p>
  <p class="section-text">For AI-specific rollouts, consider feature flags. Ship the new AI feature behind a flag, enable it for internal users first, then gradually roll out. This decouples deployment from release.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"CI/CD Deployment Strategies for AI Apps","cards":[{"front":"Contract Testing for AI","back":"Don’t test the exact response — test the shape. Does it have the expected fields? Is it within expected length? Does it contain required information?"},{"front":"Eval Suites","back":"A set of known questions with acceptable answer ranges. Run on every deploy to flag regressions when answers drift outside acceptable bounds."},{"front":"Blue-Green Deployment","back":"Run two identical environments. Deploy to inactive one, verify, then switch traffic. Instant rollback if something breaks."},{"front":"Canary Deployment","back":"Route 5-10% of traffic to the new version. Monitor error rates, latency, and costs before increasing to 100%."},{"front":"Feature Flags for AI","back":"Ship the new AI feature hidden behind a flag, enable for internal users first, then roll out gradually — decouples deployment from release."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Deployment Strategies — Match Each to Its Purpose","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Blue-Green Deployment","right":"Run two identical environments, deploy to inactive one, verify, switch traffic — instant rollback if broken"},{"left":"Canary Deployment","right":"Route 5-10% of traffic to the new version, monitor errors and costs, then gradually increase to 100%"},{"left":"Feature Flags","right":"Ship new AI features hidden behind a toggle — enable for internal users first, decouple deployment from release"},{"left":"Eval Suites","right":"Known questions with acceptable answer ranges — run on every deploy to catch regressions in AI output quality"},{"left":"Post-Deploy Smoke Tests","right":"Automatically hit key AI endpoints after production deploy to verify configuration and connectivity"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Secrets</span>
  <h2 class="section-title">Environment Variables Across Environments</h2>
  <p class="section-text">AI apps often have more secrets than traditional apps: LLM API keys, embedding service keys, vector database credentials, webhook secrets. Managing these across development, staging, and production environments requires discipline.</p>
  <p class="section-text">Use your platform's built-in secrets management. Vercel has environment variables scoped to preview, development, and production. Supabase has vault for sensitive values. Never store secrets in your repository — not even in .env.example with placeholder values that might get replaced carelessly.</p>
  <p class="section-text">Use different API keys for each environment. Your staging environment should have its own OpenAI key with a lower spending cap. This prevents staging tests from eating your production budget.</p>
</div>

<div class="demo-container">
  <h3>Minimum Viable AI Deployment Pipeline</h3>
  <p class="section-text">1. Push to GitHub → 2. Run unit tests (mocked AI responses) → 3. Auto-deploy to Vercel preview → 4. Run smoke tests against preview URL → 5. Merge to main → 6. Auto-deploy to production → 7. Post-deploy smoke test → 8. Alert on failure</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Set up a GitHub Action that deploys a Supabase edge function when files in the supabase/functions/ directory change. Include a post-deploy step that curls the function's endpoint and verifies a 200 response. Bonus: add a step that checks the function's response time is under 5 seconds.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Deployment Strategies Quiz","questions":[{"q":"Why can’t traditional tests that assert exact outputs be used for AI systems?","options":["AI systems are too fast","AI systems are non-deterministic — the same question can produce different responses, so exact-match testing fails","AI responses are too long to compare","AI APIs don’t support testing"],"correct":1,"explanation":"Traditional tests check exact outputs. AI systems are probabilistic — ask the same question twice and get different responses. Instead, test shape, structure, and whether required information is present."},{"q":"What is the advantage of using different API keys for staging vs. production environments?","options":["It is cheaper","Staging tests cannot accidentally exhaust your production budget, and spending caps can be set separately per environment","It is required by API providers","It makes debugging easier"],"correct":1,"explanation":"Using separate keys with lower spending caps for staging means your testing and development activity has zero impact on your production budget — a critical discipline as test volume grows."},{"q":"What is the critical addition to a CI/CD pipeline specifically for AI apps?","options":["Code coverage requirements","Verifying that API keys are set, rate limits are configured, and AI providers are reachable before traffic hits the new deployment","Automated code formatting","Load testing"],"correct":1,"explanation":"Standard CI/CD pipelines don’t check AI-specific configuration. A post-deploy smoke test that verifies API connectivity and key configuration catches silent failures that only appear under live traffic."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/04-database-choices/">← Previous: Database Choices</a>
  <a href="/academy/ai-infrastructure/06-monitoring-and-observability/">Next: Monitoring & Observability →</a>
</nav>
</div>
