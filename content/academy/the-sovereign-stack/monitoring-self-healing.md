---
title: "Monitoring & Self-Healing"
course: "the-sovereign-stack"
order: 8
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-sovereign-stack/">The Sovereign Stack</a>
  <span class="lesson-badge">Lesson 8 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Monitoring & Self-Healing</h1>
  <p><span class="accent">Systems that fix themselves before you even know something broke.</span></p>
  <p>The sovereign stack does not page you at 3am. It detects problems, diagnoses root causes, applies fixes, and verifies recovery -- all autonomously. You wake up to a status report, not a crisis.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Health check patterns: what to monitor and how</li>
    <li>Auto-restart and recovery: bringing services back automatically</li>
    <li>Proactive alerts: catching problems before they become crises</li>
    <li>Graceful degradation: staying functional when components fail</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Monitoring Stack</h2>
  <p class="section-text">Effective monitoring has three layers:</p>
  <p class="section-text"><strong style="color: var(--blue);">Health checks (is it alive?).</strong> Periodic pings to every service. Is Ollama responding? Is the brain database accessible? Is the website up? Binary alive/dead status, checked every 30-60 seconds.</p>
  <p class="section-text"><strong style="color: var(--purple);">Metrics (how is it performing?).</strong> Response times, CPU usage, RAM consumption, queue depths, error rates. Not just alive, but healthy. A service with 99% CPU usage is alive but about to crash.</p>
  <p class="section-text"><strong style="color: var(--green);">Logs (what happened?).</strong> Structured logs from every service. When something goes wrong, logs tell you why. When the self-healer fixes something, logs prove it worked. Essential for debugging and audit trails.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Health Check System</h2>
  <div class="prompt-box"><code>// Health check runner -- checks all services every 60 seconds
const services = [
  {
    name: 'ollama',
    check: async () => {
      const res = await fetch('http://localhost:11434/api/tags');
      return res.ok;
    },
    restart: 'ollama serve',
    critical: true
  },
  {
    name: 'brain',
    check: async () => {
      const result = brain.read('system.health_check');
      return result !== null;
    },
    restart: null,  // Cannot restart a file -- alert instead
    critical: true
  },
  {
    name: 'website',
    check: async () => {
      const res = await fetch('https://yourdomain.com', { timeout: 10000 });
      return res.ok;
    },
    restart: null,  // Hosted externally -- alert
    critical: false
  }
];

