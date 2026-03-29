#!/usr/bin/env node
/**
 * Like One Studio — .cube LUT Generator
 *
 * Generates professional 3D lookup tables for cinema-grade color grading.
 * Each LUT is a 33x33x33 .cube file — the industry standard for film/broadcast.
 *
 * Color science approach:
 *   1. Lift/Gamma/Gain (shadows/midtones/highlights separation via luminance)
 *   2. S-curve contrast (filmic toe + shoulder)
 *   3. Selective color shifts (shadow/mid/highlight tinting)
 *   4. Saturation control per luminance zone
 *   5. Subtle halation/bloom analog (highlight desaturation)
 *
 * Each theme maps to a specific mood from the design-tokens COLOR_THEMES.
 *
 * Usage:
 *   node studio/lib/lut-generator.js              # Generate all LUTs
 *   node studio/lib/lut-generator.js --theme arri  # Generate one
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const LUT_SIZE = 33; // 33^3 = 35,937 entries — broadcast quality
const LUT_DIR = path.resolve(new URL('.', import.meta.url).pathname, '..', 'assets', 'luts');

// ── Color Math Utilities ──

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** sRGB → linear */
function toLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** linear → sRGB */
function toSRGB(c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** Luminance (BT.709) */
function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Hex → [r, g, b] normalized 0–1 */
function hexToRGB(hex) {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

/**
 * Filmic S-curve contrast.
 * toe = shadow compression, shoulder = highlight rolloff
 * Emulates the density response of motion picture film.
 *
 * V2: Softer curve inspired by McQueen x Rothko aesthetic —
 * blacks breathe (lifted toe), highlights roll gently (lower shoulder).
 * The result is elegant, never crushed or blown.
 */
function filmicCurve(x, contrast = 1.0, pivot = 0.435) {
  // Apply contrast around pivot point
  const adjusted = pivot + (x - pivot) * contrast;
  // V2: Lifted toe + gentle shoulder — Rothko color fields need room to breathe
  const toe = 0.06;    // Lifted black point (softer than V1's 0.04)
  const shoulder = 0.95; // Gentle rolloff (softer than V1's 0.97)

  if (adjusted <= 0) return toe;
  if (adjusted >= 1) return shoulder;

  // Hermite-style S-curve
  const t = adjusted;
  const s = t * t * (3 - 2 * t); // smoothstep
  return lerp(toe, shoulder, s);
}

/**
 * Zone-based color tinting.
 * Splits luminance into shadow/midtone/highlight zones with smooth transitions.
 */
function zoneTint(lum, shadowColor, midColor, highlightColor, strength = 1.0) {
  // Zone boundaries (0 = shadows, 0.5 = mids, 1.0 = highlights)
  const shadowEnd = 0.25;
  const midStart = 0.15;
  const midEnd = 0.65;
  const highlightStart = 0.55;

  let tint = [0, 0, 0];

  // Shadow zone
  if (lum < shadowEnd) {
    const w = 1 - clamp((lum - midStart) / (shadowEnd - midStart));
    tint = shadowColor.map((c, i) => tint[i] + c * w);
  }

  // Midtone zone
  if (lum > midStart && lum < midEnd) {
    const fadeIn = clamp((lum - midStart) / (shadowEnd - midStart));
    const fadeOut = 1 - clamp((lum - highlightStart) / (midEnd - highlightStart));
    const w = Math.min(fadeIn, fadeOut);
    tint = midColor.map((c, i) => tint[i] + c * w);
  }

  // Highlight zone
  if (lum > highlightStart) {
    const w = clamp((lum - highlightStart) / (1 - highlightStart));
    tint = highlightColor.map((c, i) => tint[i] + c * w);
  }

  return tint.map(t => t * strength);
}

/**
 * Saturation adjustment per luminance zone.
 * Film typically desaturates shadows and extreme highlights.
 */
function zoneSaturation(r, g, b, lum, shadowSat, midSat, highlightSat) {
  let sat;
  if (lum < 0.25) {
    sat = lerp(shadowSat, midSat, lum / 0.25);
  } else if (lum < 0.7) {
    sat = midSat;
  } else {
    sat = lerp(midSat, highlightSat, (lum - 0.7) / 0.3);
  }

  return [
    lerp(lum, r, sat),
    lerp(lum, g, sat),
    lerp(lum, b, sat),
  ];
}

// ── LUT Grade Definitions ──
// Each grade defines the complete color transformation pipeline.

const GRADES = {
  // ── Default cinema look: warm ARRI LogC-inspired film emulation ──
  'arri-film': {
    title: 'ARRI Film Look',
    description: 'Warm cinema-grade look inspired by ARRI Alexa. Lifted blacks, warm highlights, gentle contrast.',
    contrast: 1.15,
    // Shadow tint: warm brown (lifted, not crushed)
    shadowTint: hexToRGB('#1a1008'),
    shadowStrength: 0.35,
    // Midtone tint: neutral-warm
    midTint: hexToRGB('#f5e6d0'),
    midStrength: 0.06,
    // Highlight tint: warm peach (film halation)
    highlightTint: hexToRGB('#ffe8d6'),
    highlightStrength: 0.12,
    // Saturation: slightly desat shadows, boosted mids, soft highlights
    saturation: { shadow: 0.75, mid: 1.08, highlight: 0.85 },
    // Overall warmth shift
    tempShift: 0.02, // positive = warm
    // Gamma: slight lift
    gamma: 1.05,
  },

  // ── AI Foundations: Deep indigo + electric cyan (tech, deep) ──
  'ai-foundations': {
    title: 'AI Foundations — Deep Tech',
    description: 'Deep indigo shadows, electric cyan highlights. Technical, cerebral mood.',
    contrast: 1.20,
    shadowTint: hexToRGB('#1a0a3d'),
    shadowStrength: 0.40,
    midTint: hexToRGB('#2d1b69'),
    midStrength: 0.08,
    highlightTint: hexToRGB('#64d2ff'),
    highlightStrength: 0.15,
    saturation: { shadow: 0.60, mid: 1.05, highlight: 0.90 },
    tempShift: -0.03,
    gamma: 1.02,
  },

  // ── Prompt Writing: Warm amber + soft cream (creative, inviting) ──
  'prompt-writing': {
    title: 'Prompt Writing — Warm Creative',
    description: 'Amber warmth with cream highlights. Inviting, creative atmosphere.',
    contrast: 1.08,
    shadowTint: hexToRGB('#1a0e04'),
    shadowStrength: 0.30,
    midTint: hexToRGB('#d4a050'),
    midStrength: 0.10,
    highlightTint: hexToRGB('#fef3c7'),
    highlightStrength: 0.18,
    saturation: { shadow: 0.80, mid: 1.12, highlight: 0.88 },
    tempShift: 0.04,
    gamma: 1.08,
  },

  // ── Ethics & Safety: Forest green + warm gold (trust, gravitas) ──
  'ethics-safety': {
    title: 'Ethics & Safety — Trust',
    description: 'Forest green shadows with golden highlights. Gravitas and trustworthiness.',
    contrast: 1.12,
    shadowTint: hexToRGB('#041a0e'),
    shadowStrength: 0.35,
    midTint: hexToRGB('#2d6b4a'),
    midStrength: 0.07,
    highlightTint: hexToRGB('#d4a030'),
    highlightStrength: 0.14,
    saturation: { shadow: 0.70, mid: 1.00, highlight: 0.82 },
    tempShift: 0.01,
    gamma: 1.04,
  },

  // ── Creatives: Magenta + coral + peach (expression, energy) ──
  'creatives': {
    title: 'Creatives — Energy',
    description: 'Magenta midtones, coral highlights. Expressive, energetic mood.',
    contrast: 1.18,
    shadowTint: hexToRGB('#1a0815'),
    shadowStrength: 0.32,
    midTint: hexToRGB('#c44080'),
    midStrength: 0.10,
    highlightTint: hexToRGB('#ffb088'),
    highlightStrength: 0.16,
    saturation: { shadow: 0.75, mid: 1.15, highlight: 0.92 },
    tempShift: 0.02,
    gamma: 1.03,
  },

  // ── Business: Navy + silver + ice blue (professional, clean) ──
  'business': {
    title: 'Business — Professional',
    description: 'Navy shadows, silver midtones, ice blue highlights. Clean, professional.',
    contrast: 1.14,
    shadowTint: hexToRGB('#0a1525'),
    shadowStrength: 0.38,
    midTint: hexToRGB('#8899aa'),
    midStrength: 0.05,
    highlightTint: hexToRGB('#c8e0f8'),
    highlightStrength: 0.12,
    saturation: { shadow: 0.55, mid: 0.92, highlight: 0.80 },
    tempShift: -0.02,
    gamma: 1.01,
  },

  // ── Productivity: Teal + warm white (calm, focused) ──
  'productivity': {
    title: 'Productivity — Calm Focus',
    description: 'Teal undertones with warm whites. Calm, focused atmosphere.',
    contrast: 1.10,
    shadowTint: hexToRGB('#081a18'),
    shadowStrength: 0.30,
    midTint: hexToRGB('#1a8a7a'),
    midStrength: 0.06,
    highlightTint: hexToRGB('#f0f5f0'),
    highlightStrength: 0.10,
    saturation: { shadow: 0.70, mid: 1.02, highlight: 0.88 },
    tempShift: -0.01,
    gamma: 1.06,
  },

  // ── RAG & Vectors: Purple + neon blue (technical, modern) ──
  'rag-vectors': {
    title: 'RAG & Vectors — Neon Tech',
    description: 'Deep purple shadows, neon blue highlights. Technical, modern feel.',
    contrast: 1.22,
    shadowTint: hexToRGB('#150830'),
    shadowStrength: 0.42,
    midTint: hexToRGB('#5530b0'),
    midStrength: 0.08,
    highlightTint: hexToRGB('#60a0ff'),
    highlightStrength: 0.18,
    saturation: { shadow: 0.58, mid: 1.08, highlight: 0.85 },
    tempShift: -0.04,
    gamma: 1.00,
  },

  // ── Claude for Beginners: Soft purple + lavender (friendly, approachable) ──
  'claude-beginners': {
    title: 'Claude for Beginners — Friendly',
    description: 'Soft purple with lavender highlights. Approachable, friendly mood.',
    contrast: 1.06,
    shadowTint: hexToRGB('#120a20'),
    shadowStrength: 0.28,
    midTint: hexToRGB('#8060c0'),
    midStrength: 0.06,
    highlightTint: hexToRGB('#ddd6fe'),
    highlightStrength: 0.14,
    saturation: { shadow: 0.78, mid: 1.06, highlight: 0.90 },
    tempShift: 0.00,
    gamma: 1.07,
  },
};

// ── Core LUT Generation ──

/**
 * Apply a grade definition to an RGB triplet.
 * All operations in linear light, output converted to sRGB.
 */
function applyGrade(r, g, b, grade) {
  // 1. Convert to linear
  let lr = toLinear(r);
  let lg = toLinear(g);
  let lb = toLinear(b);

  // 2. Apply gamma adjustment
  if (grade.gamma !== 1.0) {
    const invGamma = 1.0 / grade.gamma;
    lr = Math.pow(lr, invGamma);
    lg = Math.pow(lg, invGamma);
    lb = Math.pow(lb, invGamma);
  }

  // 3. Temperature shift (warm = add to R, subtract from B)
  if (grade.tempShift) {
    lr += grade.tempShift * 0.5;
    lg += grade.tempShift * 0.15;
    lb -= grade.tempShift * 0.5;
  }

  // 4. Calculate luminance for zone operations
  const lum = luminance(lr, lg, lb);

  // 5. Zone-based saturation
  [lr, lg, lb] = zoneSaturation(
    lr, lg, lb, lum,
    grade.saturation.shadow,
    grade.saturation.mid,
    grade.saturation.highlight
  );

  // 6. Zone-based color tinting
  const tint = zoneTint(
    lum,
    grade.shadowTint.map(c => c * grade.shadowStrength),
    grade.midTint.map(c => c * grade.midStrength),
    grade.highlightTint.map(c => c * grade.highlightStrength),
    1.0
  );

  lr += tint[0];
  lg += tint[1];
  lb += tint[2];

  // 7. Filmic contrast curve (applied per channel for rich color)
  lr = filmicCurve(lr, grade.contrast);
  lg = filmicCurve(lg, grade.contrast);
  lb = filmicCurve(lb, grade.contrast);

  // 8. Convert back to sRGB
  lr = toSRGB(clamp(lr));
  lg = toSRGB(clamp(lg));
  lb = toSRGB(clamp(lb));

  return [clamp(lr), clamp(lg), clamp(lb)];
}

/**
 * Generate a .cube file for the given grade.
 * Format: Adobe .cube 3D LUT (compatible with FFmpeg lut3d, DaVinci Resolve, Premiere, etc.)
 */
function generateCube(gradeKey, grade) {
  const lines = [];

  lines.push(`TITLE "${grade.title}"`);
  lines.push(`# ${grade.description}`);
  lines.push(`# Generated by Like One Studio — cinema-grade pipeline`);
  lines.push(`# Color science: lift/gamma/gain + filmic S-curve + zone tinting`);
  lines.push('');
  lines.push(`LUT_3D_SIZE ${LUT_SIZE}`);
  lines.push('');
  lines.push('# Domain: standard 0-1 range');
  lines.push('DOMAIN_MIN 0.0 0.0 0.0');
  lines.push('DOMAIN_MAX 1.0 1.0 1.0');
  lines.push('');

  // Generate the 3D grid: R varies fastest, then G, then B
  for (let bi = 0; bi < LUT_SIZE; bi++) {
    for (let gi = 0; gi < LUT_SIZE; gi++) {
      for (let ri = 0; ri < LUT_SIZE; ri++) {
        const r = ri / (LUT_SIZE - 1);
        const g = gi / (LUT_SIZE - 1);
        const b = bi / (LUT_SIZE - 1);

        const [or, og, ob] = applyGrade(r, g, b, grade);

        // .cube format: 6 decimal places per channel
        lines.push(`${or.toFixed(6)} ${og.toFixed(6)} ${ob.toFixed(6)}`);
      }
    }
  }

  return lines.join('\n');
}

// ── Main ──

function main() {
  if (!existsSync(LUT_DIR)) {
    mkdirSync(LUT_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  const themeArg = args.find(a => a.startsWith('--theme='))?.split('=')[1]
    || (args.includes('--theme') ? args[args.indexOf('--theme') + 1] : null);

  const gradesToBuild = themeArg
    ? { [themeArg]: GRADES[themeArg] }
    : GRADES;

  if (themeArg && !GRADES[themeArg]) {
    console.error(`Unknown theme: ${themeArg}`);
    console.error(`Available: ${Object.keys(GRADES).join(', ')}`);
    process.exit(1);
  }

  console.log(`Generating ${Object.keys(gradesToBuild).length} .cube LUT files (${LUT_SIZE}x${LUT_SIZE}x${LUT_SIZE})...\n`);

  for (const [key, grade] of Object.entries(gradesToBuild)) {
    const start = Date.now();
    const cubeData = generateCube(key, grade);
    const filePath = path.join(LUT_DIR, `${key}.cube`);
    writeFileSync(filePath, cubeData);
    const elapsed = Date.now() - start;
    const sizeMB = (Buffer.byteLength(cubeData) / 1024 / 1024).toFixed(1);
    console.log(`  ${key}.cube — ${sizeMB} MB (${elapsed}ms) — ${grade.title}`);
  }

  console.log(`\nAll LUTs written to ${LUT_DIR}`);
}

main();
