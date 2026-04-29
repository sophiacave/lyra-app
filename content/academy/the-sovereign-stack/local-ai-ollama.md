---
title: "Local AI: Ollama & Open Models"
course: "the-sovereign-stack"
order: 2
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-sovereign-stack/">The Sovereign Stack</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Local AI: Ollama & Open Models</h1>
  <p><span class="accent">Your own AI, running on your own hardware, with zero API costs.</span></p>
  <p>Ollama turns your laptop into an AI server. Open-weight models like Qwen, DeepSeek, and Llama run locally with no internet connection, no API keys, and no per-token charges. This lesson gets you from installation to production-quality local AI.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Setting up Ollama: installation, model pulling, and first inference</li>
    <li>Model selection: which models for which tasks</li>
    <li>Quantization: trading precision for speed and memory savings</li>
    <li>Performance tuning: getting the most from your hardware</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">What Is Ollama?</h2>
  <p class="section-text">Ollama is a tool that runs large language models on your local machine. Think of it as Docker for AI models -- it downloads, manages, and serves models through a simple API that any application can call.</p>
  <p class="section-text">You install it once, pull the models you want, and start making AI requests -- all without an internet connection after the initial download. The models run entirely on your CPU or GPU, your data never leaves your machine, and there are no per-request costs.</p>
  <p class="section-text">Ollama exposes a REST API on localhost:11434 that is compatible with the OpenAI API format. This means any tool built for OpenAI or Claude can be pointed at Ollama with minimal code changes. Your existing integrations just work.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Getting Started</h2>
  <p class="section-text">Setup takes less than 5 minutes:</p>
  <div class="prompt-box"><code># Install Ollama (macOS)
brew install ollama

# Or download from ollama.com for any platform
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# Start the Ollama server
ollama serve

# Pull your first model (in a new terminal)
ollama pull qwen2.5:7b          # 4.4 GB, excellent for general tasks
ollama pull deepseek-coder-v2   # Specialized for code
ollama pull llama3.1:8b         # Meta's versatile model

# Test it immediately
ollama run qwen2.5:7b "Explain what sovereignty means for AI in 3 sentences."</code></div>
  <p class="section-text">That is it. You now have a local AI that responds to natural language, writes code, summarizes documents, and answers questions -- all without an internet connection or API key.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Model Selection Guide</h2>
  <p class="section-text">Not all models are created equal. Here is how to choose the right model for each task:</p>
  <p class="section-text"><strong style="color: var(--blue);">General assistant (Qwen 2.5 7B):</strong> The best all-around small model. Excellent at following instructions, summarizing, drafting, and Q&A. Runs well on 8GB RAM. Your default model for 80% of tasks.</p>
  <p class="section-text"><strong style="color: var(--purple);">Code generation (DeepSeek Coder V2):</strong> Specialized for writing and debugging code. Understands dozens of programming languages. Better at code than general models twice its size. Use this for development tasks.</p>
  <p class="section-text"><strong style="color: var(--green);">Complex reasoning (Llama 3.1 70B):</strong> Meta's largest open model. Approaches cloud model quality for analysis, planning, and nuanced writing. Requires 40GB+ RAM. Use when you need frontier-quality reasoning without the cloud.</p>
  <p class="section-text"><strong style="color: var(--orange);">Embeddings (nomic-embed-text):</strong> Converts text into vector embeddings for search and retrieval. Fast, small, and purpose-built. Essential for building your local RAG pipeline.</p>
  <div class="prompt-box"><code># Model sizes and RAM requirements
