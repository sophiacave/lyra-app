#!/usr/bin/env node
/**
 * Like One Studio — Prompt Engine V2
 * GROUNDED IN VISUAL BIBLE V2 (DESIGN-SYSTEM.md)
 *
 * Aesthetic DNA: Alexander McQueen × Mark Rothko × Apple
 * Emotion. Precision. Soul.
 *
 * This is the ONLY way to generate visual prompts in the studio.
 * Manual prompts are system failures.
 *
 * Usage:
 *   import { buildVisualPrompt, buildScreenplayPrompts } from './lib/prompt-engine.js';
 *   const result = buildVisualPrompt(scene, screenplay);
 */

import { colors, courseThemes, cinemaGrade } from './design-tokens.js';

// ═══════════════════════════════════════════════════
// THE PALETTE — Visual Bible V2 Rothko System
// Semantic color: one color = one meaning, always.
// Max 3-4 colors per scene. One devastating accent.
// ═══════════════════════════════════════════════════

const PALETTE = {
  void:     { hex: colors.void,     prompt: 'deep aubergine-black void' },
  chalk:    { hex: colors.chalk,    prompt: 'warm bone-white' },
  smoke:    { hex: colors.smoke,    prompt: 'mauve gray' },
  ash:      { hex: colors.ash,      prompt: 'warm charcoal' },
  signal:   { hex: colors.signal,   prompt: 'terracotta warmth' },
  process:  { hex: colors.process,  prompt: 'dusty blue' },
  result:   { hex: colors.result,   prompt: 'living sage green' },
  alert:    { hex: colors.alert,    prompt: 'muted rose attention' },
  insight:  { hex: colors.insight,  prompt: 'wisteria purple — the sublime' },
  bone:     { hex: colors.bone,     prompt: 'skeletal bone-white elegance' },
  obsidian: { hex: colors.obsidian, prompt: 'deepest obsidian shadow' },
  blush:    { hex: colors.blush,    prompt: 'muted rose blush' },
  gold:     { hex: colors.gold,     prompt: 'earned warm gold' },
};

// ═══════════════════════════════════════════════════
// BANNED LIST — Visual Bible V2 Quality Gate
// If any appear, the frame is rejected.
// ═══════════════════════════════════════════════════

const BANNED = [
  // Colors
  'pure black', 'pure white', '#000000', '#ffffff', 'neon',
  // Aesthetics
  'cyberpunk', 'startup gradients', 'corporate blue',
  'anime', 'cartoon', 'stock footage',
  // Effects
  'decorative particles', 'lens flare', 'god rays',
  'cheap glow effects', 'over-saturated',
  // Composition
  'busy composition', 'visual noise', 'unmotivated camera movement',
  // Motion
  'overshoot', 'bounce animation', 'linear easing',
  // Technical
  'text', 'watermark', 'UI elements', 'compression artifacts',
  'blur', 'distortion', 'morphing faces', 'extra limbs', 'deformed hands',
  // Gear cosplay (stripped from visual directions too)
  'shot on ARRI', 'shot on RED', 'anamorphic lens',
  // Tone
  'masculine tech aesthetic', 'harsh contrast', 'flat lighting',
];

// ═══════════════════════════════════════════════════
// BEAT → MOOD — Visual Bible V2 Emotional Arc
// Each beat has: mood, camera, lighting, motion mode, color temperature
// Two modes: Contemplative (Rothko) / Precise (McQueen)
// ═══════════════════════════════════════════════════

