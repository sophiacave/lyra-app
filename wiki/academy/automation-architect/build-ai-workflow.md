# Build AI Workflow

**Course:** Automation Architect
**Order:** 8
**Type:** builder
**Access:** Premium

---
[Automation Architect](/academy/automation-architect/)
  Lesson 8 of 9


  # Build AI Workflow

  Assemble a workflow from components: trigger, AI classify, filter, transform, and action. Then simulate data flowing through it.



    ## Workflow Design Principles

    Before building any workflow, you need to understand the design principles that separate reliable production systems from fragile scripts. These principles apply whether you are using Make.com, n8n, Zapier, or writing custom code.



        **Single Responsibility**
        Each step in your workflow should do exactly one thing. A step that classifies AND routes AND sends a notification is doing three things. Break it into three steps. When one fails, you know exactly where the problem is, and you can retry just that step without re-running the whole pipeline.


        **Data Contracts Between Steps**
        Define what data each step expects as input and what it produces as output. When Step 2 expects a `customer_email` field from Step 1, that is a contract. If Step 1 changes its output format, Step 2 breaks. Document these contracts and validate inputs at each step.


        **Fail Gracefully**
        Every step must handle failure. If the AI classifier returns an error, the workflow should not crash — it should route to a fallback (human review). If the email sender fails, save the message for retry. The question is never "will this fail?" but "what happens when it fails?"


        **Observability**
        Log every step's input, output, and execution time. You need to answer: "What happened to ticket #4521?" at any time. Without logging, you are debugging blind. Add a unique request ID that flows through every step so you can trace a single request across the entire pipeline.





    ## Common Workflow Patterns

    There are three fundamental patterns for organizing workflow steps. Most real workflows combine these patterns.



        **Sequential (Pipeline)**
        Steps run one after another. Step 2 waits for Step 1 to finish. Each step's output feeds into the next step's input. This is the simplest pattern — a straight line from trigger to final action.
        Example: Receive email → Extract intent → Create ticket → Notify team


        **Parallel (Fan-out)**
        Multiple steps run simultaneously. Use this when steps are independent of each other — sending an email while also updating a database while also logging to analytics. Parallel execution reduces total workflow time.
        Example: New order → [Send confirmation email | Update inventory | Notify warehouse] (all at once)


        **Conditional (Router)**
        Data is routed to different branches based on conditions. An IF/ELSE gate that sends data down different paths. Common in AI workflows where the classification result determines the next action.
        Example: Classify ticket → IF billing issue → Finance team | IF technical → Engineering | IF feedback → Product team





    ## Workflow Example: n8n-Style Automation

    Here is how you would build a simple webhook-to-Slack automation using n8n concepts in code. This demonstrates the sequential pattern with error handling — the same logic used by visual automation platforms like Make.com and n8n.


Python — Simple webhook-to-Slack workflow with retry logic

```
import httpx, time, json

class WorkflowStep:
    """Base class for all workflow steps."""
    def execute(self, data: dict) -> dict:
        raise NotImplementedError

class ValidatePayload(WorkflowStep):
    """Step 1: Validate incoming webhook data."""
    def execute(self, data: dict) -> dict:
        required = ["event", "user", "message"]
        missing = [f for f in required if f not in data]
        if missing:
            raise ValueError(f"Missing fields: {missing}")
        return data

class SendSlackMessage(WorkflowStep):
    """Step 2: Post to Slack with retry logic."""
    def execute(self, data: dict) -> dict:
        for attempt in range(3):
            try:
                resp = httpx.post(
                    "https://hooks.slack.com/services/YOUR/WEBHOOK",
                    json={"text": f"{data['user']}: {data['message']}"},
                    timeout=10.0
                )
                resp.raise_for_status()
                return {**data, "slack_sent": True}
            except httpx.HTTPError:
                time.sleep(2 ** attempt)
        return {**data, "slack_sent": False, "error": "All retries failed"}

def run_pipeline(payload: dict):
    """Execute steps sequentially."""
    steps = [ValidatePayload(), SendSlackMessage()]
    data = payload
    for step in steps:
        print(f"Running: {step.__class__.__name__}")
        data = step.execute(data)
    return data
```





    ## AI in Workflows: When and Why

    Not every workflow needs AI. Traditional rules engines work perfectly for deterministic logic — if order total > $100, apply discount. AI adds value in specific scenarios where rules-based approaches fall short.



        **Use AI when: input is unstructured**
        Free-text emails, chat messages, social media posts. You cannot write a rule for every possible way a customer might phrase a billing complaint. AI generalizes from patterns — it can classify intent even for phrasings it has never seen before.


        **Use AI when: categories are fuzzy**
        "Is this email a complaint, a question, or feedback?" often has no clear answer. AI assigns probabilities — 70% complaint, 20% question, 10% feedback — and the confidence score lets your workflow decide whether to act automatically or escalate to a human.


        **Use rules when: logic is deterministic**
        If the condition is clear-cut — order total above a threshold, user in a specific country, timestamp within business hours — use a simple IF/ELSE. Rules are faster, cheaper, and 100% predictable. AI adds latency and cost for no benefit on deterministic decisions.





    ## AI Workflow Components

    An AI workflow is a pipeline of components that process data in sequence. Each component has a specific role: a **trigger** receives incoming data, an **AI classifier** analyzes intent, a **filter** gates by confidence, a **transform** reshapes the output, and an **action** delivers the result. The code example below shows exactly how these components connect in production.



    ## The Code Behind the Canvas

    Here is a complete AI workflow script — receive data, classify it with an LLM, filter by confidence, transform the output, and route it to the right team:


