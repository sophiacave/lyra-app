/**
 * Like One Studio — Editing Engine
 * Visual Bible V2 — PhD-quality editing: beat pauses, head padding,
 * crossfade transitions, EDL generation.
 *
 * Fixes: narrators cutting each other off (audio padding bug),
 * hard cuts between scenes, pacing issues.
 *
 * Research: Walter Murch (breathing), Kurzgesagt (visual lead),
 * Mayer segmenting principle, EBU R128.
 */
import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';

// ── Visual Bible V2 Beat Pauses ──
// Seconds of silence AFTER scene narration ends.
// Calibrated per beat type for emotional pacing.
const BEAT_PAUSE = {
  hook:    0.8,   // breath-held, then release
  setup:   0.5,   // anticipation, keep moving
  core:    0.3,   // precise, efficient
  breathe: 1.5,   // Rothko stillness — let the insight crystallize
  deepen:  0.5,   // methodical, keep building
  peak:    2.0,   // McQueen reveal — HOLD
  close:   1.5,   // the exhale, let it land
};

// ── Head Padding ──
// Seconds of silence BEFORE scene narration starts.
// Prevents narrators from "cutting each other off" across scenes.
const HEAD_PAD = {
  hook:    0.15,  // start clean but quick
  setup:   0.25,  // brief breath
  core:    0.15,  // efficient
  breathe: 0.4,   // let the space open
  deepen:  0.25,  // steady
  peak:    0.6,   // dramatic pause before reveal
  close:   0.4,   // gentle entry
};

// ── Crossfade Durations ──
// Seconds of video/audio crossfade between adjacent scenes.
// Keyed by "prevBeat→nextBeat" transition.
const CROSSFADE = {
  default:            0.5,
  'hook→hook':        0.3,
  'hook→setup':       0.3,   // quick energy
  'setup→setup':      0.4,
  'setup→core':       0.4,
  'core→core':        0.3,
  'core→breathe':     0.8,   // slow into the pause
  'breathe→deepen':   0.6,
  'deepen→deepen':    0.4,
  'deepen→peak':      0.3,   // snap to attention
  'peak→deepen':      0.6,
  'peak→close':       1.0,   // long dissolve after revelation
  'close→close':      0.8,
};

// ── Exports ──

/**
 * Calculate scene timing with head padding and tail pause.
 * @param {Object} scene - Screenplay scene object
 * @param {number} audioDurS - Duration of the narration audio in seconds
 * @returns {{ headPad: number, tailPause: number, audioDurS: number, totalDur: number, beat: string }}
 */
export function getSceneTiming(scene, audioDurS) {
  const beat = scene.beat || 'core';
  const headPad = HEAD_PAD[beat] || 0.2;
  const tailPause = BEAT_PAUSE[beat] || 0.5;
  const totalDur = headPad + audioDurS + tailPause;
  return { headPad, tailPause, audioDurS, totalDur, beat };
}

/**
 * Get crossfade duration between two beats.
 */
export function getCrossfadeDuration(prevBeat, nextBeat) {
  return CROSSFADE[`${prevBeat}→${nextBeat}`] || CROSSFADE.default;
}

/**
 * Build FFmpeg audio filter to add head padding and tail silence.
 * Delays the audio by headPad seconds, then pads to totalDur.
 * This replaces the broken -shortest approach.
 *
 * @param {number} headPadS - Seconds of silence before narration
 * @param {number} totalDurS - Total target duration including pauses
 * @returns {string} FFmpeg audio filter string
 */
export function buildAudioPadFilter(headPadS, totalDurS) {
  const delayMs = Math.round(headPadS * 1000);
  // adelay: push audio forward by headPad
  // apad: extend audio with silence to fill totalDur
  return `adelay=${delayMs}|${delayMs},apad=whole_dur=${totalDurS.toFixed(3)}`;
}

/**
 * Assemble video segments with crossfade transitions.
 * Uses FFmpeg xfade (video) + acrossfade (audio) filters chained.
 *
 * @param {string[]} segments - Array of segment file paths
 * @param {Object[]} scenes - Corresponding screenplay scenes
 * @param {string} outputPath - Output video path
 * @returns {string|null} Output path on success, null on failure
 */
