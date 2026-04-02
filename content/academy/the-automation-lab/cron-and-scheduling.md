---
title: "Cron and Scheduling"
course: "the-automation-lab"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 8</div>
  <h1>Cron &amp; Scheduling</h1>
  <p class="subtitle">Autonomous agents need to know when to wake up. Cron is the universal scheduling language — created in the 1970s, still running on virtually every server in the world. This lesson teaches you to read, write, and debug cron expressions, schedule agent fleets without conflicts, and choose between cron, event-driven, and always-on scheduling.</p>

  <div class="section">
    <h2>Three Scheduling Modes</h2>
    <p>Every agent runs in one of three modes. Choosing the wrong mode is a common architectural mistake:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Cron-based (time-triggered)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Agent wakes on a fixed schedule — every 5 minutes, daily at 9 AM, weekly on Mondays. Predictable, efficient, but has latency (up to one full interval). Best for: reports, backups, periodic health checks, batch processing.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Event-driven (trigger-based)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Agent sleeps until something happens — a webhook fires, a database row is inserted, a file is uploaded. Zero latency for the triggering event. Efficient because the agent uses zero resources while sleeping. Best for: incoming requests, real-time processing, notifications.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Always-on (continuous)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Agent runs in a permanent loop, continuously monitoring and acting. Instant response time but highest resource cost. Best for: chat agents, real-time dashboards, security monitoring, anything that must respond in under a second.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Cron Expression Format</h2>
    <p>A cron expression is five fields separated by spaces. Each field controls one dimension of timing:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.9rem;color:#e5e5e5;line-height:2;overflow-x:auto;text-align:center">
      <pre style="margin:0"><code><span style="color:#fb923c">*</span>  <span style="color:#34d399">*</span>  <span style="color:#8b5cf6">*</span>  <span style="color:#38bdf8">*</span>  <span style="color:#ef4444">*</span>
