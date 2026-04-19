# Evaluation Metrics

**Course:** RAG & Vector Search
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 8 of 10


  # Evaluation Metrics

  If you cannot measure it, you cannot improve it. A RAG system without evaluation is a black box — you have no idea whether it is hallucinating, missing answers, or returning irrelevant context. This lesson teaches you the three critical dimensions of RAG quality, the frameworks that automate measurement, and the code to evaluate your own system.



    ## The RAG Quality Triangle

    A good RAG answer must pass three tests. Failing any one of them makes the answer unreliable:



        **1. Relevance — Did we find the right context?**
        The retrieved chunks should actually relate to the question asked. If the user asks about refund policies and you retrieve chunks about shipping schedules, the answer will be useless — even if the LLM faithfully summarizes the shipping information. Low relevance = retrieval failure.


        **2. Faithfulness — Is the answer grounded in context?**
        Every claim in the answer must be supported by the retrieved context. If the answer says "refunds take 5-7 business days" but no chunk mentions this, the model hallucinated. Faithfulness = zero hallucination. This is the most critical safety metric for production RAG.


        **3. Completeness — Did we cover everything?**
        The answer should include all key information from the retrieved context. If the context mentions three refund options but the answer only mentions one, it is incomplete. A correct but partial answer can be just as misleading as a wrong one.




      **Diagnostic Tip:** When an answer is wrong, the triangle tells you WHERE to fix:

      High faithfulness + low relevance → **Retrieval problem.** Fix chunking, embeddings, or search parameters.

      Low faithfulness + high relevance → **Generation problem.** Fix prompt template or grounding instructions.

      Low completeness → **top_k too low** or chunks too small. Retrieve more context.




    ## LLM-as-a-Judge

    Manually evaluating thousands of question-answer pairs is impossibly slow. The solution: use a powerful LLM to score answers automatically. You send the question, context, and answer to a judge model (like Claude or GPT-4) and ask it to rate each metric on a 1-5 scale with explanation.



```
import anthropic
import json

claude = anthropic.Anthropic()

def evaluate_rag_answer(question, context, answer):
    """Score a RAG answer on relevance, faithfulness, and completeness."""

    eval_prompt = f"""Evaluate this RAG system output. Score each metric 1-5.

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
"missing_info": ["list any context info not in answer"]}}"""

    response = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        messages=[{"role": "user", "content": eval_prompt}]
    )

    return json.loads(response.content[0].text)

# Example usage
scores = evaluate_rag_answer(
    question="What is the refund policy?",
    context="Pro plan: 14-day refund window. Contact billing@acme.io.",
    answer="The Pro plan has a 14-day refund window. Contact billing@acme.io."
)
print(scores)
# {"relevance": 5, "faithfulness": 5, "completeness": 5,
#  "hallucinations": [], "missing_info": []}
```





    ## Running Evaluation at Scale

    A proper evaluation runs your test set through the RAG pipeline and scores every answer:



