#!/usr/bin/env node
/**
 * Like One Studio — MASTER PIPELINE
 * Orchestrates the full video production flow: TTS -> Compose -> CinemaGrade -> QC
 *
 * Usage (CLI):
 *   node studio/pipeline.js content/configs/what-is-a-neuron-v3.json
 *   node studio/pipeline.js content/configs/test-pipeline.json --skip-tts
 *   node studio/pipeline.js content/configs/test-pipeline.json --skip-grade
 *
 * Usage (module):
 *   import { runPipeline } from './studio/pipeline.js';
 *   const result = await runPipeline(config, { skipTTS: false });
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// ── Lib imports (reuse existing modules) ──
import { cinemaGrade } from './lib/cinema-grade.js';
import { runQAGate, writeToBrain } from './lib/qa-gate.js';
import { buildTimingMap, PACING } from './lib/pacing-engine.js';
import {
  processTTS, normalizeLoudness, mixWithMusic, buildSFXTrack,
  mergeVideoAudio, correctWPM, WPM_TARGETS, AUDIO,
} from './lib/audio-engine.js';

// ── Paths ──
const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(STUDIO_DIR, '..');
const ASSETS_DIR = path.join(STUDIO_DIR, 'assets', 'audio');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const VIDEO_DIR = path.join(OUTPUT_DIR, 'video');

// Ensure output dirs exist
for (const d of [OUTPUT_DIR, AUDIO_DIR, VIDEO_DIR]) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

// ── S2 Pro TTS Client ──
// Uses the same localhost:8180 endpoint as studio/tts/s2pro-client.js

const S2PRO_URL = process.env.S2PRO_URL || 'http://127.0.0.1:8180';

/**
 * Generate TTS audio for a single text segment via Fish S2-Pro.
 * @param {string} text - Narration text
 * @param {string} voiceKey - Voice identifier
 * @param {string} outputName - Base filename (no extension)
 * @returns {{ audio_path: string, duration_s: number } | null}
 */
