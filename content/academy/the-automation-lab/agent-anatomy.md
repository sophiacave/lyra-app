---
title: "Agent Anatomy"
course: "the-automation-lab"
order: 2
type: "lesson"
free: true
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

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
    <div class="component" data-comp="memory" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#129504;</div><div class="comp-name">Memory</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent knows and remembers. Short-term (current conversation), long-term (stored facts, past decisions), and shared (accessible to other agents).</p><div class="comp-example">agent_memory: [{key: "user_preference", value: "prefers bullet points"}]</div></div>
    </div>
    <div class="component" data-comp="tools" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#128295;</div><div class="comp-name">Tools</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent can do. API calls, database queries, file operations, sending messages. Tools are the agent's hands — without them, it can only think.</p><div class="comp-example">tools: [send_email, query_db, create_file, call_api, schedule_task]</div></div>
    </div>
    <div class="component" data-comp="goals" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#127919;</div><div class="comp-name">Goals</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent is trying to achieve. Goals can be persistent (always active) or triggered (activated by events). They drive the decide-act loop.</p><div class="comp-example">goals: ["Respond to support tickets within 5 min", "Escalate critical issues"]</div></div>
    </div>
    <div class="component" data-comp="guardrails" onclick="toggleComp(this)">
      <div class="comp-header"><div class="comp-icon">&#128721;</div><div class="comp-name">Guardrails</div><div class="comp-toggle">&#9660;</div></div>
      <div class="comp-detail"><p>What the agent must NOT do. Boundaries, safety rules, ethical constraints. Guardrails prevent the agent from going rogue — they're the conscience before the conscience layer.</p><div class="comp-example">guardrails: ["Never share PII", "Max $50 spend without approval", "No destructive operations"]</div></div>
    </div>
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

  <div data-learn="FlashDeck" data-props='{"title":"The 6 Agent Components","cards":[{"front":"Identity","back":"Who the agent is — name, role, personality, and voice. Identity shapes every decision the agent makes."},{"front":"Memory","back":"What the agent knows. Short-term (current session), long-term (stored in DB), and shared (accessible to other agents)."},{"front":"Tools","back":"What the agent can do — API calls, database queries, file operations, sending messages. Without tools, agents can only think."},{"front":"Goals","back":"What the agent is trying to achieve. Can be persistent (always active) or triggered (activated by events)."},{"front":"Guardrails","back":"What the agent must NOT do. Safety rules, ethical constraints, and hard limits that prevent it from going rogue."},{"front":"Schedule","back":"When the agent runs — event-driven, cron-based, or always-on. Schedule determines the agent autonomy level."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Agent Anatomy Check","questions":[{"q":"Which component defines what an agent is NOT allowed to do?","options":["Goals","Memory","Guardrails","Schedule"],"correct":2,"explanation":"Guardrails are the hard limits — they define forbidden actions and prevent the agent from going rogue."},{"q":"An agent that reacts to a webhook event rather than running on a timer uses which schedule type?","options":["Cron-based","Always-on","Event-driven","Manual"],"correct":2,"explanation":"Event-driven agents wake up in response to triggers like webhooks, new records, or incoming messages."},{"q":"What is the difference between long-term memory and shared memory?","options":["Long-term is faster","Shared memory is accessible to ALL agents; long-term belongs to one agent","There is no difference","Long-term lasts forever; shared is session-only"],"correct":1,"explanation":"Shared memory (brain_context) is the bridge between agents — any agent can read or write it. Long-term memory belongs to a single agent."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Component to Description","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Identity","right":"Name, role, and voice"},{"left":"Tools","right":"API calls and file operations"},{"left":"Guardrails","right":"Hard limits and forbidden actions"},{"left":"Goals","right":"Persistent or event-triggered objectives"},{"left":"Schedule","right":"When the agent wakes up and runs"}]}'></div>

</div>
