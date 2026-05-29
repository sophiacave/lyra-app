import { getAllCourses } from '../../lib/courses';
import ConsoleShell from '../components/console/ConsoleShell';

export const metadata = {
  title: 'Like One Academy — 52 Free AI Automation Courses | Claude, Agents & More',
  description: 'Best free AI automation courses. 520+ hands-on lessons covering Claude, AI agents, prompt engineering, RAG, and MCP. Start free — no credit card, no time limit.',
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
