import SiteLayout from '../components/SiteLayout';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Privacy Policy — Like One',
  description: "Like One's privacy policy. How we handle your data, what we collect, and your rights.",
  robots: 'noindex',
  alternates: { canonical: `${site.url}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <h1 className="legal-h1">Privacy Policy</h1>
      <p className="legal-updated">Last updated: March 24, 2026</p>

      <h2 className="legal-h2">What We Collect</h2>
      <p className="legal-p">When you use Like One Academy, we collect:</p>
      <ul className="legal-ul">
        <li className="legal-li"><strong>Email address</strong> — when you sign in or subscribe to our newsletter</li>
        <li className="legal-li"><strong>Payment information</strong> — processed securely by Stripe (we never see or store your card number)</li>
        <li className="legal-li"><strong>Course progress</strong> — stored locally in your browser via localStorage</li>
        <li className="legal-li"><strong>Forum posts</strong> — content you voluntarily post in the community forum</li>
      </ul>

      <h2 className="legal-h2">How We Use It</h2>
      <ul className="legal-ul">
        <li className="legal-li">To authenticate your account and manage your subscription</li>
        <li className="legal-li">To send you the magic link sign-in email</li>
        <li className="legal-li">To send newsletter emails you opted into (you can unsubscribe anytime)</li>
        <li className="legal-li">To process payments via Stripe</li>
      </ul>

      <h2 className="legal-h2">Third-Party Services</h2>
      <ul className="legal-ul">
        <li className="legal-li"><strong>Supabase</strong> — authentication and database (hosted in US East)</li>
        <li className="legal-li"><strong>Stripe</strong> — payment processing</li>
        <li className="legal-li"><strong>Resend</strong> — transactional and marketing emails</li>
        <li className="legal-li"><strong>Vercel</strong> — website hosting and analytics</li>
      </ul>

      <h2 className="legal-h2">Cookies</h2>
      <p className="legal-p">We use localStorage for course progress tracking and authentication tokens. We do not use third-party tracking cookies or advertising pixels.</p>

      <h2 className="legal-h2">Your Rights</h2>
      <p className="legal-p">You can:</p>
      <ul className="legal-ul">
        <li className="legal-li">Request a copy of your data by emailing <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a></li>
        <li className="legal-li">Request deletion of your account and all associated data</li>
        <li className="legal-li">Unsubscribe from emails at any time</li>
      </ul>

      <h2 className="legal-h2">Data Retention</h2>
      <p className="legal-p">We retain your data as long as your account is active. If you request deletion, we remove your data within 30 days.</p>

      <h2 className="legal-h2">Contact</h2>
      <p className="legal-p">Questions about privacy? Email <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a></p>
    </SiteLayout>
  );
}