# Model           Size    RAM     Best For
# qwen2.5:3b      2 GB    4 GB    Quick tasks, low-end hardware
# qwen2.5:7b      4 GB    8 GB    General assistant (recommended start)
# llama3.1:8b     5 GB    8 GB    Versatile, strong reasoning
# deepseek-coder  4 GB    8 GB    Code generation
# qwen2.5:14b     9 GB   16 GB    Better quality, more RAM
# llama3.1:70b   40 GB   48 GB    Near-frontier quality
# nomic-embed     274 MB   1 GB    Embeddings only</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Concept</span>
  <h2 class="section-title">Quantization: The Quality-Speed Tradeoff</h2>
  <p class="section-text">AI models are stored as numbers (weights). Full-precision weights use 16 bits per number. Quantization reduces this to 8 bits, 4 bits, or even 2 bits -- making the model smaller, faster, and able to run on less RAM.</p>
  <p class="section-text">Think of it like image compression. A full-quality photo is 10MB. A compressed version is 2MB. You lose some detail, but for most purposes it looks the same. Quantization works the same way for AI models.</p>
  <p class="section-text"><strong style="color: var(--green);">Q4_K_M (4-bit, recommended):</strong> The sweet spot. Models are roughly 4x smaller than full precision. Quality loss is minimal for most tasks. This is what Ollama uses by default.</p>
  <p class="section-text"><strong style="color: var(--blue);">Q8_0 (8-bit):</strong> Higher quality, but models are 2x larger. Use when you have enough RAM and quality matters (long-form writing, complex analysis).</p>
  <p class="section-text"><strong style="color: var(--orange);">Q2_K (2-bit):</strong> Maximum compression. Models are tiny but quality degrades noticeably. Use only when RAM is severely constrained and you need something running.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Performance Tuning</h2>
  <p class="section-text">Getting the best performance from local models means understanding your hardware and configuring Ollama to match:</p>
  <p class="section-text"><strong style="color: var(--blue);">GPU acceleration.</strong> If you have an Apple Silicon Mac (M1/M2/M3/M4), Ollama automatically uses the GPU. This is 5-10x faster than CPU-only. On Linux/Windows, NVIDIA GPUs with CUDA support provide similar acceleration. Check with <code>ollama ps</code> to verify GPU is active.</p>
  <p class="section-text"><strong style="color: var(--purple);">Context window.</strong> By default, Ollama uses a 2048-token context window. For longer documents, increase it: <code>ollama run qwen2.5:7b --num-ctx 8192</code>. Larger context uses more RAM but lets the model process longer inputs.</p>
  <p class="section-text"><strong style="color: var(--green);">Concurrent requests.</strong> Ollama handles one request at a time by default. For multiple simultaneous users or agents, set <code>OLLAMA_NUM_PARALLEL=4</code> to allow parallel processing. Each parallel request uses additional RAM.</p>
  <p class="section-text"><strong style="color: var(--orange);">Keep alive.</strong> After a request, Ollama keeps the model in memory for 5 minutes by default. Adjust with <code>OLLAMA_KEEP_ALIVE=30m</code> to keep it loaded longer (faster subsequent requests) or <code>0</code> to unload immediately (save RAM).</p>
</div>

<div class="lesson-section">
  <span class="section-label">Integration</span>
  <h2 class="section-title">Calling Ollama from Code</h2>
  <p class="section-text">Ollama exposes an API on localhost:11434. You can call it from any language:</p>
  <div class="prompt-box"><code>// JavaScript/Node.js -- direct API call
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'qwen2.5:7b',
    prompt: 'Summarize the benefits of local AI in 3 bullet points.',
    stream: false          // Set true for streaming responses
  })
});
const data = await response.json();
console.log(data.response);

// Python -- using the ollama library
import ollama
response = ollama.generate(
  model='qwen2.5:7b',
  prompt='Summarize the benefits of local AI in 3 bullet points.'
)
print(response['response'])

# Shell -- simple curl
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "Summarize the benefits of local AI.",
  "stream": false
}'</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Local AI Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Running models too large for your RAM.</strong> A 70B model on a 16GB machine will thrash to swap, taking minutes per response. Check RAM requirements before pulling a model. Use <code>ollama ps</code> to see memory usage.</p>
  <p class="section-text"><strong style="color: var(--red);">Expecting cloud quality from small models.</strong> A 7B parameter model is not Claude or GPT-4. It is excellent for routine tasks but struggles with complex multi-step reasoning. Use local for routine, cloud for complex. That is the hybrid strategy.</p>
  <p class="section-text"><strong style="color: var(--red);">Not monitoring resource usage.</strong> Local models consume significant CPU, GPU, and RAM. Running a model while doing other intensive work (video editing, compiling) can freeze your machine. Monitor with Activity Monitor or htop.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Set up your local AI stack:</p>
  <div class="prompt-box"><code>1. Install Ollama (brew install ollama or ollama.com)
