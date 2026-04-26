import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: output: 'standalone' is removed — it is incompatible with Vercel
  // and must only be used for Docker / self-hosted deployments.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  // NOTE: rewrites() removed — Vercel edge routing (vercel.json routes block)
  // handles /api/* and /auth/* before Next.js ever sees the request.
  // The old destinations ('/backend/app.rb') were file paths, not valid URLs,
  // so they always resolved to 404.
};

export default nextConfig;
