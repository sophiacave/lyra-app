---
title: "Embedding Explorer"
course: "ai-foundations"
order: 8
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Embedding <span class="accent">Explorer.</span></h1>
  <p class="sub">How to read word vectors, compute similarity, and build semantic search — with production Python code.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to read word vectors and their coordinates</li>
    <li>What cosine similarity measures and why it matters</li>
    <li>How vector analogy calculations work</li>
    <li>Why embeddings power search, recommendations, and RAG</li>
  </ul>
</div>

<!-- SECTION 1: CORE CONCEPT -->
<div class="lesson-section">
  <span class="section-label">The Big Picture</span>
  <h2 class="section-title">Every word lives at a specific address in meaning-space.</h2>
  <p class="section-text">Imagine a massive warehouse where every word in the English language has its own shelf. Synonyms are on the same shelf. Related words are in the same aisle. Unrelated words are in different buildings. That warehouse is <strong style="color:#e5e5e5">embedding space</strong> — and the shelf number is the word's <strong style="color:#e5e5e5">vector</strong>.</p>
  <p class="section-text">When you search "affordable dining" and the system returns "budget-friendly restaurants" — that's embeddings at work. The two phrases have zero words in common, but they live on the same shelf.</p>
</div>

<!-- SECTION 1B: HOW EMBEDDINGS WORK -->
<div class="lesson-section">
  <span class="section-label">Under the Hood</span>
  <h2 class="section-title">How embeddings are created.</h2>
  <p class="section-text">Embeddings are not hand-crafted — they are <strong style="color:#e5e5e5">learned from data</strong>. An embedding model reads billions of sentences and discovers that words appearing in similar contexts tend to mean similar things. "The cat sat on the mat" and "the dog sat on the mat" teach the model that "cat" and "dog" are interchangeable in some contexts — so their vectors end up nearby.</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Step 1: Tokenize the text</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The input text gets split into tokens — subword chunks like "un" + "believ" + "able." Each token is initially assigned a random vector. These random starting points will be refined through training.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">Step 2: Learn from context</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The model reads sentences and tries to predict which words appear near each other. If "bank" frequently appears near "money," "account," and "deposit," its vector moves toward that financial cluster. If it also appears near "river," "water," and "fishing," it develops a separate sense captured in different dimensions.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Step 3: Vectors stabilize</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">After training on billions of sentences, the vectors settle into stable positions. Words with similar meanings end up in similar regions. The resulting embedding model can convert any new text into a vector that captures its meaning — even text it has never seen before.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Different embedding models produce different numbers of dimensions. More dimensions capture more nuance, but cost more compute:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  POPULAR EMBEDDING MODELS</span>

  Model                     Dimensions    Use Case
  ──────────────────        ──────────    ────────────────────
  <span style="color:#34d399">all-MiniLM-L6-v2</span>         384           Fast, lightweight, free
  <span style="color:#38bdf8">BGE-small-en</span>              384           Fast RAG, free via HuggingFace
  <span style="color:#8b5cf6">text-embedding-3-small</span>    1536          OpenAI API, good accuracy
  <span style="color:#fb923c">text-embedding-3-large</span>    3072          OpenAI API, best accuracy
  <span style="color:#ef4444">voyage-3</span>                  1024          Anthropic-recommended

  <span style="color:#71717a">Rule of thumb: 384 dims = good for most use cases</span>
  <span style="color:#71717a">1024+ dims = when you need maximum precision</span>
  <span style="color:#71717a">All models: higher dims = more nuance, more compute</span></code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>The key insight:</strong> nobody programs the meaning into the vectors. The model discovers meaning by observing patterns in how humans use language. Words that appear in similar contexts converge to similar vectors. Meaning emerges from usage.
  </div>
</div>

<!-- SECTION 2B: CODE — PRODUCTION EMBEDDING PATTERNS -->
<div class="lesson-section">
  <span class="section-label">Production Code</span>
  <h2 class="section-title">Embeddings in real applications.</h2>
  <p class="section-text">Real applications use 768+ dimensions and store vectors in databases for instant lookup. Here are the two patterns that power modern AI applications:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — semantic search (find similar documents)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> sentence_transformers <span style="color:#c084fc">import</span> SentenceTransformer
