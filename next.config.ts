import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: [
    "192.168.50.121",
    "*192.168.50.121",
    "i.scdn.co",
    "*i.scdn.co",
  ],
  images: {
    remotePatterns: [
      new URL("https://i.giphy.com/**"),
      new URL("https://i.scdn.co/image/**"),
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
