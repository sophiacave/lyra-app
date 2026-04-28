/**
 * sqlite-supabase-shim.js — Makes SQLite look like Supabase
 * Drop-in replacement: code that calls .from('brain_context').select()
 * now hits local SQLite instead of cloud Supabase. Zero rewrites needed.
 *
 * Supports: .from().select().eq().in().like().ilike().or().order().limit().single()
 * Also: .upsert(), .insert(), .update(), .delete()
 * Also: .rpc() for brain_safe_upsert / brain_hybrid_search
 */

class SqliteSupabaseShim {
  constructor(db) {
    this.db = db;
  }

  from(table) {
    return new QueryBuilder(this.db, table);
  }

  rpc(funcName, params) {
    // Shim common RPCs
    if (funcName === 'brain_safe_upsert' || funcName === 'brain_upsert') {
      return this._rpcUpsert(params);
    }
    if (funcName === 'brain_hybrid_search') {
      return this._rpcSearch(params);
    }
    if (funcName === 'memory_search') {
      return this._rpcSearch(params);
    }
    return { data: null, error: new Error(`Unknown RPC: ${funcName}`) };
  }

  _rpcUpsert(params) {
    try {
      const key = params.p_key || params.key;
      const value = params.p_value || params.value;
      const desc = params.p_description || params.description || '';
      const cat = params.p_category || params.category || key.split('.')[0];
      const priority = params.p_priority || params.priority || 5;
      const now = new Date().toISOString();

      const existing = this.db.prepare('SELECT id FROM brain_context WHERE key = ?').get(key);
      if (existing) {
        this.db.prepare('UPDATE brain_context SET value = ?, description = ?, category = ?, priority = ?, updated_at = ? WHERE key = ?')
          .run(typeof value === 'string' ? value : JSON.stringify(value), desc, cat, priority, now, key);
      } else {
        const crypto = require('crypto');
        this.db.prepare('INSERT INTO brain_context (id, key, value, description, category, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
          .run(crypto.randomUUID(), key, typeof value === 'string' ? value : JSON.stringify(value), desc, cat, priority, now, now);
      }
      return { data: { key }, error: null };
    } catch (e) {
      return { data: null, error: e };
    }
  }

  _rpcSearch(params) {
    try {
      const q = `%${params.search_query || params.query || ''}%`;
      const limit = params.match_count || params.limit || 20;
      const rows = this.db.prepare(`SELECT key, value, description, category, priority, updated_at FROM brain_context
        WHERE key LIKE ? OR description LIKE ? OR value LIKE ?
        ORDER BY priority DESC LIMIT ?`).all(q, q, q, limit);
      return { data: rows, error: null };
    } catch (e) {
      return { data: null, error: e };
    }
  }
}

class QueryBuilder {
  constructor(db, table) {
    this.db = db;
    this.table = table;
    this._select = '*';
    this._where = [];
    this._whereParams = [];
    this._order = [];
    this._limit = null;
    this._single = false;
    this._countOnly = false;
    this._headOnly = false;
    this._operation = 'select';
    this._insertData = null;
    this._updateData = null;
    this._upsertData = null;
    this._onConflict = null;
  }

  select(columns, opts) {
    if (opts?.count === 'exact') this._countOnly = true;
    if (opts?.head) this._headOnly = true;
    if (columns && columns !== '*') this._select = columns;
    return this;
  }

  eq(col, val) { this._where.push(`"${col}" = ?`); this._whereParams.push(val); return this; }
  neq(col, val) { this._where.push(`"${col}" != ?`); this._whereParams.push(val); return this; }
  gt(col, val) { this._where.push(`"${col}" > ?`); this._whereParams.push(val); return this; }
  gte(col, val) { this._where.push(`"${col}" >= ?`); this._whereParams.push(val); return this; }
  lt(col, val) { this._where.push(`"${col}" < ?`); this._whereParams.push(val); return this; }
  lte(col, val) { this._where.push(`"${col}" <= ?`); this._whereParams.push(val); return this; }

  like(col, pattern) { this._where.push(`"${col}" LIKE ?`); this._whereParams.push(pattern); return this; }
  ilike(col, pattern) { this._where.push(`"${col}" LIKE ? COLLATE NOCASE`); this._whereParams.push(pattern); return this; }

  in(col, values) {
    if (!values || !values.length) { this._where.push('1=0'); return this; }
    const placeholders = values.map(() => '?').join(',');
    this._where.push(`"${col}" IN (${placeholders})`);
    this._whereParams.push(...values);
    return this;
  }

  or(expr) {
    // Parse Supabase or() syntax: "key.ilike.%foo%,description.ilike.%bar%"
    const parts = expr.split(',').map(p => {
      const m = p.match(/^(\w+)\.(eq|neq|ilike|like|gt|gte|lt|lte)\.(.+)$/);
      if (!m) return null;
      const [, col, op, val] = m;
      const ops = { eq: '=', neq: '!=', ilike: 'LIKE', like: 'LIKE', gt: '>', gte: '>=', lt: '<', lte: '<=' };
      this._whereParams.push(val);
      return `"${col}" ${ops[op] || '='} ?${op === 'ilike' ? ' COLLATE NOCASE' : ''}`;
    }).filter(Boolean);

    if (parts.length) this._where.push(`(${parts.join(' OR ')})`);
    return this;
  }

  order(col, opts) {
    const dir = opts?.ascending === false ? 'DESC' : 'ASC';
    this._order.push(`"${col}" ${dir}`);
    return this;
  }

