# Integration Patterns

**Course:** Building AI-Powered Workflows
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[← Back to Course](/academy/ai-powered-workflows/)
  Lesson 7 of 10


  # Integration Patterns

  Your tools don't live in isolation. Learn to make them talk to each other.


  ### What You'll Learn


    - How APIs, webhooks, and middleware connect your tools

    - The hub-and-spoke vs. point-to-point integration models

    - Working with authentication, rate limits, and API keys

    - When to use no-code connectors vs. custom integrations




  The Landscape
  ## Every Tool Is an Island (Until You Build Bridges)

  Your email lives in one tool. Your CRM in another. Your project management in a third. Your analytics in a fourth. Each one is powerful on its own, but the real magic happens when they share data. Integration is bridge-building — connecting islands so information flows freely between them.
  The good news: most modern tools are built to connect. The challenge is choosing the right connection pattern for your needs.


  Architecture
  ## Two Integration Models



    **Point-to-Point:** Tool A connects directly to Tool B. Simple for two tools. But with 5 tools, you have 10 connections. With 10 tools, you have 45. It becomes spaghetti fast. Best for: simple, two-tool workflows.
    **Hub-and-Spoke:** All tools connect to a central hub (like Make, Zapier, or n8n). Tool A talks to the hub, the hub talks to Tool B. Adding a new tool means one new connection, not five. Best for: anything beyond two tools.


  If you're building workflows that touch more than two services, hub-and-spoke saves you from integration chaos. The hub becomes your command center.


  Practical
  ## APIs Without the Intimidation

  An API is just a structured way for two tools to exchange data. You send a request ("give me all orders from today") and get a response (a list of orders). That's it. The format is usually JSON — which looks scary at first but is really just organized text with labels and values.
  Authentication is how APIs know you're allowed to use them. Most use API keys — long strings of characters you include with your requests. Treat them like passwords: never share them publicly, store them securely, and rotate them if they're compromised.


  Decision Guide
  ## No-Code vs. Custom

  **Use no-code connectors** (Zapier, Make, native integrations) when: the tools already have pre-built connectors, the data mapping is straightforward, and you need to move fast. This covers 80% of integration needs.
  **Build custom integrations** when: you need complex data transformations, the pre-built connectors don't support your use case, you need higher performance or lower latency, or you're hitting rate limits on the no-code platform. This is the 20% that separates good from great.


  Rate Limits
  ## The Invisible Wall Every Integration Hits

  Every API has rate limits — the maximum number of requests you can make in a given time window. Hit the limit and you'll get a 429 error (Too Many Requests). Your workflow needs to respect these limits gracefully, not crash into them.
  **Know your limits:** Before building, check each API's documentation for rate limits. Slack allows 1 message per second per channel. Stripe allows 100 requests per second. OpenAI varies by model and tier. Write these limits down — they're constraints you must design around.
  **Request batching:** Instead of making 100 individual API calls, many services offer batch endpoints. Send all 100 items in a single request. This is faster AND uses less of your rate limit quota.
  **Token bucket strategy:** Process requests at a steady rate just below the limit. If your limit is 100/second, process at 80/second. The 20% buffer prevents bursts from causing failures. Simple and effective.
  **Retry-After headers:** When you do hit a rate limit, most APIs include a `Retry-After` header telling you exactly how many seconds to wait. Respect it — retrying before the window resets just wastes resources.


  Security
  ## Keeping Your Integrations Secure

  Every integration is a potential security surface. API keys, webhook endpoints, and data in transit all need protection. This isn't paranoia — it's basic hygiene.
  **Environment variables:** Never hardcode API keys in your workflow code. Store them in environment variables or a secrets manager. `os.environ["STRIPE_KEY"]` is safe. `STRIPE_KEY = "sk_live_abc123"` in your source code is a breach waiting to happen.
  **Webhook verification:** When receiving webhooks, verify the request actually came from the service it claims to be from. Most platforms sign their webhooks with a secret — validate that signature before processing the payload. An unverified webhook endpoint is an open door.
  **Principle of least privilege:** Give each integration the minimum permissions it needs. If your workflow only reads from the CRM, don't give it write access. If it only needs one Slack channel, don't grant access to all channels. Small permissions mean small blast radius if something goes wrong.
  **Key rotation:** Rotate API keys regularly — quarterly at minimum. Set calendar reminders. When a team member leaves, rotate every key they had access to. This is the integration equivalent of changing your locks.


  Real Architecture
  ## A Complete Integration Stack

  Here's what a production integration architecture looks like for a customer onboarding workflow that touches six different services:


    **The stack:**
    1. **Stripe** (payment) — webhook fires on successful checkout
    2. **HubSpot** (CRM) — new contact created with enrichment data
    3. **Claude API** (AI) — personalizes welcome message based on customer segment
    4. **SendGrid** (email) — sends personalized welcome sequence
    5. **Slack** (notification) — alerts sales team in #new-customers channel
    6. **PostgreSQL** (database) — logs the entire event for analytics
    **Architecture choice:** Hub-and-spoke with Python as the hub. Each service has one integration module with its own error handling, rate limiting, and retry logic. Adding service #7 means writing one new module — the hub handles the orchestration.



  ### Try It Now

  Map the integrations your workflow needs.

    `List every tool your workflow touches. Draw lines between the ones that need to share data. Count the connections. Would hub-and-spoke simplify this? Which connections have pre-built connectors available?`



  Data Formats
  ## Speaking the Same Language Across Integrations

  Every integration challenge is, at its core, a translation problem. Tool A speaks JSON. Tool B expects XML. Tool C uses CSV. Your workflow needs to translate between these formats seamlessly.
  **JSON** is the universal language of modern APIs. If you learn one data format, learn JSON. It's human-readable, widely supported, and what most AI APIs (including Claude) expect and return.
  **CSV** is what spreadsheets and many legacy systems use. You'll often need to convert between JSON and CSV when importing/exporting data from Google Sheets, Excel, or database tools.
  **Form data** is how web forms submit information. Webhooks from form tools (Typeform, Google Forms) often arrive in this format. Parse it into your workflow's internal format immediately.
  The best practice: standardize on one internal format (JSON is the obvious choice) and convert to/from other formats only at the boundaries — when data enters and leaves your workflow.


  Troubleshooting
  ## Debugging Integration Failures

  When an integration breaks, follow this debugging checklist:
  **1. Check authentication first.** 90% of integration failures are auth-related. Expired token? Wrong API key environment? Revoked permissions? Check the HTTP status code — 401 or 403 means auth.
  **2. Log the full request and response.** Don't just log the error message — log the full HTTP request (URL, headers, body) and the full response. The answer is almost always in the response body.
  **3. Test the API independently.** Use a tool like curl, Postman, or Insomnia to make the same API call outside your workflow. If it works there but not in your code, the bug is in your code. If it fails there too, the problem is with the API or your credentials.
  **4. Check for API version changes.** APIs evolve. An endpoint that worked last month might have moved to v3 while your code still calls v2. Check the API's changelog or status page for recent changes.


  Resilience
  ## Building Integrations That Survive Outages

  External services go down. It's not a matter of if, but when. Your integration layer needs to handle this gracefully:
  **Queue-based decoupling:** Instead of calling an API directly, push the request to a queue. A separate worker processes the queue. If the API is down, the queue holds the requests until it recovers. No data is lost, and the workflow doesn't block.
  **Multi-provider fallback:** For critical integrations (email, notifications), have a backup provider ready. If SendGrid is down, route through Mailgun. If Twilio SMS fails, try Vonage. The switch should be automatic — no human intervention required at 3am.
  **Health check endpoints:** Before making a full API call, ping the service's health endpoint (most APIs have one at `/health` or `/status`). If it's unhealthy, skip directly to the fallback provider and save the latency of a failed request.


  Cost Management
  ## Integration Costs Add Up Faster Than You Think

  Every API call has a cost — direct (per-request pricing) or indirect (rate limit consumption). As your workflow portfolio grows, these costs compound:
  **Audit your API usage monthly.** Most providers have usage dashboards. Check them. You might discover a workflow that makes 10,000 API calls per month when 1,000 would suffice — because it's polling every 10 seconds instead of using webhooks.
  **Choose the right pricing tier.** Many APIs offer free tiers that cover light usage. Start free, upgrade when you actually hit limits. Don't prepay for capacity you haven't proven you need.
  **Cache aggressively.** If you look up the same company info 50 times in a day, that's 49 wasted API calls. Cache responses for reasonable durations. Even a 1-hour cache can cut API costs by 90%.
  Integration costs are one of the most overlooked budget items in automation projects. A workflow that costs $0.01 per run seems trivial — until it runs 100,000 times per month and your bill is $1,000. Plan for scale from the start.
  The best integration architects think about cost from day one — not as an afterthought. Choose APIs with generous free tiers for development, negotiate volume discounts for production, and always have a fallback plan if a provider raises prices. Your workflow shouldn't be held hostage by any single vendor's pricing decisions.


  [Interactive: FlashDeck]


  The Code
  ## API integration in Python.


