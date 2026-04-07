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

<!-- SECTION: GDPR/CCPA SPECIFICS -->
<div class="lesson-section">
  <span class="section-label">Regulations</span>
  <h2 class="section-title">GDPR, CCPA, and what they mean for your AI use.</h2>
  <p class="section-text">You don't need to be a lawyer to understand the key data protection laws that affect AI use. Here's what matters for everyday users and professionals.</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">GDPR (Europe)</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:#a1a1aa">
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Applies if you process data of EU residents — regardless of where you are</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Right to erasure: people can demand their data be deleted</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Right to explanation: people can ask how automated decisions were made</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Data minimization: only collect what you actually need</li>
          <li style="padding:6px 0">Fines up to 4% of annual global revenue</li>
        </ul>
      </div>
      <div>
        <div style="font-size:.7rem;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">CCPA (California)</div>
        <ul style="list-style:none;padding:0;margin:0;font-size:.85rem;color:#a1a1aa">
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Applies to businesses handling data of California residents</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Right to know: consumers can ask what data is collected about them</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Right to delete: consumers can request data deletion</li>
          <li style="padding:6px 0;border-bottom:1px solid var(--border)">Right to opt out of data sales</li>
          <li style="padding:6px 0">Fines up to $7,500 per intentional violation</li>
        </ul>
      </div>
    </div>
  </div>

  <p class="section-text" style="margin-top:1rem"><strong>Why this matters for AI:</strong> When you paste someone's personal data into an AI tool, you may be transferring it to a third party (the AI provider). Under GDPR, that transfer likely requires the data subject's consent. Under CCPA, it could qualify as a "sale" of personal information if the provider uses it for training.</p>
</div>

<!-- SECTION: DATA MINIMIZATION -->
<div class="lesson-section">
  <span class="section-label">Minimization</span>
  <h2 class="section-title">Data minimization: share only what the task requires.</h2>
  <p class="section-text">Data minimization is one of the most practical privacy principles for AI users. The idea is simple: give AI only the information it needs to complete the task — nothing more.</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="background:var(--bg);border:1px solid rgba(248,113,113,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:#a1a1aa"><span style="color:#ef4444;font-weight:700">Over-sharing:</span> "Help me write a response to John Smith (john.smith@company.com, Account #49281, overdue balance $3,200) who complained about our service on March 15th."</div>
      <div style="background:var(--bg);border:1px solid rgba(52,211,153,.2);border-radius:8px;padding:10px 14px;font-size:.85rem;color:#a1a1aa"><span style="color:#34d399;font-weight:700">Minimized:</span> "Help me write a professional response to a customer who has an overdue balance and recently complained about our service. The tone should be empathetic but firm about the balance."</div>
    </div>
  </div>

  <p class="section-text" style="margin-top:1rem">The minimized version gives AI everything it needs to write a great response — without exposing any personal information. The name, email, account number, and specific balance are irrelevant to the task of drafting the response.</p>
</div>

<!-- SECTION: CONSENT FRAMEWORKS -->
<div class="lesson-section">
  <span class="section-label">Consent</span>
  <h2 class="section-title">Understanding consent in the age of AI.</h2>
  <p class="section-text">Consent is foundational to data privacy, but AI complicates it in new ways. When someone gives you their email address, they consented to you having it — not to you pasting it into an AI model that might store it indefinitely or use it for training.</p>

  <div class="demo-container" style="padding:1.75rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:#fb923c;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">1</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;margin-bottom:2px">Original Purpose</div>
          <div style="color:#a1a1aa;font-size:.85rem">Data collected for one purpose (e.g., order fulfillment) shouldn't be repurposed for another (e.g., AI analysis) without additional consent. Using customer data to train internal AI models may violate the original consent.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:#fb923c;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">2</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;margin-bottom:2px">Third-Party Transfer</div>
          <div style="color:#a1a1aa;font-size:.85rem">Pasting data into an AI tool transfers it to a third party. Most privacy policies don't cover this. If your company's privacy policy says "we don't share your data with third parties" and employees are pasting data into AI — that's a breach.</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="background:rgba(251,146,60,.12);color:#fb923c;font-weight:800;font-size:.75rem;padding:4px 10px;border-radius:6px;flex-shrink:0">3</div>
        <div>
          <div style="font-weight:700;font-size:.85rem;margin-bottom:2px">Informed Consent</div>
          <div style="color:#a1a1aa;font-size:.85rem">True consent requires understanding. "We may use AI to process your data" in a terms of service nobody reads isn't meaningful consent. Best practice: be specific about how AI is used and give people a genuine choice.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="lesson-section">
  <span class="section-label">Try It</span>
  <h2 class="section-title">Anonymize sensitive data before sending it to AI.</h2>
  <p class="section-text">Use this prompt to get AI's help analyzing sensitive work without exposing private information. Notice how you describe the situation instead of pasting raw data.</p>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Prompt — Privacy-Safe Data Analysis</div>
