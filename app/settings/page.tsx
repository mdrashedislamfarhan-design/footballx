'use client';
import { useState } from 'react';
import { Settings, Bell, Globe, Moon, Shield, ChevronRight, Tv2 } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [newEpisodeAlerts, setNewEpisodeAlerts] = useState(true);
  const [dubAlerts, setDubAlerts] = useState(false);
  const [language, setLanguage] = useState('en');
  const [defaultLang, setDefaultLang] = useState('sub');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'bg-[#222]'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-16">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[640px] mx-auto px-6 relative">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Settings</h1>
            <p className="text-xs text-[#555] mt-0.5">Manage your AniStream preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-white/[0.06]">
              <Bell className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Notifications</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {[
                { label: 'Push Notifications', desc: 'Receive anime news and updates', value: notifications, onChange: setNotifications },
                { label: 'New Episode Alerts', desc: 'Get notified when new episodes drop', value: newEpisodeAlerts, onChange: setNewEpisodeAlerts },
                { label: 'Dub Release Alerts', desc: 'Alert when dub becomes available', value: dubAlerts, onChange: setDubAlerts },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-5">
                  <div>
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-xs text-[#555] mt-0.5">{item.desc}</div>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>

          {/* Playback */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-white/[0.06]">
              <Tv2 className="w-4 h-4 text-[#EC4899]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Playback</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Default Language</div>
                  <div className="text-xs text-[#555] mt-0.5">Sub or Dub preference</div>
                </div>
                <div className="flex items-center gap-1 bg-[#0e0e14] p-1 rounded-xl border border-white/[0.04]">
                  {[
                    { id: 'sub', label: 'SUB' },
                    { id: 'dub', label: 'DUB' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setDefaultLang(opt.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                        defaultLang === opt.id
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                          : 'text-[#555] hover:text-white'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-white/[0.06]">
              <Globe className="w-4 h-4 text-[#10B981]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Language & Region</h2>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Interface Language</div>
                <div className="text-xs text-[#555] mt-0.5">App interface language</div>
              </div>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="bg-[#0e0e14] border border-white/[0.08] text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#8B5CF6]">
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
                <option value="ja">日本語</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-white/[0.06]">
              <Moon className="w-4 h-4 text-[#FFC107]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Appearance</h2>
            </div>
            <div className="p-5 flex gap-3">
              {['Dark Mode', 'System'].map(t => (
                <button key={t} className={`flex-1 py-3 text-xs font-bold rounded-[12px] border transition-all ${t === 'Dark Mode' ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#A78BFA]' : 'bg-white/[0.03] border-white/[0.06] text-[#555] hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-white/[0.06]">
              <Shield className="w-4 h-4 text-[#555]" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Legal</h2>
            </div>
            {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }].map(l => (
              <a key={l.href} href={l.href} className="flex items-center justify-between p-5 border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <span className="text-sm font-bold text-white">{l.label}</span>
                <ChevronRight className="w-4 h-4 text-[#555]" />
              </a>
            ))}
          </div>

          <div className="text-center text-xs text-[#333] font-semibold py-2">
            AniStream v1.0.0 • Made with ♥ for anime fans
          </div>
        </div>
      </div>
    </div>
  );
}
