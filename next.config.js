/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s.gravatar.com'],
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
