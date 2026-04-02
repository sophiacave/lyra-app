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
  <h1>Database <span class="accent">Patterns</span></h1>
  <p class="sub">Your AI needs a brain — a structured place to store memory, context, and agent state. These three patterns are the foundation of every persistent AI system, from simple chatbots to autonomous agents.</p>
</div>

<div class="content">

<div class="card">
<h2>Why Database Design Matters for AI</h2>
<p>Most AI tutorials focus on prompts and models. But <strong style="color:#e5e5e5">the database is where AI becomes useful</strong>. Without persistent memory, every conversation starts from zero. Without structured state, your agent cannot plan or learn. Without event logs, you cannot debug or improve.</p>

<p>The three-table architecture below is not theoretical — it is the exact schema powering production AI systems. Each table serves a distinct purpose, and separating them lets you query and optimize each independently.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f9e0;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">brain_context</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Current state — like a whiteboard. What the agent knows RIGHT NOW.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f4d3;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">agent_memory</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Past interactions — like a journal. Searchable by meaning, not just keywords.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f4f9;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">consciousness_stream</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Action log — like security footage. Every decision recorded.</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Pattern 1: Key-Value Brain</h2>
<p>Instead of creating a new column for every piece of information, you store everything as key-value pairs. This means your AI agent can learn new things <strong style="color:#e5e5e5">without database migrations</strong>. No ALTER TABLE. No downtime. Just insert a new key.</p>

