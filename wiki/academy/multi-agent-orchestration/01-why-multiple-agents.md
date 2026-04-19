# Why Multiple Agents

**Course:** Multi-Agent Orchestration
**Order:** 1
**Type:** lesson
**Access:** Free

---
[Multi-Agent Orchestration](/academy/multi-agent-orchestration/)
  Lesson 1 of 10


  # Why Multiple Agents

  When one AI isn't enough — and why the future of AI is a team sport.


  ### What You'll Learn


    - Why single-agent systems hit a ceiling

    - The problems that demand multiple specialized agents

    - How multi-agent systems mirror real-world teams

    - When to use one agent vs. many




  The Ceiling
  ## One Agent Can Only Do So Much

  A single AI agent is powerful. It can write code, analyze data, draft documents, and reason through problems. But give it a complex, multi-step workflow — research a topic, write a report, fact-check it, format it for three different audiences, and schedule distribution — and cracks appear.
  Context windows fill up. Attention drifts. The agent tries to be a researcher, writer, editor, and project manager simultaneously, and the quality of each role suffers. This is the single-agent ceiling.


  The Insight
  ## Specialization Beats Generalization

  Humans figured this out millennia ago. You don't ask your surgeon to also do your taxes. Teams of specialists outperform generalists on complex work — not because any individual is smarter, but because focus produces quality.
  The same principle applies to AI. A coding agent that only writes code will outperform a general agent that also handles research, testing, and documentation. When you split responsibilities, each agent can maintain deep context for its specific domain.


  Real Example
  ## Single Agent vs. Agent Team




      Single Agent Approach
      `"Research competitor pricing, analyze the data, write a strategy memo, and create a presentation."`
      Result: Shallow research, generic analysis, bloated context window. The memo reads like a first draft.


      Multi-Agent Approach
      `Research Agent → gathers and validates competitor data
Analysis Agent → identifies patterns and strategic insights
Writing Agent → crafts the memo with clear recommendations
Orchestrator → coordinates handoffs and ensures consistency`
      Result: Deep research, sharp analysis, polished output. Each agent excels at its one job.




  The Decision
  ## When to Go Multi-Agent

  **Use one agent when:** The task is self-contained, fits in a single context window, and doesn't require fundamentally different expertise at different stages.
  **Use multiple agents when:** The workflow has distinct phases requiring different skills, the total context would overwhelm a single agent, you need parallel processing, or you want built-in checks and balances (one agent reviews another's work).
  **The rule of thumb:** If you'd hire multiple people for the job, you probably want multiple agents.


  Comparison
  ## Single Agent vs Multi-Agent: Side by Side

  Understanding the tradeoffs between a single agent and a multi-agent system helps you choose the right architecture before you write a single line of code. Here is a direct comparison across the dimensions that matter most in production.



      Context Management
      `**Single Agent:** One context window holds everything — task instructions, accumulated data, reasoning history. Works well until the window fills up and the agent starts losing track of earlier information.

**Multi-Agent:** Each agent gets a focused context window containing only what it needs. The researcher's context is full of source data. The writer's context is full of the brief and style guide. Neither is diluted by the other's concerns.`


      Error Isolation
      `**Single Agent:** A mistake in one reasoning step contaminates everything downstream. If the agent hallucinates a fact during research, that hallucination carries through to writing, editing, and final output.

**Multi-Agent:** Errors are contained within individual agents. A reviewer agent can catch the researcher's hallucination before it reaches the writer. Mistakes are isolated, not propagated.`


      Scalability
      `**Single Agent:** To handle more work, you run more instances of the same monolithic agent. Each instance repeats the full overhead of every capability.

**Multi-Agent:** Scale individual agents independently. Need more research capacity? Add more researcher agents. The writer agent doesn't need to scale at the same rate. You match resources to actual bottlenecks.`


      Cost
      `**Single Agent:** Every call uses the same (usually expensive) model for every task — research, writing, formatting, validation. You pay premium prices for mundane work.

**Multi-Agent:** Use tiered models. Premium model for reasoning-heavy agents, cheaper models for formatting and routing. A well-tiered multi-agent system often costs less per task than a single premium agent doing everything.`




  Decision Framework
  ## When to Use Multiple Agents: Five Criteria

  Not every workflow needs a multi-agent system. Use these five criteria as a decision framework. If your use case hits three or more, multi-agent is likely the right architecture.

  **1. Distinct Skill Domains** — Does the workflow require fundamentally different types of expertise? Writing code and reviewing code for security vulnerabilities are different skills. An agent tuned for creative writing will have different system prompt constraints than one tuned for data validation. If the task requires you to switch mental modes, it probably requires different agents.

  **2. Context Window Pressure** — Will the accumulated data, instructions, and intermediate results exceed what one agent can hold effectively? Research output alone can run to thousands of tokens. Add task instructions, style guides, previous outputs, and error context — and a single agent is reasoning with a crowded, noisy prompt. Multiple agents each get clean, focused context.

  **3. Quality Checkpoints Required** — Does the output need to be reviewed, validated, or fact-checked before it is final? A single agent checking its own work is like proofreading your own essay — you miss what you expect to see. A separate reviewer agent brings fresh perspective to the same content. Built-in adversarial review is one of the strongest arguments for multi-agent design.

  **4. Parallelizable Subtasks** — Can parts of the workflow run simultaneously? If you need to research three different topics, three research agents working in parallel deliver results in the time it takes one agent to research a single topic. Parallelism is free speed — but only if your architecture supports it.

  **5. Failure Isolation Matters** — Is it important that a failure in one part of the system does not bring down the whole workflow? In a single-agent system, an API timeout kills the entire run. In a multi-agent system, one agent can fail while others continue. You can retry the failed agent or fall back to an alternative without losing the work already completed by other agents.


  Practical Example
  ## Multi-Agent Customer Support System

  Here is a concrete example of how a real multi-agent system is structured. A customer support system that handles incoming tickets, routes them, generates responses, and escalates when needed.


Python — Multi-agent customer support system

```
class SupportSystem:
    # Router Agent: classifies incoming tickets by category and urgency
    router = Agent(
        name="Router",
        model="haiku",  # cheap model — classification is simple
        prompt="Classify this support ticket. Output: category, urgency (1-5), "
               "and which specialist should handle it. Never draft a response."
    )

    # Knowledge Agent: searches docs and past tickets for relevant context
    knowledge = Agent(
        name="Knowledge",
        model="sonnet",  # needs reasoning to find relevant info
        prompt="Search the knowledge base for information relevant to this "
               "ticket. Return the top 3 matching articles and any similar "
               "past tickets with their resolutions. Never draft a response."
    )

    # Response Agent: drafts the customer-facing reply
    responder = Agent(
        name="Responder",
        model="sonnet",  # needs quality writing
        prompt="Draft a helpful, empathetic response using the knowledge "
               "base context provided. Match the brand voice guide. If the "
               "issue cannot be resolved with available info, recommend "
               "escalation — do not guess."
    )

    # Escalation Agent: monitors for tickets that need a human
    escalation = Agent(
        name="Escalation",
        model="haiku",  # simple threshold checks
        prompt="Review this ticket and response. Escalate to a human if: "
               "urgency >= 4, customer sentiment is angry, the topic involves "
               "billing disputes over $100, or the responder flagged uncertainty."
    )

    def handle_ticket(self, ticket: str):
        route = self.router.run(ticket)             # Step 1: classify
        context = self.knowledge.run(ticket, route)  # Step 2: gather context
        response = self.responder.run(ticket, context) # Step 3: draft reply
        decision = self.escalation.run(ticket, response) # Step 4: escalate?
        if decision.escalate:
            return send_to_human(ticket, response, decision.reason)
        return send_to_customer(response)
```


  Notice the architecture choices. The router and escalation agents use cheap models because their tasks are simple classification. The knowledge and responder agents use mid-tier models because they need reasoning. No agent tries to do everything. Each one is focused, testable, and replaceable independently.


  Try It Yourself
  ## Map a Workflow


    Think of a complex task you regularly do with AI. Break it into distinct phases. For each phase, ask: what role would a specialist play here? Write out the agent team you'd build.

      `My workflow: [describe it]
Phase 1: [task] → Agent role: [specialist]
Phase 2: [task] → Agent role: [specialist]
Phase 3: [task] → Agent role: [specialist]
Orchestration: How do they hand off work?`




  Practice
  ## When to use one agent vs. many.


  Key Takeaway
  ## The Future Is Collaborative AI

  Multi-agent orchestration isn't about replacing one powerful AI with many weaker ones. It's about unlocking capabilities that emerge only when specialized agents work together. Throughout this course, you'll learn to design, build, and manage these agent teams — turning complex workflows into reliable, scalable systems.


  Review
  ## Key concepts.

  [Interactive: FlashDeck]


  Check Your Understanding
  ## Why multiple agents quiz.






  [Next: Agent Roles & Specialization →](/academy/multi-agent-orchestration/02-agent-roles-and-specialization/)
