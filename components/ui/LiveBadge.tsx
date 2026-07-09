'use client';

export function LiveBadge({ minute }: { minute?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] text-xs font-semibold select-none">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
      </span>
      LIVE{minute ? ` ${minute}'` : ''}
    </span>
  );
}