async function generateTTS(text, voiceKey, outputName) {
  const wavPath = path.join(AUDIO_DIR, `${outputName}.wav`);

  try {
    // Health check
    const health = await fetch(`${S2PRO_URL}/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!health.ok) throw new Error('S2 Pro server not healthy');

    console.log(`    Generating "${outputName}" (${text.length} chars)...`);
    const t0 = Date.now();

    const resp = await fetch(`${S2PRO_URL}/v1/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(300_000),
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
    const probe = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`,
      { encoding: 'utf-8' }
    ).trim();
    const dur = parseFloat(probe) || 5;
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const words = text.split(/\s+/).length;
    const wpm = Math.round((words / dur) * 60);
    console.log(`    OK: ${dur.toFixed(1)}s in ${elapsed}s | ${wpm} WPM`);

    return { audio_path: wavPath, duration_s: dur };
  } catch (e) {
    console.error(`    FAILED for "${outputName}": ${e.message?.slice(-200)}`);
    return null;
  }
}

// ── Remotion Render ──

/**
 * Render a Remotion composition to an MP4 file.
 * @param {string} compositionId - Remotion composition name
 * @param {string} outputPath - Output .mp4 path
 * @param {object} props - Composition props
 * @returns {boolean} success
 */
function renderVideo(compositionId, outputPath, props) {
  // Strip audio paths from props (Remotion doesn't need them)
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
    execSync(cmd, { cwd: PROJECT_ROOT, stdio: 'pipe', timeout: 600_000 });
    return true;
  } catch (e) {
    console.error(`    Render error: ${e.stderr?.toString?.()?.slice(-500) || e.message?.slice(-500)}`);
    return false;
  }
}

// ── SFX Event Builder ──

function buildSFXEvents(timeline) {
  const events = [];
  for (const entry of timeline) {
    const timestampMs = Math.round((entry.startFrame / PACING.FPS) * 1000);
    const sfxMap = {
      title:   { file: 'sfx-impact.wav', delay: 500, db: AUDIO.SFX_IMPACT_DB },
      concept: { file: 'sfx-whoosh.wav', delay: 0,   db: AUDIO.SFX_WHOOSH_DB },
      code:    { file: 'sfx-whoosh.wav', delay: 0,   db: AUDIO.SFX_WHOOSH_DB },
      quote:   { file: 'sfx-swell.wav',  delay: 0,   db: AUDIO.SFX_SWELL_DB },
      outro:   { file: 'sfx-chime.wav',  delay: 800, db: AUDIO.SFX_CHIME_DB },
    };
    const cfg = sfxMap[entry.type];
    if (cfg) {
      const sfxPath = path.join(ASSETS_DIR, cfg.file);
      if (existsSync(sfxPath)) {
        events.push({ path: sfxPath, timestampMs: timestampMs + cfg.delay, volumeDb: cfg.db });
      }
    }
  }
  return events;
}

// ══════════════════════════════════════════════════════
// MASTER PIPELINE — 4 Phases
// ══════════════════════════════════════════════════════

/**
 * Run the full video production pipeline.
 *
 * @param {object} config - Screenplay JSON config
 * @param {object} [opts]
 * @param {boolean} [opts.skipTTS] - Skip TTS, compose with silence
 * @param {boolean} [opts.skipGrade] - Skip cinema grading
 * @param {boolean} [opts.skipQC] - Skip QA gate
 * @returns {{ path: string, duration: number, qc: object } | null}
 */
export async function runPipeline(config, opts = {}) {
  const slug = config.slug || config.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const sections = config.sections || [];
  const pipelineStart = Date.now();

  console.log('');
  console.log('='.repeat(60));
  console.log(`LIKE ONE STUDIO — MASTER PIPELINE`);
  console.log(`Lesson: ${config.title}`);
  console.log(`Slug:   ${slug}`);
  console.log(`Sections: ${sections.length}`);
  console.log('='.repeat(60));

  if (sections.length === 0) {
    console.error('ERROR: Config has no sections. Aborting.');
    return null;
  }

  // ──────────────────────────────────────────────────
  // PHASE 1: TTS GENERATION
  // ──────────────────────────────────────────────────
  console.log('\n--- Phase 1: TTS Generation ---');

  const audioResults = [];
  const wpmResults = [];
  let ttsSkipped = false;

  if (opts.skipTTS) {
    console.log('  [SKIP] TTS skipped by flag. Will compose with silence.');
    ttsSkipped = true;
  } else {
    const narrationSections = sections.filter(s => s.type === 'narration');
    console.log(`  ${narrationSections.length} narration segment(s) to generate`);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.type !== 'narration') continue;

      const audioName = `${slug}_s${String(i).padStart(2, '0')}`;
      const result = await generateTTS(
        section.text,
        section.voice || config.voice || 'sophia',
        audioName,
      );

      if (result) {
        audioResults.push({ index: i, ...result });
        section.audioDuration = result.duration_s;
        section.durationS = result.duration_s;

        const words = section.text.split(/\s+/).length;
        const wpm = Math.round((words / result.duration_s) * 60);
        wpmResults.push({ index: i, wpm, duration: result.duration_s });
        const wpmOk = wpm >= 130 && wpm <= 165;
        console.log(`    Segment ${i}: ${result.duration_s.toFixed(1)}s, ${wpm} WPM ${wpmOk ? '' : '(out of range)'}`);
      } else {
        console.log(`    Segment ${i}: TTS failed, will use silence`);
      }
    }

    if (audioResults.length === 0 && narrationSections.length > 0) {
      console.log('  WARNING: All TTS failed. Composing with silence.');
      ttsSkipped = true;
    } else if (audioResults.length > 0) {
      console.log(`  ${audioResults.length} audio segment(s) generated`);
    }
  }

  // ── Audio post-processing (if we have audio) ──
  const processedAudioResults = [];

  if (!ttsSkipped && audioResults.length > 0) {
    console.log('\n  Audio post-processing...');

    for (const ar of audioResults) {
      const processedPath = ar.audio_path.replace(/\.(wav|mp3)$/, '_processed.wav');
      const processed = processTTS(ar.audio_path, processedPath);

      if (processed) {
        let currentPath = processedPath;

        // WPM auto-correction
        const section = sections[ar.index];
        const wpmEntry = wpmResults.find(w => w.index === ar.index);
        if (wpmEntry && (wpmEntry.wpm < 130 || wpmEntry.wpm > 165)) {
          const targetWPM = section.pace === 'hook' ? WPM_TARGETS.hook
            : section.pace === 'concept' ? WPM_TARGETS.concept
            : section.pace === 'recap' ? WPM_TARGETS.recap
            : WPM_TARGETS.standard;

          const correctedPath = ar.audio_path.replace(/\.(wav|mp3)$/, '_corrected.wav');
          const correction = correctWPM(currentPath, correctedPath, wpmEntry.wpm, targetWPM);
          if (correction.success) {
            currentPath = correctedPath;
            section.audioDuration = correction.newDuration;
            section.durationS = correction.newDuration;
            console.log(`    Segment ${ar.index}: WPM corrected ${wpmEntry.wpm} -> ${targetWPM} (atempo=${correction.atempo.toFixed(3)})`);
          }
        }

        // Loudness normalization
        const normalizedPath = ar.audio_path.replace(/\.(wav|mp3)$/, '_normalized.wav');
        const normalized = normalizeLoudness(currentPath, normalizedPath);
        const finalPath = normalized ? normalizedPath : currentPath;
        processedAudioResults.push({ ...ar, processed_path: finalPath });
        console.log(`    Segment ${ar.index}: processed + normalized`);
      } else {
        processedAudioResults.push({ ...ar, processed_path: ar.audio_path });
        console.log(`    Segment ${ar.index}: using raw audio (processing failed)`);
      }
    }
  }

  // ──────────────────────────────────────────────────
  // PHASE 2: COMPOSE (Remotion render + audio merge)
  // ──────────────────────────────────────────────────
  console.log('\n--- Phase 2: Compose (Remotion + Audio Merge) ---');

  // Build timing map
  const { timeline, totalFrames, totalDurationS } = buildTimingMap(config, PACING.FPS);
  console.log(`  Timeline: ${timeline.length} entries, ${totalDurationS.toFixed(1)}s (${totalFrames} frames)`);

  // Assemble narration track
  const combinedNarrationPath = path.join(AUDIO_DIR, `${slug}_narration.wav`);
  let hasNarrationTrack = false;

  if (processedAudioResults.length > 0) {
    const audioInputs = [];
    const filterParts = [];
    let inputIndex = 0;

    for (const entry of timeline) {
      const duration = (entry.endFrame - entry.startFrame) / PACING.FPS;
      const gapDuration = (entry.gapEndFrame - entry.endFrame) / PACING.FPS;

      if (entry.type === 'title' || (entry.section && entry.section.type !== 'narration')) {
        const totalSilence = duration + gapDuration;
        audioInputs.push(`-f lavfi -t ${totalSilence.toFixed(3)} -i anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=mono`);
        filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
        inputIndex++;
      } else if (entry.section && entry.section.type === 'narration') {
        const ar = processedAudioResults.find(a => a.index === entry.index);
        if (ar) {
          audioInputs.push(`-i "${ar.processed_path}"`);
          filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
          inputIndex++;

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
        execSync(cmd, { stdio: 'pipe', timeout: 60_000 });
        hasNarrationTrack = true;
        console.log('  Narration track assembled');
      } catch (e) {
        console.error(`  WARNING: Narration concat failed: ${e.message?.slice(-200)}`);
      }
    }
  }

  // SFX track
  const sfxPath = path.join(AUDIO_DIR, `${slug}_sfx.wav`);
  const sfxEvents = buildSFXEvents(timeline);
  buildSFXTrack(sfxEvents, totalDurationS, sfxPath);
  console.log(`  SFX: ${sfxEvents.length} event(s)`);

  // Master audio mix
  const masterAudioPath = path.join(AUDIO_DIR, `${slug}_master.wav`);
  const ambientPath = path.join(ASSETS_DIR, 'ambient-drone-01.wav');
  let hasMasterAudio = false;

  if (hasNarrationTrack && existsSync(ambientPath)) {
    const narSfxPath = path.join(AUDIO_DIR, `${slug}_nar_sfx.wav`);
    try {
      execSync(
        `ffmpeg -y -i "${combinedNarrationPath}" -i "${sfxPath}" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=3" -ar ${AUDIO.SAMPLE_RATE} "${narSfxPath}"`,
        { stdio: 'pipe', timeout: 60_000 }
      );
      const musicMixed = mixWithMusic(narSfxPath, ambientPath, masterAudioPath, totalDurationS);
      if (!musicMixed) {
        execSync(`cp "${narSfxPath}" "${masterAudioPath}"`);
        console.log('  Master audio: narration + SFX (music ducking failed)');
      } else {
        console.log('  Master audio: narration + SFX + ambient (ducked)');
      }
      hasMasterAudio = true;
    } catch (e) {
      execSync(`cp "${combinedNarrationPath}" "${masterAudioPath}"`);
      hasMasterAudio = true;
      console.log('  Master audio: narration only (mix failed)');
    }
  } else if (hasNarrationTrack) {
    execSync(`cp "${combinedNarrationPath}" "${masterAudioPath}"`);
    hasMasterAudio = true;
    console.log('  Master audio: narration only (no ambient bed)');
  } else {
    console.log('  No narration audio — video will be silent');
  }

  // Final loudness normalization on master
  if (hasMasterAudio && existsSync(masterAudioPath)) {
    const normalizedMaster = path.join(AUDIO_DIR, `${slug}_master_norm.wav`);
    if (normalizeLoudness(masterAudioPath, normalizedMaster)) {
      execSync(`mv "${normalizedMaster}" "${masterAudioPath}"`);
      console.log('  Master normalized to -14 LUFS');
    }
  }

  // Remotion render
  console.log('  Rendering video via Remotion...');
  const silentPath = path.join(VIDEO_DIR, `${slug}_silent.mp4`);
  const renderOk = renderVideo('LessonVideo', silentPath, config);

  if (!renderOk) {
    console.error('  ERROR: Remotion render failed. Aborting.');
    return null;
  }
  console.log(`  Silent video rendered (${totalFrames} frames)`);

  // Merge video + audio
  const composedPath = path.join(VIDEO_DIR, `${slug}.mp4`);

  if (hasMasterAudio && existsSync(masterAudioPath)) {
    const merged = mergeVideoAudio(silentPath, masterAudioPath, composedPath);
    if (!merged) {
      execSync(`cp "${silentPath}" "${composedPath}"`);
      console.log('  WARNING: Audio merge failed, using silent video');
    } else {
      console.log('  Video + audio merged');
    }
  } else {
    execSync(`cp "${silentPath}" "${composedPath}"`);
    console.log('  Silent video (no audio to merge)');
  }

  // ──────────────────────────────────────────────────
  // PHASE 3: CINEMA GRADE
  // ──────────────────────────────────────────────────
  console.log('\n--- Phase 3: Cinema Grade ---');

  let gradeResult = { success: false, error: 'skipped' };

  if (opts.skipGrade) {
    console.log('  [SKIP] Cinema grade skipped by flag.');
  } else {
    gradeResult = await cinemaGrade(composedPath, {
      theme: config.colorTheme,
      replaceOriginal: true,
      grain: true,
      vignette: true,
      lessonKey: slug,
    });

    if (gradeResult.success) {
      console.log(`  Graded with ${gradeResult.lutUsed} LUT (${(gradeResult.duration / 1000).toFixed(1)}s)`);
    } else {
      console.log(`  WARNING: Cinema grade failed: ${gradeResult.error}`);
    }
  }

  // ──────────────────────────────────────────────────
  // PHASE 4: QC (Quality Assurance)
  // ──────────────────────────────────────────────────
  console.log('\n--- Phase 4: QC (Quality Assurance) ---');

  let qcReport = { pass: false, score: 0, checks: [], summary: 'skipped' };

  if (opts.skipQC) {
    console.log('  [SKIP] QC skipped by flag.');
  } else if (!existsSync(composedPath)) {
    console.log('  ERROR: Output file missing, cannot QC.');
  } else {
    qcReport = runQAGate(composedPath, { targetDurationS: totalDurationS });

    // Write to brain_context if available
    await writeToBrain(slug, qcReport).catch(() => {});
  }

  // ──────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────
  const elapsedS = ((Date.now() - pipelineStart) / 1000).toFixed(1);
  let fileSize = '?';
  try {
    fileSize = execSync(`ls -lh "${composedPath}"`, { encoding: 'utf-8' }).trim().split(/\s+/)[4];
  } catch { /* ignore */ }

  console.log('\n' + '='.repeat(60));
  console.log(`${qcReport.pass ? 'PASS' : 'DONE'}: ${composedPath}`);
  console.log(`  Duration: ${totalDurationS.toFixed(1)}s | Size: ${fileSize} | Pipeline: ${elapsedS}s`);
  console.log(`  TTS: ${ttsSkipped ? 'skipped' : `${audioResults.length} segments`}`);
  console.log(`  Grade: ${gradeResult.success ? gradeResult.lutUsed : gradeResult.error || 'skipped'}`);
  console.log(`  QC: ${qcReport.summary}`);
  if (qcReport.checks?.filter(c => !c.pass).length > 0) {
    const failures = qcReport.checks.filter(c => !c.pass);
    console.log(`  Issues (${failures.length}):`);
    for (const f of failures) {
      console.log(`    - ${f.name}: ${f.detail || f.actual}`);
    }
  }
  console.log('='.repeat(60));

  return {
    path: composedPath,
    duration: totalDurationS,
    qc: qcReport,
    grade: gradeResult,
    slug,
    elapsedS: parseFloat(elapsedS),
  };
}

