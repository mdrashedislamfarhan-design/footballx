import Link from 'next/link';
import { Ghost, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md w-full">
        {/* 404 Text */}
        <div className="text-[150px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent select-none mb-4">
          404
        </div>

        {/* Icon & Title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-8 mt-[-30px]">
          <div className="w-20 h-20 bg-[#12121a] border border-[#8B5CF6]/20 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)] mx-auto mb-6">
            <Ghost className="w-10 h-10 text-[#A78BFA]" />
          </div>
        </div>

        <h2 className="text-3xl mt-12 font-bold text-white mb-3">Lost in the Void!</h2>
        
        <p className="text-[#B3B3B3] mb-10 leading-relaxed text-sm">
          Looks like this anime episode doesn't exist or has been moved to another dimension.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/browse"
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <Search className="w-5 h-5" />
            Browse Anime
          </Link>
        </div>
      </div>
    </div>
  );
}
