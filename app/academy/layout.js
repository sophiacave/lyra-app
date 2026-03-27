import { getAllCourses } from '../../lib/courses';
import ConsoleShell from '../components/console/ConsoleShell';

export const metadata = {
  title: 'Academy — Like One',
  description: '30 courses, 300+ interactive lessons. AI education for everyone — beginners, executives, creatives, and developers.',
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
