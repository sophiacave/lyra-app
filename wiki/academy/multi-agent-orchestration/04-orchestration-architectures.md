# Orchestration Architectures

**Course:** Multi-Agent Orchestration
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[Multi-Agent Orchestration](/academy/multi-agent-orchestration/)
  Lesson 4 of 10


  # Orchestration Architectures

  Hub-spoke, pipeline, swarm — choosing the right structure for your agent team.


  ### What You'll Learn


    - The three core orchestration architectures

    - How to pick the right architecture for your use case

    - Trade-offs: control vs. flexibility vs. complexity

    - Hybrid architectures for real-world systems




  Architecture 1
  ## Hub-Spoke: The Central Commander

  One orchestrator agent sits at the center. It receives tasks, breaks them down, delegates to specialist agents, collects results, and assembles the final output. Every message flows through the hub.
  **Strengths:** Easy to reason about, clear chain of command, simple debugging. You always know who's in charge.
  **Weaknesses:** The hub is a bottleneck and a single point of failure. If it gets confused, the whole system breaks.
  **Use when:** You need tight control, the workflow is well-defined, and you have fewer than 5-6 agents.


Python — Hub-spoke: orchestrator delegates to specialists

```
import anthropic

client = anthropic.Anthropic()

def call_agent(system: str, message: str) -> str:
    # Each agent is a Claude call with a specialized system prompt
    r = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=1024,
        system=system, messages=[{"role": "user", "content": message}]
    )
    return r.content[0].text

def orchestrator(task: str) -> str:
    # Step 1: Hub decides which specialist to use
    route = call_agent(
        "You are a router. Given a support ticket, respond with ONLY one word: billing, technical, or account.",
        task
    ).strip().lower()

    # Step 2: Hub delegates to the right specialist
    specialists = {
        "billing":   "You handle billing issues. Check charges, process refunds, explain invoices.",
        "technical": "You handle technical issues. Debug errors, check system status, guide fixes.",
        "account":   "You handle account issues. Reset passwords, update profiles, manage access.",
    }
    result = call_agent(specialists.get(route, specialists["technical"]), task)

    # Step 3: Hub assembles the final response
    return f"[Routed to {route}]\n{result}"

print(orchestrator("I was charged twice for my subscription"))
# → [Routed to billing]
# → "I can see a duplicate charge on your account..."
```


  Architecture 2
  ## Pipeline: The Assembly Line

  Agents are arranged in sequence. Each one processes the input, transforms it, and passes it to the next. No central controller — the flow is baked into the structure itself. Like a factory assembly line where each station adds value.
  **Strengths:** Simple, predictable, easy to test each stage independently. Adding a new step is just inserting a new agent.
  **Weaknesses:** No flexibility for branching logic. If step 3 needs to go back to step 1, the architecture fights you.
  **Use when:** Your workflow is truly linear — research, then write, then edit, then publish. No loops, no branches.


Python — Pipeline: each agent transforms and passes forward

```
# Define pipeline stages — each agent's output feeds the next agent's input
PIPELINE = [
    ("researcher",  "Research this topic. Return key findings as bullet points."),
    ("writer",      "Turn these research findings into a polished blog post."),
    ("editor",      "Edit this draft for clarity, grammar, and flow. Return the improved version."),
    ("seo",         "Add SEO metadata: title tag, meta description, suggested internal links."),
]

def run_pipeline(initial_input: str) -> str:
    current = initial_input
    for name, system_prompt in PIPELINE:
        print(f"  Stage: {name}...")
        current = call_agent(system_prompt, current)  # output → next input
    return current

result = run_pipeline("Write about AI agents for small business owners")
# Research → Draft → Edited draft → Final post with SEO metadata
```


  Architecture 3
  ## Swarm: The Autonomous Collective

  No central controller. Agents operate independently, communicating peer-to-peer. They self-organize based on the current state of the work. Like a flock of birds — no leader, but the group moves with purpose.
  **Strengths:** Highly resilient, scales naturally, can handle unpredictable workflows. If one agent fails, others adapt.
  **Weaknesses:** Hard to debug, unpredictable behavior, potential for agents to conflict or duplicate work.
  **Use when:** The problem space is dynamic, you need maximum resilience, and you can tolerate some unpredictability.


Python — Swarm: parallel agents converge on a shared blackboard

```
import asyncio

# Swarm agents work independently on the same topic
SWARM = [
    ("academic",   "Find peer-reviewed papers and technical reports on this topic."),
    ("industry",   "Find real-world case studies and company implementations."),
    ("contrarian", "Find criticisms, failures, and reasons this approach might not work."),
]

async def research_swarm(topic: str) -> dict:
    # All agents research the SAME topic in parallel — no coordinator
    tasks = [call_agent_async(sys, topic) for _, sys in SWARM]
    results = await asyncio.gather(*tasks)
    # Collect results on a "blackboard"
    blackboard = {name: result for (name, _), result in zip(SWARM, results)}

    # Synthesis agent reads the full blackboard and produces a report
    synthesis = call_agent(
        "Synthesize these three research perspectives into a balanced report.",
        str(blackboard)
    )
    return {"perspectives": blackboard, "synthesis": synthesis}

report = asyncio.run(research_swarm("AI agents in healthcare"))
# 3 agents research simultaneously → synthesis agent merges findings
```



    **Hub-Spoke**
    Control + clarity


    **Pipeline**
    Simplicity + testability


    **Swarm**
    Resilience + speed



  Real Example
  ## Choosing the Right Architecture




      Customer Support System → Hub-Spoke
      `Orchestrator receives ticket → routes to Triage Agent → sends to appropriate Specialist Agent (billing, technical, account) → Specialist resolves → Orchestrator sends response.`
      Clear routing, controlled escalation. The orchestrator ensures no ticket falls through the cracks.


      Code Review Pipeline → Pipeline
      `Linter Agent → Security Scanner Agent → Style Checker Agent → Summary Agent → each adds their findings sequentially.`
      Each stage is independent. The order matters but each agent has a single, clear job.


      Research Swarm → Swarm
      `Multiple Research Agents explore different angles simultaneously. They share findings on a blackboard. A Synthesis Agent watches the blackboard and produces a report when enough evidence accumulates.`
      No single path. Agents explore in parallel and converge when ready.




  Try It Yourself
  ## Architecture Selection Exercise


    For each scenario below, decide which architecture fits best and explain why. Then pick one and sketch the agent flow.

      `Scenario A: Automated blog publishing (research → write → edit → SEO → publish)
Scenario B: Real-time fraud detection across multiple data streams
Scenario C: AI-powered hiring pipeline with resume screening, skills assessment, and interview scheduling

My choice for [scenario]: [architecture] because [reasoning]`




  Key Terms
  ## Orchestration flashcards.

  [Interactive: FlashDeck]


  Practice
  ## Architecture comparison.


  Key Takeaway
  ## Architecture Is a Decision, Not a Default

  Most people default to hub-spoke because it feels natural. But the right architecture depends on your workflow's shape — linear processes want pipelines, dynamic processes want swarms, and controlled processes want hub-spoke. In practice, you'll often use hybrids: a hub-spoke system where one of the spokes is itself a pipeline. Start simple. Evolve the architecture as your system's needs become clear.


  Check Your Understanding
  ## Orchestration architectures quiz.





  [← Previous: Communication Patterns](/academy/multi-agent-orchestration/03-communication-patterns/)
  [Next: Shared Memory & State →](/academy/multi-agent-orchestration/05-shared-memory-and-state/)
