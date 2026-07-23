import type { Metadata } from 'next';
import './globals.css';
import AnimeNavbar from '@/components/layout/AnimeNavbar';
import AnimeFooter from '@/components/layout/AnimeFooter';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: { default: 'AniStreamBD — Watch Anime & Movies Free Online', template: '%s | AniStreamBD' },
  description: 'Watch your favorite anime, Hollywood & Bollywood movies free online in HD.',
  keywords: ['anime', 'watch anime', 'free anime', 'movies', 'streaming', 'AniStreamBD'],
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
      <body className="bg-[#0a0a0f] text-white antialiased font-sans min-h-screen">
        <AuthProvider>
          <AnimeNavbar />
          <main>{children}</main>
          <AnimeFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
