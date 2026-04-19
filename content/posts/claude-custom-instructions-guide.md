---
title: "Claude Custom Instructions: How to Set Up Projects, System Prompts, and Persistent Context"
date: 2026-04-19
author: Sophia Cave
description: "Master Claude custom instructions using Projects, system prompts, and style guides. Learn how to make Claude remember your preferences, follow your rules, and write in your voice every session."
excerpt: "Master Claude custom instructions using Projects, system prompts, and style guides. Learn how to make Claude remember your preferences, follow your rules, and write in your voice every session."
tags: [claude, custom-instructions, claude-projects, system-prompts, prompt-engineering, ai-tools, 2026]
faq:
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
---

# Claude Custom Instructions: How to Set Up Projects, System Prompts, and Persistent Context

If you're using Claude without custom instructions, you're starting every conversation from zero. You're re-explaining your role, your preferences, your formatting rules, your tone. Every single time.

Claude's Project system fixes this. Once you set it up, every conversation inherits your rules automatically. No re-explaining. No drift. No "as an AI language model" when you've already told it to skip the disclaimers.

I run [30 courses](/academy/) and an entire business through Claude Projects. Here's how to set them up properly.

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

Create a base template with your universal rules (tone, formatting, identity) and then create specialized Projects that extend it. Copy your base into each Project, then add context-specific rules on top.

### Versioning Your Instructions

When you update your instructions, note the date and what changed. "v3 — 2026-04-19 — added FAQ schema requirement, removed word 'leverage' from banned list." This helps you track what's working and revert if output quality drops.

### Testing Your Instructions

After setting up a Project, ask Claude to write something you've already written. Compare. Where it misses, your instructions are incomplete. Three rounds of this and your instructions are dialed in. See [how to train AI to write like you](/blog/how-to-train-ai-to-write-like-you/) for the full process.

## Start Here

1. Create one Project for your most common Claude task
2. Write 200-300 words of specific instructions
3. Upload 2-3 reference files
4. Test with a real task, compare output, refine
5. Add Projects for your other workflows as needed

The investment is 30 minutes per Project. The return is every conversation after that starting exactly where you want it — no re-explaining, no drift, no wasted prompts.

## What to Read Next

- [How to Train AI to Write Like You](/blog/how-to-train-ai-to-write-like-you/) — build your voice profile for Claude Projects
- [Claude vs ChatGPT for Writing](/blog/claude-vs-chatgpt-for-writing-2026/) — which AI follows instructions better
- [Claude's Built-in vs Custom Tools](/blog/claude-built-in-tools-vs-custom-tools-explained/) — extending Claude beyond chat
- [Free AI Courses](/academy/) — prompt engineering, automation, and AI workflows
