---
title: "Wire It All"
course: "ai-stack-builder"
order: 9
type: "builder"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 9 of 10</span>

</div>

<div class="lesson-badge">MODULE 3 &middot; 260 XP</div>
<h1>Wire It All Together</h1>
<p class="intro">This is THE BIG ONE. Every tool you've learned connects into one architecture. Click each node to see how it talks to the others. Then build it step by step.</p>

<h2>The Complete Architecture</h2>
<p>Click any service to see its connections, data flows, and example code. Each node shows you what that service does and how it communicates with the others.</p>

<div class="arch-diagram">
<div class="arch-grid">
<div class="arch-node" onclick="showNode('vercel')">
<span class="node-icon">&#x25b2;</span>
<span class="node-name">Vercel</span>
<span class="node-desc">Frontend + Deploy</span>
</div>
<div class="arch-node" onclick="showNode('supabase')">
<span class="node-icon">&#x26a1;</span>
<span class="node-name">Supabase</span>
<span class="node-desc">DB + Auth + Edge</span>
</div>
<div class="arch-node" onclick="showNode('stripe')">
<span class="node-icon">&#x1f4b3;</span>
<span class="node-name">Stripe</span>
<span class="node-desc">Payments</span>
</div>
<div class="arch-node" onclick="showNode('resend')">
<span class="node-icon">&#x1f4e7;</span>
<span class="node-name">Resend</span>
<span class="node-desc">Email</span>
</div>
<div class="arch-node" onclick="showNode('make')">
<span class="node-icon">&#x1f527;</span>
<span class="node-name">Make.com</span>
<span class="node-desc">Automation</span>
</div>
<div class="arch-node" onclick="showNode('claude')">
<span class="node-icon">&#x1f9e0;</span>
<span class="node-name">Claude</span>
<span class="node-desc">AI Intelligence</span>
</div>
</div>
</div>

<div class="connection-detail" id="connDetail">
</div>

<h2>Build It: Step by Step</h2>
<p>Follow these 6 steps to wire the complete architecture. Click each to expand.</p>

<div id="buildSteps">
<div class="build-step" onclick="toggleStep(0)">
<div class="build-step-header"><span class="build-step-title">1. Supabase: Create tables + RLS</span><span class="build-step-num">Foundation</span></div>
<div class="build-step-body">
<p style="font-size:.9rem;color:#999">Create brain_context, subscribers, and revenue tables. Enable RLS on all of them. This is your data layer.</p>
<p style="font-size:.85rem;color:#888">This SQL creates two tables: <code style="color:#f59e0b">subscribers</code> stores everyone who signs up (with a unique email constraint so duplicates are rejected), and <code style="color:#f59e0b">revenue</code> tracks every payment with the Stripe session ID so you can cross-reference. Copy this SQL into your Supabase SQL Editor and run it.</p>
<div class="code-block"><span class="cm">-- Core tables</span><br><span class="kw">CREATE TABLE</span> subscribers (id <span class="fn">uuid</span> <span class="kw">DEFAULT</span> <span class="fn">gen_random_uuid</span>() <span class="kw">PRIMARY KEY</span>, email <span class="fn">text</span> <span class="kw">UNIQUE NOT NULL</span>, created_at <span class="fn">timestamptz</span> <span class="kw">DEFAULT</span> <span class="fn">now</span>());<br><span class="kw">CREATE TABLE</span> revenue (id <span class="fn">uuid</span> <span class="kw">DEFAULT</span> <span class="fn">gen_random_uuid</span>() <span class="kw">PRIMARY KEY</span>, amount <span class="fn">int4</span>, product <span class="fn">text</span>, customer_email <span class="fn">text</span>, stripe_session_id <span class="fn">text</span>, created_at <span class="fn">timestamptz</span> <span class="kw">DEFAULT</span> <span class="fn">now</span>());</div>
<button class="check-btn" onclick="event.stopPropagation();markDone(0)">&#x2713; Done</button>
</div>
</div>

