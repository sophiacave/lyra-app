# Error Handling

**Course:** Build Your First AI Agent
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 8 of 10


  # Error Handling

  Agents fail. Good agents fail gracefully. Here are the five most common failure modes, how to detect them, and production code patterns to handle each one.



    ## The Five Failure Modes

    Every agent you build will encounter these failures. Learning them now means you design for resilience from day one.



        **1. Tool Failure**
        An API returns 500, a database query times out, a service is down. The tool call fails but the agent should not crash.
        *Example: Weather API returns 503 Service Unavailable after your agent promised to check the forecast.*


        **2. Invalid Data**
        The tool returns data, but it is wrong — negative prices, dates in the future, missing required fields. The agent must detect and handle corrupt data.
        *Example: Database returns a customer balance of -$50,000. That is a data bug, not real debt.*


        **3. Ambiguous Input**
        The user's request is too vague to act on safely. "Do the thing from last time" when there is no context. Acting on low confidence causes more damage than asking for clarity.
        *Example: "Fix the issue" — which issue? In which system? What counts as fixed?*


        **4. Guardrail Violation**
        The user requests something the agent is explicitly forbidden from doing. The agent must refuse while remaining helpful.
        *Example: "Send this confidential report to all 500 employees" when guardrails restrict confidential docs.*


        **5. Stuck Loop**
        The agent keeps retrying the same failed approach without making progress. 48 attempts at the same fix with zero improvement.
        *Example: Agent tries to fix a failing test by changing the same line of code, failing each time.*





    ## Pattern 1: Retry with Exponential Backoff

    For transient failures (network errors, rate limits, temporary outages), retry with increasing wait times:


      import time



      def retry_with_backoff(func, max_retries=3):

        """Retry a function with exponential backoff: 1s, 2s, 4s"""

        for attempt in range(max_retries):

          try:

            return func()

          except Exception as e:

            if attempt == max_retries - 1:

              raise  # Last attempt — let it fail

            wait = 2 ** attempt  # 1s, 2s, 4s

            print(f"Retry {attempt + 1}/{max_retries} in {wait}s: {e}")

            time.sleep(wait)



      # Usage in your agent

      def execute_tool_safe(name, params):

        try:

          return retry_with_backoff(

            lambda: execute_tool(name, params)

          )

        except Exception as e:

          # All retries exhausted — return error to Claude

          return {"error": str(e), "tool": name}



      **Why exponential backoff?**
      If a service is overloaded, hammering it with rapid retries makes the problem worse. Exponential backoff (1s, 2s, 4s) gives the service progressively more time to recover while still attempting the call.




    ## Pattern 2: Graceful Degradation

    When the primary tool fails, fall back to an alternative instead of giving up:


      def get_weather(location):

        # Try primary API

        try:

          return retry_with_backoff(

            lambda: weather_api.get(location)

          )

        except:

          pass



        # Fallback: try web search

        try:

          return web_search.query(f"weather in {location} today")

        except:

          pass



        # All fallbacks exhausted

        return {

          "error": "Weather data unavailable",

          "tried": ["weather_api", "web_search"],

          "suggestion": "Try again in a few minutes"

        }




    ## Pattern 3: Data Validation

    Never trust tool results blindly. Validate before acting:


      def validate_customer_data(data):

        """Validate tool results before passing to Claude"""

        issues = []



        if data.get("balance", 0) 10000:

          issues.append("Suspicious negative balance")



        if data.get("created_at", "") > datetime.now().isoformat():

          issues.append("Date is in the future")



        if issues:

          return {

            "data": data,

            "warning": "Data anomalies detected",

            "issues": issues,

            "recommendation": "Flag to user before acting"

          }



        return data




    ## Pattern 4: Human Escalation

    When all automated recovery fails, escalate to a human with full context — so they do not start from scratch:


      def escalate_to_human(task, attempts, errors):

        """Create a detailed handoff when the agent cannot resolve"""

        return {

          "status": "escalated",

          "task": task,

          "attempts_made": attempts,

          "errors_encountered": errors,

          "last_good_state": "Customer identified, plan confirmed",

          "remaining_work": "Refund processing failed — needs manual billing system access",

          "context": "Full conversation + tool results attached"

        }



      **A good escalation saves the human 90% of the work**
      Include: what was tried, what failed, what the last known good state was, and exactly what remains. The human picks up where the agent left off instead of restarting from zero.




    ## The Error Handling Decision Tree

    When your agent encounters an error, follow this decision tree:



        1. Is this a transient error (timeout, rate limit, 503)? → **Retry with backoff**


        2. Retries exhausted? → **Try alternative tool (graceful degradation)**


        3. No alternative tool available? → **Return error to Claude (let it adapt)**


        4. Claude cannot adapt? → **Escalate to human with full context**


        5. Guardrail violation? → **Refuse + explain + suggest alternative**





    ## Anti-Pattern: What NOT to Do




        **Retry 100 times**
         — If 3 retries fail, 97 more will not help. You are hammering a dead service and wasting money on API calls. Use a circuit breaker (max 3 retries, then stop).


        **Silently fix bad data**
         — Removing a negative sign from a balance hides a real bug. The agent should flag anomalies, not mask them. Present the data issue honestly.


        **Crash silently**
         — An unhandled exception kills the agent with no feedback. Always wrap tool calls in try/catch and return meaningful error messages.


        **Override guardrails**
         — "The user asked for it" is not a valid reason to bypass safety constraints. Guardrails exist to prevent harm. Explain the constraint and offer a safe alternative.





