# Deployment Strategies

**Course:** AI Infrastructure & DevOps
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[AI Infrastructure & DevOps](/academy/ai-infrastructure/)
  Lesson 5 of 10


  # CI/CD for AI Applications

  Deploying AI apps isn't like deploying a static website. You're shipping code that calls expensive APIs, manages state across sessions, and can behave unpredictably. Your deployment pipeline needs to account for all of that.


  ### What you'll learn


    - How to set up CI/CD pipelines for AI-powered applications

    - Testing strategies when your app's output is non-deterministic

    - Blue-green and canary deployments for AI features

    - Managing environment variables and secrets across environments




  The Pipeline
  ## Git Push to Production

  The simplest CI/CD pipeline for AI apps: push to main, auto-deploy. Vercel does this out of the box. Your GitHub repository connects to Vercel, and every merge to main triggers a production deployment. Preview deployments happen on every pull request.
  For edge functions (Supabase), deployment is a CLI command: `supabase functions deploy function-name`. Automate this with a GitHub Action that triggers on changes to your functions directory.
  The critical addition for AI apps: your pipeline needs to verify that API keys are set, rate limits are configured, and your AI providers are reachable — before traffic hits the new deployment.


  The Hard Part
  ## Testing Non-Deterministic Systems

  Traditional tests assert exact outputs: "given input X, expect output Y." AI systems don't work that way. Ask the same question twice and you'll get different responses. So how do you test?
  **Contract testing:** Don't test the exact response — test the shape. Does the response have the expected fields? Is it within the expected length? Does it contain required information?
  **Eval suites:** Maintain a set of known questions with acceptable answer ranges. Run them against your AI pipeline on every deploy. Flag regressions when answers drift outside acceptable bounds.
  **Mock in CI, test live in staging:** Use recorded API responses for unit tests (fast, free, deterministic). Use real API calls in staging tests (slow, costs money, but catches real issues).
  **Smoke tests post-deploy:** After every production deployment, automatically hit your key AI endpoints and verify they respond correctly. This catches configuration issues that unit tests miss.


  Safe Releases
  ## Blue-Green and Canary Deployments

  **Blue-green deployment:** Run two identical environments. Deploy to the inactive one, verify it works, then switch traffic. If something breaks, switch back instantly. Vercel handles this automatically — every deployment is atomic and instantly rollbackable.
  **Canary deployment:** Route 5-10% of traffic to the new version. Monitor error rates, latency, and costs. If everything looks good, gradually increase to 100%. This is especially valuable for AI features where a bad prompt template could generate harmful or incorrect content.
  For AI-specific rollouts, consider feature flags. Ship the new AI feature behind a flag, enable it for internal users first, then gradually roll out. This decouples deployment from release.



### CI/CD Deployment Strategies for AI Apps

**Card 1:**
Front: Contract Testing for AI
Back: Don’t test the exact response — test the shape. Does it have the expected fields? Is it within expected length? Does it contain required information?

**Card 2:**
Front: Eval Suites
Back: A set of known questions with acceptable answer ranges. Run on every deploy to flag regressions when answers drift outside acceptable bounds.

**Card 3:**
Front: Blue-Green Deployment
Back: Run two identical environments. Deploy to inactive one, verify, then switch traffic. Instant rollback if something breaks.

**Card 4:**
Front: Canary Deployment
Back: Route 5-10% of traffic to the new version. Monitor error rates, latency, and costs before increasing to 100%.

**Card 5:**
Front: Feature Flags for AI
Back: Ship the new AI feature hidden behind a flag, enable for internal users first, then roll out gradually — decouples deployment from release.


  CI/CD Config
  ## GitHub Actions for AI Deployments

  Here's a production-ready GitHub Actions workflow for deploying an AI application. It covers both the Vercel frontend and Supabase edge functions, with post-deploy smoke tests.

YAML — .github/workflows/deploy.yml

