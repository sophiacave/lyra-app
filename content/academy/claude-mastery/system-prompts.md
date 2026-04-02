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
<p>Master the invisible instruction set that shapes every Claude conversation — with real code and anti-patterns</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Are System Prompts?</h2>
<p>A system prompt is the invisible instruction set that defines <em>who</em> Claude is and <em>how</em> it behaves for a given conversation. It is sent with every API call but never shown to the end user. Think of it as hiring an expert and briefing them before they start work — the system prompt is that briefing.</p>

<p>A great system prompt has five key components: <strong>Identity</strong>, <strong>Constraints</strong>, <strong>Format</strong>, <strong>Tone</strong>, and <strong>Examples</strong>. Each serves a distinct purpose, and the order matters — Claude pays the most attention to content at the beginning of the system prompt.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — system prompt in the API</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">1024</span>,
    system=<span style="color:#fbbf24">"You are a senior Python developer with 15 years of experience.\n\nRules:\n- Always include type hints in code examples\n- Explain reasoning before showing code\n- If the user's approach has issues, say so directly\n- Never use print() for debugging — suggest proper logging"</span>,
    messages=[
        {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"How should I handle database connections?"</span>}
    ]
)
<span style="color:#34d399">print</span>(response.content[<span style="color:#fb923c">0</span>].text)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">The <code>system</code> parameter is separate from <code>messages</code>. It is sent once and persists across the entire conversation. User messages change; the system prompt stays constant.</p>
</div>

<div class="card">
<h2>The Five Components</h2>
<p>Every effective system prompt is built from these five building blocks. You do not need all five for every use case — but understanding each one lets you craft the right prompt for any situation.</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.88rem">1. Identity — Who is Claude?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Defines the role, expertise, and persona. "You are a senior Python developer" or "You are a friendly writing tutor." This shapes the lens through which Claude approaches every response. Be specific — "a developer" is weaker than "a senior backend engineer who specializes in distributed systems."</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">2. Constraints — What must Claude NOT do?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Hard limits on behavior. "Never provide medical advice." "Keep responses under 200 words." "Do not speculate beyond the provided data." Constraints are your guardrails — they prevent Claude from drifting into territory you don't want.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.88rem">3. Format — How should responses look?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"Always respond with: 1) Summary, 2) Detail, 3) Code example." "Use markdown." "Respond in JSON format." Format directives ensure consistent, parseable output — critical for production applications that need to parse Claude's response programmatically.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.88rem">4. Tone — What voice should Claude use?</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">"Be encouraging and use analogies." "Be direct and technical — skip pleasantries." Tone shapes the personality without changing the content. The same technical answer feels different when delivered warmly vs. bluntly.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.88rem">5. Examples — Show, don't tell</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Include 1-3 input/output examples showing exactly what you want. Examples are the most powerful component — they disambiguate instructions that could be interpreted multiple ways. This is the "few-shot" technique from Lesson 6 applied inside a system prompt.</p>
</div>
</div>
</div>

