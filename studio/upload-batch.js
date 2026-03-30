#!/usr/bin/env node
/**
 * Upload specific lesson videos to Bunny Stream and output videoIds.
 * Usage: node studio/upload-batch.js
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const UPLOAD_DIR = join(ROOT, 'output', 'upload-batch');
const LIBRARY_ID = '626785';
const BASE_URL = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`;

// Load API key
function getApiKey() {
  const envPath = join(ROOT, '.env.local');
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, 'utf-8').match(/^BUNNY_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  throw new Error('BUNNY_API_KEY not found');
}

// Videos to upload with proper titles and lesson mappings
const VIDEOS = [
  {
    file: 'your-first-conversation_v2.mp4',
    title: 'Your First Conversation',
    course: 'claude-for-beginners',
    lesson: 'your-first-conversation',
  },
  {
    file: 'why-prompts-matter_v2.mp4',
    title: 'Why Prompts Matter',
    course: 'prompt-writing-101',
    lesson: 'why-prompts-matter',
  },
  {
    file: 'why-ai-ethics-matter_v2.mp4',
    title: 'Why AI Ethics Matter',
    course: 'ai-ethics-and-safety',
    lesson: 'why-ai-ethics-matter',
  },
  {
    file: 'your-first-ai-creative-session_v2.mp4',
    title: 'Your First AI Creative Session',
    course: 'ai-for-creatives',
    lesson: 'your-first-ai-creative-session',
  },
];

async function createVideo(apiKey, title) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'AccessKey': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Create failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function uploadVideo(apiKey, videoId, filePath) {
  const body = readFileSync(filePath);
  const res = await fetch(`${BASE_URL}/${videoId}`, {
    method: 'PUT',
    headers: { 'AccessKey': apiKey, 'Content-Type': 'application/octet-stream' },
    body,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function main() {
  const apiKey = getApiKey();
  const results = [];

  for (const video of VIDEOS) {
    const filePath = join(UPLOAD_DIR, video.file);
    if (!existsSync(filePath)) {
      console.log(`  SKIP ${video.file} — not found`);
      continue;
    }

    const sizeMB = (readFileSync(filePath).length / (1024 * 1024)).toFixed(1);
    console.log(`\n  Uploading: ${video.title} (${sizeMB}MB)...`);

    try {
      // Create entry
      const entry = await createVideo(apiKey, video.title);
      const videoId = entry.guid;
      console.log(`    Created: ${videoId}`);

      // Upload binary
      await uploadVideo(apiKey, videoId, filePath);
      console.log(`    Uploaded OK`);

      results.push({ ...video, videoId });
      console.log(`    videoId: ${videoId}`);
      console.log(`    frontmatter: videoId: "${videoId}"`);
      console.log(`    lesson: content/academy/${video.course}/${video.lesson}.md`);
    } catch (err) {
      console.error(`    FAILED: ${err.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('RESULTS — Add these videoIds to lesson frontmatter:');
  console.log('═══════════════════════════════════════');
  for (const r of results) {
    console.log(`  ${r.course}/${r.lesson}: videoId: "${r.videoId}"`);
  }
}

main().catch(console.error);
