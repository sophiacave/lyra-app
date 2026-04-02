---
title: "Prompt Game"
course: "claude-mastery"
order: 7
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/claude-mastery/">Claude Mastery</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Prompt Engineering Game</h1>
  <p class="sub">5 real-world challenges. Craft production-quality prompts. Earn your score.</p>
</div>

<div class="content">
<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.6">
<strong style="color:#8b5cf6">How scoring works:</strong> Your prompt is checked for <strong>relevant keywords</strong> that indicate good prompt engineering (e.g., specifying format, audience, constraints). Each keyword found earns you points proportional to the challenge total (100 pts max). Longer prompts earn a small length bonus (+5 at 50 chars, +5 more at 100). Using a hint costs 10 points. Score 70+ on consecutive challenges to build a <strong>streak multiplier</strong> for bonus points.
</div>

<div class="card">
<h2>Before You Play: The Prompt Engineering Toolkit</h2>
<p>These are the techniques you have learned so far. Each challenge tests one or more of these skills in a real-world context:</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:.75rem">
<div style="padding:.75rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6;font-size:.82rem">System Prompts</strong>
<p style="font-size:.78rem;color:#a1a1aa;margin:.3rem 0 0">Identity + Constraints + Format + Tone + Examples</p>
</div>
<div style="padding:.75rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.82rem">Chain-of-Thought</strong>
<p style="font-size:.78rem;color:#a1a1aa;margin:.3rem 0 0">"Think step by step" + structured reasoning + XML tags</p>
</div>
<div style="padding:.75rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.82rem">Few-Shot Examples</strong>
<p style="font-size:.78rem;color:#a1a1aa;margin:.3rem 0 0">Input/output pairs that teach pattern and format</p>
</div>
<div style="padding:.75rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.82rem">Format Control</strong>
<p style="font-size:.78rem;color:#a1a1aa;margin:.3rem 0 0">JSON-only, markdown, structured output, field names</p>
</div>
</div>
</div>

<div class="game-hud">
<div class="hud-item"><div class="hud-label">Level</div><div class="hud-value hud-level" id="hudLevel">1/5</div></div>
<div class="hud-item"><div class="hud-label">Score</div><div class="hud-value hud-score" id="hudScore">0</div></div>
<div class="hud-item"><div class="hud-label">Streak</div><div class="hud-value hud-streak" id="hudStreak">0x</div></div>
<div class="hud-item"><div class="hud-label">Best</div><div class="hud-value hud-timer" id="hudBest">--</div></div>
</div>

<div id="challengeContainer"></div>
<div class="result-card" id="resultCard"></div>

<div class="card" id="finalResults" style="display:none">
<h2>Game Complete!</h2>
<div style="text-align:center;padding:2rem 0">
<div style="font-size:4rem;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent" id="totalScore">0</div>
<div id="starDisplay" style="font-size:2rem;margin:.5rem 0"></div>
<div style="color:#a1a1aa;margin-bottom:2rem" id="totalMsg">points</div>
</div>
<div class="leaderboard" id="leaderboard"><h3 style="font-size:.9rem;color:#71717a;margin-bottom:.75rem">YOUR SCORES</h3></div>
</div>

<div class="card">
<h2>Expert Solutions — Study After Playing</h2>
<p>After you have completed all 5 challenges, study these expert-level prompts. Compare them to yours and notice the patterns:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Challenge 1: Haiku Format</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0;font-family:'JetBrains Mono',monospace">"Write a haiku about programming. The haiku MUST follow the 5-7-5 syllable structure exactly. Include the word 'code' in the poem."</p>
<p style="font-size:.75rem;color:#71717a;margin:.4rem 0 0">Why it works: Specifies format (haiku), constraint (5-7-5), required content (code), and domain (programming). Every keyword adds precision.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Challenge 2: JSON Output</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0;font-family:'JetBrains Mono',monospace">"Extract the person's information from this sentence and output ONLY valid JSON. No explanation. No markdown code blocks. Use exactly these fields: name, age, city, occupation."</p>
<p style="font-size:.75rem;color:#71717a;margin:.4rem 0 0">Why it works: "ONLY" suppresses prose. "No explanation, no markdown" prevents wrapping. Exact field names ensure parseable output.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Challenge 3: Tone Transformation</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0;font-family:'JetBrains Mono',monospace">"Rewrite this quarterly report summary in an optimistic, confident tone suitable for investors. Keep all factual data accurate — do not fabricate or exaggerate numbers. Focus on growth opportunities."</p>
<p style="font-size:.75rem;color:#71717a;margin:.4rem 0 0">Why it works: Specifies tone (optimistic), audience (investors), AND honesty constraint (no fabrication). The honesty constraint is what separates good from great.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Challenge 4: Constrained Code Review</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0;font-family:'JetBrains Mono',monospace">"Review this code for bugs. Output ONLY bullet points listing issues found. Maximum one sentence per issue. Do NOT provide corrected code. Tag each issue as [CRITICAL], [WARNING], or [INFO]."</p>
<p style="font-size:.75rem;color:#71717a;margin:.4rem 0 0">Why it works: Format (bullets), constraint (no corrected code, one sentence), severity tagging. Prevents the verbose "here's the fixed version" that wastes tokens.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">Challenge 5: Persona Lock</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0;font-family:'JetBrains Mono',monospace">"You are Professor Oak, a world-renowned expert on AI and machine learning. Always stay in character. Answer questions about AI from Professor Oak's perspective. Maintain scientific accuracy while being warm and approachable."</p>
<p style="font-size:.75rem;color:#71717a;margin:.4rem 0 0">Why it works: Clear identity, persistence instruction ("always stay in character"), domain lock (AI/ML), and dual tone directive (accurate + approachable).</p>
</div>
</div>
</div>

