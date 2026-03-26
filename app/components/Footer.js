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
