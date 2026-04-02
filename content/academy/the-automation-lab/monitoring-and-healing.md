---
title: "Monitoring and Healing"
course: "the-automation-lab"
order: 9
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 9</div>
  <h1>Monitoring &amp; Healing</h1>
  <p class="subtitle">An autonomous system is not complete until it can watch itself and fix its own problems. This lesson teaches you to build health checks, auto-healers, and escalation pipelines — the immune system of your agent fleet.</p>

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

  <h2 class="section-title">&#128200; Live Agent Dashboard</h2>
  <div class="dashboard">
    <div class="dash-title"><span class="dash-label">Agent Status Monitor</span><span class="dash-time" id="dash-time"></span></div>
    <div class="inspect-panel" id="inspect-panel">
      <div class="ip-header"><span class="ip-name" id="ip-name"></span><button class="ip-close" onclick="closeInspect()">&times;</button></div>
      <p style="font-size:.8rem;color:#71717a;margin-bottom:.5rem">Choose the right fix:</p>
    </div>
  </div>

  <h2 class="section-title">&#129657; Build an Auto-Healer</h2>
  <div class="healer-section">
    <div class="heal-title">Auto-Healer Configuration</div>
    <div class="heal-desc">An auto-healer is an agent that watches other agents and automatically fixes problems. Configure yours below.</div>
    <div class="heal-config">
      <div class="hc-field"><label>Watch Target</label><select id="h-target" onchange="updateHealPreview()"><option value="all">All Agents</option><option value="critical">Critical Only</option><option value="content">Content Pipeline</option></select></div>
      <div class="hc-field"><label>Check Interval</label><select id="h-interval" onchange="updateHealPreview()"><option value="30s">Every 30 seconds</option><option value="1m">Every minute</option><option value="5m">Every 5 minutes</option></select></div>
      <div class="hc-field"><label>On Error</label><select id="h-error" onchange="updateHealPreview()"><option value="restart">Auto-Restart</option><option value="rollback">Rollback to Last Good State</option><option value="escalate">Escalate to Human</option></select></div>
      <div class="hc-field"><label>Max Retries</label><select id="h-retries" onchange="updateHealPreview()"><option value="1">1</option><option value="3">3</option><option value="5">5</option></select></div>
      <div class="hc-field full"><label>Escalation Channel</label><select id="h-escalate" onchange="updateHealPreview()"><option value="slack">#ops-alerts (Slack)</option><option value="email">ops@likeone.ai (Email)</option><option value="both">Both</option></select></div>
    </div>
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

  <div data-learn="QuizMC" data-props='{"title":"Monitoring & Healing Quiz","questions":[{"q":"A Monitor agent detects a connection timeout on api-server-03. It has retried 2 times. What is the correct fix?","options":["Rollback to last good state","Restart the agent","Escalate immediately to a human","Ignore and wait"],"correct":1,"explanation":"A connection timeout is a runtime issue, not a code issue. Restarting clears the error state. Rollback only helps with bad code deployments."},{"q":"What is the purpose of a Max Retries setting on an auto-healer?","options":["Limit how many agents can run at once","Prevent the healer from restart-looping on a broken agent","Speed up recovery time","Reduce memory usage"],"correct":1,"explanation":"Without a retry limit, an auto-healer could restart a broken agent hundreds of times in a loop. Max retries caps this and forces escalation."},{"q":"When should an auto-healer escalate to a human?","options":["After every error","When the error involves a timeout","When automatic fixes have failed max retries, or the issue requires human judgment","Never"],"correct":2,"explanation":"Auto-healers handle known, fixable errors. When retries are exhausted or the problem is outside the agent\u0027s scope, escalation is correct."},{"q":"A heartbeat script runs successfully but the database shows the agent as offline. What is the most likely cause?","options":["The database is down","The script is using the wrong auth key \u2014 writes are silently rejected","The agent crashed after the heartbeat","The cron job is misconfigured"],"correct":1,"explanation":"The classic silent failure: the HTTP request succeeds but the database rejects the write due to auth. The script logs success, but no data arrives. Always verify the result, not just the request."},{"q":"What is the difference between a restart and a rollback?","options":["They are the same thing","Restart clears a crashed process; rollback reverts to a previous code version","Rollback is faster","Restart is for code issues; rollback for connection issues"],"correct":1,"explanation":"Restart clears a hung process (runtime fix). Rollback reverts to working code (deploy fix). Using the wrong one makes the problem worse."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Monitoring & Healing Concepts","cards":[{"front":"What is an auto-healer?","back":"A supervisor agent that monitors others and auto-fixes problems \u2014 restarting crashed agents, rolling back bad deploys, or escalating to humans when retries are exhausted."},{"front":"Restart vs Rollback","back":"Restart: clears a crashed process, resumes current code. Use for runtime errors. Rollback: reverts to previous working code version. Use for bad deploys. Wrong choice = worse problem."},{"front":"What is a health check?","back":"A periodic test that verifies an agent is alive AND producing correct output. Must verify results, not just requests. A silent write failure looks like success."},{"front":"Why set max retries?","back":"Without a limit, a healer restart-loops a broken agent forever. Max retries forces escalation after N failed attempts."},{"front":"The silent failure problem","back":"The most dangerous failure is the one you don\u0027t know about. Wrong auth keys, dead cron jobs, full disks \u2014 all fail silently without proper monitoring."},{"front":"Three layers of defense","back":"Layer 1: Health checks (detect). Layer 2: Auto-healing (fix). Layer 3: Escalation (alert humans when auto-fix fails)."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Auto-Healing Response Order","instruction":"Arrange the steps an auto-healer takes when it detects an agent error","items":["Detect error via health check","Log the error with timestamp","Attempt automatic fix (restart or rollback)","Retry up to max retries if fix fails","Escalate to human if all retries exhausted"]}'></div>

</div>
