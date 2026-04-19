# Agent Quiz

**Course:** Build Your First AI Agent
**Order:** 10
**Type:** quiz
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 10 of 10


  # Agent Mastery Quiz

  8 questions covering everything you've learned. Prove you understand agent fundamentals.


  ## Course Recap

  Before you take the quiz, let us walk through everything you have learned across three modules. Each module built on the last — from understanding what agents are, to building one, to shipping it safely.




      Module 1
      **Foundations**
      Understanding what agents are, how they think, and why they are different from chatbots.

        -  Chatbot vs. agent — the autonomy spectrum

        -  The agent loop — perceive, think, act, observe, learn

        -  Tool calling — how agents interact with the real world

        -  Why tools turn text generators into action-takers





      Module 2
      **Building**
      Designing your agent from the ground up — its brain, its tools, and its memory.

        -  System prompts — the 6 essential blocks

        -  Tool integration — JSON schemas, descriptions, routing

        -  Memory systems — short-term, long-term, and RAG

        -  Designing agents with a clear goal and focused tool set





      Module 3
      **Production**
      Making your agent safe, reliable, and ready for real users in the real world.

        -  Error handling — try/catch, retries, fallback tools

        -  Guardrails — what your agent must never do

        -  Evaluation — the 5 dimensions and the 70+ threshold

        -  Deployment — monitoring, logging, and continuous improvement







  ## The Agent Builder's Checklist

  Every agent needs these seven things before it touches a real user. This is your pre-flight checklist. If any item is missing, your agent is not ready.




      1.

        **Clear goal statement**
        One sentence that defines exactly what your agent does and for whom. "This agent helps customer support reps find order information and process refunds." If you cannot say it in one sentence, the agent is too broad.




      2.

        **Focused tool set (2-4 tools)**
        Start small. Two to four well-defined tools beat ten vague ones. Each tool needs a clear name, a precise description, and a JSON schema the model can understand. More tools means more decision points where the agent can choose wrong.




      3.

        **System prompt with all 6 blocks**
        Your system prompt must include: **Identity** (who the agent is), **Goal** (what it is trying to do), **Tools** (what it can use and when), **Memory** (what to remember), **Guardrails** (what it must never do), and **Output Format** (how to structure responses). Missing any block creates blind spots.




      4.

        **At least one guardrail**
        Every agent needs at least one hard boundary it will never cross. "Never share another customer's data." "Never execute a refund over $500 without human approval." "Never generate medical advice." Guardrails are non-negotiable safety rules, not suggestions.




      5.

        **Memory strategy**
        Decide what your agent remembers within a session (short-term: conversation history) and across sessions (long-term: user preferences, past interactions, learned patterns). An agent without long-term memory starts from zero every time. An agent that remembers everything wastes tokens and money. Find the balance.




      6.

        **Error handling with fallback tools**
        When a tool call fails — and it will — your agent needs a plan. Retry once with corrected parameters. If that fails, try a fallback tool. If all tools fail, tell the user what happened honestly and suggest an alternative. Never silently swallow errors. Never make up data to fill the gap.




      7.

        **Evaluation across 5 dimensions**
        Before deploying, score your agent on **Accuracy** (correct answers), **Speed** (response time under 10 seconds for simple queries), **Reliability** (consistent results, no crashes), **Cost Efficiency** (affordable per interaction), and **User Satisfaction** (people actually like using it). All five must score 70 or higher.






  ## Common Agent Mistakes

  These are the mistakes that trip up most first-time agent builders. They are easy to make and expensive to fix in production. Learn them here so you do not learn them from angry users.




      **Too many tools (decision paralysis)**
      When an agent has 15 tools available, it spends more time deciding which tool to use than actually helping the user. Every extra tool adds a decision branch. With 4 tools, the agent has 4 options per step. With 15, it has 15 — and the probability of choosing wrong goes up fast. Start with 2-4 tools. Only add more when you have data showing users need them.



      **No guardrails (dangerous in production)**
      An agent without guardrails is a liability. It might share private data, execute destructive operations, or follow adversarial prompts that trick it into bypassing its own instructions. Guardrails are not optional safety theater — they are the walls that keep your agent inside the sandbox. "But my agent is just a demo" is not an excuse. Demos become products faster than you think.



      **No evaluation before deploy**
      Shipping an agent without a test suite is like launching a rocket without checking the fuel gauge. It might work. It might also explode spectacularly in front of your users. Build at least 20 test cases covering happy paths, edge cases, ambiguous inputs, and adversarial prompts. Run them. Score them. Only deploy when all five dimensions hit 70+.



      **Ignoring speed — a 45-second response frustrates users**
      Accuracy is not the only thing that matters. If your agent takes 45 seconds to answer a simple question, users will leave before they see how smart it is. Target under 5 seconds for simple queries and under 30 seconds for complex multi-tool tasks. If you are over that, look into caching, parallel tool calls, or routing simple questions to faster models.



      **No production monitoring**
      Your test suite passes. You deploy. Two weeks later, accuracy has dropped from 85% to 60% and nobody noticed. Why? User patterns changed, an API you depend on updated its response format, or the model drifted. Without production monitoring — logging every interaction, tracking error rates, reviewing failure cases weekly — you are flying blind. Pre-launch testing is the beginning, not the end.





  ## Pre-Quiz Review

  Make sure you can define each of these concepts before taking the quiz. If any term feels fuzzy, revisit the relevant lesson.




      **Agent Loop**
      The continuous cycle that defines agent behavior: perceive the environment, think about what to do, act using tools, observe the result, and learn from the outcome. Repeats until the goal is met.



      **Tool Calling**
      The mechanism that lets an agent interact with the real world. The model outputs a structured JSON request (function name + arguments), a runtime executes it, and the result feeds back into the conversation.



      **System Prompt**
      The instruction set that defines an agent's identity, goal, tools, memory behavior, guardrails, and output format. It is read before every interaction and shapes every decision the agent makes.



      **Guardrails**
      Hard boundaries the agent must never cross, regardless of user input. They protect against data leaks, destructive actions, and adversarial prompt injection. A guardrail is a rule, not a guideline.



      **Graceful Degradation**
      When a tool fails, the agent tries alternatives before giving up. Retry with corrected parameters, try a fallback tool, and only escalate to the user if all options are exhausted. Never silently fail. Never fabricate data.



      **Short-Term vs. Long-Term Memory**
      Short-term memory is the conversation history within a single session — it disappears when the session ends. Long-term memory persists across sessions using a database, letting the agent recall user preferences and past interactions.



      **The Five Evaluation Dimensions**
      Accuracy, Speed, Reliability, Cost Efficiency, and User Satisfaction. An agent must score 70+ on all five to be production-ready. One weak dimension can sink the entire user experience.



      **Chatbot vs. Agent**
      A chatbot responds to a single message and stops. An agent uses tools, maintains memory, and loops autonomously toward a goal. The difference is autonomy — an agent acts, observes, and adapts without waiting for the next human message.





    **Ready?** The quiz below covers all three modules — 8 multiple-choice questions. You need to understand the agent loop, system prompt blocks, tool calling, memory, error handling, guardrails, and evaluation. Take your time. Good luck.




