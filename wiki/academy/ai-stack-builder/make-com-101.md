# Make.com 101

**Course:** AI Stack Builder
**Order:** 3
**Type:** lesson
**Access:** Free

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 3 of 10


  # Make.com 101

  Make.com is visual automation. You connect triggers to actions, and data flows between services automatically. It is the glue that holds your stack together — and it replaces thousands of lines of integration code you would otherwise write by hand.


## Why Visual Automation Matters

Every modern stack has a dirty secret: **most of the code is integration glue**. Connecting Stripe to your database, sending Slack notifications when someone subscribes, syncing spreadsheets with analytics — none of this is your product, but it can consume 40% of your development time.

Make.com eliminates that glue code. Instead of writing a custom webhook handler for every service connection, you drag modules onto a canvas, map data fields between them, and hit "Run." The scenario runs on Make.com's infrastructure — no servers, no deployment, no maintenance.


&#x1f9e9;
1,600+App integrations available in Make.com — from Stripe to Notion to GitHub


&#x26a1;
Zero CodeVisual canvas replaces custom integration scripts and webhook handlers


&#x1f4b0;
1,000 FreeOperations per month on the free tier — enough for most indie projects


## Anatomy of a Scenario

A Make.com **scenario** is a chain of modules. Each module does exactly one thing: watch for an event, transform data, or send it somewhere. Modules execute left to right, passing data downstream like a conveyor belt.

Every scenario has three parts:


1

**Trigger — What Starts It**
Either a **Webhook** (fires when an external service sends data) or a **Schedule** (fires on a timer — every hour, every day at 9am, etc.). The trigger is always module #1.


2

**Processing — What Happens**
Modules that transform, filter, or route data. **Filter** modules apply conditional logic (only continue if amount > $50). **Router** modules split the flow into parallel paths. **Iterator** modules loop over arrays.


3

**Output — What It Produces**
The final module sends data somewhere: **Supabase** (insert a row), **Slack** (post a message), **Resend** (send an email), **Google Sheets** (log a row). Most scenarios end with 1-3 output modules.


## Three Real Scenarios (Production-Tested)

These are not hypothetical examples — they represent the exact patterns used in production AI stacks. Each one replaces 50-100 lines of custom integration code.


