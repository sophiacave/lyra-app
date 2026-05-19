---
title: "The AI Stack That Runs Our Entire Company (2026 Breakdown)"
slug: "the-ai-stack-that-runs-our-company-2026"
date: "2026-05-17"
author: "Sophia Cave"
excerpt: "We replaced SaaS subscriptions, manual workflows, and an entire operations team with autonomous AI agents. Here's the exact stack — every tool, every layer, every decision."
tags: ["AI Stack", "Build in Public", "AI Agents", "Automation", "Claude", "Infrastructure"]
image: "/blog/ai-stack-company.webp"
published: true
---

# The AI Stack That Runs Our Entire Company

Like One has no operations team. No VA. No project manager. No social media coordinator.

One founder. One AI twin. A stack of autonomous agents that handle everything from grant applications to blog publishing to email outreach to revenue tracking.

This isn't a demo. This is the actual production infrastructure running a company with a 501(c)(3) nonprofit arm, an AI education academy, and a consulting practice.

Here's the full breakdown.

## Layer 1: The Brain (Persistent State)

Every AI system dies without memory. ChatGPT forgets you exist between sessions. Most agent frameworks treat state as an afterthought.

Our brain is a local SQLite database with 700+ entries across structured categories: active work, directives, plans, product state, infrastructure config. Full-text search via FTS5. No cloud dependency.

**Why SQLite over Postgres or Supabase?** Three reasons:

1. **Zero latency.** Local disk reads in microseconds. No network round-trips.
2. **Zero cost.** No managed database bills. No connection pooling headaches.
3. **Portability.** The entire brain travels with the machine. Back it up with `cp`.

Every agent session boots by reading brain state. Every session ends by writing back what changed. The brain is the shared nervous system — agents don't talk to each other directly. They read and write to the brain.

**Key insight:** Most AI memory systems try to be clever with embeddings and vector stores. We use those too (ChromaDB for semantic search), but the foundation is structured key-value data. You can query it, version it, and debug it. Embeddings are supplements, not the source of truth.

## Layer 2: The Agent Runtime

Our primary agent runs on Claude Opus 4.6 with a 1M token context window through Claude Code. Not the API. Not a wrapper. The actual CLI tool that can read files, run commands, edit code, and interact with the operating system.

This matters because most "AI agent" frameworks give you a chatbot that can call functions. Claude Code gives you an AI that can *use a computer*.

The agent has:

- **Tool hierarchy.** 40+ tools ranked by power and risk. File reads before shell commands. Dedicated tools before Bash. Reversible actions before irreversible ones.
- **MCP integrations.** Model Context Protocol servers for Gmail, Google Calendar, Slack, Notion, Vercel, Stripe, DNS management, and custom tools we built.
- **Autonomous hooks.** Pre and post-tool hooks that enforce guardrails, track usage, and prevent catastrophic actions (like `rm -rf` or force-pushing to main).

The agent doesn't wait for instructions. It boots, reads the brain, finds the next task, and works. If it finishes, it picks up the next thing. No idle state.

## Layer 3: Specialized Agents

One generalist agent can't do everything well. We run eight specialist agents across a sprint cycle inspired by Google's Design Sprint Kit:

| Agent | Role | When It Runs |
|-------|------|-------------|
| Orchestrator | Coordinates sprints, manages flow | Always on |
| Architect | System design, technical decisions | Phase 3 (Sketch) |
| Analyst | Research, data analysis | Phase 1 (Understand) |
| Builder | Code, infrastructure, deployment | Phase 5 (Prototype) |
| Designer | UI/UX, design systems | Phase 5 (Prototype) |
| Tester | Validation, regression, smoke tests | Phase 6 (Validate) |
| Guardian | Security, quality gates, risk review | Always on |
| Messenger | Communications, email, social | On demand |

Each agent has a specific prompt, specific tools, and specific guardrails. The Builder can deploy code. The Messenger can send emails. The Guardian can block either of them if something looks wrong.

**The bus is the brain.** Agents don't message each other. They write findings to the brain. The Orchestrator reads the brain and decides who works next. Simple. Debuggable. No message-passing chaos.

