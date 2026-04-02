#!/usr/bin/env node
/**
 * S+ Academy Audit — Like One Quality Gate
 *
 * Checks every course and lesson for S+ compliance:
 *   - Content file exists and has valid frontmatter
 *   - Every lesson has interactive components (inline or exercises JSON)
 *   - No videoId in frontmatter (video deploy paused)
 *   - No bare <script> tags (must use type="text/x-lesson")
 *   - CSS files referenced actually exist
 *   - Content meets minimum depth threshold
 *   - All courses in manifest are "live"
 *   - Meta fields present (title, course, order)
 *
 * Usage:
 *   node scripts/audit-academy.js          # full audit
 *   node scripts/audit-academy.js --fix    # auto-fix bare scripts
 *   node scripts/audit-academy.js --json   # output JSON report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ACADEMY = path.join(ROOT, 'content/academy');
const EXERCISES = path.join(ROOT, 'content/exercises');
const CSS_DIR = path.join(ROOT, 'public/academy/css');
const MANIFEST = path.join(ACADEMY, 'courses.json');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const JSON_OUT = args.includes('--json');

// Minimal frontmatter parser (avoids gray-matter dep for script portability)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, body: content };
  const data = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val === 'true') val = true;
      if (val === 'false') val = false;
      if (/^\d+$/.test(val)) val = parseInt(val, 10);
      data[m[1]] = val;
    }
  });
  return { data, body: content.slice(match[0].length) };
}

function audit() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const results = { passed: 0, failed: 0, warnings: 0, issues: [], fixes: 0 };
  let totalLessons = 0;

  for (const tier of manifest.tiers) {
    for (const course of tier.courses) {
      const slug = course.slug;
      const courseDir = path.join(ACADEMY, slug);

      // Check course dir exists
      if (!fs.existsSync(courseDir)) {
        results.issues.push({ severity: 'error', course: slug, lesson: null, msg: 'Course directory missing' });
        results.failed++;
        continue;
      }

      // Check course is live
      if (course.status !== 'live') {
        results.issues.push({ severity: 'warn', course: slug, lesson: null, msg: `Course status: ${course.status}` });
        results.warnings++;
      }

      // Load exercises JSON
      const exFile = path.join(EXERCISES, `${slug}.json`);
      const exercises = fs.existsSync(exFile) ? JSON.parse(fs.readFileSync(exFile, 'utf8')) : {};

      // Check each lesson
      const files = fs.readdirSync(courseDir).filter(f => f.endsWith('.md'));
      for (const f of files) {
        totalLessons++;
        const lessonSlug = f.replace(/\.md$/, '');
        const filePath = path.join(courseDir, f);
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data, body } = parseFrontmatter(raw);

        // Required frontmatter
        if (!data.title) {
          results.issues.push({ severity: 'error', course: slug, lesson: lessonSlug, msg: 'Missing title in frontmatter' });
          results.failed++;
        }
        if (!data.course) {
          results.issues.push({ severity: 'error', course: slug, lesson: lessonSlug, msg: 'Missing course in frontmatter' });
          results.failed++;
        }
        if (data.order === undefined) {
          results.issues.push({ severity: 'warn', course: slug, lesson: lessonSlug, msg: 'Missing order in frontmatter' });
          results.warnings++;
        }

        // No videoId
        if (data.videoId) {
          results.issues.push({ severity: 'error', course: slug, lesson: lessonSlug, msg: `Has videoId: ${data.videoId} — video deploy paused` });
          results.failed++;
        }

        // Check for bare <script> tags
        const bareScripts = (body.match(/<script(?![^>]*type=)[^>]*>/gi) || []);
        if (bareScripts.length > 0) {
          if (FIX) {
            const fixed = raw.replace(/<script(?![^>]*type=)([^>]*)>/gi, '<script type="text/x-lesson"$1>');
            fs.writeFileSync(filePath, fixed, 'utf8');
            results.fixes++;
            results.issues.push({ severity: 'fixed', course: slug, lesson: lessonSlug, msg: `Fixed ${bareScripts.length} bare <script> tag(s)` });
          } else {
            results.issues.push({ severity: 'error', course: slug, lesson: lessonSlug, msg: `${bareScripts.length} bare <script> tag(s) — use type="text/x-lesson"` });
            results.failed++;
          }
        }

        // Check interactive components
        const hasInlineInteractive = [
          'learn-card', 'mc-question', 'match-connect', 'MatchConnect',
          'neuron-sim', 'flash-card', 'quiz-progress', 'data-learn',
        ].some(pat => body.includes(pat));
        const hasExercises = exercises[lessonSlug] && exercises[lessonSlug].length > 0;
        if (!hasInlineInteractive && !hasExercises) {
          results.issues.push({ severity: 'error', course: slug, lesson: lessonSlug, msg: 'No interactive components (inline or exercises)' });
          results.failed++;
        }

        // Content depth check (min 2KB for lessons, 1KB for quizzes)
        const minSize = data.type === 'quiz' ? 1000 : 2000;
        if (body.length < minSize) {
          results.issues.push({ severity: 'warn', course: slug, lesson: lessonSlug, msg: `Thin content: ${body.length} chars (min ${minSize})` });
          results.warnings++;
        }

        // CSS reference check
        if (data.css) {
          const cssPath = path.join(CSS_DIR, data.css);
          if (!fs.existsSync(cssPath)) {
            results.issues.push({ severity: 'warn', course: slug, lesson: lessonSlug, msg: `CSS file not found: ${data.css}` });
            results.warnings++;
          }
        }

        if (!results.issues.some(i => i.lesson === lessonSlug && i.severity === 'error')) {
          results.passed++;
        }
      }
    }
  }

  results.totalLessons = totalLessons;
  results.totalCourses = manifest.tiers.reduce((sum, t) => sum + t.courses.length, 0);
  return results;
}

// Run
const results = audit();

if (JSON_OUT) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║       S+ ACADEMY AUDIT — LIKE ONE           ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(`  Courses:  ${results.totalCourses}`);
  console.log(`  Lessons:  ${results.totalLessons}`);
  console.log(`  Passed:   ${results.passed}`);
  console.log(`  Failed:   ${results.failed}`);
  console.log(`  Warnings: ${results.warnings}`);
  if (results.fixes > 0) console.log(`  Fixed:    ${results.fixes}`);
  console.log('');

  if (results.issues.length > 0) {
    const errors = results.issues.filter(i => i.severity === 'error');
    const warns = results.issues.filter(i => i.severity === 'warn');
    const fixes = results.issues.filter(i => i.severity === 'fixed');

    if (errors.length > 0) {
      console.log('❌ ERRORS:');
      errors.forEach(i => console.log(`  ${i.course}/${i.lesson || '*'}: ${i.msg}`));
      console.log('');
    }
    if (warns.length > 0) {
      console.log('⚠️  WARNINGS:');
      warns.forEach(i => console.log(`  ${i.course}/${i.lesson || '*'}: ${i.msg}`));
      console.log('');
    }
    if (fixes.length > 0) {
      console.log('🔧 FIXED:');
      fixes.forEach(i => console.log(`  ${i.course}/${i.lesson || '*'}: ${i.msg}`));
      console.log('');
    }
  }

  if (results.failed === 0) {
    console.log('✅ S+ AUDIT PASSED — all lessons meet quality gates.\n');
  } else {
    console.log(`❌ S+ AUDIT FAILED — ${results.failed} issue(s) must be resolved.\n`);
  }
}

process.exit(results.failed > 0 ? 1 : 0);
