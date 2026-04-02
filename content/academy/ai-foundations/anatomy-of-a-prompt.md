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

  <div style="display:grid;gap:.75rem;margin-top:.75rem">
    <div style="padding:1rem;border-radius:10px;background:rgba(192,132,252,.04);border:1px solid rgba(192,132,252,.1)">
      <strong style="color:#c084fc;font-size:.88rem">1. Tokens — how AI reads text</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">AI does not read words or characters. It reads <em>tokens</em> — subword chunks like "un" + "believ" + "able." Common words are one token; rare words get split. A token is roughly 4 characters or 0.75 words. This matters because you pay per token and your context window is measured in tokens.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.88rem">2. Context Window — the model's working memory</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Everything the model can see at once: your prompt, conversation history, and its response. Claude Opus 4.6 has a 1M token context window. GPT-4o has 128K. Once you exceed the window, the oldest content gets dropped. This is why long conversations can "forget" earlier context.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.88rem">3. System Prompt — the invisible instructions</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">A hidden message processed before any user input. It defines the AI's persona, rules, and constraints. The user never sees it, but it shapes every response. Think of it as giving the AI a job description before it starts work.</p>
    </div>
    <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.88rem">4. Temperature — creativity vs accuracy dial</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Controls randomness in the output. Low (0.0) = always picks the most likely word = deterministic, focused, correct. High (1.0) = sometimes picks unlikely words = creative, surprising, error-prone. Use low for code and facts, high for brainstorming.</p>
    </div>
  </div>

  <p class="section-text" style="margin-top:1.25rem">Here is a real API call showing all four concepts in action:</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — all four concepts in one API call</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-6"</span>,       <span style="color:#71717a"># which model</span>
    max_tokens=<span style="color:#fb923c">500</span>,                  <span style="color:#71717a"># ← context window budget</span>
    temperature=<span style="color:#fb923c">0.2</span>,                 <span style="color:#71717a"># ← low = factual, precise</span>
    system=<span style="color:#fbbf24">"You are a helpful coding tutor. "</span>  <span style="color:#71717a"># ← system prompt</span>
           <span style="color:#fbbf24">"Explain concepts simply. "</span>
           <span style="color:#fbbf24">"Always include a code example."</span>,
    messages=[                         <span style="color:#71717a"># ← user message (tokenized)</span>
        {<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
         <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"What is a list comprehension in Python?"</span>}
    ]
)

<span style="color:#71717a"># Check token usage</span>
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Input tokens:  </span>{response.usage.input_tokens}<span style="color:#fbbf24">"</span>)
<span style="color:#34d399">print</span>(<span style="color:#fbbf24">f"Output tokens: </span>{response.usage.output_tokens}<span style="color:#fbbf24">"</span>)
<span style="color:#34d399">print</span>(response.content[<span style="color:#fb923c">0</span>].text)</code></pre>
</div>
<p style="font-size:.85rem;color:#71717a;margin-top:.5rem">Every parameter in this call maps to one of the four concepts. The <code>system</code> message is the invisible instruction. The <code>messages</code> content gets tokenized. <code>max_tokens</code> limits the context window budget. <code>temperature</code> controls creativity.</p>

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

<div data-learn="FlashDeck" data-props='{"title":"Temperature Guide — Flip for Details","cards":[{"front":"🧊 LOW TEMPERATURE (0.0 - 0.3)\n\nDeterministic and focused","back":"BEST FOR: Code, math, factual questions, data analysis\n\nThe model always picks the most likely next token. Consistent, predictable, correct — but potentially repetitive.\n\nUSE WHEN: You need one right answer, not creative options."},{"front":"⚖️ MEDIUM TEMPERATURE (0.4 - 0.7)\n\nBalanced default","back":"BEST FOR: General conversations, business writing, explanations\n\nGood mix of coherence and variety. The default for most AI chatbots.\n\nUSE WHEN: You want natural-sounding output that is still reliable."},{"front":"🔥 HIGH TEMPERATURE (0.8 - 1.0+)\n\nCreative and unpredictable","back":"BEST FOR: Brainstorming, creative writing, generating diverse options\n\nThe model sometimes picks unlikely tokens, leading to surprising and creative output — but also more errors.\n\nUSE WHEN: You want ideas, not accuracy. Be prepared to filter."}]}'></div>

</div>

<!-- SECTION 4: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Test your understanding.</h2>

<div data-learn="QuizMC" data-props='{"title":"Prompt Anatomy","questions":[{"q":"How does AI read the word \"unbelievable\"?","options":["As one token: unbelievable","As individual characters: u-n-b-e-l-i-e-v-a-b-l-e","As subword chunks like: un-believ-able","As the dictionary definition of the word"],"correct":2,"explanation":"AI tokenizers break words into subword chunks. Unbelievable becomes something like un + believ + able. The model never sees raw text — only token IDs (numbers)."},{"q":"Claude has a 200K token context window. What does this mean?","options":["It can remember 200,000 previous conversations","Your prompt plus its response must fit within 200,000 tokens total","It can process 200,000 words per second","It has 200,000 neurons"],"correct":1,"explanation":"The context window is the model working memory. Everything it can see at once — your prompt, conversation history, and its response — must fit within this limit."},{"q":"You are writing a system prompt for a customer service bot. It should be helpful but never make promises about refunds. Where does this instruction go?","options":["In the user message","In the system prompt — it gets processed before any user messages","In a separate configuration file","Nowhere — AI cannot follow such instructions"],"correct":1,"explanation":"System prompts set behavioral rules before any user interaction. They are the ideal place for personality, constraints, and behavioral guardrails."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Every prompt is a performance.</strong> Your words get chopped into tokens, fed through the context window alongside a system prompt, shaped by temperature, and out comes a response. Understanding this anatomy turns you from a user into an engineer.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/prompt-playground" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Prompt Playground →</a>
</div>

</div>

<script type="text/x-lesson">
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
  var pct=Math.min((tokens.length/200000)*100,100);
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