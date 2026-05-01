---
title: "Deploying Fine-Tuned Models"
course: "fine-tuning-models"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/fine-tuning-models/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Deploying <span class="accent">Fine-Tuned Models.</span></h1>
  <p class="sub">From trained weights to production endpoint with latency, cost, and reliability guarantees.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Deployment options: self-hosted, serverless, and managed inference</li>
    <li>Quantization for inference: GPTQ, AWQ, and GGUF formats</li>
    <li>Serving frameworks: vLLM, TGI, and Ollama</li>
    <li>Production hardening: load balancing, monitoring, and autoscaling</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Deployment Architecture Options</h2>

Three approaches, each with different tradeoff profiles:

**Option 1 - Self-hosted GPU server:**
```
How: Rent a GPU instance, run a serving framework (vLLM, TGI)
Cost: $0.50-4.00/hour (fixed, regardless of traffic)
Latency: Lowest (no cold starts, dedicated hardware)
Control: Maximum (custom batching, caching, routing)
Scaling: Manual or with container orchestration (K8s)
Best for: Steady traffic, latency-sensitive apps, data privacy

Provider options:
  RunPod Serverless or Dedicated
  Lambda Labs
  AWS/GCP/Azure GPU instances
```

**Option 2 - Serverless inference:**
```
How: Upload model to a serverless platform, pay per token
Cost: $0.001-0.01 per 1K tokens (scales to zero)
Latency: Higher (cold starts of 5-30 seconds)
Control: Limited (platform manages infrastructure)
Scaling: Automatic (handles traffic spikes)
Best for: Variable traffic, prototyping, cost optimization

Providers:
  Modal (Python-native, fast cold starts)
  Replicate (simple API, model marketplace)
  Together AI (competitive pricing)
  Fireworks AI (fast inference)
```

**Option 3 - Managed fine-tuning + hosting:**
```
How: Fine-tune via API, model is automatically hosted
Cost: Standard API pricing (often higher per token)
Latency: Good (provider optimizes serving)
Control: Minimal (black box)
Scaling: Automatic
Best for: Teams without ML ops expertise

Providers:
  OpenAI Fine-Tuning API
  Anthropic Fine-Tuning (via partners)
  Google Vertex AI
```

<div class="tip-box">
Start with Option 2 (serverless) for initial deployment. Move to Option 1 (self-hosted) when you need consistent latency or your costs exceed what a dedicated GPU would cost. The crossover point is typically 50,000-100,000 tokens per hour sustained.
</div>
</div>

<div class="lesson-section">
<h2>Inference Quantization</h2>

Training uses FP16/BF16 precision. Inference can use lower precision for faster speed and lower VRAM. Different quantization formats serve different deployment targets.

**GPTQ (GPU inference):**
```
Best for: GPU serving with vLLM or TGI
Precision: 4-bit or 8-bit
Speed: Fast on NVIDIA GPUs
Quality: Excellent (near-FP16 quality)
```

```bash
# Quantize with AutoGPTQ
python -m auto_gptq.quantize \
    --model_path ./merged-model \
    --output_path ./model-gptq-4bit \
    --bits 4 \
    --group_size 128 \
    --desc_act true
```

**AWQ (GPU inference, recommended):**
```
Best for: GPU serving, often faster than GPTQ
Precision: 4-bit
Speed: Fastest on modern NVIDIA GPUs
Quality: Excellent (activation-aware, preserves important weights)
```

```bash
# Quantize with AutoAWQ
python -c "
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model = AutoAWQForCausalLM.from_pretrained('./merged-model')
tokenizer = AutoTokenizer.from_pretrained('./merged-model')

model.quantize(tokenizer, quant_config={
    'zero_point': True,
    'q_group_size': 128,
    'w_bit': 4,
    'version': 'GEMM'
})

model.save_quantized('./model-awq-4bit')
tokenizer.save_pretrained('./model-awq-4bit')
"
```

**GGUF (CPU + Metal inference):**
```
Best for: Ollama, llama.cpp, Apple Silicon
Precision: 2-bit to 8-bit (Q4_K_M is common)
Speed: Good on CPU, excellent on Apple Silicon
Quality: Varies by quantization level
```

```bash
# Convert to GGUF using llama.cpp
python llama.cpp/convert_hf_to_gguf.py \
    ./merged-model \
    --outfile model.gguf \
    --outtype q4_k_m

# Serve with Ollama
ollama create mymodel -f Modelfile
# Modelfile contents:
# FROM ./model.gguf
# PARAMETER temperature 0.7
# SYSTEM "Your system prompt here"
```

<div class="callout">
<strong>Quantization quality ranking:</strong> AWQ >= GPTQ > GGUF Q6_K > GGUF Q4_K_M > GGUF Q3_K_S. For production GPU serving, use AWQ. For local/edge deployment, use GGUF Q4_K_M as the quality-size sweet spot.
</div>
</div>

<div class="lesson-section">
<h2>Serving with vLLM</h2>

