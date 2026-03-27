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
<p>Visualize and understand Claude's massive 200K token context</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">

<div class="card">
<h2>What Is a Context Window?</h2>
<p>The context window is the total amount of text an AI can "see" at once — including your prompt, system instructions, conversation history, and the response. Think of it as the model's working memory. Claude's 200K token window means it can process roughly <strong>500 pages</strong> of text in a single conversation.</p>
</div>

<div class="card">
<h2>Model Comparison</h2>
<p>See how Claude stacks up against other models:</p>
<div class="comparison-grid">
<div class="model-bar">
<div class="model-name" style="color:#8b5cf6">Claude 3.5</div>
<div class="model-tokens">200K tokens</div>
<div class="model-visual"></div>
</div>
<div class="model-bar">
<div class="model-name" style="color:#34d399">GPT-4o</div>
<div class="model-tokens">128K tokens</div>
<div class="model-visual"></div>
</div>
<div class="model-bar">
<div class="model-name" style="color:#fb923c">Gemini 1.5</div>
<div class="model-tokens">1M tokens</div>
<div class="model-visual"></div>
</div>
</div>
<p style="font-size:.85rem"><strong>Key insight:</strong> While Gemini has a larger window, Claude's 200K context is often more <em>effectively utilized</em> — Claude shows stronger recall and reasoning across its full context compared to models that may "lose" information in the middle of long contexts (the "lost in the middle" phenomenon).</p>
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
<p>Different types of content tokenize very differently. Code tends to use more tokens per character due to special characters and indentation, while prose is more efficient.</p>
<div id="tokenTypes">
<div class="token-type">
<div class="token-info"><strong>English Prose</strong><span>~4 characters per token</span></div>
<div class="token-ratio">~4:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>Python Code</strong><span>~3.5 characters per token</span></div>
<div class="token-ratio">~3.5:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>JSON Data</strong><span>~3 characters per token</span></div>
<div class="token-ratio">~3:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>HTML/XML</strong><span>~2.5 characters per token</span></div>
<div class="token-ratio">~2.5:1</div>
</div>
<div class="token-type">
<div class="token-info"><strong>Non-English Text</strong><span>~2 characters per token</span></div>
<div class="token-ratio">~2:1</div>
</div>
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
</div>

<div data-learn="FlashDeck" data-props='{"title":"Context Window Key Concepts","cards":[{"front":"What is a context window?","back":"The total amount of text an AI can see at once — including prompt, system instructions, conversation history, and the response. Claude supports 200K tokens."},{"front":"How many pages is 200K tokens?","back":"Roughly 500 pages of a novel, 150K lines of code, or about 8 hours of conversation."},{"front":"Lost in the middle phenomenon","back":"The tendency of large-context models to lose or ignore information in the middle of a very long input. Claude is specifically tuned to minimize this."},{"front":"English prose token density","back":"About 4 characters per token — the most efficient content type for token usage."},{"front":"Code token density","back":"About 3.5 characters per token — slightly less efficient than prose due to special characters and indentation."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match Content Type to Token Density","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"English Prose","right":"~4 chars per token"},{"left":"Python Code","right":"~3.5 chars per token"},{"left":"JSON Data","right":"~3 chars per token"},{"left":"HTML / XML","right":"~2.5 chars per token"},{"left":"Non-English Text","right":"~2 chars per token"}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Context Window Comprehension","questions":[{"q":"Claude 3.5 has a context window of approximately how many tokens?","options":["50K tokens","128K tokens","200K tokens","1 million tokens"],"correct":2,"explanation":"Claude 3.5 supports a 200K token context window, which equates to roughly 500 pages of a novel."},{"q":"What does the lost in the middle phenomenon describe?","options":["Tokens being dropped mid-response","Models losing track of information buried in the middle of long inputs","Context windows shrinking during a conversation","Tokens costing more as the context grows"],"correct":1,"explanation":"Lost in the middle describes how some models struggle to recall information placed in the middle of a long context. Claude is specifically optimized to reduce this problem."},{"q":"Which content type uses the most tokens per unit of text?","options":["English prose","Non-English text","Python code","JSON data"],"correct":1,"explanation":"Non-English text tokenizes at roughly 2 characters per token — the least efficient, meaning it uses the most tokens for a given amount of text."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 2 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
