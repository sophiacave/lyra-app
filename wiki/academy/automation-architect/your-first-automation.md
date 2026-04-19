# Your First Automation

**Course:** Automation Architect
**Order:** 2
**Type:** lesson
**Access:** Free

---
[Automation Architect](/academy/automation-architect/)
  Lesson 2 of 9


  # Your First Automation

  Build a real automation from scratch — trigger, action, error handling, and testing. No toy examples. Production patterns from line one.



    ## What You Are Building

    A webhook automation that receives form submissions, validates the data, saves it to a database, and sends a confirmation email. This is the most common automation pattern in production — you will use variations of it hundreds of times.



        &#x1F517;
        **WEBHOOK**
        Form submitted

      →

        &#x1F6E1;
        **VALIDATE**
        Check payload

      →

        &#x1F4BE;
        **SAVE**
        Write to DB

      →

        &#x1F4E7;
        **NOTIFY**
        Send email





    ## Step 1: The Webhook Trigger

    Every automation starts with a trigger. A webhook is a URL that waits for incoming HTTP POST requests. When data arrives, your code runs. Here is a webhook handler in Node.js using Express:


      // server.js — Your first automation

      const express = require('express');

      const app = express();

      app.use(express.json());



      // TRIGGER: Webhook receives form data

      app.post('/webhook/form-submitted', async (req, res) => {

        const payload = req.body;



        // Acknowledge receipt IMMEDIATELY (within 3 seconds)

        // Process in the background — never block the webhook

        res.status(200).json({ received: true });



        // Process asynchronously

        processFormSubmission(payload).catch(err => {

          console.error('Automation failed:', err);

          saveToDeadLetterQueue(payload, err);

        });

      });



      **Why respond immediately?**
      Webhook senders (Stripe, Zapier, GitHub) expect a response within 3-5 seconds. If you do not respond in time, they will retry — causing duplicate processing. Always acknowledge first, process second.




    ## Step 2: Validate the Payload

    Never trust incoming data. Validate every field before processing. A missing email address should not crash your entire pipeline.


      function validatePayload(payload) {

        const errors = [];



        if (!payload.email) errors.push('Missing email');

        if (!payload.name)  errors.push('Missing name');

        if (payload.email && !payload.email.includes('@')) {

          errors.push('Invalid email format');

        }



        return {

          valid: errors.length === 0,

          errors

        };

      }




    ## Step 3: Save to Database

    The action — what your automation actually does. This example uses Supabase, but the pattern works with any database:


      async function processFormSubmission(payload) {

        // 1. Validate

        const validation = validatePayload(payload);

        if (!validation.valid) {

          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);

        }



        // 2. Idempotency check — prevent duplicate processing

        const { data: existing } = await supabase

          .from('submissions')

          .select('id')

          .eq('email', payload.email)

          .eq('submitted_at', payload.submitted_at)

          .single();



        if (existing) {

          console.log('Duplicate detected, skipping');

          return;

        }



        // 3. Save to database

        const { error } = await supabase

          .from('submissions')

          .insert({

            name: payload.name,

            email: payload.email,

            message: payload.message,

            submitted_at: payload.submitted_at

          });



        if (error) throw error;



        // 4. Send confirmation email

        await sendConfirmation(payload.email, payload.name);

      }



      **The idempotency check is critical**
      Webhooks can fire twice (network retry, timeout, server restart). Without the duplicate check on line 8-13, you would save the same submission twice and send two confirmation emails. Always check before inserting.




    ## Step 4: Error Handling & Dead Letter Queue

    Production automations fail. The database goes down. The email API rate-limits you. Your code needs to handle every failure without losing data:


      async function saveToDeadLetterQueue(payload, error) {

        // Save failed messages for retry later

        await supabase.from('dead_letter_queue').insert({

          payload: JSON.stringify(payload),

          error_message: error.message,

          failed_at: new Date().toISOString(),

          retry_count: 0,

          status: 'pending'

        });

      }



      // Retry failed messages (run on a schedule, e.g. every 10 min)

      async function retryFailedMessages() {

        const { data: failed } = await supabase

          .from('dead_letter_queue')

          .select('*')

          .eq('status', 'pending')

          .lt('retry_count', 3);



        for (const msg of failed) {

          try {

            await processFormSubmission(JSON.parse(msg.payload));

            await supabase.from('dead_letter_queue')

              .update({ status: 'resolved' })

              .eq('id', msg.id);

          } catch (err) {

            await supabase.from('dead_letter_queue')

              .update({ retry_count: msg.retry_count + 1 })

              .eq('id', msg.id);

          }

        }

      }




    ## Step 5: Testing Your Automation

    Never deploy without testing. Here is how to test each layer of your automation — from unit tests to end-to-end:



        **Unit Test: Validation**

          // test/validation.test.js

          test('rejects missing email', () => {

            const result = validatePayload({ name: 'Alice' });

            expect(result.valid).toBe(false);

            expect(result.errors).toContain('Missing email');

          });



          test('accepts valid payload', () => {

            const result = validatePayload({

              name: 'Alice',

              email: 'alice@example.com'

            });

            expect(result.valid).toBe(true);

          });




        **Integration Test: Full Pipeline**

          // Test with cURL — send a real request to your webhook

          curl -X POST http://localhost:3000/webhook/form-submitted \

            -H "Content-Type: application/json" \

            -d '{"name":"Test User","email":"test@example.com","message":"Hello"}'

        Then check: Did the database get a new row? Did the dead letter queue stay empty? Was the email sent?



        **Failure Test: What Breaks?**

          // Send invalid data — does validation catch it?

          curl -X POST http://localhost:3000/webhook/form-submitted \

            -H "Content-Type: application/json" \

            -d '{"name":"No Email User"}'



          // Send the same payload twice — does idempotency work?

          // Second call should be silently skipped, no duplicate row






    ## The Five Failure Modes

    Every automation you build will encounter these failures. Knowing them means you design for them from day one:



        **1. Duplicate triggers**
         — Webhook fires twice due to timeout/retry. **Fix:** Idempotency check before processing. Use a unique key (email + timestamp) to detect duplicates.


        **2. Partial failure**
         — Database save succeeds but email send fails. **Fix:** Each step should be independently retriable. Save state after each step so retry knows where to resume.


        **3. Invalid payload**
         — Missing fields, wrong types, unexpected values. **Fix:** Validate immediately. Reject bad data before it touches your database.


        **4. Downstream service outage**
         — The email API or database is down. **Fix:** Dead letter queue preserves the message. Scheduled retry picks it up when the service recovers.


        **5. Payload format change**
         — The external service updates their API. Fields you depend on no longer exist. **Fix:** Validate payload structure, not just individual fields. Log unexpected shapes for debugging.





    ## The Complete Script in Python

    Everything above — webhook, validation, database, email, error handling — combined into a single production-ready Python automation. This is the pattern you will reuse for every webhook automation you build:


