import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 604800, // 7 days in seconds
  },
  async headers() {
    return [
      {
        source: '/(.*).(png|jpg|jpeg|svg|webp|ico|json)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