<p>Keys use <strong style="color:#e5e5e5">dot notation</strong> (like <code style="color:#f59e0b">identity.name</code>, <code style="color:#f59e0b">session.active_work</code>) for namespacing — the dots create a hierarchy, like folders on your computer. Values are <strong style="color:#e5e5e5">JSONB</strong> — a Postgres data type that stores structured JSON data. It can hold strings, numbers, arrays, or nested objects, and you can query inside it.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Create the brain_context table</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Pattern 1: Key-Value Brain (flexible, no migrations needed)</span>
<span style="color:#c084fc">CREATE TABLE</span> brain_context (
  id          <span style="color:#34d399">UUID</span> <span style="color:#c084fc">PRIMARY KEY DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>(),
  key         <span style="color:#34d399">TEXT</span> <span style="color:#c084fc">UNIQUE NOT NULL</span>,        <span style="color:#71717a">-- dot notation: 'identity.name'</span>
  value       <span style="color:#34d399">JSONB</span> <span style="color:#c084fc">NOT NULL DEFAULT</span> <span style="color:#fb923c">'{}'</span>, <span style="color:#71717a">-- any structured data</span>
  category    <span style="color:#34d399">TEXT</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'general'</span>,      <span style="color:#71717a">-- namespace: session, directive, system</span>
  description <span style="color:#34d399">TEXT</span>,                       <span style="color:#71717a">-- human-readable note</span>
  priority    <span style="color:#34d399">INT</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">5</span> <span style="color:#c084fc">CHECK</span> (priority <span style="color:#c084fc">BETWEEN</span> <span style="color:#fb923c">1</span> <span style="color:#c084fc">AND</span> <span style="color:#fb923c">10</span>),
  created_at  <span style="color:#34d399">TIMESTAMPTZ</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>(),
  updated_at  <span style="color:#34d399">TIMESTAMPTZ</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#71717a">-- Fast lookups by key and category</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_key <span style="color:#c084fc">ON</span> brain_context(key);
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_category <span style="color:#c084fc">ON</span> brain_context(category);</code></pre>
</div>

<p>The power of this pattern is the <strong style="color:#e5e5e5">upsert</strong> — a single query that either creates a new key or updates an existing one. Your agent never has to check "does this key exist?" before writing.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Upsert: write or update a brain key</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- If 'session.active_work' exists → update it</span>
<span style="color:#71717a">-- If it doesn't exist → create it</span>
<span style="color:#c084fc">INSERT INTO</span> brain_context (key, value, category, description)
<span style="color:#c084fc">VALUES</span> (
  <span style="color:#fb923c">'session.active_work'</span>,
  <span style="color:#fb923c">'{"task": "deploy v2", "status": "in_progress"}'</span>,
  <span style="color:#fb923c">'session'</span>,
  <span style="color:#fb923c">'Current work in progress'</span>
)
<span style="color:#c084fc">ON CONFLICT</span> (key) <span style="color:#c084fc">DO UPDATE SET</span>
  value = <span style="color:#34d399">EXCLUDED</span>.value,
  description = <span style="color:#34d399">EXCLUDED</span>.description,
  updated_at = <span style="color:#34d399">now</span>();</code></pre>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world categories:</strong> <code style="color:#f59e0b">session.*</code> (what the agent is doing now), <code style="color:#f59e0b">directive.*</code> (rules and behaviors), <code style="color:#f59e0b">identity.*</code> (who the agent is), <code style="color:#f59e0b">system.*</code> (infrastructure state), <code style="color:#f59e0b">infrastructure.*</code> (deployment config). Each category can hold hundreds of keys.
</div>
</div>

<div class="card">
<h2>Pattern 2: Append-Only Memory</h2>
<p>Deleting data destroys context. An AI agent that forgets past interactions cannot learn or improve. The <strong style="color:#e5e5e5">append-only</strong> pattern means you <strong style="color:#e5e5e5">never delete, always append</strong> — building a complete history the agent can search through.</p>

<p>The <code style="color:#f59e0b">embedding</code> column is what makes this powerful. It stores a <strong style="color:#e5e5e5">vector</strong> — a list of numbers that represent the <em>meaning</em> of text. AI models convert text into these vectors, and you can find semantically similar memories even when the words are completely different (e.g., searching "deployment" finds a memory about "pushed code to Vercel").</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Create the agent_memory table with vector search</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable pgvector extension (run once per database)</span>
<span style="color:#c084fc">CREATE EXTENSION IF NOT EXISTS</span> vector;

<span style="color:#71717a">-- Pattern 2: Append-Only Memory (never delete, always append)</span>
<span style="color:#c084fc">CREATE TABLE</span> agent_memory (
  id         <span style="color:#34d399">UUID</span> <span style="color:#c084fc">PRIMARY KEY DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>(),
  content    <span style="color:#34d399">TEXT</span> <span style="color:#c084fc">NOT NULL</span>,              <span style="color:#71717a">-- what happened</span>
  role       <span style="color:#34d399">TEXT</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'system'</span>,      <span style="color:#71717a">-- user, assistant, system</span>
  importance <span style="color:#34d399">INT</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">5</span> <span style="color:#c084fc">CHECK</span> (importance <span style="color:#c084fc">BETWEEN</span> <span style="color:#fb923c">1</span> <span style="color:#c084fc">AND</span> <span style="color:#fb923c">10</span>),
  embedding  <span style="color:#34d399">vector</span>(<span style="color:#fb923c">384</span>),             <span style="color:#71717a">-- semantic meaning (384 = BGE-small)</span>
  metadata   <span style="color:#34d399">JSONB</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'{}'</span>,      <span style="color:#71717a">-- tags, source, context</span>
  created_at <span style="color:#34d399">TIMESTAMPTZ</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#71717a">-- Create an index for fast vector similarity searches</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_memory_embedding
  <span style="color:#c084fc">ON</span> agent_memory
  <span style="color:#c084fc">USING</span> ivfflat (embedding vector_cosine_ops)
  <span style="color:#c084fc">WITH</span> (lists = <span style="color:#fb923c">100</span>);</code></pre>
</div>

<p>To find relevant memories, you compute the embedding of your query and search by <strong style="color:#e5e5e5">cosine similarity</strong> — a measure of how close two vectors are in meaning-space. The <code style="color:#f59e0b">&lt;=&gt;</code> operator is pgvector's similarity function.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Find the 5 most relevant memories by meaning</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- $1 is the embedding of your search query</span>
<span style="color:#71717a">-- (generated by BGE-small or another embedding model)</span>
<span style="color:#c084fc">SELECT</span> content, importance,
       <span style="color:#fb923c">1</span> - (embedding <span style="color:#c084fc">&lt;=&gt;</span> $1::<span style="color:#34d399">vector</span>) <span style="color:#c084fc">AS</span> similarity
<span style="color:#c084fc">FROM</span> agent_memory
<span style="color:#c084fc">WHERE</span> importance >= <span style="color:#fb923c">7</span>        <span style="color:#71717a">-- only high-importance memories</span>
<span style="color:#c084fc">ORDER BY</span> embedding <span style="color:#c084fc">&lt;=&gt;</span> $1::<span style="color:#34d399">vector</span>
<span style="color:#c084fc">LIMIT</span> <span style="color:#fb923c">5</span>;</code></pre>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Embedding dimensions:</strong> The number in <code style="color:#f59e0b">vector(384)</code> must match your embedding model. BGE-small produces 384 dimensions (free via HuggingFace). OpenAI's ada-002 produces 1536. Larger dimensions capture more nuance but use more storage and are slightly slower to search.
</div>
</div>

<div class="card">
<h2>Pattern 3: Event Streaming (Consciousness Log)</h2>
<p>When something goes wrong (and it will), you need to know <strong style="color:#e5e5e5">exactly what your agent did and when</strong>. The consciousness stream is an event log — every action the agent takes gets recorded with its input, output, and duration.</p>

<p>This is invaluable for three things: <strong style="color:#e5e5e5">debugging</strong> ("why did the agent send that email?"), <strong style="color:#e5e5e5">auditing</strong> ("who changed this data?"), and <strong style="color:#e5e5e5">replaying</strong> agent behavior to test improvements.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Create the consciousness_stream event log</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Pattern 3: Event Streaming (every action logged, never deleted)</span>
<span style="color:#c084fc">CREATE TABLE</span> consciousness_stream (
  id          <span style="color:#34d399">UUID</span> <span style="color:#c084fc">PRIMARY KEY DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>(),
  event_type  <span style="color:#34d399">TEXT</span> <span style="color:#c084fc">NOT NULL</span>,              <span style="color:#71717a">-- 'tool_call', 'decision', 'error'</span>
  agent_id    <span style="color:#34d399">TEXT</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'primary'</span>,    <span style="color:#71717a">-- which agent acted</span>
  input       <span style="color:#34d399">JSONB</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'{}'</span>,       <span style="color:#71717a">-- what was the prompt/trigger</span>
  output      <span style="color:#34d399">JSONB</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'{}'</span>,       <span style="color:#71717a">-- what was the result</span>
  duration_ms <span style="color:#34d399">INT</span>,                       <span style="color:#71717a">-- how long it took</span>
  created_at  <span style="color:#34d399">TIMESTAMPTZ</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#71717a">-- Index for time-range queries (most common access pattern)</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_stream_time <span style="color:#c084fc">ON</span> consciousness_stream(created_at <span style="color:#c084fc">DESC</span>);
<span style="color:#c084fc">CREATE INDEX</span> idx_stream_type <span style="color:#c084fc">ON</span> consciousness_stream(event_type);</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Debug: what did the agent do in the last hour?</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">SELECT</span> event_type,
       input->>(<span style="color:#fb923c">'action'</span>) <span style="color:#c084fc">AS</span> action,
       output->>(<span style="color:#fb923c">'status'</span>) <span style="color:#c084fc">AS</span> status,
       duration_ms
<span style="color:#c084fc">FROM</span> consciousness_stream
<span style="color:#c084fc">WHERE</span> created_at > <span style="color:#34d399">now</span>() - <span style="color:#c084fc">interval</span> <span style="color:#fb923c">'1 hour'</span>
<span style="color:#c084fc">ORDER BY</span> created_at <span style="color:#c084fc">DESC</span>;</code></pre>
</div>
</div>

<div class="card">
<h2>How the Three Tables Work Together</h2>
<p>Each table answers a different question. Together, they give your AI agent the full picture.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Table</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Question It Answers</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Write Pattern</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Read Pattern</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#34d399">brain_context</td>
<td style="padding:.75rem">"What do I know RIGHT NOW?"</td>
<td style="padding:.75rem">Upsert (INSERT ... ON CONFLICT UPDATE)</td>
<td style="padding:.75rem">SELECT by key or category</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#8b5cf6">agent_memory</td>
<td style="padding:.75rem">"What happened before that is relevant?"</td>
<td style="padding:.75rem">Append only (INSERT, never DELETE)</td>
<td style="padding:.75rem">Vector similarity search</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#fb923c">consciousness_stream</td>
<td style="padding:.75rem">"What exactly did I do and when?"</td>
<td style="padding:.75rem">Append only (INSERT, never DELETE)</td>
<td style="padding:.75rem">Time-range query + filter by event_type</td>
</tr>
</tbody>
</table>
</div>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">Boot:</span> Agent reads <strong style="color:#e5e5e5">brain_context</strong> for current state &rarr; knows what it was doing</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">Query:</span> User asks a question &rarr; agent searches <strong style="color:#e5e5e5">agent_memory</strong> for relevant past context</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">Act:</span> Agent takes an action &rarr; logs it to <strong style="color:#e5e5e5">consciousness_stream</strong></div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">Update:</span> Agent writes new state to <strong style="color:#e5e5e5">brain_context</strong> &rarr; ready for next session</div>
</div>
</div>

<div class="card">
<h2>Security: Row Level Security (RLS)</h2>
<p>Every table that stores sensitive data <strong style="color:#e5e5e5">must</strong> have RLS enabled. Without it, anyone with your Supabase anon key can read all data. With RLS, the database itself enforces access rules — even if your application code has a bug.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — RLS policies for brain tables</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable RLS on all three tables</span>
<span style="color:#c084fc">ALTER TABLE</span> brain_context <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;
<span style="color:#c084fc">ALTER TABLE</span> agent_memory <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;
<span style="color:#c084fc">ALTER TABLE</span> consciousness_stream <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;

<span style="color:#71717a">-- Service role (edge functions) can read/write everything</span>
<span style="color:#71717a">-- Anon key (browser) gets NOTHING — these are server-only tables</span>
<span style="color:#71717a">-- This is why edge functions use the service role key</span></code></pre>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">Critical:</strong> The service role key bypasses RLS entirely — it has full access to all data. This key must <strong style="color:#e5e5e5">never</strong> appear in frontend code. It belongs exclusively in server-side environments: Supabase Edge Functions, server API routes, and cron jobs. If you accidentally expose it, revoke and regenerate immediately.
</div>
</div>

<div class="card">
<h2>Scaling Considerations</h2>
<p>These patterns scale well, but knowing the limits helps you plan ahead.</p>

<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#34d399;font-size:.7rem">KV</div>
<div>
<strong style="color:#34d399;font-size:.88rem">brain_context</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Stays small (hundreds to low thousands of rows). The UNIQUE constraint on key means it grows slowly. Upserts keep it current. <strong style="color:#e5e5e5">No scaling concerns</strong> — this table is effectively always fast.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#8b5cf6;font-size:.7rem">MEM</div>
<div>
<strong style="color:#8b5cf6;font-size:.88rem">agent_memory</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Grows continuously (append-only). At 100K+ rows, add an IVFFlat index on the embedding column for fast vector search. At 1M+ rows, consider partitioning by date or archiving old memories to cold storage.</p>
</div>
</div>
<div style="display:flex;gap:1rem;align-items:flex-start;padding:1rem 1.25rem;background:rgba(251,146,60,.04);border-radius:10px;border:1px solid rgba(251,146,60,.08)">
<div style="min-width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(251,146,60,.12);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fb923c;font-size:.7rem">LOG</div>
<div>
<strong style="color:#fb923c;font-size:.88rem">consciousness_stream</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0;line-height:1.7">Grows the fastest (every agent action = a row). Partition by month for clean archival. The time-based index keeps recent queries fast. Consider a retention policy: keep 90 days hot, archive the rest.</p>
</div>
</div>
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Database Patterns — Mastery Check","questions":[{"q":"Why use a key-value pattern for brain_context instead of separate columns?","options":["It is faster to query","New keys can be added without database migrations — the schema never changes","It uses less storage","It is more secure"],"correct":1,"explanation":"The key-value pattern means your AI agent can learn new types of information without ALTER TABLE migrations. You just insert a new key — the schema stays the same. This is critical for evolving AI systems."},{"q":"What does vector(384) store in the agent_memory table?","options":["A list of 384 user IDs","A 384-character text string","384 floating-point numbers representing the semantic meaning of text","A compressed image"],"correct":2,"explanation":"Embeddings are lists of floating-point numbers that encode the semantic meaning of text. 384 dimensions matches the BGE-small model (free via HuggingFace). They enable similarity search — finding memories that are conceptually related even when the words differ."},{"q":"What is the primary purpose of the consciousness_stream table?","options":["Storing user preferences","Logging every agent action with its input, output, and timing for debugging and auditing","Caching API responses","Managing user sessions"],"correct":1,"explanation":"The consciousness_stream is an append-only event log. Every agent action is recorded with its input, output, and duration — enabling debugging, auditing, and behavioral replay."},{"q":"Why is RLS critical for brain tables?","options":["It makes queries faster","Without RLS, anyone with the anon key can read all brain data — RLS ensures only authorized access","RLS is required by Supabase","It compresses the data"],"correct":1,"explanation":"Without RLS, the anon key (which is public and visible in browser source code) grants full read access to all tables. RLS policies restrict access at the database level — even if your application code has a bug, the database enforces the rules."},{"q":"An upsert (INSERT ... ON CONFLICT DO UPDATE) does what?","options":["Creates a new row every time","Creates the row if the key does not exist, or updates it if it does — in a single atomic query","Deletes the old row and creates a new one","Updates the row only if it already exists"],"correct":1,"explanation":"Upsert combines INSERT and UPDATE into one atomic operation. If the key exists, it updates the row. If not, it creates a new one. This eliminates the need for a separate check-then-write pattern, preventing race conditions."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Database Patterns Flashcards","cards":[{"front":"What is the key-value brain pattern?","back":"Instead of creating a new column for every piece of information, you store everything as key-value pairs in brain_context. New keys can be added without database migrations — the schema stays the same."},{"front":"What does vector(384) store and why 384?","back":"A list of 384 floating-point numbers representing the semantic meaning of text. These embeddings let you find similar memories by meaning rather than exact keyword match. 384 dimensions matches the BGE-small model (free via HuggingFace). OpenAI models use 1536."},{"front":"Why use append-only memory instead of updating records?","back":"Deleting data destroys context. An AI agent that forgets past interactions cannot learn. By always appending to agent_memory, you build a complete searchable history with importance scores for prioritized retrieval."},{"front":"What is the consciousness_stream table for?","back":"An append-only event log recording every agent action with its input, output, and duration. Invaluable for debugging (why did the agent do that?), auditing (who changed this?), and replaying behavior to test improvements."},{"front":"What does dot notation in brain_context keys provide?","back":"Namespacing — keys like identity.name and session.active_work create a hierarchy similar to folders on a computer. This organizes the key-value store so related data is grouped logically without needing separate tables."},{"front":"What is the <=> operator in pgvector?","back":"The cosine distance operator. It measures how far apart two vectors are in meaning-space. Lower values = more similar. Used with ORDER BY to find the closest matching memories. The expression 1 - (embedding <=> query) converts distance to similarity score."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 7 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
