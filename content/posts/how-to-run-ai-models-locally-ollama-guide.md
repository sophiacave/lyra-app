---
title: "How to Run AI Models Locally with Ollama (Complete 2026 Guide)"
date: 2026-05-03
author: Sophie Cave
description: "Run powerful AI models on your own machine — no API keys, no cloud costs, no data leaving your laptop. Step-by-step Ollama setup for Mac, Linux, and Windows."
excerpt: "Run powerful AI models on your own machine — no API keys, no cloud costs, no data leaving your laptop. Step-by-step Ollama setup for Mac, Linux, and Windows."
tags: [ai-tools, local-ai, ollama, privacy, tutorial]
faq:
  - q: "Can I run AI models locally on my laptop?"
    a: "Yes. Tools like Ollama let you run open-source models (Llama 3, Mistral, Gemma, Phi-3) directly on your Mac, Linux, or Windows machine. You need at least 8GB of RAM for small models and 16-32GB for larger ones."
  - q: "Is Ollama free?"
    a: "Yes. Ollama is completely free and open source. You download it once and run models locally with no API keys, no subscriptions, and no usage limits. The only cost is your hardware."
  - q: "What are the best local AI models in 2026?"
    a: "The strongest local models in 2026 are Llama 3.3 70B (general purpose), Mistral Large (multilingual), Gemma 3 27B (efficient), DeepSeek-R1 (reasoning), and Phi-4 (small but capable). For most people, Llama 3.3 8B is the best starting point — fast and surprisingly good."
  - q: "How much RAM do I need to run AI locally?"
    a: "8GB RAM runs small models (3B-8B parameters) comfortably. 16GB handles mid-size models (14B-27B). 32GB+ opens up large models (70B). Apple Silicon Macs are especially good because they share memory between CPU and GPU."
  - q: "Is local AI as good as ChatGPT or Claude?"
    a: "For most tasks, no — cloud models like Claude Opus 4.6 and GPT-4o are still more capable. But local models are good enough for many workflows: drafting, summarization, code completion, data extraction, and brainstorming. The real advantage is privacy, zero cost per query, and offline access."
---

# How to Run AI Models Locally with Ollama

Every query you send to ChatGPT or Claude goes through someone else's servers. Your prompts, your data, your business logic — all of it leaves your machine.

For most work, that trade-off is fine. Cloud models are powerful and the providers are trustworthy. But there are legitimate reasons to run AI locally:

- **Privacy**: Sensitive data never leaves your machine
- **Cost**: Zero per-query pricing. Run 10,000 prompts a day for free
- **Offline access**: Works on a plane, in a cabin, during an outage
- **Speed for small tasks**: No network latency. Sub-second responses for simple queries
- **Learning**: Understand how models actually work by running them yourself

We run 6 local models alongside cloud APIs at Like One. Here is exactly how to set it up.

## What Is Ollama?

Ollama is an open-source tool that makes running large language models locally as simple as running a Docker container. One command to install, one command to pull a model, one command to chat.

No Python environments. No dependency hell. No GPU drivers to configure (on Mac).

It supports Mac (Apple Silicon and Intel), Linux, and Windows. Apple Silicon Macs are the sweet spot — unified memory means your GPU and CPU share the same RAM pool, so even a MacBook Air can run capable models.

## Step 1: Install Ollama

### Mac
```bash
brew install ollama
```

