# Orchestration Patterns

**Course:** The Automation Lab
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 5 of 10


  # Orchestration Patterns

  A single agent can do a lot. But real systems need multiple agents working together. There are exactly four patterns for coordinating them — and choosing the wrong one is the most common multi-agent architecture mistake. This lesson teaches all four, when to use each, and when each one fails.



    ## Why Orchestration Matters

    Once you have more than one agent, you need a coordination strategy. Without one, agents step on each other, duplicate work, or sit idle waiting for input that never comes. The four orchestration patterns below cover every multi-agent scenario. Most real systems use a combination.



    ## The Four Patterns

    Here are the four patterns at a glance:



        ** Pipeline**
        A → B → C. Sequential. Each agent's output becomes the next agent's input.


        ** Fan-Out**
        A → B, C, D. Parallel. One agent triggers many simultaneously.


        ** Supervisor**
        S monitors A, B, C. Overseer watches workers and intervenes when needed.


        ** Swarm**
        All agents coordinate peer-to-peer. No hierarchy. Emergent behavior.





    ## Deep Dive: Each Pattern




        **Pipeline: A → B → C**
        Each agent's output is the next agent's input. Like an assembly line — step 1 must finish before step 2 starts. Use when tasks have strict dependencies.
        **Real example:** Content pipeline — Writer drafts → Editor reviews → Publisher deploys. Each step transforms the previous step's output.
        **Failure mode:** If any step blocks, the entire pipeline stalls. A slow Editor means nothing gets published. Solution: add timeouts and fallback paths.



        **Fan-Out: A → B, C, D (parallel)**
        One event triggers multiple independent agents simultaneously. The key word is *independent* — if Agent B needs Agent C's result, this is not fan-out.
        **Real example:** New blog post published → simultaneously: post to Twitter, send email newsletter, update RSS feed, notify Slack. Each action is independent.
        **Failure mode:** When downstream results need to be merged or ordered. Fan-out is fire-and-forget. If you need to collect all results and combine them, use fan-out/fan-in (add a collector agent).



        **Supervisor: S watches A, B, C**
        A dedicated overseer agent monitors workers and intervenes when they fail — restarting, reassigning, or escalating. The supervisor does not do the work; it manages those who do.
        **Real example:** Five web scrapers run in parallel, each scraping different sites. A supervisor watches their health. When one crashes on a CAPTCHA, the supervisor retries with a different strategy or reassigns the URL to another scraper.
        **Failure mode:** Single point of failure — if the supervisor itself crashes, nobody is watching the workers. Solution: make the supervisor stateless and restartable, or use a supervisor-of-supervisors.



        **Swarm: Peer-to-peer, no hierarchy**
        All agents are equal. No central controller. Agents coordinate through shared state, passing tasks to whichever agent is available. Behavior emerges from their interactions. This is the most complex pattern — and the most resilient.
        **Real example:** OpenAI's Swarm framework. A customer service system where any agent can handle any ticket. If the user's question shifts from billing to technical, the current agent hands off to a more specialized agent seamlessly.
        **Failure mode:** Harder to debug and predict. Without a central coordinator, it is difficult to trace why a specific decision was made. Requires robust logging and clear agent boundaries.





    ## Choosing the Right Pattern

    Use this decision framework:

      **Do tasks depend on each other?**

        Yes → **Pipeline**

        No → Are they triggered by the same event?

          Yes → **Fan-Out**

          No → Do agents need a central manager?

            Yes → **Supervisor**

            No → **Swarm**

    Most production systems combine patterns. A supervisor might manage a pipeline of fan-out workers. The patterns are building blocks, not mutually exclusive.



    ## Implementation Considerations

    Each pattern has different requirements for error handling and state management:



        **State Management**
        Pipelines need shared state between steps — the output of step N must be accessible to step N+1. Fan-out systems need independent state per worker. Supervisors need a global view of all worker states. Swarms need distributed state that any agent can read and write.


        **Error Propagation**
        In a pipeline, errors must propagate forward — downstream steps need to know that upstream failed. In fan-out, errors are isolated — one worker failing should not affect others. In supervisor patterns, errors propagate upward to the supervisor for centralized handling.





    ## Hybrid Patterns in Production

    Real systems rarely use a single pattern. Here are three common hybrids you will encounter in production:



        **Pipeline + Fan-Out**
        Step 1 processes data sequentially (validate → transform), then the final step fans out to multiple independent consumers (store in DB, send notification, update dashboard). The sequential part ensures data integrity. The parallel part maximizes throughput.


        **Supervisor + Pipeline Workers**
        A supervisor manages multiple pipeline workers, each running the same sequence (scrape → parse → store) on different data sources. The supervisor handles load balancing, failure recovery, and progress tracking. This is the workhorse pattern for data ingestion at scale.


        **Fan-Out / Fan-In (Map-Reduce)**
        One agent splits work into N parallel chunks (fan-out). Each chunk is processed independently by a worker agent. A collector agent waits for all results and merges them (fan-in). This is the map-reduce pattern — used by Google, Hadoop, and every large-scale data processing system.





    ## Orchestration Anti-Patterns

    Avoid these common mistakes when designing multi-agent orchestration:


      **God Agent:** One agent that does everything — routing, processing, monitoring, and error handling. It becomes a bottleneck and single point of failure. Split responsibilities into specialized agents.


      **Circular Dependencies:** Agent A waits for Agent B, which waits for Agent C, which waits for Agent A. The system deadlocks. Always design acyclic workflows or add timeout-based circuit breakers.


      **Over-Orchestration:** Using a supervisor pattern when a simple pipeline would suffice. More coordination means more complexity, more failure modes, and more latency. Start simple. Add orchestration only when the simpler pattern breaks.


      **No Timeout:** A pipeline step that blocks forever because nobody defined a maximum wait time. Every inter-agent communication should have a timeout. When it expires, the system must have a fallback — skip, retry, or escalate.




    ## Scaling Orchestration

    As your agent fleet grows, orchestration must scale with it. Key principles:



        **Horizontal Scaling**
        Add more worker agents of the same type. Fan-out and supervisor patterns scale naturally — just add more workers. Pipeline patterns scale by running multiple pipeline instances in parallel.


        **Backpressure**
        When downstream agents cannot keep up, upstream agents must slow down. Without backpressure, queues grow unbounded and the system crashes. Use queue depth limits and rate limiting to prevent this.





