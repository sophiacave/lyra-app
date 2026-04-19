# What Is an Agent?

**Course:** The Automation Lab
**Order:** 1
**Type:** lesson
**Access:** Free

---
[The Automation Lab](/academy/the-automation-lab/)
  Lesson 1 of 10


  # What Is an Agent?

  Most "AI" you have used is actually just automation — a trigger, an action, done. An agent is fundamentally different: it perceives, decides, acts, and adapts in a continuous loop. This lesson teaches you to tell the difference and understand why it matters.



    ## The Core Distinction

    An **automation** follows a fixed path. A new email arrives, a rule moves it to a folder. A timer fires, a script sends a report. There is no thinking, no adapting — just a trigger and a pre-programmed response. If the input changes, the automation does not care. It runs the same steps regardless.

    An **agent** is a system that runs a continuous loop: *perceive → decide → act → learn*. It observes its environment, reasons about what it sees, takes real actions, and updates its understanding based on the outcome. If the input changes, the agent changes its behavior. This is the fundamental difference.


      **Definition:** An AI agent is a software system that can (1) observe its environment through sensors or data inputs, (2) make autonomous decisions based on goals and observations, (3) take real actions that affect the world, and (4) learn from outcomes to improve over time. It operates in a **continuous loop**, not a one-shot pipeline.




    ## Automation vs. Agent — Side by Side

    **Watch both systems run.** The automation fires once and stops. The agent loops continuously, adapting to what it finds.




      Automation

        Trigger
        Action
        Done

      Pipeline complete. Waiting for next trigger...



      Agent





    ## The Agent Loop in Detail

    Every agent — from a simple chatbot to a fleet of autonomous systems — runs some version of this four-stage loop:



        **1. Perceive**
        The agent reads its environment. This could be an inbox, a database table, a set of API responses, sensor data, or a user message. Perception is the input — without it, the agent is blind.


        **2. Decide**
        Based on what it perceived, the agent reasons about what to do next. This is where goals, context, and memory matter. A support agent might decide "this ticket is urgent — escalate" vs. "this is a FAQ — send the standard reply." The decision phase is what separates agents from scripts.


        **3. Act**
        The agent takes a real action in the world — sends an email, updates a database, calls an API, creates a file, restarts a service. Actions have consequences, which is why guardrails (covered in Lesson 2) are critical.


        **4. Learn**
        The agent observes the outcome of its action and updates its understanding. Did the email bounce? Did the user approve the draft? Did the API return an error? Learning closes the loop — the agent adjusts its behavior for next time.





    ## What This Looks Like in Code

    Here is a simplified agent loop in Python. Even the most complex agent systems — LangChain, CrewAI, Anthropic's Claude Agent SDK — are built on this pattern:



