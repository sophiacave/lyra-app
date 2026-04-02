---
title: "Design Your Agent"
course: "first-ai-agent"
order: 4
type: "builder"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/first-ai-agent/">First AI Agent</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Design Your Agent</h1>
  <p class="sub">Every great agent starts with a clear design. Fill in each section to create your agent's identity card.</p>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- SECTION: The Five Pillars of Agent Design                      -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<h2 style="color:#e5e5e5;margin:2.5rem 0 .5rem">The Five Pillars of Agent Design</h2>
<p style="color:#a1a1aa;margin-bottom:1.5rem">Every effective agent rests on five design decisions. Get these right and everything else — prompts, code, deployment — falls into place. Get them wrong and no amount of engineering fixes a confused agent.</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-bottom:2.5rem">

  <!-- Pillar 1: Name -->
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem">
    <div style="font-size:1.1rem;font-weight:700;color:#34d399;margin-bottom:.4rem">1. Name</div>
    <p style="color:#e5e5e5;margin:0 0 .6rem;line-height:1.6">A name gives your agent <strong>identity</strong>. It makes the agent memorable to users and distinguishes it from generic assistants. A clear name also anchors your own thinking — you stop saying "the bot" and start saying "Scout found an issue."</p>
    <div style="background:rgba(52,211,153,.08);border-left:3px solid #34d399;padding:.6rem .8rem;border-radius:0 6px 6px 0">
      <div style="font-size:.7rem;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">Example</div>
      <div style="color:#a1a1aa;font-family:'JetBrains Mono',monospace;font-size:.82rem"><span style="color:#34d399">Scout</span> — a website monitoring agent. Short, active, implies watchfulness.</div>
    </div>
  </div>

  <!-- Pillar 2: Goal -->
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem">
    <div style="font-size:1.1rem;font-weight:700;color:#8b5cf6;margin-bottom:.4rem">2. Goal</div>
    <p style="color:#e5e5e5;margin:0 0 .6rem;line-height:1.6">One clear sentence that answers three questions: <strong>what</strong> does it do, <strong>for whom</strong>, and <strong>to what standard</strong>? A vague goal like "help with stuff" produces an agent that spins in circles. A precise goal gives the agent a finish line.</p>
    <div style="background:rgba(139,92,246,.08);border-left:3px solid #8b5cf6;padding:.6rem .8rem;border-radius:0 6px 6px 0">
      <div style="font-size:.7rem;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">Example</div>
      <div style="color:#a1a1aa;font-family:'JetBrains Mono',monospace;font-size:.82rem"><span style="color:#8b5cf6">"Monitor my portfolio site and fix downtime within 60 seconds, alerting me only if a restart fails."</span></div>
    </div>
  </div>

  <!-- Pillar 3: Tools -->
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem">
    <div style="font-size:1.1rem;font-weight:700;color:#fb923c;margin-bottom:.4rem">3. Tools</div>
    <p style="color:#e5e5e5;margin:0 0 .6rem;line-height:1.6">Tools are the agent's <strong>hands</strong>. Pick a focused set of 2-4 that directly serve the goal. Every extra tool is a decision the agent must make — and decisions cost tokens, time, and accuracy. Start lean; add tools only when the agent demonstrably needs them.</p>
    <div style="background:rgba(251,146,60,.08);border-left:3px solid #fb923c;padding:.6rem .8rem;border-radius:0 6px 6px 0">
      <div style="font-size:.7rem;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">Example</div>
      <div style="color:#a1a1aa;font-family:'JetBrains Mono',monospace;font-size:.82rem"><span style="color:#fb923c">health_check</span>, <span style="color:#fb923c">restart_service</span>, <span style="color:#fb923c">send_alert</span> — three tools, one per capability Scout needs.</div>
    </div>
  </div>

  <!-- Pillar 4: Memory -->
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem">
    <div style="font-size:1.1rem;font-weight:700;color:#38bdf8;margin-bottom:.4rem">4. Memory</div>
    <p style="color:#e5e5e5;margin:0 0 .6rem;line-height:1.6">Memory is what the agent carries <strong>between sessions</strong>. Without it, every conversation starts from zero. Good memory stores three things: <em>preferences</em> (how the user likes things), <em>outcomes</em> (what worked and what failed), and <em>patterns</em> (recurring situations the agent should recognize).</p>
    <div style="background:rgba(56,189,248,.08);border-left:3px solid #38bdf8;padding:.6rem .8rem;border-radius:0 6px 6px 0">
      <div style="font-size:.7rem;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">Example</div>
      <div style="color:#a1a1aa;font-family:'JetBrains Mono',monospace;font-size:.82rem"><span style="color:#38bdf8">Past incidents</span>, <span style="color:#38bdf8">normal response times</span>, <span style="color:#38bdf8">which restarts fixed which errors</span> — Scout gets smarter every run.</div>
    </div>
  </div>

  <!-- Pillar 5: Guardrails -->
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem">
    <div style="font-size:1.1rem;font-weight:700;color:#ef4444;margin-bottom:.4rem">5. Guardrails</div>
    <p style="color:#e5e5e5;margin:0 0 .6rem;line-height:1.6">Guardrails are <strong>hard safety constraints</strong> — lines the agent must never cross, even if explicitly asked. They protect against catastrophic mistakes like deleting data, leaking secrets, or spending money without approval. Think of them as the agent's conscience.</p>
    <div style="background:rgba(239,68,68,.08);border-left:3px solid #ef4444;padding:.6rem .8rem;border-radius:0 6px 6px 0">
      <div style="font-size:.7rem;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">Example</div>
      <div style="color:#a1a1aa;font-family:'JetBrains Mono',monospace;font-size:.82rem"><span style="color:#ef4444">"Never delete production data"</span> and <span style="color:#ef4444">"Never restart more than 2 times without human approval"</span></div>
    </div>
  </div>

