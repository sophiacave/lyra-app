import Link from 'next/link';
import { getCourseBySlug, getLessonBySlug, getLessonsByCourse, getModulesByCourse } from '@/lib/academy';
import { notFound } from 'next/navigation';
import LessonEngine from '../../components/LessonEngine';

export async function generateMetadata({ params }) {
  const lesson = await getLessonBySlug(params.lessonSlug);
  if (!lesson) return { title: 'Lesson Not Found — Like One' };
  return {
    title: `${lesson.title} — Like One Academy`,
    description: lesson.description,
  };
}

function lessonTypeIcon(type) {
  const icons = { animated: '▶', interactive_code: '⌨', quiz: '✦', drag_drop: '⊞', simulation: '◉' };
  return icons[type] || '○';
}

function lessonTypeLabel(type) {
  const labels = { animated: 'Animation', interactive_code: 'Code Lab', quiz: 'Quiz', drag_drop: 'Interactive', simulation: 'Simulation' };
  return labels[type] || type;
}

export default async function LessonPage({ params }) {  const [course, lesson] = await Promise.all([
    getCourseBySlug(params.courseSlug),
    getLessonBySlug(params.lessonSlug),
  ]);

  if (!course || !lesson) notFound();

  const accent = course.accent_color || '#00cec9';
  const allLessons = await getLessonsByCourse(course.id);
  const currentIdx = allLessons.findIndex(l => l.slug === lesson.slug);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const progress = ((currentIdx + 1) / allLessons.length) * 100;

  return (
    <>
      <style>{`
        .lsn-shell {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e5e5e5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .lsn-nav {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 24px 0;          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lsn-nav a {
          color: #737373;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }
        .lsn-nav a:hover { color: #00cec9; }
        .lsn-progress-bar {
          max-width: 800px;
          margin: 16px auto 0;
          padding: 0 24px;
        }
        .lsn-progress-track {
          height: 3px;
          background: #1a1a2e;
          border-radius: 999px;
          overflow: hidden;
        }
        .lsn-progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s;
        }
        .lsn-progress-text {
          font-size: 11px;
          color: #555;          margin-top: 6px;
          text-align: right;
        }
        .lsn-header {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 24px 24px;
        }
        .lsn-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          padding: 3px 12px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .lsn-header h1 {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #f0f0f0;
          margin-bottom: 8px;
          line-height: 1.15;
        }
        .lsn-desc {
          font-size: 16px;          color: #737373;
          line-height: 1.6;
        }
        .lsn-xp-reward {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 12px;
        }
        .lsn-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 40px;
        }
        .lsn-footer {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .lsn-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #999;          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          transition: all 0.2s;
        }
        .lsn-nav-btn:hover {
          color: #e5e5e5;
          border-color: rgba(255,255,255,0.15);
        }
        .lsn-nav-btn-next {
          border-color: rgba(255,255,255,0.12);
        }
        @media (max-width: 640px) {
          .lsn-header h1 { font-size: 28px; }
          .lsn-footer { flex-direction: column; }
        }
      `}</style>

      <div className="lsn-shell">
        <nav className="lsn-nav">
          <Link href={`/academy/${course.slug}`}>&larr; {course.title}</Link>
          <span style={{ fontSize: 13, color: accent, fontWeight: 600 }}>{course.icon_emoji} Academy</span>
        </nav>

        <div className="lsn-progress-bar">
          <div className="lsn-progress-track">            <div
              className="lsn-progress-fill"
              style={{ width: `${progress}%`, background: accent }}
            />
          </div>
          <div className="lsn-progress-text">
            Lesson {currentIdx + 1} of {allLessons.length}
          </div>
        </div>

        <header className="lsn-header">
          <span
            className="lsn-type-badge"
            style={{ background: `${accent}15`, color: accent }}
          >
            {lessonTypeIcon(lesson.lesson_type)} {lessonTypeLabel(lesson.lesson_type)}
          </span>
          <h1>{lesson.title}</h1>
          {lesson.description && <p className="lsn-desc">{lesson.description}</p>}
          <div className="lsn-xp-reward" style={{ color: accent }}>
            +{lesson.xp_reward} XP
            {lesson.estimated_minutes && (
              <span style={{ color: '#555', marginLeft: 12 }}>{lesson.estimated_minutes} min</span>
            )}
          </div>
        </header>

        <main className="lsn-content">
          <LessonEngine lesson={lesson} accent={accent} />
        </main>
        <footer className="lsn-footer">
          {prevLesson ? (
            <Link href={`/academy/${course.slug}/${prevLesson.slug}`} className="lsn-nav-btn">
              &larr; {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link href={`/academy/${course.slug}/${nextLesson.slug}`} className="lsn-nav-btn lsn-nav-btn-next" style={{ color: accent }}>
              {nextLesson.title} &rarr;
            </Link>
          ) : (
            <Link href={`/academy/${course.slug}`} className="lsn-nav-btn lsn-nav-btn-next" style={{ color: accent }}>
              Course Complete &check;
            </Link>
          )}
        </footer>
      </div>
    </>
  );
}