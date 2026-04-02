---
title: "Launch Checklist"
course: "ai-stack-builder"
order: 10
type: "lesson"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 10 of 10</span>

</div>

<div class="lesson-badge">MODULE 3 &middot; 260 XP</div>
<h1>Launch Checklist</h1>
<p class="intro">Before you ship, run through every item. 20 checks across 4 categories. Miss one, and your launch could stumble. Check them all for the full celebration.</p>

<div style="background:#111118;border:1px solid #f59e0b33;border-radius:12px;padding:1.5rem;margin:1.5rem 0">
<p style="color:#f59e0b;font-weight:700;font-size:.9rem;margin-bottom:.75rem">Before you start</p>
<p style="font-size:.9rem;color:#ccc;margin-bottom:.75rem">This checklist assumes you've completed the previous 9 lessons. Each item connects back to skills you've already learned. If anything feels unfamiliar, revisit the lesson where it was covered.</p>
<p style="font-size:.85rem;color:#999;margin-bottom:0"><strong style="color:#ccc">Jargon cheat sheet:</strong></p>
<ul style="list-style:none;padding:0;margin:.5rem 0 0 0;font-size:.82rem;color:#999;line-height:2">
<li><strong style="color:#f59e0b">RLS (Row Level Security)</strong> — database rules that control who can read/write each row. Like a bouncer for your data.</li>
<li><strong style="color:#f59e0b">CORS (Cross-Origin Resource Sharing)</strong> — browser security that controls which websites can call your API. Prevents strangers from using your backend.</li>
<li><strong style="color:#f59e0b">Tree-shaking</strong> — automatically removing unused code from your final bundle, so users download less JavaScript.</li>
<li><strong style="color:#f59e0b">Cache-Control</strong> — an HTTP header that tells browsers how long to keep a copy of a file before re-downloading it.</li>
<li><strong style="color:#f59e0b">Indexes</strong> — a database optimization (like a book's index) that makes lookups fast instead of scanning every row.</li>
</ul>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Bash — Pre-launch verification script</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">#!/bin/bash</span>
<span style="color:#71717a"># pre-launch.sh — Run before every deploy</span>
<span style="color:#c084fc">set</span> -e

<span style="color:#34d399">echo</span> <span style="color:#fb923c">"=== PRE-LAUNCH VERIFICATION ==="</span>

<span style="color:#71717a"># 1. Check for exposed secrets in frontend code</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[1/6] Scanning for leaked secrets..."</span>
<span style="color:#c084fc">if</span> grep -r <span style="color:#fb923c">"NEXT_PUBLIC_.*SERVICE_ROLE\|NEXT_PUBLIC_.*SECRET"</span> ./src; <span style="color:#c084fc">then</span>
  <span style="color:#34d399">echo</span> <span style="color:#fb923c">"FAIL: Secret key exposed with NEXT_PUBLIC_ prefix!"</span>
  <span style="color:#c084fc">exit</span> <span style="color:#fb923c">1</span>
<span style="color:#c084fc">fi</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"  No secrets in frontend code."</span>

<span style="color:#71717a"># 2. Verify environment variables exist</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[2/6] Checking env vars..."</span>
<span style="color:#c084fc">for</span> var <span style="color:#c084fc">in</span> SUPABASE_URL SUPABASE_ANON_KEY STRIPE_SECRET_KEY; <span style="color:#c084fc">do</span>
  <span style="color:#c084fc">if</span> [ -z <span style="color:#fb923c">"${!var}"</span> ]; <span style="color:#c084fc">then</span>
    <span style="color:#34d399">echo</span> <span style="color:#fb923c">"FAIL: $var is not set"</span>; <span style="color:#c084fc">exit</span> <span style="color:#fb923c">1</span>
  <span style="color:#c084fc">fi</span>
<span style="color:#c084fc">done</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"  All required env vars present."</span>

<span style="color:#71717a"># 3. Run build and check bundle size</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[3/6] Building and checking bundle..."</span>
npm run build <span style="color:#fb923c">2>&1</span> | tail -n <span style="color:#fb923c">5</span>

<span style="color:#71717a"># 4. Verify Supabase RLS is enabled</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[4/6] Checking RLS on all tables..."</span>
supabase db lint --level warning

<span style="color:#71717a"># 5. Test the health endpoint</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[5/6] Testing health endpoint..."</span>
STATUS=$(<span style="color:#34d399">curl</span> -s -o /dev/null -w <span style="color:#fb923c">"%{http_code}"</span> https://your-app.vercel.app/api/health)
<span style="color:#c084fc">if</span> [ <span style="color:#fb923c">"$STATUS"</span> != <span style="color:#fb923c">"200"</span> ]; <span style="color:#c084fc">then</span>
  <span style="color:#34d399">echo</span> <span style="color:#fb923c">"FAIL: Health endpoint returned $STATUS"</span>; <span style="color:#c084fc">exit</span> <span style="color:#fb923c">1</span>
<span style="color:#c084fc">fi</span>

<span style="color:#71717a"># 6. Verify Stripe webhook endpoint</span>
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"[6/6] Checking Stripe webhook..."</span>
stripe listen --print-json 2>/dev/null &
<span style="color:#34d399">echo</span> <span style="color:#fb923c">"  Webhook listener active."</span>

<span style="color:#34d399">echo</span> <span style="color:#fb923c">"=== ALL CHECKS PASSED — READY TO SHIP ==="</span>
</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">JavaScript — Post-deploy smoke test</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// smoke-test.mjs — Run after every deploy</span>
<span style="color:#c084fc">const</span> BASE = <span style="color:#fb923c">'https://your-app.vercel.app'</span>

<span style="color:#c084fc">const</span> tests = [
  { name: <span style="color:#fb923c">'Homepage loads'</span>,       url: <span style="color:#fb923c">'/'</span>,            expect: <span style="color:#fb923c">200</span> },
  { name: <span style="color:#fb923c">'API health'</span>,           url: <span style="color:#fb923c">'/api/health'</span>,   expect: <span style="color:#fb923c">200</span> },
  { name: <span style="color:#fb923c">'Auth endpoint'</span>,        url: <span style="color:#fb923c">'/api/auth'</span>,     expect: <span style="color:#fb923c">401</span> },
  { name: <span style="color:#fb923c">'Stripe webhook'</span>,       url: <span style="color:#fb923c">'/api/webhook'</span>,  expect: <span style="color:#fb923c">405</span> },
  { name: <span style="color:#fb923c">'CORS headers present'</span>, url: <span style="color:#fb923c">'/api/health'</span>,   header: <span style="color:#fb923c">'access-control-allow-origin'</span> },
]

<span style="color:#c084fc">for</span> (<span style="color:#c084fc">const</span> t <span style="color:#c084fc">of</span> tests) {
  <span style="color:#c084fc">const</span> res = <span style="color:#c084fc">await</span> <span style="color:#34d399">fetch</span>(<span style="color:#fb923c">`<span style="color:#c084fc">${</span>BASE<span style="color:#c084fc">}</span><span style="color:#c084fc">${</span>t.url<span style="color:#c084fc">}</span>`</span>)
  <span style="color:#c084fc">const</span> pass = t.header
    ? res.headers.<span style="color:#34d399">has</span>(t.header)
    : res.status === t.expect
  console.<span style="color:#34d399">log</span>(<span style="color:#fb923c">`<span style="color:#c084fc">${</span>pass ? <span style="color:#fb923c">'PASS'</span> : <span style="color:#fb923c">'FAIL'</span><span style="color:#c084fc">}</span>  <span style="color:#c084fc">${</span>t.name<span style="color:#c084fc">}</span>`</span>)
  <span style="color:#c084fc">if</span> (!pass) process.<span style="color:#34d399">exit</span>(<span style="color:#fb923c">1</span>)
}
console.<span style="color:#34d399">log</span>(<span style="color:#fb923c">'All smoke tests passed.'</span>)
</code></pre>
</div>

<div class="overall-progress">
<div class="big-num" id="bigNum">0</div>
<div class="of-total">of 20 items checked</div>
<div class="overall-bar"><div class="overall-fill" id="overallFill"></div></div>
<div class="cat-progress">
<span class="cat-badge" id="catBadge0">Security 0/5</span>
<span class="cat-badge" id="catBadge1">Performance 0/5</span>
<span class="cat-badge" id="catBadge2">UX 0/5</span>
<span class="cat-badge" id="catBadge3">Revenue 0/5</span>
</div>
</div>

<div id="checklistContainer"></div>

<div class="celebration" id="celebration">
<span class="cel-icon">&#x1f680;</span>
<h2>Ready to Launch!</h2>
<p>All 20 items checked. Your product is ready for the world. Ship it.</p>
<div id="confetti"></div>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress"></div></div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>

<div data-learn="QuizMC" data-props='{"title":"Launch Readiness Quiz","questions":[{"q":"Where do you configure CORS headers for a Supabase edge function?","options":["Supabase Dashboard under Settings","In the edge function code itself as a corsHeaders object","Vercel dashboard under Headers","Namecheap DNS settings"],"correct":1,"explanation":"CORS headers are set directly in your edge function code. There is no dashboard UI — you define the corsHeaders object and include it in every Response you return."},{"q":"What is the risk of leaving NEXT_PUBLIC_ prefix on a Stripe secret key?","options":["It causes a build error","The key is exposed in the browser and anyone can see and use it","It disables tree-shaking","The Stripe API rejects requests"],"correct":1,"explanation":"Variables with NEXT_PUBLIC_ prefix are bundled into the browser JavaScript. Anyone who views source can read them. Secret keys (Stripe, service role) must NEVER use this prefix — they should only exist on the server."},{"q":"What does idempotency mean in the context of Stripe webhooks?","options":["Webhooks are sent exactly once","Your endpoint processes the same event safely multiple times without side effects","Stripe encrypts all webhook payloads","Webhooks require authentication"],"correct":1,"explanation":"Stripe may send the same event multiple times due to network issues. Idempotency means your handler produces the same result whether it runs once or ten times — typically by storing the Stripe event ID and skipping if already processed."}]}'></div>


<div data-learn="FlashDeck" data-props='{"title":"Pre-Launch Flashcards","cards":[{"front":"What is tree-shaking and why does it matter for performance?","back":"Tree-shaking automatically removes unused code from your JavaScript bundle during build. Smaller bundles mean faster page loads. Check bundle size with `next build` — aim for under 100KB for first load JS."},{"front":"How do you verify Stripe webhook signatures and why?","back":"Call stripe.webhooks.constructEvent(body, sig, secret) with your webhook signing secret. This prevents fake events — anyone can POST to your endpoint, but only Stripe can produce a valid signature."},{"front":"What should happen when a payment fails on your site?","back":"Redirect to an error page with a retry option. Never leave users on a blank page or Stripe generic error. Set the cancel_url parameter in your checkout session to control where failed/cancelled payments land."}]}'></div>

</div>
