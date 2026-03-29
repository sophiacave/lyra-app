#!/usr/bin/env node
/**
 * Like One Studio V9 — Render Script
 * 
 * Loads a screenplay JSON, validates all prompts, and renders via Remotion.
 * 
 * Usage:
 *   node render-v9.js screenplays/what-is-a-neuron-v5.json [--preview]
 * 
 * Modes:
 *   Full:    Renders all scenes at 1920x1080 → output/
 *   Preview: Renders first 30s for quick iteration
 */

import { readFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, basename } from 'path';
import { validateScreenplay, printReport } from './prompt-validator.js';

const REMOTION_DIR = join(import.meta.dirname, 'remotion');
const OUTPUT_DIR = join(import.meta.dirname, '..', 'output', 'renders');

async function main() {
  const screenplayPath = process.argv[2];
  const isPreview = process.argv.includes('--preview');

  if (!screenplayPath) {
    console.error('Usage: node render-v9.js <screenplay.json> [--preview]');
    process.exit(1);
  }

  // 1. Load screenplay
  console.log('\n🎬 LIKE ONE STUDIO V9 — RENDER PIPELINE');
  console.log('═'.repeat(60));

  const screenplay = JSON.parse(readFileSync(screenplayPath, 'utf-8'));
  console.log(`📝 Screenplay: ${screenplay.title} (v${screenplay.version})`);
  console.log(`🎯 Target duration: ${screenplay.duration_target_s}s`);
  console.log(`🎥 Film stock: ${screenplay.film_stock}`);
  console.log(`📷 Camera: ${screenplay.camera_body}`);

  // 2. Validate all prompts
  console.log('\n📋 PROMPT VALIDATION');
  const report = validateScreenplay(screenplay);
  printReport(report);

  if (report.failedScenes > 0) {
    console.error('\n🚫 BLOCKED — Fix prompts before rendering.');
    process.exit(1);
  }

  // 3. Check for asset files
  console.log('\n📂 ASSET CHECK');
  let assetsReady = true;
  const scenes = screenplay.scenes || [];
  
  for (const scene of scenes) {
    const hasVideo = scene.videoPath && existsSync(scene.videoPath);
    const hasImage = scene.imagePath && existsSync(scene.imagePath);
    const hasNarration = scene.narrationPath && existsSync(scene.narrationPath);
    const needsVisual = scene.type === 'broll' || scene.type === 'montage';

    if (needsVisual && !hasVideo && !hasImage) {
      console.log(`   ⚠️  ${scene.id}: No visual asset (will use placeholder)`);
      assetsReady = false;
    }
    if (scene.dialogue && !hasNarration) {
      console.log(`   ⚠️  ${scene.id}: No narration audio`);
    }
  }

  if (!assetsReady) {
    console.log('\n⚠️  Running in PREVIEW mode — placeholder visuals for missing assets.');
  }

  // 4. Calculate total duration
  const totalDuration = scenes.reduce((sum, s) => sum + (s.duration_s || 0), 0);
  const totalFrames = Math.round(totalDuration * 30);
  console.log(`\n⏱  Total duration: ${totalDuration}s (${totalFrames} frames at 30fps)`);

  // 5. Prepare output directory
  const outputName = basename(screenplayPath, '.json');
  const outputPath = join(OUTPUT_DIR, outputName);
  if (!existsSync(outputPath)) mkdirSync(outputPath, { recursive: true });

  // 6. Render via Remotion CLI
  const compositionId = isPreview ? 'LikeOnePreview' : 'LikeOneVideo';
  const renderFrames = isPreview ? Math.min(totalFrames, 900) : totalFrames;
  const outputFile = join(outputPath, `${outputName}${isPreview ? '-preview' : ''}.mp4`);

  console.log(`\n🎬 RENDERING: ${compositionId}`);
  console.log(`   Frames: ${renderFrames}`);
  console.log(`   Output: ${outputFile}`);
  console.log('═'.repeat(60));

  const inputProps = JSON.stringify(screenplay);
  
  const cmd = [
    'npx remotion render',
    compositionId,
    `"${outputFile}"`,
    `--props='${inputProps.replace(/'/g, "\\'")}'`,
    `--frames=0-${renderFrames - 1}`,
    '--codec=h264',
    '--crf=18',
    '--pixel-format=yuv420p',
    '--color-space=bt709',
    '--log=verbose',
  ].join(' ');

  console.log('\n🔨 Executing Remotion render...\n');
  
  try {
    execSync(cmd, { 
      cwd: REMOTION_DIR, 
      stdio: 'inherit',
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
    });
    console.log(`\n✅ RENDER COMPLETE: ${outputFile}`);
  } catch (err) {
    console.error('\n❌ Render failed:', err.message);
    process.exit(1);
  }

  // 7. Post-render: cinema grade (FFmpeg LUT pipeline)
  console.log('\n🎨 POST-RENDER: Cinema grade pipeline...');
  const gradedFile = outputFile.replace('.mp4', '-graded.mp4');
  
  // Apply Kodak Vision3 500T look via FFmpeg
  const gradeCmd = [
    'ffmpeg -y',
    `-i "${outputFile}"`,
    '-vf "curves=vintage,eq=contrast=1.04:brightness=0.01:saturation=0.85,unsharp=3:3:0.3,vignette=PI/5"',
    '-c:a copy',
    '-c:v libx264 -crf 18 -preset slow',
    `-metadata title="${screenplay.title}"`,
    `-metadata artist="Like One Studio"`,
    `"${gradedFile}"`,
  ].join(' ');

  try {
    execSync(gradeCmd, { stdio: 'inherit' });
    console.log(`✅ GRADED: ${gradedFile}`);
  } catch {
    console.log('⚠️  Cinema grade skipped (FFmpeg filter issue)');
  }

  console.log('\n✨ PIPELINE COMPLETE');
  console.log('═'.repeat(60));
}

main().catch(console.error);
