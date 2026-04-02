---
title: "Chain of Thought"
course: "claude-mastery"
order: 5
type: "lesson"
free: false
---<div class="xp-burst" id="xpBurst"><div class="xp-burst-text">+240 XP</div></div>

<nav class="nav">


</nav>

<div class="lesson-header">
<div class="lesson-badge">Lesson 5 · Visual</div>
<h1>Chain-of-Thought Reasoning</h1>
<p>Unlock Claude's deeper reasoning — from simple CoT to extended thinking, with production code</p>
<div class="lesson-meta-bar">⏱ <span>75 min</span> · ⚡ <span>240 XP</span> · 📚 <span>Module 2</span></div>
</div>

<div class="content">
<div class="card">
<h2>The Power of "Think Step by Step"</h2>
<p>Chain-of-thought (CoT) prompting is one of the most powerful techniques in prompt engineering. By asking Claude to show its reasoning before giving a final answer, you dramatically improve accuracy on complex tasks — math, logic, coding, analysis, and multi-step decisions.</p>

<p>The reason is simple: when Claude writes out intermediate steps, each step becomes context for the next. It can catch errors mid-reasoning, check its own logic, and build on solid intermediate conclusions. Without CoT, the model jumps directly from question to answer — and on complex problems, that jump often lands wrong.</p>

<div class="comparison">
<div class="comp-box">
<div class="comp-label" style="color:#f87171">Without CoT</div>
<div class="comp-text" style="font-style:italic;color:#71717a">"If a store has a 25% off sale and then offers an additional 10% off the sale price, what's the total discount on a $200 item?"</div>
<div class="comp-text" style="margin-top:.75rem">"The total discount is 35%, so the price would be $130."</div>
<div class="comp-answer comp-wrong">Wrong — that's not how compound discounts work!</div>
</div>
<div class="comp-box">
<div class="comp-label" style="color:#34d399">With CoT</div>
<div class="comp-text" style="font-style:italic;color:#71717a">"Think step by step: If a store has a 25% off sale..."</div>
<div class="comp-text" style="margin-top:.75rem">
Step 1: Original price = $200<br>
Step 2: 25% off: $200 x 0.75 = $150<br>
Step 3: Additional 10% off sale price: $150 x 0.90 = $135<br>
Step 4: Total discount = $200 - $135 = $65 = 32.5%
</div>
<div class="comp-answer comp-right">Correct! The compound discount is 32.5%, not 35%</div>
</div>
</div>
</div>

<div class="card">
<h2>CoT in the API — Three Approaches</h2>
<p>There are three ways to use chain-of-thought with Claude, each with different tradeoffs:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Approach 1: prompt-based CoT (simplest)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic
client = anthropic.Anthropic()

<span style="color:#71717a"># Just add "Think step by step" to your prompt</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">1024</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: (
            <span style="color:#fbbf24">"Think step by step.\n\n"</span>
            <span style="color:#fbbf24">"A store has a 25% off sale, then offers an additional "</span>
            <span style="color:#fbbf24">"10% off the sale price. What is the total discount "</span>
            <span style="color:#fbbf24">"on a $200 item?"</span>
        )
    }]
)
<span style="color:#34d399">print</span>(response.content[<span style="color:#fb923c">0</span>].text)
<span style="color:#71717a"># Claude shows: Step 1... Step 2... Step 3... Answer: $135 (32.5% off)</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Approach 2: structured CoT in system prompt</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># For production: enforce CoT format in the system prompt</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">2048</span>,
    system=(
        <span style="color:#fbbf24">"You are a precise analytical assistant.\n\n"</span>
        <span style="color:#fbbf24">"For EVERY question, respond in this exact format:\n"</span>
        <span style="color:#fbbf24">"&lt;reasoning&gt;\n"</span>
        <span style="color:#fbbf24">"Step-by-step analysis here...\n"</span>
        <span style="color:#fbbf24">"&lt;/reasoning&gt;\n\n"</span>
        <span style="color:#fbbf24">"&lt;answer&gt;\n"</span>
        <span style="color:#fbbf24">"Final answer here.\n"</span>
        <span style="color:#fbbf24">"&lt;/answer&gt;\n\n"</span>
        <span style="color:#fbbf24">"&lt;confidence&gt;HIGH/MEDIUM/LOW&lt;/confidence&gt;"</span>
    ),
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Should we use a SQL or NoSQL database for a social media feed?"</span>
    }]
)

<span style="color:#71717a"># Parse the structured output</span>
text = response.content[<span style="color:#fb923c">0</span>].text
reasoning = text.split(<span style="color:#fbbf24">"&lt;reasoning&gt;"</span>)[<span style="color:#fb923c">1</span>].split(<span style="color:#fbbf24">"&lt;/reasoning&gt;"</span>)[<span style="color:#fb923c">0</span>]
answer = text.split(<span style="color:#fbbf24">"&lt;answer&gt;"</span>)[<span style="color:#fb923c">1</span>].split(<span style="color:#fbbf24">"&lt;/answer&gt;"</span>)[<span style="color:#fb923c">0</span>]
<span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Answer: {answer.strip()}"</span>)</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Approach 3: extended thinking (most powerful)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Extended thinking: Claude reasons internally before responding</span>
<span style="color:#71717a"># Available on Opus 4.6 and Sonnet 4.6</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">16000</span>,
    thinking={
        <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"enabled"</span>,
        <span style="color:#fbbf24">"budget_tokens"</span>: <span style="color:#fb923c">10000</span>  <span style="color:#71717a"># tokens for internal reasoning</span>
    },
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Analyze the tradeoffs between microservices and a monolith for a startup with 5 engineers."</span>
    }]
)

