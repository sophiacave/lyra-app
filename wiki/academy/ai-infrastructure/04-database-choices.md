# Database Choices

**Course:** AI Infrastructure & DevOps
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[AI Infrastructure & DevOps](/academy/ai-infrastructure/)
  Lesson 4 of 10


  # SQL, NoSQL & Vector Databases for AI

  AI applications need to store structured data, unstructured data, and semantic embeddings — often all at once. Choosing the right database architecture is one of the highest-leverage decisions you'll make.


  ### What you'll learn


    - When SQL, NoSQL, and vector databases each shine

    - How vector search actually works under the hood

    - Why PostgreSQL + pgvector might be all you need

    - Designing schemas that serve both traditional queries and AI retrieval




  The Classics
  ## SQL Databases: Still the Foundation

  PostgreSQL and MySQL aren't going anywhere. User accounts, subscriptions, permissions, transaction history — this is structured, relational data that SQL handles perfectly. Every AI app still needs a relational database for its core application data.
  The good news: you don't have to choose between SQL and vector search. PostgreSQL with the pgvector extension gives you both in one database. That means one connection, one backup strategy, one set of credentials, and full SQL power alongside semantic search.


  The Flexible
  ## NoSQL: When Structure Gets in the Way

  NoSQL databases like MongoDB, DynamoDB, or Firestore excel at storing data whose shape changes frequently — like conversation histories, user-generated content with varying fields, or AI-generated outputs that don't fit clean schemas.
  For AI apps, NoSQL is useful for storing raw conversation logs, flexible metadata, and cached AI responses. But for most teams, PostgreSQL's JSONB columns give you the same flexibility without adding another database to your stack.
  The rule of thumb: if you're already running PostgreSQL (and you should be), use JSONB columns before reaching for a separate NoSQL database.


  The New Essential
  ## Vector Databases: Searching by Meaning

  Vector databases are the breakthrough that makes modern AI applications possible. They store embeddings — high-dimensional numerical representations of text, images, or any data — and let you search by semantic similarity.
  When a user asks "how do I fix my deployment?", a vector search finds documents about deployment troubleshooting, CI/CD errors, and hosting configuration — even if none of those documents contain the exact word "fix." This is fundamentally different from keyword search and it's what powers RAG (Retrieval Augmented Generation).
  **Dedicated vector databases** like Pinecone, Weaviate, and Qdrant are built specifically for this. They're fast and feature-rich but add another service to manage.
  **pgvector** adds vector search to PostgreSQL. It's not as fast as dedicated solutions at massive scale, but for most applications (under 1 million vectors), it performs beautifully — and you don't need another database.


  Under the Hood
  ## How Vector Search Actually Works

  Understanding the mechanics of vector search helps you make better decisions about indexing, performance, and when pgvector is sufficient vs. when you need a dedicated solution.
  **Step 1: Embedding.** Text is converted into a fixed-length array of floating-point numbers (a vector). A 384-dimensional embedding model produces an array of 384 numbers for any input text, regardless of length. These numbers encode semantic meaning — similar concepts produce similar vectors.
  **Step 2: Storage.** The vector is stored alongside its source content in the database. In pgvector, this is a column of type `vector(384)` — just another column in your table.
  **Step 3: Indexing.** For fast search, you create an index. pgvector supports IVFFlat (inverted file flat) and HNSW (hierarchical navigable small world) indexes. HNSW is slower to build but faster to query — the right choice for most applications.
  **Step 4: Querying.** To search, you embed the query text using the same model, then find the nearest neighbors in vector space using cosine similarity, inner product, or L2 distance.

SQL — Vector Search Flow in pgvector

```
-- 1. Enable the extension
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
       1 - (embedding  $1::vector) AS similarity
FROM knowledge_base
WHERE 1 - (embedding  $1::vector) > 0.7  -- similarity threshold
ORDER BY embedding  $1::vector
LIMIT 5;
```


  The `` operator computes cosine distance. Subtracting from 1 gives cosine similarity (1.0 = identical, 0.0 = unrelated). The threshold of 0.7 filters out low-quality matches — adjust based on your use case.


  Production Pattern
  ## RAG Pipeline with pgvector

  Retrieval Augmented Generation (RAG) is the most common pattern for AI apps that need to answer questions from a knowledge base. Here's the complete pipeline implementation.

