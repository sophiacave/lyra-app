# Database Patterns

**Course:** AI Stack Builder
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 7 of 10


  # Database Patterns

  Your AI needs a brain — a structured place to store memory, context, and agent state. These three patterns are the foundation of every persistent AI system, from simple chatbots to autonomous agents.


## Why Database Design Matters for AI

Most AI tutorials focus on prompts and models. But **the database is where AI becomes useful**. Without persistent memory, every conversation starts from zero. Without structured state, your agent cannot plan or learn. Without event logs, you cannot debug or improve.

The three-table architecture below is not theoretical — it is the exact schema powering production AI systems. Each table serves a distinct purpose, and separating them lets you query and optimize each independently.


&#x1f9e0;
brain_contextCurrent state — like a whiteboard. What the agent knows RIGHT NOW.


&#x1f4d3;
agent_memoryPast interactions — like a journal. Searchable by meaning, not just keywords.


&#x1f4f9;
consciousness_streamAction log — like security footage. Every decision recorded.


## Pattern 1: Key-Value Brain

Instead of creating a new column for every piece of information, you store everything as key-value pairs. This means your AI agent can learn new things **without database migrations**. No ALTER TABLE. No downtime. Just insert a new key.

Keys use **dot notation** (like `identity.name`, `session.active_work`) for namespacing — the dots create a hierarchy, like folders on your computer. Values are **JSONB** — a Postgres data type that stores structured JSON data. It can hold strings, numbers, arrays, or nested objects, and you can query inside it.


SQL — Create the brain_context table

```
-- Pattern 1: Key-Value Brain (flexible, no migrations needed)
CREATE TABLE brain_context (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,        -- dot notation: 'identity.name'
  value       JSONB NOT NULL DEFAULT '{}', -- any structured data
  category    TEXT DEFAULT 'general',      -- namespace: session, directive, system
  description TEXT,                       -- human-readable note
  priority    INT DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Fast lookups by key and category
CREATE INDEX idx_brain_key ON brain_context(key);
CREATE INDEX idx_brain_category ON brain_context(category);
```


The power of this pattern is the **upsert** — a single query that either creates a new key or updates an existing one. Your agent never has to check "does this key exist?" before writing.


SQL — Upsert: write or update a brain key

```
-- If 'session.active_work' exists → update it
-- If it doesn't exist → create it
INSERT INTO brain_context (key, value, category, description)
VALUES (
  'session.active_work',
  '{"task": "deploy v2", "status": "in_progress"}',
  'session',
  'Current work in progress'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();
```


**Real-world categories:** `session.*` (what the agent is doing now), `directive.*` (rules and behaviors), `identity.*` (who the agent is), `system.*` (infrastructure state), `infrastructure.*` (deployment config). Each category can hold hundreds of keys.


## Pattern 2: Append-Only Memory

Deleting data destroys context. An AI agent that forgets past interactions cannot learn or improve. The **append-only** pattern means you **never delete, always append** — building a complete history the agent can search through.

The `embedding` column is what makes this powerful. It stores a **vector** — a list of numbers that represent the *meaning* of text. AI models convert text into these vectors, and you can find semantically similar memories even when the words are completely different (e.g., searching "deployment" finds a memory about "pushed code to Vercel").


SQL — Create the agent_memory table with vector search

```
-- Enable pgvector extension (run once per database)
CREATE EXTENSION IF NOT EXISTS vector;

-- Pattern 2: Append-Only Memory (never delete, always append)
CREATE TABLE agent_memory (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT NOT NULL,              -- what happened
  role       TEXT DEFAULT 'system',      -- user, assistant, system
  importance INT DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  embedding  vector(384),             -- semantic meaning (384 = BGE-small)
  metadata   JSONB DEFAULT '{}',      -- tags, source, context
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create an index for fast vector similarity searches
CREATE INDEX idx_memory_embedding
  ON agent_memory
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```


To find relevant memories, you compute the embedding of your query and search by **cosine similarity** — a measure of how close two vectors are in meaning-space. The `` operator is pgvector's similarity function.


