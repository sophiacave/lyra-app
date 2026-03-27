#!/usr/bin/env node
/**
 * Migrate static HTML lessons → Markdown files with frontmatter.
 * Preserves all HTML content (interactive elements, inline JS/CSS).
 * Output: /content/academy/{course-slug}/{lesson-slug}.md
 */

const fs = require('fs');
const path = require('path');

const ACADEMY_DIR = path.join(__dirname, '..', 'public', 'academy');
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'academy');
const COURSES_FILE = path.join(__dirname, '..', 'public', 'academy', 'shared', 'courses.js');

// Parse courses.js to get lesson order and metadata
function parseCourses() {
  const content = fs.readFileSync(COURSES_FILE, 'utf8');
  // Extract the object literal by evaluating in a safe-ish way
  const match = content.match(/window\.ACADEMY_COURSES\s*=\s*(\{[\s\S]*\});/);
  if (!match) throw new Error('Could not parse courses.js');
  // Use Function constructor to eval the object literal
  const courses = new Function(`return ${match[1]}`)();
  return courses;
}

// Extract content from HTML file
function extractLesson(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Get title from <title> tag
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const fullTitle = titleMatch ? titleMatch[1] : '';
  // Title format is usually "Lesson Title — Course Name"
  const title = fullTitle.split('—')[0].trim().split('–')[0].trim();

  // Check if lesson is free (first 3 lessons)
  // We'll set this based on lesson order in the caller

  // Extract body content
  // We want everything inside <body>...</body>, minus the shared scripts at the end
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return null;

  let body = bodyMatch[1];

  // Remove shared script tags that will be handled by the new system
  body = body.replace(/<script src="\/academy\/shared\/courses\.js"><\/script>\s*/g, '');
  body = body.replace(/<script src="\/academy\/shared\/nav\.js"><\/script>\s*/g, '');
  body = body.replace(/<script src="\/academy\/shared\/lesson-nav\.js"><\/script>\s*/g, '');
  body = body.replace(/<script src="\/academy\/shared\/engine\.js"><\/script>\s*/g, '');
  body = body.replace(/<script src="\/academy\/shared\/auth\.js"><\/script>\s*/g, '');
  body = body.replace(/<script src="\/auth-state\.js"><\/script>\s*/g, '');

  // Extract any linked CSS (course-specific)
  const cssMatch = html.match(/<link rel="stylesheet" href="([^"]+)">/);
  const cssFile = cssMatch ? cssMatch[1] : null;

  return { title, body: body.trim(), cssFile };
}

// Determine lesson type from filename/content
function getLessonType(slug, content) {
  if (slug.includes('quiz') || slug.includes('assessment')) return 'quiz';
  if (slug.includes('playground') || slug.includes('explorer') || slug.includes('lab') || slug.includes('battle')) return 'lab';
  if (slug.includes('build') || slug.includes('wire-it') || slug.includes('design')) return 'builder';
  return 'lesson';
}

function main() {
  const courses = parseCourses();
  let totalFiles = 0;
  let totalCourses = 0;

  for (const [courseSlug, course] of Object.entries(courses)) {
    const courseDir = path.join(ACADEMY_DIR, courseSlug);
    const outputCourseDir = path.join(OUTPUT_DIR, courseSlug);

    if (!fs.existsSync(courseDir)) {
      console.log(`⚠️  Skipping ${courseSlug} — directory not found`);
      continue;
    }

    fs.mkdirSync(outputCourseDir, { recursive: true });
    totalCourses++;

    course.lessons.forEach((lesson, index) => {
      const htmlFile = path.join(courseDir, `${lesson.slug}.html`);

      if (!fs.existsSync(htmlFile)) {
        console.log(`  ⚠️  Missing: ${courseSlug}/${lesson.slug}.html`);
        return;
      }

      const extracted = extractLesson(htmlFile);
      if (!extracted) {
        console.log(`  ❌ Failed to extract: ${courseSlug}/${lesson.slug}.html`);
        return;
      }

      const type = getLessonType(lesson.slug, extracted.body);
      const isFree = index < 3; // First 3 lessons are free

      const frontmatter = [
        '---',
        `title: "${lesson.title.replace(/"/g, '\\"')}"`,
        `course: "${courseSlug}"`,
        `order: ${index + 1}`,
        `type: "${type}"`,
        `free: ${isFree}`,
        extracted.cssFile ? `css: "${extracted.cssFile}"` : null,
        '---',
        '',
      ].filter(Boolean).join('\n');

      const mdContent = frontmatter + extracted.body + '\n';
      const outputFile = path.join(outputCourseDir, `${lesson.slug}.md`);
      fs.writeFileSync(outputFile, mdContent);
      totalFiles++;
    });

    console.log(`✅ ${courseSlug}: ${course.lessons.length} lessons migrated`);
  }

  console.log(`\n🎉 Migration complete: ${totalCourses} courses, ${totalFiles} lessons`);
}

main();
