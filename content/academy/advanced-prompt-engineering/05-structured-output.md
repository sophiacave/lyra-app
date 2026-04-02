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
  <div data-learn="FlashDeck" data-props='{"title":"Structured Output — Key Concepts","cards":[{"front":"What is schema-driven prompting?","back":"Providing the exact JSON structure with field names, types, and descriptions — giving the AI a precise blueprint so output is consistent and parseable every time."},{"front":"What is the Output First trick?","back":"Starting the AI\\\'s response for it (e.g., beginning with '1. **') to anchor the format from the very first token, preventing the model from inventing its own structure."},{"front":"How do you prevent the 'helpful preamble' problem?","back":"Add 'Return ONLY the JSON. No preamble. No explanation.' — explicitly telling the AI what NOT to include is as important as telling it what to include."},{"front":"Why do you need cell constraints in table prompts?","back":"Without constraints like '10 words or fewer per cell,' AI turns table cells into paragraphs, making the table unreadable and defeating the purpose of structured format."},{"front":"How do you fix inconsistent JSON keys?","back":"Provide the exact schema and explicitly say 'use these exact key names' — plus specify types in your schema description to prevent numbers returning as strings."}]}'></div>
</div>

<div class="lesson-section">
</div>

<div class="lesson-section">
  <span class="section-label">Common Pitfalls</span>
  <h2 class="section-title">When Structured Output Breaks</h2>
  <p class="section-text"><strong style="color: var(--red);">The "helpful" preamble:</strong> AI loves to add "Here's the JSON:" before your data. Fix: "Return ONLY the JSON. No preamble. No explanation."</p>
  <p class="section-text"><strong style="color: var(--red);">Inconsistent keys:</strong> Sometimes the AI renames fields. Fix: provide the exact schema and say "use these exact key names."</p>
  <p class="section-text"><strong style="color: var(--red);">Mixed types:</strong> A field that should be a number comes back as a string. Fix: specify types in your schema description.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Technique 4</span>
  <h2 class="section-title">CSV and Spreadsheet-Ready Output</h2>
  <p class="section-text">Sometimes you need data that goes straight into a spreadsheet. CSV output is cleaner than tables for this purpose.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">CSV Prompt</h4>
      <code>"Extract all mentions of companies from this article. Return as CSV with these exact columns:

company_name,industry,mention_context,sentiment
(string),(string),(brief quote from text),(positive/negative/neutral)

Return ONLY the CSV data with the header row. No explanations. No markdown code fences. Use double quotes around fields that contain commas."</code>
    </div>
  </div>

  <p class="section-text">The double-quote instruction is crucial — without it, commas inside fields break the CSV structure. These small details are what separate usable output from output that needs manual cleanup.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Technique 5</span>
  <h2 class="section-title">Nested JSON for Complex Data</h2>
  <p class="section-text">Real-world data is rarely flat. When you need nested structures, your schema must show the nesting explicitly.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Nested Schema Prompt</h4>
      <code>"Analyze this meeting transcript and extract structured data:

{
  "meeting_date": "string — YYYY-MM-DD format",
  "attendees": ["string — full names only"],
  "agenda_items": [
    {
      "topic": "string — the agenda item discussed",
      "decisions": ["string — each decision made"],
      "action_items": [
        {
          "task": "string — what needs to be done",
          "owner": "string — who is responsible",
          "deadline": "string — YYYY-MM-DD or 'not specified'"
        }
      ],
      "open_questions": ["string — unresolved items"]
    }
  ],
  "next_meeting": "string — YYYY-MM-DD or 'not scheduled'"
}

If a field has no data in the transcript, use an empty array [] or 'not mentioned'. Never omit a field."</code>
    </div>
  </div>

  <p class="section-text">The last instruction — "never omit a field" — is essential. Without it, the AI drops empty fields, which breaks any code expecting a consistent schema. Always specify default behavior for missing data.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Validation</span>
  <h2 class="section-title">Building Validation Into Your Prompts</h2>
  <p class="section-text">You can ask the AI to validate its own structured output before returning it. This catches common errors at the source.</p>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">Self-Validating Prompt</h4>
      <code>"After generating the JSON, validate it against these rules before returning:
1. All date fields match YYYY-MM-DD format
2. No field values are null — use empty string, empty array, or 'not specified'
3. The 'rating' field is a number between 1 and 5 (not a string)
4. All arrays have at least one element, or are empty []
5. The JSON is valid — no trailing commas, no missing brackets

If any rule is violated, fix it before returning. Return only the corrected JSON."</code>
    </div>
  </div>

  <p class="section-text">This technique reduces post-processing errors dramatically. The AI catches its own mistakes before you ever see them — saving you debugging time downstream.</p>
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
  <div data-learn="QuizMC" data-props='{"title":"Structured Output Quiz","questions":[{"q":"What is the most reliable way to get consistent JSON from an AI?","options":["Ask nicely for JSON","Provide the exact schema with field descriptions and types","Ask for JSON at the end of the prompt","Use bullet points instead"],"correct":1,"explanation":"Schema-driven prompting — showing the exact structure with type descriptions for each field — gives the AI a precise blueprint to follow, dramatically improving consistency."},{"q":"Why does the ‘Output First’ trick work?","options":["It makes the prompt shorter","Starting the response anchors the AI into your format from the very first token","It prevents hallucinations","It speeds up generation"],"correct":1,"explanation":"When you begin the AI’s response (e.g., ‘1. **’), the model continues in that format rather than inventing its own structure."},{"q":"How do you fix the ‘helpful preamble’ problem where AI adds ‘Here is the JSON:’ before your data?","options":["Ask for shorter output","Add ‘Return ONLY the JSON. No preamble. No explanation.’ to your prompt","Use a different model","Put the schema at the end of the prompt"],"correct":1,"explanation":"Explicitly telling the AI what NOT to include is as important as telling it what to include. ‘Return ONLY’ directives suppress unwanted framing text."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/advanced-prompt-engineering/04-few-shot-and-examples/" class="prev">&larr; Previous: Few-Shot &amp; Examples</a>
  <a href="/academy/advanced-prompt-engineering/06-prompt-chaining/" class="next">Next: Prompt Chaining &rarr;</a>
</nav>

</div>
