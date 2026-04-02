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
  <p>APIs are how machines talk to each other. Master this and you can connect anything to anything — the foundation of every automation you will ever build.</p>
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

  <div style="padding:0 .5rem">
    <h2>What a Real API Request Looks Like</h2>
    <p class="section-text">Here is an actual API request to get a list of users. Every part is labeled:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.8rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># The request: GET method, URL, headers</span><br>
      <span style="color:#34d399">GET</span> <span style="color:#a1a1aa">https://api.example.com/users?limit=10</span><br>
      <span style="color:#8b5cf6">Authorization</span><span style="color:#52525b">:</span> <span style="color:#fb923c">Bearer sk_live_abc123...</span><br>
      <span style="color:#8b5cf6">Content-Type</span><span style="color:#52525b">:</span> <span style="color:#a1a1aa">application/json</span><br>
      <span style="color:#8b5cf6">Accept</span><span style="color:#52525b">:</span> <span style="color:#a1a1aa">application/json</span>
    </div>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="color:#34d399;font-weight:700;font-size:.8rem;min-width:90px">Method</span>
        <span style="font-size:.8rem;color:#a1a1aa"><code>GET</code> — what you want to do (read, create, update, delete)</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.8rem;min-width:90px">URL</span>
        <span style="font-size:.8rem;color:#a1a1aa">Where to send it. <code>?limit=10</code> is a query parameter — filters the results.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:90px">Headers</span>
        <span style="font-size:.8rem;color:#a1a1aa">Metadata about your request. <code>Authorization</code> proves who you are. <code>Content-Type</code> says what format you are using.</span>
      </div>
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

  <div style="padding:0 .5rem">
    <h2>Try It: cURL Examples</h2>
    <p class="section-text">cURL is the universal command-line tool for making API requests. These are real commands you can run in your terminal:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># GET — Read a list of users</span><br>
      <span style="color:#34d399">curl</span> <span style="color:#a1a1aa">https://jsonplaceholder.typicode.com/users</span><br><br>
      <span style="color:#71717a"># POST — Create a new post (with JSON body)</span><br>
      <span style="color:#34d399">curl</span> <span style="color:#fb923c">-X POST</span> <span style="color:#a1a1aa">https://jsonplaceholder.typicode.com/posts</span> \<br>
      &nbsp;&nbsp;<span style="color:#8b5cf6">-H</span> <span style="color:#a1a1aa">"Content-Type: application/json"</span> \<br>
      &nbsp;&nbsp;<span style="color:#8b5cf6">-d</span> <span style="color:#a1a1aa">'{"title": "My Post", "body": "Hello world"}'</span><br><br>
      <span style="color:#71717a"># DELETE — Remove a post</span><br>
      <span style="color:#34d399">curl</span> <span style="color:#fb923c">-X DELETE</span> <span style="color:#a1a1aa">https://jsonplaceholder.typicode.com/posts/1</span>
    </div>

    <p style="font-size:.85rem;color:#71717a;margin-top:.5rem">jsonplaceholder.typicode.com is a free fake API for learning. The data is not real, but the requests and responses work exactly like a production API. Try these in your terminal right now.</p>
  </div>

  <h2>Status Codes</h2>
  <p class="section-text">The server tells you what happened with a status code. Green means success, orange means your request had a problem, red means the server broke.</p>
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

  <div style="padding:0 .5rem">
    <h2>Authentication</h2>
    <p class="section-text">Most APIs require you to prove who you are before they respond. There are three common patterns:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">API Key</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A secret string you include in every request, usually as a header (<code>Authorization: Bearer sk_live_...</code>) or query parameter (<code>?api_key=...</code>). Simple, widely used. The key identifies your account and controls your access level.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem">Used by: Stripe, OpenAI, SendGrid, most SaaS APIs</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">OAuth 2.0</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The user grants your app permission through a login flow. You receive a <strong>token</strong> that expires and can be refreshed. More complex but more secure — the user can revoke access at any time.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem">Used by: Google, GitHub, Slack, Microsoft — any "Sign in with..." flow</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">JWT (JSON Web Token)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">A self-contained token that carries user identity and permissions. The server can verify it without checking a database. Commonly used for session management in modern web apps.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem">Used by: Supabase, Firebase, Auth0, custom APIs</div>
      </div>
    </div>
  </div>

  <div style="padding:0 .5rem">
    <h2>Rate Limiting</h2>
    <p class="section-text">APIs limit how many requests you can make per minute or hour. If you exceed the limit, you get a <code style="background:rgba(255,255,255,.05);padding:.15rem .4rem;border-radius:4px">429 Too Many Requests</code> response. This matters for automations because:</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);font-size:.85rem;color:#a1a1aa">
        <strong style="color:#e2e8f0">A loop calling an API 1000 times</strong> will get rate-limited after ~100 calls. Your automation needs to respect the limit and add delays between batches.
      </div>
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);font-size:.85rem;color:#a1a1aa">
        <strong style="color:#e2e8f0">The response header tells you your limit:</strong> Look for <code>X-RateLimit-Remaining</code> and <code>Retry-After</code> to know how many calls you have left and when to try again.
      </div>
    </div>
  </div>

  <div style="padding:0 .5rem">
    <h2>Common Debugging Patterns</h2>
    <p class="section-text">When an API call fails, check these in order:</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="color:#ef4444;font-weight:700;font-size:.8rem;min-width:30px">401</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>Check your API key.</strong> Is it in the right header? Is it the live key, not the test key? Has it been rotated or revoked?</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="color:#ef4444;font-weight:700;font-size:.8rem;min-width:30px">403</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>Permission issue.</strong> Your key is valid but does not have access to this resource. Check your account's permission scope.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="color:#ef4444;font-weight:700;font-size:.8rem;min-width:30px">404</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>Wrong URL or resource does not exist.</strong> Double-check the endpoint path and any IDs in the URL.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="color:#ef4444;font-weight:700;font-size:.8rem;min-width:30px">429</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>Rate limited.</strong> Wait for the <code>Retry-After</code> duration, then try again. Add delays between requests in your automation.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.5rem .75rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="color:#ef4444;font-weight:700;font-size:.8rem;min-width:30px">500</span>
        <span style="font-size:.8rem;color:#a1a1aa"><strong>Server-side error.</strong> Not your fault. Wait and retry. If persistent, check the API's status page.</span>
      </div>
    </div>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"API Concepts","cards":[{"front":"GET","back":"Read data without modifying it. Safe and idempotent. Example: GET /users returns a list of users."},{"front":"POST","back":"Create a new resource. Sends a body with data. Returns 201 Created on success. NOT idempotent — calling twice creates two resources."},{"front":"PUT","back":"Update or replace an existing resource. Idempotent — same result if called multiple times."},{"front":"DELETE","back":"Remove a resource. Example: DELETE /users/42 removes user with id 42."},{"front":"API Key","back":"A secret string included in every request to prove identity. Usually sent as Authorization: Bearer sk_live_... header. Simple and widely used."},{"front":"OAuth 2.0","back":"User grants your app permission via login flow. You receive an access token that expires and can be refreshed. User can revoke access anytime."},{"front":"Rate Limiting","back":"APIs cap how many requests you can make per time period. Exceeding returns 429 Too Many Requests. Check X-RateLimit-Remaining header."},{"front":"401 vs 403","back":"401 = not authenticated (missing or invalid credentials). 403 = authenticated but not authorized (no permission for this resource)."}]}'></div>


  <div data-learn="QuizMC" data-props='{"title":"API Concepts Quiz","questions":[{"q":"Which HTTP method retrieves data without modifying anything?","options":["POST","PUT","GET","DELETE"],"correct":2,"explanation":"GET is the read-only method. It fetches data from the server without creating, updating, or deleting anything."},{"q":"What does a 404 status code mean?","options":["Authentication failed","Request was malformed","Resource not found","Server error"],"correct":2,"explanation":"404 Not Found means the server understood the request but there is no resource at that URL."},{"q":"What is the difference between POST and PUT?","options":["POST updates, PUT creates","POST creates, PUT updates or replaces","They are identical","POST deletes, PUT reads"],"correct":1,"explanation":"POST creates a new resource. PUT updates or replaces an existing resource. PUT is idempotent — POST is not."},{"q":"You get a 401 error from an API. What should you check FIRST?","options":["The server logs","Your API key or authentication header","The request body format","The internet connection"],"correct":1,"explanation":"401 Unauthorized means your credentials are missing or invalid. Check that your API key is correct, in the right header, and has not expired or been revoked."},{"q":"What is rate limiting and why does it matter for automations?","options":["It limits file download speeds","APIs cap requests per time period — automations in loops can hit this limit","It limits the number of users on an API","It only applies to free tier accounts"],"correct":1,"explanation":"Rate limiting caps how many requests you can make per minute or hour. An automation running in a loop can easily exceed this, getting 429 errors. Build in delays and check X-RateLimit-Remaining headers."},{"q":"Which authentication method lets the user revoke access to your app at any time?","options":["API Key","OAuth 2.0","Basic Auth","No authentication"],"correct":1,"explanation":"OAuth 2.0 grants access through a user login flow. The user can revoke the token at any time through their account settings, immediately cutting off your app access."}]}'></div>

</div>

<footer class="progress-footer">
  <p>Lesson 4 of 9 &middot; Automation Architect</p>
</footer>
