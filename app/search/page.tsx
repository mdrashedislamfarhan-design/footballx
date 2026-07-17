import { searchAnime } from '@/services/anime/anilist';
import { searchMovies } from '@/services/movies/tmdb';
import AnimeCard from '@/components/anime/AnimeCard';
import MovieCard from '@/components/movies/MovieCard';
import { Search, Frown, Tv2, Film } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : 'Search' };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  let animeResults: any[] = [];
  let movieResults: any[] = [];

  if (query.trim().length > 0) {
    // Run anime and movie searches in parallel
    [animeResults, movieResults] = await Promise.all([
      searchAnime(query, 1, 24),
      searchMovies(query),
    ]);
  }

  const totalResults = animeResults.length + movieResults.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {query ? <>Results for <span className="text-[#A78BFA]">&ldquo;{query}&rdquo;</span></> : 'Search'}
            </h1>
          </div>
          {query && (
            <p className="text-[#666] text-sm mt-1 ml-[52px]">
              Found <span className="text-white font-bold">{animeResults.length}</span> anime and{' '}
              <span className="text-white font-bold">{movieResults.length}</span> movies
            </p>
          )}
        </div>

        {!query ? (
          /* Empty State — No Query */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#111118] border border-white/[0.06] flex items-center justify-center mb-6">
              <Search className="w-9 h-9 text-[#333]" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Search for Anime or Movies</h2>
            <p className="text-[#555] text-sm max-w-sm">
              Type a title in the search bar above to find your favorite anime or Hollywood/Bollywood movies.
            </p>
          </div>
        ) : totalResults === 0 ? (
          /* No Results */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#111118] border border-white/[0.06] flex items-center justify-center mb-6">
              <Frown className="w-9 h-9 text-[#333]" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">No Results Found</h2>
            <p className="text-[#555] text-sm max-w-sm">
              We couldn&apos;t find any anime or movies matching &ldquo;{query}&rdquo;. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="space-y-14">

            {/* ── Anime Results ────────────────────────────────────────────── */}
            {animeResults.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 flex items-center justify-center">
                    <Tv2 className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-lg font-black text-white">
                    Anime <span className="text-[#555] font-semibold text-sm ml-1">({animeResults.length} found)</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
                  {animeResults.map(anime => (
                    <AnimeCard key={anime.id} anime={anime} />
                  ))}
                </div>
              </section>
            )}

            {/* Divider */}
            {animeResults.length > 0 && movieResults.length > 0 && (
              <div className="border-t border-white/[0.05]" />
            )}

            {/* ── Movie Results ─────────────────────────────────────────────── */}
            {movieResults.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-[#EC4899]/15 border border-[#EC4899]/25 flex items-center justify-center">
                    <Film className="w-4 h-4 text-[#EC4899]" />
                  </div>
                  <h2 className="text-lg font-black text-white">
                    Movies <span className="text-[#555] font-semibold text-sm ml-1">({movieResults.length} found)</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-5">
                  {movieResults.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