```
name: Deploy AI Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage

      # Contract tests with mocked AI responses
      - name: Run AI contract tests
        run: npm run test:ai-contracts
        env:
          AI_MOCK_MODE: "true"

  deploy-functions:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy edge functions
        run: |
          supabase functions deploy ai-chat \
            --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase functions deploy ai-embed \
            --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  smoke-test:
    needs: [deploy-functions]
    runs-on: ubuntu-latest
    steps:
      - name: Verify AI endpoints
        run: |
          # Test edge function health
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            "${{ secrets.SUPABASE_URL }}/functions/v1/ai-chat" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"message": "health check"}')

          if [ "$STATUS" != "200" ]; then
            echo "Smoke test FAILED with status $STATUS"
            exit 1
          fi
          echo "Smoke test PASSED"

      - name: Check response time
        run: |
          TIME=$(curl -s -o /dev/null -w "%{time_total}" \
            "${{ secrets.SUPABASE_URL }}/functions/v1/ai-chat" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"message": "latency check"}')

          echo "Response time: ${TIME}s"
          if (( $(echo "$TIME > 10.0" | bc -l) )); then
            echo "WARNING: Response time exceeds 10s threshold"
          fi
```


  The workflow runs in three stages: test (unit + contract tests with mocked AI), deploy (push edge functions to Supabase), and smoke test (verify live endpoints respond correctly and within latency bounds). Vercel handles frontend deployment automatically on push to main.


  Rollback
  ## Instant Rollback Strategies

  When an AI deployment goes wrong — bad prompt template, broken model configuration, or degraded response quality — you need to roll back fast. Here are three rollback patterns, ordered by speed.
  **1. Vercel instant rollback (seconds):** Every Vercel deployment is immutable. Click "Promote to Production" on any previous deployment in the dashboard, or use the CLI: `vercel rollback `. Traffic switches instantly with zero downtime.
  **2. Feature flag toggle (seconds):** If your AI feature is behind a feature flag, disable the flag to instantly revert users to the previous behavior. No code deployment needed. This is the safest approach for rolling out new AI capabilities.
  **3. Git revert + redeploy (minutes):** Revert the bad commit with `git revert HEAD && git push`. Vercel auto-deploys the reverted code. Takes 1-3 minutes but creates a clean audit trail.
  The best practice: combine all three. Feature flags for gradual rollout, Vercel instant rollback for emergency response, and git revert for permanent fixes. Defense in depth applies to deployments too.


  Secrets
  ## Environment Variables Across Environments

  AI apps often have more secrets than traditional apps: LLM API keys, embedding service keys, vector database credentials, webhook secrets. Managing these across development, staging, and production environments requires discipline.
  Use your platform's built-in secrets management. Vercel has environment variables scoped to preview, development, and production. Supabase has vault for sensitive values. Never store secrets in your repository — not even in .env.example with placeholder values that might get replaced carelessly.
  Use different API keys for each environment. Your staging environment should have its own OpenAI key with a lower spending cap. This prevents staging tests from eating your production budget.


  Testing
  ## AI Contract Test Example

  Contract tests verify the shape and structure of AI responses without checking exact content. Here's a practical implementation you can add to your test suite today.

TypeScript — AI Contract Tests

```
import { describe, it, expect } from "vitest";

describe("AI Response Contracts", () => {
  it("chat endpoint returns expected shape", async () => {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      body: JSON.stringify({ message: "What is machine learning?" }),
    });
    const data = await response.json();

    // Contract: response has required fields
    expect(data).toHaveProperty("response");
    expect(data).toHaveProperty("provider");
    expect(typeof data.response).toBe("string");

    // Contract: response is within acceptable length
    expect(data.response.length).toBeGreaterThan(50);
    expect(data.response.length).toBeLessThan(5000);

    // Contract: response is relevant (contains key terms)
    const lowerResponse = data.response.toLowerCase();
    const relevantTerms = ["learn", "data", "model", "algorithm", "pattern"];
    const hasRelevantTerm = relevantTerms.some(t => lowerResponse.includes(t));
    expect(hasRelevantTerm).toBe(true);
  });
});
```


  These tests run in CI with mocked responses (fast and free) and in staging with real API calls (slow but catches real integration issues). The contract stays the same — only the data source changes.


  ### Minimum Viable AI Deployment Pipeline

  1. Push to GitHub → 2. Run unit tests (mocked AI responses) → 3. Auto-deploy to Vercel preview → 4. Run smoke tests against preview URL → 5. Merge to main → 6. Auto-deploy to production → 7. Post-deploy smoke test → 8. Alert on failure


  ### Try it yourself

  `Set up a GitHub Action that deploys a Supabase edge function when files in the supabase/functions/ directory change. Include a post-deploy step that curls the function's endpoint and verifies a 200 response. Bonus: add a step that checks the function's response time is under 5 seconds.`



### Quiz

**Q1: Why can’t traditional tests that assert exact outputs be used for AI systems?**
    A. AI systems are too fast
  ✓ B. AI systems are non-deterministic — the same question can produce different responses, so exact-match testing fails
    C. AI responses are too long to compare
    D. AI APIs don’t support testing
  *Traditional tests check exact outputs. AI systems are probabilistic — ask the same question twice and get different responses. Instead, test shape, structure, and whether required information is present.*

**Q2: What is the advantage of using different API keys for staging vs. production environments?**
    A. It is cheaper
  ✓ B. Staging tests cannot accidentally exhaust your production budget, and spending caps can be set separately per environment
    C. It is required by API providers
    D. It makes debugging easier
  *Using separate keys with lower spending caps for staging means your testing and development activity has zero impact on your production budget — a critical discipline as test volume grows.*

**Q3: What is the critical addition to a CI/CD pipeline specifically for AI apps?**
    A. Code coverage requirements
  ✓ B. Verifying that API keys are set, rate limits are configured, and AI providers are reachable before traffic hits the new deployment
    C. Automated code formatting
    D. Load testing
  *Standard CI/CD pipelines don’t check AI-specific configuration. A post-deploy smoke test that verifies API connectivity and key configuration catches silent failures that only appear under live traffic.*


  [← Previous: Database Choices](/academy/ai-infrastructure/04-database-choices/)
  [Next: Monitoring & Observability →](/academy/ai-infrastructure/06-monitoring-and-observability/)
