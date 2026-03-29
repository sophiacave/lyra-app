/**
 * Like One Studio — Design Tokens V3
 * THE SINGLE SOURCE OF TRUTH for every visual decision.
 *
 * AESTHETIC DNA: Alexander McQueen × Mark Rothko × Apple
 * RESEARCH DNA: Mayer 2009, Guo 2014, Sweller 1988, Disney 1981, Itten 1961,
 *   Muller-Brockmann 1961, Lupton 2010, Brown 2012, Krasner 2013, WCAG 2.1,
 *   EBU R128, SMPTE RP 218, Netflix Delivery Specs 2024
 *
 * V3 merges the Visual Bible V2 aesthetic with the PhD cinema research.
 * Soul + engineering. Beauty + precision. McQueen + science.
 *
 * If a value needs to change, it changes HERE and propagates everywhere.
 */

// ═══════════════════════════════════════════════════
// COLORS — The Rothko Palette
// ═══════════════════════════════════════════════════
// Rothko: color IS the content. Not decoration. Emotion.
// McQueen: a restricted palette with one devastating accent.
// All palettes tested for WCAG AA contrast on dark backgrounds.

export const colors = {
  // Foundations — the canvas and the breath
  void:       '#0B0A10',   // Deep aubergine-black — warm void (NEVER #000)
  chalk:      '#F0EBE3',   // Bone white — like aged paper, living warmth (NEVER #FFF)
  smoke:      '#8A8490',   // Mauve gray — feminine neutral, not corporate
  ash:        '#2D2A33',   // Warm charcoal — depth without coldness

  // Semantic — meaning is emotion, not just information
  signal:     '#D4956B',   // Terracotta — warm, grounded, human input
  process:    '#8BAFC4',   // Dusty blue — calm transformation, think and feel
  result:     '#8CB89E',   // Sage — growth, emergence, living output
  alert:      '#C4616A',   // Muted rose — attention without aggression
  insight:    '#B898C8',   // Wisteria — the aha, the sublime, McQueen's purple
  focus:      '#F5F0E8',   // Warm glow — highlights that feel like candlelight

  // McQueen accents — devastating single-use drama
  bone:       '#E8DDD0',   // Skeletal elegance — structural elements
  obsidian:   '#1A1720',   // The deepest shadow — dramatic contrast
  blush:      '#D4A0A0',   // The feminine touch — subtle, not pink-washed
  gold:       '#C4A86C',   // Earned warmth — used sparingly, like McQueen's thread
};

// Colorblind-safe palette (Wong 2011) — use for data viz, diagrams
export const colorblindSafe = [
  '#000000', '#E69F00', '#56B4E9', '#009E73',
  '#F0E442', '#0072B2', '#D55E00', '#CC79A7',
];

// Course accent themes — Rothko color fields
export const courseThemes = {
  'ai-foundations':  { accent: '#8BAFC4', gradient: ['#8BAFC4', '#1A2530'], mood: 'trust' },
  'rag-vectors':     { accent: '#9B88B8', gradient: ['#9B88B8', '#251A30'], mood: 'depth' },
  'prompt-craft':    { accent: '#D4956B', gradient: ['#D4956B', '#302018'], mood: 'craft' },
  'ethics-safety':   { accent: '#8CB89E', gradient: ['#8CB89E', '#1A2820'], mood: 'care' },
  'creative-ai':     { accent: '#D4A0A0', gradient: ['#D4A0A0', '#301A1A'], mood: 'expression' },
  'business-ai':     { accent: '#C4A86C', gradient: ['#C4A86C', '#282018'], mood: 'authority' },
  'how-ai-works':    { accent: '#B898C8', gradient: ['#B898C8', '#201828'], mood: 'wonder' },
};

// Cinema-grade gradients (tested at 1080p for banding — use 10-bit or dither)
export const gradients = {
  deepOcean:     { stops: ['#0A0F1A', '#162033', '#1E3A5F'], angle: 135, mood: 'depth, focus' },
  sunsetWarm:    { stops: ['#1A0A2E', '#4A1942', '#8B2252'], angle: 180, mood: 'creative, warm' },
  midnightBlue:  { stops: ['#000428', '#004E92'],            angle: 90,  mood: 'trust, professional' },
  emeraldDark:   { stops: ['#0A1A0F', '#0D3320', '#165B33'], angle: 160, mood: 'growth, nature' },
  cosmicPurple:  { stops: ['#0D0221', '#260041', '#4A0080'], angle: 145, mood: 'premium, spiritual' },
};

// Contrast rules (WCAG 2.1)
export const contrast = {
  textOnBgMin:       4.5,    // Level AA
  textOnBgPreferred: 7.0,    // Level AAA — preferred for education
  largeTextMin:      3.0,    // Large text (>24px) minimum
  nonTextUiMin:      3.0,    // Icons, borders, focus indicators
  largeTextThresholdPx: 24,
};

// ═══════════════════════════════════════════════════
// TYPOGRAPHY — Apple precision, McQueen restraint
// ═══════════════════════════════════════════════════
// Type is architecture. Every letterform is placed, not poured.
// Light weights carry more authority than bold in this system.
// The whisper is louder than the shout.
// Font recs from PhD research — all free/open-source, cinema-grade.

export const fonts = {
  // Primary system
  heading:  'Outfit',             // Geometric, modern, personality — display/titles
  body:     'Inter',              // Humanist, screen-optimized — body text
  code:     'JetBrains Mono',     // Monospace — code, data, timestamps
  accent:   'Cormorant Garamond', // Classic serif — McQueen moments, quotes, poetry

  // Alternates (for variety across courses)
  altDisplay:  'Space Grotesk',   // Futuristic, tech, AI themes
  altClean:    'DM Sans',         // Clean minimal
  altSerif:    'Playfair Display', // Premium titles, editorial, luxury
  altWarm:     'Lora',            // Contemporary serif, storytelling, warm
};

