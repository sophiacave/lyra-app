# Documents & Data

**Course:** Claude for Beginners
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/claude-for-beginners/)
  Lesson 5 of 9


  # Documents & Data.

  Turn 30-page reports into 30-second summaries. Analyze spreadsheets without a single formula. This is where Claude becomes your superpower.


  ### After this lesson you'll be able to


    - Summarize any document in seconds using 4 different styles

    - Analyze data without Excel formulas or pivot tables

    - Turn rough notes into polished, professional reports

    - Work with uploaded files effectively (PDFs, images, spreadsheets)




  Hands-On
  ## Summarize anything in seconds.

  You have a 20-page report and 5 minutes before a meeting. Instead of skimming and praying, **paste the document into Claude and ask for exactly the summary you need.** The secret: different situations need different summary styles.


### 4 Summary Styles

**Card 1:**
Front: 📋 Executive Summary  For your boss, board, or anyone who wants the big picture in 30 seconds.
Back: PROMPT: Summarize this report as a 3-paragraph executive summary. Lead with the bottom line, then key findings, then what needs attention.  Best for: Leadership updates, board decks, stakeholder emails. Claude prioritizes outcomes and decisions over details.

**Card 2:**
Front: 🔹 Bullet Points  For quick scanning. Hit the highlights, skip the filler.
Back: PROMPT: Summarize this into 5-7 bullet points. Focus on what changed, what matters, and what is at risk.  Best for: Slack updates, meeting prep, personal notes. Claude compresses even the densest reports into scannable bullets.

**Card 3:**
Front: ✅ Action Items Only  For when you need to know what to DO, not what happened.
Back: PROMPT: Extract all action items, decisions, and next steps from this document. Format as a checklist with owners and deadlines where mentioned.  Best for: Post-meeting notes, project plans, policy documents. Skips all background — gives you the to-do list.

**Card 4:**
Front: 🧒 ELI5 (Explain Like I Am 5)  For when the document is in a domain you do not know well.
Back: PROMPT: Explain what this document says in plain English, like I have never seen this topic before. Use everyday analogies. No jargon.  Best for: Legal contracts, technical specs, medical reports, financial statements. Claude translates expert language into human language.


  Here are all four as ready-to-paste prompts — bookmark these:


Prompt — Executive Summary

```
Summarize this as a 3-paragraph executive summary.
Lead with the bottom line, then key findings, then
what needs attention. Audience: [CEO / board / VP].

[Paste document here]
```


Prompt — Action Items Extractor

```
Extract all action items, decisions, and next steps
from this document. Format as a checklist with owners
and deadlines where mentioned.

[Paste document here]
```


Prompt — Data Analyst

```
Here is my data:

[Paste spreadsheet data, CSV, or numbers here]

What are the key trends? What should I worry about?
Give me your top 3 recommendations ranked by impact.
```


  Superpower
  ## Analyze data without a single formula.

  You don't need to know VLOOKUP, pivot tables, or Python. **Paste your data into Claude and ask questions in plain English.** Claude finds the story in your numbers.


### Data Analysis in Action

**Card 1:**
Front: 📊 Find Trends  Paste monthly sales data and ask: What is the story here?  Claude identifies which products are growing, which are declining, and predicts crossover points.
Back: PROMPT: Here are our monthly sales by product: [paste data]. What is the story? Which products are trending up or down? Are there any patterns I should worry about? Give me your recommendation.  Claude acts like a free data analyst — finds trends, spots risks, and gives actionable recommendations.

**Card 2:**
Front: 🔍 Compare Periods  Paste this quarter vs last quarter and ask: What changed and why?  Claude highlights the meaningful changes and filters out noise.
Back: PROMPT: Here is our Q2 data and our Q3 data: [paste both]. What are the biggest changes? What improved, what declined, and what stayed flat? Which changes need attention?  Claude produces a clear comparison without you building a single spreadsheet.

**Card 3:**
Front: 🎯 Get Recommendations  Paste any dataset and ask: What should I do about this?  Claude does not just describe — it prescribes.
Back: PROMPT: Based on this data [paste data], what are the top 3 things I should do next? Prioritize by impact. Be specific and actionable.  Claude goes beyond analysis to give you a concrete action plan. This is where most tools stop but Claude keeps going.


  Transform
  ## Turn rough notes into polished reports.

  Your meeting notes are chaos. Bullet fragments, half-sentences, random thoughts. Claude transforms them into professional documents in seconds. The trick is telling Claude the audience and format.


### Notes to Reports

