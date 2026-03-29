#!/usr/bin/env node
/**
 * Like One Studio — Bunny CDN Upload Module
 * Uploads rendered videos to Bunny Stream, returns CDN URLs,
 * and updates brain_context studio.render_queue with status.
 *
 * Module usage:
 *   import { uploadToBunny, batchUpload } from './studio/lib/bunny-upload.js';
 *   const result = await uploadToBunny('/path/to/video.mp4', { lesson: '00_convergence' });
 *
 * CLI usage:
 *   node studio/lib/bunny-upload.js --file output/lesson-00.mp4 --lesson "00_convergence"
 *   node studio/lib/bunny-upload.js --batch output/video/            # upload all MP4s in dir
 *   node studio/lib/bunny-upload.js --file out.mp4 --lesson "00_convergence" --dry-run
 *   node studio/lib/bunny-upload.js --file out.mp4 --lesson "00_convergence" --skip-brain
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// ── Bunny Stream Configuration ──────────────────────────────────────
// Credentials sourced from brain_vault via secure_vault_get('bunny', passphrase).
// At runtime: env vars > .env.local > hardcoded library ID (public, non-secret).
const BUNNY_LIBRARY_ID = '626785';
const BUNNY_CDN_HOSTNAME = 'vz-6aead46a-d20.b-cdn.net';
const BUNNY_EMBED_BASE = 'https://iframe.mediadelivery.net/embed/626785';
const BUNNY_API_BASE = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`;

// ── Supabase Configuration ──────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tnsujchfrixxsdpodygu.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

// ── API Key Resolution ──────────────────────────────────────────────
function getBunnyApiKey() {
  // 1. Environment variable (preferred for CI/automation)
  if (process.env.BUNNY_STREAM_API_KEY) return process.env.BUNNY_STREAM_API_KEY;
  if (process.env.BUNNY_API_KEY) return process.env.BUNNY_API_KEY;

  // 2. .env.local at repo root
  const envPath = join(ROOT, '.env.local');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(/^BUNNY_(?:STREAM_)?API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }

  // 3. .env at repo root
  const envPath2 = join(ROOT, '.env');
  if (existsSync(envPath2)) {
    const content = readFileSync(envPath2, 'utf-8');
    const match = content.match(/^BUNNY_(?:STREAM_)?API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }

  return null;
}

// ── Video Metadata via ffprobe ──────────────────────────────────────
function probeVideo(filePath) {
  try {
    const json = execSync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`,
      { encoding: 'utf-8', timeout: 15000 }
    );
    const data = JSON.parse(json);
    const videoStream = (data.streams || []).find(s => s.codec_type === 'video');
    const audioStream = (data.streams || []).find(s => s.codec_type === 'audio');

    return {
      duration_s: parseFloat(data.format?.duration) || null,
      size_bytes: parseInt(data.format?.size, 10) || statSync(filePath).size,
      width: videoStream ? parseInt(videoStream.width, 10) : null,
      height: videoStream ? parseInt(videoStream.height, 10) : null,
      fps: videoStream?.r_frame_rate ? eval(videoStream.r_frame_rate) : null,
      video_codec: videoStream?.codec_name || null,
      audio_codec: audioStream?.codec_name || null,
      audio_sample_rate: audioStream ? parseInt(audioStream.sample_rate, 10) : null,
      audio_channels: audioStream ? parseInt(audioStream.channels, 10) : null,
      bitrate_kbps: data.format?.bit_rate ? Math.round(parseInt(data.format.bit_rate, 10) / 1000) : null,
    };
  } catch {
    // ffprobe not available or failed — return file size only
    return {
      duration_s: null,
      size_bytes: statSync(filePath).size,
      width: null, height: null, fps: null,
      video_codec: null, audio_codec: null,
      audio_sample_rate: null, audio_channels: null,
      bitrate_kbps: null,
    };
  }
}

// ── Bunny Stream: Create Video Entry ────────────────────────────────
async function createBunnyVideo(apiKey, title) {
  const res = await fetch(BUNNY_API_BASE, {
    method: 'POST',
    headers: {
      'AccessKey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny create-video failed (${res.status}): ${text}`);
  }

  return res.json(); // { guid, ... }
}

// ── Bunny Stream: Upload Binary ─────────────────────────────────────
async function uploadBunnyBinary(apiKey, videoId, filePath) {
  const body = readFileSync(filePath);
  const res = await fetch(`${BUNNY_API_BASE}/${videoId}`, {
    method: 'PUT',
    headers: {
      'AccessKey': apiKey,
      'Content-Type': 'application/octet-stream',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bunny upload failed (${res.status}): ${text}`);
  }

  return res.json();
}

// ── Bunny Stream: Check Video Status ────────────────────────────────
async function getBunnyVideoStatus(apiKey, videoId) {
  const res = await fetch(`${BUNNY_API_BASE}/${videoId}`, {
    method: 'GET',
    headers: { 'AccessKey': apiKey },
  });

  if (!res.ok) return null;
  return res.json();
}

// ── Brain Context: Update render_queue ──────────────────────────────
async function updateBrainRenderQueue(lessonName, update) {
  if (!SUPABASE_SERVICE_KEY) {
    console.log('  [brain] No SUPABASE_SERVICE_ROLE_KEY — skipping brain update');
    return false;
  }

  try {
    // Read current render_queue
    const readRes = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.studio.render_queue&select=value`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!readRes.ok) {
      console.log(`  [brain] Failed to read render_queue: ${readRes.status}`);
      return false;
    }

    const rows = await readRes.json();
    if (!rows.length) {
      console.log('  [brain] No studio.render_queue found in brain_context');
      return false;
    }

    const queue = rows[0].value;
    const lesson = (queue.lessons || []).find(l => l.name === lessonName || l.id === lessonName);

    if (lesson) {
      // Merge update into lesson entry
      Object.assign(lesson, update);
    } else {
      // Add new entry if lesson not found
      if (!queue.lessons) queue.lessons = [];
      queue.lessons.push({ name: lessonName, ...update });
    }

    // Write back
    const writeRes = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.studio.render_queue`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ value: queue }),
      }
    );

    if (!writeRes.ok) {
      console.log(`  [brain] Failed to update render_queue: ${writeRes.status}`);
      return false;
    }

    console.log(`  [brain] Updated studio.render_queue for "${lessonName}"`);
    return true;
  } catch (err) {
    console.log(`  [brain] Error updating render_queue: ${err.message}`);
    return false;
  }
}

// ── Update infrastructure.bunny_stream in brain ─────────────────────
async function updateBrainBunnyRegistry(lessonKey, videoId) {
  if (!SUPABASE_SERVICE_KEY) return false;

  try {
    const readRes = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.infrastructure.bunny_stream&select=value`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!readRes.ok) return false;

    const rows = await readRes.json();
    if (!rows.length) return false;

    const bunnyInfo = rows[0].value;
    if (!bunnyInfo.videos) bunnyInfo.videos = {};
    bunnyInfo.videos[`lesson_${lessonKey}`] = videoId;
    bunnyInfo.total_videos = Object.keys(bunnyInfo.videos).length;

    const writeRes = await fetch(
      `${SUPABASE_URL}/rest/v1/brain_context?key=eq.infrastructure.bunny_stream`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ value: bunnyInfo }),
      }
    );

    return writeRes.ok;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

/**
 * Upload a single video to Bunny Stream.
 *
 * @param {string} filePath - Absolute or relative path to the MP4 file
 * @param {Object} metadata - Upload metadata
 * @param {string} metadata.lesson - Lesson name/slug (e.g. "00_convergence")
 * @param {string} [metadata.title] - Human-readable title for Bunny dashboard
 * @param {number} [metadata.duration_s] - Video duration in seconds (auto-detected if omitted)
 * @param {number} [metadata.quality_score] - Quality score from QC pipeline (0-100)
 * @param {Object} [metadata.quality_details] - Detailed quality metrics
 * @param {Object} [options] - Upload options
 * @param {boolean} [options.dryRun=false] - If true, skip actual upload
 * @param {boolean} [options.skipBrain=false] - If true, skip brain_context update
 * @param {string} [options.apiKey] - Override Bunny API key
 * @returns {Promise<Object>} Upload result with videoId, cdnUrl, embedUrl
 */
