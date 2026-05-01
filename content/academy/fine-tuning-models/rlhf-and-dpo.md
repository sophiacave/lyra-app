---
title: "RLHF & DPO: Alignment Techniques"
course: "fine-tuning-models"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>RLHF & DPO: <span class="accent">Alignment Techniques.</span></h1>
  <p class="sub">Teaching models not just what to say, but what humans prefer.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How RLHF works: reward models, PPO, and the full training pipeline</li>
    <li>DPO: Direct Preference Optimization as a simpler alternative to RLHF</li>
    <li>How to collect and format preference data</li>
    <li>When to use alignment techniques vs standard supervised fine-tuning</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Alignment Problem</h2>

Supervised fine-tuning (SFT) teaches a model what correct outputs look like. But many tasks do not have a single correct answer -- they have better and worse answers along subjective dimensions: helpfulness, safety, tone, completeness.

Alignment techniques teach models to prefer better outputs over worse ones, based on human judgment.

```
SFT training data:
  Input: "Explain quantum computing"
  Output: [one correct answer]

Preference training data:
  Input: "Explain quantum computing"
  Chosen: [clear, accurate, well-structured explanation]
  Rejected: [technically correct but confusing, overly verbose]
```

The model learns not just to generate plausible outputs, but to generate outputs that humans would prefer. This is the difference between a model that can answer and a model that answers well.

Two dominant approaches exist: RLHF (the original technique used by OpenAI for ChatGPT) and DPO (a simpler alternative that achieves similar results without reinforcement learning).

<div class="tip-box">
Alignment training happens AFTER supervised fine-tuning. The typical pipeline is: Pre-training -> SFT (teach the task) -> Alignment (refine preferences). Skipping SFT and going straight to alignment produces poor results because the model needs basic task competence before it can learn preferences.
</div>
</div>

<div class="lesson-section">
<h2>RLHF: The Full Pipeline</h2>

Reinforcement Learning from Human Feedback is a three-stage process:

**Stage 1 - Supervised Fine-Tuning (SFT):**
Standard fine-tuning on high-quality examples (covered in Lessons 2-5). This produces a model that can perform the task.

**Stage 2 - Reward Model Training:**
Train a separate model to predict human preferences. This model takes a prompt + response and outputs a scalar score.

```
Training data format:
  Prompt: "Write a product description for wireless earbuds"
  Response A: [detailed, engaging, accurate] → Score: 4.5
  Response B: [brief, bland, has errors] → Score: 2.1

The reward model learns to assign higher scores to
responses that humans would prefer.
```

**Stage 3 - RL Optimization (PPO):**
Use the reward model as the objective function. Generate responses from the SFT model, score them with the reward model, and update the SFT model to maximize the reward score using Proximal Policy Optimization.

```
PPO training loop:
  1. Sample prompt from dataset
  2. Generate response from current policy (SFT model)
  3. Score response with reward model
  4. Compute KL divergence penalty (prevent drift from SFT model)
  5. Update policy using PPO to maximize: reward - beta * KL
  6. Repeat
```

**RLHF complexity breakdown:**
```
Components needed:
  - SFT model (your fine-tuned model)
  - Reward model (separate model, often same size as SFT)
  - Reference model (frozen copy of SFT, for KL penalty)
  - PPO optimizer

VRAM required: 3-4x a single model (SFT + reward + reference)
Training stability: Fragile. Hyperparameters are sensitive.
Implementation difficulty: High. Many moving parts.
```

<div class="callout">
<strong>The practical reality:</strong> Full RLHF is complex, expensive, and unstable. This is why DPO was invented. Unless you are building a general-purpose assistant at scale, DPO is almost always the better choice.
</div>
</div>

<div class="lesson-section">
<h2>DPO: The Simpler Alternative</h2>

Direct Preference Optimization (Rafailov et al., 2023) achieves RLHF-quality alignment without a reward model or reinforcement learning. It directly optimizes the policy model on preference pairs.

**The DPO insight:** The reward model in RLHF can be expressed analytically as a function of the policy model itself. Instead of training a separate reward model and then optimizing against it, DPO collapses both steps into a single supervised learning objective.

**DPO training data format:**
```json
{
  "prompt": "Explain quantum computing to a 10-year-old",
  "chosen": "Imagine you have a magic coin that can be both heads and tails at the same time. Regular computers use coins that are either heads or tails -- that is a 'bit'. Quantum computers use magic coins called 'qubits' that can be both until you look at them. This lets them try many answers at once instead of one at a time.",
  "rejected": "Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to perform computations. Qubits exist in a superposition of states, enabling parallel processing of information through quantum gates that manipulate probability amplitudes."
}
```

The chosen response is appropriate for a 10-year-old. The rejected response is technically accurate but wrong for the audience. DPO teaches the model to prefer audience-appropriate communication.

