import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Support & Help Center — Like One AI Academy',
  description: 'Get help with Like One. Contact us, make a donation, or find answers to common questions.',
  alternates: { canonical: `${site.url}/support/` },
  openGraph: {
    title: 'Support & Help Center — Like One AI Academy',
    description: 'Get help with Like One. Contact us, make a donation, or find answers.',
    url: `${site.url}/support/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support & Help Center — Like One AI Academy',
    description: 'Get help with Like One. Contact us, make a donation, or find answers.',
    images: [site.ogImage],
  },
};

export default function SupportLayout({ children }) {
  return children;
}
