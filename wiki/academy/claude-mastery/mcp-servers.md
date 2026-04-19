# MCP Servers

**Course:** Claude Mastery
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 9 of 10


  # MCP Servers

  The Model Context Protocol — Claude's universal connector, with a working server example


## What Is MCP?

The **Model Context Protocol** (MCP) is an open standard created by Anthropic that lets AI models connect to external data sources and tools through a universal interface. A **protocol** is simply an agreed-upon set of rules for how two systems communicate — like how HTTP defines how your browser talks to websites. MCP defines how AI models talk to tools.

Instead of building custom integrations for every tool, MCP provides a single protocol that any server can implement. Think of it like USB for AI — one standard connector that works with everything.

**Why this matters:** Without MCP, connecting Claude to your files, databases, or APIs would require custom tool definitions for each one. With MCP, you write a server once using the standard protocol, and any MCP-compatible client (Claude Code, Claude Desktop, Cursor, and more) can use it automatically.


**MCP vs. Tool Use:** Tool use (Lesson 8) lets you define tools inline in API calls. MCP is a *standard protocol* for packaging tools into reusable servers that any MCP client can discover and use. Tool use is one-off; MCP is ecosystem.


## Architecture Overview

The MCP architecture has three layers:


**MCP Client (Claude Code / Claude Desktop)**
The application that connects to MCP servers. It discovers available tools at startup and lets the AI model call them during conversations. Clients include Claude Code, Claude Desktop, Cursor, and Windsurf.


**MCP Server (Your TypeScript/Python Server)**
A program you write that exposes tools, resources, and prompts via the MCP protocol. It runs locally and acts as a bridge between the AI model and your data sources.


**Data Sources (Files, Databases, APIs)**
The actual data the server connects to — local files, PostgreSQL databases, REST APIs, and more. The MCP server translates AI tool calls into real data operations.


The flow is: Client discovers server tools at startup → AI model decides to call a tool → Client sends the call to the server → Server executes against data sources → Result flows back to the AI model.


## Building a Simple MCP Server

Here is a complete, working MCP server in TypeScript. This server exposes a single tool — a note-taking system. You can run this with Claude Code or Claude Desktop:


TypeScript — complete MCP server (notes tool)

```
// npm install @modelcontextprotocol/sdk
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// In-memory note storage
const notes: Map = new Map();

// Create the server
const server = new McpServer({
  name: "notes-server",
  version: "1.0.0",
});

// Register a tool: add a note
server.tool(
  "add_note",
  "Save a note with a title and content",
  {
    title: z.string().describe("Note title"),
    content: z.string().describe("Note content"),
  },
  async ({ title, content }) => {
    notes.set(title, content);
    return {
      content: [{
        type: "text",
        text: `Saved note: "${title}"`
      }]
    };
  }
);

// Register a tool: list all notes
server.tool(
  "list_notes",
  "List all saved notes",
  {},
  async () => {
    if (notes.size === 0) {
      return { content: [{ type: "text", text: "No notes yet." }] };
    }
    const list = [...notes.entries()]
      .map(([title, content]) => `- **${title}**: ${content}`)
      .join("\n");
    return { content: [{ type: "text", text: list }] };
  }
);

// Start the server (stdio transport)
const transport = new StdioServerTransport();
await server.connect(transport);
```


## Connecting Your Server to Claude

Once you have written an MCP server, you connect it by adding it to your Claude configuration:


Claude Code — add MCP server to project settings

```
// .claude/settings.json (in your project root)
{
  "mcpServers": {
    "notes": {
      "command": "npx",
      "args": ["tsx", "./mcp/notes-server.ts"]
    }
  }
}
```


Claude Desktop — add MCP server to desktop config

```
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "notes": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/notes-server.ts"]
    }
  }
}
```


After adding the server, restart Claude. It will automatically discover the tools your server exposes. You can then say "Save a note about today's meeting" and Claude will call your `add_note` tool.


## MCP Server Types

MCP servers can connect to virtually any data source. Here are the most common types:


**Filesystem Server**
Read, write, and search files on the local machine. Common for code editors and document management. Claude can browse your project files, read configs, and write output.


**Database Server**
Query PostgreSQL, SQLite, or any database. Claude can run SELECT queries, analyze schemas, and help with data exploration without needing direct database access.


