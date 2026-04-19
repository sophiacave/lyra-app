# Pattern Recognition

**Course:** AI for Data Analysis
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[← AI for Data Analysis](/academy/ai-for-data-analysis/)
  Lesson 6 of 10


  # Pattern Recognition

  Finding trends, outliers, and correlations hidden in your data


  ### What You'll Learn


    - How AI spots patterns humans can't see

    - The difference between trends, outliers, and correlations

    - Asking AI to explain why patterns exist, not just that they exist

    - Avoiding the correlation-causation trap




  Hidden Signals
  ## Patterns Are Everywhere

  Every dataset tells a story, but most of the story is invisible to the naked eye. You might notice that sales dip in February, but did you notice that customers who buy Product A in their first order are 3x more likely to buy Product C within 60 days?
  AI can hold an entire dataset in view simultaneously and spot relationships across thousands of data points. This is where AI analysis goes from convenient to genuinely powerful.


  Taxonomy
  ## The Pattern Type Catalog

  Patterns in data fall into distinct categories. Knowing the types helps you ask AI the right questions and interpret results with confidence:
  **Seasonal patterns:** Recurring cycles tied to calendar periods. Retail spikes in December. Gym memberships surge in January. Ice cream sales peak in July. Ask AI: "Is there a seasonal pattern in this data? Show me the same metric for the same month across multiple years."
  **Cyclical patterns:** Recurring fluctuations not tied to a fixed calendar. Business cycles, economic expansions and contractions, product adoption curves. These are harder to spot because the period length varies.
  **Step changes:** Sudden, permanent shifts in a metric. A new pricing model that moved average order value from $30 to $45 overnight. A policy change that cut support tickets by 40%. Ask AI: "Are there any abrupt level changes in this time series? When did they occur, and what could have caused them?"
  **Gradual drift:** Slow changes that are invisible day-to-day but significant over months or years. Customer satisfaction slowly declining. Average response time creeping up. These are the most dangerous because nobody notices until it is too late.
  **Clustering:** Groups of similar data points that form naturally. Customers who behave similarly, products with similar sales patterns, regions with similar demographics. Ask AI: "Are there natural clusters or groups in this data based on these variables?"
  **Absence patterns:** Sometimes the most important pattern is what is missing. No sales on certain days. No support tickets from a region that should be generating them. Zero values where there should be data. Ask AI: "Are there any gaps, zeros, or missing data points that seem unusual given the surrounding context?"


  Three Types
  ## Trends, Outliers, and Correlations

  **Trends** are directional patterns over time. Revenue is growing 5% month-over-month. Customer support tickets increase every Monday. Your email open rate has been declining since September.
  **Outliers** are data points that don't fit the pattern. One customer spent 20x the average. One day had zero traffic when every other day had thousands. Outliers are either errors or the most interesting data points you have.
  **Correlations** are relationships between variables. When ad spend goes up, conversions go up. When temperature drops, hot chocolate sales rise. Correlation doesn't mean causation — but it always means investigation.


  Going Deeper
  ## Ask "Why," Not Just "What"



    **Surface-level prompt:** "Find patterns in this sales data."
    **Deeper prompt:** "Find patterns in this sales data. For each pattern you identify, suggest 2-3 possible explanations for why it exists, and tell me what additional data I'd need to confirm each explanation."
    The second prompt turns pattern detection into genuine business intelligence.



  Critical Warning
  ## The Correlation Trap

  Ice cream sales and drowning deaths both increase in summer. That doesn't mean ice cream causes drowning. Both are caused by heat. This is the correlation-causation trap, and AI can accidentally reinforce it if you're not careful.
  Always ask AI: **"Could there be a confounding variable here?"** and **"What would I need to prove this is causal, not just correlated?"** This habit separates people who find patterns from people who find truth.


  Advanced Move
  ## Segmented Pattern Analysis

  Overall averages lie. Your "average customer" might not exist. Ask AI to break patterns down by segments: by region, by customer type, by time period, by product.
  A flat overall trend might actually be two segments moving in opposite directions — one growing fast, one declining. That insight changes everything about your next decision.


  Detection
  ## Anomaly Detection Methods

  Anomalies — data points that deviate significantly from the expected pattern — are often the most valuable findings in any analysis. Here are the methods AI uses to detect them:
  **Statistical thresholds:** Flag any value more than 2 or 3 standard deviations from the mean. Simple and effective for normally distributed data. Ask AI: "Flag values beyond 2 standard deviations in each numeric column and tell me if they look like errors or genuine outliers."
  **IQR method:** The Interquartile Range method flags values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR. More robust than standard deviation because it is not skewed by the outliers themselves.
  **Time-series anomalies:** Values that break the expected pattern for a specific time period. A Monday with half the usual traffic. A month with twice the usual revenue. Ask AI: "Compare each data point to the expected value for its time period and flag significant deviations."
  **Contextual anomalies:** Values that are normal in one context but abnormal in another. $500 revenue is normal for a Tuesday but anomalous for a Black Friday. Ask AI: "Flag values that are unusual given their context — day of week, season, or category."
  The critical question for every anomaly: **is this a data error or a genuine signal?** Ask AI to help you distinguish by checking surrounding data, cross-referencing other columns, and looking for corroborating evidence.


  Practical
  ## Pattern Recognition Prompt Patterns

  Use these prompt structures when asking AI to find patterns in your data:


    **Multi-dimensional scan:**
    *"Analyze this data across three dimensions: time (weekly trends), category (differences between groups), and magnitude (are changes accelerating or decelerating?). For each pattern found, rate your confidence and suggest what could be causing it."*



    **Before-and-after analysis:**
    *"Something changed on [date]. Compare all metrics before and after that date. Which metrics changed significantly? Which stayed the same? What does the pattern of changes suggest about the cause?"*



    **Cohort pattern analysis:**
    *"Group customers by their signup month. For each cohort, track [metric] over the following 6 months. Do newer cohorts behave differently than older ones? Is there a pattern in how behavior changes over time?"*


  Each of these prompt patterns gives AI clear structure while leaving room for it to surface unexpected findings. The key is always asking "why might this be happening?" alongside "what pattern exists?" — the combination produces actionable intelligence rather than just interesting trivia.


  Verification
  ## Validating Patterns

  Not every pattern is real. Before acting on a finding, verify it:
  **Check sample size:** A "trend" based on 5 data points is not a trend — it is noise. Ask AI: "How many data points support this pattern? Is the sample large enough to be statistically meaningful?"
  **Test across segments:** Does the pattern hold when you split the data differently? If a trend only appears in one segment and disappears in all others, it might be a segment-specific phenomenon rather than a general pattern.
  **Look for external explanations:** Before concluding that your actions caused a change, ask if something external happened. A sudden traffic spike might be a viral mention, not your SEO working. A revenue dip might be a holiday, not a product problem.
  **Reproduce with different methods:** If AI found a pattern using one approach, ask it to verify using a different method. "You found this correlation using monthly averages. Does the same relationship hold when we look at weekly data?"
  A finding that survives multiple verification approaches is a finding you can act on with confidence. A finding that crumbles under scrutiny just saved you from a bad decision.


  Communication
  ## Communicating Patterns Effectively

  Finding a pattern is only half the job. Communicating it clearly is the other half:
  **State the pattern plainly:** "Customers who use Feature X within their first week have a 40% higher retention rate than those who don't." No jargon. No hedging. Clear and direct.
  **Quantify the impact:** "This pattern affects approximately 2,000 customers per month and represents an estimated $50,000 in recoverable revenue." Numbers make patterns real and actionable.
  **Acknowledge uncertainty:** "This correlation is strong but based on 4 months of data. We recommend monitoring for 2 more months before making major resource commitments." Honest about limitations, confident about the finding.
  **Suggest the next step:** "To confirm this pattern is causal, we recommend an A/B test where new users are prompted to try Feature X during onboarding." Always connect the pattern to an action.
  Ask AI: "Summarize this pattern for a non-technical audience. State what it is, why it matters, how confident we should be, and what we should do about it."



    Python Pattern Detection
    Claude can generate this pattern analysis script for your data:



