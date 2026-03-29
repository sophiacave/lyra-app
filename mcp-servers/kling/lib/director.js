/**
 * Like One Studio — Director Engine
 * 
 * Generates Hollywood-grade presenter segments:
 * 1. Shot list from screenplay beats
 * 2. AI image generation (Faye in different angles/settings/poses)
 * 3. Image-to-video animation (movement, gestures)
 * 4. Lip-sync with audio
 * 5. Multi-angle editing cuts
 */

// ── SHOT LIBRARY ──
// Each beat type maps to a set of cinematographic shots
export const SHOT_LIBRARY = {
  intrigue: [
    { angle: 'close-up', setting: 'dark moody studio, single key light from left, slight haze', motion: 'slow push in', pose: 'looking directly at camera, slight knowing smile' },
    { angle: 'extreme-close-up', setting: 'dark background, rim light highlighting profile', motion: 'very slow dolly left', pose: 'eyes locked on camera, one eyebrow slightly raised' },
  ],
  teach: [
    { angle: 'medium-shot', setting: 'modern bright studio with soft fill light, clean background', motion: 'gentle sway, natural gestures', pose: 'confident stance, gesturing with hands while explaining' },
    { angle: 'medium-close-up', setting: 'warm office environment, bookshelves slightly blurred behind', motion: 'subtle nod and hand movement', pose: 'engaged, leaning slightly forward' },
    { angle: 'over-shoulder', setting: 'standing at a glass whiteboard with faint diagrams', motion: 'turning from board to camera', pose: 'pointing at something off-screen, then turning to camera' },
  ],
  concept: [
    { angle: 'medium-shot', setting: 'clean studio, soft gradient background, professional lighting', motion: 'natural talking gestures', pose: 'explaining with open hand gestures' },
    { angle: 'medium-close-up', setting: 'modern workspace, shallow depth of field', motion: 'slight lean forward', pose: 'thoughtful expression, occasional nod' },
  ],
  awe: [
    { angle: 'wide-shot', setting: 'vast dark space with subtle particles of light floating, ethereal atmosphere', motion: 'slow crane up', pose: 'standing confidently, looking upward with wonder' },
    { angle: 'medium-shot', setting: 'silhouetted against projected neural network visualization', motion: 'slow reveal from shadow to light', pose: 'turning to face camera with inspired expression' },
  ],
  revelation: [
    { angle: 'close-up', setting: 'dramatic single light source, dark surroundings, cinematic contrast', motion: 'slow zoom in', pose: 'intense eye contact, deliberate pause, slight head tilt' },
    { angle: 'extreme-close-up', setting: 'backlit with lens flare, warm golden light', motion: 'very slow push in', pose: 'eyes wide with discovery, lips parted before speaking' },
  ],
  build: [
    { angle: 'medium-shot', setting: 'dynamic workspace, multiple screens visible, tech environment', motion: 'quick cuts between angles', pose: 'animated, building excitement, hand gestures increasing' },
    { angle: 'medium-close-up', setting: 'bright modern studio, energetic lighting', motion: 'natural movement, slight camera shake', pose: 'speaking with passion, counting on fingers' },
  ],
  energy: [
    { angle: 'medium-shot', setting: 'high-energy lighting, colorful accent lights', motion: 'handheld feel, dynamic', pose: 'expressive, big gestures, moving in space' },
  ],
  close: [
    { angle: 'medium-close-up', setting: 'warm soft lighting, intimate atmosphere, slightly out of focus background', motion: 'slow gentle pull back', pose: 'warm smile, relaxed posture, direct eye contact' },
    { angle: 'medium-shot', setting: 'beautiful warm sunset lighting through window, peaceful', motion: 'slow dolly back, widening', pose: 'content expression, slight nod, arms open' },
  ],
};

// ── FAYE'S APPEARANCE PROMPT ──
// Consistent identity across all shots
export const FAYE_IDENTITY = {
  base: 'young woman with shoulder-length dark hair, warm brown eyes, natural beauty, confident and approachable, wearing a simple elegant black top',
  style: 'photorealistic, 8K quality, cinema camera, shallow depth of field, professional color grading, natural skin texture',
  negative: 'cartoon, anime, illustration, painting, blurry, distorted, uncanny valley, heavy makeup, exaggerated features, stock photo look',
};

// ── BUILD IMAGE PROMPT ──
export function buildImagePrompt(shot, persona = FAYE_IDENTITY) {
  return {
    prompt: `${persona.base}, ${shot.pose}, ${shot.setting}, ${shot.angle} camera angle, ${persona.style}`,
    negative: persona.negative,
  };
}

// ── BUILD ANIMATION PROMPT ──
export function buildAnimationPrompt(shot) {
  return `Natural human movement, ${shot.motion}, realistic breathing and micro-expressions, subtle body language, professional cinematography, no sudden jumps, smooth continuous motion`;
}

// ── GENERATE SHOT LIST FOR SCREENPLAY ──
export function generateShotList(scenes) {
  const shotList = [];

  for (const scene of scenes) {
    if (!scene.type.includes('presenter')) continue;

    const beat = scene.beat || 'teach';
    const shots = SHOT_LIBRARY[beat] || SHOT_LIBRARY.teach;
    
    // Pick a shot — cycle through available shots for variety
    const shotIndex = shotList.filter(s => s.beat === beat).length % shots.length;
    const shot = shots[shotIndex];

    shotList.push({
      sceneId: scene.id,
      beat,
      ...shot,
      dialogue: scene.dialogue,
      direction: scene.direction,
    });
  }

  return shotList;
}

// ── FULL PRESENTER PIPELINE ──
// Returns the steps needed to generate a complete presenter clip
export function planPresenterPipeline(scene) {
  const beat = scene.beat || 'teach';
  const shots = SHOT_LIBRARY[beat] || SHOT_LIBRARY.teach;
  const shot = shots[0]; // Primary shot

  return {
    step1_image: {
      description: 'Generate AI image of Faye in this specific shot',
      ...buildImagePrompt(shot),
    },
    step2_animate: {
      description: 'Animate the image into a moving video clip',
      prompt: buildAnimationPrompt(shot),
      duration: '5', // Will be extended if scene is longer
    },
    step3_lipsync: {
      description: 'Apply lip-sync with the scene audio',
      mode: 'audio2video',
    },
    step4_grade: {
      description: 'Color grade to match the scene mood',
      beat,
    },
  };
}
