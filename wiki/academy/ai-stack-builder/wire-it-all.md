# Wire It All

**Course:** AI Stack Builder
**Order:** 9
**Type:** builder
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 9 of 10


  # Wire It All Together

  Connect all the pieces into one working architecture. Six services, one product, revenue from day one. This lesson is the capstone — everything you have learned converges here.


## The Complete Architecture

Every service you have learned about in this course serves a specific purpose. Together, they form a production-ready AI-powered web app. No service is redundant — remove any one, and you lose a critical capability.


V

**Vercel — Frontend + CDN**
Hosts your Next.js app. Auto-deploys from GitHub on every push to main. Serves from 50+ global edge servers. Preview deploys for every pull request. Zero-config SSL. **Cost: $0/mo** (Hobby tier).


S

**Supabase — Database + Auth + Edge Functions**
Your entire data layer. Postgres database with RLS, user authentication with JWT, Edge Functions for serverless backend logic, pgvector for AI embeddings. One platform replaces five services. **Cost: $25/mo** (Pro plan).


$

**Stripe — Payments**
Hosts checkout pages, processes credit cards, manages subscriptions. You never touch raw card data — Stripe handles PCI compliance. Sends webhooks on payment events. **Cost: 2.9% + $0.30 per transaction**.


@

**Resend — Email Delivery**
Sends transactional emails — welcome messages, receipts, notifications. Clean API, high deliverability, React email templates. **Cost: $0/mo** (100 emails/day free).


M

**Make.com — Visual Automation**
Connects services without direct integrations. Slack alerts, spreadsheet logging, content scheduling — all without writing code. **Cost: $0/mo** (1,000 ops/month free).


AI

**Claude — AI Intelligence**
The brain that coordinates everything. Processes natural language, makes decisions, generates content. Accessed via Edge Functions with the Anthropic API. **Cost: ~$4/mo** (pay-per-token).


## Build It: The 6-Step Wiring Guide

Follow these steps in order. Each step builds on the previous one. By step 6, you have a fully wired, revenue-generating AI product.


Step 1: Supabase — Create Tables + RLS (Foundation)
Create your core tables. The `subscribers` table stores everyone who signs up (with a unique email constraint so duplicates are rejected). The `revenue` table tracks every payment with the Stripe session ID for cross-referencing. Enable Row Level Security on both.


```
-- Core tables for a revenue-generating AI app

CREATE TABLE subscribers (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email      text UNIQUE NOT NULL,
  name       text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE revenue (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  amount            int4,        -- in cents (Stripe standard)
  product           text,
  customer_email    text,
  stripe_session_id text UNIQUE, -- prevents duplicate processing
  created_at        timestamptz DEFAULT now()
);

-- Enable RLS — critical for security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
```


Step 2: Edge Function — subscribe (Email Capture)
This edge function receives an email from your frontend form, stores it in Supabase, and sends a welcome email via Resend. It runs at the edge — globally distributed, close to every user.


```
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "https://esm.sh/resend"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!)

Deno.serve(async (req) => {
  const { email, name } = await req.json()

  // 1. Store in Supabase (UNIQUE constraint rejects duplicates)
  const { error } = await supabase
    .from("subscribers")
    .insert({ email, name })

  if (error?.code === "23505") {
    // Already subscribed — not an error, just skip
    return new Response(JSON.stringify({ status: "already_subscribed" }))
  }

  // 2. Send welcome email via Resend
  await resend.emails.send({
    from: "hello@yourdomain.com",
    to: email,
    subject: `Welcome, ${name || "friend"}!`,
    html: `Thanks for joining. You're in.`
  })

  return new Response(JSON.stringify({ status: "subscribed" }))
})
```


Step 3: Edge Function — create-checkout (Payments)
Creates a Stripe checkout session and returns the URL. Your frontend redirects users there. Stripe hosts the entire payment page — you never touch credit card data.


```
import Stripe from "https://esm.sh/stripe@14"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!)

Deno.serve(async (req) => {
  const { price_id } = await req.json()

  // Create checkout session — Stripe hosts the payment page
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: price_id, quantity: 1 }],
    success_url: "https://yourdomain.com/success",
    cancel_url: "https://yourdomain.com",
  })

  // Return the Stripe-hosted checkout URL
  return new Response(JSON.stringify({ url: session.url }))
})
```


Step 4: Stripe Webhook Handler (Revenue Tracking)
Listens for `checkout.session.completed`, verifies the signature (critical — prevents spoofed events), and logs revenue to Supabase. This is the code from the Webhooks Deep Dive lesson, wired into the full stack.


```
// Verify signature → Process event → Log revenue
const body = await req.text()  // Raw text — never req.json()
const sig = req.headers.get("stripe-signature")!
const event = stripe.webhooks.constructEvent(
  body, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET")!
)