<div class="card">
<h2>A Complete Production System Prompt</h2>
<p>Here is a real-world system prompt that uses all five components. Notice how each section is clearly labeled with headers and ordered by priority:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Production system prompt — AI code reviewer</div>
<pre style="margin:0;color:#e5e5e5"><code>CODE_REVIEWER_PROMPT = (
    <span style="color:#fbbf24">"# Identity\n"</span>
    <span style="color:#fbbf24">"You are a senior code reviewer for a production Python application.\n"</span>
    <span style="color:#fbbf24">"You have 10+ years of experience with Python, FastAPI, PostgreSQL,\n"</span>
    <span style="color:#fbbf24">"and distributed systems. You care deeply about code quality.\n\n"</span>
    <span style="color:#fbbf24">"# Constraints\n"</span>
    <span style="color:#fbbf24">"- NEVER approve code with SQL injection vulnerabilities\n"</span>
    <span style="color:#fbbf24">"- NEVER suggest quick hacks — always fix root causes\n"</span>
    <span style="color:#fbbf24">"- Do NOT review style (formatting, naming) — our linter handles that\n"</span>
    <span style="color:#fbbf24">"- If unsure about a security implication, flag it explicitly\n\n"</span>
    <span style="color:#fbbf24">"# Format\n"</span>
    <span style="color:#fbbf24">"Structure every review as:\n"</span>
    <span style="color:#fbbf24">"1. **Summary** — one sentence: what does this code do?\n"</span>
    <span style="color:#fbbf24">"2. **Issues** — numbered list, tagged [CRITICAL/WARNING/INFO]\n"</span>
    <span style="color:#fbbf24">"3. **Suggestions** — specific code changes, shown as diffs\n"</span>
    <span style="color:#fbbf24">"4. **Verdict** — APPROVE, REQUEST_CHANGES, or BLOCK\n\n"</span>
    <span style="color:#fbbf24">"# Tone\n"</span>
    <span style="color:#fbbf24">"Be direct and constructive. No sugar-coating, but no rudeness.\n"</span>
    <span style="color:#fbbf24">"Say what is wrong and how to fix it. Acknowledge good patterns."</span>
)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">This prompt produces structured, consistent code reviews with severity levels and clear verdicts. The headers make it easy to maintain and update — you can modify the Format section without touching Identity.</p>
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
Warm &amp; Encouraging
</div>
<div class="draggable-block" data-type="tone" data-text="Be direct and technical. Skip pleasantries. Focus on accuracy and efficiency." onclick="addBlock(this)">
<span class="block-tag tag-tone">Tone</span>
Direct &amp; Technical
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
<h2>Anti-Patterns — What NOT to Do</h2>
<p>These are the most common mistakes in system prompt engineering. Each one makes Claude less effective:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Vague identity</strong>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:.5rem">
<div style="font-size:.82rem"><span style="color:#f87171">Bad:</span> <span style="color:#a1a1aa">"You are helpful."</span></div>
<div style="font-size:.82rem"><span style="color:#34d399">Good:</span> <span style="color:#a1a1aa">"You are a senior tax accountant specializing in US small business filings."</span></div>
</div>
<p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0">Specificity gives Claude a knowledge frame to draw from. Vague identities produce generic responses.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Contradictory instructions</strong>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:.5rem">
<div style="font-size:.82rem"><span style="color:#f87171">Bad:</span> <span style="color:#a1a1aa">"Be concise. Also, be thorough and cover every edge case."</span></div>
<div style="font-size:.82rem"><span style="color:#34d399">Good:</span> <span style="color:#a1a1aa">"Be concise for simple questions. For complex topics, be thorough."</span></div>
</div>
<p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0">Contradictions force Claude to guess which instruction to follow. Add conditions to resolve ambiguity.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Prompt stuffing</strong>
<div style="font-size:.82rem;margin-top:.5rem"><span style="color:#f87171">Bad:</span> <span style="color:#a1a1aa">A 5,000-word system prompt covering every possible scenario</span></div>
<p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0">Longer is not better. After ~500-1000 words, each additional instruction dilutes the others. Focus on the 5-10 most important rules.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Negative-only constraints</strong>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:.5rem">
<div style="font-size:.82rem"><span style="color:#f87171">Bad:</span> <span style="color:#a1a1aa">"Don't be vague. Don't be wordy. Don't use jargon."</span></div>
<div style="font-size:.82rem"><span style="color:#34d399">Good:</span> <span style="color:#a1a1aa">"Be specific and concise. Use plain language accessible to non-experts."</span></div>
</div>
<p style="font-size:.78rem;color:#71717a;margin:.4rem 0 0">Telling Claude what NOT to do is less effective than telling it what TO do. Positive instructions are clearer and produce better results.</p>
</div>
</div>
</div>

