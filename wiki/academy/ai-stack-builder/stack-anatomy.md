# Stack Anatomy

**Course:** AI Stack Builder
**Order:** 1
**Type:** lesson
**Access:** Free

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 1 of 10


  # Stack Anatomy

  The layers of a modern AI-powered web app — and the battle-tested stack that runs Like One Academy.


## Why Your Stack Choice Matters

Building an AI-powered web app is not about picking the trendiest tools. It is about choosing layers that work together seamlessly, scale without surprises, and do not drain your budget before you have your first customer. The wrong stack creates integration hell — spending weeks wiring services together instead of building features.

The right stack gives you **fewer services, less glue code, and more time building the product that matters**. This lesson reveals the exact architecture that powers Like One Academy in production — 52 courses, 520+ lessons, AI memory, Stripe payments, global CDN, all for about $29/month.


The Like One Stack (Battle-Tested)
**Supabase + Edge Functions + Claude + Next.js + Vercel**
~$29/mo total. This is what Like One Academy runs on in production — 52 courses, 520+ lessons, AI memory, Stripe payments, and global CDN. Every layer below is explained with the real config we use.


## The Five Layers of an AI-Powered App

Every AI web app has the same fundamental architecture — five layers that work together. Understanding what each layer does and why you need it prevents the most common mistake: over-engineering early and under-engineering late.


1

**Frontend — What Users See**
**Our choice: Next.js 14 on Vercel.** Server-side rendering for SEO, client-side interactivity where needed, auto-deploys from GitHub. App Router + Server Components mean your pages load fast and search engines can index everything. Vercel built Next.js — the deployment experience is zero-config.


2

**Backend — Serverless Logic**
**Our choice: Supabase Edge Functions (Deno).** TypeScript functions that run globally, close to users. No servers to manage. They handle email capture, payment processing, AI queries — anything that needs server-side secrets or database access. Think of them as the nervous system connecting your frontend to everything else.


3

**Database — Where Data Lives**
**Our choice: Supabase (Postgres + pgvector).** Not just a database — it bundles auth, real-time subscriptions, file storage, and Row Level Security (RLS) in one platform. pgvector enables semantic search with AI embeddings, so your app can find things by meaning, not just keywords. One service replaces five.


4

**AI Layer — Intelligence**
**Our choice: Claude (Anthropic) + BGE-small embeddings (HuggingFace).** Claude handles reasoning and generation — the brain of your app. BGE-small creates embeddings for free via HuggingFace Inference API, which get stored in pgvector for semantic search. The two-tier approach means you only call the expensive model when you actually need reasoning.


5

**Automation — The Glue**
**Our choice: Make.com + Stripe webhooks.** Make.com connects services that do not have direct integrations — Slack alerts when someone subscribes, spreadsheet logging for analytics, scheduled content publishing. Stripe webhooks handle payment events. Together, they make data flow between services without writing custom code for every connection.


## The Full Architecture Config

Here is the actual architecture in config format — this is the real stack running Like One Academy:


YAML — Full-stack AI app architecture overview

```
# stack-config.yaml — The anatomy of an AI-powered web app

deploy:
  platform: Vercel          # Auto-deploys from GitHub
  domain:   your-app.com
  regions:  [iad1, sfo1]    # Edge-close to users

frontend:
  framework: Next.js 14      # App Router + Server Components
  styling:   Tailwind CSS
  auth_ui:   @supabase/auth-ui-react

backend:
  runtime:    Supabase Edge Functions  # Deno, globally distributed
  language:   TypeScript
  functions:
    - subscribe       # Email capture
    - create-checkout # Stripe payment
    - brain-query     # AI memory retrieval

database:
  provider:    Supabase (Postgres)
  extensions:  [pgvector, pg_trgm]
  auth:        Supabase Auth + RLS    # JWT-based row security
  realtime:    true                   # Live subscriptions

ai:
  model:       Claude (Anthropic)     # Reasoning + generation
  embeddings:  BGE-small (HuggingFace) # Free vector embeddings
  vector_db:   pgvector              # Semantic search in Postgres

cost:
  total: ~$29/month
  breakdown:
    supabase: $25   # Pro plan (DB + Auth + Functions)
    vercel:   $0    # Hobby tier for most projects
    claude:   ~$4   # Pay-per-token, varies with usage
```


