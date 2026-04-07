---
title: "The RAG Loop"
course: "rag-vector-search"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>The RAG Loop</h1>
  <p class="sub">Follow a query through the complete RAG pipeline — from user question to AI-generated answer grounded in your data. This is the heartbeat of every RAG system: embed, search, retrieve, augment, generate. Understanding each step is essential to building systems that give accurate answers instead of confident hallucinations.</p>
</div>

  <div class="section">
    <h2>RAG in One Sentence</h2>
    <p>Instead of hoping the LLM memorized the answer during training, we <strong>find</strong> the relevant documents and <strong>hand them to the LLM</strong> along with the question. The model answers using actual data, not guesswork. This is Retrieval-Augmented Generation — and it is the difference between an AI that says "I think the refund policy is 30 days" (hallucination) and one that says "According to your documentation, the refund window is 14 days from purchase" (grounded answer).</p>
  </div>

  <div class="section">
    <h2>The Six Steps</h2>
    <p>Every RAG system — from a prototype to an enterprise deployment — follows these six steps in the same order:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Step 1: User Query</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A natural language question enters the system. "What is the refund policy for international orders?" This is the starting point of every RAG loop. The quality of the query directly affects retrieval quality — vague queries get vague results.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Step 2: Embed Query</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The question is converted to a vector using the <strong>same embedding model</strong> that processed the documents. This is critical — the query vector and document vectors must live in the same semantic space for similarity scores to be meaningful. Different models = different spaces = meaningless comparisons.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Step 3: Vector Search</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The query vector is compared against all stored document vectors using cosine similarity. The HNSW index makes this fast — milliseconds even across millions of chunks. The database returns candidates ranked by how close they are to the query in semantic space.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">Step 4: Retrieve Chunks</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The top-K most similar chunks are fetched — typically 3 to 5. Each chunk comes with its text content, similarity score, and metadata (source document, section, date). The similarity threshold (usually 0.7-0.85) filters out low-relevance noise.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8">Step 5: Augment Prompt</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The retrieved chunks are inserted into a prompt template alongside the original question. The template tells the LLM: "Here is context from our documentation. Answer based ONLY on this context." This is the "A" in RAG — and it is what prevents hallucination.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(250,204,21,.04);border:1px solid rgba(250,204,21,.1)">
        <strong style="color:#facc15">Step 6: LLM Response</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The model generates an answer grounded in the retrieved context, not in potentially outdated training data. With temperature set low (0.0-0.2), the model sticks closely to the context, producing reliable, verifiable answers.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Complete Pipeline in Code</h2>
    <p>Here is a full RAG loop implementation using OpenAI embeddings, Supabase pgvector, and Claude for generation:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> openai <span style="color:#c084fc">import</span> OpenAI
<span style="color:#c084fc">from</span> supabase <span style="color:#c084fc">import</span> create_client
<span style="color:#c084fc">import</span> anthropic

openai_client = OpenAI()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
claude = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">rag_query</span>(question, top_k=<span style="color:#fbbf24">5</span>, threshold=<span style="color:#fbbf24">0.75</span>):
    <span style="color:#fb923c">"""Complete RAG pipeline: embed → search → retrieve → augment → generate."""</span>

    <span style="color:#71717a"># Step 1: User question is already our input</span>

    <span style="color:#71717a"># Step 2: Embed the query</span>
    query_embedding = openai_client.embeddings.create(
        input=question,
        model=<span style="color:#fbbf24">"text-embedding-3-small"</span>
    ).data[<span style="color:#fbbf24">0</span>].embedding

    <span style="color:#71717a"># Steps 3-4: Vector search + retrieve chunks</span>
    result = supabase.rpc(<span style="color:#fbbf24">"match_documents"</span>, {
        <span style="color:#fbbf24">"query_embedding"</span>: query_embedding,
        <span style="color:#fbbf24">"match_threshold"</span>: threshold,
        <span style="color:#fbbf24">"match_count"</span>: top_k
    }).execute()

    chunks = result.data
    <span style="color:#c084fc">if not</span> chunks:
        <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"I don't have enough information to answer that question."</span>

    <span style="color:#71717a"># Step 5: Augment prompt with retrieved context</span>
    context = <span style="color:#fbbf24">"\n\n---\n\n"</span>.join([
        <span style="color:#c084fc">f</span><span style="color:#fbbf24">"[Source: {c['metadata'].get('source', 'unknown')}]\n{c['content']}"</span>
        <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> chunks
    ])

    <span style="color:#71717a"># Step 6: Generate grounded answer</span>
    response = claude.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-20250514"</span>,
        max_tokens=<span style="color:#fbbf24">1024</span>,
        system=<span style="color:#fbbf24">"Answer based ONLY on the provided context. If the context "
               "doesn't contain the answer, say 'I don't have that information.' "
               "Cite the source for each claim."</span>,
        messages=[{
            <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
            <span style="color:#fbbf24">"content"</span>: <span style="color:#c084fc">f</span><span style="color:#fbbf24">"""Context:
{context}

Question: {question}"""</span>
        }]
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fbbf24">0</span>].text

