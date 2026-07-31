'use client';
import Link from 'next/link';
import { Star, Play, Clock, Film, Tv } from 'lucide-react';
import { Movie } from '@/services/movies/tmdb';

export default function MovieCard({ movie }: { movie: Movie }) {
  const isSeries = movie.mediaType === 'series';

  return (
    <Link
      href={`/watch/movie/${movie.id}`}
      className="group block relative rounded-2xl overflow-hidden bg-[#111118] border border-white/[0.06] hover:border-[#8B5CF6]/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all duration-300 hover:-translate-y-2"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] w-full relative overflow-hidden bg-[#0c0c14]">
        {movie.coverImage ? (
          <img
            src={movie.coverImage}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#2a2a3a] bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e]">
            <Film className="w-10 h-10 opacity-30" />
            <span className="text-[10px] font-bold text-[#333] px-2 text-center line-clamp-2">{movie.title}</span>
          </div>
        )}

        {/* Gradient Overlay (always visible at bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-70" />

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.7)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-10">
          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide border backdrop-blur-sm ${
            isSeries
              ? 'bg-[#EC4899]/80 border-[#EC4899]/30 text-white'
              : 'bg-[#8B5CF6]/80 border-[#8B5CF6]/30 text-white'
          }`}>
            {isSeries ? <span className="flex items-center gap-1"><Tv className="w-2.5 h-2.5" /> Series</span> : <span className="flex items-center gap-1"><Film className="w-2.5 h-2.5" /> Movie</span>}
          </span>
          {movie.rating > 0 && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 text-[9px] font-black text-[#FFC107]">
              <Star className="w-2.5 h-2.5 fill-[#FFC107]" />
              {movie.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Bottom year badge */}
        {movie.year && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-md text-[9px] font-bold text-white/70 border border-white/10">
              {movie.year}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1 bg-gradient-to-b from-[#111118] to-[#0f0f16]">
        <h3 className="text-xs font-black text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors leading-tight">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-[#555]">
          {movie.runtime && movie.runtime !== 'N/A' && (
            <span className="flex items-center gap-1 text-[#666]">
              <Clock className="w-2.5 h-2.5 text-[#8B5CF6]" />
              {movie.runtime}
            </span>
          )}
          {movie.genres && movie.genres[0] && (
            <span className="text-[#444] truncate">{movie.genres[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
