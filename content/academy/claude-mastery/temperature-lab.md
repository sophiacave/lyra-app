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
<p>Master the creativity dial — understand how temperature shapes AI output, with real API examples</p>
<div class="lesson-meta-bar">⏱ <span>60 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 1</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Temperature?</h2>
<p>Temperature controls the <strong>randomness</strong> of an AI's output. It is a number between 0 and 1 that you pass with every API call. At temperature 0, the model always picks the most probable next word — making it deterministic and precise. At temperature 1, it samples from a wider distribution of possibilities — making it creative and unpredictable.</p>

<p>Technically, temperature scales the logits (raw probability scores) before the model picks the next token. Lower temperature sharpens the probability distribution — the most likely token becomes overwhelmingly dominant. Higher temperature flattens it — less likely tokens get a real chance of being selected. The result: lower temperature produces consistent, predictable text; higher temperature produces varied, surprising text.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Important:</strong> Temperature does not make the model "smarter" or "dumber." It changes the <em>selection strategy</em>, not the model's knowledge. A temperature 0 response is not "better" than a temperature 1 response — it is more <em>predictable</em>. The right temperature depends entirely on your use case.
</div>

<div class="spectrum-bar">
<div class="spectrum-section" id="spec0" style="background:rgba(56,189,248,.3);color:#38bdf8">0.0<br>Precise</div>
<div class="spectrum-section" id="spec1" style="background:rgba(139,92,246,.3);color:#8b5cf6">0.25<br>Focused</div>
<div class="spectrum-section" id="spec2" style="background:rgba(139,92,246,.3);color:#c084fc">0.5<br>Balanced</div>
<div class="spectrum-section" id="spec3" style="background:rgba(251,146,60,.3);color:#fb923c">0.75<br>Creative</div>
<div class="spectrum-section" id="spec4" style="background:rgba(248,113,113,.3);color:#f87171">1.0<br>Wild</div>
</div>
</div>

<div class="card">
<h2>Temperature in the API</h2>
<p>Temperature is a single parameter in the API call. Here is how to use it:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — temperature parameter</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">generate</span>(prompt: str, temperature: float = <span style="color:#fb923c">1.0</span>) -> str:
    <span style="color:#fb923c">"""Generate a response at a specific temperature."""</span>
    response = client.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
        max_tokens=<span style="color:#fb923c">300</span>,
        temperature=temperature,  <span style="color:#71717a"># 0.0 to 1.0</span>
        messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: prompt}]
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text

<span style="color:#71717a"># Same prompt, different temperatures</span>
prompt = <span style="color:#fbbf24">"Name a product that helps people sleep better."</span>

<span style="color:#71717a"># Temperature 0 — always the same answer</span>
<span style="color:#34d399">print</span>(generate(prompt, temperature=<span style="color:#fb923c">0.0</span>))
<span style="color:#71717a"># → "SleepWell" (every time, deterministic)</span>

<span style="color:#34d399">print</span>(generate(prompt, temperature=<span style="color:#fb923c">0.0</span>))
<span style="color:#71717a"># → "SleepWell" (identical — temperature 0 is reproducible)</span>

<span style="color:#71717a"># Temperature 0.8 — different each time</span>
<span style="color:#34d399">print</span>(generate(prompt, temperature=<span style="color:#fb923c">0.8</span>))
<span style="color:#71717a"># → "DreamDrift" (creative, varied)</span>

<span style="color:#34d399">print</span>(generate(prompt, temperature=<span style="color:#fb923c">0.8</span>))
<span style="color:#71717a"># → "NightHaven" (different answer each time)</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">curl — temperature in the raw API</div>
<pre style="margin:0;color:#e5e5e5"><code>curl https://api.anthropic.com/v1/messages \
  -H <span style="color:#fbbf24">"x-api-key: $ANTHROPIC_API_KEY"</span> \
  -H <span style="color:#fbbf24">"anthropic-version: 2023-06-01"</span> \
  -H <span style="color:#fbbf24">"content-type: application/json"</span> \
  -d <span style="color:#fbbf24">'{
    "model": "claude-sonnet-4-6",
    "max_tokens": 300,
    "temperature": 0.0,
    "messages": [
      {"role": "user", "content": "Classify this email as spam or not: You won a free iPhone!"}
    ]
  }'</span></code></pre>
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
<div><strong style="color:#38bdf8">Temperature 0</strong><p style="font-size:.85rem;margin:0">Code generation, data extraction, math, factual Q&A, classification, JSON output. When you need consistency and reproducibility. <strong>If you run the same prompt twice and want the same answer, use 0.</strong></p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<div style="font-size:1.5rem">⚖️</div>
<div><strong style="color:#8b5cf6">Temperature 0.3-0.5</strong><p style="font-size:.85rem;margin:0">General conversation, summarization, editing, analysis. Good balance of reliability and naturalness. Most chatbots use this range.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<div style="font-size:1.5rem">🎨</div>
<div><strong style="color:#fb923c">Temperature 0.7-0.8</strong><p style="font-size:.85rem;margin:0">Creative writing, brainstorming, marketing copy, poetry. When you want variety and surprise. Run the same prompt 5 times and you'll get 5 different creative angles.</p></div>
</div>
<div style="display:flex;gap:1rem;padding:1rem;background:rgba(248,113,113,.05);border-radius:10px;border:1px solid rgba(248,113,113,.1)">
<div style="font-size:1.5rem">🔥</div>
<div><strong style="color:#f87171">Temperature 0.9-1.0</strong><p style="font-size:.85rem;margin:0">Experimental writing, wild brainstorming, artistic exploration. Output may become incoherent — less likely tokens get selected, producing unexpected word choices. Use sparingly.</p></div>
</div>
</div>
</div>

