---
title: "QLoRA & Quantization"
course: "fine-tuning-models"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>QLoRA & <span class="accent">Quantization.</span></h1>
  <p class="sub">Fine-tune 70B models on a single GPU by combining LoRA with 4-bit quantization.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How quantization reduces model memory footprint without destroying quality</li>
    <li>The QLoRA technique: 4-bit NormalFloat, double quantization, and paged optimizers</li>
    <li>Hands-on QLoRA training with bitsandbytes and PEFT</li>
    <li>When to use QLoRA vs standard LoRA and the quality tradeoffs</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Quantization Fundamentals</h2>

Model weights are stored as floating-point numbers. The precision of these numbers directly determines memory usage:

```
Precision    Bits per weight    Memory for 7B model
FP32         32 bits            28 GB
FP16/BF16    16 bits            14 GB
INT8         8 bits             7 GB
INT4/NF4     4 bits             3.5 GB
```

Quantization converts weights from higher to lower precision. The challenge is doing this without destroying the model's capability.

**Naive quantization** maps floating-point values to integer bins uniformly. This works poorly because model weights follow a roughly normal distribution -- most values cluster near zero, with few extreme outliers. Uniform binning wastes precision on sparse regions and crushes important distinctions near zero.

**NormalFloat4 (NF4)** -- the quantization format used in QLoRA -- solves this by creating non-uniform bins that match the normal distribution of weights. More bins near zero (where most weights live), fewer bins in the tails.

```
Uniform INT4:     [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
NF4 (normalized): [-1.0, -0.69, -0.52, -0.39, -0.28, -0.18, -0.09, 0.0,
                    0.08, 0.17, 0.27, 0.38, 0.51, 0.68, 1.0]

NF4 has higher density near zero where weight values cluster,
preserving more information in the region that matters most.
```

The result: NF4 quantization from 16-bit to 4-bit typically loses less than 1% accuracy on benchmarks, while reducing memory by 4x.

<div class="tip-box">
Quantization is a compression technique, not a quality improvement. You trade memory for a small accuracy loss. The magic of QLoRA is that LoRA training recovers most of this lost accuracy on your specific task.
</div>
</div>

<div class="lesson-section">
<h2>QLoRA: Three Innovations</h2>

QLoRA (Dettmers et al., 2023) combines three techniques that together make large model fine-tuning accessible on consumer hardware:

**Innovation 1 - 4-bit NormalFloat (NF4) base model:**
The pre-trained model weights are quantized to 4-bit NF4. This is the frozen backbone. LoRA adapter weights remain in 16-bit precision for training accuracy.

```
Memory layout:
  Base model (7B params x 4 bits):   3.5 GB
  LoRA adapters (0.1% x 16 bits):    ~26 MB
  Optimizer states (LoRA only):      ~100 MB
  Total: ~4 GB for a 7B model
  vs 20 GB for standard LoRA with FP16 base
```

**Innovation 2 - Double quantization:**
The quantization constants (scaling factors used to map between 4-bit and 16-bit) themselves are quantized from FP32 to FP8. This saves an additional ~0.37 bits per parameter.

```
Single quantization: 4 bits per weight + 32-bit constants
  Per-block overhead: 32 bits / 64 weights = 0.5 bits/weight
  Effective: 4.5 bits per weight

Double quantization: 4 bits per weight + 8-bit constants
  Per-block overhead: 8 bits / 64 weights = 0.125 bits/weight
  Effective: 4.125 bits per weight

Savings on 7B model: ~0.4 GB additional reduction
```

**Innovation 3 - Paged optimizers:**
When GPU VRAM runs out during training (gradient spikes cause temporary memory peaks), paged optimizers offload optimizer states to CPU RAM using NVIDIA unified memory. This prevents out-of-memory crashes without manual memory management.

```
Without paged optimizers:
  Gradient spike → OOM crash → training lost

With paged optimizers:
  Gradient spike → automatic page to CPU → slight slowdown →
  pages back to GPU when memory frees → training continues
```
</div>

<div class="lesson-section">
<h2>Hands-On: QLoRA Training</h2>

Complete QLoRA fine-tuning script:

