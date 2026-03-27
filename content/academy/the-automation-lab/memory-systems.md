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

  <div data-learn="FlashDeck" data-props='{"title":"Memory Types","cards":[{"front":"Short-Term Memory","back":"Exists only during the current conversation. Vanishes when the session ends. Like a mental scratchpad — fast but ephemeral."},{"front":"Long-Term Memory","back":"Persisted in a database (agent_memory table). Survives across sessions. Makes agents smarter over time as they accumulate facts and preferences."},{"front":"Shared Memory","back":"A key-value store accessible to ALL agents (brain_context). The bridge that lets agents coordinate without talking directly to each other."},{"front":"What is brain_context?","back":"The shared memory table used by all agents. Any agent can read or write to it. It enables coordination across an entire agent team."},{"front":"When would you use long-term memory vs shared memory?","back":"Long-term is for one agent to remember things across sessions. Shared is for passing information between different agents."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Memory Systems Quiz","questions":[{"q":"Which type of memory disappears when a conversation ends?","options":["Long-term","Shared","Short-term","All of them"],"correct":2,"explanation":"Short-term memory only exists during the current session. Long-term and shared memory persist in databases."},{"q":"An agent needs to remember a user's preferences across multiple sessions. Which memory type should it use?","options":["Short-term","Shared","Long-term","None needed"],"correct":2,"explanation":"Long-term memory (agent_memory table) persists across sessions — perfect for storing user preferences."},{"q":"Two agents need to coordinate — Agent A writes a result that Agent B should act on. Which memory type enables this?","options":["Short-term (session context)","Long-term (agent_memory)","Shared (brain_context)","No memory needed"],"correct":2,"explanation":"Shared memory (brain_context) is the communication bus between agents. Agent A writes, Agent B reads — no direct connection needed."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Memory Type to Use Case","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Short-term","right":"Current conversation context"},{"left":"Long-term","right":"Stored user preferences across sessions"},{"left":"Shared","right":"Agent-to-agent coordination bus"},{"left":"agent_memory table","right":"One agent's persistent database"},{"left":"brain_context","right":"Whole-team shared key-value store"}]}'></div>

</div>
