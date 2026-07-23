'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContinueWatchingList, removeWatchItem, ContinueWatchingItem } from '@/lib/watchHistory';
import { Play, X, Clock, Tv, Film, Sparkles } from 'lucide-react';

export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadItems = () => {
    const list = getContinueWatchingList();
    setItems(list);
  };

  useEffect(() => {
    setMounted(true);
    loadItems();

    const handleUpdate = () => loadItems();
    window.addEventListener('anistream_history_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('anistream_history_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
          <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
          Continue Watching
        </h2>
        <span className="text-xs font-bold text-[#888]">
          {items.length} {items.length === 1 ? 'item' : 'items'} in progress
        </span>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-[20px] overflow-hidden bg-[#111118] border border-white/[0.08] hover:border-[#8B5CF6]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeWatchItem(item.id);
              }}
              className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-black/70 hover:bg-[#FF5252] text-white/70 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove from history"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Poster & Link */}
            <Link href={item.url} className="block">
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-[#0c0c12]">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#333]">
                    <Film className="w-8 h-8 opacity-40" />
                  </div>
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Badge for Episode/Season */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md text-[9px] font-black text-white border border-white/10 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-[#8B5CF6]" />
                  {item.episode ? `Ep ${item.episode}` : 'Resume'}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <h3 className="text-xs font-black text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] text-[#666] font-bold flex items-center justify-between">
                  <span>{item.mediaType === 'anime' ? '🎌 Anime' : '🎬 Movie'}</span>
                  <span className="text-[#8B5CF6]">Resume →</span>
                </p>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-white/[0.06]">
                <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] w-[65%]" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
