/**
 * consulting-tos.js — Like One Consulting Terms of Service Generator
 * Generates a client-specific TOS that must be accepted before any remote access.
 * Protects Faye and Like One LLC from liability.
 */

function generateTOS(clientName, deviceType = 'computer') {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
LIKE ONE AI CONSULTING — TERMS OF SERVICE & CONSENT

Date: ${date}
Client: ${clientName}
Provider: Like One LLC (Faye Cave, Founder)
Contact: hello@likeone.ai | (725) 321-5314

═══════════════════════════════════════════

1. SCOPE OF SERVICE

Like One LLC ("Provider") will provide AI-assisted technology consulting
services to ${clientName} ("Client"), including but not limited to:

  • Installation and configuration of AI assistant software
  • Remote ${deviceType} management and maintenance
  • Software installation, updates, and troubleshooting
  • Account setup (email, productivity tools, freelance platforms)
  • AI-assisted productivity training

2. REMOTE ACCESS CONSENT

Client voluntarily grants Provider remote access to Client's ${deviceType}
for the purposes described in Section 1. Remote access will be facilitated
through the following tools:

  • Chrome Remote Desktop, RustDesk, or similar remote desktop software
  • Tailscale VPN for secure connection (if applicable)
  • LO AI Helper application (custom software by Like One LLC)

Client understands that during remote access sessions, Provider may:
  • View Client's screen and open applications
  • Install, configure, or remove software
  • Create or modify files and folders
  • Access internet browser and online accounts (only with Client's direction)

Provider will NOT:
  • Access, copy, or store Client's personal files without explicit permission
  • Share Client's personal information with third parties
  • Access financial accounts or make purchases without Client's direction
  • Continue access after Client revokes consent

3. AI TOOLS DISCLOSURE

Provider uses artificial intelligence tools (including but not limited to
Claude, ChatGPT, Ollama, and custom AI systems) to assist with service
delivery. Client acknowledges that:

  • AI tools may be used to generate text, code, or recommendations
  • AI outputs are reviewed by Provider before implementation
  • AI tools may process information visible during remote sessions
  • No personally identifiable information is stored by AI tools

4. RIGHT TO REVOKE

Client may revoke remote access at any time by:
  • Verbally requesting Provider to disconnect
  • Uninstalling the remote access software
  • Disabling the connection in system settings
  • Contacting Provider at hello@likeone.ai

Revocation is immediate and requires no explanation.

5. DATA PRIVACY & CONFIDENTIALITY

Provider agrees to:
  • Treat all information encountered during service as confidential
  • Not disclose Client's personal information to any third party
  • Not retain copies of Client's personal files or data
  • Delete any temporary files created during service

6. LIMITATION OF LIABILITY

Services are provided "AS IS" without warranty of any kind. Provider is
not responsible for:

  • Pre-existing hardware or software issues
  • Data loss not directly caused by Provider's actions
  • Third-party software failures or security breaches
  • Internet connectivity issues
  • Loss of income or business interruption

Provider's total liability shall not exceed the total fees paid by Client
for the specific service giving rise to the claim.

7. NO GUARANTEE OF RESULTS

Provider does not guarantee specific outcomes, including but not limited
to income generation, employment, or technical performance improvements.
AI-assisted services are tools to enhance productivity, not guarantees
of success.

8. FEES

  • Initial setup and consultation: PRO BONO (no charge)
  • Ongoing support: To be discussed and agreed upon separately
  • All paid services will be documented in a separate agreement

9. GOVERNING LAW

This agreement is governed by the laws of the State of Nevada.

10. ACCEPTANCE

By signing below or clicking "I Accept" in the LO AI Helper application,
Client acknowledges that they have read, understood, and agree to these
terms.

═══════════════════════════════════════════

Client Signature: ________________________________

Client Name (Print): ${clientName}

Date: ${date}

═══════════════════════════════════════════

Provider Signature: Faye Cave, Like One LLC

Date: ${date}

═══════════════════════════════════════════
`;
}

function generateTOSHTML(clientName, deviceType = 'computer') {
  const text = generateTOS(clientName, deviceType);
  const lines = text.split('\n').map(line => {
    if (line.match(/^[A-Z].+—/)) return `<h2>${line}</h2>`;
    if (line.match(/^\d+\./)) return `<h3>${line}</h3>`;
    if (line.match(/^═+$/)) return '<hr>';
    if (line.match(/^  •/)) return `<li>${line.replace(/^  • /, '')}</li>`;
    return `<p>${line}</p>`;
  });
  return lines.join('\n');
}

module.exports = { generateTOS, generateTOSHTML };