// ══════════════════════════════════════════════════════
// CLI
// ══════════════════════════════════════════════════════

async function cli() {
  const args = process.argv.slice(2);
  const configPath = args.find(a => !a.startsWith('--'));

  if (!configPath) {
    console.log(`Like One Studio — Master Pipeline

Usage:
  node studio/pipeline.js <screenplay-config.json> [options]

Options:
  --skip-tts     Skip TTS generation (compose with silence)
  --skip-grade   Skip cinema grading
  --skip-qc      Skip QA gate

Examples:
  node studio/pipeline.js content/configs/what-is-a-neuron-v3.json
  node studio/pipeline.js content/configs/test-pipeline.json --skip-tts

Pipeline phases:
  Phase 1: TTS      — Fish S2-Pro on localhost:8180
  Phase 2: Compose   — Remotion render + audio merge
  Phase 3: Grade     — Cinema LUT + grain + vignette
  Phase 4: QC        — Broadcast-standard quality checks
`);
    process.exit(1);
  }

  const resolved = path.resolve(configPath);
  if (!existsSync(resolved)) {
    console.error(`ERROR: Config not found: ${resolved}`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(readFileSync(resolved, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Invalid JSON: ${e.message}`);
    process.exit(1);
  }

  const opts = {
    skipTTS: args.includes('--skip-tts'),
    skipGrade: args.includes('--skip-grade'),
    skipQC: args.includes('--skip-qc'),
  };

  const result = await runPipeline(config, opts);

  if (!result) {
    console.error('\nPipeline failed.');
    process.exit(1);
  }

  process.exit(result.qc?.pass === false ? 1 : 0);
}

// Run CLI if executed directly
const isMain = process.argv[1] && (
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
);

if (isMain) {
  cli().catch(e => {
    console.error(`Fatal: ${e.message}`);
    process.exit(2);
  });
}
