#!/usr/bin/env node
/**
 * Like One Studio — Fish S2 Pro TTS Client
 * Calls local S2 Pro API server (127.0.0.1:8180) for human-quality voice.
 * Server must be running: see studio/tts/start-s2pro.sh
 *
 * Usage:
 *   node studio/tts/s2pro-client.js --text "Hello world" --output output/audio/hello.wav
 *   node studio/tts/s2pro-client.js --text "Hello world" --output hello.wav --ref-audio ref.wav --ref-text "Ref transcript"
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const S2PRO_URL = process.env.S2PRO_URL || 'http://127.0.0.1:8180';

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : null;
}

const text = getArg('text');
const output = getArg('output');
const refAudio = getArg('ref-audio');
const refText = getArg('ref-text');
const seed = parseInt(getArg('seed') || '42');
const temperature = parseFloat(getArg('temperature') || '0.7');
const topP = parseFloat(getArg('top-p') || '0.7');
const repPenalty = parseFloat(getArg('rep-penalty') || '1.5');

if (!text || !output) {
  console.error('Usage: node s2pro-client.js --text "..." --output path.wav');
  process.exit(1);
}

async function generateSpeech() {
  // Check server health
  try {
    const health = await fetch(`${S2PRO_URL}/v1/health`);
    if (!health.ok) throw new Error('Server not healthy');
  } catch (e) {
    console.error('❌ S2 Pro server not running. Start it with: bash studio/tts/start-s2pro.sh');
    process.exit(1);
  }

  // Build references array
  const references = [];
  if (refAudio && existsSync(refAudio)) {
    const audioBytes = readFileSync(refAudio);
    references.push({
      audio: Array.from(audioBytes),
      text: refText || '',
    });
    console.log(`  🎙️ Using reference voice: ${refAudio}`);
  }

  console.log(`  🔊 Generating S2 Pro speech (${text.length} chars)...`);
  const t0 = Date.now();

  const resp = await fetch(`${S2PRO_URL}/v1/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      references,
      max_new_tokens: 2048,
      chunk_length: 200,
      top_p: topP,
      repetition_penalty: repPenalty,
      temperature,
      format: 'wav',
      seed,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`❌ S2 Pro TTS failed (${resp.status}): ${err}`);
    process.exit(1);
  }

  const audioBuffer = Buffer.from(await resp.arrayBuffer());
  
  // Ensure output dir exists
  const outDir = path.dirname(output);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  
  writeFileSync(output, audioBuffer);

  // Get duration
  const dur = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${output}"`,
    { encoding: 'utf-8' }
  ).trim();
  
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const words = text.split(/\s+/).length;
  const wpm = (words / (parseFloat(dur) / 60)).toFixed(0);

  console.log(`  ✅ ${dur}s audio in ${elapsed}s | ${wpm} WPM | ${output}`);
  
  return { path: output, duration_s: parseFloat(dur), wpm: parseInt(wpm) };
}

generateSpeech().catch(e => {
  console.error('❌ Fatal:', e.message);
  process.exit(1);
});
