---
title: "Monitoring and Healing"
course: "the-automation-lab"
order: 9
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 3 &bull; Lesson 9</div>
  <h1>Monitoring &amp; Healing</h1>
  <p class="subtitle">An autonomous system isn't complete until it can watch itself and fix its own problems. Build the watchers that watch the workers.</p>

  <h2 class="section-title">&#128200; Live Agent Dashboard</h2>
  <div class="dashboard">
    <div class="dash-title"><span class="dash-label">Agent Status Monitor</span><span class="dash-time" id="dash-time"></span></div>
    <div class="inspect-panel" id="inspect-panel">
      <div class="ip-header"><span class="ip-name" id="ip-name"></span><button class="ip-close" onclick="closeInspect()">&times;</button></div>
      <p style="font-size:.8rem;color:#71717a;margin-bottom:.5rem">Choose the right fix:</p>
      </div>
  </div>

  <h2 class="section-title">&#129657; Build an Auto-Healer</h2>
  <div class="healer-section">
    <div class="heal-title">Auto-Healer Configuration</div>
    <div class="heal-desc">An auto-healer is an agent that watches other agents and automatically fixes problems. Configure yours below.</div>
    <div class="heal-config">
      <div class="hc-field"><label>Watch Target</label><select id="h-target" onchange="updateHealPreview()"><option value="all">All Agents</option><option value="critical">Critical Only</option><option value="content">Content Pipeline</option></select></div>
      <div class="hc-field"><label>Check Interval</label><select id="h-interval" onchange="updateHealPreview()"><option value="30s">Every 30 seconds</option><option value="1m">Every minute</option><option value="5m">Every 5 minutes</option></select></div>
      <div class="hc-field"><label>On Error</label><select id="h-error" onchange="updateHealPreview()"><option value="restart">Auto-Restart</option><option value="rollback">Rollback to Last Good State</option><option value="escalate">Escalate to Human</option></select></div>
      <div class="hc-field"><label>Max Retries</label><select id="h-retries" onchange="updateHealPreview()"><option value="1">1</option><option value="3">3</option><option value="5">5</option></select></div>
      <div class="hc-field full"><label>Escalation Channel</label><select id="h-escalate" onchange="updateHealPreview()"><option value="slack">#ops-alerts (Slack)</option><option value="email">ops@likeone.ai (Email)</option><option value="both">Both</option></select></div>
    </div>
    </div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 300 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +300 XP earned</div>
  </div>
  </div>
<div class="xp-toast" id="xp-toast">+300 XP earned! &#9889;</div>

<script>
const AGENTS=[
  {id:'writer',icon:'&#9997;&#65039;',name:'Writer',status:'healthy',log:'[OK] Last run: 2m ago. Generated 1 post.\n[OK] Memory usage: 42MB\n[OK] API calls: 3/100'},
  {id:'publisher',icon:'&#128640;',name:'Publisher',status:'healthy',log:'[OK] Last deploy: 8m ago\n[OK] Build time: 34s\n[OK] All checks passed'},
  {id:'monitor',icon:'&#128065;&#65039;',name:'Monitor',status:'error',log:'[OK] Scan started at 14:32:01\n[OK] Checked 12 endpoints...\n<span class="error-line">[ERROR] api-server-03: Connection timeout (30s)</span>\n<span class="error-line">[ERROR] Retry 1/3 failed</span>\n<span class="error-line">[ERROR] Retry 2/3 failed</span>\n<span class="error-line">[CRITICAL] Agent halted — needs intervention</span>',
   fixes:[
    {label:'&#8634; Restart Agent',correct:true,result:'Monitor restarted successfully. Resuming endpoint scans. api-server-03 now responding (142ms).'},
    {label:'&#9198; Rollback',correct:false,result:'Rollback failed — this is a connectivity issue, not a code issue. The agent needs a restart.'},
    {label:'&#128232; Escalate',correct:false,result:'Escalation sent, but this is a simple timeout. A restart would fix it faster.'}
   ]},
  {id:'analyst',icon:'&#128202;',name:'Analyst',status:'healthy',log:'[OK] Daily report generated\n[OK] Revenue: $347 (+12%)\n[OK] Next run: 6h'},
  {id:'scheduler',icon:'&#9200;',name:'Scheduler',status:'healthy',log:'[OK] 5 jobs scheduled\n[OK] Next trigger: 17:00\n[OK] Queue depth: 0'}
];

