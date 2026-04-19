#!/usr/bin/env node
/**
 * sync-wiki-to-courses.cjs — Wiki → Course Sync (Phase 2)
 *
 * Reads edited wiki markdown and pushes changes back to source lesson files.
 * Converts pure markdown back to HTML-in-markdown format used by the academy.
 *
 * Usage:
 *   node scripts/sync-wiki-to-courses.cjs              # sync all changed lessons
 *   node scripts/sync-wiki-to-courses.cjs --dry-run    # preview changes without writing
 *   node scripts/sync-wiki-to-courses.cjs --force       # sync all lessons regardless of changes
 *   node scripts/sync-wiki-to-courses.cjs --course ai-foundations  # sync one course only
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ACADEMY_DIR = path.join(__dirname, '..', 'content', 'academy');
const WIKI_DIR = path.join(__dirname, '..', 'wiki', 'academy');
const COURSES_JSON = path.join(ACADEMY_DIR, 'courses.json');
const CHECKSUMS_FILE = path.join(__dirname, '..', '.wiki-checksums.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const courseFilter = args.includes('--course') ? args[args.indexOf('--course') + 1] : null;

// --- Markdown → HTML conversion (reverse of generate-wiki) ---

function markdownToHtml(md) {
  let html = md;

  // Convert code blocks FIRST (protect from other conversions)
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    const langAttr = lang ? ` class="language-${lang}"` : '';
    codeBlocks.push(`<pre><code${langAttr}>${encodeEntities(code.trimEnd())}</code></pre>`);
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Convert inline code (protect from other conversions)
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${encodeEntities(code)}</code>`);
    return `%%INLINE_${idx}%%`;
  });

  // Convert headings
  html = html.replace(/^### (.+)$/gm, (_, t) => `<h3>${t.trim()}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, t) => `<h2 class="section-title">${t.trim()}</h2>`);
  html = html.replace(/^# (.+)$/gm, (_, t) => `<h1>${t.trim()}</h1>`);

  // Convert bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert italic
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert list blocks: consecutive lines starting with -
  html = html.replace(/(^- .+$(\n- .+$)*)/gm, (block) => {
    const items = block.split('\n').map(line => {
      const content = line.replace(/^- /, '').trim();
      return `    <li>${content}</li>`;
    });
    return `<ul>\n${items.join('\n')}\n</ul>`;
  });

  // Convert numbered lists
  html = html.replace(/(^\d+\. .+$(\n\d+\. .+$)*)/gm, (block) => {
    const items = block.split('\n').map(line => {
      const content = line.replace(/^\d+\. /, '').trim();
      return `    <li>${content}</li>`;
    });
    return `<ol>\n${items.join('\n')}\n</ol>`;
  });

  // Convert paragraphs: non-empty lines that aren't already HTML
  html = html.replace(/^(?!<[a-z/]|%%|$|\s*$)(.+)$/gm, (_, text) => {
    return `<p>${text.trim()}</p>`;
  });

  // Restore code blocks and inline code
  codeBlocks.forEach((block, i) => {
    html = html.replace(`%%CODEBLOCK_${i}%%`, block);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINE_${i}%%`, code);
  });

  // Convert interactive component sections back to data-learn divs
  html = convertInteractiveBack(html);

  // Clean up excessive blank lines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html.trim();
}

function encodeEntities(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function convertInteractiveBack(html) {
  // Convert Quiz sections back to QuizMC data-learn divs
  html = html.replace(/<h3>Quiz<\/h3>\n\n([\s\S]*?)(?=\n<h[23]|\n*$)/g, (_, quizBlock) => {
    const questions = [];
    const qRegex = /<strong>Q(\d+): (.+?)<\/strong>\n([\s\S]*?)(?=<strong>Q\d|$)/g;
    let qMatch;
    while ((qMatch = qRegex.exec(quizBlock)) !== null) {
      const q = qMatch[2];
      const optBlock = qMatch[3];
      const options = [];
      let correct = 0;
      let explanation = '';
      const optLines = optBlock.trim().split('\n');
      optLines.forEach(line => {
        const optMatch = line.match(/^\s*(✓| )\s*([A-Z])\.\s*(.+)$/);
        if (optMatch) {
          if (optMatch[1] === '✓') correct = options.length;
          options.push(optMatch[3]);
        }
        const expMatch = line.match(/^\s*<em>(.+)<\/em>$/);
        if (expMatch) explanation = expMatch[1];
      });
      const qObj = { q, options, correct };
      if (explanation) qObj.explanation = explanation;
      questions.push(qObj);
    }
    if (questions.length === 0) return `<h3>Quiz</h3>\n\n${quizBlock}`;
    const props = JSON.stringify({ questions });
    return `<div data-learn="QuizMC" data-props='${props}'></div>`;
  });

  // Convert Flash Cards back
  html = html.replace(/<h3>(.+?)<\/h3>\n\n((?:<strong>Card \d+:<\/strong>\n[\s\S]*?\n\n)+)/g, (full, title, cardBlock) => {
    if (title === 'Quiz' || title === 'Match Exercise' || title === 'Prompt Lab') return full;
    const cards = [];
    const cardRegex = /<strong>Card \d+:<\/strong>\nFront: (.+)\nBack: (.+)/g;
    let cMatch;
    while ((cMatch = cardRegex.exec(cardBlock)) !== null) {
      cards.push({ front: cMatch[1], back: cMatch[2] });
    }
    if (cards.length === 0) return full;
    const props = JSON.stringify({ title, cards });
    return `<div data-learn="FlashDeck" data-props='${props}'></div>`;
  });

  // Convert Match Exercise back
  html = html.replace(/<h3>Match Exercise<\/h3>\n\n(<ul>\n[\s\S]*?<\/ul>)/g, (_, listBlock) => {
    const pairs = [];
    const pairRegex = /<li>(.+?) → (.+?)<\/li>/g;
    let pMatch;
    while ((pMatch = pairRegex.exec(listBlock)) !== null) {
      pairs.push({ left: pMatch[1], right: pMatch[2] });
    }
    if (pairs.length === 0) return `<h3>Match Exercise</h3>\n\n${listBlock}`;
    const props = JSON.stringify({ pairs });
    return `<div data-learn="MatchConnect" data-props='${props}'></div>`;
  });

  return html;
}

// --- Wiki file parsing ---

function parseWikiLesson(content) {
  const lines = content.split('\n');
  const meta = {};

  // Parse wiki header: # Title, **Key:** Value, --- separator
  let bodyStart = 0;
  if (lines[0] && lines[0].startsWith('# ')) {
    meta.title = lines[0].replace(/^# /, '').trim();
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === '---') {
      bodyStart = i + 1;
      break;
    }
    const kvMatch = line.match(/^\*\*(\w+):\*\*\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase();
      const val = kvMatch[2].trim();
      if (key === 'order') meta.order = parseInt(val, 10);
      else if (key === 'type') meta.type = val;
      else if (key === 'access') meta.free = val === 'Free';
      else if (key === 'course') meta.courseName = val;
    }
  }

  // Skip blank lines after ---
  while (bodyStart < lines.length && lines[bodyStart].trim() === '') bodyStart++;

  const body = lines.slice(bodyStart).join('\n');
  return { meta, body };
}

function buildFrontmatter(meta, courseSlug) {
  const lines = ['---'];
  lines.push(`title: "${meta.title || 'Untitled'}"`);
  lines.push(`course: "${courseSlug}"`);
  if (meta.order !== undefined) lines.push(`order: ${meta.order}`);
  lines.push(`type: "${meta.type || 'lesson'}"`);
  lines.push(`free: ${meta.free === true}`);
  lines.push('---');
  return lines.join('\n');
}

// --- Checksum tracking ---

function loadChecksums() {
  try {
    return JSON.parse(fs.readFileSync(CHECKSUMS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveChecksums(checksums) {
  fs.writeFileSync(CHECKSUMS_FILE, JSON.stringify(checksums, null, 2) + '\n');
}

function fileChecksum(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// --- Main sync ---

function syncWikiToCourses() {
  if (!fs.existsSync(COURSES_JSON)) {
    console.error('❌ courses.json not found at', COURSES_JSON);
    process.exit(1);
  }
  if (!fs.existsSync(WIKI_DIR)) {
    console.error('❌ Wiki not found at', WIKI_DIR, '— run generate-wiki.cjs first');
    process.exit(1);
  }

  const courses = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf8'));
  const checksums = loadChecksums();
  const newChecksums = {};

  let synced = 0;
  let skipped = 0;
  let errors = 0;

  courses.tiers.forEach(tier => {
    tier.courses.forEach(course => {
      if (courseFilter && course.slug !== courseFilter) return;

      const wikiCourseDir = path.join(WIKI_DIR, course.slug);
      const srcCourseDir = path.join(ACADEMY_DIR, course.slug);

      if (!fs.existsSync(wikiCourseDir)) return;

      const wikiFiles = fs.readdirSync(wikiCourseDir)
        .filter(f => f.endsWith('.md') && f !== 'README.md');

      wikiFiles.forEach(file => {
        const wikiPath = path.join(wikiCourseDir, file);
        const srcPath = path.join(srcCourseDir, file);
        const relPath = `${course.slug}/${file}`;

        // Check if wiki file has changed since last sync
        const currentChecksum = fileChecksum(wikiPath);
        newChecksums[relPath] = currentChecksum;

        if (!FORCE && checksums[relPath] === currentChecksum) {
          skipped++;
          return;
        }

        try {
          const wikiContent = fs.readFileSync(wikiPath, 'utf8');
          const { meta, body } = parseWikiLesson(wikiContent);

          // If source file exists, preserve its frontmatter course slug
          let courseSlug = course.slug;
          if (fs.existsSync(srcPath)) {
            const srcContent = fs.readFileSync(srcPath, 'utf8');
            const srcMatch = srcContent.match(/^---\n[\s\S]*?\n---/);
            if (srcMatch) {
              const courseMatch = srcMatch[0].match(/course:\s*"([^"]+)"/);
              if (courseMatch) courseSlug = courseMatch[1];
            }
          }

          const frontmatter = buildFrontmatter(meta, courseSlug);
          const htmlBody = markdownToHtml(body);
          const output = `${frontmatter}${htmlBody}\n`;

          if (DRY_RUN) {
            console.log(`📝 Would sync: ${relPath}`);
          } else {
            fs.mkdirSync(srcCourseDir, { recursive: true });
            fs.writeFileSync(srcPath, output);
            console.log(`✅ Synced: ${relPath}`);
          }
          synced++;
        } catch (err) {
          console.error(`❌ Error syncing ${relPath}:`, err.message);
          errors++;
        }
      });
    });
  });

  // Save checksums (even on dry run, to show what would be tracked)
  if (!DRY_RUN) {
    // Merge new checksums with existing (preserving unprocessed courses)
    const merged = { ...checksums, ...newChecksums };
    saveChecksums(merged);
  }

  console.log(`\n📊 Sync complete: ${synced} synced, ${skipped} unchanged, ${errors} errors`);
  if (DRY_RUN) console.log('   (dry run — no files were written)');
}

syncWikiToCourses();
