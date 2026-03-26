'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { site, colors, nav } from '../../lib/site-config';

function isActive(href, pathname) {
  const clean = pathname.replace(/\/$/, '');
  const linkClean = href.replace(/\/$/, '');
  if (clean === '' && linkClean === '') return true;
  if (linkClean === '') return false;
  return clean === linkClean || clean.startsWith(linkClean + '/');
}

export default function Header({ variant = 'main', activeLink = '' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const links = variant === 'blog' ? nav.blog : variant === 'site' ? nav.site : nav.main;
  const isBlog = variant === 'blog';
  const isSite = variant === 'site';

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

  if (isSite) {
    return (
      <>
        <style>{`
          .site-nav-links { display: flex; list-style: none; gap: 2rem; align-items: center; }
          .site-mobile-toggle { display: none; background: none; border: none; color: #e8e8ec; font-size: 1.5rem; cursor: pointer; padding: 4px; }
          @media (max-width: 768px) {
            .site-nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 0; background: #111114; border-bottom: 1px solid #1e1e28; z-index: 999; }
            .site-nav-links.active { display: flex; }
            .site-nav-links a { display: block; padding: 1rem 2rem; border-bottom: 1px solid #1e1e28; text-align: left; }
            .site-mobile-toggle { display: block; }
          }
        `}</style>
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: colors.navBgSite,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            maxWidth: '1100px',
            margin: '0 auto',
            position: 'relative',
          }}>
            <Link href="/" style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              textDecoration: 'none',
              color: '#e8e8ec',
            }}>
              like<span style={{ color: colors.purple }}>one</span>
            </Link>
            <button
              className="site-mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '\u2715' : '\u2630'}
            </button>
            <div className={`site-nav-links${mobileOpen ? ' active' : ''}`}>
              {links.map(link => {
                const active = activeLink ? activeLink === link.href : isActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      color: active ? colors.purple : '#8888a0',
                      textDecoration: 'none',
                      fontSize: '.875rem',
                      fontWeight: active ? 700 : 500,
                      transition: 'color .25s',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </header>
      </>
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
