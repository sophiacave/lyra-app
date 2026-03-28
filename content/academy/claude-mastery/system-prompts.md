---
title: "System Prompts"
course: "claude-mastery"
order: 4
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 4 · Builder</div>
<h1>System Prompt Builder</h1>
<p>Master the art of crafting powerful system prompts</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Are System Prompts?</h2>
<p>A system prompt is the invisible instruction set that defines <em>who</em> Claude is and <em>how</em> it behaves for a given conversation. It's like hiring an expert and briefing them before they start work. A great system prompt has five key components: <strong>Identity</strong>, <strong>Constraints</strong>, <strong>Format</strong>, <strong>Tone</strong>, and <strong>Examples</strong>.</p>
</div>

<div class="card">
<h2>Build Your System Prompt</h2>
<p>Click blocks from the palette to add them to your prompt. Arrange the components to create the perfect system prompt.</p>

<div class="builder-grid">
<div class="block-palette">
<h3>Available Blocks</h3>
<div class="draggable-block" data-type="identity" data-text="You are a senior software engineer with 15 years of experience in full-stack development." onclick="addBlock(this)">
<span class="block-tag tag-identity">Identity</span>
Senior Software Engineer
</div>
<div class="draggable-block" data-type="identity" data-text="You are a friendly writing tutor who specializes in helping beginners improve their creative writing." onclick="addBlock(this)">
<span class="block-tag tag-identity">Identity</span>
Writing Tutor
</div>
<div class="draggable-block" data-type="constraints" data-text="Never provide medical, legal, or financial advice. Always recommend consulting a professional for those topics." onclick="addBlock(this)">
<span class="block-tag tag-constraints">Constraints</span>
Safety Guardrails
</div>
<div class="draggable-block" data-type="constraints" data-text="Keep all responses under 200 words unless the user explicitly asks for more detail." onclick="addBlock(this)">
<span class="block-tag tag-constraints">Constraints</span>
Concise Responses
</div>
<div class="draggable-block" data-type="format" data-text="Always structure your response with: 1) A brief summary, 2) Detailed explanation, 3) Code example if applicable, 4) Next steps." onclick="addBlock(this)">
<span class="block-tag tag-format">Format</span>
Structured Response
</div>
<div class="draggable-block" data-type="format" data-text="Respond using markdown with headers, bullet points, and code blocks where appropriate." onclick="addBlock(this)">
<span class="block-tag tag-format">Format</span>
Markdown Output
</div>
<div class="draggable-block" data-type="tone" data-text="Be encouraging and supportive. Celebrate progress. Use analogies to explain complex concepts." onclick="addBlock(this)">
<span class="block-tag tag-tone">Tone</span>
Warm & Encouraging
</div>
<div class="draggable-block" data-type="tone" data-text="Be direct and technical. Skip pleasantries. Focus on accuracy and efficiency." onclick="addBlock(this)">
<span class="block-tag tag-tone">Tone</span>
Direct & Technical
</div>
<div class="draggable-block" data-type="examples" data-text='Example:\nUser: "How do I center a div?"\nAssistant: "**Quick answer:** Use flexbox.\n```css\n.parent { display: flex; justify-content: center; align-items: center; }\n```\n**Why this works:** Flexbox creates a flex container..."' onclick="addBlock(this)">
<span class="block-tag tag-examples">Examples</span>
Code Q&A Example
</div>
<div class="draggable-block" data-type="examples" data-text='Example:\nUser: "Review my paragraph"\nAssistant: "Great start! I love your opening hook. Here are 3 suggestions:\n1. **Stronger verbs** — Replace \'walked\' with \'strode\' or \'ambled\'\n2. **Show, don\'t tell** — Instead of \'she was sad\'...\n3. **Pacing** — Your second sentence could be split..."' onclick="addBlock(this)">
<span class="block-tag tag-examples">Examples</span>
Writing Review Example
</div>
</div>

<div>
<h3 style="font-size:.85rem;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.75rem">Your System Prompt</h3>
<div class="drop-zone" id="dropZone">
<div class="drop-zone-placeholder" id="dzPlaceholder">Click blocks from the left to build your system prompt</div>
</div>
</div>
</div>
</div>

<div class="card">
<h2>Preview</h2>
<p>Your assembled system prompt:</p>
<div class="preview-box" id="previewBox">Add blocks above to see your system prompt here...</div>
</div>

<div class="card">
<h2>Test Against Scenarios</h2>
<p>See how your system prompt would influence Claude's response to these user messages:</p>
<div class="scenario-tabs">
<button class="scenario-tab active" onclick="showScenario(0,this)">Debugging Help</button>
<button class="scenario-tab" onclick="showScenario(1,this)">Explain Concept</button>
<button class="scenario-tab" onclick="showScenario(2,this)">Review My Work</button>
</div>
</div>

<div data-learn="MatchConnect" data-props='{"title":"Match System Prompt Block to Its Function","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Identity block","right":"Defines who Claude is — role, expertise, and persona"},{"left":"Constraints block","right":"Sets hard limits on what Claude must never do"},{"left":"Format block","right":"Specifies how responses should be structured"},{"left":"Tone block","right":"Controls the voice and style of responses"},{"left":"Examples block","right":"Shows ideal input-output pairs as demonstrations"}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"System Prompt Components","cards":[{"front":"Identity block","back":"Defines who Claude is — role, expertise, and persona. E.g., You are a senior software engineer with 15 years of experience."},{"front":"Constraints block","back":"Sets limits on what Claude will do. E.g., Never provide medical advice. Keep responses under 200 words."},{"front":"Format block","back":"Specifies how responses should be structured. E.g., Always respond with a summary, then detail, then next steps."},{"front":"Tone block","back":"Controls the style and voice. E.g., Be encouraging and use analogies. Or: Be direct and skip pleasantries."},{"front":"Examples block","back":"Shows Claude exactly what good output looks like through input-output demonstrations within the system prompt."}]}'></div>

<div data-learn="SortStack" data-props='{"title":"Order a Well-Structured System Prompt","instruction":"Arrange these system prompt components in the most effective order","items":["Identity — define who Claude is","Constraints — set hard limits","Format — specify response structure","Tone — set the voice and style","Examples — show ideal input-output pairs"]}'></div>

<div data-learn="QuizMC" data-props='{"title":"System Prompt Mastery","questions":[{"q":"What is the primary purpose of a system prompt?","options":["To provide the user message","To define who Claude is and how it behaves before any conversation starts","To store Claude response history","To set the temperature parameter"],"correct":1,"explanation":"The system prompt is the invisible instruction set that shapes Claude identity, constraints, format, tone, and behavior for the entire conversation."},{"q":"Which component of a system prompt is best for preventing Claude from giving dangerous advice?","options":["Identity","Tone","Constraints","Examples"],"correct":2,"explanation":"Constraints are the explicit limits block — they tell Claude what it must never do, such as not providing medical, legal, or financial advice."},{"q":"You want Claude to always respond with bullet points followed by a code example. Which block handles this?","options":["Identity","Format","Tone","Constraints"],"correct":1,"explanation":"Format blocks define response structure — headers, bullet points, code blocks, step numbering, and other output shape directives."},{"q":"Why are Examples blocks valuable in system prompts?","options":["They reduce token usage","They show Claude exactly what ideal output looks like through demonstration","They override the Identity block","They prevent the model from hallucinating"],"correct":1,"explanation":"Examples (few-shot demonstrations) are the most powerful teaching tool in a system prompt — showing the exact pattern you want is often clearer than describing it."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 4 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
