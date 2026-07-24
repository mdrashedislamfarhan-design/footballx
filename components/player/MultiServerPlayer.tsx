'use client';

import { useState, useEffect } from 'react';
import { Clapperboard, Server, X } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';

export interface ServerConfig {
  name: string;
  url: string;
  icon: string;
  lang?: string;
}

interface MultiServerPlayerProps {
  servers: ServerConfig[];
  title?: string;
}

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [activeServer, setActiveServer] = useState<ServerConfig | null>(servers[0] || null);
  const [currentUrl, setCurrentUrl]     = useState<string | null>(servers[0]?.url || null);
  const [theaterMode, setTheaterMode]   = useState(false);

  // Sync if servers prop changes
  useEffect(() => {
    if (servers.length > 0 && !activeServer) {
      setActiveServer(servers[0]);
      setCurrentUrl(servers[0].url);
    }
  }, [servers, activeServer]);

  // Handle manual server selection
  const handleSelectServer = (srv: ServerConfig) => {
    setActiveServer(srv);
    setCurrentUrl(srv.url);
  };

  // Keyboard shortcut for theater mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 't' || e.key === 'T') setTheaterMode(p => !p);
      if (e.key === 'Escape') setTheaterMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`w-full space-y-4 ${theaterMode ? 'relative z-50' : ''}`}>

      {/* Theater Overlay */}
      {theaterMode && (
        <>
          <div onClick={() => setTheaterMode(false)} className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md cursor-pointer" />
          <div className="fixed top-5 right-6 z-[60]">
            <button
              onClick={() => setTheaterMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF5252] text-white text-xs font-black rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <X className="w-4 h-4" /> Exit Theater (Esc)
            </button>
          </div>
        </>
      )}

      {/* ── Main Video Player Frame (Standard 16:9) ─────────────────────────── */}
      <div className={`relative bg-[#08080f] overflow-hidden ${
        theaterMode
          ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[28px]'
          : 'aspect-video w-full rounded-2xl border border-white/[0.08] shadow-2xl'
      }`}>

        {/* Top Badges Overlay */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
          {/* Active Server Badge */}
          {activeServer && (
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl text-white text-xs font-bold shadow-md">
              <CountryFlag code={activeServer.icon} size={16} />
              <span className="text-white/90">Playing on: <strong className="text-[#8B5CF6]">{activeServer.name}</strong></span>
            </div>
          )}

          {/* Theater Mode Button */}
          <button
            onClick={() => setTheaterMode(t => !t)}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-black/75 backdrop-blur-md border border-white/10 text-white/80 hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>{theaterMode ? 'Exit' : 'Theater'}</span>
          </button>
        </div>

        {/* Video iframe */}
        {currentUrl ? (
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm font-bold">
            Select a server below to start streaming
          </div>
        )}
      </div>

      {/* ── SIMPLE & CLEAN WORKING SERVERS LIST BELOW PLAYER ────────────────── */}
      <div className="bg-[#111118] border border-white/[0.06] p-4 sm:p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#8B5CF6]" />
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Select Working Server:</h3>
        </div>

        {/* Grid of Working Servers (3-4 Columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {servers.map((srv, idx) => {
            const isPlaying = activeServer?.name === srv.name;
            return (
              <button
                key={idx}
                onClick={() => handleSelectServer(srv)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] border-transparent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <CountryFlag code={srv.icon} size={18} />
                  <span className="truncate max-w-[90px]">{srv.name}</span>
                </div>

                {isPlaying && (
                  <div className="w-4 h-4 rounded-full bg-white text-[#8B5CF6] flex items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
