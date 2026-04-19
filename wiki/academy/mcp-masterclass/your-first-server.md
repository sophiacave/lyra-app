# Your First Server

**Course:** MCP & AI Tool Integration
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 4 of 10


  # Your First Server

  Build a working MCP server from scratch. By the end of this lesson, you will have a real server running on your machine that Claude can talk to. Every line of code is explained.



    ## What You Will Build

    We are building a **note-taking MCP server** — a tool that lets Claude create, read, list, and search notes stored on your machine. It is simple enough to understand in one sitting, but complex enough to teach every pattern you need for production servers.



        ### &#x1F4DD; create_note

        Save a new note with a title and content to disk


        ### &#x1F4C4; read_note

        Retrieve a specific note by its title


        ### &#x1F50D; search_notes

        Search all notes by keyword and return matches





    ## Prerequisites

    You need **Node.js 18+** installed. Check with `node --version` in your terminal. If you do not have it, install from **nodejs.org**.


      Terminalbash
      # Create a project folder and install dependencies
mkdir my-notes-server && cd my-notes-server
npm init -y
npm install @modelcontextprotocol/sdk zod

# Create the server file
touch server.ts




    ## The Complete Server

    Here is the entire server. Read it top to bottom — every section is annotated. After the code, we break down each part in detail.


      server.tsTypeScript
      // ── Imports ──────────────────────────────────────────────
// McpServer: the main class that handles protocol messages
// StdioServerTransport: connects via stdin/stdout (local)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

// ── Storage Setup ────────────────────────────────────────
// Notes are stored as individual .txt files in a "notes" folder
// next to the server. Simple, inspectable, no database needed.
const NOTES_DIR = join(process.cwd(), "notes");
if (!existsSync(NOTES_DIR)) mkdirSync(NOTES_DIR);

// ── Create the Server ────────────────────────────────────
// name: shows up in Claude's tool list as the server identity
// version: used during capability negotiation with the client
const server = new McpServer({
  name: "notes-server",
  version: "1.0.0",
});

// ── Tool 1: create_note ──────────────────────────────────
// server.tool() takes three arguments:
//   1. name    — what Claude calls to invoke this tool
//   2. schema  — Zod schema defining required inputs
//   3. handler — async function that does the actual work
server.tool(
  "create_note",
  {
    title: z.string().describe("The note title (used as filename)"),
    content: z.string().describe("The note body text"),
  },
  async ({ title, content }) => {
    // Sanitize the title to prevent path traversal attacks
    const safe = title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const path = join(NOTES_DIR, `${safe}.txt`);
    writeFileSync(path, content, "utf-8");
    return {
      content: [{ type: "text", text: `Note "${title}" saved.` }],
    };
  }
);

// ── Tool 2: read_note ────────────────────────────────────
server.tool(
  "read_note",
  {
    title: z.string().describe("The title of the note to read"),
  },
  async ({ title }) => {
    const safe = title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const path = join(NOTES_DIR, `${safe}.txt`);
    if (!existsSync(path)) {
      return {
        content: [{ type: "text", text: `Note "${title}" not found.` }],
        isError: true,
      };
    }
    const text = readFileSync(path, "utf-8");
    return {
      content: [{ type: "text", text }],
    };
  }
);

// ── Tool 3: search_notes ─────────────────────────────────
server.tool(
  "search_notes",
  {
    query: z.string().describe("Keyword to search for in note contents"),
  },
  async ({ query }) => {
    const files = readdirSync(NOTES_DIR).filter(f => f.endsWith(".txt"));
    const matches = [];
    for (const file of files) {
      const text = readFileSync(join(NOTES_DIR, file), "utf-8");
      if (text.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ title: file.replace(".txt", ""), preview: text.slice(0, 100) });
      }
    }
    if (matches.length === 0) {
      return { content: [{ type: "text", text: `No notes found matching "${query}".` }] };
    }
    const result = matches.map(m => `• ${m.title}: ${m.preview}...`).join("\n");
    return {
      content: [{ type: "text", text: `Found ${matches.length} match(es):\n${result}` }],
    };
  }
);

