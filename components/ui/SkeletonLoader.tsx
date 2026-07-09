export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-[20px] bg-[#181818] border border-white/[0.08] ${className}`} />
  );
}
