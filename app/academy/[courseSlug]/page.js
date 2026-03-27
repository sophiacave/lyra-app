import Link from 'next/link';
import { getCourse, getAllCourseSlugs } from '../../../lib/courses';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getAllCourseSlugs();
  return slugs.map(slug => ({ courseSlug: slug }));
}

export async function generateMetadata({ params }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return {};
  return {
    title: `${course.title} — Like One Academy`,
    description: course.description,
  };
}

export default async function CoursePage({ params }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);

  if (!course || course.status !== 'live') {
    notFound();
  }

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      {/* Course header */}
      <div style={{ marginBottom: '40px' }}>
        <Link
          href="/academy/"
          style={{
            color: '#737373',
            textDecoration: 'none',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px',
          }}
        >
          ← All Courses
        </Link>

        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{course.emoji}</div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#e5e5e5',
          marginBottom: '12px',
          lineHeight: 1.2,
        }}>
          {course.title}
        </h1>

        <p style={{
          color: '#a0a0a0',
          fontSize: '15px',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          {course.description}
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '13px',
          color: '#737373',
        }}>
          <span style={{
            background: 'rgba(192,132,252,0.1)',
            color: '#c084fc',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '12px',
          }}>
            {course.tierEmoji} {course.tierName}
          </span>
          <span>{course.lessonCount} lessons</span>
        </div>
      </div>

      {/* Lesson list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {course.lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/academy/${courseSlug}/${lesson.slug}/`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              background: 'rgba(17,17,20,0.6)',
              border: '1px solid #1e1e28',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Lesson number */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: lesson.free
                ? 'linear-gradient(135deg, #c084fc, #38bdf8)'
                : 'rgba(30,30,40,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: lesson.free ? '#08080a' : '#525252',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>

            {/* Lesson info */}
            <div style={{ flex: 1 }}>
              <div style={{
                color: '#e5e5e5',
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 1.3,
              }}>
                {lesson.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#525252',
                marginTop: '2px',
              }}>
                {lesson.type === 'quiz' ? '📝 Quiz' :
                 lesson.type === 'lab' ? '🧪 Lab' :
                 lesson.type === 'builder' ? '🔨 Builder' :
                 '📖 Lesson'}
                {lesson.free && (
                  <span style={{
                    marginLeft: '8px',
                    color: '#4ade80',
                    fontWeight: 600,
                  }}>
                    FREE
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <span style={{ color: '#525252', fontSize: '16px' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
