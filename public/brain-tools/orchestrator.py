#!/usr/bin/env python3
"""Fractal Brain Orchestrator — full Mac system control layer.

Authorized capabilities:
  - Process management (start, stop, restart any app/process)
  - LaunchAgent management (load, unload, reload)
  - Shell command execution with full logging
  - App control via osascript
  - Full autonomous health->diagnose->fix->verify loop
  - Master boot sequence for cold start

All actions logged to ~/.fractal_brain/logs/orchestrator.log
"""

import json, os, sys, subprocess, time, sqlite3
from pathlib import Path
from datetime import datetime, timezone
import urllib.request, urllib.error

BRAIN_DIR = Path.home() / ".fractal_brain"
TOOLS_DIR = BRAIN_DIR / "tools"
LOGS_DIR = BRAIN_DIR / "logs"
LOG_FILE = LOGS_DIR / "orchestrator.log"
ACTION_DB = BRAIN_DIR / "orchestrator.db"
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

def _log(msg, level="INFO"):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] [{level}] {msg}"
    print(line)
    try:
        LOGS_DIR.mkdir(parents=True, exist_ok=True)
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except: pass

def _init_db():
    db = sqlite3.connect(str(ACTION_DB))
    db.execute("""CREATE TABLE IF NOT EXISTS actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        action TEXT NOT NULL,
        target TEXT,
        result TEXT,
        success INTEGER DEFAULT 1
    )""")
    db.commit()
    return db

def _record(action, target, result, success=True):
    try:
        db = _init_db()
        db.execute("INSERT INTO actions (timestamp, action, target, result, success) VALUES (?,?,?,?,?)",
            (datetime.now(timezone.utc).isoformat(), action, target, result, 1 if success else 0))
        db.commit(); db.close()
    except: pass

def _supabase_post(table, data):
    if not SUPABASE_URL or not SUPABASE_KEY: return False
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal,resolution=merge-duplicates"
    })
    try: urllib.request.urlopen(req, timeout=10); return True
    except: return False

# ═══════════════════════════════════════════
#  PROCESS CONTROL
# ═══════════════════════════════════════════

def run_cmd(cmd, timeout=30):
    """Run any shell command, log it, return output."""
    _log(f"CMD: {cmd}")
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        out = (r.stdout + r.stderr).strip()
        _record("shell_cmd", cmd, out[:500], r.returncode == 0)
        return r.returncode, out
    except subprocess.TimeoutExpired:
        _record("shell_cmd", cmd, "TIMEOUT", False)
        return -1, "TIMEOUT"

def kill_process(name):
    """Kill process by name."""
    _log(f"KILL: {name}")
    code, out = run_cmd(f"pkill -f '{name}' 2>&1")
    _record("kill_process", name, out, code == 0)
    return code == 0

def start_process(cmd, background=True):
    """Start a process, optionally in background."""
    _log(f"START: {cmd} (bg={background})")
    if background:
        subprocess.Popen(cmd, shell=True,
            stdout=open(LOGS_DIR / "processes.log", "a"),
            stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL, start_new_session=True)
        _record("start_process", cmd, "launched_bg", True)
        return True
    else:
        code, out = run_cmd(cmd)
        return code == 0

def restart_process(name, start_cmd):
    """Kill then restart a process."""
    _log(f"RESTART: {name}")
    kill_process(name)
    time.sleep(2)
    return start_process(start_cmd)

def is_running(name):
    """Check if a process is running."""
    code, out = run_cmd(f"pgrep -f '{name}' 2>/dev/null")
    return code == 0

# ═══════════════════════════════════════════
#  APP CONTROL (macOS)
# ═══════════════════════════════════════════

def open_app(app_name):
    """Open a macOS application."""
    _log(f"OPEN APP: {app_name}")
    code, out = run_cmd(f"open -a '{app_name}'")
    _record("open_app", app_name, out, code == 0)
    return code == 0

def quit_app(app_name):
    """Gracefully quit a macOS application."""
    _log(f"QUIT APP: {app_name}")
    code, out = run_cmd(f"osascript -e 'tell application \"{app_name}\" to quit'")
    _record("quit_app", app_name, out, code == 0)
    return code == 0

def restart_app(app_name):
    """Quit then reopen a macOS application."""
    _log(f"RESTART APP: {app_name}")
    quit_app(app_name)
    time.sleep(2)
    return open_app(app_name)

def list_running_apps():
    """List all running macOS applications."""
    code, out = run_cmd("osascript -e 'tell application \"System Events\" to get name of every process whose background only is false'")
    if code == 0:
        return [a.strip() for a in out.split(",")]
    return []

