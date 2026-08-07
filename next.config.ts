import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  typescript: {
    ignoreBuildErrors: true,
  },
  // ── Image Optimization ───────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a.espncdn.com', pathname: '/i/teamlogos/**' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'www.thesportsdb.com' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 's4.anilist.co' },
      { protocol: 'https', hostname: 'img.anili.st' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: '*.animescheduler.art' },
    ],
    deviceSizes: [360, 640, 768, 1024, 1280, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24hr image cache
    dangerouslyAllowSVG: false,
  },
  // ── Performance ─────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  // ── Package import optimization (reduce bundle size) ────────────────────────
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // ── HTTP Headers ────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Vary', value: 'Accept-Encoding, Accept' },
          { key: 'Permissions-Policy', value: 'fullscreen=*, autoplay=*' },
        ],
      },
      {
        source: '/:all*(png|jpg|jpeg|gif|svg|ico|woff2|woff|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