// Proven font pairings (contrast principle: differ on 2+ of style/weight/size)
export const fontPairings = [
  { heading: 'Outfit',            body: 'Inter',  mood: 'modern_professional' },
  { heading: 'Playfair Display',  body: 'Inter',  mood: 'editorial_premium' },
  { heading: 'Space Grotesk',     body: 'DM Sans', mood: 'tech_futuristic' },
  { heading: 'Cormorant Garamond', body: 'Lora',  mood: 'literary_dramatic' },
  { heading: 'Outfit',            body: 'Lora',   mood: 'modern_warm' },
];

// Type scale — modular scale (major third 1.25)
// All sizes in px at 1920×1080. Viewing distance: 6-10ft TV, 2-3ft desktop.
export const typeScale = {
  mcqueen:  { size: 96,  weight: 200, tracking: -0.04, font: 'accent',  maxChars: 15,  lineHeight: 1.05 },  // One word. Full screen. Devastating.
  hero:     { size: 72,  weight: 300, tracking: -0.03, font: 'heading', maxChars: 20,  lineHeight: 1.05 },  // Light, not bold — Apple
  section:  { size: 48,  weight: 400, tracking: -0.02, font: 'heading', maxChars: 25,  lineHeight: 1.1 },
  subtitle: { size: 48,  weight: 600, tracking: -0.01, font: 'heading', maxChars: 35,  lineHeight: 1.2 },
  heading:  { size: 36,  weight: 600, tracking: 0,     font: 'heading', maxChars: 45,  lineHeight: 1.25 },
  emphasis: { size: 36,  weight: 500, tracking: 0,     font: 'body',    maxChars: 45,  lineHeight: 1.25 },
  whisper:  { size: 32,  weight: 200, tracking: 0.04,  font: 'body',    maxChars: 50,  lineHeight: 1.4, italic: true },  // The most powerful line
  bodyLg:   { size: 28,  weight: 400, tracking: 0.01,  font: 'body',    maxChars: 55,  lineHeight: 1.5 },
  body:     { size: 24,  weight: 400, tracking: 0.015, font: 'body',    maxChars: 60,  lineHeight: 1.5 },
  label:    { size: 24,  weight: 400, tracking: 0.02,  font: 'body',    maxChars: 60,  lineHeight: 1.3 },
  code:     { size: 22,  weight: 400, tracking: 0,     font: 'code',    maxChars: 70,  lineHeight: 1.4 },
  caption:  { size: 20,  weight: 400, tracking: 0.02,  font: 'body',    maxChars: 65,  lineHeight: 1.4 },
  small:    { size: 18,  weight: 400, tracking: 0.03,  font: 'body',    maxChars: 70,  lineHeight: 1.3 },
  overline: { size: 14,  weight: 700, tracking: 0.15,  font: 'body',    maxChars: 25,  lineHeight: 1.2, uppercase: true },  // Category labels, kickers
};

// Typography rules (from research + Visual Bible)
export const typeRules = {
  minSizePx:           16,    // Absolute minimum for any text at 1080p
  minBodyPx:           20,    // Body text minimum
  optimalLineChars:    { min: 45, ideal: 55, max: 75 },
  allCapsMaxWords:     5,     // Never more than 5 words in all-caps
  allCapsTrackingAdd:  0.10,  // +0.10em tracking for all-caps (the most common amateur tell to skip)
  maxFamiliesPerFrame: 2,     // Maximum 2 font families per frame
  maxWeightsPerFrame:  3,     // Maximum 3 weights per frame
  avoidJustified:      true,  // Never justify text in video
  preferredAlignment:  'left_or_center',
  holdTimePerWord:     0.4,   // seconds — minimum on-screen time per word (1.5x reading speed)
};

// ═══════════════════════════════════════════════════
// ANIMATION — Felt, not seen
// ═══════════════════════════════════════════════════
// Apple: every animation has MEANING. Nothing moves for show.
// McQueen: the reveal is everything. Build anticipation, then deliver.
// Rothko: stillness is a valid state. Not everything needs to move.
// Disney 12 Principles inform everything below.

export const easing = {
  // Core system (Visual Bible)
  appear:      [0.25, 0.1, 0.25, 1.0],      // Gentle arrival — like a breath
  exit:        [0.55, 0.0, 1.0, 0.45],       // Quiet departure
  transform:   [0.4, 0, 0.2, 1],             // Apple standard ease
  dramatic:    [0.16, 1, 0.3, 1],            // McQueen reveal — explosive then precise
  stillness:   [0, 0, 1, 1],                 // Linear — for things that simply ARE

  // Extended library (PhD research)
  easeOutExpo:  [0.16, 1, 0.3, 1],          // Snappy entrances — RECOMMENDED DEFAULT
  easeInExpo:   [0.7, 0, 0.84, 0],          // Quick dismissals
  easeOutBack:  [0.34, 1.56, 0.64, 1],      // Playful overshoot, attention grab
  easeInBack:   [0.36, 0, 0.66, -0.56],     // Anticipation wind-up
  easeOutQuint: [0.22, 1, 0.36, 1],         // Smooth slides, page transitions
  easeInOutQuart: [0.76, 0, 0.24, 1],       // Morphs, scale transitions
  springy:      [0.175, 0.885, 0.32, 1.275], // Kurzgesagt-style bounce
  dramaticSlow: [0.6, 0, 0.1, 1],           // Cinematic reveals, slow zooms
};

export const spring = {
  default:   { stiffness: 100, damping: 16, mass: 1 },    // Organic, slightly lazy
  gentle:    { stiffness: 60,  damping: 20, mass: 1 },    // Like fabric settling (Rothko)
  snappy:    { stiffness: 180, damping: 18, mass: 1 },    // Precise, McQueen tailoring
  dramatic:  { stiffness: 280, damping: 10, mass: 1 },    // The runway moment
};

