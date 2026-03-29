#!/usr/bin/env python3
"""
fractal_mac_mcp — Fractal Brain Mac Link
Purpose-built MCP server for Sophia / Like One AI Studio.
Replaces Desktop Commander + Control Mac with one brain-aware tool.

Transport: stdio (runs as Claude subprocess)
Install: see README or run ./install.sh
"""

import json, os, sqlite3, subprocess, sys, textwrap, urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from mcp.server.fastmcp import FastMCP

# ── constants ──────────────────────────────────────────────────────────
BRAIN_DIR   = Path.home() / ".fractal_brain"
CLAUDE_MD   = BRAIN_DIR / "CLAUDE.md"
WORKSPACE   = Path.home() / "likeone-workspace"
ENV_FILE    = BRAIN_DIR / ".env"
REFRESH_PY  = BRAIN_DIR / "tools" / "refresh_claude_md.py"

mcp = FastMCP("fractal_mac_mcp")

# ── env + supabase ─────────────────────────────────────────────────────
def _load_env():
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())
_load_env()

SUPA_URL = os.environ.get("SUPABASE_URL", "")
SUPA_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

def _supa(path: str, default=None):
    if not SUPA_URL or not SUPA_KEY:
        return default or []
    try:
        req = urllib.request.Request(
            f"{SUPA_URL}/rest/v1/{path}",
            headers={"apikey": SUPA_KEY, "Authorization": f"Bearer {SUPA_KEY}", "Accept": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read())
    except:
        return default or []

def _safe_path(path: str) -> Path:
    """Expand ~ and resolve path safely."""
    return Path(os.path.expanduser(path)).resolve()

# ══════════════════════════════════════════════════════════════════════
# TOOL 1: mac_boot — THE session starter. Type "brain" → call this.
# ══════════════════════════════════════════════════════════════════════
@mcp.tool(
    name="mac_boot",
    annotations={"title": "Boot Fractal Brain Session", "readOnlyHint": True,
                 "destructiveHint": False, "idempotentHint": True, "openWorldHint": False}
)
async def mac_boot() -> str:
    """Boot a new Claude session with full Fractal Brain context.
    Call this FIRST when user types 'brain' or starts a new session.
    Returns: CLAUDE.md content + live brain status + pending tasks.
    No parameters needed. Takes ~1 second. Zero handoff docs required.
    """
    parts = []

    # 1. CLAUDE.md (auto-refreshed every 15min by LaunchAgent)
    if CLAUDE_MD.exists():
        age_min = (datetime.now().timestamp() - CLAUDE_MD.stat().st_mtime) / 60
        parts.append(CLAUDE_MD.read_text())
        if age_min > 20:
            parts.append(f"\n⚠️  CLAUDE.md is {age_min:.0f}min old — run mac_refresh_brain to update")
    else:
        parts.append("⚠️  CLAUDE.md missing — run mac_refresh_brain first")

    # 2. Live brain heartbeat
    ctx_rows = _supa("brain_context?key=eq.last_heartbeat&select=value,updated_at", [])
    if ctx_rows:
        parts.append(f"\n🧠 Brain heartbeat: {ctx_rows[0].get('updated_at','?')[:19]}")

    # 3. Any pending cross-computer tasks
    task_rows = _supa("brain_context?key=eq.computers.task_queue.pending&select=value", [])
    if task_rows:
        try:
            q = json.loads(task_rows[0]["value"]) if isinstance(task_rows[0]["value"], str) else task_rows[0]["value"]
            pending = [t for t in q.get("tasks", []) if t.get("status") not in ("done","completed")]
            if pending:
                parts.append(f"\n📋 {len(pending)} pending task(s) in queue:")
                for t in pending[:3]:
                    parts.append(f"  • [{t.get('id')}] {t.get('task','?')}")
        except:
            pass

    return "\n".join(parts)

# ══════════════════════════════════════════════════════════════════════
# TOOL 2: mac_refresh_brain — force-refresh CLAUDE.md from brain
# ══════════════════════════════════════════════════════════════════════
@mcp.tool(
    name="mac_refresh_brain",
    annotations={"title": "Refresh Brain Context", "readOnlyHint": False,
                 "destructiveHint": False, "idempotentHint": True, "openWorldHint": True}
)
async def mac_refresh_brain() -> str:
    """Force-refresh ~/.fractal_brain/CLAUDE.md from live Supabase brain data.
    Run this when CLAUDE.md feels stale or after major brain updates.
    Returns: refresh result + new CLAUDE.md content.
    """
    try:
        result = subprocess.run(
            [sys.executable, str(REFRESH_PY)],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            return f"✅ {result.stdout.strip()}\n\n{CLAUDE_MD.read_text()}"
        return f"🔴 Refresh failed: {result.stderr[:500]}"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 3: mac_read_file
# ══════════════════════════════════════════════════════════════════════
class ReadFileInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    path: str = Field(..., description="Absolute or ~ path to file (e.g. '~/likeone-workspace/code/app.py')")
    offset: Optional[int] = Field(default=0, description="Line offset to start reading from", ge=0)
    length: Optional[int] = Field(default=200, description="Max lines to read", ge=1, le=2000)

@mcp.tool(name="mac_read_file", annotations={"title": "Read File", "readOnlyHint": True, "destructiveHint": False})
async def mac_read_file(params: ReadFileInput) -> str:
    """Read a file from the Mac filesystem. Supports any text file.
    Returns: file content with line numbers. Use offset+length for large files.
    """
    try:
        p = _safe_path(params.path)
        lines = p.read_text(errors="replace").splitlines()
        total = len(lines)
        chunk = lines[params.offset: params.offset + params.length]
        numbered = "\n".join(f"{params.offset + i + 1:4d}│ {l}" for i, l in enumerate(chunk))
        return f"📄 {p} ({total} lines, showing {params.offset+1}–{params.offset+len(chunk)})\n\n{numbered}"
    except FileNotFoundError:
        return f"🔴 File not found: {params.path}"
    except Exception as e:
        return f"🔴 Error reading file: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 4: mac_write_file
# ══════════════════════════════════════════════════════════════════════
class WriteFileInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    path: str = Field(..., description="Absolute or ~ path to write to")
    content: str = Field(..., description="Content to write")
    mode: str = Field(default="rewrite", description="'rewrite' (default) or 'append'")

@mcp.tool(name="mac_write_file", annotations={"title": "Write File", "readOnlyHint": False, "destructiveHint": False})
async def mac_write_file(params: WriteFileInput) -> str:
    """Write or append content to a file on the Mac filesystem.
    Creates parent directories automatically. Mode: 'rewrite' or 'append'.
    Returns: confirmation with file path and size.
    """
    try:
        p = _safe_path(params.path)
        p.parent.mkdir(parents=True, exist_ok=True)
        mode = "a" if params.mode == "append" else "w"
        with open(p, mode, encoding="utf-8") as f:
            f.write(params.content)
        size = p.stat().st_size
        lines = len(params.content.splitlines())
        return f"✅ Written {lines} lines ({size:,} bytes) → {p}"
    except Exception as e:
        return f"🔴 Error writing file: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 5: mac_list_dir
# ══════════════════════════════════════════════════════════════════════
class ListDirInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    path: str = Field(default="~/likeone-workspace", description="Directory path to list")
    depth: int = Field(default=1, description="Recursion depth (1=direct contents, 2=one level deep)", ge=1, le=4)
    show_hidden: bool = Field(default=False, description="Show hidden files/dirs (starting with .)")

@mcp.tool(name="mac_list_dir", annotations={"title": "List Directory", "readOnlyHint": True, "destructiveHint": False})
async def mac_list_dir(params: ListDirInput) -> str:
    """List directory contents on the Mac filesystem.
    Returns: tree view with [DIR] and [FILE] prefixes and file sizes.
    """
    try:
        p = _safe_path(params.path)
        if not p.is_dir():
            return f"🔴 Not a directory: {params.path}"

        lines = [f"📁 {p}"]
        def _walk(d: Path, prefix: str, depth: int):
            if depth == 0: return
            try:
                items = sorted(d.iterdir(), key=lambda x: (x.is_file(), x.name))
                for item in items:
                    if not params.show_hidden and item.name.startswith("."): continue
                    if item.is_dir():
                        lines.append(f"{prefix}[DIR]  {item.name}/")
                        _walk(item, prefix + "  ", depth - 1)
                    else:
                        sz = item.stat().st_size
                        sz_str = f"{sz:,}B" if sz < 1024 else f"{sz//1024}KB" if sz < 1048576 else f"{sz//1048576}MB"
                        lines.append(f"{prefix}[FILE] {item.name} ({sz_str})")
            except PermissionError:
                lines.append(f"{prefix}[DENIED]")
        _walk(p, "  ", params.depth)
        return "\n".join(lines)
    except Exception as e:
        return f"🔴 Error listing dir: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 6: mac_run_command — shell execution
# ══════════════════════════════════════════════════════════════════════
class RunCommandInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    command: str = Field(..., description="Shell command to run (zsh). E.g. 'python3 script.py', 'ls -lah ~/Desktop'")
    cwd: str = Field(default="~/likeone-workspace", description="Working directory")
    timeout: int = Field(default=30, description="Timeout in seconds", ge=1, le=300)

@mcp.tool(name="mac_run_command", annotations={"title": "Run Shell Command", "readOnlyHint": False, "destructiveHint": False, "openWorldHint": True})
async def mac_run_command(params: RunCommandInput) -> str:
    """Run any shell command on Sophia's Mac via zsh.
    Returns: stdout + stderr + exit code. Use for scripts, git, brew, etc.
    """
    try:
        cwd = _safe_path(params.cwd) if params.cwd else Path.home()
        result = subprocess.run(
            params.command, shell=True, executable="/bin/zsh",
            capture_output=True, text=True, timeout=params.timeout,
            cwd=str(cwd), env={**os.environ, "HOME": str(Path.home()), "PATH": "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin"}
        )
        out = result.stdout.strip()
        err = result.stderr.strip()
        code = result.returncode
        icon = "✅" if code == 0 else "🔴"
        parts = [f"{icon} exit={code} | cwd={cwd}"]
        if out: parts.append(out)
        if err: parts.append(f"stderr: {err[:500]}")
        return "\n".join(parts)
    except subprocess.TimeoutExpired:
        return f"🔴 Command timed out after {params.timeout}s"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 7: mac_run_python — run Python inline or a script file
# ══════════════════════════════════════════════════════════════════════
class RunPythonInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    code: Optional[str] = Field(default=None, description="Python code to run inline (preferred for quick scripts)")
    script_path: Optional[str] = Field(default=None, description="Path to an existing .py file to run")
    args: str = Field(default="", description="Command-line arguments to pass to script")
    timeout: int = Field(default=60, description="Timeout in seconds", ge=1, le=300)

@mcp.tool(name="mac_run_python", annotations={"title": "Run Python", "readOnlyHint": False, "destructiveHint": False, "openWorldHint": True})
async def mac_run_python(params: RunPythonInput) -> str:
    """Run Python 3 code inline or execute a .py script on the Mac.
    Has access to all ~/.fractal_brain/ libs. Preferred over mac_run_command for Python work.
    Returns: stdout + stderr + exit code.
    """
    try:
        if params.code:
            tmp = Path("/tmp/_fractal_run.py")
            tmp.write_text(params.code)
            cmd = f"{sys.executable} /tmp/_fractal_run.py {params.args}"
        elif params.script_path:
            sp = _safe_path(params.script_path)
            cmd = f"{sys.executable} {sp} {params.args}"
        else:
            return "🔴 Provide either 'code' or 'script_path'"

        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True,
            timeout=params.timeout, cwd=str(BRAIN_DIR),
            env={**os.environ, "PYTHONPATH": str(BRAIN_DIR / "tools")}
        )
        out = result.stdout.strip()
        err = result.stderr.strip()
        icon = "✅" if result.returncode == 0 else "🔴"
        parts = [f"{icon} Python exit={result.returncode}"]
        if out: parts.append(out)
        if err: parts.append(f"stderr: {err[:800]}")
        return "\n".join(parts)
    except subprocess.TimeoutExpired:
        return f"🔴 Python timed out after {params.timeout}s"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 8: mac_search — Spotlight + glob search
# ══════════════════════════════════════════════════════════════════════
class SearchInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    query: str = Field(..., description="Search query — filename, content keyword, or glob pattern (e.g. '*.py', 'invoice', 'CLAUDE')")
    path: str = Field(default="~", description="Root path to search within")
    limit: int = Field(default=20, description="Max results", ge=1, le=100)

@mcp.tool(name="mac_search", annotations={"title": "Search Files", "readOnlyHint": True, "destructiveHint": False})
async def mac_search(params: SearchInput) -> str:
    """Search for files on the Mac using Spotlight (mdfind) or glob.
    Fast — Spotlight searches the full disk instantly.
    Returns: list of matching file paths.
    """
    try:
        root = _safe_path(params.path)
        if "*" in params.query or "?" in params.query:
            results = list(root.rglob(params.query))[:params.limit]
        else:
            cmd = f"mdfind -onlyin {root} '{params.query}'"
            r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
            results = [Path(l) for l in r.stdout.strip().splitlines() if l][:params.limit]

        if not results:
            return f"No results for '{params.query}' in {root}"
        lines = [f"🔍 {len(results)} result(s) for '{params.query}':"]
        for p in results:
            sz = p.stat().st_size if p.is_file() else 0
            tag = "[DIR]" if p.is_dir() else f"[{sz//1024}KB]" if sz > 1024 else f"[{sz}B]"
            lines.append(f"  {tag} {p}")
        return "\n".join(lines)
    except Exception as e:
        return f"🔴 Search error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 9: mac_open — open apps, files, or URLs
# ══════════════════════════════════════════════════════════════════════
class OpenInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    target: str = Field(..., description="What to open: app name ('Slack'), file path, or URL ('https://...')")

@mcp.tool(name="mac_open", annotations={"title": "Open App/File/URL", "readOnlyHint": False, "destructiveHint": False, "openWorldHint": True})
async def mac_open(params: OpenInput) -> str:
    """Open an app, file, or URL on the Mac using the 'open' command.
    Examples: 'Slack', 'Chrome', '~/Downloads/report.pdf', 'https://make.com'
    Returns: confirmation or error.
    """
    try:
        t = params.target
        if t.startswith("http") or t.startswith("www"):
            cmd = f"open '{t}'"
        elif "/" in t or t.startswith("~"):
            cmd = f"open '{_safe_path(t)}'"
        else:
            cmd = f"open -a '{t}'"
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        return f"✅ Opened: {params.target}" if r.returncode == 0 else f"🔴 Failed: {r.stderr.strip()}"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 10: mac_notify — Mac notification
# ══════════════════════════════════════════════════════════════════════
class NotifyInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification body text")
    sound: bool = Field(default=True, description="Play notification sound")

@mcp.tool(name="mac_notify", annotations={"title": "Mac Notification", "readOnlyHint": False, "destructiveHint": False})
async def mac_notify(params: NotifyInput) -> str:
    """Send a macOS notification to Sophia's screen.
    Use for: task completion alerts, reminders, status updates.
    Returns: confirmation.
    """
    try:
        sound_str = 'sound name "default"' if params.sound else ""
        script = f'display notification "{params.message}" with title "{params.title}" {sound_str}'
        r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=5)
        return f"✅ Notification sent: {params.title}" if r.returncode == 0 else f"🔴 {r.stderr}"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 11: mac_clipboard — read/write clipboard
