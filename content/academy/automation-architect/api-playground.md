---
title: "API Playground"
course: "automation-architect"
order: 5
type: "lab"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<header class="lesson-header">
  <div class="lesson-badge">Module 2 &middot; Interactive</div>
  <h1>API Playground</h1>
  <p>A fake API sandbox. Send real-looking requests and see how APIs respond. No backend needed.</p>
</header>

<div class="content">
  <div class="sandbox">
    <div class="sandbox-header">
      <div class="sandbox-title">API Sandbox v1.0</div>
    </div>
    <div class="request-bar">
      <select class="method-select" id="methodSelect">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input class="url-input" id="urlInput" value="/users" placeholder="/endpoint">
      <button class="send-btn" onclick="sendRequest()">Send</button>
    </div>
    <div class="body-section" id="bodySection">
      <label>Request Body (JSON)</label>
      <textarea class="body-input" id="bodyInput" placeholder='{ "key": "value" }'></textarea>
    </div>
    <div class="response-section">
      <div class="response-header">
        <div class="response-label">Response</div>
        </div>
      <div class="response-body" id="responseBody">// Send a request to see the response</div>
    </div>
  </div>

  <div class="examples">
    <h2>Try These Examples</h2>
    <div class="example-grid">
      <div class="example-btn" onclick="loadExample('GET','/users','')">
        <div class="example-method get">GET</div>
        <div class="example-path">/users</div>
        <div class="example-desc">List all users</div>
      </div>
      <div class="example-btn" onclick="loadExample('POST','/orders',JSON.stringify({product:'Pro Plan',amount:7900,customer:'cus_42'},null,2))">
        <div class="example-method post">POST</div>
        <div class="example-path">/orders</div>
        <div class="example-desc">Create a new order</div>
      </div>
      <div class="example-btn" onclick="loadExample('PUT','/settings',JSON.stringify({theme:'dark',notifications:true},null,2))">
        <div class="example-method put">PUT</div>
        <div class="example-path">/settings</div>
        <div class="example-desc">Update user settings</div>
      </div>
    </div>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson &mdash; Earn 75 XP</button>
</div>

<footer class="progress-footer">
  <p>Lesson 5 of 9 &middot; Automation Architect</p>
</footer>

<script>
const SLUG='api-playground';
const STORAGE_KEY='automation-architect-progress';

const fakeDB={
  'GET /users':{status:200,body:{users:[{id:1,name:"Alice Chen",email:"alice@example.com",plan:"pro"},{id:2,name:"Bob Patel",email:"bob@example.com",plan:"free"},{id:3,name:"Cara Diaz",email:"cara@example.com",plan:"enterprise"}],total:3}},
  'GET /users/1':{status:200,body:{id:1,name:"Alice Chen",email:"alice@example.com",plan:"pro",created:"2025-01-15"}},
  'GET /orders':{status:200,body:{orders:[{id:"ord_001",product:"Pro Plan",amount:7900,status:"completed"},{id:"ord_002",product:"Enterprise",amount:29900,status:"pending"}]}},
  'GET /settings':{status:200,body:{theme:"light",notifications:true,timezone:"UTC",language:"en"}},
  'POST /users':{status:201,body:{id:4,name:"New User",email:"new@user.com",created:"2026-03-23",message:"User created successfully"}},
  'POST /orders':{status:201,body:{id:"ord_003",status:"created",message:"Order placed successfully",estimated_delivery:"2026-03-26"}},
  'PUT /settings':{status:200,body:{updated:true,message:"Settings saved successfully"}},
  'PUT /users/1':{status:200,body:{id:1,updated:true,message:"User updated successfully"}},
  'DELETE /users/1':{status:200,body:{deleted:true,id:1,message:"User removed"}},
  'DELETE /orders/1':{status:200,body:{deleted:true,id:"ord_001",message:"Order cancelled"}},
};

function loadExample(method,url,body){
  document.getElementById('methodSelect').value=method;
  document.getElementById('urlInput').value=url;
  document.getElementById('bodyInput').value=body;
  sendRequest();
}

function syntaxHighlight(json){
  if(typeof json!=='string')json=JSON.stringify(json,null,2);
  return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,match=>{
    let cls='num';
    if(/^"/.test(match)){cls=/:$/.test(match)?'key':'str'}
    else if(/true|false/.test(match)){cls='bool'}
    return`<span class="${cls}">${match}</span>`;
  });
}

function sendRequest(){
  const method=document.getElementById('methodSelect').value;
  const url=document.getElementById('urlInput').value.trim();
  const key=method+' '+url;
  const startTime=performance.now();

  setTimeout(()=>{
    const endTime=performance.now();
    const time=Math.round(endTime-startTime+Math.random()*100+50);

    let result=fakeDB[key];
    if(!result){
      // Try partial match
      const partial=Object.keys(fakeDB).find(k=>k.startsWith(method)&&url.startsWith(k.split(' ')[1]));
      if(partial)result=fakeDB[partial];
    }

    if(!result){
      if(url==='/'||url===''){
        result={status:200,body:{api:"Like One Sandbox API",version:"1.0",endpoints:["/users","/orders","/settings"]}};
      }else{
        result={status:404,body:{error:"Not Found",message:`No endpoint matches ${method} ${url}`,available_endpoints:["/users","/orders","/settings"]}};
      }
    }

    // Merge request body into response for POST/PUT
    if((method==='POST'||method==='PUT')&&document.getElementById('bodyInput').value.trim()){
      try{
        const reqBody=JSON.parse(document.getElementById('bodyInput').value);
        result={...result,body:{...result.body,...reqBody}};
      }catch(e){}
    }

    const badge=document.getElementById('statusBadge');
    badge.style.display='inline-block';
    badge.textContent=result.status+(result.status===200?' OK':result.status===201?' Created':result.status===404?' Not Found':' Error');
    badge.className='status-badge '+(result.status<300?'status-2xx':result.status<500?'status-4xx':'status-5xx');

    document.getElementById('responseTime').textContent=time+'ms';
    document.getElementById('responseBody').innerHTML=syntaxHighlight(result.body);
  },200+Math.random()*300);

  document.getElementById('responseBody').innerHTML='<span style="color:#52525b">Sending request...</span>';
}

function completeLesson(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  progress[SLUG]=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const btn=document.getElementById('completeBtn');
  btn.textContent='Completed! +75 XP';
  btn.classList.add('done');
}

(function(){
  const progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(progress[SLUG]){
    document.getElementById('completeBtn').textContent='Completed! +75 XP';
    document.getElementById('completeBtn').classList.add('done');
  }
})();
</script>
