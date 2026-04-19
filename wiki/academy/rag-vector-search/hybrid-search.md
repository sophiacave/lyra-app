# Hybrid Search

**Course:** RAG & Vector Search
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 7 of 10


  # Hybrid Search

  Keyword search is precise but misses synonyms. Vector search understands meaning but sometimes misses exact terms. Hybrid search combines both — and it is what production RAG systems actually use. This lesson teaches you when each approach wins, how to implement hybrid search, and how to tune the balance between them.



    ## The Problem with Pure Approaches

    **Pure keyword search** fails on synonyms. A user searches for "joyful" but the document says "happy." Zero results. The user searches for "fixing broken CI/CD" but the document says "troubleshooting deployment failures." Zero results. Keywords match characters, not meaning.

    **Pure vector search** fails on exact terms. A user searches for "error code 404" and vector search returns generic pages about web errors — because semantically, all error pages are similar. But the user wanted the *specific* page about 404 errors. Vector search also struggles with proper nouns, product IDs, and technical identifiers that have no semantic content.

    **Hybrid search** combines both: keyword matching for precision when exact terms matter, vector similarity for understanding when meaning matters. Real user queries are a mix of both — "how to fix error 404 in React" needs keyword matching for "404" and "React" *plus* semantic understanding of "how to fix." Hybrid search handles this naturally.



    ## When Each Approach Wins




        **Keyword Wins**
        Error codes, product IDs, exact names, legal statute numbers, API endpoints, version numbers. When the exact string IS the meaning.


        **Semantic Wins**
        Conceptual questions, synonym-heavy queries, "how to" questions, comparative queries, finding related content across different phrasings.


        **Hybrid Wins**
        Real-world queries that mix specific terms with concepts: "how to fix error 404 in React." Most actual user queries fall into this category.





    ## BM25 — The Keyword Side

    **BM25** (Best Match 25) is the standard keyword relevance algorithm. It scores documents based on two factors: how often the search terms appear in a document (**term frequency**) and how rare those terms are across all documents (**inverse document frequency**). A word that appears in every document (like "the") gets almost zero weight. A word that appears in only one document (like a specific product ID) gets high weight.

    BM25 is what powers traditional search engines. It is fast, well-understood, and excellent at finding exact matches. Its weakness is that it cannot handle synonyms or conceptual similarity — it only matches strings.



    ## The Alpha Parameter

    Hybrid search combines keyword (BM25) and semantic (vector) scores using an **alpha weight**:


      **final_score = alpha × semantic_score + (1 - alpha) × keyword_score**


      **alpha = 0.0** → Pure keyword search (BM25 only)

      **alpha = 0.5** → Equal weighting (good starting point)

      **alpha = 1.0** → Pure vector search (embeddings only)


      Most production systems use **alpha = 0.4-0.7** (slightly favoring semantic). Tune based on your query patterns.




    ## Implementing Hybrid Search


    ### Option 1: pgvector + Full-Text Search (Supabase)

    Supabase gives you both vector and full-text search in one database:



```
-- Add a full-text search column to your documents table
ALTER TABLE documents
  ADD COLUMN fts TSVECTOR
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

CREATE INDEX ON documents USING gin(fts);

-- Hybrid search function: combines vector + keyword scores
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text TEXT,
  query_embedding VECTOR(1536),
  alpha FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  semantic_score FLOAT,
  keyword_score FLOAT,
  hybrid_score FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH semantic AS (
    SELECT d.id, d.content, d.metadata,
           1 - (d.embedding  query_embedding) AS s_score
    FROM documents d
    ORDER BY d.embedding  query_embedding
    LIMIT match_count * 3  -- over-fetch for merging
  ),
  keyword AS (
    SELECT d.id,
           ts_rank(d.fts, plainto_tsquery('english', query_text)) AS k_score
    FROM documents d
    WHERE d.fts @@ plainto_tsquery('english', query_text)
  )
  SELECT s.id, s.content, s.metadata,
         s.s_score AS semantic_score,
         COALESCE(k.k_score, 0) AS keyword_score,
         (alpha * s.s_score + (1 - alpha) * COALESCE(k.k_score, 0)) AS hybrid_score
  FROM semantic s
  LEFT JOIN keyword k ON s.id = k.id
  ORDER BY hybrid_score DESC
  LIMIT match_count;
END;
$$;
```



    ### Option 2: Reciprocal Rank Fusion (RRF)

    An alternative to alpha weighting — RRF merges two ranked lists by combining their rank positions rather than raw scores. This avoids the problem of normalizing scores from different systems:



```
def reciprocal_rank_fusion(keyword_results, vector_results, k=60):
    """Merge two ranked lists using Reciprocal Rank Fusion."""
    scores = {}

    for rank, doc_id in enumerate(keyword_results):
        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)

    for rank, doc_id in enumerate(vector_results):
        scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)

    # Sort by combined RRF score
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
```


    RRF is simpler to implement and avoids score normalization issues. It works well when you have separate keyword and vector search systems that return differently scaled scores.



    ## Tuning Alpha by Query Type

    The optimal alpha depends on your users' query patterns. Some systems detect query type automatically and adjust alpha on the fly:



