import { site } from '../../lib/site-config';

export const metadata = {
  title: 'AI Course Pricing | Like One',
  description: 'Free tier available — no credit card needed. Pro from $49/mo. 52 AI courses, 520+ lessons. Cancel anytime.',
  alternates: { canonical: `${site.url}/pricing/` },
  openGraph: {
    title: 'AI Course Pricing | Like One',
    description: 'Free tier or Pro from $49/mo. 52 AI courses, 520+ lessons. Cancel anytime.',
    url: `${site.url}/pricing/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Course Pricing | Like One',
    description: 'Free tier or Pro from $49/mo. 52 courses, 520+ lessons. Cancel anytime.',
    images: [site.ogImage],
  },
};

export default function PricingLayout({ children }) {
  return children;
}
