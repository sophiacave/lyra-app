# Resources and Prompts

**Course:** MCP & AI Tool Integration
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 6 of 10


  # Resources & Prompts

  MCP has three primitives: Tools, Resources, and Prompts. You already know Tools. This lesson covers the other two — data the AI can read (Resources) and interaction templates the user can select (Prompts) — with working code for both.



    ## The Three MCP Primitives

    Think of MCP primitives as three different directions of information flow:



        &#x2699;&#xFE0F;
        **Tools**
        Actions the AI can take


        &#x1F4C4;
        **Resources**
        Data the AI can read


        &#x1F4DD;
        **Prompts**
        Templates the user selects





    ## Side-by-Side Comparison



        AspectToolsResourcesPrompts


        **Direction**AI → WorldWorld → AIUser → AI
        **Triggered by**AI model decidesClient/user requestsUser selects
        **Purpose**Execute actionsProvide contextStructure interactions
        **Example**Write a fileRead config dataCode review template
        **State change**Yes (side effects)No (read-only)No (templates only)
        **Discovery**tools/listresources/listprompts/list
        **Who initiates**The AI autonomouslyThe app or userThe user from a menu





    ## Resources: Giving AI Read-Only Data

    A Resource is read-only data your server exposes to the AI through a URI. Unlike tools, resources do not execute actions or cause side effects. They are for providing context — configuration files, documentation, database schemas, API specs.


      **When to use a Resource instead of a Tool:** If the data is read-only and the AI does not need to decide *when* to fetch it — use a Resource. If the AI needs to take an action or make a decision about *when* to fetch data — use a Tool. Example: A project README is a Resource. A database query is a Tool.



      Resource ExampleTypeScript
      import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "fs";

const server = new McpServer({ name: "project-context", version: "1.0.0" });

// ── Static Resource: project README ──────────────────────
// URI scheme is up to you — file://, docs://, project:// all work.
// The URI is how the client requests this specific resource.
server.resource(
  "project-readme",                        // unique name
  "file:///project/README.md",              // URI
  async () => ({
    contents: [{
      uri: "file:///project/README.md",
      text: readFileSync("./README.md", "utf-8"),
      mimeType: "text/markdown",
    }],
  })
);

// ── Dynamic Resource: database schema ────────────────────
// Resources can be dynamic — the handler runs each time
// the resource is requested, returning fresh data.
server.resource(
  "db-schema",
  "db://schema/tables",
  async () => {
    const tables = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    return {
      contents: [{
        uri: "db://schema/tables",
        text: tables.rows.map(t => t.table_name).join("\n"),
        mimeType: "text/plain",
      }],
    };
  }
);




        name
        A human-readable identifier. Shows up in resource listings.


        URI
        The address the client uses to request this resource. You define the scheme (`file://`, `db://`, etc.).


        handler
        Async function returning `{ contents: [{ uri, text, mimeType }] }`. Runs when the resource is read.





    ## Prompts: Reusable Interaction Templates

    A Prompt is a reusable template that structures how the user interacts with the AI. Think of prompts as pre-built workflows — the user selects one from a menu, optionally fills in parameters, and the AI receives a structured starting point.


      **When to use a Prompt:** When you want to give users a structured starting point for common tasks. Code reviews, bug reports, data analysis templates, content generation workflows — anything where the same interaction pattern repeats.



      Prompt ExampleTypeScript
      // ── Prompt: Code Review Template ─────────────────────────
