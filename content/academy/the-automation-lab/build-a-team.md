---
title: "Build a Team"
course: "the-automation-lab"
order: 7
type: "builder"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="index.html" class="nav-link">Course Overview</a><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 7</div>
  <h1>Build a Team</h1>
  <p class="subtitle">Given a business goal, assemble the right team of agents. Choose wisely — wrong teams fail. Three scenarios of increasing difficulty.</p>

  <div class="scenario-nav" id="scen-nav"></div>

  <div class="game-header">
    <div class="game-mission"><div class="mission-label" id="mission-label">Mission 1 of 3</div><div class="mission-text" id="mission-text"></div><div class="mission-req" id="mission-req"></div></div>
    <div class="game-score"><div class="score-label">Score</div><div class="score-val" id="score">0</div></div>
  </div>

  <div class="game-area">
    <div class="pool"><div class="pool-title">&#129302; Agent Pool</div><div class="pool-agents" id="agent-pool"></div></div>
    <div class="team"><div class="team-title">&#128101; Your Team</div><div class="team-slots" id="team-slots"><span class="team-empty">Click agents to add them...</span></div></div>
  </div>

  <div class="game-controls">
    <button class="game-btn run" id="run-btn" onclick="runSim()" disabled>&#9889; Run Simulation</button>
    <button class="game-btn reset" onclick="resetTeam()">&#8634; Reset Team</button>
  </div>

  <div class="sim-output" id="sim-output"></div>
  <div class="result-card" id="result-card"><div class="result-icon" id="result-icon"></div><div class="result-text" id="result-text"></div><div class="result-detail" id="result-detail"></div></div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()" disabled>Complete Lesson &mdash; 350 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +350 XP earned</div>
  </div>
  <div class="lesson-nav">
    <a href="conflict-resolution.html">&larr; Conflict Resolution</a>
    <a href="cron-and-scheduling.html">Next: Cron &amp; Scheduling &rarr;</a>
  </div>
</div>
<div class="xp-toast" id="xp-toast">+350 XP earned! &#9889;</div>

<script>
const AGENTS=[
  {id:'writer',icon:'&#9997;&#65039;',name:'Content Writer',desc:'Generates blog posts, emails, social copy'},
  {id:'editor',icon:'&#128221;',name:'Editor',desc:'Reviews, fact-checks, improves content'},
  {id:'publisher',icon:'&#128640;',name:'Publisher',desc:'Deploys content to websites and platforms'},
  {id:'analyst',icon:'&#128202;',name:'Data Analyst',desc:'Analyzes metrics, generates reports'},
  {id:'monitor',icon:'&#128065;&#65039;',name:'Monitor',desc:'Watches systems for errors and anomalies'},
  {id:'scheduler',icon:'&#9200;',name:'Scheduler',desc:'Manages timing, cron jobs, queues'},
  {id:'notifier',icon:'&#128276;',name:'Notifier',desc:'Sends alerts via email, Slack, SMS'},
  {id:'guard',icon:'&#128737;&#65039;',name:'Guardian',desc:'Enforces rules, checks compliance, validates'}
];

const SCENARIOS=[
  {
    title:'Automate a Content Pipeline',
    req:'Required: content creation, quality control, and publishing. Team size: 3-4 agents.',
    required:['writer','editor','publisher'],
    optional:['scheduler'],
    maxSize:4,
    successLog:`[00:00] Writer: Generating "5 AI Trends for 2026"...
[00:03] Writer: Draft complete (1,400 words)
[00:04] Editor: Reviewing for accuracy...
[00:07] Editor: 3 corrections made, approved ✓
[00:08] Publisher: Deploying to /blog/5-ai-trends-2026
[00:10] Publisher: Live! ✓
[RESULT] Pipeline complete. Content published successfully.`,
    failReasons:{writer:'No content creator — who writes the posts?',editor:'No quality control — errors will reach production.',publisher:'No publisher — content sits in drafts forever.'}
  },
  {
    title:'Build a Self-Healing Server Monitor',
    req:'Required: monitoring, alerting, and safety checks. Team size: 3-4 agents.',
    required:['monitor','notifier','guard'],
    optional:['analyst'],
    maxSize:4,
    successLog:`[00:00] Monitor: Scanning 12 endpoints...
[00:02] Monitor: ⚠ API latency spike detected (2.3s)
[00:03] Guardian: Checking safety rules... restart allowed ✓
[00:04] Monitor: Restarting api-server-03...
[00:06] Monitor: Server healthy (latency: 45ms) ✓
[00:07] Notifier: Alert sent to #ops-channel
[RESULT] Issue detected, validated, fixed, and reported.`,
    failReasons:{monitor:'No monitor — nobody watching the servers.',notifier:'No alerting — fixes happen silently, team unaware.',guard:'No safety checks — agents could restart production recklessly.'}
  },
  {
    title:'Launch an Autonomous Analytics Pipeline',
    req:'Required: data analysis, reporting, scheduling, monitoring, and compliance. Team size: 4-5 agents.',
    required:['analyst','scheduler','monitor','guard'],
    optional:['notifier'],
    maxSize:5,
    successLog:`[00:00] Scheduler: Triggering daily analytics run...
[00:01] Analyst: Querying revenue data...
[00:04] Analyst: Report generated — MRR: $12,400 (+8%)
[00:05] Guardian: Checking PII compliance... clean ✓
[00:06] Monitor: Pipeline health: all green
[00:07] Analyst: Dashboard updated
[RESULT] Autonomous analytics running on schedule, compliant, monitored.`,
    failReasons:{analyst:'No analyst — who processes the data?',scheduler:'No scheduler — pipeline only runs when triggered manually.',monitor:'No monitoring — if the pipeline breaks, nobody knows.',guard:'No compliance checks — risk of exposing sensitive data.'}
  }
];

