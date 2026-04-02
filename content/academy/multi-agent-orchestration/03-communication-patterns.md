---
title: "Communication Patterns"
course: "multi-agent-orchestration"
order: 3
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/multi-agent-orchestration/">Multi-Agent Orchestration</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Communication Patterns</h1>
  <p><span class="accent">How agents talk to each other — the protocols that make or break multi-agent systems.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>The three fundamental agent communication patterns</li>
    <li>How to design message formats agents actually understand</li>
    <li>Synchronous vs. asynchronous agent communication</li>
    <li>Common pitfalls that cause agent miscommunication</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Why This Matters</span>
  <h2 class="section-title">Your Agents Will Break at the Handoffs</h2>
  <p class="section-text">Think about the worst group project you've ever been in. One person does the research and writes a 10-page essay. The next person expected bullet points. The third person doesn't know what happened and starts over. Nobody agrees on the format, the deadlines, or who's responsible for what.</p>
  <p class="section-text">That's what happens when AI agents pass information without a communication protocol. Agent A outputs a free-form paragraph. Agent B expects structured JSON. The result? Garbled data, lost context, and cascading failures downstream.</p>
  <p class="section-text">Communication patterns solve this by establishing <strong style="color:#e5e5e5">contracts</strong> between agents — agreed-upon formats, protocols, and expectations for how information flows through the system. Get this right and your agents coordinate like a surgery team. Get it wrong and you have an expensive game of telephone.</p>
</div>

<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> Communication patterns are like the protocols hospitals use during shift changes. Nurses don't just say "the patient seems fine." They follow SBAR — Situation, Background, Assessment, Recommendation — a structured handoff that ensures nothing gets lost. Agent communication contracts are SBAR for AI.
</div>

<div class="lesson-section">
  <span class="section-label">Pattern 1</span>
  <h2 class="section-title">Direct Messaging</h2>
  <p class="section-text">The simplest pattern: Agent A sends output directly to Agent B. Like a relay race — the baton passes from hand to hand. This works well for linear pipelines where each agent's output is the next agent's input.</p>
  <p class="section-text"><strong style="color: var(--green);">Best for:</strong> Sequential workflows, simple handoffs, two-agent systems.</p>
  <p class="section-text"><strong style="color: var(--red);">Watch out for:</strong> Format mismatches. Always define the exact structure of what gets passed.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Direct messaging between two agents</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()  <span style="color:#71717a"># reads ANTHROPIC_API_KEY from env</span>

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">run_agent</span>(role: str, system_prompt: str, user_input: str) -> str:
    <span style="color:#71717a"># Each agent is just a Claude call with a specialized system prompt</span>
    response = client.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
        max_tokens=<span style="color:#fb923c">1024</span>,
        system=system_prompt,
        messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: user_input}]
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text

<span style="color:#71717a"># Agent A: Research agent finds information</span>
research_result = run_agent(
    role=<span style="color:#fbbf24">"researcher"</span>,
    system_prompt=<span style="color:#fbbf24">"You are a research agent. Return findings as JSON with keys: topic, findings (list), confidence (0-1)."</span>,
    user_input=<span style="color:#fbbf24">"Research the top 3 competitors in AI education pricing."</span>
)

<span style="color:#71717a"># Agent B: Analysis agent receives research output DIRECTLY</span>
analysis_result = run_agent(
    role=<span style="color:#fbbf24">"analyst"</span>,
    system_prompt=<span style="color:#fbbf24">"You are an analysis agent. You receive research data and produce strategic recommendations."</span>,
    user_input=<span style="color:#fbbf24">f"Analyze this research and recommend a pricing strategy:\n{research_result}"</span>
)

<span style="color:#34d399">print</span>(analysis_result)
<span style="color:#71717a"># "Based on the competitor analysis, I recommend a freemium model...</span>
<span style="color:#71717a">#  Tier 1: Free (30 courses). Tier 2: $29/mo (premium features)..."</span></code></pre>
</div>

<div style="padding:.75rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);margin:1rem 0">
  <strong style="color:#34d399;font-size:.85rem">Key insight:</strong>
  <span style="font-size:.82rem;color:#a1a1aa"> Each "agent" is just a Claude API call with a specialized system prompt. The magic is in how you connect them — the output of one becomes the input of the next. Simple but powerful.</span>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Pattern 2</span>
  <h2 class="section-title">Broadcast (Pub/Sub)</h2>
  <p class="section-text">One agent publishes a message. Multiple agents receive it and decide independently whether to act. Like a team Slack channel — everyone sees the message, but only relevant agents respond.</p>
  <p class="section-text"><strong style="color: var(--green);">Best for:</strong> Parallel processing, event-driven systems, agents that need to react to the same trigger differently.</p>
  <p class="section-text"><strong style="color: var(--red);">Watch out for:</strong> Race conditions and duplicate work. Two agents might both try to handle the same task.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Broadcast: one event triggers multiple agents in parallel</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> asyncio

