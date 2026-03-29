#!/usr/bin/env node
/**
 * Like One Studio — Sound Design Engine
 * 5-layer audio composition: narration + music + SFX + room tone + silence.
 *
 * Layers:
 *   1. Narration  — TTS output (the voice track)
 *   2. Music      — Background ambient/subtle bed (ducked under voice)
 *   3. SFX        — Transition sounds between sections (whooshes, chimes, etc.)
 *   4. Room tone  — Subtle low noise floor for broadcast feel
 *   5. Silence    — Gaps between sections per pacing engine
 *
 * All mixing via ffmpeg. Zero external audio deps.
 *
 * Module usage:
 *   import { mixAudio } from './studio/lib/sound-design.js';
 *   const result = await mixAudio('output/audio/lesson_narration.wav', config);
 *
 * CLI usage:
 *   node studio/lib/sound-design.js output/audio/lesson_narration.wav content/configs/some-config.json
 *   node studio/lib/sound-design.js output/audio/lesson_narration.wav content/configs/some-config.json --output output/audio/final.wav
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { PACING, buildTimingMap, calculateGapS } from './pacing-engine.js';
import {
  mixWithMusic, buildSFXTrack, normalizeLoudness,
  verifyLoudness, AUDIO,
} from './audio-engine.js';

const STUDIO_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ASSETS_DIR = path.join(STUDIO_DIR, 'assets', 'audio');
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');

// ── Layer Constants ──

const ROOM_TONE_DB = -42;       // Very subtle noise floor
const ROOM_TONE_FREQ = 120;     // Low frequency hum (Hz)
const ROOM_TONE_BANDWIDTH = 80; // Bandwidth for filtered noise

// SFX mapping: section type -> asset filename + volume
const SFX_MAP = {
  title:    { file: 'sfx-impact.wav',  db: AUDIO.SFX_IMPACT_DB, delayMs: 500 },
  concept:  { file: 'sfx-whoosh.wav',  db: AUDIO.SFX_WHOOSH_DB, delayMs: 0 },
  code:     { file: 'sfx-whoosh.wav',  db: AUDIO.SFX_WHOOSH_DB, delayMs: 0 },
  quote:    { file: 'sfx-swell.wav',   db: AUDIO.SFX_SWELL_DB,  delayMs: 0 },
  comparison:     { file: 'sfx-pop.wav',    db: AUDIO.SFX_POP_DB,    delayMs: 0 },
  'stat-reveal':  { file: 'sfx-impact.wav', db: AUDIO.SFX_IMPACT_DB, delayMs: 200 },
  'icon-reveal':  { file: 'sfx-pop.wav',    db: AUDIO.SFX_POP_DB,    delayMs: 100 },
  'process-flow': { file: 'sfx-tick.wav',   db: AUDIO.SFX_POP_DB,    delayMs: 0 },
  outro:    { file: 'sfx-chime.wav',   db: AUDIO.SFX_CHIME_DB,  delayMs: 800 },
};

// ── Helper: Get audio duration via ffprobe ──

function getAudioDuration(filePath) {
  try {
    const probe = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim();
    return parseFloat(probe) || 0;
  } catch {
    return 0;
  }
}

// ── Layer 2: Background Music ──

/**
 * Build the background music layer.
 * Uses an ambient music file if available, otherwise generates a subtle
 * sine-wave drone as a placeholder bed.
 *
 * @param {number} durationS - Total duration in seconds
 * @param {string} outputPath - Output WAV path
 * @param {object} [opts] - Options
 * @param {string} [opts.musicFile] - Custom music file path
 * @returns {boolean} Success
 */
