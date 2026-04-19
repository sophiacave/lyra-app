# Temperature Lab

**Course:** Claude Mastery
**Order:** 3
**Type:** lab
**Access:** Free

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 3 of 10


  # Temperature Lab

  Master the creativity dial — understand how temperature shapes AI output, with real API examples


## What Is Temperature?

Temperature controls the **randomness** of an AI's output. It is a number between 0 and 1 that you pass with every API call. At temperature 0, the model always picks the most probable next word — making it deterministic and precise. At temperature 1, it samples from a wider distribution of possibilities — making it creative and unpredictable.

Technically, temperature scales the logits (raw probability scores) before the model picks the next token. Lower temperature sharpens the probability distribution — the most likely token becomes overwhelmingly dominant. Higher temperature flattens it — less likely tokens get a real chance of being selected. The result: lower temperature produces consistent, predictable text; higher temperature produces varied, surprising text.


**Important:** Temperature does not make the model "smarter" or "dumber." It changes the *selection strategy*, not the model's knowledge. A temperature 0 response is not "better" than a temperature 1 response — it is more *predictable*. The right temperature depends entirely on your use case.


0.0
Precise
0.25
Focused
0.5
Balanced
0.75
Creative
1.0
Wild


## Temperature in the API

Temperature is a single parameter in the API call. Here is how to use it:


Python — temperature parameter

```
import anthropic

client = anthropic.Anthropic()

def generate(prompt: str, temperature: float = 1.0) -> str:
    """Generate a response at a specific temperature."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        temperature=temperature,  # 0.0 to 1.0
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

# Same prompt, different temperatures
prompt = "Name a product that helps people sleep better."

# Temperature 0 — always the same answer
print(generate(prompt, temperature=0.0))
# → "SleepWell" (every time, deterministic)

print(generate(prompt, temperature=0.0))
# → "SleepWell" (identical — temperature 0 is reproducible)

# Temperature 0.8 — different each time
print(generate(prompt, temperature=0.8))
# → "DreamDrift" (creative, varied)

print(generate(prompt, temperature=0.8))
# → "NightHaven" (different answer each time)
```


curl — temperature in the raw API

```
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 300,
    "temperature": 0.0,
    "messages": [
      {"role": "user", "content": "Classify this email as spam or not: You won a free iPhone!"}
    ]
  }'
```


## Temperature in Practice — Same Prompt, Different Results

To understand temperature intuitively, consider the prompt "Write a product name for a sleep aid." Here is what you might get at different temperature settings:


**Temperature 0.0 (Deterministic)**
Output: "SleepWell"
Run it again: "SleepWell"
Run it again: "SleepWell"
Always the same — the most probable answer every time.


**Temperature 0.8 (Creative)**
Output: "DreamDrift"
Run it again: "NightHaven"
Run it again: "LunaRest"
Different each time — less probable tokens get a real chance.


Try this yourself: run the same prompt at temperature 0 five times (identical results), then at temperature 0.8 five times (five different creative answers). The difference is immediately obvious.


## When to Use Each Temperature


🧊
**Temperature 0**Code generation, data extraction, math, factual Q&A, classification, JSON output. When you need consistency and reproducibility. **If you run the same prompt twice and want the same answer, use 0.**


⚖️
**Temperature 0.3-0.5**General conversation, summarization, editing, analysis. Good balance of reliability and naturalness. Most chatbots use this range.


🎨
**Temperature 0.7-0.8**Creative writing, brainstorming, marketing copy, poetry. When you want variety and surprise. Run the same prompt 5 times and you'll get 5 different creative angles.


🔥
**Temperature 0.9-1.0**Experimental writing, wild brainstorming, artistic exploration. Output may become incoherent — less likely tokens get selected, producing unexpected word choices. Use sparingly.


## Temperature + Top-P: The Full Picture

Temperature is not the only sampling parameter. Claude also supports **top_p** (nucleus sampling), which limits the token pool to the smallest set whose cumulative probability exceeds a threshold.


**Temperature**
Scales all probabilities. Lower = sharper distribution, higher = flatter. Affects how the model weights its options.


**Top-P (Nucleus Sampling)**
Cuts off low-probability tokens entirely. top_p=0.9 means "only consider tokens in the top 90% of probability mass." Prevents rare, incoherent tokens.


Python — combining temperature and top_p

