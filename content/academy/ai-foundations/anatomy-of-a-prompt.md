---
title: "Anatomy of a Prompt"
course: "ai-foundations"
order: 4
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Anatomy of a <span class="accent">Prompt.</span></h1>
  <p class="sub">Watch your words get sliced into tokens in real-time. Understand the hidden structure behind every AI interaction.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How AI breaks text into tokens (not words, not characters)</li>
    <li>What the context window is and why it matters</li>
    <li>How system prompts shape AI behavior</li>
    <li>What temperature controls and when to adjust it</li>
  </ul>
</div>

<!-- SECTION 1: LIVE TOKENIZER -->
<div class="lesson-section">
  <span class="section-label">Live Demo</span>
  <h2 class="section-title">Type anything and watch it get tokenized.</h2>

  <div class="tokenizer-section">
    <div class="input-area">
      <textarea id="promptInput" placeholder="Type anything here and watch it get tokenized...">Write a haiku about artificial intelligence learning to dream</textarea>
    </div>
    <div class="token-stats">
      <div class="stat"><div class="stat-label">Tokens</div><div class="stat-value" id="tokenCount">0</div></div>
      <div class="stat"><div class="stat-label">Characters</div><div class="stat-value warm" id="charCount">0</div></div>
      <div class="stat"><div class="stat-label">Words</div><div class="stat-value blue" id="wordCount">0</div></div>
    </div>
    <div class="context-bar">
      <div class="context-bar-label"><span>Context Window Usage</span><span id="contextPct">0%</span></div>
      <div class="context-track"><div class="context-fill" id="contextFill"></div></div>
    </div>
    <div class="token-display" id="tokenDisplay"></div>
  </div>
</div>

<!-- SECTION 2: KEY CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">The four things that shape every AI response.</h2>

<div data-learn="MatchConnect" data-props='{
  "title": "Match Concept to Description",
  "instruction": "Tap a concept on the left, then its description on the right",
  "pairs": [
    { "left": "Tokens", "right": "Chunks of text (not words) — the atomic units AI reads" },
    { "left": "Context Window", "right": "The model working memory — everything it can see at once" },
    { "left": "System Prompt", "right": "Hidden instructions that set the AI personality and behavior" },
    { "left": "Temperature", "right": "Controls randomness — low is focused, high is creative" }
  ]
}'></div>

</div>

<!-- SECTION 3: TEMPERATURE DEMO -->
<div class="lesson-section">
  <span class="section-label">Experiment</span>
  <h2 class="section-title">See how temperature changes output.</h2>

  <div class="temp-section">
    <div class="temp-demo">
      <div class="temp-control">
        <label>Temperature</label>
        <div class="temp-val" id="tempVal">0.7</div>
        <input type="range" id="tempSlider" min="0" max="100" value="70">
      </div>
      <div class="temp-output">
        <h4>AI completing: "The meaning of life is..."</h4>
        <p id="tempOutput"></p>
      </div>
    </div>
  </div>

<div data-learn="FlashDeck" data-props='{
  "title": "Temperature Guide — Flip for Details",
  "cards": [
    {
      "front": "🧊 LOW TEMPERATURE (0.0 - 0.3)\n\nDeterministic and focused",
      "back": "BEST FOR: Code, math, factual questions, data analysis\n\nThe model always picks the most likely next token. Consistent, predictable, correct — but potentially repetitive.\n\nUSE WHEN: You need one right answer, not creative options."
    },
    {
      "front": "⚖️ MEDIUM TEMPERATURE (0.4 - 0.7)\n\nBalanced default",
      "back": "BEST FOR: General conversations, business writing, explanations\n\nGood mix of coherence and variety. The default for most AI chatbots.\n\nUSE WHEN: You want natural-sounding output that is still reliable."
    },
    {
      "front": "🔥 HIGH TEMPERATURE (0.8 - 1.0+)\n\nCreative and unpredictable",
      "back": "BEST FOR: Brainstorming, creative writing, generating diverse options\n\nThe model sometimes picks unlikely tokens, leading to surprising and creative output — but also more errors.\n\nUSE WHEN: You want ideas, not accuracy. Be prepared to filter."
    }
  ]
}'></div>

</div>

<!-- SECTION 4: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>

