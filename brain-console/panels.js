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

    brainEntries = result.context;
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
      fleetContext = ctx.context.find(e => e.key === 'computers.registry');
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

  container.innerHTML = '<div class="panel-loading">Loading knowledge base...</div>';

  try {
    const stats = await window.brain.kbStats();

    container.innerHTML = `
      <div class="kb-stats-grid">
        <div class="kb-stat-card">
          <div class="kb-stat-value">${stats.totalEntries || stats.localEntries || 0}</div>
          <div class="kb-stat-label">Total Entries</div>
        </div>
        <div class="kb-stat-card">
          <div class="kb-stat-value">${stats.categories?.length || 0}</div>
          <div class="kb-stat-label">Categories</div>
        </div>
        <div class="kb-stat-card">
          <div class="kb-stat-value">${stats.recentlyAdded || 0}</div>
          <div class="kb-stat-label">Added Today</div>
        </div>
      </div>
      <div class="kb-search-box">
        <input type="text" class="kb-search-input" placeholder="Search knowledge base..."
               onkeydown="if(event.key==='Enter')searchKB(this.value)">
        <button class="panel-btn btn-primary" onclick="searchKB(this.previousElementSibling.value)">Search</button>
      </div>
      <div id="kb-results" class="kb-results"></div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="panel-empty">Knowledge base unavailable: ${e.message}</div>`;
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

    resultsEl.innerHTML = results.map(r => `
      <div class="kb-result">
        <div class="kb-result-header">
          <span class="kb-result-topic">${escapeHtml(r.topic || r.key || '?')}</span>
          <span class="kb-result-score">${r.score ? (r.score * 100).toFixed(0) + '%' : ''}</span>
        </div>
        <div class="kb-result-content">${escapeHtml((r.content || r.value || '').slice(0, 300))}</div>
      </div>
    `).join('');
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

// Helper — escapeHtml is defined in index.html but we need it here too
if (typeof escapeHtml === 'undefined') {
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
}
