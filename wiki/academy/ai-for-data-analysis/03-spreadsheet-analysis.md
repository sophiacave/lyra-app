# Spreadsheet Analysis

**Course:** AI for Data Analysis
**Order:** 3
**Type:** lesson
**Access:** Free

---
[← AI for Data Analysis](/academy/ai-for-data-analysis/)
  Lesson 3 of 10


  # Spreadsheet Analysis

  Analyzing CSV and Excel data with AI — no formulas required


  ### What You'll Learn


    - How to feed spreadsheet data to AI effectively

    - Best practices for CSV and Excel formatting

    - Getting AI to write formulas for you

    - When to use AI vs. when to stay in the spreadsheet




  Getting Data In
  ## Feeding Spreadsheets to AI

  You have three main ways to get spreadsheet data into an AI conversation:
  **1. Copy and paste:** Select your data in Excel or Google Sheets, copy it, paste it into the chat. Works great for datasets under a few hundred rows.
  **2. Upload the file:** Many AI tools accept CSV or Excel uploads directly. This handles larger datasets and preserves formatting.
  **3. Describe and sample:** For massive datasets, paste the first 20-30 rows and describe the full scope. AI can suggest approaches even without seeing every row.


  Pro Tips
  ## Formatting for Best Results

  A few small formatting choices make a massive difference in AI analysis quality:
  **Use clear headers:** "monthly_revenue" beats "Col_F". AI reads your column names to understand meaning.
  **Include units:** Tell AI whether numbers are dollars, percentages, counts, or kilograms. Don't make it guess.
  **Specify date formats:** "The date column is MM/DD/YYYY" prevents misinterpretation.
  **Flag known issues:** "Row 47 has a data entry error — ignore it" saves you from misleading results.


  Formula Generation
  ## AI-Powered Formula Prompts

  Here are battle-tested prompt patterns for the most common spreadsheet formulas. Save these — you will use them constantly:


    **Conditional Aggregation:**
    *"I have columns: Date (A), Category (B), Amount (C), Region (D). Write a SUMIFS formula that totals Amount where Category is 'Marketing' AND Region is 'West' AND Date is in the current month."*
    Works for SUMIFS, COUNTIFS, AVERAGEIFS — any conditional aggregate.



    **Lookup and Match:**
    *"Sheet1 has employee IDs in column A and names in column B. Sheet2 has employee IDs in column A and I need their names in column B. Write a formula using XLOOKUP (or VLOOKUP if XLOOKUP isn't available) that pulls names from Sheet1 into Sheet2, and returns 'Not Found' for any missing IDs."*
    Always specify what should happen when the lookup fails — AI will handle the error gracefully.



    **Dynamic Date Ranges:**
    *"I need a formula that calculates total revenue for the last 30 days, the last 90 days, and year-to-date — all updating automatically based on today's date. Revenue is in column C, dates in column A."*
    AI handles the date math so you never have to remember whether EOMONTH needs a 0 or a -1.



    **Percentage Calculations:**
    *"For each row, calculate: what percentage of total revenue this row represents, the month-over-month percentage change, and whether the change is above or below the average growth rate. Revenue in column C, months in column A."*
    AI writes the formulas AND explains the logic, so you learn as you go.



  Strategy
  ## Pivot Table Strategies with AI

  Pivot tables are one of the most powerful spreadsheet features — and one of the most confusing. AI eliminates the confusion by telling you exactly how to build them:
  **When to use a pivot table:** Any time you need to summarize, group, or cross-tabulate data. If you are writing multiple SUMIF formulas for different categories, a pivot table is probably the better approach.
  **The AI shortcut:** Describe your data and what you want to see. AI tells you exactly which fields go in rows, columns, values, and filters.


    **Example prompt:**
    *"I have sales data with columns: Date, Product, Region, Salesperson, Revenue, Units. I want to see total revenue by Product and Region, with months as columns, so I can spot which products are growing in which regions. Tell me exactly how to set up this pivot table in Google Sheets."*
    AI gives you step-by-step instructions: Rows = Product, Columns = Date (grouped by month), Values = SUM of Revenue, Filter = Region. It also suggests adding a calculated field for growth rate.


  **Pro tip:** After building the pivot table, paste it back into AI and ask for insights. The combination of structured pivot output plus AI interpretation is extremely powerful.


  Game Changer
  ## AI-Generated Formulas

  One of the most practical uses of AI in spreadsheet work: getting it to write formulas for you. You don't need to memorize VLOOKUP syntax ever again.


    **Example prompt:**
    *"I have a Google Sheet with columns: Date (A), Category (B), Amount (C), Status (D). Write me a formula that sums all amounts where Category is 'Marketing' and Status is 'Approved' for the current month."*
    AI returns the exact formula, explains each part, and often suggests alternatives you hadn't considered.



  Know the Limits
  ## When to Stay in the Spreadsheet

  AI is brilliant for analysis, but spreadsheets still win for some tasks:
  **Live data:** If your spreadsheet connects to a live database, keep the dynamic calculations there.
  **Shared workbooks:** When a team collaborates on the same sheet, AI analysis works best as a side investigation.
  **Recurring reports:** Once AI helps you build the formula or template, run it natively in the sheet going forward.
  The sweet spot: use AI to figure out the approach, then implement it in your spreadsheet for ongoing use.


  Large Datasets
  ## Working with Large Spreadsheets

  Most AI tools have context limits. When your spreadsheet has thousands of rows, you need a strategy:
  **Summary statistics first:** Before sending raw data, calculate basic stats in the spreadsheet (totals, averages, counts by category) and send those. AI can identify patterns from summaries without needing every row.
  **Representative sampling:** Send the first 50 rows, 50 from the middle, and the last 50. Tell AI: "This is a representative sample of [total] rows. The full dataset covers [time period] with columns [list]. Analyze this sample and tell me what you'd need to see to confirm any patterns."
  **Column-by-column analysis:** For very wide spreadsheets, analyze a few related columns at a time rather than pasting everything. Revenue and date first, then customer segment and region, then product details.
  **Ask for code instead of analysis:** For truly large datasets (10,000+ rows), ask AI to write a Python or Google Apps Script that runs the analysis directly on the full dataset. This bypasses context limits entirely.
  **Pre-aggregate in the spreadsheet:** Use pivot tables or SUMIFS to create a summary table, then paste that into AI. A 10,000-row dataset becomes a 50-row summary that AI can analyze deeply.


  Common Errors
  ## Spreadsheet Mistakes AI Catches

  One of the most valuable uses of AI in spreadsheet work is error detection. Paste your spreadsheet data and ask AI to audit it:
  **Formula errors:** "Review these formulas for common mistakes — circular references, incorrect ranges, missing absolute references, and division by zero risks."
  **Data type mismatches:** Numbers stored as text, dates that Excel does not recognize, currency values with inconsistent formatting. AI spots these instantly.
  **Hidden assumptions:** "This spreadsheet calculates projected revenue. What assumptions are baked into these formulas? Are any of them unreasonable?"
  **Logic gaps:** "Walk through the logic of this spreadsheet from input to output. Are there any steps where the calculation seems wrong or where a different approach would be more accurate?"
  These audit prompts have saved professionals from embarrassing errors in board presentations, client reports, and financial filings. Five minutes of AI review can prevent a costly mistake.


  Cross-Platform
  ## Working Across Spreadsheet Platforms

  Excel, Google Sheets, and Numbers have slightly different formula syntax. AI handles the translation seamlessly:
  **"Write this formula for Google Sheets"** — AI uses ARRAYFORMULA, QUERY, and Google-specific functions.
  **"Convert this to Excel format"** — AI swaps Google-only functions for Excel equivalents and handles differences like semicolons vs. commas in European Excel.
  **"Will this work in both Excel and Google Sheets?"** — AI identifies compatibility issues and suggests universal alternatives.
  When in doubt, tell AI which platform you use. It will tailor the formula syntax, keyboard shortcuts, and feature references to your specific tool.



    Python Bonus
    Ask Claude to write Python code for recurring analysis. Here is what Claude generates when you say *"Write a Python script to analyze my monthly sales CSV"*:



```
import pandas as pd

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
print(f"\nMonth-over-month growth:\n{monthly['growth_pct']}")
```


  ### Try It Yourself

  Export any spreadsheet as CSV. Paste the first 50 rows into Claude along with this prompt:
  `Here's a sample of my [type] data (CSV format). The columns are: [list columns and what they mean]. Analyze the data and give me: 1) A summary of key metrics, 2) The top 3 insights, 3) Any Google Sheets formulas I should add to track these metrics ongoing.`


  Key Concepts
  ## Learn the Terms


### Spreadsheet Analysis Essentials

**Card 1:**
Front: Copy and Paste Method
Back: Select data in Excel or Google Sheets and paste directly into the AI chat — works great for datasets under a few hundred rows

**Card 2:**
Front: Describe and Sample Method
Back: For massive datasets, paste the first 20-30 rows and describe the full scope — AI can suggest approaches without seeing every row

**Card 3:**
Front: Clear Column Headers
Back: Use descriptive names like monthly_revenue instead of Col_F — AI reads headers to understand what each column means

**Card 4:**
Front: AI-Generated Formulas
Back: Ask AI to write spreadsheet formulas for you in plain English — no need to memorize VLOOKUP or SUMIF syntax ever again

**Card 5:**
Front: The Sweet Spot
Back: Use AI to figure out the analysis approach, then implement formulas and templates natively in the spreadsheet for ongoing use


  Quick Review
  ## Data Input Methods


  Check Your Understanding
  ## Lesson 3 Quiz


### Quiz

**Q1: Which column header style gives AI the best understanding of your data?**
    A. Col_F
    B. field6
  ✓ C. monthly_revenue
    D. data
  *Clear, descriptive headers like monthly_revenue tell the AI exactly what each column means — it reads your headers to interpret the data correctly.*

**Q2: What is the sweet spot for using AI vs staying in the spreadsheet?**
    A. Always use AI for everything
    B. Always stay in the spreadsheet
  ✓ C. Use AI to figure out the approach, then implement it natively for ongoing use
    D. Only use AI for data under 100 rows
  *AI is brilliant for figuring out the right analysis approach and writing formulas. For recurring reports and live data, implement the solution natively in the spreadsheet going forward.*

**Q3: Why should you specify date formats when giving data to AI?**
    A. AI cannot read dates at all
  ✓ B. Different formats can be misinterpreted, leading to wrong analysis
    C. AI only understands one date format
    D. Dates are not useful for analysis
  *03/15/2024 could be March 15 or the 3rd day of the 15th month depending on locale. Telling AI the exact format prevents misinterpretation and wrong results.*


  [← Previous: Asking the Right Questions](/academy/ai-for-data-analysis/02-asking-the-right-questions/)
  [Next: Visualization and Charts →](/academy/ai-for-data-analysis/04-visualization-and-charts/)
