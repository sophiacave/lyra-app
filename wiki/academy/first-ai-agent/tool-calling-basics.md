# Tool Calling Basics

**Course:** Build Your First AI Agent
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 7 of 10


  # Tool Calling Basics

  Tool calling is how agents take action in the real world. You define tools as JSON schemas, Claude decides when to use them, and your code executes them. Here is the complete pattern with production code.



    ## How Tool Calling Works

    Tool calling is a three-step conversation between your code and Claude:



        1

          **You define tools**
          Tell Claude what tools exist using JSON schemas — name, description, and parameters.



        2

          **Claude decides to use one**
          Based on the user's request, Claude returns a `tool_use` block with the tool name and filled-in parameters.



        3

          **Your code executes it**
          You run the actual function, then send the result back to Claude as a `tool_result` message.






    ## Step 1: Define Your Tools

    A tool definition is a JSON schema that tells Claude what the tool does and what parameters it accepts. The better your description, the better Claude's tool selection:


      # Define tools for a customer support agent

      tools = [

        {

          "name": "search_knowledge_base",

          "description": "Search the company knowledge base for help articles. Use when the customer asks a question about how to use the product, troubleshoot an issue, or understand a feature.",

          "input_schema": {

            "type": "object",

            "properties": {

              "query": {

                "type": "string",

                "description": "Search query describing the customer's issue"

              }

            },

            "required": ["query"]

          }

        },

        {

          "name": "lookup_customer",

          "description": "Look up a customer's account details by email. Use when you need to check their plan, billing status, or account history.",

          "input_schema": {

            "type": "object",

            "properties": {

              "email": {

                "type": "string",

                "description": "Customer email address"

              }

            },

            "required": ["email"]

          }

        },

        {

          "name": "create_ticket",

          "description": "Create a support ticket for issues that need human follow-up. Use when the issue cannot be resolved automatically.",

          "input_schema": {

            "type": "object",

            "properties": {

              "subject": { "type": "string" },

              "priority": {

                "type": "string",

                "enum": ["low", "medium", "high", "urgent"]

              },

              "description": { "type": "string" }

            },

            "required": ["subject", "priority", "description"]

          }

        }

      ]



      **The description is the most important field**
      Claude uses the tool description to decide when to call it. Vague descriptions like "search stuff" lead to wrong tool selection. Be specific about what the tool does and *when* to use it.




    ## Step 2: Claude Decides to Call a Tool

    When you send a message with tools defined, Claude reads the user's request and decides if any tool would help. If so, it returns a `tool_use` content block:


      # Send a message with tools available

      response = client.messages.create(

        model="claude-sonnet-4-6",

        max_tokens=1024,

        tools=tools,

        messages=[{

          "role": "user",

          "content": "I was charged twice for my Pro plan. My email is jane@acme.co"

        }]

      )



      # Claude responds with a tool_use block:

      # response.stop_reason = "tool_use"

      # response.content = [

      #   TextBlock("Let me look up your account..."),

      #   ToolUseBlock(

      #     id="toolu_abc123",

      #     name="lookup_customer",

      #     input={"email": "jane@acme.co"}

      #   )

      # ]


    Claude extracted the email from the user's message and decided `lookup_customer` is the right tool. It filled in the parameters automatically.



    ## Step 3: Execute and Return Results

    Your code runs the actual tool, then sends the result back to Claude. Claude uses the result to continue reasoning:


      # Execute the tool call

      def execute_tool(name, params):

        if name == "lookup_customer":

          return db.query("SELECT * FROM customers WHERE email = %s", params["email"])

        elif name == "search_knowledge_base":

          return kb.search(params["query"])

        elif name == "create_ticket":

          return tickets.create(**params)



      # Get the tool use block from the response

      tool_block = next(b for b in response.content if b.type == "tool_use")

      result = execute_tool(tool_block.name, tool_block.input)



      # Send the result back to Claude

      follow_up = client.messages.create(

        model="claude-sonnet-4-6",

        max_tokens=1024,

        tools=tools,

        messages=[

          {"role": "user", "content": "I was charged twice..."},

          {"role": "assistant", "content": response.content},

          {"role": "user", "content": [{

            "type": "tool_result",

            "tool_use_id": tool_block.id,

            "content": json.dumps(result)

          }]}

        ]

      )



      # Claude now has the customer data and can respond intelligently

      print(follow_up.content[0].text)

      # "I can see your account, Jane. You're on the Pro plan at $49/mo.

      #  I see two charges on March 15. Let me create a ticket for the

      #  billing team to refund the duplicate charge."




    ## Chained Tool Calls

    Powerful agents chain multiple tool calls in sequence. Claude uses the result of one call to decide the next:



        **lookup_customer**

        Get account data

      →

        **search_knowledge_base**

        Find refund policy

      →

        **create_ticket**

        Escalate to billing



    Claude autonomously decided to: (1) look up the customer, (2) check the refund policy, (3) create a ticket with all the context. Three tool calls, zero human intervention. This is the agent pattern.



    ## Writing Good Tool Descriptions

    Tool selection is only as good as your descriptions. Here is the difference between a bad and good description:



        **Bad:** `"Search the database"`
        Too vague. Claude does not know *what* database, *when* to use it, or *what data* it returns.


        **Good:** `"Search the company knowledge base for help articles. Use when the customer asks a question about how to use the product, troubleshoot an issue, or understand a feature."`
        Specific about what it does, what data it returns, and *when* Claude should choose it.




      **Pro tip: Include "Use when..." in every tool description**
      This phrase directly tells Claude the decision criteria for selecting this tool. It is the single most impactful improvement you can make to tool selection accuracy.




    ## When Tool Calls Fail

    Tools fail. APIs timeout. Databases go down. Your code needs to handle every failure:


      def execute_tool_safe(name, params):

        try:

          result = execute_tool(name, params)

          return json.dumps(result)

        except Exception as e:

          # Return error AS the tool result — Claude can adapt

          return json.dumps({

            "error": str(e),

            "tool": name,

            "suggestion": "Try an alternative approach"

          })


    When you return an error as a tool result, Claude sees the failure and can adapt — trying a different tool, asking the user for more information, or gracefully explaining the limitation.



    ## Interactive: Watch Tool Calling in Action

    Pick a question to see the agent decide which tool to use, make the call, and use the result:



    ### Pick a question for the agent to answer:








