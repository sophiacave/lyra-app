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
    <p>Click each component to explore what it does in the MCP architecture:</p>

    <div class="component-cards">
      <div class="comp-card host active" onclick="showComponent('host')">
        <div class="icon">&#x1F9E0;</div>
        <h3>Host</h3>
        <p>Claude, ChatGPT, or any LLM application</p>
      </div>
      <div class="comp-card client" onclick="showComponent('client')">
        <div class="icon">&#x1F310;</div>
        <h3>MCP Client</h3>
        <p>The bridge between Host and Server</p>
      </div>
      <div class="comp-card server" onclick="showComponent('server')">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>MCP Server</h3>
        <p>Your tool or data source</p>
      </div>
    </div>

    <div class="detail-panel" id="detailPanel">
      <h3 id="detailTitle" style="color:#8b5cf6">Host Application</h3>
      <p id="detailDesc">The Host is the AI application the user interacts with — like Claude Desktop, Claude Code, or a custom app built with the Anthropic SDK. The Host initiates MCP connections and decides which servers to connect to. It contains one or more MCP Clients.</p>
      <p id="detailRole"><strong>Role:</strong> Receives user input, decides when tools are needed, orchestrates the overall interaction.</p>
      <div class="examples" id="detailExamples">
        <span class="example-tag">Claude Desktop</span>
        <span class="example-tag">Claude Code</span>
        <span class="example-tag">Custom SDK apps</span>
        <span class="example-tag">IDE extensions</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Architecture Diagram</h2>
    <p>Watch how data flows through the MCP architecture:</p>
    <div class="arch-canvas">
      <canvas id="archCanvas"></canvas>
    </div>
  </div>

  <div class="section">
    <h2>Data Flow — Step by Step</h2>
    <p>Click play to animate the request lifecycle, or click individual steps:</p>
    <button class="play-btn" id="playBtn" onclick="playFlow()">&#x25B6; Play Animation</button>

    <div class="flow-steps" id="flowSteps">
      <div class="flow-step active" onclick="setStep(0)">
        <div class="step-num">1</div>
        <div class="step-text"><strong>User asks a question</strong><span>"What files are in my project directory?"</span></div>
      </div>
      <div class="flow-arrow" id="arrow0">&darr;</div>
      <div class="flow-step" onclick="setStep(1)">
        <div class="step-num">2</div>
        <div class="step-text"><strong>Host realizes it needs external data</strong><span>The LLM sees available tools and decides to use the filesystem tool</span></div>
      </div>
      <div class="flow-arrow" id="arrow1">&darr;</div>
      <div class="flow-step" onclick="setStep(2)">
        <div class="step-num">3</div>
        <div class="step-text"><strong>Client sends request to Server</strong><span>MCP Client sends a tools/call request via JSON-RPC to the filesystem server</span></div>
      </div>
      <div class="flow-arrow" id="arrow2">&darr;</div>
      <div class="flow-step" onclick="setStep(3)">
        <div class="step-num">4</div>
        <div class="step-text"><strong>Server executes and returns data</strong><span>Filesystem server reads the directory and returns the file listing</span></div>
      </div>
      <div class="flow-arrow" id="arrow3">&darr;</div>
      <div class="flow-step" onclick="setStep(4)">
        <div class="step-num">5</div>
        <div class="step-text"><strong>Host generates an informed answer</strong><span>The LLM uses the real file data to respond accurately to the user</span></div>
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
