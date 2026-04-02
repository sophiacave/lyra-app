---
title: "Risk Assessment"
course: "ai-project-management"
order: 5
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-project-management/">← AI Project Management</a>
  <span class="badge" style="background: var(--orange);">Lesson 5 of 10</span>
</nav>

<div class="lesson-hero">
  <h1><span class="accent">Risk Assessment</span> with AI</h1>
  <p class="subtitle">Identify what could go wrong before it does — and build mitigation plans that actually hold.</p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>Using AI to surface risks you haven't considered</li>
    <li>Building risk registers with probability, impact, and mitigation</li>
    <li>Ongoing risk monitoring with AI as your early warning system</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--orange);">The Blindspot</span>
  <h2 class="section-title">You Can't Mitigate What You Can't See</h2>
  <p class="section-text">Most project risks aren't exotic. They're obvious in hindsight — a key person going on leave, a vendor missing a deadline, a requirement that was never properly defined. The problem isn't that risks are invisible. It's that we're too busy executing to step back and look for them.</p>
  <p class="section-text">AI doesn't have that problem. It can analyze your project plan, your team structure, your timeline, and your dependencies — and systematically surface risks based on patterns from thousands of similar projects.</p>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--purple);">The Framework</span>
  <h2 class="section-title">AI-Powered Risk Registers</h2>
  <p class="section-text">A risk register isn't just a list of scary things. Each risk needs: a description, a probability rating, an impact rating, an owner, a mitigation strategy, and a trigger indicator. That's a lot of thinking per risk. AI does the first draft in seconds.</p>
  <p class="section-text">Feed AI your project plan and ask for a risk register. It'll generate 15-20 risks across categories — technical, resource, schedule, scope, external. You filter to the ones that actually apply, adjust the ratings based on your knowledge, and you have a living document in 15 minutes instead of never.</p>
</div>

<div class="demo-container">
  <h3>Risk Register Entry Example</h3>
  <p>AI-generated from a mobile app launch project:</p>
  <ul>
    <li><strong>Risk:</strong> App store review rejection delays launch</li>
    <li><strong>Probability:</strong> Medium (40%)</li>
    <li><strong>Impact:</strong> High — 1-2 week delay to public launch</li>
    <li><strong>Mitigation:</strong> Submit for review 2 weeks before target launch. Prepare expedited review request. Have web fallback ready.</li>
    <li><strong>Trigger:</strong> Review submission receives "needs changes" response</li>
    <li><strong>Owner:</strong> Mobile lead</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--green);">Living Risks</span>
  <h2 class="section-title">Ongoing Monitoring</h2>
  <p class="section-text">A risk register created in week one and never updated is decoration. Each week, feed AI your status update along with the risk register. Ask: "Based on this week's progress, which risks have changed in probability or impact? Are there new risks? Which risks can be retired?"</p>
  <p class="section-text">This takes five minutes and keeps your risk management alive. When something does go wrong, you'll already have the mitigation plan ready because you've been watching it evolve.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Describe your current project to AI and ask for a comprehensive risk assessment:</p>
  <div class="prompt-box"><code>Here's my project: [describe project, team, timeline, key dependencies]. Generate a risk register with 10-15 risks. For each risk, provide: Description, Category (technical/resource/schedule/scope/external), Probability (low/medium/high with percentage), Impact (low/medium/high with consequence), Mitigation strategy, Trigger indicator, and suggested Owner role. Rank them by combined probability-impact score.</code></div>
  <p>Compare this against risks you already knew about. The ones you didn't think of — those are the ones that would have bitten you.</p>
</div>

<div class="lesson-section">
</div>

<div class="lesson-section">
  <span class="section-label" style="color: var(--blue);">Pro Tip</span>
  <h2 class="section-title">Pre-Mortem Power</h2>
  <p class="section-text">Try a "pre-mortem" with AI: "Imagine this project failed spectacularly. What went wrong?" This reframes risk identification from defensive to creative. AI generates surprisingly insightful failure scenarios that make your real risk register much stronger.</p>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"Risk Assessment — Key Concepts","cards":[{"front":"Risk Register","back":"Each risk needs: description, probability rating, impact rating, owner, mitigation strategy, and trigger indicator. AI drafts all six fields for 15-20 risks across technical, resource, schedule, scope, and external categories."},{"front":"Three-Point Risk Rating","back":"Rate each risk by Probability (low/medium/high with percentage) x Impact (low/medium/high with consequence). Ranking by combined score shows you where to focus mitigation effort first."},{"front":"Trigger Indicator","back":"The early warning sign that a risk is becoming reality. E.g., ‘review submission receives needs changes response.’ Having triggers defined means you respond proactively instead of reactively."},{"front":"Living Risk Register","back":"Feed AI your weekly status update alongside the risk register. Ask: which risks changed in probability or impact? Are there new risks? Which can be retired? Five minutes per week keeps risk management alive."},{"front":"Pre-Mortem Technique","back":"Ask AI: ‘Imagine this project failed spectacularly. What went wrong?’ Reframes risk identification from defensive to creative and surfaces failure scenarios you wouldn’t catch with standard analysis."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Risk Assessment Quiz","questions":[{"q":"Why does AI surface project risks that PMs often miss?","options":["AI has access to real-time industry data about project failures","AI analyzes your plan systematically based on patterns from thousands of similar projects, without the distraction of day-to-day execution","AI uses a standardized risk taxonomy that PMs don’t follow","AI monitors team communications for risk signals automatically"],"correct":1,"explanation":"Most project risks are obvious in hindsight — key person on leave, vendor missing a deadline, undefined requirement. The problem isn’t that risks are invisible. It’s that we’re too busy executing to step back and look. AI doesn’t have that problem."},{"q":"What are the six fields every risk register entry should contain?","options":["Risk name, date identified, reporter, status, notes, resolution","Description, probability, impact, owner, mitigation strategy, and trigger indicator","Category, likelihood, severity, escalation path, budget impact, timeline impact","Risk ID, description, affected phase, team member, cost estimate, deadline"],"correct":1,"explanation":"A complete risk register entry needs: description of the risk, probability rating, impact rating, owner responsible for monitoring it, mitigation strategy to prevent or reduce it, and a trigger indicator — the early warning sign that the risk is becoming real."},{"q":"What is the pre-mortem technique and why is it effective for risk identification?","options":["Reviewing previous project post-mortems for similar risk patterns","Asking AI to imagine the project failed spectacularly and describe what went wrong — reframes risk identification from defensive to creative","Running a formal risk workshop before project kickoff","Analyzing the critical path for single points of failure"],"correct":1,"explanation":"Pre-mortem reframes risk thinking. Instead of ‘what might go wrong?’ (defensive, limited imagination), you ask ‘it failed — what happened?’ (creative, specific). AI generates surprisingly insightful failure scenarios that make your real risk register much stronger."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-project-management/04-status-reports-and-updates/" class="prev">← Previous: Status Reports & Updates</a>
  <a href="/academy/ai-project-management/06-resource-allocation/" class="next">Next: Resource Allocation →</a>
</nav>

</div>
