'use client';

import Link from 'next/link';

/**
 * Button — The one button to rule them all.
 * Apple HIG v2: 44px+ touch targets, spring transitions, focus rings.
 *
 * Variants: primary | secondary | ghost | accent
 * Sizes: sm (36px) | md (44px) | lg (48px)
 *
 * Usage:
 *   <Button>Click</Button>
 *   <Button variant="primary" size="lg">Go Pro</Button>
 *   <Button href="/tools/" variant="ghost">Browse</Button>
 *   <Button variant="accent" fullWidth>Generate</Button>
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  href,
  external,
  fullWidth,
  disabled,
  loading,
  className = '',
  ...props
}) {
  const classes = [
    'lo-btn',
    `lo-btn--${variant}`,
    `lo-btn--${size}`,
    fullWidth && 'lo-btn--full',
    disabled && 'lo-btn--disabled',
    className,
  ].filter(Boolean).join(' ');

  const content = loading ? (
    <span className="lo-btn__loading" aria-hidden="true" />
  ) : children;

  // Link variant
  if (href && !disabled) {
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener" {...props}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} type="button" {...props}>
      {content}
    </button>
  );
}
