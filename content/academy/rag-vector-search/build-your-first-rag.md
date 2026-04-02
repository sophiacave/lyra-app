---
title: "Build Your First RAG"
course: "rag-vector-search"
order: 5
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 5</div>
  <h1>Build Your First RAG</h1>
  <p class="subtitle">Theory is over. In this lesson, you build a complete RAG system from scratch — loading documents, chunking them, embedding them, storing them in a vector database, and querying them with an LLM. Every line of code is explained. By the end, you will have a working system you can adapt to any knowledge base.</p>

  <div class="section">
    <h2>What You Are Building</h2>
    <p>A knowledge-base chatbot that can answer questions about any collection of documents. You will load text files, split them into searchable chunks, embed them with OpenAI, store them in either Chroma (for quick prototyping) or Supabase pgvector (for production), and query them with Claude. The same architecture powers customer support bots, internal knowledge systems, and documentation search at companies of every size.</p>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Prerequisites:</strong> Python 3.9+, an OpenAI API key (for embeddings), and an Anthropic API key (for generation). Install dependencies: <code>pip install openai anthropic chromadb</code>
    </div>
  </div>

  <div class="section">
    <h2>Step 1: Load Your Documents</h2>
    <p>Your RAG system can only answer questions about information it has seen. The first step is loading the documents that will become your knowledge base.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> os
<span style="color:#c084fc">from</span> pathlib <span style="color:#c084fc">import</span> Path

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">load_documents</span>(directory):
    <span style="color:#fb923c">"""Load all text files from a directory."""</span>
    docs = []
    <span style="color:#c084fc">for</span> filepath <span style="color:#c084fc">in</span> Path(directory).glob(<span style="color:#fbbf24">"*.txt"</span>):
        text = filepath.read_text(encoding=<span style="color:#fbbf24">"utf-8"</span>)
        docs.append({
            <span style="color:#fbbf24">"content"</span>: text,
            <span style="color:#fbbf24">"source"</span>: filepath.name,
            <span style="color:#fbbf24">"char_count"</span>: <span style="color:#34d399">len</span>(text)
        })
    <span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Loaded {len(docs)} documents"</span>)
    <span style="color:#c084fc">return</span> docs

<span style="color:#71717a"># Load your knowledge base</span>
documents = load_documents(<span style="color:#fbbf24">"./knowledge-base"</span>)</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">In production, you would also support PDFs (PyPDF2), web pages (BeautifulSoup), Markdown, and databases. The pattern is the same: extract text + attach metadata.</p>
  </div>

  <div class="section">
    <h2>Step 2: Chunk the Documents</h2>
    <p>Documents are too long to embed as single vectors. We split them into focused chunks with overlap to prevent boundary information loss.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> re

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">chunk_document</span>(doc, max_words=<span style="color:#fbbf24">200</span>, overlap_sentences=<span style="color:#fbbf24">1</span>):
    <span style="color:#fb923c">"""Split a document into sentence-based chunks with overlap."""</span>
    sentences = re.split(<span style="color:#fbbf24">r'(?<=[.!?])\s+'</span>, doc[<span style="color:#fbbf24">"content"</span>])
    chunks = []
    current = []
    word_count = <span style="color:#fbbf24">0</span>

    <span style="color:#c084fc">for</span> sentence <span style="color:#c084fc">in</span> sentences:
        s_words = <span style="color:#34d399">len</span>(sentence.split())
        <span style="color:#c084fc">if</span> word_count + s_words > max_words <span style="color:#c084fc">and</span> current:
            chunks.append({
                <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">" "</span>.join(current),
                <span style="color:#fbbf24">"source"</span>: doc[<span style="color:#fbbf24">"source"</span>],
                <span style="color:#fbbf24">"chunk_index"</span>: <span style="color:#34d399">len</span>(chunks)
            })
            current = current[-overlap_sentences:]
            word_count = <span style="color:#34d399">sum</span>(<span style="color:#34d399">len</span>(s.split()) <span style="color:#c084fc">for</span> s <span style="color:#c084fc">in</span> current)
        current.append(sentence)
        word_count += s_words

    <span style="color:#c084fc">if</span> current:
        chunks.append({
            <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">" "</span>.join(current),
            <span style="color:#fbbf24">"source"</span>: doc[<span style="color:#fbbf24">"source"</span>],
            <span style="color:#fbbf24">"chunk_index"</span>: <span style="color:#34d399">len</span>(chunks)
        })
    <span style="color:#c084fc">return</span> chunks

<span style="color:#71717a"># Chunk all documents</span>
all_chunks = []
<span style="color:#c084fc">for</span> doc <span style="color:#c084fc">in</span> documents:
    all_chunks.extend(chunk_document(doc))
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Created {len(all_chunks)} chunks from {len(documents)} documents"</span>)</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Step 3: Embed All Chunks</h2>
    <p>Convert every chunk into a vector using the OpenAI embedding API. Batch processing is significantly cheaper and faster than embedding one at a time.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> openai <span style="color:#c084fc">import</span> OpenAI

