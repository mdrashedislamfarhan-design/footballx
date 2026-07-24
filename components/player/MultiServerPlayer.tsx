'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Maximize2, Minimize2, Clapperboard, Server, Check } from 'lucide-react';
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

type Phase = 'select' | 'scanning' | 'playing';

interface ServerScanResult {
  server: ServerConfig;
  status: 'pending' | 'testing' | 'ok' | 'bad';
}

export default function MultiServerPlayer({ servers, title }: MultiServerPlayerProps) {
  const [phase, setPhase]                 = useState<Phase>('select');
  const [modalOpen, setModalOpen]         = useState(false);
  const [selectedLang, setSelectedLang]   = useState<string>('HI');
  const [scanResults, setScanResults]     = useState<ServerScanResult[]>([]);
  const [currentScanIdx, setCurrentScanIdx] = useState(0);
  const [currentUrl, setCurrentUrl]       = useState<string | null>(null);
  const [activeServer, setActiveServer]   = useState<ServerConfig | null>(null);
  const [theaterMode, setTheaterMode]     = useState(false);

  const scanTimerRef    = useRef<NodeJS.Timeout | null>(null);
  const scanResultsRef  = useRef<ServerScanResult[]>([]);
  const scanIdxRef      = useRef(0);
  const phaseRef        = useRef<Phase>('select');

  useEffect(() => { scanResultsRef.current = scanResults; }, [scanResults]);
  useEffect(() => { scanIdxRef.current = currentScanIdx; },  [currentScanIdx]);
  useEffect(() => { phaseRef.current = phase; },            [phase]);

  // ── Start auto-scan for a language/country group ────────────────────────────
  const runAutoScan = useCallback((targetLang: string) => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

    const langServers = servers.filter(s => (s.lang || 'EN') === targetLang || targetLang === 'ALL');
    const initialList = (langServers.length > 0 ? langServers : servers).map(s => ({
      server: s,
      status: 'pending' as const,
    }));

    setSelectedLang(targetLang);
    setScanResults(initialList);
    setCurrentScanIdx(0);
    setPhase('scanning');
    setModalOpen(false);

    // Function to test next server in queue
    const testIndex = (idx: number, currentList: ServerScanResult[]) => {
      if (idx >= currentList.length) {
        // Scanning complete! Find first 'ok' server, or fallback to 0
        const firstOk = currentList.find(r => r.status === 'ok') || currentList[0];
        if (firstOk) {
          setActiveServer(firstOk.server);
          setCurrentUrl(firstOk.server.url);
        }
        setPhase('playing');
        return;
      }

      setCurrentScanIdx(idx);

      // Mark current as testing
      const updated = currentList.map((item, i) =>
        i === idx ? { ...item, status: 'testing' as const } : item
      );
      setScanResults(updated);
      setCurrentUrl(currentList[idx].server.url);

      // 4-second timeout per server for fast scanning
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      scanTimerRef.current = setTimeout(() => {
        if (phaseRef.current !== 'scanning') return;

        // Timed out -> mark bad and test next
        const afterTimeout = scanResultsRef.current.map((item, i) =>
          i === idx ? { ...item, status: 'bad' as const } : item
        );
        setScanResults(afterTimeout);
        testIndex(idx + 1, afterTimeout);
      }, 4000);
    };

    setTimeout(() => testIndex(0, initialList), 50);
  }, [servers]);

  // Auto-start scan on initial load with 'HI' (Hindi) or first language
  useEffect(() => {
    const defaultLang = servers.some(s => s.lang === 'HI') ? 'HI' : (servers[0]?.lang || 'EN');
    runAutoScan(defaultLang);
    return () => {
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, [runAutoScan, servers]);

  // ── iframe loaded event ─────────────────────────────────────────────────────
  const handleLoad = () => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

    const idx = scanIdxRef.current;
    const updated = scanResultsRef.current.map((item, i) =>
      i === idx ? { ...item, status: 'ok' as const } : item
    );
    setScanResults(updated);

    // Test next server in auto-scan queue
    const nextIdx = idx + 1;
    if (nextIdx >= updated.length) {
      const firstOk = updated.find(r => r.status === 'ok') || updated[0];
      if (firstOk) {
        setActiveServer(firstOk.server);
        setCurrentUrl(firstOk.server.url);
      }
      setPhase('playing');
    } else {
      setTimeout(() => {
        if (phaseRef.current !== 'scanning') return;
        setCurrentScanIdx(nextIdx);
        const nextList = updated.map((item, i) =>
          i === nextIdx ? { ...item, status: 'testing' as const } : item
        );
        setScanResults(nextList);
        setCurrentUrl(nextList[nextIdx].server.url);

        if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
        scanTimerRef.current = setTimeout(() => {
          if (phaseRef.current !== 'scanning') return;
          const afterTimeout = scanResultsRef.current.map((item, i) =>
            i === nextIdx ? { ...item, status: 'bad' as const } : item
          );
          setScanResults(afterTimeout);
          // continue scan
          let n = nextIdx + 1;
          while (n < afterTimeout.length && afterTimeout[n].status !== 'pending') n++;
          if (n < afterTimeout.length) {
            setCurrentScanIdx(n);
            setCurrentUrl(afterTimeout[n].server.url);
          } else {
            const okSrv = afterTimeout.find(r => r.status === 'ok') || afterTimeout[0];
            if (okSrv) { setActiveServer(okSrv.server); setCurrentUrl(okSrv.server.url); }
            setPhase('playing');
          }
        }, 4000);
      }, 50);
    }
  };

  // ── iframe error event ──────────────────────────────────────────────────────
  const handleError = () => {
    if (phaseRef.current !== 'scanning') return;
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

    const idx = scanIdxRef.current;
    const updated = scanResultsRef.current.map((item, i) =>
      i === idx ? { ...item, status: 'bad' as const } : item
    );
    setScanResults(updated);

    const nextIdx = idx + 1;
    if (nextIdx < updated.length) {
      setCurrentScanIdx(nextIdx);
      setCurrentUrl(updated[nextIdx].server.url);
    } else {
      const firstOk = updated.find(r => r.status === 'ok') || updated[0];
      if (firstOk) {
        setActiveServer(firstOk.server);
        setCurrentUrl(firstOk.server.url);
      }
      setPhase('playing');
    }
  };

  // ── Manual selection from card ──────────────────────────────────────────────
  const selectCardManually = (srv: ServerConfig) => {
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    setActiveServer(srv);
    setCurrentUrl(srv.url);
    setPhase('playing');
    setModalOpen(false);
  };

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

  const analyzedCount = scanResults.filter(r => r.status === 'ok' || r.status === 'bad').length;
  const remainingCount = Math.max(0, scanResults.length - analyzedCount);

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

      {/* Alert banner */}
      <div className="w-full bg-[#EF4444] text-white text-xs font-black px-4 py-2 flex items-center justify-between shadow-md">
        <span>🔔 Please switch to other servers if default server doesn&apos;t work.</span>
        <button onClick={() => setModalOpen(true)} className="underline hover:opacity-80">Change Server</button>
      </div>

      {/* ── Main Player Frame ─────────────────────────────────────────────────── */}
      <div className={`relative bg-[#08080f] overflow-hidden ${
        theaterMode
          ? 'fixed top-2 left-1/2 -translate-x-1/2 w-[98vw] max-w-[1700px] h-[88vh] z-50 rounded-[28px]'
          : 'aspect-video w-full rounded-t-[20px]'
      }`}>

        {/* Top Button: "Select a server" */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED] text-white text-xs font-black rounded-xl shadow-[0_4px_25px_rgba(139,92,246,0.6)] transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <Server className="w-4 h-4" />
            <span>Select a server</span>
          </button>
        </div>

        {/* ── SCANNING SCREEN (Exact UI from Screenshot 3) ────────────────────── */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#08080f] p-6 text-center">
            <h2 className="text-white font-black text-lg sm:text-xl tracking-wide mb-1">{title || 'Loading Stream'}</h2>
            <p className="text-white/40 text-xs font-bold mb-6">Scanning high-speed servers...</p>

            {/* Progress Bar & Counters */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-[11px] font-black text-[#F59E0B] mb-2">
                <span>{analyzedCount} ANALYZED</span>
                <span>{remainingCount} REMAINING</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EC4899] rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((analyzedCount / Math.max(scanResults.length, 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Server Chips Row (Green ✓ / Red ✗) */}
            <div className="flex flex-wrap justify-center gap-2.5 max-w-xl max-h-48 overflow-y-auto custom-scrollbar p-1">
              {scanResults.map((item, idx) => {
                const isOk   = item.status === 'ok';
                const isBad  = item.status === 'bad';
                const isTest = item.status === 'testing';

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-black transition-all ${
                      isOk
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : isBad
                        ? 'bg-red-500/10 border-red-500/30 text-red-400/50 opacity-50 line-through'
                        : isTest
                        ? 'bg-[#F59E0B]/20 border-[#F59E0B]/70 text-[#F59E0B] animate-pulse scale-105'
                        : 'bg-white/[0.03] border-white/[0.06] text-white/30'
                    }`}
                  >
                    {/* Status Circle Icon */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                      isOk ? 'bg-emerald-500 text-black' : isBad ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                    }`}>
                      {isOk ? '✓' : isBad ? '✗' : '⟳'}
                    </div>
                    <span className="truncate max-w-[80px]">{item.server.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── iframe ────────────────────────────────────────────────────────── */}
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

      {/* ── Bottom Control Bar ──────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-[#0a0a10] border-x border-white/10 border-b border-white/10 rounded-b-[20px]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
          >
            <Server className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Server List</span>
          </button>

          {activeServer && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black truncate">
              <CountryFlag code={activeServer.icon} size={16} />
              <span>{activeServer.name}</span>
            </span>
          )}
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

      {/* ── Country Flag Server Selection Modal (Exact UI from Screenshot 4) ── */}
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
                <h2 className="text-white font-black text-sm sm:text-base">Select Server &amp; Country Flag</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Country Flag Cards (Exact UI from Screenshot 4) */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-3">
                {servers.map((srv, idx) => {
                  const isSelected = activeServer?.url === srv.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (srv.lang) {
                          runAutoScan(srv.lang);
                        } else {
                          selectCardManually(srv);
                        }
                      }}
                      className={`group relative flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'bg-[#4F46E5]/30 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {/* Flag Icon */}
                      <CountryFlag code={srv.icon} size={32} />

                      {/* Server Name */}
                      <span className="text-white text-[11px] font-black leading-tight text-center truncate max-w-full">
                        {srv.name}
                      </span>

                      {/* Selected check badge */}
                      {isSelected && (
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
