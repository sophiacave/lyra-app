---
title: "Agent Anatomy"
course: "the-automation-lab"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 2</div>
  <h1>Agent Anatomy</h1>
  <p class="subtitle">Every autonomous agent — from a simple inbox monitor to a fleet managing your entire business — is built from six core components. This lesson dissects each one, shows you how they map to real code, and lets you build your own agent config from scratch.</p>

  <div class="section">
    <h2>The Six Components</h2>
    <p>Strip away the framework-specific jargon and every agent has the same anatomy. Whether you are using Claude Agent SDK, LangGraph, CrewAI, or building from scratch — these six pieces are always present, even if they go by different names.</p>
    <p>Here is each component explained:</p>
  </div>

  <div style="display:flex;flex-direction:column;gap:.75rem;margin:0 0 1.5rem">
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6">&#128100; Identity</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Who the agent is. Its name, role, personality, and voice. Identity is not decoration — it shapes every decision the agent makes. An agent with the identity "cautious security auditor" will behave very differently from one with the identity "creative marketing writer," even given the same tools and inputs.</p>
      <p style="font-size:.82rem;color:#71717a;margin-top:.4rem">In practice, identity is encoded in the system prompt. Claude Agent SDK calls this the <code>instructions</code> field. LangChain calls it <code>system_message</code>.</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399">&#129504; Memory</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">What the agent knows and remembers. Three types: <strong>short-term</strong> (the current conversation window — fast but ephemeral), <strong>long-term</strong> (stored in a database — survives across sessions), and <strong>shared</strong> (accessible to other agents — the communication bus). Memory is what makes an agent smarter over time.</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c">&#128295; Tools</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">What the agent can do. API calls, database queries, file operations, sending messages, running shell commands. Tools are the agent's hands — without them, it can only think. In Claude's API, tools are defined as JSON schemas. MCP standardizes this across all clients.</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8">&#127919; Goals</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">What the agent is trying to achieve. Goals drive the decide phase of the agent loop. They can be <strong>persistent</strong> (always active, like "keep the server healthy") or <strong>triggered</strong> (activated by events, like "respond to this support ticket"). A common mistake is vague goals like "be helpful." Effective goals are specific: "Respond to all support tickets within 5 minutes."</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">&#128721; Guardrails</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">What the agent must NOT do. Boundaries, safety rules, ethical constraints, and hard limits. Guardrails operate at a higher priority than goals. A goal says "send marketing emails." A guardrail says "never send more than 100 emails per hour." When they conflict, the guardrail wins.</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
      <strong style="color:#f472b6">&#9200; Schedule</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">When and how the agent runs. Three modes: <strong>event-driven</strong> (reacts to triggers like webhooks), <strong>cron-based</strong> (runs on a fixed schedule), or <strong>always-on</strong> (continuously monitoring). Always-on agents respond instantly but consume the most resources. Event-driven agents balance responsiveness and efficiency.</p>
    </div>
  </div>

  <div class="section">
    <h2>How This Maps to Real Code</h2>
    <p>Here is what a complete agent configuration looks like as a Python dataclass. This is a pattern you will see in nearly every agent framework:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#c084fc">from</span> dataclasses <span style="color:#c084fc">import</span> dataclass, field
<span style="color:#c084fc">from</span> typing <span style="color:#c084fc">import</span> List, Optional

<span style="color:#c084fc">@dataclass</span>
<span style="color:#c084fc">class</span> <span style="color:#34d399">AgentConfig</span>:
    <span style="color:#71717a"># Identity</span>
    name: str
    role: str
    voice: str = <span style="color:#fbbf24">"neutral"</span>

    <span style="color:#71717a"># Goals</span>
    goals: List[str] = field(default_factory=list)

    <span style="color:#71717a"># Tools — list of callable functions</span>
    tools: List[str] = field(default_factory=list)

    <span style="color:#71717a"># Guardrails — hard limits that override goals</span>
    guardrails: List[str] = field(default_factory=list)

    <span style="color:#71717a"># Memory config</span>
    memory_type: str = <span style="color:#fbbf24">"short_term"</span>  <span style="color:#71717a"># or "long_term", "shared"</span>

    <span style="color:#71717a"># Schedule</span>
    schedule: Optional[str] = <span style="color:#c084fc">None</span>  <span style="color:#71717a"># cron expression</span>
    trigger: Optional[str] = <span style="color:#c084fc">None</span>  <span style="color:#71717a"># event name</span>

