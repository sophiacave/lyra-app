---
title: "Tool Use"
course: "claude-mastery"
order: 8
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 8 · Interactive</div>
<h1>Tool Use Basics</h1>
<p>Give Claude superpowers by connecting it to external tools — with complete working code</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 3</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Tool Use?</h2>
<p>Claude can process text and images, and can search the web. With <strong>tool use</strong> (also called function calling), Claude can do much more — query databases, call APIs, run code, send emails, and interact with any system you connect. You define the tools. Claude decides when and how to use them.</p>

<p>Think of tools as giving Claude hands to go with its brain. Without tools, Claude can only tell you what it <em>would</em> do. With tools, it can actually do it.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Key insight:</strong> Claude does not execute tools itself. It outputs a <em>structured request</em> saying "I want to call this tool with these parameters." YOUR code executes the actual function and returns the result to Claude. This separation is a security feature — you always control what actions are taken.
</div>
</div>

<div class="card">
<h2>The Tool Use Flow</h2>
<p>Every tool use interaction follows the same 5-step pattern:</p>

<div class="flow-container" id="flowContainer">
<div class="flow-step" id="step0">
<div class="flow-icon" style="background:rgba(139,92,246,.15)">1</div>
<div class="flow-text"><strong>User sends a message</strong><span>"What's the weather in Tokyo?"</span></div>
<div class="flow-status" style="background:rgba(139,92,246,.15);color:#8b5cf6">Waiting</div>
</div>
<div class="flow-step" id="step1">
<div class="flow-icon" style="background:rgba(56,189,248,.15)">2</div>
<div class="flow-text"><strong>Claude decides to use a tool</strong><span>Recognizes it needs real-time weather data</span></div>
<div class="flow-status" style="background:rgba(56,189,248,.15);color:#38bdf8">Waiting</div>
</div>
<div class="flow-step" id="step2">
<div class="flow-icon" style="background:rgba(251,146,60,.15)">3</div>
<div class="flow-text"><strong>Claude outputs a structured tool call</strong><span>get_weather(location: "Tokyo", units: "celsius")</span></div>
<div class="flow-status" style="background:rgba(251,146,60,.15);color:#fb923c">Waiting</div>
</div>
<div class="flow-step" id="step3">
<div class="flow-icon" style="background:rgba(52,211,153,.15)">4</div>
<div class="flow-text"><strong>Your app executes the tool and returns the result</strong><span>{"temp": 22, "condition": "Partly Cloudy", "humidity": 65}</span></div>
<div class="flow-status" style="background:rgba(52,211,153,.15);color:#34d399">Waiting</div>
</div>
<div class="flow-step" id="step4">
<div class="flow-icon" style="background:rgba(244,114,182,.15)">5</div>
<div class="flow-text"><strong>Claude responds with natural language</strong><span>"It's currently 22C and partly cloudy in Tokyo with 65% humidity."</span></div>
<div class="flow-status" style="background:rgba(244,114,182,.15);color:#f472b6">Waiting</div>
</div>
</div>

<button class="run-btn" id="runBtn" onclick="runFlow()">Run the Flow</button>
</div>

<div class="card">
<h2>Complete Working Example</h2>
<p>Here is a fully functional tool use implementation. This code actually works — you can run it with your API key:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — complete tool use implementation</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic, json

client = anthropic.Anthropic()

<span style="color:#71717a"># Step 1: Define your tools</span>
tools = [
    {
        <span style="color:#fbbf24">"name"</span>: <span style="color:#fbbf24">"get_weather"</span>,
        <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Get current weather for a location."</span>,
        <span style="color:#fbbf24">"input_schema"</span>: {
            <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"object"</span>,
            <span style="color:#fbbf24">"properties"</span>: {
                <span style="color:#fbbf24">"location"</span>: {
                    <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>,
                    <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"City name, e.g. Tokyo"</span>
                },
                <span style="color:#fbbf24">"units"</span>: {
                    <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>,
                    <span style="color:#fbbf24">"enum"</span>: [<span style="color:#fbbf24">"celsius"</span>, <span style="color:#fbbf24">"fahrenheit"</span>],
                    <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Temperature units"</span>
                }
            },
            <span style="color:#fbbf24">"required"</span>: [<span style="color:#fbbf24">"location"</span>]
        }
    }
]

<span style="color:#71717a"># Step 2: Your tool implementation (replace with real API)</span>
<span style="color:#c084fc">def</span> <span style="color:#38bdf8">execute_tool</span>(name: str, params: dict) -> str:
    <span style="color:#c084fc">if</span> name == <span style="color:#fbbf24">"get_weather"</span>:
        <span style="color:#71717a"># In production: call a real weather API here</span>
        <span style="color:#c084fc">return</span> json.dumps({
            <span style="color:#fbbf24">"temp"</span>: <span style="color:#fb923c">22</span>,
            <span style="color:#fbbf24">"condition"</span>: <span style="color:#fbbf24">"Partly Cloudy"</span>,
            <span style="color:#fbbf24">"humidity"</span>: <span style="color:#fb923c">65</span>
        })
    <span style="color:#c084fc">raise</span> ValueError(f<span style="color:#fbbf24">"Unknown tool: {name}"</span>)

