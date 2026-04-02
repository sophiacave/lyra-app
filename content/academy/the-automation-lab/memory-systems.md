---
title: "Memory Systems"
course: "the-automation-lab"
order: 3
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-automation-lab/">The Automation Lab</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Memory Systems</h1>
  <p class="sub">Memory is what separates a stateless tool from an intelligent agent. Without memory, every interaction is a first interaction — the agent cannot learn, cannot coordinate with other agents, and cannot improve. This lesson covers the three types of agent memory, how they work in practice, and how to query them.</p>
</div>

  <div class="section">
    <h2>Why Memory Matters</h2>
    <p>Imagine a customer support agent that forgets every conversation the moment it ends. A user asks about their order. The agent looks it up, gives an answer. The user follows up five minutes later — and the agent has no idea who they are or what they asked. That is a stateless tool, not an agent.</p>
    <p>Memory gives agents <strong>continuity</strong>. It lets them remember what happened, learn from outcomes, and share information with other agents. The three types of memory serve different purposes, and a well-designed agent uses all three.</p>
  </div>

  <div class="section">
    <h2>Three Types of Agent Memory</h2>
    <p>Here are the three types of memory, their characteristics, and when to use each:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">&#9889; Short-Term Memory</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The current conversation window. Exists only during the active session — vanishes when the session ends. Fast and immediate, like a mental scratchpad. Implementation: the messages array passed to the API on each turn.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">&#128451;&#65039; Long-Term Memory</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Persisted in a database (<code>agent_memory</code> table). Survives across sessions, making agents smarter over time. Use for user preferences, past decisions, learned facts, and resolution patterns.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">&#127760; Shared Memory</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A key-value store accessible to ALL agents (<code>brain_context</code>). The communication bus that lets agents coordinate without talking directly to each other. One agent writes; others read.</p>
      </div>
    </div>
  </div>

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

  <div class="section">
    <h2>Querying Agent Memory</h2>
    <p>To read from agent memory, you use SQL queries against the appropriate table. Here are common query patterns:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#71717a">-- Read all shared memories in a category</span>
<span style="color:#c084fc">SELECT</span> * <span style="color:#c084fc">FROM</span> brain_context <span style="color:#c084fc">WHERE</span> category = <span style="color:#fbbf24">'identity'</span>;

<span style="color:#71717a">-- Read a specific agent's long-term memories</span>
<span style="color:#c084fc">SELECT</span> * <span style="color:#c084fc">FROM</span> agent_memory <span style="color:#c084fc">WHERE</span> agent = <span style="color:#fbbf24">'atlas'</span>;

