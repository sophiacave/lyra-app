---
title: "Install & First Query"
course: "claude-agent-sdk"
order: 2
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Install & First Query</h1>
  <p class="sub">From npm install to your first working agent in under five minutes</p>
</div>

<div class="content">

<div class="card">
<h2>Setting Up Your Environment</h2>
<p>Before you write a single line of agent code, you need three things: Node.js, an Anthropic API key, and the SDK package. If you have ever set up a JavaScript project, this will feel familiar. If you have not, follow every step — we will not skip anything.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Setting up the SDK is like setting up a workshop. Node.js is the workbench. The API key is your badge that gets you into the building. The SDK package is the toolbox. You need all three before you can build anything.
</div>
</div>

<div class="card">
<h2>Step 1: Install Node.js</h2>
<p>The Agent SDK runs on Node.js 18 or later. Check if you already have it:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — check your Node.js version</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Check if Node.js is installed and what version</span>
node --version
<span style="color:#71717a"># You need v18.0.0 or higher</span>
<span style="color:#71717a"># If you see "command not found" or a version below 18,</span>
<span style="color:#71717a"># install from https://nodejs.org (use the LTS version)</span></code></pre>
</div>
</div>

<div class="card">
<h2>Step 2: Get Your API Key</h2>
<p>You need an Anthropic API key. If you already have one from using the Claude API, it works with the SDK too — same key, same account.</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">1</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Go to <strong style="color:#e5e5e5">console.anthropic.com</strong> and sign in (or create an account)</div>
</div>
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">2</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Navigate to <strong style="color:#e5e5e5">Settings > API Keys</strong> and click "Create Key"</div>
</div>
<div style="display:flex;gap:.75rem;align-items:flex-start;padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:10px;border:1px solid rgba(139,92,246,.08)">
<div style="font-size:.85rem;font-weight:700;color:#8b5cf6;min-width:1.5rem">3</div>
<div style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Set it as an environment variable so the SDK can find it automatically</div>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — set your API key</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Add to your shell profile (~/.zshrc or ~/.bashrc)</span>
<span style="color:#c084fc">export</span> ANTHROPIC_API_KEY=<span style="color:#fbbf24">"sk-ant-api03-your-key-here"</span>

<span style="color:#71717a"># Reload your shell</span>
source ~/.zshrc</code></pre>
</div>

<div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1rem;margin-top:1rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#fb923c">Security:</strong> Never put your API key directly in source code. Never commit it to Git. Use environment variables or a <code>.env</code> file (and add <code>.env</code> to your <code>.gitignore</code>). If you accidentally expose a key, rotate it immediately in the Console.
</div>
</div>

<div class="card">
<h2>Step 3: Install the SDK</h2>
<p>Create a new project and install the Claude Agent SDK:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — create project and install</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Create a new directory for your agent project</span>
mkdir my-first-agent && cd my-first-agent

<span style="color:#71717a"># Initialize a new Node.js project</span>
npm init -y

<span style="color:#71717a"># Install the Claude Agent SDK</span>
npm install @anthropic-ai/claude-agent

<span style="color:#71717a"># If you are using TypeScript (recommended):</span>
npm install typescript tsx --save-dev</code></pre>
</div>
</div>

<div class="card">
<h2>Your First Query</h2>
<p>The most basic SDK operation is <code>query()</code>. It sends a prompt to Claude and returns a result. Unlike a raw API call, the agent can use tools during query execution — reading files, running commands, whatever it needs to answer your question.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — first-agent.ts</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#71717a">// Create an agent instance</span>
<span style="color:#71717a">// It reads ANTHROPIC_API_KEY from your environment automatically</span>
<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,  <span style="color:#71717a">// the model powering your agent</span>
});

<span style="color:#71717a">// Send a simple query — no tools needed for this one</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"What are the three most important things to know about building AI agents?"</span>
);

<span style="color:#71717a">// The result object contains the response text and metadata</span>
<span style="color:#34d399">console</span>.log(result.text);
<span style="color:#71717a">// Claude responds with a thoughtful answer about agent architecture</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Terminal — run your first agent</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Run with tsx (TypeScript executor)</span>
npx tsx first-agent.ts</code></pre>
</div>
</div>

<div class="card">
<h2>Adding Tools: An Agent That Reads Files</h2>
<p>A query without tools is just a fancy API call. The real power starts when you give your agent tools. The <code>tools</code> option tells Claude what it can interact with:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — agent with file tools</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,  <span style="color:#71717a">// enables Bash, Read, Write, Edit, Grep, Glob</span>
});

<span style="color:#71717a">// Now Claude can actually read your file system</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Read the package.json in this directory and list all dependencies."</span>
);

<span style="color:#34d399">console</span>.log(result.text);
<span style="color:#71717a">// Claude uses the Read tool to open package.json,</span>
<span style="color:#71717a">// parses the JSON, and gives you a clean summary</span></code></pre>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7">Behind the scenes, the SDK runs a tool loop: Claude decides to use the Read tool, the SDK executes it, sends the file contents back to Claude, and Claude formulates a response. All of that happens inside the single <code>query()</code> call.</p>
</div>