# ══════════════════════════════════════════════════════════════════════
class ClipboardInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    action: str = Field(..., description="'get' to read clipboard, 'set' to write to clipboard")
    text: Optional[str] = Field(default=None, description="Text to set (required when action='set')")

@mcp.tool(name="mac_clipboard", annotations={"title": "Clipboard Read/Write", "readOnlyHint": False, "destructiveHint": False})
async def mac_clipboard(params: ClipboardInput) -> str:
    """Read from or write to the Mac clipboard.
    action='get': returns current clipboard contents.
    action='set': copies text to clipboard (ready to paste anywhere).
    """
    try:
        if params.action == "get":
            r = subprocess.run("pbpaste", capture_output=True, text=True, timeout=5)
            content = r.stdout
            return f"📋 Clipboard ({len(content)} chars):\n{content[:2000]}"
        elif params.action == "set":
            if not params.text:
                return "🔴 'text' required for action='set'"
            subprocess.run("pbcopy", input=params.text, text=True, timeout=5)
            return f"✅ Copied to clipboard ({len(params.text)} chars)"
        return "🔴 action must be 'get' or 'set'"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 12: mac_screenshot — capture screen or window
# ══════════════════════════════════════════════════════════════════════
class ScreenshotInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    target: str = Field(default="screen", description="'screen' (full), 'window' (frontmost window), or app name to focus first")
    save_path: Optional[str] = Field(default=None, description="Where to save (default: ~/likeone-workspace/outputs/screenshot_TIMESTAMP.png)")

