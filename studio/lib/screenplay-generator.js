#!/usr/bin/env node
/**
 * Like One Studio — AI Screenplay Generator
 * Generates structured JSON screenplays from a topic/lesson description.
 *
 * Uses Anthropic Claude API (via native fetch) to create screenplays that
 * match the exact format expected by the Like One Studio render pipeline.
 * Falls back to OpenAI if --provider openai is specified.
 *
 * Module usage:
 *   import { generateScreenplay } from './studio/lib/screenplay-generator.js';
 *   const screenplay = await generateScreenplay({ topic, title, durationTarget, style });
 *
 * CLI usage:
 *   node studio/lib/screenplay-generator.js --topic "Neural Networks" --title "How Your Brain Learns" --duration 120
 *   node studio/lib/screenplay-generator.js --topic "RAG" --title "Your AI Memory" --duration 90 --style comparison
 *   node studio/lib/screenplay-generator.js --topic "Bias" --title "AI Fairness" --style explainer --theme ethics-safety
 *   node studio/lib/screenplay-generator.js --topic "Prompts" --title "Better Prompts" --out content/configs/my-lesson.json
 *   node studio/lib/screenplay-generator.js --topic "Ethics" --title "AI Ethics" --provider openai --model gpt-4o
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

// ── Constants ──

const STUDIO_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TEMPLATES_DIR = path.join(STUDIO_DIR, 'templates');
const CONFIGS_DIR = path.join(STUDIO_DIR, '..', 'content', 'configs');

const VALID_STYLES = ['explainer', 'tutorial', 'comparison'];

const VALID_SECTION_TYPES = [
  'narration', 'concept', 'code', 'quote', 'comparison', 'timeline', 'outro',
  // V3 types
  'gradient-art', 'icon-reveal', 'stat-reveal', 'process-flow',
  'progressive-reveal', 'split-screen', 'icon-grid',
];

const VALID_THEMES = [
  'ai-foundations', 'prompt-writing', 'ethics-safety', 'creatives',
  'business', 'productivity', 'rag-vectors', 'claude-beginners',
];

const VALID_ICONS = [
  'brain', 'neuron', 'network', 'globe', 'lightbulb', 'arrow-flow',
  'scale', 'calculator', 'chat-bubble', 'database', 'filter', 'eye',
  'shield', 'lock', 'clock', 'graph', 'code', 'document', 'user',
  'sparkle', 'target', 'layers', 'link', 'search', 'settings',
];

const VALID_PACES = ['hook', 'concept', 'recap', 'standard'];
const VALID_MOODS = ['dramatic', 'calm', 'energetic', 'contemplative'];

// ── API Key Resolution ──

function resolveApiKey(provider = 'anthropic') {
  const envVarName = provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
  const credKey = provider === 'anthropic' ? 'anthropic' : 'openai';

  // 1. Environment variable
  if (process.env[envVarName]) return process.env[envVarName];

  // 2. .env file in project root
  const envPath = path.join(STUDIO_DIR, '..', '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(new RegExp(`^${envVarName}=(.+)$`, 'm'));
    if (match) return match[1].trim();
  }

  // 3. .env.local file in project root
  const envLocalPath = path.join(STUDIO_DIR, '..', '.env.local');
  if (existsSync(envLocalPath)) {
    const envContent = readFileSync(envLocalPath, 'utf-8');
    const match = envContent.match(new RegExp(`^${envVarName}=(.+)$`, 'm'));
    if (match) return match[1].trim();
  }

  // 4. brain_context credentials file
  const brainPaths = [
    path.join(process.env.HOME || '', '.brain_context', 'credentials.json'),
    path.join(process.env.HOME || '', 'brain_context', 'credentials.json'),
    path.join(STUDIO_DIR, '..', 'brain_context', 'credentials.json'),
  ];
  for (const bp of brainPaths) {
    if (existsSync(bp)) {
      try {
        const creds = JSON.parse(readFileSync(bp, 'utf-8'));
        if (creds[credKey]?.api_key) return creds[credKey].api_key;
        if (typeof creds[credKey] === 'string') return creds[credKey];
      } catch { /* ignore parse errors */ }
    }
  }

  return null;
}

