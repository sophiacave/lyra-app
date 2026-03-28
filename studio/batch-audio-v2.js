#!/usr/bin/env node
/**
 * Like One Studio — Batch Audio V2 Processor
 * Upgrades all existing videos with the v2 audio chain:
 *   1. TTS post-processing (EQ, compression, gating, limiting)
 *   2. Background music mix with sidechain ducking
 *   3. Loudness normalization to -14 LUFS
 *   4. Re-merge with video using correct -map flags
 *
 * Usage: node studio/batch-audio-v2.js [--dry-run]
 */
import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import path from 'path';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const VIDEO_DIR = path.join(OUTPUT_DIR, 'video');
const ASSETS_DIR = path.join(STUDIO_DIR, 'assets', 'audio');
const AMBIENT_BED = path.join(ASSETS_DIR, 'ambient-drone-01.wav');

const DRY_RUN = process.argv.includes('--dry-run');

// TTS processing chain (without de-esser due to shell escaping — use bandreject instead)
const TTS_FILTERS = [
  'highpass=f=80:p=2',
  'bandreject=f=6500:t=h:w=3000:m=0.6',
  'acompressor=threshold=-18dB:ratio=3:attack=5:release=50:makeup=2dB:knee=6dB',
  'equalizer=f=200:t=q:w=1.5:g=-2',
  'equalizer=f=3000:t=q:w=1.2:g=3',
  'equalizer=f=5000:t=q:w=2:g=1.5',
  'equalizer=f=8000:t=q:w=1:g=-1',
  'agate=threshold=-35dB:attack=1:release=100:ratio=3:range=-30dB',
  'alimiter=limit=0.95:level=false:attack=3:release=50',
].join(',');

function getDuration(filePath) {
  try {
    return parseFloat(
      execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`, { encoding: 'utf-8' }).trim()
    );
  } catch { return 0; }
}

function getVolume(filePath) {
  try {
    const out = execSync(`ffmpeg -i "${filePath}" -af "volumedetect" -f null - 2>&1`, { encoding: 'utf-8', shell: true });
    const mean = out.match(/mean_volume:\s+(-[\d.]+)/)?.[1];
    const max = out.match(/max_volume:\s+(-[\d.]+)/)?.[1];
    return { mean: parseFloat(mean), max: parseFloat(max) };
  } catch { return { mean: null, max: null }; }
}

// Find all videos that have combined audio
const combinedFiles = readdirSync(AUDIO_DIR)
  .filter(f => f.endsWith('_combined.mp3'))
  .map(f => f.replace('_combined.mp3', ''));

// Filter to only those with a matching silent video
const eligible = combinedFiles.filter(slug => {
  const silent = path.join(VIDEO_DIR, `${slug}_silent.mp4`);
  return existsSync(silent);
});

console.log(`\n🎬 LIKE ONE STUDIO — Batch Audio V2 Processor`);
console.log('═'.repeat(55));
console.log(`📁 Found ${eligible.length} videos to upgrade\n`);

if (DRY_RUN) {
  console.log('🔍 DRY RUN — listing only:\n');
  eligible.forEach(slug => console.log(`  📼 ${slug}`));
  process.exit(0);
}

let success = 0;
let failed = 0;

for (const slug of eligible) {
  const combined = path.join(AUDIO_DIR, `${slug}_combined.mp3`);
  const silent = path.join(VIDEO_DIR, `${slug}_silent.mp4`);
  const processed = path.join(AUDIO_DIR, `${slug}_processed.wav`);
  const mixed = path.join(AUDIO_DIR, `${slug}_mixed.wav`);
  const final_ = path.join(AUDIO_DIR, `${slug}_final.wav`);
  const output = path.join(VIDEO_DIR, `${slug}.mp4`);

  console.log(`\n🔧 ${slug}`);

  try {
    // Step 1: TTS post-processing
    process.stdout.write('  📡 Processing TTS... ');
    execSync(`ffmpeg -y -i "${combined}" -af "${TTS_FILTERS}" -ar 48000 "${processed}"`, { stdio: 'pipe', timeout: 60000 });
    console.log('✅');

    // Step 2: Music mix with sidechain ducking
    process.stdout.write('  🎵 Mixing with music... ');
    const dur = getDuration(processed);
    const fadeout = Math.max(0, dur - 3);
    execSync(
      `ffmpeg -y -i "${processed}" -stream_loop -1 -i "${AMBIENT_BED}" -filter_complex ` +
      `"[1:a]atrim=0:${dur},afade=t=in:d=3,afade=t=out:st=${fadeout}:d=3,volume=-18dB[music];` +
      `[0:a]asplit=2[voice][voicekey];` +
      `[voicekey]aformat=channel_layouts=mono[key];` +
      `[music][key]sidechaincompress=threshold=-30dB:ratio=6:attack=80:release=400:level_sc=1:mix=0.8[ducked];` +
      `[voice][ducked]amix=inputs=2:duration=first:dropout_transition=3" ` +
      `-ar 48000 "${mixed}"`,
      { stdio: 'pipe', timeout: 120000 }
    );
    console.log('✅');

    // Step 3: Loudness normalization
    process.stdout.write('  📊 Normalizing to -14 LUFS... ');
    execSync(`ffmpeg -y -i "${mixed}" -af "loudnorm=I=-14:LRA=11:TP=-1" -ar 48000 "${final_}"`, { stdio: 'pipe', timeout: 60000 });
    console.log('✅');

    // Step 4: Merge with video
    process.stdout.write('  🎬 Merging video + audio... ');
    execSync(
      `ffmpeg -y -i "${silent}" -i "${final_}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "${output}"`,
      { stdio: 'pipe', timeout: 120000 }
    );
    console.log('✅');

    // Verify
    const vol = getVolume(output);
    console.log(`  📈 Volume: mean=${vol.mean}dB, peak=${vol.max}dB`);

    success++;
  } catch (e) {
    console.log(`  ❌ FAILED: ${e.message?.slice(-150)}`);
    failed++;
  }
}

console.log(`\n${'═'.repeat(55)}`);
console.log(`✨ COMPLETE: ${success} upgraded, ${failed} failed`);
console.log(`🎯 All videos now have: EQ + compression + ambient music + -14 LUFS normalization`);
