import Link from 'next/link';
import { site, footer as footerConfig } from '../../lib/site-config';

export default function Footer({ variant = 'main' }) {
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
      </footer>
    );
  }

  if (variant === 'site') {
    return (
      <footer className="footer-site">
        <div className="footer-site-inner">
          <div className="footer-site-brand">like<span className="accent">one</span></div>
          <p className="footer-site-text">Built by {site.founder}. Powered by convergence.</p>
          <p className="footer-site-text">
            &copy; {site.copyright}. All rights reserved. &bull;{' '}
            <a href={`mailto:${site.email}`} className="footer-site-link">{site.email}</a> &bull;{' '}
            <a href={`tel:${site.phoneRaw}`} className="footer-site-link">{site.phone}</a>
          </p>
          <p className="footer-site-text">
            {footerConfig.links.map((link, i) => (
              <span key={link.href}>
                {i > 0 && ' \u2022 '}
                <Link href={link.href} className="footer-site-link">{link.label}</Link>
              </span>
            ))}
          </p>
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
