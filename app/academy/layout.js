import { getAllCourses } from '../../lib/courses';
import AcademySidebar from '../components/academy/AcademySidebar';

export const metadata = {
  title: 'Academy — Like One',
  description: '30 courses, 300+ interactive lessons. AI education for everyone — beginners, executives, creatives, and developers.',
};

export default function AcademyLayout({ children }) {
  const courses = getAllCourses();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#08080a',
    }}>
      <AcademySidebar courses={courses} />
      <main style={{
        flex: 1,
        minWidth: 0,
        overflowX: 'hidden',
      }}>
        {children}
      </main>
    </div>
  );
}