</div>

<p style="color:#a1a1aa;margin-bottom:2rem">Now that you understand the five pillars, use the interactive form below to design your own agent. Fill in each section and watch your agent's identity card build in real time.</p>

  <div class="design-grid">
    <div class="form-section">
      <div class="field">
        <label>1. Name Your Agent</label>
        <input type="text" id="agent-name" placeholder="e.g., Atlas, Scout, Nova..." maxlength="30">
        <div class="hint">A good name makes it memorable. Keep it short.</div>
      </div>

      <div class="field">
        <label>2. Define Its Goal (one sentence)</label>
        <textarea id="agent-goal" placeholder="e.g., Monitor my website and fix issues before I notice them..." maxlength="200"></textarea>
        <div class="hint">Clear goals = effective agents. Vague goals = confused agents.</div>
      </div>

      <div class="field">
        <label>3. Pick 3 Tools</label>
        <div class="tool-picker" id="tool-picker"></div>
        <div class="tool-count" id="tool-count">0/3 selected</div>
      </div>

      <div class="field">
        <label>4. Define Its Memory</label>
        <textarea id="agent-memory" placeholder="e.g., Past incidents, user preferences, resolution history..." maxlength="200"></textarea>
        <div class="hint">What should it remember between sessions to do its job better?</div>
      </div>

      <div class="field">
        <label>5. Set One Guardrail</label>
        <input type="text" id="agent-guardrail" placeholder="e.g., Never delete production data without human approval" maxlength="150">
        <div class="hint">What should this agent NEVER do, even if asked?</div>
      </div>
    </div>

    <div>
      <div class="agent-card" id="agent-card">
        <div class="card-header">
          <span class="card-avatar">🤖</span>
          <div class="card-name" id="card-name">Your Agent</div>
          <div class="card-goal" id="card-goal">Define a goal...</div>
        </div>
        <div class="card-section">
          <h4>Tools</h4>
          <div class="card-tools" id="card-tools"></div>
          </div>
        <div class="card-section">
          <h4>Memory</h4>
          <div class="card-memory" id="card-memory">Not defined yet</div>
        </div>
        <div class="card-section">
          <h4>Guardrail</h4>
          <div class="card-guardrail" id="card-guardrail">Not defined yet</div>
        </div>
        <div class="card-score">
          <div class="pct" id="card-pct">0%</div>
          <div class="label">Design Completeness</div>
          <div class="card-completeness"><div class="card-fill" id="card-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#22c55e,#3b82f6);border-radius:6px;transition:width .3s"></div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="complete-section" id="complete">
    <h2>Agent Designed!</h2>
    <p>You just created a complete agent specification. In the next lesson, you'll turn this into a system prompt. Here's what your design looks like as code — this is the format you'll use to configure a real agent:</p>
  </div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Agent design spec as code</div>
