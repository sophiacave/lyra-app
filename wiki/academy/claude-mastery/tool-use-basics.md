# Tool Use

**Course:** Claude Mastery
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 8 of 10


  # Tool Use Basics

  Give Claude superpowers by connecting it to external tools — with complete working code


## What Is Tool Use?

Claude can process text and images, and can search the web. With **tool use** (also called function calling), Claude can do much more — query databases, call APIs, run code, send emails, and interact with any system you connect. You define the tools. Claude decides when and how to use them.

Think of tools as giving Claude hands to go with its brain. Without tools, Claude can only tell you what it *would* do. With tools, it can actually do it.


**Key insight:** Claude does not execute tools itself. It outputs a *structured request* saying "I want to call this tool with these parameters." YOUR code executes the actual function and returns the result to Claude. This separation is a security feature — you always control what actions are taken.


## The Tool Use Flow

Every tool use interaction follows the same 5-step pattern:


1
**User sends a message**"What's the weather in Tokyo?"
Waiting


2
**Claude decides to use a tool**Recognizes it needs real-time weather data
Waiting


3
**Claude outputs a structured tool call**get_weather(location: "Tokyo", units: "celsius")
Waiting


4
**Your app executes the tool and returns the result**{"temp": 22, "condition": "Partly Cloudy", "humidity": 65}
Waiting


5
**Claude responds with natural language**"It's currently 22C and partly cloudy in Tokyo with 65% humidity."
Waiting


## Complete Working Example

Here is a fully functional tool use implementation. This code actually works — you can run it with your API key:


Python — complete tool use implementation

```
import anthropic, json

client = anthropic.Anthropic()

# Step 1: Define your tools
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name, e.g. Tokyo"
                },
                "units": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature units"
                }
            },
            "required": ["location"]
        }
    }
]

# Step 2: Your tool implementation (replace with real API)
def execute_tool(name: str, params: dict) -> str:
    if name == "get_weather":
        # In production: call a real weather API here
        return json.dumps({
            "temp": 22,
            "condition": "Partly Cloudy",
            "humidity": 65
        })
    raise ValueError(f"Unknown tool: {name}")

# Step 3: Send message with tools
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Step 4: Check if Claude wants to use a tool
if response.stop_reason == "tool_use":
    # Find the tool_use block
    tool_block = next(
        b for b in response.content
        if b.type == "tool_use"
    )
    print(f"Claude wants to call: {tool_block.name}")
    print(f"With params: {tool_block.input}")

    # Execute the tool
    result = execute_tool(tool_block.name, tool_block.input)

    # Step 5: Send result back to Claude
    final = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in Tokyo?"},
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": [{
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": result
            }]}
        ]
    )
    print(final.content[0].text)
    # "It's currently 22C and partly cloudy in Tokyo
    #  with 65% humidity."
```


## Multi-Step Tool Use

The real power of tool use emerges when Claude chains multiple tools in sequence — using the result of one tool to decide what to do next. Here is a production pattern using a tool loop:


Python — agentic tool loop (multi-step)

```
def run_agent(user_message: str, tools: list, max_steps: int = 10):
    """Run an agentic tool loop until Claude is done."""
    messages = [{"role": "user", "content": user_message}]

    for step in range(max_steps):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # If Claude is done (no more tool calls), return
        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Process all tool calls in this response
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

    return "Agent hit max steps without completing."

# Now Claude can chain: search -> read -> analyze -> respond
answer = run_agent(
    "Find recent weather in Tokyo and New York, then compare them.",
    tools=tools
)
print(answer)
```


This loop pattern is the foundation of AI agents (Lesson 10). Claude keeps calling tools until it has enough information to answer, then stops. The `max_steps` guard prevents infinite loops.


## Anatomy of a Tool Definition

Every tool definition has three parts: a name, a description, and an input schema. Here is what the weather tool definition looks like as the JSON Claude receives:


JSON — tool definition schema

```
{
  "name": "get_weather",
  "description": "Get the current weather for a given location. Returns temperature, conditions, and humidity.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name, e.g. Tokyo"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"]
      }
    },
    "required": ["location"]
  }
}
```


The **name** should be descriptive and use snake_case. The **description** tells Claude when to use the tool and what it returns. The **input_schema** uses JSON Schema to define parameters — including types, descriptions, enums, and which fields are required. Good descriptions are critical: Claude chooses tools based on their name and description, so "get_current_weather" with a clear description outperforms "do_thing" with none.


