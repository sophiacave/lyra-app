# API Playground

**Course:** Automation Architect
**Order:** 5
**Type:** lab
**Access:** Premium

---
[Automation Architect](/academy/automation-architect/)
  Lesson 5 of 9


  # API Playground

  A fake API sandbox. Send real-looking requests and see how APIs respond. No backend needed.



    ## API Testing Best Practices

    Before you start firing off API calls, you need a testing strategy. Professional developers follow a clear methodology to avoid breaking things in production and to make debugging easier when something goes wrong.



        **1. Start with the Docs**
        Every reputable API has documentation. Read it before writing a single line of code. Look for: base URL, required headers, authentication method, request/response schemas, and rate limits. Skipping the docs is the number one cause of wasted debugging time.


        **2. Use a Test Environment First**
        Most APIs offer sandbox or test modes. Stripe has test keys (`sk_test_...`), PayPal has sandbox accounts, and many APIs have staging URLs. Always test against these before touching production data. A single POST to a live payment endpoint with wrong data can create real charges.


        **3. Test One Endpoint at a Time**
        Do not build an entire integration and then test everything at once. Test each endpoint individually: verify the request format, check the response structure, confirm error handling. Only chain endpoints together after each one works in isolation.


        **4. Log Everything During Development**
        Print the full request URL, headers (minus secrets), request body, response status, and response body. When something fails, you need the complete picture. Remove verbose logging before going to production, but keep error logging forever.


        **5. Test Error Cases Intentionally**
        Send a request with a missing required field. Send an invalid API key. Hit a non-existent endpoint. Try to create a duplicate resource. Your code needs to handle all of these gracefully. If you only test the happy path, your automation will break the first time something unexpected happens.





    ## HTTP Status Codes — The Complete Guide

    Status codes are the server's way of telling you what happened. They are grouped into five categories by their first digit. Memorize the common ones — you will see them constantly.


      ### 2xx — Success



          200
          **OK** — The request succeeded. For GET requests, the response body contains the data you asked for. The most common success code.


          201
          **Created** — A new resource was successfully created. Returned after a successful POST request. The response usually includes the new resource with its assigned ID.


          204
          **No Content** — The request succeeded, but there is no body to return. Common after DELETE requests. The absence of a body is intentional.



      ### 4xx — Client Errors (Your Problem)



          400
          **Bad Request** — Your request is malformed. Missing required fields, wrong data types, or invalid JSON. Read the error message — it usually tells you exactly what is wrong.


          401
          **Unauthorized** — No valid credentials provided. Your API key is missing, expired, or wrong. This is an authentication failure — the server does not know who you are.


          403
          **Forbidden** — Your credentials are valid, but you do not have permission for this resource. The server knows who you are but you are not allowed to do this.


          404
          **Not Found** — The resource at this URL does not exist. Check the endpoint path, the resource ID, and whether the resource was deleted.


          422
          **Unprocessable Entity** — Your JSON is valid but the data fails validation. Example: sending an email field with an invalid email format. The structure is right but the content is wrong.


          429
          **Too Many Requests** — You have exceeded the rate limit. Check the `Retry-After` header for how long to wait. In automations, implement exponential backoff.



      ### 5xx — Server Errors (Their Problem)



          500
          **Internal Server Error** — Something broke on the server side. Not your fault. Wait a few seconds and retry. If it persists, check the API provider's status page.


          502
          **Bad Gateway** — A proxy or load balancer received an invalid response from the upstream server. Usually transient — retry after a short wait.


          503
          **Service Unavailable** — The server is overloaded or down for maintenance. Check the `Retry-After` header. Common during high-traffic periods or deploys.


          504
          **Gateway Timeout** — The server took too long to respond. The request may have been too complex or the server is under heavy load. Consider increasing your client timeout or simplifying the request.






    ## Debugging API Responses

    When an API call does not return what you expect, follow this systematic debugging checklist. Most issues are caught in the first three steps.



        **Step 1: Check the Status Code**
        The status code immediately tells you the category of the problem. A 4xx means you sent something wrong. A 5xx means the server has a problem. Never ignore the status code and jump straight to the response body.


        **Step 2: Read the Error Message**
        Most APIs return a JSON body with an error message on failure. Read it carefully. Messages like `"email field is required"` or `"invalid API key format"` tell you exactly what to fix. Many developers skip this and waste hours guessing.


        **Step 3: Compare Against the Docs**
        Open the API docs side-by-side with your code. Verify: the endpoint URL matches, the HTTP method is correct, all required fields are present, the field names match (APIs are case-sensitive), and the data types are correct (strings vs numbers).


        **Step 4: Test with cURL or Postman**
        If your code still fails, strip it down to a raw cURL command. If cURL works but your code does not, the bug is in how your code constructs the request. If cURL also fails, the problem is with the request itself or the API.


        **Step 5: Check Headers and Auth**
        Missing `Content-Type: application/json` is a classic silent failure — the server receives your JSON as plain text and cannot parse it. Expired tokens, rotated API keys, and wrong auth header formats cause another large chunk of debugging sessions.




      **Pro Tip: Save Working Requests**
      When a request works, save it as a template. Keep a collection of known-good cURL commands or Postman requests for each API you integrate with. When something breaks in the future, you can compare your current request against the working template to spot what changed.




    ## Making API Calls in Python

    Here is how you make real API calls from your own code using Python's `httpx` library — the modern async-capable replacement for `requests`:


