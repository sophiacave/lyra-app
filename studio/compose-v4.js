#!/usr/bin/env node
/**
 * Like One Studio V4 — Composition Engine
 * Assembles screenplay scenes into a final video.
 * 
 * Usage: node studio/compose-v4.js studio/screenplays/what-is-a-neuron-v5.json
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
import { getSceneTiming, buildAudioPadFilter, assembleCrossfade, generateEDL } from './lib/editing-engine.js';

// ── Cinema Design System (single source of truth) ──
const DS = JSON.parse(readFileSync(
  path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src', 'lib', 'design-system-cinema.json'),
  'utf-8'
));

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
const GFX_DIR = path.join(OUTPUT, 'graphics');

[VIDEO, COMPOSE_TMP, GFX_DIR].forEach(d => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); });

// Beat pauses + head padding now managed by editing-engine.js
// See: getSceneTiming(), buildAudioPadFilter()

function dur(file) {
  try {
    return parseFloat(execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${file}"`, { encoding: 'utf-8' }).trim()) || 5;
  } catch { return 5; }
}

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''); }

// ── QA Frame Gate (Design System V3 compliance) ──
// Calls qa-frame.py to validate rendered frames against the Visual Bible.
// Returns JSON with pass/fail, score, and detailed check results.
const QA_FRAME = path.join(STUDIO, 'lib', 'qa-frame.py');

function qaCheckImage(imagePath) {
  if (!existsSync(QA_FRAME)) return { pass: true, skipped: true };
  try {
    const out = execSync(
      `python3 "${QA_FRAME}" "${imagePath}" --json`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    return JSON.parse(out);
  } catch (e) {
    // qa-frame.py exits 1 on QA failure but stdout still has valid JSON
    const stdout = e.stdout || '';
    try { return JSON.parse(stdout); } catch {}
    return { pass: false, error: e.message?.slice(-200) };
  }
}

function qaCheckVideo(videoFile, numSamples = 3) {
  if (!existsSync(QA_FRAME)) return { pass: true, skipped: true };
  try {
    const out = execSync(
      `python3 "${QA_FRAME}" "${videoFile}" --sample ${numSamples} --json`,
      { encoding: 'utf-8', timeout: 60000 }
    );
    return JSON.parse(out);
  } catch (e) {
    const stdout = e.stdout || '';
    try { return JSON.parse(stdout); } catch {}
    return { pass: false, error: e.message?.slice(-200) };
  }
}

// Scene types where design system QA is meaningful (graphics-heavy, not real footage)
function shouldQaScene(scene) {
  const gfxTypes = ['title', 'section-header', 'chapter', 'quote', 'diagram', 'text-overlay'];
  if (gfxTypes.some(t => scene.type.includes(t))) return true;
  // Skip QA for presenter/broll (real footage won't match palette constraints)
  if (scene.type.includes('presenter') || scene.type.includes('broll')) return false;
  // Default: QA fallback/gradient scenes too
  return true;
}

// ── Generate a single scene segment ──
// V2: Uses editing engine for proper head padding + beat pauses.
// Removes -shortest (which was killing beat pauses) and uses
// audio pad filter to maintain correct duration with silence.
function renderScene(scene, audioFile, persona, slug, idx) {
  const outFile = path.join(COMPOSE_TMP, `${slug}_scene_${String(idx).padStart(2,'0')}_${scene.id}.mp4`);
  if (existsSync(outFile)) { console.log(`  ⏭️  ${scene.id}: cached`); return { file: outFile, timing: null, qa: null }; }

  const audioDur = audioFile ? dur(audioFile) : (scene.duration_s || 5);
  const timing = getSceneTiming(scene, audioDur);
  const { headPad, totalDur } = timing;
  const avatarImg = path.join(AVATARS, persona, 'headshot-neutral.png');
  const avatarVideo = path.join(AVATAR_DIR, `${slug}_${scene.id}.mp4`);

  // Check for real avatar video first
  const hasAvatarVideo = existsSync(avatarVideo);
  // Check for V2 engine b-roll first, then fall back to legacy naming
  const brollV2 = path.join(BROLL_DIR, `${slug}-v2_${scene.id}.mp4`);
  const brollLegacy = path.join(BROLL_DIR, `${slug}_${scene.id}.mp4`);
  const brollVideo = existsSync(brollV2) ? brollV2 : brollLegacy;
  const hasBrollVideo = existsSync(brollVideo);

  // Audio pad filter: delays audio by headPad, pads silence to totalDur
  // This replaces -shortest which was clipping beat pauses
  const audioPad = buildAudioPadFilter(headPad, totalDur);

  let cmd;

  if (scene.type.includes('presenter') && hasAvatarVideo) {
    // Real avatar video — scale to 1920x1080@30fps for consistency
    const vf = 'scale=1920:1080:flags=lanczos:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p';
    cmd = audioFile
      ? `ffmpeg -y -i "${avatarVideo}" -i "${audioFile}" -filter_complex "[0:v]${vf}[v];[1:a]${audioPad}[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`
      : `ffmpeg -y -i "${avatarVideo}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;

  } else if (scene.type.includes('presenter')) {
    // Static presenter + Ken Burns zoom
    const zoomSpeed = scene.beat === 'revelation' ? 0.0003 : 0.0005;
    const startScale = scene.beat === 'intrigue' ? 1.0 : (scene.beat === 'revelation' ? 1.05 : 1.02);
    const filterV = [
      `scale=2560:1440,zoompan=z='${startScale}+${zoomSpeed}*in':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.ceil(totalDur*30)}:s=1920x1080:fps=30`,
      `format=yuv420p`,
    ].join(',');

    cmd = audioFile
      ? `ffmpeg -y -loop 1 -i "${avatarImg}" -i "${audioFile}" -filter_complex "[0:v]${filterV}[v];[1:a]${audioPad}[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`
      : `ffmpeg -y -loop 1 -i "${avatarImg}" -filter_complex "[0:v]${filterV}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;

  } else if (scene.type.includes('broll') && hasBrollVideo) {
    // Real Kling cinema B-roll — normalize to 1920x1080@30fps
    const vf = 'scale=1920:1080:flags=lanczos:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p';
    cmd = audioFile
      ? `ffmpeg -y -i "${brollVideo}" -i "${audioFile}" -filter_complex "[0:v]${vf}[v];[1:a]${audioPad}[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`
      : `ffmpeg -y -i "${brollVideo}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;

  } else {
    // Check for 3D video title cards first (from render-3d-titles.mjs), then PNG fallback
    const gfxVideo = path.join(GFX_DIR, `${slug}_${scene.id}.mp4`);
    const gfxTitle = path.join(GFX_DIR, `${slug}_${scene.id}.png`);
    const gfxTitleGeneric = path.join(GFX_DIR, `${slug}_title.png`);
    const gfxOverlay = path.join(GFX_DIR, `${slug}_${scene.id}_overlay.png`);
    const hasGfxVideo = existsSync(gfxVideo);
    const hasGfx = existsSync(gfxTitle);
    const hasGenericTitle = existsSync(gfxTitleGeneric);

    if (hasGfxVideo) {
      // 3D title card video from Remotion Three.js — use directly
      const vf = 'scale=1920:1080:flags=lanczos:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p';
      if (audioFile) {
        cmd = `ffmpeg -y -i "${gfxVideo}" -i "${audioFile}" -filter_complex "[0:v]${vf}[v];[1:a]${audioPad}[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;
      } else {
        cmd = `ffmpeg -y -i "${gfxVideo}" -filter_complex "[0:v]${vf}[v]" -map "[v]" -c:v libx264 -crf 18 -preset fast -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;
      }

    } else if (hasGfx || (scene.type === 'title' && hasGenericTitle)) {
      // Pillow graphics engine PNG fallback — title cards, diagram placeholders
      const gfxFile = hasGfx ? gfxTitle : gfxTitleGeneric;
      const vf = 'scale=1920:1080:flags=lanczos,fps=30,format=yuv420p';

      if (audioFile) {
        cmd = `ffmpeg -y -loop 1 -i "${gfxFile}" -i "${audioFile}" -filter_complex "[0:v]${vf}[v];[1:a]${audioPad}[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;
      } else {
        cmd = `ffmpeg -y -loop 1 -i "${gfxFile}" -f lavfi -i anullsrc=r=48000:cl=mono -filter_complex "[0:v]${vf}[v]" -map "[v]" -map 1:a -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;
      }

    } else {
      // Fallback: dark atmospheric gradient + voiceover
      // Colors from design-system-cinema.json — void/obsidian palette
      const voidHex = DS.colors.foundations.void.hex.slice(1);
      const obsidianHex = DS.colors.foundations.obsidian.hex.slice(1);
      const gradColors = {
        hook:    voidHex,    setup:   '0B0A15', core:    voidHex,
        breathe: voidHex,    deepen:  '0F0D18', peak:    obsidianHex,
        close:   voidHex,    default: voidHex,
      };
      const gradColor = gradColors[scene.beat] || gradColors.default;
      const colorDur = Math.ceil(totalDur) + 1;

      if (audioFile) {
        cmd = `ffmpeg -y -f lavfi -i color=c=0x${gradColor}:s=1920x1080:d=${colorDur}:r=30,format=yuv420p -i "${audioFile}" -filter_complex "[1:a]${audioPad}[a]" -map 0:v -map "[a]" -c:v libx264 -crf 18 -preset fast -c:a aac -ar 48000 -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;
      } else {
        cmd = `ffmpeg -y -f lavfi -i color=c=0x${gradColor}:s=1920x1080:d=${colorDur}:r=30,format=yuv420p -f lavfi -i anullsrc=r=48000:cl=mono -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k -t ${totalDur.toFixed(3)} "${outFile}" 2>/dev/null`;
      }
    }
  }

  if (!cmd) {
    console.log(`  ⚠️  ${scene.id}: no render strategy`);
    return { file: null, timing, qa: null };
  }

  try {
    execSync(cmd, { encoding: 'utf-8', timeout: 120000, shell: '/bin/zsh' });

    // Ensure audio stream exists (required for crossfade/concat compatibility)
    const hasAudioStream = execSync(
      `ffprobe -v quiet -show_streams -select_streams a "${outFile}" 2>&1`,
      { encoding: 'utf-8' }
    ).includes('codec_type=audio');

    if (!hasAudioStream) {
      const withAudio = outFile.replace('.mp4', '_tmp.mp4');
      execSync(
        `ffmpeg -y -i "${outFile}" -f lavfi -i anullsrc=r=48000:cl=mono -c:v copy -c:a aac -b:a 192k -t ${totalDur.toFixed(3)} "${withAudio}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 30000 }
      );
      execSync(`mv "${withAudio}" "${outFile}"`);
    }

    // QA gate: validate design system compliance for graphics-heavy scenes
    let qa = null;
    if (shouldQaScene(scene)) {
      qa = qaCheckVideo(outFile, 2);
      if (qa.pass || qa.skipped) {
        console.log(`  ✅ ${scene.id}: ${totalDur.toFixed(1)}s (${scene.type}) [head:${headPad.toFixed(2)}s tail:${timing.tailPause.toFixed(2)}s] QA:PASS`);
      } else {
        const score = qa.avg_score ?? qa.score ?? 100;
        console.log(`  ⚠️  ${scene.id}: ${totalDur.toFixed(1)}s (${scene.type}) QA:FAIL (score:${score}%)`);
        // Auto-reject only for egregious failures (score <50% = truly off-brand).
        // Single critical failures (e.g. vignette edge pixels) are warned, not rejected.
        if (score < 50) {
          console.log(`  🚫 ${scene.id}: REJECTED — score ${score}% (min 50% to pass)`);
          return { file: null, timing, qa };
        }
      }
    } else {
      console.log(`  ✅ ${scene.id}: ${totalDur.toFixed(1)}s (${scene.type}) [head:${headPad.toFixed(2)}s tail:${timing.tailPause.toFixed(2)}s]`);
    }
    return { file: outFile, timing, qa };
  } catch (e) {
    console.error(`  ❌ ${scene.id}: ${e.message?.slice(-200)}`);
    return { file: null, timing, qa: null };
  }
}

// ── Main composition ──
function main() {
  const args = process.argv.slice(2);
  if (!args[0]) { console.log('Usage: node studio/compose-v4.js <screenplay.json>'); process.exit(1); }
  
  const sp = JSON.parse(readFileSync(path.resolve(args[0]), 'utf-8'));
  const slug = slugify(sp.title);
  const persona = sp.persona || 'faye';
  // Use screenplay version for output naming (v5 screenplay → _v5.mp4)
  const spVersion = sp.version ? `v${sp.version.split('.')[0]}` : 'v4';
  
  console.log(`\n🎬 COMPOSE V4 — ${sp.title}`);
  console.log(`   Persona: ${persona} | Scenes: ${sp.scenes.length}\n`);
  
  // Phase 0: Generate graphics (title cards, diagram placeholders, overlays)
  console.log('🎨 Phase 0: Generating graphics...');
  const gfxEngine = path.join(STUDIO, 'graphics-engine.py');
  if (existsSync(gfxEngine)) {
    try {
      const gfxOut = execSync(
        `python3 "${gfxEngine}" "${path.resolve(args[0])}"`,
        { encoding: 'utf-8', timeout: 30000, cwd: ROOT }
      );
      // Count generated files
      const gfxCount = (gfxOut.match(/✅/g) || []).length;
      console.log(`  ✅ Generated ${gfxCount} graphics assets`);
    } catch (e) {
      console.log(`  ⚠️  Graphics generation skipped: ${e.message?.slice(-100)}`);
    }
  } else {
    console.log('  ⚠️  graphics-engine.py not found, using gradient fallbacks');
  }

  // Phase 0.5: QA gate on generated graphics (Design System V3 compliance)
  console.log('\n🔍 Phase 0.5: Graphics QA gate...');
  const gfxPngs = existsSync(GFX_DIR)
    ? readdirSync(GFX_DIR).filter(f => f.startsWith(slug) && f.endsWith('.png')).map(f => path.join(GFX_DIR, f))
    : [];

  let gfxQaPass = 0, gfxQaWarn = 0, gfxQaFail = 0;
  for (const gfxFile of gfxPngs) {
    const qa = qaCheckImage(gfxFile);
    if (qa.skipped) continue;
    if (qa.pass) {
      gfxQaPass++;
    } else if ((qa.critical_fails || 0) > 0) {
      gfxQaFail++;
      console.log(`  🚫 ${path.basename(gfxFile)}: CRITICAL (score: ${qa.score || '?'}%)`);
      for (const c of (qa.checks || []).filter(c => !c.pass && c.severity === 'critical')) {
        console.log(`     → ${c.name}: ${c.actual}`);
      }
    } else {
      gfxQaWarn++;
      console.log(`  ⚠️  ${path.basename(gfxFile)}: warnings (score: ${qa.score || '?'}%)`);
    }
  }
  if (gfxPngs.length > 0) {
    console.log(`  📊 Graphics QA: ${gfxQaPass} pass, ${gfxQaWarn} warn, ${gfxQaFail} critical of ${gfxPngs.length} assets`);
  } else {
    console.log('  ⏭️  No PNG assets to QA');
  }

  // Phase 1: Render individual scenes
  console.log('\n📹 Phase 1: Rendering scene segments...');
  const segments = [];
  const timings = [];
  const qaResults = [];

  for (let i = 0; i < sp.scenes.length; i++) {
    const scene = sp.scenes[i];
    const audioFile = path.join(AUDIO, `${slug}_${scene.id}.wav`);
    const hasAudio = existsSync(audioFile);

    const { file, timing, qa } = renderScene(scene, hasAudio ? audioFile : null, persona, slug, i);
    if (file) segments.push(file);
    timings.push(timing);
    if (qa) qaResults.push({ scene: scene.id, type: scene.type, ...qa });
  }

  if (segments.length === 0) { console.error('❌ No segments rendered'); process.exit(1); }

  // Generate EDL (Edit Decision List) for review
  const edlPath = path.join(COMPOSE_TMP, `${slug}_edl.txt`);
  const validTimings = timings.filter(t => t !== null);
  if (validTimings.length > 0) {
    const edl = generateEDL(sp.scenes, timings, edlPath);
    console.log(`\n📋 EDL generated: ${edlPath}`);
    // Print breathing ratio
    const totalTime = validTimings.reduce((sum, t) => sum + t.totalDur, 0);
    const totalAudio = validTimings.reduce((sum, t) => sum + t.audioDurS, 0);
    const breathingPct = ((totalTime - totalAudio) / totalTime * 100).toFixed(1);
    console.log(`   Breathing ratio: ${breathingPct}% (target: 15-25%)`);
  }

  // Phase 2: Assemble with crossfade transitions
  console.log('\n🔗 Phase 2: Crossfade assembly...');
  const silentVideo = path.join(COMPOSE_TMP, `${slug}_${spVersion}_silent.mp4`);

  // Try crossfade assembly first (PhD editing quality)
  let assembled = assembleCrossfade(segments, sp.scenes, silentVideo);

  if (!assembled) {
    // Fallback: basic concat (still works, just hard cuts)
    console.log('  ⚠️  Falling back to basic concat...');
    const concatList = path.join(COMPOSE_TMP, 'concat.txt');
    writeFileSync(concatList, segments.map(s => `file '${s}'`).join('\n'));
    try {
      execSync(
        `ffmpeg -y -f concat -safe 0 -i "${concatList}" -c:v libx264 -crf 18 -preset fast -c:a aac -ac 2 -ar 48000 -b:a 192k "${silentVideo}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 120000 }
      );
      assembled = silentVideo;
    } catch (e) {
      console.error(`  ❌ Concat also failed: ${e.message?.slice(-200)}`);
      process.exit(1);
    }
  }

  const assembledDur = dur(silentVideo);
  console.log(`  ✅ Assembled: ${assembledDur.toFixed(1)}s (${segments.length} scenes)`);
  
  // Phase 3: Sound design — narration + music bed + room tone (inline mixing)
  console.log('\n🔊 Phase 3: Sound design...');
  const musicBed = path.join(ASSETS, 'ambient-drone-01.wav');
  const finalVideo = path.join(VIDEO, `${slug}_${spVersion}.mp4`);
  const totalDur = dur(silentVideo);

  // Extract narration from assembled video
  const narrationTrack = path.join(COMPOSE_TMP, `${slug}_narration.wav`);
  let hasNarration = false;
  try {
    execSync(`ffmpeg -y -i "${silentVideo}" -vn -ar 48000 -ac 2 "${narrationTrack}" 2>/dev/null`, { timeout: 60000 });
    hasNarration = existsSync(narrationTrack) && dur(narrationTrack) > 0.5;
  } catch { /* no audio track = silent */ }

  if (hasNarration) {
    try {
      const masterAudio = path.join(COMPOSE_TMP, `${slug}_master.wav`);
      const hasMusicBed = existsSync(musicBed);
      const durCeil = Math.ceil(totalDur);

      if (hasMusicBed) {
        // 3-layer mix: narration + music (ducked -18dB) + room tone (pink noise -42dB)
        const filter = [
          `[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[voice]`,
          `[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=-18dB,atrim=0:${durCeil},apad=whole_dur=${durCeil}[music]`,
          `anoisesrc=d=${durCeil}:c=pink:r=48000:a=0.003,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[room]`,
          `[voice][music][room]amix=inputs=3:duration=first:dropout_transition=3:weights=1 0.15 0.08[out]`,
        ].join(';');
        execSync(
          `ffmpeg -y -i "${narrationTrack}" -i "${musicBed}" -filter_complex "${filter}" -map "[out]" -ar 48000 "${masterAudio}" 2>/dev/null`,
          { stdio: 'pipe', timeout: 120000 }
        );
        console.log(`  ✅ 3-layer mix: narration + music (ducked) + room tone`);
      } else {
        // 2-layer: narration + room tone
        const filter = [
          `[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[voice]`,
          `anoisesrc=d=${durCeil}:c=pink:r=48000:a=0.003,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[room]`,
          `[voice][room]amix=inputs=2:duration=first:dropout_transition=3:weights=1 0.08[out]`,
        ].join(';');
        execSync(
          `ffmpeg -y -i "${narrationTrack}" -filter_complex "${filter}" -map "[out]" -ar 48000 "${masterAudio}" 2>/dev/null`,
          { stdio: 'pipe', timeout: 120000 }
        );
        console.log(`  ✅ 2-layer mix: narration + room tone`);
      }

      // Loudness normalize to -14 LUFS (YouTube standard)
      const normalizedAudio = path.join(COMPOSE_TMP, `${slug}_normalized.wav`);
      try {
        execSync(
          `ffmpeg -y -i "${masterAudio}" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=summary -ar 48000 "${normalizedAudio}" 2>/dev/null`,
          { stdio: 'pipe', timeout: 120000 }
        );
        execSync(`mv "${normalizedAudio}" "${masterAudio}"`);
        console.log(`  ✅ Loudness normalized to -14 LUFS`);
      } catch { console.log(`  ⚠️  Normalization skipped`); }

      // Merge master audio with video
      execSync(
        `ffmpeg -y -i "${silentVideo}" -i "${masterAudio}" -map 0:v -map 1:a -c:v copy -c:a aac -ac 2 -ar 48000 -b:a 192k -shortest "${finalVideo}" 2>/dev/null`,
        { encoding: 'utf-8', timeout: 120000 }
      );
      console.log(`  ✅ Audio merged with video`);
    } catch (e) {
      console.error(`  ⚠️  Mix failed, using assembled audio: ${e.message?.slice(-100)}`);
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
  
  // QA gate summary (scene-level design system compliance)
  const qaScenes = qaResults.filter(r => r && !r.skipped);
  if (qaScenes.length > 0) {
    const qaPassCount = qaScenes.filter(r => r.pass).length;
    const qaWarnCount = qaScenes.filter(r => !r.pass && (r.avg_score ?? r.score ?? 100) >= 50).length;
    const qaRejectCount = qaScenes.filter(r => !r.pass && (r.avg_score ?? r.score ?? 100) < 50).length;
    checks.push({
      name: `QA gate: ${qaPassCount} pass, ${qaWarnCount} warn, ${qaRejectCount} rejected of ${qaScenes.length} scenes`,
      pass: qaRejectCount === 0
    });
  }

  // Graphics QA summary
  if (gfxPngs.length > 0) {
    checks.push({
      name: `Graphics QA: ${gfxQaPass}/${gfxPngs.length} assets pass (${gfxQaFail} critical)`,
      pass: gfxQaFail === 0
    });
  }

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
