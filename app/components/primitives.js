import Link from 'next/link';

function ctaHref(href, target) {
  const isExternal = target === '_blank' || /^https?:\/\//.test(href || '');
  return { isExternal };
}

function CTAButton({ label, href, style = 'secondary', target }) {
  const { isExternal } = ctaHref(href, target);
  const cls = `site-cta-btn ${style}`;
  if (isExternal || target === '_blank') {
    return (
      <a href={href} className={cls} target={target || '_blank'} rel="noopener">
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export function CTARow({
  primary,
  primaryHref,
  primaryTarget,
  secondary,
  secondaryHref,
  secondaryTarget,
  className = '',
}) {
  return (
    <div className={`site-cta-row ${className}`}>
      {primary && (
        <CTAButton label={primary} href={primaryHref} style="primary" target={primaryTarget} />
      )}
      {secondary && (
        <CTAButton label={secondary} href={secondaryHref} style="secondary" target={secondaryTarget} />
      )}
    </div>
  );
}

export function CTASection({
  title,
  desc,
  primary,
  primaryHref,
  primaryTarget,
  secondary,
  secondaryHref,
  secondaryTarget,
}) {
  return (
    <section className="site-section-sm text-center">
      {title && <h2 className="dm-serif site-section-title-md">{title}</h2>}
      {desc && <p className="site-section-desc centered">{desc}</p>}
      <CTARow
        primary={primary}
        primaryHref={primaryHref}
        primaryTarget={primaryTarget}
        secondary={secondary}
        secondaryHref={secondaryHref}
        secondaryTarget={secondaryTarget}
      />
    </section>
  );
}

export function FeatureCard({
  emoji,
  title,
  desc,
  size,
  centered = false,
  className = '',
}) {
  const sizeCls = size === 'sm' ? 'site-card-sm' : '';
  const centerCls = centered ? 'site-card-centered' : '';
  return (
    <div className={`site-card ${sizeCls} ${centerCls} ${className}`.trim()}>
      {emoji && <div className="site-card-emoji">{emoji}</div>}
      {title && <div className="site-card-title">{title}</div>}
      {desc && <div className="site-card-desc">{desc}</div>}
    </div>
  );
}

export function StatGrid({ stats = [], className = '' }) {
  return (
    <div className={`site-stats-grid ${className}`.trim()}>
      {stats.map((s, i) => (
        <div key={i} className="site-stat">
          <div className="site-stat-number">{s.value ?? s.number}</div>
          <div className="site-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function AmbientField({ seed = 'root', intensity = 'soft', className = '' }) {
  const intensityCls = `ambient-${intensity}`;
  return (
    <div
      aria-hidden="true"
      className={`ambient-field ${intensityCls} ${className}`.trim()}
      data-seed={seed}
    />
  );
}