function renderDash(){
  const grid=document.getElementById('agent-grid');
  grid.innerHTML=AGENTS.map(a=>`<div class="dash-agent ${a.status}" onclick="inspectAgent('${a.id}')" id="da-${a.id}"><div class="da-icon">${a.icon}</div><div class="da-name">${a.name}</div><div class="da-status ${a.status==='healthy'?'ok':a.status==='error'?'err':'warn'}">${a.status}</div></div>`).join('');
  document.getElementById('dash-time').textContent=new Date().toLocaleTimeString();
}

function inspectAgent(id){
  const a=AGENTS.find(x=>x.id===id);
  const panel=document.getElementById('inspect-panel');
  panel.style.display='block';
  document.getElementById('ip-name').textContent=`${a.name} Agent`;
  document.getElementById('ip-log').innerHTML=a.log;
  document.querySelectorAll('.dash-agent').forEach(d=>d.classList.remove('selected'));
  document.getElementById(`da-${id}`).classList.add('selected');
  const actions=document.getElementById('ip-actions');
  const result=document.getElementById('ip-result');
  result.style.display='none';
  if(a.fixes){
    actions.innerHTML=a.fixes.map((f,i)=>`<button class="ip-action" onclick="tryFix('${id}',${i})">${f.label}</button>`).join('');
  } else {
    actions.innerHTML='<span style="font-size:.8rem;color:#22c55e">&#10003; Agent healthy — no action needed</span>';
  }
}

function tryFix(id,fixIdx){
  const a=AGENTS.find(x=>x.id===id);
  const fix=a.fixes[fixIdx];
  const btns=document.querySelectorAll('.ip-action');
  btns.forEach((b,i)=>{b.disabled=true;b.classList.add(a.fixes[i].correct?'correct':'wrong');});
  const result=document.getElementById('ip-result');
  result.style.display='block';
  result.style.background=fix.correct?'rgba(34,197,94,.08)':'rgba(239,68,68,.08)';
  result.style.color=fix.correct?'#22c55e':'#ef4444';
  result.textContent=fix.result;
  if(fix.correct){
    a.status='healthy';a.fixes=null;
    a.log='[OK] Agent restarted successfully\n[OK] All endpoints responding\n[OK] Resumed normal operations';
    setTimeout(()=>{renderDash();closeInspect();},1500);
  }
}

function closeInspect(){
  document.getElementById('inspect-panel').style.display='none';
  document.querySelectorAll('.dash-agent').forEach(d=>d.classList.remove('selected'));
}

function updateHealPreview(){
  const t=document.getElementById('h-target').value;
  const i=document.getElementById('h-interval').value;
  const e=document.getElementById('h-error').value;
  const r=document.getElementById('h-retries').value;
  const esc=document.getElementById('h-escalate').value;
  document.getElementById('heal-preview').textContent=`{
  "auto_healer": {
    "name": "Sentinel",
    "type": "supervisor_agent",
    "watch": "${t}",
    "check_interval": "${i}",
    "on_error": {
      "action": "${e}",
      "max_retries": ${r},
      "escalation": "${esc}",
      "cooldown": "5m"
    },
    "on_recovery": {
      "action": "log_and_notify",
      "channel": "${esc}"
    },
    "guardrails": [
      "Never restart more than ${r} times without escalating",
      "Never modify production data directly",
      "Always log every action taken"
    ]
  }
}`;
}

renderDash();
updateHealPreview();

function completeLsn(){
  if(localStorage.getItem('autolab-9')==='complete')return;
  localStorage.setItem('autolab-9','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-9')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
