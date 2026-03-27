---
title: "Make.com 101"
course: "ai-stack-builder"
order: 3
type: "lesson"
free: true
---<div class="container">
<div class="nav">
<a href="supabase-101.html">&larr; Prev</a>
<span class="current">Lesson 3 of 10</span>
<a href="edge-functions.html">Next &rarr;</a>
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
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f4e7;</span><span class="node-name">Resend</span><span class="node-type">Send Welcome</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f4be;</span><span class="node-name">Supabase</span><span class="node-type">Insert Row</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f4ac;</span><span class="node-name">Slack</span><span class="node-type">Notify</span></div>
</div>
</div>
<p style="font-size:.9rem;color:#999">When someone subscribes, send a welcome email, store in database, notify your Slack.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — click to see what each module would process. In production, real data flows through Make.com automatically.</p>
<button class="btn-run" onclick="runScenario(0)">&#x25b6; Simulate Run</button>
<div class="data-flow" id="dataFlow0" style="display:none"></div>
</div>

<div id="scenario1" class="scenario-view" style="display:none">
<div class="scenario-canvas">
<div class="scenario-flow" id="flow1">
<div class="module-node active"><span class="node-icon">&#x23f0;</span><span class="node-name">Schedule</span><span class="node-type">Every Day 9am</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f4be;</span><span class="node-name">Supabase</span><span class="node-type">Get Draft</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f9e0;</span><span class="node-name">Claude</span><span class="node-type">Polish Copy</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f310;</span><span class="node-name">CMS</span><span class="node-type">Publish Post</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f426;</span><span class="node-name">Twitter</span><span class="node-type">Post Thread</span></div>
</div>
</div>
<p style="font-size:.9rem;color:#999">Every morning, grab a draft from Supabase, have Claude polish it, publish to CMS, and auto-tweet.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — in production, this would run on a schedule and process real content.</p>
<button class="btn-run" onclick="runScenario(1)">&#x25b6; Simulate Run</button>
<div class="data-flow" id="dataFlow1" style="display:none"></div>
</div>

<div id="scenario2" class="scenario-view" style="display:none">
<div class="scenario-canvas">
<div class="scenario-flow" id="flow2">
<div class="module-node active"><span class="node-icon">&#x1f4b3;</span><span class="node-name">Stripe</span><span class="node-type">Webhook</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f527;</span><span class="node-name">Filter</span><span class="node-type">amount &gt; $50</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f4be;</span><span class="node-name">Supabase</span><span class="node-type">Log Revenue</span></div>
<div class="connector"></div>
<div class="module-node"><span class="node-icon">&#x1f4ac;</span><span class="node-name">Slack</span><span class="node-type">&#x1f389; Alert</span></div>
</div>
</div>
<p style="font-size:.9rem;color:#999">When Stripe processes a payment over $50, log it and send a celebration alert to Slack.</p>
<p style="font-size:.8rem;color:#666;font-style:italic">This is a simulation — in production, you'd see real Stripe payment data flowing through.</p>
<button class="btn-run" onclick="runScenario(2)">&#x25b6; Simulate Run</button>
<div class="data-flow" id="dataFlow2" style="display:none"></div>
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
<div class="progress-bar"><div class="progress-fill" id="lessonProgress" style="width:0%"></div></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="nav" style="border-top:1px solid #1e1e2e;border-bottom:none;margin-top:0;padding-top:1rem">
<a href="supabase-101.html">&larr; Supabase 101</a>
<a href="edge-functions.html">Next: Edge Functions &rarr;</a>
</div>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
const scenarioData=[
[{step:'Webhook receives POST',data:'{"email":"alex@example.com","name":"Alex"}'},{step:'Resend sends welcome email',data:'To: alex@example.com | Subject: Welcome, Alex!'},{step:'Supabase inserts subscriber',data:'INSERT INTO subscribers (email, name, joined_at)'},{step:'Slack notification sent',data:'#signups: New subscriber Alex (alex@example.com)'}],
[{step:'Schedule triggers at 9:00 AM',data:'trigger_time: 2026-03-23T09:00:00Z'},{step:'Supabase returns draft post',data:'{"title":"5 AI Stack Patterns","body":"Draft content...","status":"ready"}'},{step:'Claude polishes the copy',data:'Improved title, fixed grammar, added hook'},{step:'CMS publishes the post',data:'Published at: likeone.ai/blog/5-ai-stack-patterns'},{step:'Twitter thread posted',data:'Thread: 1/5 Most AI apps fail because...'}],
[{step:'Stripe webhook fires',data:'event: payment_intent.succeeded, amount: $119'},{step:'Filter: amount > $50? YES',data:'$119 > $50 = true, passing through'},{step:'Supabase logs revenue',data:'INSERT INTO revenue (amount, product, customer_email)'},{step:'Slack celebration alert',data:'#revenue: $119 from AI Stack Builder course!'}]
];

function showScenario(idx){
document.querySelectorAll('.scenario-view').forEach((v,i)=>v.style.display=i===idx?'block':'none');
document.querySelectorAll('.scenario-tab').forEach((t,i)=>{t.classList.toggle('active',i===idx)});
updateProg()}

function runScenario(idx){
const flow=document.getElementById('flow'+idx);
const nodes=flow.querySelectorAll('.module-node');
const connectors=flow.querySelectorAll('.connector');
const dataDiv=document.getElementById('dataFlow'+idx);
dataDiv.style.display='block';dataDiv.innerHTML='';
nodes.forEach(n=>n.classList.remove('active'));connectors.forEach(c=>c.classList.remove('animated'));
let i=0;
function animateNext(){
if(i>=nodes.length)return;
nodes[i].classList.add('active');
if(i>0)connectors[i-1].classList.add('animated');
const step=scenarioData[idx][i];
dataDiv.innerHTML+='<div class="flow-step"><span class="flow-arrow">'+(i===0?'&#x25b6;':'&#x2192;')+'</span><div><div class="flow-desc">'+step.step+'</div><div class="flow-data">'+step.data+'</div></div></div>';
dataDiv.scrollTop=dataDiv.scrollHeight;
i++;setTimeout(animateNext,800)}
animateNext();updateProg()}

function drag(e){e.dataTransfer.setData('icon',e.target.dataset.icon);e.dataTransfer.setData('name',e.target.dataset.name);e.dataTransfer.setData('type',e.target.dataset.type)}
let customNodes=[];
function drop(e){e.preventDefault();const icon=e.dataTransfer.getData('icon');const name=e.dataTransfer.getData('name');const type=e.dataTransfer.getData('type');
const flow=document.getElementById('customFlow');
if(customNodes.length===0)flow.innerHTML='';
if(customNodes.length>0){const conn=document.createElement('div');conn.className='connector animated';flow.appendChild(conn)}
const node=document.createElement('div');node.className='module-node active';node.innerHTML='<span class="node-icon">'+icon+'</span><span class="node-name">'+name+'</span><span class="node-type">'+type+'</span>';
flow.appendChild(node);customNodes.push(name);
setTimeout(()=>node.classList.remove('active'),500);updateProg()}
function clearCustom(){customNodes=[];document.getElementById('customFlow').innerHTML='<p style="color:#444;font-size:.85rem;margin:0;padding:1rem">Drop modules here to build your scenario...</p>'}

let actions=0;function updateProg(){actions++;const pct=Math.min(100,actions*12);document.getElementById('lessonProgress').style.width=pct+'%';document.getElementById('lessonPct').textContent=pct+'%'}
function completeLesson(){localStorage.setItem('aisb_lesson_3','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_3')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
