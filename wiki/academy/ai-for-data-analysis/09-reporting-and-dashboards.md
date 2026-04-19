# Reporting and Dashboards

**Course:** AI for Data Analysis
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[← AI for Data Analysis](/academy/ai-for-data-analysis/)
  Lesson 9 of 10


  # Reporting and Dashboards

  Building reports and summaries people actually read


  ### What You'll Learn


    - How to turn analysis into polished reports with AI

    - Designing dashboards that answer questions at a glance

    - Automating recurring reports

    - Writing executive summaries that drive decisions




  The Problem
  ## Great Analysis, Terrible Reports

  You can do the best data analysis in the world, but if your report is a wall of text or a chaotic spreadsheet, nobody will act on it. The gap between analysis and action is almost always a communication problem.
  AI bridges that gap. It can take raw analysis and reshape it into a format designed for your specific audience — whether that's a CEO who wants three bullet points or a team that needs the full breakdown.


  Report Structure
  ## The Three-Layer Report

  Every good report has three layers. Ask AI to build yours this way:
  **Layer 1 — Executive summary (3-5 sentences):** The headline findings. What changed, what matters, what to do about it. A busy person reads only this and still gets the point.
  **Layer 2 — Key metrics and visuals:** The supporting data. Charts, tables, comparisons. This is where the evidence lives.
  **Layer 3 — Detailed analysis:** The deep dive for people who want to understand methodology, caveats, and nuance.
  Most reports fail because they start at Layer 3. Start at Layer 1. Always.


  Design Principles
  ## Dashboard Design Principles

  A dashboard is not a collection of charts thrown onto a page. It is an information system designed to answer specific questions at a glance. These principles separate useful dashboards from decorative ones:
  **The 5-second rule:** A viewer should understand the most important metric within 5 seconds of looking at the dashboard. If they have to search, the hierarchy is wrong. Put the single most critical number — your "north star" metric — at the top left, large and unmistakable.
  **Context over numbers:** A number without context is meaningless. "$50,000 revenue" means nothing. "$50,000 revenue (up 12% vs. last month, 8% above target)" means everything. Every metric needs comparison context: vs. last period, vs. target, vs. average.
  **Progressive disclosure:** Like the three-layer report, dashboards should reveal detail progressively. Top row: KPI cards with headline numbers. Middle: trend charts showing movement over time. Bottom: detailed tables for people who want to drill in. Not everyone needs every layer.
  **Limit to 6-8 metrics:** A dashboard that tries to show everything shows nothing. Choose the 6-8 metrics that drive decisions and leave the rest for detailed reports. Ask AI: "Given my business type, what are the 6 most important metrics for a weekly dashboard?"
  **Consistent visual language:** Green always means good. Red always means bad. Up arrows always mean increase. Once you establish a visual language, never violate it — the viewer's brain learns to process the dashboard faster over time.
  **Action-oriented design:** Every section of the dashboard should answer a question that could lead to an action. "Are we on track this month?" drives resource allocation. "Which channel converts best?" drives marketing spend. If a metric does not drive any possible action, remove it.


  Best Practices
  ## Visualization Best Practices for Reports

  When AI generates visualizations for your reports, guide it with these best practices:
  **One insight per chart:** A chart that tries to show three things shows none of them clearly. Break complex visualizations into multiple focused charts, each with a clear insight-based title.
  **Annotate key events:** If revenue spiked in March, add an annotation on the chart: "Product launch March 15." This turns a data visualization into a narrative that anyone can follow without reading supplementary text.
  **Use sparklines for density:** When you need to show many trends in a small space — like performance across 20 product lines — use sparklines (tiny inline charts) rather than full-size charts. AI can generate these for you.
  **Tables for precision, charts for trends:** If someone needs to look up the exact number for Region X in Month Y, give them a table. If they need to see the trajectory of all regions over time, give them a chart. Use both, not one or the other.
  **Color-code status:** In tables and KPI cards, use background color to indicate status at a glance. Green for on-track, yellow for at-risk, red for below target. The viewer grasps the situation without reading a single number.


  Dashboard Design
  ## Dashboards That Actually Work



    **Ask AI to design your dashboard layout:**
    *"I need a monthly dashboard for my online store. My key metrics are: revenue, orders, average order value, top products, and customer acquisition source. Design a dashboard layout — tell me which metrics should be KPI cards at the top, which need charts, and which work best as tables. Also suggest what comparison data to show (vs. last month, vs. same month last year)."*
    AI thinks about hierarchy, comparison context, and visual weight — the same things a professional dashboard designer considers.



  Automation
  ## Recurring Reports on Autopilot

  If you run the same report weekly or monthly, AI can help you build a template once and reuse it:
  **Step 1:** Create the first report with AI, refining it until it's exactly right.
  **Step 2:** Ask AI to turn the process into a reusable prompt template with placeholders for new data.
  **Step 3:** Each reporting period, paste new data into the template. Same quality report, fraction of the time.
  The first report takes effort. Every subsequent one takes five minutes.


  Executive Summaries
  ## Writing for Decision-Makers

  Decision-makers don't want information. They want implications. Instead of "revenue was $50,000," say "revenue hit $50,000, exceeding target by 12%, driven primarily by the new product launch."
  Ask AI: **"Rewrite this analysis as an executive summary. Lead with the most important finding. Include specific numbers. End with a recommended action."**


  Advanced
  ## Report Types for Different Audiences

  One size does not fit all in reporting. Different audiences need fundamentally different reports. Ask AI to reshape the same analysis for each:
  **Board/investor reports:** High-level KPIs, trend direction, strategic implications. Maximum 1 page. Focus on growth, risk, and opportunity. No operational detail.
  **Management reports:** Key metrics with month-over-month comparison, budget variance, and 3-5 action items. Include enough context for decision-making but not enough to overwhelm.
  **Team reports:** Operational metrics, individual and team performance, progress against goals. More detail, more granularity, more actionable items specific to the team's work.
  **Self-analysis reports:** Your personal analysis log. Every finding, every methodology note, every rabbit hole explored. This is your research notebook — messy is fine because the audience is you.
  The same underlying data and analysis can produce all four report types. Ask AI: "Reformat this analysis as a [type] report for [audience]. Adjust depth, language, and focus accordingly."


  Tools
  ## Free Dashboard Tools

  You do not need expensive software to build dashboards. These free tools work with AI-generated analysis:
  **Google Sheets + Charts:** Built-in charting handles most dashboard needs. Ask AI to generate Google Sheets formulas and chart configurations you can implement directly.
  **Google Looker Studio (formerly Data Studio):** Free, connects to Google Sheets and many other data sources. AI can design your dashboard layout and tell you exactly how to build it in Looker Studio.
  **Notion dashboards:** If your team uses Notion, AI can generate database views, filtered tables, and embedded charts that function as a lightweight dashboard.
  **Python + Streamlit:** Ask AI to generate a Streamlit app — a few lines of Python that create an interactive web dashboard. Free to run locally, free to deploy on Streamlit Cloud.
  **Observable notebooks:** Free JavaScript notebooks that create interactive visualizations. Ask AI to write Observable code for your data — the results are shareable via URL.


  Common Mistakes
  ## Report Anti-Patterns

  Avoid these mistakes that undermine even well-analyzed data:
  **The data cemetery:** A report so dense with tables and numbers that no one reads it. If your report exceeds 3 pages, you need a better executive summary, not more pages.
  **The chart carnival:** Filling every inch of space with charts. Five mediocre charts are worse than two excellent ones. Each visualization should earn its place by communicating something a table cannot.
  **Missing the "so what?":** Presenting data without interpretation. "Revenue was $48,000" is not a finding. "Revenue missed target by 8%, driven by a 23% decline in repeat purchases, suggesting our retention campaign needs attention" is a finding.
  **Buried recommendations:** Hiding action items on page 6 of a report. Always put recommendations in the executive summary and then repeat them at the end. Decision-makers should not have to hunt for the answer to "what should we do?"
  **No comparison baseline:** Showing this month's numbers without any reference point. Every number needs context — last month, last year, target, industry average. Without comparison, numbers float in space without meaning.


  Practical
  ## Building a Report Template with AI

  Here is a step-by-step process for creating a reusable report template that produces consistent, professional output every time:
  **Step 1:** Run your analysis on this period's data and refine the output until it is exactly what you need. This is your reference report.
  **Step 2:** Ask AI: "Turn this analysis process into a reusable prompt template. Replace specific data references with placeholders like [DATA], [TIME_PERIOD], and [AUDIENCE]. Keep all formatting instructions."
  **Step 3:** Save the template somewhere accessible — a notes app, a document, or a prompt library. Add a name and description so future-you remembers what it does.
  **Step 4:** Next reporting period, paste new data into the template placeholders. The output will match the quality and format of your reference report in a fraction of the time.
  **Step 5:** After each use, note improvements. Add them to the template. Over time, your template becomes a precision instrument tuned to your exact reporting needs.


  Delivery
  ## Delivering Reports That Get Read

  Creating a great report is only half the battle. Getting people to actually read it and act on it is the other half:
  **Lead with the surprise:** Open with the most unexpected finding. "Our highest-spending customers have the lowest satisfaction scores" grabs attention in a way that "Q3 revenue summary" never will.
  **Keep it scannable:** Bold the key numbers. Use bullet points. Break long paragraphs. Decision-makers scan before they read — make scanning productive.
  **End with a clear ask:** Every report should end with a specific recommended action and a request for a decision. "Based on this analysis, I recommend increasing the marketing budget for Channel A by 15%. Approve/modify/decline?"
  **Choose the right delivery format:** Some audiences want a PDF. Others want a live dashboard. Some want a 3-bullet-point Slack message. Ask AI to reformat the same analysis for different delivery channels.
  **Follow up:** A week after delivering, check: was the recommendation acted on? If not, why? This feedback loop improves your future reports and builds trust in your analysis.


  Narrative
  ## Data Storytelling

  The highest form of reporting is storytelling. Great data stories follow a narrative arc:
  **Setting:** "Last quarter, we launched three new marketing channels with a combined budget of $15,000."
  **Conflict:** "Overall conversions dropped 8% despite the increased spend. Something was wrong."
  **Investigation:** "When we segmented by channel, Channel A converted at 2x the rate of Channels B and C combined."
  **Resolution:** "By reallocating 70% of the budget to Channel A and cutting Channel C, we project a 25% conversion increase next quarter."
  Ask AI: "Turn this analysis into a data story. Give it a narrative arc — what was the situation, what did we discover, and what should we do about it." This format is far more memorable and persuasive than bullet points alone.
  Data storytelling is the highest-impact skill in this entire course. A perfectly analyzed dataset that nobody acts on is worth nothing. A well-told data story that drives a single important decision is worth everything.
  Practice this with every analysis you create. Over time, storytelling becomes second nature — and your reports will be the ones people actually read.


  ### Try It Yourself

  Take any analysis you've done in a previous lesson. Ask Claude to turn it into a polished report:
  `Turn this analysis into a professional report with three sections: 1) Executive summary (3-5 sentences, lead with the key insight), 2) Key metrics with suggested chart types, 3) Detailed findings with recommendations. Write it for [your audience]. Format it in clean markdown.`


  Key Concepts
  ## Learn the Terms


