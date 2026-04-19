# Context Window

**Course:** Claude Mastery
**Order:** 2
**Type:** lab
**Access:** Free

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 2 of 10


  # Context Window Explorer

  Understand tokens, context windows, and how to manage Claude's working memory — with real code


## What Is a Context Window?

The context window is the total amount of text an AI can "see" at once — including your prompt, system instructions, conversation history, and the response it generates. Think of it as the model's working memory. Everything inside the window is available for reasoning. Everything outside it does not exist.

Claude's standard context window is **200,000 tokens** — roughly 500 pages of a novel. Claude Opus 4.6 extends to **1,000,000 tokens** (1M), which is roughly 2,500 pages — enough to hold an entire codebase, a full textbook, or days of conversation history in a single request.

This matters because context is the single biggest lever for AI quality. An LLM with the right context is dramatically more useful than a smarter LLM without it. RAG, long-document analysis, and multi-turn conversations all depend on fitting the right information into the context window.


**Key insight:** The context window is shared between input and output. If you send 190K tokens of input, Claude only has 10K tokens left for its response. Always budget for output when loading long documents into the context.


## What Are Tokens?

AI models do not see words — they see **tokens**. A token is a chunk of text, typically 3-4 characters for English. The word "hello" is one token. The word "anthropomorphic" is four tokens (anthrop-omorph-ic + the space before it). Punctuation, spaces, and special characters are separate tokens.

Why does this matter? Because you pay per token, and you are limited per token. Understanding tokenization helps you estimate costs, fit more content into the context window, and debug unexpected behavior (like responses getting cut off because you ran out of output tokens).


Python — counting tokens with Anthropic's tokenizer

```
import anthropic

# The Anthropic SDK includes a token counter
client = anthropic.Anthropic()

# Count tokens in a text
text = "Claude's context window is 200,000 tokens."
token_count = client.count_tokens(text)
print(f"Text: {len(text)} chars → {token_count} tokens")
# Text: 46 chars → 11 tokens

# Quick estimate: ~4 chars per token for English
def estimate_tokens(text: str) -> int:
    """Quick token estimate without API call."""
    return len(text) // 4

# Estimate cost for a document
document = open("report.txt").read()
tokens = estimate_tokens(document)
# Sonnet pricing: $3/1M input tokens
cost = (tokens / 1_000_000) * 3
print(f"Document: ~{tokens:,} tokens → ${cost:.4f}")
# Document: ~12,500 tokens → $0.0375
```


## Model Comparison

See how Claude stacks up against other models:


Claude 4.6
200K tokens (up to 1M with Opus)


GPT-4o
128K tokens


Gemini 2.5 Pro
1M tokens


**Key insight:** Window size is not the whole story. What matters is *effective context utilization* — how well the model actually uses information across the full window. Claude is specifically optimized for "needle in a haystack" recall, meaning it can find and use a single relevant fact buried anywhere in a 200K+ token conversation.


## Estimating Token Counts

To estimate how many tokens a piece of text will use, divide its character count by the density ratio for its content type. For English prose at ~4 characters per token, a 10,000-character document is roughly 2,500 tokens. For JSON at ~3 characters per token, the same length would be roughly 3,333 tokens. Use the `estimate_tokens` function from the code example above, or the Anthropic SDK's built-in `client.count_tokens()` for exact counts.


## Token Density by Content Type

Different types of content tokenize very differently. This is critical for cost estimation and context management. Code and structured data eat tokens faster than prose because special characters, whitespace, and syntax get their own tokens.


**English Prose**~4 characters per token — the most efficient
~4:1


**Python Code**~3.5 characters per token — indentation adds tokens
~3.5:1


**JSON Data**~3 characters per token — braces, quotes, colons
~3:1


**HTML/XML**~2.5 characters per token — tags are token-heavy
~2.5:1


**Non-English Text**~2 characters per token — CJK characters are especially costly
~2:1


Python — cost calculator for different content types

```
# Token density ratios (chars per token)
DENSITY = {
    "prose":    4.0,
    "python":   3.5,
    "json":     3.0,
    "html":     2.5,
    "cjk":      2.0,
}

# Pricing per 1M tokens (input/output)
PRICING = {
    "claude-opus-4-6":              (15.0, 75.0),
    "claude-sonnet-4-6":            (3.0,  15.0),
    "claude-haiku-4-5-20251001":    (0.8,  4.0),
}

def estimate_cost(
    text: str,
    content_type: str = "prose",
    model: str = "claude-sonnet-4-6",
    est_output_tokens: int = 500
) -> dict:
    """Estimate the cost of a Claude API call."""
    chars_per_token = DENSITY.get(content_type, 4.0)
    input_tokens = len(text) / chars_per_token
    input_price, output_price = PRICING[model]
    input_cost = (input_tokens / 1_000_000) * input_price
    output_cost = (est_output_tokens / 1_000_000) * output_price
    return {
        "input_tokens": int(input_tokens),
        "output_tokens": est_output_tokens,
        "input_cost": f"${input_cost:.4f}",
        "output_cost": f"${output_cost:.4f}",
        "total_cost": f"${input_cost + output_cost:.4f}",
    }

# Example: analyzing a 50-page report
report = "..." * 50000  # ~50K chars
print(estimate_cost(report, "prose", "claude-sonnet-4-6"))
# {'input_tokens': 12500, 'output_tokens': 500,
#  'input_cost': '$0.0375', 'output_cost': '$0.0075',
#  'total_cost': '$0.0450'}
```


