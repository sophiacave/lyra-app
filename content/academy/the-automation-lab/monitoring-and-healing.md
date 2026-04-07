---
title: "Monitoring and Healing"
course: "the-automation-lab"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-automation-lab/">The Automation Lab</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Monitoring &amp; Healing</h1>
  <p class="sub">An autonomous system is not complete until it can watch itself and fix its own problems. This lesson teaches you to build health checks, auto-healers, and escalation pipelines — the immune system of your agent fleet.</p>
</div>

  <div class="section">
    <h2>Why Monitoring Is Non-Negotiable</h2>
    <p>Without monitoring, your agents run blind. A health check script fails silently for weeks. A heartbeat stops reaching the database — but the logs say everything is fine (because the write was rejected, not errored). A cron job dies and nobody notices until a customer asks why their report is two weeks late.</p>
    <p>These are not hypothetical failures. They happen in production every day. The solution is <strong>three layers of defense</strong>:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Layer 1: Health Checks</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Periodic pings that verify each agent is alive and responding correctly. Not just "is the process running?" but "is it producing correct output?" A health check that only checks uptime will miss a silently broken agent.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Layer 2: Auto-Healing</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">When a health check fails, an auto-healer agent takes action — restart the process, rollback to a previous version, or clear a stuck queue. This happens automatically, without human intervention, for known failure modes.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">Layer 3: Escalation</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">When auto-healing fails (max retries exhausted, or the problem requires human judgment), the system escalates — Slack alert, email, PagerDuty. Humans should only be paged for problems the system cannot solve itself.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>What a Health Check Looks Like</h2>
    <p>A real health check script from Like One's GCP Watcher. It runs every 15 minutes via systemd timer and checks four endpoints:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#71717a">#!/bin/bash</span>
<span style="color:#71717a"># health-check.sh — runs every 15 min on GCP</span>

check() {
  local name=$1; shift
  local start=$(date +%s%N)
  local code=$(curl -s -o /dev/null -w <span style="color:#fbbf24">"%{http_code}"</span> --max-time 10 <span style="color:#fbbf24">"$@"</span>)
  local ms=$(( ($(date +%s%N) - start) / 1000000 ))

  <span style="color:#c084fc">if</span> [ <span style="color:#fbbf24">"$code"</span> -ge 200 ] && [ <span style="color:#fbbf24">"$code"</span> -lt 400 ]; <span style="color:#c084fc">then</span>
    echo <span style="color:#fbbf24">"$name:ok:${ms}ms"</span>
  <span style="color:#c084fc">else</span>
    echo <span style="color:#fbbf24">"$name:FAIL:${code}"</span>    <span style="color:#71717a"># ← this triggers alerts</span>
  <span style="color:#c084fc">fi</span>
}

