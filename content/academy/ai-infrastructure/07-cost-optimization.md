---
title: "Cost Optimization"
course: "ai-infrastructure"
order: 7
type: "lesson"
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Managing AI <span class="accent">Compute & API Costs</span></h1>
  <p class="section-text">AI infrastructure can be cheap or catastrophically expensive. The difference is strategy. Every technique in this lesson exists because someone learned the hard way that AI costs don't behave like traditional hosting costs.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>The real cost breakdown of AI API calls</li>
    <li>Caching strategies that cut costs by 40-70%</li>
    <li>Model selection: when cheaper models are actually better</li>
    <li>Building a tiered architecture that minimizes expensive API calls</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Reality</span>
  <h2 class="section-title">Understanding AI Cost Structure</h2>
  <p class="section-text">AI API pricing is based on tokens — chunks of text roughly equivalent to 3/4 of a word. You pay for both input tokens (what you send) and output tokens (what the model generates). Output tokens typically cost 3-5x more than input tokens.</p>
  <p class="section-text">A single conversation turn with a large context window can cost $0.05-$0.50. Multiply that by thousands of users and dozens of interactions per user, and you're looking at real money. The organizations that survive are the ones that optimize ruthlessly.</p>
  <p class="section-text">Your system prompt alone might be 2,000 tokens. If that prompt goes with every request, you're paying for it every single time. This is the first place to optimize — make your system prompts as concise as possible.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Biggest Win</span>
  <h2 class="section-title">Caching: Stop Paying Twice</h2>
  <p class="section-text"><strong>Semantic caching:</strong> Before sending a query to an LLM, check if a sufficiently similar query has been answered recently. Use vector similarity to find near-matches. If someone asked "how do I deploy to Vercel?" five minutes ago, the answer to "deploying on Vercel?" is probably the same.</p>
  <p class="section-text"><strong>Response caching:</strong> For deterministic operations (embeddings, classifications, structured data extraction), cache the result keyed on the input hash. Embeddings for the same text never change — compute them once and store them forever.</p>
  <p class="section-text"><strong>Prompt caching:</strong> Some providers (including Anthropic) offer prompt caching — if you send the same system prompt repeatedly, you pay full price once and a fraction for subsequent uses. Structure your requests to take advantage of this.</p>
  <p class="section-text">A well-implemented caching layer typically reduces AI API costs by 40-70%. That's not an optimization — it's a survival strategy.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Right-Sizing</span>
  <h2 class="section-title">Model Selection Strategy</h2>
  <p class="section-text">Not every task needs the most powerful model. Classification, extraction, and simple Q&A can often be handled by smaller, cheaper models. Reserve the expensive models for tasks that actually need their capabilities.</p>
  <p class="section-text"><strong>Tiered approach:</strong> Use free or cheap embeddings (HuggingFace BGE-small) for semantic search. Use a mid-tier model (Claude Haiku, GPT-4o-mini) for simple tasks. Reserve the flagship model (Claude Opus, GPT-4o) for complex reasoning that genuinely needs it.</p>
  <p class="section-text"><strong>RAG before generation:</strong> Before asking an LLM to generate an answer, check if the answer already exists in your knowledge base. A vector search costs fractions of a cent. An LLM call costs 100x more. Let your database do the cheap work first.</p>
  <p class="section-text">This tiered architecture is how Like One works: free embeddings handle similarity search, and the expensive model only gets called when the brain can't answer from stored knowledge.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"AI Cost Optimization Strategies","cards":[{"front":"Semantic Caching","back":"Before calling an LLM, check if a similar query has been answered recently using vector similarity. One cached answer can serve many slightly different questions."},{"front":"Response Caching","back":"For deterministic operations like embeddings and classifications, cache the result keyed on input hash. Same text always produces the same embedding — compute once, store forever."},{"front":"Prompt Caching","back":"Some providers (including Anthropic) offer discounted pricing when you send the same system prompt repeatedly. Structure requests to take advantage of this."},{"front":"Model Tiering","back":"Use free embeddings for search, mid-tier models for simple tasks, flagship models only for complex reasoning. Route by task complexity, not by habit."},{"front":"RAG Before Generation","back":"A vector search costs fractions of a cent. An LLM call costs 100x more. Check your knowledge base first — only call the LLM for genuinely novel questions."}]}'></div>
</div>

<div class="lesson-section">
</div>

<div class="lesson-section">
  <span class="section-label">Discipline</span>
  <h2 class="section-title">Operational Cost Controls</h2>
  <p class="section-text"><strong>Token budgets per request:</strong> Set maximum output token limits. If a user asks a simple question, cap the response at 500 tokens. Don't let the model write an essay when a paragraph will do.</p>
  <p class="section-text"><strong>Context window management:</strong> Don't send the entire conversation history with every request. Summarize older messages, keep only the last N turns in full, and use RAG to retrieve relevant context on demand.</p>
  <p class="section-text"><strong>Batch processing:</strong> If you have non-urgent AI tasks (generating summaries, processing uploads), batch them and run during off-peak hours when some providers offer lower rates.</p>
  <p class="section-text"><strong>Regular cost audits:</strong> Review your AI spending weekly. Identify the top 5 most expensive operations. Ask: can any of them be cached, downgraded to a cheaper model, or eliminated entirely?</p>
</div>

<div class="demo-container">
  <h3>Cost Optimization Checklist</h3>
  <p class="section-text">1. Cache embeddings (compute once, store forever)</p>
  <p class="section-text">2. Implement semantic query caching (save 40-70%)</p>
  <p class="section-text">3. Use the cheapest model that works for each task</p>
  <p class="section-text">4. RAG before generation (database search before LLM call)</p>
  <p class="section-text">5. Trim context windows and set output token limits</p>
  <p class="section-text">6. Audit costs weekly, optimize the top 5 most expensive operations</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Build a semantic cache layer: before calling an LLM, generate an embedding of the user's query, search your vector database for similar past queries (cosine similarity > 0.95), and return the cached response if found. Measure how many API calls this saves over a week of usage.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Cost Optimization Quiz","questions":[{"q":"Why does your system prompt represent the first cost optimization opportunity?","options":["System prompts cost more per token","A 2000-token system prompt goes with every request — paying for it every single time at scale compounds into serious money","System prompts are charged at 5x the rate","System prompts prevent caching"],"correct":1,"explanation":"If your system prompt is 2,000 tokens and you make 10,000 API calls per day, you are paying for 20 million tokens of system prompt daily. Making it as concise as possible is the fastest cost win."},{"q":"What cost reduction percentage does a well-implemented caching layer typically achieve?","options":["5-10%","10-20%","40-70%","90%+"],"correct":2,"explanation":"A well-implemented cache — combining semantic caching, response caching, and embedding caching — typically reduces AI API costs by 40-70%. This is not an optimization, it is a survival strategy at scale."},{"q":"What is the correct order of operations for serving a user query at minimum cost?","options":["LLM call first, then cache if the answer is good","Check semantic cache, then RAG from knowledge base, then call LLM only for genuinely novel complex queries","Always call LLM first for best quality","Check cache, then call LLM, then store result"],"correct":1,"explanation":"Layer your architecture: cache first (free), RAG from your database second (fractions of a cent), LLM last (most expensive). Only the novel, complex queries that none of your cheaper layers can answer reach the LLM."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/06-monitoring-and-observability/">← Previous: Monitoring & Observability</a>
  <a href="/academy/ai-infrastructure/08-security-and-compliance/">Next: Security & Compliance →</a>
</nav>
</div>