```
def run_evaluation(test_set, rag_fn):
    """Evaluate a RAG system against a test set."""
    results = []

    for test in test_set:
        # Run the RAG pipeline
        answer, chunks = rag_fn(test["question"])
        context = "\n".join([c["content"] for c in chunks])

        # Score the answer
        scores = evaluate_rag_answer(test["question"], context, answer)
        scores["question"] = test["question"]
        results.append(scores)

    # Compute averages
    avg = {
        "relevance": sum(r["relevance"] for r in results) / len(results),
        "faithfulness": sum(r["faithfulness"] for r in results) / len(results),
        "completeness": sum(r["completeness"] for r in results) / len(results),
    }
    print(f"Avg Relevance: {avg['relevance']:.1f}/5")
    print(f"Avg Faithfulness: {avg['faithfulness']:.1f}/5")
    print(f"Avg Completeness: {avg['completeness']:.1f}/5")

    return results, avg
```


    Build your test set with 20-50 questions covering your most common query types. Include edge cases (unanswerable questions, multi-topic queries, exact-match queries).



    ## Evaluation Frameworks

    Open-source frameworks automate RAG evaluation with pre-built metrics:



        **RAGAS**
        The most popular RAG evaluation framework. Measures faithfulness, answer relevancy, context precision, and context recall. Open-source Python library. `pip install ragas`


        **DeepEval**
        LLM evaluation framework with RAG-specific metrics: hallucination detection, answer relevancy, contextual precision/recall. Integrates with CI/CD pipelines for automated quality gates.


        **TruLens**
        Evaluation and tracking for LLM apps. Provides the "RAG Triad" of metrics: answer relevance, context relevance, and groundedness. Good dashboard for monitoring quality over time.


        **Custom LLM Judge**
        Build your own evaluator (like the code above). Simple, flexible, domain-adaptable. No dependencies. This is what most teams start with before adopting a framework.





    ## Interpreting Results and Fixing Problems




        **Low Relevance (**Fix retrieval:** Better embeddings, better chunking, hybrid search, higher top_k, or query rewriting. The wrong documents are being retrieved.


        **Low Faithfulness (**Fix generation:** Stronger grounding instructions, lower temperature, explicit "cite your source" instructions, or a more capable LLM. The model is inventing claims not in the context.


        **Low Completeness (**Fix scope:** Higher top_k, larger chunks, or "Include all relevant details" in the prompt. The answer is leaving out information that exists in the context.


        **All High (4-5/5)**
        **Ship it.** Your RAG system is performing well. Monitor over time and re-evaluate when you add new documents or change parameters.





    ## Building a Test Set

    A good evaluation test set has these properties:


      **20-50 questions minimum.** Fewer gives unreliable averages. More is better but expensive to create.

      **Cover your query types.** Simple factual, multi-topic, comparative, "how to," and exact-match queries.

      **Include unanswerable questions.** 10-20% should be questions the knowledge base cannot answer. A good RAG system says "I don't know" for these.

      **Include expected answers.** For each question, write the ideal answer so you can compare against the RAG output.

      **Update when docs change.** When you add or modify documents, update your test set to match.



  Test Your Understanding


### Quiz

**Q1: A RAG answer scores 5/5 on Faithfulness but 1/5 on Relevance. What does this mean?**
    A. The answer is perfect
  ✓ B. The answer only uses information from the context, but the retrieved context was irrelevant to the question
    C. The answer hallucinated information
    D. The answer is incomplete
  *High faithfulness means the answer only uses retrieved context — no hallucinations. Low relevance means the wrong context was retrieved in the first place, so the answer is accurate to its sources but useless to the user. This signals a retrieval problem, not a generation problem.*

**Q2: Which metric specifically detects hallucination in a RAG answer?**
    A. Relevance
    B. Completeness
  ✓ C. Faithfulness (Groundedness)
    D. Context Recall
  *Faithfulness (also called Groundedness) measures whether every claim in the answer is supported by the retrieved context. A score of 1.0 means zero hallucination. This is the most critical safety metric for production RAG systems.*

**Q3: What is RAGAS?**
    A. A vector database optimized for RAG
  ✓ B. An open-source framework for automatically evaluating RAG pipelines across multiple quality metrics
    C. A chunking library for Python
    D. A prompt template for RAG systems
  *RAGAS (Retrieval Augmented Generation Assessment) is the most widely used open-source framework for RAG evaluation. It automatically scores faithfulness, answer relevancy, context precision, and context recall using an LLM judge.*

**Q4: Your evaluation shows high relevance, high faithfulness, but low completeness. What should you fix?**
    A. Change the embedding model
  ✓ B. Increase top_k to retrieve more chunks and add detail instructions to the prompt
    C. Lower the similarity threshold
    D. Use a different vector database
  *Low completeness with high relevance and faithfulness means the right context is being retrieved and the answer is grounded, but it is leaving out information. Retrieving more chunks (higher top_k) and adding instructions like "Include all relevant details" will improve completeness.*



### Evaluation Metrics Flashcards

**Card 1:**
Front: Faithfulness (Groundedness)
Back: Every claim in the answer is supported by retrieved context. Score 1.0 = zero hallucination. The most critical RAG safety metric.

**Card 2:**
Front: Answer Relevance
Back: The generated answer actually addresses the user question. A faithful answer can still miss the point entirely.

**Card 3:**
Front: Context Relevance
Back: The retrieved chunks are related to the question asked. Low context relevance = retrieval failure, not generation failure.

**Card 4:**
Front: Completeness
Back: The answer covers all key information present in the retrieved context. A correct but incomplete answer may still mislead users.

**Card 5:**
Front: LLM-as-a-Judge
Back: Using a powerful LLM (e.g. Claude) to automatically score other LLM outputs against criteria. Enables large-scale evaluation without human labelers.

**Card 6:**
Front: RAGAS
Back: Open-source Python library for automated RAG evaluation. Measures faithfulness, answer relevancy, context precision, and context recall.
