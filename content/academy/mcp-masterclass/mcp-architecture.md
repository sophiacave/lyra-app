---
title: "MCP Architecture"
course: "mcp-masterclass"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 2</div>
  <h1>MCP Architecture</h1>
  <p class="subtitle">Three components, one protocol. Understand how Hosts, Clients, and Servers form the MCP communication layer.</p>

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

  <div data-learn="FlashDeck" data-props='{"title":"MCP Architecture Concepts","cards":[{"front":"Host","back":"The AI application the user interacts with — Claude Desktop, Claude Code, or a custom SDK app. Contains one or more MCP Clients."},{"front":"MCP Client","back":"A protocol bridge inside the Host that maintains a 1:1 connection with a single MCP Server. Handles negotiation and message routing."},{"front":"MCP Server","back":"A lightweight program that exposes tools, resources, or prompts to the AI through the MCP protocol."},{"front":"JSON-RPC","back":"The message format used for communication between MCP Client and Server. Structured as method calls with parameters and responses."},{"front":"Data Flow","back":"User asks a question, Host identifies a tool is needed, Client sends tools/call to Server, Server executes and returns data, Host generates an informed answer."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Architecture Check","questions":[{"q":"Which MCP component is responsible for maintaining a 1:1 connection with a single MCP Server?","options":["Host","MCP Client","MCP Server","Transport Layer"],"correct":1,"explanation":"The MCP Client lives inside the Host and maintains a 1:1 connection with one MCP Server. It handles protocol negotiation, capability exchange, and message routing."},{"q":"What protocol does the MCP Client use to communicate with the MCP Server?","options":["REST","GraphQL","JSON-RPC","gRPC"],"correct":2,"explanation":"MCP uses JSON-RPC (JSON Remote Procedure Call) for communication between the MCP Client and MCP Server."}]}'></div>
</div>
