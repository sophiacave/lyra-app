---
title: "Ollama: Your Local AI Lab"
course: "local-ai-privacy"
order: 2
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/local-ai-privacy/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Ollama: Your <span class="accent">Local AI Lab.</span></h1>
  <p class="sub">Install Ollama, pull your first model, and start running AI on your own machine in under 10 minutes.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to install and configure Ollama on macOS, Linux, and Windows</li>
    <li>Pulling, running, and managing models from the command line</li>
    <li>Using the Ollama API for programmatic access</li>
    <li>Essential Ollama commands every user should know</li>
  </ul>
</div>

<div class="lesson-section">
<h2>What Is Ollama?</h2>
<p>Ollama is the Docker of local AI. It packages large language models into a simple command-line interface -- pull a model, run it, done. No Python environments, no dependency hell, no CUDA driver nightmares. It handles model downloading, quantization selection, memory management, and GPU acceleration automatically.</p>
<p>Ollama supports hundreds of open-source models: Llama 3.1, Mistral, Gemma 2, Qwen 2.5, DeepSeek, Phi-3, and more. It runs on macOS (Apple Silicon and Intel), Linux, and Windows. It exposes a local API on port 11434 that any application can connect to -- making it the foundation for everything we build in this course.</p>
</div>

<div class="lesson-section">
<h2>Installation</h2>
<p><strong>macOS:</strong></p>
<pre><code>curl -fsSL https://ollama.com/install.sh | sh</code></pre>
<p>Or download the .dmg from ollama.com. Both methods install the CLI and the background service. Apple Silicon Macs get automatic GPU acceleration through Metal.</p>

<p><strong>Linux:</strong></p>
<pre><code>curl -fsSL https://ollama.com/install.sh | sh</code></pre>
<p>Supports Ubuntu 20.04+, Debian 11+, Fedora 36+, and most modern distributions. NVIDIA GPU acceleration requires CUDA drivers (installed separately).</p>

<p><strong>Windows:</strong></p>
<p>Download the installer from ollama.com. Requires Windows 10 or later. NVIDIA GPU support included. AMD GPU support is in preview.</p>

<p><strong>Verify installation:</strong></p>
<pre><code>ollama --version</code></pre>
<p>You should see the version number. If not, ensure the Ollama service is running.</p>

<div class="tip-box">
<strong>First-time setup:</strong> Ollama starts a background service automatically. On macOS, you'll see an Ollama icon in your menu bar. On Linux, it runs as a systemd service. The service must be running before you can pull or run models.
</div>
</div>

<div class="lesson-section">
<h2>Your First Model</h2>
<p>Pull and run a model in two commands:</p>
<pre><code>ollama pull llama3.1:8b
ollama run llama3.1:8b</code></pre>
<p>The first command downloads the model (about 4.7GB for the 8B quantized version). The second launches an interactive chat session. Type your prompt, get a response, no API key required.</p>
<p><strong>Recommended starter models by hardware:</strong></p>
<ul>
<li><strong>8GB RAM:</strong> <code>llama3.1:8b</code> or <code>gemma2:2b</code> (fast, lightweight)</li>
<li><strong>16GB RAM:</strong> <code>qwen2.5:14b</code> or <code>mistral:7b</code> (good balance)</li>
<li><strong>32GB RAM:</strong> <code>qwen2.5:32b</code> or <code>deepseek-r1:32b</code> (strong reasoning)</li>
<li><strong>64GB+ RAM:</strong> <code>llama3.1:70b</code> or <code>qwen2.5:72b</code> (near-frontier quality)</li>
</ul>

<div class="demo-container">
<h4>Quick Test Prompts</h4>
<p>Once your model is running, try these to verify it works:</p>
<pre><code>>>> Explain quantum computing in 3 sentences.
>>> Write a Python function that reverses a string.
>>> Summarize the key differences between TCP and UDP.</code></pre>
<p>If you get coherent responses, your local AI lab is operational.</p>
</div>
</div>

<div class="lesson-section">
<h2>Essential Commands</h2>
<p>These are the commands you'll use daily:</p>
<pre><code># List all downloaded models
ollama list

# Pull a specific model
ollama pull mistral:7b

# Run a model interactively
ollama run llama3.1:8b

# Run with a system prompt
ollama run llama3.1:8b "You are a helpful coding assistant."

# Show model details (size, parameters, license)
ollama show llama3.1:8b

# Remove a model to free disk space
ollama rm gemma2:2b

# List running models
ollama ps

# Copy a model (for creating custom variants)
ollama cp llama3.1:8b my-custom-model</code></pre>

<p><strong>Multiline input:</strong> In the interactive session, use triple quotes for long prompts:</p>
<pre><code>>>> """
Analyze the following code for security vulnerabilities:
[paste code here]
"""</code></pre>
</div>

<div class="lesson-section">
<h2>The Ollama API</h2>
<p>Ollama exposes a REST API on <code>localhost:11434</code> that lets any application use your local models. This is what makes Ollama a platform, not just a chat tool.</p>
<pre><code># Generate a completion
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "What is the capital of France?",
  "stream": false
}'

# Chat format (multi-turn conversation)
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.1:8b",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Explain Docker in one paragraph."}
  ],
  "stream": false
}'

# Generate embeddings (for search/RAG)
curl http://localhost:11434/api/embed -d '{
  "model": "nomic-embed-text",
  "input": "This is a document to embed."
}'</code></pre>

<p>The API is OpenAI-compatible, meaning tools built for OpenAI's API often work with Ollama by just changing the base URL to <code>http://localhost:11434/v1</code>.</p>

<div class="callout">
<strong>Security note:</strong> By default, Ollama only listens on localhost. If you need network access (e.g., from another machine), set the environment variable <code>OLLAMA_HOST=0.0.0.0</code>. Only do this on trusted networks -- there's no authentication built in.
</div>
</div>

<QuizMC
  question="What port does the Ollama API run on by default?"
  options='["8080", "3000", "11434", "5000"]'
  answer="2"
/>

<QuizMC
  question="What is the recommended model for a machine with 16GB RAM?"
  options='["llama3.1:70b", "qwen2.5:14b or mistral:7b", "gemma2:2b", "qwen2.5:72b"]'
  answer="1"
/>

<FlashDeck cards='[
  {"front": "What command installs Ollama on macOS or Linux?", "back": "curl -fsSL https://ollama.com/install.sh | sh"},
  {"front": "How do you pull and run a model in Ollama?", "back": "ollama pull llama3.1:8b (downloads model) then ollama run llama3.1:8b (starts interactive chat)"},
  {"front": "How do you list all downloaded models?", "back": "ollama list"},
  {"front": "What makes Ollama's API compatible with existing tools?", "back": "It's OpenAI-compatible -- tools built for OpenAI's API work by changing the base URL to http://localhost:11434/v1"},
  {"front": "What is the security consideration when exposing Ollama to the network?", "back": "Ollama has no built-in authentication. Setting OLLAMA_HOST=0.0.0.0 exposes it to the network -- only do this on trusted networks."},
  {"front": "How do you generate embeddings with Ollama?", "back": "Use the /api/embed endpoint with an embedding model like nomic-embed-text"}
]' />

</div>