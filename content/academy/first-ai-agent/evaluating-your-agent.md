---
title: "Evaluating Your Agent"
course: "first-ai-agent"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/first-ai-agent/">First AI Agent</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Evaluating Your Agent</h1>
  <p class="sub">An agent that works in demo does not always work in production. Here are the five dimensions you must measure, the code to measure them, and the thresholds that separate "deployable" from "dangerous."</p>
</div>

  <div class="section">
    <h2>The Five Evaluation Dimensions</h2>
    <p>Rate your agent on each dimension. An agent must score above 70 on ALL five to be production-ready. One weak dimension can sink the entire experience:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">1. Accuracy</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">How often does the agent give correct, useful responses? Measure by running a test suite of known questions with expected answers.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem"><strong>Improve:</strong> Better system prompts, few-shot examples, output validation, tool result verification.</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(96,165,250,.04);border:1px solid rgba(96,165,250,.1)">
        <strong style="color:#60a5fa">2. Speed</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">How quickly does the agent complete tasks? Users expect responses within 5-10 seconds for simple queries, 30 seconds for complex multi-tool tasks.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem"><strong>Improve:</strong> Caching frequent queries, parallel tool calls, routing simple tasks to faster models.</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">3. Reliability</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Does the agent work consistently without crashes or silent failures? Measure error rate over 100+ runs.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem"><strong>Improve:</strong> Retry logic, fallback tools, comprehensive error handling, dead letter queues.</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">4. Cost Efficiency</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">How much does each agent interaction cost? At scale, a $0.50 interaction that should cost $0.05 will kill your budget.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem"><strong>Improve:</strong> Caching, token limits, tiered model routing (fast model for simple tasks, powerful model for complex).</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <strong style="color:#f472b6">5. User Satisfaction</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Are users happy? An agent can be technically correct but still frustrating if the tone is wrong, the format is confusing, or it does not explain its limitations.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem"><strong>Improve:</strong> Feedback collection, tone adjustments, clearer output formatting, transparency about limitations.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Building a Test Suite</h2>
    <p>You cannot evaluate what you do not measure. Here is how to build an automated test suite for your agent:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># eval.py — Agent evaluation framework</span><br>
      <span style="color:#c084fc">import</span> <span style="color:#e2e8f0">time</span><br>
      <br>
      <span style="color:#e2e8f0">TEST_CASES</span> = [<br>
      &nbsp;&nbsp;{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input"</span>: <span style="color:#fb923c">"What plan is jane@acme.co on?"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"expected_tool"</span>: <span style="color:#fb923c">"lookup_customer"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"expected_contains"</span>: [<span style="color:#fb923c">"Pro"</span>, <span style="color:#fb923c">"$49"</span>],<br>
      &nbsp;&nbsp;},<br>
      &nbsp;&nbsp;{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input"</span>: <span style="color:#fb923c">"How do I reset my password?"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"expected_tool"</span>: <span style="color:#fb923c">"search_knowledge_base"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"expected_contains"</span>: [<span style="color:#fb923c">"settings"</span>, <span style="color:#fb923c">"reset"</span>],<br>
      &nbsp;&nbsp;},<br>
      &nbsp;&nbsp;{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input"</span>: <span style="color:#fb923c">"I need help"</span>,&nbsp;&nbsp;<span style="color:#71717a"># Ambiguous</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"expected_tool"</span>: <span style="color:#c084fc">None</span>,&nbsp;&nbsp;<span style="color:#71717a"># Should ask for clarification</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"expected_contains"</span>: [<span style="color:#fb923c">"what"</span>, <span style="color:#fb923c">"help"</span>],<br>
      &nbsp;&nbsp;},<br>
      ]<br>
      <br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">evaluate_agent</span>(<span style="color:#e2e8f0">agent_fn</span>):<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">results</span> = []<br>
      &nbsp;&nbsp;<span style="color:#c084fc">for</span> <span style="color:#e2e8f0">case</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">TEST_CASES</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">start</span> = <span style="color:#e2e8f0">time</span>.<span style="color:#34d399">time</span>()<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">try</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">response</span> = <span style="color:#34d399">agent_fn</span>(<span style="color:#e2e8f0">case</span>[<span style="color:#fb923c">"input"</span>])<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">elapsed</span> = <span style="color:#e2e8f0">time</span>.<span style="color:#34d399">time</span>() - <span style="color:#e2e8f0">start</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">results</span>.<span style="color:#34d399">append</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input"</span>: <span style="color:#e2e8f0">case</span>[<span style="color:#fb923c">"input"</span>],<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"passed"</span>: <span style="color:#34d399">all</span>(<span style="color:#e2e8f0">kw</span>.<span style="color:#34d399">lower</span>() <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">response</span>.<span style="color:#34d399">lower</span>()<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">for</span> <span style="color:#e2e8f0">kw</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">case</span>[<span style="color:#fb923c">"expected_contains"</span>]),<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"time_s"</span>: <span style="color:#34d399">round</span>(<span style="color:#e2e8f0">elapsed</span>, <span style="color:#fb923c">2</span>),<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"error"</span>: <span style="color:#c084fc">None</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">except</span> <span style="color:#e2e8f0">Exception</span> <span style="color:#c084fc">as</span> <span style="color:#e2e8f0">e</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">results</span>.<span style="color:#34d399">append</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input"</span>: <span style="color:#e2e8f0">case</span>[<span style="color:#fb923c">"input"</span>],<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"passed"</span>: <span style="color:#c084fc">False</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"error"</span>: <span style="color:#c084fc">str</span>(<span style="color:#e2e8f0">e</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a"># Calculate scores</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">accuracy</span> = <span style="color:#34d399">sum</span>(<span style="color:#e2e8f0">r</span>[<span style="color:#fb923c">"passed"</span>] <span style="color:#c084fc">for</span> <span style="color:#e2e8f0">r</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">results</span>) / <span style="color:#34d399">len</span>(<span style="color:#e2e8f0">results</span>)<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">avg_time</span> = <span style="color:#34d399">sum</span>(<span style="color:#e2e8f0">r</span>.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"time_s"</span>, <span style="color:#fb923c">0</span>) <span style="color:#c084fc">for</span> <span style="color:#e2e8f0">r</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">results</span>) / <span style="color:#34d399">len</span>(<span style="color:#e2e8f0">results</span>)<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">errors</span> = <span style="color:#34d399">sum</span>(<span style="color:#fb923c">1</span> <span style="color:#c084fc">for</span> <span style="color:#e2e8f0">r</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">results</span> <span style="color:#c084fc">if</span> <span style="color:#e2e8f0">r</span>[<span style="color:#fb923c">"error"</span>])<br>
      <br>
      &nbsp;&nbsp;<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Accuracy: {accuracy*100:.0f}%"</span>)<br>
      &nbsp;&nbsp;<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Avg time: {avg_time:.1f}s"</span>)<br>
      &nbsp;&nbsp;<span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Errors: {errors}/{len(results)}"</span>)
    </div>
  </div>

  <div class="section">
    <h2>Common Evaluation Traps</h2>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Testing only the happy path</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Your test suite only has clear, well-formed queries. Add ambiguous inputs, edge cases, and adversarial prompts. Real users are messy.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Ignoring speed</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — An agent that takes 45 seconds per response will frustrate users even if every answer is perfect. Measure latency on every test case.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Measuring once</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — LLM outputs are non-deterministic. Run each test case 3-5 times and measure the spread. An agent that passes 3/5 times is 60% reliable, not 100%.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">No production monitoring</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Pre-launch testing is not enough. Log every production interaction and review failure cases weekly. Accuracy drifts over time as user patterns change.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Interactive: Rate Your Agent</h2>
    <p>Adjust the sliders to evaluate your agent on all five dimensions. The radar chart shows how it compares against the deployment threshold:</p>
  </div>

  <div class="eval-grid">
    <div class="radar-panel">
      <canvas id="radar"></canvas>
      <div class="verdict">
        <div class="score-big" id="avg-score">50</div>
        <div class="verdict-text" id="verdict-text">Needs work</div>
        <div class="verdict-sub" id="verdict-sub">Adjust the sliders to evaluate your agent</div>
      </div>
    </div>
  </div>

  <div class="tips" id="tips">
    <h3>Improvement Tips</h3>
  </div>