**API Server**
Connect to REST APIs, webhooks, and web services. Turn any third-party API (Slack, GitHub, Notion) into tools Claude can use directly in conversation.


**Search Server**
Web search, semantic search, and vector databases. Enable Claude to find current information or search your private knowledge base using embeddings.


**Custom Server**
Build your own for any data source. The MCP SDK makes it straightforward to wrap any functionality — from smart home devices to internal business tools.


## The Three MCP Primitives

MCP servers can expose three types of capabilities. Most servers start with just tools, then add resources and prompts as needed:


**Tools — actions Claude can take**
Functions that do things: query a database, send a message, create a file. Claude calls them with parameters and gets results back. This is the most common primitive — equivalent to tool use in the API.


**Resources — data Claude can read**
Structured data that Claude can pull into context: files, database records, API responses. Resources are read-only and addressable by URI (e.g., `notes://meeting-2026-04-01`). Think of them as a data layer Claude can browse.


**Prompts — reusable prompt templates**
Pre-defined prompt templates that users can invoke. For example, a "summarize-document" prompt that takes a file path and returns a structured summary. Prompts standardize common workflows.


## Why MCP Matters


🔗
**Universal standard** — One protocol works with any AI model that supports MCP, not just Claude. Build once, use with Claude Code, Claude Desktop, Cursor, Windsurf, and more.


🔒
**Security by design** — MCP servers run locally. Your data never leaves your machine unless the server explicitly sends it. You control the permissions.


⚡
**Composable** — Connect multiple MCP servers at once. Claude can query your database, read your files, and call your API all in the same conversation.


🌱
**Growing ecosystem** — Hundreds of community-built MCP servers already exist — from GitHub and Slack to Notion, Postgres, and custom business tools.


### MCP Key Concepts

**Card 1:**
Front: Model Context Protocol (MCP)
Back: An open standard by Anthropic that defines how AI models communicate with external tools and data sources. Like USB for AI — one standard connector that works with any MCP-compatible client.

**Card 2:**
Front: The three MCP primitives
Back: Tools (actions Claude can take), Resources (data Claude can read), and Prompts (reusable prompt templates). Most servers start with tools and add the others as needed.

**Card 3:**
Front: MCP Client
Back: The application that connects to MCP servers — Claude Code, Claude Desktop, Cursor, etc. The client discovers available tools and lets the AI model call them.

**Card 4:**
Front: MCP Server
Back: A program you write that exposes tools, resources, and/or prompts via the MCP protocol. It runs locally and connects to your data sources. Built with @modelcontextprotocol/sdk.

**Card 5:**
Front: MCP security model
Back: Servers run locally by default. Data never leaves the machine unless the server explicitly sends it. The developer controls all permissions. Each server runs in its own process.


### Quiz

**Q1: What does MCP stand for?**
    A. Machine Code Protocol
  ✓ B. Model Context Protocol
    C. Multi-Channel Pipeline
    D. Managed Claude Proxy
  *MCP stands for Model Context Protocol — an open standard by Anthropic for how AI models communicate with external tools and data sources.*

**Q2: How does MCP differ from inline tool use in the API?**
    A. MCP is slower
  ✓ B. MCP packages tools into reusable servers that any MCP client can discover and use — tool use is one-off per API call
    C. MCP only works with Opus
    D. There is no difference
  *Inline tool use defines tools per API call. MCP packages tools into reusable servers with a standard protocol — any MCP-compatible client (Claude Code, Claude Desktop, Cursor) can discover and use them automatically.*

**Q3: Where does an MCP server run by default?**
    A. On Anthropic servers
    B. On the cloud provider closest to you
  ✓ C. Locally on your machine
    D. Inside Claude model weights
  *MCP servers run locally by default. This is a security feature — your data never leaves your machine unless the server explicitly sends it to an external service.*

**Q4: What are the three primitives an MCP server can expose?**
    A. Read, Write, Execute
  ✓ B. Tools, Resources, Prompts
    C. Input, Output, Error
    D. Query, Mutation, Subscription
  *MCP servers can expose Tools (actions), Resources (readable data), and Prompts (reusable templates). Most servers start with tools — the most common primitive — and add the others as needed.*


Lesson 9 of 10

Module 3
