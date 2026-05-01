---
title: "Production Fine-Tuning Patterns"
course: "fine-tuning-models"
order: 10
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Production Fine-Tuning <span class="accent">Patterns.</span></h1>
  <p class="sub">Battle-tested architectures for fine-tuning at scale in real production systems.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Five production patterns: router, cascade, ensemble, distillation, and multi-LoRA</li>
    <li>How to combine fine-tuned models with RAG for maximum capability</li>
    <li>Cost optimization strategies that cut inference bills by 60-80%</li>
    <li>The complete production fine-tuning checklist</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Pattern 1: The Router Pattern</h2>

Use a lightweight classifier to route queries to specialized fine-tuned models. Each model is an expert in its domain.

```
User Query → Router (small model or classifier)
                │
                ├─ Legal queries      → Legal LoRA adapter
                ├─ Medical queries    → Medical LoRA adapter
                ├─ Code queries       → Code LoRA adapter
                └─ General queries    → Base model (no adapter)
```

**Implementation:**
```python
from transformers import pipeline

# Router: lightweight classifier
router = pipeline(
    "text-classification",
    model="./query-router-model",  # Fine-tuned BERT or similar
    device="cpu",  # Router is tiny, runs on CPU
)

# Adapters loaded on GPU
ADAPTERS = {
    "legal": "./adapters/legal-lora",
    "medical": "./adapters/medical-lora",
    "code": "./adapters/code-lora",
}

async def route_and_respond(query):
    # Step 1: Classify the query
    category = router(query)[0]["label"]

    # Step 2: Load appropriate adapter
    if category in ADAPTERS:
        model.load_adapter(ADAPTERS[category])
        model.set_adapter(category)
    else:
        model.disable_adapter_layers()

    # Step 3: Generate response
    return generate(model, query)
```

**Why this pattern works:**
- Each adapter is small (10-100MB) and can be hot-swapped
- The router adds <5ms latency (negligible)
- Each domain gets a specialist model without multiplying GPU costs
- New domains are added by training new adapters, not new models

<div class="tip-box">
The router itself can be a fine-tuned model. Train a tiny classifier (BERT-tiny, 15M parameters) on 1,000 labeled queries. It will achieve 95%+ routing accuracy and add essentially zero latency to the pipeline.
</div>
</div>

<div class="lesson-section">
<h2>Pattern 2: The Cascade Pattern</h2>

Start with a cheap, fast model. Escalate to a larger, expensive model only when the cheap model is uncertain.

```
User Query → Small Model (8B, fine-tuned)
                │
                ├─ Confident (>90% score) → Return response
                │
                └─ Uncertain (<90% score) → Large Model (70B)
                                              │
                                              └─ Return response
```

```python
def cascade_inference(query, small_model, large_model, threshold=0.9):
    """Use cheap model first, escalate to expensive model if uncertain."""

    # Step 1: Try small model
    small_response = small_model.generate(
        query,
        output_scores=True,
        return_dict_in_generate=True,
    )

    # Step 2: Calculate confidence
    logprobs = small_response.scores
    avg_confidence = compute_avg_token_probability(logprobs)

    # Step 3: Route based on confidence
    if avg_confidence > threshold:
        return {
            "response": decode(small_response),
            "model": "small",
            "confidence": avg_confidence,
            "cost": SMALL_MODEL_COST,
        }
    else:
        large_response = large_model.generate(query)
        return {
            "response": decode(large_response),
            "model": "large",
            "confidence": None,
            "cost": LARGE_MODEL_COST,
        }
```

**Economics of the cascade:**
```
Assumption: 70% of queries are "easy" (small model handles them)
Small model cost: $0.001 per query
Large model cost: $0.010 per query

Without cascade: 100% * $0.010 = $0.010 per query
With cascade:    70% * $0.001 + 30% * $0.010 = $0.0037 per query

Savings: 63% cost reduction with minimal quality loss
```
</div>