<span style="color:#71717a"># Define specialist agents that all react to the same event</span>
AGENTS = {
    <span style="color:#fbbf24">"sentiment"</span>: <span style="color:#fbbf24">"Analyze the sentiment of this customer message. Return: positive/negative/neutral + confidence."</span>,
    <span style="color:#fbbf24">"category"</span>: <span style="color:#fbbf24">"Categorize this support ticket. Return: billing/technical/feature-request/other."</span>,
    <span style="color:#fbbf24">"urgency"</span>: <span style="color:#fbbf24">"Rate the urgency of this message: low/medium/high/critical. Return urgency + reasoning."</span>,
}

<span style="color:#c084fc">async def</span> <span style="color:#38bdf8">broadcast</span>(message: str) -> dict:
    <span style="color:#71717a"># All agents process the SAME message in parallel</span>
    <span style="color:#71717a"># Each agent sees the same input, but does something different with it</span>
    tasks = {
        name: run_agent_async(name, prompt, message)
        <span style="color:#c084fc">for</span> name, prompt <span style="color:#c084fc">in</span> AGENTS.items()
    }
    results = <span style="color:#c084fc">await</span> asyncio.gather(*tasks.values())
    <span style="color:#c084fc">return</span> dict(zip(tasks.keys(), results))

<span style="color:#71717a"># One customer message → three specialist analyses in parallel</span>
ticket = <span style="color:#fbbf24">"I've been charged twice and my account is locked. This is urgent!"</span>
results = asyncio.run(broadcast(ticket))
<span style="color:#71717a"># → {"sentiment": "negative (0.95)", "category": "billing", "urgency": "critical"}</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Pattern 3</span>
  <h2 class="section-title">Blackboard (Shared Space)</h2>
  <p class="section-text">All agents read from and write to a shared workspace. No direct messages — agents check the blackboard, see what's new, contribute their piece, and move on. Like a collaborative document where everyone adds their section.</p>
  <p class="section-text"><strong style="color: var(--green);">Best for:</strong> Complex problems where agents need full context, iterative refinement, consensus building.</p>
  <p class="section-text"><strong style="color: var(--red);">Watch out for:</strong> Stale reads and write conflicts. Two agents editing the same section simultaneously creates chaos.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Blackboard: agents read/write to shared state</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># The blackboard is shared state that all agents can read and write</span>
<span style="color:#71717a"># In production, this would be a database (Supabase, Redis, etc.)</span>
blackboard = {
    <span style="color:#fbbf24">"task"</span>: <span style="color:#fbbf24">"Write a blog post about AI agents"</span>,
    <span style="color:#fbbf24">"status"</span>: <span style="color:#fbbf24">"planning"</span>,
    <span style="color:#fbbf24">"sections"</span>: {},       <span style="color:#71717a"># agents write their contributions here</span>
    <span style="color:#fbbf24">"feedback"</span>: [],       <span style="color:#71717a"># review comments from other agents</span>
}

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">research_agent</span>(board: dict) -> dict:
    <span style="color:#71717a"># Read the task from the blackboard</span>
    topic = board[<span style="color:#fbbf24">"task"</span>]
    <span style="color:#71717a"># Do research, then write findings BACK to the blackboard</span>
    board[<span style="color:#fbbf24">"sections"</span>][<span style="color:#fbbf24">"research"</span>] = run_agent(<span style="color:#fbbf24">"researcher"</span>, RESEARCH_PROMPT, topic)
    board[<span style="color:#fbbf24">"status"</span>] = <span style="color:#fbbf24">"research_complete"</span>
    <span style="color:#c084fc">return</span> board

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">writer_agent</span>(board: dict) -> dict:
    <span style="color:#71717a"># Read research from the blackboard (written by research agent)</span>
    research = board[<span style="color:#fbbf24">"sections"</span>][<span style="color:#fbbf24">"research"</span>]
    <span style="color:#71717a"># Write the draft, add it to the blackboard</span>
    board[<span style="color:#fbbf24">"sections"</span>][<span style="color:#fbbf24">"draft"</span>] = run_agent(<span style="color:#fbbf24">"writer"</span>, WRITER_PROMPT, research)
    board[<span style="color:#fbbf24">"status"</span>] = <span style="color:#fbbf24">"draft_complete"</span>
    <span style="color:#c084fc">return</span> board

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">editor_agent</span>(board: dict) -> dict:
    <span style="color:#71717a"># Read BOTH research and draft — full context from the blackboard</span>
    context = <span style="color:#fbbf24">f"Research: {board['sections']['research']}\nDraft: {board['sections']['draft']}"</span>
    board[<span style="color:#fbbf24">"feedback"</span>].append(run_agent(<span style="color:#fbbf24">"editor"</span>, EDITOR_PROMPT, context))
    board[<span style="color:#fbbf24">"status"</span>] = <span style="color:#fbbf24">"review_complete"</span>
    <span style="color:#c084fc">return</span> board

