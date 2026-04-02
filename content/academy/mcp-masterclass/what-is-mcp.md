---
title: "What Is MCP?"
course: "mcp-masterclass"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/mcp-masterclass/">MCP Masterclass</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>What Is MCP?</h1>
  <p class="sub">Model Context Protocol is the USB standard for AI. It is how AI goes from answering questions to actually doing things — reading your files, checking your calendar, sending emails, managing code.</p>
</div>

  <div class="section">
    <h2>The Problem: Isolated AI</h2>
    <p>Without MCP, every AI model is an island. It can only work with what is in its training data or what you paste into the chat. It cannot read your files, query your database, or call your APIs. Every integration is custom, fragile, and different.</p>
    <p>Compare how AI integrations work without and with MCP:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Without MCP</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Every AI-tool connection is a custom integration. A GitHub tool built for ChatGPT does not work with Claude. A database connector for Cursor does not work with VS Code. N tools times M clients = N x M custom integrations.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">With MCP</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">One universal protocol. Build a GitHub MCP server once and it works with Claude, VS Code, Cursor, and any other MCP client. N tools + M clients = N + M implementations. The protocol handles compatibility.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The USB Analogy</h2>
    <p>Before USB, every device had its own proprietary connector. Printers, keyboards, cameras — all different. USB created one standard, and everything just worked. MCP does the same for AI.</p>

    <div class="analogy-grid">
      <div class="analogy-card usb">
        <h3>&#x1F50C; Before USB</h3>
        <p>Serial ports, parallel ports, PS/2, proprietary connectors. Every device needed a unique cable and driver. Nothing was interchangeable.</p>
      </div>
      <div class="analogy-card mcp">
        <h3>&#x1F9E0; Before MCP</h3>
        <p>Custom API wrappers, function calling schemas, bespoke integrations. Every AI-tool connection was hand-built. Nothing was standardized.</p>
      </div>
      <div class="analogy-card usb">
        <h3>&#x1F50C; After USB</h3>
        <p>One port, one protocol. Plug in any device and it works. The standard handles discovery, communication, and power delivery.</p>
      </div>
      <div class="analogy-card mcp">
        <h3>&#x1F9E0; After MCP</h3>
        <p>One protocol for all AI tools. Any MCP server works with any MCP client. The standard handles tool discovery, invocation, and data flow.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Why Did Anthropic Create MCP?</h2>
    <p>Before MCP, AI providers each had their own way of connecting to tools. OpenAI had function calling. Google had extensions. Anthropic had tool use. They all worked, but they were all different — if you built a GitHub integration for one, you had to rebuild it from scratch for another.</p>

    <p>Anthropic created MCP as an <strong>open standard</strong> to fix this fragmentation. The key design decisions:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Open, not proprietary.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">MCP is not locked to Claude. Any AI model, any provider can implement it. The spec is public. This means tools built for Claude also work with any other MCP-compatible client.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Build once, connect everywhere.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A single MCP server works with Claude Desktop, Claude Code, VS Code Copilot, Cursor, and any other MCP client. No adapters, no rewrites. The protocol handles compatibility.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Security by design.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">MCP separates the AI model from the tool execution. The model never has direct access to your database or files — it sends structured requests through the protocol, and the server decides what to allow. This is fundamentally safer than giving AI raw API keys.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>What Does an MCP Server Look Like?</h2>
    <p>At its core, an MCP server is just a few lines of code. You create a server, register tools, and start listening. Here is a minimal example:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — minimal MCP server with one tool</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { McpServer } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"@modelcontextprotocol/sdk/server/mcp.js"</span>;
<span style="color:#c084fc">import</span> { StdioServerTransport } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"@modelcontextprotocol/sdk/server/stdio.js"</span>;
<span style="color:#c084fc">import</span> { z } <span style="color:#c084fc">from</span> <span style="color:#fb923c">"zod"</span>;

<span style="color:#71717a">// 1. Create the server</span>
<span style="color:#c084fc">const</span> server = <span style="color:#c084fc">new</span> <span style="color:#34d399">McpServer</span>({
  name: <span style="color:#fb923c">"my-first-server"</span>,
  version: <span style="color:#fb923c">"1.0.0"</span>,
});