export function assembleCrossfade(segments, scenes, outputPath) {
  if (segments.length === 0) return null;
  if (segments.length === 1) {
    execSync(`cp "${segments[0]}" "${outputPath}"`);
    return outputPath;
  }

  // Get actual durations of each segment
  const durations = segments.map(s => {
    try {
      return parseFloat(
        execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${s}"`, { encoding: 'utf-8' }).trim()
      ) || 5;
    } catch { return 5; }
  });

  // Calculate xfade offsets
  // offset_i = accumulated_duration - crossfade_duration_i
  // accumulated_duration += T_{i+1} - crossfade_duration_i
  const videoFilters = [];
  const audioFilters = [];
  let accumulated = durations[0];

  for (let i = 0; i < segments.length - 1; i++) {
    const prevBeat = scenes[i]?.beat || 'core';
    const nextBeat = scenes[i + 1]?.beat || 'core';
    const xfadeDur = getCrossfadeDuration(prevBeat, nextBeat);

    // Ensure crossfade doesn't exceed available duration
    const safeXfade = Math.min(xfadeDur, accumulated * 0.4, durations[i + 1] * 0.4);
    const offset = Math.max(0, accumulated - safeXfade);

    const vIn = i === 0 ? '[0:v]' : `[vx${i}]`;
    const vOut = i === segments.length - 2 ? '[v]' : `[vx${i + 1}]`;
    videoFilters.push(`${vIn}[${i + 1}:v]xfade=transition=fade:duration=${safeXfade.toFixed(3)}:offset=${offset.toFixed(3)}${vOut}`);

    const aIn = i === 0 ? '[0:a]' : `[ax${i}]`;
    const aOut = i === segments.length - 2 ? '[a]' : `[ax${i + 1}]`;
    audioFilters.push(`${aIn}[${i + 1}:a]acrossfade=d=${safeXfade.toFixed(3)}:c1=tri:c2=tri${aOut}`);

    accumulated = offset + durations[i + 1];
  }

  const inputs = segments.map(s => `-i "${s}"`).join(' ');
  const filterComplex = [...videoFilters, ...audioFilters].join(';');

  const cmd = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k "${outputPath}"`;

  try {
    execSync(cmd, { encoding: 'utf-8', timeout: 300000, shell: '/bin/zsh', stdio: 'pipe' });
    return outputPath;
  } catch (e) {
    console.error(`  ❌ Crossfade assembly failed, falling back to concat: ${e.stderr?.slice?.(-200) || e.message?.slice(-200)}`);
    return null; // caller should fall back to basic concat
  }
}

/**
 * Generate an Edit Decision List (EDL) for the composition.
 * Human-readable timing log for QC and review.
 *
 * @param {Object[]} scenes - Screenplay scenes
 * @param {Object[]} timings - Scene timings from getSceneTiming()
 * @param {string} outputPath - EDL file path
 * @returns {string} EDL content
 */
export function generateEDL(scenes, timings, outputPath) {
  const lines = [];
  lines.push('TITLE: Visual Bible V2 — Edit Decision List');
  lines.push(`DATE: ${new Date().toISOString()}`);
  lines.push('FCM: NON-DROP FRAME');
  lines.push('');
  lines.push('EDL  SCENE                TYPE         BEAT      START      END        HEAD   TAIL   AUDIO');
  lines.push('─'.repeat(110));

  let tc = 0;
  let totalAudio = 0;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const timing = timings[i];
    if (!timing) continue;

    const startTC = formatTC(tc);
    const endTC = formatTC(tc + timing.totalDur);

    const line = [
      String(i + 1).padStart(3, '0'),
      scene.id.padEnd(20),
      (scene.type || '?').padEnd(12),
      timing.beat.padEnd(9),
      startTC,
      endTC,
      `${timing.headPad.toFixed(2)}s`.padStart(6),
      `${timing.tailPause.toFixed(2)}s`.padStart(6),
      `${timing.audioDurS.toFixed(1)}s`.padStart(7),
    ].join('  ');

    lines.push(line);

    // Dialogue preview
    if (scene.dialogue) {
      const preview = scene.dialogue.length > 70
        ? scene.dialogue.slice(0, 70) + '…'
        : scene.dialogue;
      lines.push(`     └─ "${preview}"`);
    }

    tc += timing.totalDur;
    totalAudio += timing.audioDurS;
  }

  lines.push('');
  lines.push('─'.repeat(110));
  lines.push(`TOTAL DURATION: ${formatTC(tc)} (${tc.toFixed(1)}s)`);
  lines.push(`TOTAL NARRATION: ${totalAudio.toFixed(1)}s`);
  lines.push(`TOTAL BREATHING: ${(tc - totalAudio).toFixed(1)}s (head pads + beat pauses)`);
  lines.push(`BREATHING RATIO: ${((tc - totalAudio) / tc * 100).toFixed(1)}%`);
  lines.push('');

  const edl = lines.join('\n');
  writeFileSync(outputPath, edl);
  return edl;
}

/**
 * Format seconds as timecode HH:MM:SS:FF (30fps).
 */
function formatTC(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.round((seconds % 1) * 30);
  return [h, m, s, f].map(v => String(v).padStart(2, '0')).join(':');
}
