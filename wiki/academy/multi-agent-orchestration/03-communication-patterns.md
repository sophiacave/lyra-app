# Communication Patterns

**Course:** Multi-Agent Orchestration
**Order:** 3
**Type:** lesson
**Access:** Free

---
[Multi-Agent Orchestration](/academy/multi-agent-orchestration/)
  Lesson 3 of 10


  # Communication Patterns

  How agents talk to each other — the protocols that make or break multi-agent systems.


  ### What You'll Learn


    - The three fundamental agent communication patterns

    - How to design message formats agents actually understand

    - Synchronous vs. asynchronous agent communication

    - Common pitfalls that cause agent miscommunication




  Why This Matters
  ## Your Agents Will Break at the Handoffs

  Think about the worst group project you've ever been in. One person does the research and writes a 10-page essay. The next person expected bullet points. The third person doesn't know what happened and starts over. Nobody agrees on the format, the deadlines, or who's responsible for what.
  That's what happens when AI agents pass information without a communication protocol. Agent A outputs a free-form paragraph. Agent B expects structured JSON. The result? Garbled data, lost context, and cascading failures downstream.
  Communication patterns solve this by establishing **contracts** between agents — agreed-upon formats, protocols, and expectations for how information flows through the system. Get this right and your agents coordinate like a surgery team. Get it wrong and you have an expensive game of telephone.


**Real-world analogy:** Communication patterns are like the protocols hospitals use during shift changes. Nurses don't just say "the patient seems fine." They follow SBAR — Situation, Background, Assessment, Recommendation — a structured handoff that ensures nothing gets lost. Agent communication contracts are SBAR for AI.


  Pattern 1
  ## Direct Messaging

  The simplest pattern: Agent A sends output directly to Agent B. Like a relay race — the baton passes from hand to hand. This works well for linear pipelines where each agent's output is the next agent's input.
  **Best for:** Sequential workflows, simple handoffs, two-agent systems.
  **Watch out for:** Format mismatches. Always define the exact structure of what gets passed.


Python — Direct messaging between two agents

```
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

def run_agent(role: str, system_prompt: str, user_input: str) -> str:
    # Each agent is just a Claude call with a specialized system prompt
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_input}]
    )
    return response.content[0].text

# Agent A: Research agent finds information
research_result = run_agent(
    role="researcher",
    system_prompt="You are a research agent. Return findings as JSON with keys: topic, findings (list), confidence (0-1).",
    user_input="Research the top 3 competitors in AI education pricing."
)

# Agent B: Analysis agent receives research output DIRECTLY
analysis_result = run_agent(
    role="analyst",
    system_prompt="You are an analysis agent. You receive research data and produce strategic recommendations.",
    user_input=f"Analyze this research and recommend a pricing strategy:\n{research_result}"
)

print(analysis_result)
# "Based on the competitor analysis, I recommend a freemium model...
#  Tier 1: Free (52 courses). Tier 2: $29/mo (premium features)..."
```


  **Key insight:**
   Each "agent" is just a Claude API call with a specialized system prompt. The magic is in how you connect them — the output of one becomes the input of the next. Simple but powerful.


  Pattern 2
  ## Broadcast (Pub/Sub)

  One agent publishes a message. Multiple agents receive it and decide independently whether to act. Like a team Slack channel — everyone sees the message, but only relevant agents respond.
  **Best for:** Parallel processing, event-driven systems, agents that need to react to the same trigger differently.
  **Watch out for:** Race conditions and duplicate work. Two agents might both try to handle the same task.


Python — Broadcast: one event triggers multiple agents in parallel

```
import asyncio

# Define specialist agents that all react to the same event
AGENTS = {
    "sentiment": "Analyze the sentiment of this customer message. Return: positive/negative/neutral + confidence.",
    "category": "Categorize this support ticket. Return: billing/technical/feature-request/other.",
    "urgency": "Rate the urgency of this message: low/medium/high/critical. Return urgency + reasoning.",
}

async def broadcast(message: str) -> dict:
    # All agents process the SAME message in parallel
    # Each agent sees the same input, but does something different with it
    tasks = {
        name: run_agent_async(name, prompt, message)
        for name, prompt in AGENTS.items()
    }
    results = await asyncio.gather(*tasks.values())
    return dict(zip(tasks.keys(), results))

# One customer message → three specialist analyses in parallel
ticket = "I've been charged twice and my account is locked. This is urgent!"
results = asyncio.run(broadcast(ticket))
# → {"sentiment": "negative (0.95)", "category": "billing", "urgency": "critical"}
```


  Pattern 3
  ## Blackboard (Shared Space)

  All agents read from and write to a shared workspace. No direct messages — agents check the blackboard, see what's new, contribute their piece, and move on. Like a collaborative document where everyone adds their section.
  **Best for:** Complex problems where agents need full context, iterative refinement, consensus building.
  **Watch out for:** Stale reads and write conflicts. Two agents editing the same section simultaneously creates chaos.


Python — Blackboard: agents read/write to shared state

