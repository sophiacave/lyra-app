# Memory Systems

**Course:** The Automation Lab
**Order:** 3
**Type:** lesson
**Access:** Free

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 3 of 10


  # Memory Systems

  Memory is what separates a stateless tool from an intelligent agent. Without memory, every interaction is a first interaction — the agent cannot learn, cannot coordinate with other agents, and cannot improve. This lesson covers the three types of agent memory, how they work in practice, and how to query them.



    ## Why Memory Matters

    Imagine a customer support agent that forgets every conversation the moment it ends. A user asks about their order. The agent looks it up, gives an answer. The user follows up five minutes later — and the agent has no idea who they are or what they asked. That is a stateless tool, not an agent.
    Memory gives agents **continuity**. It lets them remember what happened, learn from outcomes, and share information with other agents. The three types of memory serve different purposes, and a well-designed agent uses all three.



    ## Three Types of Agent Memory

    Here are the three types of memory, their characteristics, and when to use each:



        ** Short-Term Memory**
        The current conversation window. Exists only during the active session — vanishes when the session ends. Fast and immediate, like a mental scratchpad. Implementation: the messages array passed to the API on each turn.


        ** Long-Term Memory**
        Persisted in a database (`agent_memory` table). Survives across sessions, making agents smarter over time. Use for user preferences, past decisions, learned facts, and resolution patterns.


        ** Shared Memory**
        A key-value store accessible to ALL agents (`brain_context`). The communication bus that lets agents coordinate without talking directly to each other. One agent writes; others read.





    ## Memory in Code

    Here is a practical memory system in Python. Short-term is a list. Long-term is a database table. Shared is a key-value store accessible to all agents:



```
class AgentMemory:
    def __init__(self, agent_name, db):
        self.agent_name = agent_name
        self.db = db
        self.short_term = []  # dies when session ends

    # Short-term: fast, ephemeral
    def remember_now(self, fact):
        self.short_term.append(fact)

    # Long-term: persists across sessions
    def remember_forever(self, key, value):
        self.db.execute(
            "INSERT INTO agent_memory (agent, key, value) "
            "VALUES (%s, %s, %s) ON CONFLICT (agent, key) "
            "DO UPDATE SET value = %s",
            [self.agent_name, key, value, value]
        )

    # Shared: visible to ALL agents
    def share(self, key, value, category="session"):
        self.db.execute(
            "INSERT INTO brain_context (key, value, category) "
            "VALUES (%s, %s, %s) ON CONFLICT (key) "
            "DO UPDATE SET value = %s",
            [key, value, category, value]
        )

    def recall_shared(self, key):
        return self.db.execute(
            "SELECT value FROM brain_context WHERE key = %s",
            [key]
        )
```


    `remember_now()` stores in a Python list — gone when the process ends. `remember_forever()` writes to a database — survives forever. `share()` writes to the shared brain — any agent can read it.



    ## The Context Window Problem

    Every LLM has a **context window** — the maximum amount of text it can process at once. Claude's context window is up to 200K tokens (~150K words). That sounds like a lot, but a busy agent can fill it fast:



        **Problem: Context Overflow**
        After 50 tool calls, the conversation history might be 80K tokens. Add a large file read and you are at 120K. The agent starts losing earlier context as new information pushes old information out.


        **Solution: Write to Long-Term Memory**
        Smart agents periodically checkpoint important facts to long-term memory. When context gets full, they can start a fresh session and recall what matters from the database. The brain remembers; the chat forgets.



    This is not a theoretical problem — it is the single most common cause of agent "amnesia." An agent that works perfectly for 20 minutes suddenly forgets your name, your goal, or what it was doing. The fix is always the same: write critical state to long-term or shared memory before context overflows.



    ## Vector Memory and Semantic Search

    Simple key-value memory works when you know exactly what to look up. But what if you need to find memories by *meaning* rather than exact key?
    **Vector embeddings** convert text into numerical arrays that capture semantic meaning. Similar concepts end up near each other in vector space. This lets agents search their memory the way humans do — by association, not exact match.


      **Example:** An agent stores the memory "User prefers dark mode and minimal UI." Later, a query asks "what design preferences does this user have?" A key-value lookup would fail (wrong key). A vector search finds it instantly because the *meaning* is similar — even though the words are different.


    Supabase supports vector search natively via pgvector. You store embeddings alongside your brain_context rows, then query with cosine similarity. This is the foundation of RAG (Retrieval-Augmented Generation), covered in depth in the RAG & Vector Search course.



    ## Querying Agent Memory

    To read from agent memory, you use SQL queries against the appropriate table. Here are common query patterns:



