#!/usr/bin/env node
/**
 * Like One Studio V5 — Kling Cinema Engine
 * Now powered by Prompt Engine V2 (Visual Bible V2).
 *
 * Usage:
 *   node studio/kling-generate.js studio/screenplays/what-is-a-neuron-v5.json
 *   node studio/kling-generate.js studio/screenplays/what-is-a-neuron-v5.json --mode broll
 *   node studio/kling-generate.js studio/screenplays/what-is-a-neuron-v5.json --mode avatar
 *   node studio/kling-generate.js --test  (quick test with one prompt)
 */
import { KlingAPI } from 'kling-api';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import { buildVisualPrompt, buildNegativePrompt, validatePrompt } from './lib/prompt-engine.js';

// Load .env
dotenv.config({ path: path.join(path.dirname(new URL(import.meta.url).pathname), '..', '.env') });

const STUDIO = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.join(STUDIO, '..');
const OUTPUT = path.join(ROOT, 'output');
const BROLL_DIR = path.join(OUTPUT, 'broll');
const AVATAR_DIR = path.join(OUTPUT, 'avatar');
const AUDIO_DIR = path.join(OUTPUT, 'audio');

[BROLL_DIR, AVATAR_DIR].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

const api = new KlingAPI({
  accessKey: process.env.KLING_ACCESS_KEY,
  secretKey: process.env.KLING_SECRET_KEY,
});

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''); }