```
import re

def adaptive_alpha(query):
    """Choose alpha based on query characteristics."""

    # Exact identifiers → favor keywords
    if re.search(r'(error|code|id|version|section)\s*[\d#]', query, re.I):
        return 0.3  # 30% semantic, 70% keyword

    # Conceptual questions → favor semantic
    if re.search(r'^(how|why|what|explain|describe)', query, re.I):
        return 0.7  # 70% semantic, 30% keyword

    # Mixed or unclear → balanced
    return 0.5  # 50/50 default
```





    ## Which Vector Databases Support Hybrid?


      **Weaviate** — Native hybrid search with BM25 + vector. The alpha parameter is built into the API. Best native implementation.

      **Pinecone** — Sparse-dense vectors. You provide both a sparse (keyword) and dense (semantic) vector per document. Supports alpha weighting.

      **Supabase/pgvector** — Combine pgvector cosine search with PostgreSQL full-text search (tsvector/tsquery). Requires a custom function (shown above) but very powerful.

      **Qdrant** — Supports combining vector search with payload filters and full-text search. Flexible filtering system.

      **Chroma** — Does not natively support hybrid search. You would need to run keyword and vector searches separately and merge results in your application code.




    ## Hybrid Search in Production

    Hybrid search is not a "set it and forget it" feature. These production tips will save you weeks of debugging:



        **1. Start with alpha = 0.5, then tune with real queries**
        Log your users' actual search queries for two weeks before adjusting. Most teams find alpha = 0.5-0.6 is optimal for mixed workloads — but your data is unique. Let the data decide, not intuition.


        **2. Monitor search quality continuously**
        Track click-through rates and "no results" rates for both keyword and semantic components separately. If keyword CTR drops while semantic stays high, your BM25 index may need retuning. If semantic drops, your embeddings may be stale or your chunking strategy needs revision.


        **3. A/B test keyword vs vector weights**
        Run 50% of traffic at alpha = 0.5 and 50% at alpha = 0.6. Measure which cohort has higher engagement, lower bounce rates, and fewer follow-up searches. Small alpha shifts (0.05-0.1) can produce measurably different user satisfaction.


        **4. Reindex when your corpus changes significantly**
        Adding a new document category (e.g., adding API docs to a support knowledge base) shifts the BM25 IDF weights. Full-text indexes should be rebuilt after major corpus changes to keep keyword scores accurate.


        **5. Log both score components**
        For every search result, log the semantic score and keyword score separately alongside the final hybrid score. When debugging poor results, these logs tell you instantly whether the problem is on the keyword side, the semantic side, or the fusion logic.



    Most teams spend weeks tuning their embedding model — then leave the alpha parameter at the default value forever. Alpha is often the highest-leverage parameter in your entire search stack. Tune it, measure it, and revisit it quarterly.


  Test Your Understanding


### Quiz

**Q1: A user searches for "Section 42(b)(3)" in a legal document database. Which search type should be weighted higher?**
    A. Pure semantic search — it understands legal concepts
  ✓ B. Keyword search — the exact statute reference must match precisely
    C. Neither — a full-text scan is better for legal documents
    D. Equal weighting always produces the best results
  *Exact identifiers like statute numbers, error codes, and product IDs require precise keyword matching. A semantic search might find related legal concepts but miss the specific section.*

**Q2: What does the alpha parameter control in hybrid search?**
    A. The number of results to return
  ✓ B. The balance between keyword and semantic score contributions
    C. The embedding model dimensions
    D. The chunk size used during indexing
  *Alpha (0 to 1) is the weight given to semantic vs keyword scores. Alpha=0 is pure keyword, alpha=1 is pure semantic, alpha=0.5 is equal weighting.*

**Q3: What is Reciprocal Rank Fusion (RRF)?**
    A. A way to compress vectors
  ✓ B. An alternative to alpha weighting that merges ranked lists by position rather than raw scores
    C. A technique for generating embeddings
    D. A method for chunking documents
  *RRF combines results from keyword and vector search by their rank positions rather than raw scores. This avoids the problem of normalizing scores from different systems and is simpler to implement than alpha-weighted fusion.*

**Q4: A user queries "how to fix React rendering bugs." What alpha value is best?**
    A. alpha=0.0 — pure keyword
    B. alpha=0.3 — mostly keyword
  ✓ C. alpha=0.7 — mostly semantic
    D. alpha=1.0 — pure semantic
  *This is a conceptual "how to" question that benefits from semantic understanding (finding pages about debugging and performance), but "React" and "rendering" are specific terms that keyword matching should catch. A higher semantic weight (0.7) with some keyword backing is ideal.*



### Hybrid Search Vocabulary

**Card 1:**
Front: BM25
Back: Best Match 25 — a classic keyword relevance algorithm that scores documents based on term frequency and inverse document frequency. The keyword side of hybrid search.

**Card 2:**
Front: Alpha Weight
Back: The parameter (0-1) controlling semantic vs keyword balance. Alpha=0 = pure keyword. Alpha=1 = pure semantic. Most production systems: 0.4-0.7.

**Card 3:**
Front: Sparse Vector
Back: A high-dimensional vector with mostly zero values, representing keyword presence. Used in sparse-dense hybrid approaches (e.g., Pinecone).

**Card 4:**
Front: Dense Vector
Back: A compact vector where all dimensions have values — the standard embedding output. Captures semantic meaning.

**Card 5:**
Front: Reciprocal Rank Fusion (RRF)
Back: Merges keyword and semantic ranked lists by combining rank positions (1/(k+rank)) rather than raw scores. Avoids score normalization issues.

**Card 6:**
Front: tsvector (PostgreSQL)
Back: PostgreSQL's built-in full-text search data type. Stores a sorted list of normalized lexemes for efficient keyword matching with the @@ operator.
