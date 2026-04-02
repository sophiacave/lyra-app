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
<p>The Model Context Protocol — Claude's universal connector, with a working server example</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 3</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is MCP?</h2>
<p>The <strong>Model Context Protocol</strong> (MCP) is an open standard created by Anthropic that lets AI models connect to external data sources and tools through a universal interface. A <strong>protocol</strong> is simply an agreed-upon set of rules for how two systems communicate — like how HTTP defines how your browser talks to websites. MCP defines how AI models talk to tools.</p>

<p>Instead of building custom integrations for every tool, MCP provides a single protocol that any server can implement. Think of it like USB for AI — one standard connector that works with everything.</p>

<p><strong>Why this matters:</strong> Without MCP, connecting Claude to your files, databases, or APIs would require custom tool definitions for each one. With MCP, you write a server once using the standard protocol, and any MCP-compatible client (Claude Code, Claude Desktop, Cursor, and more) can use it automatically.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin:1rem 0;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">MCP vs. Tool Use:</strong> Tool use (Lesson 8) lets you define tools inline in API calls. MCP is a <em>standard protocol</em> for packaging tools into reusable servers that any MCP client can discover and use. Tool use is one-off; MCP is ecosystem.
</div>
</div>

<div class="card">
<h2>Architecture Diagram</h2>
<p>Click on each component to learn more about its role:</p>

<div class="arch-diagram" id="archDiagram">
<div class="arch-node active" id="nodeClient" style="left:50%;top:20px;transform:translateX(-50%);background:rgba(139,92,246,.15);border:2px solid rgba(139,92,246,.4)" onclick="showArchDetail('client')">
<div class="arch-label" style="color:#8b5cf6">MCP CLIENT</div>
<div class="arch-name">Claude Code / Claude Desktop</div>
<div class="arch-sub">Discovers and calls tools via MCP</div>
</div>

<div class="arch-node" id="nodeServer" style="left:50%;top:140px;transform:translateX(-50%);background:rgba(56,189,248,.15);border:2px solid rgba(56,189,248,.4)" onclick="showArchDetail('server')">
<div class="arch-label" style="color:#38bdf8">MCP SERVER</div>
<div class="arch-name">Your Server (TypeScript/Python)</div>
<div class="arch-sub">Exposes tools, resources, prompts</div>
</div>

<div class="arch-node" id="nodeData1" style="left:10%;top:270px;background:rgba(251,146,60,.15);border:2px solid rgba(251,146,60,.4)" onclick="showArchDetail('data')">
<div class="arch-label" style="color:#fb923c">DATA</div>
<div class="arch-name">Files</div>
</div>
<div class="arch-node" id="nodeData2" style="left:38%;top:270px;background:rgba(52,211,153,.15);border:2px solid rgba(52,211,153,.4)" onclick="showArchDetail('data')">
<div class="arch-label" style="color:#34d399">DATA</div>
<div class="arch-name">Database</div>
</div>
<div class="arch-node" id="nodeData3" style="right:10%;top:270px;background:rgba(244,114,182,.15);border:2px solid rgba(244,114,182,.4)" onclick="showArchDetail('data')">
<div class="arch-label" style="color:#f472b6">DATA</div>
<div class="arch-name">APIs</div>
</div>

<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1">
<line x1="50%" y1="80" x2="50%" y2="140" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
<line x1="50%" y1="200" x2="20%" y2="270" stroke="#fb923c" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
<line x1="50%" y1="200" x2="50%" y2="270" stroke="#34d399" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
<line x1="50%" y1="200" x2="80%" y2="270" stroke="#f472b6" stroke-width="2" stroke-dasharray="6 3" style="animation:dashFlow 1s linear infinite"/>
</svg>
</div>
</div>

<div class="card">
<h2>Building a Simple MCP Server</h2>
<p>Here is a complete, working MCP server in TypeScript. This server exposes a single tool — a note-taking system. You can run this with Claude Code or Claude Desktop:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — complete MCP server (notes tool)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// npm install @modelcontextprotocol/sdk</span>
<span style="color:#c084fc">import</span> { McpServer } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@modelcontextprotocol/sdk/server/mcp.js"</span>;
<span style="color:#c084fc">import</span> { StdioServerTransport } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@modelcontextprotocol/sdk/server/stdio.js"</span>;
<span style="color:#c084fc">import</span> { z } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"zod"</span>;

