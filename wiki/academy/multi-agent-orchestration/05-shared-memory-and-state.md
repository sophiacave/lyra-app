# Shared Memory and State

**Course:** Multi-Agent Orchestration
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[Multi-Agent Orchestration](/academy/multi-agent-orchestration/)
  Lesson 5 of 10


  # Shared Memory and State

  Agents that share context and knowledge — the difference between a team and a group of strangers.


  ### What You'll Learn


    - Why isolated agents produce inconsistent results

    - Three models for shared state: context passing, shared memory, and vector stores

    - How to design state schemas that scale

    - Preventing state corruption in multi-agent systems




  The Problem
  ## Agents Without Shared Memory Are Goldfish

  Agent A researches a customer's history. Agent B handles the customer's complaint. But Agent B doesn't know what Agent A found. So it asks the customer to repeat everything. Sound familiar? It's the same frustration you feel when a company transfers your call and you have to start over.
  Without shared memory, each agent operates in isolation. The system has knowledge, but no individual agent can access the full picture. Shared state fixes this.


  Model 1
  ## Context Passing: The Relay Baton

  The simplest approach: each agent receives the accumulated context from all previous agents in its prompt. Agent A's output becomes part of Agent B's input, which becomes part of Agent C's input.
  **Pros:** Simple to implement. No external infrastructure. Every agent has full history.
  **Cons:** Context windows fill up fast. By agent 5 or 6, you're running out of room for the actual task. Doesn't scale.


Python — Context passing: accumulate history in the prompt

```
def pipeline_with_context(task: str, agents: list) -> str:
    # Each agent sees ALL previous outputs (context grows with each step)
    context = f"Original task: {task}\n"
    for name, system_prompt in agents:
        result = call_agent(system_prompt, context)
        context += f"\n--- {name} output ---\n{result}\n"  # accumulate
    return context

# Problem: by agent 5, the context might be 50,000+ tokens
# That leaves little room for the agent's own reasoning
```


  Model 2
  ## Shared Memory Store: The Team Database

  All agents read from and write to a central store — a database, a key-value store, or even a structured document. Each agent queries only what it needs instead of carrying everything.
  **Pros:** Scales to many agents. Each agent gets relevant context without bloat. Persists across sessions.
  **Cons:** Requires infrastructure. Agents need to know what to query. Stale data is a risk if updates lag.


Python — Shared memory store with Supabase

```
from supabase import create_client

db = create_client(SUPABASE_URL, SUPABASE_KEY)

class SharedMemory:
    def __init__(self, task_id: str):
        self.task_id = task_id

    def write(self, agent: str, key: str, value: any):
        # Each agent writes to its own namespace
        db.table("agent_memory").upsert({
            "task_id": self.task_id,
            "agent": agent, "key": key, "value": value
        }).execute()

    def read(self, key: str) -> any:
        # Any agent can read any key
        row = db.table("agent_memory").select("value").eq(
            "task_id", self.task_id
        ).eq("key", key).single().execute()
        return row.data["value"]

# Usage: agents share state without carrying it in their context
mem = SharedMemory("content-042")
mem.write("researcher", "findings", research_output)   # researcher writes
findings = mem.read("findings")                        # writer reads
```


  Model 3
  ## Vector Store: The Semantic Brain

  Store agent outputs as embeddings in a vector database. When an agent needs context, it performs a semantic search — "find everything related to customer billing issues" — and gets the most relevant pieces, regardless of when or which agent produced them.
  **Pros:** Handles massive amounts of context. Agents retrieve only what's relevant. Gets smarter as more data accumulates.
  **Cons:** More complex to set up. Embedding quality matters. Results can be unpredictable.


Python — Vector store: semantic search for agent memory (pgvector)