// ── Start the Server ─────────────────────────────────────
// StdioServerTransport reads from stdin and writes to stdout.
// Claude Desktop launches this process and communicates
// through these streams — no network, no ports, no config.
const transport = new StdioServerTransport();
await server.connect(transport);





    ## Line-by-Line Breakdown

    Let us walk through the four sections of this server so you understand the pattern deeply enough to build your own.



        ### 1. Imports

        `McpServer` is the core class — it handles the MCP protocol, tool registration, and message routing. `StdioServerTransport` connects via standard input/output, which is how local MCP servers communicate. `zod` defines and validates input schemas — it is the same library Anthropic uses internally.



        ### 2. Server Instance

        `new McpServer({ name, version })` creates the server. The `name` appears in Claude's tool list so users know which server a tool belongs to. The `version` is exchanged during the `initialize` handshake — Claude and the server agree on protocol capabilities before any tool calls happen.



        ### 3. Tool Registration — server.tool(name, schema, handler)

        Each `server.tool()` call registers one capability. The **name** is how Claude invokes it. The **schema** is a Zod object — Claude reads the `.describe()` strings to understand what each parameter means and generates correct values. The **handler** is an async function that receives validated inputs and must return `{ content: [{ type: "text", text: "..." }] }`.



        ### 4. Transport and Connection

        `StdioServerTransport` is for local servers — Claude launches the process and communicates through stdin/stdout. No network ports, no HTTP, no configuration. For remote servers, you would use `StreamableHTTPServerTransport` instead, which exposes the server over HTTP with Server-Sent Events for streaming.





    ## Run and Test It

    Time to see it work. Follow these steps exactly:


      Terminalbash
      # Step 1: Run the server directly to check for errors
npx tsx server.ts
# If it starts without errors, press Ctrl+C to stop it.
# The server is waiting for JSON-RPC input on stdin — that is correct.

# Step 2: Test it manually by piping a JSON-RPC message
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npx tsx server.ts
# You should see a JSON response listing all three tools.



      **What you should see:**
      A JSON response containing `"tools"` with three entries: `create_note`, `read_note`, and `search_notes`. Each includes the name, input schema, and the descriptions you wrote. This is exactly what Claude receives during the discovery phase.




    ## Connect to Claude

    To use this server with Claude Desktop, add it to your config file:


      claude_desktop_config.jsonJSON
      {
  "mcpServers": {
    "notes": {
      "command": "npx",
      "args": ["tsx", "/full/path/to/my-notes-server/server.ts"]
    }
  }
}


    Replace `/full/path/to/` with the actual path to your project folder. Restart Claude Desktop. You should see a hammer icon &#x1F528; indicating tools are available. Try asking Claude: *"Create a note called meeting-notes with today's discussion points."*



    ## Common Mistakes (and How to Fix Them)

    These are the errors developers hit most often when building their first server:



        **&#x274C; "Cannot find module" error**
        You forgot to install dependencies. Run `npm install @modelcontextprotocol/sdk zod` in the project folder. If using `npx tsx`, make sure `tsx` is available globally or in the project.



        **&#x274C; Server starts but Claude says "no tools available"**
        The `command` path in your config is wrong, or you forgot to use the full absolute path. Claude launches the server as a subprocess — relative paths will not resolve. Always use `/Users/you/project/server.ts`, not `./server.ts`.



        **&#x274C; Handler returns wrong format**
        Every handler must return `{ content: [{ type: "text", text: "..." }] }`. Returning a plain string, an object without `content`, or forgetting the array wrapper will cause a protocol error. The `isError: true` flag is optional — use it to tell Claude the tool call failed.



        **&#x274C; console.log() breaks the protocol**
        Because stdio transport uses stdout for JSON-RPC messages, any `console.log()` in your server corrupts the message stream. Use `console.error()` for debugging — stderr is separate and will not interfere with the protocol.





    ## The server.tool() Pattern

    Every MCP server you will ever build follows this same three-argument pattern. Master it once, use it forever:



        name
        A unique snake_case string. This is what Claude calls. Choose descriptive names like `search_notes` not `sn`.


        schema
        A Zod object. Each key is a parameter. Always add `.describe()` — Claude reads these descriptions to know what values to generate.


        handler
        An async function receiving validated args. Must return `{ content: [{ type: "text", text: "..." }] }`. Add `isError: true` on failure.





    ## Why This Architecture?

    You might be wondering: why not just use REST APIs or function calling? Here is why Anthropic designed MCP this way:



        **Stdio is zero-config.**
        No ports, no CORS, no TLS certificates, no firewall rules. Claude launches the server as a child process and talks through pipes. This means your first server works in under 5 minutes, not 5 hours.


        **Zod schemas are self-documenting.**
        Claude reads your `.describe()` strings at runtime to understand your tool. This means the code IS the documentation. No separate OpenAPI spec, no schema file, no sync issues. Change the code, the docs update automatically.


        **The protocol is AI-native.**
        REST APIs were designed for web browsers. MCP was designed for AI models. The tool discovery flow, the structured content responses, the error signaling — all optimized for how LLMs process and decide. That is why it uses JSON-RPC (method + params) instead of REST (URL + verb).





    ## Adapt This Template

    The notes server is a template. Here is how to adapt it for your own use case:



        &#x1F4BE;

          **Database Server**
          Replace the filesystem reads with database queries. Use a connection pool (e.g. `pg` for Postgres) instead of `readFileSync`. The tool pattern stays identical — only the handler internals change.



        &#x1F310;

          **API Wrapper Server**
          Replace filesystem operations with `fetch()` calls to a REST API. Add an `API_KEY` environment variable. Use the `env` field in claude_desktop_config.json to pass it securely.



        &#x1F9E0;

          **Memory / Knowledge Server**
          Replace flat files with a vector database (like Supabase pgvector). Add an embedding step in `create_note` and use cosine similarity in `search_notes`. Same structure, smarter search.