@mcp.tool(name="mac_screenshot", annotations={"title": "Take Screenshot", "readOnlyHint": True, "destructiveHint": False})
async def mac_screenshot(params: ScreenshotInput) -> str:
    """Capture the Mac screen or active window as a PNG.
    Returns: path to saved screenshot file.
    Use for: checking UI, capturing output, debugging visual issues.
    """
    try:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        out = _safe_path(params.save_path) if params.save_path else WORKSPACE / "outputs" / f"screenshot_{ts}.png"
        out.parent.mkdir(parents=True, exist_ok=True)

        if params.target == "window":
            cmd = f"screencapture -w '{out}'"
        elif params.target != "screen":
            # focus app first, then grab screen
            subprocess.run(f"osascript -e 'tell application \"{params.target}\" to activate'",
                           shell=True, timeout=3)
            import time; __import__('time').sleep(0.5)
            cmd = f"screencapture -x '{out}'"
        else:
            cmd = f"screencapture -x '{out}'"

        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=15)
        if out.exists():
            sz = out.stat().st_size // 1024
            return f"📸 Screenshot saved: {out} ({sz}KB)"
        return f"🔴 Screenshot failed: {r.stderr}"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 13: mac_screen_record — start/stop screen recording
# ══════════════════════════════════════════════════════════════════════
class ScreenRecordInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    action: str = Field(..., description="'start' to begin recording, 'stop' to end and save")
    duration: Optional[int] = Field(default=None, description="Auto-stop after N seconds (optional, used with 'start')")
    save_path: Optional[str] = Field(default=None, description="Output .mov path (default: ~/likeone-workspace/outputs/recording_TIMESTAMP.mov)")