const BEAT_MOOD = {
  hook: {
    mood: 'intimate magnetic breath-held stillness before the reveal',
    camera: 'extreme close-up or macro, one detail that contains the whole story',
    lighting: 'Caravaggio single warm practical light emerging from deep aubergine void',
    colorTemp: `${PALETTE.signal.prompt} floating in ${PALETTE.void.prompt}`,
    motionMode: 'contemplative',
    composition: 'subject fills frame, minimal negative space — draw the viewer IN',
    duration_bias: 0,
  },
  setup: {
    mood: 'Rothko color field expanding — anticipation building like color bleeding to edges',
    camera: 'slow pullback revealing scale, the world gets bigger but the feeling stays intimate',
    lighting: 'soft rim light emerging, atmospheric depth like fog in a valley',
    colorTemp: `${PALETTE.process.prompt} atmosphere with ${PALETTE.chalk.prompt} subject emerging`,
    motionMode: 'contemplative',
    composition: 'subject in golden ratio position, negative space expanding around it',
    duration_bias: 0,
  },
  core: {
    mood: 'Apple keynote clarity — everything visible, nothing wasted, elegant focus',
    camera: 'stable medium shot, sacred negative space, the subject earns every pixel',
    lighting: 'balanced soft light, no harsh shadows, pure comprehension',
    colorTemp: `${PALETTE.chalk.prompt} and ${PALETTE.smoke.prompt} with semantic color accents`,
    motionMode: 'precise',
    composition: 'center-framed, 50% negative space minimum, one hero element',
    duration_bias: 2,
  },
  breathe: {
    mood: 'Rothko chapel stillness — the sublime through simplicity, felt not explained',
    camera: 'barely moving or perfectly still, macro on something natural and simple',
    lighting: 'diffused warmth like late afternoon through gauze, no edges anywhere',
    colorTemp: `${PALETTE.chalk.prompt}, ${PALETTE.signal.prompt}, ${PALETTE.gold.prompt} — like sunlight on skin`,
    motionMode: 'contemplative',
    composition: 'maximum negative space, the pause that crystallizes the previous insight',
    duration_bias: -1,
  },
  deepen: {
    mood: 'McQueen construction — layers building into architecture, complexity made elegant',
    camera: 'slow tracking or zoom out revealing structure within structure',
    lighting: 'layered depth, each plane of light reveals another dimension',
    colorTemp: `${PALETTE.process.prompt} structure with ${PALETTE.signal.prompt} highlights at connection points`,
    motionMode: 'precise',
    composition: 'depth through foreground/midground/background layering, parallax planes',
    duration_bias: 1,
  },
  peak: {
    mood: 'the final McQueen look — transformation, the gasp, beauty that stops thought',
    camera: 'the camera is certain — it shows exactly what matters, nothing else',
    lighting: 'dramatic single source, the subject becomes its own light',
    colorTemp: `${PALETTE.insight.prompt} glow emerging from ${PALETTE.obsidian.prompt}, ${PALETTE.blush.prompt} warmth at edges`,
    motionMode: 'precise',
    composition: 'McQueen reveal: build tension then HOLD for 3+ seconds',
    duration_bias: 1,
  },
  close: {
    mood: 'the exhale after the show — warm, resolved, carrying something new',
    camera: 'slow gentle pullback, the subject resting in its context, peaceful scale',
    lighting: 'warm enveloping light like golden hour, safety and earned understanding',
    colorTemp: `${PALETTE.gold.prompt} wash softening ${PALETTE.void.prompt} into something restful`,
    motionMode: 'contemplative',
    composition: 'the callback — visual echo of the opening, transformed by understanding',
    duration_bias: 0,
  },
};

// ═══════════════════════════════════════════════════
// SCENE TYPE → VISUAL STRATEGY
// ═══════════════════════════════════════════════════

const TYPE_STRATEGY = {
  broll: {
    strategy: 'cinematic visual metaphor — the image carries emotional weight for narration',
    promptPrefix: 'cinematic photorealistic',
    composition: 'Rothko: color IS the emotion. One devastating image per scene.',
  },
  diagram: {
    strategy: 'clean motion graphic on void background — Kurzgesagt clarity with semantic color',
    promptPrefix: `clean motion graphic on ${PALETTE.void.prompt} background`,
    composition: 'Apple: sacred negative space. Progressive reveal synced to narration.',
  },
  title: {
    strategy: 'minimal text on void — warm chalk typography, breathing space, no decoration',
    promptPrefix: `minimal typography on ${PALETTE.void.prompt}`,
    composition: 'McQueen moment: one word or phrase, display weight, held 3+ seconds.',
  },
  montage: {
    strategy: 'rapid juxtaposition of concrete images — each cut adds meaning (Eisenstein)',
    promptPrefix: 'cinematic photorealistic rapid-cut',
    composition: 'Eisenstein intellectual montage: juxtaposition creates meaning.',
  },
};