<span style="color:#71717a">-- Find a specific key</span>
<span style="color:#c084fc">SELECT</span> value <span style="color:#c084fc">FROM</span> brain_context <span style="color:#c084fc">WHERE</span> key = <span style="color:#fbbf24">'session.active_work'</span>;</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem"><strong>SELECT *</strong> means "get all columns." <strong>FROM</strong> names the table. <strong>WHERE</strong> filters rows by a condition. Use <code>brain_context</code> for shared memory and <code>agent_memory</code> for an individual agent's long-term storage.</p>
  </div>

  <div class="section">
    <h2>Memory Lifecycle Management</h2>
    <p>Memory without management becomes noise. Over time, an unmanaged memory store accumulates stale, conflicting, and irrelevant entries that degrade agent performance. Three strategies keep memory clean:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8">TTL (Time-To-Live)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Set an expiration on temporary memories. Session state that is 30 days old is probably stale. Task outputs from completed projects can be archived. Use a background job that cleans expired entries weekly.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <strong style="color:#f472b6">Consolidation</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Periodically merge related memories into summaries. Instead of 50 individual session records, create one consolidated entry: "Q1 2026: deployed 12 features, fixed 8 bugs, migrated to new database." This reduces read time while preserving the essential information.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(250,204,21,.04);border:1px solid rgba(250,204,21,.1)">
        <strong style="color:#facc15">Versioning</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">When updating a memory, keep the previous version. This creates an audit trail and enables rollbacks. If a memory update introduces bad data, you can revert to the last known good state. Store versions in a separate history table or use a <code>version</code> column.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Memory Architecture Patterns</h2>
    <p>Different use cases call for different memory architectures. Here are the three most common patterns:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Flat Key-Value</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Simple key-value store with no nesting. Fast reads, easy to understand. Works for small to medium memory stores (under 1,000 keys). Starts to struggle when you need complex queries or relationships between entries.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Hierarchical Namespaced</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Keys organized in a tree structure: <code>identity.user</code>, <code>identity.preferences</code>, <code>system.infrastructure</code>. Agents can read entire namespaces (<code>identity.*</code>) without loading the full store. Scales to thousands of entries while staying organized.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Hybrid (KV + Vectors)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Combines key-value for structured data (settings, config, rules) with vector embeddings for unstructured data (conversations, decisions, learning). Queries by key for known lookups and by semantic similarity for contextual retrieval.</p>
      </div>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Most production agent systems use the hybrid pattern. It gives you the speed of key-value lookups for routine reads and the intelligence of semantic search for complex queries.</p>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"Memory Types","cards":[{"front":"Short-Term Memory","back":"Exists only during the current conversation (the context window). Vanishes when the session ends. Fast but ephemeral — like a mental scratchpad."},{"front":"Long-Term Memory","back":"Persisted in a database (agent_memory table). Survives across sessions. Makes agents smarter over time. Use for user preferences, past decisions, learned facts."},{"front":"Shared Memory","back":"A key-value store accessible to ALL agents (brain_context). The communication bus that lets agents coordinate without talking directly to each other."},{"front":"What is the context window problem?","back":"LLMs have a max context size. After many tool calls, older context gets pushed out. Solution: checkpoint critical state to long-term memory before overflow."},{"front":"What are vector embeddings?","back":"Numerical arrays that capture the meaning of text. Enable semantic search \u2014 find memories by meaning, not just exact key match. Powered by pgvector in Supabase."},{"front":"When to use long-term vs shared memory?","back":"Long-term: one agent remembering things across its own sessions. Shared: passing information between different agents or storing system-wide state."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Memory Systems Quiz","questions":[{"q":"Which type of memory disappears when a conversation ends?","options":["Long-term","Shared","Short-term","All of them"],"correct":2,"explanation":"Short-term memory only exists during the current session (context window). Long-term and shared memory persist in databases."},{"q":"An agent needs to remember a user\u0027s preferences across multiple sessions. Which memory type should it use?","options":["Short-term","Shared","Long-term","None needed"],"correct":2,"explanation":"Long-term memory (agent_memory table) persists across sessions \u2014 perfect for storing user preferences, past decisions, and learned facts."},{"q":"Two agents need to coordinate \u2014 Agent A writes a result that Agent B should act on. Which memory type enables this?","options":["Short-term (session context)","Long-term (agent_memory)","Shared (brain_context)","No memory needed"],"correct":2,"explanation":"Shared memory (brain_context) is the communication bus between agents. Agent A writes, Agent B reads \u2014 no direct connection needed."},{"q":"After 50 tool calls, an agent suddenly forgets the user\u0027s name. What happened?","options":["The agent crashed","The context window overflowed and older information was pushed out","The database was deleted","Short-term memory corrupted"],"correct":1,"explanation":"Context overflow is the most common cause of agent amnesia. The fix: checkpoint critical state to long-term memory before the context fills up."},{"q":"What advantage does vector search have over key-value lookup?","options":["It is faster","It finds memories by semantic meaning, not just exact key match","It uses less storage","It works without a database"],"correct":1,"explanation":"Vector search matches by meaning. A query about \u0027design preferences\u0027 can find a memory stored under \u0027ui settings\u0027 because the meanings are similar."}]}'></div>

</div>
