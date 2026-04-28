/**
 * local-brain.js — Sovereign SQLite brain backend
 * Replaces Supabase entirely. Zero cloud dependency. Zero cost.
 * Reads/writes to ~/.fractal_brain/local_brain.db
 */
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const DB_PATH = path.join(os.homedir(), '.fractal_brain', 'local_brain.db');

class LocalBrain {
  constructor() {
    this.db = null;
  }

  open() {
    if (this.db) return;
    this.db = new Database(DB_PATH, { readonly: false });
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('busy_timeout = 5000');
    this._ensureTables();
  }

  _ensureTables() {
    // Ensure all tables exist (safe to run multiple times)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS brain_context (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        description TEXT,
        value TEXT,
        priority INTEGER DEFAULT 5,
        created_at TEXT,
        updated_at TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_bc_key ON brain_context(key);
      CREATE INDEX IF NOT EXISTS idx_bc_category ON brain_context(category);
      CREATE INDEX IF NOT EXISTS idx_bc_priority ON brain_context(priority);

      CREATE TABLE IF NOT EXISTS brain_episodes (
        id TEXT PRIMARY KEY,
        event_type TEXT,
        summary TEXT,
        details TEXT,
        related_keys TEXT,
        session_number TEXT,
        occurred_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_chunks (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        chunk_index TEXT,
        chunk_text TEXT,
        embedding TEXT,
        token_count TEXT,
        created_at TEXT,
        search_vector TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_versions (
        id TEXT PRIMARY KEY,
        entry_key TEXT,
        version_number TEXT,
        old_value TEXT,
        old_description TEXT,
        changed_at TEXT,
        change_type TEXT
      );

      CREATE TABLE IF NOT EXISTS task_dispatch (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        assigned_to TEXT,
        created_by TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT '5',
        category TEXT,
        payload TEXT,
        result TEXT,
        error TEXT,
        requires TEXT,
        estimated_seconds TEXT,
        started_at TEXT,
        completed_at TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS machine_heartbeats (
        machine_id TEXT PRIMARY KEY,
        hostname TEXT,
        ip_address TEXT,
        chip TEXT,
        memory_gb TEXT,
        role TEXT,
        status TEXT,
        current_task TEXT,
        last_heartbeat TEXT,
        session_id TEXT,
        capabilities TEXT,
        load TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_vault (
        service TEXT PRIMARY KEY,
        description TEXT,
        hint TEXT,
        tier TEXT,
        secret_encrypted TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_actions (
        id TEXT PRIMARY KEY,
        action_type TEXT,
        target TEXT,
        status TEXT DEFAULT 'pending',
        priority INTEGER DEFAULT 5,
        payload TEXT,
        result TEXT,
        error TEXT,
        plan_id TEXT,
        claimed_by TEXT,
        claimed_at TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        description TEXT,
        trigger TEXT,
        template TEXT,
        active INTEGER DEFAULT 1,
        use_count INTEGER DEFAULT 0,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_plans (
        id TEXT PRIMARY KEY,
        name TEXT,
        status TEXT DEFAULT 'active',
        tasks TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_graph (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_key TEXT,
        to_key TEXT,
        relationship TEXT,
        weight REAL DEFAULT 1.0
      );

      CREATE TABLE IF NOT EXISTS brain_archive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT,
        category TEXT,
        archive_reason TEXT,
        archived_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_knowledge (
        id TEXT PRIMARY KEY,
        topic TEXT,
        content TEXT,
        source TEXT,
        embedding TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS brain_health (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        check_type TEXT,
        status TEXT,
        details TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        status TEXT DEFAULT 'active',
        goal TEXT,
        source TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT,
        name TEXT,
        subscription_tier TEXT,
        stripe_customer_id TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS agent_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        machine_id TEXT,
        role TEXT,
        content TEXT,
        tool_calls TEXT,
        tool_name TEXT,
        model TEXT,
        tokens_eval INTEGER DEFAULT 0,
        tokens_prompt INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS agent_tool_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        agent TEXT,
        tool TEXT,
        input TEXT,
        output TEXT,
        duration_ms INTEGER,
        success INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }

  close() {
    if (this.db) { this.db.close(); this.db = null; }
  }

  // ═══ BRAIN CONTEXT ═══

  getAllContext() {
    const rows = this.db.prepare('SELECT key, value, category, description, priority, updated_at FROM brain_context ORDER BY priority DESC').all();
    return rows.map(r => ({
      key: r.key,
      value: this._parseValue(r.value),
      category: r.category,
      description: r.description,
      priority: r.priority,
      updated_at: r.updated_at,
    }));
  }

  getContextByKeys(keys) {
    if (!keys || !keys.length) return {};
    const placeholders = keys.map(() => '?').join(',');
    const rows = this.db.prepare(`SELECT key, value FROM brain_context WHERE key IN (${placeholders})`).all(...keys);
    const result = {};
    for (const r of rows) {
      result[r.key] = this._parseValue(r.value);
    }
    return result;
  }

  getContextByKey(key) {
    const row = this.db.prepare('SELECT value FROM brain_context WHERE key = ?').get(key);
    return row ? this._parseValue(row.value) : null;
  }

  upsertContext(key, value, description, category, priority) {
    const now = new Date().toISOString();
    const existing = this.db.prepare('SELECT id, value, description FROM brain_context WHERE key = ?').get(key);
    const valStr = typeof value === 'string' ? value : JSON.stringify(value);

    if (existing) {
      // Save version history
      const versionCount = this.db.prepare('SELECT COUNT(*) as c FROM brain_versions WHERE entry_key = ?').get(key)?.c || 0;
      this.db.prepare(`INSERT INTO brain_versions (id, entry_key, version_number, old_value, old_description, changed_at, change_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
        crypto.randomUUID(), key, String(versionCount + 1), existing.value, existing.description, now, 'update'
      );

      // Update
      const stmt = this.db.prepare(`UPDATE brain_context SET value = ?, updated_at = ?
        ${description !== undefined ? ', description = ?' : ''}
        ${category !== undefined ? ', category = ?' : ''}
        ${priority !== undefined ? ', priority = ?' : ''}
        WHERE key = ?`);
      const params = [valStr, now];
      if (description !== undefined) params.push(description);
      if (category !== undefined) params.push(category);
      if (priority !== undefined) params.push(priority);
      params.push(key);
      stmt.run(...params);
    } else {
      this.db.prepare(`INSERT INTO brain_context (id, key, value, description, category, priority, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
        crypto.randomUUID(), key, valStr, description || '', category || key.split('.')[0], priority || 5, now, now
      );
    }

    // Log episode
    this._logEpisode('brain_write', `Updated ${key}`, valStr.slice(0, 200), key);

    return { success: true };
  }

  searchContext(query, limit = 20) {
    const q = `%${query}%`;
    return this.db.prepare(`SELECT key, value, category, description, priority, updated_at FROM brain_context
      WHERE key LIKE ? OR description LIKE ? OR value LIKE ?
      ORDER BY priority DESC LIMIT ?`).all(q, q, q, limit).map(r => ({
      ...r, value: this._parseValue(r.value),
    }));
  }

  contextCount() {
    return this.db.prepare('SELECT COUNT(*) as c FROM brain_context').get().c;
  }

  contextCategories() {
    return this.db.prepare('SELECT category, COUNT(*) as count FROM brain_context GROUP BY category ORDER BY count DESC').all();
  }

  // ═══ KNOWLEDGE BASE (cross-table search) ═══

  kbSearch(query, limit = 20) {
    const results = [];
    const q = `%${query}%`;

    // brain_context
    const ctx = this.db.prepare(`SELECT key, value, category, description, priority, updated_at FROM brain_context
      WHERE key LIKE ? OR description LIKE ? OR value LIKE ?
      ORDER BY priority DESC LIMIT ?`).all(q, q, q, limit);
    for (const r of ctx) {
      results.push({
        source: 'brain_context', key: r.key, topic: r.key,
        content: r.description || (r.value || '').slice(0, 300),
        category: r.category, priority: r.priority, updated_at: r.updated_at,
      });
    }

    // brain_episodes
    const eps = this.db.prepare(`SELECT id, event_type, summary, details, occurred_at FROM brain_episodes
      WHERE summary LIKE ? OR event_type LIKE ? OR details LIKE ?
      ORDER BY occurred_at DESC LIMIT ?`).all(q, q, q, Math.min(limit, 10));
    for (const r of eps) {
      results.push({
        source: 'episodes', key: `episode.${r.id}`, topic: r.event_type,
        content: r.summary || (r.details || '').slice(0, 200),
        category: 'episode', updated_at: r.occurred_at,
      });
    }

    // brain_chunks
    const chunks = this.db.prepare(`SELECT id, parent_id, chunk_text FROM brain_chunks
      WHERE chunk_text LIKE ? LIMIT ?`).all(q, Math.min(limit, 10));
    for (const r of chunks) {
      results.push({
        source: 'chunks', key: r.parent_id || `chunk.${r.id}`, topic: r.parent_id || 'RAG chunk',
        content: (r.chunk_text || '').slice(0, 300), category: 'chunk',
      });
    }

    return results.slice(0, limit);
  }

  kbStats() {
    const ctxCount = this.db.prepare('SELECT COUNT(*) as c FROM brain_context').get().c;
    const epCount = this.db.prepare('SELECT COUNT(*) as c FROM brain_episodes').get().c;
    const chunkCount = this.db.prepare('SELECT COUNT(*) as c FROM brain_chunks').get().c;
    const versionCount = this.db.prepare('SELECT COUNT(*) as c FROM brain_versions').get().c;
    const taskCount = this.db.prepare('SELECT COUNT(*) as c FROM task_dispatch').get().c;

    const categories = [
      { name: 'Context', count: ctxCount, icon: '🧠' },
      { name: 'Episodes', count: epCount, icon: '📜' },
      { name: 'RAG Chunks', count: chunkCount, icon: '🔍' },
      { name: 'Versions', count: versionCount, icon: '📋' },
      { name: 'Tasks', count: taskCount, icon: '⚡' },
    ];
    return { totalEntries: ctxCount + epCount + chunkCount + versionCount + taskCount, categories, recentlyAdded: 0 };
  }

  // ═══ TASK DISPATCH ═══

  getActiveTasks(limit = 20) {
    return this.db.prepare(`SELECT * FROM task_dispatch
      WHERE status IN ('pending', 'assigned', 'claimed', 'in_progress')
      ORDER BY created_at DESC LIMIT ?`).all(limit);
  }

  getTaskStats() {
    const completed = this.db.prepare("SELECT COUNT(*) as c FROM task_dispatch WHERE status = 'completed'").get().c;
    const failed = this.db.prepare("SELECT COUNT(*) as c FROM task_dispatch WHERE status = 'failed'").get().c;
    const lastTask = this.db.prepare('SELECT created_at FROM task_dispatch ORDER BY created_at DESC LIMIT 1').get();
    return { completed, failed, lastDispatch: lastTask?.created_at || null };
  }

  dispatchTask(title, target, category, createdBy = 'm3_forge') {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    this.db.prepare(`INSERT INTO task_dispatch (id, title, description, assigned_to, created_by, status, priority, category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, title, 'Dispatched from Faye Console', target, createdBy,
      target ? 'assigned' : 'pending', '5', category, now, now
    );
    return { success: true, taskId: id, target, category };
  }

  // ═══ MACHINE HEARTBEATS ═══

  getHeartbeats() {
    return this.db.prepare('SELECT * FROM machine_heartbeats ORDER BY last_heartbeat DESC').all();
  }

  // ═══ VAULT ═══

  vaultList() {
    try {
      return this.db.prepare('SELECT service, description, hint, tier, updated_at FROM brain_vault ORDER BY service').all()
        .map(d => ({ service: d.service, name: d.service, description: d.description || d.tier || '', masked: d.hint || '••••••••' }));
    } catch { return []; }
  }

  vaultGet(service) {
    try {
      const row = this.db.prepare('SELECT secret_encrypted, hint FROM brain_vault WHERE service = ?').get(service);
      return row?.secret_encrypted || row?.hint || null;
    } catch { return null; }
  }

  // ═══ EPISODES ═══

  _logEpisode(eventType, summary, details, relatedKey) {
    try {
      this.db.prepare(`INSERT INTO brain_episodes (id, event_type, summary, details, related_keys, occurred_at)
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        crypto.randomUUID(), eventType, summary, details || '', relatedKey || '', new Date().toISOString()
      );
    } catch {}
  }

  // ═══ HELPERS ═══

  _parseValue(val) {
    if (!val) return val;
    try { return JSON.parse(val); } catch { return val; }
  }
}

module.exports = { LocalBrain };
