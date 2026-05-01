---
title: "Hypothesis Generation & Exploration"
course: "ai-for-research"
order: 3
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-research/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Hypothesis Generation <span class="accent">& Exploration.</span></h1>
  <p class="sub">Using AI to expand your possibility space without losing scientific discipline.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to use AI as a structured brainstorming partner for hypothesis generation</li>
    <li>Cross-domain analogy techniques that surface non-obvious hypotheses</li>
    <li>Evaluating and filtering AI-generated hypotheses for testability and novelty</li>
    <li>The boundary between AI-assisted ideation and genuine scientific contribution</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Ideation Bottleneck</h2>

The hardest part of research is not testing hypotheses -- it is generating good ones. A good hypothesis is specific, testable, grounded in existing evidence, and ideally non-obvious. Most researchers generate hypotheses from a narrow band of literature they happen to have read, constrained by their training and disciplinary norms.

AI expands this band. An LLM trained on the breadth of scientific literature can surface connections that a specialist might miss: patterns from adjacent fields, historical precedents, analogies from distant domains. It is not generating knowledge -- it is generating candidates for your scientific judgment.

The critical distinction: AI generates hypotheses. You evaluate them. The scientific contribution is the evaluation, not the generation. A hypothesis has no value until someone designs an experiment to test it and interprets the results.

<div class="callout">
<strong>Historical precedent:</strong> Cross-domain insight has driven major discoveries for centuries. Penicillin came from contamination. CRISPR came from studying bacterial immune systems. The double helix came from X-ray crystallography. AI accelerates this cross-pollination by making connections across domains that no single human could span.
</div>
</div>

<div class="lesson-section">
<h2>Structured Hypothesis Brainstorming</h2>

Unstructured prompts ("give me research ideas") produce generic output. Structured prompts produce testable hypotheses. Here is a framework:

```
HYPOTHESIS GENERATION PROMPT:

Context:
- Field: {your_field}
- Current knowledge: {brief summary of what is established}
- Open question: {the specific gap you want to address}
- Constraints: {equipment, budget, timeline, ethical limits}

Generate 10 hypotheses that could explain or address the open question.
For each hypothesis:
1. STATEMENT: One-sentence testable prediction
2. MECHANISM: Proposed causal mechanism
3. EVIDENCE: Existing evidence that supports or contradicts this
4. TEST: How would you test this? What experiment would confirm or refute it?
5. NOVELTY: How is this different from existing hypotheses in the literature?
6. RISK: What would make this hypothesis wrong?

Prioritize hypotheses that are:
- Testable with {constraints}
- Non-obvious (not direct extensions of existing work)
- Specific enough to be falsifiable
```

The key is specificity in your context. The more precisely you describe what is known, what is unknown, and what resources you have, the more targeted and useful the hypotheses will be.

<div class="tip-box">
<strong>Iteration pattern:</strong> Generate 10, evaluate each, then ask AI to generate 10 more that are "different in approach" from the first batch. This pushes the model beyond its most probable outputs into more creative territory. Three rounds of 10 typically surface 2-3 genuinely interesting hypotheses worth pursuing.
</div>
</div>

<div class="lesson-section">
<h2>Cross-Domain Analogy</h2>

The most powerful hypothesis generation technique is cross-domain analogy: finding structurally similar problems in unrelated fields and importing their solutions.

```
CROSS-DOMAIN PROMPT:

I study {phenomenon} in {your_field}.
The key properties of this phenomenon are:
- {property_1}
- {property_2}
- {property_3}

What analogous phenomena exist in completely different fields
(physics, biology, economics, computer science, ecology, sociology)?
For each analogy:
1. What is the analogous phenomenon?
2. What has that field learned about it?
3. What solutions or explanations have they found?
4. How could those solutions translate to my domain?
5. What are the limits of this analogy -- where does it break down?
```

Example: A researcher studying information cascades in social media might find analogies in epidemiology (viral spread), ecology (invasive species propagation), physics (phase transitions), and economics (bank runs). Each analogy suggests different mechanisms and testing strategies that may not be obvious from within the communication studies literature alone.

<div class="callout">
<strong>Analogy quality check:</strong> The best analogies share structural similarity (same mathematical form, same causal dynamics) not just surface similarity (both involve "networks" or both are "complex"). Ask the AI to explain exactly where the structural mapping holds and where it breaks. Analogies that break in important ways are still useful -- they tell you what is unique about your phenomenon.
</div>
</div>

<div class="lesson-section">
<h2>Evaluating AI-Generated Hypotheses</h2>

Not every AI-generated hypothesis deserves investigation. Apply these filters:

**Filter 1: Testability.** Can you design a concrete experiment that would confirm or refute this hypothesis? If the answer requires technology that does not exist or data that cannot be collected, it is not currently testable. Set it aside for future consideration.

