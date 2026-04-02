---
title: "Agent Roles and Specialization"
course: "multi-agent-orchestration"
order: 2
type: "lesson"
free: true
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/multi-agent-orchestration/">Multi-Agent Orchestration</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Agent Roles and Specialization</h1>
  <p><span class="accent">Designing agents with specific jobs — because a focused agent is a powerful agent.</span></p>
</div>

<div class="learn-card">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How to define clear agent roles and responsibilities</li>
    <li>The anatomy of a well-designed agent persona</li>
    <li>Common agent archetypes and when to use them</li>
    <li>How to prevent role overlap and confusion</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">The Foundation</span>
  <h2 class="section-title">Every Agent Needs a Job Description</h2>
  <p class="section-text">Just like hiring for a team, each agent needs a clear role, defined boundaries, and specific expertise. A vague agent produces vague results. An agent that knows exactly what it's responsible for — and what it's not — delivers consistently.</p>
  <p class="section-text">A good agent definition includes four things: its purpose (what it exists to do), its inputs (what it receives), its outputs (what it produces), and its constraints (what it should never do).</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Archetypes</span>
  <h2 class="section-title">Six Agent Roles You'll Use Everywhere</h2>
  <p class="section-text"><strong style="color: var(--orange);">Researcher</strong> — Gathers, validates, and synthesizes information. Never makes decisions, only presents findings.</p>
  <p class="section-text"><strong style="color: var(--purple);">Analyst</strong> — Takes raw data and extracts patterns, insights, and recommendations. Thinks in frameworks.</p>
  <p class="section-text"><strong style="color: var(--green);">Creator</strong> — Produces content: writing, code, designs, plans. Focuses on craft and quality.</p>
  <p class="section-text"><strong style="color: var(--blue);">Critic</strong> — Reviews and evaluates work from other agents. Finds flaws, suggests improvements, enforces standards.</p>
  <p class="section-text"><strong style="color: var(--red);">Executor</strong> — Takes actions: runs code, calls APIs, manages files. Focused on reliability and error handling.</p>
  <p class="section-text"><strong style="color: var(--dim);">Orchestrator</strong> — Coordinates the team. Routes tasks, manages handoffs, tracks progress. The project manager.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Real Example</span>
  <h2 class="section-title">Building a Content Pipeline Team</h2>

  <div class="demo-container">
    <div class="demo-block" style="border-left: 3px solid var(--purple);">
      <h4 style="color: var(--purple);">Agent Team Definition</h4>
      <code>
Orchestrator: "You manage a content pipeline. Route topics to Research, send findings to Writer, pass drafts to Editor. Track status of each piece."<br><br>
Research Agent: "You research topics deeply. Use provided sources. Output structured findings with citations. Never write final copy."<br><br>
Writer Agent: "You write blog posts from research briefs. Match the brand voice guide. Output clean markdown. Never fact-check — that's not your job."<br><br>
Editor Agent: "You review drafts for clarity, accuracy, and brand voice. Output specific edit suggestions with line references. Never rewrite — suggest."
      </code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Deep Dive</span>
  <h2 class="section-title">Common Agent Roles: A Detailed Reference</h2>
  <p class="section-text">Beyond the six archetypes, here are specific agent roles that appear repeatedly in production multi-agent systems. Understanding these helps you map your workflow to proven patterns.</p>

  <p class="section-text"><strong style="color: #fb923c;">Router Agent</strong> — The traffic controller. Receives incoming requests and routes them to the right specialist agent based on classification. A router agent reads every ticket, email, or task that enters the system and decides which agent should handle it. It never does the work itself — it only directs. Routers typically use cheap, fast models because classification is simpler than generation.</p>

  <p class="section-text"><strong style="color: #8b5cf6;">Researcher Agent</strong> — The investigator. Gathers raw information from documents, databases, APIs, or web sources. A good researcher agent is constrained to never draw conclusions or make recommendations — its job is to surface relevant facts and cite sources. This prevents it from biasing the analysis phase with premature opinions.</p>

  <p class="section-text"><strong style="color: #34d399;">Writer Agent</strong> — The craftsperson. Takes structured briefs, research output, or outlines and produces polished content. Writer agents are tuned for voice, tone, and format. They should receive clear brand guidelines and style constraints in their system prompt. They never research or fact-check — those are other agents' jobs.</p>

  <p class="section-text"><strong style="color: #ef4444;">Reviewer Agent</strong> — The quality gate. Evaluates output from other agents against specific criteria: accuracy, style, completeness, safety, compliance. A reviewer agent needs explicit rubrics — "check for factual claims without citations" is more useful than "make sure it's good." The best reviewer agents output structured scores alongside specific feedback.</p>

  <p class="section-text"><strong style="color: #38bdf8;">Executor Agent</strong> — The doer. Takes plans and executes them in the real world: running code, calling APIs, updating databases, sending messages. Executor agents need robust error handling because they interact with external systems that can fail unpredictably. They should report exactly what they did, what succeeded, and what failed.</p>

  <p class="section-text"><strong style="color: #a1a1aa;">Monitor Agent</strong> — The watchdog. Runs continuously or periodically, watching for anomalies, threshold breaches, or events that require action. Monitor agents are the early warning system. They watch logs, metrics, or outputs from other agents and trigger alerts or escalations when something is off. They never fix problems — they detect and report.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Code Example</span>
  <h2 class="section-title">Role-Based System Prompts in Practice</h2>
  <p class="section-text">The system prompt is where an agent's role becomes real. Here is how to write system prompts that enforce clear role boundaries for each agent in a content pipeline.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Role-based system prompts with explicit boundaries</div>
