export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Top Netflix-style glowing progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B5CF6] to-[#EC4899] animate-pulse" />

      {/* Ambient background glow */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#8B5CF6]/15 blur-[120px] pointer-events-none animate-pulse" />

      {/* Center Netflix-Style Animated Logo & Spinner */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        <div className="relative flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute w-24 h-24 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] opacity-40 blur-lg animate-ping" />
          
          {/* Rotating gradient border */}
          <div className="w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#8B5CF6] animate-spin shadow-[0_0_30px_rgba(139,92,246,0.6)]">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[14px]" />
          </div>

          {/* Logo Image centered inside */}
          <img
            src="/logo_img.png?v=5"
            alt="AniStreamBD"
            className="absolute w-14 h-14 rounded-xl object-cover shadow-[0_0_20px_rgba(139,92,246,0.8)] border border-white/20 animate-pulse"
          />
        </div>

        {/* Brand Text with Shimmer Effect */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-black tracking-wider text-white">
            AniStream<span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">BD</span>
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-white/40 uppercase tracking-widest">
            <span>Loading</span>
            <span className="inline-flex">
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
