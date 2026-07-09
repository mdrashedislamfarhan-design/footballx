import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming, getTitle } from '@/services/anime/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import HeroCarousel from '@/components/anime/HeroCarousel';
import Link from 'next/link';
import { Flame, Star, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

export const revalidate = 300; // revalidate every 5 minutes

function SectionHeader({ title, icon: Icon, href }: { title: string; icon: any; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#8B5CF6]" />
        <h2 className="text-xl md:text-2xl font-extrabold text-white">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
        See All <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [trending, popular, topRated] = await Promise.all([
    fetchTrending(1, 13),
    fetchPopular(1, 12),
    fetchTopRated(1, 12),
  ]);

  // Use the top 5 trending anime for the hero carousel slideshow
  const heroAnimes = trending.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Carousel Slideshow */}
      {heroAnimes.length > 0 && <HeroCarousel animes={heroAnimes} />}

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pb-20">

        {/* ── Trending Now ─────────────────────────────────────────────── */}
        <section className="mt-16">
          <SectionHeader title="Trending Now" icon={Flame} href="/trending" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.slice(1, 13).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* ── Popular All Time ──────────────────────────────────────────── */}
        <section className="mt-16">
          <SectionHeader title="Popular All Time" icon={Star} href="/popular" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popular.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* ── Top Rated ────────────────────────────────────────────────── */}
        <section className="mt-16">
          <SectionHeader title="Top Rated" icon={TrendingUp} href="/browse?sort=SCORE_DESC" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRated.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>

        {/* ── Genre Quick Access ────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-xl font-extrabold text-white">Browse by Genre</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: 'Action', emoji: '⚔️', color: '#EF4444' },
              { name: 'Romance', emoji: '💕', color: '#EC4899' },
              { name: 'Comedy', emoji: '😄', color: '#F59E0B' },
              { name: 'Fantasy', emoji: '🧙', color: '#8B5CF6' },
              { name: 'Horror', emoji: '👻', color: '#374151' },
              { name: 'Sci-Fi', emoji: '🚀', color: '#3B82F6' },
              { name: 'Thriller', emoji: '🔥', color: '#F97316' },
              { name: 'Slice of Life', emoji: '🌸', color: '#10B981' },
            ].map(({ name, emoji, color }) => (
              <Link
                key={name}
                href={`/browse?genre=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center justify-center gap-2 p-4 rounded-[18px] border border-white/[0.06] bg-[#111118] hover:border-[#8B5CF6]/40 hover:bg-[#111118] transition-all hover:-translate-y-1 text-center"
                style={{ '--hover-color': color } as any}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs font-bold text-[#B3B3B3] group-hover:text-white transition-colors">{name}</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