export const duration = {
  // Element lifecycle
  elementAppear:   500,    // ms — slower than tech standard. Luxurious.
  elementExit:     250,    // ms — exit should be graceful, not abrupt
  microInteraction: 200,   // ms — instant feedback
  fastAnimation:   300,    // ms — snappy UI response

  // Content timing
  diagramStep:     900,    // ms — each step earns its space
  colorTransition: 600,    // ms — Rothko: color changes are events
  highlightPulse:  500,    // ms — a gentle throb, not a flash
  sceneTransition: 1200,   // ms — the pause between thoughts
  positionShift:   600,    // ms — elements glide, never jump
  cameraZoom:      2000,   // ms — slow zoom like a held gaze
  cinematicFade:   2000,   // ms — luxurious film dissolve

  // Stagger timing
  staggerTight:    50,     // ms — rapid cascade
  staggerNormal:   80,     // ms — standard cascade (Kurzgesagt: 80ms)
  staggerRelaxed:  120,    // ms — deliberate reveal
  staggerDramatic: 200,    // ms — McQueen runway pace
  wordStagger:     150,    // ms — words arrive like footsteps
  codeLineStagger: 120,    // ms — code reveals itself
  dataPoint:       90,     // ms — per data point

  // Hold/pause timing
  beatPause:       500,    // ms — musical beat
  readingPause:    200,    // ms — per word
  conceptAbsorb:   1500,   // ms — let the idea land
  dramaticPause:   2000,   // ms — McQueen tension
  sceneEstablish:  3000,   // ms — let the viewer orient
  mcqueenReveal:   3000,   // ms — build tension, then HOLD
};

// Text animation presets (from PhD research)
export const textAnimations = {
  fadeIn: {
    duration: 600, easing: 'appear',
    from: { opacity: 0 }, to: { opacity: 1 },
    mood: 'elegant, simple',
  },
  fadeUp: {
    duration: 500, easing: 'dramatic',
    from: { opacity: 0, translateY: 30 }, to: { opacity: 1, translateY: 0 },
    mood: 'modern, confident',
  },
  slideLeft: {
    duration: 400, easing: 'easeOutQuint',
    from: { opacity: 0, translateX: -60 }, to: { opacity: 1, translateX: 0 },
    mood: 'dynamic, informational',
  },
  typewriter: {
    charDelay: 40, cursorBlink: 530, cursorChar: '|', cursorHoldAfter: 1500,
    mood: 'technical, code, AI',
  },
  revealMask: {
    duration: 800, easing: 'easeInOutQuart',
    maskDirection: 'left_to_right', maskColor: colors.chalk, maskHold: 100,
    mood: 'premium, cinematic',
  },
  wordByWord: {
    wordDelay: 120, wordFade: 200, easing: 'appear',
    mood: 'educational, emphasis',
  },
  scalePop: {
    duration: 350, easing: 'easeOutBack',
    from: { scale: 0.8, opacity: 0 }, to: { scale: 1.0, opacity: 1 },
    mood: 'playful, attention-grabbing',
  },
  kineticZoom: {
    duration: 600, easing: 'dramatic',
    from: { scale: 3.0, opacity: 0, blur: 12 }, to: { scale: 1.0, opacity: 1, blur: 0 },
    mood: 'dramatic, impactful',
  },
};

// Speed ramping (dramatic effect)
export const speedRamp = {
  slowMotion:  0.25,   // Key moment emphasis
  slightSlow:  0.5,    // Important transition
  normal:      1.0,
  slightFast:  1.5,    // Montage, quick recap
  fastForward: 3.0,    // Time lapse
  snap:        10.0,   // Instantaneous emphasis
  rampEasing:  'easeInOutQuart',
  rampTransition: 300, // ms
};

// ═══════════════════════════════════════════════════
// COMPOSITION — Sacred negative space + research grids
// ═══════════════════════════════════════════════════
// Apple: 50% of beauty is what you leave OUT.
// Rothko: the painting needs room to breathe or it suffocates.
// McQueen: one perfect element > ten good ones.
// Grids: Muller-Brockmann 1961, SMPTE RP 218.

export const layout = {
  width:          1920,
  height:         1080,
  safeMargin:     96,      // px — more breathing room than standard
  contentWidth:   1728,    // 1920 - 2*96
  contentHeight:  888,     // 1080 - 2*96
  topZoneHeight:  180,     // section titles
  centerStageHeight: 528,  // primary visual — generous but contained
  lowerZoneHeight: 100,    // lower thirds — smaller, more elegant
  elementGap:     48,      // minimum between text elements
  objectGap:      72,      // minimum between visual objects — luxury spacing
  labelAnchorMax: 36,      // max px between label and target
  gridUnit:       8,       // all positioning snaps to 8px
  negativeSpaceTarget: 0.50, // 50% of frame should be EMPTY — Rothko's lesson
};

// Letterbox for 2.39:1 cinematic widescreen
export const cinema = {
  aspectRatio:    2.39,
  outputWidth:    1920,
  outputHeight:   804,
  barHeight:      138,
};

// Safe zones (SMPTE RP 218 + modern streaming)
export const safeZones = {
  actionSafe: {
    margin: 67,
    rect: { x: 67, y: 38, width: 1786, height: 1004 },
    desc: 'All important visual content — 93% of frame',
  },
  titleSafe: {
    margin: 96,
    rect: { x: 96, y: 54, width: 1728, height: 972 },
    desc: 'All text/graphics — 90% of frame',
  },
  textComfort: {
    margin: 192,
    rect: { x: 192, y: 108, width: 1536, height: 864 },
    desc: 'Where text is most readable — 80% of frame',
  },
  subtitleSafe: {
    rect: { x: 192, y: 900, width: 1536, height: 126 },
    desc: 'Never place graphics here — reserved for CC/subtitles',
  },
};

