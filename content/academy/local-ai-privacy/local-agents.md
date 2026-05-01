---
title: "Local AI Agents"
course: "local-ai-privacy"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/local-ai-privacy/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Local AI <span class="accent">Agents.</span></h1>
  <p class="sub">Build AI agents that use tools, make decisions, and execute multi-step tasks -- all running on your hardware with no API keys.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What AI agents are and how they differ from simple chatbots</li>
    <li>Building a tool-using agent with Ollama and Python</li>
    <li>The ReAct pattern for agent reasoning</li>
    <li>Safety guardrails for autonomous local agents</li>
  </ul>
</div>

<div class="lesson-section">
<h2>From Chat to Agent</h2>
<p>A chatbot takes a prompt and returns a response. An agent takes a goal and figures out the steps to achieve it, using tools along the way. The difference is autonomy: a chatbot answers questions, an agent solves problems.</p>
<p>An agent loop looks like this:</p>
<ol>
<li><strong>Observe:</strong> Read the current state (user query, previous results, tool outputs)</li>
<li><strong>Think:</strong> Decide what to do next</li>
<li><strong>Act:</strong> Call a tool (search files, run code, query a database, read a webpage)</li>
<li><strong>Repeat:</strong> Use the tool output to decide the next action, until the goal is achieved</li>
</ol>
<p>Cloud-based agents (like OpenAI's Assistants API) require API keys and send your data to external servers. Local agents run entirely on your machine: Ollama provides the brain, Python provides the tools, and your data stays private.</p>
</div>

<div class="lesson-section">
<h2>The ReAct Pattern</h2>
<p>ReAct (Reasoning + Acting) is the standard pattern for building agents. The model alternates between thinking (reasoning about what to do) and acting (calling tools). Here's the core prompt:</p>

<div class="demo-container">
<h4>ReAct Agent Prompt</h4>
<pre><code>SYSTEM_PROMPT = """You are an AI assistant with access to tools.
For each user request, think step by step, then use tools as needed.

Available tools:
- search_files(query): Search local files for content matching query
- read_file(path): Read a file's contents
- run_python(code): Execute Python code and return output
- search_web(query): Search the web (if online)

Respond in this format:
THOUGHT: [your reasoning about what to do next]
ACTION: [tool_name(arguments)]
OBSERVATION: [tool output will be inserted here]
... repeat THOUGHT/ACTION/OBSERVATION as needed ...
ANSWER: [final answer to the user]

Always think before acting. Never fabricate tool outputs."""</code></pre>
</div>

<p>The key insight: <strong>the model generates the tool call as text, your code parses and executes it, then feeds the result back to the model.</strong> The model never actually runs code or accesses files -- your Python wrapper does that, with whatever safety checks you define.</p>
</div>

<div class="lesson-section">
<h2>Building a Local Agent</h2>
<p>Here's a working local agent using Ollama:</p>
<pre><code>import requests, subprocess, os, re

def call_ollama(messages):
    r = requests.post("http://localhost:11434/api/chat", json={
        "model": "qwen2.5:14b",
        "messages": messages, "stream": False
    })
    return r.json()["message"]["content"]

def search_files(query):
    result = subprocess.run(
        ["grep", "-rl", query, "./documents"],
        capture_output=True, text=True, timeout=10)
    return result.stdout or "No matches found."

def read_file(path):
    safe_path = os.path.abspath(path)
    if not safe_path.startswith(os.path.abspath("./documents")):
        return "ERROR: Access denied. Can only read from ./documents"
    with open(safe_path) as f:
        return f.read()[:3000]  # Limit output size

TOOLS = {"search_files": search_files, "read_file": read_file}

def run_agent(user_query, max_steps=5):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query}
    ]
    for step in range(max_steps):
        response = call_ollama(messages)
        print(f"Step {step+1}: {response[:200]}")

        # Check if agent is done
        if "ANSWER:" in response:
            return response.split("ANSWER:")[-1].strip()

        # Parse and execute tool call
        action_match = re.search(
            r'ACTION:\s*(\w+)\((.+?)\)', response)
        if action_match:
            tool_name = action_match.group(1)
            tool_arg = action_match.group(2).strip('"\'')
            if tool_name in TOOLS:
                result = TOOLS[tool_name](tool_arg)
                messages.append({"role": "assistant",
                                 "content": response})
                messages.append({"role": "user",
                    "content": f"OBSERVATION: {result}"})
            else:
                messages.append({"role": "user",
                    "content": f"OBSERVATION: Unknown tool {tool_name}"})
    return "Agent reached maximum steps without completing."

