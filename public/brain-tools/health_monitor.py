#!/usr/bin/env python3
"""Fractal Brain Health Monitor — autonomous system health checker.

Checks all connectors, Supabase tables, local tools, and LaunchAgents.
Writes results to local SQLite + syncs to brain_context.
Identifies bottlenecks and queues auto-fix tasks.
"""

import json, os, sys, time, sqlite3, urllib.request, urllib.error
from pathlib import Path
from datetime import datetime, timezone

BRAIN_DIR = Path.home() / ".fractal_brain"
ENV_FILE = BRAIN_DIR / ".env"
DB_FILE = BRAIN_DIR / "health.db"
TOOLS_DIR = BRAIN_DIR / "tools"
LOG_FILE = BRAIN_DIR / "logs" / "health.log"

SUPABASE_URL = ""
SUPABASE_KEY = ""

def _load_env():
    global SUPABASE_URL, SUPABASE_KEY
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()
    SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

_load_env()

def _log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    try:
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except:
        pass

def _init_db():
    db = sqlite3.connect(str(DB_FILE))
    db.execute("""CREATE TABLE IF NOT EXISTS health_checks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        component TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT,
        latency_ms REAL DEFAULT 0,
        auto_fixable INTEGER DEFAULT 0
    )""")
    db.execute("""CREATE TABLE IF NOT EXISTS bottlenecks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        component TEXT NOT NULL,
        issue TEXT NOT NULL,
        severity TEXT NOT NULL,
        auto_fix_script TEXT,
        fix_status TEXT DEFAULT 'pending',
        resolved_at TEXT
    )""")
    db.commit()
    return db

def _supabase_get(path):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json"
    })
    try:
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=10) as r:
            latency = (time.time() - t0) * 1000
            return json.loads(r.read()), latency
    except Exception as e:
        return None, 0

def _supabase_post(table, data):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return False
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal,resolution=merge-duplicates"
    })
    try:
        urllib.request.urlopen(req, timeout=10)
        return True
    except:
        return False

# ── Check functions ──

def check_supabase_tables():
    """Check all brain tables exist and have data."""
    results = []
    tables = {
        "agents": 10, "agent_memory": 100, "shared_knowledge": 100,
        "brain_context": 10, "brain_workflows": 5, "brain_tools": 10,
        "brain_decisions": 5, "brain_connectors": 10, "agent_logs": 0
    }
    for table, min_rows in tables.items():
        data, latency = _supabase_get(f"{table}?select=id&limit=1")
        if data is None:
            results.append(("supabase", table, "down", "Connection failed", 0, False))
        elif isinstance(data, list):
            # Check row count
            count_data, _ = _supabase_get(f"{table}?select=id")
            count = len(count_data) if count_data else 0
            if count < min_rows:
                results.append(("supabase", table, "warning", f"{count} rows (expected {min_rows}+)", latency, False))
            else:
                results.append(("supabase", table, "healthy", f"{count} rows", latency, False))
        else:
            results.append(("supabase", table, "error", str(data)[:200], latency, False))
    return results

def check_local_tools():
    """Verify all local tools exist and are valid Python."""
    results = []
    required = ["brain.py", "dashboard.py", "local_logger.py", "sync_to_brain.py", "brain_patch.py"]
    for tool in required:
        path = TOOLS_DIR / tool
        if not path.exists():
            results.append(("local_tools", tool, "missing", f"{path} not found", 0, True))
            continue
        # Syntax check
        try:
            import py_compile
            py_compile.compile(str(path), doraise=True)
            size = path.stat().st_size
            results.append(("local_tools", tool, "healthy", f"{size} bytes, syntax OK", 0, False))
        except py_compile.PyCompileError as e:
            results.append(("local_tools", tool, "broken", str(e)[:200], 0, True))
    # Check brain CLI symlink
    brain_link = Path.home() / "bin" / "brain"
    if brain_link.exists() or brain_link.is_symlink():
        results.append(("local_tools", "brain_symlink", "healthy", str(brain_link.resolve()), 0, False))
    else:
        results.append(("local_tools", "brain_symlink", "missing", "~/bin/brain not found", 0, True))
    # Check dashboard.html
    html = TOOLS_DIR / "dashboard.html"
    if html.exists():
        results.append(("local_tools", "dashboard.html", "healthy", f"{html.stat().st_size} bytes", 0, False))
    else:
        results.append(("local_tools", "dashboard.html", "missing", "UI file not found", 0, True))
    return results

