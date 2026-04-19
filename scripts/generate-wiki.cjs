#!/usr/bin/env node
/**
 * generate-wiki.js — Academy Wiki Generator
 *
 * Converts all academy lessons from HTML-in-markdown to pure text wiki format.
 * The wiki is the living reference layer between AI product reality and course content.
 * When AI products update, twin updates the wiki, wiki syncs to courses.
 *
 * Usage: node scripts/generate-wiki.js
 * Output: wiki/academy/{course-slug}/README.md + {lesson-slug}.md
 */

const fs = require('fs');
const path = require('path');

const ACADEMY_DIR = path.join(__dirname, '..', 'content', 'academy');
const WIKI_DIR = path.join(__dirname, '..', 'wiki', 'academy');
const COURSES_JSON = path.join(ACADEMY_DIR, 'courses.json');

// Strip HTML to plain text, preserving structure
function htmlToText(html) {
  let text = html;

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Convert headings
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `# ${stripTags(c).trim()}\n`);
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `## ${stripTags(c).trim()}\n`);
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `### ${stripTags(c).trim()}\n`);

  // Convert list items
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => `- ${stripTags(c).trim()}\n`);

  // Convert code blocks
  text = text.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, c) => {
    const decoded = decodeEntities(c.trim());
    return `\n\`\`\`\n${decoded}\n\`\`\`\n`;
  });

  // Convert inline code
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${decodeEntities(c.trim())}\``);

  // Convert strong/bold
  text = text.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, c) => `**${c.trim()}**`);
  text = text.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, c) => `**${c.trim()}**`);

  // Convert emphasis
  text = text.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, c) => `*${c.trim()}*`);

  // Convert links
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, c) => {
    const label = stripTags(c).trim();
    return `[${label}](${href})`;
  });

  // Convert br to newline
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // Extract interactive component data
  text = text.replace(/<div[^>]*data-learn="(\w+)"[^>]*data-props='([^']*)'[^>]*><\/div>/gi, (_, type, propsJson) => {
    try {
      const props = JSON.parse(propsJson);
      return formatInteractiveComponent(type, props);
    } catch {
      return `[Interactive: ${type}]\n`;
    }
  });

  // Remove remaining HTML tags
  text = stripTags(text);

  // Decode HTML entities
  text = decodeEntities(text);

  // Clean up excessive whitespace
  text = text.replace(/\n{4,}/g, '\n\n\n');
  text = text.replace(/[ \t]+$/gm, '');

  return text.trim();
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&larr;/g, '←')
    .replace(/&rarr;/g, '→')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '');
}

function formatInteractiveComponent(type, props) {
  let output = '';

  if (type === 'QuizMC' && props.questions) {
    output += '\n### Quiz\n\n';
    props.questions.forEach((q, i) => {
      output += `**Q${i + 1}: ${q.q}**\n`;
      q.options.forEach((opt, j) => {
        const marker = j === q.correct ? '✓' : ' ';
        output += `  ${marker} ${String.fromCharCode(65 + j)}. ${opt}\n`;
      });
      if (q.explanation) output += `  *${q.explanation}*\n`;
      output += '\n';
    });
  }

  if (type === 'FlashDeck' && props.cards) {
    output += `\n### ${props.title || 'Flash Cards'}\n\n`;
    props.cards.forEach((card, i) => {
      output += `**Card ${i + 1}:**\n`;
      output += `Front: ${card.front.replace(/\n/g, ' ')}\n`;
      output += `Back: ${card.back.replace(/\n/g, ' ')}\n\n`;
    });
  }

  if (type === 'MatchConnect' && props.pairs) {
    output += '\n### Match Exercise\n\n';
    props.pairs.forEach(p => {
      output += `- ${p.left} → ${p.right}\n`;
    });
    output += '\n';
  }

  if (type === 'SortOrder' && props.items) {
    output += `\n### ${props.title || 'Sort Exercise'}\n\n`;
    const sorted = [...props.items].sort((a, b) => a.order - b.order);
    sorted.forEach((item, i) => {
      output += `${i + 1}. ${item.text || item.label}\n`;
    });
    output += '\n';
  }

  if (type === 'PromptLab') {
    output += '\n### Prompt Lab\n';
    if (props.prompt) output += `Template: ${props.prompt}\n`;
    if (props.example) output += `Example: ${props.example}\n`;
    output += '\n';
  }

  return output || `[Interactive: ${type}]\n`;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      let val = rest.join(':').trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val === 'true') val = true;
      if (val === 'false') val = false;
      if (!isNaN(val) && val !== '') val = Number(val);
      meta[key.trim()] = val;
    }
  });

  const body = content.slice(match[0].length);
  return { meta, body };
}

