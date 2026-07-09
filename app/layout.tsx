import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import AnimeNavbar from '@/components/layout/AnimeNavbar';
import AnimeFooter from '@/components/layout/AnimeFooter';
import { AuthProvider } from '@/contexts/AuthContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: { default: 'AniStream — Watch Anime Free Online', template: '%s | AniStream' },
  description: 'Watch your favorite anime free online in HD. Trending, popular, seasonal — all in one place.',
  keywords: ['anime', 'watch anime', 'free anime', 'anime streaming', 'anime online'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AniStream',
  },
};

export const viewport = {
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
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