<pre style="margin:0;color:#e5e5e5"><code>I need to analyze [type of data, e.g. "customer support tickets"] but I can't share the raw data because it contains personal information.

Here's what I can tell you:
- The dataset has [number] records from [time period]
- Common themes I'm seeing: [list 3-5 patterns in general terms]
- The business question I need answered: [your question]

Based on this description, give me:
1. An analysis framework I can apply to the data myself
2. The specific metrics I should track
3. Questions I should ask the data to find actionable insights

Do NOT ask me to paste the raw data. Help me analyze it without exposing it.</code></pre>
</div>
</div>

<!-- INTERACTIVE: FLASHDECK -->
<div class="lesson-section">
  <span class="section-label">Key Concepts</span>
  <h2 class="section-title">Review the 5 things to never share with AI.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"5 Things to Never Paste into AI","cards":[{"front":"Passwords and API Keys","back":"Never share credentials with AI — not even to check something. Use a password manager instead. Exposed keys can compromise entire systems."},{"front":"Other People\\'s Personal Data","back":"Names, emails, health records, financial info — if it could identify a person, do not share it. This may violate GDPR or CCPA."},{"front":"Confidential Business Information","back":"Trade secrets, unreleased financials, legal strategy, and M&A details belong to the company and should never enter consumer AI tools."},{"front":"Private Communications","back":"Other people\\'s emails, DMs, or messages should never be pasted into AI without their explicit consent."},{"front":"Regulated Data","back":"HIPAA health info, FERPA student records, PCI credit card numbers, and NDA-covered data have legal protections that AI tools may violate."}]}'></div>
</div>

<!-- INTERACTIVE: MATCH -->
<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Match the data type to the reason it should not be shared.</h2>
</div>

<!-- INTERACTIVE: QUIZ -->
<div class="lesson-section">
  <span class="section-label">Knowledge Check</span>
  <h2 class="section-title">Check your understanding.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Privacy and Data Protection","questions":[{"q":"What is the key difference between free/consumer AI plans and business/API plans?","options":["Business plans are always faster","Free plans may use your data for training; business plans typically do not","Business plans have better AI models","Free plans have stricter privacy controls"],"correct":1,"explanation":"Free and consumer plans may store, review, or use your prompts for training. Business and API plans typically offer stronger guarantees: no training on your data, stricter access controls, and compliance certifications."},{"q":"You need AI to help analyze a sensitive contract. What is the safest approach?","options":["Paste the full contract into a free AI chat","Describe the key terms without pasting the actual document","Use a different AI tool for sensitive work","Ask AI to anonymize the contract for you first"],"correct":1,"explanation":"Describing rather than pasting is a core safe practice. Instead of sharing the actual contract, explain the situation in general terms. This keeps you productive without exposing confidential content."},{"q":"Which of these would be safe to include in an AI prompt without anonymizing?","options":["A customer\u0027s full name and email","The general category of a problem you are solving","Specific employee performance data","An unreleased product roadmap"],"correct":1,"explanation":"Describing the general category of a problem — without any identifying details — is safe. Names, emails, employee data, and proprietary information should all be anonymized or excluded."},{"q":"What is the \"rule of thumb\" for free or consumer AI plans?","options":["They are safe for all professional use","Treat every prompt as if it could be seen by someone else","Only avoid sharing financial data","Always opt out of training data usage in settings"],"correct":1,"explanation":"The lesson\u0027s rule of thumb: if you are using a free or consumer plan, treat every prompt as if it could be seen by someone else. This mindset naturally keeps you cautious about what you share."}]}'></div>
</div>

<!-- NEXT -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/ai-ethics-and-safety/misinformation-and-hallucinations" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">Next: Misinformation and Hallucinations →</a>
</div>

</div>
