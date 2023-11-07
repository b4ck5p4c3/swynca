/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    // @todo remove. We'll use our S3 bucket for avatars in future.
    domains: ["s.gravatar.com", "pbs.twimg.com"],
  },
  experimental: {},
};

module.exports = nextConfig;
