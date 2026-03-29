/**
 * Remotion Component Validation Test Suite
 *
 * Validates:
 * 1. Root.tsx registers all expected compositions
 * 2. SceneRenderer routes all scene type/beat/ID combos correctly
 * 3. LikeOneVideo uses cinema-tokens.ts (no hardcoded colors)
 * 4. All component files exist and export correctly
 * 5. Design token consistency across the component tree
 * 6. TypeScript compilation passes clean
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const remotionDir = resolve(__dirname, '../remotion/src');
const componentsDir = resolve(remotionDir, 'components');

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

function readSrc(relPath) {
  return readFileSync(resolve(remotionDir, relPath), 'utf-8');
}

console.log('═══ Remotion Component Validation Suite ═══\n');

// ════════════════════════════════════════════════════
// 1. ROOT.TSX — COMPOSITION REGISTRATION
// ════════════════════════════════════════════════════
console.log('── Root.tsx Composition Registration ──');

const rootSrc = readSrc('Root.tsx');

const expectedCompositions = [
  'LikeOneVideo',
  'LikeOnePreview',
  'CinematicTitle',   // Composition ID (not component name)
  'QuoteCard',
  'SectionHeader',
  'ExplainerScene',
  'LowerThird',
  'ComparisonSplit',
  'DataViz',
  'StepByStep',
  'ChapterCard',
  'MontageScene',
  'OutroScene',
];

for (const comp of expectedCompositions) {
  test(`Root registers "${comp}" composition`, rootSrc.includes(`id="${comp}"`));
}

const expectedImports = [
  'LikeOneVideo',
  'CinematicTitle3D',
  'QuoteCard',
  'SectionHeader',
  'ExplainerScene',
  'LowerThird',
  'ComparisonSplit',
  'DataViz',
  'StepByStep',
  'ChapterCard',
  'MontageScene',
  'OutroScene',
];

for (const imp of expectedImports) {
  test(`Root imports ${imp}`, rootSrc.includes(imp));
}

// ════════════════════════════════════════════════════
// 2. COMPONENT FILES EXIST
// ════════════════════════════════════════════════════
console.log('\n── Component File Existence ──');

const expectedFiles = [
  'CinematicTitle3D.tsx',
  'ComparisonSplit.tsx',
  'DataViz.tsx',
  'ExplainerScene.tsx',
  'KineticText.tsx',
  'LivingFrame.tsx',
  'LowerThird.tsx',
  'QuoteCard.tsx',
  'SceneRenderer.tsx',
  'SectionHeader.tsx',
  'StepByStep.tsx',
  'WhipPan.tsx',
  'ChapterCard.tsx',
  'MontageScene.tsx',
  'OutroScene.tsx',
];

for (const file of expectedFiles) {
  test(`${file} exists`, existsSync(resolve(componentsDir, file)));
}

// ════════════════════════════════════════════════════
// 3. SCENE RENDERER — ROUTING CORRECTNESS
// ════════════════════════════════════════════════════
console.log('\n── SceneRenderer Routing Logic ──');

const sceneRendererSrc = readSrc('components/SceneRenderer.tsx');

// Verify imports for all routable components
const routedComponents = [
  'LivingFrame', 'KineticText', 'CinematicTitle3D',
  'QuoteCard', 'SectionHeader', 'ExplainerScene', 'LowerThird',
  'ComparisonSplit', 'DataViz', 'StepByStep', 'ChapterCard',
  'MontageScene', 'OutroScene',
];

for (const comp of routedComponents) {
  test(`SceneRenderer imports ${comp}`, sceneRendererSrc.includes(`{ ${comp} }`));
}

// Verify scene type handlers exist
test('handles broll type', sceneRendererSrc.includes('scene.type === "broll"'));
test('handles diagram type', sceneRendererSrc.includes('scene.type === "diagram"'));
test('handles title type', sceneRendererSrc.includes('scene.type === "title"'));
test('handles montage type', sceneRendererSrc.includes('scene.type === "montage"'));
test('handles outro type', sceneRendererSrc.includes('scene.type === "outro"'));
test('montage routes to MontageScene', sceneRendererSrc.includes('<MontageScene'));
test('outro routes to OutroScene', sceneRendererSrc.includes('<OutroScene'));
test('SceneData type union includes montage', sceneRendererSrc.includes('"montage"'));
test('SceneData type union includes outro', sceneRendererSrc.includes('"outro"'));

// Verify diagram subtype detection
test('diagram: comparison detection regex', /isComparison.*compar|vs|versus/.test(sceneRendererSrc));
test('diagram: data viz detection regex', /isDataViz.*data|chart|graph/.test(sceneRendererSrc));
test('diagram: step-by-step detection regex', /isStepByStep.*step|process|flow/.test(sceneRendererSrc));

// Verify title subtype routing
test('title: QuoteCard for breathe/close', sceneRendererSrc.includes('isQuote') && sceneRendererSrc.includes('breathe'));
test('title: ChapterCard for chapter IDs', sceneRendererSrc.includes('isChapter') && sceneRendererSrc.includes('ChapterCard'));
test('title: SectionHeader for section IDs', sceneRendererSrc.includes('isSection') && sceneRendererSrc.includes('SectionHeader'));
test('title: CinematicTitle3D fallback', sceneRendererSrc.includes('<CinematicTitle3D'));

// Verify cinema-tokens imports in SceneRenderer
test('SceneRenderer imports COLORS', sceneRendererSrc.includes('COLORS'));
test('SceneRenderer imports BEAT_STYLES', sceneRendererSrc.includes('BEAT_STYLES'));

// ════════════════════════════════════════════════════
// 4. LIKEONEVIDEO — CINEMA TOKENS INTEGRATION
// ════════════════════════════════════════════════════
console.log('\n── LikeOneVideo Token Integration ──');

const likeOneVideoSrc = readSrc('compositions/LikeOneVideo.tsx');

// Must import from cinema-tokens
test('imports COLORS from cinema-tokens', likeOneVideoSrc.includes('import') && likeOneVideoSrc.includes('COLORS') && likeOneVideoSrc.includes('cinema-tokens'));
test('imports FONTS from cinema-tokens', likeOneVideoSrc.includes('FONTS') && likeOneVideoSrc.includes('cinema-tokens'));

// Must NOT have hardcoded color values in designTokens
const hasHardcodedVoid = /designTokens\s*=\s*\{[\s\S]*?void:\s*['"]#0B0A10['"]/.test(likeOneVideoSrc);
test('no hardcoded colors in designTokens', !hasHardcodedVoid);

// Must reference COLORS for designTokens
test('designTokens uses COLORS import', likeOneVideoSrc.includes('colors: COLORS'));

// Font references should use FONTS constant
test('uses FONTS.display for font family', likeOneVideoSrc.includes('FONTS.display'));
const hasHardcodedFont = likeOneVideoSrc.includes('"Satoshi, General Sans');
test('no hardcoded font stacks', !hasHardcodedFont);

// Verify SceneRenderer usage
test('renders SceneRenderer for each scene', likeOneVideoSrc.includes('<SceneRenderer'));
test('passes designTokens to SceneRenderer', likeOneVideoSrc.includes('designTokens={designTokens}'));

// Verify audio layers
test('music layer with volume arc', likeOneVideoSrc.includes('musicPath') && likeOneVideoSrc.includes('music_level'));
test('ambience layer', likeOneVideoSrc.includes('ambiencePath'));

// ════════════════════════════════════════════════════
// 5. CINEMA-TOKENS COMPLETENESS
// ════════════════════════════════════════════════════
console.log('\n── Cinema Tokens Completeness ──');

const cinemaTokensSrc = readSrc('cinema-tokens.ts');

// Required exports
const requiredExports = [
  'COLORS', 'BEAT_ACCENTS', 'BEAT_STYLES', 'TYPE', 'FONTS',
  'SPRING', 'STAGGER', 'VIDEO', 'GRID', 'CINEMA_GRADE',
  'PRESETS', 'COURSE_THEMES', 'COLORBLIND_SAFE', 'TEXT_ANIMATIONS',
  'typeStyle', 'grainUrl', 'vignetteGradient',
];

for (const exp of requiredExports) {
  test(`exports ${exp}`, cinemaTokensSrc.includes(`export `) && cinemaTokensSrc.includes(exp));
}

// Required beats in BEAT_STYLES
const beats = ['hook', 'setup', 'core', 'breathe', 'deepen', 'peak', 'close'];
for (const beat of beats) {
  test(`BEAT_STYLES has "${beat}"`, cinemaTokensSrc.includes(`${beat}:`));
}

// Required rendering presets
const presets = [
  'titleCardCinematic', 'explainerScene', 'quoteCard',
  'sectionHeader', 'lowerThird', 'comparisonSplit',
  'dataViz', 'stepByStep', 'chapterCard',
  'montageScene', 'outroScene',
];
for (const preset of presets) {
  test(`PRESETS has "${preset}"`, cinemaTokensSrc.includes(`${preset}:`));
}

// ════════════════════════════════════════════════════
// 6. CROSS-COMPONENT COLOR CONSISTENCY
// ════════════════════════════════════════════════════
console.log('\n── Cross-Component Token Usage ──');

// Every component should import from cinema-tokens, not hardcode colors
const componentFiles = [
  'ComparisonSplit.tsx', 'DataViz.tsx', 'StepByStep.tsx',
  'ChapterCard.tsx', 'QuoteCard.tsx', 'SectionHeader.tsx',
  'ExplainerScene.tsx', 'CinematicTitle3D.tsx',
  'MontageScene.tsx', 'OutroScene.tsx',
];

for (const file of componentFiles) {
  const src = readFileSync(resolve(componentsDir, file), 'utf-8');
  const importsCinema = src.includes('cinema-tokens');
  test(`${file} imports from cinema-tokens`, importsCinema);
}

// ════════════════════════════════════════════════════
// 7. TYPESCRIPT COMPILATION
// ════════════════════════════════════════════════════
console.log('\n── TypeScript Compilation ──');

try {
  execSync('npx tsc --noEmit --project studio/remotion/tsconfig.json 2>&1', {
    cwd: resolve(__dirname, '../..'),
    stdio: 'pipe',
  });
  test('TypeScript compiles with zero errors', true);
} catch (err) {
  const stderr = err.stderr?.toString() || err.stdout?.toString() || 'unknown error';
  console.log(`  TypeScript errors:\n${stderr}`);
  test('TypeScript compiles with zero errors', false);
}

// ═══��════════════════════════════════════════════════
// 8. MONTAGE + OUTRO COMPONENT DEEP VALIDATION
// ═════════���══════════════════════════════════════════
console.log('\n── MontageScene Deep Validation ──');

const montageSrc = readFileSync(resolve(componentsDir, 'MontageScene.tsx'), 'utf-8');

test('MontageScene exports interface', montageSrc.includes('export interface MontageSceneProps'));
test('MontageScene uses BEAT_ACCENTS', montageSrc.includes('BEAT_ACCENTS'));
test('MontageScene uses SPRING config', montageSrc.includes('SPRING.'));
test('MontageScene uses FONTS', montageSrc.includes('FONTS.'));
test('MontageScene uses TYPE scale', montageSrc.includes('TYPE.'));
test('MontageScene has grainUrl', montageSrc.includes('grainUrl('));
test('MontageScene has vignetteGradient', montageSrc.includes('vignetteGradient('));
test('MontageScene has Ken Burns drift', montageSrc.includes('drift'));
test('MontageScene has shot counter', montageSrc.includes('padStart'));
test('MontageScene has progress bar', montageSrc.includes('progress'));
test('MontageScene has beat prop', montageSrc.includes('beat?:') || montageSrc.includes('beat ='));
test('MontageScene has fps prop', montageSrc.includes('fps?:') || montageSrc.includes('fps ='));
test('MontageScene default beat is core', montageSrc.includes('beat = "core"'));
test('MontageScene handles shot media', montageSrc.includes('MontageShot'));

console.log('\n── OutroScene Deep Validation ──');

const outroSrc = readFileSync(resolve(componentsDir, 'OutroScene.tsx'), 'utf-8');

test('OutroScene exports interface', outroSrc.includes('export interface OutroSceneProps'));
test('OutroScene uses BEAT_ACCENTS', outroSrc.includes('BEAT_ACCENTS'));
test('OutroScene uses SPRING config', outroSrc.includes('SPRING.'));
test('OutroScene uses FONTS', outroSrc.includes('FONTS.'));
test('OutroScene uses TYPE scale', outroSrc.includes('TYPE.'));
test('OutroScene has grainUrl', outroSrc.includes('grainUrl('));
test('OutroScene has vignetteGradient', outroSrc.includes('vignetteGradient('));
test('OutroScene has letterbox bars', outroSrc.includes('12.8%'));
test('OutroScene has brand mark', outroSrc.includes('like') && outroSrc.includes('one'));
test('OutroScene has heading prop', outroSrc.includes('heading'));
test('OutroScene has subtext prop', outroSrc.includes('subtext'));
test('OutroScene has ctaText prop', outroSrc.includes('ctaText'));
test('OutroScene default beat is close', outroSrc.includes('beat = "close"'));
test('OutroScene uses insight color for brand', outroSrc.includes('COLORS.insight'));
test('OutroScene no hardcoded V2 colors', !outroSrc.includes('#08080D') && !outroSrc.includes('#EDE9E3'));

// ════════════════════════════════════════════════════
// 9. COMPOSITION DEFAULT PROPS VALIDATION
// ════════════════════════════════════════════════════
console.log('\n── Composition Default Props ──');

// Each composition should have reasonable defaultProps
test('LikeOneVideo has screenplay prop', rootSrc.includes('screenplay:'));
test('CinematicTitle has title prop', rootSrc.includes('title: "What Is a Neuron?"'));
test('QuoteCard has quote prop', rootSrc.includes('quote: "'));
test('ComparisonSplit has heading prop', rootSrc.includes('heading: "Traditional vs Neural"'));
test('DataViz has heading prop', rootSrc.includes('heading: "Model Performance"'));
test('StepByStep has steps prop', rootSrc.includes('steps: ['));
test('ChapterCard has number prop', rootSrc.includes('number: "Chapter 1"'));

// All compositions use 1920x1080 at 30fps
const compositionBlocks = rootSrc.split('<Composition');
for (let i = 1; i < compositionBlocks.length; i++) {
  const block = compositionBlocks[i].split('/>')[0];
  const idMatch = block.match(/id="(\w+)"/);
  const id = idMatch ? idMatch[1] : `block-${i}`;
  test(`${id}: width=1920`, block.includes('width={1920}'));
  test(`${id}: height=1080`, block.includes('height={1080}'));
  test(`${id}: fps=30`, block.includes('fps={30}'));
}

// ════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(55));
console.log(`RESULTS: ${passed}/${passed + failed} passed, ${failed} failed`);
console.log('═'.repeat(55));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All Remotion component validations passed!');
}
