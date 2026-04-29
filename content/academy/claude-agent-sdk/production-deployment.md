---
title: "Production Deployment"
course: "claude-agent-sdk"
order: 10
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Production Deployment</h1>
  <p class="sub">Architecture patterns, error handling, cost tracking, and monitoring for real agent products</p>
</div>

<div class="content">

<div class="card">
<h2>From Prototype to Production</h2>
<p>Building an agent that works on your laptop is lesson 2. Shipping an agent that serves real users, handles failures gracefully, stays within budget, and runs 24/7 — that is this lesson. Production agents need infrastructure that prototypes do not: error recovery, cost tracking, graceful shutdowns, monitoring, and operational runbooks.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> A prototype is a food truck. Production is a restaurant. Both serve food, but the restaurant needs a kitchen that can handle the dinner rush, health inspections, supply chain management, and a plan for when the oven breaks at 7 PM on a Friday.
</div>
</div>

<div class="card">
<h2>Error Handling Architecture</h2>
<p>In production, everything fails. APIs time out, rate limits kick in, tools crash, and network connections drop. Your agent needs to handle every failure mode gracefully:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — production error handling</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude, AgentError, BudgetExceededError } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">async function</span> <span style="color:#38bdf8">runAgentSafely</span>(prompt: string) {
  <span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
    model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    tools: <span style="color:#fbbf24">"defaults"</span>,
    maxBudgetUsd: <span style="color:#fb923c">2.00</span>,
    maxTurns: <span style="color:#fb923c">25</span>,
  });

  <span style="color:#c084fc">try</span> {
    <span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(prompt);
    <span style="color:#c084fc">return</span> {
      success: <span style="color:#fb923c">true</span>,
      text: result.text,
      cost: result.cost,
      toolCalls: result.toolCalls,
    };
  } <span style="color:#c084fc">catch</span> (error) {
    <span style="color:#c084fc">if</span> (error <span style="color:#c084fc">instanceof</span> BudgetExceededError) {
      <span style="color:#71717a">// Agent hit the cost limit — not a crash</span>
      <span style="color:#c084fc">return</span> { success: <span style="color:#fb923c">false</span>, reason: <span style="color:#fbbf24">"budget_exceeded"</span>, spent: error.spent };
    }
    <span style="color:#c084fc">if</span> (error.code === <span style="color:#fbbf24">"rate_limit"</span>) {
      <span style="color:#71717a">// API rate limit — wait and retry</span>
      <span style="color:#c084fc">await</span> sleep(error.retryAfter * <span style="color:#fb923c">1000</span>);
      <span style="color:#c084fc">return</span> runAgentSafely(prompt);  <span style="color:#71717a">// retry once</span>
    }
    <span style="color:#71717a">// Unknown error — log and report</span>
    <span style="color:#34d399">console</span>.error(<span style="color:#fbbf24">"Agent error:"</span>, error);
    <span style="color:#c084fc">return</span> { success: <span style="color:#fb923c">false</span>, reason: <span style="color:#fbbf24">"unknown"</span>, error: error.message };
  }
}</code></pre>
</div>
</div>

<div class="card">
<h2>Abort Controllers</h2>
<p>Long-running agents need a way to be stopped — by users, by timeouts, or by your system. Abort controllers provide clean cancellation:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — abort controller with timeout</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// Create a controller that aborts after 60 seconds</span>
<span style="color:#c084fc">const</span> controller = <span style="color:#c084fc">new</span> AbortController();
<span style="color:#c084fc">const</span> timeout = setTimeout(() => controller.abort(), <span style="color:#fb923c">60_000</span>);

<span style="color:#c084fc">try</span> {
  <span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
    <span style="color:#fbbf24">"Analyze the codebase and generate a report."</span>,
    { signal: controller.signal }  <span style="color:#71717a">// pass the abort signal</span>
  );
  clearTimeout(timeout);
  <span style="color:#34d399">console</span>.log(result.text);
} <span style="color:#c084fc">catch</span> (e) {
  <span style="color:#c084fc">if</span> (e.name === <span style="color:#fbbf24">"AbortError"</span>) {
    <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">"Agent timed out after 60 seconds."</span>);
  }
}</code></pre>
</div>
</div>

<div class="card">
<h2>Cost Tracking and Monitoring</h2>
<p>In production, you need to know exactly how much each agent interaction costs and spot anomalies before they become expensive problems:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — cost tracking with hooks</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> metrics = {
  totalCost: <span style="color:#fb923c">0</span>,
  totalQueries: <span style="color:#fb923c">0</span>,
  totalToolCalls: <span style="color:#fb923c">0</span>,
  errors: <span style="color:#fb923c">0</span>,
};

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
  maxBudgetUsd: <span style="color:#fb923c">5.00</span>,
  hooks: {
    postToolUse: (tool, _params, result) => {
      metrics.totalToolCalls++;
      <span style="color:#c084fc">return</span> result;
    },
  },
});

<span style="color:#71717a">// After each query, update metrics</span>
<span style="color:#c084fc">async function</span> <span style="color:#38bdf8">trackedQuery</span>(prompt: string) {
  <span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(prompt);
  metrics.totalCost += result.cost;
  metrics.totalQueries++;

  <span style="color:#71717a">// Alert if average cost per query is too high</span>
  <span style="color:#c084fc">const</span> avgCost = metrics.totalCost / metrics.totalQueries;
  <span style="color:#c084fc">if</span> (avgCost > <span style="color:#fb923c">0.50</span>) {
    <span style="color:#34d399">console</span>.warn(<span style="color:#fbbf24">`[ALERT] High avg cost: $${avgCost.toFixed(2)}/query`</span>);
  }

  <span style="color:#c084fc">return</span> result;
}</code></pre>
</div>
</div>

