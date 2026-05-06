---
title: "How to Build Your First AI Agent with Claude (Step-by-Step 2026)"
slug: how-to-build-ai-agent-claude-2026
date: 2026-05-02
author: Sophia Cave
description: "Build a working AI agent with Claude in under an hour. This step-by-step guide covers agentic loops, tool use, the Claude Agent SDK, and real patterns used in production systems."
excerpt: "Build a working AI agent with Claude in under an hour. This step-by-step guide covers agentic loops, tool use, the Claude Agent SDK, and real patterns used in production systems."
tags: [ai-agents, claude, agent-sdk, agentic-loops, tool-use, tutorial, python, 2026]
faq:
  - q: "What is an AI agent?"
    a: "An AI agent is software that uses a large language model to autonomously complete multi-step tasks. Unlike a chatbot that responds once, an agent observes its environment, decides what to do, takes action using tools, and repeats until the job is done."
  - q: "Can I build an AI agent with Claude for free?"
    a: "You need a Claude API key, which requires a paid Anthropic account. The API uses pay-per-token pricing — a simple agent doing 10-20 tool calls costs roughly $0.05-0.20 per run depending on the model. Claude Haiku 4.5 is the cheapest option for agent workloads."
  - q: "What is the Claude Agent SDK?"
    a: "The Claude Agent SDK is Anthropic's official framework for building production AI agents. It handles the agentic loop, tool execution, guardrails, and multi-agent orchestration out of the box — so you focus on defining tools and goals instead of plumbing."
  - q: "How is building an agent different from using Claude normally?"
    a: "Normal Claude usage is one prompt, one response. An agent runs in a loop — it receives a goal, breaks it into steps, calls tools to gather information or take action, evaluates results, and continues until the goal is met. You define the tools it can use and the boundaries it operates within."
  - q: "Do I need to know Python to build a Claude agent?"
    a: "Python is the most common language for Claude agents, but the Claude API works with any language that can make HTTP requests. TypeScript/JavaScript via the Anthropic SDK is also well-supported. This guide uses Python for simplicity."
---

# How to Build Your First AI Agent with Claude

Most tutorials about AI agents are either too theoretical or too trivial. They either explain the concept without showing code, or they show a toy example that could not survive contact with real work.

This guide is different. You will build a working agent that actually does something useful — and you will understand every piece well enough to extend it into whatever you need.

## What Makes Something an "Agent"

An agent is not a prompt. It is not a chatbot. It is a loop.

The difference is autonomy. A chatbot answers one question. An agent receives a *goal* and figures out how to achieve it — deciding which tools to use, in what order, and when to stop.

Every agent has three components:

1. **A language model** that reasons about what to do next
2. **Tools** that let it take actions in the real world
3. **A loop** that connects reasoning to action and keeps going until done

That loop — observe, reason, act, repeat — is called an [agentic loop](/blog/what-are-agentic-loops-explained/). It is the beating heart of every agent system.

## The Simplest Agent That Actually Works

Here is the minimal viable agent. It uses Claude's tool use API to answer questions by searching the web and reading files:

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "read_file",
        "description": "Read the contents of a file",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path to read"}
            },
            "required": ["path"]
        }
    },
    {
        "name": "list_files",
        "description": "List files in a directory",
        "input_schema": {
            "type": "object",
            "properties": {
                "directory": {"type": "string", "description": "Directory to list"}
            },
            "required": ["directory"]
        }
    }
]

def execute_tool(name, input_data):
    if name == "read_file":
        with open(input_data["path"]) as f:
            return f.read()
    elif name == "list_files":
        import os
        return "\n".join(os.listdir(input_data["directory"]))

