'use client';

const BUNNY_CDN = 'https://vz-6aead46a-d20.b-cdn.net';
const BUNNY_LIBRARY_ID = 626785;

/**
 * VideoThumbnail — Cinematic video thumbnail with Rothko-grade aesthetics.
 * Shows Bunny CDN thumbnail with vignette, film grain, and play overlay.
 * Visual Bible V3: McQueen restraint + Rothko fields.
 */
export default function VideoThumbnail({ videoId, title, size = 'card', onClick }) {
  if (!videoId) return null;

  const thumbnailUrl = `${BUNNY_CDN}/${videoId}/thumbnail.jpg`;
  const isHero = size === 'hero';

  return (
    <div
      className={`vid-thumb ${isHero ? 'vid-thumb--hero' : 'vid-thumb--card'}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Play ${title || 'video'}` : undefined}
    >
      <div className="vid-thumb__aspect">
        <img
          src={thumbnailUrl}
          alt={title || 'Video thumbnail'}
          className="vid-thumb__img"
          loading="lazy"
          decoding="async"
        />

        {/* Cinematic vignette overlay */}
        <div className="vid-thumb__vignette" />

        {/* Film grain texture */}
        <div className="vid-thumb__grain" />

        {/* Bottom gradient for text readability */}
        <div className="vid-thumb__gradient" />

        {/* Play button — McQueen minimal */}
        <div className="vid-thumb__play">
          <div className="vid-thumb__play-ring">
            <svg viewBox="0 0 24 24" fill="none" className="vid-thumb__play-icon">
              <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="vid-thumb__badge">
          <span className="vid-thumb__badge-dot" />
          VIDEO
        </div>
      </div>

      <style jsx>{`
        .vid-thumb {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: ${onClick ? 'pointer' : 'default'};
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .vid-thumb:hover {
          transform: ${onClick ? 'scale(1.02)' : 'none'};
          box-shadow: ${onClick ? '0 16px 64px rgba(0,0,0,0.5), 0 0 48px rgba(192,132,252,0.08)' : 'none'};
        }
        .vid-thumb:hover .vid-thumb__play-ring {
          transform: scale(1.1);
          background: rgba(192, 132, 252, 0.25);
          border-color: rgba(192, 132, 252, 0.5);
        }
        .vid-thumb:hover .vid-thumb__img {
          transform: scale(1.05);
        }

        .vid-thumb--card {
          border: 1px solid var(--border-default);
        }
        .vid-thumb--hero {
          border: 1px solid var(--border-medium);
          box-shadow: 0 24px 80px rgba(0,0,0,0.4), 0 0 80px rgba(192,132,252,0.06);
        }

        .vid-thumb__aspect {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 */
          background: #0B0A10; /* void */
        }
        .vid-thumb__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Caravaggio vignette — radial darkening */
        .vid-thumb__vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 80% at 50% 50%,
            transparent 40%,
            rgba(11, 10, 16, 0.5) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Film grain — subtle organic texture */
        .vid-thumb__grain {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 256px 256px;
        }

        /* Bottom gradient for readability */
        .vid-thumb__gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(11, 10, 16, 0.7) 0%, transparent 100%);
          pointer-events: none;
          z-index: 3;
        }

        /* Play button — devastating simplicity */
        .vid-thumb__play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          pointer-events: none;
        }
        .vid-thumb__play-ring {
          width: ${isHero ? '80px' : '56px'};
          height: ${isHero ? '80px' : '56px'};
          border-radius: 50%;
          background: rgba(11, 10, 16, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(240, 235, 227, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .vid-thumb__play-icon {
          width: ${isHero ? '28px' : '20px'};
          height: ${isHero ? '28px' : '20px'};
          color: #F0EBE3; /* chalk */
          margin-left: 3px; /* optical center */
        }

        /* Video badge — overline style */
        .vid-thumb__badge {
          position: absolute;
          top: ${isHero ? '16px' : '10px'};
          left: ${isHero ? '16px' : '10px'};
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #F0EBE3; /* chalk */
          background: rgba(11, 10, 16, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(240, 235, 227, 0.1);
        }
        .vid-thumb__badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c084fc;
          box-shadow: 0 0 8px rgba(192, 132, 252, 0.4);
        }
      `}</style>
    </div>
  );
}

export { BUNNY_CDN, BUNNY_LIBRARY_ID };
