const SUPABASE_URL = 'https://vpaynwebgmmnwttqkwmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYXlud2ViZ21tbnd0dHFrd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjc0OTksImV4cCI6MjA4ODg0MzQ5OX0.roRXPjkD1K4EXgaV2slcxGtnhrGfnJnTXz7R2GhQCxo';

async function supabaseGet(table, query = '') {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${query}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getAllCourses() {
  return supabaseGet('academy_courses', 'is_published=eq.true&order=sort_order.asc');
}

export async function getCourseBySlug(slug) {
  const courses = await supabaseGet('academy_courses', `slug=eq.${slug}&is_published=eq.true&limit=1`);
  return courses[0] || null;
}

export async function getModulesByCourse(courseId) {
  return supabaseGet('academy_modules', `course_id=eq.${courseId}&is_published=eq.true&order=sort_order.asc`);
}
export async function getLessonsByModule(moduleId) {
  return supabaseGet('academy_lessons', `module_id=eq.${moduleId}&is_published=eq.true&order=sort_order.asc`);
}

export async function getLessonBySlug(slug) {
  const lessons = await supabaseGet('academy_lessons', `slug=eq.${slug}&is_published=eq.true&limit=1`);
  return lessons[0] || null;
}

export async function getLessonsByCourse(courseId) {
  return supabaseGet('academy_lessons', `course_id=eq.${courseId}&is_published=eq.true&order=sort_order.asc`);
}

export async function getCourseWithContent(slug) {
  const course = await getCourseBySlug(slug);
  if (!course) return null;

  const modules = await getModulesByCourse(course.id);
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await getLessonsByModule(mod.id);
      return { ...mod, lessons };
    })
  );

  return { ...course, modules: modulesWithLessons };
}
