#!/usr/bin/env node
/**
 * Screenplay TTS Generator
 * Generates Edge TTS audio for each scene in a V5 screenplay JSON.
 * Output: output/audio/{slug}_{scene.id}.wav
 *
 * Usage: node studio/screenplay-tts.js studio/screenplays/what-are-embeddings-v5.json
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const STUDIO = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.join(STUDIO, '..');
const AUDIO_DIR = path.join(ROOT, 'output', 'audio');

if (!existsSync(AUDIO_DIR)) mkdirSync(AUDIO_DIR, { recursive: true });

const VOICE_MAP = {
  faye: 'en-US-AvaNeural',
  sophia: 'en-US-AvaNeural',
  default: 'en-US-AriaNeural',
};

const SAMPLE_RATE = 48000;

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

async function generateSceneTTS(text, voice, outputName) {
  const mp3Path = path.join(AUDIO_DIR, `${outputName}_edge.mp3`);
  const wavPath = path.join(AUDIO_DIR, `${outputName}.wav`);

  // Skip if wav already exists
  if (existsSync(wavPath)) {
    const probe = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`,
      { encoding: 'utf-8' }
    ).trim();
    const dur = parseFloat(probe) || 0;
    if (dur > 0.5) {
      console.log(`  ⏭️  ${outputName}: cached (${dur.toFixed(1)}s)`);
      return { audio_path: wavPath, duration_s: dur };
    }
  }

  // Write text to temp file to avoid shell injection
  const textFile = path.join(AUDIO_DIR, `${outputName}_text.txt`);
  writeFileSync(textFile, text, 'utf-8');

  const t0 = Date.now();
  console.log(`  🔊 ${outputName}: "${text.slice(0, 50)}..." (${text.length} chars)`);

  try {
    execSync(
      `python3 -m edge_tts --voice "${voice}" -f "${textFile}" --write-media "${mp3Path}"`,
      { encoding: 'utf-8', timeout: 60000 }
    );

    // Convert mp3 → wav at 48kHz stereo
    execSync(
      `ffmpeg -y -i "${mp3Path}" -ar ${SAMPLE_RATE} -ac 2 "${wavPath}"`,
      { stdio: 'pipe', timeout: 30000 }
    );

    const probe = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`,
      { encoding: 'utf-8' }
    ).trim();
    const dur = parseFloat(probe) || 5;
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const words = text.split(/\s+/).length;
    const wpm = Math.round((words / dur) * 60);
    console.log(`  ✅ ${outputName}: ${dur.toFixed(1)}s in ${elapsed}s | ${wpm} WPM`);

    return { audio_path: wavPath, duration_s: dur };
  } catch (e) {
    console.error(`  ❌ ${outputName}: ${e.message?.slice(-200)}`);
    return null;
  }
}

async function main() {
  const spPath = process.argv[2];
  if (!spPath) {
    console.log('Usage: node studio/screenplay-tts.js <screenplay.json>');
    process.exit(1);
  }

  const sp = JSON.parse(readFileSync(path.resolve(spPath), 'utf-8'));
  const slug = slugify(sp.title);
  const voice = VOICE_MAP[sp.persona] || VOICE_MAP.default;

  console.log(`\n🎙️  SCREENPLAY TTS — ${sp.title}`);
  console.log(`   Persona: ${sp.persona} → Voice: ${voice}`);
  console.log(`   Scenes: ${sp.scenes.length}\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const scene of sp.scenes) {
    if (!scene.dialogue || scene.dialogue.trim() === '') {
      console.log(`  ⏭️  ${scene.id}: no dialogue (${scene.type})`);
      skipped++;
      continue;
    }

    const outputName = `${slug}_${scene.id}`;
    const result = await generateSceneTTS(scene.dialogue, voice, outputName);
    if (result) {
      generated++;
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Summary: ${generated} generated, ${skipped} skipped, ${failed} failed`);
  console.log(`📁 Output: ${AUDIO_DIR}/`);
}

main();
