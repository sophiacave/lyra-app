---
title: "Supabase 101"
course: "ai-stack-builder"
order: 2
type: "lesson"
free: true
---<div class="container">
<div class="nav">
<a href="stack-anatomy.html">&larr; Prev</a>
<span class="current">Lesson 2 of 10</span>
<a href="make-com-101.html">Next &rarr;</a>
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
<div class="code-block" id="sqlOutput"></div>
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
-- INSERT INTO brain_context (key, value) VALUES ('mood', '\"curious\"');
-- SELECT key, value FROM brain_context WHERE key LIKE 'session%';
">SELECT * FROM brain_context;</textarea>
<button class="run-btn" onclick="runQuery()">&#x25b6; Run Query</button>
</div>
<div id="queryResults"></div>
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
<div class="progress-bar"><div class="progress-fill" id="lessonProgress" style="width:0%"></div></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="nav" style="border-top:1px solid #1e1e2e;border-bottom:none;margin-top:0;padding-top:1rem">
<a href="stack-anatomy.html">&larr; Stack Anatomy</a>
<a href="make-com-101.html">Next: Make.com 101 &rarr;</a>
</div>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
const sampleData=[
{id:'a1b2c3d4',key:'identity.name',value:'"Stack Builder Student"',updated_at:'2026-03-23T10:00:00Z'},
{id:'e5f6g7h8',key:'session.active_work',value:'"building brain_context"',updated_at:'2026-03-23T10:05:00Z'},
{id:'i9j0k1l2',key:'session.mood',value:'"focused"',updated_at:'2026-03-23T10:10:00Z'},
{id:'m3n4o5p6',key:'system.version',value:'"1.0.0"',updated_at:'2026-03-23T09:00:00Z'},
{id:'q7r8s9t0',key:'directive.boot_sequence',value:'{"version":"4.0","steps":["read brain","resume work"]}',updated_at:'2026-03-23T08:00:00Z'}
];
function addColumn(){const rows=document.getElementById('tableRows');const row=document.createElement('div');row.className='table-row';row.innerHTML='<input placeholder="column name"><select><option>text</option><option>uuid</option><option>int8</option><option>bool</option><option>jsonb</option><option>timestamptz</option></select><span class="pk"></span><span class="del-col"><button class="del-btn" onclick="delRow(this)">&times;</button></span>';rows.appendChild(row);updateProg()}
function delRow(btn){btn.closest('.table-row').remove();updateProg()}
function generateSQL(){const rows=document.querySelectorAll('#tableRows .table-row');let sql='<span class="kw">CREATE TABLE</span> brain_context (\n';const cols=[];rows.forEach(r=>{const name=r.querySelector('input').value||'unnamed';const type=r.querySelector('select').value;const pk=r.querySelector('.pk')?.textContent==='PK';let line='  '+name+' <span class="fn">'+type+'</span>';if(pk)line+=' <span class="kw">DEFAULT</span> <span class="fn">gen_random_uuid</span>() <span class="kw">PRIMARY KEY</span>';if(name==='updated_at')line+=' <span class="kw">DEFAULT</span> <span class="fn">now</span>()';cols.push(line)});sql+=cols.join(',\n')+'\n);';document.getElementById('sqlOutput').innerHTML=sql;document.getElementById('sqlPanel').style.display='block';updateProg()}
function copySQL(){const text=document.getElementById('sqlOutput').textContent;navigator.clipboard.writeText(text);document.getElementById('copyMsg').style.display='block';setTimeout(()=>document.getElementById('copyMsg').style.display='none',1500)}
function runQuery(){const q=document.getElementById('sqlInput').value.trim().toLowerCase();const out=document.getElementById('queryResults');let data=sampleData;if(q.includes('insert')){out.innerHTML='<p style="color:#22c55e;margin-top:.75rem;font-size:.9rem">&#x2713; 1 row inserted successfully.</p>';updateProg();return}
if(q.includes('where')){const match=q.match(/like\s+'([^']+)'/i)||q.match(/=\s*'([^']+)'/i);if(match){const filter=match[1].replace(/%/g,'');data=sampleData.filter(r=>r.key.includes(filter))}}
if(q.includes('select')){let cols=Object.keys(sampleData[0]);const colMatch=q.match(/select\s+(.+?)\s+from/i);if(colMatch&&!colMatch[1].includes('*')){cols=colMatch[1].split(',').map(c=>c.trim())}
let html='<table class="results-table"><tr>';cols.forEach(c=>html+='<th>'+c+'</th>');html+='</tr>';data.forEach(r=>{html+='<tr>';cols.forEach(c=>html+='<td>'+(r[c]||'null')+'</td>');html+='</tr>'});html+='</table><p style="color:#888;font-size:.8rem;margin-top:.5rem">'+data.length+' rows returned</p>';out.innerHTML=html}else{out.innerHTML='<p style="color:#22c55e;margin-top:.75rem;font-size:.9rem">&#x2713; Query executed successfully.</p>'}
updateProg()}
let actions=0;function updateProg(){actions++;const pct=Math.min(100,actions*15);document.getElementById('lessonProgress').style.width=pct+'%';document.getElementById('lessonPct').textContent=pct+'%'}
function completeLesson(){localStorage.setItem('aisb_lesson_2','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_2')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
</script>
