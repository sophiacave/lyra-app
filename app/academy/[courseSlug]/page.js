import Link from 'next/link';
import { getAllCourses, getCourseWithContent } from '@/lib/academy';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map(c => ({ courseSlug: c.slug }));
}

export async function generateMetadata({ params }) {
  const course = await getCourseWithContent(params.courseSlug);
  if (!course) return { title: 'Course Not Found — Like One' };
  return {
    title: `${course.title} — Like One Academy`,
    description: course.description,
  };
}

function lessonTypeIcon(type) {
  const icons = {
    animated: '▶',
    interactive_code: '⌨',
    quiz: '✦',
    drag_drop: '⊞',
    simulation: '◉',
  };
  return icons[type] || '○';
}

function lessonTypeLabel(type) {
  const labels = {
    animated: 'Animation',
    interactive_code: 'Code Lab',
    quiz: 'Quiz',
    drag_drop: 'Interactive',
    simulation: 'Simulation',
  };
  return labels[type] || type;
}

function formatPrice(cents) {
  if (!cents || cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function CoursePage({ params }) {
  const course = await getCourseWithContent(params.courseSlug);
  if (!course) notFound();

  const accent = course.accent_color || '#00cec9';
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <>
      <style>{`
        .crs-shell {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e5e5e5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .crs-nav {
          max-width: 800px;
          margin: 0 auto;
          padding: 32px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .crs-nav a {
          color: #737373;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .crs-nav a:hover { color: #00cec9; }
        .crs-nav-mark {
          font-size: 13px;
          color: #00cec9;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Hero */
        .crs-hero {
          max-width: 800px;
          margin: 0 auto;
          padding: 56px 24px 40px;
        }
        .crs-icon {
          font-size: 56px;
          margin-bottom: 20px;
        }
        .crs-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .crs-tag {
          font-size: 10px;
          padding: 3px 12px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .crs-hero h1 {
          font-size: 44px;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          color: #f0f0f0;
          margin-bottom: 8px;
        }
        .crs-subtitle {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .crs-desc {
          font-size: 16px;
          color: #999;
          line-height: 1.7;
          max-width: 600px;
        }

        /* Stats */
        .crs-stats {
          display: flex;
          gap: 24px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        .crs-stat-box {
          background: rgba(20, 20, 35, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 16px 24px;
          text-align: center;
          min-width: 100px;
        }
        .crs-stat-val {
          font-size: 24px;
          font-weight: 700;
        }
        .crs-stat-lbl {
          font-size: 11px;
          color: #737373;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* Modules */
        .crs-modules {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 24px 80px;
        }
        .crs-section-title {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #555;
          margin-bottom: 20px;
        }

        .module-card {
          background: rgba(20, 20, 35, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .module-header {
          padding: 24px;
        }
        .module-num {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .module-title {
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f0;
          letter-spacing: -0.3px;
        }
        .module-desc {
          font-size: 14px;
          color: #737373;
          margin-top: 4px;
          line-height: 1.5;
        }
        .module-xp {
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }

        /* Lessons */
        .lesson-list {
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .lesson-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          text-decoration: none;
          transition: background 0.2s;
        }
        .lesson-row:last-child { border-bottom: none; }
        .lesson-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .lesson-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .lesson-info {
          flex: 1;
          min-width: 0;
        }
        .lesson-title {
          font-size: 15px;
          font-weight: 500;
          color: #e5e5e5;
        }
        .lesson-type-label {
          font-size: 11px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .lesson-xp {
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .lesson-arrow {
          color: #333;
          font-size: 16px;
          transition: color 0.2s;
        }
        .lesson-row:hover .lesson-arrow { color: #999; }

        /* CTA */
        .crs-cta {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 60px;
          text-align: center;
        }
        .crs-enroll-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 36px;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.3s;
          color: white;
        }
        .crs-enroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .crs-footer {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .crs-footer-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #00cec9;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          border: 1px solid rgba(0, 206, 201, 0.3);
          border-radius: 999px;
          transition: all 0.2s;
        }
        .crs-footer-back:hover {
          background: rgba(0, 206, 201, 0.1);
          border-color: #00cec9;
        }

        @media (max-width: 640px) {
          .crs-hero h1 { font-size: 32px; }
          .crs-stats { gap: 12px; }
          .crs-stat-box { min-width: 80px; padding: 12px 16px; }
        }
      `}</style>

      <div className="crs-shell">
        <nav className="crs-nav">
          <Link href="/academy">&larr; All courses</Link>
          <span className="crs-nav-mark">Academy</span>
        </nav>

        <header className="crs-hero">
          <div className="crs-icon">{course.icon_emoji}</div>
          <div className="crs-meta-row">
            <span
              className="crs-tag"
              style={{
                background: `${accent}18`,
                color: accent,
              }}
            >
              {course.difficulty}
            </span>
            <span
              className="crs-tag"
              style={{
                background: course.is_free ? 'rgba(52,199,89,0.12)' : 'rgba(232,67,147,0.12)',
                color: course.is_free ? '#34C759' : '#e84393',
              }}
            >
              {formatPrice(course.price_cents)}
            </span>
            <span className="crs-tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#999' }}>
              {course.category}
            </span>
          </div>
          <h1>{course.title}</h1>
          <p className="crs-subtitle" style={{ color: accent }}>{course.subtitle}</p>
          <p className="crs-desc">{course.description}</p>

          <div className="crs-stats">
            <div className="crs-stat-box">
              <div className="crs-stat-val" style={{ color: accent }}>{course.modules.length}</div>
              <div className="crs-stat-lbl">Modules</div>
            </div>
            <div className="crs-stat-box">
              <div className="crs-stat-val" style={{ color: accent }}>{totalLessons}</div>
              <div className="crs-stat-lbl">Lessons</div>
            </div>
            <div className="crs-stat-box">
              <div className="crs-stat-val" style={{ color: accent }}>{course.total_xp}</div>
              <div className="crs-stat-lbl">Total XP</div>
            </div>
            <div className="crs-stat-box">
              <div className="crs-stat-val" style={{ color: accent }}>{course.estimated_hours}h</div>
              <div className="crs-stat-lbl">Duration</div>
            </div>
          </div>
        </header>

        <section className="crs-modules">
          <h2 className="crs-section-title">Course Curriculum</h2>

          {course.modules.map((mod, idx) => (
            <div key={mod.id} className="module-card">
              <div className="module-header">
                <div className="module-num" style={{ color: accent }}>Module {idx + 1}</div>
                <h3 className="module-title">{mod.title}</h3>
                <p className="module-desc">{mod.description}</p>
                <div className="module-xp" style={{ color: accent }}>{mod.total_xp} XP</div>
              </div>
              <div className="lesson-list">
                {mod.lessons.map(lesson => (
                  <Link
                    key={lesson.id}
                    href={`/academy/${course.slug}/${lesson.slug}`}
                    className="lesson-row"
                  >
                    <div
                      className="lesson-icon"
                      style={{
                        background: `${accent}15`,
                        color: accent,
                      }}
                    >
                      {lessonTypeIcon(lesson.lesson_type)}
                    </div>
                    <div className="lesson-info">
                      <div className="lesson-title">{lesson.title}</div>
                      <div className="lesson-type-label">{lessonTypeLabel(lesson.lesson_type)}</div>
                    </div>
                    <div className="lesson-xp" style={{ color: accent }}>+{lesson.xp_reward} XP</div>
                    <span className="lesson-arrow">&rsaquo;</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="crs-cta">
          <a
            className="crs-enroll-btn"
            style={{ background: accent }}
            href="#"
          >
            {course.is_free ? 'Start Learning — Free' : `Enroll — ${formatPrice(course.price_cents)}`}
          </a>
        </div>

        <footer className="crs-footer">
          <Link href="/academy" className="crs-footer-back">
            &larr; Back to all courses
          </Link>
        </footer>
      </div>
    </>
  );
}