check <span style="color:#fbbf24">"site"</span>    https://likeone.ai/
check <span style="color:#fbbf24">"brain"</span>   -H <span style="color:#fbbf24">"apikey: $KEY"</span> <span style="color:#fbbf24">"$URL/rest/v1/brain_context?limit=1"</span>
check <span style="color:#fbbf24">"edge"</span>    <span style="color:#fbbf24">"$URL/functions/v1/founding-count"</span>
check <span style="color:#fbbf24">"academy"</span> https://likeone.ai/academy/</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Notice it checks HTTP status codes AND measures response time. A 200 that takes 30 seconds is still a problem — latency matters.</p>
  </div>

  <div class="section">
    <h2>Restart vs. Rollback</h2>
    <p>These are the two primary healing actions, and choosing the wrong one makes things worse:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Restart</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Clears a crashed or hung process. Resumes from current code. Use for: connection timeouts, memory leaks, stuck queues, process crashes. Does NOT fix bad code.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Rollback</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Reverts to a previous working code version. Use for: bad deploys, broken config changes, regressions. Does NOT fix infrastructure issues like network outages.</p>
      </div>
    </div>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Common mistake:</strong> Restarting an agent that has bad code. The agent starts, hits the same bug, crashes again. The auto-healer restarts it again. This creates a <strong>restart loop</strong> — the agent crashes and restarts hundreds of times, burning resources. Max retries prevents this by forcing escalation after N failures.
    </div>
  </div>

  <div class="section">
    <h2>Auto-Healer Configuration</h2>
    <p>An auto-healer is a supervisor agent that monitors other agents and automatically fixes problems. A typical configuration specifies: which agents to watch (all, critical only, or a specific pipeline), how often to check (every 30 seconds to every 5 minutes), the default action on error (restart, rollback, or escalate), a maximum retry count to prevent restart loops, and an escalation channel (Slack, email, or both) for when automatic fixes fail.</p>
  </div>

  <div class="section">
    <h2>The Silent Failure Problem</h2>
    <p>The most dangerous failure is the one you do not know about. Three real examples:</p>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">1. Wrong API key:</strong> A heartbeat script writes to a database using the wrong auth key. The database silently rejects the write (returns empty, not an error). The script logs "heartbeat sent" — because the HTTP request succeeded. But the data never arrived. The agent appears online in logs but is actually 5 hours stale in the database.<br><br>
      <strong style="color:#e5e5e5">2. Crontab dies:</strong> A cron job stops running after a server reboot. No alerts because crontab has no failure notification. The scheduled report just... stops arriving. Nobody notices for a week.<br><br>
      <strong style="color:#e5e5e5">3. Disk full:</strong> An agent writes logs that slowly fill the disk. When the disk is full, the agent crashes — but the crash handler also tries to write a log, which also fails. No alert is sent. The machine goes dark.
    </div>

    <p>The fix for all three: <strong>verify results, not just requests</strong>. A health check must read back from the database, not just write to it. A cron system must track failures. Log rotation must be configured.</p>
  </div>

  <div class="section">
    <h2>Building an Escalation Pipeline</h2>
    <p>A well-designed escalation pipeline has multiple tiers, each more urgent than the last. Here is a production-ready escalation hierarchy:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Tier 1: Auto-Fix (0-30 seconds)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Known failure patterns with automated fixes. Connection timeout? Restart. Stale cache? Clear it. Queue stuck? Flush and retry. These happen silently — no human is notified unless the auto-fix itself fails.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Tier 2: Alert (after 2 failed auto-fixes)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Auto-fix has tried twice and failed. Send a Slack message or email with the error details, what was tried, and the current system state. The human is informed but not paged — this is for attention, not emergency.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">Tier 3: Page (after max retries or critical failure)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Max retries exhausted, or the failure is critical (data loss risk, security breach, revenue-impacting). PagerDuty, SMS, phone call. The human must act now. Include a runbook link — what to do, step by step.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Metrics That Matter</h2>
    <p>Not all metrics are worth monitoring. Focus on these four for agent fleets:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Heartbeat Freshness</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">How recently did each agent report in? A heartbeat older than 2x the expected interval means the agent is likely dead. This is the single most important metric for agent health.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Task Success Rate</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">What percentage of tasks complete successfully vs. fail or timeout? A drop in success rate signals a systemic issue — bad deploy, API change, or resource exhaustion.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Response Latency</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">How long does the agent take to respond to requests or complete tasks? Trending upward means the agent is under load, memory is growing, or external dependencies are slowing down.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Error Rate by Type</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Categorize errors: network, auth, validation, timeout, unknown. A spike in auth errors means credentials changed. A spike in timeouts means an external service is degraded. The type tells you where to look.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Observability vs. Monitoring</h2>
    <p>Monitoring tells you <em>something is wrong</em>. Observability tells you <em>why</em>.</p>

    <div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#8b5cf6">Monitoring:</strong> "Agent X has not sent a heartbeat in 10 minutes." This triggers an alert.<br><br>
      <strong style="color:#34d399">Observability:</strong> "Agent X stopped because it hit a rate limit on the OpenAI API at 14:32. The rate limit was caused by Agent Y sending 500 requests in the same minute due to a retry loop." This tells you the root cause and how to prevent recurrence.
    </div>
    <p style="font-size:.85rem;color:#a1a1aa">Observability requires three pillars: <strong>logs</strong> (what happened), <strong>metrics</strong> (how much and how fast), and <strong>traces</strong> (the path through the system). All three together give you the full picture.</p>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Monitoring & Healing Quiz","questions":[{"q":"A Monitor agent detects a connection timeout on api-server-03. It has retried 2 times. What is the correct fix?","options":["Rollback to last good state","Restart the agent","Escalate immediately to a human","Ignore and wait"],"correct":1,"explanation":"A connection timeout is a runtime issue, not a code issue. Restarting clears the error state. Rollback only helps with bad code deployments."},{"q":"What is the purpose of a Max Retries setting on an auto-healer?","options":["Limit how many agents can run at once","Prevent the healer from restart-looping on a broken agent","Speed up recovery time","Reduce memory usage"],"correct":1,"explanation":"Without a retry limit, an auto-healer could restart a broken agent hundreds of times in a loop. Max retries caps this and forces escalation."},{"q":"When should an auto-healer escalate to a human?","options":["After every error","When the error involves a timeout","When automatic fixes have failed max retries, or the issue requires human judgment","Never"],"correct":2,"explanation":"Auto-healers handle known, fixable errors. When retries are exhausted or the problem is outside the agent\u0027s scope, escalation is correct."},{"q":"A heartbeat script runs successfully but the database shows the agent as offline. What is the most likely cause?","options":["The database is down","The script is using the wrong auth key \u2014 writes are silently rejected","The agent crashed after the heartbeat","The cron job is misconfigured"],"correct":1,"explanation":"The classic silent failure: the HTTP request succeeds but the database rejects the write due to auth. The script logs success, but no data arrives. Always verify the result, not just the request."},{"q":"What is the difference between a restart and a rollback?","options":["They are the same thing","Restart clears a crashed process; rollback reverts to a previous code version","Rollback is faster","Restart is for code issues; rollback for connection issues"],"correct":1,"explanation":"Restart clears a hung process (runtime fix). Rollback reverts to working code (deploy fix). Using the wrong one makes the problem worse."}]}'></div>

  <div class="section">
    <h2>Runbooks: The Missing Piece</h2>
    <p>When escalation reaches a human, they need to know what to do. A <strong>runbook</strong> is a step-by-step guide for handling specific failures:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#71717a"># Runbook: Brain Database Unreachable</span>
