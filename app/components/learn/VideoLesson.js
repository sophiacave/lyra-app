'use client';

/**
 * VideoLesson — Scrollytelling lesson component
 * Sticky video/animation panel + scrolling text content.
 * The scroll position drives the video/animation state.
 * Follows Mayer's multimedia principles:
 *   - Temporal contiguity (narration + animation synchronized)
 *   - Segmenting (user-paced via scroll)
 *   - Signaling (highlights guide attention)
 *   - Coherence (no extraneous content)
 */
import { useState, useRef, useEffect, useCallback } from 'react';

export default function VideoLesson({ videoSrc, segments, posterSrc }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [activeSegment, setActiveSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Track scroll position to determine active segment
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const segmentEls = container.querySelectorAll('[data-segment]');
      const containerRect = container.getBoundingClientRect();
      const midpoint = containerRect.top + containerRect.height / 3;

      let closest = 0;
      let closestDist = Infinity;

      segmentEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - midpoint);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      if (closest !== activeSegment) {
        setActiveSegment(closest);
        // Seek video to segment timestamp
        if (videoRef.current && segments[closest]?.timestamp) {
          videoRef.current.currentTime = segments[closest].timestamp;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSegment, segments]);

  // Video progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  if (!segments || segments.length === 0) return null;

  return (
    <div ref={containerRef} className="video-lesson">
      {/* Sticky video panel */}
      <div className="video-lesson-sticky">
        <div
          className="video-lesson-player"
          onMouseEnter={() => setShowControls(true)}
          onMouseMove={() => setShowControls(true)}
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          onKeyDown={(e) => e.key === ' ' && togglePlay()}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              preload="metadata"
              playsInline
              className="video-lesson-video"
            >
              <track kind="captions" src="" label="English" />
            </video>
          ) : (
            /* Placeholder for when video isn't generated yet */
            <div className="video-lesson-placeholder">
              <div className="video-lesson-placeholder-icon">🎬</div>
              <p>Video generating...</p>
            </div>
          )}

          {/* Controls overlay */}
          <div className={`video-lesson-controls ${showControls ? 'visible' : ''}`}>
            <button className="video-lesson-play-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="video-lesson-progress">
              <div className="video-lesson-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Segment indicator */}
        <div className="video-lesson-segments">
          {segments.map((seg, i) => (
            <button
              key={i}
              className={`video-lesson-segment-dot ${i === activeSegment ? 'active' : ''} ${i < activeSegment ? 'done' : ''}`}
              onClick={() => {
                setActiveSegment(i);
                if (videoRef.current && seg.timestamp) {
                  videoRef.current.currentTime = seg.timestamp;
                }
                // Scroll to segment
                const el = containerRef.current?.querySelector(`[data-segment="${i}"]`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              aria-label={`Segment ${i + 1}: ${seg.title || ''}`}
            />
          ))}
        </div>
      </div>

      {/* Scrolling content */}
      <div className="video-lesson-content">
        {segments.map((seg, i) => (
          <div
            key={i}
            data-segment={i}
            className={`video-lesson-section ${i === activeSegment ? 'active' : ''}`}
          >
            {seg.title && (
              <h3 className="video-lesson-section-title">{seg.title}</h3>
            )}
            <div className="video-lesson-section-text">
              {seg.content}
            </div>
            {seg.interactive && (
              <div className="video-lesson-section-interactive">
                {seg.interactive}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .video-lesson {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1.5rem;
          min-height: 100vh;
        }

        .video-lesson-sticky {
          position: sticky;
          top: 80px;
          height: fit-content;
          align-self: start;
        }

        .video-lesson-player {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: ${SURFACE_RAISED};
          border: 1px solid ${BORDER};
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
        }

        .video-lesson-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .video-lesson-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: ${TEXT_TERTIARY};
          font-size: 0.9rem;
        }

        .video-lesson-placeholder-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .video-lesson-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-lesson-controls.visible {
          opacity: 1;
        }

        .video-lesson-play-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px;
        }

        .video-lesson-progress {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          overflow: hidden;
          transition: height 0.2s;
        }

        .video-lesson-progress:hover {
          height: 6px;
        }

        .video-lesson-progress-fill {
          height: 100%;
          background: ${ACCENT_PURPLE};
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        .video-lesson-segments {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 0.75rem;
        }

        .video-lesson-segment-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${BORDER};
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }

        .video-lesson-segment-dot.active {
          background: ${ACCENT_WARM};
          transform: scale(1.3);
          box-shadow: 0 0 8px rgba(251, 146, 60, 0.4);
        }

        .video-lesson-segment-dot.done {
          background: ${STATUS_SUCCESS};
        }

        .video-lesson-content {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding: 1rem 0;
        }

        .video-lesson-section {
          opacity: 0.4;
          transition: opacity 0.5s;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid transparent;
        }

        .video-lesson-section.active {
          opacity: 1;
          border-color: ${BORDER};
          background: ${SURFACE_RAISED};
        }

        .video-lesson-section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: ${TEXT_PRIMARY};
          margin-bottom: 0.75rem;
        }

        .video-lesson-section-text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: ${TEXT_SECONDARY};
        }

        .video-lesson-section-interactive {
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .video-lesson {
            grid-template-columns: 1fr;
          }

          .video-lesson-sticky {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}

// CSS variable references for the style jsx
const SURFACE_RAISED = '#0e0e12';
const BORDER = '#1e1e28';
const TEXT_PRIMARY = '#e8e8ec';
const TEXT_SECONDARY = '#a0a0b0';
const TEXT_TERTIARY = '#8888a0';
const ACCENT_PURPLE = '#c084fc';
const ACCENT_WARM = '#fb923c';
const STATUS_SUCCESS = '#4ade80';
