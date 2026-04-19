# API Quiz

**Course:** Automation Architect
**Order:** 6
**Type:** quiz
**Access:** Premium

---
[Automation Architect](/academy/automation-architect/)
  Lesson 6 of 9


  # API Quiz

  Test your knowledge of HTTP methods, status codes, headers, and authentication.



    ## Course Recap: REST APIs

    Before you take the quiz, review the core concepts from this module. Every question below draws from these fundamentals.

    ### REST API Architecture

    REST (Representational State Transfer) is the most common architecture for web APIs. It organizes data into **resources** — things like users, orders, or products — each accessed through a URL. REST APIs are **stateless**: every request must contain all the information the server needs to process it. The server does not remember your previous requests.



        Resource
        A data object exposed by the API. Accessed via URL: `/users`, `/orders/42`, `/products?category=books`


        Endpoint
        A specific URL path + method combination. `GET /users` and `POST /users` are different endpoints on the same path.


        Stateless
        Each request is independent. The server does not store session data between requests. Authentication must be sent with every call.



    ### HTTP Methods

    The four core methods map to CRUD operations (Create, Read, Update, Delete). Understanding which method to use and when is fundamental to working with any API.



        **GET** — Read data. No request body. Safe and idempotent. Never modifies server state.


        **POST** — Create a new resource. Includes a JSON body. Returns 201 Created. NOT idempotent — calling twice creates two resources.


        **PUT** — Update or replace an existing resource. Idempotent — calling twice produces the same result as calling once.


        **DELETE** — Remove a resource. Returns 200 OK or 204 No Content. Idempotent — deleting something already deleted is not an error.



    ### Authentication Patterns

    APIs need to know who is making the request. The three major authentication patterns each serve different use cases.



        **API Key**
        A secret string sent in every request header. Simple, fast, widely used. Best for server-to-server communication. Example: `Authorization: Bearer sk_live_...`


        **OAuth 2.0**
        User grants your app permission via a login flow. You receive an access token that expires. Users can revoke access anytime. Best for apps acting on behalf of users.


        **JWT (JSON Web Token)**
        A self-contained token carrying user identity and permissions. Server verifies it without a database lookup. Best for session management in modern web apps.



    ### Error Handling

    Robust error handling separates production-quality code from fragile scripts. Every API call can fail, and your code must handle each failure mode.



        **Always check the status code** before using the response body. A 200 means the body has your data. A 4xx or 5xx means the body has an error message.


        **Use try/except blocks** for network errors. The server might be down, the DNS might fail, or the connection might time out. These are different from HTTP errors.


        **Implement retry logic** for transient failures (429, 500, 502, 503). Use exponential backoff: wait 1s, then 2s, then 4s. Never retry 400 or 401 errors — those require a code fix.


        **Log failures with context** — the endpoint, the request body, the status code, and the error message. Without this, debugging production failures is nearly impossible.



    ### Rate Limiting

    Every API limits how many requests you can make per time window. Understanding rate limits is critical for automation because your code can make thousands of requests faster than any human.



        **Read the rate limit headers:** `X-RateLimit-Limit` (your max), `X-RateLimit-Remaining` (calls left), `Retry-After` (wait time after hitting the limit).


        **Batch requests when possible.** Instead of calling `GET /users/1`, `GET /users/2`, `GET /users/3` separately, use `GET /users?ids=1,2,3` if the API supports it.


        **Add delays in loops.** If you are processing 1000 items through an API, add a small delay between requests. A `time.sleep(0.1)` adds only 100 seconds total but prevents rate limiting.





    ## Common API Mistakes

    These are the mistakes developers make most often when working with APIs. Avoid these and you will save hours of debugging.



        **Hardcoding API keys in source code**
        API keys committed to Git end up in your repository history forever. Even if you delete them later, anyone with access to the repo can find them. Use environment variables or a secrets manager instead.


        **Not setting request timeouts**
        Without a timeout, your code will wait forever if the server stops responding. Always set an explicit timeout (10-30 seconds for most APIs). A hung request blocks your entire automation pipeline.


        **Ignoring pagination**
        Most APIs return results in pages (20-100 items at a time). If you call `GET /users` and only read the first page, you are missing data. Check for `next_page` or `has_more` fields and loop until all pages are fetched.


        **Using test keys in production**
        Test API keys (`sk_test_...`) work in development but process fake data. Forgetting to switch to live keys (`sk_live_...`) before deployment means your production system does nothing real. Always verify your environment configuration before going live.


        **Not validating response structure**
        APIs can change their response format between versions. If you access `response["data"]["users"]` without checking that those keys exist, your code crashes when the structure changes. Always validate before accessing nested fields.





    ## Status Code Decision Tree

    When your API call returns an error, use this decision tree to diagnose and fix the issue systematically.



        2xx
        **Success.** Parse the response body. Verify the data structure matches what you expect. Log the result.


        400
        **Bad request.** Read the error message. Check required fields, data types, and JSON format. Fix your code. Do NOT retry.


        401
        **Auth failed.** Check API key format, expiration, and header name. Verify test vs live keys. Do NOT retry with same credentials.


        403
        **Forbidden.** Credentials are valid but lack permission. Check your account's access scope. Contact API provider if needed.


        404
        **Not found.** Check the URL path, resource ID, and API version. The resource may have been deleted.


        429
        **Rate limited.** Read the Retry-After header. Wait, then retry. Add delays to your loop. Consider batching requests.


        5xx
        **Server error.** Not your fault. Retry with exponential backoff. If persistent, check the provider's status page.





    ## Quick Reference: Response Debugging



