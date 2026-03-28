#!/usr/bin/env node
/**
 * bunny-upload.js — Batch upload MP4s to Bunny Stream
 *
 * Usage:
 *   node studio/bunny-upload.js              # upload all eligible MP4s
 *   node studio/bunny-upload.js --dry-run    # list what would be uploaded
 *   node studio/bunny-upload.js --wire       # upload + patch frontmatter with videoId
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const VIDEO_DIR = join(ROOT, 'output', 'video');
const ACADEMY_DIR = join(ROOT, 'content', 'academy');
const OUTPUT_JSON = join(ROOT, 'output', 'video-ids.json');

const LIBRARY_ID = '626785';
const BASE_URL = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`;

// ── Flags ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const WIRE = args.includes('--wire');

// ── API key ────────────────────────────────────────────────────────────
function getApiKey() {
  if (process.env.BUNNY_API_KEY) return process.env.BUNNY_API_KEY;

  // Try .env.local at repo root
  const envPath = join(ROOT, '.env.local');
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, 'utf-8').match(/^BUNNY_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }

  console.error('ERROR: BUNNY_API_KEY not found in env or .env.local');
  process.exit(1);
}

// ── Collect eligible MP4s ──────────────────────────────────────────────
function getEligibleVideos() {
  const EXCLUDE_RE = /(_silent\.mp4$|^test_|^test-|_test\.|^all_scenes|^embeddings-test|^visual_v2_)/;

  return readdirSync(VIDEO_DIR)
    .filter(f => f.endsWith('.mp4') && !EXCLUDE_RE.test(f))
    .map(f => ({
      file: f,
      slug: f.replace(/\.mp4$/, '').replace(/-$/, ''),   // strip trailing dash if any
      path: join(VIDEO_DIR, f),
      title: f
        .replace(/\.mp4$/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()),
    }));
}

// ── Bunny Stream: create video entry ───────────────────────────────────
async function createVideo(apiKey, title) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'AccessKey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create video failed (${res.status}): ${text}`);
  }
  return res.json();               // { guid, ... }
}

// ── Bunny Stream: upload binary ────────────────────────────────────────
async function uploadVideo(apiKey, videoId, filePath) {
  const body = readFileSync(filePath);
  const res = await fetch(`${BASE_URL}/${videoId}`, {
    method: 'PUT',
    headers: {
      'AccessKey': apiKey,
      'Content-Type': 'application/octet-stream',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return res.json();
}

// ── Wire videoId into matching frontmatter ─────────────────────────────
function findMarkdownFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(full));
    } else if (entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function wireVideoId(slug, videoId) {
  // Normalise slug for matching: "ai-without-jargon" should match file "ai-without-jargon.md"
  const mdFiles = findMarkdownFiles(ACADEMY_DIR);
  let wired = 0;

  for (const mdPath of mdFiles) {
    const fileName = basename(mdPath, '.md');
    if (fileName !== slug) continue;

    const content = readFileSync(mdPath, 'utf-8');
    const fmEnd = content.indexOf('---', 3);        // end of frontmatter
    if (fmEnd === -1) continue;

    const frontmatter = content.slice(0, fmEnd);
    const rest = content.slice(fmEnd);

    // Already has videoId? Update it.
    if (/^videoId:/m.test(frontmatter)) {
      const updated = frontmatter.replace(/^videoId:.*$/m, `videoId: "${videoId}"`) + rest;
      writeFileSync(mdPath, updated, 'utf-8');
    } else {
      // Insert videoId before closing ---
      const updated = frontmatter + `videoId: "${videoId}"\n` + rest;
      writeFileSync(mdPath, updated, 'utf-8');
    }

    console.log(`  WIRED ${mdPath}`);
    wired++;
  }

  return wired;
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  const videos = getEligibleVideos();

  if (videos.length === 0) {
    console.log('No eligible MP4s found.');
    return;
  }

  console.log(`Found ${videos.length} eligible video(s):\n`);

  if (DRY_RUN) {
    for (const v of videos) {
      console.log(`  [DRY] ${v.file}  →  title: "${v.title}"  slug: "${v.slug}"`);
    }
    console.log('\nDry run complete. No uploads performed.');
    return;
  }

  const apiKey = getApiKey();
  const mapping = {};

  for (const v of videos) {
    try {
      console.log(`Uploading: ${v.file}`);

      // Step 1: Create entry
      const entry = await createVideo(apiKey, v.title);
      const videoId = entry.guid;
      console.log(`  Created: ${videoId}`);

      // Step 2: Upload binary
      const size = statSync(v.path).size;
      console.log(`  Uploading ${(size / 1024 / 1024).toFixed(1)} MB...`);
      await uploadVideo(apiKey, videoId, v.path);
      console.log(`  Upload complete.`);

      mapping[v.slug] = videoId;

      // Step 3: Wire frontmatter if --wire
      if (WIRE) {
        const wired = wireVideoId(v.slug, videoId);
        if (wired === 0) console.log(`  No matching .md found for slug "${v.slug}"`);
      }
    } catch (err) {
      console.error(`  ERROR on ${v.file}: ${err.message}`);
      mapping[v.slug] = `ERROR: ${err.message}`;
    }
  }

  // Save mapping
  writeFileSync(OUTPUT_JSON, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\nSlug→videoId mapping saved to ${OUTPUT_JSON}`);
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