**Filter 2: Novelty.** Search for the hypothesis in your literature database. Has it already been proposed and tested? If yes, what were the results? A hypothesis is only worth pursuing if it is either untested or tested with inconclusive results.

**Filter 3: Mechanism.** Does the proposed mechanism make physical, biological, or logical sense? AI can propose plausible-sounding mechanisms that violate basic domain constraints. Your expertise is the filter here.

**Filter 4: Feasibility.** Given your resources (lab equipment, compute budget, timeline, team size), can you actually test this hypothesis? Brilliance is irrelevant if the experiment costs $10M and you have $10K.

```
EVALUATION MATRIX:

| Hypothesis | Testable? | Novel? | Mechanistic? | Feasible? | Score |
|------------|-----------|--------|--------------|-----------|-------|
| H1: ...    | Yes       | Yes    | Plausible    | Yes       | 4/4   |
| H2: ...    | Yes       | No     | Strong       | Yes       | 3/4   |
| H3: ...    | Unclear   | Yes    | Weak         | No        | 1/4   |
```

Hypotheses scoring 3-4 go to experiment design (Lesson 5). Hypotheses scoring 1-2 get documented for future reference but are not pursued now.

<div class="tip-box">
<strong>The 3-hypothesis rule:</strong> Never pursue a single hypothesis in isolation. Develop 2-3 competing hypotheses and design experiments that can distinguish between them. This prevents confirmation bias and produces stronger papers because your discussion section can address alternatives.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>The Contribution Boundary</h2>

Where is the line between "AI helped me think" and "AI did my thinking"? This is important for intellectual honesty and for your career.

AI-assisted hypothesis generation is scientifically legitimate when:
- You provided the domain context, constraints, and evaluation criteria
- You evaluated, filtered, and selected the hypotheses using your expertise
- You designed the experiments to test them
- You interpreted the results
- You disclosed the AI's role in your methods section

AI-assisted hypothesis generation is problematic when:
- You accepted hypotheses without evaluation or domain expertise
- You cannot explain why a hypothesis is plausible in your own words
- You treated the AI's output as evidence rather than as a suggestion

The test is simple: if a colleague asked "why do you think this hypothesis is worth testing?" could you defend it without mentioning AI? If yes, the contribution is yours. The AI was a brainstorming tool. If no, you need to go deeper before pursuing it.
</div>

<QuizMC
  question="What makes cross-domain analogy the most powerful hypothesis generation technique?"
  options={["It generates more hypotheses", "It finds structurally similar problems in unrelated fields, importing solutions and mechanisms that would not be obvious from within your discipline", "It is easier to prompt", "AI is better at analogies than specific domain knowledge"]}
  correct={1}
  explanation="Cross-domain analogy surfaces connections that disciplinary specialization misses. The best analogies share structural similarity (same causal dynamics or mathematical form), not just surface similarity. They import tested solutions from other fields into your domain."
/>

<QuizMC
  question="What is the '3-hypothesis rule' and why does it matter?"
  options={["Generate exactly 3 hypotheses per session", "Always pursue 2-3 competing hypotheses so you can design experiments that distinguish between them and avoid confirmation bias", "Rate each hypothesis on 3 criteria", "Ask 3 different AI models for hypotheses"]}
  correct={1}
  explanation="Pursuing a single hypothesis leads to confirmation bias. Developing 2-3 competing hypotheses forces you to design experiments that can distinguish between alternatives, producing stronger papers with better discussion sections."
/>

<FlashDeck cards={[
  { front: "What is the researcher's role vs. AI's role in hypothesis generation?", back: "AI generates candidate hypotheses by surfacing cross-domain connections and patterns. The researcher evaluates, filters, and selects using domain expertise. The scientific contribution is the evaluation and experimental design, not the generation." },
  { front: "What are the four filters for evaluating AI-generated hypotheses?", back: "1) Testability: can you design a concrete experiment? 2) Novelty: has it been proposed/tested before? 3) Mechanism: does the causal logic make domain-level sense? 4) Feasibility: can you test it with your resources?" },
  { front: "How do you get better hypotheses from AI?", back: "Use structured prompts with specific context (field, known facts, open questions, constraints). Iterate: generate 10, evaluate, then ask for 10 more that differ in approach. Three rounds typically surface 2-3 genuinely interesting candidates." },
  { front: "What makes a cross-domain analogy high quality?", back: "Structural similarity (same mathematical form, same causal dynamics), not just surface similarity (both involve 'networks'). Good analogies include where the mapping breaks down -- that reveals what is unique about your phenomenon." },
  { front: "How do you determine if AI-assisted ideation is a legitimate scientific contribution?", back: "The test: if a colleague asks 'why is this hypothesis worth testing?' can you defend it without mentioning AI? If yes, the contribution is yours. You must provide context, evaluate with expertise, design experiments, and interpret results." }
]} />

</div>