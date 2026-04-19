# Vector Databases 101

**Course:** RAG & Vector Search
**Order:** 2
**Type:** lesson
**Access:** Free

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 2 of 10


  # Vector Databases 101

  Traditional databases find exact matches. Vector databases find similar meanings. This shift — from "contains this string" to "means something like this" — is what makes AI search intelligent. This lesson teaches you how vector databases work, when to use them, and how to store your first vectors.



    ## The Problem with Traditional Search

    You have a database of support documents. A customer searches for "joyful experience with your product." Traditional SQL: `SELECT * FROM docs WHERE content LIKE '%joyful%'`. Result: zero rows. The documents say "happy," "satisfied," "positive" — never "joyful." The customer gets nothing, even though dozens of relevant documents exist.

    Full-text search is better — it handles stemming ("running" matches "run") and stop words. But it still fundamentally matches *words*, not *meaning*. A search for "fixing broken deployment pipelines" will not find a document titled "Troubleshooting CI/CD failures" unless they share keywords.

    Vector databases solve this by storing **meaning as geometry**. Every document is converted to a vector (Lesson 1), and searches find vectors that *point in the same direction* — regardless of the specific words used. The customer's search for "joyful experience" finds documents about "positive feedback" and "customer satisfaction" because they occupy the same region of semantic space.



    ## How Vector Databases Work

    A vector database has three core operations: **store**, **index**, and **search**.



        **1. Store**
        You insert vectors alongside metadata (the original text, source URL, creation date, etc.). The vector is the searchable representation; the metadata is what you return to the user.


        **2. Index**
        The database builds a special data structure — usually an **HNSW graph** (Hierarchical Navigable Small World) — that organizes vectors by proximity. This is what makes searches fast. Without an index, every search would compare against every stored vector — impossibly slow at scale.


        **3. Search**
        You provide a query vector, and the database navigates the HNSW graph to find the nearest neighbors — the stored vectors most similar to your query. It returns the top-K results ranked by similarity score, along with their metadata.





    ## The HNSW Index — Why Search Is Fast

    HNSW stands for **Hierarchical Navigable Small World**. It is a graph-based index that allows approximate nearest-neighbor search in sub-linear time. Here is the intuition:

    Imagine you are trying to find a specific house in a city. A brute-force approach would be to walk to every house and check. HNSW works more like navigation: start at a high-level overview (continent → country → city → neighborhood → street → house), making progressively more precise jumps. Each "layer" of the graph connects distant nodes, and as you descend through layers, the connections become more local and precise.

    The result: searching 10 million vectors takes milliseconds, not minutes. The tradeoff is that HNSW finds *approximate* nearest neighbors — it might miss the absolute closest vector in favor of one that is nearly as close. In practice, the recall is 95-99%, which is more than sufficient for RAG applications.


      **Key Insight:** HNSW is the reason vector databases can scale. Without it, a search across 1 million vectors would require 1 million cosine similarity computations per query. With HNSW, it requires roughly log(N) — about 20 comparisons. This is the difference between 10ms and 10 seconds.




    ## Popular Vector Databases

    The ecosystem is growing fast. Here are the ones that matter for RAG in 2025:



        **pgvector (PostgreSQL)**
        Add vector search to your existing Postgres database. No new infrastructure. Supabase supports it natively — this is what Like One uses for its brain system. Best for: teams already using Postgres who want to add semantic search without managing another service.


        **Pinecone**
        Fully managed, serverless. You push vectors in and query — no infrastructure to manage. Auto-scales. Best for: teams that want zero operational overhead and are willing to pay for convenience.


        **Chroma**
        Lightweight, open-source, runs locally with `pip install chromadb`. In-memory by default. Best for: prototyping, learning, and small projects. Not recommended for production workloads above ~100K vectors.


        **Weaviate**
        Open-source with built-in vectorization — it can embed text for you. Native hybrid search (BM25 + vector). Best for: production systems that need hybrid search and want a single solution for embedding + storage + search.


        **Qdrant**
        Rust-based, high-performance. Excellent filtering and payload support. Best for: high-throughput production workloads that need complex metadata filtering alongside vector search.


        **Milvus**
        Enterprise-grade, handles billions of vectors. Used by major tech companies. Best for: large enterprises with massive vector collections and dedicated infrastructure teams.



    **Recommendation:** If you are using Supabase, start with pgvector — it is already there. If you are prototyping, use Chroma. If you need production-grade managed infrastructure, use Pinecone or Weaviate.



    ## Storing Vectors with pgvector (Supabase)

    Here is a complete example of creating a vector table and storing embeddings in Supabase with pgvector — the same stack used in production by Like One:



```
-- Enable the pgvector extension (one-time setup)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store document chunks with embeddings
CREATE TABLE documents (
  id         BIGSERIAL PRIMARY KEY,
  content    TEXT NOT NULL,
  embedding  VECTOR(1536),       -- matches OpenAI small dimensions
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an HNSW index for fast similarity search
CREATE INDEX ON documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Search: find the 5 most similar documents to a query vector
SELECT id, content, 1 - (embedding  '[0.023, -0.041, ...]') AS similarity
FROM documents
ORDER BY embedding  '[0.023, -0.041, ...]'
LIMIT 5;
```


    The `` operator is pgvector's cosine distance operator. Lower distance = higher similarity. We subtract from 1 to convert distance to a similarity score (0 to 1).



    ## Storing Vectors with Chroma (Python)

    For quick prototyping, Chroma runs entirely in Python with no database setup:



