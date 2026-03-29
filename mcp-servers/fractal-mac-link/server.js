#!/usr/bin/env node
/**
 * fractal-mac-link v2.0 — Fractal Brain Mac MCP Server (Tandem Edition)
 * Purpose-built for Faye / Like One AI Studio.
 * 22 tools: boot, files, shell, Python, search, screen capture/record,
 * app control, system power, clipboard, notifications, brain context,
 * brain write, machine identity, heartbeat, task dispatch.
 *
 * NEW in v2.0: Machine-aware tandem mode — M3 Forge + M4 Mirror
 * share the same brain, coordinate via heartbeat + task dispatch.
 *
 * Transport: stdio | Start: node server.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync, exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import https from "https";

// ── constants ─────────────────────────────────────────────────────────
const HOME       = os.homedir();
const BRAIN_DIR  = path.join(HOME, ".fractal_brain");
const CLAUDE_MD  = path.join(BRAIN_DIR, "CLAUDE.md");
const WORKSPACE  = path.join(HOME, "likeone-workspace");
const ENV_FILE   = path.join(BRAIN_DIR, ".env");
const REFRESH_PY = path.join(BRAIN_DIR, "tools", "refresh_claude_md.py");
const LOG_DIR    = path.join(BRAIN_DIR, "logs");

// ── env load ──────────────────────────────────────────────────────────
function loadEnv() {
  if (fs.existsSync(ENV_FILE)) {
    fs.readFileSync(ENV_FILE, "utf8").split("\n").forEach(line => {
      if (line.includes("=") && !line.startsWith("#")) {
        const [k, ...v] = line.split("=");
        process.env[k.trim()] ??= v.join("=").trim();
      }
    });
  }
}
loadEnv();
const SUPA_URL = process.env.SUPABASE_URL || "";
const SUPA_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// ── machine identity (auto-detect) ───────────────────────────────────
function detectMachineId() {
  try {
    const chip = execSync("sysctl -n machdep.cpu.brand_string 2>/dev/null || echo unknown", { encoding: "utf8" }).trim();
    const hostname = os.hostname();
    const totalMem = Math.round(os.totalmem() / (1024 ** 3));
    // M3 Max 64GB = m3_forge, M4 Pro 48GB = m4_mirror
    if (chip.includes("M3") || (totalMem >= 60 && hostname.includes("MacBook-Pro") && !hostname.includes("-2"))) return "m3_forge";
    if (chip.includes("M4") || hostname.includes("-2")) return "m4_mirror";
    return process.env.MACHINE_ID || "unknown";
  } catch { return process.env.MACHINE_ID || "unknown"; }
}

const MACHINE_ID = detectMachineId();

// ── helpers ───────────────────────────────────────────────────────────
function safePath(p) { return path.resolve(p.replace(/^~/, HOME)); }
function ts() { return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19); }

function shell(cmd, opts = {}) {
  try {
    const result = execSync(cmd, {
      shell: "/bin/zsh", encoding: "utf8", timeout: (opts.timeout || 30) * 1000,
      env: { ...process.env, HOME, PATH: "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin" },
      cwd: opts.cwd || WORKSPACE, stdio: ["pipe", "pipe", "pipe"]
    });
    return { ok: true, out: result.trim(), code: 0 };
  } catch (e) {
    return { ok: false, out: (e.stdout || "").trim(), err: (e.stderr || e.message || "").trim().slice(0, 600), code: e.status || 1 };
  }
}

function supaFetch(endpoint, method = "GET", body = null) {
  return new Promise((resolve) => {
    if (!SUPA_URL || !SUPA_KEY) return resolve([]);
    const url = new URL(`${SUPA_URL}/rest/v1/${endpoint}`);
    const headers = {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : method === "PATCH" ? "return=representation" : undefined,
    };
    // Clean undefined headers
    Object.keys(headers).forEach(k => headers[k] === undefined && delete headers[k]);

    const req = https.request(url, {
      method,
      headers,
      timeout: 8000
    }, res => {
      let data = "";
      res.on("data", d => data += d);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve(data ? [{ raw: data }] : []); } });
    });
    req.on("error", () => resolve([]));
    req.on("timeout", () => { req.destroy(); resolve([]); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function supaRpc(fnName, params = {}) {
  return new Promise((resolve) => {
    if (!SUPA_URL || !SUPA_KEY) return resolve(null);
    const url = new URL(`${SUPA_URL}/rest/v1/rpc/${fnName}`);
    const req = https.request(url, {
      method: "POST",
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" },
      timeout: 8000
    }, res => {
      let data = "";
      res.on("data", d => data += d);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
    });
    req.on("error", () => resolve(null));
    req.on("timeout", () => { req.destroy(); resolve(null); });
    req.write(JSON.stringify(params));
    req.end();
  });
}

function ok(text) { return { content: [{ type: "text", text: String(text) }] }; }
function err(text) { return { content: [{ type: "text", text: `🔴 ${text}` }], isError: true }; }

// ── server init ───────────────────────────────────────────────────────
const server = new McpServer({
  name: "fractal-mac-link",
  version: "2.0.0",
  description: `Fractal Brain Mac MCP v2.0 (Tandem). Machine: ${MACHINE_ID}. 22 tools.`
});

// ══════════════════════════════════════════════════════════════════════
// T1: mac_boot — type "brain", call this, instant full context
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_boot", "Boot session: reads CLAUDE.md + brain heartbeat + fleet status + task queue. Sends heartbeat on boot.", {},
async () => {
  const parts = [`🤖 Machine: ${MACHINE_ID}`];

  // Send heartbeat on boot
  const memFree = Math.round(os.freemem() / (1024 ** 3) * 10) / 10;
  const memTotal = Math.round(os.totalmem() / (1024 ** 3));
  await supaFetch(`machine_heartbeats?machine_id=eq.${MACHINE_ID}`, "PATCH", {
    status: "online",
    last_heartbeat: new Date().toISOString(),
    load: { mem_free_gb: memFree, mem_total_gb: memTotal, cpu_load: os.loadavg()[0] },
    session_id: `session_${Date.now()}`,
  });

  if (fs.existsSync(CLAUDE_MD)) {
    const stat = fs.statSync(CLAUDE_MD);
    const ageMins = (Date.now() - stat.mtimeMs) / 60000;
    parts.push(fs.readFileSync(CLAUDE_MD, "utf8"));
    if (ageMins > 20) parts.push(`\n⚠️  CLAUDE.md is ${ageMins.toFixed(0)}min old — run mac_refresh_brain`);
  } else {
    parts.push("⚠️  CLAUDE.md missing — run mac_refresh_brain first");
  }

  // Fleet status
  const fleet = await supaFetch("machine_heartbeats?select=machine_id,status,last_heartbeat,current_task,load&order=machine_id");
  if (fleet.length) {
    parts.push("\n🖥️  Fleet status:");
    fleet.forEach(m => {
      const ago = m.last_heartbeat ? Math.round((Date.now() - new Date(m.last_heartbeat).getTime()) / 60000) : "?";
      const task = m.current_task ? ` → ${m.current_task}` : "";
      parts.push(`  ${m.status === "online" ? "🟢" : "⚪"} ${m.machine_id}: ${m.status} (${ago}min ago)${task}`);
    });
  }

  // Pending tasks
  const tasks = await supaFetch(`task_dispatch?status=in.(pending,assigned,in_progress)&order=priority.asc,created_at.asc&limit=5`);
  if (tasks.length) {
    parts.push(`\n📋 ${tasks.length} active task(s):`);
    tasks.forEach(t => {
      const assignee = t.assigned_to || "unassigned";
      parts.push(`  [${t.priority}] ${t.title} — ${t.status} (${assignee})`);
    });
  }

  return ok(parts.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// T2: mac_refresh_brain
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_refresh_brain", "Force-refresh CLAUDE.md from live Supabase brain. Run when stale or after major brain updates.", {},
async () => {
  const r = shell(`python3 "${REFRESH_PY}"`, { timeout: 30 });
  if (r.ok) return ok(`✅ ${r.out}\n\n${fs.existsSync(CLAUDE_MD) ? fs.readFileSync(CLAUDE_MD,"utf8") : ""}`);
  return err(`Refresh failed: ${r.err}`);
});

// ══════════════════════════════════════════════════════════════════════
// T3: mac_read_file
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_read_file", "Read any file from the Mac filesystem with line numbers. Use offset+length for large files.",
  { path: z.string().describe("Absolute or ~ path"), offset: z.number().int().min(0).default(0), length: z.number().int().min(1).max(2000).default(200) },
async ({ path: p, offset, length }) => {
  try {
    const resolved = safePath(p);
    const lines = fs.readFileSync(resolved, "utf8").split("\n");
    const chunk = lines.slice(offset, offset + length);
    const numbered = chunk.map((l, i) => `${String(offset+i+1).padStart(4)}│ ${l}`).join("\n");
    return ok(`📄 ${resolved} (${lines.length} lines, showing ${offset+1}–${offset+chunk.length})\n\n${numbered}`);
  } catch (e) { return err(e.message); }
});

// ══════════════════════════════════════════════════════════════════════
// T4: mac_write_file
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_write_file", "Write or append content to any file on the Mac. Creates parent dirs automatically.",
  { path: z.string().describe("Absolute or ~ path"), content: z.string(), mode: z.enum(["rewrite","append"]).default("rewrite") },
async ({ path: p, content, mode }) => {
  try {
    const resolved = safePath(p);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, content, { encoding: "utf8", flag: mode === "append" ? "a" : "w" });
    const size = fs.statSync(resolved).size;
    return ok(`✅ ${mode === "append" ? "Appended" : "Written"} ${content.split("\n").length} lines (${size.toLocaleString()} bytes) → ${resolved}`);
  } catch (e) { return err(e.message); }
});

// ══════════════════════════════════════════════════════════════════════
// T5: mac_list_dir
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_list_dir", "List directory contents as a tree. depth 1-4.",
  { path: z.string().default("~/likeone-workspace"), depth: z.number().int().min(1).max(4).default(1), show_hidden: z.boolean().default(false) },
async ({ path: p, depth, show_hidden }) => {
  try {
    const root = safePath(p);
    const lines = [`📁 ${root}`];
    function walk(dir, prefix, d) {
      if (d === 0) return;
      let items;
      try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { lines.push(`${prefix}[DENIED]`); return; }
      items.sort((a,b) => (+a.isFile()) - (+b.isFile()) || a.name.localeCompare(b.name));
      for (const item of items) {
        if (!show_hidden && item.name.startsWith(".")) continue;
        const full = path.join(dir, item.name);
        if (item.isDirectory()) { lines.push(`${prefix}[DIR]  ${item.name}/`); walk(full, prefix+"  ", d-1); }
        else { const sz = fs.statSync(full).size; const szStr = sz>1048576?`${(sz/1048576).toFixed(1)}MB`:sz>1024?`${(sz/1024).toFixed(0)}KB`:`${sz}B`; lines.push(`${prefix}[FILE] ${item.name} (${szStr})`); }
      }
    }
    walk(root, "  ", depth);
    return ok(lines.join("\n"));
  } catch (e) { return err(e.message); }
});

// ══════════════════════════════════════════════════════════════════════
// T6: mac_run_command
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_run_command", "Run any zsh shell command on the Mac. Returns stdout+stderr+exit code.",
  { command: z.string(), cwd: z.string().default("~/likeone-workspace"), timeout: z.number().int().min(1).max(300).default(30) },
async ({ command, cwd, timeout }) => {
  const r = shell(command, { cwd: safePath(cwd), timeout });
  const icon = r.ok ? "✅" : "🔴";
  const parts = [`${icon} exit=${r.code} | ${command.slice(0,60)}`];
  if (r.out) parts.push(r.out);
  if (r.err) parts.push(`stderr: ${r.err}`);
  return ok(parts.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// T7: mac_run_python
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_run_python", "Run Python 3 code inline or execute a .py script. Has access to all ~/.fractal_brain libs.",
  { code: z.string().optional().describe("Python code inline"), script_path: z.string().optional(), args: z.string().default(""), timeout: z.number().int().default(60) },
async ({ code, script_path, args, timeout }) => {
  let cmd;
  if (code) { fs.writeFileSync("/tmp/_fractal_run.py", code); cmd = `python3 /tmp/_fractal_run.py ${args}`; }
  else if (script_path) { cmd = `python3 "${safePath(script_path)}" ${args}`; }
  else return err("Provide 'code' or 'script_path'");
  const r = shell(cmd, { cwd: BRAIN_DIR, timeout });
  const icon = r.ok ? "✅" : "🔴";
  const parts = [`${icon} Python exit=${r.code}`];
  if (r.out) parts.push(r.out);
  if (r.err) parts.push(`stderr: ${r.err}`);
  return ok(parts.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// T8: mac_search — Spotlight + glob
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_search", "Search files using Spotlight (mdfind) or glob. Instant full-disk search.",
  { query: z.string(), path: z.string().default("~"), limit: z.number().int().min(1).max(100).default(20) },
async ({ query, path: p, limit }) => {
  const root = safePath(p);
  const r = shell(`mdfind -onlyin "${root}" '${query}' | head -${limit}`, { timeout: 10 });
  const results = r.out.split("\n").filter(Boolean);
  if (!results.length) return ok(`No results for '${query}' in ${root}`);
  const lines = [`🔍 ${results.length} result(s) for '${query}':`];
  results.forEach(f => { try { const s=fs.statSync(f).size; lines.push(`  ${fs.statSync(f).isDirectory()?"[DIR]":`[${s>1024?(s/1024).toFixed(0)+"KB":s+"B"}]`} ${f}`); } catch { lines.push(`  ${f}`); }});
  return ok(lines.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// T9: mac_screenshot
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_screenshot", "Capture Mac screen or active window as PNG. Returns saved file path.",
  { target: z.enum(["screen","window"]).default("screen"), save_path: z.string().optional() },
async ({ target, save_path }) => {
  fs.mkdirSync(path.join(WORKSPACE, "outputs"), { recursive: true });
  const out = save_path ? safePath(save_path) : path.join(WORKSPACE, "outputs", `screenshot_${ts()}.png`);
  const cmd = target === "window" ? `screencapture -w "${out}"` : `screencapture -x "${out}"`;
  const r = shell(cmd, { timeout: 15 });
  if (fs.existsSync(out)) { const sz = (fs.statSync(out).size/1024).toFixed(0); return ok(`📸 Screenshot → ${out} (${sz}KB)`); }
  return err(`Screenshot failed: ${r.err}`);
});

// ══════════════════════════════════════════════════════════════════════
// T10: mac_screen_record — start/stop
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_screen_record", "Start or stop screen recording. action='start' begins background recording. action='stop' saves .mov file.",
  { action: z.enum(["start","stop"]), duration: z.number().int().optional().describe("Auto-stop after N seconds"), save_path: z.string().optional() },
async ({ action, duration, save_path }) => {
  fs.mkdirSync(path.join(WORKSPACE, "outputs"), { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const pidFile  = path.join(LOG_DIR, ".screen_record.pid");
  const pathFile = path.join(LOG_DIR, ".screen_record.path");

  if (action === "start") {
    const out = save_path ? safePath(save_path) : path.join(WORKSPACE, "outputs", `recording_${ts()}.mov`);
    const args = duration ? ["-V", String(duration), out] : [out];
    const proc = spawn("screencapture", ["-v", ...args], { detached: true, stdio: "ignore" });
    proc.unref();
    fs.writeFileSync(pidFile, String(proc.pid));
    fs.writeFileSync(pathFile, out);
    return ok(`⏺️  Recording started (PID ${proc.pid}) → ${out}`);
  }

  if (action === "stop") {
    const savedPath = fs.existsSync(pathFile) ? fs.readFileSync(pathFile,"utf8").trim() : "unknown";
    if (fs.existsSync(pidFile)) {
      const pid = fs.readFileSync(pidFile,"utf8").trim();
      shell(`kill -SIGINT ${pid}`);
      fs.rmSync(pidFile, { force: true }); fs.rmSync(pathFile, { force: true });
    } else { shell("pkill -SIGINT screencapture"); }
    await new Promise(r => setTimeout(r, 1000));
    return ok(`⏹️  Recording stopped → ${savedPath}`);
  }
});

// ══════════════════════════════════════════════════════════════════════
// T11: mac_app_control — open, close, focus, hide, list
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_app_control", "Open, close, quit, focus, hide apps or list all running apps. action: open|close|quit|focus|hide|list",
  { action: z.enum(["open","close","quit","focus","hide","list"]), app: z.string().optional(), force: z.boolean().default(false) },
async ({ action, app, force }) => {
  if (action === "list") {
    const r = shell(`osascript -e 'tell application "System Events" to get name of every process whose background only is false'`);
    return ok(`🖥️  Running apps:\n• ${r.out.split(", ").join("\n• ")}`);
  }
  if (!app) return err("'app' required for this action");
  if (action === "open")  { const r = shell(`open -a '${app}'`); return ok(r.ok ? `✅ Opened ${app}` : `🔴 ${r.err}`); }
  if (action === "focus") { const r = shell(`osascript -e 'tell application "${app}" to activate'`); return ok(r.ok ? `✅ Focused ${app}` : `🔴 ${r.err}`); }
  if (action === "hide")  { const r = shell(`osascript -e 'tell application "System Events" to set visible of process "${app}" to false'`); return ok(r.ok ? `✅ Hidden ${app}` : `🔴 ${r.err}`); }
  if (action === "close" || action === "quit") {
    const r = force ? shell(`killall '${app}'`) : shell(`osascript -e 'tell application "${app}" to quit'`);
    return ok(r.ok ? `✅ Closed ${app}` : `🔴 ${r.err || "App may not be running"}`);
  }
});

// ══════════════════════════════════════════════════════════════════════
// T12: mac_system — restart, shutdown, sleep, lock, volume, uptime
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_system",
  "Full system control: restart, shutdown, sleep, lock, logout, volume_get/set, uptime. restart/shutdown/logout require confirm=true.",
  { action: z.enum(["restart","shutdown","sleep","lock","logout","volume_get","volume_set","uptime"]),
    value: z.string().optional().describe("For volume_set: 0-100"),
    confirm: z.boolean().default(false).describe("Must be true for restart/shutdown/logout") },
async ({ action, value, confirm }) => {
  if (action === "uptime")      return ok(`⏱️  ${shell("uptime").out}`);
  if (action === "volume_get")  return ok(`🔊 Volume: ${shell("osascript -e 'output volume of (get volume settings)'").out}%`);
  if (action === "volume_set")  { const r = shell(`osascript -e 'set volume output volume ${value}'`); return ok(r.ok ? `✅ Volume → ${value}%` : `🔴 ${r.err}`); }
  if (action === "sleep")       { shell("pmset sleepnow"); return ok("😴 Sleep triggered"); }
  if (action === "lock")        { shell(`osascript -e 'tell application "System Events" to keystroke "q" using {command down, control down}'`); return ok("🔒 Screen locked"); }
  if (!confirm) return err(`Safety gate: set confirm=true to execute '${action}'`);
  if (action === "restart")     { shell(`osascript -e 'tell application "System Events" to restart'`); return ok("🔁 Restarting…"); }
  if (action === "shutdown")    { shell(`osascript -e 'tell application "System Events" to shut down'`); return ok("⏻ Shutting down…"); }
  if (action === "logout")      { shell(`osascript -e 'tell application "System Events" to log out'`); return ok("👋 Logging out…"); }
});

// ══════════════════════════════════════════════════════════════════════
// T13: mac_clipboard
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_clipboard", "Read or write Mac clipboard. action='get' returns contents. action='set' copies text.",
  { action: z.enum(["get","set"]), text: z.string().optional() },
async ({ action, text }) => {
  if (action === "get") { const r = shell("pbpaste"); return ok(`📋 Clipboard (${r.out.length} chars):\n${r.out.slice(0,2000)}`); }
  if (action === "set") {
    if (!text) return err("'text' required for action=set");
    try { execSync("pbcopy", { input: text, encoding: "utf8" }); return ok(`✅ Copied ${text.length} chars to clipboard`); }
    catch (e) { return err(e.message); }
  }
});

// ══════════════════════════════════════════════════════════════════════
// T14: mac_notify
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_notify", "Send macOS notification to Faye's screen. Use for task done, alerts, reminders.",
  { title: z.string(), message: z.string(), sound: z.boolean().default(true) },
async ({ title, message, sound }) => {
  const s = sound ? 'sound name "default"' : "";
  const r = shell(`osascript -e 'display notification "${message.replace(/"/g, '\\"')}" with title "${title.replace(/"/g, '\\"')}" ${s}'`);
  return ok(r.ok ? `✅ Notified: ${title}` : `🔴 ${r.err}`);
});

// ══════════════════════════════════════════════════════════════════════
// T15: mac_open — files, apps, URLs
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_open", "Open any app, file, or URL on the Mac. Examples: 'Slack', '~/file.pdf', 'https://make.com'",
  { target: z.string().describe("App name, file path, or URL") },
async ({ target }) => {
  const cmd = target.startsWith("http") ? `open '${target}'` : target.includes("/") || target.startsWith("~") ? `open '${safePath(target)}'` : `open -a '${target}'`;
  const r = shell(cmd, { timeout: 10 });
  return ok(r.ok ? `✅ Opened: ${target}` : `🔴 ${r.err}`);
});

// ══════════════════════════════════════════════════════════════════════
// T16: mac_brain_context — direct brain lookup (READ)
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_brain_context", "Read Fractal Brain Supabase context. Faster than switching MCPs for quick lookups.",
  { key: z.string().optional(), category: z.string().optional(), limit: z.number().int().min(1).max(50).default(10) },
async ({ key, category, limit }) => {
  let q = `brain_context?select=key,category,description,value,priority,updated_at&limit=${limit}&order=priority.asc`;
  if (key) q += `&key=eq.${encodeURIComponent(key)}`;
  if (category) q += `&category=eq.${encodeURIComponent(category)}`;
  const rows = await supaFetch(q);
  if (!rows.length) return ok("No brain context found");
  const lines = [`🧠 Brain context (${rows.length}):`];
  rows.forEach(r => {
    const val = typeof r.value === "string" ? r.value.slice(0,150) : JSON.stringify(r.value).slice(0,150);
    lines.push(`\n[p${r.priority}] ${r.key} (${r.category})\n  ${r.description||""}\n  → ${val}${r.value?.length>150?"…":""}`);
  });
  return ok(lines.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// T17: mac_brain_write — write/update brain context (NEW in v2.0)
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_brain_write", "Write or update a brain_context key. Upserts by key. Use for session state, discoveries, decisions.",
  {
    key: z.string().describe("Brain key, e.g. 'session.active_work'"),
    value: z.any().describe("JSON value to store"),
    category: z.string().default("session").describe("Category: session, directive, infrastructure, identity, system, content"),
    description: z.string().optional().describe("Human-readable description"),
    priority: z.number().int().min(1).max(10).default(5),
  },
async ({ key, value, category, description, priority }) => {
  // Try update first
  const existing = await supaFetch(`brain_context?key=eq.${encodeURIComponent(key)}&select=id`);
  if (existing.length && existing[0].id) {
    // Update
    const result = await supaFetch(`brain_context?key=eq.${encodeURIComponent(key)}`, "PATCH", {
      value: typeof value === "string" ? value : value,
      category,
      description: description || undefined,
      priority,
      updated_at: new Date().toISOString(),
    });
    return ok(`✅ Updated brain key: ${key}`);
  } else {
    // Insert
    const result = await supaFetch("brain_context", "POST", {
      key,
      value: typeof value === "string" ? value : value,
      category,
      description: description || `Written by ${MACHINE_ID}`,
      priority,
    });
    return ok(`✅ Created brain key: ${key}`);
  }
});

// ══════════════════════════════════════════════════════════════════════
// T18: mac_brain_search — full-text search across brain (NEW in v2.0)
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_brain_search", "Search brain_context by keyword across keys, descriptions, and values. Returns top matches.",
  { query: z.string(), limit: z.number().int().min(1).max(20).default(5) },
async ({ query, limit }) => {
  // Use ilike on key + description for broad match
  const q = `brain_context?or=(key.ilike.*${encodeURIComponent(query)}*,description.ilike.*${encodeURIComponent(query)}*)&select=key,category,description,priority,updated_at&order=priority.desc&limit=${limit}`;
  const rows = await supaFetch(q);
  if (!rows.length) return ok(`No brain matches for '${query}'`);
  const lines = [`🔍 Brain search '${query}' — ${rows.length} match(es):`];
  rows.forEach(r => lines.push(`  [p${r.priority}] ${r.key} (${r.category}) — ${(r.description||"").slice(0,80)}`));
  return ok(lines.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// T19: mac_heartbeat — send/read machine heartbeat (NEW in v2.0)
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_heartbeat", "Send heartbeat to brain or check fleet status. action: 'send' updates this machine, 'fleet' shows all machines.",
  { action: z.enum(["send", "fleet"]).default("send"), current_task: z.string().optional() },
async ({ action, current_task }) => {
  if (action === "send") {
    const memFree = Math.round(os.freemem() / (1024 ** 3) * 10) / 10;
    const memTotal = Math.round(os.totalmem() / (1024 ** 3));
    const load = os.loadavg();
    await supaFetch(`machine_heartbeats?machine_id=eq.${MACHINE_ID}`, "PATCH", {
      status: "online",
      last_heartbeat: new Date().toISOString(),
      current_task: current_task || null,
      load: { mem_free_gb: memFree, mem_total_gb: memTotal, cpu_1m: load[0], cpu_5m: load[1] },
    });
    return ok(`💓 Heartbeat sent: ${MACHINE_ID} (${memFree}GB free / ${memTotal}GB total, load ${load[0].toFixed(1)})`);
  }

  if (action === "fleet") {
    const fleet = await supaFetch("machine_heartbeats?select=*&order=machine_id");
    if (!fleet.length) return ok("No machines registered");
    const lines = ["🖥️  Fleet status:"];
    fleet.forEach(m => {
      const ago = m.last_heartbeat ? Math.round((Date.now() - new Date(m.last_heartbeat).getTime()) / 60000) : "?";
      const isStale = ago > 10;
      const icon = m.status === "online" && !isStale ? "🟢" : isStale ? "🟡" : "⚪";
      const mem = m.load?.mem_free_gb ? `${m.load.mem_free_gb}GB free` : "";
      const task = m.current_task ? `\n    📋 ${m.current_task}` : "";
      const caps = Array.isArray(m.capabilities) ? m.capabilities.join(", ") : "";
      lines.push(`  ${icon} ${m.machine_id} (${m.chip}, ${m.memory_gb}GB) — ${m.status} ${ago}min ago ${mem}${task}`);
      if (caps) lines.push(`    🔧 ${caps}`);
    });
    return ok(lines.join("\n"));
  }
});

// ══════════════════════════════════════════════════════════════════════
// T20: mac_task_dispatch — create/claim/complete tasks (NEW in v2.0)
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_task_dispatch", "Multi-machine task coordination. Create, claim, complete, or list tasks.",
  {
    action: z.enum(["create", "claim", "complete", "fail", "list", "my_tasks"]),
    task_id: z.string().optional().describe("UUID for claim/complete/fail"),
    title: z.string().optional().describe("For create"),
    description: z.string().optional(),
    category: z.string().optional().describe("studio, deploy, brain, social, revenue"),
    priority: z.number().int().min(1).max(10).optional().default(5),
    requires: z.array(z.string()).optional().describe("Capabilities needed"),
    payload: z.any().optional(),
    result: z.any().optional().describe("For complete"),
    error: z.string().optional().describe("For fail"),
  },
async ({ action, task_id, title, description, category, priority, requires, payload, result, error }) => {
  if (action === "create") {
    if (!title) return err("'title' required for create");
    const task = await supaFetch("task_dispatch", "POST", {
      title,
      description: description || null,
      category: category || null,
      priority: priority || 5,
      requires: requires || null,
      payload: payload || {},
      created_by: MACHINE_ID,
    });
    return ok(`✅ Task created: ${title} (priority ${priority})`);
  }

  if (action === "claim") {
    if (!task_id) {
      // Auto-claim: find highest-priority pending task this machine can handle
      const pending = await supaFetch(`task_dispatch?status=eq.pending&order=priority.asc,created_at.asc&limit=1`);
      if (!pending.length) return ok("No pending tasks to claim");
      task_id = pending[0].id;
    }
    await supaFetch(`task_dispatch?id=eq.${task_id}`, "PATCH", {
      assigned_to: MACHINE_ID,
      status: "in_progress",
      started_at: new Date().toISOString(),
    });
    await supaFetch(`machine_heartbeats?machine_id=eq.${MACHINE_ID}`, "PATCH", {
      current_task: task_id,
    });
    return ok(`✅ Claimed task ${task_id} for ${MACHINE_ID}`);
  }

  if (action === "complete") {
    if (!task_id) return err("'task_id' required for complete");
    await supaFetch(`task_dispatch?id=eq.${task_id}`, "PATCH", {
      status: "completed",
      result: result || { completed_by: MACHINE_ID },
      completed_at: new Date().toISOString(),
    });
    await supaFetch(`machine_heartbeats?machine_id=eq.${MACHINE_ID}`, "PATCH", {
      current_task: null,
    });
    return ok(`✅ Task ${task_id} completed by ${MACHINE_ID}`);
  }

  if (action === "fail") {
    if (!task_id) return err("'task_id' required for fail");
    await supaFetch(`task_dispatch?id=eq.${task_id}`, "PATCH", {
      status: "failed",
      error: error || "Unknown error",
    });
    await supaFetch(`machine_heartbeats?machine_id=eq.${MACHINE_ID}`, "PATCH", {
      current_task: null,
    });
    return ok(`❌ Task ${task_id} failed: ${error}`);
  }

  if (action === "list") {
    const tasks = await supaFetch(`task_dispatch?status=in.(pending,assigned,in_progress)&order=priority.asc,created_at.asc&limit=10`);
    if (!tasks.length) return ok("📋 No active tasks");
    const lines = [`📋 ${tasks.length} active task(s):`];
    tasks.forEach(t => {
      const assignee = t.assigned_to || "unassigned";
      lines.push(`  [p${t.priority}] ${t.id.slice(0,8)} — ${t.title} (${t.status}, ${assignee})${t.category ? ` [${t.category}]` : ""}`);
    });
    return ok(lines.join("\n"));
  }

  if (action === "my_tasks") {
    const tasks = await supaFetch(`task_dispatch?assigned_to=eq.${MACHINE_ID}&status=in.(assigned,in_progress)&order=priority.asc&limit=10`);
    if (!tasks.length) return ok(`📋 No tasks assigned to ${MACHINE_ID}`);
    const lines = [`📋 ${MACHINE_ID} tasks:`];
    tasks.forEach(t => lines.push(`  [p${t.priority}] ${t.id.slice(0,8)} — ${t.title} (${t.status})${t.category ? ` [${t.category}]` : ""}`));
    return ok(lines.join("\n"));
  }
});

// ══════════════════════════════════════════════════════════════════════
// T21: mac_fleet_dispatch — dispatch a task to a specific machine (NEW in v2.0)
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_fleet_dispatch", "Dispatch a task to a specific machine in the fleet. Creates task pre-assigned to target.",
  {
    target: z.string().describe("Target machine_id: 'm3_forge', 'm4_mirror', 'gcp_watcher'"),
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    priority: z.number().int().min(1).max(10).default(5),
    payload: z.any().optional(),
  },
async ({ target, title, description, category, priority, payload }) => {
  // Verify target exists
  const machine = await supaFetch(`machine_heartbeats?machine_id=eq.${target}&select=machine_id,status`);
  if (!machine.length) return err(`Machine '${target}' not found in fleet`);

  await supaFetch("task_dispatch", "POST", {
    title,
    description: description || null,
    assigned_to: target,
    status: "assigned",
    category: category || null,
    priority: priority || 5,
    payload: payload || {},
    created_by: MACHINE_ID,
  });
  return ok(`📨 Dispatched to ${target}: ${title} (priority ${priority})`);
});

// ══════════════════════════════════════════════════════════════════════
// T22: mac_identity — report this machine's identity + capabilities
// ══════════════════════════════════════════════════════════════════════
server.tool("mac_identity", "Report this machine's identity, capabilities, and fleet role. Zero params.", {},
async () => {
  const memFree = Math.round(os.freemem() / (1024 ** 3) * 10) / 10;
  const memTotal = Math.round(os.totalmem() / (1024 ** 3));
  const load = os.loadavg();
  const chip = shell("sysctl -n machdep.cpu.brand_string").out || "unknown";
  const hostname = os.hostname();
  const uptime = Math.round(os.uptime() / 3600);

  const lines = [
    `🤖 Machine Identity: ${MACHINE_ID}`,
    `   Hostname: ${hostname}`,
    `   Chip: ${chip}`,
    `   Memory: ${memFree}GB free / ${memTotal}GB total`,
    `   CPU Load: ${load[0].toFixed(1)} (1m) / ${load[1].toFixed(1)} (5m)`,
    `   Uptime: ${uptime}h`,
    `   Server: fractal-mac-link v2.0.0 (Tandem Edition)`,
  ];
  return ok(lines.join("\n"));
});

// ══════════════════════════════════════════════════════════════════════
// ENTRYPOINT
// ══════════════════════════════════════════════════════════════════════
const transport = new StdioServerTransport();
await server.connect(transport);
