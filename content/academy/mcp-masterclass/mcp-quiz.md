---
title: "MCP Quiz"
course: "mcp-masterclass"
order: 10
type: "quiz"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/mcp-masterclass/">MCP Masterclass</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>MCP Mastery Quiz</h1>
  <p class="sub">Test your knowledge across all three modules — architecture, server building, tool definitions, security, and production patterns.</p>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     COURSE RECAP — 3 Modules Overview
     ═══════════════════════════════════════════════════════════════════ -->

<div class="card" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #34d399; border-radius: 16px; padding: 2.5rem; margin: 2rem 0;">
  <h2 style="color: #34d399; font-size: 1.6rem; margin-bottom: 0.5rem;">Course Recap</h2>
  <p style="color: #a1a1aa; margin-bottom: 1.5rem;">You have covered three modules across 10 lessons. Here is the full arc of what you learned.</p>

  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">

    <!-- Module 1 -->
    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 12px; padding: 1.5rem;">
      <div style="color: #8b5cf6; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Module 1</div>
      <h3 style="color: #e5e5e5; font-size: 1.15rem; margin-bottom: 0.75rem;">Architecture</h3>
      <ul style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.7; padding-left: 1.2rem; margin: 0;">
        <li>What MCP is and why it exists</li>
        <li>Host, Client, and Server roles</li>
        <li>JSON-RPC 2.0 message format</li>
        <li>Transport layers: <code style="color: #8b5cf6;">stdio</code> and <code style="color: #8b5cf6;">Streamable HTTP</code></li>
        <li>Capability negotiation lifecycle</li>
      </ul>
    </div>

    <!-- Module 2 -->
    <div style="background: rgba(52, 211, 153, 0.1); border: 1px solid #34d399; border-radius: 12px; padding: 1.5rem;">
      <div style="color: #34d399; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Module 2</div>
      <h3 style="color: #e5e5e5; font-size: 1.15rem; margin-bottom: 0.75rem;">Building</h3>
      <ul style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.7; padding-left: 1.2rem; margin: 0;">
        <li>Your first MCP server from scratch</li>
        <li><code style="color: #34d399;">server.tool()</code> definitions with Zod</li>
        <li>Resources for read-only data</li>
        <li>Prompts as reusable templates</li>
        <li>Returning structured <code style="color: #34d399;">content</code> arrays</li>
      </ul>
    </div>

    <!-- Module 3 -->
    <div style="background: rgba(251, 146, 60, 0.1); border: 1px solid #fb923c; border-radius: 12px; padding: 1.5rem;">
      <div style="color: #fb923c; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Module 3</div>
      <h3 style="color: #e5e5e5; font-size: 1.15rem; margin-bottom: 0.75rem;">Production</h3>
      <ul style="color: #a1a1aa; font-size: 0.95rem; line-height: 1.7; padding-left: 1.2rem; margin: 0;">
        <li>Security: least privilege principle</li>
        <li>Input validation and sanitization</li>
        <li>Connecting servers to Claude Desktop</li>
        <li>Audit logging and error handling</li>
        <li>Real-world patterns and best practices</li>
      </ul>
    </div>

  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     KEY CONCEPTS REVIEW — Visual Summary
     ═══════════════════════════════════════════════════════════════════ -->

