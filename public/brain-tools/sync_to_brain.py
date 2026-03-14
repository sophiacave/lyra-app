"""
sync_to_brain.py
----------------
Standalone script to sync local SQLite agent logs to Supabase brain.
Runs independently — zero dependency on Claude or MCP runtime.

Requirements:
    pip install requests python-dotenv

    Or optionally: pip install supabase

Environment variables (set in shell or .env file):
    SUPABASE_URL   — e.g. https://xxxx.supabase.co
    SUPABASE_KEY   — service role key (NOT anon key — needs INSERT access)
    LOCAL_LOG_DB   — optional override for SQLite path
    LOCAL_LOG_JSONL — optional override for JSONL fallback path

Usage:
    python sync_to_brain.py              # sync up to 200 unsynced rows
    python sync_to_brain.py --limit 500  # sync up to 500 rows
    python sync_to_brain.py --dry-run    # show what would sync, don't write
    python sync_to_brain.py --verbose    # print each row synced
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
# ---------------------------------------------------------------------------
# Bootstrap: try to load .env from common locations
# ---------------------------------------------------------------------------
try:
    from dotenv import load_dotenv
    for candidate in [Path(".env"), Path("~/.fractal_brain/.env").expanduser()]:
        if candidate.exists():
            load_dotenv(candidate)
            break
except ImportError:
    pass  # python-dotenv not installed; rely on shell env

# ---------------------------------------------------------------------------
# Import local_logger — look next to this script first, then sys.path
# ---------------------------------------------------------------------------
_script_dir = Path(__file__).parent
sys.path.insert(0, str(_script_dir))

try:
    from local_logger import LocalLogger
except ImportError as e:
    print(f"[sync_to_brain] ERROR: cannot import LocalLogger: {e}")
    print("  Make sure local_logger.py is in the same directory as this script.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Supabase REST helpers (raw requests — no supabase-py dependency required)
# ---------------------------------------------------------------------------
def _get_supabase_creds() -> tuple[str, str]:
    url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_KEY", "")
    if not url or not key:
        print("[sync_to_brain] ERROR: SUPABASE_URL and SUPABASE_KEY must be set.")
        print("  Export them in your shell or put them in ~/.fractal_brain/.env")
        sys.exit(1)
    return url, key


def _headers(key: str) -> dict:
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


def _supabase_insert_batch(url: str, key: str, table: str, rows: list[dict], verbose: bool = False) -> tuple[bool, str]:
    """
    POST a batch of rows to a Supabase table via REST API.
    Returns (success, error_message).
    """
    import urllib.request
    import urllib.error

    endpoint = f"{url}/rest/v1/{table}"
    payload = json.dumps(rows).encode("utf-8")
    headers = _headers(key)
    headers["Prefer"] = "return=minimal,resolution=ignore-duplicates"
    req = urllib.request.Request(endpoint, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            if verbose:
                print(f"  [supabase] POST {len(rows)} rows → {resp.status}")
            return True, ""
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return False, f"HTTP {e.code}: {body}"
    except Exception as e:
        return False, str(e)


# ---------------------------------------------------------------------------
# Row preparation — clean up SQLite row for Supabase insertion
# ---------------------------------------------------------------------------

def _prepare_row(row: dict) -> dict:
    """
    Convert a local SQLite row to a Supabase-compatible dict.
    - Remove local-only tracking fields
    - Parse JSON strings back to objects for JSONB columns
    - Remove None values (let Supabase use column defaults)
    """
    # Columns that are JSONB in Supabase — parse string → object
    jsonb_cols = {"input", "output", "details"}

    prepared = {}
    skip_cols = {"synced_to_notion"}  # local-only, not in Supabase schema

    for col, val in row.items():
        if col in skip_cols:
            continue
        if val is None:
            continue  # skip nulls; let Supabase use defaults        if col in jsonb_cols and isinstance(val, str):
            try:
                val = json.loads(val)
            except (json.JSONDecodeError, TypeError):
                pass  # leave as string if parse fails
        prepared[col] = val

    return prepared


# ---------------------------------------------------------------------------
# JSONL fallback sync
# ---------------------------------------------------------------------------

def _sync_jsonl_rows(url: str, key: str, jsonl_path: Path, verbose: bool, dry_run: bool) -> int:
    """
    Attempt to sync any rows that ended up in the JSONL fallback file.
    On success, renames the file to .synced-<timestamp> to avoid double-syncing.
    Returns number of rows synced.
    """
    if not jsonl_path.exists():
        return 0

    rows = []
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
                row.pop("_write_error", None)
                rows.append(_prepare_row(row))
            except json.JSONDecodeError:
                continue
    if not rows:
        return 0

    if dry_run:
        print(f"  [dry-run] JSONL: would sync {len(rows)} fallback rows from {jsonl_path}")
        return len(rows)

    success, err = _supabase_insert_batch(url, key, "agent_logs", rows, verbose=verbose)
    if success:
        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        archived = jsonl_path.with_suffix(f".synced-{ts}")
        jsonl_path.rename(archived)
        if verbose:
            print(f"  [jsonl] {len(rows)} fallback rows synced → archived to {archived.name}")
        return len(rows)
    else:
        print(f"  [jsonl] ERROR syncing fallback rows: {err}")
        return 0


# ---------------------------------------------------------------------------
# Main sync routine
# ---------------------------------------------------------------------------

def sync(limit: int = 200, batch_size: int = 50, verbose: bool = False, dry_run: bool = False) -> dict:
    """
    Sync up to `limit` unsynced rows from local SQLite to Supabase.

    Returns a summary dict:
        {synced: int, failed: int, skipped: int, jsonl_synced: int, duration_ms: int}
    """
    t_start = time.time()
    url, key = _get_supabase_creds()

    logger = LocalLogger()
    unsynced = logger.get_unsynced(limit=limit)

    if not unsynced:
        if verbose:
            print("[sync_to_brain] Nothing to sync.")
        logger.close()
        return {"synced": 0, "failed": 0, "skipped": 0, "jsonl_synced": 0, "duration_ms": 0}

    print(f"[sync_to_brain] Found {len(unsynced)} unsynced rows. Syncing in batches of {batch_size}…")

    total_synced = 0
    total_failed = 0
    synced_ids = []

    for i in range(0, len(unsynced), batch_size):
        batch = unsynced[i : i + batch_size]
        prepared = [_prepare_row(r) for r in batch]

        if dry_run:
            print(f"  [dry-run] batch {i // batch_size + 1}: would insert {len(prepared)} rows")
            synced_ids.extend(r["id"] for r in batch)
            total_synced += len(batch)
            continue

        success, err = _supabase_insert_batch(url, key, "agent_logs", prepared, verbose=verbose)
        if success:
            ids = [r["id"] for r in batch]
            synced_ids.extend(ids)
            total_synced += len(batch)
            if verbose:
                for r in batch:
                    print(f"    ✓ {r['id'][:8]}… {r.get('agent_name','?')} / {r.get('action','?')}")
        else:
            print(f"  [sync_to_brain] Batch {i // batch_size + 1} failed: {err}")
            total_failed += len(batch)

    # Mark successfully synced rows in local DB
    if synced_ids and not dry_run:
        logger.mark_synced(synced_ids)
        ts = datetime.now(timezone.utc).isoformat()
        logger.set_last_sync_cursor(ts)

    # Attempt JSONL fallback sync
    jsonl_synced = _sync_jsonl_rows(url, key, logger.jsonl_path, verbose=verbose, dry_run=dry_run)

    duration_ms = int((time.time() - t_start) * 1000)

    summary = {
        "synced": total_synced,
        "failed": total_failed,
        "skipped": len(unsynced) - total_synced - total_failed,
        "jsonl_synced": jsonl_synced,
        "duration_ms": duration_ms,
    }

    # Log the sync run itself to local store (not to Supabase — avoid sync loop)
    try:
        logger.log_event(
            agent="sync_to_brain",
            action="sync_run",
            level="info" if total_failed == 0 else "warn",
            details=summary,
            status="completed" if total_failed == 0 else "partial",
        )
    except Exception:
        pass

    logger.close()
    return summary

# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def _parse_args():
    p = argparse.ArgumentParser(
        description="Sync local agent logs to Supabase brain (no Claude/MCP required).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("--limit", type=int, default=200, help="Max rows to sync per run (default: 200)")
    p.add_argument("--batch-size", type=int, default=50, help="Rows per HTTP request (default: 50)")
    p.add_argument("--verbose", "-v", action="store_true", help="Print each row synced")
    p.add_argument("--dry-run", "-n", action="store_true", help="Simulate without writing to Supabase")
    return p.parse_args()


if __name__ == "__main__":
    args = _parse_args()
    result = sync(
        limit=args.limit,
        batch_size=args.batch_size,
        verbose=args.verbose,
        dry_run=args.dry_run,
    )
    status_icon = "✓" if result["failed"] == 0 else "⚠"
    print(
        f"[sync_to_brain] {status_icon} Done in {result['duration_ms']}ms — "
        f"synced={result['synced']} failed={result['failed']} "
        f"jsonl_fallback={result['jsonl_synced']}"
    )
    sys.exit(0 if result["failed"] == 0 else 1)