/**
 * panels.js — Faye Console Panel System
 * Brain Explorer, Divine Cycle, Fleet, Knowledge Base
 * McQueen x Rothko x Apple design bible
 */

// ============ PANEL SWITCHING ============

let activePanel = 'chat';

function switchPanel(panelName) {
  activePanel = panelName;

  // Hide all panels
  document.querySelectorAll('.panel-view').forEach(p => p.style.display = 'none');
  // Show target
  const target = document.getElementById(`panel-${panelName}`);
  if (target) target.style.display = 'flex';

  // Update nav active state
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.nav-tab[data-panel="${panelName}"]`);
  if (activeTab) activeTab.classList.add('active');

  // Load panel data on switch
  if (panelName === 'brain') loadBrainPanel();
  if (panelName === 'divine') loadDivinePanel();
  if (panelName === 'fleet') loadFleetPanel();
  if (panelName === 'kb') loadKBPanel();
  if (panelName === 'monitor') loadMonitorPanel();
  if (panelName === 'orchestration') loadOrchestrationPanel();
  if (panelName === 'integrations') loadIntegrationsPanel();
  if (panelName === 'vault') loadVaultPanel();
  if (panelName === 'editor') loadEditorPanel();
  if (panelName === 'terminal') loadTerminalPanel();
}

// ============ BRAIN EXPLORER ============

let brainEntries = [];
let brainFilter = '';

async function loadBrainPanel() {
  const container = document.getElementById('brain-entries');
  const statsEl = document.getElementById('brain-stats');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Loading brain...</div>';

  try {
    const result = await window.brain.getContext();
    if (!result.success || !result.context) {
      container.innerHTML = '<div class="panel-empty">Brain not connected. Check Settings.</div>';
      return;
    }

    // Context may be object {key: value} or array — normalize to array
    const ctx = result.context;
    if (Array.isArray(ctx)) {
      brainEntries = ctx;
    } else {
      brainEntries = Object.entries(ctx).map(([key, value]) => ({
        key,
        value,
        category: key.split('.')[0],
        description: typeof value === 'object' ? (value.law || value.status || '') : '',
        priority: 5,
      }));
    }
    renderBrainEntries();

    // Stats
    const categories = {};
    brainEntries.forEach(e => {
      const cat = e.category || e.key?.split('.')[0] || 'unknown';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    const catHtml = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => `<span class="brain-cat-badge">${cat} <span class="cat-count">${count}</span></span>`)
      .join('');
    statsEl.innerHTML = `<span class="brain-total">${brainEntries.length} entries</span>${catHtml}`;
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Error: ${e.message}</div>`;
  }
}

function filterBrain(query) {
  brainFilter = query.toLowerCase();
  renderBrainEntries();
}

function renderBrainEntries() {
  const container = document.getElementById('brain-entries');
  if (!container) return;

  let filtered = brainEntries;
  if (brainFilter) {
    filtered = brainEntries.filter(e =>
      (e.key || '').toLowerCase().includes(brainFilter) ||
      (e.description || '').toLowerCase().includes(brainFilter) ||
      (typeof e.value === 'string' ? e.value : JSON.stringify(e.value || '')).toLowerCase().includes(brainFilter)
    );
  }

  if (!filtered.length) {
    container.innerHTML = `<div class="panel-empty">${brainFilter ? 'No matches' : 'No entries'}</div>`;
    return;
  }

  container.innerHTML = filtered.map(entry => {
    const key = entry.key || '?';
    const cat = entry.category || key.split('.')[0];
    const desc = entry.description || '';
    const val = typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value || '', null, 2);
    const preview = val.length > 200 ? val.slice(0, 200) + '...' : val;
    const priority = entry.priority || 5;
    const priorityClass = priority >= 8 ? 'priority-high' : priority >= 5 ? 'priority-mid' : 'priority-low';

    return `
      <div class="brain-entry" onclick="toggleBrainEntry(this)">
        <div class="brain-entry-header">
          <span class="brain-key">${escapeHtml(key)}</span>
          <span class="brain-cat ${priorityClass}">${escapeHtml(cat)}</span>
          <button class="brain-edit-btn" onclick="event.stopPropagation(); openBrainEditor('${escapeHtml(key).replace(/'/g, "\\'")}')">Edit</button>
        </div>
        <div class="brain-desc">${escapeHtml(desc)}</div>
        <div class="brain-value collapsed">${escapeHtml(preview)}</div>
        <div class="brain-value-full" style="display:none;">${escapeHtml(val)}</div>
      </div>
    `;
  }).join('');
}

function toggleBrainEntry(el) {
  const collapsed = el.querySelector('.brain-value');
  const full = el.querySelector('.brain-value-full');
  if (full.style.display === 'none') {
    full.style.display = 'block';
    collapsed.style.display = 'none';
    el.classList.add('expanded');
  } else {
    full.style.display = 'none';
    collapsed.style.display = 'block';
    el.classList.remove('expanded');
  }
}

