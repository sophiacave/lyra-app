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
  <p class="subtitle">Build a working MCP server from scratch. By the end of this lesson, you will have a real server running on your machine that Claude can talk to. Every line of code is explained.</p>

  <div class="section">
    <h2>What You Will Build</h2>
    <p>We are building a <strong>note-taking MCP server</strong> — a tool that lets Claude create, read, list, and search notes stored on your machine. It is simple enough to understand in one sitting, but complex enough to teach every pattern you need for production servers.</p>

    <div class="analogy-grid" style="grid-template-columns:1fr 1fr 1fr">
      <div class="analogy-card mcp">
        <h3>&#x1F4DD; create_note</h3>
        <p>Save a new note with a title and content to disk</p>
      </div>
      <div class="analogy-card mcp">
        <h3>&#x1F4C4; read_note</h3>
        <p>Retrieve a specific note by its title</p>
      </div>
      <div class="analogy-card mcp">
        <h3>&#x1F50D; search_notes</h3>
        <p>Search all notes by keyword and return matches</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Prerequisites</h2>
    <p>You need <strong>Node.js 18+</strong> installed. Check with <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px;font-size:.85rem">node --version</code> in your terminal. If you do not have it, install from <strong>nodejs.org</strong>.</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">Terminal</span><span class="lang">bash</span></div>
      <div class="code-body"><span class="cm"># Create a project folder and install dependencies</span>
<span class="kw">mkdir</span> my-notes-server && <span class="kw">cd</span> my-notes-server
<span class="kw">npm</span> init -y
<span class="kw">npm</span> install @modelcontextprotocol/sdk zod

<span class="cm"># Create the server file</span>
<span class="kw">touch</span> server.ts</div>
    </div>
  </div>

  <div class="section">
    <h2>The Complete Server</h2>
    <p>Here is the entire server. Read it top to bottom — every section is annotated. After the code, we break down each part in detail.</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">server.ts</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="cm">// ── Imports ──────────────────────────────────────────────</span>
<span class="cm">// McpServer: the main class that handles protocol messages</span>
<span class="cm">// StdioServerTransport: connects via stdin/stdout (local)</span>
<span class="kw">import</span> { McpServer } <span class="kw">from</span> <span class="str">"@modelcontextprotocol/sdk/server/mcp.js"</span>;
<span class="kw">import</span> { StdioServerTransport } <span class="kw">from</span> <span class="str">"@modelcontextprotocol/sdk/server/stdio.js"</span>;
<span class="kw">import</span> { z } <span class="kw">from</span> <span class="str">"zod"</span>;
<span class="kw">import</span> { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } <span class="kw">from</span> <span class="str">"fs"</span>;
<span class="kw">import</span> { join } <span class="kw">from</span> <span class="str">"path"</span>;

<span class="cm">// ── Storage Setup ────────────────────────────────────────</span>
<span class="cm">// Notes are stored as individual .txt files in a "notes" folder</span>
<span class="cm">// next to the server. Simple, inspectable, no database needed.</span>
<span class="kw">const</span> NOTES_DIR = join(process.cwd(), <span class="str">"notes"</span>);
<span class="kw">if</span> (!existsSync(NOTES_DIR)) mkdirSync(NOTES_DIR);

<span class="cm">// ── Create the Server ────────────────────────────────────</span>
<span class="cm">// name: shows up in Claude's tool list as the server identity</span>
<span class="cm">// version: used during capability negotiation with the client</span>
<span class="kw">const</span> server = <span class="kw">new</span> McpServer({
  name: <span class="str">"notes-server"</span>,
  version: <span class="str">"1.0.0"</span>,
});