<span style="color:#71717a"># Orchestrate: each agent reads/writes the same blackboard</span>
blackboard = research_agent(blackboard)   <span style="color:#71717a"># writes research</span>
blackboard = writer_agent(blackboard)     <span style="color:#71717a"># reads research, writes draft</span>
blackboard = editor_agent(blackboard)     <span style="color:#71717a"># reads both, writes feedback</span></code></pre>
</div>

<div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);margin:1rem 0">
  <strong style="color:#fb923c;font-size:.85rem">Blackboard vs. Direct Messaging:</strong>
  <span style="font-size:.82rem;color:#a1a1aa"> In direct messaging, the editor only sees the draft. With a blackboard, the editor sees the original research AND the draft — full context for a better review. The tradeoff is that the blackboard grows with every contribution, using more tokens.</span>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">Structured Message Contracts</h2>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Typed message contract with dataclass</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> dataclasses <span style="color:#c084fc">import</span> dataclass, field
<span style="color:#c084fc">from</span> datetime <span style="color:#c084fc">import</span> datetime
<span style="color:#c084fc">from</span> typing <span style="color:#c084fc">import</span> Any

<span style="color:#c084fc">@dataclass</span>
<span style="color:#c084fc">class</span> <span style="color:#38bdf8">AgentMessage</span>:
    <span style="color:#71717a"># Who sent it and who should receive it</span>
    sender: str                <span style="color:#71717a"># "research-agent"</span>
    recipient: str             <span style="color:#71717a"># "analysis-agent"</span>
    message_type: str          <span style="color:#71717a"># "research_complete"</span>

    <span style="color:#71717a"># The actual data being passed</span>
    payload: dict[str, Any]    <span style="color:#71717a"># {"topic": "...", "findings": [...]}</span>

    <span style="color:#71717a"># Metadata for debugging and tracing</span>
    confidence: float = <span style="color:#fb923c">0.0</span>    <span style="color:#71717a"># How reliable is this data? (0-1)</span>
    tokens_used: int = <span style="color:#fb923c">0</span>      <span style="color:#71717a"># Cost tracking</span>
    timestamp: str = field(    <span style="color:#71717a"># When was this created?</span>
        default_factory=<span style="color:#c084fc">lambda</span>: datetime.now().isoformat()
    )

