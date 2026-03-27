---
title: "Building Agents"
course: "claude-mastery"
order: 10
type: "builder"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 10 · Builder · Final</div>
<h1>Building Agents</h1>
<p>The grand finale — design, configure, and launch your own AI agent</p>
<div class="lesson-meta-bar">⏱ <span>90 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 3</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is an AI Agent?</h2>
<p>An AI agent is Claude given a <strong>goal</strong>, <strong>tools</strong>, <strong>memory</strong>, and <strong>guardrails</strong> — then set free to accomplish complex tasks autonomously. Unlike simple prompting, agents can plan, execute multi-step workflows, adapt to results, and even ask for help when stuck.</p>
<p>You've learned all the components. Now it's time to assemble them into something powerful.</p>
</div>

<div class="card">
<h2>Design Your Agent</h2>
<p>Configure each component of your agent by clicking through the steps below:</p>

<div class="agent-steps">
<div class="agent-step" onclick="openStep(0)" id="astep0">
<div class="step-num" style="background:rgba(139,92,246,.15);color:#8b5cf6">1</div>
<div class="step-content">
<h3>Define the Goal</h3>
<p>What should your agent accomplish?</p>
</div>
</div>
<div class="agent-step" onclick="openStep(1)" id="astep1">
<div class="step-num" style="background:rgba(251,146,60,.15);color:#fb923c">2</div>
<div class="step-content">
<h3>Give Tools</h3>
<p>What capabilities does it need?</p>
</div>
</div>
<div class="agent-step" onclick="openStep(2)" id="astep2">
<div class="step-num" style="background:rgba(56,189,248,.15);color:#38bdf8">3</div>
<div class="step-content">
<h3>Set Memory</h3>
<p>How should it remember context?</p>
</div>
</div>
<div class="agent-step" onclick="openStep(3)" id="astep3">
<div class="step-num" style="background:rgba(52,211,153,.15);color:#34d399">4</div>
<div class="step-content">
<h3>Add Guardrails</h3>
<p>What limits should it have?</p>
</div>
</div>
<div class="agent-step" onclick="openStep(4)" id="astep4">
<div class="step-num" style="background:rgba(244,114,182,.15);color:#f472b6">5</div>
<div class="step-content">
<h3>Deploy</h3>
<p>Launch and watch it work</p>
</div>
</div>
</div>

</div>

<div class="card" id="launchCard" style="display:none">
<div class="launch-section show">
<h2 style="margin-bottom:1rem">Your Agent Is Ready</h2>
<p style="color:#a1a1aa;margin-bottom:2rem">All systems configured. Hit launch to watch your agent in action.</p>
<button class="launch-btn" id="launchBtn" onclick="launchAgent()">🚀 Launch Agent</button>
</div>

<div class="agent-summary" id="agentSummary">
<div class="summary-title">Mission Complete</div>
</div>
</div>

<div class="card" id="courseComplete" style="display:none">
<div style="text-align:center;padding:2rem 0">
<div style="font-size:4rem;margin-bottom:1rem">🎓</div>
<h2 style="font-size:1.8rem;margin-bottom:.5rem;background:linear-gradient(135deg,#8b5cf6,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Course Complete!</h2>
<p style="color:#a1a1aa;font-size:1rem;margin-bottom:2rem">You've mastered Claude — from fundamentals to building production agents.</p>
<div style="display:flex;justify-content:center;gap:2rem;margin-bottom:2rem">
<div><div style="font-size:2rem;font-weight:800;color:#8b5cf6">10</div><div style="font-size:.8rem;color:#71717a">Lessons</div></div>
<div><div style="font-size:2rem;font-weight:800;color:#fb923c">2,400</div><div style="font-size:.8rem;color:#71717a">XP Earned</div></div>
<div><div style="font-size:2rem;font-weight:800;color:#34d399">12</div><div style="font-size:.8rem;color:#71717a">Hours</div></div>
</div>
</div>
<button class="complete-btn" onclick="completeLesson()">Complete Course →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 10 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3 · Final</span>
</div>