<span style="color:#fb923c">│</span>  <span style="color:#34d399">│</span>  <span style="color:#8b5cf6">│</span>  <span style="color:#38bdf8">│</span>  <span style="color:#ef4444">│</span>
<span style="color:#fb923c">│</span>  <span style="color:#34d399">│</span>  <span style="color:#8b5cf6">│</span>  <span style="color:#38bdf8">│</span>  <span style="color:#ef4444">└─ Day of week (0-6, Sun=0)</span>
<span style="color:#fb923c">│</span>  <span style="color:#34d399">│</span>  <span style="color:#8b5cf6">│</span>  <span style="color:#38bdf8">└──── Month (1-12)</span>
<span style="color:#fb923c">│</span>  <span style="color:#34d399">│</span>  <span style="color:#8b5cf6">└─────── Day of month (1-31)</span>
<span style="color:#fb923c">│</span>  <span style="color:#34d399">└────────── Hour (0-23)</span>
<span style="color:#fb923c">└─────────────── Minute (0-59)</span></code></pre>
    </div>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5"><code>*</code></strong> = every value (wildcard)<br>
      <strong style="color:#e5e5e5"><code>*/N</code></strong> = every N units (<code>*/5</code> in minute = every 5 minutes)<br>
      <strong style="color:#e5e5e5"><code>1-5</code></strong> = range (in weekday field: Monday through Friday)<br>
      <strong style="color:#e5e5e5"><code>1,15</code></strong> = specific values (1st and 15th of the month)<br>
    </div>

    <div style="background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.12);border-radius:10px;padding:1rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.8">
      <strong style="color:#34d399">Common examples:</strong><br>
      <code style="color:#e5e5e5">*/5 * * * *</code> — every 5 minutes (health checks)<br>
      <code style="color:#e5e5e5">0 9 * * 1-5</code> — 9:00 AM weekdays (daily standup report)<br>
      <code style="color:#e5e5e5">0 0 * * *</code> — midnight every day (nightly backup)<br>
      <code style="color:#e5e5e5">30 17 * * 5</code> — 5:30 PM every Friday (weekly summary)<br>
      <code style="color:#e5e5e5">0 */6 * * *</code> — every 6 hours (periodic sync)
    </div>
  </div>

  <h2 class="section-title">&#9200; Cron Expression Builder</h2>
  <div class="cron-builder">
    <div class="cron-title">Build Your Schedule</div>
    <div class="cron-fields">
      <div class="cron-field"><label>Minute</label><select id="c-min" onchange="updateCron()"><option value="*">Every (*)</option><option value="0">:00</option><option value="15">:15</option><option value="30">:30</option><option value="45">:45</option><option value="*/5">Every 5</option><option value="*/10">Every 10</option><option value="*/15">Every 15</option><option value="*/30">Every 30</option></select></div>
      <div class="cron-field"><label>Hour</label><select id="c-hr" onchange="updateCron()"><option value="*">Every (*)</option><option value="0">12 AM</option><option value="6">6 AM</option><option value="8">8 AM</option><option value="9">9 AM</option><option value="12">12 PM</option><option value="17">5 PM</option><option value="21">9 PM</option><option value="*/2">Every 2h</option><option value="*/6">Every 6h</option></select></div>
      <div class="cron-field"><label>Day (Month)</label><select id="c-dom" onchange="updateCron()"><option value="*">Every (*)</option><option value="1">1st</option><option value="15">15th</option><option value="1,15">1st & 15th</option></select></div>
      <div class="cron-field"><label>Month</label><select id="c-mon" onchange="updateCron()"><option value="*">Every (*)</option><option value="1">Jan</option><option value="*/3">Quarterly</option></select></div>
      <div class="cron-field"><label>Day (Week)</label><select id="c-dow" onchange="updateCron()"><option value="*">Every (*)</option><option value="1-5">Mon-Fri</option><option value="0,6">Weekends</option><option value="1">Monday</option><option value="5">Friday</option></select></div>
    </div>
    <div class="cron-expr">
      <div class="cron-expr-val" id="cron-val">* * * * *</div>
      <div class="cron-english" id="cron-eng">Every minute, every hour, every day</div>
    </div>
  </div>

  <div class="section">
    <h2>Real-World: How Like One Uses Cron</h2>
    <p>Like One's fleet uses all three scheduling modes in production right now:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#e5e5e5;line-height:1.7;overflow-x:auto">
      <pre style="margin:0"><code><span style="color:#71717a"># GCP Watcher — systemd timers (upgraded from crontab)</span>
<span style="color:#fb923c">brain-heartbeat.timer</span>  → every 5 min  → updates machine_heartbeats table
<span style="color:#fb923c">brain-health.timer</span>     → every 15 min → checks site, brain, edge functions, academy

<span style="color:#71717a"># Event-driven edge functions</span>
<span style="color:#34d399">subscribe</span>              → fires on POST → adds subscriber to database
<span style="color:#34d399">stripe-webhook</span>         → fires on Stripe event → processes payment