export async function uploadToBunny(filePath, metadata = {}, options = {}) {
  const { dryRun = false, skipBrain = false, apiKey: overrideKey } = options;
  const absPath = resolve(filePath);

  // Validate file exists
  if (!existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  if (extname(absPath).toLowerCase() !== '.mp4') {
    throw new Error(`Expected .mp4 file, got: ${extname(absPath)}`);
  }

  // Resolve API key
  const apiKey = overrideKey || getBunnyApiKey();
  if (!apiKey && !dryRun) {
    throw new Error(
      'No Bunny API key found. Set BUNNY_STREAM_API_KEY or BUNNY_API_KEY env var, ' +
      'or add to .env.local at repo root.'
    );
  }

  // Probe video metadata
  const probe = probeVideo(absPath);
  const fileSize = probe.size_bytes;
  const duration = metadata.duration_s || probe.duration_s;
  const lesson = metadata.lesson || basename(absPath, '.mp4');
  const title = metadata.title || lesson
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  console.log(`\n--- Bunny Upload: ${basename(absPath)} ---`);
  console.log(`  Lesson:    ${lesson}`);
  console.log(`  Title:     ${title}`);
  console.log(`  File size: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);
  if (duration) console.log(`  Duration:  ${duration.toFixed(1)}s`);
  if (probe.width) console.log(`  Resolution: ${probe.width}x${probe.height}`);
  if (probe.bitrate_kbps) console.log(`  Bitrate:   ${probe.bitrate_kbps} kbps`);

  if (dryRun) {
    console.log('  [DRY RUN] Would upload to Bunny Stream. No action taken.');
    return {
      success: true,
      dryRun: true,
      lesson,
      title,
      filePath: absPath,
      fileSize,
      duration,
      probe,
    };
  }

  // Step 1: Create video entry on Bunny
  console.log('  Creating Bunny video entry...');
  const entry = await createBunnyVideo(apiKey, title);
  const videoId = entry.guid;
  console.log(`  Video ID: ${videoId}`);

  // Step 2: Upload binary
  console.log(`  Uploading ${(fileSize / 1024 / 1024).toFixed(1)} MB...`);
  const uploadStart = Date.now();
  await uploadBunnyBinary(apiKey, videoId, absPath);
  const uploadTime = ((Date.now() - uploadStart) / 1000).toFixed(1);
  console.log(`  Upload complete in ${uploadTime}s`);

  // Build URLs
  const cdnUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/play_720p.mp4`;
  const embedUrl = `${BUNNY_EMBED_BASE}/${videoId}`;
  const directUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/original`;

  console.log(`  CDN URL:   ${cdnUrl}`);
  console.log(`  Embed URL: ${embedUrl}`);

  // Step 3: Update brain_context
  if (!skipBrain) {
    const now = new Date().toISOString();
    await updateBrainRenderQueue(lesson, {
      status: 'uploaded',
      bunny_video_id: videoId,
      cdn_url: cdnUrl,
      embed_url: embedUrl,
      duration_s: duration,
      quality_score: metadata.quality_score || null,
      file_size_mb: parseFloat((fileSize / 1024 / 1024).toFixed(1)),
      uploaded_at: now,
      last_rendered: now,
    });

    // Also update the bunny_stream registry
    const lessonKey = lesson.replace(/^lesson[_-]?/i, '').replace(/-/g, '_');
    await updateBrainBunnyRegistry(lessonKey, videoId);
  }

  const result = {
    success: true,
    videoId,
    cdnUrl,
    embedUrl,
    directUrl,
    lesson,
    title,
    duration,
    fileSize,
    uploadTime: parseFloat(uploadTime),
    probe,
  };

  console.log(`  Done.`);
  return result;
}

/**
 * Batch upload multiple videos to Bunny Stream.
 *
 * @param {Array<{filePath: string, metadata: Object}>} items - Array of upload items
 * @param {Object} [options] - Upload options (same as uploadToBunny)
 * @returns {Promise<Object>} Batch result with successes, failures, and individual results
 */
export async function batchUpload(items, options = {}) {
  const results = [];
  let successes = 0;
  let failures = 0;
  const startTime = Date.now();

  console.log(`\n=== Bunny Batch Upload: ${items.length} video(s) ===\n`);

  for (let i = 0; i < items.length; i++) {
    const { filePath, metadata } = items[i];
    console.log(`[${i + 1}/${items.length}]`);

    try {
      const result = await uploadToBunny(filePath, metadata, options);
      results.push(result);
      successes++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({
        success: false,
        filePath,
        lesson: metadata?.lesson || basename(filePath, '.mp4'),
        error: err.message,
      });
      failures++;
    }

    // Small delay between uploads to be kind to Bunny API
    if (i < items.length - 1 && !options.dryRun) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n=== Batch Complete ===`);
  console.log(`  ${successes} succeeded, ${failures} failed (${elapsed}s total)`);

  return {
    total: items.length,
    successes,
    failures,
    elapsed: parseFloat(elapsed),
    results,
  };
}

/**
 * Scan a directory for MP4s and batch upload them.
 *
 * @param {string} dirPath - Directory to scan
 * @param {Object} [options] - Upload options
 * @returns {Promise<Object>} Batch result
 */
export async function batchUploadDir(dirPath, options = {}) {
  const absDir = resolve(dirPath);
  if (!existsSync(absDir)) {
    throw new Error(`Directory not found: ${absDir}`);
  }

  const EXCLUDE_RE = /(_silent\.mp4$|^test[_-]|_test\.|^all_scenes|^embeddings-test|^visual_v2_|_processed\.|_normalized\.|_corrected\.)/;

  const files = readdirSync(absDir)
    .filter(f => f.endsWith('.mp4') && !EXCLUDE_RE.test(f))
    .sort();

  if (files.length === 0) {
    console.log(`No eligible MP4 files found in ${absDir}`);
    return { total: 0, successes: 0, failures: 0, elapsed: 0, results: [] };
  }

  const items = files.map(f => ({
    filePath: join(absDir, f),
    metadata: {
      lesson: f.replace(/\.mp4$/, '').replace(/_v\d+$/, ''),
    },
  }));

  return batchUpload(items, options);
}

/**
 * Get status of a previously uploaded video.
 *
 * @param {string} videoId - Bunny video GUID
 * @param {Object} [options] - Options
 * @param {string} [options.apiKey] - Override API key
 * @returns {Promise<Object|null>} Video status or null
 */
export async function getVideoStatus(videoId, options = {}) {
  const apiKey = options.apiKey || getBunnyApiKey();
  if (!apiKey) throw new Error('No Bunny API key available');
  return getBunnyVideoStatus(apiKey, videoId);
}

// Export constants for external use
export const BUNNY_CONFIG = {
  LIBRARY_ID: BUNNY_LIBRARY_ID,
  CDN_HOSTNAME: BUNNY_CDN_HOSTNAME,
  EMBED_BASE: BUNNY_EMBED_BASE,
  API_BASE: BUNNY_API_BASE,
};

// ═══════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════

async function cli() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Like One Studio — Bunny CDN Upload

Usage:
  node studio/lib/bunny-upload.js --file <path> --lesson <name> [options]
  node studio/lib/bunny-upload.js --batch <directory> [options]
  node studio/lib/bunny-upload.js --status <video-id>

Options:
  --file <path>       Path to MP4 file to upload
  --lesson <name>     Lesson slug (e.g. "00_convergence")
  --title <title>     Human-readable title (auto-generated if omitted)
  --duration <secs>   Video duration in seconds (auto-detected if omitted)
  --quality <score>   Quality score 0-100 from QC pipeline
  --batch <dir>       Upload all MP4s in directory
  --status <id>       Check status of uploaded video by Bunny GUID
  --dry-run           Preview what would be uploaded, no actual upload
  --skip-brain        Skip updating brain_context in Supabase
  --help, -h          Show this help

Environment:
  BUNNY_STREAM_API_KEY  Bunny Stream library API key (preferred)
  BUNNY_API_KEY         Alternative env var name
  SUPABASE_SERVICE_ROLE_KEY  For brain_context updates

Examples:
  node studio/lib/bunny-upload.js --file output/lesson-00.mp4 --lesson "00_convergence"
  node studio/lib/bunny-upload.js --batch output/video/ --dry-run
  node studio/lib/bunny-upload.js --status 1f0b6854-fe3d-4f77-ab97-674b1486fa1b
`);
    return;
  }

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
  };

  const dryRun = args.includes('--dry-run');
  const skipBrain = args.includes('--skip-brain');
  const options = { dryRun, skipBrain };

  // Mode: --status
  const statusId = getArg('--status');
  if (statusId) {
    const apiKey = getBunnyApiKey();
    if (!apiKey) {
      console.error('ERROR: No Bunny API key found.');
      process.exit(1);
    }
    const status = await getBunnyVideoStatus(apiKey, statusId);
    if (status) {
      console.log(JSON.stringify(status, null, 2));
    } else {
      console.error(`Video not found: ${statusId}`);
      process.exit(1);
    }
    return;
  }

  // Mode: --batch
  const batchDir = getArg('--batch');
  if (batchDir) {
    const result = await batchUploadDir(batchDir, options);
    if (result.failures > 0) process.exit(1);
    return;
  }

  // Mode: --file
  const filePath = getArg('--file');
  if (!filePath) {
    console.error('ERROR: --file <path> or --batch <dir> required. Use --help for usage.');
    process.exit(1);
  }

  const lesson = getArg('--lesson');
  const title = getArg('--title');
  const durationStr = getArg('--duration');
  const qualityStr = getArg('--quality');

  const metadata = {
    lesson: lesson || basename(filePath, '.mp4'),
    title: title || undefined,
    duration_s: durationStr ? parseFloat(durationStr) : undefined,
    quality_score: qualityStr ? parseFloat(qualityStr) : undefined,
  };

  try {
    const result = await uploadToBunny(filePath, metadata, options);

    // Print summary JSON for pipeline consumption
    console.log('\n--- Result ---');
    console.log(JSON.stringify({
      videoId: result.videoId,
      cdnUrl: result.cdnUrl,
      embedUrl: result.embedUrl,
      lesson: result.lesson,
      duration: result.duration,
      uploadTime: result.uploadTime,
    }, null, 2));
  } catch (err) {
    console.error(`\nFATAL: ${err.message}`);
    process.exit(1);
  }
}

// Run CLI if this is the main module
const isMain = process.argv[1] && (
  process.argv[1].endsWith('bunny-upload.js') &&
  process.argv[1].includes('lib')
);

if (isMain) {
  cli().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}
