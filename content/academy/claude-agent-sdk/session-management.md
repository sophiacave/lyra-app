---
title: "Session Management"
course: "claude-agent-sdk"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Session Management</h1>
  <p class="sub">Build agents that remember, resume, and fork conversations across restarts</p>
</div>

<div class="content">

<div class="card">
<h2>Why Sessions Matter</h2>
<p>By default, each <code>query()</code> call starts fresh — Claude has no memory of previous interactions. That works for one-off tasks, but real-world agents need <strong style="color:#e5e5e5">continuity</strong>. A coding assistant should remember what file it was working on. A research agent should build on previous findings. A customer service bot should know the conversation history.</p>

<p>Sessions are how you give agents memory. A session stores the conversation history so Claude can pick up where it left off — even after your application restarts.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Sessions are like saving your game. Without them, you start from level 1 every time you open the app. With sessions, you load your save file and continue from where you stopped.
</div>
</div>

<div class="card">
<h2>Multi-Turn Conversations</h2>
<p>The simplest form of session management is multi-turn conversations within a single run. The SDK handles this automatically when you make multiple queries on the same agent instance:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — multi-turn conversation</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
});

<span style="color:#71717a">// First query — Claude reads the file</span>
<span style="color:#c084fc">const</span> r1 = <span style="color:#c084fc">await</span> agent.query(<span style="color:#fbbf24">"Read src/index.ts and explain what it does."</span>);
<span style="color:#34d399">console</span>.log(r1.text);

<span style="color:#71717a">// Second query — Claude remembers the first conversation</span>
<span style="color:#c084fc">const</span> r2 = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Now add error handling to the main function you just read."</span>,
  { sessionId: r1.sessionId }  <span style="color:#71717a">// resume the same session</span>
);
<span style="color:#34d399">console</span>.log(r2.text);

<span style="color:#71717a">// Third query — still in the same conversation</span>
<span style="color:#c084fc">const</span> r3 = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Write tests for the changes you just made."</span>,
  { sessionId: r2.sessionId }
);
<span style="color:#34d399">console</span>.log(r3.text);</code></pre>
</div>
</div>

<div class="card">
<h2>Persisting Sessions Across Restarts</h2>
<p>For sessions to survive application restarts, you need a <strong style="color:#e5e5e5">session store</strong>. The SDK supports custom session stores that save conversation history to disk, a database, or any storage backend:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — persistent session store</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude, FileSessionStore } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#71717a">// Store sessions as files on disk</span>
<span style="color:#c084fc">const</span> store = <span style="color:#c084fc">new</span> FileSessionStore(<span style="color:#fbbf24">"./sessions"</span>);

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
  sessionStore: store,  <span style="color:#71717a">// sessions persist to ./sessions/</span>
});

<span style="color:#71717a">// Start a new session</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(<span style="color:#fbbf24">"Set up the project structure."</span>);
<span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`Session saved: ${result.sessionId}`</span>);

<span style="color:#71717a">// Later (even after restart), resume with the session ID</span>
<span style="color:#c084fc">const</span> resumed = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Continue where we left off. What was I working on?"</span>,
  { sessionId: <span style="color:#fbbf24">"sess_abc123"</span> }  <span style="color:#71717a">// the ID from before</span>
);
<span style="color:#34d399">console</span>.log(resumed.text);</code></pre>
</div>
</div>

<div class="card">
<h2>Forking Sessions</h2>
<p>Sometimes you want to explore multiple directions from the same starting point. <strong style="color:#e5e5e5">Forking</strong> creates a copy of a session at a specific point, letting you branch the conversation:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — forking a session</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// After analyzing the code, explore two different approaches</span>
<span style="color:#c084fc">const</span> analysis = <span style="color:#c084fc">await</span> agent.query(<span style="color:#fbbf24">"Analyze the performance issues in src/api.ts"</span>);

<span style="color:#71717a">// Fork: try approach A (caching)</span>
<span style="color:#c084fc">const</span> approachA = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Fix the issues using Redis caching."</span>,
  { forkSession: analysis.sessionId }  <span style="color:#71717a">// branch from here</span>
);

