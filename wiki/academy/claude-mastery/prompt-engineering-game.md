# Prompt Game

**Course:** Claude Mastery
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[Claude Mastery](/academy/claude-mastery/)
  Lesson 7 of 10


  # Prompt Engineering Game

  5 real-world challenges. Craft production-quality prompts. Earn your score.


**How scoring works:** Your prompt is checked for **relevant keywords** that indicate good prompt engineering (e.g., specifying format, audience, constraints). Each keyword found earns you points proportional to the challenge total (100 pts max). Longer prompts earn a small length bonus (+5 at 50 chars, +5 more at 100). Using a hint costs 10 points. Score 70+ on consecutive challenges to build a **streak multiplier** for bonus points.


## Before You Play: The Prompt Engineering Toolkit

These are the techniques you have learned so far. Each challenge tests one or more of these skills in a real-world context:


**System Prompts**
Identity + Constraints + Format + Tone + Examples


**Chain-of-Thought**
"Think step by step" + structured reasoning + XML tags


**Few-Shot Examples**
Input/output pairs that teach pattern and format


**Format Control**
JSON-only, markdown, structured output, field names


Level1/5
Score0
Streak0x
Best--


## Game Complete!


0

points

### YOUR SCORES


## Expert Solutions — Study After Playing

After you have completed all 5 challenges, study these expert-level prompts. Compare them to yours and notice the patterns:


**Challenge 1: Haiku Format**
"Write a haiku about programming. The haiku MUST follow the 5-7-5 syllable structure exactly. Include the word 'code' in the poem."
Why it works: Specifies format (haiku), constraint (5-7-5), required content (code), and domain (programming). Every keyword adds precision.


**Challenge 2: JSON Output**
"Extract the person's information from this sentence and output ONLY valid JSON. No explanation. No markdown code blocks. Use exactly these fields: name, age, city, occupation."
Why it works: "ONLY" suppresses prose. "No explanation, no markdown" prevents wrapping. Exact field names ensure parseable output.


**Challenge 3: Tone Transformation**
"Rewrite this quarterly report summary in an optimistic, confident tone suitable for investors. Keep all factual data accurate — do not fabricate or exaggerate numbers. Focus on growth opportunities."
Why it works: Specifies tone (optimistic), audience (investors), AND honesty constraint (no fabrication). The honesty constraint is what separates good from great.


**Challenge 4: Constrained Code Review**
"Review this code for bugs. Output ONLY bullet points listing issues found. Maximum one sentence per issue. Do NOT provide corrected code. Tag each issue as [CRITICAL], [WARNING], or [INFO]."
Why it works: Format (bullets), constraint (no corrected code, one sentence), severity tagging. Prevents the verbose "here's the fixed version" that wastes tokens.


**Challenge 5: Persona Lock**
"You are Professor Oak, a world-renowned expert on AI and machine learning. Always stay in character. Answer questions about AI from Professor Oak's perspective. Maintain scientific accuracy while being warm and approachable."
Why it works: Clear identity, persistence instruction ("always stay in character"), domain lock (AI/ML), and dual tone directive (accurate + approachable).


## Turning Game Prompts Into Production Code

Every challenge in this game maps directly to a production use case. Here is how Challenge 2 (JSON extraction) looks as real API code:


Python — the JSON challenge as production code

```
import json, anthropic

client = anthropic.Anthropic()

def extract_person(sentence: str) -> dict:
    """Extract structured data from natural language."""
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=150,
        temperature=0,
        system=(
            "Extract person information from text. "
            "Output ONLY valid JSON with these fields: "
            "name, age, city, occupation. "
            "No explanation. No markdown."
        ),
        messages=[{"role": "user", "content": sentence}]
    )
    return json.loads(response.content[0].text)

result = extract_person(
    "Sarah, a 28-year-old graphic designer from Portland."
)
print(result)
# {'name': 'Sarah', 'age': 28, 'city': 'Portland',
#  'occupation': 'graphic designer'}
```


## Production Patterns: Beyond the Game

