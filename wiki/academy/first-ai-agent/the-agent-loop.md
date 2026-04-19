# The Agent Loop

**Course:** Build Your First AI Agent
**Order:** 2
**Type:** lesson
**Access:** Free

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 2 of 10


  # The Agent Loop

  Every agent runs the same fundamental cycle: Perceive, Think, Act, Observe, Learn. This is the pattern behind every autonomous AI system — from Claude Code to self-driving cars. Here is how it works, in theory and in code.



    ## The Five Steps


    Click any node on the loop to explore it


      ### The Loop

      This is the heartbeat of every AI agent. Unlike a chatbot that responds once and stops, an agent cycles through these five steps continuously until its goal is achieved. Click a node above to dive in.




    ## The Loop in Code

    Here is a minimal but complete agent loop in Python. Every agent framework (LangChain, CrewAI, Claude Agent SDK) implements this same pattern under the hood:


      # agent_loop.py — The fundamental agent pattern

      import anthropic



      client = anthropic.Anthropic()



      def agent_loop(goal, tools, max_turns=10):

        memory = []  # Conversation history = agent memory

        turn = 0



        while turn max_turns:

          # STEP 1: PERCEIVE — gather current state

          messages = memory + [{

            "role": "user",

            "content": goal if turn == 0 else "Continue working toward the goal."

          }]



          # STEP 2: THINK — LLM reasons about what to do

          response = client.messages.create(

            model="claude-sonnet-4-6",

            max_tokens=1024,

            system=f"You are an agent. Goal: {goal}",

            tools=tools,

            messages=messages

          )



          # STEP 3: ACT — execute any tool calls

          if response.stop_reason == "tool_use":

            for block in response.content:

              if block.type == "tool_use":

                # STEP 4: OBSERVE — run the tool and get result

                result = execute_tool(block.name, block.input)



                # STEP 5: LEARN — store result in memory

                memory.append({

                  "role": "assistant",

                  "content": response.content

                })

                memory.append({

                  "role": "user",

                  "content": [{

                    "type": "tool_result",

                    "tool_use_id": block.id,

                    "content": result

                  }]

                })

          else:

            # No tool call = agent is done

            return response.content[0].text



          turn += 1



        return "Max turns reached without completion"




        Line 10
        **PERCEIVE** — The agent gathers its current state: the goal, its memory of past actions, and the current turn.


        Line 16
        **THINK** — Claude receives everything (goal + memory + tools) and reasons about what to do next. This is the intelligence.


        Line 25
        **ACT** — If Claude decided to use a tool, `execute_tool()` runs it for real — reading files, calling APIs, querying databases.


        Line 28
        **OBSERVE** — The tool result is captured. Did the API return data? Did the file write succeed? The agent sees what happened.


        Line 29
        **LEARN** — The tool result is appended to memory. On the next loop, Claude sees everything that happened and can build on it.





    ## Why the Loop Matters

    A chatbot calls the LLM once and returns the result. An agent calls the LLM in a loop, feeding each result back as context for the next decision. This is the difference between "answer a question" and "solve a problem."



        **Chatbot (1 call)**

          User: "What is the weather?"

          AI: "I cannot check the weather."

          *Done. No tools. No loop.*



        **Agent (3 loops)**

          Loop 1: Call weather API → get forecast

          Loop 2: Check calendar → find outdoor meeting

          Loop 3: Send email → "Bring an umbrella"

          *Problem solved autonomously.*






    ## The Stop Condition

    Every loop needs a way to stop. Without a stop condition, your agent runs forever. There are three ways agents decide to stop:



        **1. Goal achieved**
         — The LLM decides the task is complete and responds with text instead of a tool call. In the code above, this is the `else` branch on line 37 — when `stop_reason` is not `"tool_use"`, the loop exits.


        **2. Max turns reached**
         — Safety limit. The `max_turns=10` parameter prevents runaway agents. If the agent cannot solve the problem in 10 loops, something is wrong — stop and report.


        **3. Unrecoverable error**
         — A tool fails and there is no fallback. A good agent catches the error, logs what happened, and returns a useful message instead of crashing silently.





    ## Real-World Agent Loops

    The same loop pattern powers vastly different systems. The only thing that changes is what tools are available and what the goal is:



        CLAUDE CODE
        Perceive: read user request + codebase. Think: plan changes. Act: edit files, run tests. Observe: did tests pass? Learn: remember what worked. Loop until all tests green.


        CUSTOMER SUPPORT
        Perceive: read ticket. Think: classify intent. Act: search knowledge base. Observe: is the answer relevant? Learn: draft response. Loop until resolution or escalation.


        DATA PIPELINE
        Perceive: new data arrives. Think: what transformations needed? Act: query database, clean data. Observe: are results valid? Learn: log metrics. Loop until pipeline complete.





    ## Common Loop Failures

    Understanding how loops break makes you a better agent builder:



        **Infinite loop**
         — Agent keeps calling tools but never makes progress toward the goal. **Fix:** `max_turns` limit + progress detection. If the last 3 tool results are identical, stop.


        **Context overflow**
         — Memory grows so large the LLM cannot process it. **Fix:** Summarize old memory. Keep recent results full, compress older ones. Production agents use sliding windows.


        **Wrong tool selection**
         — Agent calls the database when it needs web search, or vice versa. **Fix:** Clear tool descriptions in the system prompt. Each tool should say exactly what it does and when to use it.





