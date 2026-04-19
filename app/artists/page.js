import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';
import { getAllArtists } from '../../lib/artists';

export const metadata = {
  title: 'Artists \u2014 Timbre by Like One Studio',
  description: 'Meet the artists of Timbre. One voice, infinite genres. AI-powered music production that takes artists global.',
  alternates: { canonical: `${site.url}/artists/` },
  openGraph: {
    title: 'Artists \u2014 Timbre by Like One Studio',
    description: 'Meet the artists of Timbre. One voice, infinite genres.',
    url: `${site.url}/artists/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artists \u2014 Timbre by Like One Studio',
    description: 'Meet the artists of Timbre. One voice, infinite genres. AI-powered music production that takes artists global.',
    images: [site.ogImage],
  },
};

export default function ArtistsPage() {
  const artists = getAllArtists();

  return (
    <div className="site-page">
      <Header variant="site" />

      <div className="site-section-sm text-center">
        <div className="timbre-badge">TIMBRE ARTISTS</div>
        <h1 className="site-hero-title-sm">
          The voices of <span className="text-gradient-warm">Timbre.</span>
        </h1>
        <p className="site-hero-desc-sm">
          Every artist on Timbre gets free AI-powered production, global distribution, and a dedicated artist page. No label deal required. Your voice, your royalties, your career.
        </p>
      </div>

      <section className="site-section-sm">
        <div className="site-container-narrow">
          {artists.length > 0 ? (
            <div className="artists-grid">
              {artists.map(a => (
                <Link key={a.slug} href={`/artists/${a.slug}/`} className="artist-card-large">
                  <div className="artist-card-avatar">
                    {a.image ? <img src={a.image} alt={a.name} /> : <span className="artist-card-initial">{a.name[0]}</span>}
                  </div>
                  <div className="artist-card-body">
                    <h2 className="artist-card-name">{a.name}</h2>
                    <p className="artist-card-tagline">{a.tagline}</p>
                    <p className="artist-card-origin">{a.origin}</p>
                    <div className="artist-card-genres">
                      {a.genres.map(g => (
                        <span key={g} className="timbre-genre-tag">{g}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="site-story-text text-center">Artists coming soon.</p>
          )}
        </div>
      </section>

      <div className="site-section-sm text-center bg-raised">
        <h2 className="site-section-title-md">Want to join Timbre?</h2>
        <p className="about-cta-desc">We&rsquo;re looking for artists who want their music heard everywhere. Free production, free distribution, you keep 100% of royalties.</p>
        <div className="site-cta-row">
          <a href="mailto:hello@likeone.ai?subject=Timbre%20Artist%20Inquiry" className="site-btn-primary">Apply Now</a>
          <Link href="/timbre/" className="site-btn-secondary">Learn About Timbre</Link>
        </div>
      </div>

      <Footer variant="site" />
    </div>
  );
}
