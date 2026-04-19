# Agent Communication

**Course:** The Automation Lab
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 4 of 10


  # Agent Communication

  Agents do not talk to each other directly. They write to shared memory, and other agents read it. This decoupled pattern — borrowed from message queue architecture — is what makes multi-agent systems resilient. If one agent crashes, the others keep running.



    ## Why Not Direct Calls?

    The simplest way to connect two agents would be to have Agent A call Agent B directly — like one function calling another. This creates **tight coupling**: if Agent B is down, Agent A crashes. If Agent B changes its interface, Agent A breaks. If you add Agent C, you need to rewire everything.

    Instead, agents communicate through **shared memory** — a database table both can access. Agent A writes its output to a key. Agent B watches that key. They never need to know about each other's existence. This is the same pattern used by Apache Kafka, RabbitMQ, and Redis pub/sub in production systems worldwide.



        **Direct Coupling (fragile)**
        Agent A calls Agent B's API. If B is down, A fails. If B changes, A breaks. Adding Agent C requires modifying A. N agents = N&sup2; connections.


        **Shared Memory (resilient)**
        Agent A writes to a key. Agent B reads the key. They are fully independent. If B is down, A still writes successfully. Adding Agent C requires zero changes to A or B.





    ## Message Passing in Practice

    In a typical shared memory setup, Agent A (a content writer) writes its output to a key in the `consciousness_stream` table. Agent B (a publisher) watches that key and acts when new data appears. The two agents never communicate directly — they only share a key name.



    ## How It Works in Code

    The pattern is simple: a sender writes to a key, a receiver polls or subscribes to that key. Here is a complete example:



```
# Sender agent writes its output to shared memory
def writer_agent(db, content):
    db.execute(
        "INSERT INTO consciousness_stream (key, value, agent) "
        "VALUES ('task.output', %s, 'writer')",
        [json.dumps({"title": content.title, "body": content.body})]
    )

# Receiver agent watches for new entries
def publisher_agent(db):
    while True:
        new = db.execute(
            "SELECT * FROM consciousness_stream "
            "WHERE key = 'task.output' AND processed = false "
            "ORDER BY created_at LIMIT 1"
        )
        if new:
            publish_to_website(new.value)
            db.execute(
                "UPDATE consciousness_stream SET processed = true "
                "WHERE id = %s", [new.id]
            )
        time.sleep(5)  # poll every 5 seconds
```


    The writer does not know or care if anyone reads its output. The publisher does not know or care who wrote the content. They only share a key name: `task.output`.



    ## Polling vs. Real-Time

    The code above uses **polling** — checking for new messages every 5 seconds. This is simple but introduces latency. There are faster alternatives:



        **Polling (simple, some latency)**
        Agent checks the database on a timer. Easy to implement. Latency = poll interval. Fine for most use cases. Used by cron-based agents.


        **Database triggers / Supabase Realtime (instant)**
        Supabase can push changes to subscribers via WebSockets the moment a row is inserted. Zero latency. The receiver is notified instantly — no polling required.


        **Webhooks (push-based)**
        When Agent A writes, a database trigger fires an HTTP request to Agent B's endpoint. B wakes up and processes immediately. Used in production event-driven systems.





    **The consciousness_stream** is a shared table where agents post messages. Think of it like a team Slack channel — but for AI agents. Every agent can read from it, and any agent can write to it. No direct connections needed.



    ## When Communication Fails

    Shared memory communication is resilient, but not bulletproof. Common failure modes:


      **Lost messages:** If the database is down when Agent A writes, the message is lost. Solution: retry with exponential backoff, or use a write-ahead log.


      **Stale reads:** Agent B reads an old value because Agent A has not written yet. Solution: include timestamps and have Agent B check freshness.


      **Race conditions:** Two agents write to the same key simultaneously. The second write overwrites the first. This is the conflict problem covered in Lesson 6.




    ## Message Schemas and Contracts

    When agents communicate through shared memory, they need to agree on a message format. Without a schema, Agent B cannot reliably parse what Agent A wrote. Here is a practical message schema:



```
# Standard message schema for agent communication
message = {
    "key": "task.content_review",       # namespaced key
    "sender": "writer-agent",           # who wrote this
    "timestamp": "2026-04-01T14:30:00Z", # when
    "status": "pending",               # pending / in_progress / done
    "payload": {                        # the actual data
        "title": "Weekly Update",
        "body": "...",
        "priority": 2
    },
    "ttl": 3600                        # expires after 1 hour
}
```


    A consistent schema means any agent can read any message. The `ttl` (time-to-live) field prevents stale messages from clogging the stream. The `status` field lets downstream agents know whether the task is still pending or already claimed.



    ## Fan-Out Communication

    Sometimes one agent's output needs to reach multiple downstream agents. This is the fan-out pattern applied to communication:



        **Single Key, Multiple Readers**
        Agent A writes to `task.new_post`. Agent B (Twitter publisher), Agent C (email sender), and Agent D (Slack notifier) all watch this key. When Agent A writes, all three activate independently. No coordination needed — each reads the same payload and does its own job.


        **Multiple Keys, Targeted Delivery**
        Agent A writes to `task.twitter`, `task.email`, and `task.slack` separately, each with a tailored payload. More work for the sender, but each receiver gets exactly the data it needs — no parsing required.


    The first approach is simpler and works when all receivers need the same data. The second is better when each downstream agent needs a different format or subset of the data.



    ## Acknowledgment and Delivery Guarantees

    In production systems, you need to know whether a message was received and processed. Three levels of delivery guarantee:



        **At-most-once (fire and forget)**
        Agent A writes the message and moves on. If Agent B never reads it, the message is lost. Simple but unreliable. Fine for non-critical notifications.


        **At-least-once (with acknowledgment)**
        Agent B marks the message as `processed = true` after handling it. If B crashes mid-processing, the message stays unprocessed and gets retried. May process the same message twice — actions must be idempotent.


        **Exactly-once (transactional)**
        Uses database transactions to ensure the message is processed exactly one time. The read, process, and acknowledgment happen atomically. Most reliable but most complex. Use for financial transactions and critical state changes.





