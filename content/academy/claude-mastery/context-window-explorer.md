---
title: "Context Window"
course: "claude-mastery"
order: 2
type: "lab"
free: true
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 2 · Lab</div>
<h1>Context Window Explorer</h1>
<p>Understand tokens, context windows, and how to manage Claude's working memory — with real code</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">

<div class="card">
<h2>What Is a Context Window?</h2>
<p>The context window is the total amount of text an AI can "see" at once — including your prompt, system instructions, conversation history, and the response it generates. Think of it as the model's working memory. Everything inside the window is available for reasoning. Everything outside it does not exist.</p>

<p>Claude's standard context window is <strong style="color:#e5e5e5">200,000 tokens</strong> — roughly 500 pages of a novel. Claude Opus 4.6 extends to <strong style="color:#e5e5e5">1,000,000 tokens</strong> (1M), which is roughly 2,500 pages — enough to hold an entire codebase, a full textbook, or days of conversation history in a single request.</p>

<p>This matters because context is the single biggest lever for AI quality. An LLM with the right context is dramatically more useful than a smarter LLM without it. RAG, long-document analysis, and multi-turn conversations all depend on fitting the right information into the context window.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Key insight:</strong> The context window is shared between input and output. If you send 190K tokens of input, Claude only has 10K tokens left for its response. Always budget for output when loading long documents into the context.
</div>
</div>

<div class="card">
<h2>What Are Tokens?</h2>
<p>AI models do not see words — they see <strong>tokens</strong>. A token is a chunk of text, typically 3-4 characters for English. The word "hello" is one token. The word "anthropomorphic" is four tokens (anthrop-omorph-ic + the space before it). Punctuation, spaces, and special characters are separate tokens.</p>

<p>Why does this matter? Because you pay per token, and you are limited per token. Understanding tokenization helps you estimate costs, fit more content into the context window, and debug unexpected behavior (like responses getting cut off because you ran out of output tokens).</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — counting tokens with Anthropic's tokenizer</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

<span style="color:#71717a"># The Anthropic SDK includes a token counter</span>
client = anthropic.Anthropic()

<span style="color:#71717a"># Count tokens in a text</span>
text = <span style="color:#fbbf24">"Claude's context window is 200,000 tokens."</span>
token_count = client.count_tokens(text)
<span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Text: {len(text)} chars → {token_count} tokens"</span>)
<span style="color:#71717a"># Text: 46 chars → 11 tokens</span>

<span style="color:#71717a"># Quick estimate: ~4 chars per token for English</span>
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">estimate_tokens</span>(text: str) -> int:
    <span style="color:#fb923c">"""Quick token estimate without API call."""</span>
    <span style="color:#c084fc">return</span> len(text) // <span style="color:#fb923c">4</span>

<span style="color:#71717a"># Estimate cost for a document</span>
document = open(<span style="color:#fbbf24">"report.txt"</span>).read()
tokens = estimate_tokens(document)
<span style="color:#71717a"># Sonnet pricing: $3/1M input tokens</span>
cost = (tokens / <span style="color:#fb923c">1_000_000</span>) * <span style="color:#fb923c">3</span>
<span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Document: ~{tokens:,} tokens → ${cost:.4f}"</span>)
<span style="color:#71717a"># Document: ~12,500 tokens → $0.0375</span></code></pre>
</div>
</div>

<div class="card">
<h2>Model Comparison</h2>
<p>See how Claude stacks up against other models:</p>
<div class="comparison-grid">
<div class="model-bar">
<div class="model-name" style="color:#8b5cf6">Claude 4.6</div>
<div class="model-tokens">200K tokens (up to 1M with Opus)</div>
<div class="model-visual"></div>
</div>
<div class="model-bar">
<div class="model-name" style="color:#34d399">GPT-4o</div>
<div class="model-tokens">128K tokens</div>
<div class="model-visual"></div>
</div>
<div class="model-bar">
<div class="model-name" style="color:#fb923c">Gemini 2.5 Pro</div>
<div class="model-tokens">1M tokens</div>
<div class="model-visual"></div>
</div>
</div>
<p style="font-size:.85rem"><strong>Key insight:</strong> Window size is not the whole story. What matters is <em>effective context utilization</em> — how well the model actually uses information across the full window. Claude is specifically optimized for "needle in a haystack" recall, meaning it can find and use a single relevant fact buried anywhere in a 200K+ token conversation.</p>
</div>

