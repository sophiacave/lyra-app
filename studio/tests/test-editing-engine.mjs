#!/usr/bin/env node
/**
 * Editing Engine — Unit Test Suite
 *
 * Comprehensive tests for the core timing engine that controls
 * beat pauses, head padding, crossfade durations, audio filters, and EDL.
 *
 * Run: node studio/tests/test-editing-engine.mjs
 */

import { getSceneTiming, getCrossfadeDuration, buildAudioPadFilter, generateEDL } from '../lib/editing-engine.js';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let totalPassed = 0;
let totalFailed = 0;

function test(name, condition, detail = '') {
  if (condition) {
    totalPassed++;
    console.log(`  PASS  ${name}`);
  } else {
    totalFailed++;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function approx(a, b, tol = 0.001) {
  return Math.abs(a - b) < tol;
}

// ═══════════════════════════════════════════════════════
// 1. getSceneTiming — Beat-specific head/tail pauses
// ═══════════════════════════════════════════════════════
console.log('═══ getSceneTiming ═══');

// Expected values from the V3 constants
const EXPECTED_BEAT_PAUSE = {
  hook: 1.0, setup: 0.7, core: 0.6,
  breathe: 1.8, deepen: 0.8, peak: 2.3, close: 1.8,
};
const EXPECTED_HEAD_PAD = {
  hook: 0.20, setup: 0.30, core: 0.25,
  breathe: 0.50, deepen: 0.35, peak: 0.70, close: 0.50,
};

// Test all 7 beat types with short audio (no long-scene bonus)
console.log('\n── Short scenes (no long-scene bonus) ──');
for (const beat of Object.keys(EXPECTED_BEAT_PAUSE)) {
  const audioDur = 8; // under threshold
  const t = getSceneTiming({ beat }, audioDur);

  test(`${beat}: headPad = ${EXPECTED_HEAD_PAD[beat]}s`,
    approx(t.headPad, EXPECTED_HEAD_PAD[beat]),
    `got ${t.headPad}`);

  test(`${beat}: tailPause = ${EXPECTED_BEAT_PAUSE[beat]}s`,
    approx(t.tailPause, EXPECTED_BEAT_PAUSE[beat]),
    `got ${t.tailPause}`);

  const expectedTotal = EXPECTED_HEAD_PAD[beat] + audioDur + EXPECTED_BEAT_PAUSE[beat];
  test(`${beat}: totalDur = head + audio + tail`,
    approx(t.totalDur, expectedTotal),
    `got ${t.totalDur}, expected ${expectedTotal}`);

  test(`${beat}: beat label = "${beat}"`, t.beat === beat);
  test(`${beat}: audioDurS passthrough`, t.audioDurS === audioDur);
}

// Test default beat fallback
console.log('\n── Default beat fallback ──');
const nobeat = getSceneTiming({}, 5);
test('missing beat defaults to "core"', nobeat.beat === 'core');
test('missing beat headPad = 0.25', approx(nobeat.headPad, 0.25));
test('missing beat tailPause = 0.6', approx(nobeat.tailPause, 0.6));

const weirdbeat = getSceneTiming({ beat: 'nonexistent' }, 5);
test('unknown beat headPad fallback = 0.2', approx(weirdbeat.headPad, 0.2));
test('unknown beat tailPause fallback = 0.5', approx(weirdbeat.tailPause, 0.5));

// ═══════════════════════════════════════════════════════
// 2. Long Scene Breathing Bonus
// ═══════════════════════════════════════════════════════
console.log('\n═══ Long Scene Breathing Bonus ═══');

const THRESHOLD = 10;
const RATE = 0.08;

// At exactly the threshold — no bonus
const atThreshold = getSceneTiming({ beat: 'core' }, THRESHOLD);
test('at 10s: no bonus (tailPause = base)',
  approx(atThreshold.tailPause, EXPECTED_BEAT_PAUSE.core),
  `got ${atThreshold.tailPause}`);

// Just above threshold
const just11 = getSceneTiming({ beat: 'core' }, 11);
const expectedBonus11 = (11 - THRESHOLD) * RATE;
test('at 11s: bonus = 0.08s',
  approx(just11.tailPause, EXPECTED_BEAT_PAUSE.core + expectedBonus11),
  `got ${just11.tailPause}, expected ${EXPECTED_BEAT_PAUSE.core + expectedBonus11}`);

// 15s scene
const at15 = getSceneTiming({ beat: 'core' }, 15);
const expectedBonus15 = (15 - THRESHOLD) * RATE;
test('at 15s: bonus = 0.40s',
  approx(at15.tailPause, EXPECTED_BEAT_PAUSE.core + expectedBonus15),
  `got ${at15.tailPause}, expected ${EXPECTED_BEAT_PAUSE.core + expectedBonus15}`);

// 20s scene
const at20 = getSceneTiming({ beat: 'hook' }, 20);
const expectedBonus20 = (20 - THRESHOLD) * RATE;
test('at 20s hook: bonus = 0.80s',
  approx(at20.tailPause, EXPECTED_BEAT_PAUSE.hook + expectedBonus20),
  `got ${at20.tailPause}, expected ${EXPECTED_BEAT_PAUSE.hook + expectedBonus20}`);

// Below threshold — no bonus
const at5 = getSceneTiming({ beat: 'peak' }, 5);
test('at 5s: no bonus',
  approx(at5.tailPause, EXPECTED_BEAT_PAUSE.peak),
  `got ${at5.tailPause}`);

// Zero duration — no bonus, no crash
const atZero = getSceneTiming({ beat: 'core' }, 0);
test('at 0s: no bonus, no crash',
  approx(atZero.tailPause, EXPECTED_BEAT_PAUSE.core));
test('at 0s: totalDur = head + tail only',
  approx(atZero.totalDur, EXPECTED_HEAD_PAD.core + EXPECTED_BEAT_PAUSE.core));

// Bonus is proportional (linear check)
console.log('\n── Bonus linearity ──');
const dur12 = getSceneTiming({ beat: 'setup' }, 12);
const dur14 = getSceneTiming({ beat: 'setup' }, 14);
const bonusDelta = dur14.tailPause - dur12.tailPause;
test('bonus linear: 14s - 12s bonus = 2 × rate',
  approx(bonusDelta, 2 * RATE),
  `got ${bonusDelta}, expected ${2 * RATE}`);

// ═══════════════════════════════════════════════════════
// 3. getCrossfadeDuration
// ═══════════════════════════════════════════════════════
console.log('\n═══ getCrossfadeDuration ═══');

// Specific transitions
const EXPECTED_CROSSFADE = {
  'hook→hook': 0.3,
  'hook→setup': 0.3,
  'setup→setup': 0.4,
  'setup→core': 0.4,
  'core→core': 0.3,
  'core→breathe': 0.8,
  'breathe→deepen': 0.6,
  'deepen→deepen': 0.4,
  'deepen→peak': 0.3,
  'peak→deepen': 0.6,
  'peak→close': 1.0,
  'close→close': 0.8,
};

for (const [transition, expected] of Object.entries(EXPECTED_CROSSFADE)) {
  const [prev, next] = transition.split('→');
  const actual = getCrossfadeDuration(prev, next);
  test(`crossfade ${transition} = ${expected}s`,
    approx(actual, expected),
    `got ${actual}`);
}

// Default fallback for undefined transitions
const defaultXfade = getCrossfadeDuration('close', 'hook');
test('crossfade close→hook (undefined) = default 0.5s',
  approx(defaultXfade, 0.5),
  `got ${defaultXfade}`);

const weirdXfade = getCrossfadeDuration('foo', 'bar');
test('crossfade foo→bar (undefined) = default 0.5s',
  approx(weirdXfade, 0.5),
  `got ${weirdXfade}`);

// Symmetry check: some transitions are defined one way but not the reverse
const peakClose = getCrossfadeDuration('peak', 'close');
const closePeak = getCrossfadeDuration('close', 'peak');
test('peak→close (1.0) ≠ close→peak (default 0.5) — asymmetric',
  !approx(peakClose, closePeak),
  `peak→close=${peakClose}, close→peak=${closePeak}`);

// ═══════════════════════════════════════════════════════
// 4. buildAudioPadFilter
// ═══════════════════════════════════════════════════════
console.log('\n═══ buildAudioPadFilter ═══');

// Standard case
const filter1 = buildAudioPadFilter(0.25, 10.5);
test('standard filter format',
  filter1 === 'adelay=250|250,apad=whole_dur=10.500',
  `got: ${filter1}`);

// Zero head pad
const filter2 = buildAudioPadFilter(0, 5.0);
test('zero head pad: delay=0',
  filter2 === 'adelay=0|0,apad=whole_dur=5.000',
  `got: ${filter2}`);

// Large head pad (peak scene)
const filter3 = buildAudioPadFilter(0.70, 15.123);
test('peak head pad: delay=700ms',
  filter3 === 'adelay=700|700,apad=whole_dur=15.123',
  `got: ${filter3}`);

// Sub-millisecond precision
const filter4 = buildAudioPadFilter(0.004, 3.0);
test('sub-ms rounding: 0.004s → 4ms',
  filter4.startsWith('adelay=4|4,'),
  `got: ${filter4}`);

// Filter contains both adelay and apad components
const filter5 = buildAudioPadFilter(0.5, 8.0);
test('filter has adelay component', filter5.includes('adelay='));
test('filter has apad component', filter5.includes('apad=whole_dur='));
test('filter uses comma separator', filter5.includes(','));
test('delay is stereo (pipe separator)', /adelay=\d+\|\d+/.test(filter5));

// ═══════════════════════════════════════════════════════
// 5. generateEDL
// ═══════════════════════════════════════════════════════
console.log('\n═══ generateEDL ═══');

const testEdlPath = join(__dirname, '_test_edl_output.edl');

const testScenes = [
  { id: 'opening', type: 'title', beat: 'hook', dialogue: 'Welcome to the show' },
  { id: 'explain', type: 'broll', beat: 'core', dialogue: 'Here is an explanation that is fairly long to test the truncation behavior in the EDL output' },
  { id: 'climax', type: 'diagram', beat: 'peak', dialogue: 'The big reveal' },
  { id: 'ending', type: 'broll', beat: 'close', dialogue: 'Goodbye' },
];

const testTimings = testScenes.map(s => getSceneTiming(s, 8));
const edl = generateEDL(testScenes, testTimings, testEdlPath);

// EDL content checks
test('EDL contains title', edl.includes('TITLE:'));
test('EDL contains date', edl.includes('DATE:'));
test('EDL contains FCM', edl.includes('FCM: NON-DROP FRAME'));
test('EDL contains all scene IDs', testScenes.every(s => edl.includes(s.id)));
test('EDL contains beat labels', ['hook', 'core', 'peak', 'close'].every(b => edl.includes(b)));
test('EDL contains type labels', ['title', 'broll', 'diagram'].every(t => edl.includes(t)));
test('EDL contains dialogue preview', edl.includes('Welcome to the show'));
test('EDL truncates long dialogue (70 chars)', edl.includes('…'));
test('EDL contains TOTAL DURATION', edl.includes('TOTAL DURATION:'));
test('EDL contains BREATHING RATIO', edl.includes('BREATHING RATIO:'));

// EDL file written
test('EDL file created on disk', existsSync(testEdlPath));

// EDL total duration is correct
const totalNarration = testTimings.reduce((s, t) => s + t.audioDurS, 0);
const totalDur = testTimings.reduce((s, t) => s + t.totalDur, 0);
const totalBreathing = totalDur - totalNarration;
const expectedRatio = (totalBreathing / totalDur * 100).toFixed(1);
test(`EDL ratio matches computed (${expectedRatio}%)`,
  edl.includes(`${expectedRatio}%`),
  `expected ${expectedRatio}% in EDL`);

// EDL narration total
test(`EDL narration total = ${totalNarration.toFixed(1)}s`,
  edl.includes(`${totalNarration.toFixed(1)}s`));

// ── EDL with empty scenes ──
console.log('\n── EDL edge cases ──');
const emptyEdlPath = join(__dirname, '_test_edl_empty.edl');
const emptyEdl = generateEDL([], [], emptyEdlPath);
test('empty EDL: contains header', emptyEdl.includes('TITLE:'));
test('empty EDL: breathing ratio 0.0s', emptyEdl.includes('TOTAL BREATHING: 0.0s'));

// EDL with scene missing timing (null in array)
const partialTimings = [testTimings[0], null, testTimings[2]];
const partialEdlPath = join(__dirname, '_test_edl_partial.edl');
const partialEdl = generateEDL(testScenes.slice(0, 3), partialTimings, partialEdlPath);
test('partial EDL: skips null timing gracefully', partialEdl.includes('opening') && partialEdl.includes('climax'));
test('partial EDL: missing scene excluded', !partialEdl.includes('explain'));

// Cleanup temp files
for (const p of [testEdlPath, emptyEdlPath, partialEdlPath]) {
  if (existsSync(p)) unlinkSync(p);
}

// ═══════════════════════════════════════════════════════
// 6. Timing Invariants
// ═══════════════════════════════════════════════════════
console.log('\n═══ Timing Invariants ═══');

// totalDur = headPad + audioDurS + tailPause (for any scene)
for (const beat of Object.keys(EXPECTED_BEAT_PAUSE)) {
  for (const dur of [0, 3, 10, 15, 25]) {
    const t = getSceneTiming({ beat }, dur);
    const sum = t.headPad + t.audioDurS + t.tailPause;
    test(`invariant: ${beat}@${dur}s total = sum of parts`,
      approx(t.totalDur, sum),
      `totalDur=${t.totalDur}, sum=${sum}`);
  }
}

// All head pads are positive
for (const beat of Object.keys(EXPECTED_HEAD_PAD)) {
  const t = getSceneTiming({ beat }, 5);
  test(`invariant: ${beat} headPad > 0`, t.headPad > 0);
}

// All tail pauses are positive
for (const beat of Object.keys(EXPECTED_BEAT_PAUSE)) {
  const t = getSceneTiming({ beat }, 5);
  test(`invariant: ${beat} tailPause > 0`, t.tailPause > 0);
}

// Peak always has the most breathing (for short scenes)
const peakBreathing = (() => {
  const t = getSceneTiming({ beat: 'peak' }, 8);
  return t.headPad + t.tailPause;
})();
for (const beat of ['hook', 'setup', 'core', 'deepen']) {
  const t = getSceneTiming({ beat }, 8);
  const breathing = t.headPad + t.tailPause;
  test(`invariant: peak (${peakBreathing.toFixed(2)}s) > ${beat} (${breathing.toFixed(2)}s) breathing`,
    peakBreathing > breathing);
}

// Crossfade durations are all within sensible bounds (0.1-2.0s)
for (const beat1 of ['hook', 'setup', 'core', 'breathe', 'deepen', 'peak', 'close']) {
  for (const beat2 of ['hook', 'setup', 'core', 'breathe', 'deepen', 'peak', 'close']) {
    const d = getCrossfadeDuration(beat1, beat2);
    test(`bounds: xfade ${beat1}→${beat2} in [0.1, 2.0]`,
      d >= 0.1 && d <= 2.0,
      `got ${d}`);
  }
}

// ═══════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(60)}`);
console.log(`RESULTS: ${totalPassed}/${totalPassed + totalFailed} passed, ${totalFailed} failed`);
console.log('═'.repeat(60));

if (totalFailed > 0) {
  console.log('Editing engine tests FAILED');
  process.exit(1);
} else {
  console.log('All editing engine tests passed!');
}
