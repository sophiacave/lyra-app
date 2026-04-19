# Chatbot vs Agent

**Course:** Build Your First AI Agent
**Order:** 1
**Type:** lesson
**Access:** Free

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 1 of 10


  # Chatbot vs Agent

  They both use AI. But one is a tool and the other is a worker. Understanding this distinction is the foundation of everything you will build in this course.



    ## The Core Difference

    A chatbot generates text. An agent takes action. That is the entire distinction — and it changes everything about how you build AI systems.



        ### Chatbot

        &#x2717; You ask, it answers — done
        &#x2717; No memory between messages
        &#x2717; Can't take actions
        &#x2717; Waits for your input
        &#x2717; Single turn interaction


        ### Agent

        &#x2713; Perceives → Decides → Acts
        &#x2713; Remembers context & history
        &#x2713; Uses tools to do real work
        &#x2713; Operates autonomously
        &#x2713; Loops until goal is met





    ## See the Difference in Code

    Here is the same task — "email my team about tomorrow's meeting" — handled by a chatbot vs an agent:



        **Chatbot Approach**

          # Chatbot: one API call, returns text, done

          response = client.messages.create(

            model="claude-sonnet-4-6",

            messages=[{"role": "user",

              "content": "Write an email about tomorrow's meeting"}]

          )

          print(response.content[0].text)

          # Output: "Subject: Tomorrow's Meeting..."

          # YOU have to copy this, open Gmail, paste, find

          # team emails, and send it yourself. The AI is done.




        **Agent Approach**

          # Agent: loops, uses tools, takes real action

          # Loop 1: Check calendar for meeting details

          # → tool_use: calendar.get_events(date="tomorrow")

          # → result: "Sprint Planning, 10am, Room 4B"



          # Loop 2: Get team email addresses

          # → tool_use: contacts.search(group="engineering")

          # → result: ["alice@co.com", "bob@co.com", ...]



          # Loop 3: Compose and send the email

          # → tool_use: email.send(

          #     to=["alice@co.com", "bob@co.com"],

          #     subject="Sprint Planning Tomorrow 10am",

          #     body="Hi team, reminder: Sprint Planning..."

          # )



          # Loop 4: Confirm success

          # → "Done. Sent to 8 team members about Sprint

          #    Planning at 10am in Room 4B."




    The chatbot wrote text. The agent checked the calendar, found the team, composed a relevant email, and sent it. Four loops, three tool calls, zero human effort beyond the initial request.

    Here is a minimal agent skeleton in Python — this is the foundation everything else in this course builds on:


Python — Minimal agent loop (the foundation)

```
import anthropic

client = anthropic.Anthropic()
messages = []
tools = [# your tool definitions here]

def agent_loop(user_input):
    messages.append({"role": "user", "content": user_input})

    while True:  # ← THE LOOP (keeps going until done)
        response = client.messages.create(
            model="claude-sonnet-4-6",
            messages=messages,
            tools=tools,
            max_tokens=1024
        )

        # If Claude wants to use a tool → execute it
        if response.stop_reason == "tool_use":
            tool_result = execute_tool(response)
            messages.append(tool_result)
            continue  # ← loop again

        # Otherwise Claude is done → return the answer
        return response.content[0].text
```





    ## The Three Requirements for Agency

    An AI system becomes an agent when it has all three of these. Missing even one and it falls back to being a chatbot:



        **1. Tools**
        The ability to take real actions — call APIs, read files, send emails, query databases. Without tools, the AI can only generate text. With tools, it changes the world.


        **2. Memory**
        The ability to remember past actions and their results. Without memory, every loop starts from scratch. With memory, the agent builds on what it learned.


        **3. A Loop**
        The ability to call the LLM multiple times, feeding results back in. Without a loop, the AI responds once. With a loop, it works until the job is done.





    ## Real Examples in the Wild

    You are already using agents — you just might not have known the name:



        CLAUDE CODE
        **Agent.** Reads your codebase, plans changes, edits files, runs tests, fixes errors, loops until the code works. Dozens of tool calls per task.


        CHATGPT
        **Chatbot (mostly).** You ask, it answers. When you use Code Interpreter or web browsing, it edges toward agent behavior — but it stops after one action.


        GMAIL FILTER
        **Automation.** Trigger + action, no AI reasoning. "If from X, apply label Y." It does not think — it follows a rule. One step below an agent.


        DEVIN
        **Agent.** Receives a task, plans its approach, writes code, runs tests, debugs failures, deploys. Full autonomy loop across hours of work.





    ## The Spectrum

    Chatbot and agent are not binary — they exist on a spectrum. As you add tools, memory, and loops, the system moves from chatbot toward full agent:


      Chatbot
