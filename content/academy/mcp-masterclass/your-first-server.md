---
title: "Your First Server"
course: "mcp-masterclass"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 4</div>
  <h1>Your First Server</h1>
  <p class="subtitle">Build an MCP server step-by-step. Choose what it connects to, define its tools, and see the TypeScript code structure generated. This lesson generates starter code you can copy into a real project.</p>

  <div class="steps-indicator">
    <div class="step-tab active" onclick="goStep(0)" id="stab0">1. Choose Connection</div>
    <div class="step-tab" onclick="goStep(1)" id="stab1">2. Define Tools</div>
    <div class="step-tab" onclick="goStep(2)" id="stab2">3. View Code</div>
  </div>

  <!-- Step 1: Choose Connection -->
  <div class="step-content active" id="step0">
    <div class="section">
      <h2>What does your server connect to?</h2>
      <p>Every MCP server wraps a specific capability. Choose what yours will connect to:</p>

      <div class="choice-grid">
        <div class="choice-card" onclick="selectType('filesystem')" id="type-filesystem">
          <div class="icon">&#x1F4C1;</div>
          <h3>Filesystem</h3>
          <p>Read, write, and search local files and directories</p>
        </div>
        <div class="choice-card" onclick="selectType('database')" id="type-database">
          <div class="icon">&#x1F4BE;</div>
          <h3>Database</h3>
          <p>Query and modify data in SQL or NoSQL databases</p>
        </div>
        <div class="choice-card" onclick="selectType('api')" id="type-api">
          <div class="icon">&#x1F310;</div>
          <h3>External API</h3>
          <p>Wrap any REST or GraphQL endpoint as MCP tools</p>
        </div>
      </div>

      <button class="next-step-btn" id="btn-step0" onclick="goStep(1)" disabled>Continue &rarr;</button>
    </div>
  </div>

  <!-- Step 2: Define Tools -->
  <div class="step-content" id="step1">
    <div class="section">
      <h2>Choose the tools your server exposes</h2>
      <p>Select which capabilities your <strong id="chosenType">server</strong> will offer to AI models:</p>

      <div class="tool-selector" id="toolSelector"></div>
      <button class="next-step-btn" id="btn-step1" onclick="goStep(2)" disabled>Generate Code &rarr;</button>
    </div>
  </div>

  <!-- Step 3: View Code -->
  <div class="step-content" id="step2">
    <div class="section">
      <h2>Your MCP Server Code</h2>
      <p>Here's the TypeScript structure for your custom MCP server. Annotations explain each part:</p>

      <div class="code-preview">
        <div class="code-header">
          <span class="filename" id="codeFilename">server.ts</span>
          <span class="lang">TypeScript</span>
        </div>
        <pre class="code-body" id="codeBody"></pre>
        </div>

      <div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.6">
        <strong style="color:#fb923c">What to do with this code:</strong> Copy the generated code above into a file (e.g., <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.8rem">my-server.ts</code>). Install the dependencies with <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.8rem">npm install @modelcontextprotocol/sdk zod</code>. Fill in the placeholder logic in each tool handler. Then run it with <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.8rem">npx tsx my-server.ts</code>.
      </div>

      <div class="section" style="margin-top:2rem">
        <h2>Key Pattern: server.tool()</h2>
        <p>The <code style="background:rgba(139,92,246,.15);padding:.15rem .4rem;border-radius:4px;color:#8b5cf6;font-size:.85rem">server.tool()</code> method is how you teach the server what it can do. Think of it as registering a capability -- you give it a name, describe what inputs it needs, and write the code that runs when Claude calls it. Every MCP server follows this same pattern with three arguments:</p>
        <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.1)">
            <span style="font-weight:700;color:#8b5cf6;font-size:.85rem;min-width:60px">name</span>
            <span style="font-size:.85rem;color:#a1a1aa">A unique string identifier the AI uses to call this tool</span>
          </div>
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.05);border:1px solid rgba(251,146,60,.1)">
            <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:60px">schema</span>
            <span style="font-size:.85rem;color:#a1a1aa">A Zod schema defining the input parameters and their types</span>
          </div>
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.05);border:1px solid rgba(52,211,153,.1)">
            <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:60px">handler</span>
            <span style="font-size:.85rem;color:#a1a1aa">An async function that executes the tool logic and returns results</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 250 XP</button>
  
</div>

<script>
let selectedType = null;
let selectedTools = [];