Python — Complete form-submission automation

```
from flask import Flask, request, jsonify
from supabase import create_client
import os, smtplib
from email.message import EmailMessage

app = Flask(__name__)
db = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])

def validate(payload: dict) -> list:
    """Return list of errors. Empty list = valid."""
    errors = []
    if not payload.get("email"):
        errors.append("Missing email")
    elif "@" not in payload["email"]:
        errors.append("Invalid email")
    if not payload.get("name"):
        errors.append("Missing name")
    return errors

def send_email(to: str, name: str):
    msg = EmailMessage()
    msg["Subject"] = "We got your submission!"
    msg["To"] = to
    msg.set_content(f"Hi {name}, thanks for reaching out.")
    with smtplib.SMTP("smtp.example.com", 587) as s:
        s.starttls()
        s.send_message(msg)

@app.route("/webhook/form", methods=["POST"])
def handle_form():
    payload = request.get_json()

    # 1. Validate
    errors = validate(payload)
    if errors:
        return jsonify({"errors": errors}), 400

    # 2. Idempotency check
    existing = db.table("submissions").select("id") \
        .eq("email", payload["email"]).execute()
    if existing.data:
        return jsonify({"status": "duplicate"}), 200

    # 3. Save + notify (with error recovery)
    try:
        db.table("submissions").insert(payload).execute()
        send_email(payload["email"], payload["name"])
    except Exception as e:
        db.table("dead_letter_queue").insert({
            "payload": payload, "error": str(e)
        }).execute()

    return jsonify({"received": True}), 200
```





    ## Putting It All Together

    Every automation you build follows the same three decisions: (1) pick a trigger — what event starts the workflow, (2) pick an action — what the automation does with the data, and (3) connect them with validation, error handling, and idempotency in between. The code above gives you the complete production pattern for the most common case: webhook trigger with database save and email notification.



  ## Production Checklist

  Before deploying any automation to production, verify every item:



      &#x2713; Webhook responds within 3 seconds (acknowledge first, process async)


      &#x2713; Payload validation rejects bad data before any processing


      &#x2713; Idempotency check prevents duplicate processing


      &#x2713; Dead letter queue catches all failures — no data lost


      &#x2713; Retry logic with max attempts (3 retries, then stop)


      &#x2713; Integration test passes with real HTTP request


      &#x2713; Failure test passes — bad data handled gracefully




