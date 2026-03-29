#!/usr/bin/env node
/**
 * Like One Studio — Lesson Render Pipeline v2
 * Full 8-phase cinematic pipeline: content analysis → TTS → audio post → pacing → render → merge → cinema grade → QC.
 *
 * Usage: node studio/render-lesson-v2.js [lesson-config.json]
 */
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';
import { buildTimingMap, measureWPM, PACING } from './lib/pacing-engine.js';
import {
  processTTS, normalizeLoudness, mixWithMusic, buildSFXTrack,
  mergeVideoAudio, verifyLoudness, correctWPM, WPM_TARGETS, AUDIO,
} from './lib/audio-engine.js';
import { cinemaGrade } from './lib/cinema-grade.js';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const ASSETS_DIR = path.join(STUDIO_DIR, 'assets', 'audio');
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const VIDEO_DIR = path.join(OUTPUT_DIR, 'video');

// Ensure output dirs exist
[OUTPUT_DIR, AUDIO_DIR, VIDEO_DIR].forEach(d => {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
});

const TTS_ENGINE = process.env.TTS_ENGINE || 's2pro';

// ── TTS Engines (reused from v1) ──

async function generateTTS_S2Pro(text, voiceKey, outputName) {
  const S2PRO_URL = process.env.S2PRO_URL || 'http://127.0.0.1:8180';
  const wavPath = path.join(AUDIO_DIR, `${outputName}.wav`);

  try {
    // Check server health
    const health = await fetch(`${S2PRO_URL}/v1/health`);
    if (!health.ok) throw new Error('S2 Pro server not healthy');

    console.log(`  🔊 S2 Pro: generating "${outputName}" (${text.length} chars)...`);
    const t0 = Date.now();

    const resp = await fetch(`${S2PRO_URL}/v1/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(300000),
      body: JSON.stringify({
        text,
        references: [],
        max_new_tokens: 4096,
        chunk_length: 150,
        top_p: 0.6,
        repetition_penalty: 1.2,
        temperature: 0.5,
        format: 'wav',
        seed: 42,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`S2 Pro TTS failed (${resp.status}): ${err.slice(-200)}`);
    }

    const audioBuffer = Buffer.from(await resp.arrayBuffer());
    const outDir = path.dirname(wavPath);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(wavPath, audioBuffer);

    // Get duration via ffprobe
    const probe = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`, { encoding: 'utf-8' }).trim();
    const dur = parseFloat(probe) || 5;
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const words = text.split(/\s+/).length;
    const wpm = Math.round((words / dur) * 60);
    console.log(`  ✅ ${dur.toFixed(1)}s audio in ${elapsed}s | ${wpm} WPM`);

    return { audio_path: wavPath, duration_s: dur };
  } catch (e) {
    console.error(`  ❌ S2 Pro TTS failed for "${outputName}":`, e.message?.slice(-200));
    return null;
  }
}

