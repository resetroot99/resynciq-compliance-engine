/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/resynciq-compliance-engine' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'raw.githubusercontent.com',
      'www.gravatar.com',
      's.gravatar.com',
      'lh3.googleusercontent.com'
    ]
  },
  // Remove rewrites as they don't work with static export
  assetPrefix: process.env.NODE_ENV === 'production' ? '/resynciq-compliance-engine' : '',
};

module.exports = nextConfig; 