```
import pandas as pd
import numpy as np

df = pd.read_csv("sales_data.csv")
df["date"] = pd.to_datetime(df["date"])

# Trend detection: month-over-month growth
monthly = df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()
growth = monthly.pct_change() * 100
print("Month-over-month growth (%):")
print(growth.round(1))

# Outlier detection: flag values beyond 2 standard deviations
mean, std = df["revenue"].mean(), df["revenue"].std()
outliers = df[abs(df["revenue"] - mean) > 2 * std]
print(f"\nOutliers found: {len(outliers)}")
if len(outliers) > 0:
    print(outliers[["date", "product", "revenue"]])

# Correlation analysis: find relationships between numeric columns
numeric_cols = df.select_dtypes(include=[np.number]).columns
correlations = df[numeric_cols].corr()
print("\nCorrelation matrix:")
print(correlations.round(2))

# Segmented analysis: compare patterns by category
for segment, group in df.groupby("product"):
    seg_growth = group.groupby(group["date"].dt.to_period("M"))["revenue"].sum().pct_change().mean() * 100
    print(f"{segment}: avg monthly growth = {seg_growth:.1f}%")
```


  ### Try It Yourself

  Upload a dataset with at least 3 columns and 50+ rows. Ask Claude to go hunting:
  `Analyze this data for: 1) Time-based trends, 2) Statistical outliers with possible explanations, 3) Correlations between any columns. For each finding, rate your confidence (high/medium/low) and explain what could be causing it.`


  Key Concepts
  ## Learn the Terms

  [Interactive: FlashDeck]


  Quick Review
  ## Pattern Types


  Check Your Understanding
  ## Lesson 6 Quiz


### Quiz

**Q1: Ice cream sales and drowning deaths both increase in summer. What does this illustrate?**
    A. Ice cream causes drowning
    B. A strong causal relationship
  ✓ C. A correlation caused by a confounding variable (heat)
    D. A trend pattern over time
  *Both are caused by hot weather — a confounding variable. This is the correlation-causation trap. Always ask AI if there could be a third factor driving two correlated variables.*

**Q2: What is a segmented pattern analysis and why does it matter?**
  ✓ A. Breaking down overall trends by segments like region, customer type, or time period
    B. Removing outliers from the dataset
    C. Analyzing only the top 10% of data
    D. A technique for pie chart creation
  *Overall averages lie — your average customer might not exist. Segmentation can reveal two opposing trends hidden inside a flat overall number, which changes everything about your decisions.*

**Q3: What does asking AI to explain "why" a pattern exists (rather than just "what") accomplish?**
    A. It slows down the analysis
  ✓ B. It turns pattern detection into genuine business intelligence
    C. It produces less accurate results
    D. It only works for financial data
  *Asking for possible explanations and what additional data would confirm them transforms a basic pattern find into actionable intelligence you can actually use.*


  [← Previous: Cleaning Messy Data](/academy/ai-for-data-analysis/05-cleaning-messy-data/)
  [Next: Survey and Feedback Analysis →](/academy/ai-for-data-analysis/07-survey-and-feedback-analysis/)