// ── System Prompt ──

function buildSystemPrompt(style, templateJson) {
  return `You are Like One Studio's screenplay architect. You write structured JSON screenplays for educational video lessons rendered by a Remotion-based pipeline.

CRITICAL RULES:
1. Output ONLY valid JSON — no markdown fences, no comments, no trailing commas.
2. Every screenplay must follow the exact schema the render pipeline expects.
3. Narration text must be written for spoken delivery: contractions OK, no parenthetical asides, no visual descriptions in narration. Write as if speaking to one person across a table.
4. Target 140-160 words per minute for narration (the TTS engine handles pacing). Each narration section should be 2-5 sentences, 30-80 words.
5. Visual sections (concept, code, timeline, comparison, process-flow, progressive-reveal, split-screen, icon-grid, stat-reveal, icon-reveal, gradient-art) carry their own timing via durationS.
6. Alternate between narration and visual sections. Never place two narrations back-to-back without a visual between them.
7. The first section should be a visual hook (gradient-art or stat-reveal) followed by a narration that opens with a compelling question or surprising fact.
8. The last section must be an outro.
9. Include a closing quote before the outro when the style warrants it.

SECTION TYPE SCHEMAS:

narration:
  { "type": "narration", "text": "...", "voice": "sophia", "highlightWords": ["word1", "word2"], "pace": "hook|concept|recap|standard" }
  - highlightWords: 3-5 key terms that get visual emphasis
  - pace: "hook" for openers (faster), "concept" for teaching (slower), "recap" for summaries, "standard" default

concept:
  { "type": "concept", "label": "Title", "nodes": [{"x":0.2,"y":0.3,"label":"A"},...], "connections": [[0,1],[1,2]], "durationS": 5-8 }
  - x/y are 0-1 proportional coordinates. Space nodes with at least 0.15 gap.
  - connections reference node indices.

code:
  { "type": "code", "label": "Title", "language": "javascript|python|...", "code": "...", "highlightLines": [1,2], "durationS": 6-10 }
  - Keep code under 12 lines. highlightLines are 1-based.

quote:
  { "type": "quote", "quote": "...", "attribution": "— Name", "durationS": 5 }

comparison:
  { "type": "comparison", "leftTitle": "A", "rightTitle": "B", "leftItems": ["..."], "rightItems": ["..."], "durationS": 8 }

timeline:
  { "type": "timeline", "steps": [{"label":"Step","description":"..."}], "durationS": 6-8 }

outro:
  { "type": "outro", "heading": "Next: ...", "subtext": "...", "ctaText": "likeone.ai", "durationS": 4 }

gradient-art:
  { "type": "gradient-art", "text": "Bold statement", "subtext": "Supporting detail", "mood": "dramatic|calm|energetic|contemplative", "colorTheme": "...", "durationS": 4-5 }

icon-reveal:
  { "type": "icon-reveal", "icon": "brain|neuron|network|globe|lightbulb|...", "label": "Title", "subtitle": "...", "colorTheme": "...", "durationS": 4 }

stat-reveal:
  { "type": "stat-reveal", "stat": "86", "unit": "billion", "label": "description of the stat", "colorTheme": "...", "durationS": 5 }

process-flow:
  { "type": "process-flow", "label": "Title", "steps": [{"label":"Step","desc":"..."}], "colorTheme": "...", "durationS": 5-7 }

progressive-reveal:
  { "type": "progressive-reveal", "label": "Title", "steps": [{"icon":"brain","label":"Step","detail":"..."}], "colorTheme": "...", "durationS": 6-10 }

split-screen:
  { "type": "split-screen", "leftTitle": "A", "rightTitle": "B", "leftIcon": "...", "rightIcon": "...", "leftItems": ["..."], "rightItems": ["..."], "colorTheme": "...", "durationS": 6 }

icon-grid:
  { "type": "icon-grid", "label": "Title", "items": [{"icon":"brain","label":"..."}], "colorTheme": "...", "durationS": 5 }

VALID ICONS: brain, neuron, network, globe, lightbulb, arrow-flow, scale, calculator, chat-bubble, database, filter, eye, shield, lock, clock, graph, code, document, user, sparkle, target, layers, link, search, settings

COLOR THEMES: ai-foundations, prompt-writing, ethics-safety, creatives, business, productivity, rag-vectors, claude-beginners

TOP-LEVEL SCHEMA:
{
  "version": "3.0",
  "title": "Lesson Title",
  "subtitle": "Course Name — Like One Academy",
  "slug": "kebab-case-slug",
  "colorTheme": "theme-id",
  "narrative": "progressive",
  "voice": "s2pro-warm",
  "ttsEngine": "s2pro",
  "sections": [ ... ]
}

${templateJson ? `REFERENCE TEMPLATE (${style}):\n${templateJson}\n` : ''}
DURATION GUIDANCE:
- Each narration at ~150 WPM contributes its word count / 2.5 seconds (rough estimate).
- Visual-only sections use their durationS directly.
- The pacing engine adds ~1.5s buffer per narration and ~1s gaps between sections.
- Plan sections to hit the target total duration accounting for these overheads.`;
}

