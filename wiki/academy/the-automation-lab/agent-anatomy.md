# Agent Anatomy

**Course:** The Automation Lab
**Order:** 2
**Type:** lesson
**Access:** Free

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 2 of 10


  # Agent Anatomy

  Every autonomous agent — from a simple inbox monitor to a fleet managing your entire business — is built from six core components. This lesson dissects each one, shows you how they map to real code, and lets you build your own agent config from scratch.



    ## The Six Components

    Strip away the framework-specific jargon and every agent has the same anatomy. Whether you are using Claude Agent SDK, LangGraph, CrewAI, or building from scratch — these six pieces are always present, even if they go by different names.
    Here is each component explained:




      ** Identity**
      Who the agent is. Its name, role, personality, and voice. Identity is not decoration — it shapes every decision the agent makes. An agent with the identity "cautious security auditor" will behave very differently from one with the identity "creative marketing writer," even given the same tools and inputs.
      In practice, identity is encoded in the system prompt. Claude Agent SDK calls this the `instructions` field. LangChain calls it `system_message`.


      ** Memory**
      What the agent knows and remembers. Three types: **short-term** (the current conversation window — fast but ephemeral), **long-term** (stored in a database — survives across sessions), and **shared** (accessible to other agents — the communication bus). Memory is what makes an agent smarter over time.


      ** Tools**
      What the agent can do. API calls, database queries, file operations, sending messages, running shell commands. Tools are the agent's hands — without them, it can only think. In Claude's API, tools are defined as JSON schemas. MCP standardizes this across all clients.


      ** Goals**
      What the agent is trying to achieve. Goals drive the decide phase of the agent loop. They can be **persistent** (always active, like "keep the server healthy") or **triggered** (activated by events, like "respond to this support ticket"). A common mistake is vague goals like "be helpful." Effective goals are specific: "Respond to all support tickets within 5 minutes."


      ** Guardrails**
      What the agent must NOT do. Boundaries, safety rules, ethical constraints, and hard limits. Guardrails operate at a higher priority than goals. A goal says "send marketing emails." A guardrail says "never send more than 100 emails per hour." When they conflict, the guardrail wins.


      ** Schedule**
      When and how the agent runs. Three modes: **event-driven** (reacts to triggers like webhooks), **cron-based** (runs on a fixed schedule), or **always-on** (continuously monitoring). Always-on agents respond instantly but consume the most resources. Event-driven agents balance responsiveness and efficiency.




    ## How This Maps to Real Code

    Here is what a complete agent configuration looks like as a Python dataclass. This is a pattern you will see in nearly every agent framework:



```
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class AgentConfig:
    # Identity
    name: str
    role: str
    voice: str = "neutral"

    # Goals
    goals: List[str] = field(default_factory=list)

    # Tools — list of callable functions
    tools: List[str] = field(default_factory=list)

    # Guardrails — hard limits that override goals
    guardrails: List[str] = field(default_factory=list)

    # Memory config
    memory_type: str = "short_term"  # or "long_term", "shared"

    # Schedule
    schedule: Optional[str] = None  # cron expression
    trigger: Optional[str] = None  # event name

# Example: a support agent
support_agent = AgentConfig(
    name="Atlas",
    role="Tier 1 Support",
    voice="friendly, concise",
    goals=["Resolve tickets within 5 min", "Escalate P0s immediately"],
    tools=["search_kb", "send_reply", "escalate_ticket", "log_resolution"],
    guardrails=["Never share internal docs", "Never close without resolution"],
    memory_type="long_term",
    trigger="on_new_ticket"
)
```


    Every field maps directly to one of the six components. When you use a framework like Claude Agent SDK, you are filling in these same fields — just through a different interface.



    ## Common Design Mistakes

    Most agent failures trace back to a misconfigured component. Watch for these:



        **Too many tools**
        An agent with 50 tools gets confused about which one to use. LLMs perform better with 5-15 focused tools. If you need more, split into multiple specialized agents.


        **Vague identity**
        "You are a helpful assistant" produces generic behavior. "You are a senior DevOps engineer who prioritizes stability over speed and always explains trade-offs" produces targeted, useful behavior.


        **No guardrails**
        An agent without guardrails will optimize its goals at any cost. A sales agent told to "maximize conversions" with no guardrails might start making false promises. Always define what the agent must NOT do.





    ## Component Interactions

    The six components do not operate in isolation — they form a connected system. Understanding how they interact prevents common design failures:



        **Identity shapes Decisions**
        An agent's identity (system prompt) directly affects which tools it chooses and how it interprets goals. A "cautious security auditor" will refuse risky actions that a "move-fast developer" would execute immediately. The same tools and goals produce different behavior with different identities.


        **Memory informs Goals**
        Long-term memory stores past outcomes. If the agent remembers that a particular approach failed last time, it adjusts its goal-pursuit strategy. Without memory, the agent repeats mistakes indefinitely. Memory is the mechanism by which agents learn.


        **Guardrails override Everything**
        Guardrails sit above goals, tools, and identity in the priority hierarchy. A guardrail that says "never delete production data" cannot be overridden by a goal that says "clean up old records." This precedence is critical — without it, goal-oriented agents will optimize past safety boundaries.


        **Schedule determines Resource Usage**
        An always-on agent consumes compute 24/7. An event-driven agent consumes nothing until triggered. Choosing the wrong schedule wastes money (always-on for a weekly report) or misses events (cron for real-time alerts). Match the schedule to the use case.





    ## The Agent Config Pattern in Frameworks

    Every major framework maps to these six components. Here is how the terminology translates:




          Component
          Claude SDK
          LangGraph
          CrewAI


          Identity
          instructions
          system_message
          role + backstory


          Memory
          conversation + tools
          state / checkpointer
          memory flag


          Tools
          tools (JSON schema)
          tools (bound)
          tools list


          Goals
          in instructions
          in system_message
          goal field


          Guardrails
          guardrails config
          conditional edges
          in backstory


          Schedule
          external (cron/trigger)
          external (cron/trigger)
          process type



    Different names, same anatomy. Learn the six components once and you understand every framework.



    ## Building Your First Agent Config

    Start with these questions for each component. Answer them before writing any code:


      **Identity:** What role does this agent play? What is its voice — formal, casual, technical?

      **Memory:** Does it need to remember across sessions? Does it share state with other agents?

      **Tools:** What 5-10 actions does this agent need? (Start narrow — you can always add more.)

      **Goals:** What specific, measurable outcomes is this agent pursuing?

      **Guardrails:** What must this agent NEVER do? What are the hard limits?

      **Schedule:** Should it run on a timer, respond to events, or loop continuously?




