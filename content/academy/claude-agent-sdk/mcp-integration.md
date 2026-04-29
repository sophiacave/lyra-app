---
title: "MCP Integration"
course: "claude-agent-sdk"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>MCP Integration</h1>
  <p class="sub">Connect your agent to databases, APIs, and services through the Model Context Protocol</p>
</div>

<div class="content">

<div class="card">
<h2>What Is MCP?</h2>
<p>The built-in tools (Bash, Read, Write) let your agent interact with the local file system. But real-world agents need to talk to <em>everything</em> — databases, APIs, cloud services, Slack, GitHub, Google Calendar, and more. That is what <strong style="color:#e5e5e5">MCP (Model Context Protocol)</strong> is for.</p>

<p>MCP is an open standard that defines how AI agents connect to external tools and data sources. Instead of writing custom integration code for every service, you plug in an MCP server and your agent immediately knows how to use it. One protocol, infinite connections.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> MCP is USB for AI. Before USB, every device needed its own proprietary cable and driver. USB created one standard that works for keyboards, cameras, phones, and everything else. MCP does the same for AI tool connections — one protocol that works for databases, APIs, email, calendars, and everything else.
</div>
</div>

<div class="card">
<h2>How MCP Works in the Agent SDK</h2>
<p>The SDK makes MCP integration straightforward. You define MCP servers in your agent configuration, and the agent can use their tools alongside the built-in ones:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — agent with MCP servers</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,

  <span style="color:#71717a">// Connect MCP servers — each one adds new tools</span>
  mcpServers: {
    <span style="color:#71717a">// A database server that gives Claude SQL access</span>
    database: {
      command: <span style="color:#fbbf24">"npx"</span>,
      args: [<span style="color:#fbbf24">"@anthropic-ai/mcp-server-sqlite"</span>, <span style="color:#fbbf24">"./data.db"</span>],
    },

    <span style="color:#71717a">// A GitHub server for repo operations</span>
    github: {
      command: <span style="color:#fbbf24">"npx"</span>,
      args: [<span style="color:#fbbf24">"@modelcontextprotocol/server-github"</span>],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      },
    },
  },
});

<span style="color:#71717a">// Now Claude can query the database AND interact with GitHub</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Check the database for users who signed up this week, then create a GitHub issue summarizing the count."</span>
);

<span style="color:#34d399">console</span>.log(result.text);</code></pre>
</div>
</div>

<div class="card">
<h2>MCP Server Types</h2>
<p>MCP servers come in two flavors, each suited for different use cases:</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.85rem">stdio servers (local)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Run as a child process on your machine. Communicate via stdin/stdout. Fast, private, no network required. Best for local databases, file systems, and development tools.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.85rem">SSE servers (remote)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Run on a remote server. Communicate via HTTP and Server-Sent Events. Best for cloud services, shared team tools, and production deployments where the MCP server runs separately.</p>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — remote MCP server via SSE</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  mcpServers: {
    <span style="color:#71717a">// Connect to a remote MCP server via SSE</span>
    production_db: {
      url: <span style="color:#fbbf24">"https://mcp.myapp.com/sse"</span>,
      headers: {
        Authorization: <span style="color:#fbbf24">`Bearer ${process.env.MCP_TOKEN}`</span>,
      },
    },
  },
});</code></pre>
</div>
</div>

<div class="card">
<h2>Popular MCP Servers</h2>
<p>A growing ecosystem of pre-built MCP servers covers common integrations:</p>

<div style="display:grid;gap:.5rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.8rem;font-weight:700;color:#8b5cf6;min-width:8rem">SQLite / Postgres</div>
<div style="font-size:.82rem;color:#a1a1aa">Query databases, inspect schemas, run analytics</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(56,189,248,.04);border-radius:8px;border:1px solid rgba(56,189,248,.08)">
<div style="font-size:.8rem;font-weight:700;color:#38bdf8;min-width:8rem">GitHub</div>
<div style="font-size:.82rem;color:#a1a1aa">Create issues, read PRs, manage repos</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="font-size:.8rem;font-weight:700;color:#fb923c;min-width:8rem">Slack</div>
<div style="font-size:.82rem;color:#a1a1aa">Send messages, read channels, search conversations</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.8rem;font-weight:700;color:#34d399;min-width:8rem">Filesystem</div>
<div style="font-size:.82rem;color:#a1a1aa">Sandboxed file access with configurable boundaries</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(244,114,182,.04);border-radius:8px;border:1px solid rgba(244,114,182,.08)">
<div style="font-size:.8rem;font-weight:700;color:#f472b6;min-width:8rem">Memory</div>
<div style="font-size:.82rem;color:#a1a1aa">Persistent knowledge graph for agent memory</div>
</div>
</div>
</div>

