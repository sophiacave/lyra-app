# Vercel Deploy

**Course:** AI Stack Builder
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 8 of 10


  # Vercel Deploy

  Vercel turns `git push` into a live URL. No servers, no Docker, no YAML. Push code, get a website. This is the deployment layer of your AI stack — and it eliminates an entire category of DevOps work.


## Why Vercel Changes Everything

Traditional deployment means provisioning servers, configuring Nginx, setting up SSL certificates, building CI/CD pipelines, and praying nothing breaks at 2am. Vercel replaces **all of that** with one concept: push to GitHub, get a live site.

Vercel built Next.js, so the integration is seamless — zero configuration, automatic optimizations, and deployment that works the way it should: instantly and invisibly.


&#x26a1;
30-90 secFrom git push to live production URL — fully automated


&#x1f310;
50+ PoPsGlobal edge network — users hit the closest server automatically


&#x1f512;
Auto SSLHTTPS certificates provisioned and renewed automatically — zero config


## The Deploy Pipeline

Every time you push to your main branch, Vercel triggers this exact sequence. Understanding it helps you debug when something goes wrong.


1. **git push origin main** — your code reaches GitHub
2. **Detect** — Vercel identifies your framework (Next.js, React, Astro, etc.) automatically
3. **Install** — runs `npm install` to fetch dependencies
4. **Build** — compiles your app (`next build` for Next.js), catches errors here
5. **Deploy** — distributes the built assets to 50+ global edge servers
6. **Live!** — your site is accessible at `your-project.vercel.app` (and your custom domain)


**If the build fails:** Vercel does NOT deploy the broken code. Your existing production site stays live and unaffected. Check the build logs in the Vercel dashboard — the error is almost always a TypeScript type error or a missing environment variable.


## Environment Variables: The Security Gate

Environment variables are how your app accesses secrets (API keys, database URLs) without hardcoding them in your source code. In Next.js, the `NEXT_PUBLIC_` prefix is the dividing line between safe and dangerous.


**NEXT_PUBLIC_ (Browser-Safe)**
Included in the browser bundle. Anyone can see these in your page source. **Only use for values designed to be public** — Supabase URL and anon key are fine (RLS protects data).


**No Prefix (Server-Only)**
Only accessible in server-side code (API routes, Server Components, middleware). **ALL secret keys go here** — Stripe secret, service role key, webhook secrets. Never prefix these with NEXT_PUBLIC_.


Vercel Dashboard — Environment Variables

```
# PUBLIC — safe for browser (RLS protects data)
NEXT_PUBLIC_SUPABASE_URL=https://.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# SECRET — server-side only (NEVER prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
```


**If you accidentally expose a secret:** (1) Immediately revoke the key in that service's dashboard. (2) Generate a new key. (3) Update it in Vercel. (4) Redeploy. Assume the old key is compromised — git history is public and bots scan for leaked secrets within minutes.


## Preview Deploys: Test Before You Ship

Every pull request gets its own unique URL. This is one of Vercel's most powerful features — it turns code review from "reading diffs" to "clicking a link and testing the actual app."


PR

**How It Works**
Create a PR on GitHub → Vercel builds and deploys that branch → a unique preview URL (like `my-app-git-feature-xyz.vercel.app`) appears as a comment on your PR. Click it to test the changes in a real browser. The preview uses the same infrastructure as production.


&#x2713;

**Why It Matters**
Preview deploys catch problems that code review misses — layout bugs, broken links, mobile rendering issues, environment variable misconfigurations. They also let non-technical stakeholders review changes without setting up a local dev environment.


## Custom Domains

Pointing your domain to Vercel takes two steps. SSL certificates are provisioned and renewed automatically — no more expired cert emergencies.


DNS — Custom domain setup

```
# Step 1: Add domain in Vercel dashboard
# Project → Settings → Domains → Add "yourdomain.com"

# Step 2: Update DNS at your registrar (Namecheap, Cloudflare, etc.)
Type  Name  Value
A     @     76.76.21.21        # Vercel's IP
CNAME www   cname.vercel-dns.com

# Vercel provisions SSL automatically — live in minutes
```


## Deploy from CLI

Most of the time you will just `git push` and let the GitHub integration handle deployment. But the Vercel CLI is useful for quick previews or deploying without committing.


Terminal — Vercel CLI commands

```
# Install Vercel CLI globally
npm i -g vercel

# Link your local project to Vercel
vercel link

# Deploy to preview (unique URL, not production)
vercel

# Deploy directly to production
vercel --prod

# Pull env vars from Vercel to local .env.local
vercel env pull

# Or the simplest path — push to main and forget
git push origin main  # auto-deploys to production
```


**Pro tip: `vercel env pull`** downloads your Vercel environment variables to a local `.env.local` file. This keeps your local dev environment in sync with production without manually copying secrets. The file is automatically gitignored by Next.js.


## Deployment Environments

Vercel separates your environment variables into three scopes. This prevents your development Stripe key from touching production data.


Environment
When It Runs
Example Use


Production
Push to main branch
Live Stripe keys, production Supabase URL, real customer data


