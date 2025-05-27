import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // Habilita que el build ignore errores de ESLint
  eslint: {
    ignoreDuringBuilds: true,
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