// Composition grids
export const compositionGrids = {
  ruleOfThirds: {
    verticalLines:  [640, 1280],
    horizontalLines: [360, 720],
    powerPoints: [
      { name: 'topLeft',     x: 640,  y: 360 },
      { name: 'topRight',    x: 1280, y: 360 },
      { name: 'bottomLeft',  x: 640,  y: 720 },
      { name: 'bottomRight', x: 1280, y: 720 },
    ],
  },
  goldenRatio: {
    phi: 1.618033988749895,
    verticalLines:  [734, 1186],
    horizontalLines: [413, 667],
    goldenRect: { x: 367, y: 207, width: 1186, height: 667 },
  },
  twelveColumn: {
    columnWidth: 128, gutter: 32, margin: 96, columns: 12,
    spans: { full: 12, threeQuarter: 9, twoThirds: 8, half: 6, third: 4, quarter: 3 },
  },
  eightColumn: {
    columnWidth: 192, gutter: 48, margin: 96, columns: 8,
  },
  zPattern: [
    { x: 320, y: 270 }, { x: 1600, y: 270 },
    { x: 320, y: 810 }, { x: 1600, y: 810 },
  ],
};

// Layout patterns for common frame types
export const layoutPatterns = {
  centerWeighted: {
    zone: { x: 480, y: 216, width: 960, height: 648 },
    textMaxWidth: 1200,
  },
  leftHeavy: {
    main:    { x: 96,   y: 54, width: 1050, height: 972 },
    sidebar: { x: 1200, y: 54, width: 624,  height: 972 },
  },
  rightHeavy: {
    sidebar: { x: 96,  y: 54, width: 624,  height: 972 },
    main:    { x: 774, y: 54, width: 1050, height: 972 },
  },
};

// ═══════════════════════════════════════════════════
// LIGHTING — Caravaggio meets McQueen
// ═══════════════════════════════════════════════════

export const lighting = {
  keyStyles: {
    rembrandt: {
      azimuth: 45, elevation: 45, keyFillRatio: '4:1', shadowOpacity: 0.6,
      mood: 'dramatic, authoritative', use: 'expert_moments, dramatic_reveals',
    },
    butterfly: {
      azimuth: 0, elevation: 60, keyFillRatio: '2:1', shadowOpacity: 0.3,
      mood: 'glamorous, clean', use: 'product_shots, title_cards',
    },
    loop: {
      azimuth: 25, elevation: 35, keyFillRatio: '3:1', shadowOpacity: 0.4,
      mood: 'approachable, warm', use: 'default, interviews',
    },
    split: {
      azimuth: 90, elevation: 30, keyFillRatio: '8:1', shadowOpacity: 0.75,
      mood: 'mysterious, duality', use: 'conflict, before_after',
    },
    rimOnly: {
      azimuth: 180, elevation: 20, keyFillRatio: '1:1', rimIntensity: 1.0, shadowOpacity: 0.85,
      mood: 'epic, spiritual', use: 'dramatic_intros, silhouettes',
    },
  },
  chiaroscuro: {
    bgLuminance: 0.05, highlightLuminance: 0.95,
    falloff: 'exponential', vignetteStrength: 0.7, vignetteRadius: 0.6,
    use: 'key_revelations, aha_moments, McQueen drama',
  },
  colorTemp: {
    candle: 1900, warmTungsten: 2700, warmWhite: 3200,
    neutral: 4100, daylight: 5600, overcast: 6500,
    cinematic: { shadowTemp: 3200, highlightTemp: 6500 }, // Orange & teal — the standard
  },
  shadows: {
    soft:    { blur: 24, opacity: 0.25, offsetX: 4,  offsetY: 8 },
    medium:  { blur: 16, opacity: 0.4,  offsetX: 6,  offsetY: 12 },
    hard:    { blur: 4,  opacity: 0.6,  offsetX: 8,  offsetY: 16 },
    contact: { blur: 8,  opacity: 0.35, offsetX: 0,  offsetY: 4, scaleY: 0.3 },
    text:    { blur: 6,  opacity: 0.5,  offsetX: 2,  offsetY: 3 },
  },
};

// ═══════════════════════════════════════════════════
// SIGNALING — Subtle, never loud
// ═══════════════════════════════════════════════════

export const signaling = {
  highlightGlow: {
    color: colors.focus,
    opacity: 0.10,           // Barely there — candle, not spotlight
    radius: 24,
    fadeIn: 500,
    fadeOut: 500,
  },
  colorActivation: {
    fromColor: colors.smoke,
    duration: 600,           // Slow color bloom
  },
  scalePulse: {
    scale: 1.03,             // 3% not 5% — restrained
    duration: 400,
  },
  arrowDraw: {
    strokeWidth: 1.5,        // Thinner, more elegant
    color: colors.bone,
    drawDuration: 500,
  },
  dimDefocus: {
    targetOpacity: 0.25,
    duration: 400,
  },
  zoomFocus: {
    duration: 1200,
    dimBackground: 0.25,
  },
};

// ═══════════════════════════════════════════════════
// CINEMA GRADE PRESETS — Retuned for the Rothko palette
// ═══════════════════════════════════════════════════

