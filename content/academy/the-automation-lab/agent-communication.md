---
title: "Agent Communication"
course: "the-automation-lab"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-automation-lab/">The Automation Lab</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Agent Communication</h1>
  <p class="sub">Agents do not talk to each other directly. They write to shared memory, and other agents read it. This decoupled pattern — borrowed from message queue architecture — is what makes multi-agent systems resilient. If one agent crashes, the others keep running.</p>
</div>

  <div class="section">
    <h2>Why Not Direct Calls?</h2>
    <p>The simplest way to connect two agents would be to have Agent A call Agent B directly — like one function calling another. This creates <strong>tight coupling</strong>: if Agent B is down, Agent A crashes. If Agent B changes its interface, Agent A breaks. If you add Agent C, you need to rewire everything.</p>

    <p>Instead, agents communicate through <strong>shared memory</strong> — a database table both can access. Agent A writes its output to a key. Agent B watches that key. They never need to know about each other's existence. This is the same pattern used by Apache Kafka, RabbitMQ, and Redis pub/sub in production systems worldwide.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Direct Coupling (fragile)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Agent A calls Agent B's API. If B is down, A fails. If B changes, A breaks. Adding Agent C requires modifying A. N agents = N&sup2; connections.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Shared Memory (resilient)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Agent A writes to a key. Agent B reads the key. They are fully independent. If B is down, A still writes successfully. Adding Agent C requires zero changes to A or B.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Message Passing in Practice</h2>
    <p>In a typical shared memory setup, Agent A (a content writer) writes its output to a key in the <code>consciousness_stream</code> table. Agent B (a publisher) watches that key and acts when new data appears. The two agents never communicate directly — they only share a key name.</p>
  </div>

  <div class="section">
    <h2>How It Works in Code</h2>
    <p>The pattern is simple: a sender writes to a key, a receiver polls or subscribes to that key. Here is a complete example:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#71717a"># Sender agent writes its output to shared memory</span>
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">writer_agent</span>(db, content):
    db.execute(
        <span style="color:#fbbf24">"INSERT INTO consciousness_stream (key, value, agent) "</span>
        <span style="color:#fbbf24">"VALUES ('task.output', %s, 'writer')"</span>,
        [json.dumps({<span style="color:#fbbf24">"title"</span>: content.title, <span style="color:#fbbf24">"body"</span>: content.body})]
    )

