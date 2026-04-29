---
title: "Why Agent SDK?"
course: "claude-agent-sdk"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Why Agent SDK?</h1>
  <p class="sub">The difference between chatting with AI and deploying AI agents that actually do things</p>
</div>

<div class="content">

<div class="card">
<h2>From Chat to Agent</h2>
<p>You have probably used Claude through a chat interface. You type a question, Claude answers. Maybe you paste in some code and ask for help. That is powerful, but it is also limited. You are the one doing the work — copying, pasting, running, checking. Claude is just thinking. You are the hands.</p>

<p>The <strong style="color:#e5e5e5">Claude Agent SDK</strong> flips that equation. Instead of chatting with Claude, you build software that <em>gives Claude hands</em>. An agent built with the SDK can read files, write code, search the web, query databases, call APIs, run terminal commands, and make decisions — all on its own. You define the mission. The agent executes it.</p>

<p>This is the difference between asking a coworker for advice and hiring someone to do the job. The API is the advice line. The Agent SDK is the hiring contract.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Think of the Claude API like calling a brilliant friend on the phone — they can advise you, but they cannot reach through the phone to fix your car. The Agent SDK gives that friend a body. Now they can walk into your garage, pick up tools, diagnose the problem, order parts, and fix it while you do something else.
</div>
</div>

<div class="card">
<h2>What the API Can Do (and Where It Stops)</h2>
<p>The Claude API lets you send messages and get responses. You can set system prompts, control temperature, and even define tools for function calling. That is enough to build chatbots, content generators, and simple automations. But the API puts <strong style="color:#e5e5e5">you</strong> in charge of every decision:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">With the API alone, YOU must:</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Write the tool execution loop. Handle every tool result. Manage conversation history. Decide when to stop. Implement permission checks. Handle streaming. Manage sessions. Build retry logic. Track costs. You are building the agent framework from scratch — every time.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">With the Agent SDK, you get:</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">A complete agent runtime out of the box. Built-in tools (Bash, file operations, search). Automatic tool execution loops. Streaming event system. Session management with persistence. Permission controls. Cost guardrails. Sub-agent delegation. MCP server integration. You focus on what your agent does — not how agents work.</p>
</div>
</div>
</div>

<div class="card">
<h2>What the Agent SDK Unlocks</h2>
<p>The SDK is not just convenience. It enables patterns that would take thousands of lines of custom code to build yourself:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12)">
<div style="font-size:1.25rem">1</div>
<div><div style="font-size:.85rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Autonomous execution</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Claude runs tools, reads results, decides next steps, and keeps going until the job is done. No human in the loop unless you want one.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(56,189,248,.06);border-radius:10px;border:1px solid rgba(56,189,248,.12)">
<div style="font-size:1.25rem">2</div>
<div><div style="font-size:.85rem;font-weight:700;color:#38bdf8;margin-bottom:.2rem">Multi-agent delegation</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Your main agent can spin up specialized sub-agents for specific tasks — a researcher, a coder, a reviewer — each with their own tools and instructions.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12)">
<div style="font-size:1.25rem">3</div>
<div><div style="font-size:.85rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Session persistence</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Agents can remember conversations across restarts. Resume where you left off, fork sessions for parallel exploration, and build agents that learn over time.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12)">
<div style="font-size:1.25rem">4</div>
<div><div style="font-size:.85rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Safety guardrails</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Built-in permission modes, cost budgets, turn limits, and lifecycle hooks let you control exactly what your agent can do — and stop it when it should not.</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Your First Look at the SDK</h2>
<p>Here is the simplest possible agent. This is not production code — it is the "Hello World" that shows you the shape of things to come:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — your first agent in 5 lines</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#71717a">// Create a Claude agent with built-in tools</span>
<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,    <span style="color:#71717a">// which model powers the agent</span>
  tools: <span style="color:#fbbf24">"defaults"</span>,              <span style="color:#71717a">// gives Claude file tools, bash, etc.</span>
});

<span style="color:#71717a">// Give the agent a task and let it work</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Read the file package.json and tell me what dependencies are installed."</span>
);

<span style="color:#34d399">console</span>.log(result.text);
<span style="color:#71717a">// Claude reads the file, parses it, and responds with a summary</span>
<span style="color:#71717a">// — all without you writing any file-reading code</span></code></pre>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7">Notice what you <em>did not</em> write: no file reading code, no JSON parsing, no tool execution loop, no error handling for missing files. The SDK handles all of that. You described what you wanted. The agent figured out how to do it.</p>
</div>

<div class="card">
<h2>Who Should Use the Agent SDK</h2>
<p>The Agent SDK is for anyone building AI-powered software that needs to <em>act</em>, not just <em>respond</em>. That includes:</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Developers building</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Coding assistants, deployment bots, data pipelines, research agents, customer service automation, internal tools, CI/CD integrations, content generation systems</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.85rem">Prerequisites</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Comfortable with TypeScript or JavaScript. Familiar with npm. Basic understanding of async/await. No prior AI experience needed — this course teaches the rest.</p>
</div>
</div>
</div>

