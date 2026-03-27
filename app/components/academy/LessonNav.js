'use client';
import Link from 'next/link';

export default function LessonNav({ courseSlug, prev, next, courseTitle }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 0',
      marginTop: '48px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      gap: '16px',
    }}>
      {prev ? (
        <Link
          href={`/academy/${courseSlug}/${prev.slug}/`}
          className="glass-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <span>←</span>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <Link
          href={`/academy/${courseSlug}/`}
          className="glass-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <span>←</span>
          <span>{courseTitle}</span>
        </Link>
      )}

      {next ? (
        <Link
          href={`/academy/${courseSlug}/${next.slug}/`}
          style={{
            background: 'linear-gradient(135deg, rgba(192,132,252,0.2), rgba(56,189,248,0.15))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(192,132,252,0.25)',
            color: '#e5e5e5',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 24px rgba(192,132,252,0.1)',
          }}
        >
          <span>Next: {next.title}</span>
          <span>→</span>
        </Link>
      ) : (
        <Link
          href={`/academy/${courseSlug}/`}
          style={{
            background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(56,189,248,0.15))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(74,222,128,0.25)',
            color: '#e5e5e5',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 0 24px rgba(74,222,128,0.1)',
          }}
        >
          Course Complete ✨
        </Link>
      )}
    </div>
  );
}
