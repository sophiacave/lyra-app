#!/usr/bin/env python3
"""Fractal Brain Command Center — Local Dashboard Server.

Serves the command center UI on localhost and proxies Supabase API calls
so your service role key never touches the browser.

Usage:
    python3 dashboard.py              # starts on http://localhost:3333
    python3 dashboard.py --port 8080  # custom port
    brain dashboard                   # via brain CLI
"""

import http.server
import json
import os
import sys
import urllib.request
import urllib.error
import urllib.parse
import argparse
import webbrowser
from pathlib import Path

BRAIN_DIR = Path(os.environ.get("FRACTAL_BRAIN_DIR", "~/.fractal_brain")).expanduser()
DASHBOARD_HTML = Path(__file__).parent / "dashboard.html"

def _load_env():
    path = BRAIN_DIR / ".env"
    if not path.is_file():
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

_load_env()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

def supabase_request(path, method="GET", body=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "count=exact",
    }
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            content_range = r.headers.get("Content-Range", "")
            total = content_range.split("/")[-1] if "/" in content_range else None
            result = json.loads(r.read().decode())
            return {"data": result, "total": total, "status": r.status}
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode(), "status": e.code}
    except Exception as e:
        return {"error": str(e), "status": 500}


class DashboardHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self._cors()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        path = self.path
        if path == "/" or path == "/index.html":
            if DASHBOARD_HTML.exists():
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(DASHBOARD_HTML.read_bytes())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"dashboard.html not found")
            return

        if path == "/api/stats":
            tables = ["brain_context", "agent_memory", "shared_knowledge",
                       "agent_logs", "agents", "brain_sessions",
                       "brain_tools", "brain_workflows", "brain_decisions"]
            stats = {}
            for t in tables:
                r = supabase_request(f"{t}?select=id&limit=1")
                stats[t] = int(r.get("total", 0)) if r.get("total") else len(r.get("data", []))
            import sqlite3
            db_path = BRAIN_DIR / "agent_logs.db"
            local = {"logs": 0, "unsynced": 0, "todos": 0}
            if db_path.exists():
                conn = sqlite3.connect(str(db_path))
                try:
                    local["logs"] = conn.execute("SELECT COUNT(*) FROM agent_logs").fetchone()[0]
                    local["unsynced"] = conn.execute("SELECT COUNT(*) FROM agent_logs WHERE synced_to_notion=0").fetchone()[0]
                    local["todos"] = conn.execute("SELECT COUNT(*) FROM todo_items WHERE status != 'done'").fetchone()[0]
                except:
                    pass
                conn.close()
            self._json_response({"remote": stats, "local": local})
            return

        if path == "/api/agents":
            r = supabase_request("agents?select=*&order=tier,name")
            self._json_response(r.get("data", []))
            return

        if path == "/api/memory-summary":
            r = supabase_request("agent_memory?select=agent_name,memory_type&limit=10000")
            data = r.get("data", [])
            summary = {}
            for row in data:
                agent = row["agent_name"]
                mtype = row["memory_type"]
                if agent not in summary:
                    summary[agent] = {"learning": 0, "self-improvement": 0, "total": 0}
                summary[agent][mtype] = summary[agent].get(mtype, 0) + 1
                summary[agent]["total"] += 1
            self._json_response(summary)
            return

        if path == "/api/context":
            r = supabase_request("brain_context?select=*&order=category,priority.desc")
            self._json_response(r.get("data", []))
            return

        if path == "/api/workflows":
            r = supabase_request("brain_workflows?select=name,description,status&order=name")
            self._json_response(r.get("data", []))
            return

        if path == "/api/decisions":
            r = supabase_request("brain_decisions?select=*&order=created_at.desc")
            self._json_response(r.get("data", []))
            return

        if path == "/api/tools":
            r = supabase_request("brain_tools?select=name,description,category&order=name")
            self._json_response(r.get("data", []))
            return

        if path == "/api/logs":
            r = supabase_request("agent_logs?select=agent_name,status,started_at,action,tokens_used,cost_usd&order=started_at.desc&limit=50")
            self._json_response(r.get("data", []))
            return

        if path == "/api/todos":
            import sqlite3
            db_path = BRAIN_DIR / "agent_logs.db"
            todos = []
            if db_path.exists():
                conn = sqlite3.connect(str(db_path))
                conn.row_factory = sqlite3.Row
                try:
                    todos = [dict(r) for r in conn.execute(
                        "SELECT * FROM todo_items ORDER BY status ASC, priority DESC"
                    ).fetchall()]
                except:
                    pass
                conn.close()
            self._json_response(todos)
            return

        if path.startswith("/api/search?"):
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(path).query)
            q = qs.get("q", [""])[0]
            if q:
                r = supabase_request(
                    f"agent_memory?select=agent_name,memory_type,key,value,confidence"
                    f"&or=(key.ilike.*{q}*,value.ilike.*{q}*)&order=updated_at.desc&limit=30"
                )
                self._json_response(r.get("data", []))
            else:
                self._json_response([])
            return

        if path == "/api/connectors":
            try:
                resp = supabase_request("brain_connectors?select=name,status,service_type,metadata&order=status,name")
                raw = resp.get("data", []) if isinstance(resp, dict) else []
                connectors = []
                for c in raw:
                    if not isinstance(c, dict):
                        continue
                    meta = c.get("metadata") or {}
                    if isinstance(meta, str):
                        try: meta = json.loads(meta)
                        except: meta = {}
                    connectors.append({
                        "name": c.get("name", "?"),
                        "status": c.get("status", "unknown"),
                        "tools": meta.get("tools_count", 0),
                        "category": c.get("service_type", "other"),
                    })
                self._json_response(connectors)
            except Exception as e:
                self._json_response([])
            return

        if path == "/api/health":
            report_file = Path.home() / ".fractal_brain" / "logs" / "health_report.json"
            if report_file.exists():
                try:
                    data = json.loads(report_file.read_text())
                    self._json_response(data)
                except:
                    self._json_response({"summary": {"score": 0, "note": "Report corrupted"}, "checks": [], "bottlenecks": []})
            else:
                self._json_response({"summary": {"score": 0, "note": "No health report yet. Run: brain health"}, "checks": [], "bottlenecks": []})
            return

        self.send_response(404)
        self.end_headers()


def main():
    parser = argparse.ArgumentParser(description="Fractal Brain Command Center")
    parser.add_argument("--port", type=int, default=3333)
    parser.add_argument("--no-open", action="store_true")
    args = parser.parse_args()

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: Set SUPABASE_URL and SUPABASE_KEY in ~/.fractal_brain/.env")
        sys.exit(1)

    server = http.server.HTTPServer(("127.0.0.1", args.port), DashboardHandler)
    url = f"http://localhost:{args.port}"
    print(f"Fractal Brain Command Center running at {url}")

    if not args.no_open:
        webbrowser.open(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.shutdown()


if __name__ == "__main__":
    main()
