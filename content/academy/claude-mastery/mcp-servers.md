---
title: "MCP Servers"
course: "claude-mastery"
order: 9
type: "lesson"
free: false
---<div class="particle-container" id="particles"></div>
<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">
<a href="index.html" class="logo">Claude Mastery</a>
<a href="index.html" class="nav-link">← Back to Course</a>
</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 9 · Visual</div>
<h1>MCP Servers</h1>
<p>The Model Context Protocol — Claude's universal connector</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 3</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is MCP?</h2>
<p>The <strong>Model Context Protocol</strong> (MCP) is an open standard created by Anthropic that lets Claude connect to external data sources and tools through a universal interface. A <strong>protocol</strong> is simply an agreed-upon set of rules for how two systems communicate -- like how HTTP defines how your browser talks to websites. MCP defines how AI models talk to tools.</p>
<p>Instead of building custom integrations for every tool, MCP provides a single protocol that any server can implement. Think of it like USB for AI -- one standard connector that works with everything.</p>
<p><strong>Why this matters:</strong> Without MCP, connecting Claude to your files, databases, or APIs would require custom code for each one. With MCP, you write a server once using the standard rules, and any MCP-compatible AI can use it automatically.</p>
</div>

<div class="card">
<h2>Architecture Diagram</h2>
<p>Click on each component to learn more about its role:</p>

<div class="arch-diagram" id="archDiagram">
<!-- Claude Node -->
<div class="arch-node active" id="nodeClient" style="left:50%;top:20px;transform:translateX(-50%);background:rgba(139,92,246,.15);border:2px solid rgba(139,92,246,.4)" onclick="showArchDetail('client')">
<div class="arch-label" style="color:#8b5cf6">AI MODEL</div>
<div class="arch-name">🧠 Claude</div>
<div class="arch-sub">Sends requests via MCP</div>
</div>

<!-- MCP Server Node -->
<div class="arch-node" id="nodeServer" style="left:50%;top:140px;transform:translateX(-50%);background:rgba(56,189,248,.15);border:2px solid rgba(56,189,248,.4)" onclick="showArchDetail('server')">
<div class="arch-label" style="color:#38bdf8">MCP SERVER</div>
<div class="arch-name">🔌 Protocol Layer</div>
<div class="arch-sub">Translates requests</div>
</div>

<!-- Data Sources -->
<div class="arch-node" id="nodeData1" style="left:10%;top:270px;background:rgba(251,146,60,.15);border:2px solid rgba(251,146,60,.4)" onclick="showArchDetail('data')">
<div class="arch-label" style="color:#fb923c">DATA</div>
<div class="arch-name">📁 Files</div>
</div>
<div class="arch-node" id="nodeData2" style="left:38%;top:270px;background:rgba(52,211,153,.15);border:2px solid rgba(52,211,153,.4)" onclick="showArchDetail('data')">
<div class="arch-label" style="color:#34d399">DATA</div>
<div class="arch-name">🗄️ Database</div>
</div>
<div class="arch-node" id="nodeData3" style="right:10%;top:270px;background:rgba(244,114,182,.15);border:2px solid rgba(244,114,182,.4)" onclick="showArchDetail('data')">
<div class="arch-label" style="color:#f472b6">DATA</div>
<div class="arch-name">🌐 APIs</div>
</div>

<!-- Connection Lines (SVG) -->
<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1">
<line x1="50%" y1="80" x2="50%" y2="140" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
<line x1="50%" y1="200" x2="20%" y2="270" stroke="#fb923c" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
<line x1="50%" y1="200" x2="50%" y2="270" stroke="#34d399" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
<line x1="50%" y1="200" x2="80%" y2="270" stroke="#f472b6" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
</svg>
</div>

<div class="detail-panel" id="archDetail"></div>
</div>

<div class="card">
<h2>MCP Server Types</h2>
<p>Click each server type to see its implementation details and use cases:</p>

