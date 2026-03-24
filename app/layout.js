import './globals.css';

export const metadata = {
  title: 'Like One Academy — Your Brain, Extended',
  description: 'Learn to build an AI system that thinks like you, remembers everything, runs while you sleep, and protects your values. From zero to cyborg.',
  manifest: '/manifest.json',
  themeColor: '#c084fc',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Like One Academy — Your Brain, Extended',
    description: 'Learn to build an AI system that thinks like you. From zero to cyborg.',
    url: 'https://likeone.ai',
    siteName: 'Like One',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Like One Academy — Your Brain, Extended',
    description: 'Learn to build an AI system that thinks like you. From zero to cyborg.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Like One'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