<div class="card" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #8b5cf6; border-radius: 16px; padding: 2.5rem; margin: 2rem 0;">
  <h2 style="color: #8b5cf6; font-size: 1.6rem; margin-bottom: 0.5rem;">Key Concepts Review</h2>
  <p style="color: #a1a1aa; margin-bottom: 1.5rem;">The most important ideas from the course, distilled into quick-reference form.</p>

  <!-- The 3 Primitives -->
  <h3 style="color: #e5e5e5; font-size: 1.15rem; margin-bottom: 1rem;">The 3 MCP Primitives</h3>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2rem;">

    <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid #38bdf8; border-radius: 10px; padding: 1.25rem; text-align: center;">
      <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔧</div>
      <div style="color: #38bdf8; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.4rem;">Tools</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Actions the AI can invoke. Think API endpoints: the model calls them, your handler executes logic, and a result comes back.</p>
    </div>

    <div style="background: rgba(52, 211, 153, 0.08); border: 1px solid #34d399; border-radius: 10px; padding: 1.25rem; text-align: center;">
      <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📄</div>
      <div style="color: #34d399; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.4rem;">Resources</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Read-only data the AI can access. Files, database records, configuration — anything the model needs to <em>read</em> but not modify.</p>
    </div>

    <div style="background: rgba(244, 114, 182, 0.08); border: 1px solid #f472b6; border-radius: 10px; padding: 1.25rem; text-align: center;">
      <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">💬</div>
      <div style="color: #f472b6; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.4rem;">Prompts</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Reusable templates the user selects. They pre-fill context so the AI starts with exactly the right framing for a task.</p>
    </div>

  </div>

  <!-- server.tool() Signature -->
  <h3 style="color: #e5e5e5; font-size: 1.15rem; margin-bottom: 1rem;">The <code style="color: #34d399;">server.tool()</code> Signature</h3>
  <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 10px; padding: 1.25rem; margin-bottom: 2rem; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.9rem; line-height: 1.8; overflow-x: auto;">
    <div><span style="color: #71717a;">// Three arguments: name, schema, handler</span></div>
    <div><span style="color: #8b5cf6;">server</span>.<span style="color: #34d399;">tool</span>(</div>
    <div style="padding-left: 1.5rem;"><span style="color: #fb923c;">"tool-name"</span>,            <span style="color: #71717a;">// unique string identifier</span></div>
    <div style="padding-left: 1.5rem;">{ <span style="color: #38bdf8;">query</span>: z.string() },   <span style="color: #71717a;">// Zod schema for input validation</span></div>
    <div style="padding-left: 1.5rem;"><span style="color: #8b5cf6;">async</span> ({ <span style="color: #38bdf8;">query</span> }) => {  <span style="color: #71717a;">// handler function</span></div>
    <div style="padding-left: 3rem;"><span style="color: #8b5cf6;">return</span> {</div>
    <div style="padding-left: 4.5rem;"><span style="color: #38bdf8;">content</span>: [{ <span style="color: #38bdf8;">type</span>: <span style="color: #fb923c;">"text"</span>, <span style="color: #38bdf8;">text</span>: <span style="color: #fb923c;">"result"</span> }]</div>
    <div style="padding-left: 3rem;">};</div>
    <div style="padding-left: 1.5rem;">}</div>
    <div>);</div>
  </div>

  <!-- Security Principles -->
  <h3 style="color: #e5e5e5; font-size: 1.15rem; margin-bottom: 1rem;">Security Principles</h3>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">

    <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem;">
      <div style="color: #ef4444; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.3rem;">Least Privilege</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Give servers the minimum permissions they need. A read-only DB user cannot run <code style="color: #ef4444;">DROP TABLE</code> even if a prompt injection gets through.</p>
    </div>

    <div style="background: rgba(251, 146, 60, 0.08); border-left: 3px solid #fb923c; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem;">
      <div style="color: #fb923c; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.3rem;">Input Validation</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Always validate inputs with Zod schemas. Never trust data from the AI model — treat it like user input from an untrusted source.</p>
    </div>

    <div style="background: rgba(139, 92, 246, 0.08); border-left: 3px solid #8b5cf6; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem;">
      <div style="color: #8b5cf6; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.3rem;">Audit Logging</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Log every tool invocation with timestamps, parameters, and results. When something goes wrong, logs are your only witness.</p>
    </div>

    <div style="background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38bdf8; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem;">
      <div style="color: #38bdf8; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.3rem;">Error Boundaries</div>
      <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.5;">Never let exceptions crash the server. Catch errors in handlers, return meaningful messages, and keep the MCP connection alive.</p>
    </div>

  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     COMMON MCP MISTAKES
     ═══════════════════════════════════════════════════════════════════ -->

