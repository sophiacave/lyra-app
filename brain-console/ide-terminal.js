/**
 * ide-terminal.js — xterm.js Terminal for Faye Brain IDE
 * Built with love. McQueen x Rothko.
 */

let termInstances = []; // { id, xterm, fitAddon, active }
let activeTermId = null;
let termCounter = 0;
let xtermReady = false;
let XTerm, FitAddon, WebLinksAddon;

// ═══ xterm.js Loader ═══

function initXterm() {
  if (xtermReady) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'node_modules/@xterm/xterm/lib/xterm.js';
    script.onload = () => {
      // xterm UMD exports to globalThis — but contextIsolation may block it
      // Try multiple paths to find the Terminal constructor
      XTerm = window.Terminal || globalThis.Terminal;

      // If UMD didn't work, check if it set on exports-like object
      if (!XTerm) {
        // The UMD sets properties on globalThis — Terminal might be there directly
        try {
          const keys = Object.getOwnPropertyNames(globalThis).filter(k =>
            k === 'Terminal' || (typeof globalThis[k] === 'function' && globalThis[k].toString().includes('_core'))
          );
          if (keys.length) XTerm = globalThis[keys[0]];
        } catch {}
      }

      if (!XTerm) {
        // Last resort: re-evaluate the script as module pattern
        try {
          const mod = {};
          const fn = new Function('exports', 'module',
            document.querySelector('script[src*="xterm.js"]')?.textContent || '');
          fn(mod, { exports: mod });
          XTerm = mod.Terminal;
        } catch {}
      }

      if (!XTerm) {
        // Graceful fallback — terminal panel works but without xterm rendering
        console.warn('[Terminal] xterm.js Terminal constructor not available — terminal will use fallback');
        xtermReady = false;
        resolve(); // Don't reject — let panel load without xterm
        return;
      }

      xtermReady = true;
      console.log('[Terminal] xterm.js initialized');
      resolve();
    };
    script.onerror = () => {
      console.warn('[Terminal] Failed to load xterm.js');
      resolve(); // Don't reject
    };
    document.head.appendChild(script);
  });
}

// ═══ Terminal Management ═══

async function terminalNew() {
  if (!xtermReady) {
    try { await initXterm(); } catch (e) {
      console.error('[Terminal] Init failed:', e);
      return;
    }
  }

  const id = `term-${++termCounter}`;
  const container = document.getElementById('terminal-container');
  if (!container) return;

  // Create xterm instance
  const xterm = new XTerm({
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    lineHeight: 1.4,
    cursorBlink: true,
    cursorStyle: 'bar',
    theme: {
      background: '#0a0a0f',
      foreground: '#e8e6e3',
      cursor: '#a29bfe',
      cursorAccent: '#0a0a0f',
      selectionBackground: '#6c5ce740',
      black: '#2d3436',
      red: '#e17055',
      green: '#00b894',
      yellow: '#fdcb6e',
      blue: '#74b9ff',
      magenta: '#a29bfe',
      cyan: '#00cec9',
      white: '#dfe6e9',
      brightBlack: '#636e72',
      brightRed: '#ff7675',
      brightGreen: '#55efc4',
      brightYellow: '#ffeaa7',
      brightBlue: '#a29bfe',
      brightMagenta: '#6c5ce7',
      brightCyan: '#81ecec',
      brightWhite: '#ffffff',
    },
    allowProposedApi: true,
  });

  // Create wrapper div for this terminal
  const wrapper = document.createElement('div');
  wrapper.id = `term-wrapper-${id}`;
  wrapper.style.cssText = 'width:100%; height:100%; display:none;';
  container.appendChild(wrapper);

  xterm.open(wrapper);

  // Try to load fit addon
  try {
    const fitScript = document.createElement('script');
    fitScript.src = 'node_modules/@xterm/addon-fit/lib/addon-fit.js';
    document.head.appendChild(fitScript);
    // Give it a moment
    await new Promise(r => setTimeout(r, 100));
    if (window.FitAddon) {
      const fitAddon = new window.FitAddon.FitAddon();
      xterm.loadAddon(fitAddon);
      setTimeout(() => { try { fitAddon.fit(); } catch {} }, 200);
    }
  } catch {}

  // Create PTY on main process
  const result = await window.brain.termCreate(id);
  if (!result.success) {
    console.error('[Terminal] PTY creation failed:', result.error);
    xterm.write(`\r\n\x1b[31mFailed to create terminal: ${result.error}\x1b[0m\r\n`);
  }

  // Wire xterm input → PTY
  xterm.onData((data) => {
    window.brain.termWrite(id, data);
  });

  const instance = { id, xterm, wrapper };
  termInstances.push(instance);
  activateTerminal(id);

  renderTerminalTabs();
}

function activateTerminal(id) {
  activeTermId = id;
  termInstances.forEach(t => {
    t.wrapper.style.display = t.id === id ? 'block' : 'none';
  });
  renderTerminalTabs();

  // Focus the active terminal
  const active = termInstances.find(t => t.id === id);
  if (active) {
    setTimeout(() => active.xterm.focus(), 100);
  }
}

function closeTerminal(id) {
  const idx = termInstances.findIndex(t => t.id === id);
  if (idx === -1) return;

  const inst = termInstances[idx];
  inst.xterm.dispose();
  inst.wrapper.remove();
  window.brain.termKill(id);
  termInstances.splice(idx, 1);

  if (activeTermId === id) {
    if (termInstances.length > 0) {
      activateTerminal(termInstances[Math.max(0, idx - 1)].id);
    } else {
      activeTermId = null;
    }
  }
  renderTerminalTabs();
}

function renderTerminalTabs() {
  const container = document.getElementById('terminal-tabs');
  if (!container) return;

  container.innerHTML = termInstances.map(t => {
    const active = t.id === activeTermId ? ' active' : '';
    const label = `zsh ${termInstances.indexOf(t) + 1}`;
    return `<div class="term-tab${active}" onclick="activateTerminal('${t.id}')">
      ${label}
      <span class="tab-close" onclick="event.stopPropagation(); closeTerminal('${t.id}')">x</span>
    </div>`;
  }).join('');
}

// ═══ IPC Data Listener ═══

// PTY output → xterm
window.brain.onTermData((id, data) => {
  const inst = termInstances.find(t => t.id === id);
  if (inst) inst.xterm.write(data);
});

// PTY exit
window.brain.onTermExit((id, code) => {
  const inst = termInstances.find(t => t.id === id);
  if (inst) {
    inst.xterm.write(`\r\n\x1b[90m[Process exited with code ${code}]\x1b[0m\r\n`);
  }
});

// ═══ Panel Loader ═══

let terminalInitialized = false;

async function loadTerminalPanel() {
  if (!terminalInitialized) {
    terminalInitialized = true;
    await initXterm();
    // Auto-create first terminal
    await terminalNew();
  }

  // Fit active terminal to container
  const active = termInstances.find(t => t.id === activeTermId);
  if (active) {
    setTimeout(() => {
      try {
        active.xterm.focus();
      } catch {}
    }, 100);
  }
}
