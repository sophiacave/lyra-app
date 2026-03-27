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
      borderTop: '1px solid #1e1e28',
      gap: '16px',
    }}>
      {prev ? (
        <Link
          href={`/academy/${courseSlug}/${prev.slug}/`}
          style={{
            color: '#a0a0a0',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s',
          }}
        >
          <span style={{ fontSize: '18px' }}>&larr;</span>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <Link
          href={`/academy/${courseSlug}/`}
          style={{
            color: '#737373',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '18px' }}>&larr;</span>
          <span>{courseTitle}</span>
        </Link>
      )}

      {next ? (
        <Link
          href={`/academy/${courseSlug}/${next.slug}/`}
          style={{
            background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
            color: '#08080a',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Next: {next.title}</span>
          <span style={{ fontSize: '18px' }}>&rarr;</span>
        </Link>
      ) : (
        <Link
          href={`/academy/${courseSlug}/`}
          style={{
            background: 'linear-gradient(135deg, #4ade80, #38bdf8)',
            color: '#08080a',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '10px',
          }}
        >
          Course Complete ✨
        </Link>
      )}
    </div>
  );
}
