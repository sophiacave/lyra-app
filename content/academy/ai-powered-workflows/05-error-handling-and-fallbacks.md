---
title: "Error Handling and Fallbacks"
course: "ai-powered-workflows"
order: 5
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-powered-workflows/">← Back to Course</a>
  <span class="badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Error Handling and <span class="accent">Fallbacks</span></h1>
  <p class="subtitle">Things will break. The question is whether your workflow recovers gracefully.</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Why errors aren't bugs — they're expected behavior</li>
    <li>The retry-fallback-alert pattern</li>
    <li>Designing workflows that degrade gracefully</li>
    <li>How AI handles uncertainty differently than traditional code</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Mindset</span>
  <h2 class="section-title">Errors Are Not Failures</h2>
  <p class="section-text">APIs go down. Data arrives malformed. Rate limits get hit. Network connections drop. These aren't signs your workflow is broken — they're normal operating conditions. The difference between an amateur workflow and a production-grade one is how it handles the unexpected.</p>
  <p class="section-text">A workflow without error handling is a ticking time bomb. A workflow with error handling is a resilient system that runs for months without intervention.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Pattern</span>
  <h2 class="section-title">Retry → Fallback → Alert</h2>

  <div class="demo-container">
    <p><strong style="color: var(--green);">Retry:</strong> The API timed out? Wait 5 seconds, try again. Most transient errors resolve themselves. Set a retry limit — typically 3 attempts with increasing wait times (5s, 15s, 45s).</p>
    <p><strong style="color: var(--orange);">Fallback:</strong> Retries exhausted? Switch to Plan B. If the primary email service is down, route through the backup. If AI classification fails, apply a default category and flag for human review.</p>
    <p><strong style="color: var(--red);">Alert:</strong> Fallback activated? Notify someone. Not with a panic alarm — with a clear message: what failed, when, what the fallback did, and what needs attention. Then the workflow keeps running.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">AI-Specific</span>
  <h2 class="section-title">When AI Isn't Sure</h2>
  <p class="section-text">Traditional code either works or throws an error. AI has a third state: uncertain. An AI classifier might be 95% confident a support ticket is "billing" but only 40% confident another is "technical." Your workflow needs to handle that confidence spectrum.</p>
  <p class="section-text">Set confidence thresholds. Above 80%? Act automatically. Between 50-80%? Act but flag for review. Below 50%? Route to a human. This turns AI uncertainty from a liability into a feature — the system knows what it knows and what it doesn't.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Graceful Degradation</span>
  <h2 class="section-title">The Show Must Go On</h2>
  <p class="section-text">The best workflows don't stop when something breaks — they do the best they can with what's available. If step 3 of a 6-step pipeline fails, can steps 4-6 still run with partial data? Often, yes. Design your workflows so that each step is as independent as possible, contributing to the whole but not completely blocking it.</p>
  <p class="section-text">Think of it like a restaurant kitchen. If the dishwasher breaks, you don't close the restaurant. You adapt. Your workflows should do the same.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Error Categories</span>
  <h2 class="section-title">Knowing What Went Wrong Changes Everything</h2>
  <p class="section-text">Not all errors are created equal. Categorizing errors helps you build the right response for each type:</p>
  <p class="section-text"><strong style="color: var(--blue);">Transient errors:</strong> Network timeouts, rate limits, temporary service outages. These resolve themselves. Strategy: retry with backoff. Most APIs recover within 30-60 seconds.</p>
  <p class="section-text"><strong style="color: var(--orange);">Data errors:</strong> Malformed input, missing required fields, type mismatches. These won't fix themselves on retry. Strategy: validate at the boundary, return a clear error message, route to a dead-letter queue for manual review.</p>
  <p class="section-text"><strong style="color: var(--red);">Configuration errors:</strong> Expired API keys, wrong endpoint URLs, missing environment variables. These affect every request until fixed. Strategy: detect early (test on startup), alert immediately, fail fast rather than retrying endlessly.</p>
  <p class="section-text"><strong style="color: var(--purple);">Logic errors:</strong> The workflow ran successfully but produced the wrong result — wrong classification, wrong routing, wrong calculation. The hardest to detect because no exception is thrown. Strategy: output validation, sample auditing, and anomaly detection.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Dead Letter Queues</span>
  <h2 class="section-title">Where Failed Items Go to Wait</h2>
  <p class="section-text">When a workflow item fails all retries and there's no viable fallback, it shouldn't just vanish. A dead-letter queue (DLQ) captures every failed item with its full context — the original data, which step failed, the error message, the timestamp, and how many retries were attempted.</p>
  <p class="section-text">This serves two purposes. First, no data is ever lost. That customer inquiry that failed at 3am because the CRM was down? It's sitting in the DLQ, ready to be reprocessed when the CRM comes back. Second, DLQ patterns reveal systemic issues. If 200 items fail with the same error in one hour, that's not 200 individual problems — it's one root cause.</p>

  <div class="demo-container">
    <p><strong style="color: var(--purple);">Dead-letter queue entry example:</strong></p>
    <p><code>{"item_id": "inv-4521", "step": "crm_update", "error": "401 Unauthorized", "retries": 3, "original_data": {...}, "failed_at": "2026-03-15T03:22:00Z"}</code></p>
    <p><em style="color: var(--dim);">Review your DLQ daily. Process items manually or requeue them in batches. Never let it grow silently.</em></p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Circuit Breakers</span>
  <h2 class="section-title">Stop Hammering a Dead Service</h2>
  <p class="section-text">Imagine an API goes down and your workflow keeps retrying — 3 retries per item, 100 items per minute, that's 300 failed requests per minute hammering a service that's already struggling. You're making the problem worse.</p>
  <p class="section-text">A circuit breaker pattern solves this. After a threshold of failures (say, 5 consecutive errors from the same service), the circuit "opens" — your workflow stops calling that service entirely and goes straight to fallback. After a cooldown period (say, 60 seconds), it tries one request. If it succeeds, the circuit "closes" and normal operation resumes. If it fails, the circuit stays open for another cooldown period.</p>
  <p class="section-text">This protects the failing service, saves your API quota, and keeps your workflow responsive by immediately routing to fallbacks instead of waiting through retry cycles.</p>
