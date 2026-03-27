---
title: "Prompt Game"
course: "claude-mastery"
order: 7
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div><div id="particles"></div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 7 · Game</div>
<h1>Prompt Engineering Game</h1>
<p>5 challenges. Craft the perfect prompt. Earn your score.</p>
<div class="lesson-meta-bar">⏱ <span>90 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.9rem;color:#a1a1aa;line-height:1.6">
<strong style="color:#8b5cf6">How scoring works:</strong> Your prompt is checked for <strong>relevant keywords</strong> that indicate good prompt engineering (e.g., specifying format, audience, constraints). Each keyword found earns you points proportional to the challenge total (100 pts max). Longer prompts earn a small length bonus (+5 at 50 chars, +5 more at 100). Using a hint costs 10 points. Score 70+ on consecutive challenges to build a <strong>streak multiplier</strong> for bonus points.
</div>

<div class="game-hud">
<div class="hud-item"><div class="hud-label">Level</div><div class="hud-value hud-level" id="hudLevel">1/5</div></div>
<div class="hud-item"><div class="hud-label">Score</div><div class="hud-value hud-score" id="hudScore">0</div></div>
<div class="hud-item"><div class="hud-label">Streak</div><div class="hud-value hud-streak" id="hudStreak">0x</div></div>
<div class="hud-item"><div class="hud-label">Best</div><div class="hud-value hud-timer" id="hudBest">—</div></div>
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

<div data-learn="FlashDeck" data-props='{"title":"Prompt Engineering Techniques","cards":[{"front":"Haiku format specification","back":"Specify exact syllable structure (5-7-5) AND the required word. Ambiguous format instructions lead to off-spec outputs."},{"front":"JSON-only output prompt","back":"Tell Claude to output ONLY JSON with no explanation and no markdown code blocks. Define the exact field names you want."},{"front":"Tone transformation","back":"Specify the target tone, the target audience, and any honesty constraints — e.g., optimistic for investors without fabricating data."},{"front":"Constrained code review","back":"Request ONLY bullet points with NO corrected code and a max of one sentence per issue. Format constraints prevent over-verbose responses."},{"front":"Persona lock","back":"Set up a persistent character in the system prompt, include always stay in character, and instruct Claude to maintain accuracy despite the persona."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Prompt Engineering Challenge Review","questions":[{"q":"You want Claude to output ONLY a valid JSON object from a sentence, no prose, no markdown. Which instruction set is correct?","options":["Parse this sentence","Convert to JSON format please","Output ONLY valid JSON. No explanation. No markdown code blocks. Fields: name, age, city, occupation.","Give me the JSON if possible"],"correct":2,"explanation":"You need three things: ONLY keyword to suppress prose, no explanation to prevent narration, and no markdown to prevent code fences. Specifying exact field names removes ambiguity."},{"q":"What keyword signals score the most on haiku challenge prompts?","options":["please, thanks, quickly","haiku, 5-7-5, syllable, code, programming","write, poem, short","rhyme, verse, stanza"],"correct":1,"explanation":"Good haiku prompts explicitly name the format (haiku), the syllable structure (5-7-5), the required topic (programming), and the required word (code). Each of these signals good prompt engineering."},{"q":"For the tone transformer challenge, what is the key constraint that separates good prompts from great ones?","options":["Using more formal vocabulary","Specifying the target audience (investors)","Adding the honesty constraint — optimistic without lying or fabricating","Making the rewrite shorter"],"correct":2,"explanation":"Specifying both the tone AND the honesty constraint (optimistic but truthful, without fabricating data) is what makes a tone prompt production-safe and trustworthy."},{"q":"To build a reliable persona that stays in character across all follow-ups, what system prompt element is essential?","options":["A very long backstory","Always stay in character as an explicit instruction","Using high temperature","Ending with a question"],"correct":1,"explanation":"Always stay in character is the critical anchor phrase. Without an explicit persistence instruction, Claude may break character when asked factual questions or faced with unusual inputs."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match the Challenge to Its Key Technique","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Haiku Generator","right":"Specify 5-7-5 and required word explicitly"},{"left":"JSON Formatter","right":"ONLY JSON, no explanation, no markdown"},{"left":"Tone Transformer","right":"Target audience plus honesty constraint"},{"left":"Code Reviewer","right":"ONLY bullet points, no corrected code"},{"left":"Persona Lock","right":"Always stay in character instruction"}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 7 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
