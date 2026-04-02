---
title: "Meet Claude"
course: "claude-mastery"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-mastery/">Claude Mastery</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Meet Claude</h1>
  <p class="sub">Who Claude is, how it thinks, the model lineup, pricing, and your first API call</p>
</div>

<div class="content">

<div class="card">
<h2>Who Is Claude?</h2>
<p>Claude is an AI assistant made by <strong style="color:#e5e5e5">Anthropic</strong> — a company founded in 2021 by former OpenAI researchers who believed AI safety should be a first-class engineering priority, not an afterthought. Where most AI labs optimize for impressive demos, Anthropic optimizes for models you can actually trust.</p>

<p>The philosophy behind Claude is called <strong style="color:#e5e5e5">Constitutional AI</strong>. Instead of training a model purely on human preference ratings (where annotators might reward confident-sounding wrong answers), Anthropic gave Claude a set of explicit principles — like a constitution — and trained it to <em>reason against those principles</em>. The model evaluates its own outputs: "Does this response follow the principles? If not, how should I revise it?" This self-evaluation loop runs thousands of times during training, shaping how Claude thinks — not just what it says.</p>

<p>The practical result is an AI that behaves differently from its competitors in three specific ways: it admits uncertainty instead of fabricating answers, it pushes back when asked to do something harmful instead of finding loopholes, and it maintains consistent reasoning across long, complex conversations instead of losing coherence. These aren't marketing claims — they're measurable properties that show up in benchmarks and real-world use.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">🏛️</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Constitutional AI</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Trained with explicit values and self-evaluation, not just human thumbs-up/down</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">🔬</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Safety-First Research</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Anthropic publishes alignment research openly and built the industry's first Responsible Scaling Policy</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">💬</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Reasoning-Heavy</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Extended thinking mode lets Claude reason through hard problems step by step before answering</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Constitutional AI — How It Actually Works</h2>
<p>Most AI models are trained with <strong>RLHF</strong> (Reinforcement Learning from Human Feedback) — humans rate outputs as good or bad, and the model learns to produce highly-rated responses. This works, but it has a flaw: it optimizes for <em>what sounds right to a human rater</em>, which is not the same as <em>what is actually right</em>. A confident wrong answer often scores higher than an honest "I'm not sure."</p>

<p>Constitutional AI adds a layer. After the initial training, Claude is given a set of principles (the "constitution") and asked to critique its own outputs against those principles. Here is a simplified version of the loop:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Simplified Constitutional AI training loop</span>
<span style="color:#71717a"># (This is conceptual — actual training uses billions of examples)</span>

<span style="color:#c084fc">principles</span> = [
    <span style="color:#fbbf24">"Choose the response that is most helpful to the human."</span>,
    <span style="color:#fbbf24">"Choose the response that is most honest and truthful."</span>,
    <span style="color:#fbbf24">"Choose the response that is least likely to cause harm."</span>,
    <span style="color:#fbbf24">"If uncertain, acknowledge the uncertainty rather than guessing."</span>,
    <span style="color:#fbbf24">"Do not help with illegal or dangerous activities."</span>,
]

<span style="color:#c084fc">for</span> prompt <span style="color:#c084fc">in</span> training_data:
    <span style="color:#71717a"># Step 1: Generate initial response</span>
    response = model.generate(prompt)

    <span style="color:#71717a"># Step 2: Self-critique against principles</span>
    critique = model.evaluate(response, principles)
    <span style="color:#71717a"># "This response sounds confident but I'm not actually sure</span>
    <span style="color:#71717a">#  about the third claim. Principle 4 says I should</span>
    <span style="color:#71717a">#  acknowledge uncertainty."</span>

    <span style="color:#71717a"># Step 3: Revise based on critique</span>
    revised = model.revise(response, critique)
    <span style="color:#71717a"># The revised response now says "I believe X and Y,</span>
    <span style="color:#71717a">#  but I'm not certain about Z — you may want to verify."</span>

    <span style="color:#71717a"># Step 4: Train on the revised (better) response</span>
    model.learn(prompt, revised)</code></pre>
</div>

<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">This self-critique loop runs during training, not during your conversations. By the time you use Claude, these principles are baked into the model's weights. The result: Claude's default behavior is to be honest, helpful, and harmless — without needing to be told.</p>
</div>

