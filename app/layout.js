import './globals.css';
import './console.css';
import Script from 'next/script';
import { site, colors } from '../lib/site-config';
import BetaReporter from './components/BetaReporter';

const fullTitle = `Like One — Free AI Courses | Learn Claude, Automation & Prompt Engineering`;
const shortDesc = '30 free AI courses, 300+ interactive lessons. Learn Claude, prompt engineering, AI automation, and more. Beginner to advanced. Start free today.';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: colors.purple,
};

export const metadata = {
  title: fullTitle,
  description: shortDesc,
  alternates: { canonical: `${site.url}/` },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: fullTitle,
    description: shortDesc,
    url: site.url,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize, alt: fullTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: fullTitle,
    description: shortDesc,
    images: [site.ogImage],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: site.name,
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon-192.png`,
  description: site.description,
  founder: { '@type': 'Person', name: site.founder },
  contactPoint: {
    '@type': 'ContactPoint',
    email: site.email,
    telephone: site.phoneRaw,
    contactType: 'customer support',
  },
  sameAs: [],
};

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${site.url}/academy?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      </head>
      <body>
        {children}
        <BetaReporter />
        <Script src="/auth-state.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