<span style="color:#71717a"># Response has both thinking and text blocks</span>
<span style="color:#c084fc">for</span> block <span style="color:#c084fc">in</span> response.content:
    <span style="color:#c084fc">if</span> block.type == <span style="color:#fbbf24">"thinking"</span>:
        <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"Internal reasoning ({len(block.thinking)} chars):"</span>)
        <span style="color:#34d399">print</span>(block.thinking[:200] + <span style="color:#fbbf24">"..."</span>)
    <span style="color:#c084fc">elif</span> block.type == <span style="color:#fbbf24">"text"</span>:
        <span style="color:#34d399">print</span>(f<span style="color:#fbbf24">"\nFinal answer:\n{block.text}"</span>)</code></pre>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:.75rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);text-align:center">
<strong style="color:#34d399;font-size:.8rem">Prompt-based CoT</strong>
<p style="font-size:.75rem;color:#a1a1aa;margin:.3rem 0 0">Simplest. Add "think step by step." Reasoning visible in output. Costs output tokens.</p>
</div>
<div style="padding:.75rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1);text-align:center">
<strong style="color:#8b5cf6;font-size:.8rem">Structured CoT</strong>
<p style="font-size:.75rem;color:#a1a1aa;margin:.3rem 0 0">Parseable. XML tags separate reasoning from answer. Best for production APIs.</p>
</div>
<div style="padding:.75rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);text-align:center">
<strong style="color:#fb923c;font-size:.8rem">Extended Thinking</strong>
<p style="font-size:.75rem;color:#a1a1aa;margin:.3rem 0 0">Most powerful. Internal reasoning with budget. Best for hard problems. Separate thinking block in response.</p>
</div>
</div>
</div>

<div class="card">
<h2>How the Thinking Process Works</h2>
<p>When Claude uses chain-of-thought, its reasoning unfolds in a visible sequence. For a math puzzle, it might look like this:</p>

<div style="display:grid;gap:.5rem;margin-top:.75rem">
<div style="padding:.75rem 1rem;background:rgba(139,92,246,.04);border-radius:8px;border-left:3px solid #8b5cf6;font-size:.85rem;color:#a1a1aa"><strong style="color:#8b5cf6">Step 1:</strong> Identify the key variables and constraints in the problem.</div>
<div style="padding:.75rem 1rem;background:rgba(56,189,248,.04);border-radius:8px;border-left:3px solid #38bdf8;font-size:.85rem;color:#a1a1aa"><strong style="color:#38bdf8">Step 2:</strong> Break the problem into sub-problems that can be solved sequentially.</div>
<div style="padding:.75rem 1rem;background:rgba(251,146,60,.04);border-radius:8px;border-left:3px solid #fb923c;font-size:.85rem;color:#a1a1aa"><strong style="color:#fb923c">Step 3:</strong> Solve each sub-problem, checking intermediate results for consistency.</div>
<div style="padding:.75rem 1rem;background:rgba(52,211,153,.04);border-radius:8px;border-left:3px solid #34d399;font-size:.85rem;color:#a1a1aa"><strong style="color:#34d399">Step 4:</strong> Combine results and verify the final answer against the original constraints.</div>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.75rem">This pattern applies to math puzzles, logic problems, and code debugging alike. The key is that each step becomes context for the next — allowing Claude to catch errors mid-reasoning rather than jumping to a wrong conclusion.</p>
</div>