export const cinemaGrade = {
  arri: {
    name: 'ARRI Alexa — McQueen Edit',
    softness: 0.25,
    contrast: 1.04,          // Softer contrast — Rothko, not Michael Bay
    brightness: 0.015,
    saturation: 0.85,        // Desaturated — let the palette do the work
    colorBalance: { rs: 0.03, gs: 0.01, bs: -0.02, rm: 0.02, gm: 0.005, bm: -0.01 },
    curves: '0/0.07 0.25/0.27 0.5/0.52 0.75/0.77 1/0.94',
    grain: { luma: 4, chroma: 3 },
    vignette: 'PI/4.5',
  },
  red: {
    name: 'RED V-Raptor — Architectural',
    sharpness: 0.4,
    contrast: 1.08,
    brightness: -0.01,
    saturation: 0.90,
    colorBalance: { rs: -0.01, gs: 0.0, bs: 0.02 },
    curves: '0/0.03 0.15/0.13 0.5/0.50 0.85/0.87 1/0.96',
    grain: { luma: 3, chroma: 2 },
    vignette: 'PI/4.5',
  },
  kodak: {
    name: 'Kodak Vision3 — Warm Memory',
    softness: 0.35,
    contrast: 1.03,
    brightness: 0.01,
    saturation: 0.82,        // More desaturated — dreamy, Rothko warm
    colorBalance: { rs: 0.04, gs: 0.015, bs: -0.025, rm: 0.03, gm: 0.01, bm: -0.015 },
    curves: '0/0.09 0.25/0.29 0.5/0.53 0.75/0.78 1/0.93',
    grain: { luma: 6, chroma: 4 },
    vignette: 'PI/4.5',
  },
};

export const courseGrade = {
  'ai-foundations':  'arri',
  'rag-vectors':     'arri',
  'prompt-craft':    'kodak',
  'ethics-safety':   'kodak',
  'creative-ai':     'kodak',
  'business-ai':     'red',
  'how-ai-works':    'arri',
};

// ═══════════════════════════════════════════════════
// PACING — Luxurious, never rushed
// ═══════════════════════════════════════════════════
// Guo 2014: 185 WPM optimal for engagement. Our system runs
// slower because we privilege understanding over engagement metrics.

export const pacing = {
  hook:       { wpm: 150, pauseAfter: 0.8 },   // Slower hook — let mystery build
  teach:      { wpm: 140, pauseAfter: 1.5 },
  build:      { wpm: 150, pauseAfter: 0.5 },
  concept:    { wpm: 135, pauseAfter: 1.2 },   // Concepts need MORE space
  reveal:     { wpm: 120, pauseAfter: 3.0 },   // The McQueen reveal — devastatingly slow
  awe:        { wpm: 110, pauseAfter: 3.0 },   // Rothko moment — sit with it
  close:      { wpm: 130, pauseAfter: 2.0 },   // Generous landing
  question:   { wpm: 140, pauseAfter: 4.0 },   // Let the question HANG
};

// ═══════════════════════════════════════════════════
// AUDIO — EBU R128, voice is queen
// ═══════════════════════════════════════════════════

export const audio = {
  // Loudness targets
  voiceLUFS:      -11,
  musicLUFS:      -24,     // Even quieter music — voice is queen
  sfxLUFS:        -18,
  masterLUFS:     -14,     // YouTube/Spotify target
  truePeakMax:    -1,      // dBTP
  loudnessRange:  { min: 5, max: 15 }, // LU

  // Relative levels (dB relative to narration)
  levels: {
    narration:           0,
    musicUnderNarration: -18,
    musicStandalone:     -8,
    sfx:                 -12,
    ambientBg:           -24,
    transitionSwoosh:    -10,
    emphasisHit:         -6,
  },

  // Sidechain ducking
  sidechain: {
    threshold:    0.02,
    ratio:        6,
    attack:       5,      // ms
    release:      300,    // ms
    duckDB:       -14,
  },

  // Timing
  musicFadeIn:    2000,   // ms
  musicFadeOut:   3000,   // ms
  musicDuckAttack: 500,   // ms
  musicDuckRelease: 800,  // ms
  sfxPreVisual:   50,     // ms — sound slightly before visual increases impact

  // Frequency
  narrationPresenceHz: [2000, 5000],
  musicLowCutHz:       200,  // Cut music below 200Hz when narration is present
  sibilanceRangeHz:    [5000, 10000],

  // Accessibility
  minSNRdB:       20,
  preferredSNRdB: 30,
};

// ═══════════════════════════════════════════════════
// TRANSITIONS — McQueen reveals
// ═══════════════════════════════════════════════════

export const transitions = {
  hardCut:       { type: 'cut',   duration: 0 },
  jCut:          { type: 'j-cut', audioLead: 1000 },
  lCut:          { type: 'l-cut', audioTrail: 1000 },
  fadeBlack:     { type: 'fade',  fadeOut: 600, hold: 400, fadeIn: 600 },
  segmentBreath: { type: 'breath', holdFrame: 400, fadeOut: 600, hold: 1500, fadeIn: 600 },

  // Extended transitions (PhD research)
  dissolve:      { type: 'dissolve', fast: 500, standard: 1000, slow: 2000 },
  zoomThrough:   { type: 'zoom',     fast: 600, standard: 1000, scaleRange: [1.0, 3.0], blurPeak: 20 },
  morph:         { type: 'morph',    fast: 600, standard: 1200 },   // Kurzgesagt signature
  slide:         { type: 'slide',    fast: 400, standard: 600, easing: 'easeOutExpo' },
  iris:          { type: 'iris',     fast: 500, standard: 800, shapes: ['circle', 'rectangle', 'diamond'] },
  wipe:          { type: 'wipe',     fast: 400, standard: 700, directions: ['left', 'right', 'up', 'down'] },
};

// ═══════════════════════════════════════════════════
// CINEMATOGRAPHY — Camera psychology
// ═══════════════════════════════════════════════════

