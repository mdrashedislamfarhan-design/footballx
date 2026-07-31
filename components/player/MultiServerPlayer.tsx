'use client';

import { useState, useEffect } from 'react';
import { Server } from 'lucide-react';
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

  return (
    <div className="w-full space-y-4">

      {/* ── Main Video Player Frame (Standard 16:9) ─────────────────────────── */}
      <div className="relative bg-[#08080f] overflow-hidden aspect-video w-full rounded-2xl border border-white/[0.08] shadow-2xl">


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

        {/* Grid of Working Servers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {servers.map((srv, idx) => {
            const isPlaying = activeServer?.name === srv.name;
            const langColor =
              srv.lang === 'SUB'   ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' :
              srv.lang === 'DUB'   ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              srv.lang === 'MULTI' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
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
