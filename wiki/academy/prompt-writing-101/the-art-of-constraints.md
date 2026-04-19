# The Art of Constraints

**Course:** Prompt Writing 101
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/prompt-writing-101/)
  Lesson 6 of 10


  # The Art of Constraints.

  Limits don't limit AI. They focus it. The tighter the box, the more creative the output.


  ### After this lesson you'll know


    - Why constraints improve output quality (not reduce it)

    - The 5 constraint types and when to use each

    - How to use negative constraints ("Don't..." prompts)

    - The "invisible guardrail" technique for tone control




  The Paradox
  ## Why limits make AI better, not worse.

  It feels counterintuitive: give AI fewer options and it performs better? But think about writing a song. "Write a song about anything" is paralyzing. "Write a 4-line verse about losing your keys, in the style of country music" — now you can work.
  Constraints do the same thing for AI. They eliminate the infinite space of mediocre possibilities and force the model into a focused, specific output space where the quality is higher.
  Every professional who uses AI well has figured this out: **constraints are not limitations. They're creative fuel.**


Prompt — Constraint-Heavy Template

```
You are a seasoned brand copywriter.

Write a product description for [product name].

[LENGTH CONSTRAINT]:    Exactly 3 sentences. No more, no less.
[TONE CONSTRAINT]:     Confident, not arrogant. Warm, not sappy.
[AUDIENCE CONSTRAINT]: Written for [target buyer persona]
                        who cares about [key value — e.g., sustainability].
[SCOPE CONSTRAINT]:    Focus ONLY on [one key benefit].
                        Do not mention features, specs, or price.
[NEGATIVE CONSTRAINT]: Do not use: "revolutionary," "game-changing,"
                        "best-in-class," or any superlatives.
                        Do not start with a question.
                        No exclamation marks.
[FORMAT CONSTRAINT]:   First sentence = hook. Second = value.
                        Third = one concrete proof point.
```


  Count the constraints in that template: six types working together. Length keeps it tight. Tone draws a precise emotional line. Audience focuses the language. Scope prevents feature-dumping. Negatives kill cliches. Format ensures structure. The AI has almost no room to produce anything generic.


  The Types
  ## 5 types of constraints.


### 5 Constraint Types — Flip to See Examples

**Card 1:**
Front: 📏 1. LENGTH Constraints  Control how much output you get.
Back: EXAMPLES:  "Exactly 3 sentences." "Under 200 words." "One paragraph, no more." "5-7 bullet points."  WHY: Without length constraints, AI defaults to exhaustive answers. Shorter is almost always better for usability.

**Card 2:**
Front: 🎭 2. TONE Constraints  Control how it sounds.
Back: EXAMPLES:  "Conversational but authoritative." "Like a friendly mentor, not a professor." "Confident, not arrogant. Warm, not sappy." "Match the energy of a team standup, not a board meeting."  WHY: "Professional" is too vague. Pairing a positive with a negative (confident, not arrogant) draws a precise emotional line.

**Card 3:**
Front: 🎯 3. SCOPE Constraints  Control what the output covers.
Back: EXAMPLES:  "Focus ONLY on pricing strategy. Ignore marketing." "Cover the last 90 days, not the full year." "Only discuss the technical implementation, not the business case." "Address only the objections from enterprise buyers."  WHY: Without scope, AI tries to be comprehensive. Comprehensive usually means shallow. Narrow scope = deeper value.

**Card 4:**
Front: 👥 4. AUDIENCE Constraints  Control who the output is written for.
Back: EXAMPLES:  "Written for a CFO who has 5 minutes to read this." "Accessible to someone with no coding background." "For an audience that already understands the basics — skip introductions." "Written for a skeptic who has tried this approach before and it failed."  WHY: The same information presented to a CEO vs an intern looks completely different. Audience shapes vocabulary, depth, and structure.

**Card 5:**
Front: 🚫 5. NEGATIVE Constraints  Control what the output must NOT include.
Back: EXAMPLES:  "Do not use the word \"delve\" or \"leverage.\"" "No preamble. No summary. Just the content." "Do not hedge — commit to a recommendation." "Avoid generic advice anyone could give." "No exclamation marks. No emoji."  WHY: Negative constraints directly target AI-isms. They are the fastest way to make output sound human.


  Advanced
  ## Stacking constraints for maximum impact.

  Individual constraints are useful. But the real power comes from combining them strategically. Here's how different constraint combinations serve different goals.


Combination 1 — The "Executive Brief" Stack

```
LENGTH:    Under 150 words.
TONE:     Direct. Lead with the conclusion.
SCOPE:    Only the three metrics that changed this quarter.
AUDIENCE: A CEO who reads 50 reports a week.
NEGATIVE: No background. No methodology. No caveats.

RESULT: A razor-sharp brief that respects the reader's time
and gets to the point in the first sentence.
```


Combination 2 — The "Human Voice" Stack

```
TONE:     Conversational. Like texting a smart friend.
NEGATIVE: No buzzwords. No "in today's fast-paced world."
           No "it's important to note." No transition phrases
           like "furthermore" or "additionally."
LENGTH:    Short paragraphs. Max 2 sentences each.
SCOPE:    One idea per paragraph.

RESULT: Output that sounds like a person wrote it, not an AI.
The negative constraints do the heavy lifting by banning
the specific patterns that make AI writing feel robotic.
```


Combination 3 — The "Actionable Advice" Stack

