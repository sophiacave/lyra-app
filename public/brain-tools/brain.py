#!/usr/bin/env python3
"""brain.py — Unified Fractal Brain CLI.

Combines local logging, Supabase sync, brain patch (DELETE+INSERT),
todo management, and direct SQL helpers into one tool.

Usage:
    brain status                         # show brain + local stats
    brain query "SELECT * FROM ..."      # run SQL via Supabase REST
    brain memory list [--agent nova]     # list agent memories
    brain memory set <agent> <key> <val> # write/upsert a memory
    brain memory search <pattern>        # search memories by key/value
    brain context list                   # list brain context entries
    brain context set <key> <val>        # upsert brain context
    brain context get <key>              # read a context key
    brain knowledge search <pattern>     # search shared knowledge
    brain todo add "my task"             # add a todo item
    brain todo list                      # show todos
    brain todo done <id>                 # mark todo complete
    brain todo clear                     # remove completed todos
    brain log <agent> <action> [msg]     # log an event locally
    brain sync [--limit 200]             # sync local logs → Supabase
    brain patch <table> <match> <data>   # DELETE+INSERT upsert
    brain agents                         # list registered agents
    brain tables                         # list all brain tables

Zero external dependencies — uses only stdlib (urllib, sqlite3, json).
Credentials from ~/.fractal_brain/.env (SUPABASE_URL + SUPABASE_KEY).
"""

import argparse
import json
import os
import sqlite3
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timezone
from pathlib import Path
# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

BRAIN_DIR = Path(os.environ.get("FRACTAL_BRAIN_DIR", "~/.fractal_brain")).expanduser()
DB_PATH = BRAIN_DIR / "agent_logs.db"
JSONL_PATH = BRAIN_DIR / "agent_logs.jsonl"
ENV_PATH = BRAIN_DIR / ".env"

# ═══════════════════════════════════════════════════════════════════
# ENV LOADER
# ═══════════════════════════════════════════════════════════════════

def _load_env():
    """Load .env file — no external deps."""
    path = str(ENV_PATH)
    if not os.path.isfile(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip("\"'")
            if k and k not in os.environ:
                os.environ[k] = v

def _creds():
    """Return (url, key) for Supabase."""
    _load_env()
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not key:
        print("ERROR: Set SUPABASE_URL and SUPABASE_KEY in ~/.fractal_brain/.env", file=sys.stderr)
        sys.exit(1)
    return url, key
def _headers(key):
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

# ═══════════════════════════════════════════════════════════════════
# SUPABASE REST HELPERS
# ═══════════════════════════════════════════════════════════════════

def _rest_get(table, params="", limit=50):
    url, key = _creds()
    endpoint = f"{url}/rest/v1/{table}?{params}&limit={limit}"
    req = urllib.request.Request(endpoint, headers=_headers(key))
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())

def _rest_post(table, data, prefer="return=minimal,resolution=ignore-duplicates"):
    url, key = _creds()
    endpoint = f"{url}/rest/v1/{table}"
    h = _headers(key)
    h["Prefer"] = prefer
    body = json.dumps(data if isinstance(data, list) else [data]).encode()
    req = urllib.request.Request(endpoint, data=body, headers=h, method="POST")
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.status

def _rest_delete(table, match_conditions):
    url, key = _creds()
    qs = "&".join(f"{urllib.parse.quote(k)}=eq.{urllib.parse.quote(str(v))}"
                  for k, v in match_conditions.items())
    endpoint = f"{url}/rest/v1/{table}?{qs}"
    req = urllib.request.Request(endpoint, method="DELETE", headers=_headers(key))
    try:
        urllib.request.urlopen(req, timeout=15)
    except urllib.error.HTTPError as e:
        if e.code != 404:
            raise
# ═══════════════════════════════════════════════════════════════════
# LOCAL DB (SQLite) — logs + todos
# ═══════════════════════════════════════════════════════════════════