<span class="cm">// ── Tool 1: create_note ──────────────────────────────────</span>
<span class="cm">// server.tool() takes three arguments:</span>
<span class="cm">//   1. name    — what Claude calls to invoke this tool</span>
<span class="cm">//   2. schema  — Zod schema defining required inputs</span>
<span class="cm">//   3. handler — async function that does the actual work</span>
server.tool(
  <span class="str">"create_note"</span>,
  {
    title: z.string().describe(<span class="str">"The note title (used as filename)"</span>),
    content: z.string().describe(<span class="str">"The note body text"</span>),
  },
  <span class="kw">async</span> ({ title, content }) => {
    <span class="cm">// Sanitize the title to prevent path traversal attacks</span>
    <span class="kw">const</span> safe = title.replace(<span class="str">/[^a-zA-Z0-9_-]/g</span>, <span class="str">"_"</span>);
    <span class="kw">const</span> path = join(NOTES_DIR, <span class="str">`${safe}.txt`</span>);
    writeFileSync(path, content, <span class="str">"utf-8"</span>);
    <span class="kw">return</span> {
      content: [{ type: <span class="str">"text"</span>, text: <span class="str">`Note "${title}" saved.`</span> }],
    };
  }
);

<span class="cm">// ── Tool 2: read_note ────────────────────────────────────</span>
server.tool(
  <span class="str">"read_note"</span>,
  {
    title: z.string().describe(<span class="str">"The title of the note to read"</span>),
  },
  <span class="kw">async</span> ({ title }) => {
    <span class="kw">const</span> safe = title.replace(<span class="str">/[^a-zA-Z0-9_-]/g</span>, <span class="str">"_"</span>);
    <span class="kw">const</span> path = join(NOTES_DIR, <span class="str">`${safe}.txt`</span>);
    <span class="kw">if</span> (!existsSync(path)) {
      <span class="kw">return</span> {
        content: [{ type: <span class="str">"text"</span>, text: <span class="str">`Note "${title}" not found.`</span> }],
        isError: <span class="kw">true</span>,
      };
    }
    <span class="kw">const</span> text = readFileSync(path, <span class="str">"utf-8"</span>);
    <span class="kw">return</span> {
      content: [{ type: <span class="str">"text"</span>, text }],
    };
  }
);

<span class="cm">// ── Tool 3: search_notes ─────────────────────────────────</span>
server.tool(
  <span class="str">"search_notes"</span>,
  {
    query: z.string().describe(<span class="str">"Keyword to search for in note contents"</span>),
  },
  <span class="kw">async</span> ({ query }) => {
    <span class="kw">const</span> files = readdirSync(NOTES_DIR).filter(f => f.endsWith(<span class="str">".txt"</span>));
    <span class="kw">const</span> matches = [];
    <span class="kw">for</span> (<span class="kw">const</span> file <span class="kw">of</span> files) {
      <span class="kw">const</span> text = readFileSync(join(NOTES_DIR, file), <span class="str">"utf-8"</span>);
      <span class="kw">if</span> (text.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ title: file.replace(<span class="str">".txt"</span>, <span class="str">""</span>), preview: text.slice(0, 100) });
      }
    }
    <span class="kw">if</span> (matches.length === 0) {
      <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: <span class="str">`No notes found matching "${query}".`</span> }] };
    }
    <span class="kw">const</span> result = matches.map(m => <span class="str">`• ${m.title}: ${m.preview}...`</span>).join(<span class="str">"\n"</span>);
    <span class="kw">return</span> {
      content: [{ type: <span class="str">"text"</span>, text: <span class="str">`Found ${matches.length} match(es):\n${result}`</span> }],
    };
  }
);

