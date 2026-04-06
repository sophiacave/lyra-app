---
title: "Shared Memory and State"
course: "multi-agent-orchestration"
order: 5
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/multi-agent-orchestration/">Multi-Agent Orchestration</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Shared Memory and State</h1>
  <p><span class="accent">Agents that share context and knowledge — the difference between a team and a group of strangers.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Why isolated agents produce inconsistent results</li>
    <li>Three models for shared state: context passing, shared memory, and vector stores</li>
    <li>How to design state schemas that scale</li>
    <li>Preventing state corruption in multi-agent systems</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Problem</span>
  <h2 class="section-title">Agents Without Shared Memory Are Goldfish</h2>
  <p class="section-text">Agent A researches a customer's history. Agent B handles the customer's complaint. But Agent B doesn't know what Agent A found. So it asks the customer to repeat everything. Sound familiar? It's the same frustration you feel when a company transfers your call and you have to start over.</p>
  <p class="section-text">Without shared memory, each agent operates in isolation. The system has knowledge, but no individual agent can access the full picture. Shared state fixes this.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Model 1</span>
  <h2 class="section-title">Context Passing: The Relay Baton</h2>
  <p class="section-text">The simplest approach: each agent receives the accumulated context from all previous agents in its prompt. Agent A's output becomes part of Agent B's input, which becomes part of Agent C's input.</p>
  <p class="section-text"><strong style="color: var(--green);">Pros:</strong> Simple to implement. No external infrastructure. Every agent has full history.</p>
  <p class="section-text"><strong style="color: var(--red);">Cons:</strong> Context windows fill up fast. By agent 5 or 6, you're running out of room for the actual task. Doesn't scale.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Context passing: accumulate history in the prompt</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">pipeline_with_context</span>(task: str, agents: list) -> str:
    <span style="color:#71717a"># Each agent sees ALL previous outputs (context grows with each step)</span>
    context = <span style="color:#fbbf24">f"Original task: {task}\n"</span>
    <span style="color:#c084fc">for</span> name, system_prompt <span style="color:#c084fc">in</span> agents:
        result = call_agent(system_prompt, context)
        context += <span style="color:#fbbf24">f"\n--- {name} output ---\n{result}\n"</span>  <span style="color:#71717a"># accumulate</span>
    <span style="color:#c084fc">return</span> context

<span style="color:#71717a"># Problem: by agent 5, the context might be 50,000+ tokens</span>
<span style="color:#71717a"># That leaves little room for the agent's own reasoning</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Model 2</span>
  <h2 class="section-title">Shared Memory Store: The Team Database</h2>
  <p class="section-text">All agents read from and write to a central store — a database, a key-value store, or even a structured document. Each agent queries only what it needs instead of carrying everything.</p>
  <p class="section-text"><strong style="color: var(--green);">Pros:</strong> Scales to many agents. Each agent gets relevant context without bloat. Persists across sessions.</p>
  <p class="section-text"><strong style="color: var(--red);">Cons:</strong> Requires infrastructure. Agents need to know what to query. Stale data is a risk if updates lag.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Shared memory store with Supabase</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> supabase <span style="color:#c084fc">import</span> create_client

db = create_client(SUPABASE_URL, SUPABASE_KEY)

<span style="color:#c084fc">class</span> <span style="color:#38bdf8">SharedMemory</span>:
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">__init__</span>(self, task_id: str):
        self.task_id = task_id

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">write</span>(self, agent: str, key: str, value: <span style="color:#c084fc">any</span>):
        <span style="color:#71717a"># Each agent writes to its own namespace</span>
        db.table(<span style="color:#fbbf24">"agent_memory"</span>).upsert({
            <span style="color:#fbbf24">"task_id"</span>: self.task_id,
            <span style="color:#fbbf24">"agent"</span>: agent, <span style="color:#fbbf24">"key"</span>: key, <span style="color:#fbbf24">"value"</span>: value
        }).execute()

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">read</span>(self, key: str) -> <span style="color:#c084fc">any</span>:
        <span style="color:#71717a"># Any agent can read any key</span>
        row = db.table(<span style="color:#fbbf24">"agent_memory"</span>).select(<span style="color:#fbbf24">"value"</span>).eq(
            <span style="color:#fbbf24">"task_id"</span>, self.task_id
        ).eq(<span style="color:#fbbf24">"key"</span>, key).single().execute()
        <span style="color:#c084fc">return</span> row.data[<span style="color:#fbbf24">"value"</span>]