### Tool Calling Concepts

**Card 1:**
Front: What is a tool definition?
Back: A JSON schema that tells Claude what a tool does (description), what parameters it accepts (input_schema), and what they mean. Claude uses this to decide when and how to call the tool.

**Card 2:**
Front: What is a tool_use block?
Back: Claude's response when it wants to call a tool. Contains the tool name, a unique ID, and the filled-in parameters. Your code executes the tool and returns the result.

**Card 3:**
Front: What is a tool_result message?
Back: Your response after executing a tool. Contains the tool_use_id (linking back to the request) and the result data. Claude uses this to continue reasoning.

**Card 4:**
Front: Chained tool calls
Back: When an agent uses the output of one tool call as context for the next. Example: look up customer → find their plan → create a refund ticket. Each call builds on the previous result.

**Card 5:**
Front: Why does the description field matter most?
Back: Claude reads tool descriptions to decide which tool to use. Vague descriptions cause wrong tool selection. Include WHAT the tool does and WHEN to use it for accurate selection.

**Card 6:**
Front: How to handle tool failures
Back: Return the error as the tool_result content. Claude sees the failure and can adapt — trying a different tool, asking for clarification, or explaining the limitation gracefully.

**Card 7:**
Front: input_schema required vs optional
Back: Required parameters must always be provided by Claude. Optional parameters have defaults. Use required for data Claude MUST extract from the user message.

**Card 8:**
Front: enum in tool parameters
Back: Constrains a parameter to specific valid values (e.g., priority: low/medium/high/urgent). Prevents Claude from inventing invalid values and makes your tool handling predictable.


### Quiz

**Q1: What is the purpose of the tool description field?**
    A. It is displayed to the user as help text
  ✓ B. Claude reads it to decide WHEN to use this tool vs other available tools
    C. It controls the output format
    D. It defines the API endpoint URL
  *The description is Claude's decision criteria. When multiple tools are available, Claude reads each description to determine which tool best matches the current request. Better descriptions = better tool selection.*

**Q2: A user says: Check if jane@acme.co has an active subscription. Which tool should Claude call?**
    A. search_knowledge_base — to find subscription docs
  ✓ B. lookup_customer — to get account details including subscription status
    C. create_ticket — to ask someone to check
    D. No tool needed — Claude can answer from training data
  *The user is asking about a specific customer's data. lookup_customer retrieves account details (including plan and billing status) by email. The knowledge base has general docs, not customer-specific data.*

**Q3: What happens when you return an error as a tool_result?**
    A. The entire program crashes
  ✓ B. Claude sees the error and can adapt — trying a different tool or explaining the issue
    C. The error is hidden from Claude
    D. Claude retries the same tool automatically
  *Returning the error as content lets Claude see what went wrong. Claude can then adapt — trying a different approach, asking the user for alternative information, or explaining why it cannot complete the request.*

**Q4: An agent calls lookup_customer, then search_knowledge_base, then create_ticket. What is this pattern called?**
    A. Parallel tool calling
  ✓ B. Chained tool calling — each call builds on previous results
    C. Recursive tool calling
    D. Batch tool calling
  *Chained tool calling means each subsequent tool call uses context from previous results. The agent looked up the customer, found the relevant policy, then created a ticket with all the context. This is autonomous multi-step execution.*

**Q5: Which tool description is better for accurate tool selection?**
    A. Search the database
  ✓ B. Search the company knowledge base for help articles. Use when the customer asks about product features or troubleshooting.
    C. DB search tool
    D. Query handler
  *The second description tells Claude exactly what data the tool returns (help articles) and when to use it (product questions, troubleshooting). Claude can distinguish this from a customer lookup or ticket creation tool based on these specifics.*