client = OpenAI()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">embed_chunks</span>(chunks, batch_size=<span style="color:#fbbf24">100</span>):
    <span style="color:#fb923c">"""Embed all chunks in batches for efficiency."""</span>
    <span style="color:#c084fc">for</span> i <span style="color:#c084fc">in</span> <span style="color:#34d399">range</span>(<span style="color:#fbbf24">0</span>, <span style="color:#34d399">len</span>(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        texts = [c[<span style="color:#fbbf24">"content"</span>] <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> batch]

        response = client.embeddings.create(
            input=texts,
            model=<span style="color:#fbbf24">"text-embedding-3-small"</span>
        )

        <span style="color:#c084fc">for</span> j, item <span style="color:#c084fc">in</span> <span style="color:#34d399">enumerate</span>(response.data):
            chunks[i + j][<span style="color:#fbbf24">"embedding"</span>] = item.embedding

        <span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Embedded batch {i // batch_size + 1}/{(len(chunks) - 1) // batch_size + 1}"</span>)

    <span style="color:#c084fc">return</span> chunks

all_chunks = embed_chunks(all_chunks)
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"All {len(all_chunks)} chunks embedded (1536 dimensions each)"</span>)</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Cost estimate: embedding 10,000 chunks of 200 words each costs about $0.06 with text-embedding-3-small. Embedding is the cheapest part of a RAG system.</p>
  </div>

  <div class="section">
    <h2>Step 4: Store in a Vector Database</h2>
    <p>Here are two options — Chroma for prototyping, Supabase for production:</p>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Option A: Chroma (Prototype)</h3>
    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> chromadb

chroma = chromadb.PersistentClient(path=<span style="color:#fbbf24">"./chroma-db"</span>)
collection = chroma.get_or_create_collection(<span style="color:#fbbf24">"knowledge-base"</span>)

<span style="color:#71717a"># Store all chunks</span>
collection.add(
    ids=[<span style="color:#c084fc">f</span><span style="color:#fbbf24">"chunk-{i}"</span> <span style="color:#c084fc">for</span> i <span style="color:#c084fc">in</span> <span style="color:#34d399">range</span>(<span style="color:#34d399">len</span>(all_chunks))],
    embeddings=[c[<span style="color:#fbbf24">"embedding"</span>] <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> all_chunks],
    documents=[c[<span style="color:#fbbf24">"content"</span>] <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> all_chunks],
    metadatas=[{<span style="color:#fbbf24">"source"</span>: c[<span style="color:#fbbf24">"source"</span>]} <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> all_chunks]
)
<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Stored {collection.count()} chunks in Chroma"</span>)</code></pre>
    </div>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Option B: Supabase pgvector (Production)</h3>
    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> supabase <span style="color:#c084fc">import</span> create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

<span style="color:#71717a"># Store all chunks (table created in Lesson 2)</span>
<span style="color:#c084fc">for</span> chunk <span style="color:#c084fc">in</span> all_chunks:
    supabase.table(<span style="color:#fbbf24">"documents"</span>).insert({
        <span style="color:#fbbf24">"content"</span>: chunk[<span style="color:#fbbf24">"content"</span>],
        <span style="color:#fbbf24">"embedding"</span>: chunk[<span style="color:#fbbf24">"embedding"</span>],
        <span style="color:#fbbf24">"metadata"</span>: {
            <span style="color:#fbbf24">"source"</span>: chunk[<span style="color:#fbbf24">"source"</span>],
            <span style="color:#fbbf24">"chunk_index"</span>: chunk[<span style="color:#fbbf24">"chunk_index"</span>]
        }
    }).execute()

<span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Stored {len(all_chunks)} chunks in Supabase"</span>)</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Step 5: Query Your RAG System</h2>
    <p>Now bring it all together — embed the user's question, search for relevant chunks, and generate a grounded answer:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

claude = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">ask</span>(question, top_k=<span style="color:#fbbf24">5</span>):
    <span style="color:#fb923c">"""Ask a question against your knowledge base."""</span>

    <span style="color:#71717a"># Embed the question</span>
    q_vec = client.embeddings.create(
        input=question, model=<span style="color:#fbbf24">"text-embedding-3-small"</span>
    ).data[<span style="color:#fbbf24">0</span>].embedding

    <span style="color:#71717a"># Search (Chroma version)</span>
    results = collection.query(
        query_embeddings=[q_vec],
        n_results=top_k
    )

    <span style="color:#71717a"># Build context from retrieved chunks</span>
    context_parts = []
    <span style="color:#c084fc">for</span> doc, meta <span style="color:#c084fc">in</span> <span style="color:#34d399">zip</span>(results[<span style="color:#fbbf24">"documents"</span>][<span style="color:#fbbf24">0</span>], results[<span style="color:#fbbf24">"metadatas"</span>][<span style="color:#fbbf24">0</span>]):
        context_parts.append(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"[Source: {meta['source']}]\n{doc}"</span>)
    context = <span style="color:#fbbf24">"\n\n---\n\n"</span>.join(context_parts)

    <span style="color:#71717a"># Generate grounded answer</span>
    response = claude.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-20250514"</span>,
        max_tokens=<span style="color:#fbbf24">1024</span>,
        system=(<span style="color:#fbbf24">"You are a helpful assistant. Answer based ONLY on the "</span>
                <span style="color:#fbbf24">"provided context. If the context doesn't contain the "</span>
                <span style="color:#fbbf24">"answer, say 'I don't have that information.' "</span>
                <span style="color:#fbbf24">"Cite the source document for each claim."</span>),
        messages=[{
            <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
            <span style="color:#fbbf24">"content"</span>: <span style="color:#c084fc">f</span><span style="color:#fbbf24">"Context:\n{context}\n\nQuestion: {question}"</span>
        }]
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fbbf24">0</span>].text

<span style="color:#71717a"># Try it!</span>
answer = ask(<span style="color:#fbbf24">"What is the refund policy?"</span>)
<span style="color:#34d399">print</span>(answer)</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Step 6: Evaluate and Tune</h2>
    <p>Your first version will not be perfect. Here are the key parameters to tune based on the quality of answers you see:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">chunk_size</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Start at 200 words. If answers lack context, increase to 300-400. If answers include irrelevant content, decrease to 100-150.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">top_k</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Start at 5. If the right answer is not being found, increase to 8-10. If the LLM seems confused by too much context, decrease to 3.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">similarity_threshold</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Start at 0.75. If irrelevant chunks are being retrieved, raise to 0.8-0.85. If too few results are returned, lower to 0.65-0.70.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">temperature</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">For factual RAG, use 0.0-0.2. Higher values make the model more creative — which is the opposite of what you want for grounded answers.</p>
      </div>
    </div>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Pro Tip:</strong> Keep a test set of 10-20 question-answer pairs that you know the correct answers to. After every parameter change, run your test set and check whether accuracy improved. Lesson 8 covers automated evaluation frameworks that do this at scale.
    </div>
  </div>

  <div class="section">
    <h2>What You Built</h2>
    <p>Congratulations — you now have a working RAG system. Let's summarize the architecture:</p>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">Document Pipeline:</strong> Load files → Chunk (sentence-based, 200 words, 1-sentence overlap) → Embed (OpenAI text-embedding-3-small, 1536 dimensions) → Store (Chroma or Supabase pgvector)<br><br>
      <strong style="color:#e5e5e5">Query Pipeline:</strong> User question → Embed query → Vector search (top-5, threshold 0.75) → Augment prompt with context → Claude generates grounded answer<br><br>
      <strong style="color:#e5e5e5">Total Code:</strong> ~100 lines of Python. The same architecture powers production systems at scale — you just add more documents, better chunking, and evaluation.
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>
<div data-learn="QuizMC" data-props='{"title":"Build Your First RAG — Check Your Understanding","questions":[{"q":"Why is batch embedding more efficient than embedding one document at a time?","options":["Batch embedding uses a different model","One API call with 100 texts is faster and cheaper than 100 API calls with 1 text each","Batch embedding produces higher quality vectors","Batch embedding requires less disk space"],"correct":1,"explanation":"API calls have overhead — network latency, authentication, rate limiting. Sending 100 texts in one call eliminates 99% of that overhead. Most embedding APIs are priced per token, so the cost is identical, but the speed improvement is dramatic."},{"q":"What is the purpose of the metadata stored alongside each vector?","options":["To improve embedding quality","To enable filtering and to provide source attribution when returning results","To make the vector database faster","To reduce storage costs"],"correct":1,"explanation":"Metadata serves two purposes: (1) filtering — narrowing search results by source, date, category, etc. (2) attribution — when a chunk is retrieved, the metadata tells you where it came from, enabling citations in the generated answer."},{"q":"Your RAG system returns irrelevant chunks for specific queries. Which parameter should you adjust first?","options":["Increase chunk_size to capture more context","Raise the similarity_threshold to filter out low-relevance results","Lower top_k to return fewer results","Change the LLM model"],"correct":1,"explanation":"If irrelevant chunks are being retrieved, the similarity threshold is too low — chunks with weak similarity are making it through. Raising the threshold from 0.75 to 0.80-0.85 filters out these low-relevance results. This is the first parameter to tune when retrieval quality is poor."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"RAG Build — Key Parameters","cards":[{"front":"chunk_size","back":"Number of words per chunk. Start at 200. Increase for more context, decrease for more precision. Tune based on answer quality."},{"front":"chunk_overlap","back":"Words repeated between adjacent chunks. Prevents boundary loss. Typical: 10-20% of chunk_size, or 1 overlapping sentence."},{"front":"top_k","back":"How many chunks to retrieve per query. More = more context for the LLM but higher token cost and potential noise. Start at 5."},{"front":"similarity_threshold","back":"Minimum cosine similarity for a chunk to be included. Filters irrelevant results. Start at 0.75, raise if seeing noise."},{"front":"temperature","back":"Controls LLM randomness. Set to 0.0-0.2 for factual RAG answers to minimize hallucination and maximize reliability."},{"front":"batch_size","back":"Number of texts to embed in one API call. Reduces network overhead. Typical: 100. OpenAI supports up to 2048 per call."}]}'></div>

</div>
