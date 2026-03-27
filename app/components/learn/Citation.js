'use client';
import { useState, useRef, useEffect } from 'react';

/**
 * Citation — Academic Reference Component
 *
 * Small superscript number. Click to expand tooltip with full reference.
 * Selective use — 2-5 per lesson max for legitimacy.
 *
 * Props:
 *   num: number (display number)
 *   title: string (paper/source title)
 *   authors?: string
 *   year?: string | number
 *   source?: string (journal, MIT OCW, etc.)
 *   url?: string (link to source)
 */

export default function Citation({
  num,
  title,
  authors = '',
  year = '',
  source = '',
  url = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  return (
    <span className="lo-cite" ref={ref}>
      <span
        className="lo-cite-ref"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        role="button"
        aria-label={`Citation ${num}`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setOpen(!open); }}
      >
        {num}
      </span>

      {open && (
        <span className="lo-cite-tooltip">
          <span className="lo-cite-tooltip-title">{title}</span>
          {authors && <span className="lo-cite-tooltip-authors"> — {authors}</span>}
          {year && <span>, {year}</span>}
          {source && (
            <span className="lo-cite-tooltip-source">
              <br />{source}
            </span>
          )}
          {url && (
            <span>
              <br />
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem' }}>
                View source →
              </a>
            </span>
          )}
        </span>
      )}
    </span>
  );
}
