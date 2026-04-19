# Conflict Resolution

**Course:** The Automation Lab
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 6 of 10


  # Conflict Resolution

  What happens when two agents try to modify the same data at the same time? Without a strategy, data gets silently corrupted. This lesson teaches three battle-tested solutions — locking, priority queues, and the conscience layer — and when to use each one.



    ## The Problem: Race Conditions

    A **race condition** happens when two agents read the same value, make independent changes, and both write back. The second write overwrites the first — silently destroying data. This is not a theoretical problem. It is one of the most common bugs in concurrent systems, and it is especially dangerous with AI agents because the corruption is silent.


      **Classic example:** User balance is $100. Agent A reads $100, adds $50 (deposit). Agent B reads $100, subtracts $30 (payment). Agent A writes $150. Agent B writes $70. Final balance: $70. The $50 deposit is gone. Neither agent made an error — the race condition silently ate the deposit.




    ## Three Solutions

    Every conflict resolution strategy in computing — from database transactions to distributed systems — falls into one of three categories:



    LockingAgent acquires a lock before writing. Others must wait. Simple but can cause bottlenecks.
    Priority QueueEach agent has a priority level. Higher priority writes first. Lower priority waits or merges.
    Conscience LayerAn arbiter agent reviews conflicting writes and decides which one aligns with system values.



    ## Deep Dive: Each Strategy




        ** Locking (Pessimistic Concurrency)**
        Before writing, an agent acquires a lock on the resource. While locked, no other agent can write to it. After writing, the lock is released. This is the same pattern used by database transactions (`SELECT ... FOR UPDATE`) and file locks.


```
-- PostgreSQL advisory lock example
BEGIN;
SELECT pg_advisory_xact_lock(12345);  -- acquire lock
UPDATE accounts SET balance = balance + 50
  WHERE user_id = 1;
COMMIT;  -- lock auto-released
```


        **Best for:** Quick operations where conflicts are common. **Risk:** Deadlocks — Agent A locks X and waits for Y, Agent B locks Y and waits for X. Neither can proceed.



        ** Priority Queue (Ordered Processing)**
        Instead of processing writes as they arrive, a queue orders them by priority. Security alerts process before analytics reports. P0 incidents before routine maintenance. The queue guarantees important writes are never starved by low-priority bulk operations.


```
# Priority queue: lower number = higher priority
queue = [
    {"priority": 1, "agent": "security", "action": "block_ip"},
    {"priority": 5, "agent": "analytics", "action": "update_dashboard"},
    {"priority": 3, "agent": "billing", "action": "charge_card"},
]
# Processes: security → billing → analytics
```


        **Best for:** Systems where writes have different importance levels. **Risk:** Low-priority tasks may starve if high-priority tasks never stop arriving.



        ** Conscience Layer (Value-Based Arbitration)**
        When two agents have valid but conflicting goals, a third agent — the arbiter — reviews both requests and decides which one better aligns with the system's values. This is for ethical or policy conflicts where both sides have legitimate claims.
        **Example:** GDPR agent wants to delete user data (privacy law). Fraud agent wants to retain it (active investigation). Both are legally valid. The conscience layer weighs the priority hierarchy (covered in Lesson 10) and makes a ruling — perhaps: retain for 30 days with restricted access, then delete.
        **Best for:** Value conflicts, ethical dilemmas, and policy disputes. **Risk:** The arbiter itself needs clear rules, or it becomes an unpredictable bottleneck.





    ## Rollbacks: The Safety Net

    When a conflict is detected *after* a write has already happened, the system needs a way to undo it. A **rollback** restores data to its last known good state — like Ctrl-Z for database operations.



```
# Simple rollback pattern: save state before modifying
def safe_update(db, key, new_value):
    # 1. Save current state
    old_value = db.execute("SELECT value FROM brain_context WHERE key = %s", [key])

    try:
        # 2. Apply the change
        db.execute("UPDATE brain_context SET value = %s WHERE key = %s", [new_value, key])
        # 3. Verify no conflict
        validate_no_conflict(key)
    except ConflictDetected:
        # 4. Rollback to previous state
        db.execute("UPDATE brain_context SET value = %s WHERE key = %s", [old_value, key])
        raise
```


    Production databases handle this natively through transactions. `BEGIN ... COMMIT` groups operations atomically — if any step fails, the entire transaction rolls back.



    ## Optimistic vs. Pessimistic Concurrency

    Locking is a **pessimistic** strategy — it assumes conflicts will happen and prevents them upfront. There is an alternative: **optimistic concurrency**, which assumes conflicts are rare and handles them after the fact.



        **Pessimistic (Locking)**
        Lock before write. Others wait. Guarantees no conflicts but adds latency. Best when conflicts are frequent and writes are fast.


        **Optimistic (Version Check)**
        Read the current version. Write with a version check — `WHERE version = @expected`. If another agent wrote first, the version has changed and your write fails. Retry with the new value. Best when conflicts are rare.