```
-- Read all shared memories in a category
SELECT * FROM brain_context WHERE category = 'identity';

-- Read a specific agent's long-term memories
SELECT * FROM agent_memory WHERE agent = 'atlas';

-- Find a specific key
SELECT value FROM brain_context WHERE key = 'session.active_work';
```


    **SELECT *** means "get all columns." **FROM** names the table. **WHERE** filters rows by a condition. Use `brain_context` for shared memory and `agent_memory` for an individual agent's long-term storage.



    ## Memory Lifecycle Management

    Memory without management becomes noise. Over time, an unmanaged memory store accumulates stale, conflicting, and irrelevant entries that degrade agent performance. Three strategies keep memory clean:



        **TTL (Time-To-Live)**
        Set an expiration on temporary memories. Session state that is 30 days old is probably stale. Task outputs from completed projects can be archived. Use a background job that cleans expired entries weekly.


        **Consolidation**
        Periodically merge related memories into summaries. Instead of 50 individual session records, create one consolidated entry: "Q1 2026: deployed 12 features, fixed 8 bugs, migrated to new database." This reduces read time while preserving the essential information.


        **Versioning**
        When updating a memory, keep the previous version. This creates an audit trail and enables rollbacks. If a memory update introduces bad data, you can revert to the last known good state. Store versions in a separate history table or use a `version` column.





    ## Memory Architecture Patterns

    Different use cases call for different memory architectures. Here are the three most common patterns:



        **Flat Key-Value**
        Simple key-value store with no nesting. Fast reads, easy to understand. Works for small to medium memory stores (under 1,000 keys). Starts to struggle when you need complex queries or relationships between entries.


        **Hierarchical Namespaced**
        Keys organized in a tree structure: `identity.user`, `identity.preferences`, `system.infrastructure`. Agents can read entire namespaces (`identity.*`) without loading the full store. Scales to thousands of entries while staying organized.


        **Hybrid (KV + Vectors)**
        Combines key-value for structured data (settings, config, rules) with vector embeddings for unstructured data (conversations, decisions, learning). Queries by key for known lookups and by semantic similarity for contextual retrieval.


    Most production agent systems use the hybrid pattern. It gives you the speed of key-value lookups for routine reads and the intelligence of semantic search for complex queries.



    ## Memory Anti-Patterns

    Common mistakes that degrade agent memory performance:


      **Store-everything syndrome:** Writing every conversation turn to long-term memory. This fills the database with low-value noise that makes retrieval slower and less accurate. Store decisions, outcomes, and learned facts — not raw conversation logs.


      **Key name collisions:** Two agents both using `status` as a key name. Agent A overwrites Agent B's status. Use namespaced keys: `agent.writer.status` vs `agent.editor.status`.


      **No cleanup:** Memory that grows forever eventually degrades retrieval quality. Set TTLs on temporary data. Archive completed project memories. Consolidate old session logs into summaries.




### Memory Types

**Card 1:**
Front: Short-Term Memory
Back: Exists only during the current conversation (the context window). Vanishes when the session ends. Fast but ephemeral — like a mental scratchpad.

**Card 2:**
Front: Long-Term Memory
Back: Persisted in a database (agent_memory table). Survives across sessions. Makes agents smarter over time. Use for user preferences, past decisions, learned facts.

**Card 3:**
Front: Shared Memory
Back: A key-value store accessible to ALL agents (brain_context). The communication bus that lets agents coordinate without talking directly to each other.

**Card 4:**
Front: What is the context window problem?
Back: LLMs have a max context size. After many tool calls, older context gets pushed out. Solution: checkpoint critical state to long-term memory before overflow.

**Card 5:**
Front: What are vector embeddings?
Back: Numerical arrays that capture the meaning of text. Enable semantic search — find memories by meaning, not just exact key match. Powered by pgvector in Supabase.

**Card 6:**
Front: When to use long-term vs shared memory?
Back: Long-term: one agent remembering things across its own sessions. Shared: passing information between different agents or storing system-wide state.



    ## When to Use Each Memory Type

    A common mistake is using the wrong memory type for the job. Here is a decision guide:


      **Is it temporary (just this session)?**

        Yes → **Short-term** — keep it in the conversation context

        No → Does it belong to one agent or many?

          One agent → **Long-term** — write to agent_memory

          Multiple agents → **Shared** — write to brain_context

    If in doubt, default to shared memory. It is always better for another agent to have access to a memory it does not need than for it to lack a memory it does need.



### Quiz

**Q1: Which type of memory disappears when a conversation ends?**
    A. Long-term
    B. Shared
  ✓ C. Short-term
    D. All of them
  *Short-term memory only exists during the current session (context window). Long-term and shared memory persist in databases.*

**Q2: An agent needs to remember a user's preferences across multiple sessions. Which memory type should it use?**
    A. Short-term
    B. Shared
  ✓ C. Long-term
    D. None needed
  *Long-term memory (agent_memory table) persists across sessions — perfect for storing user preferences, past decisions, and learned facts.*

**Q3: Two agents need to coordinate — Agent A writes a result that Agent B should act on. Which memory type enables this?**
    A. Short-term (session context)
    B. Long-term (agent_memory)
  ✓ C. Shared (brain_context)
    D. No memory needed
  *Shared memory (brain_context) is the communication bus between agents. Agent A writes, Agent B reads — no direct connection needed.*

**Q4: After 50 tool calls, an agent suddenly forgets the user's name. What happened?**
    A. The agent crashed
  ✓ B. The context window overflowed and older information was pushed out
    C. The database was deleted
    D. Short-term memory corrupted
  *Context overflow is the most common cause of agent amnesia. The fix: checkpoint critical state to long-term memory before the context fills up.*

**Q5: What advantage does vector search have over key-value lookup?**
    A. It is faster
  ✓ B. It finds memories by semantic meaning, not just exact key match
    C. It uses less storage
    D. It works without a database
  *Vector search matches by meaning. A query about 'design preferences' can find a memory stored under 'ui settings' because the meanings are similar.*
