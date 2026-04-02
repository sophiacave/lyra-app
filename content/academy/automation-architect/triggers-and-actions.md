---
title: "Triggers and Actions"
course: "automation-architect"
order: 1
type: "lesson"
free: true
---<div class="container">
  <div class="header">
    <div class="tag">Automation Architect — Lesson 1</div>
    <h1>Triggers & Actions</h1>
    <p>Every automation has two parts: something that starts it (the trigger) and something that happens because of it (the action). Master this pattern and you can automate anything.</p>
  </div>

  <div class="section" style="padding:0 1.5rem">
    <h2>The Trigger-Action Pattern</h2>
    <p>Every automation in the world — from a Gmail filter to a million-dollar enterprise workflow — follows one pattern:</p>

    <div style="display:flex;align-items:center;gap:1rem;justify-content:center;margin:1.5rem 0;flex-wrap:wrap">
      <div style="padding:.75rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.15);text-align:center">
        <div style="font-size:1.2rem">&#x26A1;</div>
        <strong style="color:#8b5cf6;font-size:.85rem">TRIGGER</strong>
        <div style="font-size:.75rem;color:#a1a1aa">Something happens</div>
      </div>
      <div style="font-size:1.5rem;color:#52525b">&rarr;</div>
      <div style="padding:.75rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.15);text-align:center">
        <div style="font-size:1.2rem">&#x1F4E6;</div>
        <strong style="color:#fb923c;font-size:.85rem">PAYLOAD</strong>
        <div style="font-size:.75rem;color:#a1a1aa">Data flows through</div>
      </div>
      <div style="font-size:1.5rem;color:#52525b">&rarr;</div>
      <div style="padding:.75rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);text-align:center">
        <div style="font-size:1.2rem">&#x2699;&#xFE0F;</div>
        <strong style="color:#34d399;font-size:.85rem">ACTION</strong>
        <div style="font-size:.75rem;color:#a1a1aa">Something is done</div>
      </div>
    </div>

    <p>The <strong>trigger</strong> is the "when" — the event that starts the automation. The <strong>payload</strong> is the data that flows from trigger to action. The <strong>action</strong> is the "then" — what your automation does with that data.</p>
  </div>

  <div class="section" style="padding:0 1.5rem">
    <h2>Three Types of Triggers</h2>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">&#x1F517; Webhook Trigger</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Fires instantly when an external system sends data to your URL. Real-time — zero delay. Example: Stripe sends a webhook when a payment succeeds, your automation creates the customer account.</p>
        <div style="font-size:.8rem;color:#71717a;margin-top:.4rem;font-style:italic">Best for: Form submissions, payment events, GitHub commits, Slack messages — any event from an external service.</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">&#x23F0; Schedule Trigger</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Fires on a time-based schedule — every hour, every day at 9 AM, every Monday. Uses cron expressions under the hood. Example: Every morning at 8 AM, pull yesterday's sales data and email a summary to the team.</p>
        <div style="font-size:.8rem;color:#71717a;margin-top:.4rem;font-style:italic">Best for: Reports, data sync, cleanup tasks, digest emails — anything that runs on a clock.</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">&#x26A1; Event Trigger</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Fires when something happens inside your own system — a database row changes, a user signs up, a file is uploaded. Example: When a new user signs up, send a welcome email and create their onboarding checklist.</p>
        <div style="font-size:.8rem;color:#71717a;margin-top:.4rem;font-style:italic">Best for: Internal events — user signups, status changes, threshold alerts, system health checks.</div>
      </div>
    </div>
  </div>

  <div class="section" style="padding:0 1.5rem">
    <h2>Understanding Payloads</h2>
    <p>The payload is the data that flows from trigger to action. Every trigger produces a payload — it is what the action works with. Here is what a real webhook payload looks like:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.8rem;color:#a1a1aa;line-height:1.6;overflow-x:auto">
      <span style="color:#71717a">// Stripe sends this when a payment succeeds:</span><br>
      {<br>
      &nbsp;&nbsp;<span style="color:#8b5cf6">"type"</span>: <span style="color:#34d399">"payment_intent.succeeded"</span>,<br>
      &nbsp;&nbsp;<span style="color:#8b5cf6">"data"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#8b5cf6">"customer_email"</span>: <span style="color:#34d399">"jane@acme.co"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#8b5cf6">"amount"</span>: <span style="color:#fb923c">4900</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#8b5cf6">"currency"</span>: <span style="color:#34d399">"usd"</span><br>
      &nbsp;&nbsp;}<br>
      }
    </div>

    <p style="font-size:.85rem;color:#a1a1aa">Your action reads this payload and acts on it — save the customer to a database, send a receipt email, update a dashboard. The payload is the bridge between trigger and action.</p>

    <p style="font-size:.85rem;color:#a1a1aa;margin-top:1rem">Here is how you set up a webhook listener in Python that receives that Stripe payload and routes it to the correct action:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Webhook trigger with payload routing</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> flask <span style="color:#c084fc">import</span> Flask, request, jsonify

