---
title: "11 Claude Custom Instructions That Actually Work (2026)"
date: 2026-04-19
updated: 2026-05-28
author: Sophie Cave
description: "Copy-paste these 11 Claude custom instructions for coding, writing, research & data analysis. Ready-to-use templates for Claude Projects, system prompts & CLAUDE.md."
excerpt: "Copy-paste these 11 Claude custom instructions for coding, writing, research & data analysis. Ready-to-use templates for Claude Projects, system prompts & CLAUDE.md."
tags: [claude, custom-instructions, claude-projects, system-prompts, prompt-engineering, ai-tools, best-practices, 2026]
faq:
  - q: "What are the best custom instructions for Claude AI?"
    a: "The best custom instructions for Claude AI are specific, structured, and task-focused. Include your role, audience, response format, banned words, and concrete examples of your preferred output. Create separate Claude Projects for different workflows — coding, writing, research, email — each with tailored instructions. The most effective instructions are 200-500 words long and include anti-patterns (what NOT to do) alongside positive rules."
  - q: "Does Claude have custom instructions like ChatGPT?"
    a: "Yes, but Claude implements them differently. Instead of a single Custom Instructions box, Claude uses Projects — workspaces where you set a system prompt, upload reference files, and every conversation in that Project inherits your instructions. This is more powerful than ChatGPT's approach because you can have different instruction sets for different workflows."
  - q: "How do I set custom instructions in Claude?"
    a: "Create a new Project in Claude, then add your instructions in the 'Project instructions' field. These instructions apply to every conversation started within that Project. You can also upload files — style guides, reference docs, code samples — that Claude can reference. For one-off instructions, just include them at the start of any conversation."
  - q: "What's the difference between Claude Projects and ChatGPT Custom Instructions?"
    a: "Claude Projects let you create multiple instruction sets for different contexts — one for coding, one for writing, one for research. ChatGPT Custom Instructions are global, applying the same rules to every conversation. Claude also lets you upload reference files into Projects, giving it persistent knowledge that ChatGPT's Custom Instructions can't match."
  - q: "Can Claude remember things between conversations?"
    a: "Within a Project, Claude has access to your project instructions and uploaded files in every conversation, which functions like memory. Claude also has a Memory feature that persists across all conversations. However, the conversation itself doesn't carry over — each chat starts fresh, but your instructions and files are always present."
  - q: "What should I put in Claude's custom instructions?"
    a: "Start with your role and what you use Claude for, your preferred response format (length, structure, tone), any domain knowledge Claude should assume you have, and explicit rules about what to do and not do. The best instructions are specific: 'always use code examples in Python, never explain basic syntax, respond in under 200 words unless I ask for detail' beats 'be helpful and concise.'"
  - q: "How many Claude Projects can I create?"
    a: "Claude Pro and Team plans let you create multiple Projects with no practical limit for normal use. Each Project can have its own system prompt and uploaded files. Power users typically create 5-10 Projects covering their main workflows — writing, coding, research, email, analysis — each with tailored instructions."
  - q: "What is CLAUDE.md and how does it work?"
    a: "CLAUDE.md is a custom instructions file used by Claude Code, Anthropic's CLI for developers. You place it in your repository root and Claude Code reads it on every session. It works like a Project system prompt but is version-controlled with your code, so your whole team shares the same AI instructions. You can also create a global ~/.claude/CLAUDE.md for instructions that apply to all projects."
  - q: "What are the best custom instructions for Claude Code?"
    a: "The best CLAUDE.md instructions include your tech stack (languages, frameworks, databases), coding rules (never use 'any' type, always include error handling), file structure overview, testing requirements, and critical constraints (never modify migration files, never log PII). Keep it under 500 words and focus on rules that save you from repeating corrections."
---

# Best Custom Instructions for Claude AI: Projects, System Prompts, and Persistent Context

If you're using Claude without custom instructions, you're starting every conversation from zero. You're re-explaining your role, your preferences, your formatting rules, your tone. Every single time.

Claude's Project system fixes this. Once you set it up, every conversation inherits your rules automatically. No re-explaining. No drift. No "as an AI language model" when you've already told it to skip the disclaimers.

I run [52 courses](/academy/) and an entire business through Claude Projects. Here's how to set them up properly.

## How Claude Custom Instructions Work

Claude doesn't have a single "Custom Instructions" box like ChatGPT. Instead, it has **Projects** — separate workspaces where you define instructions, upload files, and start conversations that all follow the same rules.

This is better than ChatGPT's approach for one reason: **you can have different instructions for different tasks.** Your coding Project has different rules than your writing Project. Your research Project doesn't need your brand voice guidelines.

### The Three Layers of Claude Instructions

1. **Project instructions** — A system prompt that applies to every conversation in that Project. This is where your persistent rules live.
2. **Uploaded files** — Reference documents Claude can access: style guides, code samples, product specs, brand books. Up to 200K tokens of context.
3. **Conversation context** — What you say in each individual chat. This overrides or supplements your Project instructions.

## Setting Up Your First Project

Open Claude → Click "Projects" in the sidebar → "New Project."

