'use client';
import { useEffect, useState } from 'react';
import { Download, Smartphone, Share2, CheckCircle2 } from 'lucide-react';

// ── Store prompt globally so it's captured even before component mounts ────────
// This fixes Brave / Edge / Samsung Browser where the event fires very early.
let _cachedPrompt: any = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _cachedPrompt = e;
  });
}

// Detect Chromium-based browsers (Chrome, Brave, Edge, Opera, Samsung, Vivaldi)
function isChromiumBased() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Chrome|CriOS/.test(ua) && !/Edg\//.test(ua)
    ? true // Chrome
    : /Edg\//.test(ua)
    ? true // Edge
    : /SamsungBrowser/.test(ua)
    ? true // Samsung Internet
    : /OPR\/|Opera/.test(ua)
    ? true // Opera
    : false;
}

// Brave doesn't expose itself in UA — detect via its API
async function isBrave(): Promise<boolean> {
  try {
    // @ts-ignore
    return !!(navigator.brave && (await navigator.brave.isBrave()));
  } catch {
    return false;
  }
}

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isBrowserChromium, setIsBrowserChromium] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [installDone, setInstallDone] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Check already installed (standalone mode)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (standalone) { setIsInstalled(true); return; }

    // iOS Safari
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);
    setIsIOS(ios);

    // Use globally cached prompt (works for Brave / Edge / Samsung)
    if (_cachedPrompt) {
      setDeferredPrompt(_cachedPrompt);
    }

    // Also listen for it in case component mounted before the event
    const onPrompt = (e: Event) => {
      e.preventDefault();
      _cachedPrompt = e;
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // Detect Brave or any Chromium browser
    const chromium = isChromiumBased();
    isBrave().then((brave) => setIsBrowserChromium(chromium || brave));

    const onInstalled = () => {
      setInstallDone(true);
      setIsInstalled(true);
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || _cachedPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      _cachedPrompt = null;
      setDeferredPrompt(null);
      if (outcome === 'accepted') setInstallDone(true);
    } else {
      // Brave sometimes blocks the prompt — guide user manually
      alert(
        'To install:\n\n' +
        '• Chrome/Brave: Click the ⊕ icon in the address bar → "Install AniStreamBD"\n' +
        '• Edge: Click ••• menu → Apps → Install this site as an app\n' +
        '• Samsung Browser: Tap ≡ → Install app'
      );
    }
  };

  // Already installed
  if (isInstalled || installDone) {
    return (
      <span className="text-[10px] text-[#8B5CF6] font-extrabold bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 w-fit">
        <CheckCircle2 className="w-3.5 h-3.5" /> App Installed ✓
      </span>
    );
  }

  // iOS Safari — Share hint
  if (isIOS) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowIOSHint(!showIOSHint)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-black rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Share2 className="w-3.5 h-3.5" />
          Install on iPhone / iPad
        </button>
        {showIOSHint && (
          <div className="absolute bottom-12 left-0 bg-[#1a1a2e] border border-[#8B5CF6]/30 rounded-xl p-3 text-[10px] text-white w-56 shadow-2xl z-50">
            <p className="font-bold text-[#A78BFA] mb-1">How to install on iOS:</p>
            <p>1. Tap the <strong>Share</strong> button (□↑) in Safari</p>
            <p>2. Tap <strong>"Add to Home Screen"</strong></p>
            <p>3. Tap <strong>Add</strong> — done! 🎉</p>
          </div>
        )}
      </div>
    );
  }

  // Chrome / Brave / Edge / Samsung — show install button
  if (deferredPrompt || _cachedPrompt || isBrowserChromium) {
    return (
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-black rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        Install AniStreamBD App
      </button>
    );
  }

  // Firefox / Other
  return (
    <span className="text-[10px] text-[#555] font-bold flex items-center gap-1.5">
      <Smartphone className="w-3 h-3" />
      Open in Chrome / Brave / Edge to install the app
    </span>
  );
}