<span style="color:#c084fc">import</span> numpy <span style="color:#c084fc">as</span> np

model = SentenceTransformer(<span style="color:#fbbf24">"all-MiniLM-L6-v2"</span>)

<span style="color:#71717a"># Your "database" of documents</span>
documents = [
    <span style="color:#fbbf24">"How to train a neural network from scratch"</span>,
    <span style="color:#fbbf24">"Best Italian restaurants in downtown"</span>,
    <span style="color:#fbbf24">"Introduction to deep learning with PyTorch"</span>,
    <span style="color:#fbbf24">"Budget-friendly places to eat near me"</span>,
    <span style="color:#fbbf24">"Understanding backpropagation step by step"</span>,
]
doc_vectors = model.encode(documents)

<span style="color:#71717a"># User searches for something</span>
query = <span style="color:#fbbf24">"affordable dining options"</span>
query_vec = model.encode(query)

<span style="color:#71717a"># Find most similar documents (by cosine similarity)</span>
sims = np.dot(doc_vectors, query_vec) / (
    np.linalg.norm(doc_vectors, axis=<span style="color:#fb923c">1</span>) * np.linalg.norm(query_vec)
)

<span style="color:#71717a"># Top results — notice: ZERO keyword overlap with the query!</span>
<span style="color:#c084fc">for</span> idx <span style="color:#c084fc">in</span> np.argsort(sims)[::-<span style="color:#fb923c">1</span>][:<span style="color:#fb923c">2</span>]:
    <span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"</span>{sims[idx]:.3f}<span style="color:#fbbf24"> → </span>{documents[idx]}<span style="color:#fbbf24">"</span>)
<span style="color:#71717a"># 0.72 → Budget-friendly places to eat near me</span>
<span style="color:#71717a"># 0.65 → Best Italian restaurants in downtown</span></code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">"Affordable dining options" matches "budget-friendly places to eat" with zero keyword overlap. This is the power of semantic search — it understands <em>meaning</em>, not just words.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — RAG (Retrieval-Augmented Generation)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

<span style="color:#71717a"># Step 1: Find relevant docs (semantic search from above)</span>
relevant_docs = [documents[i] <span style="color:#c084fc">for</span> i <span style="color:#c084fc">in</span> np.argsort(sims)[::-<span style="color:#fb923c">1</span>][:<span style="color:#fb923c">3</span>]]

<span style="color:#71717a"># Step 2: Feed them to Claude as context</span>
client = anthropic.Anthropic()
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">300</span>,
    system=<span style="color:#fbbf24">"Answer questions using ONLY the provided context. "</span>
           <span style="color:#fbbf24">"If the context doesn't contain the answer, say so."</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">f"Context:\n</span>{chr(<span style="color:#fb923c">10</span>).join(relevant_docs)}<span style="color:#fbbf24">\n\n"</span>
                   <span style="color:#fbbf24">f"Question: </span>{query}<span style="color:#fbbf24">"</span>
    }]
)
<span style="color:#34d399">print</span>(response.content[<span style="color:#fb923c">0</span>].text)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">This is RAG — the pattern behind every "chat with your data" product. Embeddings find the relevant context, then Claude generates an answer grounded in your actual data instead of hallucinating.</p>

</div>