  limit(n) { this._limit = n; return this; }
  single() { this._single = true; this._limit = 1; return this; }

  // Mutation methods
  insert(data) {
    this._operation = 'insert';
    this._insertData = Array.isArray(data) ? data : [data];
    return this;
  }

  update(data) {
    this._operation = 'update';
    this._updateData = data;
    return this;
  }

  upsert(data, opts) {
    this._operation = 'upsert';
    this._upsertData = Array.isArray(data) ? data : [data];
    this._onConflict = opts?.onConflict || 'id';
    return this;
  }

  delete() {
    this._operation = 'delete';
    return this;
  }

  // Execute — returns {data, error, count}
  then(resolve, reject) {
    try {
      const result = this._execute();
      resolve(result);
    } catch (e) {
      if (reject) reject(e);
      else resolve({ data: null, error: e });
    }
  }

  _execute() {
    try {
      // Check if table exists
      const tableExists = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(this.table);
      if (!tableExists) return { data: this._single ? null : [], error: null, count: 0 };

      switch (this._operation) {
        case 'select': return this._execSelect();
        case 'insert': return this._execInsert();
        case 'update': return this._execUpdate();
        case 'upsert': return this._execUpsert();
        case 'delete': return this._execDelete();
        default: return { data: null, error: new Error(`Unknown operation: ${this._operation}`) };
      }
    } catch (e) {
      return { data: null, error: e, count: 0 };
    }
  }

  _execSelect() {
    const whereClause = this._where.length ? `WHERE ${this._where.join(' AND ')}` : '';
    const orderClause = this._order.length ? `ORDER BY ${this._order.join(', ')}` : '';
    const limitClause = this._limit ? `LIMIT ${this._limit}` : '';

    if (this._countOnly && this._headOnly) {
      const sql = `SELECT COUNT(*) as count FROM "${this.table}" ${whereClause}`;
      const row = this.db.prepare(sql).get(...this._whereParams);
      return { data: null, error: null, count: row?.count || 0 };
    }

    const sql = `SELECT ${this._select} FROM "${this.table}" ${whereClause} ${orderClause} ${limitClause}`;
    const rows = this.db.prepare(sql).all(...this._whereParams);

    // Parse JSON values
    const parsed = rows.map(r => {
      const out = { ...r };
      if (out.value && typeof out.value === 'string') {
        try { out.value = JSON.parse(out.value); } catch {}
      }
      if (out.payload && typeof out.payload === 'string') {
        try { out.payload = JSON.parse(out.payload); } catch {}
      }
      return out;
    });

    if (this._single) {
      return { data: parsed[0] || null, error: parsed[0] ? null : { message: 'Row not found', code: 'PGRST116' } };
    }
    return { data: parsed, error: null };
  }

  _execInsert() {
    const results = [];
    for (const row of this._insertData) {
      const cols = Object.keys(row);
      const vals = cols.map(c => {
        const v = row[c];
        return (v !== null && typeof v === 'object') ? JSON.stringify(v) : v;
      });
      const placeholders = cols.map(() => '?').join(',');
      const sql = `INSERT INTO "${this.table}" (${cols.map(c => `"${c}"`).join(',')}) VALUES (${placeholders})`;
      this.db.prepare(sql).run(...vals);

      // If no id provided, use last insert rowid
      if (!row.id) row.id = String(this.db.prepare('SELECT last_insert_rowid() as id').get().id);
      results.push(row);
    }
    // Chain select support
    this._operation = 'select';
    this._insertData = null;
    if (this._single) return { data: results[0] || null, error: null };
    return { data: results, error: null };
  }

  _execUpdate() {
    const sets = Object.entries(this._updateData)
      .filter(([, v]) => v !== undefined)
      .map(([col]) => `"${col}" = ?`);
    const vals = Object.entries(this._updateData)
      .filter(([, v]) => v !== undefined)
      .map(([, v]) => (v !== null && typeof v === 'object') ? JSON.stringify(v) : v);

    const whereClause = this._where.length ? `WHERE ${this._where.join(' AND ')}` : '';
    const sql = `UPDATE "${this.table}" SET ${sets.join(', ')} ${whereClause}`;
    this.db.prepare(sql).run(...vals, ...this._whereParams);
    return { data: null, error: null };
  }

  _execUpsert() {
    for (const row of this._upsertData) {
      const cols = Object.keys(row);
      const vals = cols.map(c => {
        const v = row[c];
        return (v !== null && typeof v === 'object') ? JSON.stringify(v) : v;
      });
      const placeholders = cols.map(() => '?').join(',');
      const updateSets = cols.filter(c => c !== this._onConflict).map(c => `"${c}" = excluded."${c}"`).join(', ');
      const sql = `INSERT INTO "${this.table}" (${cols.map(c => `"${c}"`).join(',')}) VALUES (${placeholders})
        ON CONFLICT("${this._onConflict}") DO UPDATE SET ${updateSets}`;
      this.db.prepare(sql).run(...vals);
    }
    return { data: this._upsertData, error: null };
  }

  _execDelete() {
    const whereClause = this._where.length ? `WHERE ${this._where.join(' AND ')}` : '';
    const sql = `DELETE FROM "${this.table}" ${whereClause}`;
    this.db.prepare(sql).run(...this._whereParams);
    return { data: null, error: null };
  }
}

module.exports = { SqliteSupabaseShim };
