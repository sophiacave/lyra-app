---
title: "Memory Systems"
course: "the-automation-lab"
order: 3
type: "lesson"
free: true
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 1 &bull; Lesson 3</div>
  <h1>Memory Systems</h1>
  <p class="subtitle">Memory is what separates a stateless tool from an intelligent agent. Three types. Three purposes. One unified brain.</p>

  <h2 class="section-title">Three Types of Agent Memory</h2>
  <div class="memory-viz">
    <div class="mem-card stm active" onclick="showMem('stm')"><div class="mem-icon">&#9889;</div><div class="mem-name">Short-Term</div><div class="mem-sub">Conversation context</div></div>
    <div class="mem-card ltm" onclick="showMem('ltm')"><div class="mem-icon">&#128451;&#65039;</div><div class="mem-name">Long-Term</div><div class="mem-sub">agent_memory table</div></div>
    <div class="mem-card shared" onclick="showMem('shared')"><div class="mem-icon">&#127760;</div><div class="mem-name">Shared</div><div class="mem-sub">brain_context</div></div>
  </div>
  <div class="mem-detail" id="mem-detail"></div>
  <h2 class="section-title">&#128260; Memory in Action</h2>
  <div class="flow-section">
    <div class="flow-title">Watch agents read and write to shared memory</div>
    <div class="flow-agents">
      <div class="flow-agent"><div class="agent-avatar" id="agentA-av">&#129302;</div><div class="agent-name">Agent A</div><div class="agent-action" id="agentA-act">Idle</div></div>
      <div class="flow-db"><div class="flow-db-icon">&#128451;&#65039;</div><div class="flow-db-name">brain_context</div><div class="db-entries" id="db-entries"></div></div>
      <div class="flow-agent"><div class="agent-avatar" id="agentB-av">&#129302;</div><div class="agent-name">Agent B</div><div class="agent-action" id="agentB-act">Idle</div></div>
    </div>
    <div style="text-align:center;margin-top:1.5rem">
      <button onclick="runMemFlow()" style="padding:.6rem 1.5rem;border:1px solid rgba(239,68,68,.3);border-radius:10px;background:rgba(239,68,68,.08);color:#ef4444;font-family:Inter;font-weight:600;font-size:.85rem;cursor:pointer;transition:all .2s" id="flow-btn">&#9654; Run Simulation</button>
    </div>
  </div>

  <h2 class="section-title">&#128269; Build a Memory Query</h2>
  <div class="query-builder">
    <div class="qb-title">Query Builder</div>
    <div class="qb-desc">Construct a query to read from agent memory. See the SQL and results.</div>
    <div style="background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.15);border-radius:10px;padding:1rem;margin-bottom:1rem;font-size:.82rem;color:#a1a1aa;line-height:1.6">
      <strong style="color:#38bdf8">SQL 101:</strong> SQL (Structured Query Language) is how you ask questions to a database. <strong>SELECT *</strong> means "get all columns." <strong>FROM</strong> names the table. <strong>WHERE</strong> filters rows by a condition. <strong>ORDER BY</strong> sorts results. <strong>LIMIT</strong> caps how many rows to return. Use the dropdowns below to build a query without writing any code.
    </div>
    <div class="qb-row">
      <div class="qb-label">Table:</div>
      <select class="qb-select" id="q-table" onchange="buildQuery()">
        <option value="brain_context">brain_context (shared)</option>
        <option value="agent_memory">agent_memory (long-term)</option>
      </select>
    </div>
    <div class="qb-row">
      <div class="qb-label">Filter by:</div>
      <select class="qb-select" id="q-filter" onchange="buildQuery()">
        <option value="category">Category</option>
        <option value="agent_name">Agent Name</option>
        <option value="key">Key (exact)</option>
      </select>
    </div>
    <div class="qb-row">
      <div class="qb-label">Value:</div>
      <input class="qb-select" id="q-value" placeholder="e.g., identity" oninput="buildQuery()">
    </div>
    <div class="qb-result" id="q-result">SELECT * FROM brain_context WHERE category = 'identity';</div>
    <button class="qb-run" onclick="runQuery()">Run Query</button>
    <pre class="qb-output" id="q-output" style="display:none"></pre>
    </div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 300 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +300 XP earned</div>
  </div>
  </div>
<div class="xp-toast" id="xp-toast">+300 XP earned! &#9889;</div>

