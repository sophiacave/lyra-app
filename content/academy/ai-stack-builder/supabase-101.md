---
title: "Supabase 101"
course: "ai-stack-builder"
order: 2
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-stack-builder/">AI Stack Builder</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Supabase <span class="accent">101</span></h1>
  <p class="sub">Supabase gives you a Postgres database, auth, edge functions, and real-time subscriptions — all in one platform. It replaces five separate services and is the foundation of your entire AI stack.</p>
</div>

<div class="content">

<div class="card">
<h2>Why Supabase Is the Foundation</h2>
<p>Most backend setups require stitching together a database (RDS), authentication (Auth0), serverless functions (Lambda), real-time features (Pusher), and file storage (S3). Supabase bundles <strong style="color:#e5e5e5">all of these into one platform</strong> built on Postgres — the most battle-tested database in existence.</p>

<p>For AI applications specifically, Supabase adds <strong style="color:#e5e5e5">pgvector</strong> — a Postgres extension that stores AI embeddings (numerical representations of text meaning) and enables semantic search. This means your AI agent can find memories by meaning, not just keywords.</p>

<div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f5c4;&#xfe0f;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Postgres</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Full SQL database with JSONB, indexes, and 30+ years of reliability</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f512;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Auth + RLS</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">User management + row-level security — the database enforces who sees what</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12);flex:1;min-width:160px">
<div style="font-size:1.25rem">&#x1f9e0;</div>
<div><div style="font-size:.8rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">pgvector</div><div style="font-size:.78rem;color:#71717a;line-height:1.5">Store AI embeddings and search by meaning — the foundation of AI memory</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Two Keys, Two Levels of Access</h2>
<p>When you create a Supabase project, you get two API keys. Understanding the difference between them is <strong style="color:#e5e5e5">the most important security concept</strong> in this entire course.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
<div style="padding:1rem 1.25rem;background:rgba(52,211,153,.04);border-radius:10px;border:1px solid rgba(52,211,153,.08)">
<strong style="color:#34d399;font-size:.88rem">Anon Key (Public)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Safe for frontend.</strong> Can be seen in browser source code. Designed to be public. RLS policies control what it can access — without policies, it can access nothing.</p>
<div style="background:#0a0a0a;border-radius:6px;padding:.5rem;margin-top:.5rem;font-family:'JetBrains Mono',monospace;font-size:.75rem;color:#34d399">
eyJhbGciOi... <span style="color:#71717a">// public, safe</span>
</div>
</div>
<div style="padding:1rem 1.25rem;background:rgba(239,68,68,.04);border-radius:10px;border:1px solid rgba(239,68,68,.08)">
<strong style="color:#ef4444;font-size:.88rem">Service Role Key (Secret)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 0;line-height:1.7"><strong style="color:#e5e5e5">Server-side ONLY.</strong> Bypasses ALL RLS. Full access to every table, every row. If this key leaks, your entire database is compromised.</p>
<div style="background:#0a0a0a;border-radius:6px;padding:.5rem;margin-top:.5rem;font-family:'JetBrains Mono',monospace;font-size:.75rem;color:#ef4444">
eyJhbGciOi... <span style="color:#71717a">// SECRET, never in browser</span>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Step-by-Step: Create Your First Project</h2>
<p>Follow these steps to go from zero to a working Supabase project with a table, RLS, and your first data.</p>

<div style="display:grid;gap:.3rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:2">
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">1.</span> Go to <strong style="color:#e5e5e5">supabase.com</strong> and create a new project. Pick a region close to your users.</div>
<div style="padding:.5rem .75rem;background:rgba(139,92,246,.04);border-radius:6px"><span style="color:#8b5cf6;font-weight:700">2.</span> Save your <strong style="color:#e5e5e5">Project URL</strong>, <strong style="color:#e5e5e5">Anon Key</strong>, and <strong style="color:#e5e5e5">Service Role Key</strong> from Settings &rarr; API.</div>
<div style="padding:.5rem .75rem;background:rgba(251,146,60,.04);border-radius:6px"><span style="color:#fb923c;font-weight:700">3.</span> Open the <strong style="color:#e5e5e5">SQL Editor</strong> in the dashboard — this is where you run all database commands.</div>
<div style="padding:.5rem .75rem;background:rgba(244,114,182,.04);border-radius:6px"><span style="color:#f472b6;font-weight:700">4.</span> Create your first table (SQL below).</div>
<div style="padding:.5rem .75rem;background:rgba(56,189,248,.04);border-radius:6px"><span style="color:#38bdf8;font-weight:700">5.</span> Enable RLS and create an access policy.</div>
<div style="padding:.5rem .75rem;background:rgba(52,211,153,.04);border-radius:6px"><span style="color:#34d399;font-weight:700">6.</span> Insert your first record to verify everything works.</div>
</div>
</div>

