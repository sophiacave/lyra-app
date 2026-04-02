---
title: "Vector Databases 101"
course: "rag-vector-search"
order: 2
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Vector Databases 101</h1>
  <p class="sub">Traditional databases find exact matches. Vector databases find similar meanings. This shift — from "contains this string" to "means something like this" — is what makes AI search intelligent. This lesson teaches you how vector databases work, when to use them, and how to store your first vectors.</p>
</div>

  <div class="section">
    <h2>The Problem with Traditional Search</h2>
    <p>You have a database of support documents. A customer searches for "joyful experience with your product." Traditional SQL: <code>SELECT * FROM docs WHERE content LIKE '%joyful%'</code>. Result: zero rows. The documents say "happy," "satisfied," "positive" — never "joyful." The customer gets nothing, even though dozens of relevant documents exist.</p>

    <p>Full-text search is better — it handles stemming ("running" matches "run") and stop words. But it still fundamentally matches <em>words</em>, not <em>meaning</em>. A search for "fixing broken deployment pipelines" will not find a document titled "Troubleshooting CI/CD failures" unless they share keywords.</p>

    <p>Vector databases solve this by storing <strong>meaning as geometry</strong>. Every document is converted to a vector (Lesson 1), and searches find vectors that <em>point in the same direction</em> — regardless of the specific words used. The customer's search for "joyful experience" finds documents about "positive feedback" and "customer satisfaction" because they occupy the same region of semantic space.</p>
  </div>

  <div class="section">
    <h2>How Vector Databases Work</h2>
    <p>A vector database has three core operations: <strong>store</strong>, <strong>index</strong>, and <strong>search</strong>.</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">1. Store</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">You insert vectors alongside metadata (the original text, source URL, creation date, etc.). The vector is the searchable representation; the metadata is what you return to the user.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">2. Index</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The database builds a special data structure — usually an <strong>HNSW graph</strong> (Hierarchical Navigable Small World) — that organizes vectors by proximity. This is what makes searches fast. Without an index, every search would compare against every stored vector — impossibly slow at scale.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">3. Search</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">You provide a query vector, and the database navigates the HNSW graph to find the nearest neighbors — the stored vectors most similar to your query. It returns the top-K results ranked by similarity score, along with their metadata.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The HNSW Index — Why Search Is Fast</h2>
    <p>HNSW stands for <strong>Hierarchical Navigable Small World</strong>. It is a graph-based index that allows approximate nearest-neighbor search in sub-linear time. Here is the intuition:</p>

    <p>Imagine you are trying to find a specific house in a city. A brute-force approach would be to walk to every house and check. HNSW works more like navigation: start at a high-level overview (continent → country → city → neighborhood → street → house), making progressively more precise jumps. Each "layer" of the graph connects distant nodes, and as you descend through layers, the connections become more local and precise.</p>

    <p>The result: searching 10 million vectors takes milliseconds, not minutes. The tradeoff is that HNSW finds <em>approximate</em> nearest neighbors — it might miss the absolute closest vector in favor of one that is nearly as close. In practice, the recall is 95-99%, which is more than sufficient for RAG applications.</p>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Key Insight:</strong> HNSW is the reason vector databases can scale. Without it, a search across 1 million vectors would require 1 million cosine similarity computations per query. With HNSW, it requires roughly log(N) — about 20 comparisons. This is the difference between 10ms and 10 seconds.
    </div>
  </div>

  <div class="section">
    <h2>Popular Vector Databases</h2>
    <p>The ecosystem is growing fast. Here are the ones that matter for RAG in 2025:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">pgvector (PostgreSQL)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Add vector search to your existing Postgres database. No new infrastructure. Supabase supports it natively — this is what Like One uses for its brain system. Best for: teams already using Postgres who want to add semantic search without managing another service.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Pinecone</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Fully managed, serverless. You push vectors in and query — no infrastructure to manage. Auto-scales. Best for: teams that want zero operational overhead and are willing to pay for convenience.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Chroma</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Lightweight, open-source, runs locally with <code>pip install chromadb</code>. In-memory by default. Best for: prototyping, learning, and small projects. Not recommended for production workloads above ~100K vectors.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Weaviate</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Open-source with built-in vectorization — it can embed text for you. Native hybrid search (BM25 + vector). Best for: production systems that need hybrid search and want a single solution for embedding + storage + search.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">Qdrant</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Rust-based, high-performance. Excellent filtering and payload support. Best for: high-throughput production workloads that need complex metadata filtering alongside vector search.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(250,204,21,.04);border:1px solid rgba(250,204,21,.1)">
        <strong style="color:#facc15;font-size:.85rem">Milvus</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Enterprise-grade, handles billions of vectors. Used by major tech companies. Best for: large enterprises with massive vector collections and dedicated infrastructure teams.</p>
      </div>
    </div>

    <p style="font-size:.85rem;color:#71717a;margin-top:.5rem"><strong>Recommendation:</strong> If you are using Supabase, start with pgvector — it is already there. If you are prototyping, use Chroma. If you need production-grade managed infrastructure, use Pinecone or Weaviate.</p>
  </div>

  <div class="section">
    <h2>Storing Vectors with pgvector (Supabase)</h2>
    <p>Here is a complete example of creating a vector table and storing embeddings in Supabase with pgvector — the same stack used in production by Like One:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable the pgvector extension (one-time setup)</span>
