---
title: "API Quiz"
course: "automation-architect"
order: 6
type: "quiz"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/automation-architect/">Automation Architect</a>
  <span class="lesson-badge">Lesson 6 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>API Quiz</h1>
  <p class="sub">Test your knowledge of HTTP methods, status codes, headers, and authentication.</p>
</div>

<div class="content">

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Course Recap: REST APIs</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Before you take the quiz, review the core concepts from this module. Every question below draws from these fundamentals.</p>

    <h3 style="color:#34d399;font-size:.9rem;margin-bottom:.75rem">REST API Architecture</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">REST (Representational State Transfer) is the most common architecture for web APIs. It organizes data into <strong>resources</strong> — things like users, orders, or products — each accessed through a URL. REST APIs are <strong>stateless</strong>: every request must contain all the information the server needs to process it. The server does not remember your previous requests.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="color:#34d399;font-weight:700;font-size:.8rem;min-width:70px">Resource</span>
        <span style="font-size:.82rem;color:#a1a1aa">A data object exposed by the API. Accessed via URL: <code>/users</code>, <code>/orders/42</code>, <code>/products?category=books</code></span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="color:#34d399;font-weight:700;font-size:.8rem;min-width:70px">Endpoint</span>
        <span style="font-size:.82rem;color:#a1a1aa">A specific URL path + method combination. <code>GET /users</code> and <code>POST /users</code> are different endpoints on the same path.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="color:#34d399;font-weight:700;font-size:.8rem;min-width:70px">Stateless</span>
        <span style="font-size:.82rem;color:#a1a1aa">Each request is independent. The server does not store session data between requests. Authentication must be sent with every call.</span>
      </div>
    </div>

    <h3 style="color:#8b5cf6;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">HTTP Methods</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">The four core methods map to CRUD operations (Create, Read, Update, Delete). Understanding which method to use and when is fundamental to working with any API.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#34d399;font-size:.82rem">GET</strong> <span style="font-size:.82rem;color:#a1a1aa">— Read data. No request body. Safe and idempotent. Never modifies server state.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#38bdf8;font-size:.82rem">POST</strong> <span style="font-size:.82rem;color:#a1a1aa">— Create a new resource. Includes a JSON body. Returns 201 Created. NOT idempotent — calling twice creates two resources.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#fb923c;font-size:.82rem">PUT</strong> <span style="font-size:.82rem;color:#a1a1aa">— Update or replace an existing resource. Idempotent — calling twice produces the same result as calling once.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <strong style="color:#ef4444;font-size:.82rem">DELETE</strong> <span style="font-size:.82rem;color:#a1a1aa">— Remove a resource. Returns 200 OK or 204 No Content. Idempotent — deleting something already deleted is not an error.</span>
      </div>
    </div>

    <h3 style="color:#fb923c;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">Authentication Patterns</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">APIs need to know who is making the request. The three major authentication patterns each serve different use cases.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <strong style="color:#fb923c;font-size:.82rem">API Key</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">A secret string sent in every request header. Simple, fast, widely used. Best for server-to-server communication. Example: <code>Authorization: Bearer sk_live_...</code></p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <strong style="color:#fb923c;font-size:.82rem">OAuth 2.0</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">User grants your app permission via a login flow. You receive an access token that expires. Users can revoke access anytime. Best for apps acting on behalf of users.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <strong style="color:#fb923c;font-size:.82rem">JWT (JSON Web Token)</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">A self-contained token carrying user identity and permissions. Server verifies it without a database lookup. Best for session management in modern web apps.</p>
      </div>
    </div>

    <h3 style="color:#ef4444;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">Error Handling</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Robust error handling separates production-quality code from fragile scripts. Every API call can fail, and your code must handle each failure mode.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Always check the status code</strong> before using the response body. A 200 means the body has your data. A 4xx or 5xx means the body has an error message.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Use try/except blocks</strong> for network errors. The server might be down, the DNS might fail, or the connection might time out. These are different from HTTP errors.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Implement retry logic</strong> for transient failures (429, 500, 502, 503). Use exponential backoff: wait 1s, then 2s, then 4s. Never retry 400 or 401 errors — those require a code fix.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Log failures with context</strong> — the endpoint, the request body, the status code, and the error message. Without this, debugging production failures is nearly impossible.</span>
      </div>
    </div>

    <h3 style="color:#38bdf8;font-size:.9rem;margin-bottom:.75rem;margin-top:1.5rem">Rate Limiting</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Every API limits how many requests you can make per time window. Understanding rate limits is critical for automation because your code can make thousands of requests faster than any human.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Read the rate limit headers:</strong> <code>X-RateLimit-Limit</code> (your max), <code>X-RateLimit-Remaining</code> (calls left), <code>Retry-After</code> (wait time after hitting the limit).</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Batch requests when possible.</strong> Instead of calling <code>GET /users/1</code>, <code>GET /users/2</code>, <code>GET /users/3</code> separately, use <code>GET /users?ids=1,2,3</code> if the API supports it.</span>
      </div>
      <div style="padding:.6rem 1rem;border-radius:8px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.08)">
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Add delays in loops.</strong> If you are processing 1000 items through an API, add a small delay between requests. A <code>time.sleep(0.1)</code> adds only 100 seconds total but prevents rate limiting.</span>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Common API Mistakes</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">These are the mistakes developers make most often when working with APIs. Avoid these and you will save hours of debugging.</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Hardcoding API keys in source code</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">API keys committed to Git end up in your repository history forever. Even if you delete them later, anyone with access to the repo can find them. Use environment variables or a secrets manager instead.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Not setting request timeouts</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Without a timeout, your code will wait forever if the server stops responding. Always set an explicit timeout (10-30 seconds for most APIs). A hung request blocks your entire automation pipeline.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Ignoring pagination</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Most APIs return results in pages (20-100 items at a time). If you call <code>GET /users</code> and only read the first page, you are missing data. Check for <code>next_page</code> or <code>has_more</code> fields and loop until all pages are fetched.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Using test keys in production</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Test API keys (<code>sk_test_...</code>) work in development but process fake data. Forgetting to switch to live keys (<code>sk_live_...</code>) before deployment means your production system does nothing real. Always verify your environment configuration before going live.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Not validating response structure</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">APIs can change their response format between versions. If you access <code>response["data"]["users"]</code> without checking that those keys exist, your code crashes when the structure changes. Always validate before accessing nested fields.</p>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Status Code Decision Tree</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">When your API call returns an error, use this decision tree to diagnose and fix the issue systematically.</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="color:#34d399;font-weight:700;font-size:.8rem;min-width:50px">2xx</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Success.</strong> Parse the response body. Verify the data structure matches what you expect. Log the result.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:50px">400</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Bad request.</strong> Read the error message. Check required fields, data types, and JSON format. Fix your code. Do NOT retry.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:50px">401</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Auth failed.</strong> Check API key format, expiration, and header name. Verify test vs live keys. Do NOT retry with same credentials.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:50px">403</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Forbidden.</strong> Credentials are valid but lack permission. Check your account's access scope. Contact API provider if needed.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:50px">404</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Not found.</strong> Check the URL path, resource ID, and API version. The resource may have been deleted.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="color:#fb923c;font-weight:700;font-size:.8rem;min-width:50px">429</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Rate limited.</strong> Read the Retry-After header. Wait, then retry. Add delays to your loop. Consider batching requests.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.08)">
        <span style="color:#ef4444;font-weight:700;font-size:.8rem;min-width:50px">5xx</span>
        <span style="font-size:.82rem;color:#a1a1aa"><strong style="color:#e5e5e5">Server error.</strong> Not your fault. Retry with exponential backoff. If persistent, check the provider's status page.</span>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Quick Reference: Response Debugging</h2>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Debugging an API response</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> httpx

