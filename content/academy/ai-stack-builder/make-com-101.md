---
title: "Make.com 101"
course: "ai-stack-builder"
order: 3
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Make.com <span class="accent">101</span></h1>
  <p class="sub">Make.com is visual automation. You connect triggers to actions, and data flows between services automatically. It is the glue that holds your stack together — and it replaces thousands of lines of integration code you would otherwise write by hand.</p>
</div>

<div class="content">

<div class="card">
<h2>Why Visual Automation Matters</h2>
<p>Every modern stack has a dirty secret: <strong style="color:#e5e5e5">most of the code is integration glue</strong>. Connecting Stripe to your database, sending Slack notifications when someone subscribes, syncing spreadsheets with analytics — none of this is your product, but it can consume 40% of your development time.</p>

<p>Make.com eliminates that glue code. Instead of writing a custom webhook handler for every service connection, you drag modules onto a canvas, map data fields between them, and hit "Run." The scenario runs on Make.com's infrastructure — no servers, no deployment, no maintenance.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f9e9;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">1,600+</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">App integrations available in Make.com — from Stripe to Notion to GitHub</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x26a1;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Zero Code</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Visual canvas replaces custom integration scripts and webhook handlers</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f4b0;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">1,000 Free</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Operations per month on the free tier — enough for most indie projects</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Anatomy of a Scenario</h2>
<p>A Make.com <strong style="color:#e5e5e5">scenario</strong> is a chain of modules. Each module does exactly one thing: watch for an event, transform data, or send it somewhere. Modules execute left to right, passing data downstream like a conveyor belt.</p>

