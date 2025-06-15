import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // making images from sanity cdn appear loadable in next
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
