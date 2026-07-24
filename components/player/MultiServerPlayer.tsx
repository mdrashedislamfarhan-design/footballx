'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Clapperboard,
  Server,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';

export interface ServerConfig {
  name: string;
  url: string;
  icon: string;
  lang?: string; // 'EN' | 'HI' | 'SUB' | 'DUB' | 'TA' | 'TE'
}

interface MultiServerPlayerProps {
  servers: ServerConfig[];
  title?: string;
}

// ── Language metadata ─────────────────────────────────────────────────────────
const LANG_META: Record<string, { flag: string; label: string; color: string }> = {
  HI:  { flag: '🇮🇳', label: 'Hindi',        color: '#FF9933' },
  EN:  { flag: '🌎', label: 'English',        color: '#3B82F6' },
  SUB: { flag: '🎌', label: 'Japanese Sub',   color: '#E60026' },
  DUB: { flag: '🇺🇸', label: 'English Dub',  color: '#3C3B6E' },
  TA:  { flag: '🇮🇳', label: 'Tamil',         color: '#138808' },
  TE:  { flag: '🇮🇳', label: 'Telugu',        color: '#FF6B35' },
};

type Phase = 'select' | 'scanning' | 'playing';

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [phase, setPhase]               = useState<Phase>('select');
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [scanIdx, setScanIdx]           = useState(0);
  const [scanned, setScanned]           = useState<{ name: string; icon: string; ok: boolean }[]>([]);
  const [currentUrl, setCurrentUrl]     = useState<string | null>(null);
  const [theaterMode, setTheaterMode]   = useState(false);

  const scanTimer = useRef<NodeJS.Timeout | null>(null);
  const scanIdxRef = useRef(0);
  const selectedLangRef = useRef<string | null>(null);
  const phaseRef = useRef<Phase>('select');

  // Keep refs in sync
  useEffect(() => { scanIdxRef.current = scanIdx; }, [scanIdx]);
  useEffect(() => { selectedLangRef.current = selectedLang; }, [selectedLang]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Unique langs available
  const langs = Array.from(new Set(servers.map(s => s.lang || 'EN')));

  // Servers for currently selected language
  const langServers = selectedLang
    ? servers.filter(s => (s.lang || 'EN') === selectedLang)
    : [];

  // ── Try next server in scan ─────────────────────────────────────────────────
  const tryNext = useCallback((lang: string, idx: number, failedList: { name: string; icon: string; ok: boolean }[]) => {
    const ls = servers.filter(s => (s.lang || 'EN') === lang);
    if (idx >= ls.length) {
      // All exhausted — show playing with last url anyway
      setPhase('playing');
      return;
    }
    setScanIdx(idx);
    setScanned(failedList);
    setCurrentUrl(ls[idx].url);

    // Auto-timeout: if iframe doesn't respond in 8s, mark as failed
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      if (phaseRef.current !== 'scanning') return;
      const newFailed = [...failedList, { name: ls[idx].name, icon: ls[idx].icon, ok: false }];
      tryNext(lang, idx + 1, newFailed);
    }, 8000);
  }, [servers]);

  // ── Start scanning a language ───────────────────────────────────────────────
  const startScan = useCallback((lang: string) => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    setSelectedLang(lang);
    setModalOpen(false);
    setPhase('scanning');
    setScanIdx(0);
    setScanned([]);
    setCurrentUrl(null);
    setTimeout(() => tryNext(lang, 0, []), 100);
  }, [tryNext]);

  // ── iframe loaded ───────────────────────────────────────────────────────────
  const handleLoad = useCallback(() => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = selectedLangRef.current!;
    const ls = servers.filter(s => (s.lang || 'EN') === lang);
    const idx = scanIdxRef.current;
    setScanned(prev => [...prev, { name: ls[idx]?.name || '', icon: ls[idx]?.icon || '', ok: true }]);
    setPhase('playing');
  }, [servers]);

  // ── iframe errored ──────────────────────────────────────────────────────────
  const handleError = useCallback(() => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimer.current) clearTimeout(scanTimer.current);
    const lang = selectedLangRef.current!;
    const ls = servers.filter(s => (s.lang || 'EN') === lang);
    const idx = scanIdxRef.current;
    const newFailed = [...scanned, { name: ls[idx]?.name || '', icon: ls[idx]?.icon || '', ok: false }];
    tryNext(lang, idx + 1, newFailed);
  }, [servers, scanned, tryNext]);

  // ── Theater mode keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 't' || e.key === 'T') setTheaterMode(p => !p);
      if (e.key === 'Escape' && theaterMode) setTheaterMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [theaterMode]);

  // ── Reset to select ─────────────────────────────────────────────────────────
  const reset = () => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
    setPhase('select');
    setModalOpen(false);
    setCurrentUrl(null);
    setSelectedLang(null);
    setScanned([]);
    setScanIdx(0);
  };

  // ── Retry current server ────────────────────────────────────────────────────
  const retry = () => {
    if (!selectedLang) return;
    const ls = servers.filter(s => (s.lang || 'EN') === selectedLang);
    setCurrentUrl(null);
    setTimeout(() => setCurrentUrl(ls[scanIdx]?.url || null), 100);
  };

  const meta = selectedLang ? (LANG_META[selectedLang] || { flag: '🌐', label: selectedLang, color: '#666' }) : null;

  return (
    <div className={`w-full ${theaterMode ? 'relative z-50' : ''}`}>

      {/* ── Theater mode dimmed overlay & exit button ──────────────────────── */}
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

      {/* ── Player wrapper ─────────────────────────────────────────────────── */}
      <div
        className={`relative bg-[#080810] overflow-hidden ${
          theaterMode
            ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[28px]'
            : 'aspect-video w-full rounded-t-[24px]'
        }`}
      >

        {/* ── Phase: SELECT ─────────────────────────────────────────────────── */}
        {phase === 'select' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#08080f]">
            {title && (
              <p className="text-white/40 text-sm font-bold px-4 text-center max-w-xs truncate">{title}</p>
            )}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-sm font-black rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.45)] hover:scale-[1.04] active:scale-95 transition-all"
            >
              <Server className="w-5 h-5" />
              Select a Server
            </button>
            <p className="text-white/20 text-xs">Choose your preferred language to start watching</p>
          </div>
        )}

        {/* ── Phase: SCANNING ───────────────────────────────────────────────── */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#08080f] p-6">
            {title && <p className="text-white font-black text-sm text-center max-w-xs">{title}</p>}
            {meta && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ background: `${meta.color}15`, borderColor: `${meta.color}40` }}>
                <span className="text-xl">{meta.flag}</span>
                <span className="text-white text-xs font-black">{meta.label}</span>
              </div>
            )}
            <p className="text-white/40 text-xs -mt-2">Scanning high-speed servers...</p>

            {/* Progress bar */}
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-[10px] font-black mb-1.5" style={{ color: meta?.color || '#888' }}>
                <span>{scanned.length} ANALYZED</span>
                <span>{Math.max(0, langServers.length - scanned.length)} REMAINING</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round((scanned.length / Math.max(langServers.length, 1)) * 100)}%`,
                    background: `linear-gradient(to right, ${meta?.color || '#8B5CF6'}, #EC4899)`,
                  }}
                />
              </div>
            </div>

            {/* Server boxes being scanned */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {langServers.map((s, i) => {
                const result = scanned[i];
                const isCurrent = i === scanIdx;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-[9px] font-black transition-all duration-300 ${
                      result?.ok
                        ? 'bg-green-500/15 border-green-500/40 text-green-400'
                        : result?.ok === false
                        ? 'bg-red-500/10 border-red-500/20 text-red-400/40'
                        : isCurrent
                        ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#A78BFA] animate-pulse'
                        : 'bg-white/[0.02] border-white/[0.05] text-white/20'
                    }`}
                  >
                    <span className="text-base leading-none">
                      {result?.ok ? '✓' : result?.ok === false ? '✗' : isCurrent ? '⟳' : s.icon}
                    </span>
                    <span className="max-w-[52px] truncate">
                      {s.name.replace('Hindi ', '').replace('Main ', '').replace('Dub ', '')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cancel button */}
            <button onClick={reset} className="text-white/30 hover:text-white/60 text-xs transition-colors mt-1">
              ← Cancel
            </button>
          </div>
        )}

        {/* ── iframe (rendered when url is set) ─────────────────────────────── */}
        {currentUrl && (
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* ── Control bar below video ────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-[#0e0e16] border-x border-white/[0.06] border-t border-t-white/[0.04] rounded-b-[20px]">

        <div className="flex items-center gap-2 flex-wrap">
          {/* Change server button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#888] hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-[#8B5CF6]/30 transition-all"
          >
            <Server className="w-3.5 h-3.5 text-[#8B5CF6]" />
            {phase === 'select' ? 'Select Server' : 'Change Server'}
          </button>

          {/* Current lang badge */}
          {phase === 'playing' && meta && (
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-lg border"
              style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}35` }}
            >
              {meta.flag} {meta.label}
            </span>
          )}

          {/* Retry current */}
          {phase === 'playing' && (
            <button
              onClick={retry}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-[#666] hover:text-white bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all"
              title="Retry current server"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Theater mode */}
        <button
          onClick={() => setTheaterMode(t => !t)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
            theaterMode
              ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-[0_0_15px_rgba(236,72,153,0.4)]'
              : 'bg-white/[0.05] border-white/10 text-[#aaa] hover:text-white hover:bg-white/[0.1]'
          }`}
          title="Press 'T' for Theater Mode"
        >
          <Clapperboard className="w-3.5 h-3.5" />
          {theaterMode
            ? <><Minimize2 className="w-3.5 h-3.5" /><span>Exit Theater</span></>
            : <><Maximize2 className="w-3.5 h-3.5" /><span>Theater Mode</span></>
          }
        </button>
      </div>

      {/* ── Language Selection Modal ───────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" />

          {/* Modal card */}
          <div
            className="relative w-full max-w-md bg-[#111118] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                {phase !== 'select' && (
                  <button onClick={() => setModalOpen(false)} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h2 className="text-white font-black text-sm">Select Server</h2>
                  {title && <p className="text-white/30 text-[10px] mt-0.5 max-w-[220px] truncate">{title}</p>}
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning bar */}
            <div className="mx-4 mt-4 p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center gap-2">
              <span className="text-[#FCD34D] text-sm">⚠️</span>
              <p className="text-[#FCD34D] text-[10px] font-bold">Please switch to other servers if default server doesn&apos;t work.</p>
            </div>

            {/* Language grid */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
              <div className="grid grid-cols-3 gap-2.5">
                {langs.map(lang => {
                  const lm = LANG_META[lang] || { flag: '🌐', label: lang, color: '#666' };
                  const count = servers.filter(s => (s.lang || 'EN') === lang).length;
                  const isActive = selectedLang === lang && phase !== 'select';
                  return (
                    <button
                      key={lang}
                      onClick={() => startScan(lang)}
                      className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                        isActive
                          ? 'border-transparent scale-[1.03]'
                          : 'bg-white/[0.03] border-white/[0.07] hover:border-white/15 hover:bg-white/[0.06]'
                      }`}
                      style={isActive ? {
                        background: `${lm.color}20`,
                        borderColor: `${lm.color}60`,
                        boxShadow: `0 0 20px ${lm.color}25`,
                      } : {}}
                    >
                      <span className="text-4xl leading-none filter drop-shadow-lg">{lm.flag}</span>
                      <span className="text-white text-[11px] font-black">{lm.label}</span>
                      <span className="text-white/30 text-[9px] font-bold">{count} server{count !== 1 ? 's' : ''}</span>
                      {isActive && (
                        <span
                          className="text-[8px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${lm.color}30`, color: lm.color }}
                        >
                          ACTIVE
                        </span>
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
