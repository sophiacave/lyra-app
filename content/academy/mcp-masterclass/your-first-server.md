---
title: "Your First Server"
course: "mcp-masterclass"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 4</div>
  <h1>Your First Server</h1>
  <p class="subtitle">Build an MCP server step-by-step. Choose what it connects to, define its tools, and see the TypeScript code structure generated. This lesson generates starter code you can copy into a real project.</p>

  <div class="steps-indicator">
    <div class="step-tab active" onclick="goStep(0)" id="stab0">1. Choose Connection</div>
    <div class="step-tab" onclick="goStep(1)" id="stab1">2. Define Tools</div>
    <div class="step-tab" onclick="goStep(2)" id="stab2">3. View Code</div>
  </div>

  <!-- Step 1: Choose Connection -->
  <div class="step-content active" id="step0">
    <div class="section">
      <h2>What does your server connect to?</h2>
      <p>Every MCP server wraps a specific capability. Choose what yours will connect to:</p>

      <div class="choice-grid">
        <div class="choice-card" onclick="selectType('filesystem')" id="type-filesystem">
          <div class="icon">&#x1F4C1;</div>
          <h3>Filesystem</h3>
          <p>Read, write, and search local files and directories</p>
        </div>
        <div class="choice-card" onclick="selectType('database')" id="type-database">
          <div class="icon">&#x1F4BE;</div>
          <h3>Database</h3>
          <p>Query and modify data in SQL or NoSQL databases</p>
        </div>
        <div class="choice-card" onclick="selectType('api')" id="type-api">
          <div class="icon">&#x1F310;</div>
          <h3>External API</h3>
          <p>Wrap any REST or GraphQL endpoint as MCP tools</p>
        </div>
      </div>

      <button class="next-step-btn" id="btn-step0" onclick="goStep(1)" disabled>Continue &rarr;</button>
    </div>
  </div>

  <!-- Step 2: Define Tools -->
  <div class="step-content" id="step1">
    <div class="section">
      <h2>Choose the tools your server exposes</h2>
      <p>Select which capabilities your <strong id="chosenType">server</strong> will offer to AI models:</p>

      <div class="tool-selector" id="toolSelector"></div>
      <button class="next-step-btn" id="btn-step1" onclick="goStep(2)" disabled>Generate Code &rarr;</button>
    </div>
  </div>

  <!-- Step 3: View Code -->
  <div class="step-content" id="step2">
    <div class="section">
      <h2>Your MCP Server Code</h2>
      <p>Here's the TypeScript structure for your custom MCP server. Annotations explain each part:</p>

      <div class="code-preview">
        <div class="code-header">
          <span class="filename" id="codeFilename">server.ts</span>
          <span class="lang">TypeScript</span>
        </div>
        <pre class="code-body" id="codeBody"></pre>
        </div>

      <div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.6">
        <strong style="color:#fb923c">What to do with this code:</strong> Copy the generated code above into a file (e.g., <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.8rem">my-server.ts</code>). Install the dependencies with <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.8rem">npm install @modelcontextprotocol/sdk zod</code>. Fill in the placeholder logic in each tool handler. Then run it with <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.8rem">npx tsx my-server.ts</code>.
      </div>

      <div class="section" style="margin-top:2rem">
        <h2>Key Pattern: server.tool()</h2>
        <p>The <code style="background:rgba(139,92,246,.15);padding:.15rem .4rem;border-radius:4px;color:#8b5cf6;font-size:.85rem">server.tool()</code> method is how you teach the server what it can do. Think of it as registering a capability -- you give it a name, describe what inputs it needs, and write the code that runs when Claude calls it. Every MCP server follows this same pattern with three arguments:</p>
        <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.1)">
            <span style="font-weight:700;color:#8b5cf6;font-size:.85rem;min-width:60px">name</span>
            <span style="font-size:.85rem;color:#a1a1aa">A unique string identifier the AI uses to call this tool</span>
          </div>
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.05);border:1px solid rgba(251,146,60,.1)">
            <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:60px">schema</span>
            <span style="font-size:.85rem;color:#a1a1aa">A Zod schema defining the input parameters and their types</span>
          </div>
          <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.05);border:1px solid rgba(52,211,153,.1)">
            <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:60px">handler</span>
            <span style="font-size:.85rem;color:#a1a1aa">An async function that executes the tool logic and returns results</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Server Building Quiz","questions":[{"q":"What are the three arguments passed to server.tool()?","options":["url, method, callback","name, schema, handler","route, middleware, controller","endpoint, params, response"],"correct":1,"explanation":"server.tool() takes: name (a string identifier), schema (a Zod schema for input parameters), and handler (an async function that runs the tool logic and returns results)."},{"q":"Which npm packages are required to build a basic MCP server in TypeScript?","options":["express and axios","@modelcontextprotocol/sdk and zod","fastify and joi","hapi and yup"],"correct":1,"explanation":"You need @modelcontextprotocol/sdk (for McpServer and StdioServerTransport) and zod (for defining input schemas). Install with: npm install @modelcontextprotocol/sdk zod"}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Server Code Patterns","cards":[{"front":"McpServer","back":"The main class from @modelcontextprotocol/sdk. Instantiate with a name and version, then register tools using server.tool()."},{"front":"StdioServerTransport","back":"The transport layer for local servers. Connects your server to Claude via standard input/output streams."},{"front":"server.tool() — name argument","back":"A unique snake_case string. This is what Claude calls when it wants to invoke the tool, e.g. \"read_file\" or \"search_documents\"."},{"front":"server.tool() — schema argument","back":"A Zod object schema defining what parameters the tool accepts. Claude reads this to know what to pass when calling the tool."},{"front":"server.tool() — handler argument","back":"An async function that receives the validated args and returns { content: [{ type: \"text\", text: result }] }."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Steps to Build Your First MCP Server","instruction":"Arrange these steps in the correct order","items":["npm install @modelcontextprotocol/sdk zod","Create McpServer instance with name and version","Register tools with server.tool()","Create StdioServerTransport","Call server.connect(transport)"]}'></div>

</div>
