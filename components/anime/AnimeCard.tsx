import Link from 'next/link';
import Image from 'next/image';
import { AnimeMedia, getTitle } from '@/services/anime/anilist';
import { Star, Play, Clock } from 'lucide-react';

interface AnimeCardProps {
  anime: AnimeMedia;
  rank?: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  RELEASING: { label: 'Airing', color: '#00E676' },
  FINISHED: { label: 'Finished', color: '#8B5CF6' },
  NOT_YET_RELEASED: { label: 'Upcoming', color: '#FFC107' },
  CANCELLED: { label: 'Cancelled', color: '#F44336' },
  HIATUS: { label: 'Hiatus', color: '#FF9800' },
};

export default function AnimeCard({ anime, rank }: AnimeCardProps) {
  const title = getTitle(anime);
  const status = STATUS_LABELS[anime.status] || { label: anime.status, color: '#777' };
  const accentColor = anime.coverImage.color || '#8B5CF6';

  return (
    <Link href={`/anime/${anime.id}`} className="group block">
      <div className="relative rounded-[18px] overflow-hidden bg-[#111118] border border-white/[0.06] hover:border-[#8B5CF6]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {anime.coverImage.large ? (
            <img
              src={anime.coverImage.large}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 flex items-center justify-center">
              <span className="text-4xl">🎌</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

          {/* Rank badge */}
          {rank && (
            <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-xs font-black shadow-lg">
              #{rank}
            </div>
          )}

          {/* Status badge */}
          <div
            className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black text-black"
            style={{ backgroundColor: status.color }}
          >
            {status.label}
          </div>

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Score */}
          {anime.averageScore && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 text-[#FFC107] fill-[#FFC107]" />
              <span className="text-white text-[10px] font-bold">{(anime.averageScore / 10).toFixed(1)}</span>
            </div>
          )}

          {/* Episodes */}
          {anime.episodes && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Clock className="w-2.5 h-2.5 text-[#8B5CF6]" />
              <span className="text-white text-[10px] font-bold">{anime.episodes} ep</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-2 group-hover:text-[#A78BFA] transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map(g => (
              <span key={g} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#888] font-semibold border border-white/[0.06]">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