<div class="card">
<h2>Live Token Counter</h2>
<p>Type or paste text below to see tokens fill up in real-time. Try different content types to see how they tokenize differently.</p>

<div class="preset-btns">
<button class="preset-btn" onclick="loadPreset('prose')">📝 Prose</button>
<button class="preset-btn" onclick="loadPreset('code')">💻 Code</button>
<button class="preset-btn" onclick="loadPreset('data')">📊 JSON Data</button>
<button class="preset-btn" onclick="loadPreset('poetry')">🎭 Poetry</button>
<button class="preset-btn" onclick="loadPreset('legal')">⚖️ Legal Text</button>
</div>

<textarea id="tokenInput" placeholder="Start typing or paste text here to see the token counter in action..." oninput="updateTokens()"></textarea>

<div class="context-bar-container">
<div class="context-bar-bg">
</div>
<div class="context-labels">
<span>0 tokens</span>
<span>200,000 tokens</span>
</div>
</div>

<div class="context-stats">
<div class="stat-box">
<div class="stat-num" id="tokenCount">0</div>
<div class="stat-label">Est. Tokens</div>
</div>
<div class="stat-box">
<div class="stat-num" id="charCount">0</div>
<div class="stat-label">Characters</div>
</div>
<div class="stat-box">
<div class="stat-num" id="ratioDisplay">0</div>
<div class="stat-label">Chars per Token</div>
</div>
</div>
</div>

<div class="card">
<h2>Token Density by Content Type</h2>
<p>Different types of content tokenize very differently. This is critical for cost estimation and context management. Code and structured data eat tokens faster than prose because special characters, whitespace, and syntax get their own tokens.</p>
<div id="tokenTypes">
<div class="token-type">
<div class="token-info"><strong>English Prose</strong><span>~4 characters per token — the most efficient</span></div>
<div class="token-ratio">~4:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>Python Code</strong><span>~3.5 characters per token — indentation adds tokens</span></div>
<div class="token-ratio">~3.5:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>JSON Data</strong><span>~3 characters per token — braces, quotes, colons</span></div>
<div class="token-ratio">~3:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>HTML/XML</strong><span>~2.5 characters per token — tags are token-heavy</span></div>
<div class="token-ratio">~2.5:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>Non-English Text</strong><span>~2 characters per token — CJK characters are especially costly</span></div>
<div class="token-ratio">~2:1</div>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — cost calculator for different content types</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Token density ratios (chars per token)</span>
DENSITY = {
    <span style="color:#fbbf24">"prose"</span>:    <span style="color:#fb923c">4.0</span>,
    <span style="color:#fbbf24">"python"</span>:   <span style="color:#fb923c">3.5</span>,
    <span style="color:#fbbf24">"json"</span>:     <span style="color:#fb923c">3.0</span>,
    <span style="color:#fbbf24">"html"</span>:     <span style="color:#fb923c">2.5</span>,
    <span style="color:#fbbf24">"cjk"</span>:      <span style="color:#fb923c">2.0</span>,
}

<span style="color:#71717a"># Pricing per 1M tokens (input/output)</span>
PRICING = {
    <span style="color:#fbbf24">"claude-opus-4-6"</span>:              (<span style="color:#fb923c">15.0</span>, <span style="color:#fb923c">75.0</span>),
    <span style="color:#fbbf24">"claude-sonnet-4-6"</span>:            (<span style="color:#fb923c">3.0</span>,  <span style="color:#fb923c">15.0</span>),
    <span style="color:#fbbf24">"claude-haiku-4-5-20251001"</span>:    (<span style="color:#fb923c">0.8</span>,  <span style="color:#fb923c">4.0</span>),
}

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">estimate_cost</span>(
    text: str,
    content_type: str = <span style="color:#fbbf24">"prose"</span>,
    model: str = <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    est_output_tokens: int = <span style="color:#fb923c">500</span>
) -> dict:
    <span style="color:#fb923c">"""Estimate the cost of a Claude API call."""</span>
    chars_per_token = DENSITY.get(content_type, <span style="color:#fb923c">4.0</span>)
    input_tokens = len(text) / chars_per_token
    input_price, output_price = PRICING[model]
    input_cost = (input_tokens / <span style="color:#fb923c">1_000_000</span>) * input_price
    output_cost = (est_output_tokens / <span style="color:#fb923c">1_000_000</span>) * output_price
    <span style="color:#c084fc">return</span> {
        <span style="color:#fbbf24">"input_tokens"</span>: int(input_tokens),
        <span style="color:#fbbf24">"output_tokens"</span>: est_output_tokens,
        <span style="color:#fbbf24">"input_cost"</span>: f<span style="color:#fbbf24">"${input_cost:.4f}"</span>,
        <span style="color:#fbbf24">"output_cost"</span>: f<span style="color:#fbbf24">"${output_cost:.4f}"</span>,
        <span style="color:#fbbf24">"total_cost"</span>: f<span style="color:#fbbf24">"${input_cost + output_cost:.4f}"</span>,
    }

