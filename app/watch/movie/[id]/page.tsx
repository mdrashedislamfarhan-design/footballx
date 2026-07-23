import { fetchMovieById, fetchHollywoodMovies } from '@/services/movies/tmdb';
import MovieCard from '@/components/movies/MovieCard';
import MultiServerPlayer, { ServerConfig } from '@/components/player/MultiServerPlayer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, ChevronLeft, ChevronRight, Info, Sparkles } from 'lucide-react';
import WatchTracker from '@/components/player/WatchTracker';

export const revalidate = 3600;

export default async function WatchMoviePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const movie = await fetchMovieById(resolvedParams.id);
  if (!movie) notFound();

  const season  = resolvedSearchParams.season  || '1';
  const episode = resolvedSearchParams.episode || '1';
  const isSeries = movie.mediaType === 'series';

  const imdb = movie.imdbId;
  const tmdb = movie.tmdbId;
  const ref  = imdb || String(tmdb);   // fallback to numeric tmdb id

  // ── Build the full server list ────────────────────────────────────────
  const servers: ServerConfig[] = [
    // ── 🇮🇳 Hindi Dubbed servers FIRST (priority) ─────────────────────────
    // These providers often carry multi-audio — pick Hindi track inside player
    { name: 'Hindi Server 1', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://multiembed.mov/?video_id=${tmdb}&s=${season}&e=${episode}&lang=hi` : `https://multiembed.mov/?video_id=${tmdb}&lang=hi` },
    { name: 'Hindi Server 2', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://multiembed.eu.org/?video_id=${tmdb}&s=${season}&e=${episode}&lang=hi` : `https://multiembed.eu.org/?video_id=${tmdb}&lang=hi` },
    { name: 'Hindi Server 3', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://autoembed.co/tv/tmdb/${tmdb}-${season}-${episode}` : `https://autoembed.co/movie/tmdb/${tmdb}` },
    { name: 'Hindi Server 4', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://vidlink.pro/embed/tv/${tmdb}/${season}/${episode}?primaryColor=8B5CF6` : `https://vidlink.pro/embed/movie/${tmdb}?primaryColor=8B5CF6` },
    { name: 'Hindi Server 5', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://embed.su/embed/tv/${tmdb}/${season}/${episode}` : `https://embed.su/embed/movie/${tmdb}` },
    { name: 'Hindi Server 6', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://vidsrc.to/embed/tv/${ref}/${season}/${episode}` : `https://vidsrc.to/embed/movie/${ref}` },
    { name: 'Hindi Server 7', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://vidsrc.me/embed/tv/${ref}/${season}/${episode}` : `https://vidsrc.me/embed/movie/${ref}` },
    { name: 'Hindi Server 8', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://vidsrc.pm/embed/tv/${ref}/${season}/${episode}` : `https://vidsrc.pm/embed/movie/${ref}` },
    { name: 'Hindi Server 9', icon: '🇮🇳', lang: 'HI', url: isSeries ? `https://www.2embed.cc/embedtv/${ref}&s=${season}&e=${episode}` : `https://www.2embed.cc/embed/${ref}` },

    // ── 🌎 English / Multi-language servers ──────────────────────────────
    { name: 'Main Server 1',  icon: '🌎', lang: 'EN', url: isSeries ? `https://vidsrc.to/embed/tv/${ref}/${season}/${episode}`                    : `https://vidsrc.to/embed/movie/${ref}` },
    { name: 'Main Server 2',  icon: '🇺🇸', lang: 'EN', url: isSeries ? `https://vidlink.pro/embed/tv/${tmdb}/${season}/${episode}`                 : `https://vidlink.pro/embed/movie/${tmdb}` },
    { name: 'Main Server 3',  icon: '🇬🇧', lang: 'EN', url: isSeries ? `https://vidsrc.pm/embed/tv/${ref}/${season}/${episode}`                    : `https://vidsrc.pm/embed/movie/${ref}` },
    { name: 'Main Server 4',  icon: '🌎', lang: 'EN', url: isSeries ? `https://vidsrc.me/embed/tv/${ref}/${season}/${episode}`                    : `https://vidsrc.me/embed/movie/${ref}` },
    { name: 'Main Server 5',  icon: '🇪🇺', lang: 'EN', url: isSeries ? `https://multiembed.eu.org/?video_id=${tmdb}&s=${season}&e=${episode}`      : `https://multiembed.eu.org/?video_id=${tmdb}` },
    { name: 'Main Server 6',  icon: '🌎', lang: 'EN', url: isSeries ? `https://embed.smashystream.com/playere.php?tmdb=${tmdb}&s=${season}&e=${episode}` : `https://embed.smashystream.com/playere.php?tmdb=${tmdb}` },
    { name: 'Main Server 7',  icon: '🌎', lang: 'EN', url: isSeries ? `https://embed.su/embed/tv/${tmdb}/${season}/${episode}`                   : `https://embed.su/embed/movie/${tmdb}` },
    { name: 'Main Server 8',  icon: '🌏', lang: 'EN', url: isSeries ? `https://www.NontonGo.net/embed/tv/${tmdb}/${season}/${episode}`             : `https://www.NontonGo.net/embed/movie/${tmdb}` },
    { name: 'Main Server 9',  icon: '🌐', lang: 'EN', url: isSeries ? `https://autoembed.co/tv/tmdb/${tmdb}-${season}-${episode}`                  : `https://autoembed.co/movie/tmdb/${tmdb}` },
    { name: 'Main Server 10', icon: '🎬', lang: 'EN', url: isSeries ? `https://www.primewire.tf/embed/tv/${tmdb}/${season}/${episode}`              : `https://www.primewire.tf/embed/movie/${tmdb}` },
  ];

  const recommendations = await fetchHollywoodMovies();
  const recs = recommendations.filter(m => m.id !== movie.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Backdrop */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        {movie.bannerImage && (
          <>
            <img src={movie.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20" />
          </>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 -mt-52 pt-16 relative z-10 pb-20">
        <Link href="/movies" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Main Column */}
          <div className="space-y-5">

            {/* Episode Prev/Next for Series */}
            {isSeries && (
              <div className="flex items-center justify-between">
                <Link
                  href={parseInt(episode) > 1 ? `/watch/movie/${movie.id}?season=${season}&episode=${parseInt(episode) - 1}` : '#'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    parseInt(episode) > 1
                      ? 'bg-white/[0.04] border-white/[0.08] text-[#999] hover:text-white hover:border-[#8B5CF6]/40'
                      : 'bg-white/[0.02] border-white/[0.03] text-[#444] cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev Episode
                </Link>
                <span className="text-xs font-black text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-4 py-2 rounded-xl">
                  S{season} E{episode}
                </span>
                <Link
                  href={`/watch/movie/${movie.id}?season=${season}&episode=${parseInt(episode) + 1}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 border-[#8B5CF6]/20 text-[#A78BFA] hover:text-white hover:border-[#8B5CF6]/50"
                >
                  Next Episode <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* ── Multi-Server Player ────────────────────────────────── */}
            <MultiServerPlayer servers={servers} title={movie.title} />

            {/* Episode Selector for Series */}
            {isSeries && movie.seasonsDetail && movie.seasonsDetail.length > 0 && (
              <div className="bg-[#111118] border border-white/[0.06] p-6 rounded-[24px] space-y-6 shadow-xl">
                {/* Seasons */}
                <div>
                  <span className="text-[10px] text-[#555] font-black uppercase tracking-widest block mb-3">Seasons</span>
                  <div className="flex flex-wrap gap-2">
                    {movie.seasonsDetail.map((s) => (
                      <Link
                        key={s.seasonNumber}
                        href={`/watch/movie/${movie.id}?season=${s.seasonNumber}&episode=1`}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          parseInt(season) === s.seasonNumber
                            ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                            : 'bg-white/[0.04] text-[#999] hover:text-white border border-white/[0.06] hover:bg-white/[0.08]'
                        }`}
                      >
                        Season {s.seasonNumber}
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Episodes */}
                <div>
                  <span className="text-[10px] text-[#555] font-black uppercase tracking-widest block mb-3">Episodes</span>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {Array.from(
                      { length: movie.seasonsDetail.find(s => s.seasonNumber === parseInt(season))?.episodeCount || 10 },
                      (_, i) => i + 1
                    ).map((ep) => (
                      <Link
                        key={ep}
                        href={`/watch/movie/${movie.id}?season=${season}&episode=${ep}`}
                        className={`py-2 text-center rounded-xl text-xs font-black transition-all ${
                          parseInt(episode) === ep
                            ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                            : 'bg-white/[0.04] text-[#999] hover:text-white border border-white/[0.06] hover:bg-white/[0.08]'
                        }`}
                      >
                        {ep}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Synopsis */}
            <div className="bg-[#111118] border border-white/[0.06] p-6 rounded-[24px]">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-[#8B5CF6]" /> Synopsis
              </h3>
              <p className="text-sm text-[#B3B3B3] leading-relaxed">{movie.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight mb-3">{movie.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC107]/10 border border-[#FFC107]/20 rounded-xl">
                  <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                  <span className="text-white font-black text-sm">{movie.rating.toFixed(1)}</span>
                  <span className="text-[#666] text-xs">/10</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs font-bold text-[#999]">
                  <Clock className="w-3 h-3" /> {movie.runtime}
                </div>
                <div className="px-3 py-1.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl text-[10px] font-black text-[#A78BFA]">
                  {movie.type === 'hollywood' ? '🎥 Hollywood' : '🌟 Bollywood'}
                </div>
              </div>
            </div>

            {/* Poster */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden">
              {movie.coverImage
                ? <img src={movie.coverImage} alt={movie.title} className="w-full object-cover" />
                : <div className="w-full aspect-[2/3] bg-[#1a1a22] flex items-center justify-center text-[#333] text-sm">No Image</div>
              }
              <div className="p-5 space-y-3">
                {[
                  { label: 'Year',     value: movie.year    },
                  { label: 'Runtime',  value: movie.runtime },
                  { label: 'Language', value: movie.type === 'bollywood' ? 'Hindi' : 'English' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs py-1.5 border-b border-white/[0.03]">
                    <span className="text-[#555] font-black uppercase tracking-wider">{label}</span>
                    <span className="text-white font-bold">{value}</span>
                  </div>
                ))}
                {movie.genres.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] text-[#555] font-black uppercase tracking-wider block mb-2">Genres</span>
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genres.map(g => (
                        <span key={g} className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA]">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recs.length > 0 && (
          <div className="mt-16 border-t border-white/[0.06] pt-12">
            <h2 className="text-lg font-black text-white flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[#EC4899]" /> You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recs.map(rec => <MovieCard key={rec.id} movie={rec} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