Python — GET request with response parsing

```
import httpx

# GET request — fetch all users from an API
response = httpx.get("https://api.example.com/users", headers={
    "Authorization": "Bearer sk-your-api-key",
    "Content-Type": "application/json"
})

# Always check the status before using the data
if response.status_code == 200:
    users = response.json()
    for user in users:
        print(f"{user['name']} — {user['email']}")
else:
    print(f"Error {response.status_code}: {response.text}")
```



Python — POST request with JSON body and error handling

```
import httpx

# POST request — create a new order
payload = {
    "product": "Pro Plan",
    "amount": 7900,
    "customer": "cus_42"
}

try:
    response = httpx.post(
        "https://api.example.com/orders",
        json=payload,
        headers={"Authorization": "Bearer sk-your-api-key"},
        timeout=10.0
    )
    response.raise_for_status()  # Raises exception for 4xx/5xx

    order = response.json()
    print(f"Order created: {order['id']} — ${order['amount'] / 100}")

except httpx.HTTPStatusError as e:
    print(f"API error {e.response.status_code}: {e.response.text}")
except httpx.RequestError as e:
    print(f"Network error: {e}")
```





### Quiz

**Q1: Which endpoint and method would you use to list all users?**
    A. POST /users
  ✓ B. GET /users
    C. DELETE /users
    D. PUT /users
  *GET /users retrieves the list of all users without modifying any data.*

**Q2: What status code does the sandbox return when you successfully create an order?**
    A. 200 OK
    B. 404 Not Found
  ✓ C. 201 Created
    D. 500 Server Error
  *POST requests that successfully create a resource return 201 Created.*

**Q3: What happens when you send a request to an endpoint that does not exist in the sandbox?**
    A. The server crashes
    B. You get a 200 OK with empty data
  ✓ C. You get a 404 Not Found with available endpoints listed
    D. You get a 201 Created
  *The sandbox returns 404 Not Found and lists the available endpoints so you know what to try.*



### API Request Anatomy

**Card 1:**
Front: Request Method
Back: Tells the server what operation to perform: GET (read), POST (create), PUT (update), DELETE (remove).

**Card 2:**
Front: Endpoint URL
Back: The address of the resource you want to interact with. Example: /users, /orders/42.

**Card 3:**
Front: Request Body
Back: JSON data sent with POST and PUT requests. Tells the server what to create or update.

**Card 4:**
Front: Response Status Code
Back: A 3-digit number the server sends back. 2xx = success, 4xx = client error, 5xx = server error.

**Card 5:**
Front: Response Body
Back: The JSON data the server sends back. Contains the result of your request.