<span style="color:#71717a"># Use it</span>
answer = rag_query(<span style="color:#fbbf24">"What is the refund policy for international orders?"</span>)
<span style="color:#34d399">print</span>(answer)</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">This 40-line function is a complete, production-ready RAG pipeline. Every enterprise RAG system — no matter how complex — is built on this same pattern.</p>
  </div>

  <div class="section">
    <h2>The Supabase Match Function</h2>
    <p>The <code>match_documents</code> function called above is a PostgreSQL function that performs the vector search. Here is how to create it:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">CREATE OR REPLACE FUNCTION</span> match_documents(
  query_embedding <span style="color:#38bdf8">VECTOR(1536)</span>,
  match_threshold <span style="color:#38bdf8">FLOAT DEFAULT 0.75</span>,
  match_count <span style="color:#38bdf8">INT DEFAULT 5</span>
)
<span style="color:#c084fc">RETURNS TABLE</span> (
  id <span style="color:#38bdf8">BIGINT</span>,
  content <span style="color:#38bdf8">TEXT</span>,
  metadata <span style="color:#38bdf8">JSONB</span>,
  similarity <span style="color:#38bdf8">FLOAT</span>
)
<span style="color:#c084fc">LANGUAGE</span> plpgsql <span style="color:#c084fc">AS</span> $$
<span style="color:#c084fc">BEGIN</span>
  <span style="color:#c084fc">RETURN QUERY SELECT</span>
    d.id,
    d.content,
    d.metadata,
    <span style="color:#fbbf24">1</span> - (d.embedding <=> query_embedding) <span style="color:#c084fc">AS</span> similarity
  <span style="color:#c084fc">FROM</span> documents d
  <span style="color:#c084fc">WHERE</span> <span style="color:#fbbf24">1</span> - (d.embedding <=> query_embedding) > match_threshold
  <span style="color:#c084fc">ORDER BY</span> d.embedding <=> query_embedding
  <span style="color:#c084fc">LIMIT</span> match_count;
