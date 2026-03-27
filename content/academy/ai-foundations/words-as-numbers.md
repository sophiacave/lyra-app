---
title: "Words as Numbers"
course: "ai-foundations"
order: 7
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
      <span class="time-badge">~25 min</span>
    </div>
    <h1>Words as Numbers</h1>
    <p>Watch words become vectors in space — and discover that math can capture meaning.</p>
  </div>

  <div class="canvas-wrap">
    <canvas id="embedCanvas" width="800" height="500"></canvas>
    <div class="canvas-controls">
      <button onclick="resetView()">Reset View</button>
      <button onclick="toggleLabels()">Toggle Labels</button>
    </div>
  </div>

  <div class="equation" id="equationBox" style="display:none">
    <span class="eq-word king">king</span>
    <span class="eq-op">-</span>
    <span class="eq-word man">man</span>
    <span class="eq-op">+</span>
    <span class="eq-word woman">woman</span>
    <span class="eq-op">=</span>
    <span class="eq-word queen eq-result">queen</span>
  </div>

  <div class="step-nav">
    <button onclick="prevStep()">← Previous</button>
    <button class="primary" onclick="nextStep()">Next Step →</button>
  </div>

  <div class="insight-cards">
    <div class="insight">
      <h3>Vectors</h3>
      <p>Each word becomes a list of numbers (a vector). "Cat" might be [0.2, 0.8, -0.1, ...] — hundreds of dimensions capturing meaning.</p>
    </div>
    <div class="insight">
      <h3>Semantic Space</h3>
      <p>Similar words cluster together. "Happy", "joyful", and "delighted" are neighbors. "Sad" is far away. The space encodes meaning.</p>
    </div>
    <div class="insight">
      <h3>Vector Arithmetic</h3>
      <p>king - man + woman = queen. This isn't magic — the "royalty" direction minus the "male" direction plus "female" lands on "queen".</p>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete & Continue →</button>
</div>
<div class="footer-progress"><span id="footerProgress">0 of 9</span> lessons complete</div>

<script>
const canvas=document.getElementById('embedCanvas');
const ctx=canvas.getContext('2d');
const dpr=window.devicePixelRatio||1;
canvas.width=800*dpr;canvas.height=500*dpr;
ctx.scale(dpr,dpr);

const words=[
  {word:'king',x:500,y:120,color:'#c084fc',group:'royalty'},
  {word:'queen',x:350,y:120,color:'#34d399',group:'royalty'},
  {word:'man',x:500,y:300,color:'#38bdf8',group:'people'},
  {word:'woman',x:350,y:300,color:'#fb923c',group:'people'},
  {word:'prince',x:550,y:180,color:'#c084fc',group:'royalty'},
  {word:'princess',x:300,y:180,color:'#34d399',group:'royalty'},
  {word:'boy',x:550,y:350,color:'#38bdf8',group:'people'},
  {word:'girl',x:300,y:350,color:'#fb923c',group:'people'},
  {word:'dog',x:150,y:200,color:'#fbbf24',group:'animals'},
  {word:'cat',x:120,y:250,color:'#fbbf24',group:'animals'},
  {word:'puppy',x:180,y:230,color:'#fbbf24',group:'animals'},
  {word:'kitten',x:100,y:280,color:'#fbbf24',group:'animals'},
  {word:'happy',x:650,y:400,color:'#f472b6',group:'emotion'},
  {word:'sad',x:650,y:150,color:'#f472b6',group:'emotion'},
  {word:'joyful',x:680,y:430,color:'#f472b6',group:'emotion'},
];

let showLabels=true;
let currentStep=0;
let visibleWords=[];
let arrows=[];
let time=0;
let highlightWord=null;

const steps=[
  {
    narration:"<strong>Imagine a vast coordinate space.</strong> In this space, every word has a position — a specific set of coordinates that encodes its meaning. Let's start by placing some words...",
    visible:['king','queen','man','woman'],arrows:[],showEquation:false
  },
  {
    narration:"<strong>Notice the pattern.</strong> King and queen are at the top (royalty). Man and woman are at the bottom (commoners). Male words are on the right, female on the left. The AI learned this geometry from reading billions of sentences.",
    visible:['king','queen','man','woman','prince','princess','boy','girl'],
    arrows:[{from:'king',to:'queen',label:'gender'},{from:'man',to:'woman',label:'gender'},{from:'man',to:'king',label:'royalty'}],
    showEquation:false
  },
  {
    narration:"<strong>Now the magic: vector arithmetic.</strong> Take the vector for 'king', subtract the direction of 'man', add the direction of 'woman'. Where do you land? Right on 'queen'. The math captures the concept: royalty + female = queen.",
    visible:['king','queen','man','woman'],
    arrows:[{from:'king',to:'man',label:'subtract',color:'#ef4444'},{from:'man',to:'woman',label:'add',color:'#22c55e',fromWord:'woman'},{from:'king',to:'queen',label:'result',color:'#c084fc',dashed:true}],
    showEquation:true
  },
  {
    narration:"<strong>Similar things cluster together.</strong> Animals group in one region. People in another. Emotions in yet another. This is how AI 'understands' meaning — through geometry. Search engines use this: your query becomes a vector, and they find the nearest document vectors.",
    visible:words.map(w=>w.word),arrows:[],showEquation:false
  }
];

