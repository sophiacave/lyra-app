import Header from './Header';
import Footer from './Footer';

export default function SiteLayout({ children, maxWidth = '720px' }) {
  return (
    <div className="site-page">
      <Header variant="site" />
      <main className="site-layout-main" style={{ maxWidth }}>
        {children}
      </main>
      <Footer variant="site" />
    </div>
  );
}
