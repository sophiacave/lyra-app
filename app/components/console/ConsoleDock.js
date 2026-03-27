'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ConsoleDock({ courses = [], currentCourseSlug, currentLessonSlug }) {
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

  const isAcademyHome = pathname === '/academy' || pathname === '/academy/';

  const dockContent = (
    <div className="lo-dock-scroll">
      {/* App identity */}
      <Link href="/academy/" className="lo-dock-appheader" onClick={() => setIsOpen(false)}>
        <span className="lo-dock-appicon">📚</span>
        <span className="lo-dock-appname">Academy</span>
      </Link>

      {/* Quick nav */}
      <div className="lo-dock-quicknav">
        <Link
          href="/academy/"
          className={`lo-dock-quicklink ${isAcademyHome ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          <span className="lo-dock-quickicon">⌂</span>
          <span>All Courses</span>
        </Link>
      </div>

      <div className="lo-dock-divider" />

      {/* Course tree */}
      {Object.entries(tiers).map(([tierSlug, tier]) => (
        <div key={tierSlug} className="lo-dock-tier">
          <div className="lo-dock-tier-label">
            {tier.emoji} {tier.name}
          </div>

          {tier.courses.map(course => {
            const isExpanded = expandedCourse === course.slug;
            const isCurrent = currentCourseSlug === course.slug;

            return (
              <div key={course.slug} className="lo-dock-course">
                <button
                  onClick={() => toggleCourse(course.slug)}
                  className={`lo-dock-course-btn ${isCurrent ? 'current' : ''}`}
                >
                  <span className={`lo-dock-chevron ${isExpanded ? 'expanded' : ''}`}>▶</span>
                  <span className="lo-dock-course-emoji">{course.emoji}</span>
                  <span className="lo-dock-course-title">{course.title}</span>
                </button>

                {isExpanded && (
                  <div className="lo-dock-lessons">
                    {course.lessons.map(lesson => {
                      const isActive = currentLessonSlug === lesson.slug;
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/academy/${course.slug}/${lesson.slug}/`}
                          className={`lo-dock-lesson ${isActive ? 'active' : ''}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="lo-dock-lesson-dot" />
                          <span className="lo-dock-lesson-title">{lesson.title}</span>
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
        className="lo-dock-toggle"
        aria-label="Toggle navigation"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="lo-dock-overlay" />
      )}

      {/* Dock */}
      <aside className={`lo-dock ${isOpen ? 'lo-dock-open' : ''}`}>
        {dockContent}
      </aside>
    </>
  );
}