<span style="color:#71717a"># Receiver agent watches for new entries</span>
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">publisher_agent</span>(db):
    <span style="color:#c084fc">while True</span>:
        new = db.execute(
            <span style="color:#fbbf24">"SELECT * FROM consciousness_stream "</span>
            <span style="color:#fbbf24">"WHERE key = 'task.output' AND processed = false "</span>
            <span style="color:#fbbf24">"ORDER BY created_at LIMIT 1"</span>
        )
        <span style="color:#c084fc">if</span> new:
            publish_to_website(new.value)
            db.execute(
                <span style="color:#fbbf24">"UPDATE consciousness_stream SET processed = true "</span>
                <span style="color:#fbbf24">"WHERE id = %s"</span>, [new.id]
            )
        time.sleep(<span style="color:#fbbf24">5</span>)  <span style="color:#71717a"># poll every 5 seconds</span></code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">The writer does not know or care if anyone reads its output. The publisher does not know or care who wrote the content. They only share a key name: <code>task.output</code>.</p>
  </div>

  <div class="section">
    <h2>Polling vs. Real-Time</h2>
    <p>The code above uses <strong>polling</strong> — checking for new messages every 5 seconds. This is simple but introduces latency. There are faster alternatives:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Polling (simple, some latency)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Agent checks the database on a timer. Easy to implement. Latency = poll interval. Fine for most use cases. Used by cron-based agents.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Database triggers / Supabase Realtime (instant)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Supabase can push changes to subscribers via WebSockets the moment a row is inserted. Zero latency. The receiver is notified instantly — no polling required.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Webhooks (push-based)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">When Agent A writes, a database trigger fires an HTTP request to Agent B's endpoint. B wakes up and processes immediately. Used in production event-driven systems.</p>
      </div>
    </div>
  </div>

  <div class="key-insight">
    <strong>The consciousness_stream</strong> is a shared table where agents post messages. Think of it like a team Slack channel — but for AI agents. Every agent can read from it, and any agent can write to it. No direct connections needed.
  </div>

  <div class="section">
    <h2>When Communication Fails</h2>
    <p>Shared memory communication is resilient, but not bulletproof. Common failure modes:</p>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Lost messages:</strong> If the database is down when Agent A writes, the message is lost. Solution: retry with exponential backoff, or use a write-ahead log.<br><br>
      <strong style="color:#ef4444">Stale reads:</strong> Agent B reads an old value because Agent A has not written yet. Solution: include timestamps and have Agent B check freshness.<br><br>
      <strong style="color:#ef4444">Race conditions:</strong> Two agents write to the same key simultaneously. The second write overwrites the first. This is the conflict problem covered in Lesson 6.
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Agent Communication Quiz","questions":[{"q":"How do agents communicate in a decoupled architecture?","options":["Direct API calls between agents","Shared memory \u2014 one writes, others read","Email-style message queues","Real-time WebSocket only"],"correct":1,"explanation":"Agents communicate through shared memory (consciousness_stream). No direct connections needed \u2014 agents write and read from the same store independently."},{"q":"What is the consciousness_stream?","options":["A real-time audio feed","A shared database table agents post messages to","A private log only one agent can read","A cron job scheduler"],"correct":1,"explanation":"The consciousness_stream is a shared table \u2014 like a team Slack channel for AI agents. Any agent can read from it or write to it."},{"q":"Agent A finishes writing a blog post and sets task.output in shared memory. What should Agent B (the publisher) do?","options":["Wait for Agent A to call it directly","Poll task.output and act when a new entry appears","Ask a human to relay the message","Create a new memory table"],"correct":1,"explanation":"Agent B watches for new entries on its key (task.output). When Agent A writes there, Agent B reads the payload and executes its action."},{"q":"Why is direct coupling between agents fragile?","options":["It is slower","If one agent fails, all agents that depend on it also fail","It uses more memory","It requires more code"],"correct":1,"explanation":"Direct coupling means Agent A directly calls Agent B. If B goes down, A crashes too. Shared memory decouples them \u2014 A writes regardless of B\u0027s status."},{"q":"What is the fastest way for Agent B to learn that Agent A has written new data?","options":["Polling every second","Supabase Realtime / database trigger that pushes notifications instantly","Reading the full table every minute","Asking a supervisor agent"],"correct":1,"explanation":"Database triggers and Supabase Realtime push changes via WebSockets the moment a row is inserted \u2014 zero latency, no polling required."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Communication Patterns","cards":[{"front":"Why don\u0027t agents call each other directly?","back":"Direct connections create tight coupling. If Agent A fails, Agent B breaks too. Shared memory decouples them \u2014 they operate independently and communicate asynchronously."},{"front":"What is a message key?","back":"A named slot in shared memory (e.g., task.output). The sender writes to it; the receiver watches for new entries on that key."},{"front":"What happens if two agents write to the same key at the same time?","back":"A race condition \u2014 the second write overwrites the first. Solved with locking, priority queues, or a conscience layer (Lesson 6)."},{"front":"Polling vs event-driven reading","back":"Polling: check the key on a timer (simple, has latency). Event-driven: get notified instantly via WebSocket or trigger (faster, more complex)."},{"front":"What is Supabase Realtime?","back":"A feature that pushes database changes to subscribers via WebSockets in real time. Agents get notified the moment a new row is inserted \u2014 no polling."},{"front":"What happens if the database is down when an agent writes?","back":"The message is lost. Solution: retry with exponential backoff, or buffer writes locally with a write-ahead log."}]}'></div>

</div>
