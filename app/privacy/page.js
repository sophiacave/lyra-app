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
      <h1 style={styles.h1}>Privacy Policy</h1>
      <p style={styles.updated}>Last updated: March 24, 2026</p>

      <h2 style={styles.h2}>What We Collect</h2>
      <p style={styles.p}>When you use Like One Academy, we collect:</p>
      <ul style={styles.ul}>
        <li style={styles.li}><strong>Email address</strong> — when you sign in or subscribe to our newsletter</li>
        <li style={styles.li}><strong>Payment information</strong> — processed securely by Stripe (we never see or store your card number)</li>
        <li style={styles.li}><strong>Course progress</strong> — stored locally in your browser via localStorage</li>
        <li style={styles.li}><strong>Forum posts</strong> — content you voluntarily post in the community forum</li>
      </ul>

      <h2 style={styles.h2}>How We Use It</h2>
      <ul style={styles.ul}>
        <li style={styles.li}>To authenticate your account and manage your subscription</li>
        <li style={styles.li}>To send you the magic link sign-in email</li>
        <li style={styles.li}>To send newsletter emails you opted into (you can unsubscribe anytime)</li>
        <li style={styles.li}>To process payments via Stripe</li>
      </ul>

      <h2 style={styles.h2}>Third-Party Services</h2>
      <ul style={styles.ul}>
        <li style={styles.li}><strong>Supabase</strong> — authentication and database (hosted in US East)</li>
        <li style={styles.li}><strong>Stripe</strong> — payment processing</li>
        <li style={styles.li}><strong>Resend</strong> — transactional and marketing emails</li>
        <li style={styles.li}><strong>Vercel</strong> — website hosting and analytics</li>
      </ul>

      <h2 style={styles.h2}>Cookies</h2>
      <p style={styles.p}>We use localStorage for course progress tracking and authentication tokens. We do not use third-party tracking cookies or advertising pixels.</p>

      <h2 style={styles.h2}>Your Rights</h2>
      <p style={styles.p}>You can:</p>
      <ul style={styles.ul}>
        <li style={styles.li}>Request a copy of your data by emailing <a href="mailto:hello@likeone.ai" style={styles.a}>hello@likeone.ai</a></li>
        <li style={styles.li}>Request deletion of your account and all associated data</li>
        <li style={styles.li}>Unsubscribe from emails at any time</li>
      </ul>

      <h2 style={styles.h2}>Data Retention</h2>
      <p style={styles.p}>We retain your data as long as your account is active. If you request deletion, we remove your data within 30 days.</p>

      <h2 style={styles.h2}>Contact</h2>
      <p style={styles.p}>Questions about privacy? Email <a href="mailto:hello@likeone.ai" style={styles.a}>hello@likeone.ai</a></p>
    </SiteLayout>
  );
}

const styles = {
  h1: { fontSize: '32px', fontWeight: 700, color: '#f0f0f0', margin: '40px 0 24px', letterSpacing: '-0.5px' },
  h2: { fontSize: '20px', fontWeight: 600, color: '#e5e5e5', margin: '36px 0 12px' },
  p: { fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' },
  li: { fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' },
  ul: { paddingLeft: '24px', marginBottom: '16px' },
  updated: { fontSize: '14px', color: '#555', marginBottom: '32px' },
  a: { color: '#38bdf8' },
};