Preview
Push to any other branch or PR
Test Stripe keys, staging Supabase, safe to experiment


Development
Local dev via `vercel dev` or `vercel env pull`
Local Stripe test mode, local Supabase instance


**The golden rule:** Never use production API keys in development. Stripe test keys (starting with `sk_test_`) generate test transactions that do not charge real cards. Supabase lets you branch your database for isolated testing. Keep environments separate.


## Common Deployment Issues

When a deploy fails, the answer is almost always in the build logs. Here are the most common issues and their fixes.


Error
Cause
Fix


`Build failed`
TypeScript type error or syntax error in code
Run `npm run build` locally first — fix all errors before pushing


`NEXT_PUBLIC_* is undefined`
Environment variable not set in Vercel dashboard
Add the variable in Settings → Environment Variables → redeploy


`Page loads blank`
Missing Supabase URL or anon key — client cannot connect
Check that NEXT_PUBLIC_ vars are set for Production environment


`API route returns 500`
Server-side env var missing (Stripe key, service role)
Add the variable without NEXT_PUBLIC_ prefix — redeploy


### Quiz

**Q1: What happens automatically when you push to the main branch on GitHub?**
    A. Nothing — you must run vercel --prod manually
  ✓ B. Vercel detects the push and triggers a production deployment
    C. A preview deployment is created but not promoted to production
    D. Vercel sends you an email to confirm the deploy
  *When you connect your GitHub repo to Vercel, it watches for pushes to the main branch and automatically triggers a production deployment. No manual step needed — git push is the entire deploy workflow.*

**Q2: What is the purpose of a preview deployment?**
    A. To deploy to a staging server
  ✓ B. Each pull request gets its own unique URL so you can test changes before merging
    C. To reduce production costs
    D. To test environment variables
  *Vercel creates a unique preview URL for every pull request. You can share the URL with teammates, test the changes in a real browser, and confirm everything works before merging to main and deploying to production.*

**Q3: Which environment variable prefix exposes values to the browser in Next.js?**
    A. PUBLIC_
    B. BROWSER_
  ✓ C. NEXT_PUBLIC_
    D. CLIENT_
  *In Next.js, only variables prefixed with NEXT_PUBLIC_ are included in the browser bundle. All other environment variables remain server-side only. This distinction is critical — secret keys (Stripe, service role) must never use this prefix.*

**Q4: What does the vercel env pull command do?**
    A. Uploads local env vars to Vercel
  ✓ B. Downloads Vercel environment variables to a local .env.local file
    C. Deletes all environment variables
    D. Shows env var values in the terminal
  *vercel env pull downloads your Vercel environment variables to a local .env.local file, keeping your local development in sync with production config. The file is automatically gitignored by Next.js so secrets are not committed.*

**Q5: A deploy succeeds but the page loads blank. What is the most likely cause?**
    A. The CSS file is missing
  ✓ B. NEXT_PUBLIC_SUPABASE_URL is not set in Vercel — the frontend cannot connect to the database
    C. The domain is not configured correctly
    D. Vercel is experiencing an outage
  *A blank page after successful deploy usually means the frontend app cannot connect to its data source. If NEXT_PUBLIC_SUPABASE_URL is missing, the Supabase client initializes with undefined and all data fetches fail silently, rendering an empty page.*


### Vercel Deploy Flashcards

**Card 1:**
Front: What is a CDN (Content Delivery Network) and why does Vercel use one?
Back: A CDN is a network of servers distributed globally. When a user requests your site, it is served from the closest server (Point of Presence / PoP). Vercel has 50+ PoPs, so users in Tokyo get served from Tokyo — reducing latency and improving performance for everyone.

**Card 2:**
Front: What should you do if you accidentally commit a secret key to git?
Back: Immediately revoke the exposed key in that service dashboard (Stripe, Supabase, etc.) and generate a new one. Assume the key is already compromised — git history is public. Update your environment variables with the new key and redeploy.

**Card 3:**
Front: What is the difference between vercel and vercel --prod?
Back: vercel (without --prod) creates a preview deployment — a unique URL for testing. vercel --prod promotes the build to production and updates your main domain. Most teams use git push to trigger --prod automatically via the GitHub integration.

**Card 4:**
Front: Why separate environment variables by Production, Preview, and Development?
Back: To prevent test keys from touching production data and vice versa. Production uses live Stripe keys and real customer data. Preview uses test Stripe keys for safe experimentation. Development uses local instances. Mixing them risks charging test cards or corrupting production data.

**Card 5:**
Front: What does vercel env pull do?
Back: Downloads your Vercel environment variables to a local .env.local file. This keeps your local dev environment in sync with production config without manually copying secrets. The file is automatically gitignored by Next.js.

**Card 6:**
Front: What happens if a Vercel build fails?
Back: Vercel does NOT deploy the broken code. Your existing production site stays live and unaffected. The failed build appears in the dashboard with detailed logs showing exactly where the error occurred. Fix the error, push again, and Vercel rebuilds.


Lesson 8 of 10

Module 1
