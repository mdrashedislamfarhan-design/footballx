'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Maximize2, Minimize2, Clapperboard, Check, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export interface ServerConfig {
  name: string;
  url: string;
  icon?: string;
  lang?: string;
}

interface MultiServerPlayerProps {
  servers: ServerConfig[];
  title?: string;
  subTitle?: string;
}

type ServerStatus = 'idle' | 'testing' | 'ready' | 'failed';

export default function MultiServerPlayer({ servers, title, subTitle }: MultiServerPlayerProps) {
  const [panelOpen, setPanelOpen]         = useState(false);
  const [selectedIdx, setSelectedIdx]     = useState(0);
  const [serverStatuses, setServerStatuses] = useState<Record<number, ServerStatus>>({});
  const [currentUrl, setCurrentUrl]       = useState<string>(servers[0]?.url || '');
  const [isScanning, setIsScanning]       = useState(true);
  const [theaterMode, setTheaterMode]     = useState(false);

  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentIdxRef = useRef(0);
  const isScanningRef = useRef(true);

  useEffect(() => { currentIdxRef.current = selectedIdx; }, [selectedIdx]);
  useEffect(() => { isScanningRef.current = isScanning; }, [isScanning]);

  // ── Auto-scan sequence ─────────────────────────────────────────────────────
  const testServer = useCallback((idx: number) => {
    if (idx >= servers.length) {
      // Reached end — play whatever we have at selectedIdx
      setIsScanning(false);
      return;
    }

    setSelectedIdx(idx);
    setCurrentUrl(servers[idx].url);
    setServerStatuses(prev => ({ ...prev, [idx]: 'testing' }));

    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    
    // 6 second test timeout
    scanTimerRef.current = setTimeout(() => {
      if (!isScanningRef.current) return;
      // Mark failed and test next
      setServerStatuses(prev => ({ ...prev, [idx]: 'failed' }));
      testServer(idx + 1);
    }, 6000);
  }, [servers]);

  // Start auto-scan on initial mount
  useEffect(() => {
    testServer(0);
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, [testServer]);

  // ── Manual server select ────────────────────────────────────────────────────
  const selectServerManually = (idx: number) => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    setIsScanning(false);
    setSelectedIdx(idx);
    setCurrentUrl(servers[idx].url);
    setServerStatuses(prev => ({ ...prev, [idx]: 'ready' }));
    setPanelOpen(false);
  };

  // ── iframe load handler ─────────────────────────────────────────────────────
  const handleLoad = () => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    const idx = currentIdxRef.current;
    setServerStatuses(prev => ({ ...prev, [idx]: 'ready' }));
    setIsScanning(false);
  };

  // ── iframe error handler ────────────────────────────────────────────────────
  const handleError = () => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    const idx = currentIdxRef.current;
    setServerStatuses(prev => ({ ...prev, [idx]: 'failed' }));
    if (isScanningRef.current) {
      testServer(idx + 1);
    }
  };

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 't' || e.key === 'T') setTheaterMode(p => !p);
      if (e.key === 'Escape') { setTheaterMode(false); setPanelOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const activeServer = servers[selectedIdx] || servers[0];

  return (
    <div className={`w-full ${theaterMode ? 'relative z-50' : ''}`}>

      {/* Theater mode backdrop */}
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

      {/* ── Player Container ─────────────────────────────────────────────────── */}
      <div className={`relative bg-[#050508] overflow-hidden ${
        theaterMode
          ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[24px]'
          : 'aspect-video w-full rounded-t-[20px]'
      }`}>

        {/* ── Top Bar Over Video (Exact Layout from Reference Image) ──────────── */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
          
          {/* Left Title */}
          <div className="flex flex-col min-w-0 pr-2">
            <h1 className="text-white text-xs sm:text-sm font-black truncate max-w-[200px] sm:max-w-xs">{title || 'Now Playing'}</h1>
            {subTitle && <p className="text-white/40 text-[9px] sm:text-[10px] font-semibold truncate">{subTitle}</p>}
          </div>

          {/* Center "Select a server" Button (Purple/Blue Pill Button) */}
          <button
            onClick={() => setPanelOpen(p => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-xs font-black rounded-xl shadow-[0_4px_20px_rgba(124,58,237,0.5)] transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <Layers className="w-4 h-4" />
            <span>Select a server</span>
          </button>

          {/* Right Action Badges */}
          <div className="flex items-center gap-2">
            {/* Working Server Badge */}
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[110px] truncate">{activeServer?.name}</span>
            </span>

            {/* Theater Mode Button */}
            <button
              onClick={() => setTheaterMode(t => !t)}
              className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all"
              title="Theater Mode ('T')"
            >
              {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Server Selection Dropdown Panel (Exact UI from Reference Image) ── */}
        {panelOpen && (
          <div className="absolute top-14 right-4 z-40 w-72 max-w-[85vw] bg-[#12121a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="text-white text-sm font-black">Server</span>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Server Items List */}
            <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-1.5">
              {servers.map((srv, idx) => {
                const isSelected = selectedIdx === idx;
                const status = serverStatuses[idx] || 'idle';

                return (
                  <button
                    key={idx}
                    onClick={() => selectServerManually(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-left ${
                      isSelected
                        ? 'bg-[#EAB308] text-black font-extrabold shadow-md scale-[1.01]'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Radio Circle */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-black text-white'
                          : 'border-2 border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Server Name */}
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs truncate ${isSelected ? 'text-black font-black' : 'text-white font-bold'}`}>
                          {srv.name}
                        </span>
                        
                        {/* Subtitle status: Ready / Failed / Testing */}
                        <span className={`text-[10px] ${
                          isSelected
                            ? 'text-black/70 font-semibold'
                            : status === 'failed'
                            ? 'text-red-400 font-semibold'
                            : status === 'testing'
                            ? 'text-amber-400 font-semibold animate-pulse'
                            : 'text-white/40'
                        }`}>
                          {status === 'failed' ? 'Failed' : status === 'testing' ? 'Testing...' : 'Ready'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Video Iframe ────────────────────────────────────────────────────── */}
        {currentUrl && (
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* ── Control Bar Below Video ──────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0a0a10] border-x border-white/10 border-b border-white/10 rounded-b-[20px]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setPanelOpen(p => !p)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#EAB308]" />
            <span>Switch Server</span>
          </button>

          <span className="text-white/40 text-[11px] font-semibold truncate hidden sm:inline">
            Active: <span className="text-white font-bold">{activeServer?.name}</span>
          </span>
        </div>

        <button
          onClick={() => setTheaterMode(t => !t)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
            theaterMode
              ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent'
              : 'bg-white/5 border-white/10 text-white/80 hover:text-white'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          <span>{theaterMode ? 'Exit Theater' : 'Theater Mode'}</span>
        </button>
      </div>

    </div>
  );
}
