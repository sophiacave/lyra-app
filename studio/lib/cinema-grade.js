#!/usr/bin/env node
/**
 * Like One Studio — Cinema Grade
 * Applies professional .cube 3D LUTs to rendered videos via FFmpeg's lut3d filter.
 *
 * Features:
 *   - Auto-selects LUT based on screenplay colorTheme
 *   - Falls back to ARRI Film Look for unthemed content
 *   - Adds subtle film grain + vignette in FFmpeg (optional)
 *   - Preserves audio stream untouched
 *   - Hardware-accelerated encoding via VideoToolbox on Apple Silicon
 *   - Updates brain_context with cinema_grade_applied status
 *
 * Usage (module):
 *   import { cinemaGrade } from './cinema-grade.js';
 *   const result = await cinemaGrade('output/lesson.mp4', { theme: 'ai-foundations' });
 *
 * Usage (CLI):
 *   node studio/lib/cinema-grade.js --input output/lesson.mp4 --theme ai-foundations
 *   node studio/lib/cinema-grade.js --input output/lesson.mp4 --config content/configs/what-is-a-neuron-v3.json
 *   node studio/lib/cinema-grade.js --input output/lesson.mp4  # auto: arri-film
 */
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import path from 'path';

// ── Constants ──
const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);
const LUT_DIR = path.resolve(STUDIO_DIR, '..', 'assets', 'luts');
const DEFAULT_LUT = 'arri-film';

// Map colorTheme values from configs/design-tokens to LUT filenames
const THEME_TO_LUT = {
  'ai-foundations':   'ai-foundations',
  'prompt-writing':   'prompt-writing',
  'ethics-safety':    'ethics-safety',
  'creatives':        'creatives',
  'business':         'business',
  'productivity':     'productivity',
  'rag-vectors':      'rag-vectors',
  'claude-beginners': 'claude-beginners',
};

// Supabase config (for brain_context updates)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tnsujchfrixxsdpodygu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ── Helpers ──

function resolveLutPath(theme) {
  const lutName = THEME_TO_LUT[theme] || theme || DEFAULT_LUT;
  const lutPath = path.join(LUT_DIR, `${lutName}.cube`);

  if (!existsSync(lutPath)) {
    console.warn(`  LUT not found: ${lutName}.cube — falling back to ${DEFAULT_LUT}`);
    return path.join(LUT_DIR, `${DEFAULT_LUT}.cube`);
  }

  return lutPath;
}

function getThemeFromConfig(configPath) {
  if (!configPath || !existsSync(configPath)) return null;
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return config.colorTheme || null;
  } catch {
    return null;
  }
}

/**
 * Build the FFmpeg filter chain for cinema grading.
 *
 * Pipeline:
 *   1. lut3d — Apply .cube LUT (primary color grade)
 *   2. (optional) Subtle film grain via noise filter
 *   3. (optional) Vignette for depth/focus
 */
function buildFilterChain(lutPath, options = {}) {
  const {
    grain = true,
    grainStrength = 6,    // Very subtle — just enough to add texture
    vignette = true,
    vignetteAngle = 0.4,  // PI/8 — gentle darkening at edges
  } = options;

  const filters = [];

  // Primary grade: 3D LUT application
  // interp=tetrahedral is the highest quality interpolation mode
  filters.push(`lut3d='${lutPath}':interp=tetrahedral`);

  // Subtle grain (filmic texture, not noise)
  if (grain) {
    // allf=t applies to all frames, c0 = luma only, temporal averaging for consistency
    filters.push(`noise=c0s=${grainStrength}:c0f=t+u`);
  }

  // Vignette (draws eye to center, adds depth)
  if (vignette) {
    filters.push(`vignette=angle=${vignetteAngle}`);
  }

  return filters.join(',');
}

/**
 * Apply cinema grade to a video file.
 *
 * @param {string} inputPath - Path to source MP4
 * @param {object} options
 * @param {string} [options.theme] - Color theme name (matches design-tokens)
 * @param {string} [options.configPath] - Path to screenplay config JSON (auto-extracts theme)
 * @param {string} [options.outputPath] - Output path (default: replaces input with _graded suffix)
 * @param {boolean} [options.replaceOriginal] - Replace input file with graded version
 * @param {boolean} [options.grain] - Add film grain (default: true)
 * @param {boolean} [options.vignette] - Add vignette (default: true)
 * @param {boolean} [options.hwaccel] - Use VideoToolbox encoding (default: true on macOS)
 * @param {string} [options.lessonKey] - Lesson key for brain_context update
 * @returns {object} { success, outputPath, lutUsed, duration, fileSize }
 */
