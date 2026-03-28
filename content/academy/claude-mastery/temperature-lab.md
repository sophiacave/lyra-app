---
title: "Temperature Lab"
course: "claude-mastery"
order: 3
type: "lab"
free: true
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 3 · Lab</div>
<h1>Temperature Lab</h1>
<p>See how temperature transforms AI output from precise to creative</p>
<div class="lesson-meta-bar">⏱ <span>60 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Temperature?</h2>
<p>Temperature controls the <strong>randomness</strong> of an AI's output. At temperature 0, the model always picks the most probable next word — making it deterministic and precise. At temperature 1, it considers a wider range of possibilities — making it creative and unpredictable.</p>
<div class="spectrum-bar">
<div class="spectrum-section" id="spec0" style="background:rgba(56,189,248,.3);color:#38bdf8">0.0<br>Precise</div>
<div class="spectrum-section" id="spec1" style="background:rgba(139,92,246,.3);color:#8b5cf6">0.25<br>Focused</div>
<div class="spectrum-section" id="spec2" style="background:rgba(139,92,246,.3);color:#c084fc">0.5<br>Balanced</div>
<div class="spectrum-section" id="spec3" style="background:rgba(251,146,60,.3);color:#fb923c">0.75<br>Creative</div>
<div class="spectrum-section" id="spec4" style="background:rgba(248,113,113,.3);color:#f87171">1.0<br>Wild</div>
</div>
</div>

<div class="card">
<h2>Temperature Playground</h2>
<p>Adjust the temperature slider and generate outputs to see the difference in real-time.</p>

<div class="temp-display">
<div class="temp-value" id="tempVal">0.50</div>
<div class="temp-label" id="tempLabel">Balanced</div>
</div>

<div class="slider-container">
<input type="range" id="tempSlider" min="0" max="100" value="50" oninput="updateTemp()">
<div class="slider-labels">
<span>0.0 — Deterministic</span>
<span>0.5 — Balanced</span>
<span>1.0 — Maximum Creativity</span>
</div>
</div>

<p style="font-size:.9rem;margin-top:1rem">Choose a prompt:</p>
<div class="prompt-selector">
<button class="prompt-btn active" onclick="selectPrompt(0,this)">Write a product name</button>
<button class="prompt-btn" onclick="selectPrompt(1,this)">Describe a sunset</button>
<button class="prompt-btn" onclick="selectPrompt(2,this)">Explain gravity</button>
<button class="prompt-btn" onclick="selectPrompt(3,this)">Write a story opener</button>
</div>

<button class="gen-btn" id="genBtn" onclick="generate()">Generate at Current Temperature</button>

<div class="output-grid">
<div class="output-box">
<div class="output-label" style="color:#38bdf8">🧊 Low Temperature (0.0-0.3)</div>
<div class="output-text" id="outLow">Click generate to see output...</div>
</div>
<div class="output-box">
<div class="output-label" style="color:#f87171">🔥 High Temperature (0.7-1.0)</div>
<div class="output-text" id="outHigh">Click generate to see output...</div>
</div>
</div>
</div>

<div class="card">
<h2>When to Use Each Temperature</h2>
<div style="display:grid;gap:1rem;margin-top:1rem">
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(56,189,248,.05);border-radius:10px;border:1px solid rgba(56,189,248,.1)">
<div style="font-size:1.5rem">🧊</div>
<div><strong style="color:#38bdf8">Temperature 0</strong><p style="font-size:.85rem;margin:0">Code generation, data extraction, math, factual Q&A, classification. When you need consistency and accuracy.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<div style="font-size:1.5rem">⚖️</div>
<div><strong style="color:#8b5cf6">Temperature 0.3-0.5</strong><p style="font-size:.85rem;margin:0">General conversation, summarization, editing, analysis. Good balance of reliability and naturalness.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<div style="font-size:1.5rem">🎨</div>
<div><strong style="color:#fb923c">Temperature 0.7-0.8</strong><p style="font-size:.85rem;margin:0">Creative writing, brainstorming, marketing copy, poetry. When you want variety and surprise.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(248,113,113,.05);border-radius:10px;border:1px solid rgba(248,113,113,.1)">
<div style="font-size:1.5rem">🔥</div>
<div><strong style="color:#f87171">Temperature 0.9-1.0</strong><p style="font-size:.85rem;margin:0">Experimental writing, wild brainstorming, artistic exploration. Output may be incoherent — use sparingly!</p></div>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Temperature Concepts","cards":[{"front":"Temperature","back":"A parameter controlling the randomness of AI output. 0 = deterministic and precise. 1 = creative and unpredictable."},{"front":"Temperature 0","back":"The model always picks the most probable next token. Produces identical output for the same input every time. Best for code, classification, and factual Q&A."},{"front":"Temperature 0.3-0.5","back":"A balanced range good for conversation, summarization, editing, and analysis. Reliable output with natural variation."},{"front":"Temperature 0.7-0.8","back":"The creative sweet spot. Generates varied, surprising ideas. Best for brainstorming, marketing copy, and creative writing."},{"front":"Temperature 1.0","back":"Maximum randomness. Output may become incoherent. Use sparingly for experimental or artistic exploration only."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match Temperature to Use Case","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Temperature 0","right":"Code generation and data extraction"},{"left":"Temperature 0.3-0.5","right":"Conversation, editing, analysis"},{"left":"Temperature 0.7-0.8","right":"Creative writing and brainstorming"},{"left":"Temperature 0.9-1.0","right":"Experimental and artistic exploration"},{"left":"Temperature controls","right":"Randomness of output selection"}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Temperature Decisions","questions":[{"q":"You are building a function that classifies customer emails as urgent or not urgent. What temperature should you use?","options":["0.0 — needs deterministic, consistent results","0.5 — balanced is best","0.8 — some creativity helps","1.0 — maximum variation"],"correct":0,"explanation":"Classification tasks require consistency. Temperature 0 ensures you always get the most probable, reliable answer — not a creative one."},{"q":"You want Claude to help brainstorm 20 different campaign slogans. What temperature range fits best?","options":["0.0 — precise answers only","0.1-0.2 — slightly flexible","0.7-0.8 — creative variety","Temperature does not affect brainstorming"],"correct":2,"explanation":"Temperature 0.7-0.8 introduces enough randomness to generate varied, surprising ideas — exactly what brainstorming needs."},{"q":"What happens at temperature 0?","options":["The model refuses to answer","The model always picks the most probable next token — deterministic output","The model generates completely random text","The model becomes slower but more accurate"],"correct":1,"explanation":"At temperature 0, the model is fully deterministic — it always picks the highest-probability next token, producing the same output for the same input every time."}]}'></div>

<div data-learn="SortStack" data-props='{"title":"Order Temperatures from Most Precise to Most Creative","instruction":"Arrange these temperature settings from most deterministic (top) to most creative (bottom)","items":["Temperature 0.0 — Deterministic","Temperature 0.25 — Focused","Temperature 0.5 — Balanced","Temperature 0.75 — Creative","Temperature 1.0 — Wild"]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 3 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
