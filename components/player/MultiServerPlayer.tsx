'use client';

import { useState, useEffect } from 'react';
import { X, Clapperboard, Server, Sparkles, Check, Play, Globe } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';

export interface ServerConfig {
  name: string;
  url: string;
  icon: string; // Flag code: 'IN' | 'US' | 'GB' | 'JP' | 'FR' | 'ES' | 'DE' | 'IT' | 'BR' | 'RU' | 'SA' | 'TR' | 'TH' | 'PL' | 'PT'
  lang?: string;
}

interface MultiServerPlayerProps {
  servers: ServerConfig[];
  title?: string;
}

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [activeServer, setActiveServer] = useState<ServerConfig | null>(servers[0] || null);
  const [currentUrl, setCurrentUrl]     = useState<string | null>(servers[0]?.url || null);
  const [selectedLang, setSelectedLang] = useState<string>('ALL');
  const [modalOpen, setModalOpen]       = useState(false);
  const [theaterMode, setTheaterMode]   = useState(false);

  // Sync if servers prop changes
  useEffect(() => {
    if (servers.length > 0 && !activeServer) {
      setActiveServer(servers[0]);
      setCurrentUrl(servers[0].url);
    }
  }, [servers, activeServer]);

  // Handle manual server change
  const handleSelectServer = (srv: ServerConfig) => {
    setActiveServer(srv);
    setCurrentUrl(srv.url);
    setModalOpen(false);
  };

  // Keyboard shortcut for theater mode & Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 't' || e.key === 'T') setTheaterMode(p => !p);
      if (e.key === 'Escape') { setTheaterMode(false); setModalOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered servers by selected language tab
  const filteredServers = selectedLang === 'ALL'
    ? servers
    : servers.filter(s => (s.lang || 'EN') === selectedLang);

  // Available language tabs with country flags
  const langTabs = [
    { code: 'ALL', name: 'All Servers', icon: 'GLOBE' },
    { code: 'HI',  name: 'Hindi Dub',  icon: 'IN' },
    { code: 'SUB', name: 'Jap Sub',    icon: 'JP' },
    { code: 'DUB', name: 'Eng Dub',    icon: 'US' },
    { code: 'EN',  name: 'English',    icon: 'GB' },
    { code: 'TA',  name: 'Tamil',      icon: 'IN' },
    { code: 'TE',  name: 'Telugu',     icon: 'IN' },
    { code: 'FR',  name: 'French',     icon: 'FR' },
    { code: 'ES',  name: 'Spanish',    icon: 'ES' },
    { code: 'DE',  name: 'German',     icon: 'DE' },
    { code: 'IT',  name: 'Italian',    icon: 'IT' },
    { code: 'AR',  name: 'Arab',       icon: 'SA' },
    { code: 'BR',  name: 'Brazil',     icon: 'BR' },
    { code: 'RU',  name: 'Russian',    icon: 'RU' },
    { code: 'TR',  name: 'Turkish',    icon: 'TR' },
  ];

  return (
    <div className={`w-full ${theaterMode ? 'relative z-50' : ''}`}>

      {/* Theater overlay */}
      {theaterMode && (
        <>
          <div onClick={() => setTheaterMode(false)} className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md cursor-pointer" />
          <div className="fixed top-5 right-6 z-[60]">
            <button
              onClick={() => setTheaterMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5252] to-[#EF4444] text-white text-xs font-black rounded-xl shadow-[0_0_25px_rgba(255,82,82,0.7)] hover:scale-105 transition-all border border-white/20"
            >
              <X className="w-4 h-4" /> Exit Theater (Esc)
            </button>
          </div>
        </>
      )}

      {/* Alert banner */}
      <div className="w-full bg-[#EF4444] text-white text-xs font-black px-4 py-2 flex items-center justify-between shadow-md">
        <span>🔔 If default server doesn&apos;t work, click any flag/server below to change instantly.</span>
        <button onClick={() => setModalOpen(true)} className="underline hover:opacity-80 font-black">All Servers ({servers.length})</button>
      </div>

      {/* ── Main Player Frame ─────────────────────────────────────────────────── */}
      <div className={`relative bg-[#08080f] overflow-hidden ${
        theaterMode
          ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[28px]'
          : 'aspect-video w-full max-h-[520px] rounded-t-[20px]'
      }`}>

        {/* Currently playing badge */}
        {activeServer && (
          <div className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl text-white text-xs font-bold shadow-lg">
            <CountryFlag code={activeServer.icon} size={16} />
            <span className="text-white/90">Playing on: <strong className="text-[#8B5CF6]">{activeServer.name}</strong></span>
          </div>
        )}

        {/* Theater mode toggle button */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={() => setTheaterMode(t => !t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
              theaterMode
                ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent'
                : 'bg-black/70 backdrop-blur-md border-white/10 text-white/80 hover:text-white'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>{theaterMode ? 'Exit Theater' : 'Theater Mode'}</span>
          </button>
        </div>

        {/* ── Video iframe ──────────────────────────────────────────────────── */}
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

      {/* ── SERVER SELECTION SYSTEM BELOW VIDEO PLAYER ───────────────────────── */}
      <div className="w-full bg-[#0a0a12] border-x border-b border-white/10 rounded-b-[20px] p-4 sm:p-5 flex flex-col gap-4">

        {/* Row 1: Language / Country Flag Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {langTabs.map((tab) => {
            const isSelected = selectedLang === tab.code;
            return (
              <button
                key={tab.code}
                onClick={() => setSelectedLang(tab.code)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-105'
                    : 'bg-white/[0.04] border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon === 'GLOBE' ? (
                  <Globe className="w-3.5 h-3.5 text-[#F59E0B]" />
                ) : (
                  <CountryFlag code={tab.icon} size={16} />
                )}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Grid of Servers for Selected Flag / Language */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Available Servers ({filteredServers.length}):</span>
            </span>
            <button
              onClick={() => setModalOpen(true)}
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-xs font-black underline flex items-center gap-1"
            >
              <span>View All ({servers.length})</span>
            </button>
          </div>

          {/* Server Cards Grid */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto custom-scrollbar p-1">
            {filteredServers.map((srv, idx) => {
              const isPlaying = activeServer?.url === srv.url;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectServer(srv)}
                  className={`group relative flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-black transition-all hover:scale-105 active:scale-95 ${
                    isPlaying
                      ? 'bg-gradient-to-r from-[#4F46E5]/40 to-[#8B5CF6]/40 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      : 'bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <CountryFlag code={srv.icon} size={20} />
                  <span className="truncate max-w-[85px] leading-none">{srv.name}</span>

                  {isPlaying && (
                    <div className="ml-auto w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[8px] font-black shadow-sm">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── ALL SERVERS MODAL ───────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
          
          <div
            className="relative w-full max-w-3xl bg-[#0d0d14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-white font-black text-sm sm:text-base">Select Server ({servers.length} Available)</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Country Flag Cards */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-3">
                {servers.map((srv, idx) => {
                  const isPlaying = activeServer?.url === srv.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectServer(srv)}
                      className={`group relative flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                        isPlaying
                          ? 'bg-[#4F46E5]/30 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.5)] text-white'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/80 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <CountryFlag code={srv.icon} size={32} />
                      <span className="text-xs font-black leading-tight text-center truncate max-w-full">
                        {srv.name}
                      </span>
                      {isPlaying && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[9px] font-black shadow-md">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