```
-- Optimistic concurrency: version-based check
UPDATE brain_context
SET value = 'new_value', version = version + 1
WHERE key = 'session.active_work'
  AND version = 42;  -- only succeeds if nobody else updated

-- If 0 rows affected → conflict detected → retry
```





    ## Conflict Detection Strategies

    Before you can resolve a conflict, you need to detect it. Three detection strategies:



        **Timestamp Comparison**
        Each write includes an `updated_at` timestamp. Before writing, the agent checks whether the timestamp has changed since it last read. If it has, someone else wrote in between. Simple and effective for most use cases.


        **Hash Comparison**
        Hash the value before reading. Before writing, hash the current value and compare. If the hashes differ, the data changed. More reliable than timestamps when clock synchronization is imperfect across distributed systems.


        **Write-Ahead Log**
        Every intended write is logged before execution. A separate process reviews the log and detects conflicts before they happen. More complex but provides an audit trail and enables conflict resolution before any data is changed.





    ## Real-World Conflict Scenarios

    Conflicts are not abstract — they happen in every multi-agent system. Here are three scenarios you will encounter:


      **1. Simultaneous session checkpoints:** Two agents running on different machines both try to write `session.active_work` at the same time. The second write silently overwrites the first, losing that agent's progress. Fix: use agent-specific keys (`session.active_work.agent_a`) or optimistic concurrency.


      **2. Counter increment race:** A page view counter is read as 100 by two agents simultaneously. Both increment to 101 and write. Final value: 101 instead of 102. Fix: use atomic SQL operations (`SET count = count + 1`) instead of read-then-write.


      **3. Config update during deploy:** An admin agent updates the config while a deploy agent is reading it. The deploy uses a mix of old and new values — a *torn read*. Fix: read the config inside a transaction, or use versioned config snapshots.




### Quiz

**Q1: Two agents need to update a user subscription simultaneously. Operations are quick (
    ## Choosing the Right Strategy

    Use this decision framework to choose the right conflict resolution approach:


      **Are writes quick (<1 second)?**

        Yes → **Locking** — simple and effective

        No → Do writes have different importance?

          Yes → **Priority Queue** — important writes first

          No → Is it a values/ethics conflict?

            Yes → **Conscience Layer** — value-based arbitration

            No → **Optimistic Concurrency** — version-check and retry

    Most systems use a combination: locking for hot paths, priority queues for task processing, and the conscience layer for policy conflicts.



    ## Testing for Race Conditions

    Race conditions are notoriously hard to find because they depend on timing. Here are three testing strategies:



        **Concurrent Write Test**
        Launch two agents simultaneously and have them both write to the same key. Check the final value. If either write was lost, you have a race condition. Run this test 100 times — race conditions are probabilistic and may not appear on every run.


        **Counter Increment Test**
        Set a counter to 0. Have 10 agents each increment it 100 times. Expected result: 1000. If the final value is less than 1000, increments were lost to race conditions. This is the simplest and most reliable race condition detector.


        **Slow-Motion Replay**
        Add deliberate delays between read and write operations to increase the window where conflicts can occur. In production, this window might be milliseconds. In testing, make it seconds. This amplifies race conditions so they appear consistently.





### Conflict Resolution Concepts

**Card 1:**
Front: What is a race condition?
Back: When two agents read the same value, calculate independently, and both write — the second write overwrites the first, silently losing data.

**Card 2:**
Front: What is a rollback?
Back: Undoing a change to restore data to its last safe state. Like Ctrl-Z for database operations. Implemented via database transactions (BEGIN/ROLLBACK).

**Card 3:**
Front: Locking (Pessimistic Concurrency)
Back: Agent acquires a lock before writing. Others must wait. Simple, reliable for quick ops. Risk: deadlocks if agents lock resources in different orders.

**Card 4:**
Front: Priority Queue
Back: Writes are ordered by importance level. Higher-priority agents go first. Risk: low-priority tasks may starve.

**Card 5:**
Front: Conscience Layer
Back: An arbiter agent reviews conflicting writes and decides based on system values. Best for ethical/policy conflicts where both sides are valid.

**Card 6:**
Front: What is a deadlock?
Back: Agent A locks X, waits for Y. Agent B locks Y, waits for X. Neither can proceed. Fix: always acquire locks in the same global order, or use timeouts.