@mcp.tool(name="mac_screen_record", annotations={"title": "Screen Recording", "readOnlyHint": False, "destructiveHint": False})
async def mac_screen_record(params: ScreenRecordInput) -> str:
    """Start or stop screen recording on the Mac.
    action='start': begins recording (runs in background).
    action='stop': kills recorder and saves the file.
    Returns: file path when stopped, or confirmation when started.
    """
    try:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        pid_file = BRAIN_DIR / "logs" / ".screen_record.pid"
        out_file_default = WORKSPACE / "outputs" / f"recording_{ts}.mov"
        out_path_file = BRAIN_DIR / "logs" / ".screen_record.path"

        if params.action == "start":
            out = _safe_path(params.save_path) if params.save_path else out_file_default
            out.parent.mkdir(parents=True, exist_ok=True)
            cmd = f"screencapture -v '{out}'"
            if params.duration:
                cmd = f"screencapture -V {params.duration} '{out}'"
            proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            pid_file.write_text(str(proc.pid))
            out_path_file.write_text(str(out))
            return f"⏺️  Recording started (PID {proc.pid}) → {out}"

        elif params.action == "stop":
            if pid_file.exists():
                pid = int(pid_file.read_text().strip())
                out = out_path_file.read_text().strip() if out_path_file.exists() else "unknown"
                subprocess.run(f"kill -SIGINT {pid}", shell=True)
                pid_file.unlink(missing_ok=True)
                out_path_file.unlink(missing_ok=True)
                import time; time.sleep(1)
                return f"⏹️  Recording stopped → {out}"
            # fallback: kill all screencapture
            subprocess.run("pkill -SIGINT screencapture", shell=True)
            return "⏹️  Recording stopped (no PID file, sent SIGINT to screencapture)"
        return "🔴 action must be 'start' or 'stop'"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 14: mac_app_control — open, close, focus, list running apps
