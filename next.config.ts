import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "howtobecomealibrarian.com",
      },
      {
        protocol: "https",
        hostname: "as2.ftcdn.net",
      },
    ],
  },
};

export default nextConfig;
