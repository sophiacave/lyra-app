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
</div>

<div class="lesson-section">
  <span class="section-label">Under the Hood</span>
  <h2 class="section-title">How Vector Search Actually Works</h2>
  <p class="section-text">Understanding the mechanics of vector search helps you make better decisions about indexing, performance, and when pgvector is sufficient vs. when you need a dedicated solution.</p>
  <p class="section-text"><strong>Step 1: Embedding.</strong> Text is converted into a fixed-length array of floating-point numbers (a vector). A 384-dimensional embedding model produces an array of 384 numbers for any input text, regardless of length. These numbers encode semantic meaning — similar concepts produce similar vectors.</p>
  <p class="section-text"><strong>Step 2: Storage.</strong> The vector is stored alongside its source content in the database. In pgvector, this is a column of type <code>vector(384)</code> — just another column in your table.</p>
  <p class="section-text"><strong>Step 3: Indexing.</strong> For fast search, you create an index. pgvector supports IVFFlat (inverted file flat) and HNSW (hierarchical navigable small world) indexes. HNSW is slower to build but faster to query — the right choice for most applications.</p>
  <p class="section-text"><strong>Step 4: Querying.</strong> To search, you embed the query text using the same model, then find the nearest neighbors in vector space using cosine similarity, inner product, or L2 distance.</p>

<div class="code-block"><div class="code-label">SQL — Vector Search Flow in pgvector</div>
<pre><code class="language-sql">-- 1. Enable the extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create a table with a vector column
CREATE TABLE knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create an HNSW index for fast similarity search
CREATE INDEX ON knowledge_base
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 4. Insert content with its embedding
INSERT INTO knowledge_base (content, metadata, embedding)
VALUES (
  'How to deploy a Next.js app to Vercel',
  '{"category": "deployment", "source": "docs"}',
  '[0.023, -0.041, 0.089, ...]'  -- 384-dimensional vector
);

-- 5. Semantic similarity search
SELECT content, metadata,
       1 - (embedding &lt;=&gt; $1::vector) AS similarity
FROM knowledge_base
WHERE 1 - (embedding &lt;=&gt; $1::vector) > 0.7  -- similarity threshold
ORDER BY embedding &lt;=&gt; $1::vector
LIMIT 5;</code></pre>
</div>

  <p class="section-text">The <code>&lt;=&gt;</code> operator computes cosine distance. Subtracting from 1 gives cosine similarity (1.0 = identical, 0.0 = unrelated). The threshold of 0.7 filters out low-quality matches — adjust based on your use case.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Production Pattern</span>
  <h2 class="section-title">RAG Pipeline with pgvector</h2>
  <p class="section-text">Retrieval Augmented Generation (RAG) is the most common pattern for AI apps that need to answer questions from a knowledge base. Here's the complete pipeline implementation.</p>