if (event.type === "checkout.session.completed") {
  const session = event.data.object
  await supabase.from("revenue").insert({
    amount: session.amount_total,
    customer_email: session.customer_details?.email,
    stripe_session_id: session.id  // UNIQUE — idempotent
  })
}
```


Step 5: Vercel — Deploy Frontend (Go Live)
Push your Next.js app to GitHub. Vercel auto-deploys to production. Set your Supabase URL and anon key as environment variables — these are the only credentials the frontend needs (RLS protects your data).


```
# Deploy to production
git add . && git commit -m "wire complete stack"
git push origin main
# Vercel auto-deploys from main → live in ~60 seconds

# Required environment variables in Vercel dashboard:
NEXT_PUBLIC_SUPABASE_URL=https://.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```


Step 6: Make.com — Wire Automations (Glue)
Create Make.com scenarios for everything that does not need custom code: new subscriber notifications to Slack, revenue alerts, daily analytics digests. Make.com connects the services that do not have direct API integrations.


```
// Make.com Scenarios to create:

Scenario 1: New Subscriber Alert
  Trigger: Supabase webhook (INSERT on subscribers)
  → Slack: Post to #growth channel

Scenario 2: Revenue Celebration
  Trigger: Supabase webhook (INSERT on revenue)
  → Filter: amount > 5000  // $50+ (amounts in cents)
  → Slack: Post to #revenue channel
  → Google Sheets: Log to analytics spreadsheet

Scenario 3: Daily Digest
  Trigger: Schedule (every day at 9am)
  → Supabase: Count today's subscribers + revenue
  → Slack: Post daily summary to #dashboard
```


## The Complete User Journey

Here is every step a user takes — from first visit to payment — and which service handles each step. This is the full data flow through your wired stack.


1. User visits your site → **Vercel** serves it from the nearest global edge server
2. User enters their email → **Edge Function** (subscribe) processes the form
3. Email stored → **Supabase** saves to the subscribers table (UNIQUE constraint prevents duplicates)
4. Welcome sent → **Resend** delivers the welcome email within seconds
5. Team notified → **Make.com** fires Slack notification to #growth
6. User clicks "Buy" → **Edge Function** (create-checkout) creates a Stripe session
7. Payment processed → **Stripe** handles checkout securely (you never touch card data)
8. Revenue logged → **Stripe webhook** fires, edge function verifies + inserts into revenue table
9. Celebration → **Make.com** sends revenue alert to Slack + logs to Google Sheets
10. AI coordinates → **Claude** manages the brain that ties everything together


**Total time from subscribe to notification:** under 500ms. **Total time from payment to revenue logged:** under 3 seconds. Six services coordinated seamlessly. That is the power of choosing services designed to work together at the edge.


## Security Checklist

A wired stack is only as strong as its weakest security link. Before going live, verify every item on this checklist.


&#x2713; **RLS enabled** on every table — prevents unauthorized data access
&#x2713; **Service role key** only in edge functions — never in frontend code
&#x2713; **Stripe webhook signature** verified on every request — prevents spoofed events
&#x2713; **CORS configured** on edge functions — only your domain can call them
&#x2713; **Environment variables** separated: NEXT_PUBLIC_ for public, no prefix for secrets
&#x2713; **No secrets in git** — all API keys stored in Vercel/Supabase env vars only
&#x2713; **Idempotent webhook handlers** — duplicate events do not cause duplicate processing


## Debugging the Wired Stack

When something breaks in a multi-service architecture, finding the failure point is the hardest part. Here is where to look for each type of problem.


Symptom
Check First
Common Fix


Subscribe form does nothing
Browser console + network tab
CORS error — add your domain to edge function headers


Email stored but no welcome email
Supabase edge function logs
Missing RESEND_API_KEY env var or from address not verified


Payment works but no revenue row
Stripe webhook dashboard (failed deliveries)
Missing STRIPE_WEBHOOK_SECRET or wrong endpoint URL


