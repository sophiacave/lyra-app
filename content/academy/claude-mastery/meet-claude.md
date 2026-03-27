---
title: "Meet Claude"
course: "claude-mastery"
order: 1
type: "lesson"
free: true
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+200 XP</div><div id="particles"></div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 1 · Introduction</div>
<h1>Meet Claude</h1>
<p>Who Claude is, what makes it different, and how to choose the right model</p>
<div class="lesson-meta-bar">⏱ <span>20 min</span> · ⚡ <span>200 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">

<div class="card">
<h2>Who Is Claude?</h2>
<p>Claude is an AI assistant made by <strong style="color:#e5e5e5">Anthropic</strong> — a company founded in 2021 by former OpenAI researchers who wanted to build AI that was safer and more reliable from the ground up.</p>
<p>The philosophy behind Claude is called <strong style="color:#e5e5e5">Constitutional AI</strong>. Instead of just training a model to say what sounds right, Anthropic gave Claude a set of principles — like a constitution — and trained it to reason against those principles. That shapes how Claude thinks, not just what it says.</p>
<p>The result is an AI that's unusually good at nuanced reasoning, genuinely tries to be honest even when honesty is inconvenient, and pushes back when something seems off — rather than just agreeing to seem helpful.</p>
<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">🏛️</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Constitutional AI</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Trained with explicit values, not just user feedback</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">🔬</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Safety-First Research</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Anthropic publishes alignment research openly</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">💬</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Reasoning-Heavy</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Designed to think, not just pattern-match</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Claude vs. ChatGPT vs. Gemini</h2>
<p>All three are powerful. But they're built with different priorities — and that shows in how they behave day to day.</p>
<div class="compare-grid">
<div class="compare-row">
<div class="compare-col-head claude">Claude</div>
<div class="compare-col-head other">ChatGPT / Gemini</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">When it doesn't know something</div>
<div class="compare-cell claude">Says "I'm not sure" — and means it</div>
<div class="compare-cell other">More likely to fill the gap confidently</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Complex reasoning tasks</div>
<div class="compare-cell claude">Thinks through steps, shows its logic</div>
<div class="compare-cell other">Often jumps straight to an answer</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">If you push it to agree with something wrong</div>
<div class="compare-cell claude">Holds its ground, explains why</div>
<div class="compare-cell other">More likely to accommodate</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Long documents and context</div>
<div class="compare-cell claude">Strong retention across huge context windows</div>
<div class="compare-cell other">Varies by model and version</div>
</div>
<div class="compare-row data-row">
<div class="compare-cell">Tone and writing style</div>
<div class="compare-cell claude">Warm, considered, avoids filler</div>
<div class="compare-cell other">Often more generic or enthusiastic</div>
</div>
</div>
<p style="margin-top:1rem;font-size:.85rem">None of this makes Claude "better" in every situation. ChatGPT has a larger plugin ecosystem. Gemini integrates deeply with Google's suite. Claude's edge is <strong style="color:#e5e5e5">trustworthiness under pressure</strong> — it's built to be honest even when a confident-sounding wrong answer would be easier.</p>
</div>

<div class="card">
<h2>The Claude Model Lineup</h2>
<p>Anthropic offers Claude in three tiers. Think of it like choosing the right tool for the job — more power isn't always better if you're paying for it on every single request.</p>
<div class="model-grid">
<div class="model-card opus">
<div class="model-tier">Top Tier</div>
<div class="model-name">Claude Opus</div>
<div class="model-desc">The most capable model. Exceptional at nuanced reasoning, long-form analysis, research synthesis, and complex multi-step tasks. Slower and more expensive — worth it when quality is the priority.</div>
<div class="model-use">Deep work &amp; analysis</div>
</div>
<div class="model-card sonnet">
<div class="model-tier">Balanced</div>
<div class="model-name">Claude Sonnet</div>
<div class="model-desc">The sweet spot. Strong reasoning, fast enough for real-time use, cost-effective at scale. This is what most people use for most things — coding, writing, strategy, business tasks.</div>
<div class="model-use">Everyday powerhouse</div>
</div>
<div class="model-card haiku">
<div class="model-tier">Lightweight</div>
<div class="model-name">Claude Haiku</div>
<div class="model-desc">The smallest, fastest, cheapest model. Surprisingly capable for its size — great for classification, summarization, simple Q&amp;A, and high-volume pipelines where speed and cost matter.</div>
<div class="model-use">Speed &amp; volume tasks</div>
</div>
</div>
<p style="font-size:.85rem;margin-top:.25rem">When prompting via the API or building a product, you specify which model to use. In Claude.ai, Sonnet is the default — but you can switch to Opus for harder tasks.</p>
</div>

