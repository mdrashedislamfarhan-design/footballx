'use client';
import { useState } from 'react';
import { Send, Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] pt-28 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Message Sent!</h2>
          <p className="text-[#B3B3B3] text-sm">We&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-16">
      <div className="max-w-[700px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3 mb-10">
          <MessageSquare className="w-6 h-6 text-[#B3B3B3]" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Contact Us</h1>
        </div>
        <div className="bg-[#101010] border border-white/[0.08] rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider block mb-2">Name</label>
                <input type="text" required placeholder="Your full name" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-4 bg-[#181818] border border-white/[0.08] focus:border-[#00E676] rounded-[16px] text-sm text-white placeholder-[#777777] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider block mb-2">Email</label>
                <input type="email" required placeholder="your@email.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-4 bg-[#181818] border border-white/[0.08] focus:border-[#00E676] rounded-[16px] text-sm text-white placeholder-[#777777] outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider block mb-2">Subject</label>
              <input type="text" required placeholder="How can we help?" value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})}
                className="w-full px-4 py-4 bg-[#181818] border border-white/[0.08] focus:border-[#00E676] rounded-[16px] text-sm text-white placeholder-[#777777] outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider block mb-2">Message</label>
              <textarea required rows={6} placeholder="Your message..." value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-4 bg-[#181818] border border-white/[0.08] focus:border-[#00E676] rounded-[16px] text-sm text-white placeholder-[#777777] outline-none transition-colors resize-none" />
            </div>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#00E676] hover:bg-[#00C853] text-black font-bold rounded-[16px] transition-all shadow-[0_0_24px_rgba(0,230,118,0.25)] hover:scale-[1.02]">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
          <div className="flex items-center gap-2 mt-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
            <Mail className="w-4 h-4 text-[#777777]" />
            <span className="text-xs text-[#777777]">Or email us directly at <span className="text-[#00E676] font-bold">support@footballx.app</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