<script>
const agentConfig={goal:null,tools:[],memory:null,guardrails:[]};
const STEPS=[
{title:"Choose Your Agent's Goal",html:`
<div class="option-grid">
<div class="option-card" onclick="selectGoal('research',this)"><div class="option-emoji">🔬</div><div class="option-name">Research Agent</div><div class="option-desc">Deep-dive into any topic</div></div>
<div class="option-card" onclick="selectGoal('code',this)"><div class="option-emoji">💻</div><div class="option-name">Code Agent</div><div class="option-desc">Build and debug software</div></div>
<div class="option-card" onclick="selectGoal('data',this)"><div class="option-emoji">📊</div><div class="option-name">Data Agent</div><div class="option-desc">Analyze and visualize data</div></div>
<div class="option-card" onclick="selectGoal('support',this)"><div class="option-emoji">💬</div><div class="option-name">Support Agent</div><div class="option-desc">Answer customer questions</div></div>
</div>
<div style="margin-top:1rem"><label style="font-size:.8rem;font-weight:600;color:#a1a1aa;display:block;margin-bottom:.25rem">Custom goal description:</label>
<input type="text" id="goalInput" placeholder="e.g., Research competitor pricing and create a comparison report"></div>`},
{title:"Select Tools",html:`
<p style="font-size:.85rem;color:#a1a1aa;margin-bottom:.75rem">Pick the tools your agent needs (select multiple):</p>
<div class="option-grid">
<div class="option-card" onclick="toggleTool('web_search',this)"><div class="option-emoji">🔍</div><div class="option-name">Web Search</div></div>
<div class="option-card" onclick="toggleTool('file_read',this)"><div class="option-emoji">📁</div><div class="option-name">File Access</div></div>
<div class="option-card" onclick="toggleTool('code_exec',this)"><div class="option-emoji">⚡</div><div class="option-name">Code Execution</div></div>
<div class="option-card" onclick="toggleTool('database',this)"><div class="option-emoji">🗄️</div><div class="option-name">Database</div></div>
<div class="option-card" onclick="toggleTool('api_call',this)"><div class="option-emoji">🌐</div><div class="option-name">API Calls</div></div>
<div class="option-card" onclick="toggleTool('email',this)"><div class="option-emoji">📧</div><div class="option-name">Email</div></div>
</div>`},
{title:"Configure Memory",html:`
<div class="option-grid">
<div class="option-card" onclick="selectMemory('conversation',this)"><div class="option-emoji">💬</div><div class="option-name">Conversation</div><div class="option-desc">Remembers current chat only</div></div>
<div class="option-card" onclick="selectMemory('persistent',this)"><div class="option-emoji">🧠</div><div class="option-name">Persistent</div><div class="option-desc">Database-backed long-term memory</div></div>
<div class="option-card" onclick="selectMemory('rag',this)"><div class="option-emoji">📚</div><div class="option-name">RAG</div><div class="option-desc">Retrieval-augmented with documents</div></div>
</div>`},
{title:"Set Guardrails",html:`
<p style="font-size:.85rem;color:#a1a1aa;margin-bottom:.75rem">Select safety boundaries (multiple):</p>
<div class="option-grid">
<div class="option-card" onclick="toggleGuardrail('budget',this)"><div class="option-emoji">💰</div><div class="option-name">Budget Limit</div><div class="option-desc">Max API spend per task</div></div>
<div class="option-card" onclick="toggleGuardrail('approval',this)"><div class="option-emoji">✋</div><div class="option-name">Human Approval</div><div class="option-desc">Ask before destructive actions</div></div>
<div class="option-card" onclick="toggleGuardrail('scope',this)"><div class="option-emoji">🎯</div><div class="option-name">Scope Lock</div><div class="option-desc">Stay within defined task boundaries</div></div>
<div class="option-card" onclick="toggleGuardrail('logging',this)"><div class="option-emoji">📝</div><div class="option-name">Full Logging</div><div class="option-desc">Record every action for audit</div></div>
</div>`},
{title:"Ready to Deploy",html:`<p style="font-size:.9rem;color:#a1a1aa">Your agent is fully configured. Close this panel and hit the Launch button below!</p>`}
];

let currentStep=-1,configured=[false,false,false,false,false];

function openStep(idx){
currentStep=idx;
document.querySelectorAll('.agent-step').forEach((s,i)=>{s.classList.toggle('active',i===idx);});
const panel=document.getElementById('configPanel');
panel.innerHTML=`<h3 style="margin-bottom:.75rem">${STEPS[idx].title}</h3>${STEPS[idx].html}`;
panel.classList.add('show');
}

