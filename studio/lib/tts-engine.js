#!/usr/bin/env node
/**
 * Like One Studio — TTS Engine
 * Auto-generates narration audio from a screenplay JSON config.
 *
 * Extracts narration text from each section, calls S2-Pro server
 * (localhost:8180) to generate speech, concatenates with pacing gaps,
 * and outputs a single narration WAV file.
 *
 * Module usage:
 *   import { generateTTS } from './studio/lib/tts-engine.js';
 *   const result = await generateTTS('content/configs/some-config.json');
 *
 * CLI usage:
 *   node studio/lib/tts-engine.js content/configs/some-config.json
 *   node studio/lib/tts-engine.js content/configs/some-config.json --output output/audio/custom.wav
 *   node studio/lib/tts-engine.js content/configs/some-config.json --engine edge
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { PACING, calculateGapS, measureWPM } from './pacing-engine.js';
import { processTTS, normalizeLoudness, correctWPM, WPM_TARGETS, AUDIO } from './audio-engine.js';

const STUDIO_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');

const S2PRO_URL = process.env.S2PRO_URL || 'http://127.0.0.1:8180';

// ── S2-Pro TTS Generation ──

/**
 * Check if the S2-Pro server is healthy.
 * @returns {Promise<boolean>}
 */
async function checkS2ProHealth() {
  try {
    const health = await fetch(`${S2PRO_URL}/v1/health`);
    return health.ok;
  } catch {
    return false;
  }
}

/**
 * Generate speech for a single text segment via S2-Pro.
 * @param {string} text - Narration text
 * @param {string} outputPath - WAV output path
 * @param {object} [opts] - Options
 * @param {string} [opts.refAudio] - Reference audio path for voice cloning
 * @param {string} [opts.refText] - Reference transcript
 * @param {number} [opts.temperature] - Generation temperature (default 0.5)
 * @param {number} [opts.seed] - RNG seed (default 42)
 * @returns {Promise<{path: string, duration_s: number, wpm: number}|null>}
 */
async function synthesizeSegment(text, outputPath, opts = {}) {
  const { refAudio, refText, temperature = 0.5, seed = 42 } = opts;

  // Build references array (voice cloning)
  const references = [];
  if (refAudio && existsSync(refAudio)) {
    const audioBytes = readFileSync(refAudio);
    references.push({
      audio: Array.from(audioBytes),
      text: refText || '',
    });
  }

  const t0 = Date.now();
  const resp = await fetch(`${S2PRO_URL}/v1/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(300000),
    body: JSON.stringify({
      text,
      references,
      max_new_tokens: 4096,
      chunk_length: 150,
      top_p: 0.6,
      repetition_penalty: 1.2,
      temperature,
      format: 'wav',
      seed,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`S2 Pro TTS failed (${resp.status}): ${err.slice(-200)}`);
  }

  const audioBuffer = Buffer.from(await resp.arrayBuffer());

  // Ensure output dir
  const outDir = path.dirname(outputPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outputPath, audioBuffer);

  // Get duration via ffprobe
  const probe = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${outputPath}"`,
    { encoding: 'utf-8' }
  ).trim();
  const duration_s = parseFloat(probe) || 0;
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const words = text.split(/\s+/).length;
  const wpm = Math.round((words / duration_s) * 60);

  return { path: outputPath, duration_s, wpm, elapsed: parseFloat(elapsed) };
}

/**
 * Edge TTS fallback — generates speech via edge-tts Python package.
 * @param {string} text - Narration text
 * @param {string} outputPath - WAV output path
 * @param {string} [voice] - Voice key
 * @returns {Promise<{path: string, duration_s: number, wpm: number}|null>}
 */