export async function cinemaGrade(inputPath, options = {}) {
  const startTime = Date.now();

  // Validate input
  if (!existsSync(inputPath)) {
    return { success: false, error: `Input file not found: ${inputPath}` };
  }

  // Resolve theme
  let theme = options.theme;
  if (!theme && options.configPath) {
    theme = getThemeFromConfig(options.configPath);
  }

  const lutPath = resolveLutPath(theme);
  const lutName = path.basename(lutPath, '.cube');

  console.log(`  Cinema grade: ${lutName} → ${path.basename(inputPath)}`);

  // Build output path
  const ext = path.extname(inputPath);
  const base = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);
  const outputPath = options.outputPath || path.join(dir, `${base}_graded${ext}`);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Build filter chain
  const filterChain = buildFilterChain(lutPath, {
    grain: options.grain !== false,
    grainStrength: options.grainStrength || 6,
    vignette: options.vignette !== false,
    vignetteAngle: options.vignetteAngle || 0.4,
  });

  // Detect platform for hardware acceleration
  const isMac = process.platform === 'darwin';
  const useHwaccel = options.hwaccel !== false && isMac;

  // Build FFmpeg command
  // -map 0 preserves all streams (video + audio)
  // Video gets re-encoded through the filter chain
  // Audio is copied untouched
  const encoderArgs = useHwaccel
    ? '-c:v h264_videotoolbox -b:v 8M -profile:v high -allow_sw 1'  // HW encode, 8Mbps, fallback to SW
    : '-c:v libx264 -crf 18 -preset slow -profile:v high';          // SW encode, high quality

  const cmd = [
    'ffmpeg -y -hide_banner -loglevel warning',
    `-i "${inputPath}"`,
    `-vf "${filterChain}"`,
    encoderArgs,
    '-c:a copy',                    // Passthrough audio
    '-movflags +faststart',         // Web-optimized MP4
    '-color_primaries bt709',       // Standard color space tags
    '-color_trc bt709',
    '-colorspace bt709',
    `"${outputPath}"`,
  ].join(' ');

  try {
    execSync(cmd, {
      stdio: 'pipe',
      timeout: 300000, // 5 min timeout
      cwd: path.resolve(STUDIO_DIR, '..', '..'),
    });
  } catch (err) {
    const stderr = err.stderr?.toString() || '';
    console.error(`  Cinema grade FAILED: ${stderr.slice(0, 200)}`);

    // If VideoToolbox failed, retry with software encoder
    if (useHwaccel && stderr.includes('videotoolbox')) {
      console.log('  Retrying with software encoder...');
      const swCmd = cmd
        .replace('h264_videotoolbox -b:v 8M -profile:v high -allow_sw 1',
                 'libx264 -crf 18 -preset slow -profile:v high');
      try {
        execSync(swCmd, { stdio: 'pipe', timeout: 300000 });
      } catch (swErr) {
        return {
          success: false,
          error: `Software encode also failed: ${swErr.stderr?.toString().slice(0, 200)}`,
        };
      }
    } else {
      return { success: false, error: stderr.slice(0, 500) };
    }
  }

  // Verify output
  if (!existsSync(outputPath)) {
    return { success: false, error: 'Output file not created' };
  }

  const outputStat = statSync(outputPath);
  if (outputStat.size < 10_000) {
    return { success: false, error: `Output too small (${outputStat.size} bytes) — likely corrupt` };
  }

  // Replace original if requested
  if (options.replaceOriginal) {
    const backupPath = path.join(dir, `${base}_pre-grade${ext}`);
    renameSync(inputPath, backupPath);
    renameSync(outputPath, inputPath);
    console.log(`  Replaced original (backup: ${path.basename(backupPath)})`);
  }

  const elapsed = Date.now() - startTime;
  const fileSizeMB = (outputStat.size / 1024 / 1024).toFixed(1);
  const finalPath = options.replaceOriginal ? inputPath : outputPath;

  console.log(`  Done: ${fileSizeMB} MB in ${(elapsed / 1000).toFixed(1)}s — ${lutName}`);

  // Update brain_context if credentials available
  if (SUPABASE_KEY && options.lessonKey) {
    try {
      await updateBrainContext(options.lessonKey, lutName, elapsed);
    } catch (e) {
      // Non-fatal — grading succeeded
      console.warn(`  Brain update skipped: ${e.message}`);
    }
  }

  return {
    success: true,
    outputPath: finalPath,
    lutUsed: lutName,
    duration: elapsed,
    fileSize: outputStat.size,
    fileSizeMB: parseFloat(fileSizeMB),
  };
}

/**
 * Batch grade all MP4s in a directory.
 */
export async function batchGrade(dir, options = {}) {
  const files = readdirSync(dir)
    .filter(f => f.endsWith('.mp4') && !f.includes('_graded') && !f.includes('_pre-grade'))
    .sort();

  if (files.length === 0) {
    console.log('  No MP4 files to grade.');
    return [];
  }

  console.log(`\nBatch grading ${files.length} videos...\n`);
  const results = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const result = await cinemaGrade(filePath, options);
    results.push({ file, ...result });
  }

  const passed = results.filter(r => r.success).length;
  console.log(`\nBatch complete: ${passed}/${results.length} graded successfully`);

  return results;
}

