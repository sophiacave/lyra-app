import Link from 'next/link';
import { getAllCourses } from '@/lib/academy';

export const metadata = {
  title: 'Academy — Like One',
  description: 'Learn AI, automation, and how to build systems that think. Interactive courses with animations, code labs, and gamification.',
};

function difficultyColor(d) {
  if (d === 'beginner') return '#34C759';
  if (d === 'intermediate') return '#FF9F0A';
  return '#FF453A';
}

function formatPrice(cents) {
  if (!cents || cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function AcademyPage() {
  const courses = await getAllCourses();

  return (
    <>
      <style>{`
        .academy-shell {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e5e5e5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Nav */
        .acad-nav {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .acad-nav-home {
          color: #737373;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .acad-nav-home:hover { color: #00cec9; }
        .acad-nav-mark {
          font-size: 13px;
          color: #00cec9;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* Hero */
        .acad-hero {
          max-width: 960px;
          margin: 0 auto;
          padding: 72px 24px 56px;
          text-align: center;
        }
        .acad-badge {
          display: inline-block;
          font-size: 11px;
          padding: 4px 14px;
          border-radius: 999px;
          background: rgba(0, 206, 201, 0.1);
          color: #00cec9;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 20px;
          border: 1px solid rgba(0, 206, 201, 0.2);
        }
        .acad-hero h1 {
          font-size: 52px;
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.05;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #f0f0f0 0%, #00cec9 50%, #e84393 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .acad-hero-sub {
          font-size: 18px;
          color: #737373;
          line-height: 1.6;
          max-width: 560px;
          margin: 0 auto;
        }

        /* Stats row */
        .acad-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .acad-stat {
          text-align: center;
        }
        .acad-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #00cec9;
        }
        .acad-stat-label {
          font-size: 12px;
          color: #737373;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* Course grid */
        .acad-grid {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px 80px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        /* Glass card */
        .course-card {
          display: flex;
          flex-direction: column;
          background: rgba(20, 20, 35, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 28px;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .course-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--card-accent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .course-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .course-card:hover::before {
          opacity: 1;
        }

        .course-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }
        .course-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .course-difficulty {
          font-size: 10px;
          padding: 2px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .course-price-tag {
          font-size: 10px;
          padding: 2px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          background: rgba(232, 67, 147, 0.12);
          color: #e84393;
        }
        .course-price-free {
          background: rgba(52, 199, 89, 0.12);
          color: #34C759;
        }

        .course-title {
          font-size: 22px;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }
        .course-subtitle {
          font-size: 14px;
          color: var(--card-accent, #00cec9);
          font-weight: 500;
          margin-bottom: 12px;
        }
        .course-desc {
          font-size: 14px;
          color: #737373;
          line-height: 1.6;
          flex: 1;
          margin-bottom: 20px;
        }

        .course-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .course-info {
          display: flex;
          gap: 16px;
        }
        .course-info-item {
          font-size: 12px;
          color: #555;
        }
        .course-info-item span {
          color: #999;
          font-weight: 500;
        }
        .course-xp {
          font-size: 13px;
          font-weight: 700;
          color: #00cec9;
        }

        .course-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--card-accent, #00cec9);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .course-card:hover .course-cta {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .acad-hero h1 { font-size: 36px; }
          .acad-stats { gap: 24px; }
          .acad-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="academy-shell">
        <nav className="acad-nav">
          <Link href="/" className="acad-nav-home">&larr; Home</Link>
          <span className="acad-nav-mark">Like One</span>
        </nav>

        <header className="acad-hero">
          <div className="acad-badge">Now Open</div>
          <h1>Learn AI by doing.</h1>
          <p className="acad-hero-sub">
            Interactive courses that teach AI and automation through animations,
            live code, and hands-on experiments. Not lectures — experiences.
          </p>
          <div className="acad-stats">
            <div className="acad-stat">
              <div className="acad-stat-value">{courses.length}</div>
              <div className="acad-stat-label">Courses</div>
            </div>
            <div className="acad-stat">
              <div className="acad-stat-value">
                {courses.reduce((sum, c) => sum + (c.lesson_count || 0), 0)}
              </div>
              <div className="acad-stat-label">Lessons</div>
            </div>
            <div className="acad-stat">
              <div className="acad-stat-value">
                {courses.reduce((sum, c) => sum + (c.total_xp || 0), 0).toLocaleString()}
              </div>
              <div className="acad-stat-label">Total XP</div>
            </div>
          </div>
        </header>

        <main className="acad-grid">
          {courses.map(course => (
            <Link
              key={course.slug}
              href={`/academy/${course.slug}`}
              className="course-card"
              style={{ '--card-accent': course.accent_color || '#00cec9' }}
            >
              <div className="course-icon">{course.icon_emoji}</div>
              <div className="course-meta">
                <span
                  className="course-difficulty"
                  style={{
                    background: `${difficultyColor(course.difficulty)}18`,
                    color: difficultyColor(course.difficulty),
                  }}
                >
                  {course.difficulty}
                </span>
                <span className={`course-price-tag ${course.is_free ? 'course-price-free' : ''}`}>
                  {formatPrice(course.price_cents)}
                </span>
              </div>
              <h2 className="course-title">{course.title}</h2>
              <p className="course-subtitle">{course.subtitle}</p>
              <p className="course-desc">{course.description}</p>
              <div className="course-footer">
                <div className="course-info">
                  <span className="course-info-item">
                    <span>{course.module_count}</span> modules
                  </span>
                  <span className="course-info-item">
                    <span>{course.lesson_count}</span> lessons
                  </span>
                  <span className="course-info-item">
                    <span>{course.estimated_hours}h</span>
                  </span>
                </div>
                <span className="course-xp">{course.total_xp} XP</span>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </>
  );
}
