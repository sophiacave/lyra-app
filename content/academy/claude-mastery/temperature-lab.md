---
title: "Temperature Lab"
course: "claude-mastery"
order: 3
type: "lab"
free: true
---<div class="particle-container" id="particles"></div>
<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">
<a href="index.html" class="logo">Claude Mastery</a>
<a href="index.html" class="nav-link">← Back to Course</a>
</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 3 · Lab</div>
<h1>Temperature Lab</h1>
<p>See how temperature transforms AI output from precise to creative</p>
<div class="lesson-meta-bar">⏱ <span>60 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Temperature?</h2>
<p>Temperature controls the <strong>randomness</strong> of an AI's output. At temperature 0, the model always picks the most probable next word — making it deterministic and precise. At temperature 1, it considers a wider range of possibilities — making it creative and unpredictable.</p>
<div class="spectrum-bar">
<div class="spectrum-section" id="spec0" style="background:rgba(56,189,248,.3);color:#38bdf8">0.0<br>Precise</div>
<div class="spectrum-section" id="spec1" style="background:rgba(139,92,246,.3);color:#8b5cf6">0.25<br>Focused</div>
<div class="spectrum-section" id="spec2" style="background:rgba(139,92,246,.3);color:#c084fc">0.5<br>Balanced</div>
<div class="spectrum-section" id="spec3" style="background:rgba(251,146,60,.3);color:#fb923c">0.75<br>Creative</div>
<div class="spectrum-section" id="spec4" style="background:rgba(248,113,113,.3);color:#f87171">1.0<br>Wild</div>
</div>
</div>

<div class="card">
<h2>Temperature Playground</h2>
<p>Adjust the temperature slider and generate outputs to see the difference in real-time.</p>

<div class="temp-display">
<div class="temp-value" id="tempVal">0.50</div>
<div class="temp-label" id="tempLabel">Balanced</div>
</div>

<div class="slider-container">
<input type="range" id="tempSlider" min="0" max="100" value="50" oninput="updateTemp()">
<div class="slider-labels">
<span>0.0 — Deterministic</span>
<span>0.5 — Balanced</span>
<span>1.0 — Maximum Creativity</span>
</div>
</div>

<p style="font-size:.9rem;margin-top:1rem">Choose a prompt:</p>
<div class="prompt-selector">
<button class="prompt-btn active" onclick="selectPrompt(0,this)">Write a product name</button>
<button class="prompt-btn" onclick="selectPrompt(1,this)">Describe a sunset</button>
<button class="prompt-btn" onclick="selectPrompt(2,this)">Explain gravity</button>
<button class="prompt-btn" onclick="selectPrompt(3,this)">Write a story opener</button>
</div>

<button class="gen-btn" id="genBtn" onclick="generate()">Generate at Current Temperature</button>

<div class="output-grid">
<div class="output-box">
<div class="output-label" style="color:#38bdf8">🧊 Low Temperature (0.0-0.3)</div>
<div class="output-text" id="outLow">Click generate to see output...</div>
</div>
<div class="output-box">
<div class="output-label" style="color:#f87171">🔥 High Temperature (0.7-1.0)</div>
<div class="output-text" id="outHigh">Click generate to see output...</div>
</div>
</div>
</div>

<div class="card">
<h2>When to Use Each Temperature</h2>
<div style="display:grid;gap:1rem;margin-top:1rem">
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(56,189,248,.05);border-radius:10px;border:1px solid rgba(56,189,248,.1)">
<div style="font-size:1.5rem">🧊</div>
<div><strong style="color:#38bdf8">Temperature 0</strong><p style="font-size:.85rem;margin:0">Code generation, data extraction, math, factual Q&A, classification. When you need consistency and accuracy.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<div style="font-size:1.5rem">⚖️</div>
<div><strong style="color:#8b5cf6">Temperature 0.3-0.5</strong><p style="font-size:.85rem;margin:0">General conversation, summarization, editing, analysis. Good balance of reliability and naturalness.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<div style="font-size:1.5rem">🎨</div>
<div><strong style="color:#fb923c">Temperature 0.7-0.8</strong><p style="font-size:.85rem;margin:0">Creative writing, brainstorming, marketing copy, poetry. When you want variety and surprise.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(248,113,113,.05);border-radius:10px;border:1px solid rgba(248,113,113,.1)">
<div style="font-size:1.5rem">🔥</div>
<div><strong style="color:#f87171">Temperature 0.9-1.0</strong><p style="font-size:.85rem;margin:0">Experimental writing, wild brainstorming, artistic exploration. Output may be incoherent — use sparingly!</p></div>
</div>
</div>
</div>

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 3 of 10</span>
<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:30%"></div></div>
<span class="progress-label">Module 1</span>
</div>

