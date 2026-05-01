---
title: "Hybrid Local + Cloud Systems"
course: "local-ai-privacy"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/local-ai-privacy/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Hybrid Local <span class="accent">+ Cloud Systems.</span></h1>
  <p class="sub">Get the best of both worlds -- local privacy for sensitive work, cloud power for tasks that need frontier intelligence.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to design a hybrid routing system that sends tasks to the right backend</li>
    <li>Building a unified API that abstracts local and cloud models</li>
    <li>Cost optimization strategies using local models as the default tier</li>
    <li>Failover patterns for reliability across local and cloud</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Case for Hybrid</h2>
<p>Pure local has limitations: smaller context windows, weaker reasoning on complex tasks, no vision capabilities on most models. Pure cloud has risks: privacy exposure, ongoing costs, vendor dependency. The answer for most serious users is hybrid -- and the key is building a system that routes intelligently.</p>
<p>The hybrid principle: <strong>default local, escalate to cloud.</strong> Every request starts at the local model. Only when the task demonstrably requires frontier capability (or the user explicitly requests it) does the request go to a cloud API. This minimizes cost, maximizes privacy, and still gives you access to the best models when you need them.</p>
</div>

<div class="lesson-section">
<h2>Building a Unified API Gateway</h2>
<p>A unified API gateway gives your applications one endpoint that routes to the right backend. Every tool in your stack talks to the gateway; the gateway decides whether to use Ollama or a cloud API:</p>

<div class="demo-container">
<h4>Simple Python Gateway</h4>
<pre><code>import requests

ROUTES = {
    "local": "http://localhost:11434/v1/chat/completions",
    "cloud": "https://api.anthropic.com/v1/messages",
}

def route_request(messages, tier="local", model=None):
    if tier == "local":
        model = model or "qwen2.5:14b"
        r = requests.post(ROUTES["local"], json={
            "model": model,
            "messages": messages
        })
        return r.json()["choices"][0]["message"]["content"]

    elif tier == "cloud":
        model = model or "claude-sonnet-4-20250514"
        headers = {
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "content-type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        r = requests.post(ROUTES["cloud"], headers=headers,
            json={
                "model": model, "max_tokens": 4096,
                "messages": messages
            })
        return r.json()["content"][0]["text"]

# Usage: default local
answer = route_request(messages, tier="local")

# Escalate to cloud for complex reasoning
answer = route_request(messages, tier="cloud")</code></pre>
</div>

<p>Ollama's OpenAI-compatible API (<code>/v1/chat/completions</code>) means most tools designed for OpenAI work with local models by changing the base URL. Your gateway exploits this compatibility.</p>
</div>

<div class="lesson-section">
<h2>Intelligent Routing Rules</h2>
<p>Manual tier selection works, but automatic routing is more powerful. Build rules based on:</p>
<p><strong>Data sensitivity:</strong> If the input contains Tier 3+ data (detected by pattern matching for SSNs, medical terms, financial account numbers), force local routing. Never send sensitive data to cloud, regardless of task complexity.</p>
<p><strong>Task complexity:</strong> Simple tasks (summarization, extraction, formatting) route local. Complex tasks (multi-step reasoning, creative strategy, code architecture) can route to cloud if the data isn't sensitive.</p>
<p><strong>Token count:</strong> If the prompt exceeds the local model's effective context window (typically 4K-16K tokens for quality output), and the data is non-sensitive, route to a cloud model with 128K+ context.</p>
<p><strong>Cost thresholds:</strong> Set a daily or monthly cloud budget. When the budget is exhausted, all requests route local regardless of complexity. This prevents runaway cloud costs.</p>