### Agent Loop Concepts

**Card 1:**
Front: Perceive
Back: The agent takes in information from its environment — a user message, API response, file change, or scheduled trigger. Perception is how the agent knows something needs doing.

**Card 2:**
Front: Think
Back: The agent reasons about what it perceived, considering its goal, memory, and context. The LLM combines all inputs to decide the best next action. This is the intelligence step.

**Card 3:**
Front: Act
Back: The agent calls a tool — sending an email, querying a database, making an API call, writing a file. This is what separates agents from chatbots: they do things in the real world.

**Card 4:**
Front: Observe
Back: After acting, the agent checks the result. Did the API call succeed? Was the data valid? Observation closes the feedback loop and enables self-correction.

**Card 5:**
Front: Learn
Back: The agent updates its memory with the outcome. What worked, what failed, what new information was discovered. Each loop becomes smarter than the last.

**Card 6:**
Front: stop_reason: tool_use
Back: When Claude returns stop_reason=tool_use, it means the model wants to call a tool. Your code executes the tool and feeds the result back. When stop_reason is end_turn, the agent is done.

**Card 7:**
Front: max_turns
Back: A safety limit on how many loops an agent can run. Prevents runaway agents that loop forever without making progress. Typical values: 5-25 depending on task complexity.

**Card 8:**
Front: Context overflow
Back: When memory grows so large the LLM cannot process it. Fix by summarizing old memory (keep recent results full, compress older ones) or using a sliding window.


### Quiz

**Q1: What is the correct order of the agent loop steps?**
    A. Think → Act → Perceive → Learn → Observe
  ✓ B. Perceive → Think → Act → Observe → Learn
    C. Act → Observe → Think → Learn → Perceive
    D. Learn → Perceive → Think → Act → Observe
  *The agent loop always starts with Perceive (taking in input), then Think (reasoning about what to do), Act (calling a tool), Observe (checking the result), and Learn (updating memory). Then it loops back.*

**Q2: In the Python code, what tells the loop the agent is finished?**
    A. The agent calls a special done() function
  ✓ B. The stop_reason is not tool_use — meaning the agent responded with text instead of a tool call
    C. The max_turns variable reaches zero
    D. The memory list becomes empty
  *When Claude responds with text instead of requesting a tool call, stop_reason will be end_turn instead of tool_use. This means the agent has decided its goal is achieved and the loop exits.*

**Q3: Why is max_turns important?**
    A. It makes the agent run faster
  ✓ B. It prevents runaway agents that loop forever without making progress
    C. It determines the model to use
    D. It controls the response length
  *Without max_turns, a confused agent could loop indefinitely — calling tools, getting results, but never making progress. The limit is a safety net that forces the agent to stop and report after a set number of iterations.*

**Q4: An agent keeps calling the same tool with the same input across 5 loops. What is happening?**
    A. The agent is working correctly but slowly
  ✓ B. The agent is stuck in an infinite loop — it is not learning from results
    C. The tool is broken
    D. The max_turns is set too high
  *If the agent repeats the same action without progress, it is failing to learn from the Observe step. The tool result is not changing the agent reasoning. This is the infinite loop failure mode — fix with progress detection or better tool result formatting.*
