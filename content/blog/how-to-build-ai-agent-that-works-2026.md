---
title: "How to Build an AI Agent That Actually Works"
slug: "how-to-build-ai-agent-that-works-2026"
date: "2026-05-10"
author: "Sophie Cave"
category: "Engineering"
tags: ["ai agents", "claude", "agent sdk", "building ai", "production ai"]
description: "Most AI agents break in production. Here's the architecture that doesn't — tool hierarchies, memory systems, and the divine cycle pattern that keeps agents running autonomously."
image: "/blog/ai-agent-architecture.jpg"
---

# How to Build an AI Agent That Actually Works

Everyone's building AI agents. Almost nobody's shipping ones that survive contact with reality.

The problem isn't the models. Claude Opus 4.6 can reason circles around most engineering teams. The problem is architecture. Most agent builders skip the boring parts — memory, tool selection, failure recovery — and wonder why their agent hallucinates its way into a wall after three steps.

We've been building production agents at Like One since early 2026. Not demos. Not chatbots with a "tool use" wrapper. Actual autonomous systems that run grant applications, manage infrastructure, and generate revenue without a human in the loop.

Here's what we learned.

## 1. Tools Are Not Optional — They're the Skeleton

The biggest mistake in agent design: treating tools as an afterthought.

Your agent is only as capable as its tool layer. A model with no tools is a brain in a jar. A model with bad tools is a brain with broken hands.

**Build a tool hierarchy.** Not every tool is equal. Some are fast and cheap (file reads, database queries). Some are slow and expensive (web scraping, API calls). Some are irreversible (sending emails, deploying code).

Rank your tools. Make your agent reach for the simplest tool first. Escalate only when needed.

```
Level 1: Read (files, database, memory)
Level 2: Search (grep, glob, semantic search)
Level 3: Execute (API calls, shell commands)
Level 4: Interact (browser automation, form filling)
Level 5: Commit (deploy, send, publish)
```

Each level requires more trust. Your agent should earn its way up.

## 2. Memory Is the Difference Between a Demo and a Product

Stateless agents are toys. They forget everything between sessions. They re-discover the same information. They make the same mistakes.

Production agents need three memory layers:

- **Working memory**: Current session context. What am I doing right now?
- **Episodic memory**: What happened in previous sessions? What worked? What failed?
- **Semantic memory**: Persistent knowledge — project structure, user preferences, system state.

We use a combination of SQLite for structured state, vector stores (ChromaDB) for semantic search, and a brain context system for key-value lookups. The agent reads memory on boot and writes checkpoints before shutdown.

No goldfish agents. Ever.

## 3. The Cycle That Keeps Agents Alive

Linear agents die. They execute a plan, hit an error, and stop.

Production agents run in cycles:

```
Plan → Execute → Test → Checkpoint → Loop
```

**Plan**: Read state. Identify what needs doing. Set success criteria.
**Execute**: Do the work. One task at a time. Quality-gate each step.
**Test**: Verify in the real environment. Don't trust assumptions.
**Checkpoint**: Write state to memory. Log what happened.
**Loop**: Check for next task. If none, hand off cleanly.

The key insight: **the agent never stops.** If it finishes a task, it checks for the next one. If there's nothing left, it writes a handoff note for the next session. Dead air is a bug.

## 4. Failure Recovery Is Architecture, Not Error Handling

Try-catch blocks don't save agents. You need structural resilience:

- **3-Strike Rule**: Before asking a human, the agent must (1) check its memory, (2) try to decide autonomously, (3) attempt a solution. Only after all three fail does it escalate.
- **Tool fallbacks**: If the primary tool fails, have a backup. Browser automation down? Try the API. API rate-limited? Queue and retry later.
- **State persistence**: If the agent crashes mid-task, it should resume from the last checkpoint, not start over.

Most agent frameworks don't handle this. You'll build it yourself.

## 5. Ship Small, Ship Real

Don't build a "general purpose agent." Build an agent that does one thing autonomously, end-to-end.

Examples that actually work:
- An agent that monitors grant deadlines and drafts applications
- An agent that generates weekly content and queues social posts
- An agent that runs security scans and files tickets for findings

Start with a single workflow. Make it bulletproof. Then expand.

## The Architecture Stack

For teams starting today, here's what we'd recommend:

| Layer | Tool | Why |
|-------|------|-----|
| Model | Claude Opus 4.6 | Best reasoning, 1M context, tool use |
| Agent Framework | Claude Agent SDK | Native tool orchestration |
| Memory | SQLite + ChromaDB | Structured + semantic |
| Automation | Playwright | Browser automation that works |
| Orchestration | Multi-agent dispatch | Parallelize independent work |

The model matters less than you think. The architecture matters more than anyone admits.

## Start Building

We teach this entire stack — from first agent to production deployment — in our [Claude Mastery course](https://likeone.ai/academy). It's the same architecture we run in production. No theory. No demos. Real systems.

If you want to go deeper on the engineering side, the [AI Foundations course](https://likeone.ai/academy) covers the fundamentals you need before building agents: embeddings, RAG, tool design, and evaluation.

The gap between "I built a chatbot" and "I built an autonomous system" is mostly architecture. Now you know where to start.

---

*Sophie Cave is the founder of Like One, where she builds AI systems that actually run businesses. She writes about production AI, agent architecture, and why most AI demos are lies.*
