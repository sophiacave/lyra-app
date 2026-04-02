---
title: "Webhooks Deep Dive"
course: "ai-stack-builder"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Webhooks <span class="accent">Deep Dive</span></h1>
  <p class="sub">Webhooks are how services talk to each other in real-time. When something happens in one system, it sends an HTTP POST to your endpoint. No polling. No delays. This is the nervous system of your AI stack.</p>
</div>

<div class="content">

<div class="card">
<h2>Polling vs. Webhooks: Why It Matters</h2>
<p>There are two ways for your app to learn that something happened in an external service. The difference between them is the difference between <strong style="color:#e5e5e5">checking your mailbox every 5 minutes</strong> and <strong style="color:#e5e5e5">having the mail carrier ring your doorbell</strong>.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
<div style="padding:1rem 1.25rem;background:rgba(239,68,68,.04);border-radius:10px;border:1px solid rgba(239,68,68,.08)">
<strong style="color:#ef4444;font-size:.88rem">Polling (The Old Way)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">Your app asks "did anything happen?" every N seconds. Wastes API calls, introduces delays, and burns through rate limits. If you poll every 30 seconds, a payment could happen at second 1 and you would not know until second 30.</p>
</div>
<div style="padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<strong style="color:#34d399;font-size:.88rem">Webhooks (The Right Way)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7">The external service pushes a notification to YOUR endpoint the moment something happens. Zero wasted calls, instant notification, no rate limit concerns. Stripe fires a webhook within milliseconds of a payment completing.</p>
</div>
</div>
</div>

<div class="card">
<h2>How a Webhook Request Works</h2>
<p>When an event occurs, the external service sends an <strong style="color:#e5e5e5">HTTP POST</strong> request to a URL you registered. The request contains a JSON payload describing the event. Your endpoint processes it and responds with a <code style="color:#f59e0b">200 OK</code>.</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> <strong style="color:#e5e5e5">Event occurs</strong> — user completes payment on Stripe</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> <strong style="color:#e5e5e5">Stripe sends HTTP POST</strong> — JSON payload with event type, data, and cryptographic signature</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> <strong style="color:#e5e5e5">Your endpoint receives it</strong> — a Supabase Edge Function at <code style="color:#f59e0b">/functions/v1/stripe-webhook</code></div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> <strong style="color:#e5e5e5">Verify signature</strong> — confirm the request genuinely came from Stripe, not a bad actor</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> <strong style="color:#e5e5e5">Process the event</strong> — insert revenue row, grant access, send notification</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">6.</span> <strong style="color:#e5e5e5">Respond 200 OK</strong> — tell Stripe you received and handled it (must respond within 20 seconds)</div>
</div>
</div>

<div class="card">
<h2>Configuring a Stripe Webhook</h2>
<p>Setting up your first webhook takes 5 minutes in the Stripe Dashboard. Here is exactly what to configure and why.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Stripe Dashboard — Webhook configuration</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Go to: Stripe Dashboard → Developers → Webhooks → "Add endpoint"</span>

<span style="color:#c084fc">Endpoint URL:</span>
  <span style="color:#fb923c">https://yourproject.supabase.co/functions/v1/stripe-webhook</span>

<span style="color:#c084fc">Events to subscribe:</span>
  <span style="color:#34d399">checkout.session.completed</span>  <span style="color:#71717a"># Someone paid — grant access</span>
  <span style="color:#34d399">payment_intent.succeeded</span>    <span style="color:#71717a"># Payment confirmed</span>
  <span style="color:#ef4444">payment_intent.failed</span>       <span style="color:#71717a"># Payment failed — alert team</span>
  <span style="color:#34d399">customer.subscription.created</span>  <span style="color:#71717a"># New subscription</span>
  <span style="color:#ef4444">customer.subscription.deleted</span>  <span style="color:#71717a"># Cancellation — trigger retention flow</span>
  <span style="color:#34d399">invoice.paid</span>               <span style="color:#71717a"># Recurring payment successful</span>
  <span style="color:#ef4444">invoice.payment_failed</span>      <span style="color:#71717a"># Failed recurring — alert + retry</span>
  <span style="color:#fb923c">charge.refunded</span>            <span style="color:#71717a"># Refund processed — revoke access</span>

<span style="color:#c084fc">Signing Secret:</span>
  <span style="color:#fb923c">whsec_...</span>  <span style="color:#71717a"># Stripe provides this — save as env var</span>
  <span style="color:#71717a"># Store in Supabase: STRIPE_WEBHOOK_SECRET</span>
  <span style="color:#71717a"># NEVER put this in code or commit it to git</span></code></pre>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Start small:</strong> For a course or product site, you only need <code style="color:#f59e0b">checkout.session.completed</code> and <code style="color:#f59e0b">charge.refunded</code> to start. Add more events as your business logic grows. Every event you subscribe to is a webhook your endpoint must handle — do not subscribe to events you are not ready to process.