<span style="color:#71717a">// 2. Register a tool</span>
server.<span style="color:#34d399">tool</span>(
  <span style="color:#fb923c">"greet"</span>,
  <span style="color:#fb923c">"Say hello to someone"</span>,
  { name: z.<span style="color:#34d399">string</span>().<span style="color:#34d399">describe</span>(<span style="color:#fb923c">"Name to greet"</span>) },
  <span style="color:#c084fc">async</span> ({ name }) => ({
    content: [{ type: <span style="color:#fb923c">"text"</span>, text: <span style="color:#fb923c">`Hello, ${name}!`</span> }],
  })
);

<span style="color:#71717a">// 3. Start listening</span>
<span style="color:#c084fc">const</span> transport = <span style="color:#c084fc">new</span> <span style="color:#34d399">StdioServerTransport</span>();
<span style="color:#c084fc">await</span> server.<span style="color:#34d399">connect</span>(transport);</code></pre>
</div>

    <p style="font-size:.85rem;color:#a1a1aa;margin-top:.5rem">That is a complete, working MCP server. When Claude connects to it, it automatically discovers the <code>greet</code> tool, knows what arguments it accepts, and can call it. You will build servers like this from scratch later in the course.</p>
  </div>

  <div class="section">
    <h2>What Can AI Do With MCP?</h2>
    <p>MCP transforms AI from a question-answering machine into an action-taking assistant. Here are real examples of what becomes possible:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <strong style="font-size:.85rem;color:#e2e8f0">&#x1F4C1; Read and write files</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">"Search my project for all TODO comments and create a summary."</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <strong style="font-size:.85rem;color:#e2e8f0">&#x1F4BE; Query databases</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">"How many new users signed up this week? Show me the trend."</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <strong style="font-size:.85rem;color:#e2e8f0">&#x1F4BB; Manage code</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">"Create a PR that fixes the bug in issue #42 and tag the reviewer."</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <strong style="font-size:.85rem;color:#e2e8f0">&#x1F4AC; Send messages</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">"Post the standup summary to #engineering in Slack."</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <strong style="font-size:.85rem;color:#e2e8f0">&#x1F310; Browse the web</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">"Check our pricing page and tell me if the new tier is live."</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <strong style="font-size:.85rem;color:#e2e8f0">&#x1F9E0; Remember context</strong>
        <p style="font-size:.8rem;color:#71717a;margin:.25rem 0 0">"Remember that we decided to use PostgreSQL for the analytics DB."</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Key Takeaways</h2>
    <div class="key-points">
      <div class="key-point">
        <div class="icon">&#x1F310;</div>
        <div class="text"><strong>MCP = Model Context Protocol.</strong> An open standard created by Anthropic that defines how AI models communicate with external tools and data sources.</div>
      </div>
      <div class="key-point">
        <div class="icon">&#x1F50C;</div>
        <div class="text"><strong>It is a universal connector.</strong> Just as USB standardized hardware connections, MCP standardizes AI-to-tool connections. Build once, work everywhere.</div>
      </div>
      <div class="key-point">
        <div class="icon">&#x26A1;</div>
        <div class="text"><strong>It makes AI actionable.</strong> Without MCP, AI can only talk. With MCP, AI can read files, query databases, manage repos, send messages, and more.</div>
      </div>
      <div class="key-point">
        <div class="icon">&#x1F6E1;</div>
        <div class="text"><strong>Security is built in.</strong> The AI never has direct access to your systems. It sends structured requests through the protocol, and the server controls what is allowed.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>MCP vs Other Approaches</h2>
    <p>MCP is not the first attempt to connect AI to external tools. But it solves problems that earlier approaches left open. Here is how it compares:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Direct API Calls</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The oldest approach: write custom HTTP calls for every tool you want AI to use. Each integration is unique — different auth patterns, different payloads, different error handling. Nothing is reusable. When the API changes, your integration breaks. MCP replaces this with a single protocol that handles discovery, invocation, and data flow automatically.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">OpenAI Function Calling</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">OpenAI introduced function calling to let GPT models invoke structured tools. It works well — but only inside OpenAI's ecosystem. Tools you define for GPT cannot be reused with Claude, Gemini, or open-source models. MCP is provider-agnostic: a server built once works with every MCP-compatible client, regardless of which AI model powers it.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">LangChain Tools</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">LangChain provides a rich library of tool integrations for Python developers. But it is a framework, not a protocol. Your tools are tied to LangChain's abstractions and runtime. If you switch frameworks or want to use tools outside Python, you start over. MCP operates at the protocol level — any language, any framework, any client can participate.</p>
      </div>
    </div>

    <p style="font-size:.85rem;color:#a1a1aa;margin-top:.5rem">The pattern is clear: previous approaches tied tool integrations to a specific vendor, framework, or language. MCP breaks that lock-in by defining a universal protocol that any tool and any AI client can speak.</p>
  </div>

  <div class="section">
    <h2>Course Roadmap</h2>
    <p>By the end of this course, you will be able to:</p>
    <div style="display:flex;flex-direction:column;gap:.4rem;margin:.75rem 0">
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Explain MCP architecture (Hosts, Clients, Servers) and how data flows</div>
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Build a working MCP server from scratch in TypeScript</div>
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Define tools with proper schemas that Claude uses correctly</div>
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Use Resources and Prompts to give AI context and structured workflows</div>
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Connect your server to Claude Desktop and Claude Code</div>
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Apply security best practices for production deployment</div>
      <div style="font-size:.85rem;color:#a1a1aa">&#x2705; Recognize and implement six real-world server patterns</div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Check Your Understanding","questions":[{"q":"What does MCP stand for?","options":["Machine Connection Protocol","Model Context Protocol","Multi-Channel Platform","Module Computation Pipeline"],"correct":1,"explanation":"MCP stands for Model Context Protocol — an open standard by Anthropic for connecting AI models to external tools and data sources."},{"q":"Which analogy best describes what MCP does for AI?","options":["It is like a firewall protecting AI from external threats","It is like USB — a universal standard that lets AI connect to any tool","It is like a database that stores AI training data","It is like a browser extension that adds features to Claude"],"correct":1,"explanation":"MCP is like USB: before it, every AI-tool connection was custom and fragile. MCP creates one standard so any server works with any client."},{"q":"Why did Anthropic make MCP an open standard instead of a Claude-only feature?","options":["It was required by law","So tools built once work with any AI client, not just Claude","Because open source is always better","To reduce their development costs"],"correct":1,"explanation":"By making MCP open, tools built for Claude also work with VS Code Copilot, Cursor, and any other MCP client. This creates a larger ecosystem and makes every tool more valuable."},{"q":"What is the main advantage of MCP over OpenAI Function Calling and LangChain tools?","options":["MCP is faster at executing tool calls","MCP is provider-agnostic — it works across any AI client and any language","MCP has more pre-built integrations than LangChain","MCP does not require any code to set up"],"correct":1,"explanation":"OpenAI Function Calling only works with GPT models and LangChain tools are tied to its Python framework. MCP is a universal protocol: build a server once and it works with Claude, VS Code, Cursor, and any MCP-compatible client regardless of provider or language."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"MCP Vocabulary","cards":[{"front":"Model Context Protocol","back":"An open standard by Anthropic that defines how AI models communicate with external tools, files, and data sources. Any MCP server works with any MCP client."},{"front":"Why was MCP created?","back":"Before MCP every integration was custom and fragile. MCP standardizes AI-to-tool connections so you build once and it works everywhere — across Claude, VS Code, Cursor, and more."},{"front":"What can AI do WITH MCP that it cannot do without it?","back":"Read files, query databases, call APIs, send messages, manage code repos, browse the web, and take real-world actions beyond just answering questions."},{"front":"MCP security model","back":"The AI never has direct access to your systems. It sends structured requests through the protocol. The MCP server controls what is allowed, acting as a security boundary."},{"front":"MCP ecosystem","back":"Any MCP server works with any MCP-compatible client: Claude Desktop, Claude Code, VS Code, Cursor, and custom apps. Build once, connect everywhere."},{"front":"MCP vs Function Calling vs LangChain","back":"Direct API calls are custom and fragile. OpenAI Function Calling is tied to GPT models. LangChain tools are tied to a Python framework. MCP is a universal, provider-agnostic protocol — any language, any AI client, any tool."}]}'></div>


</div>