vLLM is the standard for high-throughput LLM serving. It uses PagedAttention for efficient memory management and continuous batching for maximum GPU utilization.

```bash
# Install vLLM
pip install vllm

# Serve a model
python -m vllm.entrypoints.openai.api_server \
    --model ./model-awq-4bit \
    --quantization awq \
    --host 0.0.0.0 \
    --port 8000 \
    --max-model-len 4096 \
    --gpu-memory-utilization 0.90 \
    --tensor-parallel-size 1

# The server exposes an OpenAI-compatible API
```

```python
# Client code (uses OpenAI SDK)
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",
)

response = client.chat.completions.create(
    model="./model-awq-4bit",
    messages=[
        {"role": "system", "content": "You are a legal document classifier."},
        {"role": "user", "content": "Classify: 'The tenant agrees to pay...'"},
    ],
    temperature=0.1,
    max_tokens=50,
)

print(response.choices[0].message.content)
```

**vLLM performance tuning:**
```
Key parameters:
  --gpu-memory-utilization 0.90   # Use 90% of VRAM
  --max-model-len 4096            # Max sequence length
  --max-num-batched-tokens 8192   # Batch size for throughput
  --tensor-parallel-size N        # Multi-GPU splitting

Throughput benchmarks (A100 80GB, AWQ 4-bit):
  Llama 3.1 8B:   ~2,000 tokens/sec (single user)
                   ~8,000 tokens/sec (batched, 32 concurrent)
  Llama 3.1 70B:  ~500 tokens/sec (single user)
                   ~2,000 tokens/sec (batched)
```
</div>

<div class="lesson-section">
<h2>Production Hardening</h2>

A serving endpoint is not production-ready until it has monitoring, health checks, and failure handling.

**Health check endpoint:**
```python
# Add to your serving wrapper
@app.get("/health")
async def health():
    try:
        # Quick inference test
        response = model.generate("test", max_tokens=1)
        return {"status": "healthy", "model": MODEL_NAME}
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )
```

**Monitoring essentials:**
```
Metrics to track:
  - Request latency (p50, p95, p99)
  - Tokens per second (throughput)
  - GPU utilization and VRAM usage
  - Queue depth (requests waiting)
  - Error rate (5xx responses)
  - Token count per request (cost tracking)

Tools:
  Prometheus + Grafana (self-hosted)
  Datadog (managed)
  vLLM built-in metrics endpoint (/metrics)
```

**Docker deployment:**
```dockerfile
FROM vllm/vllm-openai:latest

COPY ./model-awq-4bit /model

ENV MODEL_PATH=/model
ENV PORT=8000

CMD ["python", "-m", "vllm.entrypoints.openai.api_server", \
     "--model", "/model", \
     "--quantization", "awq", \
     "--port", "8000", \
     "--gpu-memory-utilization", "0.90"]
```

```bash
# Run with GPU access
docker run --gpus all -p 8000:8000 my-model-server
```

<div class="demo-container">
<h4>Exercise: Deploy Your Model</h4>
Take your fine-tuned model from previous lessons. Merge the LoRA adapter into the base model. Quantize to AWQ 4-bit (if deploying to GPU) or GGUF Q4_K_M (if deploying to Ollama). Serve it and make 10 test API calls. Measure average latency and compare output quality to the non-quantized version.
</div>
</div>

<QuizMC>
<Question text="At what traffic level does self-hosted GPU deployment become more cost-effective than serverless?">
<Option text="Any traffic level -- self-hosted is always cheaper" />
<Option text="Only at millions of requests per day" />
<Option correct text="Approximately 50,000-100,000 tokens per hour sustained" />
<Option text="Serverless is always cheaper due to scale-to-zero" />
</Question>
<Question text="What is the recommended quantization format for production GPU serving?">
<Option text="GGUF Q4_K_M for maximum compatibility" />
<Option text="FP16 for maximum quality" />
<Option correct text="AWQ 4-bit for the best speed-quality tradeoff on modern NVIDIA GPUs" />
<Option text="INT8 for balanced performance" />
</Question>
</QuizMC>

<FlashDeck>
<Card front="What are the three deployment architecture options?" back="1. Self-hosted GPU (lowest latency, fixed cost, maximum control). 2. Serverless inference (auto-scaling, pay-per-token, cold starts). 3. Managed fine-tuning + hosting (simplest, least control)." />
<Card front="What is the quantization format quality ranking?" back="AWQ >= GPTQ > GGUF Q6_K > GGUF Q4_K_M > GGUF Q3_K_S. AWQ for GPU production, GGUF Q4_K_M for local/edge deployment." />
<Card front="What key metrics must be monitored for production model serving?" back="Request latency (p50/p95/p99), tokens per second, GPU utilization + VRAM, queue depth, error rate, and token count per request for cost tracking." />
<Card front="What makes vLLM the standard for LLM serving?" back="PagedAttention for efficient VRAM management, continuous batching for maximum GPU utilization, and an OpenAI-compatible API. Throughput: up to 8,000 tok/s batched on A100 for 8B models." />
</FlashDeck>

</div>