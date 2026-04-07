---
title: "Build AI Workflow"
course: "automation-architect"
order: 8
type: "builder"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/automation-architect/">Automation Architect</a>
  <span class="lesson-badge">Lesson 8 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Build AI Workflow</h1>
  <p class="sub">Assemble a workflow from components: trigger, AI classify, filter, transform, and action. Then simulate data flowing through it.</p>
</div>

<div class="content">

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Workflow Design Principles</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Before building any workflow, you need to understand the design principles that separate reliable production systems from fragile scripts. These principles apply whether you are using Make.com, n8n, Zapier, or writing custom code.</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Single Responsibility</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Each step in your workflow should do exactly one thing. A step that classifies AND routes AND sends a notification is doing three things. Break it into three steps. When one fails, you know exactly where the problem is, and you can retry just that step without re-running the whole pipeline.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Data Contracts Between Steps</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Define what data each step expects as input and what it produces as output. When Step 2 expects a <code>customer_email</code> field from Step 1, that is a contract. If Step 1 changes its output format, Step 2 breaks. Document these contracts and validate inputs at each step.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Fail Gracefully</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Every step must handle failure. If the AI classifier returns an error, the workflow should not crash — it should route to a fallback (human review). If the email sender fails, save the message for retry. The question is never "will this fail?" but "what happens when it fails?"</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8">Observability</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Log every step's input, output, and execution time. You need to answer: "What happened to ticket #4521?" at any time. Without logging, you are debugging blind. Add a unique request ID that flows through every step so you can trace a single request across the entire pipeline.</p>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Common Workflow Patterns</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">There are three fundamental patterns for organizing workflow steps. Most real workflows combine these patterns.</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Sequential (Pipeline)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Steps run one after another. Step 2 waits for Step 1 to finish. Each step's output feeds into the next step's input. This is the simplest pattern — a straight line from trigger to final action.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem;font-style:italic">Example: Receive email &rarr; Extract intent &rarr; Create ticket &rarr; Notify team</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Parallel (Fan-out)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Multiple steps run simultaneously. Use this when steps are independent of each other — sending an email while also updating a database while also logging to analytics. Parallel execution reduces total workflow time.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem;font-style:italic">Example: New order &rarr; [Send confirmation email | Update inventory | Notify warehouse] (all at once)</div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Conditional (Router)</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Data is routed to different branches based on conditions. An IF/ELSE gate that sends data down different paths. Common in AI workflows where the classification result determines the next action.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem;font-style:italic">Example: Classify ticket &rarr; IF billing issue &rarr; Finance team | IF technical &rarr; Engineering | IF feedback &rarr; Product team</div>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>Workflow Example: n8n-Style Automation</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Here is how you would build a simple webhook-to-Slack automation using n8n concepts in code. This demonstrates the sequential pattern with error handling — the same logic used by visual automation platforms like Make.com and n8n.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Simple webhook-to-Slack workflow with retry logic</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> httpx, time, json

<span style="color:#c084fc">class</span> <span style="color:#34d399">WorkflowStep</span>:
    <span style="color:#fb923c">"""Base class for all workflow steps."""</span>
    <span style="color:#c084fc">def</span> <span style="color:#34d399">execute</span>(self, data: dict) -> dict:
        <span style="color:#c084fc">raise</span> <span style="color:#34d399">NotImplementedError</span>

