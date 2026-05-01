---
title: "Why Fine-Tune (and When NOT to)"
course: "fine-tuning-models"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Why Fine-Tune <span class="accent">(and When NOT to).</span></h1>
  <p class="sub">The decision framework that saves you weeks of wasted compute.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What fine-tuning actually changes inside a model and why it works</li>
    <li>The decision tree: prompting vs RAG vs fine-tuning vs training from scratch</li>
    <li>Real cost analysis of fine-tuning across different model sizes</li>
    <li>The five signals that indicate fine-tuning will actually help your use case</li>
  </ul>
</div>

<div class="lesson-section">
<h2>What Fine-Tuning Actually Does</h2>

A pre-trained language model is a compressed representation of language patterns learned from trillions of tokens. Fine-tuning adjusts a subset of these parameters using your domain-specific data to shift the model's behavior.

Mechanically, fine-tuning runs additional gradient descent steps on your data, updating weights to minimize loss on your examples. The model learns to produce outputs that look like your training data rather than the general pre-training distribution.

What changes:
```
- Output style and formatting (how the model responds)
- Domain vocabulary and jargon (what terms it uses naturally)
- Task-specific reasoning patterns (how it approaches problems)
- Tone and persona (who the model sounds like)
- Error patterns (what mistakes it avoids)
```

What does NOT change:
```
- Core world knowledge (fine-tuning does not teach new facts reliably)
- Fundamental reasoning ability (cannot make a 7B model reason like a 70B)
- Context window size (architectural constraint, not a weight issue)
- Inference speed (same model size, same speed)
```

<div class="tip-box">
The most common fine-tuning mistake: trying to teach a model new knowledge. Fine-tuning adjusts behavior, not knowledge. For new knowledge, use RAG (Retrieval-Augmented Generation). For behavior changes, fine-tune.
</div>
</div>

<div class="lesson-section">
<h2>The Decision Tree</h2>

Before committing to fine-tuning, walk through this decision tree:

```
START: "My model does not do what I want."
  │
  ├─ Have you tried better prompting?
  │   └─ No → Try few-shot prompting, system prompts,
  │           chain-of-thought. This solves 70% of cases.
  │
  ├─ Does the model lack domain knowledge?
  │   └─ Yes → Use RAG. Retrieve relevant documents and
  │            inject them into context. Fine-tuning is
  │            not reliable for factual knowledge injection.
  │
  ├─ Is the issue output FORMAT or STYLE?
  │   └─ Yes → Fine-tuning is ideal. This is its
  │            strongest use case. 100-500 examples
  │            usually sufficient.
  │
  ├─ Is the issue task ACCURACY on a specific task?
  │   └─ Yes → Fine-tuning helps. Need 500-5,000
  │            high-quality examples of correct behavior.
  │
  ├─ Do you need latency reduction?
  │   └─ Yes → Fine-tuning can replace complex prompt
  │            chains with a single model call. Faster
  │            inference, lower cost per request.
  │
  └─ Is the base model fundamentally too small?
      └─ Yes → No amount of fine-tuning fixes this.
               Use a larger base model or train from scratch.
```

**Cost comparison by approach:**

| Approach | Setup Cost | Per-Query Cost | Time to Deploy |
|----------|-----------|---------------|----------------|
| Better prompts | $0 | Base API price | Hours |
| RAG | $50-500 | Base + retrieval | Days |
| Fine-tuning (LoRA) | $10-500 | Reduced (shorter prompts) | Days-Weeks |
| Full fine-tuning | $500-50,000 | Same as LoRA | Weeks |
| Train from scratch | $100K-10M+ | Varies | Months |

<div class="callout">
<strong>The 80/20 rule:</strong> 80% of use cases are solved by better prompting and RAG. Fine-tuning is for the remaining 20% where you need specific output behavior at scale, reduced latency, or lower per-query cost.
</div>
</div>

<div class="lesson-section">
<h2>The Five Signals for Fine-Tuning</h2>

Fine-tuning is the right choice when you can check at least three of these five boxes:

**Signal 1 - Consistent output format required:**
You need the model to always respond in a specific JSON schema, follow a particular writing style, or adhere to a formatting convention that prompting cannot reliably enforce.

**Signal 2 - High volume of similar queries:**
You are making thousands of API calls per day with similar patterns. Fine-tuning reduces prompt length (and cost) by baking instructions into the weights.

**Signal 3 - You have quality training data:**
You possess 100-5,000 examples of ideal input-output pairs. Without quality data, fine-tuning produces quality garbage.

**Signal 4 - Latency matters:**
Your application requires fast responses. A fine-tuned model with a short prompt is faster than a base model with a long system prompt, few-shot examples, and RAG context.

