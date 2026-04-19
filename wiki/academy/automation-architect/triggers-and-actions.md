# Triggers and Actions

**Course:** Automation Architect
**Order:** 1
**Type:** lesson
**Access:** Free

---
[Automation Architect](/academy/automation-architect/)
  Lesson 1 of 9


  # Triggers & Actions

  Every automation has two parts: something that starts it (the trigger) and something that happens because of it (the action). Master this pattern and you can automate anything.



    ## The Trigger-Action Pattern

    Every automation in the world — from a Gmail filter to a million-dollar enterprise workflow — follows one pattern:



        &#x26A1;
        **TRIGGER**
        Something happens

      →

        &#x1F4E6;
        **PAYLOAD**
        Data flows through

      →

        &#x2699;&#xFE0F;
        **ACTION**
        Something is done



    The **trigger** is the "when" — the event that starts the automation. The **payload** is the data that flows from trigger to action. The **action** is the "then" — what your automation does with that data.



    ## Three Types of Triggers




        **&#x1F517; Webhook Trigger**
        Fires instantly when an external system sends data to your URL. Real-time — zero delay. Example: Stripe sends a webhook when a payment succeeds, your automation creates the customer account.
        Best for: Form submissions, payment events, GitHub commits, Slack messages — any event from an external service.


        **&#x23F0; Schedule Trigger**
        Fires on a time-based schedule — every hour, every day at 9 AM, every Monday. Uses cron expressions under the hood. Example: Every morning at 8 AM, pull yesterday's sales data and email a summary to the team.
        Best for: Reports, data sync, cleanup tasks, digest emails — anything that runs on a clock.


        **&#x26A1; Event Trigger**
        Fires when something happens inside your own system — a database row changes, a user signs up, a file is uploaded. Example: When a new user signs up, send a welcome email and create their onboarding checklist.
        Best for: Internal events — user signups, status changes, threshold alerts, system health checks.





    ## Understanding Payloads

    The payload is the data that flows from trigger to action. Every trigger produces a payload — it is what the action works with. Here is what a real webhook payload looks like:


      // Stripe sends this when a payment succeeds:

      {

        "type": "payment_intent.succeeded",

        "data": {

          "customer_email": "jane@acme.co",

          "amount": 4900,

          "currency": "usd"

        }

      }


    Your action reads this payload and acts on it — save the customer to a database, send a receipt email, update a dashboard. The payload is the bridge between trigger and action.

    Here is how you set up a webhook listener in Python that receives that Stripe payload and routes it to the correct action:


Python — Webhook trigger with payload routing

```
from flask import Flask, request, jsonify

app = Flask(__name__)

# Define which action runs for each trigger event type
ACTIONS = {
    "payment_intent.succeeded": "create_account",
    "customer.subscription.deleted": "revoke_access",
    "invoice.payment_failed": "send_retry_email",
}

@app.route("/webhook/stripe", methods=["POST"])
def stripe_webhook():
    # The payload arrives as JSON in the request body
    payload = request.get_json()
    event_type = payload.get("type", "unknown")

    # Route to the correct action based on trigger type
    action = ACTIONS.get(event_type)
    if action:
        print(f"Trigger: {event_type} → Action: {action}")
        dispatch_action(action, payload["data"])
    else:
        print(f"Unhandled event: {event_type}")

    return jsonify({"received": True}), 200

def dispatch_action(action: str, data: dict):
    """Execute the action with the trigger's payload data."""
    if action == "create_account":
        email = data["customer_email"]
        print(f"Creating account for {email}")
    elif action == "revoke_access":
        print(f"Revoking access for {data['customer_email']}")
    elif action == "send_retry_email":
        print(f"Sending payment retry email to {data['customer_email']}")
```





    ## Real-World Automation Examples




        E-COMMERCE
        **Trigger:** New order placed → **Action:** Send confirmation email + update inventory + notify warehouse


        SUPPORT
        **Trigger:** Customer submits ticket → **Action:** AI classifies priority + routes to correct team + sends acknowledgment


        DEVOPS
        **Trigger:** Server CPU > 90% for 5 minutes → **Action:** Scale up instance + alert on-call engineer + log incident


        MARKETING
        **Trigger:** User signs up for free trial → **Action:** Add to email sequence + create CRM record + notify sales if enterprise domain





    ## When Things Go Wrong

    Real automations fail. Knowing the failure modes makes you a better architect:



        **Trigger fires twice**
         — Webhooks can be retried by the sender. Your action needs to be *idempotent* (safe to run multiple times). Example: check if the customer already exists before creating a duplicate.


        **Action fails mid-execution**
         — The email sent, but the database save failed. You need error handling and retry logic. Some systems use a *dead letter queue* to save failed messages for later inspection.


        **Payload format changes**
         — The external service updates their API and the payload structure changes. Your action breaks because it expects fields that no longer exist. Always validate payload structure before acting on it.





    ## Trigger Design Patterns

    Beyond the three trigger types, there are four design patterns that determine how triggers behave in production. Understanding these patterns helps you choose the right approach for reliability, latency, and resource usage.



        **Time-Based (Polling)**
        Your system checks for new data at regular intervals using a cron schedule. Simple but introduces delay — if you poll every 5 minutes, events can wait up to 5 minutes before processing. Best for batch operations where real-time is not critical: daily reports, hourly data sync, nightly cleanup jobs.
        Trade-off: simple to implement, but wastes resources when nothing changes and adds latency.


        **Event-Based (Push)**
        Your system reacts to events as they happen within your own infrastructure. A database trigger fires when a row changes. A message queue consumer processes events as they arrive. Zero delay, no wasted resources. Best for internal system events: user signups, order status changes, inventory updates.
        Trade-off: requires infrastructure (message queues, database triggers), but gives real-time response.


        **Condition-Based (Threshold)**
        A monitor watches a metric and fires when it crosses a threshold. CPU usage exceeds 90%. Revenue drops below a target. Error rate spikes above 5%. The trigger is not a single event but a state change — something crossed a line. Best for alerting, auto-scaling, and business rules.
        Trade-off: needs continuous monitoring, but catches problems that discrete events miss.


        **Webhook-Based (External Push)**
        An external service sends an HTTP POST to your URL when something happens in their system. Stripe sends a webhook when a payment succeeds. GitHub sends one when code is pushed. You do not poll — the external system tells you. Real-time with no wasted requests. Best for third-party integrations.
        Trade-off: you depend on the external service's reliability and must handle retries (webhooks can fire twice).