2. Pull qwen2.5:7b (your general assistant)
3. Run a test: ollama run qwen2.5:7b "What can you help me with?"
4. Pull nomic-embed-text (for embeddings -- needed later)
5. Test the API: curl localhost:11434/api/generate -d '{"model":"qwen2.5:7b","prompt":"Hello","stream":false}'
6. Benchmark: time how long a 200-word response takes
   - Under 5 seconds on GPU = excellent
   - Under 15 seconds on CPU = acceptable

You now have a zero-cost AI running on your own hardware.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Local AI: Ollama & Open Models","cards":[{"front":"What Is Ollama?","back":"A tool that runs LLMs on your local machine. Downloads, manages, and serves models through a REST API on localhost:11434. No internet needed after initial download. No per-request costs."},{"front":"Model Selection Strategy","back":"Qwen 2.5 7B for general tasks (8GB RAM). DeepSeek Coder for code. Llama 3.1 70B for complex reasoning (48GB RAM). Nomic-embed-text for embeddings. Match model to task and hardware."},{"front":"Quantization","back":"Compressing model weights from 16-bit to 4-bit (or less). Q4_K_M is the sweet spot -- 4x smaller with minimal quality loss. Q8_0 for higher quality. Q2_K for extreme compression."},{"front":"GPU Acceleration","back":"Apple Silicon Macs automatically use GPU (5-10x faster). NVIDIA GPUs with CUDA on Linux/Windows. Check with ollama ps to verify GPU is active."},{"front":"The Hybrid Strategy","back":"Run routine tasks locally (free). Use cloud APIs for complex reasoning (paid). 80/20 split saves 90%+ on AI costs while maintaining access to frontier capabilities."},{"front":"RAM Rule","back":"Never run a model that exceeds your available RAM. A 70B model needs 48GB+. A 7B model needs 8GB+. Running too-large models causes swap thrashing and minutes-per-response performance."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Local AI quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Local AI: Ollama & Open Models","questions":[{"q":"What is quantization and why is it important for local AI?","options":["A way to make AI models more accurate","Compressing model weights from 16-bit to 4-bit, making models roughly 4x smaller so they fit in less RAM and run faster -- with minimal quality loss at Q4_K_M","A method for encrypting AI model files","A technique for training new AI models locally"],"correct":1,"explanation":"Quantization is like image compression for AI models. Full-precision models are huge and slow. Q4_K_M quantization reduces size by 4x with barely noticeable quality loss. This is why a 7B model that would need 14GB at full precision fits in 4GB quantized."},{"q":"What is the recommended model selection strategy for a sovereign stack?","options":["Always use the largest model available","Use one model for everything","Match models to tasks: Qwen 2.5 7B for general work (80% of tasks), specialized models for code and embeddings, cloud APIs only for complex reasoning that local models cannot handle","Only use cloud APIs and skip local models entirely"],"correct":2,"explanation":"Different tasks need different tools. A 7B model handles routine tasks perfectly at zero cost. Specialized models (DeepSeek for code, nomic for embeddings) excel in their domains. Cloud APIs are reserved for the hardest 20% where frontier models genuinely add value."},{"q":"Why should you check RAM before pulling a model?","options":["Models with insufficient RAM will not download","A model that exceeds available RAM will thrash to swap memory, taking minutes per response instead of seconds -- making it unusable","RAM determines the model quality","RAM usage is not important for local AI"],"correct":1,"explanation":"When a model does not fit in RAM, the operating system swaps data to disk. Disk is 100-1000x slower than RAM. A model that responds in 3 seconds with enough RAM might take 5 minutes when swapping. Always check requirements first."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/the-sovereign-stack/the-sovereign-mindset/" class="prev">&larr; Previous: The Sovereign Mindset</a>
  <a href="/academy/the-sovereign-stack/brain-architecture/" class="next">Next: Brain Architecture &rarr;</a>
</nav>

</div>
