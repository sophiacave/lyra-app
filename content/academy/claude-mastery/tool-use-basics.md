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
<p>Give Claude superpowers by connecting it to external tools</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 3</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Tool Use?</h2>
<p>Claude can process text and images, and since March 2025 can search the web. With <strong>tool use</strong> (also called function calling), Claude can do even more — query databases, call APIs, run code, and interact with any system you connect. You define the tools, and Claude decides when and how to use them.</p>
<p>Think of tools as giving Claude hands to go with its brain.</p>
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
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">✕</button>
</div>
<div class="param-row">
<div><label style="font-size:.7rem">Name</label><input type="text" class="p-name" value="units" oninput="updatePreview()"></div>
<div><label style="font-size:.7rem">Type</label><input type="text" class="p-type" value="string" oninput="updatePreview()"></div>
<button class="remove-param" onclick="this.parentElement.remove();updatePreview()">✕</button>
</div>
</div>
<button class="add-param-btn" onclick="addParam()">+ Add Parameter</button>
</div>
</div>

</div>

<div class="card">
<h2>See It In Action</h2>
<p>Watch the complete tool use flow — from user prompt to final response:</p>

<div class="flow-container" id="flowContainer">
<div class="flow-step" id="step0">
<div class="flow-icon" style="background:rgba(139,92,246,.15)">💬</div>
<div class="flow-text"><strong>User sends a message</strong><span>"What's the weather in Tokyo?"</span></div>
<div class="flow-status" style="background:rgba(139,92,246,.15);color:#8b5cf6">Waiting</div>
</div>
<div class="flow-step" id="step1">
<div class="flow-icon" style="background:rgba(56,189,248,.15)">🧠</div>
<div class="flow-text"><strong>Claude analyzes and decides to use a tool</strong><span>Recognizes it needs real-time weather data</span></div>
<div class="flow-status" style="background:rgba(56,189,248,.15);color:#38bdf8">Waiting</div>
</div>
<div class="flow-step" id="step2">
<div class="flow-icon" style="background:rgba(251,146,60,.15)">🔧</div>
<div class="flow-text"><strong>Claude calls: get_weather(location: "Tokyo")</strong><span>Your app receives the tool call and executes it</span></div>
<div class="flow-status" style="background:rgba(251,146,60,.15);color:#fb923c">Waiting</div>
</div>
<div class="flow-step" id="step3">
<div class="flow-icon" style="background:rgba(52,211,153,.15)">📡</div>
<div class="flow-text"><strong>Tool returns result</strong><span>{"temp": 22, "condition": "Partly Cloudy", "humidity": 65}</span></div>
<div class="flow-status" style="background:rgba(52,211,153,.15);color:#34d399">Waiting</div>
</div>
<div class="flow-step" id="step4">
<div class="flow-icon" style="background:rgba(244,114,182,.15)">✨</div>
<div class="flow-text"><strong>Claude responds with natural language</strong><span>"It's currently 22°C and partly cloudy in Tokyo with 65% humidity."</span></div>
<div class="flow-status" style="background:rgba(244,114,182,.15);color:#f472b6">Waiting</div>
</div>
</div>

<button class="run-btn" id="runBtn" onclick="runFlow()">▶ Run the Flow</button>
</div>

<div class="card">
<h2>Key Concepts</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Claude decides when to use tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">You provide the tools, but Claude autonomously decides if and when to call them based on the user's request.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">You execute the tools</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude outputs a structured tool call. YOUR application runs the actual function and returns the result.</p>
</div>
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Multi-step tool use</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Claude can chain multiple tool calls in sequence, using results from one tool to inform the next.</p>
</div>
</div>
</div>


<div data-learn="SortStack" data-props='{"title":"Order the Tool Use Flow","instruction":"Arrange the tool use steps in the correct sequence","items":["User sends a message to Claude","Claude analyzes the request and decides to call a tool","Claude outputs a structured tool call","Your application executes the tool and gets a result","Your app returns the result to Claude","Claude generates a natural language response"]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Tool Use Key Concepts","cards":[{"front":"Tool use (function calling)","back":"A feature that lets Claude interact with the real world by calling external functions you define — APIs, databases, web search, code execution, and more."},{"front":"Who decides when to call a tool?","back":"Claude decides autonomously based on the user request. You provide available tools; Claude determines if and when to use them."},{"front":"Who executes the tool?","back":"Your application. Claude outputs a structured tool call (JSON with name and parameters). Your code runs the actual function and returns the result."},{"front":"Tool input_schema","back":"A JSON Schema object that defines the parameters a tool accepts — their names, types, and which are required. This tells Claude how to call the tool correctly."},{"front":"Multi-step tool use","back":"Claude can chain tool calls in sequence — using output from one tool as input to the next, enabling complex multi-step workflows."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Tool Use Comprehension","questions":[{"q":"When Claude decides to use a tool, what does it actually output?","options":["A natural language description of what it wants to do","A structured JSON tool call with the tool name and parameters","A Python function call in a code block","A request for the user to run the tool manually"],"correct":1,"explanation":"Claude outputs a structured tool call — a JSON object containing the tool name and the parameter values it wants to pass. Your application receives this and executes the actual function."},{"q":"Who is responsible for executing the tool function?","options":["Claude executes it internally","The user manually runs it","Your application receives the tool call and runs the actual function","Anthropic runs it on their servers"],"correct":2,"explanation":"Your application is always responsible for executing tools. Claude decides to call a tool and outputs the call structure, but the actual execution happens in your code."},{"q":"What is the purpose of the input_schema in a tool definition?","options":["It defines the tool response format","It tells Claude what parameters the tool accepts, their types, and which are required","It sets rate limits on tool calls","It encrypts tool credentials"],"correct":1,"explanation":"The input_schema is a JSON Schema that describes the tool parameters — names, types, descriptions, and required fields. This lets Claude know how to construct a valid tool call."},{"q":"Claude is asked: What is the population of Tokyo right now? You have provided a web_search tool. What happens?","options":["Claude answers from its training data without using any tool","Claude refuses because it cannot browse the web","Claude autonomously calls web_search with an appropriate query","Claude asks the user to search manually"],"correct":2,"explanation":"Claude recognizes it needs current data and autonomously calls the web_search tool with a relevant query — without being explicitly told to do so. That is the power of autonomous tool use."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 8 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
