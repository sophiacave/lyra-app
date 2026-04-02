---
title: "Memory Systems"
course: "the-automation-lab"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 3</div>
  <h1>Memory Systems</h1>
  <p class="subtitle">Memory is what separates a stateless tool from an intelligent agent. Without memory, every interaction is a first interaction — the agent cannot learn, cannot coordinate with other agents, and cannot improve. This lesson covers the three types of agent memory, how they work in practice, and how to query them.</p>

  <div class="section">
    <h2>Why Memory Matters</h2>
    <p>Imagine a customer support agent that forgets every conversation the moment it ends. A user asks about their order. The agent looks it up, gives an answer. The user follows up five minutes later — and the agent has no idea who they are or what they asked. That is a stateless tool, not an agent.</p>
    <p>Memory gives agents <strong>continuity</strong>. It lets them remember what happened, learn from outcomes, and share information with other agents. The three types of memory serve different purposes, and a well-designed agent uses all three.</p>
  </div>

  <div class="section">
    <h2>Three Types of Agent Memory</h2>
    <p><strong>Click each card</strong> to see details, implementation patterns, and trade-offs:</p>
  </div>

  <div class="memory-viz">
    <div class="mem-card stm active" onclick="showMem('stm')"><div class="mem-icon">&#9889;</div><div class="mem-name">Short-Term</div><div class="mem-sub">Conversation context</div></div>
    <div class="mem-card ltm" onclick="showMem('ltm')"><div class="mem-icon">&#128451;&#65039;</div><div class="mem-name">Long-Term</div><div class="mem-sub">agent_memory table</div></div>
    <div class="mem-card shared" onclick="showMem('shared')"><div class="mem-icon">&#127760;</div><div class="mem-name">Shared</div><div class="mem-sub">brain_context</div></div>
  </div>
  <div class="mem-detail" id="mem-detail"></div>

  <div class="section">
    <h2>Memory in Code</h2>
    <p>Here is a practical memory system in Python. Short-term is a list. Long-term is a database table. Shared is a key-value store accessible to all agents:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#c084fc">class</span> <span style="color:#34d399">AgentMemory</span>:
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">__init__</span>(self, agent_name, db):
        self.agent_name = agent_name
        self.db = db
        self.short_term = []  <span style="color:#71717a"># dies when session ends</span>

    <span style="color:#71717a"># Short-term: fast, ephemeral</span>
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">remember_now</span>(self, fact):
        self.short_term.append(fact)

    <span style="color:#71717a"># Long-term: persists across sessions</span>
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">remember_forever</span>(self, key, value):
        self.db.execute(
            <span style="color:#fbbf24">"INSERT INTO agent_memory (agent, key, value) "</span>
            <span style="color:#fbbf24">"VALUES (%s, %s, %s) ON CONFLICT (agent, key) "</span>
            <span style="color:#fbbf24">"DO UPDATE SET value = %s"</span>,
            [self.agent_name, key, value, value]
        )

    <span style="color:#71717a"># Shared: visible to ALL agents</span>
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">share</span>(self, key, value, category=<span style="color:#fbbf24">"session"</span>):
        self.db.execute(
            <span style="color:#fbbf24">"INSERT INTO brain_context (key, value, category) "</span>
            <span style="color:#fbbf24">"VALUES (%s, %s, %s) ON CONFLICT (key) "</span>
            <span style="color:#fbbf24">"DO UPDATE SET value = %s"</span>,
            [key, value, category, value]
        )

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">recall_shared</span>(self, key):
        <span style="color:#c084fc">return</span> self.db.execute(
            <span style="color:#fbbf24">"SELECT value FROM brain_context WHERE key = %s"</span>,
            [key]
        )</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem"><code>remember_now()</code> stores in a Python list — gone when the process ends. <code>remember_forever()</code> writes to a database — survives forever. <code>share()</code> writes to the shared brain — any agent can read it.</p>
  </div>

  <div class="section">
    <h2>The Context Window Problem</h2>
    <p>Every LLM has a <strong>context window</strong> — the maximum amount of text it can process at once. Claude's context window is up to 200K tokens (~150K words). That sounds like a lot, but a busy agent can fill it fast:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Problem: Context Overflow</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">After 50 tool calls, the conversation history might be 80K tokens. Add a large file read and you are at 120K. The agent starts losing earlier context as new information pushes old information out.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Solution: Write to Long-Term Memory</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Smart agents periodically checkpoint important facts to long-term memory. When context gets full, they can start a fresh session and recall what matters from the database. The brain remembers; the chat forgets.</p>
      </div>
    </div>

    <p>This is not a theoretical problem — it is the single most common cause of agent "amnesia." An agent that works perfectly for 20 minutes suddenly forgets your name, your goal, or what it was doing. The fix is always the same: write critical state to long-term or shared memory before context overflows.</p>
  </div>

  <div class="section">
    <h2>Vector Memory and Semantic Search</h2>
    <p>Simple key-value memory works when you know exactly what to look up. But what if you need to find memories by <em>meaning</em> rather than exact key?</p>
    <p><strong>Vector embeddings</strong> convert text into numerical arrays that capture semantic meaning. Similar concepts end up near each other in vector space. This lets agents search their memory the way humans do — by association, not exact match.</p>

    <div style="background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#8b5cf6">Example:</strong> An agent stores the memory "User prefers dark mode and minimal UI." Later, a query asks "what design preferences does this user have?" A key-value lookup would fail (wrong key). A vector search finds it instantly because the <em>meaning</em> is similar — even though the words are different.
    </div>

    <p style="font-size:.85rem;color:#71717a">Supabase supports vector search natively via pgvector. You store embeddings alongside your brain_context rows, then query with cosine similarity. This is the foundation of RAG (Retrieval-Augmented Generation), covered in depth in the RAG & Vector Search course.</p>
  </div>

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
      <strong style="color:#38bdf8">SQL 101:</strong> SQL (Structured Query Language) is how you ask questions to a database. <strong>SELECT *</strong> means "get all columns." <strong>FROM</strong> names the table. <strong>WHERE</strong> filters rows by a condition. <strong>ORDER BY</strong> sorts results. <strong>LIMIT</strong> caps how many rows to return.
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

  <div data-learn="FlashDeck" data-props='{"title":"Memory Types","cards":[{"front":"Short-Term Memory","back":"Exists only during the current conversation (the context window). Vanishes when the session ends. Fast but ephemeral — like a mental scratchpad."},{"front":"Long-Term Memory","back":"Persisted in a database (agent_memory table). Survives across sessions. Makes agents smarter over time. Use for user preferences, past decisions, learned facts."},{"front":"Shared Memory","back":"A key-value store accessible to ALL agents (brain_context). The communication bus that lets agents coordinate without talking directly to each other."},{"front":"What is the context window problem?","back":"LLMs have a max context size. After many tool calls, older context gets pushed out. Solution: checkpoint critical state to long-term memory before overflow."},{"front":"What are vector embeddings?","back":"Numerical arrays that capture the meaning of text. Enable semantic search \u2014 find memories by meaning, not just exact key match. Powered by pgvector in Supabase."},{"front":"When to use long-term vs shared memory?","back":"Long-term: one agent remembering things across its own sessions. Shared: passing information between different agents or storing system-wide state."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Memory Systems Quiz","questions":[{"q":"Which type of memory disappears when a conversation ends?","options":["Long-term","Shared","Short-term","All of them"],"correct":2,"explanation":"Short-term memory only exists during the current session (context window). Long-term and shared memory persist in databases."},{"q":"An agent needs to remember a user\u0027s preferences across multiple sessions. Which memory type should it use?","options":["Short-term","Shared","Long-term","None needed"],"correct":2,"explanation":"Long-term memory (agent_memory table) persists across sessions \u2014 perfect for storing user preferences, past decisions, and learned facts."},{"q":"Two agents need to coordinate \u2014 Agent A writes a result that Agent B should act on. Which memory type enables this?","options":["Short-term (session context)","Long-term (agent_memory)","Shared (brain_context)","No memory needed"],"correct":2,"explanation":"Shared memory (brain_context) is the communication bus between agents. Agent A writes, Agent B reads \u2014 no direct connection needed."},{"q":"After 50 tool calls, an agent suddenly forgets the user\u0027s name. What happened?","options":["The agent crashed","The context window overflowed and older information was pushed out","The database was deleted","Short-term memory corrupted"],"correct":1,"explanation":"Context overflow is the most common cause of agent amnesia. The fix: checkpoint critical state to long-term memory before the context fills up."},{"q":"What advantage does vector search have over key-value lookup?","options":["It is faster","It finds memories by semantic meaning, not just exact key match","It uses less storage","It works without a database"],"correct":1,"explanation":"Vector search matches by meaning. A query about \u0027design preferences\u0027 can find a memory stored under \u0027ui settings\u0027 because the meanings are similar."}]}'></div>

</div>
