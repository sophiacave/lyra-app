# Building Agents

**Course:** Claude Mastery
**Order:** 10
**Type:** builder
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 10 of 10


  # Building Agents

  The grand finale — design, configure, and build a real AI agent with working code


## What Is an AI Agent?

An AI agent is Claude given a **goal**, **tools**, **memory**, and **guardrails** — then set free to accomplish complex tasks autonomously. Unlike simple prompting (one question, one answer), agents can plan multi-step workflows, execute actions, observe results, adapt their approach, and even ask for help when stuck.

You have already learned all the components. System prompts define the agent's identity. Chain-of-thought enables its reasoning. Tools give it hands. Now it is time to assemble them into something powerful.


**The agent pattern in one sentence:** A loop that keeps calling Claude with tools until the task is complete. That is it. Everything else — memory, guardrails, planning — is refinement on top of that core loop.


## The Four Components of an Agent


**1. Goal — What should the agent accomplish?**
A clear objective, defined in the system prompt. "Research the top 5 competitors and produce a comparison table." "Monitor this API endpoint every hour and alert if response time exceeds 500ms." The goal shapes every decision the agent makes.


**2. Tools — What can it do?**
The set of actions available to the agent: web search, file read/write, database queries, API calls, email sending. More tools = more capable agent, but also more surface area for errors. Start minimal and add tools as needed.


**3. Memory — How does it retain context?**
**Conversation memory:** The messages array — ephemeral, lost when the conversation ends. **Persistent memory:** Database-backed storage that survives across sessions. **RAG memory:** Vector search over documents for retrieval (see the RAG course).


**4. Guardrails — What limits should it have?**
Safety boundaries: max steps (prevent infinite loops), budget caps (prevent runaway API costs), human approval gates (for destructive actions like deleting data or sending emails), scope locks (prevent the agent from drifting to unrelated tasks).


## Building an Agent from Scratch

Here is a complete, working agent that can research topics using web search and produce structured reports. This code runs as-is with the Anthropic SDK:


Python — complete research agent

```
import anthropic, json

client = anthropic.Anthropic()

# Agent system prompt — defines identity, goal, and guardrails
AGENT_SYSTEM = (
    "You are a research agent. Your goal is to research topics "
    "thoroughly and produce structured reports.\n\n"
    "Process:\n"
    "1. Break the research question into sub-questions\n"
    "2. Use search to find information for each sub-question\n"
    "3. Synthesize findings into a structured report\n\n"
    "Rules:\n"
    "- Always cite your sources\n"
    "- If you cannot find reliable information, say so\n"
    "- Produce the final report in markdown format"
)

# Agent tools
TOOLS = [
    {
        "name": "web_search",
        "description": "Search the web for current information.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "save_report",
        "description": "Save the final research report to a file.",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["filename", "content"]
        }
    }
]

def execute_tool(name: str, params: dict) -> str:
    if name == "web_search":
        # Replace with real search API (Brave, Tavily, etc.)
        return json.dumps({"results": ["Example search result..."]})
    elif name == "save_report":
        with open(params["filename"], "w") as f:
            f.write(params["content"])
        return f"Saved to {params['filename']}"
    raise ValueError(f"Unknown tool: {name}")

def run_agent(task: str, max_steps: int = 15) -> str:
    """Run the research agent until it completes the task."""
    messages = [{"role": "user", "content": task}]

    for step in range(max_steps):
        print(f"Step {step + 1}...")
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=AGENT_SYSTEM,
            tools=TOOLS,
            messages=messages
        )

        # If done, return the final text
        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"  Calling {block.name}({block.input})")
                try:
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })
                except Exception as e:
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": f"Error: {e}",
                        "is_error": True
                    })
        messages.append({"role": "user", "content": tool_results})

    return "Agent reached max steps."

# Run it
report = run_agent("Research the current state of AI agents in 2026.")
print(report)
```


## The Claude Agent SDK

For production agents, Anthropic provides the **Claude Agent SDK** — a framework that handles the tool loop, guardrails, and multi-agent orchestration for you:


Python — Claude Agent SDK (production pattern)

```
# pip install claude-agent-sdk
from claude_agent_sdk import Agent, tool

# Define tools as decorated functions
@tool
def web_search(query: str) -> str:
    """Search the web for current information."""
    # Your search implementation here
    return "Search results..."

@tool
def save_file(filename: str, content: str) -> str:
    """Save content to a file."""
    with open(filename, "w") as f:
        f.write(content)
    return f"Saved {filename}"

# Create and run the agent
agent = Agent(
    model="claude-sonnet-4-6",
    instructions="You are a research agent. Research topics and produce reports.",
    tools=[web_search, save_file],
    max_turns=15,
)

result = agent.run("Research AI agents in 2026 and save a report.")
print(result.final_text)
```


