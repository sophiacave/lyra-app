---
title: "Orchestration Patterns"
course: "the-automation-lab"
order: 5
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 5</div>
  <h1>Orchestration Patterns</h1>
  <p class="subtitle">Four patterns for coordinating multiple agents. Each solves different problems. Click a pattern to see it animate, then quiz yourself on when to use which.</p>

  <div class="patterns-grid">
    <div class="pattern-card active" onclick="selectPattern(0)"><div class="pattern-icon">&#8594;</div><div class="pattern-name">Pipeline</div><div class="pattern-desc">A &rarr; B &rarr; C. Sequential. Each agent's output becomes the next agent's input.</div></div>
    <div class="pattern-card" onclick="selectPattern(1)"><div class="pattern-icon">&#128268;</div><div class="pattern-name">Fan-Out</div><div class="pattern-desc">A &rarr; B, C, D. Parallel. One agent triggers many simultaneously.</div></div>
    <div class="pattern-card" onclick="selectPattern(2)"><div class="pattern-icon">&#128065;&#65039;</div><div class="pattern-name">Supervisor</div><div class="pattern-desc">S monitors A, B, C. Overseer watches workers and intervenes when needed.</div></div>
    <div class="pattern-card" onclick="selectPattern(3)"><div class="pattern-icon">&#129704;</div><div class="pattern-name">Swarm</div><div class="pattern-desc">All agents coordinate peer-to-peer. No hierarchy. Emergent behavior.</div></div>
  </div>

  <div class="pattern-demo">
    <div class="demo-header">
      <div class="demo-title" id="demo-title">Pipeline Pattern</div>
      <button class="demo-play" onclick="playDemo()">&#9654; Animate</button>
    </div>
    </div>

  <h2 class="section-title">&#129504; When to Use Which?</h2>
  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 350 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +350 XP earned</div>
  </div>
  </div>
<div class="xp-toast" id="xp-toast">+350 XP earned! &#9889;</div>

<script>
const PATTERNS=[
  {name:'Pipeline Pattern',html:`<div class="d-row"><div class="d-node" id="n0">&#129302;<div class="d-node-label">Writer</div></div><div class="d-arrow" id="a01">&#8594;</div><div class="d-node" id="n1">&#129302;<div class="d-node-label">Editor</div></div><div class="d-arrow" id="a12">&#8594;</div><div class="d-node" id="n2">&#129302;<div class="d-node-label">Publisher</div></div></div>`,
   steps:[[{node:'n0',mode:'active'},{log:'Writer: Generating draft...'}],[{arrow:'a01',lit:true},{log:'Writer: Passing to Editor'}],[{node:'n0',mode:'done'},{node:'n1',mode:'active'},{log:'Editor: Reviewing & editing...'}],[{arrow:'a12',lit:true},{log:'Editor: Passing to Publisher'}],[{node:'n1',mode:'done'},{node:'n2',mode:'active'},{log:'Publisher: Deploying to site...'}],[{node:'n2',mode:'done'},{log:'✓ Pipeline complete'}]]},
  {name:'Fan-Out Pattern',html:`<div class="d-row" style="margin-bottom:1.5rem"><div class="d-node" id="n0">&#129302;<div class="d-node-label">Dispatcher</div></div></div><div class="d-row"><div class="d-node" id="n1">&#129302;<div class="d-node-label">Email</div></div><div class="d-node" id="n2">&#129302;<div class="d-node-label">Slack</div></div><div class="d-node" id="n3">&#129302;<div class="d-node-label">Twitter</div></div></div>`,
   steps:[[{node:'n0',mode:'active'},{log:'Dispatcher: New content ready...'}],[{node:'n0',mode:'done'},{node:'n1',mode:'active'},{node:'n2',mode:'active'},{node:'n3',mode:'active'},{log:'Fan-out: All 3 agents triggered simultaneously'}],[{log:'Email: Sending newsletter...'}],[{log:'Slack: Posting to channel...'}],[{node:'n1',mode:'done'},{node:'n2',mode:'done'},{node:'n3',mode:'done'},{log:'✓ All 3 agents completed in parallel'}]]},
  {name:'Supervisor Pattern',html:`<div class="d-row" style="margin-bottom:1.5rem"><div class="d-node" id="n0" style="border-color:rgba(251,146,60,.3)">&#128065;&#65039;<div class="d-node-label">Supervisor</div></div></div><div class="d-row"><div class="d-node" id="n1">&#129302;<div class="d-node-label">Agent A</div></div><div class="d-node" id="n2">&#129302;<div class="d-node-label">Agent B</div></div><div class="d-node" id="n3">&#129302;<div class="d-node-label">Agent C</div></div></div>`,
   steps:[[{node:'n0',mode:'active'},{log:'Supervisor: Monitoring workers...'}],[{node:'n1',mode:'active'},{node:'n2',mode:'active'},{node:'n3',mode:'active'},{log:'All workers running...'}],[{node:'n2',mode:'done',style:'border-color:#ef4444;box-shadow:0 0 15px rgba(239,68,68,.3)'},{log:'⚠ Agent B: ERROR — timeout'}],[{node:'n0',mode:'active'},{log:'Supervisor: Detected failure, restarting B...'}],[{node:'n2',mode:'active'},{log:'Supervisor: Agent B restarted'}],[{node:'n1',mode:'done'},{node:'n2',mode:'done'},{node:'n3',mode:'done'},{node:'n0',mode:'done'},{log:'✓ All workers healthy. Supervisor at rest.'}]]},
  {name:'Swarm Pattern',html:`<div class="d-row" style="flex-wrap:wrap;gap:1.5rem"><div class="d-node" id="n0">&#129302;<div class="d-node-label">A</div></div><div class="d-node" id="n1">&#129302;<div class="d-node-label">B</div></div><div class="d-node" id="n2">&#129302;<div class="d-node-label">C</div></div><div class="d-node" id="n3">&#129302;<div class="d-node-label">D</div></div></div>`,
   steps:[[{node:'n0',mode:'active'},{log:'A: I see a task — claiming it'}],[{node:'n1',mode:'active'},{node:'n2',mode:'active'},{log:'B,C: Coordinating on subtasks'}],[{node:'n3',mode:'active'},{log:'D: Picking up overflow from A'}],[{node:'n0',mode:'done'},{log:'A: Done. Releasing resources.'}],[{node:'n1',mode:'done'},{node:'n2',mode:'done'},{node:'n3',mode:'done'},{log:'✓ Swarm self-organized and completed.'}]]}
];

