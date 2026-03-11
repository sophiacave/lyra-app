/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable PWA-like behavior
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