No Slack notifications
Make.com execution log
Scenario not activated, or Supabase webhook trigger not configured


Deploy succeeds but page is blank
Vercel build logs
Missing NEXT_PUBLIC_SUPABASE_URL env var in Vercel


### Quiz

**Q1: Which service in the stack hosts the checkout page when a user buys a course?**
    A. Vercel
    B. Supabase
  ✓ C. Stripe
    D. Make.com
  *Stripe hosts the checkout page entirely. Your edge function creates a session and returns a URL, and the frontend redirects the user there. You never handle raw card data — Stripe manages the entire payment UI and PCI compliance.*

**Q2: What triggers the Make.com revenue alert scenario?**
    A. A scheduled timer every hour
  ✓ B. A Supabase webhook when a new row is inserted into the revenue table
    C. The user clicking a button on the frontend
    D. A Stripe webhook directly to Make.com
  *Supabase can fire webhooks when database rows are created. The revenue table gets a new row after a successful Stripe payment (via the webhook handler edge function). That Supabase event triggers the Make.com scenario to alert Slack.*

**Q3: Why does Claude read from brain_context via an edge function rather than directly from the frontend?**
    A. The frontend can read brain_context directly with the anon key
  ✓ B. The service role key that bypasses RLS must stay server-side — never in the browser
    C. Edge functions are faster than direct database queries
    D. The brain_context table does not support direct queries
  *The brain_context table uses the service role key for full access, which bypasses RLS. This key must never be exposed to the browser. Edge functions run server-side, keeping the key secure while allowing Claude to read and write the full brain.*

**Q4: A subscriber reports they never got a welcome email, but their email IS in the database. Where do you look first?**
    A. Stripe webhook dashboard
  ✓ B. Supabase edge function logs for the subscribe function
    C. Make.com execution history
    D. Vercel build logs
  *The subscribe edge function both inserts the row AND sends the email. If the row exists but no email was sent, the function either errored during the Resend call (wrong API key, unverified domain) or the email was sent but bounced. Check the edge function logs first.*

**Q5: What would happen if you removed the UNIQUE constraint on stripe_session_id in the revenue table?**
    A. Nothing — Stripe only sends each event once
  ✓ B. Duplicate webhook deliveries could create duplicate revenue rows, inflating your numbers
    C. Stripe would reject the webhook
    D. The edge function would crash
  *Stripe may retry webhooks multiple times. Without UNIQUE on stripe_session_id, each retry could insert another revenue row for the same payment. The constraint prevents this — if a duplicate session_id is inserted, the database rejects it. This is idempotency at the database level.*


### Full Stack Architecture Flashcards

**Card 1:**
Front: Why does Claude read brain_context via an edge function instead of directly from the frontend?
Back: The service role key that bypasses RLS must stay server-side — never in the browser. Edge functions run server-side, keeping the key secure while allowing Claude to read and write the full brain.

**Card 2:**
Front: What is the role of Stripe in the stack?
Back: Stripe hosts the entire checkout page and handles PCI compliance. Your edge function creates a session and returns a URL — the frontend redirects users there. You never touch raw credit card data.

**Card 3:**
Front: How does Make.com fit into the architecture?
Back: Make.com is the automation glue connecting services without direct API integrations. It triggers on Supabase webhooks (new rows), filters data, and routes to Slack, Google Sheets, or email — no code required.

**Card 4:**
Front: What triggers the revenue logging flow?
Back: User completes payment on Stripe → Stripe fires checkout.session.completed webhook → your edge function verifies the signature → inserts a row into the revenue table → Make.com alerts Slack.

**Card 5:**
Front: Why use Vercel for the frontend?
Back: Vercel auto-deploys from GitHub on every push to main. It serves your Next.js app from global edge servers closest to each user, with zero-config SSL, preview deploys for branches, and environment variable management.

**Card 6:**
Front: What is the UNIQUE constraint on stripe_session_id for?
Back: Idempotency at the database level. If Stripe retries a webhook and the handler tries to insert the same session_id twice, the database rejects the duplicate. This prevents double-counting revenue from retry deliveries.

**Card 7:**
Front: Name the 6 services in the stack and their roles.
Back: Vercel (frontend hosting + CDN), Supabase (database + auth + edge functions), Stripe (payments), Resend (email delivery), Make.com (visual automation), Claude (AI intelligence). Total base cost: ~$29/month.


Lesson 9 of 10

Module 1
