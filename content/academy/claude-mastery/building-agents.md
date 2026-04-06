---
title: "Building Agents"
course: "claude-mastery"
order: 10
type: "builder"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-mastery/">Claude Mastery</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Building Agents</h1>
  <p class="sub">The grand finale — design, configure, and build a real AI agent with working code</p>
</div>

<div class="content">
<div class="card">
<h2>What Is an AI Agent?</h2>
<p>An AI agent is Claude given a <strong>goal</strong>, <strong>tools</strong>, <strong>memory</strong>, and <strong>guardrails</strong> — then set free to accomplish complex tasks autonomously. Unlike simple prompting (one question, one answer), agents can plan multi-step workflows, execute actions, observe results, adapt their approach, and even ask for help when stuck.</p>

<p>You have already learned all the components. System prompts define the agent's identity. Chain-of-thought enables its reasoning. Tools give it hands. Now it is time to assemble them into something powerful.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin:1rem 0;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">The agent pattern in one sentence:</strong> A loop that keeps calling Claude with tools until the task is complete. That is it. Everything else — memory, guardrails, planning — is refinement on top of that core loop.
</div>
</div>

<div class="card">
<h2>The Four Components of an Agent</h2>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.88rem">1. Goal — What should the agent accomplish?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">A clear objective, defined in the system prompt. "Research the top 5 competitors and produce a comparison table." "Monitor this API endpoint every hour and alert if response time exceeds 500ms." The goal shapes every decision the agent makes.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.88rem">2. Tools — What can it do?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The set of actions available to the agent: web search, file read/write, database queries, API calls, email sending. More tools = more capable agent, but also more surface area for errors. Start minimal and add tools as needed.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.88rem">3. Memory — How does it retain context?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0"><strong>Conversation memory:</strong> The messages array — ephemeral, lost when the conversation ends. <strong>Persistent memory:</strong> Database-backed storage that survives across sessions. <strong>RAG memory:</strong> Vector search over documents for retrieval (see the RAG course).</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">4. Guardrails — What limits should it have?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Safety boundaries: max steps (prevent infinite loops), budget caps (prevent runaway API costs), human approval gates (for destructive actions like deleting data or sending emails), scope locks (prevent the agent from drifting to unrelated tasks).</p>
</div>
</div>
</div>

<div class="card">
<h2>Building an Agent from Scratch</h2>
<p>Here is a complete, working agent that can research topics using web search and produce structured reports. This code runs as-is with the Anthropic SDK:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — complete research agent</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic, json

client = anthropic.Anthropic()

<span style="color:#71717a"># Agent system prompt — defines identity, goal, and guardrails</span>
AGENT_SYSTEM = (
    <span style="color:#fbbf24">"You are a research agent. Your goal is to research topics "</span>
    <span style="color:#fbbf24">"thoroughly and produce structured reports.\n\n"</span>
    <span style="color:#fbbf24">"Process:\n"</span>
    <span style="color:#fbbf24">"1. Break the research question into sub-questions\n"</span>
    <span style="color:#fbbf24">"2. Use search to find information for each sub-question\n"</span>
    <span style="color:#fbbf24">"3. Synthesize findings into a structured report\n\n"</span>
    <span style="color:#fbbf24">"Rules:\n"</span>
    <span style="color:#fbbf24">"- Always cite your sources\n"</span>
    <span style="color:#fbbf24">"- If you cannot find reliable information, say so\n"</span>
    <span style="color:#fbbf24">"- Produce the final report in markdown format"</span>
)

