import { fetchAnimeDetail, getTitle } from '@/services/anime/anilist';
import { findTmdbTvIdByTitle } from '@/services/movies/tmdb';
import AnimeCard from '@/components/anime/AnimeCard';
import MultiServerPlayer, { ServerConfig } from '@/components/player/MultiServerPlayer';
import WatchTracker from '@/components/player/WatchTracker';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ChevronLeft, ChevronRight, Tv2, Info, Sparkles } from 'lucide-react';

export const revalidate = 600;

function getSeasonFromTitle(title: string): number {
  const t = title.toLowerCase();
  if (t.includes('season 5') || t.includes('5th season')) return 5;
  if (t.includes('season 4') || t.includes('4th season')) return 4;
  if (t.includes('season 3') || t.includes('3rd season') || t.includes('swordsmith') || t.includes('swordsmith village')) return 3;
  if (t.includes('season 2') || t.includes('2nd season') || t.includes('entertainment district') || t.includes('mugen train')) return 2;
  return 1;
}

function cleanTitleForTmdb(title: string): string {
  return title
    .replace(/(?:season\s+\d+|2nd\s+season|3rd\s+season|4th\s+season|5th\s+season|\d+nd\s+season|\d+rd\s+season|\d+th\s+season)/gi, '')
    .replace(/(?:part\s+\d+|part\s+[a-z]+)/gi, '')
    .replace(/\s+-\s+.*$/gi, '')
    .trim();
}

function getShortTitle(title: string): string {
  let t = title;
  t = t.replace(/Kimetsu no Yaiba/gi, 'Demon Slayer');
  t = t.replace(/Jujutsu Kaisen/gi, 'JJK');
  t = t.replace(/Shingeki no Kyojin/gi, 'AOT');
  t = t.replace(/Boku no Hero Academia/gi, 'MHA');
  t = t.replace(/Season\s*/gi, 'S');
  return t;
}

