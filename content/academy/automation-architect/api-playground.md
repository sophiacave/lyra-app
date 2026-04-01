---
title: "API Playground"
course: "automation-architect"
order: 5
type: "lab"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 2 &middot; Interactive</div>
  <h1>API Playground</h1>
  <p>A fake API sandbox. Send real-looking requests and see how APIs respond. No backend needed.</p>
</header>

<div class="content">
  <div class="sandbox">
    <div class="sandbox-header">
      <div class="sandbox-title">API Sandbox v1.0</div>
    </div>
    <div class="request-bar">
      <select class="method-select" id="methodSelect">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input class="url-input" id="urlInput" value="/users" placeholder="/endpoint">
      <button class="send-btn" onclick="sendRequest()">Send</button>
    </div>
    <div class="body-section" id="bodySection">
      <label>Request Body (JSON)</label>
      <textarea class="body-input" id="bodyInput" placeholder='{ "key": "value" }'></textarea>
    </div>
    <div class="response-section">
      <div class="response-header">
        <div class="response-label">Response</div>
        </div>
      <div class="response-body" id="responseBody">// Send a request to see the response</div>
    </div>
  </div>

  <div class="examples">
    <h2>Try These Examples</h2>
    <div class="example-grid">
      <div class="example-btn" onclick="loadExample('GET','/users','')">
        <div class="example-method get">GET</div>
        <div class="example-path">/users</div>
        <div class="example-desc">List all users</div>
      </div>
      <div class="example-btn" onclick="loadExample('POST','/orders',JSON.stringify({product:'Pro Plan',amount:7900,customer:'cus_42'},null,2))">
        <div class="example-method post">POST</div>
        <div class="example-path">/orders</div>
        <div class="example-desc">Create a new order</div>
      </div>
      <div class="example-btn" onclick="loadExample('PUT','/settings',JSON.stringify({theme:'dark',notifications:true},null,2))">
        <div class="example-method put">PUT</div>
        <div class="example-path">/settings</div>
        <div class="example-desc">Update user settings</div>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"API Playground Check","questions":[{"q":"Which endpoint and method would you use to list all users?","options":["POST /users","GET /users","DELETE /users","PUT /users"],"correct":1,"explanation":"GET /users retrieves the list of all users without modifying any data."},{"q":"What status code does the sandbox return when you successfully create an order?","options":["200 OK","404 Not Found","201 Created","500 Server Error"],"correct":2,"explanation":"POST requests that successfully create a resource return 201 Created."},{"q":"What happens when you send a request to an endpoint that does not exist in the sandbox?","options":["The server crashes","You get a 200 OK with empty data","You get a 404 Not Found with available endpoints listed","You get a 201 Created"],"correct":2,"explanation":"The sandbox returns 404 Not Found and lists the available endpoints so you know what to try."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"API Request Anatomy","cards":[{"front":"Request Method","back":"Tells the server what operation to perform: GET (read), POST (create), PUT (update), DELETE (remove)."},{"front":"Endpoint URL","back":"The address of the resource you want to interact with. Example: /users, /orders/42."},{"front":"Request Body","back":"JSON data sent with POST and PUT requests. Tells the server what to create or update."},{"front":"Response Status Code","back":"A 3-digit number the server sends back. 2xx = success, 4xx = client error, 5xx = server error."},{"front":"Response Body","back":"The JSON data the server sends back. Contains the result of your request."}]}'></div>


</div>

<footer class="progress-footer">
  <p>Lesson 5 of 9 &middot; Automation Architect</p>
</footer>
