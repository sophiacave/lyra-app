# Agent Roles and Specialization

**Course:** Multi-Agent Orchestration
**Order:** 2
**Type:** lesson
**Access:** Free

---
[Multi-Agent Orchestration](/academy/multi-agent-orchestration/)
  Lesson 2 of 10


  # Agent Roles and Specialization

  Designing agents with specific jobs — because a focused agent is a powerful agent.


  ### What You'll Learn


    - How to define clear agent roles and responsibilities

    - The anatomy of a well-designed agent persona

    - Common agent archetypes and when to use them

    - How to prevent role overlap and confusion




  The Foundation
  ## Every Agent Needs a Job Description

  Just like hiring for a team, each agent needs a clear role, defined boundaries, and specific expertise. A vague agent produces vague results. An agent that knows exactly what it's responsible for — and what it's not — delivers consistently.
  A good agent definition includes four things: its purpose (what it exists to do), its inputs (what it receives), its outputs (what it produces), and its constraints (what it should never do).


  The Archetypes
  ## Six Agent Roles You'll Use Everywhere

  **Researcher** — Gathers, validates, and synthesizes information. Never makes decisions, only presents findings.
  **Analyst** — Takes raw data and extracts patterns, insights, and recommendations. Thinks in frameworks.
  **Creator** — Produces content: writing, code, designs, plans. Focuses on craft and quality.
  **Critic** — Reviews and evaluates work from other agents. Finds flaws, suggests improvements, enforces standards.
  **Executor** — Takes actions: runs code, calls APIs, manages files. Focused on reliability and error handling.
  **Orchestrator** — Coordinates the team. Routes tasks, manages handoffs, tracks progress. The project manager.


  Real Example
  ## Building a Content Pipeline Team




      Agent Team Definition
      `Orchestrator: "You manage a content pipeline. Route topics to Research, send findings to Writer, pass drafts to Editor. Track status of each piece."


Research Agent: "You research topics deeply. Use provided sources. Output structured findings with citations. Never write final copy."


Writer Agent: "You write blog posts from research briefs. Match the brand voice guide. Output clean markdown. Never fact-check — that's not your job."


Editor Agent: "You review drafts for clarity, accuracy, and brand voice. Output specific edit suggestions with line references. Never rewrite — suggest."`




  Deep Dive
  ## Common Agent Roles: A Detailed Reference

  Beyond the six archetypes, here are specific agent roles that appear repeatedly in production multi-agent systems. Understanding these helps you map your workflow to proven patterns.

  **Router Agent** — The traffic controller. Receives incoming requests and routes them to the right specialist agent based on classification. A router agent reads every ticket, email, or task that enters the system and decides which agent should handle it. It never does the work itself — it only directs. Routers typically use cheap, fast models because classification is simpler than generation.

  **Researcher Agent** — The investigator. Gathers raw information from documents, databases, APIs, or web sources. A good researcher agent is constrained to never draw conclusions or make recommendations — its job is to surface relevant facts and cite sources. This prevents it from biasing the analysis phase with premature opinions.

  **Writer Agent** — The craftsperson. Takes structured briefs, research output, or outlines and produces polished content. Writer agents are tuned for voice, tone, and format. They should receive clear brand guidelines and style constraints in their system prompt. They never research or fact-check — those are other agents' jobs.

  **Reviewer Agent** — The quality gate. Evaluates output from other agents against specific criteria: accuracy, style, completeness, safety, compliance. A reviewer agent needs explicit rubrics — "check for factual claims without citations" is more useful than "make sure it's good." The best reviewer agents output structured scores alongside specific feedback.

  **Executor Agent** — The doer. Takes plans and executes them in the real world: running code, calling APIs, updating databases, sending messages. Executor agents need robust error handling because they interact with external systems that can fail unpredictably. They should report exactly what they did, what succeeded, and what failed.

  **Monitor Agent** — The watchdog. Runs continuously or periodically, watching for anomalies, threshold breaches, or events that require action. Monitor agents are the early warning system. They watch logs, metrics, or outputs from other agents and trigger alerts or escalations when something is off. They never fix problems — they detect and report.


  Code Example
  ## Role-Based System Prompts in Practice

  The system prompt is where an agent's role becomes real. Here is how to write system prompts that enforce clear role boundaries for each agent in a content pipeline.


Python — Role-based system prompts with explicit boundaries

