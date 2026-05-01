---
title: "Research Collaboration with AI"
course: "ai-for-research"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-research/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Research Collaboration <span class="accent">with AI.</span></h1>
  <p class="sub">Multi-author workflows, cross-disciplinary bridges, and team AI practices.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to coordinate AI usage across a multi-author research team</li>
    <li>Using AI to bridge disciplinary gaps in cross-departmental collaborations</li>
    <li>Version control and attribution practices for AI-assisted work</li>
    <li>Building shared AI workflows that scale across a lab group</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Collaboration Challenge</h2>

Research collaboration with AI introduces coordination problems that didn't exist before. When five authors each use AI differently -- different tools, different prompts, different disclosure standards -- the result is a Frankenstein manuscript with inconsistent voice, redundant sections, and unclear attribution.

The solution is a team AI protocol: a shared agreement on which tools are used, how they're used, how usage is documented, and who is responsible for AI-generated content.

```
TEAM AI PROTOCOL TEMPLATE:

Project: {project_name}
Date adopted: {date}
Team: {member_list}

1. APPROVED TOOLS: {list of AI tools the team has agreed to use}
2. PROHIBITED USES: {what AI should NOT be used for on this project}
3. DOCUMENTATION: All AI interactions saved in {shared_location}
4. ATTRIBUTION: AI usage disclosed in Methods per {journal} policy
5. REVIEW: AI-generated content must be reviewed by at least one
   co-author before inclusion in the manuscript
6. VERSIONING: AI-edited drafts saved with suffix "_ai-edited"
   Original drafts preserved with suffix "_human-draft"
7. RESPONSIBILITY: Each section has a named author responsible for
   the accuracy of all content, including AI-assisted portions
```

<div class="tip-box">
<strong>Adopt early, not late:</strong> Establish the AI protocol at the project kickoff, not when the paper is half-written. Retrofitting AI practices onto an existing manuscript is painful. Starting with shared norms is straightforward.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Cross-Disciplinary Translation</h2>

The most impactful research increasingly happens at disciplinary boundaries. AI serves as a translator between fields, helping collaborators understand each other's methods, vocabulary, and standards.

```
TRANSLATION PROMPT:

I am a {your_field} researcher collaborating with a {their_field}
researcher. They sent me this description of their methodology:

"{their_methodology_description}"

1. Explain this in terms a {your_field} researcher would understand
2. What are the analogous concepts in {your_field}?
3. What assumptions does this methodology make that I should be
   aware of from my field's perspective?
4. What questions should I ask my collaborator to ensure I
   understand correctly?
```

This works in both directions. The biologist can understand the machine learning methodology, and the ML researcher can understand the biological constraints. AI acts as a Rosetta Stone between disciplinary languages.

Specific use cases:
- **Statistics translation**: "Explain Bayesian hierarchical models in terms a wet lab biologist would understand"
- **Methods bridging**: "How would an economist's difference-in-differences approach apply to our clinical trial data?"
- **Jargon decoding**: "My collaborator uses these terms: {list}. Explain each in plain language with analogies to {my_field}"

<div class="callout">
<strong>The interdisciplinary gap:</strong> Studies show that cross-disciplinary collaborations produce 15-20% higher citation impact but take 30% longer due to communication friction. AI translation can reduce that friction significantly by giving each collaborator a bridge to the other's expertise.
</div>
</div>

<div class="lesson-section">
<h2>Multi-Author Writing Workflows</h2>

Coordinating writing across multiple authors is already hard. AI makes it manageable with structured workflows:

**Step 1: Shared outline with AI assistance.**
```
OUTLINE PROMPT:
"We are writing a paper with these contributions:
- Author A: {contribution_A}
- Author B: {contribution_B}
- Author C: {contribution_C}

Generate a paper outline that integrates all contributions
into a coherent narrative. For each section, indicate which
author is responsible and what content they should provide."
```

**Step 2: Section integration.**
Each author writes their sections independently. Then AI integrates them:
```
INTEGRATION PROMPT:
"Here are three sections written by different authors for the
same paper. Identify:
1. Inconsistencies in terminology (same concept, different names)
2. Redundant content (same point made in multiple sections)
3. Missing transitions between sections
4. Tone/style differences that need harmonizing

Do NOT rewrite. Just identify the issues with specific locations."
```

**Step 3: Voice harmonization.**
```
HARMONIZE PROMPT:
"Harmonize the voice and style of these sections to match
the tone established in the Introduction (which we consider
the reference style). Adjust word choice, sentence structure,
and level of formality to be consistent. Preserve all
technical content exactly."
```

