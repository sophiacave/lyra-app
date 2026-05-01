---
title: "Paper Writing & Structure"
course: "ai-for-research"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-research/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Paper Writing <span class="accent">& Structure.</span></h1>
  <p class="sub">Using AI as your editor, not your ghostwriter.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to use AI for each section of a research paper (IMRaD structure)</li>
    <li>Prompting strategies that produce academic-quality prose, not generic text</li>
    <li>The editing workflow: rough draft to submission-ready manuscript</li>
    <li>Avoiding AI-generated writing tells that trigger reviewer suspicion</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The AI Writing Principle</h2>

AI should edit your writing, not replace it. The difference matters for quality, originality, and ethics.

When AI writes from scratch, it produces competent but generic prose. It lacks your specific theoretical perspective, your interpretation of the data, and your voice. The result reads like a textbook summary -- technically correct, intellectually empty.

When AI edits your draft, it tightens your arguments, catches logical gaps, improves transitions, and polishes grammar while preserving your ideas. The result reads like your best work, produced faster.

The workflow: You write a rough draft (messy, incomplete, full of notes-to-self). AI restructures, clarifies, and polishes. You review, revise, and add the intellectual content AI cannot supply. This cycle repeats until submission quality is reached.

<div class="callout">
<strong>The tell:</strong> AI-generated academic writing has recognizable patterns: overuse of "Furthermore" and "Moreover," hedging phrases like "it is noteworthy that," unnecessary complexity, and a tendency to say things that are true but obvious. Reviewers are developing an eye for this. Writing that sounds like it came from an AI will be scrutinized more heavily.
</div>
</div>

<div class="lesson-section">
<h2>Section-by-Section Strategy</h2>

Each section of a research paper has different AI affordances:

**Abstract (write last, edit heavily)**
```
Prompt: "Edit this abstract to be exactly 250 words. Ensure it
covers: background (1-2 sentences), gap/objective (1 sentence),
methods (2-3 sentences), key results with numbers (2-3 sentences),
conclusion/implication (1-2 sentences). Remove all filler."
```

**Introduction (AI outlines, you write, AI edits)**
```
Prompt: "I'm writing an introduction for a paper on {topic}.
My argument moves through these points:
1. {broad context}
2. {narrowing to specific problem}
3. {what's been done}
4. {what's missing -- the gap}
5. {how our work addresses the gap}

Review my draft and identify: (a) paragraphs that don't serve
the narrative, (b) missing transitions, (c) claims that need
citations, (d) where the argument loses focus."
```

**Methods (AI generates boilerplate, you verify accuracy)**
Methods sections are highly formulaic. AI excels here.
```
Prompt: "Write a Methods section describing: {procedure_details}.
Use past tense, passive voice where appropriate. Include all
details needed for replication: sample sizes, specific parameters,
software versions, statistical tests with justifications."
```

**Results (you write, AI formats)**
Results should come from your analysis code output, not from AI generation. Use AI to format the numbers into readable prose.
```
Prompt: "Convert these statistical results into a Results section:
{paste_statistical_output}
Follow APA format for reporting statistics.
Include effect sizes. Do not interpret -- just report."
```

**Discussion (most human-dependent section)**
The discussion is where you make your intellectual contribution. AI can help structure it, but the interpretation must be yours.
```
Prompt: "Review my Discussion section. Check that I have:
1. Restated key findings (without repeating Results)
2. Interpreted findings in context of existing literature
3. Addressed alternative explanations
4. Acknowledged limitations honestly
5. Stated implications (practical and theoretical)
6. Suggested future directions that are specific and actionable"
```

<div class="tip-box">
<strong>The limitations section:</strong> Do not let AI write your limitations. It produces generic limitations ("sample size was limited") that signal you haven't thought deeply. Write honest, specific limitations that show you understand your study's constraints. AI can then help you articulate them more clearly.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>The Editing Pipeline</h2>

Use AI for multiple editing passes, each focused on a different dimension:

```
PASS 1 -- STRUCTURE:
"Review this manuscript for logical flow. Does each paragraph
connect to the next? Does each section build on the previous?
Identify any sections that feel out of place or redundant."

PASS 2 -- ARGUMENT:
"Identify every claim in this manuscript. For each claim:
is it supported by a citation or by our data? Flag unsupported
claims. Flag claims that are overstated relative to the evidence."

PASS 3 -- CLARITY:
"Simplify this manuscript. Replace jargon with plain language
where possible. Shorten sentences over 30 words. Remove
hedging that doesn't serve scientific precision."

PASS 4 -- JOURNAL FIT:
"Compare this manuscript to the style of {target journal}.
Flag any deviations in: section structure, reference format,
figure placement conventions, word count limits."
```