// ── LLM API Calls ──

async function callClaude(apiKey, systemPrompt, userPrompt, model = 'claude-sonnet-4-6') {
  const apiUrl = process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com/v1/messages';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
        // Prefill technique: start the assistant response with '{' for reliable JSON
        { role: 'assistant', content: '{' },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errBody.slice(0, 500)}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;
  if (!content) throw new Error('Claude returned empty response');

  // Reconstruct full JSON (we prefilled with '{')
  return '{' + content;
}

async function callOpenAI(apiKey, systemPrompt, userPrompt, model = 'gpt-4o') {
  const apiUrl = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errBody.slice(0, 500)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned empty response');

  return content;
}

async function callLLM(apiKey, systemPrompt, userPrompt, model, provider) {
  if (provider === 'openai') {
    return callOpenAI(apiKey, systemPrompt, userPrompt, model);
  }
  return callClaude(apiKey, systemPrompt, userPrompt, model);
}

// ── Validation & Post-Processing ──

function validateAndFix(screenplay, opts) {
  // Ensure top-level fields
  if (!screenplay.version) screenplay.version = '3.0';
  if (!screenplay.title) screenplay.title = opts.title || 'Untitled Lesson';
  if (!screenplay.subtitle) screenplay.subtitle = 'Like One Academy';
  if (!screenplay.slug) {
    screenplay.slug = (opts.title || 'untitled')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
  }
  if (!screenplay.colorTheme || !VALID_THEMES.includes(screenplay.colorTheme)) {
    screenplay.colorTheme = opts.theme || 'ai-foundations';
  }
  if (!screenplay.narrative) screenplay.narrative = 'progressive';
  if (!screenplay.voice) screenplay.voice = 's2pro-warm';
  if (!screenplay.ttsEngine) screenplay.ttsEngine = 's2pro';

  if (!Array.isArray(screenplay.sections) || screenplay.sections.length === 0) {
    throw new Error('Screenplay has no sections');
  }

  const issues = [];

  // Validate each section
  for (let i = 0; i < screenplay.sections.length; i++) {
    const s = screenplay.sections[i];

    if (!s.type || !VALID_SECTION_TYPES.includes(s.type)) {
      issues.push(`Section ${i}: invalid type "${s.type}"`);
      continue;
    }

    switch (s.type) {
      case 'narration':
        if (!s.text || typeof s.text !== 'string') issues.push(`Section ${i}: narration missing text`);
        if (!s.voice) s.voice = 'sophia';
        if (!Array.isArray(s.highlightWords)) s.highlightWords = [];
        if (!s.pace || !VALID_PACES.includes(s.pace)) s.pace = 'concept';
        break;

      case 'concept':
        if (!s.label) s.label = 'Concept';
        if (!Array.isArray(s.nodes) || s.nodes.length === 0) issues.push(`Section ${i}: concept missing nodes`);
        if (!Array.isArray(s.connections)) s.connections = [];
        if (!s.durationS || s.durationS < 3) s.durationS = 5;
        // Validate node coordinates
        s.nodes?.forEach((n, ni) => {
          if (typeof n.x !== 'number' || n.x < 0 || n.x > 1) { n.x = 0.2 + (ni * 0.2) % 0.8; issues.push(`Section ${i} node ${ni}: fixed x`); }
          if (typeof n.y !== 'number' || n.y < 0 || n.y > 1) { n.y = 0.3 + (ni * 0.15) % 0.6; issues.push(`Section ${i} node ${ni}: fixed y`); }
          if (!n.label) n.label = `Node ${ni}`;
        });
        break;

      case 'code':
        if (!s.label) s.label = 'Code';
        if (!s.language) s.language = 'javascript';
        if (!s.code) issues.push(`Section ${i}: code missing code`);
        if (!Array.isArray(s.highlightLines)) s.highlightLines = [];
        if (!s.durationS || s.durationS < 3) s.durationS = 8;
        break;

      case 'quote':
        if (!s.quote) issues.push(`Section ${i}: quote missing text`);
        if (!s.attribution) s.attribution = '— Like One Academy';
        if (!s.durationS) s.durationS = 5;
        break;

      case 'comparison':
        if (!s.leftTitle) s.leftTitle = 'Option A';
        if (!s.rightTitle) s.rightTitle = 'Option B';
        if (!Array.isArray(s.leftItems)) s.leftItems = [];
        if (!Array.isArray(s.rightItems)) s.rightItems = [];
        if (!s.durationS) s.durationS = 8;
        break;

      case 'timeline':
        if (!Array.isArray(s.steps) || s.steps.length === 0) issues.push(`Section ${i}: timeline missing steps`);
        if (!s.durationS) s.durationS = 6;
        break;

      case 'outro':
        if (!s.heading) s.heading = 'Like One Academy';
        if (!s.subtext) s.subtext = '';
        if (!s.ctaText) s.ctaText = 'likeone.ai';
        if (!s.durationS) s.durationS = 4;
        break;

      case 'gradient-art':
        if (!s.text) issues.push(`Section ${i}: gradient-art missing text`);
        if (!s.mood || !VALID_MOODS.includes(s.mood)) s.mood = 'dramatic';
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 4;
        break;

      case 'icon-reveal':
        if (!s.icon || !VALID_ICONS.includes(s.icon)) s.icon = 'brain';
        if (!s.label) s.label = 'Title';
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 4;
        break;

      case 'stat-reveal':
        if (!s.stat) issues.push(`Section ${i}: stat-reveal missing stat`);
        if (!s.unit) s.unit = '';
        if (!s.label) s.label = '';
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 5;
        break;

      case 'process-flow':
        if (!s.label) s.label = 'Process';
        if (!Array.isArray(s.steps) || s.steps.length === 0) issues.push(`Section ${i}: process-flow missing steps`);
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 6;
        break;

      case 'progressive-reveal':
        if (!s.label) s.label = 'Steps';
        if (!Array.isArray(s.steps) || s.steps.length === 0) issues.push(`Section ${i}: progressive-reveal missing steps`);
        // Validate step icons
        s.steps?.forEach(step => {
          if (!step.icon || !VALID_ICONS.includes(step.icon)) step.icon = 'sparkle';
        });
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 8;
        break;

      case 'split-screen':
        if (!s.leftTitle) s.leftTitle = 'Left';
        if (!s.rightTitle) s.rightTitle = 'Right';
        if (!Array.isArray(s.leftItems)) s.leftItems = [];
        if (!Array.isArray(s.rightItems)) s.rightItems = [];
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 6;
        break;

      case 'icon-grid':
        if (!s.label) s.label = 'Grid';
        if (!Array.isArray(s.items) || s.items.length === 0) issues.push(`Section ${i}: icon-grid missing items`);
        s.items?.forEach(item => {
          if (!item.icon || !VALID_ICONS.includes(item.icon)) item.icon = 'sparkle';
        });
        if (!s.colorTheme) s.colorTheme = screenplay.colorTheme;
        if (!s.durationS) s.durationS = 5;
        break;
    }
  }

  // Ensure last section is outro
  const lastSection = screenplay.sections[screenplay.sections.length - 1];
  if (lastSection.type !== 'outro') {
    screenplay.sections.push({
      type: 'outro',
      heading: 'Like One Academy',
      subtext: `Continue your learning journey`,
      ctaText: 'likeone.ai',
      durationS: 4,
    });
    issues.push('Added missing outro');
  }

  // Remove underscore-prefixed keys (template metadata)
  const removeTemplateMeta = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(removeTemplateMeta);
    const cleaned = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!k.startsWith('_')) cleaned[k] = removeTemplateMeta(v);
    }
    return cleaned;
  };
  const cleaned = removeTemplateMeta(screenplay);

  return { screenplay: cleaned, issues };
}

