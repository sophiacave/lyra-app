---
title: "Database Choices"
course: "ai-infrastructure"
order: 4
type: "lesson"
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>SQL, NoSQL & <span class="accent">Vector Databases</span> for AI</h1>
  <p class="section-text">AI applications need to store structured data, unstructured data, and semantic embeddings — often all at once. Choosing the right database architecture is one of the highest-leverage decisions you'll make.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>When SQL, NoSQL, and vector databases each shine</li>
    <li>How vector search actually works under the hood</li>
    <li>Why PostgreSQL + pgvector might be all you need</li>
    <li>Designing schemas that serve both traditional queries and AI retrieval</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Classics</span>
  <h2 class="section-title">SQL Databases: Still the Foundation</h2>
  <p class="section-text">PostgreSQL and MySQL aren't going anywhere. User accounts, subscriptions, permissions, transaction history — this is structured, relational data that SQL handles perfectly. Every AI app still needs a relational database for its core application data.</p>
  <p class="section-text">The good news: you don't have to choose between SQL and vector search. PostgreSQL with the pgvector extension gives you both in one database. That means one connection, one backup strategy, one set of credentials, and full SQL power alongside semantic search.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Flexible</span>
  <h2 class="section-title">NoSQL: When Structure Gets in the Way</h2>
  <p class="section-text">NoSQL databases like MongoDB, DynamoDB, or Firestore excel at storing data whose shape changes frequently — like conversation histories, user-generated content with varying fields, or AI-generated outputs that don't fit clean schemas.</p>
  <p class="section-text">For AI apps, NoSQL is useful for storing raw conversation logs, flexible metadata, and cached AI responses. But for most teams, PostgreSQL's JSONB columns give you the same flexibility without adding another database to your stack.</p>
  <p class="section-text">The rule of thumb: if you're already running PostgreSQL (and you should be), use JSONB columns before reaching for a separate NoSQL database.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The New Essential</span>
  <h2 class="section-title">Vector Databases: Searching by Meaning</h2>
  <p class="section-text">Vector databases are the breakthrough that makes modern AI applications possible. They store embeddings — high-dimensional numerical representations of text, images, or any data — and let you search by semantic similarity.</p>
  <p class="section-text">When a user asks "how do I fix my deployment?", a vector search finds documents about deployment troubleshooting, CI/CD errors, and hosting configuration — even if none of those documents contain the exact word "fix." This is fundamentally different from keyword search and it's what powers RAG (Retrieval Augmented Generation).</p>
  <p class="section-text"><strong>Dedicated vector databases</strong> like Pinecone, Weaviate, and Qdrant are built specifically for this. They're fast and feature-rich but add another service to manage.</p>
  <p class="section-text"><strong>pgvector</strong> adds vector search to PostgreSQL. It's not as fast as dedicated solutions at massive scale, but for most applications (under 1 million vectors), it performs beautifully — and you don't need another database.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">Designing for AI and Traditional Queries</h2>
  <p class="section-text">The most practical architecture for most AI apps: PostgreSQL with pgvector on Supabase. One database handles your users table, your content table with embedding columns, and your application logic — all with SQL you already know.</p>
  <p class="section-text">Store embeddings alongside the content they represent. When you insert a piece of content, generate its embedding and store both in the same row. When you search, query by vector similarity and get back the full content with all its metadata in one query.</p>
  <p class="section-text">This is exactly how Like One's brain works. Every memory has both structured metadata (key, category, timestamps) and a vector embedding for semantic search. One table. One query. Full context.</p>
</div>

<div class="demo-container">
  <h3>Database Decision Tree</h3>
  <p class="section-text"><strong>Structured data + vector search?</strong> → PostgreSQL + pgvector (Supabase)</p>
  <p class="section-text"><strong>Billions of vectors, sub-millisecond latency?</strong> → Pinecone or Qdrant</p>
  <p class="section-text"><strong>Highly flexible schemas, rapid iteration?</strong> → MongoDB or PostgreSQL JSONB</p>
  <p class="section-text"><strong>Just starting out?</strong> → PostgreSQL + pgvector. Add complexity later if needed.</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Enable pgvector on a Supabase project. Create a table with a text column and a vector(384) embedding column. Insert 10 text entries with embeddings generated from a free embedding API (like HuggingFace BGE-small). Write a similarity search query that finds the 3 most relevant entries for a given input.</code></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/03-api-management/">← Previous: API Management</a>
  <a href="/academy/ai-infrastructure/05-deployment-strategies/">Next: Deployment Strategies →</a>
</nav>
</div>
