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

<div class="try-it-box">
  <h3>Try It Now</h3>
  <p>Add error handling to your workflow design from previous lessons.</p>
  <div class="prompt-box">
    <code>For each step in your workflow, answer: (1) What could go wrong? (2) What's the retry strategy? (3) What's the fallback? (4) Who gets alerted, and with what information?</code>
  </div>
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
