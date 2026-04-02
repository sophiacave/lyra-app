---
title: "What Are Embeddings?"
course: "rag-vector-search"
order: 1
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 1</div>
  <h1>What Are Embeddings?</h1>
  <p class="subtitle">Every word, sentence, and document can become a list of numbers — a vector — that captures its meaning. Embeddings are the foundation of modern AI search. Without them, there is no RAG. This lesson teaches you what they are, how they work, and how to create them in code.</p>

  <div class="section">
    <h2>The Core Idea</h2>
    <p>Imagine you could place every word in the English language on a giant map. Words with similar meanings — like "happy" and "joyful" — would be close together. Words with unrelated meanings — like "happy" and "database" — would be far apart. That map exists. It is called an <strong>embedding space</strong>, and it is how modern AI understands meaning.</p>

    <p>An <strong>embedding</strong> is a list of numbers (a vector) that represents the meaning of a piece of text. The word "happy" might become <code>[0.23, -0.41, 0.87, ...]</code> — a list of 1,536 numbers that encode everything the model understands about that word: its sentiment, its formality, its relationship to other concepts. The word "joyful" produces a very similar list of numbers, because the meanings are close. The word "database" produces a completely different list.</p>

    <p>This is not keyword matching. Keyword matching asks: "Do these two strings contain the same characters?" Embeddings ask: "Do these two texts <em>mean</em> the same thing?" This distinction is the foundation of everything in RAG.</p>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Definition:</strong> An embedding is a fixed-length vector of floating-point numbers produced by a neural network, where the geometric position in the vector space encodes the semantic meaning of the input text. Texts with similar meanings produce vectors that are close together; texts with different meanings produce vectors that are far apart.
    </div>
  </div>

  <div class="section">
    <h2>Why Embeddings Matter for RAG</h2>
    <p>Imagine you have a knowledge base of 10,000 documents and a user asks: "How do I handle customer complaints about late deliveries?" A keyword search for that exact phrase might return nothing — your documents say "managing client escalations regarding shipping delays." Same meaning, completely different words.</p>

    <p>With embeddings, both the question and every document are converted to vectors. The question vector and the document vector end up close together in the embedding space — because they <em>mean</em> the same thing. The vector database finds the match in milliseconds, even across millions of documents.</p>

    <p>This is the <strong>Retrieval</strong> in Retrieval-Augmented Generation. Without embeddings, there is no intelligent retrieval. Without intelligent retrieval, the LLM has no relevant context. Without context, it hallucinates. Embeddings are the first domino.</p>
  </div>

  <div class="section">
    <h2>How Embedding Models Work</h2>
    <p>Embedding models are neural networks trained on billions of text examples. During training, they learn a simple rule: <strong>texts that appear in similar contexts should produce similar vectors</strong>. This is called <strong>contrastive learning</strong> — the model is shown pairs of texts and learns to pull similar pairs together and push dissimilar pairs apart in the vector space.</p>

    <p>The result is a model that has internalized the relationships between words, phrases, and concepts. It knows that "king" and "queen" are related. It knows that "Python" in a programming context is different from "python" in a biology context. It captures nuance that keyword matching cannot.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Popular Embedding Models</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>OpenAI text-embedding-3-small</strong> — 1,536 dimensions, $0.02/1M tokens. Best balance of quality, speed, and cost for most use cases.</p>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>OpenAI text-embedding-3-large</strong> — 3,072 dimensions, $0.13/1M tokens. Higher quality, 6x the cost.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Free / Open-Source Models</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>BGE-small-en</strong> — 384 dimensions. Free, runs locally. Used by Like One's brain system.</p>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>E5-large-v2</strong> — 1,024 dimensions. Free via HuggingFace. Strong multilingual support.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Dimensions and What They Mean</h2>
    <p>When we say a model produces 1,536-dimensional embeddings, that means each text becomes a list of 1,536 numbers. Each number represents one <em>aspect</em> of meaning — though no single dimension maps neatly to a human concept like "sentiment" or "formality." The model learns its own abstract features during training.</p>

    <p>More dimensions means more nuance. A 384-dimensional embedding captures the broad strokes — topic, sentiment, domain. A 3,072-dimensional embedding captures finer distinctions — tone, register, subtle relationships between concepts. The tradeoff is storage and compute cost: more dimensions means larger vectors, more memory, and slightly slower searches.</p>

    <p>For most RAG applications, 1,536 dimensions is the sweet spot. You get excellent semantic understanding without excessive storage costs. Start there and only upgrade if your evaluation metrics (covered in Lesson 8) show a meaningful quality gap.</p>
  </div>

  <div class="section">
    <h2>Cosine Similarity — Measuring Meaning</h2>
    <p>Once you have two vectors, you need a way to measure how similar they are. The standard metric is <strong>cosine similarity</strong>, which measures the angle between two vectors. If they point in the same direction, the cosine is 1.0 (identical meaning). If they are perpendicular, it is 0 (unrelated). If they point in opposite directions, it is -1.</p>

    <p>Why cosine instead of regular distance? Because cosine similarity is <strong>magnitude-independent</strong>. A long vector and a short vector pointing in the same direction are considered equally similar. This matters because embedding models sometimes produce vectors of different lengths for different inputs — we care about the <em>direction</em> (meaning), not the <em>length</em>.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> numpy <span style="color:#c084fc">as</span> np

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">cosine_similarity</span>(vec_a, vec_b):
    <span style="color:#fb923c">"""Measure how similar two embedding vectors are."""</span>
    dot_product = np.dot(vec_a, vec_b)
    magnitude_a = np.linalg.norm(vec_a)
    magnitude_b = np.linalg.norm(vec_b)
    <span style="color:#c084fc">return</span> dot_product / (magnitude_a * magnitude_b)

