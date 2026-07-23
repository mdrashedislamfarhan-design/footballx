'use client';

import { useState, useMemo } from 'react';
import { Movie } from '@/services/movies/tmdb';
import MovieCard from './MovieCard';
import MovieRow from './MovieRow';
import { Search, Film, Sparkles, Filter, Grid, Layers, X, Tv, Star, Flame, Zap, Tv2, Crown } from 'lucide-react';

interface MoviesExplorerProps {
  netflixSeries: Movie[];
  hboSeries: Movie[];
  amazonSeries: Movie[];
  disneySeries: Movie[];
  zee5Series: Movie[];
  latest2026Movies: Movie[];
  nowPlayingMovies: Movie[];
  southHindiMovies: Movie[];
  animeFeatureMovies: Movie[];
  initialHollywoodMovies: Movie[];
  initialBollywoodMovies: Movie[];
  topRatedMovies: Movie[];
}

const GENRES = [
  { id: 'all', name: '✨ All Genres' },
  { id: 'Action', name: '🔥 Action' },
  { id: 'Science Fiction', name: '🚀 Sci-Fi' },
  { id: 'Horror', name: '👻 Horror' },
  { id: 'Comedy', name: '😂 Comedy' },
  { id: 'Romance', name: '❤️ Romance' },
  { id: 'Animation', name: '🎨 Anime & Animation' },
  { id: 'Thriller', name: '⚡ Thriller' },
  { id: 'Crime', name: '🕵️ Crime' },
  { id: 'Drama', name: '🎭 Drama' },
];

const CATEGORIES = [
  { id: 'all', name: '🎬 All Movies & Web Series', icon: Film },
  { id: 'netflix', name: '🔴 Netflix', icon: Tv },
  { id: 'hbo', name: '👑 HBO & Max', icon: Crown },
  { id: 'amazon', name: '📦 Amazon Prime', icon: Tv2 },
  { id: 'disney', name: '🏰 Disney+ Hotstar', icon: Tv },
  { id: 'zee5', name: '🌟 ZEE5 & SonyLIV', icon: Flame },
  { id: 'south_dubbed', name: '🔥 South Indian Dubbed', icon: Flame },
  { id: 'latest_2026', name: '⚡ 2026 Latest Releases', icon: Zap },
  { id: 'top_rated', name: '⭐ IMDb Top Rated', icon: Star },
];