<div class="tip-box">
<strong>The integration order matters:</strong> Write Introduction first (sets the narrative and voice). Write Methods and Results independently (factual, less voice-dependent). Write Discussion last (synthesizes everything). Use AI to harmonize after all sections exist.
</tip>
</div>
</div>

<div class="lesson-section">
<h2>Lab-Level AI Practices</h2>

For research labs and groups, AI practices should be standardized at the lab level, not left to individual choice.

**Shared prompt library**: Maintain a repository of tested, effective prompts for common tasks (literature search, statistical test selection, figure generation, editing passes). New lab members inherit proven workflows instead of starting from scratch.

```
lab-ai-toolkit/
  prompts/
    literature-search.md
    statistical-test-selection.md
    figure-generation.md
    editing-passes.md
    reviewer-response.md
  templates/
    ai-disclosure-statement.md
    team-ai-protocol.md
  guidelines/
    approved-tools.md
    data-privacy-checklist.md
    citation-verification-protocol.md
```

**Training**: New lab members should receive training on AI tools, their limitations, and the lab's protocols. A one-hour session covering the tools, the verification requirements, and the documentation expectations prevents months of bad habits.

**Regular review**: Monthly, review how AI is being used in the lab. What's working? What's producing low-quality output? What new tools have emerged? This keeps practices current and prevents drift.

<div class="callout">
<strong>The compounding advantage:</strong> Labs that systematize AI practices see compounding returns. Each new member benefits from the accumulated knowledge. Each project benefits from refined prompts. Within six months, a well-organized lab's AI toolkit becomes a significant competitive advantage in research productivity.
</div>
</div>

<div class="lesson-section">
<h2>Attribution and Ethical Norms</h2>

Clear attribution prevents disputes and satisfies journal requirements:

- **AI is not an author.** No major journal accepts AI authorship. AI cannot take responsibility for the work, which is the core criterion for authorship.
- **All authors are responsible.** Every co-author must be aware of and comfortable with the AI usage in the manuscript. Do not surprise co-authors with undisclosed AI involvement.
- **Document everything.** Save AI conversation logs, prompts used, and the specific sections where AI contributed. Store these as supplementary materials or internal records.
- **Disclose proportionally.** If AI wrote the first draft of Methods, say so. If AI checked grammar, a brief acknowledgment suffices. Match the disclosure to the extent of AI involvement.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "When should a research team establish their AI protocol?", "options": ["When the paper is nearly finished", "After the first draft is written", "At the project kickoff, before any writing begins", "When the journal asks about AI usage"], "correct": 2, "explanation": "Establishing AI protocols at project kickoff is straightforward. Retrofitting them onto a half-written manuscript is painful and leads to inconsistencies. Start with shared norms for tools, documentation, attribution, and review."}, {"q": "How does AI serve cross-disciplinary research collaborations?", "options": ["By replacing the need for collaborators from other fields", "As a translator between disciplinary vocabularies, methods, and assumptions", "By automating the entire collaboration process", "By writing each collaborator&#39;s section"], "correct": 1, "explanation": "AI acts as a Rosetta Stone between disciplines -- translating methodology descriptions, decoding jargon, and identifying analogous concepts across fields. This reduces the 30% communication friction overhead in cross-disciplinary collaborations."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What should a team AI protocol include?", "back": "Approved tools, prohibited uses, documentation location, attribution standards, review requirements (co-author review of AI content), versioning conventions, and named responsibility for each section&#39;s accuracy."}, {"front": "What is the correct integration order for multi-author papers?", "back": "Write Introduction first (sets narrative and voice). Write Methods and Results independently (factual). Write Discussion last (synthesizes). Use AI to harmonize voice after all sections exist."}, {"front": "What should a lab-level AI toolkit contain?", "back": "Shared prompt library (tested prompts for common tasks), templates (disclosure statements, protocols), guidelines (approved tools, data privacy, citation verification). New members inherit proven workflows."}, {"front": "What are the four attribution norms for AI in collaborative research?", "back": "1) AI is not an author. 2) All co-authors must be aware of AI usage. 3) Document everything (save conversations, prompts, contribution locations). 4) Disclose proportionally to the extent of AI involvement."}, {"front": "How do cross-disciplinary collaborations benefit from AI translation?", "back": "These collaborations produce 15-20% higher citation impact but take 30% longer due to communication friction. AI translates methods, vocabulary, and assumptions between fields, reducing that friction significantly."}]}'></div>

</div>