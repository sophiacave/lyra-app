# Output Formats That Work

**Course:** Prompt Writing 101
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/prompt-writing-101/)
  Lesson 5 of 10


  # Output Formats That Work.

  Tell AI what shape the answer should take and you'll never get a wall of useless text again.


  ### After this lesson you'll know


    - The 8 most useful output formats and when to use each

    - How to specify format without being rigid

    - The "show me the structure" technique

    - How to get AI to output in formats you can paste directly into other tools




  The Problem
  ## Why AI gives you walls of text.

  When you don't specify a format, AI defaults to flowing paragraphs. It's like asking someone a question and getting a 10-minute monologue when you needed a yes or no.
  The fix is simple: **tell the AI what shape the answer should take.** Not just "give me a list" — but specifically how you want the information organized.


  The Formats
  ## 8 formats you'll use constantly.


### 8 Output Formats — Flip to See When to Use Each

**Card 1:**
Front: 📋 Bullet Points  The most versatile format. Scannable, sharp, efficient.
Back: Use when: Slack updates, meeting notes, quick summaries, internal communication.  Prompt: "Give me this as 5-7 bullet points, one key insight per bullet."

**Card 2:**
Front: 📊 Table / Comparison  Side-by-side structure for decisions and analysis.
Back: Use when: Comparing options, feature lists, pros/cons, vendor evaluations.  Prompt: "Create a table comparing [A] vs [B] across these criteria: [list]. Include a recommendation row."

**Card 3:**
Front: 📝 Step-by-Step  Numbered sequences for processes and instructions.
Back: Use when: How-to guides, onboarding docs, troubleshooting, recipes.  Prompt: "Give me step-by-step instructions. Number each step. Include expected outcome per step."

**Card 4:**
Front: 📧 Email / Message  Ready-to-send communication in the right tone.
Back: Use when: Any time the output goes directly to another person.  Prompt: "Write this as an email. Include subject line. Under 150 words. Tone: [describe]."

**Card 5:**
Front: 🗒️ Executive Summary  The insight first, then evidence. For busy readers.
Back: Use when: Reports to leadership, board updates, stakeholder communication.  Prompt: "Write a 3-sentence executive summary. Lead with the bottom line."

**Card 6:**
Front: 💻 Code / JSON / Structured Data  Machine-readable or developer-ready output.
Back: Use when: API responses, config files, data processing, automation scripts.  Prompt: "Return this as valid JSON with keys for [x, y, z]." or "Write this as a Python function."

**Card 7:**
Front: 🎯 Pros & Cons List  Balanced analysis for decision-making.
Back: Use when: You need to weigh options, present trade-offs, or get a recommendation.  Prompt: "Give me 5 pros and 5 cons. Then your recommendation with reasoning."

**Card 8:**
Front: 📄 Report / Document  Long-form structured output with sections and headers.
Back: Use when: Documentation, proposals, analysis write-ups, presentations.  Prompt: "Structure this as a report with these sections: [list]. Include headers, key findings, and action items."


  Deep Dive
  ## Format examples you can copy right now.

  Knowing the formats is step one. Seeing them in action with real prompts is where the skill locks in. Here are four of the most useful formats with exact prompts and what they produce.


Format Example 1 — Markdown Table

```
[PROMPT]:
Compare Notion, Trello, and Asana for a 10-person
marketing team. Format as a markdown table with columns:
Tool, Best For, Price/User/Mo, Biggest Limitation,
Learning Curve (1-5). Add a recommendation row at the bottom.

[WHY THIS WORKS]:
- The table structure is explicit — AI knows exact columns
- "Recommendation row" forces a conclusion, not just data
- "10-person marketing team" gives audience context
- You can paste this table directly into Slack or a doc
```


Format Example 2 — JSON for Automation

```
[PROMPT]:
Extract the action items from these meeting notes and
return them as a JSON array. Each object should have keys:
"task" (string), "owner" (string), "deadline" (ISO date
string or null), "priority" (1-5 integer).

Meeting notes:
[paste your notes here]

[WHY THIS WORKS]:
- Specifying data types (string, ISO date, integer) prevents
  inconsistent formatting
- The JSON can be piped into Zapier, Make, or your own code
- "or null" handles cases where no deadline was mentioned
```


Format Example 3 — Executive Summary

```
[PROMPT]:
Summarize this 20-page report for my CEO. Format:

1. BOTTOM LINE (1 sentence — the single most important takeaway)
2. THREE KEY FINDINGS (bullet points, one sentence each)
3. RECOMMENDED ACTION (what to do next, in 2 sentences)
4. RISK IF WE DO NOTHING (1 sentence)

Total length: under 150 words. No jargon.

[WHY THIS WORKS]:
- "Bottom line first" mirrors how executives read
- Numbered sections with word limits prevent rambling
- "No jargon" forces plain language
- "Risk if we do nothing" adds urgency without you asking for it
```


