'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Play, Star, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTitle, AnimeMedia } from '@/services/anime/anilist';

interface HeroCarouselProps {
  animes: AnimeMedia[];
}

export default function HeroCarousel({ animes }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, 7000); // Change slide every 7 seconds
  }, [animes.length]);

  const resetAutoplay = useCallback(() => {
    startAutoplay();
  }, [startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
    resetAutoplay();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
    resetAutoplay();
  };

  if (!animes || animes.length === 0) return null;

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0a0a0f] group select-none">
      
      {/* Background Slides (Full screen anime pictures) */}
      <div className="absolute inset-0 z-0">
        {animes.map((anime, idx) => {
          const banner = anime.bannerImage;
          const cover = anime.coverImage.extraLarge || anime.coverImage.large;
          const accentColor = anime.coverImage.color || '#8B5CF6';
          const isActive = idx === currentIndex;
          
          return (
            <div
              key={anime.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              {banner ? (
                // Full screen landscape banner image (Very Clear & Bright)
                <img
                  src={banner}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-65 lg:opacity-80"
                />
              ) : (
                // Full screen cover poster image (No Blur, High Opacity, Centered)
                <img
                  src={cover}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-55 lg:opacity-70"
                />
              )}
            </div>
          );
        })}
        
        {/* Lighter Cinematic Overlays: Text remains 100% readable while the right 60% of the image is completely clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/45 to-transparent z-1" />
      </div>

      {/* Slide Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-32 pb-24 w-full">
        <div className="relative min-h-[380px] flex items-center">
          {animes.map((anime, idx) => {
            const title = getTitle(anime);
            const isActive = idx === currentIndex;
            
            return (
              <div
                key={anime.id}
                className={`max-w-3xl w-full transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 translate-x-0 pointer-events-auto relative z-10'
                    : 'opacity-0 translate-x-12 pointer-events-none absolute inset-x-0'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3.5 py-1 bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-full text-xs font-black text-[#A78BFA] uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" />
                    #{idx + 1} Trending
                  </span>
                  {anime.status === 'RELEASING' && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-[#00E676]/15 border border-[#00E676]/30 rounded-full text-xs font-black text-[#00E676]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                      AIRING
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  {title}
                </h1>

                {/* Meta Stats */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-6 text-sm text-[#eee] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {anime.averageScore && (
                    <span className="flex items-center gap-1 text-[#FFC107]">
                      <Star className="w-4 h-4 fill-[#FFC107]" />
                      {(anime.averageScore / 10).toFixed(1)} <span className="text-white/60 text-xs">/ 10</span>
                    </span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:block" />
                  <span>{anime.episodes ? `${anime.episodes} Episodes` : 'Ongoing'}</span>
                  {anime.studios.nodes[0] && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:block" />
                      <span>{anime.studios.nodes[0].name}</span>
                    </>
                  )}
                  {anime.seasonYear && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:block" />
                      <span>{anime.season} {anime.seasonYear}</span>
                    </>
                  )}
                </div>

                {/* Description */}
                {anime.description && (
                  <p className="text-sm text-[#ccc] line-clamp-3 mb-8 leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {anime.description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')}
                  </p>
                )}

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {anime.genres.slice(0, 4).map((g) => (
                    <Link
                      key={g}
                      href={`/browse?genre=${encodeURIComponent(g)}`}
                      className="px-3.5 py-1 text-xs font-bold rounded-xl bg-black/40 hover:bg-[#8B5CF6]/20 text-white border border-white/10 hover:border-[#8B5CF6]/50 transition-colors"
                    >
                      {g}
                    </Link>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/anime/${anime.id}`}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-black rounded-2xl text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-102 transition-all duration-300"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Now
                  </Link>
                  <Link
                    href={`/anime/${anime.id}`}
                    className="flex items-center gap-2 px-8 py-4 bg-white/[0.06] backdrop-blur text-white font-bold rounded-2xl text-sm border border-white/[0.1] hover:bg-white/[0.1] transition-all duration-300"
                  >
                    More Info
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {animes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              resetAutoplay();
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-8 bg-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
