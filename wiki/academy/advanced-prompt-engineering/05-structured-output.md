# Structured Output

**Course:** Advanced Prompt Engineering
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[Advanced Prompt Engineering](/academy/advanced-prompt-engineering/)
  Lesson 5 of 10


  # Structured Output

  Get JSON, tables, CSV, and precise formats — every time.


  ### What You'll Learn


    - How to get consistent, machine-readable output from AI

    - JSON, Markdown tables, CSV, and custom formats

    - Schema-driven prompting for reliable data extraction

    - Handling edge cases and validation




  Why It Matters
  ## AI Output You Can Actually Use in Code

  Free-form text is great for reading. It's terrible for automation. If you're building workflows, feeding AI output into other tools, or processing data — you need structured output that's consistent and parseable.
  The good news: AI is excellent at producing structured data. You just have to ask correctly.


  Technique 1
  ## JSON Output with Schema

  The most reliable way to get JSON: show the exact schema you want, with descriptions for each field.



      Schema-Driven Prompt
      `Extract product information from the following review and return it as JSON matching this exact schema:

{
  "product_name": "string — the product being reviewed",
  "rating": "number — 1 to 5, inferred from sentiment if not explicit",
  "pros": ["string — list of positive points mentioned"],
  "cons": ["string — list of negative points mentioned"],
  "would_recommend": "boolean — true if reviewer recommends it",
  "summary": "string — one-sentence summary of the review"
}

Return ONLY the JSON object. No explanation. No markdown code fences.`




  Technique 2
  ## Tables and Comparison Formats




      Markdown Table Prompt
      `Compare these three databases in a Markdown table with these exact columns:
| Feature | PostgreSQL | MongoDB | Redis |
Include rows for: Data Model, Scalability, Best Use Case, Learning Curve, Cost (self-hosted).
Keep each cell to 10 words or fewer.`



  The key: specify columns, rows, and cell constraints. Without constraints, cells become paragraphs and the table becomes unreadable.


  Technique 3
  ## The "Output First" Trick

  Start the AI's response for it. This anchors the format immediately.



      Anchored Output
      `List the top 5 risks in this business plan as a numbered list. Each item should have a risk name in bold, followed by a one-sentence explanation and a severity tag [HIGH/MEDIUM/LOW].

Start your response with:
1. **`
      Starting the output forces the AI into your format from the first token.




  [Interactive: FlashDeck]


  Common Pitfalls
  ## When Structured Output Breaks

  **The "helpful" preamble:** AI loves to add "Here's the JSON:" before your data. Fix: "Return ONLY the JSON. No preamble. No explanation."
  **Inconsistent keys:** Sometimes the AI renames fields. Fix: provide the exact schema and say "use these exact key names."
  **Mixed types:** A field that should be a number comes back as a string. Fix: specify types in your schema description.


  Technique 4
  ## CSV and Spreadsheet-Ready Output

  Sometimes you need data that goes straight into a spreadsheet. CSV output is cleaner than tables for this purpose.



      CSV Prompt
      `"Extract all mentions of companies from this article. Return as CSV with these exact columns:

company_name,industry,mention_context,sentiment
(string),(string),(brief quote from text),(positive/negative/neutral)

Return ONLY the CSV data with the header row. No explanations. No markdown code fences. Use double quotes around fields that contain commas."`



  The double-quote instruction is crucial — without it, commas inside fields break the CSV structure. These small details are what separate usable output from output that needs manual cleanup.


  Technique 5
  ## Nested JSON for Complex Data

  Real-world data is rarely flat. When you need nested structures, your schema must show the nesting explicitly.



      Nested Schema Prompt
      `"Analyze this meeting transcript and extract structured data:

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

If a field has no data in the transcript, use an empty array [] or 'not mentioned'. Never omit a field."`



  The last instruction — "never omit a field" — is essential. Without it, the AI drops empty fields, which breaks any code expecting a consistent schema. Always specify default behavior for missing data.


  Validation
  ## Building Validation Into Your Prompts

  You can ask the AI to validate its own structured output before returning it. This catches common errors at the source.



      Self-Validating Prompt
      `"After generating the JSON, validate it against these rules before returning:
1. All date fields match YYYY-MM-DD format
2. No field values are null — use empty string, empty array, or 'not specified'
3. The 'rating' field is a number between 1 and 5 (not a string)
4. All arrays have at least one element, or are empty []
5. The JSON is valid — no trailing commas, no missing brackets

If any rule is violated, fix it before returning. Return only the corrected JSON."`



  This technique reduces post-processing errors dramatically. The AI catches its own mistakes before you ever see them — saving you debugging time downstream.


  Try It Yourself
  ## Extract Structured Data


    Find a product review, article, or email. Write a prompt that extracts the key information into a JSON object with at least 5 fields. Make sure you get clean, parseable output.

      `Extract the following from this text and return as JSON:
{
  "field_1": "type — description",
  "field_2": "type — description"
}
Return ONLY valid JSON. No markdown. No explanation.`





### Quiz

**Q1: What is the most reliable way to get consistent JSON from an AI?**
    A. Ask nicely for JSON
  ✓ B. Provide the exact schema with field descriptions and types
    C. Ask for JSON at the end of the prompt
    D. Use bullet points instead
  *Schema-driven prompting — showing the exact structure with type descriptions for each field — gives the AI a precise blueprint to follow, dramatically improving consistency.*

**Q2: Why does the ‘Output First’ trick work?**
    A. It makes the prompt shorter
  ✓ B. Starting the response anchors the AI into your format from the very first token
    C. It prevents hallucinations
    D. It speeds up generation
  *When you begin the AI’s response (e.g., ‘1. **’), the model continues in that format rather than inventing its own structure.*

**Q3: How do you fix the ‘helpful preamble’ problem where AI adds ‘Here is the JSON:’ before your data?**
    A. Ask for shorter output
  ✓ B. Add ‘Return ONLY the JSON. No preamble. No explanation.’ to your prompt
    C. Use a different model
    D. Put the schema at the end of the prompt
  *Explicitly telling the AI what NOT to include is as important as telling it what to include. ‘Return ONLY’ directives suppress unwanted framing text.*


  [← Previous: Few-Shot & Examples](/academy/advanced-prompt-engineering/04-few-shot-and-examples/)
  [Next: Prompt Chaining →](/academy/advanced-prompt-engineering/06-prompt-chaining/)
