---
title: "Tool Use"
course: "claude-agent-sdk"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Tool Use</h1>
  <p class="sub">Give your agent hands: Bash, file tools, search, and custom permissions</p>
</div>

<div class="content">

<div class="card">
<h2>Tools Are What Make Agents Useful</h2>
<p>An AI that can only talk is a chatbot. An AI that can <em>act</em> is an agent. Tools are the bridge. When you give Claude tools, you give it the ability to interact with the real world — read files, run commands, search code, write output, and more.</p>

<p>The Agent SDK ships with a set of <strong style="color:#e5e5e5">built-in tools</strong> that cover the most common agent operations. You do not need to define these yourself — they come ready to use with the <code>tools</code> configuration option.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Think of tools as apps on a phone. The phone (Claude) is smart on its own, but it becomes transformative when it can open maps, send messages, check the weather, and take photos. Each tool is one capability. The more tools you provide, the more your agent can do.
</div>
</div>

<div class="card">
<h2>The Built-In Tools</h2>
<p>When you set <code>tools: "defaults"</code>, your agent gets access to these core tools:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Bash</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Run terminal commands. Install packages, run scripts, execute programs, check system status. The most powerful tool — and the one that requires the most caution.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(56,189,248,.06);border-radius:10px;border:1px solid rgba(56,189,248,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#38bdf8;margin-bottom:.2rem">Read</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Read file contents. Supports text files, images, PDFs, and Jupyter notebooks. Can read specific line ranges for large files.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Write</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Create new files or overwrite existing ones. The agent uses this to generate code, write reports, or create configuration files.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Edit</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Make surgical changes to existing files. Sends only the diff instead of rewriting the entire file. More efficient and safer than Write for modifications.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(244,114,182,.06);border-radius:10px;border:1px solid rgba(244,114,182,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#f472b6;margin-bottom:.2rem">Grep</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Search file contents for patterns. Find function definitions, error messages, configuration values — anything in your codebase.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(250,204,21,.06);border-radius:10px;border:1px solid rgba(250,204,21,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#facc15;margin-bottom:.2rem">Glob</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Find files by name pattern. <code>**/*.ts</code> finds all TypeScript files. <code>src/**/test.*</code> finds test files in src. Fast file discovery.</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Tools in Action</h2>
<p>Here is an agent that uses multiple tools to accomplish a real task — analyzing a project structure:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — multi-tool agent</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
  systemPrompt: <span style="color:#fbbf24">`You are a code analyst. When asked about a project:
1. Use Glob to find all source files
2. Use Read to examine key files (package.json, main entry)
3. Use Grep to find patterns the user asks about
4. Summarize your findings clearly.`</span>,
});

<span style="color:#71717a">// The agent will chain multiple tools automatically</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Analyze this project. What framework does it use? How is it structured?"</span>
);

<span style="color:#34d399">console</span>.log(result.text);
<span style="color:#71717a">// Claude uses Glob to find files, Read to examine them,</span>
<span style="color:#71717a">// and produces a detailed analysis</span></code></pre>
</div>
</div>

<div class="card">
<h2>Controlling Tool Permissions</h2>
<p>Not every agent should have access to every tool. The <code>canUseTool</code> callback lets you control exactly which tools your agent can use — and even approve or deny specific invocations based on their parameters:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — custom tool permissions</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,

  <span style="color:#71717a">// Control which tools the agent can use</span>
  canUseTool: (tool, params) => {
    <span style="color:#71717a">// Block Bash entirely — read-only agent</span>
    <span style="color:#c084fc">if</span> (tool === <span style="color:#fbbf24">"Bash"</span>) <span style="color:#c084fc">return false</span>;

    <span style="color:#71717a">// Block writes outside the project directory</span>
    <span style="color:#c084fc">if</span> (tool === <span style="color:#fbbf24">"Write"</span> && !params.file_path?.startsWith(<span style="color:#fbbf24">"/project/"</span>)) {
      <span style="color:#c084fc">return false</span>;
    }

    <span style="color:#71717a">// Allow everything else</span>
    <span style="color:#c084fc">return true</span>;
  },
});

<span style="color:#71717a">// This agent can read and search, but cannot run commands</span>
<span style="color:#71717a">// or write files outside /project/</span></code></pre>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7">The <code>canUseTool</code> function is called every time Claude wants to use a tool. Return <code>true</code> to allow, <code>false</code> to deny. This is your security boundary — the place where you enforce what your agent can and cannot do.</p>
</div>

<div class="card">
<h2>Selecting Specific Tools</h2>
<p>Instead of the full defaults set, you can enable only the tools you need:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — selective tool loading</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a">// Read-only agent — can look but not touch</span>
<span style="color:#c084fc">const</span> readOnlyAgent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: [<span style="color:#fbbf24">"Read"</span>, <span style="color:#fbbf24">"Grep"</span>, <span style="color:#fbbf24">"Glob"</span>],  <span style="color:#71717a">// no Bash, Write, or Edit</span>
});