Each pass improves a specific dimension without trying to do everything at once. This prevents the AI from making trade-offs you didn't authorize (simplifying language at the cost of precision, for example).

<div class="callout">
<strong>Version control your manuscript:</strong> Save a version after each editing pass. When AI changes break something (it happens), you can identify exactly which pass introduced the problem and revert that specific change rather than starting over.
</div>
</div>

<div class="lesson-section">
<h2>Avoiding AI Writing Tells</h2>

Reviewers and editors are increasingly attuned to AI-generated text. Common tells to eliminate:

- **Transition word overuse**: "Furthermore," "Moreover," "Additionally" appearing in every paragraph. Vary your transitions or remove them -- good paragraph structure makes most transitions unnecessary.
- **The summarizer opening**: "In recent years, there has been growing interest in..." This is generic filler. Open with something specific to your work.
- **Unnecessary hedging**: "It is important to note that" and "it should be mentioned that" add nothing. State the point directly.
- **Symmetrical structure**: AI loves lists of exactly three points with parallel structure. Real academic writing has irregular rhythms.
- **Overuse of "delve," "crucial," "landscape," "multifaceted"**: These words appear far more frequently in AI-generated text than in human academic writing. Replace them.

After AI editing, do a final human pass specifically looking for these patterns. Read your paper aloud -- if it sounds like a textbook, revise until it sounds like you.

<div class="tip-box">
<strong>The voice test:</strong> Pick three paragraphs from your pre-AI draft and three from the AI-edited version. Can you tell which is which? If not, the AI editing preserved your voice. If the AI-edited sections sound generic, rewrite them in your own words using the AI's structural suggestions.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Response to Reviewers</h2>

AI excels at structuring reviewer responses. The format is formulaic: quote the reviewer's comment, respond point-by-point, indicate what changed and where.

```
REVIEWER RESPONSE PROMPT:
"Reviewer 2 says: '{reviewer_comment}'

Draft a response that:
1. Acknowledges the reviewer's point (even if wrong)
2. Explains what we did to address it
3. Points to the specific manuscript changes (page/line numbers)
4. If we disagree, explains why with evidence -- politely

Tone: respectful, thorough, appreciative. Never dismissive."
```

The AI handles the diplomatic framing. You provide the scientific substance. This combination produces responses that are both rigorous and professionally composed.
</div>

<QuizMC
  question="What is the correct role for AI in academic paper writing?"
  options={["Generate the entire paper from an outline", "Write the first draft, then you edit", "You write a rough draft, AI edits and polishes while you retain the intellectual content", "AI writes Methods and Results, you write Introduction and Discussion"]}
  correct={2}
  explanation="You write the rough draft containing your ideas, interpretations, and arguments. AI restructures, clarifies, and polishes. You review and revise. This preserves your intellectual contribution while benefiting from AI's editing strengths."
/>

<QuizMC
  question="Which AI writing tell should you specifically watch for and eliminate?"
  options={["Using technical terminology", "Overuse of 'Furthermore,' 'Moreover,' and generic openings like 'In recent years'", "Including too many citations", "Writing in passive voice"]}
  correct={1}
  explanation="AI-generated text overuses transition words ('Furthermore,' 'Moreover,' 'Additionally'), generic openings ('In recent years...'), and unnecessary hedging ('It is important to note that'). These patterns signal AI involvement to reviewers."
/>

<FlashDeck cards={[
  { front: "Why should AI edit your writing rather than generate it from scratch?", back: "AI generates competent but generic prose lacking your theoretical perspective, data interpretation, and voice. Editing preserves your ideas while improving clarity and structure. The result reads like your best work, not a textbook summary." },
  { front: "Which paper section is most human-dependent?", back: "The Discussion section. Interpretation of results in theoretical context, addressing alternative explanations, and stating implications require your scientific judgment. AI can help structure it but cannot supply the intellectual content." },
  { front: "What are the four editing passes in the AI editing pipeline?", back: "Pass 1: Structure (logical flow). Pass 2: Argument (supported claims). Pass 3: Clarity (simplify language). Pass 4: Journal fit (style, format, word count). Each pass focuses on one dimension." },
  { front: "Name five common AI writing tells.", back: "1) Transition overuse (Furthermore, Moreover). 2) Summarizer openings (In recent years...). 3) Unnecessary hedging (It is important to note that). 4) Symmetrical three-point lists. 5) Overuse of 'delve,' 'crucial,' 'landscape,' 'multifaceted.'" },
  { front: "How should you handle reviewer response drafting with AI?", back: "AI handles diplomatic framing and structural formatting (quote comment, point-by-point response, manuscript change references). You provide the scientific substance and ensure accuracy. The combination produces rigorous and professionally composed responses." }
]} />

</div>