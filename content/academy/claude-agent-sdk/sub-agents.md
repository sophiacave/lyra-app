---
title: "Sub-Agents & Delegation"
course: "claude-agent-sdk"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-agent-sdk/">Claude Agent SDK</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Sub-Agents & Delegation</h1>
  <p class="sub">Build teams of specialized agents that divide, conquer, and collaborate</p>
</div>

<div class="content">

<div class="card">
<h2>Why Sub-Agents?</h2>
<p>A single agent with every tool and responsibility quickly becomes unwieldy. It is like having one employee who does sales, engineering, accounting, and customer support — they will be mediocre at everything. The solution is <strong style="color:#e5e5e5">delegation</strong>: a main agent that coordinates specialized sub-agents, each focused on what it does best.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> A film director does not operate the camera, write the script, compose the music, and edit the footage. They coordinate specialists. Your main agent is the director. Sub-agents are the crew — each with a specific role, specific tools, and specific instructions.
</div>
</div>

<div class="card">
<h2>Defining Sub-Agents</h2>
<p>The SDK lets you define sub-agents using the <code>agents</code> option. Each sub-agent gets its own name, instructions, model, and tools. The main agent can delegate tasks to any sub-agent by name:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — defining a team of sub-agents</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> { Claude } <span style="color:#c084fc">from</span> <span style="color:#fbbf24">"@anthropic-ai/claude-agent"</span>;

<span style="color:#c084fc">const</span> agent = <span style="color:#c084fc">new</span> Claude({
  model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
  tools: <span style="color:#fbbf24">"defaults"</span>,
  systemPrompt: <span style="color:#fbbf24">`You are a project manager. Delegate tasks to your team:
- Use the "researcher" agent for gathering information
- Use the "coder" agent for writing and editing code
- Use the "reviewer" agent for quality checks
Coordinate their work and report the final result.`</span>,

  <span style="color:#71717a">// Define specialized sub-agents</span>
  agents: [
    {
      name: <span style="color:#fbbf24">"researcher"</span>,
      model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
      tools: [<span style="color:#fbbf24">"Read"</span>, <span style="color:#fbbf24">"Grep"</span>, <span style="color:#fbbf24">"Glob"</span>],  <span style="color:#71717a">// read-only tools</span>
      instructions: <span style="color:#fbbf24">"You are a code researcher. Find information in the codebase. Be thorough and report what you find accurately."</span>,
    },
    {
      name: <span style="color:#fbbf24">"coder"</span>,
      model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
      tools: [<span style="color:#fbbf24">"Read"</span>, <span style="color:#fbbf24">"Write"</span>, <span style="color:#fbbf24">"Edit"</span>, <span style="color:#fbbf24">"Bash"</span>],
      instructions: <span style="color:#fbbf24">"You are a senior developer. Write clean, tested code. Always include error handling."</span>,
    },
    {
      name: <span style="color:#fbbf24">"reviewer"</span>,
      model: <span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
      tools: [<span style="color:#fbbf24">"Read"</span>, <span style="color:#fbbf24">"Grep"</span>],  <span style="color:#71717a">// can read but not modify</span>
      instructions: <span style="color:#fbbf24">"You are a code reviewer. Check for bugs, security issues, and best practices. Be specific about problems and suggest fixes."</span>,
    },
  ],
});

<span style="color:#71717a">// The main agent coordinates all three sub-agents</span>
<span style="color:#c084fc">const</span> result = <span style="color:#c084fc">await</span> agent.query(
  <span style="color:#fbbf24">"Add input validation to the user registration endpoint in src/routes/auth.ts"</span>
);

<span style="color:#34d399">console</span>.log(result.text);</code></pre>
</div>
</div>

<div class="card">
<h2>How Delegation Works</h2>
<p>When the main agent needs to delegate, it uses a sub-agent like a tool call. The flow looks like this:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:#a1a1aa;line-height:1.8;overflow-x:auto">
<pre style="margin:0;color:#e5e5e5"><code>Main agent receives: "Add input validation to auth.ts"

<span style="color:#8b5cf6">Step 1</span>  Main agent delegates to "researcher"
        → "Find the current auth.ts code and identify what
           validation is missing"
<span style="color:#34d399">Result</span>  Researcher reads files, reports findings

<span style="color:#8b5cf6">Step 2</span>  Main agent delegates to "coder"
        → "Add email format validation and password strength
           checks based on the researcher's findings"
<span style="color:#34d399">Result</span>  Coder writes the updated code

<span style="color:#8b5cf6">Step 3</span>  Main agent delegates to "reviewer"
        → "Review the changes the coder made for security
           issues and edge cases"
<span style="color:#34d399">Result</span>  Reviewer approves or flags issues

