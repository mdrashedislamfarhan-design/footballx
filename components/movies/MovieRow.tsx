'use client';
import { useRef } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/services/movies/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-3 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-extrabold text-white group-hover/row:text-[#A78BFA] transition-colors duration-200">
          {title}
        </h2>
        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full bg-white/[0.07] hover:bg-[#8B5CF6]/30 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full bg-white/[0.07] hover:bg-[#8B5CF6]/30 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none rounded-l-xl" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none rounded-r-xl" />

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-[140px] sm:w-[160px] md:w-[175px] lg:w-[190px] shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
