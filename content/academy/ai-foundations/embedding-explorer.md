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
  <p class="sub">Click words to see their vectors. Click two to compute real cosine similarity.</p>
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

<!-- SECTION 1: INTERACTIVE EXPLORER -->
<div class="lesson-section">
  <span class="section-label">Explore</span>
  <h2 class="section-title">Click words to compare their vectors.</h2>
  <p class="section-text">Click one word to see its vector. Click a second to compute the angle and cosine similarity between them.</p>
</div>

<!-- SECTION 2B: CODE — PRODUCTION EMBEDDING PATTERNS -->
<div class="lesson-section">
  <span class="section-label">Production Code</span>
  <h2 class="section-title">Embeddings in real applications.</h2>
  <p class="section-text">The interactive explorer above uses 2D vectors. Real applications use 768+ dimensions and store vectors in databases for instant lookup. Here are the two patterns that power modern AI applications:</p>

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

<!-- SECTION 3: CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">How similarity is measured.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Embedding Explorer Concepts","cards":[{"front":"Cosine Similarity","back":"Measures the cosine of the angle between two vectors. 1.0 = identical direction (synonyms), 0.0 = perpendicular (unrelated), -1.0 = opposite (antonyms)."},{"front":"Word Vector","back":"A list of numbers (typically 768-1536 dimensions) that represents a word\\\'s meaning. Words used in similar contexts get similar vectors."},{"front":"Vector Analogy","back":"Math on word vectors captures relationships. king - man + woman = queen works because the directional offset encodes the concept of gender."},{"front":"Embedding Space","back":"The high-dimensional coordinate system where every word has a position. Similar concepts cluster together — geometry encodes meaning."},{"front":"RAG (Retrieval-Augmented Generation)","back":"Converts your query to a vector, finds the most similar document vectors in a database, and feeds those documents to the AI as context before generating a response."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"Embedding Explorer Quiz","questions":[{"q":"Which word pair would have the HIGHEST cosine similarity?","options":["happy and banana","car and automobile","king and purple","dog and skyscraper"],"correct":1,"explanation":"Car and automobile are synonyms — they appear in nearly identical contexts so their vectors point in almost the same direction. Cosine similarity would be around 0.95."},{"q":"In the analogy Paris : France :: Tokyo : ?, the answer is Japan because:","options":["The model memorized geography","The vector offset from Paris to France (capital-of) applied to Tokyo lands near Japan","All cities are near all countries in embedding space","Tokyo and France are spelled similarly"],"correct":1,"explanation":"The direction from Paris to France represents capital-of. This same directional offset applied to Tokyo points toward Japan. The model learned these relationships from patterns in text."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Embeddings turn language into geometry.</strong> Cosine similarity measures the cosine of the angle between two vectors — 1.0 means identical direction, 0 means unrelated, -1.0 means opposite. Real embeddings use 768+ dimensions, but the math is identical to what you see here in 2D.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/similarity-challenge" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Similarity Challenge →</a>
</div>

</div>