<span style="color:#fb923c">Symptoms:</span> Health check returns FAIL for brain endpoint
<span style="color:#fb923c">Impact:</span>  All agents lose shared memory access
<span style="color:#fb923c">Steps:</span>
  1. Check Supabase status page (status.supabase.com)
  2. Verify API key is valid: curl -H "apikey: $KEY" $URL
  3. Check if RLS policy is blocking: try service role key
  4. If Supabase is down: wait for recovery, agents queue writes
  5. If key is wrong: update .env, restart affected agents</code></pre>
    </div>
    <p style="font-size:.82rem;color:#71717a;margin-top:.5rem">Every alert should link to its runbook. A human paged at 3 AM with "brain endpoint FAIL" and no runbook will waste 30 minutes diagnosing what a runbook could solve in 5.</p>
  </div>

  <div class="section">
    <h2>Building a Monitoring Dashboard</h2>
    <p>A monitoring dashboard gives you a single view of your entire agent fleet. At minimum, it should display:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Agent Status Grid</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Each agent shown as a card with status (healthy/degraded/down), last heartbeat time, current task, and error count in the last hour. Green for healthy, yellow for degraded (responding but slow), red for down (no heartbeat).</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Recent Events Timeline</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A chronological feed of significant events: deploys, failures, auto-heals, escalations, and task completions. This gives you the narrative — not just snapshots, but the story of what happened and when.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">System-Wide Metrics</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Total tasks completed today, overall success rate, average response time, and cost. These aggregate metrics tell you whether the fleet is healthy as a whole, even if individual agents look fine.</p>
      </div>
    </div>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"Monitoring & Healing Concepts","cards":[{"front":"What is an auto-healer?","back":"A supervisor agent that monitors others and auto-fixes problems \u2014 restarting crashed agents, rolling back bad deploys, or escalating to humans when retries are exhausted."},{"front":"Restart vs Rollback","back":"Restart: clears a crashed process, resumes current code. Use for runtime errors. Rollback: reverts to previous working code version. Use for bad deploys. Wrong choice = worse problem."},{"front":"What is a health check?","back":"A periodic test that verifies an agent is alive AND producing correct output. Must verify results, not just requests. A silent write failure looks like success."},{"front":"Why set max retries?","back":"Without a limit, a healer restart-loops a broken agent forever. Max retries forces escalation after N failed attempts."},{"front":"The silent failure problem","back":"The most dangerous failure is the one you don\u0027t know about. Wrong auth keys, dead cron jobs, full disks \u2014 all fail silently without proper monitoring."},{"front":"Three layers of defense","back":"Layer 1: Health checks (detect). Layer 2: Auto-healing (fix). Layer 3: Escalation (alert humans when auto-fix fails)."}]}'></div>
</div>
