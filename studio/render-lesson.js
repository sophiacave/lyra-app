#!/usr/bin/env node
/**
 * Like One Studio — Lesson Render Script
 * Generates a complete lesson video: TTS audio + Remotion visuals.
 *
 * Usage: node studio/render-lesson.js [lesson-config.json]
 */
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', 'output');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const VIDEO_DIR = path.join(OUTPUT_DIR, 'video');

// Ensure output dirs exist
[OUTPUT_DIR, AUDIO_DIR, VIDEO_DIR].forEach(d => {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
});

// ── TTS Engine Selection ──
// Set via config.ttsEngine or TTS_ENGINE env var. Options: 's2pro' (premium), 'edge' (free fallback)
const TTS_ENGINE = process.env.TTS_ENGINE || 's2pro';

// ── TTS: Fish Audio S2 Pro (premium, local M3 Max) ──
async function generateTTS_S2Pro(text, voiceKey, outputName) {
  const s2Script = path.join(STUDIO_DIR, 'tts', 'generate-s2.py');
  const venvPython = path.join(process.env.HOME, 'likeone-workspace', 'code', 'fish-speech', '.venv', 'bin', 'python');
  const wavPath = path.join(AUDIO_DIR, `${outputName}.wav`);

  const cmd = `${venvPython} "${s2Script}" --text "${text.replace(/"/g, '\\"')}" --output "${wavPath}"`;

  try {
    execSync(cmd, { encoding: 'utf-8', timeout: 300000 });

    // Read timing metadata
    const timingPath = wavPath.replace('.wav', '.timing.json');
    if (existsSync(timingPath)) {
      const timing = JSON.parse(readFileSync(timingPath, 'utf-8'));
      return {
        audio_path: wavPath,
        duration_s: timing.duration_s,
        timing_path: timingPath,
      };
    }

    return { audio_path: wavPath, duration_s: 5 }; // Fallback duration
  } catch (e) {
    console.error(`❌ S2 Pro TTS failed for "${outputName}":`, e.message?.slice(-300));
    return null;
  }
}

// ── TTS: Edge TTS (free Microsoft fallback) ──
async function generateTTS_Edge(text, voiceKey, outputName) {
  const wavPath = path.join(AUDIO_DIR, `${outputName}.mp3`);
  const voice = voiceKey === 'sophia' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';

  const cmd = `edge-tts --voice "${voice}" --text "${text.replace(/"/g, '\\"')}" --write-media "${wavPath}"`;

  try {
    execSync(cmd, { encoding: 'utf-8', timeout: 30000 });

    // Get duration via ffprobe
    const probe = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${wavPath}"`, { encoding: 'utf-8' }).trim();
    const duration_s = parseFloat(probe) || 5;

    return { audio_path: wavPath, duration_s };
  } catch (e) {
    console.error(`❌ Edge TTS failed for "${outputName}":`, e.message?.slice(-200));
    return null;
  }
}

// ── TTS Router ──
async function generateTTS(text, voiceKey, outputName, engine) {
  const selectedEngine = engine || TTS_ENGINE;
  if (selectedEngine === 's2pro') {
    const result = await generateTTS_S2Pro(text, voiceKey, outputName);
    if (result) return result;
    console.log('  ⚠️ S2 Pro failed, falling back to Edge TTS...');
  }
  return generateTTS_Edge(text, voiceKey, outputName);
}

// ── Remotion Render ──
function renderVideo(compositionId, outputPath, props, durationFrames) {
  // Strip audioSrc from props — Remotion can't serve local files as URLs.
  // Audio is merged with FFmpeg in Phase 4 instead.
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
    execSync(cmd, { cwd: path.join(STUDIO_DIR, '..'), stdio: 'pipe', timeout: 300000 });
    return true;
  } catch (e) {
    console.error(`❌ Render failed:`, e.stderr?.toString?.()?.slice(-1000) || e.message?.slice(-1000));
    return false;
  }
}

