# Cron and Scheduling

**Course:** The Automation Lab
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 8 of 10


  # Cron & Scheduling

  Autonomous agents need to know when to wake up. Cron is the universal scheduling language — created in the 1970s, still running on virtually every server in the world. This lesson teaches you to read, write, and debug cron expressions, schedule agent fleets without conflicts, and choose between cron, event-driven, and always-on scheduling.



    ## Three Scheduling Modes

    Every agent runs in one of three modes. Choosing the wrong mode is a common architectural mistake:



        **Cron-based (time-triggered)**
        Agent wakes on a fixed schedule — every 5 minutes, daily at 9 AM, weekly on Mondays. Predictable, efficient, but has latency (up to one full interval). Best for: reports, backups, periodic health checks, batch processing.


        **Event-driven (trigger-based)**
        Agent sleeps until something happens — a webhook fires, a database row is inserted, a file is uploaded. Zero latency for the triggering event. Efficient because the agent uses zero resources while sleeping. Best for: incoming requests, real-time processing, notifications.


        **Always-on (continuous)**
        Agent runs in a permanent loop, continuously monitoring and acting. Instant response time but highest resource cost. Best for: chat agents, real-time dashboards, security monitoring, anything that must respond in under a second.





    ## The Cron Expression Format

    A cron expression is five fields separated by spaces. Each field controls one dimension of timing:



```
*  *  *  *  *
│  │  │  │  │
│  │  │  │  └─ Day of week (0-6, Sun=0)
│  │  │  └──── Month (1-12)
│  │  └─────── Day of month (1-31)
│  └────────── Hour (0-23)
└─────────────── Minute (0-59)
```




      **`*`** = every value (wildcard)

      **`*/N`** = every N units (`*/5` in minute = every 5 minutes)

      **`1-5`** = range (in weekday field: Monday through Friday)

      **`1,15`** = specific values (1st and 15th of the month)




      **Common examples:**

      `*/5 * * * *` — every 5 minutes (health checks)

      `0 9 * * 1-5` — 9:00 AM weekdays (daily standup report)

      `0 0 * * *` — midnight every day (nightly backup)

      `30 17 * * 5` — 5:30 PM every Friday (weekly summary)

      `0 */6 * * *` — every 6 hours (periodic sync)



  ##  Cron Expression Builder


    Build Your Schedule

      MinuteEvery (*):00:15:30:45Every 5Every 10Every 15Every 30
      HourEvery (*)12 AM6 AM8 AM9 AM12 PM5 PM9 PMEvery 2hEvery 6h
      Day (Month)Every (*)1st15th1st & 15th
      MonthEvery (*)JanQuarterly
      Day (Week)Every (*)Mon-FriWeekendsMondayFriday


      * * * * *
      Every minute, every hour, every day




    ## Real-World: How Like One Uses Cron

    Like One's fleet uses all three scheduling modes in production right now:



```
# GCP Watcher — systemd timers (upgraded from crontab)
brain-heartbeat.timer  → every 5 min  → updates machine_heartbeats table
brain-health.timer     → every 15 min → checks site, brain, edge functions, academy

# Event-driven edge functions
subscribe              → fires on POST → adds subscriber to database
stripe-webhook         → fires on Stripe event → processes payment

# Always-on
faye-chat              → always listening → responds to user messages
```





    ## Scheduling Conflicts

    When multiple resource-heavy agents fire at the same time, they compete for CPU, memory, and API rate limits. This is called a **scheduling conflict**. The fix is simple: stagger start times.


      **Bad:** 5 agents all scheduled at `0 9 * * *` (9:00 AM) — they all wake up and hit the API simultaneously.

      **Good:** Stagger them: `0 9`, `2 9`, `4 9`, `6 9`, `8 9` — two minutes apart, no contention.




    ## Crontab vs. Systemd Timers

    Two ways to run cron on Linux. Systemd timers are the modern choice:



        **Crontab (classic)**
        Simple one-liner format. No built-in failure logging. If a job fails, you may never know unless you manually check logs. Fine for simple scripts.


        **Systemd Timers (modern)**
        Built-in failure tracking via `journalctl`. Can depend on other services. Survives reboots with lingering. The S+ choice for production agents.




  ##  Schedule Your Fleet


    24-Hour Agent Timeline
    Assign schedules to 5 agents and watch the timeline update. Red markers indicate scheduling conflicts — when too many agents run at the same time, they compete for resources.

     Scheduling conflict detected! Two agents overlap at the same time.




      12AM3AM6AM9AM12PM3PM6PM9PM12AM





    ## Timezone Pitfalls

    Cron expressions run in the timezone of the server, not the user. This causes real problems in production:


      **DST trap:** A cron job scheduled at `0 2 * * *` (2:00 AM) will either skip or double-fire during daylight saving transitions. In spring, 2:00 AM does not exist (clocks jump from 1:59 to 3:00). In fall, 2:00 AM happens twice. Use UTC for all server cron to avoid this entirely.


      **Multi-region trap:** If your agents run across US-East and EU-West, "9:00 AM" is two different moments. Coordinate with UTC timestamps in the database, then convert to local time only for display.




    ## Dead Letter Queues

    When a scheduled task fails repeatedly, it needs to go somewhere instead of being silently dropped. A **dead letter queue** (DLQ) captures failed tasks for later analysis:



