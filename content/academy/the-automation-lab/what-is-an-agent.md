---
title: "What Is an Agent?"
course: "the-automation-lab"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-automation-lab/">The Automation Lab</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>What Is an Agent?</h1>
  <p class="sub">Most "AI" you have used is actually just automation — a trigger, an action, done. An agent is fundamentally different: it perceives, decides, acts, and adapts in a continuous loop. This lesson teaches you to tell the difference and understand why it matters.</p>
</div>

  <div class="section">
    <h2>The Core Distinction</h2>
    <p>An <strong>automation</strong> follows a fixed path. A new email arrives, a rule moves it to a folder. A timer fires, a script sends a report. There is no thinking, no adapting — just a trigger and a pre-programmed response. If the input changes, the automation does not care. It runs the same steps regardless.</p>

    <p>An <strong>agent</strong> is a system that runs a continuous loop: <em>perceive → decide → act → learn</em>. It observes its environment, reasons about what it sees, takes real actions, and updates its understanding based on the outcome. If the input changes, the agent changes its behavior. This is the fundamental difference.</p>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Definition:</strong> An AI agent is a software system that can (1) observe its environment through sensors or data inputs, (2) make autonomous decisions based on goals and observations, (3) take real actions that affect the world, and (4) learn from outcomes to improve over time. It operates in a <strong>continuous loop</strong>, not a one-shot pipeline.
    </div>
  </div>

  <div class="section">
    <h2>Automation vs. Agent — Side by Side</h2>
    <p><strong>Watch both systems run.</strong> The automation fires once and stops. The agent loops continuously, adapting to what it finds.</p>
  </div>

  <div class="comparison">
    <div class="panel auto">
      <div class="panel-label">Automation</div>
      <div class="pipeline" id="autoPipeline">
        <div class="node node-auto" id="autoTrigger" style="opacity:0">Trigger</div>
        <div class="node node-auto" id="autoAction" style="opacity:0">Action</div>
        <div class="node node-auto" id="autoDone" style="opacity:0">Done</div>
      </div>
      <div class="auto-complete" id="autoComplete">Pipeline complete. Waiting for next trigger...</div>
    </div>

    <div class="panel agent">
      <div class="panel-label">Agent</div>
      <canvas id="agentCanvas"></canvas>
    </div>
  </div>

  <div class="section">
    <h2>The Agent Loop in Detail</h2>
    <p>Every agent — from a simple chatbot to a fleet of autonomous systems — runs some version of this four-stage loop:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">1. Perceive</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The agent reads its environment. This could be an inbox, a database table, a set of API responses, sensor data, or a user message. Perception is the input — without it, the agent is blind.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">2. Decide</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Based on what it perceived, the agent reasons about what to do next. This is where goals, context, and memory matter. A support agent might decide "this ticket is urgent — escalate" vs. "this is a FAQ — send the standard reply." The decision phase is what separates agents from scripts.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">3. Act</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The agent takes a real action in the world — sends an email, updates a database, calls an API, creates a file, restarts a service. Actions have consequences, which is why guardrails (covered in Lesson 2) are critical.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">4. Learn</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The agent observes the outcome of its action and updates its understanding. Did the email bounce? Did the user approve the draft? Did the API return an error? Learning closes the loop — the agent adjusts its behavior for next time.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>What This Looks Like in Code</h2>
    <p>Here is a simplified agent loop in Python. Even the most complex agent systems — LangChain, CrewAI, Anthropic's Claude Agent SDK — are built on this pattern:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">class</span> <span style="color:#34d399">SimpleAgent</span>:
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">__init__</span>(self, name, goal, tools):
        self.name = name
        self.goal = goal
        self.tools = tools
        self.memory = []     <span style="color:#71717a"># what the agent remembers</span>

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">perceive</span>(self, environment):
        <span style="color:#fb923c">"""Read the current state of the world."""</span>
        <span style="color:#c084fc">return</span> environment.get_current_state()

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">decide</span>(self, observation):
        <span style="color:#fb923c">"""Choose an action based on goal + observation + memory."""</span>
        context = {<span style="color:#fbbf24">"goal"</span>: self.goal, <span style="color:#fbbf24">"observation"</span>: observation, <span style="color:#fbbf24">"memory"</span>: self.memory}
        <span style="color:#c084fc">return</span> self.reason(context)   <span style="color:#71717a"># could be an LLM call</span>

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">act</span>(self, action):
        <span style="color:#fb923c">"""Execute the chosen action using available tools."""</span>
        tool = self.tools[action.tool_name]
        <span style="color:#c084fc">return</span> tool.execute(action.params)

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">learn</span>(self, action, result):
        <span style="color:#fb923c">"""Update memory based on outcome."""</span>
        self.memory.append({<span style="color:#fbbf24">"action"</span>: action, <span style="color:#fbbf24">"result"</span>: result})

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">run</span>(self, environment):
        <span style="color:#fb923c">"""The agent loop — runs until the goal is met."""</span>
        <span style="color:#c084fc">while not</span> self.goal_met():
            observation = self.perceive(environment)
            action = self.decide(observation)
            result = self.act(action)
            self.learn(action, result)</code></pre>
    </div>

    <p style="font-size:.85rem;color:#71717a;margin-top:.5rem">Notice the <code>while not self.goal_met()</code> loop — this is the heartbeat. An automation would run once and exit. The agent keeps going until its goal is satisfied.</p>
  </div>

  <div class="section">
    <h2>Real-World Examples</h2>
    <p>Agents are already everywhere — you just might not have recognized them as such:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">GitHub Copilot Agent Mode</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Reads your codebase, plans multi-file changes, runs tests, fixes failures, and iterates until the code passes. Full perceive-decide-act-learn loop.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Claude Code</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Reads files, writes code, runs commands, checks results, and self-corrects. It is an agent — every tool call is an action in the loop.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Self-Driving Cars</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Cameras perceive the road. The model decides to brake or steer. The car acts. Sensors measure the outcome. The loop runs 30+ times per second.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Trading Bots</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Monitor market data (perceive), run strategies (decide), place orders (act), and adjust parameters based on P&L (learn). 24/7 continuous loop.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>When Agents Go Wrong</h2>
    <p>Agents are powerful, but they fail in predictable ways. Understanding failure modes now prevents disasters later:</p>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Infinite loops:</strong> An agent that never reaches its goal will run forever, burning resources. Always define exit conditions.<br><br>
      <strong style="color:#ef4444">Hallucinated actions:</strong> An LLM-based agent might "decide" to call a tool that does not exist, or pass invalid parameters. Tool validation is essential.<br><br>
      <strong style="color:#ef4444">Runaway side effects:</strong> An agent that sends emails in its act phase could spam thousands of people if the loop runs without rate limiting. Every action needs guardrails.
    </div>
  </div>

  <div class="section">
    <h2>Frameworks You Should Know</h2>
    <p>You do not need a framework to build agents — the loop above is enough to start. But these tools make production agents easier:</p>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">Claude Agent SDK</strong> — Anthropic's official framework for building agents with Claude. Handles tool use, guardrails, and the agent loop natively.<br>
      <strong style="color:#e5e5e5">LangGraph</strong> — From the LangChain team. Models agents as state machines with explicit graph-based control flow.<br>
      <strong style="color:#e5e5e5">CrewAI</strong> — Multi-agent framework where you define agent roles and they collaborate to complete tasks.<br>
      <strong style="color:#e5e5e5">AutoGen</strong> — Microsoft's framework for multi-agent conversations, especially good for code generation agents.
    </div>
    <p style="font-size:.82rem;color:#71717a">This course teaches the concepts behind all of these. Once you understand the agent loop, memory, communication, and orchestration — you can use any framework.</p>
  </div>

  <div class="section">
    <h2>The Agent Lifecycle</h2>
    <p>Agents are not permanent. They are born, they run, and they eventually terminate. Understanding the lifecycle helps you design agents that start cleanly, operate reliably, and shut down gracefully:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8">Initialization</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The agent loads its configuration — identity, tools, goals, guardrails, and memory. It reads any persisted state from previous runs. If this phase is incomplete, the agent starts without context and makes poor decisions. Always boot from the brain.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(192,132,252,.04);border:1px solid rgba(192,132,252,.1)">
        <strong style="color:#c084fc">Active Loop</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The perceive-decide-act-learn cycle runs continuously. The agent processes inputs, takes actions, and updates its understanding. This is the productive phase — where goals are pursued and work gets done.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <strong style="color:#f472b6">Graceful Shutdown</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Before terminating, the agent writes its current state to persistent memory — what it was doing, what it learned, and what comes next. This checkpoint enables the next instance to resume seamlessly. An agent that crashes without checkpointing loses all session progress.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Agents vs. Pipelines vs. Workflows</h2>
    <p>These three terms are often confused. Here is the precise distinction:</p>

    <div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#8b5cf6">Pipeline:</strong> A fixed sequence of steps — A then B then C. No branching, no decisions. Each step transforms the input for the next. Used for data processing, ETL, and build systems.<br><br>
      <strong style="color:#34d399">Workflow:</strong> A sequence with conditional branching — if X then do A, else do B. More flexible than a pipeline but still pre-defined. Used in CI/CD, approval flows, and business process automation.<br><br>
      <strong style="color:#fb923c">Agent:</strong> A continuous loop that decides its own actions based on observations. Not pre-defined — the agent chooses what to do at each step. Can incorporate pipelines and workflows as tools, but the decision-making is dynamic.
    </div>
    <p style="font-size:.82rem;color:#71717a">The key test: if you can draw the entire execution path before the system runs, it is a pipeline or workflow. If the execution path depends on what the system discovers at runtime, it is an agent.</p>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div class="quiz-section">
    <h2>Automation or Agent?</h2>
    <p>Read each scenario and decide: is it an automation or an agent?</p>
    <div class="score-bar">
      <div class="score-item">Correct: <span id="quizScore">0</span>/5</div>
    </div>
    <div class="complete-card" id="completeCard">
      <h3>Lesson Complete!</h3>
      <p style="color:#a3a3a3;font-size:14px">You now understand the core difference: automations follow a fixed path, agents perceive, decide, act, and learn in a continuous loop.</p>
    </div>
  </div>


  <div data-learn="QuizMC" data-props='{"title":"Agent vs. Automation","questions":[{"q":"A cron job sends a weekly analytics report every Monday at 9am. What is this?","options":["Agent","Automation","Both","Neither"],"correct":1,"explanation":"Fixed schedule, fixed action, no decision-making or adaptation. Classic automation."},{"q":"A system monitors your inbox, categorizes emails by urgency, drafts responses, and improves based on your corrections. What is this?","options":["Automation","Agent","Script","Workflow"],"correct":1,"explanation":"It perceives (reads inbox), decides (categorizes by urgency), acts (drafts responses), and learns (improves from corrections) \u2014 the full agent loop."},{"q":"Which of these is part of the agent loop?","options":["Trigger \u2192 Action \u2192 Done","Perceive \u2192 Decide \u2192 Act \u2192 Learn","Input \u2192 Process \u2192 Output","Schedule \u2192 Run \u2192 Stop"],"correct":1,"explanation":"Agents run a continuous perceive-decide-act-learn cycle, not a fixed linear path."},{"q":"An agent keeps sending the same email over and over without stopping. What failure mode is this?","options":["Hallucinated action","Infinite loop with runaway side effects","Race condition","Memory leak"],"correct":1,"explanation":"The agent loop is running without proper exit conditions or rate limiting \u2014 the act phase triggers repeatedly with no guardrails."},{"q":"Why does the agent loop include a Learn phase?","options":["To make the code longer","So the agent can adapt its behavior based on the outcomes of its actions","To store logs for compliance","To slow down the loop"],"correct":1,"explanation":"Learning closes the loop. Without it, the agent would make the same decisions regardless of outcomes \u2014 no better than automation."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Agent Concepts","cards":[{"front":"What makes an agent different from automation?","back":"An agent perceives its environment, makes decisions, takes actions, and adapts in a loop. Automations follow a fixed path with no decision-making."},{"front":"What are the 4 stages of the agent loop?","back":"Perceive \u2192 Decide \u2192 Act \u2192 Learn. The loop repeats continuously as the agent adapts to new information."},{"front":"Give an example of automation","back":"A cron job that resizes uploaded images on a fixed schedule \u2014 no decisions, no learning, just a trigger and a fixed action."},{"front":"Give an example of an agent","back":"Claude Code: reads files (perceive), plans changes (decide), writes code and runs commands (act), checks results and self-corrects (learn)."},{"front":"What is an infinite loop failure?","back":"When an agent never reaches its goal and keeps running forever, burning resources. Always define exit conditions and max iterations."},{"front":"Name 3 agent frameworks","back":"Claude Agent SDK (Anthropic), LangGraph (LangChain), CrewAI (multi-agent roles). All implement the same core perceive-decide-act-learn loop."}]}'></div>
</div>
