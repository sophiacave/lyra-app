---
title: "Error Handling"
course: "first-ai-agent"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 8 of 10</div>
  <h1>Error Handling</h1>
  <p class="subtitle">Agents fail. Good agents fail gracefully. For each scenario, pick the best recovery strategy.</p>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You now know the 5 most common agent failure modes and how to handle each one. Resilient agents are deployable agents.</p>
  </div>


  <div data-learn="QuizMC" data-props='{"title":"Error Recovery Strategies","questions":[{"q":"Your agent calls a weather API and gets a 503 Service Unavailable error after 3 retries. What is the best response?","options":["Tell the user I cannot help with that and stop","Retry the same API call 100 times until it works","Try an alternative tool (web search for weather) and explain the fallback to the user","Ignore the error and make up a weather forecast"],"correct":2,"explanation":"Graceful degradation: adapt to failure by trying alternative paths while keeping the user informed. Hammering a failing service wastes time and can trigger rate limiting. Only escalate if all fallbacks fail."},{"q":"Your agent queries a database and gets back negative spending amounts and dates from the future. What should it do?","options":["Use the data anyway — the database is the source of truth","Flag the anomaly, refuse to present invalid data, and suggest the user check the data source","Silently fix the data by removing the negative sign and adjusting the date","Ask the user what the correct values should be"],"correct":1,"explanation":"Agents should validate data before presenting it. When validation fails, honesty about the problem and pointing toward the root cause is the right call. Silently altering data hides real bugs."},{"q":"A user says: do the thing with the stuff from last time. The agent has no context. Confidence is 12%. What should it do?","options":["Guess based on common requests and execute","Ask a specific clarifying question listing exactly what information is needed","Reply I do not understand and wait","Pick the most recent action from memory and repeat it"],"correct":1,"explanation":"Asking for clarification is intelligence, not weakness. Good agents know the boundary between confident action and dangerous guessing. The question should be specific to guide the user toward a clear request."},{"q":"After 48 attempts to fix a failing test with zero progress, what should the agent do?","options":["Keep trying — the 49th attempt might work","Stop, summarize what was tried and what failed, escalate to a human with full context","Delete the test file so the test cannot fail anymore","Switch to a different programming language"],"correct":1,"explanation":"A good agent knows when to stop. After repeated failures with no progress, the most valuable action is a detailed handoff to a human — summarizing attempts so they do not start from scratch."},{"q":"A user asks the agent to send a confidential document to all 342 people in the company, but guardrails restrict confidential docs to authorized recipients. What should the agent do?","options":["Override the guardrail — the user explicitly asked for it","Silently send it only to authorized recipients without telling the user","Explain the conflict, refuse the unsafe action, and suggest a safe alternative","Send it to everyone and log a warning"],"correct":2,"explanation":"Guardrails exist for safety. The agent should respect them while being helpful — explain why it cannot comply and offer a path forward, such as sending only to the authorized list or requesting admin override."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Error Handling Patterns","cards":[{"front":"What is graceful degradation?","back":"When a tool fails, try alternative approaches before escalating. The agent adapts instead of giving up or crashing."},{"front":"What is a circuit breaker?","back":"A pattern that stops retrying after a set number of failed attempts, preventing wasted resources and service overload."},{"front":"When should an agent ask for clarification?","back":"When confidence in the intended action is too low to act safely — typically below 30-40%. A specific question beats a wrong action."},{"front":"What should an agent do with clearly invalid data?","back":"Refuse to use it, flag the anomaly to the user, and point toward the likely root cause. Never silently correct or present bad data."},{"front":"What makes a good human escalation?","back":"A summary of what was attempted, what failed, relevant error messages, and the last known good state — so the human can pick up without starting over."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Tool Failure Recovery Order","instruction":"Arrange these steps in the correct order for handling a tool failure","items":["Detect the error and classify it","Try the primary fallback tool","Try a secondary fallback if primary fails","Inform the user with context","Escalate to human only if all options exhausted"]}'></div>

</div>
