---
title: "Supabase 101"
course: "ai-stack-builder"
order: 2
type: "lesson"
free: true
---<div class="container">
<div class="nav">

<span class="current">Lesson 2 of 10</span>

</div>

<div class="lesson-badge">MODULE 1 &middot; 260 XP</div>
<h1>Supabase 101</h1>
<p class="intro">Supabase gives you a Postgres database, auth, edge functions, and real-time subscriptions — all in one platform. It's the foundation of your stack.</p>

<h2>Step 1: Understanding Tables</h2>
<p>Every Supabase project is a Postgres database. Data lives in tables. Let's build one interactively.</p>

<div class="panel">
<div class="label">brain_context Table Structure</div>
<p style="font-size:.9rem">This table stores your AI agent's memory — key-value pairs with metadata. Here are the columns:</p>
<div class="code-block">
<span class="kw">id</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">uuid</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">-- Primary Key</span><br>
<span class="kw">key</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">text</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">-- Unique identifier (e.g. "identity.name")</span><br>
<span class="kw">value</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">jsonb</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">-- Flexible JSON data</span><br>
<span class="kw">updated_at</span>&nbsp;<span class="fn">timestamptz</span>&nbsp;&nbsp;<span class="cm">-- Last modified timestamp</span>
</div>
</div>

<h2>Step 2: Essential SQL Queries</h2>
<p>Supabase lets you run raw SQL. Here are the essential queries for working with your brain_context table. Run these in the Supabase SQL Editor in your dashboard.</p>

<div class="panel">
<div class="label">Common Queries</div>
<div class="code-block">
<span class="cm">-- Fetch all rows</span><br>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> brain_context;<br><br>
<span class="cm">-- Insert a new key-value pair</span><br>
<span class="kw">INSERT INTO</span> brain_context (key, value) <span class="kw">VALUES</span> (<span class="str">'mood'</span>, <span class="str">'"curious"'</span>);<br><br>
<span class="cm">-- Filter by key pattern</span><br>
<span class="kw">SELECT</span> key, value <span class="kw">FROM</span> brain_context <span class="kw">WHERE</span> key <span class="kw">LIKE</span> <span class="str">'session%'</span>;
</div>
</div>

<h2>Step 3: Build It Step by Step</h2>
<div class="step">
<div class="step-num">1</div>
<div class="step-content">
<p><strong>Create the project</strong></p>
<p style="font-size:.9rem;color:#999">Go to supabase.com, create a new project. Pick a region close to your users. Save your project URL and anon key.</p>
<div class="code-block"><span class="kw">Project URL</span>: https://&lt;your-ref&gt;.supabase.co<br><span class="kw">Anon Key</span>: eyJhbGciOiJIUzI1NiIs... <span class="cm">// public, safe for frontend</span><br><span class="kw">Service Key</span>: eyJhbGciOiJIUzI1NiIs... <span class="cm">// SECRET, only for backend</span></div>
</div>
</div>
<div class="step">
<div class="step-num">2</div>
<div class="step-content">
<p><strong>Create the brain_context table</strong></p>
<p style="font-size:.9rem;color:#999">Use the SQL editor in your Supabase dashboard. Paste the generated SQL from Step 1 above.</p>
</div>
</div>
<div class="step">
<div class="step-num">3</div>
<div class="step-content">
<p><strong>Enable Row Level Security (RLS)</strong></p>
<p style="font-size:.9rem;color:#999">RLS (Row Level Security) is a Postgres feature that controls who can read or write each row. Without it, anyone with your API key could access all data. Think of it like a bouncer for every row in your table.</p>
<p style="font-size:.9rem;color:#999">This SQL turns on RLS and then creates a policy that says "only the service role (your backend) gets full access." Frontend users with the public anon key will be blocked unless you add more policies.</p>
<div class="code-block"><span class="kw">ALTER TABLE</span> brain_context <span class="kw">ENABLE ROW LEVEL SECURITY</span>;<br><br><span class="cm">-- Allow service role full access</span><br><span class="kw">CREATE POLICY</span> <span class="str">"service_role_all"</span> <span class="kw">ON</span> brain_context<br>  <span class="kw">FOR ALL</span><br>  <span class="kw">TO</span> service_role<br>  <span class="kw">USING</span> (<span class="kw">true</span>);</div>
</div>
</div>
<div class="step">
<div class="step-num">4</div>
<div class="step-content">
<p><strong>Insert your first record</strong></p>
<p style="font-size:.9rem;color:#999">This SQL adds a single row to your brain_context table — a key called "identity.name" with the value "AI Stack Builder Student". It's like writing a sticky note your AI agent can read later.</p>
<div class="code-block"><span class="kw">INSERT INTO</span> brain_context (key, value)<br><span class="kw">VALUES</span> (<span class="str">'identity.name'</span>, <span class="str">'"AI Stack Builder Student"'</span>);</div>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">JavaScript — Supabase client setup + basic queries</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { createClient } <span style="color:#c084fc">from</span> <span style="color:#fb923c">'@supabase/supabase-js'</span>

<span style="color:#71717a">// Initialize the client (these are safe for the frontend)</span>
<span style="color:#c084fc">const</span> supabase = <span style="color:#34d399">createClient</span>(
  <span style="color:#fb923c">'https://your-ref.supabase.co'</span>,  <span style="color:#71717a">// Project URL</span>
  <span style="color:#fb923c">'eyJhbGciOiJIUzI1NiIs...'</span>      <span style="color:#71717a">// Anon key (public)</span>
)