<span style="color:#71717a"># Example: analyzing a 50-page report</span>
report = <span style="color:#fbbf24">"..."</span> * <span style="color:#fb923c">50000</span>  <span style="color:#71717a"># ~50K chars</span>
<span style="color:#34d399">print</span>(estimate_cost(report, <span style="color:#fbbf24">"prose"</span>, <span style="color:#fbbf24">"claude-sonnet-4-6"</span>))
<span style="color:#71717a"># {'input_tokens': 12500, 'output_tokens': 500,</span>
<span style="color:#71717a">#  'input_cost': '$0.0375', 'output_cost': '$0.0075',</span>
<span style="color:#71717a">#  'total_cost': '$0.0450'}</span></code></pre>
</div>
</div>

<div class="card">
<h2>The "Lost in the Middle" Problem</h2>
<p>Research has shown that many LLMs struggle to recall information placed in the <em>middle</em> of a long context. They reliably find information at the beginning and end, but data buried in the middle can be "lost." This is called the <strong>lost in the middle</strong> phenomenon.</p>

<p>Claude is specifically tuned to minimize this problem. Anthropic's needle-in-a-haystack tests show that Claude can retrieve a single fact from anywhere in its full 200K context window with high accuracy. However, no model is perfect — if you have critical information, here are strategies to ensure it gets seen:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="font-size:.85rem;font-weight:700;color:#34d399;min-width:1.5rem">1</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">Put critical instructions at the top.</strong> System prompts and key instructions should go first, before any document content. The model pays the most attention to the beginning.</div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="font-size:.85rem;font-weight:700;color:#34d399;min-width:1.5rem">2</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">Repeat important facts.</strong> If a fact is critical, mention it in the system prompt AND near the user's question. Redundancy helps retrieval.</div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="font-size:.85rem;font-weight:700;color:#34d399;min-width:1.5rem">3</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">Use structured formatting.</strong> Headers, XML tags, and numbered lists help the model navigate long documents. <code>&lt;document&gt;...&lt;/document&gt;</code> tags are especially effective.</div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="font-size:.85rem;font-weight:700;color:#34d399;min-width:1.5rem">4</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6"><strong style="color:#e5e5e5">Use RAG instead of stuffing.</strong> If you have more content than fits in the window, use vector search to retrieve only the relevant chunks (covered in the RAG course).</div>
</div>
</div>
</div>

<div class="card">
<h2>Managing Context in Code</h2>
<p>In production applications, you need to actively manage the context window — tracking how many tokens you've used, truncating conversation history when it gets too long, and deciding what to keep and what to drop.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — context window management</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">chat_with_context_management</span>(
    messages: list,
    system: str,
    model: str = <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_context: int = <span style="color:#fb923c">180_000</span>,  <span style="color:#71717a"># leave 20K for output</span>
):
    <span style="color:#fb923c">"""Send a message while managing the context window."""</span>

    <span style="color:#71717a"># Estimate total tokens</span>
    total_chars = len(system) + sum(
        len(m[<span style="color:#fbbf24">"content"</span>]) <span style="color:#c084fc">for</span> m <span style="color:#c084fc">in</span> messages
    )
    est_tokens = total_chars // <span style="color:#fb923c">4</span>

    <span style="color:#71717a"># If over budget, trim old messages (keep system + last N)</span>
    <span style="color:#c084fc">while</span> est_tokens > max_context <span style="color:#c084fc">and</span> len(messages) > <span style="color:#fb923c">2</span>:
        removed = messages.pop(<span style="color:#fb923c">0</span>)  <span style="color:#71717a"># drop oldest message</span>
        est_tokens -= len(removed[<span style="color:#fbbf24">"content"</span>]) // <span style="color:#fb923c">4</span>
        <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Trimmed message, ~{est_tokens:,} tokens remaining"</span>)

    <span style="color:#71717a"># Send to Claude</span>
    response = client.messages.create(
        model=model,
        max_tokens=<span style="color:#fb923c">4096</span>,
        system=system,
        messages=messages,
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text

<span style="color:#71717a"># Usage</span>
history = []
system_prompt = <span style="color:#fbbf24">"You are a helpful coding assistant."</span>

<span style="color:#71717a"># Conversation keeps growing...</span>
history.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Explain Python decorators."</span>})
reply = chat_with_context_management(history, system_prompt)
history.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: reply})
<span style="color:#71717a"># ...old messages automatically trimmed when context gets full</span></code></pre>
</div>
</div>

