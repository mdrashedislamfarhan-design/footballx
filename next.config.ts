import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        pathname: '/i/teamlogos/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
      },
      {
        protocol: 'https',
        hostname: 'www.thesportsdb.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 'img.anili.st',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
      {
        protocol: 'https',
        hostname: '*.animescheduler.art',
      },
    ],
    // Optimize images for multiple device densities (mobile, tablet, TV)
    deviceSizes: [360, 414, 768, 1024, 1280, 1440, 1920, 2560, 3840],
    imageSizes: [16, 32, 64, 128, 256, 384, 512],
    formats: ['image/avif', 'image/webp'],
  },
  // Smart TV / Large screen performance
  compress: true,
  // Security & cross-device headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Allow embedding in Smart TV browser webviews
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // PWA — allow install on all devices
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Cache static assets for Smart TV (low-bandwidth environments)
          { key: 'Vary', value: 'Accept-Encoding, Accept' },
        ],
      },
      {
        // Long cache for static assets (icons, fonts, images)
        source: '/(.*)\\.(png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
