"""
local_logger.py
---------------
Local conversation / agent log storage backed by SQLite with JSONL append fallback.

Schema mirrors agent_logs Supabase table so records can be synced via sync_to_brain.py.

Usage:
    from local_logger import LocalLogger

    log = LocalLogger()
    run_id = log.start_run(agent="nova", trigger="scheduled", input_data={"task": "scan leads"})
    log.end_run(run_id, status="completed", output={"result": "ok"},
                tokens_used=6200, cost_usd=0.062, duration_ms=4500)

    # or log a simple event without a run lifecycle
    log.log_event(agent="nova", action="tool_call", level="info",
                  details={"tool": "brain_read_context"})
"""

import json
import os
import sqlite3
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

DEFAULT_DB_PATH = Path(os.environ.get("LOCAL_LOG_DB", "~/.fractal_brain/agent_logs.db")).expanduser()
DEFAULT_JSONL_PATH = Path(os.environ.get("LOCAL_LOG_JSONL", "~/.fractal_brain/agent_logs.jsonl")).expanduser()

# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS agent_logs (
    id              TEXT PRIMARY KEY,
    agent_name      TEXT,
    agent           TEXT,
    run_id          TEXT,
    status          TEXT,
    trigger         TEXT,
    input           TEXT,       -- JSON string
    output          TEXT,       -- JSON string
    error           TEXT,
    tokens_used     INTEGER,
    cost_usd        REAL,
    duration_ms     INTEGER,
    started_at      TEXT,       -- ISO-8601
    completed_at    TEXT,       -- ISO-8601
    action          TEXT,
    level           TEXT DEFAULT 'info',
    details         TEXT,       -- JSON string
    synced_to_notion INTEGER DEFAULT 0,
    notion_page_id  TEXT,
    created_at      TEXT        -- ISO-8601
);