LOCAL_SCHEMA = """
CREATE TABLE IF NOT EXISTS agent_logs (
    id TEXT PRIMARY KEY, agent_name TEXT, agent TEXT, run_id TEXT,
    status TEXT, trigger TEXT, input TEXT, output TEXT, error TEXT,
    tokens_used INTEGER, cost_usd REAL, duration_ms INTEGER,
    started_at TEXT, completed_at TEXT, action TEXT,
    level TEXT DEFAULT 'info', details TEXT,
    synced_to_notion INTEGER DEFAULT 0, notion_page_id TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS todo_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 1,
    agent TEXT,
    context TEXT,
    created_at TEXT,
    completed_at TEXT,
    synced INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sync_state (
    key TEXT PRIMARY KEY, value TEXT
);
CREATE INDEX IF NOT EXISTS idx_logs_synced ON agent_logs (synced_to_notion, created_at);
CREATE INDEX IF NOT EXISTS idx_logs_agent ON agent_logs (agent_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_status ON todo_items (status, priority DESC);
"""

def _get_db():
    BRAIN_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.executescript(LOCAL_SCHEMA)
    conn.commit()
    return conn

def _now():
    return datetime.now(timezone.utc).isoformat()
# ═══════════════════════════════════════════════════════════════════
# COMMANDS
# ═══════════════════════════════════════════════════════════════════

def cmd_status(_args):
    """Show brain + local stats."""
    url, key = _creds()
    db = _get_db()

    # Local stats
    local_logs = db.execute("SELECT COUNT(*) as c FROM agent_logs").fetchone()["c"]
    local_unsynced = db.execute("SELECT COUNT(*) as c FROM agent_logs WHERE synced_to_notion=0").fetchone()["c"]
    local_todos = db.execute("SELECT COUNT(*) as c FROM todo_items WHERE status != 'done'").fetchone()["c"]
    db.close()

    print("╔══════════════════════════════════════════╗")
    print("║         FRACTAL BRAIN STATUS             ║")
    print("╠══════════════════════════════════════════╣")
    print(f"║  Local logs:     {local_logs:>6}                 ║")
    print(f"║  Unsynced:       {local_unsynced:>6}                 ║")
    print(f"║  Active todos:   {local_todos:>6}                 ║")
    print("╠══════════════════════════════════════════╣")

    # Remote stats
    tables = ["brain_context", "agent_memory", "shared_knowledge",
              "agent_logs", "brain_sessions", "agents"]
    for t in tables:
        try:
            rows = _rest_get(t, "select=id&limit=1&order=id", limit=1)
            # Use HEAD with count header instead
            endpoint = f"{url}/rest/v1/{t}?select=id"
            h = _headers(key)
            h["Prefer"] = "count=exact"
            h["Range"] = "0-0"
            req = urllib.request.Request(endpoint, headers=h)
            with urllib.request.urlopen(req, timeout=10) as r:
                cr = r.headers.get("Content-Range", "")
                count = cr.split("/")[-1] if "/" in cr else "?"
            print(f"║  {t:<18} {count:>6}                 ║")
        except Exception:
            print(f"║  {t:<18}  error                 ║")

    print("╚══════════════════════════════════════════╝")

def cmd_query(args):
    """Run raw SQL via REST RPC (requires pg_net or use REST API)."""
    # For raw SQL, we use the Supabase REST API with the rpc endpoint
    # or direct REST queries. For now, use REST GET with filters.
    query = args.sql
    url, key = _creds()

    # Use PostgREST RPC if available, otherwise print guidance
    # Actually use the /rest/v1/rpc endpoint for raw queries
    endpoint = f"{url}/rest/v1/rpc/exec_sql"
    h = _headers(key)
    body = json.dumps({"query": query}).encode()
    req = urllib.request.Request(endpoint, data=body, headers=h, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read().decode())
            print(json.dumps(result, indent=2))
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        if "404" in str(e.code) or "function" in err.lower():
            print("NOTE: exec_sql RPC function not found in Supabase.")
            print("Use the Supabase MCP execute_sql tool in Claude, or create the function:")
            print("  CREATE OR REPLACE FUNCTION exec_sql(query text)")
            print("  RETURNS json AS $$ ... $$ LANGUAGE plpgsql;")
            print(f"\nQuery was: {query}")
        else:
            print(f"ERROR {e.code}: {err}")


def cmd_memory_list(args):
    """List agent memories."""
    params = "select=*&order=updated_at.desc"
    if args.agent:
        params += f"&agent_name=eq.{urllib.parse.quote(args.agent)}"
    if args.type:
        params += f"&memory_type=eq.{urllib.parse.quote(args.type)}"
    rows = _rest_get("agent_memory", params, limit=args.limit)
    for r in rows:
        conf = r.get("confidence", "?")
        print(f"  [{r['agent_name']}/{r['memory_type']}] {r['key']} = {r['value'][:80]}… (conf={conf})")
    print(f"\n  Total: {len(rows)} memories")

