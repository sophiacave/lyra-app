---
title: "How to Use Claude Code: The Complete Guide (2026)"
date: 2026-04-02
author: Sophia Cave
description: "Claude Code turns your terminal into an AI-powered development environment. This guide covers everything from installation to advanced workflows — with real examples from someone who builds with it every day."
excerpt: "Claude Code turns your terminal into an AI-powered development environment. This guide covers everything from installation to advanced workflows — with real examples from someone who builds with it every day."
tags: [claude, tutorial, ai-tools, productivity, agent, automation, "2026"]
image: /blog/images/how-to-use-claude-code.jpg
cta: Start Learning Free
faq:
  - q: "Is Claude Code free?"
    a: "No. Claude Code requires a paid Anthropic account — either a Claude Pro subscription ($20/month), Claude Max ($200/month), Claude Teams, or an Anthropic API key with prepaid credits. There is no free tier for Claude Code."
  - q: "What's the difference between Claude Code and Claude AI?"
    a: "Claude AI is the web-based chat interface at claude.ai. Claude Code is a terminal-based coding assistant that reads your entire codebase, edits files, runs commands, and integrates with Git. Claude AI is for conversations. Claude Code is for building software."
  - q: "Can Claude Code work with any programming language?"
    a: "Yes. Claude Code is language-agnostic. It works with Python, JavaScript, TypeScript, Go, Rust, Java, C++, Ruby, PHP, Swift, and any other language. It reads and writes files — it doesn't care what language they're in."
  - q: "Does Claude Code need an internet connection?"
    a: "Yes. Claude Code sends your prompts and code context to Anthropic's API for processing. It requires an active internet connection to function."
  - q: "Is my code safe with Claude Code?"
    a: "Claude Code sends code context to Anthropic's servers for processing. Anthropic does not train on API data or Claude Pro/Max data. For enterprise security requirements, Claude Code supports AWS Bedrock and Google Vertex AI deployments that keep data within your cloud environment."
---

# How to Use Claude Code: The Complete Guide

I build software with Claude Code every day. Not as a novelty. Not as an experiment. It's the core of my development workflow — writing features, debugging production issues, deploying to Vercel, managing git, even writing the blog post you're reading right now.

Claude Code is the single biggest productivity shift I've experienced since switching from Sublime Text to VS Code. Bigger, actually, because it doesn't just help you write code. It *writes* the code, runs the tests, fixes the failures, and commits the result.

This guide covers everything you need to go from installation to daily driver.

## What Is Claude Code?

Claude Code is Anthropic's agentic coding tool. It runs in your terminal (or VS Code, or JetBrains) and does things other AI coding tools talk about but don't actually deliver:

- **Reads your entire codebase** — not just the open file, the whole project
- **Edits files directly** — no copy-paste from a chat window
- **Runs terminal commands** — builds, tests, linters, git, anything
- **Understands context** — remembers your project structure, coding standards, and preferences
- **Works autonomously** — give it a task and it plans, executes, and verifies

Think of it as a senior developer who never gets tired, never forgets the codebase, and types at 1000 WPM.

## Installation

Claude Code installs in one command. No package manager drama.

**macOS or Linux:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Alternative methods:**

```bash
# macOS via Homebrew
brew install --cask claude-code

# Windows via WinGet
winget install Anthropic.ClaudeCode
```

**Requirements:**
- macOS 13+, Windows 10+, or Ubuntu 20.04+
- 4GB RAM minimum
- A paid Anthropic account (Pro, Max, Teams, or API credits)

After installation, run `claude` in your terminal. It'll open a browser window to authenticate. Log in, and you're ready.

## Your First 5 Minutes

Navigate to any project directory and type:

```bash
cd your-project
claude
```

That's it. Claude Code reads your project structure and you can start talking to it.

**Try these first prompts:**

```
give me an overview of this codebase
```

```
what does the authentication flow look like?
```

```
find where the API rate limiting is implemented
```

Claude Code doesn't just search for keywords. It reads files, follows imports, traces function calls, and gives you an answer that actually reflects how the code works.

## The Permission System

Claude Code asks before doing anything destructive. Every file edit, every terminal command — you approve or deny it.

