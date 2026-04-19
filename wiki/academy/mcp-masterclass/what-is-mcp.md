# What Is MCP?

**Course:** MCP & AI Tool Integration
**Order:** 1
**Type:** lesson
**Access:** Free

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 1 of 10


  # What Is MCP?

  Model Context Protocol is the USB standard for AI. It is how AI goes from answering questions to actually doing things — reading your files, checking your calendar, sending emails, managing code.



    ## The Problem: Isolated AI

    Without MCP, every AI model is an island. It can only work with what is in its training data or what you paste into the chat. It cannot read your files, query your database, or call your APIs. Every integration is custom, fragile, and different.
    Compare how AI integrations work without and with MCP:



        **Without MCP**
        Every AI-tool connection is a custom integration. A GitHub tool built for ChatGPT does not work with Claude. A database connector for Cursor does not work with VS Code. N tools times M clients = N x M custom integrations.


        **With MCP**
        One universal protocol. Build a GitHub MCP server once and it works with Claude, VS Code, Cursor, and any other MCP client. N tools + M clients = N + M implementations. The protocol handles compatibility.





    ## The USB Analogy

    Before USB, every device had its own proprietary connector. Printers, keyboards, cameras — all different. USB created one standard, and everything just worked. MCP does the same for AI.



        ### &#x1F50C; Before USB

        Serial ports, parallel ports, PS/2, proprietary connectors. Every device needed a unique cable and driver. Nothing was interchangeable.


        ### &#x1F9E0; Before MCP

        Custom API wrappers, function calling schemas, bespoke integrations. Every AI-tool connection was hand-built. Nothing was standardized.


        ### &#x1F50C; After USB

        One port, one protocol. Plug in any device and it works. The standard handles discovery, communication, and power delivery.


        ### &#x1F9E0; After MCP

        One protocol for all AI tools. Any MCP server works with any MCP client. The standard handles tool discovery, invocation, and data flow.





    ## Why Did Anthropic Create MCP?

    Before MCP, AI providers each had their own way of connecting to tools. OpenAI had function calling. Google had extensions. Anthropic had tool use. They all worked, but they were all different — if you built a GitHub integration for one, you had to rebuild it from scratch for another.

    Anthropic created MCP as an **open standard** to fix this fragmentation. The key design decisions:



        **Open, not proprietary.**
        MCP is not locked to Claude. Any AI model, any provider can implement it. The spec is public. This means tools built for Claude also work with any other MCP-compatible client.


        **Build once, connect everywhere.**
        A single MCP server works with Claude Desktop, Claude Code, VS Code Copilot, Cursor, and any other MCP client. No adapters, no rewrites. The protocol handles compatibility.


        **Security by design.**
        MCP separates the AI model from the tool execution. The model never has direct access to your database or files — it sends structured requests through the protocol, and the server decides what to allow. This is fundamentally safer than giving AI raw API keys.





    ## What Does an MCP Server Look Like?

    At its core, an MCP server is just a few lines of code. You create a server, register tools, and start listening. Here is a minimal example:


TypeScript — minimal MCP server with one tool

