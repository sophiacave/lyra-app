---
title: "Monitoring and Healing"
course: "the-automation-lab"
order: 9
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 3 &bull; Lesson 9</div>
  <h1>Monitoring &amp; Healing</h1>
  <p class="subtitle">An autonomous system isn't complete until it can watch itself and fix its own problems. Build the watchers that watch the workers.</p>

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

  <div data-learn="MatchConnect" data-props='{"title":"Match Healing Actions","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Restart","right":"Clears a hung or crashed process and resumes"},{"left":"Rollback","right":"Reverts to a previous working code version"},{"left":"Escalate","right":"Alerts a human when automatic fixes fail"},{"left":"Health check","right":"Periodic ping to verify an agent is running correctly"},{"left":"Max retries","right":"Caps restart attempts to prevent infinite loops"}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Monitoring & Healing Quiz","questions":[{"q":"A Monitor agent detects a connection timeout on api-server-03. It has retried 2 times. What is the correct fix?","options":["Rollback to last good state","Restart the agent","Escalate immediately to a human","Ignore and wait"],"correct":1,"explanation":"A connection timeout is a runtime issue, not a code issue. Restarting the agent clears the error state and resumes normal operations. Rollback only helps with bad code deployments."},{"q":"What is the purpose of a Max Retries setting on an auto-healer?","options":["Limit how many agents can run at once","Prevent the healer from restart-looping on a broken agent","Speed up recovery time","Reduce memory usage"],"correct":1,"explanation":"Without a retry limit, an auto-healer could repeatedly restart a broken agent in a loop. Max retries caps this and forces escalation if the fix isn\u0027t working."},{"q":"When should an auto-healer escalate to a human instead of auto-fixing?","options":["After every error","When the error involves a timeout","When automatic fixes have failed max retries, or the issue requires human judgment","Never — agents should always self-heal"],"correct":2,"explanation":"Auto-healers handle known, fixable errors. When retries are exhausted or the problem is outside the agent\u0027s scope, escalation is correct."},{"q":"What is the difference between a restart and a rollback?","options":["They are the same thing","Restart clears a crashed process; rollback reverts to a previous code state","Rollback is faster","Restart is used for code issues; rollback for connection issues"],"correct":1,"explanation":"Restart clears a crashed or hung process. Rollback reverts the agent to a previously working code version — use it when a bad deploy caused the error."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Monitoring & Healing Concepts","cards":[{"front":"What is an auto-healer?","back":"A supervisor agent that monitors other agents and automatically fixes problems — restarting crashed agents, rolling back bad deploys, or escalating to humans."},{"front":"Restart vs Rollback","back":"Restart: clears a hung or crashed process, resumes from current state. Rollback: reverts to a previous working code version. Use restart for runtime errors, rollback for bad deploys."},{"front":"What is a health check?","back":"A periodic ping or query to verify an agent is running and responding correctly. Failed health checks trigger the healing response."},{"front":"Why set max retries?","back":"Without a limit, a healer could restart a broken agent hundreds of times in a loop. Max retries forces escalation after N failed attempts."},{"front":"What should always be logged by an auto-healer?","back":"Every action taken: what error was detected, what fix was attempted, whether it succeeded, and when escalation was triggered. This audit trail is critical for debugging."},{"front":"Escalation channel","back":"Where the healer sends alerts when it cannot self-heal — Slack, email, PagerDuty. Humans stay in the loop for issues the system can\u0027t resolve autonomously."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Auto-Healing Response Order","instruction":"Arrange the steps an auto-healer takes when it detects an agent error","items":["Detect error via health check","Log the error with timestamp","Attempt automatic fix (restart or rollback)","Retry up to max retries if fix fails","Escalate to human if all retries exhausted"]}'></div>

</div>