<span style="color:#71717a"># Step 3: Send message with tools</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">1024</span>,
    tools=tools,
    messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"What's the weather in Tokyo?"</span>}]
)

<span style="color:#71717a"># Step 4: Check if Claude wants to use a tool</span>
<span style="color:#c084fc">if</span> response.stop_reason == <span style="color:#fbbf24">"tool_use"</span>:
    <span style="color:#71717a"># Find the tool_use block</span>
    tool_block = next(
        b <span style="color:#c084fc">for</span> b <span style="color:#c084fc">in</span> response.content
        <span style="color:#c084fc">if</span> b.type == <span style="color:#fbbf24">"tool_use"</span>
    )
    <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Claude wants to call: {tool_block.name}"</span>)
    <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"With params: {tool_block.input}"</span>)

    <span style="color:#71717a"># Execute the tool</span>
    result = execute_tool(tool_block.name, tool_block.input)

    <span style="color:#71717a"># Step 5: Send result back to Claude</span>
    final = client.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
        max_tokens=<span style="color:#fb923c">1024</span>,
        tools=tools,
        messages=[
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"What's the weather in Tokyo?"</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: response.content},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: [{
                <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"tool_result"</span>,
                <span style="color:#fbbf24">"tool_use_id"</span>: tool_block.id,
                <span style="color:#fbbf24">"content"</span>: result
            }]}
        ]
    )
    <span style="color:#34d399">print</span>(final.content[<span style="color:#fb923c">0</span>].text)
    <span style="color:#71717a"># "It's currently 22C and partly cloudy in Tokyo</span>
    <span style="color:#71717a">#  with 65% humidity."</span></code></pre>
</div>
</div>

<div class="card">
<h2>Multi-Step Tool Use</h2>
<p>The real power of tool use emerges when Claude chains multiple tools in sequence — using the result of one tool to decide what to do next. Here is a production pattern using a tool loop:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — agentic tool loop (multi-step)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">run_agent</span>(user_message: str, tools: list, max_steps: int = <span style="color:#fb923c">10</span>):
    <span style="color:#fb923c">"""Run an agentic tool loop until Claude is done."""</span>
    messages = [{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: user_message}]

    <span style="color:#c084fc">for</span> step <span style="color:#c084fc">in</span> range(max_steps):
        response = client.messages.create(
            model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
            max_tokens=<span style="color:#fb923c">4096</span>,
            tools=tools,
            messages=messages
        )

        <span style="color:#71717a"># If Claude is done (no more tool calls), return</span>
        <span style="color:#c084fc">if</span> response.stop_reason == <span style="color:#fbbf24">"end_turn"</span>:
            <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text

        <span style="color:#71717a"># Process all tool calls in this response</span>
        messages.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: response.content})
        tool_results = []
        <span style="color:#c084fc">for</span> block <span style="color:#c084fc">in</span> response.content:
            <span style="color:#c084fc">if</span> block.type == <span style="color:#fbbf24">"tool_use"</span>:
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"tool_result"</span>,
                    <span style="color:#fbbf24">"tool_use_id"</span>: block.id,
                    <span style="color:#fbbf24">"content"</span>: result
                })
        messages.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: tool_results})

    <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"Agent hit max steps without completing."</span>

<span style="color:#71717a"># Now Claude can chain: search -> read -> analyze -> respond</span>
answer = run_agent(
    <span style="color:#fbbf24">"Find recent weather in Tokyo and New York, then compare them."</span>,
    tools=tools
)
<span style="color:#34d399">print</span>(answer)</code></pre>
</div>
<p style="font-size:.82rem;color:#71717a;margin-top:.5rem">This loop pattern is the foundation of AI agents (Lesson 10). Claude keeps calling tools until it has enough information to answer, then stops. The <code>max_steps</code> guard prevents infinite loops.</p>
</div>

<div class="card">
<h2>Build a Tool Definition</h2>
<p>Define a tool that Claude can use. Fill in the fields below to see the JSON schema update in real-time.</p>

<div class="tool-builder">
<div>
<label>Tool Name</label>
<input type="text" id="toolName" placeholder="e.g., get_weather" value="get_weather" oninput="updatePreview()">
</div>
<div>
<label>Description</label>
<textarea id="toolDesc" placeholder="What does this tool do?" rows="2" oninput="updatePreview()">Get the current weather for a given location. Returns temperature, conditions, and humidity.</textarea>
</div>
<div>
<label>Parameters</label>
<div id="paramList">
<div class="param-row">
<div><label style="font-size:.7rem">Name</label><input type="text" class="p-name" value="location" oninput="updatePreview()"></div>
<div><label style="font-size:.7rem">Type</label><input type="text" class="p-type" value="string" oninput="updatePreview()"></div>
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">x</button>
</div>
<div class="param-row">
<div><label style="font-size:.7rem">Name</label><input type="text" class="p-name" value="units" oninput="updatePreview()"></div>
<div><label style="font-size:.7rem">Type</label><input type="text" class="p-type" value="string" oninput="updatePreview()"></div>
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">x</button>
</div>
</div>
<button class="add-param-btn" onclick="addParam()">+ Add Parameter</button>
</div>
</div>
</div>