</div>

<div class="try-it-box">
  <h3>Try It Now</h3>
  <p>Add error handling to your workflow design from previous lessons.</p>
  <div class="prompt-box">
    <code>For each step in your workflow, answer: (1) What could go wrong? (2) What's the retry strategy? (3) What's the fallback? (4) Who gets alerted, and with what information?</code>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Real-World Example</span>
  <h2 class="section-title">Error Handling in a Complete Workflow</h2>
  <p class="section-text">Here's how all these error handling patterns come together in a real customer onboarding workflow. Each step has its own strategy:</p>

  <div class="demo-container">
    <p><strong style="color: var(--green);">Step 1 — Create CRM contact:</strong> Retry 3x with backoff (transient). If still failing, log to DLQ with all customer data so nothing is lost. Alert: warning.</p>
    <p><strong style="color: var(--blue);">Step 2 — AI classify segment:</strong> Retry 2x (transient). Fallback: default to "general" segment. Circuit breaker if API is down. Alert: info (fallback is safe).</p>
    <p><strong style="color: var(--purple);">Step 3 — Send welcome email:</strong> Retry 3x. Fallback: switch to backup email provider (SendGrid → Mailgun). If both fail, queue email for later delivery. Alert: critical (customer experience impacted).</p>
    <p><strong style="color: var(--orange);">Step 4 — Notify sales team:</strong> Retry 1x. Fallback: log notification to database for manual review. No circuit breaker needed (Slack is highly reliable). Alert: warning.</p>
    <p><em style="color: var(--dim);">Each step fails independently. If the CRM is down, the welcome email still sends. If the email provider is down, the sales notification still fires. That's graceful degradation in practice.</em></p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Logging</span>
  <h2 class="section-title">Error Logs That Actually Help You Debug</h2>
  <p class="section-text">A log entry that says "Error occurred" is useless. A log entry that says "CRM API returned 429 (rate limit exceeded) during contact creation for customer_id=cust_7823 at step 3 of onboarding workflow, attempt 2 of 3" tells you everything. Good error logs include:</p>
  <p class="section-text"><strong style="color: var(--green);">What failed:</strong> The specific step, function, or API call.</p>
  <p class="section-text"><strong style="color: var(--green);">Why it failed:</strong> The error code, message, and response body.</p>
  <p class="section-text"><strong style="color: var(--green);">What data was involved:</strong> The input that triggered the error (redact sensitive fields).</p>
  <p class="section-text"><strong style="color: var(--green);">Where in the retry cycle:</strong> Is this attempt 1, 2, or 3? Has the fallback been triggered?</p>
  <p class="section-text"><strong style="color: var(--green);">When it happened:</strong> Timestamp with timezone. This is critical for correlating with external service outages.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Error Handling and Fallbacks","cards":[{"front":"Errors Are Expected","back":"APIs go down, data arrives malformed, rate limits get hit. These are normal operating conditions, not signs your workflow is broken."},{"front":"Retry Strategy","back":"Wait 5s, then 15s, then 45s — increasing intervals. Most transient errors resolve themselves within 3 attempts."},{"front":"Fallback Strategy","back":"Retries exhausted? Switch to Plan B. Use backup service, apply a default category, flag for human review."},{"front":"AI Confidence Thresholds","back":"Above 80% = act automatically. Between 50-80% = act but flag for review. Below 50% = route to a human."},{"front":"Graceful Degradation","back":"If step 3 of 6 fails, can steps 4-6 still run with partial data? Design steps to be as independent as possible."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">Retry-fallback-alert in Python.</h2>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — production retry with exponential backoff</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> time
