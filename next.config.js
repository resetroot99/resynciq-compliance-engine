/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/resynciq-compliance-engine',
  assetPrefix: '/resynciq-compliance-engine/',
  images: {
    unoptimized: true,
    domains: [
      'raw.githubusercontent.com',
      'www.gravatar.com',
      's.gravatar.com',
      'lh3.googleusercontent.com'
    ]
  }
};

module.exports = nextConfig; 