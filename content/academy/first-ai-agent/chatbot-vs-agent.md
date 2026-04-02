---
title: "Chatbot vs Agent"
course: "first-ai-agent"
order: 1
type: "lesson"
free: true
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/first-ai-agent/">First AI Agent</a>
  <span class="lesson-badge">Lesson 1 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Chatbot vs Agent</h1>
  <p class="sub">They both use AI. But one is a tool and the other is a worker. Understanding this distinction is the foundation of everything you will build in this course.</p>
</div>

  <div class="section">
    <h2>The Core Difference</h2>
    <p>A chatbot generates text. An agent takes action. That is the entire distinction — and it changes everything about how you build AI systems.</p>

    <div class="comparison">
      <div class="side side-chatbot">
        <h3>Chatbot</h3>
        <div class="trait"><span class="x-mark">&#x2717;</span> You ask, it answers — done</div>
        <div class="trait"><span class="x-mark">&#x2717;</span> No memory between messages</div>
        <div class="trait"><span class="x-mark">&#x2717;</span> Can't take actions</div>
        <div class="trait"><span class="x-mark">&#x2717;</span> Waits for your input</div>
        <div class="trait"><span class="x-mark">&#x2717;</span> Single turn interaction</div>
      </div>
      <div class="side side-agent">
        <h3>Agent</h3>
        <div class="trait"><span class="check-mark">&#x2713;</span> Perceives &rarr; Decides &rarr; Acts</div>
        <div class="trait"><span class="check-mark">&#x2713;</span> Remembers context &amp; history</div>
        <div class="trait"><span class="check-mark">&#x2713;</span> Uses tools to do real work</div>
        <div class="trait"><span class="check-mark">&#x2713;</span> Operates autonomously</div>
        <div class="trait"><span class="check-mark">&#x2713;</span> Loops until goal is met</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>See the Difference in Code</h2>
    <p>Here is the same task — "email my team about tomorrow's meeting" — handled by a chatbot vs an agent:</p>

    <div style="display:flex;flex-direction:column;gap:1rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Chatbot Approach</strong>
        <div style="background:#0a0a0f;border-radius:8px;padding:.75rem;margin:.5rem 0;font-family:monospace;font-size:.75rem;line-height:1.6;overflow-x:auto">
          <span style="color:#71717a"># Chatbot: one API call, returns text, done</span><br>
          <span style="color:#e2e8f0">response</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<br>
          &nbsp;&nbsp;<span style="color:#e2e8f0">model</span>=<span style="color:#fb923c">"claude-sonnet-4-6"</span>,<br>
          &nbsp;&nbsp;<span style="color:#e2e8f0">messages</span>=[{<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>,<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#fb923c">"Write an email about tomorrow's meeting"</span>}]<br>
          )<br>
          <span style="color:#34d399">print</span>(<span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span>[<span style="color:#fb923c">0</span>].<span style="color:#e2e8f0">text</span>)<br>
          <span style="color:#71717a"># Output: "Subject: Tomorrow's Meeting..."</span><br>
          <span style="color:#71717a"># YOU have to copy this, open Gmail, paste, find</span><br>
          <span style="color:#71717a"># team emails, and send it yourself. The AI is done.</span>
        </div>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Agent Approach</strong>
        <div style="background:#0a0a0f;border-radius:8px;padding:.75rem;margin:.5rem 0;font-family:monospace;font-size:.75rem;line-height:1.6;overflow-x:auto">
          <span style="color:#71717a"># Agent: loops, uses tools, takes real action</span><br>
          <span style="color:#71717a"># Loop 1: Check calendar for meeting details</span><br>
          <span style="color:#71717a"># → tool_use: calendar.get_events(date="tomorrow")</span><br>
          <span style="color:#71717a"># → result: "Sprint Planning, 10am, Room 4B"</span><br>
          <br>
          <span style="color:#71717a"># Loop 2: Get team email addresses</span><br>
          <span style="color:#71717a"># → tool_use: contacts.search(group="engineering")</span><br>
          <span style="color:#71717a"># → result: ["alice@co.com", "bob@co.com", ...]</span><br>
          <br>
          <span style="color:#71717a"># Loop 3: Compose and send the email</span><br>
          <span style="color:#71717a"># → tool_use: email.send(</span><br>
          <span style="color:#71717a">#     to=["alice@co.com", "bob@co.com"],</span><br>
          <span style="color:#71717a">#     subject="Sprint Planning Tomorrow 10am",</span><br>
          <span style="color:#71717a">#     body="Hi team, reminder: Sprint Planning..."</span><br>
          <span style="color:#71717a"># )</span><br>
          <br>
          <span style="color:#71717a"># Loop 4: Confirm success</span><br>
          <span style="color:#71717a"># → "Done. Sent to 8 team members about Sprint</span><br>
          <span style="color:#71717a">#    Planning at 10am in Room 4B."</span>
        </div>
      </div>
    </div>

    <p>The chatbot wrote text. The agent checked the calendar, found the team, composed a relevant email, and sent it. Four loops, three tool calls, zero human effort beyond the initial request.</p>

    <p>Here is a minimal agent skeleton in Python — this is the foundation everything else in this course builds on:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Minimal agent loop (the foundation)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()
messages = []
tools = [<span style="color:#71717a"># your tool definitions here</span>]

<span style="color:#c084fc">def</span> <span style="color:#34d399">agent_loop</span>(user_input):
    messages.append({<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"content"</span>: user_input})

    <span style="color:#c084fc">while True</span>:  <span style="color:#71717a"># ← THE LOOP (keeps going until done)</span>
        response = client.messages.create(
            model=<span style="color:#fb923c">"claude-sonnet-4-6"</span>,
            messages=messages,
            tools=tools,
            max_tokens=<span style="color:#fb923c">1024</span>
        )

        <span style="color:#71717a"># If Claude wants to use a tool → execute it</span>
        <span style="color:#c084fc">if</span> response.stop_reason == <span style="color:#fb923c">"tool_use"</span>:
            tool_result = execute_tool(response)
            messages.append(tool_result)
            <span style="color:#c084fc">continue</span>  <span style="color:#71717a"># ← loop again</span>

        <span style="color:#71717a"># Otherwise Claude is done → return the answer</span>
        <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text</code></pre>
</div>

  </div>

  <div class="section">
    <h2>The Three Requirements for Agency</h2>
    <p>An AI system becomes an agent when it has all three of these. Missing even one and it falls back to being a chatbot:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">1. Tools</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The ability to take real actions — call APIs, read files, send emails, query databases. Without tools, the AI can only generate text. With tools, it changes the world.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">2. Memory</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The ability to remember past actions and their results. Without memory, every loop starts from scratch. With memory, the agent builds on what it learned.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">3. A Loop</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The ability to call the LLM multiple times, feeding results back in. Without a loop, the AI responds once. With a loop, it works until the job is done.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Real Examples in the Wild</h2>
    <p>You are already using agents — you just might not have known the name:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.75rem;min-width:110px">CLAUDE CODE</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Agent.</strong> Reads your codebase, plans changes, edits files, runs tests, fixes errors, loops until the code works. Dozens of tool calls per task.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#fb923c;font-weight:700;font-size:.75rem;min-width:110px">CHATGPT</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Chatbot (mostly).</strong> You ask, it answers. When you use Code Interpreter or web browsing, it edges toward agent behavior — but it stops after one action.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#34d399;font-weight:700;font-size:.75rem;min-width:110px">GMAIL FILTER</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Automation.</strong> Trigger + action, no AI reasoning. "If from X, apply label Y." It does not think — it follows a rule. One step below an agent.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#f472b6;font-weight:700;font-size:.75rem;min-width:110px">DEVIN</span>
        <span style="font-size:.85rem;color:#a1a1aa"><strong>Agent.</strong> Receives a task, plans its approach, writes code, runs tests, debugs failures, deploys. Full autonomy loop across hours of work.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Spectrum</h2>
    <p>Chatbot and agent are not binary — they exist on a spectrum. As you add tools, memory, and loops, the system moves from chatbot toward full agent:</p>

    <div style="display:flex;align-items:center;gap:.3rem;margin:1.5rem 0;flex-wrap:wrap;justify-content:center">
      <div style="padding:.4rem .6rem;border-radius:6px;background:rgba(239,68,68,.08);font-size:.7rem;color:#ef4444;text-align:center">Chatbot<br><span style="font-size:.6rem;color:#a1a1aa">text only</span></div>
      <span style="color:#52525b">&rarr;</span>
      <div style="padding:.4rem .6rem;border-radius:6px;background:rgba(251,146,60,.08);font-size:.7rem;color:#fb923c;text-align:center">+ Tools<br><span style="font-size:.6rem;color:#a1a1aa">can act once</span></div>
      <span style="color:#52525b">&rarr;</span>
      <div style="padding:.4rem .6rem;border-radius:6px;background:rgba(139,92,246,.08);font-size:.7rem;color:#8b5cf6;text-align:center">+ Memory<br><span style="font-size:.6rem;color:#a1a1aa">learns over time</span></div>
      <span style="color:#52525b">&rarr;</span>
      <div style="padding:.4rem .6rem;border-radius:6px;background:rgba(52,211,153,.08);font-size:.7rem;color:#34d399;text-align:center">+ Loop<br><span style="font-size:.6rem;color:#a1a1aa">works until done</span></div>
      <span style="color:#52525b">&rarr;</span>
      <div style="padding:.4rem .6rem;border-radius:6px;background:rgba(52,211,153,.15);font-size:.7rem;color:#34d399;font-weight:700;text-align:center">Full Agent<br><span style="font-size:.6rem;color:#a1a1aa">autonomous</span></div>
    </div>
  </div>
</div>

  <div class="section">
    <h2>When to Build a Chatbot vs an Agent</h2>
    <p>Not every AI feature needs an agent. Use these criteria to decide which architecture fits your use case:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Build a Chatbot When...</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The user just needs <strong>information</strong> — answering questions, summarizing documents, translating text, or brainstorming ideas. No external systems need to change. The interaction is one question, one answer. Example: a FAQ bot that answers product questions from documentation.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Build an Agent When...</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">The task requires <strong>real-world actions</strong> — sending emails, updating databases, calling APIs, creating files. The AI needs to gather information from multiple sources, make decisions, and execute a multi-step plan. Example: a support agent that looks up the customer, diagnoses the issue, applies a fix, and sends a confirmation email.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Consider Complexity vs Cost</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Agents use more API calls (each loop iteration is a separate call), require error handling for tool failures, and need safety guardrails to prevent unintended actions. If a chatbot solves the problem, an agent adds unnecessary cost and risk. Start with a chatbot — upgrade to an agent only when you need action, memory, or multi-step reasoning.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">The Hybrid Path</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Many production systems start as chatbots and evolve into agents. Ship a chatbot first, track which queries require human follow-up actions, then add tools for those specific actions. This iterative approach reduces risk and lets real user behavior guide your architecture decisions.</p>
      </div>
    </div>
  </div>

<div data-learn="QuizMC" data-props='{"title":"Chatbot or Agent?","questions":[{"q":"I ask ChatGPT to write an email. It writes it and shows it to me. I copy-paste it into Gmail myself. What is this?","options":["Agent — it processed my request","Chatbot — it only generated text, I took the action","Agent — it used memory","Chatbot — it required voice input"],"correct":1,"explanation":"The AI just generated text — it did not send it, track it, or follow up. You had to do the action. That is a chatbot pattern."},{"q":"An AI system monitors a website every hour. If it detects downtime, it restarts the server, checks if it worked, and pages the engineer if not. What is this?","options":["Chatbot — it answers questions about the website","Agent — it perceives, decides, acts, and loops","Chatbot — it runs on a schedule","Agent — only because it sends notifications"],"correct":1,"explanation":"It perceives (monitors), thinks (is it down?), acts (restart), observes (did it work?), and escalates. Full agent loop with error handling."},{"q":"Which of the three requirements for agency does a Gmail filter lack?","options":["Tools — it cannot take actions","Memory — it cannot remember past emails","A reasoning loop — it follows fixed rules without AI decision-making","All three"],"correct":2,"explanation":"A Gmail filter has tools (apply label, forward) and basic memory (filter rules persist). But it has no reasoning loop — it follows fixed if/then rules without thinking. Add AI reasoning and it becomes an agent."},{"q":"What is the most important difference between a chatbot and an agent?","options":["Agents are more expensive to run","Agents use better models","Agents take real-world actions through tools in an autonomous loop","Agents have prettier interfaces"],"correct":2,"explanation":"The core distinction is action + autonomy. A chatbot generates text. An agent uses tools to change the world and loops until the goal is met. The model can be the same — the architecture is what differs."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Chatbot vs Agent Key Concepts","cards":[{"front":"What is a chatbot?","back":"A system that takes a single input and returns a single output. No memory, no actions, no loop. You ask, it answers, done."},{"front":"What is an agent?","back":"A system that perceives input, reasons about goals, takes actions via tools, observes results, and loops autonomously until the goal is met."},{"front":"The three requirements for agency","back":"(1) Tools — the ability to take real actions. (2) Memory — the ability to remember past results. (3) A loop — the ability to call the LLM multiple times, feeding results back in."},{"front":"What is the agent loop?","back":"Perceive → Think → Act → Observe → Learn — the continuous cycle that separates agents from chatbots. The loop runs until the goal is achieved or a stop condition is hit."},{"front":"Why do agents need tools?","back":"Tools let agents take real actions in the world — sending emails, querying databases, calling APIs. Without tools, the AI can only generate text."},{"front":"Why do agents need memory?","back":"Memory lets agents build on previous actions. Without memory, every loop starts from scratch. With memory, the agent accumulates knowledge and avoids repeating mistakes."},{"front":"The chatbot-to-agent spectrum","back":"Text only → + Tools (can act once) → + Memory (learns) → + Loop (works until done) → Full Agent (autonomous). Each addition moves the system closer to true agency."}]}'></div>
