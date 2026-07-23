// ─── TMDB (The Movie Database) Service ─────────────────────────────────────
// Free API — sign up at https://www.themoviedb.org/settings/api
// Add your key to .env.local as TMDB_API_KEY=your_key_here

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

// ── Types ───────────────────────────────────────────────────────────────────
export interface TMDBMovie {
  id: number;
  imdb_id?: string;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  original_language: string;
}

export interface Movie {
  id: string;
  tmdbId: number;
  imdbId: string;
  title: string;
  coverImage: string;
  bannerImage: string;
  description: string;
  year: number;
  rating: number;
  runtime: string;
  genres: string[];
  type: 'hollywood' | 'bollywood';
  mediaType?: 'movie' | 'series';
  seasonsDetail?: { seasonNumber: number; episodeCount: number }[];
}

// ── In-Memory Server Cache for Ultra-Fast Instant Loads ─────────────────────
const apiMemoryCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

async function tmdb(path: string, params: Record<string, string | number> = {}): Promise<any> {
  const cacheKey = `${path}?${new URLSearchParams(params as any).toString()}`;
  const now = Date.now();

  if (apiMemoryCache.has(cacheKey)) {
    const cached = apiMemoryCache.get(cacheKey)!;
    if (now < cached.expiry) {
      return cached.data;
    }
  }

  const bearerToken = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!bearerToken && !apiKey) {
    console.warn('TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY not set in .env.local');
    return null;
  }

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('language', 'en-US');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  } else if (apiKey) {
    url.searchParams.set('api_key', apiKey);
  }

  try {
    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`TMDB API error: ${res.status} ${res.statusText} for ${path}`);
      return null;
    }

    const data = await res.json();
    apiMemoryCache.set(cacheKey, { data, expiry: now + CACHE_TTL_MS });
    return data;
  } catch (err) {
    console.error(`TMDB Fetch Exception for ${path}:`, err);
    return null;
  }
}

