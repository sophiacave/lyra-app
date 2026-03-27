import { getLesson, getCourse, getAllCourseSlugs, getLessonSlugs } from '../../../../lib/courses';
import { notFound } from 'next/navigation';
import LessonNav from '../../../components/academy/LessonNav';

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
    }}>
      {/* Lesson breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#525252',
        marginBottom: '32px',
      }}>
        <a href={`/academy/${courseSlug}/`} style={{
          color: '#737373',
          textDecoration: 'none',
        }}>
          {course?.emoji} {course?.title}
        </a>
        <span>›</span>
        <span style={{ color: '#a0a0a0' }}>Lesson {lesson.order}</span>
      </div>

      {/* Lesson content */}
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
      />

      {/* Universal academy lesson styles */}
      <link rel="stylesheet" href="/academy/shared/academy.css" />

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