<span style="color:#71717a">// In-memory note storage</span>
<span style="color:#c084fc">const</span> notes: Map&lt;string, string&gt; = <span style="color:#c084fc">new</span> Map();

<span style="color:#71717a">// Create the server</span>
<span style="color:#c084fc">const</span> server = <span style="color:#c084fc">new</span> McpServer({
  name: <span style="color:#fbbf24">"notes-server"</span>,
  version: <span style="color:#fbbf24">"1.0.0"</span>,
});

<span style="color:#71717a">// Register a tool: add a note</span>
server.tool(
  <span style="color:#fbbf24">"add_note"</span>,
  <span style="color:#fbbf24">"Save a note with a title and content"</span>,
  {
    title: z.string().describe(<span style="color:#fbbf24">"Note title"</span>),
    content: z.string().describe(<span style="color:#fbbf24">"Note content"</span>),
  },
  <span style="color:#c084fc">async</span> ({ title, content }) =&gt; {
    notes.set(title, content);
    <span style="color:#c084fc">return</span> {
      content: [{
        type: <span style="color:#fbbf24">"text"</span>,
        text: <span style="color:#fbbf24">`Saved note: "${title}"`</span>
      }]
    };
  }
);

<span style="color:#71717a">// Register a tool: list all notes</span>
server.tool(
  <span style="color:#fbbf24">"list_notes"</span>,
  <span style="color:#fbbf24">"List all saved notes"</span>,
  {},
  <span style="color:#c084fc">async</span> () =&gt; {
    <span style="color:#c084fc">if</span> (notes.size === <span style="color:#fb923c">0</span>) {
      <span style="color:#c084fc">return</span> { content: [{ type: <span style="color:#fbbf24">"text"</span>, text: <span style="color:#fbbf24">"No notes yet."</span> }] };
    }
    <span style="color:#c084fc">const</span> list = [...notes.entries()]
      .map(([title, content]) =&gt; <span style="color:#fbbf24">`- **${title}**: ${content}`</span>)
      .join(<span style="color:#fbbf24">"\n"</span>);
    <span style="color:#c084fc">return</span> { content: [{ type: <span style="color:#fbbf24">"text"</span>, text: list }] };
  }
);

<span style="color:#71717a">// Start the server (stdio transport)</span>
<span style="color:#c084fc">const</span> transport = <span style="color:#c084fc">new</span> StdioServerTransport();
<span style="color:#c084fc">await</span> server.connect(transport);</code></pre>
</div>
</div>

<div class="card">
<h2>Connecting Your Server to Claude</h2>
<p>Once you have written an MCP server, you connect it by adding it to your Claude configuration:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Claude Code — add MCP server to project settings</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// .claude/settings.json (in your project root)</span>
{
  <span style="color:#fbbf24">"mcpServers"</span>: {
    <span style="color:#fbbf24">"notes"</span>: {
      <span style="color:#fbbf24">"command"</span>: <span style="color:#fbbf24">"npx"</span>,
      <span style="color:#fbbf24">"args"</span>: [<span style="color:#fbbf24">"tsx"</span>, <span style="color:#fbbf24">"./mcp/notes-server.ts"</span>]
    }
  }
}</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Claude Desktop — add MCP server to desktop config</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// ~/Library/Application Support/Claude/claude_desktop_config.json</span>
{
  <span style="color:#fbbf24">"mcpServers"</span>: {
    <span style="color:#fbbf24">"notes"</span>: {
      <span style="color:#fbbf24">"command"</span>: <span style="color:#fbbf24">"npx"</span>,
      <span style="color:#fbbf24">"args"</span>: [<span style="color:#fbbf24">"tsx"</span>, <span style="color:#fbbf24">"/absolute/path/to/notes-server.ts"</span>]
    }
  }
}</code></pre>
</div>
<p style="font-size:.85rem;color:#a1a1aa">After adding the server, restart Claude. It will automatically discover the tools your server exposes. You can then say "Save a note about today's meeting" and Claude will call your <code>add_note</code> tool.</p>
</div>

