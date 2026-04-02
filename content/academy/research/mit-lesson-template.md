# MIT Lesson Gold Standard Template
> Reference doc for the MIT-Quality Academy Upgrade campaign.
> Every lesson rewrite MUST follow this structure.
> Brain key: `plan.mit_quality_academy`, `directive.academy_accessibility`

## The Like One Quality Test
Before shipping any lesson, ask:
**"Would a single mom with a high school education, working retail, who wants to use AI to get a better job — would SHE feel welcome and capable reading this?"**
If not, rewrite it.

---

## Lesson Structure (12 sections)

### 1. Frontmatter
```yaml
---
title: "Human-readable, compelling title"
course: "course-slug"
order: N
type: "lesson"          # lesson | lab | quiz | assessment
free: true/false
css: "optional-custom.css"
---
```

### 2. Hero + Learning Objectives
- Compelling H1 with personality
- Subtitle that hooks ("Your voice is sacred. AI is just the fastest pen you've ever held.")
- "After this lesson you'll know" — 3-4 concrete outcomes
- **Accessibility:** Written in everyday language. No jargon in the objectives.

### 3. Plain-Language Context Hook (WHY THIS MATTERS)
- 2-3 paragraphs explaining why this topic matters to the learner's LIFE
- Connect to a real problem they face
- **Accessibility:** Start with a scenario anyone can relate to
- Example: "Every time you Google something and get a wall of irrelevant results..."

### 4. Real-World Analogy
- Bridge from the known to the unknown
- MCP = USB for AI. Embeddings = GPS coordinates for words. RAG = a librarian.
- **Accessibility:** Use analogies from daily life, not from other tech concepts
- Callout box format with emoji

### 5. Core Concepts — Plain Language First
- Explain the concept in everyday words BEFORE introducing the technical term
- "This is called [technical term] — but all it really means is..."
- Use short paragraphs, bold key phrases
- **Accessibility:** If you must use jargon, define it inline immediately

### 6. Code Examples (technical courses only)
- 2-5 working code snippets per lesson
- EVERY line has a plain-English comment explaining WHAT it does
- Non-coders should understand the intent even if they can't write the code
- Show input AND output (what you type, what you get back)
- Progressive: simple example first, then build complexity
```javascript
// Ask Claude to summarize a document
// (This sends your text to Claude and gets a short version back)
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',    // Which AI model to use
  max_tokens: 300,              // Keep the summary short
  messages: [{
    role: 'user',
    content: 'Summarize this in 3 bullet points: ...'
  }]
});
```

### 7. Visual Aids (1-3 per lesson)
- ASCII art diagrams for architecture/flow
- Comparison tables for options/tradeoffs
- Mermaid charts for processes
- **Accessibility:** Every diagram has a text description below it
```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  You     │ ──▶ │  Claude  │ ──▶ │  Result  │
│  (prompt)│     │  (thinks)│     │  (answer) │
└─────────┘     └──────────┘     └──────────┘
   ↑ You write       ↑ AI processes      ↑ You review
     a question        your request        the output
```

### 8. Worked Example / Real-World Walkthrough
- Step-by-step walkthrough of a real scenario
- "Let's say you're a freelance writer who needs to..."
- Show the thinking process, not just the solution
- **Accessibility:** Use relatable scenarios (job application, small business, school project)

### 9. Common Pitfalls & Troubleshooting
- 3-5 common mistakes with fixes
- "If you see [X], it usually means [Y]. Fix it by [Z]."
- **Accessibility:** Normalize mistakes — "Almost everyone gets this wrong the first time"

### 10. Interactive Exercises (already strong — maintain quality)
- 8 exercises per lesson
- Types: prompt, rewrite, debug, analyze, freeform
- Good/bad examples, hints, success messages
- Criteria for validation

### 11. What You Just Learned (celebration + summary)
- 3-5 bullet recap
- Tone: empowering, not condescending
- "You now know how to [X]. That puts you ahead of 95% of people."
- **Accessibility:** Make them feel capable, not overwhelmed

### 12. Further Reading & References
- 2-5 curated links
- Each with a 1-line annotation explaining what they'll find
- Mix: official docs, beginner-friendly tutorials, deep dives
- **Accessibility:** Label difficulty ("Beginner-friendly", "Deep dive for curious minds")

---

## Word Count Targets
| Course type | Minimum | Target | Maximum |
|------------|---------|--------|---------|
| Beginner | 1500 | 2000 | 2500 |
| Intermediate | 1800 | 2500 | 3000 |
| Advanced | 2000 | 3000 | 4000 |

## Accessibility Checklist (check ALL before shipping)
- [ ] First paragraph uses zero jargon
- [ ] Every technical term defined inline on first use
- [ ] At least 1 real-world analogy
- [ ] Code comments explain WHAT, not just HOW
- [ ] No assumed prerequisites without a link
- [ ] Lesson ends with empowerment, not overwhelm
- [ ] A non-technical person could explain the lesson's main idea after reading it

## What Makes Like One Different
Other platforms: "Here's what embeddings are. Here's the math."
Like One: "Your phone knows that 'I'm starving' and 'I need food' mean the same thing. That's embeddings. Here's how it works — and here's how you can use it to build something cool."

**Rigorous enough for MIT. Accessible enough for everyone. That's the standard.**
