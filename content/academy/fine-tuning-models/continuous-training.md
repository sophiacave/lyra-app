---
title: "Continuous Training & Data Flywheels"
course: "fine-tuning-models"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Continuous Training & <span class="accent">Data Flywheels.</span></h1>
  <p class="sub">Build a system where your model gets better every week automatically.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to capture production data and feed it back into training</li>
    <li>The data flywheel architecture: collect, filter, retrain, deploy</li>
    <li>Version control for models, datasets, and experiments</li>
    <li>When to retrain vs when to update the training data</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Data Flywheel</h2>

A data flywheel is a self-reinforcing cycle: your model serves users, users generate data, that data improves the model, which serves users better, generating more data.

```
                    ┌──────────────┐
                    │   Deploy     │
                    │   Model v3   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Serve      │
                    │   Users      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Collect    │
                    │   Feedback   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Filter &   │
                    │   Curate     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Retrain    │
                    │   → Model v4 │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Evaluate   │
                    │   & Gate     │
                    └──────┬───────┘
                           │
                    └──────► Deploy v4 (if passes gate)
```

The flywheel compounds: each cycle adds data, which improves the model, which attracts more users, which generates more data. This is the moat. Competitors can copy your architecture but not your accumulated data flywheel.

<div class="tip-box">
The flywheel only works if your data collection is automatic. Every manual step is friction that slows the cycle. Invest heavily in automated logging, filtering, and quality scoring. The goal is: user interaction -> training example with zero human intervention.
</div>
</div>

<div class="lesson-section">
<h2>Production Data Collection</h2>

Capture everything your model produces in production, then filter for training signal:

```python
import json
import datetime
from pathlib import Path

class ProductionLogger:
    """Log every model interaction for the data flywheel."""

    def __init__(self, log_dir="./production_logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)

    def log_interaction(self, request, response, metadata=None):
        entry = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "request": {
                "messages": request["messages"],
                "model": request.get("model"),
            },
            "response": {
                "content": response["content"],
                "tokens_used": response.get("usage", {}),
                "latency_ms": response.get("latency_ms"),
            },
            "metadata": metadata or {},
            "feedback": None,  # Filled later by feedback endpoint
        }

        date_str = datetime.date.today().isoformat()
        log_file = self.log_dir / f"interactions_{date_str}.jsonl"
        with open(log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

    def log_feedback(self, interaction_id, feedback_type, feedback_value):
        """Record user feedback: thumbs_up, thumbs_down, correction, etc."""
        entry = {
            "interaction_id": interaction_id,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "feedback_type": feedback_type,
            "feedback_value": feedback_value,
        }
        log_file = self.log_dir / f"feedback_{datetime.date.today()}.jsonl"
        with open(log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")
```

**What to capture:**
```
Always log:
  - Full input messages (system + user)
  - Full model output
  - Timestamp
  - Latency
  - Token counts
  - Model version

Log when available:
  - User feedback (thumbs up/down, ratings, corrections)
  - Downstream success signal (did the user's task succeed?)
  - Session context (what happened before/after this interaction)
  - User segment (enterprise, free tier, etc.)
```

**Privacy considerations:**
```
- Strip PII before logging (names, emails, phone numbers)
- Hash user IDs (allow correlation without identification)
- Comply with your privacy policy and data retention rules
- Store logs encrypted at rest
- Separate PII-stripped training data from raw production logs
```
</div>

<div class="lesson-section">
<h2>Automated Data Curation Pipeline</h2>

Raw production logs contain noise. An automated curation pipeline extracts training-quality examples:

```python
def curate_training_data(log_dir, output_path, quality_threshold=0.7):
    """Extract high-quality training examples from production logs."""

    # Step 1: Load interactions with positive feedback
    interactions = load_interactions_with_feedback(log_dir)

    candidates = []
    for interaction in interactions:
        # Step 2: Apply quality filters
        if not passes_format_validation(interaction):
            continue

        if interaction.get("feedback") == "thumbs_down":
            continue  # Skip negative feedback

        if interaction["response"]["tokens_used"].get("total", 0) < 10:
            continue  # Skip trivially short responses

        # Step 3: Score quality
        score = quality_score(interaction)
        if score < quality_threshold:
            continue

        # Step 4: Format as training example
        example = {
            "messages": [
                *interaction["request"]["messages"],
                {"role": "assistant",
                 "content": interaction["response"]["content"]}
            ]
        }
        candidates.append((score, example))

    # Step 5: Deduplicate
    candidates = deduplicate([ex for _, ex in candidates])

    # Step 6: Balance classes/categories if needed
    candidates = balance_categories(candidates)

    # Step 7: Write curated dataset
    with open(output_path, "w") as f:
        for example in candidates:
            f.write(json.dumps(example) + "\n")

    print(f"Curated {len(candidates)} examples from "
          f"{len(interactions)} interactions")
    return candidates
```

**Negative feedback as preference data:**
When users give thumbs-down, the failed response becomes a "rejected" example for DPO:

