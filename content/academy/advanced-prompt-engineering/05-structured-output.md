---
title: "Structured Output"
course: "advanced-prompt-engineering"
order: 5
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/advanced-prompt-engineering/">Advanced Prompt Engineering</a>
  <span class="lesson-badge">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Structured Output</h1>
  <p><span class="accent">Get JSON, tables, CSV, and precise formats — every time.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How to get consistent, machine-readable output from AI</li>
    <li>JSON, Markdown tables, CSV, and custom formats</li>
    <li>Schema-driven prompting for reliable data extraction</li>
    <li>Handling edge cases and validation</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Why It Matters</span>
  <h2 class="section-title">AI Output You Can Actually Use in Code</h2>
  <p class="section-text">Free-form text is great for reading. It's terrible for automation. If you're building workflows, feeding AI output into other tools, or processing data — you need structured output that's consistent and parseable.</p>
  <p class="section-text">The good news: AI is excellent at producing structured data. You just have to ask correctly.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Technique 1</span>
  <h2 class="section-title">JSON Output with Schema</h2>
  <p class="section-text">The most reliable way to get JSON: show the exact schema you want, with descriptions for each field.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Schema-Driven Prompt</h4>
      <code>Extract product information from the following review and return it as JSON matching this exact schema:

{
  "product_name": "string — the product being reviewed",
  "rating": "number — 1 to 5, inferred from sentiment if not explicit",
  "pros": ["string — list of positive points mentioned"],
  "cons": ["string — list of negative points mentioned"],
  "would_recommend": "boolean — true if reviewer recommends it",
  "summary": "string — one-sentence summary of the review"
}

Return ONLY the JSON object. No explanation. No markdown code fences.</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Technique 2</span>
  <h2 class="section-title">Tables and Comparison Formats</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Markdown Table Prompt</h4>
      <code>Compare these three databases in a Markdown table with these exact columns:
| Feature | PostgreSQL | MongoDB | Redis |
Include rows for: Data Model, Scalability, Best Use Case, Learning Curve, Cost (self-hosted).
Keep each cell to 10 words or fewer.</code>
    </div>
  </div>

  <p class="section-text">The key: specify columns, rows, and cell constraints. Without constraints, cells become paragraphs and the table becomes unreadable.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Technique 3</span>
  <h2 class="section-title">The "Output First" Trick</h2>
  <p class="section-text">Start the AI's response for it. This anchors the format immediately.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Anchored Output</h4>
      <code>List the top 5 risks in this business plan as a numbered list. Each item should have a risk name in bold, followed by a one-sentence explanation and a severity tag [HIGH/MEDIUM/LOW].

Start your response with:
1. **</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Starting the output forces the AI into your format from the first token.</p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="MatchConnect" data-props='{"title":"Structured Output — Match the Technique to Its Purpose","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Schema-Driven Prompt","right":"Show the exact JSON structure with field descriptions to get consistent output"},{"left":"Output First Trick","right":"Start the AI\u2019s response yourself to anchor the format from the first token"},{"left":"Markdown Table Prompt","right":"Specify columns, rows, and cell length constraints for parseable tables"},{"left":"Return ONLY directive","right":"Prevent helpful preambles like \u2018Here is the JSON:\u2019 before your data"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Common Pitfalls</span>
  <h2 class="section-title">When Structured Output Breaks</h2>
  <p class="section-text"><strong style="color: var(--red);">The "helpful" preamble:</strong> AI loves to add "Here's the JSON:" before your data. Fix: "Return ONLY the JSON. No preamble. No explanation."</p>
  <p class="section-text"><strong style="color: var(--red);">Inconsistent keys:</strong> Sometimes the AI renames fields. Fix: provide the exact schema and say "use these exact key names."</p>
  <p class="section-text"><strong style="color: var(--red);">Mixed types:</strong> A field that should be a number comes back as a string. Fix: specify types in your schema description.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Extract Structured Data</h2>
  <div class="try-it-box">
    <p>Find a product review, article, or email. Write a prompt that extracts the key information into a JSON object with at least 5 fields. Make sure you get clean, parseable output.</p>
    <div class="prompt-box">
      <code>Extract the following from this text and return as JSON:
{
  "field_1": "type — description",
  "field_2": "type — description"
}
Return ONLY valid JSON. No markdown. No explanation.</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Structured Output Quiz","questions":[{"q":"What is the most reliable way to get consistent JSON from an AI?","options":["Ask nicely for JSON","Provide the exact schema with field descriptions and types","Ask for JSON at the end of the prompt","Use bullet points instead"],"correct":1,"explanation":"Schema-driven prompting — showing the exact structure with type descriptions for each field — gives the AI a precise blueprint to follow, dramatically improving consistency."},{"q":"Why does the \u2018Output First\u2019 trick work?","options":["It makes the prompt shorter","Starting the response anchors the AI into your format from the very first token","It prevents hallucinations","It speeds up generation"],"correct":1,"explanation":"When you begin the AI\u2019s response (e.g., \u20181. **\u2019), the model continues in that format rather than inventing its own structure."},{"q":"How do you fix the \u2018helpful preamble\u2019 problem where AI adds \u2018Here is the JSON:\u2019 before your data?","options":["Ask for shorter output","Add \u2018Return ONLY the JSON. No preamble. No explanation.\u2019 to your prompt","Use a different model","Put the schema at the end of the prompt"],"correct":1,"explanation":"Explicitly telling the AI what NOT to include is as important as telling it what to include. \u2018Return ONLY\u2019 directives suppress unwanted framing text."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/04-few-shot-and-examples/" class="prev">&larr; Previous: Few-Shot &amp; Examples</a>
  <a href="/academy/advanced-prompt-engineering/06-prompt-chaining/" class="next">Next: Prompt Chaining &rarr;</a>
</nav>

</div>