The Agent SDK handles the tool loop, error handling, and turn limits for you. The `@tool` decorator automatically generates the JSON schema from your function's type hints and docstring.


## Designing Your Agent — The Five Steps

When building an agent, work through these five steps in order:


**Step 1: Define the Goal**
Write a clear, specific objective in the system prompt. "Research the top 5 competitors and produce a comparison table" is a goal. "Be helpful" is not.


**Step 2: Give Tools**
Start with 3-5 tools that cover the agent's core needs — web search, file read/write, database queries. Add more only as needed.


**Step 3: Set Memory**
Choose a memory strategy: conversation memory (ephemeral), persistent database storage, or RAG with vector search for document retrieval.


**Step 4: Add Guardrails**
Set max steps to prevent infinite loops, add budget caps, and require human approval for destructive actions like sending emails or deleting data.


**Step 5: Deploy**
Launch the agent, monitor its behavior, and iterate. Start with simple tasks and gradually increase complexity as you build confidence in its reliability.


## Agent Anti-Patterns

These are the mistakes that cause agent failures in production:


**No max steps guard**
Without a step limit, an agent can loop forever — burning API credits and never completing. Always set `max_steps` or `max_turns`. Start with 10-15 and increase if the agent genuinely needs more.


**Too many tools**
More tools means more confusion. Claude has to choose between all of them, and with 20+ tools it starts making poor choices. Start with 3-5 tools and add more only when the agent clearly needs them.


**No human approval for destructive actions**
An agent that can delete files, send emails, or spend money without confirmation is a liability. Gate all destructive actions behind human approval. "Are you sure you want to send this email to 500 people?"


**Vague goal in the system prompt**
"Be helpful" is not a goal. "Research the top 5 competitors, compare them on pricing, features, and market share, and produce a markdown table" is a goal. Specificity prevents drift.


## Course Complete!

You have mastered Claude — from fundamentals to building production agents.

10Lessons
2,400XP Earned
12Hours

Next steps: Build your own agent, explore MCP servers, or check out the RAG & Vector Search course for retrieval-augmented generation.


### AI Agent Architecture

**Card 1:**
Front: What is an AI agent?
Back: Claude given a goal, tools, memory, and guardrails — then set free to accomplish complex tasks autonomously. The core pattern is a tool loop that keeps calling Claude until the task is complete.

**Card 2:**
Front: The four agent components
Back: 1. Goal (system prompt), 2. Tools (actions it can take), 3. Memory (conversation, persistent, or RAG), 4. Guardrails (max steps, human approval, budget caps).

**Card 3:**
Front: The tool loop pattern
Back: A while loop: call Claude with tools → if stop_reason is tool_use, execute tools and send results back → repeat until stop_reason is end_turn. This is the foundation of ALL agents.

**Card 4:**
Front: Claude Agent SDK
Back: Anthropic's production framework for building agents. Handles the tool loop, error handling, and multi-agent orchestration. The @tool decorator auto-generates JSON schemas from type hints.

**Card 5:**
Front: When to require human approval
Back: Before destructive actions: deleting data, sending emails, spending money, modifying permissions, or any irreversible operation. Gate these with explicit human confirmation.


### Quiz

**Q1: What is the core pattern behind every AI agent?**
    A. A single large prompt
  ✓ B. A tool loop that keeps calling Claude until the task is complete
    C. A database of pre-written responses
    D. A fine-tuned model
  *Every agent is fundamentally a tool loop: call Claude, process tool calls, send results back, repeat until done. Everything else (memory, guardrails, planning) is built on top of this core loop.*

**Q2: An agent has access to 25 tools. What is likely to happen?**
    A. It will be extremely capable
  ✓ B. It will make poor tool choices — too many options cause confusion
    C. It will run faster
    D. It will automatically organize the tools into categories
  *More tools means more confusion for the model. With 25+ tools, Claude has to evaluate each one for every decision, leading to poor tool selection. Start with 3-5 tools and add more only when clearly needed.*

**Q3: You are deploying a support agent that can send emails and close tickets. Which guardrail is most critical?**
    A. Budget limit
  ✓ B. Human approval before sending emails or closing tickets
    C. Full logging
    D. Scope lock to support topics only
  *Sending emails and closing tickets are real-world, potentially irreversible actions. A human approval gate ensures the agent cannot take these actions without explicit confirmation. This is the most critical guardrail for agents with real-world effects.*

**Q4: What does the Claude Agent SDK provide over a raw tool loop?**
    A. A different AI model
  ✓ B. Built-in tool loop, error handling, turn limits, and multi-agent orchestration
    C. Faster API responses
    D. Free API credits
  *The Agent SDK handles the tool loop, error handling, and turn limits automatically. The @tool decorator generates JSON schemas from type hints. For production agents, this saves significant boilerplate code.*


Lesson 10 of 10

Module 3 · Final