</div>
</div>

<div class="card">
<h2>Signature Verification: The Security Gate</h2>
<p>Anyone can send a POST to your endpoint. A bad actor could fake a "payment succeeded" event to get free access. Stripe prevents this by <strong style="color:#e5e5e5">cryptographically signing every webhook</strong> with a secret only you and Stripe know.</p>

<p><strong style="color:#e5e5e5">Always verify the signature. No exceptions.</strong> Here is the complete verification flow for a Supabase Edge Function:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — Supabase Edge Function: stripe-webhook</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> Stripe <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/stripe@14"</span>
<span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"https://esm.sh/@supabase/supabase-js@2"</span>

<span style="color:#71717a">// Initialize Stripe with your secret key</span>
<span style="color:#c084fc">const</span> stripe = <span style="color:#c084fc">new</span> <span style="color:#34d399">Stripe</span>(Deno.env.get(<span style="color:#fb923c">"STRIPE_SECRET_KEY"</span>)!)

<span style="color:#71717a">// Initialize Supabase with service role (server-side only)</span>
<span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
  Deno.env.get(<span style="color:#fb923c">"SUPABASE_URL"</span>)!,
  Deno.env.get(<span style="color:#fb923c">"SUPABASE_SERVICE_ROLE_KEY"</span>)!
)

Deno.<span style="color:#34d399">serve</span>(<span style="color:#c084fc">async</span> (req) => {
  <span style="color:#71717a">// Step 1: Read the RAW body — must be text, not parsed JSON</span>
  <span style="color:#71717a">// Why? The signature is computed on exact bytes. Parsing</span>
  <span style="color:#71717a">// changes whitespace/ordering and invalidates the signature.</span>
  <span style="color:#c084fc">const</span> body = <span style="color:#c084fc">await</span> req.<span style="color:#34d399">text</span>()
  <span style="color:#c084fc">const</span> sig = req.headers.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"stripe-signature"</span>)!

  <span style="color:#71717a">// Step 2: Verify the signature — THE security check</span>
  <span style="color:#c084fc">let</span> event: Stripe.Event
  <span style="color:#c084fc">try</span> {
    event = stripe.webhooks.<span style="color:#34d399">constructEvent</span>(
      body, sig, Deno.env.get(<span style="color:#fb923c">"STRIPE_WEBHOOK_SECRET"</span>)!
    )
  } <span style="color:#c084fc">catch</span> (err) {
    <span style="color:#71717a">// Signature invalid — reject immediately</span>
    <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">"Invalid signature"</span>, { status: <span style="color:#fb923c">400</span> })
  }

  <span style="color:#71717a">// Step 3: Handle the event — only after verification passes</span>
  <span style="color:#c084fc">if</span> (event.type === <span style="color:#fb923c">"checkout.session.completed"</span>) {
    <span style="color:#c084fc">const</span> session = event.data.object <span style="color:#c084fc">as</span> Stripe.Checkout.Session
    <span style="color:#c084fc">await</span> supabase.<span style="color:#34d399">from</span>(<span style="color:#fb923c">"revenue"</span>).<span style="color:#34d399">insert</span>({
      amount: session.amount_total,
      customer_email: session.customer_details?.email,
      stripe_session_id: session.id,
    })
  }

  <span style="color:#71717a">// Step 4: Respond 200 immediately — Stripe expects this fast</span>
  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(JSON.<span style="color:#34d399">stringify</span>({ received: <span style="color:#fb923c">true</span> }))
})</code></pre>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">Critical:</strong> You MUST use <code style="color:#f59e0b">req.text()</code> — never <code style="color:#ef4444">req.json()</code> — before signature verification. The signature is an HMAC computed on the exact raw bytes of the request body. Parsing the JSON first can change whitespace or key ordering, producing a different byte sequence and causing verification to fail silently.
</div>
</div>

<div class="card">
<h2>Idempotency: Handle Duplicates Safely</h2>
<p>Stripe may send the same webhook <strong style="color:#e5e5e5">multiple times</strong> — network hiccups, timeouts, or your endpoint responding slowly. If your handler inserts a revenue row on every call, you could double-count a payment. This is where idempotency saves you.</p>

<p><strong style="color:#e5e5e5">"Idempotent"</strong> means running the same operation multiple times produces the same result. Here is the pattern:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — Idempotent webhook handler</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// Check if we already processed this event</span>
<span style="color:#c084fc">const</span> { data: existing } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">"webhook_events"</span>)
  .<span style="color:#34d399">select</span>(<span style="color:#fb923c">"id"</span>)
  .<span style="color:#34d399">eq</span>(<span style="color:#fb923c">"stripe_event_id"</span>, event.id)
  .<span style="color:#34d399">single</span>()