<div class="card">
<h2>MCP Server Types</h2>
<p>Click each server type to see its use cases:</p>

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
<h2>The Three MCP Primitives</h2>
<p>MCP servers can expose three types of capabilities. Most servers start with just tools, then add resources and prompts as needed:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.88rem">Tools — actions Claude can take</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Functions that do things: query a database, send a message, create a file. Claude calls them with parameters and gets results back. This is the most common primitive — equivalent to tool use in the API.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">Resources — data Claude can read</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Structured data that Claude can pull into context: files, database records, API responses. Resources are read-only and addressable by URI (e.g., <code>notes://meeting-2026-04-01</code>). Think of them as a data layer Claude can browse.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.88rem">Prompts — reusable prompt templates</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Pre-defined prompt templates that users can invoke. For example, a "summarize-document" prompt that takes a file path and returns a structured summary. Prompts standardize common workflows.</p>
</div>
</div>
</div>

<div class="card">
<h2>Why MCP Matters</h2>
<div style="display:grid;gap:1rem;margin-top:1rem">
<div class="use-case">
<div class="use-case-icon">🔗</div>
<div class="use-case-text"><strong>Universal standard</strong> — One protocol works with any AI model that supports MCP, not just Claude. Build once, use with Claude Code, Claude Desktop, Cursor, Windsurf, and more.</div>
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
<div class="use-case-text"><strong>Growing ecosystem</strong> — Hundreds of community-built MCP servers already exist — from GitHub and Slack to Notion, Postgres, and custom business tools.</div>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"MCP Key Concepts","cards":[{"front":"Model Context Protocol (MCP)","back":"An open standard by Anthropic that defines how AI models communicate with external tools and data sources. Like USB for AI — one standard connector that works with any MCP-compatible client."},{"front":"The three MCP primitives","back":"Tools (actions Claude can take), Resources (data Claude can read), and Prompts (reusable prompt templates). Most servers start with tools and add the others as needed."},{"front":"MCP Client","back":"The application that connects to MCP servers — Claude Code, Claude Desktop, Cursor, etc. The client discovers available tools and lets the AI model call them."},{"front":"MCP Server","back":"A program you write that exposes tools, resources, and/or prompts via the MCP protocol. It runs locally and connects to your data sources. Built with @modelcontextprotocol/sdk."},{"front":"MCP security model","back":"Servers run locally by default. Data never leaves the machine unless the server explicitly sends it. The developer controls all permissions. Each server runs in its own process."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"MCP Comprehension","questions":[{"q":"What does MCP stand for?","options":["Machine Code Protocol","Model Context Protocol","Multi-Channel Pipeline","Managed Claude Proxy"],"correct":1,"explanation":"MCP stands for Model Context Protocol — an open standard by Anthropic for how AI models communicate with external tools and data sources."},{"q":"How does MCP differ from inline tool use in the API?","options":["MCP is slower","MCP packages tools into reusable servers that any MCP client can discover and use — tool use is one-off per API call","MCP only works with Opus","There is no difference"],"correct":1,"explanation":"Inline tool use defines tools per API call. MCP packages tools into reusable servers with a standard protocol — any MCP-compatible client (Claude Code, Claude Desktop, Cursor) can discover and use them automatically."},{"q":"Where does an MCP server run by default?","options":["On Anthropic servers","On the cloud provider closest to you","Locally on your machine","Inside Claude model weights"],"correct":2,"explanation":"MCP servers run locally by default. This is a security feature — your data never leaves your machine unless the server explicitly sends it to an external service."},{"q":"What are the three primitives an MCP server can expose?","options":["Read, Write, Execute","Tools, Resources, Prompts","Input, Output, Error","Query, Mutation, Subscription"],"correct":1,"explanation":"MCP servers can expose Tools (actions), Resources (readable data), and Prompts (reusable templates). Most servers start with tools — the most common primitive — and add the others as needed."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 9 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
