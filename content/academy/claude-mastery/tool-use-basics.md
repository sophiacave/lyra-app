---
title: "Tool Use"
course: "claude-mastery"
order: 8
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 8 · Interactive</div>
<h1>Tool Use Basics</h1>
<p>Give Claude superpowers by connecting it to external tools</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 3</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Tool Use?</h2>
<p>By default, Claude can only process text. But with <strong>tool use</strong> (also called function calling), Claude can interact with the real world — search the web, query databases, call APIs, run code, and more. You define the tools, and Claude decides when and how to use them.</p>
<p>Think of tools as giving Claude hands to go with its brain.</p>
</div>

<div class="card">
<h2>Build a Tool Definition</h2>
<p>Define a tool that Claude can use. Fill in the fields below to see the JSON schema update in real-time.</p>

<div class="tool-builder">
<div>
<label>Tool Name</label>
<input type="text" id="toolName" placeholder="e.g., get_weather" value="get_weather" oninput="updatePreview()">
</div>
<div>
<label>Description</label>
<textarea id="toolDesc" placeholder="What does this tool do?" rows="2" oninput="updatePreview()">Get the current weather for a given location. Returns temperature, conditions, and humidity.</textarea>
</div>
<div>
<label>Parameters</label>
<div id="paramList">
<div class="param-row">
<div><label style="font-size:.7rem">Name</label><input type="text" class="p-name" value="location" oninput="updatePreview()"></div>
<div><label style="font-size:.7rem">Type</label><input type="text" class="p-type" value="string" oninput="updatePreview()"></div>
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">✕</button>
</div>
<div class="param-row">
<div><label style="font-size:.7rem">Name</label><input type="text" class="p-name" value="units" oninput="updatePreview()"></div>
<div><label style="font-size:.7rem">Type</label><input type="text" class="p-type" value="string" oninput="updatePreview()"></div>
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">✕</button>
</div>
</div>
<button class="add-param-btn" onclick="addParam()">+ Add Parameter</button>
</div>
</div>

</div>

<div class="card">
<h2>See It In Action</h2>
<p>Watch the complete tool use flow — from user prompt to final response:</p>

<div class="flow-container" id="flowContainer">
<div class="flow-step" id="step0">
<div class="flow-icon" style="background:rgba(139,92,246,.15)">💬</div>
<div class="flow-text"><strong>User sends a message</strong><span>"What's the weather in Tokyo?"</span></div>
<div class="flow-status" style="background:rgba(139,92,246,.15);color:#8b5cf6">Waiting</div>
</div>
<div class="flow-step" id="step1">
<div class="flow-icon" style="background:rgba(56,189,248,.15)">🧠</div>
<div class="flow-text"><strong>Claude analyzes and decides to use a tool</strong><span>Recognizes it needs real-time weather data</span></div>
<div class="flow-status" style="background:rgba(56,189,248,.15);color:#38bdf8">Waiting</div>
</div>
<div class="flow-step" id="step2">
<div class="flow-icon" style="background:rgba(251,146,60,.15)">🔧</div>
<div class="flow-text"><strong>Claude calls: get_weather(location: "Tokyo")</strong><span>Your app receives the tool call and executes it</span></div>
<div class="flow-status" style="background:rgba(251,146,60,.15);color:#fb923c">Waiting</div>
</div>
<div class="flow-step" id="step3">
<div class="flow-icon" style="background:rgba(52,211,153,.15)">📡</div>
<div class="flow-text"><strong>Tool returns result</strong><span>{"temp": 22, "condition": "Partly Cloudy", "humidity": 65}</span></div>
<div class="flow-status" style="background:rgba(52,211,153,.15);color:#34d399">Waiting</div>
</div>
<div class="flow-step" id="step4">
<div class="flow-icon" style="background:rgba(244,114,182,.15)">✨</div>
<div class="flow-text"><strong>Claude responds with natural language</strong><span>"It's currently 22°C and partly cloudy in Tokyo with 65% humidity."</span></div>
<div class="flow-status" style="background:rgba(244,114,182,.15);color:#f472b6">Waiting</div>
</div>
</div>

<button class="run-btn" id="runBtn" onclick="runFlow()">▶ Run the Flow</button>
</div>

