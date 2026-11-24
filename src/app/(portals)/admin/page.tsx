'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { AlertCircle, ChevronLeft, Mail, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const { login, loginWithDemo } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminId, setAdminId] = useState('admin@aitsrajampet.ac.in');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      setError('');
      await login('admin');
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to log in.');
      setIsLoggingIn(false);
    }
  };

  const handleDemo = () => {
    loginWithDemo('admin');
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] flex flex-col justify-between font-sans">
      <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06]">
        <div className="max-w-md mx-auto px-3 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-0.5 text-[15px] font-medium text-[#007AFF] hover:opacity-75 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            <span>Home</span>
          </Link>
          <span className="font-heading font-semibold text-[15px] text-[#1C1C1E]">Admin</span>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-[400px] space-y-5">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#007AFF]/10 p-3 flex items-center justify-center">
              <img
                src="/images/icon-school.png"
                alt="Campus Admin"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
              Campus Admin
            </h1>
            <p className="text-[13px] text-[#8E8E93]">Fleet telemetry & broadcast command</p>
          </div>

          {error && (
            <div className="bg-[#FF3B30]/12 text-[#D70015] p-3 rounded-[14px] text-[12px] font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="apple-card rounded-[16px] overflow-hidden divide-y divide-black/[0.06]">
            <div className="flex items-center px-4 h-12 gap-3">
              <Mail className="w-4 h-4 text-[#8E8E93] shrink-0" />
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Admin Email"
                className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
              />
            </div>
            <div className="flex items-center px-4 h-12 gap-3">
              <Lock className="w-4 h-4 text-[#8E8E93] shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[16px] rounded-[14px] shadow-xs flex items-center justify-center motion-press cursor-pointer"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={handleDemo}
              className="w-full h-11 bg-white text-[#007AFF] font-heading font-semibold text-[14px] rounded-[14px] apple-card flex items-center justify-center gap-1.5 motion-press cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Access</span>
            </button>
          </div>
        </form>
      </main>

      <footer className="py-3 text-center">
        <p className="text-[11px] text-[#8E8E93] font-medium">AITS Campus Transit • Admin</p>
      </footer>
    </div>
  );
}
