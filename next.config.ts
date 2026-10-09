import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || '',
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        // Ganti hostname ini sesuai URL gambar dari API
        hostname: 'samehadaku.now', 
      },
    ],
  },
};

export default nextConfig;
