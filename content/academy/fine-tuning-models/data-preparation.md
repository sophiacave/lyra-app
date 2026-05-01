---
title: "Data Preparation & Curation"
course: "fine-tuning-models"
order: 2
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Data Preparation <span class="accent">& Curation.</span></h1>
  <p class="sub">Your model is only as good as your data. This is where quality is won or lost.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to format training data for instruction fine-tuning (chat and completion formats)</li>
    <li>Quality filtering techniques that eliminate noisy examples</li>
    <li>How to synthetically generate training data using stronger models</li>
    <li>Dataset sizing: how many examples you actually need</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Data Formats</h2>

Fine-tuning data must be formatted to match how the model will be used in production. Two primary formats dominate:

**Chat format (instruction tuning):**
The standard for conversational models. Each example is a conversation with system, user, and assistant messages.

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a legal document classifier. Respond with only the category name."
    },
    {
      "role": "user",
      "content": "Classify this document: 'The tenant agrees to pay monthly rent of $2,400 on the first of each month...'"
    },
    {
      "role": "assistant",
      "content": "Residential Lease Agreement"
    }
  ]
}
```

**Completion format (text generation):**
For models that generate continuations rather than chat responses.

```json
{
  "prompt": "Summarize the following legal clause in plain English:\n\n'Notwithstanding the foregoing, the indemnifying party shall...'",
  "completion": "Despite what was said earlier, the party responsible for covering losses will..."
}
```

**Multi-turn chat format (for conversational fine-tuning):**
```json
{
  "messages": [
    {"role": "system", "content": "You are a technical support agent for CloudDB."},
    {"role": "user", "content": "My database is returning timeout errors."},
    {"role": "assistant", "content": "I can help with timeout errors. What is your database instance size and current connection count?"},
    {"role": "user", "content": "It is a db.t3.medium with about 200 connections."},
    {"role": "assistant", "content": "A db.t3.medium supports approximately 150 connections. You are exceeding the connection limit. I recommend either upgrading to db.t3.large (supports 300 connections) or implementing connection pooling with PgBouncer to reduce active connections."}
  ]
}
```

<div class="tip-box">
Match your training format exactly to your inference format. If you will use a system prompt in production, include system prompts in training. If you will not use multi-turn conversations, do not train on multi-turn data. Format mismatch is a top-3 cause of poor fine-tuning results.
</div>
</div>

<div class="lesson-section">
<h2>Quality Filtering Pipeline</h2>

Raw data is noisy. A single bad example can teach the model an unwanted pattern that takes 10 good examples to override. Filter aggressively.

**Level 1 - Format validation:**
```python
import json

def validate_example(example):
    """Reject malformed examples."""
    errors = []

    # Must have messages array
    if "messages" not in example:
        errors.append("Missing 'messages' key")
        return errors

    messages = example["messages"]

    # Must have at least user + assistant
    roles = [m["role"] for m in messages]
    if "user" not in roles:
        errors.append("Missing user message")
    if "assistant" not in roles:
        errors.append("Missing assistant message")

    # No empty content
    for m in messages:
        if not m.get("content", "").strip():
            errors.append(f"Empty content in {m['role']} message")

    # Assistant response length check
    assistant_msgs = [m for m in messages if m["role"] == "assistant"]
    for m in assistant_msgs:
        if len(m["content"]) < 10:
            errors.append("Assistant response suspiciously short")
        if len(m["content"]) > 4000:
            errors.append("Assistant response suspiciously long")

    return errors
```

**Level 2 - Content quality scoring:**
```python
def quality_score(example):
    """Score 0-1 based on content quality signals."""
    assistant_msg = [m for m in example["messages"]
                     if m["role"] == "assistant"][0]["content"]

    score = 1.0

    # Penalize repetitive content
    words = assistant_msg.split()
    unique_ratio = len(set(words)) / max(len(words), 1)
    if unique_ratio < 0.4:
        score -= 0.3

    # Penalize very short responses
    if len(words) < 5:
        score -= 0.2

    # Penalize responses that look like errors
    error_patterns = ["I cannot", "I'm sorry", "As an AI",
                      "I don't have", "ERROR", "undefined"]
    for pattern in error_patterns:
        if pattern.lower() in assistant_msg.lower():
            score -= 0.4

    return max(score, 0)

# Filter: keep examples with score > 0.7
dataset = [ex for ex in dataset if quality_score(ex) > 0.7]
```

**Level 3 - Deduplication:**
```python
from datasketch import MinHash, MinHashLSH

def deduplicate(dataset, threshold=0.8):
    """Remove near-duplicate examples using MinHash LSH."""
    lsh = MinHashLSH(threshold=threshold, num_perm=128)
    unique = []

    for i, ex in enumerate(dataset):
        text = str(ex["messages"])
        m = MinHash(num_perm=128)
        for word in text.split():
            m.update(word.encode('utf8'))

        if not lsh.query(m):
            lsh.insert(str(i), m)
            unique.append(ex)

    print(f"Deduplicated: {len(dataset)} -> {len(unique)}")
    return unique