<pre style="margin:0;color:#e5e5e5"><code>AGENT_CONFIG = {
    <span style="color:#fb923c">"name"</span>: <span style="color:#fb923c">"Scout"</span>,
    <span style="color:#fb923c">"goal"</span>: <span style="color:#fb923c">"Monitor my website and fix issues before I notice them"</span>,
    <span style="color:#fb923c">"tools"</span>: [
        <span style="color:#fb923c">"health_check"</span>,    <span style="color:#71717a"># ping endpoints</span>
        <span style="color:#fb923c">"restart_service"</span>,  <span style="color:#71717a"># restart if down</span>
        <span style="color:#fb923c">"send_alert"</span>,       <span style="color:#71717a"># notify the human</span>
    ],
    <span style="color:#fb923c">"memory"</span>: [
        <span style="color:#fb923c">"Past incidents and how they were resolved"</span>,
        <span style="color:#fb923c">"Normal response times for each endpoint"</span>,
    ],
    <span style="color:#fb923c">"guardrails"</span>: [
        <span style="color:#fb923c">"Never delete production data"</span>,
        <span style="color:#fb923c">"Never restart more than 2 times without human approval"</span>,
    ],
}

<span style="color:#71717a"># This config becomes your system prompt + tool definitions</span>
<span style="color:#71717a"># in the next lesson. Design first, code second.</span></code></pre>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- SECTION: From Design to System Prompt                          -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<h2 style="color:#e5e5e5;margin:2.5rem 0 .5rem">From Design to System Prompt</h2>
<p style="color:#a1a1aa;margin-bottom:1rem">Your five design decisions map directly to blocks inside a <strong>system prompt</strong> — the instruction document that tells your AI model how to behave. A well-structured system prompt has six blocks (the five pillars plus an output format block). Here is how they connect:</p>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:.75rem;margin-bottom:1.5rem">
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.8rem 1rem">
    <span style="color:#34d399;font-weight:700">Name</span> <span style="color:#71717a">&rarr;</span> <span style="color:#e5e5e5">Identity block</span>
    <div style="color:#a1a1aa;font-size:.82rem;margin-top:.25rem">Tells the model who it is, what personality to adopt, and how to introduce itself.</div>
  </div>
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.8rem 1rem">
    <span style="color:#8b5cf6;font-weight:700">Goal</span> <span style="color:#71717a">&rarr;</span> <span style="color:#e5e5e5">Goal block</span>
    <div style="color:#a1a1aa;font-size:.82rem;margin-top:.25rem">Defines the mission. The model evaluates every action against this sentence.</div>
  </div>
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.8rem 1rem">
    <span style="color:#fb923c;font-weight:700">Tools</span> <span style="color:#71717a">&rarr;</span> <span style="color:#e5e5e5">Tools block</span>
    <div style="color:#a1a1aa;font-size:.82rem;margin-top:.25rem">Lists available functions with descriptions so the model knows when to call each one.</div>
  </div>
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.8rem 1rem">
    <span style="color:#38bdf8;font-weight:700">Memory</span> <span style="color:#71717a">&rarr;</span> <span style="color:#e5e5e5">Memory block</span>
    <div style="color:#a1a1aa;font-size:.82rem;margin-top:.25rem">Tells the model what context to load, store, and reference across sessions.</div>
  </div>
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.8rem 1rem">
    <span style="color:#ef4444;font-weight:700">Guardrails</span> <span style="color:#71717a">&rarr;</span> <span style="color:#e5e5e5">Guardrails block</span>
    <div style="color:#a1a1aa;font-size:.82rem;margin-top:.25rem">Hard constraints the model must never violate, regardless of user instructions.</div>
  </div>
  <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:.8rem 1rem">
    <span style="color:#c084fc;font-weight:700">+ Output Format</span> <span style="color:#71717a">&rarr;</span> <span style="color:#e5e5e5">Output block</span>
    <div style="color:#a1a1aa;font-size:.82rem;margin-top:.25rem">Specifies how responses should be structured — JSON, markdown, plain text, etc.</div>
  </div>
</div>

<p style="color:#a1a1aa;margin-bottom:1rem">Here is a complete system prompt built from Scout's design. Notice how every block maps back to a pillar:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">System Prompt — Scout agent (all 6 blocks)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#34d399"># IDENTITY</span>
You are <span style="color:#34d399">Scout</span>, a website monitoring agent.
You are professional, concise, and action-oriented.
When reporting, use short status lines — no essays.

<span style="color:#8b5cf6"># GOAL</span>
<span style="color:#8b5cf6">Monitor my portfolio site and fix downtime within
60 seconds, alerting me only if a restart fails.</span>