<div class="server-types">
<div class="server-card" onclick="showServer(0,this)">
<div class="server-emoji">📁</div>
<div class="server-name">Filesystem Server</div>
<div class="server-desc">Read, write, and search files on the local machine</div>
</div>
<div class="server-card" onclick="showServer(1,this)">
<div class="server-emoji">🗄️</div>
<div class="server-name">Database Server</div>
<div class="server-desc">Query PostgreSQL, SQLite, or any database</div>
</div>
<div class="server-card" onclick="showServer(2,this)">
<div class="server-emoji">🌐</div>
<div class="server-name">API Server</div>
<div class="server-desc">Connect to REST APIs, webhooks, and web services</div>
</div>
<div class="server-card" onclick="showServer(3,this)">
<div class="server-emoji">🔍</div>
<div class="server-name">Search Server</div>
<div class="server-desc">Web search, semantic search, vector databases</div>
</div>
<div class="server-card" onclick="showServer(4,this)">
<div class="server-emoji">🛠️</div>
<div class="server-name">Custom Server</div>
<div class="server-desc">Build your own for any data source</div>
</div>
</div>

<div class="detail-panel" id="serverDetail"></div>
</div>

<div class="card">
<h2>Why MCP Matters</h2>
<div style="display:grid;gap:1rem;margin-top:1rem">
<div class="use-case">
<div class="use-case-icon">🔗</div>
<div class="use-case-text"><strong>Universal standard</strong> — One protocol works with any AI model that supports MCP, not just Claude. Build once, use everywhere.</div>
</div>
<div class="use-case">
<div class="use-case-icon">🔒</div>
<div class="use-case-text"><strong>Security by design</strong> — MCP servers run locally. Your data never leaves your machine unless the server explicitly sends it. You control the permissions.</div>
</div>
<div class="use-case">
<div class="use-case-icon">⚡</div>
<div class="use-case-text"><strong>Composable</strong> — Connect multiple MCP servers at once. Claude can query your database, read your files, and call your API all in the same conversation.</div>
</div>
<div class="use-case">
<div class="use-case-icon">🌱</div>
<div class="use-case-text"><strong>Growing ecosystem</strong> — Hundreds of MCP servers already exist — from GitHub and Slack to Notion and custom business tools.</div>
</div>
</div>
</div>

<div class="card">
<button class="complete-btn" onclick="completeLesson()">Complete & Continue →</button>
</div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 9 of 10</span>
<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:90%"></div></div>
<span class="progress-label">Module 3</span>
</div>

