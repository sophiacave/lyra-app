---
title: "Cloud Platforms Overview"
course: "ai-infrastructure"
order: 2
type: "lesson"
free: true
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Cloud Platforms for <span class="accent">AI Applications</span></h1>
  <p class="section-text">AWS, GCP, Azure, Vercel, Supabase — each platform brings different strengths to AI infrastructure. Choosing the right combination saves you months of pain and thousands of dollars.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>What each major cloud platform offers for AI workloads</li>
    <li>When to use hyperscalers vs. modern platforms like Vercel and Supabase</li>
    <li>How to build a multi-platform stack without drowning in complexity</li>
    <li>Real cost comparisons for common AI architectures</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Hyperscalers</span>
  <h2 class="section-title">AWS, GCP, and Azure</h2>
  <p class="section-text">The big three cloud providers offer everything — compute, storage, networking, managed AI services, GPU instances, and hundreds of other services. They're powerful but complex. You can build anything on them, but the learning curve is steep and the billing can surprise you.</p>
  <p class="section-text"><strong>AWS</strong> has the largest ecosystem. SageMaker for ML pipelines, Bedrock for managed LLM access, Lambda for serverless functions. If you need GPU instances at scale, AWS has the most availability.</p>
  <p class="section-text"><strong>GCP</strong> has the deepest AI integration — Vertex AI, TPU access, and tight integration with Google's own models. If you're building on Gemini or need custom model training, GCP is the natural home.</p>
  <p class="section-text"><strong>Azure</strong> owns the OpenAI partnership. Azure OpenAI Service gives you GPT models with enterprise compliance, data residency guarantees, and SLAs that OpenAI's direct API doesn't offer.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Modern Stack</span>
  <h2 class="section-title">Vercel and Supabase</h2>
  <p class="section-text">You don't need a hyperscaler for most AI applications. Modern platforms like Vercel and Supabase handle 90% of what indie developers and small teams need — with dramatically less complexity.</p>
  <p class="section-text"><strong>Vercel</strong> excels at frontend deployment and edge functions. Your AI-powered Next.js app deploys with a git push. Edge functions can handle API orchestration, streaming responses, and lightweight processing — all without managing servers.</p>
  <p class="section-text"><strong>Supabase</strong> gives you PostgreSQL with superpowers: built-in auth, realtime subscriptions, edge functions, and — critically for AI — pgvector for vector similarity search. One platform handles your relational data, your vector embeddings, your auth, and your serverless compute.</p>
  <p class="section-text">This combination (Vercel + Supabase) is what Like One runs on. It's real, it's production-grade, and it costs a fraction of a hyperscaler setup.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Decision Framework</span>
  <h2 class="section-title">Choosing Your Platform</h2>
  <p class="section-text"><strong>Solo developer or small team?</strong> Start with Vercel + Supabase. You'll be in production in hours, not weeks.</p>
  <p class="section-text"><strong>Need custom model training?</strong> Add GCP or AWS for GPU compute. Keep your app layer on Vercel.</p>
  <p class="section-text"><strong>Enterprise compliance requirements?</strong> Azure OpenAI + whatever your org already uses. Don't fight the existing stack.</p>
  <p class="section-text"><strong>Running open-source models?</strong> GPU instances on any hyperscaler, or specialized providers like Replicate, Modal, or RunPod for cheaper GPU access.</p>
  <p class="section-text">The smartest approach: use modern platforms for your app layer and only reach for hyperscalers when you hit a specific capability gap. Don't start complex.</p>
</div>

<div class="demo-container">
  <h3>Platform Comparison at a Glance</h3>
  <p class="section-text"><strong>Vercel:</strong> Frontend, edge functions, streaming — $20/mo pro</p>
  <p class="section-text"><strong>Supabase:</strong> Database, vectors, auth, edge functions — $25/mo pro</p>
  <p class="section-text"><strong>AWS/GCP/Azure:</strong> Everything, including GPU — $50-$5000+/mo depending on usage</p>
  <p class="section-text"><strong>Specialized GPU (Replicate, Modal):</strong> Pay-per-second GPU — $0 idle, scales with usage</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Create free-tier accounts on Vercel and Supabase. Deploy a basic Next.js app to Vercel and connect it to a Supabase database. This is the foundation you'll build on for the rest of the course.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Cloud Platforms — Match Each to Its Strength","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"AWS","right":"Largest ecosystem, SageMaker for ML, Bedrock for LLMs, most GPU availability"},{"left":"GCP","right":"Deepest AI integration, Vertex AI, TPU access, best for Google models"},{"left":"Azure","right":"OpenAI partnership, enterprise compliance, GPT with data residency guarantees"},{"left":"Vercel + Supabase","right":"Best for small teams — frontend edge functions plus PostgreSQL with pgvector, in production in hours"}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Cloud Platforms for AI","cards":[{"front":"AWS for AI","back":"Largest ecosystem — SageMaker for ML pipelines, Bedrock for managed LLM access, Lambda for serverless, most GPU availability."},{"front":"GCP for AI","back":"Deepest AI integration — Vertex AI, TPU access, tight integration with Google\\\'s own models including Gemini."},{"front":"Azure for AI","back":"Owns the OpenAI partnership — GPT models with enterprise compliance, data residency guarantees, and SLAs."},{"front":"Vercel + Supabase","back":"Modern stack for indie devs — frontend edge functions plus PostgreSQL with pgvector. In production in hours, not weeks."},{"front":"When to reach for a hyperscaler","back":"Only when you hit a specific capability gap — custom model training, GPU compute at scale, or enterprise compliance. Don\\\'t start complex."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Start Simple, Scale Intentionally</h2>
  <p class="section-text">The biggest infrastructure mistake in AI is starting too complex. You don't need Kubernetes on day one. You need a deployed app that works. Pick the simplest platform that meets your requirements, build something real, and add complexity only when the simple thing breaks.</p>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Cloud Platforms Quiz","questions":[{"q":"What makes Azure the preferred choice for enterprises with strict compliance requirements?","options":["It is the cheapest option","It offers OpenAI models with enterprise SLAs, data residency guarantees, and compliance frameworks that direct OpenAI APIs don’t provide","It has the most AI services","It is the oldest cloud provider"],"correct":1,"explanation":"Azure’s OpenAI Service partnership gives enterprises GPT access with the compliance, data sovereignty, and SLA guarantees required by regulated industries — which the direct OpenAI API cannot match."},{"q":"Why is Vercel + Supabase a good starting stack for most AI applications?","options":["It is free forever","It handles 90% of AI app needs with dramatically less complexity than hyperscalers, and you can be in production in hours","It scales to any size automatically","It includes built-in AI models"],"correct":1,"explanation":"For indie developers and small teams, modern platforms like Vercel + Supabase deliver frontend deployment, edge functions, PostgreSQL, vector search, and auth — without the steep learning curve of AWS or GCP."},{"q":"When should you reach for a hyperscaler instead of Vercel + Supabase?","options":["From day one for any project","When you hit a specific capability gap like custom model training, GPU compute at scale, or enterprise compliance requirements","Only for million-user apps","When you hire a DevOps engineer"],"correct":1,"explanation":"The smartest approach is to use modern platforms for your app layer and only add hyperscaler complexity when you hit a specific need that simpler platforms cannot meet."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/01-infrastructure-for-ai/">← Previous: Infrastructure for AI</a>
  <a href="/academy/ai-infrastructure/03-api-management/">Next: API Management →</a>
</nav>
</div>