function selectGoal(type,el){
agentConfig.goal=type;
document.querySelectorAll('#configPanel .option-card').forEach(c=>c.classList.remove('selected'));
el.classList.add('selected');
markConfigured(0);
}
function toggleTool(tool,el){
el.classList.toggle('selected');
const idx=agentConfig.tools.indexOf(tool);
if(idx>=0) agentConfig.tools.splice(idx,1);else agentConfig.tools.push(tool);
if(agentConfig.tools.length>0) markConfigured(1);
}
function selectMemory(type,el){
agentConfig.memory=type;
document.querySelectorAll('#configPanel .option-card').forEach(c=>c.classList.remove('selected'));
el.classList.add('selected');
markConfigured(2);
}
function toggleGuardrail(g,el){
el.classList.toggle('selected');
const idx=agentConfig.guardrails.indexOf(g);
if(idx>=0) agentConfig.guardrails.splice(idx,1);else agentConfig.guardrails.push(g);
if(agentConfig.guardrails.length>0) markConfigured(3);
}

function markConfigured(idx){
configured[idx]=true;
document.getElementById('astep'+idx).classList.add('configured');
document.getElementById('astep'+idx).querySelector('.step-num').style.background='rgba(52,211,153,.15)';
document.getElementById('astep'+idx).querySelector('.step-num').style.color='#34d399';
if(configured[0]&&configured[1]&&configured[2]&&configured[3]){
configured[4]=true;
document.getElementById('launchCard').style.display='block';
document.getElementById('launchCard').scrollIntoView({behavior:'smooth',block:'center'});
}
}

const GOAL_LOGS={
research:[
{text:"[THINK] Analyzing goal: Research competitor pricing...",cls:"log-thinking"},
{text:"[TOOL] web_search('competitor pricing SaaS 2026')",cls:"log-tool"},
{text:"[RESULT] Found 12 relevant sources",cls:"log-result"},
{text:"[THINK] Extracting pricing data from top 5 competitors...",cls:"log-thinking"},
{text:"[TOOL] web_search('Competitor A pricing page')",cls:"log-tool"},
{text:"[RESULT] Competitor A: $29/mo starter, $99/mo pro, $299/mo enterprise",cls:"log-result"},
{text:"[TOOL] web_search('Competitor B pricing page')",cls:"log-tool"},
{text:"[RESULT] Competitor B: $19/mo basic, $79/mo premium",cls:"log-result"},
{text:"[ACTION] Creating comparison table...",cls:"log-action"},
{text:"[TOOL] file_write('pricing_comparison.md')",cls:"log-tool"},
{text:"[THINK] Analyzing pricing patterns and positioning...",cls:"log-thinking"},
{text:"[ACTION] Generating strategic recommendations...",cls:"log-action"},
{text:"[DONE] Report complete: 5 competitors analyzed, 3 pricing strategies identified, recommendations ready.",cls:"log-done"}
],
code:[
{text:"[THINK] Analyzing goal: Build and debug software...",cls:"log-thinking"},
{text:"[TOOL] file_read('src/index.ts')",cls:"log-tool"},
{text:"[RESULT] Read 342 lines, found 3 potential issues",cls:"log-result"},
{text:"[THINK] Issue 1: Unhandled promise rejection at line 47...",cls:"log-thinking"},
{text:"[TOOL] code_exec('npm test -- --verbose')",cls:"log-tool"},
{text:"[RESULT] 12 passing, 3 failing tests identified",cls:"log-result"},
{text:"[ACTION] Fixing async/await pattern in fetchData()...",cls:"log-action"},
{text:"[TOOL] file_write('src/index.ts', patched_code)",cls:"log-tool"},
{text:"[TOOL] code_exec('npm test')",cls:"log-tool"},
{text:"[RESULT] 15 passing, 0 failing",cls:"log-result"},
{text:"[ACTION] Running linter and type checker...",cls:"log-action"},
{text:"[RESULT] All checks pass",cls:"log-result"},
{text:"[DONE] Fixed 3 bugs, all 15 tests passing, zero type errors.",cls:"log-done"}
],
data:[
{text:"[THINK] Analyzing goal: Analyze and visualize data...",cls:"log-thinking"},
{text:"[TOOL] database('SELECT COUNT(*) FROM transactions')",cls:"log-tool"},
{text:"[RESULT] 47,832 records found",cls:"log-result"},
{text:"[THINK] Need to analyze revenue trends by quarter...",cls:"log-thinking"},
{text:"[TOOL] database('SELECT quarter, SUM(amount) FROM transactions GROUP BY quarter')",cls:"log-tool"},
{text:"[RESULT] Q1: $234K, Q2: $287K, Q3: $312K, Q4: $298K",cls:"log-result"},
{text:"[ACTION] Computing growth rates and anomalies...",cls:"log-action"},
{text:"[THINK] Q4 dip of 4.5% — investigating...",cls:"log-thinking"},
{text:"[TOOL] database('SELECT category, SUM(amount) FROM transactions WHERE quarter=Q4 GROUP BY category')",cls:"log-tool"},
{text:"[RESULT] Enterprise segment down 18%, SMB up 12%",cls:"log-result"},
{text:"[ACTION] Generating visualization and executive summary...",cls:"log-action"},
{text:"[DONE] Analysis complete: 22% YoY growth, Q4 dip traced to enterprise churn, 5 actionable insights generated.",cls:"log-done"}
],
support:[
{text:"[THINK] Analyzing goal: Answer customer questions...",cls:"log-thinking"},
{text:"[TOOL] database('SELECT * FROM tickets WHERE status=open ORDER BY priority')",cls:"log-tool"},
{text:"[RESULT] 23 open tickets, 5 high priority",cls:"log-result"},
{text:"[THINK] Starting with highest priority: Billing issue #4521...",cls:"log-thinking"},
{text:"[TOOL] database('SELECT * FROM customers WHERE id=8832')",cls:"log-tool"},
{text:"[RESULT] Customer: Acme Corp, Plan: Enterprise, Last payment: failed",cls:"log-result"},
{text:"[ACTION] Drafting response with payment recovery steps...",cls:"log-action"},
{text:"[TOOL] email('support@acme.com', resolution_email)",cls:"log-tool"},
{text:"[THINK] Next: Feature request #4518...",cls:"log-thinking"},
{text:"[TOOL] api_call('GET /roadmap/features')",cls:"log-tool"},
{text:"[ACTION] Cross-referencing with product roadmap...",cls:"log-action"},
{text:"[DONE] Resolved 5 high-priority tickets, drafted 3 responses for review, escalated 2 complex cases.",cls:"log-done"}
]
};