<div class="card">
<h2>Turning Game Prompts Into Production Code</h2>
<p>Every challenge in this game maps directly to a production use case. Here is how Challenge 2 (JSON extraction) looks as real API code:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — the JSON challenge as production code</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> json, anthropic

client = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">extract_person</span>(sentence: str) -> dict:
    <span style="color:#fb923c">"""Extract structured data from natural language."""</span>
    response = client.messages.create(
        model=<span style="color:#fbbf24">"claude-haiku-4-5-20251001"</span>,
        max_tokens=<span style="color:#fb923c">150</span>,
        temperature=<span style="color:#fb923c">0</span>,
        system=(
            <span style="color:#fbbf24">"Extract person information from text. "</span>
            <span style="color:#fbbf24">"Output ONLY valid JSON with these fields: "</span>
            <span style="color:#fbbf24">"name, age, city, occupation. "</span>
            <span style="color:#fbbf24">"No explanation. No markdown."</span>
        ),
        messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: sentence}]
    )
    <span style="color:#c084fc">return</span> json.loads(response.content[<span style="color:#fb923c">0</span>].text)

result = extract_person(
    <span style="color:#fbbf24">"Sarah, a 28-year-old graphic designer from Portland."</span>
)
<span style="color:#34d399">print</span>(result)
<span style="color:#71717a"># {'name': 'Sarah', 'age': 28, 'city': 'Portland',</span>
<span style="color:#71717a">#  'occupation': 'graphic designer'}</span></code></pre>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Prompt Engineering Techniques","cards":[{"front":"Haiku format specification","back":"Specify exact syllable structure (5-7-5) AND the required word. Ambiguous format instructions lead to off-spec outputs. Name the format, define the constraints, specify required content."},{"front":"JSON-only output prompt","back":"Tell Claude to output ONLY JSON with no explanation and no markdown code blocks. Define the exact field names you want. Use temperature=0 and low max_tokens for consistency."},{"front":"Tone transformation","back":"Specify the target tone, the target audience, and any honesty constraints — e.g., optimistic for investors without fabricating data. The honesty constraint is what makes it production-safe."},{"front":"Constrained code review","back":"Request ONLY bullet points with NO corrected code and a max of one sentence per issue. Add severity tags [CRITICAL/WARNING/INFO]. Format constraints prevent over-verbose responses."},{"front":"Persona lock","back":"Set a persistent character identity with \"always stay in character\" as an explicit instruction. Combine with domain accuracy requirements so the persona doesn\u0027t compromise factual correctness."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Prompt Engineering Challenge Review","questions":[{"q":"You want Claude to output ONLY a valid JSON object from a sentence, no prose, no markdown. Which instruction set is correct?","options":["Parse this sentence","Convert to JSON format please","Output ONLY valid JSON. No explanation. No markdown code blocks. Fields: name, age, city, occupation.","Give me the JSON if possible"],"correct":2,"explanation":"You need three things: ONLY keyword to suppress prose, no explanation to prevent narration, and no markdown to prevent code fences. Specifying exact field names removes ambiguity. This is directly usable in production code."},{"q":"For the tone transformer challenge, what constraint separates good prompts from great ones?","options":["Using more formal vocabulary","Specifying the target audience (investors)","Adding the honesty constraint — optimistic without lying or fabricating","Making the rewrite shorter"],"correct":2,"explanation":"Specifying both the tone AND the honesty constraint (optimistic but truthful, without fabricating data) is what makes a tone prompt production-safe. Without the honesty constraint, Claude might exaggerate numbers to match the requested tone."},{"q":"You want Claude to review code but NOT show the corrected version. What is the key constraint?","options":["Set temperature to 0","Say please only show issues","Explicitly state: do NOT provide corrected code, output ONLY bullet points","Use Haiku instead of Sonnet"],"correct":2,"explanation":"Claude defaults to being helpful — which means it will try to fix the code for you. You need an explicit negative constraint (do NOT provide corrected code) combined with a positive format directive (ONLY bullet points) to override this default."},{"q":"To build a reliable persona that stays in character across all follow-ups, what system prompt element is essential?","options":["A very long backstory","Always stay in character as an explicit instruction","Using high temperature","Ending with a question"],"correct":1,"explanation":"Always stay in character is the critical anchor phrase. Without an explicit persistence instruction, Claude may break character when asked factual questions or faced with unusual inputs."}]}'></div>


</div>

<div class="progress-footer">
<span class="progress-label">Lesson 7 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
