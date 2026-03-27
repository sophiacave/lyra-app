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
  <span class="section-label">Key Takeaway</span>
  <h2 class="section-title">Clarity Creates Quality</h2>
  <p class="section-text">The time you invest in defining agent roles pays off exponentially. Clear roles mean predictable outputs, easier debugging, and systems that scale. When something goes wrong, you know exactly which agent to examine. When you need to improve quality, you tune the specific agent without disrupting the whole team.</p>
</div>

<nav class="lesson-nav">
  <a href="/academy/multi-agent-orchestration/01-why-multiple-agents/" class="prev">&larr; Previous: Why Multiple Agents</a>
  <a href="/academy/multi-agent-orchestration/03-communication-patterns/" class="next">Next: Communication Patterns &rarr;</a>
</nav>

</div>
