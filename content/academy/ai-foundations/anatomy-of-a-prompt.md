---
title: "Anatomy of a Prompt"
course: "ai-foundations"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Animated</span>
      <span class="xp-badge">+50 XP</span>
      <span class="time-badge">~20 min</span>
    </div>
    <h1>Anatomy of a Prompt</h1>
    <p>Watch your words get sliced into tokens in real-time. Understand the hidden structure behind every AI interaction.</p>
  </div>

  <div class="tokenizer-section">
    <h2>Live Tokenizer</h2>
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

  <div class="concepts">
    <div class="concept" onclick="toggleConcept(this)">
      <h3><span class="icon">🧩</span> Tokens</h3>
      <p>The atomic units AI reads — not words, not characters, but chunks.</p>
      <div class="detail">Most words become 1-2 tokens. "Unbelievable" might be ["un","believ","able"]. The model never sees raw text — only token IDs (numbers).</div>
    </div>
    <div class="concept" onclick="toggleConcept(this)">
      <h3><span class="icon">📏</span> Context Window</h3>
      <p>The model's working memory — everything it can "see" at once.</p>
      <div class="detail">GPT-4o: 128K tokens. Claude 3.5 Sonnet: 200K tokens. Gemini 1.5 Pro: 1M tokens. Your prompt + the response must fit inside. Longer context = slower + more expensive.</div>
    </div>
    <div class="concept" onclick="toggleConcept(this)">
      <h3><span class="icon">🎭</span> System Prompt</h3>
      <p>Hidden instructions that shape the AI's personality and behavior.</p>
      <div class="detail">Set before the user sees anything. "You are a helpful coding assistant" vs "You are a pirate." Same model, wildly different behavior — all from the system prompt.</div>
    </div>
    <div class="concept" onclick="toggleConcept(this)">
      <h3><span class="icon">🌡️</span> Temperature</h3>
      <p>Controls randomness — low = focused, high = creative.</p>
      <div class="detail">Temperature 0 = always pick the most likely next token. Temperature 1+ = sometimes pick unlikely tokens. Coding tasks want low temp. Creative writing wants higher.</div>
    </div>
  </div>

  <div class="temp-section">
    <h2>Temperature Demo</h2>
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

  <div class="narration">
    <strong>Every prompt is a performance.</strong> Your words get chopped into tokens, fed through the context window alongside a system prompt, shaped by temperature, and out comes a response. Understanding this anatomy turns you from a user into an engineer.
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete & Continue →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
// Simple BPE-like tokenizer simulation
const tokenColors=['#c084fc','#fb923c','#38bdf8','#34d399','#f472b6','#facc15','#a78bfa','#fb7185','#2dd4bf','#fbbf24'];

function simpleTokenize(text){
  if(!text.trim())return[];
  const tokens=[];
  // Split on spaces, punctuation, and common subword patterns
  const regex=/(\s+|[.,!?;:'"()\[\]{}]|n't|'s|'re|'ve|'ll|'d|[A-Z][a-z]*|[a-z]+|[0-9]+|.)/g;
  let match;
  while((match=regex.exec(text))!==null){
    const t=match[0];
    if(t.length>6){
      // Split long words into ~3-4 char chunks
      for(let i=0;i<t.length;i+=Math.ceil(t.length/Math.ceil(t.length/4))){
        tokens.push(t.slice(i,i+Math.ceil(t.length/Math.ceil(t.length/4))));
      }
    }else{
      tokens.push(t);
    }
  }
  return tokens.filter(t=>t);
}

const textarea=document.getElementById('promptInput');
const tokenDisplay=document.getElementById('tokenDisplay');
let debounceTimer;

function updateTokenizer(){
  const text=textarea.value;
  const tokens=simpleTokenize(text);
  const words=text.trim()?text.trim().split(/\s+/).length:0;

  document.getElementById('tokenCount').textContent=tokens.length;
  document.getElementById('charCount').textContent=text.length;
  document.getElementById('wordCount').textContent=words;

  const contextPct=Math.min((tokens.length/128000)*100,100);
  document.getElementById('contextPct').textContent=contextPct.toFixed(contextPct<1?3:1)+'%';
  document.getElementById('contextFill').style.width=Math.max(contextPct,0.5)+'%';

  tokenDisplay.innerHTML='';
  tokens.forEach((t,i)=>{
    const span=document.createElement('span');
    span.className='token';
    span.textContent=t;
    const color=tokenColors[i%tokenColors.length];
    span.style.background=color+'20';
    span.style.color=color;
    span.style.border='1px solid '+color+'30';
    span.style.animationDelay=(i*30)+'ms';
    tokenDisplay.appendChild(span);
  });
}

textarea.addEventListener('input',()=>{
  clearTimeout(debounceTimer);
  debounceTimer=setTimeout(updateTokenizer,150);
});
updateTokenizer();

function toggleConcept(el){
  el.classList.toggle('active');
}

// Temperature demo
const tempResponses={
  low:["a question philosophers have debated for millennia. According to research in positive psychology, it involves finding purpose, building meaningful relationships, and contributing to something larger than oneself.","fundamentally about connection and growth. Studies show that people who report the highest life satisfaction prioritize relationships, personal development, and service to others."],
  mid:["a beautiful paradox — we search for it endlessly, yet often find it in the quiet moments we weren't looking. Purpose, love, and a really good cup of coffee.","something each person must discover through experience. Some find it in creation, others in connection. The search itself might be the point.","not a destination but a dance. Between chaos and order, between self and others, we find meaning in the steps we take together."],
  high:["a jazz improvisation played on a quantum harmonica while riding a bicycle made of frozen laughter through a tunnel of recursive dreams!","actually 42, but only if you measure it in units of sunset-colored existential wonder divided by the square root of a grandmother's cookie recipe.","seventeen purple elephants debating Kant in a submarine. Wait, that's not right. Or is it? The universe winks and refuses to answer."]
};

const tempSlider=document.getElementById('tempSlider');
const tempOutput=document.getElementById('tempOutput');

function updateTemp(){
  const v=tempSlider.value/100;
  document.getElementById('tempVal').textContent=v.toFixed(2);
  let responses;
  if(v<0.3)responses=tempResponses.low;
  else if(v<0.7)responses=tempResponses.mid;
  else responses=tempResponses.high;
  tempOutput.textContent='"'+responses[Math.floor(Math.random()*responses.length)]+'"';
  tempOutput.style.opacity=0;
  requestAnimationFrame(()=>{tempOutput.style.transition='opacity .4s';tempOutput.style.opacity=1});
}
tempSlider.addEventListener('input',updateTemp);
updateTemp();

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['anatomy-of-a-prompt']){document.getElementById('completeBtn').textContent='Completed ✓';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  const p=getProgress();p['anatomy-of-a-prompt']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
