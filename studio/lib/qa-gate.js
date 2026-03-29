#!/usr/bin/env node
/**
 * Like One Studio — QA Gate
 * Automated quality assurance for rendered lesson videos.
 *
 * Checks every rendered file against studio broadcast standards:
 *   Audio:  stereo (2ch), 48 kHz, LUFS between -16 and -14
 *   Video:  1920x1080, 30 fps, duration within target
 *   File:   exists, size > minimum, MP4 container
 *
 * Uses ffprobe for metadata extraction, returns structured pass/fail.
 * Writes results to brain_context studio.quality_scores.
 *
 * Usage:
 *   node studio/lib/qa-gate.js --file output/lesson-00.mp4 --lesson "00_convergence"
 */
import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import path from 'path';

// ── Quality Standards ──
// Derived from audio-engine.js constants + brain_context studio.quality_scores
export const QA_STANDARDS = {
  audio: {
    channels: 2,             // Stereo
    sampleRate: 48000,       // 48 kHz (broadcast standard)
    lufsMin: -16,            // LUFS floor
    lufsMax: -14,            // LUFS ceiling (YouTube optimal)
    truePeakMax: -1,         // dBTP — headroom for lossy encoding
  },
  video: {
    width: 1920,
    height: 1080,
    fps: 30,
    minDurationS: 10,        // Minimum viable lesson
    maxDurationS: 420,       // 7 min hard ceiling (6 min sweet spot + buffer)
  },
  file: {
    minSizeBytes: 500_000,   // 500 KB — anything smaller is corrupt
    container: 'mp4',
  },
};

// ── Supabase Config ──
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tnsujchfrixxsdpodygu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ── ffprobe helpers ──

/**
 * Run ffprobe and return parsed JSON output.
 * @param {string} filePath
 * @param {string} args - Additional ffprobe arguments
 * @returns {object|null}
 */
