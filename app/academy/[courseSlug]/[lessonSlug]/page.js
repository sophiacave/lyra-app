import Link from 'next/link';
import { getCourseBySlug, getLessonBySlug, getLessonsByCourse, getModulesByCourse } from '@/lib/academy';
import { notFound } from 'next/navigation';

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

function LessonContent({ lesson, accent }) {
  const content = lesson.content || {};

  if (lesson.lesson_type === 'animated') {
    return (
      <div className="lesson-animated">
        <div className="anim-canvas">
          <div className="anim-placeholder">
            <span className="anim-icon">▶</span>
            <p className="anim-label">Animation: {content.animation_type || 'loading'}</p>
          </div>
        </div>
        {content.narration && (
          <div className="lesson-narration">
            <p>{content.narration}</p>
          </div>
        )}
        {content.concepts && (
          <div className="lesson-concepts">
            <span className="concepts-label">Key Concepts</span>
            <div className="concepts-row">
              {content.concepts.map(c => (
                <span key={c} className="concept-chip" style={{ background: `${accent}15`, color: accent }}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (lesson.lesson_type === 'interactive_code') {
    return (
      <div className="lesson-code">
        <div className="code-editor">
          <div className="code-toolbar">
            <span className="code-dots"><span></span><span></span><span></span></span>
            <span className="code-filename">{content.filename || 'playground.js'}</span>
          </div>
          <div className="code-body">
            <pre><code>{content.starter_code || '// Your code here\nconsole.log("Hello, AI!");'}</code></pre>
          </div>
          <button className="code-run-btn" style={{ background: accent }}>Run Code</button>
        </div>
        {content.instructions && <p className="code-instructions">{content.instructions}</p>}
      </div>
    );
  }

  if (lesson.lesson_type === 'quiz') {
    return (
      <div className="lesson-quiz">
        <div className="quiz-placeholder">
          <span className="quiz-icon">✦</span>
          <p className="quiz-label">Quiz Challenge</p>
          <p className="quiz-desc">Test your knowledge with interactive questions</p>
          <button className="quiz-start-btn" style={{ background: accent }}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (lesson.lesson_type === 'drag_drop') {
    return (
      <div className="lesson-dragdrop">
        <div className="dd-placeholder">
          <span className="dd-icon">⊞</span>
          <p className="dd-label">Drag & Drop Builder</p>
          <p className="dd-desc">Connect the pieces to build your understanding</p>
        </div>
      </div>
    );
  }

  if (lesson.lesson_type === 'simulation') {
    return (
      <div className="lesson-sim">
        <div className="sim-canvas">
          <span className="sim-icon">◉</span>
          <p className="sim-label">Live Simulation</p>
          <p className="sim-desc">Experiment with parameters and watch the system respond</p>
        </div>
      </div>
    );
  }

  return <p style={{ color: '#737373' }}>Lesson content loading...</p>;
}

export default async function LessonPage({ params }) {
  const [course, lesson] = await Promise.all([
    getCourseBySlug(params.courseSlug),
    getLessonBySlug(params.lessonSlug),
  ]);

  if (!course || !lesson) notFound();

  const accent = course.accent_color || '#00cec9';
  const allLessons = await getLessonsByCourse(course.id);
  const currentIdx = allLessons.findIndex(l => l.slug === lesson.slug);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

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
          padding: 24px 24px 0;
          display: flex;
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
          color: #555;
          margin-top: 6px;
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
          font-size: 16px;
          color: #737373;
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

        /* Lesson content area */
        .lsn-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px 40px;
        }

        /* Animated lesson */
        .anim-canvas {
          background: rgba(20, 20, 35, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 80px 40px;
          text-align: center;
          margin-bottom: 24px;
        }
        .anim-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .anim-icon {
          font-size: 48px;
          opacity: 0.3;
        }
        .anim-label { color: #555; font-size: 14px; }
        .lesson-narration {
          background: rgba(20, 20, 35, 0.4);
          border-left: 3px solid #e84393;
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          margin-bottom: 20px;
        }
        .lesson-narration p { color: #ccc; font-size: 15px; line-height: 1.7; font-style: italic; }
        .concepts-label { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .lesson-concepts { margin-top: 16px; }
        .concepts-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
        .concept-chip { font-size: 12px; padding: 4px 14px; border-radius: 999px; font-weight: 600; }

        /* Code lesson */
        .code-editor {
          background: #0d0d15;
          border: 1px solid #1a1a2e;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .code-toolbar {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid #1a1a2e;
        }
        .code-dots { display: flex; gap: 6px; }
        .code-dots span { width: 10px; height: 10px; border-radius: 50%; background: #333; }
        .code-dots span:first-child { background: #FF5F57; }
        .code-dots span:nth-child(2) { background: #FFBD2E; }
        .code-dots span:last-child { background: #28CA41; }
        .code-filename { font-size: 12px; color: #555; font-family: monospace; }
        .code-body { padding: 20px; }
        .code-body pre { margin: 0; }
        .code-body code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 14px; color: #00cec9; line-height: 1.6; }
        .code-run-btn {
          display: block; width: 100%; padding: 12px;
          border: none; color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: opacity 0.2s;
        }
        .code-run-btn:hover { opacity: 0.9; }
        .code-instructions { font-size: 14px; color: #999; line-height: 1.6; }

        /* Quiz */
        .quiz-placeholder, .dd-placeholder, .sim-canvas {
          background: rgba(20, 20, 35, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 80px 40px;
          text-align: center;
        }
        .quiz-icon, .dd-icon, .sim-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.4; }
        .quiz-label, .dd-label, .sim-label { font-size: 18px; font-weight: 600; color: #e5e5e5; margin-bottom: 8px; }
        .quiz-desc, .dd-desc, .sim-desc { font-size: 14px; color: #737373; margin-bottom: 24px; }
        .quiz-start-btn {
          display: inline-block; padding: 12px 32px;
          border: none; border-radius: 999px;
          color: white; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: opacity 0.2s;
        }
        .quiz-start-btn:hover { opacity: 0.9; }

        /* Nav footer */
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
          color: #999;
          text-decoration: none;
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
          .anim-canvas, .quiz-placeholder, .dd-placeholder, .sim-canvas { padding: 60px 24px; }
          .lsn-footer { flex-direction: column; }
        }
      `}</style>

      <div className="lsn-shell">
        <nav className="lsn-nav">
          <Link href={`/academy/${course.slug}`}>&larr; {course.title}</Link>
          <span style={{ fontSize: 13, color: accent, fontWeight: 600 }}>{course.icon_emoji} Academy</span>
        </nav>

        <div className="lsn-progress-bar">
          <div className="lsn-progress-track">
            <div
              className="lsn-progress-fill"
              style={{
                width: `${((currentIdx + 1) / allLessons.length) * 100}%`,
                background: accent,
              }}
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
          <LessonContent lesson={lesson} accent={accent} />
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
