import './globals.css';
import './console.css';
import Script from 'next/script';
import { site, colors } from '../lib/site-config';
import BetaReporter from './components/BetaReporter';

const fullTitle = `${site.name} \u2014 ${site.tagline}`;
const shortDesc = "What happens when human creativity meets AI intelligence? Like One is the platform proving that human-AI collaboration isn't the future \u2014 it's now.";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: colors.purple,
};

export const metadata = {
  title: fullTitle,
  description: site.description,
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
      </head>
      <body>
        {children}
        <BetaReporter />
        <Script src="/auth-state.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
