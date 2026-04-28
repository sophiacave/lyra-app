---
title: "Claude Agent SDK Tutorial: Build Your First AI Agent in 2026"
date: 2026-05-05
author: Sophia Cave
description: "A practical, no-fluff guide to building AI agents with Anthropic's Claude Agent SDK. Real code, real patterns, and the gotchas nobody warns you about."
excerpt: "A practical, no-fluff guide to building AI agents with Anthropic's Claude Agent SDK. Real code, real patterns, and the gotchas nobody warns you about."
tags: [claude, ai-agents, tutorial, developer, agent-sdk, mcp]
image: /blog/images/claude-agent-sdk-tutorial.jpg
cta: academy
---

# Claude Agent SDK Tutorial: Build Your First AI Agent in 2026

Most AI agent tutorials show you a toy demo and call it a day. This one doesn't.

We just finished wiring the Claude Agent SDK into a production Electron app. Real streaming, real tool use, real MCP integration. Along the way we hit every sharp edge the docs don't mention. This guide is what we wish existed when we started.

## What the Claude Agent SDK Actually Is

The Claude Agent SDK is Anthropic's framework for building AI agents that can use tools, make decisions, and operate in loops. Unlike raw API calls where you send a prompt and get text back, the SDK gives you an agent that can:

- Call tools and act on results
- Stream responses in real-time
- Connect to MCP servers for external capabilities
- Run in agentic loops (think, act, observe, repeat)
- Manage conversation context automatically

It's the difference between a chatbot and a coworker.

## Prerequisites

Before you start:

- **Node.js 18+** (ESM support required)
- **Claude CLI installed** with OAuth authentication (if using Max/Pro plan)
- **An Anthropic API key** (if using direct API access)
- Basic familiarity with async/await and streaming patterns

```bash
npm install @anthropic-ai/claude-code
```

If you're on a Claude Max plan, the SDK can authenticate through the CLI's OAuth flow — no API key needed. This is a significant cost advantage for prototyping.

## The Minimal Agent

Here's the smallest working agent:

```javascript
import { Claude } from '@anthropic-ai/claude-code';

const agent = new Claude({
  model: 'claude-opus-4-6',
  maxTurns: 10,
});

const response = await agent.chat('What files are in my current directory?');
console.log(response.text);
```

That's it. The agent can already use built-in tools like file reading and bash commands. But this is the "hello world" — let's build something real.

## Adding Custom Tools

Tools are where agents get useful. Define them as JSON schemas:

```javascript
const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather for a city',
  input_schema: {
    type: 'object',
    properties: {
      city: { type: 'string', description: 'City name' },
    },
    required: ['city'],
  },
};

const agent = new Claude({
  model: 'claude-sonnet-4-6',
  tools: [weatherTool],
  onToolCall: async (name, input) => {
    if (name === 'get_weather') {
      // Your actual API call here
      const data = await fetchWeather(input.city);
      return JSON.stringify(data);
    }
  },
});
```

The pattern: define the schema, handle the execution. The agent decides *when* to call tools based on context. You decide *how* they work.

## Streaming: The Part Everyone Gets Wrong

If you're building a UI, you need streaming. Here's the gotcha: the SDK emits `stream_event` messages with `content_block_delta` types, not the `partial_message` pattern you might expect from the raw API.

```javascript
const stream = agent.stream('Analyze this codebase and suggest improvements');

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    if (event.delta?.type === 'text_delta') {
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'tool_use') {
    console.log(`\nCalling tool: ${event.name}`);
  }
}
```

**Common mistake:** Trying to access `event.text` directly on the stream event. The text lives inside `event.delta.text` on `content_block_delta` events. Get this wrong and you'll stare at undefined outputs for an hour.

## Connecting MCP Servers

Model Context Protocol (MCP) is how you give your agent superpowers — database access, API integrations, file systems, browser control. The SDK supports MCP natively:

```javascript
const agent = new Claude({
  model: 'claude-opus-4-6',
  mcpServers: {
    database: {
      command: 'node',
      args: ['./mcp-servers/database-server.js'],
      env: { DB_PATH: './data/app.db' },
    },
    browser: {
      command: 'npx',
      args: ['@anthropic-ai/mcp-browser'],
    },
  },
});
```

The agent discovers available tools from each MCP server automatically. You don't need to manually register them — the protocol handles capability negotiation.

