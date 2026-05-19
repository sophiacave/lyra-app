---
title: "Self-Improving AI Agents: How to Build Systems That Learn From Every Session"
slug: "self-improving-ai-agents-skill-systems-2026"
date: "2026-05-12"
author: "Sophie Cave"
category: "Engineering"
tags: ["ai agents", "machine learning", "agent architecture", "self-improving ai", "production ai"]
description: "Most AI agents start from zero every time. Here's how to build agents that extract skills from their own work, index them for retrieval, and get measurably better with every session."
image: "/blog/self-improving-agents.jpg"
published: true
---

# Self-Improving AI Agents: How to Build Systems That Learn From Every Session

Your AI agent just solved a gnarly deployment problem. Took 47 tool calls, three dead ends, and a creative workaround involving a reverse proxy nobody documented.

Tomorrow, it'll face the same problem and start from scratch.

This is the single biggest waste in agent engineering right now. Models are getting smarter every quarter, but individual agent *instances* learn nothing. Every session is day one. Every problem is novel. Every solution is disposable.

It doesn't have to be this way. You can build agents that extract reusable skills from their own work, store them in searchable indexes, and retrieve them when similar problems surface. Not fine-tuning. Not RAG over your entire codebase. Something more targeted: a skill system.

Here's how we built one.

## The Problem With Stateless Agents

Most agent architectures treat each session as isolated. The model gets a system prompt, maybe some context from a vector store, and goes to work. When the session ends, everything evaporates except whatever the user explicitly saved.

This creates three expensive failure modes:

1. **Repeated discovery.** Your agent rediscovers the same procedures, workarounds, and tool chains every session. That's burned tokens and wasted time.
2. **No compounding expertise.** A human engineer gets faster at deployment after doing it twenty times. Your agent is equally slow on attempt twenty as attempt one.
3. **Lost institutional knowledge.** When an agent finds an undocumented API quirk or a non-obvious configuration, that knowledge dies with the session.

The fix isn't more context window. It's structured learning.

## What a Skill System Actually Looks Like

A skill is a reusable procedure extracted from a successful agent session. Not a prompt template. Not a fine-tuning example. A structured document that captures:

- **What was the problem?** The trigger condition — when should this skill activate?
- **What was the solution?** Step-by-step procedure, including tool calls, in the order that worked.
- **What didn't work?** The dead ends, so future sessions skip them.
- **What's the success criteria?** How do you verify the skill executed correctly?

Think of it like a runbook that writes itself.

Here's a minimal skill schema:

```yaml
name: deploy-edge-function
version: 1
category: infrastructure
trigger: "deploying serverless functions to production"
procedure:
  - step: "Verify function compiles locally"
    tool: bash
    command: "npx supabase functions serve --no-verify-jwt"
  - step: "Check for environment variable dependencies"
    tool: grep
    pattern: "Deno.env.get"
  - step: "Deploy with explicit project ref"
    tool: bash
    command: "npx supabase functions deploy {name} --project-ref {ref}"
  - step: "Verify deployment"
    tool: bash
    command: "curl -s https://{ref}.supabase.co/functions/v1/{name}"
anti-patterns:
  - "Don't deploy without checking env vars first — silent failures"
  - "Don't use --legacy-bundle flag — deprecated since March 2026"
success_criteria: "Function returns 200 on health check endpoint"
```

This isn't hypothetical. This is a simplified version of what we run in production.

## The Extraction Loop

Skills don't write themselves. You need an extraction step that runs after each session and identifies procedures worth saving.

Here's the architecture:

### 1. Session Logging

Every agent session gets logged with structured metadata — tool calls made, errors encountered, tasks completed. This is your raw material.

```python
session_log = {
    "id": session_id,
    "tasks_completed": ["deployed edge function", "fixed CORS issue"],
    "tool_calls": 47,
    "errors": ["initial deploy failed: missing env var"],
    "duration_minutes": 12,
    "tools_used": ["bash", "read", "edit", "grep"]
}
```

### 2. Skill Extraction

After the session ends, a post-processing step analyzes the log. The heuristic is simple: **if a session required more than 5 tool calls to solve a single problem, it's a candidate for skill extraction.**

