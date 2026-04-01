---
title: "Evaluation Metrics"
course: "rag-vector-search"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~50 min</span>
    </div>
    <h1>Evaluation Metrics</h1>
    <p>If you can't measure it, you can't improve it. Learn the three critical dimensions of RAG quality and how to score them systematically.</p>
  </div>

  <div class="narration">
    <strong>The RAG quality triangle:</strong> A good RAG answer must be (1) <strong>Relevant</strong> — the retrieved context actually relates to the question, (2) <strong>Faithful</strong> — the answer only contains claims supported by the context, and (3) <strong>Complete</strong> — the answer covers all the important information from the context. Rate the scenarios below.
  </div>

  <div class="narration" style="margin-top:2rem">
    <strong>Automated evaluation:</strong> In production, you use LLM-as-a-judge to score these metrics automatically. You send the question + context + answer to GPT-4 and ask it to rate relevance, faithfulness, and completeness on a 1-5 scale. This lets you evaluate thousands of question-answer pairs without manual review.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Evaluation Frameworks</h3>
  <div class="frameworks">
    <div class="framework"><h4>RAGAS</h4><p>Open-source framework for RAG evaluation. Measures faithfulness, answer relevancy, context precision, and context recall. The most popular automated RAG evaluation tool.</p></div>
    <div class="framework"><h4>DeepEval</h4><p>LLM evaluation framework with RAG-specific metrics: hallucination, answer relevancy, contextual precision/recall. Integrates with CI/CD pipelines.</p></div>
    <div class="framework"><h4>TruLens</h4><p>Evaluation and tracking for LLM apps. Provides the "RAG Triad" of metrics: answer relevance, context relevance, and groundedness.</p></div>
    <div class="framework"><h4>Custom LLM Judge</h4><p>Build your own evaluator by prompting GPT-4: "Rate this answer's faithfulness to the context on 1-5. Explain." Simple, flexible, and domain-adaptable.</p></div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"RAG Evaluation Metrics Quiz","questions":[{"q":"A RAG answer scores 5/5 on Faithfulness but 1/5 on Relevance. What does this mean?","options":["The answer is perfect","The answer only uses information from the context, but the retrieved context was irrelevant to the question","The answer hallucinated information","The answer is incomplete"],"correct":1,"explanation":"High faithfulness means the answer only uses retrieved context — no hallucinations. Low relevance means the wrong context was retrieved in the first place, so the answer is accurate to its sources but useless to the user. This signals a retrieval problem, not a generation problem."},{"q":"Which metric specifically detects hallucination in a RAG answer?","options":["Relevance","Completeness","Faithfulness (Groundedness)","Context Recall"],"correct":2,"explanation":"Faithfulness (also called Groundedness) measures whether every claim in the answer is supported by the retrieved context. A score of 1.0 means zero hallucination. This is the most critical safety metric for production RAG systems."},{"q":"What is RAGAS?","options":["A vector database optimized for RAG","An open-source framework for automatically evaluating RAG pipelines across multiple quality metrics","A chunking library for Python","A prompt template for RAG systems"],"correct":1,"explanation":"RAGAS (Retrieval Augmented Generation Assessment) is the most widely used open-source framework for RAG evaluation. It automatically scores faithfulness, answer relevancy, context precision, and context recall using an LLM judge — no manual labeling needed."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Evaluation Metrics Flashcards","cards":[{"front":"Faithfulness (Groundedness)","back":"Every claim in the answer is supported by retrieved context. Score 1.0 = zero hallucination. The most critical RAG safety metric."},{"front":"Answer Relevance","back":"The generated answer actually addresses the user question. A faithful answer can still miss the point entirely."},{"front":"Context Relevance","back":"The retrieved chunks are related to the question asked. Low context relevance = retrieval failure, not generation failure."},{"front":"Completeness","back":"The answer covers all key information present in the retrieved context. A correct but incomplete answer may still mislead users."},{"front":"LLM-as-a-Judge","back":"Using a powerful LLM (e.g. GPT-4) to automatically score other LLM outputs against criteria. Enables large-scale evaluation without human labelers."},{"front":"RAGAS","back":"Open-source Python library for automated RAG evaluation. Measures faithfulness, answer relevancy, context precision, and context recall."}]}'></div>


</div>
