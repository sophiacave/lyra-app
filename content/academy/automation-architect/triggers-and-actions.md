---
title: "Triggers and Actions"
course: "automation-architect"
order: 1
type: "lesson"
free: true
---<div class="container">
  <div class="header">
    <div class="tag">Automation Architect — Lesson 1</div>
    <h1>Triggers & Actions</h1>
    <p>Drag triggers and actions onto the canvas to build automation flows.</p>
  </div>

  <div class="hud">
    <div class="hud-item"><div class="hud-label">Challenge</div><div class="hud-val" id="challengeNum">1/3</div></div>
    <div class="hud-item"><div class="hud-label">Score</div><div class="hud-val" id="scoreVal">0</div></div>
  </div>

  <div class="challenge-dots">
    </div>

  <div class="challenge-bar">
    <div class="challenge-label">Build this automation</div>
    </div>

  <div class="builder">
    <div class="palette" id="triggerPalette">
      <div class="palette-title">Triggers</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="webhook"><span class="icon">🔗</span>Webhook</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="schedule"><span class="icon">⏰</span>Schedule</div>
      <div class="palette-node trigger" draggable="true" data-type="trigger" data-id="event"><span class="icon">⚡</span>Event</div>
    </div>

    <div class="canvas-area" id="canvasArea">
      <div class="canvas-label" id="canvasLabel">Drop a trigger here,<br>then add an action</div>
      <canvas id="flowCanvas"></canvas>
    </div>

    <div class="palette" id="actionPalette">
      <div class="palette-title">Actions</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="email"><span class="icon">📧</span>Send Email</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="database"><span class="icon">💾</span>Save to DB</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="api"><span class="icon">🌐</span>Call API</div>
      <div class="palette-node action" draggable="true" data-type="action" data-id="notify"><span class="icon">🔔</span>Notification</div>
    </div>
  </div>

  <button class="run-btn" id="runBtn" onclick="runFlow()">Run Automation</button>
  <div class="complete-card" id="completeCard">
    <h3>Lesson Complete!</h3>
    <p>You've built 3 real automation flows. You now understand how triggers initiate workflows and actions execute them.</p>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"Triggers vs Actions","cards":[{"front":"What is a Trigger?","back":"An event that starts an automation — the \"when\" that fires before any actions execute."},{"front":"What is an Action?","back":"The task performed after a trigger fires — e.g. send email, save to database, call API."},{"front":"Webhook Trigger","back":"Receives real-time HTTP POST data from an external system to start a workflow."},{"front":"Schedule Trigger","back":"Fires on a time-based schedule, like every day at 9 AM or every hour."},{"front":"Event Trigger","back":"Fires when something happens inside your app — like a new user signup."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match the Trigger to Its Use Case","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Webhook","right":"Form submitted on your site"},{"left":"Schedule","right":"Run report every Monday at 8 AM"},{"left":"Event","right":"New user signs up"},{"left":"Send Email","right":"Action: notify someone"},{"left":"Save to DB","right":"Action: persist incoming data"}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Triggers & Actions Check","questions":[{"q":"What is the role of a trigger in automation?","options":["Transform data into a new format","Start the automation when an event occurs","Store the result of an action","Connect two APIs together"],"correct":1,"explanation":"A trigger is the event that kicks off your automation — nothing runs until the trigger fires."},{"q":"Which of these is an action, not a trigger?","options":["New email arrives","Form submitted","Schedule fires","Send Slack notification"],"correct":3,"explanation":"Send Slack notification is what happens after a trigger — it is an action. The others are events that can start a workflow."},{"q":"A webhook trigger listens for what type of data?","options":["CSV files","Incoming HTTP POST requests","Database queries","Scheduled cron jobs"],"correct":1,"explanation":"A webhook is a URL that receives real-time HTTP POST data when an external event occurs."}]}'></div>

</div>
