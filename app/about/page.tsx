import type { Metadata } from 'next';
import Link from 'next/link';
import { Tv2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About AniStream',
  description: 'Learn about AniStream — the premium anime streaming platform built for passionate anime fans worldwide.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-20">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[900px] mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
              <Tv2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black">
              <span className="text-white">Ani</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Stream</span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Every Anime.<br />Every Episode.
          </h1>
          <p className="text-[#B3B3B3] text-lg max-w-2xl mx-auto leading-relaxed">
            AniStream is a premium anime streaming platform designed for passionate anime fans around the world — built with speed, beautiful design, and an immersive viewing experience at its core.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Instant streaming with multiple server options. No buffering, no waiting — just pure anime.', color: '#FFC107' },
            { icon: '🎨', title: 'Premium Design', desc: 'Every screen is crafted with intention. Dark, immersive, and cinematic — like your favorite anime.', color: '#8B5CF6' },
            { icon: '🌍', title: 'Huge Library', desc: 'From classics to the latest releases — we cover thousands of anime with Sub & Dub support.', color: '#EC4899' },
          ].map(v => (
            <div key={v.title} className="p-6 bg-[#111118] border border-white/[0.06] rounded-[20px] hover:border-[#8B5CF6]/30 transition-colors">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="text-base font-extrabold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-[#777] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Our Mission */}
        <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/5 border border-[#8B5CF6]/20 rounded-[24px] p-8 mb-12">
          <h2 className="text-xl font-extrabold text-white mb-3">Our Mission</h2>
          <p className="text-[#B3B3B3] leading-relaxed">
            We believe anime is more than entertainment — it is art, culture, and community. AniStream exists to give every fan the best possible way to enjoy anime, with beautiful design, fast streaming, and a library that spans every genre. Powered by AniList data and built for the next generation of anime fans.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/browse"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold rounded-[16px] transition-all shadow-[0_0_24px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] hover:scale-[1.02]">
            Start Watching Now
          </Link>
        </div>
      </div>
    </div>
  );
}