<script>
const MEM_DATA={
  stm:{title:'Short-Term Memory (Conversation)',desc:'Exists only during the current interaction. When the conversation ends, it vanishes. This is the agent\'s "working memory" — like your mental scratchpad.',rows:[['Current user message','What the user just said','Session only'],['Previous turns','Last 10-20 exchanges','Session only'],['Extracted intent','What the agent thinks user wants','Session only'],['Tool results','Output from recent tool calls','Session only']]},
  ltm:{title:'Long-Term Memory (agent_memory)',desc:'Persisted in a database table. Survives across sessions. The agent writes facts, preferences, and learnings here. This is what makes agents smarter over time.',rows:[['user_name','Sophia','Permanent'],['deploy_count','47','Updated each deploy'],['last_error','DNS timeout 2026-03-22','Last incident'],['preferred_stack','Next.js + Supabase','User stated']]},
  shared:{title:'Shared Memory (brain_context)',desc:'A shared key-value store accessible to ALL agents. This is the "bridge" — agents read each other\'s writes. It enables coordination without direct communication.',rows:[['identity.faye_unified','Full identity profile','All agents'],['session.active_work','Current task state','All agents'],['system.revenue_architecture','Products + pricing','All agents'],['infrastructure.likeone_site','Deploy pipeline','All agents']]}
};

function showMem(type){
  document.querySelectorAll('.mem-card').forEach(c=>c.classList.remove('active'));
  document.querySelector(`.mem-card.${type}`).classList.add('active');
  const d=MEM_DATA[type];
  const det=document.getElementById('mem-detail');
  det.innerHTML=`<h3>${d.title}</h3><p>${d.desc}</p><table class="mem-table"><tr><th>Key</th><th>Value</th><th>Scope</th></tr>${d.rows.map(r=>`<tr><td style="color:#ef4444;font-weight:600">${r[0]}</td><td>${r[1]}</td><td style="color:#71717a">${r[2]}</td></tr>`).join('')}</table>`;
}
showMem('stm');

// Memory flow simulation
let flowRunning=false;
function runMemFlow(){
  if(flowRunning)return;flowRunning=true;
  const btn=document.getElementById('flow-btn');btn.textContent='Running...';
  const aA=document.getElementById('agentA-av'),aB=document.getElementById('agentB-av');
  const actA=document.getElementById('agentA-act'),actB=document.getElementById('agentB-act');
  const db=document.getElementById('db-entries');
  db.innerHTML='';
  const steps=[
    {t:0,fn:()=>{aA.classList.add('writing');actA.textContent='Writing...';}},
    {t:800,fn:()=>{db.innerHTML+='<div class="flow-entry" id="fe1">status: "deploying"</div>';setTimeout(()=>document.getElementById('fe1').classList.add('visible'),50);}},
    {t:1600,fn:()=>{aA.classList.remove('writing');actA.textContent='Write complete';db.innerHTML+='<div class="flow-entry" id="fe2">version: "2.4.1"</div>';setTimeout(()=>document.getElementById('fe2').classList.add('visible'),50);}},
    {t:2400,fn:()=>{aB.classList.add('reading');actB.textContent='Reading...';}},
    {t:3200,fn:()=>{actB.textContent='Got: deploying v2.4.1';}},
    {t:4000,fn:()=>{aB.classList.remove('reading');aB.classList.add('writing');actB.textContent='Writing response...';}},
    {t:4800,fn:()=>{db.innerHTML+='<div class="flow-entry" id="fe3">health: "monitoring"</div>';setTimeout(()=>document.getElementById('fe3').classList.add('visible'),50);}},
    {t:5600,fn:()=>{aB.classList.remove('writing');actB.textContent='Done';actA.textContent='Idle';btn.textContent='\u25B6 Run Again';flowRunning=false;}}
  ];
  steps.forEach(s=>setTimeout(s.fn,s.t));
}

function buildQuery(){
  const t=document.getElementById('q-table').value;
  const f=document.getElementById('q-filter').value;
  const v=document.getElementById('q-value').value||'identity';
  document.getElementById('q-result').textContent=`SELECT * FROM ${t}\nWHERE ${f} = '${v}'\nORDER BY updated_at DESC\nLIMIT 10;`;
}

function runQuery(){
  const o=document.getElementById('q-output');
  const t=document.getElementById('q-table').value;
  const f=document.getElementById('q-filter').value;
  const v=document.getElementById('q-value').value||'identity';
  const mockData={
    'brain_context':{
      'identity':[{key:'faye_unified',value:'{name:"Sophia",role:"Founder"}',updated:'2026-03-23'}],
      'system':[{key:'revenue_architecture',value:'{products:4,mrr:0}',updated:'2026-03-22'}],
      'default':[{key:'boot_sequence',value:'{version:"4.0"}',updated:'2026-03-23'}]
    },
    'agent_memory':{
      'default':[{key:'deploy_count',value:'47',updated:'2026-03-23'},{key:'last_error',value:'none',updated:'2026-03-22'}]
    }
  };
  const results=mockData[t]?.[v]||mockData[t]?.['default']||[{key:'no_results',value:'null',updated:'-'}];
  o.style.display='block';
  o.textContent=`-- Results (${results.length} rows) --\n\n`+results.map(r=>`| ${r.key.padEnd(25)} | ${r.value.padEnd(30)} | ${r.updated} |`).join('\n');
}

function completeLsn(){
  if(localStorage.getItem('autolab-3')==='complete')return;
  localStorage.setItem('autolab-3','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-3')==='complete'){document.getElementById('complete-btn').disabled=true;document.getElementById('complete-msg').style.display='block';}
</script>
