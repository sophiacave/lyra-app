# Meet Claude

**Course:** Claude Mastery
**Order:** 1
**Type:** lesson
**Access:** Free

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 1 of 10


  # Meet Claude

  Who Claude is, how it thinks, the model lineup, pricing, and your first API call


## Who Is Claude?

Claude is an AI assistant made by **Anthropic** — a company founded in 2021 by former OpenAI researchers who believed AI safety should be a first-class engineering priority, not an afterthought. Where most AI labs optimize for impressive demos, Anthropic optimizes for models you can actually trust.

The philosophy behind Claude is called **Constitutional AI**. Instead of training a model purely on human preference ratings (where annotators might reward confident-sounding wrong answers), Anthropic gave Claude a set of explicit principles — like a constitution — and trained it to *reason against those principles*. The model evaluates its own outputs: "Does this response follow the principles? If not, how should I revise it?" This self-evaluation loop runs thousands of times during training, shaping how Claude thinks — not just what it says.

The practical result is an AI that behaves differently from its competitors in three specific ways: it admits uncertainty instead of fabricating answers, it pushes back when asked to do something harmful instead of finding loopholes, and it maintains consistent reasoning across long, complex conversations instead of losing coherence. These aren't marketing claims — they're measurable properties that show up in benchmarks and real-world use.


🏛️
Constitutional AITrained with explicit values and self-evaluation, not just human thumbs-up/down


🔬
Safety-First ResearchAnthropic publishes alignment research openly and built the industry's first Responsible Scaling Policy


💬
Reasoning-HeavyExtended thinking mode lets Claude reason through hard problems step by step before answering


## Constitutional AI — How It Actually Works

Most AI models are trained with **RLHF** (Reinforcement Learning from Human Feedback) — humans rate outputs as good or bad, and the model learns to produce highly-rated responses. This works, but it has a flaw: it optimizes for *what sounds right to a human rater*, which is not the same as *what is actually right*. A confident wrong answer often scores higher than an honest "I'm not sure."

Constitutional AI adds a layer. After the initial training, Claude is given a set of principles (the "constitution") and asked to critique its own outputs against those principles. Here is a simplified version of the loop:


```
# Simplified Constitutional AI training loop
# (This is conceptual — actual training uses billions of examples)

principles = [
    "Choose the response that is most helpful to the human.",
    "Choose the response that is most honest and truthful.",
    "Choose the response that is least likely to cause harm.",
    "If uncertain, acknowledge the uncertainty rather than guessing.",
    "Do not help with illegal or dangerous activities.",
]

for prompt in training_data:
    # Step 1: Generate initial response
    response = model.generate(prompt)

    # Step 2: Self-critique against principles
    critique = model.evaluate(response, principles)
    # "This response sounds confident but I'm not actually sure
    #  about the third claim. Principle 4 says I should
    #  acknowledge uncertainty."

    # Step 3: Revise based on critique
    revised = model.revise(response, critique)
    # The revised response now says "I believe X and Y,
    #  but I'm not certain about Z — you may want to verify."

    # Step 4: Train on the revised (better) response
    model.learn(prompt, revised)
```


This self-critique loop runs during training, not during your conversations. By the time you use Claude, these principles are baked into the model's weights. The result: Claude's default behavior is to be honest, helpful, and harmless — without needing to be told.


## Claude vs. ChatGPT vs. Gemini

All three are powerful. But they are built with different priorities, trained with different methods, and optimized for different outcomes. Understanding the differences helps you choose the right tool for each job — or use them in combination.


Claude (Anthropic)
ChatGPT (OpenAI) / Gemini (Google)


When it doesn't know something
Says "I'm not sure" — and means it. Constitutional AI explicitly rewards honest uncertainty over confident guessing.
More likely to fill the gap with a confident-sounding answer. RLHF rewards answers that sound helpful.


Complex reasoning tasks
Extended thinking mode lets it reason for minutes before answering. Strong at multi-step logic, code, and analysis.
GPT-4o and Gemini are strong reasoners too. o3 has chain-of-thought. Gemini excels at multimodal reasoning.


If you push it to agree with something wrong
Holds its ground, explains why. Trained to be honest even when disagreeing with the user is uncomfortable.
More likely to accommodate the user's framing. Sycophancy is a known RLHF failure mode.


Long documents and context
Up to 1M tokens with Opus 4.6. Strong "needle in a haystack" retrieval across the full window.
Gemini 2.5 Pro has 1M tokens too. GPT-4o caps at 128K. Context quality varies across all providers.


Coding
Claude Code is Anthropic's CLI that writes, tests, and commits code. SWE-bench leader. Excels at large codebases.
GitHub Copilot (GPT). Cursor uses multiple models. All are strong. Claude leads on agentic coding tasks.


Ecosystem
Smaller plugin ecosystem. MCP (Model Context Protocol) is the open standard for tool integration.
ChatGPT has the largest plugin ecosystem. Gemini integrates deeply with Google Workspace.


