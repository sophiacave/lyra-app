import Link from 'next/link';
import { site, nav, footer as footerConfig } from '../../lib/site-config';

export default function Footer({ variant = 'main' }) {
  const footerNav = nav.footer || [];

  if (variant === 'blog') {
    return (
      <footer className="blog-site-footer">
        <p>
          <a href={site.url}>{site.domain}</a>
          {' \u00B7 '}
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {' \u00B7 '}
          <a href={`tel:${site.phoneRaw}`}>{site.phone}</a>
        </p>
        <p className="blog-footer-legal">
          {footerConfig.links.map((link, i) => (
            <span key={link.href}>
              {i > 0 && ' \u2022 '}
              <Link href={link.href}>{link.label}</Link>
            </span>
          ))}
        </p>
      </footer>
    );
  }

  if (variant === 'site') {
    return (
      <footer className="footer-site">
        <div className="footer-site-inner">
          <div className="footer-site-top">
            <div className="footer-site-brand-col">
              <div className="footer-site-brand">like<span className="accent">one</span></div>
              <p className="footer-site-tagline">Human-AI collaboration platform.</p>
            </div>

            <div className="footer-site-col">
              <div className="footer-site-col-title">Products</div>
              {nav.apps.map(app => (
                <Link key={app.href} href={app.href} className="footer-site-link">
                  <span className="footer-app-icon">{app.icon}</span> {app.label}
                </Link>
              ))}
            </div>

            <div className="footer-site-col">
              <div className="footer-site-col-title">Company</div>
              <Link href="/about/" className="footer-site-link">About</Link>
              <Link href="/blog/" className="footer-site-link">Blog</Link>
              <Link href="/pricing/" className="footer-site-link">Pricing</Link>
            </div>

            <div className="footer-site-col">
              <div className="footer-site-col-title">Open Source</div>
              <a href="https://smithery.ai/servers/sophiacave-me/mcp-shield" className="footer-site-link" target="_blank" rel="noopener noreferrer">MCP Shield</a>
              <a href="https://smithery.ai/servers/sophiacave-me/orchard-hig" className="footer-site-link" target="_blank" rel="noopener noreferrer">Orchard HIG</a>
              <a href="https://smithery.ai/servers/sophiacave-me/orchard-sign" className="footer-site-link" target="_blank" rel="noopener noreferrer">Orchard Sign</a>
            </div>

            <div className="footer-site-col">
              <div className="footer-site-col-title">Resources</div>
              {footerNav.map(link => (
                <Link key={link.href} href={link.href} className="footer-site-link">{link.label}</Link>
              ))}
            </div>
          </div>

          <div className="footer-site-bottom">
            <p className="footer-site-text">
              &copy; {site.copyright}. All rights reserved. &bull;{' '}
              <a href={`mailto:${site.email}`} className="footer-site-link">{site.email}</a>
            </p>
            <p className="footer-site-legal">
              {footerConfig.links.map((link, i) => (
                <span key={link.href}>
                  {i > 0 && ' \u2022 '}
                  <Link href={link.href} className="footer-site-link">{link.label}</Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Main variant
  return (
    <footer className="footer-main">
      <p>{footerConfig.text}</p>
    </footer>
  );
}
