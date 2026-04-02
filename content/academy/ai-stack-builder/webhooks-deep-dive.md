---
title: "Webhooks Deep Dive"
course: "ai-stack-builder"
order: 5
type: "lesson"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 5 of 10</span>

</div>

<div class="lesson-badge">MODULE 2 &middot; 260 XP</div>
<h1>Webhooks Deep Dive</h1>
<p class="intro">Webhooks are how services talk to each other in real-time. When something happens in one system, it sends an HTTP POST to your endpoint. No polling. No delays.</p>

<h2>How Webhooks Work</h2>
<p>Click "Trigger Event" to watch data flow through the webhook pipeline step by step.</p>

<div class="panel">
<div class="label">Webhook Flow</div>
<p style="font-size:.9rem"><strong>Event Occurs</strong> &rarr; <strong>HTTP POST</strong> (with JSON payload like <code style="color:#f59e0b">{"type":"checkout.session.completed"}</code>) &rarr; <strong>Your Endpoint</strong> &rarr; <strong>Process</strong> (verify signature, handle event) &rarr; <strong>200 OK</strong> (respond quickly)</p>
<p style="font-size:.85rem;color:#888">The key difference from regular API calls: with webhooks, the external service (Stripe, GitHub, etc.) initiates the request to YOUR server, not the other way around.</p>
</div>

<h2>Configure a Stripe Webhook</h2>
<p>Build a real Stripe webhook configuration. Pick which events to listen for and set your endpoint URL.</p>
<p style="font-size:.85rem;color:#888"><strong>Where to do this in production:</strong> Go to your <a href="https://dashboard.stripe.com/webhooks" target="_blank" style="color:#f59e0b">Stripe Dashboard</a> &rarr; Developers &rarr; Webhooks &rarr; "Add endpoint." Paste your Supabase Edge Function URL and select the events below. Stripe will give you a signing secret (starts with <code style="color:#888">whsec_</code>) — save it as an environment variable in Supabase.</p>

<div class="panel">
<div class="label">Stripe Webhook Configuration</div>
<p style="font-size:.9rem"><strong>Endpoint URL:</strong> Your Supabase Edge Function URL, e.g. <code style="color:#f59e0b">https://yourproject.supabase.co/functions/v1/stripe-webhook</code></p>
<p style="font-size:.9rem"><strong>Recommended events for a course/product site:</strong></p>
<p style="font-size:.85rem;color:#999">
<code style="color:#f59e0b">checkout.session.completed</code> — fires when someone pays<br>
<code style="color:#f59e0b">payment_intent.succeeded</code> — payment confirmed<br>
<code style="color:#f59e0b">payment_intent.failed</code> — payment failed<br>
<code style="color:#f59e0b">customer.subscription.created</code> — new subscription<br>
<code style="color:#f59e0b">customer.subscription.deleted</code> — subscription cancelled<br>
<code style="color:#f59e0b">invoice.paid</code> — invoice payment successful<br>
<code style="color:#f59e0b">invoice.payment_failed</code> — invoice payment failed<br>
<code style="color:#f59e0b">charge.refunded</code> — refund processed
</p>
<p style="font-size:.85rem;color:#888"><strong>Signing Secret:</strong> Stripe provides a <code style="color:#f59e0b">whsec_...</code> secret when you create the endpoint. Store it as an environment variable and always verify the signature to prevent spoofed events.</p>
</div>

<h2>Understanding Stripe Event Payloads</h2>
<p>When Stripe fires a webhook, it sends a JSON payload to your endpoint. You can test this in your Stripe dashboard under Developers &rarr; Webhooks &rarr; "Send test webhook." In production, these payloads arrive automatically when real events occur.</p>

