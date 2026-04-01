---
title: "Tool Definitions"
course: "mcp-masterclass"
order: 5
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 5</div>
  <h1>Tool Definitions</h1>
  <p class="subtitle">The tool definition is how Claude knows what your tool does. Build one interactively and watch the JSON schema generate in real-time.</p>

  <div class="section">
    <h2>Build a Tool Definition</h2>
    <p><strong>JSON Schema</strong> is a standard way to describe the shape of data -- what fields exist, what types they are (string, number, etc.), and which ones are required. Claude reads these schemas to understand what inputs your tool needs and how to format them correctly.</p>
    <p><strong>Why tool definitions matter:</strong> Without a clear definition, Claude has no way to know your tool exists or how to call it. The definition is your tool's instruction manual -- the better you describe it, the more accurately Claude will use it. Fill in the fields below and watch the schema update live on the right.</p>
  </div>

  <div class="builder">
    <div class="builder-header">Tool Definition Builder</div>
    <div class="builder-body">
      <div class="field">
        <label>Tool Name</label>
        <input type="text" id="toolName" value="search_documents" oninput="updatePreview()" placeholder="e.g. search_documents">
      </div>
      <div class="field">
        <label>Description (what Claude reads to decide when to use this tool)</label>
        <textarea id="toolDesc" oninput="updatePreview()" placeholder="e.g. Search through a document collection by keyword or semantic query">Search through a document collection by keyword or semantic query. Returns matching documents ranked by relevance.</textarea>
      </div>
      <div class="field">
        <label>Input Parameters</label>
        <button class="add-param-btn" onclick="addParam()">+ Add Parameter</button>
      </div>
    </div>
  </div>

  <div class="preview-split">
    <div class="preview-panel">
      <div class="panel-header">JSON Schema Output</div>
      </div>
    <div class="preview-panel">
      <div class="panel-header">server.tool() Code</div>
      </div>
  </div>

  <div class="test-area">
    <h3>Test Your Tool</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Enter example values for each parameter to see what a tool call would look like:</p>
    <button class="test-btn" onclick="testTool()">Run Test Call</button>
    </div>

  <div class="ai-decision">
    <h3>How Claude Reads Tool Definitions</h3>
    <p>When Claude receives a user message, it checks all available tool definitions. The <span class="highlight">description</span> field is the most important — it tells Claude WHEN to use the tool. The <span class="highlight">parameter descriptions</span> tell Claude WHAT to pass. Write clear, specific descriptions and Claude will use your tools correctly without any prompt engineering.</p>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Tool Definition Quiz","questions":[{"q":"Which field in a tool definition is most important for Claude to decide WHEN to use the tool?","options":["The tool name","The description field","The required parameters list","The return type"],"correct":1,"explanation":"The description field is what Claude reads to decide when to invoke a tool. A clear, specific description means Claude calls your tool at exactly the right moment without extra prompt engineering."},{"q":"In JSON Schema, what does the required array inside inputSchema specify?","options":["Which parameters are strings","Which parameters Claude must provide — if absent the call fails","Which parameters have default values","Which parameters are read-only"],"correct":1,"explanation":"The required array lists parameter names that must be provided in every tool call. If Claude omits a required parameter, the MCP protocol rejects the call before it reaches your handler."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"JSON Schema Concepts","cards":[{"front":"inputSchema","back":"The JSON Schema object inside a tool definition. Has type: \"object\", a properties map, and a required array. Claude uses this to know what to pass."},{"front":"properties","back":"A map of parameter name to type definition. Each entry specifies type (string/number/boolean) and a description Claude reads."},{"front":"required array","back":"Lists which parameter names are mandatory. If Claude omits one, the call is rejected before reaching your handler."},{"front":"description (parameter level)","back":"Tells Claude what THIS specific parameter means. Example: \"The search query text\" or \"Maximum number of results to return\". Be specific."},{"front":"z.string().describe()","back":"Zod syntax for defining a string parameter with a description. Claude reads the description to know what value to pass. Always include .describe()."}]}'></div>


</div>
