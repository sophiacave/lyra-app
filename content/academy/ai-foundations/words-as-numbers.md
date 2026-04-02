---
title: "Words as Numbers"
course: "ai-foundations"
order: 7
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Words as <span class="accent">Numbers.</span></h1>
  <p class="sub">Watch words become vectors in space — and discover that math can capture meaning.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How words become vectors (lists of numbers)</li>
    <li>Why similar words cluster together in space</li>
    <li>The famous king - man + woman = queen equation</li>
    <li>Why embeddings are the foundation of modern AI</li>
  </ul>
</div>

<!-- SECTION 1: CONCEPT -->
<div class="lesson-section">
  <span class="section-label">The Big Idea</span>
  <h2 class="section-title">Words have coordinates in a universe of meaning.</h2>
  <p class="section-text">AI cannot read words the way you do. It reads numbers. So every word gets converted into a list of numbers that captures its meaning. This list of numbers is called a <strong>vector</strong> — think of it as GPS coordinates, but instead of pinpointing a place on Earth, they pinpoint a word's meaning in a universe of concepts.</p>
  <p class="section-text">"Cat" might have coordinates like [0.2, 0.8, -0.1, ...] across hundreds of <strong>dimensions</strong>. A dimension is just one aspect of meaning — one might roughly capture "is it alive?", another "is it big?", another "is it domestic?" The more dimensions, the more nuance the AI can express.</p>
  <p class="section-text">The magic: words that mean similar things end up close together on this map. "Happy," "joyful," and "delighted" are neighbors. "Sad" is far away. The map itself encodes meaning — and AI uses this map to understand language.</p>

<div data-learn="FlashDeck" data-props='{"title":"Embedding Concepts — Flip for Details","cards":[{"front":"📊 VECTORS\n\nEach word becomes a list of numbers.\nHundreds of dimensions capturing meaning.","back":"EXAMPLE: \"cat\" = [0.2, 0.8, -0.1, 0.5, ...]\n\nEach number captures some aspect of meaning — maybe one dimension relates to \"is it alive?\", another to \"is it big?\", another to \"is it domestic?\"\n\nReal embeddings use 768+ dimensions. The more dimensions, the more nuance."},{"front":"🌌 SEMANTIC SPACE\n\nSimilar words cluster together.\nMeaning becomes geometry.","back":"In embedding space:\n- \"happy\" + \"joyful\" + \"delighted\" = neighbors\n- \"sad\" is far from \"happy\" — opposite direction\n- \"dog\" + \"cat\" + \"puppy\" = a cluster\n- \"king\" + \"queen\" + \"prince\" = another cluster\n\nSearch engines use this: your query becomes a vector and they find the nearest document vectors."},{"front":"➕ VECTOR ARITHMETIC\n\nking - man + woman = queen\n\nMath captures relationships.","back":"This is not a trick. The vector from king to queen captures royalty + female.\n\nThe vector from man to woman captures the gender direction.\n\nking - man + woman follows the royalty direction from the female side — and lands on queen.\n\nThe AI learned these relationships from patterns in billions of sentences."}]}'></div>

</div>

<!-- SECTION 1B: CODE — EMBEDDINGS IN PYTHON -->
<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">Embeddings in real Python.</h2>
  <p class="section-text">Here is how to generate embeddings and compute similarity in Python. <em>If you are not a coder, you can skip the code — the concepts above are what matter. The code is here for learners who want to see the mechanics behind the scenes.</em></p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — generate embeddings with sentence-transformers (free, runs locally)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> sentence_transformers <span style="color:#c084fc">import</span> SentenceTransformer
<span style="color:#c084fc">import</span> numpy <span style="color:#c084fc">as</span> np

<span style="color:#71717a"># Load a free embedding model (downloads once, ~90MB)</span>
model = SentenceTransformer(<span style="color:#fbbf24">"all-MiniLM-L6-v2"</span>)

<span style="color:#71717a"># Convert words to vectors (384 dimensions each)</span>
words = [<span style="color:#fbbf24">"king"</span>, <span style="color:#fbbf24">"queen"</span>, <span style="color:#fbbf24">"man"</span>, <span style="color:#fbbf24">"woman"</span>, <span style="color:#fbbf24">"dog"</span>, <span style="color:#fbbf24">"cat"</span>]
vectors = model.encode(words)

