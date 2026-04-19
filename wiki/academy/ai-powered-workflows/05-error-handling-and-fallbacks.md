# Error Handling and Fallbacks

**Course:** Building AI-Powered Workflows
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[← Back to Course](/academy/ai-powered-workflows/)
  Lesson 5 of 10


  # Error Handling and Fallbacks

  Things will break. The question is whether your workflow recovers gracefully.


  ### What You'll Learn


    - Why errors aren't bugs — they're expected behavior

    - The retry-fallback-alert pattern

    - Designing workflows that degrade gracefully

    - How AI handles uncertainty differently than traditional code




  Mindset
  ## Errors Are Not Failures

  APIs go down. Data arrives malformed. Rate limits get hit. Network connections drop. These aren't signs your workflow is broken — they're normal operating conditions. The difference between an amateur workflow and a production-grade one is how it handles the unexpected.
  A workflow without error handling is a ticking time bomb. A workflow with error handling is a resilient system that runs for months without intervention.


  The Pattern
  ## Retry → Fallback → Alert



    **Retry:** The API timed out? Wait 5 seconds, try again. Most transient errors resolve themselves. Set a retry limit — typically 3 attempts with increasing wait times (5s, 15s, 45s).
    **Fallback:** Retries exhausted? Switch to Plan B. If the primary email service is down, route through the backup. If AI classification fails, apply a default category and flag for human review.
    **Alert:** Fallback activated? Notify someone. Not with a panic alarm — with a clear message: what failed, when, what the fallback did, and what needs attention. Then the workflow keeps running.



  AI-Specific
  ## When AI Isn't Sure

  Traditional code either works or throws an error. AI has a third state: uncertain. An AI classifier might be 95% confident a support ticket is "billing" but only 40% confident another is "technical." Your workflow needs to handle that confidence spectrum.
  Set confidence thresholds. Above 80%? Act automatically. Between 50-80%? Act but flag for review. Below 50%? Route to a human. This turns AI uncertainty from a liability into a feature — the system knows what it knows and what it doesn't.


  Graceful Degradation
  ## The Show Must Go On

  The best workflows don't stop when something breaks — they do the best they can with what's available. If step 3 of a 6-step pipeline fails, can steps 4-6 still run with partial data? Often, yes. Design your workflows so that each step is as independent as possible, contributing to the whole but not completely blocking it.
  Think of it like a restaurant kitchen. If the dishwasher breaks, you don't close the restaurant. You adapt. Your workflows should do the same.


  Error Categories
  ## Knowing What Went Wrong Changes Everything

  Not all errors are created equal. Categorizing errors helps you build the right response for each type:
  **Transient errors:** Network timeouts, rate limits, temporary service outages. These resolve themselves. Strategy: retry with backoff. Most APIs recover within 30-60 seconds.
  **Data errors:** Malformed input, missing required fields, type mismatches. These won't fix themselves on retry. Strategy: validate at the boundary, return a clear error message, route to a dead-letter queue for manual review.
  **Configuration errors:** Expired API keys, wrong endpoint URLs, missing environment variables. These affect every request until fixed. Strategy: detect early (test on startup), alert immediately, fail fast rather than retrying endlessly.
  **Logic errors:** The workflow ran successfully but produced the wrong result — wrong classification, wrong routing, wrong calculation. The hardest to detect because no exception is thrown. Strategy: output validation, sample auditing, and anomaly detection.


  Dead Letter Queues
  ## Where Failed Items Go to Wait

  When a workflow item fails all retries and there's no viable fallback, it shouldn't just vanish. A dead-letter queue (DLQ) captures every failed item with its full context — the original data, which step failed, the error message, the timestamp, and how many retries were attempted.
  This serves two purposes. First, no data is ever lost. That customer inquiry that failed at 3am because the CRM was down? It's sitting in the DLQ, ready to be reprocessed when the CRM comes back. Second, DLQ patterns reveal systemic issues. If 200 items fail with the same error in one hour, that's not 200 individual problems — it's one root cause.


    **Dead-letter queue entry example:**
    `{"item_id": "inv-4521", "step": "crm_update", "error": "401 Unauthorized", "retries": 3, "original_data": {...}, "failed_at": "2026-03-15T03:22:00Z"}`
    *Review your DLQ daily. Process items manually or requeue them in batches. Never let it grow silently.*



  Circuit Breakers
  ## Stop Hammering a Dead Service

  Imagine an API goes down and your workflow keeps retrying — 3 retries per item, 100 items per minute, that's 300 failed requests per minute hammering a service that's already struggling. You're making the problem worse.
  A circuit breaker pattern solves this. After a threshold of failures (say, 5 consecutive errors from the same service), the circuit "opens" — your workflow stops calling that service entirely and goes straight to fallback. After a cooldown period (say, 60 seconds), it tries one request. If it succeeds, the circuit "closes" and normal operation resumes. If it fails, the circuit stays open for another cooldown period.
  This protects the failing service, saves your API quota, and keeps your workflow responsive by immediately routing to fallbacks instead of waiting through retry cycles.


  ### Try It Now

  Add error handling to your workflow design from previous lessons.

    `For each step in your workflow, answer: (1) What could go wrong? (2) What's the retry strategy? (3) What's the fallback? (4) Who gets alerted, and with what information?`



  Real-World Example
  ## Error Handling in a Complete Workflow

  Here's how all these error handling patterns come together in a real customer onboarding workflow. Each step has its own strategy:


    **Step 1 — Create CRM contact:** Retry 3x with backoff (transient). If still failing, log to DLQ with all customer data so nothing is lost. Alert: warning.
    **Step 2 — AI classify segment:** Retry 2x (transient). Fallback: default to "general" segment. Circuit breaker if API is down. Alert: info (fallback is safe).
    **Step 3 — Send welcome email:** Retry 3x. Fallback: switch to backup email provider (SendGrid → Mailgun). If both fail, queue email for later delivery. Alert: critical (customer experience impacted).
    **Step 4 — Notify sales team:** Retry 1x. Fallback: log notification to database for manual review. No circuit breaker needed (Slack is highly reliable). Alert: warning.
    *Each step fails independently. If the CRM is down, the welcome email still sends. If the email provider is down, the sales notification still fires. That's graceful degradation in practice.*



  Logging
  ## Error Logs That Actually Help You Debug

  A log entry that says "Error occurred" is useless. A log entry that says "CRM API returned 429 (rate limit exceeded) during contact creation for customer_id=cust_7823 at step 3 of onboarding workflow, attempt 2 of 3" tells you everything. Good error logs include:
  **What failed:** The specific step, function, or API call.
  **Why it failed:** The error code, message, and response body.
  **What data was involved:** The input that triggered the error (redact sensitive fields).
  **Where in the retry cycle:** Is this attempt 1, 2, or 3? Has the fallback been triggered?
  **When it happened:** Timestamp with timezone. This is critical for correlating with external service outages.



