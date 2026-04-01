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
<p>Teach Claude any pattern with just a few examples</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>What Is Few-Shot Prompting?</h2>
<p>Few-shot prompting means giving Claude a few examples of the input-output pattern you want, then letting it generalize to new inputs. It's like teaching by showing rather than explaining — and it works remarkably well.</p>

<div class="visual-diagram">
<div class="visual-step">
<div class="step-icon" style="background:rgba(251,146,60,.15);color:#fb923c">📥</div>
<div class="step-text"><strong>Example 1: Input → Output</strong><span>Claude observes the first pattern</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(139,92,246,.15);color:#8b5cf6">📥</div>
<div class="step-text"><strong>Example 2: Input → Output</strong><span>Pattern recognition strengthens</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(56,189,248,.15);color:#38bdf8">📥</div>
<div class="step-text"><strong>Example 3: Input → Output</strong><span>Claude now deeply understands the pattern</span></div>
</div>
<div class="visual-step">
<div class="step-icon" style="background:rgba(52,211,153,.15);color:#34d399">✨</div>
<div class="step-text"><strong>New Input → Claude generates correct output!</strong><span>Pattern is applied to novel inputs</span></div>
</div>
</div>
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
<div class="example-arrow">→</div>
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
<div class="example-arrow">→</div>
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
<div class="example-arrow">→</div>
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
<button class="test-btn" onclick="testPattern()">Test →</button>
</div>
</div>
</div>

<div class="card">
<h2>Few-Shot Best Practices</h2>
<div style="display:grid;gap:.75rem;margin-top:1rem">
<div style="padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399">Use 3-5 examples</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Too few and the pattern is ambiguous. Too many wastes tokens. 3-5 is the sweet spot.</p>
</div>
<div style="padding:1rem;background:rgba(56,189,248,.05);border-radius:10px;border:1px solid rgba(56,189,248,.1)">
<strong style="color:#38bdf8">Cover edge cases</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Include examples that represent boundary conditions or tricky cases.</p>
</div>
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Be consistent in format</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">All examples should follow the exact same structure and formatting.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">Order matters</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Put the most representative example first and the most complex one last.</p>
</div>
</div>
</div>

<div class="card">
<div class="challenge-box">
<h3>Challenge: Build a Sentiment Classifier</h3>
<p style="font-size:.85rem;color:#a1a1aa">Using the few-shot builder above, create a classifier that can accurately categorize movie reviews as Positive, Negative, or Neutral. Test it with these tricky inputs:</p>
<div style="margin-top:.75rem;display:flex;flex-direction:column;gap:.5rem">
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"The acting was great but the plot made no sense"</div>
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"I wouldn't say I hated it, but I'd never watch it again"</div>
<div style="padding:.5rem .75rem;background:rgba(255,255,255,.03);border-radius:6px;font-size:.85rem;cursor:pointer" onclick="document.getElementById('testInput').value=this.textContent;testPattern();">"My kids loved it, I slept through it — 5 stars"</div>
</div>
</div>
</div>


<div data-learn="FlashDeck" data-props='{"title":"Few-Shot Prompting Concepts","cards":[{"front":"Few-shot prompting","back":"Providing Claude with a few input-output examples to demonstrate a pattern, then asking it to apply that pattern to new inputs."},{"front":"Zero-shot prompting","back":"Asking Claude to perform a task with no examples — relying entirely on its training. Works for well-understood tasks."},{"front":"Ideal number of examples","back":"3-5 examples is the sweet spot. Too few leaves the pattern ambiguous. Too many wastes context tokens."},{"front":"Why order matters in few-shot","back":"Put the most representative example first and the most complex or edge-case example last — Claude learns the pattern progressively."},{"front":"Covering edge cases","back":"Including boundary condition examples (e.g., Mixed or Neutral sentiment) prevents Claude from defaulting to just the most common class."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Few-Shot Prompting Quiz","questions":[{"q":"What is the ideal number of few-shot examples for most tasks?","options":["1 — one clear example is enough","3-5 — the sweet spot for pattern clarity without wasting tokens","10+ — more examples always improve accuracy","It depends on temperature, not example count"],"correct":1,"explanation":"3-5 examples is the proven sweet spot. Too few leaves the pattern ambiguous; too many wastes context window tokens without meaningful accuracy gain."},{"q":"You are building a few-shot classifier for urgency levels: High, Medium, Low. What type of example is most important to include?","options":["Only High urgency examples","Only the most common class","Edge cases and boundary conditions","Examples from a different domain"],"correct":2,"explanation":"Edge cases and boundary conditions (e.g., something that could be High or Medium) are most valuable — they teach Claude how to handle the hard calls, not just the obvious ones."},{"q":"Which statement about few-shot example ordering is correct?","options":["Order has no effect on Claude","Put edge cases first so Claude learns them early","Put the most representative example first, most complex last","Alphabetical order works best"],"correct":2,"explanation":"Starting with a clear, representative example establishes the core pattern. Ending with the most complex case ensures Claude has internalized the nuances before hitting hard inputs."},{"q":"How does few-shot prompting differ from a system prompt with instructions?","options":["They are identical","Few-shot teaches by showing examples; instructions teach by describing rules","Instructions always outperform examples","Few-shot only works for classification"],"correct":1,"explanation":"Instructions describe what to do in words. Few-shot shows what to do through examples. Both are valuable — and combining them (instructions + examples) often yields the best results."}]}'></div>

<div data-learn="SortStack" data-props='{"title":"Order the Few-Shot Example Set","instruction":"Arrange these example types in the recommended order for a few-shot prompt","items":["Most representative / clearest example","Second clear example showing variation","Third example with slight complexity","Edge case or boundary condition example","Most complex or ambiguous example last"]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 6 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