<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Each vector has </span>{vectors.shape[<span style="color:#fb923c">1</span>]}<span style="color:#fbbf24"> dimensions"</span>)
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"'king' vector (first 5): </span>{vectors[<span style="color:#fb923c">0</span>][:<span style="color:#fb923c">5</span>].round(<span style="color:#fb923c">3</span>)}<span style="color:#fbbf24">"</span>)</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — cosine similarity from scratch</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">cosine_similarity</span>(a, b):
    <span style="color:#71717a">"""Measure the angle between two vectors. 1.0 = identical, 0 = unrelated."""</span>
    <span style="color:#c084fc">return</span> np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

<span style="color:#71717a"># Compare word pairs</span>
king, queen, man, woman, dog, cat = vectors

<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"king ↔ queen:  </span>{cosine_similarity(king, queen):.3f}<span style="color:#fbbf24">"</span>)  <span style="color:#71717a"># ~0.78 (both royalty)</span>
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"king ↔ man:    </span>{cosine_similarity(king, man):.3f}<span style="color:#fbbf24">"</span>)  <span style="color:#71717a"># ~0.45 (some overlap)</span>
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"king ↔ dog:    </span>{cosine_similarity(king, dog):.3f}<span style="color:#fbbf24">"</span>)  <span style="color:#71717a"># ~0.15 (unrelated)</span>
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"dog  ↔ cat:    </span>{cosine_similarity(dog, cat):.3f}<span style="color:#fbbf24">"</span>)  <span style="color:#71717a"># ~0.80 (both pets)</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — vector arithmetic: king - man + woman = ?</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># The famous equation</span>
result = king - man + woman

<span style="color:#71717a"># Find the nearest word to the result vector</span>
similarities = [cosine_similarity(result, v) <span style="color:#c084fc">for</span> v <span style="color:#c084fc">in</span> vectors]
nearest = words[np.argmax(similarities)]

<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"king - man + woman ≈ </span>{nearest}<span style="color:#fbbf24">"</span>)  <span style="color:#71717a"># → queen</span></code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">This is not magic — it is math on the meaning map. The direction from "man" to "king" encodes royalty. Apply that same direction starting from "woman" and you land on "queen." The AI learned these relationships by reading patterns in billions of sentences — nobody programmed them in.</p>

</div>

<!-- SECTION 2: INTERACTIVE VISUALIZATION -->
<div class="lesson-section">
  <span class="section-label">Explore</span>
  <h2 class="section-title">Watch words in semantic space.</h2>
  <p class="section-text">Use the step buttons to see how words cluster by meaning and how vector arithmetic works.</p>
</div>

<!-- SECTION 3: KNOWLEDGE CHECK -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>


<div data-learn="QuizMC" data-props='{"title":"Embeddings Mastery","questions":[{"q":"Why do similar words end up close together in embedding space?","options":["Programmers manually placed them there","Words that appear in similar contexts develop similar vectors","It is random — sometimes similar words are far apart","The dictionary determines their position"],"correct":1,"explanation":"Embeddings are learned from text. Words that appear in similar contexts (you can pet a cat / you can pet a dog) develop similar vectors. The AI discovers meaning from usage patterns."},{"q":"What makes vector arithmetic like king - man + woman = queen possible?","options":["A lookup table of word relationships","The embedding space encodes relationships as directional offsets","The AI memorized this specific example","It only works for royalty words"],"correct":1,"explanation":"The direction from man to king captures royalty. The direction from man to woman captures gender. These are consistent directions in the space — so you can combine them mathematically."},{"q":"How do search engines use embeddings?","options":["They match exact keywords only","They convert queries and documents to vectors and find the nearest matches","They use embeddings to make web pages load faster","They do not use embeddings"],"correct":1,"explanation":"Modern search converts your query to a vector and finds document vectors that point in a similar direction. This is why searching affordable places to eat can find budget-friendly restaurants — even with zero keyword overlap."}]}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/embedding-explorer" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Embedding Explorer →</a>
</div>

</div>

