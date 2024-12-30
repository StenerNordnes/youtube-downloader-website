import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
        pathname: "/vi",
      },
    ],
  },
};

export default nextConfig;
