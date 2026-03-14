#!/usr/bin/env python3
"""Fractal Brain Session Bootstrap — pre-loads context for Claude sessions.

Generates a comprehensive context brief that can be injected at session start.
Pulls: health status, active goals, pending tasks, recent decisions,
active bottlenecks, agent roster, and system state.
"""

import json, os, sys, time, urllib.request
from pathlib import Path
from datetime import datetime, timezone

BRAIN_DIR = Path.home() / ".fractal_brain"
ENV_FILE = BRAIN_DIR / ".env"
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

def _supa(path):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return []
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json"
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except:
        return []

def generate_brief():
    """Generate a full system context brief for session start."""
    brief = {"generated_at": datetime.now(timezone.utc).isoformat(), "sections": {}}

    # 1. Health status
    health_file = BRAIN_DIR / "logs" / "health_report.json"
    if health_file.exists():
        try:
            health = json.loads(health_file.read_text())
            brief["sections"]["health"] = health["summary"]
        except:
            brief["sections"]["health"] = {"status": "unknown", "note": "Could not read health report"}
    else:
        brief["sections"]["health"] = {"status": "no_report", "note": "Run: python3 health_monitor.py"}

    # 2. Active goals and priorities
    goals = _supa("brain_context?category=eq.goals&order=priority.desc&limit=10&select=key,value,priority")
    brief["sections"]["goals"] = [{"key": g["key"], "priority": g.get("priority", 1),
        "value": g["value"][:300] if isinstance(g["value"], str) else json.dumps(g["value"])[:300]} for g in goals]

    # 3. Pending tasks from working state
    working = _supa("brain_context?key=eq.session.2026-03-13.working_state&select=value")
    if working:
        try:
            ws = json.loads(working[0]["value"]) if isinstance(working[0]["value"], str) else working[0]["value"]
            brief["sections"]["pending_tasks"] = ws.get("pending_tasks", [])
            brief["sections"]["known_issues"] = ws.get("known_issues", {})
        except:
            pass

    # 4. Recent decisions
    decisions = _supa("brain_decisions?order=created_at.desc&limit=5&select=topic,decision,status,rationale")
    brief["sections"]["recent_decisions"] = decisions

    # 5. Agent roster summary
    agents = _supa("agents?select=name,role,tier,status,model")
    brief["sections"]["agents"] = {
        "total": len(agents),
        "by_tier": {},
        "active": [a["name"] for a in agents if a.get("status") == "idle"]
    }
    for a in agents:
        tier = a.get("tier", "unknown")
        brief["sections"]["agents"]["by_tier"][tier] = brief["sections"]["agents"]["by_tier"].get(tier, 0) + 1

    # 6. Critical system context
    sys_ctx = _supa("brain_context?category=eq.system&order=priority.desc&limit=8&select=key,value,priority")
    brief["sections"]["system_context"] = [{"key": c["key"], "summary": (c["value"][:200] if isinstance(c["value"], str) else json.dumps(c["value"])[:200])} for c in sys_ctx]

    # 7. Active workflows
    wfs = _supa("brain_workflows?status=eq.active&select=name,description,status")
    brief["sections"]["workflows"] = {"active": len(wfs), "names": [w["name"] for w in wfs]}

    # 8. Bottlenecks from health DB
    try:
        import sqlite3
        db = sqlite3.connect(str(BRAIN_DIR / "health.db"))
        bottlenecks = db.execute(
            "SELECT component, issue, severity FROM bottlenecks WHERE fix_status='pending' ORDER BY CASE severity WHEN 'critical' THEN 1 ELSE 2 END LIMIT 10"
        ).fetchall()
        brief["sections"]["active_bottlenecks"] = [{"component": b[0], "issue": b[1], "severity": b[2]} for b in bottlenecks]
        db.close()
    except:
        brief["sections"]["active_bottlenecks"] = []

    # 9. Local todos
    try:
        import sqlite3
        db = sqlite3.connect(str(BRAIN_DIR / "local_brain.db"))
        todos = db.execute("SELECT title, status, agent, priority FROM todo_items WHERE status != 'done' ORDER BY priority DESC LIMIT 10").fetchall()
        brief["sections"]["todos"] = [{"title": t[0], "status": t[1], "agent": t[2], "priority": t[3]} for t in todos]
        db.close()
    except:
        brief["sections"]["todos"] = []

    # 10. Tool inventory
    tools = list(BRAIN_DIR.glob("tools/*.py"))
    brief["sections"]["local_tools"] = [t.name for t in tools]

    return brief