<div class="card">
<h2>Key Concepts</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Claude decides when to use tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">You provide the tools, but Claude autonomously decides if and when to call them based on the user's request.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">You execute the tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude outputs a structured tool call. YOUR application runs the actual function and returns the result.</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Multi-step tool use</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude can chain multiple tool calls in sequence, using results from one tool to inform the next.</p>
</div>
</div>
</div>

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 8 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>

<script>
function updatePreview(){
const name=document.getElementById('toolName').value||'my_tool';
const desc=document.getElementById('toolDesc').value||'Description';
const params=[];
document.querySelectorAll('.param-row').forEach(row=>{
const n=row.querySelector('.p-name')?.value;
const t=row.querySelector('.p-type')?.value||'string';
if(n) params.push({name:n,type:t});
});

const propStr=params.map(p=>`    <span class="code-string">"${p.name}"</span>: { <span class="code-prop">"type"</span>: <span class="code-string">"${p.type}"</span> }`).join(',\n');
const reqStr=params.map(p=>`<span class="code-string">"${p.name}"</span>`).join(', ');

document.getElementById('codePreview').innerHTML=`{
  <span class="code-prop">"name"</span>: <span class="code-string">"${name}"</span>,
  <span class="code-prop">"description"</span>: <span class="code-string">"${desc}"</span>,
  <span class="code-prop">"input_schema"</span>: {
    <span class="code-prop">"type"</span>: <span class="code-string">"object"</span>,
    <span class="code-prop">"properties"</span>: {
${propStr}
    },
    <span class="code-prop">"required"</span>: [${reqStr}]
  }
}`;
}

function addParam(){
const list=document.getElementById('paramList');
const row=document.createElement('div');
row.className='param-row';
row.innerHTML=`<div><label style="font-size:.7rem">Name</label><input type="text" class="p-name" placeholder="param_name" oninput="updatePreview()"></div>
<div><label style="font-size:.7rem">Type</label><input type="text" class="p-type" placeholder="string" oninput="updatePreview()"></div>
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">✕</button>`;
list.appendChild(row);
}

updatePreview();

let flowRunning=false;
async function runFlow(){
if(flowRunning) return;
flowRunning=true;
document.getElementById('runBtn').disabled=true;

const steps=['step0','step1','step2','step3','step4'];
const statuses=['Sent','Thinking...','Executing...','Received','Complete'];
const statusColors=[
{bg:'rgba(139,92,246,.15)',color:'#8b5cf6'},
{bg:'rgba(56,189,248,.15)',color:'#38bdf8'},
{bg:'rgba(251,146,60,.15)',color:'#fb923c'},
{bg:'rgba(52,211,153,.15)',color:'#34d399'},
{bg:'rgba(244,114,182,.15)',color:'#f472b6'}
];

// Reset all
steps.forEach(id=>{
const el=document.getElementById(id);
el.classList.remove('active','done');
el.querySelector('.flow-status').textContent='Waiting';
});

for(let i=0;i<steps.length;i++){
await new Promise(r=>setTimeout(r,800));
if(i>0){
document.getElementById(steps[i-1]).classList.remove('active');
document.getElementById(steps[i-1]).classList.add('done');
document.getElementById(steps[i-1]).querySelector('.flow-status').textContent='Done';
document.getElementById(steps[i-1]).querySelector('.flow-status').style.background='rgba(52,211,153,.15)';
document.getElementById(steps[i-1]).querySelector('.flow-status').style.color='#34d399';
}
const el=document.getElementById(steps[i]);
el.classList.add('active');
el.querySelector('.flow-status').textContent=statuses[i];
el.querySelector('.flow-status').style.background=statusColors[i].bg;
el.querySelector('.flow-status').style.color=statusColors[i].color;
}

await new Promise(r=>setTimeout(r,800));
document.getElementById(steps[4]).classList.remove('active');
document.getElementById(steps[4]).classList.add('done');
document.getElementById(steps[4]).querySelector('.flow-status').textContent='Done';
document.getElementById(steps[4]).querySelector('.flow-status').style.background='rgba(52,211,153,.15)';
document.getElementById(steps[4]).querySelector('.flow-status').style.color='#34d399';

flowRunning=false;
document.getElementById('runBtn').disabled=false;
}

function completeLesson(){
localStorage.setItem('cm_tool-use','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