app = <span style="color:#34d399">Flask</span>(__name__)

<span style="color:#71717a"># Define which action runs for each trigger event type</span>
ACTIONS = {
    <span style="color:#fb923c">"payment_intent.succeeded"</span>: <span style="color:#fb923c">"create_account"</span>,
    <span style="color:#fb923c">"customer.subscription.deleted"</span>: <span style="color:#fb923c">"revoke_access"</span>,
    <span style="color:#fb923c">"invoice.payment_failed"</span>: <span style="color:#fb923c">"send_retry_email"</span>,
}

<span style="color:#c084fc">@</span>app.<span style="color:#34d399">route</span>(<span style="color:#fb923c">"/webhook/stripe"</span>, methods=[<span style="color:#fb923c">"POST"</span>])
<span style="color:#c084fc">def</span> <span style="color:#34d399">stripe_webhook</span>():
    <span style="color:#71717a"># The payload arrives as JSON in the request body</span>
    payload = request.<span style="color:#34d399">get_json</span>()
    event_type = payload.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"type"</span>, <span style="color:#fb923c">"unknown"</span>)

    <span style="color:#71717a"># Route to the correct action based on trigger type</span>
    action = ACTIONS.<span style="color:#34d399">get</span>(event_type)
    <span style="color:#c084fc">if</span> action:
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Trigger: </span>{event_type}<span style="color:#fb923c"> → Action: </span>{action}<span style="color:#fb923c">"</span>)
        <span style="color:#34d399">dispatch_action</span>(action, payload[<span style="color:#fb923c">"data"</span>])
    <span style="color:#c084fc">else</span>:
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Unhandled event: </span>{event_type}<span style="color:#fb923c">"</span>)

    <span style="color:#c084fc">return</span> <span style="color:#34d399">jsonify</span>({<span style="color:#fb923c">"received"</span>: <span style="color:#c084fc">True</span>}), <span style="color:#fb923c">200</span>

