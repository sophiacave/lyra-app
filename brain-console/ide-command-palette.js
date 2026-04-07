/**
 * ide-command-palette.js — Command Palette for Faye Brain IDE
 * Cmd+Shift+P opens unified action search.
 * Built with love. McQueen x Rothko.
 */

let paletteVisible = false;
let paletteCommands = [];

// ═══ Command Registry ═══

function getCommands() {
  return [
    // Navigation
    { id: 'panel.chat', label: 'Go to: Chat', icon: '💬', action: () => switchPanel('chat') },
    { id: 'panel.brain', label: 'Go to: Brain Explorer', icon: '🧠', action: () => switchPanel('brain') },
    { id: 'panel.divine', label: 'Go to: Divine Cycle', icon: '♾️', action: () => switchPanel('divine') },
    { id: 'panel.fleet', label: 'Go to: Fleet', icon: '🖥️', action: () => switchPanel('fleet') },
    { id: 'panel.kb', label: 'Go to: Knowledge Base', icon: '📚', action: () => switchPanel('kb') },
    { id: 'panel.monitor', label: 'Go to: System Monitor', icon: '⚡', action: () => switchPanel('monitor') },
    { id: 'panel.orchestration', label: 'Go to: Orchestration', icon: '🕸️', action: () => switchPanel('orchestration') },
    { id: 'panel.integrations', label: 'Go to: Integrations', icon: '🔗', action: () => switchPanel('integrations') },
    { id: 'panel.vault', label: 'Go to: Vault', icon: '🔐', action: () => switchPanel('vault') },
    { id: 'panel.editor', label: 'Go to: Code Editor', icon: '✎', action: () => switchPanel('editor') },
    { id: 'panel.terminal', label: 'Go to: Terminal', icon: '▪', action: () => switchPanel('terminal') },

    // Editor actions
    { id: 'editor.open', label: 'Editor: Open File', icon: '📂', action: () => { switchPanel('editor'); editorOpenFile(); } },
    { id: 'editor.save', label: 'Editor: Save File', icon: '💾', action: () => editorSave() },
    { id: 'editor.completions.on', label: 'Editor: Enable AI Completions', icon: '🤖', action: () => toggleCompletions(true) },
    { id: 'editor.completions.off', label: 'Editor: Disable AI Completions', icon: '🚫', action: () => toggleCompletions(false) },

    // Terminal actions
    { id: 'terminal.new', label: 'Terminal: New Terminal', icon: '▪', action: () => { switchPanel('terminal'); terminalNew(); } },

    // Brain actions
    { id: 'brain.search', label: 'Brain: Search Keys', icon: '🔍', action: () => switchPanel('brain') },
    { id: 'brain.refresh', label: 'Brain: Refresh Context', icon: '🔄', action: () => { switchPanel('brain'); loadBrainPanel(); } },

    // Fleet actions
    { id: 'fleet.dispatch', label: 'Fleet: Dispatch Task', icon: '📨', action: () => switchPanel('orchestration') },
    { id: 'fleet.refresh', label: 'Fleet: Refresh Status', icon: '🔄', action: () => { switchPanel('fleet'); loadFleetPanel(); } },

    // System
    { id: 'system.settings', label: 'Settings', icon: '⚙️', action: () => openSettings() },
    { id: 'system.reload', label: 'Reload App', icon: '🔄', action: () => location.reload() },
    { id: 'system.devtools', label: 'Toggle DevTools', icon: '🛠️', action: () => { /* handled by Electron */ } },
  ];
}

// ═══ Palette UI ═══

