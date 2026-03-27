import Link from 'next/link';
import { getCourse, getAllCourseSlugs } from '../../../lib/courses';
import { notFound } from 'next/navigation';
import CourseProgress from '../../components/academy/CourseProgress';

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

// Estimate time per lesson type
function estimateMinutes(lessons) {
  return lessons.reduce((sum, l) => {
    if (l.type === 'quiz') return sum + 5;
    if (l.type === 'lab') return sum + 15;
    if (l.type === 'builder') return sum + 20;
    return sum + 8;
  }, 0);
}

const DIFFICULTY = {
  beginner: { label: 'Beginner', color: '#4ade80', bars: 1 },
  intermediate: { label: 'Intermediate', color: '#38bdf8', bars: 2 },
  advanced: { label: 'Advanced', color: '#c084fc', bars: 3 },
};

export default async function CoursePage({ params }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);

  if (!course || course.status !== 'live') {
    notFound();
  }

  const minutes = estimateMinutes(course.lessons);
  const hours = Math.floor(minutes / 60);
  const timeLabel = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  const diff = DIFFICULTY[course.tierSlug] || DIFFICULTY.beginner;
  const freeLessons = course.lessons.filter(l => l.free).length;

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
        marginBottom: '24px',
        borderRadius: 'var(--glass-radius-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
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
          alignItems: 'center',
        }}>
          <span className="glass-badge">
            {course.tierEmoji} {course.tierName}
          </span>
          <span className="glass-badge badge-dim">
            {course.lessonCount} lessons
          </span>
          <span className="glass-badge badge-dim">
            ⏱ {timeLabel}
          </span>
          <span className="glass-badge badge-dim" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {[1, 2, 3].map(i => (
              <span key={i} style={{
                display: 'inline-block',
                width: '3px',
                height: i <= diff.bars ? '12px' : '6px',
                borderRadius: '2px',
                background: i <= diff.bars ? diff.color : 'rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
              }} />
            ))}
            <span style={{ marginLeft: '2px' }}>{diff.label}</span>
          </span>
          {freeLessons > 0 && (
            <span className="glass-badge badge-green">
              {freeLessons} free lesson{freeLessons > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Progress tracker (client component) */}
      <CourseProgress courseSlug={courseSlug} lessons={course.lessons} />

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
            <div className={`lesson-orb ${lesson.free ? 'orb-free' : 'orb-locked'}`}>
              {index + 1}
            </div>

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
