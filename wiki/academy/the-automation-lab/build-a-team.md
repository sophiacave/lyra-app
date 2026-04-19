# Build a Team

**Course:** The Automation Lab
**Order:** 7
**Type:** builder
**Access:** Premium

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 7 of 10


  # Build a Team

  A single agent hits its limits fast. Real systems need teams — agents with distinct roles that complement each other. This lesson teaches you how to compose agent teams, which roles are essential for common use cases, and what happens when you pick the wrong team.



    ## Why Teams, Not Solo Agents?

    A single agent with 30 tools, 10 goals, and 5 different responsibilities will underperform a team of 3 specialized agents every time. Why?



        **Focus**
        LLMs perform better with fewer tools and a clear role. A "content writer" agent with 5 writing tools will produce better output than a "do-everything" agent with 30 tools that happens to also write content.


        **Separation of concerns**
        The agent that writes content should not also be the one that publishes it. If the writer crashes, the publisher keeps working on queued content. Each agent can fail independently without bringing down the whole system.


        **Checks and balances**
        An editor agent reviewing a writer agent's output catches errors the writer would never catch on its own. An agent checking its own work is like a student grading their own exam — a separate reviewer is always better.





    ## The Eight Core Roles

    Most agent teams draw from these eight archetypes. Not every team needs all eight — the art is choosing the right subset for your use case:



        ** Writer**
        Creates content — blog posts, emails, reports, social copy. The producer.


        ** Editor**
        Reviews, fact-checks, and improves. Quality gate that prevents errors from reaching production.


        ** Publisher**
        Deploys content to websites and platforms. Without it, content sits in drafts forever.


        ** Monitor**
        Watches systems for errors. The first to know when something breaks. Essential for reliability.


        ** Guardian**
        Enforces rules, checks compliance, validates actions. The safety net for the whole system.


        ** Notifier**
        Sends alerts via email, Slack, or SMS. Keeps humans in the loop when agents act.


        ** Scheduler**
        Manages timing, cron jobs, and queues. Ensures tasks run at the right time in the right order.


        ** Analyst**
        Analyzes metrics and generates insights. Turns raw data into actionable intelligence.





    ## Team Recipes

    Three proven team compositions for common use cases:



        **Content Pipeline:** Writer → Editor → Publisher + Notifier

        Writer creates, Editor quality-gates, Publisher deploys, Notifier confirms. Pipeline orchestration (Lesson 5).


        **Self-Healing Infra:** Monitor + Guardian + Notifier + Scheduler

        Monitor detects problems. Guardian validates fix actions. Scheduler handles timing. Notifier alerts humans. Supervisor orchestration.


        **Data Pipeline:** Analyst + Monitor + Notifier + Scheduler

        Scheduler triggers on cron. Analyst processes data. Monitor watches health. Notifier reports results. Pipeline + supervisor hybrid.





    ## Scaling Teams: When to Add Agents

    Adding agents to a team is not always the answer. Here is when adding a new agent is the right call — and when it is not:



        **Add an agent when...**
        An existing agent has too many tools (15+). A new responsibility has different failure modes. You need independent scaling for a specific task. Two roles should never share state or permissions.


        **Do NOT add an agent when...**
        A simple function call would suffice. The "agent" would only have one tool. Adding it creates unnecessary coordination overhead. The existing agent handles the task fine — you are just over-engineering.





    ## Communication Between Team Members

    Team agents communicate through shared memory (Lesson 4), but the *protocol* matters. Here are three patterns for team communication:



        **Task Queue**
        One agent creates tasks; others claim and execute them. Tasks sit in a shared queue (`task_queue` table) with fields for status, assignee, and priority. Any available agent can claim the next unassigned task. This prevents work from piling up on a single agent.


        **Status Board**
        Each agent writes its current status to a shared key: `agent.writer.status = "drafting blog post"`, `agent.editor.status = "idle"`. Other agents can check who is busy and who is available before assigning work. Like a team standup, but automated.


        **Event Stream**
        Agents emit events: `"draft_complete"`, `"review_passed"`, `"deploy_failed"`. Other agents subscribe to events they care about. This is the most decoupled pattern — agents do not need to know about each other, only about events.





    ## Failure Modes in Agent Teams

    Teams fail differently from solo agents. Three failure modes unique to multi-agent systems:


      **Cascade failure:** Agent A crashes, which means Agent B never gets its input, so Agent B sits idle, and Agent C (which depends on B) also stalls. One failure cascades through the entire team. Fix: timeouts and fallback paths at every handoff point.


      **Silent duplication:** Two agents both claim the same task from the queue because the claim operation is not atomic. Both do the work. The user gets two emails, two reports, two deploys. Fix: use database-level locking on task claims (`SELECT ... FOR UPDATE SKIP LOCKED`).


      **Role confusion:** An agent's identity is too similar to another agent's. Both try to handle the same type of request, producing conflicting outputs. Fix: make each agent's scope explicit and non-overlapping. If in doubt, add a router agent that directs requests to the right specialist.




    ## The Minimum Viable Team

    For any project, start with the smallest team that covers your critical path. The minimum viable team for most autonomous systems is three agents:


      **1. Worker** — Does the actual task (writing, processing, scraping, deploying).

      **2. Reviewer** — Checks the worker's output before it goes live. Quality gate.

      **3. Monitor** — Watches both the worker and reviewer for health. Restarts failures.


      This three-agent team covers production, quality, and reliability. Add more agents only when you have a specific need that these three cannot handle.




