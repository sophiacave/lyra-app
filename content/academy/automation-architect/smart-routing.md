---
title: "Smart Routing"
course: "automation-architect"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 3 &middot; Animated</div>
  <h1>Smart Routing</h1>
  <p>Use AI to classify incoming data and automatically route it to the right team. No rules engine needed.</p>
</header>

<div class="content">
  <h2>AI-Powered Classification</h2>
  <p class="section-text">Instead of writing hundreds of if/else rules, an AI classifier reads the content, determines intent, and routes data to the correct handler. One model replaces a wall of conditions.</p>

  <!-- Workflow diagram -->
  <div class="workflow">
    <div class="wf-row" style="justify-content:center">
      <div class="wf-node wf-input" id="wf-input">
        <div class="wf-icon">&#128232;</div>
        <div class="wf-label">Incoming Email</div>
        <div class="wf-sub">customer message</div>
      </div>
    </div>
    <div class="wf-connector"><div class="wf-line wf-line-down"></div></div>
    <div class="wf-row" style="justify-content:center">
      <div class="wf-node wf-ai" id="wf-ai">
        <div class="wf-icon">&#129504;</div>
        <div class="wf-label">AI Classifier</div>
        <div class="wf-sub">determines intent</div>
      </div>
    </div>
    <div class="wf-connector" style="display:flex;flex-direction:row;gap:6rem;justify-content:center;padding:0">
      <div style="display:flex;flex-direction:column;align-items:center;padding:.75rem 0"><div class="wf-line wf-line-left"></div></div>
      <div style="display:flex;flex-direction:column;align-items:center;padding:.75rem 0"><div class="wf-line wf-line-mid"></div></div>
      <div style="display:flex;flex-direction:column;align-items:center;padding:.75rem 0"><div class="wf-line wf-line-right"></div></div>
    </div>
    <div class="wf-branches">
      <div class="wf-branch">
        <div class="wf-node wf-billing" id="wf-billing">
          <div class="wf-icon">&#128179;</div>
          <div class="wf-label">Billing Team</div>
          <div class="wf-sub">invoices, payments</div>
        </div>
      </div>
      <div class="wf-branch">
        <div class="wf-node wf-support" id="wf-support">
          <div class="wf-icon">&#128736;</div>
          <div class="wf-label">Support Team</div>
          <div class="wf-sub">bugs, help requests</div>
        </div>
      </div>
      <div class="wf-branch">
        <div class="wf-node wf-sales" id="wf-sales">
          <div class="wf-icon">&#128176;</div>
          <div class="wf-label">Sales Team</div>
          <div class="wf-sub">upgrades, demos</div>
        </div>
      </div>
    </div>
  </div>

  <h2>Try It: Click an Email</h2>
  <p class="section-text">Click each sample email to see the AI classify its intent and route it to the correct team.</p>

  <div class="email-grid">
    <div class="email-card" id="email-billing" onclick="classifyEmail('billing')">
      <div class="email-from">From: jane@acme.co</div>
      <div class="email-subject">Invoice #4821 is incorrect</div>
      <div class="email-preview">Hi, I was charged $299 instead of $199 on my last invoice. Can you correct this and issue a refund for the difference?</div>
    </div>
    <div class="email-card" id="email-support" onclick="classifyEmail('support')">
      <div class="email-from">From: mike@startup.io</div>
      <div class="email-subject">Dashboard not loading</div>
      <div class="email-preview">Getting a blank white screen when I try to access the analytics dashboard. Cleared cache, tried different browser. Still broken.</div>
    </div>
    <div class="email-card" id="email-sales" onclick="classifyEmail('sales')">
      <div class="email-from">From: cto@enterprise.com</div>
      <div class="email-subject">Enterprise plan for 500 seats</div>
      <div class="email-preview">We're evaluating your platform for our engineering org (500+ people). Can we schedule a demo and discuss enterprise pricing?</div>
    </div>
  </div>

  <div class="classification-result" id="classResult">
    <div class="class-label">AI Classification</div>
    <div style="color:#52525b;font-size:.85rem">Click an email above to see the AI route it</div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Smart Routing Concepts","questions":[{"q":"What advantage does AI classification have over a rules engine for routing?","options":["It is always faster","It handles ambiguous and novel inputs without explicit rules","It never makes mistakes","It requires no training data"],"correct":1,"explanation":"AI classification handles ambiguous and novel inputs gracefully. A rules engine only matches patterns you have explicitly coded — AI generalizes from training data."},{"q":"What should happen when an AI classifier returns low confidence?","options":["Ignore the message","Route it randomly","Flag it for human review","Delete the data"],"correct":2,"explanation":"Low confidence means the AI is unsure. Flagging for human review prevents misrouting while keeping data safe — this is the human-in-the-loop pattern."},{"q":"In the smart routing diagram, what does the AI classifier output?","options":["A formatted email reply","An intent label and confidence score that determines the routing destination","A database record","A status code"],"correct":1,"explanation":"The AI classifier outputs an intent (e.g. billing_issue) and a confidence score. The workflow uses these to route to the correct team."}]}'></div>


  <div data-learn="FlashDeck" data-props='{"title":"AI Routing Concepts","cards":[{"front":"Intent classification","back":"An AI model reads text and assigns a category (intent) such as billing_issue, technical_support, or sales_inquiry."},{"front":"Confidence score","back":"A percentage (0-100%) representing how certain the AI is about its classification. Low confidence triggers human review."},{"front":"Human-in-the-loop","back":"A pattern where low-confidence AI decisions are escalated to a human instead of acted upon automatically."},{"front":"Rules engine vs AI classifier","back":"Rules engine: you write every if/else condition explicitly. AI classifier: trained model handles patterns including ones you never explicitly coded."},{"front":"Dead letter queue","back":"Where messages go if routing fails — preserves data for manual inspection and retry."}]}'></div>

</div>

<footer class="progress-footer"><p>Lesson 7 of 9 &middot; Automation Architect</p></footer>