<div class="card">
<h2>Understanding the Result Object</h2>
<p>The <code>query()</code> method returns a result object with more than just text:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — inspecting the result</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(<span style="color:#fbbf24">"What files are in this directory?"</span>);

<span style="color:#71717a">// The text response from Claude</span>
<span style="color:#34d399">console</span>.log(result.text);

<span style="color:#71717a">// How much it cost (in USD)</span>
<span style="color:#34d399">console</span>.log(result.cost);         <span style="color:#71717a">// e.g., 0.0042</span>

<span style="color:#71717a">// How many tool calls were made</span>
<span style="color:#34d399">console</span>.log(result.toolCalls);    <span style="color:#71717a">// e.g., 2</span>

<span style="color:#71717a">// The session ID (for resuming later)</span>
<span style="color:#34d399">console</span>.log(result.sessionId);   <span style="color:#71717a">// e.g., "sess_abc123"</span></code></pre>
</div>
</div>

<div class="card">
<h2>Common Pitfalls</h2>
<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">"ANTHROPIC_API_KEY is not set"</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">You forgot to export the environment variable, or you are in a different terminal session. Run <code>echo $ANTHROPIC_API_KEY</code> to check. If it is empty, re-export it or add it to your shell profile.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">"Cannot find module @anthropic-ai/claude-agent"</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">You did not run <code>npm install</code> in the correct directory, or you are running your script from a different folder. Make sure your terminal is in the project root where <code>package.json</code> lives.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">"Permission denied" when using file tools</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The SDK respects file system permissions. If Claude tries to read a file you do not have access to, it will fail. Run the agent with appropriate permissions for the directories you want it to access.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Install & First Query","cards":[{"front":"What Node.js version does the SDK require?","back":"Node.js 18 or later. Check with: node --version. Install from nodejs.org if needed."},{"front":"How does the SDK find your API key?","back":"It reads the ANTHROPIC_API_KEY environment variable automatically. Set it with: export ANTHROPIC_API_KEY=\"sk-ant-...\" in your shell profile."},{"front":"What does tools: \"defaults\" give you?","back":"The defaults preset enables built-in tools: Bash (terminal commands), Read/Write/Edit (file operations), and Grep/Glob (search). These let the agent interact with your local environment."},{"front":"What does query() return?","back":"A result object containing: text (Claude response), cost (USD spent), toolCalls (number of tool invocations), sessionId (for resuming later), and other metadata."},{"front":"What happens inside a query() call when tools are enabled?","back":"The SDK runs an automatic tool loop: Claude decides to use a tool, the SDK executes it, sends results back to Claude, and repeats until Claude has enough information to respond. All transparent to you."},{"front":"What is the difference between query() with and without tools?","back":"Without tools, query() is essentially an API call — Claude can only think and respond. With tools, Claude can read files, run commands, search code, and take real actions during the query."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Install & First Query Check","questions":[{"q":"Where should you store your Anthropic API key?","options":["Hardcoded in your TypeScript file","In an environment variable (ANTHROPIC_API_KEY)","In a public GitHub repository","In the package.json file"],"correct":1,"explanation":"Always use environment variables for API keys. The SDK reads ANTHROPIC_API_KEY automatically. Never hardcode keys in source code or commit them to version control."},{"q":"What does the tools: \"defaults\" option enable?","options":["Internet access only","Built-in tools like Bash, Read, Write, Edit, Grep, and Glob","Access to third-party APIs","A graphical user interface"],"correct":1,"explanation":"The defaults preset gives Claude access to core system tools: terminal commands (Bash), file operations (Read, Write, Edit), and search (Grep, Glob). These are the fundamental capabilities that make an agent useful."},{"q":"You run your agent script and get: \"Cannot find module @anthropic-ai/claude-agent\". What is the most likely cause?","options":["Your API key is wrong","You need to upgrade Node.js","You did not run npm install in the project directory","The SDK does not exist"],"correct":2,"explanation":"This error means Node.js cannot find the installed package. Either you forgot to run npm install, or your terminal is in a different directory from where package.json and node_modules live."},{"q":"What information does the result object from query() contain?","options":["Only the text response","Text, cost, tool call count, and session ID","Only the session ID","The full conversation history"],"correct":1,"explanation":"The result object includes the text response, the cost in USD, how many tool calls were made, the session ID for resuming later, and other metadata about the query execution."},{"q":"An agent with tools enabled receives the prompt \"Read package.json\". What happens internally?","options":["Claude outputs the file contents from memory","The SDK runs a tool loop: Claude requests the Read tool, the SDK reads the file, sends contents back to Claude, Claude formulates a response","The SDK sends an HTTP request to a file server","Nothing — Claude cannot read files"],"correct":1,"explanation":"The SDK runs an automatic tool loop. Claude recognizes it needs to read a file, outputs a tool call request, the SDK executes the Read tool, returns the file contents to Claude, and Claude processes them into a response."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 2 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
