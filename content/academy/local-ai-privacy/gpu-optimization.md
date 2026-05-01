---
title: "GPU Optimization & Performance Tuning"
course: "local-ai-privacy"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/local-ai-privacy/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>GPU Optimization <span class="accent">& Performance Tuning.</span></h1>
  <p class="sub">Squeeze maximum speed from your hardware -- GPU offloading, memory management, and inference optimization for local AI.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How GPU acceleration works for AI inference (CUDA, Metal, ROCm)</li>
    <li>Memory management strategies for running larger models</li>
    <li>Ollama configuration options for performance tuning</li>
    <li>Benchmarking and monitoring your local AI performance</li>
  </ul>
</div>

<div class="lesson-section">
<h2>How GPU Acceleration Works</h2>
<p>AI model inference is fundamentally matrix multiplication -- thousands of parallel operations on arrays of numbers. CPUs handle these sequentially (a few operations at a time). GPUs handle them in parallel (thousands at once). This is why GPU-accelerated inference is 5-20x faster than CPU-only.</p>
<p><strong>Acceleration frameworks by platform:</strong></p>
<ul>
<li><strong>NVIDIA CUDA:</strong> The gold standard. Supported by every AI framework. Requires NVIDIA GPU + CUDA drivers. Works on Linux and Windows.</li>
<li><strong>Apple Metal:</strong> Built into all Apple Silicon Macs (M1-M4). Ollama uses Metal automatically -- no configuration needed. Unified memory means GPU can access all system RAM.</li>
<li><strong>AMD ROCm:</strong> Growing support on Linux. Some Ollama builds support ROCm for AMD GPUs. Less mature than CUDA but improving.</li>
</ul>
<p>Ollama detects your GPU automatically and uses it. You can verify with <code>ollama ps</code> which shows how much of the model is loaded into GPU vs. CPU memory.</p>

<div class="tip-box">
<strong>The VRAM bottleneck:</strong> On NVIDIA GPUs, the model must fit in VRAM (GPU memory). An RTX 4090 has 24GB VRAM -- enough for a 32B Q4 model. On Apple Silicon, there is no separate VRAM -- the unified memory pool is shared. A 32GB M3 MacBook can run models that would require a 24GB GPU on other platforms.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Memory Management Strategies</h2>
<p>When a model is too large for your GPU, you have three options:</p>
<p><strong>1. Quantize more aggressively.</strong> Drop from Q4 to Q3 or Q2. You lose some quality but gain significant memory savings. For a 70B model, Q3 vs Q4 can save 10GB+ of RAM.</p>
<p><strong>2. Partial GPU offloading.</strong> Load some model layers on GPU and the rest on CPU. The GPU-loaded layers run fast, CPU layers run slower. Overall speed is a blend. In Ollama, this happens automatically when the model doesn't fully fit in GPU memory.</p>
<p><strong>3. Use a smaller model.</strong> Often the best answer. A 14B model running entirely on GPU will outpace a 70B model split across GPU and CPU in tokens-per-second, even if the 70B model produces slightly better quality per token.</p>

<div class="demo-container">
<h4>Ollama Memory Configuration</h4>
<pre><code># Set maximum GPU layers (NVIDIA)
OLLAMA_NUM_GPU_LAYERS=35 ollama run llama3.1:70b

# Set number of threads for CPU inference
OLLAMA_NUM_THREADS=8 ollama run llama3.1:8b

# Keep model loaded in memory (prevents reload delay)
# Default: model stays loaded for 5 minutes after last use
OLLAMA_KEEP_ALIVE=30m ollama run qwen2.5:14b

# Set maximum memory Ollama can use
OLLAMA_MAX_LOADED_MODELS=2</code></pre>
</div>
</div>

<div class="lesson-section">
<h2>Inference Speed Optimization</h2>
<p>Beyond hardware, several settings affect inference speed:</p>
<p><strong>Context window size:</strong> Larger context windows use more memory and slow down inference. If you don't need 128K context, set a smaller context in your Modelfile:</p>
<pre><code># Create a Modelfile with optimized settings
FROM qwen2.5:14b
PARAMETER num_ctx 4096
PARAMETER temperature 0.7
PARAMETER repeat_penalty 1.1

# Build and run
ollama create my-fast-model -f Modelfile
ollama run my-fast-model</code></pre>

<p><strong>Batch size:</strong> When processing multiple prompts (like embedding a document collection), sending them in batches is dramatically faster than one at a time. Ollama handles this internally for embedding, but for generation, consider queuing requests to the API.</p>
<p><strong>Streaming vs. non-streaming:</strong> Streaming responses (the default in interactive mode) show tokens as they're generated. For API use where you only need the complete response, set <code>"stream": false</code> -- this can be slightly faster because there's no per-token HTTP overhead.</p>

