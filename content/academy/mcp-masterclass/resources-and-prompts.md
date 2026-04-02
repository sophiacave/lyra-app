---
title: "Resources and Prompts"
course: "mcp-masterclass"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 6</div>
  <h1>Resources &amp; Prompts</h1>
  <p class="subtitle">MCP has three primitives: Tools, Resources, and Prompts. You already know Tools. This lesson covers the other two — data the AI can read (Resources) and interaction templates the user can select (Prompts) — with working code for both.</p>

  <div class="section">
    <h2>The Three MCP Primitives</h2>
    <p>Think of MCP primitives as three different directions of information flow:</p>

    <div class="primitives">
      <div class="primitive-card tools-card active" onclick="showPrimitive('tools')">
        <div class="icon">&#x2699;&#xFE0F;</div>
        <h3>Tools</h3>
        <p>Actions the AI can take</p>
      </div>
      <div class="primitive-card resources-card" onclick="showPrimitive('resources')">
        <div class="icon">&#x1F4C4;</div>
        <h3>Resources</h3>
        <p>Data the AI can read</p>
      </div>
      <div class="primitive-card prompts-card" onclick="showPrimitive('prompts')">
        <div class="icon">&#x1F4DD;</div>
        <h3>Prompts</h3>
        <p>Templates the user selects</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Side-by-Side Comparison</h2>
    <table class="comparison-table">
      <thead>
        <tr><th>Aspect</th><th style="color:#8b5cf6">Tools</th><th style="color:#34d399">Resources</th><th style="color:#fb923c">Prompts</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Direction</strong></td><td>AI &rarr; World</td><td>World &rarr; AI</td><td>User &rarr; AI</td></tr>
        <tr><td><strong>Triggered by</strong></td><td>AI model decides</td><td>Client/user requests</td><td>User selects</td></tr>
        <tr><td><strong>Purpose</strong></td><td>Execute actions</td><td>Provide context</td><td>Structure interactions</td></tr>
        <tr><td><strong>Example</strong></td><td>Write a file</td><td>Read config data</td><td>Code review template</td></tr>
        <tr><td><strong>State change</strong></td><td>Yes (side effects)</td><td>No (read-only)</td><td>No (templates only)</td></tr>
        <tr><td><strong>Discovery</strong></td><td>tools/list</td><td>resources/list</td><td>prompts/list</td></tr>
        <tr><td><strong>Who initiates</strong></td><td>The AI autonomously</td><td>The app or user</td><td>The user from a menu</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Resources: Giving AI Read-Only Data</h2>
    <p>A Resource is read-only data your server exposes to the AI through a URI. Unlike tools, resources do not execute actions or cause side effects. They are for providing context — configuration files, documentation, database schemas, API specs.</p>

    <div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.15);border-radius:12px;padding:1.25rem;margin-bottom:1.25rem;font-size:.85rem;color:#a1a1aa;line-height:1.6">
      <strong style="color:#34d399">When to use a Resource instead of a Tool:</strong> If the data is read-only and the AI does not need to decide <em>when</em> to fetch it — use a Resource. If the AI needs to take an action or make a decision about <em>when</em> to fetch data — use a Tool. Example: A project README is a Resource. A database query is a Tool.
    </div>

    <div class="code-block">
      <div class="code-header"><span class="filename">Resource Example</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="kw">import</span> { McpServer } <span class="kw">from</span> <span class="str">"@modelcontextprotocol/sdk/server/mcp.js"</span>;
<span class="kw">import</span> { readFileSync } <span class="kw">from</span> <span class="str">"fs"</span>;

<span class="kw">const</span> server = <span class="kw">new</span> McpServer({ name: <span class="str">"project-context"</span>, version: <span class="str">"1.0.0"</span> });

<span class="cm">// ── Static Resource: project README ──────────────────────</span>
<span class="cm">// URI scheme is up to you — file://, docs://, project:// all work.</span>
<span class="cm">// The URI is how the client requests this specific resource.</span>
server.resource(
  <span class="str">"project-readme"</span>,                        <span class="cm">// unique name</span>
  <span class="str">"file:///project/README.md"</span>,              <span class="cm">// URI</span>
  <span class="kw">async</span> () => ({
    contents: [{
      uri: <span class="str">"file:///project/README.md"</span>,
      text: readFileSync(<span class="str">"./README.md"</span>, <span class="str">"utf-8"</span>),
      mimeType: <span class="str">"text/markdown"</span>,
    }],
  })
);

