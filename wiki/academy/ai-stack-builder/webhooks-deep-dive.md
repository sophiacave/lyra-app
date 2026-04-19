# Webhooks Deep Dive

**Course:** AI Stack Builder
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 5 of 10


  # Webhooks Deep Dive

  Webhooks are how services talk to each other in real-time. When something happens in one system, it sends an HTTP POST to your endpoint. No polling. No delays. This is the nervous system of your AI stack.


## Polling vs. Webhooks: Why It Matters

There are two ways for your app to learn that something happened in an external service. The difference between them is the difference between **checking your mailbox every 5 minutes** and **having the mail carrier ring your doorbell**.


**Polling (The Old Way)**
Your app asks "did anything happen?" every N seconds. Wastes API calls, introduces delays, and burns through rate limits. If you poll every 30 seconds, a payment could happen at second 1 and you would not know until second 30.


**Webhooks (The Right Way)**
The external service pushes a notification to YOUR endpoint the moment something happens. Zero wasted calls, instant notification, no rate limit concerns. Stripe fires a webhook within milliseconds of a payment completing.


## How a Webhook Request Works

When an event occurs, the external service sends an **HTTP POST** request to a URL you registered. The request contains a JSON payload describing the event. Your endpoint processes it and responds with a `200 OK`.


1. **Event occurs** — user completes payment on Stripe
2. **Stripe sends HTTP POST** — JSON payload with event type, data, and cryptographic signature
3. **Your endpoint receives it** — a Supabase Edge Function at `/functions/v1/stripe-webhook`
4. **Verify signature** — confirm the request genuinely came from Stripe, not a bad actor
5. **Process the event** — insert revenue row, grant access, send notification
6. **Respond 200 OK** — tell Stripe you received and handled it (must respond within 20 seconds)


## Configuring a Stripe Webhook

Setting up your first webhook takes 5 minutes in the Stripe Dashboard. Here is exactly what to configure and why.


Stripe Dashboard — Webhook configuration

```
# Go to: Stripe Dashboard → Developers → Webhooks → "Add endpoint"

Endpoint URL:
  https://yourproject.supabase.co/functions/v1/stripe-webhook

Events to subscribe:
  checkout.session.completed  # Someone paid — grant access
  payment_intent.succeeded    # Payment confirmed
  payment_intent.failed       # Payment failed — alert team
  customer.subscription.created  # New subscription
  customer.subscription.deleted  # Cancellation — trigger retention flow
  invoice.paid               # Recurring payment successful
  invoice.payment_failed      # Failed recurring — alert + retry
  charge.refunded            # Refund processed — revoke access

Signing Secret:
  whsec_...  # Stripe provides this — save as env var
  # Store in Supabase: STRIPE_WEBHOOK_SECRET
  # NEVER put this in code or commit it to git
```


**Start small:** For a course or product site, you only need `checkout.session.completed` and `charge.refunded` to start. Add more events as your business logic grows. Every event you subscribe to is a webhook your endpoint must handle — do not subscribe to events you are not ready to process.


## Signature Verification: The Security Gate

Anyone can send a POST to your endpoint. A bad actor could fake a "payment succeeded" event to get free access. Stripe prevents this by **cryptographically signing every webhook** with a secret only you and Stripe know.

**Always verify the signature. No exceptions.** Here is the complete verification flow for a Supabase Edge Function:


TypeScript — Supabase Edge Function: stripe-webhook

```
import Stripe from "https://esm.sh/stripe@14"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Initialize Stripe with your secret key
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!)

// Initialize Supabase with service role (server-side only)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

Deno.serve(async (req) => {
  // Step 1: Read the RAW body — must be text, not parsed JSON
  // Why? The signature is computed on exact bytes. Parsing
  // changes whitespace/ordering and invalidates the signature.
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  // Step 2: Verify the signature — THE security check
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    )
  } catch (err) {
    // Signature invalid — reject immediately
    return new Response("Invalid signature", { status: 400 })
  }

  // Step 3: Handle the event — only after verification passes
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    await supabase.from("revenue").insert({
      amount: session.amount_total,
      customer_email: session.customer_details?.email,
      stripe_session_id: session.id,
    })
  }

  // Step 4: Respond 200 immediately — Stripe expects this fast
  return new Response(JSON.stringify({ received: true }))
})
```


