#!/usr/bin/env node
/**
 * Breathing Ratio Validation Test
 *
 * Verifies that the editing engine's BEAT_PAUSE + HEAD_PAD values
 * produce a breathing ratio within the 15-25% target range
 * (Walter Murch principle) across all V5 screenplays.
 *
 * Run: node studio/tests/test-breathing-ratio.mjs
 */

import { getSceneTiming } from '../lib/editing-engine.js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENPLAYS_DIR = join(__dirname, '..', 'screenplays');

const MIN_RATIO = 0.15;
const MAX_RATIO = 0.25;

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

function analyzeScreenplay(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const screenplay = JSON.parse(raw);
  const scenes = screenplay.scenes || [];
  const title = screenplay.title || filePath;

  console.log(`\n── ${title} (${scenes.length} scenes) ──`);

  // Use screenplay duration_s as audio estimate (real TTS durations vary)
  let totalNarration = 0;
  let totalBreathing = 0;
  const beatCounts = {};
  const timings = [];

  for (const scene of scenes) {
    const audioDur = scene.duration_s || 5;
    const timing = getSceneTiming(scene, audioDur);
    timings.push(timing);

    totalNarration += audioDur;
    totalBreathing += timing.headPad + timing.tailPause;
    beatCounts[timing.beat] = (beatCounts[timing.beat] || 0) + 1;
  }

  const totalDur = totalNarration + totalBreathing;
  const ratio = totalBreathing / totalDur;

  // Print beat distribution
  console.log(`  Beat distribution: ${Object.entries(beatCounts).map(([b, c]) => `${b}×${c}`).join(', ')}`);
  console.log(`  Narration: ${totalNarration.toFixed(1)}s | Breathing: ${totalBreathing.toFixed(1)}s | Total: ${totalDur.toFixed(1)}s`);
  console.log(`  Breathing ratio: ${(ratio * 100).toFixed(1)}%`);

  // Tests
  test(`${title}: ratio ≥ ${(MIN_RATIO * 100).toFixed(0)}%`, ratio >= MIN_RATIO,
    `got ${(ratio * 100).toFixed(1)}%, need ≥${(MIN_RATIO * 100).toFixed(0)}%`);
  test(`${title}: ratio ≤ ${(MAX_RATIO * 100).toFixed(0)}%`, ratio <= MAX_RATIO,
    `got ${(ratio * 100).toFixed(1)}%, need ≤${(MAX_RATIO * 100).toFixed(0)}%`);

  // Per-scene: no scene should have <0.5s total breathing
  for (let i = 0; i < scenes.length; i++) {
    const t = timings[i];
    const sceneBreathing = t.headPad + t.tailPause;
    if (sceneBreathing < 0.5) {
      test(`${title}/${scenes[i].id}: min breathing ≥ 0.5s`, false,
        `got ${sceneBreathing.toFixed(2)}s`);
    }
  }

  // Peak scenes should have the most breathing (≥2.5s)
  for (let i = 0; i < scenes.length; i++) {
    const t = timings[i];
    if (t.beat === 'peak') {
      const sceneBreathing = t.headPad + t.tailPause;
      test(`${title}/${scenes[i].id}: peak breathing ≥ 2.5s`, sceneBreathing >= 2.5,
        `got ${sceneBreathing.toFixed(2)}s`);
    }
  }

  return { title, ratio, totalDur, totalNarration, totalBreathing };
}

// ── Main ──
console.log('═══ Breathing Ratio Validation (V3 Beat Timing) ═══');
console.log(`Target range: ${(MIN_RATIO * 100).toFixed(0)}%–${(MAX_RATIO * 100).toFixed(0)}%`);

const screenplays = readdirSync(SCREENPLAYS_DIR)
  .filter(f => f.endsWith('-v5.json'))
  .sort();

if (screenplays.length === 0) {
  console.log('\n  WARN  No v5 screenplays found');
  process.exit(1);
}

const results = [];
for (const sp of screenplays) {
  results.push(analyzeScreenplay(join(SCREENPLAYS_DIR, sp)));
}

// Cross-video consistency: ratios should be within 5pp of each other
if (results.length > 1) {
  console.log('\n── Cross-Video Consistency ──');
  const ratios = results.map(r => r.ratio);
  const spread = Math.max(...ratios) - Math.min(...ratios);
  test(`Ratio spread ≤ 5pp`, spread <= 0.05,
    `spread is ${(spread * 100).toFixed(1)}pp across ${results.length} videos`);
}

// Summary
console.log(`\n═══ Results: ${totalPassed} passed, ${totalFailed} failed ═══`);
process.exit(totalFailed > 0 ? 1 : 0);
