# Few-Shot Prompting

**Course:** Claude Mastery
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 6 of 10


  # Few-Shot Mastery

  Teach Claude any pattern with examples — from classification to structured extraction, with production code


## What Is Few-Shot Prompting?

Few-shot prompting means giving Claude a few examples of the input-output pattern you want, then letting it generalize to new inputs. It is teaching by showing rather than explaining — and it works remarkably well because Claude can infer complex patterns from just 2-3 examples.

This is distinct from **zero-shot** prompting (no examples, just instructions) and **one-shot** prompting (a single example). For most tasks, 3-5 examples hits the sweet spot: enough to disambiguate the pattern without wasting context tokens.


**Key insight:** Few-shot examples are often more powerful than written instructions. Saying "classify sentiment as positive, negative, or neutral" is ambiguous — does "The acting was great but the plot was terrible" count as positive, negative, or neutral? An example resolves this ambiguity instantly.


1
**Example 1: Input -> Output**Claude observes the first pattern


2
**Example 2: Input -> Output**Pattern recognition strengthens


3
**Example 3: Input -> Output**Claude deeply understands the pattern


4
**New Input -> Claude generates correct output!**Pattern is applied to novel inputs


## Zero-Shot vs. Few-Shot — Side by Side

Here is the same task done both ways. Notice how few-shot produces more consistent, predictable output:


Zero-shot (instructions only)

```
Classify this review's sentiment
as positive, negative, or neutral.

Review: "Decent food but the
service was painfully slow."

# Claude might say:
# "Negative" or "Mixed" or
# "The sentiment is primarily
#  negative with a positive
#  element..." (verbose)
```


Few-shot (with examples)

```
Review: "Loved every minute!"
Sentiment: Positive

Review: "Worst meal I've ever had."
Sentiment: Negative

Review: "It was fine, nothing special."
Sentiment: Neutral

Review: "Decent food but the
service was painfully slow."
Sentiment: Negative
# Consistent one-word answer
# matching the example format
```


The few-shot version produces exactly the format you showed — a single word. The zero-shot version might give a paragraph of analysis. Few-shot teaches both the *logic* and the *format*.


## Few-Shot in the API

In the Claude API, few-shot examples go in the messages array as alternating user/assistant turns. Claude sees them as a conversation history and continues the pattern:


Python — few-shot sentiment classifier

```
import anthropic

client = anthropic.Anthropic()

def classify_sentiment(review: str) -> str:
    """Classify a review as Positive, Negative, or Neutral."""
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",  # haiku for classification
        max_tokens=10,       # we only need one word
        temperature=0,       # deterministic
        system="Classify the sentiment of each review as exactly one word: Positive, Negative, or Neutral.",
        messages=[
            # Few-shot examples
            {"role": "user", "content": "The movie was absolutely fantastic!"},
            {"role": "assistant", "content": "Positive"},
            {"role": "user", "content": "I wasted two hours on this terrible film."},
            {"role": "assistant", "content": "Negative"},
            {"role": "user", "content": "It was okay, nothing special."},
            {"role": "assistant", "content": "Neutral"},
            # The real input
            {"role": "user", "content": review},
        ]
    )
    return response.content[0].text.strip()

# Use it
print(classify_sentiment("Great acting but terrible plot"))  # → Negative
print(classify_sentiment("A masterpiece of modern cinema"))  # → Positive
print(classify_sentiment("Meh"))                             # → Neutral
```


**Notice:** We use Haiku for classification — it is 4x cheaper than Sonnet and plenty smart for this task. We set max_tokens=10 because we only need one word. We set temperature=0 for deterministic output. These small optimizations add up at scale.


## Few-Shot for Structured Extraction

Few-shot is not just for classification. It is powerful for teaching Claude any output format — including complex structured extraction:


Python — few-shot structured extraction

```
import json

def extract_event(text: str) -> dict:
    """Extract event details from natural language text."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        temperature=0,
        messages=[
            # Example 1
            {"role": "user", "content": "Let's meet for coffee at Blue Bottle on Tuesday at 3pm."},
            {"role": "assistant", "content": '{"event":"Coffee meeting","location":"Blue Bottle","day":"Tuesday","time":"3:00 PM"}'},
            # Example 2
            {"role": "user", "content": "Team standup is every morning at 9 in the main conference room."},
            {"role": "assistant", "content": '{"event":"Team standup","location":"Main conference room","day":"Daily","time":"9:00 AM"}'},
            # Real input
            {"role": "user", "content": text},
        ]
    )
    return json.loads(response.content[0].text)

result = extract_event("Dentist appointment next Friday at 2:30, Dr. Lee's office.")
print(result)
# {'event': 'Dentist appointment', 'location': "Dr. Lee's office",
#  'day': 'Friday', 'time': '2:30 PM'}
```


