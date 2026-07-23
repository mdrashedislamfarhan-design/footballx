import { fetchTrending, fetchPopular, fetchTopRated } from '@/services/anime/anilist';
import { fetchMovies } from '@/services/movies/tmdb';
import AnimeCard from '@/components/anime/AnimeCard';
import MovieCard from '@/components/movies/MovieCard';
import HeroCarousel from '@/components/anime/HeroCarousel';
import Link from 'next/link';
import { Flame, Star, TrendingUp, ChevronRight, Sparkles, Film, Clapperboard } from 'lucide-react';

import ContinueWatching from '@/components/home/ContinueWatching';

export const revalidate = 300;

function SectionHeader({ title, icon: Icon, href, iconColor = '#8B5CF6' }: { title: string; icon: any; href: string; iconColor?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
        <h2 className="text-xl md:text-2xl font-extrabold text-white">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
        See All <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [trending, popular, topRated, hollywoodMovies, bollywoodMovies] = await Promise.all([
    fetchTrending(1, 13),
    fetchPopular(1, 12),
    fetchTopRated(1, 12),
    fetchMovies('hollywood'),
    fetchMovies('bollywood'),
  ]);

  const heroAnimes = trending.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Carousel Slideshow */}
      {heroAnimes.length > 0 && <HeroCarousel animes={heroAnimes} />}

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pb-20">
        
        {/* ── Continue Watching (Resume Episode) ───────────────────────── */}
        <section className="mt-10">
          <ContinueWatching />
        </section>

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

        {/* ── Hollywood Movies ──────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Film className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">🎥 Hollywood Movies</h2>
            </div>
            <Link href="/movies?type=hollywood" className="flex items-center gap-1 text-sm font-semibold text-[#F59E0B] hover:text-[#FCD34D] transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {hollywoodMovies.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ── Bollywood Movies ──────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#F59E0B] flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                <Clapperboard className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">🌟 Bollywood Movies</h2>
            </div>
            <Link href="/movies?type=bollywood" className="flex items-center gap-1 text-sm font-semibold text-[#EC4899] hover:text-[#F9A8D4] transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bollywoodMovies.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ── Top Rated Anime ────────────────────────────────────────────── */}
        <section className="mt-16">
          <SectionHeader title="Top Rated Anime" icon={TrendingUp} href="/browse?sort=SCORE_DESC" />
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
            ].map(({ name, emoji }) => (
              <Link
                key={name}
                href={`/browse?genre=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center justify-center gap-2 p-4 rounded-[18px] border border-white/[0.06] bg-[#111118] hover:border-[#8B5CF6]/40 transition-all hover:-translate-y-1 text-center"
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
