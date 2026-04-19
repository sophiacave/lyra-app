# Conflict Resolution

**Course:** Multi-Agent Orchestration
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[Multi-Agent Orchestration](/academy/multi-agent-orchestration/)
  Lesson 6 of 10


  # Conflict Resolution

  When agents disagree or produce conflicting outputs — and how to turn conflict into quality.


  ### What You'll Learn


    - Why agent conflicts are inevitable and often useful

    - Four strategies for resolving conflicting agent outputs

    - How to design productive disagreement into your system

    - When conflict signals a deeper design problem




  The Reality
  ## Agents Will Disagree — That's a Feature

  Give two agents the same data and different system prompts, and they'll reach different conclusions. Your research agent says the market is growing. Your risk agent says the data is unreliable. Your writer produces a confident draft. Your editor says it needs a complete rewrite.
  This isn't a bug. In fact, if your agents always agree, that's a sign they're not specialized enough. Conflict is the system checking its own work. The key is having a strategy to resolve it.


  Strategy 1
  ## Hierarchical Override

  One agent has final authority. When agents conflict, the designated authority makes the call. Simple and fast. The orchestrator agent is the natural choice — it has the broadest context and the mandate to make decisions.
  **Best for:** Time-sensitive systems, clear chain of command, when one agent genuinely has better judgment for the decision.
  **Risk:** The authority agent might consistently override valuable dissent. Important signals get silenced.


  Strategy 2
  ## Voting and Consensus

  Multiple agents weigh in, and the majority wins. You can run three instances of the same agent with different temperatures, or have three different specialist agents evaluate the same question. If two out of three agree, that's the answer.
  **Best for:** High-stakes decisions where accuracy matters more than speed. Fact-checking, classification, risk assessment.
  **Risk:** Expensive — you're running multiple agents for one decision. Majority isn't always right.


  Strategy 3
  ## Debate and Synthesis

  Conflicting agents present their positions to a synthesis agent. The synthesizer doesn't just pick a winner — it integrates the best elements of each position into a stronger output. This mirrors how real teams work: debate produces better ideas than any individual contribution.
  **Best for:** Creative work, strategy, any domain where combining perspectives adds value.
  **Risk:** The synthesizer might produce wishy-washy compromises instead of sharp decisions.


  Strategy 4
  ## Confidence-Weighted Resolution

  Each agent reports a confidence score alongside its output. When agents conflict, the higher-confidence agent wins. This lets agents self-assess: "I'm 92% confident in this analysis" vs. "I'm 60% confident — the data was ambiguous."
  **Best for:** Data-driven systems where confidence is measurable. Search, classification, prediction.
  **Risk:** LLMs are notoriously bad at calibrating confidence. An agent might report 95% confidence on a hallucination.


  Types
  ## Three Types of Agent Conflict

  Not all conflicts are the same. Understanding the type of conflict helps you choose the right resolution strategy. Each type has different causes, different signals, and different solutions.

  **Resource Conflicts** — Two or more agents need the same limited resource at the same time. This might be a shared database connection, an API with rate limits, a file that only one process can write to, or a context window that both agents want to fill with their data. Resource conflicts are mechanical, not intellectual — the agents don't disagree on substance, they're just competing for access.
  *Signal:* Timeouts, lock errors, rate limit exceptions, corrupted shared state. *Fix:* Queue management, resource locks, turn-taking protocols.

  **Opinion Conflicts** — Two agents analyze the same data and reach different conclusions. Your sentiment agent says the customer is frustrated. Your topic agent says the message is a routine inquiry. Your writer produces an assertive draft. Your editor says the tone is too aggressive. These are the productive conflicts — they surface genuine ambiguity in the data.
  *Signal:* Contradictory outputs from different agents given the same input. *Fix:* Debate and synthesis, voting, or confidence-weighted resolution.

  **Priority Conflicts** — Agents agree on the facts but disagree on what matters most. Security says block the deployment because of a vulnerability. Product says ship it because the feature is promised to a customer today. Both are right about the facts — they disagree about priorities. Priority conflicts cannot be resolved by better data. They require a decision framework that encodes your organization's values.
  *Signal:* Both agents produce valid outputs that recommend incompatible actions. *Fix:* Hierarchical override with clear priority rules, or escalation to a human decision-maker.


  Strategies
  ## Resolution Strategies: A Complete Toolkit

  Beyond the four core strategies covered above, here are additional resolution approaches and when to deploy each one.

  **Voting with Weighted Ballots** — Not all agents' opinions should carry equal weight. A security agent's vote on security matters should outweigh a formatting agent's vote. Assign domain-specific weights so that expertise is reflected in the resolution. Three agents vote, but the domain expert's vote counts double.

  **Authority Hierarchy** — Define a clear chain of command. When the security agent and the performance agent conflict, security always wins (or vice versa, depending on your system's values). The hierarchy is encoded in the orchestrator's decision logic, not left to ad-hoc judgment. This is fast and predictable, but inflexible — the hierarchy might be wrong for edge cases.

  **Structured Consensus** — Instead of simple majority vote, require agents to explain their reasoning. A consensus agent reviews all positions and their justifications, then produces a resolution that addresses each agent's core concerns. Slower than voting, but produces higher-quality decisions because it forces engagement with dissenting views.

  **Fallback to Human** — When automated resolution fails or the stakes are too high, escalate to a human decision-maker. The system presents both positions with supporting evidence and a recommendation. The human makes the call, and that decision is logged and fed back into the system to improve future automated resolution.

  **Time-Bounded Debate** — Give conflicting agents a fixed number of rounds to resolve their disagreement. Each round, both agents see the other's position and can update their own. If they converge, the conflict is resolved. If they don't converge within the limit, the orchestrator makes a forced decision. This prevents infinite debate loops while still allowing productive back-and-forth.


  Code Example
  ## Implementing Conflict Resolution

  Here is a practical implementation showing how to build a conflict resolution layer into an orchestrator agent.


Python — Conflict resolution with voting and escalation

```
class ConflictResolver:
    def __init__(self, strategy: str = "weighted_vote"):
        self.strategy = strategy
        self.conflict_log = []

    def detect_conflict(self, outputs: dict) -> bool:
        # Compare agent outputs — do they recommend different actions?
        actions = [o["recommendation"] for o in outputs.values()]
        return len(set(actions)) > 1  # conflict if not unanimous

    def resolve(self, outputs: dict, weights: dict) -> dict:
        if self.strategy == "weighted_vote":
            # Tally weighted votes for each recommendation
            scores = {}
            for agent, output in outputs.items():
                action = output["recommendation"]
                weight = weights.get(agent, 1.0)
                scores[action] = scores.get(action, 0) + weight
            winner = max(scores, key=scores.get)
            return {"resolution": winner, "method": "weighted_vote", "scores": scores}

        elif self.strategy == "authority":
            # Highest-authority agent wins
            authority_order = ["security", "compliance", "product", "style"]
            for agent in authority_order:
                if agent in outputs:
                    return {"resolution": outputs[agent]["recommendation"],
                            "method": "authority", "decided_by": agent}

        elif self.strategy == "escalate":
            # Log the conflict and ask a human
            self.conflict_log.append({
                "outputs": outputs,
                "timestamp": now(),
                "status": "awaiting_human"
            })
            return {"resolution": "pending", "method": "human_escalation"}

# Usage: security and performance agents disagree on a deployment
resolver = ConflictResolver(strategy="weighted_vote")
outputs = {
    "security": {"recommendation": "block", "reason": "SQL injection risk"},
    "performance": {"recommendation": "approve", "reason": "3x speed improvement"},
    "style": {"recommendation": "approve", "reason": "clean code"}
}
weights = {"security": 3.0, "performance": 1.5, "style": 1.0}
result = resolver.resolve(outputs, weights)
# → {"resolution": "block", "method": "weighted_vote", "scores": {"block": 3.0, "approve": 2.5}}
# Security wins because its weight (3.0) outweighs combined approve votes (2.5)
```


  Real Example
  ## Productive Conflict in Practice




      Code Review Debate
      `Security Agent: "This SQL query is vulnerable to injection. Block the PR."
Performance Agent: "This query is already 3x faster than the previous version. Approve."

Synthesis Agent: "The performance improvement is real, but the security risk is critical. Resolution: keep the optimized query structure but add parameterized inputs. Both goals met."`
      Neither agent was wrong. The conflict surfaced a solution better than either alone would produce.




  Try It Yourself
  ## Design a Conflict Protocol


    Identify two agents in your system that might conflict. Define the resolution strategy, including: who resolves it, how disagreements are surfaced, and what happens if resolution fails.

      `Potential conflict: [Agent A] says X, [Agent B] says Y
Resolution strategy: [hierarchy / voting / debate / confidence]
Resolver: [which agent or process decides]
Fallback: [what happens if resolution fails]
Logging: [how is the conflict recorded for future improvement]`




  Practice
  ## Conflict resolution strategies.


  Key Takeaway
  ## Design for Disagreement

  Don't try to eliminate agent conflicts — engineer them. Build systems where agents are expected to challenge each other. The quality of your conflict resolution strategy determines whether disagreements produce better outputs or system failures. Log every conflict and its resolution. Over time, patterns emerge that tell you exactly where your system needs tuning.


  Review
  ## Key concepts.


### Conflict Resolution Strategies

**Card 1:**
Front: Hierarchical Override
Back: One agent has final authority. Fast and simple. Risk: the authority agent might consistently silence valuable dissent from specialists.

**Card 2:**
Front: Voting and Consensus
Back: Multiple agents weigh in, majority wins. Best for high-stakes accuracy. Risk: expensive, and the majority is not always right.

**Card 3:**
Front: Debate and Synthesis
Back: Conflicting agents present positions to a synthesizer that integrates the best elements. Risk: wishy-washy compromises instead of sharp decisions.

**Card 4:**
Front: Confidence-Weighted Resolution
Back: Higher-confidence agent wins. Best for data-driven tasks. Risk: LLMs are notoriously bad at calibrating confidence — 95% on a hallucination.

**Card 5:**
Front: Why Conflict Is a Feature
Back: If your agents always agree, they are not specialized enough. Conflict is the system checking its own work — it surfaces errors and produces better outputs.


  Check Your Understanding
  ## Conflict resolution quiz.





  [← Previous: Shared Memory & State](/academy/multi-agent-orchestration/05-shared-memory-and-state/)
  [Next: Scaling Agent Systems →](/academy/multi-agent-orchestration/07-scaling-agent-systems/)