<div class="card">
<h2>What Fits in 200K Tokens?</h2>
<p>To put Claude's context window in perspective:</p>
<div class="comparison-grid">
<div class="model-bar" style="border-color:rgba(139,92,246,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">📚</div>
<div class="model-name">~500 Pages</div>
<div style="font-size:.8rem;color:#71717a">of a novel</div>
</div>
<div class="model-bar" style="border-color:rgba(251,146,60,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">💻</div>
<div class="model-name">~150K Lines</div>
<div style="font-size:.8rem;color:#71717a">of code</div>
</div>
<div class="model-bar" style="border-color:rgba(56,189,248,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">📄</div>
<div class="model-name">~300 PDFs</div>
<div style="font-size:.8rem;color:#71717a">typical business docs</div>
</div>
<div class="model-bar" style="border-color:rgba(52,211,153,.2)">
<div style="font-size:2rem;margin-bottom:.5rem">💬</div>
<div class="model-name">~8 Hours</div>
<div style="font-size:.8rem;color:#71717a">of conversation</div>
</div>
</div>
<p style="font-size:.85rem;color:#a1a1aa;margin-top:.75rem">With Opus 4.6's 1M token window, multiply all of these by 5x. That is enough to hold an entire codebase (most production repos are under 1M tokens), a full college textbook, or a week of conversation history.</p>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Context Window Key Concepts","cards":[{"front":"What is a context window?","back":"The total amount of text an AI can see at once — including prompt, system instructions, conversation history, and the response. Claude supports 200K tokens standard, up to 1M with Opus 4.6."},{"front":"What is a token?","back":"A chunk of text, typically 3-4 characters for English. AI models process tokens, not words. You pay per token and are limited per token. Understanding tokenization helps with cost estimation and context management."},{"front":"Lost in the middle phenomenon","back":"The tendency of large-context models to lose or ignore information buried in the middle of a very long input. Claude is specifically tuned to minimize this. Mitigation: put critical info at top, use structure, repeat key facts."},{"front":"English prose token density","back":"About 4 characters per token — the most efficient content type. A 10,000-character document is roughly 2,500 tokens."},{"front":"Context window management","back":"In production apps, you must actively track token usage and trim old messages when the context gets full. Always budget for output tokens — the response needs room too."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"Context Window Comprehension","questions":[{"q":"Claude Opus 4.6 can handle up to how many tokens in a single conversation?","options":["128K tokens","200K tokens","500K tokens","1 million tokens"],"correct":3,"explanation":"Claude Opus 4.6 extends to 1 million tokens — roughly 2,500 pages of text. The standard context for Sonnet and Haiku is 200K tokens."},{"q":"What does the lost in the middle phenomenon describe?","options":["Tokens being dropped mid-response","Models losing track of information buried in the middle of long inputs","Context windows shrinking during a conversation","Tokens costing more as the context grows"],"correct":1,"explanation":"Lost in the middle describes how some models struggle to recall information placed in the middle of a long context. They perform better on content at the beginning and end. Claude is specifically optimized to reduce this problem."},{"q":"You have a 200K token context window and send 195K tokens of input. What happens to Claude\u0027s response?","options":["Claude refuses to respond","Claude responds normally with up to 200K tokens of output","Claude can only generate ~5K tokens of output before hitting the limit","The extra tokens are silently truncated from the input"],"correct":2,"explanation":"The context window is shared between input and output. If you use 195K of the 200K window on input, Claude only has ~5K tokens left for its response. Always budget for output when loading long documents."},{"q":"Which content type uses the most tokens per character?","options":["English prose","Python code","JSON data","Non-English text (CJK)"],"correct":3,"explanation":"Non-English text, especially CJK characters, tokenizes at roughly 2 characters per token — the most expensive content type. English prose is the most efficient at ~4 characters per token."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 2 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
