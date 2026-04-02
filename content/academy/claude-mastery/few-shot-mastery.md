---
title: "Few-Shot Prompting"
course: "claude-mastery"
order: 6
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 6 · Builder</div>
<h1>Few-Shot Mastery</h1>
<p>Teach Claude any pattern with examples — from classification to structured extraction, with production code</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Few-Shot Prompting?</h2>
<p>Few-shot prompting means giving Claude a few examples of the input-output pattern you want, then letting it generalize to new inputs. It is teaching by showing rather than explaining — and it works remarkably well because Claude can infer complex patterns from just 2-3 examples.</p>

<p>This is distinct from <strong>zero-shot</strong> prompting (no examples, just instructions) and <strong>one-shot</strong> prompting (a single example). For most tasks, 3-5 examples hits the sweet spot: enough to disambiguate the pattern without wasting context tokens.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Key insight:</strong> Few-shot examples are often more powerful than written instructions. Saying "classify sentiment as positive, negative, or neutral" is ambiguous — does "The acting was great but the plot was terrible" count as positive, negative, or neutral? An example resolves this ambiguity instantly.
</div>

<div class="visual-diagram">
<div class="visual-step">
<div class="step-icon" style="background:rgba(251,146,60,.15);color:#fb923c">1</div>
<div class="step-text"><strong>Example 1: Input -> Output</strong><span>Claude observes the first pattern</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(139,92,246,.15);color:#8b5cf6">2</div>
<div class="step-text"><strong>Example 2: Input -> Output</strong><span>Pattern recognition strengthens</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(56,189,248,.15);color:#38bdf8">3</div>
<div class="step-text"><strong>Example 3: Input -> Output</strong><span>Claude deeply understands the pattern</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(52,211,153,.15);color:#34d399">4</div>
<div class="step-text"><strong>New Input -> Claude generates correct output!</strong><span>Pattern is applied to novel inputs</span></div>
</div>
</div>
</div>

<div class="card">
<h2>Zero-Shot vs. Few-Shot — Side by Side</h2>
<p>Here is the same task done both ways. Notice how few-shot produces more consistent, predictable output:</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#f87171;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Zero-shot (instructions only)</div>
<pre style="margin:0;color:#e5e5e5"><code>Classify this review's sentiment
as positive, negative, or neutral.

Review: "Decent food but the
service was painfully slow."

<span style="color:#71717a"># Claude might say:</span>
<span style="color:#71717a"># "Negative" or "Mixed" or</span>
<span style="color:#71717a"># "The sentiment is primarily</span>
<span style="color:#71717a">#  negative with a positive</span>
<span style="color:#71717a">#  element..." (verbose)</span></code></pre>
</div>
<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#34d399;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Few-shot (with examples)</div>
<pre style="margin:0;color:#e5e5e5"><code>Review: "Loved every minute!"
Sentiment: Positive

Review: "Worst meal I've ever had."
Sentiment: Negative

Review: "It was fine, nothing special."
Sentiment: Neutral

Review: "Decent food but the
service was painfully slow."
Sentiment: <span style="color:#34d399">Negative</span>
<span style="color:#71717a"># Consistent one-word answer</span>
<span style="color:#71717a"># matching the example format</span></code></pre>
</div>
</div>
<p style="font-size:.82rem;color:#71717a;margin-top:.5rem">The few-shot version produces exactly the format you showed — a single word. The zero-shot version might give a paragraph of analysis. Few-shot teaches both the <em>logic</em> and the <em>format</em>.</p>
</div>

<div class="card">
<h2>Few-Shot in the API</h2>
<p>In the Claude API, few-shot examples go in the messages array as alternating user/assistant turns. Claude sees them as a conversation history and continues the pattern:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — few-shot sentiment classifier</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">classify_sentiment</span>(review: str) -> str:
    <span style="color:#fb923c">"""Classify a review as Positive, Negative, or Neutral."""</span>
    response = client.messages.create(
        model=<span style="color:#fbbf24">"claude-haiku-4-5-20251001"</span>,  <span style="color:#71717a"># haiku for classification</span>
        max_tokens=<span style="color:#fb923c">10</span>,       <span style="color:#71717a"># we only need one word</span>
        temperature=<span style="color:#fb923c">0</span>,       <span style="color:#71717a"># deterministic</span>
        system=<span style="color:#fbbf24">"Classify the sentiment of each review as exactly one word: Positive, Negative, or Neutral."</span>,
        messages=[
            <span style="color:#71717a"># Few-shot examples</span>
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"The movie was absolutely fantastic!"</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Positive"</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"I wasted two hours on this terrible film."</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Negative"</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"It was okay, nothing special."</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Neutral"</span>},
            <span style="color:#71717a"># The real input</span>
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: review},
        ]
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fb923c">0</span>].text.strip()

