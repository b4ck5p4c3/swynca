/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ["s.gravatar.com"],
  },
  experimental: {},
};

module.exports = nextConfig;
