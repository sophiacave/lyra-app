---
title: "Conflict Resolution"
course: "the-automation-lab"
order: 6
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 6</div>
  <h1>Conflict Resolution</h1>
  <p class="subtitle">What happens when two agents try to modify the same data at the same time? Chaos -- unless you have a strategy.</p>

  <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.6">
    <strong style="color:#ef4444">Key concept -- Rollback:</strong> When a conflict is detected, a <strong>rollback</strong> undoes the last change, restoring data to its previous safe state. Think of it as "Ctrl-Z" for database operations. Below, you will also see the <strong>conscience layer</strong> -- a special arbiter agent that reviews conflicting actions and decides which one better aligns with the system's values and rules (like a judge settling a dispute between two agents).
  </div>

  <h2 class="section-title">&#9888;&#65039; The Race Condition</h2>
  <div class="race-demo">
    <div class="race-title">Watch two agents collide</div>
    <div class="race-scene">
      <div class="race-agent"><div class="race-av" id="ra-a">&#129302;</div><div class="race-name">Agent A</div></div>
      <div class="race-data" id="race-data"><div class="race-data-icon">&#128451;&#65039;</div><div class="race-data-label">user.balance</div><div class="race-data-val" id="race-val">$100</div></div>
      <div class="race-agent"><div class="race-av" id="ra-b">&#129302;</div><div class="race-name">Agent B</div></div>
    </div>
    <div class="race-log" id="race-log">Click "Run Race Condition" to see what happens...</div>
    <button class="race-btn" onclick="runRace()">&#9889; Run Race Condition</button>
  </div>

  <h2 class="section-title">&#128274; Three Solutions</h2>
  <div class="solutions">
    <div class="sol-card"><div class="sol-icon">&#128274;</div><div class="sol-name">Locking</div><div class="sol-desc">Agent acquires a lock before writing. Others must wait. Simple but can cause bottlenecks.</div></div>
    <div class="sol-card"><div class="sol-icon">&#128220;</div><div class="sol-name">Priority Queue</div><div class="sol-desc">Each agent has a priority level. Higher priority writes first. Lower priority waits or merges.</div></div>
    <div class="sol-card"><div class="sol-icon">&#129504;</div><div class="sol-name">Conscience Layer</div><div class="sol-desc">An arbiter agent reviews conflicting writes and decides which one aligns with system values.</div></div>
  </div>

  <h2 class="section-title">&#127919; Choose the Right Strategy</h2>
  <div class="scenarios" id="scenarios"></div>

  <div data-learn="QuizMC" data-props='{"title":"Conflict Resolution Strategies","questions":[{"q":"Two agents need to update a user subscription simultaneously. Operations are quick (<1 second). Best strategy?","options":["Conscience Layer","Priority Queue","Locking","Swarm pattern"],"correct":2,"explanation":"Quick operations plus two writers equals locking. Acquire lock, write, release. Simple and effective for fast operations."},{"q":"Five agents submit reports to a dashboard. Security alerts must appear before routine analytics. Best strategy?","options":["Locking","Conscience Layer","Swarm","Priority Queue"],"correct":3,"explanation":"Different importance levels call for a priority queue. Security agents get higher priority and their writes are processed first."},{"q":"An agent wants to delete user data for GDPR compliance. Another wants to retain it for fraud investigation. Both are valid. Best strategy?","options":["Locking","Priority Queue","Conscience Layer","Rollback"],"correct":2,"explanation":"Ethical conflict with competing valid interests requires the conscience layer — an arbiter must weigh values (privacy vs. safety) and make a judgment call."},{"q":"What is a race condition?","options":["An agent running faster than expected","Two agents reading and writing the same data simultaneously, causing one write to be lost","A scheduling conflict between cron jobs","A memory overflow error"],"correct":1,"explanation":"A race condition occurs when two agents both read the same value, calculate changes independently, and then both write — the second write overwrites the first, losing data."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Conflict Resolution Concepts","cards":[{"front":"What is a race condition?","back":"When two agents read the same value, calculate independently, and both write — the second write overwrites the first, silently losing data."},{"front":"What is a rollback?","back":"Undoing a change to restore data to its last safe state. Like Ctrl-Z for database operations. Used when a conflict is detected."},{"front":"Locking strategy","back":"An agent acquires a lock before writing. All others must wait. Simple and reliable for quick operations, but can bottleneck high-traffic systems."},{"front":"Priority Queue strategy","back":"Agents have priority levels. Higher-priority writes are processed first. Best when writes have different levels of importance."},{"front":"Conscience Layer strategy","back":"An arbiter agent reviews conflicting writes and decides which aligns better with system values. Best for ethical or value-based conflicts."}]}'></div>


</div>