<span class="cm">// ── Start the Server ─────────────────────────────────────</span>
<span class="cm">// StdioServerTransport reads from stdin and writes to stdout.</span>
<span class="cm">// Claude Desktop launches this process and communicates</span>
<span class="cm">// through these streams — no network, no ports, no config.</span>
<span class="kw">const</span> transport = <span class="kw">new</span> StdioServerTransport();
<span class="kw">await</span> server.connect(transport);
</div>
    </div>
  </div>

  <div class="section">
    <h2>Line-by-Line Breakdown</h2>
    <p>Let us walk through the four sections of this server so you understand the pattern deeply enough to build your own.</p>

    <div style="display:flex;flex-direction:column;gap:1.25rem">
      <div style="padding:1.25rem;border-radius:12px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.12)">
        <h3 style="color:#8b5cf6;margin:0 0 .5rem">1. Imports</h3>
        <p style="font-size:.9rem;color:#a1a1aa;margin:0"><code>McpServer</code> is the core class — it handles the MCP protocol, tool registration, and message routing. <code>StdioServerTransport</code> connects via standard input/output, which is how local MCP servers communicate. <code>zod</code> defines and validates input schemas — it is the same library Anthropic uses internally.</p>
      </div>

      <div style="padding:1.25rem;border-radius:12px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.12)">
        <h3 style="color:#fb923c;margin:0 0 .5rem">2. Server Instance</h3>
        <p style="font-size:.9rem;color:#a1a1aa;margin:0"><code>new McpServer({ name, version })</code> creates the server. The <code>name</code> appears in Claude's tool list so users know which server a tool belongs to. The <code>version</code> is exchanged during the <code>initialize</code> handshake — Claude and the server agree on protocol capabilities before any tool calls happen.</p>
      </div>

      <div style="padding:1.25rem;border-radius:12px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.12)">
        <h3 style="color:#34d399;margin:0 0 .5rem">3. Tool Registration — server.tool(name, schema, handler)</h3>
        <p style="font-size:.9rem;color:#a1a1aa;margin:0">Each <code>server.tool()</code> call registers one capability. The <strong>name</strong> is how Claude invokes it. The <strong>schema</strong> is a Zod object — Claude reads the <code>.describe()</code> strings to understand what each parameter means and generates correct values. The <strong>handler</strong> is an async function that receives validated inputs and must return <code>{ content: [{ type: "text", text: "..." }] }</code>.</p>
      </div>

      <div style="padding:1.25rem;border-radius:12px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.12)">
        <h3 style="color:#38bdf8;margin:0 0 .5rem">4. Transport and Connection</h3>
        <p style="font-size:.9rem;color:#a1a1aa;margin:0"><code>StdioServerTransport</code> is for local servers — Claude launches the process and communicates through stdin/stdout. No network ports, no HTTP, no configuration. For remote servers, you would use <code>StreamableHTTPServerTransport</code> instead, which exposes the server over HTTP with Server-Sent Events for streaming.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Run and Test It</h2>
    <p>Time to see it work. Follow these steps exactly:</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">Terminal</span><span class="lang">bash</span></div>
      <div class="code-body"><span class="cm"># Step 1: Run the server directly to check for errors</span>
<span class="kw">npx</span> tsx server.ts
<span class="cm"># If it starts without errors, press Ctrl+C to stop it.</span>
<span class="cm"># The server is waiting for JSON-RPC input on stdin — that is correct.</span>

