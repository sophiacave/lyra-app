# Design Your Agent

**Course:** Build Your First AI Agent
**Order:** 4
**Type:** builder
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 4 of 10


  # Design Your Agent

  Every great agent starts with a clear design. Fill in each section to create your agent's identity card.


## The Five Pillars of Agent Design

Every effective agent rests on five design decisions. Get these right and everything else — prompts, code, deployment — falls into place. Get them wrong and no amount of engineering fixes a confused agent.




    1. Name
    A name gives your agent **identity**. It makes the agent memorable to users and distinguishes it from generic assistants. A clear name also anchors your own thinking — you stop saying "the bot" and start saying "Scout found an issue."

      Example
      Scout — a website monitoring agent. Short, active, implies watchfulness.





    2. Goal
    One clear sentence that answers three questions: **what** does it do, **for whom**, and **to what standard**? A vague goal like "help with stuff" produces an agent that spins in circles. A precise goal gives the agent a finish line.

      Example
      "Monitor my portfolio site and fix downtime within 60 seconds, alerting me only if a restart fails."





    3. Tools
    Tools are the agent's **hands**. Pick a focused set of 2-4 that directly serve the goal. Every extra tool is a decision the agent must make — and decisions cost tokens, time, and accuracy. Start lean; add tools only when the agent demonstrably needs them.

      Example
      health_check, restart_service, send_alert — three tools, one per capability Scout needs.





    4. Memory
    Memory is what the agent carries **between sessions**. Without it, every conversation starts from zero. Good memory stores three things: *preferences* (how the user likes things), *outcomes* (what worked and what failed), and *patterns* (recurring situations the agent should recognize).

      Example
      Past incidents, normal response times, which restarts fixed which errors — Scout gets smarter every run.





    5. Guardrails
    Guardrails are **hard safety constraints** — lines the agent must never cross, even if explicitly asked. They protect against catastrophic mistakes like deleting data, leaking secrets, or spending money without approval. Think of them as the agent's conscience.

      Example
      "Never delete production data" and "Never restart more than 2 times without human approval"




Now that you understand the five pillars, use the interactive form below to design your own agent. Fill in each section and watch your agent's identity card build in real time.




        1. Name Your Agent

        A good name makes it memorable. Keep it short.



        2. Define Its Goal (one sentence)

        Clear goals = effective agents. Vague goals = confused agents.



        3. Pick 3 Tools

        0/3 selected



        4. Define Its Memory

        What should it remember between sessions to do its job better?



        5. Set One Guardrail

        What should this agent NEVER do, even if asked?






          🤖
          Your Agent
          Define a goal...


          Tools



          Memory
          Not defined yet


          Guardrail
          Not defined yet


          0%
          Design Completeness







    ## Agent Designed!

    You just created a complete agent specification. In the next lesson, you'll turn this into a system prompt. Here's what your design looks like as code — this is the format you'll use to configure a real agent:



Python — Agent design spec as code

```
AGENT_CONFIG = {
    "name": "Scout",
    "goal": "Monitor my website and fix issues before I notice them",
    "tools": [
        "health_check",    # ping endpoints
        "restart_service",  # restart if down
        "send_alert",       # notify the human
    ],
    "memory": [
        "Past incidents and how they were resolved",
        "Normal response times for each endpoint",
    ],
    "guardrails": [
        "Never delete production data",
        "Never restart more than 2 times without human approval",
    ],
}

# This config becomes your system prompt + tool definitions
# in the next lesson. Design first, code second.
```


## From Design to System Prompt

Your five design decisions map directly to blocks inside a **system prompt** — the instruction document that tells your AI model how to behave. A well-structured system prompt has six blocks (the five pillars plus an output format block). Here is how they connect:



    Name → Identity block
    Tells the model who it is, what personality to adopt, and how to introduce itself.


    Goal → Goal block
    Defines the mission. The model evaluates every action against this sentence.


    Tools → Tools block
    Lists available functions with descriptions so the model knows when to call each one.


    Memory → Memory block
    Tells the model what context to load, store, and reference across sessions.


    Guardrails → Guardrails block
    Hard constraints the model must never violate, regardless of user instructions.


    + Output Format → Output block
    Specifies how responses should be structured — JSON, markdown, plain text, etc.