export const camera = {
  focalLength: {
    ultraWide:  { mm: '14-24', fov: 84, emotion: 'epic, vast',        use: 'establishing, landscapes' },
    wide:       { mm: '28-35', fov: 63, emotion: 'context, documentary', use: 'scene_setting' },
    normal:     { mm: '50',    fov: 47, emotion: 'natural, honest',    use: 'default, interviews' },
    shortTele:  { mm: '85',    fov: 28, emotion: 'intimate, focused',  use: 'emotional, portraits' },
    telephoto:  { mm: '135-200', fov: 15, emotion: 'isolated, compressed', use: 'detail, abstract' },
  },
  movements: {
    static:       { emotion: 'stable, contemplative',  use: 'info_delivery, title_cards' },
    slowPushIn:   { speedPctPerSec: 1.5, duration: 4000, emotion: 'tension, intimacy' },
    slowPullOut:  { speedPctPerSec: 1.5, duration: 4000, emotion: 'context_reveal, conclusion' },
    dolly:        { speedPxPerSec: 30, emotion: 'progression, exploration' },
    pan:          { speedDegPerSec: 15, emotion: 'following, revealing' },
    tiltUp:       { speedDegPerSec: 10, emotion: 'awe, grandeur' },
    tiltDown:     { speedDegPerSec: 10, emotion: 'grounding, detail' },
    craneUp:      { speedPxPerSec: 40, emotion: 'freedom, triumph' },
    drift:        { speedPxPerSec: 5,  emotion: 'ambient, dreamy' },  // Kurzgesagt style
    handheld:     { amplitudePx: 3, frequencyHz: 1.5, emotion: 'documentary, raw' },
  },
  depthOfField: {
    deep:     { aperture: 'f/11-f/16', blur: 0,  use: 'diagrams, text_heavy' },
    medium:   { aperture: 'f/4-f/5.6', blur: 4,  use: 'default' },
    shallow:  { aperture: 'f/1.4-f/2.8', blur: 12, use: 'emotional, detail' },
    extreme:  { aperture: 'f/1.2',     blur: 24, use: 'bokeh, abstract' },
  },
};

// ═══════════════════════════════════════════════════
// PARTICLE SYSTEMS — atmosphere, not decoration
// ═══════════════════════════════════════════════════

export const particles = {
  ambientDust: {
    count: { min: 20, max: 60 }, size: { min: 1, max: 4 },
    opacity: { min: 0.1, max: 0.3 }, speed: { min: 2, max: 10 },
    lifetime: { min: 5000, max: 15000 }, emission: 'constant',
    use: 'atmosphere, depth, cinematic',
  },
  sparkle: {
    count: { min: 5, max: 20 }, size: { min: 2, max: 8 },
    opacityCurve: 'pulse', pulsePeriod: 1000,
    lifetime: { min: 500, max: 2000 }, emission: 'burst',
    use: 'highlight, achievement, magic',
  },
  dataFlow: {
    count: { min: 30, max: 100 }, size: { min: 2, max: 3 },
    opacity: { min: 0.3, max: 0.7 }, speed: { min: 50, max: 200 },
    direction: 'vertical_or_along_path', lifetime: { min: 1000, max: 3000 },
    emission: 'constant', use: 'technology, networks, info flow',
  },
};

// ═══════════════════════════════════════════════════
// EDUCATION SCIENCE — Research-backed production rules
// ═══════════════════════════════════════════════════
// Guo 2014, Mayer 2009, Sweller 1988, Brame 2016

export const educationScience = {
  // Video length (Guo 2014: 6.9M sessions)
  optimalLength: { min: 4, max: 9 },        // minutes — sweet spot
  absoluteMax:   12,                          // minutes — hard ceiling
  segmentTarget: 6,                           // minutes — ideal segment

  // Pacing (Guo 2014 + Brame 2016)
  speakingRate: { conversational: 150, optimal: 185, fast: 210, max: 240 },
  visualChangeInterval: { min: 3, optimal: 5, max: 10 },  // seconds
  patternInterrupt: { optimal: 30, min: 20, max: 45 },    // seconds
  maxNewConceptsPerMinute: 2,
  pauseAfterNewConcept: 2000, // ms

  // Cognitive load (Sweller 1988)
  maxSimultaneousElements: 4,
  maxInfoChannels:         2,
  idealInfoDensity:        'one_concept_per_scene',

  // Attention (4-second pulse — Wolfe 2021)
  attentionPulse: 4000,   // ms — visual change at this interval
  engagementDropPoints: {
    first15sec: 'critical — hook or lose them',
    twoMin:     'first major drop-off — pattern interrupt needed',
    sixMin:     'second drop-off — section break or story element',
    tenMin:     'third drop-off — end or major shift',
  },

  // Spaced repetition in video (Ebbinghaus/Cepeda 2006)
  spacedRepetition: [
    { review: 1, delayMin: 1, method: 'brief_visual_callback' },
    { review: 2, delayMin: 3, method: 'restate_in_new_context' },
    { review: 3, delayMin: 7, method: 'quiz_or_application' },
  ],

  // Mayer's 12 principles — production rules
  mayer: {
    coherence:          'Remove ALL extraneous material. Every element serves learning.',
    signaling:          'Highlight key terms with color. Arrows direct attention. Number steps.',
    redundancy:         'NEVER show full narration as on-screen text. Key words only.',
    spatialContiguity:  'Labels within 120px of referent. Use leader lines if tight.',
    temporalContiguity: 'Narration and animation sync within 500ms. Build as you explain.',
    segmenting:         'Chapter markers every 2-4 minutes. Visual separator between segments.',
    pretraining:        'Define vocabulary in first 30 seconds. Overview before details.',
    modality:           'Prefer voiceover + graphics over text + graphics.',
    multimedia:         'Never text-only slides for >5 seconds. Always pair with visuals.',
    personalization:    'Conversational tone. Use "I" and "you." Contractions OK.',
    voice:              'Human voice > machine voice. Enthusiastic but not manic.',
    image:              'Talking head optional. If used, small corner overlay (20% width).',
  },

  // Emotional triggers (Pekrun 2014)
  emotionalTriggers: {
    awe:          { trigger: 'vast scale, beautiful visualization', timing: 'opening, revelations' },
    curiosity:    { trigger: 'open question, mystery, partial reveal', timing: 'before explanation' },
    surprise:     { trigger: 'counterintuitive fact, unexpected visual', timing: 'every 2-3 minutes' },
    satisfaction: { trigger: 'completed explanation, aha moment', timing: 'end of segment' },
  },
};