```

<div class="callout">
<strong>The quality hierarchy:</strong> 100 perfect examples beat 1,000 mediocre examples. Always prioritize quality over quantity. If you must choose between more data and better data, choose better data every time.
</div>
</div>

<div class="lesson-section">
<h2>Synthetic Data Generation</h2>

When you lack real training data, use a stronger model to generate synthetic examples. This is the dominant strategy for bootstrapping fine-tuning datasets.

**The teacher-student pattern:**
```python
import anthropic

client = anthropic.Anthropic()

def generate_training_example(task_description, seed_input):
    """Use Claude to generate a training example."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Generate a training example for this task:
Task: {task_description}

Input: {seed_input}

Respond with a JSON object containing:
- "user_message": the user's query
- "assistant_message": the ideal response

The response should be concise, accurate, and match the
exact format a fine-tuned model should produce.
Only output the JSON, nothing else."""
        }]
    )
    return json.loads(response.content[0].text)

# Generate 500 examples from 50 seed inputs
seed_inputs = load_seed_inputs()  # Your real data seeds
dataset = []

for seed in seed_inputs:
    for variation in range(10):  # 10 variations per seed
        example = generate_training_example(
            "Classify customer support tickets into categories",
            f"{seed} (variation {variation}: rephrase differently)"
        )
        dataset.append(format_as_chat(example))
```

**Quality control for synthetic data:**
1. Generate 2x more examples than you need
2. Score each with the quality pipeline above
3. Manually review a random 10% sample
4. Remove any examples that feel "off" -- trust your domain expertise
5. Final dataset should be 500-2,000 high-quality examples
</div>

<div class="lesson-section">
<h2>Dataset Sizing Guide</h2>

How much data do you need? It depends on the complexity of behavior change:

```
TASK TYPE                    MINIMUM EXAMPLES    RECOMMENDED
Simple classification        50-100              200-500
Format/style change          100-300             500-1,000
Complex task (multi-step)    500-1,000           2,000-5,000
Domain-specific behavior     1,000-2,000         5,000-10,000
Full persona/assistant       2,000-5,000         10,000+
```

**Diminishing returns curve:**
```
Examples  │ Quality
    50    │ ████░░░░░░ (baseline improvement)
   200    │ ██████░░░░ (significant jump)
   500    │ ████████░░ (strong performance)
 1,000    │ █████████░ (diminishing returns begin)
 5,000    │ ██████████ (marginal gains from here)
10,000+   │ ██████████ (usually not worth the cost)
```

**Dataset split:**
```
Training set:   80-90% of data
Validation set: 10-15% of data (monitor for overfitting)
Test set:       5-10% held completely out (final evaluation)

CRITICAL: Never include test set examples in training.
Contamination produces artificially inflated metrics.
```

<div class="demo-container">
<h4>Exercise: Build a Training Dataset</h4>
Choose a specific task (classification, format conversion, or style matching). Create 20 examples manually -- these are your gold-standard seed data. Use the synthetic generation pipeline to expand to 200 examples. Run the quality filtering pipeline. Check your deduplication rate and average quality score. Split into train (160) / validation (20) / test (20).
</div>
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the most important data quality principle for fine-tuning?", "options": ["Collect as much data as possible regardless of quality", "Use only real data, never synthetic data", "100 perfect examples beat 1,000 mediocre examples -- always prioritize quality over quantity", "All examples should be the exact same length"], "correct": 2, "explanation": "The correct answer is: 100 perfect examples beat 1,000 mediocre examples -- always prioritize quality over quantity"}, {"q": "What is the teacher-student pattern in synthetic data generation?", "options": ["A student model teaches a teacher model new patterns", "A stronger model (teacher) generates training examples for a smaller model (student) to learn from", "Two models of equal size trade training data", "A model is fine-tuned on its own previous outputs"], "correct": 1, "explanation": "The correct answer is: A stronger model (teacher) generates training examples for a smaller model (student) to learn from"}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the two primary training data formats for fine-tuning?", "back": "1. Chat format (messages array with system/user/assistant roles) for instruction tuning, 2. Completion format (prompt/completion pairs) for text generation"}, {"front": "What are the three levels of quality filtering?", "back": "Level 1: Format validation (structure, required fields, length). Level 2: Content quality scoring (repetition, errors, refusals). Level 3: Deduplication (MinHash LSH to remove near-duplicates)."}, {"front": "How many training examples do you need for a simple classification task?", "back": "Minimum 50-100, recommended 200-500. Diminishing returns begin around 1,000 examples for most classification tasks."}, {"front": "What is the recommended dataset split ratio?", "back": "Training: 80-90%. Validation: 10-15% (monitor overfitting). Test: 5-10% (held completely out for final evaluation). Never contaminate test data."}, {"front": "Why must training format match inference format exactly?", "back": "Format mismatch is a top-3 cause of poor fine-tuning results. If you use system prompts in production, include them in training. If you do not use multi-turn, do not train on multi-turn data."}]}'></div>

</div>