import { searchAnime } from '@/services/anime/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import { Search, Frown } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  let results = [];

  if (query.trim().length > 0) {
    results = await searchAnime(query, 1, 48);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-white/[0.06]">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Search className="w-6 h-6 text-[#8B5CF6]" />
            Search Results for "{query}"
          </h1>
          <p className="text-[#999] text-sm mt-2">Found {results.length} matches</p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
            {results.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Frown className="w-16 h-16 text-[#333] mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
            <p className="text-[#777] text-sm">We couldn't find any anime matching "{query}". Try a different search term.</p>
          </div>
        )}

      </div>
    </div>
  );
}