def format_brief(brief):
    """Format brief as readable text for Claude session injection."""
    lines = []
    lines.append("=" * 60)
    lines.append("  FRACTAL BRAIN — SESSION CONTEXT BRIEF")
    lines.append(f"  Generated: {brief['generated_at']}")
    lines.append("=" * 60)

    s = brief["sections"]

    # Health
    h = s.get("health", {})
    score = h.get("score", "?")
    lines.append(f"\n🏥 SYSTEM HEALTH: {score}%")
    lines.append(f"   {h.get('healthy', '?')}/{h.get('total_checks', '?')} checks passing")
    if h.get("critical", 0) > 0:
        lines.append(f"   ⚠️  {h['critical']} CRITICAL issues detected")

    # Bottlenecks
    bns = s.get("active_bottlenecks", [])
    if bns:
        lines.append(f"\n🔴 ACTIVE BOTTLENECKS ({len(bns)}):")
        for b in bns[:5]:
            lines.append(f"   • [{b['severity'].upper()}] {b['component']}: {b['issue']}")

    # Goals
    goals = s.get("goals", [])
    if goals:
        lines.append(f"\n🎯 ACTIVE GOALS ({len(goals)}):")
        for g in goals[:5]:
            val = g["value"][:100]
            lines.append(f"   • [p{g['priority']}] {g['key']}: {val}")

    # Pending tasks
    tasks = s.get("pending_tasks", [])
    if tasks:
        lines.append(f"\n📋 PENDING TASKS ({len(tasks)}):")
        for t in tasks[:5]:
            lines.append(f"   • [{t.get('status','?')}] {t.get('task','')}")

    # Known issues
    issues = s.get("known_issues", {})
    if issues:
        lines.append(f"\n⚠️  KNOWN ISSUES:")
        for k, v in issues.items():
            lines.append(f"   • {k}: {v}")

    # Agents
    ag = s.get("agents", {})
    lines.append(f"\n🤖 AGENT FLEET: {ag.get('total', 0)} agents")
    for tier, count in ag.get("by_tier", {}).items():
        lines.append(f"   • {tier}: {count}")

    # Workflows
    wf = s.get("workflows", {})
    lines.append(f"\n⚙️  WORKFLOWS: {wf.get('active', 0)} active")

    # Todos
    todos = s.get("todos", [])
    if todos:
        lines.append(f"\n☐ TODOS ({len(todos)}):")
        for t in todos[:5]:
            lines.append(f"   • [{t['status']}] {t['title']} (p{t['priority']})")

    # Tools
    tools = s.get("local_tools", [])
    lines.append(f"\n🔧 LOCAL TOOLS: {', '.join(tools)}")

    # Commands cheat sheet
    lines.append(f"\n📎 QUICK COMMANDS:")
    lines.append(f"   brain status          — System overview")
    lines.append(f"   brain dashboard       — Open Command Center")
    lines.append(f"   brain agents          — List agent fleet")
    lines.append(f"   brain memory search X — Search memories")
    lines.append(f"   brain todo list       — View todos")
    lines.append(f"   brain todo add 'X'    — Add a todo")

    lines.append("\n" + "=" * 60)
    return "\n".join(lines)


def save_brief(brief, formatted):
    """Save brief to files."""
    out_dir = BRAIN_DIR / "logs"
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "session_brief.json").write_text(json.dumps(brief, indent=2))
    (out_dir / "session_brief.txt").write_text(formatted)


if __name__ == "__main__":
    brief = generate_brief()
    formatted = format_brief(brief)
    save_brief(brief, formatted)
    print(formatted)