<div class="lesson-section">
<h2>Pattern 3: Distillation</h2>

Train a small, cheap model to mimic a large, expensive model. The small model learns the large model's behavior from generated outputs.

```python
def distill_dataset(teacher_model, prompts, num_samples=3):
    """Generate training data from a teacher model."""
    training_data = []

    for prompt in prompts:
        # Generate multiple responses from teacher
        responses = [
            teacher_model.generate(prompt)
            for _ in range(num_samples)
        ]

        # Score responses (use LLM-as-judge or automated metrics)
        scores = [evaluate_quality(r) for r in responses]

        # Use the best response as training target
        best_idx = scores.index(max(scores))
        training_data.append({
            "messages": [
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": responses[best_idx]},
            ]
        })

    return training_data

# Distillation workflow
teacher = load_model("claude-sonnet-4-20250514")  # Large, expensive
student_base = load_model("llama-3.1-8b")  # Small, cheap

# Step 1: Generate training data from teacher
prompts = load_production_prompts(n=5000)
distill_data = distill_dataset(teacher, prompts)

# Step 2: Fine-tune student on teacher's outputs
train_lora(student_base, distill_data)

# Step 3: Deploy student at 1/10th the cost
# Student quality: 85-95% of teacher on in-distribution queries
```

**When distillation works best:**
```
- Task is well-defined with clear quality criteria
- You have many representative prompts from production
- Cost reduction is the primary goal
- You can tolerate a 5-15% quality drop
- The smaller model has enough capacity for the task
```

<div class="callout">
<strong>Legal consideration:</strong> Some model providers prohibit using their outputs to train competing models. Check the terms of service before distilling from proprietary models. Open-weight models (Llama, Mistral) generally allow this.
</div>
</div>

<div class="lesson-section">
<h2>Pattern 4: Fine-Tuned RAG</h2>

Combine fine-tuning with retrieval-augmented generation for maximum capability. The fine-tuned model learns how to use retrieved context effectively.

```python
def finetune_rag_example(query, relevant_docs, ideal_answer):
    """Training format for RAG-aware fine-tuning."""
    context = "\n\n".join([
        f"Document {i+1}: {doc}" for i, doc in enumerate(relevant_docs)
    ])

    return {
        "messages": [
            {
                "role": "system",
                "content": "Answer questions using the provided documents. Cite document numbers. If the documents do not contain the answer, say so."
            },
            {
                "role": "user",
                "content": f"Documents:\n{context}\n\nQuestion: {query}"
            },
            {
                "role": "assistant",
                "content": ideal_answer
            }
        ]
    }

# The model learns:
# 1. How to extract relevant info from retrieved docs
# 2. How to cite sources properly
# 3. When to say "information not found"
# 4. How to synthesize across multiple documents
# 5. Your specific output format and style
```

**Why fine-tuned RAG outperforms both components alone:**
```
Base model + RAG:        Good retrieval, mediocre synthesis
Fine-tuned (no RAG):     Good style, limited knowledge
Fine-tuned + RAG:        Good retrieval + good synthesis + good style

Typical improvement:
  Base + RAG accuracy:        78%
  Fine-tuned only:            82%
  Fine-tuned + RAG:           93%
```
</div>

<div class="lesson-section">
<h2>The Production Checklist</h2>

Before deploying any fine-tuned model to production, verify every item:

```
DATA
[ ] Training data is representative of production queries
[ ] Data is deduplicated and quality-filtered
[ ] Test set is completely held out (no contamination)
[ ] PII is stripped from all training data
[ ] Data licensing allows commercial use

MODEL
[ ] Evaluation pipeline passes all quality gates
[ ] No catastrophic forgetting detected
[ ] Win rate vs base model exceeds 60%
[ ] Quantized model quality is within 2% of full precision
[ ] Model outputs validated on 50+ diverse test cases

DEPLOYMENT
[ ] Health check endpoint implemented
[ ] Monitoring and alerting configured
[ ] Rollback plan documented and tested
[ ] Rate limiting in place
[ ] Input/output logging enabled (with PII stripping)

OPERATIONS
[ ] Data flywheel pipeline running
[ ] Retraining schedule defined
[ ] Model version tracking in place
[ ] Cost tracking per query
[ ] Runbook for common failure modes
```