```
# When a scheduled task fails after max retries
def handle_failure(task, error, retry_count):
    if retry_count >= MAX_RETRIES:
        # Move to dead letter queue for manual review
        db.execute(
            "INSERT INTO dead_letter_queue "
            "(task_id, error, failed_at, payload) "
            "VALUES (%s, %s, NOW(), %s)",
            [task.id, str(error), json.dumps(task.payload)]
        )
        alert_human(f"Task {task.id} moved to DLQ after {MAX_RETRIES} retries")
    else:
        # Retry with exponential backoff
        schedule_retry(task, delay=2 ** retry_count)
```


    Dead letter queues prevent data loss and give you a clear list of failures to investigate. Review the DLQ regularly — patterns in failed tasks reveal systemic issues.



    ## Idempotency in Scheduled Tasks

    Scheduled tasks must be **idempotent** — running the same task twice should produce the same result as running it once. This is critical because cron jobs can fire twice (clock skew, restart recovery, DST) and you cannot guarantee exactly-once execution.



        **Non-idempotent (dangerous)**
        `INSERT INTO reports ...` — running twice creates duplicate reports. `balance += 100` — running twice adds $200 instead of $100.


        **Idempotent (safe)**
        `INSERT ... ON CONFLICT DO UPDATE` — upsert instead of insert. `SET balance = 200` — absolute value, not relative. Running twice produces the same result.





### Quiz

**Q1: What does the cron expression `0 9 * * 1-5` mean?**
    A. Every 9 minutes on weekdays
  ✓ B. At 9:00 AM, Monday through Friday
    C. Every hour on weekdays starting at 9
    D. At minute 0 of the 9th hour every month
  *Fields are: minute(0) hour(9) day(*) month(*) weekday(1-5 = Mon-Fri). So: at 9:00 AM, every weekday.*

**Q2: What is a scheduling conflict?**
    A. Two cron expressions that are identical
  ✓ B. Too many agents running at the same time, competing for shared resources
    C. An agent running at the wrong time zone
    D. A cron job that never fires
  *When multiple heavy agents run simultaneously they compete for CPU, memory, and API rate limits. Staggering their schedules prevents this.*

**Q3: Which cron expression runs every 30 minutes?**
    A. 30 * * * *
    B. * 30 * * *
  ✓ C. */30 * * * *
    D. 0,30 * * * *
  **/30 in the minute field means every 30 minutes (0 and 30 past each hour). `30 * * * *` runs only at :30 each hour — that is once per hour, not every 30 minutes.*

**Q4: An agent needs to run only on weekdays at midnight for a backup. What cron expression fits?**
    A. 0 0 * * *
  ✓ B. 0 0 * * 1-5
    C. * * * * 1-5
    D. 0 * * * 1-5
  *0 0 * * 1-5 — minute 0, hour 0 (midnight), any day of month, any month, Mon-Fri only.*

**Q5: Why are systemd timers better than crontab for production agents?**
    A. They run faster
  ✓ B. They have built-in failure tracking, dependency management, and survive reboots with lingering
    C. They use less CPU
    D. They support more scheduling options
  *Systemd timers log failures to journalctl, can depend on other services, and persist across reboots with loginctl enable-linger. Crontab fails silently.*



    ## Monitoring Your Schedule

    A scheduled task that fails silently is worse than one that never runs — at least missing a task is noticeable. Monitor your schedule health:



        **Last-Run Tracking**
        Log the timestamp of every task execution. If the last run is older than 2x the expected interval, the task has stopped. Alert immediately.


        **Duration Tracking**
        Track how long each task takes. A task that normally takes 10 seconds but suddenly takes 5 minutes is degraded even if it still completes. Trending duration upward is an early warning.





### Cron & Scheduling Concepts

**Card 1:**
Front: Cron field order
Back: Minute | Hour | Day-of-month | Month | Day-of-week. Example: 30 17 * * 1-5 = 5:30 PM weekdays.

**Card 2:**
Front: * (asterisk) in cron
Back: Means every — every minute, every hour, every day. The wildcard.

**Card 3:**
Front: */N in cron
Back: Every N units. */5 in the minute field = every 5 minutes. */2 in hour = every 2 hours.

**Card 4:**
Front: 1-5 in cron weekday field
Back: Monday through Friday. 0 = Sunday, 6 = Saturday.

**Card 5:**
Front: Three scheduling modes
Back: Cron (time-triggered, periodic), Event-driven (webhook/trigger, zero latency), Always-on (continuous loop, highest resource cost).

**Card 6:**
Front: Scheduling conflict
Back: Multiple resource-heavy agents firing simultaneously, competing for CPU/memory/API limits. Fix: stagger start times by 1-2 minutes.

**Card 7:**
Front: Crontab vs systemd timers
Back: Crontab: simple, no failure logging. Systemd: built-in failure tracking via journalctl, service dependencies, survives reboots. Use systemd for production.
