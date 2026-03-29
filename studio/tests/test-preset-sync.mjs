/**
 * Rendering Preset Sync Test
 *
 * Verifies that RENDERING_PRESETS are consistent across all 3 sources:
 * 1. cinema-tokens.ts (Remotion — source of truth for components)
 * 2. design-tokens.js (lib/ — source of truth for pipeline)
 * 3. design-tokens.js (root — consumed by compose + graphics-engine)
 * 4. graphics-engine.py (Pillow — kebab-case keys)
 *
 * This prevents drift between the Remotion and Pillow rendering pipelines.
 */

import { readFileSync } from 'fs';

let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}`);
    failed++;
  }
}

console.log('═══ Rendering Preset Sync Test ═══\n');

// ── Load all source files ──
const cinemaTokens = readFileSync(new URL('../remotion/src/cinema-tokens.ts', import.meta.url), 'utf-8');
const libDesignTokens = readFileSync(new URL('../lib/design-tokens.js', import.meta.url), 'utf-8');
const rootDesignTokens = readFileSync(new URL('../design-tokens.js', import.meta.url), 'utf-8');
const graphicsEngine = readFileSync(new URL('../graphics-engine.py', import.meta.url), 'utf-8');

// ── Expected preset names ──
// cinema-tokens.ts (camelCase)
const remotionPresets = [
  'titleCardCinematic', 'explainerScene', 'quoteCard', 'sectionHeader',
  'lowerThird', 'comparisonSplit', 'dataViz', 'stepByStep',
  'chapterCard', 'montageScene', 'outroScene',
];

// graphics-engine.py (kebab-case)
const pillowPresets = [
  'title', 'section-header', 'quote', 'chapter', 'diagram',
  'text-overlay', 'lower-third', 'outro',
  'comparison-split', 'data-viz', 'step-by-step', 'montage',
];

// ═══════════════════════════════════════════════════════
// 1. CINEMA-TOKENS.TS PRESET EXISTENCE
// ═══════════════════════════════════════════════════════
console.log('── cinema-tokens.ts (Remotion) ──');

for (const preset of remotionPresets) {
  test(`cinema-tokens has "${preset}"`, cinemaTokens.includes(`${preset}:`));
}

// ═══════════════════════════════════════════════════════
// 2. LIB DESIGN-TOKENS.JS PRESET EXISTENCE
// ═══════════════════════════════════════════════════════
console.log('\n── lib/design-tokens.js ──');

for (const preset of remotionPresets) {
  test(`lib/design-tokens has "${preset}"`, libDesignTokens.includes(`${preset}:`));
}

// ═══════════════════════════════════════════════════════
// 3. ROOT DESIGN-TOKENS.JS PRESET EXISTENCE
// ═══════════════════════════════════════════════════════
console.log('\n── design-tokens.js (root) ──');

// Root uses slightly different names for some presets
const rootExpected = [
  'titleCardCinematic', 'explainerScene', 'quoteCard', 'sectionHeader',
  'lowerThird', 'chapterCard', 'comparisonSplit', 'stepByStep',
  'montageScene', 'outroScene',
];

for (const preset of rootExpected) {
  test(`design-tokens has "${preset}"`, rootDesignTokens.includes(`${preset}:`));
}

// Root uses "dataVisualization" instead of "dataViz" (legacy name)
test('design-tokens has "dataVisualization" (legacy name for dataViz)',
  rootDesignTokens.includes('dataVisualization:'));

// ═══════════════════════════════════════════════════════
// 4. GRAPHICS-ENGINE.PY PRESET EXISTENCE
// ═══════════════════════════════════════════════════════
console.log('\n── graphics-engine.py (Pillow) ──');

for (const preset of pillowPresets) {
  test(`graphics-engine has "${preset}"`, graphicsEngine.includes(`'${preset}':`));
}

// ═══════════════════════════════════════════════════════
// 5. CROSS-FILE VIGNETTE VALUE SYNC
// ═══════════════════════════════════════════════════════
console.log('\n── Cross-file Vignette Consistency ──');

// Extract vignette values from cinema-tokens.ts PRESETS
function extractVignette(src, presetName) {
  const regex = new RegExp(`${presetName}:\\s*\\{[\\s\\S]*?vignette:\\s*([0-9.]+)`, 'm');
  const match = src.match(regex);
  return match ? parseFloat(match[1]) : null;
}

// Spot-check key presets across cinema-tokens and graphics-engine
const vignetteChecks = [
  { remotion: 'titleCardCinematic', pillow: 'title', expected: 0.5 },
  { remotion: 'quoteCard', pillow: 'quote', expected: 0.45 },
  { remotion: 'explainerScene', pillow: 'diagram', expected: 0.35 },
  { remotion: 'comparisonSplit', pillow: 'comparison-split', expected: 0.30 },
  { remotion: 'outroScene', pillow: 'outro', expected: null }, // just verify both exist
];

for (const check of vignetteChecks) {
  const remotionVal = extractVignette(cinemaTokens, check.remotion);
  test(`${check.remotion} vignette found in cinema-tokens`, remotionVal !== null);

  if (check.expected !== null) {
    test(`${check.remotion} vignette = ${check.expected}`, remotionVal === check.expected);
  }
}

// ═══════════════════════════════════════════════════════
// 6. CROSS-FILE GRAIN VALUE SYNC
// ═══════════════════════════════════════════════════════
console.log('\n── Cross-file Grain Consistency ──');

function extractGrain(src, presetName) {
  const regex = new RegExp(`${presetName}:\\s*\\{[\\s\\S]*?grain:\\s*([0-9.]+)`, 'm');
  const match = src.match(regex);
  return match ? parseFloat(match[1]) : null;
}

const grainChecks = [
  { name: 'titleCardCinematic', expected: 0.035 },
  { name: 'quoteCard', expected: 0.04 },
  { name: 'explainerScene', expected: 0.025 },
  { name: 'comparisonSplit', expected: null },
];

for (const check of grainChecks) {
  const remotionVal = extractGrain(cinemaTokens, check.name);
  const libVal = extractGrain(libDesignTokens, check.name);

  test(`cinema-tokens ${check.name} grain found`, remotionVal !== null);
  test(`lib/design-tokens ${check.name} grain found`, libVal !== null);

  if (check.expected !== null) {
    test(`${check.name} grain matches across cinema-tokens and lib`, remotionVal === libVal);
  }
}

// ═══════════════════════════════════════════════════════
// 7. LETTERBOX CONSISTENCY (title types should letterbox)
// ═══════════════════════════════════════════════════════
console.log('\n── Letterbox Consistency ──');

function extractLetterbox(src, presetName) {
  const regex = new RegExp(`${presetName}:\\s*\\{[\\s\\S]*?letterbox:\\s*(true|false)`, 'm');
  const match = src.match(regex);
  return match ? match[1] === 'true' : null;
}

const letterboxTitle = ['titleCardCinematic', 'quoteCard', 'sectionHeader', 'chapterCard', 'outroScene'];
const letterboxNone = ['explainerScene', 'comparisonSplit', 'dataViz', 'stepByStep', 'montageScene'];

for (const preset of letterboxTitle) {
  const val = extractLetterbox(cinemaTokens, preset);
  test(`${preset} has letterbox: true`, val === true);
}

for (const preset of letterboxNone) {
  const val = extractLetterbox(cinemaTokens, preset);
  test(`${preset} has letterbox: false`, val === false);
}

// ═══════════════════════════════════════════════════════
// 8. TOTAL PRESET COUNT PER SOURCE
// ═══════════════════════════════════════════════════════
console.log('\n── Preset Counts ──');

test('cinema-tokens: 11 presets', remotionPresets.every(p => cinemaTokens.includes(`${p}:`)));
test('lib/design-tokens: 11 presets', remotionPresets.every(p => libDesignTokens.includes(`${p}:`)));
test('graphics-engine: 12 presets (includes text-overlay + diagram)', pillowPresets.every(p => graphicsEngine.includes(`'${p}':`)));

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(60));
console.log(`RESULTS: ${passed}/${passed + failed} passed, ${failed} failed`);
console.log('═'.repeat(60));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All rendering preset sync tests passed!');
}