<span style="color:#c084fc">END</span>;
$$;</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">This function takes a query vector, finds all document chunks above the similarity threshold, and returns them ranked by relevance. It is the core of every Supabase RAG system.</p>
  </div>

  <div class="section">
    <h2>Why Each Step Matters</h2>
    <p>Every step in the RAG loop is a potential failure point. Understanding what can go wrong at each stage helps you debug and improve your system:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Bad Embeddings</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If you use different models for documents vs. queries, similarity scores are meaningless. If you use a weak model, subtle meaning differences are lost.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Bad Chunks</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Chunks too large? Irrelevant content dilutes results. Too small? Missing context makes retrieved chunks useless. Wrong overlap? Boundary information is lost.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Wrong Top-K</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Too few chunks? The answer might be in chunk #6 that you did not retrieve. Too many chunks? You fill the LLM's context window with noise, causing confusion.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Weak Prompt</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Without explicit grounding instructions ("Answer based ONLY on the context"), the LLM blends retrieved context with training knowledge — introducing potential hallucinations even with good retrieval.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Hallucination — The Enemy RAG Fights</h2>
    <p>Without RAG, an LLM answering "What is your refund policy?" might confidently state "We offer a 30-day money-back guarantee" — a plausible answer that is completely fabricated. The model has no access to your actual policies; it generates statistically likely text based on its training data.</p>

    <p>RAG changes the equation: the model receives your actual refund policy document as context, and is instructed to answer only from that context. The result: "According to your documentation, the refund window is 14 days from purchase. Contact billing@acme.io with your order number." Every claim is traceable to a source document.</p>

    <p>This does not eliminate hallucination entirely — the LLM can still misinterpret context or connect dots that are not there. But it reduces hallucination from "the norm" to "the exception." Lesson 8 covers how to measure this with evaluation metrics.</p>
  </div>

  <div class="section">
    <h2>RAG Pipeline Debugging</h2>
    <p>When your RAG system gives bad answers, the bug can hide at any step. Work through these checkpoints in order — most issues are retrieval problems, not generation problems:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">1. Check Embedding Quality</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Embed a known query and its expected answer. Compute cosine similarity — it should be above 0.8. If not, your embedding model may be too weak for your domain, or your chunks are poorly formatted. Try a larger model or clean up chunk preprocessing.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">2. Verify Retrieval Returns Relevant Chunks</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Log the retrieved chunks for failing queries. Read them yourself — are they actually relevant? If the right chunks exist in your database but are not retrieved, adjust your similarity threshold or increase top-K. If the right content was never chunked properly, fix your ingestion pipeline.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">3. Test the Augmented Prompt</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Copy the exact prompt your system sends to the LLM (context + question) and paste it into a playground. Does the model answer correctly with this prompt? If yes, your retrieval is the bottleneck. If no, your prompt template needs work — the grounding instructions may be too weak or the context format confusing.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">4. Validate Generation Output</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Check if the model is faithfully using the context or hallucinating beyond it. Ask it to cite sources for each claim. If it cites a chunk that does not support the claim, lower the temperature or add stricter grounding instructions like "If the context does not contain the answer, say so."</p>
      </div>
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>
<div data-learn="QuizMC" data-props='{"title":"RAG Loop Deep Dive","questions":[{"q":"Why must the query be embedded with the SAME model used to embed the documents?","options":["It is faster to reuse the same model","Both query and documents must live in the same semantic space for similarity scores to be meaningful","The documents cannot be accessed otherwise","Using different models would cause a server error"],"correct":1,"explanation":"Cosine similarity only makes sense when comparing vectors from the same embedding space. If the query is embedded with model A and documents with model B, the vectors exist in different spaces — the similarity scores would be meaningless."},{"q":"What is \"hallucination\" in the context of LLMs, and how does RAG reduce it?","options":["When the model runs too slowly","When the model confidently generates plausible but incorrect information — RAG reduces this by grounding answers in retrieved facts","When the embedding model produces duplicate vectors","When the vector database returns too many results"],"correct":1,"explanation":"Hallucination is when an LLM invents plausible-sounding but false information. RAG reduces hallucination by providing the model with actual source documents and instructing it to answer ONLY based on that context."},{"q":"In the Augment Prompt step, what instruction prevents the LLM from using its own training knowledge instead of the context?","options":["temperature=0","max_tokens=100","Answer based ONLY on the provided context. If unsure, say I don\u0027t know.","model=gpt-4-turbo"],"correct":2,"explanation":"Explicit grounding instructions like \"Answer based ONLY on the provided context\" constrain the model to use retrieved information. Without this instruction, the model may blend context with potentially incorrect training knowledge."},{"q":"What does the similarity threshold parameter control?","options":["How many documents to return","The minimum relevance score required for a chunk to be included in results","The speed of the vector search","The size of each chunk"],"correct":1,"explanation":"The similarity threshold (typically 0.7-0.85) filters out chunks with low relevance scores. Without it, every query returns top-K results even when none of them are actually relevant — leading to answers grounded in irrelevant context."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"RAG Pipeline Terms","cards":[{"front":"RAG","back":"Retrieval-Augmented Generation — fetch relevant documents at query time and provide them as context to an LLM, grounding answers in actual data instead of training memory."},{"front":"Augmented Prompt","back":"A prompt that includes retrieved document chunks as context alongside the user question. The \"A\" in RAG — the bridge between retrieval and generation."},{"front":"Top-K Retrieval","back":"Returning only the K most similar chunks from vector search. K is typically 3-5 depending on context window size and precision needs."},{"front":"Grounded Answer","back":"An LLM response where every claim is supported by retrieved context, not invented from training data. The goal of every RAG system."},{"front":"Similarity Threshold","back":"Minimum cosine similarity score (typically 0.7-0.85) for a chunk to be included in results. Filters out irrelevant noise."},{"front":"Hallucination","back":"When an LLM confidently generates plausible but factually incorrect information. RAG reduces this by anchoring answers to retrieved documents."}]}'></div>

</div>