None of this makes Claude universally "better." The honest answer: **use the right model for the right job.** Claude's edge is trustworthiness under pressure, long-context fidelity, and agentic coding. ChatGPT has ecosystem breadth. Gemini has Google integration. Many teams use all three.


## The Claude Model Lineup (2025)

Anthropic offers Claude in three tiers. Think of it like choosing tools — more power isn't always better if you're paying for it on every request. The key is matching model capability to task complexity.


Top Tier
Claude Opus 4.6
The most capable model. Exceptional at nuanced reasoning, long-form analysis, research synthesis, complex multi-step tasks, and agentic coding. Extended thinking for hard problems. Up to 1M token context window.
Deep work, analysis, agents
ID: claude-opus-4-6 · $15/$75 per 1M tokens


Balanced
Claude Sonnet 4.6
The sweet spot. Strong reasoning, fast enough for real-time use, cost-effective at scale. This is what most production applications use — coding, writing, strategy, business tasks. Extended thinking available.
Everyday powerhouse
ID: claude-sonnet-4-6 · $3/$15 per 1M tokens


Lightweight
Claude Haiku 4.5
The smallest, fastest, cheapest model. Surprisingly capable for its size — great for classification, summarization, simple Q&A, and high-volume pipelines where speed and cost matter most.
Speed & volume tasks
ID: claude-haiku-4-5-20251001 · $0.80/$4 per 1M tokens


**Pricing decoded:** The two numbers (e.g., $3/$15) mean **input/output per million tokens**. Input is what you send to Claude (your prompt, system message, context). Output is what Claude generates back. Output is always more expensive because generation is computationally harder. A million tokens is roughly 750,000 words — most conversations cost fractions of a cent.


In Claude.ai (the web interface), Sonnet is the default. You can switch to Opus for harder tasks. Via the API, you specify exactly which model to use — which is what we'll learn next.


## The HHH Framework

Everything about Claude traces back to three words. Anthropic calls it the HHH framework — and it is not just marketing. These properties are baked into how the model is trained and evaluated. Every response Claude generates is implicitly measured against all three.


🤝
Helpful
Actually useful. Not hedged into uselessness. Claude tries to give you what you need, not a watered-down non-answer. If you ask for code, you get working code with explanations — not a disclaimer that you should hire a developer.


🛡️
Harmless
Refuses to assist with things that cause real harm. Not by default-blocking everything — by reasoning through context. Claude can discuss chemistry, security, and medicine when the context is educational or professional. It declines when the intent is clearly harmful.


🔍
Honest
Won't pretend to know things it doesn't. Won't flatter you into a bad decision. Won't hallucinate and serve it with confidence. When Claude says "I'm not sure" — it genuinely means it has low confidence, and that admission is more valuable than a guess.


These three properties are in tension with each other. A maximally helpful model might give dangerous advice. A maximally harmless model might refuse everything. A maximally honest model might be blunt to the point of unhelpfulness. The art of Constitutional AI is training Claude to balance all three simultaneously — which is why it sometimes says "I can help with that, but here's an important caveat" instead of blindly complying or blindly refusing.


## Your First Claude API Call

You do not need the API to use Claude — Claude.ai works with no setup. But the API is where the real power is: you control the model, the system prompt, the temperature, the tools, and every parameter. Here is the simplest possible API call using curl and then Python:


curl — raw API call

```
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Explain what an API is in one paragraph."}
    ]
  }'
```


Python — using the Anthropic SDK

```
import anthropic

# pip install anthropic
# export ANTHROPIC_API_KEY="sk-ant-..."

client = anthropic.Anthropic()  # reads API key from environment

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain what an API is in one paragraph."}
    ]
)

print(message.content[0].text)
# "An API (Application Programming Interface) is a set of rules
#  and protocols that allows different software applications to
#  communicate with each other..."
```


**Key parameters**
**model** — which Claude model to use (see tier table above)
**max_tokens** — maximum output length (required)
**messages** — the conversation (user and assistant turns)


**What you'll add later**
**system** — system prompt (Lesson 4)
**temperature** — creativity dial (Lesson 3)
**tools** — function calling (Lesson 8)


This is the foundation. Every feature in this course — system prompts, temperature, tool use, agents — builds on this exact API call. You add parameters, but the shape stays the same: choose a model, send messages, get a response.


## How to Get Your API Key

To make API calls, you need a key from the Anthropic Console. Here is the process:


1
Go to **console.anthropic.com** and create an account (or sign in)


2
Navigate to **Settings → API Keys** and click "Create Key"


3
Copy the key (starts with `sk-ant-`) — you will only see it once


4
Set it as an environment variable: `export ANTHROPIC_API_KEY="sk-ant-..."`


**Security:** Never hardcode your API key in source code. Never commit it to Git. Use environment variables or a secrets manager. If you accidentally expose a key, rotate it immediately in the Console.


## Choosing the Right Model — A Decision Framework

The most common beginner mistake is defaulting to the most powerful model for everything. That is like driving a semi truck to get groceries. Here is a practical framework:


**Use Opus when...**
The task requires sustained reasoning over long inputs (100K+ tokens), the cost of a wrong answer is high (legal analysis, medical triage, financial modeling), you need an AI agent that runs autonomously for hours, or the problem genuinely requires the smartest model available.


**Use Sonnet when...**
You need a balance of quality and speed (most coding, writing, analysis, conversation). Sonnet handles 90% of real-world tasks at 1/5 the cost of Opus. Start here unless you have a reason not to.


**Use Haiku when...**
Speed and cost dominate. Classification (is this email spam?), extraction (pull the date from this invoice), summarization (condense this to 3 bullets), or any pipeline processing thousands of items per hour.


Python — smart model routing

```
def choose_model(task_type: str, input_length: int) -> str:
    """Route to the right Claude model based on the task."""
    if task_type in ("classification", "extraction", "summarization"):
        return "claude-haiku-4-5-20251001"  # fast + cheap
    elif input_length > 100_000 or task_type in ("legal", "agent", "research"):
        return "claude-opus-4-6"          # maximum capability
    else:
        return "claude-sonnet-4-6"         # default sweet spot

# Examples:
choose_model("classification", 50)     # → haiku (fast, cheap)
choose_model("coding", 2000)            # → sonnet (balanced)
choose_model("legal", 150000)          # → opus (maximum quality)
```


### Claude Essentials

**Card 1:**
Front: Claude Opus 4.6
Back: Top tier — best for deep analysis, long-form research, complex multi-step reasoning, and autonomous agents. Model ID: claude-opus-4-6. Pricing: $15/$75 per 1M tokens (input/output). Up to 1M token context.

**Card 2:**
Front: Claude Sonnet 4.6
Back: Balanced tier — the everyday powerhouse. Strong reasoning, fast enough for real-time use, cost-effective at scale. Model ID: claude-sonnet-4-6. Pricing: $3/$15 per 1M tokens. Start here for 90% of tasks.

**Card 3:**
Front: Claude Haiku 4.5
Back: Lightweight tier — fastest and cheapest. Best for classification, summarization, extraction, and high-volume pipelines. Model ID: claude-haiku-4-5-20251001. Pricing: $0.80/$4 per 1M tokens.

**Card 4:**
Front: Constitutional AI
Back: Anthropic's training approach. Claude is given explicit principles and trained to critique its own outputs against them. This self-evaluation loop shapes values, not just outputs — producing a model that is honest by default.

**Card 5:**
Front: HHH Framework
Back: Helpful, Harmless, Honest — the three core properties baked into Claude's training. They are in tension with each other (maximizing one can hurt another), and Constitutional AI trains Claude to balance all three simultaneously.


### Quiz

**Q1: You are building a chatbot that auto-tags 10,000 customer support tickets per day by category. Speed and cost matter more than nuance. Which model?**
    A. Claude Opus 4.6
    B. Claude Sonnet 4.6
  ✓ C. Claude Haiku 4.5
    D. Any model works equally
  *High-volume, repetitive classification is exactly where Haiku shines. At $0.80 per million input tokens, processing 10,000 tickets per day would cost pennies. Opus would give you the same classification accuracy at 19x the price.*

**Q2: You need to analyze 200 pages of contract language, identify unusual clauses, and write a risk summary for your legal team. Which model?**
  ✓ A. Claude Opus 4.6
    B. Claude Sonnet 4.6
    C. Claude Haiku 4.5
    D. Temperature matters more than model choice
  *200 pages is ~60K tokens of dense legal text requiring sustained attention, nuanced judgment, and synthesis. Opus earns its cost here — the consequence of missing an unusual clause in a legal review is far higher than the price difference between models.*

**Q3: You are writing product descriptions for 50 items in your Shopify store — clear, punchy, conversion-focused copy. Which model?**
    A. Claude Opus 4.6
  ✓ B. Claude Sonnet 4.6
    C. Claude Haiku 4.5
    D. Use all three in sequence
  *Sonnet is the perfect fit. Writing 50 product descriptions requires creativity and quality (rules out Haiku) but not the sustained deep reasoning that justifies Opus pricing. Sonnet delivers strong copy at a reasonable cost.*

**Q4: What does Constitutional AI mean in the context of Claude?**
    A. Claude follows US constitutional law
  ✓ B. Claude was trained with a set of explicit guiding principles and self-critique
    C. Claude generates legal documents
    D. Claude refuses all controversial topics
  *Constitutional AI means Anthropic gave Claude a set of principles and trained it to critique its own outputs against those principles. The model learns to revise responses that violate the principles — shaping how it thinks, not just what it says. It has nothing to do with US law.*

**Q5: What is the correct API call format for Claude?**
    A. POST to api.openai.com with an Authorization header
  ✓ B. POST to api.anthropic.com/v1/messages with an x-api-key header
    C. GET to claude.ai/api with a token parameter
    D. POST to anthropic.com/chat with a Bearer token
  *Claude uses POST requests to api.anthropic.com/v1/messages with the API key passed in the x-api-key header. This is different from OpenAI (which uses Authorization: Bearer) — a common source of confusion when switching between providers.*


Lesson 1 of 10

Module 1