<span class="cm">// ── Dynamic Resource: database schema ────────────────────</span>
<span class="cm">// Resources can be dynamic — the handler runs each time</span>
<span class="cm">// the resource is requested, returning fresh data.</span>
server.resource(
  <span class="str">"db-schema"</span>,
  <span class="str">"db://schema/tables"</span>,
  <span class="kw">async</span> () => {
    <span class="kw">const</span> tables = <span class="kw">await</span> db.query(<span class="str">"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"</span>);
    <span class="kw">return</span> {
      contents: [{
        uri: <span class="str">"db://schema/tables"</span>,
        text: tables.rows.map(t => t.table_name).join(<span class="str">"\n"</span>),
        mimeType: <span class="str">"text/plain"</span>,
      }],
    };
  }
);</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:1.25rem">
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:70px">name</span>
        <span style="font-size:.85rem;color:#a1a1aa">A human-readable identifier. Shows up in resource listings.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:70px">URI</span>
        <span style="font-size:.85rem;color:#a1a1aa">The address the client uses to request this resource. You define the scheme (<code>file://</code>, <code>db://</code>, etc.).</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:70px">handler</span>
        <span style="font-size:.85rem;color:#a1a1aa">Async function returning <code>{ contents: [{ uri, text, mimeType }] }</code>. Runs when the resource is read.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Prompts: Reusable Interaction Templates</h2>
    <p>A Prompt is a reusable template that structures how the user interacts with the AI. Think of prompts as pre-built workflows — the user selects one from a menu, optionally fills in parameters, and the AI receives a structured starting point.</p>

    <div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.15);border-radius:12px;padding:1.25rem;margin-bottom:1.25rem;font-size:.85rem;color:#a1a1aa;line-height:1.6">
      <strong style="color:#fb923c">When to use a Prompt:</strong> When you want to give users a structured starting point for common tasks. Code reviews, bug reports, data analysis templates, content generation workflows — anything where the same interaction pattern repeats.
    </div>

    <div class="code-block">
      <div class="code-header"><span class="filename">Prompt Example</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="cm">// ── Prompt: Code Review Template ─────────────────────────</span>
<span class="cm">// The user selects this from a menu in Claude Desktop.</span>
<span class="cm">// Claude receives structured instructions for the review.</span>
server.prompt(
  <span class="str">"code-review"</span>,                           <span class="cm">// unique name</span>
  {
    file_path: z.string().describe(<span class="str">"Path to the file to review"</span>),
    focus: z.enum([<span class="str">"security"</span>, <span class="str">"performance"</span>, <span class="str">"readability"</span>, <span class="str">"all"</span>])
      .default(<span class="str">"all"</span>)
      .describe(<span class="str">"What aspect to focus the review on"</span>),
  },
  <span class="kw">async</span> ({ file_path, focus }) => ({
    messages: [{
      role: <span class="str">"user"</span>,
      content: {
        type: <span class="str">"text"</span>,
        text: <span class="str">`Review the file at ${file_path}. Focus on: ${focus}.\n\nProvide:\n1. A summary of what the code does\n2. Issues found (ranked by severity)\n3. Specific suggestions with code examples\n4. An overall quality score (1-10)`</span>,
      },
    }],
  })
);

