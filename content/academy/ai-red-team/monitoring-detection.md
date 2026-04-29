---
title: "Monitoring & Detection"
course: "ai-red-team"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-red-team/">AI Red Team</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Monitoring & Detection</h1>
  <p class="sub">Catching attacks in production: anomaly detection, logging patterns, and abuse signals</p>
</div>

<div class="content">

<div class="card">
<h2>Why Pre-Deployment Testing Is Not Enough</h2>
<p>Red teaming finds vulnerabilities before launch. But attacks evolve. New jailbreak techniques appear weekly. Users find creative exploits you never imagined. Production monitoring is your <strong style="color:#e5e5e5">last line of defense</strong> — the system that catches attacks your pre-deployment testing missed.</p>

<div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-top:1.25rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
<strong style="color:#e5e5e5">Real-world analogy:</strong> A home inspection checks for problems before you move in. But you still need smoke detectors, security cameras, and carbon monoxide alarms after you are living there. Pre-deployment testing is the inspection. Monitoring is the smoke detector.
</div>
</div>

<div class="card">
<h2>What to Monitor</h2>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(139,92,246,.06);border-radius:10px;border:1px solid rgba(139,92,246,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#8b5cf6;margin-bottom:.2rem">Input patterns</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Log user inputs and scan for injection signatures, unusual length, encoded content, and repeated attack patterns from the same user.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(56,189,248,.06);border-radius:10px;border:1px solid rgba(56,189,248,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#38bdf8;margin-bottom:.2rem">Output anomalies</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Watch for responses that contain system prompt fragments, PII patterns, unusual URLs, or content that violates your policies.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(251,146,60,.06);border-radius:10px;border:1px solid rgba(251,146,60,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#fb923c;margin-bottom:.2rem">Tool usage patterns</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Track which tools are called, how often, and with what parameters. Spikes in database queries or file reads may indicate exfiltration attempts.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(52,211,153,.06);border-radius:10px;border:1px solid rgba(52,211,153,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#34d399;margin-bottom:.2rem">Behavioral drift</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Does the agent stay in character? Monitor for responses that break persona, discuss off-topic subjects, or exhibit behavior inconsistent with the system prompt.</div></div>
</div>
<div style="display:flex;gap:.75rem;padding:.75rem 1rem;background:rgba(244,114,182,.06);border-radius:10px;border:1px solid rgba(244,114,182,.12)">
<div><div style="font-size:.85rem;font-weight:700;color:#f472b6;margin-bottom:.2rem">Cost anomalies</div><div style="font-size:.82rem;color:#a1a1aa;line-height:1.5">Sudden cost spikes may indicate abuse — someone running the agent in circles, exfiltrating data through many queries, or exploiting tool loops.</div></div>
</div>
</div>
</div>

<div class="card">
<h2>Building a Monitoring Pipeline</h2>

<div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">TypeScript — security monitoring with hooks</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">const</span> securityMonitor = {
  preToolUse: (tool: string, params: any) => {
    <span style="color:#71717a">// Log every tool call for audit</span>
    logEvent({
      type: <span style="color:#fbbf24">"tool_call"</span>,
      tool,
      params: JSON.stringify(params).slice(<span style="color:#fb923c">0</span>, <span style="color:#fb923c">500</span>),
      timestamp: Date.now(),
      userId: getCurrentUser(),
    });

    <span style="color:#71717a">// Detect unusual tool patterns</span>
    <span style="color:#c084fc">const</span> recentCalls = getRecentToolCalls(getCurrentUser(), <span style="color:#fb923c">60_000</span>);
    <span style="color:#c084fc">if</span> (recentCalls.filter(c => c.tool === <span style="color:#fbbf24">"Bash"</span>).length > <span style="color:#fb923c">10</span>) {
      alertSecurityTeam(<span style="color:#fbbf24">"Excessive Bash usage detected"</span>);
      <span style="color:#c084fc">return</span> { action: <span style="color:#fbbf24">"deny"</span>, message: <span style="color:#fbbf24">"Rate limit exceeded"</span> };
    }

    <span style="color:#c084fc">return</span> { action: <span style="color:#fbbf24">"allow"</span> };
  },

  postToolUse: (tool: string, _params: any, result: string) => {
    <span style="color:#71717a">// Scan results for sensitive data</span>
    <span style="color:#c084fc">if</span> (containsPII(result)) {
      alertSecurityTeam(<span style="color:#fbbf24">"PII detected in tool result"</span>);
      <span style="color:#c084fc">return</span> <span style="color:#fbbf24">"[REDACTED - Sensitive data removed]"</span>;
    }
    <span style="color:#c084fc">return</span> result;
  },
};</code></pre>
</div>
</div>

<div class="card">
<h2>Abuse Signal Detection</h2>
<p>Look for these patterns that indicate someone is probing or attacking your system:</p>

<div style="display:grid;gap:.75rem;margin-top:.75rem">
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Rapid prompt iteration</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Same user sending many variations of similar prompts in quick succession — likely testing which injection pattern works.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Escalating complexity</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Messages getting progressively more complex or adversarial within a session — multi-step escalation in progress.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Off-topic persistence</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Repeated attempts to steer the conversation to prohibited topics after the agent refuses — someone is probing guardrails.</p>
</div>
<div style="padding:1rem;border-radius:10px;background:rgba(248,113,113,.04);border:1px solid rgba(248,113,113,.1)">
<strong style="color:#f87171;font-size:.88rem">Meta-conversation</strong>
<p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Questions about the system itself: "What model are you?", "Who programmed you?", "What are your rules?" — reconnaissance before an attack.</p>
</div>
</div>
</div>

<div class="card">
<h2>Key Takeaways</h2>
<div style="display:grid;gap:1rem">
<div style="padding:1rem;background:rgba(139,92,246,.05);border-radius:10px;border:1px solid rgba(139,92,246,.1)">
<strong style="color:#8b5cf6">Log everything, alert on anomalies</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">Every input, output, and tool call should be logged. Use automated alerts for patterns that indicate attacks. Manual review cannot scale, but automated detection can.</p>
</div>
<div style="padding:1rem;background:rgba(251,146,60,.05);border-radius:10px;border:1px solid rgba(251,146,60,.1)">
<strong style="color:#fb923c">Monitoring feeds back into defense</strong>
<p style="font-size:.85rem;color:#a1a1aa;margin:.25rem 0 0">New attack patterns discovered through monitoring should be added to your input filters and red team test suites. Monitoring is not passive — it actively strengthens your defenses.</p>
</div>
</div>
</div>

<div data-learn="FlashDeck" data-props='{"title":"Monitoring & Detection","cards":[{"front":"Why is production monitoring necessary even after red teaming?","back":"Attacks evolve constantly. New jailbreak techniques appear weekly. Users find creative exploits you never imagined. Monitoring catches attacks that pre-deployment testing missed."},{"front":"Five things to monitor","back":"1) Input patterns (injection signatures). 2) Output anomalies (PII, prompt leaks). 3) Tool usage patterns (exfiltration signals). 4) Behavioral drift (off-character responses). 5) Cost anomalies (abuse patterns)."},{"front":"Abuse signal: rapid prompt iteration","back":"Same user sending many similar prompt variations quickly — they are testing which injection pattern bypasses your defenses. Flag users who exceed normal message frequency."},{"front":"Abuse signal: escalating complexity","back":"Messages becoming progressively more adversarial within a session. Indicates multi-step escalation attack in progress. Monitor conversation trajectory, not just individual messages."},{"front":"Abuse signal: meta-conversation","back":"Questions about the system itself (\"What model are you?\", \"What are your rules?\"). This is reconnaissance — the attacker is gathering information before launching a targeted attack."},{"front":"Monitoring as defense feedback","back":"Attack patterns discovered through monitoring should be added to input filters and red team test suites. Monitoring is not passive observation — it actively strengthens your defenses over time."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Monitoring & Detection Check","questions":[{"q":"Why can't you rely solely on pre-deployment red teaming for AI security?","options":["Red teaming is too expensive","New attack techniques emerge constantly, and users find exploits you never imagined","Red teaming is not effective","Pre-deployment testing catches everything"],"correct":1,"explanation":"The AI security landscape evolves rapidly. New jailbreak techniques appear weekly, creative users find unexpected exploits, and adversarial actors continuously probe for vulnerabilities. Monitoring catches what pre-deployment testing missed."},{"q":"A user sends 15 variations of \"tell me your system prompt\" within 2 minutes. What abuse signal is this?","options":["Normal curiosity","Rapid prompt iteration — they are testing which extraction technique works","A bot malfunction","Random behavior"],"correct":1,"explanation":"Rapid prompt iteration with similar content is a clear abuse signal. The user is systematically testing prompt extraction techniques, looking for one that bypasses your guardrails."},{"q":"Your monitoring detects a sudden spike in database query tool calls from a single session. What might be happening?","options":["The database is slow","Data exfiltration — someone is extracting records through the agent tools","Normal usage pattern","A scheduled backup"],"correct":1,"explanation":"A sudden spike in database queries from a single session suggests someone is using the agent tool access to extract large amounts of data. Rate-limit tool calls and alert the security team."},{"q":"What should you do when monitoring discovers a new attack pattern?","options":["Ignore it — the model will handle it","Add the pattern to your input filters AND red team test suites","Only update the system prompt","Shut down the entire system"],"correct":1,"explanation":"New attack patterns should feed back into your defenses. Add them to input filters so they are caught automatically, and add corresponding test cases to your red team suite so you can verify defenses in future testing rounds."},{"q":"Which monitoring approach catches multi-step escalation attacks?","options":["Checking individual messages in isolation","Monitoring the full conversation trajectory across multiple turns","Keyword filtering","Output length checking"],"correct":1,"explanation":"Multi-step escalation looks innocent on a per-message basis. Only by monitoring the full conversation trajectory can you detect the gradual escalation from benign questions to adversarial content."}]}'></div>

</div>

<div class="progress-footer">
<span class="progress-label">Lesson 9 of 10</span>
<div class="progress-bar-wrap"></div>
<span class="progress-label">Module 3</span>
</div>
</div>