def check_services():
    """Check running services — dashboard server, LaunchAgent."""
    results = []
    # Dashboard server
    try:
        t0 = time.time()
        req = urllib.request.Request("http://localhost:3333/api/stats")
        with urllib.request.urlopen(req, timeout=5) as r:
            latency = (time.time() - t0) * 1000
            data = json.loads(r.read())
            if "remote" in data:
                results.append(("services", "dashboard_server", "healthy", f"Running, {latency:.0f}ms", latency, False))
            else:
                results.append(("services", "dashboard_server", "degraded", "Responding but no data", latency, True))
    except Exception as e:
        results.append(("services", "dashboard_server", "down", str(e)[:100], 0, True))
    # LaunchAgent
    import subprocess
    try:
        out = subprocess.check_output(["launchctl", "list"], text=True, timeout=5)
        if "com.fractalbrain.dashboard" in out:
            results.append(("services", "launchagent", "healthy", "Registered", 0, False))
        else:
            results.append(("services", "launchagent", "missing", "Not registered", 0, True))
    except:
        results.append(("services", "launchagent", "unknown", "Could not check", 0, False))
    # .env file
    if ENV_FILE.exists():
        keys = [l.split("=")[0].strip() for l in ENV_FILE.read_text().splitlines() if "=" in l and not l.startswith("#")]
        if "SUPABASE_URL" in keys and ("SUPABASE_KEY" in keys or "SUPABASE_SERVICE_ROLE_KEY" in keys):
            results.append(("services", "env_config", "healthy", f"{len(keys)} keys set", 0, False))
        else:
            results.append(("services", "env_config", "incomplete", f"Keys: {keys}", 0, True))
    else:
        results.append(("services", "env_config", "missing", str(ENV_FILE), 0, True))
    return results

def check_connectors():
    """Check brain_connectors status from Supabase."""
    results = []
    data, latency = _supabase_get("brain_connectors?select=name,status,category")
    if data:
        for c in data:
            status = c.get("status", "unknown")
            results.append(("connectors", c["name"], status, c.get("category", ""), latency, status == "degraded"))
    return results

def check_local_db():
    """Check local SQLite databases are healthy."""
    results = []
    local_db = BRAIN_DIR / "local_brain.db"
    if local_db.exists():
        try:
            conn = sqlite3.connect(str(local_db))
            tables = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
            log_count = conn.execute("SELECT COUNT(*) FROM agent_logs").fetchone()[0] if "agent_logs" in tables else 0
            todo_count = conn.execute("SELECT COUNT(*) FROM todo_items").fetchone()[0] if "todo_items" in tables else 0
            conn.close()
            results.append(("local_db", "local_brain.db", "healthy", f"{len(tables)} tables, {log_count} logs, {todo_count} todos", 0, False))
        except Exception as e:
            results.append(("local_db", "local_brain.db", "corrupted", str(e)[:200], 0, True))
    else:
        results.append(("local_db", "local_brain.db", "missing", "Will be created on first use", 0, False))
    return results

# ── Main runner ──