def cmd_memory_set(args):
    """Upsert an agent memory."""
    row = {
        "agent_name": args.agent,
        "memory_type": args.type or "learning",
        "key": args.key,
        "value": args.value,
        "confidence": float(args.confidence) if args.confidence else 0.8,
    }
    # DELETE+INSERT upsert (PATCH is broken)
    _rest_delete("agent_memory", {"agent_name": row["agent_name"],
                                   "memory_type": row["memory_type"],
                                   "key": row["key"]})
    _rest_post("agent_memory", row, prefer="return=minimal")
    print(f"  ✓ {args.agent}/{args.type or 'learning'}/{args.key} set")


def cmd_memory_search(args):
    """Search memories by key or value pattern."""
    params = f"select=*&or=(key.ilike.*{args.pattern}*,value.ilike.*{args.pattern}*)&order=updated_at.desc"
    rows = _rest_get("agent_memory", params, limit=args.limit)
    for r in rows:
        print(f"  [{r['agent_name']}/{r['memory_type']}] {r['key']}")
        print(f"    {r['value'][:120]}")
    print(f"\n  Found: {len(rows)} matches")


def cmd_context_list(args):
    """List brain context entries."""
    params = "select=*&order=priority.desc,updated_at.desc"
    if args.category:
        params += f"&category=eq.{urllib.parse.quote(args.category)}"
    rows = _rest_get("brain_context", params, limit=args.limit)
    for r in rows:
        val = str(r.get("value", ""))[:100]
        print(f"  [p{r.get('priority','?')}] {r['key']} ({r.get('category','')}) = {val}")
    print(f"\n  Total: {len(rows)} context entries")

def cmd_context_set(args):
    """Set a brain context key."""
    row = {
        "key": args.key,
        "category": args.category or "general",
        "value": json.dumps(args.value),
        "priority": int(args.priority) if args.priority else 1,
        "description": args.description or "",
    }
    _rest_delete("brain_context", {"key": row["key"]})
    _rest_post("brain_context", row, prefer="return=minimal")
    print(f"  ✓ context/{args.key} set")


def cmd_context_get(args):
    """Get a specific context key."""
    params = f"select=*&key=eq.{urllib.parse.quote(args.key)}"
    rows = _rest_get("brain_context", params, limit=1)
    if rows:
        print(json.dumps(rows[0], indent=2))
    else:
        print(f"  Not found: {args.key}")


def cmd_knowledge_search(args):
    """Search shared knowledge."""
    params = (f"select=*&or=(topic.ilike.*{args.pattern}*,content.ilike.*{args.pattern}*)"
              f"&order=updated_at.desc")
    rows = _rest_get("shared_knowledge", params, limit=args.limit)
    for r in rows:
        print(f"  [{r.get('source','?')}] {r.get('topic','')}")
        content = str(r.get("content", ""))[:150]
        print(f"    {content}")
    print(f"\n  Found: {len(rows)} entries")

def cmd_todo_add(args):
    """Add a todo item."""
    db = _get_db()
    todo_id = str(uuid.uuid4())[:8]
    db.execute(
        "INSERT INTO todo_items (id, title, status, priority, agent, context, created_at) VALUES (?,?,?,?,?,?,?)",
        (todo_id, args.title, "pending", int(args.priority) if args.priority else 1,
         args.agent or None, args.context or None, _now())
    )
    db.commit()
    db.close()
    print(f"  ✓ Added todo [{todo_id}]: {args.title}")

    # Also sync to Supabase brain_context if --sync flag
    if args.sync:
        try:
            _rest_delete("brain_context", {"key": f"todo.{todo_id}"})
            _rest_post("brain_context", {
                "key": f"todo.{todo_id}",
                "category": "todo",
                "value": json.dumps({"title": args.title, "status": "pending",
                                      "agent": args.agent, "created": _now()}),
                "priority": int(args.priority) if args.priority else 1,
                "description": args.title,
            }, prefer="return=minimal")
            print(f"  ✓ Synced to brain")
        except Exception as e:
            print(f"  ⚠ Brain sync failed: {e}")