<span style="color:#c084fc">CREATE EXTENSION IF NOT EXISTS</span> vector;

<span style="color:#71717a">-- Create a table to store document chunks with embeddings</span>
<span style="color:#c084fc">CREATE TABLE</span> documents (
  id         <span style="color:#38bdf8">BIGSERIAL PRIMARY KEY</span>,
  content    <span style="color:#38bdf8">TEXT NOT NULL</span>,
  embedding  <span style="color:#38bdf8">VECTOR(1536)</span>,       <span style="color:#71717a">-- matches OpenAI small dimensions</span>
  metadata   <span style="color:#38bdf8">JSONB DEFAULT '{}'</span>,
  created_at <span style="color:#38bdf8">TIMESTAMPTZ DEFAULT NOW()</span>
);

<span style="color:#71717a">-- Create an HNSW index for fast similarity search</span>
<span style="color:#c084fc">CREATE INDEX ON</span> documents
  <span style="color:#c084fc">USING</span> hnsw (embedding vector_cosine_ops)
  <span style="color:#c084fc">WITH</span> (m = <span style="color:#fbbf24">16</span>, ef_construction = <span style="color:#fbbf24">64</span>);

<span style="color:#71717a">-- Search: find the 5 most similar documents to a query vector</span>
<span style="color:#c084fc">SELECT</span> id, content, <span style="color:#fbbf24">1</span> - (embedding <=> <span style="color:#fbbf24">'[0.023, -0.041, ...]'</span>) <span style="color:#c084fc">AS</span> similarity
<span style="color:#c084fc">FROM</span> documents
<span style="color:#c084fc">ORDER BY</span> embedding <=> <span style="color:#fbbf24">'[0.023, -0.041, ...]'</span>
<span style="color:#c084fc">LIMIT</span> <span style="color:#fbbf24">5</span>;</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">The <code>&lt;=&gt;</code> operator is pgvector's cosine distance operator. Lower distance = higher similarity. We subtract from 1 to convert distance to a similarity score (0 to 1).</p>
  </div>

  <div class="section">
    <h2>Storing Vectors with Chroma (Python)</h2>
    <p>For quick prototyping, Chroma runs entirely in Python with no database setup:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> chromadb
<span style="color:#c084fc">from</span> openai <span style="color:#c084fc">import</span> OpenAI

client = OpenAI()
chroma = chromadb.Client()
collection = chroma.create_collection(<span style="color:#fbbf24">"my-docs"</span>)

<span style="color:#71717a"># Documents to index</span>
docs = [
    <span style="color:#fbbf24">"Our refund policy allows returns within 30 days."</span>,
    <span style="color:#fbbf24">"Shipping delays should be escalated to the logistics team."</span>,
    <span style="color:#fbbf24">"Premium support includes 24/7 live chat."</span>,
]

<span style="color:#71717a"># Embed and store</span>
<span style="color:#c084fc">for</span> i, doc <span style="color:#c084fc">in</span> <span style="color:#34d399">enumerate</span>(docs):
    embedding = client.embeddings.create(
        input=doc, model=<span style="color:#fbbf24">"text-embedding-3-small"</span>
    ).data[<span style="color:#fbbf24">0</span>].embedding

    collection.add(
        ids=[<span style="color:#c084fc">f</span><span style="color:#fbbf24">"doc-{i}"</span>],
        embeddings=[embedding],
        documents=[doc]
    )

<span style="color:#71717a"># Search for similar documents</span>
query_vec = client.embeddings.create(
    input=<span style="color:#fbbf24">"How do I get a refund?"</span>,
    model=<span style="color:#fbbf24">"text-embedding-3-small"</span>
).data[<span style="color:#fbbf24">0</span>].embedding

