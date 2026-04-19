import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { site } from '../../../lib/site-config';
import { getArtistBySlug, getAllArtistSlugs } from '../../../lib/artists';

export async function generateStaticParams() {
  return getAllArtistSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  return {
    title: `${artist.name} \u2014 Timbre by Like One Studio`,
    description: artist.tagline || `${artist.name} on Timbre. AI-powered music production by Like One Studio.`,
    alternates: { canonical: `${site.url}/artists/${slug}/` },
    openGraph: {
      title: `${artist.name} \u2014 Timbre`,
      description: artist.tagline,
      url: `${site.url}/artists/${slug}/`,
      images: artist.image ? [{ url: artist.image }] : [{ url: site.ogImage, ...site.ogImageSize }],
    },
  };
}

export default async function ArtistPage({ params }) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const socialLinks = Object.entries(artist.socials || {}).filter(([, v]) => v);

  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <div className="artist-hero">
        <div className="artist-hero-avatar">
          {artist.image ? (
            <img src={artist.image} alt={artist.name} className="artist-hero-img" />
          ) : (
            <span className="artist-hero-initial">{artist.name[0]}</span>
          )}
        </div>
        <h1 className="artist-hero-name">{artist.name}</h1>
        <p className="artist-hero-tagline">{artist.tagline}</p>
        <p className="artist-hero-origin">{artist.origin}</p>
        <div className="artist-hero-genres">
          {artist.genres.map(g => (
            <span key={g} className="timbre-genre-tag">{g}</span>
          ))}
        </div>
        {socialLinks.length > 0 && (
          <div className="artist-socials">
            {socialLinks.map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="artist-social-link">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bio */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <div className="artist-bio" dangerouslySetInnerHTML={{ __html: artist.contentHtml }} />
        </div>
      </section>

      {/* Tracks */}
      {artist.tracks && artist.tracks.length > 0 && (
        <section className="site-section-sm bg-raised">
          <div className="site-container-narrow">
            <span className="site-section-tag">MUSIC</span>
            <h2 className="site-section-title-md">Listen</h2>

            <div className="artist-tracks">
              {artist.tracks.filter(t => t.youtube).map(track => (
                <div key={track.title} className="artist-track-card">
                  <div className="artist-track-embed">
                    <iframe
                      src={`https://www.youtube.com/embed/${track.youtube.split('v=')[1]}`}
                      title={track.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="artist-track-iframe"
                    />
                  </div>
                  <div className="artist-track-info">
                    <h3 className="artist-track-title">{track.title}</h3>
                    <span className="artist-track-type">{track.type}</span>
                    {track.year && <span className="artist-track-year">{track.year}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timbre Remixes Coming Soon */}
      <section className="site-section-sm">
        <div className="site-container-narrow text-center">
          <span className="site-section-tag">COMING SOON</span>
          <h2 className="site-section-title-md">Timbre Remixes</h2>
          <p className="site-story-text">
            {artist.name}&rsquo;s music reimagined across genres. EDM, K-pop, J-pop, traditional Vietnamese, classical, hip-hop, lo-fi, and pop versions &mdash; all built around the original vocal performance.
          </p>
          <div className="timbre-coming-soon-grid">
            {['EDM', 'K-Pop', 'J-Pop', 'Vietnamese Traditional', 'Classical', 'Hip-Hop', 'Lo-Fi', 'Pop'].map(g => (
              <div key={g} className="timbre-coming-tag">{g}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="site-section-sm text-center bg-raised">
        <h2 className="site-section-title-md">Powered by Timbre</h2>
        <p className="about-cta-desc">AI-powered music production by Like One Studio. Free for artists.</p>
        <div className="site-cta-row">
          <Link href="/timbre/" className="site-btn-primary">Learn About Timbre</Link>
          <Link href="/artists/" className="site-btn-secondary">All Artists</Link>
        </div>
      </div>

      <Footer variant="site" />
    </div>
  );
}