Python — calling an API with authentication

```
import requests
import os

# API key from environment variable (NEVER hardcode)
API_KEY = os.environ["SLACK_BOT_TOKEN"]

def send_to_slack(channel: str, message: str):
    """Post a message to Slack via their API."""
    response = requests.post(
        "https://slack.com/api/chat.postMessage",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"channel": channel, "text": message}
    )
    data = response.json()
    if not data["ok"]:
        raise Exception(f"Slack error: {data['error']}")
    return data

# Hub-and-spoke: one function per integration
def add_to_crm(email, name):
    """HubSpot API — create a contact."""
    return requests.post(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        headers={"Authorization": f"Bearer {os.environ['HUBSPOT_KEY']}"},
        json={"properties": {"email": email, "firstname": name}}
    ).json()
```


Each integration is one function. Your workflow chains them: `webhook trigger → classify with AI → add_to_crm() → send_to_slack()`. This is the hub-and-spoke pattern in code — your Python script is the hub.


  Check Your Understanding
  ## Lesson 7 Quiz


### Quiz

**Q1: Why does hub-and-spoke become essential as the number of integrated tools grows?**
    A. It is always the best architecture regardless of tool count
  ✓ B. With 5 tools, point-to-point creates 10 connections — hub-and-spoke reduces this to 5 one-hub connections
    C. Hub-and-spoke tools cost less than direct integrations
    D. Only hub-and-spoke supports webhooks
  *With point-to-point, connections grow exponentially — 5 tools need 10 connections, 10 tools need 45. Hub-and-spoke means each tool connects once to the hub. Adding a new tool adds one connection, not many.*

**Q2: What is a webhook in practical terms?**
    A. A scheduled job that polls for changes
  ✓ B. A webhook is a small HTTP request that fires automatically when something happens in a tool — enabling instant event-driven reactions
    C. A type of API key
    D. A database backup trigger
  *A webhook fires the moment an event happens — not when you poll for it. Payment succeeds? Webhook fires. Deal moves stages? Webhook fires. Your workflow platform catches these signals and reacts instantly.*

**Q3: When should you build a custom integration instead of using no-code connectors?**
    A. Always — custom integrations are always better
    B. Never — no-code connectors handle everything
  ✓ C. When you need complex data transformations, the pre-built connectors do not cover your use case, or you need higher performance
    D. Only when the no-code platform is offline
  *No-code connectors handle about 80% of integration needs. Build custom when you need transformations the connectors cannot handle, hit rate limits on no-code platforms, or require performance the pre-built tools cannot deliver.*


  [← Previous: Human-in-the-Loop](/academy/ai-powered-workflows/06-human-in-the-loop/)
  [Next: Testing Workflows →](/academy/ai-powered-workflows/08-testing-workflows/)
