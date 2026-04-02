---
title: "RAG Mastery Quiz"
course: "rag-vector-search"
order: 10
type: "quiz"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>RAG Mastery Quiz</h1>
  <p class="sub">Test your knowledge across all 9 lessons. This assessment covers embeddings, chunking, the RAG pipeline, prompt augmentation, hybrid search, evaluation, and advanced patterns. A score of 80% or higher means you are ready to build production RAG systems.</p>
</div>

  <div class="section">
    <h2>What You Have Learned</h2>
    <p>Over 9 lessons, you have built a complete understanding of Retrieval-Augmented Generation:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Module 1: Foundations</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Embeddings convert text to vectors. Vector databases store and search by meaning. Chunking splits documents into searchable pieces.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Module 2: The Pipeline</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The RAG loop: embed → search → retrieve → augment → generate. You built a complete system from scratch with real code.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Module 3: Production Quality</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Prompt augmentation prevents hallucination. Hybrid search combines keyword precision with semantic understanding.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Module 4: Advanced</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Evaluation metrics measure quality. Advanced patterns (Multi-Step, Self-RAG, RAG+Tools, Agentic) handle complex queries.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Critical Concepts Review</h2>
    <p>Before you take the final assessment, revisit the core ideas from each module. These are the concepts that separate someone who has heard of RAG from someone who can build and maintain a production system.</p>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.15);margin:1.25rem 0">
      <strong style="color:#8b5cf6;font-size:.95rem">Embeddings and Similarity</strong>
      <p style="font-size:.85rem;color:#e5e5e5;margin:.6rem 0 .4rem">Embeddings are the translation layer between human language and machine-searchable space. Every sentence, paragraph, or document becomes a fixed-length vector of floating-point numbers, and the geometric relationships between those vectors encode meaning.</p>
      <ul style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;padding-left:1.2rem;line-height:1.7">
        <li><strong style="color:#e5e5e5">What they are:</strong> Dense numerical vectors (typically 384 to 1536 dimensions) produced by neural networks trained with contrastive learning. The model learns to place semantically similar text close together and dissimilar text far apart.</li>
        <li><strong style="color:#e5e5e5">Cosine similarity:</strong> The standard metric for comparing embeddings. It measures the angle between two vectors, not their magnitude. Two vectors pointing in the same direction score close to 1.0 regardless of length. This matters because embedding models can produce vectors of different magnitudes for texts of different lengths, and you want to compare meaning, not word count.</li>
        <li><strong style="color:#e5e5e5">Model selection:</strong> The embedding model you choose determines the quality ceiling for your entire RAG system. Key factors include dimension count (higher dimensions capture more nuance but cost more storage), training data domain (a model trained on scientific papers will outperform a general model for scientific RAG), and the critical rule: you must use the same model for documents and queries. Mismatched models produce vectors in different spaces that cannot be meaningfully compared.</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.15);margin:1.25rem 0">
      <strong style="color:#34d399;font-size:.95rem">Vector Databases and Indexing</strong>
      <p style="font-size:.85rem;color:#e5e5e5;margin:.6rem 0 .4rem">A vector database is not just storage. It is the search engine that makes RAG fast enough for real-time applications. Understanding how it works under the hood helps you tune performance and debug retrieval failures.</p>
      <ul style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;padding-left:1.2rem;line-height:1.7">
        <li><strong style="color:#e5e5e5">HNSW indexes:</strong> Hierarchical Navigable Small World graphs are the dominant indexing strategy. They build a multi-layer graph where the top layers have few, widely-spaced nodes for fast coarse navigation, and the bottom layers have dense connections for precise nearest-neighbor search. The result is sub-millisecond search across millions of vectors — the difference between a usable product and one that times out.</li>
        <li><strong style="color:#e5e5e5">Storage patterns:</strong> Vectors are stored alongside metadata (source document, chunk position, timestamps, tags). This metadata enables filtering before or after similarity search. A well-designed metadata schema is as important as the vectors themselves because it determines what kinds of filtered queries you can run efficiently.</li>
        <li><strong style="color:#e5e5e5">Similarity thresholds:</strong> Not every result above 0.0 is useful. Production systems set a minimum similarity threshold (commonly 0.7 to 0.85 for cosine similarity) below which results are discarded. Setting this threshold requires experimentation with your specific data — too high and you miss relevant results, too low and you inject noise into the LLM context.</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.15);margin:1.25rem 0">
      <strong style="color:#fb923c;font-size:.95rem">The RAG Pipeline</strong>
      <p style="font-size:.85rem;color:#e5e5e5;margin:.6rem 0 .4rem">RAG is a five-stage pipeline, and understanding each stage is essential for debugging when things go wrong. When an answer is bad, the fix depends entirely on which stage failed.</p>
      <ul style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;padding-left:1.2rem;line-height:1.7">
        <li><strong style="color:#e5e5e5">Embed:</strong> The user query is converted to a vector using the same embedding model used for documents. If this vector does not capture the query intent well, everything downstream fails.</li>
        <li><strong style="color:#e5e5e5">Search:</strong> The query vector is compared against all document vectors in the database. The top-k most similar results are returned. The value of k (typically 3 to 10) balances context richness against noise and token cost.</li>
        <li><strong style="color:#e5e5e5">Retrieve:</strong> The actual text chunks corresponding to the top-k vectors are fetched along with their metadata. This is where filtering by source, date, or category can narrow results to the most relevant subset.</li>
        <li><strong style="color:#e5e5e5">Augment:</strong> Retrieved chunks are injected into a prompt template alongside the original question and grounding instructions. This is the most underestimated stage — the prompt design determines whether the LLM uses the context faithfully or ignores it.</li>
        <li><strong style="color:#e5e5e5">Generate:</strong> The LLM produces an answer grounded in the provided context. Temperature, system prompt, and citation requirements all influence output quality. A low temperature (0.1 to 0.3) reduces creative hallucination.</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.15);margin:1.25rem 0">
      <strong style="color:#38bdf8;font-size:.95rem">Chunking Strategy</strong>
      <p style="font-size:.85rem;color:#e5e5e5;margin:.6rem 0 .4rem">Chunking is where information architecture meets retrieval quality. How you split documents determines what the system can find and how useful the retrieved context will be.</p>
      <ul style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;padding-left:1.2rem;line-height:1.7">
        <li><strong style="color:#e5e5e5">Size tradeoffs:</strong> Small chunks (100-200 words) give precise retrieval — the matched text is tightly relevant — but may lack the surrounding context needed to understand the information. Large chunks (400-600 words) preserve context but may dilute relevance with tangential content. Most production systems settle between 200 and 400 words.</li>
        <li><strong style="color:#e5e5e5">Overlap strategy:</strong> Adjacent chunks should share 10-20% of their text. Overlap ensures that information split across a chunk boundary is not lost. Without overlap, a key sentence at the edge of a chunk might be separated from the context it needs, making it unretrievable or misleading when retrieved alone.</li>
        <li><strong style="color:#e5e5e5">Document-type-specific approaches:</strong> One chunking strategy does not fit all documents. Technical documentation benefits from section-based splitting that respects heading hierarchies. Conversational transcripts need speaker-turn-aware chunking. Legal documents require clause-level segmentation. Code should be chunked by function or class boundaries, not arbitrary line counts.</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.15);margin:1.25rem 0">
      <strong style="color:#ef4444;font-size:.95rem">Prompt Augmentation and Hallucination Prevention</strong>
      <p style="font-size:.85rem;color:#e5e5e5;margin:.6rem 0 .4rem">The augmented prompt is where retrieval becomes generation. A poorly constructed prompt will waste even the best retrieval results. This is the most controllable and often most impactful lever in the entire system.</p>
      <ul style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;padding-left:1.2rem;line-height:1.7">
        <li><strong style="color:#e5e5e5">Grounding instructions:</strong> Explicit instructions that tell the LLM to answer ONLY from the provided context. Without these, the model will freely mix retrieved facts with its training data, producing confident-sounding answers that blend truth with fabrication. Example: "Answer the question using ONLY the information in the context below. If the context does not contain enough information, say so."</li>
        <li><strong style="color:#e5e5e5">Citation requirements:</strong> Requiring the LLM to cite which chunk or source supports each claim forces it to ground every statement. This both reduces hallucination and gives users a way to verify answers. Citations also make evaluation much easier — you can automatically check whether cited sources actually support the claims made.</li>
        <li><strong style="color:#e5e5e5">Hallucination prevention:</strong> Beyond grounding instructions, effective strategies include lowering temperature (0.1-0.3), explicitly instructing the model to say "I don't know" when context is insufficient, separating retrieved context from the question with clear delimiters, and ordering chunks by relevance score so the most relevant information appears first in the context window.</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.15);margin:1.25rem 0">
      <strong style="color:#8b5cf6;font-size:.95rem">Hybrid Search</strong>
      <p style="font-size:.85rem;color:#e5e5e5;margin:.6rem 0 .4rem">Hybrid search is the recognition that neither keyword search nor vector search is universally superior. Each has blind spots that the other covers, and combining them produces the most robust retrieval.</p>
      <ul style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;padding-left:1.2rem;line-height:1.7">
        <li><strong style="color:#e5e5e5">BM25 + vector:</strong> BM25 is a term-frequency-based algorithm that excels at exact-match retrieval — error codes, product SKUs, statute numbers, technical identifiers. Vector search excels at meaning-based retrieval — finding documents about "automobile maintenance" when the query says "car repair." Hybrid search runs both in parallel and merges results.</li>
        <li><strong style="color:#e5e5e5">Alpha weighting:</strong> The alpha parameter controls the blend. An alpha of 0.0 is pure keyword search, 1.0 is pure vector search, and 0.5 is an equal mix. The optimal alpha depends on your domain. Legal and medical domains with exact terminology often perform best at 0.3-0.4 (keyword-heavy). Creative or conversational domains benefit from 0.6-0.8 (semantic-heavy). Tuning alpha on your evaluation dataset is one of the highest-ROI optimizations available.</li>
        <li><strong style="color:#e5e5e5">When to use each:</strong> Use pure vector search when queries are natural language and the corpus uses varied vocabulary. Use pure keyword search when queries contain identifiers that must match exactly. Use hybrid (the default recommendation) when your query mix includes both types, or when you are unsure — hybrid rarely underperforms the better individual method by much, and often outperforms both.</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <h2>Common RAG Mistakes</h2>
    <p>These are the errors that trip up even experienced engineers. Each one is easy to make and hard to diagnose because the system still produces answers — just bad ones. Knowing these patterns lets you avoid them in your own builds and diagnose them quickly when reviewing others.</p>

    <div style="display:grid;gap:.75rem;margin:1.25rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.88rem">1. Mismatched Embedding Models</strong>
        <p style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;line-height:1.65">Using one embedding model to index documents and a different model to embed queries. The two models produce vectors in different geometric spaces, so similarity scores become meaningless. The system still returns results — they are just random. This is the single most common and most damaging mistake because it silently degrades every query without any error message. Always verify that your indexing pipeline and query pipeline use the exact same model name and version.</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.88rem">2. Wrong Chunk Size</strong>
        <p style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;line-height:1.65">Chunks too large (1000+ words) dilute the embedding with off-topic content, so the vector represents an average of many ideas instead of one clear concept. The system retrieves chunks that are only vaguely relevant. Chunks too small (under 50 words) lose all surrounding context, so retrieved text is technically relevant but useless for answering the question. The fix is empirical: test 3-4 chunk sizes on representative queries and measure retrieval precision. Most domains land between 200 and 400 words.</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.88rem">3. No Grounding Instructions in the Prompt</strong>
        <p style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;line-height:1.65">Injecting retrieved context into the prompt without telling the LLM to use only that context. The model defaults to blending retrieved facts with its training knowledge, producing answers that look well-grounded but contain fabricated details. Without explicit grounding instructions, you have built a system that looks like RAG but behaves like a vanilla LLM with extra tokens in its prompt. Always include a directive like "Answer ONLY from the provided context."</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.88rem">4. Skipping Evaluation Metrics</strong>
        <p style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;line-height:1.65">Deploying a RAG system without measuring faithfulness, relevance, and completeness. Without metrics, you have no way to know if a change to chunking, prompts, or retrieval parameters made things better or worse. Every decision becomes guesswork. Set up an evaluation pipeline with at least 20-30 representative questions and ground-truth answers before you start tuning. Measure faithfulness first — a system that hallucinates is worse than one that says "I don't know."</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.88rem">5. Pure Vector Search for Exact-Match Domains</strong>
        <p style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;line-height:1.65">Relying solely on vector search when the domain includes identifiers, codes, or exact terminology. Vector search understands that "HTTP 404" and "page not found" are related, but it cannot guarantee an exact match on the string "ERR-4821-X" because the embedding might map it near similar-looking codes. Any domain with error codes, product IDs, legal references, medical codes, or technical identifiers needs hybrid search with meaningful keyword weight. This is not optional — it is a correctness requirement.</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.88rem">6. No Chunk Overlap</strong>
        <p style="font-size:.83rem;color:#a1a1aa;margin:.4rem 0 0;line-height:1.65">Splitting documents into perfectly adjacent, non-overlapping chunks. This creates hard boundaries where a key sentence at the end of chunk N and the beginning of chunk N+1 are separated. Neither chunk alone captures the full idea, and neither will be retrieved for a query about that idea. Adding 10-20% overlap between adjacent chunks ensures boundary information appears in at least one chunk with enough surrounding context to be useful. This is a one-line configuration change with outsized impact on retrieval quality.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Production RAG Checklist</h2>
    <p>Before deploying any RAG system to production, walk through this checklist. Each item addresses a failure mode that has caused real production incidents. A system that passes all of these checks is ready for users. One that fails any of them has a ticking time bomb.</p>

    <div style="padding:1.5rem;border-radius:12px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.15);margin:1.25rem 0">
      <div style="display:grid;gap:1rem">

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Embedding Model Consistency</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Verify that the exact same embedding model name AND version is used in the indexing pipeline and the query pipeline. Pin the model version in your configuration — do not use "latest." Document the model choice and the date it was set. If you ever need to change models, you must re-embed every document in your corpus. There are no shortcuts.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Chunk Overlap Configured</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Confirm that chunk overlap is set to 10-20% of chunk size. Test with a query whose answer spans a chunk boundary in your corpus — if the system cannot retrieve it, your overlap is insufficient or missing. Log the chunk size and overlap values in your system configuration for future reference.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Faithfulness Score Above 0.9</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Run your evaluation suite and confirm that the faithfulness (groundedness) metric is above 0.9 across your test set. If it is below 0.9, your system is hallucinating on more than 10% of answers — unacceptable for production. Diagnose whether the issue is in the prompt (missing grounding instructions), the retrieval (wrong chunks), or the generation (temperature too high). Do not ship until this passes.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Hybrid Search Enabled for Exact-Term Domains</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">If your domain includes any identifiers, codes, technical terms, or proper nouns that must match exactly, enable hybrid search and tune the alpha parameter on your evaluation set. Test with queries containing exact identifiers and confirm they return the correct documents. If your domain is purely conversational, pure vector search is acceptable, but document the decision.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Grounding Instructions in Every Prompt</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Verify that every prompt template used in your system contains explicit grounding instructions telling the LLM to answer only from the provided context. Include a fallback instruction for when context is insufficient ("If the provided context does not contain enough information to answer, say so"). Test this by asking a question your corpus cannot answer and confirming the system does not fabricate a response.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Similarity Threshold Set</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Configure a minimum similarity threshold so that low-relevance results are not passed to the LLM. Test by querying something completely outside your corpus and confirming the system returns no results (or a "no relevant information found" response) rather than injecting irrelevant chunks. A threshold between 0.7 and 0.85 is typical, but tune it for your data.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Monitoring and Logging in Place</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Every production RAG query should log: the original question, the retrieved chunk IDs and similarity scores, the assembled prompt (or a hash of it), the generated answer, and the latency of each stage. Without these logs, you cannot diagnose failures, measure drift over time, or identify queries that consistently produce poor results. Set up alerts for queries that return zero results above threshold and for latency spikes in the embedding or retrieval stages.</p>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:.75rem">
          <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">&#9744;</span>
          <div>
            <strong style="color:#34d399;font-size:.88rem">Evaluation Pipeline Automated</strong>
            <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.6">Your evaluation suite should run automatically on every change to chunking parameters, prompt templates, embedding models, or retrieval configuration. A regression in faithfulness or relevance should block deployment. Treat RAG evaluation the same way you treat unit tests in a CI/CD pipeline — the system should not reach production without passing.</p>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="divider"><span>Final Assessment</span></div>

  <div data-learn="QuizMC" data-props='{"title":"RAG Mastery — 10 Questions","questions":[{"q":"What does an embedding model produce?","options":["A summary of the input text","A list of keywords extracted from the text","A fixed-length vector of floating-point numbers that captures semantic meaning","A JSON object with sentiment analysis scores"],"correct":2,"explanation":"Embedding models convert text into dense vectors (lists of numbers) where similar meanings map to nearby points in the vector space. These vectors are the foundation of semantic search."},{"q":"Why is cosine similarity preferred over Euclidean distance for comparing embeddings?","options":["Cosine similarity is faster to compute","Cosine similarity measures the angle between vectors, making it magnitude-independent","Euclidean distance only works in 2D","Cosine similarity returns values between -1 and 1 which is easier to read"],"correct":1,"explanation":"Cosine similarity measures the angle between vectors, ignoring their magnitude. This means a long vector and a short vector pointing in the same direction are considered similar — which is what we want when comparing meaning, not vector length."},{"q":"What is the main tradeoff when choosing a smaller chunk size for RAG?","options":["Smaller chunks are more expensive to embed","Smaller chunks provide more precise retrieval but may lack surrounding context","Smaller chunks cause the vector database to run slower","Smaller chunks always produce worse results"],"correct":1,"explanation":"Small chunks give precise retrieval (the matched text is highly relevant) but may miss the context needed to understand that text. Overlap helps mitigate this."},{"q":"In the RAG pipeline, what happens AFTER the relevant chunks are retrieved from the vector database?","options":["The chunks are fed back into the embedding model","The chunks are inserted into the LLM prompt as context alongside the original question","The chunks are stored in a new database","The chunks are sent directly to the user as the answer"],"correct":1,"explanation":"This is the Augmentation step in RAG. Retrieved chunks become the context in a carefully crafted prompt that tells the LLM to answer based only on the provided context."},{"q":"What is the key advantage of hybrid search over pure vector search?","options":["Hybrid search is always faster","Hybrid search combines keyword precision with semantic understanding","Hybrid search uses less storage","Hybrid search does not require an embedding model"],"correct":1,"explanation":"Hybrid search combines BM25 (keyword) and vector (semantic) search. Keywords catch exact matches like error codes that vector search might miss, while vectors catch meaning-based matches. Together they cover more ground."},{"q":"Which metric measures whether a RAG answer contains ONLY information from the retrieved context?","options":["Relevance","Completeness","Faithfulness (Groundedness)","Precision"],"correct":2,"explanation":"Faithfulness (also called Groundedness) measures whether every claim in the answer is supported by the retrieved context. A faithfulness score of 1.0 means zero hallucination."},{"q":"What distinguishes Self-RAG from standard RAG?","options":["Self-RAG uses a different embedding model","Self-RAG lets the LLM decide whether retrieval is needed and self-evaluates answer quality","Self-RAG retrieves from multiple databases simultaneously","Self-RAG caches all previous queries for faster responses"],"correct":1,"explanation":"Self-RAG adds decision-making: the LLM decides whether retrieval is needed (saving cost on simple questions), then self-evaluates answer quality after generating."},{"q":"You are building a RAG system for a legal firm with exact statute numbers. What search strategy?","options":["Pure vector search — it understands meaning better","Pure keyword search — exact matching is all you need","Hybrid search with higher keyword weight — statutes need exact matching, context needs semantic understanding","No search — just use a large context window LLM"],"correct":2,"explanation":"Legal documents require exact statute references (keyword strength) combined with understanding legal concepts in natural language (semantic strength). Hybrid with higher keyword weight is ideal."},{"q":"Your RAG evaluation shows: Relevance 5/5, Faithfulness 2/5, Completeness 4/5. What is the problem and how do you fix it?","options":["Retrieval is broken — change the embedding model","The LLM is hallucinating — strengthen grounding instructions, lower temperature, add citation requirements","Chunks are too small — increase chunk size","The knowledge base needs more documents"],"correct":1,"explanation":"High relevance means the right context is being retrieved. Low faithfulness means the LLM is adding claims not in the context — hallucinating. The fix is in the generation step: stronger grounding instructions, lower temperature, and explicit citation requirements."},{"q":"When should you use Agentic RAG over basic RAG?","options":["Always — it is strictly better","When the question requires planning across multiple knowledge bases and iterative retrieval","When you want to save on API costs","When the question is simple and direct"],"correct":1,"explanation":"Agentic RAG is the most powerful but also the most expensive and complex pattern. Use it only when queries require multi-source planning and iterative retrieval. For simple queries, basic RAG is faster, cheaper, and easier to maintain."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"RAG Course — Complete Review","cards":[{"front":"RAG","back":"Retrieval-Augmented Generation. Fetch relevant documents at query time and provide them as context to an LLM, grounding answers in specific retrieved knowledge instead of training memory."},{"front":"Embedding","back":"A fixed-length vector of numbers representing the semantic meaning of text. Similar meanings produce close vectors. Created by neural networks trained with contrastive learning."},{"front":"Vector Database","back":"A database optimized for storing and searching high-dimensional vectors by similarity. Uses HNSW indexes for millisecond searches across millions of vectors."},{"front":"Chunking","back":"Splitting documents into smaller segments before embedding. Key parameters: chunk size (100-500 words) and overlap (10-20%). Strategy depends on document type."},{"front":"Cosine Similarity","back":"Measures the angle between two vectors. Range: -1 to 1. Magnitude-independent — focuses on direction (meaning), not length."},{"front":"HNSW Index","back":"Hierarchical Navigable Small World — a graph-based index enabling approximate nearest neighbor search in sub-linear time. The reason vector search is fast."},{"front":"Augmented Prompt","back":"A prompt containing retrieved chunks as context plus grounding instructions. The bridge between retrieval and generation in RAG."},{"front":"Hybrid Search","back":"Combining BM25 keyword search with vector semantic search, weighted by an alpha parameter. Handles both exact terms and meaning-based queries."},{"front":"Faithfulness","back":"A RAG evaluation metric: every claim in the answer is supported by retrieved context. Score 1.0 = zero hallucination. The most critical safety metric."},{"front":"Agentic RAG","back":"An autonomous agent that plans its own multi-source retrieval strategy for complex queries. The most powerful but most expensive RAG pattern."}]}'></div>
</div>