```
class SimpleAgent:
    def __init__(self, name, goal, tools):
        self.name = name
        self.goal = goal
        self.tools = tools
        self.memory = []     # what the agent remembers

    def perceive(self, environment):
        """Read the current state of the world."""
        return environment.get_current_state()

    def decide(self, observation):
        """Choose an action based on goal + observation + memory."""
        context = {"goal": self.goal, "observation": observation, "memory": self.memory}
        return self.reason(context)   # could be an LLM call

    def act(self, action):
        """Execute the chosen action using available tools."""
        tool = self.tools[action.tool_name]
        return tool.execute(action.params)

    def learn(self, action, result):
        """Update memory based on outcome."""
        self.memory.append({"action": action, "result": result})

    def run(self, environment):
        """The agent loop — runs until the goal is met."""
        while not self.goal_met():
            observation = self.perceive(environment)
            action = self.decide(observation)
            result = self.act(action)
            self.learn(action, result)
```



    Notice the `while not self.goal_met()` loop — this is the heartbeat. An automation would run once and exit. The agent keeps going until its goal is satisfied.



    ## Real-World Examples

    Agents are already everywhere — you just might not have recognized them as such:



        **GitHub Copilot Agent Mode**
        Reads your codebase, plans multi-file changes, runs tests, fixes failures, and iterates until the code passes. Full perceive-decide-act-learn loop.


        **Claude Code**
        Reads files, writes code, runs commands, checks results, and self-corrects. It is an agent — every tool call is an action in the loop.


        **Self-Driving Cars**
        Cameras perceive the road. The model decides to brake or steer. The car acts. Sensors measure the outcome. The loop runs 30+ times per second.


        **Trading Bots**
        Monitor market data (perceive), run strategies (decide), place orders (act), and adjust parameters based on P&L (learn). 24/7 continuous loop.





    ## When Agents Go Wrong

    Agents are powerful, but they fail in predictable ways. Understanding failure modes now prevents disasters later:


      **Infinite loops:** An agent that never reaches its goal will run forever, burning resources. Always define exit conditions.


      **Hallucinated actions:** An LLM-based agent might "decide" to call a tool that does not exist, or pass invalid parameters. Tool validation is essential.


      **Runaway side effects:** An agent that sends emails in its act phase could spam thousands of people if the loop runs without rate limiting. Every action needs guardrails.




    ## Frameworks You Should Know

    You do not need a framework to build agents — the loop above is enough to start. But these tools make production agents easier:


      **Claude Agent SDK** — Anthropic's official framework for building agents with Claude. Handles tool use, guardrails, and the agent loop natively.

      **LangGraph** — From the LangChain team. Models agents as state machines with explicit graph-based control flow.

      **CrewAI** — Multi-agent framework where you define agent roles and they collaborate to complete tasks.

      **AutoGen** — Microsoft's framework for multi-agent conversations, especially good for code generation agents.

    This course teaches the concepts behind all of these. Once you understand the agent loop, memory, communication, and orchestration — you can use any framework.



    ## The Agent Lifecycle

    Agents are not permanent. They are born, they run, and they eventually terminate. Understanding the lifecycle helps you design agents that start cleanly, operate reliably, and shut down gracefully:



        **Initialization**
        The agent loads its configuration — identity, tools, goals, guardrails, and memory. It reads any persisted state from previous runs. If this phase is incomplete, the agent starts without context and makes poor decisions. Always boot from the brain.


        **Active Loop**
        The perceive-decide-act-learn cycle runs continuously. The agent processes inputs, takes actions, and updates its understanding. This is the productive phase — where goals are pursued and work gets done.


        **Graceful Shutdown**
        Before terminating, the agent writes its current state to persistent memory — what it was doing, what it learned, and what comes next. This checkpoint enables the next instance to resume seamlessly. An agent that crashes without checkpointing loses all session progress.





    ## Agents vs. Pipelines vs. Workflows

    These three terms are often confused. Here is the precise distinction:


      **Pipeline:** A fixed sequence of steps — A then B then C. No branching, no decisions. Each step transforms the input for the next. Used for data processing, ETL, and build systems.


      **Workflow:** A sequence with conditional branching — if X then do A, else do B. More flexible than a pipeline but still pre-defined. Used in CI/CD, approval flows, and business process automation.


      **Agent:** A continuous loop that decides its own actions based on observations. Not pre-defined — the agent chooses what to do at each step. Can incorporate pipelines and workflows as tools, but the decision-making is dynamic.

    The key test: if you can draw the entire execution path before the system runs, it is a pipeline or workflow. If the execution path depends on what the system discovers at runtime, it is an agent.


  Test Your Understanding


    ## Automation or Agent?

    Read each scenario and decide: is it an automation or an agent?

      Correct: 0/5


      ### Lesson Complete!

      You now understand the core difference: automations follow a fixed path, agents perceive, decide, act, and learn in a continuous loop.





### Quiz

**Q1: A cron job sends a weekly analytics report every Monday at 9am. What is this?**
    A. Agent
  ✓ B. Automation
    C. Both
    D. Neither
  *Fixed schedule, fixed action, no decision-making or adaptation. Classic automation.*

**Q2: A system monitors your inbox, categorizes emails by urgency, drafts responses, and improves based on your corrections. What is this?**
    A. Automation
  ✓ B. Agent
    C. Script
    D. Workflow
  *It perceives (reads inbox), decides (categorizes by urgency), acts (drafts responses), and learns (improves from corrections) — the full agent loop.*

**Q3: Which of these is part of the agent loop?**
    A. Trigger → Action → Done
  ✓ B. Perceive → Decide → Act → Learn
    C. Input → Process → Output
    D. Schedule → Run → Stop
  *Agents run a continuous perceive-decide-act-learn cycle, not a fixed linear path.*

**Q4: An agent keeps sending the same email over and over without stopping. What failure mode is this?**
    A. Hallucinated action
  ✓ B. Infinite loop with runaway side effects
    C. Race condition
    D. Memory leak
  *The agent loop is running without proper exit conditions or rate limiting — the act phase triggers repeatedly with no guardrails.*

**Q5: Why does the agent loop include a Learn phase?**
    A. To make the code longer
  ✓ B. So the agent can adapt its behavior based on the outcomes of its actions
    C. To store logs for compliance
    D. To slow down the loop
  *Learning closes the loop. Without it, the agent would make the same decisions regardless of outcomes — no better than automation.*



### Agent Concepts

**Card 1:**
Front: What makes an agent different from automation?
Back: An agent perceives its environment, makes decisions, takes actions, and adapts in a loop. Automations follow a fixed path with no decision-making.

**Card 2:**
Front: What are the 4 stages of the agent loop?
Back: Perceive → Decide → Act → Learn. The loop repeats continuously as the agent adapts to new information.

**Card 3:**
Front: Give an example of automation
Back: A cron job that resizes uploaded images on a fixed schedule — no decisions, no learning, just a trigger and a fixed action.

**Card 4:**
Front: Give an example of an agent
Back: Claude Code: reads files (perceive), plans changes (decide), writes code and runs commands (act), checks results and self-corrects (learn).

**Card 5:**
Front: What is an infinite loop failure?
Back: When an agent never reaches its goal and keeps running forever, burning resources. Always define exit conditions and max iterations.

**Card 6:**
Front: Name 3 agent frameworks
Back: Claude Agent SDK (Anthropic), LangGraph (LangChain), CrewAI (multi-agent roles). All implement the same core perceive-decide-act-learn loop.