<div class="tip-box">
<strong>The sensitivity detector:</strong> Build a simple regex-based scanner that checks inputs for patterns like SSNs (XXX-XX-XXXX), credit card numbers, email addresses, phone numbers, and medical terms. If any match, force local routing. This is a safety net, not a replacement for proper data classification.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Cost Optimization</h2>
<p>Hybrid architecture can dramatically reduce cloud AI costs while maintaining quality where it matters:</p>
<p><strong>The 90/10 pattern:</strong> In most workflows, 90% of AI tasks are routine (drafting, summarizing, formatting, Q&A against known documents). These run perfectly on local models. The remaining 10% -- complex reasoning, frontier creativity, edge cases -- justify cloud costs. Result: 90% cost reduction vs. all-cloud.</p>
<p><strong>Local preprocessing:</strong> Use local models to preprocess before sending to cloud. Extract key information from a 50-page document locally, then send only the 500-word summary to Claude for deep analysis. You pay for 500 tokens instead of 50,000.</p>
<p><strong>Caching:</strong> Cache cloud API responses for repeated queries. If the same question comes up twice, return the cached answer instead of paying for a second API call. Simple key-value caching (even in SQLite) works.</p>
<p><strong>Batch scheduling:</strong> Accumulate non-urgent cloud tasks and process them in batches during off-peak hours (if the provider offers volume discounts) or during promotional credit periods.</p>

<div class="callout">
<strong>Real cost example:</strong> A developer using Claude API for all coding tasks: ~$150/month. Same developer with hybrid routing (Qwen 2.5 Coder 14B locally for 90% of tasks, Claude for complex architecture questions): ~$15/month. Same quality for daily work. Better privacy. 90% savings.
</div>
</div>

<div class="lesson-section">
<h2>Failover and Reliability</h2>
<p>A robust hybrid system handles failures gracefully:</p>
<p><strong>Cloud-to-local failover:</strong> If the cloud API returns an error (rate limit, outage, network issue), automatically retry with the local model. The answer might be lower quality, but the system doesn't stop.</p>
<p><strong>Local-to-cloud failover:</strong> If Ollama crashes or the local model produces gibberish (detectable by output validation), escalate to cloud. Log the failure for debugging.</p>
<p><strong>Health checks:</strong> Periodically ping both endpoints. If either is unhealthy, route all traffic to the healthy one.</p>
<pre><code>def health_check():
    try:
        r = requests.get("http://localhost:11434/api/tags",
                         timeout=2)
        local_healthy = r.status_code == 200
    except:
        local_healthy = False

    try:
        # Quick cloud API check
        r = requests.get("https://api.anthropic.com/v1/models",
                         headers=headers, timeout=5)
        cloud_healthy = r.status_code == 200
    except:
        cloud_healthy = False

    return {"local": local_healthy, "cloud": cloud_healthy}</code></pre>
<p><strong>Graceful degradation:</strong> When both systems are available, use the best one for each task. When only one is available, use it for everything. When neither is available (rare), queue requests and process when service returns.</p>
</div>

<QuizMC
  question="What is the core principle of hybrid AI routing?"
  options='["Always use cloud for important tasks", "Default local, escalate to cloud only when needed", "Split tasks 50/50 between local and cloud", "Use cloud for speed and local for accuracy"]'
  answer="1"
/>

<QuizMC
  question="In the 90/10 pattern, what percentage of AI tasks typically run well on local models?"
  options='["50%", "70%", "80%", "90%"]'
  answer="3"
/>

<FlashDeck cards='[
  {"front": "What are the four intelligent routing criteria?", "back": "Data sensitivity (Tier 3+ forces local), Task complexity (simple local, complex cloud), Token count (exceeds local context), Cost thresholds (budget exhausted = force local)"},
  {"front": "What is the 90/10 pattern for cost optimization?", "back": "90% of tasks are routine and run locally ($0). 10% require frontier capability and use cloud API. Result: 90% cost reduction vs all-cloud."},
  {"front": "What is local preprocessing?", "back": "Use local models to extract/summarize large documents before sending only the condensed output to cloud. Pay for 500 tokens instead of 50,000."},
  {"front": "What are the three failover patterns?", "back": "Cloud-to-local (API error, retry locally), Local-to-cloud (Ollama crash, escalate), Health checks (periodic pinging, route to healthy endpoint)"},
  {"front": "Why does Ollama's OpenAI-compatible API matter for hybrid systems?", "back": "Tools built for OpenAI work with Ollama by changing the base URL to localhost:11434/v1. This makes the gateway simple -- same request format, different endpoints."}
]' />

</div>