response = httpx.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"https://api.example.com/users"</span>, headers={
    <span style="color:#fb923c">"Authorization"</span>: <span style="color:#fb923c">"Bearer sk-your-key"</span>
})

<span style="color:#71717a"># Always print these when debugging</span>
<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Status: </span>{response.status_code}<span style="color:#fb923c">"</span>)
<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Headers: </span>{dict(response.headers)}<span style="color:#fb923c">"</span>)
<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Body: </span>{response.text[:500]}<span style="color:#fb923c">"</span>)

<span style="color:#71717a"># Check rate limit headers</span>
remaining = response.headers.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"X-RateLimit-Remaining"</span>)
<span style="color:#c084fc">if</span> remaining:
    <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Rate limit remaining: </span>{remaining}<span style="color:#fb923c">"</span>)

<span style="color:#71717a"># Handle different status codes</span>
<span style="color:#c084fc">if</span> response.status_code == <span style="color:#fb923c">200</span>:
    data = response.<span style="color:#34d399">json</span>()
<span style="color:#c084fc">elif</span> response.status_code == <span style="color:#fb923c">429</span>:
    retry_after = response.headers.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"Retry-After"</span>, <span style="color:#fb923c">"60"</span>)
    <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Rate limited. Retry after </span>{retry_after}<span style="color:#fb923c">s"</span>)
<span style="color:#c084fc">else</span>:
    <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Error </span>{response.status_code}<span style="color:#fb923c">: </span>{response.text}<span style="color:#fb923c">"</span>)</code></pre>
</div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"API Knowledge Check","questions":[{"q":"Which HTTP method is used to retrieve data without modifying it?","options":["POST","GET","PUT","DELETE"],"correct":1,"explanation":"GET is the read-only method. It retrieves data from the server without changing anything."},{"q":"What does a 201 status code mean?","options":["OK — request succeeded","Resource was created successfully","Resource not found","Server error"],"correct":1,"explanation":"201 Created means the server successfully created a new resource, typically returned after a POST request."},{"q":"Where is an API key typically sent in a request?","options":["In the URL path","In the response body","In the Authorization header","In the status code"],"correct":2,"explanation":"Best practice is to send API keys in headers such as Authorization: Bearer token or X-API-Key: key. This keeps credentials out of URLs where they might be logged."},{"q":"What does a 404 status code indicate?","options":["Authentication required","Request was malformed","The requested resource was not found","Server crashed"],"correct":2,"explanation":"404 Not Found means the server understood your request but the resource at that URL does not exist."},{"q":"Which content type header indicates you are sending JSON data?","options":["text/html","application/json","multipart/form-data","text/plain"],"correct":1,"explanation":"application/json tells the server that your request body contains JSON-formatted data."},{"q":"What is the difference between PUT and POST?","options":["PUT creates, POST updates","PUT updates or replaces, POST creates","They are identical","PUT deletes, POST reads"],"correct":1,"explanation":"PUT updates or replaces an existing resource. POST creates a new resource. PUT is idempotent — same result each time."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"API Headers & Auth","cards":[{"front":"Authorization header","back":"Sends authentication credentials with a request. Common formats: Bearer <token> for OAuth, X-API-Key: <key> for API keys."},{"front":"Content-Type header","back":"Tells the server the format of your request body. Use application/json when sending JSON data."},{"front":"Accept header","back":"Tells the server what format you want in the response. Example: Accept: application/json."},{"front":"Bearer token","back":"An OAuth access token sent in the Authorization header: Authorization: Bearer <token>"},{"front":"401 vs 403","back":"401 Unauthorized = no valid credentials sent. 403 Forbidden = credentials are valid but you do not have permission."}]}'></div>


</div>

</div>
