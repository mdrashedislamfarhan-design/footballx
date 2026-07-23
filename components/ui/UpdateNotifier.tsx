'use client';

import { useEffect, useState } from 'react';

export default function UpdateNotifier() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [worker, setWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Check for updates every 30 seconds
      const interval = setInterval(() => reg.update(), 30_000);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // New version available!
            setWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });

      return () => clearInterval(interval);
    });

    // When SW takes control (after update applied), reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (worker) {
      worker.postMessage('SKIP_WAITING');
    }
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5
                 bg-[#1a1a2e]/95 backdrop-blur-xl border border-[#8B5CF6]/40 rounded-2xl shadow-2xl
                 shadow-[#8B5CF6]/20 animate-slide-up"
      style={{ minWidth: 280 }}
    >
      {/* Pulse dot */}
      <span className="relative flex h-3 w-3 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8B5CF6]" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold leading-tight">নতুন আপডেট এসেছে! 🚀</p>
        <p className="text-white/50 text-xs mt-0.5">Latest version পেতে Refresh করুন</p>
      </div>

      <button
        onClick={handleUpdate}
        className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]
                   text-white text-xs font-black tracking-wide hover:opacity-90 active:scale-95
                   transition-all duration-150"
      >
        Update ↻
      </button>

      <button
        onClick={() => setShowUpdate(false)}
        className="text-white/30 hover:text-white/70 text-lg leading-none ml-1 transition-colors"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