**Pro tip:** If you're running in an Electron or CJS context, use dynamic imports:

```javascript
const { Claude } = await import('@anthropic-ai/claude-code');
```

Static `import` statements will fail in CommonJS environments. This bit us in production.

## Environment Gotchas

Three things that will break your agent in non-obvious ways:

### 1. Subprocess Environment Pollution

If your app itself runs under Claude Code (meta, right?), the SDK will detect the parent Claude process and refuse to start — it thinks it's a nested invocation. Strip the telltale environment variables:

```javascript
const cleanEnv = { ...process.env };
delete cleanEnv.CLAUDE_CODE;
delete cleanEnv.CLAUDE_CODE_AGENT;

const agent = new Claude({
  model: 'claude-opus-4-6',
  env: cleanEnv,
});
```

### 2. Auth Modes

The SDK supports two auth paths:
- **API key:** Set `ANTHROPIC_API_KEY` in environment. Pay per token.
- **CLI OAuth:** If Claude CLI is authenticated (Max/Pro plan), the SDK uses that session. No key needed, no per-token cost.

Don't gate your app on `ANTHROPIC_API_KEY` existing if you support OAuth. We made this mistake. The fix was removing the API key check entirely and letting the SDK handle auth resolution.

### 3. Model Selection Matters

Different models have different tool-use capabilities:

| Model | Best For | Tool Use | Cost |
|-------|----------|----------|------|
| Opus 4.6 | Complex reasoning, multi-step agents | Excellent | $$$ |
| Sonnet 4.6 | Balanced speed/quality | Great | $$ |
| Haiku 4.5 | Fast responses, simple tasks | Good | $ |

For agentic loops with many tool calls, Sonnet is often the sweet spot — fast enough to not frustrate users, smart enough to chain tools correctly.

## Building a Real Agent: Code Review Bot

Let's put it together. A code review agent that reads your git diff, analyzes changes, and writes feedback:

```javascript
import { Claude } from '@anthropic-ai/claude-code';

const reviewer = new Claude({
  model: 'claude-sonnet-4-6',
  maxTurns: 15,
  systemPrompt: `You are a senior code reviewer. Be direct and specific.
    Focus on: bugs, security issues, performance problems.
    Skip style nitpicks. Prioritize what matters.`,
});

async function reviewPR() {
  const response = await reviewer.chat(
    'Read the current git diff (staged changes) and provide a code review. ' +
    'Focus on bugs, security issues, and logic errors. Be specific about file and line.'
  );

  return response.text;
}

const review = await reviewPR();
console.log(review);
```

This agent will:
1. Use the built-in bash tool to run `git diff --cached`
2. Read relevant files for context
3. Analyze the changes
4. Return structured feedback

No prompt chains. No orchestration framework. Just an agent with tools and a clear objective.

## Cost Control

Agentic loops can get expensive fast. Each tool call is a round-trip with full context. Control costs with:

```javascript
const agent = new Claude({
  model: 'claude-sonnet-4-6',
  maxTurns: 10,        // Hard limit on reasoning loops
  maxTokens: 4096,     // Cap output length per turn
});
```

The `maxTurns` parameter is your safety valve. Without it, a confused agent can loop indefinitely, burning tokens on repeated failed tool calls. Start with 10, increase if your use case needs it.

For production, monitor token usage per conversation and set alerts. A single runaway agent session can cost more than your entire day's normal traffic.

## What to Build Next

Now that you have a working agent:

1. **Connect a database via MCP** — Let your agent query real data
2. **Add memory** — Store conversation summaries in a local SQLite database for persistent context
3. **Build a UI** — Stream agent responses into a web or desktop interface
4. **Chain agents** — Use one agent's output as another's input for complex workflows

The SDK is flexible enough for all of these. The limiting factor isn't the technology — it's knowing what problems are worth solving with an agent versus a simple API call.

## The Honest Take

The Claude Agent SDK is good. Not perfect. The documentation has gaps (especially around streaming events and MCP configuration), and some error messages are cryptic. But the core loop — agent thinks, calls tools, observes results, continues — works reliably once you've navigated the setup.

The real power isn't in any single feature. It's that you can build an AI coworker that actually does things, not just talks about doing things. We built ours in a weekend. You can too.

---

*Want to go deeper? [Like One Academy](/academy) covers AI agent architecture, MCP integration, and building production AI systems — all free.*