<div class="callout">
<strong>The temperature trap:</strong> Lower temperatures (0.1-0.3) produce more deterministic, focused output. Higher temperatures (0.7-1.0) produce more creative, varied output. But temperature doesn't affect speed -- it only changes which tokens are selected. For factual tasks like RAG, use low temperature. For creative writing, use higher.
</div>
</div>

<div class="lesson-section">
<h2>Monitoring Performance</h2>
<p>Track these metrics to understand your local AI performance:</p>
<p><strong>Tokens per second (tok/s):</strong> Ollama displays this after each generation. Track it over time. A sudden drop might indicate thermal throttling, background processes consuming resources, or a model that's swapping to disk.</p>
<p><strong>Memory usage:</strong></p>
<pre><code># macOS: Check memory pressure
memory_pressure

# Linux: Check GPU memory (NVIDIA)
nvidia-smi

# Check Ollama's loaded models and memory usage
ollama ps</code></pre>

<p><strong>Thermal monitoring:</strong> Sustained AI inference generates heat. On laptops, thermal throttling reduces clock speeds and inference performance. Monitor temperature:</p>
<pre><code># macOS (requires powermetrics or iStats)
sudo powermetrics --samplers smc -i 1000 | grep -i temp

# Linux (NVIDIA)
nvidia-smi --query-gpu=temperature.gpu --format=csv</code></pre>

<p><strong>Best practices for sustained performance:</strong></p>
<ul>
<li>Use a laptop stand or cooling pad for long inference sessions</li>
<li>Close unnecessary applications to free RAM</li>
<li>Schedule heavy batch processing (embedding large document sets) for times you're not actively using the machine</li>
<li>Monitor fan activity -- when fans ramp up, your hardware is working near its thermal limit</li>
</ul>
</div>

<div class="lesson-section">
<h2>Modelfile Customization</h2>
<p>Ollama's Modelfile lets you create custom model configurations optimized for specific tasks:</p>
<pre><code># Fast RAG answerer -- low context, focused output
FROM qwen2.5:14b
PARAMETER num_ctx 2048
PARAMETER temperature 0.2
PARAMETER top_p 0.9
SYSTEM "You are a precise assistant. Answer questions using only the provided context. Be concise."

# Creative writer -- higher context, varied output
FROM llama3.1:8b
PARAMETER num_ctx 8192
PARAMETER temperature 0.8
PARAMETER top_p 0.95
SYSTEM "You are a creative writer. Produce vivid, engaging prose."</code></pre>
<p>Save different Modelfiles for different tasks and switch between them with <code>ollama run model-name</code>. This is faster than adjusting parameters per-request in the API.</p>
</div>

<QuizMC
  question="Why is Apple Silicon particularly efficient for local AI compared to NVIDIA setups?"
  options='["Apple chips are faster than NVIDIA GPUs", "Unified memory means no separate VRAM limit -- the GPU can access all system RAM", "Apple provides better AI software", "Apple Silicon supports CUDA natively"]'
  answer="1"
/>

<QuizMC
  question="What is the most common cause of sudden inference speed drops during extended use?"
  options='["Model corruption", "Thermal throttling as the hardware gets hot", "Internet connection issues", "Ollama software bugs"]'
  answer="1"
/>

<FlashDeck cards='[
  {"front": "What are the three GPU acceleration frameworks?", "back": "NVIDIA CUDA (gold standard, Linux/Windows), Apple Metal (built into M1-M4, automatic in Ollama), AMD ROCm (growing Linux support)"},
  {"front": "What are the three strategies when a model is too large for GPU memory?", "back": "1) Quantize more aggressively (Q4 to Q3), 2) Partial GPU offloading (split layers), 3) Use a smaller model that fits entirely on GPU"},
  {"front": "How do you create a custom model configuration in Ollama?", "back": "Write a Modelfile with FROM, PARAMETER, and SYSTEM directives. Build with 'ollama create model-name -f Modelfile'. Run with 'ollama run model-name'."},
  {"front": "What num_ctx setting should you use for RAG?", "back": "2048-4096 is usually sufficient for RAG (3-5 chunks of context). Smaller context windows use less memory and run faster."},
  {"front": "How do you check Ollama's GPU memory usage?", "back": "ollama ps shows loaded models and memory allocation. nvidia-smi shows NVIDIA GPU memory. macOS memory_pressure shows system memory state."}
]' />

</div>