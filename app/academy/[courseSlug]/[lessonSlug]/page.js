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
    <div className="academy-container">
      {/* Breadcrumb */}
      <div className="glass glass-animate-up academy-breadcrumb">
        <a href={`/academy/${courseSlug}/`} className="academy-breadcrumb-link">
          {course?.emoji} {course?.title}
        </a>
        <span className="academy-breadcrumb-sep">›</span>
        <span className="academy-breadcrumb-current">Lesson {lesson.order}</span>
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
