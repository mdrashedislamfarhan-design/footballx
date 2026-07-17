'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Tv2, Flame, Star, BookOpen, Home, User, LogOut, Settings, ChevronDown, Film } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/firebase/auth';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/trending', label: 'Trending', icon: Flame },
  { href: '/popular', label: 'Popular', icon: Star },
  { href: '/browse', label: 'Anime', icon: Tv2 },
  { href: '/movies', label: 'Movies', icon: Film },
];

export default function AnimeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAvatar(localStorage.getItem('user-avatar'));
      const handleAvatar = () => {
        setAvatar(localStorage.getItem('user-avatar'));
      };
      window.addEventListener('avatar-changed', handleAvatar);
      return () => window.removeEventListener('avatar-changed', handleAvatar);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ('');
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <img
            src="/icon.png"
            alt="AniStreamBD"
            className="w-8 h-8 rounded-xl object-cover shadow-[0_0_15px_rgba(139,92,246,0.4)] shrink-0"
          />
          <span className="text-lg font-black tracking-tight whitespace-nowrap">
            <span className="text-white">AniStream</span>
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">BD</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === href
                  ? 'bg-[#8B5CF6]/20 text-[#A78BFA]'
                  : 'text-[#999] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search anime, movies..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.06] border border-white/[0.08] focus:border-[#8B5CF6] rounded-xl text-sm text-white placeholder-[#555] outline-none transition-colors"
          />
        </form>

        {/* User Menu / Login */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {!loading && (
            user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:border-[#8B5CF6]/40 hover:bg-white/[0.08] transition-all"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={user.displayName || 'Avatar'}
                      className="w-7 h-7 rounded-full object-cover border border-[#8B5CF6]/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-black text-xs shrink-0">
                      {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-white max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#777] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-[#111118] border border-white/[0.1] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                    <div className="p-3 border-b border-white/[0.06]">
                      <p className="text-xs font-black text-white">{user.displayName || 'Anime Fan'}</p>
                      <p className="text-[10px] text-[#555] mt-0.5 truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#ccc] hover:text-white hover:bg-white/[0.06] transition-all">
                        <User className="w-4 h-4 text-[#8B5CF6]" /> Profile
                      </Link>
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#ccc] hover:text-white hover:bg-white/[0.06] transition-all">
                        <Settings className="w-4 h-4 text-[#8B5CF6]" /> Settings
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#FF5252] hover:bg-[#FF5252]/10 transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 transition-all"
              >
                Sign In
              </Link>
            )
          )}
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto text-[#777] hover:text-white p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0a0a0f]/98 border-t border-white/[0.06] px-4 py-4 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search anime, movies..."
              className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#555] outline-none"
            />
          </form>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href ? 'bg-[#8B5CF6]/20 text-[#A78BFA]' : 'text-[#999] hover:text-white'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="border-t border-white/[0.06] pt-3 mt-1">
            {user ? (
              <>
                <Link href="/profile" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#ccc] hover:text-white">
                  {avatar ? (
                    <img src={avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-[#8B5CF6]/30" />
                  ) : (
                    <User className="w-4 h-4 text-[#8B5CF6]" />
                  )}
                  Profile
                </Link>
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#FF5252]">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold text-sm rounded-xl">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