<div class="card">
<h2>Production Checklist</h2>
<p>Before deploying any agent to production, verify every item:</p>

<div style="display:grid;gap:.5rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">maxBudgetUsd set to a reasonable limit</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">maxTurns configured to prevent infinite loops</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">PreToolUse hook blocks dangerous operations</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">Error handling for API errors, rate limits, and timeouts</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">Abort controller with timeout for long-running queries</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">Cost tracking and anomaly alerting</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">Audit logging via hooks for compliance</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.82rem;color:#a1a1aa">Adversarial testing completed and guardrails verified</div>
</div>
</div>
</div>

<div class="card">
<h2>What You Have Built</h2>
<p>Over these 10 lessons, you have gone from zero to production-ready agent development:</p>

<div style="display:grid;gap:1rem;margin-top:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Foundation (Lessons 1-3)</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Why agents matter, installation, your first query, streaming events</p>
</div>
<div style="padding:1rem;background:rgba(56,189,248,.05);border-radius:10px;border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8">Capabilities (Lessons 4-6)</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Tool use, MCP integration, sub-agent delegation</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Production (Lessons 7-10)</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Sessions, hooks, safety, and deployment architecture</p>
</div>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7;margin-top:1rem">You now have the knowledge to build agents that do real work in the real world — safely, efficiently, and at scale. The gap between you and everyone else who is still copy-pasting into chat windows just got very wide.</p>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Production Deployment","cards":[{"front":"What are the three most common production failures?","back":"1) API rate limits (solution: retry with backoff). 2) Runaway cost from infinite loops (solution: maxBudgetUsd + maxTurns). 3) Tool failures from external services (solution: error handling in hooks + graceful fallbacks)."},{"front":"Abort controller","back":"A mechanism for cleanly cancelling long-running agent operations. Create an AbortController, pass its signal to query(), and call controller.abort() to stop. Handles timeouts and user cancellations."},{"front":"Production checklist essentials","back":"maxBudgetUsd, maxTurns, PreToolUse security hooks, error handling for API/rate-limit/timeout, abort controller with timeout, cost tracking, audit logging, adversarial testing completed."},{"front":"Cost tracking in production","back":"Use hooks and result metadata to track cost per query, total spend, and average cost. Set alerts for anomalies (e.g., average cost > threshold). The result.cost property gives per-query USD spent."},{"front":"Rate limit handling","back":"When the API returns a rate limit error, wait for the retryAfter duration, then retry the request. Implement exponential backoff for repeated rate limits. Never retry immediately."},{"front":"Why is monitoring critical for agents?","back":"Agents are non-deterministic. Unlike traditional software, the same input can produce different behaviors. Monitoring catches cost spikes, unusual tool patterns, and failures that only appear in production."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Production Deployment Check","questions":[{"q":"Your production agent occasionally gets 429 (rate limit) errors from the API. What is the correct handling?","options":["Immediately retry the request","Wait for the retryAfter duration, then retry","Crash the application and alert the team","Ignore the error and return partial results"],"correct":1,"explanation":"429 errors include a retryAfter header telling you how long to wait. Respect this duration before retrying. Immediate retries will just trigger more rate limits."},{"q":"Which combination of settings provides the strongest production safety?","options":["bypassPermissions with no limits","maxBudgetUsd + maxTurns + PreToolUse hooks + abort controller","Only maxBudgetUsd","Only permissionMode: default"],"correct":1,"explanation":"Defense in depth. maxBudgetUsd catches cost runaway. maxTurns prevents infinite loops. PreToolUse hooks block dangerous operations. Abort controllers handle timeouts. No single measure is sufficient alone."},{"q":"You notice your agent's average cost per query has tripled overnight. What should you investigate?","options":["Check if the model price changed","Check if the agent is making more tool calls per query (possible infinite loop pattern)","Check the weather","Restart the server"],"correct":1,"explanation":"Cost spikes usually mean the agent is making more tool calls per query — possibly getting stuck in loops or exploring unnecessary paths. Check tool call counts, review audit logs, and look for pattern changes."},{"q":"How should you implement a 60-second timeout for agent queries?","options":["Use setTimeout to kill the Node.js process","Create an AbortController, set a 60-second timeout, and pass the signal to query()","Set maxTurns to 60","Hope the query finishes in time"],"correct":1,"explanation":"AbortController provides clean cancellation. Set a setTimeout that calls controller.abort(), and pass controller.signal to the query() options. Catch the AbortError to handle the timeout gracefully."},{"q":"Before shipping an agent to production, you should run adversarial tests. What does that mean?","options":["Test with normal user prompts","Deliberately try to make the agent misbehave — inject harmful instructions, request destructive operations","Test only with the simplest possible prompts","Skip testing if it works on your laptop"],"correct":1,"explanation":"Adversarial testing means actively trying to break your guardrails. Inject harmful instructions, request destructive commands, attempt prompt injection. If the agent handles all attacks correctly, your safety layer is ready."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 10 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