<span style="color:#c084fc">class</span> <span style="color:#34d399">ValidatePayload</span>(WorkflowStep):
    <span style="color:#fb923c">"""Step 1: Validate incoming webhook data."""</span>
    <span style="color:#c084fc">def</span> <span style="color:#34d399">execute</span>(self, data: dict) -> dict:
        required = [<span style="color:#fb923c">"event"</span>, <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"message"</span>]
        missing = [f <span style="color:#c084fc">for</span> f <span style="color:#c084fc">in</span> required <span style="color:#c084fc">if</span> f <span style="color:#c084fc">not in</span> data]
        <span style="color:#c084fc">if</span> missing:
            <span style="color:#c084fc">raise</span> <span style="color:#34d399">ValueError</span>(<span style="color:#fb923c">f"Missing fields: </span>{missing}<span style="color:#fb923c">"</span>)
        <span style="color:#c084fc">return</span> data

<span style="color:#c084fc">class</span> <span style="color:#34d399">SendSlackMessage</span>(WorkflowStep):
    <span style="color:#fb923c">"""Step 2: Post to Slack with retry logic."""</span>
    <span style="color:#c084fc">def</span> <span style="color:#34d399">execute</span>(self, data: dict) -> dict:
        <span style="color:#c084fc">for</span> attempt <span style="color:#c084fc">in</span> <span style="color:#34d399">range</span>(<span style="color:#fb923c">3</span>):
            <span style="color:#c084fc">try</span>:
                resp = httpx.<span style="color:#34d399">post</span>(
                    <span style="color:#fb923c">"https://hooks.slack.com/services/YOUR/WEBHOOK"</span>,
                    json={<span style="color:#fb923c">"text"</span>: <span style="color:#fb923c">f"</span>{data[<span style="color:#fb923c">'user'</span>]}: {data[<span style="color:#fb923c">'message'</span>]}<span style="color:#fb923c">"</span>},
                    timeout=<span style="color:#fb923c">10.0</span>
                )
                resp.<span style="color:#34d399">raise_for_status</span>()
                <span style="color:#c084fc">return</span> {**data, <span style="color:#fb923c">"slack_sent"</span>: <span style="color:#c084fc">True</span>}
            <span style="color:#c084fc">except</span> httpx.HTTPError:
                time.<span style="color:#34d399">sleep</span>(<span style="color:#fb923c">2</span> ** attempt)
        <span style="color:#c084fc">return</span> {**data, <span style="color:#fb923c">"slack_sent"</span>: <span style="color:#c084fc">False</span>, <span style="color:#fb923c">"error"</span>: <span style="color:#fb923c">"All retries failed"</span>}

<span style="color:#c084fc">def</span> <span style="color:#34d399">run_pipeline</span>(payload: dict):
    <span style="color:#fb923c">"""Execute steps sequentially."""</span>
    steps = [<span style="color:#34d399">ValidatePayload</span>(), <span style="color:#34d399">SendSlackMessage</span>()]
    data = payload
    <span style="color:#c084fc">for</span> step <span style="color:#c084fc">in</span> steps:
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Running: </span>{step.__class__.__name__}<span style="color:#fb923c">"</span>)
        data = step.<span style="color:#34d399">execute</span>(data)
    <span style="color:#c084fc">return</span> data</code></pre>
</div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>AI in Workflows: When and Why</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Not every workflow needs AI. Traditional rules engines work perfectly for deterministic logic — if order total &gt; $100, apply discount. AI adds value in specific scenarios where rules-based approaches fall short.</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Use AI when: input is unstructured</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">Free-text emails, chat messages, social media posts. You cannot write a rule for every possible way a customer might phrase a billing complaint. AI generalizes from patterns — it can classify intent even for phrasings it has never seen before.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Use AI when: categories are fuzzy</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">"Is this email a complaint, a question, or feedback?" often has no clear answer. AI assigns probabilities — 70% complaint, 20% question, 10% feedback — and the confidence score lets your workflow decide whether to act automatically or escalate to a human.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Use rules when: logic is deterministic</strong>
        <p style="font-size:.82rem;color:#a1a1aa;margin:.3rem 0 0">If the condition is clear-cut — order total above a threshold, user in a specific country, timestamp within business hours — use a simple IF/ELSE. Rules are faster, cheaper, and 100% predictable. AI adds latency and cost for no benefit on deterministic decisions.</p>
      </div>
    </div>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>AI Workflow Components</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">An AI workflow is a pipeline of components that process data in sequence. Each component has a specific role: a <strong>trigger</strong> receives incoming data, an <strong>AI classifier</strong> analyzes intent, a <strong>filter</strong> gates by confidence, a <strong>transform</strong> reshapes the output, and an <strong>action</strong> delivers the result. The code example below shows exactly how these components connect in production.</p>
  </div>

  <div style="padding:0 1.5rem;margin:1.5rem 0">
    <h2>The Code Behind the Canvas</h2>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Here is a complete AI workflow script — receive data, classify it with an LLM, filter by confidence, transform the output, and route it to the right team:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Complete AI classification workflow</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> httpx, json

<span style="color:#c084fc">def</span> <span style="color:#34d399">ai_classify</span>(text: str, api_key: str) -> dict:
    <span style="color:#fb923c">"""Call Claude to classify incoming support text."""</span>
    response = httpx.<span style="color:#34d399">post</span>(
        <span style="color:#fb923c">"https://api.anthropic.com/v1/messages"</span>,
        headers={
            <span style="color:#fb923c">"x-api-key"</span>: api_key,
            <span style="color:#fb923c">"anthropic-version"</span>: <span style="color:#fb923c">"2023-06-01"</span>,
            <span style="color:#fb923c">"content-type"</span>: <span style="color:#fb923c">"application/json"</span>
        },
        json={
            <span style="color:#fb923c">"model"</span>: <span style="color:#fb923c">"claude-sonnet-4-20250514"</span>,
            <span style="color:#fb923c">"max_tokens"</span>: <span style="color:#fb923c">200</span>,
            <span style="color:#fb923c">"messages"</span>: [{<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"content"</span>: (
                <span style="color:#fb923c">f"Classify this support ticket. Return JSON with "</span>
                <span style="color:#fb923c">f"'intent', 'team', and 'confidence' (0-100).\n\n{text}"</span>
            )}]
        },
        timeout=<span style="color:#fb923c">30.0</span>
    )
    <span style="color:#c084fc">return</span> json.<span style="color:#34d399">loads</span>(response.<span style="color:#34d399">json</span>()[<span style="color:#fb923c">"content"</span>][<span style="color:#fb923c">0</span>][<span style="color:#fb923c">"text"</span>])

<span style="color:#c084fc">def</span> <span style="color:#34d399">run_workflow</span>(ticket: dict, api_key: str):
    <span style="color:#fb923c">"""Trigger → AI Classify → Filter → Transform → Action"""</span>

    <span style="color:#71717a"># Step 1: AI Classify</span>
    result = <span style="color:#34d399">ai_classify</span>(ticket[<span style="color:#fb923c">"text"</span>], api_key)
    <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"AI classified: </span>{result[<span style="color:#fb923c">'intent'</span>]}<span style="color:#fb923c"> (confidence: </span>{result[<span style="color:#fb923c">'confidence'</span>]}<span style="color:#fb923c">%)"</span>)

    <span style="color:#71717a"># Step 2: Filter — only act on high-confidence results</span>
    <span style="color:#c084fc">if</span> result[<span style="color:#fb923c">"confidence"</span>] < <span style="color:#fb923c">80</span>:
        <span style="color:#34d399">print</span>(<span style="color:#fb923c">"Low confidence — routing to human review"</span>)
        <span style="color:#c084fc">return</span> {<span style="color:#fb923c">"action"</span>: <span style="color:#fb923c">"human_review"</span>, <span style="color:#fb923c">"ticket"</span>: ticket}

    <span style="color:#71717a"># Step 3: Transform — reshape for the action step</span>
    routed = {
        <span style="color:#fb923c">"team"</span>: result[<span style="color:#fb923c">"team"</span>],
        <span style="color:#fb923c">"priority"</span>: <span style="color:#fb923c">"high"</span> <span style="color:#c084fc">if</span> result[<span style="color:#fb923c">"confidence"</span>] > <span style="color:#fb923c">95</span> <span style="color:#c084fc">else</span> <span style="color:#fb923c">"normal"</span>,
        <span style="color:#fb923c">"subject"</span>: ticket[<span style="color:#fb923c">"text"</span>][:<span style="color:#fb923c">80</span>],
        <span style="color:#fb923c">"customer"</span>: ticket[<span style="color:#fb923c">"email"</span>]
    }

    <span style="color:#71717a"># Step 4: Action — send to the right team</span>
    <span style="color:#34d399">print</span>(<span style="color:#fb923c">f"Routed to </span>{routed[<span style="color:#fb923c">'team'</span>]}<span style="color:#fb923c"> (priority: </span>{routed[<span style="color:#fb923c">'priority'</span>]}<span style="color:#fb923c">)"</span>)
    <span style="color:#c084fc">return</span> {<span style="color:#fb923c">"action"</span>: <span style="color:#fb923c">"routed"</span>, **routed}

<span style="color:#71717a"># Example: incoming support ticket triggers the workflow</span>
ticket = {<span style="color:#fb923c">"email"</span>: <span style="color:#fb923c">"customer@acme.co"</span>, <span style="color:#fb923c">"text"</span>: <span style="color:#fb923c">"I can't log in to my account"</span>}
<span style="color:#34d399">run_workflow</span>(ticket, api_key=<span style="color:#fb923c">"sk-ant-..."</span>)</code></pre>
</div>
  </div>
<div data-learn="FlashDeck" data-props='{"title":"AI Workflow Components","cards":[{"front":"Webhook Trigger","back":"Receives incoming HTTP data to start the pipeline. Every workflow begins with a trigger."},{"front":"AI Classify","back":"Claude reads the incoming content and assigns an intent label with a confidence score."},{"front":"Filter","back":"A condition gate — only passes data that meets the threshold. Example: confidence > 80%."},{"front":"Transform","back":"Reshapes the data structure for the next step. Example: extract team name and priority from the AI output."},{"front":"Send to Team (action)","back":"The final step — routes the processed data to the correct destination, creates a ticket, sends a notification."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"AI Workflow Quiz","questions":[{"q":"What is the purpose of the Filter step in an AI workflow?","options":["To classify the content","To receive incoming data","To only pass data that meets a confidence threshold","To format the final output"],"correct":2,"explanation":"The Filter step acts as a condition gate — it lets through only the data that meets your criteria, such as AI confidence above 80%."},{"q":"What does the Transform step do?","options":["Sends data to the team","Classifies intent","Reshapes the data structure for the next step","Receives the webhook payload"],"correct":2,"explanation":"Transform reshapes data — it takes the AI output and formats it into exactly what the action step needs, like extracting team name and priority."},{"q":"Why add a Filter between AI Classify and the action?","options":["To make the workflow longer","To prevent low-confidence misclassifications from being acted upon automatically","To increase processing speed","To store data in a database"],"correct":1,"explanation":"Filtering by confidence prevents the workflow from acting on uncertain AI outputs. Low-confidence results can be sent to a human review queue instead."}]}'></div>

</div>

</div>

