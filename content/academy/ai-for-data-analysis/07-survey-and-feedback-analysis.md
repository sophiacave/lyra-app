---
title: "Survey and Feedback Analysis"
course: "ai-for-data-analysis"
order: 7
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-data-analysis/">← AI for Data Analysis</a>
  <span class="badge" style="background: var(--green);">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Survey and Feedback Analysis</h1>
  <p><span class="accent">Analyzing qualitative data</span> — turning words into insights</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Why qualitative data is the hardest to analyze manually</li>
    <li>Sentiment analysis, theme extraction, and categorization</li>
    <li>Handling open-ended survey responses at scale</li>
    <li>Combining qualitative findings with quantitative data</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">The Challenge</span>
  <h2 class="section-title">Words Don't Fit in Pivot Tables</h2>
  <p class="section-text">Numbers are easy to aggregate. Words aren't. When you have 500 open-ended survey responses, you can't just calculate an average. You have to read every single one, identify themes, and somehow quantify something that's inherently qualitative.</p>
  <p class="section-text">This used to take days. With AI, it takes minutes. And the results are often more thorough than manual analysis because AI doesn't get tired on response number 347.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Core Techniques</span>
  <h2 class="section-title">Three Ways AI Reads Text Data</h2>
  <p class="section-text"><strong>Sentiment analysis:</strong> AI classifies each response as positive, negative, neutral, or mixed. It can also score intensity — "great service" is positive, but "absolutely life-changing service" is significantly more positive.</p>
  <p class="section-text"><strong>Theme extraction:</strong> AI reads all responses and groups them into themes that emerge naturally. You don't need to predefine categories — AI identifies them from the data itself.</p>
  <p class="section-text"><strong>Categorization:</strong> When you do have predefined categories, AI can sort hundreds of responses into your buckets faster than any human could.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Real Workflow</span>
  <h2 class="section-title">Processing Survey Responses</h2>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg);">
    <p><strong>Scenario:</strong> You have 200 customer feedback responses from a post-purchase survey.</p>
    <p><strong>Step 1:</strong> "Read all these responses. Identify the top 5 themes, with the percentage of responses that mention each theme."</p>
    <p><strong>Step 2:</strong> "For each theme, give me 3 representative quotes — one positive, one negative, one constructive."</p>
    <p><strong>Step 3:</strong> "Cross-reference: do customers who rated us 4-5 stars mention different themes than those who rated 1-2 stars?"</p>
    <p style="color: var(--dim);">Three prompts. Five minutes. You now have a complete qualitative analysis with supporting evidence.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Power Move</span>
  <h2 class="section-title">Mixing Qual and Quant</h2>
  <p class="section-text">The real magic happens when you combine qualitative feedback with quantitative data. Numbers tell you what happened. Words tell you why.</p>
  <p class="section-text">If your data shows a churn spike in Q3, customer feedback from Q3 churners might reveal the reason: a pricing change, a feature removal, or a competitor launch. Ask AI to connect these dots.</p>
  <p class="section-text"><strong>Try this prompt pattern:</strong> "My quantitative data shows [pattern]. Here are the open-ended responses from the same time period. What do the qualitative responses reveal about why this pattern occurred?"</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--red);">Watch Out</span>
  <h2 class="section-title">Bias in Feedback Data</h2>
  <p class="section-text">Remember: people who leave feedback are not a random sample. Angry customers and delighted customers respond. The quiet middle usually doesn't. Ask AI to flag this limitation in its analysis so you don't over-index on extreme sentiments.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Collect text feedback from any source — app reviews, survey responses, even social media comments. Paste them in and try:</p>
  <div class="prompt-box"><code>Here are [N] pieces of customer feedback. Please: 1) Identify the top themes with percentage breakdown, 2) Score overall sentiment, 3) Find the 3 most actionable pieces of feedback — things we could realistically improve based on what people are saying.</code></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-for-data-analysis/06-pattern-recognition/">← Previous: Pattern Recognition</a>
  <a href="/academy/ai-for-data-analysis/08-financial-data-analysis/">Next: Financial Data Analysis →</a>
</nav>

</div>
