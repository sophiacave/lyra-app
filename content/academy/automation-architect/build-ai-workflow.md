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

