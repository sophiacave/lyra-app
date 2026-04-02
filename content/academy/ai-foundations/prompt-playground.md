---
title: "Prompt Playground"
course: "ai-foundations"
order: 5
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 5 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Prompt <span class="accent">Playground.</span></h1>
  <p class="sub">Master four essential prompt engineering techniques. Edit, experiment, and see the difference firsthand.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>Zero-Shot: clear instructions, no examples needed</li>
    <li>Few-Shot: teach by showing input/output examples</li>
    <li>Chain-of-Thought: force step-by-step reasoning</li>
    <li>Role-Play: give the AI a persona with expertise</li>
  </ul>
</div>

<!-- SECTION 1: TECHNIQUE OVERVIEW -->
<div class="lesson-section">
  <span class="section-label">The Four Techniques</span>
  <h2 class="section-title">Each one solves a different problem.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Four Prompt Techniques — Flip for Details","cards":[{"front":"🎯 ZERO-SHOT\n\nNo examples given.\nJust a clear instruction.","back":"WHEN TO USE: Simple, well-defined tasks like classification, translation, or formatting.\n\nEXAMPLE: \"Classify this review as POSITIVE or NEGATIVE: [text]\"\n\nTIP: Be specific about format, length, and tone. The more precise, the better."},{"front":"📋 FEW-SHOT\n\nGive 2-3 examples first.\nAI learns the pattern.","back":"WHEN TO USE: When you need a specific output format or style the AI might not guess.\n\nEXAMPLE: Show 2 informal→professional email conversions, then give a new informal message.\n\nTIP: Make examples diverse. If all examples are similar, the AI may not generalize."},{"front":"🔗 CHAIN-OF-THOUGHT\n\nForce step-by-step reasoning.\nDramatically improves accuracy.","back":"WHEN TO USE: Math, logic, multi-step reasoning, anything that needs accuracy over speed.\n\nEXAMPLE: \"Solve this step by step: [problem]. Let us think step by step.\"\n\nRESEARCH: Up to 2x accuracy improvement on complex problems."},{"front":"🎭 ROLE-PLAY\n\nGive the AI a persona.\nGet expert-level output.","back":"WHEN TO USE: When you need specialized expertise or a specific communication style.\n\nEXAMPLE: \"You are a senior security engineer reviewing code for vulnerabilities. Flag issues by severity.\"\n\nTIP: Include expertise level, style, focus areas, and what to avoid."}]}'></div>

</div>

<!-- SECTION 1B: CODE EXAMPLES -->
<div class="lesson-section">
  <span class="section-label">The Code</span>
  <h2 class="section-title">Each technique in real Python.</h2>
  <p class="section-text">Here is how each technique looks when you call the Claude API. These are production-ready patterns you can copy directly:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — zero-shot classification</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

<span style="color:#71717a"># Zero-shot: just a clear instruction, no examples</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">50</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"Classify this review as POSITIVE or NEGATIVE:\n\n"</span>
                   <span style="color:#fbbf24">"'The food was incredible but the service was painfully slow.'\n\n"</span>
                   <span style="color:#fbbf24">"Classification:"</span>
    }]
)</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — few-shot (teach by example)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Few-shot: give 2 examples, then the real task</span>
prompt = <span style="color:#fbbf24">"""Extract the product and sentiment:

Review: "Love my new AirPods, sound quality is amazing"
→ Product: AirPods | Sentiment: positive

Review: "The laptop keyboard broke after two weeks"
→ Product: laptop | Sentiment: negative

Review: "This standing desk changed my work life"
→"""</span>

response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">50</span>,
    messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: prompt}]
)
<span style="color:#71717a"># → Product: standing desk | Sentiment: positive</span></code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — chain-of-thought (step-by-step reasoning)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Chain-of-thought: "think step by step" = 2x accuracy</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">500</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"A store has a 'buy 2, get 1 free' deal on $3 notebooks. "</span>
                   <span style="color:#fbbf24">"Sarah wants 7 notebooks. How much does she pay?\n\n"</span>
                   <span style="color:#fbbf24">"Think step by step before giving the final answer."</span>
    }]
)</code></pre>
</div>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — role-play (expert persona via system prompt)</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># Role-play: system prompt sets the expert persona</span>
response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,
    max_tokens=<span style="color:#fb923c">500</span>,
    system=<span style="color:#fbbf24">"You are a senior security engineer with 15 years of "</span>
           <span style="color:#fbbf24">"experience. Review code for vulnerabilities. Flag by "</span>
           <span style="color:#fbbf24">"severity: CRITICAL, HIGH, MEDIUM, LOW. Always suggest a fix."</span>,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"""Review this code:
app.get("/user", (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(query).then(user => res.json(user));
});"""</span>
    }]
)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">Notice the pattern: zero-shot and chain-of-thought modify the <em>user message</em>. Role-play uses the <em>system prompt</em>. Few-shot embeds examples <em>inside</em> the user message. Same API call — different strategy.</p>

</div>

<!-- SECTION 2: INTERACTIVE PLAYGROUND -->
<div class="lesson-section">
  <span class="section-label">Try It</span>
  <h2 class="section-title">Edit prompts and see the difference.</h2>

  <div class="template-tabs">
    <button class="tab active" onclick="selectTemplate(0)">Zero-Shot</button>
    <button class="tab" onclick="selectTemplate(1)">Few-Shot</button>
    <button class="tab" onclick="selectTemplate(2)">Chain-of-Thought</button>
    <button class="tab" onclick="selectTemplate(3)">Role-Play</button>
  </div>

  <div class="template-info" id="templateInfo"></div>

  <div class="playground">
    <div class="pane">
      <div class="pane-header"><span class="label">Your Prompt</span><span class="tag" id="templateTag">ZERO-SHOT</span></div>
      <textarea id="promptEditor"></textarea>
    </div>
    <div class="pane">
      <div class="pane-header"><span class="label">Simulated Output</span><span class="tag" style="font-size:.6rem">(Simulation)</span></div>
      <div class="output-pane" id="outputPane"></div>
    </div>
  </div>

  <button class="run-btn" onclick="runPrompt()">▶ Run Prompt</button>
