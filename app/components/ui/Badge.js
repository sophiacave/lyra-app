'use client';

/**
 * Badge — Status and category indicator.
 * Pill-shaped, color-coded.
 *
 * Usage:
 *   <Badge>Free</Badge>
 *   <Badge variant="pro">Pro</Badge>
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="warning">Expiring</Badge>
 */
export default function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const classes = [
    'lo-badge',
    `lo-badge--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
