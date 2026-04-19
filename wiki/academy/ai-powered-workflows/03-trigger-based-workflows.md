# Trigger-Based Workflows

**Course:** Building AI-Powered Workflows
**Order:** 3
**Type:** lesson
**Access:** Free

---
[← Back to Course](/academy/ai-powered-workflows/)
  Lesson 3 of 10


  # Trigger-Based Workflows

  Stop checking. Start reacting. Let events drive your automation.


  ### What You'll Learn


    - What triggers are and why they're the heartbeat of automation

    - The four trigger types: time, event, condition, and manual

    - How to choose the right trigger for each workflow

    - Building your first event-driven pipeline




  Core Concept
  ## Everything Starts With "When"

  Every workflow needs a starting gun. That's the trigger — the moment that sets everything in motion. Without a trigger, you still have a checklist. With one, you have automation. The question isn't "what do I need to do?" It's "when does this need to happen?"
  Triggers turn passive processes into reactive systems. Instead of you checking for new orders every hour, the system watches and acts the instant one arrives.


  The Four Types
  ## Choosing Your Trigger



    **Time-based:** "Every Monday at 9am, generate the weekly report." Predictable, scheduled, reliable. Best for recurring tasks.
    **Event-based:** "When a new customer signs up, send the welcome sequence." Reactive, immediate, context-aware. Best for response-driven work.
    **Condition-based:** "When inventory drops below 50 units, alert the team." Watchful, threshold-driven. Best for monitoring and safety nets.
    **Manual:** "When I click this button, run the deployment pipeline." Human-initiated but machine-executed. Best for complex tasks you still want control over.



  Real World
  ## Triggers in Practice

  A freelance designer gets a new inquiry through their website form. That form submission is an event trigger. It kicks off a workflow: AI categorizes the project type, checks the designer's availability in their calendar, drafts a personalized response with estimated timeline and pricing, and sends it — all within 60 seconds of the inquiry landing.
  The designer didn't check their inbox. Didn't draft a reply. Didn't look at their calendar. The trigger handled the first response, and the designer steps in only when it's time for the creative conversation.


  Architecture
  ## Webhooks: The Backbone of Event Triggers

  Most modern tools communicate through webhooks — small HTTP requests that fire when something happens. A payment processor sends a webhook when a charge succeeds. A CRM sends one when a deal moves stages. Your workflow platform listens for these signals and springs into action.
  You don't need to understand the deep technical layer yet. Just know this: if a tool has webhooks, it can trigger a workflow. And almost every modern tool has webhooks.


  Advanced Triggers
  ## Compound Triggers and Trigger Chains

  Real-world workflows often need more than a single trigger. A **compound trigger** requires multiple conditions to be true simultaneously: "When a new order arrives AND the order value is above $500 AND the customer is new." All three conditions must be met before the workflow fires.
  A **trigger chain** is when one workflow's completion triggers another workflow. The customer signs up (Workflow A triggers), onboarding completes (Workflow B triggers), and 7 days later a feedback request fires (Workflow C triggers). Each workflow is independent but connected through a chain of events.


    **Compound trigger example:**
    `WHEN new_signup AND plan == "enterprise" AND company_size > 100`
    → Route to enterprise sales team with full company dossier
    **Trigger chain example:**
    `Signup webhook → Onboarding workflow → [completion event] → Day-7 check-in workflow → [completion event] → Day-30 review workflow`



  Trigger Safety
  ## Preventing Runaway Triggers

  A trigger without guardrails is dangerous. What happens when your webhook fires 10,000 times in a minute because of a duplicate event bug? Or when a condition-based trigger gets stuck in a loop — the workflow updates a database field, which triggers the same workflow again, which updates the field again, forever?
  **Deduplication:** Track event IDs and skip duplicates. If you've already processed event `evt_abc123`, ignore the second delivery.
  **Rate limiting:** Cap how many times a workflow can fire per minute. If your customer signup workflow fires more than 100 times per minute, something is probably wrong — pause and alert.
  **Loop detection:** If a workflow modifies the same data that triggers it, add a "processed" flag. Only fire on records where `processed = false`, and set it to `true` as the first step.
  **Kill switch:** Every production workflow should have a way to instantly disable its trigger without deleting the workflow. A simple boolean flag in your config — `workflow_enabled: true/false` — can prevent catastrophic runaway scenarios.


  Platform Comparison
  ## Triggers Across Popular Platforms

  Different platforms offer different trigger capabilities. Knowing what's available helps you choose the right tool:


    **Zapier:** 6,000+ app triggers. Best for non-technical users. Each "Zap" starts with one trigger. Limited compound trigger support — use filters as workarounds.
    **Make (Integromat):** Visual scenario builder with compound triggers built in. Supports watching folders, databases, and APIs. Excellent for multi-branch workflows.
    **n8n:** Open-source, self-hosted option. Full webhook support, cron triggers, and custom JavaScript triggers. Best for teams that want full control over their automation infrastructure.
    **Custom Python/Node:** Maximum flexibility. FastAPI webhooks, APScheduler for cron, database polling for conditions. Best for workflows that need to be deeply integrated with your own systems.



  ### Try It Now

  Take the process you mapped in Lesson 2 and identify its ideal trigger type.

    `Look at your mapped process. What event, time, or condition should kick it off? Write: "WHEN [trigger] THEN [first action]." Is it time-based, event-based, condition-based, or manual?`



  Debugging Triggers
  ## When Your Workflow Doesn't Fire

  The most frustrating debugging experience: you set up a workflow, the trigger should have fired, but nothing happened. Here's a systematic approach to diagnosing trigger failures:
  **Check 1: Did the event actually occur?** Verify in the source system that the event happened. Check the webhook delivery logs (most platforms show recent webhook deliveries and their HTTP status codes). If the event didn't fire, the problem is upstream.
  **Check 2: Did the webhook arrive?** Check your endpoint's request logs. If you're using a custom server, add logging to the webhook handler. If using a platform like Make or Zapier, check their execution history. No request means a network or URL issue.
  **Check 3: Did the payload match your expectations?** Even if the webhook arrives, the data might be structured differently than your workflow expects. Log the raw payload and compare it to your code's expectations. A field named `customer_email` vs. `email` will silently break everything.
  **Check 4: Did a filter block it?** If you have conditions on your trigger (only fire for orders over $50), verify that the event data actually meets those conditions. Often the data is there but doesn't pass the filter.
  Pro tip: during development, always start with the simplest possible trigger — no filters, no conditions. Verify the basic connection works first. Then add complexity one condition at a time. Debugging a simple trigger is trivial. Debugging a compound trigger with three conditions and a filter is a nightmare.


  Timing Considerations
  ## When Timing Matters More Than Events

  Some workflows depend heavily on when they run, not just what triggers them. A weekly report generated at 9am Monday has a different value than one generated at 5pm Friday. Time-based triggers need careful consideration of timezone, business hours, and recipient expectations.
  **Always specify timezone.** "Every Monday at 9am" means nothing without a timezone. Is that 9am EST? PST? UTC? If your team spans multiple timezones, decide whether the workflow fires once (in the company's primary timezone) or multiple times (once per timezone).
  **Consider business calendars.** A workflow that runs "every business day" needs to know about holidays. Most scheduling libraries support calendar exclusions — add your company's holiday schedule so workflows don't fire on Christmas morning.
  **Avoid the top of the hour.** Everyone schedules cron jobs at :00. This creates traffic spikes on APIs and databases. Schedule your time-based triggers at odd minutes (:07, :23, :41) to avoid congestion.


  Best Practices
  ## Trigger Design Checklist

  Before deploying any trigger to production, verify these five things:
  **1. Idempotency:** If the same event fires twice, does your workflow handle it gracefully? Or does it create duplicate records, send duplicate emails, or charge a customer twice? Design every workflow to be safely re-runnable.
  **2. Failure mode:** If the trigger fires but the workflow fails mid-execution, what happens to the data? Is it lost, or can you retry from where it left off?
  **3. Volume expectations:** How many times per day/hour/minute will this trigger fire? Does your downstream processing handle that volume?
  **4. Monitoring:** How will you know if the trigger stops firing? A trigger that silently fails is worse than one that fails loudly.



### Trigger-Based Workflows

**Card 1:**
Front: Time-Based Trigger
Back: Scheduled and predictable — every Monday at 9am, generate the weekly report. Best for recurring tasks on a known schedule.

**Card 2:**
Front: Event-Based Trigger
Back: Reactive and immediate — when a customer signs up, send the welcome sequence. Best for response-driven work.

**Card 3:**
Front: Condition-Based Trigger
Back: Watchful and threshold-driven — when inventory drops below 50 units, alert the team. Best for monitoring and safety nets.

**Card 4:**
Front: Manual Trigger
Back: Human-initiated but machine-executed — click a button to run the deployment pipeline. Best for complex tasks you still want control over.

**Card 5:**
Front: Webhooks
Back: Small HTTP requests that fire when something happens in a tool. If a tool has webhooks, it can trigger a workflow — and almost every modern tool does.


  The Code
  ## Triggers in real code.

  Here are all four trigger types as actual Python code you can run:


Python — event trigger (webhook with FastAPI)

```
from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/webhook/new-customer")
async def handle_signup(request: Request):
    """Event trigger: fires when a customer signs up."""
    data = await request.json()
    customer_email = data["email"]
    customer_name = data["name"]

    # Workflow starts here
    send_welcome_email(customer_email, customer_name)
    add_to_crm(customer_email, customer_name)
    notify_sales_team(customer_name)

    return {"status": "workflow triggered"}
```


Python — time trigger (scheduled with APScheduler)

```
from apscheduler.schedulers.blocking import BlockingScheduler

scheduler = BlockingScheduler()

@scheduler.scheduled_job("cron", day_of_week="mon", hour=9)
def weekly_report():
    """Time trigger: every Monday at 9am."""
    data = fetch_weekly_metrics()
    report = generate_report_with_ai(data)
    send_to_slack("#team-updates", report)

@scheduler.scheduled_job("interval", minutes=5)
def check_inventory():
    """Condition trigger: check every 5 min, act when threshold hit."""
    stock = get_inventory_levels()
    low_items = [i for i in stock if i["quantity"] 50]
    if low_items:
        alert_purchasing_team(low_items)

scheduler.start()
```


Event triggers react instantly via webhooks. Time triggers run on a schedule. Condition triggers combine scheduled checking with threshold logic. Manual triggers are just API endpoints you call when you choose.


  Check Your Understanding
  ## Lesson 3 Quiz


### Quiz

**Q1: What is a trigger in workflow automation?**
    A. A type of database query
    B. The output of the final step in a workflow
  ✓ C. The starting condition that sets the entire workflow in motion
    D. A way to pause a workflow mid-execution
  *A trigger is the starting gun — the moment that sets everything in motion. Without a trigger you still have a checklist. With one, you have automation that reacts to the world without manual initiation.*

**Q2: In the freelance designer example, what event trigger starts the automated response workflow?**
    A. The designer checks their email manually
  ✓ B. A form submission from the website inquiry
    C. The designer clicks a calendar invite
    D. A time-based schedule every morning
  *The website form submission is the event trigger. That submission kicks off AI categorizing the project type, checking calendar availability, drafting a personalized response, and sending it — all within 60 seconds.*

**Q3: What do webhooks enable in event-triggered workflows?**
    A. They slow down workflows for safety checks
  ✓ B. They are small HTTP requests that fire when something happens in a tool, allowing your workflow platform to react instantly
    C. They require manual setup for each individual event
    D. They only work with certain email platforms
  *Webhooks are how modern tools communicate events — a payment succeeds, a deal changes stages, a form submits. Your workflow platform listens for these signals and springs into action. Almost every modern tool supports them.*


  [← Previous: Mapping Your Processes](/academy/ai-powered-workflows/02-mapping-your-processes/)
  [Next: Data Flow Design →](/academy/ai-powered-workflows/04-data-flow-design/)
