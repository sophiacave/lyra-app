---
title: "Hybrid Search"
course: "rag-vector-search"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Hybrid Search</h1>
  <p class="sub">Keyword search is precise but misses synonyms. Vector search understands meaning but sometimes misses exact terms. Hybrid search combines both — and it is what production RAG systems actually use. This lesson teaches you when each approach wins, how to implement hybrid search, and how to tune the balance between them.</p>
</div>

  <div class="section">
    <h2>The Problem with Pure Approaches</h2>
    <p><strong>Pure keyword search</strong> fails on synonyms. A user searches for "joyful" but the document says "happy." Zero results. The user searches for "fixing broken CI/CD" but the document says "troubleshooting deployment failures." Zero results. Keywords match characters, not meaning.</p>

    <p><strong>Pure vector search</strong> fails on exact terms. A user searches for "error code 404" and vector search returns generic pages about web errors — because semantically, all error pages are similar. But the user wanted the <em>specific</em> page about 404 errors. Vector search also struggles with proper nouns, product IDs, and technical identifiers that have no semantic content.</p>

    <p><strong>Hybrid search</strong> combines both: keyword matching for precision when exact terms matter, vector similarity for understanding when meaning matters. Real user queries are a mix of both — "how to fix error 404 in React" needs keyword matching for "404" and "React" <em>plus</em> semantic understanding of "how to fix." Hybrid search handles this naturally.</p>
  </div>

  <div class="section">
    <h2>When Each Approach Wins</h2>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">Keyword Wins</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Error codes, product IDs, exact names, legal statute numbers, API endpoints, version numbers. When the exact string IS the meaning.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Semantic Wins</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Conceptual questions, synonym-heavy queries, "how to" questions, comparative queries, finding related content across different phrasings.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Hybrid Wins</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Real-world queries that mix specific terms with concepts: "how to fix error 404 in React." Most actual user queries fall into this category.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>BM25 — The Keyword Side</h2>
    <p><strong>BM25</strong> (Best Match 25) is the standard keyword relevance algorithm. It scores documents based on two factors: how often the search terms appear in a document (<strong>term frequency</strong>) and how rare those terms are across all documents (<strong>inverse document frequency</strong>). A word that appears in every document (like "the") gets almost zero weight. A word that appears in only one document (like a specific product ID) gets high weight.</p>

    <p>BM25 is what powers traditional search engines. It is fast, well-understood, and excellent at finding exact matches. Its weakness is that it cannot handle synonyms or conceptual similarity — it only matches strings.</p>
  </div>

  <div class="section">
    <h2>The Alpha Parameter</h2>
    <p>Hybrid search combines keyword (BM25) and semantic (vector) scores using an <strong>alpha weight</strong>:</p>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">final_score = alpha × semantic_score + (1 - alpha) × keyword_score</strong><br><br>
      <strong>alpha = 0.0</strong> → Pure keyword search (BM25 only)<br>
      <strong>alpha = 0.5</strong> → Equal weighting (good starting point)<br>
      <strong>alpha = 1.0</strong> → Pure vector search (embeddings only)<br><br>
      Most production systems use <strong>alpha = 0.4-0.7</strong> (slightly favoring semantic). Tune based on your query patterns.
    </div>
  </div>

  <div class="section">
    <h2>Implementing Hybrid Search</h2>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Option 1: pgvector + Full-Text Search (Supabase)</h3>
    <p>Supabase gives you both vector and full-text search in one database:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Add a full-text search column to your documents table</span>
<span style="color:#c084fc">ALTER TABLE</span> documents
  <span style="color:#c084fc">ADD COLUMN</span> fts <span style="color:#38bdf8">TSVECTOR</span>
  <span style="color:#c084fc">GENERATED ALWAYS AS</span> (to_tsvector(<span style="color:#fbbf24">'english'</span>, content)) STORED;

<span style="color:#c084fc">CREATE INDEX ON</span> documents <span style="color:#c084fc">USING</span> gin(fts);

