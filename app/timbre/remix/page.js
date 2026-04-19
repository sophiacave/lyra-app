import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { site } from '../../../lib/site-config';
import { getAllArtists } from '../../../lib/artists';

export const metadata = {
  title: 'Timbre Remix \u2014 One Voice, Infinite Genres | Like One Studio',
  description: 'Timbre Remix is an AI-powered music production engine that takes an artist\u2019s vocal performance and reimagines it across EDM, K-pop, J-pop, classical, traditional Vietnamese, and more.',
  alternates: { canonical: `${site.url}/timbre/remix/` },
  openGraph: {
    title: 'Timbre Remix \u2014 One Voice, Infinite Genres',
    description: 'AI-powered vocal remix engine by Like One Studio. Original vocals, new genres.',
    url: `${site.url}/timbre/remix/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timbre Remix \u2014 One Voice, Infinite Genres',
    description: 'AI-powered vocal remix engine by Like One Studio.',
    images: [site.ogImage],
  },
};

const genres = [
  { name: 'EDM', icon: '\u26A1', desc: 'Festival-ready drops. 128\u2013140 BPM. Sidechain compression and supersaws.' },
  { name: 'K-Pop', icon: '\uD83C\uDDF0\uD83C\uDDF7', desc: 'Synth-heavy production, trap hi-hats, dramatic breakdowns, key-change final chorus.' },
  { name: 'J-Pop', icon: '\uD83C\uDDEF\uD83C\uDDF5', desc: 'Jazz-influenced chords, guitar prominence, melodic complexity, brighter mix.' },
  { name: 'Traditional Vietnamese', icon: '\uD83C\uDDFB\uD83C\uDDF3', desc: '\u0110\u00e0n b\u1ea7u, \u0111\u00e0n tranh, s\u00e1o tr\u00fac. Pentatonic scales with microtonal ornamentation preserved.' },
  { name: 'Classical', icon: '\uD83C\uDFBB', desc: 'Orchestral arrangements. Strings, woodwinds, piano. Vocal-forward, cinematic.' },
  { name: 'Hip-Hop', icon: '\uD83C\uDFA4', desc: '808s, trap patterns, half-time feel. Space for vocal ornaments and storytelling.' },
  { name: 'Lo-Fi', icon: '\uD83C\uDF19', desc: 'Vinyl warmth, jazz samples, atmospheric pads. Study and chill.' },
  { name: 'Pop', icon: '\u2728', desc: 'Clean production, hook-driven, radio-ready. The universal language.' },
];

const pipeline = [
  { step: '01', title: 'Stem Separation', desc: 'AI isolates vocals, drums, bass, and instruments from the original track using Demucs.', icon: '\uD83C\uDFA7' },
  { step: '02', title: 'Vocal Processing', desc: 'De-reverb, key detection, and cleanup. The voice is preserved perfectly \u2014 zero cloning.', icon: '\uD83C\uDF99\uFE0F' },
  { step: '03', title: 'Genre Rebuild', desc: 'AI generates new instrumental backing in the target genre, built around the original vocal.', icon: '\uD83C\uDFB9' },
  { step: '04', title: 'Mix & Master', desc: 'Professional mixing and AI-powered mastering. Release-ready quality, every time.', icon: '\uD83D\uDD0A' },
  { step: '05', title: 'Distribute', desc: 'Programmatic distribution to Spotify, Apple Music, YouTube Music, and 150+ platforms.', icon: '\uD83D\uDE80' },
];

export default function TimbrePage() {
  const artists = getAllArtists();

  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <div className="site-section-sm text-center">
        <div className="timbre-badge">LIKE ONE STUDIO</div>
        <h1 className="timbre-hero-title">
          One voice.<br /><span className="text-gradient-warm">Infinite genres.</span>
        </h1>
        <p className="site-hero-desc-sm">
          Timbre is an AI-powered music production engine. We take an artist&rsquo;s vocal performance and reimagine it across genres, cultures, and audiences &mdash; from EDM to traditional Vietnamese, K-pop to classical. Same soul, new sound.
        </p>
        <div className="site-cta-row">
          <Link href="/artists/" className="site-btn-primary">Meet Our Artists</Link>
          <a href="#how-it-works" className="site-btn-secondary">How It Works</a>
        </div>
      </div>

      {/* Genre Grid */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">GENRE ENGINE</span>
          <h2 className="site-section-title-md">Every song becomes eight songs.</h2>
          <p className="site-story-text">One vocal performance. Eight genre-native productions. Each version engineered for its audience &mdash; not a filter, not an effect, a complete reimagination.</p>

          <div className="timbre-genre-grid">
            {genres.map(g => (
              <div key={g.name} className="timbre-genre-card">
                <div className="timbre-genre-icon">{g.icon}</div>
                <h3 className="timbre-genre-name">{g.name}</h3>
                <p className="timbre-genre-desc">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="site-section-sm bg-raised" id="how-it-works">
        <div className="site-container-narrow">
          <span className="site-section-tag">THE PIPELINE</span>
          <h2 className="site-section-title-md">From one track to global catalog.</h2>
          <p className="site-story-text">Five steps. Zero compromise. The original voice is sacred &mdash; we never clone, always preserve.</p>

          <div className="timbre-pipeline">
            {pipeline.map(s => (
              <div key={s.step} className="timbre-pipeline-step">
                <div className="timbre-step-number">{s.step}</div>
                <div className="timbre-step-content">
                  <div className="timbre-step-icon">{s.icon}</div>
                  <h3 className="timbre-step-title">{s.title}</h3>
                  <p className="timbre-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Artists */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">FOR ARTISTS</span>
          <h2 className="site-section-title-md">We handle everything. You keep creating.</h2>

          <div className="site-card-grid-lg my-8">
            {[
              { icon: '\uD83C\uDFA8', title: 'Free Production', desc: 'AI-powered stem separation, genre remixing, mixing, and mastering \u2014 no cost to you.' },
              { icon: '\uD83D\uDCE1', title: 'Global Distribution', desc: 'Your music on Spotify, Apple Music, YouTube Music, Amazon, and 150+ platforms worldwide.' },
              { icon: '\uD83D\uDCC8', title: 'Marketing & SEO', desc: 'Artist website, social media strategy, playlist pitching, and analytics dashboard.' },
              { icon: '\uD83D\uDCB0', title: 'You Own Your Music', desc: '100% of your royalties. Your voice, your songs, your revenue. We never take a cut.' },
              { icon: '\uD83C\uDF0F', title: 'Cross-Cultural Reach', desc: 'Each remix targets a specific audience \u2014 US pop listeners, Vietnamese diaspora, K-pop fans, and more.' },
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

      {/* Artists */}
      {artists.length > 0 && (
        <section className="site-section-sm bg-raised">
          <div className="site-container-narrow">
            <span className="site-section-tag">ARTISTS</span>
            <h2 className="site-section-title-md">The voices of Timbre.</h2>

            <div className="timbre-artists-grid">
              {artists.map(a => (
                <Link key={a.slug} href={`/artists/${a.slug}/`} className="timbre-artist-card">
                  <div className="timbre-artist-avatar">
                    {a.image ? <img src={a.image} alt={a.name} /> : <span className="timbre-artist-initial">{a.name[0]}</span>}
                  </div>
                  <div className="timbre-artist-info">
                    <h3 className="timbre-artist-name">{a.name}</h3>
                    <p className="timbre-artist-tagline">{a.tagline}</p>
                    <div className="timbre-artist-genres">
                      {a.genres.slice(0, 3).map(g => (
                        <span key={g} className="timbre-genre-tag">{g}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">TECHNOLOGY</span>
          <h2 className="site-section-title-md">Built on the bleeding edge.</h2>

          <div className="timbre-tech-grid">
            {[
              { label: 'Stem Engine', value: 'Demucs v4 (Meta AI)' },
              { label: 'Genre AI', value: 'Suno Studio + Udio' },
              { label: 'Mastering', value: 'AI-powered, release-ready' },
              { label: 'Distribution', value: 'LabelGrid REST API' },
              { label: 'Compute', value: 'Apple Silicon (M3 Max 64GB)' },
              { label: 'Voice Policy', value: 'Original only. Zero cloning.' },
            ].map(t => (
              <div key={t.label} className="timbre-tech-item">
                <div className="timbre-tech-label">{t.label}</div>
                <div className="timbre-tech-value">{t.value}</div>
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
          <Link href="/artists/" className="site-btn-primary">Meet Our Artists</Link>
          <a href="mailto:hello@likeone.ai?subject=Timbre%20Artist%20Inquiry" className="site-btn-secondary">Apply as an Artist</a>
        </div>
      </div>

      <Footer variant="site" />
    </div>
  );
}
