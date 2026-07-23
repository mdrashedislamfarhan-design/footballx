import Link from 'next/link';
import { Star, Play, Clock, Film, Sparkles } from 'lucide-react';
import { Movie } from '@/services/movies/tmdb';

export default function MovieCard({ movie }: { movie: Movie }) {
  const isSeries = movie.mediaType === 'series';

  return (
    <Link
      href={`/watch/movie/${movie.id}`}
      className="group block relative rounded-[22px] overflow-hidden bg-[#111118] border border-white/[0.08] hover:border-[#8B5CF6]/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1.5"
    >
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

        {/* Hover Overlay with Glowing Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_25px_rgba(139,92,246,0.6)]">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Floating Media Type Badge */}
        <div
          className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border backdrop-blur-md z-10 shadow-lg ${
            isSeries
              ? 'bg-[#EC4899]/85 border-[#EC4899]/40 text-white'
              : 'bg-[#8B5CF6]/85 border-[#8B5CF6]/40 text-white'
          }`}
        >
          {isSeries ? '📺 Series' : '🎬 Movie'}
        </div>

        {/* Floating Rating */}
        {movie.rating > 0 && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-xl flex items-center gap-1 border border-white/10 z-10 shadow-lg">
            <Star className="w-3 h-3 text-[#FFC107] fill-[#FFC107]" />
            <span className="text-[10px] font-black text-white">{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="p-3.5 space-y-1.5 bg-[#111118]">
        <h3 className="text-xs md:text-sm font-black text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-[10px] text-[#666] font-bold">
          <span className="bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/[0.05]">
            {movie.year || 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-[#888]">
            <Clock className="w-3 h-3 text-[#8B5CF6]" />
            {movie.runtime || 'HD'}
          </span>
        </div>
      </div>
    </Link>
  );
}
