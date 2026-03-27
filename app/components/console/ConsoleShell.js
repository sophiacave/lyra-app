'use client';
import ConsoleTopBar from './ConsoleTopBar';
import ConsoleDock from './ConsoleDock';
import ConsoleStatusBar from './ConsoleStatusBar';

export default function ConsoleShell({
  children,
  appName = 'Academy',
  appEmoji = '📚',
  courses = [],
  currentCourseSlug,
  currentLessonSlug,
  activity = 'idle',
}) {
  return (
    <div className="lo-shell">
      <ConsoleTopBar appName={appName} appEmoji={appEmoji} />
      <div className="lo-shell-body">
        <ConsoleDock
          courses={courses}
          currentCourseSlug={currentCourseSlug}
          currentLessonSlug={currentLessonSlug}
        />
        <main className="lo-appframe">
          {children}
        </main>
      </div>
      <ConsoleStatusBar appName={appName} activity={activity} />
    </div>
  );
}