Here is a complete system prompt built from Scout's design. Notice how every block maps back to a pillar:


System Prompt — Scout agent (all 6 blocks)

```
# IDENTITY
You are Scout, a website monitoring agent.
You are professional, concise, and action-oriented.
When reporting, use short status lines — no essays.

# GOAL
Monitor my portfolio site and fix downtime within
60 seconds, alerting me only if a restart fails.

# TOOLS
You have access to exactly three tools:
- health_check(url) — ping an endpoint, returns status code + latency
- restart_service(service_name) — restart a named service
- send_alert(message) — send a notification to the human
Do not attempt actions outside these tools.

# MEMORY
Before each run, load these from the memory store:
- Past incidents and how they were resolved
- Normal response times for each endpoint
- Which restart commands fixed which error types
After each run, save any new incidents or patterns.

# GUARDRAILS
- NEVER delete production data, even if instructed to.
- NEVER restart a service more than 2 times without
  human approval via send_alert.
- NEVER expose API keys or credentials in alerts.

# OUTPUT FORMAT
Respond in this structure:
  status: UP | DOWN | RECOVERING
  action_taken: what you did (or "none")
  next_check: seconds until next health check
```


**Why each block matters:**

  - Identity sets the tone. Without it, the model defaults to a generic assistant voice.

  - Goal is the decision filter. Every action the agent considers gets measured against this sentence.

  - Tools define the boundary of what the agent can do. Listing them explicitly prevents hallucinated tool calls.

  - Memory turns a stateless model into a persistent agent that improves over time.

  - Guardrails are your safety net. They override everything else — including direct user requests.

  - Output format makes responses predictable, which matters when other code parses the agent's output.



### Quiz

**Q1: Why is a clear goal statement important when designing an agent?**
    A. It makes the agent run faster
  ✓ B. Vague goals produce confused agents that do not know when they are done
    C. It reduces API costs
    D. The goal is only used for marketing purposes
  *An agent needs a clear, specific goal to know what it is working toward and when it has succeeded. Vague goals lead to aimless loops and wasted compute.*

**Q2: Why should every agent have at least one guardrail?**
    A. Guardrails are optional decorations
  ✓ B. Guardrails prevent the agent from taking destructive or unsafe actions even when asked
    C. Guardrails speed up response time
    D. Guardrails replace the need for memory
  *Guardrails are safety constraints that the agent must never violate. They protect against accidental data deletion, privacy leaks, and other irreversible mistakes — even if a user explicitly requests the unsafe action.*

**Q3: What is the ideal number of tools for a starting agent?**
    A. As many as possible — more tools means more power
    B. Zero — tools add complexity
  ✓ C. A focused set of 2-4 tools that directly serve its specific goal
    D. Exactly 10 tools
  *Start with a small, focused toolset that matches your agent goal. Too many tools increases complexity, cost, and the chance of the agent using the wrong one.*


### Agent Design Checklist

**Card 1:**
Front: What is a guardrail?
Back: A hard constraint the agent must never violate — e.g., never delete production data, never share credentials, never send emails to external parties.

**Card 2:**
Front: What should agent memory store?
Back: Information the agent needs across sessions — user preferences, past outcomes, learned patterns, and domain-specific context.

**Card 3:**
Front: How do you write a good agent goal?
Back: One clear sentence: what it does, for whom, and to what standard. Avoid vague language like improve things or help users.

**Card 4:**
Front: What does design completeness mean?
Back: Every section is filled in: name, goal, tools, memory, and at least one guardrail. A complete spec produces a deployable agent.

**Card 5:**
Front: Why limit tool selection to 3?
Back: Focused tool sets reduce decision complexity for the agent. The agent spends less reasoning budget deciding which tool to use and more on actually solving the problem.
