---
title: "Chain of Thought"
course: "claude-mastery"
order: 5
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 5 · Visual</div>
<h1>Chain-of-Thought Reasoning</h1>
<p>Unlock Claude's deeper reasoning by teaching it to think step by step</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>The Power of "Think Step by Step"</h2>
<p>Chain-of-thought (CoT) prompting is one of the most powerful techniques in prompt engineering. By asking Claude to show its reasoning, you dramatically improve accuracy on complex tasks — math, logic, coding, and analysis.</p>
<p>The difference is often striking. Let's see a live comparison:</p>

<div class="comparison">
<div class="comp-box">
<div class="comp-label" style="color:#f87171">❌ Without CoT</div>
<div class="comp-text" style="font-style:italic;color:#71717a">"If a store has a 25% off sale and then offers an additional 10% off the sale price, what's the total discount on a $200 item?"</div>
<div class="comp-text" style="margin-top:.75rem">"The total discount is 35%, so the price would be $130."</div>
<div class="comp-answer comp-wrong">Wrong — that's not how compound discounts work!</div>
</div>
<div class="comp-box">
<div class="comp-label" style="color:#34d399">✓ With CoT</div>
<div class="comp-text" style="font-style:italic;color:#71717a">"Think step by step: If a store has a 25% off sale..."</div>
<div class="comp-text" style="margin-top:.75rem">
Step 1: Original price = $200<br>
Step 2: 25% off → $200 × 0.75 = $150<br>
Step 3: Additional 10% off sale price → $150 × 0.90 = $135<br>
Step 4: Total discount = $200 - $135 = $65 = 32.5%
</div>
<div class="comp-answer comp-right">Correct! The compound discount is 32.5%, not 35%</div>
</div>
</div>
</div>

<div class="card">
<h2>Watch the Thinking Process</h2>
<p>Select a question and watch Claude's chain-of-thought reasoning build in real-time:</p>
<div class="question-select">
<button class="q-btn active" onclick="selectQuestion(0,this)">Math Puzzle</button>
<button class="q-btn" onclick="selectQuestion(1,this)">Logic Problem</button>
<button class="q-btn" onclick="selectQuestion(2,this)">Code Debug</button>
</div>
<div class="thinking-canvas" id="thinkCanvas">
<svg class="connections" id="connSvg"></svg>
<button class="play-btn" id="playBtn" onclick="playAnimation()">▶ Watch Claude Think</button>
</div>
</div>

<div class="card">
<h2>Write Your Own CoT Prompt</h2>
<p>Here's a challenging question. Write a prompt that guides Claude to reason through it step by step:</p>
<div style="background:rgba(139,92,246,.08);border-left:3px solid #8b5cf6;padding:1rem;border-radius:0 8px 8px 0;margin:1rem 0;font-size:.95rem">
<strong>Question:</strong> A farmer has a fox, a chicken, and a bag of grain. He needs to cross a river in a boat that can only carry him and one item at a time. If left alone, the fox will eat the chicken, and the chicken will eat the grain. How can he get everything across safely?
</div>
<textarea id="cotPrompt" placeholder="Write your chain-of-thought prompt here. Include instructions that will make Claude reason through the problem step by step..."></textarea>
<button class="analyze-btn" onclick="analyzePrompt()">Analyze My Prompt</button>
<div class="score-card" id="scoreCard">
<div class="score-circle" id="scoreCircle" style="background:rgba(139,92,246,.2);color:#8b5cf6">?</div>
<div class="score-detail">
<h3 id="scoreTitle">Analysis</h3>
<p id="scoreText"></p>
</div>
</div>
</div>

<div class="card">
<h2>CoT Best Practices</h2>
<div style="display:grid;gap:1rem">
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">✓</div>
<div><strong>"Think step by step"</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">The classic trigger. Simple and effective for most problems.</p></div>
</div>
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">✓</div>
<div><strong>"Before answering, consider..."</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">Guides the model to evaluate specific aspects before concluding.</p></div>
</div>
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">✓</div>
<div><strong>"Show your work / reasoning"</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">Makes the reasoning visible so you can verify each step.</p></div>
</div>
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(248,113,113,.05);border-radius:10px;border:1px solid rgba(248,113,113,.1)">
<div style="color:#f87171;font-size:1.2rem;flex-shrink:0">✕</div>
<div><strong>"Just give me the answer"</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">Skipping reasoning leads to more errors on complex problems.</p></div>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Chain-of-Thought Key Concepts","cards":[{"front":"Chain-of-Thought (CoT) prompting","back":"Asking Claude to show its step-by-step reasoning before arriving at an answer. Dramatically improves accuracy on math, logic, and analysis tasks."},{"front":"Classic CoT trigger phrase","back":"Think step by step — simple and effective for most complex problems."},{"front":"Before answering, consider...","back":"A CoT variant that directs Claude to evaluate specific aspects of the problem before concluding."},{"front":"Show your work","back":"A CoT instruction that makes reasoning visible so you can verify each intermediate step."},{"front":"Why CoT helps with compound discounts","back":"Without CoT, models add percentages directly (35%). With CoT, they compute sequentially — 25% off then 10% off the reduced price — giving the correct 32.5%."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Chain-of-Thought Comprehension","questions":[{"q":"A store offers 20% off, then an additional 10% off the sale price. Without CoT, Claude says the total discount is 30%. What is the actual answer?","options":["30% — Claude was correct","28% — compound discounts multiply","25% — sequential discounts are always less","The discounts cannot be combined"],"correct":1,"explanation":"Compound discounts are multiplicative, not additive. 20% off leaves 80%, then 10% off that leaves 72% — so 28% total discount, not 30%."},{"q":"Which phrase is the classic chain-of-thought trigger?","options":["Be thorough","Think step by step","Use your best judgment","Answer carefully"],"correct":1,"explanation":"Think step by step is the classic CoT trigger. It is simple, direct, and works across virtually all complex reasoning tasks."},{"q":"When is chain-of-thought prompting MOST valuable?","options":["Simple yes/no questions","Single-word classification tasks","Complex multi-step math, logic, and analysis","Writing creative poetry"],"correct":2,"explanation":"CoT prompting has the biggest impact on complex, multi-step problems where intermediate reasoning steps matter — math, logic puzzles, code debugging, and causal analysis."},{"q":"What is the risk of telling Claude just give me the answer on a hard problem?","options":["Claude refuses to respond","Claude takes longer to answer","Claude skips verification steps and makes more errors","Claude uses more tokens"],"correct":2,"explanation":"Suppressing reasoning means Claude cannot catch and correct its own errors mid-thought. Visible step-by-step reasoning improves accuracy by letting the model verify each stage before proceeding."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match CoT Phrase to Its Purpose","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Think step by step","right":"Classic universal CoT trigger"},{"left":"Before answering, consider...","right":"Directs evaluation of specific aspects first"},{"left":"Show your work","right":"Makes intermediate reasoning visible"},{"left":"Just give me the answer","right":"Anti-pattern — skips verification, increases errors"},{"left":"Walk me through your reasoning","right":"Requests explicit narration of thought process"}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 5 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
