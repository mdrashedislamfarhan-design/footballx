import { fetchByGenre, fetchTopRated, GENRES } from '@/services/anime/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import { BookOpen, Filter } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 600;

export default async function BrowsePage({ searchParams }: { searchParams: Promise<{ genre?: string; sort?: string }> }) {
  const resolvedParams = await searchParams;
  const genre = resolvedParams.genre;
  const isTopRated = resolvedParams.sort === 'SCORE_DESC';
  
  let animes = [];
  let title = 'Browse Anime';

  if (genre) {
    animes = await fetchByGenre(genre, 1, 48);
    title = `${genre} Anime`;
  } else if (isTopRated) {
    animes = await fetchTopRated(1, 48);
    title = 'Top Rated Anime';
  } else {
    animes = await fetchTopRated(1, 48);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Filters */}
        <div className="w-full md:w-[240px] shrink-0 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white font-bold pb-3 border-b border-white/[0.06]">
              <Filter className="w-4 h-4 text-[#8B5CF6]" />
              Genres
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <Link
                  key={g}
                  href={`/browse?genre=${encodeURIComponent(g)}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    genre === g
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'bg-[#111118] text-[#999] border border-white/[0.06] hover:border-white/[0.15] hover:text-white'
                  }`}
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4 text-white font-bold pb-3 border-b border-white/[0.06]">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              Collections
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/browse?sort=SCORE_DESC" className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${isTopRated && !genre ? 'bg-white/[0.06] text-white' : 'text-[#999] hover:text-white hover:bg-white/[0.03]'}`}>Top Rated</Link>
              <Link href="/trending" className="px-3 py-2 text-sm font-semibold rounded-lg text-[#999] hover:text-white hover:bg-white/[0.03] transition-colors">Trending Now</Link>
              <Link href="/popular" className="px-3 py-2 text-sm font-semibold rounded-lg text-[#999] hover:text-white hover:bg-white/[0.03] transition-colors">Popular All Time</Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white mb-6">{title}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {animes.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