async function synthesizeEdge(text, outputPath, voice = 'sophia') {
  const VOICE_MAP = {
    sophia: 'en-US-AvaNeural',
    warm: 'en-US-AvaNeural',
    default: 'en-US-AriaNeural',
    male: 'en-US-AndrewNeural',
    guy: 'en-US-BrianNeural',
  };

  const edgeVoice = VOICE_MAP[voice] || VOICE_MAP[voice?.replace('s2pro-', '')] || VOICE_MAP.sophia;
  const mp3Path = outputPath.replace(/\.wav$/, '_edge.mp3');
  const textFile = outputPath.replace(/\.wav$/, '_text.txt');

  // Write text to temp file to avoid shell injection
  writeFileSync(textFile, text, 'utf-8');

  const outDir = path.dirname(outputPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const t0 = Date.now();
  execSync(
    `python3 -m edge_tts --voice "${edgeVoice}" -f "${textFile}" --write-media "${mp3Path}"`,
    { encoding: 'utf-8', timeout: 60000 }
  );

  // Convert mp3 -> wav at 48kHz stereo
  execSync(
    `ffmpeg -y -i "${mp3Path}" -ar ${AUDIO.SAMPLE_RATE} -ac 2 "${outputPath}"`,
    { stdio: 'pipe', timeout: 30000 }
  );

  const probe = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${outputPath}"`,
    { encoding: 'utf-8' }
  ).trim();
  const duration_s = parseFloat(probe) || 0;
  const words = text.split(/\s+/).length;
  const wpm = Math.round((words / duration_s) * 60);

  return { path: outputPath, duration_s, wpm, elapsed: parseFloat(((Date.now() - t0) / 1000).toFixed(1)) };
}

// ── Main Pipeline ──

/**
 * Generate TTS narration from a screenplay config.
 *
 * Reads the config JSON, extracts narration sections, generates speech
 * for each via S2-Pro (with Edge TTS fallback), post-processes each
 * segment, then concatenates everything with pacing gaps into a single
 * narration WAV file.
 *
 * @param {string} configPath - Path to the screenplay JSON config
 * @param {object} [opts] - Options
 * @param {string} [opts.output] - Custom output path for final WAV
 * @param {string} [opts.engine] - TTS engine: 's2pro' (default) or 'edge'
 * @param {string} [opts.refAudio] - Reference voice audio for cloning
 * @param {string} [opts.refText] - Reference voice transcript
 * @returns {Promise<{
 *   outputPath: string,
 *   totalDuration_s: number,
 *   segments: Array<{index: number, duration_s: number, wpm: number, text: string}>,
 *   config: object
 * }>}
 */
