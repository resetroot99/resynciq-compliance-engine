/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/resynciq-compliance-engine' : '',
  trailingSlash: true,
  caseSensitive: true,
  images: {
    unoptimized: true,
    domains: [
      'raw.githubusercontent.com',
      'www.gravatar.com',
      's.gravatar.com',
      'lh3.googleusercontent.com'  // For Google OAuth profile pictures
    ]
  },
  // Add custom 404 page handling
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/404',
      },
    ];
  },
};

module.exports = nextConfig; 