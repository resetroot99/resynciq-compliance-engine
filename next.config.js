/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',  // Serve from root
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
  assetPrefix: '',  // Serve assets from root
};

module.exports = nextConfig; 