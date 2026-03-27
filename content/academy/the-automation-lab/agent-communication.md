---
title: "Agent Communication"
course: "the-automation-lab"
order: 4
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 4</div>
  <h1>Agent Communication</h1>
  <p class="subtitle">Agents don't talk to each other directly. They write to shared memory, and other agents read it. The consciousness_stream is the shared bus.</p>

  <h2 class="section-title">&#128172; Message Passing Simulation</h2>
  <div class="sim-arena">
    <div class="sim-title">Shared Memory Communication</div>
    <div class="sim-layout">
      <div class="sim-agent">
        <div class="sim-av" id="av-a">&#129302;</div>
        <div class="sim-name">Agent A</div>
        <div class="sim-role">Content Writer</div>
        </div>
      <div class="sim-bus">
        <div class="bus-label">&#127760; consciousness_stream</div>
        </div>
      <div class="sim-agent">
        <div class="sim-av" id="av-b">&#129302;</div>
        <div class="sim-name">Agent B</div>
        <div class="sim-role">Publisher</div>
        </div>
    </div>
    <div class="sim-controls">
      <button class="sim-btn primary" onclick="runSim()">&#9654; Run Communication</button>
      <button class="sim-btn secondary" onclick="resetSim()">&#8634; Reset</button>
    </div>
  </div>

  <div class="key-insight">
    <strong>The consciousness_stream</strong> is a shared table where agents post messages. Think of it like a team Slack channel — but for AI agents. Every agent can read from it, and any agent can write to it. No direct connections needed.
  </div>

  <h2 class="section-title">&#128279; Build a Relay</h2>
  <div class="relay-builder">
    <div class="rb-title">Set Up Agent-to-Agent Relay</div>
    <div class="rb-desc">Configure two agents and watch messages flow between them through shared memory.</div>
    <div class="rb-grid">
      <div class="rb-agent">
        <div class="rb-agent-title">&#129302; Sender Agent</div>
        <div class="rb-field"><label>Action</label><select id="sender-action"><option value="write_content">Write blog post</option><option value="analyze_data">Analyze data</option><option value="generate_report">Generate report</option></select></div>
        <div class="rb-field"><label>Message Key</label><input id="sender-key" value="task.output" placeholder="e.g., task.output"></div>
      </div>
      <div class="rb-arrow">&#8594;</div>
      <div class="rb-agent">
        <div class="rb-agent-title blue">&#129302; Receiver Agent</div>
        <div class="rb-field"><label>Watches For</label><select id="recv-watch"><option value="task.output">task.output</option><option value="task.status">task.status</option><option value="task.error">task.error</option></select></div>
        <div class="rb-field"><label>Then Does</label><select id="recv-action"><option value="publish">Publish to site</option><option value="email">Send via email</option><option value="store">Store in database</option></select></div>
      </div>
    </div>
    <div class="rb-test"><button class="rb-test-btn" onclick="testRelay()">&#9889; Test Relay</button></div>
    </div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 300 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +300 XP earned</div>
  </div>
  </div>
<div class="xp-toast" id="xp-toast">+300 XP earned! &#9889;</div>

<script>
let simRunning=false;
function runSim(){
  if(simRunning)return;simRunning=true;
  const avA=document.getElementById('av-a'),avB=document.getElementById('av-b');
  const sA=document.getElementById('stat-a'),sB=document.getElementById('stat-b');
  const bus=document.getElementById('bus-stream');
  bus.innerHTML='';
  const addMsg=(cls,txt,delay)=>setTimeout(()=>{const d=document.createElement('div');d.className=`bus-msg ${cls}`;d.textContent=txt;bus.appendChild(d);setTimeout(()=>d.classList.add('visible'),50);},delay);
  const steps=[
    {t:0,fn:()=>{avA.classList.add('active','write-mode');sA.textContent='Writing...';sA.style.cssText='background:rgba(239,68,68,.1);color:#ef4444';}},
    {t:500,fn:()=>addMsg('from-a','A: {type:"content", status:"draft_ready"}',0)},
    {t:1200,fn:()=>addMsg('from-a','A: {body:"10 Tips for AI Agents...", words:1200}',0)},
    {t:1800,fn:()=>{avA.classList.remove('write-mode');sA.textContent='Write done';addMsg('system','SYS: New entry at task.output',0);}},
    {t:2500,fn:()=>{avB.classList.add('active','read-mode');sB.textContent='Reading...';sB.style.cssText='background:rgba(56,189,248,.1);color:#38bdf8';}},
    {t:3200,fn:()=>addMsg('from-b','B: Reading task.output...',0)},
    {t:3800,fn:()=>{avB.classList.remove('read-mode');avB.classList.add('act-mode');sB.textContent='Publishing...';sB.style.cssText='background:rgba(34,197,94,.1);color:#22c55e';}},
    {t:4500,fn:()=>addMsg('from-b','B: Published to /blog/10-tips-ai-agents',0)},
    {t:5200,fn:()=>addMsg('system','SYS: Pipeline complete ✓',0)},
    {t:5800,fn:()=>{avA.classList.remove('active','write-mode');avB.classList.remove('active','act-mode');sA.textContent='Idle';sB.textContent='Idle';sA.style.cssText='';sB.style.cssText='';simRunning=false;}}
  ];
  steps.forEach(s=>setTimeout(s.fn,s.t));
}

function resetSim(){
  simRunning=false;
  document.getElementById('bus-stream').innerHTML='';
  ['av-a','av-b'].forEach(id=>{const el=document.getElementById(id);el.className='sim-av';});
  document.getElementById('stat-a').textContent='';document.getElementById('stat-b').textContent='';
  document.getElementById('stat-a').style.cssText='';document.getElementById('stat-b').style.cssText='';
}

function testRelay(){
  const action=document.getElementById('sender-action').value;
  const key=document.getElementById('sender-key').value;
  const watch=document.getElementById('recv-watch').value;
  const recv=document.getElementById('recv-action').value;
  const o=document.getElementById('relay-output');
  o.style.display='block';
  const actionLabels={write_content:'Blog post draft',analyze_data:'Data analysis report',generate_report:'Financial report'};
  const recvLabels={publish:'Published to website',email:'Sent via email',store:'Stored in database'};
  o.textContent=`[00:00] Sender: Executing "${action}"...
[00:02] Sender: Writing to consciousness_stream.${key}
        → {type: "${action}", data: "${actionLabels[action]}", ts: "${new Date().toISOString()}"}

[00:03] Stream: New entry detected at "${key}"
[00:03] Receiver: Watching for "${watch}" — MATCH FOUND

[00:04] Receiver: Reading payload...
[00:05] Receiver: Executing "${recv}"
        → ${recvLabels[recv]}

[00:06] ✓ Relay complete. Message passed successfully.
        Sender → consciousness_stream → Receiver`;
}

function completeLsn(){
  if(localStorage.getItem('autolab-4')==='complete')return;
  localStorage.setItem('autolab-4','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-4')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