Each game challenge maps to a pattern you will use in real systems every day. Understanding the mapping turns a fun exercise into a transferable skill.


**Challenge 1 (Haiku) → Structured Generation**
When you forced Claude into a 5-7-5 syllable grid, you practiced **structural constraints** — the same technique used to generate SQL queries, regex patterns, or any output that must conform to a grammar. The production version: "Output ONLY a valid SQL SELECT statement. No explanation."


**Challenge 2 (JSON) → Data Extraction Pipelines**
Suppressing prose with "ONLY valid JSON" is the backbone of every extraction pipeline — parsing resumes, invoices, support tickets, or medical records into structured data that downstream code can consume without regex hacks.


**Challenge 3 (Tone) → Content Transformation at Scale**
Tone + audience + honesty constraints power every content pipeline that rewrites internal notes into customer-facing copy, translates technical docs for non-technical readers, or adapts marketing across regions — all while preserving factual accuracy.


**Challenge 4 (Code Review) → Automated Quality Gates**
Constrained code review becomes a CI/CD quality gate. The severity tags (`[CRITICAL]`, `[WARNING]`, `[INFO]`) let you programmatically block merges on critical issues while allowing info-level notes to pass through. See the production code below.


**Challenge 5 (Persona) → Domain-Expert Agents**
Persona lock is the foundation of every domain-specific agent — a legal assistant that stays in lawyer-mode, a medical triage bot that never breaks character, or a customer support agent with product expertise. The "always stay in character" instruction prevents Claude from reverting to generic assistant behavior.


Python — Challenge 4 as a production code review gate

```
import anthropic, re

client = anthropic.Anthropic()

REVIEW_SYSTEM = (
    "You are a senior code reviewer. "
    "Review the provided code for bugs, security issues, "
    "and performance problems.\n\n"
    "Rules:\n"
    "- Output ONLY bullet points.\n"
    "- Maximum one sentence per issue.\n"
    "- Do NOT provide corrected code.\n"
    "- Tag each issue: [CRITICAL], [WARNING], or [INFO].\n"
    "- If no issues found, output exactly: No issues found."
)

def review_code(code: str) -> list[dict]:
    """Review code and return structured issues."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        temperature=0,
        system=REVIEW_SYSTEM,
        messages=[{"role": "user", "content": code}]
    )
    text = response.content[0].text
    issues = []
    for line in text.strip().splitlines():
        match = re.match(
            r"[-•]\s*\[(CRITICAL|WARNING|INFO)]\s*(.*)", line
        )
        if match:
            issues.append({
                "severity": match.group(1),
                "message": match.group(2).strip()
            })
    return issues

# Usage in a CI pipeline
issues = review_code("""
def login(user, password):
    query = f"SELECT * FROM users WHERE name='{user}'"
    if hashlib.md5(password).hexdigest() == stored:
        return True
""")

has_critical = any(i["severity"] == "CRITICAL" for i in issues)
print(f"Found {len(issues)} issues, blocking: {has_critical}")
for issue in issues:
    print(f"  [{issue['severity']}] {issue['message']}")
# [CRITICAL] SQL injection via f-string interpolation in query.
# [CRITICAL] MD5 is cryptographically broken for password hashing.
```


## The Prompt Engineering Mindset

Technique matters, but mindset separates beginner prompt engineers from experts. These five principles apply to every prompt you will ever write — game or production.


PRINCIPLE 1
Specificity Beats Length
A 20-word prompt with exact constraints outperforms a 200-word essay every time. "Output ONLY valid JSON with fields: name, age" is more powerful than three paragraphs explaining what JSON is. Every word should add a constraint, not a clarification.


PRINCIPLE 2
Constraints Prevent Defaults
Claude has helpful defaults — it wants to explain, show examples, and provide corrected code. Without constraints, you get Claude's defaults, not your requirements. Every production prompt needs at least one "do NOT" to override a default you do not want.


PRINCIPLE 3
Format Instructions Are Non-Optional
If you do not specify the output format, Claude will choose one — and it will not be the one your code expects. JSON, bullet points, numbered lists, single-word answers: say it explicitly. Production code that parses AI output without a format instruction is gambling.