<span style="color:#71717a"># Agent tools</span>
TOOLS = [
    {
        <span style="color:#fbbf24">"name"</span>: <span style="color:#fbbf24">"web_search"</span>,
        <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Search the web for current information."</span>,
        <span style="color:#fbbf24">"input_schema"</span>: {
            <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"object"</span>,
            <span style="color:#fbbf24">"properties"</span>: {
                <span style="color:#fbbf24">"query"</span>: {<span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>, <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Search query"</span>}
            },
            <span style="color:#fbbf24">"required"</span>: [<span style="color:#fbbf24">"query"</span>]
        }
    },
    {
        <span style="color:#fbbf24">"name"</span>: <span style="color:#fbbf24">"save_report"</span>,
        <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Save the final research report to a file."</span>,
        <span style="color:#fbbf24">"input_schema"</span>: {
            <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"object"</span>,
            <span style="color:#fbbf24">"properties"</span>: {
                <span style="color:#fbbf24">"filename"</span>: {<span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>},
                <span style="color:#fbbf24">"content"</span>: {<span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>}
            },
            <span style="color:#fbbf24">"required"</span>: [<span style="color:#fbbf24">"filename"</span>, <span style="color:#fbbf24">"content"</span>]
        }
    }
]

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">execute_tool</span>(name: str, params: dict) -> str:
    <span style="color:#c084fc">if</span> name == <span style="color:#fbbf24">"web_search"</span>:
        <span style="color:#71717a"># Replace with real search API (Brave, Tavily, etc.)</span>
        <span style="color:#c084fc">return</span> json.dumps({<span style="color:#fbbf24">"results"</span>: [<span style="color:#fbbf24">"Example search result..."</span>]})
    <span style="color:#c084fc">elif</span> name == <span style="color:#fbbf24">"save_report"</span>:
        <span style="color:#c084fc">with</span> open(params[<span style="color:#fbbf24">"filename"</span>], <span style="color:#fbbf24">"w"</span>) <span style="color:#c084fc">as</span> f:
            f.write(params[<span style="color:#fbbf24">"content"</span>])
        <span style="color:#c084fc">return</span> f<span style="color:#fbbf24">"Saved to {params['filename']}"</span>
    <span style="color:#c084fc">raise</span> ValueError(f<span style="color:#fbbf24">"Unknown tool: {name}"</span>)

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">run_agent</span>(task: str, max_steps: int = <span style="color:#fb923c">15</span>) -> str:
    <span style="color:#fb923c">"""Run the research agent until it completes the task."""</span>
    messages = [{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: task}]

    <span style="color:#c084fc">for</span> step <span style="color:#c084fc">in</span> range(max_steps):
        <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Step {step + 1}..."</span>)
        response = client.messages.create(
            model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
            max_tokens=<span style="color:#fb923c">4096</span>,
            system=AGENT_SYSTEM,
            tools=TOOLS,
            messages=messages
        )

        <span style="color:#71717a"># If done, return the final text</span>
        <span style="color:#c084fc">if</span> response.stop_reason == <span style="color:#fbbf24">"end_turn"</span>:
            <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text

        <span style="color:#71717a"># Process tool calls</span>
        messages.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: response.content})
        tool_results = []
        <span style="color:#c084fc">for</span> block <span style="color:#c084fc">in</span> response.content:
            <span style="color:#c084fc">if</span> block.type == <span style="color:#fbbf24">"tool_use"</span>:
                <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"  Calling {block.name}({block.input})"</span>)
                <span style="color:#c084fc">try</span>:
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"tool_result"</span>,
                        <span style="color:#fbbf24">"tool_use_id"</span>: block.id,
                        <span style="color:#fbbf24">"content"</span>: result
                    })
                <span style="color:#c084fc">except</span> Exception <span style="color:#c084fc">as</span> e:
                    tool_results.append({
                        <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"tool_result"</span>,
                        <span style="color:#fbbf24">"tool_use_id"</span>: block.id,
                        <span style="color:#fbbf24">"content"</span>: f<span style="color:#fbbf24">"Error: {e}"</span>,
                        <span style="color:#fbbf24">"is_error"</span>: True
                    })
        messages.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: tool_results})

    <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"Agent reached max steps."</span>

<span style="color:#71717a"># Run it</span>
report = run_agent(<span style="color:#fbbf24">"Research the current state of AI agents in 2026."</span>)
<span style="color:#34d399">print</span>(report)</code></pre>
</div>
</div>

