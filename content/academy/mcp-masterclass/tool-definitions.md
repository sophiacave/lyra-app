---
title: "Tool Definitions"
course: "mcp-masterclass"
order: 5
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>
  
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 5</div>
  <h1>Tool Definitions</h1>
  <p class="subtitle">The tool definition is how Claude knows what your tool does. Build one interactively and watch the JSON schema generate in real-time.</p>

  <div class="section">
    <h2>Build a Tool Definition</h2>
    <p><strong>JSON Schema</strong> is a standard way to describe the shape of data -- what fields exist, what types they are (string, number, etc.), and which ones are required. Claude reads these schemas to understand what inputs your tool needs and how to format them correctly.</p>
    <p><strong>Why tool definitions matter:</strong> Without a clear definition, Claude has no way to know your tool exists or how to call it. The definition is your tool's instruction manual -- the better you describe it, the more accurately Claude will use it. Fill in the fields below and watch the schema update live on the right.</p>
  </div>

  <div class="builder">
    <div class="builder-header">Tool Definition Builder</div>
    <div class="builder-body">
      <div class="field">
        <label>Tool Name</label>
        <input type="text" id="toolName" value="search_documents" oninput="updatePreview()" placeholder="e.g. search_documents">
      </div>
      <div class="field">
        <label>Description (what Claude reads to decide when to use this tool)</label>
        <textarea id="toolDesc" oninput="updatePreview()" placeholder="e.g. Search through a document collection by keyword or semantic query">Search through a document collection by keyword or semantic query. Returns matching documents ranked by relevance.</textarea>
      </div>
      <div class="field">
        <label>Input Parameters</label>
        <button class="add-param-btn" onclick="addParam()">+ Add Parameter</button>
      </div>
    </div>
  </div>

  <div class="preview-split">
    <div class="preview-panel">
      <div class="panel-header">JSON Schema Output</div>
      </div>
    <div class="preview-panel">
      <div class="panel-header">server.tool() Code</div>
      </div>
  </div>

  <div class="test-area">
    <h3>Test Your Tool</h3>
    <p style="font-size:.85rem;color:#a1a1aa;margin-bottom:1rem">Enter example values for each parameter to see what a tool call would look like:</p>
    <button class="test-btn" onclick="testTool()">Run Test Call</button>
    </div>

  <div class="ai-decision">
    <h3>How Claude Reads Tool Definitions</h3>
    <p>When Claude receives a user message, it checks all available tool definitions. The <span class="highlight">description</span> field is the most important — it tells Claude WHEN to use the tool. The <span class="highlight">parameter descriptions</span> tell Claude WHAT to pass. Write clear, specific descriptions and Claude will use your tools correctly without any prompt engineering.</p>
  </div>

  <button class="complete-btn" id="completeBtn" onclick="complete()">Complete Lesson &mdash; Earn 250 XP</button>
  
</div>

<script>
let params = [
  {name:'query', type:'string', desc:'The search query text', required:true},
  {name:'limit', type:'number', desc:'Maximum results to return', required:false}
];

function renderParams(){
  const list = document.getElementById('paramsList');
  list.innerHTML = params.map((p,i) => `
    <div class="param-row">
      <input type="text" value="${p.name}" placeholder="name" oninput="params[${i}].name=this.value;updatePreview()">
      <select onchange="params[${i}].type=this.value;updatePreview()">
        <option value="string" ${p.type==='string'?'selected':''}>string</option>
        <option value="number" ${p.type==='number'?'selected':''}>number</option>
        <option value="boolean" ${p.type==='boolean'?'selected':''}>boolean</option>
      </select>
      <input type="text" value="${p.desc}" placeholder="description" oninput="params[${i}].desc=this.value;updatePreview()">
      <div style="display:flex;align-items:center;gap:.5rem">
        <label class="req-check"><input type="checkbox" ${p.required?'checked':''} onchange="params[${i}].required=this.checked;updatePreview()">req</label>
        <button class="remove-btn" onclick="params.splice(${i},1);renderParams();updatePreview()">&times;</button>
      </div>
    </div>
  `).join('');
}

function addParam(){
  params.push({name:'', type:'string', desc:'', required:false});
  renderParams();
  updatePreview();
}

function updatePreview(){
  const name = document.getElementById('toolName').value || 'my_tool';
  const desc = document.getElementById('toolDesc').value || 'Tool description';

  // JSON Schema
  const schema = {
    name: name,
    description: desc,
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  };
  params.forEach(p => {
    if(!p.name) return;
    schema.inputSchema.properties[p.name] = {type: p.type, description: p.desc};
    if(p.required) schema.inputSchema.required.push(p.name);
  });

  const jsonStr = JSON.stringify(schema, null, 2)
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="json-str">"$1"</span>')
    .replace(/: (\d+)/g, ': <span class="json-num">$1</span>')
    .replace(/: (true|false)/g, ': <span class="json-bool">$1</span>');
  document.getElementById('jsonPreview').innerHTML = jsonStr;

  // Code preview
  const zodParams = params.filter(p=>p.name).map(p => {
    let z = `z.${p.type}()`;
    if(p.desc) z += `.describe("${p.desc}")`;
    if(!p.required) z += `.optional()`;
    return `  ${p.name}: ${z}`;
  }).join(',\n');

  document.getElementById('codePreview').innerHTML = `server.tool(
  <span class="json-str">"${name}"</span>,
  {
${zodParams}
  },
  async (args) => {
    <span style="color:#52525b">// Your logic here</span>
    return {
      content: [{
        type: <span class="json-str">"text"</span>,
        text: JSON.stringify(result)
      }]
    };
  }
);`;

  // Test inputs
  document.getElementById('testInputs').innerHTML = params.filter(p=>p.name).map(p => `
    <div class="field">
      <label>${p.name} (${p.type})${p.required?' *':''}</label>
      <input type="${p.type==='number'?'number':'text'}" id="test-${p.name}" placeholder="${p.desc}" value="${p.type==='number'?'10':p.name==='query'?'machine learning':''}">
    </div>
  `).join('');
}

function testTool(){
  const name = document.getElementById('toolName').value || 'my_tool';
  const args = {};
  params.filter(p=>p.name).forEach(p => {
    const el = document.getElementById('test-'+p.name);
    if(el){
      args[p.name] = p.type==='number' ? Number(el.value) : p.type==='boolean' ? el.value==='true' : el.value;
    }
  });

  const callObj = {
    method: 'tools/call',
    params: { name: name, arguments: args }
  };

  const result = document.getElementById('testResult');
  result.classList.add('visible');
  result.innerHTML = `<span style="color:#71717a">// MCP Request (JSON-RPC)</span>\n${JSON.stringify(callObj, null, 2)}\n\n<span style="color:#71717a">// Simulated Response</span>\n${JSON.stringify({content:[{type:'text',text:'3 documents found matching "'+args.query+'"'}]}, null, 2)}`;
}

renderParams();
updatePreview();

function complete(){
  const btn = document.getElementById('completeBtn');
  if(btn.disabled) return;
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  progress['tool-definitions'] = true;
  localStorage.setItem('mcp-masterclass-progress', JSON.stringify(progress));
  LO.completeLesson('mcp-masterclass', 5, 250);
  btn.textContent = 'Lesson Complete!';
  btn.disabled = true;
}
(function(){
  const progress = JSON.parse(localStorage.getItem('mcp-masterclass-progress')||'{}');
  if(progress['tool-definitions']){
    const btn = document.getElementById('completeBtn');
    btn.textContent = 'Lesson Complete!';
    btn.disabled = true;
  }
})();
</script>
