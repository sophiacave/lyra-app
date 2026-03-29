#!/usr/bin/env node
/**
 * Like One Studio — QA Batch Runner
 * Scans an output directory for all rendered videos and runs qa-gate on each.
 * Produces a summary report and updates brain_context with all results.
 *
 * Usage:
 *   node studio/lib/qa-batch.js --dir output/
 *   node studio/lib/qa-batch.js --dir output/video/ --json
 *   node studio/lib/qa-batch.js --dir output/ --only 00_convergence
 */
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { runQAGate, writeToBrain, QA_STANDARDS } from './qa-gate.js';

// ── Supabase Config (for batch summary write) ──
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tnsujchfrixxsdpodygu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Recursively find all MP4 files in a directory.
 * Skips _silent, _processed, _normalized intermediates.
 */
function findVideos(dir) {
  const results = [];

  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectories (video/, audio/ etc.)
      results.push(...findVideos(fullPath));
    } else if (
      entry.name.endsWith('.mp4') &&
      !entry.name.includes('_silent') &&
      !entry.name.includes('_processed') &&
      !entry.name.includes('_normalized') &&
      !entry.name.startsWith('_') &&
      !entry.name.startsWith('.')
    ) {
      results.push(fullPath);
    }
  }

  return results.sort();
}

/**
 * Extract a lesson key from a filename.
 * "00_convergence.mp4" -> "00_convergence"
 * "00_convergence_v2.mp4" -> "00_convergence"
 * "lesson-00.mp4" -> "lesson-00"
 */
function extractLessonKey(filePath) {
  const base = path.basename(filePath, '.mp4');
  // Strip version suffixes like _v2, _v3
  return base.replace(/_v\d+$/, '');
}

/**
 * Write a batch summary to brain_context.
 */
async function writeBatchSummary(reports) {
  if (!SUPABASE_KEY) {
    console.log('\n[SKIP] No SUPABASE_KEY — batch brain write skipped');
    return;
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

    // Update each lesson
    for (const report of reports) {
      if (!report.lessonKey) continue;

      current.lessons[report.lessonKey] = {
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
        cinema_grade_applied: current.lessons[report.lessonKey]?.cinema_grade_applied || null,
        checked_at: report.timestamp,
        notes: `QA-batch auto: ${report.summary}`,
      };
    }

    // Add batch metadata
    current.last_batch_run = {
      timestamp: new Date().toISOString(),
      total: reports.length,
      passed: reports.filter(r => r.pass).length,
      failed: reports.filter(r => !r.pass).length,
      avg_score: reports.length > 0
        ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)
        : 0,
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

    console.log(`[BRAIN] Updated studio.quality_scores with ${reports.length} lesson results`);
  } catch (e) {
    console.error(`[BRAIN] Batch write failed: ${e.message}`);
  }
}

// ── CLI ──