## Layer 4: Web Automation

Half of running a business involves clicking through web portals. Grant applications. Job boards. Service dashboards. Admin panels.

We built a Playwright-over-CDP bridge to a real Chrome instance. Not headless. Not a bot browser. The actual Chrome on the machine, with all cookies, sessions, and extensions intact.

**Why real Chrome?** Because headless browsers get blocked. reCAPTCHA, Cloudflare, bot detection — they all fail against a real browser controlled programmatically. Our system passes every check because it *is* a real browser.

The password manager pulls credentials from macOS Keychain. Auto-detects login forms. Matches the service from the URL. Fills and submits. Zero manual auth.

## Layer 5: Content Engine

You're reading content generated by this layer right now.

The content engine (internally called Nova) runs on a schedule. It:

1. Reads brain state to understand what's happening in the company
2. Analyzes SEO data (Google Search Console via MCP) for keyword opportunities
3. Rotates through content pillars (AI Strategy, Engineering, Build in Public, Nonprofit Tech)
4. Writes complete blog posts with frontmatter, internal links, FAQ schema, and CTAs
5. Generates matching social drafts for four platforms

108 blog posts published. Zero written manually. Every post is original, practical, and targets specific search queries.

**The difference from "AI-generated content":** Nova doesn't generate slop. It writes from real experience — actual systems we built, actual problems we solved, actual architecture decisions we made. The AI has full context on the company because it *is* the company's operating system.

## Layer 6: Revenue and Operations

- **Stripe integration.** Revenue tracking, subscription management, coupon creation — all through CLI tools. `stripe-dashboard revenue` gives a real-time snapshot.
- **Grant pipeline.** 56 grants tracked across the nonprofit arm. Automated discovery, eligibility scoring, application drafting, and submission tracking.
- **Email.** Outbound email through a custom send script. SPF/DKIM/DMARC configured. BCC to archive. No manual sending.
- **Resume and job search.** AI-tailored resumes and cover letters. Automated application submission through Playwright.

## What This Stack Costs

Here's what makes this interesting:

| Component | Monthly Cost |
|-----------|-------------|
| Claude Code (Max plan) | $200 |
| Vercel (hosting) | $0 (hobby) |
| Bunny CDN (video) | ~$1 |
| Domain | ~$1 |
| **Total** | **~$202/mo** |

No Zapier ($50+/mo). No HubSpot ($800+/mo). No project management tool ($10+/seat). No social scheduling tool ($30+/mo). No email marketing platform ($20+/mo).

The AI *is* the tool. Every SaaS subscription we'd otherwise need is replaced by an agent that does the actual work, not a dashboard that shows you the work you still need to do.

## What We'd Do Differently

**Start with the brain.** We built tools first and added memory later. That's backwards. Your agent's brain should be the first thing you build. Every tool, every agent, every automation reads from and writes to the brain.

**Don't over-engineer memory.** We tried vector-only approaches. They hallucinate context. Structured key-value pairs with optional semantic search on top is the right architecture for 90% of use cases.

**Use real browsers.** We burned weeks on headless Playwright before switching to CDP-connected Chrome. If your automation touches any site with bot detection, go real-browser from day one.

**Build the tool hierarchy before writing agent logic.** Your agent will only be as good as the tools you give it. Spend 80% of your time on tools and 20% on prompts.

## The Takeaway

You don't need a team to run a company. You need a brain, a runtime, specialized agents, and the discipline to automate everything.

The stack isn't magic. It's SQLite, Claude, Playwright, and a lot of shell scripts glued together with clear conventions.

The magic is that it compounds. Every agent session makes the brain smarter. Every automation removes a manual step permanently. Every blog post improves SEO that feeds back into revenue.

We're one founder building what used to require a team of ten. Not because AI replaced those people — because AI made most of those roles unnecessary in the first place.

---

*Want to build your own AI stack? Start with [AI Foundations](/academy) or go deep with [Claude Mastery](/academy). Questions? [Book a consultation](/consulting).*