export default function MoviesExplorer({
  netflixSeries,
  hboSeries,
  amazonSeries,
  disneySeries,
  zee5Series,
  latest2026Movies,
  nowPlayingMovies,
  southHindiMovies,
  animeFeatureMovies,
  initialHollywoodMovies,
  initialBollywoodMovies,
  topRatedMovies,
}: MoviesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'rows'>('rows');

  // Combine all movies into a single pool for search and grid view
  const allMoviesPool = useMemo(() => {
    const map = new Map<string, Movie>();
    [
      ...netflixSeries,
      ...hboSeries,
      ...amazonSeries,
      ...disneySeries,
      ...zee5Series,
      ...latest2026Movies,
      ...nowPlayingMovies,
      ...southHindiMovies,
      ...animeFeatureMovies,
      ...initialHollywoodMovies,
      ...initialBollywoodMovies,
      ...topRatedMovies,
    ].forEach((m) => {
      if (m && m.id && !map.has(m.id)) {
        map.set(m.id, m);
      }
    });
    return Array.from(map.values());
  }, [
    netflixSeries,
    hboSeries,
    amazonSeries,
    disneySeries,
    zee5Series,
    latest2026Movies,
    nowPlayingMovies,
    southHindiMovies,
    animeFeatureMovies,
    initialHollywoodMovies,
    initialBollywoodMovies,
    topRatedMovies,
  ]);

  // Filtered pool for grid mode or search mode
  const filteredMovies = useMemo(() => {
    return allMoviesPool.filter((movie) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesDesc = movie.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category Filter
      if (selectedCategory === 'netflix') {
        if (!netflixSeries.some(s => s.id === movie.id)) return false;
      } else if (selectedCategory === 'hbo') {
        if (!hboSeries.some(s => s.id === movie.id)) return false;
      } else if (selectedCategory === 'amazon') {
        if (!amazonSeries.some(s => s.id === movie.id)) return false;
      } else if (selectedCategory === 'disney') {
        if (!disneySeries.some(s => s.id === movie.id)) return false;
      } else if (selectedCategory === 'zee5') {
        if (!zee5Series.some(s => s.id === movie.id)) return false;
      } else if (selectedCategory === 'latest_2026') {
        if (movie.year < 2025) return false;
      } else if (selectedCategory === 'south_dubbed') {
        if (movie.type !== 'bollywood') return false;
      } else if (selectedCategory === 'top_rated') {
        if (movie.rating < 7.5) return false;
      }

      // 3. Genre Filter
      if (selectedGenre !== 'all') {
        const hasGenre = movie.genres?.some(
          (g) => g.toLowerCase().includes(selectedGenre.toLowerCase())
        );
        if (!hasGenre) return false;
      }

      return true;
    });
  }, [
    allMoviesPool,
    searchQuery,
    selectedCategory,
    selectedGenre,
    netflixSeries,
    hboSeries,
    amazonSeries,
    disneySeries,
    zee5Series,
  ]);

  const isFiltering = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedGenre !== 'all';

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls Bar ──────────────────────────────────────── */}
      <div className="bg-[#111118]/90 backdrop-blur-xl border border-white/[0.08] rounded-[26px] p-4 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-5">
        
        {/* Top Row: Search Input + View Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5CF6]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Stranger Things, Mirzapur, Game of Thrones, Pushpa 2, Marvel..."
              className="w-full bg-[#0a0a0f] border border-white/[0.08] focus:border-[#8B5CF6] text-white text-sm rounded-2xl pl-11 pr-10 py-3.5 outline-none transition-all placeholder:text-[#555] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-[#aaa] hover:text-white flex items-center justify-center text-xs transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center gap-2 bg-[#0a0a0f] p-1.5 rounded-2xl border border-white/[0.08] self-start md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('rows')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'rows' && !isFiltering
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              OTT Rows
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid' || isFiltering
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              All Grid ({filteredMovies.length})
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'bg-[#0a0a0f] border-white/[0.06] text-[#777] hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#A78BFA]' : 'text-[#555]'}`} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Genre Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 custom-scrollbar">
          <span className="text-[11px] font-black text-[#555] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#8B5CF6]" /> Genre:
          </span>
          {GENRES.map((g) => {
            const active = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-[#EC4899]/20 border-[#EC4899] text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                    : 'bg-[#0a0a0f]/60 border-white/[0.04] text-[#666] hover:text-white hover:border-white/20'
                }`}
              >
                {g.name}
              </button>
            );
          })}

          {/* Reset button if filter active */}
          {isFiltering && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedGenre('all');
              }}
              className="ml-auto text-xs text-[#FF5252] hover:underline font-bold shrink-0 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Active Filter Heading Banner ──────────────────────────────────────── */}
      {isFiltering && (
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            Search & Filter Results ({filteredMovies.length} found)
          </h2>
          <span className="text-xs text-[#666]">
            Showing results for {searchQuery ? `"${searchQuery}"` : selectedGenre !== 'all' ? selectedGenre : selectedCategory}
          </span>
        </div>
      )}

      {/* ── Content View: Grid or Categorized Rows ───────────────────────────── */}
      {viewMode === 'grid' || isFiltering ? (
        /* GRID VIEW */
        filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-[#111118] border border-white/[0.06] rounded-[24px]">
            <Film className="w-12 h-12 text-[#444] mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">No Titles Found</h3>
            <p className="text-xs text-[#666] max-w-sm mx-auto mb-6">
              We couldn't find any web series or movies matching "{searchQuery || selectedGenre}". Try resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedGenre('all');
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )
      ) : (
        /* CATEGORIZED ROWS VIEW — Movies FIRST, then Web Series */
        <div className="space-y-14">

          {/* ──── 🎬 MOVIES SECTION ──────────────────────────────────────────── */}
          <div className="space-y-14">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#EC4899]" />
              <h2 className="text-lg font-black text-white tracking-tight">🎬 Movies</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {latest2026Movies.length > 0 && (
              <MovieRow title="⚡ 2026/2025 Latest Cinema Releases" movies={latest2026Movies} />
            )}
            {southHindiMovies.length > 0 && (
              <MovieRow title="🔥 South Indian Blockbusters (Hindi Dubbed)" movies={southHindiMovies} />
            )}
            {initialHollywoodMovies.length > 0 && (
              <MovieRow title="🚀 Trending Hollywood Blockbusters" movies={initialHollywoodMovies} />
            )}
            {initialBollywoodMovies.length > 0 && (
              <MovieRow title="🎬 Blockbuster Bollywood Movies" movies={initialBollywoodMovies} />
            )}
            {animeFeatureMovies.length > 0 && (
              <MovieRow title="🎨 Anime & Animated Feature Movies" movies={animeFeatureMovies} />
            )}
            {topRatedMovies.length > 0 && (
              <MovieRow title="⭐ IMDb Top 250 Masterpieces" movies={topRatedMovies} />
            )}
          </div>

          {/* ──── 📺 WEB SERIES SECTION ──────────────────────────────────────── */}
          <div className="space-y-14">
            <div className="flex items-center gap-3 px-1 pt-4">
              <div className="w-1 h-7 rounded-full bg-gradient-to-b from-[#EC4899] to-[#8B5CF6]" />
              <h2 className="text-lg font-black text-white tracking-tight">📺 OTT Web Series</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {netflixSeries.length > 0 && (
              <MovieRow title="🔴 Netflix Originals & Top Hits" movies={netflixSeries} />
            )}
            {hboSeries.length > 0 && (
              <MovieRow title="👑 HBO & Max Original Series" movies={hboSeries} />
            )}
            {amazonSeries.length > 0 && (
              <MovieRow title="📦 Amazon Prime Video Originals" movies={amazonSeries} />
            )}
            {disneySeries.length > 0 && (
              <MovieRow title="🏰 Disney+ Hotstar Originals" movies={disneySeries} />
            )}
            {zee5Series.length > 0 && (
              <MovieRow title="🌟 ZEE5 & SonyLIV Indian Series" movies={zee5Series} />
            )}
          </div>

        </div>
      )}
    </div>
  );
}
