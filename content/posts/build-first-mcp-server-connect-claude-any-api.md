---
title: "Build Your First MCP Server: Connect Claude to Any API (Step-by-Step)"
date: "2026-04-13"
author: "Sophia Cave"
description: "MCP (Model Context Protocol) lets Claude talk directly to your APIs. Build your first MCP server from scratch in 45 minutes — with working TypeScript code you can copy."
excerpt: "MCP (Model Context Protocol) lets Claude talk directly to your APIs. Build your first MCP server from scratch in 45 minutes — with working TypeScript code you can copy."
slug: "build-first-mcp-server-connect-claude-any-api"
tags: [mcp, claude, claude-code, developer-tools, tutorial, 2026]
faq:
  - q: "What is an MCP server?"
    a: "An MCP (Model Context Protocol) server is a local program that exposes tools and resources to Claude via a standardized JSON-RPC protocol. It lets Claude read files, query databases, call APIs, and interact with external systems directly during conversations."
  - q: "Do I need to know TypeScript to build an MCP server?"
    a: "TypeScript is the most common choice, but MCP servers can be built in Python, Go, or any language that supports JSON-RPC over stdio. The official SDK is available for both TypeScript and Python."
  - q: "Is it safe to give Claude access to my APIs?"
    a: "MCP servers run locally with your permissions. Start with read-only tools and add write access intentionally. Claude always asks for confirmation before executing tools in Claude Desktop."
---

## MCP Turns Claude From a Chatbot Into an Operating System

MCP — Model Context Protocol — is Anthropic’s open standard that lets Claude talk directly to external tools: file systems, databases, APIs, browsers. Instead of copying data into prompts, MCP servers give Claude live access to your infrastructure. It is the protocol that turns a chatbot into an operating system.

This guide walks you through building your first MCP server from scratch — a real one that connects Claude to any API you choose.

## Why Build Your Own MCP Server?

The official MCP registry has hundreds of pre-built servers. But your business has unique APIs, internal tools, and workflows that no generic server covers. Building your own MCP server means Claude can interact with YOUR stack — not just the popular tools everyone else uses.

## How MCP Servers Work

An MCP server exposes tools and resources over a standardized JSON-RPC protocol. Claude Desktop or Claude Code connects to it, discovers available tools, and calls them during conversations. Here’s how to build one.

### Step 1: Create the Project

MCP servers run locally on your machine. No cloud hosting needed. Claude Desktop or Claude Code connects to them via stdio.

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
```

`@modelcontextprotocol/sdk` is Anthropic’s official TypeScript SDK for building MCP servers. `zod` handles input validation.

### Step 2: Build the Server

Create `index.ts`. This server exposes one tool — `get_weather` — that Claude can call during conversations:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-first-server",
  version: "1.0.0",
});

// Define a tool Claude can call
server.tool(
  "get_weather",
  "Get current weather for a city",
  { city: z.string().describe("City name") },
  async ({ city }) => {
    const resp = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );
    const data = await resp.json();
    const current = data.current_condition[0];
    return {
      content: [{
        type: "text",
        text: `${city}: ${current.temp_F}°F, ${current.weatherDesc[0].value}`
      }]
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

That is a complete, working MCP server. Claude discovers `get_weather`, knows what it does from the description, and calls it when relevant.

### Step 3: Connect It to Claude

Add this to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "my-first-server": {
      "command": "npx",
      "args": ["tsx", "/path/to/my-mcp-server/index.ts"]
    }
  }
}
```

Restart Claude Desktop. Ask "What’s the weather in Tokyo?" — Claude calls your server, gets real data, and answers.

### Step 4: Connect It to Any API

The pattern scales to any API. Here is a Stripe example — a tool that checks your recent charges:

```typescript
server.tool(
  "recent_charges",
  "List recent Stripe charges",
  { limit: z.number().default(5).describe("Number of charges to return") },
  async ({ limit }) => {
    const resp = await fetch(
      `https://api.stripe.com/v1/charges?limit=${limit}`,
      { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
    );
    const data = await resp.json();
    const charges = data.data.map((c: any) =>
      `$${(c.amount / 100).toFixed(2)} — ${c.description || "no description"} (${c.status})`
    );
    return { content: [{ type: "text", text: charges.join("\n") }] };
  }
);
```

Now "show me my last 10 charges" works directly in Claude. No copy-pasting from the Stripe dashboard.

You can add tools for Supabase queries, GitHub issues, Slack messages — any API with an HTTP endpoint becomes a Claude tool in ~20 lines.

## What to Watch Out For

**Permissions matter.** MCP servers run with your local user’s permissions. If you give Claude a tool that can write to your database, Claude can write to your database. Start with read-only tools and add write access intentionally.

**Keep tools focused.** One tool per action. `get_charges` and `create_charge` should be separate tools, not one `stripe` mega-tool. Claude picks the right tool more reliably when each one does exactly one thing.

**Error handling is non-negotiable.** If your API call fails, return a meaningful error message in the content — do not throw. Claude uses the error text to decide what to try next.

## Start Building

You now have everything you need to connect Claude to any API. The MCP SDK handles the protocol. You write the tools. Claude does the rest.

Pick one API you use daily — your CRM, your database, your payment processor — and build a read-only MCP server for it. Once you see Claude answer questions about your live data, you will not go back to copy-pasting.

---

*Want to go deeper? The [MCP Masterclass](https://likeone.ai/academy/mcp-masterclass/) covers custom servers, security, transport layers, and production architectures in 10 hands-on lessons. First 3 lessons free.*

---

## Keep Reading

- [10 Best MCP Servers for Claude in 2026](/blog/best-mcp-servers-claude-2026/) — tested and ranked
- [How to Use Claude Code: The Complete Guide](/blog/how-to-use-claude-code-complete-guide/)
- [How to Build an AI Agent (No Code Required)](/blog/how-to-build-ai-agent-no-code-2026/)
- [Custom GPTs vs Claude Projects: Which One Wins?](/blog/custom-gpts-vs-claude-projects/)