<span class="cm"># Step 2: Test it manually by piping a JSON-RPC message</span>
<span class="kw">echo</span> '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | <span class="kw">npx</span> tsx server.ts
<span class="cm"># You should see a JSON response listing all three tools.</span></div>
    </div>

    <div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.15);border-radius:12px;padding:1.25rem;margin-top:1.5rem">
      <strong style="color:#34d399">What you should see:</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.5rem 0 0">A JSON response containing <code>"tools"</code> with three entries: <code>create_note</code>, <code>read_note</code>, and <code>search_notes</code>. Each includes the name, input schema, and the descriptions you wrote. This is exactly what Claude receives during the discovery phase.</p>
    </div>
  </div>

  <div class="section">
    <h2>Connect to Claude</h2>
    <p>To use this server with Claude Desktop, add it to your config file:</p>

    <div class="code-block">
      <div class="code-header"><span class="filename">claude_desktop_config.json</span><span class="lang">JSON</span></div>
      <div class="code-body">{
  <span class="key">"mcpServers"</span>: {
    <span class="key">"notes"</span>: {
      <span class="key">"command"</span>: <span class="str">"npx"</span>,
      <span class="key">"args"</span>: [<span class="str">"tsx"</span>, <span class="str">"/full/path/to/my-notes-server/server.ts"</span>]
    }
  }
}</div>
    </div>

    <p style="font-size:.85rem;color:#a1a1aa">Replace <code>/full/path/to/</code> with the actual path to your project folder. Restart Claude Desktop. You should see a hammer icon &#x1F528; indicating tools are available. Try asking Claude: <em>"Create a note called meeting-notes with today's discussion points."</em></p>
  </div>

  <div class="section">
    <h2>Common Mistakes (and How to Fix Them)</h2>
    <p>These are the errors developers hit most often when building their first server:</p>

    <div style="display:flex;flex-direction:column;gap:1rem">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.9rem">&#x274C; "Cannot find module" error</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">You forgot to install dependencies. Run <code>npm install @modelcontextprotocol/sdk zod</code> in the project folder. If using <code>npx tsx</code>, make sure <code>tsx</code> is available globally or in the project.</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.9rem">&#x274C; Server starts but Claude says "no tools available"</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The <code>command</code> path in your config is wrong, or you forgot to use the full absolute path. Claude launches the server as a subprocess — relative paths will not resolve. Always use <code>/Users/you/project/server.ts</code>, not <code>./server.ts</code>.</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.9rem">&#x274C; Handler returns wrong format</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Every handler must return <code>{ content: [{ type: "text", text: "..." }] }</code>. Returning a plain string, an object without <code>content</code>, or forgetting the array wrapper will cause a protocol error. The <code>isError: true</code> flag is optional — use it to tell Claude the tool call failed.</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)">
        <strong style="color:#ef4444;font-size:.9rem">&#x274C; console.log() breaks the protocol</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Because stdio transport uses stdout for JSON-RPC messages, any <code>console.log()</code> in your server corrupts the message stream. Use <code>console.error()</code> for debugging — stderr is separate and will not interfere with the protocol.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The server.tool() Pattern</h2>
    <p>Every MCP server you will ever build follows this same three-argument pattern. Master it once, use it forever:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.05);border:1px solid rgba(139,92,246,.1)">
        <span style="font-weight:700;color:#8b5cf6;font-size:.85rem;min-width:80px">name</span>
        <span style="font-size:.85rem;color:#a1a1aa">A unique snake_case string. This is what Claude calls. Choose descriptive names like <code>search_notes</code> not <code>sn</code>.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.05);border:1px solid rgba(251,146,60,.1)">
        <span style="font-weight:700;color:#fb923c;font-size:.85rem;min-width:80px">schema</span>
        <span style="font-size:.85rem;color:#a1a1aa">A Zod object. Each key is a parameter. Always add <code>.describe()</code> — Claude reads these descriptions to know what values to generate.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.05);border:1px solid rgba(52,211,153,.1)">
        <span style="font-weight:700;color:#34d399;font-size:.85rem;min-width:80px">handler</span>
        <span style="font-size:.85rem;color:#a1a1aa">An async function receiving validated args. Must return <code>{ content: [{ type: "text", text: "..." }] }</code>. Add <code>isError: true</code> on failure.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Why This Architecture?</h2>
    <p>You might be wondering: why not just use REST APIs or function calling? Here is why Anthropic designed MCP this way:</p>

    <div style="display:flex;flex-direction:column;gap:1rem">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Stdio is zero-config.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">No ports, no CORS, no TLS certificates, no firewall rules. Claude launches the server as a child process and talks through pipes. This means your first server works in under 5 minutes, not 5 hours.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Zod schemas are self-documenting.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Claude reads your <code>.describe()</code> strings at runtime to understand your tool. This means the code IS the documentation. No separate OpenAPI spec, no schema file, no sync issues. Change the code, the docs update automatically.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">The protocol is AI-native.</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">REST APIs were designed for web browsers. MCP was designed for AI models. The tool discovery flow, the structured content responses, the error signaling — all optimized for how LLMs process and decide. That is why it uses JSON-RPC (method + params) instead of REST (URL + verb).</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Adapt This Template</h2>
    <p>The notes server is a template. Here is how to adapt it for your own use case:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem">
      <div style="display:flex;gap:.75rem;align-items:flex-start;padding:1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="font-size:1.2rem">&#x1F4BE;</span>
        <div>
          <strong style="font-size:.9rem">Database Server</strong>
          <p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Replace the filesystem reads with database queries. Use a connection pool (e.g. <code>pg</code> for Postgres) instead of <code>readFileSync</code>. The tool pattern stays identical — only the handler internals change.</p>
        </div>
      </div>
      <div style="display:flex;gap:.75rem;align-items:flex-start;padding:1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="font-size:1.2rem">&#x1F310;</span>
        <div>
          <strong style="font-size:.9rem">API Wrapper Server</strong>
          <p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Replace filesystem operations with <code>fetch()</code> calls to a REST API. Add an <code>API_KEY</code> environment variable. Use the <code>env</code> field in claude_desktop_config.json to pass it securely.</p>
        </div>
      </div>
      <div style="display:flex;gap:.75rem;align-items:flex-start;padding:1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="font-size:1.2rem">&#x1F9E0;</span>
        <div>
          <strong style="font-size:.9rem">Memory / Knowledge Server</strong>
          <p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Replace flat files with a vector database (like Supabase pgvector). Add an embedding step in <code>create_note</code> and use cosine similarity in <code>search_notes</code>. Same structure, smarter search.</p>
        </div>
      </div>
    </div>
  </div>


  <div data-learn="QuizMC" data-props='{"title":"Server Building Quiz","questions":[{"q":"What are the three arguments passed to server.tool()?","options":["url, method, callback","name, schema, handler","route, middleware, controller","endpoint, params, response"],"correct":1,"explanation":"server.tool() takes: name (a string identifier), schema (a Zod schema for input parameters), and handler (an async function that runs the tool logic and returns results)."},{"q":"Which npm packages are required to build a basic MCP server in TypeScript?","options":["express and axios","@modelcontextprotocol/sdk and zod","fastify and joi","hapi and yup"],"correct":1,"explanation":"You need @modelcontextprotocol/sdk (for McpServer and StdioServerTransport) and zod (for defining input schemas). Install with: npm install @modelcontextprotocol/sdk zod"},{"q":"Why should you NEVER use console.log() in an MCP server that uses stdio transport?","options":["It is too slow for production","It corrupts the JSON-RPC message stream on stdout","Claude ignores console output","It creates security vulnerabilities"],"correct":1,"explanation":"Stdio transport uses stdout for JSON-RPC protocol messages. Any console.log() output gets mixed into the message stream, corrupting the protocol. Use console.error() instead — stderr is a separate stream."},{"q":"What must every tool handler return?","options":["A plain string","An HTTP response object","An object with content array containing type and text","A JSON-RPC message"],"correct":2,"explanation":"Every handler must return { content: [{ type: \"text\", text: \"your result\" }] }. Optionally add isError: true to signal failure. The content array format allows for future support of images and other content types."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Server Code Patterns","cards":[{"front":"McpServer","back":"The main class from @modelcontextprotocol/sdk. Instantiate with a name and version, then register tools using server.tool()."},{"front":"StdioServerTransport","back":"The transport layer for local servers. Connects your server to Claude via standard input/output streams. Zero-config — no ports or network needed."},{"front":"server.tool() — name argument","back":"A unique snake_case string. This is what Claude calls when it wants to invoke the tool, e.g. \"read_file\" or \"search_documents\"."},{"front":"server.tool() — schema argument","back":"A Zod object schema defining what parameters the tool accepts. Always use .describe() on each field — Claude reads these descriptions to generate correct values."},{"front":"server.tool() — handler argument","back":"An async function that receives validated args and returns { content: [{ type: \"text\", text: result }] }. Add isError: true to signal a failed call."},{"front":"console.log() in MCP servers","back":"NEVER use console.log() with stdio transport — it corrupts the JSON-RPC stream. Use console.error() instead, which writes to stderr and does not interfere."},{"front":"Path traversal prevention","back":"Always sanitize file paths in tool handlers. Replace dangerous characters: title.replace(/[^a-zA-Z0-9_-]/g, \"_\"). Never pass raw user input to filesystem operations."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Steps to Build Your First MCP Server","instruction":"Arrange these steps in the correct order","items":["npm install @modelcontextprotocol/sdk zod","Import McpServer and StdioServerTransport","Create McpServer instance with name and version","Register tools with server.tool(name, schema, handler)","Create StdioServerTransport and call server.connect(transport)","Add server to claude_desktop_config.json and restart Claude"]}'></div>

</div>
