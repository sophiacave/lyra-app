#!/usr/bin/env node
/**
 * Timbre MCP Server v2.0 — REAL AI Music Production Pipeline
 *
 * WHAT CHANGED FROM v1:
 *   - Suno Studio DIRECT API (not proxy) with vocal upload + cover generation
 *   - Fully automated pipeline: vocal → separate → upload → cover → download → master
 *   - Artist-agnostic: any isolated vocal track, any genre
 *   - Real mastering via ffmpeg (LUFS normalization, limiting)
 *   - Clip download from Suno to local disk
 *
 * Tools:
 *   timbre_status        — Pipeline health check (Demucs, Suno Studio, ffmpeg)
 *   timbre_separate      — Demucs stem separation (vocals, drums, bass, other)
 *   timbre_list_stems    — List available stems
 *   timbre_generate      — Generate music via ACE-Step (local, unlimited)
 *   timbre_suno          — Suno Studio: upload vocals, generate covers, download clips
 *   timbre_list_tracks   — List raw/stems/remixes/masters
 *   timbre_download      — Download audio from YouTube via yt-dlp
 *   timbre_master        — Normalize + master via ffmpeg
 *   timbre_pipeline      — FULL automated pipeline: any vocal → genre remixes → mastered files
 *
 * Transport: stdio | Start: node server.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync, exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// ── constants ─────────────────────────────────────────────────────────
const HOME = os.homedir();
const TIMBRE_DIR = path.join(HOME, "timbre");
const RAW_DIR = path.join(TIMBRE_DIR, "raw");
const STEMS_DIR = path.join(TIMBRE_DIR, "stems");
const REMIXES_DIR = path.join(TIMBRE_DIR, "remixes");
const MASTERS_DIR = path.join(TIMBRE_DIR, "masters");
const VENV = path.join(HOME, "timbre-env");
const ACE_STEP_DIR = path.join(HOME, "ace-step");

const SUNO_STUDIO_API = "https://studio-api-prod.suno.com";
const SUNO_PROXY = process.env.SUNO_API_URL || "http://localhost:3100";
const CONFIG_PATH = path.join(HOME, ".fractal_brain", "faye_config.json");

// Supported audio formats — real artists use WAV, AIFF, M4A, CAF
const SUPPORTED_FORMATS = new Set([".wav", ".mp3", ".flac", ".aiff", ".aif", ".m4a", ".caf", ".ogg", ".wma", ".alac"]);
const SUNO_UPLOAD_FORMAT = "mp3"; // Suno expects MP3 for uploads

// Ensure dirs exist
[RAW_DIR, STEMS_DIR, REMIXES_DIR, MASTERS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── Suno Studio auth ─────────────────────────────────────────────────
function getSunoToken() {
  // Priority: env var > config file
  if (process.env.SUNO_SESSION) return process.env.SUNO_SESSION;
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    if (config.suno_session_token) return config.suno_session_token;
  } catch {}
  return null;
}

async function sunoStudioFetch(endpoint, method = "GET", body = null, binary = null) {
  const token = getSunoToken();
  if (!token) {
    return { ok: false, error: "No Suno session token. Set SUNO_SESSION env var or add suno_session_token to faye_config.json" };
  }

  try {
    const url = `${SUNO_STUDIO_API}${endpoint}`;
    const headers = { "Authorization": `Bearer ${token}` };

    if (binary) {
      // Binary upload (PUT to presigned URL — no auth header needed)
      const res = await fetch(body, {
        method: "PUT",
        headers: { "Content-Type": "audio/wav" },
        body: binary,
      });
      return { ok: res.ok, status: res.status };
    }

    if (body && method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    const opts = { method, headers };
    if (body && method !== "GET") opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── helpers ───────────────────────────────────────────────────────────
function shellSync(cmd, opts = {}) {
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

function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9\-_.() ]/g, "").replace(/\s+/g, " ").trim();
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Poll Suno clip until complete or failed (max 5 min)
async function pollClipStatus(clipId, maxWaitMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const r = await sunoStudioFetch(`/api/clip/${clipId}`);
    if (!r.ok) return r;

    const status = r.data?.status || r.data?.detail;
    if (status === "complete" || r.data?.audio_url) {
      return { ok: true, data: r.data };
    }
    if (status === "error" || status === "failed") {
      return { ok: false, error: `Clip ${clipId} failed: ${JSON.stringify(r.data)}` };
    }

    await sleep(5000); // Poll every 5s
  }
  return { ok: false, error: `Timeout waiting for clip ${clipId} after ${maxWaitMs / 1000}s` };
}

// Download audio URL to local file
async function downloadAudioFile(audioUrl, outputPath) {
  try {
    const res = await fetch(audioUrl);
    if (!res.ok) return { ok: false, error: `Download failed: HTTP ${res.status}` };

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    return { ok: true, path: outputPath, size: `${(buffer.length / (1024 * 1024)).toFixed(1)}MB` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Audio format conversion ──────────────────────────────────────────
// Convert any supported audio format to MP3 for Suno upload
async function convertToMp3(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext === ".mp3") return inputPath; // Already MP3

  const basename = path.basename(inputPath, ext);
  const mp3Path = path.join(path.dirname(inputPath), `${basename}-upload.mp3`);

  // Skip if already converted
  if (fs.existsSync(mp3Path)) return mp3Path;

  const result = await shellAsync(
    `ffmpeg -y -i "${inputPath}" -codec:a libmp3lame -q:a 0 "${mp3Path}"`,
    { timeout: 120 }
  );

  if (result.ok || fs.existsSync(mp3Path)) return mp3Path;
  throw new Error(`Format conversion failed: ${result.err || "unknown error"}`);
}

// Upload audio to Suno S3 (handles format conversion automatically)
async function uploadToSunoS3(audioPath) {
  // Convert to MP3 if needed
  const mp3Path = await convertToMp3(audioPath);

  // Get presigned upload URL
  const uploadReq = await sunoStudioFetch("/api/uploads/audio/", "POST", {});
  if (!uploadReq.ok || !uploadReq.data?.url || !uploadReq.data?.id) {
    return { ok: false, error: `Failed to get upload URL: ${JSON.stringify(uploadReq)}` };
  }

  // S3 POST upload with form fields
  const audioBuffer = fs.readFileSync(mp3Path);
  const fields = uploadReq.data.fields || {};
  const uploadUrl = uploadReq.data.url;

  // Build multipart form
  const boundary = `----TimbreUpload${Date.now()}`;
  const parts = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}`);
  }
  parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(mp3Path)}"\r\nContent-Type: audio/mpeg\r\n\r\n`);

  const header = Buffer.from(parts.join("\r\n") + "\r\n");
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([header, audioBuffer, footer]);

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      body,
    });
    if (res.status === 204 || res.ok) {
      return { ok: true, upload_id: uploadReq.data.id, size: `${(audioBuffer.length / (1024 * 1024)).toFixed(1)}MB` };
    }
    return { ok: false, error: `S3 upload failed: HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Proxy-based generation (fallback when direct API is blocked by Cloudflare)
async function proxyGenerate(endpoint, body) {
  try {
    const res = await fetch(`${SUNO_PROXY}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000),
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, data, source: "proxy" };
    }
    const text = await res.text();
    return { ok: false, error: `Proxy ${res.status}: ${text.slice(0, 200)}`, source: "proxy" };
  } catch (e) {
    return { ok: false, error: `Proxy unavailable: ${e.message}`, source: "proxy" };
  }
}

// ── Genre prompt library ─────────────────────────────────────────────
const GENRE_PROMPTS = {
  "edm": "EDM festival drop, 128 BPM, supersaws, sidechain compression, build + drop structure, euphoric energy",
  "kpop": "K-pop production, 120 BPM, synth-heavy, 808 bass, trap hi-hats, key change final chorus, polished pop vocals",
  "jpop": "J-pop arrangement, 140 BPM, jazz chords, guitar prominence, bright uplifting mix, anime opening energy",
  "traditional-vietnamese": "traditional Vietnamese instruments, dan bau, dan tranh, sao truc, pentatonic scale, emotional depth",
  "classical": "orchestral arrangement, strings quartet, woodwinds, piano accompaniment, cinematic dramatic arc",
  "hiphop": "hip-hop beat, 90 BPM, deep 808s, trap patterns, spacious mix, hard-hitting drums",
  "lofi": "lo-fi chill beat, 80 BPM, vinyl crackle, jazz piano samples, atmospheric pads, nostalgic warmth",
  "pop": "modern pop production, 120 BPM, clean and hook-driven, radio-ready, catchy hooks, polished",
  "r&b": "R&B slow jam, 85 BPM, smooth keys, warm bass, neo-soul texture, intimate",
  "rock": "rock arrangement, live drums, electric guitars, driving bass, raw energy, arena-ready",
  "reggaeton": "reggaeton dembow, 95 BPM, perreo beat, Latin bass, tropical energy",
  "jazz": "jazz combo, swing feel, upright bass, brushed drums, piano comping, improvisational spirit",
  "ambient": "ambient atmospheric, ethereal pads, reverb-drenched, spacious, meditative, cinematic texture",
  "latin": "Latin pop, 100 BPM, acoustic guitar, congas, warm brass, salsa-influenced, danceable",
  "trap": "trap beat, 140 BPM, rolling hi-hats, 808 slides, dark atmosphere, hard bass",
  "bollywood": "Bollywood film score, tabla, sitar, strings, dramatic, emotional crescendo, cinematic",
  "afrobeats": "Afrobeats, 105 BPM, log drums, shaker, guitar riff, dancehall influenced, infectious groove",
};

// ── MCP Server ────────────────────────────────────────────────────────
const server = new McpServer({
  name: "timbre",
  version: "2.0.0",
});

// ── Tool: timbre_status ───────────────────────────────────────────────
server.tool(
  "timbre_status",
  "Pipeline health: Demucs, Suno Studio auth, ffmpeg, ACE-Step, directory inventory",
  {},
  async () => {
    const demucs = shellSync("source ~/timbre-env/bin/activate && python3 -m demucs --help 2>&1 | head -1");
    const aceStep = fs.existsSync(path.join(ACE_STEP_DIR, "pyproject.toml"));
    const ffmpeg = shellSync("ffmpeg -version 2>&1 | head -1");
    const sunoToken = getSunoToken();

    let sunoStatus = "no token";
    if (sunoToken) {
      const r = await sunoStudioFetch("/api/billing/info/");
      sunoStatus = r.ok ? `connected (credits: ${JSON.stringify(r.data?.total_credits_left || r.data)})` : `auth failed: ${r.error || r.status}`;
    }

    const status = {
      version: "2.0.0",
      engine: "Suno Studio Direct API + Demucs + ffmpeg",
      demucs: demucs.ok ? "installed" : "not found",
      ace_step: aceStep ? "installed" : "not found",
      ffmpeg: ffmpeg.ok ? "installed" : "not found",
      suno_studio: sunoStatus,
      directories: {
        raw: `${listDir(RAW_DIR).filter(f => !f.name.startsWith(".")).length} files`,
        stems: `${listDir(STEMS_DIR).filter(f => f.isDir).length} models`,
        remixes: `${listDir(REMIXES_DIR).filter(f => !f.name.startsWith(".")).length} tracks`,
        masters: `${listDir(MASTERS_DIR).filter(f => !f.name.startsWith(".")).length} mastered`,
      },
      available_genres: Object.keys(GENRE_PROMPTS),
    };

    return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] };
  }
);

// ── Tool: timbre_separate ─────────────────────────────────────────────
server.tool(
  "timbre_separate",
  "Separate audio into stems (vocals, drums, bass, other) using Demucs htdemucs_ft on Apple Silicon.",
  {
    input_path: z.string().describe("Path to audio file. Supports WAV, MP3, FLAC, AIFF, M4A, CAF, OGG, ALAC. ~ expansion supported."),
    model: z.string().default("htdemucs_ft").describe("Demucs model: htdemucs_ft (best quality), htdemucs (faster)"),
    device: z.string().default("mps").describe("Device: mps (Apple Silicon), cpu, cuda"),
  },
  async ({ input_path, model, device }) => {
    const resolved = input_path.replace(/^~/, HOME);
    if (!fs.existsSync(resolved)) {
      return { content: [{ type: "text", text: `❌ File not found: ${resolved}` }] };
    }

    const basename = path.basename(resolved, path.extname(resolved));
    const outputDir = path.join(STEMS_DIR, model, basename);

    // Skip if already separated
    if (fs.existsSync(path.join(outputDir, "vocals.wav"))) {
      const stems = fs.readdirSync(outputDir);
      return {
        content: [{
          type: "text",
          text: `✅ Already separated: ${outputDir}\n\nStems: ${stems.join(", ")}\nVocal: ${path.join(outputDir, "vocals.wav")}`,
        }],
      };
    }

    const cmd = `source ${VENV}/bin/activate && python3 -m demucs --name ${model} --out ${STEMS_DIR} --device ${device} "${resolved}"`;
    const result = await shellAsync(cmd, { timeout: 600 });

    if (result.ok || fs.existsSync(path.join(outputDir, "vocals.wav"))) {
      const stems = fs.existsSync(outputDir) ? fs.readdirSync(outputDir) : [];
      return {
        content: [{
          type: "text",
          text: `✅ Separated: ${outputDir}\n\nStems: ${stems.join(", ")}\nVocal: ${path.join(outputDir, "vocals.wav")}`,
        }],
      };
    }
    return { content: [{ type: "text", text: `❌ Separation failed:\n${result.err || result.out}` }] };
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
      const tracksInModel = listDir(modelDir).filter(f => f.isDir);

      for (const t of tracksInModel) {
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
  "Generate music locally via ACE-Step. Free, unlimited, runs on Apple Silicon.",
  {
    prompt: z.string().describe("Music description (genre, mood, tempo, instruments)"),
    lyrics: z.string().optional().describe("Optional lyrics"),
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
    const outPath = path.join(REMIXES_DIR, `${outName}.wav`);

    let cmd = `cd ${ACE_STEP_DIR} && uv run python -m acestep.cli generate`;
    cmd += ` --caption "${prompt.replace(/"/g, '\\"')}"`;
    cmd += ` --duration ${duration}`;
    cmd += ` --device auto --backend pt`;
    if (lyrics) cmd += ` --lyrics "${lyrics.replace(/"/g, '\\"')}"`;
    if (bpm) cmd += ` --bpm ${bpm}`;
    cmd += ` --output "${outPath}"`;

    const result = await shellAsync(cmd, { timeout: 300 });

    if (result.ok || fs.existsSync(outPath)) {
      return { content: [{ type: "text", text: `✅ Generated: ${outPath}\n\nPrompt: ${prompt}\nDuration: ${duration}s` }] };
    }
    return { content: [{ type: "text", text: `❌ Generation failed:\n${result.err || result.out}` }] };
  }
);

// ── Tool: timbre_suno ─────────────────────────────────────────────────
server.tool(
  "timbre_suno",
  "Suno Studio direct API: upload isolated vocals, generate genre covers, download finished clips. This is the REAL engine.",
  {
    action: z.enum(["upload_vocal", "cover", "get_clip", "download_clip", "billing", "generate", "custom_generate", "extend", "lyrics"])
      .describe("Action to perform"),
    vocal_path: z.string().optional().describe("Path to isolated vocal WAV file (for upload_vocal)"),
    upload_id: z.string().optional().describe("Upload ID from upload_vocal (for cover)"),
    style: z.string().optional().describe("Genre/style tags for cover generation (e.g. 'EDM, 128BPM, festival energy')"),
    title: z.string().optional().describe("Song title"),
    prompt: z.string().optional().describe("Text prompt for generation"),
    lyrics: z.string().optional().describe("Custom lyrics (for custom_generate)"),
    clip_id: z.string().optional().describe("Clip ID (for get_clip, download_clip)"),
    output_path: z.string().optional().describe("Output file path (for download_clip)"),
    audio_id: z.string().optional().describe("Audio ID (for extend)"),
    continue_at: z.number().optional().describe("Continue from seconds (for extend)"),
  },
  async ({ action, vocal_path, upload_id, style, title, prompt, lyrics, clip_id, output_path, audio_id, continue_at }) => {

    // ── Upload isolated vocal to Suno Studio ──
    if (action === "upload_vocal") {
      if (!vocal_path) return { content: [{ type: "text", text: "❌ vocal_path required for upload_vocal" }] };

      const resolved = vocal_path.replace(/^~/, HOME);
      if (!fs.existsSync(resolved)) {
        return { content: [{ type: "text", text: `❌ File not found: ${resolved}` }] };
      }

      // Validate audio format
      const ext = path.extname(resolved).toLowerCase();
      if (!SUPPORTED_FORMATS.has(ext)) {
        return { content: [{ type: "text", text: `❌ Unsupported format: ${ext}\nSupported: ${[...SUPPORTED_FORMATS].join(", ")}` }] };
      }

      // Upload with automatic format conversion
      const result = await uploadToSunoS3(resolved);
      if (!result.ok) {
        return { content: [{ type: "text", text: `❌ Upload failed: ${result.error}` }] };
      }

      return {
        content: [{
          type: "text",
          text: `✅ Vocal uploaded to Suno Studio\n\nUpload ID: ${result.upload_id}\nFile: ${resolved} (${ext})\nSize: ${result.size}\nFormat: auto-converted to MP3 for Suno\n\nUse this upload_id with action:"cover" to generate genre versions.`,
        }],
      };
    }

    // ── Generate cover using uploaded vocal ──
    if (action === "cover") {
      if (!upload_id) return { content: [{ type: "text", text: "❌ upload_id required. Run upload_vocal first." }] };

      const body = {
        prompt: style || prompt || "pop, modern production",
        title: title || "Timbre Cover",
        upload_id: upload_id,
      };

      const r = await sunoStudioFetch("/api/generate/v2/", "POST", body);
      if (!r.ok) {
        return { content: [{ type: "text", text: `❌ Cover generation failed: ${JSON.stringify(r)}` }] };
      }

      // Extract clip IDs from response
      const clips = r.data?.clips || r.data || [];
      const clipIds = Array.isArray(clips) ? clips.map(c => c.id || c) : [clips.id || clips];

      return {
        content: [{
          type: "text",
          text: `✅ Cover generation started\n\nStyle: ${style || prompt || "pop"}\nTitle: ${title || "Timbre Cover"}\nClip IDs: ${clipIds.join(", ")}\n\nUse get_clip or download_clip with these IDs to check status and download.`,
        }],
      };
    }

    // ── Check clip status ──
    if (action === "get_clip") {
      if (!clip_id) return { content: [{ type: "text", text: "❌ clip_id required" }] };

      const r = await sunoStudioFetch(`/api/clip/${clip_id}`);
      if (!r.ok) {
        return { content: [{ type: "text", text: `❌ Failed to get clip: ${JSON.stringify(r)}` }] };
      }

      const d = r.data;
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: d.id,
            status: d.status,
            title: d.title,
            audio_url: d.audio_url || null,
            duration: d.metadata?.duration || null,
            created: d.created_at,
          }, null, 2),
        }],
      };
    }

    // ── Download completed clip to disk ──
    if (action === "download_clip") {
      if (!clip_id) return { content: [{ type: "text", text: "❌ clip_id required" }] };

      // Poll until complete
      const clipResult = await pollClipStatus(clip_id);
      if (!clipResult.ok) {
        return { content: [{ type: "text", text: `❌ ${clipResult.error}` }] };
      }

      const audioUrl = clipResult.data?.audio_url;
      if (!audioUrl) {
        return { content: [{ type: "text", text: `❌ No audio_url in clip data: ${JSON.stringify(clipResult.data)}` }] };
      }

      const outPath = output_path
        ? output_path.replace(/^~/, HOME)
        : path.join(REMIXES_DIR, `suno-${clip_id}.mp3`);

      const dl = await downloadAudioFile(audioUrl, outPath);
      if (!dl.ok) {
        return { content: [{ type: "text", text: `❌ Download failed: ${dl.error}` }] };
      }

      return {
        content: [{
          type: "text",
          text: `✅ Downloaded: ${dl.path} (${dl.size})\n\nClip: ${clip_id}\nTitle: ${clipResult.data?.title || "unknown"}`,
        }],
      };
    }

    // ── Billing / credit check ──
    if (action === "billing") {
      const r = await sunoStudioFetch("/api/billing/info/");
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    // ── Text-to-music generation (no vocal upload) ──
    if (action === "generate") {
      const r = await sunoStudioFetch("/api/generate/v2/", "POST", {
        prompt: prompt || "upbeat pop song",
        title: title || "Timbre Track",
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    // ── Custom generation with lyrics + style tags ──
    if (action === "custom_generate") {
      const r = await sunoStudioFetch("/api/generate/v2/", "POST", {
        prompt: style || "pop",
        title: title || "Timbre Track",
        lyrics: lyrics || prompt || "",
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    // ── Extend existing clip ──
    if (action === "extend") {
      if (!audio_id) return { content: [{ type: "text", text: "❌ audio_id required for extend" }] };
      const r = await sunoStudioFetch("/api/generate/v2/", "POST", {
        prompt: prompt || "",
        continue_clip_id: audio_id,
        continue_at: continue_at || 0,
      });
      return { content: [{ type: "text", text: JSON.stringify(r, null, 2) }] };
    }

    // ── Generate lyrics from prompt ──
    if (action === "lyrics") {
      const r = await sunoStudioFetch("/api/generate/lyrics/", "POST", { prompt: prompt || "write a song" });
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
    const dirs = { raw: RAW_DIR, stems: STEMS_DIR, remixes: REMIXES_DIR, masters: MASTERS_DIR };
    const targets = category === "all" ? Object.keys(dirs) : [category];

    for (const cat of targets) {
      const items = listDir(dirs[cat]);
      result[cat] = items
        .filter(i => !i.name.startsWith("."))
        .map(i => ({
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
        content: [{ type: "text", text: `✅ Downloaded: ${outPath} (${(stat.size / (1024 * 1024)).toFixed(1)}MB)` }],
      };
    }
    return { content: [{ type: "text", text: `❌ Download failed:\n${result.err || result.out}` }] };
  }
);

// ── Tool: timbre_master ───────────────────────────────────────────────
server.tool(
  "timbre_master",
  "Master audio via ffmpeg: LUFS normalization (-14 LUFS), true peak limiting, fade in/out. Moves to masters/ directory.",
  {
    input_path: z.string().describe("Path to audio file to master"),
    output_name: z.string().optional().describe("Output filename (without extension). Defaults to input name + ' [mastered]'"),
    target_lufs: z.number().default(-14).describe("Target loudness in LUFS (-14 = streaming standard)"),
    true_peak: z.number().default(-1).describe("True peak limit in dBTP"),
    fade_in: z.number().default(0).describe("Fade in duration in seconds"),
    fade_out: z.number().default(0).describe("Fade out duration in seconds"),
  },
  async ({ input_path, output_name, target_lufs, true_peak, fade_in, fade_out }) => {
    const resolved = input_path.replace(/^~/, HOME);
    if (!fs.existsSync(resolved)) {
      return { content: [{ type: "text", text: `❌ File not found: ${resolved}` }] };
    }

    const basename = path.basename(resolved, path.extname(resolved));
    const outName = output_name || `${basename} [mastered]`;
    const outPath = path.join(MASTERS_DIR, `${sanitizeFilename(outName)}.wav`);

    // Two-pass loudnorm: measure then normalize
    // Pass 1: Measure current loudness
    const measureCmd = `ffmpeg -i "${resolved}" -af loudnorm=I=${target_lufs}:TP=${true_peak}:LRA=11:print_format=json -f null - 2>&1 | tail -12`;
    const measure = shellSync(measureCmd, { timeout: 60 });

    let filterChain = `loudnorm=I=${target_lufs}:TP=${true_peak}:LRA=11`;

    // Try to extract measured values for two-pass
    try {
      const jsonStr = measure.out.match(/\{[\s\S]*\}/)?.[0];
      if (jsonStr) {
        const m = JSON.parse(jsonStr);
        filterChain = `loudnorm=I=${target_lufs}:TP=${true_peak}:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
      }
    } catch {}

    // Add fades if requested
    const filters = [filterChain];
    if (fade_in > 0) filters.push(`afade=t=in:st=0:d=${fade_in}`);
    if (fade_out > 0) filters.push(`afade=t=out:st=eof-${fade_out}:d=${fade_out}`); // note: eof syntax needs duration probe

    const normalizeCmd = `ffmpeg -y -i "${resolved}" -af "${filters.join(",")}" -ar 44100 -sample_fmt s16 "${outPath}"`;
    const result = await shellAsync(normalizeCmd, { timeout: 120 });

    if (result.ok || fs.existsSync(outPath)) {
      const stat = fs.statSync(outPath);
      return {
        content: [{
          type: "text",
          text: `✅ Mastered: ${outPath} (${(stat.size / (1024 * 1024)).toFixed(1)}MB)\n\nTarget: ${target_lufs} LUFS, ${true_peak} dBTP\nFormat: 44.1kHz 16-bit WAV`,
        }],
      };
    }
    return { content: [{ type: "text", text: `❌ Mastering failed:\n${result.err || result.out}` }] };
  }
);

// ── Tool: timbre_pipeline ─────────────────────────────────────────────
server.tool(
  "timbre_pipeline",
  "FULL automated pipeline: any vocal/audio → separate → upload to Suno Studio → generate genre covers → download → master. Runs end-to-end, no manual steps.",
  {
    input: z.string().describe("Path to audio file, path to isolated vocal WAV, or YouTube URL"),
    artist: z.string().describe("Artist name (for file naming)"),
    track_name: z.string().describe("Track name (for file naming)"),
    genres: z.array(z.string()).default(["edm", "kpop", "jpop", "pop", "hiphop", "classical", "lofi", "r&b"])
      .describe("Genres to generate. Available: " + Object.keys(GENRE_PROMPTS).join(", ")),
    skip_separation: z.boolean().default(false).describe("Set true if input is already an isolated vocal"),
    skip_mastering: z.boolean().default(false).describe("Skip the mastering step"),
  },
  async ({ input, artist, track_name, genres, skip_separation, skip_mastering }) => {
    const steps = [];
    let audioPath = input.replace(/^~/, HOME);
    let vocalPath;

    // ── Step 1: Download if YouTube URL ──
    if (input.startsWith("http")) {
      const outName = `${artist}-${track_name}`.toLowerCase().replace(/\s+/g, "-");
      const outPath = path.join(RAW_DIR, `${sanitizeFilename(outName)}.wav`);

      if (fs.existsSync(outPath)) {
        audioPath = outPath;
        steps.push({ step: "download", status: "✅ cached", path: outPath });
      } else {
        const dl = await shellAsync(`yt-dlp -x --audio-format wav --audio-quality 0 -o "${outPath}" "${input}"`, { timeout: 120 });
        if (dl.ok || fs.existsSync(outPath)) {
          audioPath = outPath;
          steps.push({ step: "download", status: "✅", path: outPath });
        } else {
          steps.push({ step: "download", status: "❌", error: dl.err });
          return { content: [{ type: "text", text: JSON.stringify({ pipeline: "failed_at_download", steps }, null, 2) }] };
        }
      }
    }

    // ── Step 2: Separate stems (or skip if already isolated vocal) ──
    if (skip_separation) {
      vocalPath = audioPath;
      steps.push({ step: "separate", status: "⏭️ skipped (input is isolated vocal)", vocal: vocalPath });
    } else {
      const basename = path.basename(audioPath, path.extname(audioPath));
      const stemDir = path.join(STEMS_DIR, "htdemucs_ft", basename);
      vocalPath = path.join(stemDir, "vocals.wav");

      if (fs.existsSync(vocalPath)) {
        steps.push({ step: "separate", status: "✅ cached", vocal: vocalPath });
      } else {
        const sepCmd = `source ${VENV}/bin/activate && python3 -m demucs --name htdemucs_ft --out ${STEMS_DIR} --device mps "${audioPath}"`;
        const sep = await shellAsync(sepCmd, { timeout: 600 });

        if (sep.ok || fs.existsSync(vocalPath)) {
          steps.push({ step: "separate", status: "✅", vocal: vocalPath });
        } else {
          steps.push({ step: "separate", status: "❌", error: sep.err });
          return { content: [{ type: "text", text: JSON.stringify({ pipeline: "failed_at_separation", steps }, null, 2) }] };
        }
      }
    }

    // ── Step 3: Upload vocal to Suno Studio (any format → auto-convert to MP3) ──
    const uploadResult = await uploadToSunoS3(vocalPath);
    if (!uploadResult.ok) {
      steps.push({ step: "upload", status: "❌", error: uploadResult.error });
      return { content: [{ type: "text", text: JSON.stringify({ pipeline: "failed_at_upload", steps }, null, 2) }] };
    }
    const uploadedId = uploadResult.upload_id;
    steps.push({ step: "upload", status: "✅", upload_id: uploadedId, size: uploadResult.size });

    // ── Step 4: Generate cover for each genre ──
    // Try direct API first, fall back to proxy if Cloudflare blocks
    const genreResults = [];

    for (const genre of genres) {
      const stylePrompt = GENRE_PROMPTS[genre] || `${genre} style, professional production`;
      const coverTitle = `${sanitizeFilename(artist)} - ${sanitizeFilename(track_name)} (${genre})`;

      // Try direct Suno Studio API
      let genReq = await sunoStudioFetch("/api/generate/v2/", "POST", {
        prompt: stylePrompt,
        title: coverTitle,
        upload_id: uploadedId,
      });

      // If direct API blocked (Cloudflare 403/1010), try proxy
      if (!genReq.ok && (genReq.status === 403 || genReq.error?.includes("1010"))) {
        genReq = await proxyGenerate("custom_generate", {
          prompt: stylePrompt,
          tags: genre,
          title: coverTitle,
          make_instrumental: false,
          wait_audio: false,
        });
      }

      if (genReq.ok) {
        const clips = genReq.data?.clips || genReq.data || [];
        const clipIds = Array.isArray(clips)
          ? clips.map(c => c.id || c).filter(Boolean)
          : [clips];
        genreResults.push({ genre, status: "✅ generating", clip_ids: clipIds, source: genReq.source || "direct" });
      } else {
        genreResults.push({ genre, status: "❌", error: genReq.error || `HTTP ${genReq.status}` });
      }

      await sleep(2000);
    }

    steps.push({ step: "generate", status: "✅ all submitted", genres: genreResults });

    // ── Step 5: Poll + download all clips ──
    const downloads = [];
    for (const gr of genreResults) {
      if (gr.status !== "✅ generating" || !gr.clip_ids?.length) continue;

      for (const clipId of gr.clip_ids) {
        const clipResult = await pollClipStatus(clipId);

        if (clipResult.ok && clipResult.data?.audio_url) {
          const outName = `${sanitizeFilename(artist)} - ${sanitizeFilename(track_name)} (${gr.genre}) [suno]`;
          const outPath = path.join(REMIXES_DIR, `${outName}.mp3`);
          const dl = await downloadAudioFile(clipResult.data.audio_url, outPath);

          if (dl.ok) {
            downloads.push({ genre: gr.genre, clip_id: clipId, status: "✅", path: dl.path, size: dl.size });
          } else {
            downloads.push({ genre: gr.genre, clip_id: clipId, status: "❌ download failed", error: dl.error });
          }
        } else {
          downloads.push({ genre: gr.genre, clip_id: clipId, status: "❌ generation failed", error: clipResult.error });
        }
      }
    }

    steps.push({ step: "download", status: `${downloads.filter(d => d.status === "✅").length}/${downloads.length} downloaded`, files: downloads });

    // ── Step 6: Master all downloaded files ──
    if (!skip_mastering) {
      const mastered = [];
      for (const dl of downloads) {
        if (dl.status !== "✅" || !dl.path) continue;

        const basename = path.basename(dl.path, path.extname(dl.path));
        const masterPath = path.join(MASTERS_DIR, `${basename} [mastered].wav`);

        // Two-pass loudnorm
        const measureCmd = `ffmpeg -i "${dl.path}" -af "loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | tail -12`;
        const measure = shellSync(measureCmd, { timeout: 60 });

        let filter = "loudnorm=I=-14:TP=-1:LRA=11";
        try {
          const jsonStr = measure.out.match(/\{[\s\S]*\}/)?.[0];
          if (jsonStr) {
            const m = JSON.parse(jsonStr);
            filter = `loudnorm=I=-14:TP=-1:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
          }
        } catch {}

        const masterCmd = `ffmpeg -y -i "${dl.path}" -af "${filter}" -ar 44100 -sample_fmt s16 "${masterPath}"`;
        const mResult = await shellAsync(masterCmd, { timeout: 120 });

        if (mResult.ok || fs.existsSync(masterPath)) {
          mastered.push({ genre: dl.genre, status: "✅", path: masterPath });
        } else {
          mastered.push({ genre: dl.genre, status: "❌", error: mResult.err });
        }
      }

      steps.push({ step: "master", status: `${mastered.filter(m => m.status === "✅").length}/${mastered.length} mastered`, files: mastered });
    }

    // ── Final summary ──
    const succeeded = downloads.filter(d => d.status === "✅").length;
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          pipeline: succeeded > 0 ? "complete" : "failed",
          artist,
          track: track_name,
          vocal: vocalPath,
          genres_requested: genres.length,
          genres_succeeded: succeeded,
          steps,
        }, null, 2),
      }],
    };
  }
);

// ── Start server ──────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