# ═══════════════════════════════════════════
#  LAUNCHAGENT MANAGEMENT
# ═══════════════════════════════════════════

LAUNCH_AGENTS = {
    "dashboard": "com.fractalbrain.dashboard",
    "healthcheck": "com.fractalbrain.healthcheck",
    "autofix": "com.fractalbrain.autofix",
    "boot": "com.fractalbrain.boot",
}

def _uid():
    return subprocess.check_output(["id", "-u"], text=True).strip()

def load_agent(name):
    """Load a LaunchAgent by short name."""
    label = LAUNCH_AGENTS.get(name, name)
    plist = Path.home() / f"Library/LaunchAgents/{label}.plist"
    if not plist.exists():
        _log(f"WARN: Plist not found: {plist}", "WARN")
        return False
    uid = _uid()
    run_cmd(f"launchctl bootout gui/{uid}/{label} 2>/dev/null")
    time.sleep(1)
    code, out = run_cmd(f"launchctl bootstrap gui/{uid} {plist}")
    _record("load_agent", label, out, code == 0)
    return code == 0

def unload_agent(name):
    """Unload a LaunchAgent."""
    label = LAUNCH_AGENTS.get(name, name)
    uid = _uid()
    code, out = run_cmd(f"launchctl bootout gui/{uid}/{label}")
    _record("unload_agent", label, out, code == 0)
    return code == 0

def reload_agent(name):
    """Unload then reload a LaunchAgent."""
    unload_agent(name)
    time.sleep(1)
    return load_agent(name)

def list_agents():
    """List all fractal brain LaunchAgents and their status."""
    code, out = run_cmd("launchctl list | grep fractalbrain")
    results = {}
    if code == 0:
        for line in out.strip().split("\n"):
            parts = line.split()
            if len(parts) >= 3:
                pid, exit_code, label = parts[0], parts[1], parts[2]
                running = pid != "-"
                results[label] = {"pid": pid, "exit_code": exit_code, "running": running}
    return results

# ═══════════════════════════════════════════
#  AUTONOMOUS LOOP
# ═══════════════════════════════════════════

