import Link from 'next/link';
import { Star, Play, Clock, Film } from 'lucide-react';
import { Movie } from '@/services/movies/tmdb';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/watch/movie/${movie.id}`} className="group block relative rounded-[20px] overflow-hidden bg-[#111118] border border-white/[0.06] hover:border-[#8B5CF6]/40 transition-all hover:-translate-y-1.5 duration-300">
      {/* Poster Image */}
      <div className="aspect-[2/3] w-full relative overflow-hidden bg-[#0e0e16]">
        {movie.coverImage ? (
          <img
            src={movie.coverImage}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <Film className="w-10 h-10 opacity-40" />
          </div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Floating Media Type Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border backdrop-blur-md z-10 ${
          movie.mediaType === 'series'
            ? 'bg-[#EC4899]/85 border-[#EC4899]/35 text-white'
            : 'bg-[#8B5CF6]/85 border-[#8B5CF6]/35 text-white'
        }`}>
          {movie.mediaType === 'series' ? '📺 Web Series' : '🎬 Movie'}
        </div>

        {/* Floating Rating */}
        {movie.rating && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/75 backdrop-blur-md rounded-lg flex items-center gap-1 border border-white/10 z-10">
            <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
            <span className="text-[10px] font-black text-white">{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-[11px] text-[#555] font-semibold">
          <span>{movie.year}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {movie.runtime}
          </span>
        </div>
      </div>
    </Link>
  );
}