/**
 * Estimate total duration of a screenplay in seconds.
 * Mirrors the pacing engine logic for a rough estimate.
 */
function estimateDuration(screenplay) {
  let totalS = 4.0 + 0.8; // title card + gap
  const sections = screenplay.sections || [];

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    let sectionS = 0;

    if (s.type === 'narration') {
      const words = (s.text || '').split(/\s+/).length;
      const wpm = s.pace === 'hook' ? 170 : s.pace === 'recap' ? 160 : 145;
      sectionS = (words / wpm) * 60 + 1.5; // +1.5 buffer like pacing engine
    } else {
      sectionS = s.durationS || 5;
    }

    // Inter-section gap
    const gapS = ['quote', 'concept', 'stat-reveal', 'gradient-art', 'icon-reveal'].includes(s.type) ? 1.5
      : (i > 0 && sections[i - 1].type === s.type) ? 0.8
      : 1.0;

    totalS += sectionS + gapS;
  }

  return Math.round(totalS);
}

// ── Main Generator ──

/**
 * Generate a screenplay for a Like One Studio lesson.
 *
 * @param {Object} opts
 * @param {string} opts.topic - The lesson topic (e.g., "Neural Networks")
 * @param {string} opts.title - The lesson title (e.g., "How Your Brain Learns")
 * @param {number} [opts.durationTarget=120] - Target duration in seconds
 * @param {string} [opts.style='explainer'] - Lesson style: explainer, tutorial, comparison
 * @param {string} [opts.theme] - Color theme override
 * @param {string} [opts.provider='anthropic'] - LLM provider: 'anthropic' (default) or 'openai'
 * @param {string} [opts.model] - Model override (default: claude-sonnet-4-6 or gpt-4o)
 * @param {string} [opts.apiKey] - API key (falls back to env/credentials)
 * @returns {Promise<{screenplay: Object, estimatedDuration: number, issues: string[], provider: string, model: string}>}
 */