<span style="color:#71717a"># Always-on</span>
<span style="color:#8b5cf6">faye-chat</span>              → always listening → responds to user messages</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Scheduling Conflicts</h2>
    <p>When multiple resource-heavy agents fire at the same time, they compete for CPU, memory, and API rate limits. This is called a <strong>scheduling conflict</strong>. The fix is simple: stagger start times.</p>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Bad:</strong> 5 agents all scheduled at <code>0 9 * * *</code> (9:00 AM) — they all wake up and hit the API simultaneously.<br>
      <strong style="color:#34d399">Good:</strong> Stagger them: <code>0 9</code>, <code>2 9</code>, <code>4 9</code>, <code>6 9</code>, <code>8 9</code> — two minutes apart, no contention.
    </div>
  </div>

  <div class="section">
    <h2>Crontab vs. Systemd Timers</h2>
    <p>Two ways to run cron on Linux. Systemd timers are the modern choice:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Crontab (classic)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Simple one-liner format. No built-in failure logging. If a job fails, you may never know unless you manually check logs. Fine for simple scripts.</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Systemd Timers (modern)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Built-in failure tracking via <code>journalctl</code>. Can depend on other services. Survives reboots with lingering. The S+ choice for production agents.</p>
      </div>
    </div>
  </div>

  <h2 class="section-title">&#128197; Schedule Your Fleet</h2>
  <div class="timeline-section">
    <div class="tl-title">24-Hour Agent Timeline</div>
    <div class="tl-desc">Assign schedules to 5 agents and watch the timeline update. Red markers indicate scheduling conflicts — when too many agents run at the same time, they compete for resources.</div>

    <div class="conflict-alert" id="conflict-alert">&#9888;&#65039; Scheduling conflict detected! Two agents overlap at the same time.</div>

    <div class="agent-sched" id="agent-sched"></div>

    <div class="timeline" id="timeline">
      <div class="tl-hours"><span>12AM</span><span>3AM</span><span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>12AM</span></div>
      <div class="tl-rows" id="tl-rows"></div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Cron & Scheduling Quiz","questions":[{"q":"What does the cron expression `0 9 * * 1-5` mean?","options":["Every 9 minutes on weekdays","At 9:00 AM, Monday through Friday","Every hour on weekdays starting at 9","At minute 0 of the 9th hour every month"],"correct":1,"explanation":"Fields are: minute(0) hour(9) day(*) month(*) weekday(1-5 = Mon-Fri). So: at 9:00 AM, every weekday."},{"q":"What is a scheduling conflict?","options":["Two cron expressions that are identical","Too many agents running at the same time, competing for shared resources","An agent running at the wrong time zone","A cron job that never fires"],"correct":1,"explanation":"When multiple heavy agents run simultaneously they compete for CPU, memory, and API rate limits. Staggering their schedules prevents this."},{"q":"Which cron expression runs every 30 minutes?","options":["30 * * * *","* 30 * * *","*/30 * * * *","0,30 * * * *"],"correct":2,"explanation":"*/30 in the minute field means every 30 minutes (0 and 30 past each hour). `30 * * * *` runs only at :30 each hour \u2014 that is once per hour, not every 30 minutes."},{"q":"An agent needs to run only on weekdays at midnight for a backup. What cron expression fits?","options":["0 0 * * *","0 0 * * 1-5","* * * * 1-5","0 * * * 1-5"],"correct":1,"explanation":"0 0 * * 1-5 \u2014 minute 0, hour 0 (midnight), any day of month, any month, Mon-Fri only."},{"q":"Why are systemd timers better than crontab for production agents?","options":["They run faster","They have built-in failure tracking, dependency management, and survive reboots with lingering","They use less CPU","They support more scheduling options"],"correct":1,"explanation":"Systemd timers log failures to journalctl, can depend on other services, and persist across reboots with loginctl enable-linger. Crontab fails silently."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Cron & Scheduling Concepts","cards":[{"front":"Cron field order","back":"Minute | Hour | Day-of-month | Month | Day-of-week. Example: 30 17 * * 1-5 = 5:30 PM weekdays."},{"front":"* (asterisk) in cron","back":"Means every \u2014 every minute, every hour, every day. The wildcard."},{"front":"*/N in cron","back":"Every N units. */5 in the minute field = every 5 minutes. */2 in hour = every 2 hours."},{"front":"1-5 in cron weekday field","back":"Monday through Friday. 0 = Sunday, 6 = Saturday."},{"front":"Three scheduling modes","back":"Cron (time-triggered, periodic), Event-driven (webhook/trigger, zero latency), Always-on (continuous loop, highest resource cost)."},{"front":"Scheduling conflict","back":"Multiple resource-heavy agents firing simultaneously, competing for CPU/memory/API limits. Fix: stagger start times by 1-2 minutes."},{"front":"Crontab vs systemd timers","back":"Crontab: simple, no failure logging. Systemd: built-in failure tracking via journalctl, service dependencies, survives reboots. Use systemd for production."}]}'></div>

</div>