```
import chromadb
from openai import OpenAI

client = OpenAI()
chroma = chromadb.Client()
collection = chroma.create_collection("my-docs")

# Documents to index
docs = [
    "Our refund policy allows returns within 30 days.",
    "Shipping delays should be escalated to the logistics team.",
    "Premium support includes 24/7 live chat.",
]

# Embed and store
for i, doc in enumerate(docs):
    embedding = client.embeddings.create(
        input=doc, model="text-embedding-3-small"
    ).data[0].embedding

    collection.add(
        ids=[f"doc-{i}"],
        embeddings=[embedding],
        documents=[doc]
    )

# Search for similar documents
query_vec = client.embeddings.create(
    input="How do I get a refund?",
    model="text-embedding-3-small"
).data[0].embedding

results = collection.query(query_embeddings=[query_vec], n_results=2)
print(results["documents"])
# [["Our refund policy allows returns within 30 days."]]
```


    Notice: "How do I get a refund?" matches "Our refund policy allows returns within 30 days" — even though the query uses different words. This is the power of semantic search.



    ## Metadata Filtering

    Real RAG systems do not just search by meaning — they also filter by metadata. A legal RAG system might search for semantically similar clauses *but only in contracts from 2024*. A support system might find relevant answers *but only for the customer's product tier*.

    All major vector databases support metadata filtering alongside vector search. This combination — semantic similarity + structured filters — is what makes vector databases production-ready. Without filtering, every search would return results from the entire corpus, which is rarely what you want.


      **Common Mistake:** Storing vectors without metadata. If you cannot filter by source, date, or category, your RAG system will return irrelevant results for any query that needs scope. Always store metadata alongside your vectors — you will need it.




    ## Choosing Your Vector Database

    The right choice depends on your existing stack, scale, and operational appetite. Here are the three most common production paths:



        **pgvector (PostgreSQL)**
        **Best for:** Teams already on Postgres/Supabase. Zero new infrastructure. Combine vector search with SQL joins, transactions, and row-level security in one database.
        **Tradeoff:** Slower than purpose-built solutions above ~10M vectors. HNSW index tuning requires Postgres expertise.


        **Pinecone**
        **Best for:** Teams that want zero ops. Fully managed, serverless, auto-scaling. Push vectors in, query out. Native sparse-dense hybrid search support.
        **Tradeoff:** Vendor lock-in. No self-hosting option. Costs scale with usage — can get expensive at high query volumes.


        **Qdrant**
        **Best for:** High-performance production workloads. Rust-based, excellent filtering, payload indexing. Self-host or use their cloud. Open-source with a strong community.
        **Tradeoff:** Requires running a separate service. More operational overhead than Pinecone or pgvector-in-Supabase.




  Test Your Understanding


### Quiz

**Q1: What does a vector database return when you search with a query?**
    A. Rows where a column exactly matches the query
  ✓ B. The top-K documents whose vectors are most similar in meaning
    C. All documents sorted alphabetically
    D. A count of how many documents mention the query word
  *Vector databases perform similarity search — they compare the query vector against all stored vectors and return the K nearest neighbors, ranked by cosine or dot-product similarity.*

**Q2: What index structure do most vector databases use to search billions of vectors quickly?**
    A. B-tree index
    B. Hash index
  ✓ C. HNSW (Hierarchical Navigable Small World)
    D. Full-text inverted index
  *HNSW is a graph-based index that allows approximate nearest-neighbor search in sub-linear time. Instead of scanning every vector, it navigates a layered graph to zoom in on likely neighbors quickly.*

**Q3: You are starting a RAG project and already use Supabase for your backend. Which vector database should you try first?**
    A. Pinecone — it is the most popular
    B. Chroma — it is the simplest
  ✓ C. pgvector — it is already available in your Supabase database
    D. Milvus — it handles the most scale
  *pgvector is a PostgreSQL extension that adds vector storage and similarity search to your existing database. Since Supabase is built on Postgres, pgvector is already available — no new infrastructure needed.*

**Q4: Why is metadata filtering important in production RAG systems?**
    A. It makes searches faster
  ✓ B. It allows you to scope searches to relevant subsets of your data
    C. It is required by all vector databases
    D. It improves embedding quality
  *Without metadata filtering, every search returns results from the entire corpus. In production, you need to scope searches — by date, category, user, product tier — to return relevant results rather than everything that is semantically similar.*



### Vector Database Fundamentals

**Card 1:**
Front: Vector Database
Back: A database optimized for storing and searching high-dimensional vectors by similarity rather than exact match. Finds "happy" when you search for "joyful."

**Card 2:**
Front: HNSW Index
Back: Hierarchical Navigable Small World — a graph-based index that finds approximate nearest neighbors in sub-linear time, enabling millisecond searches across billions of vectors.

**Card 3:**
Front: Top-K Results
Back: The K most similar document chunks returned from a vector search, ranked by similarity score. Typical K values: 3-10.

**Card 4:**
Front: pgvector
Back: A PostgreSQL extension that adds vector storage and similarity search to your existing Postgres database. Supported by Supabase. Uses the  operator for cosine distance.

**Card 5:**
Front: Metadata Filtering
Back: Restricting vector search results to a subset of documents based on structured fields (date, category, user). Essential for production RAG systems.

**Card 6:**
Front: Approximate Nearest Neighbor
Back: HNSW finds vectors that are APPROXIMATELY the closest, not guaranteed the absolute closest. Recall is 95-99%, which is sufficient for RAG.
