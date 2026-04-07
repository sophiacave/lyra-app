/**
 * plugin-loader.js — Markdown Plugin System for Faye Brain IDE
 * Reads .md files with YAML frontmatter from plugins/ directory.
 * Hot-loadable: call loadPlugins() to refresh without restart.
 * Pattern adopted from Claude Code OSS.
 * Built with love. McQueen x Rothko.
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, 'plugins');

class PluginLoader {
  constructor() {
    this.commands = new Map();
    this.agents = new Map();
    this.skills = new Map();
  }

  /**
   * Load all plugins from the plugins/ directory.
   * Call this on boot and whenever plugins change.
   */
  loadAll() {
    this.commands.clear();
    this.agents.clear();
    this.skills.clear();

    this._loadDir('commands', this.commands);
    this._loadDir('agents', this.agents);
    this._loadDir('skills', this.skills);

    console.log(`[Plugins] Loaded: ${this.commands.size} commands, ${this.agents.size} agents, ${this.skills.size} skills`);
    return {
      commands: this.commands.size,
      agents: this.agents.size,
      skills: this.skills.size,
    };
  }

  _loadDir(subdir, targetMap) {
    const dir = path.join(PLUGINS_DIR, subdir);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const parsed = this._parseFrontmatter(content);
        if (parsed.meta.name) {
          targetMap.set(parsed.meta.name, {
            ...parsed.meta,
            body: parsed.body,
            file: path.join(dir, file),
          });
        }
      } catch (e) {
        console.error(`[Plugins] Failed to load ${subdir}/${file}:`, e.message);
      }
    }
  }

  /**
   * Parse YAML frontmatter from markdown file.
   * Returns { meta: {}, body: string }
   */
  _parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: content };

    const yamlStr = match[1];
    const body = match[2].trim();

    // Simple YAML parser (no dependency needed for flat key-value)
    const meta = {};
    yamlStr.split('\n').forEach(line => {
      const m = line.match(/^(\w[\w_-]*)\s*:\s*(.+)$/);
      if (m) {
        let val = m[2].trim();
        // Handle booleans
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        meta[m[1]] = val;
      }
    });

    return { meta, body };
  }

  /**
   * Get a command by trigger (e.g., '/status')
   */
  getCommand(trigger) {
    for (const [name, cmd] of this.commands) {
      if (cmd.trigger === trigger) return cmd;
    }
    return null;
  }

  /**
   * Get all commands as an array for display
   */
  listCommands() {
    return Array.from(this.commands.values()).map(c => ({
      name: c.name,
      description: c.description,
      trigger: c.trigger,
      icon: c.icon || '📋',
    }));
  }

  /**
   * Get an agent definition by name
   */
  getAgent(name) {
    return this.agents.get(name) || null;
  }

  /**
   * Get a skill by name
   */
  getSkill(name) {
    return this.skills.get(name) || null;
  }
}

module.exports = { PluginLoader };
