# MCP Architecture: How Hosts, Clients, and Servers Work Together

**Course:** MCP & AI Tool Integration
**Order:** 2
**Type:** lesson
**Access:** Free

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 2 of 10


  # MCP Architecture

  Three components, one protocol. Understand how Hosts, Clients, and Servers form the MCP communication layer.



    ## The Three Components

    MCP has three components that work together:



        **&#x1F9E0; Host Application**
        The AI application the user interacts with — like Claude Desktop, Claude Code, or a custom app built with the Anthropic SDK. The Host initiates MCP connections and decides which servers to connect to. It contains one or more MCP Clients.
        **Role:** Receives user input, decides when tools are needed, orchestrates the overall interaction.


        **&#x1F310; MCP Client**
        A protocol bridge inside the Host that maintains a 1:1 connection with a single MCP Server. Each Client handles negotiation, capability exchange, and message routing for its server.
        **Role:** Translates between the Host's internal format and the MCP protocol. One Client per Server connection.


        **&#x2699;&#xFE0F; MCP Server**
        A lightweight program that exposes tools, resources, or prompts to the AI through the MCP protocol. Servers are where the business logic lives — reading files, querying databases, calling APIs.
        **Role:** Receives tool calls from the Client, executes them, and returns results.





    ## Data Flow — Step by Step

    Here is the complete request lifecycle when a user asks a question that requires external data:



        1
        **User asks a question** — "What files are in my project directory?"


        2
        **Host realizes it needs external data** — The LLM sees available tools and decides to use the filesystem tool.


        3
        **Client sends request to Server** — MCP Client sends a tools/call request via JSON-RPC to the filesystem server.


        4
        **Server executes and returns data** — Filesystem server reads the directory and returns the file listing.


        5
        **Host generates an informed answer** — The LLM uses the real file data to respond accurately to the user.





    ## Why JSON-RPC?

    MCP uses JSON-RPC instead of REST, GraphQL, or gRPC. Here is why:



        **JSON-RPC is method-based, not URL-based.**
        REST maps operations to URLs and HTTP verbs (`GET /tools`, `POST /tools/call`). JSON-RPC uses a single channel with method names (`{"method": "tools/call"}`). This works over any transport — stdio pipes, WebSockets, HTTP — without needing URL routing.


        **It works over stdio.**
        Local MCP servers communicate through stdin/stdout — no network stack needed. REST requires an HTTP server, a port, and URL parsing. JSON-RPC is just JSON messages on a stream, making local servers trivially simple to build.


        **Bidirectional by design.**
        JSON-RPC supports both request/response AND notifications (one-way messages). This lets servers send progress updates, log events, or signal resource changes back to the client without being asked. REST is strictly request/response.





    ## Transport Layer

    MCP supports two transport mechanisms. The transport is separate from the protocol — the same server code works with either:



        **stdio (Local Servers)**
        Claude launches the server as a child process. Messages flow through stdin/stdout. **Zero configuration** — no ports, no TLS, no firewall rules. Ideal for personal tools and local development.


        **Streamable HTTP (Remote Servers)**
        The server runs on a remote machine and exposes an HTTP endpoint. Uses Server-Sent Events (SSE) for streaming responses. Required for team-shared servers, cloud deployments, and multi-user setups.





    ## Capability Negotiation

    Before any tools are called or resources accessed, the Client and Server perform an **initialize handshake**. This is the first message in every MCP connection — nothing else can happen until it completes.



        **Step 1 — Client sends `initialize` request**
        The Client tells the Server which protocol version it supports and what capabilities it has (like `roots` for filesystem access or `sampling` for LLM inference). This lets the Server know what it can ask the Client to do.


        **Step 2 — Server responds with its capabilities**
        The Server declares exactly what it supports: `tools` (callable functions), `resources` (data the AI can read), and `prompts` (reusable prompt templates). It also confirms the protocol version it will use. If the versions are incompatible, the connection fails gracefully.


        **Step 3 — Client sends `initialized` notification**
        Once the Client processes the Server's capabilities, it sends an `initialized` notification (a one-way message, no response expected). Only after this notification can the Client begin calling tools or reading resources.



    Here is what the initialize handshake looks like on the wire:


      Client → Server: initialize request

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "Claude Desktop",
      "version": "1.5.0"
    }
  }
}
```




      Server → Client: initialize response

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true },
      "prompts": { "listChanged": true }
    },
    "serverInfo": {
      "name": "filesystem-server",
      "version": "0.3.1"
    }
  }
}
```



    Notice the Server declares it supports `tools`, `resources`, and `prompts`. The `listChanged` flag means the Server can notify the Client if its available tools change at runtime — enabling dynamic tool discovery without reconnecting.



    ## What Happens When Something Goes Wrong

    The protocol has built-in error handling for every failure mode:



        Server crashes
        The Client detects the broken pipe and reports to the Host. Claude tells the user the tool is unavailable. No silent failures.


        Invalid arguments
        The MCP SDK validates inputs against your Zod schema before calling your handler. Invalid calls are rejected with a clear error — your code never sees bad data.


        Handler throws
        If your tool handler throws an unhandled exception, the SDK catches it and returns a JSON-RPC error response. The server stays running.


        Version mismatch
        During `initialize`, client and server exchange protocol versions. If incompatible, the connection is rejected gracefully with a clear message.





    ## Architecture in Practice: A Real Example

    Theory makes more sense with a concrete scenario. Here is how Claude Desktop looks when connected to three MCP servers — a common real-world setup for a developer:



        **Claude Desktop (Host)**
        Contains 3 MCP Clients — one per server connection




          **Client A**
          &#x2195;

            **Filesystem Server**
            stdio transport