// ═══════════════════════════════════════════════════
// ACCESSIBILITY — Universal design
// ═══════════════════════════════════════════════════

export const accessibility = {
  contrastAA:        4.5,
  contrastAAA:       7.0,
  contrastLargeAA:   3.0,
  contrastLargeAAA:  4.5,
  maxFlashesPerSec:  3,       // WCAG 2.3.1 — prevent seizures
  flashAreaMaxPct:   0.25,
  noRedFlash:        true,
  reduceMotionAlt:   true,    // Always provide reduced-motion alternative
  neverColorAlone:   true,    // Always pair color with shape/text/pattern
  captionMaxChars:   42,      // per line
  captionMaxLines:   2,
  captionDisplayWPM: 180,
  captionSyncTolerance: 200,  // ms
};

// ═══════════════════════════════════════════════════
// RENDERING PRESETS — Ready-to-implement scene types
// ═══════════════════════════════════════════════════

export const renderPresets = {
  titleCardCinematic: {
    duration: 5000,
    bg: { type: 'gradient', preset: 'deepOcean' },
    title:    { style: 'hero', font: 'heading', color: colors.chalk, yPct: 0.42, maxWidthPct: 0.75, animation: 'revealMask', delay: 500 },
    subtitle: { style: 'subtitle', font: 'body', color: colors.smoke, yPct: 0.58, maxWidthPct: 0.6, animation: 'fadeUp', delay: 1300 },
    particles: 'ambientDust',
    vignette: 0.4,
    fadeIn: 1000, fadeOut: 800,
  },
  chapterCard: {
    duration: 3700,
    bg: { type: 'gradient' },
    chapterNumber: { style: 'overline', yPct: 0.38 },
    title:         { style: 'section', yPct: 0.48 },
    fadeIn: 600, fadeOut: 600,
  },
  explainerScene: {
    duration: 6000,
    bg: { type: 'solid', color: colors.void },
    heading:     { style: 'heading', font: 'heading', color: colors.chalk, yPct: 0.12, animation: 'fadeUp', animationMs: 400 },
    diagramZone: { xPct: 0.1, yPct: 0.22, widthPct: 0.8, heightPct: 0.65 },
    buildStagger: 80,
    entrance: 'easeOutExpo',
    conceptHold: 2000,
    visualChange: 4000,
  },
  comparisonSplit: {
    duration: 8000,
    divider:   { xPct: 0.5, width: 2, color: colors.ash, opacity: 0.5 },
    leftPanel:  { xPct: 0.05, widthPct: 0.42 },
    rightPanel: { xPct: 0.53, widthPct: 0.42 },
    transition: 'slide', transitionMs: 600,
  },
  quoteCard: {
    duration: 5000,
    bg: { type: 'gradient', preset: 'cosmicPurple' },
    quoteMark: { char: '\u201C', size: 200, opacity: 0.15, yPct: 0.2, font: 'accent' },
    quoteText: { style: 'subtitle', font: 'altWarm', color: colors.chalk, yPct: 0.4, maxWidthPct: 0.7, italic: true, animation: 'wordByWord' },
    attribution: { style: 'caption', font: 'body', color: colors.smoke, yPct: 0.65, animation: 'fadeIn', delay: 2000 },
    vignette: 0.5,
  },
  dataVisualization: {
    duration: 8000,
    chartZone: { xPct: 0.1, yPct: 0.15, widthPct: 0.8, heightPct: 0.7 },
    axisColor: colors.ash, axisWeight: 1.5,
    gridColor: colors.obsidian, gridWeight: 0.5,
    dataColors: [colors.process, colors.signal, colors.result, colors.blush, colors.insight],
    buildAnimation: 'draw_left_to_right', buildDuration: 1500,
    buildEasing: 'easeOutExpo',
  },
  stepByStep: {
    durationPerStep: 4000,
    stepNumber: { style: 'section', color: colors.process, xPct: 0.08, yPct: 0.15 },
    stepTitle:  { style: 'heading', color: colors.chalk, xPct: 0.08, yPct: 0.28 },
    contentZone: { xPct: 0.08, yPct: 0.38, widthPct: 0.84, heightPct: 0.5 },
    progressBar: { yPct: 0.95, height: 4, bg: colors.ash, fill: colors.process },
    transition: 'slide', transitionMs: 500,
  },
  endCard: {
    duration: 5000,
    bg: { type: 'gradient' },
    logo:  { yPct: 0.35, maxWidthPct: 0.2 },
    cta:   { style: 'heading', yPct: 0.55 },
  },
};

// ═══════════════════════════════════════════════════
// LOWER THIRDS — McQueen restraint
// ═══════════════════════════════════════════════════

export const lowerThirds = {
  documentary: {
    x: 96, y: 830, width: 550, height: 120,
    bg: 'transparent',
    nameSize: 32, nameWeight: 600,
    roleSize: 18, roleWeight: 300,
    textShadow: true,
    underlineWidth: 2, underlineColor: colors.chalk, underlineOpacity: 0.6,
    animateIn: 'fadeUp', animateInMs: 600,
    hold: 3500,
    animateOut: 'fadeIn', animateOutMs: 400,
  },
  netflix: {
    x: 96, y: 840, width: 480, height: 110,
    bg: 'transparent',
    nameSize: 24, nameWeight: 500, nameTracking: 0.05,
    roleSize: 16, roleWeight: 300, roleTracking: 0.08,
    textColor: colors.bone,
    animateIn: 'fadeIn', animateInMs: 800,
    hold: 4000,
    animateOut: 'fadeIn', animateOutMs: 600,
  },
};