<span style="color:#71717a"># Usage: agents share state without carrying it in their context</span>
mem = SharedMemory(<span style="color:#fbbf24">"content-042"</span>)
mem.write(<span style="color:#fbbf24">"researcher"</span>, <span style="color:#fbbf24">"findings"</span>, research_output)   <span style="color:#71717a"># researcher writes</span>
findings = mem.read(<span style="color:#fbbf24">"findings"</span>)                        <span style="color:#71717a"># writer reads</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Model 3</span>
  <h2 class="section-title">Vector Store: The Semantic Brain</h2>
  <p class="section-text">Store agent outputs as embeddings in a vector database. When an agent needs context, it performs a semantic search — "find everything related to customer billing issues" — and gets the most relevant pieces, regardless of when or which agent produced them.</p>
  <p class="section-text"><strong style="color: var(--green);">Pros:</strong> Handles massive amounts of context. Agents retrieve only what's relevant. Gets smarter as more data accumulates.</p>
  <p class="section-text"><strong style="color: var(--red);">Cons:</strong> More complex to set up. Embedding quality matters. Results can be unpredictable.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Vector store: semantic search for agent memory (pgvector)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> sentence_transformers <span style="color:#c084fc">import</span> SentenceTransformer

model = SentenceTransformer(<span style="color:#fbbf24">"all-MiniLM-L6-v2"</span>)  <span style="color:#71717a"># free, runs locally</span>

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">store_memory</span>(text: str, agent: str, task_id: str):
    <span style="color:#71717a"># Convert text to a vector and store in Supabase with pgvector</span>
    embedding = model.encode(text).tolist()
    db.table(<span style="color:#fbbf24">"agent_vectors"</span>).insert({
        <span style="color:#fbbf24">"task_id"</span>: task_id, <span style="color:#fbbf24">"agent"</span>: agent,
        <span style="color:#fbbf24">"content"</span>: text, <span style="color:#fbbf24">"embedding"</span>: embedding
    }).execute()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">recall</span>(query: str, task_id: str, limit: int = <span style="color:#fb923c">3</span>) -> list:
    <span style="color:#71717a"># Semantic search: find the most relevant agent memories</span>
    query_vec = model.encode(query).tolist()
    result = db.rpc(<span style="color:#fbbf24">"match_agent_memory"</span>, {
        <span style="color:#fbbf24">"query_embedding"</span>: query_vec,
        <span style="color:#fbbf24">"filter_task"</span>: task_id,
        <span style="color:#fbbf24">"match_count"</span>: limit
    }).execute()
    <span style="color:#c084fc">return</span> [r[<span style="color:#fbbf24">"content"</span>] <span style="color:#c084fc">for</span> r <span style="color:#c084fc">in</span> result.data]

