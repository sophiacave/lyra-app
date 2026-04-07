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
</div>

<!-- SECTION 1A: ENCODING AND TOKENIZATION -->
<div class="lesson-section">
  <span class="section-label">From Text to Numbers</span>
  <h2 class="section-title">Three ways machines have tried to read words.</h2>
  <p class="section-text">Before embeddings, researchers tried simpler approaches. Understanding these older methods makes it clear why embeddings are such a breakthrough:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.88rem">One-Hot Encoding — the dictionary approach (1990s)</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Assign each word a unique position in a giant vector. "Cat" = [1, 0, 0, ...], "Dog" = [0, 1, 0, ...]. The problem: every word is equally distant from every other word. "Cat" is no closer to "dog" than to "algebra." And with 100,000 words, each vector is 100,000 numbers long with 99,999 zeros. Wasteful and meaningless.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">Bag of Words — counting occurrences (2000s)</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Count how many times each word appears in a document. "The cat sat on the mat" becomes {the: 2, cat: 1, sat: 1, on: 1, mat: 1}. Better than one-hot, but it ignores word order entirely. "Dog bites man" and "man bites dog" have the exact same representation despite meaning completely different things.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">Embeddings — learned meaning (2013+)</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Instead of hand-crafting representations, let the AI <strong style="color:#e5e5e5">learn</strong> them from data. Train a model on billions of sentences, and words that appear in similar contexts develop similar vectors. "Cat" and "dog" end up near each other because they appear in similar sentences. "Cat" and "algebra" end up far apart. Dense, compact, and meaningful — this is the modern approach.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Modern AI also uses <strong style="color:#e5e5e5">tokenization</strong> — splitting text into subword chunks before embedding:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.5;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">  TOKENIZATION — HOW AI READS TEXT</span>

  Word               Tokens              Why
  ──────────         ──────────          ─────────────────────
  <span style="color:#34d399">"cat"</span>              [cat]               Common word = 1 token
  <span style="color:#38bdf8">"unbelievable"</span>     [un, believ, able]  Rare word = 3 tokens
  <span style="color:#8b5cf6">"ChatGPT"</span>          [Chat, G, PT]       Brand name = 3 tokens
  <span style="color:#fb923c">"123"</span>              [1, 2, 3]           Numbers = 1 token each
  <span style="color:#ef4444">"    "</span>             [    ]              Spaces = tokens too

  <span style="color:#71717a">Rule of thumb: 1 token ≈ 4 characters ≈ 0.75 words</span>
  <span style="color:#71717a">100 tokens ≈ 75 words ≈ one short paragraph</span>
  <span style="color:#71717a">A 1-page document ≈ 300-400 tokens</span></code></pre>
</div>

  <div class="narration" style="margin-top:1rem">
    <strong>Tokenization + embedding is the full pipeline:</strong> text gets split into tokens, each token gets an embedding vector, and the AI processes those vectors. Every word you type into ChatGPT or Claude goes through this exact pipeline — tokenize, embed, process, generate.
  </div>

<div data-learn="FlashDeck" data-props='{"title":"Embedding Concepts — Flip for Details","cards":[{"front":"📊 VECTORS\n\nEach word becomes a list of numbers.\nHundreds of dimensions capturing meaning.","back":"EXAMPLE: \"cat\" = [0.2, 0.8, -0.1, 0.5, ...]\n\nEach number captures some aspect of meaning — maybe one dimension relates to \"is it alive?\", another to \"is it big?\", another to \"is it domestic?\"\n\nReal embeddings use 768+ dimensions. The more dimensions, the more nuance."},{"front":"🌌 SEMANTIC SPACE\n\nSimilar words cluster together.\nMeaning becomes geometry.","back":"In embedding space:\n- \"happy\" + \"joyful\" + \"delighted\" = neighbors\n- \"sad\" is far from \"happy\" — opposite direction\n- \"dog\" + \"cat\" + \"puppy\" = a cluster\n- \"king\" + \"queen\" + \"prince\" = another cluster\n\nSearch engines use this: your query becomes a vector and they find the nearest document vectors."},{"front":"➕ VECTOR ARITHMETIC\n\nking - man + woman = queen\n\nMath captures relationships.","back":"This is not a trick. The vector from king to queen captures royalty + female.\n\nThe vector from man to woman captures the gender direction.\n\nking - man + woman follows the royalty direction from the female side — and lands on queen.\n\nThe AI learned these relationships from patterns in billions of sentences."}]}'></div>

