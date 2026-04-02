---
title: "MCP Architecture"
course: "mcp-masterclass"
order: 2
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/mcp-masterclass/">MCP Masterclass</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>MCP Architecture</h1>
  <p class="sub">Three components, one protocol. Understand how Hosts, Clients, and Servers form the MCP communication layer.</p>
</div>

  <div class="section">
    <h2>The Three Components</h2>
    <p>MCP has three components that work together:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">&#x1F9E0; Host Application</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The AI application the user interacts with — like Claude Desktop, Claude Code, or a custom app built with the Anthropic SDK. The Host initiates MCP connections and decides which servers to connect to. It contains one or more MCP Clients.</p>
        <p style="font-size:.82rem;color:#71717a;margin-top:.4rem"><strong>Role:</strong> Receives user input, decides when tools are needed, orchestrates the overall interaction.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">&#x1F310; MCP Client</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A protocol bridge inside the Host that maintains a 1:1 connection with a single MCP Server. Each Client handles negotiation, capability exchange, and message routing for its server.</p>
        <p style="font-size:.82rem;color:#71717a;margin-top:.4rem"><strong>Role:</strong> Translates between the Host's internal format and the MCP protocol. One Client per Server connection.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">&#x2699;&#xFE0F; MCP Server</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A lightweight program that exposes tools, resources, or prompts to the AI through the MCP protocol. Servers are where the business logic lives — reading files, querying databases, calling APIs.</p>
        <p style="font-size:.82rem;color:#71717a;margin-top:.4rem"><strong>Role:</strong> Receives tool calls from the Client, executes them, and returns results.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Data Flow — Step by Step</h2>
    <p>Here is the complete request lifecycle when a user asks a question that requires external data:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <span style="font-weight:700;color:#8b5cf6;font-size:1rem;min-width:24px">1</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">User asks a question</strong> — "What files are in my project directory?"</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:1rem;min-width:24px">2</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Host realizes it needs external data</strong> — The LLM sees available tools and decides to use the filesystem tool.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:1rem;min-width:24px">3</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Client sends request to Server</strong> — MCP Client sends a tools/call request via JSON-RPC to the filesystem server.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <span style="font-weight:700;color:#38bdf8;font-size:1rem;min-width:24px">4</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Server executes and returns data</strong> — Filesystem server reads the directory and returns the file listing.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <span style="font-weight:700;color:#f472b6;font-size:1rem;min-width:24px">5</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Host generates an informed answer</strong> — The LLM uses the real file data to respond accurately to the user.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Why JSON-RPC?</h2>
    <p>MCP uses JSON-RPC instead of REST, GraphQL, or gRPC. Here is why:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">JSON-RPC is method-based, not URL-based.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">REST maps operations to URLs and HTTP verbs (<code>GET /tools</code>, <code>POST /tools/call</code>). JSON-RPC uses a single channel with method names (<code>{"method": "tools/call"}</code>). This works over any transport — stdio pipes, WebSockets, HTTP — without needing URL routing.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">It works over stdio.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Local MCP servers communicate through stdin/stdout — no network stack needed. REST requires an HTTP server, a port, and URL parsing. JSON-RPC is just JSON messages on a stream, making local servers trivially simple to build.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Bidirectional by design.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">JSON-RPC supports both request/response AND notifications (one-way messages). This lets servers send progress updates, log events, or signal resource changes back to the client without being asked. REST is strictly request/response.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Transport Layer</h2>
    <p>MCP supports two transport mechanisms. The transport is separate from the protocol — the same server code works with either:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">stdio (Local Servers)</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Claude launches the server as a child process. Messages flow through stdin/stdout. <strong>Zero configuration</strong> — no ports, no TLS, no firewall rules. Ideal for personal tools and local development.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Streamable HTTP (Remote Servers)</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">The server runs on a remote machine and exposes an HTTP endpoint. Uses Server-Sent Events (SSE) for streaming responses. Required for team-shared servers, cloud deployments, and multi-user setups.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Capability Negotiation</h2>
    <p>Before any tools are called or resources accessed, the Client and Server perform an <strong style="color:#e5e5e5">initialize handshake</strong>. This is the first message in every MCP connection — nothing else can happen until it completes.</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Step 1 — Client sends <code>initialize</code> request</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The Client tells the Server which protocol version it supports and what capabilities it has (like <code>roots</code> for filesystem access or <code>sampling</code> for LLM inference). This lets the Server know what it can ask the Client to do.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Step 2 — Server responds with its capabilities</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The Server declares exactly what it supports: <code>tools</code> (callable functions), <code>resources</code> (data the AI can read), and <code>prompts</code> (reusable prompt templates). It also confirms the protocol version it will use. If the versions are incompatible, the connection fails gracefully.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Step 3 — Client sends <code>initialized</code> notification</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Once the Client processes the Server's capabilities, it sends an <code>initialized</code> notification (a one-way message, no response expected). Only after this notification can the Client begin calling tools or reading resources.</p>
      </div>
    </div>

    <p style="margin-top:1rem">Here is what the initialize handshake looks like on the wire:</p>

    <div style="margin:1rem 0">
      <div style="font-size:.75rem;color:#71717a;padding:.4rem .75rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-bottom:none;border-radius:8px 8px 0 0;font-family:'JetBrains Mono',monospace">Client → Server: initialize request</div>
      <pre style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:0 0 8px 8px;padding:1rem;margin:0;overflow-x:auto;font-size:.8rem;line-height:1.5"><code style="font-family:'JetBrains Mono',monospace;color:#e5e5e5">{
  <span style="color:#8b5cf6">"jsonrpc"</span>: <span style="color:#34d399">"2.0"</span>,
  <span style="color:#8b5cf6">"id"</span>: <span style="color:#fb923c">1</span>,
  <span style="color:#8b5cf6">"method"</span>: <span style="color:#34d399">"initialize"</span>,
  <span style="color:#8b5cf6">"params"</span>: {
    <span style="color:#8b5cf6">"protocolVersion"</span>: <span style="color:#34d399">"2025-03-26"</span>,
    <span style="color:#8b5cf6">"capabilities"</span>: {
      <span style="color:#8b5cf6">"roots"</span>: { <span style="color:#8b5cf6">"listChanged"</span>: <span style="color:#fb923c">true</span> },
      <span style="color:#8b5cf6">"sampling"</span>: {}
    },
    <span style="color:#8b5cf6">"clientInfo"</span>: {
      <span style="color:#8b5cf6">"name"</span>: <span style="color:#34d399">"Claude Desktop"</span>,
      <span style="color:#8b5cf6">"version"</span>: <span style="color:#34d399">"1.5.0"</span>
    }
  }
}</code></pre>
    </div>

    <div style="margin:1rem 0">
      <div style="font-size:.75rem;color:#71717a;padding:.4rem .75rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-bottom:none;border-radius:8px 8px 0 0;font-family:'JetBrains Mono',monospace">Server → Client: initialize response</div>
      <pre style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:0 0 8px 8px;padding:1rem;margin:0;overflow-x:auto;font-size:.8rem;line-height:1.5"><code style="font-family:'JetBrains Mono',monospace;color:#e5e5e5">{
  <span style="color:#8b5cf6">"jsonrpc"</span>: <span style="color:#34d399">"2.0"</span>,
  <span style="color:#8b5cf6">"id"</span>: <span style="color:#fb923c">1</span>,
  <span style="color:#8b5cf6">"result"</span>: {
    <span style="color:#8b5cf6">"protocolVersion"</span>: <span style="color:#34d399">"2025-03-26"</span>,
    <span style="color:#8b5cf6">"capabilities"</span>: {
      <span style="color:#8b5cf6">"tools"</span>: { <span style="color:#8b5cf6">"listChanged"</span>: <span style="color:#fb923c">true</span> },
      <span style="color:#8b5cf6">"resources"</span>: { <span style="color:#8b5cf6">"subscribe"</span>: <span style="color:#fb923c">true</span> },
      <span style="color:#8b5cf6">"prompts"</span>: { <span style="color:#8b5cf6">"listChanged"</span>: <span style="color:#fb923c">true</span> }
    },
    <span style="color:#8b5cf6">"serverInfo"</span>: {
      <span style="color:#8b5cf6">"name"</span>: <span style="color:#34d399">"filesystem-server"</span>,
      <span style="color:#8b5cf6">"version"</span>: <span style="color:#34d399">"0.3.1"</span>
    }
  }
}</code></pre>
    </div>

    <p style="font-size:.85rem;color:#a1a1aa">Notice the Server declares it supports <code>tools</code>, <code>resources</code>, and <code>prompts</code>. The <code>listChanged</code> flag means the Server can notify the Client if its available tools change at runtime — enabling dynamic tool discovery without reconnecting.</p>
  </div>

  <div class="section">
    <h2>What Happens When Something Goes Wrong</h2>
    <p>The protocol has built-in error handling for every failure mode:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#ef4444;font-weight:700;font-size:.85rem;min-width:130px">Server crashes</span>
        <span style="font-size:.85rem;color:#a1a1aa">The Client detects the broken pipe and reports to the Host. Claude tells the user the tool is unavailable. No silent failures.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#ef4444;font-weight:700;font-size:.85rem;min-width:130px">Invalid arguments</span>
        <span style="font-size:.85rem;color:#a1a1aa">The MCP SDK validates inputs against your Zod schema before calling your handler. Invalid calls are rejected with a clear error — your code never sees bad data.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#ef4444;font-weight:700;font-size:.85rem;min-width:130px">Handler throws</span>
        <span style="font-size:.85rem;color:#a1a1aa">If your tool handler throws an unhandled exception, the SDK catches it and returns a JSON-RPC error response. The server stays running.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#ef4444;font-weight:700;font-size:.85rem;min-width:130px">Version mismatch</span>
        <span style="font-size:.85rem;color:#a1a1aa">During <code>initialize</code>, client and server exchange protocol versions. If incompatible, the connection is rejected gracefully with a clear message.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Architecture in Practice: A Real Example</h2>
    <p>Theory makes more sense with a concrete scenario. Here is how Claude Desktop looks when connected to three MCP servers — a common real-world setup for a developer:</p>

    <div style="margin:1.25rem 0;padding:1.25rem;border-radius:12px;background:rgba(139,92,246,.03);border:1px solid rgba(139,92,246,.08)">
      <div style="text-align:center;margin-bottom:1rem">
        <strong style="color:#8b5cf6;font-size:.95rem">Claude Desktop (Host)</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">Contains 3 MCP Clients — one per server connection</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem">
        <div style="padding:.85rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);text-align:center">
          <strong style="color:#34d399;font-size:.8rem">Client A</strong>
          <div style="font-size:1.2rem;margin:.4rem 0">&#x2195;</div>
          <div style="padding:.65rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
            <strong style="color:#fb923c;font-size:.78rem">Filesystem Server</strong>
            <p style="font-size:.72rem;color:#71717a;margin:.3rem 0 0">stdio transport<br/>Tools: read_file, write_file, list_directory, search_files</p>
          </div>
        </div>
        <div style="padding:.85rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);text-align:center">
          <strong style="color:#34d399;font-size:.8rem">Client B</strong>
          <div style="font-size:1.2rem;margin:.4rem 0">&#x2195;</div>
          <div style="padding:.65rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
            <strong style="color:#fb923c;font-size:.78rem">GitHub Server</strong>
            <p style="font-size:.72rem;color:#71717a;margin:.3rem 0 0">stdio transport<br/>Tools: create_issue, search_repos, create_pr, list_commits</p>
          </div>
        </div>
        <div style="padding:.85rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);text-align:center">
          <strong style="color:#34d399;font-size:.8rem">Client C</strong>
          <div style="font-size:1.2rem;margin:.4rem 0">&#x2195;</div>
          <div style="padding:.65rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
            <strong style="color:#fb923c;font-size:.78rem">Database Server</strong>
            <p style="font-size:.72rem;color:#71717a;margin:.3rem 0 0">Streamable HTTP<br/>Tools: query, list_tables<br/>Resources: schema://tables</p>
          </div>
        </div>
      </div>
    </div>

    <p style="font-size:.85rem;color:#a1a1aa">Key things to notice in this architecture:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <span style="color:#38bdf8;font-weight:700;font-size:.85rem;min-width:24px">1</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">One Client per Server.</strong> Client A only talks to the Filesystem Server. It knows nothing about GitHub or the database. Each connection is isolated.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <span style="color:#38bdf8;font-weight:700;font-size:.85rem;min-width:24px">2</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Mixed transports.</strong> The Filesystem and GitHub servers use stdio (local processes). The Database server uses Streamable HTTP (remote, shared with the team). The Host handles both transparently.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <span style="color:#38bdf8;font-weight:700;font-size:.85rem;min-width:24px">3</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">The Host sees all tools.</strong> Even though tools come from different servers, the LLM sees a unified tool list. When it decides to call <code>search_files</code>, the Host routes the call to Client A, which forwards it to the Filesystem Server. The LLM does not need to know which server provides which tool.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <span style="color:#38bdf8;font-weight:700;font-size:.85rem;min-width:24px">4</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Each connection negotiated independently.</strong> Client C's Database Server declared <code>resources</code> capability (exposing database schemas as readable resources). Clients A and B did not — their servers only expose tools. The Host adapts to each server's capabilities.</span>
      </div>
    </div>

    <p style="font-size:.85rem;color:#a1a1aa">This is the power of MCP's architecture — the protocol handles all the complexity of multiple connections, different transports, and varying capabilities. You configure which servers to connect to, and the Host handles the rest.</p>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"MCP Architecture Concepts","cards":[{"front":"Host","back":"The AI application the user interacts with — Claude Desktop, Claude Code, or a custom SDK app. Contains one or more MCP Clients."},{"front":"MCP Client","back":"A protocol bridge inside the Host that maintains a 1:1 connection with a single MCP Server. Handles negotiation and message routing."},{"front":"MCP Server","back":"A lightweight program that exposes tools, resources, or prompts to the AI through the MCP protocol."},{"front":"JSON-RPC","back":"The message format used for communication between MCP Client and Server. Structured as method calls with parameters and responses."},{"front":"Data Flow","back":"User asks a question, Host identifies a tool is needed, Client sends tools/call to Server, Server executes and returns data, Host generates an informed answer."},{"front":"Initialize Handshake","back":"The first message in every MCP connection. The Client sends an initialize request with its protocol version and capabilities. The Server responds with its own capabilities (tools, resources, prompts). The Client then sends an initialized notification to complete the handshake."},{"front":"Capability Negotiation","back":"During initialize, the Server declares what it supports — tools (callable functions), resources (readable data), and prompts (reusable templates). The Client declares its capabilities too, like roots (filesystem access) and sampling (LLM inference)."},{"front":"listChanged Flag","back":"A capability flag that indicates a Server can notify the Client when its available tools, resources, or prompts change at runtime — enabling dynamic discovery without reconnecting."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Architecture Check","questions":[{"q":"Which MCP component is responsible for maintaining a 1:1 connection with a single MCP Server?","options":["Host","MCP Client","MCP Server","Transport Layer"],"correct":1,"explanation":"The MCP Client lives inside the Host and maintains a 1:1 connection with one MCP Server. It handles protocol negotiation, capability exchange, and message routing."},{"q":"What protocol does the MCP Client use to communicate with the MCP Server?","options":["REST","GraphQL","JSON-RPC","gRPC"],"correct":2,"explanation":"MCP uses JSON-RPC (JSON Remote Procedure Call) for communication between the MCP Client and MCP Server."},{"q":"What must happen before a Client can call any tools on a Server?","options":["The Client must authenticate with an API key","The initialize handshake must complete, ending with an initialized notification","The Server must be registered in a central registry","The Host must restart"],"correct":1,"explanation":"The initialize handshake is mandatory. The Client sends initialize, the Server responds with its capabilities, and the Client sends an initialized notification. Only after this sequence can tools be called."},{"q":"In a setup where Claude Desktop is connected to 3 MCP servers, how many MCP Clients exist inside the Host?","options":["1 — the Host has a single Client that manages all servers","3 — one Client per Server connection","It depends on the transport type","None — the Host communicates directly with servers"],"correct":1,"explanation":"MCP uses a 1:1 relationship between Clients and Servers. If the Host is connected to 3 servers, it contains 3 separate MCP Clients, each managing one connection."}]}'></div>
</div>
