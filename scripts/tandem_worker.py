#!/usr/bin/env python3
"""
Like One Tandem Worker — Zero-token task execution between M3 and M4.

Polls task_queue table in Supabase. Executes shell commands directly.
Only invokes Claude CLI for tasks explicitly marked as needing reasoning.

Usage: python3 ~/.fractal_brain/tandem_worker.py
Env: SUPABASE_URL, SUPABASE_KEY (service role) from ~/.fractal_brain/.env
"""

import json
import logging
import os
import platform
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# ── Config ──
POLL_INTERVAL = 30  # seconds
MACHINE_ID = os.environ.get("MACHINE_ID", "")

# RAM limits per machine (from brain computers.registry)
RAM_LIMITS = {
    "m3-forge": {"total_gb": 64, "safe_gb": 36},
    "m4-mirror": {"total_gb": 48, "safe_gb": 24},
}
ENV_FILE = Path.home() / ".fractal_brain" / ".env"
LOG_DIR = Path.home() / ".fractal_brain" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(LOG_DIR / "tandem_worker.log"),
    ],
)
log = logging.getLogger("tandem")

# ── Auto-detect machine ID ──
def detect_machine():
    hostname = platform.node().lower()
    if "pro-2" in hostname or "m4" in hostname:
        return "m4-mirror"
    return "m3-forge"

if not MACHINE_ID:
    MACHINE_ID = detect_machine()

# ── Load env ──
def load_env():
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

load_env()
SUPA_URL = os.environ.get("SUPABASE_URL", "")
SUPA_KEY = os.environ.get("SUPABASE_KEY", "")

if not SUPA_URL or not SUPA_KEY:
    log.error("SUPABASE_URL and SUPABASE_KEY required in ~/.fractal_brain/.env")
    sys.exit(1)

# ── Supabase helpers ──
import urllib.request
import urllib.error