</div>

<!-- SECTION 1B: CODE — EMBEDDINGS IN PYTHON -->
<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">Embeddings in real Python.</h2>
  <p class="section-text">Now let's look at how vocabulary works in modern AI. A <strong style="color:#e5e5e5">vocabulary</strong> is the complete set of tokens the model knows. Every word you type gets matched against this vocabulary. Common words like "the" are single tokens. Rare words get split into pieces. Words outside the vocabulary get broken into known subword pieces — so the model can handle any text, even words it has never seen during training.</p>
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

<!-- SECTION 1C: WHY DIMENSIONS MATTER -->
<div class="lesson-section">
  <span class="section-label">Dimensions</span>
  <h2 class="section-title">What do 768 dimensions actually mean?</h2>
  <p class="section-text">It is hard to visualize 768 dimensions — humans can picture 2 or 3 at most. But here is the intuition: each dimension captures one <em>aspect</em> of meaning. Think of it like describing a person:</p>

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">2 dimensions: too simple</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">With only 2 numbers (say, height and weight), you can distinguish tall-heavy from short-light, but you cannot tell apart two people who are the same height and weight. Too few dimensions means too many collisions — different words end up at the same coordinates.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.88rem">768 dimensions: rich detail</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">With 768 numbers, you can capture nuances like formality, sentiment, tense, domain, concreteness, and hundreds of other aspects of meaning. "Running" and "jogging" are close on most dimensions but might differ on "intensity." "Bank" (financial) and "bank" (river) share spelling dimensions but diverge on meaning dimensions.</p>
    </div>
  </div>

  <div class="narration" style="margin-top:1rem">
    <strong>More dimensions = more precision.</strong> But there are diminishing returns — going from 384 to 768 dimensions helps a lot. Going from 768 to 3072 helps less. The sweet spot for most applications is 384-1536 dimensions.
  </div>
</div>

<!-- SECTION 2: SEMANTIC SPACE VISUALIZATION -->
<div class="lesson-section">
  <span class="section-label">See It</span>
  <h2 class="section-title">How words cluster in semantic space.</h2>
  <p class="section-text">If we squash the 384 dimensions down to 2D, here is what the word map looks like. Notice how meaning creates geography:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.4;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">        Semantic Space (2D projection)</span>

                    <span style="color:#c084fc">queen</span> ♛
                   ╱
             <span style="color:#c084fc">king</span> ♚     <span style="color:#71717a">← royalty cluster</span>
               ╲
                <span style="color:#38bdf8">woman</span>
                  │
                <span style="color:#38bdf8">man</span>        <span style="color:#71717a">← people cluster</span>
                  │
                <span style="color:#38bdf8">boy</span>

      <span style="color:#34d399">dog</span> 🐕 ─── <span style="color:#34d399">cat</span> 🐈   <span style="color:#71717a">← pet cluster</span>
            ╲
            <span style="color:#34d399">puppy</span>

  <span style="color:#fb923c">car</span> 🚗 ─── <span style="color:#fb923c">truck</span> 🚛  <span style="color:#71717a">← vehicle cluster</span>

<span style="color:#71717a">  Words with similar meanings = nearby coordinates</span>
<span style="color:#71717a">  The DIRECTION from king→queen = the DIRECTION from man→woman</span>
<span style="color:#71717a">  That's why king - man + woman ≈ queen</span></code></pre>
</div>
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

