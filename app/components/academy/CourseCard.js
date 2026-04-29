'use client';
import { useRef, useCallback, useState } from 'react';
import Link from 'next/link';

const BUNNY_CDN = 'https://vz-6aead46a-d20.b-cdn.net';

export default function CourseCard({ course, index = 0, progress = {} }) {
  const isPlanned = course.status === 'planned';
  const hasVideo = !!course.introVideoId;
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const courseProgress = course.lessons
    ? course.lessons.filter(l => progress[`${course.slug}/${l.slug}`]).length
    : 0;
  const totalLessons = course.lessonCount || course.lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((courseProgress / totalLessons) * 100) : 0;
  const hasProgress = courseProgress > 0;

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 50, y: 50 });
  }, []);

  return (
    <Link
      ref={ref}
      href={isPlanned ? '#' : `/academy/${course.slug}/`}
      className={`course-card-v2 liquid-card liquid-animate-up ${isPlanned ? 'course-card-v2--planned' : ''} ${hasVideo ? 'course-card-v2--video' : ''}`}
      style={{
        animationDelay: `${index * 0.06}s`,
        '--liquid-mouse-x': `${mousePos.x}%`,
        '--liquid-mouse-y': `${mousePos.y}%`,
      }}
      onClick={isPlanned ? (e) => e.preventDefault() : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Liquid specular highlight */}
      <span className="liquid-specular" aria-hidden="true" />
      <span className="liquid-edge" aria-hidden="true" />

      {/* Video Thumbnail or Emoji Hero */}
      {hasVideo ? (
        <div className="course-card-v2__thumb">
          <img
            src={`${BUNNY_CDN}/${course.introVideoId}/thumbnail.jpg`}
            alt={course.title}
            className="course-card-v2__thumb-img"
            loading="lazy"
            decoding="async"
          />
          <div className="course-card-v2__thumb-vignette" />
          <div className="course-card-v2__thumb-grain" />
          <div className="course-card-v2__thumb-gradient" />

          {/* Play icon */}
          <div className="course-card-v2__play">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill="currentColor" />
            </svg>
          </div>

          {/* Video badge */}
          <div className="course-card-v2__vid-badge">
            <span className="course-card-v2__vid-dot" />
            VIDEO COURSE
          </div>

          {/* Emoji floating over thumbnail */}
          <div className="course-card-v2__emoji-overlay">{course.emoji}</div>
        </div>
      ) : (
        <div className="course-card-v2__emoji-hero">
          <div className="course-card-v2__emoji-glow" />
          <div className="course-card-v2__emoji-large">{course.emoji}</div>
        </div>
      )}

      {/* Content */}
      <div className="course-card-v2__body">
        {/* Status row */}
        <div className="course-card-v2__status">
          {isPlanned ? (
            <span className="liquid-badge liquid-badge-dim">COMING SOON</span>
          ) : hasProgress ? (
            <span className="liquid-badge liquid-badge-green">
              {progressPercent === 100 ? 'COMPLETE' : `${courseProgress}/${totalLessons}`}
            </span>
          ) : course.status === 'live' ? (
            <span className="course-card-v2__tier-badge">
              {course.tierEmoji || ''} {course.tierName || ''}
            </span>
          ) : null}
        </div>

        <h3 className="course-card-v2__title">{course.title}</h3>
        <p className="course-card-v2__desc">{course.description}</p>

        {/* Progress bar */}
        {hasProgress && (
          <div className="liquid-progress">
            <div
              className={`liquid-progress-fill ${progressPercent === 100 ? 'complete' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Meta row */}
        <div className="course-card-v2__meta">
          {totalLessons > 0 && (
            <span className="course-card-v2__meta-item">
              {totalLessons} lessons
            </span>
          )}
          {course.audience?.map(a => (
            <span key={a} className="course-card-v2__meta-tag">
              {a}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
