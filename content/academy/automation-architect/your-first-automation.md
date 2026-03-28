---
title: "Your First Automation"
course: "automation-architect"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 1 &middot; Interactive</div>
  <h1>Your First Automation</h1>
  <p>Pick a trigger, choose an action, wire them together, and deploy. You'll build a real automation pattern.</p>
</header>

<div class="content">
  <div class="step-indicator">
    <div class="step-dot active" id="step1"><span class="step-label">Pick Trigger</span><div class="dot">1</div></div>
    <div class="step-dot" id="step2"><span class="step-label">Pick Action</span><div class="dot">2</div></div>
    <div class="step-dot" id="step3"><span class="step-label">Deploy</span><div class="dot">3</div></div>
  </div>

  <!-- Step 1: Pick trigger -->
  <div class="builder-section" id="triggerSection">
    <h2>Step 1: Choose Your Trigger</h2>
    <p>What event starts your automation?</p>
    <div class="option-grid">
      <div class="option-card" onclick="pickTrigger('email','&#128232;','New Email','Fires when a new email arrives')">
        <div class="opt-icon">&#128232;</div>
        <div class="opt-name">New Email</div>
        <div class="opt-desc">Fires when a new email arrives in your inbox</div>
      </div>
      <div class="option-card" onclick="pickTrigger('form','&#128203;','Form Submission','Fires when someone submits a form')">
        <div class="opt-icon">&#128203;</div>
        <div class="opt-name">Form Submission</div>
        <div class="opt-desc">Fires when someone submits a form on your site</div>
      </div>
      <div class="option-card" onclick="pickTrigger('schedule','&#9200;','Schedule','Runs on a set schedule (e.g. daily)')">
        <div class="opt-icon">&#9200;</div>
        <div class="opt-name">Schedule</div>
        <div class="opt-desc">Runs on a set schedule, like every day at 9 AM</div>
      </div>
    </div>
  </div>

  <!-- Step 2: Pick action -->
  <div class="builder-section hidden" id="actionSection">
    <h2>Step 2: Choose Your Action</h2>
    <p>What should happen when the trigger fires?</p>
    <div class="option-grid">
      <div class="option-card" onclick="pickAction('db','&#128451;','Save to Database','Write the data to your database')">
        <div class="opt-icon">&#128451;</div>
        <div class="opt-name">Save to Database</div>
        <div class="opt-desc">Store the incoming data in your database</div>
      </div>
      <div class="option-card" onclick="pickAction('notify','&#128276;','Send Notification','Send a Slack or email alert')">
        <div class="opt-icon">&#128276;</div>
        <div class="opt-name">Send Notification</div>
        <div class="opt-desc">Alert your team via Slack or email</div>
      </div>
      <div class="option-card" onclick="pickAction('api','&#127760;','Call API','Hit an external API endpoint')">
        <div class="opt-icon">&#127760;</div>
        <div class="opt-name">Call API</div>
        <div class="opt-desc">Send a request to an external service</div>
      </div>
    </div>
  </div>

  <!-- Wiring diagram -->
  <div class="wiring-diagram">
    <h3>Your Automation</h3>
    <div class="wire-container">
      <div class="wire-node wire-empty" id="wireTrigger">
        <div class="wire-icon" id="wireTriggerIcon">?</div>
        <div class="wire-label" id="wireTriggerLabel">Trigger</div>
        <div class="wire-sublabel">not selected</div>
      </div>
      <div class="wire-connector">
        <div class="wire-arrow">&rarr;</div>
      </div>
      <div class="wire-node wire-empty" id="wireAction">
        <div class="wire-icon" id="wireActionIcon">?</div>
        <div class="wire-label" id="wireActionLabel">Action</div>
        <div class="wire-sublabel">not selected</div>
      </div>
    </div>
  </div>

  <!-- Step 3: Deploy -->
  <div class="deploy-area">
    <button class="deploy-btn" id="deployBtn" disabled onclick="deploy()">Deploy Automation</button>
  </div>

</div>

<div class="success-overlay" id="successOverlay">
  <div class="success-card">
    <div class="success-icon">&#9889;</div>
    <div class="success-title">Automation Deployed!</div>
    <div class="success-desc" id="successDesc">Your automation is live and waiting for triggers.</div>
    <button class="success-close" onclick="closeSuccess()">Continue</button>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 2 of 9 &middot; Automation Architect</p>
</footer>

<div data-learn="MatchConnect" data-props='{"title":"Match Automation Concepts","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Trigger","right":"The event that starts your automation running"},{"left":"Action","right":"What happens when the trigger fires"},{"left":"Event payload","right":"Structured data produced by the trigger for the action"},{"left":"Deploy","right":"Making the automation live so it runs automatically"},{"left":"Webhook","right":"An HTTP endpoint that listens for incoming data"}]}'></div>

<div data-learn="SortStack" data-props='{"title":"Order the Automation Steps","instruction":"Arrange these steps in the correct order to deploy an automation","items":["Choose your trigger event","Choose your action","Wire trigger to action","Test with sample data","Deploy automation"]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Automation Patterns","cards":[{"front":"Form Submission + Save to Database","back":"Classic data capture pattern: form data comes in via webhook, gets saved to a database for later use."},{"front":"Schedule + Call API","back":"Polling pattern: run a task on a timed schedule that hits an external API to sync or fetch data."},{"front":"New Email + Send Notification","back":"Alert pattern: incoming email triggers a Slack or push notification to your team."},{"front":"What flows between trigger and action?","back":"The event payload — structured data produced by the trigger that the action consumes and acts upon."},{"front":"What makes an automation \"deployed\"?","back":"The trigger is actively listening and will fire the action automatically when the event occurs — no manual run needed."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Your First Automation Quiz","questions":[{"q":"What must happen before you can select an action?","options":["Write the action code first","Pick a trigger first","Configure a database","Set up an API key"],"correct":1,"explanation":"You always start with a trigger — it defines the event that will cause the action to run."},{"q":"A \"Form Submission\" trigger fires when...","options":["You manually click a button","Someone submits a form on your site","A schedule timer elapses","An API returns an error"],"correct":1,"explanation":"The Form Submission trigger is a webhook that activates when your form receives a submission."},{"q":"What does deploying an automation mean?","options":["Saving a draft for later","Making the automation live so it runs automatically","Running it once manually","Sending it to a developer for review"],"correct":2,"explanation":"Deploying makes the automation active — the trigger starts listening and the action will execute automatically when the event fires."}]}'></div>