// ── Image URL helpers ────────────────────────────────────────────────────────
export function getPosterUrl(path: string | null, size: 'w342' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '';
  return `${TMDB_IMAGE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '';
  return `${TMDB_IMAGE}/${size}${path}`;
}

// ── Map TMDB response → our Movie type ──────────────────────────────────────
function mapMovie(m: TMDBMovie, type: 'hollywood' | 'bollywood'): Movie {
  return {
    id: String(m.id),
    tmdbId: m.id,
    imdbId: m.imdb_id || '',
    title: m.title,
    coverImage: getPosterUrl(m.poster_path, 'w500'),
    bannerImage: getBackdropUrl(m.backdrop_path, 'w1280'),
    description: m.overview || '',
    year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0,
    rating: Math.round(m.vote_average * 10) / 10,
    runtime: m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : 'N/A',
    genres: (m.genres || []).map(g => g.name),
    type,
    mediaType: 'movie',
  };
}

// ── Map TMDB TV show → our Movie type ────────────────────────────────────────
function mapTvShow(m: any, type: 'hollywood' | 'bollywood'): Movie {
  return {
    id: `tv-${m.id}`,
    tmdbId: m.id,
    imdbId: '',
    title: m.name,
    coverImage: getPosterUrl(m.poster_path, 'w500'),
    bannerImage: getBackdropUrl(m.backdrop_path, 'w1280'),
    description: m.overview || '',
    year: m.first_air_date ? parseInt(m.first_air_date.slice(0, 4)) : 0,
    rating: Math.round(m.vote_average * 10) / 10,
    runtime: 'Web Series',
    genres: (m.genres || []).map((g: any) => g.name),
    type,
    mediaType: 'series',
    seasonsDetail: (m.seasons || []).map((s: any) => ({
      seasonNumber: s.season_number,
      episodeCount: s.episode_count
    })).filter((s: any) => s.season_number > 0 || s.episode_count > 0),
  };
}

// ── Exclude all non-premium / non-OTT content ──────────────────────────────────
const EXCLUDE_KEYWORDS = [
  // Indian TV Serials
  'anupamaa', 'taarak mehta', 'kumkum', 'bhagya', 'rishta', 'bigg boss',
  'kapil sharma', 'khatron ke khiladi', 'dance deewane', 'indian idol',
  'crime patrol', 'savdhaan', 'kundali', 'ghum hai', 'ye hai mohabbatein',
  'sasural', 'naagin', 'parineetii', 'imlie', 'udne ki aasha', 'super dancer',
  'sa re ga ma pa', 'kaun banega crorepati', 'kbc', 'zee tv', 'star plus',
  'colors tv', 'sony sab', 'sun tv', 'star jalsha', 'cid',
  // Children / Reality / Talk
  'sesame street', 'mythical morning', 'good mythical', 'peppa pig', 'cocomelon',
  'dora', 'paw patrol', 'bluey', 'teletubbies', 'postman pat', 'masha',
  'today show', 'morning show', 'tonight show', 'talk show', 'late show',
  'ellen', 'oprah', 'jeopardy', 'wheel of fortune', 'dancing with', 'american idol',
  'got talent', 'voice', 'drag race', 'real housewives', 'kardashian', 'bachelorette'
];

// Genre IDs to exclude: Soap (10766), News (10763), Reality (10764), Talk (10767), Kids (10762)
const EXCLUDE_GENRE_IDS = [10766, 10763, 10764, 10767, 10762];

function isRealOttSeries(show: any, minVoteCount = 200): boolean {
  if (!show || !show.poster_path) return false;

  // Must have minimum vote count for quality assurance
  if ((show.vote_count || 0) < minVoteCount) return false;

  // Must have a minimum rating
  if ((show.vote_average || 0) < 6.0) return false;

  // Exclude bad genre IDs
  const genreIds: number[] = show.genre_ids || (show.genres || []).map((g: any) => g.id || g);
  if (genreIds.some((id: number) => EXCLUDE_GENRE_IDS.includes(id))) {
    return false;
  }

  // Keyword exclusion
  const titleLower = (show.name || show.title || '').toLowerCase();
  if (EXCLUDE_KEYWORDS.some((kw) => titleLower.includes(kw))) {
    return false;
  }

  return true;
}

// Legacy alias used in some paths
function isRealWebSeries(show: any): boolean {
  return isRealOttSeries(show, 50);
}

// ── Quality filter: must have a poster ──────────────────────────────────────
function hasQuality(m: TMDBMovie, minVotes = 5): boolean {
  return !!m.poster_path && m.vote_count >= minVotes && !!m.release_date;
}

// ── Fetch Specific OTT Platform Web Series ──────────────────────────────────
export async function fetchOttWebSeries(platform: 'netflix' | 'hbo' | 'amazon' | 'disney' | 'zee5'): Promise<Movie[]> {
  let networkId = '213';
  let minVotes = 500; // Very high threshold = only real hits
  let type: 'hollywood' | 'bollywood' = 'hollywood';

  if (platform === 'hbo') { networkId = '49|3186'; minVotes = 300; }
  else if (platform === 'amazon') { networkId = '1024'; minVotes = 200; }
  else if (platform === 'disney') { networkId = '2739|3919'; minVotes = 200; }
  else if (platform === 'zee5') { networkId = '3014|2573|1024'; minVotes = 100; type = 'bollywood'; }

  const data = await tmdb('/discover/tv', {
    with_networks: networkId,
    without_genres: '10766,10763,10764,10767,10762',
    sort_by: 'vote_count.desc',
    'vote_count.gte': minVotes,
    'vote_average.gte': 6,
  });

  if (!data?.results) return [];

  let results = data.results.filter((m: any) => isRealOttSeries(m, minVotes / 2));

  // For ZEE5, also filter by Indian origin
  if (platform === 'zee5') {
    results = results.filter((m: any) => {
      const country: string[] = m.origin_country || [];
      return country.includes('IN') || m.original_language === 'hi' || m.original_language === 'ta' || m.original_language === 'te';
    });
  }

  return results.slice(0, 24).map((m: any) => mapTvShow(m, type));
}

// ── Fetch popular Hollywood series (Web Series) ──────────────────────────────
export async function fetchHollywoodSeries(page = 1): Promise<Movie[]> {
  const data = await tmdb('/discover/tv', {
    page,
    with_networks: '213|49|3186|1024|2739|2552',
    without_genres: '10766,10763,10764,10767,10762',
    sort_by: 'vote_count.desc',
    'vote_count.gte': 200,
    'vote_average.gte': 7,
  });
  if (!data?.results) return [];
  return data.results
    .filter((m: any) => isRealOttSeries(m, 200))
    .slice(0, 24)
    .map((m: any) => mapTvShow(m, 'hollywood'));
}

// ── Fetch popular Bollywood & Indian OTT Series (Netflix/Prime/Zee5/SonyLIV) ─
export async function fetchBollywoodSeries(page = 1): Promise<Movie[]> {
  const data = await tmdb('/discover/tv', {
    page,
    with_origin_country: 'IN',
    with_networks: '213|1024|3014|2573|3919|2739',
    without_genres: '10766,10763,10764,10767,10762',
    sort_by: 'vote_count.desc',
    'vote_count.gte': 100,
    'vote_average.gte': 6.5,
  });

  let results = data?.results || [];
  if (results.length < 5) {
    const fallbackData = await tmdb('/discover/tv', {
      page,
      with_origin_country: 'IN',
      without_genres: '10766,10763,10764,10767,10762',
      sort_by: 'vote_count.desc',
      'vote_count.gte': 50,
    });
    results = fallbackData?.results || [];
  }

  return results
    .filter((m: any) => isRealOttSeries(m, 50))
    .slice(0, 24)
    .map((m: any) => mapTvShow(m, 'bollywood'));
}

// ── Fetch popular Hollywood movies ───────────────────────────────────────────
export async function fetchHollywoodMovies(page = 1): Promise<Movie[]> {
  const data = await tmdb('/movie/popular', { page, with_original_language: 'en' });
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => m.original_language === 'en' && hasQuality(m, 10))
    .slice(0, 36)
    .map((m: TMDBMovie) => mapMovie(m, 'hollywood'));
}

// ── Fetch popular Bollywood (Hindi) movies ───────────────────────────────────
export async function fetchBollywoodMovies(page = 1): Promise<Movie[]> {
  const data = await tmdb('/discover/movie', {
    page,
    with_origin_country: 'IN',
    with_original_language: 'hi',
    sort_by: 'popularity.desc',
    'vote_count.gte': 5,
  });
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => hasQuality(m, 2))
    .slice(0, 36)
    .map((m: TMDBMovie) => mapMovie(m, 'bollywood'));
}


// ── Fetch NEW RELEASES for Hero Banner ───────────────────────────────────────
export async function fetchNewReleases(type: 'hollywood' | 'bollywood', page = 1): Promise<Movie[]> {
  const today = new Date().toISOString().split('T')[0];
  if (type === 'bollywood') {
    // Recent Indian movies sorted by release date
    const [mv, tv] = await Promise.all([
      tmdb('/discover/movie', {
        page,
        with_origin_country: 'IN',
        sort_by: 'primary_release_date.desc',
        'primary_release_date.lte': today,
        'primary_release_date.gte': '2024-01-01',
      }),
      tmdb('/discover/tv', {
        page,
        with_origin_country: 'IN',
        with_networks: '213|1024|3014|2573|3919|2739',
        without_genres: '10766,10763,10764,10767',
        sort_by: 'first_air_date.desc',
        'first_air_date.lte': today,
        'first_air_date.gte': '2024-01-01',
      })
    ]);

    const mappedMovies = (mv?.results || [])
      .filter((m: TMDBMovie) => hasQuality(m, 2) && !!m.backdrop_path)
      .map((m: TMDBMovie) => mapMovie(m, 'bollywood'));

    const mappedSeries = (tv?.results || [])
      .filter(isRealWebSeries)
      .map((m: any) => mapTvShow(m, 'bollywood'));

    return [...mappedSeries, ...mappedMovies].slice(0, 10);
  } else {
    // Hollywood Now Playing / New Releases
    const [mv, tv] = await Promise.all([
      tmdb('/movie/now_playing', { page }),
      tmdb('/tv/on_the_air', { page, without_genres: '10766,10763,10764,10767' })
    ]);

    const mappedMovies = (mv?.results || [])
      .filter((m: TMDBMovie) => hasQuality(m, 10) && !!m.backdrop_path)
      .map((m: TMDBMovie) => mapMovie(m, 'hollywood'));

    const mappedSeries = (tv?.results || [])
      .filter(isRealWebSeries)
      .map((m: any) => mapTvShow(m, 'hollywood'));

    return [...mappedSeries, ...mappedMovies].slice(0, 10);
  }
}

// ── Fetch NOW PLAYING (cinema) movies ────────────────────────────────────────
export async function fetchNowPlaying(): Promise<Movie[]> {
  const data = await tmdb('/movie/now_playing');
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => hasQuality(m, 10))
    .slice(0, 36)
    .map((m: TMDBMovie) => mapMovie(m, 'hollywood'));
}

// ── Fetch LATEST 2025/2026 Movies ──────────────────────────────────────────────
export async function fetchLatest2026Movies(): Promise<Movie[]> {
  const today = new Date().toISOString().split('T')[0];
  const data = await tmdb('/discover/movie', {
    sort_by: 'popularity.desc',
    'primary_release_date.lte': today,
    'primary_release_date.gte': '2025-01-01',
    'vote_count.gte': 15,
  });
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => !!m.poster_path)
    .slice(0, 36)
    .map((m: TMDBMovie) => mapMovie(m, m.original_language === 'hi' ? 'bollywood' : 'hollywood'));
}

// ── Fetch South Indian Blockbusters (Telugu, Tamil, Kannada, Malayalam) ──────
export async function fetchSouthHindiDubbed(): Promise<Movie[]> {
  const data = await tmdb('/discover/movie', {
    with_origin_country: 'IN',
    with_original_language: 'te|ta|kn|ml',
    sort_by: 'popularity.desc',
    'vote_count.gte': 10,
  });
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => !!m.poster_path)
    .slice(0, 36)
    .map((m: TMDBMovie) => mapMovie(m, 'bollywood'));
}


// ── Fetch Anime & Animated Feature Movies ───────────────────────────────────
export async function fetchAnimeMovies(): Promise<Movie[]> {
  const data = await tmdb('/discover/movie', {
    with_genres: 16,
    sort_by: 'popularity.desc',
    'vote_count.gte': 20,
  });
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => !!m.poster_path)
    .slice(0, 36)
    .map((m: TMDBMovie) => mapMovie(m, 'hollywood'));
}

// ── Fetch TOP RATED movies ───────────────────────────────────────────────────
export async function fetchTopRatedMovies(): Promise<Movie[]> {
  const data = await tmdb('/movie/top_rated');
  if (!data?.results) return [];
  return data.results
    .filter((m: TMDBMovie) => hasQuality(m, 100))
    .slice(0, 24)
    .map((m: TMDBMovie) => mapMovie(m, 'hollywood'));
}

// ── Fetch Movies by Genre ───────────────────────────────────────────────────
export async function fetchMoviesByGenre(genreId: number, type: 'movie' | 'tv' = 'movie', page = 1): Promise<Movie[]> {
  const endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie';
  const data = await tmdb(endpoint, {
    page,
    with_genres: genreId,
    sort_by: 'popularity.desc',
  });
  if (!data?.results) return [];
  return data.results
    .filter((m: any) => type === 'tv' ? !!m.poster_path : hasQuality(m, 2))
    .slice(0, 24)
    .map((m: any) => type === 'tv' ? mapTvShow(m, 'hollywood') : mapMovie(m, 'hollywood'));
}

// ── Search movies (searches both Hollywood + Bollywood Movies & Series) ────────
export async function searchMovies(query: string): Promise<Movie[]> {
  const [enMovie, hiMovie, enTv, hiTv] = await Promise.all([
    tmdb('/search/movie', { query, language: 'en-US' }),
    tmdb('/search/movie', { query, language: 'hi-IN' }),
    tmdb('/search/tv', { query, language: 'en-US' }),
    tmdb('/search/tv', { query, language: 'hi-IN' }),
  ]);

  const rawMovies = [...(enMovie?.results || []), ...(hiMovie?.results || [])];
  const rawTv = [...(enTv?.results || []), ...(hiTv?.results || [])];

  const seen = new Set<string>();
  const merged: Movie[] = [];

  for (const m of rawMovies) {
    const idStr = String(m.id);
    if (!seen.has(idStr) && hasQuality(m, 2)) {
      seen.add(idStr);
      const type = m.original_language === 'hi' ? 'bollywood' : 'hollywood';
      merged.push(mapMovie(m, type));
    }
  }

  for (const t of rawTv) {
    const idStr = `tv-${t.id}`;
    if (!seen.has(idStr) && t.poster_path) {
      seen.add(idStr);
      const type = t.origin_country?.includes('IN') || t.original_language === 'hi' ? 'bollywood' : 'hollywood';
      merged.push(mapTvShow(t, type));
    }
  }

  // Sort by rating or popularity
  return merged.slice(0, 30);
}

// ── Fetch single movie or TV show by ID ───────────────────────────────────────
export async function fetchMovieById(id: string): Promise<Movie | null> {
  const isSeries = id.startsWith('tv-');
  const actualId = isSeries ? id.replace('tv-', '') : id;

  if (isSeries) {
    const data = await tmdb(`/tv/${actualId}`, { append_to_response: 'external_ids' });
    if (!data) return null;
    const type = data.origin_country?.includes('IN') || data.original_language === 'hi' ? 'bollywood' : 'hollywood';
    const series = mapTvShow(data, type);
    series.imdbId = data.external_ids?.imdb_id || '';
    return series;
  } else {
    const data = await tmdb(`/movie/${actualId}`, { append_to_response: 'external_ids' });
    if (!data) return null;
    const type = data.original_language === 'hi' || data.origin_country?.includes('IN') ? 'bollywood' : 'hollywood';
    const movie = mapMovie(data, type);
    movie.imdbId = data.external_ids?.imdb_id || data.imdb_id || '';
    return movie;
  }
}

// ── Fetch combined list of Movies & Series ───────────────────────────────────
export async function fetchMovies(type?: 'hollywood' | 'bollywood'): Promise<Movie[]> {
  if (type === 'bollywood') {
    const [movies, series] = await Promise.all([fetchBollywoodMovies(), fetchBollywoodSeries()]);
    // Interleave movies and web series
    const result: Movie[] = [];
    const maxLen = Math.max(movies.length, series.length);
    for (let i = 0; i < maxLen; i++) {
      if (movies[i]) result.push(movies[i]);
      if (series[i]) result.push(series[i]);
    }
    return result.slice(0, 36);
  } else {
    const [movies, series] = await Promise.all([fetchHollywoodMovies(), fetchHollywoodSeries()]);
    const result: Movie[] = [];
    const maxLen = Math.max(movies.length, series.length);
    for (let i = 0; i < maxLen; i++) {
      if (movies[i]) result.push(movies[i]);
      if (series[i]) result.push(series[i]);
    }
    return result.slice(0, 36);
  }
}

// ── Find TMDB TV Show ID by Title (for Anime Mapping) ────────────────────────
export async function findTmdbTvIdByTitle(title: string): Promise<number | null> {
  const data = await tmdb('/search/tv', { query: title });
  if (data?.results && data.results.length > 0) {
    return data.results[0].id;
  }
  return null;
}