## Why This Stack (And Not Firebase, AWS, or Django)

There are many ways to build a web app. Here is why we chose this specific combination — and when you might choose differently:


Alternative
When It Wins
Why We Did Not Choose It


Firebase
Mobile-first apps, real-time features, Google ecosystem integration
NoSQL (Firestore) is painful for relational data. No pgvector equivalent. Vendor lock-in with Google.


AWS (Lambda + RDS)
Enterprise scale, existing AWS infrastructure, complex microservices
Requires 10+ services to replicate what Supabase does in one. IAM complexity. Cold starts. Overkill for most indie/startup projects.


Django + Railway
Python-heavy teams, data science pipelines, admin-heavy apps
Monolithic architecture. Harder to scale serverlessly. Slower iteration cycle than edge functions.


FastAPI + PlanetScale
Python API backends, MySQL-preferred teams
PlanetScale lacks pgvector, auth, and edge functions. You end up stitching 5 services together yourself.


**The core principle:** Choose the stack that gives you the **fewest services to manage** and the **fastest path to a working product**. Supabase replaces 5 services (database, auth, functions, real-time, vector search). Vercel replaces your entire deployment pipeline. Claude replaces an ML team. The result: more building, less wiring.


## How the Layers Talk to Each Other

Understanding data flow is more important than understanding any individual service. Here is how a request moves through the stack when a user subscribes:


1. User clicks "Subscribe" → **Next.js** (frontend) sends a POST request
2. POST hits → **Supabase Edge Function** (subscribe) at the nearest edge location
3. Edge function inserts email → **Supabase Postgres** (subscribers table)
4. Edge function calls → **Resend API** (sends welcome email)
5. Supabase database trigger fires → **Make.com webhook** (sends Slack notification)
6. Edge function returns "success" → **Next.js** shows confirmation to user


Total time: under 500ms. Six services coordinated in half a second. That is the power of choosing services that are designed to work together at the edge.


## Cost Breakdown: $29/Month for a Production App

One of the most common reasons AI projects die: the infrastructure bill exceeds the revenue. This stack is deliberately optimized for indie developers and small teams who need to ship a real product without burning through savings.


**Supabase Pro**Database + Auth + Edge Functions + Real-time + pgvector
**$25/mo**


**Vercel Hobby**Frontend hosting + CDN + auto-deploy + SSL
**$0/mo**


**Claude API**Pay-per-token, varies with usage
**~$4/mo**


**Make.com Free**1,000 operations/month
**$0/mo**


**HuggingFace Inference**BGE-small embeddings
**$0/mo**


**Scaling math:** This stack handles 10,000+ monthly active users without upgrading. When you outgrow it, Supabase Pro scales to enterprise. Vercel Pro is $20/mo. Claude costs scale linearly with usage. You will not hit a cost cliff — the pricing grows with your revenue.


### Stack Anatomy Flashcards

**Card 1:**
Front: What is Supabase and why is it the foundation layer?
Back: Supabase is Postgres with superpowers — it bundles database, auth, edge functions, real-time subscriptions, file storage, and pgvector for AI embeddings in one platform. Fewer services means less integration complexity.

**Card 2:**
Front: What does pgvector enable in an AI stack?
Back: pgvector is a Postgres extension that stores high-dimensional vectors (AI embeddings). It enables semantic search — finding database entries by meaning rather than exact keyword match, which is foundational for AI memory and RAG.

**Card 3:**
Front: Why pair Next.js with Vercel?
Back: Vercel built Next.js, so deployment is seamless — auto-deploys from GitHub, global CDN, edge rendering, and zero-config. It is the fastest path from code push to live site.

