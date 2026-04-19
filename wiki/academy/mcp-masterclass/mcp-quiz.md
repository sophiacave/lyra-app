# MCP Quiz

**Course:** MCP & AI Tool Integration
**Order:** 10
**Type:** quiz
**Access:** Premium

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 10 of 10


  # MCP Mastery Quiz

  Test your knowledge across all three modules — architecture, server building, tool definitions, security, and production patterns.


  ## Course Recap

  You have covered three modules across 10 lessons. Here is the full arc of what you learned.





      Module 1
      ### Architecture


        - What MCP is and why it exists

        - Host, Client, and Server roles

        - JSON-RPC 2.0 message format

        - Transport layers: stdio and Streamable HTTP

        - Capability negotiation lifecycle






      Module 2
      ### Building


        - Your first MCP server from scratch

        - server.tool() definitions with Zod

        - Resources for read-only data

        - Prompts as reusable templates

        - Returning structured content arrays






      Module 3
      ### Production


        - Security: least privilege principle

        - Input validation and sanitization

        - Connecting servers to Claude Desktop

        - Audit logging and error handling

        - Real-world patterns and best practices







  ## Key Concepts Review

  The most important ideas from the course, distilled into quick-reference form.


  ### The 3 MCP Primitives




      🔧
      Tools
      Actions the AI can invoke. Think API endpoints: the model calls them, your handler executes logic, and a result comes back.



      📄
      Resources
      Read-only data the AI can access. Files, database records, configuration — anything the model needs to *read* but not modify.



      💬
      Prompts
      Reusable templates the user selects. They pre-fill context so the AI starts with exactly the right framing for a task.





  ### The server.tool() Signature


    // Three arguments: name, schema, handler
    server.tool(
    "tool-name",            // unique string identifier
    { query: z.string() },   // Zod schema for input validation
    async ({ query }) => {  // handler function
    return {
    content: [{ type: "text", text: "result" }]
    };
    }
    );



  ### Security Principles




      Least Privilege
      Give servers the minimum permissions they need. A read-only DB user cannot run `DROP TABLE` even if a prompt injection gets through.



      Input Validation
      Always validate inputs with Zod schemas. Never trust data from the AI model — treat it like user input from an untrusted source.



      Audit Logging
      Log every tool invocation with timestamps, parameters, and results. When something goes wrong, logs are your only witness.



      Error Boundaries
      Never let exceptions crash the server. Catch errors in handlers, return meaningful messages, and keep the MCP connection alive.





  ## Common MCP Mistakes

  These are the pitfalls that trip up most developers when building MCP servers. If you can avoid these five, you are ahead of the curve.





      1

        Giving servers too many permissions
        Connecting your MCP server with a root database user or full filesystem access is an invitation for disaster. If a prompt injection tricks the AI into calling a destructive tool, those permissions become the blast radius. Always use the most restrictive credentials possible.





      2

        Not validating inputs with Zod schemas
        Skipping schema validation means your handler receives whatever the model sends — including malformed data, SQL fragments, or unexpected types. Zod schemas are your first line of defense. They reject bad input before your code ever sees it.





      3

        Putting business logic in the tool description
        The tool description tells the AI *when* to use the tool — it is not where your logic lives. All computation, API calls, and data processing belong in the handler function. Descriptions should be short, clear sentences explaining the tool's purpose.





      4

        Not handling errors gracefully
        An unhandled exception in a tool handler can crash your entire MCP server, killing the connection for all tools. Wrap handler logic in try/catch blocks and return a structured error response with `isError: true` so the AI can recover and inform the user.





      5

        Exposing sensitive data through Resources without access control
        Resources are powerful because they give the AI direct read access to data. But if you expose environment variables, credentials, or private user data as a Resource without scoping or filtering, the AI can read and potentially leak that information in its responses. Always filter sensitive fields before returning Resource content.






  ## Pre-Quiz Checklist

  Before you take the quiz, do a quick self-assessment. Can you confidently answer each of these?





      I can explain what MCP stands for and why it was created.




      I can name the three components of MCP architecture.




      I know the difference between Tools, Resources, and Prompts.




      I can write a `server.tool()` call with name, schema, and handler.




      I understand the two transport protocols (stdio and Streamable HTTP).




      I can explain the capability negotiation lifecycle.




      I know where to configure MCP servers for Claude Desktop.




      I can list three security principles for production MCP servers.




  If any of these feel shaky, scroll up and review the relevant section before proceeding. The quiz covers all of them.


