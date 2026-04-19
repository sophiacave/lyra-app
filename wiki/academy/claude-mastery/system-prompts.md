# System Prompts

**Course:** Claude Mastery
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 4 of 10


  # System Prompt Builder

  Master the invisible instruction set that shapes every Claude conversation — with real code and anti-patterns


## What Are System Prompts?

A system prompt is the invisible instruction set that defines *who* Claude is and *how* it behaves for a given conversation. It is sent with every API call but never shown to the end user. Think of it as hiring an expert and briefing them before they start work — the system prompt is that briefing.

A great system prompt has five key components: **Identity**, **Constraints**, **Format**, **Tone**, and **Examples**. Each serves a distinct purpose, and the order matters — Claude pays the most attention to content at the beginning of the system prompt.


Python — system prompt in the API

```
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a senior Python developer with 15 years of experience.\n\nRules:\n- Always include type hints in code examples\n- Explain reasoning before showing code\n- If the user's approach has issues, say so directly\n- Never use print() for debugging — suggest proper logging",
    messages=[
        {"role": "user", "content": "How should I handle database connections?"}
    ]
)
print(response.content[0].text)
```


The `system` parameter is separate from `messages`. It is sent once and persists across the entire conversation. User messages change; the system prompt stays constant.


## The Five Components

Every effective system prompt is built from these five building blocks. You do not need all five for every use case — but understanding each one lets you craft the right prompt for any situation.


**1. Identity — Who is Claude?**
Defines the role, expertise, and persona. "You are a senior Python developer" or "You are a friendly writing tutor." This shapes the lens through which Claude approaches every response. Be specific — "a developer" is weaker than "a senior backend engineer who specializes in distributed systems."


**2. Constraints — What must Claude NOT do?**
Hard limits on behavior. "Never provide medical advice." "Keep responses under 200 words." "Do not speculate beyond the provided data." Constraints are your guardrails — they prevent Claude from drifting into territory you don't want.


**3. Format — How should responses look?**
"Always respond with: 1) Summary, 2) Detail, 3) Code example." "Use markdown." "Respond in JSON format." Format directives ensure consistent, parseable output — critical for production applications that need to parse Claude's response programmatically.


**4. Tone — What voice should Claude use?**
"Be encouraging and use analogies." "Be direct and technical — skip pleasantries." Tone shapes the personality without changing the content. The same technical answer feels different when delivered warmly vs. bluntly.


**5. Examples — Show, don't tell**
Include 1-3 input/output examples showing exactly what you want. Examples are the most powerful component — they disambiguate instructions that could be interpreted multiple ways. This is the "few-shot" technique from Lesson 6 applied inside a system prompt.


## A Complete Production System Prompt

Here is a real-world system prompt that uses all five components. Notice how each section is clearly labeled with headers and ordered by priority:


Production system prompt — AI code reviewer

```
CODE_REVIEWER_PROMPT = (
    "# Identity\n"
    "You are a senior code reviewer for a production Python application.\n"
    "You have 10+ years of experience with Python, FastAPI, PostgreSQL,\n"
    "and distributed systems. You care deeply about code quality.\n\n"
    "# Constraints\n"
    "- NEVER approve code with SQL injection vulnerabilities\n"
    "- NEVER suggest quick hacks — always fix root causes\n"
    "- Do NOT review style (formatting, naming) — our linter handles that\n"
    "- If unsure about a security implication, flag it explicitly\n\n"
    "# Format\n"
    "Structure every review as:\n"
    "1. **Summary** — one sentence: what does this code do?\n"
    "2. **Issues** — numbered list, tagged [CRITICAL/WARNING/INFO]\n"
    "3. **Suggestions** — specific code changes, shown as diffs\n"
    "4. **Verdict** — APPROVE, REQUEST_CHANGES, or BLOCK\n\n"
    "# Tone\n"
    "Be direct and constructive. No sugar-coating, but no rudeness.\n"
    "Say what is wrong and how to fix it. Acknowledge good patterns."
)
```


This prompt produces structured, consistent code reviews with severity levels and clear verdicts. The headers make it easy to maintain and update — you can modify the Format section without touching Identity.


## Building a System Prompt — Example Blocks

A good system prompt assembles blocks from each component. Here is a practical example combining all five:


```
# Identity
You are a senior software engineer with 15 years
of experience in full-stack development.

# Constraints
Never provide medical, legal, or financial advice.
Keep all responses under 200 words unless the user
explicitly asks for more detail.

# Format
Always structure your response with:
1) A brief summary
2) Detailed explanation
3) Code example if applicable
4) Next steps

# Tone
Be direct and technical. Skip pleasantries.
Focus on accuracy and efficiency.
```


When building your own system prompts, select one block from each component category and combine them. The order matters — put Identity first, then Constraints, Format, and Tone. Claude pays the most attention to content at the beginning.


## Anti-Patterns — What NOT to Do

These are the most common mistakes in system prompt engineering. Each one makes Claude less effective:


**Vague identity**

Bad: "You are helpful."
Good: "You are a senior tax accountant specializing in US small business filings."

Specificity gives Claude a knowledge frame to draw from. Vague identities produce generic responses.


**Contradictory instructions**