</div>

<!-- SECTION 3: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Pick the right technique.</h2>


<div data-learn="QuizMC" data-props='{"title":"Technique Selection","questions":[{"q":"You need the AI to format data in a very specific way that it has never seen before. Which technique?","options":["Zero-shot with detailed instructions","Few-shot with 2-3 examples of the exact format you want","Chain-of-thought reasoning","Role-play as a data formatter"],"correct":1,"explanation":"When you need a specific, unusual format, showing the AI 2-3 examples is far more effective than trying to describe the format in words. Few-shot lets the AI learn the pattern from examples."},{"q":"Research shows chain-of-thought prompting can improve math accuracy by up to:","options":["10%","25%","50%","100% (2x)"],"correct":3,"explanation":"Studies show chain-of-thought prompting can double accuracy on multi-step reasoning tasks. By forcing the model to show its work, errors in intermediate steps become visible and correctable."}]}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-battle" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Battle →</a>
</div>

</div>

<script type="text/x-lesson">
var templates=[
  {name:'Zero-Shot',tag:'ZERO-SHOT',desc:'No examples — just a clear instruction. Best for simple, well-defined tasks.',tip:'Be specific about format, length, and tone.',prompt:'Classify the following movie review as POSITIVE or NEGATIVE.\n\nReview: "This film was a masterpiece of storytelling. The performances were breathtaking and the cinematography was stunning."\n\nClassification:',output:'POSITIVE\n\nThe review uses strongly favorable language: "masterpiece," "breathtaking," and "stunning" all indicate a highly positive sentiment.'},
  {name:'Few-Shot',tag:'FEW-SHOT',desc:'Give 2-3 examples of input→output pairs before your actual request.',tip:'Make your examples diverse for better generalization.',prompt:'Convert these informal messages to professional emails:\n\nInformal: "hey can u send me that report asap"\nProfessional: "Hi, could you please send me the quarterly report at your earliest convenience? Thank you."\n\nInformal: "the meeting was kinda boring ngl"\nProfessional: "The meeting covered familiar ground. I\'d suggest a more focused agenda for next time."\n\nInformal: "yo this new feature is fire"\nProfessional:',output:'"I\'m impressed with the new feature — it\'s a significant improvement that should resonate well with our users. Great work by the development team."'},
  {name:'Chain-of-Thought',tag:'CHAIN-OF-THOUGHT',desc:'Force step-by-step reasoning. Dramatically improves accuracy on complex tasks.',tip:'Add "Let\'s think step by step" or show a worked example.',prompt:'Solve this step by step:\n\nA store sells notebooks for $3 each. They offer a "buy 2, get 1 free" deal. If Sarah wants 7 notebooks, how much does she pay?\n\nLet\'s think step by step:',output:'Step 1: With "buy 2, get 1 free," every group of 3 notebooks costs only 2 × $3 = $6.\n\nStep 2: Sarah wants 7 notebooks. 7 ÷ 3 = 2 groups with 1 remaining.\n\nStep 3: Cost for 2 groups: 2 × $6 = $12 (covers 6 notebooks).\n\nStep 4: 1 remaining notebook at full price: $3.\n\nStep 5: Total = $12 + $3 = $15.\n\nSarah pays $15.'},
  {name:'Role-Play',tag:'ROLE-PLAY',desc:'Give the AI a persona with specific expertise and communication style.',tip:'Include expertise level, style, focus areas, and what to avoid.',prompt:'You are a senior security engineer. Review this code for vulnerabilities. Flag by severity (CRITICAL/HIGH/MEDIUM/LOW). Always suggest a fix.\n\napp.get("/user", (req, res) => {\n  const userId = req.query.id;\n  const query = `SELECT * FROM users WHERE id = ${userId}`;\n  db.query(query).then(user => res.json(user));\n});',output:'🔴 CRITICAL: SQL Injection\n\nThe userId is concatenated directly into the SQL query. An attacker can inject arbitrary SQL.\n\nFix: Use parameterized queries.\nconst query = "SELECT * FROM users WHERE id = $1";\ndb.query(query, [userId]);\n\n🟡 MEDIUM: No input validation\nAdd type checking — userId should be a number.\n\n🟡 MEDIUM: SELECT * exposes all columns\nList specific columns to avoid leaking sensitive fields.'}
];

var currentTemplate=0;

window.selectTemplate=function(i){
  currentTemplate=i;
  document.querySelectorAll('.tab').forEach(function(t,j){t.classList.toggle('active',j===i)});
  var t=templates[i];
  document.getElementById('templateTag').textContent=t.tag;
  document.getElementById('templateInfo').innerHTML='<h3>'+t.name+'</h3><p>'+t.desc+'</p><div class="tip">'+t.tip+'</div>';
  document.getElementById('promptEditor').value=t.prompt;
  document.getElementById('outputPane').innerHTML='<span style="color:#52525b">Click "Run Prompt" to see the output →</span>';
};

window.runPrompt=function(){
  var t=templates[currentTemplate];var output=document.getElementById('outputPane');output.innerHTML='';
  var text=t.output;var i=0;
  function type(){if(i<text.length){output.textContent+=text[i];i++;setTimeout(type,Math.random()*20+10)}}
  type();
};

selectTemplate(0);
</script>