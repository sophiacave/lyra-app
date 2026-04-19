# Launch Checklist

**Course:** AI Stack Builder
**Order:** 10
**Type:** lesson
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 10 of 10


  # Launch Checklist

  Before you ship, run through every item. 20 checks across 4 categories. Miss one, and your launch could stumble. This is the final lesson — everything you have learned converges into one pre-flight check.


## Why a Checklist Matters

Pilots do not skip their pre-flight checklist, no matter how many times they have flown. The same principle applies to shipping software. A single missed environment variable can cause a blank page. A leaked secret key can compromise your database. **The checklist is not bureaucracy — it is insurance.**


Before you start
This checklist assumes you have completed the previous 9 lessons. Each item connects back to skills you have already learned. If anything feels unfamiliar, revisit the lesson where it was covered.
**Jargon cheat sheet:**

- RLS (Row Level Security) — database rules that control who can read/write each row. Like a bouncer for your data.

- CORS (Cross-Origin Resource Sharing) — browser security that controls which websites can call your API.

- Tree-shaking — automatically removing unused code from your final bundle, so users download less JavaScript.

- Cache-Control — an HTTP header that tells browsers how long to keep a file before re-downloading it.

- Indexes — a database optimization (like a book's index) that makes lookups fast instead of scanning every row.


## Category 1: Security (5 Items)

Security checks come first because they are the hardest to fix after launch. A security incident on day one can kill trust permanently.


1
**No secrets in frontend code**Grep your `src/` directory for `NEXT_PUBLIC_.*SERVICE_ROLE` and `NEXT_PUBLIC_.*SECRET`. Zero matches = pass. Any match = stop everything and fix it.


2
**RLS enabled on every table**Check the Supabase dashboard: Database → Tables. Every table should show a lock icon. Run `supabase db lint --level warning` to catch RLS gaps.


3
**Stripe webhook signatures verified**Your webhook handler must call `stripe.webhooks.constructEvent()` before processing. Without it, anyone can fake payment events.


4
**CORS configured on edge functions**Only your domain should be allowed to call your API. Set `Access-Control-Allow-Origin` to your production domain, not `*`.


5
**No secrets in git history**Search your git history: `git log -p | grep -i "sk_live\|whsec_\|service_role"`. If found: revoke the key immediately, generate a new one, force-push a cleaned history.


## Category 2: Performance (5 Items)

Performance is user experience. A 3-second load time loses 53% of mobile visitors. These checks keep your app fast.


6
**Bundle size under 100KB first load**Run `next build` and check "First Load JS." Over 100KB means unused libraries are bloating your bundle. Check imports — are you importing entire libraries when you only need one function?


7
**Images optimized**Use Next.js `` component for automatic WebP conversion and lazy loading. No raw `` tags for large images.


8
**Database indexes on queried columns**Every column in a WHERE clause or ORDER BY should have an index. Without one, Postgres scans every row — fine for 100 rows, catastrophic for 100K.


9
**Cache-Control headers set**Static assets (CSS, JS, images) should have long cache times. API responses should not be cached unless intentional. Check with `curl -I your-url`.


10
**Edge function cold starts acceptable**First request after idle may take 1-3 seconds (cold start). Test your edge functions after a 5-minute idle. If cold starts are too slow, consider warming them with a scheduled ping.


## Category 3: User Experience (5 Items)

Users do not read error logs. They see blank pages and leave. These checks ensure your app handles failures gracefully.


11
**Error states handled**What does the user see when the API is down? When payment fails? When they submit an empty form? Every error should show a helpful message, not a blank page or raw error.


12
**Mobile responsive**Test on a real phone or Chrome DevTools mobile mode. Check: text readable without zooming, buttons large enough to tap, forms usable on small screens.


13
**Payment cancel URL configured**When a user cancels on Stripe, where do they land? Set `cancel_url` in your checkout session to a helpful page — not the homepage with no context.


14
**Loading states present**Every button that triggers an API call should show a spinner or "Loading..." state. Prevents double-clicks, double-payments, and confused users.


15
**Success confirmation clear**After subscribing: show a confirmation message. After paying: redirect to a success page with next steps. Users should never wonder "did that work?"


## Category 4: Revenue (5 Items)

Your product is not launched until money can flow. These checks ensure your revenue pipeline works end-to-end.


16
**Stripe test payment completes**Use test card `4242 4242 4242 4242` with any future expiry. The full flow should work: click buy → checkout page → payment → success page → revenue row in database.


17
**Webhook fires and logs revenue**After the test payment, check your revenue table in Supabase. A new row should appear with the correct amount and email. If not: check Stripe webhook dashboard for delivery failures.


18
**Email capture works end-to-end**Submit the subscribe form with a real email. Check: (1) row in subscribers table, (2) welcome email received, (3) duplicate submission handled gracefully.


19
**Switch to live Stripe keys**Replace `sk_test_` with `sk_live_` in your production environment variables. Update the webhook endpoint to use the live signing secret. Do NOT do this until all test payments pass.


20
**Make.com notifications firing**Verify your Slack alerts work: new subscriber notification, revenue alert, and any other scenarios. Check Make.com's execution log for errors.


## Automated Pre-Launch Script

Automate as many checks as possible. Run this script before every deploy — it catches the most common issues in under 30 seconds.


Bash — pre-launch.sh

```
#!/bin/bash
# pre-launch.sh — Run before every deploy
set -e

echo "=== PRE-LAUNCH VERIFICATION ==="

# 1. Scan for leaked secrets in frontend code
echo "[1/5] Scanning for leaked secrets..."
if grep -r "NEXT_PUBLIC_.*SERVICE_ROLE\|NEXT_PUBLIC_.*SECRET" ./src; then
  echo "FAIL: Secret key exposed with NEXT_PUBLIC_ prefix!"
  exit 1
fi
echo "  No secrets in frontend code."

# 2. Build and check for errors
echo "[2/5] Building..."
npm run build 2>&1 | tail -n 5

# 3. Check RLS on all tables
echo "[3/5] Checking RLS..."
supabase db lint --level warning

# 4. Test health endpoint
echo "[4/5] Testing health endpoint..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app/api/health)
if [ "$STATUS" != "200" ]; then
  echo "FAIL: Health endpoint returned $STATUS"; exit 1
fi

# 5. Verify required env vars exist
echo "[5/5] Checking env vars..."
for var in SUPABASE_URL SUPABASE_ANON_KEY STRIPE_SECRET_KEY; do
  if [ -z "${!var}" ]; then
    echo "FAIL: $var is not set"; exit 1
  fi
done

echo "=== ALL CHECKS PASSED — READY TO SHIP ==="
```


## Post-Deploy Smoke Test

After deploying, run this automated smoke test to verify everything works in production. It checks the critical paths your users will hit.


JavaScript — smoke-test.mjs

```
// smoke-test.mjs — Run after every deploy
const BASE = 'https://your-app.vercel.app'

const tests = [
  { name: 'Homepage loads',       url: '/',            expect: 200 },
  { name: 'API health',           url: '/api/health',   expect: 200 },
  { name: 'Auth rejects anon',    url: '/api/auth',     expect: 401 },
  { name: 'Webhook rejects GET',  url: '/api/webhook',  expect: 405 },
  { name: 'CORS headers set',     url: '/api/health',
    header: 'access-control-allow-origin' },
]

for (const t of tests) {
  const res = await fetch(`${BASE}${t.url}`)
  const pass = t.header
    ? res.headers.has(t.header)
    : res.status === t.expect
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${t.name}`)
  if (!pass) process.exit(1)
}
console.log('All smoke tests passed.')
```


&#x1f680;
## Ready to Launch!

All 20 items checked. Your product is ready for the world. Ship it.


### Quiz

**Q1: Where do you configure CORS headers for a Supabase edge function?**
    A. Supabase Dashboard under Settings
  ✓ B. In the edge function code itself as a corsHeaders object
    C. Vercel dashboard under Headers
    D. Namecheap DNS settings
  *CORS headers are set directly in your edge function code. You define a corsHeaders object and include it in every Response you return. There is no dashboard UI for this — it is code-level configuration.*

**Q2: What is the risk of leaving NEXT_PUBLIC_ prefix on a Stripe secret key?**
    A. It causes a build error
  ✓ B. The key is exposed in the browser JavaScript and anyone can see and use it to charge cards and access your Stripe account
    C. It disables tree-shaking
    D. The Stripe API rejects requests
  *Variables with NEXT_PUBLIC_ prefix are bundled into browser JavaScript. Anyone who views source can extract the key. With a Stripe secret key, they could issue charges, read customer data, or modify your account.*

**Q3: What does idempotency mean in the context of Stripe webhooks?**
    A. Webhooks are sent exactly once
  ✓ B. Your endpoint processes the same event safely multiple times without creating duplicates
    C. Stripe encrypts all webhook payloads
    D. Webhooks require authentication
  *Stripe may retry webhooks due to network issues. Idempotency means your handler produces the same result whether it runs once or ten times — store the Stripe event ID and skip if already processed.*

**Q4: You run the pre-launch script and it fails on step 1. What happened?**
    A. The build failed
  ✓ B. A secret key was found with a NEXT_PUBLIC_ prefix in your source code — it would be exposed to browsers
    C. The health endpoint is down
    D. RLS is not enabled
  *Step 1 greps for NEXT_PUBLIC_.*SERVICE_ROLE and NEXT_PUBLIC_.*SECRET in your src/ directory. A match means a secret key is prefixed with NEXT_PUBLIC_ and would be exposed in the browser bundle. Fix: remove the prefix and move the variable to server-side only.*

**Q5: After switching from test to live Stripe keys, what must you also update?**
    A. The Supabase URL
  ✓ B. The webhook signing secret — live and test endpoints have different signing secrets
    C. The Vercel project ID
    D. The CORS headers
  *Stripe issues different signing secrets for test and live webhook endpoints. If you switch to live keys but keep the test webhook secret, signature verification will fail on every live event. Update STRIPE_WEBHOOK_SECRET in your environment variables.*


### Launch Checklist Flashcards

**Card 1:**
Front: What is tree-shaking and why does it matter for performance?
Back: Tree-shaking automatically removes unused code from your JavaScript bundle during build. Smaller bundles mean faster page loads. Check bundle size with next build — aim for under 100KB for first load JS.

**Card 2:**
Front: How do you verify Stripe webhook signatures and why?
Back: Call stripe.webhooks.constructEvent(body, sig, secret) with your webhook signing secret. This prevents fake events — anyone can POST to your endpoint, but only Stripe can produce a valid signature.

**Card 3:**
Front: What should happen when a payment fails on your site?
Back: Redirect to a helpful error page with a retry option. Never leave users on a blank page or generic Stripe error. Set the cancel_url parameter in your checkout session to control where failed/cancelled payments land.

**Card 4:**
Front: What is the Stripe test card number?
Back: 4242 4242 4242 4242 with any future expiry date and any CVC. This card always succeeds in test mode. Use 4000 0000 0000 0002 to test a declined payment.

**Card 5:**
Front: Name the 4 categories of the launch checklist and their focus.
Back: Security (5 items): secrets, RLS, webhook signatures, CORS, git history. Performance (5): bundle size, images, indexes, caching, cold starts. UX (5): error states, mobile, cancel URL, loading states, confirmations. Revenue (5): test payments, webhooks, email capture, live keys, notifications.

**Card 6:**
Front: Why run a smoke test AFTER deploying, not just before?
Back: The build can succeed but the deployed app can still fail — missing environment variables in Vercel, DNS issues, edge function cold starts, or CORS misconfigurations only appear in the production environment. Post-deploy smoke tests catch these.


Lesson 10 of 10

Module 1
