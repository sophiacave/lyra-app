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

function estimateMinutes(lessons) {
  return lessons.reduce((sum, l) => {
    if (l.type === 'quiz') return sum + 5;
    if (l.type === 'lab') return sum + 15;
    if (l.type === 'builder') return sum + 20;
    return sum + 8;
  }, 0);
}

const DIFFICULTY = {
  beginner: { label: 'Beginner', color: 'var(--status-success)', bars: 1 },
  intermediate: { label: 'Intermediate', color: 'var(--accent-blue)', bars: 2 },
  advanced: { label: 'Advanced', color: 'var(--accent-purple)', bars: 3 },
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
    <div className="academy-container">
      {/* Course header */}
      <div className="glass glass-animate-up academy-hero">
        <div className="academy-hero-glow-sm" />

        <Link href="/academy/" className="glass-btn academy-back-btn">
          ← All Courses
        </Link>

        <div className="academy-course-emoji">{course.emoji}</div>
        <h1 className="academy-course-title">{course.title}</h1>
        <p className="academy-course-desc">{course.description}</p>

        <div className="academy-badge-row">
          <span className="glass-badge">
            {course.tierEmoji} {course.tierName}
          </span>
          <span className="glass-badge badge-dim">
            {course.lessonCount} lessons
          </span>
          <span className="glass-badge badge-dim">
            ⏱ {timeLabel}
          </span>
          <span className="glass-badge badge-dim academy-difficulty" style={{ color: diff.color }}>
            {[1, 2, 3].map(i => (
              <span
                key={i}
                className={`academy-difficulty-bar ${i <= diff.bars ? 'filled' : ''}`}
                style={{ height: i <= diff.bars ? '12px' : '6px' }}
              />
            ))}
            <span className="academy-difficulty-label">{diff.label}</span>
          </span>
          {freeLessons > 0 && (
            <span className="glass-badge badge-green">
              {freeLessons} free lesson{freeLessons > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      <CourseProgress courseSlug={courseSlug} lessons={course.lessons} />

      {/* Lesson list */}
      <div className="academy-lesson-list">
        {course.lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/academy/${courseSlug}/${lesson.slug}/`}
            className="glass-lesson-row glass-animate-up"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <div className={`glass-orb ${lesson.free ? 'orb-accent' : 'orb-dim'}`}>
              {index + 1}
            </div>

            <div className="academy-lesson-content">
              <div className="academy-lesson-title">{lesson.title}</div>
              <div className="academy-lesson-meta">
                <span>
                  {lesson.type === 'quiz' ? '📝 Quiz' :
                   lesson.type === 'lab' ? '🧪 Lab' :
                   lesson.type === 'builder' ? '🔨 Builder' :
                   '📖 Lesson'}
                </span>
                {lesson.free && (
                  <span className="glass-badge badge-green academy-badge-sm">
                    FREE
                  </span>
                )}
              </div>
            </div>

            <span className="academy-lesson-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
