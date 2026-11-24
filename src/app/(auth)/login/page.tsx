'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Bus, ChevronLeft, ChevronRight, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const { loginWithDemo } = useAuth();
  const router = useRouter();

  const handleQuickDemo = () => {
    loginWithDemo('student');
    toast.success('Demo Mode Active');
    router.push('/student/dashboard');
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
          <span className="font-heading font-semibold text-[15px] text-[#1C1C1E]">Portals</span>
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-5">
          <div className="apple-card rounded-[28px] p-6 text-center space-y-3">
            <div className="w-20 h-20 mx-auto flex items-center justify-center">
              <img
                src="/images/splash-bus.png"
                alt="AITS Transit"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
              Choose Portal
            </h1>
            <p className="text-[13px] text-[#8E8E93]">Select your role in AITS Transit</p>
          </div>

          <div className="apple-card rounded-[22px] overflow-hidden divide-y divide-black/[0.06]">
            <button
              onClick={() => router.push('/student')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F2F2F7]/60 transition-colors motion-press cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#007AFF]/10 p-1.5 flex items-center justify-center">
                  <img
                    src="/images/icon-student.png"
                    alt="Student"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-[15px] font-semibold text-[#1C1C1E]">Student</h2>
                  <p className="text-[12px] text-[#8E8E93]">Live bus map & boarding pass</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
            </button>

            <button
              onClick={() => router.push('/driver')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F2F2F7]/60 transition-colors motion-press cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FF9500]/12 p-1.5 flex items-center justify-center">
                  <img
                    src="/images/icon-driver.png"
                    alt="Driver"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-[15px] font-semibold text-[#1C1C1E]">Driver</h2>
                  <p className="text-[12px] text-[#8E8E93]">Start & end ride GPS broadcast</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
            </button>

            <button
              onClick={() => router.push('/admin')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F2F2F7]/60 transition-colors motion-press cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#5856D6]/12 p-1.5 flex items-center justify-center">
                  <img
                    src="/images/icon-school.png"
                    alt="Admin"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-[15px] font-semibold text-[#1C1C1E]">Admin</h2>
                  <p className="text-[12px] text-[#8E8E93]">Fleet command & rosters</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
            </button>

            <button
              onClick={handleQuickDemo}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F2F2F7]/60 transition-colors motion-press cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#34C759]/12 text-[#248A3D] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-[15px] font-semibold text-[#1C1C1E]">
                    Instant Demo
                  </h2>
                  <p className="text-[12px] text-[#8E8E93]">Preview Student Dashboard</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
            </button>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center">
        <p className="text-[11px] text-[#8E8E93] font-medium">AITS Campus Transit</p>
      </footer>
    </div>
  );
}