```
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 1. Create the server
const server = new McpServer({
  name: "my-first-server",
  version: "1.0.0",
});

// 2. Register a tool
server.tool(
  "greet",
  "Say hello to someone",
  { name: z.string().describe("Name to greet") },
  async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
  })
);

// 3. Start listening
const transport = new StdioServerTransport();
await server.connect(transport);
```


    That is a complete, working MCP server. When Claude connects to it, it automatically discovers the `greet` tool, knows what arguments it accepts, and can call it. You will build servers like this from scratch later in the course.



    ## What Can AI Do With MCP?

    MCP transforms AI from a question-answering machine into an action-taking assistant. Here are real examples of what becomes possible:



        **&#x1F4C1; Read and write files**
        "Search my project for all TODO comments and create a summary."


        **&#x1F4BE; Query databases**
        "How many new users signed up this week? Show me the trend."


        **&#x1F4BB; Manage code**
        "Create a PR that fixes the bug in issue #42 and tag the reviewer."


        **&#x1F4AC; Send messages**
        "Post the standup summary to #engineering in Slack."


        **&#x1F310; Browse the web**
        "Check our pricing page and tell me if the new tier is live."


        **&#x1F9E0; Remember context**
        "Remember that we decided to use PostgreSQL for the analytics DB."





    ## Key Takeaways



        &#x1F310;
        **MCP = Model Context Protocol.** An open standard created by Anthropic that defines how AI models communicate with external tools and data sources.


        &#x1F50C;
        **It is a universal connector.** Just as USB standardized hardware connections, MCP standardizes AI-to-tool connections. Build once, work everywhere.


        &#x26A1;
        **It makes AI actionable.** Without MCP, AI can only talk. With MCP, AI can read files, query databases, manage repos, send messages, and more.


        &#x1F6E1;
        **Security is built in.** The AI never has direct access to your systems. It sends structured requests through the protocol, and the server controls what is allowed.





    ## MCP vs Other Approaches

    MCP is not the first attempt to connect AI to external tools. But it solves problems that earlier approaches left open. Here is how it compares:



        **Direct API Calls**
        The oldest approach: write custom HTTP calls for every tool you want AI to use. Each integration is unique — different auth patterns, different payloads, different error handling. Nothing is reusable. When the API changes, your integration breaks. MCP replaces this with a single protocol that handles discovery, invocation, and data flow automatically.


        **OpenAI Function Calling**
        OpenAI introduced function calling to let GPT models invoke structured tools. It works well — but only inside OpenAI's ecosystem. Tools you define for GPT cannot be reused with Claude, Gemini, or open-source models. MCP is provider-agnostic: a server built once works with every MCP-compatible client, regardless of which AI model powers it.


        **LangChain Tools**
        LangChain provides a rich library of tool integrations for Python developers. But it is a framework, not a protocol. Your tools are tied to LangChain's abstractions and runtime. If you switch frameworks or want to use tools outside Python, you start over. MCP operates at the protocol level — any language, any framework, any client can participate.



    The pattern is clear: previous approaches tied tool integrations to a specific vendor, framework, or language. MCP breaks that lock-in by defining a universal protocol that any tool and any AI client can speak.



    ## Course Roadmap

    By the end of this course, you will be able to:

      &#x2705; Explain MCP architecture (Hosts, Clients, Servers) and how data flows
      &#x2705; Build a working MCP server from scratch in TypeScript
      &#x2705; Define tools with proper schemas that Claude uses correctly
      &#x2705; Use Resources and Prompts to give AI context and structured workflows
      &#x2705; Connect your server to Claude Desktop and Claude Code
      &#x2705; Apply security best practices for production deployment
      &#x2705; Recognize and implement six real-world server patterns




### Quiz

**Q1: What does MCP stand for?**
    A. Machine Connection Protocol
  ✓ B. Model Context Protocol
    C. Multi-Channel Platform
    D. Module Computation Pipeline
  *MCP stands for Model Context Protocol — an open standard by Anthropic for connecting AI models to external tools and data sources.*

**Q2: Which analogy best describes what MCP does for AI?**
    A. It is like a firewall protecting AI from external threats
  ✓ B. It is like USB — a universal standard that lets AI connect to any tool
    C. It is like a database that stores AI training data
    D. It is like a browser extension that adds features to Claude
  *MCP is like USB: before it, every AI-tool connection was custom and fragile. MCP creates one standard so any server works with any client.*

**Q3: Why did Anthropic make MCP an open standard instead of a Claude-only feature?**
    A. It was required by law
  ✓ B. So tools built once work with any AI client, not just Claude
    C. Because open source is always better
    D. To reduce their development costs
  *By making MCP open, tools built for Claude also work with VS Code Copilot, Cursor, and any other MCP client. This creates a larger ecosystem and makes every tool more valuable.*

**Q4: What is the main advantage of MCP over OpenAI Function Calling and LangChain tools?**
    A. MCP is faster at executing tool calls
  ✓ B. MCP is provider-agnostic — it works across any AI client and any language
    C. MCP has more pre-built integrations than LangChain
    D. MCP does not require any code to set up
  *OpenAI Function Calling only works with GPT models and LangChain tools are tied to its Python framework. MCP is a universal protocol: build a server once and it works with Claude, VS Code, Cursor, and any MCP-compatible client regardless of provider or language.*



### MCP Vocabulary

**Card 1:**
Front: Model Context Protocol
Back: An open standard by Anthropic that defines how AI models communicate with external tools, files, and data sources. Any MCP server works with any MCP client.

**Card 2:**
Front: Why was MCP created?
Back: Before MCP every integration was custom and fragile. MCP standardizes AI-to-tool connections so you build once and it works everywhere — across Claude, VS Code, Cursor, and more.

**Card 3:**
Front: What can AI do WITH MCP that it cannot do without it?
Back: Read files, query databases, call APIs, send messages, manage code repos, browse the web, and take real-world actions beyond just answering questions.

**Card 4:**
Front: MCP security model
Back: The AI never has direct access to your systems. It sends structured requests through the protocol. The MCP server controls what is allowed, acting as a security boundary.

**Card 5:**
Front: MCP ecosystem
Back: Any MCP server works with any MCP-compatible client: Claude Desktop, Claude Code, VS Code, Cursor, and custom apps. Build once, connect everywhere.

**Card 6:**
Front: MCP vs Function Calling vs LangChain
Back: Direct API calls are custom and fragile. OpenAI Function Calling is tied to GPT models. LangChain tools are tied to a Python framework. MCP is a universal, provider-agnostic protocol — any language, any AI client, any tool.
