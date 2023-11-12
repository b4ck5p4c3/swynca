/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    // @todo elaborate on this
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
    ],
  },
  experimental: {
    serverActions: {
      // @todo elaborate on this as well
      allowedOrigins: ["swynca.localhost:3000"]
    }
  },
};

module.exports = nextConfig;
