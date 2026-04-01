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

  <div data-learn="FlashDeck" data-props='{"title":"MCP Architecture Concepts","cards":[{"front":"Host","back":"The AI application the user interacts with — Claude Desktop, Claude Code, or a custom SDK app. Contains one or more MCP Clients."},{"front":"MCP Client","back":"A protocol bridge inside the Host that maintains a 1:1 connection with a single MCP Server. Handles negotiation and message routing."},{"front":"MCP Server","back":"A lightweight program that exposes tools, resources, or prompts to the AI through the MCP protocol."},{"front":"JSON-RPC","back":"The message format used for communication between MCP Client and Server. Structured as method calls with parameters and responses."},{"front":"Data Flow","back":"User asks a question, Host identifies a tool is needed, Client sends tools/call to Server, Server executes and returns data, Host generates an informed answer."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Architecture Check","questions":[{"q":"Which MCP component is responsible for maintaining a 1:1 connection with a single MCP Server?","options":["Host","MCP Client","MCP Server","Transport Layer"],"correct":1,"explanation":"The MCP Client lives inside the Host and maintains a 1:1 connection with one MCP Server. It handles protocol negotiation, capability exchange, and message routing."},{"q":"What protocol does the MCP Client use to communicate with the MCP Server?","options":["REST","GraphQL","JSON-RPC","gRPC"],"correct":2,"explanation":"MCP uses JSON-RPC (JSON Remote Procedure Call) for communication between the MCP Client and MCP Server."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Put the Data Flow in Order","instruction":"Arrange these steps in the correct order for an MCP request","items":["User asks a question","Host identifies a tool is needed","MCP Client sends tools/call to Server","Server executes and returns data","Host generates an informed answer"]}'></div>


</div>