// ═══════════════════════════════════════════════════
// FRAME RATE GUIDE
// ═══════════════════════════════════════════════════

export const frameRate = {
  cinematic: 24,    // Filmic, dreamy
  broadcast: 25,    // PAL
  online:    30,    // YouTube/online DEFAULT
  smooth:    60,    // Screen recordings, UI tutorials
  default:   30,
};

// ═══════════════════════════════════════════════════
// VISUAL HIERARCHY (Gestalt + research)
// ═══════════════════════════════════════════════════

export const visualHierarchy = {
  weights: {
    sizeLarge:       10,
    motionAnimated:  9,
    colorSaturated:  8,
    contrastHigh:    8,
    positionTopLeft: 7,
    isolation:       7,
    weightBold:      6,
    proximityGroup:  5,
    textureDetail:   4,
  },
  whitespace: {
    minElementSpacing: 16,
    comfortSpacing:    32,
    generousSpacing:   64,
    sectionSpacing:    96,
    breathingRoomPct:  0.30,
  },
};

// ═══════════════════════════════════════════════════
// RENDERING PRESETS — Complete visual recipes per scene type
// Consumed by Remotion components + graphics-engine.py
// Each preset: typography, motion, grade, and composition.
// ═══════════════════════════════════════════════════

export const RENDERING_PRESETS = {
  titleCardCinematic: {
    type: 'title',
    typography: { title: 'display', subtitle: 'overline' },
    motion: { enter: 'dramatic', exit: 'exit' },
    vignette: 0.5,
    grain: 0.035,
    letterbox: true,
    glow: { radius: 300, opacity: 0.06 },
    composition: 'center-weighted, 42% vertical golden ratio zone',
  },
  explainerScene: {
    type: 'diagram',
    typography: { heading: 'title3', body: 'body', label: 'caption' },
    motion: { enter: 'confident', exit: 'exit' },
    vignette: 0.35,
    grain: 0.025,
    letterbox: false,
    glow: { radius: 350, opacity: 0.04 },
    composition: 'left-aligned, content inset 200px, accent line left edge',
  },
  quoteCard: {
    type: 'title',
    typography: { quote: 'title2', attribution: 'callout' },
    fontStack: 'accent',
    motion: { enter: 'gentle', exit: 'exit' },
    vignette: 0.45,
    grain: 0.04,
    letterbox: true,
    glow: { radius: 250, opacity: 0.05 },
    composition: 'center, cosmic gradient bg, ghostly quotation mark',
  },
  sectionHeader: {
    type: 'title',
    typography: { overline: 'overline', title: 'title1' },
    motion: { enter: 'smooth', exit: 'exit' },
    vignette: 0.45,
    grain: 0.03,
    letterbox: true,
    glow: { radius: 200, opacity: 0.05 },
    composition: 'center, obsidian bg, gold line above title',
  },
  lowerThird: {
    type: 'overlay',
    typography: { name: 'headline', role: 'caption' },
    motion: { enter: 'confident', exit: 'exit' },
    vignette: 0,
    grain: 0,
    letterbox: false,
    glow: { radius: 0, opacity: 0 },
    composition: 'bottom-left, title-safe zone, transparent bg',
  },
  chapterCard: {
    type: 'title',
    typography: { number: 'overline', title: 'title2' },
    motion: { enter: 'smooth', exit: 'exit' },
    vignette: 0.40,
    grain: 0.03,
    letterbox: true,
    glow: { radius: 180, opacity: 0.04 },
    composition: 'center, void bg, number above title',
  },
  comparisonSplit: {
    type: 'diagram',
    typography: { heading: 'title3', label: 'caption', body: 'body' },
    motion: { enter: 'confident', exit: 'exit' },
    vignette: 0.30,
    grain: 0.025,
    letterbox: false,
    glow: { radius: 300, opacity: 0.04 },
    composition: 'split-panel, divider at 50%, content inset 96px per side',
  },
  dataVisualization: {
    type: 'diagram',
    typography: { heading: 'title3', label: 'caption', axis: 'small' },
    motion: { enter: 'confident', exit: 'exit' },
    vignette: 0.25,
    grain: 0.020,
    letterbox: false,
    glow: { radius: 350, opacity: 0.03 },
    composition: 'chart-zone centered, 80% width, axis labels outside',
  },
  stepByStep: {
    type: 'diagram',
    typography: { number: 'section', title: 'heading', body: 'body' },
    motion: { enter: 'smooth', exit: 'exit' },
    vignette: 0.30,
    grain: 0.025,
    letterbox: false,
    glow: { radius: 280, opacity: 0.04 },
    composition: 'left-aligned, step number prominent, progress bar at bottom',
  },
  montageScene: {
    type: 'montage',
    typography: { label: 'headline', counter: 'caption' },
    motion: { enter: 'confident', exit: 'exit' },
    vignette: 0.35,
    grain: 0.025,
    letterbox: false,
    glow: { radius: 0, opacity: 0 },
    composition: 'rapid-cut fragments, center-weighted text, dynamic rhythm',
  },
  outroScene: {
    type: 'title',
    typography: { brand: 'title3', heading: 'title1', subtext: 'callout' },
    motion: { enter: 'gentle', exit: 'exit' },
    vignette: 0.45,
    grain: 0.035,
    letterbox: true,
    glow: { radius: 200, opacity: 0.05 },
    composition: 'center, brand above heading, cosmic gradient, CTA below',
  },
};