### Quiz

**Q1: What are the three arguments passed to server.tool()?**
    A. url, method, callback
  ✓ B. name, schema, handler
    C. route, middleware, controller
    D. endpoint, params, response
  *server.tool() takes: name (a string identifier), schema (a Zod schema for input parameters), and handler (an async function that runs the tool logic and returns results).*

**Q2: Which npm packages are required to build a basic MCP server in TypeScript?**
    A. express and axios
  ✓ B. @modelcontextprotocol/sdk and zod
    C. fastify and joi
    D. hapi and yup
  *You need @modelcontextprotocol/sdk (for McpServer and StdioServerTransport) and zod (for defining input schemas). Install with: npm install @modelcontextprotocol/sdk zod*

**Q3: Why should you NEVER use console.log() in an MCP server that uses stdio transport?**
    A. It is too slow for production
  ✓ B. It corrupts the JSON-RPC message stream on stdout
    C. Claude ignores console output
    D. It creates security vulnerabilities
  *Stdio transport uses stdout for JSON-RPC protocol messages. Any console.log() output gets mixed into the message stream, corrupting the protocol. Use console.error() instead — stderr is a separate stream.*

**Q4: What must every tool handler return?**
    A. A plain string
    B. An HTTP response object
  ✓ C. An object with content array containing type and text
    D. A JSON-RPC message
  *Every handler must return { content: [{ type: "text", text: "your result" }] }. Optionally add isError: true to signal failure. The content array format allows for future support of images and other content types.*



### Server Code Patterns

**Card 1:**
Front: McpServer
Back: The main class from @modelcontextprotocol/sdk. Instantiate with a name and version, then register tools using server.tool().

**Card 2:**
Front: StdioServerTransport
Back: The transport layer for local servers. Connects your server to Claude via standard input/output streams. Zero-config — no ports or network needed.

**Card 3:**
Front: server.tool() — name argument
Back: A unique snake_case string. This is what Claude calls when it wants to invoke the tool, e.g. "read_file" or "search_documents".

**Card 4:**
Front: server.tool() — schema argument
Back: A Zod object schema defining what parameters the tool accepts. Always use .describe() on each field — Claude reads these descriptions to generate correct values.

**Card 5:**
Front: server.tool() — handler argument
Back: An async function that receives validated args and returns { content: [{ type: "text", text: result }] }. Add isError: true to signal a failed call.

**Card 6:**
Front: console.log() in MCP servers
Back: NEVER use console.log() with stdio transport — it corrupts the JSON-RPC stream. Use console.error() instead, which writes to stderr and does not interfere.

**Card 7:**
Front: Path traversal prevention
Back: Always sanitize file paths in tool handlers. Replace dangerous characters: title.replace(/[^a-zA-Z0-9_-]/g, "_"). Never pass raw user input to filesystem operations.
