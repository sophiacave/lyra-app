---
title: "Database Patterns"
course: "ai-stack-builder"
order: 7
type: "lesson"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 7 of 10</span>

</div>

<div class="lesson-badge">MODULE 2 &middot; 260 XP</div>
<h1>Database Patterns</h1>
<p class="intro">Your AI needs a brain — a structured place to store memory, context, and agent state. Let's design that schema interactively and see the relationships in real-time.</p>

<h2>Design Your Brain Schema</h2>
<p>Click each table tab to edit its columns. Add new columns, set types, mark primary and foreign keys. The ER diagram below updates as you build.</p>
<p style="font-size:.85rem;color:#888"><strong>Why 3 tables instead of 1?</strong> Each table serves a different purpose: <code style="color:#f59e0b">brain_context</code> holds the agent's current state (like a whiteboard), <code style="color:#f59e0b">agent_memory</code> stores past interactions (like a journal), and <code style="color:#f59e0b">consciousness_stream</code> logs every action (like security footage). Separating them lets you query and optimize each independently.</p>
<p style="font-size:.85rem;color:#888">These tables are pre-populated as a starting point. Try modifying them — rename columns, change types, add new ones. The generated SQL updates live so you can see the impact of your changes.</p>

<div class="table-tabs" id="tableTabs">
<div class="table-tab active" onclick="switchTable(0)">brain_context</div>
<div class="table-tab" onclick="switchTable(1)">agent_memory</div>
<div class="table-tab" onclick="switchTable(2)">consciousness_stream</div>
</div>

<div class="table-editor" id="tableEditor"></div>

<h2>Entity Relationship Diagram</h2>
<p>This updates live as you modify the tables above.</p>
<div class="er-diagram" id="erCanvas">
</div>

<button class="gen-btn" onclick="generateSQL()">Generate SQL &rarr;</button>

<div class="panel" id="sqlPanel" style="display:none">
<div class="label">Generated SQL</div>
<pre class="code-block" id="sqlOutput"></pre>
</div>

<div class="panel">
<div class="label">Key Patterns</div>
<h3 style="margin-top:0">Pattern 1: Key-Value Brain</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> Instead of creating a new column for every piece of information, you store everything as key-value pairs. This means your AI agent can learn new things without database migrations. The <code style="color:#f59e0b">brain_context</code> table is a flexible key-value store. Keys use dot notation (like <code style="color:#f59e0b">identity.name</code>, <code style="color:#f59e0b">session.active_work</code>) for namespacing — the dots create a hierarchy, like folders on your computer. Values are JSONB (a Postgres data type that stores structured JSON data — it can hold strings, numbers, arrays, or nested objects, and you can query inside it).</p>
<h3>Pattern 2: Append-Only Memory</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> Deleting data destroys context. An AI agent that forgets past interactions can't learn or improve. By always appending, you build a complete history the agent can search through. The <code style="color:#f59e0b">agent_memory</code> table stores every interaction. Use <code style="color:#f59e0b">importance</code> scores (1-10) to prioritize retrieval — when the agent needs context, it grabs high-importance memories first. The <code style="color:#f59e0b">embedding</code> column uses <code style="color:#f59e0b">vector(1536)</code> — that's a list of 1,536 numbers that represent the meaning of text. AI models convert text into these vectors so you can find semantically similar memories (e.g., "find memories about deployment" would match "pushed code to Vercel" even though the words are different). The 1536 number matches OpenAI's embedding model dimensions.</p>
<h3>Pattern 3: Event Streaming</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> When something goes wrong (and it will), you need to know exactly what your agent did and when. The <code style="color:#f59e0b">consciousness_stream</code> is an event log — every action the agent takes gets logged with its input and output. This is invaluable for debugging ("why did the agent send that email?"), auditing ("who changed this data?"), and replaying agent behavior to test improvements.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress"></div></div>
</div>
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson & Earn 260 XP</button>
<div class="footer">Like One Academy &copy; 2026</div>
</div>

<script>
const tables=[
{name:'brain_context',cols:[
{name:'id',type:'uuid',pk:true,fk:''},
{name:'key',type:'text',pk:false,fk:''},
{name:'value',type:'jsonb',pk:false,fk:''},
{name:'metadata',type:'jsonb',pk:false,fk:''},
{name:'updated_at',type:'timestamptz',pk:false,fk:''}
]},
{name:'agent_memory',cols:[
{name:'id',type:'uuid',pk:true,fk:''},
{name:'context_key',type:'text',pk:false,fk:'brain_context.key'},
{name:'content',type:'text',pk:false,fk:''},
{name:'importance',type:'int4',pk:false,fk:''},
{name:'embedding',type:'vector(1536)',pk:false,fk:''},
{name:'created_at',type:'timestamptz',pk:false,fk:''}
]},
{name:'consciousness_stream',cols:[
{name:'id',type:'uuid',pk:true,fk:''},
{name:'agent_id',type:'text',pk:false,fk:''},
{name:'action',type:'text',pk:false,fk:''},
{name:'input',type:'jsonb',pk:false,fk:''},
{name:'output',type:'jsonb',pk:false,fk:''},
{name:'memory_id',type:'uuid',pk:false,fk:'agent_memory.id'},
{name:'created_at',type:'timestamptz',pk:false,fk:''}
]}
];

