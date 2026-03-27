---
title: "AI Policy Template"
course: "ai-for-business"
order: 8
type: "lesson"
free: false
---<div class="wrap">
<a href="index.html" class="back">← Course Overview</a>
<div class="lesson-num">Lesson 8 of 10</div>
<h1>AI Policy Template</h1>
<p class="intro">Every company using AI needs a policy. Toggle sections on or off, customize it, and download a real policy document you can use immediately.</p>

<h2>Your Company</h2>
<div class="company-input">
<input type="text" id="company-name" placeholder="Company Name" value="">
<input type="text" id="effective-date" placeholder="Effective Date (e.g., April 1, 2026)" value="">
</div>

<h2>Choose Your Policy Sections</h2>
<div id="sections"></div>

<div class="preview-area">
<h2>Live Preview</h2>
<p class="preview-subtitle">This updates as you toggle sections above</p>
<div class="preview-doc" id="preview"></div>
<div class="btn-row">
<button class="btn" onclick="downloadPolicy()">Download as Text File</button>
<button class="btn btn-outline" onclick="copyPolicy()">Copy to Clipboard</button>
</div>
</div>

<div class="nav-row">
<a href="your-first-week-with-ai.html" class="nav-link">← Prev: Your First Week</a>
<a href="measuring-ai-success.html" class="nav-link">Next: Measuring Success →</a>
</div>
</div>

<script>
const sections = [
  {id:"purpose", title:"Purpose & Scope", desc:"Why this policy exists and who it applies to", default:true,
    text:`This policy establishes guidelines for the responsible use of artificial intelligence tools at {company}. It applies to all employees, contractors, and partners who use AI tools in the course of their work.\n\nOur goal is to harness AI's productivity benefits while protecting our company, our customers, and our reputation.`},
  {id:"acceptable", title:"Acceptable Use", desc:"What employees CAN use AI for", default:true,
    text:`Employees are encouraged to use approved AI tools for:\n• Drafting and editing internal communications\n• Brainstorming and ideation for projects\n• Summarizing long documents and meeting notes\n• Analyzing non-sensitive business data\n• Creating first drafts of marketing content\n• Researching publicly available information\n\nAll AI-generated content must be reviewed by a human before being shared externally.`},
  {id:"prohibited", title:"Prohibited Use", desc:"What employees must NOT do with AI", default:true,
    text:`The following uses of AI are strictly prohibited:\n• Entering customer personal data (names, emails, financial info) into public AI tools\n• Using AI to make final hiring, firing, or disciplinary decisions\n• Submitting AI-generated content as original work without disclosure where required\n• Using AI to generate legal advice or financial recommendations without professional review\n• Sharing proprietary company data, trade secrets, or confidential strategies with AI tools\n• Using AI to create misleading or deceptive content`},
  {id:"data", title:"Data Handling & Privacy", desc:"Rules for what data can touch AI tools", default:true,
    text:`Data Classification for AI Use:\n\n• PUBLIC data: May be used freely with any AI tool\n• INTERNAL data: May only be used with company-approved AI tools that have enterprise agreements\n• CONFIDENTIAL data: Must never be entered into external AI tools without written approval from management\n• CUSTOMER PII: Must never be entered into any AI tool unless the tool has a signed Data Processing Agreement\n\nWhen in doubt about data classification, do not use it with AI. Ask your manager.`},
  {id:"disclosure", title:"Customer Disclosure", desc:"When and how to tell customers AI was used", default:false,
    text:`{company} is committed to transparency about our AI use:\n\n• Customer-facing content created with AI assistance will be reviewed and approved by a human\n• When customers ask if AI was used, we answer honestly\n• AI chatbots and automated responses must be clearly identified as AI-generated\n• Marketing materials should not imply that AI-generated content was created entirely by humans\n• Customer data will never be used to train AI models without explicit consent`},
  {id:"approval", title:"Approval Process", desc:"How to get new AI tools approved", default:false,
    text:`Before using a new AI tool at {company}:\n\n1. Submit a request to your manager describing the tool, its purpose, and what data it will access\n2. Management will review the tool's privacy policy and terms of service\n3. Tools handling customer data require an additional security review\n4. Approved tools will be added to the company's Approved AI Tools list\n5. Unapproved tools must not be used for company work\n\nCurrent approved tools will be maintained in a shared document accessible to all employees.`},
  {id:"quality", title:"Quality Standards", desc:"How to ensure AI output meets your standards", default:false,
    text:`All AI-generated work must meet {company}'s quality standards:\n\n• Every piece of AI-generated content must be reviewed by a qualified human\n• Facts, statistics, and claims must be independently verified before publication\n• AI-generated content should be edited to match our brand voice and tone\n• Never publish AI content that you wouldn't put your name on\n• If AI produces something that seems too good to be true, it probably is — verify it\n\nRemember: AI is a starting point, not a finished product.`},
  {id:"training", title:"Training Requirements", desc:"What employees need to learn before using AI", default:false,
    text:`All employees using AI tools at {company} must:\n\n• Complete the company's AI orientation session (1 hour)\n• Read and acknowledge this AI Usage Policy\n• Understand the data classification system described above\n• Know how to identify and report AI-related concerns\n• Complete a refresher annually as tools and policies evolve\n\nManagers are responsible for ensuring their teams understand and follow this policy.`},
];