<div class="card">
<h2>Create the brain_context Table</h2>
<p>This table stores your AI agent's memory as key-value pairs. It is the single most important table in any AI application — the agent's persistent brain.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Create brain_context with pgvector support</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable the vector extension for AI embeddings</span>
<span style="color:#c084fc">CREATE EXTENSION IF NOT EXISTS</span> vector;

<span style="color:#c084fc">CREATE TABLE</span> brain_context (
  id          <span style="color:#34d399">uuid</span> <span style="color:#c084fc">PRIMARY KEY DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>(),
  key         <span style="color:#34d399">text</span> <span style="color:#c084fc">UNIQUE NOT NULL</span>,     <span style="color:#71717a">-- dot notation: 'identity.name'</span>
  value       <span style="color:#34d399">jsonb</span>,                    <span style="color:#71717a">-- flexible structured data</span>
  category    <span style="color:#34d399">text</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">'general'</span>,  <span style="color:#71717a">-- session, directive, system</span>
  description <span style="color:#34d399">text</span>,                     <span style="color:#71717a">-- human-readable note</span>
  embedding   <span style="color:#34d399">vector</span>(<span style="color:#fb923c">384</span>),             <span style="color:#71717a">-- BGE-small AI embeddings</span>
  priority    <span style="color:#34d399">int</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#fb923c">5</span>,
  updated_at  <span style="color:#34d399">timestamptz</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#71717a">-- Fast lookups by key</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_key <span style="color:#c084fc">ON</span> brain_context(key);
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_category <span style="color:#c084fc">ON</span> brain_context(category);

<span style="color:#71717a">-- Semantic search index (cosine similarity)</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_embedding
  <span style="color:#c084fc">ON</span> brain_context
  <span style="color:#c084fc">USING</span> ivfflat (embedding vector_cosine_ops)
  <span style="color:#c084fc">WITH</span> (lists = <span style="color:#fb923c">100</span>);</code></pre>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Column breakdown:</strong> <code style="color:#f59e0b">key</code> uses dot notation (<code style="color:#f59e0b">identity.name</code>, <code style="color:#f59e0b">session.active_work</code>) for organization. <code style="color:#f59e0b">value</code> is JSONB — a binary JSON format that supports indexing and querying inside the structure. <code style="color:#f59e0b">embedding</code> stores 384 numbers representing the semantic meaning of the key's content (for AI search).
</div>
</div>

<div class="card">
<h2>Enable Row Level Security</h2>
<p>RLS is the bouncer for your database. Without it, anyone with your anon key can read all data. With it, the database itself enforces who can see what — even if your application code has bugs.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Enable RLS and create a service role policy</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable RLS — default-deny: nobody can access without a policy</span>
<span style="color:#c084fc">ALTER TABLE</span> brain_context <span style="color:#c084fc">ENABLE ROW LEVEL SECURITY</span>;

<span style="color:#71717a">-- Allow the service role (backend only) full access</span>
<span style="color:#c084fc">CREATE POLICY</span> <span style="color:#fb923c">"service_role_all"</span> <span style="color:#c084fc">ON</span> brain_context
  <span style="color:#c084fc">FOR ALL TO</span> service_role
  <span style="color:#c084fc">USING</span> (<span style="color:#fb923c">true</span>);

<span style="color:#71717a">-- The anon key (frontend) gets NOTHING by default</span>
<span style="color:#71717a">-- Add more policies later if users need direct access</span></code></pre>
</div>

<div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#ef4444">Critical:</strong> Enabling RLS with <strong style="color:#e5e5e5">no policies</strong> creates a default-deny state — nobody can access the table. This is the safe default. You explicitly create policies to grant access. Start locked down, open up only what is needed.
</div>
</div>

<div class="card">
<h2>Essential SQL Queries</h2>
<p>Run these in the Supabase SQL Editor. They cover the four operations you will use constantly: read, write, update, and filter.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Essential brain_context queries</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- READ: Fetch all rows (most recent first)</span>
<span style="color:#c084fc">SELECT</span> key, value, updated_at
<span style="color:#c084fc">FROM</span> brain_context
<span style="color:#c084fc">ORDER BY</span> updated_at <span style="color:#c084fc">DESC</span>;

<span style="color:#71717a">-- WRITE: Insert a new key-value pair</span>
<span style="color:#c084fc">INSERT INTO</span> brain_context (key, value, category)
<span style="color:#c084fc">VALUES</span> (<span style="color:#fb923c">'identity.name'</span>, <span style="color:#fb923c">'"AI Stack Builder Student"'</span>, <span style="color:#fb923c">'identity'</span>);

<span style="color:#71717a">-- UPSERT: Write or update (no need to check if key exists)</span>
<span style="color:#c084fc">INSERT INTO</span> brain_context (key, value, category)
<span style="color:#c084fc">VALUES</span> (<span style="color:#fb923c">'session.active_work'</span>, <span style="color:#fb923c">'{"task":"building"}'</span>, <span style="color:#fb923c">'session'</span>)
<span style="color:#c084fc">ON CONFLICT</span> (key) <span style="color:#c084fc">DO UPDATE SET</span>
  value = <span style="color:#34d399">EXCLUDED</span>.value,
  updated_at = <span style="color:#34d399">now</span>();

<span style="color:#71717a">-- FILTER: Find all session keys</span>
<span style="color:#c084fc">SELECT</span> key, value <span style="color:#c084fc">FROM</span> brain_context
<span style="color:#c084fc">WHERE</span> key <span style="color:#c084fc">LIKE</span> <span style="color:#fb923c">'session.%'</span>;</code></pre>
</div>
</div>

<div class="card">
<h2>Supabase Client: JavaScript SDK</h2>
<p>In production, you interact with Supabase through the JavaScript SDK — not raw SQL. The SDK provides type-safe methods for every operation.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">JavaScript — Supabase client setup + queries</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">'@supabase/supabase-js'</span>

<span style="color:#71717a">// Initialize (these are safe for the frontend)</span>
<span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

<span style="color:#71717a">// READ — Fetch the 10 most recently updated brain keys</span>
<span style="color:#c084fc">const</span> { data, error } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
  .<span style="color:#34d399">select</span>(<span style="color:#fb923c">'key, value, updated_at'</span>)
  .<span style="color:#34d399">order</span>(<span style="color:#fb923c">'updated_at'</span>, { ascending: <span style="color:#fb923c">false</span> })
  .<span style="color:#34d399">limit</span>(<span style="color:#fb923c">10</span>)

<span style="color:#71717a">// UPSERT — Write or update a key-value pair</span>
<span style="color:#c084fc">const</span> { error: writeErr } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
  .<span style="color:#34d399">upsert</span>({
    key: <span style="color:#fb923c">'session.active_work'</span>,
    value: { task: <span style="color:#fb923c">'Building the AI stack'</span>, status: <span style="color:#fb923c">'in_progress'</span> }
  }, { onConflict: <span style="color:#fb923c">'key'</span> })

<span style="color:#71717a">// FILTER — Find all keys matching a pattern</span>
<span style="color:#c084fc">const</span> { data: sessions } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
  .<span style="color:#34d399">select</span>(<span style="color:#fb923c">'*'</span>)
  .<span style="color:#34d399">like</span>(<span style="color:#fb923c">'key'</span>, <span style="color:#fb923c">'session.%'</span>)</code></pre>
</div>
</div>

<div class="card">
<h2>The Five Superpowers of Supabase</h2>
<p>Each of these replaces a separate service you would otherwise need to set up, configure, and maintain independently.</p>

<div style="overflow-x:auto;margin-top:1rem">
<table style="width:100%;border-collapse:collapse;font-size:.82rem">
<thead>
<tr style="border-bottom:1px solid rgba(255,255,255,.1)">
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Feature</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">What It Does</th>
<th style="text-align:left;padding:.75rem;color:#e5e5e5;font-weight:600">Replaces</th>
</tr>
</thead>
<tbody style="color:#a1a1aa">
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Postgres Database</td>
<td style="padding:.75rem">Full SQL database with JSONB, views, triggers, and 30+ years of reliability</td>
<td style="padding:.75rem">AWS RDS, PlanetScale, MongoDB</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Auth + RLS</td>
<td style="padding:.75rem">User signup/login, JWT tokens, row-level access control</td>
<td style="padding:.75rem">Auth0, Firebase Auth, Clerk</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Edge Functions</td>
<td style="padding:.75rem">Serverless TypeScript functions deployed globally (Deno runtime)</td>
<td style="padding:.75rem">AWS Lambda, Cloudflare Workers</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,.05)">
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">Realtime</td>
<td style="padding:.75rem">Live subscriptions — your UI updates instantly when data changes</td>
<td style="padding:.75rem">Pusher, Socket.io, Firebase Realtime</td>
</tr>
<tr>
<td style="padding:.75rem;font-weight:600;color:#e5e5e5">pgvector</td>
<td style="padding:.75rem">Store AI embeddings, search by semantic meaning</td>
<td style="padding:.75rem">Pinecone, Weaviate, Chroma</td>
</tr>
</tbody>
</table>
</div>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1rem;margin-top:.75rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Cost:</strong> Supabase Pro is <strong style="color:#34d399">$25/month</strong> and includes all five features. The free tier gives you 2 projects with generous limits for learning and prototyping.
</div>
</div>