CREATE TABLE IF NOT EXISTS todo_items (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    status          TEXT DEFAULT 'pending',
    priority        INTEGER DEFAULT 1,
    agent           TEXT,
    context         TEXT,
    created_at      TEXT,
    completed_at    TEXT,
    synced          INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sync_state (
    key   TEXT PRIMARY KEY,
    value TEXT
);

-- Index for efficient sync queries (only fetch unsynced rows)
CREATE INDEX IF NOT EXISTS idx_agent_logs_synced
    ON agent_logs (synced_to_notion, created_at);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent
    ON agent_logs (agent_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todos_status
    ON todo_items (status, priority DESC);
"""

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def _new_id() -> str:
    return str(uuid.uuid4())

def _json_or_none(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, str):
        return value
    return json.dumps(value)

# ---------------------------------------------------------------------------
# LocalLogger
# ---------------------------------------------------------------------------

class LocalLogger:
    """SQLite-backed agent log store with JSONL fallback."""

    def __init__(
        self,
        db_path: Path = DEFAULT_DB_PATH,
        jsonl_path: Path = DEFAULT_JSONL_PATH,
    ):
        self.db_path = Path(db_path).expanduser()
        self.jsonl_path = Path(jsonl_path).expanduser()
        self._ensure_dirs()
        self._conn = self._init_db()

    # ------------------------------------------------------------------
    # Lifecycle helpers
    # ------------------------------------------------------------------

    def _ensure_dirs(self):
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.jsonl_path.parent.mkdir(parents=True, exist_ok=True)

    def _init_db(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.executescript(SCHEMA_SQL)
        conn.commit()
        return conn

    def close(self):
        if self._conn:
            self._conn.close()

    # ------------------------------------------------------------------
    # Run lifecycle (start / end)
    # ------------------------------------------------------------------

    def start_run(
        self,
        agent: str,
        trigger: str = "manual",
        input_data: Any = None,
        run_id: Optional[str] = None,
    ) -> str:
        """
        Create a new run record and return its run_id.
        Call end_run() when the run finishes.
        """
        run_id = run_id or _new_id()
        row_id = _new_id()
        now = _now_iso()

        row = {
            "id": row_id,
            "agent_name": agent,
            "agent": agent,
            "run_id": run_id,
            "status": "running",
            "trigger": trigger,
            "input": _json_or_none(input_data),
            "output": None,
            "error": None,
            "tokens_used": 0,
            "cost_usd": 0.0,
            "duration_ms": 0,
            "started_at": now,
            "completed_at": None,
            "action": "run_start",
            "level": "info",
            "details": None,
            "synced_to_notion": 0,
            "notion_page_id": None,
            "created_at": now,
        }

        self._insert_row(row)
        return run_id

    def end_run(
        self,
        run_id: str,
        status: str = "completed",
        output: Any = None,
        error: Optional[str] = None,
        tokens_used: int = 0,
        cost_usd: float = 0.0,
        duration_ms: int = 0,
    ):
        """Update the run record created by start_run()."""
        now = _now_iso()
        self._conn.execute(
            """UPDATE agent_logs
               SET status=?, output=?, error=?, tokens_used=?, cost_usd=?,
                   duration_ms=?, completed_at=?, action='run_end'
               WHERE run_id=? AND action='run_start'""",
            (
                status,
                _json_or_none(output),
                error,
                tokens_used,
                cost_usd,
                duration_ms,
                now,
                run_id,
            ),
        )
        self._conn.commit()

    # ------------------------------------------------------------------
    # Simple event logging
    # ------------------------------------------------------------------

    def log_event(
        self,
        agent: str,
        action: str,
        level: str = "info",
        details: Any = None,
        status: str = "completed",
        tokens_used: int = 0,
        cost_usd: float = 0.0,
        run_id: Optional[str] = None,
        error: Optional[str] = None,
    ) -> str:
        """Log a single discrete event. Returns the row id."""
        row_id = _new_id()
        now = _now_iso()

        row = {
            "id": row_id,
            "agent_name": agent,
            "agent": agent,
            "run_id": run_id or _new_id(),
            "status": status,
            "trigger": "event",
            "input": None,
            "output": None,
            "error": error,
            "tokens_used": tokens_used,
            "cost_usd": cost_usd,
            "duration_ms": 0,
            "started_at": now,
            "completed_at": now,
            "action": action,
            "level": level,
            "details": _json_or_none(details),
            "synced_to_notion": 0,
            "notion_page_id": None,
            "created_at": now,
        }

        self._insert_row(row)
        return row_id

    # ------------------------------------------------------------------
    # Conversation log (Claude session storage)
    # ------------------------------------------------------------------

    def log_conversation(
        self,
        role: str,          # "user" | "assistant" | "tool"
        content: str,
        session_id: Optional[str] = None,
        tokens_used: int = 0,
        cost_usd: float = 0.0,
    ) -> str:
        """Persist a conversation turn."""
        return self.log_event(
            agent="claude",
            action="conversation_turn",
            level="info",
            details={"role": role, "content": content, "session_id": session_id},
            tokens_used=tokens_used,
            cost_usd=cost_usd,
        )

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    def get_unsynced(self, limit: int = 200):
        """Return rows not yet synced to Supabase / Notion."""
        cur = self._conn.execute(
            "SELECT * FROM agent_logs WHERE synced_to_notion=0 ORDER BY created_at ASC LIMIT ?",
            (limit,),
        )
        return [dict(row) for row in cur.fetchall()]

    def mark_synced(self, row_ids: list[str]):
        """Mark rows as synced after a successful push."""
        if not row_ids:
            return
        placeholders = ",".join("?" * len(row_ids))
        self._conn.execute(
            f"UPDATE agent_logs SET synced_to_notion=1 WHERE id IN ({placeholders})",
            row_ids,
        )
        self._conn.commit()

    def get_last_sync_cursor(self) -> Optional[str]:
        row = self._conn.execute(
            "SELECT value FROM sync_state WHERE key='last_synced_at'"
        ).fetchone()
        return row["value"] if row else None

    def set_last_sync_cursor(self, iso_ts: str):
        self._conn.execute(
            "INSERT OR REPLACE INTO sync_state (key, value) VALUES ('last_synced_at', ?)",
            (iso_ts,),
        )
        self._conn.commit()

    def recent(self, agent: Optional[str] = None, limit: int = 50):
        """Fetch recent log rows, optionally filtered by agent."""
        if agent:
            cur = self._conn.execute(
                "SELECT * FROM agent_logs WHERE agent_name=? ORDER BY created_at DESC LIMIT ?",
                (agent, limit),
            )
        else:
            cur = self._conn.execute(
                "SELECT * FROM agent_logs ORDER BY created_at DESC LIMIT ?",
                (limit,),
            )
        return [dict(row) for row in cur.fetchall()]

    # ------------------------------------------------------------------
    # Todo management
    # ------------------------------------------------------------------

    def add_todo(
        self,
        title: str,
        priority: int = 1,
        agent: Optional[str] = None,
        context: Optional[str] = None,
    ) -> str:
        """Add a todo item. Returns the todo ID."""
        todo_id = _new_id()[:8]
        now = _now_iso()
        self._conn.execute(
            "INSERT INTO todo_items (id, title, status, priority, agent, context, created_at) VALUES (?,?,?,?,?,?,?)",
            (todo_id, title, "pending", priority, agent, context, now),
        )
        self._conn.commit()
        return todo_id

    def list_todos(self, status: Optional[str] = None) -> list[dict]:
        """List todo items, optionally filtered by status."""
        if status:
            cur = self._conn.execute(
                "SELECT * FROM todo_items WHERE status=? ORDER BY priority DESC, created_at ASC",
                (status,),
            )
        else:
            cur = self._conn.execute(
                "SELECT * FROM todo_items ORDER BY status ASC, priority DESC, created_at ASC"
            )
        return [dict(row) for row in cur.fetchall()]

    def complete_todo(self, todo_id: str):
        """Mark a todo as done."""
        self._conn.execute(
            "UPDATE todo_items SET status='done', completed_at=? WHERE id LIKE ?",
            (_now_iso(), f"{todo_id}%"),
        )
        self._conn.commit()

    def update_todo_status(self, todo_id: str, status: str):
        """Update todo status (pending, in_progress, done)."""
        updates = "status=?"
        params = [status]
        if status == "done":
            updates += ", completed_at=?"
            params.append(_now_iso())
        params.append(f"{todo_id}%")
        self._conn.execute(
            f"UPDATE todo_items SET {updates} WHERE id LIKE ?", params
        )
        self._conn.commit()

    def clear_done_todos(self) -> int:
        """Remove completed todos. Returns count removed."""
        result = self._conn.execute("DELETE FROM todo_items WHERE status='done'")
        self._conn.commit()
        return result.rowcount

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _insert_row(self, row: dict):
        cols = list(row.keys())
        placeholders = ", ".join(["?"] * len(cols))
        col_str = ", ".join(cols)
        values = [row[c] for c in cols]

        try:
            self._conn.execute(
                f"INSERT INTO agent_logs ({col_str}) VALUES ({placeholders})",
                values,
            )
            self._conn.commit()
        except Exception as e:
            # Fallback: append to JSONL so we never lose data
            self._jsonl_append(row, error=str(e))

    def _jsonl_append(self, row: dict, error: Optional[str] = None):
        entry = {**row, "_write_error": error}
        try:
            with open(self.jsonl_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception:
            pass  # truly nothing we can do at this point


# ---------------------------------------------------------------------------
# CLI smoke-test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    log = LocalLogger(
        db_path=Path("/tmp/test_agent_logs.db"),
        jsonl_path=Path("/tmp/test_agent_logs.jsonl"),
    )

    rid = log.start_run(agent="nova", trigger="test", input_data={"task": "smoke test"})
    time.sleep(0.05)
    log.end_run(rid, status="completed", output={"ok": True}, tokens_used=100, cost_usd=0.001, duration_ms=50)

    log.log_event(agent="sage", action="tool_call", level="info", details={"tool": "brain_search_memory"})
    log.log_conversation(role="user", content="Hello!", session_id="test-session-1")

    rows = log.recent(limit=5)
    print(f"Stored {len(rows)} rows")
    for r in rows:
        print(f"  [{r['level']}] {r['agent_name']} / {r['action']} @ {r['created_at']}")

    unsynced = log.get_unsynced()
    print(f"Unsynced rows: {len(unsynced)}")
    log.close()
    print("✓ local_logger smoke test passed")
