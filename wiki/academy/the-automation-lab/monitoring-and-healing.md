# Monitoring and Healing

**Course:** The Automation Lab
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 9 of 10


  # Monitoring & Healing

  An autonomous system is not complete until it can watch itself and fix its own problems. This lesson teaches you to build health checks, auto-healers, and escalation pipelines — the immune system of your agent fleet.



    ## Why Monitoring Is Non-Negotiable

    Without monitoring, your agents run blind. A health check script fails silently for weeks. A heartbeat stops reaching the database — but the logs say everything is fine (because the write was rejected, not errored). A cron job dies and nobody notices until a customer asks why their report is two weeks late.
    These are not hypothetical failures. They happen in production every day. The solution is **three layers of defense**:



        **Layer 1: Health Checks**
        Periodic pings that verify each agent is alive and responding correctly. Not just "is the process running?" but "is it producing correct output?" A health check that only checks uptime will miss a silently broken agent.


        **Layer 2: Auto-Healing**
        When a health check fails, an auto-healer agent takes action — restart the process, rollback to a previous version, or clear a stuck queue. This happens automatically, without human intervention, for known failure modes.


        **Layer 3: Escalation**
        When auto-healing fails (max retries exhausted, or the problem requires human judgment), the system escalates — Slack alert, email, PagerDuty. Humans should only be paged for problems the system cannot solve itself.





    ## What a Health Check Looks Like

    A real health check script from Like One's GCP Watcher. It runs every 15 minutes via systemd timer and checks four endpoints:



```
#!/bin/bash
# health-check.sh — runs every 15 min on GCP

check() {
  local name=$1; shift
  local start=$(date +%s%N)
  local code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$@")
  local ms=$(( ($(date +%s%N) - start) / 1000000 ))

  if [ "$code" -ge 200 ] && [ "$code" -lt 400 ]; then
    echo "$name:ok:${ms}ms"
  else
    echo "$name:FAIL:${code}"    # ← this triggers alerts
  fi
}

check "site"    https://likeone.ai/
check "brain"   -H "apikey: $KEY" "$URL/rest/v1/brain_context?limit=1"
check "edge"    "$URL/functions/v1/founding-count"
check "academy" https://likeone.ai/academy/
```


    Notice it checks HTTP status codes AND measures response time. A 200 that takes 30 seconds is still a problem — latency matters.



    ## Restart vs. Rollback

    These are the two primary healing actions, and choosing the wrong one makes things worse:



        **Restart**
        Clears a crashed or hung process. Resumes from current code. Use for: connection timeouts, memory leaks, stuck queues, process crashes. Does NOT fix bad code.


        **Rollback**
        Reverts to a previous working code version. Use for: bad deploys, broken config changes, regressions. Does NOT fix infrastructure issues like network outages.




      **Common mistake:** Restarting an agent that has bad code. The agent starts, hits the same bug, crashes again. The auto-healer restarts it again. This creates a **restart loop** — the agent crashes and restarts hundreds of times, burning resources. Max retries prevents this by forcing escalation after N failures.




    ## Auto-Healer Configuration

    An auto-healer is a supervisor agent that monitors other agents and automatically fixes problems. A typical configuration specifies: which agents to watch (all, critical only, or a specific pipeline), how often to check (every 30 seconds to every 5 minutes), the default action on error (restart, rollback, or escalate), a maximum retry count to prevent restart loops, and an escalation channel (Slack, email, or both) for when automatic fixes fail.



    ## The Silent Failure Problem

    The most dangerous failure is the one you do not know about. Three real examples:


      **1. Wrong API key:** A heartbeat script writes to a database using the wrong auth key. The database silently rejects the write (returns empty, not an error). The script logs "heartbeat sent" — because the HTTP request succeeded. But the data never arrived. The agent appears online in logs but is actually 5 hours stale in the database.


      **2. Crontab dies:** A cron job stops running after a server reboot. No alerts because crontab has no failure notification. The scheduled report just... stops arriving. Nobody notices for a week.


      **3. Disk full:** An agent writes logs that slowly fill the disk. When the disk is full, the agent crashes — but the crash handler also tries to write a log, which also fails. No alert is sent. The machine goes dark.


    The fix for all three: **verify results, not just requests**. A health check must read back from the database, not just write to it. A cron system must track failures. Log rotation must be configured.



    ## Building an Escalation Pipeline

    A well-designed escalation pipeline has multiple tiers, each more urgent than the last. Here is a production-ready escalation hierarchy:



        **Tier 1: Auto-Fix (0-30 seconds)**
        Known failure patterns with automated fixes. Connection timeout? Restart. Stale cache? Clear it. Queue stuck? Flush and retry. These happen silently — no human is notified unless the auto-fix itself fails.


        **Tier 2: Alert (after 2 failed auto-fixes)**
        Auto-fix has tried twice and failed. Send a Slack message or email with the error details, what was tried, and the current system state. The human is informed but not paged — this is for attention, not emergency.


        **Tier 3: Page (after max retries or critical failure)**
        Max retries exhausted, or the failure is critical (data loss risk, security breach, revenue-impacting). PagerDuty, SMS, phone call. The human must act now. Include a runbook link — what to do, step by step.





    ## Metrics That Matter

    Not all metrics are worth monitoring. Focus on these four for agent fleets:



        **Heartbeat Freshness**
        How recently did each agent report in? A heartbeat older than 2x the expected interval means the agent is likely dead. This is the single most important metric for agent health.


        **Task Success Rate**
        What percentage of tasks complete successfully vs. fail or timeout? A drop in success rate signals a systemic issue — bad deploy, API change, or resource exhaustion.


        **Response Latency**
        How long does the agent take to respond to requests or complete tasks? Trending upward means the agent is under load, memory is growing, or external dependencies are slowing down.


        **Error Rate by Type**
        Categorize errors: network, auth, validation, timeout, unknown. A spike in auth errors means credentials changed. A spike in timeouts means an external service is degraded. The type tells you where to look.





    ## Observability vs. Monitoring

    Monitoring tells you *something is wrong*. Observability tells you *why*.


      **Monitoring:** "Agent X has not sent a heartbeat in 10 minutes." This triggers an alert.


      **Observability:** "Agent X stopped because it hit a rate limit on the OpenAI API at 14:32. The rate limit was caused by Agent Y sending 500 requests in the same minute due to a retry loop." This tells you the root cause and how to prevent recurrence.

    Observability requires three pillars: **logs** (what happened), **metrics** (how much and how fast), and **traces** (the path through the system). All three together give you the full picture.



