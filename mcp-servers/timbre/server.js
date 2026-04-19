#!/usr/bin/env node
/**
 * Timbre MCP Server v1.0 — AI Music Production for Like One Studio
 *
 * Tools:
 *   timbre_status        — Pipeline health check
 *   timbre_separate      — Demucs stem separation (vocals, drums, bass, other)
 *   timbre_list_stems    — List available stems for an artist/track
 *   timbre_generate      — Generate music via ACE-Step (local, unlimited)
 *   timbre_suno          — Generate/remix/extend via Suno API proxy
 *   timbre_list_tracks   — List generated tracks
 *   timbre_master        — AI mastering (placeholder for RoEx/Cryo integration)
 *   timbre_pipeline      — Full pipeline: separate → generate → master
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

// ── constants ─────────────────────────────────────────────────────────
const HOME = os.homedir();
const TIMBRE_DIR = path.join(HOME, "timbre");
const RAW_DIR = path.join(TIMBRE_DIR, "raw");
const STEMS_DIR = path.join(TIMBRE_DIR, "stems");
const TRACKS_DIR = path.join(TIMBRE_DIR, "remixes");
const MASTERS_DIR = path.join(TIMBRE_DIR, "masters");
const VENV = path.join(HOME, "timbre-env");
const ACE_STEP_DIR = path.join(HOME, "ace-step");
const SUNO_PROXY = process.env.SUNO_API_URL || "http://localhost:3000";
const SUNO_COOKIE = process.env.SUNO_COOKIE || "";

// Ensure dirs exist
[RAW_DIR, STEMS_DIR, TRACKS_DIR, MASTERS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── helpers ───────────────────────────────────────────────────────────
function shell(cmd, opts = {}) {
  try {
    const result = execSync(cmd, {
      shell: "/bin/zsh",
      encoding: "utf8",
      timeout: (opts.timeout || 120) * 1000,
      env: {
        ...process.env,
        HOME,
        PATH: `${VENV}/bin:${HOME}/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin`,
      },
      cwd: opts.cwd || TIMBRE_DIR,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { ok: true, out: result.trim(), code: 0 };
  } catch (e) {
    return {
      ok: false,
      out: (e.stdout || "").trim(),
      err: (e.stderr || e.message || "").trim().slice(0, 1000),
      code: e.status || 1,
    };
  }
}

function shellAsync(cmd, opts = {}) {
  return new Promise((resolve) => {
    exec(cmd, {
      shell: "/bin/zsh",
      encoding: "utf8",
      timeout: (opts.timeout || 600) * 1000,
      env: {
        ...process.env,
        HOME,
        PATH: `${VENV}/bin:${HOME}/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin`,
      },
      cwd: opts.cwd || TIMBRE_DIR,
    }, (err, stdout, stderr) => {
      if (err) {
        resolve({ ok: false, out: stdout?.trim() || "", err: (stderr || err.message || "").trim().slice(0, 1000), code: err.code || 1 });
      } else {
        resolve({ ok: true, out: stdout?.trim() || "", code: 0 });
      }
    });
  });
}

function listDir(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => ext ? d.name.endsWith(ext) : true)
    .map(d => {
      const full = path.join(dir, d.name);
      const stat = fs.statSync(full);
      return {
        name: d.name,
        path: full,
        size: `${(stat.size / (1024 * 1024)).toFixed(1)}MB`,
        modified: stat.mtime.toISOString().split("T")[0],
        isDir: d.isDirectory(),
      };
    });
}

async function sunoFetch(endpoint, method = "POST", body = null) {
  try {
    const url = `${SUNO_PROXY}${endpoint}`;
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (SUNO_COOKIE) opts.headers["Cookie"] = SUNO_COOKIE;
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── MCP Server ────────────────────────────────────────────────────────
const server = new McpServer({
  name: "timbre",
  version: "1.0.0",
});

// ── Tool: timbre_status ───────────────────────────────────────────────
server.tool(
  "timbre_status",
  "Pipeline health check — Demucs, ACE-Step, Suno proxy, directories",
  {},
  async () => {
    const demucs = shell("source ~/timbre-env/bin/activate && python3 -m demucs --help 2>&1 | head -1");
    const aceStep = fs.existsSync(path.join(ACE_STEP_DIR, "pyproject.toml"));
    const sunoProxy = await (async () => {
      try {
        const r = await fetch(`${SUNO_PROXY}/api/get_limit`, { signal: AbortSignal.timeout(3000) });
        return r.ok ? "connected" : "error";
      } catch { return "not running"; }
    })();

    const rawFiles = listDir(RAW_DIR);
    const stemDirs = listDir(STEMS_DIR).filter(f => f.isDir);
    const tracks = listDir(TRACKS_DIR, ".wav");

    const status = {
      demucs: demucs.ok ? "installed" : "not found",
      ace_step: aceStep ? "cloned" : "not found",
      suno_proxy: sunoProxy,
      directories: {
        raw: `${rawFiles.length} files`,
        stems: `${stemDirs.length} separated tracks`,
        remixes: `${tracks.length} generated tracks`,
        masters: `${listDir(MASTERS_DIR, ".wav").length} mastered tracks`,
      },
      raw_files: rawFiles.map(f => f.name),
    };

    return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] };
  }
);

// ── Tool: timbre_separate ─────────────────────────────────────────────
server.tool(
  "timbre_separate",
  "Separate audio into stems (vocals, drums, bass, other) using Demucs. Input: path to audio file.",
  {
    input_path: z.string().describe("Path to audio file (WAV/MP3/FLAC)"),
    model: z.string().default("htdemucs_ft").describe("Demucs model: htdemucs_ft (best), htdemucs (fast)"),
    device: z.string().default("mps").describe("Device: mps (Apple Silicon), cpu, cuda"),
  },
  async ({ input_path, model, device }) => {
    const resolved = input_path.replace(/^~/, HOME);
    if (!fs.existsSync(resolved)) {
      return { content: [{ type: "text", text: `Error: file not found: ${resolved}` }] };
    }

    const basename = path.basename(resolved, path.extname(resolved));
    const cmd = `source ${VENV}/bin/activate && python3 -m demucs --name ${model} --out ${STEMS_DIR} --device ${device} "${resolved}"`;

    const result = await shellAsync(cmd, { timeout: 600 });

    if (result.ok) {
      const outputDir = path.join(STEMS_DIR, model, basename);
      const stems = fs.existsSync(outputDir) ? fs.readdirSync(outputDir) : [];
      return {
        content: [{
          type: "text",
          text: `✅ Stems extracted to: ${outputDir}\n\nFiles:\n${stems.map(s => `  - ${s}`).join("\n")}`,
        }],
      };
    } else {
      return { content: [{ type: "text", text: `❌ Separation failed:\n${result.err || result.out}` }] };
    }
  }
);

// ── Tool: timbre_list_stems ───────────────────────────────────────────
server.tool(
  "timbre_list_stems",
  "List all available stems for separated tracks",
  {
    track: z.string().optional().describe("Filter by track name (optional)"),
  },
  async ({ track }) => {
    const models = listDir(STEMS_DIR).filter(f => f.isDir);
    const result = {};

    for (const model of models) {
      const modelDir = path.join(STEMS_DIR, model.name);
      const tracks_in_model = listDir(modelDir).filter(f => f.isDir);

      for (const t of tracks_in_model) {
        if (track && !t.name.includes(track)) continue;
        const stemFiles = listDir(path.join(modelDir, t.name), ".wav");
        result[`${model.name}/${t.name}`] = stemFiles.map(s => ({
          stem: s.name.replace(".wav", ""),
          path: s.path,
          size: s.size,
        }));
      }
    }

    return {
      content: [{
        type: "text",
        text: Object.keys(result).length > 0
          ? JSON.stringify(result, null, 2)
          : "No stems found. Use timbre_separate first.",
      }],
    };
  }
);

// ── Tool: timbre_generate ─────────────────────────────────────────────
server.tool(
  "timbre_generate",
  "Generate music locally via ACE-Step. Free, unlimited, runs on M3.",
  {
    prompt: z.string().describe("Music description (genre, mood, tempo, instruments)"),
    lyrics: z.string().optional().describe("Optional lyrics for the song"),
    duration: z.number().default(30).describe("Duration in seconds (10-600)"),
    bpm: z.number().optional().describe("Beats per minute (40-220)"),
    output_name: z.string().optional().describe("Output filename (without extension)"),
  },
  async ({ prompt, lyrics, duration, bpm, output_name }) => {
    const aceStepPy = path.join(ACE_STEP_DIR, ".venv", "bin", "python");
    if (!fs.existsSync(aceStepPy) && !fs.existsSync(path.join(ACE_STEP_DIR, "pyproject.toml"))) {
      return { content: [{ type: "text", text: "❌ ACE-Step not installed. Run: cd ~/ace-step && uv sync" }] };
    }

    const outName = output_name || `ace-${Date.now()}`;
    const outPath = path.join(TRACKS_DIR, `${outName}.wav`);

    // Build command for ACE-Step CLI
    let cmd = `cd ${ACE_STEP_DIR} && uv run python -m acestep.cli generate`;
    cmd += ` --caption "${prompt.replace(/"/g, '\\"')}"`;
    cmd += ` --duration ${duration}`;
    cmd += ` --device auto --backend pt`;
    if (lyrics) cmd += ` --lyrics "${lyrics.replace(/"/g, '\\"')}"`;
    if (bpm) cmd += ` --bpm ${bpm}`;
    cmd += ` --output "${outPath}"`;

    const result = await shellAsync(cmd, { timeout: 300 });

    if (result.ok || fs.existsSync(outPath)) {
      return {
        content: [{
          type: "text",
          text: `✅ Generated: ${outPath}\n\nPrompt: ${prompt}\nDuration: ${duration}s${bpm ? `\nBPM: ${bpm}` : ""}`,
        }],
      };
    } else {
      return { content: [{ type: "text", text: `❌ Generation failed:\n${result.err || result.out}` }] };
    }
  }
);

// ── Tool: timbre_suno ─────────────────────────────────────────────────
server.tool(
  "timbre_suno",
  "Generate, remix, or extend music via Suno API proxy. Requires Suno Premier + local proxy.",
  {
    action: z.enum(["generate", "custom_generate", "extend", "remix", "stems", "lyrics", "status"])
      .describe("Action: generate, custom_generate, extend, remix, stems, lyrics, status"),
    prompt: z.string().optional().describe("Text prompt for generation"),
    lyrics: z.string().optional().describe("Custom lyrics (for custom_generate)"),
    style: z.string().optional().describe("Music style tag (e.g. 'EDM, 128BPM, festival energy')"),
    title: z.string().optional().describe("Song title"),
    audio_id: z.string().optional().describe("Suno clip ID (for extend/remix/stems)"),
    continue_at: z.number().optional().describe("Seconds to continue from (for extend)"),
  },
  async ({ action, prompt, lyrics, style, title, audio_id, continue_at }) => {
    if (action === "status") {
      const r = await sunoFetch("/api/get_limit", "GET");
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    if (action === "lyrics") {
      const r = await sunoFetch("/api/generate_lyrics", "POST", { prompt: prompt || "write a song" });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    if (action === "generate") {
      const r = await sunoFetch("/api/generate", "POST", {
        prompt: prompt || "upbeat pop song",
        make_instrumental: false,
        wait_audio: true,
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    if (action === "custom_generate") {
      const r = await sunoFetch("/api/custom_generate", "POST", {
        prompt: lyrics || prompt || "",
        tags: style || "pop",
        title: title || "Untitled",
        make_instrumental: false,
        wait_audio: true,
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    if (action === "extend") {
      if (!audio_id) return { content: [{ type: "text", text: "❌ audio_id required for extend" }] };
      const r = await sunoFetch("/api/extend_audio", "POST", {
        audio_id,
        prompt: prompt || "",
        continue_at: continue_at || 0,
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    if (action === "stems") {
      if (!audio_id) return { content: [{ type: "text", text: "❌ audio_id required for stems" }] };
      const r = await sunoFetch("/api/generate_stems", "POST", { audio_id });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    if (action === "remix") {
      if (!audio_id) return { content: [{ type: "text", text: "❌ audio_id required for remix" }] };
      const r = await sunoFetch("/api/custom_generate", "POST", {
        prompt: lyrics || prompt || "",
        tags: style || "remix",
        title: title || "Remix",
        continue_clip_id: audio_id,
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    return { content: [{ type: "text", text: `Unknown action: ${action}` }] };
  }
);

// ── Tool: timbre_list_tracks ──────────────────────────────────────────
server.tool(
  "timbre_list_tracks",
  "List all generated tracks, remixes, and masters",
  {
    category: z.enum(["raw", "stems", "remixes", "masters", "all"]).default("all")
      .describe("Which directory to list"),
  },
  async ({ category }) => {
    const result = {};
    const dirs = {
      raw: RAW_DIR,
      stems: STEMS_DIR,
      remixes: TRACKS_DIR,
      masters: MASTERS_DIR,
    };

    const targets = category === "all" ? Object.keys(dirs) : [category];

    for (const cat of targets) {
      const items = listDir(dirs[cat]);
      result[cat] = items.map(i => ({
        name: i.name,
        size: i.size,
        modified: i.modified,
        ...(i.isDir ? { type: "directory" } : {}),
      }));
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ── Tool: timbre_download ─────────────────────────────────────────────
server.tool(
  "timbre_download",
  "Download audio from YouTube for processing. Uses yt-dlp.",
  {
    url: z.string().describe("YouTube URL"),
    output_name: z.string().describe("Output filename (without extension)"),
    format: z.string().default("wav").describe("Output format: wav, mp3, flac"),
  },
  async ({ url, output_name, format }) => {
    const outPath = path.join(RAW_DIR, `${output_name}.${format}`);
    const cmd = `yt-dlp -x --audio-format ${format} --audio-quality 0 -o "${outPath}" "${url}"`;
    const result = await shellAsync(cmd, { timeout: 120 });

    if (result.ok || fs.existsSync(outPath)) {
      const stat = fs.statSync(outPath);
      return {
        content: [{
          type: "text",
          text: `✅ Downloaded: ${outPath} (${(stat.size / (1024 * 1024)).toFixed(1)}MB)`,
        }],
      };
    } else {
      return { content: [{ type: "text", text: `❌ Download failed:\n${result.err || result.out}` }] };
    }
  }
);

// ── Tool: timbre_pipeline ─────────────────────────────────────────────
server.tool(
  "timbre_pipeline",
  "Full pipeline: download (optional) → separate stems → generate genre versions → master. Returns status of each step.",
  {
    input: z.string().describe("Path to audio file OR YouTube URL"),
    artist: z.string().describe("Artist name (for organizing output)"),
    track_name: z.string().describe("Track name"),
    genres: z.array(z.string()).default(["edm", "kpop", "jpop", "traditional-vietnamese", "classical", "hiphop", "lofi", "pop"])
      .describe("Genres to generate"),
    engine: z.enum(["ace-step", "suno", "both"]).default("ace-step")
      .describe("Generation engine: ace-step (local), suno (API), both"),
  },
  async ({ input, artist, track_name, genres, engine }) => {
    const steps = [];
    let audioPath = input.replace(/^~/, HOME);

    // Step 1: Download if URL
    if (input.startsWith("http")) {
      const outName = `${artist}-${track_name}`.toLowerCase().replace(/\s+/g, "-");
      const outPath = path.join(RAW_DIR, `${outName}.wav`);
      const dl = await shellAsync(`yt-dlp -x --audio-format wav --audio-quality 0 -o "${outPath}" "${input}"`, { timeout: 120 });
      if (dl.ok || fs.existsSync(outPath)) {
        audioPath = outPath;
        steps.push({ step: "download", status: "✅", path: outPath });
      } else {
        steps.push({ step: "download", status: "❌", error: dl.err });
        return { content: [{ type: "text", text: JSON.stringify({ pipeline: "failed", steps }, null, 2) }] };
      }
    }

    // Step 2: Separate stems
    const basename = path.basename(audioPath, path.extname(audioPath));
    const sepCmd = `source ${VENV}/bin/activate && python3 -m demucs --name htdemucs_ft --out ${STEMS_DIR} --device mps "${audioPath}"`;
    const sep = await shellAsync(sepCmd, { timeout: 600 });
    const stemDir = path.join(STEMS_DIR, "htdemucs_ft", basename);

    if (sep.ok || fs.existsSync(path.join(stemDir, "vocals.wav"))) {
      steps.push({ step: "separate", status: "✅", stems: fs.existsSync(stemDir) ? fs.readdirSync(stemDir) : [] });
    } else {
      steps.push({ step: "separate", status: "❌", error: sep.err });
    }

    // Step 3: Genre generation (queued — each genre)
    const genrePrompts = {
      "edm": `${artist} vocal over EDM drop, 128 BPM, festival energy, supersaws, sidechain compression`,
      "kpop": `${artist} vocal over K-pop production, 120 BPM, synth-heavy, 808 bass, trap hi-hats, key change final chorus`,
      "jpop": `${artist} vocal over J-pop arrangement, 140 BPM, jazz chords, guitar prominence, bright mix`,
      "traditional-vietnamese": `${artist} vocal over traditional Vietnamese instruments, dan bau, dan tranh, sao truc, pentatonic scale`,
      "classical": `${artist} vocal over orchestral arrangement, strings, woodwinds, piano, cinematic`,
      "hiphop": `${artist} vocal over hip-hop beat, 90 BPM, 808s, trap patterns, spacious mix`,
      "lofi": `${artist} vocal over lo-fi beat, 80 BPM, vinyl crackle, jazz samples, atmospheric`,
      "pop": `${artist} vocal over pop production, 120 BPM, clean, hook-driven, radio-ready`,
    };

    steps.push({
      step: "generate",
      status: "⏳ queued",
      engine,
      genres: genres,
      note: "Genre generation requires manual trigger via timbre_generate or timbre_suno for each genre",
      prompts: genres.map(g => ({ genre: g, prompt: genrePrompts[g] || `${artist} vocal in ${g} style` })),
    });

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          pipeline: "in_progress",
          artist,
          track: track_name,
          audio_path: audioPath,
          vocal_stem: path.join(stemDir, "vocals.wav"),
          steps,
        }, null, 2),
      }],
    };
  }
);

// ── Start server ──────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
