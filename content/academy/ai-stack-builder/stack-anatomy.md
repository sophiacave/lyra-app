---
title: "Stack Anatomy"
course: "ai-stack-builder"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Stack Anatomy</h1>
  <p class="sub">The layers of a modern AI-powered web app — and the battle-tested stack that runs Like One Academy.</p>
</div>

<div class="content">

<div class="card">
<h2>Why Your Stack Choice Matters</h2>
<p>Building an AI-powered web app is not about picking the trendiest tools. It is about choosing layers that work together seamlessly, scale without surprises, and do not drain your budget before you have your first customer. The wrong stack creates integration hell — spending weeks wiring services together instead of building features.</p>

<p>The right stack gives you <strong style="color:#e5e5e5">fewer services, less glue code, and more time building the product that matters</strong>. This lesson reveals the exact architecture that powers Like One Academy in production — 30 courses, 300+ lessons, AI memory, Stripe payments, global CDN, all for about $29/month.</p>
</div>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin:1rem 0">
<h4 style="color:#c084fc;margin:0 0 .5rem">The Like One Stack (Battle-Tested)</h4>
<p style="font-size:.88rem;color:#e5e5e5;margin:0"><strong>Supabase + Edge Functions + Claude + Next.js + Vercel</strong></p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0">~$29/mo total. This is what Like One Academy runs on in production — 30 courses, 300+ lessons, AI memory, Stripe payments, and global CDN. Every layer below is explained with the real config we use.</p>
</div>