### Quiz

**Q1: A Monitor agent detects a connection timeout on api-server-03. It has retried 2 times. What is the correct fix?**
    A. Rollback to last good state
  ✓ B. Restart the agent
    C. Escalate immediately to a human
    D. Ignore and wait
  *A connection timeout is a runtime issue, not a code issue. Restarting clears the error state. Rollback only helps with bad code deployments.*

**Q2: What is the purpose of a Max Retries setting on an auto-healer?**
    A. Limit how many agents can run at once
  ✓ B. Prevent the healer from restart-looping on a broken agent
    C. Speed up recovery time
    D. Reduce memory usage
  *Without a retry limit, an auto-healer could restart a broken agent hundreds of times in a loop. Max retries caps this and forces escalation.*

**Q3: When should an auto-healer escalate to a human?**
    A. After every error
    B. When the error involves a timeout
  ✓ C. When automatic fixes have failed max retries, or the issue requires human judgment
    D. Never
  *Auto-healers handle known, fixable errors. When retries are exhausted or the problem is outside the agent's scope, escalation is correct.*

**Q4: A heartbeat script runs successfully but the database shows the agent as offline. What is the most likely cause?**
    A. The database is down
  ✓ B. The script is using the wrong auth key — writes are silently rejected
    C. The agent crashed after the heartbeat
    D. The cron job is misconfigured
  *The classic silent failure: the HTTP request succeeds but the database rejects the write due to auth. The script logs success, but no data arrives. Always verify the result, not just the request.*

**Q5: What is the difference between a restart and a rollback?**
    A. They are the same thing
  ✓ B. Restart clears a crashed process; rollback reverts to a previous code version
    C. Rollback is faster
    D. Restart is for code issues; rollback for connection issues
  *Restart clears a hung process (runtime fix). Rollback reverts to working code (deploy fix). Using the wrong one makes the problem worse.*



    ## Runbooks: The Missing Piece

    When escalation reaches a human, they need to know what to do. A **runbook** is a step-by-step guide for handling specific failures:



```
# Runbook: Brain Database Unreachable
Symptoms: Health check returns FAIL for brain endpoint
Impact:  All agents lose shared memory access
Steps:
  1. Check Supabase status page (status.supabase.com)
  2. Verify API key is valid: curl -H "apikey: $KEY" $URL
  3. Check if RLS policy is blocking: try service role key
  4. If Supabase is down: wait for recovery, agents queue writes
  5. If key is wrong: update .env, restart affected agents
```


    Every alert should link to its runbook. A human paged at 3 AM with "brain endpoint FAIL" and no runbook will waste 30 minutes diagnosing what a runbook could solve in 5.



    ## Building a Monitoring Dashboard

    A monitoring dashboard gives you a single view of your entire agent fleet. At minimum, it should display:



        **Agent Status Grid**
        Each agent shown as a card with status (healthy/degraded/down), last heartbeat time, current task, and error count in the last hour. Green for healthy, yellow for degraded (responding but slow), red for down (no heartbeat).


        **Recent Events Timeline**
        A chronological feed of significant events: deploys, failures, auto-heals, escalations, and task completions. This gives you the narrative — not just snapshots, but the story of what happened and when.


        **System-Wide Metrics**
        Total tasks completed today, overall success rate, average response time, and cost. These aggregate metrics tell you whether the fleet is healthy as a whole, even if individual agents look fine.





### Monitoring & Healing Concepts

**Card 1:**
Front: What is an auto-healer?
Back: A supervisor agent that monitors others and auto-fixes problems — restarting crashed agents, rolling back bad deploys, or escalating to humans when retries are exhausted.

**Card 2:**
Front: Restart vs Rollback
Back: Restart: clears a crashed process, resumes current code. Use for runtime errors. Rollback: reverts to previous working code version. Use for bad deploys. Wrong choice = worse problem.

**Card 3:**
Front: What is a health check?
Back: A periodic test that verifies an agent is alive AND producing correct output. Must verify results, not just requests. A silent write failure looks like success.

**Card 4:**
Front: Why set max retries?
Back: Without a limit, a healer restart-loops a broken agent forever. Max retries forces escalation after N failed attempts.

**Card 5:**
Front: The silent failure problem
Back: The most dangerous failure is the one you don't know about. Wrong auth keys, dead cron jobs, full disks — all fail silently without proper monitoring.

**Card 6:**
Front: Three layers of defense
Back: Layer 1: Health checks (detect). Layer 2: Auto-healing (fix). Layer 3: Escalation (alert humans when auto-fix fails).
