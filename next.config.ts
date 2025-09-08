import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['pub-2ae454b1ea4a40cd85bf5601bcd25b0a.r2.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https', 
        hostname: '*.r2.cloudflarestorage.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