function createPaletteOverlay() {
  if (document.getElementById('commandPalette')) return;

  const overlay = document.createElement('div');
  overlay.id = 'commandPalette';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; right:0; bottom:0;
    background:rgba(0,0,0,0.6); z-index:10000;
    display:none; justify-content:center; padding-top:15vh;
    backdrop-filter:blur(4px);
  `;

  overlay.innerHTML = `
    <div style="width:520px; max-height:400px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5);">
      <div style="padding:12px 16px; border-bottom:1px solid var(--border);">
        <input type="text" id="paletteInput"
               placeholder="Type a command..."
               style="width:100%; background:transparent; border:none; outline:none; color:var(--text-primary); font-family:'JetBrains Mono',monospace; font-size:14px;"
               oninput="filterPalette(this.value)"
               onkeydown="handlePaletteKey(event)">
      </div>
      <div id="paletteResults" style="max-height:320px; overflow-y:auto;"></div>
    </div>
  `;

  overlay.onclick = (e) => {
    if (e.target === overlay) closePalette();
  };

  document.body.appendChild(overlay);
}

function openPalette() {
  createPaletteOverlay();
  paletteCommands = getCommands();
  paletteVisible = true;

  const overlay = document.getElementById('commandPalette');
  overlay.style.display = 'flex';

  const input = document.getElementById('paletteInput');
  input.value = '';
  input.focus();

  renderPaletteResults(paletteCommands);
}

function closePalette() {
  paletteVisible = false;
  const overlay = document.getElementById('commandPalette');
  if (overlay) overlay.style.display = 'none';
}

function filterPalette(query) {
  if (!query.trim()) {
    renderPaletteResults(paletteCommands);
    return;
  }

  const q = query.toLowerCase();
  const filtered = paletteCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(q) || cmd.id.includes(q)
  );
  renderPaletteResults(filtered);
}

let selectedPaletteIdx = 0;

function renderPaletteResults(commands) {
  const container = document.getElementById('paletteResults');
  if (!container) return;
  selectedPaletteIdx = 0;

  container.innerHTML = commands.map((cmd, i) => `
    <div class="palette-item${i === 0 ? ' selected' : ''}"
         data-idx="${i}"
         onclick="executePaletteCommand(${i})"
         onmouseenter="selectPaletteItem(${i})">
      <span style="width:20px;text-align:center;">${cmd.icon}</span>
      <span style="flex:1;margin-left:8px;">${cmd.label}</span>
      <span style="font-size:10px;opacity:0.4;">${cmd.id}</span>
    </div>
  `).join('');
}

function selectPaletteItem(idx) {
  selectedPaletteIdx = idx;
  document.querySelectorAll('.palette-item').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
}

function handlePaletteKey(event) {
  const items = document.querySelectorAll('.palette-item');
  if (event.key === 'Escape') { closePalette(); return; }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectedPaletteIdx = Math.min(selectedPaletteIdx + 1, items.length - 1);
    selectPaletteItem(selectedPaletteIdx);
    items[selectedPaletteIdx]?.scrollIntoView({ block: 'nearest' });
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedPaletteIdx = Math.max(selectedPaletteIdx - 1, 0);
    selectPaletteItem(selectedPaletteIdx);
    items[selectedPaletteIdx]?.scrollIntoView({ block: 'nearest' });
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    executePaletteCommand(selectedPaletteIdx);
  }
}

function executePaletteCommand(idx) {
  const filtered = document.querySelectorAll('.palette-item');
  const commands = getCommands();
  const q = document.getElementById('paletteInput')?.value?.toLowerCase() || '';

  const visible = q ? commands.filter(c => c.label.toLowerCase().includes(q) || c.id.includes(q)) : commands;
  if (visible[idx]) {
    closePalette();
    visible[idx].action();
  }
}

// ═══ CSS for Palette ═══

const paletteStyle = document.createElement('style');
paletteStyle.textContent = `
  .palette-item {
    padding: 8px 16px; cursor: pointer; display: flex; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-size: 13px;
    color: var(--text-secondary); transition: background 0.1s;
  }
  .palette-item:hover, .palette-item.selected {
    background: rgba(108, 92, 231, 0.15); color: var(--text-primary);
  }
`;
document.head.appendChild(paletteStyle);

// ═══ Global Keyboard Shortcut ═══

document.addEventListener('keydown', (e) => {
  // Cmd+Shift+P — Command Palette
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
    e.preventDefault();
    if (paletteVisible) closePalette();
    else openPalette();
  }

  // Cmd+\ — Toggle sidebar (future)
  // Cmd+` — Focus terminal
  if ((e.metaKey || e.ctrlKey) && e.key === '`') {
    e.preventDefault();
    switchPanel('terminal');
    if (!activeTermId) terminalNew();
  }

  // Cmd+1-9 — Quick panel switch
  if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
    const panels = ['chat', 'brain', 'divine', 'fleet', 'kb', 'monitor', 'orchestration', 'integrations', 'vault', 'editor', 'terminal'];
    const idx = parseInt(e.key) - 1;
    if (panels[idx]) {
      e.preventDefault();
      switchPanel(panels[idx]);
    }
  }

  // Escape — close palette if open
  if (e.key === 'Escape' && paletteVisible) {
    closePalette();
  }
});
