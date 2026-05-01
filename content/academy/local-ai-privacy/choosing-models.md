---
title: "Choosing the Right Model"
course: "local-ai-privacy"
order: 3
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/local-ai-privacy/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Choosing the <span class="accent">Right Model.</span></h1>
  <p class="sub">Size vs. quality vs. speed -- how to pick the right model for each task without wasting RAM or waiting forever.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How model size (parameters) relates to quality and resource usage</li>
    <li>What quantization is and which level to choose</li>
    <li>Which models excel at specific tasks (coding, reasoning, writing, chat)</li>
    <li>How to benchmark and compare models on your own hardware</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Parameter-Quality Spectrum</h2>
<p>Model parameters are the learned weights from training. More parameters generally means more capability -- but also more RAM, more disk space, and slower inference. The art of local AI is finding the smallest model that handles your task well.</p>
<p><strong>Size tiers in practice:</strong></p>
<ul>
<li><strong>1-3B parameters:</strong> Fast, lightweight. Good for simple classification, extraction, and basic Q&A. Think of these as smart autocomplete.</li>
<li><strong>7-8B parameters:</strong> The local AI workhorse. Handles most writing, coding, and analysis tasks. Quality comparable to GPT-3.5 for straightforward work.</li>
<li><strong>14-32B parameters:</strong> The sweet spot for serious local work. Strong reasoning, nuanced writing, complex code generation. This is where local starts competing with cloud.</li>
<li><strong>70B+ parameters:</strong> Near-frontier quality. Requires significant hardware (64GB+ RAM or high-end GPU). Worth it for work that demands deep reasoning or long-context analysis.</li>
</ul>

<div class="tip-box">
<strong>Rule of thumb:</strong> You need roughly 1GB of RAM per 1B parameters for a Q4 quantized model. An 8B model needs ~5GB, a 32B model needs ~20GB, a 70B model needs ~40GB. Always leave headroom for your OS and other applications.
</div>
</div>

<div class="lesson-section">
<h2>Understanding Quantization</h2>
<p>Full-precision models use 16 bits per parameter. Quantization compresses these to fewer bits, dramatically reducing size and RAM usage with minimal quality loss. This is what makes large models runnable on consumer hardware.</p>
<p><strong>Quantization levels:</strong></p>
<ul>
<li><strong>Q8 (8-bit):</strong> Minimal quality loss. ~50% size reduction from full precision. Use when quality is paramount and you have the RAM.</li>
<li><strong>Q5:</strong> Barely perceptible quality loss. Good balance for most users.</li>
<li><strong>Q4 (4-bit):</strong> The default for most Ollama models. ~75% size reduction. Slight quality degradation but excellent for daily use. This is what you should start with.</li>
<li><strong>Q3 and below:</strong> Noticeable quality degradation. Only use when you absolutely must fit a larger model into limited RAM.</li>
</ul>
<p>In Ollama, quantization is usually indicated by tags. For example, <code>llama3.1:8b</code> typically uses Q4, while <code>llama3.1:8b-q8_0</code> uses Q8. Check with <code>ollama show modelname</code> to see the specific quantization.</p>

<div class="callout">
<strong>The counterintuitive truth:</strong> A well-quantized larger model often outperforms a smaller model at full precision. A 32B model at Q4 typically beats a 14B model at Q8. When choosing between a bigger model with more compression or a smaller model with less compression, go bigger.
</div>
</div>

<div class="lesson-section">
<h2>Model Recommendations by Task</h2>
<p>Not all models are created equal. Each model family has strengths:</p>
<p><strong>General writing and chat:</strong></p>
<ul>
<li>Llama 3.1 (8B, 70B) -- Meta's flagship. Strong all-rounder. Excellent instruction following.</li>
<li>Qwen 2.5 (7B, 14B, 32B, 72B) -- Alibaba's model. Exceptional multilingual support and reasoning.</li>
</ul>
<p><strong>Code generation:</strong></p>
<ul>
<li>Qwen 2.5 Coder (7B, 14B, 32B) -- Purpose-built for coding. Excels at Python, JavaScript, TypeScript.</li>
<li>DeepSeek Coder V2 (16B) -- Strong at complex code reasoning and debugging.</li>
</ul>
<p><strong>Reasoning and analysis:</strong></p>
<ul>
<li>DeepSeek-R1 (8B, 32B, 70B) -- Chain-of-thought reasoning model. Shows its work. Excellent for math, logic, and complex analysis.</li>
<li>Qwen-QwQ (32B) -- Reasoning-focused with strong analytical capabilities.</li>
</ul>
<p><strong>Embeddings (for RAG/search):</strong></p>
<ul>
<li>nomic-embed-text -- 137M parameters, fast, high-quality embeddings for document search.</li>
<li>mxbai-embed-large -- 335M parameters, more accurate for nuanced similarity tasks.</li>
</ul>