<div class="card">
<h2>Common Pitfalls</h2>
<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Missing environment variables</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">MCP servers often need API tokens or credentials passed via the <code>env</code> option. If the server starts but tools fail silently, check that all required environment variables are set.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Server startup failures</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If the MCP server binary is not installed, the agent will fail to start. Always ensure the server package is installed (<code>npx</code> handles this for npm packages) and that the command path is correct.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Too many MCP servers</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Each MCP server adds tools to Claude's context. Too many tools can confuse the model about which one to use. Start with 1-2 servers and add more as needed.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"MCP Integration","cards":[{"front":"What is MCP?","back":"Model Context Protocol — an open standard that defines how AI agents connect to external tools and data sources. One protocol for databases, APIs, cloud services, and everything else. Think: USB for AI."},{"front":"stdio vs SSE MCP servers","back":"stdio servers run as local child processes (fast, private, no network). SSE servers run remotely via HTTP (cloud services, shared tools, production). Choose based on where the server needs to run."},{"front":"How do you add MCP servers to an agent?","back":"Use the mcpServers config option. Each server gets a name, a command (for stdio) or url (for SSE), and optional args and env for configuration."},{"front":"What happens when MCP tools are added?","back":"The MCP server tools become available alongside built-in tools (Bash, Read, etc.). Claude sees all tools and chooses the right one for each task automatically."},{"front":"What are common MCP servers?","back":"SQLite/Postgres (database queries), GitHub (issues, PRs), Slack (messaging), Filesystem (sandboxed file access), Memory (persistent knowledge graph). The ecosystem is growing rapidly."},{"front":"What is the biggest MCP pitfall?","back":"Missing environment variables. MCP servers often need API tokens passed via the env option. If tools fail silently, check that credentials are properly configured."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"MCP Integration Check","questions":[{"q":"What problem does MCP solve for AI agents?","options":["It makes Claude respond faster","It provides a standard protocol for connecting agents to external tools and services","It reduces API costs","It replaces the need for an API key"],"correct":1,"explanation":"MCP standardizes how agents connect to external services. Without MCP, you would write custom integration code for every database, API, and service. With MCP, you plug in a server and the agent knows how to use it."},{"q":"Which MCP server type runs as a local child process?","options":["SSE server","REST server","stdio server","WebSocket server"],"correct":2,"explanation":"stdio servers run locally as child processes and communicate via stdin/stdout. They are fast, private, and require no network. SSE servers run remotely via HTTP."},{"q":"You want your agent to query a PostgreSQL database. What do you need?","options":["Write raw SQL in the user prompt","Install an MCP server for Postgres and add it to mcpServers config","Give Claude the database password in the system prompt","Use the built-in Bash tool to run psql commands"],"correct":1,"explanation":"A Postgres MCP server provides structured database tools (query, inspect schema, etc.) with proper connection management. This is safer and more reliable than raw Bash commands."},{"q":"An MCP server starts but its tools keep failing silently. What should you check first?","options":["The Claude model version","The environment variables and credentials passed to the server","The system prompt","The network speed"],"correct":1,"explanation":"Silent tool failures usually mean missing or incorrect credentials. MCP servers need API tokens and connection strings passed via the env option in the server configuration."},{"q":"Why should you limit the number of MCP servers connected to a single agent?","options":["Each server costs extra money","Too many tools can confuse Claude about which one to use","MCP has a maximum of 3 servers","They slow down the computer"],"correct":1,"explanation":"Each MCP server adds tools to Claude context. With too many tools available, Claude may struggle to choose the right one or get confused about tool capabilities. Start with 1-2 servers and add more only as needed."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 5 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