<div class="code-block"><div class="code-label">TypeScript — Complete RAG Pipeline</div>
<pre><code class="language-typescript">import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function ragQuery(userQuestion: string): Promise&lt;string&gt; {
  // Step 1: Generate embedding for the user's question
  const embeddingResponse = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("HF_TOKEN")}` },
      body: JSON.stringify({ inputs: userQuestion }),
    }
  );
  const queryEmbedding = await embeddingResponse.json();

  // Step 2: Find relevant documents via vector similarity
  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 5,
  });

  // Step 3: Build context from retrieved documents
  const context = documents
    ?.map((d: any) => d.content)
    .join("\n\n") ?? "No relevant context found.";

  // Step 4: Call LLM with context-enriched prompt
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Answer based on this context:\n\n${context}\n\nQuestion: ${userQuestion}`,
      }],
    }),
  });

  const result = await response.json();
  return result.content[0].text;
}</code></pre>
</div>

  <p class="section-text">This four-step pipeline — embed, retrieve, contextualize, generate — is the backbone of every RAG system. The database handles the heavy lifting of semantic search, and the LLM only gets called with relevant context, keeping both costs and hallucinations low.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">Designing for AI and Traditional Queries</h2>
  <p class="section-text">The most practical architecture for most AI apps: PostgreSQL with pgvector on Supabase. One database handles your users table, your content table with embedding columns, and your application logic — all with SQL you already know.</p>
  <p class="section-text">Store embeddings alongside the content they represent. When you insert a piece of content, generate its embedding and store both in the same row. When you search, query by vector similarity and get back the full content with all its metadata in one query.</p>
  <p class="section-text">This is exactly how Like One's brain works. Every memory has both structured metadata (key, category, timestamps) and a vector embedding for semantic search. One table. One query. Full context.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Performance</span>
  <h2 class="section-title">pgvector Performance and Indexing Guide</h2>
  <p class="section-text">pgvector's performance depends heavily on your index configuration. Understanding the tradeoffs helps you get fast queries without over-provisioning resources.</p>
  <p class="section-text"><strong>No index (brute force):</strong> Perfect recall but O(n) scan time. Fine for under 10,000 vectors. Above that, queries slow down noticeably.</p>
  <p class="section-text"><strong>IVFFlat:</strong> Partitions vectors into clusters, then searches only the closest clusters. Fast to build, good for datasets that don't change often. Set <code>lists</code> to roughly <code>sqrt(n)</code> where n is your row count.</p>
  <p class="section-text"><strong>HNSW:</strong> Builds a graph structure for navigation. Slower to build than IVFFlat but faster to query and better recall. The recommended choice for most production workloads. Key parameters: <code>m</code> (connections per layer, default 16) and <code>ef_construction</code> (build quality, default 64).</p>
  <p class="section-text"><strong>Rule of thumb:</strong> Under 100K vectors, pgvector with HNSW handles everything beautifully. 100K-1M vectors, it still works but monitor query times. Over 1M vectors, evaluate dedicated vector databases like Qdrant or Pinecone.</p>
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

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Database Choices for AI","cards":[{"front":"PostgreSQL + pgvector","back":"One database for structured data AND vector search. One connection, one backup, full SQL power alongside semantic similarity search."},{"front":"Vector Embeddings","back":"High-dimensional numerical representations of text or data. Enable searching by meaning — find deployment docs when someone asks how to fix their deploy."},{"front":"JSONB Columns","back":"PostgreSQL\\\'s flexible schema storage. Handles conversation logs, AI outputs, and varying metadata without needing a separate NoSQL database."},{"front":"Dedicated Vector DBs (Pinecone, Qdrant)","back":"Built for massive scale — billions of vectors with sub-millisecond latency. Only needed when pgvector\\\'s performance isn\\\'t enough."},{"front":"Co-located Content + Embeddings","back":"Store embeddings alongside the content they represent in the same row. One similarity search returns full content with all metadata."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Database Choices Quiz","questions":[{"q":"Why does pgvector on Supabase work well for most AI apps?","options":["It is faster than all dedicated vector databases","For most applications under 1 million vectors, pgvector performs well — and you get semantic search without adding a separate database to manage","It is completely free","It scales to billions of vectors automatically"],"correct":1,"explanation":"pgvector gives you semantic similarity search inside PostgreSQL, meaning one connection, one backup strategy, one set of credentials — and full SQL power alongside vector search for the vast majority of use cases."},{"q":"What is the practical advantage of storing embeddings alongside content in the same database row?","options":["It uses less storage","You can query by vector similarity and retrieve the full content with all its metadata in one query, rather than cross-referencing two separate systems","It is faster to generate embeddings","It makes backups easier"],"correct":1,"explanation":"Co-locating content and its embedding means a single similarity search returns everything you need — the matching text, its metadata, and related structured fields — without expensive cross-database joins."},{"q":"Before reaching for a separate NoSQL database, what should PostgreSQL users try first?","options":["MongoDB Atlas free tier","Redis cache","PostgreSQL JSONB columns for flexible schema data","DynamoDB"],"correct":2,"explanation":"PostgreSQL JSONB columns provide most of the flexibility of a NoSQL database — storing variable-shape documents alongside your relational data — without adding another service to manage."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/03-api-management/">← Previous: API Management</a>
  <a href="/academy/ai-infrastructure/05-deployment-strategies/">Next: Deployment Strategies →</a>
</nav>
</div>