**Critical:** You MUST use `req.text()` — never `req.json()` — before signature verification. The signature is an HMAC computed on the exact raw bytes of the request body. Parsing the JSON first can change whitespace or key ordering, producing a different byte sequence and causing verification to fail silently.


## Idempotency: Handle Duplicates Safely

Stripe may send the same webhook **multiple times** — network hiccups, timeouts, or your endpoint responding slowly. If your handler inserts a revenue row on every call, you could double-count a payment. This is where idempotency saves you.

**"Idempotent"** means running the same operation multiple times produces the same result. Here is the pattern:


TypeScript — Idempotent webhook handler

```
// Check if we already processed this event
const { data: existing } = await supabase
  .from("webhook_events")
  .select("id")
  .eq("stripe_event_id", event.id)
  .single()

if (existing) {
  // Already handled — return 200 without processing again
  return new Response("Already processed", { status: 200 })
}

// First time seeing this event — process it
await supabase.from("webhook_events").insert({
  stripe_event_id: event.id,
  event_type: event.type,
  processed_at: new Date().toISOString()
})

// Now safely handle the event...
```


## Retry Logic and Exponential Backoff

When your endpoint returns an error (500, timeout), Stripe does not give up. It retries with **exponential backoff** — each retry waits longer than the last.


**Retry 1**First attempt after failure
**~1 min**


**Retry 2**Second attempt
**~5 min**


**Retry 3**Third attempt
**~30 min**


**Retry 4+**Continues with longer gaps
**hours → days**


**Give up**Stripe marks event as failed
**~3 days**


**Why this matters:** Exponential backoff prevents hammering a recovering server. If your endpoint is down for 10 minutes, it does not get 600 requests (one per second). It gets maybe 3-4, with increasing gaps. This is why **idempotency is essential** — when your server recovers, those retries will fire, and your handler must not double-process them.


## Testing Webhooks Locally

During development, Stripe cannot reach your `localhost`. The Stripe CLI solves this by creating a secure tunnel from Stripe to your local machine.


Terminal — Local webhook testing with Stripe CLI

```
# Install and login to Stripe CLI
brew install stripe/stripe-cli/stripe
stripe login

# Forward webhooks to your local edge function
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# In another terminal, trigger a test event:
stripe trigger checkout.session.completed

# The CLI will show:
# → 2026-04-02 09:15:32  checkout.session.completed [evt_xxx]
# → [200] POST localhost:54321/functions/v1/stripe-webhook
```


**The Stripe Dashboard also works:** Go to Developers → Webhooks → select your endpoint → "Send test webhook." This sends a real webhook event to your deployed endpoint (not localhost) with realistic test data. Use this for integration testing after deployment.


## Beyond Stripe: Other Webhook Providers

The patterns you learned here apply everywhere. Most modern services use webhooks with the same architecture — HTTP POST, JSON payload, signature verification.


Service
Common Events
Signature Header


Stripe
checkout.session.completed, invoice.paid, charge.refunded
`stripe-signature`


GitHub
push, pull_request, issues, release
`x-hub-signature-256`


Supabase
INSERT, UPDATE, DELETE on any table
Custom via database webhooks


Resend
email.sent, email.delivered, email.bounced
`svix-signature`


### Quiz

**Q1: Why must you read the raw request body (req.text()) instead of parsed JSON when verifying a Stripe webhook?**
    A. JSON parsing is slower
  ✓ B. The signature is computed on the raw bytes — parsing changes the string and invalidates the signature
    C. Stripe does not send JSON
    D. Deno does not support req.json()
  *Stripe computes the HMAC signature on the exact raw bytes of the request body. If you parse the JSON first, the serialization may change whitespace or key ordering, producing a different byte sequence and causing signature verification to fail.*

