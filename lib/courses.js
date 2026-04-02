import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const academyDirectory = path.join(process.cwd(), 'content/academy');
const coursesJsonPath = path.join(academyDirectory, 'courses.json');

// Cache the manifest in memory (read once per build)
let _manifest = null;
function getManifest() {
  if (_manifest) return _manifest;
  const raw = fs.readFileSync(coursesJsonPath, 'utf8');
  _manifest = JSON.parse(raw);
  return _manifest;
}

/**
 * Get all courses with lesson counts computed from filesystem.
 * Returns flat array of course objects.
 */
export function getAllCourses() {
  const manifest = getManifest();
  const courses = [];

  for (const tier of manifest.tiers) {
    for (const course of tier.courses) {
      const courseDir = path.join(academyDirectory, course.slug);
      let lessonCount = 0;
      let lessons = [];

      if (fs.existsSync(courseDir)) {
        const files = fs.readdirSync(courseDir).filter(f => f.endsWith('.md'));
        lessonCount = files.length;
        lessons = files.map(f => {
          const content = fs.readFileSync(path.join(courseDir, f), 'utf8');
          const { data } = matter(content);
          return {
            slug: f.replace(/\.md$/, ''),
            title: data.title || f.replace(/\.md$/, ''),
            order: data.order || 0,
            type: data.type || 'lesson',
            free: data.free || false,
            videoId: data.videoId || null,
          };
        }).sort((a, b) => a.order - b.order);
      }

      courses.push({
        ...course,
        tierName: tier.name,
        tierSlug: tier.slug,
        tierEmoji: tier.emoji,
        lessonCount,
        lessons,
      });
    }
  }

  return courses;
}

/**
 * Get courses filtered by tier.
 */
export function getCoursesByTier(tierSlug) {
  return getAllCourses().filter(c => c.tierSlug === tierSlug);
}

/**
 * Get a single course by slug, with its lessons.
 */
export function getCourse(slug) {
  return getAllCourses().find(c => c.slug === slug) || null;
}

/**
 * Get all course slugs (for generateStaticParams).
 */
export function getAllCourseSlugs() {
  return getAllCourses()
    .filter(c => c.status === 'live')
    .map(c => c.slug);
}

/**
 * Get all lesson slugs for a course (for generateStaticParams).
 */
export function getLessonSlugs(courseSlug) {
  const course = getCourse(courseSlug);
  if (!course) return [];
  return course.lessons.map(l => l.slug);
}

/**
 * Get a single lesson with parsed HTML content.
 */
export async function getLesson(courseSlug, lessonSlug) {
  const filePath = path.join(academyDirectory, courseSlug, `${lessonSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Content is already raw HTML (migrated from static files) — use directly.
  // Safety: convert bare <script> tags to type="text/x-lesson" so React's
  // ImmersiveLesson can execute them after hydration. Bare scripts are silently
  // ignored by dangerouslySetInnerHTML and never run.
  const safeHtml = content.replace(
    /<script(?![^>]*type=)([^>]*)>/gi,
    '<script type="text/x-lesson"$1>'
  );

  const course = getCourse(courseSlug);
  const lessonIndex = course ? course.lessons.findIndex(l => l.slug === lessonSlug) : -1;

  return {
    slug: lessonSlug,
    courseSlug,
    title: data.title || lessonSlug,
    order: data.order || 0,
    type: data.type || 'lesson',
    free: data.free || false,
    css: data.css || null,
    videoId: data.videoId || null,
    contentHtml: safeHtml,
    prev: lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null,
    next: lessonIndex < (course?.lessons.length || 0) - 1 ? course.lessons[lessonIndex + 1] : null,
  };
}

/**
 * Computed stats for site-config.
 */
export function getCourseStats() {
  const courses = getAllCourses();
  const liveCourses = courses.filter(c => c.status === 'live');
  const totalLessons = liveCourses.reduce((sum, c) => sum + c.lessonCount, 0);
  const totalCourses = liveCourses.length;
  const plannedCourses = courses.filter(c => c.status === 'planned').length;

  return {
    courseCount: totalCourses,
    lessonCount: totalLessons,
    totalCourses: courses.length,
    plannedCourses,
  };
}