**Signal 5 - Prompting has plateaued:**
You have spent significant time optimizing prompts and the output quality has stopped improving. The model understands what you want but cannot consistently deliver it.

```
Scoring:
5/5 signals: Fine-tune immediately
3-4 signals: Fine-tune, strong ROI expected
2 signals:   Consider fine-tuning, measure ROI carefully
0-1 signals: Do not fine-tune. Improve prompting or use RAG.
```
</div>

<div class="lesson-section">
<h2>Real-World Fine-Tuning Use Cases</h2>

**Use Case 1 - Customer support classification:**
```
Problem: Classify support tickets into 47 categories
Prompting accuracy: 82%
Fine-tuned accuracy: 96%
Training data: 3,200 labeled tickets
Cost: $45 in compute
ROI: 14% accuracy gain → 30% fewer mis-routed tickets
```

**Use Case 2 - Code generation in proprietary framework:**
```
Problem: Generate code using internal API patterns
Prompting accuracy: 60% (model does not know internal APIs)
RAG + prompting: 78% (retrieves API docs)
Fine-tuned + RAG: 93%
Training data: 1,800 code examples from internal codebase
Cost: $120 in compute
```

**Use Case 3 - Brand voice consistency:**
```
Problem: Marketing copy must match exact brand voice
Prompting: Close but inconsistent across 1000s of outputs
Fine-tuned: Nails the voice on first generation, every time
Training data: 500 approved marketing pieces
Cost: $30 in compute
```

**Use Case 4 - Where fine-tuning FAILED:**
```
Problem: Make a 7B model answer medical questions accurately
Approach: Fine-tuned on 10,000 medical QA pairs
Result: Model confidently generated plausible but wrong answers
Lesson: Fine-tuning does not improve reasoning ceiling.
        The base model was too small for the task complexity.
Fix: Used a larger base model (70B) with RAG instead.
```

<div class="demo-container">
<h4>Exercise: Evaluate Your Use Case</h4>
Pick a real problem you are working on. Score it against the five fine-tuning signals. If you score 3+, outline your training data strategy: what examples you would collect, how many, and what the ideal input-output format looks like. If you score under 3, identify which approach (prompting or RAG) would solve your problem instead.
</div>
</div>

<div class="lesson-section">
<h2>What This Course Covers</h2>

This course takes you from decision through deployment:

- **Lesson 2**: Data preparation and curation (the most important step)
- **Lessons 3-4**: LoRA and QLoRA -- efficient fine-tuning that runs on consumer hardware
- **Lesson 5**: Training infrastructure and compute planning
- **Lessons 6-7**: Evaluation, RLHF, and DPO alignment
- **Lessons 8-10**: Deployment, continuous training, and production patterns

By the end, you will have fine-tuned a model on your own data, evaluated it rigorously, deployed it to production, and set up a continuous improvement pipeline.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What does fine-tuning primarily change about a model?", "options": ["Its core world knowledge and factual accuracy", "Its context window size and processing speed", "Its output behavior: style, format, task-specific reasoning, and tone", "Its fundamental architecture and parameter count"], "correct": 2, "explanation": "The correct answer is: Its output behavior: style, format, task-specific reasoning, and tone"}, {"q": "According to the decision tree, what should you try FIRST when a model does not produce desired output?", "options": ["Fine-tune on 500 examples", "Better prompting: few-shot examples, system prompts, chain-of-thought", "Train a model from scratch on your data", "Switch to a completely different model provider"], "correct": 1, "explanation": "The correct answer is: Better prompting: few-shot examples, system prompts, chain-of-thought"}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What is the most common fine-tuning mistake?", "back": "Trying to teach a model new factual knowledge. Fine-tuning adjusts behavior (style, format, tone), not knowledge. Use RAG for knowledge injection."}, {"front": "What are the five signals that fine-tuning is the right approach?", "back": "1. Consistent output format required, 2. High volume of similar queries, 3. Quality training data available (100-5,000 examples), 4. Latency matters, 5. Prompting has plateaued"}, {"front": "What percentage of use cases are solved by better prompting and RAG alone?", "back": "Approximately 80%. Fine-tuning is for the remaining 20% where specific output behavior at scale, reduced latency, or lower per-query cost is needed."}, {"front": "Why did fine-tuning fail for the medical QA use case?", "back": "The 7B base model was too small for the task complexity. Fine-tuning cannot improve a model&#39;s reasoning ceiling. The fix was using a larger base model (70B) with RAG."}, {"front": "How does fine-tuning reduce per-query cost?", "back": "By baking instructions into the weights, fine-tuning eliminates long system prompts and few-shot examples, reducing token count per request and thus API cost."}]}'></div>

</div>