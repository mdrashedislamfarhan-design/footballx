'use client';

import { useState, useEffect, useRef } from 'react';
import { Server, Maximize, Minimize, Zap, ShieldCheck } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef                       = useRef<HTMLDivElement>(null);

  // Sync if servers prop changes
  useEffect(() => {
    if (servers.length > 0 && !activeServer) {
      setActiveServer(servers[0]);
      setCurrentUrl(servers[0].url);
    }
  }, [servers, activeServer]);

  // Track Fullscreen state changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Handle manual server selection
  const handleSelectServer = (srv: ServerConfig) => {
    setActiveServer(srv);
    setCurrentUrl(srv.url);
  };

  // Force true Fullscreen on player container
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } else {
      const elem = playerRef.current as any;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full space-y-3">

      {/* ── Main Video Player Frame (Standard 16:9) ─────────────────────────── */}
      <div
        ref={playerRef}
        className={`relative bg-[#08080f] w-full rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden group/player ${
          isFullscreen ? 'fixed inset-0 z-[99999] rounded-none border-none' : 'aspect-video'
        }`}
      >
        {/* Video iframe */}
        {currentUrl ? (
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen
            // @ts-ignore
            allowfullscreen="true"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; web-share *; accelerometer *; gyroscope *"
            referrerPolicy="origin"
            scrolling="no"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm font-bold">
            Select a server below to start streaming
          </div>
        )}

        {/* Custom Fullscreen Floating Action Button (Top Right) */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-40 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-[#8B5CF6] text-white text-xs font-black backdrop-blur-md border border-white/20 shadow-xl opacity-80 hover:opacity-100 transition-all flex items-center gap-1.5 active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Native Fullscreen'}
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-3.5 h-3.5" />
              <span>Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Fullscreen</span>
            </>
          )}
        </button>
      </div>

      {/* ── PLAYER TOOLBAR & SPEED HINT ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5 text-white/60 font-semibold">
          <Zap className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
          <span>If video buffers or spins, switch to <strong className="text-white">Server 1</strong> or <strong className="text-white">Server 3</strong></span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#A78BFA] font-bold transition-colors ml-auto"
        >
          <Maximize className="w-3 h-3" /> Fullscreen Mode
        </button>
      </div>

      {/* ── SIMPLE & CLEAN WORKING SERVERS LIST BELOW PLAYER ────────────────── */}
      <div className="bg-[#111118] border border-white/[0.06] p-4 sm:p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Select Working Server:</h3>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            100% Working Links
          </span>
        </div>

        {/* Grid of Working Servers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {servers.map((srv, idx) => {
            const isPlaying = activeServer?.name === srv.name;
            const langColor =
              srv.lang === 'SUB'   ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
              srv.lang === 'DUB'   ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              srv.lang === 'HINDI' || srv.lang === 'MULTI' ? 'bg-amber-500/25 text-amber-300 border-amber-500/40 font-black' :
                                     'bg-white/10 text-white/50 border-white/10';
            return (
              <button
                key={idx}
                onClick={() => handleSelectServer(srv)}
                className={`flex flex-col gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 text-left ${
                  isPlaying
                    ? 'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] border-transparent text-white shadow-[0_0_18px_rgba(139,92,246,0.5)]'
                    : 'bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.07] hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CountryFlag code={srv.icon} size={16} />
                    <span className="font-extrabold">{srv.name}</span>
                  </div>
                  {isPlaying && (
                    <div className="w-4 h-4 rounded-full bg-white text-[#8B5CF6] flex items-center justify-center text-[9px] font-black shrink-0">✓</div>
                  )}
                </div>
                {srv.lang && (
                  <span className={`self-start text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                    isPlaying ? 'bg-white/20 text-white border-white/30' : langColor
                  }`}>
                    {srv.lang}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