def run_full_check():
    """Run all health checks, store results, identify bottlenecks."""
    _log("Starting full health check...")
    db = _init_db()
    ts = datetime.now(timezone.utc).isoformat()
    all_results = []

    checks = [
        ("Supabase Tables", check_supabase_tables),
        ("Local Tools", check_local_tools),
        ("Services", check_services),
        ("Connectors", check_connectors),
        ("Local DB", check_local_db),
    ]

    for name, fn in checks:
        _log(f"  Checking {name}...")
        try:
            results = fn()
            all_results.extend(results)
        except Exception as e:
            _log(f"  ERROR in {name}: {e}")
            all_results.append(("error", name, "error", str(e)[:200], 0, False))

    # Store results
    for cat, comp, status, details, latency, fixable in all_results:
        db.execute(
            "INSERT INTO health_checks (timestamp, component, category, status, details, latency_ms, auto_fixable) VALUES (?,?,?,?,?,?,?)",
            (ts, comp, cat, status, details, latency, 1 if fixable else 0)
        )

    # Identify bottlenecks
    bottlenecks = []
    for cat, comp, status, details, latency, fixable in all_results:
        if status in ("down", "missing", "broken", "corrupted"):
            severity = "critical"
        elif status in ("degraded", "warning", "error", "incomplete"):
            severity = "warning"
        else:
            continue
        bottlenecks.append({
            "component": comp, "category": cat,
            "issue": f"{status}: {details}", "severity": severity,
            "auto_fixable": fixable
        })
        db.execute(
            "INSERT INTO bottlenecks (timestamp, component, issue, severity, fix_status) VALUES (?,?,?,?,?)",
            (ts, comp, f"{status}: {details}", severity, "pending")
        )

    db.commit()

    # Summary
    healthy = sum(1 for r in all_results if r[2] == "healthy")
    warnings = sum(1 for r in all_results if r[2] in ("warning", "degraded", "incomplete"))
    critical = sum(1 for r in all_results if r[2] in ("down", "missing", "broken", "corrupted", "error"))
    total = len(all_results)

    summary = {
        "timestamp": ts,
        "total_checks": total,
        "healthy": healthy,
        "warnings": warnings,
        "critical": critical,
        "score": round((healthy / total) * 100) if total else 0,
        "bottlenecks": bottlenecks
    }

    _log(f"  Health: {healthy}/{total} healthy, {warnings} warnings, {critical} critical (score: {summary['score']}%)")

    # Sync summary to brain_context
    _supabase_post("brain_context", {
        "key": "health.latest",
        "category": "system",
        "value": json.dumps(summary),
        "priority": 8
    })

    # Write JSON report for dashboard
    report_file = BRAIN_DIR / "logs" / "health_report.json"
    report_file.parent.mkdir(parents=True, exist_ok=True)
    report_file.write_text(json.dumps({
        "summary": summary,
        "checks": [{"category": c, "component": n, "status": s, "details": d, "latency_ms": l} for c, n, s, d, l, _ in all_results],
        "bottlenecks": bottlenecks
    }, indent=2))

    db.close()
    return summary

def print_report(summary):
    """Pretty-print health report to terminal."""
    score = summary["score"]
    icon = "🟢" if score >= 90 else "🟡" if score >= 70 else "🔴"
    print(f"\n{icon} Fractal Brain Health: {score}%")
    print(f"   {summary['healthy']} healthy · {summary['warnings']} warnings · {summary['critical']} critical")
    if summary["bottlenecks"]:
        print(f"\n   Bottlenecks:")
        for b in summary["bottlenecks"]:
            sev = "🔴" if b["severity"] == "critical" else "🟡"
            fix = " [auto-fixable]" if b["auto_fixable"] else ""
            print(f"   {sev} {b['component']}: {b['issue']}{fix}")
    print()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Fractal Brain Health Monitor")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of pretty-print")
    parser.add_argument("--quiet", action="store_true", help="No terminal output, just store results")
    args = parser.parse_args()

    summary = run_full_check()

    if args.json:
        print(json.dumps(summary, indent=2))
    elif not args.quiet:
        print_report(summary)