let currentScen=0,team=[],score=0,scenResults=[];
function init(){
  const nav=document.getElementById('scen-nav');
  nav.innerHTML=SCENARIOS.map((s,i)=>`<button class="scen-tab${i===0?' active':''}" onclick="switchScen(${i})">${i+1}. ${s.title.split(' ').slice(0,2).join(' ')}</button>`).join('');
  renderScen();
}

function switchScen(i){
  currentScen=i;team=[];
  document.querySelectorAll('.scen-tab').forEach((t,idx)=>{t.classList.toggle('active',idx===i);});
  renderScen();
}

function renderScen(){
  const s=SCENARIOS[currentScen];
  document.getElementById('mission-label').textContent=`Mission ${currentScen+1} of 3`;
  document.getElementById('mission-text').textContent=s.title;
  document.getElementById('mission-req').textContent=s.req;
  document.getElementById('score').textContent=score;
  const pool=document.getElementById('agent-pool');
  pool.innerHTML=AGENTS.map(a=>`<div class="agent-chip${team.includes(a.id)?' selected':''}" onclick="toggleAgent('${a.id}')" title="${a.desc}"><span class="chip-icon">${a.icon}</span>${a.name}</div>`).join('');
  const slots=document.getElementById('team-slots');
  if(team.length===0)slots.innerHTML='<span class="team-empty">Click agents to add them...</span>';
  else slots.innerHTML=team.map(id=>{const a=AGENTS.find(x=>x.id===id);return`<div class="agent-chip selected" onclick="toggleAgent('${id}')"><span class="chip-icon">${a.icon}</span>${a.name}</div>`;}).join('');
  document.getElementById('run-btn').disabled=team.length<2;
  document.getElementById('sim-output').style.display='none';
  document.getElementById('result-card').style.display='none';
}

function toggleAgent(id){
  const s=SCENARIOS[currentScen];
  if(team.includes(id)){team=team.filter(x=>x!==id);}
  else if(team.length<s.maxSize){team.push(id);}
  renderScen();
}

function resetTeam(){team=[];renderScen();}

function runSim(){
  const s=SCENARIOS[currentScen];
  const out=document.getElementById('sim-output');
  const res=document.getElementById('result-card');
  out.style.display='block';res.style.display='none';
  const missing=s.required.filter(r=>!team.includes(r));
  if(missing.length>0){
    const reason=s.failReasons[missing[0]];
    out.textContent=`[00:00] Initializing team: ${team.map(id=>AGENTS.find(a=>a.id===id).name).join(', ')}
[00:01] Checking requirements...
[00:02] CRITICAL: Missing ${AGENTS.find(a=>a.id===missing[0]).name}
[00:03] ${reason}
[FAIL] Simulation failed. Reassemble your team.`;
    res.style.display='block';res.className='result-card failure';
    document.getElementById('result-icon').textContent='&#10060;';
    document.getElementById('result-text').textContent='Mission Failed';
    document.getElementById('result-detail').textContent=reason;
    document.querySelectorAll('.scen-tab')[currentScen].classList.add('fail');
  } else {
    out.textContent=s.successLog;
    res.style.display='block';res.className='result-card success';
    document.getElementById('result-icon').textContent='&#9989;';
    document.getElementById('result-text').textContent='Mission Complete!';
    const bonus=team.some(id=>s.optional.includes(id))?'+50 bonus for optimal team':'';
    document.getElementById('result-detail').textContent=`Team performed perfectly. ${bonus}`;
    score+=100+(bonus?50:0);
    document.getElementById('score').textContent=score;
    scenResults[currentScen]=true;
    document.querySelectorAll('.scen-tab')[currentScen].classList.remove('fail');
    document.querySelectorAll('.scen-tab')[currentScen].classList.add('pass');
    if(scenResults.filter(Boolean).length>=2)document.getElementById('complete-btn').disabled=false;
  }
}

init();

function completeLsn(){
  if(localStorage.getItem('autolab-7')==='complete')return;
  localStorage.setItem('autolab-7','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-7')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