### Quiz

**Q1: You are building a content pipeline. Which three agents are essential?**
    A. Writer, Scheduler, Monitor
  ✓ B. Writer, Editor, Publisher
    C. Analyst, Notifier, Guardian
    D. Scheduler, Monitor, Guardian
  *A content pipeline needs: Writer (creates content), Editor (quality control), Publisher (deploys it). Without any one of these, the pipeline has a gap.*

**Q2: You are building a self-healing server monitor. Which agent enforces safety rules before allowing restarts?**
    A. Notifier
    B. Monitor
    C. Scheduler
  ✓ D. Guardian
  *The Guardian agent checks compliance rules before allowing potentially dangerous actions like server restarts.*

**Q3: Your analytics pipeline runs on a schedule but nobody knows when it breaks. Which missing agent fixes this?**
    A. Writer
    B. Editor
  ✓ C. Monitor
    D. Publisher
  *A Monitor agent watches the pipeline health. Without it, failures go undetected until someone notices the missing report.*

**Q4: Why is a team of 3 specialized agents better than 1 agent with 30 tools?**
    A. It uses less memory
  ✓ B. Specialized agents focus better, fail independently, and check each other's work
    C. More agents always means better results
    D. It is easier to debug
  *Focus (fewer tools = better decisions), separation of concerns (independent failure), and checks and balances (agents reviewing each other) all improve with specialization.*

**Q5: An agent team has a Writer and Publisher but no Editor. What is the risk?**
    A. No risk — the Writer checks its own work
  ✓ B. Content with errors reaches production unchecked
    C. The Publisher will refuse to deploy
    D. The team will deadlock
  *Without an Editor, there is no quality gate. The Writer checking its own work is unreliable — a separate reviewer catches errors the creator misses.*



    ## Testing Agent Teams

    Team testing is different from solo agent testing. You need to verify both individual agents and their interactions:



        **Unit Test Each Agent**
        Test each agent in isolation with mock inputs. Does the Writer produce well-formatted content? Does the Editor catch errors? Does the Publisher deploy correctly? Each agent must work alone before it works in a team.


        **Integration Test the Handoffs**
        Test the connections between agents. When the Writer writes to `task.draft`, does the Editor pick it up? When the Editor approves, does the Publisher receive the approved version? Handoff failures are the most common team bugs.


        **Chaos Test the Failures**
        Deliberately crash one agent and verify the team recovers. Kill the Editor mid-review. Does the system retry? Does the Monitor detect it? Does the Notifier alert? If any of these fail, your team is not production-ready.





    ## Team Evolution Over Time

    Agent teams are not static. They evolve as your needs change. A healthy evolution follows this pattern:



        **Phase 1: Solo Agent**
        Start with one agent that does everything. This is fine for learning and prototyping. You will quickly discover which tasks it handles well and which ones suffer from being bundled together.


        **Phase 2: Split by Failure Mode**
        The first split should happen when you realize one part of the agent is failing while the rest works fine. If the writing is great but publishing keeps breaking, split into Writer and Publisher. Separate what fails independently.


        **Phase 3: Add Quality Control**
        Once you have producers and deployers, add a quality gate — an Editor or Guardian agent that reviews output before it reaches production. This is the phase where output quality jumps dramatically.


        **Phase 4: Add Observability**
        Finally, add a Monitor agent that watches the whole team. This is when the system becomes self-healing — failures are detected and corrected without human intervention.





### Agent Roles

**Card 1:**
Front: Content Writer agent
Back: Generates blog posts, emails, and social copy. Essential for any content pipeline. Keep its tools focused on writing — not publishing.

**Card 2:**
Front: Editor agent
Back: Reviews, fact-checks, and improves content. The quality gate. An agent checking its own work is unreliable — always use a separate editor.

**Card 3:**
Front: Publisher agent
Back: Deploys content to websites and platforms. Without it, content sits in drafts forever. Connects to CMS, social APIs, email services.

**Card 4:**
Front: Monitor agent
Back: Watches systems for errors and anomalies. First to know when something breaks. Essential for any production system.

**Card 5:**
Front: Guardian agent
Back: Enforces rules, checks compliance, validates actions. Safety net for the whole system. Guardrails with teeth.

**Card 6:**
Front: Why teams over solo agents?
Back: Focus (fewer tools = better decisions), separation of concerns (independent failure), checks and balances (agents reviewing each other). Three specialists beat one generalist.