async function generateTTS_Edge(text, voiceKey, outputName) {
  const wavPath = path.join(AUDIO_DIR, `${outputName}.mp3`);
  const voice = voiceKey === 'sophia' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';
  const cmd = `edge-tts --voice "${voice}" --text "${text.replace(/"/g, '\\"')}" --write-media "${wavPath}"`;
  try {
    execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
    const probe = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`, { encoding: 'utf-8' }).trim();
    return { audio_path: wavPath, duration_s: parseFloat(probe) || 5 };
  } catch (e) {
    console.error(`  ❌ Edge TTS failed for "${outputName}":`, e.message?.slice(-200));
    return null;
  }
}

async function generateTTS(text, voiceKey, outputName, engine) {
  const sel = engine || TTS_ENGINE;
  if (sel === 's2pro') {
    const result = await generateTTS_S2Pro(text, voiceKey, outputName);
    if (result) return result;
    console.log('  ⚠️ S2 Pro failed, falling back to Edge TTS...');
  }
  return generateTTS_Edge(text, voiceKey, outputName);
}

// ── Remotion Render ──

function renderVideo(compositionId, outputPath, props) {
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
    execSync(cmd, { cwd: path.join(STUDIO_DIR, '..'), stdio: 'pipe', timeout: 600000 });
    return true;
  } catch (e) {
    console.error(`  ❌ Render failed:`, e.stderr?.toString?.()?.slice(-500) || e.message?.slice(-500));
    return false;
  }
}

// ── SFX Event Builder ──
// Maps timeline entries to SFX events based on section type.

function buildSFXEvents(timeline) {
  const events = [];
  for (const entry of timeline) {
    const timestampMs = Math.round((entry.startFrame / PACING.FPS) * 1000);
    switch (entry.type) {
      case 'title':
        if (existsSync(path.join(ASSETS_DIR, 'sfx-impact.wav'))) {
          events.push({ path: path.join(ASSETS_DIR, 'sfx-impact.wav'), timestampMs: timestampMs + 500, volumeDb: AUDIO.SFX_IMPACT_DB });
        }
        break;
      case 'concept':
        if (existsSync(path.join(ASSETS_DIR, 'sfx-whoosh.wav'))) {
          events.push({ path: path.join(ASSETS_DIR, 'sfx-whoosh.wav'), timestampMs, volumeDb: AUDIO.SFX_WHOOSH_DB });
        }
        break;
      case 'quote':
        if (existsSync(path.join(ASSETS_DIR, 'sfx-swell.wav'))) {
          events.push({ path: path.join(ASSETS_DIR, 'sfx-swell.wav'), timestampMs, volumeDb: AUDIO.SFX_SWELL_DB });
        }
        break;
      case 'code':
        if (existsSync(path.join(ASSETS_DIR, 'sfx-whoosh.wav'))) {
          events.push({ path: path.join(ASSETS_DIR, 'sfx-whoosh.wav'), timestampMs, volumeDb: AUDIO.SFX_WHOOSH_DB });
        }
        break;
      case 'outro':
        if (existsSync(path.join(ASSETS_DIR, 'sfx-chime.wav'))) {
          events.push({ path: path.join(ASSETS_DIR, 'sfx-chime.wav'), timestampMs: timestampMs + 800, volumeDb: AUDIO.SFX_CHIME_DB });
        }
        break;
    }
  }
  return events;
}

// ═══════════════════════════════════════════════════
// MAIN v2 PIPELINE — 7 Phases
// ═══════════════════════════════════════════════════

async function renderLessonV2(config) {
  const lessonSlug = config.slug || config.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const startTime = Date.now();

  console.log(`\n🎬 LIKE ONE STUDIO v2 — Rendering: ${config.title}`);
  console.log('═'.repeat(60));

  // ── PHASE 1: CONTENT ANALYSIS ──
  console.log('\n📊 Phase 1: Content analysis...');
  const sections = config.sections || [];
  const narrationSections = sections.filter(s => s.type === 'narration');
  const totalWords = narrationSections.reduce((sum, s) => sum + (s.text || '').split(/\s+/).length, 0);
  console.log(`  📝 ${sections.length} sections, ${narrationSections.length} narrated, ~${totalWords} words`);

  if (sections.length < 2) {
    console.error('  ❌ Need at least 2 sections. Aborting.');
    return null;
  }

  // ── PHASE 2: TTS GENERATION ──
  console.log('\n🎙️ Phase 2: TTS generation...');
  const audioResults = [];
  const wpmResults = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.type === 'narration') {
      const audioName = `${lessonSlug}_s${String(i).padStart(2, '0')}`;
      const result = await generateTTS(section.text, section.voice || 'sophia', audioName, config.ttsEngine);
      if (result) {
        audioResults.push({ index: i, ...result });
        section.audioDuration = result.duration_s;
        section.durationS = result.duration_s;

        // Read sentence timing
        if (result.timing_path && existsSync(result.timing_path)) {
          const timing = JSON.parse(readFileSync(result.timing_path, 'utf-8'));
          if (timing.sentences) section.sentenceTiming = timing.sentences;
        }

        // WPM measurement
        const wpm = measureWPM(section.text, result.duration_s);
        wpmResults.push({ index: i, wpm: Math.round(wpm), duration: result.duration_s });
        const wpmOk = wpm >= 130 && wpm <= 165;
        console.log(`  ${wpmOk ? '✅' : '⚠️'} Segment ${i}: ${result.duration_s.toFixed(1)}s, ${Math.round(wpm)} WPM`);
      }
    }
  }

  // ── PHASE 3: AUDIO POST-PROCESSING ──
  console.log('\n🔊 Phase 3: Audio post-processing...');
  const processedAudioResults = [];

  for (const ar of audioResults) {
    const processedPath = ar.audio_path.replace(/\.(wav|mp3)$/, '_processed.wav');

    // Stage 1: TTS 6-stage chain
    const processed = processTTS(ar.audio_path, processedPath);
    if (processed) {
      let currentPath = processedPath;

      // Stage 2: WPM auto-correction (if outside 130-165 range)
      const section = sections[ar.index];
      const wpmEntry = wpmResults.find(w => w.index === ar.index);
      if (wpmEntry && (wpmEntry.wpm < 130 || wpmEntry.wpm > 165)) {
        // Determine target WPM by section context
        const targetWPM = section.pace === 'hook' ? WPM_TARGETS.hook
          : section.pace === 'concept' ? WPM_TARGETS.concept
          : section.pace === 'recap' ? WPM_TARGETS.recap
          : WPM_TARGETS.standard;

        const correctedPath = ar.audio_path.replace(/\.(wav|mp3)$/, '_corrected.wav');
        const correction = correctWPM(currentPath, correctedPath, wpmEntry.wpm, targetWPM);
        if (correction.success) {
          currentPath = correctedPath;
          // Update section duration with corrected audio
          section.audioDuration = correction.newDuration;
          section.durationS = correction.newDuration;
          console.log(`  🎯 Segment ${ar.index}: ${wpmEntry.wpm}→${targetWPM} WPM (atempo=${correction.atempo.toFixed(3)})`);
        }
      }

      // Stage 3: Loudness normalization
      const normalizedPath = ar.audio_path.replace(/\.(wav|mp3)$/, '_normalized.wav');
      const normalized = normalizeLoudness(currentPath, normalizedPath);
      const finalPath = normalized ? normalizedPath : currentPath;
      processedAudioResults.push({ ...ar, processed_path: finalPath });
      console.log(`  ✅ Segment ${ar.index}: processed + normalized`);
    } else {
      processedAudioResults.push({ ...ar, processed_path: ar.audio_path });
      console.log(`  ⚠️ Segment ${ar.index}: using raw audio (processing failed)`);
    }
  }

  // ── PHASE 4: PACING CALCULATION ──
  console.log('\n⏱️ Phase 4: Pacing calculation...');
  const { timeline, totalFrames, totalDurationS } = buildTimingMap(config, PACING.FPS);

  console.log(`  📐 ${timeline.length} timeline entries`);
  console.log(`  ⏱️ Total: ${totalDurationS.toFixed(1)}s (${totalFrames} frames)`);

  if (totalDurationS > PACING.MAX_VIDEO_S) {
    console.log(`  ⚠️ Video is ${totalDurationS.toFixed(0)}s — exceeds ${PACING.MAX_VIDEO_S}s sweet spot`);
  }

  // Build audio concat with gaps matching timeline
  const combinedNarrationPath = path.join(AUDIO_DIR, `${lessonSlug}_narration.wav`);
  if (processedAudioResults.length > 0) {
    const audioInputs = [];
    const filterParts = [];
    let inputIndex = 0;

    for (const entry of timeline) {
      const duration = (entry.endFrame - entry.startFrame) / PACING.FPS;
      const gapDuration = (entry.gapEndFrame - entry.endFrame) / PACING.FPS;

      if (entry.type === 'title' || (entry.section && entry.section.type !== 'narration')) {
        // Silence for non-narration sections + their gaps
        const totalSilence = duration + gapDuration;
        audioInputs.push(`-f lavfi -t ${totalSilence.toFixed(3)} -i anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=mono`);
        filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
        inputIndex++;
      } else if (entry.section && entry.section.type === 'narration') {
        // Processed narration audio
        const ar = processedAudioResults.find(a => a.index === entry.index);
        if (ar) {
          audioInputs.push(`-i "${ar.processed_path}"`);
          filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
          inputIndex++;

          // Gap silence after narration
          if (gapDuration > 0) {
            audioInputs.push(`-f lavfi -t ${gapDuration.toFixed(3)} -i anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=mono`);
            filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
            inputIndex++;
          }
        }
      }
    }

    if (inputIndex > 0) {
      const concatInputs = Array.from({ length: inputIndex }, (_, i) => `[s${i}]`).join('');
      filterParts.push(`${concatInputs}concat=n=${inputIndex}:v=0:a=1[out]`);
      const cmd = `ffmpeg -y ${audioInputs.join(' ')} -filter_complex "${filterParts.join(';')}" -map "[out]" -ar ${AUDIO.SAMPLE_RATE} "${combinedNarrationPath}"`;
      try {
        execSync(cmd, { stdio: 'pipe', timeout: 60000 });
        console.log(`  ✅ Narration track assembled with breathing gaps`);
      } catch (e) {
        console.error(`  ⚠️ Narration concat failed:`, e.message?.slice(-200));
      }
    }
  }

  // SFX track
  const sfxPath = path.join(AUDIO_DIR, `${lessonSlug}_sfx.wav`);
  const sfxEvents = buildSFXEvents(timeline);
  buildSFXTrack(sfxEvents, totalDurationS, sfxPath);
  console.log(`  🔔 ${sfxEvents.length} SFX events placed`);

  // Music mix (if ambient bed exists)
  const masterAudioPath = path.join(AUDIO_DIR, `${lessonSlug}_master.wav`);
  const ambientPath = path.join(ASSETS_DIR, 'ambient-drone-01.wav');

  if (existsSync(combinedNarrationPath) && existsSync(ambientPath)) {
    // First mix narration + SFX
    const narSfxPath = path.join(AUDIO_DIR, `${lessonSlug}_nar_sfx.wav`);
    try {
      execSync(`ffmpeg -y -i "${combinedNarrationPath}" -i "${sfxPath}" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=3" -ar ${AUDIO.SAMPLE_RATE} "${narSfxPath}"`, { stdio: 'pipe', timeout: 60000 });

      // Then duck music under narration+sfx
      const musicMixed = mixWithMusic(narSfxPath, ambientPath, masterAudioPath, totalDurationS);
      if (!musicMixed) {
        execSync(`cp "${narSfxPath}" "${masterAudioPath}"`);
        console.log(`  ⚠️ Music ducking failed, using narration+SFX only`);
      } else {
        console.log(`  🎵 Master audio: narration + SFX + ambient (ducked)`);
      }
    } catch (e) {
      // Fallback: just narration
      execSync(`cp "${combinedNarrationPath}" "${masterAudioPath}"`);
      console.log(`  ⚠️ SFX/music mix failed, using narration only`);
    }
  } else if (existsSync(combinedNarrationPath)) {
    execSync(`cp "${combinedNarrationPath}" "${masterAudioPath}"`);
    console.log(`  📢 Master audio: narration only (no ambient bed)`);
  }

  // Final loudness normalization on master
  if (existsSync(masterAudioPath)) {
    const normalizedMasterPath = path.join(AUDIO_DIR, `${lessonSlug}_master_norm.wav`);
    if (normalizeLoudness(masterAudioPath, normalizedMasterPath)) {
      execSync(`mv "${normalizedMasterPath}" "${masterAudioPath}"`);
      console.log(`  📏 Master normalized to -14 LUFS`);
    }
  }

  // ── PHASE 5: REMOTION RENDER ──
  console.log('\n🎨 Phase 5: Remotion render...');
  const silentPath = path.join(VIDEO_DIR, `${lessonSlug}_silent.mp4`);
  const success = renderVideo('LessonVideo', silentPath, config);

  if (!success) {
    console.error('  ❌ Visual render failed. Aborting.');
    return null;
  }
  console.log(`  ✅ Silent video rendered (${totalFrames} frames)`);

  // ── PHASE 6: FINAL MERGE ──
  console.log('\n🎬 Phase 6: Final merge...');
  const finalPath = path.join(VIDEO_DIR, `${lessonSlug}.mp4`);

  if (existsSync(masterAudioPath)) {
    const merged = mergeVideoAudio(silentPath, masterAudioPath, finalPath);
    if (!merged) {
      execSync(`cp "${silentPath}" "${finalPath}"`);
      console.log(`  ⚠️ Merge failed, using silent video`);
    } else {
      console.log(`  ✅ Video + master audio merged`);
    }
  } else {
    execSync(`cp "${silentPath}" "${finalPath}"`);
    console.log(`  📹 No audio — silent video only`);
  }

  // ── PHASE 7: CINEMA GRADE ──
  console.log('\n🎨 Phase 7: Cinema grade...');
  const gradeResult = await cinemaGrade(finalPath, {
    theme: config.colorTheme,
    replaceOriginal: true,
    grain: true,
    vignette: true,
    lessonKey: lessonSlug,
  });
  if (gradeResult.success) {
    console.log(`  ✅ Graded with ${gradeResult.lutUsed} LUT (${(gradeResult.duration / 1000).toFixed(1)}s)`);
  } else {
    console.log(`  ⚠️ Cinema grade skipped: ${gradeResult.error}`);
  }

  // ── PHASE 8: QUALITY CHECK ──
  console.log('\n🔍 Phase 8: Quality check...');
  const qc = { pass: true, issues: [] };

  // Audio loudness
  if (existsSync(masterAudioPath)) {
    const loudness = verifyLoudness(masterAudioPath);
    if (loudness.lufs !== null) {
      const lufsOk = Math.abs(loudness.lufs - AUDIO.TARGET_LUFS) <= 1.0;
      console.log(`  ${lufsOk ? '✅' : '❌'} Loudness: ${loudness.lufs.toFixed(1)} LUFS (target: ${AUDIO.TARGET_LUFS})`);
      if (!lufsOk) { qc.pass = false; qc.issues.push(`Loudness ${loudness.lufs.toFixed(1)} outside ±1 of ${AUDIO.TARGET_LUFS}`); }
    }
    if (loudness.truePeak !== null) {
      const tpOk = loudness.truePeak <= AUDIO.TRUE_PEAK_MAX;
      console.log(`  ${tpOk ? '✅' : '❌'} True peak: ${loudness.truePeak.toFixed(1)} dBTP (max: ${AUDIO.TRUE_PEAK_MAX})`);
      if (!tpOk) { qc.pass = false; qc.issues.push(`True peak ${loudness.truePeak.toFixed(1)} exceeds ${AUDIO.TRUE_PEAK_MAX}`); }
    }
  }

  // WPM check
  for (const w of wpmResults) {
    if (w.wpm < 130 || w.wpm > 165) {
      qc.issues.push(`Segment ${w.index}: ${w.wpm} WPM (target 130-165)`);
    }
  }

  // Duration check
  if (totalDurationS > PACING.MAX_VIDEO_S) {
    qc.issues.push(`Duration ${totalDurationS.toFixed(0)}s exceeds ${PACING.MAX_VIDEO_S}s sweet spot`);
  }

  // Scene duration variation
  const sceneDurations = timeline
    .filter(e => e.type !== 'title')
    .map(e => (e.endFrame - e.startFrame) / PACING.FPS);
  const uniqueDurations = new Set(sceneDurations.map(d => Math.round(d)));
  if (uniqueDurations.size < 3 && sceneDurations.length >= 3) {
    qc.issues.push(`Only ${uniqueDurations.size} unique scene durations — needs more variation`);
  } else {
    console.log(`  ✅ Scene variation: ${uniqueDurations.size} unique durations`);
  }

  // Breathing gaps present
  const gaps = timeline.filter(e => (e.gapEndFrame - e.endFrame) > 0);
  console.log(`  ✅ Breathing gaps: ${gaps.length} present`);

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const fileSize = execSync(`ls -lh "${finalPath}"`, { encoding: 'utf-8' }).trim().split(/\s+/)[4];

  console.log('\n' + '═'.repeat(60));
  console.log(`${qc.pass ? '✨' : '⚠️'} COMPLETE: ${finalPath}`);
  console.log(`   📐 ${totalDurationS.toFixed(1)}s | ${fileSize} | ${elapsed}s render time`);
  if (qc.issues.length > 0) {
    console.log(`   ⚠️ Issues: ${qc.issues.join('; ')}`);
  }
  console.log(`   ▶️  open "${finalPath}"`);

  return { path: finalPath, duration: totalDurationS, qc };
}

// ── CLI ──
const configPath = process.argv[2];

if (configPath) {
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  renderLessonV2(config);
} else {
  console.log('Usage: node studio/render-lesson-v2.js <lesson-config.json>');
  console.log('No config provided. Use a lesson JSON file.');
}