<span style="color:#71717a"># Usage: research agent sends findings to analysis agent</span>
msg = AgentMessage(
    sender=<span style="color:#fbbf24">"research-agent"</span>,
    recipient=<span style="color:#fbbf24">"analysis-agent"</span>,
    message_type=<span style="color:#fbbf24">"research_complete"</span>,
    payload={
        <span style="color:#fbbf24">"topic"</span>: <span style="color:#fbbf24">"competitor pricing Q4"</span>,
        <span style="color:#fbbf24">"findings"</span>: [<span style="color:#fbbf24">"Competitor A: $29/mo"</span>, <span style="color:#fbbf24">"Competitor B: $49/mo"</span>],
        <span style="color:#fbbf24">"sources_checked"</span>: <span style="color:#fb923c">12</span>,
    },
    confidence=<span style="color:#fb923c">0.87</span>,           <span style="color:#71717a"># High confidence — 12 sources verified</span>
    tokens_used=<span style="color:#fb923c">4200</span>,
)
<span style="color:#71717a"># Structured, typed, traceable. The receiving agent knows</span>
<span style="color:#71717a"># exactly what it got, who sent it, and how reliable it is.</span></code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Design a Message Contract</h2>
  <div class="try-it-box">
    <p>Take your agent team from Lesson 2. Define the message format for each handoff. What fields does the receiving agent need? What metadata helps with debugging?</p>
    <div class="prompt-box">
      <code>Handoff: [Agent A] → [Agent B]<br>Message type: [name]<br>Required fields: [list them]<br>Optional fields: [list them]<br>Format: JSON / structured text / markdown</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">Communication pattern strengths and risks.</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Common Pitfalls</span>
  <h2 class="section-title">Three Ways Agent Communication Breaks</h2>

  <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">1. The Free-Form Trap</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Agent A returns a paragraph. Agent B tries to parse it as JSON. The system crashes — or worse, silently produces garbage. <strong style="color:#e5e5e5">Fix:</strong> Always force structured output with explicit instructions in the system prompt: "Return ONLY valid JSON with these exact keys."</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c">2. Lost Context at Scale</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">In direct messaging, each agent only sees the previous agent's output. By agent #5 in a chain, the original intent is lost — like a game of telephone. <strong style="color:#e5e5e5">Fix:</strong> Pass the original request alongside each handoff, or use a blackboard so every agent has full context.</p>
    </div>
    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6">3. No Error Propagation</strong>
      <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Agent A fails silently and returns empty data. Agent B processes the empty data without checking. Agent C presents garbage to the user. <strong style="color:#e5e5e5">Fix:</strong> Include a <code style="color:#fb923c">status</code> field in every message — "success", "partial", or "failed" — and teach downstream agents to check it first.</p>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Good Communication Is the Whole Game</h2>
  <p class="section-text">Multi-agent systems fail at the seams — the handoff points between agents. Invest heavily in communication contracts. Define message formats explicitly. Include metadata for debugging. When your agents communicate cleanly, the whole system becomes predictable, debuggable, and reliable.</p>
  <p class="section-text">The code you've seen in this lesson — direct messaging, broadcast, and blackboard — are the three building blocks. Every multi-agent system you build will use one or a combination of these patterns. Master them and you've mastered the hardest part of agent orchestration.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Communication Patterns","cards":[{"front":"Direct Messaging","back":"Agent A sends output directly to Agent B. Like a relay baton. Best for sequential workflows and simple handoffs. Watch for format mismatches."},{"front":"Broadcast (Pub/Sub)","back":"One agent publishes, multiple agents receive and decide whether to act. Best for parallel processing. Watch for race conditions and duplicate work."},{"front":"Blackboard (Shared Space)","back":"All agents read from and write to a shared workspace. Best for complex problems needing full context. Watch for stale reads and write conflicts."},{"front":"Communication Contracts","back":"Agreed-upon formats, protocols, and expectations for how information flows. Structured messages with from, to, type, payload, and metadata fields."},{"front":"Why Systems Fail at the Seams","back":"Format mismatches and lost context at handoff points cause cascading failures. Invest heavily in defining message formats explicitly between agents."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Communication patterns quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Communication Patterns","questions":[{"q":"Why do multi-agent systems fail at the seams between agents?","options":["Agents run out of memory at handoff points","Format mismatches and lost context at handoff points cause cascading failures downstream","Agents become slower when passing large messages","API rate limits are hit during handoffs"],"correct":1,"explanation":"Each handoff is a potential failure point. Agent A outputs free-form text, Agent B expects JSON — the mismatch corrupts data flowing through the whole system. Communication contracts prevent this."},{"q":"What metadata should a clean agent message include beyond the payload?","options":["Agent name only","Timestamp and token count","From, to, message type, confidence score, timestamp, and tokens used","Just the output data in JSON format"],"correct":2,"explanation":"Metadata like confidence score and source agent makes the message traceable and debuggable. When something goes wrong downstream, you can trace exactly where the data came from and how reliable it was."},{"q":"What is the key risk of the broadcast (pub/sub) communication pattern?","options":["Messages are lost during transmission","Two agents might both handle the same task, causing duplicate work or race conditions","Broadcasting uses too many API tokens","Agents cannot filter which broadcasts to respond to"],"correct":1,"explanation":"In pub/sub, all agents see the same message. Without proper coordination, two agents might both pick up the same task and produce conflicting outputs. Explicit ownership and deduplication logic are essential."}]}'>
  </div>
</div>

<nav class="lesson-nav">
  <a href="/academy/multi-agent-orchestration/02-agent-roles-and-specialization/" class="prev">&larr; Previous: Agent Roles &amp; Specialization</a>
  <a href="/academy/multi-agent-orchestration/04-orchestration-architectures/" class="next">Next: Orchestration Architectures &rarr;</a>
</nav>

</div>