// ============ DIVINE CYCLE PANEL ============

let divineRefreshInterval = null;

async function loadDivinePanel() {
  const container = document.getElementById('divine-content');
  if (!container) return;

  try {
    const status = await window.brain.divineStatus();
    renderDivinePanel(status);

    // Auto-refresh every 5s while panel is active
    if (divineRefreshInterval) clearInterval(divineRefreshInterval);
    divineRefreshInterval = setInterval(async () => {
      if (activePanel !== 'divine') { clearInterval(divineRefreshInterval); return; }
      try {
        const s = await window.brain.divineStatus();
        renderDivinePanel(s);
      } catch {}
    }, 5000);
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Divine cycle not available: ${e.message}</div>`;
  }
}

function renderDivinePanel(status) {
  const container = document.getElementById('divine-content');
  if (!container) return;

  const phases = ['planning', 'executing', 'smoketesting', 'handing_off'];
  const phaseLabels = { planning: 'PLAN', executing: 'PHASE', smoketesting: 'SMOKETEST', handing_off: 'HANDOFF' };
  const phaseIcons = { planning: '\u{1F9E0}', executing: '\u{26A1}', smoketesting: '\u{1F50D}', handing_off: '\u{1F4E6}' };

  const phaseDots = phases.map(p => {
    const isActive = status.phase === p;
    const isDone = phases.indexOf(p) < phases.indexOf(status.phase);
    const cls = isActive ? 'phase-active' : isDone ? 'phase-done' : 'phase-pending';
    return `<div class="phase-dot ${cls}">
      <span class="phase-icon">${phaseIcons[p] || ''}</span>
      <span class="phase-label">${phaseLabels[p] || p}</span>
    </div>`;
  }).join('<div class="phase-connector"></div>');

  const logHtml = (status.log || []).slice(-15).reverse().map(entry => {
    const time = entry.time ? new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return `<div class="divine-log-entry">
      <span class="log-time">${time}</span>
      <span class="log-msg">${escapeHtml(typeof entry === 'string' ? entry : entry.message || JSON.stringify(entry))}</span>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="divine-header">
      <div class="divine-status-badge ${status.active ? 'active' : 'inactive'}">
        <span class="dot"></span>
        ${status.active ? 'ACTIVE' : 'IDLE'}
      </div>
      <div class="divine-cycle-count">Cycle #${status.cycle || 0}</div>
      <div class="divine-task-progress">${status.taskIndex || 0}/${status.totalTasks || 0} tasks</div>
      <button class="panel-btn ${status.active ? 'btn-danger' : 'btn-primary'}" onclick="toggleDivine(${!status.active})">
        ${status.active ? 'Stop' : 'Start'} Divine Cycle
      </button>
    </div>
    <div class="divine-phases">${phaseDots}</div>
    <div class="divine-log-header">Activity Log</div>
    <div class="divine-log">${logHtml || '<div class="panel-empty">No log entries yet</div>'}</div>
  `;
}

async function toggleDivine(on) {
  try {
    await window.brain.divineToggle(on);
    setTimeout(() => loadDivinePanel(), 500);
  } catch (e) {
    console.error('Divine toggle failed:', e);
  }
}

// ============ FLEET PANEL ============

async function loadFleetPanel() {
  const container = document.getElementById('fleet-content');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Scanning fleet...</div>';

  try {
    // Get system status for local machine info
    const status = await window.brain.getStatus();
    // Get context for fleet data
    const ctx = await window.brain.getContext();

    const machines = [
      { name: 'M3 Forge', role: 'Primary', ram: '64GB M3 Max', status: 'online', tasks: 'Heavy AI, code, Studio' },
      { name: 'M4 Mirror', role: 'Parallel', ram: '48GB M4 Pro', status: 'unknown', tasks: 'Social, deploys, testing' },
      { name: 'GCP Watcher', role: 'Cron', ram: '2GB Xeon', status: 'unknown', tasks: 'Heartbeat, monitoring' },
    ];

    // Try to find fleet context in brain
    let fleetContext = null;
    if (ctx.success && ctx.context) {
      // Context may be object or array
      if (Array.isArray(ctx.context)) {
        fleetContext = ctx.context.find(e => e.key === 'computers.registry');
      } else if (ctx.context['computers.registry']) {
        fleetContext = { key: 'computers.registry', value: ctx.context['computers.registry'] };
      }
    }

    const machineCards = machines.map(m => `
      <div class="fleet-card">
        <div class="fleet-card-header">
          <span class="fleet-name">${m.name}</span>
          <span class="fleet-status-dot ${m.name === 'M3 Forge' ? 'online' : m.status}"></span>
        </div>
        <div class="fleet-detail"><span class="fleet-label">Role:</span> ${m.role}</div>
        <div class="fleet-detail"><span class="fleet-label">Spec:</span> ${m.ram}</div>
        <div class="fleet-detail"><span class="fleet-label">Work:</span> ${m.tasks}</div>
      </div>
    `).join('');

    // Agent status
    const agent = status.agent || {};
    const agentHtml = agent.running
      ? `<div class="fleet-agent-status running">Agent: Running (${agent.currentStep || '?'})</div>`
      : '<div class="fleet-agent-status idle">Agent: Idle</div>';

    container.innerHTML = `
      <div class="fleet-grid">${machineCards}</div>
      ${agentHtml}
      <div class="fleet-section-header">System Health</div>
      <div class="fleet-health">
        <div class="health-item">
          <span class="health-label">Brain</span>
          <span class="health-value ${status.success ? 'ok' : 'fail'}">${status.success ? 'Connected' : 'Down'}</span>
        </div>
        <div class="health-item">
          <span class="health-label">Provider</span>
          <span class="health-value ok">${status.provider || 'None'}</span>
        </div>
        <div class="health-item">
          <span class="health-label">Knowledge</span>
          <span class="health-value ok">${status.knowledge?.totalEntries || 0} entries</span>
        </div>
        <div class="health-item">
          <span class="health-label">Version</span>
          <span class="health-value">${status.version || '?'}</span>
        </div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Fleet scan failed: ${e.message}</div>`;
  }
}

// ============ KNOWLEDGE BASE PANEL ============

async function loadKBPanel() {
  const container = document.getElementById('kb-content');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Loading knowledge stores...</div>';

  try {
    const stats = await window.brain.kbStats();
    const categories = stats.categories || [];
    const total = stats.totalEntries || 0;

    const catCards = categories.map(c => `
      <div class="kb-stat-card" onclick="searchKB('${c.name.toLowerCase()}')">
        <div class="kb-stat-value">${c.icon || '📊'} ${c.count.toLocaleString()}</div>
        <div class="kb-stat-label">${c.name}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="kb-stats-grid">
        <div class="kb-stat-card" style="background: var(--gradient-brand); color: white;">
          <div class="kb-stat-value" style="font-size: 28px;">${total.toLocaleString()}</div>
          <div class="kb-stat-label">Total Knowledge Entries</div>
        </div>
        ${catCards}
      </div>
      <div class="kb-search-box">
        <input type="text" class="kb-search-input" placeholder="Search across ALL knowledge stores (context, episodes, graph, chunks, archive)..."
               onkeydown="if(event.key==='Enter')searchKB(this.value)">
        <button class="panel-btn btn-primary" onclick="searchKB(this.previousElementSibling.value)">Search</button>
      </div>
      <div id="kb-results" class="kb-results"></div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Knowledge stores unavailable: ${e.message}</div>`;
  }
}

async function searchKB(query) {
  if (!query.trim()) return;
  const resultsEl = document.getElementById('kb-results');
  if (!resultsEl) return;

  resultsEl.innerHTML = '<div class="panel-loading">Searching...</div>';

  try {
    const results = await window.brain.kbSearch(query, 20);

    if (!results?.length) {
      resultsEl.innerHTML = '<div class="panel-empty">No results</div>';
      return;
    }

    const sourceIcons = { brain_context: '🧠', episodes: '📜', graph: '🕸️', chunks: '🔍', archive: '📦' };
    const sourceColors = { brain_context: 'var(--accent-purple)', episodes: 'var(--accent-cyan)', graph: 'var(--accent-green)', chunks: 'var(--accent-yellow)', archive: 'var(--smoke)' };

    resultsEl.innerHTML = `<div style="font-size:11px;color:var(--smoke);margin-bottom:12px;">${results.length} results across ${[...new Set(results.map(r=>r.source))].length} knowledge stores</div>` +
    results.map(r => {
      const icon = sourceIcons[r.source] || '📊';
      const color = sourceColors[r.source] || 'var(--smoke)';
      return `
      <div class="kb-result">
        <div class="kb-result-header">
          <span class="kb-result-topic">${escapeHtml(r.topic || r.key || '?')}</span>
          <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:${color}20;color:${color};font-family:'JetBrains Mono',monospace;">${icon} ${r.source || '?'}</span>
        </div>
        <div class="kb-result-content">${escapeHtml((r.content || r.value || '').slice(0, 300))}</div>
        ${r.updated_at ? `<div style="font-size:10px;color:var(--smoke);margin-top:4px;">${new Date(r.updated_at).toLocaleString()}</div>` : ''}
      </div>
    `}).join('');
  } catch (e) {
    resultsEl.innerHTML = `<div class="panel-empty">Search failed: ${e.message}</div>`;
  }
}

// ============ SYSTEM MONITOR PANEL ============

let monitorRefreshInterval = null;

async function loadMonitorPanel() {
  const container = document.getElementById('monitor-content');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Scanning system...</div>';

  try {
    const data = await window.brain.systemMonitor();
    renderMonitorPanel(data);

    // Auto-refresh every 10s while panel is active
    if (monitorRefreshInterval) clearInterval(monitorRefreshInterval);
    monitorRefreshInterval = setInterval(async () => {
      if (activePanel !== 'monitor') { clearInterval(monitorRefreshInterval); monitorRefreshInterval = null; return; }
      try {
        const d = await window.brain.systemMonitor();
        renderMonitorPanel(d);
      } catch {}
    }, 10000);
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Monitor error: ${e.message}</div>`;
  }
}

