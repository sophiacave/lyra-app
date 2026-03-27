'use client';
import Link from 'next/link';

export default function LessonNav({ courseSlug, prev, next, courseTitle }) {
  return (
    <div className="academy-lesson-nav">
      {prev ? (
        <Link
          href={`/academy/${courseSlug}/${prev.slug}/`}
          className="glass-btn"
        >
          <span>←</span>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <Link
          href={`/academy/${courseSlug}/`}
          className="glass-btn"
        >
          <span>←</span>
          <span>{courseTitle}</span>
        </Link>
      )}

      {next ? (
        <Link
          href={`/academy/${courseSlug}/${next.slug}/`}
          className="glass-btn-primary glass-btn academy-nav-next"
        >
          <span>Next: {next.title}</span>
          <span>→</span>
        </Link>
      ) : (
        <Link
          href={`/academy/${courseSlug}/`}
          className="glass-btn-success glass-btn academy-nav-complete"
        >
          Course Complete ✨
        </Link>
      )}
    </div>
  );
}
