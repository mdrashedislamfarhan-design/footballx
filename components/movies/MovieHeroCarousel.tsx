'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Play, Star, Film, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Movie } from '@/services/movies/tmdb';

interface MovieHeroCarouselProps {
  movies: Movie[];
}

export default function MovieHeroCarousel({ movies }: MovieHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 7000);
  }, [movies.length]);

  useEffect(() => {
    startAutoplay();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAutoplay]);

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    startAutoplay();
  };
  const nextSlide = () => goTo((currentIndex + 1) % movies.length);
  const prevSlide = () => goTo((currentIndex - 1 + movies.length) % movies.length);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0a0a0f] group select-none">

      {/* Background Slides */}
      <div className="absolute inset-0 z-0">
        {movies.map((movie, idx) => {
          const isActive = idx === currentIndex;
          const bg = movie.bannerImage || movie.coverImage;
          return (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              {bg && (
                <img
                  src={bg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60 lg:opacity-75"
                />
              )}
            </div>
          );
        })}

        {/* Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent z-[1]" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-32 pb-24 w-full">
        <div className="relative min-h-[380px] flex items-center">
          {movies.map((movie, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={movie.id}
                className={`max-w-3xl w-full transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 translate-x-0 pointer-events-auto relative z-10'
                    : 'opacity-0 translate-x-12 pointer-events-none absolute inset-x-0'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3.5 py-1 bg-[#F59E0B]/20 border border-[#F59E0B]/40 rounded-full text-xs font-black text-[#FCD34D] uppercase tracking-wider">
                    <Film className="w-3.5 h-3.5" />
                    {movie.type === 'bollywood' ? '🌟 Bollywood' : '🎥 Hollywood'}
                  </span>
                  {movie.year && (
                    <span className="px-3 py-1 bg-white/[0.08] border border-white/[0.1] rounded-full text-xs font-bold text-white/70">
                      {movie.year}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  {movie.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-6 text-sm text-[#eee] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {movie.rating > 0 && (
                    <span className="flex items-center gap-1 text-[#FFC107]">
                      <Star className="w-4 h-4 fill-[#FFC107]" />
                      {movie.rating.toFixed(1)} <span className="text-white/60 text-xs">/ 10</span>
                    </span>
                  )}
                  {movie.runtime && movie.runtime !== 'N/A' && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:block" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-white/60" />
                        {movie.runtime}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {movie.description && (
                  <p className="text-sm text-[#ccc] line-clamp-3 mb-8 leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {movie.description}
                  </p>
                )}

                {/* Genres */}
                {movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {movie.genres.slice(0, 4).map((g) => (
                      <span
                        key={g}
                        className="px-3.5 py-1 text-xs font-bold rounded-xl bg-black/40 text-white border border-white/10"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/watch/movie/${movie.id}`}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white font-black rounded-2xl text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Now
                  </Link>
                  <Link
                    href={`/watch/movie/${movie.id}`}
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

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-8 bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