<span style="color:#71717a"># Use it</span>
<span style="color:#34d399">print</span>(classify_sentiment(<span style="color:#fbbf24">"Great acting but terrible plot"</span>))  <span style="color:#71717a"># → Negative</span>
<span style="color:#34d399">print</span>(classify_sentiment(<span style="color:#fbbf24">"A masterpiece of modern cinema"</span>))  <span style="color:#71717a"># → Positive</span>
<span style="color:#34d399">print</span>(classify_sentiment(<span style="color:#fbbf24">"Meh"</span>))                             <span style="color:#71717a"># → Neutral</span></code></pre>
</div>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1rem;margin-top:1rem;font-size:.82rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Notice:</strong> We use Haiku for classification — it is 4x cheaper than Sonnet and plenty smart for this task. We set max_tokens=10 because we only need one word. We set temperature=0 for deterministic output. These small optimizations add up at scale.
</div>
</div>

<div class="card">
<h2>Few-Shot for Structured Extraction</h2>
<p>Few-shot is not just for classification. It is powerful for teaching Claude any output format — including complex structured extraction:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — few-shot structured extraction</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> json

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">extract_event</span>(text: str) -> dict:
    <span style="color:#fb923c">"""Extract event details from natural language text."""</span>
    response = client.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
        max_tokens=<span style="color:#fb923c">200</span>,
        temperature=<span style="color:#fb923c">0</span>,
        messages=[
            <span style="color:#71717a"># Example 1</span>
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Let's meet for coffee at Blue Bottle on Tuesday at 3pm."</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">'{"event":"Coffee meeting","location":"Blue Bottle","day":"Tuesday","time":"3:00 PM"}'</span>},
            <span style="color:#71717a"># Example 2</span>
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Team standup is every morning at 9 in the main conference room."</span>},
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>, <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">'{"event":"Team standup","location":"Main conference room","day":"Daily","time":"9:00 AM"}'</span>},
            <span style="color:#71717a"># Real input</span>
            {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: text},
        ]
    )
    <span style="color:#c084fc">return</span> json.loads(response.content[<span style="color:#fb923c">0</span>].text)

result = extract_event(<span style="color:#fbbf24">"Dentist appointment next Friday at 2:30, Dr. Lee's office."</span>)
<span style="color:#34d399">print</span>(result)
<span style="color:#71717a"># {'event': 'Dentist appointment', 'location': "Dr. Lee's office",</span>
<span style="color:#71717a">#  'day': 'Friday', 'time': '2:30 PM'}</span></code></pre>
</div>
<p style="font-size:.82rem;color:#71717a;margin-top:.5rem">The examples teach Claude both the extraction logic AND the exact JSON shape. Without examples, Claude might produce a different key structure each time.</p>
</div>

<div class="card">
<h2>Interactive Few-Shot Builder</h2>
<p>Build your own few-shot prompt by adding example pairs. Then test with new inputs to see if Claude would learn the pattern.</p>

<div id="examplePairs">
<div class="example-pair" data-idx="0">
<div class="example-input">
<span class="example-label label-in">Input</span>
<input type="text" id="in-0" placeholder="Example input..." value="The movie was absolutely fantastic!">
</div>
<div class="example-arrow">-></div>
<div class="example-output">
<span class="example-label label-out">Output</span>
<input type="text" id="out-0" placeholder="Expected output..." value="Positive">
</div>
</div>
<div class="example-pair" data-idx="1">
<div class="example-input">
<span class="example-label label-in">Input</span>
<input type="text" id="in-1" placeholder="Example input..." value="I wasted two hours of my life on this terrible film.">
</div>
<div class="example-arrow">-></div>
<div class="example-output">
<span class="example-label label-out">Output</span>
<input type="text" id="out-1" placeholder="Expected output..." value="Negative">
</div>
</div>
<div class="example-pair" data-idx="2">
<div class="example-input">
<span class="example-label label-in">Input</span>
<input type="text" id="in-2" placeholder="Example input..." value="It was okay, nothing special but not bad either.">
</div>
<div class="example-arrow">-></div>
<div class="example-output">
<span class="example-label label-out">Output</span>
<input type="text" id="out-2" placeholder="Expected output..." value="Neutral">
</div>
</div>
</div>
<button class="add-btn" onclick="addExamplePair()">+ Add Another Example</button>

<div class="test-section">
<p><strong>Test your pattern:</strong></p>
<div class="test-input">
<input type="text" id="testInput" placeholder="Enter a new input to classify...">
<button class="test-btn" onclick="testPattern()">Test</button>
</div>
</div>
</div>