<!-- SECTION 2C: REAL-WORLD APPLICATIONS -->
<div class="lesson-section">
  <span class="section-label">Applications</span>
  <h2 class="section-title">Five things embeddings power in the real world.</h2>
  <p class="section-text">Embeddings are not just academic — they are the invisible engine behind products you use every day:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">1. Semantic Search — Google, Notion AI, any "smart search"</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Traditional search matches keywords. Semantic search matches <strong style="color:#e5e5e5">meaning</strong>. Searching "how to fix a slow computer" can match an article titled "Speed up your PC performance" — zero keyword overlap, high semantic similarity. The search engine converts your query to a vector and finds the nearest document vectors.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">2. Recommendations — Spotify, Netflix, Amazon</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If you like Song A, Spotify finds other songs whose embedding vectors are close to Song A in "music taste space." The same principle works for movies, products, and articles. Recommendations are just nearest-neighbor lookups in embedding space.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">3. Duplicate Detection — support tickets, content moderation</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If two support tickets have cosine similarity above 0.9, they are probably about the same issue. This lets companies automatically group related tickets, detect duplicate bug reports, or identify plagiarized content — all without writing manual rules.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">4. RAG — "chat with your data" products</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">When you upload a PDF and ask questions about it, the system converts your question to a vector, finds the most relevant paragraphs by cosine similarity, and feeds those paragraphs to the AI. This is RAG — and it is why the AI can answer questions about documents it was not trained on.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">5. Clustering — automatic organization</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Group thousands of customer reviews by topic without reading them. Embed each review, cluster similar vectors together, and label each cluster by its most representative review. "Battery complaints" naturally separates from "shipping complaints" because they occupy different regions of embedding space.</p>
    </div>
  </div>
</div>

<!-- SECTION 3: CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">How similarity is measured.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Embedding Explorer Concepts","cards":[{"front":"Cosine Similarity","back":"Measures the cosine of the angle between two vectors. 1.0 = identical direction (synonyms), 0.0 = perpendicular (unrelated), -1.0 = opposite (antonyms)."},{"front":"Word Vector","back":"A list of numbers (typically 768-1536 dimensions) that represents a word\\\'s meaning. Words used in similar contexts get similar vectors."},{"front":"Vector Analogy","back":"Math on word vectors captures relationships. king - man + woman = queen works because the directional offset encodes the concept of gender."},{"front":"Embedding Space","back":"The high-dimensional coordinate system where every word has a position. Similar concepts cluster together — geometry encodes meaning."},{"front":"RAG (Retrieval-Augmented Generation)","back":"Converts your query to a vector, finds the most similar document vectors in a database, and feeds those documents to the AI as context before generating a response."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"Embedding Explorer Quiz","questions":[{"q":"Which word pair would have the HIGHEST cosine similarity?","options":["happy and banana","car and automobile","king and purple","dog and skyscraper"],"correct":1,"explanation":"Car and automobile are synonyms — they appear in nearly identical contexts so their vectors point in almost the same direction. Cosine similarity would be around 0.95."},{"q":"In the analogy Paris : France :: Tokyo : ?, the answer is Japan because:","options":["The model memorized geography","The vector offset from Paris to France (capital-of) applied to Tokyo lands near Japan","All cities are near all countries in embedding space","Tokyo and France are spelled similarly"],"correct":1,"explanation":"The direction from Paris to France represents capital-of. This same directional offset applied to Tokyo points toward Japan. The model learned these relationships from patterns in text."}]}'></div>

  <div class="naration" style="margin-top:1.5rem">
    <strong>Embeddings turn language into geometry.</strong> Cosine similarity measures the cosine of the angle between two vectors — 1.0 means identical direction, 0 means unrelated, -1.0 means opposite. Real embeddings use 768+ dimensions, but the math is identical to what you see here in 2D.
  </div>
</div>

<!-- SECTION 3B: LIMITATIONS -->
<div class="lesson-section">
  <span class="section-label">Limitations</span>
  <h2 class="section-title">What embeddings cannot do.</h2>
  <p class="section-text">Embeddings are powerful, but they have real limitations worth understanding:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Context blindness</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The word "bank" means different things in "river bank" vs "bank account." Basic word embeddings give "bank" one vector regardless of context. Modern models like BERT fix this by generating <strong style="color:#e5e5e5">contextual embeddings</strong> — different vectors for the same word depending on surrounding text. But this adds compute cost.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Bias reflection</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Embeddings learn from human text, which contains human biases. If training data associates certain professions with certain genders, the embeddings will encode those biases. "Nurse" might end up closer to "woman" than "man" in the vector space — reflecting social patterns, not truth. This is an active area of research and mitigation.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">Language boundaries</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Most embedding models are trained primarily on English text. They work less well for other languages, especially low-resource languages with little training data. Multilingual models exist but trade off accuracy in any single language for breadth across many.</p>
    </div>
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/similarity-challenge" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Similarity Challenge →</a>
</div>

</div>