### Triggers vs Actions

**Card 1:**
Front: What is a Trigger?
Back: An event that starts an automation — the "when" that fires before any actions execute. Three types: webhook (real-time), schedule (time-based), event (internal system).

**Card 2:**
Front: What is an Action?
Back: The task performed after a trigger fires. Can be anything: send email, save to database, call API, send notification, create record, update dashboard.

**Card 3:**
Front: Webhook Trigger
Back: Receives real-time HTTP POST data from an external system. Zero delay. Used for: payments, form submissions, GitHub events, Slack messages.

**Card 4:**
Front: Schedule Trigger
Back: Fires on a time-based schedule using cron expressions. Used for: daily reports, data sync, cleanup tasks, digest emails.

**Card 5:**
Front: Event Trigger
Back: Fires when something happens inside your own system — user signup, status change, threshold crossed. Internal, not from external services.

**Card 6:**
Front: Payload
Back: The structured data that flows from trigger to action. Contains the event details — who, what, when. The action reads the payload to know what to do.

**Card 7:**
Front: Idempotent Action
Back: An action that produces the same result even if run multiple times. Critical because webhooks can fire twice. Example: check if record exists before creating.

**Card 8:**
Front: Dead Letter Queue
Back: Where failed messages go when an action cannot process them. Preserves data for manual inspection and retry instead of losing it forever.



### Quiz

**Q1: What is the role of a trigger in automation?**
    A. Transform data into a new format
  ✓ B. Start the automation when an event occurs
    C. Store the result of an action
    D. Connect two APIs together
  *A trigger is the event that kicks off your automation — nothing runs until the trigger fires.*

**Q2: Which of these is an action, not a trigger?**
    A. New email arrives
    B. Form submitted
    C. Schedule fires
  ✓ D. Send Slack notification
  *Send Slack notification is what happens after a trigger — it is an action. The others are events that can start a workflow.*

**Q3: A webhook trigger listens for what type of data?**
    A. CSV files
  ✓ B. Incoming HTTP POST requests
    C. Database queries
    D. Scheduled cron jobs
  *A webhook is a URL that receives real-time HTTP POST data when an external event occurs.*

**Q4: Why should automation actions be idempotent?**
    A. It makes them run faster
  ✓ B. Webhooks can fire twice, so the action must be safe to repeat
    C. Idempotent actions use less memory
    D. It is required by all automation platforms
  *Webhooks can be retried by the sender, causing your trigger to fire multiple times. An idempotent action (like checking before creating) prevents duplicate records or double-sends.*

**Q5: What is a dead letter queue?**
    A. A queue for deleted emails
  ✓ B. A storage location for messages that failed to process
    C. A type of webhook trigger
    D. An action that sends error notifications
  *A dead letter queue stores messages that could not be processed successfully. This preserves the data for manual inspection and retry instead of losing it.*
