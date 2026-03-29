#!/usr/bin/env node
/**
 * Like One Studio V9 — Prompt Validator
 * 
 * Enforces the 7-element shot formula on every Kling prompt.
 * A prompt CANNOT ship without all 7 elements present.
 * Replaces the old enhancePrompt() which destroyed visual differentiation.
 */

const ELEMENTS = {
  subject: {
    required: true,
    patterns: [
      /close-up|medium shot|wide shot|extreme|macro|aerial|overhead|low angle|pov|establishing/i,
      /of [a-z]/i, // "of a person", "of neural pathways"
    ],
    hint: 'Must specify shot type + subject with physical details',
  },
  camera: {
    required: true,
    patterns: [
      /arri|red|sony|blackmagic|alexa|v-raptor|fx[369]|venice/i,
      /shot on|camera/i,
    ],
    hint: 'Must specify camera body (ARRI Alexa 65, RED V-RAPTOR, etc)',
  },
  lens: {
    required: true,
    patterns: [
      /\d+mm/i,
      /anamorphic|prime|zoom|macro|telephoto|wide[- ]angle/i,
      /f\/?\d/i, // f/1.4, f2.8
    ],
    hint: 'Must specify focal length (85mm, 24mm) and/or lens type (anamorphic, prime)',
  },
  lighting: {
    required: true,
    patterns: [
      /rim light|key light|fill|backlight|volumetric|golden hour|blue hour|tungsten|neon/i,
      /\d{4}K/i, // 3200K, 5600K
      /natural light|ambient light|practical|motivated/i,
    ],
    hint: 'Must specify light sources + color temperature (rim light 5600K, volumetric fog)',
  },
  motion: {
    required: true,
    patterns: [
      /dolly|tracking|crane|orbit|steadicam|handheld|pan|tilt|static|locked|tripod/i,
      /slow|gentle|rapid|smooth|floating/i,
    ],
    hint: 'Must specify camera movement with speed (slow dolly in, lateral tracking, static locked)',
  },
  color: {
    required: true,
    patterns: [
      /kodak|fuji|vision3|eterna|portra|ektar/i,
      /teal|amber|warm|cool|desaturated|muted|vivid|cyan|magenta/i,
      /palette|color science|grade/i,
    ],
    hint: 'Must specify color palette or film stock (Kodak Vision3 500T, teal-amber palette)',
  },
  negative: {
    required: true,
    patterns: [
      /negative:|no |without |exclude /i,
      /blur|distortion|morph|text|watermark|extra/i,
    ],
    hint: 'Must include negative prompt (blur, distortion, text, morphing, extra limbs)',
  },
};

const BANNED_GENERIC = [
  'cinematic lighting',
  'professional color grading', 
  'smooth camera movement',
  '4K quality',
  'high quality',
  'beautiful',
  'stunning',
  'amazing',
  'epic',
];

function validatePrompt(prompt, sceneId = 'unknown') {
  const results = {
    sceneId,
    prompt,
    valid: true,
    score: 0,
    maxScore: 7,
    missing: [],
    warnings: [],
    elements: {},
  };

  // Check each element
  for (const [name, config] of Object.entries(ELEMENTS)) {
    const found = config.patterns.some(p => p.test(prompt));
    results.elements[name] = found;
    if (found) {
      results.score++;
    } else if (config.required) {
      results.valid = false;
      results.missing.push(`${name}: ${config.hint}`);
    }
  }

  // Check for banned generic terms
  for (const term of BANNED_GENERIC) {
    if (prompt.toLowerCase().includes(term)) {
      results.warnings.push(`Generic term detected: "${term}" — be more specific`);
    }
  }

  // Check prompt length (too short = not enough detail)
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount < 20) {
    results.warnings.push(`Prompt is only ${wordCount} words — aim for 30-60 for hero shots`);
  }

  return results;
}

function validateScreenplay(screenplay) {
  const report = {
    title: screenplay.title || 'Untitled',
    totalScenes: 0,
    passedScenes: 0,
    failedScenes: 0,
    scenes: [],
  };

  const scenes = screenplay.scenes || [];
  report.totalScenes = scenes.length;

  for (const scene of scenes) {
    const prompt = scene.visual || scene.kling_prompt || scene.broll_prompt || '';
    if (!prompt) continue; // skip presenter-only scenes
    const result = validatePrompt(prompt, scene.id || scene.scene_id);
    report.scenes.push(result);
    if (result.valid) {
      report.passedScenes++;
    } else {
      report.failedScenes++;
    }
  }

  return report;
}

function printReport(report) {
  console.log(`\n🎬 PROMPT VALIDATION: ${report.title}`);
  console.log('═'.repeat(60));
  console.log(`📊 ${report.passedScenes}/${report.totalScenes} scenes passed (${report.failedScenes} failed)\n`);

  for (const scene of report.scenes) {
    const status = scene.valid ? '✅' : '❌';
    console.log(`${status} ${scene.sceneId} — ${scene.score}/${scene.maxScore} elements`);

    if (scene.missing.length > 0) {
      for (const m of scene.missing) {
        console.log(`   ⚠️  Missing: ${m}`);
      }
    }
    if (scene.warnings.length > 0) {
      for (const w of scene.warnings) {
        console.log(`   💡 ${w}`);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  if (report.failedScenes > 0) {
    console.log('🚫 BLOCKED — Fix all prompts before generating. No Kling credits wasted on weak prompts.');
  } else {
    console.log('✨ ALL PROMPTS VALIDATED — Ready for keyframe generation.');
  }
}

// CLI mode
if (process.argv[2]) {
  const { readFileSync } = await import('fs');
  const data = JSON.parse(readFileSync(process.argv[2], 'utf-8'));
  const report = validateScreenplay(data);
  printReport(report);
  process.exit(report.failedScenes > 0 ? 1 : 0);
}

export { validatePrompt, validateScreenplay, printReport };
