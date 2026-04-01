---
title: "Orchestration Patterns"
course: "the-automation-lab"
order: 5
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 5</div>
  <h1>Orchestration Patterns</h1>
  <p class="subtitle">Four patterns for coordinating multiple agents. Each solves different problems. Click a pattern to see it animate, then quiz yourself on when to use which.</p>

  <div class="patterns-grid">
    <div class="pattern-card active" onclick="selectPattern(0)"><div class="pattern-icon">&#8594;</div><div class="pattern-name">Pipeline</div><div class="pattern-desc">A &rarr; B &rarr; C. Sequential. Each agent's output becomes the next agent's input.</div></div>
    <div class="pattern-card" onclick="selectPattern(1)"><div class="pattern-icon">&#128268;</div><div class="pattern-name">Fan-Out</div><div class="pattern-desc">A &rarr; B, C, D. Parallel. One agent triggers many simultaneously.</div></div>
    <div class="pattern-card" onclick="selectPattern(2)"><div class="pattern-icon">&#128065;&#65039;</div><div class="pattern-name">Supervisor</div><div class="pattern-desc">S monitors A, B, C. Overseer watches workers and intervenes when needed.</div></div>
    <div class="pattern-card" onclick="selectPattern(3)"><div class="pattern-icon">&#129704;</div><div class="pattern-name">Swarm</div><div class="pattern-desc">All agents coordinate peer-to-peer. No hierarchy. Emergent behavior.</div></div>
  </div>

  <div class="pattern-demo">
    <div class="demo-header">
      <div class="demo-title" id="demo-title">Pipeline Pattern</div>
      <button class="demo-play" onclick="playDemo()">&#9654; Animate</button>
    </div>
    <div class="demo-canvas" id="demo-canvas"></div>
    <pre class="demo-log" id="demo-log"></pre>
    </div>

  <h2 class="section-title">&#129504; When to Use Which?</h2>
  <div id="quiz-section"></div>
  <div class="quiz-fb" id="quiz-fb" style="display:none"></div>

  <div data-learn="QuizMC" data-props='{"title":"Orchestration Patterns Quiz","questions":[{"q":"You need to process user uploads: validate, then resize, then store, then notify. What pattern?","options":["Fan-Out","Pipeline","Supervisor","Swarm"],"correct":1,"explanation":"Sequential processing where each step depends on the previous — classic Pipeline pattern."},{"q":"A new blog post needs to be shared on Twitter, LinkedIn, Email, and Slack simultaneously. What pattern?","options":["Pipeline","Supervisor","Fan-Out","Swarm"],"correct":2,"explanation":"One trigger, multiple independent actions in parallel — Fan-Out pattern."},{"q":"You have 5 unreliable scraping agents and need one to watch them all and restart failures. What pattern?","options":["Fan-Out","Swarm","Pipeline","Supervisor"],"correct":3,"explanation":"A dedicated overseer monitoring workers — Supervisor pattern."},{"q":"What is the key characteristic of the Swarm pattern?","options":["One master agent controls all workers","Agents process tasks sequentially","Agents coordinate peer-to-peer with no central hierarchy","A scheduler triggers agents one by one"],"correct":2,"explanation":"Swarms have no hierarchy — agents coordinate directly with each other. Behavior emerges from their interactions."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"The 4 Orchestration Patterns","cards":[{"front":"Pipeline Pattern","back":"A → B → C. Sequential. Each agent\u0027s output is the next agent\u0027s input. Use when steps must happen in order and each depends on the last."},{"front":"Fan-Out Pattern","back":"A → B, C, D simultaneously. Use when one event needs to trigger multiple independent actions in parallel (e.g., publish to all channels at once)."},{"front":"Supervisor Pattern","back":"A supervisor agent watches workers and intervenes when one fails. Use when reliability is critical and you need automatic recovery."},{"front":"Swarm Pattern","back":"Agents coordinate peer-to-peer with no hierarchy. Emergent behavior. Use for distributed, resilient workloads where no single point of control is needed."},{"front":"When does Pipeline fail?","back":"When one step blocks — the whole pipeline stalls. Not suitable for independent parallel work."},{"front":"When does Fan-Out fail?","back":"When the downstream agents\u0027 results need to be merged or ordered. Fan-Out is for fire-and-forget parallel work."}]}'></div>


</div>