let activeIds = new Set(sections.filter(s=>s.default).map(s=>s.id));
let toggled = 0;

const container = document.getElementById('sections');
sections.forEach(s => {
  const div = document.createElement('div');
  div.className = 'section-toggle' + (s.default ? ' active' : '');
  div.id = 'section-'+s.id;
  div.innerHTML = `<div class="toggle-header"><div class="toggle-switch"></div><div class="toggle-info"><div class="toggle-title">${s.title}</div><div class="toggle-desc">${s.desc}</div></div></div><div class="section-content"><div class="policy-text">${s.text.replace(/\{company\}/g, '<em>[Company Name]</em>')}</div></div>`;
  div.querySelector('.toggle-header').addEventListener('click', () => {
    const isActive = div.classList.contains('active');
    div.classList.toggle('active');
    if(!isActive) activeIds.add(s.id); else activeIds.delete(s.id);
    toggled++;
    LO.sfx.click();
    renderPreview();
    if(toggled >= 3) LO.completeLesson('ai-biz', 8, 120);
  });
  container.appendChild(div);
});

function getCompany(){ return document.getElementById('company-name').value || '[Your Company Name]'; }
function getDate(){ return document.getElementById('effective-date').value || '[Effective Date]'; }

function renderPreview(){
  const company = getCompany();
  const date = getDate();
  let html = `<h3>${company} — AI Usage Policy</h3><p><strong>Effective Date:</strong> ${date}</p>`;
  sections.forEach(s => {
    if(!activeIds.has(s.id)) return;
    html += `<h3>${s.title}</h3>`;
    const formatted = s.text.replace(/\{company\}/g, company).replace(/\n/g,'<br>').replace(/• /g,'&bull; ');
    html += `<p>${formatted}</p>`;
  });
  html += `<h3>Acknowledgment</h3><p>I have read and understand ${company}'s AI Usage Policy. I agree to comply with all guidelines described above.</p><p><br>Employee Signature: _________________________<br>Date: _________________________</p>`;
  document.getElementById('preview').innerHTML = html;
}

function getPlainText(){
  const company = getCompany();
  const date = getDate();
  let text = `${company} — AI USAGE POLICY\nEffective Date: ${date}\n\n`;
  sections.forEach(s => {
    if(!activeIds.has(s.id)) return;
    text += `${s.title.toUpperCase()}\n${'='.repeat(s.title.length)}\n${s.text.replace(/\{company\}/g, company)}\n\n`;
  });
  text += `ACKNOWLEDGMENT\n==============\nI have read and understand ${company}'s AI Usage Policy. I agree to comply with all guidelines described above.\n\nEmployee Signature: _________________________\nDate: _________________________\n`;
  return text;
}

function downloadPolicy(){
  const blob = new Blob([getPlainText()], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-usage-policy.txt';
  a.click();
  URL.revokeObjectURL(url);
  LO.sfx.success();
  LO.showToast('Policy downloaded!', '#22c55e');
}

function copyPolicy(){
  navigator.clipboard.writeText(getPlainText()).then(() => {
    LO.sfx.success();
    LO.showToast('Copied to clipboard!', '#22c55e');
  });
}

document.getElementById('company-name').addEventListener('input', renderPreview);
document.getElementById('effective-date').addEventListener('input', renderPreview);
renderPreview();
</script>
