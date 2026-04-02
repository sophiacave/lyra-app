---
title: "Financial Data Analysis"
course: "ai-for-data-analysis"
order: 8
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-data-analysis/">← AI for Data Analysis</a>
  <span class="badge" style="background: var(--orange);">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Financial Data Analysis</h1>
  <p><span class="accent">Revenue, expenses, and forecasting</span> — your money, decoded</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Analyzing income and expense data with AI</li>
    <li>Building simple forecasts from historical data</li>
    <li>Spotting financial red flags automatically</li>
    <li>Creating budget vs. actual comparisons</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">For Everyone</span>
  <h2 class="section-title">You Don't Need to Be an Accountant</h2>
  <p class="section-text">Financial data analysis sounds intimidating, but it comes down to three questions: Where is the money coming from? Where is it going? And what does that mean for the future?</p>
  <p class="section-text">Whether you're tracking a personal budget, a side hustle, or a small business, AI makes these questions answerable without an accounting degree.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Revenue Analysis</span>
  <h2 class="section-title">Understanding Income Patterns</h2>
  <p class="section-text">Export your revenue data — from Stripe, PayPal, your bank, or a spreadsheet — and ask AI to find the patterns you're missing:</p>
  <p class="section-text"><strong>Revenue trends:</strong> Is income growing, flat, or declining? What's the month-over-month growth rate?</p>
  <p class="section-text"><strong>Revenue concentration:</strong> What percentage comes from your top 3 clients or products? High concentration means high risk.</p>
  <p class="section-text"><strong>Seasonality:</strong> Are there predictable peaks and valleys? Knowing this changes how you plan.</p>
  <p class="section-text"><strong>Average transaction value:</strong> Is it going up or down? Small shifts here compound dramatically over time.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Metrics</span>
  <h2 class="section-title">Essential Financial Metrics</h2>
  <p class="section-text">Understanding these metrics turns raw financial data into business intelligence. Ask AI to calculate them from your data:</p>
  <p class="section-text"><strong>Gross margin:</strong> (Revenue - Cost of Goods Sold) / Revenue. Tells you how much you keep from each sale before overhead. A declining gross margin means your costs are rising faster than your prices.</p>
  <p class="section-text"><strong>Burn rate:</strong> How fast you are spending cash reserves. Monthly expenses minus monthly revenue equals net burn. At your current burn rate, how many months of runway do you have?</p>
  <p class="section-text"><strong>Customer Acquisition Cost (CAC):</strong> Total marketing and sales spend divided by new customers acquired. If your CAC exceeds your average customer's lifetime value, you are losing money on every new customer.</p>
  <p class="section-text"><strong>Customer Lifetime Value (LTV):</strong> Average revenue per customer multiplied by average customer lifespan. The LTV-to-CAC ratio should be at least 3:1 — meaning each customer brings in three times what it costs to acquire them.</p>
  <p class="section-text"><strong>Revenue per employee:</strong> Total revenue divided by headcount. A quick efficiency benchmark you can compare against industry averages.</p>
  <p class="section-text"><strong>Working capital ratio:</strong> Current assets divided by current liabilities. Below 1.0 means you may not be able to pay short-term obligations. Above 2.0 is generally healthy.</p>
  <p class="section-text">You do not need to know these formulas by heart. Ask AI: "Calculate these financial metrics from my data and flag any that are outside healthy ranges for a [your industry] business."</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Templates</span>
  <h2 class="section-title">Financial Analysis Templates</h2>
  <p class="section-text">Save these prompt templates for recurring financial analysis tasks:</p>

  <div class="demo-container" style="border-left: 3px solid var(--purple); padding: 1rem; background: var(--bg); margin-bottom: 1rem;">
    <p><strong>Monthly P&L Review:</strong></p>
    <p><em>"Here's this month's financial data. Create a profit and loss summary: total revenue by source, total expenses by category, net profit, and margin percentage. Compare to last month and highlight anything that changed by more than 10%."</em></p>
  </div>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg); margin-bottom: 1rem;">
    <p><strong>Cash Flow Forecast:</strong></p>
    <p><em>"Based on the last 6 months of revenue and expense data, project my cash position for the next 3 months. Account for known upcoming expenses [list them]. Show me when cash gets tight and how much buffer I need."</em></p>
  </div>

  <div class="demo-container" style="border-left: 3px solid var(--orange); padding: 1rem; background: var(--bg);">
    <p><strong>Subscription Revenue Analysis:</strong></p>
    <p><em>"Here's my subscription data (signup date, plan, monthly amount, cancellation date if any). Calculate: Monthly Recurring Revenue, churn rate, expansion revenue from upgrades, and net revenue retention. Show the trend for each over the last 6 months."</em></p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Expense Analysis</span>
  <h2 class="section-title">Where Money Disappears</h2>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg);">
    <p><strong>Try this with your bank or credit card export:</strong></p>
    <p><em>"Here are my business expenses for the last 6 months. Categorize each transaction, then show me: total by category, month-over-month changes, the fastest-growing expense category, and any subscriptions I might have forgotten about."</em></p>
    <p style="color: var(--dim);">AI catches recurring charges you forgot you were paying. It spots the $29/month tool you haven't used since January. These small finds often pay for themselves immediately.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Forecasting</span>
  <h2 class="section-title">Simple Predictions from Historical Data</h2>
  <p class="section-text">You don't need a financial model to forecast. If you have 6-12 months of data, AI can project reasonable estimates:</p>
  <p class="section-text"><strong>"Based on this revenue data, project the next 3 months. Use a conservative, moderate, and optimistic scenario. Explain your assumptions for each."</strong></p>
  <p class="section-text">AI will factor in trend direction, seasonality, and variance to give you three scenarios. This isn't fortune-telling — it's informed planning. And it's better than guessing.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--red);">Red Flags</span>
  <h2 class="section-title">Financial Warning Signs</h2>
  <p class="section-text">Ask AI to flag these automatically from your data:</p>
  <p class="section-text"><strong>Margin compression:</strong> Revenue growing but expenses growing faster.</p>
  <p class="section-text"><strong>Cash flow timing:</strong> Big expenses hitting before revenue comes in.</p>
  <p class="section-text"><strong>Single-source dependency:</strong> More than 30% of revenue from one customer.</p>
  <p class="section-text"><strong>Expense creep:</strong> Small increases that compound — $50/month here, $100/month there.</p>