<div class="demo-container">
<h4>Multi-Model Setup Example</h4>
<p>A practical local AI lab might run three models:</p>
<pre><code>ollama pull gemma2:2b          # Fast model for simple tasks
ollama pull qwen2.5:14b        # Daily driver for writing/analysis
ollama pull qwen2.5-coder:14b  # Coding specialist
ollama pull nomic-embed-text   # Embeddings for document search</code></pre>
<p>Total disk space: ~15GB. Switch between them based on the task at hand.</p>
</div>
</div>

<div class="lesson-section">
<h2>Benchmarking on Your Hardware</h2>
<p>Published benchmarks don't tell you how a model performs on your specific machine. Run your own tests:</p>
<p><strong>Speed test:</strong></p>
<pre><code># Time a generation (check tokens/second in output)
ollama run llama3.1:8b "Write a 200-word essay about climate change."</code></pre>
<p>Ollama shows tokens per second in the response. Aim for 10+ tokens/sec for comfortable interactive use. Below 5 tokens/sec feels sluggish.</p>
<p><strong>Quality test:</strong> Run the same 5 prompts through different models and compare outputs. Use prompts that match your actual use case:</p>
<ol>
<li>A writing task (draft an email or report section)</li>
<li>A reasoning task (analyze a problem with multiple variables)</li>
<li>A coding task (write a function with specific requirements)</li>
<li>A summarization task (condense a long document)</li>
<li>An instruction-following task (follow a multi-step prompt precisely)</li>
</ol>
<p>Rate each output 1-5. The model with the best average across your tasks at an acceptable speed is your daily driver.</p>
</div>

<div class="lesson-section">
<h2>Model Management</h2>
<p>Models take disk space. Manage them actively:</p>
<pre><code># Check disk usage per model
ollama list

# Remove models you don't use
ollama rm model-name

# Keep your daily driver + one specialist + one embedding model
# Delete everything else until you need it</code></pre>
<p>Models can always be re-downloaded. Don't hoard them. Keep your disk clean and pull what you need when you need it. A lean setup with 3-4 models is better than a cluttered one with 20 that you never touch.</p>
</div>

<QuizMC
  question="What quantization level do most default Ollama models use?"
  options='["Q8 (8-bit)", "Q5 (5-bit)", "Q4 (4-bit)", "Q2 (2-bit)"]'
  answer="2"
/>

<QuizMC
  question="When choosing between a larger model with more quantization or a smaller model with less quantization, which typically performs better?"
  options='["The smaller model at higher precision always wins", "The larger model with more compression typically outperforms the smaller one", "They perform identically", "It depends entirely on the GPU brand"]'
  answer="1"
/>

<FlashDeck cards='[
  {"front": "What is the RAM rule of thumb for quantized models?", "back": "Roughly 1GB of RAM per 1B parameters at Q4 quantization. 8B model needs ~5GB, 32B needs ~20GB, 70B needs ~40GB."},
  {"front": "What are the four model size tiers and their strengths?", "back": "1-3B (smart autocomplete), 7-8B (daily workhorse, GPT-3.5 level), 14-32B (serious work, competes with cloud), 70B+ (near-frontier reasoning)"},
  {"front": "What is the recommended coding model for local AI?", "back": "Qwen 2.5 Coder (available in 7B, 14B, 32B sizes) -- purpose-built for code generation, strong at Python/JS/TS"},
  {"front": "What tokens/second speed is needed for comfortable interactive use?", "back": "10+ tokens/second for comfortable use. Below 5 tokens/second feels sluggish."},
  {"front": "What is quantization?", "back": "Compressing model weights from 16 bits to fewer bits (8, 5, 4, or 3). Dramatically reduces size and RAM usage with minimal quality loss. Q4 is the standard default."},
  {"front": "What embedding models does Ollama support?", "back": "nomic-embed-text (137M params, fast) and mxbai-embed-large (335M params, more accurate) for document search and RAG"}
]' />

</div>