## Ready? Let's go.

10 questions. You need 8 correct to pass. Good luck.


### Quiz

**Q1: What does MCP stand for?**
    A. Machine Connection Protocol
  ✓ B. Model Context Protocol
    C. Multi-Channel Platform
    D. Module Computation Pipeline
  *MCP stands for Model Context Protocol. It is an open standard created by Anthropic that defines how AI models communicate with external tools and data sources.*

**Q2: What are the three components of MCP architecture?**
    A. Client, Server, Database
  ✓ B. Host, MCP Client, MCP Server
    C. Browser, API, Model
    D. Frontend, Backend, Database
  *The three MCP components are: Host (the AI application like Claude Desktop), MCP Client (the protocol bridge), and MCP Server (your tool or data source).*

**Q3: What transport protocols does MCP support?**
    A. HTTP and WebSocket only
    B. gRPC and REST
  ✓ C. stdio and Streamable HTTP
    D. TCP/IP sockets only
  *MCP supports two transport mechanisms: stdio (standard input/output, ideal for local servers) and Streamable HTTP for remote servers.*

**Q4: In the server.tool() method, what are the three arguments?**
    A. url, method, callback
  ✓ B. name, schema, handler
    C. route, middleware, controller
    D. endpoint, params, response
  *server.tool() takes three arguments: name (a string identifier), schema (a Zod schema defining input parameters), and handler (an async function that executes the tool logic).*

**Q5: What are the three MCP primitives?**
    A. Read, Write, Execute
    B. Input, Output, Error
  ✓ C. Tools, Resources, Prompts
    D. Query, Mutation, Subscription
  *The three MCP primitives are: Tools (actions the AI can take), Resources (data the AI can read), and Prompts (templates the AI can use). Each serves a different purpose.*

**Q6: How does an MCP Server differ from a direct tool call?**
    A. There is no difference
    B. Servers are faster
  ✓ C. Servers are long-running, expose multiple tools, and maintain state
    D. Servers only work with Claude
  *MCP Servers are long-running processes that expose multiple tools, maintain state across calls (like DB connections), and support automatic tool discovery. Direct tool calls are one-off and stateless.*

**Q7: Where do you configure MCP servers for Claude Desktop?**
    A. In the Claude Desktop UI settings
  ✓ B. In claude_desktop_config.json
    C. In the server package.json
    D. In a .env file
  *MCP servers are configured in claude_desktop_config.json, located in ~/Library/Application Support/Claude/ on macOS or %APPDATA%\Claude\ on Windows.*

**Q8: What happens during the MCP capability negotiation phase?**
    A. The user manually selects which tools to enable
  ✓ B. Claude sends initialize, then lists available tools from the server
    C. The server pushes notifications to Claude
    D. The client uploads all data to the server
  *During negotiation, Claude sends an initialize request with its protocol version, the server responds with capabilities, then Claude sends tools/list to discover all available tools.*

**Q9: Which security practice prevents a prompt injection from executing DROP TABLE?**
    A. Rate limiting
    B. Audit logging
  ✓ C. Principle of least privilege
    D. Transport security
  *Principle of least privilege means connecting with minimal permissions (e.g., read-only DB user). Even if a prompt injection gets through, destructive queries are impossible because the server does not have permission.*

**Q10: Which MCP primitive would you use to give Claude access to your project README without executing any code?**
    A. A Tool that reads the file
  ✓ B. A Resource that exposes the file
    C. A Prompt with the content embedded
    D. A Server with full filesystem access
  *Resources are read-only data exposed through MCP. A resource like file://project/README.md gives the AI access to the content without executing any action — it is the safest, most appropriate primitive for read-only data.*



### Course Recap — Key Concepts

**Card 1:**
Front: MCP = ?
Back: Model Context Protocol. An open standard by Anthropic defining how AI models communicate with external tools and data sources.

**Card 2:**
Front: Three MCP components
Back: Host (the AI app), MCP Client (the protocol bridge inside the Host), MCP Server (the tool or data source).

**Card 3:**
Front: Three MCP primitives
Back: Tools (AI-invoked actions), Resources (read-only data), Prompts (user-selected templates).

**Card 4:**
Front: server.tool() signature
Back: server.tool(name, schema, handler) — name is the identifier, schema is a Zod object, handler is an async function returning { content: [...] }.

**Card 5:**
Front: Principle of least privilege
Back: Connect your MCP server with minimal permissions. A read-only DB user cannot execute DROP TABLE even if a prompt injection gets through.
