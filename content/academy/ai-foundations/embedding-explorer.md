---
title: "Embedding Explorer"
course: "ai-foundations"
order: 8
type: "lesson"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 8 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Embedding <span class="accent">Explorer.</span></h1>
  <p class="sub">Click words to see their vectors. Click two to compute real cosine similarity.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to read word vectors and their coordinates</li>
    <li>What cosine similarity measures and why it matters</li>
    <li>How vector analogy calculations work</li>
    <li>Why embeddings power search, recommendations, and RAG</li>
  </ul>
</div>

<!-- SECTION 1: INTERACTIVE EXPLORER -->
<div class="lesson-section">
  <span class="section-label">Explore</span>
  <h2 class="section-title">Click words to compare their vectors.</h2>
  <p class="section-text">Click one word to see its vector. Click a second to compute the angle and cosine similarity between them.</p>

  <canvas id="embedCanvas" height="480"></canvas>

  <div class="info-panel">
    <div class="info-box" id="vecA"><h4>Word A</h4><div class="vec" id="vecAtext">Click a word...</div></div>
    <div class="info-box" id="vecB"><h4>Word B</h4><div class="vec" id="vecBtext">Click a second word...</div></div>
  </div>

  <div class="formula-display" id="formulaBox" style="display:none">
    <span class="label">Cosine Similarity</span>
    <pre id="formulaContent"></pre>
  </div>
</div>

<!-- SECTION 2: ANALOGY CALCULATOR -->
<div class="lesson-section">
  <span class="section-label">Experiment</span>
  <h2 class="section-title">Vector analogy calculator.</h2>
  <p class="section-text">Try king - man + woman = queen. Then experiment with other combinations.</p>

  <div class="analogy-section">
    <div class="analogy-row">
      <select id="anaA"></select>
      <span>&minus;</span>
      <select id="anaB"></select>
      <span>+</span>
      <select id="anaC"></select>
      <span>=</span>
      <span id="anaResult" style="color:#34d399;font-weight:700">?</span>
    </div>
    <pre id="analogyMath" style="font-size:.75rem;color:#a1a1aa;margin-top:.5rem;white-space:pre-wrap"></pre>
  </div>
</div>

<!-- SECTION 3: CONCEPTS -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">How similarity is measured.</h2>

<div data-learn="FlashDeck" data-props='{"title":"Embedding Explorer Concepts","cards":[{"front":"Cosine Similarity","back":"Measures the cosine of the angle between two vectors. 1.0 = identical direction (synonyms), 0.0 = perpendicular (unrelated), -1.0 = opposite (antonyms)."},{"front":"Word Vector","back":"A list of numbers (typically 768-1536 dimensions) that represents a word\\\'s meaning. Words used in similar contexts get similar vectors."},{"front":"Vector Analogy","back":"Math on word vectors captures relationships. king - man + woman = queen works because the directional offset encodes the concept of gender."},{"front":"Embedding Space","back":"The high-dimensional coordinate system where every word has a position. Similar concepts cluster together — geometry encodes meaning."},{"front":"RAG (Retrieval-Augmented Generation)","back":"Converts your query to a vector, finds the most similar document vectors in a database, and feeds those documents to the AI as context before generating a response."}]}'></div>


<div data-learn="QuizMC" data-props='{"title":"Embedding Explorer Quiz","questions":[{"q":"Which word pair would have the HIGHEST cosine similarity?","options":["happy and banana","car and automobile","king and purple","dog and skyscraper"],"correct":1,"explanation":"Car and automobile are synonyms — they appear in nearly identical contexts so their vectors point in almost the same direction. Cosine similarity would be around 0.95."},{"q":"In the analogy Paris : France :: Tokyo : ?, the answer is Japan because:","options":["The model memorized geography","The vector offset from Paris to France (capital-of) applied to Tokyo lands near Japan","All cities are near all countries in embedding space","Tokyo and France are spelled similarly"],"correct":1,"explanation":"The direction from Paris to France represents capital-of. This same directional offset applied to Tokyo points toward Japan. The model learned these relationships from patterns in text."}]}'></div>

  <div class="narration" style="margin-top:1.5rem">
    <strong>Embeddings turn language into geometry.</strong> Cosine similarity measures the cosine of the angle between two vectors — 1.0 means identical direction, 0 means unrelated, -1.0 means opposite. Real embeddings use 768+ dimensions, but the math is identical to what you see here in 2D.
  </div>
</div>

<!-- NEXT LESSON -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-foundations/similarity-challenge" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Similarity Challenge →</a>
</div>

</div>

