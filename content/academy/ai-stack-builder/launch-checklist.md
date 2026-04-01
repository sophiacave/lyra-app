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
