---
title: "The Agent Loop"
course: "first-ai-agent"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 2 of 10</div>
  <h1>The Agent Loop</h1>
  <p class="subtitle">Every agent runs the same fundamental cycle. Click each node to understand what happens at every step.</p>

  <canvas id="loop-canvas"></canvas>
  <p class="hint">Click any node on the loop to explore it</p>

  <div class="info-panel" id="info">
    <h3 id="info-title">🔄 The Loop</h3>
    <p id="info-desc">This is the heartbeat of every AI agent. Unlike a chatbot that responds once and stops, an agent cycles through these five steps continuously until its goal is achieved. Click a node above to dive in.</p>
  </div>

  <div class="complete-section" id="complete">
    <h2>Lesson Complete!</h2>
    <p>You understand the agent loop — the core pattern behind every autonomous AI system.</p>
  </div>


  <div data-learn="QuizMC" data-props='{"title":"The Agent Loop","questions":[{"q":"What is the correct order of the agent loop steps?","options":["Think → Act → Perceive → Learn → Observe","Perceive → Think → Act → Observe → Learn","Act → Observe → Think → Learn → Perceive","Learn → Perceive → Think → Act → Observe"],"correct":1,"explanation":"The agent loop always starts with Perceive (taking in input), then Think (reasoning about what to do), Act (calling a tool), Observe (checking the result), and Learn (updating memory). Then it loops back to Perceive."},{"q":"What happens in the Think step of the agent loop?","options":["The agent generates a random action","The agent reasons using its goal, memory, and the current input to decide what to do next","The agent waits for the user to confirm its plan","The agent selects a tool at random"],"correct":1,"explanation":"The Think step is where the LLM does its core work. It combines the current input, relevant memory, and the agent goal to reason about the best next action. This is what gives agents their intelligence."},{"q":"Why is the Learn step critical for long-running agents?","options":["It makes the agent run faster","Without learning, the agent cannot improve — it will repeat mistakes indefinitely","It reduces the number of tool calls needed","It replaces the need for a system prompt"],"correct":1,"explanation":"The Learn step updates the agent memory with what just happened. Without it, the agent cannot accumulate knowledge across loops. With it, each cycle builds on the last — the agent becomes genuinely smarter over time."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Put the Agent Loop in Order","instruction":"Arrange the agent loop steps in the correct sequence","items":["Perceive — take in input from the environment","Think — reason about goal, memory, and current context","Act — call a tool to take a real action","Observe — check if the action succeeded or failed","Learn — store the outcome in memory"]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Agent Loop Step Definitions","cards":[{"front":"Perceive","back":"The agent takes in information from its environment — a user message, API response, file change, or scheduled trigger. Perception is how the agent knows something needs doing."},{"front":"Think","back":"The agent reasons about what it perceived, considering its goal, memory, and context. The LLM combines all inputs to decide the best next action."},{"front":"Act","back":"The agent calls a tool — sending an email, querying a database, making an API call, writing a file. This is what separates agents from chatbots: they do things."},{"front":"Observe","back":"After acting, the agent checks the result. Did the API call succeed? Was the data valid? Observation closes the feedback loop and enables self-correction."},{"front":"Learn","back":"The agent updates its memory with the outcome. What worked, what failed, what new information was discovered. Accumulated knowledge makes each loop smarter than the last."}]}'></div>

</div>