<script>
var embWords={king:{x:3.8,y:3.5,color:'#c084fc'},queen:{x:3.2,y:4.2,color:'#c084fc'},prince:{x:4.2,y:3.0,color:'#c084fc'},princess:{x:3.6,y:3.8,color:'#c084fc'},man:{x:1.5,y:1.2,color:'#fb923c'},woman:{x:0.9,y:1.9,color:'#fb923c'},boy:{x:1.9,y:0.7,color:'#fb923c'},girl:{x:1.3,y:1.4,color:'#fb923c'},cat:{x:-2.0,y:1.5,color:'#34d399'},dog:{x:-1.5,y:1.0,color:'#34d399'},puppy:{x:-1.2,y:0.6,color:'#34d399'},kitten:{x:-1.7,y:1.8,color:'#34d399'},apple:{x:-1.0,y:-2.5,color:'#f472b6'},banana:{x:-0.5,y:-2.8,color:'#f472b6'},pizza:{x:0.8,y:-2.2,color:'#f472b6'},sushi:{x:1.2,y:-2.6,color:'#f472b6'},computer:{x:3.0,y:-1.5,color:'#38bdf8'},robot:{x:3.5,y:-0.8,color:'#38bdf8'},code:{x:2.5,y:-1.8,color:'#38bdf8'},AI:{x:3.2,y:-1.0,color:'#38bdf8'}};
var wordList=Object.keys(embWords);
var canvas=document.getElementById('embedCanvas');
if(canvas){
var ctx=canvas.getContext('2d');var W,H,dpr;var selectedA=null,selectedB=null;var RANGE=5.5;

function toScreen(vx,vy){var pad=50;return{sx:pad+((vx+RANGE)/(2*RANGE))*(W-2*pad),sy:(H-pad)-((vy+RANGE)/(2*RANGE))*(H-2*pad)}}

function resizeCanvas(){dpr=window.devicePixelRatio||1;var rect=canvas.getBoundingClientRect();W=rect.width;H=480;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}

function cosineSim(a,b){var dot=a.x*b.x+a.y*b.y;var ma=Math.sqrt(a.x*a.x+a.y*a.y);var mb=Math.sqrt(b.x*b.x+b.y*b.y);return(ma===0||mb===0)?0:dot/(ma*mb)}
function angleBetween(a,b){return Math.acos(Math.max(-1,Math.min(1,cosineSim(a,b))))}

function drawArrowLine(x1,y1,x2,y2,color){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();var angle=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-10*Math.cos(angle-0.4),y2-10*Math.sin(angle-0.4));ctx.lineTo(x2-10*Math.cos(angle+0.4),y2-10*Math.sin(angle+0.4));ctx.closePath();ctx.fill()}

function draw(){
  ctx.clearRect(0,0,W,H);var pad=50;
  ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
  for(var v=-5;v<=5;v++){var g1=toScreen(v,0);ctx.beginPath();ctx.moveTo(g1.sx,pad);ctx.lineTo(g1.sx,H-pad);ctx.stroke();var g2=toScreen(0,v);ctx.beginPath();ctx.moveTo(pad,g2.sy);ctx.lineTo(W-pad,g2.sy);ctx.stroke()}
  var origin=toScreen(0,0);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pad,origin.sy);ctx.lineTo(W-pad,origin.sy);ctx.stroke();ctx.beginPath();ctx.moveTo(origin.sx,pad);ctx.lineTo(origin.sx,H-pad);ctx.stroke();

  if(selectedA&&selectedB){var a=embWords[selectedA],b=embWords[selectedB];var oS=toScreen(0,0);var aS=toScreen(a.x,a.y);var bS=toScreen(b.x,b.y);drawArrowLine(oS.sx,oS.sy,aS.sx,aS.sy,'rgba(192,132,252,0.7)');drawArrowLine(oS.sx,oS.sy,bS.sx,bS.sy,'rgba(251,146,60,0.7)');var theta=angleBetween(a,b);var angleA=Math.atan2(-(aS.sy-oS.sy),aS.sx-oS.sx);var angleB=Math.atan2(-(bS.sy-oS.sy),bS.sx-oS.sx);ctx.strokeStyle='rgba(52,211,153,0.5)';ctx.lineWidth=2;ctx.beginPath();var diff=angleB-angleA;while(diff>Math.PI)diff-=2*Math.PI;while(diff<-Math.PI)diff+=2*Math.PI;ctx.arc(oS.sx,oS.sy,40,-angleA,-angleB,diff<0);ctx.stroke();var midA=(angleA+angleB)/2;ctx.fillStyle='#34d399';ctx.font='700 12px Inter';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u03B8='+(theta*180/Math.PI).toFixed(1)+'\u00B0',oS.sx+Math.cos(-midA)*54,oS.sy+Math.sin(-midA)*54)}
  else if(selectedA){var sa=embWords[selectedA];var oSa=toScreen(0,0);var aSa=toScreen(sa.x,sa.y);drawArrowLine(oSa.sx,oSa.sy,aSa.sx,aSa.sy,'rgba(192,132,252,0.7)')}

  var names=Object.keys(embWords);
  for(var i=0;i<names.length;i++){var name=names[i];var w=embWords[name];var pos=toScreen(w.x,w.y);var isSel=(name===selectedA||name===selectedB);
  ctx.beginPath();ctx.arc(pos.sx,pos.sy,isSel?7:5,0,Math.PI*2);ctx.fillStyle=isSel?'#fff':w.color;ctx.fill();
  if(isSel){ctx.strokeStyle=w.color;ctx.lineWidth=2;ctx.stroke()}
  ctx.fillStyle=isSel?'#fff':w.color;ctx.font=(isSel?'700':'600')+' '+(isSel?'12':'11')+'px Inter';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(name,pos.sx,pos.sy-(isSel?10:8))}
}

