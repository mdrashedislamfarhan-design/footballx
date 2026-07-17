import type { Metadata } from 'next';
import { Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notifications — AniStreamBD',
  description: 'Your anime alerts, new episode notifications, and updates.',
};

const notifications = [
  { id: '1', icon: '🔴', title: 'New Episode: Demon Slayer S4 E12', body: 'A new episode just dropped — watch it now!', time: '5 min ago', read: false },
  { id: '2', icon: '⚡', title: 'Attack on Titan Final Season available', body: 'The complete final arc is now available in Sub & Dub.', time: '1h ago', read: false },
  { id: '3', icon: '🌸', title: 'New Season Announced: Chainsaw Man S2', body: 'Production confirmed! Expected release: Fall 2025.', time: '3h ago', read: true },
  { id: '4', icon: '🎌', title: 'Sub now available: Jujutsu Kaisen S3 E8', body: 'Japanese sub version has been added to Main Server 1.', time: '6h ago', read: true },
  { id: '5', icon: '🇺🇸', title: 'Dub release: Solo Leveling E10', body: 'English dub is now live on Main Server 2.', time: '1 day ago', read: true },
  { id: '6', icon: '🇮🇳', title: 'Hindi Dub: One Piece (Episodes 1-50)', body: 'First 50 episodes of One Piece now available in Hindi Dub.', time: '2 days ago', read: true },
];

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-28 pb-16">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Notifications</h1>
              <p className="text-xs text-[#555] mt-0.5">Anime updates and alerts</p>
            </div>
          </div>
          {unread > 0 && (
            <span className="text-xs font-black text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-3 py-1.5 rounded-xl">
              {unread} New
            </span>
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-5 rounded-[20px] border transition-all ${
                !notif.read
                  ? 'bg-[#111118] border-[#8B5CF6]/20 shadow-[0_0_20px_rgba(139,92,246,0.05)]'
                  : 'bg-[#0e0e14] border-white/[0.05]'
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                !notif.read
                  ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/20'
                  : 'bg-white/[0.03] border border-white/[0.08]'
              }`}>
                {notif.icon}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-sm font-bold leading-snug ${!notif.read ? 'text-white' : 'text-[#999]'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-[#444] font-semibold shrink-0 mt-0.5">{notif.time}</span>
                </div>
                <p className="text-xs text-[#666] mt-1 leading-relaxed">{notif.body}</p>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>

        {/* Empty message (hidden since we have data) */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#111118] border border-white/[0.06] flex items-center justify-center mb-6">
              <Bell className="w-9 h-9 text-[#333]" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">No Notifications Yet</h2>
            <p className="text-[#555] text-sm max-w-sm">
              When new episodes drop or announcements are made, they&apos;ll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
