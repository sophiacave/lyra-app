import { getLesson, getCourse, getAllCourseSlugs, getLessonSlugs } from '../../../../lib/courses';
import { notFound } from 'next/navigation';
import LessonNav from '../../../components/academy/LessonNav';
import LessonComplete from '../../../components/academy/LessonComplete';

export async function generateStaticParams() {
  const courseSlugs = getAllCourseSlugs();
  const params = [];

  for (const courseSlug of courseSlugs) {
    const lessonSlugs = getLessonSlugs(courseSlug);
    for (const lessonSlug of lessonSlugs) {
      params.push({ courseSlug, lessonSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await getLesson(courseSlug, lessonSlug);
  if (!lesson) return {};
  const course = getCourse(courseSlug);
  return {
    title: `${lesson.title} — ${course?.title || 'Academy'} — Like One`,
    description: `${lesson.title} lesson from ${course?.title || 'Like One Academy'}.`,
  };
}

export default async function LessonPage({ params }) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await getLesson(courseSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const course = getCourse(courseSlug);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px 24px 64px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Breadcrumb — glass style */}
      <div className="glass glass-animate-up" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        padding: '8px 16px',
        borderRadius: 'var(--glass-radius-sm)',
        marginBottom: '32px',
      }}>
        <a href={`/academy/${courseSlug}/`} style={{
          color: '#8888a0',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}>
          {course?.emoji} {course?.title}
        </a>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>›</span>
        <span style={{ color: '#c084fc' }}>Lesson {lesson.order}</span>
      </div>

      {/* Lesson content */}
      <div
        className="lesson-content glass-animate-up"
        style={{ animationDelay: '0.1s' }}
        dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
      />

      {/* Universal academy lesson styles */}
      <link rel="stylesheet" href="/academy/shared/academy.css" />

      {/* Completion button */}
      <LessonComplete courseSlug={courseSlug} lessonSlug={lessonSlug} />

      {/* Bottom nav */}
      <LessonNav
        courseSlug={courseSlug}
        prev={lesson.prev}
        next={lesson.next}
        courseTitle={course?.title}
      />
    </div>
  );
}
