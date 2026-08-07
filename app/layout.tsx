import type { Metadata } from 'next';
import './globals.css';
import AnimeNavbar from '@/components/layout/AnimeNavbar';
import AnimeFooter from '@/components/layout/AnimeFooter';
import { AuthProvider } from '@/contexts/AuthContext';
import UpdateNotifier from '@/components/ui/UpdateNotifier';
import NavigationLoader from '@/components/ui/NavigationLoader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: { default: 'AniStreamBD — Watch Anime & Movies Free Online', template: '%s | AniStreamBD' },
  description: 'Watch your favorite anime, Hollywood & Bollywood movies free online in HD on AniStreamBD.',
  keywords: ['anime', 'watch anime', 'free anime', 'movies', 'streaming', 'AniStreamBD'],
  icons: {
    icon: [
      { url: '/logo_img.png?v=5', type: 'image/png' },
      { url: '/icon.png?v=5', type: 'image/png' },
    ],
    shortcut: '/logo_img.png?v=5',
    apple: '/logo_img.png?v=5',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AniStreamBD',
  },
};

export const viewport = {
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect & DNS prefetch for streaming servers to boost video loading speed */}
        <link rel="preconnect" href="https://vidlink.pro" />
        <link rel="dns-prefetch" href="https://vidlink.pro" />
        <link rel="preconnect" href="https://vidsrc.to" />
        <link rel="dns-prefetch" href="https://vidsrc.to" />
        <link rel="preconnect" href="https://embed.su" />
        <link rel="dns-prefetch" href="https://embed.su" />
        <link rel="preconnect" href="https://player.videasy.net" />
        <link rel="dns-prefetch" href="https://player.videasy.net" />
        <link rel="preconnect" href="https://autoembed.co" />
        <link rel="dns-prefetch" href="https://autoembed.co" />
        <link rel="preconnect" href="https://vidsrc.cc" />
        <link rel="dns-prefetch" href="https://vidsrc.cc" />
        <link rel="preconnect" href="https://multiembed.mov" />
        <link rel="dns-prefetch" href="https://multiembed.mov" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body className="bg-[#0a0a0f] text-white antialiased font-sans min-h-screen">
        <AuthProvider>
          <Suspense fallback={null}>
            <NavigationLoader />
          </Suspense>
          <AnimeNavbar />
          <main>{children}</main>
          <AnimeFooter />
          <UpdateNotifier />
        </AuthProvider>
      </body>
    </html>
  );
}
