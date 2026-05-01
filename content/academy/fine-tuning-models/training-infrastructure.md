---
title: "Training Infrastructure & Compute"
course: "fine-tuning-models"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Training Infrastructure <span class="accent">& Compute.</span></h1>
  <p class="sub">Where to train, how much it costs, and how to avoid burning money.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Cloud GPU options: pricing, performance, and availability for fine-tuning</li>
    <li>How to estimate compute costs before you start training</li>
    <li>Multi-GPU training with DeepSpeed and FSDP</li>
    <li>Local training options for budget-conscious practitioners</li>
  </ul>
</div>

<div class="lesson-section">
<h2>GPU Landscape for Fine-Tuning</h2>

Fine-tuning compute comes from three sources: cloud GPU rental, managed fine-tuning APIs, and local hardware.

**Cloud GPU pricing (as of 2026):**

| GPU | VRAM | LoRA 7B | QLoRA 70B | $/hour (spot) | $/hour (on-demand) |
|-----|------|---------|-----------|---------------|-------------------|
| RTX 4090 | 24GB | Yes | No | $0.30-0.50 | $0.70-1.00 |
| A100 40GB | 40GB | Yes | Yes (tight) | $1.00-1.50 | $2.50-3.50 |
| A100 80GB | 80GB | Yes | Yes | $1.50-2.00 | $3.50-5.00 |
| H100 80GB | 80GB | Yes | Yes | $2.00-3.00 | $4.00-8.00 |
| L40S | 48GB | Yes | Yes | $0.80-1.20 | $1.80-2.50 |

**Cloud providers:**
```
RunPod        — Best spot pricing, easy setup, good for experimentation
Lambda Labs   — Dedicated instances, reliable availability
Vast.ai       — Cheapest rates, community GPUs, variable reliability
AWS (p4d/p5)  — Enterprise, most expensive, most reliable
GCP (a2/a3)   — Enterprise, good availability
Azure (NC)    — Enterprise, MSFT ecosystem integration
Modal         — Serverless GPU, pay per second, great for scripts
```

**Managed fine-tuning APIs (no infrastructure to manage):**
```
OpenAI Fine-Tuning API    — GPT-4o-mini from $0.30/1M tokens
Together AI               — Open models, $0.50-2.00/1M tokens
Fireworks AI              — Fast, open models, competitive pricing
Anyscale                  — Ray-based, scalable
```

<div class="tip-box">
For your first fine-tuning run, use a managed API (OpenAI or Together AI). Zero infrastructure setup. Once you understand the process and have proven data quality, switch to cloud GPUs for cost savings on larger or repeated training runs.
</div>
</div>

<div class="lesson-section">
<h2>Cost Estimation Before Training</h2>

Never start a training run without estimating its cost. Here is how to calculate:

**Formula:**
```
Total cost = (training_tokens / tokens_per_second) * ($/hour / 3600)

Where:
  training_tokens = num_examples * avg_tokens_per_example * num_epochs
  tokens_per_second = depends on GPU, batch size, model size
```

**Reference throughput (tokens/second, LoRA training):**

```
                    A100 40GB    A100 80GB    H100 80GB
Llama 3.1 8B       ~3,000       ~4,000       ~6,000
Llama 3.1 70B      N/A (OOM)    ~800         ~1,500
Mistral 7B         ~3,500       ~4,500       ~7,000
```

**Example cost calculation:**
```
Task: Fine-tune Llama 3.1 8B on 2,000 examples
  Avg tokens per example: 500
  Epochs: 3
  Training tokens: 2,000 * 500 * 3 = 3,000,000 tokens

  GPU: A100 80GB on RunPod (spot $1.50/hr)
  Throughput: ~4,000 tokens/second
  Training time: 3,000,000 / 4,000 = 750 seconds = 12.5 minutes

  Cost: (12.5 / 60) * $1.50 = $0.31

  Add overhead (loading, checkpointing, eval): ~$0.50 total
```

**Cost comparison across approaches:**
```
2,000 examples, 500 tokens avg, 3 epochs on 8B model:

  RunPod A100 spot:       $0.50
  Lambda A100 on-demand:  $1.00
  OpenAI FT API:          $3.00
  Together AI:            $1.50
  Local RTX 4090:         $0.15 (electricity only)
```

<div class="callout">
<strong>The hidden cost:</strong> Failed training runs. Your first attempt often has hyperparameter issues, data format bugs, or quality problems. Budget for 3-5 training runs before you get a good result. Your $0.50 estimated cost is really $2-3 in practice.
</div>
</div>

<div class="lesson-section">
<h2>Multi-GPU Training</h2>

When a single GPU cannot hold your model or you need faster training, distribute across multiple GPUs.

**DeepSpeed ZeRO (most common for fine-tuning):**

```python
# deepspeed_config.json
{
    "zero_optimization": {
        "stage": 2,
        "offload_optimizer": {
            "device": "cpu",
            "pin_memory": true
        },
        "allgather_partitions": true,
        "allgather_bucket_size": 2e8,
        "reduce_scatter": true,
        "reduce_bucket_size": 2e8,
        "overlap_comm": true
    },
    "bf16": {"enabled": true},
    "train_batch_size": "auto",
    "train_micro_batch_size_per_gpu": "auto",
    "gradient_accumulation_steps": "auto"
}
```