<div class="demo-container">
<h4>Final Exercise: End-to-End Production System</h4>
Build a complete production fine-tuning system. Choose one pattern (router, cascade, or distillation). Implement it with your fine-tuned model. Set up: deployment with health checks, production logging, automated evaluation after retraining, and a data flywheel that captures feedback. Run the checklist above and verify every item. Document what you built -- this is your portfolio piece.
</div>
</div>

<div class="lesson-section">
<h2>Course Summary</h2>

Over ten lessons, you have built the complete fine-tuning skill set:

```
Lesson 1:  Decision framework (when to fine-tune)
Lesson 2:  Data preparation (quality over quantity)
Lesson 3:  LoRA (efficient parameter updates)
Lesson 4:  QLoRA (large models on small GPUs)
Lesson 5:  Infrastructure (compute planning and cost)
Lesson 6:  Evaluation (metrics, benchmarks, quality gates)
Lesson 7:  Alignment (DPO/RLHF for preference learning)
Lesson 8:  Deployment (serving, quantization, monitoring)
Lesson 9:  Continuous training (data flywheels)
Lesson 10: Production patterns (router, cascade, distillation)
```

The field moves fast. Base models improve quarterly. New fine-tuning techniques emerge monthly. But the fundamentals -- data quality, rigorous evaluation, systematic deployment -- remain constant. Master these and you can adapt to any new tool or technique that emerges.
</div>

<QuizMC>
<Question text="What is the primary cost benefit of the cascade pattern?">
<Option text="It eliminates the need for a large model entirely" />
<Option correct text="It routes 70% of 'easy' queries to a cheap model, reducing average cost by 60%+ while maintaining quality" />
<Option text="It combines multiple small models to match large model quality" />
<Option text="It caches responses to avoid repeated inference" />
</Question>
<Question text="Why does fine-tuned RAG outperform either fine-tuning or RAG alone?">
<Option text="RAG provides faster inference speed to fine-tuned models" />
<Option text="Fine-tuning eliminates the need for document retrieval" />
<Option correct text="Fine-tuning teaches the model how to effectively synthesize retrieved context in your desired format and style" />
<Option text="The two techniques cancel out each other's weaknesses mathematically" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the five production fine-tuning patterns?" back="1. Router (classify and route to specialist adapters), 2. Cascade (cheap model first, escalate if uncertain), 3. Distillation (small model mimics large model), 4. Fine-tuned RAG (fine-tune + retrieval combined), 5. Multi-LoRA (swap adapters at runtime)" />
<Card front="What cost savings does the cascade pattern typically achieve?" back="63% cost reduction: 70% of queries handled by a cheap model ($0.001) and 30% escalated to an expensive model ($0.010), yielding $0.0037 average vs $0.010 without cascade." />
<Card front="What are the four sections of the production checklist?" back="1. Data (representative, deduplicated, PII-stripped, licensed), 2. Model (evaluation gates, no forgetting, win rate >60%), 3. Deployment (health checks, monitoring, rollback, rate limits), 4. Operations (flywheel, retraining schedule, version tracking)" />
<Card front="What is the typical quality retention when distilling from a large to small model?" back="The student model achieves 85-95% of the teacher model's quality on in-distribution queries, while running at roughly 1/10th the cost." />
<Card front="What three fundamentals remain constant despite rapidly changing tools?" back="1. Data quality (always the most important factor), 2. Rigorous evaluation (metrics, benchmarks, quality gates), 3. Systematic deployment (monitoring, versioning, flywheels)" />
</FlashDeck>

</div>