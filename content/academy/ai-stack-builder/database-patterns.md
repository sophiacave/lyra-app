---
title: "Database Patterns"
course: "ai-stack-builder"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Database Patterns</h1>
  <p class="sub">Your AI needs a brain — a structured place to store memory, context, and agent state. Let's design that schema interactively and see the relationships in real-time.</p>
</div>

<h2>The Three-Table Brain Schema</h2>
<p style="font-size:.85rem;color:#888"><strong>Why 3 tables instead of 1?</strong> Each table serves a different purpose: <code style="color:#f59e0b">brain_context</code> holds the agent's current state (like a whiteboard), <code style="color:#f59e0b">agent_memory</code> stores past interactions (like a journal), and <code style="color:#f59e0b">consciousness_stream</code> logs every action (like security footage). Separating them lets you query and optimize each independently.</p>

<div class="panel">
<div class="label">Key Patterns</div>
<h3 style="margin-top:0">Pattern 1: Key-Value Brain</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> Instead of creating a new column for every piece of information, you store everything as key-value pairs. This means your AI agent can learn new things without database migrations. The <code style="color:#f59e0b">brain_context</code> table is a flexible key-value store. Keys use dot notation (like <code style="color:#f59e0b">identity.name</code>, <code style="color:#f59e0b">session.active_work</code>) for namespacing — the dots create a hierarchy, like folders on your computer. Values are JSONB (a Postgres data type that stores structured JSON data — it can hold strings, numbers, arrays, or nested objects, and you can query inside it).</p>

<div class="code-block"><div class="code-label">SQL — Create the brain_context table</div>
<pre><code class="language-sql">-- Pattern 1: Key-Value Brain (flexible, no migrations needed)
CREATE TABLE brain_context (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT UNIQUE NOT NULL,        -- dot notation: 'identity.name'
  value      JSONB NOT NULL DEFAULT '{}', -- any structured data
  category   TEXT DEFAULT 'general',      -- namespace: session, directive, system
  description TEXT,                       -- human-readable note
  priority   INT DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookups by key and category
CREATE INDEX idx_brain_key ON brain_context(key);
CREATE INDEX idx_brain_category ON brain_context(category);

-- Upsert example: write or update a brain key
INSERT INTO brain_context (key, value, category, description)
VALUES ('session.active_work', '{"task": "deploy v2"}', 'session', 'Current work')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();</code></pre>
</div>

<h3>Pattern 2: Append-Only Memory</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> Deleting data destroys context. An AI agent that forgets past interactions can't learn or improve. By always appending, you build a complete history the agent can search through. The <code style="color:#f59e0b">agent_memory</code> table stores every interaction. Use <code style="color:#f59e0b">importance</code> scores (1-10) to prioritize retrieval — when the agent needs context, it grabs high-importance memories first. The <code style="color:#f59e0b">embedding</code> column uses <code style="color:#f59e0b">vector(1536)</code> — that's a list of 1,536 numbers that represent the meaning of text. AI models convert text into these vectors so you can find semantically similar memories (e.g., "find memories about deployment" would match "pushed code to Vercel" even though the words are different). The 1536 number matches OpenAI's embedding model dimensions.</p>

<div class="code-block"><div class="code-label">SQL — Create the agent_memory table with vector search</div>
<pre><code class="language-sql">-- Enable pgvector extension (run once per database)
CREATE EXTENSION IF NOT EXISTS vector;

-- Pattern 2: Append-Only Memory (never delete, always append)
CREATE TABLE agent_memory (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content    TEXT NOT NULL,                -- what happened
  role       TEXT DEFAULT 'system',        -- user, assistant, system
  importance INT DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  embedding  vector(1536),                -- semantic meaning as numbers
  metadata   JSONB DEFAULT '{}',          -- tags, source, context
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Find the 5 most relevant memories by semantic similarity
SELECT content, importance,
       1 - (embedding <=> $1::vector) AS similarity
FROM agent_memory
WHERE importance >= 7
ORDER BY embedding <=> $1::vector
LIMIT 5;</code></pre>
</div>

<h3>Pattern 3: Event Streaming</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> When something goes wrong (and it will), you need to know exactly what your agent did and when. The <code style="color:#f59e0b">consciousness_stream</code> is an event log — every action the agent takes gets logged with its input and output. This is invaluable for debugging ("why did the agent send that email?"), auditing ("who changed this data?"), and replaying agent behavior to test improvements.</p>

<div class="code-block"><div class="code-label">SQL — Create the consciousness_stream event log</div>
<pre><code class="language-sql">-- Pattern 3: Event Streaming (every action logged, never deleted)
CREATE TABLE consciousness_stream (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,               -- 'tool_call', 'decision', 'error'
  agent_id   TEXT DEFAULT 'primary',      -- which agent acted
  input      JSONB DEFAULT '{}',          -- what was the prompt/trigger
  output     JSONB DEFAULT '{}',          -- what was the result
  duration_ms INT,                        -- how long it took
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Debug: what did the agent do in the last hour?
SELECT event_type, input->>'action' AS action,
       output->>'status' AS status, duration_ms
FROM consciousness_stream
WHERE created_at > now() - interval '1 hour'
ORDER BY created_at DESC;</code></pre>
</div>
</div>


<div data-learn="FlashDeck" data-props='{"title":"Database Patterns Flashcards","cards":[{"front":"What is the key-value brain pattern?","back":"Instead of creating a new column for every piece of information, you store everything as key-value pairs in brain_context. New keys can be added without database migrations — the schema stays the same."},{"front":"What does vector(1536) store and why?","back":"A list of 1,536 floating-point numbers representing the semantic meaning of text. These embeddings let you find similar memories by meaning rather than exact keyword match. The 1536 dimension matches OpenAI\\\'s embedding model."},{"front":"Why use append-only memory instead of updating records?","back":"Deleting data destroys context. An AI agent that forgets past interactions can\\\'t learn. By always appending to agent_memory, you build a complete searchable history with importance scores for prioritized retrieval."},{"front":"What is the consciousness_stream table for?","back":"An append-only event log recording every agent action with its input and output. Invaluable for debugging (why did the agent do that?), auditing (who changed this?), and replaying behavior to test improvements."},{"front":"What does dot notation in brain_context keys provide?","back":"Namespacing — keys like identity.name and session.active_work create a hierarchy similar to folders on a computer. This organizes the key-value store so related data is grouped logically."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Database Patterns Quiz","questions":[{"q":"Why use a key-value pattern for brain_context instead of separate columns?","options":["It is faster to query","New keys can be added without database migrations","It uses less storage","It is more secure"],"correct":1,"explanation":"The key-value pattern means your AI agent can learn new types of information without ALTER TABLE migrations. You just insert a new key — the schema stays the same."},{"q":"What does `vector(1536)` store in the agent_memory table?","options":["A list of 1536 user IDs","A 1536-character text string","1536 numbers representing the semantic meaning of text","A compressed image"],"correct":2,"explanation":"Embeddings are lists of floating-point numbers (1536 for OpenAI models) that encode the semantic meaning of text. They enable similarity search — finding memories that are conceptually related even when words differ."},{"q":"What is the primary purpose of the consciousness_stream table?","options":["Storing user preferences","Logging every agent action for debugging and auditing","Caching API responses","Managing user sessions"],"correct":1,"explanation":"The consciousness_stream is an append-only event log. Every agent action is recorded with its input and output, enabling debugging, auditing, and behavioral replay."}]}'></div>
</div>