function buildMusicLayer(durationS, outputPath, opts = {}) {
  const musicFile = opts.musicFile || path.join(ASSETS_DIR, 'ambient-drone-01.wav');

  if (existsSync(musicFile)) {
    // Loop ambient music to fill duration, with fade in/out
    const fadeOutStart = Math.max(0, durationS - 3);
    const cmd = `ffmpeg -y -stream_loop -1 -i "${musicFile}" -af "atrim=0:${durationS},afade=t=in:d=3,afade=t=out:st=${fadeOutStart}:d=3,volume=${AUDIO.MUSIC_BASE_DB}dB" -ar ${AUDIO.SAMPLE_RATE} -t ${durationS} "${outputPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe', timeout: 60000 });
      return true;
    } catch (e) {
      console.error(`  ⚠️  Music loop failed: ${e.message?.slice(-100)}`);
    }
  }

  // Fallback: generate a subtle sine-wave drone as placeholder music bed
  // Low A (110Hz) + fifth (165Hz) at very low volume for ambient feel
  const fadeOutStart = Math.max(0, durationS - 3);
  const cmd = `ffmpeg -y -f lavfi -i "sine=frequency=110:duration=${durationS}" -f lavfi -i "sine=frequency=165:duration=${durationS}" -filter_complex "[0:a]volume=-30dB[a];[1:a]volume=-33dB[b];[a][b]amix=inputs=2:duration=first,afade=t=in:d=3,afade=t=out:st=${fadeOutStart}:d=3" -ar ${AUDIO.SAMPLE_RATE} -t ${durationS} "${outputPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`  ⚠️  Music placeholder generation failed: ${e.message?.slice(-100)}`);
    return false;
  }
}

// ── Layer 3: SFX ──

/**
 * Build the SFX layer from timeline events.
 * Places transition sounds at section boundaries based on section type.
 *
 * @param {Array} timeline - Timing map from pacing engine
 * @param {number} durationS - Total duration in seconds
 * @param {string} outputPath - Output WAV path
 * @returns {{success: boolean, eventCount: number}}
 */
function buildSFXLayer(timeline, durationS, outputPath) {
  // Map timeline entries to SFX events
  const sfxEvents = [];

  for (const entry of timeline) {
    const mapping = SFX_MAP[entry.type];
    if (!mapping) continue;

    const sfxPath = path.join(ASSETS_DIR, mapping.file);
    if (!existsSync(sfxPath)) {
      // Generate a simple transition tone if asset is missing
      const genPath = path.join(AUDIO_DIR, `_gen_${mapping.file}`);
      if (!existsSync(genPath)) {
        generateTransitionTone(entry.type, genPath);
      }
      if (existsSync(genPath)) {
        const timestampMs = Math.round((entry.startFrame / PACING.FPS) * 1000) + mapping.delayMs;
        sfxEvents.push({ path: genPath, timestampMs, volumeDb: mapping.db });
      }
      continue;
    }

    const timestampMs = Math.round((entry.startFrame / PACING.FPS) * 1000) + mapping.delayMs;
    sfxEvents.push({ path: sfxPath, timestampMs, volumeDb: mapping.db });
  }

  // Use the audio-engine's buildSFXTrack for the heavy lifting
  const success = buildSFXTrack(sfxEvents, durationS, outputPath);
  return { success, eventCount: sfxEvents.length };
}

/**
 * Generate a simple transition tone via ffmpeg when SFX assets are missing.
 * Creates different tonal characteristics per section type.
 *
 * @param {string} sectionType - The section type
 * @param {string} outputPath - Output WAV path
 */
