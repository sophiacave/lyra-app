---
title: "API Quiz"
course: "automation-architect"
order: 6
type: "quiz"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<header class="lesson-header">
  <div class="lesson-badge">Module 2 &middot; Quiz</div>
  <h1>API Quiz</h1>
  <p>Test your knowledge of HTTP methods, status codes, headers, and authentication.</p>
</header>
<div class="content">

  <div data-learn="QuizMC" data-props='{"title":"API Knowledge Check","questions":[{"q":"Which HTTP method is used to retrieve data without modifying it?","options":["POST","GET","PUT","DELETE"],"correct":1,"explanation":"GET is the read-only method. It retrieves data from the server without changing anything."},{"q":"What does a 201 status code mean?","options":["OK — request succeeded","Resource was created successfully","Resource not found","Server error"],"correct":1,"explanation":"201 Created means the server successfully created a new resource, typically returned after a POST request."},{"q":"Where is an API key typically sent in a request?","options":["In the URL path","In the response body","In the Authorization header","In the status code"],"correct":2,"explanation":"Best practice is to send API keys in headers such as Authorization: Bearer token or X-API-Key: key. This keeps credentials out of URLs where they might be logged."},{"q":"What does a 404 status code indicate?","options":["Authentication required","Request was malformed","The requested resource was not found","Server crashed"],"correct":2,"explanation":"404 Not Found means the server understood your request but the resource at that URL does not exist."},{"q":"Which content type header indicates you are sending JSON data?","options":["text/html","application/json","multipart/form-data","text/plain"],"correct":1,"explanation":"application/json tells the server that your request body contains JSON-formatted data."},{"q":"What is the difference between PUT and POST?","options":["PUT creates, POST updates","PUT updates or replaces, POST creates","They are identical","PUT deletes, POST reads"],"correct":1,"explanation":"PUT updates or replaces an existing resource. POST creates a new resource. PUT is idempotent — same result each time."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"API Headers & Auth","cards":[{"front":"Authorization header","back":"Sends authentication credentials with a request. Common formats: Bearer <token> for OAuth, X-API-Key: <key> for API keys."},{"front":"Content-Type header","back":"Tells the server the format of your request body. Use application/json when sending JSON data."},{"front":"Accept header","back":"Tells the server what format you want in the response. Example: Accept: application/json."},{"front":"Bearer token","back":"An OAuth access token sent in the Authorization header: Authorization: Bearer <token>"},{"front":"401 vs 403","back":"401 Unauthorized = no valid credentials sent. 403 Forbidden = credentials are valid but you do not have permission."}]}'></div>


</div>
<footer class="progress-footer"><p>Lesson 6 of 9 &middot; Automation Architect</p></footer>
