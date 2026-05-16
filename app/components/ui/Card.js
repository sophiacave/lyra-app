'use client';

import Link from 'next/link';

/**
 * Card — Liquid glass card primitive.
 * Two variants: glass (default, backdrop-filter) | solid (opaque background).
 * Optional hover lift, optional link wrapper.
 *
 * Usage:
 *   <Card>Content here</Card>
 *   <Card hover>Lifts on hover</Card>
 *   <Card href="/tools/" hover>Clickable card</Card>
 *   <Card variant="solid" padding="lg">Opaque card</Card>
 */
export default function Card({
  children,
  variant = 'glass',
  padding = 'md',
  hover,
  href,
  external,
  className = '',
  ...props
}) {
  const classes = [
    'lo-card',
    `lo-card--${variant}`,
    `lo-card--pad-${padding}`,
    hover && 'lo-card--hover',
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
