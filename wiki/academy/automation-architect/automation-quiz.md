# Automation Quiz

**Course:** Automation Architect
**Order:** 3
**Type:** quiz
**Access:** Free

---
[Automation Architect](/academy/automation-architect/)
  Lesson 3 of 9


  # Automation Quiz

  Test your knowledge of triggers, actions, webhooks, and cron schedules.



    ## Course Recap: Automation Fundamentals

    Review these core concepts before the quiz. Every question draws directly from these fundamentals.

    ### Automation Triggers

    A trigger is the event that starts an automation. Nothing happens until the trigger fires. There are three fundamental types, and choosing the right one determines the reliability and responsiveness of your entire workflow.



        **Webhook Trigger**
        Real-time. An external system sends an HTTP POST to your URL the instant an event occurs. Zero delay. Used for: payment events, form submissions, GitHub commits, Slack messages.


        **Schedule Trigger**
        Time-based. Fires on a cron schedule — every hour, every day at 9 AM, every Monday at noon. Used for: daily reports, data sync, cleanup tasks, digest emails.


        **Event Trigger**
        Internal. Fires when something changes in your own system — a database row updates, a user signs up, a file is uploaded. Used for: user onboarding, status changes, threshold alerts.



    ### Workflow Design

    A workflow is a sequence of steps that processes data from trigger to final action. Good workflow design means thinking about data flow, error handling, and what happens when things go wrong.



        **Trigger → Payload → Action** — the fundamental pattern. The trigger produces a payload (structured data), and the action consumes it.


        **Multi-step workflows** chain actions together. Step 1's output becomes Step 2's input. Each step transforms the data for the next.


        **Conditional branches** route data based on rules. Example: if order total > $100, send to priority queue; otherwise, standard queue.



    ### API Integration

    APIs are how your automation talks to external services. Every automation platform is fundamentally an API orchestrator — it calls APIs on your behalf in a sequence you define.



        **REST APIs** use HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.


        **Authentication** is required for most APIs. API keys, OAuth tokens, and JWTs are the three main patterns.


        **Rate limits** cap how many requests you can make per time window. Automations in loops can hit limits fast — always add delays.



    ### Error Handling

    Production automations fail. The difference between amateur and professional automation is how failures are handled.



        **Idempotency** — actions must be safe to run multiple times. Webhooks can fire twice. Your action should check before creating duplicates.


        **Retry with backoff** — transient failures (network blips, rate limits) should be retried with exponential backoff: 1s, 2s, 4s, 8s.


        **Dead letter queue** — messages that fail after all retries go to a holding queue for manual inspection. Data is never lost.


        **Payload validation** — always validate the incoming data structure before acting on it. External APIs can change their payload format without warning.



    ### Production Patterns

    These patterns separate hobbyist automations from production-grade systems.



        **Logging** — log every trigger event, every action result, and every error. Without logs, debugging production failures is blind guessing.


        **Monitoring** — set up alerts for failure rates, execution times, and queue depths. Know when something breaks before your users tell you.


        **Testing** — test with sample data in staging before going live. Run the full pipeline end-to-end, including error cases.


        **Versioning** — when you update a workflow, keep the old version running until the new one is verified. Never do a hard cutover.





    ## Cron Expression Quick Reference

    Cron expressions control schedule triggers. The format has five fields: `minute hour day-of-month month day-of-week`.


Common Cron Expressions