<div class="card">
<h2>System Prompts vs. User Messages</h2>
<p>A common question: should instructions go in the system prompt or in the user message? The answer depends on what you are building:</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.85rem">System Prompt</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Persistent instructions that apply to EVERY message in the conversation. Identity, constraints, format rules. Think: "who is Claude for this entire session?"</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.85rem">User Message</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Per-turn instructions that apply to THIS specific request. "Summarize this document." "Debug this code." Think: "what should Claude do right now?"</p>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — system prompt + user message layering</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># System prompt: persistent identity + rules</span>
system = (
    <span style="color:#fbbf24">"You are a data analyst. Always respond with:\n"</span>
    <span style="color:#fbbf24">"1. Key finding (one sentence)\n"</span>
    <span style="color:#fbbf24">"2. Supporting data\n"</span>
    <span style="color:#fbbf24">"3. Recommended action\n"</span>
    <span style="color:#fbbf24">"Use plain language. No jargon."</span>
)

<span style="color:#71717a"># User message: per-turn task</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">500</span>,
    system=system,  <span style="color:#71717a"># same for every turn</span>
    messages=[
        {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Our bounce rate went from 40% to 65% last week."</span>}
    ]
)
<span style="color:#71717a"># Claude responds AS a data analyst, IN the required format,</span>
<span style="color:#71717a"># with analysis of the specific bounce rate data.</span></code></pre>
</div>
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


<div data-learn="FlashDeck" data-props='{"title":"System Prompt Components","cards":[{"front":"Identity block","back":"Defines who Claude is — role, expertise, and persona. Be specific: \"a senior backend engineer specializing in distributed systems\" beats \"a developer.\" This shapes the knowledge frame for every response."},{"front":"Constraints block","back":"Hard limits on what Claude will do. \"Never provide medical advice.\" \"Keep responses under 200 words.\" Use positive phrasing when possible (\"be concise\" > \"don\u0027t be wordy\")."},{"front":"Format block","back":"Specifies response structure. \"Always respond with: 1) Summary, 2) Detail, 3) Next steps.\" Critical for production apps that need to parse Claude\u0027s output programmatically."},{"front":"Tone block","back":"Controls voice and style. \"Be encouraging and use analogies.\" Or: \"Be direct and skip pleasantries.\" Same content, different personality. Match tone to your audience."},{"front":"System prompt vs. user message","back":"System prompt = persistent instructions for the entire conversation (identity, rules). User message = per-turn instructions for this specific request. System sets WHO Claude is; user sets WHAT Claude does right now."}]}'></div>
<div data-learn="QuizMC" data-props='{"title":"System Prompt Mastery","questions":[{"q":"What is the primary purpose of a system prompt?","options":["To provide the user message","To define who Claude is and how it behaves before any conversation starts","To store Claude response history","To set the temperature parameter"],"correct":1,"explanation":"The system prompt is the invisible instruction set that shapes Claude\u0027s identity, constraints, format, tone, and behavior for the entire conversation. It is sent via the system parameter in the API."},{"q":"Which component of a system prompt is best for preventing Claude from giving dangerous advice?","options":["Identity","Tone","Constraints","Examples"],"correct":2,"explanation":"Constraints are the explicit limits — they tell Claude what it must never do, such as not providing medical, legal, or financial advice. They are your guardrails."},{"q":"You want Claude to always respond in a specific JSON schema. Which component handles this?","options":["Identity","Format","Tone","Constraints"],"correct":1,"explanation":"Format blocks define response structure — JSON schemas, markdown templates, numbered lists, and other output shapes. For production APIs, this is the most critical component."},{"q":"A developer writes a 5,000-word system prompt covering every edge case. What is likely to happen?","options":["Claude follows every instruction perfectly","Later instructions dilute earlier ones — Claude starts ignoring some rules","Claude refuses to respond to such a long prompt","The API rejects prompts over 1,000 words"],"correct":1,"explanation":"System prompt stuffing is an anti-pattern. After ~500-1000 words, each additional instruction dilutes the importance of the others. Focus on the 5-10 most important rules and trust Claude to handle edge cases."},{"q":"Should you put task instructions in the system prompt or user message?","options":["Always in the system prompt","Always in the user message","Persistent rules in system prompt, per-turn tasks in user message","It makes no difference"],"correct":2,"explanation":"System prompt = persistent identity and rules that apply to every message. User message = specific task for this turn. This separation lets you maintain consistent behavior while varying the task."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 4 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
