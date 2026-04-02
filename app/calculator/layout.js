import { site } from '../../lib/site-config';

export const metadata = {
  title: 'AI ROI Calculator — Measure Your AI Savings | Like One',
  description: 'Calculate the return on investment for AI adoption in your business. See projected savings, efficiency gains, and payback period.',
  alternates: { canonical: `${site.url}/calculator/` },
  openGraph: {
    title: 'AI ROI Calculator — Measure Your AI Savings | Like One',
    description: 'Calculate the ROI for AI adoption in your business.',
    url: `${site.url}/calculator/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI ROI Calculator — Measure Your AI Savings | Like One',
    description: 'Calculate the ROI for AI adoption in your business. See projected savings and payback period.',
    images: [site.ogImage],
  },
};

export default function CalculatorLayout({ children }) {
  return children;
}