const toolSets = {
  filesystem: [
    {id:'read_file', label:'read_file', desc:'Read file contents'},
    {id:'write_file', label:'write_file', desc:'Write to a file'},
    {id:'list_directory', label:'list_directory', desc:'List directory contents'},
    {id:'search_files', label:'search_files', desc:'Search for files by pattern'},
    {id:'get_file_info', label:'get_file_info', desc:'Get file metadata'},
    {id:'move_file', label:'move_file', desc:'Move or rename a file'},
  ],
  database: [
    {id:'query', label:'query', desc:'Execute SQL query'},
    {id:'insert', label:'insert', desc:'Insert a record'},
    {id:'update', label:'update', desc:'Update records'},
    {id:'delete_record', label:'delete', desc:'Delete records'},
    {id:'list_tables', label:'list_tables', desc:'List all tables'},
    {id:'describe_table', label:'describe_table', desc:'Get table schema'},
  ],
  api: [
    {id:'api_get', label:'GET request', desc:'Fetch data from endpoint'},
    {id:'api_post', label:'POST request', desc:'Send data to endpoint'},
    {id:'api_put', label:'PUT request', desc:'Update a resource'},
    {id:'api_delete', label:'DELETE request', desc:'Remove a resource'},
    {id:'list_endpoints', label:'list_endpoints', desc:'Show available endpoints'},
    {id:'check_status', label:'check_status', desc:'API health check'},
  ]
};

function selectType(type){
  selectedType = type;
  selectedTools = [];
  document.querySelectorAll('.choice-card').forEach(el => el.classList.remove('selected'));
  document.getElementById('type-'+type).classList.add('selected');
  document.getElementById('btn-step0').disabled = false;
  document.getElementById('chosenType').textContent = type + ' server';

  const selector = document.getElementById('toolSelector');
  selector.innerHTML = toolSets[type].map(t =>
    `<div class="tool-chip" onclick="toggleTool('${t.id}',this)" id="chip-${t.id}">${t.label}</div>`
  ).join('');
}

function toggleTool(id, el){
  if(selectedTools.includes(id)){
    selectedTools = selectedTools.filter(t => t !== id);
    el.classList.remove('selected');
  } else {
    selectedTools.push(id);
    el.classList.add('selected');
  }
  document.getElementById('btn-step1').disabled = selectedTools.length === 0;
}

function goStep(n){
  if(n === 1 && !selectedType) return;
  if(n === 2 && selectedTools.length === 0) return;
  if(n === 2) generateCode();

  document.querySelectorAll('.step-content').forEach((el,i) => el.classList.toggle('active', i===n));
  document.querySelectorAll('.step-tab').forEach((el,i) => {
    el.classList.toggle('active', i===n);
    if(i < n) el.classList.add('done');
  });
}

function generateCode(){
  const type = selectedType;
  const tools = selectedTools;
  const names = {filesystem:'my-fs-server', database:'my-db-server', api:'my-api-server'};
  document.getElementById('codeFilename').textContent = names[type] + '.ts';

  const imports = {
    filesystem: 'fs/promises',
    database: 'better-sqlite3',
    api: 'node-fetch'
  };

  let toolCode = '';
  const allTools = toolSets[type];
  tools.forEach(tid => {
    const t = allTools.find(x => x.id === tid);
    if(!t) return;
    toolCode += `
<span class="cm">// Tool: ${t.desc}</span>
<span class="fn">server</span>.<span class="fn">tool</span>(<span class="ann">name</span>
  <span class="str">"${t.label}"</span>,<span class="ann">schema</span>
  { path: <span class="fn">z</span>.<span class="fn">string</span>().<span class="fn">describe</span>(<span class="str">"Target path or identifier"</span>) },<span class="ann">handler</span>
  <span class="kw">async</span> ({ path }) => {
    <span class="cm">// Your ${t.desc.toLowerCase()} logic here</span>
    <span class="kw">const</span> result = <span class="kw">await</span> <span class="fn">${t.id}</span>(path);
    <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: result }] };
  }
);
`;
  });

  document.getElementById('codeBody').innerHTML = `<span class="cm">// ${names[type]}.ts — MCP Server for ${type}</span>
<span class="kw">import</span> { <span class="fn">McpServer</span> } <span class="kw">from</span> <span class="str">"@modelcontextprotocol/sdk/server/mcp.js"</span>;
<span class="kw">import</span> { <span class="fn">StdioServerTransport</span> } <span class="kw">from</span> <span class="str">"@modelcontextprotocol/sdk/server/stdio.js"</span>;
<span class="kw">import</span> { <span class="fn">z</span> } <span class="kw">from</span> <span class="str">"zod"</span>;

<span class="cm">// Create the MCP server instance</span>
<span class="kw">const</span> server = <span class="kw">new</span> <span class="fn">McpServer</span>({
  name: <span class="str">"${names[type]}"</span>,
  version: <span class="str">"1.0.0"</span>,
});
${toolCode}
<span class="cm">// Connect via stdio transport</span>
<span class="kw">const</span> transport = <span class="kw">new</span> <span class="fn">StdioServerTransport</span>();
<span class="kw">await</span> <span class="fn">server</span>.<span class="fn">connect</span>(transport);`;
}

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['your-first-server'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 4, 250);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['your-first-server']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
