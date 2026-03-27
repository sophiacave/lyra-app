'use client';
import Link from 'next/link';

export default function CourseCard({ course, index = 0, progress = {} }) {
  const isPlanned = course.status === 'planned';

  // Calculate progress for this course
  const courseProgress = course.lessons
    ? course.lessons.filter(l => progress[`${course.slug}/${l.slug}`]).length
    : 0;
  const totalLessons = course.lessonCount || course.lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((courseProgress / totalLessons) * 100) : 0;
  const hasProgress = courseProgress > 0;

  return (
    <Link
      href={isPlanned ? '#' : `/academy/${course.slug}/`}
      className="glass-card course-card-glass glass-animate-up"
      style={{
        display: 'block',
        padding: '28px 24px',
        textDecoration: 'none',
        opacity: isPlanned ? 0.4 : 1,
        cursor: isPlanned ? 'default' : 'pointer',
        position: 'relative',
        animationDelay: `${index * 0.05}s`,
      }}
      onClick={isPlanned ? (e) => e.preventDefault() : undefined}
    >
      <div className="course-card-glow" />

      {/* Status badge */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        {isPlanned ? (
          <span className="glass-badge badge-dim">COMING SOON</span>
        ) : hasProgress ? (
          <span className="glass-badge badge-green" style={{ fontSize: '10px' }}>
            {progressPercent === 100 ? '✓ COMPLETE' : `${courseProgress}/${totalLessons}`}
          </span>
        ) : course.status === 'live' ? (
          <span className="glass-badge badge-green" style={{ fontSize: '10px' }}>LIVE</span>
        ) : null}
      </div>

      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{course.emoji}</div>

      <h3 style={{
        color: '#e8e8ec',
        fontSize: '17px',
        fontWeight: 600,
        marginBottom: '8px',
        lineHeight: 1.3,
      }}>
        {course.title}
      </h3>

      <p style={{
        color: '#8888a0',
        fontSize: '13px',
        lineHeight: 1.6,
        marginBottom: '16px',
      }}>
        {course.description}
      </p>

      {/* Progress bar */}
      {hasProgress && (
        <div style={{
          marginBottom: '14px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '4px',
          height: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent === 100
              ? 'linear-gradient(90deg, #4ade80, #38bdf8)'
              : 'linear-gradient(90deg, #c084fc, #38bdf8)',
            borderRadius: '4px',
            transition: 'width 0.4s ease',
          }} />
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        flexWrap: 'wrap',
      }}>
        {totalLessons > 0 && (
          <span className="glass-badge badge-dim">
            {totalLessons} lessons
          </span>
        )}
        {course.audience?.map(a => (
          <span key={a} className="glass-badge badge-blue">
            {a}
          </span>
        ))}
      </div>
    </Link>
  );
}
