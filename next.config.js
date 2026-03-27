/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
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
  },
  // Redirect old static academy HTML URLs to new dynamic routes
  async redirects() {
    return [
      {
        source: '/academy/:courseSlug/:lessonSlug\\.html',
        destination: '/academy/:courseSlug/:lessonSlug/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