```
# Every minute
* * * * *

# Every day at midnight
0 0 * * *

# Every Monday at 9 AM
0 9 * * 1

# Every 5 minutes
*/5 * * * *

# First day of every month at noon
0 12 1 * *

# Weekdays at 8:30 AM
30 8 * * 1-5
```





    ## Webhook Security Essentials

    Webhooks are publicly accessible URLs. Anyone who discovers the URL can send fake data to your automation. Securing your webhooks is not optional — it prevents attackers from triggering false actions in your system.



        **Verify webhook signatures**
        Most services (Stripe, GitHub, Slack) sign their webhook payloads with a secret key. Your code should verify the signature before processing the data. If the signature does not match, reject the request — it was not sent by the real service.


        **Use HTTPS only**
        Never expose a webhook over plain HTTP. Without encryption, anyone on the network path can read the payloads, which may contain customer data, financial information, or authentication tokens.


        **Check timestamps**
        Webhook payloads include a timestamp. Reject payloads older than 5 minutes — they could be replay attacks where someone captured a valid webhook and resent it later to trigger duplicate actions.


        **Respond fast, process async**
        Return a 200 response immediately, then process the payload in a background job. If your webhook takes too long to respond, the sender will retry — causing duplicate processing. Accept fast, process later.





    ## Automation Architecture Patterns

    As your automations grow from single workflows to interconnected systems, these architecture patterns keep everything manageable.



        **Event-Driven Architecture**
        Systems communicate by emitting and consuming events. When a payment succeeds, it emits a "payment.succeeded" event. Multiple systems can react independently — billing creates an invoice, support creates an onboarding ticket, analytics logs the conversion. Each consumer is decoupled from the others.


        **Message Queue Pattern**
        A queue sits between producer and consumer. The producer adds messages to the queue, the consumer processes them at its own pace. This handles traffic spikes — if 1000 orders arrive in one second, the queue absorbs them and the consumer processes them steadily. No data is lost.


        **Circuit Breaker Pattern**
        If an external API fails repeatedly, the circuit breaker "opens" and stops sending requests for a cooldown period. This prevents your automation from hammering a broken service and gives it time to recover. After the cooldown, the breaker "half-opens" and sends a test request to check if the service is back.





    ## Automation Debugging Checklist

    When an automation stops working, follow this systematic approach instead of guessing.



        1
        **Check if the trigger fired.** Look at your logs. If the trigger never fired, the problem is upstream — the event never happened, the webhook URL changed, or the cron schedule is wrong.


        2
        **Inspect the payload.** If the trigger fired, check what data it produced. Did the payload structure change? Are required fields missing? Is the data in the expected format?


        3
        **Test each action in isolation.** Run each step manually with the payload data. Find which specific step is failing and what error it produces.


        4
        **Check external dependencies.** Is the API you are calling still up? Did they change their endpoint, authentication, or rate limits? Check their status page and changelog.


        5
        **Review recent changes.** Did someone update the workflow? Did a dependency get upgraded? Did an API key expire? Most production failures trace back to a recent change.





### Quiz

**Q1: What is a trigger in automation?**
    A. A function that transforms data
  ✓ B. An event that starts an automation
    C. A database query
    D. An API response
  *A trigger is the event that kicks off your automation — it is the when that fires before any actions execute.*

**Q2: Which cron expression runs a task every day at midnight?**
    A. * * * * *
  ✓ B. 0 0 * * *
    C. 0 12 * * 1
    D. */5 * * * *
  *0 0 * * * means minute 0, hour 0 (midnight), every day, every month, every day of week.*

**Q3: What does a webhook do?**
    A. Polls a server every 5 seconds
    B. Sends a scheduled email
  ✓ C. Receives real-time data via HTTP POST
    D. Stores data in a cache
  *A webhook is a URL that receives real-time HTTP POST requests when an event occurs in an external system.*

**Q4: In a trigger-action pair, what flows between them?**
    A. HTML pages
  ✓ B. Data (the event payload)
    C. CSS styles
    D. User credentials
  *Data flows from trigger to action. The trigger produces a payload (event data) that the action consumes and acts upon.*

**Q5: Which is NOT a common automation action?**
    A. Send an email notification
    B. Write to a database
    C. Call an external API
  ✓ D. Listen for a webhook
  *Listening for a webhook is a trigger, not an action. Actions are the things that happen after a trigger fires.*



### Key Automation Concepts

**Card 1:**
Front: Trigger
Back: The event that starts an automation — the when. Examples: new email, form submitted, schedule fires.

**Card 2:**
Front: Action
Back: The task executed after a trigger fires. Examples: send email, save to DB, call API.

**Card 3:**
Front: Webhook
Back: A URL endpoint that receives real-time HTTP POST data from external systems.

**Card 4:**
Front: Cron expression 0 0 * * *
Back: Runs every day at midnight. minute=0, hour=0, day=any, month=any, weekday=any.

**Card 5:**
Front: Event payload
Back: The structured data produced by a trigger and passed to the action for processing.
