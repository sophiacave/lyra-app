---
title: "Email & Communication Agents"
course: "the-sovereign-stack"
order: 4
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-sovereign-stack/">The Sovereign Stack</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Email & Communication Agents</h1>
  <p><span class="accent">Your AI reads, drafts, triages, and sends email -- so you don't have to.</span></p>
  <p>Email is the single biggest time sink in business. An AI agent that triages your inbox, drafts responses in your voice, schedules follow-ups, and sends routine messages saves hours every week. This lesson builds that agent.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Setting up automated email sending with Resend or SMTP</li>
    <li>Building an email triage system: priority, category, suggested action</li>
    <li>Drafting responses in your voice using brain context</li>
    <li>Template systems for recurring email patterns</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Email Agent Stack</h2>
  <p class="section-text">A complete email agent needs four components:</p>
  <p class="section-text"><strong style="color: var(--blue);">Reading (inbox access).</strong> Connect to your email via IMAP, Gmail API, or MCP integration. The agent reads incoming messages, extracting sender, subject, body, and attachments.</p>
  <p class="section-text"><strong style="color: var(--purple);">Triage (classification).</strong> The agent classifies each email: priority (urgent, normal, low), category (client, billing, support, spam), and suggested action (reply, forward, archive, flag for human review).</p>
  <p class="section-text"><strong style="color: var(--green);">Drafting (response generation).</strong> For emails that need a response, the agent drafts in your voice using brain context -- your identity, your communication style, your relationship with the sender, your current projects.</p>
  <p class="section-text"><strong style="color: var(--orange);">Sending (outbound delivery).</strong> The agent sends emails via Resend API, SMTP, or your email provider's API. Proper authentication (SPF, DKIM, DMARC) ensures deliverability.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Sending Email with Resend</h2>
  <p class="section-text">Resend is the simplest way to send transactional email from code. One API call, proper authentication, great deliverability:</p>
  <div class="prompt-box"><code>// Install: npm install resend
import { Resend } from 'resend';

// Initialize with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send an email
async function sendEmail(to, subject, body) {
  const response = await resend.emails.send({
    from: 'you@yourdomain.com',     // Must be verified domain
    to: to,                           // Recipient
    subject: subject,                 // Subject line
    html: body,                       // HTML body (or use 'text' for plain)
    bcc: 'archive@yourdomain.com'    // BCC yourself for records
  });
  return response;
}

// Example: send a client follow-up
await sendEmail(
  'client@company.com',
  'Following up on our conversation',
  '<p>Hi Sarah,</p><p>Thanks for the call today. As discussed, here are the next steps...</p>'
);</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Email Triage System</h2>
  <p class="section-text">The triage system reads each incoming email and classifies it using your local AI or cloud model:</p>
  <div class="prompt-box"><code>// Triage prompt -- sent to your AI with the email content
const triagePrompt = `
You are an email triage agent for a business owner.
Classify this email:

From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 1000)}

Respond with JSON:
{
  "priority": "urgent|normal|low",
  "category": "client|billing|support|newsletter|spam|personal",
  "action": "reply|forward|archive|flag|delete",
  "summary": "One sentence summary",
  "draft_reply": "If action is reply, draft a response. Otherwise null."
}

Rules:
- Emails from known clients are always priority: normal or urgent
- Newsletters and marketing are always priority: low, action: archive
- Anything mentioning money, deadlines, or problems is priority: urgent
`;</code></div>
  <p class="section-text">Run this through your local Ollama model for routine classification (free, fast) and escalate to Claude for emails that need nuanced drafting (better quality). The triage itself costs nothing when run locally.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Drafting in Your Voice</h2>
  <p class="section-text">The brain makes email drafting personal. The AI reads your communication style, your relationship with the sender, and your current context before drafting:</p>
  <p class="section-text"><strong style="color: var(--blue);">Voice from the brain.</strong> directive.voice stores your communication style: "Professional but warm, direct, no corporate speak, use first names." Every draft follows these rules.</p>
  <p class="section-text"><strong style="color: var(--purple);">Relationship context.</strong> If the brain has a key for this contact (contact.sarah_smith: "Client since January. Working on website redesign. Prefers brief emails."), the draft incorporates that relationship history.</p>
  <p class="section-text"><strong style="color: var(--green);">Project context.</strong> If the email relates to an active project, the agent reads the project key from the brain and references relevant details in the draft. "As discussed, the new landing page will be ready by Friday" -- because the brain knows the deadline.</p>
  <p class="section-text"><strong style="color: var(--orange);">Review before send.</strong> For important emails (urgent priority, new contacts, financial matters), the agent drafts but does not send. It queues the draft for human review. For routine emails (scheduling confirmations, thank-yous, acknowledgments), the agent sends directly.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Template System</h2>
  <p class="section-text">Most business email falls into recurring patterns. Templates save the AI from regenerating the same structure every time:</p>
  <div class="prompt-box"><code>// Email templates stored in the brain