// ═══════════════════════════════════════════════════
// CINEMATOGRAPHY COSPLAY STRIPPER
// Removes all fake gear talk from screenplay visuals.
// The Visual Bible says: NO "shot on ARRI Alexa" padding.
// ═══════════════════════════════════════════════════

function stripCosplay(text) {
  if (!text) return '';
  return text
    // Negative prompts embedded in visual — strip FIRST before other patterns eat them
    .replace(/\.?\s*Negative:.*$/gi, '')
    // Camera bodies
    .replace(/,?\s*shot on [^,]+/gi, '')
    // Lenses
    .replace(/,?\s*\d+mm\s+[^,]*?(lens|prime|anamorphic)[^,]*/gi, '')
    .replace(/,?\s*\d+mm\s+[^,]*?f\/[\d.]+[^,]*/gi, '')
    // Color temperatures as gear specs
    .replace(/,?\s*(at\s+)?\d{4}K\s*(with|and)?\s*/gi, ', ')
    // Film stocks (we handle grade ourselves)
    .replace(/,?\s*(Kodak|Fujifilm|ETERNA|Vision3)[^,]*/gi, '')
    // Camera rigs
    .replace(/,?\s*(slow\s+)?(crane|dolly|steadicam|gimbal|jib)\s+[^,]*/gi, '')
    .replace(/,?\s*locked\s+tripod\s+shot\s*/gi, '')
    .replace(/,?\s*static\s+tripod\s*/gi, '')
    // Slow-motion (we control pacing through beat mood)
    .replace(/,?\s*slow[- ]?motion\s+capture\s*/gi, '')
    // God rays / lens flare (Visual Bible banned)
    .replace(/,?\s*(creating\s+)?god\s+rays\s*/gi, '')
    .replace(/,?\s*lens\s+flare\s*/gi, '')
    // Remove "pure mathematics" false positive trigger — rephrase
    .replace(/pure mathematics/gi, 'mathematics')
    // Strip embedded negative fragments left over from old screenplays
    .replace(/,?\s*\b(blur|distortion|morphing|watermark|text overlay|text|extra limbs|deformed hands|flat lighting|compression artifacts|flickering)\b/gi, '')
    // Cleanup
    .replace(/,\s*,+/g, ',')
    .replace(/^\s*,\s*/, '')
    .replace(/,\s*$/, '')
    .trim();
}

// ═══════════════════════════════════════════════════
// COURSE CONTEXT — Rothko color field per course
// ═══════════════════════════════════════════════════

function getCourseContext(screenplay) {
  const courseId = screenplay.colorTheme || screenplay.course || 'how-ai-works';
  const theme = courseThemes[courseId] || courseThemes['how-ai-works'];
  return {
    courseId,
    accent: theme.accent,
    mood: theme.mood,
    gradient: theme.gradient,
  };
}

// ═══════════════════════════════════════════════════
// THE PROMPT BUILDER — Visual Bible V2
//
// Structure:
//   1. Type strategy prefix (broll/diagram/title/montage)
//   2. What the viewer sees (from screenplay, stripped of cosplay)
//   3. Emotional mood (from beat)
//   4. Camera intent (from beat, motivated by story)
//   5. Lighting (Caravaggio, from beat)
//   6. Composition (from beat + type)
//   7. Color palette (Rothko system — max 3-4 colors)
//   8. Cinema grade (grain, blacks, highlights)
//   9. Course accent color
// ═══════════════════════════════════════════════════

/**
 * Build a Visual Bible V2 prompt for any generation tool (Kling, FLUX, etc.)
 *
 * @param {object} scene - Scene from screenplay JSON
 * @param {object} screenplay - Full screenplay object
 * @returns {object} { prompt, negativePrompt, duration, mood, beat, type, motionMode, courseContext }
 */