<span style="color:#c084fc">if</span> (existing) {
  <span style="color:#71717a">// Already handled — return 200 without processing again</span>
  <span style="color:#c084fc">return new</span> <span style="color:#34d399">Response</span>(<span style="color:#fb923c">"Already processed"</span>, { status: <span style="color:#fb923c">200</span> })
}

<span style="color:#71717a">// First time seeing this event — process it</span>
<span style="color:#c084fc">await</span> supabase.<span style="color:#34d399">from</span>(<span style="color:#fb923c">"webhook_events"</span>).<span style="color:#34d399">insert</span>({
  stripe_event_id: event.id,
  event_type: event.type,
  processed_at: <span style="color:#c084fc">new</span> <span style="color:#34d399">Date</span>().<span style="color:#34d399">toISOString</span>()
})

<span style="color:#71717a">// Now safely handle the event...</span></code></pre>
</div>
</div>

<div class="card">
<h2>Retry Logic and Exponential Backoff</h2>
<p>When your endpoint returns an error (500, timeout), Stripe does not give up. It retries with <strong style="color:#e5e5e5">exponential backoff</strong> — each retry waits longer than the last.</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div><strong style="color:#e5e5e5;font-size:.85rem">Retry 1</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">First attempt after failure</span></div>
<strong style="color:#34d399;font-size:.88rem">~1 min</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div><strong style="color:#e5e5e5;font-size:.85rem">Retry 2</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Second attempt</span></div>
<strong style="color:#8b5cf6;font-size:.88rem">~5 min</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div><strong style="color:#e5e5e5;font-size:.85rem">Retry 3</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Third attempt</span></div>
<strong style="color:#fb923c;font-size:.88rem">~30 min</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(244,114,182,.04);border-radius:8px;border:1px solid rgba(244,114,182,.08)">
<div><strong style="color:#e5e5e5;font-size:.85rem">Retry 4+</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Continues with longer gaps</span></div>
<strong style="color:#f472b6;font-size:.88rem">hours → days</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(239,68,68,.04);border-radius:8px;border:1px solid rgba(239,68,68,.08)">
<div><strong style="color:#e5e5e5;font-size:.85rem">Give up</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Stripe marks event as failed</span></div>
<strong style="color:#ef4444;font-size:.88rem">~3 days</strong>
</div>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Why this matters:</strong> Exponential backoff prevents hammering a recovering server. If your endpoint is down for 10 minutes, it does not get 600 requests (one per second). It gets maybe 3-4, with increasing gaps. This is why <strong style="color:#34d399">idempotency is essential</strong> — when your server recovers, those retries will fire, and your handler must not double-process them.
</div>
</div>

<div class="card">
<h2>Testing Webhooks Locally</h2>
<p>During development, Stripe cannot reach your <code style="color:#f59e0b">localhost</code>. The Stripe CLI solves this by creating a secure tunnel from Stripe to your local machine.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — Local webhook testing with Stripe CLI</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Install and login to Stripe CLI</span>
<span style="color:#c084fc">brew</span> install stripe/stripe-cli/stripe
<span style="color:#c084fc">stripe</span> login

<span style="color:#71717a"># Forward webhooks to your local edge function</span>
<span style="color:#c084fc">stripe</span> listen --forward-to localhost:54321/functions/v1/stripe-webhook

<span style="color:#71717a"># In another terminal, trigger a test event:</span>
<span style="color:#c084fc">stripe</span> trigger checkout.session.completed

<span style="color:#71717a"># The CLI will show:</span>
<span style="color:#71717a"># → 2026-04-02 09:15:32  checkout.session.completed [evt_xxx]</span>
<span style="color:#71717a"># → [200] POST localhost:54321/functions/v1/stripe-webhook</span></code></pre>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">The Stripe Dashboard also works:</strong> Go to Developers &rarr; Webhooks &rarr; select your endpoint &rarr; "Send test webhook." This sends a real webhook event to your deployed endpoint (not localhost) with realistic test data. Use this for integration testing after deployment.
</div>
</div>

