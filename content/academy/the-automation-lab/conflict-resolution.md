---
title: "Conflict Resolution"
course: "the-automation-lab"
order: 6
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 6</div>
  <h1>Conflict Resolution</h1>
  <p class="subtitle">What happens when two agents try to modify the same data at the same time? Chaos -- unless you have a strategy.</p>

  <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.6">
    <strong style="color:#ef4444">Key concept -- Rollback:</strong> When a conflict is detected, a <strong>rollback</strong> undoes the last change, restoring data to its previous safe state. Think of it as "Ctrl-Z" for database operations. Below, you will also see the <strong>conscience layer</strong> -- a special arbiter agent that reviews conflicting actions and decides which one better aligns with the system's values and rules (like a judge settling a dispute between two agents).
  </div>

  <h2 class="section-title">&#9888;&#65039; The Race Condition</h2>
  <div class="race-demo">
    <div class="race-title">Watch two agents collide</div>
    <div class="race-scene">
      <div class="race-agent"><div class="race-av" id="ra-a">&#129302;</div><div class="race-name">Agent A</div></div>
      <div class="race-data" id="race-data"><div class="race-data-icon">&#128451;&#65039;</div><div class="race-data-label">user.balance</div><div class="race-data-val" id="race-val">$100</div></div>
      <div class="race-agent"><div class="race-av" id="ra-b">&#129302;</div><div class="race-name">Agent B</div></div>
    </div>
    <div class="race-log" id="race-log">Click "Run Race Condition" to see what happens...</div>
    <button class="race-btn" onclick="runRace()">&#9889; Run Race Condition</button>
  </div>

  <h2 class="section-title">&#128274; Three Solutions</h2>
  <div class="solutions">
    <div class="sol-card"><div class="sol-icon">&#128274;</div><div class="sol-name">Locking</div><div class="sol-desc">Agent acquires a lock before writing. Others must wait. Simple but can cause bottlenecks.</div></div>
    <div class="sol-card"><div class="sol-icon">&#128220;</div><div class="sol-name">Priority Queue</div><div class="sol-desc">Each agent has a priority level. Higher priority writes first. Lower priority waits or merges.</div></div>
    <div class="sol-card"><div class="sol-icon">&#129504;</div><div class="sol-name">Conscience Layer</div><div class="sol-desc">An arbiter agent reviews conflicting writes and decides which one aligns with system values.</div></div>
  </div>

  <h2 class="section-title">&#127919; Choose the Right Strategy</h2>
  <div class="scenarios" id="scenarios"></div>
  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 300 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +300 XP earned</div>
  </div>
  </div>
<div class="xp-toast" id="xp-toast">+300 XP earned! &#9889;</div>

<script>
let raceRunning=false;
function runRace(){
  if(raceRunning)return;raceRunning=true;
  const avA=document.getElementById('ra-a'),avB=document.getElementById('ra-b'),data=document.getElementById('race-data'),val=document.getElementById('race-val'),log=document.getElementById('race-log');
  log.textContent='';val.textContent='$100';
  const steps=[
    {t:0,fn:()=>{log.textContent+='[00:00] A reads balance: $100\n';}},
    {t:400,fn:()=>{log.textContent+='[00:00] B reads balance: $100\n';}},
    {t:900,fn:()=>{avA.classList.add('conflict');log.textContent+='[00:01] A calculates: $100 - $30 = $70\n';}},
    {t:1300,fn:()=>{avB.classList.add('conflict');log.textContent+='[00:01] B calculates: $100 - $50 = $50\n';}},
    {t:1800,fn:()=>{val.textContent='$70';val.style.color='#ef4444';log.textContent+='[00:02] A writes: balance = $70\n';}},
    {t:2200,fn:()=>{val.textContent='$50';data.classList.add('danger');log.textContent+='[00:02] B writes: balance = $50 (OVERWRITES A!)\n';}},
    {t:3000,fn:()=>{log.textContent+='[00:03] BUG: $30 deduction lost! Should be $20, shows $50\n';log.textContent+='[00:03] This is a RACE CONDITION.\n';avA.classList.remove('conflict');avB.classList.remove('conflict');raceRunning=false;}}
  ];
  steps.forEach(s=>setTimeout(s.fn,s.t));
}

const SCEN=[
  {text:'Two agents need to update a user\'s subscription status. One is upgrading, one is canceling. The operations are quick (<1s).',correct:0,opts:['Locking','Priority Queue','Conscience Layer'],fb:'Quick operations + two writers = locking is simplest. Acquire lock, write, release. No complex arbitration needed.'},
  {text:'Five agents submit reports to the same dashboard. Some are critical (security alerts), some are routine (analytics). You need critical reports to appear first.',correct:1,opts:['Locking','Priority Queue','Conscience Layer'],fb:'Different importance levels = priority queue. Security agents get higher priority, their writes are processed first.'},
  {text:'An agent wants to delete a user\'s data for GDPR compliance, but another agent wants to retain it for fraud investigation. Both have valid reasons.',correct:2,opts:['Locking','Priority Queue','Conscience Layer'],fb:'Ethical conflict with competing valid interests = conscience layer. An arbiter must weigh values (privacy vs safety) and make a judgment call.'}
];
const scenEl=document.getElementById('scenarios');
SCEN.forEach((s,i)=>{
  scenEl.innerHTML+=`<div class="scenario"><div class="scen-num">Scenario ${i+1}</div><div class="scen-text">${s.text}</div><div class="scen-opts" id="sopts-${i}">${s.opts.map((o,j)=>`<button class="scen-opt" onclick="checkScen(${i},${j})">${o}</button>`).join('')}</div><div class="scen-fb" id="sfb-${i}">${s.fb}</div></div>`;
});

function checkScen(si,oi){
  const s=SCEN[si];
  const btns=document.querySelectorAll(`#sopts-${si} .scen-opt`);
  btns.forEach((b,j)=>{b.disabled=true;b.classList.add(j===s.correct?'correct':'wrong');});
  document.getElementById(`sfb-${si}`).style.display='block';
}

function completeLsn(){
  if(localStorage.getItem('autolab-6')==='complete')return;
  localStorage.setItem('autolab-6','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-6')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
