import Header from './Header';
import Footer from './Footer';

export default function SiteLayout({ children, maxWidth = '720px' }) {
  return (
    <div className="site-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header variant="site" />
      <main id="main-content" className="site-layout-main" style={{ maxWidth }}>
        {children}
      </main>
      <Footer variant="site" />
    </div>
  );
}
