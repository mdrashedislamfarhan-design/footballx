import type { Metadata } from 'next';
import './globals.css';
import AnimeNavbar from '@/components/layout/AnimeNavbar';
import AnimeFooter from '@/components/layout/AnimeFooter';
import { AuthProvider } from '@/contexts/AuthContext';
import UpdateNotifier from '@/components/ui/UpdateNotifier';

export const metadata: Metadata = {
  title: { default: 'Okazaki — Watch Anime & Movies Free Online', template: '%s | Okazaki' },
  description: 'Watch your favorite anime, Hollywood & Bollywood movies free online in HD on Okazaki.',
  keywords: ['anime', 'watch anime', 'free anime', 'movies', 'streaming', 'Okazaki'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Okazaki',
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
          <UpdateNotifier />
        </AuthProvider>
      </body>
    </html>
  );
}
