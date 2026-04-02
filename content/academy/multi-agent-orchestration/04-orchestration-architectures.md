---
title: "Orchestration Architectures"
course: "multi-agent-orchestration"
order: 4
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/multi-agent-orchestration/">Multi-Agent Orchestration</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Orchestration Architectures</h1>
  <p><span class="accent">Hub-spoke, pipeline, swarm — choosing the right structure for your agent team.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>The three core orchestration architectures</li>
    <li>How to pick the right architecture for your use case</li>
    <li>Trade-offs: control vs. flexibility vs. complexity</li>
    <li>Hybrid architectures for real-world systems</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture 1</span>
  <h2 class="section-title">Hub-Spoke: The Central Commander</h2>
  <p class="section-text">One orchestrator agent sits at the center. It receives tasks, breaks them down, delegates to specialist agents, collects results, and assembles the final output. Every message flows through the hub.</p>
  <p class="section-text"><strong style="color: var(--green);">Strengths:</strong> Easy to reason about, clear chain of command, simple debugging. You always know who's in charge.</p>
  <p class="section-text"><strong style="color: var(--red);">Weaknesses:</strong> The hub is a bottleneck and a single point of failure. If it gets confused, the whole system breaks.</p>
  <p class="section-text"><strong style="color: var(--blue);">Use when:</strong> You need tight control, the workflow is well-defined, and you have fewer than 5-6 agents.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Hub-spoke: orchestrator delegates to specialists</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">call_agent</span>(system: str, message: str) -> str:
    <span style="color:#71717a"># Each agent is a Claude call with a specialized system prompt</span>
    r = client.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>, max_tokens=<span style="color:#fb923c">1024</span>,
        system=system, messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: message}]
    )
    <span style="color:#c084fc">return</span> r.content[<span style="color:#fb923c">0</span>].text

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">orchestrator</span>(task: str) -> str:
    <span style="color:#71717a"># Step 1: Hub decides which specialist to use</span>
    route = call_agent(
        <span style="color:#fbbf24">"You are a router. Given a support ticket, respond with ONLY one word: billing, technical, or account."</span>,
        task
    ).strip().lower()

    <span style="color:#71717a"># Step 2: Hub delegates to the right specialist</span>
    specialists = {
        <span style="color:#fbbf24">"billing"</span>:   <span style="color:#fbbf24">"You handle billing issues. Check charges, process refunds, explain invoices."</span>,
        <span style="color:#fbbf24">"technical"</span>: <span style="color:#fbbf24">"You handle technical issues. Debug errors, check system status, guide fixes."</span>,
        <span style="color:#fbbf24">"account"</span>:   <span style="color:#fbbf24">"You handle account issues. Reset passwords, update profiles, manage access."</span>,
    }
    result = call_agent(specialists.get(route, specialists[<span style="color:#fbbf24">"technical"</span>]), task)

    <span style="color:#71717a"># Step 3: Hub assembles the final response</span>
    <span style="color:#c084fc">return</span> <span style="color:#fbbf24">f"[Routed to {route}]\n{result}"</span>

<span style="color:#34d399">print</span>(orchestrator(<span style="color:#fbbf24">"I was charged twice for my subscription"</span>))
<span style="color:#71717a"># → [Routed to billing]</span>
<span style="color:#71717a"># → "I can see a duplicate charge on your account..."</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture 2</span>
  <h2 class="section-title">Pipeline: The Assembly Line</h2>
  <p class="section-text">Agents are arranged in sequence. Each one processes the input, transforms it, and passes it to the next. No central controller — the flow is baked into the structure itself. Like a factory assembly line where each station adds value.</p>
  <p class="section-text"><strong style="color: var(--green);">Strengths:</strong> Simple, predictable, easy to test each stage independently. Adding a new step is just inserting a new agent.</p>
  <p class="section-text"><strong style="color: var(--red);">Weaknesses:</strong> No flexibility for branching logic. If step 3 needs to go back to step 1, the architecture fights you.</p>
  <p class="section-text"><strong style="color: var(--blue);">Use when:</strong> Your workflow is truly linear — research, then write, then edit, then publish. No loops, no branches.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Pipeline: each agent transforms and passes forward</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Define pipeline stages — each agent's output feeds the next agent's input</span>
