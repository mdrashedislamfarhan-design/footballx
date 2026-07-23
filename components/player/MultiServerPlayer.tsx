'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Wifi,
  ChevronDown,
  ChevronUp,
  Settings2,
  Maximize2,
  Minimize2,
  Clapperboard,
  X,
} from 'lucide-react';

export interface ServerConfig {
  name: string;
  url: string;
  icon: string;
  lang?: string; // 'EN' | 'HI' | 'SUB' | 'DUB'
}

interface MultiServerPlayerProps {
  servers: ServerConfig[];
  title?: string;
}

const langColors: Record<string, string> = {
  HI:  'bg-[#F59E0B] text-black',
  EN:  'bg-[#8B5CF6] text-white',
  SUB: 'bg-[#3B82F6] text-white',
  DUB: 'bg-[#10B981] text-white',
};

const langLabels: Record<string, string> = {
  SUB: '🎌 Sub',
  DUB: '🇺🇸 Dub',
  EN:  '🌎 English',
  HI:  '🇮🇳 Hindi',
};

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [tried, setTried]           = useState<Set<number>>(new Set([0]));
  const [panelOpen, setPanelOpen]   = useState(true);
  const [activeTab, setActiveTab]   = useState<string>('ALL');
  const [theaterMode, setTheaterMode] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef  = useRef<NodeJS.Timeout | null>(null);

  const total   = servers.length;
  const current = servers[currentIdx];

  // Collect unique lang tabs
  const tabs = ['ALL', ...Array.from(new Set(servers.map(s => s.lang || 'EN')))];

  // Filtered servers for active tab
  const filteredServers = activeTab === 'ALL'
    ? servers
    : servers.filter(s => (s.lang || 'EN') === activeTab);

  const goTo = useCallback((idx: number) => {
    const safeIdx = (idx + total) % total;
    setCurrentIdx(safeIdx);
    setLoading(true);
    setErrorCount(0);
    setTried(prev => new Set([...prev, safeIdx]));
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [total]);

  const next = () => goTo(currentIdx + 1);
  const prev = () => goTo(currentIdx - 1);

  // Auto-skip after 12 s if still loading
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (loading && tried.size < total) {
        const nextUntried = servers.findIndex((_, i) => !tried.has(i) && i !== currentIdx);
        if (nextUntried !== -1) goTo(nextUntried);
        else setLoading(false);
      } else {
        setLoading(false);
      }
    }, 12000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIdx, loading]);

  // Keyboard shortcut listener ('t' for Theater Mode, 'Escape' to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 't' || e.key === 'T') {
        setTheaterMode(prev => !prev);
      } else if (e.key === 'Escape' && theaterMode) {
        setTheaterMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theaterMode]);

  const handleLoad  = () => { setLoading(false); if (timerRef.current) clearTimeout(timerRef.current); };
  const handleError = () => {
    setErrorCount(c => c + 1);
    if (errorCount >= 0 && currentIdx < total - 1) setTimeout(() => goTo(currentIdx + 1), 800);
    else setLoading(false);
  };

  return (
    <div className={`w-full space-y-0 ${theaterMode ? 'relative z-50' : ''}`}>
      
      {/* ── Theater Mode Dimmed Overlay & Floating Exit Button ───── */}
      {theaterMode && (
        <>
          <div
            onClick={() => setTheaterMode(false)}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md transition-opacity duration-300 animate-fadeIn cursor-pointer"
            title="Click outside to exit theater mode"
          />
          {/* Always visible Floating Exit Button on Top-Right */}
          <div className="fixed top-5 right-6 z-[60] flex items-center gap-3">
            <button
              onClick={() => setTheaterMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5252] to-[#EF4444] text-white text-xs font-black rounded-xl shadow-[0_0_25px_rgba(255,82,82,0.7)] hover:scale-105 transition-all border border-white/20"
            >
              <X className="w-4 h-4" />
              <span>Exit Theater (Esc)</span>
            </button>
          </div>
        </>
      )}

      {/* ── Player Wrapper (100% Clean Video Frame — ZERO Text Inside Video) ── */}
      <div
        className={`relative transition-all duration-500 ease-in-out bg-[#0c0c12] border border-white/[0.08] shadow-2xl shadow-black/90 ${
          theaterMode
            ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[28px] overflow-hidden'
            : 'aspect-video w-full rounded-t-[24px] overflow-hidden'
        }`}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-sm gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#8B5CF6]/20 border-t-[#8B5CF6] animate-spin" />
              <Wifi className="absolute inset-0 m-auto w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">Connecting to server...</p>
              <p className="text-xs text-[#555] mt-1">
                {current.icon} {current.name}
                {current.lang && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-black ${langColors[current.lang] || 'bg-white/10 text-white'}`}>
                    {current.lang}
                  </span>
                )}
              </p>
            </div>
            <p className="text-[10px] text-[#444]">Auto-switching if server doesn&apos;t respond...</p>
          </div>
        )}

        {/* Clean Video Iframe */}
        <iframe
          ref={iframeRef}
          key={`${currentIdx}-${current.url}`}
          src={current.url}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="origin"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>

      {/* ── Control Bar Below Video (Zero Text inside video frame) ─────── */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-[#0e0e16] border-x border-white/[0.06] border-t border-t-white/[0.04]">
        {/* Server Info */}
        <button
          onClick={() => setPanelOpen(p => !p)}
          className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-white transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>{current.icon} {current.name}</span>
          {current.lang && (
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${langColors[current.lang] || 'bg-white/10 text-white'}`}>
              {current.lang}
            </span>
          )}
          <span className="text-[10px] text-[#555] ml-1">
            {panelOpen ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}
          </span>
        </button>

        {/* Theater Mode Button Outside Video */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheaterMode(t => !t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
              theaterMode
                ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                : 'bg-white/[0.05] border-white/10 text-[#aaa] hover:text-white hover:bg-white/[0.1] hover:border-[#8B5CF6]/30'
            }`}
            title="Press 'T' for Theater Mode"
          >
            <Clapperboard className="w-3.5 h-3.5 text-[#A78BFA]" />
            {theaterMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Theater</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Theater Mode</span>
              </>
            )}
          </button>

          {theaterMode && (
            <button
              onClick={() => setTheaterMode(false)}
              className="px-3 py-1.5 rounded-xl bg-[#FF5252]/20 border border-[#FF5252]/40 text-[#FF5252] hover:bg-[#FF5252] hover:text-white text-xs font-bold transition-all"
              title="Close (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Server Control Panel (Collapsible) ──────────── */}
      {panelOpen && (
        <div className="bg-[#111118] border border-t-0 border-white/[0.06] rounded-b-[20px] p-4 space-y-4">
          {/* Lang Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all border ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] border-transparent text-white shadow-[0_0_10px_rgba(139,92,246,0.25)]'
                    : 'bg-white/[0.03] border-white/[0.06] text-[#666] hover:text-white hover:border-white/[0.1]'
                }`}
              >
                {tab === 'ALL' ? '🌐 All' : (langLabels[tab] || tab)}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-[#444] font-black">{currentIdx + 1} / {total}</span>
          </div>

          {/* Server Pills */}
          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
            {filteredServers.map((srv) => {
              const realIdx = servers.indexOf(srv);
              const isActive  = realIdx === currentIdx;
              const isHindi   = srv.lang === 'HI';
              return (
                <button
                  key={realIdx}
                  onClick={() => goTo(realIdx)}
                  title={`${srv.name}${srv.lang ? ` (${srv.lang})` : ''}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all duration-200 border ${
                    isActive
                      ? isHindi
                        ? 'bg-gradient-to-r from-[#F59E0B] to-[#EC4899] border-transparent text-white shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-95'
                        : 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] border-transparent text-white shadow-[0_0_12px_rgba(139,92,246,0.3)] scale-95'
                      : isHindi
                        ? 'bg-[#F59E0B]/[0.04] border-[#F59E0B]/25 text-[#888] hover:text-white hover:border-[#F59E0B]/50'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#666] hover:text-white hover:border-[#8B5CF6]/30'
                  }`}
                >
                  <span>{srv.icon}</span>
                  <span className="truncate max-w-[80px]">{srv.name}</span>
                  {srv.lang && !isActive && (
                    <span className={`text-[8px] px-1 rounded font-black ${langColors[srv.lang] || 'bg-white/10'}`}>
                      {srv.lang}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev/Next Server */}
          <div className="flex gap-2 pt-1 border-t border-white/[0.04]">
            <button
              onClick={prev}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs font-bold text-[#777] hover:text-white hover:border-[#8B5CF6]/30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Server
            </button>
            <button
              onClick={() => goTo(currentIdx)}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-bold text-[#666] hover:text-white transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 border border-[#8B5CF6]/20 text-xs font-bold text-[#A78BFA] hover:text-white hover:border-[#8B5CF6]/50 transition-all"
            >
              Next Server <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <p className="text-[9px] text-[#444] text-center">
            <AlertCircle className="w-3 h-3 inline mr-1 text-[#555]" />
            কোনো server কাজ না করলে Next Server চাপুন — 🇮🇳 = Hindi Dubbed
          </p>
        </div>
      )}
    </div>
  );
}
