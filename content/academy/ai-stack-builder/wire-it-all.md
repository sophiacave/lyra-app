---
title: "Wire It All"
course: "ai-stack-builder"
order: 9
type: "builder"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Wire It All <span class="accent">Together</span></h1>
  <p class="sub">Connect all the pieces into one working architecture. Six services, one product, revenue from day one. This lesson is the capstone — everything you have learned converges here.</p>
</div>

<div class="content">

<div class="card">
<h2>The Complete Architecture</h2>
<p>Every service you have learned about in this course serves a specific purpose. Together, they form a production-ready AI-powered web app. No service is redundant — remove any one, and you lose a critical capability.</p>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.8rem">V</div>
<div>
<strong style="color:#34d399;font-size:.88rem">Vercel — Frontend + CDN</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Hosts your Next.js app. Auto-deploys from GitHub on every push to main. Serves from 50+ global edge servers. Preview deploys for every pull request. Zero-config SSL. <strong style="color:#e5e5e5">Cost: $0/mo</strong> (Hobby tier).</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#8b5cf6;font-size:.8rem">S</div>
<div>
<strong style="color:#8b5cf6;font-size:.88rem">Supabase — Database + Auth + Edge Functions</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Your entire data layer. Postgres database with RLS, user authentication with JWT, Edge Functions for serverless backend logic, pgvector for AI embeddings. One platform replaces five services. <strong style="color:#e5e5e5">Cost: $25/mo</strong> (Pro plan).</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(251,146,60,.04);border-radius:10px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(251,146,60,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fb923c;font-size:.8rem">$</div>
<div>
<strong style="color:#fb923c;font-size:.88rem">Stripe — Payments</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Hosts checkout pages, processes credit cards, manages subscriptions. You never touch raw card data — Stripe handles PCI compliance. Sends webhooks on payment events. <strong style="color:#e5e5e5">Cost: 2.9% + $0.30 per transaction</strong>.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(244,114,182,.04);border-radius:10px;border:1px solid rgba(244,114,182,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(244,114,182,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#f472b6;font-size:.8rem">@</div>
<div>
<strong style="color:#f472b6;font-size:.88rem">Resend — Email Delivery</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Sends transactional emails — welcome messages, receipts, notifications. Clean API, high deliverability, React email templates. <strong style="color:#e5e5e5">Cost: $0/mo</strong> (100 emails/day free).</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(56,189,248,.04);border-radius:10px;border:1px solid rgba(56,189,248,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(56,189,248,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#38bdf8;font-size:.8rem">M</div>
<div>
<strong style="color:#38bdf8;font-size:.88rem">Make.com — Visual Automation</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Connects services without direct integrations. Slack alerts, spreadsheet logging, content scheduling — all without writing code. <strong style="color:#e5e5e5">Cost: $0/mo</strong> (1,000 ops/month free).</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(192,132,252,.04);border-radius:10px;border:1px solid rgba(192,132,252,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(192,132,252,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#c084fc;font-size:.8rem">AI</div>
<div>
<strong style="color:#c084fc;font-size:.88rem">Claude — AI Intelligence</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">The brain that coordinates everything. Processes natural language, makes decisions, generates content. Accessed via Edge Functions with the Anthropic API. <strong style="color:#e5e5e5">Cost: ~$4/mo</strong> (pay-per-token).</p>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Build It: The 6-Step Wiring Guide</h2>
<p>Follow these steps in order. Each step builds on the previous one. By step 6, you have a fully wired, revenue-generating AI product.</p>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#8b5cf6;margin:0 0 .75rem">Step 1: Supabase — Create Tables + RLS (Foundation)</h4>
<p style="font-size:.82rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">Create your core tables. The <code style="color:#f59e0b">subscribers</code> table stores everyone who signs up (with a unique email constraint so duplicates are rejected). The <code style="color:#f59e0b">revenue</code> table tracks every payment with the Stripe session ID for cross-referencing. Enable Row Level Security on both.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
<pre style="margin:0"><code><span style="color:#71717a">-- Core tables for a revenue-generating AI app</span>

<span style="color:#c084fc">CREATE TABLE</span> subscribers (
  id         <span style="color:#34d399">uuid</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>() <span style="color:#c084fc">PRIMARY KEY</span>,
  email      <span style="color:#34d399">text</span> <span style="color:#c084fc">UNIQUE NOT NULL</span>,
  name       <span style="color:#34d399">text</span>,
  created_at <span style="color:#34d399">timestamptz</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#c084fc">CREATE TABLE</span> revenue (
  id                <span style="color:#34d399">uuid</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>() <span style="color:#c084fc">PRIMARY KEY</span>,
  amount            <span style="color:#34d399">int4</span>,        <span style="color:#71717a">-- in cents (Stripe standard)</span>
  product           <span style="color:#34d399">text</span>,
  customer_email    <span style="color:#34d399">text</span>,
  stripe_session_id <span style="color:#34d399">text</span> <span style="color:#c084fc">UNIQUE</span>, <span style="color:#71717a">-- prevents duplicate processing</span>
  created_at        <span style="color:#34d399">timestamptz</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#71717a">-- Enable RLS — critical for security</span>
<span style="color:#c084fc">ALTER TABLE</span> subscribers <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;
<span style="color:#c084fc">ALTER TABLE</span> revenue <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;</code></pre>
</div>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#34d399;margin:0 0 .75rem">Step 2: Edge Function — subscribe (Email Capture)</h4>
<p style="font-size:.82rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">This edge function receives an email from your frontend form, stores it in Supabase, and sends a welcome email via Resend. It runs at the edge — globally distributed, close to every user.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
<pre style="margin:0"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/@supabase/supabase-js@2"</span>
<span style="color:#c084fc">import</span> { Resend } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/resend"</span>

<span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
  Deno.env.get(<span style="color:#fb923c">"SUPABASE_URL"</span>)!,
  Deno.env.get(<span style="color:#fb923c">"SUPABASE_SERVICE_ROLE_KEY"</span>)!
)
<span style="color:#c084fc">const</span> resend = <span style="color:#c084fc">new</span> <span style="color:#34d399">Resend</span>(Deno.env.get(<span style="color:#fb923c">"RESEND_API_KEY"</span>)!)

Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#c084fc">const</span> { email, name } = <span style="color:#c084fc">await</span> req.<span style="color:#34d399">json</span>()

  <span style="color:#71717a">// 1. Store in Supabase (UNIQUE constraint rejects duplicates)</span>
  <span style="color:#c084fc">const</span> { error } = <span style="color:#c084fc">await</span> supabase
    .<span style="color:#34d399">from</span>(<span style="color:#fb923c">"subscribers"</span>)
    .<span style="color:#34d399">insert</span>({ email, name })

  <span style="color:#c084fc">if</span> (error?.code === <span style="color:#fb923c">"23505"</span>) {
    <span style="color:#71717a">// Already subscribed — not an error, just skip</span>
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(JSON.<span style="color:#34d399">stringify</span>({ status: <span style="color:#fb923c">"already_subscribed"</span> }))
  }

  <span style="color:#71717a">// 2. Send welcome email via Resend</span>
  <span style="color:#c084fc">await</span> resend.emails.<span style="color:#34d399">send</span>({
    from: <span style="color:#fb923c">"hello@yourdomain.com"</span>,
    to: email,
    subject: <span style="color:#fb923c">`Welcome, ${name || "friend"}!`</span>,
    html: <span style="color:#fb923c">`&lt;p&gt;Thanks for joining. You're in.&lt;/p&gt;`</span>
  })

  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(JSON.<span style="color:#34d399">stringify</span>({ status: <span style="color:#fb923c">"subscribed"</span> }))
})</code></pre>
</div>
</div>

<div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#fb923c;margin:0 0 .75rem">Step 3: Edge Function — create-checkout (Payments)</h4>
<p style="font-size:.82rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">Creates a Stripe checkout session and returns the URL. Your frontend redirects users there. Stripe hosts the entire payment page — you never touch credit card data.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
<pre style="margin:0"><code><span style="color:#c084fc">import</span> Stripe <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/stripe@14"</span>

<span style="color:#c084fc">const</span> stripe = <span style="color:#c084fc">new</span> <span style="color:#34d399">Stripe</span>(Deno.env.get(<span style="color:#fb923c">"STRIPE_SECRET_KEY"</span>)!)

Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#c084fc">const</span> { price_id } = <span style="color:#c084fc">await</span> req.<span style="color:#34d399">json</span>()

  <span style="color:#71717a">// Create checkout session — Stripe hosts the payment page</span>
  <span style="color:#c084fc">const</span> session = <span style="color:#c084fc">await</span> stripe.checkout.sessions.<span style="color:#34d399">create</span>({
    mode: <span style="color:#fb923c">"payment"</span>,
    line_items: [{ price: price_id, quantity: <span style="color:#fb923c">1</span> }],
    success_url: <span style="color:#fb923c">"https://yourdomain.com/success"</span>,
    cancel_url: <span style="color:#fb923c">"https://yourdomain.com"</span>,
  })

  <span style="color:#71717a">// Return the Stripe-hosted checkout URL</span>
  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(JSON.<span style="color:#34d399">stringify</span>({ url: session.url }))
})</code></pre>
</div>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#ef4444;margin:0 0 .75rem">Step 4: Stripe Webhook Handler (Revenue Tracking)</h4>
<p style="font-size:.82rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">Listens for <code style="color:#f59e0b">checkout.session.completed</code>, verifies the signature (critical — prevents spoofed events), and logs revenue to Supabase. This is the code from the Webhooks Deep Dive lesson, wired into the full stack.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
<pre style="margin:0"><code><span style="color:#71717a">// Verify signature → Process event → Log revenue</span>
<span style="color:#c084fc">const</span> body = <span style="color:#c084fc">await</span> req.<span style="color:#34d399">text</span>()  <span style="color:#71717a">// Raw text — never req.json()</span>
<span style="color:#c084fc">const</span> sig = req.headers.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"stripe-signature"</span>)!
<span style="color:#c084fc">const</span> event = stripe.webhooks.<span style="color:#34d399">constructEvent</span>(
  body, sig, Deno.env.get(<span style="color:#fb923c">"STRIPE_WEBHOOK_SECRET"</span>)!
)

<span style="color:#c084fc">if</span> (event.type === <span style="color:#fb923c">"checkout.session.completed"</span>) {
  <span style="color:#c084fc">const</span> session = event.data.object
  <span style="color:#c084fc">await</span> supabase.<span style="color:#34d399">from</span>(<span style="color:#fb923c">"revenue"</span>).<span style="color:#34d399">insert</span>({
    amount: session.amount_total,
    customer_email: session.customer_details?.email,
    stripe_session_id: session.id  <span style="color:#71717a">// UNIQUE — idempotent</span>
  })
}</code></pre>
</div>
</div>

<div style="background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#38bdf8;margin:0 0 .75rem">Step 5: Vercel — Deploy Frontend (Go Live)</h4>
<p style="font-size:.82rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">Push your Next.js app to GitHub. Vercel auto-deploys to production. Set your Supabase URL and anon key as environment variables — these are the only credentials the frontend needs (RLS protects your data).</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
<pre style="margin:0"><code><span style="color:#71717a"># Deploy to production</span>
<span style="color:#c084fc">git</span> add . && <span style="color:#c084fc">git</span> commit -m <span style="color:#fb923c">"wire complete stack"</span>
<span style="color:#c084fc">git</span> push origin main
<span style="color:#71717a"># Vercel auto-deploys from main → live in ~60 seconds</span>

<span style="color:#71717a"># Required environment variables in Vercel dashboard:</span>
NEXT_PUBLIC_SUPABASE_URL=https://&lt;ref&gt;.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</code></pre>
</div>
</div>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#c084fc;margin:0 0 .75rem">Step 6: Make.com — Wire Automations (Glue)</h4>
<p style="font-size:.82rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">Create Make.com scenarios for everything that does not need custom code: new subscriber notifications to Slack, revenue alerts, daily analytics digests. Make.com connects the services that do not have direct API integrations.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
<pre style="margin:0"><code><span style="color:#71717a">// Make.com Scenarios to create:</span>

<span style="color:#34d399">Scenario 1: New Subscriber Alert</span>
  Trigger: Supabase webhook (INSERT on subscribers)
  → Slack: Post to #growth channel

<span style="color:#fb923c">Scenario 2: Revenue Celebration</span>
  Trigger: Supabase webhook (INSERT on revenue)
  → Filter: amount > 5000  <span style="color:#71717a">// $50+ (amounts in cents)</span>
  → Slack: Post to #revenue channel
  → Google Sheets: Log to analytics spreadsheet

<span style="color:#8b5cf6">Scenario 3: Daily Digest</span>
  Trigger: Schedule (every day at 9am)
  → Supabase: Count today's subscribers + revenue
  → Slack: Post daily summary to #dashboard</code></pre>
</div>
</div>
</div>

<div class="card">
<h2>The Complete User Journey</h2>
<p>Here is every step a user takes — from first visit to payment — and which service handles each step. This is the full data flow through your wired stack.</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> User visits your site &rarr; <strong style="color:#e5e5e5">Vercel</strong> serves it from the nearest global edge server</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> User enters their email &rarr; <strong style="color:#e5e5e5">Edge Function</strong> (subscribe) processes the form</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> Email stored &rarr; <strong style="color:#e5e5e5">Supabase</strong> saves to the subscribers table (UNIQUE constraint prevents duplicates)</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> Welcome sent &rarr; <strong style="color:#e5e5e5">Resend</strong> delivers the welcome email within seconds</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> Team notified &rarr; <strong style="color:#e5e5e5">Make.com</strong> fires Slack notification to #growth</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">6.</span> User clicks "Buy" &rarr; <strong style="color:#e5e5e5">Edge Function</strong> (create-checkout) creates a Stripe session</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">7.</span> Payment processed &rarr; <strong style="color:#e5e5e5">Stripe</strong> handles checkout securely (you never touch card data)</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">8.</span> Revenue logged &rarr; <strong style="color:#e5e5e5">Stripe webhook</strong> fires, edge function verifies + inserts into revenue table</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">9.</span> Celebration &rarr; <strong style="color:#e5e5e5">Make.com</strong> sends revenue alert to Slack + logs to Google Sheets</div>
<div style="padding:.5rem .75rem;background:rgba(192,132,252,.04);border-radius:6px"><span style="color:#c084fc;font-weight:700">10.</span> AI coordinates &rarr; <strong style="color:#e5e5e5">Claude</strong> manages the brain that ties everything together</div>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Total time from subscribe to notification:</strong> under 500ms. <strong style="color:#e5e5e5">Total time from payment to revenue logged:</strong> under 3 seconds. Six services coordinated seamlessly. That is the power of choosing services designed to work together at the edge.
</div>
</div>

<div class="card">
<h2>Security Checklist</h2>
<p>A wired stack is only as strong as its weakest security link. Before going live, verify every item on this checklist.</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">RLS enabled</strong> on every table — prevents unauthorized data access</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">Service role key</strong> only in edge functions — never in frontend code</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">Stripe webhook signature</strong> verified on every request — prevents spoofed events</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">CORS configured</strong> on edge functions — only your domain can call them</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">Environment variables</strong> separated: NEXT_PUBLIC_ for public, no prefix for secrets</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">No secrets in git</strong> — all API keys stored in Vercel/Supabase env vars only</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">&#x2713;</span> <strong style="color:#e5e5e5">Idempotent webhook handlers</strong> — duplicate events do not cause duplicate processing</div>
</div>
</div>

<div class="card">
<h2>Debugging the Wired Stack</h2>
<p>When something breaks in a multi-service architecture, finding the failure point is the hardest part. Here is where to look for each type of problem.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Symptom</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Check First</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Common Fix</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Subscribe form does nothing</td>
<td style="padding:.75rem">Browser console + network tab</td>
<td style="padding:.75rem">CORS error — add your domain to edge function headers</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Email stored but no welcome email</td>
<td style="padding:.75rem">Supabase edge function logs</td>
<td style="padding:.75rem">Missing RESEND_API_KEY env var or from address not verified</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">Payment works but no revenue row</td>
<td style="padding:.75rem">Stripe webhook dashboard (failed deliveries)</td>
<td style="padding:.75rem">Missing STRIPE_WEBHOOK_SECRET or wrong endpoint URL</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem">No Slack notifications</td>
<td style="padding:.75rem">Make.com execution log</td>
<td style="padding:.75rem">Scenario not activated, or Supabase webhook trigger not configured</td>
</tr>
<tr>
<td style="padding:.75rem">Deploy succeeds but page is blank</td>
<td style="padding:.75rem">Vercel build logs</td>
<td style="padding:.75rem">Missing NEXT_PUBLIC_SUPABASE_URL env var in Vercel</td>
</tr>
</tbody>
</table>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Full Stack Architecture — Mastery Check","questions":[{"q":"Which service in the stack hosts the checkout page when a user buys a course?","options":["Vercel","Supabase","Stripe","Make.com"],"correct":2,"explanation":"Stripe hosts the checkout page entirely. Your edge function creates a session and returns a URL, and the frontend redirects the user there. You never handle raw card data — Stripe manages the entire payment UI and PCI compliance."},{"q":"What triggers the Make.com revenue alert scenario?","options":["A scheduled timer every hour","A Supabase webhook when a new row is inserted into the revenue table","The user clicking a button on the frontend","A Stripe webhook directly to Make.com"],"correct":1,"explanation":"Supabase can fire webhooks when database rows are created. The revenue table gets a new row after a successful Stripe payment (via the webhook handler edge function). That Supabase event triggers the Make.com scenario to alert Slack."},{"q":"Why does Claude read from brain_context via an edge function rather than directly from the frontend?","options":["The frontend can read brain_context directly with the anon key","The service role key that bypasses RLS must stay server-side — never in the browser","Edge functions are faster than direct database queries","The brain_context table does not support direct queries"],"correct":1,"explanation":"The brain_context table uses the service role key for full access, which bypasses RLS. This key must never be exposed to the browser. Edge functions run server-side, keeping the key secure while allowing Claude to read and write the full brain."},{"q":"A subscriber reports they never got a welcome email, but their email IS in the database. Where do you look first?","options":["Stripe webhook dashboard","Supabase edge function logs for the subscribe function","Make.com execution history","Vercel build logs"],"correct":1,"explanation":"The subscribe edge function both inserts the row AND sends the email. If the row exists but no email was sent, the function either errored during the Resend call (wrong API key, unverified domain) or the email was sent but bounced. Check the edge function logs first."},{"q":"What would happen if you removed the UNIQUE constraint on stripe_session_id in the revenue table?","options":["Nothing — Stripe only sends each event once","Duplicate webhook deliveries could create duplicate revenue rows, inflating your numbers","Stripe would reject the webhook","The edge function would crash"],"correct":1,"explanation":"Stripe may retry webhooks multiple times. Without UNIQUE on stripe_session_id, each retry could insert another revenue row for the same payment. The constraint prevents this — if a duplicate session_id is inserted, the database rejects it. This is idempotency at the database level."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Full Stack Architecture Flashcards","cards":[{"front":"Why does Claude read brain_context via an edge function instead of directly from the frontend?","back":"The service role key that bypasses RLS must stay server-side — never in the browser. Edge functions run server-side, keeping the key secure while allowing Claude to read and write the full brain."},{"front":"What is the role of Stripe in the stack?","back":"Stripe hosts the entire checkout page and handles PCI compliance. Your edge function creates a session and returns a URL — the frontend redirects users there. You never touch raw credit card data."},{"front":"How does Make.com fit into the architecture?","back":"Make.com is the automation glue connecting services without direct API integrations. It triggers on Supabase webhooks (new rows), filters data, and routes to Slack, Google Sheets, or email — no code required."},{"front":"What triggers the revenue logging flow?","back":"User completes payment on Stripe → Stripe fires checkout.session.completed webhook → your edge function verifies the signature → inserts a row into the revenue table → Make.com alerts Slack."},{"front":"Why use Vercel for the frontend?","back":"Vercel auto-deploys from GitHub on every push to main. It serves your Next.js app from global edge servers closest to each user, with zero-config SSL, preview deploys for branches, and environment variable management."},{"front":"What is the UNIQUE constraint on stripe_session_id for?","back":"Idempotency at the database level. If Stripe retries a webhook and the handler tries to insert the same session_id twice, the database rejects the duplicate. This prevents double-counting revenue from retry deliveries."},{"front":"Name the 6 services in the stack and their roles.","back":"Vercel (frontend hosting + CDN), Supabase (database + auth + edge functions), Stripe (payments), Resend (email delivery), Make.com (visual automation), Claude (AI intelligence). Total base cost: ~$29/month."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 9 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
