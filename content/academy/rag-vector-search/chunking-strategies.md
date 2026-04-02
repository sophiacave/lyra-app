---
title: "Chunking Strategies"
course: "rag-vector-search"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 3</div>
  <h1>Chunking Strategies</h1>
  <p class="subtitle">Before you can search documents by meaning, you need to split them into pieces. The size and overlap of those pieces dramatically affects whether your RAG system finds the right answer or returns garbage. This lesson teaches you the art and science of chunking.</p>

  <div class="section">
    <h2>Why Chunk at All?</h2>
    <p>Embedding models have token limits — typically 512 to 8,192 tokens (a token is roughly 3/4 of a word, so 1,000 tokens is about 750 words). A 50-page document has ~15,000 words — far too long to embed as a single vector. Even if you could fit it, a single vector for 50 pages would be so diluted that it would vaguely match everything and precisely match nothing.</p>

    <p>Chunking solves both problems. By splitting documents into smaller pieces — typically 100 to 500 words each — you create focused vectors that represent specific ideas. When a user searches for "refund policy for international orders," the search finds the specific chunk about international refunds, not a 50-page document that mentions refunds once on page 37.</p>

    <p>The challenge is finding the right chunk size. Too small and you lose context. Too large and you dilute relevance. This lesson gives you the rules, the code, and the judgment to get it right.</p>
  </div>

  <div class="section">
    <h2>The Chunk Size Spectrum</h2>
    <p>Every chunk size is a tradeoff between <strong>precision</strong> (finding exactly the right passage) and <strong>context</strong> (including enough surrounding information for the passage to make sense).</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Small Chunks (50-200 words)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">High precision — each chunk covers one idea. Great for specific factual questions ("What is the max upload size?"). Faster to embed. But may lose context needed to understand the passage ("This causes X" — what is "This"?).</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Medium Chunks (200-500 words)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The sweet spot for most RAG systems. Enough context to stand alone, focused enough to be relevant. Start here and adjust based on evaluation. This is what most production systems use.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Large Chunks (500-1000 words)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Good for complex questions requiring reasoning across multiple paragraphs. Better context preservation. But may include irrelevant material that confuses the LLM and wastes context window tokens.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Danger Zones</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Below 50 words: meaningless fragments. "The cat sat on" tells the LLM nothing. Above 1000 words: a chunk about 10 topics matches everything poorly. Both extremes degrade retrieval quality.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Overlap — Preventing Boundary Loss</h2>
    <p>When you split a document at word 200, any sentence that spans words 195-205 gets cut in half. The first chunk has the beginning of the sentence; the second chunk has the end. Neither chunk has the complete thought, so neither will be retrieved for a query about that idea.</p>

    <p><strong>Overlap</strong> solves this by repeating the last N words of each chunk at the beginning of the next. A 200-word chunk with 30-word overlap means words 171-200 of chunk 1 also appear as words 1-30 of chunk 2. Any sentence spanning the boundary is fully captured in at least one chunk.</p>

    <p>The rule of thumb: <strong>10-20% overlap</strong>. For 200-word chunks, use 20-40 words of overlap. Too little overlap and you lose boundary information. Too much overlap and you waste storage and create near-duplicate vectors that clutter search results.</p>
  </div>

  <div class="section">
    <h2>Chunking Strategies in Code</h2>
    <p>There are four main approaches to chunking, each with different tradeoffs. Here is how to implement each one:</p>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">1. Fixed-Size Chunking</h3>
    <p>The simplest approach — split every N words regardless of sentence boundaries. Fast and predictable but can cut sentences mid-thought.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">fixed_size_chunk</span>(text, chunk_size=<span style="color:#fbbf24">200</span>, overlap=<span style="color:#fbbf24">30</span>):
    <span style="color:#fb923c">"""Split text into fixed-size word chunks with overlap."""</span>
    words = text.split()
    chunks = []
    start = <span style="color:#fbbf24">0</span>

    <span style="color:#c084fc">while</span> start < <span style="color:#34d399">len</span>(words):
        end = start + chunk_size
        chunk = <span style="color:#fbbf24">" "</span>.join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap  <span style="color:#71717a"># step forward by (size - overlap)</span>

    <span style="color:#c084fc">return</span> chunks

