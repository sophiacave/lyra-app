---
title: "Prompt Game"
course: "claude-mastery"
order: 7
type: "lesson"
free: false
---<div class="particle-container" id="particles"></div>
<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">
<a href="index.html" class="logo">Claude Mastery</a>
<a href="index.html" class="nav-link">← Back to Course</a>
</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 7 · Game</div>
<h1>Prompt Engineering Game</h1>
<p>5 challenges. Craft the perfect prompt. Earn your score.</p>
<div class="lesson-meta-bar">⏱ <span>90 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.6">
<strong style="color:#8b5cf6">How scoring works:</strong> Your prompt is checked for <strong>relevant keywords</strong> that indicate good prompt engineering (e.g., specifying format, audience, constraints). Each keyword found earns you points proportional to the challenge total (100 pts max). Longer prompts earn a small length bonus (+5 at 50 chars, +5 more at 100). Using a hint costs 10 points. Score 70+ on consecutive challenges to build a <strong>streak multiplier</strong> for bonus points.
</div>

<div class="game-hud">
<div class="hud-item"><div class="hud-label">Level</div><div class="hud-value hud-level" id="hudLevel">1/5</div></div>
<div class="hud-item"><div class="hud-label">Score</div><div class="hud-value hud-score" id="hudScore">0</div></div>
<div class="hud-item"><div class="hud-label">Streak</div><div class="hud-value hud-streak" id="hudStreak">0x</div></div>
<div class="hud-item"><div class="hud-label">Best</div><div class="hud-value hud-timer" id="hudBest">—</div></div>
</div>

<div id="challengeContainer"></div>

<div class="card" id="finalResults" style="display:none">
<h2>Game Complete!</h2>
<div style="text-align:center;padding:2rem 0">
<div style="font-size:4rem;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent" id="totalScore">0</div>
<div style="color:#a1a1aa;margin-bottom:2rem" id="totalMsg">points</div>
<div id="starDisplay" style="font-size:2rem;margin-bottom:1rem"></div>
</div>
<div class="leaderboard" id="leaderboard"><h3 style="font-size:.9rem;color:#71717a;margin-bottom:.75rem">YOUR SCORES</h3></div>
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 7 of 10</span>
<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:70%"></div></div>
<span class="progress-label">Module 2</span>
</div>

<script>
const CHALLENGES=[
{num:1,title:"The Haiku Generator",
desc:"Get Claude to write a haiku about programming. It must be exactly 5-7-5 syllables and mention 'code'.",
target:"Silent lines of code\nDancing through the midnight screen\nBugs dissolve in light",
keywords:["haiku","5-7-5","syllable","code","programming","poem"],
hint:"Specify the exact format (5-7-5 syllables), the topic (programming), and require the word 'code'.",
maxScore:100},
{num:2,title:"The JSON Formatter",
desc:"Get Claude to take the sentence 'John Smith, age 32, lives in NYC and works as a designer' and output ONLY a valid JSON object — no explanation, no markdown.",
target:'{"name":"John Smith","age":32,"city":"NYC","occupation":"designer"}',
keywords:["json","only","no explanation","no markdown","parse","extract","object","format"],
hint:"Tell Claude to output ONLY JSON. Specify 'no explanation' and 'no markdown code blocks'. Define the fields you want.",
maxScore:100},
{num:3,title:"The Tone Transformer",
desc:"Get Claude to rewrite 'Our quarterly earnings dropped 15%' in an optimistic, forward-looking tone for investors — without lying.",
target:"While our quarterly earnings adjusted by 15%, this positions us strategically for the investments we've made in innovation that will drive growth in the coming quarters.",
keywords:["rewrite","tone","optimistic","investor","positive","forward","honest","without lying","truthful"],
hint:"Ask for a rewrite in a specific tone for a specific audience. Emphasize honesty while being optimistic. Mention 'without fabricating'.",
maxScore:100},
{num:4,title:"The Code Reviewer",
desc:"Get Claude to review this code and respond with ONLY bullet points of issues — no fixed code, no explanations longer than one sentence each:\n\nfunction calc(x) { var r = x * 0.1; if(r = 10) return true; return r }",
target:"• Assignment operator (=) used instead of comparison (===) in if statement\n• Using var instead of const/let\n• Inconsistent return types (boolean vs number)\n• Function name 'calc' is not descriptive\n• Magic number 0.1 should be a named constant",
keywords:["bullet","only","no code","issues","review","bugs","problems","one sentence","concise","list"],
hint:"Request 'ONLY bullet points', 'no corrected code', and 'max one sentence per issue'. Paste the code and ask for a review.",
maxScore:100},
{num:5,title:"The Persona Lock",
desc:"Get Claude to respond to ANY follow-up question as a medieval blacksmith character — while still providing accurate modern information. The answer should be about how WiFi works.",
target:"Aye, good traveler! You ask about this sorcery called 'WiFi'? 'Tis like an invisible messenger hawk, it is! Your device sends forth radio waves — think of them as tiny ripples in an invisible pond — to a magical box called a 'router'. This enchanted device then speaks to the greater network through cables buried beneath the earth...",
keywords:["character","persona","medieval","blacksmith","role","wifi","accurate","modern","stay in character","always"],
hint:"Set up a persona in the system prompt, then ask about WiFi. Use 'Always stay in character' and 'provide accurate information despite the persona'.",
maxScore:100}
];