PIPELINE = [
    (<span style="color:#fbbf24">"researcher"</span>,  <span style="color:#fbbf24">"Research this topic. Return key findings as bullet points."</span>),
    (<span style="color:#fbbf24">"writer"</span>,      <span style="color:#fbbf24">"Turn these research findings into a polished blog post."</span>),
    (<span style="color:#fbbf24">"editor"</span>,      <span style="color:#fbbf24">"Edit this draft for clarity, grammar, and flow. Return the improved version."</span>),
    (<span style="color:#fbbf24">"seo"</span>,         <span style="color:#fbbf24">"Add SEO metadata: title tag, meta description, suggested internal links."</span>),
]

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">run_pipeline</span>(initial_input: str) -> str:
    current = initial_input
    <span style="color:#c084fc">for</span> name, system_prompt <span style="color:#c084fc">in</span> PIPELINE:
        <span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"  Stage: {name}..."</span>)
        current = call_agent(system_prompt, current)  <span style="color:#71717a"># output → next input</span>
    <span style="color:#c084fc">return</span> current

result = run_pipeline(<span style="color:#fbbf24">"Write about AI agents for small business owners"</span>)
<span style="color:#71717a"># Research → Draft → Edited draft → Final post with SEO metadata</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture 3</span>
  <h2 class="section-title">Swarm: The Autonomous Collective</h2>
  <p class="section-text">No central controller. Agents operate independently, communicating peer-to-peer. They self-organize based on the current state of the work. Like a flock of birds — no leader, but the group moves with purpose.</p>
  <p class="section-text"><strong style="color: var(--green);">Strengths:</strong> Highly resilient, scales naturally, can handle unpredictable workflows. If one agent fails, others adapt.</p>
  <p class="section-text"><strong style="color: var(--red);">Weaknesses:</strong> Hard to debug, unpredictable behavior, potential for agents to conflict or duplicate work.</p>
  <p class="section-text"><strong style="color: var(--blue);">Use when:</strong> The problem space is dynamic, you need maximum resilience, and you can tolerate some unpredictability.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Swarm: parallel agents converge on a shared blackboard</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> asyncio

<span style="color:#71717a"># Swarm agents work independently on the same topic</span>
SWARM = [
    (<span style="color:#fbbf24">"academic"</span>,   <span style="color:#fbbf24">"Find peer-reviewed papers and technical reports on this topic."</span>),
    (<span style="color:#fbbf24">"industry"</span>,   <span style="color:#fbbf24">"Find real-world case studies and company implementations."</span>),
    (<span style="color:#fbbf24">"contrarian"</span>, <span style="color:#fbbf24">"Find criticisms, failures, and reasons this approach might not work."</span>),
]

<span style="color:#c084fc">async def</span> <span style="color:#38bdf8">research_swarm</span>(topic: str) -> dict:
    <span style="color:#71717a"># All agents research the SAME topic in parallel — no coordinator</span>
    tasks = [call_agent_async(sys, topic) <span style="color:#c084fc">for</span> _, sys <span style="color:#c084fc">in</span> SWARM]
    results = <span style="color:#c084fc">await</span> asyncio.gather(*tasks)
    <span style="color:#71717a"># Collect results on a "blackboard"</span>
    blackboard = {name: result <span style="color:#c084fc">for</span> (name, _), result <span style="color:#c084fc">in</span> zip(SWARM, results)}

    <span style="color:#71717a"># Synthesis agent reads the full blackboard and produces a report</span>
    synthesis = call_agent(
        <span style="color:#fbbf24">"Synthesize these three research perspectives into a balanced report."</span>,
        str(blackboard)
    )
    <span style="color:#c084fc">return</span> {<span style="color:#fbbf24">"perspectives"</span>: blackboard, <span style="color:#fbbf24">"synthesis"</span>: synthesis}

