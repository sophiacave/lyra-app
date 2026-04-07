---
title: "Automation Quiz"
course: "automation-architect"
order: 3
type: "quiz"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/automation-architect/">Automation Architect</a>
  <span class="lesson-badge">Lesson 3 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Automation Quiz</h1>
  <p class="sub">Test your knowledge of triggers, actions, webhooks, and cron schedules.</p>
</div>

<div class="content">

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Course Recap: Automation Fundamentals</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Review these core concepts before the quiz. Every question draws directly from these fundamentals.</p>

    <h3 style="color:#8b5cf6;font-size:.9rem;margin-bottom:.75rem">Automation Triggers</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">A trigger is the event that starts an automation. Nothing happens until the trigger fires. There are three fundamental types, and choosing the right one determines the reliability and responsiveness of your entire workflow.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#8b5cf6;font-size:.82rem">Webhook Trigger</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Real-time. An external system sends an HTTP POST to your URL the instant an event occurs. Zero delay. Used for: payment events, form submissions, GitHub commits, Slack messages.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#8b5cf6;font-size:.82rem">Schedule Trigger</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Time-based. Fires on a cron schedule — every hour, every day at 9 AM, every Monday at noon. Used for: daily reports, data sync, cleanup tasks, digest emails.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#8b5cf6;font-size:.82rem">Event Trigger</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Internal. Fires when something changes in your own system — a database row updates, a user signs up, a file is uploaded. Used for: user onboarding, status changes, threshold alerts.</p>
      </div>
    </div>

    <h3 style="color:#34d399;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">Workflow Design</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">A workflow is a sequence of steps that processes data from trigger to final action. Good workflow design means thinking about data flow, error handling, and what happens when things go wrong.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Trigger &rarr; Payload &rarr; Action</strong> — the fundamental pattern. The trigger produces a payload (structured data), and the action consumes it.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Multi-step workflows</strong> chain actions together. Step 1's output becomes Step 2's input. Each step transforms the data for the next.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Conditional branches</strong> route data based on rules. Example: if order total > $100, send to priority queue; otherwise, standard queue.</span>
      </div>
    </div>

    <h3 style="color:#fb923c;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">API Integration</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">APIs are how your automation talks to external services. Every automation platform is fundamentally an API orchestrator — it calls APIs on your behalf in a sequence you define.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">REST APIs</strong> use HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Authentication</strong> is required for most APIs. API keys, OAuth tokens, and JWTs are the three main patterns.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Rate limits</strong> cap how many requests you can make per time window. Automations in loops can hit limits fast — always add delays.</span>
      </div>
    </div>

    <h3 style="color:#ef4444;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">Error Handling</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Production automations fail. The difference between amateur and professional automation is how failures are handled.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Idempotency</strong> — actions must be safe to run multiple times. Webhooks can fire twice. Your action should check before creating duplicates.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Retry with backoff</strong> — transient failures (network blips, rate limits) should be retried with exponential backoff: 1s, 2s, 4s, 8s.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Dead letter queue</strong> — messages that fail after all retries go to a holding queue for manual inspection. Data is never lost.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Payload validation</strong> — always validate the incoming data structure before acting on it. External APIs can change their payload format without warning.</span>
      </div>
    </div>

    <h3 style="color:#38bdf8;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">Production Patterns</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">These patterns separate hobbyist automations from production-grade systems.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Logging</strong> — log every trigger event, every action result, and every error. Without logs, debugging production failures is blind guessing.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Monitoring</strong> — set up alerts for failure rates, execution times, and queue depths. Know when something breaks before your users tell you.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Testing</strong> — test with sample data in staging before going live. Run the full pipeline end-to-end, including error cases.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Versioning</strong> — when you update a workflow, keep the old version running until the new one is verified. Never do a hard cutover.</span>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Cron Expression Quick Reference</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Cron expressions control schedule triggers. The format has five fields: <code>minute hour day-of-month month day-of-week</code>.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Common Cron Expressions</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Every minute</span>
<span style="color:#34d399">* * * * *</span>

<span style="color:#71717a"># Every day at midnight</span>
<span style="color:#34d399">0 0 * * *</span>

<span style="color:#71717a"># Every Monday at 9 AM</span>
<span style="color:#34d399">0 9 * * 1</span>

<span style="color:#71717a"># Every 5 minutes</span>
<span style="color:#34d399">*/5 * * * *</span>

<span style="color:#71717a"># First day of every month at noon</span>
<span style="color:#34d399">0 12 1 * *</span>

