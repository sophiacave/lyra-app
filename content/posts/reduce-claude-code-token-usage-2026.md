---
title: "Cut Claude Code Token Usage by 80% (Tested)"
date: 2026-05-28
author: Sophie Cave
description: "How I cut Claude Code costs by 80% running 200+ sessions. Tested techniques: CLAUDE.md optimization, /compact timing, model switching, hooks, and the habits that actually save tokens."
excerpt: "How I cut Claude Code costs by 80% running 200+ sessions. Tested techniques: CLAUDE.md optimization, /compact timing, model switching, hooks, and the habits that actually save tokens."
tags: [claude-code, tokens, cost-optimization, developer-tools, ai-tools, 2026]
faq:
  - q: "How do I reduce token usage in Claude Code?"
    a: "The biggest wins come from keeping CLAUDE.md under 500 words, using /compact before context gets long, being specific in your prompts instead of asking Claude to explore, and using Sonnet for routine tasks instead of Opus. Together these can cut usage 70-80%."
  - q: "What is /compact in Claude Code?"
    a: "/compact summarizes your conversation history and replaces the full text with a compressed version. This reduces the tokens sent on every subsequent message. Use it when your session passes 20-30 exchanges or when you notice Claude starting to lose earlier context."
  - q: "Does CLAUDE.md use tokens on every message?"
    a: "Yes. Your CLAUDE.md file is included in every single message you send to Claude Code. A 5,000 token CLAUDE.md costs 5,000 tokens per turn. Keep it concise and focused on rules, not documentation."
  - q: "Should I use Opus or Sonnet in Claude Code?"
    a: "Use Sonnet for most daily work: writing tests, simple edits, refactoring, and routine features. Switch to Opus only for complex architecture decisions, debugging subtle issues, or tasks requiring deep multi-file reasoning. Sonnet is significantly cheaper per token."
  - q: "How much does Claude Code cost per month?"
    a: "Claude Code Pro costs around $20/month with usage limits. The Max plan at $200/month provides higher limits. Actual spend depends on how many sessions you run and how long they last. A solo developer doing 2-3 hours of vibe coding daily typically spends $50-200/month."
  - q: "What are Claude Code hooks?"
    a: "Hooks are shell commands that execute automatically in response to Claude Code events like tool calls or session starts. You can use hooks to preprocess data before Claude sees it, reducing token waste. For example, a hook can filter log files to only show errors instead of sending Claude the entire log."
---

# How I Cut Claude Code Token Usage by 80%

I use Claude Code as my primary development tool. Not for side projects. For production code, every day, across 200+ sessions.

At that volume, token waste is not an inconvenience. It is a budget line. Here is what actually works to reduce it, based on what I measured, not what sounds clever.

## The Biggest Token Sink: Your CLAUDE.md

Every message you send to Claude Code includes your entire CLAUDE.md file. Every single one. If your CLAUDE.md is 3,000 tokens and you send 50 messages in a session, that is 150,000 tokens just on instructions.

The fix is not deleting your CLAUDE.md. It is making it efficient.

**What belongs in CLAUDE.md:**
- Your tech stack (one line each)
- Testing commands
- File structure overview (10 lines max)
- Hard rules (never do X, always do Y)
- Package manager preference

**What does not belong:**
- Meeting notes
- Design history
- Long implementation guides
- Feature roadmaps
- Anything that changes weekly

My CLAUDE.md is under 400 words. It is a lookup table, not a knowledge base.

## Use /compact Before You Need It

The /compact command summarizes your conversation and replaces the raw history with a compressed version. Most people use it when Claude starts forgetting things. That is too late.

Use /compact:
- After completing a distinct task (before starting the next one)
- When you hit 20-25 exchanges
- Before any large file operations
- When switching focus areas within a session

I /compact every 15-20 messages. This alone cut my token usage by roughly 30%.

## Be Specific or Pay the Price

The most expensive prompt in Claude Code is a vague one.

"Look at the codebase and find what's wrong" means Claude reads dozens of files, explores dead ends, and burns thousands of tokens before finding the issue.

"The test in app/lib/auth.test.js is failing on line 47. The error is 'session undefined'. Check how sessions are created in app/lib/auth.js" means Claude reads two files and fixes the problem.

Specificity is the cheapest optimization available. It costs you 10 extra seconds of thought and saves hundreds of tokens per interaction.

## Model Switching Is Real Savings

Sonnet handles 80% of daily coding work: writing tests, simple features, refactoring, updating copy, fixing lint errors. It is faster and significantly cheaper per token than Opus.

Switch to Opus for:
- Complex multi-file refactoring
- Architecture decisions
- Debugging issues that span multiple systems
- Tasks requiring deep reasoning about tradeoffs

I default to Sonnet and escalate to Opus only when I genuinely need it. This is not about quality compromise. It is about matching the tool to the task.

## Use @file Instead of Pasting

Claude Code supports @file references that pull in file contents on demand. Instead of pasting a 500-line configuration into your prompt, reference it with @config.yaml and Claude reads it directly.

The advantage is not just convenience. It is that @file loads happen once and in context, while pasted text inflates every subsequent message in the conversation.

## Custom Hooks for Preprocessing

If Claude Code needs to analyze logs, test output, or large data files, do not let it read the raw content. Write a hook that preprocesses the data first.

Instead of Claude reading a 10,000-line log file (tens of thousands of tokens), a hook can grep for errors and return only matching lines. Hundreds of tokens instead of tens of thousands.

Hooks are shell scripts that execute automatically. They are the single most underused feature in Claude Code for cost control.

## The /clear Discipline

When you finish one task and start another, use /clear. Starting a new conversation costs nothing. Carrying forward a 50-message history that is no longer relevant costs tokens on every subsequent message.

I /clear between tasks and rely on CLAUDE.md plus @file references to provide the context Claude needs for the new task. This prevents the gradual context bloat that makes late-session messages expensive.

## What 80% Reduction Looks Like

Before optimizing: sessions averaged 500K-800K tokens for a few hours of work.

After optimizing: the same work uses 100K-150K tokens. Same output. Same quality. Fraction of the cost.

The compound effect matters. Over 200+ sessions, this is the difference between a manageable tool cost and an unsustainable one.

## The One Rule

Every token Claude Code processes should earn its place. If it does not help Claude give you a better answer, it is waste. Optimize your inputs, and everything downstream improves.

---

*Sophie Cave runs likeone.ai entirely on Claude Code, averaging 5+ sessions daily. She tracks token usage obsessively and writes about what actually works.*