def supa_request(method, path, body=None):
    url = f"{SUPA_URL}/rest/v1/{path}"
    headers = {
        "apikey": SUPA_KEY,
        "Authorization": f"Bearer {SUPA_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        log.error(f"Supabase {method} {path}: {e.code} {e.read().decode()[:200]}")
        return None
    except Exception as e:
        log.error(f"Supabase {method} {path}: {e}")
        return None

def get_pending_tasks():
    """Get pending tasks for this machine."""
    path = f"task_queue?target_machine=eq.{MACHINE_ID}&status=eq.pending&order=priority.desc,created_at.asc&limit=5"
    return supa_request("GET", path) or []

def claim_task(task_id):
    """Atomically claim a task."""
    path = f"task_queue?task_id=eq.{task_id}&status=eq.pending"
    body = {
        "status": "claimed",
        "claimed_by": MACHINE_ID,
        "claimed_at": datetime.now(timezone.utc).isoformat(),
    }
    result = supa_request("PATCH", path, body)
    return result and len(result) > 0

def reroute_task(task_id, new_target, reason=""):
    """Re-route a task to a different machine."""
    path = f"task_queue?task_id=eq.{task_id}"
    body = {
        "target_machine": new_target,
        "status": "pending",
        "claimed_by": None,
        "claimed_at": None,
        "result": {"rerouted_from": MACHINE_ID, "reason": reason},
    }
    supa_request("PATCH", path, body)
    log.info(f"  ↗️ Re-routed {task_id} → {new_target}")

def update_task(task_id, status, result=None, error=None):
    """Update task status."""
    path = f"task_queue?task_id=eq.{task_id}"
    body = {"status": status}
    if status == "running":
        pass
    if status in ("complete", "failed"):
        body["completed_at"] = datetime.now(timezone.utc).isoformat()
    if result:
        body["result"] = result
    if error:
        body["error"] = error[:2000]
    supa_request("PATCH", path, body)

def write_heartbeat():
    """Write heartbeat to brain_context."""
    path = "brain_context?on_conflict=key"
    body = {
        "key": f"heartbeat.{MACHINE_ID}",
        "category": "infrastructure",
        "description": f"Tandem worker heartbeat — {MACHINE_ID}",
        "value": json.dumps({
            "machine": MACHINE_ID,
            "status": "alive",
            "last_seen": datetime.now(timezone.utc).isoformat(),
            "hostname": platform.node(),
            "python": sys.version.split()[0],
            "ram_available_gb": get_available_ram_gb(),
            "ram_total_gb": RAM_LIMITS.get(MACHINE_ID, {}).get("total_gb", "unknown"),
            "ram_safe_gb": RAM_LIMITS.get(MACHINE_ID, {}).get("safe_gb", "unknown"),
        }),
        "priority": 2,
    }
    headers = {
        "apikey": SUPA_KEY,
        "Authorization": f"Bearer {SUPA_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{SUPA_URL}/rest/v1/brain_context",
        data=data, headers=headers, method="POST"
    )
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        log.warning(f"Heartbeat failed: {e}")

# ── RAM awareness ──
def get_available_ram_gb():
    """Get available RAM in GB using macOS vm_stat."""
    try:
        result = subprocess.run(["vm_stat"], capture_output=True, text=True, timeout=5)
        lines = result.stdout.splitlines()
        page_size = 16384  # Apple Silicon default
        free = spec = inactive = 0
        for line in lines:
            if "page size" in line.lower():
                page_size = int(''.join(c for c in line.split()[-1] if c.isdigit()))
            elif "Pages free" in line:
                free = int(line.split(":")[1].strip().rstrip("."))
            elif "Pages speculative" in line:
                spec = int(line.split(":")[1].strip().rstrip("."))
            elif "Pages inactive" in line:
                inactive = int(line.split(":")[1].strip().rstrip("."))
        available = (free + spec + inactive) * page_size / (1024 ** 3)
        return round(available, 1)
    except Exception:
        return -1  # unknown

def check_ram_for_task(task):
    """Check if there's enough RAM for a task. Returns (ok, available_gb, required_gb)."""
    payload = task.get("payload", {})
    required_gb = payload.get("ram_gb", 0)  # task can declare RAM need
    if required_gb == 0:
        return True, 0, 0  # no requirement specified

    available = get_available_ram_gb()
    limits = RAM_LIMITS.get(MACHINE_ID, {"safe_gb": 16})
    safe_limit = limits["safe_gb"]

    if available < 0:
        log.warning(f"  RAM check: unknown available memory, proceeding anyway")
        return True, -1, required_gb

    if available < required_gb:
        log.warning(f"  RAM check: {available}GB available < {required_gb}GB required. Skipping.")
        return False, available, required_gb

    if available < safe_limit * 0.3:  # less than 30% of safe limit
        log.warning(f"  RAM check: {available}GB available, below 30% of {safe_limit}GB safe limit. Deferring.")
        return False, available, required_gb

    return True, available, required_gb


# ── Task execution ──
def execute_task(task):
    """Execute a task. Shell commands directly. Claude only if explicitly requested."""
    task_id = task["task_id"]
    payload = task.get("payload", {})
    title = task.get("title", "")
    description = task.get("description", "")

    log.info(f"▶ Executing: {task_id} — {title}")

    # RAM-aware routing — never skip, always re-route or defer
    ram_ok, available, required = check_ram_for_task(task)
    if not ram_ok:
        # Try re-routing to the other machine
        other = "m4-mirror" if MACHINE_ID == "m3-forge" else "m3-forge"
        other_limits = RAM_LIMITS.get(other, {})
        if required <= other_limits.get("safe_gb", 0):
            log.info(f"  RAM: {available}GB available < {required}GB needed. Re-routing to {other}.")
            reroute_task(task_id, other, f"Re-routed: {MACHINE_ID} has {available}GB, needs {required}GB")
            return False
        else:
            # Neither machine can handle it right now — defer with retry
            log.info(f"  RAM: {available}GB available < {required}GB needed. No machine has capacity. Deferring 5min.")
            update_task(task_id, "pending", result={
                "deferred": True,
                "retry_after": (datetime.now(timezone.utc).timestamp() + 300),
                "reason": f"Both machines low on RAM. {MACHINE_ID}: {available}GB, needs {required}GB",
            })
            return False

    update_task(task_id, "running")

    # Check if task has explicit shell commands
    commands = payload.get("commands", [])
    if commands:
        return execute_shell_commands(task_id, commands)

    # Check if task type is "shell" — run description as script
    if payload.get("type") == "shell":
        return execute_shell_commands(task_id, [description])

    # Check if task explicitly needs Claude
    if payload.get("needs_claude", False):
        return execute_with_claude(task_id, title, description, payload)

    # Default: try to parse description for actionable shell commands
    # If it looks like instructions, wrap in a shell script
    log.info(f"  Task has no explicit commands and doesn't need Claude. Marking for manual review.")
    update_task(task_id, "pending", result={"note": "No executable commands. Add 'commands' to payload or set needs_claude=true."})
    return False

def execute_shell_commands(task_id, commands):
    """Run shell commands sequentially. Zero Claude tokens."""
    results = []
    for i, cmd in enumerate(commands):
        log.info(f"  [{i+1}/{len(commands)}] {cmd[:80]}...")
        try:
            result = subprocess.run(
                cmd, shell=True, capture_output=True, text=True,
                timeout=300, cwd=str(Path.home()),
                env={**os.environ, "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"},
            )
            results.append({
                "command": cmd[:200],
                "exit_code": result.returncode,
                "stdout": result.stdout[:2000] if result.stdout else "",
                "stderr": result.stderr[:1000] if result.stderr else "",
            })
            if result.returncode != 0:
                log.warning(f"  Command failed (exit {result.returncode})")
        except subprocess.TimeoutExpired:
            results.append({"command": cmd[:200], "error": "timeout"})
            update_task(task_id, "failed", result={"steps": results}, error=f"Command timed out: {cmd[:100]}")
            return False
        except Exception as e:
            results.append({"command": cmd[:200], "error": str(e)[:200]})
            update_task(task_id, "failed", result={"steps": results}, error=str(e)[:200])
            return False

    all_ok = all(r.get("exit_code", 1) == 0 for r in results)
    status = "complete" if all_ok else "failed"
    update_task(task_id, status, result={"steps": results})
    log.info(f"  {'✅' if all_ok else '❌'} {task_id}: {len(results)} commands, status={status}")
    return all_ok

def execute_with_claude(task_id, title, description, payload):
    """Run task via Claude CLI. Uses tokens — only for reasoning tasks."""
    claude_path = "/opt/homebrew/bin/claude"
    if not os.path.exists(claude_path):
        update_task(task_id, "failed", error="Claude CLI not found at /opt/homebrew/bin/claude")
        return False

    prompt = f"TASK: {title}\n\n{description}\n\nContext: {json.dumps(payload, indent=2)[:1000]}"
    log.info(f"  🧠 Invoking Claude CLI (will use tokens)...")

    try:
        result = subprocess.run(
            [claude_path, "--print", "-p", prompt],
            capture_output=True, text=True, timeout=600,
            cwd=str(Path.home()),
        )
        output = result.stdout[:10000] if result.stdout else "No output"
        if result.returncode == 0:
            update_task(task_id, "complete", result={"output": output})
            log.info(f"  ✅ Claude completed")
            return True
        else:
            update_task(task_id, "failed", result={"output": output}, error=result.stderr[:500])
            return False
    except subprocess.TimeoutExpired:
        update_task(task_id, "failed", error="Claude CLI timeout (600s)")
        return False

# ── Main loop ──
def main():
    log.info(f"🤖 Tandem Worker starting — machine: {MACHINE_ID}")
    log.info(f"   Polling: {SUPA_URL} every {POLL_INTERVAL}s")
    log.info(f"   Token policy: shell commands by default, Claude only when explicitly requested")

    heartbeat_interval = 300  # 5 min
    last_heartbeat = 0

    while True:
        try:
            # Heartbeat
            if time.time() - last_heartbeat > heartbeat_interval:
                write_heartbeat()
                last_heartbeat = time.time()

            # Poll for tasks
            tasks = get_pending_tasks()
            if tasks:
                log.info(f"📋 {len(tasks)} pending task(s)")
                for task in tasks:
                    task_id = task["task_id"]
                    if claim_task(task_id):
                        log.info(f"🔒 Claimed: {task_id}")
                        execute_task(task)
                    else:
                        log.info(f"  {task_id}: already claimed by another worker")

            time.sleep(POLL_INTERVAL)

        except KeyboardInterrupt:
            log.info("Shutting down tandem worker")
            break
        except Exception as e:
            log.error(f"Loop error: {e}")
            time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