<div class="card">
<h2>When CoT Helps (and When It Doesn't)</h2>
<p>CoT is not a universal improvement. Understanding when to use it saves tokens and latency:</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin:1rem 0">
<div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
<strong style="color:#34d399;font-size:.85rem">CoT helps significantly</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Multi-step math and logic problems</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Code debugging (trace through execution)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Causal reasoning ("why did X happen?")</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Decision analysis with multiple factors</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Any problem where intermediate steps matter</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.85rem">CoT adds cost without benefit</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Simple classification (spam/not spam)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Translation tasks</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Simple factual lookups</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Creative writing (reasoning can over-constrain)</p>
<p style="font-size:.82rem;color:#a1a1aa;margin:.2rem 0 0">Tasks where the answer is one word/number</p>
</div>
</div>
</div>

<div class="card">
<h2>Write Your Own CoT Prompt</h2>
<p>Here is a challenging question. Write a prompt that guides Claude to reason through it step by step:</p>
<div style="background:rgba(139,92,246,.08);border-left:3px solid #8b5cf6;padding:1rem;border-radius:0 8px 8px 0;margin:1rem 0;font-size:.95rem">
<strong>Question:</strong> A farmer has a fox, a chicken, and a bag of grain. He needs to cross a river in a boat that can only carry him and one item at a time. If left alone, the fox will eat the chicken, and the chicken will eat the grain. How can he get everything across safely?
</div>
<p style="font-size:.85rem;color:#a1a1aa;margin-top:.75rem">A good CoT prompt for this problem would include: "Think step by step. List all constraints first. Consider what happens if you leave each pair alone. Then find a sequence of crossings that satisfies all constraints."</p>

<div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:12px;padding:1.25rem;margin-top:1rem;font-size:.85rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#34d399">Solution (spoiler):</strong> Take chicken across. Return empty. Take fox across. Bring chicken back. Take grain across. Return empty. Take chicken across. The key insight: the chicken is the problem — it conflicts with both others. So it needs to travel back once.
</div>
</div>

<div class="card">
<h2>CoT Best Practices</h2>
<div style="display:grid;gap:1rem">
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">1</div>
<div><strong>"Think step by step"</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">The classic trigger. Simple and effective for most problems. Add it at the beginning of the prompt, not the end.</p></div>
</div>
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">2</div>
<div><strong>"Before answering, consider..."</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">Guides the model to evaluate specific aspects before concluding. Great for decision analysis: "Before recommending, consider cost, complexity, and team size."</p></div>
</div>
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">3</div>
<div><strong>Use XML tags to separate reasoning from answer</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">In production, wrap reasoning in tags so you can parse the final answer programmatically: &lt;reasoning&gt;...&lt;/reasoning&gt; &lt;answer&gt;...&lt;/answer&gt;</p></div>
</div>
<div style="display:flex;gap:1rem;align-items:start;padding:1rem;background:rgba(52,211,153,.05);border-radius:10px;border:1px solid rgba(52,211,153,.1)">
<div style="color:#34d399;font-size:1.2rem;flex-shrink:0">4</div>
<div><strong>Use extended thinking for hard problems</strong><p style="font-size:.85rem;color:#a1a1aa;margin:0">For math, code generation, complex analysis — give Claude a thinking budget. The reasoning happens internally and the response is cleaner.</p></div>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Chain-of-Thought Key Concepts","cards":[{"front":"Chain-of-Thought (CoT) prompting","back":"Asking Claude to show its step-by-step reasoning before arriving at an answer. Dramatically improves accuracy on math, logic, coding, and analysis by making intermediate steps visible for self-correction."},{"front":"Extended thinking","back":"Claude\u0027s built-in deep reasoning mode. You set a thinking budget (tokens), and Claude reasons internally before responding. Available on Sonnet 4.6 and Opus 4.6. Use the thinking parameter in the API."},{"front":"Structured CoT with XML tags","back":"Wrapping reasoning in XML tags (\u003creasoning\u003e...\u003c/reasoning\u003e \u003canswer\u003e...\u003c/answer\u003e) so production code can parse the final answer separately from the reasoning."},{"front":"When NOT to use CoT","back":"Simple classification, translation, factual lookups, and creative writing. CoT adds token cost and latency without accuracy benefit on tasks that don\u0027t have multi-step reasoning."},{"front":"Compound discount example","back":"25% off then 10% off is NOT 35% off. It is 25% off the original, then 10% off the reduced price = 32.5% total. CoT catches this; direct answering often misses it."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Chain-of-Thought Comprehension","questions":[{"q":"A store offers 20% off, then an additional 10% off the sale price. Without CoT, Claude says the total discount is 30%. What is the actual answer?","options":["30% — Claude was correct","28% — compound discounts multiply","25% — sequential discounts are always less","The discounts cannot be combined"],"correct":1,"explanation":"Compound discounts are multiplicative, not additive. 20% off leaves 80%, then 10% off that leaves 72% — so 28% total discount, not 30%. CoT forces Claude to compute each step sequentially."},{"q":"Which approach gives Claude the deepest reasoning on hard problems?","options":["Prompt-based CoT (think step by step)","Structured CoT with XML tags","Extended thinking with a budget","Temperature 0"],"correct":2,"explanation":"Extended thinking gives Claude a dedicated reasoning budget. It can think for thousands of tokens internally before producing a clean final answer. This is the most powerful option for genuinely hard problems."},{"q":"When is chain-of-thought prompting NOT worth the extra tokens?","options":["Multi-step math problems","Simple spam/not-spam classification","Code debugging with complex logic","Analyzing tradeoffs between two architectures"],"correct":1,"explanation":"Simple binary classification doesn\u0027t benefit from step-by-step reasoning. The model already knows the answer in one step. Adding CoT just costs more tokens and adds latency without improving accuracy."},{"q":"In production, what is the best way to separate Claude\u0027s reasoning from its final answer?","options":["Ask Claude to put the answer at the end","Use XML tags: reasoning and answer blocks","Check the last sentence only","Use a separate API call"],"correct":1,"explanation":"XML tags give you a reliable, parseable boundary between reasoning and answer. Your code can extract the answer block programmatically without parsing natural language."}]}'></div>


</div>

<div class="progress-footer">
<span class="progress-label">Lesson 5 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 2</span>
</div>
</div>