export async function generateScreenplay(opts) {
  const {
    topic,
    title,
    durationTarget = 120,
    style = 'explainer',
    theme,
    provider = 'anthropic',
    model: modelOverride,
    apiKey: providedKey,
  } = opts;

  if (!topic) throw new Error('Missing required option: topic');
  if (!title) throw new Error('Missing required option: title');

  const defaultModel = provider === 'openai' ? 'gpt-4o' : 'claude-sonnet-4-6';
  const model = modelOverride || defaultModel;

  const apiKey = providedKey || resolveApiKey(provider);
  if (!apiKey) {
    const envVar = provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
    throw new Error(
      `No ${provider} API key found. Set ${envVar} env var, add it to .env, or provide via opts.apiKey`
    );
  }

  const validStyle = VALID_STYLES.includes(style) ? style : 'explainer';

  // Load the reference template if available
  let templateJson = null;
  const templatePath = path.join(TEMPLATES_DIR, `${validStyle}.json`);
  if (existsSync(templatePath)) {
    templateJson = readFileSync(templatePath, 'utf-8');
  }

  const systemPrompt = buildSystemPrompt(validStyle, templateJson);

  // Estimate section count from duration target
  const avgSectionS = 12; // ~12s per section including gaps
  const targetSections = Math.max(4, Math.min(15, Math.round(durationTarget / avgSectionS)));

  const themeHint = theme && VALID_THEMES.includes(theme)
    ? theme
    : inferTheme(topic);

  const userPrompt = `Generate a ${validStyle}-style screenplay about "${topic}".

Lesson title: "${title}"
Subtitle: "${inferSubtitle(topic)} — Like One Academy"
Target duration: ~${durationTarget} seconds (roughly ${targetSections} sections including narrations and visuals)
Color theme: ${themeHint}

Requirements:
- Open with a visual hook (gradient-art or stat-reveal) that grabs attention immediately
- Follow with a narration that sets up the lesson with a question or surprising fact
- Alternate narration ↔ visual sections throughout (never two narrations in a row)
- Use 3-5 highlightWords per narration that are the key terms a learner should remember
- Include at least one of: concept diagram, process-flow, or progressive-reveal
- Close with a memorable quote + outro
- Make narration text conversational and clear — imagine explaining this to a curious friend
- Each narration: 2-5 sentences, 30-80 words
- Slug should be kebab-case derived from the title

Output the complete JSON screenplay matching the top-level schema. No markdown, just raw JSON.`;

  // Call LLM (Claude by default, OpenAI via --provider openai)
  const rawResponse = await callLLM(apiKey, systemPrompt, userPrompt, model, provider);

  // Parse JSON from response
  let parsed;
  try {
    parsed = JSON.parse(rawResponse);
  } catch (parseErr) {
    // Try to extract JSON from potential markdown wrapping
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseErr.message}\nRaw: ${rawResponse.slice(0, 500)}`);
    }
  }

  // Validate and fix
  const { screenplay, issues } = validateAndFix(parsed, { title, theme: themeHint });
  const estimatedDuration = estimateDuration(screenplay);

  // If duration is significantly off target, note it
  const durationDiff = Math.abs(estimatedDuration - durationTarget);
  if (durationDiff > durationTarget * 0.3) {
    issues.push(`Estimated duration ${estimatedDuration}s differs from target ${durationTarget}s by ${durationDiff}s`);
  }

  return { screenplay, estimatedDuration, issues, provider, model };
}

// ── Helper: Infer theme from topic ──

function inferTheme(topic) {
  const t = topic.toLowerCase();
  if (/neural|neuron|brain|deep.?learn|foundation|machine.?learn|model/i.test(t)) return 'ai-foundations';
  if (/prompt|instruct|writing|template/i.test(t)) return 'prompt-writing';
  if (/ethic|bias|safety|fairness|privacy|trust/i.test(t)) return 'ethics-safety';
  if (/creative|art|design|image|music|generate/i.test(t)) return 'creatives';
  if (/business|revenue|roi|enterprise|strategy|market/i.test(t)) return 'business';
  if (/product|workflow|automat|effici|tool|integrat/i.test(t)) return 'productivity';
  if (/rag|vector|embed|search|retriev|memory/i.test(t)) return 'rag-vectors';
  if (/claude|anthropic|beginner|start|intro|first/i.test(t)) return 'claude-beginners';
  return 'ai-foundations';
}

// ── Helper: Infer subtitle from topic ──

function inferSubtitle(topic) {
  const t = topic.toLowerCase();
  if (/neural|neuron|brain|deep.?learn|foundation|model/i.test(t)) return 'AI Foundations';
  if (/prompt|instruct/i.test(t)) return 'Prompt Engineering';
  if (/ethic|bias|safety|fairness|privacy/i.test(t)) return 'AI Ethics & Safety';
  if (/creative|art|design|image|music/i.test(t)) return 'AI for Creatives';
  if (/business|revenue|roi|enterprise/i.test(t)) return 'AI for Business';
  if (/product|workflow|automat/i.test(t)) return 'AI Productivity';
  if (/rag|vector|embed|search|retriev/i.test(t)) return 'RAG & Vector Search';
  if (/claude|anthropic/i.test(t)) return 'Getting Started with Claude';
  return 'Like One Academy';
}

// ── CLI ──

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Like One Studio — Screenplay Generator (Claude-powered)

Usage:
  node studio/lib/screenplay-generator.js --topic "Topic" --title "Title" [options]

Options:
  --topic <string>     Lesson topic (required)
  --title <string>     Lesson title (required)
  --duration <number>  Target duration in seconds (default: 120)
  --style <string>     Lesson style: explainer, tutorial, comparison (default: explainer)
  --theme <string>     Color theme: ai-foundations, prompt-writing, ethics-safety, etc.
  --provider <string>  LLM provider: anthropic (default) or openai
  --model <string>     Model override (default: claude-sonnet-4-6 / gpt-4o)
  --out <path>         Output file path (default: content/configs/<slug>.json)
  --dry-run            Print to stdout instead of writing file
  --help               Show this help

Environment:
  ANTHROPIC_API_KEY       Anthropic API key (primary — or set in .env / brain_context/credentials.json)
  OPENAI_API_KEY          OpenAI API key (for --provider openai)
  ANTHROPIC_API_BASE_URL  Custom Anthropic API base URL (optional)
  OPENAI_API_BASE_URL     Custom OpenAI API base URL (optional)

Examples:
  node studio/lib/screenplay-generator.js --topic "Neural Networks" --title "How Your Brain Learns" --duration 120
  node studio/lib/screenplay-generator.js --topic "RAG" --title "Your AI Memory" --style tutorial --duration 90
  node studio/lib/screenplay-generator.js --topic "GPT vs Claude" --title "Choosing Your AI" --style comparison
  node studio/lib/screenplay-generator.js --topic "Ethics" --title "AI Ethics" --provider openai --model gpt-4o
`);
    process.exit(0);
  }

  // Parse CLI arguments
  function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    if (idx === -1 || idx + 1 >= args.length) return undefined;
    return args[idx + 1];
  }

  const topic = getArg('topic');
  const title = getArg('title');
  const duration = parseInt(getArg('duration') || '120', 10);
  const style = getArg('style') || 'explainer';
  const theme = getArg('theme');
  const provider = getArg('provider') || 'anthropic';
  const model = getArg('model');
  const outPath = getArg('out');
  const dryRun = args.includes('--dry-run');

  if (!topic || !title) {
    console.error('Error: --topic and --title are required.');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  const effectiveModel = model || (provider === 'openai' ? 'gpt-4o' : 'claude-sonnet-4-6');

  console.log(`\n  Like One Studio — Screenplay Generator`);
  console.log('  ' + '='.repeat(44));
  console.log(`  Topic:    ${topic}`);
  console.log(`  Title:    ${title}`);
  console.log(`  Duration: ~${duration}s target`);
  console.log(`  Style:    ${style}`);
  console.log(`  Provider: ${provider}`);
  console.log(`  Model:    ${effectiveModel}`);
  if (theme) console.log(`  Theme:    ${theme}`);
  console.log();

  try {
    console.log('  Generating screenplay...');
    const startTime = Date.now();

    const result = await generateScreenplay({
      topic, title, durationTarget: duration, style, theme, provider, model: effectiveModel,
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const sectionCount = result.screenplay.sections.length;
    const narrationCount = result.screenplay.sections.filter(s => s.type === 'narration').length;
    const totalWords = result.screenplay.sections
      .filter(s => s.type === 'narration')
      .reduce((sum, s) => sum + (s.text || '').split(/\s+/).length, 0);

    console.log(`  Done in ${elapsed}s`);
    console.log();
    console.log(`  Sections:  ${sectionCount} (${narrationCount} narrations, ${sectionCount - narrationCount} visuals)`);
    console.log(`  Words:     ~${totalWords} narration words`);
    console.log(`  Duration:  ~${result.estimatedDuration}s estimated (target: ${duration}s)`);
    console.log(`  Flow:      ${result.screenplay.sections.map(s => s.type).join(' -> ')}`);

    if (result.issues.length > 0) {
      console.log(`\n  Fixes applied:`);
      result.issues.forEach(i => console.log(`    - ${i}`));
    }

    const json = JSON.stringify(result.screenplay, null, 2);

    if (dryRun) {
      console.log('\n' + json);
    } else {
      const slug = result.screenplay.slug;
      const outputFile = outPath
        ? path.resolve(outPath)
        : path.join(CONFIGS_DIR, `${slug}.json`);

      const outputDir = path.dirname(outputFile);
      if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

      writeFileSync(outputFile, json + '\n');
      console.log(`\n  Written: ${outputFile}`);
      console.log(`  Render:  node studio/render-lesson-v2.js "${outputFile}"`);
    }

    console.log();
  } catch (err) {
    console.error(`\n  Error: ${err.message}`);
    process.exit(1);
  }
}

// Run CLI if invoked directly
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('screenplay-generator.js') ||
  process.argv[1].includes('screenplay-generator')
);

if (isDirectRun) {
  main();
}