export default async function AnimeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) notFound();

  let anime;
  try {
    anime = await fetchAnimeDetail(id);
  } catch {
    notFound();
  }

  const ep = resolvedSearchParams.ep ? parseInt(resolvedSearchParams.ep) : 1;
  const title = getTitle(anime);

  const streamId = anime.idMal || anime.id;
  const slugTitle = anime.title.romaji?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';

  // Resolve TMDB TV ID and Season for TMDB-based providers (like embed.su, vidsrc.in/xyz, moviesapi)
  const tmdbSearchTitle = cleanTitleForTmdb(title);
  const resolvedTmdbId = await findTmdbTvIdByTitle(tmdbSearchTitle) || await findTmdbTvIdByTitle(title) || streamId;
  const tmdbSeason = getSeasonFromTitle(title);

  // ── Build the full server list ────────────────────────────────────────
  const servers: ServerConfig[] = [
    // 🇮🇳 Hindi Dubbed Servers FIRST
    // animeplay.cfd supports /hin (Hindi) language stream directly
    { name: 'Hindi Server 1', icon: '🇮🇳', lang: 'HI', url: `https://animeplay.cfd/stream/ani/${anime.id}/${ep}/hin` },
    { name: 'Hindi Server 2', icon: '🇮🇳', lang: 'HI', url: `https://animeplay.cfd/stream/mal/${streamId}/${ep}/hin` },
    { name: 'Hindi Server 3', icon: '🇮🇳', lang: 'HI', url: `https://multiembed.mov/?video_id=${resolvedTmdbId}&s=${tmdbSeason}&e=${ep}&lang=hi` },
    { name: 'Hindi Server 4', icon: '🇮🇳', lang: 'HI', url: `https://multiembed.eu.org/?video_id=${resolvedTmdbId}&s=${tmdbSeason}&e=${ep}&lang=hi` },
    { name: 'Hindi Server 5', icon: '🇮🇳', lang: 'HI', url: `https://vidlink.pro/embed/tv/${resolvedTmdbId}/${tmdbSeason}/${ep}?primaryColor=8B5CF6` },
    { name: 'Hindi Server 6', icon: '🇮🇳', lang: 'HI', url: `https://autoembed.co/tv/tmdb/${resolvedTmdbId}-${tmdbSeason}-${ep}` },
    { name: 'Hindi Server 7', icon: '🇮🇳', lang: 'HI', url: `https://embed.su/embed/tv/${resolvedTmdbId}/${tmdbSeason}/${ep}` },

    // 🎌 SUB Servers
    { name: 'Main Server 1',  icon: '🎌', lang: 'SUB', url: `https://animeplay.cfd/stream/ani/${anime.id}/${ep}/sub` },
    { name: 'Main Server 2',  icon: '📺', lang: 'SUB', url: `https://animeplay.cfd/stream/mal/${streamId}/${ep}/sub` },
    { name: 'Main Server 3',  icon: '🔥', lang: 'SUB', url: `https://vidsrc.to/embed/anime/${streamId}/${ep}` },
    { name: 'Main Server 4',  icon: '🌎', lang: 'SUB', url: `https://vidsrc.me/embed/anime/${streamId}/${ep}` },
    { name: 'Main Server 5',  icon: '🐉', lang: 'SUB', url: `https://gogoanime3.cc/embed/${slugTitle}-episode-${ep}` },
    { name: 'Main Server 6',  icon: '💎', lang: 'SUB', url: `https://animepahe.ru/anime/${anime.id}` },
    { name: 'Main Server 7',  icon: '🌸', lang: 'SUB', url: `https://sudatchi.com/watch/${anime.id}/${ep}` },
    { name: 'Main Server 8',  icon: '⚡', lang: 'SUB', url: `https://aniwatch.to/anime/${anime.id}/${ep}` },
    { name: 'Main Server 9',  icon: '☁️', lang: 'SUB', url: `https://anime.uniquestream.net/embed/anime/${streamId}/${ep}` },
    { name: 'Main Server 10', icon: '🌟', lang: 'SUB', url: `https://vidlink.pro/embed/anime/${streamId}/${ep}` },

    // 🇺🇸 DUB (English) Servers
    { name: 'Dub Server 1',   icon: '🎌', lang: 'DUB', url: `https://animeplay.cfd/stream/ani/${anime.id}/${ep}/dub` },
    { name: 'Dub Server 2',   icon: '📺', lang: 'DUB', url: `https://animeplay.cfd/stream/mal/${streamId}/${ep}/dub` },
    { name: 'Dub Server 3',   icon: '🐉', lang: 'DUB', url: `https://gogoanime3.cc/embed/${slugTitle}-dub-episode-${ep}` },
    { name: 'Dub Server 4',   icon: '🔥', lang: 'DUB', url: `https://vidlink.pro/embed/anime/${streamId}/${ep}?dub=true` },
  ];

  const totalEpisodes = Math.max(
    anime.episodes || 0,
    anime.nextAiringEpisode?.episode ? anime.nextAiringEpisode.episode - 1 : 12
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Automatic Watch Tracker */}
      <WatchTracker
        id={`anime-${anime.id}`}
        title={title}
        coverImage={anime.coverImage.extraLarge || anime.coverImage.large || anime.bannerImage || ''}
        url={`/anime/${anime.id}?ep=${ep}`}
        episode={ep}
        mediaType="anime"
      />

      {/* Banner Backdrop */}
      <div className="relative h-[35vh] w-full overflow-hidden">
        {anime.bannerImage ? (
          <>
            <img src={anime.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[4px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `linear-gradient(135deg, ${anime.coverImage.color || '#8B5CF6'}40, #0a0a0f)` }}
          />
        )}
        <div className="absolute inset-0 bg-[#0a0a0f]/40" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 -mt-48 pt-16 relative z-10 pb-20">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Dynamic Grid: Player + Sidebar Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* Main Column: Player & Episode list */}
          <div className="space-y-6">
            
            {/* Title above player on mobile */}
            <div className="lg:hidden mb-4">
              <h1 className="text-2xl md:text-3xl font-black mb-1">{title}</h1>
              <p className="text-xs text-[#8B5CF6] font-extrabold">Episode {ep} of {totalEpisodes}</p>
            </div>

            {/* Episode Prev/Next Navigation */}
            <div className="flex items-center justify-between">
              <Link
                href={ep > 1 ? `/anime/${anime.id}?ep=${ep - 1}` : '#'}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  ep > 1
                    ? 'bg-white/[0.04] border-white/[0.08] text-[#999] hover:text-white hover:border-[#8B5CF6]/40'
                    : 'bg-white/[0.02] border-white/[0.03] text-[#444] cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Prev Episode
              </Link>
              <span className="text-xs font-black text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-4 py-2 rounded-xl">
                Episode {ep} / {totalEpisodes}
              </span>
              <Link
                href={ep < totalEpisodes ? `/anime/${anime.id}?ep=${ep + 1}` : '#'}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  ep < totalEpisodes
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 border-[#8B5CF6]/20 text-[#A78BFA] hover:text-white hover:border-[#8B5CF6]/50'
                    : 'bg-white/[0.02] border-white/[0.03] text-[#444] cursor-not-allowed'
                }`}
              >
                Next Episode <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Embedded MultiServerPlayer */}
            <MultiServerPlayer servers={servers} title={title} />

            {/* Episode & Season Grid Selector */}
            <div className="bg-[#111118] border border-white/[0.06] p-6 rounded-[24px] space-y-6">
              
              {/* Seasons Switcher */}
              {anime.relations?.nodes && anime.relations.nodes.filter((rel: any) => rel.format === 'TV' || rel.format === 'MOVIE' || rel.format === 'OVA' || rel.format === 'ONA').length > 0 && (
                <div>
                  <span className="text-[10px] text-[#555] font-black uppercase tracking-widest block mb-3">Seasons & Movies</span>
                  <div className="flex flex-wrap gap-2">
                    {/* Current Season */}
                    <div className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-[#8B5CF6]/50">
                      {getShortTitle(title)} (Current)
                    </div>
                    
                    {/* Other Related Seasons */}
                    {anime.relations.nodes
                      .filter((rel: any) => rel.format === 'TV' || rel.format === 'MOVIE' || rel.format === 'OVA' || rel.format === 'ONA')
                      .map((rel: any) => {
                        const relTitle = getTitle(rel);
                        return (
                          <Link
                            key={rel.id}
                            href={`/anime/${rel.id}`}
                            className="px-4 py-2 rounded-xl text-xs font-black bg-white/[0.04] text-[#999] hover:text-white border border-white/[0.06] hover:bg-white/[0.08] transition-all"
                            title={relTitle}
                          >
                            {getShortTitle(relTitle)}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Divider if Seasons Switcher is present */}
              {anime.relations?.nodes && anime.relations.nodes.filter((rel: any) => rel.format === 'TV' || rel.format === 'MOVIE' || rel.format === 'OVA' || rel.format === 'ONA').length > 0 && (
                <div className="border-t border-white/[0.04]" />
              )}

              {/* Episode Grid Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Tv2 className="w-5 h-5 text-[#8B5CF6]" />
                    Select Episode
                  </h3>
                  <span className="text-xs text-[#777] font-semibold">Total: {totalEpisodes} episodes</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((episodeNum) => (
                    <Link
                      key={episodeNum}
                      href={`/anime/${anime.id}?ep=${episodeNum}`}
                      className={`py-2.5 text-center text-xs font-black rounded-xl border transition-all duration-300 ${
                        ep === episodeNum
                          ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)] scale-95'
                          : 'bg-[#0e0e14] border-white/[0.04] text-[#999] hover:text-white hover:border-[#8B5CF6]/30'
                      }`}
                    >
                      {episodeNum}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Synopsis / Info */}
            <div className="bg-[#111118] border border-white/[0.06] p-6 rounded-[24px] space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-[#8B5CF6]" />
                Synopsis
              </h3>
              {anime.description ? (
                <p className="text-sm text-[#B3B3B3] leading-relaxed">
                  {anime.description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')}
                </p>
              ) : (
                <p className="text-sm text-[#555] italic">No description available.</p>
              )}
            </div>

          </div>

          {/* Sidebar Column: Cover image + Details */}
          <div className="space-y-6">
            
            {/* Desktop Title */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-black leading-tight mb-2">{title}</h1>
              {anime.title.romaji !== title && (
                <p className="text-sm text-[#555] font-semibold mb-3">{anime.title.romaji}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                {anime.averageScore && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC107]/10 border border-[#FFC107]/20 rounded-xl">
                    <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                    <span className="text-white font-black text-sm">{(anime.averageScore / 10).toFixed(1)}</span>
                    <span className="text-[#777] text-xs">/10</span>
                  </div>
                )}
                {anime.nextAiringEpisode && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E676]/10 border border-[#00E676]/20 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                    <span className="text-[#00E676] font-bold text-xs">Ep {anime.nextAiringEpisode.episode} Airing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image & Metadata */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] p-6 space-y-6">
              <div className="rounded-[18px] overflow-hidden border border-white/[0.08] shadow-2xl">
                <img src={anime.coverImage.extraLarge || anime.coverImage.large} alt={title} className="w-full object-cover h-[350px]" />
              </div>

              {/* Stats Grid */}
              <div className="space-y-3 pt-4 border-t border-white/[0.04]">
                {[
                  { label: 'Status', value: anime.status.replace(/_/g, ' ') },
                  { label: 'Format', value: anime.format || 'TV' },
                  { label: 'Episodes', value: anime.episodes ? `${anime.episodes} eps` : '?' },
                  { label: 'Season', value: anime.seasonYear ? `${anime.season} ${anime.seasonYear}` : 'Unknown' },
                  { label: 'Studio', value: anime.studios.nodes[0]?.name || 'Unknown' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs py-1 border-b border-white/[0.02]">
                    <span className="text-[#555] font-black uppercase tracking-wider">{label}</span>
                    <span className="text-white font-bold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Genres */}
              <div className="space-y-2">
                <span className="text-xs text-[#555] font-black uppercase tracking-wider block">Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {anime.genres.map(g => (
                    <Link
                      key={g}
                      href={`/browse?genre=${encodeURIComponent(g)}`}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA] hover:bg-[#8B5CF6]/20 transition-colors"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {anime.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-[#555] font-black uppercase tracking-wider block">Popular Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {anime.tags.slice(0, 8).map(tag => (
                      <span key={tag.name} className="text-[9px] px-2 py-0.5 bg-white/[0.03] border border-white/[0.04] text-[#666] rounded-md font-semibold">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Characters & Recommendations */}
        <div className="mt-12 space-y-12 border-t border-white/[0.06] pt-12">
          
          {/* Characters */}
          {anime.characters.nodes.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                Characters
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {anime.characters.nodes.slice(0, 8).map(char => (
                  <div key={char.id} className="text-center group">
                    <div className="w-full aspect-square rounded-[18px] overflow-hidden border border-white/[0.08] mb-2 group-hover:border-[#8B5CF6]/30 transition-all duration-300">
                      <img src={char.image.large} alt={char.name.full} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-[10px] text-[#999] group-hover:text-white font-bold line-clamp-2 leading-tight transition-colors">{char.name.full}</p>
                    <p className="text-[8px] text-[#555] font-semibold mt-0.5">{char.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {anime.recommendations.nodes.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#EC4899]" />
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
                {anime.recommendations.nodes.slice(0, 6).map(({ mediaRecommendation }) =>
                  mediaRecommendation ? (
                    <AnimeCard key={mediaRecommendation.id} anime={mediaRecommendation} />
                  ) : null
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
