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
<div class="conn-header" id="connHeader"></div>
<div class="conn-flow" id="connFlow"></div>
<div class="code-block" id="connCode"></div>
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
<div class="progress-bar"><div class="progress-fill" id="lessonProgress"></div></div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>

<div data-learn="FlashDeck" data-props='{"title":"Full Stack Architecture Flashcards","cards":[{"front":"Why does Claude read brain_context via an edge function instead of directly from the frontend?","back":"The service role key that bypasses RLS must stay server-side — never in the browser. Edge functions run server-side, keeping the key secure while allowing Claude to read and write the full brain."},{"front":"What is the role of Stripe in the stack?","back":"Stripe hosts the entire checkout page and handles PCI compliance. Your edge function creates a session and returns a URL — the frontend redirects users there. You never touch raw credit card data."},{"front":"How does Make.com fit into the architecture?","back":"Make.com is the automation glue connecting services without direct API integrations. It triggers on Supabase webhooks (new rows), filters data, and routes to Slack, Google Sheets, or email — no code required."},{"front":"What triggers the revenue logging flow?","back":"User completes payment on Stripe → Stripe fires checkout.session.completed webhook → your edge function verifies the signature → inserts a row into the revenue table → Make.com alerts Slack."},{"front":"Why use Vercel for the frontend?","back":"Vercel auto-deploys from GitHub on every push to main. It serves your Next.js app from global edge servers closest to each user, with zero-config SSL, preview deploys for branches, and environment variable management."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Full Stack Architecture Quiz","questions":[{"q":"Which service in the stack is responsible for hosting the checkout page when a user buys a course?","options":["Vercel","Supabase","Stripe","Make.com"],"correct":2,"explanation":"Stripe hosts the checkout page entirely. Your edge function creates a session and returns a URL, and the frontend redirects the user there. You never handle raw card data — Stripe manages the entire payment UI and PCI compliance."},{"q":"What triggers the Make.com revenue alert scenario?","options":["A scheduled timer every hour","A Supabase webhook when a new row is inserted into the revenue table","The user clicking a button on the frontend","A Stripe webhook directly to Make.com"],"correct":1,"explanation":"Supabase can fire webhooks when database rows are created. The revenue table gets a row inserted after a successful Stripe payment (via the webhook handler edge function). That Supabase event triggers the Make.com scenario to alert Slack."},{"q":"Why does Claude read from brain_context via an edge function rather than directly from the frontend?","options":["The frontend can read brain_context directly with the anon key","The service role key that bypasses RLS must stay server-side — never in the browser","Edge functions are faster than direct database queries","The brain_context table does not support direct queries"],"correct":1,"explanation":"The brain_context table uses the service role key for full access, which bypasses RLS. This key must never be exposed to the browser. Edge functions run server-side, keeping the key secure while allowing Claude to read and write the full brain."}]}'></div>
</div>
