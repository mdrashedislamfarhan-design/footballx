import { fetchTrending, AnimeMedia } from '@/services/anime/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import { Flame } from 'lucide-react';

export const revalidate = 300;

export default async function TrendingPage() {
  const trending = await fetchTrending(1, 48); // Fetch more for a full page

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Trending Now</h1>
            <p className="text-[#999] text-sm mt-1">The most talked about and actively watched anime right now.</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {trending.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

      </div>
    </div>
  );
}