**Card 4:**
Front: What role does Claude play in the AI stack?
Back: Claude is the intelligence layer — it handles reasoning, text generation, code writing, and complex decision-making. It integrates cleanly from serverless environments like Supabase Edge Functions.

**Card 5:**
Front: What does Make.com do in the stack?
Back: Make.com is the visual automation glue — it connects services that do not have direct API integrations. You build workflows by dragging modules (Slack alerts, spreadsheet logging, email triggers) without writing code.

**Card 6:**
Front: Two-Tier AI Strategy
Back: Use free embeddings (BGE-small via HuggingFace) for semantic search and retrieval. Only call Claude (paid) when you actually need reasoning or generation. This keeps AI costs under $5/month for most apps.

**Card 7:**
Front: Why not Firebase?
Back: NoSQL (Firestore) is painful for relational data. No pgvector equivalent for AI embeddings. Vendor lock-in with Google. Supabase gives you Postgres (the most versatile database) with all the Firebase conveniences built in.


### Quiz

**Q1: Which combination gives the highest compatibility score for an AI-powered web app?**
    A. Firebase + Express + ChatGPT + React + Netlify
  ✓ B. Supabase + Edge Functions + Claude + Next.js + Vercel
    C. PlanetScale + FastAPI + Gemini + Astro + Railway
    D. AWS Lambda + RDS + GPT-4 + React + S3
  *Supabase + Edge Functions + Claude + Next.js + Vercel is the battle-tested combination for AI apps. Each layer is purpose-built to work with the others — Supabase Edge runs Deno natively, Next.js deploys perfectly on Vercel, and Claude integrates cleanly from serverless environments.*

**Q2: Why is Supabase recommended over Firebase for AI-powered stacks?**
    A. Supabase is cheaper
  ✓ B. Supabase bundles Postgres, Auth, Edge Functions, Realtime, and pgvector in one platform — and Postgres is better than Firestore for relational data and AI embeddings
    C. Supabase has more features
    D. Firebase does not support serverless functions
  *Supabase gives you a real Postgres database (relational queries, pgvector for embeddings, full SQL) plus all the convenience features Firebase offers (auth, real-time, functions). Firestore NoSQL lacks vector search and makes relational queries painful.*

**Q3: Why does the stack use free BGE-small embeddings instead of calling Claude for everything?**
    A. BGE-small is more accurate than Claude
  ✓ B. Using free embeddings for search and retrieval, then only calling Claude for reasoning, keeps AI costs under $5/month — the two-tier approach matches cost to capability
    C. Claude cannot generate embeddings
    D. BGE-small is faster in all cases
  *Embeddings are a commodity — free models like BGE-small work great for semantic search. Claude is expensive but powerful for reasoning and generation. The two-tier approach means you only pay for the expensive model when you actually need its capabilities.*

**Q4: A user subscribes on your site. How many services are involved in the full flow?**
    A. Two — frontend and database
    B. Four — Next.js, Edge Function, Supabase, Resend
  ✓ C. Six — Next.js, Edge Function, Supabase, Resend, Make.com (Slack notification), and the response back to Next.js
    D. Three — frontend, API, and database
  *The full subscribe flow touches six services: Next.js sends the request, the Edge Function processes it, Supabase stores the email, Resend sends the welcome email, Make.com fires a Slack notification via webhook, and the Edge Function returns success to Next.js. All in under 500ms.*

**Q5: What is the total monthly cost to run a production AI-powered web app on this stack?**
    A. About $100/month
  ✓ B. About $29/month — Supabase Pro ($25) + Claude API (~$4) + free tiers for Vercel, Make.com, and HuggingFace
    C. About $50/month
    D. It depends entirely on traffic — there is no predictable base cost
  *The base cost is remarkably low: Supabase Pro at $25/month covers database, auth, functions, and vector search. Claude API costs about $4/month at moderate usage. Vercel Hobby, Make.com Free, and HuggingFace Inference are all $0. Total: ~$29/month for a production app.*


Lesson 1 of 10

Module 1
