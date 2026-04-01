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

<div data-learn="FlashDeck" data-props='{"title":"Stack Anatomy Flashcards","cards":[{"front":"What is Supabase and why is it the foundation layer?","back":"Supabase is Postgres with superpowers — it bundles database, auth, edge functions, real-time subscriptions, file storage, and pgvector for AI embeddings in one platform. Fewer services means less integration complexity."},{"front":"What does pgvector enable in an AI stack?","back":"pgvector is a Postgres extension that stores high-dimensional vectors (AI embeddings). It enables semantic search — finding database entries by meaning rather than exact keyword match, which is foundational for AI memory and RAG."},{"front":"Why pair Next.js with Vercel?","back":"Vercel built Next.js, so deployment is seamless — auto-deploys from GitHub, global CDN, edge rendering, and zero-config. It\\\'s the fastest path from code push to live site."},{"front":"What role does Claude play in the AI stack?","back":"Claude is the intelligence layer — it handles reasoning, text generation, code writing, and complex decision-making. It integrates cleanly from serverless environments like Supabase Edge Functions."},{"front":"What does Make.com do in the stack?","back":"Make.com is the visual automation glue — it connects services that don\\\'t have direct API integrations. You build workflows by dragging modules (Slack alerts, spreadsheet logging, email triggers) without writing code."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Stack Anatomy Quiz","questions":[{"q":"Which combination gives the highest compatibility score for an AI-powered web app?","options":["Firebase + Express + ChatGPT + React + Netlify","Supabase + Edge Functions + Claude + Next.js + Vercel","PlanetScale + FastAPI + Gemini + Astro + Railway","Firebase + FastAPI + Claude + Next.js + Vercel"],"correct":1,"explanation":"Supabase + Edge Functions + Claude + Next.js + Vercel is the battle-tested combination for AI apps. Each layer is purpose-built to work with the others — Supabase Edge runs Deno natively, Next.js deploys perfectly on Vercel, and Claude integrates cleanly from serverless environments."},{"q":"Why is Supabase recommended as the database layer for AI stacks?","options":["It is the cheapest option available","It bundles Postgres, Auth, Edge Functions, Realtime, and pgvector in one platform","It requires no configuration","It is built on Firebase"],"correct":1,"explanation":"Supabase is Postgres with superpowers — one platform covers database, auth, serverless functions, real-time subscriptions, file storage, and pgvector for AI embeddings. Fewer services means less integration complexity and lower costs."},{"q":"What does pgvector enable in a Supabase-backed AI app?","options":["Faster SQL queries","Storing and searching AI embeddings for semantic similarity","Automatic database backups","Real-time websocket connections"],"correct":1,"explanation":"pgvector is a Postgres extension that stores high-dimensional vectors (AI embeddings). This enables semantic search — finding database entries by meaning rather than exact keyword match, which is foundational for AI memory systems and RAG pipelines."}]}'></div>


<div data-learn="SortStack" data-props='{"title":"Stack Layers in Order","instruction":"Arrange these layers from infrastructure (bottom) to user-facing (top)","items":["Database (Supabase)","Backend logic (Edge Functions)","AI model (Claude)","Frontend framework (Next.js)","Deploy platform (Vercel)"]}'></div>

</div>
