---
title: "Tool Definitions"
course: "mcp-masterclass"
order: 5
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/mcp-masterclass/">MCP Masterclass</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Tool Definitions</h1>
  <p class="sub">The tool definition is how Claude knows what your tool does, what inputs it needs, and when to use it. A great definition means Claude calls your tool correctly without any prompt engineering. A bad one means it guesses wrong or ignores your tool entirely.</p>
</div>

  <div class="section">
    <h2>What Claude Sees</h2>
    <p>When Claude connects to your MCP server, it calls <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.85rem">tools/list</code> and receives a JSON array of tool definitions. Each definition has three parts Claude uses to decide when and how to call your tool:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.1)">
        <span style="font-weight:700;color:#8b5cf6;font-size:.85rem;min-width:90px">name</span>
        <span style="font-size:.85rem;color:#a1a1aa">Unique identifier Claude uses to invoke the tool. Convention: <code>snake_case</code>.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.05);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:90px">description</span>
        <span style="font-size:.85rem;color:#a1a1aa">Plain English explanation of WHEN to use this tool and WHAT it does. This is the most important field.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.05);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:90px">inputSchema</span>
        <span style="font-size:.85rem;color:#a1a1aa">JSON Schema defining parameter names, types, descriptions, and which are required.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Good vs Bad Descriptions</h2>
    <p>The <strong>description</strong> field is what Claude reads to decide whether to use your tool. It is more important than the tool name. Here are real examples showing the difference:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.85rem">&#x274C; Bad Description</strong>
        <div class="code-block" style="margin-top:.75rem">
          <div class="code-body" style="font-size:.8rem"><span class="str">"Searches stuff"</span></div>
        </div>
        <p style="font-size:.8rem;color:#71717a;margin:.5rem 0 0">Too vague. Claude does not know what "stuff" means, when to use it instead of other search tools, or what kind of results to expect.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.12)">
        <strong style="color:#34d399;font-size:.85rem">&#x2705; Good Description</strong>
        <div class="code-block" style="margin-top:.75rem">
          <div class="code-body" style="font-size:.8rem"><span class="str">"Search through the project's documentation files by keyword. Returns matching file names and a preview of the matching paragraph. Use this when the user asks about how something works in the project."</span></div>
        </div>
        <p style="font-size:.8rem;color:#71717a;margin:.5rem 0 0">Tells Claude exactly what it searches, what it returns, and when to use it.</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.85rem">&#x274C; Bad Parameter Description</strong>
        <div class="code-block" style="margin-top:.75rem">
          <div class="code-body" style="font-size:.8rem">query: z.string()</div>
        </div>
        <p style="font-size:.8rem;color:#71717a;margin:.5rem 0 0">No <code>.describe()</code>. Claude has to guess what format the query should be in.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.12)">
        <strong style="color:#34d399;font-size:.85rem">&#x2705; Good Parameter Description</strong>
        <div class="code-block" style="margin-top:.75rem">
          <div class="code-body" style="font-size:.8rem">query: z.string().describe(
  <span class="str">"Search keyword or phrase. Case-insensitive. Partial matches work."</span>
)</div>
        </div>
        <p style="font-size:.8rem;color:#71717a;margin:.5rem 0 0">Claude knows the format, case behavior, and matching strategy.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Zod Schema Patterns</h2>
    <p>Zod is the schema library MCP uses. Here are the patterns you will use most often when defining tool inputs:</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">Common Zod Patterns</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="cm">// ── Basic Types ──────────────────────────────────────────</span>
z.string().describe(<span class="str">"The user's full name"</span>)
z.number().describe(<span class="str">"Maximum number of results to return"</span>)
z.boolean().describe(<span class="str">"Include archived items in results"</span>)

<span class="cm">// ── Constrained Types ────────────────────────────────────</span>
z.string().min(1).max(200).describe(<span class="str">"Search query, 1-200 characters"</span>)
z.number().int().min(1).max(100).describe(<span class="str">"Page size, 1-100"</span>)

<span class="cm">// ── Enums — give Claude a fixed set of choices ──────────</span>
z.enum([<span class="str">"asc"</span>, <span class="str">"desc"</span>]).describe(<span class="str">"Sort order: ascending or descending"</span>)
z.enum([<span class="str">"title"</span>, <span class="str">"date"</span>, <span class="str">"relevance"</span>]).describe(<span class="str">"Sort field"</span>)

<span class="cm">// ── Optional Parameters ──────────────────────────────────</span>
<span class="cm">// Optional params let Claude omit them when not needed</span>
z.number().optional().describe(<span class="str">"Max results. Defaults to 10 if not provided."</span>)
z.string().optional().describe(<span class="str">"Filter by category. Omit for all categories."</span>)

<span class="cm">// ── Defaults ─────────────────────────────────────────────</span>
z.number().default(10).describe(<span class="str">"Max results (default: 10)"</span>)
z.boolean().default(<span class="kw">false</span>).describe(<span class="str">"Include deleted items (default: false)"</span>)

