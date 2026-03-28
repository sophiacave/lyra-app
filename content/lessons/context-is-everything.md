---
title: Context Is Everything
subtitle: Prompt Writing 101 — Like One Academy
slug: context-is-everything
voice: sophia
---

## narration
AI has read virtually everything ever written. But it knows absolutely nothing about you — your company, your audience, your goals, your constraints. Context bridges that gap. It is the single most impactful element of any prompt, and in this lesson, you will master it.
highlight: context, most impactful, master it

## concept: The 6 Types of Context
- Situation (0.15, 0.35)
- Audience (0.35, 0.35)
- Goal (0.55, 0.35)
- Background (0.75, 0.35)
- Constraints (0.35, 0.7)
- Prior Work (0.55, 0.7)
connect: 0-1, 1-2, 2-3, 4-5
duration: 6

## narration
There are six types of context that transform AI output. Situation — what is happening right now. Audience — who will read or use the output. Goal — what you are trying to achieve. Background — relevant history or data. Constraints — limitations like word count, tone, or format. And prior work — anything the AI should build on rather than start from scratch.
highlight: situation, audience, goal, background, constraints, prior work

## narration
Most people provide one type of context at best. They say "write me an email" when they should say "write a follow-up email to a prospect who attended our webinar last Tuesday but did not book a demo — keep it under 150 words, conversational tone, and end with a soft ask." The second prompt gives AI everything it needs to deliver something you can actually send.
highlight: follow-up email, prospect, 150 words, conversational, soft ask

## code: Context-Rich Prompt
```
Situation: I'm launching a new SaaS product
           next month.
Audience:  Technical founders who have used
           similar tools before.
Goal:      Get them to sign up for early access.
Background: We have 200 beta users and 4.8/5
            satisfaction score.
Constraints: Under 200 words. No hype. No
             exclamation marks.

Write the launch announcement email.
```
highlight-lines: 1,3,5,7,9
duration: 9

## narration
Here is the rule of thumb — the more complex the task, the more context you need. A quick grammar check needs almost none. A strategy document needs paragraphs of context. Think of it like a briefing document for a consultant. The more they know, the better their advice. The same is true for AI.
highlight: rule of thumb, briefing document, consultant

## comparison
left: Low Context
right: High Context
left-items: Write a blog post about AI, AI fills gaps with generic assumptions, Output needs heavy editing
right-items: Write a blog post about how small accounting firms can use AI to automate invoice processing — audience is non-technical CPAs who are skeptical of AI, AI targets the exact audience and use case, Output is nearly ready to publish
duration: 8

## narration
One technique that saves enormous time is reusable context blocks. Write a paragraph describing your company, your audience, and your brand voice. Save it. Paste it at the start of every prompt. This gives AI consistent context without you rewriting it each time. Think of it as your AI briefing template.
highlight: reusable context blocks, AI briefing template

## quote
> Without context, AI is the smartest person in the room who just walked in five minutes late.
— Like One Academy
duration: 5

## narration
You now have the two most powerful elements — roles and context. In the next lesson, we will cover output formats and constraints — how to tell AI exactly what shape the answer should take. The RCFCE framework is coming together.
highlight: roles, context, output formats, constraints, RCFCE

## outro
heading: Like One Academy
subtext: Next — Output Formats That Work
cta: likeone.ai/academy/prompt-writing-101
duration: 4