<span style="color:#71717a"># Example: 1000 words → 6 chunks of 200 words with 30-word overlap</span>
chunks = fixed_size_chunk(document_text)
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"{len(chunks)} chunks created"</span>)</code></pre>
    </div>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">2. Sentence-Based Chunking</h3>
    <p>Groups complete sentences until the chunk reaches the target size. Respects natural language boundaries — never cuts a sentence in half.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> re

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">sentence_chunk</span>(text, max_words=<span style="color:#fbbf24">200</span>, overlap_sentences=<span style="color:#fbbf24">1</span>):
    <span style="color:#fb923c">"""Split text by sentences, grouping until max_words is reached."""</span>
    sentences = re.split(<span style="color:#fbbf24">r'(?<=[.!?])\s+'</span>, text)
    chunks = []
    current = []
    word_count = <span style="color:#fbbf24">0</span>

    <span style="color:#c084fc">for</span> sentence <span style="color:#c084fc">in</span> sentences:
        s_words = <span style="color:#34d399">len</span>(sentence.split())
        <span style="color:#c084fc">if</span> word_count + s_words > max_words <span style="color:#c084fc">and</span> current:
            chunks.append(<span style="color:#fbbf24">" "</span>.join(current))
            <span style="color:#71717a"># Overlap: keep last N sentences</span>
            current = current[-overlap_sentences:]
            word_count = <span style="color:#34d399">sum</span>(<span style="color:#34d399">len</span>(s.split()) <span style="color:#c084fc">for</span> s <span style="color:#c084fc">in</span> current)
        current.append(sentence)
        word_count += s_words

    <span style="color:#c084fc">if</span> current:
        chunks.append(<span style="color:#fbbf24">" "</span>.join(current))
    <span style="color:#c084fc">return</span> chunks</code></pre>
    </div>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">3. Paragraph-Based Chunking</h3>
    <p>Uses double newlines as natural split points. Respects document structure — each paragraph becomes one or more chunks. Best for well-structured documents like technical docs, articles, and manuals.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">paragraph_chunk</span>(text, max_words=<span style="color:#fbbf24">300</span>):
    <span style="color:#fb923c">"""Split text by paragraphs, merging short ones."""</span>
    paragraphs = [p.strip() <span style="color:#c084fc">for</span> p <span style="color:#c084fc">in</span> text.split(<span style="color:#fbbf24">"\n\n"</span>) <span style="color:#c084fc">if</span> p.strip()]
    chunks = []
    current = []
    word_count = <span style="color:#fbbf24">0</span>

    <span style="color:#c084fc">for</span> para <span style="color:#c084fc">in</span> paragraphs:
        p_words = <span style="color:#34d399">len</span>(para.split())
        <span style="color:#c084fc">if</span> word_count + p_words > max_words <span style="color:#c084fc">and</span> current:
            chunks.append(<span style="color:#fbbf24">"\n\n"</span>.join(current))
            current = []
            word_count = <span style="color:#fbbf24">0</span>
        current.append(para)
        word_count += p_words

    <span style="color:#c084fc">if</span> current:
        chunks.append(<span style="color:#fbbf24">"\n\n"</span>.join(current))
    <span style="color:#c084fc">return</span> chunks</code></pre>
    </div>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">4. Semantic Chunking</h3>
    <p>The most sophisticated approach — split at natural topic shifts detected by the embedding model. Embed each sentence, then split where the cosine similarity between consecutive sentences drops below a threshold. Most accurate but most computationally expensive.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> numpy <span style="color:#c084fc">as</span> np
<span style="color:#c084fc">from</span> openai <span style="color:#c084fc">import</span> OpenAI