</div>

  <div class="tip-box">
    <div class="tip-label">Python Financial Analysis</div>
    <p>Claude generates scripts like this for financial data:</p>
  </div>

  <pre><code class="language-python">import pandas as pd

df = pd.read_csv("transactions.csv")
df["date"] = pd.to_datetime(df["date"])
df["month"] = df["date"].dt.to_period("M")

# Revenue vs expenses by month
revenue = df[df["type"] == "income"].groupby("month")["amount"].sum()
expenses = df[df["type"] == "expense"].groupby("month")["amount"].sum()
profit = revenue - expenses
margin = (profit / revenue * 100).round(1)

print("Monthly P&L:")
for m in revenue.index:
    print(f"  {m}: Revenue ${revenue[m]:,.0f} | Expenses ${expenses[m]:,.0f} | Margin {margin[m]}%")

# Revenue concentration: top sources
top_sources = df[df["type"] == "income"].groupby("source")["amount"].sum().sort_values(ascending=False)
total_rev = top_sources.sum()
print(f"\nRevenue concentration:")
for src, amt in top_sources.head(3).items():
    print(f"  {src}: ${amt:,.0f} ({amt/total_rev*100:.0f}%)")

# Find forgotten subscriptions (recurring small expenses)
recurring = df[df["type"] == "expense"].groupby("description")["amount"].agg(["count", "sum"])
subscriptions = recurring[recurring["count"] >= 3].sort_values("sum", ascending=False)
print(f"\nRecurring expenses (3+ charges):\n{subscriptions}")</code></pre>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Export 3-6 months of financial data from your bank, Stripe, or accounting software. Ask Claude:</p>
  <div class="prompt-box"><code>Here's my financial data for the past [N] months. Please: 1) Summarize revenue and expenses by month, 2) Calculate my profit margin trend, 3) Identify the top 3 expense categories and whether they're growing, 4) Flag anything that looks unusual or concerning, 5) Project next month's revenue with your confidence level.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Key Concepts</span>
  <h2 class="section-title">Learn the Terms</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Financial Analysis Essentials","cards":[{"front":"Revenue Concentration","back":"The percentage of income from your top clients or products — high concentration (e.g. 70% from 3 clients) means high risk if any one leaves"},{"front":"Seasonality","back":"Predictable peaks and valleys in revenue tied to time of year — knowing the pattern changes how you plan cash flow and marketing"},{"front":"Margin Compression","back":"When revenue grows but expenses grow faster — your profit margin shrinks even though the top line looks healthy"},{"front":"Expense Creep","back":"Small monthly cost increases that seem harmless individually but compound dramatically — $50 here, $100 there adds up fast"},{"front":"Three-Scenario Forecast","back":"Conservative, moderate, and optimistic projections based on historical data — better than a single guess because it gives a planning range with explicit assumptions"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Quick Review</span>
  <h2 class="section-title">Financial Red Flags</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Lesson 8 Quiz</h2>
  <div data-learn="QuizMC" data-props='{"title":"Financial Data Analysis","questions":[{"q":"What does high revenue concentration mean for a business?","options":["The business is performing well","A high percentage from a few clients or products means higher risk","Revenue is growing month over month","Expenses are well diversified"],"correct":1,"explanation":"If your top 3 clients represent 70% of revenue and one leaves, you lose 70% overnight. High concentration means high risk — diversification is safer."},{"q":"What are the three scenarios AI should provide in a financial forecast?","options":["Past, present, and future","Monthly, quarterly, and annual","Conservative, moderate, and optimistic","Best case, worst case, and most likely"],"correct":2,"explanation":"Conservative, moderate, and optimistic scenarios give you a planning range with explicit assumptions. This is better than a single guess and helps you prepare for different outcomes."},{"q":"What is one of the most practical benefits of running expenses through AI analysis?","options":["AI automatically pays your bills","AI catches recurring charges and forgotten subscriptions","AI predicts future stock prices","AI files your taxes automatically"],"correct":1,"explanation":"AI often finds the $29/month tool you forgot about or the subscription that auto-renewed. These small finds frequently pay for the analysis immediately."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-for-data-analysis/07-survey-and-feedback-analysis/">← Previous: Survey and Feedback Analysis</a>
  <a href="/academy/ai-for-data-analysis/09-reporting-and-dashboards/">Next: Reporting and Dashboards →</a>
</nav>

</div>