<span style="color:#71717a">// Code editor agent — can read and modify files</span>
<span style="color:#c084fc">const</span> editorAgent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: [<span style="color:#fbbf24">"Read"</span>, <span style="color:#fbbf24">"Write"</span>, <span style="color:#fbbf24">"Edit"</span>, <span style="color:#fbbf24">"Grep"</span>, <span style="color:#fbbf24">"Glob"</span>],  <span style="color:#71717a">// no Bash</span>
});

<span style="color:#71717a">// Full power agent — can do everything</span>
<span style="color:#c084fc">const</span> fullAgent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,  <span style="color:#71717a">// all built-in tools</span>
});</code></pre>
</div>
</div>

<div class="card">
<h2>Key Takeaways</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Least privilege principle</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Give your agent only the tools it needs for its job. A code reviewer does not need Bash. A file analyzer does not need Write. Fewer tools means fewer ways things can go wrong.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">canUseTool is your security boundary</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Use it to enforce path restrictions, block dangerous commands, and implement business logic around tool access. This callback is called on every tool invocation.</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Claude chains tools automatically</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">You do not need to orchestrate tool calls. Claude decides which tools to use, in what order, based on the task. The SDK handles the execution loop.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Tool Use Essentials","cards":[{"front":"What does tools: \"defaults\" include?","back":"Six built-in tools: Bash (terminal commands), Read (file contents), Write (create/overwrite files), Edit (surgical file changes), Grep (content search), and Glob (file pattern matching)."},{"front":"Bash tool","back":"Runs terminal commands. The most powerful tool — can install packages, run scripts, execute programs. Also the most dangerous. Consider disabling it for read-only agents."},{"front":"Read vs. Grep vs. Glob","back":"Read opens a specific file and returns its contents. Grep searches inside files for text patterns. Glob finds files by name patterns (like **/*.ts). Each serves a different search need."},{"front":"Write vs. Edit","back":"Write creates new files or completely overwrites existing ones. Edit makes surgical changes by sending only the diff. Edit is safer and more efficient for modifying existing files."},{"front":"canUseTool callback","back":"A function called before every tool invocation. Receives the tool name and parameters. Return true to allow, false to deny. This is your primary security boundary for controlling agent behavior."},{"front":"Least privilege principle for tools","back":"Give your agent only the tools it needs. A code reviewer needs Read and Grep, not Bash and Write. Fewer tools = smaller attack surface = safer agent."},{"front":"How does Claude choose which tools to use?","back":"Claude reads the tool names and descriptions, evaluates the user request, and autonomously decides which tools to call and in what order. You provide tools; Claude picks the right ones."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Tool Use Comprehension","questions":[{"q":"Which built-in tool would an agent use to find all Python files in a project?","options":["Bash","Read","Grep","Glob"],"correct":3,"explanation":"Glob matches files by name patterns. To find all Python files, Claude would use Glob with a pattern like **/*.py. Grep searches inside files for content. Bash could work (using find) but Glob is the purpose-built tool."},{"q":"You want to build a read-only agent that can analyze code but never modify anything. Which configuration is correct?","options":["tools: \"defaults\" (and hope Claude does not write)","tools: [\"Read\", \"Grep\", \"Glob\"]","tools: [\"Read\", \"Write\", \"Edit\"]","tools: [] (no tools at all)"],"correct":1,"explanation":"Selecting only Read, Grep, and Glob gives the agent analysis capabilities without any ability to modify files or run commands. This is the least privilege approach — the agent physically cannot write or execute."},{"q":"What does the canUseTool callback receive?","options":["The user prompt only","The tool name and its parameters","The complete conversation history","The API key"],"correct":1,"explanation":"canUseTool receives the tool name (like \"Write\" or \"Bash\") and the parameters Claude wants to pass (like file_path or command). You can inspect both to decide whether to allow the call."},{"q":"An agent needs to fix a single line in a 500-line file. Which tool should it use?","options":["Write (rewrite the entire file)","Edit (send only the diff)","Bash (use sed)","Read (and hope for the best)"],"correct":1,"explanation":"Edit sends only the changed portion (the diff), which is more efficient and safer than rewriting the entire 500-line file with Write. Edit preserves everything you did not change."},{"q":"Why is the Bash tool considered the most powerful AND most dangerous?","options":["It is the slowest tool","It can execute any terminal command, including destructive ones","It costs more API credits","It only works on Linux"],"correct":1,"explanation":"Bash can run any command the user has permission for — including rm -rf, git push --force, or downloading malicious scripts. It is enormously powerful for legitimate use, but it requires careful permission controls."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 4 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
