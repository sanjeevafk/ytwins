import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/notes', destination: '/backend/app.rb' },
      { source: '/api/notes/:path*', destination: '/backend/app.rb' },
      { source: '/api/collections', destination: '/backend/app.rb' },
      { source: '/api/collections/:path*', destination: '/backend/app.rb' },
      { source: '/api/reviews/:path*', destination: '/backend/app.rb' },
      { source: '/api/videos', destination: '/backend/app.rb' },
      { source: '/api/videos/:path*', destination: '/backend/app.rb' },
      { source: '/api/me', destination: '/backend/app.rb' },
      { source: '/api/logout', destination: '/backend/app.rb' },
      { source: '/auth/:path*', destination: '/backend/app.rb' },
    ];
  },
};

export default nextConfig;