<span style="color:#71717a"># Weekdays at 8:30 AM</span>
<span style="color:#34d399">30 8 * * 1-5</span></code></pre>
</div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Webhook Security Essentials</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Webhooks are publicly accessible URLs. Anyone who discovers the URL can send fake data to your automation. Securing your webhooks is not optional — it prevents attackers from triggering false actions in your system.</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Verify webhook signatures</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Most services (Stripe, GitHub, Slack) sign their webhook payloads with a secret key. Your code should verify the signature before processing the data. If the signature does not match, reject the request — it was not sent by the real service.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Use HTTPS only</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Never expose a webhook over plain HTTP. Without encryption, anyone on the network path can read the payloads, which may contain customer data, financial information, or authentication tokens.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Check timestamps</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Webhook payloads include a timestamp. Reject payloads older than 5 minutes — they could be replay attacks where someone captured a valid webhook and resent it later to trigger duplicate actions.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Respond fast, process async</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Return a 200 response immediately, then process the payload in a background job. If your webhook takes too long to respond, the sender will retry — causing duplicate processing. Accept fast, process later.</p>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Automation Architecture Patterns</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">As your automations grow from single workflows to interconnected systems, these architecture patterns keep everything manageable.</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Event-Driven Architecture</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Systems communicate by emitting and consuming events. When a payment succeeds, it emits a "payment.succeeded" event. Multiple systems can react independently — billing creates an invoice, support creates an onboarding ticket, analytics logs the conversion. Each consumer is decoupled from the others.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Message Queue Pattern</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">A queue sits between producer and consumer. The producer adds messages to the queue, the consumer processes them at its own pace. This handles traffic spikes — if 1000 orders arrive in one second, the queue absorbs them and the consumer processes them steadily. No data is lost.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Circuit Breaker Pattern</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">If an external API fails repeatedly, the circuit breaker "opens" and stops sending requests for a cooldown period. This prevents your automation from hammering a broken service and gives it time to recover. After the cooldown, the breaker "half-opens" and sends a test request to check if the service is back.</p>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Automation Debugging Checklist</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">When an automation stops working, follow this systematic approach instead of guessing.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:30px">1</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Check if the trigger fired.</strong> Look at your logs. If the trigger never fired, the problem is upstream — the event never happened, the webhook URL changed, or the cron schedule is wrong.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:30px">2</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Inspect the payload.</strong> If the trigger fired, check what data it produced. Did the payload structure change? Are required fields missing? Is the data in the expected format?</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:30px">3</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Test each action in isolation.</strong> Run each step manually with the payload data. Find which specific step is failing and what error it produces.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:30px">4</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Check external dependencies.</strong> Is the API you are calling still up? Did they change their endpoint, authentication, or rate limits? Check their status page and changelog.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:30px">5</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Review recent changes.</strong> Did someone update the workflow? Did a dependency get upgraded? Did an API key expire? Most production failures trace back to a recent change.</span>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Automation Fundamentals","questions":[{"q":"What is a trigger in automation?","options":["A function that transforms data","An event that starts an automation","A database query","An API response"],"correct":1,"explanation":"A trigger is the event that kicks off your automation — it is the when that fires before any actions execute."},{"q":"Which cron expression runs a task every day at midnight?","options":["* * * * *","0 0 * * *","0 12 * * 1","*/5 * * * *"],"correct":1,"explanation":"0 0 * * * means minute 0, hour 0 (midnight), every day, every month, every day of week."},{"q":"What does a webhook do?","options":["Polls a server every 5 seconds","Sends a scheduled email","Receives real-time data via HTTP POST","Stores data in a cache"],"correct":2,"explanation":"A webhook is a URL that receives real-time HTTP POST requests when an event occurs in an external system."},{"q":"In a trigger-action pair, what flows between them?","options":["HTML pages","Data (the event payload)","CSS styles","User credentials"],"correct":1,"explanation":"Data flows from trigger to action. The trigger produces a payload (event data) that the action consumes and acts upon."},{"q":"Which is NOT a common automation action?","options":["Send an email notification","Write to a database","Call an external API","Listen for a webhook"],"correct":3,"explanation":"Listening for a webhook is a trigger, not an action. Actions are the things that happen after a trigger fires."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Key Automation Concepts","cards":[{"front":"Trigger","back":"The event that starts an automation — the when. Examples: new email, form submitted, schedule fires."},{"front":"Action","back":"The task executed after a trigger fires. Examples: send email, save to DB, call API."},{"front":"Webhook","back":"A URL endpoint that receives real-time HTTP POST data from external systems."},{"front":"Cron expression 0 0 * * *","back":"Runs every day at midnight. minute=0, hour=0, day=any, month=any, weekday=any."},{"front":"Event payload","back":"The structured data produced by a trigger and passed to the action for processing."}]}'></div>


</div>

</div>

