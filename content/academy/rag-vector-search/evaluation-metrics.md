---
title: "Evaluation Metrics"
course: "rag-vector-search"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Evaluation Metrics</h1>
  <p class="sub">If you cannot measure it, you cannot improve it. A RAG system without evaluation is a black box — you have no idea whether it is hallucinating, missing answers, or returning irrelevant context. This lesson teaches you the three critical dimensions of RAG quality, the frameworks that automate measurement, and the code to evaluate your own system.</p>
</div>

  <div class="section">
    <h2>The RAG Quality Triangle</h2>
    <p>A good RAG answer must pass three tests. Failing any one of them makes the answer unreliable:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">1. Relevance — Did we find the right context?</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The retrieved chunks should actually relate to the question asked. If the user asks about refund policies and you retrieve chunks about shipping schedules, the answer will be useless — even if the LLM faithfully summarizes the shipping information. Low relevance = retrieval failure.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">2. Faithfulness — Is the answer grounded in context?</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Every claim in the answer must be supported by the retrieved context. If the answer says "refunds take 5-7 business days" but no chunk mentions this, the model hallucinated. Faithfulness = zero hallucination. This is the most critical safety metric for production RAG.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">3. Completeness — Did we cover everything?</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The answer should include all key information from the retrieved context. If the context mentions three refund options but the answer only mentions one, it is incomplete. A correct but partial answer can be just as misleading as a wrong one.</p>
      </div>
    </div>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Diagnostic Tip:</strong> When an answer is wrong, the triangle tells you WHERE to fix:<br>
      High faithfulness + low relevance → <strong>Retrieval problem.</strong> Fix chunking, embeddings, or search parameters.<br>
      Low faithfulness + high relevance → <strong>Generation problem.</strong> Fix prompt template or grounding instructions.<br>
      Low completeness → <strong>top_k too low</strong> or chunks too small. Retrieve more context.
    </div>
  </div>

  <div class="section">
    <h2>LLM-as-a-Judge</h2>
    <p>Manually evaluating thousands of question-answer pairs is impossibly slow. The solution: use a powerful LLM to score answers automatically. You send the question, context, and answer to a judge model (like Claude or GPT-4) and ask it to rate each metric on a 1-5 scale with explanation.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic
<span style="color:#c084fc">import</span> json

claude = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">evaluate_rag_answer</span>(question, context, answer):
    <span style="color:#fb923c">"""Score a RAG answer on relevance, faithfulness, and completeness."""</span>

    eval_prompt = <span style="color:#c084fc">f</span><span style="color:#fbbf24">"""Evaluate this RAG system output. Score each metric 1-5.

Question: {question}

Retrieved Context:
{context}

Generated Answer:
{answer}

Rate these three metrics (1=terrible, 5=perfect):

1. RELEVANCE: Does the retrieved context relate to the question?
2. FAITHFULNESS: Does EVERY claim in the answer appear in the context?
   (Any claim not in the context = hallucination = lower score)
3. COMPLETENESS: Does the answer cover all key info from the context?

Return JSON: {{"relevance": N, "faithfulness": N, "completeness": N,
"hallucinations": ["list any claims not in context"],
"missing_info": ["list any context info not in answer"]}}"""</span>

    response = claude.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-20250514"</span>,
        max_tokens=<span style="color:#fbbf24">512</span>,
        messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: eval_prompt}]
    )

    <span style="color:#c084fc">return</span> json.loads(response.content[<span style="color:#fbbf24">0</span>].text)