<script>
const OUTPUTS={
0:{low:["SmartFlow Pro","SmartFlow Pro","SmartFlow Pro"],high:["NebulaForge Infinityx","Quantum Dreamweaver 3000","VelvetThunder Pulse"]},
1:{low:["The sun descends below the horizon, casting warm orange and pink hues across the sky. Wispy clouds reflect the fading light, creating a gradient from deep blue to soft amber. The landscape darkens as the last rays disappear.","The sun sets below the horizon, painting the sky in shades of orange, pink, and purple. Clouds catch the remaining light, creating a warm glow that gradually fades to twilight.","The sun lowers toward the horizon, creating a display of warm colors across the western sky. Orange and pink bands stretch across scattered clouds as daylight fades to dusk."],high:["The sky bleeds marmalade and crushed violets as the sun melts into the earth like a gold coin dropped into dark water — and for one trembling moment, the whole world holds its breath in amber.","Imagine a painter who's furious and tender all at once, slashing the horizon with cadmium and regret. The sun doesn't set — it surrenders, dissolving into the sea like a secret told too loudly.","The sun pirouettes on the edge of forever, trailing scarves of tangerine and crushed ruby. Below, the ocean swallows the light whole, belching up phosphorescent stars in return."]},
2:{low:["Gravity is a fundamental force of nature that attracts objects with mass toward one another. The strength of gravitational attraction depends on the masses of the objects and the distance between them, as described by Newton's law of universal gravitation: F = G(m1 × m2)/r².","Gravity is the force that pulls objects with mass toward each other. On Earth, this means objects fall toward the ground at approximately 9.8 m/s². Einstein's general relativity describes gravity as the curvature of spacetime caused by mass and energy.","Gravity is a fundamental force that causes all objects with mass or energy to attract one another. It keeps planets in orbit around stars and holds galaxies together. Newton described it mathematically, and Einstein later explained it as curvature in spacetime."],high:["Picture the universe as a vast trampoline, and every planet, star, and galaxy is a bowling ball resting on its surface. They create dips — dimples in the fabric of reality itself. That's gravity: not a force pulling you down, but spacetime bending beneath your feet, whispering 'this way, fall this way.'","What if I told you that you're not standing on Earth — Earth is accelerating upward into your feet? That's one way to think about gravity through Einstein's eyes. Mass doesn't pull; it warps the very stage on which reality performs its dance.","Gravity is the universe's oldest love story. Every atom yearns for every other atom across the void. Stars court planets, galaxies embrace in spiraling waltzes that last billions of years. It's the weakest force and yet it sculpts everything."]},
3:{low:["The letter arrived on a Tuesday morning, unremarkable except for the fact that it was addressed to someone who had been dead for seven years.","She found the door unlocked when she came home, which was strange because she lived alone and always locked it twice.","The first sign that something was wrong came at 3:47 AM, when every phone in the city rang simultaneously."],high:["The whale fell from the sky on a Wednesday, and honestly, Mira thought, that was the least weird thing about her week.","In the space between one heartbeat and the next, the universe blinked — and when it opened its eyes again, gravity had learned to flow sideways.","They say you shouldn't name the things that live in the walls. But when the scratching spelled out M-O-T-H-E-R in Morse code, naming felt like the least of my problems."]}
};

let currentPrompt=0,isGenerating=false;

function updateTemp(){
const v=document.getElementById('tempSlider').value/100;
const display=document.getElementById('tempVal');
display.textContent=v.toFixed(2);
const labels=['Deterministic','Focused','Balanced','Creative','Wild'];
const colors=['#38bdf8','#8b5cf6','#c084fc','#fb923c','#f87171'];
const idx=Math.min(Math.floor(v*5),4);
display.style.color=colors[idx];
document.getElementById('tempLabel').textContent=labels[idx];
document.getElementById('tempLabel').style.color=colors[idx];
// Update slider gradient
const sl=document.getElementById('tempSlider');
sl.style.background=`linear-gradient(90deg,#38bdf8,#8b5cf6 25%,#c084fc 50%,#fb923c 75%,#f87171)`;
// Highlight spectrum
for(let i=0;i<5;i++){
document.getElementById('spec'+i).classList.toggle('active',i===idx);
}
}

function selectPrompt(idx,btn){
currentPrompt=idx;
document.querySelectorAll('.prompt-btn').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
}

async function typeText(el,text,speed=25){
el.textContent='';
for(let i=0;i<text.length;i++){
el.textContent+=text[i];
await new Promise(r=>setTimeout(r,speed+Math.random()*15));
}
}

async function generate(){
if(isGenerating) return;
isGenerating=true;
document.getElementById('genBtn').disabled=true;
const outs=OUTPUTS[currentPrompt];
const ri=Math.floor(Math.random()*3);
const lowEl=document.getElementById('outLow');
const highEl=document.getElementById('outHigh');
lowEl.innerHTML='<span class="cursor"></span>';
highEl.innerHTML='<span class="cursor"></span>';
await Promise.all([
typeText(lowEl,outs.low[ri],20),
typeText(highEl,outs.high[ri],25)
]);
isGenerating=false;
document.getElementById('genBtn').disabled=false;
}

// Init slider visual
updateTemp();
const sl=document.getElementById('tempSlider');
sl.style.background='linear-gradient(90deg,#38bdf8,#8b5cf6 25%,#c084fc 50%,#fb923c 75%,#f87171)';

function completeLesson(){
localStorage.setItem('cm_temperature-lab','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
