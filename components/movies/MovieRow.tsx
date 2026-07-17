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
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.75
        : scrollLeft + clientWidth * 0.75;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-3 group/row relative">
      <h2 className="text-lg md:text-xl font-extrabold text-white px-4 md:px-8 lg:px-12 transition-colors duration-200 group-hover/row:text-[#A78BFA]">
        {title}
      </h2>

      <div className="relative px-4 md:px-8 lg:px-12">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-[80%] bg-black/60 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-all rounded-r-2xl border-r border-y border-white/5 shadow-2xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-none pb-4 snap-x scroll-smooth"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-[150px] sm:w-[170px] md:w-[190px] lg:w-[210px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-[80%] bg-black/60 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-all rounded-l-2xl border-l border-y border-white/5 shadow-2xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