// The user selects this from a menu in Claude Desktop.
// Claude receives structured instructions for the review.
server.prompt(
  "code-review",                           // unique name
  {
    file_path: z.string().describe("Path to the file to review"),
    focus: z.enum(["security", "performance", "readability", "all"])
      .default("all")
      .describe("What aspect to focus the review on"),
  },
  async ({ file_path, focus }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Review the file at ${file_path}. Focus on: ${focus}.\n\nProvide:\n1. A summary of what the code does\n2. Issues found (ranked by severity)\n3. Specific suggestions with code examples\n4. An overall quality score (1-10)`,
      },
    }],
  })
);

// ── Prompt: Bug Report Template ──────────────────────────
server.prompt(
  "bug-report",
  {
    title: z.string().describe("Short bug title"),
    steps: z.string().describe("Steps to reproduce the bug"),
    expected: z.string().describe("What should happen"),
    actual: z.string().describe("What actually happens"),
  },
  async ({ title, steps, expected, actual }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Analyze this bug and suggest a fix:\n\n**Bug:** ${title}\n**Steps:** ${steps}\n**Expected:** ${expected}\n**Actual:** ${actual}\n\nIdentify the likely root cause, suggest a fix with code, and recommend a test to prevent regression.`,
      },
    }],
  })
);




        name
        Unique identifier. Shows in the prompt selection menu in Claude Desktop.


        schema
        Zod schema for parameters the user fills in. Same syntax as tool schemas.


        handler
        Returns `{ messages: [{ role, content }] }`. These messages are injected into the conversation as if the user typed them.





    ## Tools vs Resources vs Prompts — Decision Tree

    Use this decision tree when building your server to choose the right primitive:



        **Does the AI need to take an action or modify state?**
        Yes → **Use a Tool.** Tools execute code, write files, send messages, query databases. The AI decides when to call them.


        **Does the AI need read-only context that does not change based on user input?**
        Yes → **Use a Resource.** Resources provide background context like documentation, schemas, or config. The client or user requests them.


        **Do you want to give users a pre-built workflow they can select?**
        Yes → **Use a Prompt.** Prompts structure the conversation from the start. Users pick them from a menu and fill in parameters.





    ## Combining All Three

    In practice, a production server often uses all three primitives together. Here is how they complement each other in a documentation server:



        Resource
        `docs://api/openapi.json` — The API spec. Loaded once when the server connects. Gives Claude full context about available endpoints.


        Tool
        `search_docs` — Searches documentation by keyword. Claude calls this when the user asks "how do I authenticate?"


        Prompt
        `api-integration` — Template: "Help me integrate the [endpoint] endpoint in [language]." User fills in the blanks, Claude gets structured instructions.





### MCP Primitives

**Card 1:**
Front: Tools
Back: Actions the AI invokes autonomously. Direction: AI to World. They cause side effects — writing files, sending emails, querying databases. Registered with server.tool().

**Card 2:**
Front: Resources
Back: Read-only data the client or user requests. Direction: World to AI. No side effects — just providing context. Registered with server.resource(name, uri, handler).

**Card 3:**
Front: Prompts
Back: Reusable templates the user selects from a menu. Direction: User to AI. They structure the conversation with pre-built workflows. Registered with server.prompt(name, schema, handler).

**Card 4:**
Front: server.resource() return format
Back: Returns { contents: [{ uri, text, mimeType }] }. The uri matches the resource URI. mimeType helps Claude understand the content format.

**Card 5:**
Front: server.prompt() return format
Back: Returns { messages: [{ role: "user", content: { type: "text", text: "..." } }] }. These messages are injected into the conversation as if the user typed them.

**Card 6:**
Front: Resource URI
Back: A URI like file://project/README.md or db://schema/tables. You define the scheme. The client uses this URI to request specific resources via resources/read.

**Card 7:**
Front: When to use Resource vs Tool
Back: Resource = read-only context that does not depend on user input. Tool = action that modifies state or requires the AI to decide when to fetch data.



### Quiz

**Q1: Which MCP primitive would you use to give Claude read-only access to your project README without executing any code?**
    A. A Tool that reads the file
  ✓ B. A Resource that exposes the file
    C. A Prompt with the content embedded
    D. A Server with full filesystem access
  *Resources are read-only data exposed through MCP. A resource like file://project/README.md gives the AI the content without any action or side effects — the safest choice for read-only data.*

**Q2: Which primitive is triggered by the AI model deciding on its own — NOT by the user selecting it?**
    A. Resources
    B. Prompts
  ✓ C. Tools
    D. Discovery
  *Tools are invoked autonomously by the AI model when it decides an action is needed. Resources are requested by the client or user. Prompts are selected by the user from a menu.*

**Q3: What does server.prompt() return?**
    A. { content: [{ type: "text", text: "..." }] }
    B. { contents: [{ uri, text, mimeType }] }
  ✓ C. { messages: [{ role, content }] }
    D. A plain string
  *server.prompt() returns { messages: [{ role: "user", content: { type: "text", text: "..." } }] }. These messages are injected into the conversation, giving Claude structured instructions based on the user selections.*

**Q4: A documentation server exposes an API spec that Claude should always have access to. Which primitive is best?**
    A. A Tool that reads the spec on demand
  ✓ B. A Resource that exposes the spec via URI
    C. A Prompt that includes the spec text
    D. A separate server just for the spec
  *A Resource is perfect for static or semi-static data that provides context. The API spec does not change based on user input and does not cause side effects — it is read-only context.*