answer = run_agent("Find all documents about Q3 revenue and
    summarize the key trends.")</code></pre>

<div class="tip-box">
<strong>Model choice matters for agents.</strong> Agents need strong instruction-following and reasoning. Smaller models (7-8B) often struggle with the ReAct format, calling wrong tools or generating malformed actions. Use 14B+ models for reliable agent behavior. Qwen 2.5 14B and DeepSeek-R1 32B work well.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Safety Guardrails</h2>
<p>An autonomous agent running on your machine can potentially access files, execute code, and modify data. Safety is not optional:</p>
<p><strong>1. Filesystem sandboxing:</strong> Restrict file access to specific directories. Never let an agent read or write outside its sandbox. The <code>read_file</code> function above demonstrates path validation.</p>
<p><strong>2. Code execution isolation:</strong> If your agent can run Python, use subprocess with timeouts and resource limits. Never use <code>eval()</code> on model-generated code. Consider running code in a Docker container for full isolation.</p>
<p><strong>3. Action limits:</strong> Set a maximum number of steps (as shown: <code>max_steps=5</code>). An agent stuck in a loop can consume resources indefinitely.</p>
<p><strong>4. Confirmation gates:</strong> For destructive actions (deleting files, sending emails, modifying databases), require human confirmation before execution. The agent proposes the action; you approve it.</p>
<p><strong>5. Audit logging:</strong> Log every tool call, every input, every output. When something goes wrong (and it will), you need a complete trace to debug it.</p>

<div class="callout">
<strong>The autonomy spectrum:</strong> Start with fully supervised agents (you approve every action). Move to semi-autonomous (only approve destructive actions). Only consider fully autonomous operation after extensive testing with your specific model and tools. Trust is earned through logged, auditable behavior.
</div>
</div>

<div class="lesson-section">
<h2>Practical Agent Use Cases</h2>
<p>Local agents excel at tasks that require multiple steps across your private data:</p>
<ul>
<li><strong>Research agent:</strong> Search your documents, synthesize findings, generate a summary report</li>
<li><strong>Code review agent:</strong> Read source files, identify issues, suggest fixes</li>
<li><strong>Data processing agent:</strong> Read CSV files, clean data, generate analysis, write output files</li>
<li><strong>Meeting prep agent:</strong> Search calendar, find relevant documents, generate briefing notes</li>
<li><strong>Compliance checker:</strong> Read policy documents, compare against current practices, flag gaps</li>
</ul>
<p>Each of these operates entirely locally. Your meeting notes, source code, financial data, and policy documents never leave your machine -- even as the AI reasons about them and takes actions.</p>
</div>

<QuizMC
  question="What is the key difference between a chatbot and an AI agent?"
  options='["Agents use larger models", "Agents take a goal and figure out steps to achieve it using tools, while chatbots just respond to prompts", "Chatbots are always cloud-based", "Agents can only work online"]'
  answer="1"
/>

<QuizMC
  question="What is the minimum recommended model size for reliable agent behavior?"
  options='["3B parameters", "7B parameters", "14B+ parameters", "70B+ parameters"]'
  answer="2"
/>

<FlashDeck cards='[
  {"front": "What are the four steps of an agent loop?", "back": "1) Observe (read current state), 2) Think (decide next action), 3) Act (call a tool), 4) Repeat until goal achieved"},
  {"front": "What is the ReAct pattern?", "back": "Reasoning + Acting. The model alternates between THOUGHT (reasoning), ACTION (tool call), and OBSERVATION (tool output) until it reaches an ANSWER."},
  {"front": "What are the 5 safety guardrails for local agents?", "back": "1) Filesystem sandboxing, 2) Code execution isolation (no eval), 3) Action limits (max steps), 4) Confirmation gates for destructive actions, 5) Audit logging of all tool calls"},
  {"front": "Why do smaller models struggle with agent behavior?", "back": "Agents need strong instruction-following and reasoning to correctly parse the ReAct format, choose appropriate tools, and generate well-formed actions. 7-8B models often call wrong tools or produce malformed output."},
  {"front": "What is the recommended autonomy progression for agents?", "back": "Start fully supervised (approve every action), move to semi-autonomous (approve only destructive actions), then fully autonomous only after extensive testing with logged, auditable behavior."}
]' />

</div>