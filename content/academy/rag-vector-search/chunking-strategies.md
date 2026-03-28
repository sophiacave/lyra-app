---
title: "Chunking Strategies"
course: "rag-vector-search"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~55 min</span>
    </div>
    <h1>Chunking Strategies</h1>
    <p>Before you can search your documents, you need to split them into chunks. The size and overlap of those chunks dramatically affects retrieval quality.</p>
  </div>

  <div class="narration">
    <strong>Why chunk at all?</strong> Embedding models have token limits (typically 512-8192 tokens). A <strong>token</strong> is roughly 3/4 of a word -- so 100 tokens is about 75 words. A 50-page document won't fit into one embedding. We split it into smaller pieces, embed each piece separately, then search across all chunks. The art is choosing the right chunk size and overlap.
  </div>

  <div class="narration">
    <strong>Rules of thumb:</strong> Start with 200-500 token chunks and 10-20% overlap. <strong>Good overlap</strong> means repeating the last 10-20% of each chunk at the beginning of the next one -- for example, a 100-word chunk with 15-word overlap. This ensures sentences that fall on the boundary between two chunks are not lost. For technical docs, use larger chunks. For Q&A, use smaller chunks. Always test with real queries -- the "best" chunk size depends on your data and questions.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Chunk Size Tradeoffs</h3>
  <div class="tradeoffs">
    <div class="tradeoff good">
      <h4>Small Chunks (50-200 words)</h4>
      <p>More precise retrieval. Better for specific factual questions. Faster embedding. But may lose context needed to understand the passage.</p>
    </div>
    <div class="tradeoff good">
      <h4>Large Chunks (200-500 words)</h4>
      <p>More context preserved. Better for complex questions requiring reasoning. But may include irrelevant info that confuses the LLM.</p>
    </div>
    <div class="tradeoff bad">
      <h4>Too Small (&lt;50 words)</h4>
      <p>Chunks become meaningless fragments. "The cat sat on" tells the LLM nothing useful. Retrieval becomes noise.</p>
    </div>
    <div class="tradeoff bad">
      <h4>Too Large (&gt;500 words)</h4>
      <p>Dilutes relevance. A chunk about 10 topics matches everything poorly. Also wastes LLM context window tokens.</p>
    </div>
  </div>

  <div data-learn="MatchConnect" data-props='{"title":"Match the Chunking Strategy to Its Description","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Fixed-size chunking","right":"Split every N words regardless of sentence boundaries — simple but can cut mid-thought"},{"left":"Sentence-based chunking","right":"Group complete sentences until reaching target size — preserves natural boundaries"},{"left":"Paragraph-based chunking","right":"Use double newlines as split points — respects document structure"},{"left":"Semantic chunking","right":"Split at natural topic shifts detected by the model — most accurate but expensive"},{"left":"Chunk overlap","right":"Repeating last N words of one chunk at the start of the next to prevent boundary loss"}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Chunking Knowledge Check","questions":[{"q":"Why do we need to chunk documents before embedding them?","options":["Smaller files are cheaper to store","Embedding models have token limits and cannot process full documents as a single vector","Chunks load faster in the browser","Vector databases only accept chunks, not full documents"],"correct":1,"explanation":"Embedding models have maximum token limits (typically 512-8192 tokens). Long documents must be split into chunks so each piece can be embedded individually. This also improves retrieval precision since each chunk covers a focused topic."},{"q":"What is the purpose of overlap between chunks?","options":["To make the index larger","To prevent information at chunk boundaries from being lost","To reduce the number of embeddings needed","To increase cosine similarity scores"],"correct":1,"explanation":"Overlap repeats the end of one chunk at the start of the next. This ensures that a sentence or idea spanning the boundary between two chunks is fully represented in at least one chunk, so it is not lost during retrieval."},{"q":"For a customer support FAQ system, which chunk size is generally best?","options":["Very large chunks (1000+ words) to capture full context","Very small chunks (<30 words) for maximum speed","Medium chunks (100-300 words) balancing precision and context","Chunk size does not matter for Q&A systems"],"correct":2,"explanation":"Q&A systems benefit from focused, medium-sized chunks. Large enough to preserve context around an answer, small enough that each chunk covers one specific topic — maximizing retrieval precision."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Chunking Flashcards","cards":[{"front":"Token","back":"Roughly 3/4 of a word. 100 tokens ≈ 75 words. Embedding models have a maximum token limit per input."},{"front":"Chunk Overlap","back":"Repeating the last N words of one chunk at the start of the next. Prevents boundary information loss. Typical: 10-20% of chunk size."},{"front":"Fixed-size chunking","back":"Split text every N words regardless of sentence boundaries. Simple but can cut sentences mid-thought."},{"front":"Sentence-based chunking","back":"Group complete sentences until the chunk reaches the target size. Preserves natural language boundaries."},{"front":"Paragraph-based chunking","back":"Use double newlines as split points. Respects document structure — each paragraph becomes one or more chunks."},{"front":"Semantic chunking","back":"Split at natural topic shifts detected by the model. Most accurate but most computationally expensive."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Chunking Pipeline — Order the Steps","instruction":"Arrange these document processing steps in the correct order","items":["Load raw documents (PDFs, web pages, text files)","Split documents into chunks using chosen strategy and size","Embed each chunk using an embedding model","Store chunk vectors + metadata in the vector database"]}'></div>

</div>