function renderStepDots(){
  document.getElementById('stepDots').innerHTML=steps.map((_,i)=>``).join('');
}

function setStep(s){
  currentStep=Math.max(0,Math.min(s,steps.length-1));
  const step=steps[currentStep];
  visibleWords=words.filter(w=>step.visible.includes(w.word));
  arrows=step.arrows;
  document.getElementById('narrationBox').innerHTML=step.narration;
  document.getElementById('equationBox').style.display=step.showEquation?'block':'none';
  renderStepDots();
}
function nextStep(){setStep(currentStep+1)}
function prevStep(){setStep(currentStep-1)}
function resetView(){setStep(0)}
function toggleLabels(){showLabels=!showLabels}

setStep(0);

function drawWord(w,alpha){
  const size=8;
  // Glow
  ctx.beginPath();ctx.arc(w.x,w.y,size+8,0,Math.PI*2);
  const g=ctx.createRadialGradient(w.x,w.y,size,w.x,w.y,size+12);
  g.addColorStop(0,w.color+'30');g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.globalAlpha=alpha;ctx.fill();

  // Dot
  ctx.beginPath();ctx.arc(w.x,w.y,size,0,Math.PI*2);
  ctx.fillStyle=w.color;ctx.globalAlpha=alpha;ctx.fill();

  // Label
  if(showLabels){
    ctx.font='600 13px Inter';ctx.textAlign='center';ctx.fillStyle='#e5e5e5';
    ctx.globalAlpha=alpha;ctx.fillText(w.word,w.x,w.y-16);
  }
  ctx.globalAlpha=1;
}

function drawArrow(from,to,label,color,dashed){
  const fw=words.find(w=>w.word===from);
  const tw=words.find(w=>w.word===to);
  if(!fw||!tw)return;
  ctx.beginPath();
  if(dashed)ctx.setLineDash([6,4]);
  ctx.moveTo(fw.x,fw.y);ctx.lineTo(tw.x,tw.y);
  ctx.strokeStyle=color||'rgba(255,255,255,.2)';
  ctx.lineWidth=2;ctx.stroke();
  ctx.setLineDash([]);

  // Arrowhead
  const angle=Math.atan2(tw.y-fw.y,tw.x-fw.x);
  const ax=tw.x-12*Math.cos(angle);
  const ay=tw.y-12*Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(tw.x-8*Math.cos(angle),tw.y-8*Math.sin(angle));
  ctx.lineTo(ax-6*Math.cos(angle-Math.PI/6),ay-6*Math.sin(angle-Math.PI/6));
  ctx.lineTo(ax-6*Math.cos(angle+Math.PI/6),ay-6*Math.sin(angle+Math.PI/6));
  ctx.fillStyle=color||'rgba(255,255,255,.3)';ctx.fill();

  // Label
  if(label){
    const mx=(fw.x+tw.x)/2;const my=(fw.y+tw.y)/2;
    ctx.font='600 10px Inter';ctx.textAlign='center';
    ctx.fillStyle=color||'#71717a';ctx.fillText(label,mx,my-8);
  }
}

function animate(){
  time++;
  ctx.clearRect(0,0,800,500);

  // Grid dots
  for(let x=0;x<800;x+=40){
    for(let y=0;y<500;y+=40){
      ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,.03)';ctx.fill();
    }
  }

  // Arrows
  arrows.forEach(a=>{
    const progress=Math.min(1,(time%120)/60);
    if(progress>0)drawArrow(a.from,a.to,a.label,a.color,a.dashed);
  });

  // Words with floating animation
  visibleWords.forEach((w,i)=>{
    const oy=Math.sin(time*0.02+i)*3;
    const orig=words.find(ww=>ww.word===w.word);
    drawWord({...orig,y:orig.y+oy},1);
  });

  requestAnimationFrame(animate);
}
animate();

function getProgress(){try{return JSON.parse(localStorage.getItem('ai-foundations-progress'))||{}}catch(e){return{}}}
function updateFooter(){
  const p=getProgress();const c=Object.keys(p).filter(k=>p[k]).length;
  document.getElementById('footerProgress').textContent=c+' of 9';
  if(p['words-as-numbers']){document.getElementById('completeBtn').textContent='Completed ✓';document.getElementById('completeBtn').classList.add('done')}
}
function completeLesson(){
  const p=getProgress();p['words-as-numbers']=true;localStorage.setItem('ai-foundations-progress',JSON.stringify(p));
  LO_NAV.goNext();
}
updateFooter();
</script>
