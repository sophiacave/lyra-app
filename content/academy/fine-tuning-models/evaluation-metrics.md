---
title: "Evaluation Metrics & Benchmarks"
course: "fine-tuning-models"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Evaluation Metrics <span class="accent">& Benchmarks.</span></h1>
  <p class="sub">If you cannot measure it, you cannot improve it. Rigorous evaluation separates production models from experiments.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Which metrics to use for different fine-tuning tasks (classification, generation, chat)</li>
    <li>How to detect overfitting and catastrophic forgetting</li>
    <li>LLM-as-judge evaluation for open-ended generation</li>
    <li>Building automated evaluation pipelines that run after every training job</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Metrics by Task Type</h2>

Different tasks require different evaluation metrics. Using the wrong metric gives you false confidence.

**Classification tasks:**
```
Accuracy:     Correct predictions / total predictions
              Use when classes are balanced.

F1 Score:     Harmonic mean of precision and recall
              Use when classes are imbalanced.

Confusion Matrix: Shows exactly where the model confuses classes.
              Always inspect this, even when accuracy is high.

Per-class metrics: Calculate precision/recall per class.
              A model with 95% overall accuracy might have
              0% recall on your most important class.
```

```python
from sklearn.metrics import classification_report, confusion_matrix

# After generating predictions on test set
y_true = ["lease", "nda", "lease", "employment", "nda"]
y_pred = ["lease", "nda", "employment", "employment", "nda"]

print(classification_report(y_true, y_pred))
print(confusion_matrix(y_true, y_pred, labels=["lease", "nda", "employment"]))
```

**Text generation tasks:**
```
Perplexity:   How "surprised" the model is by the test data.
              Lower = better. Good for comparing models on
              the same test set. Not meaningful in isolation.

BLEU/ROUGE:   N-gram overlap with reference outputs.
              Useful for translation and summarization.
              Poor for creative or open-ended generation.

Exact Match:  Does the output exactly match the expected output?
              Good for structured outputs (JSON, code, SQL).

Custom metrics: Task-specific checks.
  - JSON validity rate (for structured output tasks)
  - Code execution pass rate (for code generation)
  - Regex match rate (for format compliance)
```

**Open-ended generation (chat, creative writing):**
```
LLM-as-Judge: Use a stronger model (Claude, GPT-4) to rate
              outputs on specified criteria. The most reliable
              automated evaluation for subjective quality.

Human evaluation: Gold standard but expensive and slow.
              Use for final validation, not iterative development.

Win rate:     Compare fine-tuned vs base model outputs side-by-side.
              What percentage does the fine-tuned model win?
```

<div class="tip-box">
Never use a single metric. Every fine-tuned model should be evaluated on at least three metrics: one automated task-specific metric, one general quality metric (perplexity or LLM-as-judge), and one overfitting detector (train vs validation loss gap).
</div>
</div>

<div class="lesson-section">
<h2>Detecting Overfitting and Catastrophic Forgetting</h2>

Two failure modes destroy fine-tuned models:

**Overfitting:** The model memorizes training data instead of learning patterns. It performs perfectly on training examples but poorly on new inputs.

```
Detection signals:
  - Training loss continues decreasing while validation loss increases
  - Perfect accuracy on train set, poor accuracy on test set
  - Model outputs are verbatim copies of training examples
  - Model fails on inputs that are slightly different from training data

Prevention:
  - Use validation set and monitor val_loss every epoch
  - Stop training when val_loss stops decreasing (early stopping)
  - Keep LoRA rank low (r=8-16)
  - Use dropout (lora_dropout=0.05-0.1)
  - Reduce number of epochs (often 1-3 is sufficient)
```

**Catastrophic forgetting:** The model loses general capabilities it had before fine-tuning. It gets better at your task but worse at everything else.

```
Detection signals:
  - General knowledge questions that the base model answers
    correctly now produce wrong answers
  - The model's writing style becomes robotic or repetitive
  - It can only handle patterns seen in training data

Detection benchmark:
  Run a general capability test before and after fine-tuning.
  Use standard benchmarks (MMLU, HellaSwag) or a custom set
  of 50 general questions.

Prevention:
  - Use LoRA (freezes base model, inherently resistant)
  - Keep learning rate low (1e-4 to 2e-4 for LoRA)
  - Mix in 5-10% general-purpose data with your task data
  - Train for fewer epochs (1-2 for large datasets)
```

```python
def check_forgetting(base_model, finetuned_model, general_questions):
    """Compare general capability before and after fine-tuning."""
    results = []
    for q in general_questions:
        base_answer = generate(base_model, q)
        ft_answer = generate(finetuned_model, q)
        results.append({
            "question": q,
            "base_correct": evaluate(base_answer, q),
            "ft_correct": evaluate(ft_answer, q),
        })

    base_score = sum(r["base_correct"] for r in results) / len(results)
    ft_score = sum(r["ft_correct"] for r in results) / len(results)

    print(f"Base model general score: {base_score:.2%}")
    print(f"Fine-tuned general score: {ft_score:.2%}")
    print(f"Forgetting gap: {base_score - ft_score:.2%}")

    if base_score - ft_score > 0.05:
        print("WARNING: Significant catastrophic forgetting detected")
```
</div>

<div class="lesson-section">
<h2>LLM-as-Judge Evaluation</h2>

For open-ended generation, use a stronger model to evaluate your fine-tuned model's outputs:

```python
import anthropic

client = anthropic.Anthropic()

def llm_judge(prompt, response, criteria):
    """Use Claude to evaluate a model response."""
    judgment = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""Evaluate this AI model response on a scale of 1-5
for each criterion.

USER PROMPT: {prompt}

MODEL RESPONSE: {response}

CRITERIA:
{criteria}

Respond with a JSON object:
{{
  "scores": {{"criterion_name": score, ...}},
  "overall": weighted_average_score,
  "reasoning": "brief explanation"
}}"""
        }]
    )
    return json.loads(judgment.content[0].text)

# Define task-specific criteria
criteria = """
1. Accuracy: Is the information factually correct? (weight: 0.3)
2. Format: Does the output follow the required format? (weight: 0.3)
3. Completeness: Does it address all parts of the query? (weight: 0.2)
4. Conciseness: Is it appropriately concise without omissions? (weight: 0.2)
"""

# Evaluate test set
scores = []
for example in test_set:
    response = generate(finetuned_model, example["prompt"])
    score = llm_judge(example["prompt"], response, criteria)
    scores.append(score)

avg_score = sum(s["overall"] for s in scores) / len(scores)
print(f"Average LLM-judge score: {avg_score:.2f} / 5.0")
```

**Win-rate comparison:**
```python
def win_rate(base_model, finetuned_model, test_prompts):
    """Compare base vs fine-tuned outputs head-to-head."""
    wins, losses, ties = 0, 0, 0

    for prompt in test_prompts:
        base_out = generate(base_model, prompt)
        ft_out = generate(finetuned_model, prompt)

        # Randomize order to prevent position bias
        if random.random() > 0.5:
            a, b = base_out, ft_out
            a_is_ft = False
        else:
            a, b = ft_out, base_out
            a_is_ft = True

        judgment = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=100,
            messages=[{"role": "user", "content": f"""
Which response is better for this prompt?
Prompt: {prompt}
Response A: {a}
Response B: {b}
Answer only: A, B, or TIE"""}]
        )
        winner = judgment.content[0].text.strip()

        if (winner == "A" and a_is_ft) or (winner == "B" and not a_is_ft):
            wins += 1
        elif winner == "TIE":
            ties += 1
        else:
            losses += 1

    print(f"Win rate: {wins}/{len(test_prompts)} ({wins/len(test_prompts):.0%})")
    return wins / len(test_prompts)
```

<div class="callout">
<strong>Position bias warning:</strong> LLM judges tend to prefer the first response shown. Always randomize the order of responses A and B, and average across both orderings for reliable results.
</div>
</div>

<div class="lesson-section">
<h2>Automated Evaluation Pipeline</h2>

Build a pipeline that runs automatically after every training job:

```python
def evaluate_model(model_path, test_data, base_model_path):
    """Complete evaluation pipeline."""
    results = {}

    # 1. Task-specific metrics
    predictions = [generate(model_path, ex["prompt"]) for ex in test_data]
    results["task_accuracy"] = compute_task_metrics(predictions, test_data)

    # 2. LLM-as-judge quality score
    results["judge_score"] = compute_judge_scores(predictions, test_data)

    # 3. Overfitting check
    results["train_val_gap"] = read_training_logs(model_path)

    # 4. Catastrophic forgetting check
    results["forgetting_gap"] = check_forgetting(
        base_model_path, model_path, GENERAL_QUESTIONS
    )

    # 5. Format compliance
    results["format_valid"] = sum(
        validate_format(p) for p in predictions
    ) / len(predictions)

    # 6. Win rate vs base model
    results["win_rate"] = win_rate(base_model_path, model_path, test_data)

    # Quality gate
    passed = (
        results["task_accuracy"] > 0.90 and
        results["judge_score"] > 3.5 and
        results["forgetting_gap"] < 0.05 and
        results["format_valid"] > 0.95 and
        results["win_rate"] > 0.60
    )

    results["passed"] = passed
    return results
```

<div class="demo-container">
<h4>Exercise: Evaluate Your Fine-Tuned Model</h4>
Take the model from Lesson 3 or 4. Run it on your held-out test set. Calculate: task-specific accuracy, LLM-as-judge score (on 20 examples), win rate vs base model (on 10 examples), and forgetting gap (on 10 general questions). Does your model pass the quality gate?
</div>
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the most reliable automated evaluation method for open-ended text generation?", "options": ["BLEU score comparison with reference outputs", "Perplexity measurement on the test set", "LLM-as-judge: using a stronger model to rate outputs on specified criteria", "Word count comparison with expected output length"], "correct": 2, "explanation": "The correct answer is: LLM-as-judge: using a stronger model to rate outputs on specified criteria"}, {"q": "What indicates catastrophic forgetting is occurring?", "options": ["The model&#39;s training loss stops decreasing", "Validation loss is lower than training loss", "The model loses general capabilities it had before fine-tuning while improving on the specific task", "The model generates longer outputs than expected"], "correct": 2, "explanation": "The correct answer is: The model loses general capabilities it had before fine-tuning while improving on the specific task"}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What three metrics should every fine-tuned model be evaluated on?", "back": "1. Automated task-specific metric (accuracy, F1, exact match), 2. General quality metric (perplexity or LLM-as-judge), 3. Overfitting detector (train vs validation loss gap)"}, {"front": "How do you prevent catastrophic forgetting?", "back": "Use LoRA (freezes base model), keep learning rate low (1e-4 to 2e-4), mix in 5-10% general-purpose data, and train for fewer epochs (1-2 for large datasets)."}, {"front": "What is position bias in LLM-as-judge evaluation?", "back": "LLM judges tend to prefer the first response shown. Fix by randomizing response order and averaging across both orderings."}, {"front": "What are the quality gate thresholds for a production model?", "back": "Task accuracy >90%, judge score >3.5/5, forgetting gap <5%, format compliance >95%, win rate vs base >60%."}]}'></div>

</div>