const templates = {
  "meeting_followup": {
    subject: "Following up: {{meeting_topic}}",
    body: `Hi {{name}},

Thanks for taking the time to meet today. Here's a summary:

{{summary}}

Next steps:
{{next_steps}}

Let me know if I missed anything.

Best,
{{sender_name}}`
  },
  "invoice_reminder": {
    subject: "Friendly reminder: Invoice #{{invoice_number}}",
    body: `Hi {{name}},

Just a quick reminder that invoice #{{invoice_number}} for {{amount}}
is due on {{due_date}}.

You can pay via the link below:
{{payment_link}}

Thanks!
{{sender_name}}`
  }
};

// The agent fills in the template variables from context
// Then sends via Resend</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Email Agent Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Auto-sending to new contacts.</strong> The agent sends a draft to someone it has never emailed before, without human review. The tone might be wrong, the context might be off. Always require review for first contact with new people.</p>
  <p class="section-text"><strong style="color: var(--red);">No BCC archive.</strong> Emails sent by the agent bypass your sent folder. Without a BCC to your own address, you have no record of what was sent. Always BCC yourself or log outbound emails to the brain.</p>
  <p class="section-text"><strong style="color: var(--red);">Ignoring email authentication.</strong> Sending from a domain without SPF, DKIM, and DMARC configured. Your emails land in spam. Set up proper DNS records before automating outbound email.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Build your first email agent:</p>
  <div class="prompt-box"><code>1. Set up Resend (resend.com -- free tier: 100 emails/day)
   - Verify your domain
   - Configure SPF and DKIM DNS records
   - Get your API key
2. Write a sendEmail function (see code above)
3. Test: send yourself a test email
4. Build a triage prompt and test it with 5 real emails
5. Add your communication style to the brain:
   - directive.voice: your writing style
   - directive.email_rules: when to send vs. queue for review
6. Draft a response using brain context. Does it sound like you?</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Email & Communication Agents","cards":[{"front":"Email Agent Stack","back":"Four components: Reading (IMAP/Gmail/MCP), Triage (classify priority and action), Drafting (generate response in your voice), Sending (Resend/SMTP with proper authentication)."},{"front":"Triage System","back":"Classify each email: priority (urgent/normal/low), category (client/billing/support/spam), action (reply/forward/archive/flag). Run locally on Ollama for free classification."},{"front":"Drafting in Your Voice","back":"Brain provides: directive.voice (your style), contact context (relationship history), project context (relevant details). Every draft sounds like you because it IS built from your context."},{"front":"Template System","back":"Recurring email patterns (follow-ups, invoices, confirmations) use templates with variable slots. AI fills in the variables from context. Saves regeneration time for common patterns."},{"front":"Review Before Send Rule","back":"Important emails (urgent, new contacts, financial) are queued for human review. Routine emails (scheduling, acknowledgments) can be auto-sent. Never auto-send to new contacts."},{"front":"Email Authentication","back":"SPF, DKIM, and DMARC DNS records are required for deliverability. Without them, your automated emails land in spam. Set up before automating any outbound email."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Email agents quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Email & Communication Agents","questions":[{"q":"Why should email triage run on a local model instead of a cloud API?","options":["Local models are more accurate at email classification","Triage is a routine classification task that local models handle well at zero cost -- saving cloud API tokens for tasks that actually need frontier model quality","Local models can access your email inbox directly","Cloud APIs cannot process email content"],"correct":1,"explanation":"Email triage is pattern matching -- urgent vs. normal, client vs. spam. A 7B local model handles this perfectly. Running 100 triage calls per day locally costs nothing. Running them on Claude costs dollars. Save cloud tokens for complex drafting where quality matters."},{"q":"How does the brain enable the AI to draft emails in your voice?","options":["The brain stores pre-written email templates for every situation","The brain provides your communication style (directive.voice), contact relationship history, and project context -- the AI drafts using YOUR identity and context, not generic language","The brain corrects the AI draft after it is generated","The brain translates the email to your preferred language"],"correct":1,"explanation":"The brain is the difference between a generic AI draft and one that sounds like you. Your voice directive sets the tone. Contact history sets the relationship. Project context adds relevant details. The result is an email that could have come from your own keyboard."},{"q":"When should an email agent queue a draft for human review instead of auto-sending?","options":["Always -- AI should never send email autonomously","For important emails: urgent priority, first contact with new people, and financial matters -- routine emails like scheduling confirmations can be auto-sent","Only for emails longer than 200 words","Only for emails to C-level executives"],"correct":1,"explanation":"The review rule is about risk. First contact with a new person (wrong tone = bad impression), urgent matters (wrong information = real damage), and financial emails (wrong amount = liability) all warrant human review. Routine acknowledgments and scheduling can flow automatically."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/the-sovereign-stack/brain-architecture/" class="prev">&larr; Previous: Brain Architecture</a>
  <a href="/academy/the-sovereign-stack/financial-automation/" class="next">Next: Financial Automation &rarr;</a>
</nav>

</div>