<div class="card">
<h2>The Five Layers of an AI-Powered App</h2>
<p>Every AI web app has the same fundamental architecture — five layers that work together. Understanding what each layer does and why you need it prevents the most common mistake: over-engineering early and under-engineering late.</p>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.8rem">1</div>
<div>
<strong style="color:#34d399;font-size:.88rem">Frontend — What Users See</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Our choice: Next.js 14 on Vercel.</strong> Server-side rendering for SEO, client-side interactivity where needed, auto-deploys from GitHub. App Router + Server Components mean your pages load fast and search engines can index everything. Vercel built Next.js — the deployment experience is zero-config.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#8b5cf6;font-size:.8rem">2</div>
<div>
<strong style="color:#8b5cf6;font-size:.88rem">Backend — Serverless Logic</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Our choice: Supabase Edge Functions (Deno).</strong> TypeScript functions that run globally, close to users. No servers to manage. They handle email capture, payment processing, AI queries — anything that needs server-side secrets or database access. Think of them as the nervous system connecting your frontend to everything else.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(251,146,60,.04);border-radius:10px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(251,146,60,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fb923c;font-size:.8rem">3</div>
<div>
<strong style="color:#fb923c;font-size:.88rem">Database — Where Data Lives</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Our choice: Supabase (Postgres + pgvector).</strong> Not just a database — it bundles auth, real-time subscriptions, file storage, and Row Level Security (RLS) in one platform. pgvector enables semantic search with AI embeddings, so your app can find things by meaning, not just keywords. One service replaces five.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(244,114,182,.04);border-radius:10px;border:1px solid rgba(244,114,182,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(244,114,182,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#f472b6;font-size:.8rem">4</div>
<div>
<strong style="color:#f472b6;font-size:.88rem">AI Layer — Intelligence</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Our choice: Claude (Anthropic) + BGE-small embeddings (HuggingFace).</strong> Claude handles reasoning and generation — the brain of your app. BGE-small creates embeddings for free via HuggingFace Inference API, which get stored in pgvector for semantic search. The two-tier approach means you only call the expensive model when you actually need reasoning.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(56,189,248,.04);border-radius:10px;border:1px solid rgba(56,189,248,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(56,189,248,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#38bdf8;font-size:.8rem">5</div>
<div>
<strong style="color:#38bdf8;font-size:.88rem">Automation — The Glue</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Our choice: Make.com + Stripe webhooks.</strong> Make.com connects services that do not have direct integrations — Slack alerts when someone subscribes, spreadsheet logging for analytics, scheduled content publishing. Stripe webhooks handle payment events. Together, they make data flow between services without writing custom code for every connection.</p>
</div>
</div>
</div>
</div>

<div class="card">
<h2>The Full Architecture Config</h2>
<p>Here is the actual architecture in config format — this is the real stack running Like One Academy:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">YAML — Full-stack AI app architecture overview</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># stack-config.yaml — The anatomy of an AI-powered web app</span>

<span style="color:#c084fc">deploy</span>:
  <span style="color:#c084fc">platform</span>: <span style="color:#fb923c">Vercel</span>          <span style="color:#71717a"># Auto-deploys from GitHub</span>
  <span style="color:#c084fc">domain</span>:   <span style="color:#fb923c">your-app.com</span>
  <span style="color:#c084fc">regions</span>:  [<span style="color:#fb923c">iad1</span>, <span style="color:#fb923c">sfo1</span>]    <span style="color:#71717a"># Edge-close to users</span>

<span style="color:#c084fc">frontend</span>:
  <span style="color:#c084fc">framework</span>: <span style="color:#fb923c">Next.js 14</span>      <span style="color:#71717a"># App Router + Server Components</span>
  <span style="color:#c084fc">styling</span>:   <span style="color:#fb923c">Tailwind CSS</span>
  <span style="color:#c084fc">auth_ui</span>:   <span style="color:#fb923c">@supabase/auth-ui-react</span>

<span style="color:#c084fc">backend</span>:
  <span style="color:#c084fc">runtime</span>:    <span style="color:#fb923c">Supabase Edge Functions</span>  <span style="color:#71717a"># Deno, globally distributed</span>
  <span style="color:#c084fc">language</span>:   <span style="color:#fb923c">TypeScript</span>
  <span style="color:#c084fc">functions</span>:
    - <span style="color:#fb923c">subscribe</span>       <span style="color:#71717a"># Email capture</span>
    - <span style="color:#fb923c">create-checkout</span> <span style="color:#71717a"># Stripe payment</span>
    - <span style="color:#fb923c">brain-query</span>     <span style="color:#71717a"># AI memory retrieval</span>

<span style="color:#c084fc">database</span>:
  <span style="color:#c084fc">provider</span>:    <span style="color:#fb923c">Supabase (Postgres)</span>
  <span style="color:#c084fc">extensions</span>:  [<span style="color:#fb923c">pgvector</span>, <span style="color:#fb923c">pg_trgm</span>]
  <span style="color:#c084fc">auth</span>:        <span style="color:#fb923c">Supabase Auth + RLS</span>    <span style="color:#71717a"># JWT-based row security</span>
  <span style="color:#c084fc">realtime</span>:    <span style="color:#fb923c">true</span>                   <span style="color:#71717a"># Live subscriptions</span>

<span style="color:#c084fc">ai</span>:
  <span style="color:#c084fc">model</span>:       <span style="color:#fb923c">Claude (Anthropic)</span>     <span style="color:#71717a"># Reasoning + generation</span>
  <span style="color:#c084fc">embeddings</span>:  <span style="color:#fb923c">BGE-small (HuggingFace)</span> <span style="color:#71717a"># Free vector embeddings</span>
  <span style="color:#c084fc">vector_db</span>:   <span style="color:#fb923c">pgvector</span>              <span style="color:#71717a"># Semantic search in Postgres</span>

<span style="color:#c084fc">cost</span>:
  <span style="color:#c084fc">total</span>: <span style="color:#fb923c">~$29/month</span>
  <span style="color:#c084fc">breakdown</span>:
    <span style="color:#c084fc">supabase</span>: <span style="color:#fb923c">$25</span>   <span style="color:#71717a"># Pro plan (DB + Auth + Functions)</span>
    <span style="color:#c084fc">vercel</span>:   <span style="color:#fb923c">$0</span>    <span style="color:#71717a"># Hobby tier for most projects</span>
    <span style="color:#c084fc">claude</span>:   <span style="color:#fb923c">~$4</span>   <span style="color:#71717a"># Pay-per-token, varies with usage</span></code></pre>
</div>
</div>

<div class="card">
<h2>Why This Stack (And Not Firebase, AWS, or Django)</h2>
<p>There are many ways to build a web app. Here is why we chose this specific combination — and when you might choose differently:</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Alternative</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">When It Wins</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Why We Did Not Choose It</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Firebase</td>
<td style="padding:.75rem">Mobile-first apps, real-time features, Google ecosystem integration</td>
<td style="padding:.75rem">NoSQL (Firestore) is painful for relational data. No pgvector equivalent. Vendor lock-in with Google.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">AWS (Lambda + RDS)</td>
<td style="padding:.75rem">Enterprise scale, existing AWS infrastructure, complex microservices</td>
<td style="padding:.75rem">Requires 10+ services to replicate what Supabase does in one. IAM complexity. Cold starts. Overkill for most indie/startup projects.</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Django + Railway</td>
<td style="padding:.75rem">Python-heavy teams, data science pipelines, admin-heavy apps</td>
<td style="padding:.75rem">Monolithic architecture. Harder to scale serverlessly. Slower iteration cycle than edge functions.</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">FastAPI + PlanetScale</td>
<td style="padding:.75rem">Python API backends, MySQL-preferred teams</td>
<td style="padding:.75rem">PlanetScale lacks pgvector, auth, and edge functions. You end up stitching 5 services together yourself.</td>
</tr>
</tbody>
</table>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:1rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">The core principle:</strong> Choose the stack that gives you the <strong style="color:#34d399">fewest services to manage</strong> and the <strong style="color:#34d399">fastest path to a working product</strong>. Supabase replaces 5 services (database, auth, functions, real-time, vector search). Vercel replaces your entire deployment pipeline. Claude replaces an ML team. The result: more building, less wiring.
</div>
</div>

<div class="card">
<h2>How the Layers Talk to Each Other</h2>
<p>Understanding data flow is more important than understanding any individual service. Here is how a request moves through the stack when a user subscribes:</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> User clicks "Subscribe" → <strong style="color:#e5e5e5">Next.js</strong> (frontend) sends a POST request</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> POST hits → <strong style="color:#e5e5e5">Supabase Edge Function</strong> (subscribe) at the nearest edge location</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> Edge function inserts email → <strong style="color:#e5e5e5">Supabase Postgres</strong> (subscribers table)</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> Edge function calls → <strong style="color:#e5e5e5">Resend API</strong> (sends welcome email)</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> Supabase database trigger fires → <strong style="color:#e5e5e5">Make.com webhook</strong> (sends Slack notification)</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">6.</span> Edge function returns "success" → <strong style="color:#e5e5e5">Next.js</strong> shows confirmation to user</div>
</div>

<p style="margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:1.7">Total time: under 500ms. Six services coordinated in half a second. That is the power of choosing services that are designed to work together at the edge.</p>
</div>

<div class="card">
<h2>Cost Breakdown: $29/Month for a Production App</h2>
<p>One of the most common reasons AI projects die: the infrastructure bill exceeds the revenue. This stack is deliberately optimized for indie developers and small teams who need to ship a real product without burning through savings.</p>

<div style="display:grid;gap:.5rem;margin-top:1rem">
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div><strong style="color:#8b5cf6;font-size:.85rem">Supabase Pro</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Database + Auth + Edge Functions + Real-time + pgvector</span></div>
<strong style="color:#e5e5e5;font-size:.88rem">$25/mo</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div><strong style="color:#34d399;font-size:.85rem">Vercel Hobby</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Frontend hosting + CDN + auto-deploy + SSL</span></div>
<strong style="color:#e5e5e5;font-size:.88rem">$0/mo</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div><strong style="color:#fb923c;font-size:.85rem">Claude API</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">Pay-per-token, varies with usage</span></div>
<strong style="color:#e5e5e5;font-size:.88rem">~$4/mo</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(244,114,182,.04);border-radius:8px;border:1px solid rgba(244,114,182,.08)">
<div><strong style="color:#f472b6;font-size:.85rem">Make.com Free</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">1,000 operations/month</span></div>
<strong style="color:#e5e5e5;font-size:.88rem">$0/mo</strong>
</div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:rgba(56,189,248,.04);border-radius:8px;border:1px solid rgba(56,189,248,.08)">
<div><strong style="color:#38bdf8;font-size:.85rem">HuggingFace Inference</strong><span style="font-size:.78rem;color:#71717a;margin-left:.5rem">BGE-small embeddings</span></div>
<strong style="color:#e5e5e5;font-size:.88rem">$0/mo</strong>
</div>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Scaling math:</strong> This stack handles 10,000+ monthly active users without upgrading. When you outgrow it, Supabase Pro scales to enterprise. Vercel Pro is $20/mo. Claude costs scale linearly with usage. You will not hit a cost cliff — the pricing grows with your revenue.
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="FlashDeck" data-props='{"title":"Stack Anatomy Flashcards","cards":[{"front":"What is Supabase and why is it the foundation layer?","back":"Supabase is Postgres with superpowers — it bundles database, auth, edge functions, real-time subscriptions, file storage, and pgvector for AI embeddings in one platform. Fewer services means less integration complexity."},{"front":"What does pgvector enable in an AI stack?","back":"pgvector is a Postgres extension that stores high-dimensional vectors (AI embeddings). It enables semantic search — finding database entries by meaning rather than exact keyword match, which is foundational for AI memory and RAG."},{"front":"Why pair Next.js with Vercel?","back":"Vercel built Next.js, so deployment is seamless — auto-deploys from GitHub, global CDN, edge rendering, and zero-config. It is the fastest path from code push to live site."},{"front":"What role does Claude play in the AI stack?","back":"Claude is the intelligence layer — it handles reasoning, text generation, code writing, and complex decision-making. It integrates cleanly from serverless environments like Supabase Edge Functions."},{"front":"What does Make.com do in the stack?","back":"Make.com is the visual automation glue — it connects services that do not have direct API integrations. You build workflows by dragging modules (Slack alerts, spreadsheet logging, email triggers) without writing code."},{"front":"Two-Tier AI Strategy","back":"Use free embeddings (BGE-small via HuggingFace) for semantic search and retrieval. Only call Claude (paid) when you actually need reasoning or generation. This keeps AI costs under $5/month for most apps."},{"front":"Why not Firebase?","back":"NoSQL (Firestore) is painful for relational data. No pgvector equivalent for AI embeddings. Vendor lock-in with Google. Supabase gives you Postgres (the most versatile database) with all the Firebase conveniences built in."}]}'></div>
</div>

<div data-learn="QuizMC" data-props='{"title":"Stack Anatomy — Mastery Check","questions":[{"q":"Which combination gives the highest compatibility score for an AI-powered web app?","options":["Firebase + Express + ChatGPT + React + Netlify","Supabase + Edge Functions + Claude + Next.js + Vercel","PlanetScale + FastAPI + Gemini + Astro + Railway","AWS Lambda + RDS + GPT-4 + React + S3"],"correct":1,"explanation":"Supabase + Edge Functions + Claude + Next.js + Vercel is the battle-tested combination for AI apps. Each layer is purpose-built to work with the others — Supabase Edge runs Deno natively, Next.js deploys perfectly on Vercel, and Claude integrates cleanly from serverless environments."},{"q":"Why is Supabase recommended over Firebase for AI-powered stacks?","options":["Supabase is cheaper","Supabase bundles Postgres, Auth, Edge Functions, Realtime, and pgvector in one platform — and Postgres is better than Firestore for relational data and AI embeddings","Supabase has more features","Firebase does not support serverless functions"],"correct":1,"explanation":"Supabase gives you a real Postgres database (relational queries, pgvector for embeddings, full SQL) plus all the convenience features Firebase offers (auth, real-time, functions). Firestore NoSQL lacks vector search and makes relational queries painful."},{"q":"Why does the stack use free BGE-small embeddings instead of calling Claude for everything?","options":["BGE-small is more accurate than Claude","Using free embeddings for search and retrieval, then only calling Claude for reasoning, keeps AI costs under $5/month — the two-tier approach matches cost to capability","Claude cannot generate embeddings","BGE-small is faster in all cases"],"correct":1,"explanation":"Embeddings are a commodity — free models like BGE-small work great for semantic search. Claude is expensive but powerful for reasoning and generation. The two-tier approach means you only pay for the expensive model when you actually need its capabilities."},{"q":"A user subscribes on your site. How many services are involved in the full flow?","options":["Two — frontend and database","Four — Next.js, Edge Function, Supabase, Resend","Six — Next.js, Edge Function, Supabase, Resend, Make.com (Slack notification), and the response back to Next.js","Three — frontend, API, and database"],"correct":2,"explanation":"The full subscribe flow touches six services: Next.js sends the request, the Edge Function processes it, Supabase stores the email, Resend sends the welcome email, Make.com fires a Slack notification via webhook, and the Edge Function returns success to Next.js. All in under 500ms."},{"q":"What is the total monthly cost to run a production AI-powered web app on this stack?","options":["About $100/month","About $29/month — Supabase Pro ($25) + Claude API (~$4) + free tiers for Vercel, Make.com, and HuggingFace","About $50/month","It depends entirely on traffic — there is no predictable base cost"],"correct":1,"explanation":"The base cost is remarkably low: Supabase Pro at $25/month covers database, auth, functions, and vector search. Claude API costs about $4/month at moderate usage. Vercel Hobby, Make.com Free, and HuggingFace Inference are all $0. Total: ~$29/month for a production app."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 1 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