## Error Handling

In production, tools fail. APIs go down, databases timeout, rate limits kick in. Always handle tool errors gracefully:


Python — error handling for tool results

```
# When a tool fails, send an error result back to Claude
# Claude will adapt — it might try a different approach
# or explain to the user that the tool is unavailable

try:
    result = execute_tool(tool_block.name, tool_block.input)
    tool_result = {
        "type": "tool_result",
        "tool_use_id": tool_block.id,
        "content": result
    }
except Exception as e:
    tool_result = {
        "type": "tool_result",
        "tool_use_id": tool_block.id,
        "content": f"Error: {str(e)}",
        "is_error": True  # tells Claude this failed
    }
# Claude sees the error and responds appropriately:
# "I wasn't able to get the weather data right now.
#  The service appears to be unavailable."
```


## Key Concepts


**Claude decides when to use tools**
You provide the tools, but Claude autonomously decides if and when to call them based on the user's request. You do not need to say "use the weather tool" — Claude figures it out.


**You execute the tools**
Claude outputs a structured tool call. YOUR application runs the actual function and returns the result. This is a security boundary — Claude cannot access anything you don't explicitly enable.


**Multi-step chaining**
Claude can call multiple tools in sequence, using results from one to inform the next. This is the tool loop pattern — and it is the foundation of AI agents.


**Good descriptions matter**
Claude chooses tools based on their name and description. A tool named "do_thing" with no description will be used less effectively than "get_current_weather" with a clear description of what it returns.


### Tool Use Key Concepts

**Card 1:**
Front: Tool use (function calling)
Back: A feature that lets Claude interact with the real world by calling external functions you define. You provide tool schemas (name, description, parameters). Claude outputs structured calls. Your code executes them.

**Card 2:**
Front: Who decides when to call a tool?
Back: Claude decides autonomously based on the user request. You provide available tools in the tools parameter; Claude determines if and when to use them based on the conversation.

**Card 3:**
Front: Who executes the tool?
Back: Your application. Claude outputs a structured JSON tool call. Your code receives this, runs the actual function, and returns the result as a tool_result message. This separation is a security boundary.

**Card 4:**
Front: The tool loop pattern
Back: A while loop that keeps calling Claude until stop_reason is end_turn (not tool_use). Each iteration: get response, execute tool calls, send results back. This enables multi-step agent behavior.

**Card 5:**
Front: Tool error handling
Back: When a tool fails, return a tool_result with is_error: true and an error message. Claude will adapt — it might try a different approach or inform the user. Never let tool errors crash your application.


### Quiz

**Q1: When Claude decides to use a tool, what does it actually output?**
    A. A natural language description of what it wants to do
  ✓ B. A structured JSON tool call with the tool name and parameters
    C. A Python function call in a code block
    D. A request for the user to run the tool manually
  *Claude outputs a structured tool call — a JSON object containing the tool name, a unique ID, and the parameter values. Your application receives this and executes the actual function. The stop_reason will be tool_use.*

**Q2: Who is responsible for executing the tool function?**
    A. Claude executes it internally
    B. The user manually runs it
  ✓ C. Your application receives the tool call and runs the actual function
    D. Anthropic runs it on their servers
  *Your application is always responsible for executing tools. This is a critical security boundary — Claude can only use tools you explicitly provide, and your code controls what actually happens.*

**Q3: What is the tool loop pattern used for?**
    A. Retrying failed API calls
  ✓ B. Enabling Claude to chain multiple tool calls until the task is complete
    C. Polling for new messages
    D. Rate limiting tool calls
  *The tool loop keeps calling Claude until it stops requesting tools (stop_reason == end_turn). Each iteration processes tool calls and sends results back. This enables multi-step agent workflows.*

**Q4: A tool call fails with a timeout error. What should your code do?**
    A. Retry the tool call 10 times
    B. Crash the application
  ✓ C. Return a tool_result with is_error: true and an error message
    D. Ignore the error and skip the tool
  *Return a tool_result with is_error: true so Claude knows the tool failed. Claude will adapt — it might try a different approach, use a different tool, or inform the user. Never silently ignore tool errors.*


Lesson 8 of 10

Module 3