<div class="card">
<h2>The HHH Framework</h2>
<p style="color:#a1a1aa;line-height:1.7;margin-bottom:.25rem">Everything about Claude traces back to three words. Anthropic calls it the HHH framework — and it's not just marketing. These properties are baked into how the model is trained and evaluated.</p>
<div class="three-h">
<div class="h-pill helpful">
<div class="h-pill-icon">🤝</div>
<div class="h-pill-title">Helpful</div>
<div class="h-pill-desc">Actually useful. Not hedged into uselessness. Claude tries to give you what you need, not a watered-down non-answer.</div>
</div>
<div class="h-pill harmless">
<div class="h-pill-icon">🛡️</div>
<div class="h-pill-title">Harmless</div>
<div class="h-pill-desc">Refuses to assist with things that cause real harm. Not by default-blocking everything — by reasoning through context.</div>
</div>
<div class="h-pill honest">
<div class="h-pill-icon">🔍</div>
<div class="h-pill-title">Honest</div>
<div class="h-pill-desc">Won't pretend to know things it doesn't. Won't flatter you into a bad decision. Won't hallucinate and serve it with confidence.</div>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Claude Model Tiers","cards":[{"front":"Claude Opus","back":"Top tier — best for deep analysis, long-form research, and complex multi-step reasoning. Slower and more expensive."},{"front":"Claude Sonnet","back":"Balanced tier — the everyday powerhouse. Strong reasoning, fast enough for real-time use, cost-effective at scale."},{"front":"Claude Haiku","back":"Lightweight tier — fastest and cheapest. Best for classification, summarization, and high-volume pipelines."},{"front":"Constitutional AI","back":"Anthropic's training approach — Claude is given a set of principles and trained to reason against them, shaping values not just outputs."},{"front":"HHH Framework","back":"Helpful, Harmless, Honest — the three core properties baked into Claude's training and evaluation."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Which Claude Model?","questions":[{"q":"You are building a chatbot that auto-tags 10,000 customer support tickets per day by category. Speed and cost matter more than nuance. Which model?","options":["Claude Opus","Claude Sonnet","Claude Haiku","Any model works equally"],"correct":2,"explanation":"High-volume, repetitive classification is exactly where Haiku shines. It is fast, cheap, and more than capable enough for simple categorization."},{"q":"You need to analyze 200 pages of contract language, identify unusual clauses, and write a risk summary for your legal team. Which model?","options":["Claude Opus","Claude Sonnet","Claude Haiku","Temperature matters more than model"],"correct":0,"explanation":"This is exactly where Opus earns its cost — sustained attention over a long document, nuanced judgment on edge cases, and a coherent synthesis at the end."},{"q":"You are writing product descriptions for 50 items in your Shopify store — clear, punchy, conversion-focused copy. Which model?","options":["Claude Opus","Claude Sonnet","Claude Haiku","Use all three in sequence"],"correct":1,"explanation":"Sonnet is the perfect fit — strong enough to write compelling copy at scale, fast enough to get through 50 items, and cost-effective."},{"q":"What does Constitutional AI mean in the context of Claude?","options":["Claude follows US constitutional law","Claude was trained with a set of explicit guiding principles","Claude generates legal documents","Claude refuses all political topics"],"correct":1,"explanation":"Constitutional AI means Anthropic gave Claude a set of principles and trained it to reason against those principles — shaping how it thinks, not just what it says."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match the Claude Property","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Helpful","right":"Gives what you need, not hedged non-answers"},{"left":"Harmless","right":"Reasons through context before refusing"},{"left":"Honest","right":"Says I am not sure when it does not know"},{"left":"Constitutional AI","right":"Trained with explicit principles, not just feedback"},{"left":"Claude Haiku","right":"Best for speed and high-volume tasks"}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 1 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