**Card 1:**
Front: 📝 Before: Raw Meeting Notes  - talked about budget, marcus wants cuts - priya has good ROI numbers from last q - mobile app feedback mixed, 23% negative - need to decide on vendor by friday - self-service portal working great, 41% fewer tickets
Back: PROMPT: Turn these rough meeting notes into a professional meeting summary. Include: key discussion points, decisions made, action items with owners, and next steps. Format for email distribution to the leadership team.  Claude transforms 5 messy bullets into a structured summary with headers, action items table, and clear next steps. Your colleagues think you are the most organized person in the room.


  Files
  ## Working with uploaded files.

  Claude can read PDFs, images, spreadsheets, and more. But there are limits. Know what works and what needs a different approach.





        📄

          PDFs & Word Docs
          Upload directly. Claude reads the full document — text, tables, headers. Best support.



        🖼️

          Images & Screenshots
          Upload photos, charts, whiteboard shots. Claude reads text in images and describes visual content.



        📊

          Spreadsheets & CSV
          Upload CSV files or paste data directly. For Excel files, save as CSV first for best results.



        💻

          Code Files & Text
          Upload or paste any plain text, code, or config file. Claude understands structure and syntax.






    The Chunk Strategy
    For documents too large for a single prompt: break them into logical sections (by chapter, topic, or page range). Analyze each chunk separately, then ask Claude to **synthesize findings across all chunks** in a final pass. You get deeper analysis per section AND a unified view.



  Deep Dive
  ## Real-world document analysis — see how it works.

  Different types of documents need different approaches. Here is how to handle the most common ones you will encounter at work.


### Document Analysis by Type

**Card 1:**
Front: Legal Contracts  You received a vendor contract. You need to understand the key terms before signing.
Back: PROMPT: I just received this vendor contract. I am not a lawyer. Please:  1. Summarize the key terms in plain English 2. Flag anything unusual or risky 3. Highlight the payment terms and penalties 4. List any deadlines or auto-renewal clauses 5. Tell me what questions I should ask before signing  Claude translates legalese into language you can actually understand, and flags the things a lawyer would flag.

**Card 2:**
Front: Financial Reports  Quarterly earnings, budget reports, or financial statements you need to understand quickly.
Back: PROMPT: Here is our Q3 financial report: [paste]. Explain it to me as if I am not a finance person. What are the 3 most important numbers? What changed from last quarter? Should I be worried about anything?  Claude finds the story in the numbers — revenue trends, cost increases, cash flow concerns — without requiring you to know accounting terminology.

**Card 3:**
Front: Technical Documentation  API docs, software specs, or technical proposals that need to be understood by non-technical stakeholders.
Back: PROMPT: Here is a technical specification document: [paste]. I need to present the key points to our executive team who are not technical. Translate this into business language. Focus on: what it does, why it matters, what it costs, and what the timeline looks like.  Claude bridges the gap between technical and business language, keeping the important details while cutting the jargon.

**Card 4:**
Front: Research Papers / Studies  Academic papers, market research, or industry reports filled with methodology and statistics.
Back: PROMPT: Here is a research paper: [paste]. Give me: 1. The main finding in one sentence 2. Why it matters for [your industry/role] 3. How strong the evidence is (sample size, methodology) 4. The 2-3 most important takeaways 5. Any limitations or caveats I should know about  Claude reads the methodology section so you do not have to, and tells you how much to trust the conclusions.


  Extract
  ## Data extraction patterns — pull exactly what you need.

  Sometimes you do not need a summary. You need specific information pulled out of a document. Here are the extraction patterns that save the most time.


Pattern — Extract All Names and Roles

```
From this document, extract every person mentioned.
For each person, list:
- Full name
- Title or role
- What they are responsible for
- Any action items assigned to them

Format as a table.

[Paste document here]
```


Pattern — Extract All Dates and Deadlines

```
From this document, extract every date, deadline,
and timeline mentioned. For each, list:
- The date
- What it refers to
- Who is responsible (if mentioned)
- Whether it is a hard deadline or estimate

Sort chronologically.

[Paste document here]
```


Pattern — Extract Numbers and Metrics

```
From this document, extract every number, metric,
percentage, and dollar amount mentioned. For each:
- The number
- What it measures
- The time period (if mentioned)
- Whether it is up, down, or flat vs prior period

Format as a table sorted by importance.

[Paste document here]
```



    When to Extract vs Summarize
    **Extract** when you need specific data points pulled out of a document — names, dates, numbers, action items. **Summarize** when you need to understand the big picture — key themes, decisions, overall direction. For many documents, doing both gives you the complete picture: the summary tells you what happened, and the extraction gives you the details you need to act on.



  **The key insight:** Claude turns you into someone who can summarize, analyze, and report on *anything* — regardless of your background. A marketer can analyze financial data. A manager can parse legal contracts. The barrier between "I can" and "I can't" just disappeared.


  Quick Check
  ## Lock it in.


### Quiz

**Q1: You need to send your CEO a quick summary of a 40-page report. Which summary style?**
    A. ELI5
  ✓ B. Executive Summary
    C. Bullet Points
    D. Action Items Only
  *Executive Summary is built for leadership. It leads with the bottom line, highlights key findings, and flags what needs attention — exactly what a CEO wants in 30 seconds.*

**Q2: What is the chunk strategy for long documents?**
    A. Delete the parts you do not need
  ✓ B. Break the document into sections, analyze each separately, then synthesize
    C. Make the font smaller
    D. Use a different AI tool
  *The chunk strategy gives Claude focused context per section for deeper analysis, then synthesizes across all chunks for a unified view. Best approach for very large documents.*

**Q3: Claude says something wrong in a data analysis. What should you do?**
    A. Trust it — AI is always right
  ✓ B. Point out the error and ask Claude to re-examine
    C. Start completely over
    D. Give up on AI for data
  *Claude responds well to corrections. Point out the specific error and it will re-examine with fresh eyes. This iterative process often produces better results than starting over.*