<span style="color:#71717a"># Example: a support agent</span>
support_agent = AgentConfig(
    name=<span style="color:#fbbf24">"Atlas"</span>,
    role=<span style="color:#fbbf24">"Tier 1 Support"</span>,
    voice=<span style="color:#fbbf24">"friendly, concise"</span>,
    goals=[<span style="color:#fbbf24">"Resolve tickets within 5 min"</span>, <span style="color:#fbbf24">"Escalate P0s immediately"</span>],
    tools=[<span style="color:#fbbf24">"search_kb"</span>, <span style="color:#fbbf24">"send_reply"</span>, <span style="color:#fbbf24">"escalate_ticket"</span>, <span style="color:#fbbf24">"log_resolution"</span>],
    guardrails=[<span style="color:#fbbf24">"Never share internal docs"</span>, <span style="color:#fbbf24">"Never close without resolution"</span>],
    memory_type=<span style="color:#fbbf24">"long_term"</span>,
    trigger=<span style="color:#fbbf24">"on_new_ticket"</span>
)</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Every field maps directly to one of the six components. When you use a framework like Claude Agent SDK, you are filling in these same fields — just through a different interface.</p>
  </div>

  <div class="section">
    <h2>Common Design Mistakes</h2>
    <p>Most agent failures trace back to a misconfigured component. Watch for these:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">Too many tools</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">An agent with 50 tools gets confused about which one to use. LLMs perform better with 5-15 focused tools. If you need more, split into multiple specialized agents.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">Vague identity</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">"You are a helpful assistant" produces generic behavior. "You are a senior DevOps engineer who prioritizes stability over speed and always explains trade-offs" produces targeted, useful behavior.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">No guardrails</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">An agent without guardrails will optimize its goals at any cost. A sales agent told to "maximize conversions" with no guardrails might start making false promises. Always define what the agent must NOT do.</p>
      </div>
    </div>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"The 6 Agent Components","cards":[{"front":"Identity","back":"Who the agent is \u2014 name, role, personality, and voice. Encoded in the system prompt. Shapes every decision the agent makes."},{"front":"Memory","back":"What the agent knows. Short-term (conversation window), long-term (database), shared (accessible to other agents). Makes agents smarter over time."},{"front":"Tools","back":"What the agent can do \u2014 API calls, database queries, file ops. Defined as JSON schemas (or MCP servers). Without tools, agents can only think."},{"front":"Goals","back":"What the agent is trying to achieve. Must be specific and measurable. Persistent (always active) or triggered (event-activated)."},{"front":"Guardrails","back":"What the agent must NOT do. Hard limits that override goals. Without guardrails, agents optimize recklessly."},{"front":"Schedule","back":"When the agent runs \u2014 event-driven (webhooks), cron-based (timer), or always-on (continuous). Determines autonomy and resource usage."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Agent Anatomy Check","questions":[{"q":"Which component defines what an agent is NOT allowed to do?","options":["Goals","Memory","Guardrails","Schedule"],"correct":2,"explanation":"Guardrails are the hard limits \u2014 they define forbidden actions and override goals when they conflict."},{"q":"An agent that reacts to a webhook event rather than running on a timer uses which schedule type?","options":["Cron-based","Always-on","Event-driven","Manual"],"correct":2,"explanation":"Event-driven agents wake up in response to triggers like webhooks, new records, or incoming messages."},{"q":"What is the difference between long-term memory and shared memory?","options":["Long-term is faster","Shared memory is accessible to ALL agents; long-term belongs to one agent","There is no difference","Long-term lasts forever; shared is session-only"],"correct":1,"explanation":"Shared memory (brain_context) is the bridge between agents. Long-term memory (agent_memory) belongs to a single agent and persists across its sessions."},{"q":"An agent with 50 tools keeps choosing the wrong one. What is the most likely fix?","options":["Add more tools","Split into multiple specialized agents with 5-15 tools each","Remove all guardrails","Switch to always-on scheduling"],"correct":1,"explanation":"LLMs perform better with fewer, focused tools. Too many tools creates confusion. Split into specialized agents that each excel at a narrow task."},{"q":"Why is \u0027You are a helpful assistant\u0027 a bad agent identity?","options":["It is too long","It is too specific","It is too vague \u2014 it produces generic behavior instead of targeted, useful actions","It violates guardrails"],"correct":2,"explanation":"Vague identities produce vague behavior. Specific identities (role + priorities + voice) produce focused, predictable agents."}]}'></div>

</div>
