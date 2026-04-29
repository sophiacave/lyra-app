---
title: "Hooks & Lifecycle"
course: "claude-agent-sdk"
order: 8
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Hooks & Lifecycle</h1>
  <p class="sub">Intercept, inspect, and modify your agent's behavior at every decision point</p>
</div>

<div class="content">

<div class="card">
<h2>What Are Hooks?</h2>
<p>Hooks are callback functions that fire at specific points in the agent's lifecycle. They let you <strong style="color:#e5e5e5">observe, modify, or block</strong> agent behavior without changing the agent's core logic. Think of them as checkpoints where you can inspect what the agent is doing and decide whether to let it continue.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Hooks are like security checkpoints at an airport. You pass through multiple checks — ID verification, baggage scan, boarding pass check. At each checkpoint, your journey can be approved, flagged for inspection, or stopped entirely. The traveler (agent) does not control the checkpoints. You do.
</div>
</div>

<div class="card">
<h2>The Hook Types</h2>
<p>The SDK provides hooks at four critical lifecycle points:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.88rem">PreToolUse</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Fires <em>before</em> a tool is executed. Inspect or modify the tool call parameters. Return <code>deny</code> to block the call entirely. Use this for input validation and permission enforcement.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.88rem">PostToolUse</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Fires <em>after</em> a tool returns its result. Inspect or modify the result before Claude sees it. Use this for output sanitization, logging, and audit trails.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.88rem">PermissionRequest</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Fires when the agent wants to do something that requires explicit permission. Return <code>allow</code> or <code>deny</code>. Use this for human-in-the-loop approval workflows.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">Stop</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Fires when the agent is about to finish. You can inspect the final result or force the agent to continue working. Use this for quality validation.</p>
</div>
</div>
</div>

<div class="card">
<h2>Implementing Hooks</h2>
<p>Here is a complete example that uses hooks to build guardrails around an agent:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — agent with lifecycle hooks</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,

  hooks: {
    <span style="color:#71717a">// Before any tool runs — validate and log</span>
    preToolUse: (tool, params) => {
      <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`[PRE] ${tool}(${JSON.stringify(params)})`</span>);

      <span style="color:#71717a">// Block dangerous Bash commands</span>
      <span style="color:#c084fc">if</span> (tool === <span style="color:#fbbf24">"Bash"</span>) {
        <span style="color:#c084fc">const</span> cmd = params.command || <span style="color:#fbbf24">""</span>;
        <span style="color:#c084fc">if</span> (cmd.includes(<span style="color:#fbbf24">"rm -rf"</span>) || cmd.includes(<span style="color:#fbbf24">"sudo"</span>)) {
          <span style="color:#c084fc">return</span> { action: <span style="color:#fbbf24">"deny"</span>, message: <span style="color:#fbbf24">"Destructive commands blocked"</span> };
        }
      }

      <span style="color:#71717a">// Block writes outside the project</span>
      <span style="color:#c084fc">if</span> (tool === <span style="color:#fbbf24">"Write"</span> && !params.file_path?.startsWith(<span style="color:#fbbf24">"/project/"</span>)) {
        <span style="color:#c084fc">return</span> { action: <span style="color:#fbbf24">"deny"</span>, message: <span style="color:#fbbf24">"Writes restricted to /project/"</span> };
      }

      <span style="color:#c084fc">return</span> { action: <span style="color:#fbbf24">"allow"</span> };
    },

    <span style="color:#71717a">// After any tool runs — log the result</span>
    postToolUse: (tool, params, result) => {
      <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`[POST] ${tool} completed (${result.length} chars)`</span>);
      <span style="color:#c084fc">return</span> result;  <span style="color:#71717a">// pass through unchanged</span>
    },
  },
});

<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Clean up the temp files in /project/build/"</span>
);</code></pre>
</div>
</div>

<div class="card">
<h2>Building an Audit Trail</h2>
<p>Hooks are perfect for creating detailed logs of everything your agent does — critical for debugging and compliance:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — audit trail with hooks</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> auditLog: Array<{time: string, action: string}> = [];

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
  hooks: {
    preToolUse: (tool, params) => {
      auditLog.push({
        time: <span style="color:#c084fc">new</span> Date().toISOString(),
        action: <span style="color:#fbbf24">`CALL ${tool}: ${JSON.stringify(params).slice(0, 200)}`</span>,
      });
      <span style="color:#c084fc">return</span> { action: <span style="color:#fbbf24">"allow"</span> };
    },
    postToolUse: (tool, _params, result) => {
      auditLog.push({
        time: <span style="color:#c084fc">new</span> Date().toISOString(),
        action: <span style="color:#fbbf24">`RESULT ${tool}: ${result.slice(0, 200)}`</span>,
      });
      <span style="color:#c084fc">return</span> result;
    },
  },
});