<div class="card">
<h2>Claude vs. ChatGPT vs. Gemini</h2>
<p>All three are powerful. But they are built with different priorities, trained with different methods, and optimized for different outcomes. Understanding the differences helps you choose the right tool for each job — or use them in combination.</p>
<div class="compare-grid">
<div class="compare-row">
<div class="compare-col-head claude">Claude (Anthropic)</div>
<div class="compare-col-head other">ChatGPT (OpenAI) / Gemini (Google)</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">When it doesn't know something</div>
<div class="compare-cell claude">Says "I'm not sure" — and means it. Constitutional AI explicitly rewards honest uncertainty over confident guessing.</div>
<div class="compare-cell other">More likely to fill the gap with a confident-sounding answer. RLHF rewards answers that sound helpful.</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Complex reasoning tasks</div>
<div class="compare-cell claude">Extended thinking mode lets it reason for minutes before answering. Strong at multi-step logic, code, and analysis.</div>
<div class="compare-cell other">GPT-4o and Gemini are strong reasoners too. o3 has chain-of-thought. Gemini excels at multimodal reasoning.</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">If you push it to agree with something wrong</div>
<div class="compare-cell claude">Holds its ground, explains why. Trained to be honest even when disagreeing with the user is uncomfortable.</div>
<div class="compare-cell other">More likely to accommodate the user's framing. Sycophancy is a known RLHF failure mode.</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Long documents and context</div>
<div class="compare-cell claude">Up to 1M tokens with Opus 4.6. Strong "needle in a haystack" retrieval across the full window.</div>
<div class="compare-cell other">Gemini 2.5 Pro has 1M tokens too. GPT-4o caps at 128K. Context quality varies across all providers.</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Coding</div>
<div class="compare-cell claude">Claude Code is Anthropic's CLI that writes, tests, and commits code. SWE-bench leader. Excels at large codebases.</div>
<div class="compare-cell other">GitHub Copilot (GPT). Cursor uses multiple models. All are strong. Claude leads on agentic coding tasks.</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Ecosystem</div>
<div class="compare-cell claude">Smaller plugin ecosystem. MCP (Model Context Protocol) is the open standard for tool integration.</div>
<div class="compare-cell other">ChatGPT has the largest plugin ecosystem. Gemini integrates deeply with Google Workspace.</div>
</div>
</div>
<p style="margin-top:1rem;font-size:.85rem">None of this makes Claude universally "better." The honest answer: <strong style="color:#e5e5e5">use the right model for the right job.</strong> Claude's edge is trustworthiness under pressure, long-context fidelity, and agentic coding. ChatGPT has ecosystem breadth. Gemini has Google integration. Many teams use all three.</p>
</div>

<div class="card">
<h2>The Claude Model Lineup (2025)</h2>
<p>Anthropic offers Claude in three tiers. Think of it like choosing tools — more power isn't always better if you're paying for it on every request. The key is matching model capability to task complexity.</p>
<div class="model-grid">
<div class="model-card opus">
<div class="model-tier">Top Tier</div>
<div class="model-name">Claude Opus 4.6</div>
<div class="model-desc">The most capable model. Exceptional at nuanced reasoning, long-form analysis, research synthesis, complex multi-step tasks, and agentic coding. Extended thinking for hard problems. Up to 1M token context window.</div>
<div class="model-use">Deep work, analysis, agents</div>
<div style="margin-top:.5rem;font-size:.75rem;color:#71717a;font-family:'JetBrains Mono',monospace">ID: claude-opus-4-6 · $15/$75 per 1M tokens</div>
</div>
<div class="model-card sonnet">
<div class="model-tier">Balanced</div>
<div class="model-name">Claude Sonnet 4.6</div>
<div class="model-desc">The sweet spot. Strong reasoning, fast enough for real-time use, cost-effective at scale. This is what most production applications use — coding, writing, strategy, business tasks. Extended thinking available.</div>
<div class="model-use">Everyday powerhouse</div>
<div style="margin-top:.5rem;font-size:.75rem;color:#71717a;font-family:'JetBrains Mono',monospace">ID: claude-sonnet-4-6 · $3/$15 per 1M tokens</div>
</div>
<div class="model-card haiku">
<div class="model-tier">Lightweight</div>
<div class="model-name">Claude Haiku 4.5</div>
<div class="model-desc">The smallest, fastest, cheapest model. Surprisingly capable for its size — great for classification, summarization, simple Q&A, and high-volume pipelines where speed and cost matter most.</div>
<div class="model-use">Speed &amp; volume tasks</div>
<div style="margin-top:.5rem;font-size:.75rem;color:#71717a;font-family:'JetBrains Mono',monospace">ID: claude-haiku-4-5-20251001 · $0.80/$4 per 1M tokens</div>
</div>
</div>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Pricing decoded:</strong> The two numbers (e.g., $3/$15) mean <strong>input/output per million tokens</strong>. Input is what you send to Claude (your prompt, system message, context). Output is what Claude generates back. Output is always more expensive because generation is computationally harder. A million tokens is roughly 750,000 words — most conversations cost fractions of a cent.
</div>