<span class="cm">// ── Prompt: Bug Report Template ──────────────────────────</span>
server.prompt(
  <span class="str">"bug-report"</span>,
  {
    title: z.string().describe(<span class="str">"Short bug title"</span>),
    steps: z.string().describe(<span class="str">"Steps to reproduce the bug"</span>),
    expected: z.string().describe(<span class="str">"What should happen"</span>),
    actual: z.string().describe(<span class="str">"What actually happens"</span>),
  },
  <span class="kw">async</span> ({ title, steps, expected, actual }) => ({
    messages: [{
      role: <span class="str">"user"</span>,
      content: {
        type: <span class="str">"text"</span>,
        text: <span class="str">`Analyze this bug and suggest a fix:\n\n**Bug:** ${title}\n**Steps:** ${steps}\n**Expected:** ${expected}\n**Actual:** ${actual}\n\nIdentify the likely root cause, suggest a fix with code, and recommend a test to prevent regression.`</span>,
      },
    }],
  })
);</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:1.25rem">
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:70px">name</span>
        <span style="font-size:.85rem;color:#a1a1aa">Unique identifier. Shows in the prompt selection menu in Claude Desktop.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:70px">schema</span>
        <span style="font-size:.85rem;color:#a1a1aa">Zod schema for parameters the user fills in. Same syntax as tool schemas.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:70px">handler</span>
        <span style="font-size:.85rem;color:#a1a1aa">Returns <code>{ messages: [{ role, content }] }</code>. These messages are injected into the conversation as if the user typed them.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Tools vs Resources vs Prompts — Decision Tree</h2>
    <p>Use this decision tree when building your server to choose the right primitive:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.12)">
        <strong style="color:#8b5cf6">Does the AI need to take an action or modify state?</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Yes &rarr; <strong>Use a Tool.</strong> Tools execute code, write files, send messages, query databases. The AI decides when to call them.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.12)">
        <strong style="color:#34d399">Does the AI need read-only context that does not change based on user input?</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Yes &rarr; <strong>Use a Resource.</strong> Resources provide background context like documentation, schemas, or config. The client or user requests them.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.12)">
        <strong style="color:#fb923c">Do you want to give users a pre-built workflow they can select?</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Yes &rarr; <strong>Use a Prompt.</strong> Prompts structure the conversation from the start. Users pick them from a menu and fill in parameters.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Combining All Three</h2>
    <p>In practice, a production server often uses all three primitives together. Here is how they complement each other in a documentation server:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="color:#34d399;font-weight:700;font-size:.85rem;min-width:80px">Resource</span>
        <span style="font-size:.85rem;color:#a1a1aa"><code>docs://api/openapi.json</code> — The API spec. Loaded once when the server connects. Gives Claude full context about available endpoints.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.85rem;min-width:80px">Tool</span>
        <span style="font-size:.85rem;color:#a1a1aa"><code>search_docs</code> — Searches documentation by keyword. Claude calls this when the user asks "how do I authenticate?"</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="color:#fb923c;font-weight:700;font-size:.85rem;min-width:80px">Prompt</span>
        <span style="font-size:.85rem;color:#a1a1aa"><code>api-integration</code> — Template: "Help me integrate the [endpoint] endpoint in [language]." User fills in the blanks, Claude gets structured instructions.</span>
      </div>
    </div>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"MCP Primitives","cards":[{"front":"Tools","back":"Actions the AI invokes autonomously. Direction: AI to World. They cause side effects — writing files, sending emails, querying databases. Registered with server.tool()."},{"front":"Resources","back":"Read-only data the client or user requests. Direction: World to AI. No side effects — just providing context. Registered with server.resource(name, uri, handler)."},{"front":"Prompts","back":"Reusable templates the user selects from a menu. Direction: User to AI. They structure the conversation with pre-built workflows. Registered with server.prompt(name, schema, handler)."},{"front":"server.resource() return format","back":"Returns { contents: [{ uri, text, mimeType }] }. The uri matches the resource URI. mimeType helps Claude understand the content format."},{"front":"server.prompt() return format","back":"Returns { messages: [{ role: \"user\", content: { type: \"text\", text: \"...\" } }] }. These messages are injected into the conversation as if the user typed them."},{"front":"Resource URI","back":"A URI like file://project/README.md or db://schema/tables. You define the scheme. The client uses this URI to request specific resources via resources/read."},{"front":"When to use Resource vs Tool","back":"Resource = read-only context that does not depend on user input. Tool = action that modifies state or requires the AI to decide when to fetch data."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Primitives Quiz","questions":[{"q":"Which MCP primitive would you use to give Claude read-only access to your project README without executing any code?","options":["A Tool that reads the file","A Resource that exposes the file","A Prompt with the content embedded","A Server with full filesystem access"],"correct":1,"explanation":"Resources are read-only data exposed through MCP. A resource like file://project/README.md gives the AI the content without any action or side effects — the safest choice for read-only data."},{"q":"Which primitive is triggered by the AI model deciding on its own — NOT by the user selecting it?","options":["Resources","Prompts","Tools","Discovery"],"correct":2,"explanation":"Tools are invoked autonomously by the AI model when it decides an action is needed. Resources are requested by the client or user. Prompts are selected by the user from a menu."},{"q":"What does server.prompt() return?","options":["{ content: [{ type: \"text\", text: \"...\" }] }","{ contents: [{ uri, text, mimeType }] }","{ messages: [{ role, content }] }","A plain string"],"correct":2,"explanation":"server.prompt() returns { messages: [{ role: \"user\", content: { type: \"text\", text: \"...\" } }] }. These messages are injected into the conversation, giving Claude structured instructions based on the user selections."},{"q":"A documentation server exposes an API spec that Claude should always have access to. Which primitive is best?","options":["A Tool that reads the spec on demand","A Resource that exposes the spec via URI","A Prompt that includes the spec text","A separate server just for the spec"],"correct":1,"explanation":"A Resource is perfect for static or semi-static data that provides context. The API spec does not change based on user input and does not cause side effects — it is read-only context."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Resource Data Flow — Put in Order","instruction":"Arrange the steps for how a Resource flows to the AI","items":["Client sends resources/list to discover available resources","User or app selects a resource by URI","Client sends resources/read with the URI","Server handler runs and returns { contents: [{ uri, text, mimeType }] }","Resource data is added to AI context"]}'></div>

</div>