export async function generateTTS(configPath, opts = {}) {
  const resolvedPath = path.resolve(configPath);
  if (!existsSync(resolvedPath)) {
    throw new Error(`Config not found: ${resolvedPath}`);
  }

  const config = JSON.parse(readFileSync(resolvedPath, 'utf-8'));
  const sections = config.sections || [];
  const slug = config.slug || config.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'lesson';
  const engine = opts.engine || process.env.TTS_ENGINE || 's2pro';

  // Ensure output dirs
  [OUTPUT_DIR, AUDIO_DIR].forEach(d => {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  });

  console.log(`\n🎙️ TTS Engine — ${config.title || slug}`);
  console.log('─'.repeat(50));

  // Extract narration sections
  const narrationEntries = [];
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].type === 'narration' && sections[i].text) {
      narrationEntries.push({ index: i, section: sections[i] });
    }
  }

  if (narrationEntries.length === 0) {
    throw new Error('No narration sections found in config');
  }

  console.log(`  📝 ${narrationEntries.length} narration segments, ${sections.length} total sections`);

  // Check S2-Pro availability
  let useS2Pro = engine !== 'edge';
  if (useS2Pro) {
    const healthy = await checkS2ProHealth();
    if (!healthy) {
      console.log('  ⚠️  S2 Pro server not running — falling back to Edge TTS');
      console.log('      Start it with: bash studio/tts/start-s2pro.sh');
      useS2Pro = false;
    } else {
      console.log('  ✅ S2 Pro server connected');
    }
  }

  // ── Phase 1: Generate raw audio for each narration segment ──
  console.log(`\n  Phase 1: Generating speech (${useS2Pro ? 'S2-Pro' : 'Edge TTS'})...`);
  const segmentResults = [];

  for (const entry of narrationEntries) {
    const { index, section } = entry;
    const segName = `${slug}_s${String(index).padStart(2, '0')}`;
    const rawPath = path.join(AUDIO_DIR, `${segName}_raw.wav`);

    console.log(`  🔊 Segment ${index}: ${section.text.length} chars, "${section.text.slice(0, 50)}..."`);

    let result = null;
    try {
      if (useS2Pro) {
        result = await synthesizeSegment(section.text, rawPath, {
          refAudio: opts.refAudio,
          refText: opts.refText,
        });
      }
    } catch (e) {
      console.log(`  ⚠️  S2 Pro failed for segment ${index}: ${e.message.slice(-100)}`);
    }

    if (!result) {
      try {
        result = await synthesizeEdge(section.text, rawPath, section.voice);
      } catch (e) {
        console.error(`  ❌ Edge TTS also failed for segment ${index}: ${e.message.slice(-100)}`);
        continue;
      }
    }

    const wpmOk = result.wpm >= 130 && result.wpm <= 165;
    console.log(`     ${wpmOk ? '✅' : '⚠️ '} ${result.duration_s.toFixed(1)}s | ${result.wpm} WPM | ${result.elapsed}s gen time`);

    segmentResults.push({
      index,
      section,
      rawPath: result.path,
      duration_s: result.duration_s,
      wpm: result.wpm,
    });
  }

  if (segmentResults.length === 0) {
    throw new Error('All TTS generation failed — no audio produced');
  }

  // ── Phase 2: Post-process each segment ──
  console.log(`\n  Phase 2: Post-processing ${segmentResults.length} segments...`);

  for (const seg of segmentResults) {
    const baseName = path.basename(seg.rawPath, '.wav');

    // Stage A: 6-stage TTS chain (high-pass, de-ess, compress, EQ, gate, limiter)
    const processedPath = path.join(AUDIO_DIR, `${baseName}_proc.wav`);
    const processed = processTTS(seg.rawPath, processedPath);
    let currentPath = processed ? processedPath : seg.rawPath;

    // Stage B: WPM auto-correction if outside 130-165 range
    if (seg.wpm < 130 || seg.wpm > 165) {
      const pace = seg.section.pace;
      const targetWPM = pace === 'hook' ? WPM_TARGETS.hook
        : pace === 'concept' ? WPM_TARGETS.concept
        : pace === 'recap' ? WPM_TARGETS.recap
        : WPM_TARGETS.standard;

      const correctedPath = path.join(AUDIO_DIR, `${baseName}_wpm.wav`);
      const correction = correctWPM(currentPath, correctedPath, seg.wpm, targetWPM);
      if (correction.success) {
        currentPath = correctedPath;
        seg.duration_s = correction.newDuration;
        console.log(`     🎯 Segment ${seg.index}: ${seg.wpm} -> ${targetWPM} WPM (atempo=${correction.atempo.toFixed(3)})`);
      }
    }

    // Stage C: Loudness normalization to -14 LUFS
    const normalizedPath = path.join(AUDIO_DIR, `${baseName}_norm.wav`);
    const normalized = normalizeLoudness(currentPath, normalizedPath);
    seg.processedPath = normalized ? normalizedPath : currentPath;

    console.log(`     ✅ Segment ${seg.index}: processed + normalized`);
  }

  // ── Phase 3: Concatenate with pacing gaps ──
  console.log(`\n  Phase 3: Assembling narration track with pacing gaps...`);

  const finalOutputPath = opts.output
    ? path.resolve(opts.output)
    : path.join(AUDIO_DIR, `${slug}_narration.wav`);

  // Ensure output directory
  const finalDir = path.dirname(finalOutputPath);
  if (!existsSync(finalDir)) mkdirSync(finalDir, { recursive: true });

  // Build ffmpeg concat command with silence gaps between segments
  const audioInputs = [];
  const filterParts = [];
  let inputIndex = 0;

  // Insert silence for any non-narration sections before the first narration
  // Then interleave narration segments with appropriate breathing gaps

  for (let si = 0; si < segmentResults.length; si++) {
    const seg = segmentResults[si];

    // Add the narration audio
    audioInputs.push(`-i "${seg.processedPath}"`);
    filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
    inputIndex++;

    // Calculate gap to next segment using pacing engine
    if (si < segmentResults.length - 1) {
      const nextSeg = segmentResults[si + 1];

      // Determine gap: use pacing engine based on section types between current and next narration
      let gapS = calculateGapS(seg.section, nextSeg.section);

      // If there are non-narration sections between narrations, add extra time
      const sectionsBetween = nextSeg.index - seg.index - 1;
      if (sectionsBetween > 0) {
        // Each intervening visual section gets a pause
        gapS += sectionsBetween * PACING.PAUSE_SECTION_MS / 1000;
      }

      // Clamp gap to reasonable range
      gapS = Math.max(0.3, Math.min(gapS, PACING.PAUSE_CHAPTER_MS / 1000));

      // Generate silence for the gap
      audioInputs.push(`-f lavfi -t ${gapS.toFixed(3)} -i anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=mono`);
      filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=${AUDIO.SAMPLE_RATE}:channel_layouts=mono[s${inputIndex}]`);
      inputIndex++;
    }
  }

  // Build concat filter
  const concatInputs = Array.from({ length: inputIndex }, (_, i) => `[s${i}]`).join('');
  filterParts.push(`${concatInputs}concat=n=${inputIndex}:v=0:a=1[out]`);

  const concatCmd = `ffmpeg -y ${audioInputs.join(' ')} -filter_complex "${filterParts.join(';')}" -map "[out]" -ar ${AUDIO.SAMPLE_RATE} "${finalOutputPath}"`;

  try {
    execSync(concatCmd, { stdio: 'pipe', timeout: 120000 });
  } catch (e) {
    throw new Error(`Narration concat failed: ${e.message?.slice(-200)}`);
  }

  // Get final duration
  const finalProbe = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${finalOutputPath}"`,
    { encoding: 'utf-8' }
  ).trim();
  const totalDuration_s = parseFloat(finalProbe) || 0;

  // Update config sections with audio durations
  for (const seg of segmentResults) {
    sections[seg.index].audioDuration = seg.duration_s;
    sections[seg.index].durationS = seg.duration_s;
  }

  // Summary
  const totalWords = segmentResults.reduce((sum, s) => sum + s.section.text.split(/\s+/).length, 0);
  const avgWPM = Math.round(segmentResults.reduce((sum, s) => sum + s.wpm, 0) / segmentResults.length);

  console.log(`\n  ✅ Narration track complete`);
  console.log(`     📁 ${finalOutputPath}`);
  console.log(`     ⏱️  ${totalDuration_s.toFixed(1)}s total | ${totalWords} words | ~${avgWPM} avg WPM`);
  console.log(`     🎙️  ${segmentResults.length} segments with breathing gaps`);

  return {
    outputPath: finalOutputPath,
    totalDuration_s,
    segments: segmentResults.map(s => ({
      index: s.index,
      duration_s: s.duration_s,
      wpm: s.wpm,
      text: s.section.text,
    })),
    config,
  };
}

// ── CLI ──

const cliConfigPath = process.argv[2];

if (cliConfigPath && !cliConfigPath.startsWith('-')) {
  // Parse optional flags
  const args = process.argv.slice(3);
  function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : null;
  }

  const cliOpts = {
    output: getArg('output'),
    engine: getArg('engine'),
    refAudio: getArg('ref-audio'),
    refText: getArg('ref-text'),
  };

  generateTTS(cliConfigPath, cliOpts).catch(e => {
    console.error(`\n❌ Fatal: ${e.message}`);
    process.exit(1);
  });
} else if (process.argv[1] && process.argv[1].includes('tts-engine')) {
  console.log('Usage: node studio/lib/tts-engine.js <config.json> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --output <path>      Custom output WAV path');
  console.log('  --engine <s2pro|edge> TTS engine (default: s2pro)');
  console.log('  --ref-audio <path>   Reference voice audio for cloning');
  console.log('  --ref-text <text>    Reference voice transcript');
  console.log('');
  console.log('Example:');
  console.log('  node studio/lib/tts-engine.js content/configs/ai-without-jargon.json');
}