function generateWiki() {
  // Load courses catalog
  const courses = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf8'));

  // Create wiki root
  fs.mkdirSync(WIKI_DIR, { recursive: true });

  let totalLessons = 0;
  let totalCourses = 0;
  const indexLines = ['# Like One Academy — Offline Wiki\n'];
  indexLines.push('> Pure text reference of all academy courses and lessons.');
  indexLines.push('> Auto-generated. Twin updates this when AI products change.');
  indexLines.push(`> Last generated: ${new Date().toISOString().split('T')[0]}\n`);

  // Process each tier
  courses.tiers.forEach(tier => {
    indexLines.push(`## ${tier.emoji} ${tier.name}\n`);
    indexLines.push(`${tier.description}\n`);

    tier.courses.forEach(course => {
      const courseDir = path.join(ACADEMY_DIR, course.slug);
      const wikiCourseDir = path.join(WIKI_DIR, course.slug);

      if (!fs.existsSync(courseDir)) {
        indexLines.push(`- ${course.emoji} **${course.title}** — *no content directory*`);
        return;
      }

      fs.mkdirSync(wikiCourseDir, { recursive: true });

      // Get all lesson files
      const lessonFiles = fs.readdirSync(courseDir)
        .filter(f => f.endsWith('.md'))
        .sort();

      // Parse and convert each lesson
      const lessons = lessonFiles.map(file => {
        const raw = fs.readFileSync(path.join(courseDir, file), 'utf8');
        const { meta, body } = parseFrontmatter(raw);
        const text = htmlToText(body);
        return { file, meta, text, slug: file.replace('.md', '') };
      }).sort((a, b) => (a.meta.order || 99) - (b.meta.order || 99));

      // Write course README
      const readmeLines = [
        `# ${course.emoji} ${course.title}\n`,
        `${course.description}\n`,
        `**Tier:** ${tier.name} | **Lessons:** ${lessons.length} | **Status:** ${course.status}\n`,
        '## Lessons\n',
      ];

      lessons.forEach((lesson, i) => {
        const typeTag = lesson.meta.type === 'quiz' ? ' [Quiz]' : '';
        const freeTag = lesson.meta.free ? ' (Free)' : '';
        readmeLines.push(`${i + 1}. [${lesson.meta.title || lesson.slug}](${lesson.slug}.md)${typeTag}${freeTag}`);
      });

      fs.writeFileSync(
        path.join(wikiCourseDir, 'README.md'),
        readmeLines.join('\n') + '\n'
      );

      // Write each lesson
      lessons.forEach(lesson => {
        const header = [
          `# ${lesson.meta.title || lesson.slug}`,
          '',
          `**Course:** ${course.title}`,
          `**Order:** ${lesson.meta.order || '?'}`,
          `**Type:** ${lesson.meta.type || 'lesson'}`,
          lesson.meta.free ? '**Access:** Free' : '**Access:** Premium',
          '',
          '---',
          '',
        ].join('\n');

        fs.writeFileSync(
          path.join(wikiCourseDir, `${lesson.slug}.md`),
          header + lesson.text + '\n'
        );
        totalLessons++;
      });

      totalCourses++;
      indexLines.push(`- ${course.emoji} [**${course.title}**](${course.slug}/README.md) — ${lessons.length} lessons`);
    });

    indexLines.push('');
  });

  // Write wiki index
  indexLines.push('---');
  indexLines.push(`\n**${totalCourses} courses | ${totalLessons} lessons** converted to pure text.`);
  indexLines.push('');
  indexLines.push('## How This Wiki Works');
  indexLines.push('');
  indexLines.push('1. **Source of truth for factual content** — when AI products update, update the wiki');
  indexLines.push('2. **Sync to courses** — run `node scripts/sync-wiki-to-courses.js` to push changes back');
  indexLines.push('3. **AI-readable** — every lesson is pure markdown, no HTML, easy for any AI to read and update');
  indexLines.push('4. **Version controlled** — git tracks every change, nothing is lost');

  fs.writeFileSync(path.join(WIKI_DIR, 'README.md'), indexLines.join('\n') + '\n');

  console.log(`✅ Wiki generated: ${totalCourses} courses, ${totalLessons} lessons`);
  console.log(`📁 Output: ${WIKI_DIR}`);
}

generateWiki();