### Reporting and Dashboard Concepts

**Card 1:**
Front: Three-Layer Report
Back: Executive summary (3-5 sentences) → key metrics and visuals → detailed analysis. Most reports fail because they start at layer 3 instead of layer 1

**Card 2:**
Front: Executive Summary
Back: The headline findings in 3-5 sentences — what changed, what matters, what to do about it. A busy person reads only this and still gets the point

**Card 3:**
Front: KPI Card
Back: A single-number display at the top of a dashboard showing a key metric with comparison context — like revenue vs. last month

**Card 4:**
Front: Recurring Report Template
Back: A reusable prompt with placeholders for new data — the first report takes effort, every subsequent one takes five minutes

**Card 5:**
Front: Implication vs. Information
Back: Revenue was $50,000 is information. Revenue hit $50,000, exceeding target by 12% is an implication — decision-makers need implications


  Practice
  ## Match the Report Element


  Quick Review
  ## The Three-Layer Report


  Check Your Understanding
  ## Lesson 9 Quiz


### Quiz

**Q1: Why do most reports fail to drive action?**
    A. They contain too much data
  ✓ B. They start with detailed methodology instead of leading with the key insight
    C. They use too many charts
    D. They are too short
  *Most reports start at Layer 3 — the deep analytical detail. But decision-makers need Layer 1 first: what changed, what matters, what to do about it. Always lead with the insight.*

**Q2: What do decision-makers want instead of raw information?**
    A. More charts and tables
    B. Longer executive summaries
  ✓ C. Implications — what the data means and what to do about it
    D. Raw data exports they can analyze themselves
  *Revenue was $50,000 is information. Revenue hit $50,000, exceeding target by 12%, driven by the new product launch is an implication. Decision-makers need the second version.*

**Q3: What is the benefit of building a recurring report template?**
    A. Templates reduce the quality of analysis
  ✓ B. The first report takes effort; every subsequent one takes five minutes
    C. Templates only work for weekly reports
    D. You need coding skills to create templates
  *The investment goes into the first report. After that, you paste new data into the template and get consistent, high-quality reports in a fraction of the time.*


  [← Previous: Financial Data Analysis](/academy/ai-for-data-analysis/08-financial-data-analysis/)
  [Next: Building Your Analysis Workflow →](/academy/ai-for-data-analysis/10-building-your-analysis-workflow/)