<div class="card">
<h2>What You Will Build in This Course</h2>
<p>By the end of these 10 lessons, you will go from zero to deploying production agents. Here is the roadmap:</p>

<div style="display:grid;gap:.5rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.8rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">1-2</div>
<div style="font-size:.82rem;color:#a1a1aa">Install, authenticate, and make your first query</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(56,189,248,.04);border-radius:8px;border:1px solid rgba(56,189,248,.08)">
<div style="font-size:.8rem;font-weight:700;color:#38bdf8;min-width:1.5rem">3-5</div>
<div style="font-size:.82rem;color:#a1a1aa">Master streaming, tool use, and MCP integration</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border:1px solid rgba(251,146,60,.08)">
<div style="font-size:.8rem;font-weight:700;color:#fb923c;min-width:1.5rem">6-8</div>
<div style="font-size:.82rem;color:#a1a1aa">Sub-agents, session management, hooks and lifecycle</div>
</div>
<div style="display:flex;gap:.75rem;align-items:center;padding:.5rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border:1px solid rgba(52,211,153,.08)">
<div style="font-size:.8rem;font-weight:700;color:#34d399;min-width:1.5rem">9-10</div>
<div style="font-size:.82rem;color:#a1a1aa">Testing, safety, and production deployment</div>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Agent SDK Foundations","cards":[{"front":"What is the Claude Agent SDK?","back":"A software development kit that lets you build AI agents that can autonomously execute tasks using tools like Bash, file operations, and MCP servers. Unlike the raw API (which just sends/receives messages), the SDK provides the full agent runtime."},{"front":"API vs. Agent SDK","back":"The API is a request/response interface — you send a message, get an answer. The Agent SDK is an agent framework — you define a mission, and Claude executes it using tools, making decisions along the way until the task is complete."},{"front":"What are built-in tools?","back":"The SDK ships with pre-built tools: Bash (run terminal commands), Read/Write/Edit (file operations), Grep/Glob (search). These give the agent hands — the ability to interact with the file system and operating environment."},{"front":"What is autonomous execution?","back":"The agent runs a tool loop automatically: call a tool, read the result, decide the next action, repeat until done. No human needs to approve each step (unless you configure it that way with permission modes)."},{"front":"What is sub-agent delegation?","back":"A main agent can create specialized child agents for specific tasks. Each sub-agent gets its own tools, instructions, and context. The parent coordinates. Think: a manager delegating to specialists."},{"front":"What is session persistence?","back":"Agents can save conversation state and resume later. This enables long-running tasks, multi-session workflows, and agents that remember previous interactions across restarts."},{"front":"What prerequisites do I need?","back":"Comfort with TypeScript/JavaScript, familiarity with npm, and understanding of async/await. No prior AI or machine learning experience needed — this course covers everything else."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Why Agent SDK — Comprehension Check","questions":[{"q":"What is the main difference between the Claude API and the Claude Agent SDK?","options":["The SDK uses a different AI model","The API is free but the SDK costs money","The API handles chat; the SDK enables autonomous agents that execute tasks with tools","The SDK only works with Python"],"correct":2,"explanation":"The API is a message-in, message-out interface. The Agent SDK provides a complete agent runtime with built-in tools, automatic tool execution loops, session management, and more — enabling Claude to act autonomously."},{"q":"Which of these tasks would benefit MOST from the Agent SDK (vs. the raw API)?","options":["Generating a single blog post from a prompt","Analyzing a codebase, finding bugs, and fixing them across multiple files","Translating a paragraph from English to Spanish","Answering a factual question about history"],"correct":1,"explanation":"Analyzing a codebase requires reading multiple files, understanding relationships, making edits, and potentially running tests — a multi-step autonomous workflow. The SDK handles the tool loop, file operations, and decision-making. The other tasks are single-turn responses the API handles fine."},{"q":"What does the tools: \"defaults\" option give your agent?","options":["Access to the internet only","Built-in file tools (Read, Write, Edit), Bash, search tools (Grep, Glob)","A connection to OpenAI models","Nothing — it is a placeholder"],"correct":1,"explanation":"The defaults tools preset gives Claude access to file system operations (Read, Write, Edit), terminal commands (Bash), and search tools (Grep, Glob). These are the core capabilities that let an agent interact with your local environment."},{"q":"What is session persistence used for?","options":["Saving your API key","Resuming agent conversations across restarts and maintaining state over time","Connecting to a database","Logging errors to a file"],"correct":1,"explanation":"Session persistence lets agents save their conversation state and resume later. This enables long-running workflows, multi-session tasks, and agents that remember previous interactions — critical for production agent systems."},{"q":"You want Claude to automatically read a log file, find errors, and write a summary report. Which approach is best?","options":["Use the Claude API with a very long prompt","Copy the log file contents and paste them into Claude.ai","Build an agent with the SDK that uses file tools to read, analyze, and write","Email the log file to Anthropic support"],"correct":2,"explanation":"This is a multi-step autonomous task: read a file, analyze its contents, and write a new file. The Agent SDK handles this naturally — Claude uses Read to get the log, processes it, and uses Write to create the report. No manual copying or pasting needed."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 1 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
