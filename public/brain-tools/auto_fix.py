#!/usr/bin/env python3
"""Fractal Brain Auto-Fix Engine — self-healing infrastructure.

Reads bottlenecks from health_monitor, applies automatic fixes
for known issue patterns, and logs all actions.
"""

import json, os, sys, subprocess, sqlite3, shutil
from pathlib import Path
from datetime import datetime, timezone

BRAIN_DIR = Path.home() / ".fractal_brain"
TOOLS_DIR = BRAIN_DIR / "tools"
LOG_FILE = BRAIN_DIR / "logs" / "auto_fix.log"
HEALTH_DB = BRAIN_DIR / "health.db"

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

# ── Fix Functions ──

def fix_dashboard_server():
    """Restart dashboard if it's down."""
    _log("AUTO-FIX: Restarting dashboard server...")
    subprocess.run(["pkill", "-f", "dashboard.py"], capture_output=True)
    import time; time.sleep(1)
    # Try LaunchAgent first
    uid = subprocess.check_output(["id", "-u"], text=True).strip()
    subprocess.run(["launchctl", "bootout", f"gui/{uid}/com.fractalbrain.dashboard"], capture_output=True)
    import time; time.sleep(1)
    result = subprocess.run(
        ["launchctl", "bootstrap", f"gui/{uid}",
         str(Path.home() / "Library/LaunchAgents/com.fractalbrain.dashboard.plist")],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        import time; time.sleep(3)
        # Verify
        import urllib.request
        try:
            urllib.request.urlopen("http://localhost:3333/", timeout=5)
            _log("  ✓ Dashboard restarted via LaunchAgent")
            return True
        except:
            pass
    # Fallback: direct launch
    subprocess.Popen(
        [sys.executable, str(TOOLS_DIR / "dashboard.py"), "--no-open"],
        stdout=open(BRAIN_DIR / "logs/dashboard.log", "a"),
        stderr=open(BRAIN_DIR / "logs/dashboard.err", "a"),
        stdin=subprocess.DEVNULL,
        start_new_session=True
    )
    import time; time.sleep(3)
    try:
        import urllib.request
        urllib.request.urlopen("http://localhost:3333/", timeout=5)
        _log("  ✓ Dashboard restarted via direct launch")
        return True
    except:
        _log("  ✗ Dashboard restart failed")
        return False

def fix_brain_symlink():
    """Recreate brain CLI symlink."""
    _log("AUTO-FIX: Recreating brain CLI symlink...")
    bin_dir = Path.home() / "bin"
    bin_dir.mkdir(exist_ok=True)
    link = bin_dir / "brain"
    target = TOOLS_DIR / "brain"
    if link.exists() or link.is_symlink():
        link.unlink()
    link.symlink_to(target)
    _log(f"  ✓ Symlink created: {link} -> {target}")
    return True

def fix_launchagent():
    """Re-register LaunchAgent."""
    _log("AUTO-FIX: Re-registering LaunchAgent...")
    plist = Path.home() / "Library/LaunchAgents/com.fractalbrain.dashboard.plist"
    if not plist.exists():
        _log("  ✗ Plist file missing, cannot fix")
        return False
    uid = subprocess.check_output(["id", "-u"], text=True).strip()
    subprocess.run(["launchctl", "bootout", f"gui/{uid}/com.fractalbrain.dashboard"], capture_output=True)
    import time; time.sleep(1)
    result = subprocess.run(["launchctl", "bootstrap", f"gui/{uid}", str(plist)], capture_output=True, text=True)
    if result.returncode == 0:
        _log("  ✓ LaunchAgent re-registered")
        return True
    _log(f"  ✗ LaunchAgent failed: {result.stderr}")
    return False

def fix_local_db():
    """Recreate local SQLite database if corrupted."""
    _log("AUTO-FIX: Rebuilding local database...")
    db_file = BRAIN_DIR / "local_brain.db"
    backup = BRAIN_DIR / f"local_brain.db.bak.{datetime.now().strftime('%Y%m%d%H%M%S')}"
    if db_file.exists():
        shutil.copy2(str(db_file), str(backup))
        _log(f"  Backed up to {backup}")
    try:
        # Import local_logger to rebuild schema
        sys.path.insert(0, str(TOOLS_DIR))
        import local_logger
        local_logger.init_db()
        _log("  ✓ Database rebuilt")
        return True
    except Exception as e:
        _log(f"  ✗ Rebuild failed: {e}")
        return False

def fix_env_config():
    """Create template .env if missing."""
    _log("AUTO-FIX: Creating .env template...")
    env = BRAIN_DIR / ".env"
    if env.exists():
        _log("  .env already exists, skipping")
        return True
    env.write_text("SUPABASE_URL=https://vpaynwebgmmnwttqkwmh.supabase.co\nSUPABASE_KEY=YOUR_SERVICE_ROLE_KEY_HERE\n")
    _log("  ✓ Template created — needs manual key entry")
    return False  # Needs human action

# ── Fix Router ──

FIX_MAP = {
    "dashboard_server": fix_dashboard_server,
    "brain_symlink": fix_brain_symlink,
    "launchagent": fix_launchagent,
    "local_brain.db": fix_local_db,
    "env_config": fix_env_config,
}

def run_auto_fixes(dry_run=False):
    """Read pending bottlenecks and apply fixes where possible."""
    _log("=" * 50)
    _log("AUTO-FIX ENGINE STARTING")
    _log("=" * 50)

    if not HEALTH_DB.exists():
        _log("No health database found. Run health_monitor.py first.")
        return {"fixed": 0, "failed": 0, "skipped": 0}

    db = sqlite3.connect(str(HEALTH_DB))
    pending = db.execute(
        "SELECT id, component, issue, severity FROM bottlenecks WHERE fix_status='pending' ORDER BY CASE severity WHEN 'critical' THEN 1 ELSE 2 END"
    ).fetchall()

    if not pending:
        _log("No pending bottlenecks. System healthy.")
        db.close()
        return {"fixed": 0, "failed": 0, "skipped": 0}

    _log(f"Found {len(pending)} pending bottlenecks")
    fixed = failed = skipped = 0

    for row_id, component, issue, severity in pending:
        if component in FIX_MAP:
            _log(f"\n→ Fixing: {component} ({severity})")
            _log(f"  Issue: {issue}")
            if dry_run:
                _log("  [DRY RUN] Would apply fix")
                skipped += 1
                continue
            try:
                success = FIX_MAP[component]()
                if success:
                    db.execute("UPDATE bottlenecks SET fix_status='fixed', resolved_at=? WHERE id=?",
                               (datetime.now(timezone.utc).isoformat(), row_id))
                    fixed += 1
                else:
                    db.execute("UPDATE bottlenecks SET fix_status='needs_human' WHERE id=?", (row_id,))
                    failed += 1
            except Exception as e:
                _log(f"  ✗ Exception: {e}")
                db.execute("UPDATE bottlenecks SET fix_status='error' WHERE id=?", (row_id,))
                failed += 1
        else:
            _log(f"\n⏭ Skipping: {component} (no auto-fix available)")
            skipped += 1

    db.commit()
    db.close()

    summary = {"fixed": fixed, "failed": failed, "skipped": skipped}
    _log(f"\nAUTO-FIX COMPLETE: {fixed} fixed, {failed} failed, {skipped} skipped")
    return summary


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Fractal Brain Auto-Fix Engine")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fixed without doing it")
    parser.add_argument("--fix", type=str, help="Fix a specific component by name")
    args = parser.parse_args()

    if args.fix:
        if args.fix in FIX_MAP:
            _log(f"Running targeted fix: {args.fix}")
            FIX_MAP[args.fix]()
        else:
            print(f"Unknown component: {args.fix}")
            print(f"Available: {', '.join(FIX_MAP.keys())}")
    else:
        run_auto_fixes(dry_run=args.dry_run)
