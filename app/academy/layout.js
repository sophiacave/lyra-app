import { getAllCourses } from '../../lib/courses';
import ConsoleShell from '../components/console/ConsoleShell';

export const metadata = {
  title: 'Like One Academy — 30 Free AI Courses | Claude & More',
  description: 'Learn AI hands-on with 300+ interactive lessons. From Claude basics to building autonomous agents. Start free — no credit card, no time limit. Beginner to advanced.',
  alternates: { canonical: 'https://likeone.ai/academy/' },
};

export default function AcademyLayout({ children }) {
  const courses = getAllCourses();

  return (
    <ConsoleShell
      appName="Academy"
      appEmoji="📚"
      courses={courses}
    >
      {children}
    </ConsoleShell>
  );
}