function renderMonitorPanel(data) {
  const container = document.getElementById('monitor-content');
  if (!container) return;

  // RAM bar
  let ramHtml = '';
  if (data.ram) {
    const pct = data.ram.pressure;
    const barClass = pct > 85 ? 'critical' : pct > 65 ? 'warning' : '';
    ramHtml = `
      <div class="monitor-card" style="grid-column: span 2;">
        <div class="monitor-card-title">Memory — ${data.ram.totalGB}GB</div>
        <div class="ram-bar-outer">
          <div class="ram-bar-fill ${barClass}" style="width:${pct}%"></div>
          <div class="ram-bar-label">${data.ram.usedGB}GB / ${data.ram.totalGB}GB (${pct}%)</div>
        </div>
        <div class="ram-breakdown">
          <span class="ram-stat">Active: <span class="ram-stat-value">${data.ram.activeGB}GB</span></span>
          <span class="ram-stat">Wired: <span class="ram-stat-value">${data.ram.wiredGB}GB</span></span>
          <span class="ram-stat">Compressed: <span class="ram-stat-value">${data.ram.compressedGB}GB</span></span>
          <span class="ram-stat">Free: <span class="ram-stat-value">${data.ram.freeGB}GB</span></span>
        </div>
        ${data.swap ? `<div class="swap-info">Swap: <span class="swap-value">${data.swap.usedMB.toFixed(0)}MB</span> / ${data.swap.totalMB.toFixed(0)}MB</div>` : ''}
      </div>
    `;
  }

  // CPU info
  let cpuHtml = '';
  if (data.cpuBrand) {
    cpuHtml = `<div class="monitor-cpu-info"><strong>${data.cpuBrand}</strong> — ${data.cpuCores} cores</div>`;
  }

  // Top processes by CPU
  let cpuTableHtml = renderProcessTable(data.topCPU, 'cpu');
  let ramTableHtml = renderProcessTable(data.topRAM, 'mem');

  // Ollama models
  let ollamaHtml = '';
  if (data.ollamaModels === null) {
    ollamaHtml = '<div class="monitor-empty">Ollama not running</div>';
  } else if (data.ollamaModels.length === 0) {
    ollamaHtml = '<div class="monitor-empty">No models loaded</div>';
  } else {
    ollamaHtml = data.ollamaModels.map(m => `
      <div class="ollama-model">
        <div>
          <span class="ollama-model-name">${escapeHtml(m.name)}</span>
          <span class="ollama-model-size">${m.sizeGB}GB</span>
        </div>
        <button class="unload-btn" onclick="unloadOllamaModel('${escapeHtml(m.name)}')">Unload</button>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <div class="monitor-grid">${ramHtml}</div>
    ${cpuHtml}
    <div class="monitor-section">
      <div class="monitor-section-title">Top by CPU</div>
      ${cpuTableHtml}
    </div>
    <div class="monitor-section">
      <div class="monitor-section-title">Top by RAM</div>
      ${ramTableHtml}
    </div>
    <div class="monitor-section">
      <div class="monitor-section-title">Ollama Models</div>
      ${ollamaHtml}
    </div>
  `;
}

function renderProcessTable(processes, sortField) {
  if (!processes || !processes.length) return '<div class="monitor-empty">No data</div>';

  const rows = processes.slice(0, 10).map(p => {
    const cpuClass = p.cpu > 50 ? 'high' : '';
    const memClass = p.mem > 20 ? 'high' : '';
    return `<tr>
      <td>${p.pid}</td>
      <td class="${cpuClass}">${p.cpu.toFixed(1)}%</td>
      <td class="${memClass}">${p.mem.toFixed(1)}%</td>
      <td class="cmd" title="${escapeHtml(p.command)}">${escapeHtml(p.command)}</td>
      <td><button class="kill-btn" onclick="killProcess('${p.pid}')">Kill</button></td>
    </tr>`;
  }).join('');

  return `<table class="process-table">
    <thead><tr><th>PID</th><th>CPU</th><th>MEM</th><th>Command</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

async function killProcess(pid) {
  // Double-click protection: mark button as confirming
  const btn = event?.target;
  if (btn && !btn.classList.contains('kill-confirm')) {
    btn.classList.add('kill-confirm');
    btn.textContent = 'Confirm?';
    btn.style.background = 'var(--alert)';
    btn.style.color = 'var(--void)';
    setTimeout(() => { btn.classList.remove('kill-confirm'); btn.textContent = 'Kill'; btn.style.background = ''; btn.style.color = ''; }, 3000);
    return;
  }
  try {
    const result = await window.brain.killProcess(pid);
    if (result.success) {
      setTimeout(() => loadMonitorPanel(), 500);
    }
  } catch (e) { console.error('Kill failed:', e); }
}

// ============ BRAIN EDITOR ============

function openBrainEditor(key) {
  const entry = brainEntries.find(e => e.key === key);
  if (!entry) return;

  const val = typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value || '', null, 2);
  const desc = entry.description || '';
  const cat = entry.category || key.split('.')[0];
  const priority = entry.priority || 5;

  // Create modal
  let modal = document.getElementById('brain-editor-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'brain-editor-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal" style="width:700px;max-height:80vh;display:flex;flex-direction:column;">
      <h2 style="font-family:'JetBrains Mono',monospace;font-size:14px;margin-bottom:16px;">
        Edit: <span style="color:var(--process);">${escapeHtml(key)}</span>
      </h2>
      <div style="margin-bottom:12px;">
        <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">Description</label>
        <input id="brain-edit-desc" type="text" value="${escapeHtml(desc)}"
          style="width:100%;background:var(--ash);border:1px solid var(--border);color:var(--chalk);padding:8px 12px;border-radius:6px;font-size:13px;font-family:Inter,sans-serif;">
      </div>
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <div style="flex:1;">
          <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">Category</label>
          <input id="brain-edit-cat" type="text" value="${escapeHtml(cat)}"
            style="width:100%;background:var(--ash);border:1px solid var(--border);color:var(--chalk);padding:8px 12px;border-radius:6px;font-size:13px;">
        </div>
        <div style="width:80px;">
          <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">Priority</label>
          <input id="brain-edit-priority" type="number" min="1" max="10" value="${priority}"
            style="width:100%;background:var(--ash);border:1px solid var(--border);color:var(--chalk);padding:8px 12px;border-radius:6px;font-size:13px;text-align:center;">
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;margin-bottom:16px;">
        <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">Value (JSON or text)</label>
        <textarea id="brain-edit-value"
          style="flex:1;min-height:200px;background:var(--ash);border:1px solid var(--border);color:var(--chalk);padding:12px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:12px;resize:vertical;line-height:1.5;">${escapeHtml(val)}</textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="panel-btn" onclick="closeBrainEditor()" style="padding:8px 16px;">Cancel</button>
        <button class="panel-btn btn-primary" onclick="saveBrainEntry('${escapeHtml(key).replace(/'/g, "\\'")}')" style="padding:8px 16px;">Save to Brain</button>
      </div>
      <div id="brain-edit-status" style="margin-top:8px;font-size:11px;"></div>
    </div>
  `;
}

function closeBrainEditor() {
  const modal = document.getElementById('brain-editor-modal');
  if (modal) modal.style.display = 'none';
}

async function saveBrainEntry(key) {
  const statusEl = document.getElementById('brain-edit-status');
  const valueRaw = document.getElementById('brain-edit-value').value;
  const desc = document.getElementById('brain-edit-desc').value;
  const cat = document.getElementById('brain-edit-cat').value;
  const priority = parseInt(document.getElementById('brain-edit-priority').value) || 5;

  statusEl.innerHTML = '<span style="color:var(--gold);">Saving...</span>';

  // Try to parse as JSON, fall back to string
  let value;
  try {
    value = JSON.parse(valueRaw);
  } catch {
    value = valueRaw;
  }

  try {
    const result = await window.brain.brainWrite(key, value, desc, cat, priority);
    if (result.success) {
      statusEl.innerHTML = '<span style="color:var(--result);">Saved to brain.</span>';
      setTimeout(() => { closeBrainEditor(); loadBrainPanel(); }, 800);
    } else {
      statusEl.innerHTML = `<span style="color:var(--alert);">Error: ${result.error}</span>`;
    }
  } catch (e) {
    statusEl.innerHTML = `<span style="color:var(--alert);">Error: ${e.message}</span>`;
  }
}

async function unloadOllamaModel(model) {
  try {
    const result = await window.brain.ollamaUnload(model);
    if (result.success) {
      setTimeout(() => loadMonitorPanel(), 500);
    }
  } catch (e) { console.error('Unload failed:', e); }
}

// ============ ORCHESTRATION PANEL ============

let orchRefreshInterval = null;

async function loadOrchestrationPanel() {
  const container = document.getElementById('orchestration-content');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Loading orchestration state...</div>';

  try {
    const data = await window.brain.getOrchestration();
    renderOrchestrationPanel(data);

    if (orchRefreshInterval) clearInterval(orchRefreshInterval);
    orchRefreshInterval = setInterval(async () => {
      if (activePanel !== 'orchestration') { clearInterval(orchRefreshInterval); orchRefreshInterval = null; return; }
      try {
        const d = await window.brain.getOrchestration();
        renderOrchestrationPanel(d);
      } catch {}
    }, 8000);
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Orchestration unavailable: ${e.message}</div>`;
  }
}

function renderOrchestrationPanel(data) {
  const container = document.getElementById('orchestration-content');
  if (!container) return;

  const agents = data.agents || [];
  const tasks = data.tasks || [];
  const patterns = data.patterns || [];
  const stats = data.stats || {};

  // Agent roster
  const agentHtml = agents.length ? agents.map(a => `
    <div class="orch-agent">
      <div class="orch-agent-dot ${a.status || 'idle'}"></div>
      <div class="orch-agent-name">${escapeHtml(a.role || a.name)}</div>
      <div class="orch-agent-task">${escapeHtml(a.currentTask || 'No active task')}</div>
      <div class="orch-agent-machine">${escapeHtml(a.machine || '?')}</div>
    </div>
  `).join('') : '<div class="panel-empty">No agents registered</div>';

  // Task queue
  const taskHtml = tasks.length ? tasks.map(t => {
    const statusClass = (t.status || 'pending').toLowerCase();
    const age = t.created_at ? timeSince(new Date(t.created_at)) : '';
    return `
      <div class="orch-task">
        <div class="orch-task-status ${statusClass}"></div>
        <div class="orch-task-title">${escapeHtml(t.title || t.task_type || '?')}</div>
        <div class="orch-task-meta">${escapeHtml(t.target || '')} ${age ? '· ' + age : ''}</div>
      </div>
    `;
  }).join('') : '<div class="panel-empty">No tasks in queue</div>';

  // Orchestration patterns
  const patternCards = [
    { icon: '🎯', name: 'Hub-Spoke', desc: 'Console orchestrates all agents' },
    { icon: '⛓️', name: 'Pipeline', desc: 'Task chains: A → B → C' },
    { icon: '🐝', name: 'Swarm', desc: 'Parallel independent work' },
  ];

  const patternHtml = patternCards.map(p => `
    <div class="orch-pattern" onclick="dispatchPattern('${p.name.toLowerCase()}')">
      <div class="orch-pattern-icon">${p.icon}</div>
      <div class="orch-pattern-name">${p.name}</div>
      <div class="orch-pattern-desc">${p.desc}</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="orch-grid">
      <div class="orch-card">
        <div class="orch-card-title">🕸️ Fleet Agents</div>
        <div class="orch-stat"><span>Total Agents</span><span class="orch-stat-value">${agents.length}</span></div>
        <div class="orch-stat"><span>Active</span><span class="orch-stat-value">${agents.filter(a => a.status === 'active').length}</span></div>
        <div class="orch-stat"><span>Tasks Completed</span><span class="orch-stat-value">${stats.completed || 0}</span></div>
        <div class="orch-stat"><span>Tasks Failed</span><span class="orch-stat-value">${stats.failed || 0}</span></div>
      </div>
      <div class="orch-card">
        <div class="orch-card-title">📊 Orchestration Health</div>
        <div class="orch-stat"><span>Queue Depth</span><span class="orch-stat-value">${tasks.filter(t => t.status === 'pending').length}</span></div>
        <div class="orch-stat"><span>In Progress</span><span class="orch-stat-value">${tasks.filter(t => t.status === 'claimed').length}</span></div>
        <div class="orch-stat"><span>Pattern</span><span class="orch-stat-value">${stats.activePattern || 'None'}</span></div>
        <div class="orch-stat"><span>Last Dispatch</span><span class="orch-stat-value">${stats.lastDispatch ? timeSince(new Date(stats.lastDispatch)) : 'Never'}</span></div>
      </div>
    </div>

    <div class="orch-section-title">Active Agents</div>
    <div class="orch-agent-list">${agentHtml}</div>

    <div class="orch-section-title">Orchestration Patterns</div>
    <div class="orch-pattern-cards">${patternHtml}</div>

    <div class="orch-section-title">Task Queue</div>
    <div class="orch-task-queue">${taskHtml}</div>

    <div class="orch-dispatch-form">
      <input type="text" class="orch-dispatch-input" id="orchDispatchInput"
             placeholder="Dispatch task: describe what needs doing..."
             onkeydown="if(event.key==='Enter')dispatchTask(this.value)">
      <select id="orchDispatchTarget" style="padding:8px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);font-family:'JetBrains Mono',monospace;font-size:11px;">
        <option value="m3_forge">M3 Forge</option>
        <option value="m4_mirror">M4 Mirror</option>
        <option value="auto">Auto (best fit)</option>
      </select>
      <button class="panel-btn btn-primary" onclick="dispatchTask(document.getElementById('orchDispatchInput').value)">Dispatch</button>
    </div>
    <div id="orchDispatchStatus" style="font-size:11px;margin-top:6px;font-family:'JetBrains Mono',monospace;"></div>
  `;
}

async function dispatchTask(title) {
  if (!title.trim()) return;
  const target = document.getElementById('orchDispatchTarget')?.value || 'auto';
  const statusEl = document.getElementById('orchDispatchStatus');

  try {
    if (statusEl) statusEl.innerHTML = '<span style="color:var(--gold);">Dispatching...</span>';
    const result = await window.brain.dispatchTask(title, target);
    document.getElementById('orchDispatchInput').value = '';
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:var(--result);">✅ Dispatched → ${escapeHtml(result.target || 'auto')} [${escapeHtml(result.category || 'general')}]</span>`;
      setTimeout(() => { if (statusEl) statusEl.innerHTML = ''; }, 4000);
    }
    setTimeout(() => loadOrchestrationPanel(), 800);
  } catch (e) {
    console.error('Dispatch failed:', e);
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--alert);">❌ ${escapeHtml(e.message)}</span>`;
  }
}

