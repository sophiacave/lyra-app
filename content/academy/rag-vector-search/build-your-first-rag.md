---
title: "Build Your First RAG"
course: "rag-vector-search"
order: 5
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Builder</span>
      <span class="xp-badge">+250 XP</span>
      <span class="time-badge">~75 min</span>
    </div>
    <h1>Build Your First RAG</h1>
    <p>Walk through building a complete RAG system step by step. Choose your documents, chunk them, embed them, store them, and query them.</p>
  </div>

  <div class="narration">
    <strong>The six-step build:</strong> Every RAG system follows the same construction pattern regardless of scale. You will work through each stage — choosing documents, chunking, selecting an embedding model, storing vectors, querying, and generating answers. Understanding why each step exists is as important as knowing the code.
  </div>

  <div class="narration">
    <strong>Step 1 — Choose Documents:</strong> Your RAG system can only answer questions about information it has seen. The documents you select become the system's entire knowledge base. In production, this could be thousands of PDFs, web pages, or database records.
  </div>

  <div class="narration">
    <strong>Step 2 — Chunk:</strong> Documents are too long to embed as a single vector. We split them into smaller pieces so each chunk captures one focused idea, making search results more precise. A typical chunk is 40-100 words with 10-word overlap.
  </div>

  <div class="narration">
    <strong>Step 3 — Embed:</strong> The embedding model determines how well your system understands meaning. Better models produce more nuanced vectors but cost more. <strong>Recommendation:</strong> Start with text-embedding-3-small — it is the best balance of quality, speed, and cost for most use cases (1536 dimensions, $0.02/1M tokens).
  </div>

  <div class="narration">
    <strong>Step 4 — Store:</strong> Storing vectors in a specialized database (not a regular one) enables lightning-fast similarity search. An HNSW index is built automatically so searches take milliseconds, not minutes, even across tens of thousands of vectors.
  </div>

  <div class="narration">
    <strong>Step 5 — Query:</strong> Your question is converted to a vector, compared against all stored chunks, and the best matches are returned. The similarity score (0-1) tells you how relevant each chunk is to your question.
  </div>

  <div class="narration">
    <strong>Step 6 — Generate:</strong> The retrieved chunks are passed to the LLM as context, along with the original question. The LLM generates a grounded answer — because it has the actual documents, it gives specific, accurate, sourced answers instead of hallucinating.
  </div>

  <div data-learn="MatchConnect" data-props='{"title":"Match the RAG Build Step to What It Does","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Choose Documents","right":"Select the files that become the system\\\'s entire knowledge base"},{"left":"Chunk","right":"Split documents into 40-100 word pieces with overlap for precise search"},{"left":"Embed","right":"Convert each chunk into a vector using a model like text-embedding-3-small"},{"left":"Store","right":"Save vectors in a specialized database with an HNSW index for fast search"},{"left":"Generate","right":"Pass retrieved chunks and the query to the LLM for a grounded answer"}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"RAG Build Pipeline — Order the Steps","instruction":"Arrange the six build steps in the correct sequence","items":["Choose and load source documents","Chunk documents into overlapping segments","Select an embedding model and embed all chunks","Store chunk vectors in a vector database","Embed the user query and run similarity search","Pass retrieved chunks + query to LLM for generation"]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Build Your First RAG — Check Your Understanding","questions":[{"q":"Why is text-embedding-3-small often the recommended starting model for RAG?","options":["It is the only free embedding model available","It produces the highest possible quality vectors","It offers the best balance of quality, speed, and cost for most use cases","It is the only model compatible with Chroma"],"correct":2,"explanation":"text-embedding-3-small (1536 dimensions, $0.02/1M tokens) hits the sweet spot for most RAG applications. text-embedding-3-large has marginally better quality but costs 6x more. Start small and upgrade only if evaluations show a meaningful quality gap."},{"q":"What does the HNSW index in a vector database enable?","options":["Exact duplicate detection across all chunks","Fast approximate nearest-neighbor search without scanning every vector","Automatic re-embedding of stale chunks","Encryption of stored vectors"],"correct":1,"explanation":"HNSW (Hierarchical Navigable Small World) is a graph-based index that allows the database to find the most similar vectors in sub-linear time. Instead of comparing the query against every single stored vector, it navigates a layered graph to home in on the nearest neighbors efficiently."},{"q":"Why do you use temperature=0.1 (or a very low value) when generating RAG answers?","options":["Low temperature makes the model respond faster","Low temperature reduces hallucination by making the model more deterministic and less likely to improvise","Low temperature saves API tokens","Low temperature is required by the vector database"],"correct":1,"explanation":"Temperature controls randomness. A low temperature (0.0-0.2) makes the model stick closely to what the context supports, reducing creative improvisation. For factual RAG answers you want reliability over creativity."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"RAG Build — Key Parameters","cards":[{"front":"chunk_size","back":"Number of tokens (or words) per chunk. Typical starting value: 200-400 tokens. Tune based on query type and document structure."},{"front":"chunk_overlap","back":"Number of tokens repeated between adjacent chunks. Prevents boundary information loss. Typical: 10-20% of chunk_size."},{"front":"top_k","back":"How many chunks to retrieve per query. More chunks = more context for the LLM but higher token cost. Common values: 3-5."},{"front":"similarity_threshold","back":"Minimum similarity score to include a chunk. Filters out irrelevant results. Typical: 0.7-0.85 depending on your embedding model."},{"front":"temperature (generation)","back":"Controls LLM randomness. Set to 0.0-0.2 for factual RAG answers to minimize hallucination."}]}'></div>

</div>