### The 6 Agent Components

**Card 1:**
Front: Identity
Back: Who the agent is — name, role, personality, and voice. Encoded in the system prompt. Shapes every decision the agent makes.

**Card 2:**
Front: Memory
Back: What the agent knows. Short-term (conversation window), long-term (database), shared (accessible to other agents). Makes agents smarter over time.

**Card 3:**
Front: Tools
Back: What the agent can do — API calls, database queries, file ops. Defined as JSON schemas (or MCP servers). Without tools, agents can only think.

**Card 4:**
Front: Goals
Back: What the agent is trying to achieve. Must be specific and measurable. Persistent (always active) or triggered (event-activated).

**Card 5:**
Front: Guardrails
Back: What the agent must NOT do. Hard limits that override goals. Without guardrails, agents optimize recklessly.

**Card 6:**
Front: Schedule
Back: When the agent runs — event-driven (webhooks), cron-based (timer), or always-on (continuous). Determines autonomy and resource usage.



### Quiz

**Q1: Which component defines what an agent is NOT allowed to do?**
    A. Goals
    B. Memory
  ✓ C. Guardrails
    D. Schedule
  *Guardrails are the hard limits — they define forbidden actions and override goals when they conflict.*

**Q2: An agent that reacts to a webhook event rather than running on a timer uses which schedule type?**
    A. Cron-based
    B. Always-on
  ✓ C. Event-driven
    D. Manual
  *Event-driven agents wake up in response to triggers like webhooks, new records, or incoming messages.*

**Q3: What is the difference between long-term memory and shared memory?**
    A. Long-term is faster
  ✓ B. Shared memory is accessible to ALL agents; long-term belongs to one agent
    C. There is no difference
    D. Long-term lasts forever; shared is session-only
  *Shared memory (brain_context) is the bridge between agents. Long-term memory (agent_memory) belongs to a single agent and persists across its sessions.*

**Q4: An agent with 50 tools keeps choosing the wrong one. What is the most likely fix?**
    A. Add more tools
  ✓ B. Split into multiple specialized agents with 5-15 tools each
    C. Remove all guardrails
    D. Switch to always-on scheduling
  *LLMs perform better with fewer, focused tools. Too many tools creates confusion. Split into specialized agents that each excel at a narrow task.*

**Q5: Why is 'You are a helpful assistant' a bad agent identity?**
    A. It is too long
    B. It is too specific
  ✓ C. It is too vague — it produces generic behavior instead of targeted, useful actions
    D. It violates guardrails
  *Vague identities produce vague behavior. Specific identities (role + priorities + voice) produce focused, predictable agents.*