def autonomous_cycle():
    """Full health->diagnose->fix->verify cycle."""
    _log("=" * 55)
    _log("AUTONOMOUS CYCLE STARTING", "INFO")
    _log("=" * 55)

    # Step 1: Health check
    _log("Step 1/4: Running health check...")
    code, out = run_cmd(f"{sys.executable} {TOOLS_DIR / 'health_monitor.py'} --quiet", timeout=60)
    _record("health_check", "full", f"exit:{code}", code == 0)

    # Step 2: Read bottlenecks
    _log("Step 2/4: Diagnosing bottlenecks...")
    report_file = BRAIN_DIR / "logs" / "health_report.json"
    bottlenecks = []
    if report_file.exists():
        try:
            data = json.loads(report_file.read_text())
            bottlenecks = data.get("bottlenecks", [])
            score = data.get("summary", {}).get("score", 0)
            _log(f"  Health score: {score}%, {len(bottlenecks)} bottlenecks")
        except: pass

    # Step 3: Auto-fix
    if bottlenecks:
        _log("Step 3/4: Running auto-fix engine...")
        code, out = run_cmd(f"{sys.executable} {TOOLS_DIR / 'auto_fix.py'}", timeout=60)
        _record("auto_fix", "full", f"exit:{code}", code == 0)
    else:
        _log("Step 3/4: No bottlenecks, skipping auto-fix")

    # Step 3b: Ensure critical services are running
    _log("  Checking critical services...")
    if not is_running("dashboard.py"):
        _log("  Dashboard down — restarting...")
        restart_process("dashboard.py",
            f"nohup {sys.executable} {TOOLS_DIR / 'dashboard.py'} --no-open < /dev/null > {LOGS_DIR / 'dashboard.log'} 2>&1 &")
        time.sleep(3)

    # Step 4: Verify
    _log("Step 4/4: Verifying system state...")
    verified = {}

    # Verify dashboard
    try:
        urllib.request.urlopen("http://localhost:3333/api/stats", timeout=5)
        verified["dashboard"] = True
        _log("  ✓ Dashboard responding")
    except:
        verified["dashboard"] = False
        _log("  ✗ Dashboard not responding", "WARN")

    # Verify Supabase
    try:
        url = f"{SUPABASE_URL}/rest/v1/agents?select=id&limit=1"
        req = urllib.request.Request(url, headers={
            "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
        urllib.request.urlopen(req, timeout=10)
        verified["supabase"] = True
        _log("  ✓ Supabase connected")
    except:
        verified["supabase"] = False
        _log("  ✗ Supabase unreachable", "WARN")

    # Verify LaunchAgents
    agents = list_agents()
    for name, label in LAUNCH_AGENTS.items():
        if label in agents and agents[label].get("running"):
            verified[f"agent_{name}"] = True
        else:
            verified[f"agent_{name}"] = False

    passed = sum(1 for v in verified.values() if v)
    total = len(verified)
    _log(f"  Verification: {passed}/{total} systems operational")

    # Sync to brain
    _supabase_post("brain_context", {
        "key": "orchestrator.last_cycle",
        "category": "system",
        "value": json.dumps({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "bottlenecks_found": len(bottlenecks),
            "verified": verified,
            "score": data.get("summary", {}).get("score", 0) if report_file.exists() else 0
        }),
        "priority": 8
    })

    _log("AUTONOMOUS CYCLE COMPLETE")
    _log("=" * 55)
    return verified

# ═══════════════════════════════════════════
#  MASTER BOOT SEQUENCE
# ═══════════════════════════════════════════

def boot_sequence():
    """Full cold-start boot sequence. Runs on Mac login.
    Brings the entire Fractal Brain online."""
    _log("*" * 55)
    _log("FRACTAL BRAIN BOOT SEQUENCE", "BOOT")
    _log("*" * 55)
    boot_start = time.time()
    results = {}

    # Phase 1: Verify environment
    _log("Phase 1: Environment check")
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    (BRAIN_DIR / "backups").mkdir(parents=True, exist_ok=True)
    if ENV_FILE.exists() and SUPABASE_URL and SUPABASE_KEY:
        _log("  ✓ Env configured")
        results["env"] = True
    else:
        _log("  ✗ Env missing or incomplete", "ERROR")
        results["env"] = False

    # Phase 2: Verify all tools exist and compile
    _log("Phase 2: Tool integrity check")
    required_tools = ["brain.py", "dashboard.py", "dashboard.html", "health_monitor.py",
                      "session_bootstrap.py", "auto_fix.py", "orchestrator.py",
                      "local_logger.py", "sync_to_brain.py", "brain_patch.py"]
    tools_ok = True
    for tool in required_tools:
        path = TOOLS_DIR / tool
        if not path.exists():
            _log(f"  ✗ Missing: {tool}", "ERROR")
            tools_ok = False
        elif tool.endswith(".py"):
            try:
                import py_compile
                py_compile.compile(str(path), doraise=True)
            except:
                _log(f"  ✗ Syntax error: {tool}", "ERROR")
                tools_ok = False
    results["tools"] = tools_ok
    _log(f"  {'✓' if tools_ok else '✗'} {len(required_tools)} tools checked")

    # Phase 3: Start Command Center
    _log("Phase 3: Starting Command Center")
    if is_running("dashboard.py"):
        _log("  Dashboard already running")
        results["dashboard"] = True
    else:
        start_process(
            f"nohup {sys.executable} {TOOLS_DIR / 'dashboard.py'} --no-open "
            f"< /dev/null > {LOGS_DIR / 'dashboard.log'} 2>&1 &")
        time.sleep(3)
        try:
            urllib.request.urlopen("http://localhost:3333/", timeout=5)
            _log("  ✓ Dashboard started on :3333")
            results["dashboard"] = True
        except:
            _log("  ✗ Dashboard failed to start", "ERROR")
            results["dashboard"] = False

    # Phase 4: Run initial health check
    _log("Phase 4: Initial health check")
    code, _ = run_cmd(f"{sys.executable} {TOOLS_DIR / 'health_monitor.py'} --quiet", timeout=60)
    results["health_check"] = (code == 0)
    _log(f"  {'✓' if code == 0 else '✗'} Health check {'passed' if code == 0 else 'failed'}")

    # Phase 5: Generate session brief
    _log("Phase 5: Generating session context brief")
    code, _ = run_cmd(f"{sys.executable} {TOOLS_DIR / 'session_bootstrap.py'}", timeout=30)
    results["session_brief"] = (code == 0)
    _log(f"  {'✓' if code == 0 else '✗'} Session brief generated")

    # Phase 6: Verify Supabase brain connection
    _log("Phase 6: Brain connection")
    try:
        url = f"{SUPABASE_URL}/rest/v1/agents?select=name&limit=3"
        req = urllib.request.Request(url, headers={
            "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
        with urllib.request.urlopen(req, timeout=10) as r:
            agents = json.loads(r.read())
            _log(f"  ✓ Brain connected — {len(agents)} agents sampled")
            results["brain"] = True
    except Exception as e:
        _log(f"  ✗ Brain unreachable: {e}", "ERROR")
        results["brain"] = False

    # Phase 7: Auto-fix any issues found
    _log("Phase 7: Auto-fix pass")
    report_file = BRAIN_DIR / "logs" / "health_report.json"
    if report_file.exists():
        try:
            data = json.loads(report_file.read_text())
            bns = data.get("bottlenecks", [])
            if bns:
                _log(f"  {len(bns)} bottlenecks found, running auto-fix...")
                run_cmd(f"{sys.executable} {TOOLS_DIR / 'auto_fix.py'}", timeout=60)
            else:
                _log("  No bottlenecks, system clean")
        except: pass
    results["autofix"] = True

    # Phase 8: Sync boot record to brain
    _log("Phase 8: Syncing boot record to brain")
    boot_time = round(time.time() - boot_start, 1)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    boot_record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "boot_time_seconds": boot_time,
        "checks_passed": passed,
        "checks_total": total,
        "results": results,
        "status": "healthy" if passed == total else "degraded"
    }
    _supabase_post("brain_context", {
        "key": "orchestrator.last_boot",
        "category": "system",
        "value": json.dumps(boot_record),
        "priority": 9
    })

    _log(f"\n  BOOT COMPLETE in {boot_time}s")
    _log(f"  {passed}/{total} systems online")
    _log(f"  Status: {'🟢 HEALTHY' if passed == total else '🟡 DEGRADED'}")
    _log(f"  Dashboard: http://localhost:3333")
    _log("*" * 55)

    return boot_record

# ═══════════════════════════════════════════
#  CLI
# ═══════════════════════════════════════════

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Fractal Brain Orchestrator")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("boot", help="Run full boot sequence")
    sub.add_parser("cycle", help="Run autonomous health/fix cycle")
    sub.add_parser("status", help="Show orchestrator status")

    p_kill = sub.add_parser("kill", help="Kill a process")
    p_kill.add_argument("target", help="Process name to kill")

    p_start = sub.add_parser("start", help="Start a process")
    p_start.add_argument("target", help="Command to run")

    p_restart = sub.add_parser("restart-app", help="Restart a macOS app")
    p_restart.add_argument("target", help="App name")

    p_agent = sub.add_parser("agent", help="Manage LaunchAgent")
    p_agent.add_argument("action", choices=["load", "unload", "reload", "list"])
    p_agent.add_argument("target", nargs="?", help="Agent short name")

    p_cmd = sub.add_parser("run", help="Run a shell command")
    p_cmd.add_argument("target", help="Command to execute")

    args = parser.parse_args()

    if args.cmd == "boot":
        boot_sequence()
    elif args.cmd == "cycle":
        autonomous_cycle()
    elif args.cmd == "status":
        agents = list_agents()
        dash = is_running("dashboard.py")
        print(f"Dashboard: {'🟢 running' if dash else '🔴 stopped'}")
        print(f"LaunchAgents:")
        for label, info in agents.items():
            status = '🟢 running' if info['running'] else '🔴 stopped'
            print(f"  {label}: {status} (pid:{info['pid']}, exit:{info['exit_code']})")
        # Recent actions
        try:
            db = _init_db()
            recent = db.execute("SELECT timestamp, action, target, result FROM actions ORDER BY id DESC LIMIT 5").fetchall()
            if recent:
                print(f"\nRecent actions:")
                for ts, act, tgt, res in recent:
                    print(f"  [{ts[:19]}] {act}: {tgt} -> {res[:60]}")
            db.close()
        except: pass
    elif args.cmd == "kill":
        kill_process(args.target)
    elif args.cmd == "start":
        start_process(args.target)
    elif args.cmd == "restart-app":
        restart_app(args.target)
    elif args.cmd == "agent":
        if args.action == "list":
            for label, info in list_agents().items():
                print(f"  {label}: {'running' if info['running'] else 'stopped'}")
        elif args.target:
            {"load": load_agent, "unload": unload_agent, "reload": reload_agent}[args.action](args.target)
        else:
            print("Specify an agent name. Available:", ", ".join(LAUNCH_AGENTS.keys()))
    elif args.cmd == "run":
        code, out = run_cmd(args.target)
        if out: print(out)
    else:
        parser.print_help()