SQL — Find the 5 most relevant memories by meaning

```
-- $1 is the embedding of your search query
-- (generated by BGE-small or another embedding model)
SELECT content, importance,
       1 - (embedding  $1::vector) AS similarity
FROM agent_memory
WHERE importance >= 7        -- only high-importance memories
ORDER BY embedding  $1::vector
LIMIT 5;
```


**Embedding dimensions:** The number in `vector(384)` must match your embedding model. BGE-small produces 384 dimensions (free via HuggingFace). OpenAI's ada-002 produces 1536. Larger dimensions capture more nuance but use more storage and are slightly slower to search.


## Pattern 3: Event Streaming (Consciousness Log)

When something goes wrong (and it will), you need to know **exactly what your agent did and when**. The consciousness stream is an event log — every action the agent takes gets recorded with its input, output, and duration.

This is invaluable for three things: **debugging** ("why did the agent send that email?"), **auditing** ("who changed this data?"), and **replaying** agent behavior to test improvements.


SQL — Create the consciousness_stream event log

```
-- Pattern 3: Event Streaming (every action logged, never deleted)
CREATE TABLE consciousness_stream (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT NOT NULL,              -- 'tool_call', 'decision', 'error'
  agent_id    TEXT DEFAULT 'primary',    -- which agent acted
  input       JSONB DEFAULT '{}',       -- what was the prompt/trigger
  output      JSONB DEFAULT '{}',       -- what was the result
  duration_ms INT,                       -- how long it took
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for time-range queries (most common access pattern)
CREATE INDEX idx_stream_time ON consciousness_stream(created_at DESC);
CREATE INDEX idx_stream_type ON consciousness_stream(event_type);
```


SQL — Debug: what did the agent do in the last hour?

```
SELECT event_type,
       input->>('action') AS action,
       output->>('status') AS status,
       duration_ms
FROM consciousness_stream
WHERE created_at > now() - interval '1 hour'
ORDER BY created_at DESC;
```


## How the Three Tables Work Together

Each table answers a different question. Together, they give your AI agent the full picture.


Table
Question It Answers
Write Pattern
Read Pattern


brain_context
"What do I know RIGHT NOW?"
Upsert (INSERT ... ON CONFLICT UPDATE)
SELECT by key or category


agent_memory
"What happened before that is relevant?"
Append only (INSERT, never DELETE)
Vector similarity search


consciousness_stream
"What exactly did I do and when?"
Append only (INSERT, never DELETE)
Time-range query + filter by event_type


Boot: Agent reads **brain_context** for current state → knows what it was doing
Query: User asks a question → agent searches **agent_memory** for relevant past context
Act: Agent takes an action → logs it to **consciousness_stream**
Update: Agent writes new state to **brain_context** → ready for next session


## Security: Row Level Security (RLS)

Every table that stores sensitive data **must** have RLS enabled. Without it, anyone with your Supabase anon key can read all data. With RLS, the database itself enforces access rules — even if your application code has a bug.


SQL — RLS policies for brain tables

```
-- Enable RLS on all three tables
ALTER TABLE brain_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE consciousness_stream ENABLE ROW LEVEL SECURITY;

-- Service role (edge functions) can read/write everything
-- Anon key (browser) gets NOTHING — these are server-only tables
-- This is why edge functions use the service role key
```


**Critical:** The service role key bypasses RLS entirely — it has full access to all data. This key must **never** appear in frontend code. It belongs exclusively in server-side environments: Supabase Edge Functions, server API routes, and cron jobs. If you accidentally expose it, revoke and regenerate immediately.


## Scaling Considerations

These patterns scale well, but knowing the limits helps you plan ahead.


KV

**brain_context**
Stays small (hundreds to low thousands of rows). The UNIQUE constraint on key means it grows slowly. Upserts keep it current. **No scaling concerns** — this table is effectively always fast.


MEM

