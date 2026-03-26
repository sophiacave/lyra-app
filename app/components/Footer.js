import Link from 'next/link';
import { site, colors, footer as footerConfig } from '../../lib/site-config';

export default function Footer({ variant = 'main' }) {
  if (variant === 'blog') {
    return (
      <footer style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '40px 24px',
        borderTop: `1px solid ${colors.border}`,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', color: colors.textDim, lineHeight: 1.8 }}>
          <a href={site.url} style={{ color: colors.textDim, textDecoration: 'none', transition: 'color 0.2s' }}>{site.domain}</a>
          {' \u00B7 '}
          <a href={`mailto:${site.email}`} style={{ color: colors.textDim, textDecoration: 'none', transition: 'color 0.2s' }}>{site.email}</a>
          {' \u00B7 '}
          <a href={`tel:${site.phoneRaw}`} style={{ color: colors.textDim, textDecoration: 'none', transition: 'color 0.2s' }}>{site.phone}</a>
        </p>
      </footer>
    );
  }

  if (variant === 'site') {
    return (
      <footer style={{
        padding: '2.5rem 2rem',
        borderTop: `1px solid ${colors.border}`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.75rem', color: '#e8e8ec' }}>
            like<span style={{ color: colors.purple }}>one</span>
          </div>
          <p style={{ color: '#8a8aaa', fontSize: '.75rem', marginBottom: '.5rem' }}>
            Built by {site.founder}. Powered by convergence.
          </p>
          <p style={{ color: '#8a8aaa', fontSize: '.75rem', marginBottom: '.5rem' }}>
            &copy; {site.copyright}. All rights reserved. &bull;{' '}
            <a href={`mailto:${site.email}`} style={{ color: colors.purple, textDecoration: 'none' }}>{site.email}</a> &bull;{' '}
            <a href={`tel:${site.phoneRaw}`} style={{ color: colors.purple, textDecoration: 'none' }}>{site.phone}</a>
          </p>
          <p style={{ color: '#8a8aaa', fontSize: '.75rem', marginTop: '8px' }}>
            {footerConfig.links.map((link, i) => (
              <span key={link.href}>
                {i > 0 && ' \u2022 '}
                <Link href={link.href} style={{ color: colors.purple, textDecoration: 'none' }}>{link.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </footer>
    );
  }

  // Main variant
  return (
    <footer style={{
      background: colors.cardBg,
      borderTop: `1px solid ${colors.border}`,
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: '#999',
      fontSize: '.85rem',
    }}>
      <p>{footerConfig.text}</p>
    </footer>
  );
}
