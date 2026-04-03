---
title: "Spreadsheet Analysis"
course: "ai-for-data-analysis"
order: 3
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-data-analysis/">← AI for Data Analysis</a>
  <span class="badge" style="background: var(--green);">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Spreadsheet Analysis</h1>
  <p><span class="accent">Analyzing CSV and Excel data</span> with AI — no formulas required</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How to feed spreadsheet data to AI effectively</li>
    <li>Best practices for CSV and Excel formatting</li>
    <li>Getting AI to write formulas for you</li>
    <li>When to use AI vs. when to stay in the spreadsheet</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">Getting Data In</span>
  <h2 class="section-title">Feeding Spreadsheets to AI</h2>
  <p class="section-text">You have three main ways to get spreadsheet data into an AI conversation:</p>
  <p class="section-text"><strong>1. Copy and paste:</strong> Select your data in Excel or Google Sheets, copy it, paste it into the chat. Works great for datasets under a few hundred rows.</p>
  <p class="section-text"><strong>2. Upload the file:</strong> Many AI tools accept CSV or Excel uploads directly. This handles larger datasets and preserves formatting.</p>
  <p class="section-text"><strong>3. Describe and sample:</strong> For massive datasets, paste the first 20-30 rows and describe the full scope. AI can suggest approaches even without seeing every row.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Pro Tips</span>
  <h2 class="section-title">Formatting for Best Results</h2>
  <p class="section-text">A few small formatting choices make a massive difference in AI analysis quality:</p>
  <p class="section-text"><strong>Use clear headers:</strong> "monthly_revenue" beats "Col_F". AI reads your column names to understand meaning.</p>
  <p class="section-text"><strong>Include units:</strong> Tell AI whether numbers are dollars, percentages, counts, or kilograms. Don't make it guess.</p>
  <p class="section-text"><strong>Specify date formats:</strong> "The date column is MM/DD/YYYY" prevents misinterpretation.</p>
  <p class="section-text"><strong>Flag known issues:</strong> "Row 47 has a data entry error — ignore it" saves you from misleading results.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Formula Generation</span>
  <h2 class="section-title">AI-Powered Formula Prompts</h2>
  <p class="section-text">Here are battle-tested prompt patterns for the most common spreadsheet formulas. Save these — you will use them constantly:</p>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg); margin-bottom: 1rem;">
    <p><strong>Conditional Aggregation:</strong></p>
    <p><em>"I have columns: Date (A), Category (B), Amount (C), Region (D). Write a SUMIFS formula that totals Amount where Category is 'Marketing' AND Region is 'West' AND Date is in the current month."</em></p>
    <p style="color: var(--dim);">Works for SUMIFS, COUNTIFS, AVERAGEIFS — any conditional aggregate.</p>
  </div>

  <div class="demo-container" style="border-left: 3px solid var(--purple); padding: 1rem; background: var(--bg); margin-bottom: 1rem;">
    <p><strong>Lookup and Match:</strong></p>
    <p><em>"Sheet1 has employee IDs in column A and names in column B. Sheet2 has employee IDs in column A and I need their names in column B. Write a formula using XLOOKUP (or VLOOKUP if XLOOKUP isn't available) that pulls names from Sheet1 into Sheet2, and returns 'Not Found' for any missing IDs."</em></p>
    <p style="color: var(--dim);">Always specify what should happen when the lookup fails — AI will handle the error gracefully.</p>
  </div>

  <div class="demo-container" style="border-left: 3px solid var(--blue); padding: 1rem; background: var(--bg); margin-bottom: 1rem;">
    <p><strong>Dynamic Date Ranges:</strong></p>
    <p><em>"I need a formula that calculates total revenue for the last 30 days, the last 90 days, and year-to-date — all updating automatically based on today's date. Revenue is in column C, dates in column A."</em></p>
    <p style="color: var(--dim);">AI handles the date math so you never have to remember whether EOMONTH needs a 0 or a -1.</p>
  </div>

  <div class="demo-container" style="border-left: 3px solid var(--orange); padding: 1rem; background: var(--bg);">
    <p><strong>Percentage Calculations:</strong></p>
    <p><em>"For each row, calculate: what percentage of total revenue this row represents, the month-over-month percentage change, and whether the change is above or below the average growth rate. Revenue in column C, months in column A."</em></p>
    <p style="color: var(--dim);">AI writes the formulas AND explains the logic, so you learn as you go.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--red);">Strategy</span>
  <h2 class="section-title">Pivot Table Strategies with AI</h2>
  <p class="section-text">Pivot tables are one of the most powerful spreadsheet features — and one of the most confusing. AI eliminates the confusion by telling you exactly how to build them:</p>
  <p class="section-text"><strong>When to use a pivot table:</strong> Any time you need to summarize, group, or cross-tabulate data. If you are writing multiple SUMIF formulas for different categories, a pivot table is probably the better approach.</p>
  <p class="section-text"><strong>The AI shortcut:</strong> Describe your data and what you want to see. AI tells you exactly which fields go in rows, columns, values, and filters.</p>

  <div class="demo-container" style="border-left: 3px solid var(--red); padding: 1rem; background: var(--bg);">
    <p><strong>Example prompt:</strong></p>
    <p><em>"I have sales data with columns: Date, Product, Region, Salesperson, Revenue, Units. I want to see total revenue by Product and Region, with months as columns, so I can spot which products are growing in which regions. Tell me exactly how to set up this pivot table in Google Sheets."</em></p>
    <p style="color: var(--dim);">AI gives you step-by-step instructions: Rows = Product, Columns = Date (grouped by month), Values = SUM of Revenue, Filter = Region. It also suggests adding a calculated field for growth rate.</p>
  </div>

  <p class="section-text"><strong>Pro tip:</strong> After building the pivot table, paste it back into AI and ask for insights. The combination of structured pivot output plus AI interpretation is extremely powerful.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Game Changer</span>
  <h2 class="section-title">AI-Generated Formulas</h2>
  <p class="section-text">One of the most practical uses of AI in spreadsheet work: getting it to write formulas for you. You don't need to memorize VLOOKUP syntax ever again.</p>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg);">
    <p><strong>Example prompt:</strong></p>
    <p><em>"I have a Google Sheet with columns: Date (A), Category (B), Amount (C), Status (D). Write me a formula that sums all amounts where Category is 'Marketing' and Status is 'Approved' for the current month."</em></p>
    <p style="color: var(--dim);">AI returns the exact formula, explains each part, and often suggests alternatives you hadn't considered.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Know the Limits</span>
  <h2 class="section-title">When to Stay in the Spreadsheet</h2>
  <p class="section-text">AI is brilliant for analysis, but spreadsheets still win for some tasks:</p>
  <p class="section-text"><strong>Live data:</strong> If your spreadsheet connects to a live database, keep the dynamic calculations there.</p>
  <p class="section-text"><strong>Shared workbooks:</strong> When a team collaborates on the same sheet, AI analysis works best as a side investigation.</p>
  <p class="section-text"><strong>Recurring reports:</strong> Once AI helps you build the formula or template, run it natively in the sheet going forward.</p>
  <p class="section-text">The sweet spot: use AI to figure out the approach, then implement it in your spreadsheet for ongoing use.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">Large Datasets</span>
  <h2 class="section-title">Working with Large Spreadsheets</h2>
  <p class="section-text">Most AI tools have context limits. When your spreadsheet has thousands of rows, you need a strategy:</p>
  <p class="section-text"><strong>Summary statistics first:</strong> Before sending raw data, calculate basic stats in the spreadsheet (totals, averages, counts by category) and send those. AI can identify patterns from summaries without needing every row.</p>
  <p class="section-text"><strong>Representative sampling:</strong> Send the first 50 rows, 50 from the middle, and the last 50. Tell AI: "This is a representative sample of [total] rows. The full dataset covers [time period] with columns [list]. Analyze this sample and tell me what you'd need to see to confirm any patterns."</p>
  <p class="section-text"><strong>Column-by-column analysis:</strong> For very wide spreadsheets, analyze a few related columns at a time rather than pasting everything. Revenue and date first, then customer segment and region, then product details.</p>
  <p class="section-text"><strong>Ask for code instead of analysis:</strong> For truly large datasets (10,000+ rows), ask AI to write a Python or Google Apps Script that runs the analysis directly on the full dataset. This bypasses context limits entirely.</p>
  <p class="section-text"><strong>Pre-aggregate in the spreadsheet:</strong> Use pivot tables or SUMIFS to create a summary table, then paste that into AI. A 10,000-row dataset becomes a 50-row summary that AI can analyze deeply.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--red);">Common Errors</span>
  <h2 class="section-title">Spreadsheet Mistakes AI Catches</h2>
  <p class="section-text">One of the most valuable uses of AI in spreadsheet work is error detection. Paste your spreadsheet data and ask AI to audit it:</p>
  <p class="section-text"><strong>Formula errors:</strong> "Review these formulas for common mistakes — circular references, incorrect ranges, missing absolute references, and division by zero risks."</p>
  <p class="section-text"><strong>Data type mismatches:</strong> Numbers stored as text, dates that Excel does not recognize, currency values with inconsistent formatting. AI spots these instantly.</p>
  <p class="section-text"><strong>Hidden assumptions:</strong> "This spreadsheet calculates projected revenue. What assumptions are baked into these formulas? Are any of them unreasonable?"</p>
  <p class="section-text"><strong>Logic gaps:</strong> "Walk through the logic of this spreadsheet from input to output. Are there any steps where the calculation seems wrong or where a different approach would be more accurate?"</p>
  <p class="section-text">These audit prompts have saved professionals from embarrassing errors in board presentations, client reports, and financial filings. Five minutes of AI review can prevent a costly mistake.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Cross-Platform</span>
  <h2 class="section-title">Working Across Spreadsheet Platforms</h2>
  <p class="section-text">Excel, Google Sheets, and Numbers have slightly different formula syntax. AI handles the translation seamlessly:</p>
  <p class="section-text"><strong>"Write this formula for Google Sheets"</strong> — AI uses ARRAYFORMULA, QUERY, and Google-specific functions.</p>
  <p class="section-text"><strong>"Convert this to Excel format"</strong> — AI swaps Google-only functions for Excel equivalents and handles differences like semicolons vs. commas in European Excel.</p>
  <p class="section-text"><strong>"Will this work in both Excel and Google Sheets?"</strong> — AI identifies compatibility issues and suggests universal alternatives.</p>
  <p class="section-text">When in doubt, tell AI which platform you use. It will tailor the formula syntax, keyboard shortcuts, and feature references to your specific tool.</p>
