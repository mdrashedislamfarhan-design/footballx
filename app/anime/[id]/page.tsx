import { fetchAnimeDetail, fetchTopRated, getTitle, GENRES } from '@/services/anime/anilist';
import AnimeCard from '@/components/anime/AnimeCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, Play, Calendar, ChevronLeft, Tv2, Info, Sparkles, HelpCircle } from 'lucide-react';

export const revalidate = 600;

export default async function AnimeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string; server?: string; lang?: string }>;
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
  const server = resolvedSearchParams.server || 'animeplay-ani'; // Default to AnimePlay (Server 1)
  const lang = resolvedSearchParams.lang || 'sub'; // Default to SUB
  const title = getTitle(anime);

  // Generate embed URL
  let embedUrl = '';
  const streamId = anime.idMal || anime.id;

  if (server === 'animeplay-ani') {
    embedUrl = `https://animeplay.cfd/stream/ani/${anime.id}/${ep}/${lang}`;
  } else if (server === 'animeplay-mal') {
    embedUrl = `https://animeplay.cfd/stream/mal/${streamId}/${ep}/${lang}`;
  } else if (server === 'vidsrc-to') {
    embedUrl = `https://vidsrc.to/embed/anime/${streamId}/${ep}`;
  } else if (server === 'vidsrc-me') {
    embedUrl = `https://vidsrc.me/embed/anime/${streamId}/${ep}`;
  } else if (server === 'animeplay-backup') {
    embedUrl = `https://animeplay.cfd/stream/ani/${anime.id}/${ep}/${lang === 'hindi' ? 'dub' : lang}`;
  } else {
    // Default fallback to Server 1
    embedUrl = `https://animeplay.cfd/stream/ani/${anime.id}/${ep}/${lang}`;
  }

  const totalEpisodes = Math.max(
    anime.episodes || 0,
    anime.nextAiringEpisode?.episode ? anime.nextAiringEpisode.episode - 1 : 12
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
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

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 -mt-48 relative z-10 pb-20">
        
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
              <p className="text-xs text-[#8B5CF6] font-extrabold">Episode {ep} of {totalEpisodes} ({lang.toUpperCase()})</p>
            </div>

            {/* Embedded Player */}
            <div className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-[#0c0c12] border border-white/[0.06] shadow-2xl shadow-black/80">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                referrerPolicy="origin"
              />
            </div>

            {/* Server & Language Selectors */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#111118] border border-white/[0.06] p-4 rounded-3xl justify-between items-center">
              
              {/* Server selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#555] font-black uppercase tracking-wider ml-1 mr-1">Server:</span>
                {[
                  { id: 'animeplay-ani', name: 'Server 1 (Direct)', color: 'from-[#8B5CF6] to-[#7C3AED]' },
                  { id: 'animeplay-mal', name: 'Server 2 (MAL)', color: 'from-[#EC4899] to-[#DB2777]' },
                  { id: 'vidsrc-to', name: 'Server 3 (VidsrcTo)', color: 'from-[#10B981] to-[#059669]' },
                  { id: 'vidsrc-me', name: 'Server 4 (VidsrcMe)', color: 'from-[#3B82F6] to-[#2563EB]' },
                  { id: 'animeplay-backup', name: 'Server 5 (Backup)', color: 'from-[#F59E0B] to-[#D97706]' },
                ].map((srv) => (
                  <Link
                    key={srv.id}
                    href={`/anime/${anime.id}?ep=${ep}&server=${srv.id}&lang=${lang === 'hindi' ? 'sub' : lang}`}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      server === srv.id
                        ? `bg-gradient-to-r ${srv.color} text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]`
                        : 'bg-white/[0.04] text-[#999] hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {srv.name}
                  </Link>
                ))}
              </div>

              {/* Language Selector (Sub/Dub) */}
              <div className="flex items-center gap-1.5 bg-[#0e0e14] p-1 rounded-2xl border border-white/[0.04] shrink-0 self-end sm:self-auto">
                {[
                  { id: 'sub', name: 'SUB' },
                  { id: 'dub', name: 'DUB' },
                ].map((language) => (
                  <Link
                    key={language.id}
                    href={`/anime/${anime.id}?ep=${ep}&server=${server}&lang=${language.id}`}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                      lang === language.id
                        ? 'bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                        : 'text-[#999] hover:text-white'
                    }`}
                  >
                    {language.name}
                  </Link>
                ))}
              </div>

            </div>

            {/* Hindi Dub Info Alert */}
            <div className="bg-[#111118] border border-blue-500/20 p-5 rounded-[24px] flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">হিন্দি ডাব (Hindi Dub) দেখতে চান?</h4>
                <p className="text-xs text-[#888] leading-relaxed">
                  ফ্রি এনিমে সার্ভারগুলো (যেমন GogoAnime/HiAnime) হিন্দি ডাব করা এনিমেগুলোকে মূল প্লেয়ারের ভেতর আলাদা অডিও ট্র্যাক হিসেবে রাখে না। এগুলো সম্পূর্ণ আলাদা ফাইল হিসেবে আপলোড করা হয়। 
                  তাই এই প্লেয়ারগুলোতে হিন্দি অডিও ট্র্যাক সরাসরি সিলেক্ট করা সম্ভব নয়।
                </p>
                <p className="text-xs text-[#aaa] font-semibold pt-1">
                  💡 অফিশিয়ালি হিন্দি ডাবড এনিমে দেখতে **Crunchyroll (India)** অথবা ইউটিউবে **Muse India** চ্যানেল ভিজিট করতে পারেন।
                </p>
              </div>
            </div>

            {/* Episode Grid Selector */}
            <div className="bg-[#111118] border border-white/[0.06] p-6 rounded-[24px]">
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
                    href={`/anime/${anime.id}?ep=${episodeNum}&server=${server}&lang=${lang === 'hindi' ? 'sub' : lang}`}
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