export function buildVisualPrompt(scene, screenplay) {
  const beat = scene.beat || 'core';
  const type = scene.type || 'broll';
  const beatMood = BEAT_MOOD[beat] || BEAT_MOOD.core;
  const typeInfo = TYPE_STRATEGY[type] || TYPE_STRATEGY.broll;
  const courseCtx = getCourseContext(screenplay);

  const parts = [];

  // 1. Type strategy prefix
  parts.push(typeInfo.promptPrefix);

  // 2. What the viewer sees (stripped of gear cosplay)
  const vision = stripCosplay(scene.visual);
  if (vision) parts.push(vision);

  // 3. Mood (what the viewer FEELS — Visual Bible says every frame must produce feeling)
  parts.push(beatMood.mood);

  // 4. Camera intent (motivated by story, not gear)
  parts.push(beatMood.camera);

  // 5. Lighting (Caravaggio single-source, Visual Bible V2)
  parts.push(beatMood.lighting);

  // 6. Composition
  parts.push(beatMood.composition);

  // 7. Color palette (Rothko system — max 3-4 per scene)
  parts.push(`color palette: ${beatMood.colorTemp}`);
  parts.push(`${PALETTE.void.prompt} background`);

  // 8. Cinema grade
  parts.push(cinemaGrade.grain);
  parts.push(cinemaGrade.blacks);

  // 9. Course accent (the Rothko color field for this course)
  parts.push(`${courseCtx.mood} mood, accent color ${courseCtx.accent}`);

  // 10. Core quality markers (Visual Bible V2)
  parts.push('4K photorealistic');
  parts.push('cinematic shallow depth of field');
  parts.push('inner luminosity — materials appear lit from within');

  const prompt = parts.filter(Boolean).join(', ');
  const negativePrompt = BANNED.join(', ');

  // Duration: scene duration + beat bias, clamped to Kling intervals
  const baseDuration = scene.duration_s || 5;
  const adjusted = baseDuration + (beatMood.duration_bias || 0);
  const duration = adjusted > 7 ? '10' : '5';

  return {
    prompt,
    negativePrompt,
    duration,
    mood: beatMood.mood,
    beat,
    type,
    motionMode: beatMood.motionMode,
    composition: beatMood.composition,
    courseContext: courseCtx,
  };
}

/**
 * Build negative prompt from Visual Bible V2 banned list.
 */
export function buildNegativePrompt() {
  return BANNED.join(', ');
}

/**
 * Generate prompts for all visual scenes in a screenplay.
 * Diagram scenes with motion_graphic use their own pipeline — skip them here.
 */
export function buildScreenplayPrompts(screenplay) {
  return screenplay.scenes
    .filter(s => (s.visual || s.type === 'broll') && s.type !== 'diagram')
    .map(scene => ({
      sceneId: scene.id,
      ...buildVisualPrompt(scene, screenplay),
    }));
}

/**
 * Validate a prompt against the Visual Bible V2 banned list.
 * Returns { valid, violations[] }.
 */
export function validatePrompt(promptText) {
  const lower = promptText.toLowerCase();
  const violations = BANNED.filter(banned => {
    const pattern = new RegExp(`\\b${banned.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    return pattern.test(lower);
  });
  return {
    valid: violations.length === 0,
    violations,
  };
}

// ═══════════════════════════════════════════════════
// STANDALONE MODE — preview prompts for a screenplay
// ═══════════════════════════════════════════════════

if (process.argv[1]?.includes('prompt-engine')) {
  const { readFileSync } = await import('fs');
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node studio/lib/prompt-engine.js <screenplay.json>');
    process.exit(1);
  }

  const sp = JSON.parse(readFileSync(path, 'utf-8'));
  const prompts = buildScreenplayPrompts(sp);

  console.log(`\n🎨 PROMPT ENGINE V2 — ${sp.title}`);
  console.log(`📐 Visual Bible V2 | McQueen × Rothko × Apple`);
  console.log('═'.repeat(60));

  for (const p of prompts) {
    console.log(`\n🎬 ${p.sceneId} [${p.beat}/${p.type}] [${p.motionMode}]`);
    console.log(`   🎭 ${p.mood.slice(0, 80)}`);
    console.log(`   ⏱  ${p.duration}s`);
    console.log(`   📝 ${p.prompt.slice(0, 200)}...`);

    // Validate
    const check = validatePrompt(p.prompt);
    if (!check.valid) {
      console.log(`   ⚠️  VIOLATIONS: ${check.violations.join(', ')}`);
    } else {
      console.log(`   ✅ Clean — passes Visual Bible V2`);
    }
  }
}
