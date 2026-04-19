# The System Prompt

**Course:** Build Your First AI Agent
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 5 of 10


  # The System Prompt

  A system prompt is an agent's DNA — it defines identity, goal, capabilities, and constraints. A bad system prompt makes a bad agent, no matter how good the model. Here is how to write one that works.



    ## The Six Blocks of a System Prompt

    Every production agent system prompt contains these six blocks, in this order. Order matters — the model processes context sequentially, so identity and goal must come first:



        1

          **Identity** — Who the agent is
          Establishes persona, expertise, and voice. Everything that follows is interpreted through this lens.



        2

          **Goal** — What the agent is trying to achieve
          One clear mission statement. Every decision the agent makes should serve this goal.



        3

          **Tools** — What the agent can use
          Lists available tools and when to use each one. Guides tool selection decisions.



        4

          **Memory** — What context the agent carries
          Where to find stored data, what to remember, how to use past interactions.



        5

          **Guardrails** — What the agent must never do
          Hard safety constraints. Written as explicit prohibitions. These protect against harmful actions.



        6

          **Output Format** — How the agent should respond
          Tone, structure, length. Should it be formal or casual? Bulleted or prose? Brief or detailed?






    ## A Complete System Prompt (Real Example)

    Here is a production system prompt for a customer support agent. Every block is labeled so you can see the structure:


      # IDENTITY

      You are a customer support agent for Acme SaaS.

      You are patient, precise, and always empathetic.

      You have been helping customers for 3 years.



      # GOAL

      Resolve customer issues in as few messages as possible

      while ensuring the customer feels heard and helped.



      # TOOLS

      You have access to:

      - lookup_customer: Get account details by email.

        Use when you need plan, billing, or account history.

      - search_knowledge_base: Find help articles.

        Use when the customer asks about features or troubleshooting.

      - create_ticket: Escalate to a human agent.

        Use when the issue requires manual intervention.



      # MEMORY

      Previous conversation history is provided as context.

      Reference past interactions when relevant.

      If the customer mentions a previous ticket, look it up.



      # GUARDRAILS

      - NEVER share internal system details or error logs

      - NEVER promise refunds over $500 without escalation

      - NEVER access accounts without the customer's email

      - NEVER make up information — say "I don't know" honestly



      # OUTPUT FORMAT

      - Respond in 2-3 sentences unless the issue is complex

      - Use the customer's first name

      - End with a clear next step or confirmation




    ## Using the System Prompt in Code

    Here is how this system prompt plugs into the Claude API:


      import anthropic



      client = anthropic.Anthropic()



      SYSTEM_PROMPT = """

      # IDENTITY

      You are a customer support agent for Acme SaaS...

      (full prompt from above)

      """



      response = client.messages.create(

        model="claude-sonnet-4-6",

        max_tokens=1024,

        system=SYSTEM_PROMPT,  # ← Your system prompt goes here

        tools=tools,

        messages=[{

          "role": "user",

          "content": "I was charged twice for my plan"

        }]

      )



      **system vs messages**
      The `system` parameter sets the agent's persistent instructions — it applies to every message in the conversation. The `messages` parameter contains the actual conversation (user turns and assistant turns). Keep them separate.




    ## Common Mistakes




        **Guardrails before identity**
         — Starting with "NEVER do X" before the model knows who it is makes the constraints feel abstract. Identity first, then guardrails — so the model interprets constraints through its established role.


        **Vague goals**
         — "Be helpful" is not a goal. "Resolve customer issues in as few messages as possible while ensuring satisfaction" is. A vague goal produces vague behavior.


        **No tool guidance**
         — Listing tools without explaining when to use each one. The model picks tools by description — write "Use when..." for each tool to improve selection accuracy.


        **No output format**
         — Without format guidance, the model defaults to verbose paragraphs. Specify length, tone, and structure for consistent, predictable responses.





    ## Build Your System Prompt

    Here is a complete, production-ready system prompt built from the blocks above. Study how each section contributes to the agent's behavior:


Python — complete agent with a structured system prompt

