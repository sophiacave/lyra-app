---
title: "Stack Anatomy"
course: "ai-stack-builder"
order: 1
type: "lesson"
free: true
---<canvas id="confettiCanvas"></canvas>
<div class="container">
  <div class="header">
    <div class="tag">AI Stack Builder — Lesson 1</div>
    <h1>Stack Anatomy</h1>
    <p>Build your perfect AI stack layer by layer. Click to choose, watch it come together.</p>
  </div>

  <div class="progress-bar">
    </div>

  <div class="result-card" id="resultCard">
    <div class="result-title">Your Stack</div>
    <div class="stats-row">
      <div class="stat"><div class="val cost" id="totalCost">$0</div><div class="lbl">Per Month</div></div>
      <div class="stat"><div class="val compat" id="compatScore">0%</div><div class="lbl">Compatibility</div></div>
    </div>
    <div class="faye-stack">
      <h4>The Sophia Stack (Recommended)</h4>
      <p><strong>Supabase + Edge Functions + Claude + Next.js + Vercel</strong> — $29/mo, 95% compatibility. Battle-tested for AI-powered apps. This is what Like One Academy runs on.</p>
    </div>
  </div>

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
    <span style="color:#c084fc">claude</span>:   <span style="color:#fb923c">~$4</span>   <span style="color:#71717a"># Pay-per-token, varies with usage</span>
</code></pre>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Stack Anatomy Flashcards","cards":[{"front":"What is Supabase and why is it the foundation layer?","back":"Supabase is Postgres with superpowers — it bundles database, auth, edge functions, real-time subscriptions, file storage, and pgvector for AI embeddings in one platform. Fewer services means less integration complexity."},{"front":"What does pgvector enable in an AI stack?","back":"pgvector is a Postgres extension that stores high-dimensional vectors (AI embeddings). It enables semantic search — finding database entries by meaning rather than exact keyword match, which is foundational for AI memory and RAG."},{"front":"Why pair Next.js with Vercel?","back":"Vercel built Next.js, so deployment is seamless — auto-deploys from GitHub, global CDN, edge rendering, and zero-config. It\\\'s the fastest path from code push to live site."},{"front":"What role does Claude play in the AI stack?","back":"Claude is the intelligence layer — it handles reasoning, text generation, code writing, and complex decision-making. It integrates cleanly from serverless environments like Supabase Edge Functions."},{"front":"What does Make.com do in the stack?","back":"Make.com is the visual automation glue — it connects services that don\\\'t have direct API integrations. You build workflows by dragging modules (Slack alerts, spreadsheet logging, email triggers) without writing code."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Stack Anatomy Quiz","questions":[{"q":"Which combination gives the highest compatibility score for an AI-powered web app?","options":["Firebase + Express + ChatGPT + React + Netlify","Supabase + Edge Functions + Claude + Next.js + Vercel","PlanetScale + FastAPI + Gemini + Astro + Railway","Firebase + FastAPI + Claude + Next.js + Vercel"],"correct":1,"explanation":"Supabase + Edge Functions + Claude + Next.js + Vercel is the battle-tested combination for AI apps. Each layer is purpose-built to work with the others — Supabase Edge runs Deno natively, Next.js deploys perfectly on Vercel, and Claude integrates cleanly from serverless environments."},{"q":"Why is Supabase recommended as the database layer for AI stacks?","options":["It is the cheapest option available","It bundles Postgres, Auth, Edge Functions, Realtime, and pgvector in one platform","It requires no configuration","It is built on Firebase"],"correct":1,"explanation":"Supabase is Postgres with superpowers — one platform covers database, auth, serverless functions, real-time subscriptions, file storage, and pgvector for AI embeddings. Fewer services means less integration complexity and lower costs."},{"q":"What does pgvector enable in a Supabase-backed AI app?","options":["Faster SQL queries","Storing and searching AI embeddings for semantic similarity","Automatic database backups","Real-time websocket connections"],"correct":1,"explanation":"pgvector is a Postgres extension that stores high-dimensional vectors (AI embeddings). This enables semantic search — finding database entries by meaning rather than exact keyword match, which is foundational for AI memory systems and RAG pipelines."}]}'></div>


<div data-learn="SortStack" data-props='{"title":"Stack Layers in Order","instruction":"Arrange these layers from infrastructure (bottom) to user-facing (top)","items":["Database (Supabase)","Backend logic (Edge Functions)","AI model (Claude)","Frontend framework (Next.js)","Deploy platform (Vercel)"]}'></div>

</div>
