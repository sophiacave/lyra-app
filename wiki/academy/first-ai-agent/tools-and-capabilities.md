# Tools and Capabilities

**Course:** Build Your First AI Agent
**Order:** 3
**Type:** lesson
**Access:** Free

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 3 of 10


  # Tools & Capabilities

  An agent without tools is just a chatbot. Each tool you add unlocks a new dimension of capability. Here is how tools work, what categories they fall into, and how to choose the right ones for your agent.



    ## Three Categories of Tools

    Every tool an agent can use falls into one of three categories. Understanding these categories helps you design agents that have the right capabilities for the job:



        **Knowledge Tools — Expand What the Agent Knows**
        Give the agent access to information beyond its training data. Without these, the agent can only answer from what it learned during training — which is frozen in time.

          Web Search
          Database Query
          File Reader
          Knowledge Base
          API Data Fetch



        **Action Tools — Let the Agent Change the World**
        Let the agent take real actions — send emails, create records, trigger workflows. These are what separate an agent from a chatbot. Without action tools, the agent can only talk about doing things.

          Email Sender
          API Caller
          File Writer
          Notification
          Database Insert



        **Autonomy Tools — Let the Agent Work Independently**
        Enable the agent to operate without human prompting — triggers, schedulers, monitors. These turn a reactive agent into a proactive one that works while you sleep.

          Cron Scheduler
          Webhook Listener
          Health Monitor
          Event Trigger
          Queue Consumer






    ## How Tools Are Defined (Real Code)

    In the Claude API, each tool is defined as a JSON schema. The `description` field is what Claude reads to decide when to use the tool:


      # A knowledge tool: web search

      {

        "name": "web_search",

        "description": "Search the web for current information. Use when the user asks about recent events, live data, or anything not in your training data.",

        "input_schema": {

          "type": "object",

          "properties": {

            "query": {

              "type": "string",

              "description": "Search query"

            }

          },

          "required": ["query"]

        }

      }



      # An action tool: send email

      {

        "name": "send_email",

        "description": "Send an email. Use when the user asks to communicate with someone via email.",

        "input_schema": {

          "type": "object",

          "properties": {

            "to": { "type": "string" },

            "subject": { "type": "string" },

            "body": { "type": "string" }

          },

          "required": ["to", "subject", "body"]

        }

      }




    ## Tools Compound in Value

    Each tool you add does not just add one capability — it multiplies them. Tools work together in ways that unlock tasks no single tool could handle:



        SEARCH + EMAIL
        Research a topic from the web, then email a summary. Neither tool alone can do both.


        DATABASE + API
        Look up customer data in your database, then call Stripe to check payment status. Full account audit in seconds.


        MONITOR + NOTIFY
        Watch server health metrics, send Slack alert when CPU spikes. Proactive monitoring without human attention.


        FILE + CALC + DB
        Read a CSV file, calculate totals accurately, save results to database. End-to-end data pipeline.





    ## Choosing the Right First Tool

    The right first tool depends on your agent's job. Match the tool to the most critical capability gap:



        **Research agent** → Web search first. It needs to find current information.


        **Support agent** → Database query first. It needs to look up customer accounts.


        **Coding agent** → File read/write first. It needs to see and modify code.


        **Data agent** → Calculator first. LLMs are unreliable at math — a calculator guarantees precision.





    ## Why a Calculator Tool Exists

    This surprises people: why does a powerful AI need a calculator? Because LLMs do not actually compute — they predict the most likely next token. For simple math, they are usually right. For precise calculations, they hallucinate:



        **LLM alone**

          "What is 47,832 &times; 891?"

          Answer: 42,618,312

          **Wrong.** (Actual: 42,618,312... sometimes right, sometimes not. You cannot trust it.)



        **LLM + Calculator tool**

          Agent calls `calculator(47832 * 891)`

          Returns: 42,618,312

          **Always correct.** Deterministic, guaranteed.




    The agent's intelligence is in knowing *when* to delegate to a tool. The best agents are not the ones that try to do everything themselves — they are the ones that route each sub-task to the right tool.



    ## Equip Your Agent with Tools

    Here is how to define tools in the Claude API. Each tool needs a name, description (tells Claude WHEN to use it), and an input schema (tells Claude WHAT to send):


Python — defining tools for a Claude agent