<div style="margin:1.5rem 0">
<div data-learn="QuizMC" data-props='{"title":"Supabase 101 — Mastery Check","questions":[{"q":"What is the difference between the anon key and the service role key?","options":["They are the same key with different names","The anon key is public and safe for frontend use; the service role key is secret and bypasses ALL RLS","The anon key is for Edge Functions only","The service role key is used for read operations only"],"correct":1,"explanation":"The anon key is designed to be public — it can be safely included in frontend JavaScript. RLS policies control what it can access. The service role key bypasses ALL RLS and should only ever exist in server-side code (edge functions, never in the browser)."},{"q":"What does enabling RLS on a table do without adding any policies?","options":["Allows everyone to read but not write","Blocks all access to the table — default-deny","Allows service role access only","Has no effect until policies are added"],"correct":1,"explanation":"Enabling RLS with no policies creates a default-deny state — nobody can access the table. You must explicitly create policies to grant access. This is the safe default: deny all, then open up only what is needed."},{"q":"What is JSONB in Postgres and why use it for an AI brain table?","options":["A faster version of JSON that supports indexing and querying inside the JSON structure","A text format for storing binary data","A UUID generator","A real-time subscription type"],"correct":0,"explanation":"JSONB is a binary JSON storage format in Postgres. Unlike plain text JSON, JSONB allows you to index and query inside the structure (e.g., WHERE value->>name = Alex). For an AI brain table, this lets you store flexible, schema-less data while still querying it efficiently."},{"q":"What does an upsert (INSERT ... ON CONFLICT DO UPDATE) do?","options":["Inserts a row only if the key does not exist","Updates a row only if the key exists","Creates the row if new, or updates it if the key already exists — in one atomic query","Deletes the old row and creates a new one"],"correct":2,"explanation":"Upsert combines INSERT and UPDATE into one atomic operation. If the key exists, it updates the row. If not, it creates a new one. No need to check first — the database handles it. This is the standard write pattern for key-value brain tables."},{"q":"What does pgvector enable that regular Postgres cannot do?","options":["Faster SQL queries","Storing AI embeddings and searching by semantic similarity — finding related content by meaning, not keywords","Better authentication","Real-time subscriptions"],"correct":1,"explanation":"pgvector adds a vector data type and similarity search operators to Postgres. You store AI embeddings (numerical representations of text meaning) and search by cosine similarity — finding semantically related content even when the exact words differ."}]}'></div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Supabase 101 Flashcards","cards":[{"front":"What SQL command enables Row Level Security on a table?","back":"ALTER TABLE table_name ENABLE ROW LEVEL SECURITY; — This must be followed by CREATE POLICY statements, otherwise the table is locked to all users (default-deny)."},{"front":"What is pgvector and what does it enable?","back":"pgvector is a Postgres extension that adds a vector data type and similarity search operators. It enables storing AI embeddings and finding semantically similar rows — the foundation of AI memory and RAG (Retrieval-Augmented Generation)."},{"front":"How do you connect to Supabase from a JavaScript frontend?","back":"import { createClient } from @supabase/supabase-js; const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); — then use supabase.from(table).select() for queries."},{"front":"What is the difference between the anon key and service role key?","back":"Anon key: public, safe for frontend, access controlled by RLS policies. Service role key: secret, bypasses ALL RLS, server-side only. If the service role key leaks, your entire database is exposed."},{"front":"What is JSONB and why use it?","back":"JSONB is binary JSON storage in Postgres. Unlike text JSON, it supports indexing and querying inside the structure. Perfect for AI brain tables where values have varying shapes — no schema changes needed for new data types."},{"front":"What does an upsert do?","back":"INSERT ... ON CONFLICT (key) DO UPDATE SET ... — creates a new row if the key does not exist, or updates the existing row if it does. One atomic query, no race conditions, no need to check first."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 2 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