PRINCIPLE 4
Negative Instructions Override Helpful Defaults
"Do NOT provide corrected code" is more effective than "just list the bugs." Negative instructions directly override Claude's instinct to be maximally helpful. Use them when Claude keeps adding something you did not ask for — explanations, caveats, alternatives, or apologies.


PRINCIPLE 5
Temperature Controls Creativity vs Consistency
Temperature 0 means "give me the same answer every time" — use it for extraction, classification, and code review. Temperature 0.7+ means "surprise me" — use it for creative writing, brainstorming, and persona roleplay. Most beginners never touch temperature. Experts set it on every call because the default (1.0) is wrong for most production tasks.


**The meta-lesson:** Prompt engineering is not about talking to AI — it is about **constraining a probability distribution**. Every instruction you add narrows the space of possible outputs. The game taught you to add constraints one at a time and see the score go up. Production prompt engineering is the same loop: add a constraint, test the output, repeat until the distribution collapses to exactly what you need.


### Prompt Engineering Techniques

**Card 1:**
Front: Haiku format specification
Back: Specify exact syllable structure (5-7-5) AND the required word. Ambiguous format instructions lead to off-spec outputs. Name the format, define the constraints, specify required content.

**Card 2:**
Front: JSON-only output prompt
Back: Tell Claude to output ONLY JSON with no explanation and no markdown code blocks. Define the exact field names you want. Use temperature=0 and low max_tokens for consistency.

**Card 3:**
Front: Tone transformation
Back: Specify the target tone, the target audience, and any honesty constraints — e.g., optimistic for investors without fabricating data. The honesty constraint is what makes it production-safe.

**Card 4:**
Front: Constrained code review
Back: Request ONLY bullet points with NO corrected code and a max of one sentence per issue. Add severity tags [CRITICAL/WARNING/INFO]. Format constraints prevent over-verbose responses.

**Card 5:**
Front: Persona lock
Back: Set a persistent character identity with "always stay in character" as an explicit instruction. Combine with domain accuracy requirements so the persona doesn't compromise factual correctness.


### Quiz

**Q1: You want Claude to output ONLY a valid JSON object from a sentence, no prose, no markdown. Which instruction set is correct?**
    A. Parse this sentence
    B. Convert to JSON format please
  ✓ C. Output ONLY valid JSON. No explanation. No markdown code blocks. Fields: name, age, city, occupation.
    D. Give me the JSON if possible
  *You need three things: ONLY keyword to suppress prose, no explanation to prevent narration, and no markdown to prevent code fences. Specifying exact field names removes ambiguity. This is directly usable in production code.*

**Q2: For the tone transformer challenge, what constraint separates good prompts from great ones?**
    A. Using more formal vocabulary
    B. Specifying the target audience (investors)
  ✓ C. Adding the honesty constraint — optimistic without lying or fabricating
    D. Making the rewrite shorter
  *Specifying both the tone AND the honesty constraint (optimistic but truthful, without fabricating data) is what makes a tone prompt production-safe. Without the honesty constraint, Claude might exaggerate numbers to match the requested tone.*

**Q3: You want Claude to review code but NOT show the corrected version. What is the key constraint?**
    A. Set temperature to 0
    B. Say please only show issues
  ✓ C. Explicitly state: do NOT provide corrected code, output ONLY bullet points
    D. Use Haiku instead of Sonnet
  *Claude defaults to being helpful — which means it will try to fix the code for you. You need an explicit negative constraint (do NOT provide corrected code) combined with a positive format directive (ONLY bullet points) to override this default.*

**Q4: To build a reliable persona that stays in character across all follow-ups, what system prompt element is essential?**
    A. A very long backstory
  ✓ B. Always stay in character as an explicit instruction
    C. Using high temperature
    D. Ending with a question
  *Always stay in character is the critical anchor phrase. Without an explicit persistence instruction, Claude may break character when asked factual questions or faced with unusual inputs.*


Lesson 7 of 10

Module 2
