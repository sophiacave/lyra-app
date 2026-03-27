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

<div data-learn="FlashDeck" data-props='{
  "title": "Four Prompt Techniques — Flip for Details",
  "cards": [
    {
      "front": "🎯 ZERO-SHOT\n\nNo examples given.\nJust a clear instruction.",
      "back": "WHEN TO USE: Simple, well-defined tasks like classification, translation, or formatting.\n\nEXAMPLE: \"Classify this review as POSITIVE or NEGATIVE: [text]\"\n\nTIP: Be specific about format, length, and tone. The more precise, the better."
    },
    {
      "front": "📋 FEW-SHOT\n\nGive 2-3 examples first.\nAI learns the pattern.",
      "back": "WHEN TO USE: When you need a specific output format or style the AI might not guess.\n\nEXAMPLE: Show 2 informal→professional email conversions, then give a new informal message.\n\nTIP: Make examples diverse. If all examples are similar, the AI may not generalize."
    },
    {
      "front": "🔗 CHAIN-OF-THOUGHT\n\nForce step-by-step reasoning.\nDramatically improves accuracy.",
      "back": "WHEN TO USE: Math, logic, multi-step reasoning, anything that needs accuracy over speed.\n\nEXAMPLE: \"Solve this step by step: [problem]. Let us think step by step.\"\n\nRESEARCH: Up to 2x accuracy improvement on complex problems."
    },
    {
      "front": "🎭 ROLE-PLAY\n\nGive the AI a persona.\nGet expert-level output.",
      "back": "WHEN TO USE: When you need specialized expertise or a specific communication style.\n\nEXAMPLE: \"You are a senior security engineer reviewing code for vulnerabilities. Flag issues by severity.\"\n\nTIP: Include expertise level, style, focus areas, and what to avoid."
    }
  ]
}'></div>

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

<div data-learn="MatchConnect" data-props='{
  "title": "Match Task to Best Technique",
  "instruction": "Tap a task on the left, then the best prompt technique on the right",
  "pairs": [
    { "left": "Classify an email as spam or not spam", "right": "Zero-Shot — simple yes/no classification" },
    { "left": "Convert slang messages to professional tone", "right": "Few-Shot — show example conversions first" },
    { "left": "Solve a multi-step word problem correctly", "right": "Chain-of-Thought — force step-by-step reasoning" },
    { "left": "Get a thorough code review with severity ratings", "right": "Role-Play — senior engineer persona" }
  ]
}'></div>

<div data-learn="QuizMC" data-props='{
  "title": "Technique Selection",
  "questions": [
    {
      "q": "You need the AI to format data in a very specific way that it has never seen before. Which technique?",
      "options": ["Zero-shot with detailed instructions", "Few-shot with 2-3 examples of the exact format you want", "Chain-of-thought reasoning", "Role-play as a data formatter"],
      "correct": 1,
      "explanation": "When you need a specific, unusual format, showing the AI 2-3 examples is far more effective than trying to describe the format in words. Few-shot lets the AI learn the pattern from examples."
    },
    {
      "q": "Research shows chain-of-thought prompting can improve math accuracy by up to:",
      "options": ["10%", "25%", "50%", "100% (2x)"],
      "correct": 3,
      "explanation": "Studies show chain-of-thought prompting can double accuracy on multi-step reasoning tasks. By forcing the model to show its work, errors in intermediate steps become visible and correctable."
    }
  ]
}'></div>

</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-battle" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Battle →</a>
</div>

</div>

<script>
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