<span style="color:#c084fc">await</span> agent.query(<span style="color:#fbbf24">"Refactor the utils module."</span>);

<span style="color:#71717a">// Write audit log to disk</span>
<span style="color:#c084fc">await</span> Bun.write(<span style="color:#fbbf24">"audit.json"</span>, JSON.stringify(auditLog, null, <span style="color:#fb923c">2</span>));</code></pre>
</div>
</div>

<div class="card">
<h2>Key Takeaways</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Hooks are your control plane</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">They let you enforce policies without modifying agent logic. Block dangerous operations, log everything, sanitize outputs, and implement approval workflows — all from hooks.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">PreToolUse is your primary security layer</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">It fires before every tool call, giving you the chance to inspect parameters, block dangerous operations, and enforce path restrictions. This is where security policies live.</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">PostToolUse enables sanitization and logging</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Inspect results before Claude sees them. Redact sensitive data, truncate large outputs, or log tool activity for debugging and compliance.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Hooks & Lifecycle","cards":[{"front":"What are hooks in the Agent SDK?","back":"Callback functions that fire at specific lifecycle points: before tool calls (PreToolUse), after tool calls (PostToolUse), on permission requests, and on stop. They let you observe, modify, or block agent behavior."},{"front":"PreToolUse hook","back":"Fires before every tool execution. Receives tool name and parameters. Return allow to proceed or deny to block. Use for input validation, security enforcement, and logging."},{"front":"PostToolUse hook","back":"Fires after every tool execution. Receives tool name, parameters, and result. Can modify the result before Claude sees it. Use for output sanitization, redaction, and audit logging."},{"front":"PermissionRequest hook","back":"Fires when the agent needs explicit approval for an action. Enables human-in-the-loop workflows where sensitive operations require confirmation before proceeding."},{"front":"What can you do with hooks?","back":"Block dangerous commands, enforce path restrictions, log all tool activity for audits, redact sensitive data from results, implement approval workflows, and validate output quality."},{"front":"Hooks vs canUseTool","back":"canUseTool is a simple allow/deny gate based on tool name and params. Hooks are more powerful — they can modify parameters, transform results, log activity, and implement complex policies."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Hooks & Lifecycle Check","questions":[{"q":"When does the PreToolUse hook fire?","options":["After Claude generates its response","Before a tool is executed, letting you inspect or block the call","When the agent starts up","Only when errors occur"],"correct":1,"explanation":"PreToolUse fires before every tool execution. It receives the tool name and parameters, giving you the opportunity to validate, modify, or deny the call before it runs."},{"q":"Your agent should never delete files. Which hook implementation is correct?","options":["PostToolUse that logs deletions","PreToolUse that returns deny when Bash command contains rm","PermissionRequest that asks the user","Stop hook that checks for deletions"],"correct":1,"explanation":"PreToolUse is the right place to block operations. By checking Bash commands for rm patterns and returning deny, you prevent deletions before they happen. PostToolUse would be too late."},{"q":"What can a PostToolUse hook do with tool results?","options":["Nothing — results are read-only","Modify or redact the result before Claude sees it","Delete the tool call from history","Change which tool was called"],"correct":1,"explanation":"PostToolUse can modify the tool result before it is sent back to Claude. This enables sanitization (removing sensitive data), truncation (shortening large outputs), and transformation."},{"q":"You want to build a compliance system that records every action your agent takes. Which approach works best?","options":["Read the agent logs after it finishes","Use PreToolUse and PostToolUse hooks to log every tool call and result in real time","Ask Claude to describe what it did","Check the file system for changes"],"correct":1,"explanation":"Hooks give you real-time visibility into every tool call (PreToolUse) and every result (PostToolUse). This creates a complete, timestamped audit trail of everything the agent does."},{"q":"What happens when PreToolUse returns { action: \"deny\", message: \"Blocked\" }?","options":["The tool runs anyway but the result is hidden","The tool call is blocked and Claude receives the denial message, adapting its approach","The entire agent session is terminated","An error is thrown"],"correct":1,"explanation":"When PreToolUse denies a tool call, the SDK sends the denial message back to Claude instead of running the tool. Claude adapts — it might try a different approach or inform the user that the operation was blocked."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 8 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
