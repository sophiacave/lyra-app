# What Is an API?

**Course:** Automation Architect
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[Automation Architect](/academy/automation-architect/)
  Lesson 4 of 9


  # What Is an API?

  APIs are how machines talk to each other. Master this and you can connect anything to anything — the foundation of every automation you will ever build.


  ## The Request / Response Cycle

  Every API interaction follows one pattern: your code sends a **request**, the server processes it, and sends back a **response**.




      Client
      Your Code


      REQUEST
      RESPONSE



      Server
      API Endpoint




    ## What a Real API Request Looks Like

    Here is an actual API request to get a list of users. Every part is labeled:


      # The request: GET method, URL, headers

      GET https://api.example.com/users?limit=10

      Authorization: Bearer sk_live_abc123...

      Content-Type: application/json

      Accept: application/json




        Method
        `GET` — what you want to do (read, create, update, delete)


        URL
        Where to send it. `?limit=10` is a query parameter — filters the results.


        Headers
        Metadata about your request. `Authorization` proves who you are. `Content-Type` says what format you are using.




  ## HTTP Methods

  There are four core HTTP methods. Each tells the server what operation to perform:



      **GET**
       — Read data without modifying it. Example: `GET /users` returns a list of users. Safe and idempotent.


      **POST**
       — Create a new resource. Sends a JSON body with the data. Example: `POST /orders` with `{"product": "Pro Plan"}` creates a new order. Returns 201 Created.


      **PUT**
       — Update or replace an existing resource. Example: `PUT /users/42` with updated fields replaces that user's data. Idempotent — same result if called multiple times.


      **DELETE**
       — Remove a resource. Example: `DELETE /users/42` removes the user with id 42. Usually returns 200 OK or 204 No Content.




    ## Try It: cURL Examples

    cURL is the universal command-line tool for making API requests. These are real commands you can run in your terminal:


      # GET — Read a list of users

      curl https://jsonplaceholder.typicode.com/users


      # POST — Create a new post (with JSON body)

      curl -X POST https://jsonplaceholder.typicode.com/posts \

        -H "Content-Type: application/json" \

        -d '{"title": "My Post", "body": "Hello world"}'


      # DELETE — Remove a post

      curl -X DELETE https://jsonplaceholder.typicode.com/posts/1


    jsonplaceholder.typicode.com is a free fake API for learning. The data is not real, but the requests and responses work exactly like a production API. Try these in your terminal right now.


  ## Status Codes

  The server tells you what happened with a status code. Green means success, orange means your request had a problem, red means the server broke.

    200 OKSuccess — here's your data
    201 CreatedSuccess — resource was created
    400 Bad RequestYour request was malformed


    401 UnauthorizedMissing or invalid auth
    404 Not FoundResource doesn't exist
    500 Server ErrorSomething broke on the server



    ## Authentication

    Most APIs require you to prove who you are before they respond. There are three common patterns:



        **API Key**
        A secret string you include in every request, usually as a header (`Authorization: Bearer sk_live_...`) or query parameter (`?api_key=...`). Simple, widely used. The key identifies your account and controls your access level.
        Used by: Stripe, OpenAI, SendGrid, most SaaS APIs


        **OAuth 2.0**
        The user grants your app permission through a login flow. You receive a **token** that expires and can be refreshed. More complex but more secure — the user can revoke access at any time.
        Used by: Google, GitHub, Slack, Microsoft — any "Sign in with..." flow


        **JWT (JSON Web Token)**
        A self-contained token that carries user identity and permissions. The server can verify it without checking a database. Commonly used for session management in modern web apps.
        Used by: Supabase, Firebase, Auth0, custom APIs





    ## Rate Limiting

    APIs limit how many requests you can make per minute or hour. If you exceed the limit, you get a `429 Too Many Requests` response. This matters for automations because:



        **A loop calling an API 1000 times** will get rate-limited after ~100 calls. Your automation needs to respect the limit and add delays between batches.


        **The response header tells you your limit:** Look for `X-RateLimit-Remaining` and `Retry-After` to know how many calls you have left and when to try again.





    ## Common Debugging Patterns

    When an API call fails, check these in order:



        401
        **Check your API key.** Is it in the right header? Is it the live key, not the test key? Has it been rotated or revoked?


        403
        **Permission issue.** Your key is valid but does not have access to this resource. Check your account's permission scope.


        404
        **Wrong URL or resource does not exist.** Double-check the endpoint path and any IDs in the URL.


        429
        **Rate limited.** Wait for the `Retry-After` duration, then try again. Add delays between requests in your automation.


        500
        **Server-side error.** Not your fault. Wait and retry. If persistent, check the API's status page.






      ### API Best Practices


        **Version your APIs.** Use URL versioning (`/v1/users`, `/v2/users`) so you can update the API without breaking existing integrations. Never make breaking changes to a live endpoint — create a new version instead.
        **Respect rate limits proactively.** Read the `X-RateLimit-Remaining` header on every response. Slow down before you hit the limit, not after you get a 429. Build in delays when processing batches.
        **Handle errors at every level.** Network errors (DNS failure, timeout), HTTP errors (4xx, 5xx), and application errors (valid HTTP response but with an error in the body) are three different failure modes. Your code must handle all three.
        **Never expose secrets in URLs.** Send API keys in headers, not query parameters. Query parameters appear in server logs, browser history, and proxy logs. The `Authorization` header is the secure standard.





