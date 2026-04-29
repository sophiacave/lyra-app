---
title: "Fleet Orchestration"
course: "the-sovereign-stack"
order: 7
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-sovereign-stack/">The Sovereign Stack</a>
  <span class="lesson-badge">Lesson 7 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Fleet Orchestration</h1>
  <p><span class="accent">One machine is a workstation. Multiple machines working together? That is a fleet.</span></p>
  <p>When your AI workload outgrows a single computer, you scale horizontally. Fleet orchestration coordinates multiple machines -- dispatching tasks, sharing state, monitoring health, and ensuring no single failure breaks the system.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>Task dispatch: routing work to the right machine</li>
    <li>Heartbeat monitoring: knowing which machines are alive</li>
    <li>Machine registries: tracking capabilities and availability</li>
    <li>Scaling patterns: when and how to add machines</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Concept</span>
  <h2 class="section-title">Why a Fleet?</h2>
  <p class="section-text">A single machine has limits. Your M3 Mac handles AI inference, runs your agents, serves your website, and manages your brain. But when you need to generate video while running a data pipeline while serving web requests -- one machine is not enough.</p>
  <p class="section-text">A fleet distributes work across multiple machines. Each machine has a role, a set of capabilities, and a workload. The orchestrator assigns tasks to the right machine based on what it can do and how busy it is. If one machine goes down, the others keep running.</p>
  <p class="section-text">This is not cloud computing. These are YOUR machines -- a desktop, a laptop, a mini PC, maybe a cloud VPS. All under your control, all part of your sovereign infrastructure.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Architecture</span>
  <h2 class="section-title">The Machine Registry</h2>
  <p class="section-text">Every machine in the fleet needs a registration entry that describes what it can do:</p>
  <div class="prompt-box"><code>// Machine registry stored in the brain
{
  "machines": [
    {
      "id": "m3-forge",
      "hostname": "m3-forge.local",
      "role": "primary",
      "capabilities": ["inference", "code", "planning", "brain"],
      "specs": {"ram": "64GB", "chip": "M3 Max", "gpu": true},
      "status": "online",
      "last_heartbeat": "2026-04-29T10:30:00Z",
      "current_load": 0.45
    },
    {
      "id": "m4-mirror",
      "hostname": "m4-mirror.local",
      "role": "parallel",
      "capabilities": ["inference", "social", "deploy", "testing"],
      "specs": {"ram": "48GB", "chip": "M4 Pro", "gpu": true},
      "status": "online",
      "last_heartbeat": "2026-04-29T10:29:55Z",
      "current_load": 0.20
    },
    {
      "id": "gcp-watcher",
      "hostname": "34.11.241.254",
      "role": "cron",
      "capabilities": ["monitoring", "cron", "alerts"],
      "specs": {"ram": "2GB", "chip": "x86", "gpu": false},
      "status": "online",
      "last_heartbeat": "2026-04-29T10:30:01Z",
      "current_load": 0.05
    }
  ]
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Task Dispatch</h2>
  <p class="section-text">Task dispatch routes work to the right machine. The dispatcher considers three factors: capability (can this machine do the task?), availability (is it online and not overloaded?), and priority (which machine should handle urgent work?).</p>
  <div class="prompt-box"><code>// Task dispatch logic
function dispatch(task) {
  const registry = JSON.parse(brain.read('system.machine_registry'));

  // Filter to machines that can handle this task
  const capable = registry.machines.filter(m =>
    m.status === 'online' &&
    m.capabilities.includes(task.requires) &&
    m.current_load < 0.8  // Not overloaded
  );

  if (capable.length === 0) {
    // No machine available -- queue for later
    return { action: 'queue', reason: 'No capable machine available' };
  }

  // Route to the least-loaded capable machine
  const target = capable.sort((a, b) => a.current_load - b.current_load)[0];

  return {
    action: 'dispatch',
    target: target.id,
    hostname: target.hostname,
    task: task
  };
}

// Example dispatch
dispatch({
  title: 'Generate social media posts',
  requires: 'social',
  priority: 'normal',
  payload: { topics: ['AI automation', 'sovereign stack'] }
});
// Result: dispatched to m4-mirror (has social capability, load: 0.20)</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Heartbeat Monitoring</h2>
  <p class="section-text">A heartbeat is a periodic "I'm alive" signal from each machine in the fleet. Without heartbeats, the dispatcher does not know if a machine is online or dead.</p>
  <p class="section-text"><strong style="color: var(--blue);">How it works.</strong> Every 30-60 seconds, each machine sends a heartbeat to the brain (or a central registry). The heartbeat includes: machine ID, current time, CPU load, RAM usage, and active task count.</p>
  <p class="section-text"><strong style="color: var(--purple);">Timeout detection.</strong> If a machine misses 3 consecutive heartbeats (90-180 seconds), it is marked as offline. Tasks assigned to it are re-queued for another machine. An alert notifies you that a machine went down.</p>
  <p class="section-text"><strong style="color: var(--green);">Health scoring.</strong> Beyond alive/dead, heartbeats enable health scoring. A machine with 95% RAM usage is "alive but stressed." The dispatcher routes new tasks to healthier machines, preventing overload cascades.</p>
  <div class="prompt-box"><code># Simple heartbeat script (runs via cron every 30 seconds)
#!/bin/bash
MACHINE_ID="m3-forge"
LOAD=$(uptime | awk -F'[a-z]:' '{ print $2}' | cut -d, -f1 | xargs)
RAM_USED=$(vm_stat | awk '/Pages active/ {print $3}' | tr -d '.')

curl -s -X POST http://brain-server:8080/heartbeat \
  -H "Content-Type: application/json" \
  -d "{
    \"machine_id\": \"$MACHINE_ID\",
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"load\": \"$LOAD\",
    \"status\": \"online\"
  }"</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Orchestration Patterns</h2>
  <p class="section-text">Three patterns for coordinating fleet work:</p>
  <p class="section-text"><strong style="color: var(--blue);">Hub-spoke (default).</strong> One primary machine (the hub) plans and dispatches. Other machines (spokes) execute tasks and report results. Simple, reliable, easy to debug. The hub is a single point of failure, but for small fleets (2-5 machines) this is the right tradeoff.</p>
  <p class="section-text"><strong style="color: var(--purple);">Pipeline.</strong> Tasks flow through machines in sequence. Machine A preprocesses data, passes it to Machine B for inference, which passes results to Machine C for publishing. Each machine specializes in one step. Best for workflows with clear sequential stages.</p>
  <p class="section-text"><strong style="color: var(--green);">Swarm.</strong> All machines are peers. Tasks go into a shared queue. Any available machine picks up the next task. No central coordinator. Best for embarrassingly parallel work (processing 1,000 images, generating 100 social posts). Most resilient to individual machine failures.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Fleet Orchestration Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">No brain synchronization.</strong> Each machine has its own brain copy that diverges over time. Machine A writes a new directive, Machine B never sees it. Designate one machine as the brain authority and sync regularly.</p>
  <p class="section-text"><strong style="color: var(--red);">Over-engineering for two machines.</strong> Building a full Kubernetes-style orchestration system for a fleet of two. Keep it simple: SSH, cron jobs, and a shared brain are sufficient for small fleets. Add complexity only when you actually hit scale limits.</p>
  <p class="section-text"><strong style="color: var(--red);">No task deduplication.</strong> Two machines pick up the same task from the queue and both execute it. Ensure tasks have unique IDs and the queue enforces at-most-once delivery. A task claimed by one machine is invisible to others.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Set up your first fleet coordination:</p>
  <div class="prompt-box"><code>1. Write a machine registry to your brain:
   brain.write('system.machine_registry', '{...}', 'system')
