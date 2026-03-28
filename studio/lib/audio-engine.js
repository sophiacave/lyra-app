/**
 * Like One Studio — Audio Engine
 * 6-stage TTS post-processing + music ducking + SFX placement.
 *
 * All processing via FFmpeg. Zero external audio deps.
 * Research-backed: EBU R128, YouTube -14 LUFS, broadcast standards.
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const ASSETS_DIR = path.join(STUDIO_DIR, '..', 'assets', 'audio');
const OUTPUT_DIR = path.join(STUDIO_DIR, '..', '..', 'output');

// ── Audio Processing Constants ──
export const AUDIO = {
  SAMPLE_RATE: 48000,
  TARGET_LUFS: -14,        // YouTube optimal
  TRUE_PEAK_MAX: -1,       // dBTP
  LRA_TARGET: 11,

  // Music levels
  MUSIC_BASE_DB: -18,      // Base music volume
  MUSIC_DUCK_RATIO: 6,     // Sidechain compression ratio
  MUSIC_DUCK_ATTACK: 80,   // ms
  MUSIC_DUCK_RELEASE: 400, // ms
  MUSIC_DUCK_THRESHOLD: -30, // dB
  MUSIC_DUCK_MIX: 0.8,

  // SFX levels (relative to full scale)
  SFX_WHOOSH_DB: -12,
  SFX_POP_DB: -20,
  SFX_IMPACT_DB: -8,
  SFX_CHIME_DB: -16,
  SFX_SWELL_DB: -18,
};

// ── TTS Post-Processing Chain ──
// Order: High-pass → De-ess → Compress → EQ → Noise Gate → Limiter

const TTS_FILTER_CHAIN = [
  // Stage 1: High-pass (remove rumble below 80Hz)
  'highpass=f=80:p=2',

  // Stage 2: De-ess — bandreject centered at 6.5kHz, mix=0.6 for partial attenuation
  'bandreject=f=6500:t=h:w=3000:m=0.6',

  // Stage 3: Compression (3:1, preserve transients)
  'acompressor=threshold=-18dB:ratio=3:attack=5:release=50:makeup=2dB:knee=6dB',

  // Stage 4: EQ (cut mud, boost presence + air)
  'equalizer=f=200:t=q:w=1.5:g=-2',
  'equalizer=f=3000:t=q:w=1.2:g=3',
  'equalizer=f=5000:t=q:w=2:g=1.5',
  'equalizer=f=8000:t=q:w=1:g=-1',

  // Stage 5: Noise gate (kill artifacts in silence)
  'agate=threshold=-35dB:attack=1:release=100:ratio=3:range=-30dB',

  // Stage 6: Brick wall limiter
  'alimiter=limit=0.95:level=false:attack=3:release=50',
].join(',');

/**
 * Process a TTS audio file through the 6-stage chain.
 * @param {string} inputPath - Raw TTS audio file
 * @param {string} outputPath - Processed output path
 * @returns {boolean} Success
 */
export function processTTS(inputPath, outputPath) {
  const cmd = `ffmpeg -y -i "${inputPath}" -af "${TTS_FILTER_CHAIN}" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`❌ TTS processing failed:`, e.message?.slice(-200));
    return false;
  }
}

/**
 * Two-pass loudness normalization to YouTube-optimal -14 LUFS.
 * @param {string} inputPath - Audio to normalize
 * @param {string} outputPath - Normalized output
 * @returns {boolean} Success
 */
export function normalizeLoudness(inputPath, outputPath) {
  try {
    // Pass 1: Measure
    const measureCmd = `ffmpeg -y -i "${inputPath}" -af "loudnorm=I=${AUDIO.TARGET_LUFS}:TP=${AUDIO.TRUE_PEAK_MAX}:LRA=${AUDIO.LRA_TARGET}:print_format=json" -f null /dev/null`;
    const measureOutput = execSync(measureCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 60000 });

    // Parse measured values from stderr
    const stderr = measureOutput;
    const jsonMatch = stderr.match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);

    if (!jsonMatch) {
      // Fallback: single-pass normalization
      const fallbackCmd = `ffmpeg -y -i "${inputPath}" -af "loudnorm=I=${AUDIO.TARGET_LUFS}:TP=${AUDIO.TRUE_PEAK_MAX}:LRA=${AUDIO.LRA_TARGET}" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      execSync(fallbackCmd, { stdio: 'pipe', timeout: 60000 });
      return true;
    }

    const measured = JSON.parse(jsonMatch[0]);

    // Pass 2: Apply linear normalization
    const applyCmd = `ffmpeg -y -i "${inputPath}" -af "loudnorm=I=${AUDIO.TARGET_LUFS}:TP=${AUDIO.TRUE_PEAK_MAX}:LRA=${AUDIO.LRA_TARGET}:measured_I=${measured.input_i}:measured_LRA=${measured.input_lra}:measured_TP=${measured.input_tp}:measured_thresh=${measured.input_thresh}:linear=true" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
    execSync(applyCmd, { stdio: 'pipe', timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`❌ Loudness normalization failed:`, e.message?.slice(-300));
    // Fallback: single-pass
    try {
      const fallbackCmd = `ffmpeg -y -i "${inputPath}" -af "loudnorm=I=${AUDIO.TARGET_LUFS}:TP=${AUDIO.TRUE_PEAK_MAX}:LRA=${AUDIO.LRA_TARGET}" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
      execSync(fallbackCmd, { stdio: 'pipe', timeout: 60000 });
      return true;
    } catch (e2) {
      console.error(`❌ Fallback normalization also failed`);
      return false;
    }
  }
}