def cmd_todo_list(_args):
    """List todo items."""
    db = _get_db()
    rows = db.execute(
        "SELECT * FROM todo_items ORDER BY status ASC, priority DESC, created_at ASC"
    ).fetchall()
    db.close()

    if not rows:
        print("  No todos.")
        return

    icons = {"pending": "○", "in_progress": "◐", "done": "●"}
    for r in rows:
        icon = icons.get(r["status"], "?")
        agent_tag = f" @{r['agent']}" if r["agent"] else ""
        print(f"  {icon} [{r['id']}] {r['title']}{agent_tag} (p{r['priority']})")

    pending = sum(1 for r in rows if r["status"] == "pending")
    active = sum(1 for r in rows if r["status"] == "in_progress")
    done = sum(1 for r in rows if r["status"] == "done")
    print(f"\n  {pending} pending / {active} active / {done} done")

def cmd_todo_done(args):
    """Mark a todo as done."""
    db = _get_db()
    db.execute(
        "UPDATE todo_items SET status='done', completed_at=? WHERE id LIKE ?",
        (_now(), f"{args.id}%")
    )
    db.commit()
    db.close()
    print(f"  ✓ Marked {args.id} as done")


def cmd_todo_progress(args):
    """Mark a todo as in_progress."""
    db = _get_db()
    db.execute(
        "UPDATE todo_items SET status='in_progress' WHERE id LIKE ?",
        (f"{args.id}%",)
    )
    db.commit()
    db.close()
    print(f"  ✓ Marked {args.id} as in_progress")


def cmd_todo_clear(_args):
    """Remove completed todos."""
    db = _get_db()
    result = db.execute("DELETE FROM todo_items WHERE status='done'")
    db.commit()
    count = result.rowcount
    db.close()
    print(f"  ✓ Cleared {count} completed todos")