<div class="card">
<h2>The Claude Agent SDK</h2>
<p>For production agents, Anthropic provides the <strong>Claude Agent SDK</strong> — a framework that handles the tool loop, guardrails, and multi-agent orchestration for you:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Claude Agent SDK (production pattern)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># pip install claude-agent-sdk</span>
<span style="color:#c084fc">from</span> claude_agent_sdk <span style="color:#c084fc">import</span> Agent, tool

<span style="color:#71717a"># Define tools as decorated functions</span>
@tool
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">web_search</span>(query: str) -> str:
    <span style="color:#fb923c">"""Search the web for current information."""</span>
    <span style="color:#71717a"># Your search implementation here</span>
    <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"Search results..."</span>

@tool
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">save_file</span>(filename: str, content: str) -> str:
    <span style="color:#fb923c">"""Save content to a file."""</span>
    <span style="color:#c084fc">with</span> open(filename, <span style="color:#fbbf24">"w"</span>) <span style="color:#c084fc">as</span> f:
        f.write(content)
    <span style="color:#c084fc">return</span> f<span style="color:#fbbf24">"Saved {filename}"</span>

<span style="color:#71717a"># Create and run the agent</span>
agent = Agent(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    instructions=<span style="color:#fbbf24">"You are a research agent. Research topics and produce reports."</span>,
    tools=[web_search, save_file],
    max_turns=<span style="color:#fb923c">15</span>,
)

result = agent.run(<span style="color:#fbbf24">"Research AI agents in 2026 and save a report."</span>)
<span style="color:#34d399">print</span>(result.final_text)</code></pre>
</div>
<p style="font-size:.85rem;color:#a1a1aa;margin-top:.5rem">The Agent SDK handles the tool loop, error handling, and turn limits for you. The <code>@tool</code> decorator automatically generates the JSON schema from your function's type hints and docstring.</p>
</div>

<div class="card">
<h2>Designing Your Agent — The Five Steps</h2>
<p>When building an agent, work through these five steps in order:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.88rem">Step 1: Define the Goal</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Write a clear, specific objective in the system prompt. "Research the top 5 competitors and produce a comparison table" is a goal. "Be helpful" is not.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.88rem">Step 2: Give Tools</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Start with 3-5 tools that cover the agent's core needs — web search, file read/write, database queries. Add more only as needed.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.88rem">Step 3: Set Memory</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Choose a memory strategy: conversation memory (ephemeral), persistent database storage, or RAG with vector search for document retrieval.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">Step 4: Add Guardrails</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Set max steps to prevent infinite loops, add budget caps, and require human approval for destructive actions like sending emails or deleting data.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
<strong style="color:#f472b6;font-size:.88rem">Step 5: Deploy</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Launch the agent, monitor its behavior, and iterate. Start with simple tasks and gradually increase complexity as you build confidence in its reliability.</p>
</div>
</div>
</div>

<div class="card">
<h2>Agent Anti-Patterns</h2>
<p>These are the mistakes that cause agent failures in production:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">No max steps guard</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Without a step limit, an agent can loop forever — burning API credits and never completing. Always set <code>max_steps</code> or <code>max_turns</code>. Start with 10-15 and increase if the agent genuinely needs more.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Too many tools</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">More tools means more confusion. Claude has to choose between all of them, and with 20+ tools it starts making poor choices. Start with 3-5 tools and add more only when the agent clearly needs them.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">No human approval for destructive actions</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">An agent that can delete files, send emails, or spend money without confirmation is a liability. Gate all destructive actions behind human approval. "Are you sure you want to send this email to 500 people?"</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Vague goal in the system prompt</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"Be helpful" is not a goal. "Research the top 5 competitors, compare them on pricing, features, and market share, and produce a markdown table" is a goal. Specificity prevents drift.</p>
</div>
</div>
</div>