<span style="color:#71717a">// Fork: try approach B (query optimization)</span>
<span style="color:#c084fc">const</span> approachB = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Fix the issues by optimizing the SQL queries."</span>,
  { forkSession: analysis.sessionId }  <span style="color:#71717a">// branch from same point</span>
);

<span style="color:#71717a">// Both approaches share the same analysis context</span>
<span style="color:#71717a">// but diverge in their solutions</span></code></pre>
</div>
</div>

<div class="card">
<h2>Common Pitfalls</h2>
<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Context window limits</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Sessions accumulate token usage. A very long session can hit the model's context limit. Monitor session length and consider starting fresh for unrelated tasks.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Stale session data</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If you resume a session days later, files may have changed since Claude last read them. The agent remembers old file contents. Instruct it to re-read files when resuming after long gaps.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Not cleaning up old sessions</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Persistent sessions consume storage. Implement cleanup for sessions older than a threshold, or set expiration policies on your session store.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Session Management","cards":[{"front":"What is a session in the Agent SDK?","back":"A stored conversation history that allows multi-turn interactions. Sessions let Claude remember previous queries, tool calls, and results — enabling continuity across multiple interactions."},{"front":"sessionId","back":"A unique identifier for each session (e.g., sess_abc123). Pass it to subsequent query() calls to resume an existing conversation. Returned in every query result."},{"front":"Session store","back":"A persistence backend that saves session data (conversation history) to disk, a database, or other storage. Required for sessions to survive application restarts."},{"front":"FileSessionStore","back":"A built-in session store that saves sessions as files on disk. Pass a directory path: new FileSessionStore(\"./sessions\"). Simple and effective for single-server deployments."},{"front":"Forking a session","back":"Creating a copy of a session at a specific point to explore different directions. Both branches share the same history up to the fork point but diverge afterward. Use forkSession option."},{"front":"Context window limit and sessions","back":"Sessions accumulate tokens over time. Very long sessions can hit the model context limit (e.g., 200K tokens for Sonnet). Monitor session length and start fresh for unrelated tasks."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Session Management Check","questions":[{"q":"What is the purpose of passing sessionId to a query() call?","options":["To track API costs","To resume a previous conversation so Claude remembers the history","To authenticate with a different API key","To select a different model"],"correct":1,"explanation":"The sessionId tells the SDK to load the previous conversation history before sending the new query. Claude sees the full conversation and can continue from where it left off."},{"q":"You restart your application and want to resume an agent conversation. What do you need?","options":["The exact same code that started the conversation","A session store configured with persistence, and the session ID","Nothing — sessions survive restarts automatically","A backup of the Claude API"],"correct":1,"explanation":"Sessions only survive restarts if you have configured a persistent session store (like FileSessionStore). You also need the session ID from the previous conversation to load the right session."},{"q":"What does forking a session do?","options":["Deletes the original session","Creates a copy of the session at a specific point to explore a different direction","Merges two sessions together","Splits the session between two agents"],"correct":1,"explanation":"Forking creates a branch from an existing session. Both the original and the fork share history up to the fork point, then diverge. This lets you explore multiple approaches from the same starting context."},{"q":"A session has been running for hours with hundreds of tool calls. What risk should you watch for?","options":["The API key might expire","The session might hit the model context window limit","The session store will automatically delete it","Tool permissions might change"],"correct":1,"explanation":"Sessions accumulate tokens with every message and tool call. Very long sessions can exceed the model context window (e.g., 200K tokens), causing failures. Monitor session length and consider starting fresh."},{"q":"You resume a session from two weeks ago. What potential problem might arise?","options":["The API key has definitely changed","Files Claude remembers reading may have changed since then","Sessions expire after one week","The model version will be different"],"correct":1,"explanation":"Claude remembers file contents from when it last read them. If files have been modified in the two weeks since, Claude working from stale data. Instruct it to re-read relevant files when resuming after long gaps."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 7 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