### Quiz

**Q1: What is the fundamental difference between a chatbot and an agent?**
    A. Agents use more advanced AI models
  ✓ B. Agents can perceive, decide, act, and loop autonomously — chatbots just respond once
    C. Chatbots are free, agents cost money
    D. Agents always use voice, chatbots use text
  *The core difference is the agent loop: perceive → think → act → observe → learn → repeat. A chatbot does one thing: you ask, it answers. An agent operates autonomously toward a goal.*

**Q2: What happens in the Observe step of the agent loop?**
    A. The agent watches the user type
    B. The agent looks at its training data
  ✓ C. The agent checks the result of its action to see if it succeeded or failed
    D. The agent observes other agents working
  *Observation is the feedback step. After taking an action (calling a tool), the agent checks the result. Did it work? Did it fail? Was the data good? This closes the loop and enables self-correction.*

**Q3: Why does an agent need tools?**
    A. To look more professional
  ✓ B. Without tools, an agent can only generate text — tools let it actually DO things in the real world
    C. Tools make the AI faster
    D. Tools are optional — agents work fine without them
  *Tools are what separate agents from chatbots. Without tools, an agent can only generate text. With tools (APIs, databases, email, etc.), it can take actions, retrieve real data, and interact with the world.*

**Q4: What should a system prompt for an agent include?**
    A. Just the agent name
    B. Only a list of available tools
  ✓ C. Identity, goal, available tools, memory instructions, guardrails, and output format
    D. A copy of the agent training data
  *A complete agent system prompt covers all six blocks: Identity (who it is), Goal (what it is trying to do), Tools (what it can use), Memory (what it should remember), Guardrails (what it must never do), and Output Format (how to respond).*