def cmd_log(args):
    """Log an event locally."""
    db = _get_db()
    row_id = str(uuid.uuid4())
    now = _now()
    db.execute(
        """INSERT INTO agent_logs
           (id, agent_name, agent, run_id, status, trigger, action, level, details, created_at, started_at, completed_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        (row_id, args.agent, args.agent, str(uuid.uuid4()), "completed", "manual",
         args.action, args.level or "info", args.message or None, now, now, now)
    )
    db.commit()
    db.close()
    print(f"  ✓ Logged [{args.agent}/{args.action}] {args.message or ''}")


def cmd_sync(args):
    """Sync local logs to Supabase."""
    # Import sync_to_brain from co-located file
    script_dir = Path(__file__).parent
    sys.path.insert(0, str(script_dir))
    try:
        from sync_to_brain import sync
        result = sync(limit=args.limit, batch_size=args.batch_size,
                      verbose=args.verbose, dry_run=args.dry_run)
        icon = "✓" if result["failed"] == 0 else "⚠"
        print(f"  {icon} Synced={result['synced']} Failed={result['failed']} "
              f"JSONL={result['jsonl_synced']} ({result['duration_ms']}ms)")
    except ImportError:
        print("ERROR: sync_to_brain.py not found next to brain.py")
        sys.exit(1)


def cmd_patch(args):
    """DELETE+INSERT upsert (workaround for broken PATCH)."""
    match_cols = json.loads(args.match)
    data = json.loads(args.data)
    match_conditions = {c: data[c] for c in match_cols}
    _rest_delete(args.table, match_conditions)
    _rest_post(args.table, data, prefer="return=minimal")
    print(f"  ✓ Upserted into {args.table}")

def cmd_agents(_args):
    """List registered agents."""
    rows = _rest_get("agents", "select=*&order=name", limit=100)
    for r in rows:
        status = r.get("status", "?")
        print(f"  [{status:>10}] {r.get('name','?')} — {r.get('description','')[:60]}")
    print(f"\n  Total: {len(rows)} agents")


def cmd_tables(_args):
    """List all public tables with row counts."""
    url, key = _creds()
    # Query Supabase information_schema through RPC or just list known tables
    known = ["agent_logs", "agent_memory", "agent_state", "agents",
             "brain_context", "brain_decisions", "brain_sessions",
             "brain_tools", "brain_workflows", "shared_knowledge"]
    print("  Table                    Rows")
    print("  ─────────────────────────────")
    for t in known:
        try:
            endpoint = f"{url}/rest/v1/{t}?select=id"
            h = _headers(key)
            h["Prefer"] = "count=exact"
            h["Range"] = "0-0"
            req = urllib.request.Request(endpoint, headers=h)
            with urllib.request.urlopen(req, timeout=10) as r:
                cr = r.headers.get("Content-Range", "")
                count = cr.split("/")[-1] if "/" in cr else "?"
            print(f"  {t:<25} {count:>6}")
        except Exception:
            print(f"  {t:<25}  error")

# ═══════════════════════════════════════════════════════════════════
# CLI PARSER
# ═══════════════════════════════════════════════════════════════════

def build_parser():
    p = argparse.ArgumentParser(
        prog="brain",
        description="Fractal Brain — Unified CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = p.add_subparsers(dest="command", help="Available commands")

    # status
    sub.add_parser("status", help="Show brain + local stats")

    # query
    q = sub.add_parser("query", help="Run raw SQL (requires exec_sql RPC function)")
    q.add_argument("sql", help="SQL query to execute")

    # memory
    mem = sub.add_parser("memory", help="Agent memory operations")
    msub = mem.add_subparsers(dest="mem_cmd")
    ml = msub.add_parser("list", help="List memories")
    ml.add_argument("--agent", "-a", help="Filter by agent name")
    ml.add_argument("--type", "-t", help="Filter by memory type")
    ml.add_argument("--limit", type=int, default=20)

    ms = msub.add_parser("set", help="Set/upsert a memory")
    ms.add_argument("agent", help="Agent name")
    ms.add_argument("key", help="Memory key")
    ms.add_argument("value", help="Memory value")
    ms.add_argument("--type", default="learning", help="Memory type (default: learning)")
    ms.add_argument("--confidence", "-c", default="0.8")
    msr = msub.add_parser("search", help="Search memories")
    msr.add_argument("pattern", help="Search pattern")
    msr.add_argument("--limit", type=int, default=20)

    # context
    ctx = sub.add_parser("context", help="Brain context operations")
    csub = ctx.add_subparsers(dest="ctx_cmd")
    cl = csub.add_parser("list", help="List context entries")
    cl.add_argument("--category", help="Filter by category")
    cl.add_argument("--limit", type=int, default=50)

    cs = csub.add_parser("set", help="Set a context key")
    cs.add_argument("key", help="Context key")
    cs.add_argument("value", help="Context value")
    cs.add_argument("--category", default="general")
    cs.add_argument("--priority", default="1")
    cs.add_argument("--description", "-d", default="")

    cg = csub.add_parser("get", help="Get a context key")
    cg.add_argument("key", help="Context key to retrieve")

    # knowledge
    kn = sub.add_parser("knowledge", help="Shared knowledge search")
    ksub = kn.add_subparsers(dest="kn_cmd")
    ks = ksub.add_parser("search", help="Search knowledge")
    ks.add_argument("pattern", help="Search pattern")
    ks.add_argument("--limit", type=int, default=20)

    # todo
    td = sub.add_parser("todo", help="Todo list management")
    tsub = td.add_subparsers(dest="todo_cmd")
    ta = tsub.add_parser("add", help="Add a todo")
    ta.add_argument("title", help="Todo title")
    ta.add_argument("--priority", "-p", default="1")
    ta.add_argument("--agent", "-a", help="Assign to agent")
    ta.add_argument("--context", help="Additional context")
    ta.add_argument("--sync", action="store_true", help="Sync to brain")

    tsub.add_parser("list", help="List todos")

    tdone = tsub.add_parser("done", help="Mark todo as done")
    tdone.add_argument("id", help="Todo ID (prefix match)")

    tprog = tsub.add_parser("progress", help="Mark todo as in_progress")
    tprog.add_argument("id", help="Todo ID (prefix match)")

    tsub.add_parser("clear", help="Remove completed todos")

    # log
    lg = sub.add_parser("log", help="Log an event locally")
    lg.add_argument("agent", help="Agent name")
    lg.add_argument("action", help="Action name")
    lg.add_argument("message", nargs="?", help="Optional message")
    lg.add_argument("--level", default="info")

    # sync
    sy = sub.add_parser("sync", help="Sync local logs to Supabase")
    sy.add_argument("--limit", type=int, default=200)
    sy.add_argument("--batch-size", type=int, default=50)
    sy.add_argument("--verbose", "-v", action="store_true")
    sy.add_argument("--dry-run", "-n", action="store_true")

    # patch
    pa = sub.add_parser("patch", help="DELETE+INSERT upsert")
    pa.add_argument("table", help="Table name")
    pa.add_argument("match", help="JSON array of match columns")
    pa.add_argument("data", help="JSON object of row data")

    # agents
    sub.add_parser("agents", help="List registered agents")

    # tables
    sub.add_parser("tables", help="List brain tables with row counts")

    db = sub.add_parser("dashboard", help="Launch the Command Center UI")
    db.add_argument("--port", type=int, default=3333, help="Port (default 3333)")
    db.add_argument("--no-open", action="store_true", help="Don't auto-open browser")

    hc = sub.add_parser("health", help="Run system health check")
    hc.add_argument("--json", action="store_true", help="Output JSON")
    hc.add_argument("--fix", action="store_true", help="Auto-fix detected issues")
    hc.add_argument("--dry-run", action="store_true", help="Show fixes without applying")

    sub.add_parser("bootstrap", help="Generate session context brief")
    sub.add_parser("fix", help="Run auto-fix engine on pending bottlenecks")
    sub.add_parser("boot", help="Run full Fractal Brain boot sequence")
    sub.add_parser("cycle", help="Run autonomous health/fix cycle")
    sub.add_parser("orch", help="Show orchestrator status")

    return p

def main():
    p = build_parser()
    args = p.parse_args()

    if not args.command:
        p.print_help()
        return

    def cmd_dashboard(a):
        import subprocess
        dash = Path(__file__).parent / "dashboard.py"
        cmd = ["python3", str(dash), "--port", str(a.port)]
        if a.no_open:
            cmd.append("--no-open")
        subprocess.run(cmd)

    def cmd_health(a):
        import subprocess
        tools = Path(__file__).parent
        # Run health check
        cmd = ["python3", str(tools / "health_monitor.py")]
        if a.json:
            cmd.append("--json")
        subprocess.run(cmd)
        # Auto-fix if requested
        if a.fix or a.dry_run:
            fix_cmd = ["python3", str(tools / "auto_fix.py")]
            if a.dry_run:
                fix_cmd.append("--dry-run")
            subprocess.run(fix_cmd)

    def cmd_bootstrap(a):
        import subprocess
        subprocess.run(["python3", str(Path(__file__).parent / "session_bootstrap.py")])

    def cmd_fix(a):
        import subprocess
        subprocess.run(["python3", str(Path(__file__).parent / "auto_fix.py")])

    def cmd_boot(a):
        import subprocess
        subprocess.run(["python3", str(Path(__file__).parent / "orchestrator.py"), "boot"])

    def cmd_cycle(a):
        import subprocess
        subprocess.run(["python3", str(Path(__file__).parent / "orchestrator.py"), "cycle"])

    def cmd_orch(a):
        import subprocess
        subprocess.run(["python3", str(Path(__file__).parent / "orchestrator.py"), "status"])

    dispatch = {
        "status": cmd_status,
        "query": cmd_query,
        "agents": cmd_agents,
        "tables": cmd_tables,
        "log": cmd_log,
        "sync": cmd_sync,
        "patch": cmd_patch,
        "dashboard": cmd_dashboard,
        "health": cmd_health,
        "bootstrap": cmd_bootstrap,
        "fix": cmd_fix,
        "boot": cmd_boot,
        "cycle": cmd_cycle,
        "orch": cmd_orch,
    }

    if args.command in dispatch:
        dispatch[args.command](args)
    elif args.command == "memory":
        {"list": cmd_memory_list, "set": cmd_memory_set,
         "search": cmd_memory_search}.get(args.mem_cmd, lambda _: print("Usage: brain memory [list|set|search]"))(args)
    elif args.command == "context":
        {"list": cmd_context_list, "set": cmd_context_set,
         "get": cmd_context_get}.get(args.ctx_cmd, lambda _: print("Usage: brain context [list|set|get]"))(args)
    elif args.command == "knowledge":
        {"search": cmd_knowledge_search}.get(args.kn_cmd, lambda _: print("Usage: brain knowledge search <pattern>"))(args)
    elif args.command == "todo":
        {"add": cmd_todo_add, "list": cmd_todo_list, "done": cmd_todo_done,
         "progress": cmd_todo_progress, "clear": cmd_todo_clear}.get(
            args.todo_cmd, lambda _: print("Usage: brain todo [add|list|done|progress|clear]"))(args)
    else:
        p.print_help()


if __name__ == "__main__":
    main()