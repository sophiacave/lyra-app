# Asking the Right Questions

**Course:** AI for Data Analysis
**Order:** 2
**Type:** lesson
**Access:** Free

---
[← AI for Data Analysis](/academy/ai-for-data-analysis/)
  Lesson 2 of 10


  # Asking the Right Questions

  Framing data questions so AI gives you real answers


  ### What You'll Learn


    - Why vague questions produce vague answers

    - The SCOPE framework for data questions

    - How to chain questions for deeper insight

    - Common question mistakes and how to fix them




  The Problem
  ## Garbage In, Garbage Out

  The number one reason people get disappointing results from AI data analysis? Their questions are too vague. "Analyze this data" is like telling a chef "make food." You'll get something, but it probably won't be what you wanted.
  AI is incredibly capable, but it needs direction. The more specific your question, the more specific — and useful — the answer.


  Mindset
  ## Data-Driven Thinking

  Before frameworks and techniques, you need the right mindset. Data-driven thinking means starting with a question — not starting with data. The difference matters more than you think.
  **Data-first approach (weak):** "I have a spreadsheet. Let me see what's in it." This leads to aimless exploration and generic summaries that rarely drive action.
  **Question-first approach (strong):** "I need to understand why customer retention dropped last quarter. Let me pull the data that can answer that." This leads to focused analysis with clear outcomes.
  Train yourself to start every analysis with a hypothesis — an educated guess about what you expect to find. Hypotheses sharpen your thinking and make AI analysis dramatically more productive.
  **Example hypothesis:** "I think our churn spike is caused by customers on monthly plans who signed up during our holiday promotion — they got a discount, never experienced full value, and left when the discount expired."
  With that hypothesis, you know exactly what data to pull, what segments to examine, and what a confirming or disconfirming result looks like. You have turned a vague worry into a testable claim.


  Framework
  ## The SCOPE Method

  Use SCOPE to frame every data question you ask AI:
  **S — Specific:** What exactly do you want to know? Not "how are sales" but "which product category grew fastest in Q3."
  **C — Context:** What does AI need to know about this data? Industry, time period, what the columns mean.
  **O — Output:** What format do you want? A summary, a table, a list of recommendations, a comparison?
  **P — Perspective:** Who is this analysis for? Your boss, your team, yourself? This shapes the depth and language.
  **E — Edge cases:** Are there things AI should watch for? Outliers to ignore? Special circumstances?


  Before & After
  ## Transforming Weak Questions



    **Weak:** "What do you see in this data?"
    Too open-ended. AI will give you a generic summary.



    **Strong:** "This is 6 months of email campaign data. Compare open rates across the 4 campaign types. Which type consistently outperforms? Are there any months where the pattern breaks, and why might that be?"
    Specific, contextual, asks for comparison AND explanation.



  Power Move
  ## Question Chaining

  The best analysts don't ask one question — they chain them. Start broad, then drill down based on what you find.
  **Round 1:** "Summarize the key trends in this customer data."
  **Round 2:** "You mentioned churn spikes in March. Break down the March churners by plan type and tenure."
  **Round 3:** "For the monthly-plan customers who churned in March, what was their average usage in the 30 days before cancellation?"
  Each question builds on the last. By round 3, you've found something genuinely actionable.


  Common Mistakes
  ## Question Anti-Patterns

  Recognizing bad question patterns is just as important as knowing good ones. Here are the most common mistakes and their fixes:


    **Anti-pattern 1: The Data Dump**
    "Here's my data. What do you think?"
    Fix: State what you need to decide. "I need to decide whether to increase ad spend on Instagram. Here's my channel performance data for the last 6 months."



    **Anti-pattern 2: The Leading Question**
    "This data shows that our product is clearly the best, right?"
    Fix: Ask neutrally. "Compare our product metrics against these competitor benchmarks. Where do we lead, and where do we lag?"



    **Anti-pattern 3: The Everything Question**
    "Analyze this data for all possible trends, patterns, correlations, outliers, segments, forecasts, and recommendations."
    Fix: Prioritize. "Start with the top 3 revenue trends. Then identify the biggest risk. Then give me one recommended action."



    **Anti-pattern 4: The Missing Context**
    "Why did revenue drop?" (with no data attached)
    Fix: Provide the data and context. "Revenue dropped 15% in March. Here's our monthly revenue data plus marketing spend. Was the drop correlated with the campaign pause in late February?"


  The underlying principle: every question should contain enough context for AI to give a specific, useful answer — and should be focused enough that the answer fits in your head.


  Hypothesis Formation
  ## From Questions to Testable Claims

  The strongest data analysis starts not just with a question but with a hypothesis — a specific, testable prediction about what the data will show. Here is how to form good hypotheses:
  **Step 1 — Observe:** Notice something. "Our email open rates seem lower lately."
  **Step 2 — Hypothesize:** Form a testable claim. "Open rates dropped because we increased send frequency from 2x/week to 4x/week, causing subscriber fatigue."
  **Step 3 — Test:** Ask AI to check it. "Compare open rates before and after we changed to 4x/week. Also compare open rates for subscribers who receive all 4 emails vs. those who only receive 2."
  **Step 4 — Refine:** If the hypothesis is wrong, form a new one based on what you learned. "Open rates dropped for all frequencies — so it's not fatigue. Maybe it's the subject line style we changed in the same period."
  This cycle — observe, hypothesize, test, refine — is the scientific method applied to data. AI makes each cycle take minutes instead of days, so you can iterate rapidly toward truth.


  Advanced
  ## Question Frameworks by Analysis Type

  Different types of analysis require different question structures. Here are frameworks matched to the four analysis types:


    **Descriptive questions:**
    *"Summarize [metric] by [dimension] for [time period]. Include totals, averages, and the range (min/max)."*
    Example: "Summarize revenue by product category for Q3 2024. Include total, average, and the highest/lowest performing categories."



    **Diagnostic questions:**
    *"[Metric] changed by [amount] during [period]. Compare [dimensions] before and after the change. What factors correlate with this shift?"*
    Example: "Churn increased 40% in March. Compare churners vs. retained customers by plan type, tenure, and usage. What factors correlate with the increase?"



    **Predictive questions:**
    *"Based on [time period] of historical data, project [metric] for the next [period]. Provide conservative, moderate, and optimistic scenarios with assumptions."*
    Example: "Based on 12 months of sales data, project revenue for Q1 2025 across three scenarios. State your assumptions for each."



    **Prescriptive questions:**
    *"Given [data and context], what specific actions would you recommend to [goal]? Rank by expected impact and ease of implementation."*
    Example: "Given our customer acquisition data, what specific actions would you recommend to reduce CAC by 20%? Rank by expected impact."


  Keep these frameworks handy. Copy the one that matches your analysis type, fill in the brackets with your specific context, and paste it alongside your data. The framework ensures your question has the right structure; your domain knowledge ensures it asks the right thing.
  Over time, you will develop your own question templates — variations of these frameworks tuned to your specific data and business context. Save every question that produces a great answer. Your personal question library becomes one of your most valuable analytical assets.


  Practical
  ## Building a Question Sequence

  The best analyses follow a deliberate question sequence. Here is a template you can use for any dataset:
  **Question 1 (Orientation):** "Describe this dataset — shape, columns, data types, date range, and any obvious quality issues."
  **Question 2 (Overview):** "Summarize the key metrics. What are the totals, averages, and distributions?"
  **Question 3 (Trends):** "What are the most significant trends over time? Are things getting better or worse?"
  **Question 4 (Segments):** "Break down the key metric by [relevant dimension]. Which segments are strongest and weakest?"
  **Question 5 (Anomalies):** "Flag anything unusual — outliers, sudden changes, or data points that break the pattern."
  **Question 6 (Action):** "Based on everything you've found, what are the top 3 actions I should take and why?"
  This six-question sequence takes you from raw data to actionable insight in a structured way. Each question builds on the answers before it, creating a comprehensive analysis through conversation.


  ### Try It Yourself

  Take the same dataset from Lesson 1. This time, use the SCOPE method to write three increasingly specific questions. Feed them to Claude one at a time and watch how the insights deepen.
  `I have [describe data, time period, what columns mean]. I need to understand [specific question]. Please present the answer as [format] and flag any unusual patterns. This is for [audience].`


  Quick Review
  ## The SCOPE Framework