Bad: "Be concise. Also, be thorough and cover every edge case."
Good: "Be concise for simple questions. For complex topics, be thorough."

Contradictions force Claude to guess which instruction to follow. Add conditions to resolve ambiguity.


**Prompt stuffing**
Bad: A 5,000-word system prompt covering every possible scenario
Longer is not better. After ~500-1000 words, each additional instruction dilutes the others. Focus on the 5-10 most important rules.


**Negative-only constraints**

Bad: "Don't be vague. Don't be wordy. Don't use jargon."
Good: "Be specific and concise. Use plain language accessible to non-experts."

Telling Claude what NOT to do is less effective than telling it what TO do. Positive instructions are clearer and produce better results.


## System Prompts vs. User Messages

A common question: should instructions go in the system prompt or in the user message? The answer depends on what you are building:


**System Prompt**
Persistent instructions that apply to EVERY message in the conversation. Identity, constraints, format rules. Think: "who is Claude for this entire session?"


**User Message**
Per-turn instructions that apply to THIS specific request. "Summarize this document." "Debug this code." Think: "what should Claude do right now?"


Python — system prompt + user message layering

```
# System prompt: persistent identity + rules
system = (
    "You are a data analyst. Always respond with:\n"
    "1. Key finding (one sentence)\n"
    "2. Supporting data\n"
    "3. Recommended action\n"
    "Use plain language. No jargon."
)

# User message: per-turn task
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    system=system,  # same for every turn
    messages=[
        {"role": "user", "content": "Our bounce rate went from 40% to 65% last week."}
    ]
)
# Claude responds AS a data analyst, IN the required format,
# with analysis of the specific bounce rate data.
```


## Testing Your System Prompt

A good way to validate a system prompt is to test it against different types of user messages. Try these scenarios and check if the responses match your expectations:


**Scenario 1: Debugging Help**
User says: "My API is returning 500 errors intermittently." Does Claude respond in the correct format? Does it stay within the identity you defined?


**Scenario 2: Explain a Concept**
User says: "What is dependency injection?" Does Claude explain at the right level for your target audience? Does the tone match?


**Scenario 3: Review My Work**
User shares code for review. Does Claude use the format you specified? Does it respect the constraints (e.g., not reviewing style if you said the linter handles that)?


### System Prompt Components

**Card 1:**
Front: Identity block
Back: Defines who Claude is — role, expertise, and persona. Be specific: "a senior backend engineer specializing in distributed systems" beats "a developer." This shapes the knowledge frame for every response.

**Card 2:**
Front: Constraints block
Back: Hard limits on what Claude will do. "Never provide medical advice." "Keep responses under 200 words." Use positive phrasing when possible ("be concise" > "don't be wordy").

**Card 3:**
Front: Format block
Back: Specifies response structure. "Always respond with: 1) Summary, 2) Detail, 3) Next steps." Critical for production apps that need to parse Claude's output programmatically.

**Card 4:**
Front: Tone block
Back: Controls voice and style. "Be encouraging and use analogies." Or: "Be direct and skip pleasantries." Same content, different personality. Match tone to your audience.

**Card 5:**
Front: System prompt vs. user message
Back: System prompt = persistent instructions for the entire conversation (identity, rules). User message = per-turn instructions for this specific request. System sets WHO Claude is; user sets WHAT Claude does right now.


### Quiz

**Q1: What is the primary purpose of a system prompt?**
    A. To provide the user message
  ✓ B. To define who Claude is and how it behaves before any conversation starts
    C. To store Claude response history
    D. To set the temperature parameter
  *The system prompt is the invisible instruction set that shapes Claude's identity, constraints, format, tone, and behavior for the entire conversation. It is sent via the system parameter in the API.*

**Q2: Which component of a system prompt is best for preventing Claude from giving dangerous advice?**
    A. Identity
    B. Tone
  ✓ C. Constraints
    D. Examples
  *Constraints are the explicit limits — they tell Claude what it must never do, such as not providing medical, legal, or financial advice. They are your guardrails.*

**Q3: You want Claude to always respond in a specific JSON schema. Which component handles this?**
    A. Identity
  ✓ B. Format
    C. Tone
    D. Constraints
  *Format blocks define response structure — JSON schemas, markdown templates, numbered lists, and other output shapes. For production APIs, this is the most critical component.*

**Q4: A developer writes a 5,000-word system prompt covering every edge case. What is likely to happen?**
    A. Claude follows every instruction perfectly
  ✓ B. Later instructions dilute earlier ones — Claude starts ignoring some rules
    C. Claude refuses to respond to such a long prompt
    D. The API rejects prompts over 1,000 words
  *System prompt stuffing is an anti-pattern. After ~500-1000 words, each additional instruction dilutes the importance of the others. Focus on the 5-10 most important rules and trust Claude to handle edge cases.*

**Q5: Should you put task instructions in the system prompt or user message?**
    A. Always in the system prompt
    B. Always in the user message
  ✓ C. Persistent rules in system prompt, per-turn tasks in user message
    D. It makes no difference
  *System prompt = persistent identity and rules that apply to every message. User message = specific task for this turn. This separation lets you maintain consistent behavior while varying the task.*


Lesson 4 of 10

Module 2
