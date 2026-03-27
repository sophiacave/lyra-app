---
title: "MCP Servers"
course: "claude-mastery"
order: 9
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


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

<div data-learn="FlashDeck" data-props='{"title":"MCP Key Concepts","cards":[{"front":"Model Context Protocol (MCP)","back":"An open standard by Anthropic that defines how AI models communicate with external tools and data sources — like USB for AI."},{"front":"MCP Client","back":"The AI model (Claude) that sends requests through the MCP protocol to discover and call available tools."},{"front":"MCP Server","back":"The protocol layer that translates Claude requests into actions on real data sources — files, databases, APIs. It exposes tools with schemas."},{"front":"Why MCP instead of custom integrations?","back":"MCP lets you write a server once using standard rules. Any MCP-compatible AI can use it automatically — no custom glue code per AI model."},{"front":"MCP security model","back":"Servers run locally. Data never leaves the machine unless the server explicitly sends it. The developer controls all permissions."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match MCP Server Type to Use Case","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Filesystem Server","right":"Read and analyze entire codebases on disk"},{"left":"Database Server","right":"Natural language queries against PostgreSQL"},{"left":"API Server","right":"Manage GitHub repos, PRs, and issues"},{"left":"Search Server","right":"Real-time web search during conversations"},{"left":"Custom Server","right":"Connect Claude to proprietary business systems"}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"MCP Comprehension","questions":[{"q":"What does MCP stand for?","options":["Machine Code Protocol","Model Context Protocol","Multi-Channel Pipeline","Managed Claude Proxy"],"correct":1,"explanation":"MCP stands for Model Context Protocol — an open standard by Anthropic for how AI models communicate with external tools and data sources."},{"q":"What is the best analogy for MCP?","options":["Bluetooth — short range only","USB — one standard connector that works with everything","HDMI — video output only","WiFi — wireless only"],"correct":1,"explanation":"USB is the right analogy — one universal standard connector. MCP is the single protocol that any tool server can implement, and any MCP-compatible AI can use."},{"q":"Where does an MCP server run by default?","options":["On Anthropic servers","On the cloud provider closest to you","Locally on your machine","Inside Claude model weights"],"correct":2,"explanation":"MCP servers run locally by default. This is a security feature — your data never leaves your machine unless the server explicitly sends it."},{"q":"You want Claude to be able to query your database AND read local files in the same conversation. Is this possible with MCP?","options":["No — one MCP server per conversation only","Yes — you can connect multiple MCP servers simultaneously","Only with the Enterprise plan","Only if both servers are on the same machine"],"correct":1,"explanation":"MCP is composable. You can connect multiple servers simultaneously, and Claude can use all of them in the same conversation — querying a database, reading a file, and calling an API in sequence."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 9 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
