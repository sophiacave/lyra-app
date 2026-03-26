import Header from './Header';
import Footer from './Footer';
import { colors, fonts } from '../../lib/site-config';

export default function SiteLayout({ children, maxWidth = '720px' }) {
  return (
    <div style={{
      background: colors.surfaceBg,
      color: colors.textBody,
      fontFamily: fonts.primary,
      minHeight: '100vh',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <Header variant="site" />
      <main style={{
        maxWidth,
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}>
        {children}
      </main>
      <Footer variant="site" />
    </div>
  );
}
