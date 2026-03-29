#!/usr/bin/env node
/**
 * Like One Studio — Async TTS Worker V2
 * Generates TTS for all scenes using child process per scene (OS-level timeout).
 * Default: plain TTS (fast, ~15s/scene). --clone flag enables voice cloning (slower).
 *
 * Usage:
 *   node studio/tts-worker.js screenplay.json              # plain TTS (fast)
 *   node studio/tts-worker.js screenplay.json --clone       # voice-cloned (slower)
 *   nohup node studio/tts-worker.js screenplay.json > /tmp/tts-worker.log 2>&1 &
 *
 * Status: output/audio/.tts-status.json
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const STUDIO = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.join(STUDIO, '..');
const AUDIO_DIR = path.join(ROOT, 'output', 'audio');
const STATUS_FILE = path.join(AUDIO_DIR, '.tts-status.json');
const CLIENT = path.join(STUDIO, 'tts', 's2pro-client.js');

const SCENE_TIMEOUT_MS = 300000; // 5 min per scene (S2-Pro on M3 ≈ 1s/char)

if (!existsSync(AUDIO_DIR)) mkdirSync(AUDIO_DIR, { recursive: true });

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''); }

function getDuration(filePath) {
  try {
    return parseFloat(
      execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`, { encoding: 'utf-8' }).trim()
    ) || 0;
  } catch { return 0; }
}

function writeStatus(status) {
  writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

function generateScene(text, outputPath) {
  const cmd = `node "${CLIENT}" --text "${text.replace(/"/g, '\\"')}" --output "${outputPath}"`;

  execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf-8',
    timeout: SCENE_TIMEOUT_MS,
    stdio: 'pipe',
    shell: '/bin/zsh',
  });

  return getDuration(outputPath);
}

// ── Main ──
const screenplayPath = process.argv[2];
if (!screenplayPath || screenplayPath.startsWith('--')) {
  console.error('Usage: node studio/tts-worker.js <screenplay.json> [--clone]');
  process.exit(1);
}

const sp = JSON.parse(readFileSync(path.resolve(screenplayPath), 'utf-8'));
const slug = slugify(sp.title);
const scenesWithDialogue = sp.scenes.filter(s => s.dialogue);

const status = {
  screenplay: sp.title,
  slug,
  total: scenesWithDialogue.length,
  done: 0,
  cached: 0,
  failed: 0,
  status: 'running',
  mode: 'plain',
  started: new Date().toISOString(),
  scenes: {},
};

console.log(`🎙️ TTS WORKER V2 — ${sp.title}`);
console.log(`   ${scenesWithDialogue.length} scenes | Mode: ${USE_CLONE ? 'voice-clone' : 'plain (fast)'}`);
writeStatus(status);

// Check server
try {
  execSync('curl -sf --max-time 5 http://127.0.0.1:8180/v1/health', { stdio: 'pipe' });
} catch {
  status.status = 'error';
  status.error = 'S2-Pro server not running. Start: bash studio/tts/start-s2pro.sh';
  writeStatus(status);
  console.error('❌ S2-Pro server not running');
  process.exit(1);
}
console.log('   ✅ S2-Pro server healthy\n');

for (const scene of scenesWithDialogue) {
  const outPath = path.join(AUDIO_DIR, `${slug}_${scene.id}.wav`);

  // Cache check
  if (existsSync(outPath) && getDuration(outPath) > 0.5) {
    const dur = getDuration(outPath);
    status.scenes[scene.id] = { status: 'cached', duration_s: dur };
    status.done++;
    status.cached++;
    writeStatus(status);
    console.log(`  ♻️  ${scene.id}: cached (${dur.toFixed(1)}s)`);
    continue;
  }

  // Generate via child process (OS-level timeout)
  status.scenes[scene.id] = { status: 'generating' };
  writeStatus(status);

  const t0 = Date.now();

  try {
    const dur = generateScene(scene.dialogue, outPath);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    status.scenes[scene.id] = { status: 'done', duration_s: dur, elapsed_s: parseFloat(elapsed) };
    status.done++;
    writeStatus(status);
    console.log(`  ✅ ${scene.id}: ${dur.toFixed(1)}s (${elapsed}s)`);
  } catch (e) {
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const isTimeout = e.message?.includes('TIMEOUT') || e.killed;

    status.scenes[scene.id] = { status: 'error', error: isTimeout ? `timeout after ${elapsed}s` : e.message?.slice(0, 100) };
    status.failed++;
    status.done++;
    writeStatus(status);
    console.log(`  ❌ ${scene.id}: ${isTimeout ? 'timeout' : e.message?.slice(0, 80)}`);
  }
}

status.status = status.failed > 0 ? 'done_with_errors' : 'complete';
status.finished = new Date().toISOString();
writeStatus(status);

const totalDur = Object.values(status.scenes)
  .filter(s => s.duration_s)
  .reduce((sum, s) => sum + s.duration_s, 0);

console.log(`\n📊 ${status.done - status.failed}/${status.total} done | ${status.cached} cached | ${status.failed} failed`);
console.log(`⏱️  Total audio: ${totalDur.toFixed(1)}s`);