<div class="card" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #ef4444; border-radius: 16px; padding: 2.5rem; margin: 2rem 0;">
  <h2 style="color: #ef4444; font-size: 1.6rem; margin-bottom: 0.5rem;">Common MCP Mistakes</h2>
  <p style="color: #a1a1aa; margin-bottom: 1.5rem;">These are the pitfalls that trip up most developers when building MCP servers. If you can avoid these five, you are ahead of the curve.</p>

  <div style="display: flex; flex-direction: column; gap: 1.25rem;">

    <!-- Mistake 1 -->
    <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start;">
      <div style="background: #ef4444; color: #fff; font-weight: 700; font-size: 0.85rem; min-width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">1</div>
      <div>
        <div style="color: #e5e5e5; font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem;">Giving servers too many permissions</div>
        <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.6;">Connecting your MCP server with a root database user or full filesystem access is an invitation for disaster. If a prompt injection tricks the AI into calling a destructive tool, those permissions become the blast radius. Always use the most restrictive credentials possible.</p>
      </div>
    </div>

    <!-- Mistake 2 -->
    <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start;">
      <div style="background: #ef4444; color: #fff; font-weight: 700; font-size: 0.85rem; min-width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">2</div>
      <div>
        <div style="color: #e5e5e5; font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem;">Not validating inputs with Zod schemas</div>
        <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.6;">Skipping schema validation means your handler receives whatever the model sends — including malformed data, SQL fragments, or unexpected types. Zod schemas are your first line of defense. They reject bad input before your code ever sees it.</p>
      </div>
    </div>

    <!-- Mistake 3 -->
    <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start;">
      <div style="background: #ef4444; color: #fff; font-weight: 700; font-size: 0.85rem; min-width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">3</div>
      <div>
        <div style="color: #e5e5e5; font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem;">Putting business logic in the tool description</div>
        <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.6;">The tool description tells the AI <em>when</em> to use the tool — it is not where your logic lives. All computation, API calls, and data processing belong in the handler function. Descriptions should be short, clear sentences explaining the tool's purpose.</p>
      </div>
    </div>

    <!-- Mistake 4 -->
    <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start;">
      <div style="background: #ef4444; color: #fff; font-weight: 700; font-size: 0.85rem; min-width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">4</div>
      <div>
        <div style="color: #e5e5e5; font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem;">Not handling errors gracefully</div>
        <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.6;">An unhandled exception in a tool handler can crash your entire MCP server, killing the connection for all tools. Wrap handler logic in try/catch blocks and return a structured error response with <code style="color: #ef4444;">isError: true</code> so the AI can recover and inform the user.</p>
      </div>
    </div>

    <!-- Mistake 5 -->
    <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start;">
      <div style="background: #ef4444; color: #fff; font-weight: 700; font-size: 0.85rem; min-width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">5</div>
      <div>
        <div style="color: #e5e5e5; font-weight: 600; font-size: 1rem; margin-bottom: 0.3rem;">Exposing sensitive data through Resources without access control</div>
        <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0; line-height: 1.6;">Resources are powerful because they give the AI direct read access to data. But if you expose environment variables, credentials, or private user data as a Resource without scoping or filtering, the AI can read and potentially leak that information in its responses. Always filter sensitive fields before returning Resource content.</p>
      </div>
    </div>

  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     PRE-QUIZ CHECKLIST
     ═══════════════════════════════════════════════════════════════════ -->

<div class="card" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #38bdf8; border-radius: 16px; padding: 2.5rem; margin: 2rem 0;">
  <h2 style="color: #38bdf8; font-size: 1.6rem; margin-bottom: 0.5rem;">Pre-Quiz Checklist</h2>
  <p style="color: #a1a1aa; margin-bottom: 1.5rem;">Before you take the quiz, do a quick self-assessment. Can you confidently answer each of these?</p>

  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I can explain what MCP stands for and why it was created.</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I can name the three components of MCP architecture.</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I know the difference between Tools, Resources, and Prompts.</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I can write a <code style="color: #38bdf8;">server.tool()</code> call with name, schema, and handler.</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I understand the two transport protocols (stdio and Streamable HTTP).</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I can explain the capability negotiation lifecycle.</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I know where to configure MCP servers for Claude Desktop.</span>
    </div>

    <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 0.85rem 1.1rem; display: flex; align-items: center; gap: 0.75rem;">
      <span style="color: #38bdf8; font-size: 1.1rem;">&#9744;</span>
      <span style="color: #a1a1aa; font-size: 0.9rem;">I can list three security principles for production MCP servers.</span>
    </div>

  </div>

  <p style="color: #71717a; font-size: 0.85rem; margin-top: 1.25rem; margin-bottom: 0;">If any of these feel shaky, scroll up and review the relevant section before proceeding. The quiz covers all of them.</p>
</div>

<hr style="border: none; border-top: 1px solid rgba(139, 92, 246, 0.3); margin: 2.5rem 0;" />

