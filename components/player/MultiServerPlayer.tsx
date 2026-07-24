'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Maximize2, Minimize2, Clapperboard, Server } from 'lucide-react';

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

const LANG_META: Record<string, { flag: string; label: string; color: string }> = {
  HI:  { flag: '🇮🇳', label: 'Hindi',       color: '#FF9933' },
  EN:  { flag: '🌎',  label: 'English',      color: '#3B82F6' },
  SUB: { flag: '🎌',  label: 'Japanese Sub', color: '#E60026' },
  DUB: { flag: '🇺🇸', label: 'Eng Dub',     color: '#4B5563' },
  TA:  { flag: '🇮🇳', label: 'Tamil',        color: '#138808' },
  TE:  { flag: '🇮🇳', label: 'Telugu',       color: '#FF6B35' },
};

type Phase = 'select' | 'scanning' | 'playing';

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [phase, setPhase]             = useState<Phase>('select');
  const [modalOpen, setModalOpen]     = useState(false);
  const [activeTab, setActiveTab]     = useState('ALL');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [scanIdx, setScanIdx]         = useState(0);
  const [scanned, setScanned]         = useState<{ name: string; icon: string; ok: boolean }[]>([]);
  const [currentUrl, setCurrentUrl]   = useState<string | null>(null);
  const [currentServer, setCurrentServer] = useState<ServerConfig | null>(null);
  const [theaterMode, setTheaterMode] = useState(false);

  const scanTimer   = useRef<NodeJS.Timeout | null>(null);
  const phaseRef    = useRef<Phase>('select');
  const scanIdxRef  = useRef(0);
  const langRef     = useRef<string | null>(null);
  const scannedRef  = useRef<{ name: string; icon: string; ok: boolean }[]>([]);

  useEffect(() => { phaseRef.current = phase; },     [phase]);
  useEffect(() => { scanIdxRef.current = scanIdx; }, [scanIdx]);
  useEffect(() => { langRef.current = selectedLang; },[selectedLang]);
  useEffect(() => { scannedRef.current = scanned; },  [scanned]);

  const langs = Array.from(new Set(servers.map(s => s.lang || 'EN')));
  const filteredServers = activeTab === 'ALL'
    ? servers
    : servers.filter(s => (s.lang || 'EN') === activeTab);
  const langServers = selectedLang ? servers.filter(s => (s.lang || 'EN') === selectedLang) : [];

  // ── Scan next server ────────────────────────────────────────────────────────
  const tryNext = useCallback((lang: string, idx: number, failed: typeof scanned) => {
    const ls = servers.filter(s => (s.lang || 'EN') === lang);
    if (idx >= ls.length) { setPhase('playing'); return; }

    setScanIdx(idx);
    setScanned(failed);
    setCurrentServer(ls[idx]);
    setCurrentUrl(ls[idx].url);

    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      if (phaseRef.current !== 'scanning') return;
      const newFailed = [...scannedRef.current, { name: ls[idx].name, icon: ls[idx].icon, ok: false }];
      tryNext(lang, idx + 1, newFailed);
    }, 10000);
  }, [servers]);

  // ── Start scanning from a specific server (clicked from modal) ──────────────
  const startFromServer = useCallback((srv: ServerConfig) => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = srv.lang || 'EN';
    const ls   = servers.filter(s => (s.lang || 'EN') === lang);
    const startAt = ls.findIndex(s => s.url === srv.url);

    setSelectedLang(lang);
    setModalOpen(false);
    setPhase('scanning');
    setScanIdx(0);
    setScanned([]);
    setCurrentUrl(null);
    setTimeout(() => tryNext(lang, Math.max(0, startAt), []), 80);
  }, [servers, tryNext]);

  // ── iframe loaded ───────────────────────────────────────────────────────────
  const handleLoad = useCallback(() => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = langRef.current!;
    const ls   = servers.filter(s => (s.lang || 'EN') === lang);
    const idx  = scanIdxRef.current;
    setScanned(prev => [...prev, { name: ls[idx]?.name || '', icon: ls[idx]?.icon || '🌐', ok: true }]);
    setPhase('playing');
  }, [servers]);

  // ── iframe error ────────────────────────────────────────────────────────────
  const handleError = useCallback(() => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = langRef.current!;
    const ls   = servers.filter(s => (s.lang || 'EN') === lang);
    const idx  = scanIdxRef.current;
    const newFailed = [...scannedRef.current, { name: ls[idx]?.name || '', icon: ls[idx]?.icon || '🌐', ok: false }];
    tryNext(lang, idx + 1, newFailed);
  }, [servers, tryNext]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 't' || e.key === 'T') setTheaterMode(p => !p);
      if (e.key === 'Escape') { setTheaterMode(false); setModalOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const meta = selectedLang ? (LANG_META[selectedLang] || { flag: '🌐', label: selectedLang, color: '#666' }) : null;

  return (
    <div className={`w-full ${theaterMode ? 'relative z-50' : ''}`}>

      {/* Theater overlay */}
      {theaterMode && (
        <>
          <div onClick={() => setTheaterMode(false)} className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md cursor-pointer" />
          <div className="fixed top-5 right-6 z-[60]">
            <button onClick={() => setTheaterMode(false)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5252] to-[#EF4444] text-white text-xs font-black rounded-xl shadow-[0_0_25px_rgba(255,82,82,0.7)] hover:scale-105 transition-all border border-white/20">
              <X className="w-4 h-4" /> Exit Theater (Esc)
            </button>
          </div>
        </>
      )}

      {/* ── Player box ───────────────────────────────────────────────────────── */}
      <div className={`relative bg-[#08080f] overflow-hidden ${
        theaterMode
          ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[28px]'
          : 'aspect-video w-full rounded-t-[24px]'
      }`}>

        {/* SELECT phase */}
        {phase === 'select' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#08080f]">
            {title && <p className="text-white/40 text-xs font-bold px-6 text-center max-w-xs truncate">{title}</p>}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-sm font-black rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.4)] hover:scale-[1.04] active:scale-95 transition-all"
            >
              <Server className="w-5 h-5" /> Select a Server
            </button>
            <p className="text-white/20 text-[11px]">Choose your preferred language &amp; server</p>
          </div>
        )}

        {/* SCANNING phase */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#08080f] p-6">
            {title && <p className="text-white font-black text-sm text-center max-w-xs truncate">{title}</p>}
            {meta && (
              <span className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black border"
                style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}40` }}>
                {meta.flag} {meta.label}
              </span>
            )}
            <p className="text-white/40 text-[11px]">Scanning high-speed servers...</p>

            {/* Progress bar */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-[10px] font-black mb-1" style={{ color: meta?.color || '#888' }}>
                <span>{scanned.length} ANALYZED</span>
                <span>{Math.max(0, langServers.length - scanned.length)} REMAINING</span>
              </div>
              <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round((scanned.length / Math.max(langServers.length, 1)) * 100)}%`,
                    background: `linear-gradient(to right, ${meta?.color || '#8B5CF6'}, #EC4899)`,
                  }} />
              </div>
            </div>

            {/* Server scan boxes */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {langServers.map((s, i) => {
                const res = scanned[i];
                const isCur = i === scanIdx;
                return (
                  <div key={i} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-[9px] font-black transition-all ${
                    res?.ok        ? 'bg-green-500/15 border-green-500/40 text-green-400' :
                    res?.ok===false? 'bg-red-500/10 border-red-500/20 text-red-400/40' :
                    isCur          ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#A78BFA] animate-pulse' :
                                     'bg-white/[0.02] border-white/[0.05] text-white/20'
                  }`}>
                    <span className="text-sm leading-none">{res?.ok ? '✓' : res?.ok===false ? '✗' : isCur ? '⟳' : s.icon}</span>
                    <span className="max-w-[56px] truncate">{s.name}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => { if(scanTimer.current) clearTimeout(scanTimer.current); setPhase('select'); setCurrentUrl(null); }}
              className="text-white/30 hover:text-white/60 text-[11px] transition-colors mt-1">
              ← Cancel
            </button>
          </div>
        )}

        {/* iframe */}
        {currentUrl && (
          <iframe key={currentUrl} src={currentUrl} className="w-full h-full"
            allowFullScreen allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin" onLoad={handleLoad} onError={handleError} />
        )}
      </div>

      {/* ── Control bar ──────────────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-[#0e0e16] border-x border-white/[0.06] border-t border-t-white/[0.04] rounded-b-[20px]">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#888] hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-[#8B5CF6]/30 transition-all flex-shrink-0">
            <Server className="w-3.5 h-3.5 text-[#8B5CF6]" />
            {phase === 'select' ? 'Select Server' : 'Change Server'}
          </button>
          {phase === 'playing' && meta && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg border flex-shrink-0"
              style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}35` }}>
              {meta.flag} {currentServer?.name || meta.label}
            </span>
          )}
        </div>

        {/* Theater mode btn */}
        <button onClick={() => setTheaterMode(t => !t)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border flex-shrink-0 ${
            theaterMode
              ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent'
              : 'bg-white/[0.05] border-white/10 text-[#aaa] hover:text-white'
          }`} title="Press 'T'">
          <Clapperboard className="w-3.5 h-3.5" />
          {theaterMode
            ? <><Minimize2 className="w-3.5 h-3.5" /><span>Exit Theater</span></>
            : <><Maximize2 className="w-3.5 h-3.5" /><span>Theater Mode</span></>}
        </button>
      </div>

      {/* ── Server Selection Modal ────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
          <div
            className="relative w-full sm:max-w-lg bg-[#111118] border border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
              <div>
                <h2 className="text-white font-black text-sm">Now Watching: <span className="text-[#A78BFA]">{title}</span></h2>
                <p className="text-[#F59E0B] text-[10px] font-bold mt-0.5">⚠ Please switch to other servers if default server doesn&apos;t work.</p>
              </div>
              <button onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language filter tabs */}
            <div className="flex gap-1.5 px-4 pt-3 pb-2 overflow-x-auto flex-shrink-0 custom-scrollbar">
              {['ALL', ...langs].map(tab => {
                const lm = LANG_META[tab];
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all border ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-transparent shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.03] border-white/[0.07] text-[#777] hover:text-white hover:border-white/15'
                    }`}>
                    {tab === 'ALL' ? '🌐' : lm?.flag} {tab === 'ALL' ? 'All' : lm?.label || tab}
                  </button>
                );
              })}
            </div>

            {/* Server grid */}
            <div className="overflow-y-auto flex-1 px-4 pb-5 pt-1">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2">
                {filteredServers.map((srv, i) => {
                  const lm = LANG_META[srv.lang || 'EN'] || { flag: '🌐', label: srv.lang || 'EN', color: '#666' };
                  const isActive = phase === 'playing' && currentServer?.url === srv.url;
                  return (
                    <button key={i} onClick={() => startFromServer(srv)}
                      className={`group flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border transition-all hover:scale-[1.05] active:scale-95 ${
                        isActive
                          ? 'border-transparent scale-[1.02]'
                          : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.07] hover:border-white/20'
                      }`}
                      style={isActive ? { background: `${lm.color}20`, borderColor: `${lm.color}60`, boxShadow: `0 0 16px ${lm.color}25` } : {}}>
                      <span className="text-2xl leading-none">{lm.flag}</span>
                      <span className="text-white text-[10px] font-black leading-tight text-center">{srv.name}</span>
                      {isActive && (
                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: `${lm.color}30`, color: lm.color }}>✓ ON</span>
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