<div class="card">
<h2>Temperature + Top-P: The Full Picture</h2>
<p>Temperature is not the only sampling parameter. Claude also supports <strong>top_p</strong> (nucleus sampling), which limits the token pool to the smallest set whose cumulative probability exceeds a threshold.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8;font-size:.85rem">Temperature</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Scales all probabilities. Lower = sharper distribution, higher = flatter. Affects how the model weights its options.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c;font-size:.85rem">Top-P (Nucleus Sampling)</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Cuts off low-probability tokens entirely. top_p=0.9 means "only consider tokens in the top 90% of probability mass." Prevents rare, incoherent tokens.</p>
</div>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — combining temperature and top_p</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># For creative tasks: high temperature + moderate top_p</span>
<span style="color:#71717a"># This gives variety while preventing total nonsense</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">500</span>,
    temperature=<span style="color:#fb923c">0.8</span>,    <span style="color:#71717a"># creative sampling</span>
    top_p=<span style="color:#fb923c">0.9</span>,           <span style="color:#71717a"># but cut off the truly wild tokens</span>
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Write 5 taglines for a coffee shop called 'The Grind'."</span>
    }]
)

<span style="color:#71717a"># For deterministic tasks: temperature 0 (top_p doesn't matter)</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">100</span>,
    temperature=<span style="color:#fb923c">0.0</span>,    <span style="color:#71717a"># deterministic — always same output</span>
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Classify: 'Your package has been delayed.' → [urgent/normal/spam]"</span>
    }]
)
<span style="color:#71717a"># → "normal" (every single time)</span></code></pre>
</div>

<div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:12px;padding:1rem;margin-top:1rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#fb923c">Pro tip:</strong> Anthropic recommends using <em>either</em> temperature or top_p, not both at once. If you set temperature=0, top_p is irrelevant (the model always picks the single most probable token). For most use cases, temperature alone is sufficient.
</div>
</div>

<div class="card">
<h2>Common Temperature Mistakes</h2>
<p>These are the mistakes that trip up even experienced developers:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Using high temperature for code generation</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Temperature 0.7+ introduces random token choices into syntax, variable names, and logic. The result: code that looks creative but has subtle bugs. Always use temperature 0 for code.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Using temperature 0 for creative writing</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Temperature 0 always picks the most probable token. For creative tasks, this produces generic, predictable text. "The sun set over the horizon" instead of something surprising. Bump to 0.7-0.8.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Thinking temperature affects intelligence</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">It does not. Temperature only changes the selection strategy. A temperature 0 response uses the same model knowledge as temperature 1 — just with different randomness in word choice.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Not setting temperature at all</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Claude's default temperature is 1.0, which is more random than most use cases need. For production applications, always set temperature explicitly. A common starting point is 0.3 for general tasks.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Temperature Concepts","cards":[{"front":"Temperature","back":"A parameter (0.0-1.0) controlling the randomness of AI output. 0 = deterministic and precise (always picks most probable token). 1 = creative and unpredictable (samples from wider distribution). Claude default is 1.0."},{"front":"Temperature 0","back":"The model always picks the most probable next token. Produces identical output for the same input every time. Best for code, classification, extraction, and factual Q&A. If reproducibility matters, use 0."},{"front":"Temperature 0.3-0.5","back":"A balanced range good for conversation, summarization, editing, and analysis. Reliable output with natural variation. Most production chatbots use this range."},{"front":"Top-P (Nucleus Sampling)","back":"Alternative sampling parameter. top_p=0.9 means only consider tokens in the top 90% of probability mass. Prevents rare, incoherent tokens. Anthropic recommends using either temperature OR top_p, not both."},{"front":"Claude default temperature","back":"1.0 — the maximum. This is more random than most use cases need. For production applications, always set temperature explicitly. Common starting points: 0.0 for code/classification, 0.3 for general tasks, 0.7-0.8 for creative writing."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"Temperature Decisions","questions":[{"q":"You are building a function that classifies customer emails as urgent or not urgent. What temperature should you use?","options":["0.0 — needs deterministic, consistent results","0.5 — balanced is best","0.8 — some creativity helps","1.0 — maximum variation"],"correct":0,"explanation":"Classification tasks require consistency and reproducibility. Temperature 0 ensures the model always picks the most probable classification — not a creative one. Running the same email through twice should give the same result."},{"q":"You want Claude to help brainstorm 20 different campaign slogans. What temperature range fits best?","options":["0.0 — precise answers only","0.1-0.2 — slightly flexible","0.7-0.8 — creative variety","Temperature does not affect brainstorming"],"correct":2,"explanation":"Temperature 0.7-0.8 introduces enough randomness to generate varied, surprising ideas — exactly what brainstorming needs. Each generation will produce different slogans, giving you a wide creative spread."},{"q":"What is Claude\u0027s default temperature if you do not set it explicitly?","options":["0.0 — deterministic by default","0.5 — balanced by default","0.7 — creative by default","1.0 — maximum randomness by default"],"correct":3,"explanation":"Claude\u0027s default temperature is 1.0 — maximum randomness. This surprises many developers who expect a conservative default. For production applications, always set temperature explicitly to get predictable behavior."},{"q":"A developer sets temperature to 0.9 for a code generation task and gets buggy output. Why?","options":["The model is too smart for the task","High temperature introduces random token choices into syntax and logic","The API key has expired","Temperature 0.9 disables code generation"],"correct":1,"explanation":"High temperature causes the model to occasionally select less probable tokens. In creative writing, this produces interesting variety. In code, it produces subtle bugs — wrong variable names, incorrect operators, broken syntax. Always use temperature 0 for code."}]}'></div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 3 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 1</span>
</div>
</div>