# ══════════════════════════════════════════════════════════════════════
class AppControlInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    action: str = Field(..., description="'open', 'close', 'quit', 'focus', 'list', 'hide'")
    app: Optional[str] = Field(default=None, description="App name (e.g. 'Slack', 'Chrome', 'Terminal'). Not needed for 'list'.")
    force: bool = Field(default=False, description="Force quit without save prompt (for 'quit'/'close')")

@mcp.tool(name="mac_app_control", annotations={"title": "App Control", "readOnlyHint": False, "destructiveHint": False, "openWorldHint": True})
async def mac_app_control(params: AppControlInput) -> str:
    """Open, close, focus, hide, or list running apps on the Mac.
    action='list': shows all running apps.
    action='open': launches an app.
    action='close'/'quit': closes an app gracefully (or force=True to force quit).
    action='focus': brings app to foreground.
    action='hide': hides app window.
    """
    try:
        if params.action == "list":
            script = 'tell application "System Events" to get name of every process whose background only is false'
            r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=10)
            apps = r.stdout.strip().replace(", ", "\n  • ")
            return f"🖥️  Running apps:\n  • {apps}"

        if not params.app:
            return "🔴 'app' is required for this action"

        if params.action == "open":
            r = subprocess.run(f"open -a '{params.app}'", shell=True, capture_output=True, text=True, timeout=10)
            return f"✅ Opened {params.app}" if r.returncode == 0 else f"🔴 {r.stderr}"

        elif params.action in ("close", "quit"):
            if params.force:
                r = subprocess.run(f"killall '{params.app}'", shell=True, capture_output=True, text=True, timeout=10)
            else:
                script = f'tell application "{params.app}" to quit'
                r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=10)
            return f"✅ Closed {params.app}" if r.returncode == 0 else f"🔴 {r.stderr.strip() or 'App may not be running'}"

        elif params.action == "focus":
            script = f'tell application "{params.app}" to activate'
            r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=5)
            return f"✅ Focused {params.app}" if r.returncode == 0 else f"🔴 {r.stderr}"

        elif params.action == "hide":
            script = f'tell application "System Events" to set visible of process "{params.app}" to false'
            r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=5)
            return f"✅ Hidden {params.app}" if r.returncode == 0 else f"🔴 {r.stderr}"

        return f"🔴 Unknown action: {params.action}"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 15: mac_system — power control (restart, shutdown, sleep, lock)