<div class="card">
<h2>Few-Shot Best Practices</h2>
<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Use 3-5 examples</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Too few and the pattern is ambiguous. Too many wastes tokens. 3-5 is the sweet spot for most tasks. Add more only if the pattern is genuinely complex.</p>
</div>
<div style="padding:1rem;background:rgba(56,189,248,.05);border-radius:10px;border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8">Cover edge cases in examples</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Include examples that represent boundary conditions. For sentiment: include a mixed review, not just clearly positive/negative. Edge cases prevent Claude from defaulting to the most common class.</p>
</div>
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Be consistent in format</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">All examples should follow the exact same structure. If one example outputs "Positive" and another outputs "positive (confident)", Claude will be confused about which format to use.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">Order matters</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Put the most representative example first and the most complex one last. Claude builds understanding progressively — start simple, end sophisticated.</p>
</div>
<div style="padding:1rem;background:rgba(244,114,182,.05);border-radius:10px;border:1px solid rgba(244,114,182,.1)">
<strong style="color:#f472b6">Combine with system prompt</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">System prompt for identity and constraints + few-shot examples for format and logic = the most powerful combination. Instructions explain the rules; examples show the execution.</p>
</div>
</div>
</div>

<div class="card">
<div class="challenge-box">
<h3>Challenge: Tricky Sentiment Cases</h3>
<p style="font-size:.85rem;color:#a1a1aa">Using the few-shot builder above, test these tricky inputs. Can your examples handle ambiguity?</p>
<div style="margin-top:.75rem;display:flex;flex-direction:column;gap:.5rem">
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"The acting was great but the plot made no sense"</div>
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"I wouldn't say I hated it, but I'd never watch it again"</div>
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"My kids loved it, I slept through it — 5 stars"</div>
</div>
</div>
</div>


<div data-learn="FlashDeck" data-props='{"title":"Few-Shot Prompting Concepts","cards":[{"front":"Few-shot prompting","back":"Providing Claude with input-output examples to demonstrate a pattern, then asking it to apply that pattern to new inputs. The examples go in the messages array as alternating user/assistant turns."},{"front":"Zero-shot vs. few-shot","back":"Zero-shot: no examples, just instructions. Few-shot: 2-5 examples showing the pattern. Few-shot produces more consistent format and handles ambiguous cases better."},{"front":"Ideal number of examples","back":"3-5 examples is the sweet spot. 1-2 may be ambiguous. 6+ wastes context tokens without meaningful accuracy gain. Add more only for genuinely complex patterns."},{"front":"Few-shot for structured extraction","back":"Examples teach both the extraction LOGIC and the exact output FORMAT. Two JSON examples teach Claude the schema more reliably than describing it in words."},{"front":"Combining few-shot + system prompt","back":"The most powerful pattern: system prompt for identity, constraints, and rules + few-shot examples for format and edge cases. Instructions explain rules; examples show execution."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Few-Shot Prompting Quiz","questions":[{"q":"What is the ideal number of few-shot examples for most tasks?","options":["1 — one clear example is enough","3-5 — the sweet spot for pattern clarity without wasting tokens","10+ — more examples always improve accuracy","It depends on temperature, not example count"],"correct":1,"explanation":"3-5 examples is the proven sweet spot. Too few leaves the pattern ambiguous; too many wastes context window tokens without meaningful accuracy gain."},{"q":"In the Claude API, where do few-shot examples go?","options":["In the system prompt as text","In a separate examples parameter","In the messages array as alternating user/assistant turns","In a JSON file uploaded separately"],"correct":2,"explanation":"Few-shot examples are placed in the messages array as alternating user and assistant messages. Claude sees them as conversation history and continues the pattern with the next user message."},{"q":"You are building a few-shot classifier for urgency levels: High, Medium, Low. What type of example is most important to include?","options":["Only High urgency examples","Only the most common class","Edge cases and boundary conditions","Examples from a different domain"],"correct":2,"explanation":"Edge cases (e.g., something that could be High or Medium) are most valuable — they teach Claude how to handle the hard calls, not just the obvious ones."},{"q":"Why is few-shot often more effective than detailed written instructions?","options":["Examples use fewer tokens","Examples are ambiguous so Claude tries harder","Examples show both the LOGIC and FORMAT simultaneously, resolving ambiguity","Examples bypass the system prompt"],"correct":2,"explanation":"Written instructions can be interpreted multiple ways. Examples resolve ambiguity by showing exactly what you want — the reasoning pattern AND the output format in one demonstration."}]}'></div>
</div>

<div class="progress-footer">
<span class="progress-label">Lesson 6 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