</div>

  <div class="tip-box">
    <div class="tip-label">Python Bonus</div>
    <p>Ask Claude to write Python code for recurring analysis. Here is what Claude generates when you say <em>"Write a Python script to analyze my monthly sales CSV"</em>:</p>
  </div>

  <pre><code class="language-python">import pandas as pd

# Load your CSV — works with any spreadsheet export
df = pd.read_csv("sales_data.csv")

# Quick overview: shape, column types, missing values
print(f"Rows: {len(df)}, Columns: {len(df.columns)}")
print(f"Missing values:\n{df.isnull().sum()}")

# Monthly revenue summary
df["date"] = pd.to_datetime(df["date"])
monthly = df.groupby(df["date"].dt.to_period("M"))["revenue"].agg(["sum", "mean", "count"])
monthly.columns = ["total_revenue", "avg_transaction", "num_transactions"]
print(monthly)

# Top products by revenue
top_products = df.groupby("product")["revenue"].sum().sort_values(ascending=False).head(5)
print(f"\nTop 5 products:\n{top_products}")

# Month-over-month growth rate
monthly["growth_pct"] = monthly["total_revenue"].pct_change() * 100
print(f"\nMonth-over-month growth:\n{monthly['growth_pct']}")</code></pre>

</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Export any spreadsheet as CSV. Paste the first 50 rows into Claude along with this prompt:</p>
  <div class="prompt-box"><code>Here's a sample of my [type] data (CSV format). The columns are: [list columns and what they mean]. Analyze the data and give me: 1) A summary of key metrics, 2) The top 3 insights, 3) Any Google Sheets formulas I should add to track these metrics ongoing.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Key Concepts</span>
  <h2 class="section-title">Learn the Terms</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Spreadsheet Analysis Essentials","cards":[{"front":"Copy and Paste Method","back":"Select data in Excel or Google Sheets and paste directly into the AI chat — works great for datasets under a few hundred rows"},{"front":"Describe and Sample Method","back":"For massive datasets, paste the first 20-30 rows and describe the full scope — AI can suggest approaches without seeing every row"},{"front":"Clear Column Headers","back":"Use descriptive names like monthly_revenue instead of Col_F — AI reads headers to understand what each column means"},{"front":"AI-Generated Formulas","back":"Ask AI to write spreadsheet formulas for you in plain English — no need to memorize VLOOKUP or SUMIF syntax ever again"},{"front":"The Sweet Spot","back":"Use AI to figure out the analysis approach, then implement formulas and templates natively in the spreadsheet for ongoing use"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Review</span>
  <h2 class="section-title">Data Input Methods</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Lesson 3 Quiz</h2>
  <div data-learn="QuizMC" data-props='{"title":"Spreadsheet Analysis","questions":[{"q":"Which column header style gives AI the best understanding of your data?","options":["Col_F","field6","monthly_revenue","data"],"correct":2,"explanation":"Clear, descriptive headers like monthly_revenue tell the AI exactly what each column means — it reads your headers to interpret the data correctly."},{"q":"What is the sweet spot for using AI vs staying in the spreadsheet?","options":["Always use AI for everything","Always stay in the spreadsheet","Use AI to figure out the approach, then implement it natively for ongoing use","Only use AI for data under 100 rows"],"correct":2,"explanation":"AI is brilliant for figuring out the right analysis approach and writing formulas. For recurring reports and live data, implement the solution natively in the spreadsheet going forward."},{"q":"Why should you specify date formats when giving data to AI?","options":["AI cannot read dates at all","Different formats can be misinterpreted, leading to wrong analysis","AI only understands one date format","Dates are not useful for analysis"],"correct":1,"explanation":"03/15/2024 could be March 15 or the 3rd day of the 15th month depending on locale. Telling AI the exact format prevents misinterpretation and wrong results."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-for-data-analysis/02-asking-the-right-questions/">← Previous: Asking the Right Questions</a>
  <a href="/academy/ai-for-data-analysis/04-visualization-and-charts/">Next: Visualization and Charts →</a>
</nav>

</div>