async function runHealthChecks() {
  const results = [];
  for (const service of services) {
    try {
      const healthy = await service.check();
      results.push({ name: service.name, healthy, timestamp: new Date() });

      if (!healthy && service.restart) {
        console.log(`${service.name} unhealthy. Attempting restart...`);
        await exec(service.restart);
        // Wait 5 seconds, then re-check
        await wait(5000);
        const recovered = await service.check();
        results[results.length - 1].recovered = recovered;
      }
    } catch (e) {
      results.push({ name: service.name, healthy: false, error: e.message });
    }
  }

  // Write health status to brain
  brain.write('system.health_status', JSON.stringify(results), 'system');
  return results;
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Self-Healing Patterns</h2>
  <p class="section-text">Self-healing turns monitoring from passive observation into active repair:</p>
  <p class="section-text"><strong style="color: var(--blue);">Auto-restart.</strong> The simplest self-healing: if a service is down, restart it. Ollama crashed? Run <code>ollama serve</code>. Cron job stopped? Restart the scheduler. Most transient failures are fixed by a restart.</p>
  <p class="section-text"><strong style="color: var(--purple);">Exponential backoff restart.</strong> If restarting fails, do not hammer the service. Wait 10 seconds, then 30, then 60, then 5 minutes. After 5 failed restarts, stop trying and alert a human. The service has a deeper problem that automation cannot fix.</p>
  <p class="section-text"><strong style="color: var(--green);">Resource-triggered healing.</strong> RAM above 90%? The self-healer kills the least-important process. CPU at 100% for 5 minutes? Pause non-critical background tasks. Disk above 95%? Clean old logs and temporary files. Prevention beats cure.</p>
  <p class="section-text"><strong style="color: var(--orange);">Service substitution.</strong> The primary Ollama instance is down? Route requests to a backup model. The primary database is unreachable? Switch to a read-only replica. Cloud API is rate-limited? Fall back to local model. The system degrades instead of breaking.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Proactive Alerting</h2>
  <p class="section-text">The best monitoring catches problems before they become emergencies:</p>
  <p class="section-text"><strong style="color: var(--orange);">Trend detection.</strong> RAM usage has increased 5% every day for a week. At this rate, you will hit 100% in 6 days. The monitor alerts now, not when the machine crashes. This is proactive -- predicting failure from trends.</p>
  <p class="section-text"><strong style="color: var(--blue);">Anomaly detection.</strong> Response times are normally 200ms. Today they are 800ms. The service is not down, but something is wrong. Alert before the 800ms becomes 8000ms becomes timeout becomes crash.</p>
  <p class="section-text"><strong style="color: var(--purple);">Dependency chain awareness.</strong> Your website depends on the brain, which depends on SQLite, which depends on the disk. If disk I/O slows down, every layer above it suffers. Monitor the dependencies, not just the top-level services.</p>
  <div class="prompt-box"><code>// Proactive alert: RAM trend detection
function checkRAMTrend() {
  const history = brain.search('system.health_status')
    .slice(-7)  // Last 7 days
    .map(h => JSON.parse(h.value))
    .map(h => h.ram_percent);

  if (history.length >= 3) {
    const trend = history[history.length - 1] - history[0];
    const dailyIncrease = trend / history.length;
    const daysUntilFull = (100 - history[history.length - 1]) / dailyIncrease;

    if (daysUntilFull < 7 && dailyIncrease > 0) {
      sendAlert(`RAM will hit 100% in ~${Math.round(daysUntilFull)} days.
        Current: ${history[history.length - 1]}%.
        Daily increase: ${dailyIncrease.toFixed(1)}%.
        Action: investigate memory leak or clean up processes.`);
    }
  }
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Graceful Degradation</h2>
  <p class="section-text">When a component fails, the system should degrade gracefully -- losing some capability but staying functional:</p>
  <p class="section-text"><strong style="color: var(--green);">Ollama down:</strong> Route all AI requests to cloud API (Claude/GPT). Costs more money but the business keeps running. Set a flag in the brain so the agent knows it is in degraded mode and should avoid high-volume AI tasks.</p>
  <p class="section-text"><strong style="color: var(--blue);">Cloud API down:</strong> Route to local Ollama. Accept lower quality for complex tasks. The business runs, just with a quality ceiling.</p>
  <p class="section-text"><strong style="color: var(--purple);">Brain database inaccessible:</strong> The AI loses its persistent memory. Fall back to session-only context. Critical directives are cached in the system prompt as a last resort. Log everything for later brain reconciliation.</p>
  <p class="section-text"><strong style="color: var(--orange);">Email service down:</strong> Queue outbound emails locally. When the service recovers, flush the queue. No emails are lost, just delayed.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Monitoring Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Alert fatigue.</strong> Alerting on every minor fluctuation. CPU hit 80% for 10 seconds? Alert. Response time was 300ms instead of 200ms? Alert. After 50 alerts in a day, you ignore all of them -- including the real one. Set thresholds that mean something.</p>
  <p class="section-text"><strong style="color: var(--red);">Restart loops.</strong> A service crashes, the self-healer restarts it, it crashes again immediately, restart, crash, restart. This loop consumes resources and never fixes the problem. Cap restart attempts and alert after the cap.</p>
  <p class="section-text"><strong style="color: var(--red);">Monitoring only the happy path.</strong> Checking that the website returns 200 OK but not checking that the content is correct. The page could show an error message while returning 200. Health checks should verify functionality, not just connectivity.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Build your monitoring and self-healing system:</p>
  <div class="prompt-box"><code>1. List your critical services (Ollama, brain, website, email)
2. Write a health check for each (can I reach it? does it respond correctly?)
3. Add auto-restart for services that support it
4. Set up a cron job to run health checks every 60 seconds
5. Write the health status to your brain after each check
6. Add one proactive alert (RAM trend, response time anomaly)
7. Define degradation paths: if X fails, fall back to Y

Start simple: health checks + auto-restart.
Add proactive alerting once the basics are solid.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Monitoring & Self-Healing","cards":[{"front":"Three Monitoring Layers","back":"Health checks (alive/dead, every 30-60s), Metrics (performance -- response time, CPU, RAM), Logs (what happened and why). All three needed for complete visibility."},{"front":"Self-Healing Patterns","back":"Auto-restart (simplest), exponential backoff restart (prevent hammering), resource-triggered healing (preemptive cleanup), service substitution (swap to backup)."},{"front":"Proactive Alerting","back":"Trend detection (RAM increasing daily -- predict when it hits 100%), anomaly detection (response time 4x normal), dependency chain awareness (disk slowdown affects everything above it)."},{"front":"Graceful Degradation","back":"When a component fails, lose capability but stay functional. Ollama down -> use cloud API. Cloud down -> use local. Brain inaccessible -> session-only context. Email down -> queue locally."},{"front":"Alert Fatigue","back":"Too many alerts = all alerts ignored. Set thresholds that mean something. A CPU spike for 10 seconds is noise. CPU at 95% for 5 minutes is a real problem."},{"front":"Restart Loop Protection","back":"Cap restart attempts (3-5) with exponential backoff. After the cap, stop restarting and alert a human. Infinite restart loops waste resources and never fix the root cause."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Monitoring quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Monitoring & Self-Healing","questions":[{"q":"What is proactive alerting and why is it better than reactive alerting?","options":["Proactive alerting sends more alerts more frequently","Proactive alerting detects trends and anomalies that predict future failures -- alerting before the crash happens, not after. RAM increasing 5% daily triggers an alert a week before it hits 100%.","Proactive alerting only monitors critical services","Proactive alerting replaces health checks entirely"],"correct":1,"explanation":"Reactive alerting tells you something broke. Proactive alerting tells you something is about to break. Catching a memory leak 7 days before it causes a crash gives you time to fix it calmly instead of scrambling at 3am."},{"q":"What is the correct response when auto-restart fails multiple times?","options":["Keep restarting indefinitely until it works","Stop restarting after 3-5 attempts, alert a human, and activate graceful degradation -- the service has a deeper problem that automation cannot fix","Immediately shut down all related services","Delete the service and reinstall from scratch"],"correct":1,"explanation":"Infinite restart loops waste resources and never fix root causes. After 3-5 failed attempts with exponential backoff, the problem is structural -- bad config, corrupted data, dependency failure. Stop, alert, degrade gracefully, and let a human investigate."},{"q":"What makes graceful degradation different from just crashing?","options":["Graceful degradation is faster","When a component fails, the system loses that specific capability but keeps running -- Ollama down means route to cloud API, not shut down the business. Functionality degrades instead of stopping.","Graceful degradation prevents all failures","Graceful degradation requires cloud backup for every service"],"correct":1,"explanation":"A system that crashes when Ollama dies takes down everything. A system with graceful degradation routes AI requests to a cloud API fallback. The business keeps running, just at higher cost. Every critical component should have a degradation path defined in advance."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/the-sovereign-stack/fleet-orchestration/" class="prev">&larr; Previous: Fleet Orchestration</a>
  <a href="/academy/the-sovereign-stack/cost-optimization/" class="next">Next: Cost Optimization &rarr;</a>
</nav>

</div>
