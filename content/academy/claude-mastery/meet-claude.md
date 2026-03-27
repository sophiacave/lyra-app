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
<h2>Quiz: Which Model Would You Use?</h2>
<p>5 real scenarios. Pick the right Claude model for each one.</p>
<div id="quizWrap">
<div class="quiz-progress">Question <span id="qNum">1</span> of 5</div>
<div class="scenario-box">
<div class="scenario-label">Scenario</div>
<div id="scenarioText"></div>
</div>
<div class="quiz-feedback" id="quizFeedback"></div>
<div class="quiz-options">
<button class="quiz-btn opus-opt" id="btnOpus" onclick="answer('opus')">Claude Opus</button>
<button class="quiz-btn sonnet-opt" id="btnSonnet" onclick="answer('sonnet')">Claude Sonnet</button>
<button class="quiz-btn haiku-opt" id="btnHaiku" onclick="answer('haiku')">Claude Haiku</button>
</div>
<button class="quiz-next-btn" id="quizNext" onclick="nextQuestion()">Next Question →</button>
<div class="quiz-score" id="quizScore">
<div id="scoreNum"></div>
<p id="scoreMsg"></p>
<button class="quiz-next-btn" style="display:inline-block;margin-top:1rem" onclick="resetQuiz()">Retake Quiz</button>
</div>
</div>
</div>

<div class="takeaway-card">
<h2>The Core Idea</h2>
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

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete &amp; Continue →</button>
</div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 1 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>

<script>
const QUESTIONS=[
{
text:"You're building a chatbot that auto-tags 10,000 customer support tickets per day by category. Speed and cost matter more than nuance.",
correct:'haiku',
feedback:{
haiku:"Correct! High-volume, repetitive classification is exactly where Haiku shines. It's fast, cheap, and more than capable enough for this.",
sonnet:"Sonnet could do it, but you'd pay significantly more per tag without getting meaningfully better results on simple classification.",
opus:"Opus would be serious overkill here — and expensive. Save it for tasks where deep reasoning actually changes the outcome."
}
},
{
text:"You need to analyze 200 pages of contract language, identify unusual clauses, and write a risk summary for your legal team.",
correct:'opus',
feedback:{
opus:"Correct! This is exactly where Opus earns its cost — sustained attention over a long document, nuanced judgment on edge cases, and a coherent synthesis at the end.",
sonnet:"Sonnet is capable, but with 200 pages of dense legal text, the depth and consistency of Opus will give you a noticeably better result.",
haiku:"Haiku would struggle to hold the full context and produce the level of legal nuance this task requires."
}
},
{
text:"You're writing product descriptions for 50 items in your Shopify store — clear, punchy, conversion-focused copy.",
correct:'sonnet',
feedback:{
sonnet:"Correct! Sonnet is the perfect fit — strong enough to write compelling copy at scale, fast enough to get through 50 items, and cost-effective.",
opus:"Opus works, but you'd be paying premium pricing for a task Sonnet handles just as well.",
haiku:"Haiku might produce passable copy, but product descriptions benefit from the stronger stylistic judgment Sonnet brings."
}
},
{
text:"You're prototyping a feature that checks whether a short user message contains profanity — yes or no.",
correct:'haiku',
feedback:{
haiku:"Correct! A yes/no classification on short inputs is one of the simplest tasks imaginable. Haiku handles this reliably at a fraction of the cost.",
sonnet:"Sonnet works, but it's significantly more expensive per call for a task this simple. Haiku is the right call.",
opus:"Opus for profanity detection is like using a sledgehammer to crack an egg. Save it for something that actually needs it."
}
},
{
text:"You're stuck on a hard strategic decision — whether to pivot your product, which market to target, and how to sequence the next 12 months.",
correct:'opus',
feedback:{
opus:"Correct! This is high-stakes, multi-variable reasoning across ambiguous information. Opus is built for exactly this kind of extended strategic thinking.",
sonnet:"Sonnet is good, but for a decision this consequential — where you want every nuance weighed carefully — the extra depth of Opus is worth the cost.",
haiku:"Haiku is optimized for speed on simple tasks, not depth on hard strategic problems."
}
}
];

let current=0,score=0,answered=false;

function renderQuestion(){
const q=QUESTIONS[current];
document.getElementById('qNum').textContent=current+1;
document.getElementById('scenarioText').textContent=q.text;
const fb=document.getElementById('quizFeedback');
fb.className='quiz-feedback';
fb.textContent='';
document.getElementById('quizNext').style.display='none';
document.getElementById('btnOpus').className='quiz-btn opus-opt';
document.getElementById('btnSonnet').className='quiz-btn sonnet-opt';
document.getElementById('btnHaiku').className='quiz-btn haiku-opt';
[document.getElementById('btnOpus'),document.getElementById('btnSonnet'),document.getElementById('btnHaiku')].forEach(b=>b.disabled=false);
answered=false;
}

function answer(choice){
if(answered) return;
answered=true;
const q=QUESTIONS[current];
const isCorrect=choice===q.correct;
if(isCorrect) score++;
const fb=document.getElementById('quizFeedback');
fb.textContent=q.feedback[choice];
fb.className='quiz-feedback show '+(isCorrect?'correct':'wrong');
const map={opus:'btnOpus',sonnet:'btnSonnet',haiku:'btnHaiku'};
[document.getElementById('btnOpus'),document.getElementById('btnSonnet'),document.getElementById('btnHaiku')].forEach(b=>b.disabled=true);
document.getElementById(map[choice]).classList.add(isCorrect?'correct':'wrong');
if(!isCorrect) document.getElementById(map[q.correct]).classList.add('correct');
const nxt=document.getElementById('quizNext');
nxt.style.display='inline-block';
nxt.textContent=current<QUESTIONS.length-1?'Next Question →':'See My Score';
}

function nextQuestion(){
current++;
if(current>=QUESTIONS.length){
showScore();
} else {
renderQuestion();
}
}

function showScore(){
document.getElementById('quizWrap').querySelectorAll('.quiz-progress,.scenario-box,.quiz-options,.quiz-feedback,.quiz-next-btn').forEach(el=>el.style.display='none');
const scoreEl=document.getElementById('quizScore');
scoreEl.style.display='block';
document.getElementById('scoreNum').textContent=score+'/5';
const msgs=[
'Keep going — re-read the model tiers section and give it another shot.',
'Good start! Review the Haiku vs Sonnet boundary and retake.',
'Not bad! One more pass through the models and you\'ll nail it.',
'Solid! You\'ve got a good read on when to use each model.',
'Perfect score. You know your Claude models cold.'
];
document.getElementById('scoreMsg').textContent=msgs[score];
}

function resetQuiz(){
current=0;score=0;answered=false;
document.getElementById('quizWrap').querySelectorAll('.quiz-progress,.scenario-box,.quiz-options').forEach(el=>el.style.display='');
document.getElementById('quizScore').style.display='none';
renderQuestion();
}

renderQuestion();

function completeLesson(){
localStorage.setItem('cm_meet-claude','done');
const burst=document.getElementById('xpBurst');
burst.classList.add('show');
const cont=document.getElementById('particles');
const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){
const p=document.createElement('div');
p.className='particle';
const s=Math.random()*8+4;
p.style.width=s+'px';
p.style.height=s+'px';
p.style.background=colors[Math.floor(Math.random()*colors.length)];
p.style.left='50%';
p.style.top='50%';
p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');
p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');
p.style.animation='particleFly .8s ease forwards';
p.style.animationDelay=(Math.random()*.2)+'s';
cont.appendChild(p);
setTimeout(()=>p.remove(),1200);
}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
