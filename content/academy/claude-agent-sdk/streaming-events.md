---
title: "Streaming & Events"
course: "claude-agent-sdk"
order: 3
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Streaming & Events</h1>
  <p class="sub">Build real-time UIs by listening to every heartbeat of your agent's thinking process</p>
</div>

<div class="content">

<div class="card">
<h2>Why Streaming Matters</h2>
<p>When you call <code>query()</code>, you wait for the entire response before seeing anything. For short tasks, that is fine. But when an agent is reading files, running commands, and thinking for 30 seconds, your user stares at a blank screen. Streaming fixes that by sending you each piece of the response as it happens — word by word, tool by tool, event by event.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Non-streaming is like ordering food at a restaurant and sitting in silence until the entire meal arrives at once. Streaming is like watching the chef cook through the kitchen window — you see the prep, the sizzle, the plating. Same food, completely different experience.
</div>
</div>

<div class="card">
<h2>The Event Stream</h2>
<p>When you use streaming mode, the SDK emits a sequence of <strong style="color:#e5e5e5">events</strong> that tell you exactly what is happening inside your agent. Each event has a type and a payload:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12)">
<div style="font-size:1.25rem">1</div>
<div><div style="font-size:.85rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">content_block_start</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Claude is about to start generating text or requesting a tool. This is your signal to prepare the UI for incoming content.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(56,189,248,.06);border-radius:10px;border:1px solid rgba(56,189,248,.12)">
<div style="font-size:1.25rem">2</div>
<div><div style="font-size:.85rem;font-weight:700;color:#38bdf8;margin-bottom:.2rem">content_block_delta</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">A chunk of text or tool input has arrived. This is what you append to your display in real time — the "typing" effect users expect from AI interfaces.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12)">
<div style="font-size:1.25rem">3</div>
<div><div style="font-size:.85rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">content_block_stop</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">A content block is complete. If it was a tool call, the SDK will now execute the tool and continue the loop.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12)">
<div style="font-size:1.25rem">4</div>
<div><div style="font-size:.85rem;font-weight:700;color:#34d399;margin-bottom:.2rem">tool_use / tool_result</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">A tool was called and returned a result. You can display this to show users what the agent is doing behind the scenes.</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Streaming in Practice</h2>
<p>The SDK provides a streaming interface that lets you handle events as they arrive. Here is a complete example:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — streaming agent output</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
});

<span style="color:#71717a">// Use the streaming query method</span>
<span style="color:#c084fc">const</span> stream = agent.streamQuery(
  <span style="color:#fbbf24">"Read package.json and summarize the project."</span>
);

<span style="color:#71717a">// Listen for events as they arrive</span>
<span style="color:#c084fc">for await</span> (<span style="color:#c084fc">const</span> event <span style="color:#c084fc">of</span> stream) {
  <span style="color:#c084fc">switch</span> (event.type) {
    <span style="color:#c084fc">case</span> <span style="color:#fbbf24">"text_delta"</span>:
      <span style="color:#71717a">// A chunk of text — print it immediately</span>
      process.stdout.write(event.text);
      <span style="color:#c084fc">break</span>;

    <span style="color:#c084fc">case</span> <span style="color:#fbbf24">"tool_use"</span>:
      <span style="color:#71717a">// Claude is calling a tool</span>
      <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`\n[Tool: ${event.name}]`</span>);
      <span style="color:#c084fc">break</span>;

    <span style="color:#c084fc">case</span> <span style="color:#fbbf24">"tool_result"</span>:
      <span style="color:#71717a">// Tool finished — show a brief status</span>
      <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`[Tool complete]\n`</span>);
      <span style="color:#c084fc">break</span>;

    <span style="color:#c084fc">case</span> <span style="color:#fbbf24">"result"</span>:
      <span style="color:#71717a">// Final result with metadata</span>
      <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`\nCost: $${event.cost}`</span>);
      <span style="color:#c084fc">break</span>;
  }
}</code></pre>
</div>
</div>

<div class="card">
<h2>Building a Real-Time Terminal UI</h2>
<p>Here is a more polished example that shows tool activity and text output in a terminal interface — the kind of experience you see in Claude Code itself:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — terminal UI with streaming</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">async function</span> <span style="color:#38bdf8">runWithUI</span>(prompt: string) {
  <span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
    model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    tools: <span style="color:#fbbf24">"defaults"</span>,
  });

  <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`\x1b[36m> ${prompt}\x1b[0m\n`</span>);

  <span style="color:#c084fc">const</span> stream = agent.streamQuery(prompt);
  <span style="color:#c084fc">let</span> toolDepth = <span style="color:#fb923c">0</span>;

  <span style="color:#c084fc">for await</span> (<span style="color:#c084fc">const</span> event <span style="color:#c084fc">of</span> stream) {
    <span style="color:#c084fc">if</span> (event.type === <span style="color:#fbbf24">"tool_use"</span>) {
      toolDepth++;
      <span style="color:#71717a">// Show tool activity in dim text</span>
      <span style="color:#34d399">console</span>.log(
        <span style="color:#fbbf24">`\x1b[2m  ${"  ".repeat(toolDepth)}[${event.name}]\x1b[0m`</span>
      );
    } <span style="color:#c084fc">else if</span> (event.type === <span style="color:#fbbf24">"tool_result"</span>) {
      toolDepth = Math.max(<span style="color:#fb923c">0</span>, toolDepth - <span style="color:#fb923c">1</span>);
    } <span style="color:#c084fc">else if</span> (event.type === <span style="color:#fbbf24">"text_delta"</span>) {
      <span style="color:#71717a">// Stream text in real time</span>
      process.stdout.write(event.text);
    } <span style="color:#c084fc">else if</span> (event.type === <span style="color:#fbbf24">"result"</span>) {
      <span style="color:#34d399">console</span>.log(<span style="color:#fbbf24">`\n\x1b[2mCost: $${event.cost.toFixed(4)}\x1b[0m`</span>);
    }
  }
}