/**
 * Mix narration with background music using sidechain ducking.
 * @param {string} narrationPath - Processed narration audio
 * @param {string} musicPath - Background music file
 * @param {string} outputPath - Mixed output
 * @param {number} totalDurationS - Target duration in seconds
 * @returns {boolean} Success
 */
export function mixWithMusic(narrationPath, musicPath, outputPath, totalDurationS) {
  // Loop music to match duration, apply fade in/out
  const fadeOutStart = Math.max(0, totalDurationS - 3);
  const cmd = `ffmpeg -y -i "${narrationPath}" -stream_loop -1 -i "${musicPath}" -filter_complex \
"[1:a]atrim=0:${totalDurationS},afade=t=in:d=3,afade=t=out:st=${fadeOutStart}:d=3,volume=${AUDIO.MUSIC_BASE_DB}dB[music];\
[0:a]asplit=2[voice][voicekey];\
[voicekey]aformat=channel_layouts=mono[key];\
[music][key]sidechaincompress=threshold=${AUDIO.MUSIC_DUCK_THRESHOLD}dB:ratio=${AUDIO.MUSIC_DUCK_RATIO}:attack=${AUDIO.MUSIC_DUCK_ATTACK}:release=${AUDIO.MUSIC_DUCK_RELEASE}:level_sc=1:mix=${AUDIO.MUSIC_DUCK_MIX}[ducked];\
[voice][ducked]amix=inputs=2:duration=first:dropout_transition=3" \
-ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 120000 });
    return true;
  } catch (e) {
    console.error(`❌ Music mix failed:`, e.message?.slice(-300));
    return false;
  }
}

/**
 * Place SFX at specific timestamps using adelay.
 * @param {Array<{path: string, timestampMs: number, volumeDb: number}>} sfxEvents
 * @param {number} totalDurationS
 * @param {string} outputPath
 * @returns {boolean} Success
 */
export function buildSFXTrack(sfxEvents, totalDurationS, outputPath) {
  if (!sfxEvents || sfxEvents.length === 0) {
    // Generate silent track
    const cmd = `ffmpeg -y -f lavfi -i "anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=stereo" -t ${totalDurationS} -c:a pcm_s16le "${outputPath}"`;
    execSync(cmd, { stdio: 'pipe', timeout: 30000 });
    return true;
  }

  const inputs = [`-f lavfi -i "anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=stereo"`];
  const filters = [];
  let idx = 1;

  for (const evt of sfxEvents) {
    if (!existsSync(evt.path)) continue;
    inputs.push(`-i "${evt.path}"`);
    const vol = evt.volumeDb || -12;
    filters.push(`[${idx}:a]volume=${vol}dB,adelay=${evt.timestampMs}|${evt.timestampMs}[s${idx}]`);
    idx++;
  }

  if (idx === 1) {
    // No valid SFX files
    const cmd = `ffmpeg -y -f lavfi -i "anullsrc=r=${AUDIO.SAMPLE_RATE}:cl=stereo" -t ${totalDurationS} -c:a pcm_s16le "${outputPath}"`;
    execSync(cmd, { stdio: 'pipe', timeout: 30000 });
    return true;
  }

  const silenceFilter = `[0:a]atrim=0:${totalDurationS}[silence]`;
  const mixInputs = ['[silence]', ...Array.from({ length: idx - 1 }, (_, i) => `[s${i + 1}]`)].join('');
  const mixFilter = `${mixInputs}amix=inputs=${idx}:duration=first:dropout_transition=0`;

  const cmd = `ffmpeg -y ${inputs.join(' ')} -filter_complex "${silenceFilter};${filters.join(';')};${mixFilter}" -t ${totalDurationS} -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 60000 });
    return true;
  } catch (e) {
    console.error(`❌ SFX track build failed:`, e.message?.slice(-300));
    return false;
  }
}