### Error Handling and Fallbacks

**Card 1:**
Front: Errors Are Expected
Back: APIs go down, data arrives malformed, rate limits get hit. These are normal operating conditions, not signs your workflow is broken.

**Card 2:**
Front: Retry Strategy
Back: Wait 5s, then 15s, then 45s — increasing intervals. Most transient errors resolve themselves within 3 attempts.

**Card 3:**
Front: Fallback Strategy
Back: Retries exhausted? Switch to Plan B. Use backup service, apply a default category, flag for human review.

**Card 4:**
Front: AI Confidence Thresholds
Back: Above 80% = act automatically. Between 50-80% = act but flag for review. Below 50% = route to a human.

**Card 5:**
Front: Graceful Degradation
Back: If step 3 of 6 fails, can steps 4-6 still run with partial data? Design steps to be as independent as possible.


  The Code
  ## Retry-fallback-alert in Python.


Python — production retry with exponential backoff

```
import time
import anthropic

client = anthropic.Anthropic()

def classify_with_retry(text: str, max_retries=3):
    """Retry → Fallback → Alert pattern."""
    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=50,
                messages=[{"role": "user",
                    "content": f"Classify as BILLING, TECHNICAL, or GENERAL:\n{text}"}]
            )
            return response.content[0].text.strip()

        except anthropic.RateLimitError:
            wait = 5 * (3 ** attempt)  # 5s, 15s, 45s
            print(f"Rate limited. Retry {attempt+1}/{max_retries} in {wait}s")
            time.sleep(wait)

        except anthropic.APIError as e:
            print(f"API error: {e}. Retry {attempt+1}/{max_retries}")
            time.sleep(5)

    # FALLBACK: retries exhausted → default + flag
    send_alert("Classification API failed after 3 retries")
    return "GENERAL"  # safe default category
```


Python — AI confidence thresholds

```
def route_by_confidence(text: str):
    """Route based on AI confidence level."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=100,
        messages=[{"role": "user",
            "content": f"Classify this ticket and rate your confidence 0-100:\n{text}\n"
                       "Reply as JSON: {{\"category\": \"...\", \"confidence\": N}}"}]
    )
    result = json.loads(response.content[0].text)

    if result["confidence"] >= 80:
        auto_route(result["category"])        # act automatically
    elif result["confidence"] >= 50:
        auto_route(result["category"])        # act but flag
        flag_for_review(result)
    else:
        route_to_human(result)              # too uncertain
```


The retry pattern uses exponential backoff (5s → 15s → 45s) to handle transient API failures. The confidence threshold pattern turns AI uncertainty into a routing decision — high confidence acts, low confidence escalates.


  Check Your Understanding
  ## Lesson 5 Quiz


### Quiz

**Q1: What is the correct mental model for treating errors in production workflows?**
    A. Errors mean the workflow is broken and needs to be rebuilt
  ✓ B. Errors are expected operating conditions — the difference is whether your workflow recovers gracefully
    C. Errors should always stop the entire pipeline
    D. Errors only happen during initial setup and testing
  *APIs go down. Data arrives malformed. Rate limits get hit. These are normal operating conditions, not signs of failure. A workflow without error handling is a ticking time bomb. A workflow with error handling is a resilient system.*

**Q2: What makes AI uncertainty in classification different from traditional code errors?**
    A. AI never produces uncertain outputs
    B. Traditional code has three states: works, error, or uncertain
  ✓ C. AI has a third state — uncertainty — requiring confidence thresholds to decide whether to act automatically or route to a human
    D. AI uncertainty is always a sign of bad training data
  *Traditional code either works or throws an error. AI adds a third state: uncertain. An 80%+ confident classification acts automatically. A 40% confident one should route to a human. Confidence thresholds turn AI uncertainty into a manageable feature.*

**Q3: What does graceful degradation mean in workflow design?**
    A. The workflow always fails completely when one step fails
    B. Workflows should shut down rather than produce incomplete results
  ✓ C. A workflow that does the best it can with what is available rather than stopping completely when one step fails
    D. Gradual performance improvement over time
  *If step 3 of a 6-step pipeline fails, can steps 4-6 still run with partial data? Often yes. Designing steps to be as independent as possible means a single failure does not block the entire pipeline.*


  [← Previous: Data Flow Design](/academy/ai-powered-workflows/04-data-flow-design/)
  [Next: Human-in-the-Loop →](/academy/ai-powered-workflows/06-human-in-the-loop/)
