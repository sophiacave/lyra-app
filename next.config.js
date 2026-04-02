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
  // Rewrite /feed to API route (route handlers don't work with trailingSlash)
  async rewrites() {
    return [
      { source: '/feed', destination: '/api/feed' },
      { source: '/feed/', destination: '/api/feed' },
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

export default nextConfig;
