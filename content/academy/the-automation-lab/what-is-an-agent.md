---
title: "What Is an Agent?"
course: "the-automation-lab"
order: 1
type: "lesson"
free: true
---<div class="container">
  <div class="header">
    <div class="tag">The Automation Lab — Lesson 1</div>
    <h1>What Is an Agent?</h1>
    <p>Most "AI" you've seen is actually just automation — a trigger, an action, done. An agent is different: it perceives, decides, acts, and adapts in a continuous loop.</p>
  </div>

  <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.7">
    <strong style="color:#e5e5e5">An agent is a system that can:</strong> (1) observe its environment, (2) make decisions based on what it sees, (3) take real actions, and (4) keep going in a loop — adapting as it goes. It's not just following a script. It's responding to what's actually happening.
  </div>

  <div class="comparison">
    <div class="panel auto">
      <div class="panel-label">Automation</div>
      <div class="pipeline" id="autoPipeline">
        <div class="node node-auto" id="autoTrigger" style="opacity:0">Trigger</div>
        <div class="node node-auto" id="autoAction" style="opacity:0">Action</div>
        <div class="node node-auto" id="autoDone" style="opacity:0">Done</div>
      </div>
      <div class="auto-complete" id="autoComplete">Pipeline complete. Waiting for next trigger...</div>
    </div>

    <div class="panel agent">
      <div class="panel-label">Agent</div>
      <canvas id="agentCanvas"></canvas>
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div class="quiz-section">
    <h2>Automation or Agent?</h2>
    <p>Read each scenario and decide: is it an automation or an agent?</p>
    <div class="score-bar">
      <div class="score-item">Correct: <span id="quizScore">0</span>/5</div>
    </div>
    <div class="complete-card" id="completeCard">
      <h3>Lesson Complete!</h3>
      <p style="color:#a3a3a3;font-size:14px">You now understand the core difference: automations follow a fixed path, agents perceive, decide, act, and learn in a continuous loop.</p>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Agent vs. Automation","questions":[{"q":"A cron job sends a weekly analytics report every Monday at 9am. What is this?","options":["Agent","Automation","Both","Neither"],"correct":1,"explanation":"Fixed schedule, fixed action, no decision-making or adaptation. Classic automation."},{"q":"A system monitors your inbox, categorizes emails by urgency, drafts responses, and improves based on your corrections. What is this?","options":["Automation","Agent","Script","Workflow"],"correct":1,"explanation":"It perceives, decides, acts, and learns — the full agent loop."},{"q":"Which of these is part of the agent loop?","options":["Trigger → Action → Done","Perceive → Decide → Act → Learn","Input → Process → Output","Schedule → Run → Stop"],"correct":1,"explanation":"Agents run a continuous perceive-decide-act-learn cycle, not a fixed linear path."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Agent Concepts","cards":[{"front":"What makes an agent different from automation?","back":"An agent perceives its environment, makes decisions, takes actions, and adapts in a loop. Automations follow a fixed path with no decision-making."},{"front":"What are the 4 stages of the agent loop?","back":"Perceive → Decide → Act → Learn. The loop repeats continuously as the agent adapts to new information."},{"front":"Give an example of automation","back":"A cron job that resizes uploaded images on a fixed schedule — no decisions, no learning, just a trigger and a fixed action."},{"front":"Give an example of an agent","back":"A customer support bot that reads tickets, searches its knowledge base, resolves what it can, escalates the rest, and tracks which answers helped."}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Order the Agent Loop","instruction":"Arrange the four stages of the agent loop in the correct order","items":["Perceive — observe the environment","Decide — choose what to do based on observations","Act — take real action in the world","Learn — adapt based on outcomes"]}'></div>

</div>