```bash
# Launch training across 4 GPUs
deepspeed --num_gpus=4 train.py \
    --deepspeed deepspeed_config.json \
    --model_name meta-llama/Llama-3.1-70B-Instruct \
    --per_device_train_batch_size 1 \
    --gradient_accumulation_steps 4
```

**ZeRO stages explained:**
```
Stage 1: Partition optimizer states across GPUs
  Memory saving: ~4x on optimizer memory
  Use when: Optimizer states are the bottleneck

Stage 2: Partition optimizer states + gradients
  Memory saving: ~8x on optimizer + gradient memory
  Use when: Default choice for most fine-tuning

Stage 3: Partition optimizer + gradients + model parameters
  Memory saving: Linear scaling with GPU count
  Use when: Model does not fit on a single GPU even quantized
  Tradeoff: Communication overhead increases significantly
```

**FSDP (PyTorch native alternative):**
```python
from torch.distributed.fsdp import (
    FullyShardedDataParallel as FSDP,
    MixedPrecision,
)

# In TrainingArguments:
training_args = TrainingArguments(
    fsdp="full_shard auto_wrap",
    fsdp_config={
        "fsdp_transformer_layer_cls_to_wrap": "LlamaDecoderLayer",
        "fsdp_offload_params": False,
        "fsdp_min_num_params": 1e6,
    },
    bf16=True,
)
```

Choose DeepSpeed when you need maximum flexibility and CPU offloading. Choose FSDP when you want native PyTorch integration and simpler configuration.
</div>

<div class="lesson-section">
<h2>Local Training Setup</h2>

For iterative experimentation, local hardware eliminates cloud costs and latency:

**Consumer GPU fine-tuning capabilities:**
```
RTX 3090 (24GB):  QLoRA up to 13B models, LoRA up to 7B
RTX 4090 (24GB):  QLoRA up to 13B, LoRA up to 7B, faster
RTX 4080 (16GB):  QLoRA up to 7B models only
Mac M3 Max (48GB): QLoRA up to 70B (via MLX), very slow
Mac M4 Pro (24GB): QLoRA up to 13B (via MLX)
```

**MLX fine-tuning on Apple Silicon:**
```bash
# Install MLX and dependencies
pip install mlx-lm

# Fine-tune with MLX (Apple Silicon optimized)
python -m mlx_lm.lora \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --data ./training_data \
    --train \
    --iters 1000 \
    --batch-size 4 \
    --lora-layers 16 \
    --learning-rate 1e-5

# Test the fine-tuned model
python -m mlx_lm.generate \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --adapter-path ./adapters \
    --prompt "Your test prompt here"
```

<div class="demo-container">
<h4>Exercise: Cost Your Training Run</h4>
Using your dataset from Lesson 2, calculate: total training tokens, estimated throughput on your available hardware, projected training time, and total cost. Include a 3-5x multiplier for failed runs. Compare the cost of three different compute options (managed API, cloud GPU spot, local if applicable). Choose the most cost-effective option and run your training.
</div>
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the recommended approach for your FIRST fine-tuning run?", "options": ["Rent the most powerful GPU available (H100) to ensure success", "Always train locally to avoid cloud costs", "Use a managed fine-tuning API (OpenAI or Together AI) for zero infrastructure setup", "Start with multi-GPU DeepSpeed training for maximum speed"], "correct": 2, "explanation": "The correct answer is: Use a managed fine-tuning API (OpenAI or Together AI) for zero infrastructure setup"}, {"q": "Why should you budget 3-5x your estimated compute cost?", "options": ["Cloud GPU prices fluctuate unpredictably", "First attempts often fail due to hyperparameter issues, data format bugs, or quality problems, requiring multiple training runs", "You need to train multiple model sizes to compare", "Evaluation and testing require the same compute as training"], "correct": 1, "explanation": "The correct answer is: First attempts often fail due to hyperparameter issues, data format bugs, or quality problems, requiring multiple training runs"}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What is the training cost formula?", "back": "Total cost = (training_tokens / tokens_per_second) * ($/hour / 3600). Training tokens = num_examples * avg_tokens_per_example * num_epochs."}, {"front": "What are the three DeepSpeed ZeRO stages?", "back": "Stage 1: Partition optimizer states. Stage 2: Partition optimizer + gradients (default choice). Stage 3: Partition optimizer + gradients + model params (for very large models, higher communication overhead)."}, {"front": "What models can a consumer RTX 4090 (24GB) fine-tune?", "back": "QLoRA: up to 13B models. Standard LoRA: up to 7B models. Full fine-tuning: not practical for any modern LLM."}, {"front": "When should you choose FSDP over DeepSpeed?", "back": "Choose FSDP for native PyTorch integration and simpler configuration. Choose DeepSpeed for maximum flexibility, CPU offloading, and more granular memory optimization."}]}'></div>

</div>