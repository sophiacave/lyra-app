'use client';
import Link from 'next/link';

export default function CourseCard({ course }) {
  const isPlanned = course.status === 'planned';

  return (
    <Link
      href={isPlanned ? '#' : `/academy/${course.slug}/`}
      className="course-card"
      style={{
        display: 'block',
        background: 'rgba(17,17,20,0.8)',
        border: '1px solid #1e1e28',
        borderRadius: '16px',
        padding: '24px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        opacity: isPlanned ? 0.5 : 1,
        cursor: isPlanned ? 'default' : 'pointer',
        position: 'relative',
      }}
      onClick={isPlanned ? (e) => e.preventDefault() : undefined}
    >
      {isPlanned && (
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(192,132,252,0.15)',
          color: '#c084fc',
          fontSize: '11px',
          fontWeight: 600,
          padding: '3px 8px',
          borderRadius: '6px',
          letterSpacing: '0.5px',
        }}>
          COMING SOON
        </span>
      )}
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{course.emoji}</div>
      <h3 style={{
        color: '#e5e5e5',
        fontSize: '17px',
        fontWeight: 600,
        marginBottom: '8px',
        lineHeight: 1.3,
      }}>
        {course.title}
      </h3>
      <p style={{
        color: '#a0a0a0',
        fontSize: '13px',
        lineHeight: 1.5,
        marginBottom: '12px',
      }}>
        {course.description}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
        color: '#737373',
      }}>
        {course.lessonCount > 0 && (
          <span>{course.lessonCount} lessons</span>
        )}
        {course.audience?.map(a => (
          <span key={a} style={{
            background: 'rgba(56,189,248,0.1)',
            color: '#38bdf8',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
          }}>
            {a}
          </span>
        ))}
      </div>
    </Link>
  );
}
