import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FootballX privacy policy — how we collect, use and protect your data.',
};

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This includes your name, email address, and preferences. We may also collect usage data, device information, and analytics to improve the platform experience.`
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve FootballX, send notifications you have opted into, personalize your experience with relevant clubs and leagues, and ensure the security and integrity of the platform.`
  },
  {
    title: '3. Data Sharing',
    content: `We do not sell your personal information. We may share data with trusted service providers who help us operate the platform (such as Firebase by Google), always under strict data protection agreements. We may disclose information when required by law.`
  },
  {
    title: '4. Data Retention',
    content: `We retain your account data for as long as your account is active. You may request account deletion at any time by contacting support@footballx.app. Upon deletion, your data will be permanently removed within 30 days.`
  },
  {
    title: '5. Cookies',
    content: `FootballX uses cookies and similar technologies to maintain your session, remember your preferences, and analyze platform performance. You may disable cookies in your browser settings, though some features may be affected.`
  },
  {
    title: '6. Security',
    content: `We implement industry-standard security measures including Firebase Authentication, encrypted data transmission, and secure API practices. However, no method of internet transmission is 100% secure, and we encourage you to protect your account credentials.`
  },
  {
    title: '7. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at support@footballx.app.`
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-xs text-[#777777] font-semibold">Last updated: July 2026</p>
        </div>
        <div className="space-y-8">
          {sections.map(s => (
            <div key={s.title} className="bg-[#101010] border border-white/[0.08] rounded-[20px] p-6">
              <h2 className="text-base font-extrabold text-white mb-3">{s.title}</h2>
              <p className="text-sm text-[#B3B3B3] leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
