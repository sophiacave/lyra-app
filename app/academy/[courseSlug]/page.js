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
      maxWidth: '760px',
      margin: '0 auto',
      padding: '48px 32px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Course header — glass panel */}
      <div className="glass glass-animate-up" style={{
        padding: '36px 32px',
        marginBottom: '32px',
        borderRadius: 'var(--glass-radius-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Link
          href="/academy/"
          className="glass-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
            textDecoration: 'none',
            fontSize: '13px',
            padding: '6px 14px',
          }}
        >
          ← All Courses
        </Link>

        <div style={{ fontSize: '52px', marginBottom: '16px' }}>{course.emoji}</div>

        <h1 style={{
          fontSize: '30px',
          fontWeight: 800,
          color: '#e8e8ec',
          marginBottom: '12px',
          lineHeight: 1.2,
          letterSpacing: '-0.3px',
        }}>
          {course.title}
        </h1>

        <p style={{
          color: '#8888a0',
          fontSize: '15px',
          lineHeight: 1.6,
          marginBottom: '20px',
        }}>
          {course.description}
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          <span className="glass-badge">
            {course.tierEmoji} {course.tierName}
          </span>
          <span className="glass-badge badge-dim">
            {course.lessonCount} lessons
          </span>
        </div>
      </div>

      {/* Lesson list — glass rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {course.lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/academy/${courseSlug}/${lesson.slug}/`}
            className="glass-lesson-row glass-animate-up"
            style={{
              animationDelay: `${index * 0.04}s`,
            }}
          >
            {/* Lesson number orb */}
            <div className={`lesson-orb ${lesson.free ? 'orb-free' : 'orb-locked'}`}>
              {index + 1}
            </div>

            {/* Lesson info */}
            <div style={{ flex: 1 }}>
              <div style={{
                color: '#e8e8ec',
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 1.3,
              }}>
                {lesson.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.25)',
                marginTop: '3px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <span>
                  {lesson.type === 'quiz' ? '📝 Quiz' :
                   lesson.type === 'lab' ? '🧪 Lab' :
                   lesson.type === 'builder' ? '🔨 Builder' :
                   '📖 Lesson'}
                </span>
                {lesson.free && (
                  <span className="glass-badge badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>
                    FREE
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <span style={{
              color: 'rgba(255,255,255,0.15)',
              fontSize: '16px',
              transition: 'all 0.2s ease',
            }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