async function launchAgent(){
document.getElementById('launchBtn').style.display='none';
const log=document.getElementById('agentLog');
log.classList.add('show');

const goal=agentConfig.goal||'research';
const lines=GOAL_LOGS[goal];

for(const line of lines){
const div=document.createElement('div');
div.className='log-line '+line.cls;
div.textContent=line.text;
log.appendChild(div);
await new Promise(r=>setTimeout(r,400));
div.classList.add('show');
log.scrollTop=log.scrollHeight;
}

await new Promise(r=>setTimeout(r,600));

const summary=document.getElementById('agentSummary');
const items=document.getElementById('summaryItems');
const summaryData=[
{text:'Goal accomplished autonomously'},
{text:`Used ${agentConfig.tools.length} tools across ${lines.filter(l=>l.cls==='log-tool').length} tool calls`},
{text:`Memory type: ${agentConfig.memory||'conversation'}`},
{text:`Guardrails active: ${agentConfig.guardrails.join(', ')||'none'}`},
{text:'All operations logged and auditable'}
];
items.innerHTML=summaryData.map(s=>`<div class="summary-item"><span class="summary-check">✓</span>${s.text}</div>`).join('');
summary.classList.add('show');

await new Promise(r=>setTimeout(r,500));
document.getElementById('courseComplete').style.display='block';
document.getElementById('courseComplete').scrollIntoView({behavior:'smooth'});

// Confetti!
for(let i=0;i<50;i++){
const c=document.createElement('div');
c.className='confetti';
c.style.left=Math.random()*100+'vw';
c.style.top='-10px';
c.style.width=(Math.random()*8+4)+'px';
c.style.height=(Math.random()*8+4)+'px';
c.style.background=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'][Math.floor(Math.random()*5)];
c.style.borderRadius=Math.random()>.5?'50%':'2px';
c.style.animation=`confettiFall ${2+Math.random()*2}s ease forwards`;
c.style.animationDelay=(Math.random()*.5)+'s';
document.body.appendChild(c);
setTimeout(()=>c.remove(),4500);
}
}

function completeLesson(){
localStorage.setItem('cm_building-agents','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
