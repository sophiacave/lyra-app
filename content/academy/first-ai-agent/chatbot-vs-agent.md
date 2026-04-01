---
title: "Chatbot vs Agent"
course: "first-ai-agent"
order: 1
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 1 of 10</div>
  <h1>Chatbot vs Agent</h1>
  <p class="subtitle">They both use AI. But one is a tool, and the other is a worker. Let's see why that matters.</p>

  <div class="comparison">
    <div class="side side-chatbot">
      <h3>💬 Chatbot</h3>
      <div class="trait"><span class="x-mark">✗</span> You ask, it answers — done</div>
      <div class="trait"><span class="x-mark">✗</span> No memory between messages</div>
      <div class="trait"><span class="x-mark">✗</span> Can't take actions</div>
      <div class="trait"><span class="x-mark">✗</span> Waits for your input</div>
      <div class="trait"><span class="x-mark">✗</span> Single turn interaction</div>
    </div>
    <div class="side side-agent">
      <h3>🤖 Agent</h3>
      <div class="trait"><span class="check-mark">✓</span> Perceives → Decides → Acts</div>
      <div class="trait"><span class="check-mark">✓</span> Remembers context &amp; history</div>
      <div class="trait"><span class="check-mark">✓</span> Uses tools to do real work</div>
      <div class="trait"><span class="check-mark">✓</span> Operates autonomously</div>
      <div class="trait"><span class="check-mark">✓</span> Loops until goal is met</div>
    </div>
  </div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You can tell the difference between a chatbot and an agent. That's the first step to building one.</p>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Chatbot or Agent?","questions":[{"q":"I ask ChatGPT to write an email. It writes it and shows it to me. I copy-paste it into Gmail myself. What is this?","options":["Agent — it processed my request","Chatbot — it only generated text, I took the action","Agent — it used memory","Chatbot — it required voice input"],"correct":1,"explanation":"The AI just generated text — it did not send it, track it, or follow up. You had to do the action. That is a chatbot pattern."},{"q":"An AI system monitors my website every hour. If it detects downtime, it restarts the server, checks if it worked, and pages me if it did not. What is this?","options":["Chatbot — it answers questions about the website","Agent — it perceives, decides, acts, and loops","Chatbot — it runs on a schedule","Agent — only because it sends notifications"],"correct":1,"explanation":"It perceives (monitors), thinks (is it down?), acts (restart), observes (did it work?), and escalates. Full agent loop with error handling."},{"q":"I upload a PDF and ask the AI to summarize it. It gives me bullet points. What is this?","options":["Agent — it processed a file","Agent — it used memory to summarize","Chatbot — single input, single output, no action taken","Agent — it generated structured output"],"correct":2,"explanation":"Single input, single output, no memory, no action. Classic chatbot pattern — even though it is useful."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Chatbot vs Agent Key Concepts","cards":[{"front":"What is a chatbot?","back":"A system that takes a single input and returns a single output. No memory, no actions, no loop."},{"front":"What is an agent?","back":"A system that perceives input, thinks about context and goals, takes actions via tools, observes results, and learns — looping autonomously until the goal is met."},{"front":"What is the agent loop?","back":"Perceive → Think → Act → Observe → Learn — the continuous cycle that separates agents from chatbots."},{"front":"Why do agents need memory?","back":"Memory lets agents build context across turns and sessions, so they can make better decisions over time instead of starting from scratch."},{"front":"Why do agents need tools?","back":"Tools let agents take real actions in the world — sending emails, querying databases, calling APIs — instead of just generating text."}]}'></div>


</div>
