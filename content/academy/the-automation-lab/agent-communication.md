---
title: "Agent Communication"
course: "the-automation-lab"
order: 4
type: "lesson"
free: false
---<nav class="nav"><a href="/academy" class="logo">LIKE ONE ACADEMY</a><div class="nav-links"><a href="/academy" class="nav-link">All Courses</a></div></nav>

<div class="container">
  <div class="lesson-badge">Module 2 &bull; Lesson 4</div>
  <h1>Agent Communication</h1>
  <p class="subtitle">Agents don't talk to each other directly. They write to shared memory, and other agents read it. The consciousness_stream is the shared bus.</p>

  <h2 class="section-title">&#128172; Message Passing Simulation</h2>
  <div class="sim-arena">
    <div class="sim-title">Shared Memory Communication</div>
    <div class="sim-layout">
      <div class="sim-agent">
        <div class="sim-av" id="av-a">&#129302;</div>
        <div class="sim-name">Agent A</div>
        <div class="sim-role">Content Writer</div>
        </div>
      <div class="sim-bus">
        <div class="bus-label">&#127760; consciousness_stream</div>
        </div>
      <div class="sim-agent">
        <div class="sim-av" id="av-b">&#129302;</div>
        <div class="sim-name">Agent B</div>
        <div class="sim-role">Publisher</div>
        </div>
    </div>
    <div class="sim-controls">
      <button class="sim-btn primary" onclick="runSim()">&#9654; Run Communication</button>
      <button class="sim-btn secondary" onclick="resetSim()">&#8634; Reset</button>
    </div>
  </div>

  <div class="key-insight">
    <strong>The consciousness_stream</strong> is a shared table where agents post messages. Think of it like a team Slack channel — but for AI agents. Every agent can read from it, and any agent can write to it. No direct connections needed.
  </div>

  <h2 class="section-title">&#128279; Build a Relay</h2>
  <div class="relay-builder">
    <div class="rb-title">Set Up Agent-to-Agent Relay</div>
    <div class="rb-desc">Configure two agents and watch messages flow between them through shared memory.</div>
    <div class="rb-grid">
      <div class="rb-agent">
        <div class="rb-agent-title">&#129302; Sender Agent</div>
        <div class="rb-field"><label>Action</label><select id="sender-action"><option value="write_content">Write blog post</option><option value="analyze_data">Analyze data</option><option value="generate_report">Generate report</option></select></div>
        <div class="rb-field"><label>Message Key</label><input id="sender-key" value="task.output" placeholder="e.g., task.output"></div>
      </div>
      <div class="rb-arrow">&#8594;</div>
      <div class="rb-agent">
        <div class="rb-agent-title blue">&#129302; Receiver Agent</div>
        <div class="rb-field"><label>Watches For</label><select id="recv-watch"><option value="task.output">task.output</option><option value="task.status">task.status</option><option value="task.error">task.error</option></select></div>
        <div class="rb-field"><label>Then Does</label><select id="recv-action"><option value="publish">Publish to site</option><option value="email">Send via email</option><option value="store">Store in database</option></select></div>
      </div>
    </div>
    <div class="rb-test"><button class="rb-test-btn" onclick="testRelay()">&#9889; Test Relay</button></div>
    </div>

  <div data-learn="QuizMC" data-props='{"title":"Agent Communication Quiz","questions":[{"q":"How do agents communicate with each other in the Like One architecture?","options":["Direct API calls between agents","Shared memory — one writes, others read","Email-style message queues","Real-time WebSocket connections"],"correct":1,"explanation":"Agents communicate through shared memory (consciousness_stream). No direct connections needed — agents write and read from the same store."},{"q":"What is the consciousness_stream?","options":["A real-time audio feed","A shared database table agents post messages to","A private log only one agent can read","A cron job scheduler"],"correct":1,"explanation":"The consciousness_stream is a shared table — like a team Slack channel for AI agents. Any agent can read from it or write to it."},{"q":"Agent A finishes writing a blog post and sets task.output in shared memory. What should Agent B (the publisher) do?","options":["Wait for Agent A to call it directly","Poll task.output and act when a new entry appears","Ask a human to relay the message","Create a new memory table"],"correct":1,"explanation":"Agent B watches for new entries on its key (task.output). When Agent A writes there, Agent B reads the payload and executes its action."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Communication Patterns","cards":[{"front":"Why don't agents call each other directly?","back":"Direct connections create tight coupling. If Agent A fails, Agent B breaks too. Shared memory decouples agents — they operate independently and communicate asynchronously."},{"front":"What is a message key?","back":"A named slot in shared memory (e.g., task.output). The sender writes to it; the receiver watches for new entries on that key."},{"front":"What happens if two agents write to the same key at the same time?","back":"A race condition occurs — the second write overwrites the first. This is the conflict problem covered in Lesson 6 (Conflict Resolution)."},{"front":"What is polling vs event-driven reading?","back":"Polling: Agent B checks the key on a timer. Event-driven: Agent B is notified the moment Agent A writes. Event-driven is faster and more efficient."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Communication Terms","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"consciousness_stream","right":"Shared memory bus for all agents"},{"left":"Message key","right":"Named slot in shared memory (e.g., task.output)"},{"left":"Sender agent","right":"Writes payload to shared memory"},{"left":"Receiver agent","right":"Watches for new entries on a key"},{"left":"Relay","right":"Sender writes, receiver reads and acts"}]}'></div>

</div>