<span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">classify_with_retry</span>(text: str, max_retries=<span style="color:#fb923c">3</span>):
    <span style="color:#71717a">"""Retry → Fallback → Alert pattern."""</span>
    <span style="color:#c084fc">for</span> attempt <span style="color:#c084fc">in</span> range(max_retries):
        <span style="color:#c084fc">try</span>:
            response = client.messages.create(
                model=<span style="color:#fbbf24">"claude-haiku-4-5-20251001"</span>,
                max_tokens=<span style="color:#fb923c">50</span>,
                messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
                    <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">f"Classify as BILLING, TECHNICAL, or GENERAL:\n{text}"</span>}]
            )
            <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text.strip()

        <span style="color:#c084fc">except</span> anthropic.RateLimitError:
            wait = <span style="color:#fb923c">5</span> * (<span style="color:#fb923c">3</span> ** attempt)  <span style="color:#71717a"># 5s, 15s, 45s</span>
            <span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Rate limited. Retry {attempt+1}/{max_retries} in {wait}s"</span>)
            time.sleep(wait)

        <span style="color:#c084fc">except</span> anthropic.APIError <span style="color:#c084fc">as</span> e:
            <span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"API error: {e}. Retry {attempt+1}/{max_retries}"</span>)
            time.sleep(<span style="color:#fb923c">5</span>)

    <span style="color:#71717a"># FALLBACK: retries exhausted → default + flag</span>
    send_alert(<span style="color:#fbbf24">"Classification API failed after 3 retries"</span>)
    <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"GENERAL"</span>  <span style="color:#71717a"># safe default category</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — AI confidence thresholds</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">route_by_confidence</span>(text: str):
    <span style="color:#71717a">"""Route based on AI confidence level."""</span>
    response = client.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
        max_tokens=<span style="color:#fb923c">100</span>,
        messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
            <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">f"Classify this ticket and rate your confidence 0-100:\n{text}\n"</span>
                       <span style="color:#fbbf24">"Reply as JSON: {{\"category\": \"...\", \"confidence\": N}}"</span>}]
    )
    result = json.loads(response.content[<span style="color:#fb923c">0</span>].text)

    <span style="color:#c084fc">if</span> result[<span style="color:#fbbf24">"confidence"</span>] >= <span style="color:#fb923c">80</span>:
        auto_route(result[<span style="color:#fbbf24">"category"</span>])        <span style="color:#71717a"># act automatically</span>
    <span style="color:#c084fc">elif</span> result[<span style="color:#fbbf24">"confidence"</span>] >= <span style="color:#fb923c">50</span>:
        auto_route(result[<span style="color:#fbbf24">"category"</span>])        <span style="color:#71717a"># act but flag</span>
        flag_for_review(result)
    <span style="color:#c084fc">else</span>:
        route_to_human(result)              <span style="color:#71717a"># too uncertain</span></code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">The retry pattern uses exponential backoff (5s → 15s → 45s) to handle transient API failures. The confidence threshold pattern turns AI uncertainty into a routing decision — high confidence acts, low confidence escalates.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Lesson 5 Quiz</h2>
  <div data-learn="QuizMC" data-props='{"title":"Error Handling and Fallbacks","questions":[{"q":"What is the correct mental model for treating errors in production workflows?","options":["Errors mean the workflow is broken and needs to be rebuilt","Errors are expected operating conditions — the difference is whether your workflow recovers gracefully","Errors should always stop the entire pipeline","Errors only happen during initial setup and testing"],"correct":1,"explanation":"APIs go down. Data arrives malformed. Rate limits get hit. These are normal operating conditions, not signs of failure. A workflow without error handling is a ticking time bomb. A workflow with error handling is a resilient system."},{"q":"What makes AI uncertainty in classification different from traditional code errors?","options":["AI never produces uncertain outputs","Traditional code has three states: works, error, or uncertain","AI has a third state — uncertainty — requiring confidence thresholds to decide whether to act automatically or route to a human","AI uncertainty is always a sign of bad training data"],"correct":2,"explanation":"Traditional code either works or throws an error. AI adds a third state: uncertain. An 80%+ confident classification acts automatically. A 40% confident one should route to a human. Confidence thresholds turn AI uncertainty into a manageable feature."},{"q":"What does graceful degradation mean in workflow design?","options":["The workflow always fails completely when one step fails","Workflows should shut down rather than produce incomplete results","A workflow that does the best it can with what is available rather than stopping completely when one step fails","Gradual performance improvement over time"],"correct":2,"explanation":"If step 3 of a 6-step pipeline fails, can steps 4-6 still run with partial data? Often yes. Designing steps to be as independent as possible means a single failure does not block the entire pipeline."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-powered-workflows/04-data-flow-design/" class="prev">← Previous: Data Flow Design</a>
  <a href="/academy/ai-powered-workflows/06-human-in-the-loop/" class="next">Next: Human-in-the-Loop →</a>
</nav>

</div>