runWithUI(<span style="color:#fbbf24">"Find all TypeScript files in this project and count the total lines of code."</span>);</code></pre>
</div>
</div>

<div class="card">
<h2>Event Lifecycle</h2>
<p>Understanding the full event lifecycle helps you build robust UIs. Here is the sequence for a typical agent interaction:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:#a1a1aa;line-height:1.8;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code>User prompt: "How many .ts files are in src/?"

<span style="color:#8b5cf6">text_delta</span>     "Let me check"
<span style="color:#8b5cf6">text_delta</span>     " the src directory..."
<span style="color:#fb923c">tool_use</span>       Glob { pattern: "src/**/*.ts" }
<span style="color:#34d399">tool_result</span>    ["src/index.ts", "src/utils.ts", ...]
<span style="color:#8b5cf6">text_delta</span>     "I found "
<span style="color:#8b5cf6">text_delta</span>     "12 TypeScript files"
<span style="color:#8b5cf6">text_delta</span>     " in the src/ directory."
<span style="color:#f472b6">result</span>         { cost: 0.003, toolCalls: 1 }</code></pre>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7">Notice how text deltas arrive in small chunks — sometimes just a word or part of a word. Tool events arrive as complete units. The <code>result</code> event always comes last and signals that the agent is done.</p>
</div>

<div class="card">
<h2>Common Pitfalls</h2>
<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Forgetting to handle all event types</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">If you only handle <code>text_delta</code>, you will miss tool activity and the final result. Always have a default case or handle at least text, tool_use, tool_result, and result events.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Using console.log for text deltas</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><code>console.log()</code> adds a newline after each call. Use <code>process.stdout.write()</code> for text deltas so words flow together naturally instead of appearing on separate lines.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Not handling stream errors</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Network issues, rate limits, or API errors can interrupt the stream. Wrap your <code>for await</code> loop in a try/catch to handle errors gracefully instead of crashing.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Streaming & Events","cards":[{"front":"What is streaming in the Agent SDK?","back":"Instead of waiting for the complete response, streaming sends events in real time as the agent thinks, calls tools, and generates text. This enables live UI updates and responsive user experiences."},{"front":"text_delta event","back":"A chunk of text from Claude arriving in real time. These are small pieces (words or partial words) that you append to your display to create the typing effect. Use process.stdout.write(), not console.log()."},{"front":"tool_use event","back":"Fired when Claude decides to call a tool. Contains the tool name and parameters. Display this to show users what the agent is doing behind the scenes."},{"front":"tool_result event","back":"Fired when a tool finishes executing and returns its result to Claude. The agent then continues reasoning with this new information."},{"front":"result event","back":"The final event, fired when the agent is completely done. Contains metadata: total cost, number of tool calls, session ID. This signals that the stream is finished."},{"front":"streamQuery() vs query()","back":"query() waits for the complete response and returns the final result. streamQuery() returns an async iterable of events that you process in real time. Same underlying agent, different consumption pattern."},{"front":"Why use process.stdout.write() for text deltas?","back":"console.log() adds a newline after each call, making streamed text appear on separate lines. process.stdout.write() outputs text without newlines, so words flow together naturally."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Streaming & Events Check","questions":[{"q":"What is the main benefit of streaming over a regular query() call?","options":["It is faster overall","Users see real-time progress instead of waiting for the complete response","It uses less API credits","It enables more tool calls"],"correct":1,"explanation":"Streaming does not change the total time or cost. Its benefit is UX — users see text appearing in real time and can observe tool activity, instead of staring at a blank screen while the agent works."},{"q":"Which event type represents a chunk of Claude text arriving in real time?","options":["tool_use","result","text_delta","content_block_start"],"correct":2,"explanation":"text_delta events carry small chunks of text as Claude generates them. You append these to your display to create the live typing effect."},{"q":"A stream emits events in this order: text_delta, tool_use, tool_result, text_delta, result. What happened?","options":["An error occurred","Claude started typing, called a tool, got the result, finished typing, then completed","Claude called two tools in parallel","The stream was interrupted"],"correct":1,"explanation":"This is a typical agent flow: Claude starts responding (text_delta), realizes it needs a tool (tool_use), gets the result (tool_result), incorporates it into its response (text_delta), and finishes (result)."},{"q":"Why should you NOT use console.log() for streaming text deltas?","options":["It is too slow","It adds a newline after each call, breaking the text flow","It cannot handle Unicode","It crashes on empty strings"],"correct":1,"explanation":"console.log() appends a newline character after each call. Since text deltas are small chunks (sometimes single words), each word would appear on its own line. process.stdout.write() outputs text without newlines."},{"q":"What should you do if the stream throws an error mid-execution?","options":["Ignore it — the SDK handles all errors","Restart the entire application","Wrap the for-await loop in try/catch and handle the error gracefully","There is no way to handle stream errors"],"correct":2,"explanation":"Network issues, rate limits, or API errors can interrupt a stream at any point. A try/catch around the for-await loop lets you handle errors gracefully — log them, retry, or inform the user."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 3 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