<script>
const ARCH_DETAILS={
client:`<h3>Claude (MCP Client)</h3><p style="color:#a1a1aa;font-size:.9rem;line-height:1.6">Claude acts as the <strong>MCP Client</strong>. When it needs external data or wants to perform an action, it sends a structured request through the MCP protocol. Claude can discover what tools are available, understand their parameters, and call them intelligently.</p>
<div class="code-block"><span class="code-comment">// Claude discovers available tools on connection</span>
<span class="code-fn">listTools</span>() → [
  { <span class="code-key">name</span>: <span class="code-str">"read_file"</span>, <span class="code-key">description</span>: <span class="code-str">"Read a file from disk"</span> },
  { <span class="code-key">name</span>: <span class="code-str">"query_db"</span>, <span class="code-key">description</span>: <span class="code-str">"Run a SQL query"</span> }
]</div>`,
server:`<h3>MCP Server (Protocol Layer)</h3><p style="color:#a1a1aa;font-size:.9rem;line-height:1.6">The MCP Server is the bridge. It implements the MCP protocol, exposing tools, resources, and prompts in a standardized format. A <strong>schema</strong> (a structured description of what inputs a tool expects and what types they should be) tells Claude exactly how to call each tool correctly. The server translates Claude's requests into actions on your data sources.</p>
<div class="code-block"><span class="code-comment">// Basic MCP server structure (TypeScript)</span>
<span class="code-key">import</span> { <span class="code-fn">McpServer</span> } <span class="code-key">from</span> <span class="code-str">"@modelcontextprotocol/sdk"</span>;

<span class="code-key">const</span> server = <span class="code-key">new</span> <span class="code-fn">McpServer</span>({
  <span class="code-key">name</span>: <span class="code-str">"my-server"</span>,
  <span class="code-key">version</span>: <span class="code-str">"1.0.0"</span>
});

server.<span class="code-fn">tool</span>(<span class="code-str">"get_data"</span>, { <span class="code-key">id</span>: z.string() },
  <span class="code-key">async</span> ({ id }) => {
    <span class="code-key">const</span> data = <span class="code-key">await</span> <span class="code-fn">fetchFromDB</span>(id);
    <span class="code-key">return</span> { content: [{ type: <span class="code-str">"text"</span>, text: data }] };
  }
);</div>`,
data:`<h3>Data Sources</h3><p style="color:#a1a1aa;font-size:.9rem;line-height:1.6">Data sources are whatever you want Claude to access — files on disk, databases, APIs, or any other system. The MCP server handles the connection details, so Claude never touches raw credentials or connection strings.</p>
<div style="display:grid;gap:.5rem;margin-top:1rem">
<div class="use-case"><div class="use-case-icon">📁</div><div class="use-case-text"><strong>Local files</strong> — Read/write code, documents, configs</div></div>
<div class="use-case"><div class="use-case-icon">🗄️</div><div class="use-case-text"><strong>Databases</strong> — PostgreSQL, MySQL, SQLite, MongoDB</div></div>
<div class="use-case"><div class="use-case-icon">🌐</div><div class="use-case-text"><strong>APIs</strong> — GitHub, Slack, Jira, Stripe, any REST/GraphQL API</div></div>
</div>`
};

const SERVER_DETAILS=[
{title:"Filesystem MCP Server",
code:`<span class="code-comment">// claude_desktop_config.json</span>
{
  <span class="code-key">"mcpServers"</span>: {
    <span class="code-str">"filesystem"</span>: {
      <span class="code-key">"command"</span>: <span class="code-str">"npx"</span>,
      <span class="code-key">"args"</span>: [
        <span class="code-str">"@modelcontextprotocol/server-filesystem"</span>,
        <span class="code-str">"/path/to/allowed/directory"</span>
      ]
    }
  }
}`,
cases:["Read and analyze entire codebases","Search files by content or pattern","Create and modify configuration files","Process documents and reports"]},
{title:"Database MCP Server",
code:`<span class="code-comment">// PostgreSQL MCP server config</span>
{
  <span class="code-key">"mcpServers"</span>: {
    <span class="code-str">"postgres"</span>: {
      <span class="code-key">"command"</span>: <span class="code-str">"npx"</span>,
      <span class="code-key">"args"</span>: [
        <span class="code-str">"@modelcontextprotocol/server-postgres"</span>,
        <span class="code-str">"postgresql://user:pass@localhost/mydb"</span>
      ]
    }
  }
}`,
cases:["Natural language database queries","Generate reports from live data","Debug data integrity issues","Schema analysis and optimization suggestions"]},
{title:"API MCP Server",
code:`<span class="code-comment">// GitHub MCP server config</span>
{
  <span class="code-key">"mcpServers"</span>: {
    <span class="code-str">"github"</span>: {
      <span class="code-key">"command"</span>: <span class="code-str">"npx"</span>,
      <span class="code-key">"args"</span>: [<span class="code-str">"@modelcontextprotocol/server-github"</span>],
      <span class="code-key">"env"</span>: {
        <span class="code-str">"GITHUB_TOKEN"</span>: <span class="code-str">"your-token"</span>
      }
    }
  }
}`,
cases:["Manage GitHub repos, PRs, and issues","Post messages to Slack channels","Create and update Notion pages","Process payments with Stripe"]},
{title:"Search MCP Server",
code:`<span class="code-comment">// Brave Search MCP server config</span>
{
  <span class="code-key">"mcpServers"</span>: {
    <span class="code-str">"brave-search"</span>: {
      <span class="code-key">"command"</span>: <span class="code-str">"npx"</span>,
      <span class="code-key">"args"</span>: [<span class="code-str">"@modelcontextprotocol/server-brave-search"</span>],
      <span class="code-key">"env"</span>: {
        <span class="code-str">"BRAVE_API_KEY"</span>: <span class="code-str">"your-key"</span>
      }
    }
  }
}`,
cases:["Real-time web search during conversations","Research topics with current information","Fact-check claims against live sources","Find documentation and tutorials"]},
{title:"Custom MCP Server",
code:`<span class="code-comment">// Build your own in ~50 lines of TypeScript</span>
<span class="code-key">import</span> { <span class="code-fn">McpServer</span> } <span class="code-key">from</span> <span class="code-str">"@modelcontextprotocol/sdk"</span>;
<span class="code-key">import</span> { z } <span class="code-key">from</span> <span class="code-str">"zod"</span>;

<span class="code-key">const</span> server = <span class="code-key">new</span> <span class="code-fn">McpServer</span>({
  <span class="code-key">name</span>: <span class="code-str">"my-custom-server"</span>,
  <span class="code-key">version</span>: <span class="code-str">"1.0.0"</span>
});

<span class="code-comment">// Define your custom tools</span>
server.<span class="code-fn">tool</span>(
  <span class="code-str">"analyze_sales"</span>,
  { region: z.string(), period: z.string() },
  <span class="code-key">async</span> ({ region, period }) => {
    <span class="code-key">const</span> data = <span class="code-key">await</span> <span class="code-fn">getSalesData</span>(region, period);
    <span class="code-key">return</span> { content: [{ type: <span class="code-str">"text"</span>, text: JSON.stringify(data) }] };
  }
);`,
cases:["Connect Claude to your proprietary business systems","Build domain-specific tools for your workflow","Create data pipelines triggered by natural language","Automate complex multi-step business processes"]}
];