```python
def extract_preference_data(log_dir):
    """Convert positive/negative feedback into DPO training pairs."""
    pairs = []

    for interaction in load_interactions_with_feedback(log_dir):
        if interaction["feedback"] == "thumbs_down":
            # The rejected response is the model's output
            rejected = interaction["response"]["content"]

            # Generate a better response with the latest model
            chosen = generate_improved_response(
                interaction["request"]["messages"]
            )

            pairs.append({
                "prompt": interaction["request"]["messages"][-1]["content"],
                "chosen": chosen,
                "rejected": rejected,
            })

    return pairs
```
</div>

<div class="lesson-section">
<h2>Retraining Strategy</h2>

When and how to retrain:

**Retraining triggers:**
```
1. Scheduled: Weekly or bi-weekly retrain cycle
   (most common for production systems)

2. Data-driven: Retrain when N new high-quality examples
   accumulate (e.g., every 500 new examples)

3. Performance-driven: Retrain when monitored metrics
   drop below threshold (accuracy, user satisfaction)

4. Distribution shift: Retrain when incoming queries
   differ significantly from training distribution
```

**Incremental vs full retrain:**
```
Incremental (continue training from last checkpoint):
  + Faster (only trains on new data)
  + Cheaper
  - Risk of forgetting older patterns
  - Risk of overfitting to recent data

Full retrain (from base model with complete dataset):
  + Consistent quality
  + No incremental drift
  - More expensive
  - Longer training time

Recommendation: Full retrain every 4-6 weeks.
Incremental retrain weekly for fast iteration.
```

**Version control with DVC:**
```bash
# Track datasets and model artifacts
pip install dvc

dvc init
dvc add training_data/v3/
dvc add models/v3/

# Tag with experiment metadata
git tag -a "model-v3" -m "
dataset: v3 (2,847 examples)
base: llama-3.1-8b
method: qlora r=16 + dpo
eval: accuracy=94.2%, win_rate=73%
"
git push origin model-v3
```

<div class="callout">
<strong>The golden rule of retraining:</strong> Never deploy a retrained model without running the full evaluation pipeline from Lesson 6. Every model version must pass the quality gate before reaching production. Automated retraining without automated evaluation is a deployment risk.
</callout>
</div>
</div>

<div class="lesson-section">
<h2>Experiment Tracking</h2>

Track every training run systematically:

```python
import wandb

wandb.init(project="my-finetuned-model", config={
    "base_model": "llama-3.1-8b",
    "method": "qlora",
    "rank": 16,
    "alpha": 32,
    "dataset_version": "v3",
    "dataset_size": 2847,
    "epochs": 3,
    "learning_rate": 2e-4,
    "batch_size": 4,
})

# Log metrics during training
wandb.log({"train_loss": loss, "val_loss": val_loss, "epoch": epoch})

# Log final evaluation results
wandb.log({
    "eval/accuracy": 0.942,
    "eval/win_rate": 0.73,
    "eval/forgetting_gap": 0.02,
    "eval/judge_score": 4.1,
})
```

Alternatives to Weights & Biases: MLflow (open source, self-hosted), Neptune, CometML. The tool matters less than the habit of tracking every run.

<div class="demo-container">
<h4>Exercise: Build a Data Flywheel</h4>
Set up the ProductionLogger for your deployed model. Run 50 test interactions simulating real usage. Add feedback (thumbs up/down) to 30 of them. Run the curation pipeline to extract training examples. How many examples pass quality filtering? If you have enough, run an incremental retrain and compare v1 vs v2 on your test set.
</div>
</div>

<QuizMC>
<Question text="What is the key principle that makes a data flywheel work?">
<Option text="Hiring more human annotators over time" />
<Option correct text="Automatic data collection from production use, with zero-human-intervention conversion to training examples" />
<Option text="Using larger base models for each retraining cycle" />
<Option text="Increasing the training compute budget each iteration" />
</Question>
<Question text="What is the recommended retraining strategy for production systems?">
<Option text="Retrain daily with whatever data is available" />
<Option text="Only retrain when users explicitly complain" />
<Option correct text="Incremental retrain weekly for fast iteration, full retrain every 4-6 weeks for consistency" />
<Option text="Never retrain -- deploy once and maintain" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the four retraining triggers?" back="1. Scheduled (weekly/bi-weekly), 2. Data-driven (every N new examples), 3. Performance-driven (metrics drop below threshold), 4. Distribution shift (incoming queries differ from training data)" />
<Card front="How do you convert negative user feedback into training data?" back="The thumbs-down response becomes the 'rejected' example for DPO. Generate an improved response with the latest model as the 'chosen' example. This creates preference pairs from production feedback." />
<Card front="What is the golden rule of retraining?" back="Never deploy a retrained model without running the full evaluation pipeline. Every model version must pass the quality gate before reaching production. Automated retraining without automated evaluation is a deployment risk." />
<Card front="What privacy measures are required for production data logging?" back="Strip PII (names, emails, phones), hash user IDs, comply with privacy policy, encrypt logs at rest, and separate PII-stripped training data from raw production logs." />
</FlashDeck>

</div>