<span style="color:#71717a">// READ — Fetch all brain_context rows</span>
<span style="color:#c084fc">const</span> { data, error } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
  .<span style="color:#34d399">select</span>(<span style="color:#fb923c">'key, value, updated_at'</span>)
  .<span style="color:#34d399">order</span>(<span style="color:#fb923c">'updated_at'</span>, { ascending: <span style="color:#c084fc">false</span> })
  .<span style="color:#34d399">limit</span>(<span style="color:#fb923c">10</span>)

<span style="color:#71717a">// WRITE — Upsert a key-value pair</span>
<span style="color:#c084fc">const</span> { error: writeErr } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
  .<span style="color:#34d399">upsert</span>({
    key:   <span style="color:#fb923c">'session.active_work'</span>,
    value: { task: <span style="color:#fb923c">'Building the AI stack'</span>, status: <span style="color:#fb923c">'in_progress'</span> }
  }, { onConflict: <span style="color:#fb923c">'key'</span> })

<span style="color:#71717a">// FILTER — Find keys matching a pattern</span>
<span style="color:#c084fc">const</span> { data: sessions } = <span style="color:#c084fc">await</span> supabase
  .<span style="color:#34d399">from</span>(<span style="color:#fb923c">'brain_context'</span>)
  .<span style="color:#34d399">select</span>(<span style="color:#fb923c">'*'</span>)
  .<span style="color:#34d399">like</span>(<span style="color:#fb923c">'key'</span>, <span style="color:#fb923c">'session.%'</span>)
</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">SQL — Create a brain_context table with pgvector</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">-- Enable the vector extension for AI embeddings</span>
<span style="color:#c084fc">CREATE EXTENSION IF NOT EXISTS</span> vector;

<span style="color:#c084fc">CREATE TABLE</span> brain_context (
  id          <span style="color:#34d399">uuid</span> <span style="color:#c084fc">PRIMARY KEY DEFAULT</span> <span style="color:#34d399">gen_random_uuid</span>(),
  key         <span style="color:#34d399">text</span> <span style="color:#c084fc">UNIQUE NOT NULL</span>,
  value       <span style="color:#34d399">jsonb</span>,
  embedding   <span style="color:#34d399">vector</span>(<span style="color:#fb923c">384</span>),        <span style="color:#71717a">-- BGE-small dimensions</span>
  updated_at  <span style="color:#34d399">timestamptz</span> <span style="color:#c084fc">DEFAULT</span> <span style="color:#34d399">now</span>()
);

<span style="color:#71717a">-- Fast lookups by key</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_key <span style="color:#c084fc">ON</span> brain_context(key);

<span style="color:#71717a">-- Semantic search index (cosine similarity)</span>
<span style="color:#c084fc">CREATE INDEX</span> idx_brain_embedding
  <span style="color:#c084fc">ON</span> brain_context
  <span style="color:#c084fc">USING</span> ivfflat (embedding vector_cosine_ops)
  <span style="color:#c084fc">WITH</span> (lists = <span style="color:#fb923c">100</span>);
</code></pre>
</div>

<div class="panel">
<div class="label">Key Concept</div>
<h3 style="margin-top:0">Why Supabase for AI Apps?</h3>
<p style="font-size:.9rem">Supabase is Postgres with superpowers: <strong>Auth</strong> (user management), <strong>Edge Functions</strong> (serverless code that runs close to your users), <strong>Realtime</strong> (live subscriptions — your UI updates instantly when data changes), <strong>Storage</strong> (files/images), and <strong>pgvector</strong> (a Postgres extension that lets you store AI embeddings — numerical representations of text — so you can do similarity search, like "find memories related to this topic"). One tool covers database + backend + auth. That's why it's the foundation of most modern AI stacks.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span>
</div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>


<div data-learn="QuizMC" data-props='{"title":"Supabase 101 Quiz","questions":[{"q":"What is the difference between the anon key and the service role key?","options":["They are the same key with different names","The anon key is public and safe for frontend use; the service role key is secret and bypasses RLS","The anon key is for Edge Functions only","The service role key is used for read operations only"],"correct":1,"explanation":"The anon key is designed to be public — it can be safely included in frontend JavaScript. Row Level Security policies control what it can access. The service role key bypasses ALL RLS and should only ever exist in server-side code (edge functions, never in the browser)."},{"q":"What does enabling RLS on a table do without adding any policies?","options":["Allows everyone to read but not write","Blocks all access to the table by default","Allows service role access only","Has no effect until policies are added"],"correct":1,"explanation":"Enabling RLS with no policies creates a default-deny state — nobody can access the table. You must explicitly create policies to grant access. This is the safe default: deny all, then open up only what is needed."},{"q":"What is JSONB in Postgres and why use it for an AI brain table?","options":["A faster version of JSON that supports indexing and querying inside the JSON structure","A text format for storing binary data","A UUID generator","A real-time subscription type"],"correct":0,"explanation":"JSONB is a binary JSON storage format in Postgres. Unlike plain text JSON, JSONB allows you to index and query inside the JSON structure (e.g., WHERE value->>\u0027name\u0027 = \u0027Alex\u0027). For an AI brain table, this lets you store flexible, schema-less data while still being able to query it efficiently."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Supabase Flashcards","cards":[{"front":"What SQL command enables Row Level Security on a table?","back":"ALTER TABLE table_name ENABLE ROW LEVEL SECURITY; — This must be followed by CREATE POLICY statements, otherwise the table is locked to all users."},{"front":"What is pgvector and what does it enable?","back":"pgvector is a Postgres extension that adds a vector data type and similarity search operators. It enables storing AI embeddings and finding semantically similar rows — the foundation of AI memory and RAG (Retrieval-Augmented Generation)."},{"front":"How do you connect to Supabase from a JavaScript frontend?","back":"import { createClient } from \u0027@supabase/supabase-js\u0027; const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); — then use supabase.from(\u0027table\u0027).select() or supabase.auth.signIn() etc."}]}'></div>
</div>