**Q2: What is exponential backoff in Stripe webhook retries?**
    A. Stripe sends faster retries each time
  ✓ B. The wait time between retries grows longer with each attempt — 1min, 5min, 30min, etc.
    C. Stripe gives up after 3 failed retries
    D. Your endpoint backs up data before retrying
  *Exponential backoff means each retry waits longer than the last — 1 minute, then 5 minutes, then 30, etc. This prevents overwhelming a recovering server. Stripe retries for up to 3 days before marking the event as failed.*

**Q3: How do you make a webhook handler idempotent?**
    A. Add a timeout to every request
  ✓ B. Store the event ID on first processing and skip if already seen — so duplicate deliveries produce the same result
    C. Respond with 200 before processing
    D. Use HTTPS instead of HTTP
  *Store the Stripe event ID (evt_xxx) in your database when you first process it. Before processing any event, check if that ID already exists. If it does, skip processing and return 200. This prevents double-charging or duplicate grants when Stripe retries.*

**Q4: A bad actor sends a fake checkout.session.completed webhook to your endpoint. What prevents them from getting free access?**
    A. HTTPS encryption
    B. Rate limiting on the endpoint
  ✓ C. Signature verification — constructEvent() rejects any request not signed with your webhook secret
    D. The firewall blocks unknown IPs
  *Stripe signs every webhook with a secret (whsec_...) only you and Stripe know. constructEvent() verifies this signature cryptographically. A fake request will not have a valid signature and will be rejected with a 400 error before any business logic runs.*

**Q5: You deploy a webhook endpoint but forget to store the signing secret as an environment variable. What happens?**
    A. Webhooks work but are slower
  ✓ B. constructEvent() throws an error on every request — all webhooks are rejected with 400
    C. Stripe stops sending webhooks after 24 hours
    D. Nothing — the endpoint works without verification
  *Without the signing secret, constructEvent() cannot verify signatures and throws an error on every incoming webhook. Your try/catch returns 400. Stripe sees failures and retries with backoff, eventually giving up after 3 days. No events get processed until you fix the secret.*


### Webhooks Flashcards

**Card 1:**
Front: What is the difference between polling and webhooks?
Back: Polling: your app repeatedly asks the other service "did anything happen?" on an interval — wasteful and delayed. Webhooks: the other service pushes a notification to your endpoint the moment something happens — real-time and efficient.

**Card 2:**
Front: What does idempotency mean for a webhook handler?
Back: An idempotent handler produces the same result whether called once or many times with the same data. Implementation: store the Stripe event ID in your database on first processing, and skip if already seen. This prevents double-grants and duplicate emails when Stripe retries.

**Card 3:**
Front: What prefix does a Stripe webhook signing secret start with?
Back: whsec_ — short for webhook secret. Store it in your environment variables (never in code). Use it with stripe.webhooks.constructEvent() to verify every incoming webhook is genuinely from Stripe.

**Card 4:**
Front: Why must you use req.text() instead of req.json() before signature verification?
Back: The HMAC signature is computed on the exact raw bytes of the request body. Parsing with req.json() then re-serializing changes whitespace and key ordering, producing different bytes and invalidating the signature. Always read raw text first, verify, then parse.

**Card 5:**
Front: What happens when Stripe retries a webhook?
Back: Stripe uses exponential backoff: retry after ~1min, ~5min, ~30min, then hours, up to 3 days total. This prevents overwhelming a recovering server. Your handler MUST be idempotent because retries can deliver the same event multiple times.

**Card 6:**
Front: How do you test webhooks during local development?
Back: Use the Stripe CLI: stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook. This creates a secure tunnel from Stripe to your local machine. Then trigger test events with stripe trigger checkout.session.completed.


Lesson 5 of 10

Module 1
