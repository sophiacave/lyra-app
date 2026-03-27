---
title: "Pattern Recognition"
course: "ai-for-data-analysis"
order: 6
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-data-analysis/">← AI for Data Analysis</a>
  <span class="badge" style="background: var(--purple);">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Pattern Recognition</h1>
  <p><span class="accent">Finding trends, outliers, and correlations</span> hidden in your data</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How AI spots patterns humans can't see</li>
    <li>The difference between trends, outliers, and correlations</li>
    <li>Asking AI to explain why patterns exist, not just that they exist</li>
    <li>Avoiding the correlation-causation trap</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">Hidden Signals</span>
  <h2 class="section-title">Patterns Are Everywhere</h2>
  <p class="section-text">Every dataset tells a story, but most of the story is invisible to the naked eye. You might notice that sales dip in February, but did you notice that customers who buy Product A in their first order are 3x more likely to buy Product C within 60 days?</p>
  <p class="section-text">AI can hold an entire dataset in view simultaneously and spot relationships across thousands of data points. This is where AI analysis goes from convenient to genuinely powerful.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Three Types</span>
  <h2 class="section-title">Trends, Outliers, and Correlations</h2>
  <p class="section-text"><strong>Trends</strong> are directional patterns over time. Revenue is growing 5% month-over-month. Customer support tickets increase every Monday. Your email open rate has been declining since September.</p>
  <p class="section-text"><strong>Outliers</strong> are data points that don't fit the pattern. One customer spent 20x the average. One day had zero traffic when every other day had thousands. Outliers are either errors or the most interesting data points you have.</p>
  <p class="section-text"><strong>Correlations</strong> are relationships between variables. When ad spend goes up, conversions go up. When temperature drops, hot chocolate sales rise. Correlation doesn't mean causation — but it always means investigation.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Going Deeper</span>
  <h2 class="section-title">Ask "Why," Not Just "What"</h2>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg);">
    <p><strong>Surface-level prompt:</strong> "Find patterns in this sales data."</p>
    <p><strong>Deeper prompt:</strong> "Find patterns in this sales data. For each pattern you identify, suggest 2-3 possible explanations for why it exists, and tell me what additional data I'd need to confirm each explanation."</p>
    <p style="color: var(--dim);">The second prompt turns pattern detection into genuine business intelligence.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--red);">Critical Warning</span>
  <h2 class="section-title">The Correlation Trap</h2>
  <p class="section-text">Ice cream sales and drowning deaths both increase in summer. That doesn't mean ice cream causes drowning. Both are caused by heat. This is the correlation-causation trap, and AI can accidentally reinforce it if you're not careful.</p>
  <p class="section-text">Always ask AI: <strong>"Could there be a confounding variable here?"</strong> and <strong>"What would I need to prove this is causal, not just correlated?"</strong> This habit separates people who find patterns from people who find truth.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Advanced Move</span>
  <h2 class="section-title">Segmented Pattern Analysis</h2>
  <p class="section-text">Overall averages lie. Your "average customer" might not exist. Ask AI to break patterns down by segments: by region, by customer type, by time period, by product.</p>
  <p class="section-text">A flat overall trend might actually be two segments moving in opposite directions — one growing fast, one declining. That insight changes everything about your next decision.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Upload a dataset with at least 3 columns and 50+ rows. Ask Claude to go hunting:</p>
  <div class="prompt-box"><code>Analyze this data for: 1) Time-based trends, 2) Statistical outliers with possible explanations, 3) Correlations between any columns. For each finding, rate your confidence (high/medium/low) and explain what could be causing it.</code></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-for-data-analysis/05-cleaning-messy-data/">← Previous: Cleaning Messy Data</a>
  <a href="/academy/ai-for-data-analysis/07-survey-and-feedback-analysis/">Next: Survey and Feedback Analysis →</a>
</nav>

</div>
