---
title: "Cron and Scheduling"
course: "the-automation-lab"
order: 8
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 3 &bull; Lesson 8</div>
  <h1>Cron &amp; Scheduling</h1>
  <p class="subtitle">Autonomous agents need to run on schedule. Master cron expressions, schedule your fleet, and detect conflicts before they happen.</p>

  <div style="background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.6">
    <strong style="color:#fb923c">Real-world context:</strong> Cron is a scheduling system used on virtually every server in the world. It was created in the 1970s and is still the standard way to run automated tasks. AI agents use cron expressions to define when they wake up and do work -- for example, a monitoring agent that checks server health every 5 minutes, or a reporting agent that sends a daily summary at 5 PM. The five-field format below (minute, hour, day, month, weekday) lets you express any schedule from "every minute" to "quarterly on Fridays."
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

  <h2 class="section-title">&#128197; Schedule Your Fleet</h2>
  <div class="timeline-section">
    <div class="tl-title">24-Hour Agent Timeline</div>
    <div class="tl-desc">Assign schedules to 5 agents and watch the timeline update. Red markers indicate scheduling conflicts -- when too many agents run at the same time, they compete for resources (CPU, memory, API rate limits). Stagger heavy tasks to avoid this.</div>

    <div class="conflict-alert" id="conflict-alert">&#9888;&#65039; Scheduling conflict detected! Two agents overlap at the same time.</div>

    <div class="agent-sched" id="agent-sched"></div>

    <div class="timeline" id="timeline">
      <div class="tl-hours"><span>12AM</span><span>3AM</span><span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>12AM</span></div>
      <div class="tl-rows" id="tl-rows"></div>
      </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Cron & Scheduling Quiz","questions":[{"q":"What does the cron expression `0 9 * * 1-5` mean?","options":["Every 9 minutes on weekdays","At 9:00 AM, Monday through Friday","Every hour on weekdays starting at 9","At minute 0 of the 9th hour every month"],"correct":1,"explanation":"Fields are: minute(0) hour(9) day(*) month(*) weekday(1-5 = Mon-Fri). So: at 9:00 AM, every weekday."},{"q":"What is a scheduling conflict?","options":["Two cron expressions that are identical","Too many agents running at the same time, competing for shared resources","An agent running at the wrong time zone","A cron job that never fires"],"correct":1,"explanation":"When multiple heavy agents run simultaneously they compete for CPU, memory, and API rate limits. Staggering their schedules prevents this."},{"q":"Which cron expression runs every 30 minutes?","options":["30 * * * *","* 30 * * *","*/30 * * * *","0,30 * * * *"],"correct":2,"explanation":"*/30 in the minute field means every 30 minutes (0, 30 past each hour). `30 * * * *` would run only at the :30 mark each hour."},{"q":"An agent needs to run only on weekdays at midnight for a backup. What cron expression fits?","options":["0 0 * * *","0 0 * * 1-5","* * * * 1-5","0 * * * 1-5"],"correct":1,"explanation":"0 0 * * 1-5 — minute 0, hour 0 (midnight), any day of month, any month, Mon-Fri only."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Cron Expression Cheatsheet","cards":[{"front":"Cron field order","back":"Minute | Hour | Day-of-month | Month | Day-of-week. Example: 30 17 * * 1-5 = 5:30 PM weekdays."},{"front":"* (asterisk) in cron","back":"Means every — every minute, every hour, every day, etc. The wildcard."},{"front":"*/N in cron","back":"Every N units. */5 in the minute field = every 5 minutes. */2 in hour = every 2 hours."},{"front":"1-5 in cron weekday field","back":"Monday through Friday. 0 = Sunday, 6 = Saturday."},{"front":"What causes a scheduling conflict?","back":"Multiple resource-heavy agents running at the same hour, competing for CPU, memory, and API limits. Fix by staggering start times."},{"front":"Event-driven vs cron scheduling","back":"Cron = fixed schedule (time-based). Event-driven = agent wakes when something happens (webhook, new DB row). Use cron for predictable periodic work."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Cron Expression to Meaning","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"* * * * *","right":"Every minute"},{"left":"0 9 * * 1-5","right":"9 AM weekdays only"},{"left":"*/30 * * * *","right":"Every 30 minutes"},{"left":"0 0 1 * *","right":"Midnight on the 1st of every month"},{"left":"0 17 * * 5","right":"5 PM every Friday"}]}'></div>

</div>
