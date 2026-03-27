---
title: "Agent Anatomy"
course: "the-automation-lab"
order: 2
type: "lesson"
free: true
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="index.html" class="nav-link">Course Overview</a><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 1 &bull; Lesson 2</div>
  <h1>Agent Anatomy</h1>
  <p class="subtitle">Every autonomous agent has six core components. Click each one to see what it does and why it matters.</p>

  <div class="core-label">&#128268; Exploded Agent Diagram</div>
  <div class="exploded-view" id="exploded">
    <div class="component" data-comp="identity" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#128100;</div><div class="comp-name">Identity</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>Who the agent is. Its name, role, personality, and voice. Identity shapes every decision the agent makes — it's the "soul" of the system.</p><div class="comp-example">name: "Lyra" | role: "Content Strategist" | voice: "Direct, warm, data-driven"</div></div>
    </div>
    <div class="connector"></div>
    <div class="component" data-comp="memory" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#129504;</div><div class="comp-name">Memory</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent knows and remembers. Short-term (current conversation), long-term (stored facts, past decisions), and shared (accessible to other agents).</p><div class="comp-example">agent_memory: [{key: "user_preference", value: "prefers bullet points"}]</div></div>
    </div>
    <div class="connector"></div>
    <div class="component" data-comp="tools" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#128295;</div><div class="comp-name">Tools</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent can do. API calls, database queries, file operations, sending messages. Tools are the agent's hands — without them, it can only think.</p><div class="comp-example">tools: [send_email, query_db, create_file, call_api, schedule_task]</div></div>
    </div>
    <div class="connector"></div>
    <div class="component" data-comp="goals" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#127919;</div><div class="comp-name">Goals</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent is trying to achieve. Goals can be persistent (always active) or triggered (activated by events). They drive the decide-act loop.</p><div class="comp-example">goals: ["Respond to support tickets within 5 min", "Escalate critical issues"]</div></div>
    </div>
    <div class="connector"></div>
    <div class="component" data-comp="guardrails" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#128721;</div><div class="comp-name">Guardrails</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent must NOT do. Boundaries, safety rules, ethical constraints. Guardrails prevent the agent from going rogue — they're the conscience before the conscience layer.</p><div class="comp-example">guardrails: ["Never share PII", "Max $50 spend without approval", "No destructive operations"]</div></div>
    </div>
    <div class="connector"></div>
    <div class="component" data-comp="schedule" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#9200;</div><div class="comp-name">Schedule</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>When the agent runs. Event-driven (reacts to triggers), cron-based (runs on schedule), or always-on (continuously monitoring). Schedule determines autonomy level.</p><div class="comp-example">schedule: "*/30 * * * *" (every 30 minutes) | trigger: "on_new_ticket"</div></div>
    </div>
  </div>

  <h2 class="section-title">&#128736;&#65039; Build Your First Agent</h2>
  <div class="builder-section">
    <div class="builder-title">Agent Builder</div>
    <div class="builder-desc">Fill in each component to design your agent. Watch the preview update in real time.</div>
    <div class="builder-grid">
      <div class="builder-field"><label>&#128100; Agent Name</label><input type="text" id="b-name" placeholder="e.g., Atlas" oninput="updatePreview()"></div>
      <div class="builder-field"><label>&#127919; Primary Goal</label><input type="text" id="b-goal" placeholder="e.g., Monitor uptime" oninput="updatePreview()"></div>
      <div class="builder-field full"><label>&#128295; Tools (comma-separated)</label><input type="text" id="b-tools" placeholder="e.g., ping_server, send_alert, restart_service" oninput="updatePreview()"></div>
      <div class="builder-field full"><label>&#128721; Guardrails</label><textarea id="b-guard" rows="2" placeholder="e.g., Never restart production without logging" oninput="updatePreview()"></textarea></div>
      <div class="builder-field"><label>&#9200; Schedule</label><input type="text" id="b-schedule" placeholder="e.g., every 5 minutes" oninput="updatePreview()"></div>
      <div class="builder-field"><label>&#129504; Memory Type</label><input type="text" id="b-memory" placeholder="e.g., logs last 24h of checks" oninput="updatePreview()"></div>
    </div>
    <div class="agent-preview" id="agent-preview">
      <div class="preview-title">&#9889; Agent Config Preview (JSON)</div>
      <p style="font-size:.8rem;color:#71717a;margin-bottom:.75rem">This JSON structure is how agent configurations are typically stored. Each field maps to one of the six components above. JSON (JavaScript Object Notation) uses curly braces for objects, square brackets for lists, and quotes for text values.</p>
      <div id="preview-content" style="font-family:monospace;font-size:.8rem;color:#a1a1aa;white-space:pre-wrap">Fill in the fields above to see your agent come to life...</div>
    </div>
  </div>

  <div class="complete-section">
    <button class="complete-btn" id="complete-btn" onclick="completeLsn()">Complete Lesson &mdash; 300 XP</button>
    <div class="complete-msg" id="complete-msg">&#10003; Lesson complete! +300 XP earned</div>
  </div>

  <div class="lesson-nav">
    <a href="what-is-an-agent.html">&larr; What Is an Agent?</a>
    <a href="memory-systems.html">Next: Memory Systems &rarr;</a>
  </div>
</div>

<div class="xp-toast" id="xp-toast">+300 XP earned! &#9889;</div>

<script>
function toggleComp(el){
  const wasExpanded=el.classList.contains('expanded');
  document.querySelectorAll('.component').forEach(c=>c.classList.remove('expanded'));
  if(!wasExpanded)el.classList.add('expanded');
}

function updatePreview(){
  const n=document.getElementById('b-name').value||'Unnamed';
  const g=document.getElementById('b-goal').value||'No goal set';
  const t=document.getElementById('b-tools').value||'none';
  const gu=document.getElementById('b-guard').value||'none';
  const s=document.getElementById('b-schedule').value||'manual';
  const m=document.getElementById('b-memory').value||'none';
  document.getElementById('preview-content').textContent=`{
  "agent": "${n}",
  "identity": { "name": "${n}", "role": "Autonomous Agent" },
  "goal": "${g}",
  "tools": [${t.split(',').map(x=>`"${x.trim()}"`).join(', ')}],
  "guardrails": ["${gu}"],
  "schedule": "${s}",
  "memory": "${m}"
}`;
}

function completeLsn(){
  if(localStorage.getItem('autolab-2')==='complete')return;
  localStorage.setItem('autolab-2','complete');
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
  const t=document.getElementById('xp-toast');t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}
if(localStorage.getItem('autolab-2')==='complete'){
  document.getElementById('complete-btn').disabled=true;
  document.getElementById('complete-msg').style.display='block';
}
</script>