```
# For creative tasks: high temperature + moderate top_p
# This gives variety while preventing total nonsense
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    temperature=0.8,    # creative sampling
    top_p=0.9,           # but cut off the truly wild tokens
    messages=[{
        "role": "user",
        "content": "Write 5 taglines for a coffee shop called 'The Grind'."
    }]
)

# For deterministic tasks: temperature 0 (top_p doesn't matter)
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    temperature=0.0,    # deterministic — always same output
    messages=[{
        "role": "user",
        "content": "Classify: 'Your package has been delayed.' → [urgent/normal/spam]"
    }]
)
# → "normal" (every single time)
```


**Pro tip:** Anthropic recommends using *either* temperature or top_p, not both at once. If you set temperature=0, top_p is irrelevant (the model always picks the single most probable token). For most use cases, temperature alone is sufficient.


## Common Temperature Mistakes

These are the mistakes that trip up even experienced developers:


**Using high temperature for code generation**
Temperature 0.7+ introduces random token choices into syntax, variable names, and logic. The result: code that looks creative but has subtle bugs. Always use temperature 0 for code.


**Using temperature 0 for creative writing**
Temperature 0 always picks the most probable token. For creative tasks, this produces generic, predictable text. "The sun set over the horizon" instead of something surprising. Bump to 0.7-0.8.


**Thinking temperature affects intelligence**
It does not. Temperature only changes the selection strategy. A temperature 0 response uses the same model knowledge as temperature 1 — just with different randomness in word choice.


**Not setting temperature at all**
Claude's default temperature is 1.0, which is more random than most use cases need. For production applications, always set temperature explicitly. A common starting point is 0.3 for general tasks.


### Temperature Concepts

**Card 1:**
Front: Temperature
Back: A parameter (0.0-1.0) controlling the randomness of AI output. 0 = deterministic and precise (always picks most probable token). 1 = creative and unpredictable (samples from wider distribution). Claude default is 1.0.

**Card 2:**
Front: Temperature 0
Back: The model always picks the most probable next token. Produces identical output for the same input every time. Best for code, classification, extraction, and factual Q&A. If reproducibility matters, use 0.

**Card 3:**
Front: Temperature 0.3-0.5
Back: A balanced range good for conversation, summarization, editing, and analysis. Reliable output with natural variation. Most production chatbots use this range.

**Card 4:**
Front: Top-P (Nucleus Sampling)
Back: Alternative sampling parameter. top_p=0.9 means only consider tokens in the top 90% of probability mass. Prevents rare, incoherent tokens. Anthropic recommends using either temperature OR top_p, not both.

**Card 5:**
Front: Claude default temperature
Back: 1.0 — the maximum. This is more random than most use cases need. For production applications, always set temperature explicitly. Common starting points: 0.0 for code/classification, 0.3 for general tasks, 0.7-0.8 for creative writing.


### Quiz

**Q1: You are building a function that classifies customer emails as urgent or not urgent. What temperature should you use?**
  ✓ A. 0.0 — needs deterministic, consistent results
    B. 0.5 — balanced is best
    C. 0.8 — some creativity helps
    D. 1.0 — maximum variation
  *Classification tasks require consistency and reproducibility. Temperature 0 ensures the model always picks the most probable classification — not a creative one. Running the same email through twice should give the same result.*

**Q2: You want Claude to help brainstorm 20 different campaign slogans. What temperature range fits best?**
    A. 0.0 — precise answers only
    B. 0.1-0.2 — slightly flexible
  ✓ C. 0.7-0.8 — creative variety
    D. Temperature does not affect brainstorming
  *Temperature 0.7-0.8 introduces enough randomness to generate varied, surprising ideas — exactly what brainstorming needs. Each generation will produce different slogans, giving you a wide creative spread.*

**Q3: What is Claude's default temperature if you do not set it explicitly?**
    A. 0.0 — deterministic by default
    B. 0.5 — balanced by default
    C. 0.7 — creative by default
  ✓ D. 1.0 — maximum randomness by default
  *Claude's default temperature is 1.0 — maximum randomness. This surprises many developers who expect a conservative default. For production applications, always set temperature explicitly to get predictable behavior.*

**Q4: A developer sets temperature to 0.9 for a code generation task and gets buggy output. Why?**
    A. The model is too smart for the task
  ✓ B. High temperature introduces random token choices into syntax and logic
    C. The API key has expired
    D. Temperature 0.9 disables code generation
  *High temperature causes the model to occasionally select less probable tokens. In creative writing, this produces interesting variety. In code, it produces subtle bugs — wrong variable names, incorrect operators, broken syntax. Always use temperature 0 for code.*


Lesson 3 of 10

Module 1