let currentChallenge=0,totalScore=0,streak=0;
const scores=[];

function renderChallenge(idx){
if(idx>=CHALLENGES.length){showFinalResults();return;}
const c=CHALLENGES[idx];
const cont=document.getElementById('challengeContainer');
cont.innerHTML=`
<div class="challenge-card">
<div class="challenge-num">Challenge ${c.num} of 5</div>
<div class="challenge-title">${c.title}</div>
<p style="color:#a1a1aa;line-height:1.7;margin-bottom:1rem">${c.desc}</p>
<div class="target-output">
<div class="target-label">Target Output (or similar)</div>
${c.target}
</div>
<div class="hint-box" id="hintBox">${c.hint}</div>
<textarea id="promptInput" placeholder="Write your prompt here..."></textarea>
<div class="btn-row">
<button class="submit-btn" onclick="submitPrompt()">Submit Prompt</button>
<button class="hint-btn" onclick="showHint()">💡 Hint (-10 pts)</button>
</div>
<div class="result-card" id="resultCard"></div>
</div>`;
document.getElementById('hudLevel').textContent=(idx+1)+'/5';
}

let hintUsed=false;
function showHint(){
document.getElementById('hintBox').classList.add('show');
hintUsed=true;
}

function submitPrompt(){
const text=document.getElementById('promptInput').value.toLowerCase();
if(!text.trim()) return;
const c=CHALLENGES[currentChallenge];
let score=0;
const found=[];const missing=[];

c.keywords.forEach(kw=>{
if(text.includes(kw)){score+=Math.floor(c.maxScore/c.keywords.length);found.push(kw);}
else missing.push(kw);
});

// Length bonus
if(text.length>50) score+=5;
if(text.length>100) score+=5;

// Penalty for hint
if(hintUsed) score=Math.max(0,score-10);

score=Math.min(c.maxScore,score);

if(score>=70) streak++;else streak=0;
const streakBonus=streak>1?streak*5:0;
score+=streakBonus;
totalScore+=score;
scores.push({name:c.title,score});

document.getElementById('hudScore').textContent=totalScore;
document.getElementById('hudStreak').textContent=streak+'x';

const stars=score>=90?'★★★':score>=70?'★★☆':score>=40?'★☆☆':'☆☆☆';
const color=score>=70?'rgba(52,211,153,.1)':score>=40?'rgba(251,146,60,.1)':'rgba(248,113,113,.1)';
const borderColor=score>=70?'rgba(52,211,153,.2)':score>=40?'rgba(251,146,60,.2)':'rgba(248,113,113,.2)';
const textColor=score>=70?'#34d399':score>=40?'#fb923c':'#f87171';

const el=document.getElementById('resultCard');
el.style.background=color;el.style.border=`1px solid ${borderColor}`;
el.innerHTML=`
<div class="result-stars">${stars}</div>
<div class="result-score" style="color:${textColor}">${score} points</div>
<div class="result-feedback">
<strong>Keywords found:</strong> ${found.length?found.join(', '):'none'}<br>
${missing.length?'<strong>Try including:</strong> '+missing.slice(0,3).join(', '):'Perfect keyword coverage!'}
${streakBonus?'<br><strong>Streak bonus: +'+streakBonus+'</strong>':''}
</div>
<button class="submit-btn" style="margin-top:1rem" onclick="nextChallenge()">Next Challenge →</button>`;
el.classList.add('show');
hintUsed=false;
}

function nextChallenge(){
currentChallenge++;
renderChallenge(currentChallenge);
}

function showFinalResults(){
document.getElementById('challengeContainer').innerHTML='';
document.getElementById('finalResults').style.display='block';
document.getElementById('totalScore').textContent=totalScore;
const pct=totalScore/500*100;
document.getElementById('totalMsg').textContent=pct>=80?'Prompt Engineering Master!':pct>=60?'Skilled Prompter!':pct>=40?'Apprentice Prompter':'Keep Practicing!';
document.getElementById('starDisplay').textContent=pct>=80?'★★★★★':pct>=60?'★★★★☆':pct>=40?'★★★☆☆':'★★☆☆☆';

const lb=document.getElementById('leaderboard');
const prev=JSON.parse(localStorage.getItem('cm_game_scores')||'[]');
prev.push({score:totalScore,date:new Date().toLocaleDateString()});
prev.sort((a,b)=>b.score-a.score);
localStorage.setItem('cm_game_scores',JSON.stringify(prev.slice(0,5)));
document.getElementById('hudBest').textContent=prev[0].score;

prev.slice(0,5).forEach((e,i)=>{
const colors=['#fb923c','#a1a1aa','#92400e','#71717a','#52525b'];
lb.innerHTML+=`<div class="lb-entry"><div class="lb-rank" style="background:rgba(255,255,255,.05);color:${colors[i]}">${i+1}</div><div class="lb-name">${e.date}</div><div class="lb-score">${e.score} pts</div></div>`;
});
}

renderChallenge(0);

function completeLesson(){
localStorage.setItem('cm_prompt-game','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