<span style="color:#c084fc">def</span> <span style="color:#34d399">dispatch_action</span>(action: str, data: dict):
    <span style="color:#fb923c">"""Execute the action with the trigger's payload data."""</span>
    <span style="color:#c084fc">if</span> action == <span style="color:#fb923c">"create_account"</span>:
        email = data[<span style="color:#fb923c">"customer_email"</span>]
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Creating account for </span>{email}<span style="color:#fb923c">"</span>)
    <span style="color:#c084fc">elif</span> action == <span style="color:#fb923c">"revoke_access"</span>:
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Revoking access for </span>{data[<span style="color:#fb923c">'customer_email'</span>]}<span style="color:#fb923c">"</span>)
    <span style="color:#c084fc">elif</span> action == <span style="color:#fb923c">"send_retry_email"</span>:
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Sending payment retry email to </span>{data[<span style="color:#fb923c">'customer_email'</span>]}<span style="color:#fb923c">"</span>)</code></pre>
</div>
  </div>

  <div class="section" style="padding:0 1.5rem">
    <h2>Real-World Automation Examples</h2>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.75rem;min-width:80px">E-COMMERCE</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Trigger:</strong> New order placed &rarr; <strong>Action:</strong> Send confirmation email + update inventory + notify warehouse</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#fb923c;font-weight:700;font-size:.75rem;min-width:80px">SUPPORT</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Trigger:</strong> Customer submits ticket &rarr; <strong>Action:</strong> AI classifies priority + routes to correct team + sends acknowledgment</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#34d399;font-weight:700;font-size:.75rem;min-width:80px">DEVOPS</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Trigger:</strong> Server CPU > 90% for 5 minutes &rarr; <strong>Action:</strong> Scale up instance + alert on-call engineer + log incident</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#f472b6;font-weight:700;font-size:.75rem;min-width:80px">MARKETING</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Trigger:</strong> User signs up for free trial &rarr; <strong>Action:</strong> Add to email sequence + create CRM record + notify sales if enterprise domain</span>
      </div>
    </div>
  </div>

  <div class="section" style="padding:0 1.5rem">
    <h2>When Things Go Wrong</h2>
    <p>Real automations fail. Knowing the failure modes makes you a better architect:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Trigger fires twice</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Webhooks can be retried by the sender. Your action needs to be <em>idempotent</em> (safe to run multiple times). Example: check if the customer already exists before creating a duplicate.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Action fails mid-execution</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — The email sent, but the database save failed. You need error handling and retry logic. Some systems use a <em>dead letter queue</em> to save failed messages for later inspection.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Payload format changes</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — The external service updates their API and the payload structure changes. Your action breaks because it expects fields that no longer exist. Always validate payload structure before acting on it.</span>
      </div>
    </div>
  </div>

  <div class="section" style="padding:0 1.5rem">
    <h2>Practice: Build Automation Flows</h2>
    <p>Drag triggers and actions onto the canvas below to build three automation flows:</p>
  </div>

  <div class="hud">
    <div class="hud-item"><div class="hud-label">Challenge</div><div class="hud-val" id="challengeNum">1/3</div></div>
    <div class="hud-item"><div class="hud-label">Score</div><div class="hud-val" id="scoreVal">0</div></div>
  </div>

  <div class="challenge-dots">
    </div>

  <div class="challenge-bar">
    <div class="challenge-label">Build this automation</div>
    </div>

  <div class="builder">
    <div class="palette" id="triggerPalette">
      <div class="palette-title">Triggers</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="webhook"><span class="icon">&#x1F517;</span>Webhook</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="schedule"><span class="icon">&#x23F0;</span>Schedule</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="event"><span class="icon">&#x26A1;</span>Event</div>
    </div>

    <div class="canvas-area" id="canvasArea">
      <div class="canvas-label" id="canvasLabel">Drop a trigger here,<br>then add an action</div>
      <canvas id="flowCanvas"></canvas>
    </div>

    <div class="palette" id="actionPalette">
      <div class="palette-title">Actions</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="email"><span class="icon">&#x1F4E7;</span>Send Email</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="database"><span class="icon">&#x1F4BE;</span>Save to DB</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="api"><span class="icon">&#x1F310;</span>Call API</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="notify"><span class="icon">&#x1F514;</span>Notification</div>
    </div>
  </div>

  <button class="run-btn" id="runBtn" onclick="runFlow()">Run Automation</button>
  <div class="complete-card" id="completeCard">
    <h3>Lesson Complete!</h3>
    <p>You've built 3 real automation flows. You now understand how triggers initiate workflows and actions execute them.</p>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"Triggers vs Actions","cards":[{"front":"What is a Trigger?","back":"An event that starts an automation — the \"when\" that fires before any actions execute. Three types: webhook (real-time), schedule (time-based), event (internal system)."},{"front":"What is an Action?","back":"The task performed after a trigger fires. Can be anything: send email, save to database, call API, send notification, create record, update dashboard."},{"front":"Webhook Trigger","back":"Receives real-time HTTP POST data from an external system. Zero delay. Used for: payments, form submissions, GitHub events, Slack messages."},{"front":"Schedule Trigger","back":"Fires on a time-based schedule using cron expressions. Used for: daily reports, data sync, cleanup tasks, digest emails."},{"front":"Event Trigger","back":"Fires when something happens inside your own system — user signup, status change, threshold crossed. Internal, not from external services."},{"front":"Payload","back":"The structured data that flows from trigger to action. Contains the event details — who, what, when. The action reads the payload to know what to do."},{"front":"Idempotent Action","back":"An action that produces the same result even if run multiple times. Critical because webhooks can fire twice. Example: check if record exists before creating."},{"front":"Dead Letter Queue","back":"Where failed messages go when an action cannot process them. Preserves data for manual inspection and retry instead of losing it forever."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Triggers & Actions Check","questions":[{"q":"What is the role of a trigger in automation?","options":["Transform data into a new format","Start the automation when an event occurs","Store the result of an action","Connect two APIs together"],"correct":1,"explanation":"A trigger is the event that kicks off your automation — nothing runs until the trigger fires."},{"q":"Which of these is an action, not a trigger?","options":["New email arrives","Form submitted","Schedule fires","Send Slack notification"],"correct":3,"explanation":"Send Slack notification is what happens after a trigger — it is an action. The others are events that can start a workflow."},{"q":"A webhook trigger listens for what type of data?","options":["CSV files","Incoming HTTP POST requests","Database queries","Scheduled cron jobs"],"correct":1,"explanation":"A webhook is a URL that receives real-time HTTP POST data when an external event occurs."},{"q":"Why should automation actions be idempotent?","options":["It makes them run faster","Webhooks can fire twice, so the action must be safe to repeat","Idempotent actions use less memory","It is required by all automation platforms"],"correct":1,"explanation":"Webhooks can be retried by the sender, causing your trigger to fire multiple times. An idempotent action (like checking before creating) prevents duplicate records or double-sends."},{"q":"What is a dead letter queue?","options":["A queue for deleted emails","A storage location for messages that failed to process","A type of webhook trigger","An action that sends error notifications"],"correct":1,"explanation":"A dead letter queue stores messages that could not be processed successfully. This preserves the data for manual inspection and retry instead of losing it."}]}'></div>

</div>
