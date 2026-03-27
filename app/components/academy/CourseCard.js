'use client';
import Link from 'next/link';

export default function CourseCard({ course, index = 0, progress = {} }) {
  const isPlanned = course.status === 'planned';

  const courseProgress = course.lessons
    ? course.lessons.filter(l => progress[`${course.slug}/${l.slug}`]).length
    : 0;
  const totalLessons = course.lessonCount || course.lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((courseProgress / totalLessons) * 100) : 0;
  const hasProgress = courseProgress > 0;

  return (
    <Link
      href={isPlanned ? '#' : `/academy/${course.slug}/`}
      className={`glass-card course-card-glass glass-animate-up academy-card ${isPlanned ? 'planned' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={isPlanned ? (e) => e.preventDefault() : undefined}
    >
      <div className="course-card-glow" />

      {/* Status badge */}
      <div className="academy-card-badge">
        {isPlanned ? (
          <span className="glass-badge badge-dim">COMING SOON</span>
        ) : hasProgress ? (
          <span className="glass-badge badge-green">
            {progressPercent === 100 ? '✓ COMPLETE' : `${courseProgress}/${totalLessons}`}
          </span>
        ) : course.status === 'live' ? (
          <span className="glass-badge badge-green">LIVE</span>
        ) : null}
      </div>

      <div className="academy-card-emoji">{course.emoji}</div>

      <h3 className="academy-card-title">{course.title}</h3>

      <p className="academy-card-desc">{course.description}</p>

      {/* Progress bar */}
      {hasProgress && (
        <div className="glass-progress mb-4">
          <div
            className={`glass-progress-fill ${progressPercent === 100 ? 'complete' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <div className="academy-card-meta">
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