### SCOPE Method Flashcards

**Card 1:**
Front: S in SCOPE
Back: Specific — define exactly what you want to know, not vague questions like how are sales

**Card 2:**
Front: C in SCOPE
Back: Context — provide relevant background: industry, time period, what the columns mean

**Card 3:**
Front: O in SCOPE
Back: Output — specify the format you want: summary, table, list of recommendations

**Card 4:**
Front: P in SCOPE
Back: Perspective — state who the analysis is for, which shapes depth and language

**Card 5:**
Front: E in SCOPE
Back: Edge cases — flag outliers to ignore, special circumstances, or anything AI should watch for


  Practice
  ## Match the Question Quality


  Check Your Understanding
  ## Lesson 2 Quiz


### Quiz

**Q1: What is the main problem with vague data questions like "Analyze this data"?**
    A. AI refuses to process them
    B. They take too long to generate
  ✓ C. They produce generic, unhelpful summaries
    D. They require more tokens
  *Vague questions are like telling a chef to make food — you get something, but probably not what you wanted. Specific questions drive specific answers.*

**Q2: Which is the strongest version of a data question?**
    A. What do you see in this data?
    B. Analyze my sales
  ✓ C. Which product category grew fastest in Q3, and which months had exceptions?
    D. Tell me about trends
  *This question is specific (Q3, product category), asks for comparison AND explanation of exceptions — hitting multiple SCOPE elements at once.*

**Q3: What does question chaining accomplish in data analysis?**
    A. It confuses the AI
  ✓ B. Each question builds on the last to reach actionable insight
    C. It reduces the quality of analysis
    D. It only works with CSV files
  *Chaining lets you start broad and drill down progressively — by round 3, you have found something genuinely actionable that a single question would have missed.*


  [← Previous: Data Analysis Meets AI](/academy/ai-for-data-analysis/01-data-analysis-meets-ai/)
  [Next: Spreadsheet Analysis →](/academy/ai-for-data-analysis/03-spreadsheet-analysis/)
