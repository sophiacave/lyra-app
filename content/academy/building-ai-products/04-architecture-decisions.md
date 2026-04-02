---
title: "Architecture Decisions"
course: "building-ai-products"
order: 4
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/building-ai-products/">Building AI Products</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Architecture Decisions</h1>
  <p><span class="accent">Choose boring infrastructure. Save your creativity for the product.</span></p>
  <p>The models, APIs, and databases you pick on day one will either accelerate you or haunt you for years. Choose wisely.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>How to choose between APIs, open-source models, and fine-tuning</li>
    <li>The cost/quality/speed triangle for AI infrastructure</li>
    <li>When to use RAG vs. fine-tuning vs. prompt engineering</li>
    <li>Building for model-agnosticism from day one</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Decision</span>
  <h2 class="section-title">API vs. Open Source vs. Fine-Tuned</h2>
  <p class="section-text"><strong>APIs (Claude, GPT, Gemini):</strong> Start here. Fastest time to market. Highest quality for general tasks. You pay per token but you ship in days, not months. The tradeoff: you're dependent on someone else's model, pricing, and uptime.</p>
  <p class="section-text"><strong>Open source (Llama, Mistral):</strong> Lower per-query cost at scale. Full control. But you own the infrastructure — hosting, scaling, monitoring. Don't go here until you have product-market fit and predictable traffic.</p>
  <p class="section-text"><strong>Fine-tuned models:</strong> Only when you have domain-specific data that general models can't match. Fine-tuning is expensive, requires clean data, and locks you to a specific model version. It's a phase 2 optimization, never a phase 1 choice.</p>
</div>

<div class="demo-container">
  <h3>The Cost/Quality/Speed Triangle</h3>
  <p><strong style="color: var(--purple);">API (Claude/GPT):</strong> High quality, high speed, higher cost per query</p>
  <p><strong style="color: var(--blue);">Open Source (Llama):</strong> Good quality, moderate speed, low cost at scale (but high infra cost)</p>
  <p><strong style="color: var(--green);">Fine-Tuned:</strong> Best quality for your domain, slow to set up, medium ongoing cost</p>
  <p><strong style="color: var(--orange);">Embeddings + RAG:</strong> Good quality with your data, fast queries, lowest cost</p>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">RAG vs. Fine-Tuning vs. Prompting</h2>
  <p class="section-text"><strong>Prompt engineering</strong> is your first tool. A well-crafted system prompt with examples can handle 80% of use cases. It's free to iterate, instant to deploy, and easy to debug. Exhaust this before moving on.</p>
  <p class="section-text"><strong>RAG (Retrieval-Augmented Generation)</strong> is for when the model needs your data — product docs, knowledge bases, user history. Store your data as embeddings, retrieve relevant chunks at query time, and feed them to the model as context. This is the sweet spot for most products.</p>
  <p class="section-text"><strong>Fine-tuning</strong> is for when you need the model to behave differently at a fundamental level — a specific tone, a specialized vocabulary, a unique reasoning pattern. It's powerful but expensive and hard to iterate on.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Principle</span>
  <h2 class="section-title">Build Model-Agnostic From Day One</h2>
  <p class="section-text">Never hard-wire your product to a single AI provider. Abstract your model calls behind a clean interface. Today you use Claude. Tomorrow GPT-5 drops and it's better for your use case. Next month an open-source model matches quality at a tenth of the cost.</p>
  <p class="section-text">Your architecture should let you swap models with a config change, not a rewrite. Store prompts as templates. Keep model-specific code in a thin adapter layer. Your business logic should never know or care which model generated the response.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Architecture Decisions — Key Concepts","cards":[{"front":"API-First (Claude, GPT, Gemini)","back":"Start here. Fastest time to market, highest general quality. You pay per token but ship in days. Tradeoff: dependent on someone else\\\'s model, pricing, and uptime."},{"front":"RAG (Retrieval-Augmented Generation)","back":"Store your data as embeddings, retrieve relevant chunks at query time, feed to model as context. Sweet spot for most products that need the model to know your data."},{"front":"Model-Agnostic Architecture","back":"Abstract model calls behind a clean interface. Store prompts as templates. Keep model-specific code in a thin adapter layer. Swap models with a config change, not a rewrite."},{"front":"The Starter Stack","back":"Frontend + backend with auth/billing (Supabase) + AI API (Claude/GPT) + vector database (pgvector). Four components. Ship fast, optimize later."},{"front":"Fine-Tuning","back":"Only when you have domain-specific data general models can\\\'t match. Expensive, requires clean data, locks you to a model version. Phase 2 optimization, never phase 1."}]}'></div>
</div>

<div class="lesson-section">
</div>

<div class="lesson-section">
  <span class="section-label">Practical</span>
  <h2 class="section-title">The Starter Stack</h2>
  <p class="section-text">For most AI products on day one: a frontend (Next.js, Svelte, or even a static site), a backend that handles auth and billing (Supabase, Firebase), an AI API (Claude or GPT), and a vector database for RAG (pgvector, Pinecone). That's it. Four components. Ship fast, optimize later.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Map your product's architecture using this decision tree:</p>
  <div class="prompt-box"><code>1. Does the model need my data? → Yes: RAG. No: Prompt engineering.
2. Does it need a unique behavior? → Yes: Consider fine-tuning. No: Stay with prompts.
3. Do I need &lt;100ms response? → Yes: Consider open source. No: APIs are fine.
4. Am I spending &gt;$500/mo on API calls? → Yes: Evaluate open source. No: Stay with APIs.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Architecture Decisions Quiz","questions":[{"q":"When should you choose to fine-tune a model?","options":["For every AI product from day one","As a phase 2 optimization when you have domain-specific data that general models cannot match and product-market fit is proven","To save money on API costs","When you want faster response times"],"correct":1,"explanation":"Fine-tuning is expensive, requires clean data, locks you to a specific model version, and is hard to iterate on. It’s a phase 2 optimization for when you have the data and PMF to justify it — never a phase 1 choice."},{"q":"Why should you build model-agnostic from day one?","options":["It is easier to build","Today you use Claude; tomorrow GPT-5 drops, or an open-source model matches quality at 1/10th the cost — a config change should swap models, not a rewrite","All models produce the same results","It is required for production apps"],"correct":1,"explanation":"The AI model landscape changes rapidly. Abstracting your model calls behind a clean interface means you can swap providers as the market evolves without rebuilding your business logic."},{"q":"What is the starter stack recommended for most AI products on day one?","options":["AWS + Kubernetes + custom model infrastructure","Frontend, backend with auth and billing, one AI API, and a vector database for RAG — four components, ship fast","Only one AI API — no database needed","Full microservices architecture with multiple AI providers"],"correct":1,"explanation":"Complexity on day one kills velocity. A frontend, Supabase for auth and storage, one AI API, and pgvector for RAG covers 90% of what you need at launch. Optimize later when you have real usage data."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/building-ai-products/validation-and-prototyping/" class="prev">&larr; Previous: Validation and Prototyping</a>
  <a href="/academy/building-ai-products/building-the-mvp/" class="next">Next: Building the MVP &rarr;</a>
</nav>

</div>
