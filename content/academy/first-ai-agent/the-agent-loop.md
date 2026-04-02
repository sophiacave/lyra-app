---
title: "The Agent Loop"
course: "first-ai-agent"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">&larr; Course</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 2</div>
  <h1>The Agent Loop</h1>
  <p class="subtitle">Every agent runs the same fundamental cycle: Perceive, Think, Act, Observe, Learn. This is the pattern behind every autonomous AI system — from Claude Code to self-driving cars. Here is how it works, in theory and in code.</p>

  <div class="section">
    <h2>The Five Steps</h2>
    <p>Click each node on the loop to explore what happens at every step:</p>
    <canvas id="loop-canvas"></canvas>
    <p class="hint">Click any node on the loop to explore it</p>

    <div class="info-panel" id="info">
      <h3 id="info-title">The Loop</h3>
      <p id="info-desc">This is the heartbeat of every AI agent. Unlike a chatbot that responds once and stops, an agent cycles through these five steps continuously until its goal is achieved. Click a node above to dive in.</p>
    </div>
  </div>

  <div class="section">
    <h2>The Loop in Code</h2>
    <p>Here is a minimal but complete agent loop in Python. Every agent framework (LangChain, CrewAI, Claude Agent SDK) implements this same pattern under the hood:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># agent_loop.py — The fundamental agent pattern</span><br>
      <span style="color:#c084fc">import</span> <span style="color:#e2e8f0">anthropic</span><br>
      <br>
      <span style="color:#e2e8f0">client</span> = <span style="color:#e2e8f0">anthropic</span>.<span style="color:#34d399">Anthropic</span>()<br>
      <br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">agent_loop</span>(<span style="color:#e2e8f0">goal</span>, <span style="color:#e2e8f0">tools</span>, <span style="color:#e2e8f0">max_turns</span>=<span style="color:#fb923c">10</span>):<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">memory</span> = []&nbsp;&nbsp;<span style="color:#71717a"># Conversation history = agent memory</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">turn</span> = <span style="color:#fb923c">0</span><br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">while</span> <span style="color:#e2e8f0">turn</span> < <span style="color:#e2e8f0">max_turns</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># STEP 1: PERCEIVE — gather current state</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">messages</span> = <span style="color:#e2e8f0">memory</span> + [{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#e2e8f0">goal</span> <span style="color:#c084fc">if</span> <span style="color:#e2e8f0">turn</span> == <span style="color:#fb923c">0</span> <span style="color:#c084fc">else</span> <span style="color:#fb923c">"Continue working toward the goal."</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;}]<br>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># STEP 2: THINK — LLM reasons about what to do</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">response</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">model</span>=<span style="color:#fb923c">"claude-sonnet-4-6"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">max_tokens</span>=<span style="color:#fb923c">1024</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">system</span>=<span style="color:#fb923c">f"You are an agent. Goal: {goal}"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">tools</span>=<span style="color:#e2e8f0">tools</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">messages</span>=<span style="color:#e2e8f0">messages</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;)<br>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># STEP 3: ACT — execute any tool calls</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">stop_reason</span> == <span style="color:#fb923c">"tool_use"</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">for</span> <span style="color:#e2e8f0">block</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">block</span>.<span style="color:#e2e8f0">type</span> == <span style="color:#fb923c">"tool_use"</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># STEP 4: OBSERVE — run the tool and get result</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">result</span> = <span style="color:#34d399">execute_tool</span>(<span style="color:#e2e8f0">block</span>.<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">block</span>.<span style="color:#e2e8f0">input</span>)<br>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># STEP 5: LEARN — store result in memory</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">memory</span>.<span style="color:#34d399">append</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"assistant"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">memory</span>.<span style="color:#34d399">append</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: [{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"tool_result"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"tool_use_id"</span>: <span style="color:#e2e8f0">block</span>.<span style="color:#e2e8f0">id</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#e2e8f0">result</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">else</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># No tool call = agent is done</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span>[<span style="color:#fb923c">0</span>].<span style="color:#e2e8f0">text</span><br>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">turn</span> += <span style="color:#fb923c">1</span><br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#fb923c">"Max turns reached without completion"</span>
    </div>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:70px">Line 10</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>PERCEIVE</strong> — The agent gathers its current state: the goal, its memory of past actions, and the current turn.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="color:#34d399;font-weight:700;font-size:.8rem;min-width:70px">Line 16</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>THINK</strong> — Claude receives everything (goal + memory + tools) and reasons about what to do next. This is the intelligence.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:70px">Line 25</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>ACT</strong> — If Claude decided to use a tool, <code>execute_tool()</code> runs it for real — reading files, calling APIs, querying databases.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(96,165,250,.04);border:1px solid rgba(96,165,250,.08)">
        <span style="color:#60a5fa;font-weight:700;font-size:.8rem;min-width:70px">Line 28</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>OBSERVE</strong> — The tool result is captured. Did the API return data? Did the file write succeed? The agent sees what happened.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.08)">
        <span style="color:#f472b6;font-weight:700;font-size:.8rem;min-width:70px">Line 29</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>LEARN</strong> — The tool result is appended to memory. On the next loop, Claude sees everything that happened and can build on it.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Why the Loop Matters</h2>
    <p>A chatbot calls the LLM once and returns the result. An agent calls the LLM in a loop, feeding each result back as context for the next decision. This is the difference between "answer a question" and "solve a problem."</p>

    <div style="display:flex;gap:1rem;margin:1.5rem 0;flex-wrap:wrap">
      <div style="flex:1;min-width:200px;padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Chatbot (1 call)</strong>
        <div style="font-size:.8rem;color:#a1a1aa;margin-top:.4rem">
          User: "What is the weather?"<br>
          AI: "I cannot check the weather."<br>
          <em>Done. No tools. No loop.</em>
        </div>
      </div>
      <div style="flex:1;min-width:200px;padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Agent (3 loops)</strong>
        <div style="font-size:.8rem;color:#a1a1aa;margin-top:.4rem">
          Loop 1: Call weather API &rarr; get forecast<br>
          Loop 2: Check calendar &rarr; find outdoor meeting<br>
          Loop 3: Send email &rarr; "Bring an umbrella"<br>
          <em>Problem solved autonomously.</em>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Stop Condition</h2>
    <p>Every loop needs a way to stop. Without a stop condition, your agent runs forever. There are three ways agents decide to stop:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">1. Goal achieved</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — The LLM decides the task is complete and responds with text instead of a tool call. In the code above, this is the <code>else</code> branch on line 37 — when <code>stop_reason</code> is not <code>"tool_use"</code>, the loop exits.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">2. Max turns reached</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Safety limit. The <code>max_turns=10</code> parameter prevents runaway agents. If the agent cannot solve the problem in 10 loops, something is wrong — stop and report.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">3. Unrecoverable error</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — A tool fails and there is no fallback. A good agent catches the error, logs what happened, and returns a useful message instead of crashing silently.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Real-World Agent Loops</h2>
    <p>The same loop pattern powers vastly different systems. The only thing that changes is what tools are available and what the goal is:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.75rem;min-width:100px">CLAUDE CODE</span>
        <span style="font-size:.85rem;color:#a1a1aa">Perceive: read user request + codebase. Think: plan changes. Act: edit files, run tests. Observe: did tests pass? Learn: remember what worked. Loop until all tests green.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#fb923c;font-weight:700;font-size:.75rem;min-width:100px">CUSTOMER SUPPORT</span>
        <span style="font-size:.85rem;color:#a1a1aa">Perceive: read ticket. Think: classify intent. Act: search knowledge base. Observe: is the answer relevant? Learn: draft response. Loop until resolution or escalation.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#34d399;font-weight:700;font-size:.75rem;min-width:100px">DATA PIPELINE</span>
        <span style="font-size:.85rem;color:#a1a1aa">Perceive: new data arrives. Think: what transformations needed? Act: query database, clean data. Observe: are results valid? Learn: log metrics. Loop until pipeline complete.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Common Loop Failures</h2>
    <p>Understanding how loops break makes you a better agent builder:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Infinite loop</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Agent keeps calling tools but never makes progress toward the goal. <strong>Fix:</strong> <code>max_turns</code> limit + progress detection. If the last 3 tool results are identical, stop.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Context overflow</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Memory grows so large the LLM cannot process it. <strong>Fix:</strong> Summarize old memory. Keep recent results full, compress older ones. Production agents use sliding windows.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Wrong tool selection</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Agent calls the database when it needs web search, or vice versa. <strong>Fix:</strong> Clear tool descriptions in the system prompt. Each tool should say exactly what it does and when to use it.</span>
      </div>
    </div>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 2 of 10 &middot; Build Your First AI Agent</p>
