import type { Metadata } from 'next';
import { Bell, Radio, Calendar, Trophy, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Your match alerts and latest football notifications.',
};

const notifications = [
  { id: '1', type: 'goal', icon: '⚽', title: 'GOAL! Arsenal 2-1 Man City', body: 'Martinelli scores in the 58th minute', time: '2 min ago', read: false },
  { id: '2', type: 'live', icon: '🔴', title: 'El Clásico has kicked off', body: 'Barcelona vs Real Madrid is now live', time: '20 min ago', read: false },
  { id: '3', type: 'schedule', icon: '📅', title: 'Match reminder', body: 'Chelsea vs Liverpool kicks off in 2 hours', time: '1h ago', read: true },
  { id: '4', type: 'result', icon: '✅', title: 'Full-time: PSG 3-2 Dortmund', body: 'Champions League matchday 6 result', time: '3h ago', read: true },
  { id: '5', type: 'trophy', icon: '🏆', title: 'New competition starts', body: 'Premier League matchday 22 begins tomorrow', time: '1 day ago', read: true },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-16">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#B3B3B3]" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Notifications</h1>
          </div>
          <span className="text-xs font-bold text-[#00E676] bg-[#00E676]/10 border border-[#00E676]/30 px-3 py-1 rounded-full">
            {notifications.filter(n => !n.read).length} New
          </span>
        </div>

        <div className="space-y-3">
          {notifications.map(notif => (
            <div key={notif.id}
              className={`flex items-start gap-4 p-5 rounded-[20px] border transition-all ${!notif.read ? 'bg-[#101010] border-[#00E676]/20' : 'bg-[#101010]/60 border-white/[0.05]'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${!notif.read ? 'bg-[#00E676]/10 border border-[#00E676]/20' : 'bg-white/[0.03] border border-white/[0.08]'}`}>
                {notif.icon}
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <h3 className={`text-sm font-bold ${!notif.read ? 'text-white' : 'text-[#B3B3B3]'}`}>{notif.title}</h3>
                  <span className="text-[10px] text-[#777777] font-semibold ml-4 shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-[#777777] mt-1">{notif.body}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#00E676] shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