<p>Every scenario has three parts:</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.8rem">1</div>
<div>
<strong style="color:#34d399;font-size:.88rem">Trigger — What Starts It</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Either a <strong style="color:#e5e5e5">Webhook</strong> (fires when an external service sends data) or a <strong style="color:#e5e5e5">Schedule</strong> (fires on a timer — every hour, every day at 9am, etc.). The trigger is always module #1.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#8b5cf6;font-size:.8rem">2</div>
<div>
<strong style="color:#8b5cf6;font-size:.88rem">Processing — What Happens</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Modules that transform, filter, or route data. <strong style="color:#e5e5e5">Filter</strong> modules apply conditional logic (only continue if amount > $50). <strong style="color:#e5e5e5">Router</strong> modules split the flow into parallel paths. <strong style="color:#e5e5e5">Iterator</strong> modules loop over arrays.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(251,146,60,.04);border-radius:10px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(251,146,60,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fb923c;font-size:.8rem">3</div>
<div>
<strong style="color:#fb923c;font-size:.88rem">Output — What It Produces</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">The final module sends data somewhere: <strong style="color:#e5e5e5">Supabase</strong> (insert a row), <strong style="color:#e5e5e5">Slack</strong> (post a message), <strong style="color:#e5e5e5">Resend</strong> (send an email), <strong style="color:#e5e5e5">Google Sheets</strong> (log a row). Most scenarios end with 1-3 output modules.</p>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Three Real Scenarios (Production-Tested)</h2>
<p>These are not hypothetical examples — they represent the exact patterns used in production AI stacks. Each one replaces 50-100 lines of custom integration code.</p>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#34d399;margin:0 0 .5rem">Scenario 1: Email Capture Pipeline</h4>
<p style="font-size:.85rem;color:#a1a1aa;margin:0 0 .5rem;line-height:1.7"><strong style="color:#e5e5e5">Webhook</strong> (Trigger) &rarr; <strong style="color:#e5e5e5">Resend</strong> (Send Welcome) &rarr; <strong style="color:#e5e5e5">Supabase</strong> (Insert Row) &rarr; <strong style="color:#e5e5e5">Slack</strong> (Notify #growth)</p>
<p style="font-size:.82rem;color:#71717a;margin:0;line-height:1.7">When someone subscribes on your site, the webhook fires. Resend sends a branded welcome email. Supabase stores the subscriber with a timestamp. Slack notifies your team. Total time: under 2 seconds. Zero code.</p>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#8b5cf6;margin:0 0 .5rem">Scenario 2: Content Publishing Autopilot</h4>
<p style="font-size:.85rem;color:#a1a1aa;margin:0 0 .5rem;line-height:1.7"><strong style="color:#e5e5e5">Schedule</strong> (Every Day 9am) &rarr; <strong style="color:#e5e5e5">Supabase</strong> (Get Draft) &rarr; <strong style="color:#e5e5e5">Claude</strong> (Polish Copy) &rarr; <strong style="color:#e5e5e5">CMS</strong> (Publish Post) &rarr; <strong style="color:#e5e5e5">Twitter</strong> (Post Thread)</p>
<p style="font-size:.82rem;color:#71717a;margin:0;line-height:1.7">Every morning, grab a draft from your content queue, have Claude refine the copy, publish to your CMS, and auto-post a Twitter thread. This turns a 30-minute daily task into a fully autonomous pipeline.</p>
</div>

<div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#fb923c;margin:0 0 .5rem">Scenario 3: Revenue Alert System</h4>
<p style="font-size:.85rem;color:#a1a1aa;margin:0 0 .5rem;line-height:1.7"><strong style="color:#e5e5e5">Stripe</strong> (Webhook) &rarr; <strong style="color:#e5e5e5">Filter</strong> (amount &gt; $50) &rarr; <strong style="color:#e5e5e5">Supabase</strong> (Log Revenue) &rarr; <strong style="color:#e5e5e5">Slack</strong> (Celebrate)</p>
<p style="font-size:.82rem;color:#71717a;margin:0;line-height:1.7">When Stripe processes a payment over $50, log it to your revenue table and send a celebration alert to Slack. The filter means small purchases flow silently while big wins get immediate visibility.</p>
</div>
</div>

<div class="card">
<h2>The Data Mapping System</h2>
<p>The most important concept in Make.com is <strong style="color:#e5e5e5">data mapping</strong> — how you reference output from one module inside another. This is what makes the conveyor belt work.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Make.com — Data mapping in the Email Capture scenario</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// Module 1 — Webhook receives this JSON from your website:</span>
{ <span style="color:#34d399">"email"</span>: <span style="color:#fb923c">"user@example.com"</span>, <span style="color:#34d399">"name"</span>: <span style="color:#fb923c">"Alex"</span> }

<span style="color:#71717a">// Module 2 — Resend uses {{1.email}} to pull from Module 1:</span>
To:      <span style="color:#f59e0b">{{1.email}}</span>   <span style="color:#71717a">→ becomes: user@example.com</span>
Subject: <span style="color:#fb923c">"Welcome, </span><span style="color:#f59e0b">{{1.name}}</span><span style="color:#fb923c">!"</span>  <span style="color:#71717a">→ becomes: "Welcome, Alex!"</span>

<span style="color:#71717a">// Module 3 — Supabase also pulls from Module 1:</span>
email:     <span style="color:#f59e0b">{{1.email}}</span>
name:      <span style="color:#f59e0b">{{1.name}}</span>
joined_at: <span style="color:#f59e0b">{{now}}</span>     <span style="color:#71717a">→ built-in: current timestamp</span>

<span style="color:#71717a">// Module 4 — Slack can reference ANY previous module:</span>
Message: <span style="color:#fb923c">"New sub: </span><span style="color:#f59e0b">{{1.name}}</span> <span style="color:#fb923c">(</span><span style="color:#f59e0b">{{1.email}}</span><span style="color:#fb923c">)"</span></code></pre>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">Common mistake:</strong> The number in <code style="color:#f59e0b">{{1.email}}</code> is the <strong style="color:#e5e5e5">module position</strong>, not an array index. Module 1 is always your trigger. If you insert a new module between #2 and #3, all downstream references shift — Make.com handles this automatically, but understanding it prevents confusion when debugging.
</div>
</div>

<div class="card">
<h2>Advanced Modules: Router, Filter, Iterator</h2>
<p>Basic scenarios are linear chains. Advanced scenarios use branching and looping to handle complex logic — still without writing code.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Module</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">What It Does</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">When to Use It</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Router</td>
<td style="padding:.75rem">Splits the flow into parallel paths. Each path gets its own filter condition.</td>
<td style="padding:.75rem">Send different Slack messages for high-value vs. low-value payments. Route errors to a different channel than successes.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Filter</td>
<td style="padding:.75rem">Stops the flow if a condition is not met. Data only passes through if the condition is true.</td>
<td style="padding:.75rem">Only process payments over $50. Only send notifications during business hours. Skip duplicate emails.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Iterator</td>
<td style="padding:.75rem">Takes an array and processes each item one at a time through downstream modules.</td>
<td style="padding:.75rem">A webhook sends 10 line items — process each one separately. Loop through a list of emails to send individual messages.</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Aggregator</td>
<td style="padding:.75rem">Collects multiple items back into a single bundle after an Iterator.</td>
<td style="padding:.75rem">After processing 10 line items individually, combine the results into one summary for Slack or a spreadsheet row.</td>
</tr>
</tbody>
</table>
</div>
</div>

<div class="card">
<h2>Error Handling: Never Fail Silently</h2>
<p>The most dangerous automation is one that fails without telling you. Make.com gives you two tools to prevent silent failures:</p>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(239,68,68,.04);border-radius:10px;border:1px solid rgba(239,68,68,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(239,68,68,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#ef4444;font-size:.9rem">!</div>
<div>
<strong style="color:#ef4444;font-size:.88rem">Error Handler Routes</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Right-click any module and add an error handler. This creates a parallel path that fires only when that module fails. Route errors to Slack, email, or a logging table. <strong style="color:#e5e5e5">Every production scenario should have error handlers on modules that call external APIs</strong> — because external services fail, and you need to know when they do.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.9rem">&#x2713;</div>
<div>
<strong style="color:#34d399;font-size:.88rem">Incomplete Execution Queue</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">When a scenario fails mid-execution, Make.com stores the failed run in the Incomplete Executions queue. You can inspect the data, fix the issue, and re-run the exact same execution. This means <strong style="color:#e5e5e5">no data is lost on failure</strong> — you always get a second chance.</p>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Building Your First Scenario: Step by Step</h2>
<p>The fastest way to learn Make.com is to build a simple three-module scenario. Here is the recommended starting point:</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> Create a new scenario and add a <strong style="color:#e5e5e5">Custom Webhook</strong> module as the trigger</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> Make.com gives you a unique webhook URL — copy it</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> Add a <strong style="color:#e5e5e5">Supabase &rarr; Insert Row</strong> module — map the webhook data to table columns</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> Add a <strong style="color:#e5e5e5">Slack &rarr; Post Message</strong> module — compose a message using <code style="color:#f59e0b">{{1.email}}</code></div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> Click <strong style="color:#e5e5e5">Run Once</strong> — then send a test POST to your webhook URL</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">6.</span> Verify: check Supabase for the new row, check Slack for the notification</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — Test your webhook with curl</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Send a test payload to your Make.com webhook</span>
<span style="color:#c084fc">curl</span> -X POST https://hook.make.com/your-webhook-id \
  -H <span style="color:#fb923c">"Content-Type: application/json"</span> \
  -d <span style="color:#fb923c">'{"email":"test@example.com","name":"Alex"}'</span>

<span style="color:#71717a"># If successful, you should see:</span>
<span style="color:#71717a"># → A new row in your Supabase subscribers table</span>
<span style="color:#71717a"># → A Slack message saying "New sub: Alex (test@example.com)"</span></code></pre>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Pro tip:</strong> Always use <strong style="color:#34d399">Run Once</strong> to test before enabling scheduling. Check every module's output bubble (the green circle) to verify data flows correctly. Only turn on the scenario schedule once every module passes your manual test.
</div>
</div>

<div class="card">
<h2>Operations and Pricing</h2>
<p>Make.com charges by <strong style="color:#e5e5e5">operations</strong> — each module execution counts as one operation. A 4-module scenario run = 4 operations. Understanding this prevents billing surprises.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Plan</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Ops/Month</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Best For</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#34d399">Free</td>
<td style="padding:.75rem">1,000</td>
<td style="padding:.75rem">Learning, testing, low-volume automations (a 4-module scenario can run 250 times/month)</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#8b5cf6">Core ($9/mo)</td>
<td style="padding:.75rem">10,000</td>
<td style="padding:.75rem">Active indie projects — enough for hundreds of daily automations</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#fb923c">Pro ($16/mo)</td>
<td style="padding:.75rem">10,000+</td>
<td style="padding:.75rem">Priority execution, custom functions, full-text log search</td>
</tr>
</tbody>
</table>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Make.com Mastery Check","questions":[{"q":"What does {{1.email}} mean in a Make.com scenario?","options":["Send an email to module 1","The email field from the output of module #1","A variable named 1.email","An error in the mapping"],"correct":1,"explanation":"In Make.com, double curly braces reference data from other modules. The number is the module position in the scenario. {{1.email}} means grab the email field from the first module (usually your trigger)."},{"q":"What is the recommended first module type when building a Make.com scenario?","options":["Supabase insert","Filter logic","A trigger — Webhook or Schedule","Slack notification"],"correct":2,"explanation":"Every scenario must start with a trigger — something that initiates the run. Either a Webhook (fires when an external event happens) or a Schedule (runs on a time interval). Other modules follow the trigger."},{"q":"Why should you add error handlers to modules that call external APIs?","options":["They speed up execution","External services can fail — error handlers create parallel paths so failures notify you instead of failing silently","They are required by Make.com for all scenarios","They reduce operation costs"],"correct":1,"explanation":"External APIs fail — timeouts, rate limits, downtime. An error handler creates a branching path that fires only on failure, routing the error to Slack or email so you always know when something breaks. Without it, failures are silent."},{"q":"A 5-module scenario runs 20 times per day. How many monthly operations does it consume?","options":["20","100","3,000","5"],"correct":2,"explanation":"Each module execution = 1 operation. A 5-module scenario running once = 5 operations. Running 20 times/day = 100 operations/day. Over 30 days = 3,000 operations/month. The free tier (1,000 ops) would not cover this — you would need the Core plan."},{"q":"What is the purpose of the Router module?","options":["It connects to your internet router","It splits the flow into parallel conditional paths — different logic for different conditions","It speeds up data transfer between modules","It replaces the trigger module"],"correct":1,"explanation":"The Router creates branching paths from a single point. Each branch can have its own filter condition — for example, one path for payments over $50 (send celebration) and another for all other payments (log silently). This enables conditional logic without code."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Make.com Flashcards","cards":[{"front":"What is the difference between a Webhook trigger and a Schedule trigger?","back":"Webhook: fires immediately when an external service sends a POST request (event-driven). Schedule: fires at a set time interval like every hour or every day at 9am (time-driven). Use webhooks for real-time reactions, schedules for batch operations."},{"front":"What does idempotency mean when designing Make.com scenarios?","back":"Running the same scenario multiple times with the same data produces the same result without side effects — like duplicate emails or double database inserts. Design scenarios to check for existing records before inserting."},{"front":"How do you reference data from module 3 inside module 5?","back":"Use {{3.fieldName}} syntax. The number is always the module position, and fieldName is the specific output field you want to reference from that module."},{"front":"What happens when a scenario fails mid-execution?","back":"Make.com stores the failed run in the Incomplete Executions queue. You can inspect the payload, fix the issue in your scenario, and re-run the exact same execution with the original data. No data is lost."},{"front":"What is a Router module and when do you use it?","back":"A Router splits scenario flow into parallel branches, each with its own filter condition. Use it when the same trigger needs different handling based on conditions — like high-value vs. low-value payments, or success vs. error paths."},{"front":"How are Make.com operations counted for billing?","back":"Each module execution = 1 operation. A 4-module scenario running once = 4 operations. A scenario with a Router that takes 2 branches counts all modules on both branches. Free tier gives 1,000 ops/month."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 3 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
