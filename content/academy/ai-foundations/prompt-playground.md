---
title: "Prompt Playground"
course: "ai-foundations"
order: 5
type: "lab"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  <a href="index.html" class="nav-link">← Back to Course</a>
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+75 XP</span>
      <span class="time-badge">~30 min</span>
    </div>
    <h1>Prompt Playground</h1>
    <p>Master four essential prompt engineering techniques. Edit, experiment, and see the difference firsthand.</p>
  </div>

  <div class="narration" style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.15);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;line-height:1.7;font-size:.95rem">
    <strong style="color:#c084fc">Try this:</strong> Select a technique tab below, read the pre-loaded example prompt, then click "Run Prompt" to see the simulated output. After that, edit the prompt text and run it again to see how changes affect the response. Each technique solves a different problem -- start with Zero-Shot for simple tasks, then explore Few-Shot and Chain-of-Thought for harder ones.
  </div>

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
      <div class="pane-header"><span class="label">Simulated Output</span><span class="tag" style="font-size:.6rem">(Simulation) AI RESPONSE</span></div>
      <div class="pane-output" id="outputPane"></div>
    </div>
  </div>

  <button class="run-btn" onclick="runPrompt()">▶ Run Prompt</button>

  <div class="comparison" id="comparisonSection">
    <h2>Before vs After</h2>
    <div class="compare-grid">
      <div class="compare-box before">
        <div class="label">Naive Prompt</div>
        <div class="content" id="beforeContent"></div>
      </div>
      <div class="compare-box after">
        <div class="label">Engineered Prompt</div>
        <div class="content" id="afterContent"></div>
      </div>
    </div>
  </div>

  <div class="challenges">
    <h2>Challenges</h2>
    <div class="challenge-card" id="ch0" onclick="startChallenge(0)">
      <h4><span class="challenge-check">✓</span> Rewrite a vague prompt using few-shot examples</h4>
      <p>Turn "write a poem" into a structured few-shot prompt that produces haiku specifically.</p>
    </div>
    <div class="challenge-card" id="ch1" onclick="startChallenge(1)">
      <h4><span class="challenge-check">✓</span> Build a chain-of-thought math solver</h4>
      <p>Craft a prompt that forces step-by-step reasoning for word problems.</p>
    </div>
    <div class="challenge-card" id="ch2" onclick="startChallenge(2)">
      <h4><span class="challenge-check">✓</span> Create a role-play prompt for a code reviewer</h4>
      <p>Design a system prompt that turns the AI into a senior engineer reviewing pull requests.</p>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete & Continue →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