async function dispatchPattern(pattern) {
  try {
    await window.brain.dispatchPattern(pattern);
    setTimeout(() => loadOrchestrationPanel(), 500);
  } catch (e) { console.error('Pattern dispatch failed:', e); }
}

function timeSince(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// ============ INTEGRATIONS PANEL ============

async function loadIntegrationsPanel() {
  const container = document.getElementById('integrations-content');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Scanning integrations...</div>';

  try {
    const data = await window.brain.getIntegrations();
    renderIntegrationsPanel(data);
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Integrations scan failed: ${e.message}</div>`;
  }
}

function renderIntegrationsPanel(data) {
  const container = document.getElementById('integrations-content');
  if (!container) return;

  const stripe = data.stripe || {};
  const vercel = data.vercel || {};
  const supabase = data.supabase || {};
  const fleet = data.fleet || {};

  const stripeStatus = stripe.connected ? 'online' : 'offline';
  const vercelStatus = vercel.connected ? 'online' : 'unknown';
  const supabaseStatus = supabase.connected ? 'online' : 'offline';

  container.innerHTML = `
    <div class="integ-grid">
      <div class="integ-card">
        <div class="integ-card-header">
          <span class="integ-card-icon">💳</span>
          <span class="integ-card-title">Stripe</span>
          <div class="integ-card-status ${stripeStatus}"></div>
        </div>
        <div class="integ-stat"><span class="integ-stat-label">MRR</span><span class="integ-stat-value ${stripe.mrr > 0 ? 'good' : 'warn'}">$${(stripe.mrr || 0).toFixed(2)}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Customers</span><span class="integ-stat-value">${stripe.customers || 0}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Last Payment</span><span class="integ-stat-value">${stripe.lastPayment || 'None'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Balance</span><span class="integ-stat-value">$${(stripe.balance || 0).toFixed(2)}</span></div>
      </div>

      <div class="integ-card">
        <div class="integ-card-header">
          <span class="integ-card-icon">▲</span>
          <span class="integ-card-title">Vercel</span>
          <div class="integ-card-status ${vercelStatus}"></div>
        </div>
        <div class="integ-stat"><span class="integ-stat-label">Last Deploy</span><span class="integ-stat-value">${vercel.lastDeploy || 'Unknown'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Branch</span><span class="integ-stat-value">${vercel.branch || 'main'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Uncommitted</span><span class="integ-stat-value ${(vercel.uncommitted || 0) > 0 ? 'warn' : 'good'}">${vercel.uncommitted || 0} files</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Status</span><span class="integ-stat-value good">${vercel.status || 'Ready'}</span></div>
      </div>

      <div class="integ-card">
        <div class="integ-card-header">
          <span class="integ-card-icon">⚡</span>
          <span class="integ-card-title">Supabase</span>
          <div class="integ-card-status ${supabaseStatus}"></div>
        </div>
        <div class="integ-stat"><span class="integ-stat-label">Brain Entries</span><span class="integ-stat-value">${supabase.brainEntries || 0}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Last Update</span><span class="integ-stat-value">${supabase.lastUpdate || 'Unknown'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Plan</span><span class="integ-stat-value">${supabase.plan || 'Pro'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">4-Brain</span><span class="integ-stat-value good">${supabase.brainCount || 4} active</span></div>
      </div>

      <div class="integ-card">
        <div class="integ-card-header">
          <span class="integ-card-icon">🖥️</span>
          <span class="integ-card-title">Fleet</span>
          <div class="integ-card-status ${fleet.healthy ? 'online' : 'unknown'}"></div>
        </div>
        <div class="integ-stat"><span class="integ-stat-label">M3 Forge</span><span class="integ-stat-value good">${fleet.m3 || 'Online'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">M4 Mirror</span><span class="integ-stat-value">${fleet.m4 || 'Unknown'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">GCP Watcher</span><span class="integ-stat-value">${fleet.gcp || 'Unknown'}</span></div>
        <div class="integ-stat"><span class="integ-stat-label">Active Tasks</span><span class="integ-stat-value">${fleet.activeTasks || 0}</span></div>
      </div>
    </div>
  `;
}

// ============ VAULT PANEL ============

let vaultRevealTimers = {};

async function loadVaultPanel() {
  const container = document.getElementById('vault-content');
  if (!container) return;

  container.innerHTML = '<div class="panel-loading">Loading vault...</div>';

  try {
    const entries = await window.brain.vaultList();
    renderVaultPanel(entries);
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Vault unavailable: ${e.message}</div>`;
  }
}

function renderVaultPanel(entries) {
  const container = document.getElementById('vault-content');
  if (!container) return;

  if (!entries || !entries.length) {
    container.innerHTML = `
      <div class="vault-warning">Vault is empty or not connected. Check brain connection in Settings.</div>
      <div class="panel-empty">No credentials stored</div>
    `;
    return;
  }

  const serviceIcons = {
    stripe: '💳', supabase: '⚡', vercel: '▲', github: '🐙',
    groq: '🤖', openrouter: '🔀', anthropic: '🧠', resend: '📧',
    namecheap: '🌐', bunny: '🐰', kling: '🎬', huggingface: '🤗',
    make: '⚙️', gmail: '📬', ollama: '🦙',
  };

  const entryHtml = entries.map((e, i) => {
    const name = e.service || e.name || e.key || `Entry ${i}`;
    const desc = e.description || e.type || '';
    const icon = serviceIcons[name.toLowerCase().split('_')[0]] || '🔑';
    const masked = e.masked || '••••••••';

    return `
      <div class="vault-entry" id="vault-entry-${i}">
        <div class="vault-icon">${icon}</div>
        <div class="vault-info">
          <div class="vault-service">${escapeHtml(name)}</div>
          <div class="vault-desc">${escapeHtml(desc)}</div>
        </div>
        <div class="vault-value" id="vault-val-${i}">${escapeHtml(masked)}</div>
        <button class="vault-reveal-btn" id="vault-btn-${i}" onclick="revealVaultEntry('${escapeHtml(name).replace(/'/g, "\\'")}', ${i})">Reveal</button>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="vault-warning">Read-only view. Values auto-mask after 5 seconds. Never share credentials.</div>
    <div class="vault-list">${entryHtml}</div>
  `;
}

async function revealVaultEntry(service, index) {
  const valEl = document.getElementById(`vault-val-${index}`);
  const btnEl = document.getElementById(`vault-btn-${index}`);
  if (!valEl || !btnEl) return;

  // If already revealed, re-mask
  if (btnEl.textContent === 'Hide') {
    maskVaultEntry(index);
    return;
  }

  btnEl.textContent = 'Loading...';

  try {
    const result = await window.brain.vaultGet(service);
    const value = typeof result === 'string' ? result :
                  (result?.value || result?.key || result?.data || JSON.stringify(result));

    valEl.textContent = value || 'Empty';
    valEl.classList.add('vault-revealed');
    btnEl.textContent = 'Hide';

    // Auto-mask after 5 seconds
    if (vaultRevealTimers[index]) clearTimeout(vaultRevealTimers[index]);
    vaultRevealTimers[index] = setTimeout(() => maskVaultEntry(index), 5000);
  } catch (e) {
    valEl.textContent = 'Error: ' + e.message;
    btnEl.textContent = 'Reveal';
  }
}

function maskVaultEntry(index) {
  const valEl = document.getElementById(`vault-val-${index}`);
  const btnEl = document.getElementById(`vault-btn-${index}`);
  if (valEl) { valEl.textContent = '••••••••'; valEl.classList.remove('vault-revealed'); }
  if (btnEl) btnEl.textContent = 'Reveal';
  if (vaultRevealTimers[index]) { clearTimeout(vaultRevealTimers[index]); delete vaultRevealTimers[index]; }
}

// Helper — escapeHtml is defined in index.html but we need it here too
if (typeof escapeHtml === 'undefined') {
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
}
