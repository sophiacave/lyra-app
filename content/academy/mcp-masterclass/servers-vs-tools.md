---
title: "Servers vs Tools"
course: "mcp-masterclass"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 3</div>
  <h1>Servers vs Tools</h1>
  <p class="subtitle">MCP Servers are long-running processes that expose multiple tools. Understand the difference — and explore six real server types.</p>

  <div class="section">
    <h2>MCP Servers vs Direct Tool Calls</h2>
    <p>An MCP Server is NOT the same as a single tool. A server is a persistent process that can expose many tools, maintain state across calls, and manage connections. Here's how they compare:</p>

    <div class="comparison">
      <div class="comp-header servers">MCP Servers</div>
      <div class="comp-header tools">Direct Tool Calls</div>

      <div class="comp-row">
        <div class="comp-cell"><strong>Lifecycle</strong>Long-running process. Starts once, handles many requests.</div>
        <div class="comp-cell"><strong>Lifecycle</strong>One-off execution. Each call is independent.</div>
      </div>
      <div class="comp-row">
        <div class="comp-cell"><strong>Capabilities</strong>Exposes multiple tools, resources, and prompts through a single server.</div>
        <div class="comp-cell"><strong>Capabilities</strong>Single function with defined inputs and outputs.</div>
      </div>
      <div class="comp-row">
        <div class="comp-cell"><strong>State</strong>Maintains state across calls. Database connections stay open. Context persists.</div>
        <div class="comp-cell"><strong>State</strong>Stateless. Each invocation starts fresh with no memory of previous calls.</div>
      </div>
      <div class="comp-row">
        <div class="comp-cell"><strong>Discovery</strong>Clients discover available tools automatically via the MCP protocol.</div>
        <div class="comp-cell"><strong>Discovery</strong>Tools must be explicitly defined and configured per integration.</div>
      </div>
      <div class="comp-row">
        <div class="comp-cell"><strong>Transport</strong>Communicates over stdio or HTTP with Server-Sent Events (SSE).</div>
        <div class="comp-cell"><strong>Transport</strong>Varies — REST, SDK calls, or inline function execution.</div>
      </div>
      <div class="comp-row">
        <div class="comp-cell"><strong>Standard</strong>Universal MCP protocol. Works with any MCP client.</div>
        <div class="comp-cell"><strong>Standard</strong>Vendor-specific. Different format for each AI provider.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Explore MCP Server Types</h2>
    <p>Click each server type to see what capabilities it exposes:</p>

    <div class="server-gallery">
      <div class="server-card" onclick="showServer(0)" id="srv0">
        <div class="icon">&#x1F4C1;</div>
        <h3>Filesystem</h3>
        <p>Read, write, search files</p>
      </div>
      <div class="server-card" onclick="showServer(1)" id="srv1">
        <div class="icon">&#x1F4BE;</div>
        <h3>Database</h3>
        <p>Query, insert, update data</p>
      </div>
      <div class="server-card" onclick="showServer(2)" id="srv2">
        <div class="icon">&#x1F310;</div>
        <h3>API</h3>
        <p>Wrap any REST or GraphQL API</p>
      </div>
      <div class="server-card" onclick="showServer(3)" id="srv3">
        <div class="icon">&#x1F5A5;&#xFE0F;</div>
        <h3>Browser</h3>
        <p>Navigate, screenshot, interact</p>
      </div>
      <div class="server-card" onclick="showServer(4)" id="srv4">
        <div class="icon">&#x1F9E0;</div>
        <h3>Memory</h3>
        <p>Persistent knowledge recall</p>
      </div>
      <div class="server-card" onclick="showServer(5)" id="srv5">
        <div class="icon">&#x1F50D;</div>
        <h3>Search</h3>
        <p>Web, docs, or code search</p>
      </div>
    </div>

    </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 200 XP</button>
  
</div>