let currentPattern=0,demoRunning=false;
function selectPattern(i){
  currentPattern=i;
  document.querySelectorAll('.pattern-card').forEach((c,idx)=>c.classList.toggle('active',idx===i));
  renderDemo();
}

function renderDemo(){
  const p=PATTERNS[currentPattern];
  document.getElementById('demo-title').textContent=p.name;
  document.getElementById('demo-canvas').innerHTML=p.html;
  document.getElementById('demo-log').textContent='Click "Animate" to watch the pattern in action...';
}

function playDemo(){
  if(demoRunning)return;demoRunning=true;
  renderDemo();
  const p=PATTERNS[currentPattern];
  const log=document.getElementById('demo-log');log.textContent='';
  let delay=0;
  p.steps.forEach((actions,i)=>{
    delay+=900;
    setTimeout(()=>{
      actions.forEach(a=>{
        if(a.node){const n=document.getElementById(a.node);if(n){n.classList.remove('active','done');n.classList.add(a.mode);if(a.style)n.style.cssText=a.style;}}
        if(a.arrow){const ar=document.getElementById(a.arrow);if(ar)ar.classList.toggle('lit',a.lit);}
        if(a.log){log.textContent+=a.log+'\n';log.scrollTop=log.scrollHeight;}
      });
      if(i===p.steps.length-1)demoRunning=false;
    },delay);
  });
}

renderDemo();

// Quiz
const QUIZZES=[
  {q:'You need to process user uploads: validate → resize → store → notify. What pattern?',opts:['Pipeline','Fan-Out','Supervisor','Swarm'],correct:0,fb:'Sequential processing where each step depends on the previous — classic Pipeline.'},
  {q:'A new blog post needs to be shared on Twitter, LinkedIn, Email, and Slack simultaneously. What pattern?',opts:['Pipeline','Fan-Out','Supervisor','Swarm'],correct:1,fb:'One trigger, multiple independent actions in parallel — Fan-Out.'},
  {q:'You have 5 unreliable scraping agents and need one to watch them all and restart failures. What pattern?',opts:['Pipeline','Fan-Out','Supervisor','Swarm'],correct:2,fb:'A dedicated overseer monitoring workers — Supervisor pattern.'}
];
let qIdx=0;
function renderQuiz(){
  const qz=document.getElementById('quiz-section');
  if(qIdx>=QUIZZES.length){qz.innerHTML='<div style="text-align:center;padding:1rem;color:#22c55e;font-weight:600">All questions answered! Great work.</div>';return;}
  const q=QUIZZES[qIdx];
  qz.innerHTML=`<div class="quiz-q"><strong>Q${qIdx+1}.</strong> ${q.q}</div><div class="quiz-opts">${q.opts.map((o,i)=>`<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`).join('')}</div>`;
}
function answerQuiz(i){
  const q=QUIZZES[qIdx];
  const btns=document.querySelectorAll('.quiz-opt');
  btns.forEach((b,idx)=>{b.disabled=true;b.classList.add(idx===q.correct?'correct':'wrong');});
  btns[i].classList.remove('correct','wrong');btns[i].classList.add(i===q.correct?'correct':'wrong');
  const fb=document.getElementById('quiz-fb');fb.style.display='block';fb.textContent=q.fb;
  setTimeout(()=>{qIdx++;renderQuiz();},1200);
}
renderQuiz();

function completeLsn(){
  if(localStorage.getItem('autolab-5')==='complete')return;
  localStorage.setItem('autolab-5','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-5')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
