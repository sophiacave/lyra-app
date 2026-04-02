---
title: "Conflict Resolution"
course: "the-automation-lab"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 6</div>
  <h1>Conflict Resolution</h1>
  <p class="subtitle">What happens when two agents try to modify the same data at the same time? Without a strategy, data gets silently corrupted. This lesson teaches three battle-tested solutions — locking, priority queues, and the conscience layer — and when to use each one.</p>

  <div class="section">
    <h2>The Problem: Race Conditions</h2>
    <p>A <strong>race condition</strong> happens when two agents read the same value, make independent changes, and both write back. The second write overwrites the first — silently destroying data. This is not a theoretical problem. It is one of the most common bugs in concurrent systems, and it is especially dangerous with AI agents because the corruption is silent.</p>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.6">
      <strong style="color:#ef4444">Classic example:</strong> User balance is $100. Agent A reads $100, adds $50 (deposit). Agent B reads $100, subtracts $30 (payment). Agent A writes $150. Agent B writes $70. Final balance: $70. The $50 deposit is gone. Neither agent made an error — the race condition silently ate the deposit.
    </div>
  </div>

  <div class="section">
    <h2>Three Solutions</h2>
    <p>Every conflict resolution strategy in computing — from database transactions to distributed systems — falls into one of three categories:</p>
  </div>

  <div class="solutions">
    <div class="sol-card"><div class="sol-icon">&#128274;</div><div class="sol-name">Locking</div><div class="sol-desc">Agent acquires a lock before writing. Others must wait. Simple but can cause bottlenecks.</div></div>
    <div class="sol-card"><div class="sol-icon">&#128220;</div><div class="sol-name">Priority Queue</div><div class="sol-desc">Each agent has a priority level. Higher priority writes first. Lower priority waits or merges.</div></div>
    <div class="sol-card"><div class="sol-icon">&#129504;</div><div class="sol-name">Conscience Layer</div><div class="sol-desc">An arbiter agent reviews conflicting writes and decides which one aligns with system values.</div></div>
  </div>

  <div class="section">
    <h2>Deep Dive: Each Strategy</h2>

    <div style="display:flex;flex-direction:column;gap:1rem;margin:1rem 0">
      <div style="padding:1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.95rem">&#128274; Locking (Pessimistic Concurrency)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.5rem 0">Before writing, an agent acquires a lock on the resource. While locked, no other agent can write to it. After writing, the lock is released. This is the same pattern used by database transactions (<code>SELECT ... FOR UPDATE</code>) and file locks.</p>
        <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:1rem;margin:.75rem 0;font-family:'JetBrains Mono',monospace;font-size:.8rem;color:#e5e5e5;line-height:1.6;overflow-x:auto">
          <pre style="margin:0"><code><span style="color:#71717a">-- PostgreSQL advisory lock example</span>
<span style="color:#c084fc">BEGIN</span>;
<span style="color:#c084fc">SELECT</span> pg_advisory_xact_lock(<span style="color:#fbbf24">12345</span>);  <span style="color:#71717a">-- acquire lock</span>
<span style="color:#c084fc">UPDATE</span> accounts <span style="color:#c084fc">SET</span> balance = balance + <span style="color:#fbbf24">50</span>
  <span style="color:#c084fc">WHERE</span> user_id = <span style="color:#fbbf24">1</span>;
<span style="color:#c084fc">COMMIT</span>;  <span style="color:#71717a">-- lock auto-released</span></code></pre>
        </div>
        <p style="font-size:.82rem;color:#71717a"><strong>Best for:</strong> Quick operations where conflicts are common. <strong>Risk:</strong> Deadlocks — Agent A locks X and waits for Y, Agent B locks Y and waits for X. Neither can proceed.</p>
      </div>

      <div style="padding:1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.95rem">&#128220; Priority Queue (Ordered Processing)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.5rem 0">Instead of processing writes as they arrive, a queue orders them by priority. Security alerts process before analytics reports. P0 incidents before routine maintenance. The queue guarantees important writes are never starved by low-priority bulk operations.</p>
        <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:1rem;margin:.75rem 0;font-family:'JetBrains Mono',monospace;font-size:.8rem;color:#e5e5e5;line-height:1.6;overflow-x:auto">
          <pre style="margin:0"><code><span style="color:#71717a"># Priority queue: lower number = higher priority</span>