```
# Tools are JSON schemas that tell Claude what it can do
tools = [
    {
        "name": "lookup_customer",
        "description": "Look up a customer by email. Use when the user mentions their account, billing, or subscription.",
        "input_schema": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Customer email address"}
            },
            "required": ["email"]
        }
    },
    {
        "name": "web_search",
        "description": "Search the web. Use when the user asks about current events, prices, or information not in the knowledge base.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
]

# Pass tools to Claude — now it's an AGENT, not a chatbot
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,           # ← this is what makes it an agent
    messages=[{"role": "user", "content": "What plan is jane@acme.co on?"}]
)
# Claude will respond with a tool_use block:
# {"type": "tool_use", "name": "lookup_customer", "input": {"email": "jane@acme.co"}}
```



      **Zero tools = chatbot. One tool = capable. Three tools = agent.**
       Each tool you add multiplies what the agent can do. A web search + database + email sender turns a text generator into a full support agent that can research, look up accounts, and follow up — all autonomously.




### Quiz

**Q1: What capability does adding an API Caller tool unlock?**
    A. The agent can do math more accurately
  ✓ B. The agent can connect to any external service — payments, CRMs, social media, anything with an API
    C. The agent can read local files
    D. The agent can send emails
  *API access is the ultimate force multiplier. With an API Caller, your agent can interact with virtually any external system — booking platforms, payment processors, data services.*

**Q2: Why does a Calculator tool exist when LLMs can attempt math?**
    A. It is faster than reasoning
  ✓ B. LLMs produce probabilistic outputs — a calculator guarantees exact precision for every calculation
    C. Calculators use less memory
    D. Users prefer seeing a separate tool was used
  *LLMs predict the most likely next token, which makes them unreliable at precise arithmetic. A calculator tool delegates math to a deterministic system, eliminating hallucinated numbers.*

**Q3: What is the difference between a knowledge tool and an action tool?**
    A. Knowledge tools are faster
  ✓ B. Knowledge tools retrieve information, action tools change the world — send emails, write files, call APIs
    C. Knowledge tools are free, action tools cost money
    D. There is no difference
  *Knowledge tools (search, database query, file read) bring information IN. Action tools (email, API call, file write) push changes OUT. Both are essential for a capable agent.*

**Q4: An agent needs to: (1) look up a customer, (2) check their payment status, (3) send a refund notification. Which tool categories are needed?**
    A. Knowledge only
    B. Action only
  ✓ C. Knowledge (database lookup, payment API) + Action (email sender)
    D. Autonomy only
  *Database lookup and payment API check are knowledge tools (retrieving data). Email sender is an action tool (taking action). This task needs both categories working together.*

**Q5: What makes tools compound in value?**
    A. Each tool gets faster when more tools are added
  ✓ B. Tools can chain together — the output of one becomes the input for another, enabling tasks no single tool could handle
    C. More tools make the model smarter
    D. Tools share memory with each other
  *A web search alone finds information. An email sender alone sends messages. Combined: the agent researches a topic AND emails a summary. The combination enables tasks neither tool could do alone.*


### Agent Tool Categories

**Card 1:**
Front: Knowledge tools
Back: Tools that expand what the agent knows — web search, database queries, file readers, knowledge base lookups. They bring information IN from external sources.

**Card 2:**
Front: Action tools
Back: Tools that let the agent change the world — email senders, API callers, file writers, notification systems. They push changes OUT to external systems.

**Card 3:**
Front: Autonomy tools
Back: Tools that enable independent operation — cron schedulers, webhook listeners, health monitors, event triggers. They let the agent work without human prompting.

**Card 4:**
Front: Why tools compound in value
Back: Each additional tool multiplies capabilities. Search + email = research and communicate. Database + API = full account audits. The combination enables tasks no single tool could handle.

**Card 5:**
Front: Why LLMs need calculator tools
Back: LLMs predict tokens probabilistically — they do not actually compute. For precise calculations, they can hallucinate. A calculator tool delegates math to a deterministic system that is always correct.

**Card 6:**
Front: Choosing the right first tool
Back: Match the first tool to the agent's primary job. Research agent → web search. Support agent → database. Coding agent → file read/write. Data agent → calculator.

**Card 7:**
Front: Tool definition in Claude API
Back: A JSON schema with name, description, and input_schema. The description tells Claude WHEN to use the tool. Include 'Use when...' for accurate tool selection.
