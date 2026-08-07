'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When path or searchParams change, hide loading
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (
        target &&
        target.href &&
        target.href.startsWith(window.location.origin) &&
        !target.href.includes('#') &&
        target.target !== '_blank'
      ) {
        const targetPath = target.pathname + target.search;
        const currentPath = window.location.pathname + window.location.search;
        if (targetPath !== currentPath) {
          setLoading(true);
        }
      }
    };

    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach((a) => a.addEventListener('click', handleAnchorClick as EventListener));

    return () => {
      anchors.forEach((a) => a.removeEventListener('click', handleAnchorClick as EventListener));
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* Top glowing progress bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
    </div>
  );
}
