'use client';
import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#EC4899]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <img
              src="/icon.png"
              alt="AniStreamBD"
              className="w-10 h-10 rounded-xl object-cover shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            />
            <span className="text-2xl font-black">
              <span className="text-white">AniStream</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">BD</span>
            </span>
          </Link>
        </div>

        <div className="bg-[#111118] border border-white/[0.08] rounded-[24px] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-white mb-3">Check your email</h2>
              <p className="text-sm text-[#B3B3B3] mb-6">
                We sent a password reset link to <span className="text-[#8B5CF6] font-bold">{email}</span>
              </p>
              <Link href="/login" className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] font-bold">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-sm text-[#555] mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              {error && (
                <div className="mb-4 p-3 bg-[#FF5252]/10 border border-[#FF5252]/30 rounded-2xl text-xs text-[#FF5252] font-semibold">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-[#0e0e14] border border-white/[0.08] focus:border-[#8B5CF6] rounded-[16px] text-sm text-white placeholder-[#555] outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-bold rounded-[16px] transition-all shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Sending...' : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
              <p className="text-center text-xs text-[#555] mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-[#8B5CF6] hover:text-[#A78BFA] font-bold">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