<script>
const servers = [
  {
    name: 'Filesystem Server',
    color: '#34d399',
    desc: 'Gives AI direct access to your local or remote filesystem. Claude can read project files, write code, search directories, and manage file operations — all through a controlled, sandboxed interface.',
    capabilities: [
      {icon:'&#x1F4D6;', name:'read_file', desc:'Read contents of any file', bg:'rgba(52,211,153,.1)'},
      {icon:'&#x270F;&#xFE0F;', name:'write_file', desc:'Create or overwrite files', bg:'rgba(52,211,153,.1)'},
      {icon:'&#x1F50D;', name:'search_files', desc:'Grep/glob across directories', bg:'rgba(52,211,153,.1)'},
      {icon:'&#x1F4C2;', name:'list_directory', desc:'List files and subdirectories', bg:'rgba(52,211,153,.1)'},
      {icon:'&#x1F5D1;&#xFE0F;', name:'move_file', desc:'Move or rename files', bg:'rgba(52,211,153,.1)'},
    ]
  },
  {
    name: 'Database Server',
    color: '#38bdf8',
    desc: 'Connects AI to SQL or NoSQL databases. The server maintains a persistent connection pool and lets Claude query, insert, update, and analyze data without exposing raw credentials.',
    capabilities: [
      {icon:'&#x1F4CA;', name:'query', desc:'Execute SELECT queries', bg:'rgba(56,189,248,.1)'},
      {icon:'&#x2795;', name:'insert', desc:'Insert new records', bg:'rgba(56,189,248,.1)'},
      {icon:'&#x1F504;', name:'update', desc:'Modify existing records', bg:'rgba(56,189,248,.1)'},
      {icon:'&#x1F4CB;', name:'list_tables', desc:'Show database schema', bg:'rgba(56,189,248,.1)'},
      {icon:'&#x1F4C8;', name:'describe_table', desc:'Column types and constraints', bg:'rgba(56,189,248,.1)'},
    ]
  },
  {
    name: 'API Server',
    color: '#fb923c',
    desc: 'Wraps any REST or GraphQL API as MCP tools. You define the endpoints, authentication, and rate limits. Claude calls them like native tools without knowing the underlying HTTP details.',
    capabilities: [
      {icon:'&#x1F4E8;', name:'api_get', desc:'GET requests to endpoints', bg:'rgba(251,146,60,.1)'},
      {icon:'&#x1F4E4;', name:'api_post', desc:'POST data to endpoints', bg:'rgba(251,146,60,.1)'},
      {icon:'&#x1F504;', name:'api_put', desc:'Update existing resources', bg:'rgba(251,146,60,.1)'},
      {icon:'&#x1F6A8;', name:'webhook_listen', desc:'Listen for incoming webhooks', bg:'rgba(251,146,60,.1)'},
      {icon:'&#x1F511;', name:'auth_refresh', desc:'Manage API tokens', bg:'rgba(251,146,60,.1)'},
    ]
  },
  {
    name: 'Browser Server',
    color: '#f472b6',
    desc: 'Gives AI browser automation capabilities via Puppeteer or Playwright. Claude can navigate pages, fill forms, take screenshots, and extract data from web applications.',
    capabilities: [
      {icon:'&#x1F30D;', name:'navigate', desc:'Go to any URL', bg:'rgba(244,114,182,.1)'},
      {icon:'&#x1F4F7;', name:'screenshot', desc:'Capture page screenshots', bg:'rgba(244,114,182,.1)'},
      {icon:'&#x1F5B1;&#xFE0F;', name:'click', desc:'Click elements on page', bg:'rgba(244,114,182,.1)'},
      {icon:'&#x2328;&#xFE0F;', name:'type', desc:'Type into input fields', bg:'rgba(244,114,182,.1)'},
      {icon:'&#x1F4C4;', name:'get_text', desc:'Extract page content', bg:'rgba(244,114,182,.1)'},
    ]
  },
  {
    name: 'Memory Server',
    color: '#a78bfa',
    desc: 'Provides persistent memory across AI sessions. Stores knowledge graphs, facts, and context that the AI can recall later. Essential for long-running projects where context exceeds the token window.',
    capabilities: [
      {icon:'&#x1F4DD;', name:'store_memory', desc:'Save a fact or observation', bg:'rgba(167,139,250,.1)'},
      {icon:'&#x1F4A1;', name:'recall', desc:'Retrieve relevant memories', bg:'rgba(167,139,250,.1)'},
      {icon:'&#x1F517;', name:'create_relation', desc:'Link related concepts', bg:'rgba(167,139,250,.1)'},
      {icon:'&#x1F50D;', name:'search_memory', desc:'Semantic search across memories', bg:'rgba(167,139,250,.1)'},
      {icon:'&#x1F5D1;&#xFE0F;', name:'forget', desc:'Remove outdated memories', bg:'rgba(167,139,250,.1)'},
    ]
  },
  {
    name: 'Search Server',
    color: '#fbbf24',
    desc: 'Connects AI to search engines, documentation indices, or code search. Claude can look up current information, find relevant docs, or search across codebases in real-time.',
    capabilities: [
      {icon:'&#x1F310;', name:'web_search', desc:'Search the internet', bg:'rgba(251,191,36,.1)'},
      {icon:'&#x1F4DA;', name:'search_docs', desc:'Search documentation', bg:'rgba(251,191,36,.1)'},
      {icon:'&#x1F4BB;', name:'search_code', desc:'Search across repositories', bg:'rgba(251,191,36,.1)'},
      {icon:'&#x1F4F0;', name:'search_news', desc:'Find recent news articles', bg:'rgba(251,191,36,.1)'},
      {icon:'&#x1F4CC;', name:'search_bookmarks', desc:'Search saved references', bg:'rgba(251,191,36,.1)'},
    ]
  }
];

function showServer(idx){
  document.querySelectorAll('.server-card').forEach((el,i) => el.classList.toggle('active', i===idx));
  const s = servers[idx];
  const detail = document.getElementById('serverDetail');
  detail.className = 'server-detail visible';
  detail.innerHTML = `
    <h3 style="color:${s.color}">${s.name}</h3>
    <div class="desc">${s.desc}</div>
    <div style="font-size:.8rem;font-weight:600;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.04em">Exposed Tools</div>
    <div class="capabilities">
      ${s.capabilities.map(c => `
        <div class="capability">
          <div class="cap-icon" style="background:${c.bg}">${c.icon}</div>
          <div class="cap-name">${c.name}</div>
          <div class="cap-desc">${c.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['servers-vs-tools'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 3, 200);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['servers-vs-tools']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
