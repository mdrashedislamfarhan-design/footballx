import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';
import PwaInstallButton from '../ui/PwaInstallButton';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const footerLinks = {
  Explore: [
    { label: 'Home', href: '/' },
    { label: 'Trending', href: '/trending' },
    { label: 'Popular', href: '/popular' },
    { label: 'Browse Anime', href: '/browse' },
    { label: 'Movies', href: '/movies' },
  ],
  Anime: [
    { label: 'Trending Anime', href: '/trending' },
    { label: 'Top Rated', href: '/browse?sort=SCORE_DESC' },
    { label: 'Action', href: '/browse?genre=Action' },
    { label: 'Romance', href: '/browse?genre=Romance' },
    { label: 'Fantasy', href: '/browse?genre=Fantasy' },
  ],
  Movies: [
    { label: 'Hollywood', href: '/movies?type=hollywood' },
    { label: 'Bollywood', href: '/movies?type=bollywood' },
    { label: 'Web Series', href: '/movies' },
    { label: 'Search', href: '/search' },
  ],
  Account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ],
  Legal: [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function AnimeFooter() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#0a0a0f] mt-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">

        {/* ── Install Banner — centered above all columns ── */}
        <div className="flex justify-center mb-10">
          <PwaInstallButton />
        </div>

        {/* Top — Brand + Links */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-white/[0.05]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo_img.png?v=2"
                alt="AniStreamBD"
                className="w-9 h-9 rounded-xl object-cover shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-white/10 shrink-0"
              />
              <span className="text-base font-black whitespace-nowrap">
                <span className="text-white">AniStream</span>
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">BD</span>
              </span>
            </Link>
            <p className="text-xs text-[#555] leading-relaxed max-w-[200px]">
              Stream anime, Bollywood &amp; Hollywood movies and web series — all in one place. Sub, Dub &amp; Hindi available.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: TwitterIcon, href: '#', name: 'twitter' },
                { icon: InstagramIcon, href: '#', name: 'instagram' },
                { icon: GithubIcon, href: '#', name: 'github' },
              ].map(({ icon: Icon, href, name }) => (
                <a key={name} href={href} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#555] hover:text-white hover:border-[#8B5CF6]/30 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs text-[#555] hover:text-[#A78BFA] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-[11px] text-[#444] leading-relaxed">
            Anime data by{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener" className="text-[#8B5CF6] hover:underline">AniList</a>.
            {' '}Movie data by{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener" className="text-[#EC4899] hover:underline">TMDB</a>.
            {' '}AniStreamBD — Your ultimate destination for free anime &amp; movie streaming.
          </p>
          <p className="text-[11px] text-[#444] flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            Made with <Heart className="w-3 h-3 text-[#EC4899] fill-[#EC4899]" /> for anime fans
          </p>
        </div>
      </div>
    </footer>
  );
}
