'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AcademySidebar({ courses, currentCourseSlug, currentLessonSlug }) {
  const pathname = usePathname();
  const [expandedCourse, setExpandedCourse] = useState(currentCourseSlug || null);
  const [isOpen, setIsOpen] = useState(false);

  const liveCourses = courses.filter(c => c.status === 'live');

  const tiers = {};
  for (const course of liveCourses) {
    if (!tiers[course.tierSlug]) {
      tiers[course.tierSlug] = { name: course.tierName, emoji: course.tierEmoji, courses: [] };
    }
    tiers[course.tierSlug].courses.push(course);
  }

  const toggleCourse = (slug) => {
    setExpandedCourse(expandedCourse === slug ? null : slug);
  };

  const sidebarContent = (
    <div className="glass-scroll" style={{
      padding: '24px 16px',
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <Link href="/academy/" style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '32px',
        padding: '0 8px',
      }}>
        <span style={{
          fontSize: '20px',
          background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          letterSpacing: '-0.3px',
        }}>
          Like One
        </span>
        <span style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '13px',
          fontWeight: 500,
        }}>Academy</span>
      </Link>

      {/* Tier sections */}
      {Object.entries(tiers).map(([tierSlug, tier]) => (
        <div key={tierSlug} style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            padding: '0 8px',
            marginBottom: '10px',
          }}>
            {tier.emoji} {tier.name}
          </div>

          {tier.courses.map(course => {
            const isExpanded = expandedCourse === course.slug;
            const isCurrent = currentCourseSlug === course.slug;

            return (
              <div key={course.slug} style={{ marginBottom: '2px' }}>
                <button
                  onClick={() => toggleCourse(course.slug)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 10px',
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(192,132,252,0.1), rgba(56,189,248,0.05))'
                      : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    color: isCurrent ? '#e8e8ec' : '#8888a0',
                    fontSize: '13px',
                    fontWeight: isCurrent ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderLeft: isCurrent ? '2px solid rgba(192,132,252,0.5)' : '2px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{course.emoji}</span>
                  <span style={{ flex: 1, lineHeight: 1.3 }}>{course.title}</span>
                  <span style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.15)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>
                    ▶
                  </span>
                </button>

                {isExpanded && (
                  <div style={{
                    paddingLeft: '24px',
                    marginTop: '4px',
                    marginBottom: '8px',
                  }}>
                    {course.lessons.map(lesson => {
                      const isActive = currentLessonSlug === lesson.slug;
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/academy/${course.slug}/${lesson.slug}/`}
                          className="glass-animate-in"
                          style={{
                            display: 'block',
                            padding: '6px 12px',
                            fontSize: '12px',
                            color: isActive ? '#c084fc' : 'rgba(255,255,255,0.35)',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            background: isActive ? 'rgba(192,132,252,0.08)' : 'transparent',
                            borderLeft: isActive ? '2px solid #c084fc' : '2px solid transparent',
                            transition: 'all 0.2s ease',
                            lineHeight: 1.5,
                          }}
                        >
                          {lesson.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 1001,
          background: 'linear-gradient(135deg, rgba(192,132,252,0.9), rgba(56,189,248,0.9))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(192,132,252,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
        }}
        className="glass-sidebar-toggle"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="glass-mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`glass-sidebar glass-sidebar-mobile ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          width: '300px',
          minWidth: '300px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
