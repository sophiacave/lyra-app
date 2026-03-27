---
title: "Output Formats That Work"
course: "prompt-writing-101"
order: 5
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/prompt-writing-101/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Output Formats <span class="accent">That Work.</span></h1>
  <p class="sub">Tell AI what shape the answer should take and you'll never get a wall of useless text again.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The 8 most useful output formats and when to use each</li>
    <li>How to specify format without being rigid</li>
    <li>The "show me the structure" technique</li>
    <li>How to get AI to output in formats you can paste directly into other tools</li>
  </ul>
</div>

<!-- SECTION 1 -->
<div class="lesson-section">
  <span class="section-label">The Problem</span>
  <h2 class="section-title">Why AI gives you walls of text.</h2>
  <p class="section-text">When you don't specify a format, AI defaults to flowing paragraphs. It's like asking someone a question and getting a 10-minute monologue when you needed a yes or no.</p>
  <p class="section-text">The fix is simple: <strong>tell the AI what shape the answer should take.</strong> Not just "give me a list" — but specifically how you want the information organized.</p>
</div>

<!-- SECTION 2: MATCH FORMATS -->
<div class="lesson-section">
  <span class="section-label">The Formats</span>
  <h2 class="section-title">8 formats you'll use constantly.</h2>

<div data-learn="MatchConnect" data-props='{
  "title": "Match Format to Best Use Case",
  "instruction": "Tap a format on the left, then the situation where it works best",
  "pairs": [
    { "left": "Bullet Points", "right": "Brainstorming, quick summaries, idea lists" },
    { "left": "Numbered Steps", "right": "Instructions, processes, how-to guides" },
    { "left": "Table", "right": "Comparisons, decision matrices, data side-by-side" },
    { "left": "Email Format", "right": "Communications you will copy-paste and send directly" },
    { "left": "TL;DR + Deep Dive", "right": "Research, reports, and analysis with varying reader depth" },
    { "left": "JSON / CSV", "right": "Data you will import into spreadsheets or other tools" }
  ]
}'></div>

</div>

<!-- SECTION 3 -->
<div class="lesson-section">
  <span class="section-label">Pro Technique</span>
  <h2 class="section-title">Show the structure, get the structure.</h2>
  <p class="section-text">The most powerful format trick: <strong>show the AI what your ideal output looks like.</strong> Even a rough skeleton works:</p>

  <div class="demo-container" style="padding:1.5rem;background:var(--surface);border:1px solid var(--border2)">
    <pre style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--text);line-height:1.8;white-space:pre-wrap;margin:0">Structure your response like this:

<span style="color:var(--orange)">## [Topic Name]</span>
<span style="color:var(--dim)">One-sentence summary of the key insight.</span>

<span style="color:var(--purple)">**Why it matters:**</span> [2-3 sentences]
<span style="color:var(--green)">**What to do:**</span> [Specific actionable step]
<span style="color:var(--blue)">**Example:**</span> [Real-world example]

Repeat for each topic. Keep each section under 100 words.</pre>
  </div>

  <p class="section-text" style="margin-top:1rem">When AI sees this structure, it mirrors it precisely. You get consistent, scannable output every time — no reformatting needed.</p>
</div>

<!-- SECTION 4 -->
<div class="lesson-section">
  <span class="section-label">Power Move</span>
  <h2 class="section-title">Output for your tools, not your eyes.</h2>
  <p class="section-text">One of the most underused techniques: ask AI to output in the exact format your next tool needs.</p>

<div data-learn="FlashDeck" data-props='{
  "title": "Format for the Destination — Flip to See the Prompt",
  "cards": [
    {
      "front": "📊 Destination: Spreadsheet\n\nYou need data you can paste into Google Sheets or Excel",
      "back": "\"Output as CSV with headers: Name, Category, Priority, Due Date.\"\n\nor\n\n\"Format as a markdown table with columns for Feature, Status, and Owner.\"\n\nSkips the entire reformatting step."
    },
    {
      "front": "🖥️ Destination: Website\n\nYou need content ready for a web page",
      "back": "\"Output as HTML with h2 headings, p tags for paragraphs, and ul/li for lists. Include class names for styling.\"\n\nCopy → paste → publish. No reformatting."
    },
    {
      "front": "📱 Destination: Presentation\n\nYou need slide-ready content",
      "back": "\"Format as one slide per section. Each slide: a title (under 8 words) and exactly 3 bullet points (under 15 words each). End with a summary slide.\"\n\nDrop straight into your deck."
    },
    {
      "front": "🤖 Destination: Another AI Tool\n\nYou need structured data for automation",
      "back": "\"Output as JSON with keys: task, priority (1-5), assignee, deadline. Array of objects, one per task.\"\n\nPipe directly into Zapier, Make, or your own code."
    }
  ]
}'></div>

</div>

<!-- SECTION 5: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your format skills.</h2>

<div data-learn="QuizMC" data-props='{
  "title": "Format Mastery",
  "questions": [
    {
      "q": "You need to compare 5 project management tools for your team. Which format should you request?",
      "options": ["3 paragraphs per tool", "A comparison table with columns for features, price, and pros/cons", "A numbered list of all 5 tools", "A single paragraph summary"],
      "correct": 1,
      "explanation": "Tables are the ideal format for side-by-side comparisons. They make it easy to scan across options and compare specific attributes at a glance."
    },
    {
      "q": "What is the \"show the structure\" technique?",
      "options": ["Asking AI to show you its internal structure", "Providing a skeleton of your desired output format in the prompt", "Letting AI choose whatever structure it wants", "Using bullet points in every prompt"],
      "correct": 1,
      "explanation": "When you show AI a rough template of what your ideal output looks like, it mirrors that structure precisely. This gives you consistent, scannable output without reformatting."
    },
    {
      "q": "You need meeting notes turned into action items for your project tracker. What format should you request?",
      "options": ["Flowing paragraphs summarizing the meeting", "Bullet points with owner and deadline for each action item", "A 500-word essay about the meeting outcomes", "A table with columns: Action Item, Owner, Deadline, Priority"],
      "correct": 3,
      "explanation": "Since this goes into a project tracker, request the exact format your tracker uses — a table with the right columns. Output for your tools, not your eyes."
    }
  ]
}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/prompt-writing-101/the-art-of-constraints" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: The Art of Constraints →</a>
</div>

</div>