function showArchDetail(type){
const el=document.getElementById('archDetail');
el.innerHTML=ARCH_DETAILS[type];
el.classList.add('show');
document.querySelectorAll('.arch-node').forEach(n=>n.classList.remove('active'));
if(type==='client') document.getElementById('nodeClient').classList.add('active');
else if(type==='server') document.getElementById('nodeServer').classList.add('active');
else{document.getElementById('nodeData1').classList.add('active');document.getElementById('nodeData2').classList.add('active');document.getElementById('nodeData3').classList.add('active');}
}

function showServer(idx,el){
document.querySelectorAll('.server-card').forEach(c=>c.classList.remove('active'));
el.classList.add('active');
const s=SERVER_DETAILS[idx];
const panel=document.getElementById('serverDetail');
panel.innerHTML=`<h3>${s.title}</h3><div class="code-block">${s.code}</div><h4 style="font-size:.85rem;font-weight:700;margin:.75rem 0 .5rem;color:#a1a1aa">Use Cases</h4>${s.cases.map(c=>`<div class="use-case"><div class="use-case-icon">→</div><div class="use-case-text">${c}</div></div>`).join('')}`;
panel.classList.add('show');
}

function completeLesson(){
localStorage.setItem('cm_mcp-servers','done');
const burst=document.getElementById('xpBurst');burst.classList.add('show');
const cont=document.getElementById('particles');const colors=['#8b5cf6','#fb923c','#34d399','#f472b6','#38bdf8'];
for(let i=0;i<30;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*8+4;p.style.width=s+'px';p.style.height=s+'px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left='50%';p.style.top='50%';p.style.setProperty('--tx',(Math.random()-0.5)*400+'px');p.style.setProperty('--ty',(Math.random()-0.5)*400+'px');p.style.animation='particleFly .8s ease forwards';p.style.animationDelay=(Math.random()*.2)+'s';cont.appendChild(p);setTimeout(()=>p.remove(),1200);}
setTimeout(()=>{burst.classList.remove('show');LO_NAV.goNext()},1200);
}
</script>
