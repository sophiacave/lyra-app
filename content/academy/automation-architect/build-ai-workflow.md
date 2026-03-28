---
title: "Build AI Workflow"
course: "automation-architect"
order: 8
type: "builder"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 3 &middot; Interactive</div>
  <h1>Build AI Workflow</h1>
  <p>Assemble a workflow from components: trigger, AI classify, filter, transform, and action. Then simulate data flowing through it.</p>
</header>

<div class="content">
  <div class="palette">
    <h2>Component Palette</h2>
    <p>Click components to add them to your workflow canvas. Build a pipeline that processes incoming data with AI.</p>
    <div class="palette-grid" id="paletteGrid">
      <div class="palette-item pi-trigger" onclick="addComponent('trigger')" id="pal-trigger">
        <div class="pi-icon">&#9889;</div>
        <div class="pi-name">Webhook Trigger</div>
        <div class="pi-type">trigger</div>
      </div>
      <div class="palette-item pi-ai" onclick="addComponent('ai')" id="pal-ai">
        <div class="pi-icon">&#129504;</div>
        <div class="pi-name">AI Classify</div>
        <div class="pi-type">ai (claude)</div>
      </div>
      <div class="palette-item pi-filter" onclick="addComponent('filter')" id="pal-filter">
        <div class="pi-icon">&#128269;</div>
        <div class="pi-name">Filter</div>
        <div class="pi-type">condition</div>
      </div>
      <div class="palette-item pi-transform" onclick="addComponent('transform')" id="pal-transform">
        <div class="pi-icon">&#128260;</div>
        <div class="pi-name">Transform</div>
        <div class="pi-type">reshape data</div>
      </div>
      <div class="palette-item pi-action" onclick="addComponent('action')" id="pal-action">
        <div class="pi-icon">&#128640;</div>
        <div class="pi-name">Send to Team</div>
        <div class="pi-type">action</div>
      </div>
    </div>
  </div>

  <div class="canvas" id="canvas">
    <div class="canvas-label" id="canvasEmpty">Click components above to build your workflow</div>
    <div id="canvasFlow"></div>
    </div>

  <div class="sim-log" id="simLog"></div>

  <div class="run-area">
    <button class="run-btn" id="runBtn" disabled onclick="runSimulation()">Run Simulation</button>
  </div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Workflow Components","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Webhook Trigger","right":"Receives incoming HTTP data to start the pipeline"},{"left":"AI Classify","right":"Reads content and assigns an intent label with confidence"},{"left":"Filter","right":"Only passes data that meets a confidence threshold"},{"left":"Transform","right":"Reshapes data structure for the next step"},{"left":"Send to Team","right":"Routes processed data to the correct destination"}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Order the AI Workflow Components","instruction":"Arrange these pipeline components in the correct order","items":["Webhook Trigger","AI Classify","Filter (confidence check)","Transform (reshape data)","Send to Team (action)"]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"AI Workflow Components","cards":[{"front":"Webhook Trigger","back":"Receives incoming HTTP data to start the pipeline. Every workflow begins with a trigger."},{"front":"AI Classify","back":"Claude reads the incoming content and assigns an intent label with a confidence score."},{"front":"Filter","back":"A condition gate — only passes data that meets the threshold. Example: confidence > 80%."},{"front":"Transform","back":"Reshapes the data structure for the next step. Example: extract team name and priority from the AI output."},{"front":"Send to Team (action)","back":"The final step — routes the processed data to the correct destination, creates a ticket, sends a notification."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"AI Workflow Quiz","questions":[{"q":"What is the purpose of the Filter step in an AI workflow?","options":["To classify the content","To receive incoming data","To only pass data that meets a confidence threshold","To format the final output"],"correct":2,"explanation":"The Filter step acts as a condition gate — it lets through only the data that meets your criteria, such as AI confidence above 80%."},{"q":"What does the Transform step do?","options":["Sends data to the team","Classifies intent","Reshapes the data structure for the next step","Receives the webhook payload"],"correct":2,"explanation":"Transform reshapes data — it takes the AI output and formats it into exactly what the action step needs, like extracting team name and priority."},{"q":"Why add a Filter between AI Classify and the action?","options":["To make the workflow longer","To prevent low-confidence misclassifications from being acted upon automatically","To increase processing speed","To store data in a database"],"correct":1,"explanation":"Filtering by confidence prevents the workflow from acting on uncertain AI outputs. Low-confidence results can be sent to a human review queue instead."}]}'></div>

</div>

<footer class="progress-footer"><p>Lesson 8 of 9 &middot; Automation Architect</p></footer>