canvas.addEventListener('click',function(e){var rect=canvas.getBoundingClientRect();var mx=e.clientX-rect.left;var my=e.clientY-rect.top;var closest=null,cd=25;var names=Object.keys(embWords);for(var i=0;i<names.length;i++){var w=embWords[names[i]];var pos=toScreen(w.x,w.y);var d=Math.sqrt((mx-pos.sx)*(mx-pos.sx)+(my-pos.sy)*(my-pos.sy));if(d<cd){closest=names[i];cd=d}}if(!closest)return;if(!selectedA||selectedB){selectedA=closest;selectedB=null;updateInfo()}else if(closest!==selectedA){selectedB=closest;updateInfo()}draw()});

function updateInfo(){
  if(selectedA){var a=embWords[selectedA];document.getElementById('vecAtext').innerHTML='<strong style="color:#e5e5e5">'+selectedA+'</strong> = ['+a.x.toFixed(2)+', '+a.y.toFixed(2)+']'}else{document.getElementById('vecAtext').textContent='Click a word...'}
  if(selectedB){var b=embWords[selectedB];document.getElementById('vecBtext').innerHTML='<strong style="color:#e5e5e5">'+selectedB+'</strong> = ['+b.x.toFixed(2)+', '+b.y.toFixed(2)+']';
  var a2=embWords[selectedA];var dot=a2.x*b.x+a2.y*b.y;var magA=Math.sqrt(a2.x*a2.x+a2.y*a2.y);var magB=Math.sqrt(b.x*b.x+b.y*b.y);var cos=cosineSim(a2,b);var theta=angleBetween(a2,b);
  var box=document.getElementById('formulaBox');box.style.display='block';
  document.getElementById('formulaContent').innerHTML='<span class="hl">cos(\u03B8) = (A \u00B7 B) / (|A| \u00D7 |B|)</span>\n\nA \u00B7 B = '+dot.toFixed(3)+'\n|A| = '+magA.toFixed(3)+'  |B| = '+magB.toFixed(3)+'\n\n<span class="res">Cosine Similarity = '+cos.toFixed(4)+'</span>\n<span class="hl">\u03B8 = '+(theta*180/Math.PI).toFixed(1)+'\u00B0</span>'}
  else{document.getElementById('vecBtext').textContent='Click a second word...';document.getElementById('formulaBox').style.display='none'}
}

var anaA=document.getElementById('anaA'),anaB=document.getElementById('anaB'),anaC=document.getElementById('anaC');
wordList.forEach(function(w){[anaA,anaB,anaC].forEach(function(sel){var opt=document.createElement('option');opt.value=w;opt.textContent=w;sel.appendChild(opt)})});
anaA.value='king';anaB.value='man';anaC.value='woman';

function computeAnalogy(){var a=embWords[anaA.value],b=embWords[anaB.value],c=embWords[anaC.value];var rx=a.x-b.x+c.x,ry=a.y-b.y+c.y;var best=null,bd=Infinity;var names=Object.keys(embWords);for(var i=0;i<names.length;i++){var name=names[i];if(name===anaA.value||name===anaB.value||name===anaC.value)continue;var w=embWords[name];var d=Math.sqrt((w.x-rx)*(w.x-rx)+(w.y-ry)*(w.y-ry));if(d<bd){best=name;bd=d}}document.getElementById('anaResult').textContent=best||'?';if(best){document.getElementById('analogyMath').innerHTML='['+a.x.toFixed(2)+', '+a.y.toFixed(2)+'] \u2212 ['+b.x.toFixed(2)+', '+b.y.toFixed(2)+'] + ['+c.x.toFixed(2)+', '+c.y.toFixed(2)+'] = ['+rx.toFixed(2)+', '+ry.toFixed(2)+']\nNearest: <span class="res">'+best+'</span> (distance: '+bd.toFixed(3)+')'}}

[anaA,anaB,anaC].forEach(function(sel){sel.addEventListener('change',computeAnalogy)});computeAnalogy();

window.addEventListener('resize',function(){resizeCanvas();draw()});resizeCanvas();draw();
}
</script>