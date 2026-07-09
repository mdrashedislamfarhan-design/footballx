'use client';
import { useState } from 'react';
import {
  BarChart2, Users, Radio, Calendar, Trophy, Bell, Settings,
  TrendingUp, Activity, Globe, Eye, Clock, ChevronUp, ArrowUpRight
} from 'lucide-react';

const STATS = [
  { label: 'Live Streams', value: '24', change: '+3', up: true, icon: Radio, color: '#00E676' },
  { label: 'Active Users', value: '14,892', change: '+18.2%', up: true, icon: Users, color: '#29B6F6' },
  { label: 'Matches Today', value: '47', change: '+5', up: true, icon: Calendar, color: '#FFC107' },
  { label: 'Page Views', value: '128K', change: '+24%', up: true, icon: Eye, color: '#AB47BC' },
];

const RECENT_ACTIVITY = [
  { action: 'New user registered', detail: 'user@email.com', time: '2 min ago', type: 'user' },
  { action: 'Live stream started', detail: 'Arsenal vs Man City', time: '8 min ago', type: 'stream' },
  { action: 'Match added', detail: 'Bayern vs Dortmund', time: '15 min ago', type: 'match' },
  { action: 'Notification sent', detail: 'Goal alert: PSG 1-0', time: '22 min ago', type: 'notif' },
  { action: 'New channel added', detail: 'Sky Sports News', time: '1h ago', type: 'channel' },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'streams', label: 'Streams', icon: Radio },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'leagues', label: 'Leagues', icon: Trophy },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#030303] flex">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0a0a] border-r border-white/[0.06] p-6 shrink-0 fixed left-0 top-0 bottom-0">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#00E676] flex items-center justify-center text-black font-black text-base">X</div>
          <span className="text-sm font-extrabold text-white">FootballX <span className="text-[#00E676]">Admin</span></span>
        </div>
        <nav className="space-y-1 flex-grow">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-bold transition-all text-left ${activeNav === item.id ? 'bg-[#00E676]/10 text-[#00E676]' : 'text-[#777777] hover:text-white hover:bg-white/[0.03]'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00E676]/20 flex items-center justify-center text-[#00E676] text-xs font-black">A</div>
            <div>
              <div className="text-xs font-bold text-white">Admin</div>
              <div className="text-[10px] text-[#777777]">admin@footballx.app</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-grow lg:ml-64 p-6 lg:p-8">
        <div className="max-w-[1200px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
              <p className="text-xs text-[#777777] mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E676]" />
              </span>
              <span className="text-xs text-[#00E676] font-bold">All systems live</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(stat => (
              <div key={stat.label} className="bg-[#101010] border border-white/[0.07] rounded-[20px] p-5 hover:border-white/[0.12] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>
                    <TrendingUp className="w-3 h-3" />{stat.change}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts + Activity row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Fake Chart */}
            <div className="bg-[#101010] border border-white/[0.07] rounded-[20px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-extrabold text-white">Traffic Overview</h2>
                <select className="bg-[#181818] border border-white/[0.07] text-[#B3B3B3] text-[10px] font-bold rounded-xl px-2 py-1.5 outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="flex items-end gap-2 h-32">
                {[40, 65, 45, 80, 90, 70, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg transition-all" style={{ height: `${h}%`, background: `linear-gradient(to top, #00E676, #00E67650)` }} />
                    <span className="text-[8px] text-[#777777]">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#101010] border border-white/[0.07] rounded-[20px] p-6">
              <h2 className="text-sm font-extrabold text-white mb-5">Recent Activity</h2>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#181818] border border-white/[0.06] flex items-center justify-center text-sm shrink-0">
                      {item.type === 'user' ? '👤' : item.type === 'stream' ? '📺' : item.type === 'match' ? '⚽' : item.type === 'notif' ? '🔔' : '📡'}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-xs font-bold text-white">{item.action}</div>
                      <div className="text-[10px] text-[#777777] mt-0.5">{item.detail}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#777777] shrink-0">
                      <Clock className="w-3 h-3" />{item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Streams Table */}
          <div className="bg-[#101010] border border-white/[0.07] rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
              <h2 className="text-sm font-extrabold text-white">Active Streams</h2>
              <span className="text-xs text-[#00E676] font-bold">24 Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['Channel', 'Status', 'Viewers', 'Uptime'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-[#777777] uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {['Sky Sports Premier League', 'BT Sport 1', 'beIN Sports HD', 'ESPN FC'].map((ch, i) => (
                    <tr key={ch} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-white">{ch}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#00E676]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" /> Online
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-bold text-[#B3B3B3]">{[1842, 934, 672, 521][i].toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-xs text-[#777777] font-semibold">{['4h 12m', '2h 38m', '1h 55m', '45m'][i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