function ffprobeJSON(filePath, args = '') {
  try {
    const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams ${args} "${filePath}"`;
    const raw = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
    return JSON.parse(raw);
  } catch (e) {
    console.error(`  ffprobe failed: ${e.message?.slice(-200)}`);
    return null;
  }
}

/**
 * Measure integrated loudness via EBU R128.
 * @param {string} filePath
 * @returns {{ lufs: number|null, truePeak: number|null, lra: number|null }}
 */
function measureLoudness(filePath) {
  try {
    // ebur128 writes to stderr; capture it
    const cmd = `ffmpeg -i "${filePath}" -af "ebur128=peak=true" -f null /dev/null 2>&1`;
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 60000, shell: true });

    // Parse the summary block (last occurrence)
    const lufsMatch = output.match(/I:\s+(-[\d.]+)\s+LUFS/g);
    const tpMatch = output.match(/Peak:\s+(-[\d.]+)\s+dBFS/g);
    const lraMatch = output.match(/LRA:\s+([\d.]+)\s+LU/g);

    // Take last match (the summary, not per-frame)
    const lufsStr = lufsMatch ? lufsMatch[lufsMatch.length - 1] : null;
    const tpStr = tpMatch ? tpMatch[tpMatch.length - 1] : null;
    const lraStr = lraMatch ? lraMatch[lraMatch.length - 1] : null;

    return {
      lufs: lufsStr ? parseFloat(lufsStr.match(/-[\d.]+/)[0]) : null,
      truePeak: tpStr ? parseFloat(tpStr.match(/-[\d.]+/)[0]) : null,
      lra: lraStr ? parseFloat(lraStr.match(/[\d.]+/)[0]) : null,
    };
  } catch (e) {
    console.error(`  Loudness measurement failed: ${e.message?.slice(-200)}`);
    return { lufs: null, truePeak: null, lra: null };
  }
}

// ── Individual Check Functions ──

/**
 * Check file-level properties.
 */
function checkFile(filePath) {
  const checks = [];
  const s = QA_STANDARDS.file;

  // Existence
  if (!existsSync(filePath)) {
    checks.push({ name: 'file.exists', pass: false, expected: true, actual: false, detail: 'File not found' });
    return checks; // No point continuing
  }
  checks.push({ name: 'file.exists', pass: true, expected: true, actual: true });

  // Size
  const stat = statSync(filePath);
  const sizeOk = stat.size >= s.minSizeBytes;
  const sizeMB = (stat.size / 1_000_000).toFixed(2);
  checks.push({
    name: 'file.size',
    pass: sizeOk,
    expected: `>= ${(s.minSizeBytes / 1_000_000).toFixed(1)} MB`,
    actual: `${sizeMB} MB`,
    detail: sizeOk ? null : `File too small (${sizeMB} MB) — likely corrupt`,
  });

  // Container format
  const ext = path.extname(filePath).replace('.', '').toLowerCase();
  const containerOk = ext === s.container;
  checks.push({
    name: 'file.container',
    pass: containerOk,
    expected: s.container,
    actual: ext,
    detail: containerOk ? null : `Expected .${s.container}, got .${ext}`,
  });

  return checks;
}

/**
 * Check video stream properties.
 */
function checkVideo(probe) {
  const checks = [];
  const s = QA_STANDARDS.video;

  const videoStream = (probe.streams || []).find(st => st.codec_type === 'video');
  if (!videoStream) {
    checks.push({ name: 'video.stream', pass: false, expected: 'present', actual: 'missing', detail: 'No video stream found' });
    return checks;
  }
  checks.push({ name: 'video.stream', pass: true, expected: 'present', actual: 'present' });

  // Resolution
  const w = videoStream.width;
  const h = videoStream.height;
  const resOk = w === s.width && h === s.height;
  checks.push({
    name: 'video.resolution',
    pass: resOk,
    expected: `${s.width}x${s.height}`,
    actual: `${w}x${h}`,
    detail: resOk ? null : `Resolution mismatch`,
  });

  // Frame rate — parse fractional fps like "30/1" or "30000/1001"
  let fpsActual = 0;
  const fpsStr = videoStream.r_frame_rate || videoStream.avg_frame_rate || '';
  if (fpsStr.includes('/')) {
    const [num, den] = fpsStr.split('/').map(Number);
    fpsActual = den ? num / den : 0;
  } else {
    fpsActual = parseFloat(fpsStr) || 0;
  }
  const fpsOk = Math.abs(fpsActual - s.fps) < 1; // Allow 29.97 ≈ 30
  checks.push({
    name: 'video.fps',
    pass: fpsOk,
    expected: s.fps,
    actual: parseFloat(fpsActual.toFixed(2)),
    detail: fpsOk ? null : `Frame rate ${fpsActual.toFixed(2)} outside tolerance of ${s.fps}`,
  });

  // Duration
  const duration = parseFloat(probe.format?.duration || videoStream.duration || '0');
  const durMinOk = duration >= s.minDurationS;
  const durMaxOk = duration <= s.maxDurationS;
  checks.push({
    name: 'video.duration_min',
    pass: durMinOk,
    expected: `>= ${s.minDurationS}s`,
    actual: `${duration.toFixed(1)}s`,
    detail: durMinOk ? null : `Too short (${duration.toFixed(1)}s < ${s.minDurationS}s)`,
  });
  checks.push({
    name: 'video.duration_max',
    pass: durMaxOk,
    expected: `<= ${s.maxDurationS}s`,
    actual: `${duration.toFixed(1)}s`,
    detail: durMaxOk ? null : `Too long (${duration.toFixed(1)}s > ${s.maxDurationS}s)`,
  });

  return checks;
}

/**
 * Check audio stream properties + loudness.
 */
function checkAudio(probe, filePath) {
  const checks = [];
  const s = QA_STANDARDS.audio;

  const audioStream = (probe.streams || []).find(st => st.codec_type === 'audio');
  if (!audioStream) {
    checks.push({ name: 'audio.stream', pass: false, expected: 'present', actual: 'missing', detail: 'No audio stream found' });
    return checks;
  }
  checks.push({ name: 'audio.stream', pass: true, expected: 'present', actual: 'present' });

  // Channels
  const ch = audioStream.channels || 0;
  const chOk = ch === s.channels;
  checks.push({
    name: 'audio.channels',
    pass: chOk,
    expected: `${s.channels} (stereo)`,
    actual: ch,
    detail: chOk ? null : `Expected ${s.channels}ch stereo, got ${ch}ch`,
  });

  // Sample rate
  const sr = parseInt(audioStream.sample_rate, 10) || 0;
  const srOk = sr === s.sampleRate;
  checks.push({
    name: 'audio.sample_rate',
    pass: srOk,
    expected: `${s.sampleRate} Hz`,
    actual: `${sr} Hz`,
    detail: srOk ? null : `Expected ${s.sampleRate} Hz, got ${sr} Hz`,
  });

  // Loudness (requires full decode — measured separately)
  const loudness = measureLoudness(filePath);

  if (loudness.lufs !== null) {
    const lufsOk = loudness.lufs >= s.lufsMin && loudness.lufs <= s.lufsMax;
    checks.push({
      name: 'audio.lufs',
      pass: lufsOk,
      expected: `${s.lufsMin} to ${s.lufsMax} LUFS`,
      actual: `${loudness.lufs.toFixed(1)} LUFS`,
      detail: lufsOk ? null : `Loudness ${loudness.lufs.toFixed(1)} outside ${s.lufsMin}..${s.lufsMax} range`,
    });
  } else {
    checks.push({
      name: 'audio.lufs',
      pass: false,
      expected: `${s.lufsMin} to ${s.lufsMax} LUFS`,
      actual: 'unmeasurable',
      detail: 'Could not measure loudness — audio may be corrupt',
    });
  }

  if (loudness.truePeak !== null) {
    const tpOk = loudness.truePeak <= s.truePeakMax;
    checks.push({
      name: 'audio.true_peak',
      pass: tpOk,
      expected: `<= ${s.truePeakMax} dBTP`,
      actual: `${loudness.truePeak.toFixed(1)} dBTP`,
      detail: tpOk ? null : `True peak ${loudness.truePeak.toFixed(1)} exceeds ${s.truePeakMax} dBTP`,
    });
  }

  // Attach raw loudness values for report
  checks._loudness = loudness;

  return checks;
}

// ── Main QA Gate ──

/**
 * Run the full QA gate on a single video file.
 * @param {string} filePath - Path to the rendered video
 * @param {object} [opts] - Optional overrides
 * @param {number} [opts.targetDurationS] - Expected duration (from pacing engine)
 * @returns {{ pass: boolean, score: number, checks: object[], summary: string, metadata: object }}
 */
export function runQAGate(filePath, opts = {}) {
  const startTime = Date.now();
  const allChecks = [];

  console.log(`\n  QA Gate: ${path.basename(filePath)}`);
  console.log('  ' + '-'.repeat(50));

  // Phase 1: File checks
  const fileChecks = checkFile(filePath);
  allChecks.push(...fileChecks);
  if (!fileChecks[0]?.pass) {
    // File doesn't exist — can't continue
    return buildReport(allChecks, filePath, startTime);
  }

  // Phase 2: Probe metadata
  const probe = ffprobeJSON(filePath);
  if (!probe) {
    allChecks.push({ name: 'probe', pass: false, expected: 'valid', actual: 'failed', detail: 'ffprobe could not read file' });
    return buildReport(allChecks, filePath, startTime);
  }

  // Phase 3: Video checks
  const videoChecks = checkVideo(probe);
  allChecks.push(...videoChecks);

  // Phase 4: Audio checks (includes loudness measurement)
  const audioChecks = checkAudio(probe, filePath);
  const loudness = audioChecks._loudness || {};
  delete audioChecks._loudness;
  allChecks.push(...audioChecks);

  // Phase 5: Optional duration target check
  if (opts.targetDurationS) {
    const duration = parseFloat(probe.format?.duration || '0');
    const drift = Math.abs(duration - opts.targetDurationS);
    const driftPct = (drift / opts.targetDurationS) * 100;
    const driftOk = driftPct <= 15; // Within 15% of target
    allChecks.push({
      name: 'video.duration_target',
      pass: driftOk,
      expected: `${opts.targetDurationS.toFixed(1)}s (+-15%)`,
      actual: `${duration.toFixed(1)}s (${driftPct.toFixed(1)}% drift)`,
      detail: driftOk ? null : `Duration drifted ${driftPct.toFixed(1)}% from target`,
    });
  }

  // Build metadata for brain_context
  const videoStream = (probe.streams || []).find(st => st.codec_type === 'video');
  const audioStream = (probe.streams || []).find(st => st.codec_type === 'audio');
  const duration = parseFloat(probe.format?.duration || '0');

  const metadata = {
    video_resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : null,
    video_fps: videoStream ? parseFloat((videoStream.r_frame_rate || '0').split('/').reduce((a, b) => a / b)) || null : null,
    video_duration_s: parseFloat(duration.toFixed(1)),
    video_codec: videoStream?.codec_name || null,
    audio_channels: audioStream?.channels || null,
    audio_sample_rate: parseInt(audioStream?.sample_rate, 10) || null,
    audio_codec: audioStream?.codec_name || null,
    audio_loudness_lufs: loudness.lufs !== null ? parseFloat(loudness.lufs.toFixed(1)) : null,
    audio_true_peak_dbtp: loudness.truePeak !== null ? parseFloat(loudness.truePeak.toFixed(1)) : null,
    audio_lra_lu: loudness.lra !== null ? parseFloat(loudness.lra.toFixed(1)) : null,
    file_size_mb: parseFloat((statSync(filePath).size / 1_000_000).toFixed(2)),
  };

  return buildReport(allChecks, filePath, startTime, metadata);
}

/**
 * Build the final QA report from collected checks.
 */
function buildReport(checks, filePath, startTime, metadata = {}) {
  const passed = checks.filter(c => c.pass).length;
  const failed = checks.filter(c => !c.pass).length;
  const total = checks.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  const pass = failed === 0;
  const elapsedMs = Date.now() - startTime;

  // Print results
  for (const c of checks) {
    const icon = c.pass ? 'PASS' : 'FAIL';
    const marker = c.pass ? '  [PASS]' : '  [FAIL]';
    console.log(`${marker} ${c.name}: ${c.actual}${c.detail ? ` — ${c.detail}` : ''}`);
  }

  const summary = `${pass ? 'PASSED' : 'FAILED'} ${passed}/${total} checks (score: ${score}%) in ${(elapsedMs / 1000).toFixed(1)}s`;
  console.log(`  ${'─'.repeat(50)}`);
  console.log(`  ${pass ? 'PASS' : 'FAIL'}: ${summary}`);

  return {
    pass,
    score,
    checks,
    summary,
    metadata,
    file: filePath,
    timestamp: new Date().toISOString(),
    elapsedMs,
  };
}

// ── brain_context Writer ──

/**
 * Write QA results to brain_context studio.quality_scores for a lesson.
 * @param {string} lessonKey - e.g. "00_convergence"
 * @param {object} report - QA gate report
 */
export async function writeToBrain(lessonKey, report) {
  if (!SUPABASE_KEY) {
    console.log('  [SKIP] No SUPABASE_KEY — brain write skipped');
    return false;
  }

  try {
    // Fetch current quality_scores
    const fetchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.studio.quality_scores&select=value`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!fetchRes.ok) throw new Error(`Fetch failed: HTTP ${fetchRes.status}`);
    const rows = await fetchRes.json();

    const current = rows[0]?.value || { lessons: {}, metrics_template: {} };

    // Update the lesson entry
    current.lessons[lessonKey] = {
      overall_score: report.score,
      qa_pass: report.pass,
      video_resolution: report.metadata.video_resolution,
      video_duration_s: report.metadata.video_duration_s,
      video_fps: report.metadata.video_fps,
      audio_channels: report.metadata.audio_channels,
      audio_sample_rate: report.metadata.audio_sample_rate,
      audio_loudness_lufs: report.metadata.audio_loudness_lufs,
      audio_true_peak_dbtp: report.metadata.audio_true_peak_dbtp,
      file_size_mb: report.metadata.file_size_mb,
      cinema_grade_applied: current.lessons[lessonKey]?.cinema_grade_applied || null,
      checked_at: report.timestamp,
      notes: `QA-gate auto: ${report.summary}`,
    };

    // Patch back
    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.studio.quality_scores`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ value: current }),
      }
    );
    if (!patchRes.ok) throw new Error(`Patch failed: HTTP ${patchRes.status}`);

    console.log(`  [BRAIN] Updated studio.quality_scores.lessons.${lessonKey}`);
    return true;
  } catch (e) {
    console.error(`  [BRAIN] Write failed: ${e.message}`);
    return false;
  }
}

// ── CLI ──

async function main() {
  const args = process.argv.slice(2);

  const fileIdx = args.indexOf('--file');
  const lessonIdx = args.indexOf('--lesson');

  const filePath = fileIdx >= 0 ? args[fileIdx + 1] : null;
  const lessonKey = lessonIdx >= 0 ? args[lessonIdx + 1] : null;

  if (!filePath) {
    console.log('Like One Studio — QA Gate');
    console.log('');
    console.log('Usage:');
    console.log('  node studio/lib/qa-gate.js --file <video.mp4> [--lesson <lesson_key>]');
    console.log('');
    console.log('Examples:');
    console.log('  node studio/lib/qa-gate.js --file output/video/00_convergence.mp4 --lesson 00_convergence');
    console.log('  node studio/lib/qa-gate.js --file output/lesson-00.mp4 --lesson "00_convergence"');
    console.log('');
    console.log('Options:');
    console.log('  --file     Path to the rendered video file');
    console.log('  --lesson   Lesson key for brain_context storage (e.g. "00_convergence")');
    console.log('');
    console.log('Quality Standards:');
    console.log(`  Audio:  ${QA_STANDARDS.audio.channels}ch stereo, ${QA_STANDARDS.audio.sampleRate} Hz, ${QA_STANDARDS.audio.lufsMin} to ${QA_STANDARDS.audio.lufsMax} LUFS`);
    console.log(`  Video:  ${QA_STANDARDS.video.width}x${QA_STANDARDS.video.height} @ ${QA_STANDARDS.video.fps} fps`);
    console.log(`  File:   .${QA_STANDARDS.file.container}, >= ${(QA_STANDARDS.file.minSizeBytes / 1_000_000).toFixed(1)} MB`);
    process.exit(1);
  }

  // Resolve path relative to cwd
  const resolved = path.resolve(filePath);

  console.log('\nLIKE ONE STUDIO — QA Gate');
  console.log('='.repeat(55));

  const report = runQAGate(resolved);

  // Write to brain_context if lesson key provided
  if (lessonKey) {
    await writeToBrain(lessonKey, report);
  }

  console.log('\n' + '='.repeat(55));
  console.log(report.pass
    ? `RESULT: PASS — all ${report.checks.length} checks passed (${report.score}%)`
    : `RESULT: FAIL — ${report.checks.filter(c => !c.pass).length} check(s) failed (${report.score}%)`
  );

  // Output JSON to stdout for piping
  if (args.includes('--json')) {
    console.log('\n--- JSON ---');
    console.log(JSON.stringify(report, null, 2));
  }

  process.exit(report.pass ? 0 : 1);
}

// Run if executed directly
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  main().catch(e => {
    console.error(`Fatal: ${e.message}`);
    process.exit(2);
  });
}