</div>

<div data-learn="QuizMC" data-props='{"title":"Agent Evaluation","questions":[{"q":"What is the recommended deploy threshold across all 5 dimensions?","options":["50 — above average is good enough","70 — meets the baseline for production reliability","90 — near-perfect only","100 — must be perfect"],"correct":1,"explanation":"70 across all five dimensions is the standard deploy threshold. Below 70 on any dimension means meaningful risk of poor user experience or production failures."},{"q":"An agent is 95% accurate but takes 45 seconds per query. Should you deploy?","options":["Yes — accuracy is all that matters","No — investigate caching, parallel tool calls, or faster models for simple tasks","Yes — users will wait for accuracy","No — shut down the entire project"],"correct":1,"explanation":"Speed is one of five critical dimensions. 45 seconds frustrates users even with perfect accuracy. Cache frequent queries, parallelize tool calls, route simple tasks to faster models."},{"q":"Why should you run each test case multiple times?","options":["To waste more API credits","LLM outputs are non-deterministic — an agent that passes 3/5 times is only 60% reliable","To warm up the model","Multiple runs average out network latency"],"correct":1,"explanation":"LLMs can give different responses to the same input. Running each test 3-5 times reveals the true reliability rate. An agent that sometimes fails is not reliable enough for production."},{"q":"Your agent scores 85 on accuracy, speed, reliability, and cost — but 40 on user satisfaction. What does this mean?","options":["Deploy — 4 out of 5 is passing","The agent is technically solid but users are not happy — fix tone, format, or transparency before deploying","Ignore user satisfaction — it is subjective","Average the scores — 77 overall is passing"],"correct":1,"explanation":"All five dimensions must meet the threshold. High technical scores with low user satisfaction means the agent may be correct but unhelpful — wrong tone, confusing output, or poor transparency about limitations."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Agent Evaluation Framework","cards":[{"front":"The five evaluation dimensions","back":"Accuracy (correct responses), Speed (response time), Reliability (no crashes), Cost Efficiency (affordable at scale), User Satisfaction (users are happy). All five must score 70+ to deploy."},{"front":"How to measure accuracy","back":"Build a test suite with known inputs and expected outputs. Run each test case 3-5 times. Count how often the response contains the expected content. Target: 85%+."},{"front":"How to measure reliability","back":"Run 100+ test cases. Count errors, crashes, and silent failures. Reliability = (successful runs / total runs). Target: 95%+."},{"front":"Why run tests multiple times?","back":"LLM outputs are non-deterministic. The same input can produce different outputs. Running 3-5 times reveals the true success rate, not a lucky single run."},{"front":"Production monitoring","back":"Pre-launch testing is not enough. Log every production interaction, review failures weekly, measure accuracy drift. User patterns change and model behavior shifts over time."},{"front":"The speed-accuracy tradeoff","back":"Faster models (Haiku) are cheaper and quicker but less accurate. Powerful models (Opus) are more accurate but slower and expensive. Route based on query complexity."},{"front":"Test suite best practices","back":"Include happy path, ambiguous inputs, edge cases, and adversarial prompts. Real users are messy — your test suite should be too."}]}'></div>
