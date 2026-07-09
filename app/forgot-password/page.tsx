'use client';
import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { resetPassword } from '@/services/firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', '').replace(/\(.*\)\.?/, '').trim());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00E676]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00E676] flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_20px_rgba(0,230,118,0.3)]">X</div>
            <span className="text-2xl font-extrabold tracking-wider text-white">Football<span className="text-[#00E676]">X</span></span>
          </Link>
        </div>
        <div className="bg-[#101010] border border-white/[0.08] rounded-[24px] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-extrabold text-white mb-3">Check your email</h2>
              <p className="text-sm text-[#B3B3B3] mb-6">We sent a password reset link to <span className="text-[#00E676] font-bold">{email}</span></p>
              <Link href="/login" className="text-sm text-[#00E676] hover:text-[#00C853] font-bold">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-white mb-2">Reset Password</h2>
              <p className="text-sm text-[#777777] mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              {error && <div className="mb-4 p-3 bg-[#FF5252]/10 border border-[#FF5252]/30 rounded-2xl text-xs text-[#FF5252] font-semibold">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
                  <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-[#181818] border border-white/[0.08] focus:border-[#00E676] rounded-[16px] text-sm text-white placeholder-[#777777] outline-none transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#00E676] hover:bg-[#00C853] text-black font-bold rounded-[16px] transition-all shadow-[0_0_24px_rgba(0,230,118,0.25)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                  {loading ? 'Sending...' : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
              <p className="text-center text-xs text-[#777777] mt-6">
                <Link href="/login" className="text-[#00E676] font-bold hover:text-[#00C853]">← Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