/**
 * Update brain_context with grading status.
 */
async function updateBrainContext(lessonKey, lutName, elapsed) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/brain_context?key=eq.studio.quality_scores`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) return;

  const rows = await response.json();
  const current = rows[0]?.value || {};
  const lessons = current.lessons || {};

  lessons[lessonKey] = {
    ...(lessons[lessonKey] || {}),
    cinema_grade_applied: lutName,
    cinema_grade_timestamp: new Date().toISOString(),
    cinema_grade_elapsed_ms: elapsed,
  };

  await fetch(`${SUPABASE_URL}/rest/v1/brain_context?key=eq.studio.quality_scores`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ value: { ...current, lessons } }),
  });
}

/**
 * List available LUTs and their descriptions.
 */
export function listGrades() {
  const files = readdirSync(LUT_DIR).filter(f => f.endsWith('.cube')).sort();

  console.log(`\nAvailable cinema grades (${files.length} LUTs):\n`);
  for (const file of files) {
    const name = path.basename(file, '.cube');
    const firstLine = readFileSync(path.join(LUT_DIR, file), 'utf-8')
      .split('\n')
      .find(l => l.startsWith('TITLE'));
    const title = firstLine ? firstLine.replace(/TITLE\s*"?|"$/g, '') : name;
    const isDefault = name === DEFAULT_LUT ? ' (default)' : '';
    console.log(`  ${name}${isDefault}`);
    console.log(`    ${title}`);
  }
}

// ── CLI ──

async function cli() {
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.includes('-l')) {
    const files = readdirSync(LUT_DIR).filter(f => f.endsWith('.cube')).sort();
    console.log(`\nAvailable cinema grades (${files.length} LUTs):\n`);
    for (const file of files) {
      const name = path.basename(file, '.cube');
      const content = readFileSync(path.join(LUT_DIR, file), 'utf-8');
      const titleLine = content.split('\n').find(l => l.startsWith('TITLE'));
      const descLine = content.split('\n').find(l => l.startsWith('# ') && !l.includes('Generated') && !l.includes('Color science'));
      const title = titleLine ? titleLine.replace(/TITLE\s*"?|"$/g, '') : name;
      const desc = descLine ? descLine.replace('# ', '') : '';
      const isDefault = name === DEFAULT_LUT ? ' *' : '';
      console.log(`  ${name}${isDefault}`);
      if (desc) console.log(`    ${desc}`);
    }
    console.log(`\n  * = default`);
    return;
  }

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
  };

  const inputPath = getArg('--input') || getArg('-i');
  const theme = getArg('--theme') || getArg('-t');
  const configPath = getArg('--config') || getArg('-c');
  const outputPath = getArg('--output') || getArg('-o');
  const batchDir = getArg('--batch') || getArg('-b');
  const lessonKey = getArg('--lesson');
  const replace = args.includes('--replace');
  const noGrain = args.includes('--no-grain');
  const noVignette = args.includes('--no-vignette');

  if (batchDir) {
    await batchGrade(batchDir, {
      theme,
      grain: !noGrain,
      vignette: !noVignette,
      replaceOriginal: replace,
    });
    return;
  }

  if (!inputPath) {
    console.log(`
Like One Studio — Cinema Grade

Usage:
  node studio/lib/cinema-grade.js --input <file.mp4> [options]
  node studio/lib/cinema-grade.js --batch <directory> [options]
  node studio/lib/cinema-grade.js --list

Options:
  --input, -i     Input MP4 file
  --output, -o    Output path (default: <input>_graded.mp4)
  --theme, -t     LUT theme name (e.g., ai-foundations)
  --config, -c    Screenplay config JSON (auto-detects theme)
  --batch, -b     Grade all MP4s in directory
  --lesson        Lesson key for brain_context tracking
  --replace       Replace original (keeps _pre-grade backup)
  --no-grain      Skip film grain
  --no-vignette   Skip vignette
  --list, -l      List available grades
`);
    return;
  }

  const result = await cinemaGrade(inputPath, {
    theme,
    configPath,
    outputPath,
    lessonKey,
    replaceOriginal: replace,
    grain: !noGrain,
    vignette: !noVignette,
  });

  if (!result.success) {
    console.error(`\nFailed: ${result.error}`);
    process.exit(1);
  }

  console.log(`\nCinema grade complete: ${result.outputPath}`);
}

// Run CLI if executed directly
const isMain = process.argv[1] && (
  process.argv[1].endsWith('cinema-grade.js') ||
  process.argv[1].includes('cinema-grade')
);

if (isMain) {
  cli().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
  });
}