**agent_memory**
Grows continuously (append-only). At 100K+ rows, add an IVFFlat index on the embedding column for fast vector search. At 1M+ rows, consider partitioning by date or archiving old memories to cold storage.


LOG

**consciousness_stream**
Grows the fastest (every agent action = a row). Partition by month for clean archival. The time-based index keeps recent queries fast. Consider a retention policy: keep 90 days hot, archive the rest.


### Quiz

**Q1: Why use a key-value pattern for brain_context instead of separate columns?**
    A. It is faster to query
  ✓ B. New keys can be added without database migrations — the schema never changes
    C. It uses less storage
    D. It is more secure
  *The key-value pattern means your AI agent can learn new types of information without ALTER TABLE migrations. You just insert a new key — the schema stays the same. This is critical for evolving AI systems.*

**Q2: What does vector(384) store in the agent_memory table?**
    A. A list of 384 user IDs
    B. A 384-character text string
  ✓ C. 384 floating-point numbers representing the semantic meaning of text
    D. A compressed image
  *Embeddings are lists of floating-point numbers that encode the semantic meaning of text. 384 dimensions matches the BGE-small model (free via HuggingFace). They enable similarity search — finding memories that are conceptually related even when the words differ.*

**Q3: What is the primary purpose of the consciousness_stream table?**
    A. Storing user preferences
  ✓ B. Logging every agent action with its input, output, and timing for debugging and auditing
    C. Caching API responses
    D. Managing user sessions
  *The consciousness_stream is an append-only event log. Every agent action is recorded with its input, output, and duration — enabling debugging, auditing, and behavioral replay.*

**Q4: Why is RLS critical for brain tables?**
    A. It makes queries faster
  ✓ B. Without RLS, anyone with the anon key can read all brain data — RLS ensures only authorized access
    C. RLS is required by Supabase
    D. It compresses the data
  *Without RLS, the anon key (which is public and visible in browser source code) grants full read access to all tables. RLS policies restrict access at the database level — even if your application code has a bug, the database enforces the rules.*

**Q5: An upsert (INSERT ... ON CONFLICT DO UPDATE) does what?**
    A. Creates a new row every time
  ✓ B. Creates the row if the key does not exist, or updates it if it does — in a single atomic query
    C. Deletes the old row and creates a new one
    D. Updates the row only if it already exists
  *Upsert combines INSERT and UPDATE into one atomic operation. If the key exists, it updates the row. If not, it creates a new one. This eliminates the need for a separate check-then-write pattern, preventing race conditions.*


### Database Patterns Flashcards

**Card 1:**
Front: What is the key-value brain pattern?
Back: Instead of creating a new column for every piece of information, you store everything as key-value pairs in brain_context. New keys can be added without database migrations — the schema stays the same.

**Card 2:**
Front: What does vector(384) store and why 384?
Back: A list of 384 floating-point numbers representing the semantic meaning of text. These embeddings let you find similar memories by meaning rather than exact keyword match. 384 dimensions matches the BGE-small model (free via HuggingFace). OpenAI models use 1536.

**Card 3:**
Front: Why use append-only memory instead of updating records?
Back: Deleting data destroys context. An AI agent that forgets past interactions cannot learn. By always appending to agent_memory, you build a complete searchable history with importance scores for prioritized retrieval.

**Card 4:**
Front: What is the consciousness_stream table for?
Back: An append-only event log recording every agent action with its input, output, and duration. Invaluable for debugging (why did the agent do that?), auditing (who changed this?), and replaying behavior to test improvements.

**Card 5:**
Front: What does dot notation in brain_context keys provide?
Back: Namespacing — keys like identity.name and session.active_work create a hierarchy similar to folders on a computer. This organizes the key-value store so related data is grouped logically without needing separate tables.

**Card 6:**
Front: What is the  operator in pgvector?
Back: The cosine distance operator. It measures how far apart two vectors are in meaning-space. Lower values = more similar. Used with ORDER BY to find the closest matching memories. The expression 1 - (embedding  query) converts distance to similarity score.


Lesson 7 of 10

Module 1