<span style="color:#71717a"># Example usage</span>
scores = evaluate_rag_answer(
    question=<span style="color:#fbbf24">"What is the refund policy?"</span>,
    context=<span style="color:#fbbf24">"Pro plan: 14-day refund window. Contact billing@acme.io."</span>,
    answer=<span style="color:#fbbf24">"The Pro plan has a 14-day refund window. Contact billing@acme.io."</span>
)
<span style="color:#34d399">print</span>(scores)
<span style="color:#71717a"># {"relevance": 5, "faithfulness": 5, "completeness": 5,
#  "hallucinations": [], "missing_info": []}</span></code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Running Evaluation at Scale</h2>
    <p>A proper evaluation runs your test set through the RAG pipeline and scores every answer:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">run_evaluation</span>(test_set, rag_fn):
    <span style="color:#fb923c">"""Evaluate a RAG system against a test set."""</span>
    results = []

    <span style="color:#c084fc">for</span> test <span style="color:#c084fc">in</span> test_set:
        <span style="color:#71717a"># Run the RAG pipeline</span>
        answer, chunks = rag_fn(test[<span style="color:#fbbf24">"question"</span>])
        context = <span style="color:#fbbf24">"\n"</span>.join([c[<span style="color:#fbbf24">"content"</span>] <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> chunks])

        <span style="color:#71717a"># Score the answer</span>
        scores = evaluate_rag_answer(test[<span style="color:#fbbf24">"question"</span>], context, answer)
        scores[<span style="color:#fbbf24">"question"</span>] = test[<span style="color:#fbbf24">"question"</span>]
        results.append(scores)

    <span style="color:#71717a"># Compute averages</span>
    avg = {
        <span style="color:#fbbf24">"relevance"</span>: <span style="color:#34d399">sum</span>(r[<span style="color:#fbbf24">"relevance"</span>] <span style="color:#c084fc">for</span> r <span style="color:#c084fc">in</span> results) / <span style="color:#34d399">len</span>(results),
        <span style="color:#fbbf24">"faithfulness"</span>: <span style="color:#34d399">sum</span>(r[<span style="color:#fbbf24">"faithfulness"</span>] <span style="color:#c084fc">for</span> r <span style="color:#c084fc">in</span> results) / <span style="color:#34d399">len</span>(results),
        <span style="color:#fbbf24">"completeness"</span>: <span style="color:#34d399">sum</span>(r[<span style="color:#fbbf24">"completeness"</span>] <span style="color:#c084fc">for</span> r <span style="color:#c084fc">in</span> results) / <span style="color:#34d399">len</span>(results),
    }
    <span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Avg Relevance: {avg['relevance']:.1f}/5"</span>)
    <span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Avg Faithfulness: {avg['faithfulness']:.1f}/5"</span>)
    <span style="color:#34d399">print</span>(<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Avg Completeness: {avg['completeness']:.1f}/5"</span>)

    <span style="color:#c084fc">return</span> results, avg</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Build your test set with 20-50 questions covering your most common query types. Include edge cases (unanswerable questions, multi-topic queries, exact-match queries).</p>
  </div>

  <div class="section">
    <h2>Evaluation Frameworks</h2>
    <p>Open-source frameworks automate RAG evaluation with pre-built metrics:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">RAGAS</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The most popular RAG evaluation framework. Measures faithfulness, answer relevancy, context precision, and context recall. Open-source Python library. <code>pip install ragas</code></p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">DeepEval</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">LLM evaluation framework with RAG-specific metrics: hallucination detection, answer relevancy, contextual precision/recall. Integrates with CI/CD pipelines for automated quality gates.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">TruLens</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Evaluation and tracking for LLM apps. Provides the "RAG Triad" of metrics: answer relevance, context relevance, and groundedness. Good dashboard for monitoring quality over time.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">Custom LLM Judge</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Build your own evaluator (like the code above). Simple, flexible, domain-adaptable. No dependencies. This is what most teams start with before adopting a framework.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Interpreting Results and Fixing Problems</h2>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Low Relevance (< 3/5)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>Fix retrieval:</strong> Better embeddings, better chunking, hybrid search, higher top_k, or query rewriting. The wrong documents are being retrieved.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Low Faithfulness (< 4/5)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>Fix generation:</strong> Stronger grounding instructions, lower temperature, explicit "cite your source" instructions, or a more capable LLM. The model is inventing claims not in the context.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Low Completeness (< 3/5)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>Fix scope:</strong> Higher top_k, larger chunks, or "Include all relevant details" in the prompt. The answer is leaving out information that exists in the context.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">All High (4-5/5)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>Ship it.</strong> Your RAG system is performing well. Monitor over time and re-evaluate when you add new documents or change parameters.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Building a Test Set</h2>
    <p>A good evaluation test set has these properties:</p>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">20-50 questions minimum.</strong> Fewer gives unreliable averages. More is better but expensive to create.<br>
      <strong style="color:#e5e5e5">Cover your query types.</strong> Simple factual, multi-topic, comparative, "how to," and exact-match queries.<br>
      <strong style="color:#e5e5e5">Include unanswerable questions.</strong> 10-20% should be questions the knowledge base cannot answer. A good RAG system says "I don't know" for these.<br>
      <strong style="color:#e5e5e5">Include expected answers.</strong> For each question, write the ideal answer so you can compare against the RAG output.<br>
      <strong style="color:#e5e5e5">Update when docs change.</strong> When you add or modify documents, update your test set to match.
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"RAG Evaluation Metrics Quiz","questions":[{"q":"A RAG answer scores 5/5 on Faithfulness but 1/5 on Relevance. What does this mean?","options":["The answer is perfect","The answer only uses information from the context, but the retrieved context was irrelevant to the question","The answer hallucinated information","The answer is incomplete"],"correct":1,"explanation":"High faithfulness means the answer only uses retrieved context — no hallucinations. Low relevance means the wrong context was retrieved in the first place, so the answer is accurate to its sources but useless to the user. This signals a retrieval problem, not a generation problem."},{"q":"Which metric specifically detects hallucination in a RAG answer?","options":["Relevance","Completeness","Faithfulness (Groundedness)","Context Recall"],"correct":2,"explanation":"Faithfulness (also called Groundedness) measures whether every claim in the answer is supported by the retrieved context. A score of 1.0 means zero hallucination. This is the most critical safety metric for production RAG systems."},{"q":"What is RAGAS?","options":["A vector database optimized for RAG","An open-source framework for automatically evaluating RAG pipelines across multiple quality metrics","A chunking library for Python","A prompt template for RAG systems"],"correct":1,"explanation":"RAGAS (Retrieval Augmented Generation Assessment) is the most widely used open-source framework for RAG evaluation. It automatically scores faithfulness, answer relevancy, context precision, and context recall using an LLM judge."},{"q":"Your evaluation shows high relevance, high faithfulness, but low completeness. What should you fix?","options":["Change the embedding model","Increase top_k to retrieve more chunks and add detail instructions to the prompt","Lower the similarity threshold","Use a different vector database"],"correct":1,"explanation":"Low completeness with high relevance and faithfulness means the right context is being retrieved and the answer is grounded, but it is leaving out information. Retrieving more chunks (higher top_k) and adding instructions like \"Include all relevant details\" will improve completeness."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Evaluation Metrics Flashcards","cards":[{"front":"Faithfulness (Groundedness)","back":"Every claim in the answer is supported by retrieved context. Score 1.0 = zero hallucination. The most critical RAG safety metric."},{"front":"Answer Relevance","back":"The generated answer actually addresses the user question. A faithful answer can still miss the point entirely."},{"front":"Context Relevance","back":"The retrieved chunks are related to the question asked. Low context relevance = retrieval failure, not generation failure."},{"front":"Completeness","back":"The answer covers all key information present in the retrieved context. A correct but incomplete answer may still mislead users."},{"front":"LLM-as-a-Judge","back":"Using a powerful LLM (e.g. Claude) to automatically score other LLM outputs against criteria. Enables large-scale evaluation without human labelers."},{"front":"RAGAS","back":"Open-source Python library for automated RAG evaluation. Measures faithfulness, answer relevancy, context precision, and context recall."}]}'></div>

</div>