async function main() {
  const args = process.argv.slice(2);

  const dirIdx = args.indexOf('--dir');
  const onlyIdx = args.indexOf('--only');
  const wantJSON = args.includes('--json');
  const skipBrain = args.includes('--no-brain');

  const dir = dirIdx >= 0 ? args[dirIdx + 1] : null;
  const onlySlug = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  if (!dir) {
    console.log('Like One Studio — QA Batch Runner');
    console.log('');
    console.log('Usage:');
    console.log('  node studio/lib/qa-batch.js --dir <output-directory>');
    console.log('');
    console.log('Examples:');
    console.log('  node studio/lib/qa-batch.js --dir output/');
    console.log('  node studio/lib/qa-batch.js --dir output/video/ --json');
    console.log('  node studio/lib/qa-batch.js --dir output/ --only 00_convergence');
    console.log('  node studio/lib/qa-batch.js --dir output/ --no-brain');
    console.log('');
    console.log('Options:');
    console.log('  --dir        Directory to scan for .mp4 files (recursive)');
    console.log('  --only       Only check files matching this slug');
    console.log('  --json       Output full JSON report');
    console.log('  --no-brain   Skip writing results to brain_context');
    process.exit(1);
  }

  const resolvedDir = path.resolve(dir);

  console.log('\nLIKE ONE STUDIO — QA Batch Runner');
  console.log('='.repeat(60));
  console.log(`Scanning: ${resolvedDir}`);

  // Find all videos
  let videos = findVideos(resolvedDir);

  if (onlySlug) {
    videos = videos.filter(v => path.basename(v).includes(onlySlug));
  }

  if (videos.length === 0) {
    console.log('\nNo MP4 files found in directory.');
    console.log('(Skips files with _silent, _processed, _normalized suffixes)');
    process.exit(0);
  }

  console.log(`Found ${videos.length} video(s) to check\n`);

  // Run QA gate on each
  const startTime = Date.now();
  const reports = [];

  for (let i = 0; i < videos.length; i++) {
    const videoPath = videos[i];
    const lessonKey = extractLessonKey(videoPath);

    console.log(`[${i + 1}/${videos.length}] ${path.basename(videoPath)}`);

    const report = runQAGate(videoPath);
    report.lessonKey = lessonKey;
    reports.push(report);
  }

  // ── Summary Report ──
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const passed = reports.filter(r => r.pass);
  const failed = reports.filter(r => !r.pass);
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)
    : 0;

  console.log('\n' + '='.repeat(60));
  console.log('BATCH QA SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total:    ${reports.length} videos`);
  console.log(`Passed:   ${passed.length}`);
  console.log(`Failed:   ${failed.length}`);
  console.log(`Avg Score: ${avgScore}%`);
  console.log(`Time:     ${totalTime}s`);

  if (failed.length > 0) {
    console.log('\nFailed Videos:');
    for (const r of failed) {
      const failedChecks = r.checks.filter(c => !c.pass).map(c => c.name).join(', ');
      console.log(`  [FAIL] ${path.basename(r.file)} — ${failedChecks}`);
    }
  }

  if (passed.length > 0) {
    console.log('\nPassed Videos:');
    for (const r of passed) {
      const dur = r.metadata.video_duration_s || '?';
      const lufs = r.metadata.audio_loudness_lufs || '?';
      console.log(`  [PASS] ${path.basename(r.file)} — ${dur}s, ${lufs} LUFS, ${r.metadata.file_size_mb} MB`);
    }
  }

  // Write to brain_context (batch)
  if (!skipBrain) {
    await writeBatchSummary(reports);
  }

  // Save JSON report to file
  const reportDir = path.join(resolvedDir, 'qa-reports');
  if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const reportPath = path.join(reportDir, `qa-batch-${timestamp}.json`);
  const jsonReport = {
    timestamp: new Date().toISOString(),
    directory: resolvedDir,
    standards: QA_STANDARDS,
    summary: {
      total: reports.length,
      passed: passed.length,
      failed: failed.length,
      avgScore,
      elapsedS: parseFloat(totalTime),
    },
    results: reports.map(r => ({
      file: r.file,
      lessonKey: r.lessonKey,
      pass: r.pass,
      score: r.score,
      summary: r.summary,
      metadata: r.metadata,
      checks: r.checks.map(c => ({ name: c.name, pass: c.pass, expected: c.expected, actual: c.actual, detail: c.detail })),
    })),
  };

  writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  console.log(`\nReport saved: ${reportPath}`);

  // Print JSON to stdout if requested
  if (wantJSON) {
    console.log('\n--- JSON ---');
    console.log(JSON.stringify(jsonReport, null, 2));
  }

  console.log('\n' + '='.repeat(60));
  console.log(failed.length === 0
    ? `ALL CLEAR: ${reports.length} videos passed QA`
    : `ACTION NEEDED: ${failed.length}/${reports.length} videos failed QA`
  );

  process.exit(failed.length > 0 ? 1 : 0);
}

// Run if executed directly
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  main().catch(e => {
    console.error(`Fatal: ${e.message}`);
    process.exit(2);
  });
}