```
# The blackboard is shared state that all agents can read and write
# In production, this would be a database (Supabase, Redis, etc.)
blackboard = {
    "task": "Write a blog post about AI agents",
    "status": "planning",
    "sections": {},       # agents write their contributions here
    "feedback": [],       # review comments from other agents
}

def research_agent(board: dict) -> dict:
    # Read the task from the blackboard
    topic = board["task"]
    # Do research, then write findings BACK to the blackboard
    board["sections"]["research"] = run_agent("researcher", RESEARCH_PROMPT, topic)
    board["status"] = "research_complete"
    return board

def writer_agent(board: dict) -> dict:
    # Read research from the blackboard (written by research agent)
    research = board["sections"]["research"]
    # Write the draft, add it to the blackboard
    board["sections"]["draft"] = run_agent("writer", WRITER_PROMPT, research)
    board["status"] = "draft_complete"
    return board

def editor_agent(board: dict) -> dict:
    # Read BOTH research and draft — full context from the blackboard
    context = f"Research: {board['sections']['research']}\nDraft: {board['sections']['draft']}"
    board["feedback"].append(run_agent("editor", EDITOR_PROMPT, context))
    board["status"] = "review_complete"
    return board

# Orchestrate: each agent reads/writes the same blackboard
blackboard = research_agent(blackboard)   # writes research
blackboard = writer_agent(blackboard)     # reads research, writes draft
blackboard = editor_agent(blackboard)     # reads both, writes feedback
```


  **Blackboard vs. Direct Messaging:**
   In direct messaging, the editor only sees the draft. With a blackboard, the editor sees the original research AND the draft — full context for a better review. The tradeoff is that the blackboard grows with every contribution, using more tokens.


  Real Example
  ## Structured Message Contracts


Python — Typed message contract with dataclass

```
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

@dataclass
class AgentMessage:
    # Who sent it and who should receive it
    sender: str                # "research-agent"
    recipient: str             # "analysis-agent"
    message_type: str          # "research_complete"

    # The actual data being passed
    payload: dict[str, Any]    # {"topic": "...", "findings": [...]}

    # Metadata for debugging and tracing
    confidence: float = 0.0    # How reliable is this data? (0-1)
    tokens_used: int = 0      # Cost tracking
    timestamp: str = field(    # When was this created?
        default_factory=lambda: datetime.now().isoformat()
    )

# Usage: research agent sends findings to analysis agent
msg = AgentMessage(
    sender="research-agent",
    recipient="analysis-agent",
    message_type="research_complete",
    payload={
        "topic": "competitor pricing Q4",
        "findings": ["Competitor A: $29/mo", "Competitor B: $49/mo"],
        "sources_checked": 12,
    },
    confidence=0.87,           # High confidence — 12 sources verified
    tokens_used=4200,
)
# Structured, typed, traceable. The receiving agent knows
# exactly what it got, who sent it, and how reliable it is.
```


  Try It Yourself
  ## Design a Message Contract


    Take your agent team from Lesson 2. Define the message format for each handoff. What fields does the receiving agent need? What metadata helps with debugging?

      `Handoff: [Agent A] → [Agent B]
Message type: [name]
Required fields: [list them]
Optional fields: [list them]
Format: JSON / structured text / markdown`




  Practice
  ## Communication pattern strengths and risks.


  Common Pitfalls
  ## Three Ways Agent Communication Breaks




      **1. The Free-Form Trap**
      Agent A returns a paragraph. Agent B tries to parse it as JSON. The system crashes — or worse, silently produces garbage. **Fix:** Always force structured output with explicit instructions in the system prompt: "Return ONLY valid JSON with these exact keys."


      **2. Lost Context at Scale**
      In direct messaging, each agent only sees the previous agent's output. By agent #5 in a chain, the original intent is lost — like a game of telephone. **Fix:** Pass the original request alongside each handoff, or use a blackboard so every agent has full context.


      **3. No Error Propagation**
      Agent A fails silently and returns empty data. Agent B processes the empty data without checking. Agent C presents garbage to the user. **Fix:** Include a `status` field in every message — "success", "partial", or "failed" — and teach downstream agents to check it first.




  Key Takeaway
  ## Good Communication Is the Whole Game

  Multi-agent systems fail at the seams — the handoff points between agents. Invest heavily in communication contracts. Define message formats explicitly. Include metadata for debugging. When your agents communicate cleanly, the whole system becomes predictable, debuggable, and reliable.
  The code you've seen in this lesson — direct messaging, broadcast, and blackboard — are the three building blocks. Every multi-agent system you build will use one or a combination of these patterns. Master them and you've mastered the hardest part of agent orchestration.


  Review
  ## Key concepts.


### Communication Patterns

**Card 1:**
Front: Direct Messaging
Back: Agent A sends output directly to Agent B. Like a relay baton. Best for sequential workflows and simple handoffs. Watch for format mismatches.

**Card 2:**
Front: Broadcast (Pub/Sub)
Back: One agent publishes, multiple agents receive and decide whether to act. Best for parallel processing. Watch for race conditions and duplicate work.

**Card 3:**
Front: Blackboard (Shared Space)
Back: All agents read from and write to a shared workspace. Best for complex problems needing full context. Watch for stale reads and write conflicts.

**Card 4:**
Front: Communication Contracts
Back: Agreed-upon formats, protocols, and expectations for how information flows. Structured messages with from, to, type, payload, and metadata fields.

**Card 5:**
Front: Why Systems Fail at the Seams
Back: Format mismatches and lost context at handoff points cause cascading failures. Invest heavily in defining message formats explicitly between agents.


  Check Your Understanding
  ## Communication patterns quiz.





  [← Previous: Agent Roles & Specialization](/academy/multi-agent-orchestration/02-agent-roles-and-specialization/)
  [Next: Orchestration Architectures →](/academy/multi-agent-orchestration/04-orchestration-architectures/)