<p style="font-size:.85rem;margin-top:1rem">In Claude.ai (the web interface), Sonnet is the default. You can switch to Opus for harder tasks. Via the API, you specify exactly which model to use — which is what we'll learn next.</p>
</div>

<div class="card">
<h2>The HHH Framework</h2>
<p>Everything about Claude traces back to three words. Anthropic calls it the HHH framework — and it is not just marketing. These properties are baked into how the model is trained and evaluated. Every response Claude generates is implicitly measured against all three.</p>
<div class="three-h">
<div class="h-pill helpful">
<div class="h-pill-icon">🤝</div>
<div class="h-pill-title">Helpful</div>
<div class="h-pill-desc">Actually useful. Not hedged into uselessness. Claude tries to give you what you need, not a watered-down non-answer. If you ask for code, you get working code with explanations — not a disclaimer that you should hire a developer.</div>
</div>
<div class="h-pill harmless">
<div class="h-pill-icon">🛡️</div>
<div class="h-pill-title">Harmless</div>
<div class="h-pill-desc">Refuses to assist with things that cause real harm. Not by default-blocking everything — by reasoning through context. Claude can discuss chemistry, security, and medicine when the context is educational or professional. It declines when the intent is clearly harmful.</div>
</div>
<div class="h-pill honest">
<div class="h-pill-icon">🔍</div>
<div class="h-pill-title">Honest</div>
<div class="h-pill-desc">Won't pretend to know things it doesn't. Won't flatter you into a bad decision. Won't hallucinate and serve it with confidence. When Claude says "I'm not sure" — it genuinely means it has low confidence, and that admission is more valuable than a guess.</div>
</div>
</div>

<p style="margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:1.7">These three properties are in tension with each other. A maximally helpful model might give dangerous advice. A maximally harmless model might refuse everything. A maximally honest model might be blunt to the point of unhelpfulness. The art of Constitutional AI is training Claude to balance all three simultaneously — which is why it sometimes says "I can help with that, but here's an important caveat" instead of blindly complying or blindly refusing.</p>
</div>

<div class="card">
<h2>Your First Claude API Call</h2>
<p>You do not need the API to use Claude — Claude.ai works with no setup. But the API is where the real power is: you control the model, the system prompt, the temperature, the tools, and every parameter. Here is the simplest possible API call using curl and then Python:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">curl — raw API call</div>
<pre style="margin:0;color:#e5e5e5"><code>curl https://api.anthropic.com/v1/messages \
  -H <span style="color:#fbbf24">"x-api-key: $ANTHROPIC_API_KEY"</span> \
  -H <span style="color:#fbbf24">"anthropic-version: 2023-06-01"</span> \
  -H <span style="color:#fbbf24">"content-type: application/json"</span> \
  -d <span style="color:#fbbf24">'{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Explain what an API is in one paragraph."}
    ]
  }'</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — using the Anthropic SDK</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

<span style="color:#71717a"># pip install anthropic</span>
<span style="color:#71717a"># export ANTHROPIC_API_KEY="sk-ant-..."</span>

client = anthropic.Anthropic()  <span style="color:#71717a"># reads API key from environment</span>

message = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">1024</span>,
    messages=[
        {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Explain what an API is in one paragraph."</span>}
    ]
)