<span class="cm">// ── Arrays ───────────────────────────────────────────────</span>
z.array(z.string()).describe(<span class="str">"List of tag names to filter by"</span>)

<span class="cm">// ── Nested Objects ───────────────────────────────────────</span>
z.object({
  lat: z.number().describe(<span class="str">"Latitude"</span>),
  lng: z.number().describe(<span class="str">"Longitude"</span>),
}).describe(<span class="str">"Geographic coordinates"</span>)</div>
    </div>
  </div>

  <div class="section">
    <h2>Complete Example: A Well-Defined Tool</h2>
    <p>Here is a production-quality tool definition that demonstrates all the patterns together:</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">server.ts</span><span class="lang">TypeScript</span></div>
      <div class="code-body">server.tool(
  <span class="str">"search_documents"</span>,
  <span class="cm">// Schema: every parameter has a type, constraint, and description</span>
  {
    query: z.string().min(1).max(500).describe(
      <span class="str">"Search query. Supports keywords and phrases. Case-insensitive."</span>
    ),
    max_results: z.number().int().min(1).max(50).default(10).describe(
      <span class="str">"Maximum number of documents to return (default: 10)"</span>
    ),
    file_type: z.enum([<span class="str">"all"</span>, <span class="str">"markdown"</span>, <span class="str">"code"</span>, <span class="str">"pdf"</span>]).default(<span class="str">"all"</span>).describe(
      <span class="str">"Filter by file type. Use 'all' to search everything."</span>
    ),
    include_preview: z.boolean().default(<span class="kw">true</span>).describe(
      <span class="str">"Include a text preview of each matching document (default: true)"</span>
    ),
  },
  <span class="cm">// Handler: receives validated args, returns structured content</span>
  <span class="kw">async</span> ({ query, max_results, file_type, include_preview }) => {
    <span class="kw">const</span> results = <span class="kw">await</span> searchIndex(query, { max_results, file_type });

    <span class="kw">if</span> (results.length === 0) {
      <span class="kw">return</span> {
        content: [{ type: <span class="str">"text"</span>, text: <span class="str">`No documents found matching "${query}".`</span> }],
      };
    }

    <span class="kw">const</span> formatted = results.map(doc => {
      <span class="kw">let</span> line = <span class="str">`• ${doc.title} (${doc.type}, ${doc.score}% match)`</span>;
      <span class="kw">if</span> (include_preview) line += <span class="str">`\n  ${doc.preview}`</span>;
      <span class="kw">return</span> line;
    }).join(<span class="str">"\n\n"</span>);

    <span class="kw">return</span> {
      content: [{
        type: <span class="str">"text"</span>,
        text: <span class="str">`Found ${results.length} document(s):\n\n${formatted}`</span>,
      }],
    };
  }
);</div>
    </div>
  </div>

  <div class="section">
    <h2>How Claude Decides Which Tool to Call</h2>
    <p>When Claude receives a user message, it evaluates all available tool definitions through this decision process:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <span style="font-weight:700;color:#8b5cf6;font-size:1rem">1</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Read all descriptions</strong> — Claude reads the description field of every available tool to understand what each one does and when it should be used.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:1rem">2</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Match intent to tool</strong> — Based on the user's request and the tool descriptions, Claude selects the best tool (or decides no tool is needed).</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:1rem">3</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Generate arguments</strong> — Claude reads each parameter's <code>.describe()</code> text, type, and constraints to generate correct values. Enums are particularly helpful — Claude picks from your list instead of guessing.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <span style="font-weight:700;color:#38bdf8;font-size:1rem">4</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong style="color:#e2e8f0">Call the tool</strong> — Claude sends a <code>tools/call</code> message with the generated arguments. The MCP SDK validates them against your Zod schema before your handler runs.</span>
      </div>
    </div>

    <div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.85rem;color:#a1a1aa;line-height:1.6">
      <strong style="color:#8b5cf6">Key insight:</strong> If Claude is not using your tool when it should, the problem is almost always the <strong>description</strong>. Make it more specific about WHEN to use the tool. If Claude is passing wrong values, improve the parameter <code>.describe()</code> strings.
    </div>
  </div>

  <div class="section">
    <h2>What the JSON Schema Looks Like</h2>
    <p>Your Zod schema is automatically converted to JSON Schema and sent to Claude. Here is what the <code>search_documents</code> tool above looks like from Claude's perspective:</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">tools/list response (simplified)</span><span class="lang">JSON</span></div>
      <div class="code-body">{
  <span class="key">"name"</span>: <span class="str">"search_documents"</span>,
  <span class="key">"inputSchema"</span>: {
    <span class="key">"type"</span>: <span class="str">"object"</span>,
    <span class="key">"properties"</span>: {
      <span class="key">"query"</span>: {
        <span class="key">"type"</span>: <span class="str">"string"</span>,
        <span class="key">"minLength"</span>: 1,
        <span class="key">"maxLength"</span>: 500,
        <span class="key">"description"</span>: <span class="str">"Search query. Supports keywords and phrases. Case-insensitive."</span>
      },
      <span class="key">"max_results"</span>: {
        <span class="key">"type"</span>: <span class="str">"integer"</span>,
        <span class="key">"minimum"</span>: 1,
        <span class="key">"maximum"</span>: 50,
        <span class="key">"default"</span>: 10,
        <span class="key">"description"</span>: <span class="str">"Maximum number of documents to return (default: 10)"</span>
      },
      <span class="key">"file_type"</span>: {
        <span class="key">"type"</span>: <span class="str">"string"</span>,
        <span class="key">"enum"</span>: [<span class="str">"all"</span>, <span class="str">"markdown"</span>, <span class="str">"code"</span>, <span class="str">"pdf"</span>],
        <span class="key">"default"</span>: <span class="str">"all"</span>,
        <span class="key">"description"</span>: <span class="str">"Filter by file type. Use 'all' to search everything."</span>
      },
      <span class="key">"include_preview"</span>: {
        <span class="key">"type"</span>: <span class="str">"boolean"</span>,
        <span class="key">"default"</span>: <span class="kw">true</span>,
        <span class="key">"description"</span>: <span class="str">"Include a text preview of each matching document (default: true)"</span>
      }
    },
    <span class="key">"required"</span>: [<span class="str">"query"</span>]
  }
}</div>
    </div>

    <p style="font-size:.85rem;color:#a1a1aa;margin-top:.75rem">Notice: <code>query</code> is in the <code>required</code> array because it has no <code>.default()</code> or <code>.optional()</code>. The other parameters are optional — Claude can omit them and the defaults kick in. This is the Zod-to-JSON-Schema translation happening automatically.</p>
  </div>

  <div class="section">
    <h2>Building Your Own Tool Definitions</h2>
    <p>When building a tool definition, start with these three questions: (1) What should the tool be called? Use <code>snake_case</code> and make it descriptive. (2) When should Claude use it? Write a clear description. (3) What inputs does it need? Define each parameter with type, constraints, and a <code>.describe()</code> string. The complete example above (<code>search_documents</code>) demonstrates all of these elements working together.</p>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Tool Definition Quiz","questions":[{"q":"Which field in a tool definition is most important for Claude to decide WHEN to use the tool?","options":["The tool name","The description field","The required parameters list","The return type"],"correct":1,"explanation":"The description field is what Claude reads to decide when to invoke a tool. A clear, specific description means Claude calls your tool at exactly the right moment without extra prompt engineering."},{"q":"In JSON Schema, what does the required array inside inputSchema specify?","options":["Which parameters are strings","Which parameters Claude must provide — if absent the call fails","Which parameters have default values","Which parameters are read-only"],"correct":1,"explanation":"The required array lists parameter names that must be provided in every tool call. If Claude omits a required parameter, the MCP protocol rejects the call before it reaches your handler."},{"q":"How do you make a parameter optional in a Zod schema?","options":["Add .optional() or .default(value) to the chain","Set required: false in the JSON Schema","Pass null as the default in server.tool()","Optional parameters are not supported in MCP"],"correct":0,"explanation":"Use .optional() to let Claude omit the parameter entirely, or .default(value) to provide a fallback. Both result in the parameter being excluded from the JSON Schema required array."},{"q":"If Claude is calling your tool with wrong argument values, what should you fix first?","options":["The tool name","The handler logic","The .describe() strings on each parameter","The transport configuration"],"correct":2,"explanation":"Claude generates argument values by reading the .describe() text on each parameter. If the descriptions are vague or ambiguous, Claude will guess wrong. Make descriptions specific about format, range, and meaning."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Tool Definition Concepts","cards":[{"front":"inputSchema","back":"The JSON Schema object inside a tool definition. Has type: \"object\", a properties map, and a required array. Claude uses this to know what to pass."},{"front":"properties","back":"A map of parameter name to type definition. Each entry specifies type (string/number/boolean/enum), constraints, and a description Claude reads."},{"front":"required array","back":"Lists which parameter names are mandatory. Parameters with .default() or .optional() in Zod are excluded from required. If Claude omits a required param, the call is rejected."},{"front":"z.enum()","back":"Defines a fixed set of allowed values. Claude picks from your list instead of guessing. Example: z.enum([\"asc\", \"desc\"]) constrains to exactly two valid values."},{"front":"z.string().describe()","back":"Defines a string parameter with a description. Claude reads the description to know what value to generate. Always include .describe() — without it, Claude is guessing blind."},{"front":"Description vs Name","back":"The description is MORE important than the name. Claude reads descriptions to decide WHEN to use a tool. A descriptive name helps, but the description drives the decision."},{"front":"Zod-to-JSON-Schema","back":"The MCP SDK automatically converts your Zod schema to JSON Schema for the tools/list response. You write Zod, Claude receives JSON Schema. The conversion is transparent."}]}'></div>

</div>
