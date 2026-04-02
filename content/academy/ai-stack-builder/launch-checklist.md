---
title: "Launch Checklist"
course: "ai-stack-builder"
order: 10
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Launch <span class="accent">Checklist</span></h1>
  <p class="sub">Before you ship, run through every item. 20 checks across 4 categories. Miss one, and your launch could stumble. This is the final lesson — everything you have learned converges into one pre-flight check.</p>
</div>

<div class="content">

<div class="card">
<h2>Why a Checklist Matters</h2>
<p>Pilots do not skip their pre-flight checklist, no matter how many times they have flown. The same principle applies to shipping software. A single missed environment variable can cause a blank page. A leaked secret key can compromise your database. <strong style="color:#e5e5e5">The checklist is not bureaucracy — it is insurance.</strong></p>

<div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<p style="color:#fb923c;font-weight:700;font-size:.9rem;margin:0 0 .75rem">Before you start</p>
<p style="font-size:.85rem;color:#a1a1aa;margin:0 0 .75rem;line-height:1.7">This checklist assumes you have completed the previous 9 lessons. Each item connects back to skills you have already learned. If anything feels unfamiliar, revisit the lesson where it was covered.</p>
<p style="font-size:.85rem;color:#e5e5e5;margin:0 0 .5rem"><strong>Jargon cheat sheet:</strong></p>
<ul style="list-style:none;padding:0;margin:0;font-size:.82rem;color:#a1a1aa;line-height:2">
<li><strong style="color:#f59e0b">RLS (Row Level Security)</strong> — database rules that control who can read/write each row. Like a bouncer for your data.</li>
<li><strong style="color:#f59e0b">CORS (Cross-Origin Resource Sharing)</strong> — browser security that controls which websites can call your API.</li>
<li><strong style="color:#f59e0b">Tree-shaking</strong> — automatically removing unused code from your final bundle, so users download less JavaScript.</li>
<li><strong style="color:#f59e0b">Cache-Control</strong> — an HTTP header that tells browsers how long to keep a file before re-downloading it.</li>
<li><strong style="color:#f59e0b">Indexes</strong> — a database optimization (like a book's index) that makes lookups fast instead of scanning every row.</li>
</ul>
</div>
</div>

<div class="card">
<h2>Category 1: Security (5 Items)</h2>
<p>Security checks come first because they are the hardest to fix after launch. A security incident on day one can kill trust permanently.</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(239,68,68,.04);border-radius:8px;border:1px solid rgba(239,68,68,.08)">
<div style="min-width:1.5rem;color:#ef4444;font-weight:700;font-size:.85rem">1</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">No secrets in frontend code</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Grep your <code style="color:#f59e0b">src/</code> directory for <code style="color:#ef4444">NEXT_PUBLIC_.*SERVICE_ROLE</code> and <code style="color:#ef4444">NEXT_PUBLIC_.*SECRET</code>. Zero matches = pass. Any match = stop everything and fix it.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(239,68,68,.04);border-radius:8px;border:1px solid rgba(239,68,68,.08)">
<div style="min-width:1.5rem;color:#ef4444;font-weight:700;font-size:.85rem">2</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">RLS enabled on every table</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Check the Supabase dashboard: Database &rarr; Tables. Every table should show a lock icon. Run <code style="color:#f59e0b">supabase db lint --level warning</code> to catch RLS gaps.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(239,68,68,.04);border-radius:8px;border:1px solid rgba(239,68,68,.08)">
<div style="min-width:1.5rem;color:#ef4444;font-weight:700;font-size:.85rem">3</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Stripe webhook signatures verified</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Your webhook handler must call <code style="color:#f59e0b">stripe.webhooks.constructEvent()</code> before processing. Without it, anyone can fake payment events.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(239,68,68,.04);border-radius:8px;border:1px solid rgba(239,68,68,.08)">
<div style="min-width:1.5rem;color:#ef4444;font-weight:700;font-size:.85rem">4</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">CORS configured on edge functions</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Only your domain should be allowed to call your API. Set <code style="color:#f59e0b">Access-Control-Allow-Origin</code> to your production domain, not <code style="color:#ef4444">*</code>.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(239,68,68,.04);border-radius:8px;border:1px solid rgba(239,68,68,.08)">
<div style="min-width:1.5rem;color:#ef4444;font-weight:700;font-size:.85rem">5</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">No secrets in git history</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Search your git history: <code style="color:#f59e0b">git log -p | grep -i "sk_live\|whsec_\|service_role"</code>. If found: revoke the key immediately, generate a new one, force-push a cleaned history.</p></div>
</div>
</div>
</div>

<div class="card">
<h2>Category 2: Performance (5 Items)</h2>
<p>Performance is user experience. A 3-second load time loses 53% of mobile visitors. These checks keep your app fast.</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:1.5rem;color:#8b5cf6;font-weight:700;font-size:.85rem">6</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Bundle size under 100KB first load</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Run <code style="color:#f59e0b">next build</code> and check "First Load JS." Over 100KB means unused libraries are bloating your bundle. Check imports — are you importing entire libraries when you only need one function?</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:1.5rem;color:#8b5cf6;font-weight:700;font-size:.85rem">7</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Images optimized</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Use Next.js <code style="color:#f59e0b">&lt;Image&gt;</code> component for automatic WebP conversion and lazy loading. No raw <code style="color:#ef4444">&lt;img&gt;</code> tags for large images.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:1.5rem;color:#8b5cf6;font-weight:700;font-size:.85rem">8</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Database indexes on queried columns</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Every column in a WHERE clause or ORDER BY should have an index. Without one, Postgres scans every row — fine for 100 rows, catastrophic for 100K.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:1.5rem;color:#8b5cf6;font-weight:700;font-size:.85rem">9</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Cache-Control headers set</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Static assets (CSS, JS, images) should have long cache times. API responses should not be cached unless intentional. Check with <code style="color:#f59e0b">curl -I your-url</code>.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:1.5rem;color:#8b5cf6;font-weight:700;font-size:.85rem">10</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Edge function cold starts acceptable</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">First request after idle may take 1-3 seconds (cold start). Test your edge functions after a 5-minute idle. If cold starts are too slow, consider warming them with a scheduled ping.</p></div>
</div>
</div>
</div>

<div class="card">
<h2>Category 3: User Experience (5 Items)</h2>
<p>Users do not read error logs. They see blank pages and leave. These checks ensure your app handles failures gracefully.</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:1.5rem;color:#34d399;font-weight:700;font-size:.85rem">11</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Error states handled</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">What does the user see when the API is down? When payment fails? When they submit an empty form? Every error should show a helpful message, not a blank page or raw error.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:1.5rem;color:#34d399;font-weight:700;font-size:.85rem">12</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Mobile responsive</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Test on a real phone or Chrome DevTools mobile mode. Check: text readable without zooming, buttons large enough to tap, forms usable on small screens.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:1.5rem;color:#34d399;font-weight:700;font-size:.85rem">13</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Payment cancel URL configured</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">When a user cancels on Stripe, where do they land? Set <code style="color:#f59e0b">cancel_url</code> in your checkout session to a helpful page — not the homepage with no context.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:1.5rem;color:#34d399;font-weight:700;font-size:.85rem">14</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Loading states present</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Every button that triggers an API call should show a spinner or "Loading..." state. Prevents double-clicks, double-payments, and confused users.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:1.5rem;color:#34d399;font-weight:700;font-size:.85rem">15</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Success confirmation clear</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">After subscribing: show a confirmation message. After paying: redirect to a success page with next steps. Users should never wonder "did that work?"</p></div>
</div>
</div>
</div>

<div class="card">
<h2>Category 4: Revenue (5 Items)</h2>
<p>Your product is not launched until money can flow. These checks ensure your revenue pipeline works end-to-end.</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:1.5rem;color:#fb923c;font-weight:700;font-size:.85rem">16</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Stripe test payment completes</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Use test card <code style="color:#f59e0b">4242 4242 4242 4242</code> with any future expiry. The full flow should work: click buy &rarr; checkout page &rarr; payment &rarr; success page &rarr; revenue row in database.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:1.5rem;color:#fb923c;font-weight:700;font-size:.85rem">17</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Webhook fires and logs revenue</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">After the test payment, check your revenue table in Supabase. A new row should appear with the correct amount and email. If not: check Stripe webhook dashboard for delivery failures.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:1.5rem;color:#fb923c;font-weight:700;font-size:.85rem">18</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Email capture works end-to-end</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Submit the subscribe form with a real email. Check: (1) row in subscribers table, (2) welcome email received, (3) duplicate submission handled gracefully.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:1.5rem;color:#fb923c;font-weight:700;font-size:.85rem">19</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Switch to live Stripe keys</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Replace <code style="color:#f59e0b">sk_test_</code> with <code style="color:#f59e0b">sk_live_</code> in your production environment variables. Update the webhook endpoint to use the live signing secret. Do NOT do this until all test payments pass.</p></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:1.5rem;color:#fb923c;font-weight:700;font-size:.85rem">20</div>
<div><strong style="color:#e5e5e5;font-size:.85rem">Make.com notifications firing</strong><p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0;line-height:1.7">Verify your Slack alerts work: new subscriber notification, revenue alert, and any other scenarios. Check Make.com's execution log for errors.</p></div>
</div>
</div>
</div>

<div class="card">
<h2>Automated Pre-Launch Script</h2>
<p>Automate as many checks as possible. Run this script before every deploy — it catches the most common issues in under 30 seconds.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Bash — pre-launch.sh</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">#!/bin/bash</span>
<span style="color:#71717a"># pre-launch.sh — Run before every deploy</span>
<span style="color:#c084fc">set</span> -e

<span style="color:#34d399">echo</span> <span style="color:#fb923c">"=== PRE-LAUNCH VERIFICATION ==="</span>

<span style="color:#71717a"># 1. Scan for leaked secrets in frontend code</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[1/5] Scanning for leaked secrets..."</span>
<span style="color:#c084fc">if</span> grep -r <span style="color:#fb923c">"NEXT_PUBLIC_.*SERVICE_ROLE\|NEXT_PUBLIC_.*SECRET"</span> ./src; <span style="color:#c084fc">then</span>
  <span style="color:#34d399">echo</span> <span style="color:#fb923c">"FAIL: Secret key exposed with NEXT_PUBLIC_ prefix!"</span>
  <span style="color:#c084fc">exit</span> <span style="color:#fb923c">1</span>
<span style="color:#c084fc">fi</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"  No secrets in frontend code."</span>

<span style="color:#71717a"># 2. Build and check for errors</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[2/5] Building..."</span>
npm run build <span style="color:#fb923c">2>&1</span> | tail -n <span style="color:#fb923c">5</span>

<span style="color:#71717a"># 3. Check RLS on all tables</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[3/5] Checking RLS..."</span>
supabase db lint --level warning

<span style="color:#71717a"># 4. Test health endpoint</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[4/5] Testing health endpoint..."</span>
STATUS=$(<span style="color:#34d399">curl</span> -s -o /dev/null -w <span style="color:#fb923c">"%{http_code}"</span> https://your-app.vercel.app/api/health)
<span style="color:#c084fc">if</span> [ <span style="color:#fb923c">"$STATUS"</span> != <span style="color:#fb923c">"200"</span> ]; <span style="color:#c084fc">then</span>
  <span style="color:#34d399">echo</span> <span style="color:#fb923c">"FAIL: Health endpoint returned $STATUS"</span>; <span style="color:#c084fc">exit</span> <span style="color:#fb923c">1</span>
<span style="color:#c084fc">fi</span>

<span style="color:#71717a"># 5. Verify required env vars exist</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[5/5] Checking env vars..."</span>
<span style="color:#c084fc">for</span> var <span style="color:#c084fc">in</span> SUPABASE_URL SUPABASE_ANON_KEY STRIPE_SECRET_KEY; <span style="color:#c084fc">do</span>
  <span style="color:#c084fc">if</span> [ -z <span style="color:#fb923c">"${!var}"</span> ]; <span style="color:#c084fc">then</span>
    <span style="color:#34d399">echo</span> <span style="color:#fb923c">"FAIL: $var is not set"</span>; <span style="color:#c084fc">exit</span> <span style="color:#fb923c">1</span>
  <span style="color:#c084fc">fi</span>
<span style="color:#c084fc">done</span>

<span style="color:#34d399">echo</span> <span style="color:#fb923c">"=== ALL CHECKS PASSED — READY TO SHIP ==="</span></code></pre>
</div>
</div>

<div class="card">
<h2>Post-Deploy Smoke Test</h2>
<p>After deploying, run this automated smoke test to verify everything works in production. It checks the critical paths your users will hit.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">JavaScript — smoke-test.mjs</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// smoke-test.mjs — Run after every deploy</span>
<span style="color:#c084fc">const</span> BASE = <span style="color:#fb923c">'https://your-app.vercel.app'</span>

<span style="color:#c084fc">const</span> tests = [
  { name: <span style="color:#fb923c">'Homepage loads'</span>,       url: <span style="color:#fb923c">'/'</span>,            expect: <span style="color:#fb923c">200</span> },
  { name: <span style="color:#fb923c">'API health'</span>,           url: <span style="color:#fb923c">'/api/health'</span>,   expect: <span style="color:#fb923c">200</span> },
  { name: <span style="color:#fb923c">'Auth rejects anon'</span>,    url: <span style="color:#fb923c">'/api/auth'</span>,     expect: <span style="color:#fb923c">401</span> },
  { name: <span style="color:#fb923c">'Webhook rejects GET'</span>,  url: <span style="color:#fb923c">'/api/webhook'</span>,  expect: <span style="color:#fb923c">405</span> },
  { name: <span style="color:#fb923c">'CORS headers set'</span>,     url: <span style="color:#fb923c">'/api/health'</span>,
    header: <span style="color:#fb923c">'access-control-allow-origin'</span> },
]

<span style="color:#c084fc">for</span> (<span style="color:#c084fc">const</span> t <span style="color:#c084fc">of</span> tests) {
  <span style="color:#c084fc">const</span> res = <span style="color:#c084fc">await</span> <span style="color:#34d399">fetch</span>(<span style="color:#fb923c">`${BASE}${t.url}`</span>)
  <span style="color:#c084fc">const</span> pass = t.header
    ? res.headers.<span style="color:#34d399">has</span>(t.header)
    : res.status === t.expect
  console.<span style="color:#34d399">log</span>(<span style="color:#fb923c">`${pass ? <span style="color:#34d399">'PASS'</span> : <span style="color:#ef4444">'FAIL'</span>}  ${t.name}`</span>)
  <span style="color:#c084fc">if</span> (!pass) process.<span style="color:#34d399">exit</span>(<span style="color:#fb923c">1</span>)
}
console.<span style="color:#34d399">log</span>(<span style="color:#fb923c">'All smoke tests passed.'</span>)</code></pre>
</div>
</div>

<div style="margin:1.5rem 0">

<div id="checklistContainer"></div>

<div class="celebration" id="celebration">
<span class="cel-icon">&#x1f680;</span>
<h2>Ready to Launch!</h2>
<p>All 20 items checked. Your product is ready for the world. Ship it.</p>
<div id="confetti"></div>
</div>

<div data-learn="QuizMC" data-props='{"title":"Launch Readiness — Mastery Check","questions":[{"q":"Where do you configure CORS headers for a Supabase edge function?","options":["Supabase Dashboard under Settings","In the edge function code itself as a corsHeaders object","Vercel dashboard under Headers","Namecheap DNS settings"],"correct":1,"explanation":"CORS headers are set directly in your edge function code. You define a corsHeaders object and include it in every Response you return. There is no dashboard UI for this — it is code-level configuration."},{"q":"What is the risk of leaving NEXT_PUBLIC_ prefix on a Stripe secret key?","options":["It causes a build error","The key is exposed in the browser JavaScript and anyone can see and use it to charge cards and access your Stripe account","It disables tree-shaking","The Stripe API rejects requests"],"correct":1,"explanation":"Variables with NEXT_PUBLIC_ prefix are bundled into browser JavaScript. Anyone who views source can extract the key. With a Stripe secret key, they could issue charges, read customer data, or modify your account."},{"q":"What does idempotency mean in the context of Stripe webhooks?","options":["Webhooks are sent exactly once","Your endpoint processes the same event safely multiple times without creating duplicates","Stripe encrypts all webhook payloads","Webhooks require authentication"],"correct":1,"explanation":"Stripe may retry webhooks due to network issues. Idempotency means your handler produces the same result whether it runs once or ten times — store the Stripe event ID and skip if already processed."},{"q":"You run the pre-launch script and it fails on step 1. What happened?","options":["The build failed","A secret key was found with a NEXT_PUBLIC_ prefix in your source code — it would be exposed to browsers","The health endpoint is down","RLS is not enabled"],"correct":1,"explanation":"Step 1 greps for NEXT_PUBLIC_.*SERVICE_ROLE and NEXT_PUBLIC_.*SECRET in your src/ directory. A match means a secret key is prefixed with NEXT_PUBLIC_ and would be exposed in the browser bundle. Fix: remove the prefix and move the variable to server-side only."},{"q":"After switching from test to live Stripe keys, what must you also update?","options":["The Supabase URL","The webhook signing secret — live and test endpoints have different signing secrets","The Vercel project ID","The CORS headers"],"correct":1,"explanation":"Stripe issues different signing secrets for test and live webhook endpoints. If you switch to live keys but keep the test webhook secret, signature verification will fail on every live event. Update STRIPE_WEBHOOK_SECRET in your environment variables."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Launch Checklist Flashcards","cards":[{"front":"What is tree-shaking and why does it matter for performance?","back":"Tree-shaking automatically removes unused code from your JavaScript bundle during build. Smaller bundles mean faster page loads. Check bundle size with next build — aim for under 100KB for first load JS."},{"front":"How do you verify Stripe webhook signatures and why?","back":"Call stripe.webhooks.constructEvent(body, sig, secret) with your webhook signing secret. This prevents fake events — anyone can POST to your endpoint, but only Stripe can produce a valid signature."},{"front":"What should happen when a payment fails on your site?","back":"Redirect to a helpful error page with a retry option. Never leave users on a blank page or generic Stripe error. Set the cancel_url parameter in your checkout session to control where failed/cancelled payments land."},{"front":"What is the Stripe test card number?","back":"4242 4242 4242 4242 with any future expiry date and any CVC. This card always succeeds in test mode. Use 4000 0000 0000 0002 to test a declined payment."},{"front":"Name the 4 categories of the launch checklist and their focus.","back":"Security (5 items): secrets, RLS, webhook signatures, CORS, git history. Performance (5): bundle size, images, indexes, caching, cold starts. UX (5): error states, mobile, cancel URL, loading states, confirmations. Revenue (5): test payments, webhooks, email capture, live keys, notifications."},{"front":"Why run a smoke test AFTER deploying, not just before?","back":"The build can succeed but the deployed app can still fail — missing environment variables in Vercel, DNS issues, edge function cold starts, or CORS misconfigurations only appear in the production environment. Post-deploy smoke tests catch these."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 10 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