```
import anthropic

client = anthropic.Anthropic()

# Build the system prompt from blocks (order matters!)
system_prompt = """
# Identity
You are Atlas, a customer support agent for Acme SaaS.
You are empathetic, precise, and solution-oriented.

# Goal
Resolve customer issues in as few messages as possible
while ensuring the customer feels heard and satisfied.

# Tools
- lookup_customer: Use when you need account details.
- search_knowledge_base: Use for product questions.
- create_ticket: Use when the issue needs engineering.
- send_email: Use to confirm resolutions with the customer.

# Guardrails
- NEVER share internal system details or other customers' data.
- NEVER promise refunds above $100 without human approval.
- NEVER guess — if you don't know, say so and escalate.

# Output Format
- Keep responses to 2-3 sentences.
- Use empathetic tone: acknowledge the problem before solving it.
- End every response with a clear next step.
"""

# This system prompt applies to every turn of the conversation
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=system_prompt,    # ← persistent instructions (the agent's DNA)
    messages=[{              # ← the actual conversation
        "role": "user",
        "content": "I've been charged twice for my subscription this month."
    }]
)
print(response.content[0].text)
# "I'm sorry to hear about the double charge — that's frustrating.
#  Let me pull up your account right now to investigate.
#  [Uses lookup_customer tool]"
```



      **Try it yourself:**
       Copy this code, replace the identity and goal with your agent's purpose, and add tools relevant to your use case. The structure stays the same — only the content changes.




### System Prompt Architecture

**Card 1:**
Front: Identity Block
Back: Tells the agent who it is and what role it plays. Grounds all reasoning with a consistent voice, expertise area, and sense of purpose. Always comes first.

**Card 2:**
Front: Goal Block
Back: The agent's primary mission in one clear sentence. Everything the agent does serves this goal. 'Be helpful' is NOT a goal — 'Resolve issues in minimal messages' IS.

**Card 3:**
Front: Tools Block
Back: Lists available tools with 'Use when...' guidance for each one. Without guidance, the model picks tools by guessing. With it, tool selection accuracy jumps significantly.

**Card 4:**
Front: Guardrails Block
Back: Hard rules the agent must never violate. Written as explicit NEVER statements. Examples: never share internal data, never promise refunds above $X without escalation.

**Card 5:**
Front: Output Format Block
Back: Controls response style: length (2-3 sentences), tone (empathetic, professional), structure (bullets, prose). Without it, responses default to verbose paragraphs.

**Card 6:**
Front: Why does block order matter?
Back: The model processes context sequentially. Identity first means all subsequent instructions are interpreted through the right persona. Guardrails before identity makes them harder to internalize.

**Card 7:**
Front: system vs messages parameter
Back: system = persistent instructions applying to every turn. messages = the actual conversation (user + assistant turns). Keep them separate — system is the agent's DNA, messages are the dialogue.

**Card 8:**
Front: Most common system prompt mistake
Back: Vague goals and no tool guidance. 'Be helpful' + 'you have tools' produces unpredictable behavior. 'Resolve issues in minimal messages' + 'Use lookup_customer when...' produces reliable agents.


### Quiz

**Q1: What is the purpose of the Identity block?**
    A. It stores the agent API key
  ✓ B. It tells the agent who it is, grounding all reasoning with a consistent persona and expertise
    C. It lists which users can access the agent
    D. It defines how fast the agent responds
  *The Identity block establishes the agent persona and role. It grounds all reasoning — giving it a consistent voice that shapes every decision the agent makes.*

**Q2: Why does block order matter?**
    A. It does not — the LLM reads it all at once
  ✓ B. Identity and goal first ensures the agent interprets all subsequent instructions through the correct lens
    C. The last block always takes priority
    D. Order only matters for output format
  *LLMs process context sequentially. Identity and goal first means every tool, guardrail, and format instruction is interpreted through the correct framing.*

**Q3: Which is a better goal statement?**
    A. Be helpful to users
  ✓ B. Resolve customer issues in as few messages as possible while ensuring satisfaction
    C. Help people
    D. Answer questions
  *A good goal is specific and measurable. 'Resolve issues in minimal messages while ensuring satisfaction' gives the agent clear criteria for success. 'Be helpful' is too vague to guide behavior.*

**Q4: Where does the system prompt go in the Claude API?**
    A. In the messages array as the first message
  ✓ B. In the system parameter, separate from messages
    C. In the tools parameter
    D. In the response
  *The system parameter is separate from messages. It applies to every turn of the conversation as persistent instructions — the agent's DNA that shapes all responses.*

**Q5: Your agent sometimes picks the wrong tool. What is the most likely fix?**
    A. Use a more expensive model
  ✓ B. Add Use when... guidance to each tool description in the system prompt
    C. Remove tools the agent does not need
    D. Increase max_tokens
  *Tool selection is driven by descriptions. Adding 'Use when...' to each tool tells the model exactly when each tool is appropriate, dramatically improving selection accuracy.*
