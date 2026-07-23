import {
  fetchNowPlaying,
  fetchTopRatedMovies,
  fetchHollywoodMovies,
  fetchBollywoodMovies,
  fetchLatest2026Movies,
  fetchSouthHindiDubbed,
  fetchAnimeMovies,
  fetchOttWebSeries,
} from '@/services/movies/tmdb';
import MovieHeroCarousel from '@/components/movies/MovieHeroCarousel';
import MoviesExplorer from '@/components/movies/MoviesExplorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies & Web Series — AniStreamBD',
  description: 'Stream Netflix, HBO, Amazon Prime, Disney+, ZEE5 Web Series & Blockbuster Movies on AniStreamBD.',
};

export const revalidate = 3600; // Cache 1 hour

export default async function MoviesPage() {
  let heroMovies: any[] = [];
  let netflix: any[] = [];
  let hbo: any[] = [];
  let amazon: any[] = [];
  let disney: any[] = [];
  let zee5: any[] = [];
  let latest2026: any[] = [];
  let southHindi: any[] = [];
  let animeFeatures: any[] = [];
  let hollywoodMovies: any[] = [];
  let bollywoodMovies: any[] = [];
  let nowPlaying: any[] = [];
  let topRated: any[] = [];

  const apiKeySet = !!(process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN);

  if (apiKeySet) {
    const [
      netflixData,
      hboData,
      amazonData,
      disneyData,
      zee5Data,
      latestMv,
      nowPl,
      southMv,
      animeMv,
      hlMov,
      blMov,
      topMv,
    ] = await Promise.all([
      fetchOttWebSeries('netflix'),
      fetchOttWebSeries('hbo'),
      fetchOttWebSeries('amazon'),
      fetchOttWebSeries('disney'),
      fetchOttWebSeries('zee5'),
      fetchLatest2026Movies(),
      fetchNowPlaying(),
      fetchSouthHindiDubbed(),
      fetchAnimeMovies(),
      fetchHollywoodMovies(),
      fetchBollywoodMovies(),
      fetchTopRatedMovies(),
    ]);

    netflix = netflixData;
    hbo = hboData;
    amazon = amazonData;
    disney = disneyData;
    zee5 = zee5Data;
    latest2026 = latestMv;
    nowPlaying = nowPl;
    southHindi = southMv;
    animeFeatures = animeMv;
    hollywoodMovies = hlMov;
    bollywoodMovies = blMov;
    topRated = topMv;

    // Hero Banner: ONLY Movies (not web series), picked from latest + now playing + top rated
    const movieOnlyPool = [
      ...latest2026.filter((m: any) => m.mediaType !== 'series' && m.bannerImage),
      ...nowPlaying.filter((m: any) => m.bannerImage),
      ...hollywoodMovies.filter((m: any) => m.bannerImage),
      ...topRated.filter((m: any) => m.bannerImage),
    ];
    // Deduplicate
    const seenIds = new Set<string>();
    heroMovies = movieOnlyPool.filter((m: any) => {
      if (seenIds.has(m.id)) return false;
      seenIds.add(m.id);
      return true;
    }).slice(0, 6);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24">
      {/* Hero Banner Carousel (Netflix-style marquee) */}
      {heroMovies.length > 0 && <MovieHeroCarousel movies={heroMovies} />}

      {/* Main Content Area */}
      <div className="mt-8 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-8">
        {/* Warning if no TMDB API key */}
        {!apiKeySet && (
          <div className="p-5 rounded-[20px] bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FCD34D] text-sm font-semibold">
            <p className="font-black mb-1">⚠️ TMDB API Key Missing</p>
            <p className="text-xs text-[#F59E0B]/80 leading-relaxed">
              Movie data requires a free TMDB API key. Add <code className="bg-black/30 px-1 py-0.5 rounded text-white">TMDB_API_KEY=your_key</code> to your <code className="bg-black/30 px-1 py-0.5 rounded text-white">.env.local</code> file.
              Get your free key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener" className="underline text-[#FCD34D]">themoviedb.org</a>.
            </p>
          </div>
        )}

        {/* Movies Explorer Component (Search, OTT Filters, Rows/Grid View) */}
        {apiKeySet && (
          <MoviesExplorer
            netflixSeries={netflix}
            hboSeries={hbo}
            amazonSeries={amazon}
            disneySeries={disney}
            zee5Series={zee5}
            latest2026Movies={latest2026}
            nowPlayingMovies={nowPlaying}
            southHindiMovies={southHindi}
            animeFeatureMovies={animeFeatures}
            initialHollywoodMovies={hollywoodMovies}
            initialBollywoodMovies={bollywoodMovies}
            topRatedMovies={topRated}
          />
        )}
      </div>
    </div>
  );
}