<span style="color:#71717a">-- Hybrid search function: combines vector + keyword scores</span>
<span style="color:#c084fc">CREATE OR REPLACE FUNCTION</span> hybrid_search(
  query_text <span style="color:#38bdf8">TEXT</span>,
  query_embedding <span style="color:#38bdf8">VECTOR(1536)</span>,
  alpha <span style="color:#38bdf8">FLOAT DEFAULT 0.5</span>,
  match_count <span style="color:#38bdf8">INT DEFAULT 5</span>
)
<span style="color:#c084fc">RETURNS TABLE</span> (
  id <span style="color:#38bdf8">BIGINT</span>,
  content <span style="color:#38bdf8">TEXT</span>,
  metadata <span style="color:#38bdf8">JSONB</span>,
  semantic_score <span style="color:#38bdf8">FLOAT</span>,
  keyword_score <span style="color:#38bdf8">FLOAT</span>,
  hybrid_score <span style="color:#38bdf8">FLOAT</span>
)
<span style="color:#c084fc">LANGUAGE</span> plpgsql <span style="color:#c084fc">AS</span> $$
<span style="color:#c084fc">BEGIN</span>
  <span style="color:#c084fc">RETURN QUERY</span>
  <span style="color:#c084fc">WITH</span> semantic <span style="color:#c084fc">AS</span> (
    <span style="color:#c084fc">SELECT</span> d.id, d.content, d.metadata,
           <span style="color:#fbbf24">1</span> - (d.embedding <=> query_embedding) <span style="color:#c084fc">AS</span> s_score
    <span style="color:#c084fc">FROM</span> documents d
    <span style="color:#c084fc">ORDER BY</span> d.embedding <=> query_embedding
    <span style="color:#c084fc">LIMIT</span> match_count * <span style="color:#fbbf24">3</span>  <span style="color:#71717a">-- over-fetch for merging</span>
  ),
  keyword <span style="color:#c084fc">AS</span> (
    <span style="color:#c084fc">SELECT</span> d.id,
           ts_rank(d.fts, plainto_tsquery(<span style="color:#fbbf24">'english'</span>, query_text)) <span style="color:#c084fc">AS</span> k_score
    <span style="color:#c084fc">FROM</span> documents d
    <span style="color:#c084fc">WHERE</span> d.fts @@ plainto_tsquery(<span style="color:#fbbf24">'english'</span>, query_text)
  )
  <span style="color:#c084fc">SELECT</span> s.id, s.content, s.metadata,
         s.s_score <span style="color:#c084fc">AS</span> semantic_score,
         <span style="color:#c084fc">COALESCE</span>(k.k_score, <span style="color:#fbbf24">0</span>) <span style="color:#c084fc">AS</span> keyword_score,
         (alpha * s.s_score + (<span style="color:#fbbf24">1</span> - alpha) * <span style="color:#c084fc">COALESCE</span>(k.k_score, <span style="color:#fbbf24">0</span>)) <span style="color:#c084fc">AS</span> hybrid_score
  <span style="color:#c084fc">FROM</span> semantic s
  <span style="color:#c084fc">LEFT JOIN</span> keyword k <span style="color:#c084fc">ON</span> s.id = k.id
  <span style="color:#c084fc">ORDER BY</span> hybrid_score <span style="color:#c084fc">DESC</span>
  <span style="color:#c084fc">LIMIT</span> match_count;
