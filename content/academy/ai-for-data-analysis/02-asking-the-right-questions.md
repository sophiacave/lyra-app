---
title: "Asking the Right Questions"
course: "ai-for-data-analysis"
order: 2
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-data-analysis/">← AI for Data Analysis</a>
  <span class="badge" style="background: var(--purple);">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Asking the Right Questions</h1>
  <p><span class="accent">Framing data questions</span> so AI gives you real answers</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Why vague questions produce vague answers</li>
    <li>The SCOPE framework for data questions</li>
    <li>How to chain questions for deeper insight</li>
    <li>Common question mistakes and how to fix them</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">The Problem</span>
  <h2 class="section-title">Garbage In, Garbage Out</h2>
  <p class="section-text">The number one reason people get disappointing results from AI data analysis? Their questions are too vague. "Analyze this data" is like telling a chef "make food." You'll get something, but it probably won't be what you wanted.</p>
  <p class="section-text">AI is incredibly capable, but it needs direction. The more specific your question, the more specific — and useful — the answer.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">Framework</span>
  <h2 class="section-title">The SCOPE Method</h2>
  <p class="section-text">Use SCOPE to frame every data question you ask AI:</p>
  <p class="section-text"><strong>S — Specific:</strong> What exactly do you want to know? Not "how are sales" but "which product category grew fastest in Q3."</p>
  <p class="section-text"><strong>C — Context:</strong> What does AI need to know about this data? Industry, time period, what the columns mean.</p>
  <p class="section-text"><strong>O — Output:</strong> What format do you want? A summary, a table, a list of recommendations, a comparison?</p>
  <p class="section-text"><strong>P — Perspective:</strong> Who is this analysis for? Your boss, your team, yourself? This shapes the depth and language.</p>
  <p class="section-text"><strong>E — Edge cases:</strong> Are there things AI should watch for? Outliers to ignore? Special circumstances?</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Before & After</span>
  <h2 class="section-title">Transforming Weak Questions</h2>

  <div class="demo-container" style="border-left: 3px solid var(--red); padding: 1rem; background: var(--bg); margin-bottom: 1rem;">
    <p><strong style="color: var(--red);">Weak:</strong> "What do you see in this data?"</p>
    <p style="color: var(--dim);">Too open-ended. AI will give you a generic summary.</p>
  </div>

  <div class="demo-container" style="border-left: 3px solid var(--green); padding: 1rem; background: var(--bg);">
    <p><strong style="color: var(--green);">Strong:</strong> "This is 6 months of email campaign data. Compare open rates across the 4 campaign types. Which type consistently outperforms? Are there any months where the pattern breaks, and why might that be?"</p>
    <p style="color: var(--dim);">Specific, contextual, asks for comparison AND explanation.</p>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Power Move</span>
  <h2 class="section-title">Question Chaining</h2>
  <p class="section-text">The best analysts don't ask one question — they chain them. Start broad, then drill down based on what you find.</p>
  <p class="section-text"><strong>Round 1:</strong> "Summarize the key trends in this customer data."</p>
  <p class="section-text"><strong>Round 2:</strong> "You mentioned churn spikes in March. Break down the March churners by plan type and tenure."</p>
  <p class="section-text"><strong>Round 3:</strong> "For the monthly-plan customers who churned in March, what was their average usage in the 30 days before cancellation?"</p>
  <p class="section-text">Each question builds on the last. By round 3, you've found something genuinely actionable.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Take the same dataset from Lesson 1. This time, use the SCOPE method to write three increasingly specific questions. Feed them to Claude one at a time and watch how the insights deepen.</p>
  <div class="prompt-box"><code>I have [describe data, time period, what columns mean]. I need to understand [specific question]. Please present the answer as [format] and flag any unusual patterns. This is for [audience].</code></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-for-data-analysis/01-data-analysis-meets-ai/">← Previous: Data Analysis Meets AI</a>
  <a href="/academy/ai-for-data-analysis/03-spreadsheet-analysis/">Next: Spreadsheet Analysis →</a>
</nav>

</div>
