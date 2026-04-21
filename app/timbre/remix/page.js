import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { site } from '../../../lib/site-config';

export const metadata = {
  title: 'Timbre \u2014 Coming Soon | Like One Studio',
  description: 'Timbre is an AI-powered music production engine. One voice, infinite genres. Coming soon from Like One Studio.',
  alternates: { canonical: `${site.url}/timbre/` },
  openGraph: {
    title: 'Timbre \u2014 Coming Soon',
    description: 'AI-powered vocal remix engine by Like One Studio. Coming soon.',
    url: `${site.url}/timbre/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timbre \u2014 Coming Soon',
    description: 'AI-powered vocal remix engine by Like One Studio. Coming soon.',
    images: [site.ogImage],
  },
};

const genres = [
  { name: 'EDM', icon: '\u26A1' },
  { name: 'K-Pop', icon: '\uD83C\uDDF0\uD83C\uDDF7' },
  { name: 'J-Pop', icon: '\uD83C\uDDEF\uD83C\uDDF5' },
  { name: 'Traditional Vietnamese', icon: '\uD83C\uDDFB\uD83C\uDDF3' },
  { name: 'Classical', icon: '\uD83C\uDFBB' },
  { name: 'Hip-Hop', icon: '\uD83C\uDFA4' },
  { name: 'Lo-Fi', icon: '\uD83C\uDF19' },
  { name: 'Pop', icon: '\u2728' },
];

export default function TimbrePage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <div className="site-section-sm text-center">
        <div className="timbre-badge">COMING SOON</div>
        <h1 className="timbre-hero-title">
          One voice.<br /><span className="text-gradient-warm">Infinite genres.</span>
        </h1>
        <p className="site-hero-desc-sm">
          Timbre is an AI-powered music production engine. We take an artist&rsquo;s vocal performance and reimagine it across genres, cultures, and audiences &mdash; from EDM to traditional Vietnamese, K-pop to classical. Same soul, new sound.
        </p>
        <div className="site-cta-row">
          <a href="mailto:hello@likeone.ai?subject=Timbre%20Artist%20Inquiry" className="site-btn-primary">Get Notified</a>
        </div>
      </div>

      {/* Genre Preview */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">GENRE ENGINE</span>
          <h2 className="site-section-title-md">Every song becomes eight songs.</h2>
          <p className="site-story-text">One vocal performance. Eight genre-native productions. Each version engineered for its audience &mdash; not a filter, not an effect, a complete reimagination.</p>

          <div className="timbre-coming-soon-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem' }}>
            {genres.map(g => (
              <div key={g.name} className="timbre-coming-tag">
                {g.icon} {g.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Artists */}
      <section className="site-section-sm bg-raised">
        <div className="site-container-narrow">
          <span className="site-section-tag">FOR ARTISTS</span>
          <h2 className="site-section-title-md">We handle everything. You keep creating.</h2>

          <div className="site-card-grid-lg my-8">
            {[
              { icon: '\uD83C\uDFA8', title: 'Free Production', desc: 'AI-powered stem separation, genre remixing, mixing, and mastering \u2014 no cost to you.' },
              { icon: '\uD83D\uDCE1', title: 'Global Distribution', desc: 'Your music on Spotify, Apple Music, YouTube Music, Amazon, and 150+ platforms worldwide.' },
              { icon: '\uD83D\uDCB0', title: 'You Own Your Music', desc: '100% of your royalties. Your voice, your songs, your revenue. We never take a cut.' },
              { icon: '\uD83E\uDD1D', title: 'Partnership, Not a Label', desc: "We\u2019re not signing you. We\u2019re amplifying you. No contracts, no lock-in, no creative control." },
            ].map(c => (
              <div key={c.title} className="site-card">
                <div className="about-emoji-sm">{c.icon}</div>
                <h3 className="site-card-title text-base">{c.title}</h3>
                <p className="site-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="site-section-sm text-center">
        <h2 className="site-section-title-md">Your voice deserves every stage.</h2>
        <p className="about-cta-desc">Timbre is free for artists. No label deal, no contracts, no cuts. Just your music, everywhere.</p>
        <div className="site-cta-row">
          <a href="mailto:hello@likeone.ai?subject=Timbre%20Artist%20Inquiry" className="site-btn-primary">Apply as an Artist</a>
          <Link href="/" className="site-btn-secondary">Back to Like One</Link>
        </div>
      </div>

      <Footer variant="site" />
    </div>
  );
}