# ══════════════════════════════════════════════════════════════════════
class SystemInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    action: str = Field(..., description="'restart', 'shutdown', 'sleep', 'lock', 'logout', 'volume_set', 'volume_get', 'uptime'")
    value: Optional[str] = Field(default=None, description="For volume_set: 0-100. For others: not needed.")
    confirm: bool = Field(default=False, description="Must be True for restart/shutdown/logout (safety gate)")

@mcp.tool(name="mac_system", annotations={"title": "System Control", "readOnlyHint": False, "destructiveHint": True, "idempotentHint": False})
async def mac_system(params: SystemInput) -> str:
    """Full system control: restart, shutdown, sleep, lock screen, volume, uptime.
    SAFETY: restart/shutdown/logout require confirm=True to prevent accidents.
    Returns: confirmation or current state.
    """
    try:
        action = params.action.lower()

        if action == "uptime":
            r = subprocess.run("uptime", capture_output=True, text=True)
            return f"⏱️ {r.stdout.strip()}"

        if action == "volume_get":
            r = subprocess.run("osascript -e 'output volume of (get volume settings)'",
                               shell=True, capture_output=True, text=True)
            return f"🔊 Volume: {r.stdout.strip()}%"

        if action == "volume_set":
            if not params.value:
                return "🔴 Provide value (0-100) for volume_set"
            r = subprocess.run(f"osascript -e 'set volume output volume {params.value}'",
                               shell=True, capture_output=True, text=True)
            return f"✅ Volume set to {params.value}%" if r.returncode == 0 else f"🔴 {r.stderr}"

        if action == "sleep":
            subprocess.run("pmset sleepnow", shell=True)
            return "✅ Sleep triggered"

        if action == "lock":
            subprocess.run("osascript -e 'tell application \"System Events\" to keystroke \"q\" using {command down, control down}'", shell=True)
            return "✅ Screen locked"

        # Destructive actions — require confirm=True
        if not params.confirm:
            return f"🔴 Safety gate: set confirm=True to execute '{action}'"

        if action == "restart":
            subprocess.run("osascript -e 'tell application \"System Events\" to restart'", shell=True)
            return "🔁 Restart initiated"
        elif action == "shutdown":
            subprocess.run("osascript -e 'tell application \"System Events\" to shut down'", shell=True)
            return "⏻ Shutdown initiated"
        elif action == "logout":
            subprocess.run("osascript -e 'tell application \"System Events\" to log out'", shell=True)
            return "✅ Logout initiated"

        return f"🔴 Unknown action: {action}. Options: restart, shutdown, sleep, lock, logout, volume_set, volume_get, uptime"
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# TOOL 16: mac_brain_context — quick brain context lookup
# ══════════════════════════════════════════════════════════════════════
class BrainContextInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    key: Optional[str] = Field(default=None, description="Exact brain context key (e.g. 'products.catalog_v2')")
    category: Optional[str] = Field(default=None, description="Filter by category (e.g. 'directive', 'system', 'revenue')")
    search: Optional[str] = Field(default=None, description="Full-text search across key/description/value")
    limit: int = Field(default=10, description="Max entries", ge=1, le=50)