**Name it clearly.** "Blog Writing" not "Project 1." You'll have several of these.

**Write your instructions.** This is the system prompt. Everything you put here applies to every conversation in this Project. Be specific:

```
You are helping me write blog posts for likeone.ai.

My audience: small business owners learning to use AI. Non-technical.
My voice: direct, practical, opinionated. Short sentences. No filler.

Rules:
- Write in first person ("I") unless the content is a tutorial ("you")
- Average sentence length: 12 words. Max: 20.
- No words: utilize, leverage, robust, streamline, harness, foster
- Start with the point. No "In today's world" openings.
- Use real examples, not hypothetical ones
- Link to /academy/ when mentioning courses
- Include FAQ schema in frontmatter (q/a format)
- Every post needs internal links to 2-3 related posts
```

**Upload reference files.** Drag in your style guide, a few sample blog posts that represent your best work, your content calendar, your keyword research. Claude reads these and uses them as context.

## The Best Custom Instructions by Use Case

### Writing and Content

```
Role: Blog writer for [your site]
Audience: [specific description]
Voice: [3-5 adjectives + specific rules]
Format: Markdown with H2/H3 headers, short paragraphs
Anti-patterns: [list of AI-writing habits to avoid]
Examples: [2-3 paragraphs of your actual writing]
```

The examples matter more than the rules. Claude learns your voice from demonstration faster than from description. Include before/after pairs showing generic AI output rewritten in your style.

### Coding

```
Language: Python 3.12 / TypeScript 5.x
Framework: Next.js 16, Supabase, Tailwind
Style: Functional over OOP. Named exports. No default exports.
Error handling: Never swallow errors. Log with context.
Testing: pytest / vitest. Test behavior, not implementation.
Comments: Only when the WHY isn't obvious from the code.
Never: console.log debugging in production code. var keyword.
```

### Research and Analysis

```
I'm a [role] researching [domain].
Assume I know: [your baseline knowledge]
Don't explain: [concepts you already understand]
Response format: Lead with the conclusion, then evidence.
Sources: Cite specific papers/data when available.
Length: Under 300 words unless I ask for detail.
When uncertain: Say "I'm not sure" — don't hedge with "it's worth noting."
```

### Email and Communication

```
Writing emails as [your name], [your role] at [company].
Tone: Professional but human. No corporate speak.
Structure: Purpose in first sentence. Context if needed. Ask in final paragraph.
Length: Under 150 words for routine, under 300 for complex.
Sign-off: [your standard closing]
Never: "I hope this email finds you well" or "Please don't hesitate to reach out."
```

## Claude Projects vs ChatGPT Custom Instructions

| Feature | Claude Projects | ChatGPT Custom Instructions |
|---|---|---|
| Multiple instruction sets | Yes — one per Project | No — one global set |
| File uploads for context | Yes — up to 200K tokens | No (separate from instructions) |
| Scope | Per-Project | All conversations |
| Instruction following | Strong — treats as constraints | Moderate — treats as suggestions |
| Memory | Project files + Memory feature | Memory feature |

The practical difference: Claude lets you be a different user in different contexts. Your coding personality and your writing personality don't have to fight over one instruction box.

For a deeper comparison, see [Claude Projects vs Custom GPTs](/blog/custom-gpts-vs-claude-projects-which-is-better/).

## Common Mistakes

**Too vague.** "Be helpful and concise" tells Claude nothing. "Respond in under 150 words, use bullet points for lists of 3+ items, never start with a question" tells it exactly what to do.

**Too long.** Your instructions should be 200-500 words. If you're writing an essay in the system prompt, you're doing it wrong. Put detailed reference material in uploaded files, not the instruction field.

**No examples.** Rules without examples leave room for interpretation. Show Claude what you want — paste a paragraph of your writing and say "this is my voice."

**Forgetting anti-patterns.** Half the value of custom instructions is telling Claude what NOT to do. List the specific AI habits that annoy you. "Never start a response with 'Great question!'" is worth more than five positive rules.

**One mega-Project.** Don't put everything in one Project. Create separate workspaces for separate workflows. Context pollution — coding rules affecting writing output — is real and annoying.

## Power User Techniques

### Template Stacking

Create a base template with your universal rules (tone, formatting, identity) and then create specialized Projects that extend it. Copy your base into each Project, then add context-specific rules on top. This template stacking approach becomes especially powerful when you're building [agentic loops](/blog/what-are-agentic-loops-explained/) that need consistent instructions across autonomous workflows.

### Versioning Your Instructions

When you update your instructions, note the date and what changed. "v3 — 2026-04-19 — added FAQ schema requirement, removed word 'leverage' from banned list." This helps you track what's working and revert if output quality drops.

### Testing Your Instructions

After setting up a Project, ask Claude to write something you've already written. Compare. Where it misses, your instructions are incomplete. Three rounds of this and your instructions are dialed in. See [how to train AI to write like you](/blog/how-to-train-ai-to-write-like-you/) for the full process.

## Claude Code Custom Instructions (CLAUDE.md)

