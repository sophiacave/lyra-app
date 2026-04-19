# Evaluating Your Agent

**Course:** Build Your First AI Agent
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 9 of 10


  # Evaluating Your Agent

  An agent that works in demo does not always work in production. Here are the five dimensions you must measure, the code to measure them, and the thresholds that separate "deployable" from "dangerous."



    ## The Five Evaluation Dimensions

    Rate your agent on each dimension. An agent must score above 70 on ALL five to be production-ready. One weak dimension can sink the entire experience:



        **1. Accuracy**
        How often does the agent give correct, useful responses? Measure by running a test suite of known questions with expected answers.
        **Improve:** Better system prompts, few-shot examples, output validation, tool result verification.


        **2. Speed**
        How quickly does the agent complete tasks? Users expect responses within 5-10 seconds for simple queries, 30 seconds for complex multi-tool tasks.
        **Improve:** Caching frequent queries, parallel tool calls, routing simple tasks to faster models.


        **3. Reliability**
        Does the agent work consistently without crashes or silent failures? Measure error rate over 100+ runs.
        **Improve:** Retry logic, fallback tools, comprehensive error handling, dead letter queues.


        **4. Cost Efficiency**
        How much does each agent interaction cost? At scale, a $0.50 interaction that should cost $0.05 will kill your budget.
        **Improve:** Caching, token limits, tiered model routing (fast model for simple tasks, powerful model for complex).


        **5. User Satisfaction**
        Are users happy? An agent can be technically correct but still frustrating if the tone is wrong, the format is confusing, or it does not explain its limitations.
        **Improve:** Feedback collection, tone adjustments, clearer output formatting, transparency about limitations.





    ## Building a Test Suite

    You cannot evaluate what you do not measure. Here is how to build an automated test suite for your agent:


      # eval.py — Agent evaluation framework

      import time



      TEST_CASES = [

        {

          "input": "What plan is jane@acme.co on?",

          "expected_tool": "lookup_customer",

          "expected_contains": ["Pro", "$49"],

        },

        {

          "input": "How do I reset my password?",

          "expected_tool": "search_knowledge_base",

          "expected_contains": ["settings", "reset"],

        },

        {

          "input": "I need help",  # Ambiguous

          "expected_tool": None,  # Should ask for clarification

          "expected_contains": ["what", "help"],

        },

      ]



      def evaluate_agent(agent_fn):

        results = []

        for case in TEST_CASES:

          start = time.time()

          try:

            response = agent_fn(case["input"])

            elapsed = time.time() - start

            results.append({

              "input": case["input"],

              "passed": all(kw.lower() in response.lower()

                        for kw in case["expected_contains"]),

              "time_s": round(elapsed, 2),

              "error": None

            })

          except Exception as e:

            results.append({

              "input": case["input"],

              "passed": False,

              "error": str(e)

            })



        # Calculate scores

        accuracy = sum(r["passed"] for r in results) / len(results)

        avg_time = sum(r.get("time_s", 0) for r in results) / len(results)

        errors = sum(1 for r in results if r["error"])



        print(f"Accuracy: {accuracy*100:.0f}%")

        print(f"Avg time: {avg_time:.1f}s")

        print(f"Errors: {errors}/{len(results)}")




    ## Common Evaluation Traps




        **Testing only the happy path**
         — Your test suite only has clear, well-formed queries. Add ambiguous inputs, edge cases, and adversarial prompts. Real users are messy.


        **Ignoring speed**
         — An agent that takes 45 seconds per response will frustrate users even if every answer is perfect. Measure latency on every test case.


        **Measuring once**
         — LLM outputs are non-deterministic. Run each test case 3-5 times and measure the spread. An agent that passes 3/5 times is 60% reliable, not 100%.


        **No production monitoring**
         — Pre-launch testing is not enough. Log every production interaction and review failure cases weekly. Accuracy drifts over time as user patterns change.





    ## The Evaluation Pipeline

    Knowing the five dimensions is not enough. You need a repeatable process that turns raw test data into a deploy/no-deploy decision. Follow these five steps every time you evaluate:



        **Step 1 — Define Test Cases**
        Write three categories of test cases: **happy path** (clear, well-formed queries your agent is designed for), **edge cases** (unusual inputs, empty strings, extremely long queries, special characters), and **adversarial** (prompt injections, attempts to make the agent ignore its instructions, requests for actions outside its scope).
        **Target:** At least 10 happy path, 5 edge cases, and 5 adversarial cases per agent capability.


        **Step 2 — Run Batch Tests**
        Run each test case **3-5 times**. LLM outputs are non-deterministic, so a single pass tells you almost nothing about reliability. Record every response, every tool call, every latency measurement. A test case that passes 4 out of 5 runs is 80% reliable — not 100%.
        **Tip:** Automate this with a loop. Never run evaluation tests by hand — you will skip cases and introduce bias.


        **Step 3 — Calculate Dimension Scores**
        Aggregate your batch results into a score for each of the five dimensions. Accuracy = percentage of correct responses across all runs. Speed = average latency. Reliability = percentage of runs without errors or crashes. Cost = average token spend per interaction. Satisfaction = manual review score or user feedback rating.
        **Formula:** dimension_score = (passes / total_runs) * 100, weighted by severity if needed.


        **Step 4 — Check Against the 70+ Threshold**
        Every dimension must score **70 or above**. This is not an average — it is a minimum per dimension. An agent scoring 95/90/88/92/**55** fails because one dimension is below threshold. The chain is only as strong as its weakest link.
        **Why 70?** Below 70 means roughly 1 in 3 interactions will disappoint. Users forgive occasional issues but not frequent ones.


        **Step 5 — Deploy or Iterate**
        If all five dimensions are 70+, deploy with monitoring (see next section). If any dimension is below 70, **fix the lowest-scoring dimension first**. Do not try to improve everything at once. Target the weakest link, re-run evaluation, and repeat until all dimensions pass.
        **Common fixes by dimension:** Accuracy → better prompts, few-shot examples. Speed → caching, model routing. Reliability → retry logic, error handling. Cost → token limits, tiered models. Satisfaction → tone tuning, output formatting.





    ## Interactive: Rate Your Agent

    Adjust the sliders to evaluate your agent on all five dimensions. The radar chart shows how it compares against the deployment threshold:






        50
        Needs work
        Adjust the sliders to evaluate your agent





    ### Improvement Tips




    ## Production Monitoring

    Evaluation does not end at deploy. Your agent operates in a changing environment — user patterns shift, APIs update, model behavior drifts. Without production monitoring, you are flying blind:



        **Log every production interaction**
         — Store the input, output, tool calls, latency, and token count for every request. This is your evaluation dataset for free — real user behavior, not synthetic tests.


        **Review failure cases weekly**
         — Set a recurring review of interactions that errored, timed out, or received negative feedback. Patterns in failures reveal systemic issues that test suites miss.


        **Track accuracy drift over time**
         — Run your original test suite against the live agent monthly. If accuracy drops more than 5 points, investigate immediately. Model updates, API changes, and data shifts all cause drift.


        **Set up alerts for error rate spikes**
         — If your error rate exceeds 5% in any rolling hour, trigger an alert. A sudden spike usually means an external dependency broke (API down, rate limit hit, schema change). Catch it before users report it.



    Here is a minimal logging wrapper you can add around any agent function to capture production data:


      # monitor.py — Production logging wrapper

      import time, json, datetime



      def monitored_agent(agent_fn, log_file="agent_log.jsonl"):

        def wrapper(user_input):

          start = time.time()

          error = None

          response = None

          try:

            response = agent_fn(user_input)

          except Exception as e:

            error = str(e)



          entry = {

            "timestamp": datetime.datetime.utcnow().isoformat(),

            "input": user_input,

            "output": response,

            "latency_s": round(time.time() - start, 2),

            "error": error,

          }



          # Append to JSONL — one JSON object per line

          with open(log_file, "a") as f:

            f.write(json.dumps(entry) + "\n")



          if error:

            raise Exception(error)

          return response

        return wrapper



      # Usage: wrap your agent function

      safe_agent = monitored_agent(my_agent)

      result = safe_agent("What plan is jane@acme.co on?")



      **Why JSONL?** One JSON object per line makes it easy to stream, grep, and load into pandas or any analytics tool. Never use a plain CSV for agent logs — nested objects (tool calls, multi-turn context) do not fit flat tables.




### Quiz

**Q1: What is the recommended deploy threshold across all 5 dimensions?**
    A. 50 — above average is good enough
  ✓ B. 70 — meets the baseline for production reliability
    C. 90 — near-perfect only
    D. 100 — must be perfect
  *70 across all five dimensions is the standard deploy threshold. Below 70 on any dimension means meaningful risk of poor user experience or production failures.*

**Q2: An agent is 95% accurate but takes 45 seconds per query. Should you deploy?**
    A. Yes — accuracy is all that matters
  ✓ B. No — investigate caching, parallel tool calls, or faster models for simple tasks
    C. Yes — users will wait for accuracy
    D. No — shut down the entire project
  *Speed is one of five critical dimensions. 45 seconds frustrates users even with perfect accuracy. Cache frequent queries, parallelize tool calls, route simple tasks to faster models.*

**Q3: Why should you run each test case multiple times?**
    A. To waste more API credits
  ✓ B. LLM outputs are non-deterministic — an agent that passes 3/5 times is only 60% reliable
    C. To warm up the model
    D. Multiple runs average out network latency
  *LLMs can give different responses to the same input. Running each test 3-5 times reveals the true reliability rate. An agent that sometimes fails is not reliable enough for production.*

**Q4: Your agent scores 85 on accuracy, speed, reliability, and cost — but 40 on user satisfaction. What does this mean?**
    A. Deploy — 4 out of 5 is passing
  ✓ B. The agent is technically solid but users are not happy — fix tone, format, or transparency before deploying
    C. Ignore user satisfaction — it is subjective
    D. Average the scores — 77 overall is passing
  *All five dimensions must meet the threshold. High technical scores with low user satisfaction means the agent may be correct but unhelpful — wrong tone, confusing output, or poor transparency about limitations.*


### Agent Evaluation Framework

**Card 1:**
Front: The five evaluation dimensions
Back: Accuracy (correct responses), Speed (response time), Reliability (no crashes), Cost Efficiency (affordable at scale), User Satisfaction (users are happy). All five must score 70+ to deploy.

**Card 2:**
Front: How to measure accuracy
Back: Build a test suite with known inputs and expected outputs. Run each test case 3-5 times. Count how often the response contains the expected content. Target: 85%+.

**Card 3:**
Front: How to measure reliability
Back: Run 100+ test cases. Count errors, crashes, and silent failures. Reliability = (successful runs / total runs). Target: 95%+.

**Card 4:**
Front: Why run tests multiple times?
Back: LLM outputs are non-deterministic. The same input can produce different outputs. Running 3-5 times reveals the true success rate, not a lucky single run.

**Card 5:**
Front: Production monitoring
Back: Pre-launch testing is not enough. Log every production interaction, review failures weekly, measure accuracy drift. User patterns change and model behavior shifts over time.

**Card 6:**
Front: The speed-accuracy tradeoff
Back: Faster models (Haiku) are cheaper and quicker but less accurate. Powerful models (Opus) are more accurate but slower and expensive. Route based on query complexity.

**Card 7:**
Front: Test suite best practices
Back: Include happy path, ambiguous inputs, edge cases, and adversarial prompts. Real users are messy — your test suite should be too.