let activeTable=0;
function switchTable(idx){activeTable=idx;document.querySelectorAll('.table-tab').forEach((t,i)=>t.classList.toggle('active',i===idx));renderTable();updateProg()}

function renderTable(){
const t=tables[activeTable];
let html='<div class="schema-table"><div class="schema-table-header"><span class="schema-table-name">'+t.name+'</span></div>';
html+='<div class="col-header"><span>Name</span><span>Type</span><span>Flags</span><span>FK</span><span></span></div>';
t.cols.forEach((c,i)=>{
html+='<div class="col-row"><input value="'+c.name+'" onchange="updateCol('+i+',\'name\',this.value)">';
html+='<select onchange="updateCol('+i+',\'type\',this.value)">';
['uuid','text','int4','int8','bool','jsonb','timestamptz','vector(1536)','float8'].forEach(typ=>{
html+='<option'+(c.type===typ?' selected':'')+'>'+typ+'</option>'});
html+='</select><div class="flags"><span class="flag'+(c.pk?' on':'')+'" onclick="togglePK('+i+')">PK</span></div>';
html+='<span class="fk" onclick="editFK('+i+')">'+(c.fk||'—')+'</span>';
html+='<div class="del">'+(c.pk?'':'<button onclick="delCol('+i+')">&times;</button>')+'</div></div>'});
html+='<button class="add-col" onclick="addCol()">+ Add Column</button></div>';
document.getElementById('tableEditor').innerHTML=html;
renderER()}

function updateCol(i,field,val){tables[activeTable].cols[i][field]=val;renderTable();updateProg()}
function togglePK(i){tables[activeTable].cols[i].pk=!tables[activeTable].cols[i].pk;renderTable();updateProg()}
function delCol(i){tables[activeTable].cols.splice(i,1);renderTable();updateProg()}
function addCol(){tables[activeTable].cols.push({name:'new_col',type:'text',pk:false,fk:''});renderTable();updateProg()}
function editFK(i){const c=tables[activeTable].cols[i];const opts=[];tables.forEach(t=>{if(t.name!==tables[activeTable].name){t.cols.forEach(col=>{if(col.pk)opts.push(t.name+'.'+col.name)})}});let msg='Set foreign key reference.\nA foreign key links this column to a row in another table — it creates a relationship.\n\nAvailable targets:\n'+opts.map(o=>'  '+o).join('\n')+'\n\nEnter reference (e.g. brain_context.id) or leave blank to remove:';const val=prompt(msg,c.fk||'');if(val!==null){c.fk=val;renderTable();updateProg()}}

function renderER(){
let html='';
tables.forEach(t=>{
html+='<div class="er-table"><div class="er-table-name">'+t.name+'</div>';
t.cols.forEach(c=>{
let cls='er-col';if(c.pk)cls+=' pk';if(c.fk)cls+=' fk';
html+='<div class="'+cls+'"><span class="col-n">'+c.name+'</span><span class="col-t">'+c.type+'</span></div>'});
html+='</div>'});
document.getElementById('erCanvas').innerHTML=html}

function generateSQL(){
let sql='';
tables.forEach(t=>{
sql+='CREATE TABLE '+t.name+' (\n';
const lines=[];
t.cols.forEach(c=>{
let line='  '+c.name+' '+c.type;
if(c.pk)line+=' DEFAULT gen_random_uuid() PRIMARY KEY';
if(c.name.endsWith('_at'))line+=' DEFAULT now()';
if(c.fk){const parts=c.fk.split('.');if(parts.length===2)line+=' REFERENCES '+parts[0]+'('+parts[1]+')'}
lines.push(line)});
sql+=lines.join(',\n')+'\n);\n\n';
sql+='ALTER TABLE '+t.name+' ENABLE ROW LEVEL SECURITY;\n\n'});
document.getElementById('sqlOutput').textContent=sql;
document.getElementById('sqlPanel').style.display='block';updateProg()}

let actions=0;function updateProg(){actions++;const p=Math.min(100,actions*8);document.getElementById('lessonProgress').style.width=p+'%';document.getElementById('lessonPct').textContent=p+'%'}
function completeLesson(){localStorage.setItem('aisb_lesson_7','complete');const btn=document.getElementById('completeBtn');btn.textContent='\u2713 Lesson Complete — 260 XP Earned!';btn.classList.add('done');document.getElementById('lessonProgress').style.width='100%';document.getElementById('lessonPct').textContent='100%'}
if(localStorage.getItem('aisb_lesson_7')==='complete'){document.getElementById('completeBtn').textContent='\u2713 Complete';document.getElementById('completeBtn').classList.add('done')}
renderTable();
</script>
