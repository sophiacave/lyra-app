---
title: "Make.com 101"
course: "ai-stack-builder"
order: 3
type: "lesson"
free: true
---<div class="container">
<div class="nav">

<span class="current">Lesson 3 of 10</span>

</div>

<div class="lesson-badge">MODULE 1 &middot; 260 XP</div>
<h1>Make.com 101</h1>
<p class="intro">Make.com is visual automation. You connect triggers to actions, and data flows between services automatically. It's the glue that holds your stack together.</p>

<h2>Scenario Builder</h2>
<p>A Make.com scenario is a chain of modules. Each module does one thing: watch for an event, transform data, or send it somewhere. Explore three real scenarios below.</p>

<div class="panel">
<div class="label">Scenario 1: Email Capture</div>
<p style="font-size:.9rem;color:#999"><strong>Webhook</strong> (Trigger) &rarr; <strong>Resend</strong> (Send Welcome) &rarr; <strong>Supabase</strong> (Insert Row) &rarr; <strong>Slack</strong> (Notify)</p>
<p style="font-size:.9rem;color:#999">When someone subscribes, send a welcome email, store in database, notify your Slack.</p>
</div>

<div class="panel">
<div class="label">Scenario 2: Content Publish</div>
<p style="font-size:.9rem;color:#999"><strong>Schedule</strong> (Every Day 9am) &rarr; <strong>Supabase</strong> (Get Draft) &rarr; <strong>Claude</strong> (Polish Copy) &rarr; <strong>CMS</strong> (Publish Post) &rarr; <strong>Twitter</strong> (Post Thread)</p>
<p style="font-size:.9rem;color:#999">Every morning, grab a draft from Supabase, have Claude polish it, publish to CMS, and auto-tweet.</p>
</div>

<div class="panel">
<div class="label">Scenario 3: Revenue Alert</div>
<p style="font-size:.9rem;color:#999"><strong>Stripe</strong> (Webhook) &rarr; <strong>Filter</strong> (amount > $50) &rarr; <strong>Supabase</strong> (Log Revenue) &rarr; <strong>Slack</strong> (Alert)</p>
<p style="font-size:.9rem;color:#999">When Stripe processes a payment over $50, log it and send a celebration alert to Slack.</p>
</div>

<h2>How Modules Connect</h2>
<div class="panel">
<div class="label">Key Concept</div>
<p>Every module <strong>receives data</strong> from the previous module and <strong>passes data</strong> to the next. You map fields between them — that's the core of Make.com.</p>
<p style="font-size:.9rem;color:#999"><strong>Understanding <code style="color:#f59e0b">{{1.email}}</code> syntax:</strong> The number refers to the module's position in the scenario. <code style="color:#f59e0b">{{1.email}}</code> means "grab the <code>email</code> field from module #1 (the Webhook)." <code style="color:#f59e0b">{{now}}</code> is a built-in function that returns the current timestamp. You'll use this pattern constantly — it's how data flows between modules.</p>
<p style="font-size:.85rem;color:#999">Here's how data flows through the Email Capture scenario above:</p>
<div class="code-block">
<span class="cm">// Module 1 — Webhook receives this JSON from your website:</span><br>
{ <span class="str">"email"</span>: <span class="str">"user@example.com"</span>, <span class="str">"name"</span>: <span class="str">"Alex"</span> }<br><br>
<span class="cm">// Module 2 — Resend uses {{1.email}} to pull the email from Module 1:</span><br>
To: <span class="op">{{</span>1.email<span class="op">}}</span> <span class="cm">  → becomes: user@example.com</span><br>
Subject: <span class="str">"Welcome, </span><span class="op">{{</span>1.name<span class="op">}}</span><span class="str">!"</span> <span class="cm">  → becomes: "Welcome, Alex!"</span><br><br>
<span class="cm">// Module 3 — Supabase also pulls from Module 1 to save the subscriber:</span><br>
email: <span class="op">{{</span>1.email<span class="op">}}</span><br>
name: <span class="op">{{</span>1.name<span class="op">}}</span><br>
joined_at: <span class="op">{{</span>now<span class="op">}}</span> <span class="cm">  → becomes: current timestamp</span>
</div>
</div>

<h2>Building Your Own Scenario</h2>
<p style="font-size:.85rem;color:#888"><strong>Tip:</strong> Start with a trigger (Webhook or Schedule), then add processing steps, and end with an output (Slack, Supabase, or Email). A good first scenario: <strong>Webhook &rarr; Supabase &rarr; Slack</strong> — receive data, store it, notify yourself.</p>
<p style="font-size:.9rem">The available modules in Make.com include: <strong>Webhook</strong> (trigger on HTTP POST), <strong>Schedule</strong> (timer-based trigger), <strong>Supabase</strong> (database operations), <strong>Claude</strong> (AI processing), <strong>Resend</strong> (email), <strong>Stripe</strong> (payments), <strong>Slack</strong> (notifications), and <strong>Filter</strong> (conditional logic). You chain these together in the Make.com visual editor to build your automation flows.</p>

<div class="panel">
<div class="label">Pro Tips</div>
<p style="font-size:.9rem"><strong>Error handling:</strong> Add a Router module to create parallel paths — one for success, one for failure. Never let a scenario fail silently.</p>
<p style="font-size:.9rem"><strong>Rate limits:</strong> Most APIs have rate limits. Use Make.com's built-in delay/sleep to stay under them.</p>
<p style="font-size:.9rem"><strong>Testing:</strong> Always use "Run Once" to test before turning on scheduling. Check every module's output.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span>
</div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>

<div data-learn="QuizMC" data-props='{"title":"Make.com Quiz","questions":[{"q":"What does {{1.email}} mean in a Make.com scenario?","options":["Send an email to module 1","The email field from the output of module #1","A variable named 1.email","An error in the mapping"],"correct":1,"explanation":"In Make.com, double curly braces reference data from other modules. The number is the module position in the scenario. {{1.email}} means grab the email field from the first module (usually your trigger)."},{"q":"What is the recommended first module type when building a Make.com scenario?","options":["Supabase insert","Filter logic","A trigger — Webhook or Schedule","Slack notification"],"correct":2,"explanation":"Every scenario must start with a trigger — something that initiates the run. Either a Webhook (fires when an external event happens) or a Schedule (runs on a time interval). Other modules follow the trigger."},{"q":"Why should you use the Router module for error handling?","options":["It speeds up execution","It creates parallel paths so failures do not silently swallow errors","It reduces API costs","It is required by Make.com for all scenarios"],"correct":1,"explanation":"The Router creates branching paths — one for success, one for failure. Without it, a module error can cause the entire scenario to fail silently. Routing errors to a notification module ensures you always know when something breaks."}]}'></div>


<div data-learn="FlashDeck" data-props='{"title":"Make.com Flashcards","cards":[{"front":"What is the difference between a Webhook trigger and a Schedule trigger?","back":"Webhook: fires immediately when an external service sends a POST request (event-driven). Schedule: fires at a set time interval like every hour or every day at 9am (time-driven)."},{"front":"What does idempotency mean when designing Make.com scenarios?","back":"Running the same scenario multiple times with the same data produces the same result without side effects — like duplicate emails or double database inserts. Design scenarios to check for existing records before inserting."},{"front":"How do you reference data from module 3 inside module 5?","back":"Use {{3.fieldName}} syntax. The number is always the module position, and fieldName is the specific output field you want to reference from that module."}]}'></div>

</div>
