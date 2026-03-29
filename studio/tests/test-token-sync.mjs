/**
 * Token Sync Validation Test
 * Ensures cinema-tokens.ts BEAT_STYLES timing matches editing-engine.js V3 values.
 * Prevents timing drift between Remotion components and the compose pipeline.
 */

// ── V3 Source of Truth (from editing-engine.js) ──
const EDITING_ENGINE_BEAT_PAUSE = {
  hook:    1.0,
  setup:   0.7,
  core:    0.6,
  breathe: 1.8,
  deepen:  0.8,
  peak:    2.3,
  close:   1.8,
};

const EDITING_ENGINE_HEAD_PAD = {
  hook:    0.20,
  setup:   0.30,
  core:    0.25,
  breathe: 0.50,
  deepen:  0.35,
  peak:    0.70,
  close:   0.50,
};

// ── V3 Colors (from design-tokens.js) ──
const REQUIRED_COLORS = [
  'void', 'chalk', 'smoke', 'ash',
  'signal', 'process', 'result', 'alert', 'insight', 'focus',
  'bone', 'obsidian', 'blush', 'gold',
];

// ── Required Rendering Presets (from design-tokens.js) ──
const REQUIRED_PRESETS = [
  'titleCardCinematic', 'explainerScene', 'quoteCard',
  'sectionHeader', 'lowerThird', 'chapterCard',
  'montageScene', 'outroScene',
];

// ── Parse cinema-tokens.ts ──
import { readFileSync } from 'fs';
const cinemaTokensSrc = readFileSync(
  new URL('../remotion/src/cinema-tokens.ts', import.meta.url),
  'utf-8'
);

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

console.log('═══ Token Sync Validation ═══\n');

// ── Test 1: BEAT_STYLES timing matches V3 editing-engine.js ──
console.log('── Beat Timing Sync ──');

for (const beat of Object.keys(EDITING_ENGINE_BEAT_PAUSE)) {
  // Extract headPad for this beat from cinema-tokens.ts
  const beatLineRe = new RegExp(`${beat}:.*headPad:\\s*([\\d.]+).*tailPause:\\s*([\\d.]+)`);
  const match = cinemaTokensSrc.match(beatLineRe);

  if (!match) {
    test(`${beat}: found in cinema-tokens`, false);
    continue;
  }

  const headPad = parseFloat(match[1]);
  const tailPause = parseFloat(match[2]);
  const expectedHead = EDITING_ENGINE_HEAD_PAD[beat];
  const expectedTail = EDITING_ENGINE_BEAT_PAUSE[beat];

  test(`${beat}: headPad=${headPad} == ${expectedHead}`, Math.abs(headPad - expectedHead) < 0.001);
  test(`${beat}: tailPause=${tailPause} == ${expectedTail}`, Math.abs(tailPause - expectedTail) < 0.001);
}

// ── Test 2: Required colors present ──
console.log('\n── Color Completeness ──');
for (const color of REQUIRED_COLORS) {
  const hasColor = cinemaTokensSrc.includes(`${color}:`);
  test(`color: ${color}`, hasColor);
}

// ── Test 3: Colorblind-safe palette present ──
console.log('\n── Accessibility ──');
test('colorblind-safe palette exported', cinemaTokensSrc.includes('COLORBLIND_SAFE'));

// ── Test 4: Required rendering presets ──
console.log('\n── Rendering Presets ──');
for (const preset of REQUIRED_PRESETS) {
  const hasPreset = cinemaTokensSrc.includes(`${preset}:`);
  test(`preset: ${preset}`, hasPreset);
}

// ── Test 5: explainerScene uses title3 (not title2) ──
console.log('\n── Typography Consistency ──');
const explainerMatch = cinemaTokensSrc.match(/explainerScene[\s\S]*?heading:\s*"(\w+)"/);
test('explainerScene heading is title3', explainerMatch && explainerMatch[1] === 'title3');

// ── Test 6: SceneRenderer imports all required components ──
console.log('\n── Component Wiring ──');
const sceneRendererSrc = readFileSync(
  new URL('../remotion/src/components/SceneRenderer.tsx', import.meta.url),
  'utf-8'
);
const requiredComponents = [
  'CinematicTitle3D', 'QuoteCard', 'SectionHeader', 'ChapterCard',
  'ExplainerScene', 'LowerThird', 'ComparisonSplit', 'DataViz', 'StepByStep',
  'MontageScene', 'OutroScene',
];
for (const comp of requiredComponents) {
  test(`SceneRenderer imports ${comp}`, sceneRendererSrc.includes(`import { ${comp} }`));
}

// ── Test 7: ChapterCard component exists ──
import { existsSync } from 'fs';
const chapterCardPath = new URL('../remotion/src/components/ChapterCard.tsx', import.meta.url);
test('ChapterCard.tsx exists', existsSync(chapterCardPath));

// ── Summary ──
console.log('\n' + '='.repeat(50));
console.log(`RESULTS: ${passed}/${passed + failed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
