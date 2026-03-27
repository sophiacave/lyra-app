---
title: "Data Flow Design"
course: "ai-powered-workflows"
order: 4
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-powered-workflows/">← Back to Course</a>
  <span class="badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Data Flow <span class="accent">Design</span></h1>
  <p class="subtitle">Data is the lifeblood of every workflow. Learn to move it cleanly.</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How data moves between workflow steps</li>
    <li>Transforming data formats without losing information</li>
    <li>The pass-through pattern and the accumulator pattern</li>
    <li>Avoiding the #1 data flow mistake</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Foundation</span>
  <h2 class="section-title">Data In, Data Out, Data Between</h2>
  <p class="section-text">Your trigger fires and brings data with it — a form submission, a new row in a spreadsheet, a webhook payload. That data needs to flow through every step of your workflow, sometimes unchanged, sometimes transformed. Getting this flow right is the difference between a workflow that works and one that breaks at 2am.</p>
  <p class="section-text">Think of data flow like plumbing. Each step is a valve that receives water, does something with it, and sends it on. If the pipes don't match, you get leaks.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Patterns</span>
  <h2 class="section-title">Two Essential Data Flow Patterns</h2>

  <div class="demo-container">
    <p><strong style="color: var(--blue);">Pass-Through:</strong> Data enters Step A and flows unchanged to Step B. Example: a customer email address from a signup form gets passed directly to your email platform. No transformation needed — just routing.</p>
    <p><strong style="color: var(--purple);">Accumulator:</strong> Each step adds new data to the payload. Step 1 gets the customer name. Step 2 looks up their order history. Step 3 combines both into a personalized message. The data grows richer at each stage.</p>
  </div>

  <p class="section-text">Most real workflows use both patterns together. Some data passes through untouched while new data accumulates alongside it.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Transformation</span>
  <h2 class="section-title">When Data Needs to Change Shape</h2>
  <p class="section-text">Your CRM stores dates as "March 27, 2026." Your database expects "2026-03-27." Your email template wants "Thursday, March 27th." Same information, three formats. Data transformation handles these conversions so each tool gets data in the shape it expects.</p>
  <p class="section-text">AI adds a powerful layer here. Instead of writing rigid transformation rules, you can use AI to interpret messy, inconsistent data and normalize it. A customer writes "next Tuesday" in a form — AI converts that to an actual date. That's a transformation no simple rule could handle.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Common Mistakes</span>
  <h2 class="section-title">The #1 Data Flow Killer</h2>
  <p class="section-text">Losing data between steps. It happens when you don't explicitly pass a field from one step to the next, and by step 5 you need the customer's email from step 1 but it's gone. The fix is simple: at each step, be explicit about what data you're receiving, what you're adding, and what you're sending forward. Never assume data will "just be there."</p>
  <p class="section-text">A good practice: name your data clearly at every stage. Not "field1" — "customer_email." Not "value" — "total_order_amount." Future you will be grateful.</p>
</div>

<div class="try-it-box">
  <h3>Try It Now</h3>
  <p>Map the data flow for your workflow from the previous lessons.</p>
  <div class="prompt-box">
    <code>For each step in your workflow, write: INPUT DATA [list fields] → ACTION → OUTPUT DATA [list fields, including any new ones added]. Circle any field that needs format transformation.</code>
  </div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-powered-workflows/03-trigger-based-workflows/" class="prev">← Previous: Trigger-Based Workflows</a>
  <a href="/academy/ai-powered-workflows/05-error-handling-and-fallbacks/" class="next">Next: Error Handling and Fallbacks →</a>
</nav>

</div>