```
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")  # free, runs locally

def store_memory(text: str, agent: str, task_id: str):
    # Convert text to a vector and store in Supabase with pgvector
    embedding = model.encode(text).tolist()
    db.table("agent_vectors").insert({
        "task_id": task_id, "agent": agent,
        "content": text, "embedding": embedding
    }).execute()

def recall(query: str, task_id: str, limit: int = 3) -> list:
    # Semantic search: find the most relevant agent memories
    query_vec = model.encode(query).tolist()
    result = db.rpc("match_agent_memory", {
        "query_embedding": query_vec,
        "filter_task": task_id,
        "match_count": limit
    }).execute()
    return [r["content"] for r in result.data]

# Editor agent needs billing context — semantic search finds it
relevant = recall("customer billing history", "support-099")
# → Returns the 3 most relevant memories from ANY agent
```


  Real Example
  ## A State Schema That Works




      Shared State Object
      `{
  "task_id": "content-pipeline-042",
  "status": "in_progress",
  "current_stage": "editing",
  "artifacts": {
    "research": { "agent": "researcher", "completed": true, "output_ref": "..." },
    "draft": { "agent": "writer", "completed": true, "output_ref": "..." },
    "review": { "agent": "editor", "completed": false }
  },
  "shared_context": {
    "target_audience": "technical managers",
    "tone": "professional but approachable",
    "word_limit": 1500
  },
  "flags": ["needs_fact_check", "client_mentioned_deadline"]
}`
      Every agent reads shared_context. Each updates its own artifact. Flags communicate cross-cutting concerns.




  The Danger Zone
  ## State Corruption Is Your Biggest Enemy

  When multiple agents write to shared state simultaneously, you get race conditions. Agent A reads the state, Agent B updates it, Agent A writes its update based on stale data — and Agent B's work is silently lost.
  **Prevention strategies:** Use optimistic locking (version numbers on state updates). Give each agent its own namespace. Use append-only logs instead of mutable state. Designate one agent as the state manager.


  Try It Yourself
  ## Design Your State Layer


    Take your agent team from earlier lessons. Design the shared state schema. What does every agent need to know? What's agent-specific? How do you prevent conflicts?

      `Shared context (all agents read): [list fields]
Agent-specific state: [agent] owns [fields]
Conflict prevention: [strategy]
Storage: context passing / shared store / vector DB
Why: [reasoning]`




  Practice
  ## Shared memory models.


  Patterns
  ## Memory Patterns for Multi-Agent Systems




      Four Proven Memory Patterns
      `**1. Shared State Object** — A single structured document (JSON, database row) that all agents read from and write to. Each agent owns its namespace within the object. Best for: small teams (2-5 agents) with well-defined data schemas. Risk: write conflicts if two agents update simultaneously.

**2. Message Passing** — Agents communicate by sending messages through a queue or bus. No shared mutable state — each agent receives messages, processes them, and emits new messages. Best for: event-driven systems, microservice-style architectures, systems where agents run asynchronously. Risk: messages can arrive out of order; requires careful sequencing.

**3. Event Log (Append-Only)** — Every agent action is written as an immutable event to a chronological log. Any agent can read the full history to reconstruct current state. Best for: systems that need auditing, debugging, or replay capability. Corruption is impossible because nothing is overwritten. Risk: log size grows without bound; agents must filter for relevance.

**4. Blackboard Pattern** — A shared workspace where agents post partial solutions. Any agent can read the blackboard and contribute when it has relevant expertise. An orchestrator monitors the blackboard and decides when the solution is complete. Best for: complex problem-solving where the solution emerges incrementally from multiple specialists. Risk: coordination overhead; requires a strong orchestrator to prevent thrashing.`
      Choose based on your system's size, consistency requirements, and whether agents run synchronously or asynchronously. Many production systems combine two or more patterns — for example, message passing between agents with an append-only event log for auditing.




  Key Takeaway
  ## Memory Makes the Team

  A multi-agent system without shared memory is just multiple single agents running in proximity. Shared state is what turns them into a team. Start with context passing for simple systems, graduate to a shared store as complexity grows, and add vector search when your context volume outgrows structured queries. The architecture of your memory layer determines the ceiling of your system's intelligence.


  Review
  ## Key concepts.

  [Interactive: FlashDeck]


  Check Your Understanding
  ## Shared memory and state quiz.





  [← Previous: Orchestration Architectures](/academy/multi-agent-orchestration/04-orchestration-architectures/)
  [Next: Conflict Resolution →](/academy/multi-agent-orchestration/06-conflict-resolution/)