function dur(file) {
  try {
    return parseFloat(execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${file}"`, { encoding: 'utf-8' }).trim()) || 5;
  } catch { return 5; }
}

// ── B-ROLL GENERATION (powered by Prompt Engine V2) ──
async function generateBRoll(screenplay) {
  const slug = slugify(screenplay.title);
  const brollScenes = screenplay.scenes.filter(s => s.type.includes('broll') && s.visual);
  
  console.log(`\n🎥 KLING CINEMA — B-Roll Generation`);
  console.log(`   Title: ${screenplay.title}`);
  console.log(`   B-roll scenes: ${brollScenes.length}\n`);
  
  const tasks = [];
  
  for (const scene of brollScenes) {
    const outFile = path.join(BROLL_DIR, `${slug}_${scene.id}.mp4`);
    
    if (existsSync(outFile)) {
      console.log(`  ⏭️  ${scene.id}: cached`);
      continue;
    }
    
    // Prompt Engine V2 — Visual Bible V2 grounded
    const engineResult = buildVisualPrompt(scene, screenplay);
    const prompt = engineResult.prompt;
    const negativePrompt = engineResult.negativePrompt;
    const clipDuration = engineResult.duration;

    // Validate before sending to Kling
    const check = validatePrompt(prompt);
    if (!check.valid) {
      console.log(`  ⚠️  ${scene.id}: Visual Bible violations: ${check.violations.join(', ')}`);
    }

    console.log(`  🎬 ${scene.id}: submitting (${clipDuration}s, ${scene.beat}/${engineResult.motionMode})...`);
    console.log(`     Prompt: ${prompt.slice(0, 120)}...`);

    try {
      const task = await api.textToVideo({
        prompt,
        negative_prompt: negativePrompt,
        model_name: 'kling-v2-master',
        duration: clipDuration,
        aspect_ratio: '16:9',
        mode: 'pro',
      });
      
      const taskId = task?.data?.task_id;
      if (taskId) {
        console.log(`  ✅ ${scene.id}: task ${taskId} submitted`);
        tasks.push({ scene, taskId, outFile, clipDuration });
      } else {
        console.error(`  ❌ ${scene.id}: no task_id returned`, JSON.stringify(task).slice(0, 200));
      }
    } catch (e) {
      console.error(`  ❌ ${scene.id}: ${e.message?.slice(0, 200)}`);
    }
  }
  
  if (tasks.length === 0) {
    console.log('\n  ⏭️  All B-roll cached or no scenes to generate');
    return;
  }
  
  // Poll for results
  console.log(`\n⏳ Waiting for ${tasks.length} B-roll clips to generate...`);
  console.log(`   (5s clips ~5-6min, 10s clips ~11-14min)\n`);
  
  for (const { scene, taskId, outFile, clipDuration } of tasks) {
    try {
      console.log(`  ⏳ ${scene.id}: polling task ${taskId}...`);
      const result = await api.waitForVideoResult(taskId, api.queryTextToVideoTask.bind(api), {
        interval: 15000,  // check every 15s
        timeout: 900000,  // 15min max
      });
      
      // Download the video
      const videoUrl = result?.data?.task_result?.videos?.[0]?.url;
      if (videoUrl) {
        execSync(`curl -sL "${videoUrl}" -o "${outFile}"`, { timeout: 60000 });
        const fileDur = dur(outFile);
        console.log(`  🎬 ${scene.id}: downloaded ${fileDur.toFixed(1)}s cinema`);
      } else {
        console.error(`  ❌ ${scene.id}: no video URL in result`);
        // Save the result for debugging
        writeFileSync(outFile + '.debug.json', JSON.stringify(result, null, 2));
      }
    } catch (e) {
      console.error(`  ❌ ${scene.id}: polling failed — ${e.message?.slice(0, 200)}`);
    }
  }
  
  // Summary
  const generated = brollScenes.filter(s => existsSync(path.join(BROLL_DIR, `${slug}_${s.id}.mp4`)));
  console.log(`\n🎥 B-Roll complete: ${generated.length}/${brollScenes.length} scenes`);
}

// ── AVATAR GENERATION (Kling lip-sync) ──
async function generateAvatars(screenplay) {
  const slug = slugify(screenplay.title);
  const presenterScenes = screenplay.scenes.filter(s => s.type.includes('presenter'));
  const avatarImg = path.join(STUDIO, 'avatars', screenplay.persona || 'faye', 'headshot-neutral.png');
  
  console.log(`\n🎭 KLING CINEMA — Avatar Generation`);
  console.log(`   Title: ${screenplay.title}`);
  console.log(`   Presenter scenes: ${presenterScenes.length}`);
  console.log(`   Avatar: ${avatarImg}\n`);
  
  if (!existsSync(avatarImg)) {
    console.error(`  ❌ No avatar image at ${avatarImg}`);
    return;
  }
  
  // Convert image to base64 for API
  const imgBuffer = readFileSync(avatarImg);
  const imgBase64 = imgBuffer.toString('base64');
  const imgDataUrl = `data:image/png;base64,${imgBase64}`;
  
  const tasks = [];
  
  for (const scene of presenterScenes) {
    const outFile = path.join(AVATAR_DIR, `${slug}_${scene.id}.mp4`);
    const audioFile = path.join(AUDIO_DIR, `${slug}_${scene.id}.wav`);
    
    if (existsSync(outFile)) {
      console.log(`  ⏭️  ${scene.id}: cached`);
      continue;
    }
    
    if (!existsSync(audioFile)) {
      console.log(`  ⚠️  ${scene.id}: no audio file`);
      continue;
    }
    
    // Convert audio to base64
    const audioBuffer = readFileSync(audioFile);
    const audioBase64 = audioBuffer.toString('base64');
    const audioDataUrl = `data:audio/wav;base64,${audioBase64}`;
    
    console.log(`  🎭 ${scene.id}: submitting avatar + lip-sync...`);
    
    try {
      const task = await api.createAvatar({
        input: {
          face_image_url: imgDataUrl,
          voice_url: audioDataUrl,
        },
        model_name: 'kling-v1',
      });
      
      const taskId = task?.data?.task_id;
      if (taskId) {
        console.log(`  ✅ ${scene.id}: task ${taskId} submitted`);
        tasks.push({ scene, taskId, outFile });
      } else {
        console.error(`  ❌ ${scene.id}: no task_id`, JSON.stringify(task).slice(0, 200));
      }
    } catch (e) {
      console.error(`  ❌ ${scene.id}: ${e.message?.slice(0, 200)}`);
    }
  }
  
  if (tasks.length === 0) {
    console.log('\n  ⏭️  All avatars cached or no scenes to generate');
    return;
  }
  
  // Poll for results
  console.log(`\n⏳ Waiting for ${tasks.length} avatar clips...`);
  
  for (const { scene, taskId, outFile } of tasks) {
    try {
      console.log(`  ⏳ ${scene.id}: polling task ${taskId}...`);
      const result = await api.waitForVideoResult(taskId, api.queryAvatarTask.bind(api), {
        interval: 15000,
        timeout: 900000,
      });
      
      const videoUrl = result?.data?.task_result?.videos?.[0]?.url;
      if (videoUrl) {
        execSync(`curl -sL "${videoUrl}" -o "${outFile}"`, { timeout: 60000 });
        console.log(`  🎭 ${scene.id}: avatar downloaded`);
      } else {
        console.error(`  ❌ ${scene.id}: no video URL`);
        writeFileSync(outFile + '.debug.json', JSON.stringify(result, null, 2));
      }
    } catch (e) {
      console.error(`  ❌ ${scene.id}: ${e.message?.slice(0, 200)}`);
    }
  }
  
  const generated = presenterScenes.filter(s => existsSync(path.join(AVATAR_DIR, `${slug}_${s.id}.mp4`)));
  console.log(`\n🎭 Avatars complete: ${generated.length}/${presenterScenes.length} scenes`);
}

// ── QUICK TEST (V2 Engine) ──
async function quickTest() {
  console.log('\n🧪 KLING API QUICK TEST — Prompt Engine V2\n');

  // Test scene + screenplay matching the V2 Visual Bible
  const testScreenplay = {
    title: 'V2 Engine Test',
    course: 'ai-foundations',
    scenes: [],
  };
  const testScene = {
    id: 'test-hook',
    type: 'broll',
    beat: 'hook',
    visual: 'A single glowing neural pathway pulses with bioluminescent light, organic tissue texture, intimate macro scale',
    duration_s: 5,
  };

  // Generate prompt via V2 engine
  const engineResult = buildVisualPrompt(testScene, testScreenplay);
  const check = validatePrompt(engineResult.prompt);

  console.log(`  Beat:     ${engineResult.beat} (${engineResult.motionMode})`);
  console.log(`  Duration: ${engineResult.duration}s`);
  console.log(`  Valid:    ${check.valid ? '✅' : '❌ ' + check.violations.join(', ')}`);
  console.log(`  Prompt:   ${engineResult.prompt.slice(0, 200)}...`);
  console.log(`  Negative: ${engineResult.negativePrompt.slice(0, 100)}...`);
  console.log('');

  try {
    console.log('  Submitting to Kling V2 Master...');
    const task = await api.textToVideo({
      prompt: engineResult.prompt,
      negative_prompt: engineResult.negativePrompt,
      model_name: 'kling-v2-master',
      duration: engineResult.duration,
      aspect_ratio: '16:9',
      mode: 'std',
    });

    console.log('  Response:', JSON.stringify(task, null, 2).slice(0, 500));

    const taskId = task?.data?.task_id;
    if (taskId) {
      console.log(`\n  ✅ Task submitted: ${taskId}`);
      console.log('  ⏳ Waiting for result (5-6 min)...\n');

      const result = await api.waitForVideoResult(taskId, api.queryTextToVideoTask.bind(api), {
        interval: 15000,
        timeout: 600000,
      });

      const videoUrl = result?.data?.task_result?.videos?.[0]?.url;
      if (videoUrl) {
        const testFile = path.join(BROLL_DIR, 'kling-v2-test.mp4');
        execSync(`curl -sL "${videoUrl}" -o "${testFile}"`, { timeout: 60000 });
        console.log(`  🎬 Test video saved: ${testFile}`);
        execSync(`open "${testFile}"`);
      } else {
        console.log('  Result:', JSON.stringify(result, null, 2).slice(0, 500));
      }
    }
  } catch (e) {
    console.error(`  ❌ Test failed: ${e.message}`);
    console.error('  Stack:', e.stack?.slice(0, 500));
  }
}

// ── MAIN ──
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    return quickTest();
  }
  
  if (!args[0]) {
    console.log('Usage: node studio/kling-generate.js <screenplay.json> [--mode broll|avatar|all]');
    console.log('       node studio/kling-generate.js --test');
    process.exit(1);
  }
  
  const sp = JSON.parse(readFileSync(path.resolve(args[0]), 'utf-8'));
  const mode = args.find(a => a.startsWith('--mode'))?.split('=')[1] ||
               args[args.indexOf('--mode') + 1] || 'all';
  
  console.log(`\n🎬 KLING CINEMA ENGINE — ${sp.title}`);
  console.log(`   Mode: ${mode} | Scenes: ${sp.scenes.length}`);
  console.log(`   2,000 units available | Pro 5s = ~5 units\n`);
  
  if (mode === 'broll' || mode === 'all') {
    await generateBRoll(sp);
  }
  
  if (mode === 'avatar' || mode === 'all') {
    await generateAvatars(sp);
  }
  
  console.log('\n🏁 Kling generation complete.');
  console.log('   Next: run compose-v4.js to assemble the final video.');
}

main().catch(e => {
  console.error(`\n💥 Kling engine crashed: ${e.message}`);
  process.exit(1);
});
