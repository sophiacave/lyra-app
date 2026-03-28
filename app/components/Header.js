'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { site, nav } from '../../lib/site-config';

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

  if (variant === 'blog') {
    return (
      <nav className="blog-topnav">
        <div className="blog-topnav-inner">
          <Link href="/" className="blog-topnav-brand">{site.name}</Link>
          <div className="blog-topnav-links">
            {links.map(link => (
              <Link key={link.href} href={link.href}
                className={activeLink === link.href ? 'active' : ''}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  if (variant === 'site') {
    return (
      <header className="header-site">
        <nav className="header-site-nav">
          <Link href="/" className="header-site-brand">
            like<span className="accent">one</span>
          </Link>
          <button
            className="site-mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '\u2715' : '\u2630'}
          </button>
          <div className={`site-nav-links${mobileOpen ? ' active' : ''}`}>
            {links.map(link => {
              const active = activeLink ? activeLink === link.href : isActive(link.href, pathname);
              return (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`header-site-link${active ? ' active' : ''}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    );
  }

  // Main variant
  return (
    <header className="header-main">
      <div className="header-main-inner">
        <Link href="/" className="header-main-brand">{site.name}</Link>
        <nav className="header-main-links">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`header-main-link${activeLink === link.href ? ' active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