<span style="color:#f472b6">Final</span>   Main agent summarizes what was done</code></pre>
</div>

<p style="font-size:.85rem;color:#a1a1aa;line-height:1.7">Each sub-agent runs independently with its own context, tools, and instructions. The main agent sees their results and decides what to do next. This is the <strong>hub-and-spoke</strong> pattern — one coordinator, many specialists.</p>
</div>

<div class="card">
<h2>Design Patterns for Sub-Agents</h2>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.88rem">Hub-and-Spoke</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">One main agent delegates to specialists. Best for tasks that have clear phases (research, implement, review). The main agent coordinates and synthesizes.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.88rem">Pipeline</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Each agent passes its output to the next. Best for sequential workflows: draft > review > polish > publish. Each stage has different expertise.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">Specialist Pool</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Multiple agents with different expertise available for the main agent to consult. Best when you do not know in advance which specialists will be needed.</p>
</div>
</div>
</div>

<div class="card">
<h2>Key Takeaways</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Each sub-agent gets minimal tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">A researcher only needs Read and Grep. A reviewer should not have Write access. Least privilege applies to sub-agents too.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">Specific instructions outperform generic ones</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">"You are a code reviewer" is weaker than "You are a code reviewer specializing in security. Flag SQL injection, XSS, and CSRF vulnerabilities. Cite line numbers."</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Sub-agents can use different models</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Use Opus for the reviewer (needs deep analysis), Sonnet for the coder (balanced), and Haiku for simple research tasks. Match cost to complexity.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Sub-Agents & Delegation","cards":[{"front":"What is a sub-agent?","back":"A specialized child agent defined within a main agent. Each sub-agent has its own name, instructions, model, and tools. The main agent delegates tasks to sub-agents and coordinates their work."},{"front":"Hub-and-Spoke pattern","back":"One main agent (hub) delegates to specialist sub-agents (spokes). The main agent coordinates, synthesizes results, and decides next steps. Best for tasks with clear phases like research, implement, review."},{"front":"Pipeline pattern","back":"Each agent passes output to the next in sequence. Draft > Review > Polish > Publish. Best for workflows where each stage requires different expertise."},{"front":"How does the main agent delegate?","back":"The main agent uses sub-agents like tool calls. It specifies which agent to delegate to and what task to give it. The sub-agent runs independently and returns its result."},{"front":"Can sub-agents use different models?","back":"Yes. Use Opus for complex analysis tasks, Sonnet for general coding, and Haiku for simple classification or search. Match model capability and cost to each sub-agent role."},{"front":"Least privilege for sub-agents","back":"Give each sub-agent only the tools it needs. A researcher gets Read and Grep. A reviewer gets Read only. A coder gets Read, Write, Edit. Never give all tools to all agents."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Sub-Agents Check","questions":[{"q":"Why use sub-agents instead of one agent with all tools?","options":["Sub-agents are cheaper","Specialized agents with focused instructions perform better than one generalist agent","Sub-agents run faster","You must use sub-agents for all tasks"],"correct":1,"explanation":"Just like specialized employees outperform generalists, sub-agents with focused instructions, specific tools, and clear roles produce better results than one agent trying to do everything."},{"q":"A code review sub-agent should have which tools?","options":["Read, Write, Edit, Bash — full access","Read and Grep only — it should analyze, not modify","Write and Edit only — it needs to fix issues","No tools — it should work from memory"],"correct":1,"explanation":"A reviewer should analyze code without modifying it. Read and Grep let it examine files and search for patterns. Write access would blur the line between reviewing and implementing."},{"q":"In the hub-and-spoke pattern, who decides which sub-agent to use?","options":["The user specifies in the prompt","The main agent decides based on the task","Sub-agents volunteer","They are called in alphabetical order"],"correct":1,"explanation":"The main agent acts as the coordinator (hub). Based on the task and its system prompt instructions, it autonomously decides which sub-agent to delegate to and what task to give them."},{"q":"You have a complex research task and a simple classification task. How should you assign models to sub-agents?","options":["Use Opus for both","Use Haiku for both","Opus for research, Haiku for classification","Use the same model for all sub-agents always"],"correct":2,"explanation":"Match model cost to task complexity. Opus excels at deep research and analysis. Haiku handles simple classification efficiently at a fraction of the cost. Using the right model for each sub-agent optimizes both quality and budget."},{"q":"What happens when a sub-agent finishes its task?","options":["It shuts down permanently","Its result is returned to the main agent, which decides what to do next","It automatically starts the next task","It asks the user for more work"],"correct":1,"explanation":"Sub-agent results flow back to the main agent. The main agent reads the result, decides if additional delegation is needed, and continues coordinating until the overall task is complete."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 6 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