<div class="card">
<h2>Beyond Stripe: Other Webhook Providers</h2>
<p>The patterns you learned here apply everywhere. Most modern services use webhooks with the same architecture — HTTP POST, JSON payload, signature verification.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Service</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Common Events</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Signature Header</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Stripe</td>
<td style="padding:.75rem">checkout.session.completed, invoice.paid, charge.refunded</td>
<td style="padding:.75rem"><code style="color:#f59e0b">stripe-signature</code></td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">GitHub</td>
<td style="padding:.75rem">push, pull_request, issues, release</td>
<td style="padding:.75rem"><code style="color:#f59e0b">x-hub-signature-256</code></td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Supabase</td>
<td style="padding:.75rem">INSERT, UPDATE, DELETE on any table</td>
<td style="padding:.75rem">Custom via database webhooks</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Resend</td>
<td style="padding:.75rem">email.sent, email.delivered, email.bounced</td>
<td style="padding:.75rem"><code style="color:#f59e0b">svix-signature</code></td>
</tr>
</tbody>
</table>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Webhooks Mastery Check","questions":[{"q":"Why must you read the raw request body (req.text()) instead of parsed JSON when verifying a Stripe webhook?","options":["JSON parsing is slower","The signature is computed on the raw bytes — parsing changes the string and invalidates the signature","Stripe does not send JSON","Deno does not support req.json()"],"correct":1,"explanation":"Stripe computes the HMAC signature on the exact raw bytes of the request body. If you parse the JSON first, the serialization may change whitespace or key ordering, producing a different byte sequence and causing signature verification to fail."},{"q":"What is exponential backoff in Stripe webhook retries?","options":["Stripe sends faster retries each time","The wait time between retries grows longer with each attempt — 1min, 5min, 30min, etc.","Stripe gives up after 3 failed retries","Your endpoint backs up data before retrying"],"correct":1,"explanation":"Exponential backoff means each retry waits longer than the last — 1 minute, then 5 minutes, then 30, etc. This prevents overwhelming a recovering server. Stripe retries for up to 3 days before marking the event as failed."},{"q":"How do you make a webhook handler idempotent?","options":["Add a timeout to every request","Store the event ID on first processing and skip if already seen — so duplicate deliveries produce the same result","Respond with 200 before processing","Use HTTPS instead of HTTP"],"correct":1,"explanation":"Store the Stripe event ID (evt_xxx) in your database when you first process it. Before processing any event, check if that ID already exists. If it does, skip processing and return 200. This prevents double-charging or duplicate grants when Stripe retries."},{"q":"A bad actor sends a fake checkout.session.completed webhook to your endpoint. What prevents them from getting free access?","options":["HTTPS encryption","Rate limiting on the endpoint","Signature verification — constructEvent() rejects any request not signed with your webhook secret","The firewall blocks unknown IPs"],"correct":2,"explanation":"Stripe signs every webhook with a secret (whsec_...) only you and Stripe know. constructEvent() verifies this signature cryptographically. A fake request will not have a valid signature and will be rejected with a 400 error before any business logic runs."},{"q":"You deploy a webhook endpoint but forget to store the signing secret as an environment variable. What happens?","options":["Webhooks work but are slower","constructEvent() throws an error on every request — all webhooks are rejected with 400","Stripe stops sending webhooks after 24 hours","Nothing — the endpoint works without verification"],"correct":1,"explanation":"Without the signing secret, constructEvent() cannot verify signatures and throws an error on every incoming webhook. Your try/catch returns 400. Stripe sees failures and retries with backoff, eventually giving up after 3 days. No events get processed until you fix the secret."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Webhooks Flashcards","cards":[{"front":"What is the difference between polling and webhooks?","back":"Polling: your app repeatedly asks the other service \"did anything happen?\" on an interval — wasteful and delayed. Webhooks: the other service pushes a notification to your endpoint the moment something happens — real-time and efficient."},{"front":"What does idempotency mean for a webhook handler?","back":"An idempotent handler produces the same result whether called once or many times with the same data. Implementation: store the Stripe event ID in your database on first processing, and skip if already seen. This prevents double-grants and duplicate emails when Stripe retries."},{"front":"What prefix does a Stripe webhook signing secret start with?","back":"whsec_ — short for webhook secret. Store it in your environment variables (never in code). Use it with stripe.webhooks.constructEvent() to verify every incoming webhook is genuinely from Stripe."},{"front":"Why must you use req.text() instead of req.json() before signature verification?","back":"The HMAC signature is computed on the exact raw bytes of the request body. Parsing with req.json() then re-serializing changes whitespace and key ordering, producing different bytes and invalidating the signature. Always read raw text first, verify, then parse."},{"front":"What happens when Stripe retries a webhook?","back":"Stripe uses exponential backoff: retry after ~1min, ~5min, ~30min, then hours, up to 3 days total. This prevents overwhelming a recovering server. Your handler MUST be idempotent because retries can deliver the same event multiple times."},{"front":"How do you test webhooks during local development?","back":"Use the Stripe CLI: stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook. This creates a secure tunnel from Stripe to your local machine. Then trigger test events with stripe trigger checkout.session.completed."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 5 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