<div class="panel">
<div class="label">Key Concept: Signature Verification</div>
<p style="font-size:.9rem">Anyone can send a POST to your endpoint. A bad actor could fake a "payment succeeded" event to get free access. Stripe prevents this by cryptographically signing every webhook with a secret only you and Stripe know. <strong>Always verify the signature.</strong></p>
<p style="font-size:.85rem;color:#999">Here's what this code does step by step: it reads the raw request body and the signature header that Stripe attached, then uses the Stripe library to verify they match your webhook secret. If someone tampered with the payload or sent a fake request, <code style="color:#f59e0b">constructEvent</code> throws an error and your code stops — no fraudulent data gets processed.</p>
<div class="code-block">
<span class="cm">// Import Stripe library (Deno-style for Supabase Edge Functions)</span><br>
<span class="kw">import</span> Stripe <span class="kw">from</span> <span class="str">"https://esm.sh/stripe@14"</span><br><br>
<span class="cm">// Initialize Stripe with your secret key</span><br>
<span class="kw">const</span> stripe = <span class="kw">new</span> <span class="fn">Stripe</span>(Deno.env.get(<span class="str">"STRIPE_SECRET_KEY"</span>))<br>
<span class="cm">// Get the signature Stripe attached to this request</span><br>
<span class="kw">const</span> sig = req.headers.get(<span class="str">"stripe-signature"</span>)<br>
<span class="cm">// Read the raw request body (must be raw text, not parsed JSON)</span><br>
<span class="kw">const</span> body = <span class="kw">await</span> req.<span class="fn">text</span>()<br><br>
<span class="cm">// This is the security check — it verifies the signature matches</span><br>
<span class="kw">const</span> event = stripe.webhooks.<span class="fn">constructEvent</span>(<br>
&nbsp;&nbsp;body, sig, Deno.env.get(<span class="str">"STRIPE_WEBHOOK_SECRET"</span>)<br>
)<br><br>
<span class="cm">// If signature is invalid, constructEvent throws an error</span><br>
<span class="cm">// If we get here, the event is genuine — safe to process</span>
</div>
</div>

<div class="panel">
<div class="label">Pro Tips</div>
<p style="font-size:.9rem"><strong>Respond fast:</strong> Stripe expects a 200 response within 20 seconds. Do heavy processing asynchronously — acknowledge the webhook first, then process.</p>
<p style="font-size:.9rem"><strong>Idempotency</strong> (processing the same event safely twice): Stripe may send the same event multiple times — network hiccups, timeouts, etc. "Idempotent" means your code produces the same result whether it runs once or ten times. In practice: store the event ID in your database, and before processing, check if you've already handled it. If yes, skip. This prevents double-charging or double-granting access.</p>
<p style="font-size:.9rem"><strong>Retry logic with exponential backoff:</strong> If your endpoint returns an error (500, timeout, etc.), Stripe retries automatically. "Exponential backoff" means it waits longer between each retry — first 1 minute, then 5 minutes, then 30, and so on — for up to 3 days. This gives your server time to recover without being hammered with requests. Design your endpoint to handle retries gracefully (see idempotency above).</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span>
</div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>


<div data-learn="QuizMC" data-props='{"title":"Webhooks Quiz","questions":[{"q":"Why must you read the raw request body (req.text()) instead of parsed JSON when verifying a Stripe webhook?","options":["JSON parsing is slower","The signature is computed on the raw bytes — parsing changes the string and invalidates the signature","Stripe does not send JSON","Deno does not support req.json()"],"correct":1,"explanation":"Stripe computes the HMAC signature on the exact raw bytes of the request body. If you parse the JSON first, the serialization may change whitespace or key ordering, producing a different byte sequence and causing signature verification to fail."},{"q":"What is exponential backoff in Stripe webhook retries?","options":["Stripe sends faster retries each time","The wait time between retries grows longer with each attempt","Stripe gives up after 3 failed retries","Your endpoint backs up data before retrying"],"correct":1,"explanation":"Exponential backoff means each retry waits longer than the last — 1 minute, then 5 minutes, then 30, etc. This prevents overwhelming a recovering server. Stripe retries for up to 3 days before marking the event as failed."},{"q":"What is the first two lines your webhook handler should do?","options":["Parse JSON, then verify the user session","Read raw body and verify Stripe signature before doing anything else","Check the database, then send an email","Log the event, then parse the JSON body"],"correct":1,"explanation":"Always verify the signature first — before any business logic. If verification fails, return a 400 immediately. This prevents fraudulent events from being processed. Only after successful verification should you parse the event data."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Webhooks Flashcards","cards":[{"front":"What is the difference between polling and webhooks?","back":"Polling: your app repeatedly asks the other service \u0027did anything happen?\u0027 on an interval — wasteful and delayed. Webhooks: the other service pushes a notification to your endpoint the moment something happens — real-time and efficient."},{"front":"What does idempotency mean for a webhook handler?","back":"An idempotent handler produces the same result whether called once or many times with the same data. Implementation: store the Stripe event ID in your database on first processing, and skip if already seen. This prevents double-grants and duplicate emails when Stripe retries."},{"front":"What prefix does a Stripe webhook signing secret start with?","back":"whsec_ — short for webhook secret. Store it in your environment variables (never in code). Use it with stripe.webhooks.constructEvent() to verify every incoming webhook is genuinely from Stripe."}]}'></div>
</div>