<div data-learn="QuizMC" data-props='{
  "title": "Prompt Anatomy",
  "questions": [
    {
      "q": "How does AI read the word \"unbelievable\"?",
      "options": ["As one token: unbelievable", "As individual characters: u-n-b-e-l-i-e-v-a-b-l-e", "As subword chunks like: un-believ-able", "As the dictionary definition of the word"],
      "correct": 2,
      "explanation": "AI tokenizers break words into subword chunks. Unbelievable becomes something like un + believ + able. The model never sees raw text — only token IDs (numbers)."
    },
    {
      "q": "Claude has a 200K token context window. What does this mean?",
      "options": ["It can remember 200,000 previous conversations", "Your prompt plus its response must fit within 200,000 tokens total", "It can process 200,000 words per second", "It has 200,000 neurons"],
      "correct": 1,
      "explanation": "The context window is the model working memory. Everything it can see at once — your prompt, conversation history, and its response — must fit within this limit."
    },
    {
      "q": "You are writing a system prompt for a customer service bot. It should be helpful but never make promises about refunds. Where does this instruction go?",
      "options": ["In the user message", "In the system prompt — it gets processed before any user messages", "In a separate configuration file", "Nowhere — AI cannot follow such instructions"],
      "correct": 1,
      "explanation": "System prompts set behavioral rules before any user interaction. They are the ideal place for personality, constraints, and behavioral guardrails."
    }
  ]
}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Every prompt is a performance.</strong> Your words get chopped into tokens, fed through the context window alongside a system prompt, shaped by temperature, and out comes a response. Understanding this anatomy turns you from a user into an engineer.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-playground" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Playground →</a>
</div>

</div>

<script>
var tokenColors=['#c084fc','#fb923c','#38bdf8','#34d399','#f472b6','#facc15','#a78bfa','#fb7185','#2dd4bf','#fbbf24'];

function simpleTokenize(text){
  if(!text.trim())return[];
  var tokens=[];
  var regex=/(\s+|[.,!?;:'"()\[\]{}]|n't|'s|'re|'ve|'ll|'d|[A-Z][a-z]*|[a-z]+|[0-9]+|.)/g;
  var match;
  while((match=regex.exec(text))!==null){
    var t=match[0];
    if(t.length>6){for(var i=0;i<t.length;i+=Math.ceil(t.length/Math.ceil(t.length/4))){tokens.push(t.slice(i,i+Math.ceil(t.length/Math.ceil(t.length/4))))}}
    else{tokens.push(t)}
  }
  return tokens.filter(function(t){return t});
}

var textarea=document.getElementById('promptInput');
var tokenDisplay=document.getElementById('tokenDisplay');
var debounceTimer;

function updateTokenizer(){
  if(!textarea)return;
  var text=textarea.value;var tokens=simpleTokenize(text);
  var words=text.trim()?text.trim().split(/\s+/).length:0;
  document.getElementById('tokenCount').textContent=tokens.length;
  document.getElementById('charCount').textContent=text.length;
  document.getElementById('wordCount').textContent=words;
  var pct=Math.min((tokens.length/128000)*100,100);
  document.getElementById('contextPct').textContent=pct.toFixed(pct<1?3:1)+'%';
  document.getElementById('contextFill').style.width=Math.max(pct,0.5)+'%';
  if(tokenDisplay){tokenDisplay.innerHTML='';tokens.forEach(function(t,i){var span=document.createElement('span');span.className='token';span.textContent=t;var color=tokenColors[i%tokenColors.length];span.style.background=color+'20';span.style.color=color;span.style.border='1px solid '+color+'30';span.style.animationDelay=(i*30)+'ms';tokenDisplay.appendChild(span)})}
}

if(textarea){textarea.addEventListener('input',function(){clearTimeout(debounceTimer);debounceTimer=setTimeout(updateTokenizer,150)});updateTokenizer()}

var tempResponses={
  low:["a question philosophers have debated for millennia. According to research in positive psychology, it involves finding purpose, building meaningful relationships, and contributing to something larger than oneself.","fundamentally about connection and growth. Studies show that people who report the highest life satisfaction prioritize relationships, personal development, and service to others."],
  mid:["a beautiful paradox — we search for it endlessly, yet often find it in the quiet moments we weren't looking. Purpose, love, and a really good cup of coffee.","something each person must discover through experience. Some find it in creation, others in connection. The search itself might be the point."],
  high:["a jazz improvisation played on a quantum harmonica while riding a bicycle made of frozen laughter through a tunnel of recursive dreams!","actually 42, but only if you measure it in units of sunset-colored existential wonder divided by the square root of a grandmother's cookie recipe."]
};

var tempSlider=document.getElementById('tempSlider');
var tempOutput=document.getElementById('tempOutput');

function updateTemp(){
  if(!tempSlider||!tempOutput)return;
  var v=tempSlider.value/100;
  document.getElementById('tempVal').textContent=v.toFixed(2);
  var responses;
  if(v<0.3)responses=tempResponses.low;else if(v<0.7)responses=tempResponses.mid;else responses=tempResponses.high;
  tempOutput.textContent='"'+responses[Math.floor(Math.random()*responses.length)]+'"';
  tempOutput.style.opacity=0;requestAnimationFrame(function(){tempOutput.style.transition='opacity .4s';tempOutput.style.opacity=1});
}
if(tempSlider){tempSlider.addEventListener('input',updateTemp);updateTemp()}
</script>