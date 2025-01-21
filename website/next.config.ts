import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fillmurray.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.lu.ma',
      },
      {
        protocol: 'https',
        hostname: 'images.lumacdn.com',
      },
    ],
  },
};

export default nextConfig;
