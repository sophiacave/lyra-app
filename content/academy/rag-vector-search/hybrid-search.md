---
title: "Hybrid Search"
course: "rag-vector-search"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Simulation</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~55 min</span>
    </div>
    <h1>Hybrid Search</h1>
    <p>Keyword search is precise. Vector search understands meaning. Hybrid search combines both for the best of both worlds.</p>
  </div>

  <div class="narration">
    <strong>The problem with pure approaches:</strong> Keyword search misses synonyms ("happy" won't find "joyful"). Vector search sometimes misses exact terms (searching for "error code 404" might return generic error pages). <strong>Hybrid search</strong> combines both: keyword matching for precision + vector similarity for understanding. The key parameter is the <strong>alpha weight</strong> — the balance between keyword and semantic scores. Typical production values are 0.3-0.7 semantic weight.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">When Each Approach Wins</h3>
  <div class="when-grid">
    <div class="when-card">
      <h4 style="color:#3b82f6">Keyword Search Wins</h4>
      <p>Error codes, product IDs, exact names, legal clauses, API endpoints. When the exact term IS the meaning.</p>
    </div>
    <div class="when-card">
      <h4 style="color:#10b981">Semantic Search Wins</h4>
      <p>Conceptual questions, synonym-heavy queries, "how to" questions, finding related content across different phrasings.</p>
    </div>
    <div class="when-card">
      <h4 style="color:#f59e0b">Hybrid Wins</h4>
      <p>Real-world queries that mix specific terms with concepts: "how to fix error 404 in React" needs both keyword AND semantic understanding.</p>
    </div>
  </div>

  <div class="narration">
    <strong>Implementation:</strong> Most vector databases support hybrid search natively. Weaviate uses BM25 + vector. Pinecone has sparse-dense vectors. The key parameter is the <strong>alpha weight</strong> — the balance between keyword and semantic scores. Typical production values are 0.3-0.7 semantic weight.
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Hybrid Search Quiz","questions":[{"q":"A user searches for \"Section 42(b)(3)\" in a legal document database. Which search type should be weighted higher?","options":["Pure semantic search — it understands legal concepts","Keyword search — the exact statute reference must match precisely","Neither — a full-text scan is better for legal documents","Equal weighting always produces the best results"],"correct":1,"explanation":"Exact identifiers like statute numbers, error codes, and product IDs require precise keyword matching. A semantic search might find related legal concepts but miss the specific section. For exact-term queries, weight keyword search higher in your hybrid alpha."},{"q":"What does the alpha parameter control in hybrid search?","options":["The number of results to return","The balance between keyword and semantic score contributions","The embedding model dimensions","The chunk size used during indexing"],"correct":1,"explanation":"Alpha (0 to 1) is the weight given to semantic vs keyword scores. Alpha=0 is pure keyword, alpha=1 is pure semantic, alpha=0.5 is equal weighting. Most production systems use alpha between 0.3 and 0.7 semantic weight depending on query type."},{"q":"Which vector database supports hybrid search natively with BM25 + vector?","options":["Redis","Chroma","Weaviate","SQLite"],"correct":2,"explanation":"Weaviate supports hybrid search natively, combining BM25 (a classic keyword relevance algorithm) with dense vector search. Pinecone also supports hybrid via sparse-dense vectors. Chroma is primarily a vector store and does not natively combine keyword search."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match the Query Type to the Best Search Strategy","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Search for \"HTTP 404 error\"","right":"Keyword-heavy hybrid (exact term matters)"},{"left":"Search for \"feeling unhappy at work\"","right":"Semantic-heavy hybrid (synonyms and concepts)"},{"left":"Search for \"how to fix React routing errors\"","right":"Balanced hybrid (mix of exact terms and concepts)"},{"left":"Search for product SKU \"XJ-4402-B\"","right":"Pure keyword (exact identifier match)"},{"left":"Search for \"tips for better sleep\"","right":"Semantic search (conceptual, many phrasings)"}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Hybrid Search Vocabulary","cards":[{"front":"BM25","back":"Best Match 25 — a classic keyword relevance algorithm that scores documents based on term frequency and inverse document frequency. The \"B\" side of hybrid search."},{"front":"Alpha weight","back":"The parameter (0-1) that controls how much semantic vs keyword score contributes to the hybrid result. Alpha=0.5 means equal weighting."},{"front":"Sparse vector","back":"A high-dimensional vector with mostly zero values, used to represent keyword presence. Used in sparse-dense hybrid approaches (e.g. Pinecone)."},{"front":"Dense vector","back":"A compact vector where all dimensions have values — the standard embedding output. Captures semantic meaning."},{"front":"Reciprocal Rank Fusion (RRF)","back":"An alternative to alpha weighting — merges keyword and semantic ranked lists by combining their rank positions rather than raw scores."}]}'></div>

</div>