```
SCOPE:    Only advice I can implement this week with zero budget.
AUDIENCE: A solo founder with no team and no funding.
NEGATIVE: No "it depends." No "consider hiring." No advice
           that requires tools I do not already have.
TONE:     Like a mentor who has been in my shoes.
LENGTH:    5 actions. One sentence each. No explanations unless
           the action is non-obvious.

RESULT: Advice that is immediately useful, not theoretically
interesting. The scope + negative constraints filter out
everything that sounds wise but is actually useless.
```


  Notice how each stack tells a different story about what kind of output you want. The constraints work together like ingredients in a recipe — each one adds something the others cannot provide alone.


  The Secret Weapon
  ## Negative constraints are your best friend.

  AI has patterns it falls into. You know them: the overly enthusiastic tone, the unnecessary preamble, the "great question!" response, the list that starts with "here are some..." AI-isms are the enemy of authentic output.
  Negative constraints kill them instantly:


### Negative Constraints That Work — Flip to See Why

**Card 1:**
Front: 🚫 "Do not start with Sure! or Great question! — just answer directly."
Back: WHY IT WORKS: AI defaults to sycophantic openers. This one constraint instantly makes output feel more professional and authentic. Use it in every prompt.

**Card 2:**
Front: 🚫 "Do not use the words delve, leverage, utilize, or synergy."
Back: WHY IT WORKS: These are the most overused AI words. Banning them forces the model to use simpler, more natural language. Your readers will never suspect AI wrote it.

**Card 3:**
Front: 🚫 "No preamble. No summary at the end. Just the content."
Back: WHY IT WORKS: AI loves to add "Here is what I will cover..." before and "In summary..." after the actual content. This constraint eliminates the fluff and gives you pure value.

**Card 4:**
Front: 🚫 "Do not hedge with it depends — commit to a recommendation."
Back: WHY IT WORKS: AI naturally hedges to seem balanced. But you asked for advice, not a debate. This forces a clear, actionable recommendation instead of wishy-washy on-one-hand analysis.

**Card 5:**
Front: 🚫 "Avoid generic advice anyone could give. Be specific to my situation."
Back: WHY IT WORKS: This is a meta-constraint — it tells AI to actually USE the context you provided instead of falling back on generic platitudes. Pair it with detailed context for maximum impact.


  Pro Technique
  ## The "invisible guardrail" for tone.

  The most sophisticated way to control tone is pairing what you want with what you don't:




        Be This

          Confident
Direct
Warm
Conversational
Honest



        Not This

          Arrogant
Blunt
Sappy
Sloppy
Brutal





  This technique draws a precise line. "Confident, not arrogant" gives AI a much clearer target than "professional tone." The negative defines the boundary of the positive.


### Quiz

**Q1: Why do constraints IMPROVE AI output instead of limiting it?**
    A. They make the AI work harder
  ✓ B. They eliminate mediocre possibilities and focus the output space
    C. They trick the AI into trying harder
    D. They do not improve output — they just make it shorter
  *Constraints narrow the infinite space of possible outputs into a focused zone where quality is higher. Like giving a songwriter a specific form to work within — the boundaries enable creativity.*

**Q2: Which type of constraint is MOST effective at eliminating generic AI-sounding output?**
    A. Length constraints
    B. Scope constraints
  ✓ C. Negative constraints (what NOT to do)
    D. Audience constraints
  *Negative constraints directly target AI-isms — the buzzwords, preambles, hedging, and sycophantic openers that make output feel robotic. Banning specific patterns forces more authentic language.*

**Q3: What is the invisible guardrail technique?**
    A. Hiding constraints inside the context section
  ✓ B. Pairing positive tone instructions with negative boundaries (confident, not arrogant)
    C. Setting constraints the AI cannot see
    D. Using only negative constraints with no positive direction
  *The invisible guardrail pairs what you want with what you do not want. Confident, not arrogant draws a precise line that professional tone alone cannot achieve.*


  Practice
  ## Build constraint sets for real tasks.

  The best way to get comfortable with constraints is to practice building them for tasks you actually do. Here are three common scenarios with the constraint sets that would transform the output.


Scenario — Weekly Team Update Email

```
LENGTH:    Under 100 words. If it cannot be said briefly, it is
           not right for a weekly update.
TONE:     Encouraging but honest. Celebrate wins AND name
           challenges without sugarcoating.
SCOPE:    This week's top 3 accomplishments, 1 challenge,
           and next week's priority. Nothing else.
NEGATIVE: No "I hope this email finds you well." No bullet
           points longer than one line. No passive voice.
```


Scenario — LinkedIn Post About a New Feature

```
LENGTH:    Under 150 words. Hook in the first line.
TONE:     Excited but not salesy. Show, do not tell.
AUDIENCE: Product managers and engineering leaders who have
           this exact problem.
SCOPE:    ONE feature, ONE problem it solves, ONE result.
NEGATIVE: No "excited to announce." No emoji. No hashtag
           spam. No "link in comments." Do not start with
           "We just launched" — start with the problem.
```


  Notice how the negative constraints in each scenario target the most common bad patterns for that specific format. LinkedIn posts have different AI-isms than emails. Your negative constraints should be specific to the format you're working with.

  **Your constraint starter kit:** Copy these negative constraints and keep them handy. They work in almost any prompt:

    - "Do not start with Sure! or Great question! — just answer directly."

    - "No preamble. No summary at the end. Just the content."

    - "Do not use the words delve, leverage, utilize, or synergy."

    - "No hedging. Commit to a recommendation."

    - "Avoid generic advice anyone could give. Be specific to my situation."


  Add just two or three of these to your next prompt and compare the output to what you usually get. The difference is immediate and dramatic.


  [Next: Iteration and Refinement →](/academy/prompt-writing-101/iteration-and-refinement)