<span style="color:#71717a"># Editor agent needs billing context — semantic search finds it</span>
relevant = recall(<span style="color:#fbbf24">"customer billing history"</span>, <span style="color:#fbbf24">"support-099"</span>)
<span style="color:#71717a"># → Returns the 3 most relevant memories from ANY agent</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">A State Schema That Works</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Shared State Object</h4>
      <code>{<br>  "task_id": "content-pipeline-042",<br>  "status": "in_progress",<br>  "current_stage": "editing",<br>  "artifacts": {<br>    "research": { "agent": "researcher", "completed": true, "output_ref": "..." },<br>    "draft": { "agent": "writer", "completed": true, "output_ref": "..." },<br>    "review": { "agent": "editor", "completed": false }<br>  },<br>  "shared_context": {<br>    "target_audience": "technical managers",<br>    "tone": "professional but approachable",<br>    "word_limit": 1500<br>  },<br>  "flags": ["needs_fact_check", "client_mentioned_deadline"]<br>}</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Every agent reads shared_context. Each updates its own artifact. Flags communicate cross-cutting concerns.</p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">The Danger Zone</span>
  <h2 class="section-title">State Corruption Is Your Biggest Enemy</h2>
  <p class="section-text">When multiple agents write to shared state simultaneously, you get race conditions. Agent A reads the state, Agent B updates it, Agent A writes its update based on stale data — and Agent B's work is silently lost.</p>
  <p class="section-text"><strong style="color: var(--orange);">Prevention strategies:</strong> Use optimistic locking (version numbers on state updates). Give each agent its own namespace. Use append-only logs instead of mutable state. Designate one agent as the state manager.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Design Your State Layer</h2>
  <div class="try-it-box">
    <p>Take your agent team from earlier lessons. Design the shared state schema. What does every agent need to know? What's agent-specific? How do you prevent conflicts?</p>
    <div class="prompt-box">
      <code>Shared context (all agents read): [list fields]<br>Agent-specific state: [agent] owns [fields]<br>Conflict prevention: [strategy]<br>Storage: context passing / shared store / vector DB<br>Why: [reasoning]</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Shared memory models.</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Memory Makes the Team</h2>
  <p class="section-text">A multi-agent system without shared memory is just multiple single agents running in proximity. Shared state is what turns them into a team. Start with context passing for simple systems, graduate to a shared store as complexity grows, and add vector search when your context volume outgrows structured queries. The architecture of your memory layer determines the ceiling of your system's intelligence.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Shared Memory and State","cards":[{"front":"Context Passing","back":"Each agent receives accumulated context from all previous agents in its prompt. Simple but context windows fill up after 5-6 agents."},{"front":"Shared Memory Store","back":"All agents read from and write to a central database or key-value store. Scales well but requires infrastructure and careful schema design."},{"front":"Vector Store","back":"Store agent outputs as embeddings. Agents retrieve by semantic search. Handles massive context but complex to set up."},{"front":"Race Conditions","back":"Agent A reads state, Agent B updates it, Agent A writes based on stale data — silently overwriting Agent B\\\'s work. Prevent with locking and namespaces."},{"front":"State Corruption Prevention","back":"Optimistic locking with version numbers, agent-specific namespaces, append-only logs, or a designated state manager agent."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Shared memory and state quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Shared Memory and State","questions":[{"q":"What is the core problem that shared memory solves in multi-agent systems?","options":["It makes agents run faster","It prevents each agent from operating in isolation — agents can access context built by other agents without requiring every handoff to carry the full history","It reduces the number of API calls needed","It prevents agents from making mistakes"],"correct":1,"explanation":"Without shared memory, each agent is a goldfish. Agent B cannot use what Agent A learned. Shared state is what transforms a group of isolated agents into a coordinated team."},{"q":"What is a race condition in shared state and how does it cause data loss?","options":["When an agent takes too long to respond","When Agent A reads state, Agent B updates it, and Agent A writes based on stale data — silently overwriting the second agent update","When two agents try to read the same data simultaneously","When the state store becomes too large to query quickly"],"correct":1,"explanation":"Race conditions are silent and destructive. One agent writes based on data that another agent already changed, and the second agent update is lost without any error message."},{"q":"What strategy helps prevent state corruption when multiple agents write to shared memory?","options":["Allowing only one agent to write at a time forever","Optimistic locking with version numbers, agent-specific namespaces, append-only logs, or a designated state manager agent","Storing all state in each agent context window","Using slower API calls to prevent simultaneous writes"],"correct":1,"explanation":"Multiple prevention strategies exist: version numbers catch conflicts, namespaces prevent collisions, append-only logs make corruption impossible, and a state manager serializes all writes."}]}'>
  </div>
</div>

<nav class="lesson-nav">
  <a href="/academy/multi-agent-orchestration/04-orchestration-architectures/" class="prev">&larr; Previous: Orchestration Architectures</a>
  <a href="/academy/multi-agent-orchestration/06-conflict-resolution/" class="next">Next: Conflict Resolution &rarr;</a>
</nav>

</div>
