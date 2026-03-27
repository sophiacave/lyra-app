'use client';
import Link from 'next/link';

export default function CourseCard({ course, index = 0 }) {
  const isPlanned = course.status === 'planned';

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

      {isPlanned && (
        <span className="glass-badge badge-dim" style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
        }}>
          COMING SOON
        </span>
      )}

      {course.status === 'live' && !isPlanned && (
        <span className="glass-badge badge-green" style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          fontSize: '10px',
        }}>
          LIVE
        </span>
      )}

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

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        flexWrap: 'wrap',
      }}>
        {course.lessonCount > 0 && (
          <span className="glass-badge badge-dim">
            {course.lessonCount} lessons
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