<span style="color:#71717a"># Example: compare three sentences</span>
happy_vec  = embed(<span style="color:#fbbf24">"I am so happy today"</span>)
joyful_vec = embed(<span style="color:#fbbf24">"I feel joyful and alive"</span>)
db_vec     = embed(<span style="color:#fbbf24">"PostgreSQL database indexing"</span>)

<span style="color:#34d399">print</span>(cosine_similarity(happy_vec, joyful_vec))  <span style="color:#71717a"># ~0.92 — very similar</span>
<span style="color:#34d399">print</span>(cosine_similarity(happy_vec, db_vec))      <span style="color:#71717a"># ~0.12 — completely unrelated</span></code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">The cosine similarity score tells you at a glance whether two texts are semantically related. In RAG, you typically retrieve chunks with a similarity score above 0.7-0.85.</p>
  </div>

  <div class="section">
    <h2>Creating Embeddings in Code</h2>
    <p>Here is how you generate embeddings using the OpenAI API — the most common approach in production RAG systems:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> openai <span style="color:#c084fc">import</span> OpenAI

client = OpenAI()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">get_embedding</span>(text, model=<span style="color:#fbbf24">"text-embedding-3-small"</span>):
    <span style="color:#fb923c">"""Convert text to a 1536-dimensional vector."""</span>
    response = client.embeddings.create(
        input=text,
        model=model
    )
    <span style="color:#c084fc">return</span> response.data[<span style="color:#fbbf24">0</span>].embedding

<span style="color:#71717a"># Embed a single sentence</span>
vector = get_embedding(<span style="color:#fbbf24">"How do I handle customer complaints?"</span>)
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Dimensions: {len(vector)}"</span>)  <span style="color:#71717a"># 1536</span>
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"First 5 values: {vector[:5]}"</span>)  <span style="color:#71717a"># [0.023, -0.041, ...]</span>