```python
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    BitsAndBytesConfig,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from datasets import load_dataset

# 1. Quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",           # NormalFloat4
    bnb_4bit_compute_dtype=torch.bfloat16, # Compute in BF16
    bnb_4bit_use_double_quant=True,       # Double quantization
)

# 2. Load quantized model
model_name = "meta-llama/Llama-3.1-70B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto",
    attn_implementation="flash_attention_2",
)

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# 3. Prepare model for QLoRA training
model = prepare_model_for_kbit_training(model)

# 4. LoRA config (same as standard LoRA)
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# ~0.04% trainable for 70B model

# 5. Load dataset
dataset = load_dataset("json", data_files={
    "train": "train.jsonl",
    "validation": "validation.jsonl",
})

# 6. Train with SFTTrainer (handles chat formatting)
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    tokenizer=tokenizer,
    args=TrainingArguments(
        output_dir="./qlora-70b-output",
        num_train_epochs=2,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        learning_rate=1e-4,
        warmup_ratio=0.05,
        logging_steps=5,
        save_strategy="epoch",
        evaluation_strategy="epoch",
        bf16=True,
        optim="paged_adamw_8bit",     # Paged optimizer
        gradient_checkpointing=True,   # Trade compute for memory
        max_grad_norm=0.3,
        report_to="none",
    ),
    max_seq_length=2048,
)

trainer.train()
model.save_pretrained("./qlora-70b-adapter")
```

**VRAM requirements:**
```
Model                    Standard LoRA    QLoRA
Llama 3.1 8B            ~20 GB           ~6 GB
Llama 3.1 70B           ~150 GB          ~36 GB
Mistral 7B              ~18 GB           ~5.5 GB
Mixtral 8x7B            ~100 GB          ~24 GB
```

<div class="callout">
<strong>Critical note:</strong> QLoRA training is 20-30% slower than standard LoRA due to quantization/dequantization overhead during forward and backward passes. The tradeoff is memory, not speed. If you have enough VRAM for standard LoRA, prefer it.
</div>
</div>

<div class="lesson-section">
<h2>QLoRA vs LoRA: Decision Guide</h2>

```
Use standard LoRA when:
  - You have sufficient VRAM for the FP16 base model
  - Training speed matters more than memory efficiency
  - You want maximum quality (avoids quantization loss)
  - You are training on A100/H100 or multiple GPUs

Use QLoRA when:
  - You need to fit a larger model on limited VRAM
  - You are training on consumer GPUs (RTX 3090, 4090)
  - The small quality tradeoff is acceptable
  - You want to fine-tune 70B+ models without multi-GPU setups

Quality comparison (benchmark performance):
  Full fine-tuning:      100% (baseline)
  Standard LoRA (r=16):  98-99%
  QLoRA (NF4, r=16):     97-98%
  QLoRA (INT4, r=8):     95-97%
```

The quality gap between LoRA and QLoRA is typically smaller than the gap between good and bad training data. Invest your time in data quality (Lesson 2), not in squeezing the last fraction of a percent from precision choices.

<div class="demo-container">
<h4>Exercise: QLoRA on Consumer Hardware</h4>
Fine-tune Llama 3.1 8B using QLoRA on a machine with 8-12GB VRAM (RTX 3070/3080 or equivalent). Use the same dataset from Lesson 3 for a direct comparison. Compare: training time, VRAM usage, and output quality on your test set. Document the quality vs memory tradeoff you observe.
</div>
</div>

<QuizMC>
<Question text="What makes NormalFloat4 (NF4) quantization superior to uniform INT4 for model weights?">
<Option text="NF4 uses fewer bits per weight than INT4" />
<Option text="NF4 only quantizes attention layers while keeping MLP in full precision" />
<Option correct text="NF4 creates non-uniform bins matching the normal distribution of weights, preserving more precision near zero where most values cluster" />
<Option text="NF4 is faster to compute than INT4 during inference" />
</Question>
<Question text="What is the primary tradeoff of using QLoRA instead of standard LoRA?">
<Option text="QLoRA produces significantly lower quality models" />
<Option text="QLoRA requires more training data" />
<Option correct text="QLoRA is 20-30% slower due to quantization/dequantization overhead, trading speed for memory savings" />
<Option text="QLoRA adapters cannot be merged with the base model" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the three innovations in QLoRA?" back="1. 4-bit NormalFloat (NF4) quantized base model with 16-bit LoRA adapters. 2. Double quantization (quantize the quantization constants). 3. Paged optimizers (auto-offload to CPU on memory spikes)." />
<Card front="How much VRAM does QLoRA require for Llama 3.1 70B vs standard LoRA?" back="QLoRA: ~36 GB. Standard LoRA: ~150 GB. QLoRA reduces memory by roughly 4x." />
<Card front="What is the typical quality loss from QLoRA compared to full fine-tuning?" back="QLoRA retains 97-98% of full fine-tuning quality. Standard LoRA retains 98-99%. The gap is smaller than the impact of training data quality." />
<Card front="When should you prefer standard LoRA over QLoRA?" back="When you have sufficient VRAM, need maximum training speed, want the highest quality, or are training on high-end GPUs (A100/H100) where memory is not the constraint." />
</FlashDeck>

</div>