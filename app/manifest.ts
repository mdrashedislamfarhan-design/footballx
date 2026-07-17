import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AniStreamBD — Watch Anime Free Online',
    short_name: 'AniStreamBD',
    description: 'Watch your favorite anime, Bollywood & Hollywood movies free online in HD. Sub, Dub & Hindi available.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui', 'browser'],
    orientation: 'any',
    background_color: '#0a0a0f',
    theme_color: '#8B5CF6',
    categories: ['entertainment', 'video', 'streaming'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Trending Anime',
        url: '/trending',
        description: 'View trending anime',
      },
      {
        name: 'Movies',
        url: '/movies',
        description: 'Watch movies',
      },
      {
        name: 'Browse',
        url: '/browse',
        description: 'Browse all content',
      },
    ],
  };
}
