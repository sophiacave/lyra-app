import Link from 'next/link';
import { site, colors, nav } from '../../lib/site-config';

export default function Header({ variant = 'main', activeLink = '' }) {
  const links = variant === 'blog' ? nav.blog : nav.main;
  const isBlog = variant === 'blog';

  if (isBlog) {
    return (
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: colors.navBgBlog,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{
            fontSize: '15px',
            fontWeight: 700,
            color: colors.blue,
            textDecoration: 'none',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {site.name}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {links.map(link => (
              <Link key={link.href} href={link.href} style={{
                color: activeLink === link.href ? colors.blue : colors.textMuted,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Main variant (products, calculator, etc.)
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: colors.navBg,
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${colors.border}`,
      padding: '1.25rem 0',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          background: colors.gradientBrand,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textDecoration: 'none',
        }}>
          {site.name}
        </Link>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{
              color: activeLink === link.href ? colors.purple : '#e0e0e0',
              textDecoration: 'none',
              fontSize: '.95rem',
              fontWeight: 500,
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