Python — Complete AI classification workflow

```
import httpx, json

def ai_classify(text: str, api_key: str) -> dict:
    """Call Claude to classify incoming support text."""
    response = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 200,
            "messages": [{"role": "user", "content": (
                f"Classify this support ticket. Return JSON with "
                f"'intent', 'team', and 'confidence' (0-100).\n\n{text}"
            )}]
        },
        timeout=30.0
    )
    return json.loads(response.json()["content"][0]["text"])

def run_workflow(ticket: dict, api_key: str):
    """Trigger → AI Classify → Filter → Transform → Action"""

    # Step 1: AI Classify
    result = ai_classify(ticket["text"], api_key)
    print(f"AI classified: {result['intent']} (confidence: {result['confidence']}%)")

    # Step 2: Filter — only act on high-confidence results
    if result["confidence"] 80:
        print("Low confidence — routing to human review")
        return {"action": "human_review", "ticket": ticket}

    # Step 3: Transform — reshape for the action step
    routed = {
        "team": result["team"],
        "priority": "high" if result["confidence"] > 95 else "normal",
        "subject": ticket["text"][:80],
        "customer": ticket["email"]
    }

    # Step 4: Action — send to the right team
    print(f"Routed to {routed['team']} (priority: {routed['priority']})")
    return {"action": "routed", **routed}

# Example: incoming support ticket triggers the workflow
ticket = {"email": "customer@acme.co", "text": "I can't log in to my account"}
run_workflow(ticket, api_key="sk-ant-...")
```




### AI Workflow Components

**Card 1:**
Front: Webhook Trigger
Back: Receives incoming HTTP data to start the pipeline. Every workflow begins with a trigger.

**Card 2:**
Front: AI Classify
Back: Claude reads the incoming content and assigns an intent label with a confidence score.

**Card 3:**
Front: Filter
Back: A condition gate — only passes data that meets the threshold. Example: confidence > 80%.

**Card 4:**
Front: Transform
Back: Reshapes the data structure for the next step. Example: extract team name and priority from the AI output.

**Card 5:**
Front: Send to Team (action)
Back: The final step — routes the processed data to the correct destination, creates a ticket, sends a notification.



### Quiz

**Q1: What is the purpose of the Filter step in an AI workflow?**
    A. To classify the content
    B. To receive incoming data
  ✓ C. To only pass data that meets a confidence threshold
    D. To format the final output
  *The Filter step acts as a condition gate — it lets through only the data that meets your criteria, such as AI confidence above 80%.*

**Q2: What does the Transform step do?**
    A. Sends data to the team
    B. Classifies intent
  ✓ C. Reshapes the data structure for the next step
    D. Receives the webhook payload
  *Transform reshapes data — it takes the AI output and formats it into exactly what the action step needs, like extracting team name and priority.*

**Q3: Why add a Filter between AI Classify and the action?**
    A. To make the workflow longer
  ✓ B. To prevent low-confidence misclassifications from being acted upon automatically
    C. To increase processing speed
    D. To store data in a database
  *Filtering by confidence prevents the workflow from acting on uncertain AI outputs. Low-confidence results can be sent to a human review queue instead.*