report = asyncio.run(research_swarm(<span style="color:#fbbf24">"AI agents in healthcare"</span>))
<span style="color:#71717a"># 3 agents research simultaneously → synthesis agent merges findings</span></code></pre>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;margin:1rem 0">
  <div style="padding:.75rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);text-align:center">
    <strong style="color:#fb923c;font-size:.82rem">Hub-Spoke</strong>
    <p style="font-size:.75rem;color:#71717a;margin:.3rem 0 0">Control + clarity</p>
  </div>
  <div style="padding:.75rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1);text-align:center">
    <strong style="color:#8b5cf6;font-size:.82rem">Pipeline</strong>
    <p style="font-size:.75rem;color:#71717a;margin:.3rem 0 0">Simplicity + testability</p>
  </div>
  <div style="padding:.75rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);text-align:center">
    <strong style="color:#34d399;font-size:.82rem">Swarm</strong>
    <p style="font-size:.75rem;color:#71717a;margin:.3rem 0 0">Resilience + speed</p>
  </div>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">Choosing the Right Architecture</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--orange);">
      <h4 style="color: var(--orange);">Customer Support System → Hub-Spoke</h4>
      <code>Orchestrator receives ticket → routes to Triage Agent → sends to appropriate Specialist Agent (billing, technical, account) → Specialist resolves → Orchestrator sends response.</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Clear routing, controlled escalation. The orchestrator ensures no ticket falls through the cracks.</p>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Code Review Pipeline → Pipeline</h4>
      <code>Linter Agent → Security Scanner Agent → Style Checker Agent → Summary Agent → each adds their findings sequentially.</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Each stage is independent. The order matters but each agent has a single, clear job.</p>
    </div>
    <div class="demo-block" style="border-left: 3px solid var(--green);">
      <h4 style="color: var(--green);">Research Swarm → Swarm</h4>
      <code>Multiple Research Agents explore different angles simultaneously. They share findings on a blackboard. A Synthesis Agent watches the blackboard and produces a report when enough evidence accumulates.</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">No single path. Agents explore in parallel and converge when ready.</p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Architecture Selection Exercise</h2>
  <div class="try-it-box">
    <p>For each scenario below, decide which architecture fits best and explain why. Then pick one and sketch the agent flow.</p>
    <div class="prompt-box">
      <code>Scenario A: Automated blog publishing (research → write → edit → SEO → publish)<br>Scenario B: Real-time fraud detection across multiple data streams<br>Scenario C: AI-powered hiring pipeline with resume screening, skills assessment, and interview scheduling<br><br>My choice for [scenario]: [architecture] because [reasoning]</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Key Terms</span>
  <h2 class="section-title">Orchestration flashcards.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Orchestration Architectures Flashcards","cards":[{"front":"What is hub-spoke architecture?","back":"One orchestrator agent sits at the center — it receives tasks, delegates to specialists, collects results, and assembles the final output. Every message flows through the hub. Best for tight control with fewer than 5-6 agents."},{"front":"What is pipeline architecture?","back":"Agents arranged in sequence like an assembly line. Each one processes input, transforms it, and passes it to the next. No central controller — the flow is baked into the structure. Best for truly linear workflows."},{"front":"What is swarm architecture?","back":"No central controller. Agents operate independently, communicating peer-to-peer and self-organizing based on the current state of work. Highly resilient but hard to debug and potentially unpredictable."},{"front":"What is a hybrid architecture?","back":"A combination of patterns — for example, a hub-spoke system where one spoke is itself a pipeline. Most real-world systems end up as hybrids as complexity grows."},{"front":"How do you choose the right architecture?","back":"Match the architecture to your workflow\\\'s shape: linear processes want pipelines, dynamic processes want swarms, controlled processes want hub-spoke. Start simple and evolve as needs become clear."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Architecture comparison.</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Architecture Is a Decision, Not a Default</h2>
  <p class="section-text">Most people default to hub-spoke because it feels natural. But the right architecture depends on your workflow's shape — linear processes want pipelines, dynamic processes want swarms, and controlled processes want hub-spoke. In practice, you'll often use hybrids: a hub-spoke system where one of the spokes is itself a pipeline. Start simple. Evolve the architecture as your system's needs become clear.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Orchestration architectures quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Orchestration Architectures","questions":[{"q":"Which architecture is best suited for a truly linear workflow like: research, then write, then edit, then publish?","options":["Hub-Spoke","Pipeline","Swarm","Hybrid"],"correct":1,"explanation":"Pipeline architecture is designed for linear sequential flows. Each agent processes its input and passes the result to the next — no branching, no loops, predictable and easy to test."},{"q":"When should you choose a swarm architecture over hub-spoke?","options":["When you want tight central control","When the problem space is dynamic, you need maximum resilience, and you can tolerate some unpredictability","When you have fewer than five agents","When you need the system to be easy to debug"],"correct":1,"explanation":"Swarms excel at dynamic, unpredictable workloads where resilience matters more than control. No single point of failure — if one agent fails, others adapt and continue."},{"q":"What is the most common mistake developers make when choosing an orchestration architecture?","options":["Building pipelines when they need hub-spoke","Defaulting to hub-spoke for everything without considering whether the workflow is actually linear or dynamic","Starting with swarm architecture","Mixing architectures unnecessarily"],"correct":1,"explanation":"Hub-spoke feels natural because it mirrors how we think about management hierarchies. But the right choice depends on your workflow shape — and linear pipelines and dynamic swarms are often better fits."}]}'>
  </div>
</div>

<nav class="lesson-nav">
  <a href="/academy/multi-agent-orchestration/03-communication-patterns/" class="prev">&larr; Previous: Communication Patterns</a>
  <a href="/academy/multi-agent-orchestration/05-shared-memory-and-state/" class="next">Next: Shared Memory &amp; State &rarr;</a>
</nav>

</div>