2. Set up a heartbeat cron on each machine (every 60 seconds)
3. Write a simple dispatch function that routes by capability
4. Test: dispatch a task, verify it reaches the right machine
5. Simulate a failure: stop heartbeats on one machine
   Does the dispatcher stop routing to it?

Start with hub-spoke (simplest). Upgrade to pipeline or swarm
only when your workload actually demands it.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Fleet Orchestration","cards":[{"front":"Machine Registry","back":"Describes each machine: ID, hostname, role, capabilities, specs, status, load. Stored in the brain. The dispatcher consults it to route tasks to the right machine."},{"front":"Task Dispatch Logic","back":"Filter by capability (can it do the task?), availability (online and not overloaded?), then route to the least-loaded capable machine. Queue if no machine is available."},{"front":"Heartbeat Monitoring","back":"Every 30-60 seconds, each machine reports: alive, current load, RAM usage. 3 missed heartbeats = offline. Tasks re-queued. Alert sent. Prevents dispatching to dead machines."},{"front":"Hub-Spoke Pattern","back":"One primary machine plans and dispatches. Others execute and report. Simple, reliable, easy to debug. Right choice for small fleets (2-5 machines)."},{"front":"Pipeline Pattern","back":"Tasks flow through machines in sequence. Each machine specializes in one stage. Best for workflows with clear sequential steps (preprocess -> infer -> publish)."},{"front":"Swarm Pattern","back":"All machines are peers. Shared task queue, any machine picks up the next task. Most resilient to failures. Best for embarrassingly parallel work."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Fleet orchestration quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Fleet Orchestration","questions":[{"q":"What three factors does a task dispatcher consider when routing work?","options":["Speed, cost, and complexity","Capability (can the machine do this task?), availability (is it online and not overloaded?), and priority (which machine should handle urgent work?)","RAM, CPU, and disk space","Network speed, model size, and queue depth"],"correct":1,"explanation":"The dispatcher matches tasks to machines based on what each machine can do (capabilities), whether it is ready (online, not overloaded), and how urgent the task is. A social media task goes to the machine with social capability and the lowest load."},{"q":"Why are heartbeats essential for fleet orchestration?","options":["Heartbeats make machines run faster","Without heartbeats, the dispatcher does not know if a machine is online or dead -- it could dispatch tasks to a crashed machine, where they disappear into a void","Heartbeats are required by the operating system","Heartbeats synchronize the clocks between machines"],"correct":1,"explanation":"A dead machine that the dispatcher thinks is alive receives tasks that never complete. Heartbeats detect machine failures within 90-180 seconds. Dead machines are removed from the dispatch pool, and their queued tasks are reassigned to healthy machines."},{"q":"When should you choose the hub-spoke pattern over the swarm pattern?","options":["When you have more than 10 machines","For small fleets (2-5 machines) where simplicity and debuggability matter more than maximum resilience -- hub-spoke has one coordinator, making task flow easy to trace and debug","When all tasks are identical","When you need maximum fault tolerance"],"correct":1,"explanation":"Hub-spoke is the simplest pattern. One machine plans, others execute. Easy to trace any task from dispatch to completion. For 2-5 machines, the single point of failure risk is acceptable. Swarm is better for large fleets where you need maximum resilience to individual machine failures."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/the-sovereign-stack/content-pipeline/" class="prev">&larr; Previous: Content Pipeline</a>
  <a href="/academy/the-sovereign-stack/monitoring-self-healing/" class="next">Next: Monitoring & Self-Healing &rarr;</a>
</nav>

</div>
