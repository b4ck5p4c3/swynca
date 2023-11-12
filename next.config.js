/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    // @todo elaborate on this
    remotePatterns: [{
      hostname: '*',
      protocol: 'https',
    }]
  },
  experimental: {},
};

module.exports = nextConfig;