### Error Handling Patterns

**Card 1:**
Front: Exponential backoff
Back: Retry with increasing wait times: 1s, 2s, 4s. Gives a struggling service time to recover without hammering it. Standard max: 3 retries.

**Card 2:**
Front: Graceful degradation
Back: When the primary tool fails, fall back to an alternative tool instead of giving up. Example: weather API fails → try web search → if both fail, tell the user.

**Card 3:**
Front: Circuit breaker
Back: Stop retrying after a set number of failures. Prevents wasting resources on a dead service. If 3 retries fail, 97 more will not help.

**Card 4:**
Front: Data validation
Back: Check tool results for anomalies before passing to Claude. Negative balances, future dates, missing fields — flag these instead of presenting bad data as truth.

**Card 5:**
Front: Human escalation
Back: When all automated recovery fails: summarize what was tried, what failed, the last known good state, and what remains. The human picks up where the agent left off.

**Card 6:**
Front: Why not retry 100 times?
Back: If 3 retries with backoff fail, the service is genuinely down. More retries waste API credits, delay the user, and can overload the struggling service further.

**Card 7:**
Front: Returning errors to Claude
Back: When a tool fails, return the error as the tool_result content. Claude sees the failure and can adapt — trying a different tool, asking the user, or explaining the limitation.

**Card 8:**
Front: Guardrail violation handling
Back: Never override safety constraints. Explain what was requested, why it cannot be done, and offer a safe alternative. The agent refuses the unsafe action while remaining helpful.


### Quiz

**Q1: Your agent calls a weather API and gets a 503 Service Unavailable error after 3 retries. What is the best response?**
    A. Tell the user you cannot help and stop
    B. Retry the same API call 100 times until it works
  ✓ C. Try an alternative tool (web search for weather) and explain the fallback to the user
    D. Ignore the error and make up a weather forecast
  *Graceful degradation: adapt to failure by trying alternative paths while keeping the user informed. Hammering a failing service wastes time and can trigger rate limiting.*

**Q2: Your agent queries a database and gets negative spending amounts and dates from the future. What should it do?**
    A. Use the data anyway
  ✓ B. Flag the anomaly, refuse to present invalid data, and suggest the user check the data source
    C. Silently fix the data by removing the negative sign and adjusting the date
    D. Ask the user what the correct values should be
  *Agents should validate data before presenting it. When validation fails, honesty about the problem and pointing toward the root cause is the right call.*

**Q3: After 48 attempts to fix a failing test with zero progress, what should the agent do?**
    A. Keep trying — the 49th attempt might work
  ✓ B. Stop, summarize what was tried and what failed, escalate to a human with full context
    C. Delete the test file so it cannot fail
    D. Switch to a different programming language
  *A good agent knows when to stop. After repeated failures with no progress, the most valuable action is a detailed handoff to a human — summarizing attempts so they do not start from scratch.*

**Q4: Why is exponential backoff better than immediate retries?**
    A. It is faster overall
  ✓ B. It gives the failing service time to recover instead of hammering it with rapid requests
    C. It uses less memory
    D. It is required by all APIs
  *If a service is overloaded, rapid retries add more load. Exponential backoff (1s, 2s, 4s) gives progressively more recovery time while still attempting the call.*

**Q5: A user asks the agent to send a confidential document to all employees, but guardrails restrict confidential docs. What should the agent do?**
    A. Override the guardrail because the user explicitly asked
    B. Send it only to authorized recipients without telling the user
  ✓ C. Explain the conflict, refuse the unsafe action, and suggest a safe alternative
    D. Send it to everyone and log a warning
  *Guardrails exist for safety. The agent should respect them while being helpful — explain why it cannot comply and offer a path forward.*