<pre style="margin:0;color:#e5e5e5"><code>AGENT_PROMPTS = {
    <span style="color:#fbbf24">"router"</span>: <span style="color:#fbbf24">"""You are a Router Agent. Your ONLY job is classification.
Given an incoming request, output a JSON object with:
- category: one of [research, writing, code, support]
- priority: 1 (low) to 5 (critical)
- assigned_to: which specialist agent handles this

CONSTRAINTS:
- NEVER attempt to fulfill the request yourself
- NEVER add commentary or suggestions
- NEVER modify the original request
- Output ONLY the JSON classification object"""</span>,

    <span style="color:#fbbf24">"researcher"</span>: <span style="color:#fbbf24">"""You are a Research Agent. You investigate and report.
Given a topic and sources, extract key findings with citations.

OUTPUT FORMAT:
- findings: list of facts with source references
- gaps: what information is missing or uncertain
- confidence: 0.0 to 1.0 for each finding

CONSTRAINTS:
- NEVER write final copy or marketing language
- NEVER make recommendations or strategic suggestions
- NEVER speculate beyond what the sources support
- If a source is ambiguous, flag it — do not interpret"""</span>,

    <span style="color:#fbbf24">"writer"</span>: <span style="color:#fbbf24">"""You are a Writer Agent. You craft polished content.
Given a research brief and style guide, produce final copy.

OUTPUT FORMAT:
- content: the finished piece in the requested format
- word_count: actual count
- style_notes: any deviations from the style guide and why

CONSTRAINTS:
- NEVER conduct your own research or add facts not in the brief
- NEVER fact-check — that is the reviewer's job
- NEVER change the scope of what was requested
- Follow the brand voice guide EXACTLY"""</span>,

    <span style="color:#fbbf24">"reviewer"</span>: <span style="color:#fbbf24">"""You are a Reviewer Agent. You evaluate and critique.
Given a draft and the original brief, assess quality.

OUTPUT FORMAT:
- score: 1-10 overall quality
- issues: list of specific problems with line references
- verdict: approve / revise / reject

CONSTRAINTS:
- NEVER rewrite the content yourself — only suggest changes
- NEVER approve work that contradicts the original brief
- NEVER skip the scoring rubric
- Be specific: 'paragraph 3 claims X without citation' not 'needs work'"""</span>
}

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">create_agent</span>(role: str, model: str = <span style="color:#fbbf24">"sonnet"</span>):
    <span style="color:#c084fc">return</span> Agent(
        system_prompt=AGENT_PROMPTS[role],
        model=model,
        name=role
    )</code></pre>
</div>
</div>

<div class="lesson-section">
  <span class="section-label">Principles</span>
  <h2 class="section-title">Role Design Principles</h2>
  <p class="section-text">Designing effective agent roles is a craft. These principles will help you create agents that are reliable, maintainable, and compose well with each other.</p>

  <p class="section-text"><strong style="color: #34d399;">Principle 1: One Job, One Agent.</strong> If you can't describe an agent's purpose in a single sentence, it's doing too much. "This agent researches topics and writes summaries" is two jobs. Split them. An agent that does one thing well is easier to test, debug, tune, and replace than an agent that does three things adequately.</p>

  <p class="section-text"><strong style="color: #8b5cf6;">Principle 2: Define Constraints, Not Just Capabilities.</strong> Telling an agent what it should do is only half the job. Telling it what it must never do is equally important. Without explicit constraints, agents naturally expand their scope. A researcher will start writing conclusions. A writer will start fact-checking. Constraints are the guardrails that keep specialization intact.</p>

  <p class="section-text"><strong style="color: #fb923c;">Principle 3: Standardize Inputs and Outputs.</strong> Every agent should have a well-defined interface — a contract that specifies exactly what format it receives and what format it produces. When Agent A's output perfectly matches Agent B's expected input, the handoff is seamless. When formats are vague, you get parsing errors, lost data, and silent failures at every connection point.</p>

  <p class="section-text"><strong style="color: #38bdf8;">Principle 4: Make Roles Testable in Isolation.</strong> A well-designed agent can be tested independently of the rest of the system. Feed it sample inputs and verify the outputs match expectations. If you can't test an agent without spinning up the entire system, the role boundaries aren't clean enough. Unit-testable agents are the building blocks of reliable systems.</p>

  <p class="section-text"><strong style="color: #ef4444;">Principle 5: Design for Replacement.</strong> Every agent should be swappable. If you need to change the model behind your researcher from Sonnet to GPT-4o, the rest of the system shouldn't care — as long as the inputs and outputs stay the same. This modularity is what makes multi-agent systems maintainable over time. No agent should be a single point of fragility.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Trap</span>
  <h2 class="section-title">Avoiding Role Bleed</h2>
  <p class="section-text">The biggest mistake in multi-agent design is letting roles overlap. When the research agent starts writing conclusions, or the writer starts fact-checking, you get redundant work and conflicting outputs.</p>
  <p class="section-text">Prevent this with explicit boundaries in each agent's system prompt. State what the agent does and what it explicitly does not do. "You are a researcher. You gather and organize information. You never write final copy, make recommendations, or take actions."</p>
