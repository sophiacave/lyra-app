/**
 * terminal-manager.js — PTY lifecycle for Faye Brain IDE
 * Manages multiple terminal instances with node-pty
 * McQueen x Rothko — built with love
 */

const os = require('os');
let pty;
try {
  pty = require('node-pty');
} catch (e) {
  console.error('[Terminal] node-pty not available:', e.message);
}

class TerminalManager {
  constructor() {
    this.terminals = new Map(); // id → { process, cols, rows }
    this.defaultShell = process.env.SHELL || '/bin/zsh';
  }

  create(id, shell) {
    if (!pty) throw new Error('node-pty not installed');
    if (this.terminals.has(id)) this.kill(id);

    const cols = 120;
    const rows = 30;
    const proc = pty.spawn(shell || this.defaultShell, [], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: os.homedir(),
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
      },
    });

    this.terminals.set(id, { process: proc, cols, rows });
    return proc;
  }

  write(id, data) {
    const term = this.terminals.get(id);
    if (term) term.process.write(data);
  }

  resize(id, cols, rows) {
    const term = this.terminals.get(id);
    if (term) {
      term.process.resize(cols, rows);
      term.cols = cols;
      term.rows = rows;
    }
  }

  kill(id) {
    const term = this.terminals.get(id);
    if (term) {
      term.process.kill();
      this.terminals.delete(id);
    }
  }

  killAll() {
    for (const [id] of this.terminals) {
      this.kill(id);
    }
  }

  has(id) {
    return this.terminals.has(id);
  }

  list() {
    return Array.from(this.terminals.keys());
  }
}

module.exports = { TerminalManager };