There are four permission modes. Cycle between them with **Shift+Tab**:

| Mode | What it does |
|------|-------------|
| **Normal** | Asks before every action. Best for learning. |
| **Auto** | Approves safe operations, asks for risky ones. Best for daily work. |
| **Plan** | Read-only analysis. Claude proposes changes but doesn't execute. Best for exploring unfamiliar code. |
| **Full Auto** | Approves everything. Best for scripts and CI/CD. |

Start with Normal mode. Once you trust the workflow, switch to Auto. You'll move 3x faster.

## CLAUDE.md — Teaching Claude Your Project

This is the feature most people skip and shouldn't.

Create a `CLAUDE.md` file in your project root. It's like onboarding a new developer — tell Claude how your project works:

```markdown
# Project Setup
- Run `npm install` to install dependencies
- Run `npm test` to run tests
- Run `npm run dev` for local development

# Code Standards
- TypeScript strict mode
- 2-space indentation
- Use async/await, never callbacks
- Tests live next to source files (component.test.ts)

# Architecture
- API routes in src/api/
- React components in src/components/
- Database queries in src/db/
```

Every conversation starts with Claude reading this file. It eliminates the "you don't understand my project" problem that plagues other AI tools.

**Generate one automatically:**

```
/init
```

Claude Code scans your project and creates a starter CLAUDE.md. Edit it to add the things only you know — the gotchas, the conventions, the "we do it this way because" context.

## Essential Slash Commands

Type these in the Claude Code prompt:

| Command | What it does |
|---------|-------------|
| `/init` | Generate a CLAUDE.md for your project |
| `/clear` | Clear conversation history |
| `/compact` | Compress context to save tokens |
| `/resume` | Resume a previous conversation |
| `/cost` | See how many tokens you've used |
| `/model` | Switch between Opus, Sonnet, and Haiku |
| `/help` | Show all available commands |

The ones I use most: `/compact` (when conversations get long) and `/resume` (when I come back to a task the next day).

## Real Workflows That Actually Work

### Fix a Bug

Paste the error. That's it.

```
Users are getting a 500 error on /api/checkout. Here's the stack trace:

TypeError: Cannot read property 'id' of undefined
    at processPayment (src/api/checkout.ts:47)
    at handler (src/api/checkout.ts:12)
```

Claude Code will read the file, trace the issue, identify the root cause, implement the fix, and run your tests to verify it works. You approve the file edit and move on.

### Refactor Code

```
refactor the user authentication to use JWT tokens instead of sessions.
keep the existing API interface the same.
```

Claude Code will map every file that touches authentication, plan the refactor, implement it across all files, and run the test suite. Multi-file refactors that used to take a full afternoon happen in minutes.

### Write Tests

```
write comprehensive tests for src/utils/validation.ts
```

Claude Code reads the file, understands the functions, generates tests that cover happy paths, edge cases, and error conditions — matching your existing test patterns and framework.

### Create a Pull Request

```
commit my changes and create a PR
```

Claude Code stages the right files, writes a descriptive commit message, pushes to a branch, and opens a pull request with a summary of what changed and why. It uses `gh` under the hood, so it works with GitHub out of the box.

### Explore a New Codebase

Switch to Plan mode (Shift+Tab) and ask questions:

```
how does the payment processing work end to end?
```

```
what would need to change if we wanted to add multi-currency support?
```

Plan mode is read-only. Claude Code explores, analyzes, and reports — without changing anything. It's the fastest way to understand code you didn't write.

## MCP Servers — Connecting External Tools

MCP (Model Context Protocol) lets Claude Code talk to external services. Database queries, Slack messages, GitHub issues, Stripe payments — all accessible from your terminal.

Add an MCP server by creating `.mcp.json` in your project:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

Now Claude Code can read issues, review PRs, and manage repositories — all within your coding session.

Popular MCP servers: GitHub, PostgreSQL, Slack, Stripe, Google Drive, Sentry. The ecosystem is growing fast.

## Hooks — Automating the Automation

Hooks run custom commands before or after Claude Code takes actions. Set them up in your project's `.claude/settings.json`:

**Auto-format after every file edit:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