If you use [Claude Code](/blog/claude-agent-sdk-tutorial-build-first-ai-agent/) — Anthropic's CLI for developers — custom instructions work differently. Instead of Projects, you create a `CLAUDE.md` file in your repository root. Claude Code reads it on every session.

This is the most powerful custom instructions pattern because it's **version-controlled with your code**. Your team shares the same instructions. Your CI/CD respects the same rules.

### Minimal CLAUDE.md Example

```markdown
# Project: My SaaS App

## Stack
- Next.js 16 + TypeScript 5.x
- Tailwind CSS v4
- PostgreSQL via Drizzle ORM

## Rules
- Never use `any` type. Use `unknown` and narrow.
- All API routes return `{ data, error }` shape.
- Tests required for every new function.
- Commit messages: conventional commits format.

## File Structure
- `app/` — Next.js app router pages
- `lib/` — shared utilities and database
- `components/` — React components
```

### Advanced CLAUDE.md for Teams

```markdown
# CLAUDE.md — Acme Corp

## Identity
You are a senior engineer working on Acme's billing system.
This is a production system processing real payments.

## Critical Rules
- NEVER modify migration files after they've been applied
- NEVER log PII (email, name, card numbers)
- All Stripe API calls go through lib/stripe-client.ts
- Database changes require a migration, never raw ALTER TABLE

## Testing
- Run `npm test` before suggesting any PR
- Integration tests for all payment flows
- Mock Stripe in tests, never hit live API

## Style
- Prefer composition over inheritance
- No barrel exports (index.ts re-exports)
- Error messages include the operation that failed
```

Claude Code also supports `~/.claude/CLAUDE.md` for global instructions that apply to all projects, and `.claude/settings.json` for permission configuration.

## 5 Ready-to-Copy Custom Instructions

### 1. The Solopreneur (Copy This Exactly)

```
I run a one-person business. I do everything — marketing, product, support, finance.

Rules:
- Give me the fastest path, not the most thorough
- Default to free/cheap tools. I'll ask about premium if I need it
- When I ask "should I," give a yes or no first, then explain
- Format: bullet points. Never paragraphs unless I ask
- Don't suggest hiring someone. I can't.
- Time estimates in hours, not days
```

### 2. The Technical Writer

```
I write developer documentation. My readers are mid-level engineers.

Rules:
- Code examples in every section. Working code, not pseudocode
- Show the import statement. Always
- Error handling in examples. Real errors, not "handle error here"
- No "simply" or "just." If it were simple, they wouldn't be reading docs
- Structure: what it does → when to use it → code → gotchas
- Max 3 paragraphs of prose between code blocks
```

### 3. The Founder Building in Public

```
I'm a startup founder building [product] for [audience].

Rules:
- Every answer should consider: does this make money or save money?
- Default stack: whatever ships fastest
- When I'm overthinking, say "ship it" and explain why
- Marketing copy: conversational, specific, no buzzwords
- Competitor analysis: be honest about where they're better
- Never say "it depends" without picking a side
```

### 4. The Data Analyst

```
I analyze business data. Tools: Python, pandas, SQL, Plotly.

Rules:
- Always show the SQL or pandas code, not just the answer
- Use CTEs in SQL, not subqueries
- Visualizations: clean labels, no chart junk, colorblind-safe palettes
- Statistical claims need p-values or confidence intervals
- When data is ambiguous, show both interpretations
- Format numbers: $1.2M not $1,234,567
```

### 5. The Creative Director

```
I direct brand and creative for a DTC brand. My taste: minimal, editorial, Dieter Rams.

Rules:
- Visual suggestions: reference real brands, not adjectives
- Copy: under 8 words for headlines. No exclamation marks
- Color: suggest specific hex codes, not "a warm blue"
- When I share a design: critique first, suggest second
- "On brand" means: clean, confident, quiet luxury
- Never suggest stock photography. Ever
```

## Start Here

1. Create one Project for your most common Claude task
2. Write 200-300 words of specific instructions
3. Upload 2-3 reference files
4. Test with a real task, compare output, refine
5. Add Projects for your other workflows as needed

The investment is 30 minutes per Project. The return is every conversation after that starting exactly where you want it — no re-explaining, no drift, no wasted prompts.

## Generate Your CLAUDE.md in Seconds

Don't want to write one from scratch? Use our **[free CLAUDE.md Generator](/tools/claudemd-generator/)** — pick your framework, customize the rules, and download a production-ready file. Works with Claude Code, Cursor, and GitHub Copilot.

## What to Read Next

- [CLAUDE.md Generator](/tools/claudemd-generator/) — generate your project instructions file instantly
- [How to Train AI to Write Like You](/blog/how-to-train-ai-to-write-like-you/) — build your voice profile for Claude Projects
- [Claude vs ChatGPT for Writing](/blog/claude-vs-chatgpt-for-writing-2026/) — which AI follows instructions better
- [Claude's Built-in vs Custom Tools](/blog/claude-built-in-tools-vs-custom-tools-explained/) — extending Claude beyond chat
- [Free AI Courses](/academy/) — prompt engineering, automation, and AI workflows
