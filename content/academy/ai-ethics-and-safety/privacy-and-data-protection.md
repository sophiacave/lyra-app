---
title: "Privacy and Data Protection"
course: "ai-ethics-and-safety"
order: 3
type: "lesson"
free: true
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-ethics-and-safety/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 3 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Privacy and <span class="accent">Data Protection.</span></h1>
  <p class="sub">Every prompt you send is data. Know where it goes, who sees it, and what's safe to share.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>What happens to the data you send to AI models</li>
    <li>The 5 things you should NEVER paste into an AI prompt</li>
    <li>How to use AI safely with sensitive information</li>
    <li>Business vs personal account privacy differences</li>
  </ul>
</div>

<!-- SECTION 1 -->
<div class="lesson-section">
  <span class="section-label">The Reality</span>
  <h2 class="section-title">Your prompts aren't private by default.</h2>
  <p class="section-text">When you type something into an AI chat, you're sending data to a server. Depending on the provider, your plan, and the settings — that data might be stored, reviewed by staff, or used to train future models.</p>
  <p class="section-text">Most major AI providers (including Anthropic, OpenAI, and Google) have different policies for free vs paid accounts, and for consumer vs business plans. The differences matter enormously:</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Free / Consumer Plans</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:var(--dim)">
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">May use your data for training</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Conversations may be reviewed</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Less control over data retention</li>
          <li style="padding:6px 0">Fewer compliance guarantees</li>
        </ul>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Business / API Plans</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:var(--dim)">
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Typically no training on your data</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Stricter access controls</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Data retention policies you can configure</li>
          <li style="padding:6px 0">Compliance certifications (SOC 2, etc.)</li>
        </ul>
      </div>
    </div>
  </div>
  <p class="section-text" style="margin-top:1rem"><strong>Rule of thumb:</strong> If you're using a free or consumer plan, treat every prompt as if it could be seen by someone else.</p>
</div>

<!-- SECTION 2: NEVER SHARE -->
<div class="lesson-section">
  <span class="section-label">The Red Lines</span>
  <h2 class="section-title">5 things to NEVER paste into an AI prompt.</h2>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.3);border-radius:8px;padding:12px 14px;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--red);font-weight:700">1. Passwords & API keys</span> — Never. Not even "just to check something." Use a password manager.
      </div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.3);border-radius:8px;padding:12px 14px;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--red);font-weight:700">2. Other people's personal data</span> — Names + emails, health records, financial info. If it could identify a person, don't share it.
      </div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.3);border-radius:8px;padding:12px 14px;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--red);font-weight:700">3. Confidential business information</span> — Trade secrets, unreleased financials, legal strategy, M&A details.
      </div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.3);border-radius:8px;padding:12px 14px;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--red);font-weight:700">4. Private communications</span> — Other people's emails, DMs, or messages without their consent.
      </div>
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.3);border-radius:8px;padding:12px 14px;font-size:.85rem;color:var(--dim)">
        <span style="color:var(--red);font-weight:700">5. Regulated data</span> — HIPAA health info, FERPA student records, PCI credit card numbers, data covered by NDA.
      </div>
    </div>
  </div>
</div>

<!-- SECTION 3: SAFE USE -->
<div class="lesson-section">
  <span class="section-label">Safe Practices</span>
  <h2 class="section-title">How to use AI safely with sensitive work.</h2>
  <p class="section-text">You don't have to avoid AI for sensitive topics. You just need to be smart about it:</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">1</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Anonymize before you paste.</strong> Replace real names with "Client A," real numbers with approximations, real companies with "[Company]."</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">2</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Describe, don't paste.</strong> Instead of pasting a contract, describe the key terms. "I have a SaaS contract with a 12-month term and auto-renewal. How should I negotiate the exit clause?"</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">3</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Use business-tier plans.</strong> If your work involves sensitive data regularly, use plans that guarantee no training on your data.</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">4</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Check your company's AI policy.</strong> Many organizations now have rules about what can and can't go into AI tools. Know yours.</div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(74,222,128,.12);color:var(--green);font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">5</div>
        <div style="color:var(--dim);font-size:.85rem"><strong>Ask hypothetical questions.</strong> Instead of sharing the real situation, make it hypothetical: "If a company had this situation, what would you recommend?"</div>
      </div>
    </div>
  </div>
</div>

<!-- NEXT -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-ethics-and-safety/misinformation-and-hallucinations" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Misinformation and Hallucinations →</a>
</div>

</div>