TypeScript — Complete RAG Pipeline

```
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function ragQuery(userQuestion: string): Promise {
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
}
```


  This four-step pipeline — embed, retrieve, contextualize, generate — is the backbone of every RAG system. The database handles the heavy lifting of semantic search, and the LLM only gets called with relevant context, keeping both costs and hallucinations low.


  Architecture
  ## Designing for AI and Traditional Queries

  The most practical architecture for most AI apps: PostgreSQL with pgvector on Supabase. One database handles your users table, your content table with embedding columns, and your application logic — all with SQL you already know.
  Store embeddings alongside the content they represent. When you insert a piece of content, generate its embedding and store both in the same row. When you search, query by vector similarity and get back the full content with all its metadata in one query.
  This is exactly how Like One's brain works. Every memory has both structured metadata (key, category, timestamps) and a vector embedding for semantic search. One table. One query. Full context.


  Performance
  ## pgvector Performance and Indexing Guide

  pgvector's performance depends heavily on your index configuration. Understanding the tradeoffs helps you get fast queries without over-provisioning resources.
  **No index (brute force):** Perfect recall but O(n) scan time. Fine for under 10,000 vectors. Above that, queries slow down noticeably.
  **IVFFlat:** Partitions vectors into clusters, then searches only the closest clusters. Fast to build, good for datasets that don't change often. Set `lists` to roughly `sqrt(n)` where n is your row count.
  **HNSW:** Builds a graph structure for navigation. Slower to build than IVFFlat but faster to query and better recall. The recommended choice for most production workloads. Key parameters: `m` (connections per layer, default 16) and `ef_construction` (build quality, default 64).
  **Rule of thumb:** Under 100K vectors, pgvector with HNSW handles everything beautifully. 100K-1M vectors, it still works but monitor query times. Over 1M vectors, evaluate dedicated vector databases like Qdrant or Pinecone.


  ### Database Decision Tree

  **Structured data + vector search?** → PostgreSQL + pgvector (Supabase)
  **Billions of vectors, sub-millisecond latency?** → Pinecone or Qdrant
  **Highly flexible schemas, rapid iteration?** → MongoDB or PostgreSQL JSONB
  **Just starting out?** → PostgreSQL + pgvector. Add complexity later if needed.


  ### Try it yourself

  `Enable pgvector on a Supabase project. Create a table with a text column and a vector(384) embedding column. Insert 10 text entries with embeddings generated from a free embedding API (like HuggingFace BGE-small). Write a similarity search query that finds the 3 most relevant entries for a given input.`


  [Interactive: FlashDeck]



### Quiz

**Q1: Why does pgvector on Supabase work well for most AI apps?**
    A. It is faster than all dedicated vector databases
  ✓ B. For most applications under 1 million vectors, pgvector performs well — and you get semantic search without adding a separate database to manage
    C. It is completely free
    D. It scales to billions of vectors automatically
  *pgvector gives you semantic similarity search inside PostgreSQL, meaning one connection, one backup strategy, one set of credentials — and full SQL power alongside vector search for the vast majority of use cases.*

**Q2: What is the practical advantage of storing embeddings alongside content in the same database row?**
    A. It uses less storage
  ✓ B. You can query by vector similarity and retrieve the full content with all its metadata in one query, rather than cross-referencing two separate systems
    C. It is faster to generate embeddings
    D. It makes backups easier
  *Co-locating content and its embedding means a single similarity search returns everything you need — the matching text, its metadata, and related structured fields — without expensive cross-database joins.*

**Q3: Before reaching for a separate NoSQL database, what should PostgreSQL users try first?**
    A. MongoDB Atlas free tier
    B. Redis cache
  ✓ C. PostgreSQL JSONB columns for flexible schema data
    D. DynamoDB
  *PostgreSQL JSONB columns provide most of the flexibility of a NoSQL database — storing variable-shape documents alongside your relational data — without adding another service to manage.*


  [← Previous: API Management](/academy/ai-infrastructure/03-api-management/)
  [Next: Deployment Strategies →](/academy/ai-infrastructure/05-deployment-strategies/)