Tools: read_file, write_file, list_directory, search_files



          **Client B**
          &#x2195;

            **GitHub Server**
            stdio transport
Tools: create_issue, search_repos, create_pr, list_commits



          **Client C**
          &#x2195;

            **Database Server**
            Streamable HTTP
Tools: query, list_tables
Resources: schema://tables





    Key things to notice in this architecture:



        1
        **One Client per Server.** Client A only talks to the Filesystem Server. It knows nothing about GitHub or the database. Each connection is isolated.


        2
        **Mixed transports.** The Filesystem and GitHub servers use stdio (local processes). The Database server uses Streamable HTTP (remote, shared with the team). The Host handles both transparently.


        3
        **The Host sees all tools.** Even though tools come from different servers, the LLM sees a unified tool list. When it decides to call `search_files`, the Host routes the call to Client A, which forwards it to the Filesystem Server. The LLM does not need to know which server provides which tool.


        4
        **Each connection negotiated independently.** Client C's Database Server declared `resources` capability (exposing database schemas as readable resources). Clients A and B did not — their servers only expose tools. The Host adapts to each server's capabilities.



    This is the power of MCP's architecture — the protocol handles all the complexity of multiple connections, different transports, and varying capabilities. You configure which servers to connect to, and the Host handles the rest.



### MCP Architecture Concepts

**Card 1:**
Front: Host
Back: The AI application the user interacts with — Claude Desktop, Claude Code, or a custom SDK app. Contains one or more MCP Clients.

**Card 2:**
Front: MCP Client
Back: A protocol bridge inside the Host that maintains a 1:1 connection with a single MCP Server. Handles negotiation and message routing.

**Card 3:**
Front: MCP Server
Back: A lightweight program that exposes tools, resources, or prompts to the AI through the MCP protocol.

**Card 4:**
Front: JSON-RPC
Back: The message format used for communication between MCP Client and Server. Structured as method calls with parameters and responses.

**Card 5:**
Front: Data Flow
Back: User asks a question, Host identifies a tool is needed, Client sends tools/call to Server, Server executes and returns data, Host generates an informed answer.

**Card 6:**
Front: Initialize Handshake
Back: The first message in every MCP connection. The Client sends an initialize request with its protocol version and capabilities. The Server responds with its own capabilities (tools, resources, prompts). The Client then sends an initialized notification to complete the handshake.

**Card 7:**
Front: Capability Negotiation
Back: During initialize, the Server declares what it supports — tools (callable functions), resources (readable data), and prompts (reusable templates). The Client declares its capabilities too, like roots (filesystem access) and sampling (LLM inference).

**Card 8:**
Front: listChanged Flag
Back: A capability flag that indicates a Server can notify the Client when its available tools, resources, or prompts change at runtime — enabling dynamic discovery without reconnecting.



### Quiz

**Q1: Which MCP component is responsible for maintaining a 1:1 connection with a single MCP Server?**
    A. Host
  ✓ B. MCP Client
    C. MCP Server
    D. Transport Layer
  *The MCP Client lives inside the Host and maintains a 1:1 connection with one MCP Server. It handles protocol negotiation, capability exchange, and message routing.*

**Q2: What protocol does the MCP Client use to communicate with the MCP Server?**
    A. REST
    B. GraphQL
  ✓ C. JSON-RPC
    D. gRPC
  *MCP uses JSON-RPC (JSON Remote Procedure Call) for communication between the MCP Client and MCP Server.*

**Q3: What must happen before a Client can call any tools on a Server?**
    A. The Client must authenticate with an API key
  ✓ B. The initialize handshake must complete, ending with an initialized notification
    C. The Server must be registered in a central registry
    D. The Host must restart
  *The initialize handshake is mandatory. The Client sends initialize, the Server responds with its capabilities, and the Client sends an initialized notification. Only after this sequence can tools be called.*

**Q4: In a setup where Claude Desktop is connected to 3 MCP servers, how many MCP Clients exist inside the Host?**
    A. 1 — the Host has a single Client that manages all servers
  ✓ B. 3 — one Client per Server connection
    C. It depends on the transport type
    D. None — the Host communicates directly with servers
  *MCP uses a 1:1 relationship between Clients and Servers. If the Host is connected to 3 servers, it contains 3 separate MCP Clients, each managing one connection.*
