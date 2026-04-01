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
<div class="label">Interactive Table Builder</div>
<h3 style="margin-top:0">brain_context</h3>
<p style="font-size:.9rem">This table stores your AI agent's memory — key-value pairs with metadata.</p>
<div class="table-builder">
<div class="table-header"><span>Column Name</span><span>Type</span><span>Key</span><span></span></div>
<div id="tableRows">
<div class="table-row">
<input value="id" readonly style="color:#f59e0b">
<select disabled><option>uuid</option></select>
<span class="pk">PK</span>
<span class="del-col"></span>
</div>
<div class="table-row">
<input value="key" placeholder="column name">
<select><option>text</option><option>uuid</option><option>int8</option><option>bool</option><option>jsonb</option><option>timestamptz</option></select>
<span class="pk"></span>
<span class="del-col"><button class="del-btn" onclick="delRow(this)">&times;</button></span>
</div>
<div class="table-row">
<input value="value" placeholder="column name">
<select><option value="jsonb">jsonb (flexible JSON data)</option><option>text</option><option>uuid</option><option>int8</option><option>bool</option><option>timestamptz</option></select>
<span class="pk"></span>
<span class="del-col"><button class="del-btn" onclick="delRow(this)">&times;</button></span>
</div>
<div class="table-row">
<input value="updated_at" placeholder="column name">
<select><option>timestamptz</option><option>text</option><option>uuid</option><option>int8</option><option>bool</option><option>jsonb</option></select>
<span class="pk"></span>
<span class="del-col"><button class="del-btn" onclick="delRow(this)">&times;</button></span>
</div>
</div>
<button class="add-col-btn" onclick="addColumn()">+ Add Column</button>
</div>
<button class="run-btn" onclick="generateSQL()" style="border-radius:8px;margin-top:.75rem;border:1px solid #1e1e2e">Generate SQL &rarr;</button>
</div>

<div class="sql-output panel" id="sqlPanel" style="display:none">
<div class="label">Generated SQL</div>
<button class="copy-btn" onclick="copySQL()">Copy</button>
<div class="success-msg" id="copyMsg">Copied!</div>
</div>

<h2>Step 2: SQL Sandbox</h2>
<p>Supabase lets you run raw SQL. Practice querying your brain_context table.</p>
<p style="font-size:.85rem;color:#888;font-style:italic">This is a simulation — it runs against sample data in your browser, not a real database. In production, you'd run these same queries in the Supabase SQL Editor against your actual tables.</p>

<div class="panel">
<div class="label">SQL Sandbox</div>
<div class="sandbox">
<textarea id="sqlInput" placeholder="-- Try a query. Examples:
-- SELECT * FROM brain_context;
-- INSERT INTO brain_context (key, value) VALUES ('mood', '&quot;curious&quot;');
-- SELECT key, value FROM brain_context WHERE key LIKE 'session%';
">SELECT * FROM brain_context;</textarea>
<button class="run-btn" onclick="runQuery()">&#x25b6; Run Query</button>
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

<div class="panel">
<div class="label">Key Concept</div>
<h3 style="margin-top:0">Why Supabase for AI Apps?</h3>
<p style="font-size:.9rem">Supabase is Postgres with superpowers: <strong>Auth</strong> (user management), <strong>Edge Functions</strong> (serverless code that runs close to your users), <strong>Realtime</strong> (live subscriptions — your UI updates instantly when data changes), <strong>Storage</strong> (files/images), and <strong>pgvector</strong> (a Postgres extension that lets you store AI embeddings — numerical representations of text — so you can do similarity search, like "find memories related to this topic"). One tool covers database + backend + auth. That's why it's the foundation of most modern AI stacks.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"></div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>


<div data-learn="QuizMC" data-props='{"title":"Supabase 101 Quiz","questions":[{"q":"What is the difference between the anon key and the service role key?","options":["They are the same key with different names","The anon key is public and safe for frontend use; the service role key is secret and bypasses RLS","The anon key is for Edge Functions only","The service role key is used for read operations only"],"correct":1,"explanation":"The anon key is designed to be public — it can be safely included in frontend JavaScript. Row Level Security policies control what it can access. The service role key bypasses ALL RLS and should only ever exist in server-side code (edge functions, never in the browser)."},{"q":"What does enabling RLS on a table do without adding any policies?","options":["Allows everyone to read but not write","Blocks all access to the table by default","Allows service role access only","Has no effect until policies are added"],"correct":1,"explanation":"Enabling RLS with no policies creates a default-deny state — nobody can access the table. You must explicitly create policies to grant access. This is the safe default: deny all, then open up only what is needed."},{"q":"What is JSONB in Postgres and why use it for an AI brain table?","options":["A faster version of JSON that supports indexing and querying inside the JSON structure","A text format for storing binary data","A UUID generator","A real-time subscription type"],"correct":0,"explanation":"JSONB is a binary JSON storage format in Postgres. Unlike plain text JSON, JSONB allows you to index and query inside the JSON structure (e.g., WHERE value->>\u0027name\u0027 = \u0027Alex\u0027). For an AI brain table, this lets you store flexible, schema-less data while still being able to query it efficiently."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Supabase Flashcards","cards":[{"front":"What SQL command enables Row Level Security on a table?","back":"ALTER TABLE table_name ENABLE ROW LEVEL SECURITY; — This must be followed by CREATE POLICY statements, otherwise the table is locked to all users."},{"front":"What is pgvector and what does it enable?","back":"pgvector is a Postgres extension that adds a vector data type and similarity search operators. It enables storing AI embeddings and finding semantically similar rows — the foundation of AI memory and RAG (Retrieval-Augmented Generation)."},{"front":"How do you connect to Supabase from a JavaScript frontend?","back":"import { createClient } from \u0027@supabase/supabase-js\u0027; const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); — then use supabase.from(\u0027table\u0027).select() or supabase.auth.signIn() etc."}]}'></div>

<div data-learn="SortStack" data-props='{"title":"Supabase Project Setup Order","instruction":"Arrange these steps in the correct order to set up a new Supabase project","items":["Create project at supabase.com and save URL + keys","Create tables using the SQL Editor","Enable RLS on all tables","Create access policies for each role","Insert seed data and test queries"]}'></div>

</div>