<div class="card">
<h2>Error Handling</h2>
<p>In production, tools fail. APIs go down, databases timeout, rate limits kick in. Always handle tool errors gracefully:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — error handling for tool results</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># When a tool fails, send an error result back to Claude</span>
<span style="color:#71717a"># Claude will adapt — it might try a different approach</span>
<span style="color:#71717a"># or explain to the user that the tool is unavailable</span>

<span style="color:#c084fc">try</span>:
    result = execute_tool(tool_block.name, tool_block.input)
    tool_result = {
        <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"tool_result"</span>,
        <span style="color:#fbbf24">"tool_use_id"</span>: tool_block.id,
        <span style="color:#fbbf24">"content"</span>: result
    }
<span style="color:#c084fc">except</span> Exception <span style="color:#c084fc">as</span> e:
    tool_result = {
        <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"tool_result"</span>,
        <span style="color:#fbbf24">"tool_use_id"</span>: tool_block.id,
        <span style="color:#fbbf24">"content"</span>: f<span style="color:#fbbf24">"Error: {str(e)}"</span>,
        <span style="color:#fbbf24">"is_error"</span>: True  <span style="color:#71717a"># tells Claude this failed</span>
    }
<span style="color:#71717a"># Claude sees the error and responds appropriately:</span>
<span style="color:#71717a"># "I wasn't able to get the weather data right now.</span>
<span style="color:#71717a">#  The service appears to be unavailable."</span></code></pre>
</div>
</div>

<div class="card">
<h2>Key Concepts</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Claude decides when to use tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">You provide the tools, but Claude autonomously decides if and when to call them based on the user's request. You do not need to say "use the weather tool" — Claude figures it out.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">You execute the tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude outputs a structured tool call. YOUR application runs the actual function and returns the result. This is a security boundary — Claude cannot access anything you don't explicitly enable.</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Multi-step chaining</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude can call multiple tools in sequence, using results from one to inform the next. This is the tool loop pattern — and it is the foundation of AI agents.</p>
</div>
<div style="padding:1rem;background:rgba(244,114,182,.05);border-radius:10px;border:1px solid rgba(244,114,182,.1)">
<strong style="color:#f472b6">Good descriptions matter</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude chooses tools based on their name and description. A tool named "do_thing" with no description will be used less effectively than "get_current_weather" with a clear description of what it returns.</p>
</div>
</div>
</div>
<div data-learn="FlashDeck" data-props='{"title":"Tool Use Key Concepts","cards":[{"front":"Tool use (function calling)","back":"A feature that lets Claude interact with the real world by calling external functions you define. You provide tool schemas (name, description, parameters). Claude outputs structured calls. Your code executes them."},{"front":"Who decides when to call a tool?","back":"Claude decides autonomously based on the user request. You provide available tools in the tools parameter; Claude determines if and when to use them based on the conversation."},{"front":"Who executes the tool?","back":"Your application. Claude outputs a structured JSON tool call. Your code receives this, runs the actual function, and returns the result as a tool_result message. This separation is a security boundary."},{"front":"The tool loop pattern","back":"A while loop that keeps calling Claude until stop_reason is end_turn (not tool_use). Each iteration: get response, execute tool calls, send results back. This enables multi-step agent behavior."},{"front":"Tool error handling","back":"When a tool fails, return a tool_result with is_error: true and an error message. Claude will adapt — it might try a different approach or inform the user. Never let tool errors crash your application."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Tool Use Comprehension","questions":[{"q":"When Claude decides to use a tool, what does it actually output?","options":["A natural language description of what it wants to do","A structured JSON tool call with the tool name and parameters","A Python function call in a code block","A request for the user to run the tool manually"],"correct":1,"explanation":"Claude outputs a structured tool call — a JSON object containing the tool name, a unique ID, and the parameter values. Your application receives this and executes the actual function. The stop_reason will be tool_use."},{"q":"Who is responsible for executing the tool function?","options":["Claude executes it internally","The user manually runs it","Your application receives the tool call and runs the actual function","Anthropic runs it on their servers"],"correct":2,"explanation":"Your application is always responsible for executing tools. This is a critical security boundary — Claude can only use tools you explicitly provide, and your code controls what actually happens."},{"q":"What is the tool loop pattern used for?","options":["Retrying failed API calls","Enabling Claude to chain multiple tool calls until the task is complete","Polling for new messages","Rate limiting tool calls"],"correct":1,"explanation":"The tool loop keeps calling Claude until it stops requesting tools (stop_reason == end_turn). Each iteration processes tool calls and sends results back. This enables multi-step agent workflows."},{"q":"A tool call fails with a timeout error. What should your code do?","options":["Retry the tool call 10 times","Crash the application","Return a tool_result with is_error: true and an error message","Ignore the error and skip the tool"],"correct":2,"explanation":"Return a tool_result with is_error: true so Claude knows the tool failed. Claude will adapt — it might try a different approach, use a different tool, or inform the user. Never silently ignore tool errors."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 8 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
