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

<div class="scenario-tabs">
<div class="scenario-tab active" onclick="showScenario(0)">&#x1f4e7; Email Capture</div>
<div class="scenario-tab" onclick="showScenario(1)">&#x1f4dd; Content Publish</div>
<div class="scenario-tab" onclick="showScenario(2)">&#x1f4b0; Revenue Alert</div>
</div>

<div id="scenario0" class="scenario-view">
<div class="scenario-canvas">
<div class="scenario-flow" id="flow0">
<div class="module-node active"><span class="node-icon">&#x1f310;</span><span class="node-name">Webhook</span><span class="node-type">Trigger</span></div>
<div class="module-node"><span class="node-icon">&#x1f4e7;</span><span class="node-name">Resend</span><span class="node-type">Send Welcome</span></div>
<div class="module-node"><span class="node-icon">&#x1f4be;</span><span class="node-name">Supabase</span><span class="node-type">Insert Row</span></div>
<div class="module-node"><span class="node-icon">&#x1f4ac;</span><span class="node-name">Slack</span><span class="node-type">Notify</span></div>
</div>
</div>
<p style="font-size:.9rem;color:#999">When someone subscribes, send a welcome email, store in database, notify your Slack.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — click to see what each module would process. In production, real data flows through Make.com automatically.</p>
<button class="btn-run" onclick="runScenario(0)">&#x25b6; Simulate Run</button>
</div>

<div id="scenario1" class="scenario-view" style="display:none">
<div class="scenario-canvas">
<div class="scenario-flow" id="flow1">
<div class="module-node active"><span class="node-icon">&#x23f0;</span><span class="node-name">Schedule</span><span class="node-type">Every Day 9am</span></div>
<div class="module-node"><span class="node-icon">&#x1f4be;</span><span class="node-name">Supabase</span><span class="node-type">Get Draft</span></div>
<div class="module-node"><span class="node-icon">&#x1f9e0;</span><span class="node-name">Claude</span><span class="node-type">Polish Copy</span></div>
<div class="module-node"><span class="node-icon">&#x1f310;</span><span class="node-name">CMS</span><span class="node-type">Publish Post</span></div>
<div class="module-node"><span class="node-icon">&#x1f426;</span><span class="node-name">Twitter</span><span class="node-type">Post Thread</span></div>
</div>
</div>
<p style="font-size:.9rem;color:#999">Every morning, grab a draft from Supabase, have Claude polish it, publish to CMS, and auto-tweet.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — in production, this would run on a schedule and process real content.</p>
<button class="btn-run" onclick="runScenario(1)">&#x25b6; Simulate Run</button>
</div>

<div id="scenario2" class="scenario-view" style="display:none">
<div class="scenario-canvas">
<div class="scenario-flow" id="flow2">
<div class="module-node active"><span class="node-icon">&#x1f4b3;</span><span class="node-name">Stripe</span><span class="node-type">Webhook</span></div>
<div class="module-node"><span class="node-icon">&#x1f527;</span><span class="node-name">Filter</span><span class="node-type">amount &gt; $50</span></div>
<div class="module-node"><span class="node-icon">&#x1f4be;</span><span class="node-name">Supabase</span><span class="node-type">Log Revenue</span></div>
<div class="module-node"><span class="node-icon">&#x1f4ac;</span><span class="node-name">Slack</span><span class="node-type">&#x1f389; Alert</span></div>
</div>
</div>
<p style="font-size:.9rem;color:#999">When Stripe processes a payment over $50, log it and send a celebration alert to Slack.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — in production, you'd see real Stripe payment data flowing through.</p>
<button class="btn-run" onclick="runScenario(2)">&#x25b6; Simulate Run</button>
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

<h2>Build Your Own Scenario</h2>
<p>Drag modules from the palette into the canvas to create your own automation.</p>
<p style="font-size:.85rem;color:#888"><strong>Tip:</strong> Start with a trigger (Webhook or Schedule), then add processing steps, and end with an output (Slack, Supabase, or Email). A good first scenario: <strong>Webhook &rarr; Supabase &rarr; Slack</strong> — receive data, store it, notify yourself.</p>