<div class="card">
<div style="text-align:center;padding:2rem 0">
<h2 style="font-size:1.8rem;margin-bottom:.5rem;background:linear-gradient(135deg,#8b5cf6,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Course Complete!</h2>
<p style="color:#a1a1aa;font-size:1rem;margin-bottom:2rem">You have mastered Claude — from fundamentals to building production agents.</p>
<div style="display:flex;justify-content:center;gap:2rem;margin-bottom:2rem">
<div><div style="font-size:2rem;font-weight:800;color:#8b5cf6">10</div><div style="font-size:.8rem;color:#71717a">Lessons</div></div>
<div><div style="font-size:2rem;font-weight:800;color:#fb923c">2,400</div><div style="font-size:.8rem;color:#71717a">XP Earned</div></div>
<div><div style="font-size:2rem;font-weight:800;color:#34d399">12</div><div style="font-size:.8rem;color:#71717a">Hours</div></div>
</div>
<p style="font-size:.85rem;color:#71717a">Next steps: Build your own agent, explore MCP servers, or check out the RAG & Vector Search course for retrieval-augmented generation.</p>
</div>
</div>


<div data-learn="FlashDeck" data-props='{"title":"AI Agent Architecture","cards":[{"front":"What is an AI agent?","back":"Claude given a goal, tools, memory, and guardrails — then set free to accomplish complex tasks autonomously. The core pattern is a tool loop that keeps calling Claude until the task is complete."},{"front":"The four agent components","back":"1. Goal (system prompt), 2. Tools (actions it can take), 3. Memory (conversation, persistent, or RAG), 4. Guardrails (max steps, human approval, budget caps)."},{"front":"The tool loop pattern","back":"A while loop: call Claude with tools \u2192 if stop_reason is tool_use, execute tools and send results back \u2192 repeat until stop_reason is end_turn. This is the foundation of ALL agents."},{"front":"Claude Agent SDK","back":"Anthropic\u0027s production framework for building agents. Handles the tool loop, error handling, and multi-agent orchestration. The @tool decorator auto-generates JSON schemas from type hints."},{"front":"When to require human approval","back":"Before destructive actions: deleting data, sending emails, spending money, modifying permissions, or any irreversible operation. Gate these with explicit human confirmation."}]}'></div>
<div data-learn="QuizMC" data-props='{"title":"Building Agents Quiz","questions":[{"q":"What is the core pattern behind every AI agent?","options":["A single large prompt","A tool loop that keeps calling Claude until the task is complete","A database of pre-written responses","A fine-tuned model"],"correct":1,"explanation":"Every agent is fundamentally a tool loop: call Claude, process tool calls, send results back, repeat until done. Everything else (memory, guardrails, planning) is built on top of this core loop."},{"q":"An agent has access to 25 tools. What is likely to happen?","options":["It will be extremely capable","It will make poor tool choices — too many options cause confusion","It will run faster","It will automatically organize the tools into categories"],"correct":1,"explanation":"More tools means more confusion for the model. With 25+ tools, Claude has to evaluate each one for every decision, leading to poor tool selection. Start with 3-5 tools and add more only when clearly needed."},{"q":"You are deploying a support agent that can send emails and close tickets. Which guardrail is most critical?","options":["Budget limit","Human approval before sending emails or closing tickets","Full logging","Scope lock to support topics only"],"correct":1,"explanation":"Sending emails and closing tickets are real-world, potentially irreversible actions. A human approval gate ensures the agent cannot take these actions without explicit confirmation. This is the most critical guardrail for agents with real-world effects."},{"q":"What does the Claude Agent SDK provide over a raw tool loop?","options":["A different AI model","Built-in tool loop, error handling, turn limits, and multi-agent orchestration","Faster API responses","Free API credits"],"correct":1,"explanation":"The Agent SDK handles the tool loop, error handling, and turn limits automatically. The @tool decorator generates JSON schemas from type hints. For production agents, this saves significant boilerplate code."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 10 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3 · Final</span>
</div>
</div>
