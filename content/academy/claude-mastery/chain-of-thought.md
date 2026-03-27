---
title: "Chain of Thought"
course: "claude-mastery"
order: 5
type: "lesson"
free: false
---<div class="particle-container" id="particles"></div>
<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">
<a href="index.html" class="logo">Claude Mastery</a>
<a href="index.html" class="nav-link">← Back to Course</a>
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

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 5 of 10</span>
<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:50%"></div></div>
<span class="progress-label">Module 2</span>
</div>

<script>
const QUESTIONS=[
{nodes:[
{text:"Read the problem",x:20,y:30,type:"thought",delay:0},
{text:"Identify: 25% then 10%",x:200,y:60,type:"thought",delay:400},
{text:"These are sequential, not additive",x:100,y:120,type:"deduction",delay:800},
{text:"$200 × 0.75 = $150",x:300,y:150,type:"thought",delay:1200},
{text:"$150 × 0.90 = $135",x:150,y:210,type:"thought",delay:1600},
{text:"Total saved: $65",x:350,y:240,type:"deduction",delay:2000},
{text:"Answer: 32.5% discount = $135",x:200,y:300,type:"conclusion",delay:2400}
],lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
{nodes:[
{text:"All suspects in the room",x:30,y:30,type:"thought",delay:0},
{text:"Alice says Bob is lying",x:250,y:50,type:"thought",delay:400},
{text:"Bob says Carol did it",x:80,y:120,type:"thought",delay:800},
{text:"Carol says she was home",x:300,y:140,type:"thought",delay:1200},
{text:"If Alice is truthful → Bob lies",x:50,y:210,type:"deduction",delay:1600},
{text:"If Bob lies → Carol didn't do it",x:280,y:230,type:"deduction",delay:2000},
{text:"Answer: Carol is innocent",x:180,y:300,type:"conclusion",delay:2400}
],lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
{nodes:[
{text:"Read the error message",x:30,y:30,type:"thought",delay:0},
{text:"TypeError at line 42",x:250,y:50,type:"thought",delay:400},
{text:"Variable is undefined",x:100,y:120,type:"deduction",delay:800},
{text:"Check data flow upstream",x:300,y:140,type:"thought",delay:1200},
{text:"API returns null on error",x:50,y:210,type:"deduction",delay:1600},
{text:"Missing null check",x:280,y:230,type:"deduction",delay:2000},
{text:"Fix: Add optional chaining",x:180,y:300,type:"conclusion",delay:2400}
],lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]}
];

let currentQ=0,animating=false;

function selectQuestion(idx,btn){
currentQ=idx;
document.querySelectorAll('.q-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
resetCanvas();
}

function resetCanvas(){
const canvas=document.getElementById('thinkCanvas');
canvas.querySelectorAll('.node').forEach(n=>n.remove());
document.getElementById('connSvg').innerHTML='';
document.getElementById('playBtn').style.display='block';
animating=false;
}

function playAnimation(){
if(animating) return;
animating=true;
document.getElementById('playBtn').style.display='none';
const q=QUESTIONS[currentQ];
const canvas=document.getElementById('thinkCanvas');
const svg=document.getElementById('connSvg');

q.nodes.forEach((n,i)=>{
const node=document.createElement('div');
node.className=`node node-${n.type}`;
node.textContent=n.text;
node.style.left=n.x+'px';node.style.top=n.y+'px';
node.id='node-'+i;
canvas.appendChild(node);
setTimeout(()=>node.classList.add('show'),n.delay);
});

q.lines.forEach(([a,b],i)=>{
const line=document.createElementNS('http://www.w3.org/2000/svg','line');
const na=q.nodes[a],nb=q.nodes[b];
line.setAttribute('x1',na.x+60);line.setAttribute('y1',na.y+18);
line.setAttribute('x2',nb.x+60);line.setAttribute('y2',nb.y+18);
svg.appendChild(line);
setTimeout(()=>line.classList.add('show'),q.nodes[b].delay-200);
});
}

function analyzePrompt(){
const text=document.getElementById('cotPrompt').value.toLowerCase();
let score=0;const feedback=[];
if(text.includes('step')){score+=25;feedback.push('Uses "step" keyword');}
if(text.includes('think')||text.includes('reason')||text.includes('consider')){score+=25;feedback.push('Triggers reasoning mode');}
if(text.includes('before')||text.includes('first')||text.includes('then')){score+=20;feedback.push('Specifies ordering of thoughts');}
if(text.includes('constraint')||text.includes('rule')||text.includes('cannot')||text.includes("can't")){score+=15;feedback.push('Identifies constraints');}
if(text.length>80){score+=15;feedback.push('Sufficiently detailed prompt');}
if(score===0&&text.length<10){score=0;feedback.push('Try writing a more detailed prompt with reasoning instructions');}

const card=document.getElementById('scoreCard');
card.classList.add('show');
const circle=document.getElementById('scoreCircle');
circle.textContent=score;
if(score>=80){circle.style.background='rgba(52,211,153,.2)';circle.style.color='#34d399';}
else if(score>=50){circle.style.background='rgba(251,146,60,.2)';circle.style.color='#fb923c';}
else{circle.style.background='rgba(248,113,113,.2)';circle.style.color='#f87171';}
document.getElementById('scoreTitle').textContent=score>=80?'Excellent CoT Prompt!':score>=50?'Good Start!':'Needs More Detail';
document.getElementById('scoreText').textContent=feedback.join(' · ')+(score<80?'. Try adding: explicit step numbering, constraint identification, and reasoning triggers like "think carefully about each crossing."':'');
}

function completeLesson(){
localStorage.setItem('cm_chain-of-thought','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