Python — Debugging an API response

```
import httpx

response = httpx.get("https://api.example.com/users", headers={
    "Authorization": "Bearer sk-your-key"
})

# Always print these when debugging
print(f"Status: {response.status_code}")
print(f"Headers: {dict(response.headers)}")
print(f"Body: {response.text[:500]}")

# Check rate limit headers
remaining = response.headers.get("X-RateLimit-Remaining")
if remaining:
    print(f"Rate limit remaining: {remaining}")

# Handle different status codes
if response.status_code == 200:
    data = response.json()
elif response.status_code == 429:
    retry_after = response.headers.get("Retry-After", "60")
    print(f"Rate limited. Retry after {retry_after}s")
else:
    print(f"Error {response.status_code}: {response.text}")
```





### Quiz

**Q1: Which HTTP method is used to retrieve data without modifying it?**
    A. POST
  ✓ B. GET
    C. PUT
    D. DELETE
  *GET is the read-only method. It retrieves data from the server without changing anything.*

**Q2: What does a 201 status code mean?**
    A. OK — request succeeded
  ✓ B. Resource was created successfully
    C. Resource not found
    D. Server error
  *201 Created means the server successfully created a new resource, typically returned after a POST request.*

**Q3: Where is an API key typically sent in a request?**
    A. In the URL path
    B. In the response body
  ✓ C. In the Authorization header
    D. In the status code
  *Best practice is to send API keys in headers such as Authorization: Bearer token or X-API-Key: key. This keeps credentials out of URLs where they might be logged.*

**Q4: What does a 404 status code indicate?**
    A. Authentication required
    B. Request was malformed
  ✓ C. The requested resource was not found
    D. Server crashed
  *404 Not Found means the server understood your request but the resource at that URL does not exist.*

**Q5: Which content type header indicates you are sending JSON data?**
    A. text/html
  ✓ B. application/json
    C. multipart/form-data
    D. text/plain
  *application/json tells the server that your request body contains JSON-formatted data.*

**Q6: What is the difference between PUT and POST?**
    A. PUT creates, POST updates
  ✓ B. PUT updates or replaces, POST creates
    C. They are identical
    D. PUT deletes, POST reads
  *PUT updates or replaces an existing resource. POST creates a new resource. PUT is idempotent — same result each time.*



### API Headers & Auth

**Card 1:**
Front: Authorization header
Back: Sends authentication credentials with a request. Common formats: Bearer  for OAuth, X-API-Key:  for API keys.

**Card 2:**
Front: Content-Type header
Back: Tells the server the format of your request body. Use application/json when sending JSON data.

**Card 3:**
Front: Accept header
Back: Tells the server what format you want in the response. Example: Accept: application/json.

**Card 4:**
Front: Bearer token
Back: An OAuth access token sent in the Authorization header: Authorization: Bearer

**Card 5:**
Front: 401 vs 403
Back: 401 Unauthorized = no valid credentials sent. 403 Forbidden = credentials are valid but you do not have permission.
