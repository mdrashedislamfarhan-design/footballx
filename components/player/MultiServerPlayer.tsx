'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Maximize2, Minimize2, Clapperboard, Server, RefreshCw, Play, Sparkles } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';

export interface ServerConfig {
  name: string;
  url: string;
  icon: string; // Flag code: 'IN' | 'US' | 'GB' | 'JP' | 'FR' | 'ES' | 'DE' | 'IT' | 'BR' | 'RU' | 'SA' | 'TR' | 'TH'
  lang?: string; // 'HI' | 'EN' | 'SUB' | 'DUB' | 'TA' | 'TE' | 'ES' | 'FR' | 'DE' | 'IT' | 'AR' | 'BR' | 'RU' | 'TR' | 'TH'
}

interface MultiServerPlayerProps {
  servers: ServerConfig[];
  title?: string;
}

const LANG_META: Record<string, { code: string; label: string; color: string }> = {
  HI:  { code: 'IN', label: 'Hindi Dub',     color: '#FF9933' },
  EN:  { code: 'US', label: 'English',       color: '#3B82F6' },
  SUB: { code: 'JP', label: 'Japanese Sub',  color: '#E60026' },
  DUB: { code: 'US', label: 'English Dub',  color: '#8B5CF6' },
  TA:  { code: 'IN', label: 'Tamil Dub',     color: '#138808' },
  TE:  { code: 'IN', label: 'Telugu Dub',    color: '#FF6B35' },
  ES:  { code: 'ES', label: 'Spanish',       color: '#EF4444' },
  FR:  { code: 'FR', label: 'French',        color: '#2563EB' },
  DE:  { code: 'DE', label: 'German',        color: '#F59E0B' },
  IT:  { code: 'IT', label: 'Italian',       color: '#10B981' },
  AR:  { code: 'SA', label: 'Arabic',        color: '#059669' },
  BR:  { code: 'BR', label: 'Portuguese',    color: '#16A34A' },
  RU:  { code: 'RU', label: 'Russian',       color: '#DC2626' },
  TR:  { code: 'TR', label: 'Turkish',       color: '#E11D48' },
  TH:  { code: 'TH', label: 'Thai',          color: '#7C3AED' },
};