**Q5: What is the main advantage of long-term memory over short-term memory?**
    A. Long-term memory is faster
  ✓ B. Long-term memory persists across sessions, so the agent improves over time instead of starting fresh
    C. Long-term memory is cheaper
    D. Short-term memory does not actually exist
  *Short-term memory helps within a single session but is lost when the session ends. Long-term memory persists — the agent remembers what worked, what failed, and user preferences across all interactions. This is how agents get genuinely smarter over time.*

**Q6: When an agent tool call fails, what is the best recovery strategy?**
    A. Retry the exact same call 100 times
    B. Tell the user I cannot do that and stop
  ✓ C. Try an alternative approach (fallback tool), and explain what happened to the user
    D. Ignore the error and make up a response
  *Graceful degradation: try alternatives first, be transparent about what happened, and only escalate if all fallbacks fail. Never hammer a failing service, give up immediately, or fabricate data.*

**Q7: An agent encounters a user request that conflicts with its guardrails. What should it do?**
    A. Override the guardrail — the user asked for it
    B. Silently do something different from what was asked
  ✓ C. Explain the conflict, refuse the unsafe action, and suggest a safe alternative
    D. Shut down completely
  *Guardrails exist for safety. The agent should never override them, but it should be helpful — explain WHY it cannot comply and offer an alternative path that achieves the user goal safely.*

**Q8: Which 5 dimensions should you evaluate an agent on before deploying?**
    A. Speed, color, size, weight, and temperature
  ✓ B. Accuracy, speed, reliability, cost efficiency, and user satisfaction
    C. Number of tools, model size, training data, compute, and uptime
    D. Revenue, profit, growth, retention, and churn
  *The five evaluation dimensions are: Accuracy (does it give correct answers?), Speed (how fast?), Reliability (does it work consistently?), Cost Efficiency (affordable at scale?), and User Satisfaction (are people happy?). All five need to meet your threshold before deploying.*



### Agent Concept Flashcards

**Card 1:**
Front: What is the agent loop?
Back: Perceive → Think → Act → Observe → Learn — a continuous cycle that runs until the agent achieves its goal.

**Card 2:**
Front: What makes an agent different from a chatbot?
Back: Agents use tools, maintain memory, and loop autonomously. Chatbots respond once per turn and have no persistent state.

**Card 3:**
Front: What are the 6 blocks of a good system prompt?
Back: Identity, Goal, Tools, Memory, Guardrails, Output Format.

**Card 4:**
Front: What is graceful degradation?
Back: When a tool fails, try fallback alternatives before escalating to the user. Never give up on the first failure.

**Card 5:**
Front: What are the 5 agent evaluation dimensions?
Back: Accuracy, Speed, Reliability, Cost Efficiency, User Satisfaction.
