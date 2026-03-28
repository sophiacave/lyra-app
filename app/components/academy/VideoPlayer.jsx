'use client';

const BUNNY_LIBRARY_ID = 626785;

/**
 * VideoPlayer — Bunny Stream adaptive HLS video player.
 * Embeds via iframe with responsive 16:9 aspect ratio.
 * Supports autoplay, resume position, and keyboard controls.
 */
export default function VideoPlayer({ videoId, title }) {
  if (!videoId) return null;

  const embedUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;

  return (
    <div className="video-player-wrap">
      <div className="video-player-aspect">
        <iframe
          src={embedUrl}
          title={title || 'Lesson Video'}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="video-player-iframe"
        />
      </div>
      <style jsx>{`
        .video-player-wrap {
          margin: 0 0 2rem;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border, rgba(255,255,255,0.06));
          background: var(--surface-base, #08080a);
        }
        .video-player-aspect {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 */
        }
        .video-player-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
}