<span style="color:#34d399">print</span>(message.content[<span style="color:#fb923c">0</span>].text)
<span style="color:#71717a"># "An API (Application Programming Interface) is a set of rules</span>
<span style="color:#71717a">#  and protocols that allows different software applications to</span>
<span style="color:#71717a">#  communicate with each other..."</span></code></pre>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Key parameters</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>model</strong> — which Claude model to use (see tier table above)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>max_tokens</strong> — maximum output length (required)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>messages</strong> — the conversation (user and assistant turns)</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.85rem">What you'll add later</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>system</strong> — system prompt (Lesson 4)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>temperature</strong> — creativity dial (Lesson 3)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>tools</strong> — function calling (Lesson 8)</p>
</div>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7">This is the foundation. Every feature in this course — system prompts, temperature, tool use, agents — builds on this exact API call. You add parameters, but the shape stays the same: choose a model, send messages, get a response.</p>
</div>

<div class="card">
<h2>How to Get Your API Key</h2>
<p>To make API calls, you need a key from the Anthropic Console. Here is the process:</p>
<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">1</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Go to <strong style="color:#e5e5e5">console.anthropic.com</strong> and create an account (or sign in)</div>
</div>
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">2</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Navigate to <strong style="color:#e5e5e5">Settings → API Keys</strong> and click "Create Key"</div>
</div>
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">3</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Copy the key (starts with <code style="color:#fb923c">sk-ant-</code>) — you will only see it once</div>
</div>
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">4</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Set it as an environment variable: <code style="color:#fb923c">export ANTHROPIC_API_KEY="sk-ant-..."</code></div>
</div>
</div>

<div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1rem;margin-top:1rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#fb923c">Security:</strong> Never hardcode your API key in source code. Never commit it to Git. Use environment variables or a secrets manager. If you accidentally expose a key, rotate it immediately in the Console.
</div>
</div>

<div class="card">
<h2>Choosing the Right Model — A Decision Framework</h2>
<p>The most common beginner mistake is defaulting to the most powerful model for everything. That is like driving a semi truck to get groceries. Here is a practical framework:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
<strong style="color:#f472b6;font-size:.88rem">Use Opus when...</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The task requires sustained reasoning over long inputs (100K+ tokens), the cost of a wrong answer is high (legal analysis, medical triage, financial modeling), you need an AI agent that runs autonomously for hours, or the problem genuinely requires the smartest model available.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.88rem">Use Sonnet when...</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">You need a balance of quality and speed (most coding, writing, analysis, conversation). Sonnet handles 90% of real-world tasks at 1/5 the cost of Opus. Start here unless you have a reason not to.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">Use Haiku when...</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Speed and cost dominate. Classification (is this email spam?), extraction (pull the date from this invoice), summarization (condense this to 3 bullets), or any pipeline processing thousands of items per hour.</p>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — smart model routing</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">choose_model</span>(task_type: str, input_length: int) -> str:
    <span style="color:#fb923c">"""Route to the right Claude model based on the task."""</span>
    <span style="color:#c084fc">if</span> task_type <span style="color:#c084fc">in</span> (<span style="color:#fbbf24">"classification"</span>, <span style="color:#fbbf24">"extraction"</span>, <span style="color:#fbbf24">"summarization"</span>):
        <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"claude-haiku-4-5-20251001"</span>  <span style="color:#71717a"># fast + cheap</span>
    <span style="color:#c084fc">elif</span> input_length > <span style="color:#fb923c">100_000</span> <span style="color:#c084fc">or</span> task_type <span style="color:#c084fc">in</span> (<span style="color:#fbbf24">"legal"</span>, <span style="color:#fbbf24">"agent"</span>, <span style="color:#fbbf24">"research"</span>):
        <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"claude-opus-4-6"</span>          <span style="color:#71717a"># maximum capability</span>
    <span style="color:#c084fc">else</span>:
        <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"claude-sonnet-4-6"</span>         <span style="color:#71717a"># default sweet spot</span>

