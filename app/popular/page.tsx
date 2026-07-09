import { fetchPopular } from '@/services/anime/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import { Star } from 'lucide-react';

export const revalidate = 3600; // 1 hour

export default async function PopularPage() {
  const popular = await fetchPopular(1, 48);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#FFC107]/10 border border-[#FFC107]/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-[#FFC107] fill-[#FFC107]/20" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Popular All Time</h1>
            <p className="text-[#999] text-sm mt-1">The most popular anime of all time on AniList.</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {popular.map((anime, i) => (
            <AnimeCard key={anime.id} anime={anime} rank={i + 1} />
          ))}
        </div>

      </div>
    </div>
  );
}
