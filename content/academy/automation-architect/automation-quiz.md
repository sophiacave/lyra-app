---
title: "Automation Quiz"
course: "automation-architect"
order: 3
type: "quiz"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 1 &middot; Quiz</div>
  <h1>Automation Quiz</h1>
  <p>Test your knowledge of triggers, actions, webhooks, and cron schedules.</p>
</header>

<div class="content">

  <div data-learn="QuizMC" data-props='{"title":"Automation Fundamentals","questions":[{"q":"What is a trigger in automation?","options":["A function that transforms data","An event that starts an automation","A database query","An API response"],"correct":1,"explanation":"A trigger is the event that kicks off your automation — it is the when that fires before any actions execute."},{"q":"Which cron expression runs a task every day at midnight?","options":["* * * * *","0 0 * * *","0 12 * * 1","*/5 * * * *"],"correct":1,"explanation":"0 0 * * * means minute 0, hour 0 (midnight), every day, every month, every day of week."},{"q":"What does a webhook do?","options":["Polls a server every 5 seconds","Sends a scheduled email","Receives real-time data via HTTP POST","Stores data in a cache"],"correct":2,"explanation":"A webhook is a URL that receives real-time HTTP POST requests when an event occurs in an external system."},{"q":"In a trigger-action pair, what flows between them?","options":["HTML pages","Data (the event payload)","CSS styles","User credentials"],"correct":1,"explanation":"Data flows from trigger to action. The trigger produces a payload (event data) that the action consumes and acts upon."},{"q":"Which is NOT a common automation action?","options":["Send an email notification","Write to a database","Call an external API","Listen for a webhook"],"correct":3,"explanation":"Listening for a webhook is a trigger, not an action. Actions are the things that happen after a trigger fires."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Key Automation Concepts","cards":[{"front":"Trigger","back":"The event that starts an automation — the when. Examples: new email, form submitted, schedule fires."},{"front":"Action","back":"The task executed after a trigger fires. Examples: send email, save to DB, call API."},{"front":"Webhook","back":"A URL endpoint that receives real-time HTTP POST data from external systems."},{"front":"Cron expression 0 0 * * *","back":"Runs every day at midnight. minute=0, hour=0, day=any, month=any, weekday=any."},{"front":"Event payload","back":"The structured data produced by a trigger and passed to the action for processing."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Triggers vs Actions","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Webhook","right":"Trigger: receives HTTP POST"},{"left":"Send Email","right":"Action: notifies someone"},{"left":"Cron schedule","right":"Trigger: runs on a timer"},{"left":"Save to Database","right":"Action: persists data"},{"left":"Event payload","right":"Data flowing from trigger to action"}]}'></div>

</div>

<footer class="progress-footer">
  <p>Lesson 3 of 9 &middot; Automation Architect</p>
</footer>