Format Example 4 — Step-by-Step with Checkpoints

```
[PROMPT]:
Write a step-by-step guide for setting up Google Analytics
on a new website. Audience: a small business owner who is
not technical.

For each step:
- Number it
- Give the action in one sentence
- Add a "You'll know it worked when..." checkpoint
- Include a common mistake to avoid

Keep it under 10 steps. Use plain language — no developer jargon.

[WHY THIS WORKS]:
- "You'll know it worked when" gives the reader confidence
- "Common mistake" prevents frustration before it happens
- "Under 10 steps" prevents the AI from over-breaking the task
- "No developer jargon" matches the non-technical audience
```


  Decision Guide
  ## How to pick the right format every time.

  The format you choose should be driven by two questions: **What will you do with the output?** and **Who will read it?**




        If the output goes to...

          - A busy executive → Executive Summary

          - A spreadsheet → CSV or Table

          - A teammate on Slack → Bullet Points

          - A client inbox → Email format

          - A website → HTML with semantic tags

          - A project tracker → Table with status columns

          - Another AI tool → JSON

          - A presentation → Slide-by-slide with titles + bullets




        If the reader needs to...

          - Compare options → Table

          - Follow instructions → Step-by-Step

          - Make a decision → Pros & Cons

          - Get the gist quickly → Bullet Points

          - Understand deeply → Report with sections

          - Take action → Email or Message

          - Process data → JSON or CSV

          - Present to others → Slide format






  **The golden rule:** think about where the output ends up BEFORE you write the prompt. The best format is the one that requires zero reformatting after you get it.


  Pro Technique
  ## Show the structure, get the structure.

  The most powerful format trick: **show the AI what your ideal output looks like.** Even a rough skeleton works:


    Structure your response like this:

## [Topic Name]
One-sentence summary of the key insight.

**Why it matters:** [2-3 sentences]
**What to do:** [Specific actionable step]
**Example:** [Real-world example]

Repeat for each topic. Keep each section under 100 words.


  When AI sees this structure, it mirrors it precisely. You get consistent, scannable output every time — no reformatting needed.


  Power Move
  ## Output for your tools, not your eyes.

  One of the most underused techniques: ask AI to output in the exact format your next tool needs.


### Format for the Destination — Flip to See the Prompt

**Card 1:**
Front: 📊 Destination: Spreadsheet  You need data you can paste into Google Sheets or Excel
Back: "Output as CSV with headers: Name, Category, Priority, Due Date."  or  "Format as a markdown table with columns for Feature, Status, and Owner."  Skips the entire reformatting step.

**Card 2:**
Front: 🖥️ Destination: Website  You need content ready for a web page
Back: "Output as HTML with h2 headings, p tags for paragraphs, and ul/li for lists. Include class names for styling."  Copy → paste → publish. No reformatting.

**Card 3:**
Front: 📱 Destination: Presentation  You need slide-ready content
Back: "Format as one slide per section. Each slide: a title (under 8 words) and exactly 3 bullet points (under 15 words each). End with a summary slide."  Drop straight into your deck.

**Card 4:**
Front: 🤖 Destination: Another AI Tool  You need structured data for automation
Back: "Output as JSON with keys: task, priority (1-5), assignee, deadline. Array of objects, one per task."  Pipe directly into Zapier, Make, or your own code.


  Knowledge Check
  ## Test your format skills.


### Quiz

**Q1: You need to compare 5 project management tools for your team. Which format should you request?**
    A. 3 paragraphs per tool
  ✓ B. A comparison table with columns for features, price, and pros/cons
    C. A numbered list of all 5 tools
    D. A single paragraph summary
  *Tables are the ideal format for side-by-side comparisons. They make it easy to scan across options and compare specific attributes at a glance.*

**Q2: What is the "show the structure" technique?**
    A. Asking AI to show you its internal structure
  ✓ B. Providing a skeleton of your desired output format in the prompt
    C. Letting AI choose whatever structure it wants
    D. Using bullet points in every prompt
  *When you show AI a rough template of what your ideal output looks like, it mirrors that structure precisely. This gives you consistent, scannable output without reformatting.*

**Q3: You need meeting notes turned into action items for your project tracker. What format should you request?**
    A. Flowing paragraphs summarizing the meeting
    B. Bullet points with owner and deadline for each action item
    C. A 500-word essay about the meeting outcomes
  ✓ D. A table with columns: Action Item, Owner, Deadline, Priority
  *Since this goes into a project tracker, request the exact format your tracker uses — a table with the right columns. Output for your tools, not your eyes.*


  [Next: The Art of Constraints →](/academy/prompt-writing-101/the-art-of-constraints)