### Quiz

**Q1: How do agents communicate in a decoupled architecture?**
    A. Direct API calls between agents
  ✓ B. Shared memory — one writes, others read
    C. Email-style message queues
    D. Real-time WebSocket only
  *Agents communicate through shared memory (consciousness_stream). No direct connections needed — agents write and read from the same store independently.*

**Q2: What is the consciousness_stream?**
    A. A real-time audio feed
  ✓ B. A shared database table agents post messages to
    C. A private log only one agent can read
    D. A cron job scheduler
  *The consciousness_stream is a shared table — like a team Slack channel for AI agents. Any agent can read from it or write to it.*

**Q3: Agent A finishes writing a blog post and sets task.output in shared memory. What should Agent B (the publisher) do?**
    A. Wait for Agent A to call it directly
  ✓ B. Poll task.output and act when a new entry appears
    C. Ask a human to relay the message
    D. Create a new memory table
  *Agent B watches for new entries on its key (task.output). When Agent A writes there, Agent B reads the payload and executes its action.*

**Q4: Why is direct coupling between agents fragile?**
    A. It is slower
  ✓ B. If one agent fails, all agents that depend on it also fail
    C. It uses more memory
    D. It requires more code
  *Direct coupling means Agent A directly calls Agent B. If B goes down, A crashes too. Shared memory decouples them — A writes regardless of B's status.*

**Q5: What is the fastest way for Agent B to learn that Agent A has written new data?**
    A. Polling every second
  ✓ B. Supabase Realtime / database trigger that pushes notifications instantly
    C. Reading the full table every minute
    D. Asking a supervisor agent
  *Database triggers and Supabase Realtime push changes via WebSockets the moment a row is inserted — zero latency, no polling required.*



    ## Namespacing and Key Design

    As your agent fleet grows, message keys can collide. Two agents both writing to `task.output` creates chaos. Namespacing solves this:



```
# Good: namespaced keys prevent collisions
"pipeline.content.draft"        # writer → editor
"pipeline.content.reviewed"     # editor → publisher
"pipeline.content.published"    # publisher → notifier
"monitor.health.site"           # health check results
"monitor.health.brain"          # database health
"agent.writer.status"           # agent status board

# Bad: flat keys collide and confuse
"output"    # whose output? which pipeline?
"status"    # which agent's status?
"result"    # result of what?
```


    Use a three-level namespace: `domain.subsystem.key`. This scales to hundreds of agents without confusion. Agents can watch entire domains (`monitor.*`) or specific keys (`pipeline.content.draft`).



    ## Backpressure and Flow Control

    When a producer agent writes faster than a consumer agent can process, messages pile up. This is the **backpressure** problem. Without flow control, the queue grows until memory runs out or processing latency becomes unacceptable.



        **Without Backpressure**
        Producer writes 100 messages/minute. Consumer processes 10/minute. After an hour: 5,400 unprocessed messages. System becomes unusable.


        **With Backpressure**
        Queue has a max depth of 50. When full, the producer waits or drops lowest-priority messages. System stays healthy. Latency stays bounded.





### Communication Patterns

**Card 1:**
Front: Why don't agents call each other directly?
Back: Direct connections create tight coupling. If Agent A fails, Agent B breaks too. Shared memory decouples them — they operate independently and communicate asynchronously.

**Card 2:**
Front: What is a message key?
Back: A named slot in shared memory (e.g., task.output). The sender writes to it; the receiver watches for new entries on that key.

**Card 3:**
Front: What happens if two agents write to the same key at the same time?
Back: A race condition — the second write overwrites the first. Solved with locking, priority queues, or a conscience layer (Lesson 6).

**Card 4:**
Front: Polling vs event-driven reading
Back: Polling: check the key on a timer (simple, has latency). Event-driven: get notified instantly via WebSocket or trigger (faster, more complex).

**Card 5:**
Front: What is Supabase Realtime?
Back: A feature that pushes database changes to subscribers via WebSockets in real time. Agents get notified the moment a new row is inserted — no polling.

**Card 6:**
Front: What happens if the database is down when an agent writes?
Back: The message is lost. Solution: retry with exponential backoff, or buffer writes locally with a write-ahead log.