type Phase = 'select' | 'scanning' | 'playing';

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [phase, setPhase]                 = useState<Phase>('select');
  const [modalOpen, setModalOpen]         = useState(false);
  const [activeTab, setActiveTab]         = useState('ALL');
  const [selectedLang, setSelectedLang]   = useState<string | null>(null);
  const [scanIdx, setScanIdx]             = useState(0);
  const [scanned, setScanned]             = useState<{ name: string; icon: string; ok: boolean }[]>([]);
  const [currentUrl, setCurrentUrl]       = useState<string | null>(null);
  const [currentServer, setCurrentServer] = useState<ServerConfig | null>(null);
  const [theaterMode, setTheaterMode]     = useState(false);

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
  const langServers = selectedLang ? servers.filter(s => (s.lang || 'EN') === selectedLang) : servers;

  // ── Scan next server ────────────────────────────────────────────────────────
  const tryNext = useCallback((lang: string, idx: number, failed: typeof scanned) => {
    const ls = servers.filter(s => (s.lang || 'EN') === lang);
    if (idx >= ls.length) { 
      // All scanned — set phase to playing with whatever we have
      setPhase('playing'); 
      return; 
    }

    setScanIdx(idx);
    setScanned(failed);
    setCurrentServer(ls[idx]);
    setCurrentUrl(ls[idx].url);

    // Fast 4.5 second timeout per server so scanner moves quickly
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      if (phaseRef.current !== 'scanning') return;
      const newFailed = [...scannedRef.current, { name: ls[idx].name, icon: ls[idx].icon, ok: false }];
      tryNext(lang, idx + 1, newFailed);
    }, 4500);
  }, [servers]);

  // ── Start scanning an entire language (e.g. Indian flag clicked) ───────────
  const startScanLanguage = useCallback((lang: string) => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    setSelectedLang(lang);
    setModalOpen(false);
    setPhase('scanning');
    setScanIdx(0);
    setScanned([]);
    setCurrentUrl(null);
    setTimeout(() => tryNext(lang, 0, []), 50);
  }, [tryNext]);

  // ── Start scanning from a specific server card ─────────────────────────────
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
    setTimeout(() => tryNext(lang, Math.max(0, startAt), []), 50);
  }, [servers, tryNext]);

  // ── iframe loaded ───────────────────────────────────────────────────────────
  const handleLoad = useCallback(() => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = langRef.current!;
    const ls   = servers.filter(s => (s.lang || 'EN') === lang);
    const idx  = scanIdxRef.current;
    setScanned(prev => [...prev, { name: ls[idx]?.name || '', icon: ls[idx]?.icon || 'US', ok: true }]);
    setPhase('playing');
  }, [servers]);

  // ── iframe error ────────────────────────────────────────────────────────────
  const handleError = useCallback(() => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = langRef.current!;
    const ls   = servers.filter(s => (s.lang || 'EN') === lang);
    const idx  = scanIdxRef.current;
    const newFailed = [...scannedRef.current, { name: ls[idx]?.name || '', icon: ls[idx]?.icon || 'US', ok: false }];
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

  const meta = selectedLang ? (LANG_META[selectedLang] || { code: 'US', label: selectedLang, color: '#666' }) : null;

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
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-[#08080f] p-4">
            {title && <p className="text-white/50 text-xs font-black tracking-wide text-center max-w-sm truncate">{title}</p>}
            
            {/* Quick Country Flag Selectors */}
            <div className="flex flex-wrap justify-center gap-3 max-w-md">
              {langs.map(l => {
                const lm = LANG_META[l] || { code: 'US', label: l, color: '#8B5CF6' };
                const count = servers.filter(s => (s.lang || 'EN') === l).length;
                return (
                  <button
                    key={l}
                    onClick={() => startScanLanguage(l)}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/15 hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    <CountryFlag code={lm.code} size={22} />
                    <div className="flex flex-col items-start">
                      <span className="text-white text-xs font-black leading-none">{lm.label}</span>
                      <span className="text-white/30 text-[9px] font-bold leading-tight mt-0.5">{count} servers</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#3B82F6] text-white text-xs font-black rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:scale-[1.04] active:scale-95 transition-all"
            >
              <Server className="w-4 h-4" /> View All {servers.length} Servers
            </button>
          </div>
        )}

        {/* SCANNING phase */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#08080f] p-6">
            {title && <p className="text-white font-black text-sm text-center max-w-xs truncate">{title}</p>}
            {meta && (
              <span className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl text-xs font-black border"
                style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}40` }}>
                <CountryFlag code={meta.code} size={20} />
                {meta.label} Auto-Scan
              </span>
            )}
            <p className="text-white/40 text-[11px]">Scanning high-speed servers automatically...</p>

            {/* Progress bar */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-[10px] font-black mb-1" style={{ color: meta?.color || '#888' }}>
                <span>{scanned.length} ANALYZED</span>
                <span>{Math.max(0, langServers.length - scanned.length)} REMAINING</span>
              </div>
              <div className="h-[4px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((scanned.length / Math.max(langServers.length, 1)) * 100)}%`,
                    background: `linear-gradient(to right, ${meta?.color || '#8B5CF6'}, #EC4899)`,
                  }} />
              </div>
            </div>

            {/* Server scan boxes */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md max-h-40 overflow-y-auto custom-scrollbar p-1">
              {langServers.map((s, i) => {
                const res = scanned[i];
                const isCur = i === scanIdx;
                return (
                  <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-black transition-all ${
                    res?.ok        ? 'bg-green-500/15 border-green-500/40 text-green-400' :
                    res?.ok===false? 'bg-red-500/10 border-red-500/20 text-red-400/40' :
                    isCur          ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/60 text-[#A78BFA] animate-pulse' :
                                     'bg-white/[0.02] border-white/[0.05] text-white/20'
                  }`}>
                    <CountryFlag code={s.icon} size={14} />
                    <span className="max-w-[60px] truncate">{s.name}</span>
                    <span className="text-[10px]">{res?.ok ? '✓' : res?.ok===false ? '✗' : isCur ? '⟳' : ''}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => { if(scanTimer.current) clearTimeout(scanTimer.current); setPhase('select'); setCurrentUrl(null); }}
              className="text-white/40 hover:text-white text-[11px] transition-colors mt-1">
              ← Cancel Scan
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-[#aaa] hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-[#8B5CF6]/30 transition-all flex-shrink-0">
            <Server className="w-3.5 h-3.5 text-[#8B5CF6]" />
            {phase === 'select' ? 'Select Server' : 'Change Server'}
          </button>

          {phase === 'playing' && currentServer && (
            <span className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border flex-shrink-0 bg-white/[0.04] border-white/10 text-white">
              <CountryFlag code={currentServer.icon} size={14} />
              {currentServer.name}
            </span>
          )}
        </div>

        {/* Theater mode btn */}
        <button onClick={() => setTheaterMode(t => !t)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border flex-shrink-0 ${
            theaterMode
              ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-[0_0_15px_rgba(236,72,153,0.4)]'
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
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
          <div
            className="relative w-full sm:max-w-xl bg-[#111118] border border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
              <div>
                <h2 className="text-white font-black text-sm">Now Watching: <span className="text-[#A78BFA]">{title}</span></h2>
                <p className="text-[#F59E0B] text-[10px] font-bold mt-0.5">🔔 Click any flag/server to auto-scan and play working stream.</p>
              </div>
              <button onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language filter tabs */}
            <div className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto flex-shrink-0 custom-scrollbar">
              {['ALL', ...langs].map(tab => {
                const lm = LANG_META[tab];
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all border ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-transparent shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.03] border-white/[0.07] text-[#777] hover:text-white hover:border-white/15'
                    }`}>
                    {tab === 'ALL' ? <span className="text-xs">🌐 All</span> : <><CountryFlag code={lm?.code || 'US'} size={14} /><span>{lm?.label || tab}</span></>}
                  </button>
                );
              })}
            </div>

            {/* Server grid */}
            <div className="overflow-y-auto flex-1 px-4 pb-5 pt-2 custom-scrollbar">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2.5">
                {filteredServers.map((srv, i) => {
                  const isActive = phase === 'playing' && currentServer?.url === srv.url;
                  return (
                    <button key={i} onClick={() => startFromServer(srv)}
                      className={`group flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border transition-all hover:scale-[1.05] active:scale-95 ${
                        isActive
                          ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/60 shadow-[0_0_16px_rgba(139,92,246,0.4)]'
                          : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.08] hover:border-white/20'
                      }`}>
                      <CountryFlag code={srv.icon} size={28} />
                      <span className="text-white text-[10px] font-black leading-tight text-center truncate max-w-full">{srv.name}</span>
                      {isActive && (
                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded-full bg-[#8B5CF6] text-white">✓ ON</span>
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