<span style="color:#c084fc">END</span>;
$$;</code></pre>
    </div>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Option 2: Reciprocal Rank Fusion (RRF)</h3>
    <p>An alternative to alpha weighting — RRF merges two ranked lists by combining their rank positions rather than raw scores. This avoids the problem of normalizing scores from different systems:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">reciprocal_rank_fusion</span>(keyword_results, vector_results, k=<span style="color:#fbbf24">60</span>):
    <span style="color:#fb923c">"""Merge two ranked lists using Reciprocal Rank Fusion."""</span>
    scores = {}

    <span style="color:#c084fc">for</span> rank, doc_id <span style="color:#c084fc">in</span> <span style="color:#34d399">enumerate</span>(keyword_results):
        scores[doc_id] = scores.get(doc_id, <span style="color:#fbbf24">0</span>) + <span style="color:#fbbf24">1</span> / (k + rank + <span style="color:#fbbf24">1</span>)

    <span style="color:#c084fc">for</span> rank, doc_id <span style="color:#c084fc">in</span> <span style="color:#34d399">enumerate</span>(vector_results):
        scores[doc_id] = scores.get(doc_id, <span style="color:#fbbf24">0</span>) + <span style="color:#fbbf24">1</span> / (k + rank + <span style="color:#fbbf24">1</span>)

    <span style="color:#71717a"># Sort by combined RRF score</span>
    <span style="color:#c084fc">return</span> <span style="color:#34d399">sorted</span>(scores.items(), key=<span style="color:#c084fc">lambda</span> x: x[<span style="color:#fbbf24">1</span>], reverse=<span style="color:#34d399">True</span>)</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">RRF is simpler to implement and avoids score normalization issues. It works well when you have separate keyword and vector search systems that return differently scaled scores.</p>
  </div>

  <div class="section">
    <h2>Tuning Alpha by Query Type</h2>
    <p>The optimal alpha depends on your users' query patterns. Some systems detect query type automatically and adjust alpha on the fly:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> re

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">adaptive_alpha</span>(query):
    <span style="color:#fb923c">"""Choose alpha based on query characteristics."""</span>

    <span style="color:#71717a"># Exact identifiers → favor keywords</span>
    <span style="color:#c084fc">if</span> re.search(<span style="color:#fbbf24">r'(error|code|id|version|section)\s*[\d#]'</span>, query, re.I):
        <span style="color:#c084fc">return</span> <span style="color:#fbbf24">0.3</span>  <span style="color:#71717a"># 30% semantic, 70% keyword</span>

    <span style="color:#71717a"># Conceptual questions → favor semantic</span>
    <span style="color:#c084fc">if</span> re.search(<span style="color:#fbbf24">r'^(how|why|what|explain|describe)'</span>, query, re.I):
        <span style="color:#c084fc">return</span> <span style="color:#fbbf24">0.7</span>  <span style="color:#71717a"># 70% semantic, 30% keyword</span>

    <span style="color:#71717a"># Mixed or unclear → balanced</span>
    <span style="color:#c084fc">return</span> <span style="color:#fbbf24">0.5</span>  <span style="color:#71717a"># 50/50 default</span></code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Which Vector Databases Support Hybrid?</h2>
    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">Weaviate</strong> — Native hybrid search with BM25 + vector. The alpha parameter is built into the API. Best native implementation.<br>
      <strong style="color:#e5e5e5">Pinecone</strong> — Sparse-dense vectors. You provide both a sparse (keyword) and dense (semantic) vector per document. Supports alpha weighting.<br>
      <strong style="color:#e5e5e5">Supabase/pgvector</strong> — Combine pgvector cosine search with PostgreSQL full-text search (tsvector/tsquery). Requires a custom function (shown above) but very powerful.<br>
      <strong style="color:#e5e5e5">Qdrant</strong> — Supports combining vector search with payload filters and full-text search. Flexible filtering system.<br>
      <strong style="color:#e5e5e5">Chroma</strong> — Does not natively support hybrid search. You would need to run keyword and vector searches separately and merge results in your application code.
    </div>
  </div>

  <div class="section">
    <h2>Hybrid Search in Production</h2>
    <p>Hybrid search is not a "set it and forget it" feature. These production tips will save you weeks of debugging:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">1. Start with alpha = 0.5, then tune with real queries</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Log your users' actual search queries for two weeks before adjusting. Most teams find alpha = 0.5-0.6 is optimal for mixed workloads — but your data is unique. Let the data decide, not intuition.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">2. Monitor search quality continuously</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Track click-through rates and "no results" rates for both keyword and semantic components separately. If keyword CTR drops while semantic stays high, your BM25 index may need retuning. If semantic drops, your embeddings may be stale or your chunking strategy needs revision.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">3. A/B test keyword vs vector weights</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Run 50% of traffic at alpha = 0.5 and 50% at alpha = 0.6. Measure which cohort has higher engagement, lower bounce rates, and fewer follow-up searches. Small alpha shifts (0.05-0.1) can produce measurably different user satisfaction.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">4. Reindex when your corpus changes significantly</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Adding a new document category (e.g., adding API docs to a support knowledge base) shifts the BM25 IDF weights. Full-text indexes should be rebuilt after major corpus changes to keep keyword scores accurate.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">5. Log both score components</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">For every search result, log the semantic score and keyword score separately alongside the final hybrid score. When debugging poor results, these logs tell you instantly whether the problem is on the keyword side, the semantic side, or the fusion logic.</p>
      </div>
    </div>

    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Most teams spend weeks tuning their embedding model — then leave the alpha parameter at the default value forever. Alpha is often the highest-leverage parameter in your entire search stack. Tune it, measure it, and revisit it quarterly.</p>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"Hybrid Search Quiz","questions":[{"q":"A user searches for \"Section 42(b)(3)\" in a legal document database. Which search type should be weighted higher?","options":["Pure semantic search — it understands legal concepts","Keyword search — the exact statute reference must match precisely","Neither — a full-text scan is better for legal documents","Equal weighting always produces the best results"],"correct":1,"explanation":"Exact identifiers like statute numbers, error codes, and product IDs require precise keyword matching. A semantic search might find related legal concepts but miss the specific section."},{"q":"What does the alpha parameter control in hybrid search?","options":["The number of results to return","The balance between keyword and semantic score contributions","The embedding model dimensions","The chunk size used during indexing"],"correct":1,"explanation":"Alpha (0 to 1) is the weight given to semantic vs keyword scores. Alpha=0 is pure keyword, alpha=1 is pure semantic, alpha=0.5 is equal weighting."},{"q":"What is Reciprocal Rank Fusion (RRF)?","options":["A way to compress vectors","An alternative to alpha weighting that merges ranked lists by position rather than raw scores","A technique for generating embeddings","A method for chunking documents"],"correct":1,"explanation":"RRF combines results from keyword and vector search by their rank positions rather than raw scores. This avoids the problem of normalizing scores from different systems and is simpler to implement than alpha-weighted fusion."},{"q":"A user queries \"how to fix React rendering bugs.\" What alpha value is best?","options":["alpha=0.0 — pure keyword","alpha=0.3 — mostly keyword","alpha=0.7 — mostly semantic","alpha=1.0 — pure semantic"],"correct":2,"explanation":"This is a conceptual \"how to\" question that benefits from semantic understanding (finding pages about debugging and performance), but \"React\" and \"rendering\" are specific terms that keyword matching should catch. A higher semantic weight (0.7) with some keyword backing is ideal."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Hybrid Search Vocabulary","cards":[{"front":"BM25","back":"Best Match 25 — a classic keyword relevance algorithm that scores documents based on term frequency and inverse document frequency. The keyword side of hybrid search."},{"front":"Alpha Weight","back":"The parameter (0-1) controlling semantic vs keyword balance. Alpha=0 = pure keyword. Alpha=1 = pure semantic. Most production systems: 0.4-0.7."},{"front":"Sparse Vector","back":"A high-dimensional vector with mostly zero values, representing keyword presence. Used in sparse-dense hybrid approaches (e.g., Pinecone)."},{"front":"Dense Vector","back":"A compact vector where all dimensions have values — the standard embedding output. Captures semantic meaning."},{"front":"Reciprocal Rank Fusion (RRF)","back":"Merges keyword and semantic ranked lists by combining rank positions (1/(k+rank)) rather than raw scores. Avoids score normalization issues."},{"front":"tsvector (PostgreSQL)","back":"PostgreSQL\u0027s built-in full-text search data type. Stores a sorted list of normalized lexemes for efficient keyword matching with the @@ operator."}]}'></div>

</div>
