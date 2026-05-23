'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { nav } from '../../lib/site-config';

function isActive(href, pathname) {
  const clean = pathname.replace(/\/$/, '');
  const linkClean = href.replace(/\/$/, '');
  if (clean === '' && linkClean === '') return true;
  if (linkClean === '') return false;
  return clean === linkClean || clean.startsWith(linkClean + '/');
}

export default function Header({ variant = 'site', activeLink = '' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userPicture, setUserPicture] = useState(null);
  const [userInitial, setUserInitial] = useState('');
  const pathname = usePathname();
  const links = nav.site;

  useEffect(() => {
    const email = localStorage.getItem('lo_email');
    const picture = localStorage.getItem('lo_picture');
    const name = localStorage.getItem('lo_display_name');
    if (email) {
      setIsSignedIn(true);
      setUserPicture(picture || null);
      setUserInitial((name || email).charAt(0).toUpperCase());
    }
  }, []);

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
          {isSignedIn ? (
            <Link href="/account/" onClick={() => setMobileOpen(false)} className="header-avatar-link" aria-label="My Account">
              {userPicture ? (
                <img src={userPicture} alt="" className="header-avatar-img" referrerPolicy="no-referrer" />
              ) : (
                <span className="header-avatar-initial">{userInitial}</span>
              )}
            </Link>
          ) : (
            <Link href="/account/" onClick={() => setMobileOpen(false)} className="header-signin-btn">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
