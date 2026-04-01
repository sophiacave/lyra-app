---
title: "Build a Team"
course: "the-automation-lab"
order: 7
type: "builder"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 7</div>
  <h1>Build a Team</h1>
  <p class="subtitle">Given a business goal, assemble the right team of agents. Choose wisely — wrong teams fail. Three scenarios of increasing difficulty.</p>

  <div class="scen-nav" id="scen-nav"></div>

  <div class="game-header">
    <div class="game-mission"><div class="mission-label" id="mission-label">Mission 1 of 3</div><div class="mission-text" id="mission-text"></div><div class="mission-req" id="mission-req"></div></div>
    <div class="game-score"><div class="score-label">Score</div><div class="score-val" id="score">0</div></div>
  </div>

  <div class="game-area">
    <div class="pool"><div class="pool-title">&#129302; Agent Pool</div><div class="agent-pool" id="agent-pool"></div></div>
    <div class="team"><div class="team-title">&#128101; Your Team</div><div class="team-slots" id="team-slots"><span class="team-empty">Click agents to add them...</span></div></div>
  </div>

  <pre class="sim-output" id="sim-output" style="display:none"></pre>

  <div class="game-controls">
    <button class="game-btn run" id="run-btn" onclick="runSim()" disabled>&#9889; Run Simulation</button>
    <button class="game-btn reset" onclick="resetTeam()">&#8634; Reset Team</button>
  </div>

  <div class="result-card" id="result-card" style="display:none"><div class="result-icon" id="result-icon"></div><div class="result-text" id="result-text"></div><div class="result-detail" id="result-detail"></div></div>

  <div data-learn="QuizMC" data-props='{"title":"Team Composition Quiz","questions":[{"q":"You are building a content pipeline. Which three agents are essential?","options":["Writer, Scheduler, Monitor","Writer, Editor, Publisher","Analyst, Notifier, Guardian","Scheduler, Monitor, Guardian"],"correct":1,"explanation":"A content pipeline needs: Writer (creates content), Editor (quality control), Publisher (deploys it). Without any one of these, the pipeline fails."},{"q":"You are building a self-healing server monitor. Which agent enforces safety rules before allowing restarts?","options":["Notifier","Monitor","Scheduler","Guardian"],"correct":3,"explanation":"The Guardian agent checks compliance rules before allowing potentially dangerous actions like server restarts."},{"q":"Your analytics pipeline runs on a schedule but nobody knows when it breaks. Which missing agent fixes this?","options":["Writer","Editor","Monitor","Publisher"],"correct":2,"explanation":"A Monitor agent watches the pipeline health. Without it, failures go undetected until someone notices the missing report."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Agent Roles","cards":[{"front":"Content Writer agent","back":"Generates blog posts, emails, and social copy. Essential for any content pipeline."},{"front":"Editor agent","back":"Reviews, fact-checks, and improves content. Prevents errors from reaching production."},{"front":"Publisher agent","back":"Deploys content to websites and platforms. Without it, content sits in drafts forever."},{"front":"Monitor agent","back":"Watches systems for errors and anomalies. The first to know when something breaks."},{"front":"Guardian agent","back":"Enforces rules, checks compliance, and validates actions before they execute. Safety net for the whole system."},{"front":"Notifier agent","back":"Sends alerts via email, Slack, or SMS. Keeps humans in the loop when agents act."},{"front":"Scheduler agent","back":"Manages timing, cron jobs, and queues. Ensures tasks run at the right time."},{"front":"Analyst agent","back":"Analyzes metrics and generates reports. Turns raw data into actionable insight."}]}'></div>


</div>
