#!/usr/bin/env node
/**
 * Like One Studio V4 — Composition Engine
 * Assembles screenplay scenes into a final video.
 * 
 * Usage: node studio/compose-v4.js studio/screenplays/what-is-a-neuron-v4.json
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { generateRoomTone, mapSfxToScenes, buildSfxTrack, mixFiveLayers } from './lib/sound-design.js';

const STUDIO = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.join(STUDIO, '..');
const OUTPUT = path.join(ROOT, 'output');
const AUDIO = path.join(OUTPUT, 'audio');
const VIDEO = path.join(OUTPUT, 'video');
const AVATAR_DIR = path.join(OUTPUT, 'avatar');
const BROLL_DIR = path.join(OUTPUT, 'broll');
const AVATARS = path.join(STUDIO, 'avatars');
const ASSETS = path.join(STUDIO, 'assets', 'audio');
const COMPOSE_TMP = path.join(OUTPUT, 'compose-tmp');

[VIDEO, COMPOSE_TMP].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

// Visual Bible V2 beat pauses (seconds of silence after scene)
// Contemplative beats get longer pauses, precise beats get shorter
const BEAT_PAUSE = {
  hook:    0.8,   // breath-held, then release
  setup:   0.5,   // anticipation, keep moving
  core:    0.3,   // precise, efficient
  breathe: 1.5,   // Rothko stillness — let the insight crystallize
  deepen:  0.5,   // methodical, keep building
  peak:    2.0,   // McQueen reveal — HOLD
  close:   1.5,   // the exhale, let it land
};

function dur(file) {
  try {
    return parseFloat(execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${file}"`, { encoding: 'utf-8' }).trim()) || 5;
  } catch { return 5; }
}

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''); }

// ── Generate a single scene segment ──
function renderScene(scene, audioFile, persona, slug, idx) {
  const outFile = path.join(COMPOSE_TMP, `scene_${String(idx).padStart(2,'0')}_${scene.id}.mp4`);
  if (existsSync(outFile)) { console.log(`  ⏭️  ${scene.id}: cached`); return outFile; }
  
  const audioDur = audioFile ? dur(audioFile) : (scene.duration_s || 5);
  const pause = BEAT_PAUSE[scene.beat] || 0.5;
  const totalDur = audioDur + pause;
  const avatarImg = path.join(AVATARS, persona, 'headshot-neutral.png');
  const avatarVideo = path.join(AVATAR_DIR, `${slug}_${scene.id}.mp4`);
  
  // Check for real avatar video first
  const hasAvatarVideo = existsSync(avatarVideo);
  // Check for V2 engine b-roll first, then fall back to legacy naming
  const brollV2 = path.join(BROLL_DIR, `${slug}-v2_${scene.id}.mp4`);
  const brollLegacy = path.join(BROLL_DIR, `${slug}_${scene.id}.mp4`);
  const brollVideo = existsSync(brollV2) ? brollV2 : brollLegacy;
  const hasBrollVideo = existsSync(brollVideo);
  
  let cmd;
  
  if (scene.type.includes('presenter') && hasAvatarVideo) {
    // Real avatar video — scale to 1920x1080@30fps for consistency
    const vf = 'scale=1920:1080:flags=lanczos:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p';
    cmd = audioFile
      ? `ffmpeg -y -i "${avatarVideo}" -i "${audioFile}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -map 1:a -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -shortest -t ${totalDur} "${outFile}" 2>/dev/null`
      : `ffmpeg -y -i "${avatarVideo}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur} "${outFile}" 2>/dev/null`; /* silent — audio added by concat if missing */
      
  } else if (scene.type.includes('presenter')) {
    // Static presenter + Ken Burns zoom
    const zoomSpeed = scene.beat === 'revelation' ? 0.0003 : 0.0005;
    const startScale = scene.beat === 'intrigue' ? 1.0 : (scene.beat === 'revelation' ? 1.05 : 1.02);
    const filterV = [
      `scale=2560:1440,zoompan=z='${startScale}+${zoomSpeed}*in':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.ceil(totalDur*30)}:s=1920x1080:fps=30`,
      `format=yuv420p`,
    ].join(',');
    
    if (audioFile) {
      cmd = `ffmpeg -y -loop 1 -i "${avatarImg}" -i "${audioFile}" -filter_complex "[0:v]${filterV}[v]" -map "[v]" -map 1:a -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -shortest -t ${totalDur} "${outFile}" 2>/dev/null`;
    } else {
      cmd = `ffmpeg -y -loop 1 -i "${avatarImg}" -filter_complex "[0:v]${filterV}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur} "${outFile}" 2>/dev/null`; /* silent — audio added by concat if missing */
    }
    
  } else if (scene.type.includes('broll') && hasBrollVideo) {
    // Real Kling cinema B-roll — normalize to 1920x1080@30fps
    const vf = 'scale=1920:1080:flags=lanczos:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p';
    cmd = audioFile
      ? `ffmpeg -y -i "${brollVideo}" -i "${audioFile}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -map 1:a -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -shortest -t ${totalDur} "${outFile}" 2>/dev/null`
      : `ffmpeg -y -i "${brollVideo}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur} "${outFile}" 2>/dev/null`; /* silent — audio added by concat if missing */
      
  } else {
    // Fallback for all other types (broll, diagram, title, etc.)
    // Dark atmospheric color + voiceover — works as placeholder for any scene type
    // Visual Bible V2: void=#0B0A10, obsidian=#1A1720
    const gradColors = {
      hook:    '0B0A10', setup:   '0B0A15', core:    '0B0A10',
      breathe: '0B0A10', deepen:  '0F0D18', peak:    '1A1720',
      close:   '0B0A10', default: '0B0A10',
    };
    const gradColor = gradColors[scene.beat] || gradColors.default;

    if (audioFile) {
      cmd = `ffmpeg -y -f lavfi -i color=c=0x${gradColor}:s=1920x1080:d=${Math.ceil(totalDur)}:r=30,format=yuv420p -i "${audioFile}" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -shortest -t ${totalDur} "${outFile}" 2>/dev/null`;
    } else {
      // Silent audio track (required for concat compatibility)
      cmd = `ffmpeg -y -f lavfi -i color=c=0x${gradColor}:s=1920x1080:d=${Math.ceil(totalDur)}:r=30,format=yuv420p -f lavfi -i anullsrc=r=48000:cl=mono -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k -t ${totalDur} "${outFile}" 2>/dev/null`;
    }
  }
  
  if (!cmd) {
    console.log(`  ⚠️  ${scene.id}: no render strategy`);
    return null;
  }
  
  try {
    execSync(cmd, { encoding: 'utf-8', timeout: 120000, shell: '/bin/zsh' });

    // Ensure audio stream exists (required for concat compatibility)
    const hasAudioStream = execSync(
      `ffprobe -v quiet -show_streams -select_streams a "${outFile}" 2>&1`,
      { encoding: 'utf-8' }
    ).includes('codec_type=audio');

    if (!hasAudioStream) {
      const withAudio = outFile.replace('.mp4', '_tmp.mp4');
      execSync(
        `ffmpeg -y -i "${outFile}" -f lavfi -i anullsrc=r=48000:cl=mono -c:v copy -c:a aac -b:a 192k -shortest "${withAudio}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 30000 }
      );
      execSync(`mv "${withAudio}" "${outFile}"`);
    }

    console.log(`  ✅ ${scene.id}: ${totalDur.toFixed(1)}s (${scene.type})`);
    return outFile;
  } catch (e) {
    console.error(`  ❌ ${scene.id}: ${e.message?.slice(-200)}`);
    return null;
  }
}

// ── Main composition ──
function main() {
  const args = process.argv.slice(2);
  if (!args[0]) { console.log('Usage: node studio/compose-v4.js <screenplay.json>'); process.exit(1); }
  
  const sp = JSON.parse(readFileSync(path.resolve(args[0]), 'utf-8'));
  const slug = slugify(sp.title);
  const persona = sp.persona || 'faye';
  
  console.log(`\n🎬 COMPOSE V4 — ${sp.title}`);
  console.log(`   Persona: ${persona} | Scenes: ${sp.scenes.length}\n`);
  
  // Phase 1: Render individual scenes
  console.log('📹 Phase 1: Rendering scene segments...');
  const segments = [];
  
  for (let i = 0; i < sp.scenes.length; i++) {
    const scene = sp.scenes[i];
    const audioFile = path.join(AUDIO, `${slug}_${scene.id}.wav`);
    const hasAudio = existsSync(audioFile);
    
    const seg = renderScene(scene, hasAudio ? audioFile : null, persona, slug, i);
    if (seg) segments.push(seg);
  }
  
  if (segments.length === 0) { console.error('❌ No segments rendered'); process.exit(1); }
  
  // Phase 2: Concatenate with crossfades
  console.log('\n🔗 Phase 2: Concatenating segments...');
  const concatList = path.join(COMPOSE_TMP, 'concat.txt');
  writeFileSync(concatList, segments.map(s => `file '${s}'`).join('\n'));
  
  const silentVideo = path.join(COMPOSE_TMP, `${slug}_v4_silent.mp4`);
  try {
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${concatList}" -c:v libx264 -crf 18 -preset fast -c:a aac -ac 2 -ar 48000 -b:a 192k "${silentVideo}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 120000 }
    );
    const totalDur = dur(silentVideo);
    console.log(`  ✅ Concatenated: ${totalDur.toFixed(1)}s`);
  } catch (e) {
    console.error(`  ❌ Concat failed: ${e.message?.slice(-200)}`);
    process.exit(1);
  }
  
  // Phase 3: Sound design — 5-layer audio mix (V9 architecture)
  console.log('\n🔊 Phase 3: Sound design (5-layer V9)...');
  const musicBed = path.join(ASSETS, 'ambient-drone-01.wav');
  const finalVideo = path.join(VIDEO, `${slug}_v4.mp4`);
  const totalDur = dur(silentVideo);

  // Extract narration from concatenated video
  const narrationTrack = path.join(COMPOSE_TMP, `${slug}_narration.wav`);
  try {
    execSync(`ffmpeg -y -i "${silentVideo}" -vn -ar 48000 -ac 1 "${narrationTrack}" 2>/dev/null`, { timeout: 60000 });
  } catch { /* no audio track = silent */ }

  // Generate SFX track (Layer 3)
  const sfxTrack = path.join(COMPOSE_TMP, `${slug}_sfx.wav`);
  let sfxPath = null;
  try {
    const sfxEvents = mapSfxToScenes(sp.scenes);
    if (sfxEvents.length > 0) {
      buildSfxTrack(sfxEvents, totalDur, sfxTrack);
      sfxPath = sfxTrack;
      console.log(`  🎵 SFX: ${sfxEvents.length} events mapped`);
    }
  } catch (e) { console.log(`  ⚠️  SFX generation skipped: ${e.message?.slice(0, 80)}`); }

  // Generate room tone (Layer 4)
  const roomTonePath = path.join(COMPOSE_TMP, `${slug}_roomtone.wav`);
  let roomPath = null;
  try {
    generateRoomTone(totalDur, roomTonePath);
    roomPath = roomTonePath;
    console.log(`  🌙 Room tone generated`);
  } catch (e) { console.log(`  ⚠️  Room tone skipped: ${e.message?.slice(0, 80)}`); }

  // 5-layer mix
  if (existsSync(narrationTrack)) {
    try {
      const masterAudio = path.join(COMPOSE_TMP, `${slug}_master.wav`);
      mixFiveLayers({
        narration: narrationTrack,
        music: existsSync(musicBed) ? musicBed : null,
        sfxTrack: sfxPath,
        roomTone: roomPath,
        outputPath: masterAudio,
        durationS: totalDur,
      });

      // Merge master audio with silent video
      execSync(
        `ffmpeg -y -i "${silentVideo}" -i "${masterAudio}" -map 0:v -map 1:a -c:v copy -c:a aac -ac 2 -ar 48000 -b:a 192k -shortest "${finalVideo}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 120000 }
      );
      console.log(`  ✅ 5-layer mix applied (narration + music + SFX + room tone + silence)`);
    } catch (e) {
      console.error(`  ⚠️  5-layer mix failed, falling back to basic: ${e.message?.slice(-100)}`);
      execSync(`cp "${silentVideo}" "${finalVideo}"`);
    }
  } else {
    console.log('  ⚠️  No narration track — using raw video audio');
    execSync(`cp "${silentVideo}" "${finalVideo}"`);
  }
  
  // Phase 4: QC
  console.log('\n✅ Phase 4: Quality Check...');
  const finalDur = dur(finalVideo);
  const sceneTypes = new Set(sp.scenes.map(s => s.type));
  
  const checks = [
    { name: `Duration: ${finalDur.toFixed(1)}s`, pass: finalDur >= 60 && finalDur <= 300 },
    { name: `Scene types: ${sceneTypes.size} (min 3)`, pass: sceneTypes.size >= 3 },
    { name: `Segments rendered: ${segments.length}/${sp.scenes.length}`, pass: segments.length === sp.scenes.length },
    { name: `Output exists`, pass: existsSync(finalVideo) },
  ];
  
  // LUFS check
  try {
    const lufsOut = execSync(
      `ffmpeg -i "${finalVideo}" -af loudnorm=print_format=json -f null - 2>&1`,
      { encoding: 'utf-8', shell: '/bin/zsh' }
    );
    const lufsMatch = lufsOut.match(/"input_i"\s*:\s*"(-?\d+\.?\d*)"/);
    const lufs = lufsMatch ? parseFloat(lufsMatch[1]) : null;
    checks.push({ name: `LUFS: ${lufs?.toFixed(1)} (target: -14 ±2)`, pass: lufs && Math.abs(lufs + 14) <= 2 });
  } catch { checks.push({ name: 'LUFS check', pass: false }); }
  
  for (const c of checks) console.log(`  ${c.pass ? '✅' : '❌'} ${c.name}`);
  
  const allPass = checks.every(c => c.pass);
  console.log(allPass ? '\n🏆 ALL CHECKS PASSED' : '\n⚠️  SOME CHECKS NEED ATTENTION');
  console.log(`\n📦 Output: ${finalVideo}`);
  console.log(`   Duration: ${finalDur.toFixed(1)}s | Scenes: ${segments.length}`);
}

main();
