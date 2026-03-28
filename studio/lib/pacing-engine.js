/**
 * Like One Studio — Pacing Engine
 * Research-backed timing constants and duration calculators.
 *
 * Sources: MIT edX (Guo 2014), Mayer's Multimedia Learning,
 * Walter Murch, Kurzgesagt analysis, 3B1B, EBU R128.
 */

// ── Pacing Constants ──
export const PACING = {
  FPS: 30,

  // Narration Speed (MIT edX: 140-160 WPM optimal)
  WPM_SLOW: 125,        // New concepts, definitions
  WPM_NORMAL: 145,      // Standard teaching (our target)
  WPM_FAST: 165,        // Recaps, transitions
  WPM_HOOK: 180,        // Opening hook, rapid-fire

  // Pauses (Walter Murch breathing + Mayer segmenting)
  PAUSE_MICRO_MS: 300,
  PAUSE_SECTION_MS: 800,
  PAUSE_DRAMATIC_MS: 1500,
  PAUSE_CHAPTER_MS: 2000,
  PAUSE_POST_QUESTION_MS: 1000,
  PAUSE_POST_REVEAL_MS: 1200,

  // Scene Duration Targets
  TITLE_CARD_S: 4.0,
  SECTION_HEADER_S: 3.0,
  OUTRO_S: 5.0,
  MIN_SCENE_S: 2.0,          // 2-second rule
  MAX_STATIC_S: 4.0,         // Hard ceiling before motion required
  CONCEPT_MIN_S: 7.0,        // 7-second comprehension rule

  // Visual Lead (Kurzgesagt technique)
  VISUAL_LEAD_FRAMES: 3,     // 100ms before audio

  // Engagement (MIT edX)
  MAX_VIDEO_S: 360,           // 6 minutes sweet spot
  HOOK_WINDOW_S: 5,
  FIRST_PAYOFF_S: 30,
  VISUAL_PULSE_S: 4,          // Base visual change interval
  PATTERN_INTERRUPT_S: 45,
};

// ── Duration Calculators (research-backed) ──

/**
 * Calculate optimal scene duration in seconds.
 */
export function calculateDurationS(section) {
  switch (section.type) {
    case 'narration': {
      // Audio drives duration + 1.5s buffer for text to settle
      const audioDur = section.audioDuration || section.durationS || 8;
      return audioDur + 1.5;
    }
    case 'concept': {
      // 7-second rule: min 7s + 0.8s per node
      const nodes = section.nodes?.length || 3;
      return Math.max(PACING.CONCEPT_MIN_S, 4 + nodes * 0.8);
    }
    case 'code': {
      // 1.5s per line + 5s base
      const lines = (section.code || '').split('\n').length;
      return 5 + lines * 1.5;
    }
    case 'quote': {
      // (word_count / 2) + 2s
      const words = (section.quote || '').split(' ').length;
      return words / 2 + 2;
    }
    case 'comparison': {
      const items = Math.max(
        (section.leftItems || []).length,
        (section.rightItems || []).length
      );
      return 6 + items * 0.8;
    }
    case 'timeline': {
      const steps = (section.steps || []).length;
      return 4 + steps * 1.2;
    }
    case 'outro':
      return section.durationS || PACING.OUTRO_S;
    default:
      return section.durationS || 6;
  }
}

/**
 * Calculate breathing gap duration between sections.
 * Returns seconds.
 */
export function calculateGapS(prevSection, nextSection) {
  if (!prevSection) return 0;

  // After quote or concept: longer pause for absorption
  if (prevSection.type === 'quote' || prevSection.type === 'concept') return 1.5;

  // Same type → shorter gap
  if (prevSection.type === nextSection?.type) return 0.8;

  // Default between different types
  return 1.0;
}

/**
 * Build a complete TimingMap for a lesson config.
 * Returns array of { startFrame, endFrame, gapEndFrame, section, index }.
 */
export function buildTimingMap(config, fps = PACING.FPS) {
  const sections = config.sections || [];
  const timeline = [];
  let currentFrame = 0;

  // Title card
  const titleFrames = Math.round(PACING.TITLE_CARD_S * fps);
  timeline.push({
    type: 'title',
    startFrame: currentFrame,
    endFrame: currentFrame + titleFrames,
    gapEndFrame: currentFrame + titleFrames + Math.round(0.8 * fps),
    index: -1,
  });
  currentFrame = timeline[0].gapEndFrame;

  // Sections with gaps
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const durationS = calculateDurationS(section);
    const durationFrames = Math.round(durationS * fps);

    const gapS = calculateGapS(
      i > 0 ? sections[i - 1] : { type: 'title' },
      sections[i + 1] || null
    );
    const gapFrames = Math.round(gapS * fps);

    timeline.push({
      type: section.type,
      startFrame: currentFrame,
      endFrame: currentFrame + durationFrames,
      gapEndFrame: currentFrame + durationFrames + gapFrames,
      section,
      index: i,
    });

    currentFrame = timeline[timeline.length - 1].gapEndFrame;
  }

  return {
    timeline,
    totalFrames: currentFrame,
    totalDurationS: currentFrame / fps,
  };
}

/**
 * Measure WPM of text given audio duration.
 */
export function measureWPM(text, audioDurationS) {
  const words = text.split(/\s+/).length;
  return (words / audioDurationS) * 60;
}

/**
 * Get visual start frame with lead compensation.
 * Visuals start 3 frames before audio (Kurzgesagt technique).
 */
export function getVisualStartFrame(audioOffsetMs, fps = PACING.FPS) {
  const audioFrame = Math.round((audioOffsetMs / 1000) * fps);
  return Math.max(0, audioFrame - PACING.VISUAL_LEAD_FRAMES);
}