```
AGENT_PROMPTS = {
    "router": """You are a Router Agent. Your ONLY job is classification.
Given an incoming request, output a JSON object with:
- category: one of [research, writing, code, support]
- priority: 1 (low) to 5 (critical)
- assigned_to: which specialist agent handles this

CONSTRAINTS:
- NEVER attempt to fulfill the request yourself
- NEVER add commentary or suggestions
- NEVER modify the original request
- Output ONLY the JSON classification object""",

    "researcher": """You are a Research Agent. You investigate and report.
Given a topic and sources, extract key findings with citations.

OUTPUT FORMAT:
- findings: list of facts with source references
- gaps: what information is missing or uncertain
- confidence: 0.0 to 1.0 for each finding

CONSTRAINTS:
- NEVER write final copy or marketing language
- NEVER make recommendations or strategic suggestions
- NEVER speculate beyond what the sources support
- If a source is ambiguous, flag it — do not interpret""",

    "writer": """You are a Writer Agent. You craft polished content.
Given a research brief and style guide, produce final copy.

OUTPUT FORMAT:
- content: the finished piece in the requested format
- word_count: actual count
- style_notes: any deviations from the style guide and why

CONSTRAINTS:
- NEVER conduct your own research or add facts not in the brief
- NEVER fact-check — that is the reviewer's job
- NEVER change the scope of what was requested
- Follow the brand voice guide EXACTLY""",

    "reviewer": """You are a Reviewer Agent. You evaluate and critique.
Given a draft and the original brief, assess quality.

OUTPUT FORMAT:
- score: 1-10 overall quality
- issues: list of specific problems with line references
- verdict: approve / revise / reject

CONSTRAINTS:
- NEVER rewrite the content yourself — only suggest changes
- NEVER approve work that contradicts the original brief
- NEVER skip the scoring rubric
- Be specific: 'paragraph 3 claims X without citation' not 'needs work'"""
}

def create_agent(role: str, model: str = "sonnet"):
    return Agent(
        system_prompt=AGENT_PROMPTS[role],
        model=model,
        name=role
    )
```


  Principles
  ## Role Design Principles

  Designing effective agent roles is a craft. These principles will help you create agents that are reliable, maintainable, and compose well with each other.

  **Principle 1: One Job, One Agent.** If you can't describe an agent's purpose in a single sentence, it's doing too much. "This agent researches topics and writes summaries" is two jobs. Split them. An agent that does one thing well is easier to test, debug, tune, and replace than an agent that does three things adequately.

  **Principle 2: Define Constraints, Not Just Capabilities.** Telling an agent what it should do is only half the job. Telling it what it must never do is equally important. Without explicit constraints, agents naturally expand their scope. A researcher will start writing conclusions. A writer will start fact-checking. Constraints are the guardrails that keep specialization intact.

  **Principle 3: Standardize Inputs and Outputs.** Every agent should have a well-defined interface — a contract that specifies exactly what format it receives and what format it produces. When Agent A's output perfectly matches Agent B's expected input, the handoff is seamless. When formats are vague, you get parsing errors, lost data, and silent failures at every connection point.

  **Principle 4: Make Roles Testable in Isolation.** A well-designed agent can be tested independently of the rest of the system. Feed it sample inputs and verify the outputs match expectations. If you can't test an agent without spinning up the entire system, the role boundaries aren't clean enough. Unit-testable agents are the building blocks of reliable systems.

  **Principle 5: Design for Replacement.** Every agent should be swappable. If you need to change the model behind your researcher from Sonnet to GPT-4o, the rest of the system shouldn't care — as long as the inputs and outputs stay the same. This modularity is what makes multi-agent systems maintainable over time. No agent should be a single point of fragility.


  The Trap
  ## Avoiding Role Bleed

  The biggest mistake in multi-agent design is letting roles overlap. When the research agent starts writing conclusions, or the writer starts fact-checking, you get redundant work and conflicting outputs.
  Prevent this with explicit boundaries in each agent's system prompt. State what the agent does and what it explicitly does not do. "You are a researcher. You gather and organize information. You never write final copy, make recommendations, or take actions."


  Try It Yourself
  ## Design Your Agent Team


    Pick a workflow you want to automate. Define three agents with distinct roles. For each, write a one-paragraph job description that covers purpose, inputs, outputs, and constraints.

      `Agent: [Name]
Purpose: [What it exists to do]
Inputs: [What it receives from other agents or the user]
Outputs: [What it produces]
Constraints: [What it must never do]`




  Practice
  ## The six agent archetypes.


  Key Takeaway
  ## Clarity Creates Quality

  The time you invest in defining agent roles pays off exponentially. Clear roles mean predictable outputs, easier debugging, and systems that scale. When something goes wrong, you know exactly which agent to examine. When you need to improve quality, you tune the specific agent without disrupting the whole team.


  Review
  ## Key concepts.

  [Interactive: FlashDeck]


  Check Your Understanding
  ## Agent roles quiz.





  [← Previous: Why Multiple Agents](/academy/multi-agent-orchestration/01-why-multiple-agents/)
  [Next: Communication Patterns →](/academy/multi-agent-orchestration/03-communication-patterns/)