<h2 style="color: #e5e5e5; font-size: 1.4rem; text-align: center; margin-bottom: 0.5rem;">Ready? Let's go.</h2>
<p style="color: #71717a; text-align: center; margin-bottom: 2rem;">10 questions. You need 8 correct to pass. Good luck.</p>

  <div data-learn="QuizMC" data-props='{"title":"MCP Mastery Quiz","questions":[{"q":"What does MCP stand for?","options":["Machine Connection Protocol","Model Context Protocol","Multi-Channel Platform","Module Computation Pipeline"],"correct":1,"explanation":"MCP stands for Model Context Protocol. It is an open standard created by Anthropic that defines how AI models communicate with external tools and data sources."},{"q":"What are the three components of MCP architecture?","options":["Client, Server, Database","Host, MCP Client, MCP Server","Browser, API, Model","Frontend, Backend, Database"],"correct":1,"explanation":"The three MCP components are: Host (the AI application like Claude Desktop), MCP Client (the protocol bridge), and MCP Server (your tool or data source)."},{"q":"What transport protocols does MCP support?","options":["HTTP and WebSocket only","gRPC and REST","stdio and Streamable HTTP","TCP/IP sockets only"],"correct":2,"explanation":"MCP supports two transport mechanisms: stdio (standard input/output, ideal for local servers) and Streamable HTTP for remote servers."},{"q":"In the server.tool() method, what are the three arguments?","options":["url, method, callback","name, schema, handler","route, middleware, controller","endpoint, params, response"],"correct":1,"explanation":"server.tool() takes three arguments: name (a string identifier), schema (a Zod schema defining input parameters), and handler (an async function that executes the tool logic)."},{"q":"What are the three MCP primitives?","options":["Read, Write, Execute","Input, Output, Error","Tools, Resources, Prompts","Query, Mutation, Subscription"],"correct":2,"explanation":"The three MCP primitives are: Tools (actions the AI can take), Resources (data the AI can read), and Prompts (templates the AI can use). Each serves a different purpose."},{"q":"How does an MCP Server differ from a direct tool call?","options":["There is no difference","Servers are faster","Servers are long-running, expose multiple tools, and maintain state","Servers only work with Claude"],"correct":2,"explanation":"MCP Servers are long-running processes that expose multiple tools, maintain state across calls (like DB connections), and support automatic tool discovery. Direct tool calls are one-off and stateless."},{"q":"Where do you configure MCP servers for Claude Desktop?","options":["In the Claude Desktop UI settings","In claude_desktop_config.json","In the server package.json","In a .env file"],"correct":1,"explanation":"MCP servers are configured in claude_desktop_config.json, located in ~/Library/Application Support/Claude/ on macOS or %APPDATA%\\Claude\\ on Windows."},{"q":"What happens during the MCP capability negotiation phase?","options":["The user manually selects which tools to enable","Claude sends initialize, then lists available tools from the server","The server pushes notifications to Claude","The client uploads all data to the server"],"correct":1,"explanation":"During negotiation, Claude sends an initialize request with its protocol version, the server responds with capabilities, then Claude sends tools/list to discover all available tools."},{"q":"Which security practice prevents a prompt injection from executing DROP TABLE?","options":["Rate limiting","Audit logging","Principle of least privilege","Transport security"],"correct":2,"explanation":"Principle of least privilege means connecting with minimal permissions (e.g., read-only DB user). Even if a prompt injection gets through, destructive queries are impossible because the server does not have permission."},{"q":"Which MCP primitive would you use to give Claude access to your project README without executing any code?","options":["A Tool that reads the file","A Resource that exposes the file","A Prompt with the content embedded","A Server with full filesystem access"],"correct":1,"explanation":"Resources are read-only data exposed through MCP. A resource like file://project/README.md gives the AI access to the content without executing any action — it is the safest, most appropriate primitive for read-only data."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Course Recap — Key Concepts","cards":[{"front":"MCP = ?","back":"Model Context Protocol. An open standard by Anthropic defining how AI models communicate with external tools and data sources."},{"front":"Three MCP components","back":"Host (the AI app), MCP Client (the protocol bridge inside the Host), MCP Server (the tool or data source)."},{"front":"Three MCP primitives","back":"Tools (AI-invoked actions), Resources (read-only data), Prompts (user-selected templates)."},{"front":"server.tool() signature","back":"server.tool(name, schema, handler) — name is the identifier, schema is a Zod object, handler is an async function returning { content: [...] }."},{"front":"Principle of least privilege","back":"Connect your MCP server with minimal permissions. A read-only DB user cannot execute DROP TABLE even if a prompt injection gets through."}]}'></div>


</div>