<div class="build-step" onclick="toggleStep(1)">
<div class="build-step-header"><span class="build-step-title">2. Edge Function: subscribe</span><span class="build-step-num">Email Capture</span></div>
<div class="build-step-body">
<p style="font-size:.9rem;color:#999">Edge function that receives email, stores in Supabase, sends welcome email via Resend.</p>
<div class="code-block"><span class="kw">serve</span>(<span class="kw">async</span> (req) => {<br>&nbsp;&nbsp;<span class="kw">const</span> { email } = <span class="kw">await</span> req.<span class="fn">json</span>()<br>&nbsp;&nbsp;<span class="cm">// 1. Store in Supabase</span><br>&nbsp;&nbsp;<span class="kw">await</span> supabase.<span class="fn">from</span>(<span class="str">'subscribers'</span>).<span class="fn">insert</span>({ email })<br>&nbsp;&nbsp;<span class="cm">// 2. Send welcome via Resend</span><br>&nbsp;&nbsp;<span class="kw">await</span> resend.emails.<span class="fn">send</span>({ to: email, subject: <span class="str">'Welcome!'</span> })<br>&nbsp;&nbsp;<span class="kw">return new</span> <span class="fn">Response</span>(<span class="str">'ok'</span>)<br>})</div>
<button class="check-btn" onclick="event.stopPropagation();markDone(1)">&#x2713; Done</button>
</div>
</div>

<div class="build-step" onclick="toggleStep(2)">
<div class="build-step-header"><span class="build-step-title">3. Edge Function: create-checkout</span><span class="build-step-num">Payments</span></div>
<div class="build-step-body">
<p style="font-size:.9rem;color:#999">Creates a Stripe checkout session and returns the URL. Frontend redirects the user there.</p>
<p style="font-size:.85rem;color:#888">This code tells Stripe "create a payment page for this product at this price." Stripe hosts the checkout page (you never touch credit card data), and redirects the user back to your success or cancel URL when done.</p>
<div class="code-block"><span class="kw">const</span> session = <span class="kw">await</span> stripe.checkout.sessions.<span class="fn">create</span>({<br>&nbsp;&nbsp;mode: <span class="str">'payment'</span>,<br>&nbsp;&nbsp;line_items: [{ price: <span class="str">'price_xxx'</span>, quantity: <span class="num">1</span> }],<br>&nbsp;&nbsp;success_url: <span class="str">'https://likeone.ai/success'</span>,<br>&nbsp;&nbsp;cancel_url: <span class="str">'https://likeone.ai'</span>,<br>})<br><span class="kw">return new</span> <span class="fn">Response</span>(JSON.<span class="fn">stringify</span>({ url: session.url }))</div>
<button class="check-btn" onclick="event.stopPropagation();markDone(2)">&#x2713; Done</button>
</div>
</div>

<div class="build-step" onclick="toggleStep(3)">
<div class="build-step-header"><span class="build-step-title">4. Stripe Webhook Handler</span><span class="build-step-num">Revenue Tracking</span></div>
<div class="build-step-body">
<p style="font-size:.9rem;color:#999">Listens for checkout.session.completed, logs revenue to Supabase, triggers Make.com notification.</p>
<p style="font-size:.85rem;color:#888">This code verifies the Stripe webhook is genuine (not spoofed), checks if it's a completed checkout, and saves the payment amount and customer email to your revenue table.</p>
<div class="code-block"><span class="kw">const</span> event = stripe.webhooks.<span class="fn">constructEvent</span>(body, sig, secret)<br><span class="kw">if</span> (event.type === <span class="str">'checkout.session.completed'</span>) {<br>&nbsp;&nbsp;<span class="kw">const</span> session = event.data.object<br>&nbsp;&nbsp;<span class="kw">await</span> supabase.<span class="fn">from</span>(<span class="str">'revenue'</span>).<span class="fn">insert</span>({<br>&nbsp;&nbsp;&nbsp;&nbsp;amount: session.amount_total,<br>&nbsp;&nbsp;&nbsp;&nbsp;customer_email: session.customer_email<br>&nbsp;&nbsp;})<br>}</div>
<button class="check-btn" onclick="event.stopPropagation();markDone(3)">&#x2713; Done</button>
</div>
</div>

<div class="build-step" onclick="toggleStep(4)">
<div class="build-step-header"><span class="build-step-title">5. Vercel: Deploy frontend</span><span class="build-step-num">Go Live</span></div>
<div class="build-step-body">
<p style="font-size:.9rem;color:#999">Push your Next.js app to GitHub. Vercel auto-deploys. Set environment variables for Supabase URL and anon key.</p>
<div class="code-block"><span class="kw">git</span> add . && <span class="kw">git</span> commit -m <span class="str">"wire complete stack"</span><br><span class="kw">git</span> push origin main<br><span class="cm"># Vercel auto-deploys from main branch</span><br><span class="cm"># Set NEXT_PUBLIC_SUPABASE_URL in Vercel dashboard</span></div>
<button class="check-btn" onclick="event.stopPropagation();markDone(4)">&#x2713; Done</button>
</div>
</div>

<div class="build-step" onclick="toggleStep(5)">
<div class="build-step-header"><span class="build-step-title">6. Make.com: Wire automations</span><span class="build-step-num">Glue</span></div>
<div class="build-step-body">
<p style="font-size:.9rem;color:#999">Create scenarios: new subscriber notification, revenue alert to Slack, daily analytics digest. Make.com connects everything that doesn't have a direct API integration.</p>
<p style="font-size:.85rem;color:#888">This is pseudocode showing the flow of a Make.com scenario. In Make.com's visual editor, you'd drag these modules onto the canvas and connect them — no coding required. Each arrow represents data flowing from one module to the next.</p>
<div class="code-block"><span class="cm">// Make.com Scenario: Revenue Alert</span><br>Trigger: Supabase webhook (new row in revenue)<br> &#x2192; Filter: amount > $50<br> &#x2192; Slack: Post to #revenue channel<br> &#x2192; Google Sheets: Log to spreadsheet</div>
<button class="check-btn" onclick="event.stopPropagation();markDone(5)">&#x2713; Done</button>
</div>
</div>
</div>

<div class="panel">
<div class="label">The Big Picture</div>
<p style="font-size:.9rem;margin-bottom:.75rem">Here's the complete user journey — each step shows which service handles it and why:</p>
<div style="font-size:.85rem;line-height:2">
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">1.</span> User visits your site <span style="color:#888">&rarr;</span> <strong>Vercel</strong> serves it from the nearest global edge server</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">2.</span> User enters their email <span style="color:#888">&rarr;</span> <strong>Edge Function</strong> (subscribe) processes the form</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">3.</span> Email stored <span style="color:#888">&rarr;</span> <strong>Supabase</strong> saves to the subscribers table</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">4.</span> Welcome sent <span style="color:#888">&rarr;</span> <strong>Resend</strong> delivers the welcome email</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">5.</span> User buys course <span style="color:#888">&rarr;</span> <strong>Stripe</strong> handles payment securely</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">6.</span> Payment confirmed <span style="color:#888">&rarr;</span> <strong>Supabase</strong> logs revenue, grants access</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">7.</span> Team notified <span style="color:#888">&rarr;</span> <strong>Make.com</strong> sends Slack celebration alert</p>
<p style="margin-bottom:.35rem"><span style="color:#f59e0b;font-weight:700">8.</span> AI coordinates <span style="color:#888">&rarr;</span> <strong>Claude</strong> manages the brain that ties it all together</p>
</div>
<p style="font-size:.9rem;color:#f59e0b;margin-top:1rem"><strong>That's the whole stack. 6 services. One product. Revenue from day 1.</strong></p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
const connections={
vercel:{
header:'<span class="conn-from">Vercel</span> <span class="conn-arrow">&#x2194;</span> <span class="conn-to">Supabase, Stripe</span>',
flow:'<p><strong>Vercel &#x2192; Supabase:</strong> Frontend calls Supabase REST API and Edge Functions using anon key + JWT auth.</p><p><strong>Vercel &#x2192; Stripe:</strong> Frontend calls create-checkout edge function, which returns a Stripe checkout URL for redirect.</p><p><strong>Vercel &#x2190; GitHub:</strong> Auto-deploys on every push to main. Preview deploys for PRs.</p>',
code:'<span class="cm">// Frontend calling edge function</span>\n<span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(\n  <span class="str">\'https://proj.supabase.co/functions/v1/create-checkout\'</span>,\n  { method: <span class="str">\'POST\'</span>, headers: { Authorization: <span class="str">`Bearer ${token}`</span> }}\n)\n<span class="kw">const</span> { url } = <span class="kw">await</span> res.<span class="fn">json</span>()\nwindow.location.href = url'},
supabase:{
header:'<span class="conn-from">Supabase</span> <span class="conn-arrow">&#x2194;</span> <span class="conn-to">Everything</span>',
flow:'<p><strong>Supabase is the hub.</strong> Database stores all data. Edge functions handle business logic. Auth manages users. RLS protects data.</p><p><strong>&#x2192; Stripe:</strong> Edge functions create checkout sessions + verify webhooks.</p><p><strong>&#x2192; Resend:</strong> Edge functions send transactional emails.</p><p><strong>&#x2192; Claude:</strong> Edge functions call Claude API for AI responses.</p>',
code:'<span class="cm">// Supabase edge function calling multiple services</span>\n<span class="kw">const</span> { data } = <span class="kw">await</span> supabase.<span class="fn">from</span>(<span class="str">\'brain_context\'</span>).<span class="fn">select</span>(<span class="str">\'*\'</span>)\n<span class="kw">await</span> resend.emails.<span class="fn">send</span>({ to, subject, html })\n<span class="kw">const</span> ai = <span class="kw">await</span> anthropic.messages.<span class="fn">create</span>({...})'},
stripe:{
header:'<span class="conn-from">Stripe</span> <span class="conn-arrow">&#x2192;</span> <span class="conn-to">Supabase Edge Functions</span>',
flow:'<p><strong>Stripe &#x2192; Your Webhook:</strong> When a payment succeeds, Stripe sends a POST to your edge function with the event data.</p><p><strong>Your Webhook &#x2192; Supabase:</strong> Log the revenue. Update user access. Send confirmation email.</p>',
code:'<span class="cm">// Stripe webhook flow</span>\nStripe checkout &#x2192; payment succeeds\n&#x2192; POST to supabase.co/functions/v1/stripe-webhook\n&#x2192; Verify signature\n&#x2192; INSERT INTO revenue\n&#x2192; Grant course access'},
resend:{
header:'<span class="conn-from">Resend</span> <span class="conn-arrow">&#x2190;</span> <span class="conn-to">Supabase Edge Functions</span>',
flow:'<p><strong>Edge Functions &#x2192; Resend:</strong> Called from edge functions for welcome emails, purchase confirmations, and password resets.</p><p>Resend provides deliverability, templates, and analytics.</p>',
code:'<span class="kw">await</span> resend.emails.<span class="fn">send</span>({\n  from: <span class="str">\'noreply@likeone.ai\'</span>,\n  to: email,\n  subject: <span class="str">\'Welcome to Like One Academy\'</span>,\n  html: <span class="str">\'<h1>You\\\'re in!</h1>\'</span>\n})'},
make:{
header:'<span class="conn-from">Make.com</span> <span class="conn-arrow">&#x2194;</span> <span class="conn-to">Supabase, Slack, Google Sheets</span>',
flow:'<p><strong>Make.com is the glue</strong> for things that don\'t justify custom code. Notifications, syncing, scheduled tasks, analytics.</p><p>Triggers from Supabase webhooks or schedules, actions to Slack/Sheets/Twitter.</p>',
code:'<span class="cm">// Make.com scenarios</span>\n1. New subscriber &#x2192; Slack notification\n2. Revenue > $50 &#x2192; Slack celebration\n3. Daily 9am &#x2192; Analytics digest\n4. New blog post &#x2192; Tweet thread'},
claude:{
header:'<span class="conn-from">Claude</span> <span class="conn-arrow">&#x2190;</span> <span class="conn-to">Edge Functions + MCP</span>',
flow:'<p><strong>Claude is the brain.</strong> Called from edge functions for AI-powered features. Uses the brain_context table as its memory via MCP (Model Context Protocol).</p><p>Can read/write to Supabase, trigger Make.com scenarios, and manage the entire system.</p>',
code:'<span class="kw">const</span> response = <span class="kw">await</span> anthropic.messages.<span class="fn">create</span>({\n  model: <span class="str">\'claude-sonnet-4-20250514\'</span>,\n  messages: [{ role: <span class="str">\'user\'</span>, content: prompt }],\n  tools: [supabaseTool, resendTool]\n})'}
};

function showNode(name){
document.querySelectorAll('.arch-node').forEach(n=>n.classList.remove('active'));
event.currentTarget.classList.add('active');
const conn=connections[name];
const detail=document.getElementById('connDetail');
detail.classList.add('active');
document.getElementById('connHeader').innerHTML=conn.header;
document.getElementById('connFlow').innerHTML=conn.flow;
document.getElementById('connCode').innerHTML=conn.code;
updateProg()}

const stepsDone=[false,false,false,false,false,false];
function toggleStep(idx){
document.querySelectorAll('.build-step').forEach((s,i)=>{
if(i===idx)s.classList.toggle('active');
else s.classList.remove('active')});updateProg()}
function markDone(idx){stepsDone[idx]=true;document.querySelectorAll('.build-step')[idx].classList.add('completed');document.querySelectorAll('.build-step')[idx].classList.remove('active');updateProg()}

let actions=0;
function updateProg(){actions++;const done=stepsDone.filter(Boolean).length;const p=Math.min(100,Math.max(actions*8,done/6*100));document.getElementById('lessonProgress').style.width=p+'%';document.getElementById('lessonPct').textContent=Math.round(p)+'%'}
function completeLesson(){localStorage.setItem('aisb_lesson_9','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_9')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
