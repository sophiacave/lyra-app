#!/usr/bin/env node
/**
 * Like One Studio — Content Pipeline
 * Converts markdown lesson files into JSON configs for Remotion rendering.
 *
 * Markdown format:
 *   ---
 *   title: Lesson Title
 *   subtitle: Course Name — Like One Academy
 *   slug: lesson-slug
 *   template: explainer|tutorial|comparison
 *   voice: sophia
 *   ---
 *
 *   ## narration
 *   Your narration text here. Multiple sentences OK.
 *   highlight: keyword1, keyword2
 *
 *   ## concept: Diagram Title
 *   - Node Label (0.2, 0.3)
 *   - Another Node (0.5, 0.5)
 *   - Third Node (0.8, 0.3)
 *   connect: 0-1, 1-2
 *   duration: 5
 *
 *   ## code: Block Title
 *   ```javascript
 *   const x = 1;
 *   ```
 *   highlight-lines: 1
 *   duration: 8
 *
 *   ## quote
 *   > The quote text here.
 *   — Attribution Name
 *   duration: 5
 *
 *   ## comparison
 *   left: Thing A
 *   right: Thing B
 *   left-items: Strength 1, Strength 2, Strength 3
 *   right-items: Strength 1, Strength 2, Strength 3
 *   duration: 8
 *
 *   ## timeline
 *   1. Step Label | Description
 *   2. Step Label | Description
 *   duration: 6
 *
 *   ## outro
 *   heading: Like One Academy
 *   subtext: Next lesson info
 *   cta: likeone.ai/learn
 *   duration: 4
 *
 * Usage: node studio/content-pipeline.js content/lessons/my-lesson.md [--render]
 *   --render  Immediately pass the generated config to render-lesson.js
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const STUDIO_DIR = path.dirname(new URL(import.meta.url).pathname);

// ── Parse frontmatter ──
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim();
    }
  });

  const body = content.slice(match[0].length).trim();
  return { meta, body };
}

// ── Parse a single section block ──
function parseSection(block, defaultVoice) {
  const lines = block.trim().split('\n');
  const header = lines[0];
  const rest = lines.slice(1).join('\n').trim();

  // ## narration
  if (header.match(/^##\s+narration/i)) {
    return parseNarration(rest, defaultVoice);
  }

  // ## concept: Title
  if (header.match(/^##\s+concept/i)) {
    const title = header.replace(/^##\s+concept[:\s]*/i, '').trim();
    return parseConcept(title, rest);
  }

  // ## code: Title
  if (header.match(/^##\s+code/i)) {
    const title = header.replace(/^##\s+code[:\s]*/i, '').trim();
    return parseCode(title, rest);
  }

  // ## quote
  if (header.match(/^##\s+quote/i)) {
    return parseQuote(rest);
  }

  // ## comparison
  if (header.match(/^##\s+comparison/i)) {
    return parseComparison(rest);
  }

  // ## timeline
  if (header.match(/^##\s+timeline/i)) {
    return parseTimeline(rest);
  }

  // ## outro
  if (header.match(/^##\s+outro/i)) {
    return parseOutro(rest);
  }

  return null;
}

// ── Section parsers ──

function parseNarration(text, defaultVoice) {
  const lines = text.split('\n');
  const metaLines = [];
  const textLines = [];

  for (const line of lines) {
    if (line.match(/^(highlight|voice|duration):/i)) {
      metaLines.push(line);
    } else {
      textLines.push(line);
    }
  }

  const section = {
    type: 'narration',
    text: textLines.join(' ').replace(/\s+/g, ' ').trim(),
    voice: defaultVoice || 'sophia',
    highlightWords: [],
  };

  for (const ml of metaLines) {
    const [key, ...vals] = ml.split(':');
    const value = vals.join(':').trim();
    if (key.trim().toLowerCase() === 'highlight') {
      section.highlightWords = value.split(',').map(w => w.trim()).filter(Boolean);
    } else if (key.trim().toLowerCase() === 'voice') {
      section.voice = value;
    } else if (key.trim().toLowerCase() === 'duration') {
      section.durationS = parseInt(value, 10);
    }
  }

  return section;
}

function parseConcept(title, text) {
  const lines = text.split('\n');
  const nodes = [];
  let connections = [];
  let durationS = 5;

  for (const line of lines) {
    // - Node Label (0.2, 0.3)
    const nodeMatch = line.match(/^-\s+(.+?)\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
    if (nodeMatch) {
      nodes.push({
        x: parseFloat(nodeMatch[2]),
        y: parseFloat(nodeMatch[3]),
        label: nodeMatch[1].trim(),
      });
      continue;
    }

    // connect: 0-1, 1-2
    const connMatch = line.match(/^connect:\s*(.+)/i);
    if (connMatch) {
      connections = connMatch[1].split(',').map(c => {
        const [a, b] = c.trim().split('-').map(Number);
        return [a, b];
      });
      continue;
    }

    // duration: 5
    const durMatch = line.match(/^duration:\s*(\d+)/i);
    if (durMatch) {
      durationS = parseInt(durMatch[1], 10);
    }
  }

  return {
    type: 'concept',
    label: title || 'Concept',
    nodes,
    connections,
    durationS,
  };
}

function parseCode(title, text) {
  const codeMatch = text.match(/```(\w*)\n([\s\S]*?)```/);
  const language = codeMatch ? codeMatch[1] || 'javascript' : 'javascript';
  const code = codeMatch ? codeMatch[2].trimEnd() : '';

  let highlightLines = [];
  let durationS = 8;

  const lines = text.split('\n');
  for (const line of lines) {
    const hlMatch = line.match(/^highlight-lines?:\s*(.+)/i);
    if (hlMatch) {
      highlightLines = hlMatch[1].split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
    }
    const durMatch = line.match(/^duration:\s*(\d+)/i);
    if (durMatch) {
      durationS = parseInt(durMatch[1], 10);
    }
  }

  return {
    type: 'code',
    label: title || 'Code',
    language,
    code,
    highlightLines,
    durationS,
  };
}

function parseQuote(text) {
  const lines = text.split('\n').filter(l => l.trim());
  let quote = '';
  let attribution = '';
  let durationS = 5;

  for (const line of lines) {
    if (line.startsWith('>')) {
      quote += line.replace(/^>\s*/, '') + ' ';
    } else if (line.match(/^[—–-]\s*/)) {
      attribution = line.replace(/^[—–-]\s*/, '— ');
    } else {
      const durMatch = line.match(/^duration:\s*(\d+)/i);
      if (durMatch) durationS = parseInt(durMatch[1], 10);
    }
  }

  return {
    type: 'quote',
    quote: quote.trim(),
    attribution: attribution || '',
    durationS,
  };
}

function parseComparison(text) {
  const lines = text.split('\n');
  const section = {
    type: 'comparison',
    leftTitle: 'Option A',
    rightTitle: 'Option B',
    leftItems: [],
    rightItems: [],
    durationS: 8,
  };

  for (const line of lines) {
    const m = (key) => {
      const regex = new RegExp(`^${key}:\\s*(.+)`, 'i');
      return line.match(regex);
    };

    let match;
    if ((match = m('left'))) section.leftTitle = match[1].trim();
    else if ((match = m('right'))) section.rightTitle = match[1].trim();
    else if ((match = m('left-items'))) section.leftItems = match[1].split(',').map(s => s.trim());
    else if ((match = m('right-items'))) section.rightItems = match[1].split(',').map(s => s.trim());
    else if ((match = m('duration'))) section.durationS = parseInt(match[1], 10);
  }

  return section;
}

function parseTimeline(text) {
  const lines = text.split('\n');
  const steps = [];
  let durationS = 6;

  for (const line of lines) {
    // 1. Step Label | Description
    const stepMatch = line.match(/^\d+\.\s+(.+?)\s*\|\s*(.+)/);
    if (stepMatch) {
      steps.push({ label: stepMatch[1].trim(), description: stepMatch[2].trim() });
      continue;
    }
    const durMatch = line.match(/^duration:\s*(\d+)/i);
    if (durMatch) durationS = parseInt(durMatch[1], 10);
  }

  return { type: 'timeline', steps, durationS };
}

function parseOutro(text) {
  const section = {
    type: 'outro',
    heading: 'Like One Academy',
    subtext: '',
    ctaText: 'likeone.ai/learn',
    durationS: 4,
  };

  const lines = text.split('\n');
  for (const line of lines) {
    const m = (key) => {
      const regex = new RegExp(`^${key}:\\s*(.+)`, 'i');
      return line.match(regex);
    };

    let match;
    if ((match = m('heading'))) section.heading = match[1].trim();
    else if ((match = m('subtext'))) section.subtext = match[1].trim();
    else if ((match = m('cta'))) section.ctaText = match[1].trim();
    else if ((match = m('duration'))) section.durationS = parseInt(match[1], 10);
  }

  return section;
}

// ── Main: markdown → JSON config ──
function markdownToConfig(mdPath) {
  const raw = readFileSync(mdPath, 'utf-8');
  const { meta, body } = parseFrontmatter(raw);

  const config = {
    title: meta.title || 'Untitled Lesson',
    subtitle: meta.subtitle || 'Like One Academy',
    slug: meta.slug || meta.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'untitled',
    sections: [],
  };

  // Split on ## headers
  const blocks = body.split(/(?=^## )/m).filter(b => b.trim());

  for (const block of blocks) {
    const section = parseSection(block, meta.voice || 'sophia');
    if (section) {
      config.sections.push(section);
    }
  }

  return config;
}

// ── CLI ──
const args = process.argv.slice(2);
const mdPath = args.find(a => !a.startsWith('--'));
const shouldRender = args.includes('--render');

if (!mdPath) {
  console.error('Usage: node studio/content-pipeline.js <lesson.md> [--render]');
  process.exit(1);
}

if (!existsSync(mdPath)) {
  console.error(`❌ File not found: ${mdPath}`);
  process.exit(1);
}

console.log(`📝 Parsing: ${mdPath}`);
const config = markdownToConfig(mdPath);

// Write JSON config
const configDir = path.join(STUDIO_DIR, '..', 'content', 'configs');
if (!existsSync(configDir)) mkdirSync(configDir, { recursive: true });

const configPath = path.join(configDir, `${config.slug}.json`);
writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`✅ Config written: ${configPath}`);
console.log(`   ${config.sections.length} sections: ${config.sections.map(s => s.type).join(' → ')}`);

if (shouldRender) {
  console.log(`\n🎬 Launching render pipeline...`);
  const renderScript = path.join(STUDIO_DIR, 'render-lesson-v2.js');
  try {
    execSync(`node "${renderScript}" "${configPath}"`, { stdio: 'inherit', cwd: path.join(STUDIO_DIR, '..') });
  } catch (e) {
    console.error(`❌ Render failed`);
    process.exit(1);
  }
}
