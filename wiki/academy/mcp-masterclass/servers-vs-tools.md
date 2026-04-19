# Servers vs Tools

**Course:** MCP & AI Tool Integration
**Order:** 3
**Type:** lesson
**Access:** Free

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 3 of 10


  # Servers vs Tools

  MCP Servers are long-running processes that expose multiple tools. Understand the difference — and explore six real server types.



    ## MCP Servers vs Direct Tool Calls

    An MCP Server is NOT the same as a single tool. A server is a persistent process that can expose many tools, maintain state across calls, and manage connections. Here's how they compare:


      MCP Servers
      Direct Tool Calls


        **Lifecycle**Long-running process. Starts once, handles many requests.
        **Lifecycle**One-off execution. Each call is independent.


        **Capabilities**Exposes multiple tools, resources, and prompts through a single server.
        **Capabilities**Single function with defined inputs and outputs.


        **State**Maintains state across calls. Database connections stay open. Context persists.
        **State**Stateless. Each invocation starts fresh with no memory of previous calls.


        **Discovery**Clients discover available tools automatically via the MCP protocol.
        **Discovery**Tools must be explicitly defined and configured per integration.


        **Transport**Communicates over stdio (local) or Streamable HTTP (remote).
        **Transport**Varies — REST, SDK calls, or inline function execution.


        **Standard**Universal MCP protocol. Works with any MCP client.
        **Standard**Vendor-specific. Different format for each AI provider.





    ## Explore MCP Server Types

    MCP servers come in many forms. Here are six common types, each exposing different capabilities:



        &#x1F4C1;
        **Filesystem**
        Read, write, search files


        &#x1F4BE;
        **Database**
        Query, insert, update data


        &#x1F310;
        **API**
        Wrap any REST or GraphQL API


        &#x1F5A5;&#xFE0F;
        **Browser**
        Navigate, screenshot, interact


        &#x1F9E0;
        **Memory**
        Persistent knowledge recall


        &#x1F50D;
        **Search**
        Web, docs, or code search





    ## See the Difference in Code

    Here is the same capability — letting AI read a file — implemented as a direct tool call versus an MCP server tool. Notice how the MCP version is standardized and self-documenting:




          Direct Tool Call (OpenAI-style)JSON
          // Vendor-specific format
// Different for every AI provider
{
  "type": "function",
  "function": {
    "name": "read_file",
    "parameters": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        }
      }
    }
  }
}

        You define the schema. You parse the call. You execute the function. You return the result. Different format for each AI provider.



          MCP Server ToolTypeScript
          // Universal MCP standard
// Works with ANY MCP client
server.tool(
  "read_file",
  {
    path: z.string()
      .describe("File path to read"),
  },
  async ({ path }) => ({
    content: [{
      type: "text",
      text: readFileSync(path, "utf-8"),
    }],
  })
);

        The SDK handles protocol, validation, and transport. Your code is just the business logic. Works with Claude, VS Code, Cursor — any MCP client.





    ## The Same Tool, Two Approaches

    Here is a file-reading capability implemented both ways in Python. Notice how the MCP version handles protocol, validation, and discovery automatically — your code is just the business logic:


Python — raw tool definition (vendor-specific)

```
# You handle EVERYTHING: schema, parsing, execution, errors
tools = [{
    "type": "function",
    "function": {
        "name": "read_file",
        "description": "Read a file from disk",
        "parameters": {
            "type": "object",
            "properties": {
                "path": {"type": "string"}
            },
            "required": ["path"]
        }
    }
}]

def handle_tool_call(name, args):
    if name == "read_file":
        with open(args["path"]) as f:
            return f.read()
    # You must manually route every tool call
```



Python — MCP server (universal standard)

```
from mcp.server.fastmcp import FastMCP

# The SDK handles protocol, validation, routing, transport
mcp = FastMCP("file-server")

@mcp.tool()
def read_file(path: str) -> str:
    """Read a file from disk"""
    with open(path) as f:
        return f.read()

# Works with Claude, VS Code, Cursor — any MCP client
mcp.run()
```


    The raw approach requires you to define JSON schemas, parse arguments, route calls manually, and handle errors — all in a format that only works with one AI provider. The MCP server version is six lines of business logic. The SDK generates the schema from the type hints, handles transport, and works with every MCP client automatically.



    ## When to Build a Server vs Use Direct Tool Calling



        Build a Server
        When you want the tool to work across multiple AI clients, when you need persistent state (DB connections, sessions), or when you want automatic tool discovery.


        Use Direct Calls
        When you are building a one-off integration for a single app, when you only need one or two simple functions, or when you are locked into a specific AI provider's SDK.





### Quiz

**Q1: Which statement correctly describes how an MCP Server differs from a direct tool call?**
    A. A server is faster but less reliable
  ✓ B. A server is long-running, exposes multiple tools, and maintains state
    C. A server only works with Claude Desktop
    D. There is no meaningful difference
  *MCP Servers are persistent processes that expose multiple tools, maintain state (like open DB connections), and support automatic tool discovery. Direct tool calls are one-off and stateless.*

**Q2: What transport protocols does MCP use?**
    A. REST and GraphQL
    B. HTTP-only over port 443
  ✓ C. stdio and HTTP with Server-Sent Events (SSE)
    D. TCP sockets and WebSockets
  *MCP supports stdio (standard input/output, ideal for local servers) and HTTP with SSE for remote servers.*



### Server Types Flash Review

**Card 1:**
Front: Filesystem Server
Back: Exposes read_file, write_file, list_directory, search_files. Gives AI controlled access to local or remote files.

**Card 2:**
Front: Database Server
Back: Exposes query, insert, update, list_tables. Maintains a persistent connection pool so Claude can query data without re-connecting each time.

**Card 3:**
Front: Browser Server
Back: Exposes navigate, screenshot, click, type, get_text. Powered by Puppeteer or Playwright for full web automation.

**Card 4:**
Front: Memory Server
Back: Exposes store_memory, recall, search_memory, create_relation. Persists knowledge across sessions in a knowledge graph.

**Card 5:**
Front: Search Server
Back: Exposes web_search, search_docs, search_code, search_news. Connects AI to live search engines and documentation indices.
