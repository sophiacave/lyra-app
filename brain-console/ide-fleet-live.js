/**
 * ide-fleet-live.js — Live Fleet Dashboard Enhancement
 * Polls heartbeats, shows real-time agent status, task timeline.
 * Built with love. McQueen x Rothko.
 */

let fleetPollInterval = null;
const FLEET_POLL_MS = 5000;

// ═══ Enhanced Fleet Panel with Live Heartbeats ═══

async function loadFleetPanelLive() {
  const container = document.getElementById('fleet-content');
  if (!container) return;

  await refreshFleetData(container);

  // Start live polling
  if (fleetPollInterval) clearInterval(fleetPollInterval);
  fleetPollInterval = setInterval(async () => {
    if (activePanel !== 'fleet') {
      clearInterval(fleetPollInterval);
      fleetPollInterval = null;
      return;
    }
    await refreshFleetData(container);
  }, FLEET_POLL_MS);
}

async function refreshFleetData(container) {
  try {
    const [status, ctx, orch] = await Promise.all([
      window.brain.getStatus(),
      window.brain.getContext(),
      window.brain.getOrchestration(),
    ]);

    // Find heartbeats in brain context (context may be object or array)
    const heartbeats = {};
    if (ctx.success && ctx.context) {
      const entries = Array.isArray(ctx.context)
        ? ctx.context
        : Object.entries(ctx.context).map(([key, value]) => ({ key, value }));
      entries.forEach(e => {
        if (e.key?.startsWith('heartbeat.')) {
          const val = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
          heartbeats[e.key] = { ...val, updated_at: e.updated_at };
        }
      });
    }

    const machines = [
      buildMachineCard('M3 Forge', 'm3_forge', '64GB M3 Max', 'Primary: Heavy AI, code, Studio', heartbeats['heartbeat.m3-forge'] || heartbeats['heartbeat.m3_forge'], true),
      buildMachineCard('M4 Mirror', 'm4_mirror', '48GB M4 Pro', 'Parallel: Social, deploys, testing', heartbeats['heartbeat.m4-mirror'] || heartbeats['heartbeat.m4_mirror'], false),
      buildMachineCard('GCP Watcher', 'gcp_watcher', '2GB Xeon', 'Cron: Heartbeat, monitoring', heartbeats['heartbeat.gcp-watcher'] || heartbeats['heartbeat.gcp_watcher'], false),
    ];

    // Task summary
    const tasks = orch.tasks || [];
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => ['assigned', 'in_progress', 'claimed'].includes(t.status)).length;

    // Auto-dispatch decision matrix visualization
    const dispatchMatrix = `
      <div class="fleet-section-header" style="margin-top:16px;">⚡ Auto-Dispatch Matrix</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:11px;">
        <div class="dispatch-rule m3">🖥️ M3: Code, Brain, AI, Security, Stripe</div>
        <div class="dispatch-rule m4">🖥️ M4: Social, Deploys, Testing, Video</div>
      </div>
    `;

    // Task timeline (last 5 tasks)
    const recentTasks = tasks.slice(0, 5);
    const timelineHtml = recentTasks.length ? recentTasks.map(t => {
      const statusIcon = { pending: '⏳', assigned: '📨', in_progress: '🔨', completed: '✅', failed: '❌' }[t.status] || '❓';
      const age = t.created_at ? timeSince(new Date(t.created_at)) : '';
      return `<div class="timeline-item">
        <span class="timeline-icon">${statusIcon}</span>
        <span class="timeline-title">${escapeHtml((t.title || '?').slice(0, 50))}</span>
        <span class="timeline-meta">${escapeHtml(t.assigned_to || '?')} · ${age}</span>
      </div>`;
    }).join('') : '<div style="color:var(--text-muted);font-size:11px;">No recent tasks</div>';

    container.innerHTML = `
      <div class="fleet-grid">${machines.join('')}</div>
      <div class="fleet-section-header" style="margin-top:16px;">📋 Task Queue</div>
      <div class="fleet-stats-row">
        <div class="fleet-stat"><span class="fleet-stat-num">${pending}</span> pending</div>
        <div class="fleet-stat"><span class="fleet-stat-num">${inProgress}</span> in progress</div>
        <div class="fleet-stat"><span class="fleet-stat-num">${orch.stats?.completed || 0}</span> completed</div>
      </div>
      <div class="timeline-list">${timelineHtml}</div>
      ${dispatchMatrix}
      <div class="fleet-section-header" style="margin-top:16px;">🏥 System Health</div>
      <div class="fleet-health">
        <div class="health-item"><span class="health-label">Brain</span><span class="health-value ${status.success ? 'ok' : 'fail'}">${status.success ? '🟢 Connected' : '🔴 Down'}</span></div>
        <div class="health-item"><span class="health-label">AI Provider</span><span class="health-value ok">${status.provider || 'None'}</span></div>
        <div class="health-item"><span class="health-label">Knowledge</span><span class="health-value ok">${status.knowledge?.totalEntries || 0} entries</span></div>
        <div class="health-item"><span class="health-label">Version</span><span class="health-value">${status.version || '?'}</span></div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Fleet scan failed: ${e.message}</div>`;
  }
}

function buildMachineCard(name, id, spec, role, heartbeat, isLocal) {
  let status = 'offline';
  let statusLabel = 'Offline';
  let details = '';

  if (isLocal) {
    status = 'online';
    statusLabel = 'Online (local)';
  } else if (heartbeat?.last_seen) {
    const age = (Date.now() - new Date(heartbeat.last_seen).getTime()) / 60000;
    if (age < 5) { status = 'online'; statusLabel = 'Online'; }
    else if (age < 60) { status = 'warn'; statusLabel = `${Math.floor(age)}m ago`; }
    else { status = 'offline'; statusLabel = `${Math.floor(age / 60)}h ago`; }
  }

  if (heartbeat) {
    if (heartbeat.cycle) details += `<div class="fleet-detail"><span class="fleet-label">Cycle:</span> ${heartbeat.cycle}</div>`;
    if (heartbeat.sentinel) details += `<div class="fleet-detail"><span class="fleet-label">Sentinel:</span> ${heartbeat.sentinel}</div>`;
    if (heartbeat.engine) details += `<div class="fleet-detail"><span class="fleet-label">Engine:</span> ${heartbeat.engine}</div>`;
  }

  return `
    <div class="fleet-card">
      <div class="fleet-card-header">
        <span class="fleet-name">${name}</span>
        <span class="fleet-status-dot ${status}" title="${statusLabel}"></span>
      </div>
      <div class="fleet-detail"><span class="fleet-label">Spec:</span> ${spec}</div>
      <div class="fleet-detail"><span class="fleet-label">Role:</span> ${role}</div>
      <div class="fleet-detail"><span class="fleet-label">Status:</span> ${statusLabel}</div>
      ${details}
    </div>
  `;
}

// ═══ Patch fleet panel to use live version ═══

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.loadFleetPanel = loadFleetPanel = loadFleetPanelLive;
  }, 300);
});