// ── FFmpeg: Merge audio onto video ──
function mergeAudioVideo(videoPath, audioPath, outputPath) {
  const cmd = `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "${outputPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`❌ Merge failed:`, e.message?.slice(-200));
    return false;
  }
}

// ── Main Pipeline ──
async function renderLesson(config) {
  const lessonSlug = config.slug || config.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  console.log(`\n🎬 LIKE ONE STUDIO — Rendering: ${config.title}`);
  console.log('═'.repeat(60));

  // Step 1: Generate TTS for each narration section
  console.log('\n🎙️ Phase 1: Generating speech...');
  const audioResults = [];

  for (let i = 0; i < config.sections.length; i++) {
    const section = config.sections[i];
    if (section.type === 'narration') {
      const audioName = `${lessonSlug}_s${String(i).padStart(2, '0')}`;
      const result = await generateTTS(section.text, section.voice || 'sophia', audioName, config.ttsEngine);
      if (result) {
        audioResults.push({ index: i, ...result });
        section.durationS = Math.ceil(result.duration_s) + 1; // Add 1s buffer
        section.audioSrc = result.audio_path;

        // Read sentence timing for animation sync
        if (result.timing_path && existsSync(result.timing_path)) {
          const timing = JSON.parse(readFileSync(result.timing_path, 'utf-8'));
          if (timing.sentences) {
            section.sentenceTiming = timing.sentences; // [{offset_ms, duration_ms, text}]
          }
        }

        console.log(`  ✅ Segment ${i}: ${result.duration_s}s`);
      }
    }
  }

  // Step 2: Render Remotion video (silent)
  console.log('\n🎨 Phase 2: Rendering visuals...');
  const silentPath = path.join(VIDEO_DIR, `${lessonSlug}_silent.mp4`);
  const success = renderVideo('LessonVideo', silentPath, config);

  if (!success) {
    console.error('❌ Visual render failed. Aborting.');
    return null;
  }
  console.log(`  ✅ Silent video rendered`);

  // Step 3: Concatenate all audio segments
  console.log('\n🔊 Phase 3: Assembling audio...');
  const combinedAudioPath = path.join(AUDIO_DIR, `${lessonSlug}_combined.mp3`);

  if (audioResults.length > 0) {
    // Create silence + concat with ffmpeg
    const audioInputs = [];
    const filterParts = [];
    let inputIndex = 0;

    // 3s silence for title card
    audioInputs.push('-f lavfi -t 3 -i anullsrc=r=44100:cl=mono');
    filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono[s${inputIndex}]`);
    inputIndex++;

    for (const ar of audioResults) {
      audioInputs.push(`-i "${ar.audio_path}"`);
      filterParts.push(`[${inputIndex}]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=mono[s${inputIndex}]`);
      inputIndex++;
    }

    const concatInputs = Array.from({ length: inputIndex }, (_, i) => `[s${i}]`).join('');
    filterParts.push(`${concatInputs}concat=n=${inputIndex}:v=0:a=1[out]`);

    const ffmpegCmd = `ffmpeg -y ${audioInputs.join(' ')} -filter_complex "${filterParts.join(';')}" -map "[out]" -c:a libmp3lame -b:a 192k "${combinedAudioPath}"`;

    try {
      execSync(ffmpegCmd, { stdio: 'pipe', timeout: 30000 });
      console.log(`  ✅ Combined audio: ${combinedAudioPath}`);
    } catch (e) {
      console.error(`  ⚠️ Audio concat failed, continuing without audio`);
    }
  }

  // Step 4: Merge audio + video
  console.log('\n🎬 Phase 4: Final merge...');
  const finalPath = path.join(VIDEO_DIR, `${lessonSlug}.mp4`);

  if (existsSync(combinedAudioPath)) {
    mergeAudioVideo(silentPath, combinedAudioPath, finalPath);
  } else {
    // Just copy the silent video
    execSync(`cp "${silentPath}" "${finalPath}"`);
  }

  const stats = execSync(`ls -lh "${finalPath}"`, { encoding: 'utf-8' }).trim();
  console.log(`\n✨ COMPLETE: ${finalPath}`);
  console.log(`   ${stats.split(/\s+/).slice(4, 6).join(' ')}`);
  console.log(`   Open with: open '${finalPath}'`);

  return finalPath;
}

// ── CLI ──
const configPath = process.argv[2];

if (configPath) {
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  renderLesson(config);
} else {
  // Default: render the sample embeddings lesson
  const sampleLesson = {
    title: 'What Are Embeddings?',
    subtitle: 'RAG & Vector Search — Like One Academy',
    slug: 'what-are-embeddings',
    sections: [
      {
        type: 'narration',
        text: 'An embedding is a list of numbers that represents the meaning of text. Think of it as giving every word a unique address in mathematical space.',
        voice: 'sophia',
        highlightWords: ['embedding', 'numbers', 'meaning', 'address'],
      },
      {
        type: 'concept',
        label: 'Embedding Space',
        nodes: [
          { x: 0.2, y: 0.3, label: 'happy' },
          { x: 0.25, y: 0.5, label: 'joyful' },
          { x: 0.15, y: 0.45, label: 'delighted' },
          { x: 0.7, y: 0.3, label: 'sad' },
          { x: 0.75, y: 0.5, label: 'melancholy' },
          { x: 0.5, y: 0.8, label: 'neutral' },
        ],
        connections: [[0, 1], [0, 2], [1, 2], [3, 4]],
        durationS: 5,
      },
      {
        type: 'narration',
        text: 'Words with similar meanings end up close together. Happy lives near joyful and delighted, but far from sad. This is how your AI brain finds related memories.',
        voice: 'sophia',
        highlightWords: ['similar', 'close', 'brain', 'memories'],
      },
    ],
  };

  renderLesson(sampleLesson);
}