client = OpenAI()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">semantic_chunk</span>(text, threshold=<span style="color:#fbbf24">0.75</span>):
    <span style="color:#fb923c">"""Split at topic boundaries detected by embedding similarity."""</span>
    sentences = re.split(<span style="color:#fbbf24">r'(?<=[.!?])\s+'</span>, text)

    <span style="color:#71717a"># Embed every sentence</span>
    response = client.embeddings.create(
        input=sentences, model=<span style="color:#fbbf24">"text-embedding-3-small"</span>
    )
    embeddings = [item.embedding <span style="color:#c084fc">for</span> item <span style="color:#c084fc">in</span> response.data]

    <span style="color:#71717a"># Find topic boundaries (low similarity between consecutive sentences)</span>
    chunks = []
    current = [sentences[<span style="color:#fbbf24">0</span>]]
    <span style="color:#c084fc">for</span> i <span style="color:#c084fc">in</span> <span style="color:#34d399">range</span>(<span style="color:#fbbf24">1</span>, <span style="color:#34d399">len</span>(sentences)):
        sim = np.dot(embeddings[i-<span style="color:#fbbf24">1</span>], embeddings[i])  <span style="color:#71717a"># cosine sim (normalized)</span>
        <span style="color:#c084fc">if</span> sim < threshold:  <span style="color:#71717a"># topic shift detected</span>
            chunks.append(<span style="color:#fbbf24">" "</span>.join(current))
            current = []
        current.append(sentences[i])

    <span style="color:#c084fc">if</span> current:
        chunks.append(<span style="color:#fbbf24">" "</span>.join(current))
    <span style="color:#c084fc">return</span> chunks</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Semantic chunking costs extra API calls (one embedding per sentence), so it is best reserved for high-value documents where retrieval quality is critical.</p>
  </div>

  <div class="section">
    <h2>Which Strategy Should You Use?</h2>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Decision Guide:</strong><br>
      <strong>FAQ / support docs:</strong> Sentence-based, 100-200 words. Each chunk should contain one complete answer.<br>
      <strong>Technical documentation:</strong> Paragraph-based, 200-400 words. Respects the document's own structure.<br>
      <strong>Legal contracts:</strong> Paragraph-based, 300-500 words. Larger chunks preserve clause context.<br>
      <strong>Chat transcripts:</strong> Fixed-size, 150-250 words. Conversations lack natural paragraph breaks.<br>
      <strong>Research papers:</strong> Semantic chunking. Topic boundaries matter more than character counts.<br>
      <strong>Not sure:</strong> Start with sentence-based, 200 words, 1-sentence overlap. Evaluate and adjust.
    </div>
  </div>

  <div class="section">
    <h2>Common Mistakes</h2>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Mistake 1: Zero overlap.</strong> Sentences at chunk boundaries are lost. Always use at least 10% overlap.<br><br>
      <strong style="color:#ef4444">Mistake 2: One chunk size for all document types.</strong> A 500-word chunk works for manuals but is too large for FAQs. Adapt chunk size to your content.<br><br>
      <strong style="color:#ef4444">Mistake 3: Not testing with real queries.</strong> The "best" chunk size depends on your specific documents and the questions users actually ask. Run evaluation (Lesson 8) with different sizes before committing.<br><br>
      <strong style="color:#ef4444">Mistake 4: Chunking without preserving metadata.</strong> Each chunk should carry the source document ID, section title, and page number. Without this, retrieved chunks are context-less fragments.
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"Chunking Knowledge Check","questions":[{"q":"Why do we need to chunk documents before embedding them?","options":["Smaller files are cheaper to store","Embedding models have token limits and cannot process full documents as a single vector","Chunks load faster in the browser","Vector databases only accept chunks, not full documents"],"correct":1,"explanation":"Embedding models have maximum token limits (typically 512-8192 tokens). Long documents must be split into chunks so each piece can be embedded individually. This also improves retrieval precision since each chunk covers a focused topic."},{"q":"What is the purpose of overlap between chunks?","options":["To make the index larger","To prevent information at chunk boundaries from being lost","To reduce the number of embeddings needed","To increase cosine similarity scores"],"correct":1,"explanation":"Overlap repeats the end of one chunk at the start of the next. This ensures that a sentence or idea spanning the boundary between two chunks is fully represented in at least one chunk, so it is not lost during retrieval."},{"q":"A legal firm needs to chunk 500-page contracts for a RAG system. Which strategy is best?","options":["Fixed-size, 50 words — maximum precision","Paragraph-based, 300-500 words — preserves clause structure","Semantic chunking with 30-word chunks — topic boundaries matter","No chunking — embed the whole contract as one vector"],"correct":1,"explanation":"Legal documents have meaningful paragraph and clause structure. Paragraph-based chunking with larger sizes (300-500 words) preserves the context needed to understand legal clauses while keeping chunks focused enough for precise retrieval."},{"q":"You are building a chatbot FAQ with short Q&A pairs. What chunk size should you start with?","options":["500+ words to capture maximum context","100-200 words so each chunk contains one complete answer","50 words for maximum precision","1000+ words to reduce the number of embeddings"],"correct":1,"explanation":"FAQ entries are short and self-contained. 100-200 word chunks ensure each chunk captures one complete question-answer pair without diluting it with unrelated content."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Chunking Flashcards","cards":[{"front":"Token","back":"Roughly 3/4 of a word. 100 tokens ≈ 75 words. Embedding models have a maximum token limit per input."},{"front":"Chunk Overlap","back":"Repeating the last N words of one chunk at the start of the next. Prevents boundary information loss. Typical: 10-20% of chunk size."},{"front":"Fixed-Size Chunking","back":"Split text every N words regardless of sentence boundaries. Simple and predictable but can cut sentences mid-thought."},{"front":"Sentence-Based Chunking","back":"Group complete sentences until the chunk reaches the target size. Preserves natural language boundaries. Best general-purpose strategy."},{"front":"Paragraph-Based Chunking","back":"Use double newlines as split points. Respects document structure — each paragraph becomes one or more chunks. Best for structured documents."},{"front":"Semantic Chunking","back":"Split at natural topic shifts detected by embedding similarity between consecutive sentences. Most accurate but most computationally expensive."}]}'></div>
</div>