</div>

<div class="lesson-section">
  <span class="section-label">Try It Yourself</span>
  <h2 class="section-title">Design Your Agent Team</h2>
  <div class="try-it-box">
    <p>Pick a workflow you want to automate. Define three agents with distinct roles. For each, write a one-paragraph job description that covers purpose, inputs, outputs, and constraints.</p>
    <div class="prompt-box">
      <code>Agent: [Name]<br>Purpose: [What it exists to do]<br>Inputs: [What it receives from other agents or the user]<br>Outputs: [What it produces]<br>Constraints: [What it must never do]</code>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Practice</span>
  <h2 class="section-title">The six agent archetypes.</h2>
</div>

<div class="lesson-section">
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Clarity Creates Quality</h2>
  <p class="section-text">The time you invest in defining agent roles pays off exponentially. Clear roles mean predictable outputs, easier debugging, and systems that scale. When something goes wrong, you know exactly which agent to examine. When you need to improve quality, you tune the specific agent without disrupting the whole team.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Agent Roles and Specialization","cards":[{"front":"The Four-Part Agent Definition","back":"Purpose (what it exists to do), inputs (what it receives), outputs (what it produces), and constraints (what it should never do)."},{"front":"Role Bleed","back":"When agent roles overlap — the research agent starts writing conclusions, the writer starts fact-checking — producing redundant work and conflicting outputs."},{"front":"Preventing Role Bleed","back":"State what the agent does AND what it explicitly does not do in each agent\\\'s system prompt. Clear boundaries produce clean handoffs."},{"front":"The Orchestrator Role","back":"Coordinates the team. Routes tasks, manages handoffs, tracks progress. The project manager of the agent system."},{"front":"Why Clear Roles Help Debugging","back":"When something goes wrong, you immediately know which agent to examine. You tune that one agent without disrupting the rest of the team."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Agent roles quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Agent Roles and Specialization","questions":[{"q":"What four things should a good agent definition include?","options":["Name, model, cost, and speed","Purpose, inputs, outputs, and constraints","Role, tools, memory, and personality","System prompt, temperature, max tokens, and context window"],"correct":1,"explanation":"A well-defined agent has a purpose (what it exists to do), inputs (what it receives), outputs (what it produces), and constraints (what it must never do). This is the agent contract."},{"q":"What is role bleed and why is it dangerous?","options":["When an agent runs out of context window","When agent roles overlap — the research agent starts writing conclusions, the writer starts fact-checking — producing redundant and conflicting outputs","When two agents send messages to each other simultaneously","When an agent is given too many tools"],"correct":1,"explanation":"Prevent role bleed with explicit constraints in each agent system prompt. State what the agent does AND what it explicitly does not do. Clear boundaries produce clean handoffs."},{"q":"Why does clear role definition make debugging easier?","options":["Agents with clear roles use less memory","When something goes wrong, you immediately know which agent to examine — no ambiguity about where the failure occurred","Clear roles prevent agents from making mistakes","Clear roles reduce the number of API calls"],"correct":1,"explanation":"When roles are clear and distinct, a failure in output points directly to its agent source. You tune that one agent without disrupting the rest of the team."}]}'>
  </div>
</div>

<nav class="lesson-nav">
  <a href="/academy/multi-agent-orchestration/01-why-multiple-agents/" class="prev">&larr; Previous: Why Multiple Agents</a>
  <a href="/academy/multi-agent-orchestration/03-communication-patterns/" class="next">Next: Communication Patterns &rarr;</a>
</nav>

</div>