### API Concepts

**Card 1:**
Front: GET
Back: Read data without modifying it. Safe and idempotent. Example: GET /users returns a list of users.

**Card 2:**
Front: POST
Back: Create a new resource. Sends a body with data. Returns 201 Created on success. NOT idempotent — calling twice creates two resources.

**Card 3:**
Front: PUT
Back: Update or replace an existing resource. Idempotent — same result if called multiple times.

**Card 4:**
Front: DELETE
Back: Remove a resource. Example: DELETE /users/42 removes user with id 42.

**Card 5:**
Front: API Key
Back: A secret string included in every request to prove identity. Usually sent as Authorization: Bearer sk_live_... header. Simple and widely used.

**Card 6:**
Front: OAuth 2.0
Back: User grants your app permission via login flow. You receive an access token that expires and can be refreshed. User can revoke access anytime.

**Card 7:**
Front: Rate Limiting
Back: APIs cap how many requests you can make per time period. Exceeding returns 429 Too Many Requests. Check X-RateLimit-Remaining header.

**Card 8:**
Front: 401 vs 403
Back: 401 = not authenticated (missing or invalid credentials). 403 = authenticated but not authorized (no permission for this resource).



### Quiz

**Q1: Which HTTP method retrieves data without modifying anything?**
    A. POST
    B. PUT
  ✓ C. GET
    D. DELETE
  *GET is the read-only method. It fetches data from the server without creating, updating, or deleting anything.*

**Q2: What does a 404 status code mean?**
    A. Authentication failed
    B. Request was malformed
  ✓ C. Resource not found
    D. Server error
  *404 Not Found means the server understood the request but there is no resource at that URL.*

**Q3: What is the difference between POST and PUT?**
    A. POST updates, PUT creates
  ✓ B. POST creates, PUT updates or replaces
    C. They are identical
    D. POST deletes, PUT reads
  *POST creates a new resource. PUT updates or replaces an existing resource. PUT is idempotent — POST is not.*

**Q4: You get a 401 error from an API. What should you check FIRST?**
    A. The server logs
  ✓ B. Your API key or authentication header
    C. The request body format
    D. The internet connection
  *401 Unauthorized means your credentials are missing or invalid. Check that your API key is correct, in the right header, and has not expired or been revoked.*

**Q5: What is rate limiting and why does it matter for automations?**
    A. It limits file download speeds
  ✓ B. APIs cap requests per time period — automations in loops can hit this limit
    C. It limits the number of users on an API
    D. It only applies to free tier accounts
  *Rate limiting caps how many requests you can make per minute or hour. An automation running in a loop can easily exceed this, getting 429 errors. Build in delays and check X-RateLimit-Remaining headers.*

**Q6: Which authentication method lets the user revoke access to your app at any time?**
    A. API Key
  ✓ B. OAuth 2.0
    C. Basic Auth
    D. No authentication
  *OAuth 2.0 grants access through a user login flow. The user can revoke the token at any time through their account settings, immediately cutting off your app access.*