The examples teach Claude both the extraction logic AND the exact JSON shape. Without examples, Claude might produce a different key structure each time.


## Building a Few-Shot Prompt — The Pattern

When constructing a few-shot prompt, follow this template. Each example pair is an alternating user/assistant message in the API:


**Example 1:** "The movie was absolutely fantastic!" → **Positive**
**Example 2:** "I wasted two hours of my life on this terrible film." → **Negative**
**Example 3:** "It was okay, nothing special but not bad either." → **Neutral**
**New input:** "Great acting but terrible plot" → Claude applies the pattern and outputs **Negative**

Notice how the examples teach both the classification logic AND the output format (a single word). When building your own few-shot prompts, make sure all examples follow the exact same structure.


## Few-Shot Best Practices


**Use 3-5 examples**
Too few and the pattern is ambiguous. Too many wastes tokens. 3-5 is the sweet spot for most tasks. Add more only if the pattern is genuinely complex.


**Cover edge cases in examples**
Include examples that represent boundary conditions. For sentiment: include a mixed review, not just clearly positive/negative. Edge cases prevent Claude from defaulting to the most common class.


**Be consistent in format**
All examples should follow the exact same structure. If one example outputs "Positive" and another outputs "positive (confident)", Claude will be confused about which format to use.


**Order matters**
Put the most representative example first and the most complex one last. Claude builds understanding progressively — start simple, end sophisticated.


**Combine with system prompt**
System prompt for identity and constraints + few-shot examples for format and logic = the most powerful combination. Instructions explain the rules; examples show the execution.


### Challenge: Tricky Sentiment Cases

Consider how your few-shot examples would handle these ambiguous inputs:

"The acting was great but the plot made no sense"
"I wouldn't say I hated it, but I'd never watch it again"
"My kids loved it, I slept through it — 5 stars"

If your examples only cover clearly positive and clearly negative cases, Claude may struggle with mixed sentiment. Adding a mixed-sentiment example (like "Good food but terrible service" → "Negative") teaches Claude how to handle the hard calls.


### Few-Shot Prompting Concepts

**Card 1:**
Front: Few-shot prompting
Back: Providing Claude with input-output examples to demonstrate a pattern, then asking it to apply that pattern to new inputs. The examples go in the messages array as alternating user/assistant turns.

**Card 2:**
Front: Zero-shot vs. few-shot
Back: Zero-shot: no examples, just instructions. Few-shot: 2-5 examples showing the pattern. Few-shot produces more consistent format and handles ambiguous cases better.

**Card 3:**
Front: Ideal number of examples
Back: 3-5 examples is the sweet spot. 1-2 may be ambiguous. 6+ wastes context tokens without meaningful accuracy gain. Add more only for genuinely complex patterns.

**Card 4:**
Front: Few-shot for structured extraction
Back: Examples teach both the extraction LOGIC and the exact output FORMAT. Two JSON examples teach Claude the schema more reliably than describing it in words.

**Card 5:**
Front: Combining few-shot + system prompt
Back: The most powerful pattern: system prompt for identity, constraints, and rules + few-shot examples for format and edge cases. Instructions explain rules; examples show execution.


### Quiz

**Q1: What is the ideal number of few-shot examples for most tasks?**
    A. 1 — one clear example is enough
  ✓ B. 3-5 — the sweet spot for pattern clarity without wasting tokens
    C. 10+ — more examples always improve accuracy
    D. It depends on temperature, not example count
  *3-5 examples is the proven sweet spot. Too few leaves the pattern ambiguous; too many wastes context window tokens without meaningful accuracy gain.*

**Q2: In the Claude API, where do few-shot examples go?**
    A. In the system prompt as text
    B. In a separate examples parameter
  ✓ C. In the messages array as alternating user/assistant turns
    D. In a JSON file uploaded separately
  *Few-shot examples are placed in the messages array as alternating user and assistant messages. Claude sees them as conversation history and continues the pattern with the next user message.*

**Q3: You are building a few-shot classifier for urgency levels: High, Medium, Low. What type of example is most important to include?**
    A. Only High urgency examples
    B. Only the most common class
  ✓ C. Edge cases and boundary conditions
    D. Examples from a different domain
  *Edge cases (e.g., something that could be High or Medium) are most valuable — they teach Claude how to handle the hard calls, not just the obvious ones.*

**Q4: Why is few-shot often more effective than detailed written instructions?**
    A. Examples use fewer tokens
    B. Examples are ambiguous so Claude tries harder
  ✓ C. Examples show both the LOGIC and FORMAT simultaneously, resolving ambiguity
    D. Examples bypass the system prompt
  *Written instructions can be interpreted multiple ways. Examples resolve ambiguity by showing exactly what you want — the reasoning pattern AND the output format in one demonstration.*


Lesson 6 of 10

Module 2