const templates=[
  {
    name:'Zero-Shot',tag:'ZERO-SHOT',
    desc:'No examples given — just a clear instruction. Works best for simple, well-defined tasks.',
    tip:'Tip: Be specific about format, length, and tone. The more precise your instruction, the better the output.',
    prompt:'Classify the following movie review as POSITIVE or NEGATIVE.\n\nReview: "This film was a masterpiece of storytelling. The performances were breathtaking and the cinematography was stunning."\n\nClassification:',
    output:'POSITIVE\n\nThe review uses strongly favorable language: "masterpiece," "breathtaking," and "stunning" all indicate a highly positive sentiment.',
    before:{naive:'Tell me about this movie review.',after:'Classify the following movie review as POSITIVE or NEGATIVE.\n\nReview: "..."\n\nClassification:'},
    after:{naive:'Here\'s some information about movie reviews in general...','after':'POSITIVE — clear, decisive, exactly what you asked for.'}
  },
  {
    name:'Few-Shot',tag:'FEW-SHOT',
    desc:'Give 2-3 examples of input→output pairs before your actual request. The AI learns the pattern.',
    tip:'Tip: Make your examples diverse. If all examples are similar, the AI may not generalize well.',
    prompt:'Convert these informal messages to professional emails:\n\nInformal: "hey can u send me that report asap"\nProfessional: "Hi, could you please send me the quarterly report at your earliest convenience? Thank you."\n\nInformal: "the meeting was kinda boring ngl"\nProfessional: "The meeting covered familiar ground. I\'d suggest a more focused agenda for next time."\n\nInformal: "yo this new feature is fire"\nProfessional:',
    output:'"I\'m impressed with the new feature — it\'s a significant improvement that should resonate well with our users. Great work by the development team."',
    before:{naive:'Make this professional: yo this new feature is fire',after:'[2 examples shown first, then the actual request]'},
    after:{naive:'Random, inconsistent tone','after:'Matches the exact pattern and register shown in examples.'}
  },
  {
    name:'Chain-of-Thought',tag:'CHAIN-OF-THOUGHT',
    desc:'Force the AI to show its reasoning step by step. Dramatically improves accuracy on complex tasks.',
    tip:'Tip: Add "Let\'s think step by step" or show a worked example with explicit reasoning.',
    prompt:'Solve this step by step:\n\nA store sells notebooks for $3 each. They offer a "buy 2, get 1 free" deal. If Sarah wants 7 notebooks, how much does she pay?\n\nLet\'s think step by step:',
    output:'Step 1: With "buy 2, get 1 free," every group of 3 notebooks costs only 2 × $3 = $6.\n\nStep 2: Sarah wants 7 notebooks. How many groups of 3?\n7 ÷ 3 = 2 groups with 1 remaining.\n\nStep 3: Cost for 2 groups: 2 × $6 = $12 (covers 6 notebooks).\n\nStep 4: 1 remaining notebook at full price: $3.\n\nStep 5: Total = $12 + $3 = $15.\n\nSarah pays $15 for 7 notebooks.',
    before:{naive:'How much for 7 notebooks with buy 2 get 1 free at $3 each?',after:'[Same question + "Let\'s think step by step"]'},
    after:{naive:'Often gives wrong answer ($21 or $18)','after:'Correct answer ($15) with clear reasoning chain.'}
  },
  {
    name:'Role-Play',tag:'ROLE-PLAY',
    desc:'Give the AI a persona with specific expertise, constraints, and communication style.',
    tip:'Tip: Include the role\'s expertise level, communication style, what they should focus on, and what they should avoid.',
    prompt:'You are a senior security engineer at a tech company. You are reviewing code for vulnerabilities. You speak concisely, flag issues by severity (CRITICAL/HIGH/MEDIUM/LOW), and always suggest a fix.\n\nReview this code:\n\napp.get("/user", (req, res) => {\n  const userId = req.query.id;\n  const query = `SELECT * FROM users WHERE id = ${userId}`;\n  db.query(query).then(user => res.json(user));\n});',
    output:'🔴 CRITICAL: SQL Injection\n\nThe userId is concatenated directly into the SQL query without sanitization. An attacker can inject arbitrary SQL.\n\nAttack example: /user?id=1 OR 1=1; DROP TABLE users;--\n\nFix: Use parameterized queries.\n\nconst query = "SELECT * FROM users WHERE id = $1";\ndb.query(query, [userId]).then(user => res.json(user));\n\n🟡 MEDIUM: No input validation\nAdd type checking — userId should be a number.\n\n🟡 MEDIUM: SELECT * exposes all columns\nList specific columns to avoid leaking sensitive fields.',
    before:{naive:'Check this code for problems',after:'[Role + expertise + format + specific code]'},
    after:{naive:'Vague: "There might be some issues with this code..."','after:'Structured severity ratings, specific attack vectors, copy-paste fixes.'}
  }
];

let currentTemplate=0;
let challengesDone=[false,false,false];

function selectTemplate(i){
  currentTemplate=i;
  document.querySelectorAll('.tab').forEach((t,j)=>t.classList.toggle('active',j===i));
  const t=templates[i];
  document.getElementById('templateTag').textContent=t.tag;
  document.getElementById('templateInfo').innerHTML=`<h3>${t.name}</h3><p>${t.desc}</p><div class="tip">${t.tip}</div>`;
  document.getElementById('promptEditor').value=t.prompt;
  document.getElementById('outputPane').innerHTML='<span style="color:#52525b">Click "Run Prompt" to see the output →</span>';
  document.getElementById('beforeContent').textContent=t.before.naive;
  document.getElementById('afterContent').textContent=t.after.naive;
}

function runPrompt(){
  const t=templates[currentTemplate];
  const output=document.getElementById('outputPane');
  output.innerHTML='';
  const text=t.output;
  let i=0;
  function type(){
    if(i<text.length){
      output.textContent+=text[i];
      i++;
      setTimeout(type,Math.random()*20+10);
    }
  }
  type();
  document.getElementById('beforeContent').textContent=t.before.naive+'\n\n→ '+t.after.naive;
  document.getElementById('afterContent').textContent=t.before.after+'\n\n→ '+t.after.after;
}

function startChallenge(i){
  const prompts=[
    'Write a haiku about:\n\nExample 1:\nTopic: Rain\nHaiku: Drops upon the glass / A rhythm soft and constant / The world washed anew\n\nExample 2:\nTopic: Coffee\nHaiku: Steam curls from the cup / Bitter warmth against the dawn / Morning\'s first embrace\n\nTopic: Technology\nHaiku:',
    'Solve this word problem step by step:\n\nA train leaves Station A at 9:00 AM traveling at 60 mph. Another train leaves Station B (300 miles away) at 10:00 AM traveling toward Station A at 90 mph.\n\nWhen and where do they meet?\n\nLet\'s work through this step by step:',
    'You are a senior software engineer with 15 years of experience. You are conducting a code review.\n\nRules:\n- Be constructive but direct\n- Rate severity: CRITICAL / MAJOR / MINOR / NIT\n- Always explain WHY something is an issue\n- Suggest specific fixes with code examples\n- Acknowledge what\'s done well\n\nReview the submitted pull request.'
  ];
  document.getElementById('promptEditor').value=prompts[i];
  document.getElementById('templateTag').textContent='CHALLENGE '+(i+1);
  challengesDone[i]=true;
  document.getElementById('ch'+i).classList.add('completed');
  document.getElementById('outputPane').innerHTML='<span style="color:#34d399">Challenge loaded! Edit the prompt and hit Run to test it.</span>';
}

selectTemplate(0);

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['prompt-playground']){document.getElementById('completeBtn').textContent='Completed ✓';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  const p=getProgress();p['prompt-playground']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
