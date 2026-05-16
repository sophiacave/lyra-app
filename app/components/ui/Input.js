'use client';

import { forwardRef } from 'react';

/**
 * Input — Unified text input with Apple HIG focus ring.
 * 44px+ min-height, proper padding, hover/focus states built in.
 *
 * Usage:
 *   <Input label="Email" placeholder="you@email.com" />
 *   <Input label="Name" hint="As shown on your resume" />
 *   <Input as="textarea" label="Description" rows={3} />
 *   <Input compact label="Search" />
 */
const Input = forwardRef(function Input({
  label,
  hint,
  error,
  as = 'input',
  compact,
  mono,
  className = '',
  id,
  ...props
}, ref) {
  const Tag = as === 'textarea' ? 'textarea' : 'input';
  const inputId = id || (label ? `lo-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const inputClasses = [
    'lo-input',
    compact && 'lo-input--compact',
    mono && 'lo-input--mono',
    error && 'lo-input--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="lo-field">
      {label && (
        <label className="lo-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={hint || error ? `${inputId}-hint` : undefined}
        {...props}
      />
      {(hint || error) && (
        <span
          id={`${inputId}-hint`}
          className={`lo-field__hint ${error ? 'lo-field__hint--error' : ''}`}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
});

export default Input;
