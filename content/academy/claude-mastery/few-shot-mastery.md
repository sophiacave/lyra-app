---
title: "Few-Shot Prompting"
course: "claude-mastery"
order: 6
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 6 · Builder</div>
<h1>Few-Shot Mastery</h1>
<p>Teach Claude any pattern with just a few examples</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Few-Shot Prompting?</h2>
<p>Few-shot prompting means giving Claude a few examples of the input-output pattern you want, then letting it generalize to new inputs. It's like teaching by showing rather than explaining — and it works remarkably well.</p>

<div class="visual-diagram">
<div class="visual-step">
<div class="step-icon" style="background:rgba(251,146,60,.15);color:#fb923c">📥</div>
<div class="step-text"><strong>Example 1: Input → Output</strong><span>Claude observes the first pattern</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(139,92,246,.15);color:#8b5cf6">📥</div>
<div class="step-text"><strong>Example 2: Input → Output</strong><span>Pattern recognition strengthens</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(56,189,248,.15);color:#38bdf8">📥</div>
<div class="step-text"><strong>Example 3: Input → Output</strong><span>Claude now deeply understands the pattern</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(52,211,153,.15);color:#34d399">✨</div>
<div class="step-text"><strong>New Input → Claude generates correct output!</strong><span>Pattern is applied to novel inputs</span></div>
</div>
</div>
</div>

<div class="card">
<h2>Interactive Few-Shot Builder</h2>
<p>Build your own few-shot prompt by adding example pairs. Then test with new inputs to see if Claude would learn the pattern.</p>

<div id="examplePairs">
<div class="example-pair" data-idx="0">
<div class="example-input">
<span class="example-label label-in">Input</span>
<input type="text" id="in-0" placeholder="Example input..." value="The movie was absolutely fantastic!">
</div>
<div class="example-arrow">→</div>
<div class="example-output">
<span class="example-label label-out">Output</span>
<input type="text" id="out-0" placeholder="Expected output..." value="Positive">
</div>
</div>
<div class="example-pair" data-idx="1">
<div class="example-input">
<span class="example-label label-in">Input</span>
<input type="text" id="in-1" placeholder="Example input..." value="I wasted two hours of my life on this terrible film.">
</div>
<div class="example-arrow">→</div>
<div class="example-output">
<span class="example-label label-out">Output</span>
<input type="text" id="out-1" placeholder="Expected output..." value="Negative">
</div>
</div>
<div class="example-pair" data-idx="2">
<div class="example-input">
<span class="example-label label-in">Input</span>
<input type="text" id="in-2" placeholder="Example input..." value="It was okay, nothing special but not bad either.">
</div>
<div class="example-arrow">→</div>
<div class="example-output">
<span class="example-label label-out">Output</span>
<input type="text" id="out-2" placeholder="Expected output..." value="Neutral">
</div>
</div>
</div>
<button class="add-btn" onclick="addExamplePair()">+ Add Another Example</button>

<div class="test-section">
<p><strong>Test your pattern:</strong></p>
<div class="test-input">
<input type="text" id="testInput" placeholder="Enter a new input to classify...">
<button class="test-btn" onclick="testPattern()">Test →</button>
</div>
</div>
</div>

<div class="card">
<h2>Few-Shot Best Practices</h2>
<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Use 3-5 examples</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Too few and the pattern is ambiguous. Too many wastes tokens. 3-5 is the sweet spot.</p>
</div>
<div style="padding:1rem;background:rgba(56,189,248,.05);border-radius:10px;border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8">Cover edge cases</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Include examples that represent boundary conditions or tricky cases.</p>
</div>
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Be consistent in format</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">All examples should follow the exact same structure and formatting.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">Order matters</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Put the most representative example first and the most complex one last.</p>
</div>
</div>
</div>

<div class="card">
<div class="challenge-box">
<h3>Challenge: Build a Sentiment Classifier</h3>
<p style="font-size:.85rem;color:#a1a1aa">Using the few-shot builder above, create a classifier that can accurately categorize movie reviews as Positive, Negative, or Neutral. Test it with these tricky inputs:</p>
<div style="margin-top:.75rem;display:flex;flex-direction:column;gap:.5rem">
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"The acting was great but the plot made no sense"</div>
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"I wouldn't say I hated it, but I'd never watch it again"</div>
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"My kids loved it, I slept through it — 5 stars"</div>
</div>
</div>
</div>

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 6 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>

<script>
let pairCount=3;

function addExamplePair(){
const container=document.getElementById('examplePairs');
const idx=pairCount++;
const pair=document.createElement('div');
pair.className='example-pair';
pair.dataset.idx=idx;
pair.innerHTML=`
<div class="example-input"><span class="example-label label-in">Input</span><input type="text" id="in-${idx}" placeholder="Example input..."></div>
<div class="example-arrow">→</div>
<div class="example-output"><span class="example-label label-out">Output</span><input type="text" id="out-${idx}" placeholder="Expected output..."></div>`;
container.appendChild(pair);
}

function testPattern(){
const input=document.getElementById('testInput').value.toLowerCase();
if(!input.trim()) return;

// Gather examples to determine pattern
const pairs=[];
document.querySelectorAll('.example-pair').forEach(p=>{
const idx=p.dataset.idx;
const inp=document.getElementById('in-'+idx)?.value||'';
const out=document.getElementById('out-'+idx)?.value||'';
if(inp&&out) pairs.push({input:inp.toLowerCase(),output:out});
});

// Simple sentiment analysis simulation
const posWords=['fantastic','great','amazing','wonderful','loved','excellent','brilliant','awesome','beautiful','perfect','best','incredible','outstanding','superb','good','enjoy','fun','happy','5 stars'];
const negWords=['terrible','awful','bad','worst','horrible','waste','boring','disappointed','hate','poor','stupid','ugly','disaster','pathetic','painful','hated','never watch','slept through'];
const neutralWords=['okay','fine','average','decent','mediocre','nothing special','alright','so-so','not bad'];

let posScore=0,negScore=0,neutScore=0;
posWords.forEach(w=>{if(input.includes(w)) posScore++});
negWords.forEach(w=>{if(input.includes(w)) negScore++});
neutralWords.forEach(w=>{if(input.includes(w)) neutScore++});

let result,confidence;
if(posScore>negScore&&posScore>neutScore){result='Positive';confidence=Math.min(95,60+posScore*15);}
else if(negScore>posScore&&negScore>neutScore){result='Negative';confidence=Math.min(95,60+negScore*15);}
else if(neutScore>0){result='Neutral';confidence=Math.min(90,55+neutScore*15);}
else if(posScore>0&&negScore>0){result='Mixed/Neutral';confidence=45;}
else{result=pairs.length>0?pairs[0].output:'Unknown';confidence=30;}

const el=document.getElementById('testResult');
el.classList.add('show');
const color=result.includes('Pos')?'#34d399':result.includes('Neg')?'#f87171':'#fb923c';
el.innerHTML=`<strong style="color:${color}">Predicted: ${result}</strong> <span style="color:#71717a">(${confidence}% confidence based on ${pairs.length} training examples)</span>
<p style="font-size:.8rem;color:#a1a1aa;margin-top:.5rem">In a real API call, Claude would analyze the patterns from your ${pairs.length} examples and apply them to this new input. More diverse examples = better accuracy.</p>`;
}

function completeLesson(){
localStorage.setItem('cm_few-shot','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
