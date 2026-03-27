import { getAllCourses } from '../../lib/courses';
import AcademySidebar from '../components/academy/AcademySidebar';

export const metadata = {
  title: 'Academy — Like One',
  description: '30 courses, 300+ interactive lessons. AI education for everyone — beginners, executives, creatives, and developers.',
};

export default function AcademyLayout({ children }) {
  const courses = getAllCourses();

  return (
    <div className="console-layout">
      <AcademySidebar courses={courses} />
      <main className="console-main">
        {children}
      </main>
    </div>
  );
}