def run_agent(goal):
    messages = [{"role": "user", "content": goal}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # If Claude responds with text only, we are done
        if response.stop_reason == "end_turn":
            final = [b.text for b in response.content if b.type == "text"]
            return "\n".join(final)

        # Process tool calls
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages.append({"role": "user", "content": tool_results})

answer = run_agent("List all Python files in the current directory and summarize what each one does.")
print(answer)
```

That is 55 lines. It is a real agent. Claude decides which tools to call, processes the results, and loops until it has enough information to answer. No framework required.

## Understanding the Loop

The `while True` loop is the agentic loop. Here is what happens each iteration:

1. **Send messages to Claude** with the conversation history and available tools
2. **Check the stop reason** — if `end_turn`, Claude is done reasoning and has a final answer
3. **If Claude called tools**, execute them and append results to the conversation
4. **Loop back** to step 1 with the updated conversation

Claude controls the flow. It decides when to call tools, which tools to call, and when it has enough information to stop. Your code just executes what Claude asks for and feeds results back.

This is the fundamental pattern. Every agent framework — LangChain, CrewAI, the Claude Agent SDK — is a variation of this loop with more features bolted on.

## Leveling Up: The Claude Agent SDK

The raw loop works, but production agents need more:

- **Guardrails** to prevent dangerous actions
- **Multi-agent orchestration** for complex workflows
- **Error handling** when tools fail
- **Token management** for long-running tasks
- **Structured handoffs** between specialized agents

The Claude Agent SDK handles all of this:

```python
from claude_agent_sdk import Agent, Tool

file_reader = Tool(
    name="read_file",
    description="Read the contents of a file",
    parameters={"path": {"type": "string"}},
    handler=lambda path: open(path).read()
)

agent = Agent(
    model="claude-sonnet-4-6",
    tools=[file_reader],
    system="You are a code reviewer. Analyze files for bugs and security issues.",
    max_turns=20
)

result = agent.run("Review all Python files in ./src for security vulnerabilities.")
print(result.output)
```

The SDK eliminates boilerplate and adds production-grade features. But notice — it is still the same pattern: model + tools + loop.

## Designing Good Tools

Your agent is only as capable as its tools. Here is what separates good tool design from bad:

**Be specific, not generic.** A tool called `do_thing` tells Claude nothing. A tool called `search_customer_by_email` tells Claude exactly when to use it.

**Return useful context.** Do not return raw database rows. Return formatted, relevant information that helps Claude reason about the next step.

**Handle errors gracefully.** If a tool fails, return an error message — do not crash the loop. Claude can reason about errors and try alternative approaches.

**Set clear boundaries.** Read-only tools are safer than write tools. If your agent can delete database records, add confirmation steps or restrict which records it can touch.

```python
# Bad: too vague
{"name": "database", "description": "Access the database"}

# Good: specific and safe
{"name": "search_orders_by_customer",
 "description": "Search recent orders for a customer by email. Returns order ID, date, total, and status. Read-only.",
 "input_schema": {
     "type": "object",
     "properties": {
         "email": {"type": "string", "description": "Customer email address"},
         "limit": {"type": "integer", "description": "Max results (default 10)", "default": 10}
     },
     "required": ["email"]
 }}
```

## Patterns That Work in Production

After building agents that run autonomously 24/7, here are the patterns that survive contact with reality:

### 1. Max Iterations Guard

Never let an agent loop forever. Set a hard limit:

```python
MAX_TURNS = 25

for turn in range(MAX_TURNS):
    response = client.messages.create(...)
    if response.stop_reason == "end_turn":
        break
else:
    print("Agent hit max turns without completing")
```

### 2. Tool Result Truncation

LLM context windows are large but not infinite. Truncate tool outputs that could blow your token budget:

```python
def execute_tool(name, input_data):
    result = _raw_execute(name, input_data)
    if len(result) > 10000:
        return result[:10000] + "\n... [truncated]"
    return result
```

### 3. Checkpoint and Resume

For long-running agents, save state so you can resume after failures:

```python
def checkpoint(messages, step):
    with open(f"checkpoint_{step}.json", "w") as f:
        json.dump(messages, f)
```

### 4. Human-in-the-Loop for High-Stakes Actions

Some actions should not be autonomous. Add approval gates:

```python
def execute_tool(name, input_data):
    if name in HIGH_STAKES_TOOLS:
        print(f"Agent wants to: {name}({input_data})")
        if input("Approve? [y/n] ") != "y":
            return "Action denied by human operator."
    return _raw_execute(name, input_data)
```

## Multi-Agent Systems

Once you have one agent working, you can compose agents into systems. Common patterns:

**Hub and spoke.** One orchestrator agent delegates tasks to specialist agents. The orchestrator handles planning; specialists handle execution.

**Pipeline.** Output from one agent feeds into the next. Research agent finds information, analysis agent processes it, writing agent produces the report.

**Swarm.** Multiple agents work in parallel on independent tasks. Results merge at the end.

The Claude Agent SDK supports all three patterns. The key is defining clear handoff protocols — what information passes between agents, and what each agent is responsible for.

## Choosing Your Model

Not every agent needs the most powerful model:

| Model | Best For | Cost |
|-------|----------|------|
| Claude Opus 4.6 | Complex reasoning, multi-step planning, ambiguous goals | $$$ |
| Claude Sonnet 4.6 | Most agent workloads, good balance of speed and capability | $$ |
| Claude Haiku 4.5 | High-volume, simple tool-calling, classification tasks | $ |

Start with Sonnet. Move to Opus only if your agent consistently fails at reasoning. Move to Haiku for cost optimization after your agent design is proven.

## What to Build First

Skip the toy demos. Build something that solves a real problem for you:

- **Email triage agent** that reads your inbox, categorizes messages, and drafts responses
- **Code review agent** that analyzes pull requests and flags issues
- **Research agent** that searches multiple sources and produces structured summaries
- **Data pipeline agent** that monitors a folder, processes new files, and updates a database
- **Customer support agent** that looks up accounts, checks policies, and drafts ticket responses

The best first agent automates something you already do manually. You understand the domain, you know what good output looks like, and you will actually use it.

## Common Mistakes

**Over-engineering the first version.** Start with the raw loop. Add frameworks later when you understand what you actually need.

**Too many tools.** Give your agent 3-5 focused tools, not 30 generic ones. Claude reasons better with fewer, clearer options.

**No stop condition.** Every agent needs a maximum iteration limit. Runaway agents burn tokens and produce garbage.

**Ignoring cost.** Each loop iteration costs tokens. A 20-turn agent conversation with Opus can cost $1+. Monitor costs from day one.

**Not testing failure modes.** What happens when a tool times out? When the API returns an error? When Claude hallucinates a tool name? Test these scenarios before going to production.

## Next Steps

You now have everything you need to build a production AI agent:

1. Start with the [raw loop pattern](#the-simplest-agent-that-actually-works) above
2. Define 3-5 tools that solve your specific problem
3. Add guardrails: max iterations, error handling, token limits
4. Test with real scenarios, not toy examples
5. Graduate to the [Claude Agent SDK](#leveling-up-the-claude-agent-sdk) when you need multi-agent orchestration

The gap between "I use Claude" and "I build with Claude" is smaller than you think. It is a while loop, some tools, and the willingness to let the model drive.

---

*Like One Academy has a full course on [building AI agents](/academy/building-ai-agents/) — from first principles to production deployment. [Start free](/academy/) or [go Pro for $29](/pricing/).*
