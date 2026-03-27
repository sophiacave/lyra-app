---
title: "What Is an API?"
course: "automation-architect"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 2 &middot; Animated</div>
  <h1>What Is an API?</h1>
  <p>APIs are how machines talk to each other. Master this and you can connect anything to anything.</p>
</header>

<div class="content">
  <h2>The Request / Response Cycle</h2>
  <p class="section-text">Every API interaction follows one pattern: your code sends a <strong>request</strong>, the server processes it, and sends back a <strong>response</strong>. Click a method below to see it in action.</p>

  <div class="api-animation" id="apiAnimation">
    <div class="api-entity entity-client">
      <div class="entity-icon">&#128187;</div>
      <div class="entity-label">Client</div>
      <div class="entity-sub">Your Code</div>
    </div>
    <div class="api-pipe" id="apiPipe">
      <div class="packet-label label-req" id="labelReq">REQUEST</div>
      <div class="packet-label label-res" id="labelRes">RESPONSE</div>
    </div>
    <div class="api-entity entity-server">
      <div class="entity-icon">&#9729;&#65039;</div>
      <div class="entity-label">Server</div>
      <div class="entity-sub">API Endpoint</div>
    </div>
  </div>

  <h2>HTTP Methods</h2>
  <p class="section-text">Click each method to see a real-world example with request and response details.</p>

  <div class="method-grid">
    <div class="method-card" data-method="GET" onclick="selectMethod('GET')"><div class="method-name">GET</div><div class="method-desc">Read data</div></div>
    <div class="method-card" data-method="POST" onclick="selectMethod('POST')"><div class="method-name">POST</div><div class="method-desc">Create data</div></div>
    <div class="method-card" data-method="PUT" onclick="selectMethod('PUT')"><div class="method-name">PUT</div><div class="method-desc">Update data</div></div>
    <div class="method-card" data-method="DELETE" onclick="selectMethod('DELETE')"><div class="method-name">DELETE</div><div class="method-desc">Remove data</div></div>
  </div>

  <div class="detail-panel" id="detailPanel">
    <h3 id="detailTitle">Click a method above to see its anatomy</h3>
    </div>

  <h2>Status Codes</h2>
  <p class="section-text">The server tells you what happened with a status code.</p>
  <div class="status-row">
    <div class="status-card status-2xx"><div class="status-code">200 OK</div><div class="status-label">Success &mdash; here's your data</div></div>
    <div class="status-card status-2xx"><div class="status-code">201 Created</div><div class="status-label">Success &mdash; resource was created</div></div>
    <div class="status-card status-4xx"><div class="status-code">400 Bad Request</div><div class="status-label">Your request was malformed</div></div>
  </div>
  <div class="status-row">
    <div class="status-card status-4xx"><div class="status-code">401 Unauthorized</div><div class="status-label">Missing or invalid auth</div></div>
    <div class="status-card status-4xx"><div class="status-code">404 Not Found</div><div class="status-label">Resource doesn't exist</div></div>
    <div class="status-card status-5xx"><div class="status-code">500 Server Error</div><div class="status-label">Something broke on the server</div></div>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"HTTP Methods","cards":[{"front":"GET","back":"Read data without modifying it. Safe and idempotent. Example: GET /users returns a list of users."},{"front":"POST","back":"Create a new resource. Sends a body with data. Returns 201 Created on success."},{"front":"PUT","back":"Update or replace an existing resource. Idempotent — same result if called multiple times."},{"front":"DELETE","back":"Remove a resource. Example: DELETE /users/42 removes user with id 42."},{"front":"Idempotent","back":"An operation that produces the same result no matter how many times you repeat it. GET, PUT, DELETE are idempotent. POST is not."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Status Codes","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"200 OK","right":"Request succeeded, data returned"},{"left":"201 Created","right":"New resource was created (POST)"},{"left":"401 Unauthorized","right":"Missing or invalid authentication"},{"left":"404 Not Found","right":"Resource does not exist at that URL"},{"left":"500 Server Error","right":"Something broke on the server side"}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"API Concepts Quiz","questions":[{"q":"Which HTTP method retrieves data without modifying anything?","options":["POST","PUT","GET","DELETE"],"correct":2,"explanation":"GET is the read-only method. It fetches data from the server without creating, updating, or deleting anything."},{"q":"What does a 404 status code mean?","options":["Authentication failed","Request was malformed","Resource not found","Server error"],"correct":2,"explanation":"404 Not Found means the server understood the request but there is no resource at that URL."},{"q":"What is the difference between POST and PUT?","options":["POST updates, PUT creates","POST creates, PUT updates or replaces","They are identical","POST deletes, PUT reads"],"correct":1,"explanation":"POST creates a new resource. PUT updates or replaces an existing resource. PUT is idempotent — POST is not."}]}'></div>

</div>

<footer class="progress-footer">
  <p>Lesson 4 of 9 &middot; Automation Architect</p>
</footer>