Why 5? Because anything under 5 is probably straightforward enough that the model handles it fine without a skill. Above 5, there's likely a non-obvious procedure that's worth capturing.

The extractor uses the model itself to analyze the session:

```
Given this session log, identify any multi-step procedures
that required discovery or troubleshooting. For each one,
extract: trigger condition, step-by-step procedure,
anti-patterns discovered, and success criteria.
```

### 3. Skill Storage

Skills get stored as individual files in a skills directory, indexed by category and searchable via full-text search.

```
~/.skills/
  infrastructure/
    deploy-edge-function.md
    configure-dns-records.md
  debugging/
    trace-silent-api-failures.md
  integrations/
    stripe-webhook-setup.md
```

We use SQLite with FTS5 for the index. It's fast, local, zero-dependency, and handles semantic-ish search well enough with trigram matching. You don't need a vector database for this.

### 4. Skill Retrieval

At the start of each session, before the agent begins work, it gets a compact skill catalog injected into context. Not the full skill files — just names, categories, and trigger conditions. Around 3,000 tokens for a dozen skills.

When the agent encounters a task that matches a trigger condition, it loads the full skill file on demand. Progressive disclosure keeps context costs low.

## The Math That Makes This Work

Let's say your agent encounters a deployment issue that takes 47 tool calls to resolve the first time. Each tool call averages 500 tokens of context. That's ~23,500 tokens burned on discovery.

With a skill, the same procedure takes 8 tool calls — the exact steps, no dead ends. That's ~4,000 tokens. You just saved 83% of the compute cost for that task, and it runs 5x faster.

Multiply that across every recurring procedure your agent handles, and the savings compound fast.

But the real value isn't cost savings. It's **reliability**. A skill-equipped agent doesn't improvise solutions to known problems. It follows a proven path. That means fewer errors, fewer retries, and fewer "the agent did something weird" incidents.

## What Doesn't Work

We tried several approaches before landing on this one. Here's what failed:

**Fine-tuning on session logs.** Too expensive for the iteration speed you need. By the time you've fine-tuned, the procedures have changed. Skills are text files — you can update them in seconds.

**RAG over all past sessions.** Too noisy. Past sessions contain dead ends, false starts, and context that's irrelevant to the current task. Skills are curated — they contain only what worked.

**Hardcoded runbooks.** Too brittle. Written by humans, they go stale immediately. Auto-extracted skills stay current because they're generated from actual successful sessions.

**Mega-prompts with everything.** Context window is not free. Dumping every procedure into the system prompt creates a 50,000-token monster that slows inference and confuses the model about what's relevant right now.

## Building Your Own: The Minimum Viable Skill System

You can ship a basic version of this in a weekend. Here's the stack:

1. **Session logger.** Wrap your agent's tool calls in a logger that captures inputs, outputs, and errors. Store as JSON.

2. **Post-session extractor.** A script that runs after each session, passes the log to your model, and asks it to identify reusable procedures. Save outputs as markdown files.

3. **Skill index.** SQLite table with columns for name, category, trigger, and the full skill content. Add FTS5 for search.

4. **Boot injector.** At session start, query the skill index for a compact catalog (names + triggers only) and inject it into context. Load full skills on demand.

That's it. Four components. No vector database. No fine-tuning pipeline. No ML infrastructure.

The sophistication comes later — skill versioning, automatic staleness detection, cross-agent skill sharing, usage analytics. But the core loop is simple: **do work → extract what worked → store it → retrieve it next time.**

## The Bigger Picture

Self-improving agents aren't just a performance optimization. They're a different paradigm.

Static agents scale linearly: every new task gets the same dumb-first-session treatment. Self-improving agents scale logarithmically: each new task is cheaper than the last because the agent's skill library keeps growing.

This is how you get from "AI assistant" to "AI employee." Assistants answer questions. Employees accumulate expertise.

The models will keep getting smarter. But even the smartest model, deployed without a learning loop, is leaving most of its value on the table. Give your agents memory. Give them skills. Let them learn.

The agents that compound are the agents that win.

---

*Like One builds autonomous AI systems that learn and improve. Explore our [AI courses](/courses) or read more about [building agents that actually work](/blog/how-to-build-ai-agent-that-works-2026).*
