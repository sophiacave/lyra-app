import './globals.css';

export const metadata = {
  title: 'Like One — Human-AI Collaboration Platform',
  description: 'What happens when human creativity meets AI intelligence? Like One is the platform proving that human-AI collaboration isn\'t the future — it\'s now. Built by Faye Cave.',
  manifest: '/manifest.json',
  themeColor: '#c084fc',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Like One — Human-AI Collaboration Platform',
    description: 'What happens when human creativity meets AI intelligence? Like One is the platform proving that human-AI collaboration isn\'t the future — it\'s now.',
    url: 'https://likeone.ai',
    siteName: 'Like One',
    type: 'website',
    images: [{ url: 'https://likeone.ai/og-image.png', width: 1200, height: 630, alt: 'Like One — Human-AI Collaboration Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Like One — Human-AI Collaboration Platform',
    description: 'What happens when human creativity meets AI intelligence? Like One is the platform proving that human-AI collaboration isn\'t the future — it\'s now.',
    images: ['https://likeone.ai/og-image.png'],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