function generateTransitionTone(sectionType, outputPath) {
  const outDir = path.dirname(outputPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  let cmd;
  switch (sectionType) {
    case 'title':
    case 'stat-reveal':
      // Deep impact: low sine sweep with quick decay
      cmd = `ffmpeg -y -f lavfi -i "sine=frequency=80:duration=0.5" -af "afade=t=out:d=0.4,volume=-8dB" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      break;
    case 'outro':
      // Chime: higher frequency with gentle decay
      cmd = `ffmpeg -y -f lavfi -i "sine=frequency=880:duration=1.0" -af "afade=t=out:d=0.8,volume=-16dB" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      break;
    case 'concept':
    case 'code':
      // Whoosh: filtered noise sweep
      cmd = `ffmpeg -y -f lavfi -i "anoisesrc=d=0.3:c=pink:a=0.3" -af "afade=t=in:d=0.1,afade=t=out:d=0.2,highpass=f=500,lowpass=f=4000,volume=-12dB" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      break;
    case 'quote':
      // Swell: gentle sine rise
      cmd = `ffmpeg -y -f lavfi -i "sine=frequency=440:duration=0.8" -af "afade=t=in:d=0.4,afade=t=out:d=0.4,volume=-18dB" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      break;
    default:
      // Generic pop: short high tone
      cmd = `ffmpeg -y -f lavfi -i "sine=frequency=660:duration=0.15" -af "afade=t=out:d=0.1,volume=-20dB" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      break;
  }

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 10000 });
  } catch {
    // Non-fatal — SFX is optional
  }
}

// ── Layer 4: Room Tone ──

/**
 * Generate a subtle room tone (low noise floor) for broadcast feel.
 * Uses filtered pink noise to simulate studio ambiance.
 *
 * @param {number} durationS - Total duration in seconds
 * @param {string} outputPath - Output WAV path
 * @returns {boolean} Success
 */
function buildRoomToneLayer(durationS, outputPath) {
  // Pink noise filtered to low frequencies, very quiet
  // This prevents "dead air" and gives a professional broadcast feel
  const cmd = `ffmpeg -y -f lavfi -i "anoisesrc=d=${durationS}:c=pink:a=0.02" -af "lowpass=f=${ROOM_TONE_FREQ + ROOM_TONE_BANDWIDTH}:p=2,highpass=f=40:p=2,volume=${ROOM_TONE_DB}dB" -ar ${AUDIO.SAMPLE_RATE} -t ${durationS} "${outputPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`  ⚠️  Room tone generation failed: ${e.message?.slice(-100)}`);
    return false;
  }
}

// ── Layer 5: Silence (Gaps) ──
// Silence gaps are already built into the narration track by tts-engine.js.
// The pacing engine's calculateGapS determines gap durations between sections.
// This layer is represented in the final mix by the gaps in the narration track
// and the overall timeline structure from buildTimingMap.

// ── Master Mix ──

/**
 * Mix all 5 layers into a final stereo audio file.
 *
 * @param {string} narrationPath - Path to narration WAV (Layer 1 + Layer 5 gaps)
 * @param {object} config - Screenplay config JSON
 * @param {object} [opts] - Options
 * @param {string} [opts.output] - Custom output path
 * @param {string} [opts.musicFile] - Custom music file path
 * @param {boolean} [opts.skipNormalize] - Skip final loudness normalization
 * @returns {Promise<{
 *   outputPath: string,
 *   totalDuration_s: number,
 *   layers: {narration: boolean, music: boolean, sfx: boolean, roomTone: boolean, silence: boolean},
 *   loudness: {lufs: number|null, truePeak: number|null, pass: boolean},
 * }>}
 */
export async function mixAudio(narrationPath, config, opts = {}) {
  const resolvedNarration = path.resolve(narrationPath);
  if (!existsSync(resolvedNarration)) {
    throw new Error(`Narration file not found: ${resolvedNarration}`);
  }

  // If config is a string path, load it
  if (typeof config === 'string') {
    const configPath = path.resolve(config);
    if (!existsSync(configPath)) {
      throw new Error(`Config not found: ${configPath}`);
    }
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  }

  const slug = config.slug || config.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'lesson';

  // Ensure output dirs
  [OUTPUT_DIR, AUDIO_DIR].forEach(d => {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  });

  console.log(`\n🎚️  Sound Design — ${config.title || slug}`);
  console.log('─'.repeat(50));

  // Get narration duration (this is our master clock)
  const narrationDuration = getAudioDuration(resolvedNarration);
  if (narrationDuration <= 0) {
    throw new Error(`Cannot read narration audio duration: ${resolvedNarration}`);
  }

  // Build timing map for SFX placement
  const { timeline, totalDurationS } = buildTimingMap(config, PACING.FPS);

  // Use whichever is longer: narration audio or calculated timeline
  const masterDuration = Math.max(narrationDuration, totalDurationS);

  console.log(`  ⏱️  Narration: ${narrationDuration.toFixed(1)}s | Timeline: ${totalDurationS.toFixed(1)}s | Master: ${masterDuration.toFixed(1)}s`);

  const layerStatus = { narration: true, music: false, sfx: false, roomTone: false, silence: true };

  // ── Layer 1: Narration (already provided) ──
  console.log(`  Layer 1 [Narration]:  ✅ ${resolvedNarration}`);

  // ── Layer 2: Background Music ──
  const musicPath = path.join(AUDIO_DIR, `${slug}_layer_music.wav`);
  console.log(`  Layer 2 [Music]:      generating...`);
  layerStatus.music = buildMusicLayer(masterDuration, musicPath, { musicFile: opts.musicFile });
  console.log(`  Layer 2 [Music]:      ${layerStatus.music ? '✅' : '❌'} ${layerStatus.music ? musicPath : 'failed'}`);

  // ── Layer 3: SFX ──
  const sfxPath = path.join(AUDIO_DIR, `${slug}_layer_sfx.wav`);
  console.log(`  Layer 3 [SFX]:        generating...`);
  const sfxResult = buildSFXLayer(timeline, masterDuration, sfxPath);
  layerStatus.sfx = sfxResult.success;
  console.log(`  Layer 3 [SFX]:        ${layerStatus.sfx ? '✅' : '❌'} ${sfxResult.eventCount} events placed`);

  // ── Layer 4: Room Tone ──
  const roomTonePath = path.join(AUDIO_DIR, `${slug}_layer_roomtone.wav`);
  console.log(`  Layer 4 [Room Tone]:  generating...`);
  layerStatus.roomTone = buildRoomToneLayer(masterDuration, roomTonePath);
  console.log(`  Layer 4 [Room Tone]:  ${layerStatus.roomTone ? '✅' : '❌'} broadcast noise floor`);

  // ── Layer 5: Silence (gaps) ──
  // Already embedded in narration track from tts-engine. Log the gap info.
  const gapCount = timeline.filter(e => (e.gapEndFrame - e.endFrame) > 0).length;
  console.log(`  Layer 5 [Silence]:    ✅ ${gapCount} breathing gaps (embedded in narration)`);

  // ── Mix Layers ──
  console.log(`\n  Mixing ${Object.values(layerStatus).filter(Boolean).length} active layers...`);

  const masterPath = opts.output
    ? path.resolve(opts.output)
    : path.join(AUDIO_DIR, `${slug}_master.wav`);

  const masterDir = path.dirname(masterPath);
  if (!existsSync(masterDir)) mkdirSync(masterDir, { recursive: true });

  // Strategy: mix in stages for reliability
  // Stage A: Narration + Room Tone (always-on layers)
  const baseLayerPath = path.join(AUDIO_DIR, `${slug}_mix_base.wav`);

  if (layerStatus.roomTone) {
    const cmd = `ffmpeg -y -i "${resolvedNarration}" -i "${roomTonePath}" -filter_complex "[0:a]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=stereo[voice];[1:a]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=stereo[room];[voice][room]amix=inputs=2:duration=longest:dropout_transition=3:weights=1 0.3[out]" -map "[out]" -ar ${AUDIO.SAMPLE_RATE} "${baseLayerPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe', timeout: 120000 });
    } catch (e) {
      // Fallback: just copy narration
      execSync(`cp "${resolvedNarration}" "${baseLayerPath}"`, { stdio: 'pipe' });
      console.log(`  ⚠️  Room tone mix failed, using narration only`);
    }
  } else {
    execSync(`cp "${resolvedNarration}" "${baseLayerPath}"`, { stdio: 'pipe' });
  }

  // Stage B: Add SFX
  let currentMix = baseLayerPath;
  if (layerStatus.sfx && sfxResult.eventCount > 0) {
    const sfxMixPath = path.join(AUDIO_DIR, `${slug}_mix_sfx.wav`);
    const cmd = `ffmpeg -y -i "${currentMix}" -i "${sfxPath}" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=3:weights=1 0.6[out]" -map "[out]" -ar ${AUDIO.SAMPLE_RATE} "${sfxMixPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe', timeout: 120000 });
      currentMix = sfxMixPath;
      console.log(`  ✅ SFX mixed in`);
    } catch (e) {
      console.log(`  ⚠️  SFX mix failed: ${e.message?.slice(-100)}`);
    }
  }

  // Stage C: Add Music with sidechain ducking
  if (layerStatus.music) {
    const musicMixed = mixWithMusic(currentMix, musicPath, masterPath, masterDuration);
    if (musicMixed) {
      currentMix = masterPath;
      console.log(`  ✅ Music mixed with sidechain ducking`);
    } else {
      // Copy current mix as master
      if (currentMix !== masterPath) {
        execSync(`cp "${currentMix}" "${masterPath}"`, { stdio: 'pipe' });
      }
      console.log(`  ⚠️  Music ducking failed, proceeding without music`);
    }
  } else {
    if (currentMix !== masterPath) {
      execSync(`cp "${currentMix}" "${masterPath}"`, { stdio: 'pipe' });
    }
  }

  // ── Final Loudness Normalization ──
  if (!opts.skipNormalize) {
    console.log(`  Normalizing to ${AUDIO.TARGET_LUFS} LUFS...`);
    const normalizedPath = path.join(AUDIO_DIR, `${slug}_master_norm.wav`);
    const normalized = normalizeLoudness(masterPath, normalizedPath);
    if (normalized) {
      execSync(`mv "${normalizedPath}" "${masterPath}"`, { stdio: 'pipe' });
      console.log(`  ✅ Loudness normalized (EBU R128, ${AUDIO.TARGET_LUFS} LUFS)`);
    } else {
      console.log(`  ⚠️  Normalization failed, using unnormalized mix`);
    }
  }

  // ── Quality Check ──
  const loudness = verifyLoudness(masterPath);
  const finalDuration = getAudioDuration(masterPath);

  console.log(`\n  ✅ Sound design complete`);
  console.log(`     📁 ${masterPath}`);
  console.log(`     ⏱️  ${finalDuration.toFixed(1)}s stereo WAV`);
  if (loudness.lufs !== null) {
    const lufsOk = Math.abs(loudness.lufs - AUDIO.TARGET_LUFS) <= 1.0;
    console.log(`     📏 ${lufsOk ? '✅' : '⚠️ '} ${loudness.lufs.toFixed(1)} LUFS (target: ${AUDIO.TARGET_LUFS})`);
  }
  if (loudness.truePeak !== null) {
    const tpOk = loudness.truePeak <= AUDIO.TRUE_PEAK_MAX;
    console.log(`     📏 ${tpOk ? '✅' : '⚠️ '} ${loudness.truePeak.toFixed(1)} dBTP peak (max: ${AUDIO.TRUE_PEAK_MAX})`);
  }
  console.log(`     🎚️  Layers: narration + ${layerStatus.music ? 'music' : 'no-music'} + ${sfxResult.eventCount} SFX + ${layerStatus.roomTone ? 'room-tone' : 'no-room-tone'} + silence`);

  return {
    outputPath: masterPath,
    totalDuration_s: finalDuration,
    layers: layerStatus,
    loudness: {
      lufs: loudness.lufs,
      truePeak: loudness.truePeak,
      pass: loudness.pass,
    },
  };
}

// ── CLI ──

const cliNarrationPath = process.argv[2];
const cliConfigArg = process.argv[3];

if (cliNarrationPath && cliConfigArg && !cliNarrationPath.startsWith('-')) {
  // Parse optional flags
  const args = process.argv.slice(4);
  function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : null;
  }

  const configPath = path.resolve(cliConfigArg);
  if (!existsSync(configPath)) {
    console.error(`❌ Config not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const cliOpts = {
    output: getArg('output'),
    musicFile: getArg('music'),
    skipNormalize: args.includes('--skip-normalize'),
  };

  mixAudio(cliNarrationPath, config, cliOpts).catch(e => {
    console.error(`\n❌ Fatal: ${e.message}`);
    process.exit(1);
  });
} else if (process.argv[1] && process.argv[1].includes('sound-design')) {
  console.log('Usage: node studio/lib/sound-design.js <narration.wav> <config.json> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output <path>        Custom output WAV path');
  console.log('  --music <path>         Custom background music file');
  console.log('  --skip-normalize       Skip final loudness normalization');
  console.log('');
  console.log('Example:');
  console.log('  node studio/lib/sound-design.js output/audio/lesson_narration.wav content/configs/ai-without-jargon.json');
}
