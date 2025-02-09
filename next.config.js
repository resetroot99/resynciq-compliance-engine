/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/resynciq-compliance-engine',
  trailingSlash: true,
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