@mcp.tool(name="mac_brain_context", annotations={"title": "Read Brain Context", "readOnlyHint": True, "destructiveHint": False, "openWorldHint": True})
async def mac_brain_context(params: BrainContextInput) -> str:
    """Read entries from the Fractal Brain Supabase context store.
    Faster than switching to brain MCP for simple lookups.
    Returns: key/value context entries as compact JSON.
    """
    try:
        q = "brain_context?select=key,category,description,value,priority,updated_at"
        filters = []
        if params.key:      filters.append(f"key=eq.{params.key}")
        if params.category: filters.append(f"category=eq.{params.category}")
        filters.append(f"limit={params.limit}")
        if filters: q += "&" + "&".join(filters)

        rows = _supa(q, [])
        if not rows:
            return f"No brain context found for query"

        lines = [f"🧠 Brain context ({len(rows)} entries):"]
        for r in rows:
            val = r.get("value","")
            val_preview = (val[:150] + "…") if isinstance(val, str) and len(val) > 150 else val
            lines.append(f"\n[{r.get('priority','?')}] {r.get('key')} ({r.get('category')})")
            lines.append(f"  {r.get('description','')}")
            lines.append(f"  → {val_preview}")
        return "\n".join(lines)
    except Exception as e:
        return f"🔴 Error: {e}"

# ══════════════════════════════════════════════════════════════════════
# ENTRYPOINT
# ══════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    mcp.run()