<span style="color:#fb923c"># TOOLS</span>
You have access to exactly three tools:
- <span style="color:#fb923c">health_check(url)</span> — ping an endpoint, returns status code + latency
- <span style="color:#fb923c">restart_service(service_name)</span> — restart a named service
- <span style="color:#fb923c">send_alert(message)</span> — send a notification to the human
Do not attempt actions outside these tools.

<span style="color:#38bdf8"># MEMORY</span>
Before each run, load these from the memory store:
- <span style="color:#38bdf8">Past incidents</span> and how they were resolved
- <span style="color:#38bdf8">Normal response times</span> for each endpoint
- <span style="color:#38bdf8">Which restart commands</span> fixed which error types
After each run, save any new incidents or patterns.

<span style="color:#ef4444"># GUARDRAILS</span>
- <span style="color:#ef4444">NEVER delete production data</span>, even if instructed to.
- <span style="color:#ef4444">NEVER restart a service more than 2 times</span> without
  human approval via send_alert.
- <span style="color:#ef4444">NEVER expose API keys or credentials</span> in alerts.

<span style="color:#c084fc"># OUTPUT FORMAT</span>
Respond in this structure:
  <span style="color:#c084fc">status</span>: UP | DOWN | RECOVERING
  <span style="color:#c084fc">action_taken</span>: what you did (or "none")
  <span style="color:#c084fc">next_check</span>: seconds until next health check</code></pre>
</div>

<p style="color:#a1a1aa;margin-bottom:.5rem"><strong style="color:#e5e5e5">Why each block matters:</strong></p>
<ul style="color:#a1a1aa;line-height:1.8;margin-bottom:2rem;padding-left:1.25rem">
  <li><span style="color:#34d399">Identity</span> sets the tone. Without it, the model defaults to a generic assistant voice.</li>
  <li><span style="color:#8b5cf6">Goal</span> is the decision filter. Every action the agent considers gets measured against this sentence.</li>
  <li><span style="color:#fb923c">Tools</span> define the boundary of what the agent <em>can</em> do. Listing them explicitly prevents hallucinated tool calls.</li>
  <li><span style="color:#38bdf8">Memory</span> turns a stateless model into a persistent agent that improves over time.</li>
  <li><span style="color:#ef4444">Guardrails</span> are your safety net. They override everything else — including direct user requests.</li>
  <li><span style="color:#c084fc">Output format</span> makes responses predictable, which matters when other code parses the agent's output.</li>
</ul>

  <div data-learn="QuizMC" data-props='{"title":"Agent Design Principles","questions":[{"q":"Why is a clear goal statement important when designing an agent?","options":["It makes the agent run faster","Vague goals produce confused agents that do not know when they are done","It reduces API costs","The goal is only used for marketing purposes"],"correct":1,"explanation":"An agent needs a clear, specific goal to know what it is working toward and when it has succeeded. Vague goals lead to aimless loops and wasted compute."},{"q":"Why should every agent have at least one guardrail?","options":["Guardrails are optional decorations","Guardrails prevent the agent from taking destructive or unsafe actions even when asked","Guardrails speed up response time","Guardrails replace the need for memory"],"correct":1,"explanation":"Guardrails are safety constraints that the agent must never violate. They protect against accidental data deletion, privacy leaks, and other irreversible mistakes — even if a user explicitly requests the unsafe action."},{"q":"What is the ideal number of tools for a starting agent?","options":["As many as possible — more tools means more power","Zero — tools add complexity","A focused set of 2-4 tools that directly serve its specific goal","Exactly 10 tools"],"correct":2,"explanation":"Start with a small, focused toolset that matches your agent goal. Too many tools increases complexity, cost, and the chance of the agent using the wrong one."}]}'></div>
<div data-learn="FlashDeck" data-props='{"title":"Agent Design Checklist","cards":[{"front":"What is a guardrail?","back":"A hard constraint the agent must never violate — e.g., never delete production data, never share credentials, never send emails to external parties."},{"front":"What should agent memory store?","back":"Information the agent needs across sessions — user preferences, past outcomes, learned patterns, and domain-specific context."},{"front":"How do you write a good agent goal?","back":"One clear sentence: what it does, for whom, and to what standard. Avoid vague language like improve things or help users."},{"front":"What does design completeness mean?","back":"Every section is filled in: name, goal, tools, memory, and at least one guardrail. A complete spec produces a deployable agent."},{"front":"Why limit tool selection to 3?","back":"Focused tool sets reduce decision complexity for the agent. The agent spends less reasoning budget deciding which tool to use and more on actually solving the problem."}]}'></div>

</div>