results = collection.query(query_embeddings=[query_vec], n_results=<span style="color:#fbbf24">2</span>)
<span style="color:#34d399">print</span>(results[<span style="color:#fbbf24">"documents"</span>])
<span style="color:#71717a"># [["Our refund policy allows returns within 30 days."]]</span></code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Notice: "How do I get a refund?" matches "Our refund policy allows returns within 30 days" — even though the query uses different words. This is the power of semantic search.</p>
  </div>

  <div class="section">
    <h2>Metadata Filtering</h2>
    <p>Real RAG systems do not just search by meaning — they also filter by metadata. A legal RAG system might search for semantically similar clauses <em>but only in contracts from 2024</em>. A support system might find relevant answers <em>but only for the customer's product tier</em>.</p>

    <p>All major vector databases support metadata filtering alongside vector search. This combination — semantic similarity + structured filters — is what makes vector databases production-ready. Without filtering, every search would return results from the entire corpus, which is rarely what you want.</p>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Common Mistake:</strong> Storing vectors without metadata. If you cannot filter by source, date, or category, your RAG system will return irrelevant results for any query that needs scope. Always store metadata alongside your vectors — you will need it.
    </div>
  </div>

  <div class="section">
    <h2>Choosing Your Vector Database</h2>
    <p>The right choice depends on your existing stack, scale, and operational appetite. Here are the three most common production paths:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">pgvector (PostgreSQL)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong style="color:#e5e5e5">Best for:</strong> Teams already on Postgres/Supabase. Zero new infrastructure. Combine vector search with SQL joins, transactions, and row-level security in one database.</p>
        <p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0"><strong>Tradeoff:</strong> Slower than purpose-built solutions above ~10M vectors. HNSW index tuning requires Postgres expertise.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Pinecone</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong style="color:#e5e5e5">Best for:</strong> Teams that want zero ops. Fully managed, serverless, auto-scaling. Push vectors in, query out. Native sparse-dense hybrid search support.</p>
        <p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0"><strong>Tradeoff:</strong> Vendor lock-in. No self-hosting option. Costs scale with usage — can get expensive at high query volumes.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">Qdrant</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong style="color:#e5e5e5">Best for:</strong> High-performance production workloads. Rust-based, excellent filtering, payload indexing. Self-host or use their cloud. Open-source with a strong community.</p>
        <p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0"><strong>Tradeoff:</strong> Requires running a separate service. More operational overhead than Pinecone or pgvector-in-Supabase.</p>
      </div>
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"Vector Database Concepts","questions":[{"q":"What does a vector database return when you search with a query?","options":["Rows where a column exactly matches the query","The top-K documents whose vectors are most similar in meaning","All documents sorted alphabetically","A count of how many documents mention the query word"],"correct":1,"explanation":"Vector databases perform similarity search — they compare the query vector against all stored vectors and return the K nearest neighbors, ranked by cosine or dot-product similarity."},{"q":"What index structure do most vector databases use to search billions of vectors quickly?","options":["B-tree index","Hash index","HNSW (Hierarchical Navigable Small World)","Full-text inverted index"],"correct":2,"explanation":"HNSW is a graph-based index that allows approximate nearest-neighbor search in sub-linear time. Instead of scanning every vector, it navigates a layered graph to zoom in on likely neighbors quickly."},{"q":"You are starting a RAG project and already use Supabase for your backend. Which vector database should you try first?","options":["Pinecone — it is the most popular","Chroma — it is the simplest","pgvector — it is already available in your Supabase database","Milvus — it handles the most scale"],"correct":2,"explanation":"pgvector is a PostgreSQL extension that adds vector storage and similarity search to your existing database. Since Supabase is built on Postgres, pgvector is already available — no new infrastructure needed."},{"q":"Why is metadata filtering important in production RAG systems?","options":["It makes searches faster","It allows you to scope searches to relevant subsets of your data","It is required by all vector databases","It improves embedding quality"],"correct":1,"explanation":"Without metadata filtering, every search returns results from the entire corpus. In production, you need to scope searches — by date, category, user, product tier — to return relevant results rather than everything that is semantically similar."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Vector Database Fundamentals","cards":[{"front":"Vector Database","back":"A database optimized for storing and searching high-dimensional vectors by similarity rather than exact match. Finds \"happy\" when you search for \"joyful.\""},{"front":"HNSW Index","back":"Hierarchical Navigable Small World — a graph-based index that finds approximate nearest neighbors in sub-linear time, enabling millisecond searches across billions of vectors."},{"front":"Top-K Results","back":"The K most similar document chunks returned from a vector search, ranked by similarity score. Typical K values: 3-10."},{"front":"pgvector","back":"A PostgreSQL extension that adds vector storage and similarity search to your existing Postgres database. Supported by Supabase. Uses the <=> operator for cosine distance."},{"front":"Metadata Filtering","back":"Restricting vector search results to a subset of documents based on structured fields (date, category, user). Essential for production RAG systems."},{"front":"Approximate Nearest Neighbor","back":"HNSW finds vectors that are APPROXIMATELY the closest, not guaranteed the absolute closest. Recall is 95-99%, which is sufficient for RAG."}]}'></div>
</div>
