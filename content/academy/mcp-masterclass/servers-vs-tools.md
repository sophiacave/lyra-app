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
        <div class="comp-cell"><strong>Transport</strong>Communicates over stdio (local) or Streamable HTTP (remote).</div>
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

  <div class="section">
    <h2>See the Difference in Code</h2>
    <p>Here is the same capability — letting AI read a file — implemented as a direct tool call versus an MCP server tool. Notice how the MCP version is standardized and self-documenting:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div>
        <div class="code-block">
          <div class="code-header"><span class="filename">Direct Tool Call (OpenAI-style)</span><span class="lang">JSON</span></div>
          <div class="code-body"><span class="cm">// Vendor-specific format</span>
<span class="cm">// Different for every AI provider</span>
{
  <span class="key">"type"</span>: <span class="str">"function"</span>,
  <span class="key">"function"</span>: {
    <span class="key">"name"</span>: <span class="str">"read_file"</span>,
    <span class="key">"parameters"</span>: {
      <span class="key">"type"</span>: <span class="str">"object"</span>,
      <span class="key">"properties"</span>: {
        <span class="key">"path"</span>: {
          <span class="key">"type"</span>: <span class="str">"string"</span>
        }
      }
    }
  }
}</div>
        </div>
        <p style="font-size:.8rem;color:#71717a;margin-top:.5rem">You define the schema. You parse the call. You execute the function. You return the result. Different format for each AI provider.</p>
      </div>
      <div>
        <div class="code-block">
          <div class="code-header"><span class="filename">MCP Server Tool</span><span class="lang">TypeScript</span></div>
          <div class="code-body"><span class="cm">// Universal MCP standard</span>
<span class="cm">// Works with ANY MCP client</span>
server.tool(
  <span class="str">"read_file"</span>,
  {
    path: z.string()
      .describe(<span class="str">"File path to read"</span>),
  },
  <span class="kw">async</span> ({ path }) => ({
    content: [{
      type: <span class="str">"text"</span>,
      text: readFileSync(path, <span class="str">"utf-8"</span>),
    }],
  })
);</div>
        </div>
        <p style="font-size:.8rem;color:#71717a;margin-top:.5rem">The SDK handles protocol, validation, and transport. Your code is just the business logic. Works with Claude, VS Code, Cursor — any MCP client.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>When to Build a Server vs Use Direct Tool Calling</h2>
    <div style="display:flex;flex-direction:column;gap:.5rem">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.85rem;min-width:120px">Build a Server</span>
        <span style="font-size:.85rem;color:#a1a1aa">When you want the tool to work across multiple AI clients, when you need persistent state (DB connections, sessions), or when you want automatic tool discovery.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="color:#fb923c;font-weight:700;font-size:.85rem;min-width:120px">Use Direct Calls</span>
        <span style="font-size:.85rem;color:#a1a1aa">When you are building a one-off integration for a single app, when you only need one or two simple functions, or when you are locked into a specific AI provider's SDK.</span>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Servers vs Tools Quiz","questions":[{"q":"Which statement correctly describes how an MCP Server differs from a direct tool call?","options":["A server is faster but less reliable","A server is long-running, exposes multiple tools, and maintains state","A server only works with Claude Desktop","There is no meaningful difference"],"correct":1,"explanation":"MCP Servers are persistent processes that expose multiple tools, maintain state (like open DB connections), and support automatic tool discovery. Direct tool calls are one-off and stateless."},{"q":"What transport protocols does MCP use?","options":["REST and GraphQL","HTTP-only over port 443","stdio and HTTP with Server-Sent Events (SSE)","TCP sockets and WebSockets"],"correct":2,"explanation":"MCP supports stdio (standard input/output, ideal for local servers) and HTTP with SSE for remote servers."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Server Types Flash Review","cards":[{"front":"Filesystem Server","back":"Exposes read_file, write_file, list_directory, search_files. Gives AI controlled access to local or remote files."},{"front":"Database Server","back":"Exposes query, insert, update, list_tables. Maintains a persistent connection pool so Claude can query data without re-connecting each time."},{"front":"Browser Server","back":"Exposes navigate, screenshot, click, type, get_text. Powered by Puppeteer or Playwright for full web automation."},{"front":"Memory Server","back":"Exposes store_memory, recall, search_memory, create_relation. Persists knowledge across sessions in a knowledge graph."},{"front":"Search Server","back":"Exposes web_search, search_docs, search_code, search_news. Connects AI to live search engines and documentation indices."}]}'></div>


</div>