### Production Automation Patterns

**Card 1:**
Front: Why respond to webhooks immediately?
Back: Webhook senders expect a response within 3-5 seconds. If you do not respond in time, they retry — causing duplicate processing. Always acknowledge first, process in the background.

**Card 2:**
Front: Idempotency
Back: An operation that produces the same result even if executed multiple times. Check for existing records (by unique key) before inserting to prevent duplicates from webhook retries.

**Card 3:**
Front: Dead letter queue
Back: A storage location for messages that failed processing. Preserves the original payload and error details for manual inspection and automated retry.

**Card 4:**
Front: Payload validation
Back: Check that all required fields exist and have correct types BEFORE processing. Reject invalid data at the gate — do not let it reach your database.

**Card 5:**
Front: Partial failure
Back: When step 3 of 5 succeeds but step 4 fails. Each step should be independently retriable. Save state after each step so retry knows where to resume.

**Card 6:**
Front: Exponential backoff
Back: A retry strategy that waits progressively longer between attempts (1s, 2s, 4s, 8s). Prevents hammering a struggling service while it recovers.

**Card 7:**
Front: Integration testing an automation
Back: Send a real HTTP POST to your webhook with test data. Then verify: database row created? Email sent? Dead letter queue empty? Duplicates handled?

**Card 8:**
Front: The three test layers
Back: (1) Unit test: validate individual functions like payload validation. (2) Integration test: send real HTTP request, check full pipeline. (3) Failure test: send bad data, verify graceful handling.


### Quiz

**Q1: Why should a webhook handler respond with 200 before processing the data?**
    A. To make the response faster for users
  ✓ B. Because webhook senders retry if they do not get a response within 3-5 seconds
    C. Because 200 is the only valid status code
    D. To save server memory
  *Webhook senders like Stripe and GitHub expect a response within seconds. No response = retry = duplicate processing. Always acknowledge receipt immediately, then process asynchronously.*

**Q2: What is an idempotency check?**
    A. A security scan of the payload
    B. Verifying the webhook URL is correct
  ✓ C. Checking if this exact payload was already processed to prevent duplicates
    D. A test that runs after deployment
  *An idempotency check queries your database for an existing record with the same unique key (like email + timestamp). If found, skip processing. This prevents duplicates from webhook retries.*

**Q3: A webhook automation saves to the database successfully but fails to send the email. What should happen?**
    A. Delete the database record and start over
  ✓ B. Save the failure to a dead letter queue for retry
    C. Ignore the email failure — database is enough
    D. Crash the entire server to alert the developer
  *This is a partial failure. The dead letter queue preserves the original payload so a scheduled retry job can attempt the email again without re-saving to the database.*

**Q4: Which is NOT a good practice for production automations?**
    A. Validate payloads before processing
    B. Respond to webhooks immediately
  ✓ C. Process data synchronously inside the webhook handler and block until done
    D. Use a dead letter queue for failures
  *Processing synchronously blocks the webhook response. If processing takes more than 3-5 seconds, the sender retries. Always respond immediately and process asynchronously.*

**Q5: What should you test BEFORE deploying an automation?**
    A. Only that the happy path works
  ✓ B. Validation, full pipeline, AND failure scenarios
    C. Only the database connection
    D. Only the email sending
  *Test all three layers: unit tests for validation, integration tests for the full pipeline with real HTTP requests, and failure tests to verify graceful error handling.*
