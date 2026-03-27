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
  <span class="section-label">The Challenge</span>
  <h2 class="section-title">Agents Don't Speak the Same Language By Default</h2>
  <p class="section-text">When two agents pass information to each other, things can go wrong fast. Agent A outputs a free-form paragraph. Agent B expects structured JSON. The result? Garbled data, lost context, and cascading failures.</p>
  <p class="section-text">Communication patterns solve this by establishing contracts between agents — agreed-upon formats, protocols, and expectations for how information flows through the system.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Pattern 1</span>
  <h2 class="section-title">Direct Messaging</h2>
  <p class="section-text">The simplest pattern: Agent A sends output directly to Agent B. Like a relay race — the baton passes from hand to hand. This works well for linear pipelines where each agent's output is the next agent's input.</p>
  <p class="section-text"><strong style="color: var(--green);">Best for:</strong> Sequential workflows, simple handoffs, two-agent systems.</p>
  <p class="section-text"><strong style="color: var(--red);">Watch out for:</strong> Format mismatches. Always define the exact structure of what gets passed.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Pattern 2</span>
  <h2 class="section-title">Broadcast (Pub/Sub)</h2>
  <p class="section-text">One agent publishes a message. Multiple agents receive it and decide independently whether to act. Like a team Slack channel — everyone sees the message, but only relevant agents respond.</p>
  <p class="section-text"><strong style="color: var(--green);">Best for:</strong> Parallel processing, event-driven systems, agents that need to react to the same trigger differently.</p>
  <p class="section-text"><strong style="color: var(--red);">Watch out for:</strong> Race conditions and duplicate work. Two agents might both try to handle the same task.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Pattern 3</span>
  <h2 class="section-title">Blackboard (Shared Space)</h2>
  <p class="section-text">All agents read from and write to a shared workspace. No direct messages — agents check the blackboard, see what's new, contribute their piece, and move on. Like a collaborative document where everyone adds their section.</p>
  <p class="section-text"><strong style="color: var(--green);">Best for:</strong> Complex problems where agents need full context, iterative refinement, consensus building.</p>
  <p class="section-text"><strong style="color: var(--red);">Watch out for:</strong> Stale reads and write conflicts. Two agents editing the same section simultaneously creates chaos.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">Structured Message Contracts</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--blue);">
      <h4 style="color: var(--blue);">A Clean Agent Message</h4>
      <code>{<br>  "from": "research-agent",<br>  "to": "analysis-agent",<br>  "type": "research_complete",<br>  "payload": {<br>    "topic": "competitor pricing Q4",<br>    "findings": [...],<br>    "confidence": 0.87,<br>    "sources_checked": 12<br>  },<br>  "metadata": {<br>    "timestamp": "2025-03-15T10:30:00Z",<br>    "tokens_used": 4200<br>  }<br>}</code>
      <p style="color: var(--dim); margin-top: 0.5rem;">Structured, typed, traceable. The receiving agent knows exactly what it got and how reliable it is.</p>
    </div>
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
  <div data-learn="MatchConnect" data-props='{"title":"Match Each Communication Pattern to Its Best Use Case","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Direct Messaging","right":"Sequential workflows and simple handoffs between two agents"},{"left":"Broadcast (Pub/Sub)","right":"Parallel processing where multiple agents react differently to the same trigger"},{"left":"Blackboard","right":"Complex problems requiring full context and iterative refinement by all agents"}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Good Communication Is the Whole Game</h2>
  <p class="section-text">Multi-agent systems fail at the seams — the handoff points between agents. Invest heavily in communication contracts. Define message formats explicitly. Include metadata for debugging. When your agents communicate cleanly, the whole system becomes predictable, debuggable, and reliable.</p>
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