**DPO training with TRL:**
```python
from trl import DPOTrainer, DPOConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from datasets import load_dataset
from peft import LoraConfig

# Load SFT model (already fine-tuned)
model = AutoModelForCausalLM.from_pretrained(
    "./sft-model",
    torch_dtype="auto",
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained("./sft-model")

# Reference model (frozen copy for KL penalty)
ref_model = AutoModelForCausalLM.from_pretrained(
    "./sft-model",
    torch_dtype="auto",
    device_map="auto",
)

# LoRA config for DPO (train adapter only)
peft_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    task_type="CAUSAL_LM",
)

# DPO configuration
dpo_config = DPOConfig(
    output_dir="./dpo-output",
    num_train_epochs=1,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=5e-5,
    beta=0.1,                    # KL penalty strength
    max_length=1024,
    max_prompt_length=512,
    logging_steps=10,
    save_strategy="epoch",
    bf16=True,
    report_to="none",
)

# Load preference dataset
dataset = load_dataset("json", data_files="preferences.jsonl")

# Train
trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,
    args=dpo_config,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
    peft_config=peft_config,
)

trainer.train()
```

**Key DPO hyperparameter -- beta:**
```
beta = 0.1:  Standard. Good default for most tasks.
beta = 0.05: Lower penalty. Model deviates more from SFT.
             Use when you want stronger preference learning.
beta = 0.5:  High penalty. Model stays close to SFT behavior.
             Use when SFT is already good and you want subtle refinement.
```
</div>

<div class="lesson-section">
<h2>Collecting Preference Data</h2>

Quality preference data is the foundation of alignment. Three collection methods:

**Method 1 - Human annotation:**
```
1. Generate 2-3 responses per prompt using your SFT model
2. Present pairs to annotators
3. Annotators choose the better response (or rank all)
4. Record chosen/rejected pairs

Cost: $0.10-0.50 per comparison
Scale: 500-2,000 comparisons is typical
Platforms: Scale AI, Surge AI, Amazon MTurk
```

**Method 2 - Synthetic preferences (AI feedback):**
```python
def generate_preference_pair(prompt, sft_model):
    # Generate multiple responses
    responses = [generate(sft_model, prompt) for _ in range(4)]

    # Use a stronger model to rank them
    ranking = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{"role": "user", "content": f"""
Rank these responses to the prompt from best to worst.
Prompt: {prompt}
{chr(10).join(f'Response {i+1}: {r}' for i, r in enumerate(responses))}

Respond with JSON: {{"ranking": [best_index, ..., worst_index]}}"""}]
    )

    ranked = json.loads(ranking.content[0].text)["ranking"]
    return {
        "prompt": prompt,
        "chosen": responses[ranked[0]],
        "rejected": responses[ranked[-1]],
    }
```

**Method 3 - Implicit preferences from production data:**
```
If your model is already in production:
- Chosen = responses where users continued the conversation
- Rejected = responses where users rephrased or abandoned
- Chosen = responses with thumbs-up feedback
- Rejected = responses with thumbs-down feedback
```

<div class="demo-container">
<h4>Exercise: DPO Alignment</h4>
Take your SFT model from Lesson 3. Generate 100 preference pairs using synthetic AI feedback (Method 2). Format as chosen/rejected pairs. Train with DPO using beta=0.1 for 1 epoch. Evaluate: does the win rate vs the SFT model improve? Does the model maintain task accuracy?
</div>
</div>

<div class="lesson-section">
<h2>When to Use Alignment</h2>

```
Use SFT only when:
  - Task has objectively correct answers (classification, extraction)
  - Output format is more important than output quality
  - You have limited data (<200 examples)

Add DPO when:
  - Task quality is subjective (writing, chat, explanations)
  - You need to control tone, style, or helpfulness
  - SFT model produces correct but not preferred outputs
  - You have 500+ preference pairs

Use full RLHF when:
  - Building a general-purpose assistant at scale
  - You have a dedicated ML team and infrastructure
  - Preference patterns are complex and multi-dimensional
  - Budget allows 3-4x compute of SFT training
```
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the key advantage of DPO over RLHF?", "options": ["DPO produces higher quality models than RLHF", "DPO requires no preference data", "DPO eliminates the need for a separate reward model and reinforcement learning, collapsing both into supervised learning", "DPO works without any base model fine-tuning"], "correct": 2, "explanation": "The correct answer is: DPO eliminates the need for a separate reward model and reinforcement learning, collapsing both into supervised learning"}, {"q": "In what order should the training pipeline be executed?", "options": ["Alignment -> SFT -> Pre-training", "Pre-training -> Alignment -> SFT", "Pre-training -> SFT -> Alignment (DPO/RLHF)", "SFT -> Pre-training -> Alignment"], "correct": 2, "explanation": "The correct answer is: Pre-training -> SFT -> Alignment (DPO/RLHF)"}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the three stages of RLHF?", "back": "Stage 1: Supervised Fine-Tuning (SFT). Stage 2: Reward Model Training (predict human preferences). Stage 3: RL Optimization with PPO (maximize reward score with KL penalty)."}, {"front": "What is the DPO beta parameter?", "back": "Beta controls KL penalty strength. 0.1 = standard default. 0.05 = stronger preference learning. 0.5 = model stays close to SFT behavior. Higher beta = more conservative alignment."}, {"front": "What are the three methods for collecting preference data?", "back": "1. Human annotation ($0.10-0.50 per comparison). 2. Synthetic AI feedback (stronger model ranks responses). 3. Implicit production data (user thumbs up/down, conversation continuation)."}, {"front": "When should you use SFT only vs adding DPO?", "back": "SFT only: objectively correct answers, format matters most, <200 examples. Add DPO: subjective quality tasks, tone/style control needed, SFT outputs correct but not preferred, 500+ preference pairs available."}]}'></div>

</div>