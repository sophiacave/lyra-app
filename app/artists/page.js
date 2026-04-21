import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Artists \u2014 Coming Soon | Like One Studio',
  description: 'Timbre artists coming soon. AI-powered music production that takes artists global.',
  alternates: { canonical: `${site.url}/artists/` },
  openGraph: {
    title: 'Artists \u2014 Coming Soon',
    description: 'Timbre artists coming soon. AI-powered music production by Like One Studio.',
    url: `${site.url}/artists/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artists \u2014 Coming Soon',
    description: 'Timbre artists coming soon. AI-powered music production by Like One Studio.',
    images: [site.ogImage],
  },
};

export default function ArtistsPage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      <div className="site-section-sm text-center">
        <div className="timbre-badge">COMING SOON</div>
        <h1 className="site-hero-title-sm">
          The voices of <span className="text-gradient-warm">Timbre.</span>
        </h1>
        <p className="site-hero-desc-sm">
          Every artist on Timbre gets free AI-powered production, global distribution, and a dedicated artist page. No label deal required. Your voice, your royalties, your career.
        </p>
      </div>

      <section className="site-section-sm">
        <div className="site-container-narrow">
          <p className="site-story-text text-center">Artists coming soon.</p>
        </div>
      </section>

      <div className="site-section-sm text-center bg-raised">
        <h2 className="site-section-title-md">Want to join Timbre?</h2>
        <p className="about-cta-desc">We&rsquo;re looking for artists who want their music heard everywhere. Free production, free distribution, you keep 100% of royalties.</p>
        <div className="site-cta-row">
          <a href="mailto:hello@likeone.ai?subject=Timbre%20Artist%20Inquiry" className="site-btn-primary">Apply Now</a>
          <Link href="/" className="site-btn-secondary">Back to Like One</Link>
        </div>
      </div>

      <Footer variant="site" />
    </div>
  );
}