</footer>
<div data-learn="FlashDeck" data-props='{"title":"Agent Loop Concepts","cards":[{"front":"Perceive","back":"The agent takes in information from its environment — a user message, API response, file change, or scheduled trigger. Perception is how the agent knows something needs doing."},{"front":"Think","back":"The agent reasons about what it perceived, considering its goal, memory, and context. The LLM combines all inputs to decide the best next action. This is the intelligence step."},{"front":"Act","back":"The agent calls a tool — sending an email, querying a database, making an API call, writing a file. This is what separates agents from chatbots: they do things in the real world."},{"front":"Observe","back":"After acting, the agent checks the result. Did the API call succeed? Was the data valid? Observation closes the feedback loop and enables self-correction."},{"front":"Learn","back":"The agent updates its memory with the outcome. What worked, what failed, what new information was discovered. Each loop becomes smarter than the last."},{"front":"stop_reason: tool_use","back":"When Claude returns stop_reason=tool_use, it means the model wants to call a tool. Your code executes the tool and feeds the result back. When stop_reason is end_turn, the agent is done."},{"front":"max_turns","back":"A safety limit on how many loops an agent can run. Prevents runaway agents that loop forever without making progress. Typical values: 5-25 depending on task complexity."},{"front":"Context overflow","back":"When memory grows so large the LLM cannot process it. Fix by summarizing old memory (keep recent results full, compress older ones) or using a sliding window."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"The Agent Loop","questions":[{"q":"What is the correct order of the agent loop steps?","options":["Think → Act → Perceive → Learn → Observe","Perceive → Think → Act → Observe → Learn","Act → Observe → Think → Learn → Perceive","Learn → Perceive → Think → Act → Observe"],"correct":1,"explanation":"The agent loop always starts with Perceive (taking in input), then Think (reasoning about what to do), Act (calling a tool), Observe (checking the result), and Learn (updating memory). Then it loops back."},{"q":"In the Python code, what tells the loop the agent is finished?","options":["The agent calls a special done() function","The stop_reason is not tool_use — meaning the agent responded with text instead of a tool call","The max_turns variable reaches zero","The memory list becomes empty"],"correct":1,"explanation":"When Claude responds with text instead of requesting a tool call, stop_reason will be end_turn instead of tool_use. This means the agent has decided its goal is achieved and the loop exits."},{"q":"Why is max_turns important?","options":["It makes the agent run faster","It prevents runaway agents that loop forever without making progress","It determines the model to use","It controls the response length"],"correct":1,"explanation":"Without max_turns, a confused agent could loop indefinitely — calling tools, getting results, but never making progress. The limit is a safety net that forces the agent to stop and report after a set number of iterations."},{"q":"An agent keeps calling the same tool with the same input across 5 loops. What is happening?","options":["The agent is working correctly but slowly","The agent is stuck in an infinite loop — it is not learning from results","The tool is broken","The max_turns is set too high"],"correct":1,"explanation":"If the agent repeats the same action without progress, it is failing to learn from the Observe step. The tool result is not changing the agent reasoning. This is the infinite loop failure mode — fix with progress detection or better tool result formatting."}]}'></div>