Or download from [ollama.com](https://ollama.com) and drag to Applications.

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows
Download the installer from [ollama.com](https://ollama.com). Run it. Done.

After installation, start the Ollama server:
```bash
ollama serve
```

On Mac, the desktop app starts the server automatically.

## Step 2: Pull Your First Model

```bash
ollama pull llama3.3
```

This downloads Meta's Llama 3.3 8B model (~4.7GB). It is the best starting point — fast, capable, and runs well on 8GB RAM.

Other models worth trying:

| Model | Size | Best For | Min RAM |
|-------|------|----------|---------|
| `llama3.3` | 4.7GB | General purpose, chat | 8GB |
| `mistral` | 4.1GB | Multilingual, reasoning | 8GB |
| `gemma3:12b` | 8.1GB | Efficient, instruction-following | 16GB |
| `phi4` | 2.2GB | Small tasks, edge devices | 4GB |
| `deepseek-r1:14b` | 9.0GB | Complex reasoning, math | 16GB |
| `llama3.3:70b` | 40GB | Near-cloud quality | 48GB+ |

Pull any model the same way:
```bash
ollama pull mistral
ollama pull phi4
```

## Step 3: Start Chatting

```bash
ollama run llama3.3
```

That is it. You are now running a language model on your own hardware. Type a prompt, get a response. No API key. No internet required.

```
>>> Explain the difference between REST and GraphQL in 3 sentences.

REST uses fixed endpoints where each URL returns a predetermined data structure.
GraphQL uses a single endpoint where the client specifies exactly which fields
it needs, reducing over-fetching. REST is simpler to cache and debug; GraphQL
is more flexible for complex, nested data requirements.
```

Press `Ctrl+D` to exit.

## Step 4: Use the API

Ollama runs a local API server on `http://localhost:11434`. This means any tool that speaks HTTP can talk to your local models.

### Basic API call
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.3",
  "prompt": "Write a subject line for a cold email about AI consulting",
  "stream": false
}'
```

### Python integration
```python
import requests

response = requests.post("http://localhost:11434/api/generate", json={
    "model": "llama3.3",
    "prompt": "Summarize this contract clause: ...",
    "stream": False
})

print(response.json()["response"])
```

### OpenAI-compatible endpoint
Ollama also exposes an OpenAI-compatible API at `/v1/chat/completions`. This means you can point any tool that works with OpenAI's API at your local models:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="llama3.3",
    messages=[{"role": "user", "content": "Draft a meeting agenda for a product review"}]
)

print(response.choices[0].message.content)
```

This compatibility is powerful. Tools like Continue (VS Code AI), Open WebUI, and dozens of others work out of the box with Ollama.

## Step 5: Build Real Workflows

Local models shine in specific workflows where privacy matters or volume makes cloud costs unreasonable.

### Workflow 1: Private document summarization
```bash
cat contract.txt | ollama run llama3.3 "Summarize the key obligations and deadlines in this contract"
```

### Workflow 2: Batch processing
```bash
for file in reports/*.txt; do
  echo "=== $file ==="
  cat "$file" | ollama run llama3.3 "Extract the three most important metrics from this report"
done
```

### Workflow 3: Local RAG (retrieval-augmented generation)
Combine Ollama with a vector database like ChromaDB to build a private knowledge base:

```python
import chromadb
import requests

# Store documents as embeddings
chroma = chromadb.Client()
collection = chroma.create_collection("docs")

# Add your documents
collection.add(
    documents=["Your private document text here..."],
    ids=["doc1"]
)

# Query similar documents
results = collection.query(query_texts=["What is our refund policy?"], n_results=3)

# Send context + question to local model
context = "\n".join(results["documents"][0])
response = requests.post("http://localhost:11434/api/generate", json={
    "model": "llama3.3",
    "prompt": f"Based on this context:\n{context}\n\nAnswer: What is the refund policy?",
    "stream": False
})
```

Your data never leaves your machine. No cloud. No third-party access. Full control.

## When Local AI Beats Cloud AI

| Scenario | Local Wins | Cloud Wins |
|----------|-----------|------------|
| Sensitive data (legal, medical, financial) | ✓ | |
| High-volume batch processing | ✓ | |
| Offline or air-gapped environments | ✓ | |
| Simple drafting and brainstorming | ✓ | |
| Complex reasoning and analysis | | ✓ |
| Latest knowledge and training data | | ✓ |
| Multi-step agentic workflows | | ✓ |
| Maximum output quality | | ✓ |

The smart approach is hybrid. Use local models for high-volume, privacy-sensitive, or simple tasks. Use Claude or GPT for the hard stuff.

## Hardware Reality Check

**Apple Silicon Mac (M1/M2/M3/M4)**: Best local AI hardware dollar-for-dollar. Unified memory means the GPU uses your full RAM. A MacBook Pro with 18GB runs 8B-14B models smoothly. 36GB+ handles 70B models.

**Windows/Linux with NVIDIA GPU**: Great performance with CUDA acceleration. An RTX 4060 (8GB VRAM) handles 8B models. RTX 4090 (24GB VRAM) handles 70B quantized.

**CPU-only**: Works but slow. Fine for quick queries, not for production workloads.

**Minimum viable setup**: Any machine with 8GB RAM and a modern processor. That includes most laptops made after 2020.

## Common Mistakes

**Running models too large for your RAM.** If a model needs 40GB and you have 16GB, it will swap to disk and crawl. Stick to models that fit in ~80% of your available memory.

**Expecting cloud-model quality.** An 8B local model is not Claude Opus. It is closer to a fast, private first draft generator. Set expectations accordingly.

**Not using quantization.** Most Ollama models are already quantized (Q4_K_M by default), which reduces size by 4x with minimal quality loss. If you need higher quality, pull the Q8 or FP16 variants.

**Ignoring the system prompt.** Local models respond much better with a clear system prompt:
```bash
ollama run llama3.3 --system "You are a concise business analyst. Answer in bullet points."
```

## Actionable Takeaway

Install Ollama. Pull `llama3.3`. Run one real task with it — summarize a document, draft an email, extract data from a CSV. You will immediately understand where local AI fits in your workflow and where cloud models are still worth the cost.

The goal is not to replace cloud AI. The goal is to stop sending every single prompt to someone else's server when you do not have to.

---

*We use Ollama alongside Claude at Like One for privacy-sensitive workflows, batch processing, and rapid prototyping. The hybrid approach — local for volume, cloud for complexity — is the most cost-effective way to run AI in 2026.*