queue = [
    {<span style="color:#fbbf24">"priority"</span>: <span style="color:#fbbf24">1</span>, <span style="color:#fbbf24">"agent"</span>: <span style="color:#fbbf24">"security"</span>, <span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"block_ip"</span>},
    {<span style="color:#fbbf24">"priority"</span>: <span style="color:#fbbf24">5</span>, <span style="color:#fbbf24">"agent"</span>: <span style="color:#fbbf24">"analytics"</span>, <span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"update_dashboard"</span>},
    {<span style="color:#fbbf24">"priority"</span>: <span style="color:#fbbf24">3</span>, <span style="color:#fbbf24">"agent"</span>: <span style="color:#fbbf24">"billing"</span>, <span style="color:#fbbf24">"action"</span>: <span style="color:#fbbf24">"charge_card"</span>},
]
<span style="color:#71717a"># Processes: security → billing → analytics</span></code></pre>
        </div>
        <p style="font-size:.82rem;color:#71717a"><strong>Best for:</strong> Systems where writes have different importance levels. <strong>Risk:</strong> Low-priority tasks may starve if high-priority tasks never stop arriving.</p>
      </div>

      <div style="padding:1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.95rem">&#129504; Conscience Layer (Value-Based Arbitration)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.5rem 0">When two agents have valid but conflicting goals, a third agent — the arbiter — reviews both requests and decides which one better aligns with the system's values. This is for ethical or policy conflicts where both sides have legitimate claims.</p>
        <p style="font-size:.82rem;color:#a1a1aa"><strong>Example:</strong> GDPR agent wants to delete user data (privacy law). Fraud agent wants to retain it (active investigation). Both are legally valid. The conscience layer weighs the priority hierarchy (covered in Lesson 10) and makes a ruling — perhaps: retain for 30 days with restricted access, then delete.</p>
        <p style="font-size:.82rem;color:#71717a"><strong>Best for:</strong> Value conflicts, ethical dilemmas, and policy disputes. <strong>Risk:</strong> The arbiter itself needs clear rules, or it becomes an unpredictable bottleneck.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Rollbacks: The Safety Net</h2>
    <p>When a conflict is detected <em>after</em> a write has already happened, the system needs a way to undo it. A <strong>rollback</strong> restores data to its last known good state — like Ctrl-Z for database operations.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#71717a"># Simple rollback pattern: save state before modifying</span>
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">safe_update</span>(db, key, new_value):
    <span style="color:#71717a"># 1. Save current state</span>
    old_value = db.execute(<span style="color:#fbbf24">"SELECT value FROM brain_context WHERE key = %s"</span>, [key])

    <span style="color:#c084fc">try</span>:
        <span style="color:#71717a"># 2. Apply the change</span>
        db.execute(<span style="color:#fbbf24">"UPDATE brain_context SET value = %s WHERE key = %s"</span>, [new_value, key])
        <span style="color:#71717a"># 3. Verify no conflict</span>
        validate_no_conflict(key)
    <span style="color:#c084fc">except</span> ConflictDetected:
        <span style="color:#71717a"># 4. Rollback to previous state</span>
        db.execute(<span style="color:#fbbf24">"UPDATE brain_context SET value = %s WHERE key = %s"</span>, [old_value, key])
        <span style="color:#c084fc">raise</span></code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a">Production databases handle this natively through transactions. <code>BEGIN ... COMMIT</code> groups operations atomically — if any step fails, the entire transaction rolls back.</p>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Conflict Resolution Strategies","questions":[{"q":"Two agents need to update a user subscription simultaneously. Operations are quick (<1 second). Best strategy?","options":["Conscience Layer","Priority Queue","Locking","Swarm pattern"],"correct":2,"explanation":"Quick operations plus two writers equals locking. Acquire lock, write, release. Simple and effective for fast operations."},{"q":"Five agents submit reports to a dashboard. Security alerts must appear before routine analytics. Best strategy?","options":["Locking","Conscience Layer","Swarm","Priority Queue"],"correct":3,"explanation":"Different importance levels call for a priority queue. Security agents get higher priority and their writes are processed first."},{"q":"An agent wants to delete user data for GDPR compliance. Another wants to retain it for fraud investigation. Both are valid. Best strategy?","options":["Locking","Priority Queue","Conscience Layer","Rollback"],"correct":2,"explanation":"Ethical conflict with competing valid interests requires the conscience layer \u2014 an arbiter must weigh values (privacy vs. safety) and make a judgment call."},{"q":"What is a race condition?","options":["An agent running faster than expected","Two agents reading and writing the same data simultaneously, causing one write to be lost","A scheduling conflict between cron jobs","A memory overflow error"],"correct":1,"explanation":"A race condition occurs when two agents both read the same value, calculate changes independently, and then both write \u2014 the second write overwrites the first."},{"q":"What is a deadlock?","options":["When an agent runs out of memory","When Agent A locks resource X and waits for Y, while Agent B locks Y and waits for X \u2014 neither can proceed","When a database transaction is too slow","When an agent loses its identity"],"correct":1,"explanation":"Deadlocks happen when two agents each hold a lock the other needs. Neither can proceed. Prevented by always acquiring locks in the same order, or using lock timeouts."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Conflict Resolution Concepts","cards":[{"front":"What is a race condition?","back":"When two agents read the same value, calculate independently, and both write \u2014 the second write overwrites the first, silently losing data."},{"front":"What is a rollback?","back":"Undoing a change to restore data to its last safe state. Like Ctrl-Z for database operations. Implemented via database transactions (BEGIN/ROLLBACK)."},{"front":"Locking (Pessimistic Concurrency)","back":"Agent acquires a lock before writing. Others must wait. Simple, reliable for quick ops. Risk: deadlocks if agents lock resources in different orders."},{"front":"Priority Queue","back":"Writes are ordered by importance level. Higher-priority agents go first. Risk: low-priority tasks may starve."},{"front":"Conscience Layer","back":"An arbiter agent reviews conflicting writes and decides based on system values. Best for ethical/policy conflicts where both sides are valid."},{"front":"What is a deadlock?","back":"Agent A locks X, waits for Y. Agent B locks Y, waits for X. Neither can proceed. Fix: always acquire locks in the same global order, or use timeouts."}]}'></div>

</div>
