import {
  fetchMovies,
  fetchNowPlaying,
  fetchTopRatedMovies,
  fetchNewReleases,
  fetchHollywoodMovies,
  fetchHollywoodSeries,
  fetchBollywoodMovies,
  fetchBollywoodSeries,
} from '@/services/movies/tmdb';
import MovieHeroCarousel from '@/components/movies/MovieHeroCarousel';
import MovieRow from '@/components/movies/MovieRow';
import { Film } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies & Series — AniStreamBD',
  description: 'Stream your favorite Hollywood and Bollywood movies & web series in HD on AniStreamBD.',
};

export const revalidate = 3600; // Cache 1 hour

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: 'hollywood' | 'bollywood'; section?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentTab = resolvedSearchParams.type || 'hollywood';

  let heroMovies: any[] = [];
  let rowSections: { title: string; movies: any[] }[] = [];

  const apiKeySet = !!(process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN);

  if (apiKeySet) {
    if (currentTab === 'bollywood') {
      const [newReleases, popularMovies, popularSeries] = await Promise.all([
        fetchNewReleases('bollywood'),
        fetchBollywoodMovies(),
        fetchBollywoodSeries(),
      ]);

      heroMovies = newReleases.slice(0, 5);

      rowSections = [
        { title: '🔥 New Releases (Indian)', movies: newReleases },
        { title: '📺 Popular Indian Web Series', movies: popularSeries },
        { title: '🎬 Blockbuster Bollywood Movies', movies: popularMovies },
      ];
    } else {
      const [newReleases, nowPlaying, popularMovies, popularSeries, topRated] = await Promise.all([
        fetchNewReleases('hollywood'),
        fetchNowPlaying(),
        fetchHollywoodMovies(),
        fetchHollywoodSeries(),
        fetchTopRatedMovies(),
      ]);

      heroMovies = newReleases.slice(0, 5);

      rowSections = [
        { title: '🍿 Now Playing in Cinemas', movies: nowPlaying },
        { title: '📺 Popular Hollywood Web Series', movies: popularSeries },
        { title: '🎬 Trending Hollywood Movies', movies: popularMovies },
        { title: '⭐ Top Rated Movies', movies: topRated },
      ];
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24">
      {/* Hero Banner Carousel (Netflix-style marquee) */}
      {heroMovies.length > 0 && <MovieHeroCarousel movies={heroMovies} />}

      {/* Main Content Area */}
      <div className="mt-10 space-y-12">
        {/* Tab Header & Selector */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-[#8B5CF6]" />
              {currentTab === 'hollywood' ? 'Hollywood Movies & Series' : 'Indian Movies & Series'}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-[#111118] p-1.5 rounded-2xl border border-white/[0.04] self-start sm:self-auto">
            {[
              { id: 'hollywood', name: '🎥 Hollywood' },
              { id: 'bollywood', name: '🌟 Bollywood' },
            ].map((tab) => (
              <Link
                key={tab.id}
                href={`/movies?type=${tab.id}`}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                  currentTab === tab.id
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'text-[#999] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Warning if no key */}
        {!apiKeySet && (
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="p-5 rounded-[20px] bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FCD34D] text-sm font-semibold">
              <p className="font-black mb-1">⚠️ TMDB API Key Missing</p>
              <p className="text-xs text-[#F59E0B]/80 leading-relaxed">
                Movie data requires a free TMDB API key. Add <code className="bg-black/30 px-1 py-0.5 rounded text-white">TMDB_API_KEY=your_key</code> to your <code className="bg-black/30 px-1 py-0.5 rounded text-white">.env.local</code> file.
                Get your free key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener" className="underline text-[#FCD34D]">themoviedb.org</a>.
              </p>
            </div>
          </div>
        )}

        {/* Netflix-style Slider Rows */}
        {apiKeySet && rowSections.map((sec) => (
          <MovieRow key={sec.title} title={sec.title} movies={sec.movies} />
        ))}
      </div>
    </div>
  );
}