Scenario 1: Email Capture Pipeline
**Webhook** (Trigger) → **Resend** (Send Welcome) → **Supabase** (Insert Row) → **Slack** (Notify #growth)
When someone subscribes on your site, the webhook fires. Resend sends a branded welcome email. Supabase stores the subscriber with a timestamp. Slack notifies your team. Total time: under 2 seconds. Zero code.


Scenario 2: Content Publishing Autopilot
**Schedule** (Every Day 9am) → **Supabase** (Get Draft) → **Claude** (Polish Copy) → **CMS** (Publish Post) → **Twitter** (Post Thread)
Every morning, grab a draft from your content queue, have Claude refine the copy, publish to your CMS, and auto-post a Twitter thread. This turns a 30-minute daily task into a fully autonomous pipeline.


Scenario 3: Revenue Alert System
**Stripe** (Webhook) → **Filter** (amount > $50) → **Supabase** (Log Revenue) → **Slack** (Celebrate)
When Stripe processes a payment over $50, log it to your revenue table and send a celebration alert to Slack. The filter means small purchases flow silently while big wins get immediate visibility.


## The Data Mapping System

The most important concept in Make.com is **data mapping** — how you reference output from one module inside another. This is what makes the conveyor belt work.


Make.com — Data mapping in the Email Capture scenario

```
// Module 1 — Webhook receives this JSON from your website:
{ "email": "user@example.com", "name": "Alex" }

// Module 2 — Resend uses {{1.email}} to pull from Module 1:
To:      {{1.email}}   → becomes: user@example.com
Subject: "Welcome, {{1.name}}!"  → becomes: "Welcome, Alex!"

// Module 3 — Supabase also pulls from Module 1:
email:     {{1.email}}
name:      {{1.name}}
joined_at: {{now}}     → built-in: current timestamp

// Module 4 — Slack can reference ANY previous module:
Message: "New sub: {{1.name}} ({{1.email}})"
```


**Common mistake:** The number in `{{1.email}}` is the **module position**, not an array index. Module 1 is always your trigger. If you insert a new module between #2 and #3, all downstream references shift — Make.com handles this automatically, but understanding it prevents confusion when debugging.


## Advanced Modules: Router, Filter, Iterator

Basic scenarios are linear chains. Advanced scenarios use branching and looping to handle complex logic — still without writing code.


Module
What It Does
When to Use It


Router
Splits the flow into parallel paths. Each path gets its own filter condition.
Send different Slack messages for high-value vs. low-value payments. Route errors to a different channel than successes.


Filter
Stops the flow if a condition is not met. Data only passes through if the condition is true.
Only process payments over $50. Only send notifications during business hours. Skip duplicate emails.


Iterator
Takes an array and processes each item one at a time through downstream modules.
A webhook sends 10 line items — process each one separately. Loop through a list of emails to send individual messages.


Aggregator
Collects multiple items back into a single bundle after an Iterator.
After processing 10 line items individually, combine the results into one summary for Slack or a spreadsheet row.


## Error Handling: Never Fail Silently

The most dangerous automation is one that fails without telling you. Make.com gives you two tools to prevent silent failures:


!

**Error Handler Routes**
Right-click any module and add an error handler. This creates a parallel path that fires only when that module fails. Route errors to Slack, email, or a logging table. **Every production scenario should have error handlers on modules that call external APIs** — because external services fail, and you need to know when they do.


&#x2713;

**Incomplete Execution Queue**
When a scenario fails mid-execution, Make.com stores the failed run in the Incomplete Executions queue. You can inspect the data, fix the issue, and re-run the exact same execution. This means **no data is lost on failure** — you always get a second chance.


## Building Your First Scenario: Step by Step

The fastest way to learn Make.com is to build a simple three-module scenario. Here is the recommended starting point:


1. Create a new scenario and add a **Custom Webhook** module as the trigger
2. Make.com gives you a unique webhook URL — copy it
3. Add a **Supabase → Insert Row** module — map the webhook data to table columns
4. Add a **Slack → Post Message** module — compose a message using `{{1.email}}`
5. Click **Run Once** — then send a test POST to your webhook URL
6. Verify: check Supabase for the new row, check Slack for the notification


Terminal — Test your webhook with curl

```
# Send a test payload to your Make.com webhook
curl -X POST https://hook.make.com/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Alex"}'

# If successful, you should see:
# → A new row in your Supabase subscribers table
# → A Slack message saying "New sub: Alex (test@example.com)"
```


**Pro tip:** Always use **Run Once** to test before enabling scheduling. Check every module's output bubble (the green circle) to verify data flows correctly. Only turn on the scenario schedule once every module passes your manual test.


## Operations and Pricing

Make.com charges by **operations** — each module execution counts as one operation. A 4-module scenario run = 4 operations. Understanding this prevents billing surprises.


Plan
Ops/Month
Best For


Free
1,000
Learning, testing, low-volume automations (a 4-module scenario can run 250 times/month)


Core ($9/mo)
10,000
Active indie projects — enough for hundreds of daily automations


Pro ($16/mo)
10,000+
Priority execution, custom functions, full-text log search


### Quiz

**Q1: What does {{1.email}} mean in a Make.com scenario?**
    A. Send an email to module 1
  ✓ B. The email field from the output of module #1
    C. A variable named 1.email
    D. An error in the mapping
  *In Make.com, double curly braces reference data from other modules. The number is the module position in the scenario. {{1.email}} means grab the email field from the first module (usually your trigger).*

**Q2: What is the recommended first module type when building a Make.com scenario?**
    A. Supabase insert
    B. Filter logic
  ✓ C. A trigger — Webhook or Schedule
    D. Slack notification
  *Every scenario must start with a trigger — something that initiates the run. Either a Webhook (fires when an external event happens) or a Schedule (runs on a time interval). Other modules follow the trigger.*

**Q3: Why should you add error handlers to modules that call external APIs?**
    A. They speed up execution
  ✓ B. External services can fail — error handlers create parallel paths so failures notify you instead of failing silently
    C. They are required by Make.com for all scenarios
    D. They reduce operation costs
  *External APIs fail — timeouts, rate limits, downtime. An error handler creates a branching path that fires only on failure, routing the error to Slack or email so you always know when something breaks. Without it, failures are silent.*

**Q4: A 5-module scenario runs 20 times per day. How many monthly operations does it consume?**
    A. 20
    B. 100
  ✓ C. 3,000
    D. 5
  *Each module execution = 1 operation. A 5-module scenario running once = 5 operations. Running 20 times/day = 100 operations/day. Over 30 days = 3,000 operations/month. The free tier (1,000 ops) would not cover this — you would need the Core plan.*

**Q5: What is the purpose of the Router module?**
    A. It connects to your internet router
  ✓ B. It splits the flow into parallel conditional paths — different logic for different conditions
    C. It speeds up data transfer between modules
    D. It replaces the trigger module
  *The Router creates branching paths from a single point. Each branch can have its own filter condition — for example, one path for payments over $50 (send celebration) and another for all other payments (log silently). This enables conditional logic without code.*


### Make.com Flashcards

**Card 1:**
Front: What is the difference between a Webhook trigger and a Schedule trigger?
Back: Webhook: fires immediately when an external service sends a POST request (event-driven). Schedule: fires at a set time interval like every hour or every day at 9am (time-driven). Use webhooks for real-time reactions, schedules for batch operations.

**Card 2:**
Front: What does idempotency mean when designing Make.com scenarios?
Back: Running the same scenario multiple times with the same data produces the same result without side effects — like duplicate emails or double database inserts. Design scenarios to check for existing records before inserting.

**Card 3:**
Front: How do you reference data from module 3 inside module 5?
Back: Use {{3.fieldName}} syntax. The number is always the module position, and fieldName is the specific output field you want to reference from that module.

**Card 4:**
Front: What happens when a scenario fails mid-execution?
Back: Make.com stores the failed run in the Incomplete Executions queue. You can inspect the payload, fix the issue in your scenario, and re-run the exact same execution with the original data. No data is lost.

**Card 5:**
Front: What is a Router module and when do you use it?
Back: A Router splits scenario flow into parallel branches, each with its own filter condition. Use it when the same trigger needs different handling based on conditions — like high-value vs. low-value payments, or success vs. error paths.

**Card 6:**
Front: How are Make.com operations counted for billing?
Back: Each module execution = 1 operation. A 4-module scenario running once = 4 operations. A scenario with a Router that takes 2 branches counts all modules on both branches. Free tier gives 1,000 ops/month.


Lesson 3 of 10

Module 1