<span style="color:#71717a"># Embed a batch of documents (more efficient)</span>
documents = [
    <span style="color:#fbbf24">"Our refund policy allows returns within 30 days."</span>,
    <span style="color:#fbbf24">"Shipping delays should be escalated to logistics."</span>,
    <span style="color:#fbbf24">"Customer satisfaction surveys are sent quarterly."</span>,
]
response = client.embeddings.create(input=documents, model=<span style="color:#fbbf24">"text-embedding-3-small"</span>)
vectors = [item.embedding <span style="color:#c084fc">for</span> item <span style="color:#c084fc">in</span> response.data]
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Embedded {len(vectors)} documents"</span>)  <span style="color:#71717a"># 3</span></code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Batch embedding is significantly cheaper and faster than embedding one document at a time. Always batch when processing large document collections.</p>
  </div>

  <div class="section">
    <h2>The Semantic Space</h2>
    <p>Embedding models learn surprising relationships from their training data. The most famous example is the <strong>word analogy</strong>: the vector for "king" minus "man" plus "woman" produces a vector close to "queen." The model learned gender relationships from context alone — nobody told it that kings and queens are related.</p>

    <p>This emergent structure is what makes embeddings so powerful for search. You do not need to anticipate every way a user might phrase a question. If the meaning is similar, the vectors will be close. A query about "fixing broken CI/CD pipelines" will match documents about "debugging deployment failures" — because the embedding model understands they describe the same problem.</p>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Limitations to know:</strong> Embeddings are not perfect. They can struggle with negation ("happy" vs. "not happy" may be closer than expected), rare domain-specific jargon, and very short queries (a single word has less context for the model to work with). These limitations are why Lesson 7 covers hybrid search — combining embeddings with keyword matching for the best of both worlds.
    </div>
  </div>

  <div class="section">
    <h2>Choosing the Right Model</h2>
    <p>The embedding model you choose determines the quality of your entire RAG system. Here are the key factors:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Quality vs. Cost</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">text-embedding-3-small costs $0.02 per million tokens. text-embedding-3-large costs $0.13 per million tokens — 6x more for a marginal quality improvement. Start small, measure, upgrade only if needed.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Consistency Rule</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Your query and your documents MUST use the same embedding model. You cannot embed documents with OpenAI and queries with BGE — the vector spaces are different, and similarity scores will be meaningless.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Local vs. API</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">API models (OpenAI, Cohere) are the easiest to start with but cost money per call. Local models (BGE, E5 via HuggingFace) are free but require GPU resources. For production RAG, most teams use API models for quality and reliability.</p>
      </div>
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"Embedding Fundamentals","questions":[{"q":"What does an embedding model output for a piece of text?","options":["A summary paragraph","A fixed-length list of numbers (vector)","A set of keywords","A JSON object with labels"],"correct":1,"explanation":"Embedding models output a dense vector — a fixed-length list of floating-point numbers — where the position in that high-dimensional space captures the text\u0027s meaning."},{"q":"Why are the words \"happy\" and \"joyful\" close together in embedding space?","options":["They share the same letters","They have the same number of characters","They have similar meanings, so the model places them nearby","They were always grouped together alphabetically"],"correct":2,"explanation":"Embedding models are trained on vast text corpora and learn that words used in similar contexts carry similar meanings. Semantically related words end up geometrically close in vector space."},{"q":"Why is cosine similarity preferred over Euclidean distance for comparing embeddings?","options":["Cosine similarity is faster to compute","Cosine similarity measures direction (meaning), not magnitude (length)","Euclidean distance only works in 2D","Cosine similarity always returns values between 0 and 1"],"correct":1,"explanation":"Cosine similarity measures the angle between vectors, making it magnitude-independent. Two vectors pointing in the same direction are similar regardless of their length — which is what we want when comparing semantic meaning."},{"q":"You embed documents with OpenAI text-embedding-3-small and queries with BGE-small. Will similarity search work?","options":["Yes, embeddings are universal","No — the models produce vectors in different spaces, making similarity scores meaningless","Yes, as long as the dimensions match","It depends on the vector database"],"correct":1,"explanation":"Different embedding models learn different vector spaces. A vector from OpenAI and a vector from BGE represent meaning in incompatible coordinate systems. You MUST use the same model for both documents and queries."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Embedding Vocabulary","cards":[{"front":"Embedding","back":"A fixed-length vector of floating-point numbers representing the semantic meaning of a text. Similar meanings → close vectors. Different meanings → distant vectors."},{"front":"Vector","back":"A list of numbers representing a point in multi-dimensional space. In RAG, each text chunk becomes a vector via an embedding model."},{"front":"Cosine Similarity","back":"Measures similarity between two vectors by the angle between them. Range: -1 (opposite) to 1 (identical). Magnitude-independent — focuses on direction, not length."},{"front":"Embedding Dimensions","back":"The number of values in each vector. More dimensions = more nuance but more storage/compute. Common: 384 (BGE-small), 1536 (OpenAI small), 3072 (OpenAI large)."},{"front":"Contrastive Learning","back":"The training technique for embedding models. Similar texts are pulled together, dissimilar texts pushed apart — creating a geometric map of meaning."},{"front":"Semantic Space","back":"The high-dimensional coordinate system where all embeddings live. The geometry encodes meaning: nearby = related, distant = unrelated."}]}'></div>
</div>
