#!/usr/bin/env python3
"""brain_patch.py — DELETE+INSERT upsert for Supabase brain.

The brain_raw_query MCP tool's PATCH method is broken system-wide.
This module implements upsert(table, match_cols, data) using the
documented workaround: DELETE matching row, then INSERT new row.

Usage as CLI:
    python3 brain_patch.py --table brain_context \
        --match '["key"]' \
        --data '{"key":"test.ping","category":"system","value":"pong"}'

Usage as module:
    from brain_patch import upsert, batch_upsert
    upsert("brain_context", ["key"], {"key": "x", "category": "y", "value": "z"})
"""

import json
import os
import sys
import argparse
import urllib.request
import urllib.parse
import urllib.error


# ── credentials ──────────────────────────────────────────────────────

def _load_dotenv(path: str) -> None:
    """Minimal .env loader — no external deps."""
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


def _get_supabase_creds() -> tuple:
    """Return (url, key) from env, loading ~/.fractal_brain/.env if needed."""
    _load_dotenv(os.path.expanduser("~/.fractal_brain/.env"))
    url = os.environ.get("SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set", file=sys.stderr)
        sys.exit(1)
    return url.rstrip("/"), key


def _headers(key: str) -> dict:
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


# ── low-level REST helpers ───────────────────────────────────────────def _supabase_delete(url, key, table, match_conditions):
    """DELETE rows matching all conditions. match_conditions = {col: val}."""
    qs = "&".join(f"{urllib.parse.quote(k)}=eq.{urllib.parse.quote(str(v))}"
                  for k, v in match_conditions.items())
    req_url = f"{url}/rest/v1/{table}?{qs}"
    req = urllib.request.Request(req_url, method="DELETE", headers=_headers(key))
    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            pass  # no matching row — fine for upsert
        else:
            raise


def _supabase_insert(url, key, table, row):
    """INSERT a single row. row = dict of column: value."""
    req_url = f"{url}/rest/v1/{table}"
    body = json.dumps(row).encode()
    req = urllib.request.Request(req_url, data=body, method="POST", headers=_headers(key))
    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        raise RuntimeError(f"INSERT failed ({e.code}): {err_body}") from e


# ── public API ──────────────────────────────────────────────────────def upsert(table, match_cols, data, verbose=False):
    """DELETE+INSERT upsert. match_cols = list of columns forming the unique key."""
    url, key = _get_supabase_creds()
    match_conditions = {c: data[c] for c in match_cols}
    if verbose:
        print(f"UPSERT {table} where {match_conditions}")
    _supabase_delete(url, key, table, match_conditions)
    _supabase_insert(url, key, table, data)
    if verbose:
        print("  ✓ done")


def batch_upsert(table, match_cols, rows, verbose=False):
    """Upsert multiple rows, collecting errors."""
    ok, errors = 0, []
    for i, row in enumerate(rows):
        try:
            upsert(table, match_cols, row, verbose=verbose)
            ok += 1
        except Exception as e:
            errors.append({"index": i, "error": str(e)})
            if verbose:
                print(f"  ✗ row {i}: {e}", file=sys.stderr)
    return {"total": len(rows), "ok": ok, "errors": errors}


# ── CLI ─────────────────────────────────────────────────────────────

def _parse_args():
    ap = argparse.ArgumentParser(description="Supabase DELETE+INSERT upsert")
    ap.add_argument("--table", required=True)
    ap.add_argument("--match", required=True, help="JSON array of match columns")
    ap.add_argument("--data", required=True, help="JSON object of row data")
    ap.add_argument("--verbose", action="store_true")
    return ap.parse_args()


if __name__ == "__main__":
    args = _parse_args()
    match_cols = json.loads(args.match)
    data = json.loads(args.data)
    upsert(args.table, match_cols, data, verbose=args.verbose)
    print("OK")