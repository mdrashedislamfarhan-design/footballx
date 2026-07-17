'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/firebase/auth';
import { useRouter } from 'next/navigation';
import { User, Mail, LogOut, Shield, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ANIME_AVATARS = [
  { name: 'Luffy', url: '/avatars/luffy.png' },
  { name: 'Zoro', url: '/avatars/zoro.png' },
  { name: 'Gojo Satoru', url: '/avatars/gojo_satoru.png' },
  { name: 'Sukuna', url: '/avatars/sukuna.png' },
  { name: 'Naruto', url: '/avatars/naruto_uzumaki.png' },
  { name: 'Sasuke', url: '/avatars/sasuke_uchiha.png' },
  { name: 'Kakashi', url: '/avatars/kakashi_hatake.png' },
  { name: 'Itachi', url: '/avatars/itachi_uchiha.png' },
  { name: 'Goku', url: '/avatars/goku.png' },
  { name: 'Vegeta', url: '/avatars/vegeta.png' },
  { name: 'Nezuko', url: '/avatars/nezuko_kamado.png' },
  { name: 'Zenitsu', url: '/avatars/zenitsu_agatsuma.png' },
  { name: 'Inosuke', url: '/avatars/inosuke_hashibira.png' },
  { name: 'Eren', url: '/avatars/eren_yeager.png' },
  { name: 'Mikasa', url: '/avatars/mikasa_ackerman.png' },
  { name: 'Saitama', url: '/avatars/saitama.png' },
  { name: 'Deku', url: '/avatars/izuku_midoriya.png' },
  { name: 'Bakugo', url: '/avatars/katsuki_bakugo.png' },
  { name: 'Killua', url: '/avatars/killua_zoldyck.png' },
  { name: 'Gon', url: '/avatars/gon_freecss.png' },
  { name: 'Kaneki', url: '/avatars/ken_kaneki.png' },
  { name: 'Light', url: '/avatars/light_yagami.png' },
  { name: 'L', url: '/avatars/l_lawliet.png' },
];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAvatar(localStorage.getItem('user-avatar'));
    }
  }, []);

  const selectAvatar = (url: string) => {
    localStorage.setItem('user-avatar', url);
    setAvatar(url);
    window.dispatchEvent(new Event('avatar-changed'));
  };

  const removeAvatar = () => {
    localStorage.removeItem('user-avatar');
    setAvatar(null);
    window.dispatchEvent(new Event('avatar-changed'));
  };

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin" />
          <p className="text-[#555] text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-28 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#111118] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-[#333]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Sign in to view your profile</h2>
          <p className="text-[#666] text-sm mb-8">Track your watch history and manage your account.</p>
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold rounded-[16px] shadow-[0_0_24px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] hover:scale-[1.02] transition-all">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Settings, label: 'Settings', href: '/settings', desc: 'Preferences and app settings', color: '#8B5CF6' },
    { icon: Shield, label: 'Privacy Policy', href: '/privacy', desc: 'Our data and privacy policy', color: '#EC4899' },
  ];

  const firstLetter = user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0]?.toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-16">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[640px] mx-auto px-6 relative space-y-6">
        
        {/* Profile Card */}
        <div className="bg-[#111118] border border-white/[0.08] rounded-[28px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 blur-2xl opacity-60 pointer-events-none" />

          <div className="relative flex items-center gap-6">
            {avatar ? (
              <div className="relative group">
                <img
                  src={avatar}
                  alt={user.displayName || 'Avatar'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.4)]"
                />
                <button
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5252] text-white flex items-center justify-center text-[10px] font-black hover:bg-[#FF3333] transition-colors"
                  title="Remove Avatar"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-black text-2xl shadow-[0_0_24px_rgba(139,92,246,0.4)] shrink-0">
                {firstLetter}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-white">{user.displayName || 'Anime Fan'}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-[#777]">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </div>
              <span className="mt-3 inline-block px-3 py-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#A78BFA] text-xs font-bold rounded-full">
                ✦ AniStreamBD Member
              </span>
            </div>
          </div>
        </div>

        {/* Anime Avatar Picker Card */}
        <div className="bg-[#111118] border border-white/[0.08] rounded-[28px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              Choose Anime Avatar
              <span className="text-[10px] font-normal text-[#555] normal-case tracking-normal">({ANIME_AVATARS.length} characters)</span>
            </h2>
            {avatar && (
              <button onClick={removeAvatar} className="text-xs text-[#FF5252] hover:underline font-bold">
                Reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {ANIME_AVATARS.map((char) => {
              const isSelected = avatar === char.url;
              return (
                <button
                  key={char.name}
                  onClick={() => selectAvatar(char.url)}
                  className={`flex flex-col items-center gap-2 group transition-all duration-200 ${
                    isSelected ? 'scale-95' : 'hover:scale-105'
                  }`}
                  title={char.name}
                >
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-[#8B5CF6] shadow-[0_0_18px_rgba(139,92,246,0.7)]'
                      : 'border-transparent group-hover:border-white/40'
                  }`}>
                    <img
                      src={char.url}
                      alt={char.name}
                      className="w-full h-full object-cover bg-[#0a0a0f]"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#8B5CF6]/25 flex items-center justify-center">
                        <span className="text-white text-base font-black drop-shadow">✓</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold text-center leading-tight truncate w-full px-1 transition-colors ${
                    isSelected ? 'text-[#A78BFA]' : 'text-[#555] group-hover:text-white'
                  }`}>
                    {char.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Watching', value: '—' },
            { label: 'Completed', value: '—' },
            { label: 'Favorites', value: '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-xs text-[#555] mt-1 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-4 p-5 bg-[#111118] border border-white/[0.06] hover:border-[#8B5CF6]/30 rounded-[20px] transition-all hover:-translate-y-0.5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors">{item.label}</div>
                <div className="text-xs text-[#555]">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#FF5252]/10 hover:bg-[#FF5252]/20 border border-[#FF5252]/20 hover:border-[#FF5252]/40 text-[#FF5252] font-bold rounded-[16px] transition-all text-sm">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