<span style="color:#71717a"># Examples:</span>
choose_model(<span style="color:#fbbf24">"classification"</span>, <span style="color:#fb923c">50</span>)     <span style="color:#71717a"># → haiku (fast, cheap)</span>
choose_model(<span style="color:#fbbf24">"coding"</span>, <span style="color:#fb923c">2000</span>)            <span style="color:#71717a"># → sonnet (balanced)</span>
choose_model(<span style="color:#fbbf24">"legal"</span>, <span style="color:#fb923c">150000</span>)          <span style="color:#71717a"># → opus (maximum quality)</span></code></pre>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Claude Essentials","cards":[{"front":"Claude Opus 4.6","back":"Top tier — best for deep analysis, long-form research, complex multi-step reasoning, and autonomous agents. Model ID: claude-opus-4-6. Pricing: $15/$75 per 1M tokens (input/output). Up to 1M token context."},{"front":"Claude Sonnet 4.6","back":"Balanced tier — the everyday powerhouse. Strong reasoning, fast enough for real-time use, cost-effective at scale. Model ID: claude-sonnet-4-6. Pricing: $3/$15 per 1M tokens. Start here for 90% of tasks."},{"front":"Claude Haiku 4.5","back":"Lightweight tier — fastest and cheapest. Best for classification, summarization, extraction, and high-volume pipelines. Model ID: claude-haiku-4-5-20251001. Pricing: $0.80/$4 per 1M tokens."},{"front":"Constitutional AI","back":"Anthropic\u0027s training approach. Claude is given explicit principles and trained to critique its own outputs against them. This self-evaluation loop shapes values, not just outputs — producing a model that is honest by default."},{"front":"HHH Framework","back":"Helpful, Harmless, Honest — the three core properties baked into Claude\u0027s training. They are in tension with each other (maximizing one can hurt another), and Constitutional AI trains Claude to balance all three simultaneously."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Meet Claude — Mastery Check","questions":[{"q":"You are building a chatbot that auto-tags 10,000 customer support tickets per day by category. Speed and cost matter more than nuance. Which model?","options":["Claude Opus 4.6","Claude Sonnet 4.6","Claude Haiku 4.5","Any model works equally"],"correct":2,"explanation":"High-volume, repetitive classification is exactly where Haiku shines. At $0.80 per million input tokens, processing 10,000 tickets per day would cost pennies. Opus would give you the same classification accuracy at 19x the price."},{"q":"You need to analyze 200 pages of contract language, identify unusual clauses, and write a risk summary for your legal team. Which model?","options":["Claude Opus 4.6","Claude Sonnet 4.6","Claude Haiku 4.5","Temperature matters more than model choice"],"correct":0,"explanation":"200 pages is ~60K tokens of dense legal text requiring sustained attention, nuanced judgment, and synthesis. Opus earns its cost here — the consequence of missing an unusual clause in a legal review is far higher than the price difference between models."},{"q":"You are writing product descriptions for 50 items in your Shopify store — clear, punchy, conversion-focused copy. Which model?","options":["Claude Opus 4.6","Claude Sonnet 4.6","Claude Haiku 4.5","Use all three in sequence"],"correct":1,"explanation":"Sonnet is the perfect fit. Writing 50 product descriptions requires creativity and quality (rules out Haiku) but not the sustained deep reasoning that justifies Opus pricing. Sonnet delivers strong copy at a reasonable cost."},{"q":"What does Constitutional AI mean in the context of Claude?","options":["Claude follows US constitutional law","Claude was trained with a set of explicit guiding principles and self-critique","Claude generates legal documents","Claude refuses all controversial topics"],"correct":1,"explanation":"Constitutional AI means Anthropic gave Claude a set of principles and trained it to critique its own outputs against those principles. The model learns to revise responses that violate the principles — shaping how it thinks, not just what it says. It has nothing to do with US law."},{"q":"What is the correct API call format for Claude?","options":["POST to api.openai.com with an Authorization header","POST to api.anthropic.com/v1/messages with an x-api-key header","GET to claude.ai/api with a token parameter","POST to anthropic.com/chat with a Bearer token"],"correct":1,"explanation":"Claude uses POST requests to api.anthropic.com/v1/messages with the API key passed in the x-api-key header. This is different from OpenAI (which uses Authorization: Bearer) — a common source of confusion when switching between providers."}]}'></div>


</div>

<div class="progress-footer">
<span class="progress-label">Lesson 1 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