### Quiz

**Q1: You need to process user uploads: validate, then resize, then store, then notify. What pattern?**
    A. Fan-Out
  ✓ B. Pipeline
    C. Supervisor
    D. Swarm
  *Sequential processing where each step depends on the previous — classic Pipeline pattern. Validate must finish before resize starts.*

**Q2: A new blog post needs to be shared on Twitter, LinkedIn, Email, and Slack simultaneously. What pattern?**
    A. Pipeline
    B. Supervisor
  ✓ C. Fan-Out
    D. Swarm
  *One trigger, multiple independent actions in parallel — Fan-Out pattern. Each channel is independent.*

**Q3: You have 5 unreliable scraping agents and need one to watch them all and restart failures. What pattern?**
    A. Fan-Out
    B. Swarm
    C. Pipeline
  ✓ D. Supervisor
  *A dedicated overseer monitoring workers and intervening on failure — Supervisor pattern.*

**Q4: What is the key characteristic of the Swarm pattern?**
    A. One master agent controls all workers
    B. Agents process tasks sequentially
  ✓ C. Agents coordinate peer-to-peer with no central hierarchy
    D. A scheduler triggers agents one by one
  *Swarms have no hierarchy — agents coordinate directly through shared state. Behavior emerges from their interactions.*

**Q5: A supervisor agent crashes. What happens to the workers?**
    A. They all stop immediately
  ✓ B. They keep running but nobody monitors or recovers failures
    C. They automatically elect a new supervisor
    D. Nothing — supervisors are optional
  *The supervisor is a single point of failure. Workers continue running, but if they fail, nobody restarts them. Solution: make the supervisor stateless and restartable.*



    ## Choosing a Pattern: Decision Matrix

    Use this matrix to choose the right pattern quickly. Match your situation to the row that best describes it:




          Situation
          Pattern
          Why


          Steps must run in order
          Pipeline
          Each step depends on the previous step's output


          One event, many independent actions
          Fan-Out
          Actions are independent and can run in parallel


          Unreliable workers need oversight
          Supervisor
          A manager agent handles failures and restarts


          Dynamic task routing, no fixed hierarchy
          Swarm
          Agents self-organize based on capabilities


          Sequential processing then parallel delivery
          Pipeline + Fan-Out
          Data integrity first, then throughput


          Many identical workers, needs reliability
          Supervisor + Pipeline
          Supervisor manages pipeline worker fleet






### The 4 Orchestration Patterns

**Card 1:**
Front: Pipeline Pattern
Back: A → B → C. Sequential. Each agent's output is the next agent's input. Use when steps have strict dependencies. Fails when one step blocks.

**Card 2:**
Front: Fan-Out Pattern
Back: A → B, C, D simultaneously. Parallel independent actions. Use when one event triggers multiple independent tasks. Fails when results need merging.

**Card 3:**
Front: Supervisor Pattern
Back: A supervisor watches workers and intervenes on failure. Use when reliability is critical. Single point of failure if supervisor crashes.

**Card 4:**
Front: Swarm Pattern
Back: Peer-to-peer, no hierarchy. Agents coordinate through shared state. Most resilient but hardest to debug. Used by OpenAI Swarm framework.

**Card 5:**
Front: When does Pipeline fail?
Back: When one step blocks — the whole pipeline stalls. Add timeouts and fallback paths.

**Card 6:**
Front: How to choose the right pattern?
Back: Tasks depend on each other? Pipeline. Same trigger, independent tasks? Fan-Out. Need a manager? Supervisor. Equal peers? Swarm. Most systems combine patterns.