text only
      →
      + Tools
can act once
      →
      + Memory
learns over time
      →
      + Loop
works until done
      →
      Full Agent
autonomous





    ## When to Build a Chatbot vs an Agent

    Not every AI feature needs an agent. Use these criteria to decide which architecture fits your use case:



        **Build a Chatbot When...**
        The user just needs **information** — answering questions, summarizing documents, translating text, or brainstorming ideas. No external systems need to change. The interaction is one question, one answer. Example: a FAQ bot that answers product questions from documentation.


        **Build an Agent When...**
        The task requires **real-world actions** — sending emails, updating databases, calling APIs, creating files. The AI needs to gather information from multiple sources, make decisions, and execute a multi-step plan. Example: a support agent that looks up the customer, diagnoses the issue, applies a fix, and sends a confirmation email.


        **Consider Complexity vs Cost**
        Agents use more API calls (each loop iteration is a separate call), require error handling for tool failures, and need safety guardrails to prevent unintended actions. If a chatbot solves the problem, an agent adds unnecessary cost and risk. Start with a chatbot — upgrade to an agent only when you need action, memory, or multi-step reasoning.


        **The Hybrid Path**
        Many production systems start as chatbots and evolve into agents. Ship a chatbot first, track which queries require human follow-up actions, then add tools for those specific actions. This iterative approach reduces risk and lets real user behavior guide your architecture decisions.





### Quiz

**Q1: I ask ChatGPT to write an email. It writes it and shows it to me. I copy-paste it into Gmail myself. What is this?**
    A. Agent — it processed my request
  ✓ B. Chatbot — it only generated text, I took the action
    C. Agent — it used memory
    D. Chatbot — it required voice input
  *The AI just generated text — it did not send it, track it, or follow up. You had to do the action. That is a chatbot pattern.*

**Q2: An AI system monitors a website every hour. If it detects downtime, it restarts the server, checks if it worked, and pages the engineer if not. What is this?**
    A. Chatbot — it answers questions about the website
  ✓ B. Agent — it perceives, decides, acts, and loops
    C. Chatbot — it runs on a schedule
    D. Agent — only because it sends notifications
  *It perceives (monitors), thinks (is it down?), acts (restart), observes (did it work?), and escalates. Full agent loop with error handling.*

**Q3: Which of the three requirements for agency does a Gmail filter lack?**
    A. Tools — it cannot take actions
    B. Memory — it cannot remember past emails
  ✓ C. A reasoning loop — it follows fixed rules without AI decision-making
    D. All three
  *A Gmail filter has tools (apply label, forward) and basic memory (filter rules persist). But it has no reasoning loop — it follows fixed if/then rules without thinking. Add AI reasoning and it becomes an agent.*

**Q4: What is the most important difference between a chatbot and an agent?**
    A. Agents are more expensive to run
    B. Agents use better models
  ✓ C. Agents take real-world actions through tools in an autonomous loop
    D. Agents have prettier interfaces
  *The core distinction is action + autonomy. A chatbot generates text. An agent uses tools to change the world and loops until the goal is met. The model can be the same — the architecture is what differs.*


### Chatbot vs Agent Key Concepts

**Card 1:**
Front: What is a chatbot?
Back: A system that takes a single input and returns a single output. No memory, no actions, no loop. You ask, it answers, done.

**Card 2:**
Front: What is an agent?
Back: A system that perceives input, reasons about goals, takes actions via tools, observes results, and loops autonomously until the goal is met.

**Card 3:**
Front: The three requirements for agency
Back: (1) Tools — the ability to take real actions. (2) Memory — the ability to remember past results. (3) A loop — the ability to call the LLM multiple times, feeding results back in.

**Card 4:**
Front: What is the agent loop?
Back: Perceive → Think → Act → Observe → Learn — the continuous cycle that separates agents from chatbots. The loop runs until the goal is achieved or a stop condition is hit.

**Card 5:**
Front: Why do agents need tools?
Back: Tools let agents take real actions in the world — sending emails, querying databases, calling APIs. Without tools, the AI can only generate text.

**Card 6:**
Front: Why do agents need memory?
Back: Memory lets agents build on previous actions. Without memory, every loop starts from scratch. With memory, the agent accumulates knowledge and avoids repeating mistakes.

**Card 7:**
Front: The chatbot-to-agent spectrum
Back: Text only → + Tools (can act once) → + Memory (learns) → + Loop (works until done) → Full Agent (autonomous). Each addition moves the system closer to true agency.
