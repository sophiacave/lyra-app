---
title: "Error Handling"
course: "first-ai-agent"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/first-ai-agent/">First AI Agent</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Error Handling</h1>
  <p class="sub">Agents fail. Good agents fail gracefully. Here are the five most common failure modes, how to detect them, and production code patterns to handle each one.</p>
</div>

  <div class="section">
    <h2>The Five Failure Modes</h2>
    <p>Every agent you build will encounter these failures. Learning them now means you design for resilience from day one.</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">1. Tool Failure</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">An API returns 500, a database query times out, a service is down. The tool call fails but the agent should not crash.</p>
        <p style="font-size:.8rem;color:#71717a;margin:.3rem 0 0"><em>Example: Weather API returns 503 Service Unavailable after your agent promised to check the forecast.</em></p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">2. Invalid Data</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The tool returns data, but it is wrong — negative prices, dates in the future, missing required fields. The agent must detect and handle corrupt data.</p>
        <p style="font-size:.8rem;color:#71717a;margin:.3rem 0 0"><em>Example: Database returns a customer balance of -$50,000. That is a data bug, not real debt.</em></p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">3. Ambiguous Input</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The user's request is too vague to act on safely. "Do the thing from last time" when there is no context. Acting on low confidence causes more damage than asking for clarity.</p>
        <p style="font-size:.8rem;color:#71717a;margin:.3rem 0 0"><em>Example: "Fix the issue" — which issue? In which system? What counts as fixed?</em></p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">4. Guardrail Violation</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The user requests something the agent is explicitly forbidden from doing. The agent must refuse while remaining helpful.</p>
        <p style="font-size:.8rem;color:#71717a;margin:.3rem 0 0"><em>Example: "Send this confidential report to all 500 employees" when guardrails restrict confidential docs.</em></p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(96,165,250,.04);border:1px solid rgba(96,165,250,.1)">
        <strong style="color:#60a5fa">5. Stuck Loop</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The agent keeps retrying the same failed approach without making progress. 48 attempts at the same fix with zero improvement.</p>
        <p style="font-size:.8rem;color:#71717a;margin:.3rem 0 0"><em>Example: Agent tries to fix a failing test by changing the same line of code, failing each time.</em></p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 1: Retry with Exponential Backoff</h2>
    <p>For transient failures (network errors, rate limits, temporary outages), retry with increasing wait times:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">import</span> <span style="color:#e2e8f0">time</span><br>
      <br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">retry_with_backoff</span>(<span style="color:#e2e8f0">func</span>, <span style="color:#e2e8f0">max_retries</span>=<span style="color:#fb923c">3</span>):<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"""Retry a function with exponential backoff: 1s, 2s, 4s"""</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">for</span> <span style="color:#e2e8f0">attempt</span> <span style="color:#c084fc">in</span> <span style="color:#34d399">range</span>(<span style="color:#e2e8f0">max_retries</span>):<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">try</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#34d399">func</span>()<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">except</span> <span style="color:#e2e8f0">Exception</span> <span style="color:#c084fc">as</span> <span style="color:#e2e8f0">e</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">attempt</span> == <span style="color:#e2e8f0">max_retries</span> - <span style="color:#fb923c">1</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">raise</span>&nbsp;&nbsp;<span style="color:#71717a"># Last attempt — let it fail</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">wait</span> = <span style="color:#fb923c">2</span> ** <span style="color:#e2e8f0">attempt</span>&nbsp;&nbsp;<span style="color:#71717a"># 1s, 2s, 4s</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Retry {attempt + 1}/{max_retries} in {wait}s: {e}"</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">time</span>.<span style="color:#34d399">sleep</span>(<span style="color:#e2e8f0">wait</span>)<br>
      <br>
      <span style="color:#71717a"># Usage in your agent</span><br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">execute_tool_safe</span>(<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">params</span>):<br>
      &nbsp;&nbsp;<span style="color:#c084fc">try</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#34d399">retry_with_backoff</span>(<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">lambda</span>: <span style="color:#34d399">execute_tool</span>(<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">params</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;)<br>
      &nbsp;&nbsp;<span style="color:#c084fc">except</span> <span style="color:#e2e8f0">Exception</span> <span style="color:#c084fc">as</span> <span style="color:#e2e8f0">e</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># All retries exhausted — return error to Claude</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> {<span style="color:#fb923c">"error"</span>: <span style="color:#c084fc">str</span>(<span style="color:#e2e8f0">e</span>), <span style="color:#fb923c">"tool"</span>: <span style="color:#e2e8f0">name</span>}
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);margin:1rem 0">
      <strong style="color:#fb923c;font-size:.85rem">Why exponential backoff?</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">If a service is overloaded, hammering it with rapid retries makes the problem worse. Exponential backoff (1s, 2s, 4s) gives the service progressively more time to recover while still attempting the call.</p>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 2: Graceful Degradation</h2>
    <p>When the primary tool fails, fall back to an alternative instead of giving up:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">def</span> <span style="color:#34d399">get_weather</span>(<span style="color:#e2e8f0">location</span>):<br>
      &nbsp;&nbsp;<span style="color:#71717a"># Try primary API</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">try</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#34d399">retry_with_backoff</span>(<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">lambda</span>: <span style="color:#e2e8f0">weather_api</span>.<span style="color:#34d399">get</span>(<span style="color:#e2e8f0">location</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;)<br>
      &nbsp;&nbsp;<span style="color:#c084fc">except</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">pass</span><br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a"># Fallback: try web search</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">try</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">web_search</span>.<span style="color:#34d399">query</span>(<span style="color:#fb923c">f"weather in {location} today"</span>)<br>
      &nbsp;&nbsp;<span style="color:#c084fc">except</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">pass</span><br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a"># All fallbacks exhausted</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"error"</span>: <span style="color:#fb923c">"Weather data unavailable"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"tried"</span>: [<span style="color:#fb923c">"weather_api"</span>, <span style="color:#fb923c">"web_search"</span>],<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"suggestion"</span>: <span style="color:#fb923c">"Try again in a few minutes"</span><br>
      &nbsp;&nbsp;}
    </div>
  </div>

  <div class="section">
    <h2>Pattern 3: Data Validation</h2>
    <p>Never trust tool results blindly. Validate before acting:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">def</span> <span style="color:#34d399">validate_customer_data</span>(<span style="color:#e2e8f0">data</span>):<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"""Validate tool results before passing to Claude"""</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">issues</span> = []<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">data</span>.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"balance"</span>, <span style="color:#fb923c">0</span>) < -<span style="color:#fb923c">10000</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">issues</span>.<span style="color:#34d399">append</span>(<span style="color:#fb923c">"Suspicious negative balance"</span>)<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">data</span>.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"created_at"</span>, <span style="color:#fb923c">""</span>) > <span style="color:#e2e8f0">datetime</span>.<span style="color:#34d399">now</span>().<span style="color:#34d399">isoformat</span>():<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">issues</span>.<span style="color:#34d399">append</span>(<span style="color:#fb923c">"Date is in the future"</span>)<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">issues</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"data"</span>: <span style="color:#e2e8f0">data</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"warning"</span>: <span style="color:#fb923c">"Data anomalies detected"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"issues"</span>: <span style="color:#e2e8f0">issues</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"recommendation"</span>: <span style="color:#fb923c">"Flag to user before acting"</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">data</span>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 4: Human Escalation</h2>
    <p>When all automated recovery fails, escalate to a human with full context — so they do not start from scratch:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">def</span> <span style="color:#34d399">escalate_to_human</span>(<span style="color:#e2e8f0">task</span>, <span style="color:#e2e8f0">attempts</span>, <span style="color:#e2e8f0">errors</span>):<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"""Create a detailed handoff when the agent cannot resolve"""</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"status"</span>: <span style="color:#fb923c">"escalated"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"task"</span>: <span style="color:#e2e8f0">task</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"attempts_made"</span>: <span style="color:#e2e8f0">attempts</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"errors_encountered"</span>: <span style="color:#e2e8f0">errors</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"last_good_state"</span>: <span style="color:#fb923c">"Customer identified, plan confirmed"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"remaining_work"</span>: <span style="color:#fb923c">"Refund processing failed — needs manual billing system access"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"context"</span>: <span style="color:#fb923c">"Full conversation + tool results attached"</span><br>
      &nbsp;&nbsp;}
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);margin:1rem 0">
      <strong style="color:#34d399;font-size:.85rem">A good escalation saves the human 90% of the work</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Include: what was tried, what failed, what the last known good state was, and exactly what remains. The human picks up where the agent left off instead of restarting from zero.</p>
    </div>
  </div>

  <div class="section">
    <h2>The Error Handling Decision Tree</h2>
    <p>When your agent encounters an error, follow this decision tree:</p>

    <div style="display:flex;flex-direction:column;gap:.3rem;margin:1rem 0">
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#8b5cf6;font-weight:700;min-width:20px">1.</span> Is this a transient error (timeout, rate limit, 503)? &rarr; <strong style="color:#34d399">Retry with backoff</strong>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#8b5cf6;font-weight:700;min-width:20px">2.</span> Retries exhausted? &rarr; <strong style="color:#fb923c">Try alternative tool (graceful degradation)</strong>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#8b5cf6;font-weight:700;min-width:20px">3.</span> No alternative tool available? &rarr; <strong style="color:#fb923c">Return error to Claude (let it adapt)</strong>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#8b5cf6;font-weight:700;min-width:20px">4.</span> Claude cannot adapt? &rarr; <strong style="color:#ef4444">Escalate to human with full context</strong>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#8b5cf6;font-weight:700;min-width:20px">5.</span> Guardrail violation? &rarr; <strong style="color:#ef4444">Refuse + explain + suggest alternative</strong>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Anti-Pattern: What NOT to Do</h2>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Retry 100 times</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — If 3 retries fail, 97 more will not help. You are hammering a dead service and wasting money on API calls. Use a circuit breaker (max 3 retries, then stop).</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Silently fix bad data</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Removing a negative sign from a balance hides a real bug. The agent should flag anomalies, not mask them. Present the data issue honestly.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Crash silently</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — An unhandled exception kills the agent with no feedback. Always wrap tool calls in try/catch and return meaningful error messages.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Override guardrails</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — "The user asked for it" is not a valid reason to bypass safety constraints. Guardrails exist to prevent harm. Explain the constraint and offer a safe alternative.</span>
      </div>
    </div>
  </div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Error Handling Patterns","cards":[{"front":"Exponential backoff","back":"Retry with increasing wait times: 1s, 2s, 4s. Gives a struggling service time to recover without hammering it. Standard max: 3 retries."},{"front":"Graceful degradation","back":"When the primary tool fails, fall back to an alternative tool instead of giving up. Example: weather API fails → try web search → if both fail, tell the user."},{"front":"Circuit breaker","back":"Stop retrying after a set number of failures. Prevents wasting resources on a dead service. If 3 retries fail, 97 more will not help."},{"front":"Data validation","back":"Check tool results for anomalies before passing to Claude. Negative balances, future dates, missing fields — flag these instead of presenting bad data as truth."},{"front":"Human escalation","back":"When all automated recovery fails: summarize what was tried, what failed, the last known good state, and what remains. The human picks up where the agent left off."},{"front":"Why not retry 100 times?","back":"If 3 retries with backoff fail, the service is genuinely down. More retries waste API credits, delay the user, and can overload the struggling service further."},{"front":"Returning errors to Claude","back":"When a tool fails, return the error as the tool_result content. Claude sees the failure and can adapt — trying a different tool, asking the user, or explaining the limitation."},{"front":"Guardrail violation handling","back":"Never override safety constraints. Explain what was requested, why it cannot be done, and offer a safe alternative. The agent refuses the unsafe action while remaining helpful."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Error Recovery Strategies","questions":[{"q":"Your agent calls a weather API and gets a 503 Service Unavailable error after 3 retries. What is the best response?","options":["Tell the user you cannot help and stop","Retry the same API call 100 times until it works","Try an alternative tool (web search for weather) and explain the fallback to the user","Ignore the error and make up a weather forecast"],"correct":2,"explanation":"Graceful degradation: adapt to failure by trying alternative paths while keeping the user informed. Hammering a failing service wastes time and can trigger rate limiting."},{"q":"Your agent queries a database and gets negative spending amounts and dates from the future. What should it do?","options":["Use the data anyway","Flag the anomaly, refuse to present invalid data, and suggest the user check the data source","Silently fix the data by removing the negative sign and adjusting the date","Ask the user what the correct values should be"],"correct":1,"explanation":"Agents should validate data before presenting it. When validation fails, honesty about the problem and pointing toward the root cause is the right call."},{"q":"After 48 attempts to fix a failing test with zero progress, what should the agent do?","options":["Keep trying — the 49th attempt might work","Stop, summarize what was tried and what failed, escalate to a human with full context","Delete the test file so it cannot fail","Switch to a different programming language"],"correct":1,"explanation":"A good agent knows when to stop. After repeated failures with no progress, the most valuable action is a detailed handoff to a human — summarizing attempts so they do not start from scratch."},{"q":"Why is exponential backoff better than immediate retries?","options":["It is faster overall","It gives the failing service time to recover instead of hammering it with rapid requests","It uses less memory","It is required by all APIs"],"correct":1,"explanation":"If a service is overloaded, rapid retries add more load. Exponential backoff (1s, 2s, 4s) gives progressively more recovery time while still attempting the call."},{"q":"A user asks the agent to send a confidential document to all employees, but guardrails restrict confidential docs. What should the agent do?","options":["Override the guardrail because the user explicitly asked","Send it only to authorized recipients without telling the user","Explain the conflict, refuse the unsafe action, and suggest a safe alternative","Send it to everyone and log a warning"],"correct":2,"explanation":"Guardrails exist for safety. The agent should respect them while being helpful — explain why it cannot comply and offer a path forward."}]}'></div>
