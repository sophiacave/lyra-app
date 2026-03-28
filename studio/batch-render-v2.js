#!/usr/bin/env node
/**
 * Like One Studio — Batch Re-Render v2
 * Re-renders all existing lesson videos with v2 visual pipeline
 * (pacing engine, Ken Burns, breathing gaps, 3B1B dimming)
 * then merges with existing v2 audio from Session 50.
 *
 * Usage:
 *   node studio/batch-render-v2.js              # render all
 *   node studio/batch-render-v2.js --dry-run    # preview only
 *   node studio/batch-render-v2.js --only slug  # render one lesson
 */
import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { buildTimingMap, PACING } from './lib/pacing-engine.js';
import { mergeVideoAudio, verifyLoudness, normalizeLoudness } from './lib/audio-engine.js';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const CONFIG_DIR = path.join(STUDIO_DIR, '..', 'content', 'configs');
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const VIDEO_DIR = path.join(OUTPUT_DIR, 'video');

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_EXISTING = !process.argv.includes('--force');
const ONLY_IDX = process.argv.indexOf('--only');
const ONLY_SLUG = ONLY_IDX >= 0 ? process.argv[ONLY_IDX + 1] : null;

// Find all lesson configs that have existing audio
const configs = readdirSync(CONFIG_DIR)
  .filter(f => f.endsWith('.json') && f !== 'test-pipeline.json')
  .map(f => {
    const slug = f.replace('.json', '');
    const configPath = path.join(CONFIG_DIR, f);
    // Check for existing v2 audio (from Session 50 batch-audio-v2)
    const audioPath = path.join(AUDIO_DIR, `${slug}_final.wav`);
    const combinedPath = path.join(AUDIO_DIR, `${slug}_combined.mp3`);
    const hasAudio = existsSync(audioPath) || existsSync(combinedPath);
    const bestAudio = existsSync(audioPath) ? audioPath : combinedPath;
    return { slug, configPath, audioPath: bestAudio, hasAudio };
  })
  .filter(c => c.hasAudio)
  .filter(c => !ONLY_SLUG || c.slug === ONLY_SLUG);

function renderSilentVideo(compositionId, outputPath, props) {
  const cleanProps = JSON.parse(JSON.stringify(props));
  if (cleanProps.sections) {
    cleanProps.sections.forEach(s => { delete s.audioSrc; });
  }
  const propsPath = path.join(OUTPUT_DIR, '_render_props.json');
  writeFileSync(propsPath, JSON.stringify(cleanProps));

  const cmd = [
    'npx', 'remotion', 'render',
    path.join(STUDIO_DIR, 'index.js'),
    compositionId,
    '--output', outputPath,
    '--props', propsPath,
    '--concurrency', '4',
  ].join(' ');

  try {
    execSync(cmd, { cwd: path.join(STUDIO_DIR, '..'), stdio: 'pipe', timeout: 1800000 });
    return true;
  } catch (e) {
    console.error(`  ❌ Render failed:`, e.stderr?.toString?.()?.slice(-300) || e.message?.slice(-300));
    return false;
  }
}

console.log(`\n🎬 LIKE ONE STUDIO v2 — Batch Re-Render`);
console.log('═'.repeat(60));
console.log(`📦 ${configs.length} lessons with audio found`);
if (DRY_RUN) console.log('🔍 DRY RUN — no rendering\n');
else console.log('');

let success = 0;
let failed = 0;
const startTime = Date.now();

for (const { slug, configPath, audioPath } of configs) {
  console.log(`\n── ${slug} ──`);

  // Load config
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  // Calculate new v2 timing
  const { totalFrames, totalDurationS, timeline } = buildTimingMap(config, PACING.FPS);
  const gaps = timeline.filter(e => (e.gapEndFrame - e.endFrame) > 0).length;

  console.log(`  ⏱️ v2 timing: ${totalDurationS.toFixed(1)}s, ${timeline.length} scenes, ${gaps} gaps`);

  if (DRY_RUN) {
    success++;
    continue;
  }

  // Skip already-rendered v2 files unless --force
  const finalPath = path.join(VIDEO_DIR, `${slug}_v2.mp4`);
  if (SKIP_EXISTING && existsSync(finalPath)) {
    const fileSize = execSync(`ls -lh "${finalPath}"`, { encoding: 'utf-8' }).trim().split(/\s+/)[4];
    console.log(`  ⏭️ Already rendered (${fileSize}), skipping`);
    success++;
    continue;
  }

  // Phase 1: Render silent video with v2 visuals
  const silentPath = path.join(VIDEO_DIR, `${slug}_v2_silent.mp4`);
  console.log(`  🎨 Rendering v2 visuals...`);
  const rendered = renderSilentVideo('LessonVideo', silentPath, config);

  if (!rendered) {
    console.log(`  ❌ FAILED`);
    failed++;
    continue;
  }

  // Phase 2: Merge with existing v2 audio
  console.log(`  🔊 Merging with v2 audio...`);
  const merged = mergeVideoAudio(silentPath, audioPath, finalPath);

  if (!merged) {
    console.log(`  ❌ Merge failed`);
    failed++;
    continue;
  }

  // Phase 3: Quick QC
  const fileSize = execSync(`ls -lh "${finalPath}"`, { encoding: 'utf-8' }).trim().split(/\s+/)[4];
  console.log(`  ✅ ${slug}_v2.mp4 (${fileSize})`);
  success++;
}

const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
console.log('\n' + '═'.repeat(60));
console.log(`✨ ${success}/${configs.length} complete, ${failed} failed (${elapsed}min)`);
if (DRY_RUN) console.log('🔍 Dry run — no files written');