## The "Lost in the Middle" Problem

Research has shown that many LLMs struggle to recall information placed in the *middle* of a long context. They reliably find information at the beginning and end, but data buried in the middle can be "lost." This is called the **lost in the middle** phenomenon.

Claude is specifically tuned to minimize this problem. Anthropic's needle-in-a-haystack tests show that Claude can retrieve a single fact from anywhere in its full 200K context window with high accuracy. However, no model is perfect — if you have critical information, here are strategies to ensure it gets seen:


1
**Put critical instructions at the top.** System prompts and key instructions should go first, before any document content. The model pays the most attention to the beginning.


2
**Repeat important facts.** If a fact is critical, mention it in the system prompt AND near the user's question. Redundancy helps retrieval.


3
**Use structured formatting.** Headers, XML tags, and numbered lists help the model navigate long documents. `...` tags are especially effective.


4
**Use RAG instead of stuffing.** If you have more content than fits in the window, use vector search to retrieve only the relevant chunks (covered in the RAG course).


## Managing Context in Code

In production applications, you need to actively manage the context window — tracking how many tokens you've used, truncating conversation history when it gets too long, and deciding what to keep and what to drop.


Python — context window management

```
import anthropic

client = anthropic.Anthropic()

def chat_with_context_management(
    messages: list,
    system: str,
    model: str = "claude-sonnet-4-6",
    max_context: int = 180_000,  # leave 20K for output
):
    """Send a message while managing the context window."""

    # Estimate total tokens
    total_chars = len(system) + sum(
        len(m["content"]) for m in messages
    )
    est_tokens = total_chars // 4

    # If over budget, trim old messages (keep system + last N)
    while est_tokens > max_context and len(messages) > 2:
        removed = messages.pop(0)  # drop oldest message
        est_tokens -= len(removed["content"]) // 4
        print(f"Trimmed message, ~{est_tokens:,} tokens remaining")

    # Send to Claude
    response = client.messages.create(
        model=model,
        max_tokens=4096,
        system=system,
        messages=messages,
    )
    return response.content[0].text

# Usage
history = []
system_prompt = "You are a helpful coding assistant."

# Conversation keeps growing...
history.append({"role": "user", "content": "Explain Python decorators."})
reply = chat_with_context_management(history, system_prompt)
history.append({"role": "assistant", "content": reply})
# ...old messages automatically trimmed when context gets full
```


## What Fits in 200K Tokens?

To put Claude's context window in perspective:


📚
~500 Pages
of a novel


💻
~150K Lines
of code


📄
~300 PDFs
typical business docs


💬
~8 Hours
of conversation


With Opus 4.6's 1M token window, multiply all of these by 5x. That is enough to hold an entire codebase (most production repos are under 1M tokens), a full college textbook, or a week of conversation history.


### Context Window Key Concepts

**Card 1:**
Front: What is a context window?
Back: The total amount of text an AI can see at once — including prompt, system instructions, conversation history, and the response. Claude supports 200K tokens standard, up to 1M with Opus 4.6.

**Card 2:**
Front: What is a token?
Back: A chunk of text, typically 3-4 characters for English. AI models process tokens, not words. You pay per token and are limited per token. Understanding tokenization helps with cost estimation and context management.

**Card 3:**
Front: Lost in the middle phenomenon
Back: The tendency of large-context models to lose or ignore information buried in the middle of a very long input. Claude is specifically tuned to minimize this. Mitigation: put critical info at top, use structure, repeat key facts.

**Card 4:**
Front: English prose token density
Back: About 4 characters per token — the most efficient content type. A 10,000-character document is roughly 2,500 tokens.

**Card 5:**
Front: Context window management
Back: In production apps, you must actively track token usage and trim old messages when the context gets full. Always budget for output tokens — the response needs room too.


### Quiz

**Q1: Claude Opus 4.6 can handle up to how many tokens in a single conversation?**
    A. 128K tokens
    B. 200K tokens
    C. 500K tokens
  ✓ D. 1 million tokens
  *Claude Opus 4.6 extends to 1 million tokens — roughly 2,500 pages of text. The standard context for Sonnet and Haiku is 200K tokens.*

**Q2: What does the lost in the middle phenomenon describe?**
    A. Tokens being dropped mid-response
  ✓ B. Models losing track of information buried in the middle of long inputs
    C. Context windows shrinking during a conversation
    D. Tokens costing more as the context grows
  *Lost in the middle describes how some models struggle to recall information placed in the middle of a long context. They perform better on content at the beginning and end. Claude is specifically optimized to reduce this problem.*

**Q3: You have a 200K token context window and send 195K tokens of input. What happens to Claude's response?**
    A. Claude refuses to respond
    B. Claude responds normally with up to 200K tokens of output
  ✓ C. Claude can only generate ~5K tokens of output before hitting the limit
    D. The extra tokens are silently truncated from the input
  *The context window is shared between input and output. If you use 195K of the 200K window on input, Claude only has ~5K tokens left for its response. Always budget for output when loading long documents.*

**Q4: Which content type uses the most tokens per character?**
    A. English prose
    B. Python code
    C. JSON data
  ✓ D. Non-English text (CJK)
  *Non-English text, especially CJK characters, tokenizes at roughly 2 characters per token — the most expensive content type. English prose is the most efficient at ~4 characters per token.*


Lesson 2 of 10

Module 1
