import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'FootballX terms of service — your agreement for using the platform.',
};

const sections = [
  { title: '1. Acceptance of Terms', content: `By accessing or using FootballX, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use of the platform immediately.` },
  { title: '2. Use of the Platform', content: `FootballX grants you a non-exclusive, revocable, personal license to use the platform for personal, non-commercial purposes. You agree not to misuse the platform, attempt to gain unauthorized access, or interfere with the platform's functionality.` },
  { title: '3. User Accounts', content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. FootballX is not liable for losses arising from unauthorized account access.` },
  { title: '4. Content & Intellectual Property', content: `All content on FootballX including logos, designs, text, and software is the property of FootballX or its licensors. You may not reproduce, distribute, or create derivative works without explicit written permission.` },
  { title: '5. Disclaimer of Warranties', content: `FootballX is provided "as is" without warranties of any kind. We do not guarantee that the platform will be uninterrupted, error-free, or free from viruses. We disclaim all liability for damages arising from use of the platform.` },
  { title: '6. Termination', content: `We reserve the right to suspend or terminate your account at our discretion if you violate these terms or engage in conduct harmful to other users or the platform.` },
  { title: '7. Contact', content: `For questions regarding these Terms, contact us at legal@footballx.app.` },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">Terms of Service</h1>
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
