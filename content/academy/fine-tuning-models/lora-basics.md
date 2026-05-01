---
title: "LoRA: Efficient Fine-Tuning Explained"
course: "fine-tuning-models"
order: 3
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>LoRA: Efficient <span class="accent">Fine-Tuning Explained.</span></h1>
  <p class="sub">Train billion-parameter models on consumer hardware by updating 0.1% of weights.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The mathematical intuition behind Low-Rank Adaptation (LoRA)</li>
    <li>How to configure LoRA rank, alpha, and target modules</li>
    <li>Hands-on LoRA fine-tuning with Hugging Face PEFT</li>
    <li>How to merge, swap, and stack multiple LoRA adapters</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Core Idea</h2>

Full fine-tuning updates every parameter in a model. For a 7B parameter model, that means storing 7 billion gradient values in memory during training -- requiring 28GB+ of VRAM just for the gradients, plus the model weights themselves.

LoRA (Low-Rank Adaptation) exploits a key insight from the original paper by Hu et al. (2021): **the weight updates during fine-tuning have low intrinsic dimensionality.** In plain language, the changes you need to make to a model's weights to adapt it to your task can be represented by a much smaller matrix.

Instead of updating the full weight matrix W (dimensions d x d), LoRA decomposes the update into two smaller matrices:

```
Full update:     W' = W + deltaW        (d x d parameters)
LoRA update:     W' = W + B * A         (d x r + r x d parameters)

Where:
  W  = original frozen weight matrix (e.g., 4096 x 4096)
  B  = low-rank down-projection (4096 x r, e.g., 4096 x 16)
  A  = low-rank up-projection (r x 4096, e.g., 16 x 4096)
  r  = rank (typically 8-64)

Parameter savings:
  Full: 4096 x 4096 = 16,777,216 parameters
  LoRA (r=16): 4096 x 16 + 16 x 4096 = 131,072 parameters
  Reduction: 99.2% fewer trainable parameters
```

The original model weights are frozen. Only A and B are trained. This means:
- Training requires a fraction of the VRAM
- The original model is untouched (no catastrophic forgetting risk)
- LoRA adapters are tiny files (10-100MB vs 14GB+ for full model)
- Multiple adapters can be swapped at inference time

<div class="tip-box">
Think of LoRA as adding a thin correction layer on top of the frozen model. The base model handles general intelligence. The LoRA adapter handles your specific task. Separate concerns, combined at inference.
</div>
</div>

<div class="lesson-section">
<h2>Key Hyperparameters</h2>

Three parameters control LoRA behavior:

**Rank (r):** The dimensionality of the low-rank matrices. Higher rank = more capacity = more VRAM.

```
r = 4:   Minimal adaptation. Good for simple style changes.
r = 8:   Default. Handles most fine-tuning tasks well.
r = 16:  Strong adaptation. Good for complex domain shifts.
r = 32:  Near full fine-tuning quality. Higher VRAM cost.
r = 64+: Rarely needed. Diminishing returns above 32.

Rule of thumb: Start with r=8. Increase if validation
loss plateaus. Decrease if you see overfitting.
```

**Alpha (lora_alpha):** A scaling factor applied to the LoRA update. The effective learning rate for LoRA weights is scaled by alpha/rank.

```
Common settings:
  alpha = rank (scaling factor = 1.0, neutral)
  alpha = 2 * rank (scaling factor = 2.0, stronger adaptation)
  alpha = 16 with rank = 8 (most common default pairing)

The ratio alpha/rank matters more than the absolute values.
Higher ratio = stronger LoRA influence on the output.
```

**Target modules:** Which layers in the model receive LoRA adapters.

```python
# Common target module configurations:

# Minimal (attention only) -- least VRAM, often sufficient
target_modules = ["q_proj", "v_proj"]

# Standard (all attention projections)
target_modules = ["q_proj", "k_proj", "v_proj", "o_proj"]

# Comprehensive (attention + MLP)
target_modules = [
    "q_proj", "k_proj", "v_proj", "o_proj",
    "gate_proj", "up_proj", "down_proj"
]

# Rule: Start with q_proj + v_proj. Add more if needed.
# Each additional module increases VRAM by ~15-20%.
```

<div class="callout">
<strong>The rank-target tradeoff:</strong> Low rank on many modules often outperforms high rank on few modules. Try r=8 on all attention+MLP layers before trying r=32 on attention-only.
</div>
</div>

<div class="lesson-section">
<h2>Hands-On: LoRA Fine-Tuning with PEFT</h2>

Here is a complete LoRA fine-tuning script using Hugging Face's PEFT library:

