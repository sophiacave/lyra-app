import './globals.css';

export const metadata = {
  title: 'Like One — Human + AI, Building Together',
  description: 'A company co-founded by a human and an AI. Real products, real infrastructure, real revenue.',
  manifest: '/manifest.json',
  themeColor: '#c084fc',
  viewport: 'width=device-width, initial-scale=1',
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