**Run tests after source changes:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm test"
          }
        ]
      }
    ]
  }
}
```

Hooks turn Claude Code from "assistant that edits files" into "automated development pipeline that enforces your standards."

## IDE Integrations

**VS Code:** Install the Claude Code extension from the marketplace. You get inline diffs, an integrated chat panel, and the ability to highlight code and ask questions about it.

**JetBrains (IntelliJ, PyCharm, WebStorm):** Install from the JetBrains Marketplace. Same capabilities — plan mode, inline editing, terminal integration.

Both work. I prefer the terminal because it's faster and doesn't require context-switching between panels. But if you live in your IDE, the extensions are solid.

## Choosing the Right Model

Claude Code supports three models:

| Model | Best for | Speed | Cost |
|-------|---------|-------|------|
| **Opus** | Complex reasoning, architecture, multi-file refactors | Slower | Highest |
| **Sonnet** | Daily coding, bug fixes, feature development | Balanced | Medium |
| **Haiku** | Quick questions, simple edits, code review | Fastest | Lowest |

Switch models mid-session with `/model`. I default to Sonnet for most work and switch to Opus when I need deeper reasoning — architectural decisions, complex debugging, or large refactors.

## Cost Management

Claude Code uses tokens, and tokens cost money. Here's how to keep costs reasonable:

1. **Use `/compact` regularly** — long conversations eat tokens. Compress when you're past 50% of the context window.
2. **Use Haiku for simple tasks** — code formatting, simple questions, boilerplate generation.
3. **Write specific prompts** — "fix the null check in checkout.ts line 47" costs less than "something is broken in checkout."
4. **Check usage with `/cost`** — know where your tokens are going.

On Claude Pro ($20/month), you get generous daily usage. Claude Max ($200/month) gives you significantly higher limits — worth it if Claude Code is central to your workflow.

## Tips From Daily Use

**1. Name your sessions.** Use `/rename auth-refactor` so you can resume later with `/resume auth-refactor`. Much better than scrolling through unnamed sessions.

**2. Start with Plan mode for unfamiliar code.** Explore first, edit second. Plan mode prevents expensive mistakes in codebases you don't fully understand yet.

**3. Keep CLAUDE.md under 200 lines.** It loads every conversation. Bloated project files waste tokens and dilute important context.

**4. Use `@` to reference files.** Type `@src/api/handler.ts` in your prompt and Claude Code loads that file immediately. Faster than describing where something is.

**5. Let it commit.** Claude Code writes better commit messages than most humans. "commit my changes" gives you a descriptive, well-formatted message every time.

**6. Chain tasks.** Don't stop after one fix. "Fix the validation bug, then write a test for it, then update the changelog." Claude Code handles multi-step instructions naturally.

**7. Use keyboard shortcuts.** `Shift+Tab` cycles permission modes. `Ctrl+C` stops a runaway command. `?` shows all available shortcuts.

## When to Use Claude Code vs. Claude AI

| Task | Use |
|------|-----|
| Writing code, fixing bugs, refactoring | **Claude Code** |
| Brainstorming ideas, writing prose | **Claude AI** |
| Multi-file changes across a project | **Claude Code** |
| Quick one-off questions | **Claude AI** |
| Git operations, deployments, testing | **Claude Code** |
| Analyzing documents or images | **Claude AI** |

They're complementary tools. Claude AI is a conversation partner. Claude Code is a development environment.

## Getting Started Today

Here's your 10-minute setup:

1. Install Claude Code (`curl -fsSL https://claude.ai/install.sh | bash`)
2. Authenticate (`claude` → log in via browser)
3. Navigate to a project (`cd your-project`)
4. Generate a CLAUDE.md (`/init`)
5. Ask it something: "give me an overview of this codebase"

That's it. You're using Claude Code.

The tool gets better the more context you give it. Update your CLAUDE.md as you learn what works. Set up hooks for your formatting and testing standards. Add MCP servers for your external tools. Within a week, you'll wonder how you shipped code without it.

---

*Want to go deeper? Our [Claude for Beginners](/academy/claude-for-beginners/) course covers Claude from zero, and [Claude Mastery](/academy/claude-mastery/) gets into the advanced techniques that separate casual users from power users.*