```python
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model, TaskType
from datasets import load_dataset

# 1. Load base model and tokenizer
model_name = "meta-llama/Llama-3.1-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto",
)

# 2. Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    bias="none",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 13,631,488 || all: 8,043,631,616
# || trainable%: 0.1695

# 3. Load and format dataset
dataset = load_dataset("json", data_files="training_data.jsonl")

def format_example(example):
    messages = example["messages"]
    text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=False
    )
    return tokenizer(text, truncation=True, max_length=2048)

tokenized = dataset.map(format_example, remove_columns=["messages"])

# 4. Training arguments
training_args = TrainingArguments(
    output_dir="./lora-output",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    warmup_steps=100,
    logging_steps=10,
    save_strategy="epoch",
    evaluation_strategy="epoch",
    fp16=True,
    report_to="none",
)

# 5. Train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["validation"],
)

trainer.train()

# 6. Save adapter (NOT the full model)
model.save_pretrained("./my-lora-adapter")
# This saves only ~50MB instead of 16GB
```

VRAM requirements for this configuration:
```
Llama 3.1 8B with LoRA r=16 (4 attention modules):
  Model weights (fp16): ~16GB
  LoRA parameters: ~26MB
  Optimizer states: ~100MB
  Activations (batch=4): ~4GB
  Total: ~20GB VRAM

Compare full fine-tuning:
  Model weights: ~16GB
  Gradients: ~16GB
  Optimizer states: ~32GB
  Activations: ~8GB
  Total: ~72GB VRAM
```
</div>

<div class="lesson-section">
<h2>Adapter Management</h2>

LoRA adapters are modular. You can merge, swap, and stack them:

**Merging adapter into base model (for deployment):**
```python
from peft import PeftModel

base_model = AutoModelForCausalLM.from_pretrained(model_name)
model = PeftModel.from_pretrained(base_model, "./my-lora-adapter")

# Merge LoRA weights into base model
merged_model = model.merge_and_unload()

# Save as a standard model (no PEFT dependency at inference)
merged_model.save_pretrained("./merged-model")
```

**Swapping adapters at runtime:**
```python
from peft import PeftModel

base_model = AutoModelForCausalLM.from_pretrained(model_name)
model = PeftModel.from_pretrained(base_model, "./adapter-legal")

# Swap to a different adapter without reloading base model
model.load_adapter("./adapter-medical", adapter_name="medical")
model.set_adapter("medical")

# Swap back
model.set_adapter("default")  # back to legal adapter
```

**Stacking adapters (experimental):**
Multiple LoRA adapters can be combined with weighted blending. Useful for multi-task models that need capabilities from different fine-tuning runs.

<div class="demo-container">
<h4>Exercise: Fine-Tune with LoRA</h4>
Using the dataset from Lesson 2, fine-tune a small model (Llama 3.1 8B or Mistral 7B) with LoRA. Use r=8, alpha=16, target q_proj and v_proj. Train for 3 epochs. Compare the model's output before and after fine-tuning on 5 test examples. Note the adapter file size versus the full model size.
</div>
</div>

<QuizMC>
<Question text="What is the key mathematical insight behind LoRA?">
<Option text="Small models can be made as powerful as large models through fine-tuning" />
<Option correct text="Weight updates during fine-tuning have low intrinsic dimensionality and can be decomposed into smaller matrices" />
<Option text="Transformer attention layers are redundant and can be removed" />
<Option text="Gradient descent converges faster on smaller matrices" />
</Question>
<Question text="What does 'r=16 on all modules' vs 'r=32 on attention-only' typically produce?">
<Option correct text="Low rank on many modules often outperforms high rank on few modules" />
<Option text="High rank on few modules always produces better results" />
<Option text="They produce identical results since total parameter count is similar" />
<Option text="Neither approach works well -- full fine-tuning is always needed" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="How much parameter reduction does LoRA achieve with rank 16 on a 4096x4096 weight matrix?" back="Full update: 16.7M parameters. LoRA r=16: 131K parameters. That is a 99.2% reduction in trainable parameters." />
<Card front="What are the three key LoRA hyperparameters?" back="1. Rank (r): dimensionality of low-rank matrices (typical: 8-32). 2. Alpha: scaling factor (common: 2x rank). 3. Target modules: which layers get adapters (start with q_proj + v_proj)." />
<Card front="How much VRAM does LoRA fine-tuning of Llama 3.1 8B require vs full fine-tuning?" back="LoRA: ~20GB VRAM. Full fine-tuning: ~72GB VRAM. LoRA requires roughly 1/4 the memory." />
<Card front="What is the advantage of saving a LoRA adapter separately vs merging?" back="Separate adapters are tiny (10-100MB), can be swapped at runtime, and keep the base model untouched. Merged models are simpler to deploy but lose adapter modularity." />
</FlashDeck>

</div>