<div class="palette" id="palette">
<div class="palette-item" draggable="true" data-icon="&#x1f310;" data-name="Webhook" data-type="Trigger" ondragstart="drag(event)"><span class="p-icon">&#x1f310;</span>Webhook</div>
<div class="palette-item" draggable="true" data-icon="&#x23f0;" data-name="Schedule" data-type="Timer" ondragstart="drag(event)"><span class="p-icon">&#x23f0;</span>Schedule</div>
<div class="palette-item" draggable="true" data-icon="&#x1f4be;" data-name="Supabase" data-type="Database" ondragstart="drag(event)"><span class="p-icon">&#x1f4be;</span>Supabase</div>
<div class="palette-item" draggable="true" data-icon="&#x1f9e0;" data-name="Claude" data-type="AI" ondragstart="drag(event)"><span class="p-icon">&#x1f9e0;</span>Claude</div>
<div class="palette-item" draggable="true" data-icon="&#x1f4e7;" data-name="Resend" data-type="Email" ondragstart="drag(event)"><span class="p-icon">&#x1f4e7;</span>Resend</div>
<div class="palette-item" draggable="true" data-icon="&#x1f4b3;" data-name="Stripe" data-type="Payments" ondragstart="drag(event)"><span class="p-icon">&#x1f4b3;</span>Stripe</div>
<div class="palette-item" draggable="true" data-icon="&#x1f4ac;" data-name="Slack" data-type="Notify" ondragstart="drag(event)"><span class="p-icon">&#x1f4ac;</span>Slack</div>
<div class="palette-item" draggable="true" data-icon="&#x1f527;" data-name="Filter" data-type="Logic" ondragstart="drag(event)"><span class="p-icon">&#x1f527;</span>Filter</div>
</div>

<div class="scenario-canvas" id="customCanvas" ondrop="drop(event)" ondragover="event.preventDefault()" style="min-height:120px">
<div class="scenario-flow" id="customFlow">
<p style="color:#444;font-size:.85rem;margin:0;padding:1rem">Drop modules here to build your scenario...</p>
</div>
</div>
<button class="btn-run" onclick="clearCustom()">Clear</button>

<div class="panel">
<div class="label">Pro Tips</div>
<p style="font-size:.9rem"><strong>Error handling:</strong> Add a Router module to create parallel paths — one for success, one for failure. Never let a scenario fail silently.</p>
<p style="font-size:.9rem"><strong>Rate limits:</strong> Most APIs have rate limits. Use Make.com's built-in delay/sleep to stay under them.</p>
<p style="font-size:.9rem"><strong>Testing:</strong> Always use "Run Once" to test before turning on scheduling. Check every module's output.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"></div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>

<div data-learn="QuizMC" data-props='{"title":"Make.com Quiz","questions":[{"q":"What does {{1.email}} mean in a Make.com scenario?","options":["Send an email to module 1","The email field from the output of module #1","A variable named 1.email","An error in the mapping"],"correct":1,"explanation":"In Make.com, double curly braces reference data from other modules. The number is the module position in the scenario. {{1.email}} means grab the email field from the first module (usually your trigger)."},{"q":"What is the recommended first module type when building a Make.com scenario?","options":["Supabase insert","Filter logic","A trigger — Webhook or Schedule","Slack notification"],"correct":2,"explanation":"Every scenario must start with a trigger — something that initiates the run. Either a Webhook (fires when an external event happens) or a Schedule (runs on a time interval). Other modules follow the trigger."},{"q":"Why should you use the Router module for error handling?","options":["It speeds up execution","It creates parallel paths so failures do not silently swallow errors","It reduces API costs","It is required by Make.com for all scenarios"],"correct":1,"explanation":"The Router creates branching paths — one for success, one for failure. Without it, a module error can cause the entire scenario to fail silently. Routing errors to a notification module ensures you always know when something breaks."}]}'></div>


<div data-learn="FlashDeck" data-props='{"title":"Make.com Flashcards","cards":[{"front":"What is the difference between a Webhook trigger and a Schedule trigger?","back":"Webhook: fires immediately when an external service sends a POST request (event-driven). Schedule: fires at a set time interval like every hour or every day at 9am (time-driven)."},{"front":"What does idempotency mean when designing Make.com scenarios?","back":"Running the same scenario multiple times with the same data produces the same result without side effects — like duplicate emails or double database inserts. Design scenarios to check for existing records before inserting."},{"front":"How do you reference data from module 3 inside module 5?","back":"Use {{3.fieldName}} syntax. The number is always the module position, and fieldName is the specific output field you want to reference from that module."}]}'></div>

</div>
