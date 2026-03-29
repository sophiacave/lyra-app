#!/usr/bin/env node
/**
 * Like One Studio — Pipeline V4: Photoreal Cinema
 * 
 * The full chain: screenplay → voice → avatar → broll → compose → sound → QC → deploy
 * 
 * Usage:
 *   node studio/pipeline-v4.js screenplays/what-is-a-neuron-v4.json
 *   node studio/pipeline-v4.js screenplays/what-is-a-neuron-v4.json --phase voice
 *   node studio/pipeline-v4.js screenplays/what-is-a-neuron-v4.json --phase avatar
 *   node studio/pipeline-v4.js screenplays/what-is-a-neuron-v4.json --skip-broll
 */
import { execSync, spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const ROOT_DIR = path.join(STUDIO_DIR, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const VIDEO_DIR = path.join(OUTPUT_DIR, 'video');
const AVATAR_DIR = path.join(OUTPUT_DIR, 'avatar');
const BROLL_DIR = path.join(OUTPUT_DIR, 'broll');
const VOICES_DIR = path.join(STUDIO_DIR, 'voices');
const AVATARS_DIR = path.join(STUDIO_DIR, 'avatars');

// Ensure dirs exist
[OUTPUT_DIR, AUDIO_DIR, VIDEO_DIR, AVATAR_DIR, BROLL_DIR].forEach(d => {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
});

// ── PERSONA CONFIG ──
const PERSONAS = {
  faye: {
    name: 'Faye Cave',
    voiceRef: path.join(VOICES_DIR, 'faye-reference.wav'),
    voiceRefText: 'Some call me nature, others call me mother nature.',
    avatar: path.join(AVATARS_DIR, 'faye', 'headshot-neutral.png'),
    ttsEngine: 'f5tts', // f5tts | elevenlabs | s2pro
    elevenLabsVoiceId: null,
  },
  lyra: {
    name: 'Lyra',
    voiceRef: path.join(VOICES_DIR, 'lyra-reference.wav'),
    voiceRefText: '',
    avatar: path.join(AVATARS_DIR, 'lyra', 'headshot-neutral.png'),
    ttsEngine: 'f5tts',
    elevenLabsVoiceId: null,
  },
  sage: {
    name: 'Sage',
    voiceRef: path.join(VOICES_DIR, 'sage-reference.wav'),
    voiceRefText: '',
    avatar: path.join(AVATARS_DIR, 'sage', 'headshot-neutral.png'),
    ttsEngine: 'f5tts',
    elevenLabsVoiceId: null,
  },
  atlas: {
    name: 'Atlas',
    voiceRef: path.join(VOICES_DIR, 'atlas-reference.wav'),
    voiceRefText: '',
    avatar: path.join(AVATARS_DIR, 'atlas', 'headshot-neutral.png'),
    ttsEngine: 'f5tts',
    elevenLabsVoiceId: null,
  },
};

// ── BEAT → PACING MAP ──
const BEAT_PACING = {
  intrigue:    { wpm: 140, pauseAfterS: 1.5 },
  teach:       { wpm: 145, pauseAfterS: 0.5 },
  concept:     { wpm: 140, pauseAfterS: 0.8 },
  awe:         { wpm: 130, pauseAfterS: 1.0 },
  revelation:  { wpm: 125, pauseAfterS: 2.0 },
  build:       { wpm: 150, pauseAfterS: 0.3 },
  energy:      { wpm: 155, pauseAfterS: 0.2 },
  close:       { wpm: 135, pauseAfterS: 1.5 },
};

// ── PHASE 1: VOICE GENERATION ──
async function generateVoice(screenplay) {
  const persona = PERSONAS[screenplay.persona] || PERSONAS.faye;
  const slug = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const results = [];

  console.log(`\n🎙️  PHASE 1: VOICE — Persona: ${persona.name}`);

  // Batch generate all voice clips in one process (model loads once)
  if (persona.ttsEngine === 'f5tts') {
    await batchGenerateF5TTS(screenplay.scenes, persona, slug);
  }

  // Collect results (whether cached or freshly generated)
  for (const scene of screenplay.scenes) {
    if (!scene.dialogue || scene.dialogue.trim() === '') {
      results.push({ sceneId: scene.id, audioPath: null, durationS: scene.duration_s || 5 });
      continue;
    }

    const outFile = path.join(AUDIO_DIR, `${slug}_${scene.id}.wav`);

    if (existsSync(outFile)) {
      const dur = getAudioDuration(outFile);
      results.push({ sceneId: scene.id, audioPath: outFile, durationS: dur });
    } else if (persona.ttsEngine === 's2pro') {
      const beat = BEAT_PACING[scene.beat] || BEAT_PACING.teach;
      const dur = await generateS2Pro(scene.dialogue, outFile, beat);
      results.push({ sceneId: scene.id, audioPath: outFile, durationS: dur });
    } else {
      console.log(`  ⚠️  No audio for ${scene.id}`);
      results.push({ sceneId: scene.id, audioPath: null, durationS: scene.duration_s || 5 });
    }
  }

  // Concatenate all audio into master narration track
  const masterPath = path.join(AUDIO_DIR, `${slug}_narration.wav`);
  concatenateAudio(results, masterPath);
  
  return { results, masterPath };
}

// Batch F5-TTS: generates ALL scenes in one Python process (model loads once)
async function batchGenerateF5TTS(scenes, persona, slug) {
  const refFile = persona.voiceRef;
  const refText = persona.voiceRefText;

  // Build batch config: only scenes that need generation
  const jobs = [];
  for (const scene of scenes) {
    if (!scene.dialogue || scene.dialogue.trim() === '') continue;
    const outFile = path.join(AUDIO_DIR, `${slug}_${scene.id}.wav`);
    if (existsSync(outFile)) continue; // skip cached
    jobs.push({ id: scene.id, text: scene.dialogue, outFile });
  }

  if (jobs.length === 0) {
    console.log(`  ⏭️  All voice files cached`);
    return;
  }

  const tmpScript = path.join(OUTPUT_DIR, '_f5tts_batch.py');
  const tmpConfig = path.join(OUTPUT_DIR, '_f5tts_batch.json');

  writeFileSync(tmpConfig, JSON.stringify({ refFile, refText, jobs }));
  writeFileSync(tmpScript, `
import json, soundfile as sf, time
from f5_tts.api import F5TTS

with open("${tmpConfig}") as f:
    cfg = json.load(f)

print("Loading F5-TTS model...", flush=True)
t0 = time.time()
tts = F5TTS(device='mps')
print(f"Model loaded in {time.time()-t0:.1f}s", flush=True)

for job in cfg['jobs']:
    t1 = time.time()
    wav, sr, _ = tts.infer(
        ref_file=cfg['refFile'],
        ref_text=cfg['refText'],
        gen_text=job['text'],
        seed=42
    )
    sf.write(job['outFile'], wav, sr)
    dur = len(wav) / sr
    words = len(job['text'].split())
    wpm = round((words / dur) * 60) if dur > 0 else 0
    elapsed = time.time() - t1
    print(f"DONE|{job['id']}|{dur:.1f}|{wpm}|{elapsed:.1f}", flush=True)
`);

  try {
    console.log(`  🔄 Generating ${jobs.length} voice clips (single model load)...`);
    const result = execSync(
      `source ~/likeone-workspace/studio-v3/bin/activate && python3 "${tmpScript}"`,
      { encoding: 'utf-8', timeout: 600000, shell: '/bin/zsh' }
    );
    // Parse results
    for (const line of result.split('\n')) {
      if (line.startsWith('DONE|')) {
        const [, id, dur, wpm, elapsed] = line.split('|');
        console.log(`  🔊 ${slug}_${id}.wav: ${dur}s | ${wpm} WPM | gen: ${elapsed}s`);
      } else if (line.trim()) {
        console.log(`  ${line.trim()}`);
      }
    }
  } catch (e) {
    console.error(`  ❌ F5-TTS batch failed: ${e.message?.slice(-300)}`);
  }
}

async function generateS2Pro(text, outFile, beat) {
  const S2PRO_URL = process.env.S2PRO_URL || 'http://127.0.0.1:8180';
  try {
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
    if (!resp.ok) throw new Error(`S2 Pro ${resp.status}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    writeFileSync(outFile, buf);
    const dur = getAudioDuration(outFile);
    console.log(`  🔊 ${outFile.split('/').pop()}: ${dur.toFixed(1)}s (S2 Pro)`);
    return dur;
  } catch (e) {
    console.error(`  ❌ S2 Pro failed: ${e.message?.slice(-200)}`);
    return 5;
  }
}

async function generateElevenLabs(text, persona, outFile, beat) {
  // TODO: Implement ElevenLabs API integration
  // Requires ELEVENLABS_API_KEY env var and persona.elevenLabsVoiceId
  console.log(`  ⚠️  ElevenLabs not yet configured — falling back to F5-TTS`);
  return generateF5TTS(text, persona, outFile, beat);
}

// ── PHASE 2: AVATAR GENERATION ──
async function generateAvatars(screenplay, voiceResults) {
  console.log(`\n🎭 PHASE 2: AVATAR — Generating talking heads`);
  const persona = PERSONAS[screenplay.persona] || PERSONAS.faye;
  const slug = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const results = [];

  for (const vr of voiceResults) {
    const scene = screenplay.scenes.find(s => s.id === vr.sceneId);
    if (!scene || !scene.type.includes('presenter') || !vr.audioPath) {
      results.push({ sceneId: vr.sceneId, videoPath: null });
      continue;
    }

    const outFile = path.join(AVATAR_DIR, `${slug}_${scene.id}.mp4`);
    
    if (existsSync(outFile)) {
      console.log(`  ⏭️  ${scene.id}: cached`);
      results.push({ sceneId: scene.id, videoPath: outFile });
      continue;
    }

    if (!existsSync(persona.avatar)) {
      console.log(`  ⚠️  No avatar image for ${persona.name} — skipping`);
      results.push({ sceneId: scene.id, videoPath: null });
      continue;
    }

    // SadTalker: audio + image → talking head
    try {
      console.log(`  🎬 Generating avatar for ${scene.id}...`);
      execSync(
        `cd ~/likeone-workspace/SadTalker && source venv/bin/activate && ` +
        `PYTORCH_ENABLE_MPS_FALLBACK=1 python3 inference.py ` +
        `--driven_audio "${vr.audioPath}" ` +
        `--source_image "${persona.avatar}" ` +
        `--result_dir "${AVATAR_DIR}" ` +
        `--still --preprocess full`,
        { encoding: 'utf-8', timeout: 600000, shell: '/bin/zsh' }
      );
      // SadTalker outputs with auto-generated names — find the latest .mp4
      const latest = execSync(`ls -t "${AVATAR_DIR}"/*.mp4 | head -1`, { encoding: 'utf-8' }).trim();
      if (latest && existsSync(latest)) {
        execSync(`mv "${latest}" "${outFile}"`);
        console.log(`  ✅ ${scene.id}: avatar generated`);
        results.push({ sceneId: scene.id, videoPath: outFile });
      }
    } catch (e) {
      console.error(`  ❌ Avatar failed for ${scene.id}: ${e.message?.slice(-200)}`);
      results.push({ sceneId: scene.id, videoPath: null });
    }
  }

  return results;
}

// ── PHASE 3: B-ROLL GENERATION ──
async function generateBRoll(screenplay, voiceResults) {
  console.log(`\n🎥 PHASE 3: B-ROLL — Cinematic footage`);
  const slug = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const results = [];

  for (const vr of voiceResults) {
    const scene = screenplay.scenes.find(s => s.id === vr.sceneId);
    if (!scene || !scene.type.includes('broll') || !scene.visual) {
      results.push({ sceneId: vr.sceneId, videoPath: null });
      continue;
    }

    const outFile = path.join(BROLL_DIR, `${slug}_${scene.id}.mp4`);
    
    if (existsSync(outFile)) {
      console.log(`  ⏭️  ${scene.id}: cached`);
      results.push({ sceneId: scene.id, videoPath: outFile });
      continue;
    }

    // B-roll generation placeholder — will connect to Runway/Kling/CogVideoX API
    console.log(`  📋 ${scene.id}: B-roll prompt queued: "${scene.visual.slice(0, 80)}..."`);
    results.push({ sceneId: scene.id, videoPath: null, prompt: scene.visual });
  }

  return results;
}

// ── PHASE 4: COMPOSITION ──
async function compose(screenplay, voiceResults, avatarResults, brollResults) {
  console.log(`\n🎬 PHASE 4: COMPOSE — Assembling final video`);
  const slug = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Build timeline
  const timeline = [];
  let currentTime = 0;

  for (const scene of screenplay.scenes) {
    const voice = voiceResults.find(v => v.sceneId === scene.id);
    const avatar = avatarResults.find(a => a.sceneId === scene.id);
    const broll = brollResults.find(b => b.sceneId === scene.id);
    
    const duration = voice?.durationS || scene.duration_s || 5;
    const beat = BEAT_PACING[scene.beat] || BEAT_PACING.teach;

    timeline.push({
      sceneId: scene.id,
      type: scene.type,
      startS: currentTime,
      durationS: duration + beat.pauseAfterS,
      audioPath: voice?.audioPath,
      videoPath: avatar?.videoPath || broll?.videoPath,
      textOverlay: scene.text_overlay || null,
      direction: scene.direction || null,
    });

    currentTime += duration + beat.pauseAfterS;
  }

  // Write timeline manifest for debugging
  const manifestPath = path.join(OUTPUT_DIR, `${slug}_v4_timeline.json`);
  writeFileSync(manifestPath, JSON.stringify(timeline, null, 2));
  console.log(`  📋 Timeline: ${timeline.length} scenes, ${currentTime.toFixed(1)}s total`);
  console.log(`  📄 Manifest: ${manifestPath}`);

  // FFmpeg composition (when we have all video assets)
  const videoSegments = timeline.filter(t => t.videoPath);
  if (videoSegments.length > 0) {
    console.log(`  🎬 ${videoSegments.length}/${timeline.length} scenes have video — compositing...`);
    // TODO: FFmpeg filter_complex assembly
  } else {
    console.log(`  ⚠️  No video segments yet — timeline manifest created for planning`);
  }

  return { timeline, totalDurationS: currentTime };
}

// ── UTILITIES ──
function getAudioDuration(filePath) {
  try {
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim();
    return parseFloat(result) || 5;
  } catch {
    return 5;
  }
}

function concatenateAudio(results, outPath) {
  const inputs = results.filter(r => r.audioPath).map(r => r.audioPath);
  if (inputs.length === 0) return;

  // Create concat list
  const listPath = outPath + '.list';
  const listContent = inputs.map(f => `file '${f}'`).join('\n');
  writeFileSync(listPath, listContent);

  try {
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c:a pcm_s16le "${outPath}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 60000 }
    );
    console.log(`  📎 Master narration: ${outPath}`);
  } catch (e) {
    console.error(`  ❌ Audio concat failed: ${e.message?.slice(-200)}`);
  }
}

// ── PHASE 5: SOUND DESIGN ──
async function soundDesign(masterAudioPath, timeline, slug) {
  console.log(`\n🔊 PHASE 5: SOUND DESIGN`);
  
  if (!masterAudioPath || !existsSync(masterAudioPath)) {
    console.log(`  ⚠️  No master audio — skipping sound design`);
    return null;
  }

  const musicBed = path.join(STUDIO_DIR, 'assets', 'audio', 'ambient-drone-01.wav');
  const finalPath = path.join(AUDIO_DIR, `${slug}_v4_master.wav`);

  if (!existsSync(musicBed)) {
    console.log(`  ⚠️  No music bed — using narration only`);
    return masterAudioPath;
  }

  // Mix: narration + music (ducked) + loudnorm
  try {
    const totalDur = timeline[timeline.length - 1]?.startS + timeline[timeline.length - 1]?.durationS || 120;
    execSync(
      `ffmpeg -y -i "${masterAudioPath}" -i "${musicBed}" ` +
      `-filter_complex "[1:a]atrim=0:${totalDur},aloop=loop=-1:size=${totalDur * 48000},volume=0.08[music];` +
      `[0:a][music]amix=inputs=2:duration=first:dropout_transition=2,` +
      `loudnorm=I=-14:TP=-1:LRA=7[out]" ` +
      `-map "[out]" "${finalPath}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 120000 }
    );
    console.log(`  ✅ Master audio mixed: ${finalPath}`);
    return finalPath;
  } catch (e) {
    console.error(`  ❌ Sound design failed: ${e.message?.slice(-200)}`);
    return masterAudioPath;
  }
}

// ── PHASE 6: QC ──
function qualityCheck(slug, timeline, masterAudioPath) {
  console.log(`\n✅ PHASE 6: QUALITY CHECK`);
  const checks = [];

  // Check 1: Audio exists
  const hasAudio = masterAudioPath && existsSync(masterAudioPath);
  checks.push({ name: 'Master audio exists', pass: hasAudio });

  // Check 2: LUFS
  if (hasAudio) {
    try {
      const lufsOut = execSync(
        `ffmpeg -i "${masterAudioPath}" -af loudnorm=print_format=json -f null - 2>&1 | grep -A1 '"input_i"'`,
        { encoding: 'utf-8', shell: '/bin/zsh' }
      );
      const lufsMatch = lufsOut.match(/"input_i"\s*:\s*"(-?\d+\.?\d*)"/);
      const lufs = lufsMatch ? parseFloat(lufsMatch[1]) : null;
      checks.push({ name: `LUFS: ${lufs} (target: -14 ±0.5)`, pass: lufs && Math.abs(lufs + 14) <= 0.5 });
    } catch { checks.push({ name: 'LUFS check', pass: false }); }
  }

  // Check 3: Scene variety
  const sceneTypes = new Set(timeline.map(t => t.type));
  checks.push({ name: `Scene types: ${sceneTypes.size} (min 3)`, pass: sceneTypes.size >= 3 });

  // Check 4: Total duration
  const totalDur = timeline[timeline.length - 1]?.startS + timeline[timeline.length - 1]?.durationS || 0;
  checks.push({ name: `Duration: ${totalDur.toFixed(0)}s`, pass: totalDur >= 60 && totalDur <= 300 });

  // Report
  for (const c of checks) {
    console.log(`  ${c.pass ? '✅' : '❌'} ${c.name}`);
  }

  const allPass = checks.every(c => c.pass);
  console.log(allPass ? '\n  🏆 ALL CHECKS PASSED' : '\n  ⚠️  SOME CHECKS FAILED');
  return allPass;
}

// ── MAIN ──
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node studio/pipeline-v4.js <screenplay.json> [--phase voice|avatar|broll|compose|all]');
    process.exit(1);
  }

  const screenplayPath = path.resolve(args[0]);
  if (!existsSync(screenplayPath)) {
    console.error(`❌ Screenplay not found: ${screenplayPath}`);
    process.exit(1);
  }

  const screenplay = JSON.parse(readFileSync(screenplayPath, 'utf-8'));
  const phase = args.find(a => a.startsWith('--phase'))?.split('=')[1] || 
                args[args.indexOf('--phase') + 1] || 'all';
  const slug = screenplay.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  console.log(`\n🎬 LIKE ONE STUDIO V4 — PHOTOREAL CINEMA`);
  console.log(`   Title: ${screenplay.title}`);
  console.log(`   Persona: ${screenplay.persona}`);
  console.log(`   Scenes: ${screenplay.scenes.length}`);
  console.log(`   Phase: ${phase}\n`);

  // Phase 1: Voice
  const { results: voiceResults, masterPath } = await generateVoice(screenplay);

  if (phase === 'voice') return;

  // Phase 2: Avatar
  const avatarResults = await generateAvatars(screenplay, voiceResults);

  if (phase === 'avatar') return;

  // Phase 3: B-Roll
  const brollResults = await generateBRoll(screenplay, voiceResults);

  if (phase === 'broll') return;

  // Phase 4: Compose
  const { timeline, totalDurationS } = await compose(screenplay, voiceResults, avatarResults, brollResults);

  // Phase 5: Sound Design
  const finalAudio = await soundDesign(masterPath, timeline, slug);

  // Phase 6: QC
  qualityCheck(slug, timeline, finalAudio);

  console.log(`\n🎬 Pipeline complete. Timeline: ${totalDurationS.toFixed(1)}s`);
}

main().catch(e => {
  console.error(`\n💥 Pipeline crashed: ${e.message}`);
  process.exit(1);
});