/**
 * Final merge: video + processed audio with correct stream mapping.
 * @param {string} videoPath - Remotion-rendered video (may have silent audio)
 * @param {string} audioPath - Master audio (narration + music + SFX, normalized)
 * @param {string} outputPath - Final video
 * @returns {boolean} Success
 */
export function mergeVideoAudio(videoPath, audioPath, outputPath) {
  const cmd = `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "${outputPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 120000 });
    return true;
  } catch (e) {
    console.error(`❌ Video-audio merge failed:`, e.message?.slice(-200));
    return false;
  }
}

/**
 * Verify audio loudness compliance.
 * @param {string} filePath - Audio or video file
 * @returns {{ lufs: number, truePeak: number, lra: number, pass: boolean }}
 */
export function verifyLoudness(filePath) {
  try {
    const cmd = `ffmpeg -i "${filePath}" -af "ebur128=peak=true" -f null /dev/null`;
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 60000 });

    const lufsMatch = output.match(/I:\s+(-[\d.]+)\s+LUFS/);
    const tpMatch = output.match(/Peak:\s+(-[\d.]+)\s+dBFS/);
    const lraMatch = output.match(/LRA:\s+([\d.]+)\s+LU/);

    const lufs = lufsMatch ? parseFloat(lufsMatch[1]) : null;
    const truePeak = tpMatch ? parseFloat(tpMatch[1]) : null;
    const lra = lraMatch ? parseFloat(lraMatch[1]) : null;

    const pass = lufs !== null &&
      Math.abs(lufs - AUDIO.TARGET_LUFS) <= 1.0 &&
      (truePeak === null || truePeak <= AUDIO.TRUE_PEAK_MAX);

    return { lufs, truePeak, lra, pass };
  } catch (e) {
    return { lufs: null, truePeak: null, lra: null, pass: false };
  }
}

/**
 * Get audio volume stats (mean + peak dB).
 */
/**
 * Target WPM by section context (Divine Plan v2 System 6).
 * intro/hook: 170 WPM (energy), concept_new: 125 WPM (slow for comprehension),
 * concept_familiar: 155 WPM, example: 140 WPM, recap: 165 WPM.
 */
export const WPM_TARGETS = {
  hook:     170,
  concept:  130,
  standard: 145,
  example:  140,
  recap:    165,
};

/**
 * Auto-correct audio speed to hit target WPM range.
 * Uses FFmpeg atempo filter. Returns new duration_s.
 * @param {string} inputPath - Audio file
 * @param {string} outputPath - Speed-adjusted output
 * @param {number} currentWPM - Measured WPM
 * @param {number} targetWPM - Desired WPM (default 145)
 * @returns {{ success: boolean, newDuration: number, atempo: number }}
 */
export function correctWPM(inputPath, outputPath, currentWPM, targetWPM = 145) {
  // Only correct if outside 130-165 range
  if (currentWPM >= 130 && currentWPM <= 165) {
    return { success: false, newDuration: 0, atempo: 1.0 };
  }

  // Calculate tempo adjustment: faster WPM = slow down (atempo < 1)
  let atempo = currentWPM / targetWPM;

  // Clamp to safe range (0.5 - 2.0 per FFmpeg atempo limits)
  atempo = Math.max(0.5, Math.min(2.0, atempo));

  // Only apply if meaningful change (>3%)
  if (Math.abs(atempo - 1.0) < 0.03) {
    return { success: false, newDuration: 0, atempo: 1.0 };
  }

  try {
    const cmd = `ffmpeg -y -i "${inputPath}" -af "atempo=${atempo.toFixed(4)}" -ar ${AUDIO.SAMPLE_RATE} "${outputPath}"`;
    execSync(cmd, { stdio: 'pipe', timeout: 60000 });

    // Get new duration
    const probe = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${outputPath}"`, { encoding: 'utf-8' }).trim();
    const newDuration = parseFloat(probe) || 0;

    return { success: true, newDuration, atempo };
  } catch (e) {
    console.error(`❌ WPM correction failed:`, e.message?.slice(-200));
    return { success: false, newDuration: 0, atempo };
  }
}

/**
 * Get audio volume stats (mean + peak dB).
 */
export function getVolumeStats(filePath) {
  try {
    const output = execSync(
      `ffmpeg -i "${filePath}" -af "volumedetect" -f null /dev/null`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 }
    );
    const meanMatch = output.match(/mean_volume:\s+(-[\d.]+)\s+dB/);
    const maxMatch = output.match(/max_volume:\s+(-[\d.]+)\s+dB/);
    return {
      meanDb: meanMatch ? parseFloat(meanMatch[1]) : null,
      peakDb: maxMatch ? parseFloat(maxMatch[1]) : null,
    };
  } catch {
    return { meanDb: null, peakDb: null };
  }
}
