---
title: "Tool Calling Basics"
course: "first-ai-agent"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 7 of 10</div>
  <h1>Tool Calling Basics</h1>
  <p class="subtitle">Watch an agent decide which tool to use, make the call, and use the result. Pick a question to see the full flow.</p>

  <div class="question-picker">
    <h3>Pick a question for the agent to answer:</h3>
    <div class="q-grid" id="q-grid"></div>
    <div class="dots" id="dots"></div>
  </div>

  <div class="flow-viz" id="flow-viz"></div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You've seen how tool calling works — the agent reasons about what it needs, calls the right tool, and uses the result. This is the mechanism that makes agents powerful.</p>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Tool Calling Logic","questions":[{"q":"Why does an agent use a calculator tool instead of computing math itself?","options":["The calculator is faster to call than reasoning","LLMs are unreliable at precise math — a calculator tool guarantees exact results without hallucination","The calculator tool is always cheaper","Math is outside the agent training data"],"correct":1,"explanation":"LLMs produce probabilistic outputs. For precise calculations, a deterministic tool (calculator) eliminates the risk of hallucinated math. Good agents route tasks to the right tool for reliable results."},{"q":"An agent needs to email a team but does not have their addresses. What is the correct tool call sequence?","options":["Call email.send() immediately and let it fail","First call contacts.search() to get addresses, then call email.send() with the results","Ask the user to provide the email addresses","Skip the email and write a summary instead"],"correct":1,"explanation":"Chaining tool calls is a core agent skill. The agent reasons that it needs the email list before it can send — so it sequences the calls correctly: contacts first, then email. This is multi-step autonomous execution."},{"q":"When should an agent use a database tool instead of web search?","options":["Always — databases are always more accurate","When the needed data is company-specific and not publicly available online","When the agent wants a faster response","When the user explicitly requests it"],"correct":1,"explanation":"Tool selection is about data source. Company-specific data (expenses, customer records, internal metrics) lives in a database. Public real-time information (news, weather, current events) needs web search. The agent reasons about which source is appropriate."}]}'></div>


  <div data-learn="FlashDeck" data-props='{"title":"Tool Calling Concepts","cards":[{"front":"What is a tool call?","back":"A structured request the agent sends to an external function or API, with specific parameters, expecting a structured response it can use in its next reasoning step."},{"front":"What is chained tool calling?","back":"When an agent uses the output of one tool call as the input for a subsequent tool call — e.g., search for contacts, then use those contacts to send an email."},{"front":"Why does tool selection matter?","back":"Different questions require different data sources. Using the wrong tool produces wrong or stale answers. The agent must reason about which tool has the right data for each query."},{"front":"What is the Think step doing during tool selection?","back":"The agent analyzes the query, identifies what data or action is needed, matches that need to the available tools, and selects the best fit — all before making any call."},{"front":"What makes tool calling powerful vs just generating text?","back":"Tool calls produce real side effects — emails sent, database records updated, APIs triggered. The agent moves from generating information to causing change in the world."}]}'></div>

</div>
